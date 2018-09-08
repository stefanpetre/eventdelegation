import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    {
      file: 'dist/index.umd.js',
      name: 'eventdelegation',
      format: 'umd',
      globals: {
        'selector-set': 'SelectorSet'
      }
    }
  ],
  external: 'selector-set',
  plugins: [resolve(), babel()]
};