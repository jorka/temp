const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const brandParam = 'brand';
const hasBrand = urlParams.has(brandParam);
const brandDomEl = document.querySelectorAll('[data-logo]');
const imgPath = 'assets/img/brands';

const BrandLoader = () => {
  if (hasBrand) {
    brandDomEl.forEach((el, index) => {
      const imageName = urlParams.get(brandParam);
      const image = new Image();
      image.src = `${imgPath}/logo-${imageName}.svg`;
      image.setAttribute('alt', imageName);

      image.addEventListener('load', () => {
        el.setAttribute('data-logo', brandParam);
        el.appendChild(image);
      });
    });
  }
};

export default BrandLoader;
