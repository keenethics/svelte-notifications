import autoprefixer from 'autoprefixer';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import preprocess from 'svelte-preprocess';

import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;
const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, m => m.toUpperCase())
  .replace(/-\w/g, m => m[1].toUpperCase());

const config = production ? ({
  input: 'src/index.js',
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'umd',
      name,
    },
  ],
  plugins: [
    svelte({
      preprocess: preprocess({
        postcss: {
          plugins: [
            autoprefixer,
          ],
        },
      }),
      css: css => css.write('build/bundle.css'),
    }),
    resolve({
      browser: true,
    }),
    terser(),
  ],
}) : ({
  input: 'example/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  plugins: [
    svelte({
      dev: !production,
      css: css => css.write('public/bundle.css'),
    }),
    resolve(),
    commonjs(),
    livereload('public'),
  ],
});

export default config;
