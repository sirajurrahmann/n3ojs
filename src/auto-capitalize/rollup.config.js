import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'cjs'
  },
  plugins: [typescript({
    sourceMap: false
  }), nodeResolve({
    browser: true,
  }), commonjs()]
};