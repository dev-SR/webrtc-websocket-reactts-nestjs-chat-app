const colors = require('tailwindcss/colors');
const defaultConfig = require('tailwindcss/defaultConfig');

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.tsx', './src/**/*.ts'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter', defaultConfig.theme.fontFamily.sans],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      // gray: colors.gray,
      gray: {
        darkest: '#202225',
        dark: '#292A2F',
        DEFAULT: '#2F3136',
        semiDark: '#6F737A',
        light: '#BDBEC0',
        lighter: '#E4E6EB',
        lightest: '#FAFAFA',
      },
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      green: colors.green,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
