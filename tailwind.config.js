module.exports = {
  theme: {
    container: {
      center: true,
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1100px',
    },
    fontFamily: {
      sans: ['Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        blue: {
          '100': '#E2EDF8',
          '200': '#C5DCF1',
          '300': '#A8CAEA',
          '400': '#8BB9E3',
          '500': '#6FA8DC',
          '600': '#5886B0',
          '700': '#426484',
          '800': '#2C4358',
          '900': '#16212C',
        },
        red: {
          '100': '#FBEBEB',
          '200': '#F3C9C9',
          '300': '#E79493',
          '400': '#DB5F5D',
          '500': '#CF2A27',
          '600': '#A5211F',
          '700': '#7C1917',
          '800': '#52100F',
          '900': '#290807',
        },
        green: {
          '100': '#CEF4DA',
          '200': '#9DE9B6',
          '300': '#6CDE91',
          '400': '#3BD36D',
          '500': '#0AC849',
          '600': '#08A03A',
          '700': '#06782B',
          '800': '#04501D',
          '900': '#02280E',
        },
        footer: {
          bg: 'rgb(58, 65, 97)',
          color: '#c0c5da',
        },
        bluekiosk: '#4691DC',
        modalBackdrop: 'rgba(0,0,0,.6)',
      },
      height: {
        'form-control': '2.625rem',
        'form-control-lg': '3rem',
        'form-control-xl': '4.5rem',
      },
      borderRadius: {
        'form-control': '4px',
      },
    },
  },
  variants: {},
  plugins: [],
};
