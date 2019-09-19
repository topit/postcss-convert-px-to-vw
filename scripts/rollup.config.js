import alias from 'rollup-plugin-alias'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import isWsl from 'is-wsl'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'
// import chalk from 'chalk'

import pkg from '../package.json'

// environment variable
const ENV = process.env.NODE_ENV // 打包环境 development | production

const DEV = 'development'
const PROD = 'production'

const lineToHump = name => name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase())

export default {
  input: 'src/index.js',
  output: [
    {
      // file: `lib/${pkg.name}${ENV === PROD ? '.min' : ''}.js`,
      file: `lib/${pkg.name}.js`,
      format: 'cjs',
      name: lineToHump(pkg.name),
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      '@src': '../src'
    }),
    // 环境变量，如需增加，请同步配置eslint globals
    replace({
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
      __ENV__: JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    eslint({
      formatter: require('eslint-formatter-friendly'),
      throwOnError: true
    }),
    // rollup 处理 npm 包
    resolve(),
    // es5 包转 es6 包
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    // prod 模式下会 压缩代码，移除警告，移除console.log
    ENV === PROD && terser({
      numWorkers: isWsl ? 1 : require('os').cpus() - 1,
      parse: {
        ecma: 8
      },
      compress: {
        pure_funcs: ['console.log'],
        drop_debugger: true,
      },
      output: {
        ascii_only: true,
      }
    }),
    // 显示打包后文件大小
    filesize({ showMinifiedSize: false })
  ],
  external: ['postcss', 'css']
}
