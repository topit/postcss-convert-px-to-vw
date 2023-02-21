import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'postcss-convert-px-to-vw': './src/index.ts'
  },
  outDir: './lib',
  target: "node14",
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  skipNodeModulesBundle: true,
  dts: true,
  shims: true,
  format: ["cjs", "esm"],
  external: ['postcss']
})