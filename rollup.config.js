import svelte from 'rollup-plugin-svelte';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/svelte/main.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife'
  },
  plugins: [
    svelte({
      emitCss: true,

      // Extract CSS into a separate file (recommended).
      css(css) {
        console.log(css.code); // the concatenated CSS
        console.log(css.map); // a sourcemap

        // creates `main.css` and `main.css.map` — pass `false`
        // as the second argument if you don't want the sourcemap
        css.write('public/main.css', isProduction);
      },

      onwarn(warning, handler) {
        handler(warning);
      }
    })
  ]
};
