import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import summary from "rollup-plugin-summary";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { babel } from "@rollup/plugin-babel";

export default {
  input: process.env.NODE_ENV === "development" ? "src/_sample.ts" : "src/index.ts",
  output: {
    dir: "build",
    format: "cjs",
  },
  plugins: [
    typescript({
      sourceMap: false,
    }),
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    replace({ "Reflect.decorate": "undefined", preventAssignment: true }),
    resolve(),
    babel({
      babelHelpers: "bundled",
      exclude: ["node_modules/**" , process.env.NODE_ENV === "development" ? null : "src/_sample.ts"].filter(Boolean),
      include: [
        "src/**",
        "node_modules/lit/**",
        "node_modules/lit-element/**",
        "node_modules/lit-html/**",
      ],
    }),
    terser({
      ecma: 2017,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    summary(),
  ],
};
