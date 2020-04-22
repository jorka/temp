const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const browserSync = require('browser-sync');
const buffer = require('vinyl-buffer');
const data = require('gulp-data');
const del = require('del');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const newer = require('gulp-newer');
const postcss = require('gulp-postcss');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');
const terser = require('gulp-terser');
const webp = require('gulp-webp');
const twig = require('gulp-twig');
const assign = require('lodash.assign');
const log = require('gulplog');
const cond = require('gulp-cond');
const cssnano = require('cssnano');
const index = require('gulp-index');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
require('dotenv').config();
const server = browserSync.create();

/* 
----------------------- Get NODE_ENV --------------------------
*/
const env = process.env.NODE_ENV || 'development';

/* 
----------------------- Confgure Paths from .env --------------------------
*/
const path = {
  baseUrl: '.',
  src: 'src',
  dist: env === 'production' ? 'dist' : 'build',
  assets: 'assets',
  css: 'css',
  scss: 'scss',
  js: 'js',
  images: 'img',
  sprite: 'sprite',
};

/* 
----------------------- HTML --------------------------
*/

const html = () => {
  return gulp
    .src(`${path.baseUrl}/${path.src}/*.twig`)
    .pipe(
      data(function() {
        return require(`${path.baseUrl}/${path.src}/data.json`);
      }),
    )
    .pipe(twig())
    .on('error', function(err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(path.dist));
};

/* 
----------------------- CSS --------------------------
*/

const css = () => {
  return gulp
    .src(`${path.baseUrl}/${path.src}/${path.assets}/${path.scss}/styles.scss`)
    .pipe(cond(env === 'development', sourcemaps.init()))
    .pipe(
      sass({
        includePaths: [
          `${path.baseUrl}/${path.src}/${path.assets}/${path.scss}/**/*.scss`,
          './node_modules/',
        ],
      }),
    )
    .on('error', sass.logError)
    .pipe(
      postcss([
        autoprefixer(),
        cssnano({ discardComments: { removeAll: true } }),
      ]),
    )
    .pipe(cond(env === 'development', sourcemaps.write('./')))
    .pipe(gulp.dest(`${path.baseUrl}/${path.dist}/${path.assets}/${path.css}`))
    .pipe(server.stream());
};

/* 
----------------------- JS --------------------------
*/

const customOpts = {
    entries: [`${path.baseUrl}/${path.src}/${path.assets}/${path.js}/app.js`],
    debug: true,
  },
  opts = assign({}, watchify.args, customOpts),
  b = watchify(browserify(opts));

b.transform(babelify);

b.on('update', js);
b.on('log', log.info);

function js() {
  return b
    .bundle()
    .on('error', log.error.bind(log, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(cond(env === 'development', sourcemaps.init({ loadMaps: true })))
    .pipe(terser())
    .pipe(gulp.dest(`${path.baseUrl}/${path.dist}/${path.assets}/${path.js}`))
    .pipe(server.stream());
}

/* 
----------------------- Images --------------------------
*/
const images = () => {
  return gulp
    .src(`${path.baseUrl}/${path.src}/${path.assets}/${path.images}/**/*.*`, {
      allowEmpty: true,
    })
    .pipe(newer(`${path.baseUrl}/${path.dist}/${path.assets}/${path.images}`))
    .pipe(
      imagemin([
        imageminGifsicle(),
        imageminMozjpeg({ quality: 90 }),
        imageminPngquant({ quality: [0.5, 0.8] }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true,
            },
          ],
        }),
      ]),
    )
    .pipe(
      gulp.dest(`${path.baseUrl}/${path.dist}/${path.assets}/${path.images}`),
    );
};

/* 
----------------------- Images to webP --------------------------
*/
const webpConvert = () => {
  gulp
    .src(
      `${path.baseUrl}/${path.src}/${path.assets}/${path.images}/**/*.{jpg,png}`,
      { allowEmpty: true },
    )
    .pipe(webp())
    .pipe(
      gulp.dest(`${path.baseUrl}/${path.dist}/${path.assets}/${path.images}`),
    );

  return Promise.resolve('DONE');
};

/* 
----------------------- SVG Sprites --------------------------
*/
const sprite = () => {
  return gulp
    .src(
      `${path.baseUrl}/${path.src}/${path.assets}/${path.images}/${path.sprite}/*.svg`,
      { allowEmpty: true },
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: '',
            sprite: 'sprite.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [{ removeAttrs: { attrs: ['fill'] } }],
              },
            },
          ],
        },
      }),
    )
    .pipe(
      gulp.dest(`${path.baseUrl}/${path.dist}/${path.assets}/${path.images}`),
    );
};

/* 
----------------------- Delete assets --------------------------
*/
const clean = () => {
  return del(`${path.baseUrl}/${path.dist}/**/*`);
};

/* 
----------------------- Server --------------------------
*/

/* BrowserSync */
const live = done => {
  server.init({
    server: {
      baseDir: `${path.baseUrl}/${path.dist}/`,
    },
    port: 3000,
  });
  done();
};

// BrowserSync Reload
const liveReload = done => {
  server.reload();
  done();
};

/* 
----------------------- Copy other things like manifest and browserconfig --------------------------
*/

const copy = done => {
  gulp
    .src(`${path.baseUrl}/${path.src}/*.{json,xml}`)
    .pipe(gulp.dest(`${path.baseUrl}/${path.dist}`));
  done();
};

/*
----------------------- Make a list of al templates --------------------------
*/
const htmlList = () => {
  return gulp
    .src(`${path.baseUrl}/${path.dist}/*.html`)
    .pipe(
      index({
        relativePath: `${path.baseUrl}/${path.dist}`,
        outputFile: 'list.html',
        title: '',
        'section-heading-template': heading => '',
      }),
    )
    .pipe(gulp.dest(`${path.baseUrl}/${path.dist}`));
};

/* 
----------------------- Watch --------------------------
*/
const watch = () => {
  gulp.watch(
    `${path.baseUrl}/${path.src}/${path.assets}/${path.scss}/**/*.scss`,
    css,
  );
  gulp.watch(
    `${path.baseUrl}/${path.src}/${path.assets}/${path.js}/**/*.js`,
    js,
  );
  gulp.watch(
    `${path.baseUrl}/${path.src}/**/*.twig`,
    gulp.series(html, liveReload),
  );
  gulp.watch(
    `${path.baseUrl}/${path.src}/${path.assets}/${path.images}/**/*.*`,
    gulp.series(images, webpConvert, sprite),
  );
  gulp.watch(`${path.baseUrl}/${path.src}/*.{json,xml}`, copy);
};

/* 
----------------------- Group Tasks --------------------------
*/

const build = gulp.series(
  clean,
  gulp.parallel(css, js, html, images, webpConvert, sprite, copy),
);
const serve = gulp.parallel(gulp.series(build, watch), live);

/* 
----------------------- Export --------------------------
*/
exports.css = css;
exports.js = js;
exports.images = images;
exports.webp = webpConvert;
exports.sprite = sprite;
exports.html = html;
exports.clean = clean;
exports.copy = copy;
exports.build = build;
exports.serve = serve;
exports.watch = watch;
exports.default = serve;
exports.list = htmlList;
