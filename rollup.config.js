import resolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import dts from 'rollup-plugin-dts';
import { name, homepage, version, dependencies, peerDependencies, unscopedName } from './package.json';

const umdConf = {
  format: 'umd',
  name: 'ForceGraph',
  globals: { react: 'React' },
  banner: `// Version ${version} ${name} - ${homepage}`
};

export default [
  {
    external: ['react'],
    input: 'src/index.js',
    output: [
      {
        ...umdConf,
        file: `dist/${unscopedName}.js`,
        sourcemap: true
      },
      { // minify
        ...umdConf,
        file: `dist/${unscopedName}.min.js`,
        plugins: [terser({
          output: { comments: '/Version/' }
        })]
      }
    ],
    plugins: [
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }), // To fool React in the browser
      babel({ exclude: '**/node_modules/**' }),
      resolve(),
      commonJs()
    ]
  },
  { // commonJs and ES modules
    input: 'src/index.js',
    output: [
      {
        format: 'cjs',
        file: `dist/${unscopedName}.common.js`,
        exports: 'auto'
      },
      {
        format: 'es',
        file: `dist/${unscopedName}.module.js`
      }
    ],
    external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
    plugins: [
      babel()
    ]
  },
  { // expose TS declarations
    input: 'src/index.d.ts',
    output: [{
      file: `dist/${unscopedName}.d.ts`,
      format: 'es'
    }],
    plugins: [dts()]
  }
];