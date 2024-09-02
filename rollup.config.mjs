import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import typescript from 'rollup-plugin-typescript2'
import { readDirSync, writeFileSync, dirHasSync, deletePathSync } from 'yhl-explorer-js'

import pkg from './package.json' assert { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

deletePathSync(path.resolve(pkg.main, '../'))
deletePathSync(path.resolve(pkg.module, '../'))

const srcPath = path.resolve(__dirname, './src')
const inputPath = path.resolve(srcPath, './index.ts')

const srcList = readDirSync(srcPath).data.filter((name) => !['.DS_Store', 'vendors'].includes(name) && dirHasSync(path.resolve(srcPath, name)).code === 200)
writeFileSync(inputPath, srcList.map((i) => `export * from './${i}/${i}'\n`).join(''))

function manualChunks(chunkPath) {
  if (chunkPath.indexOf(srcPath) === 0) {
    const name = chunkPath.split('/').at(-2)
    return name + '/' + name
  }
  return 'vendors/' + chunkPath
}
export default {
  input: inputPath,
  output: [
    {
      dir: path.resolve(pkg.main, '../'),
      format: 'cjs',
      splitChunks: true,
      manualChunks,
      chunkFileNames: '[name].js',
      entryFileNames: '[name].js',
    },
    {
      dir: path.resolve(pkg.module, '../'),
      format: 'esm',
      splitChunks: true,
      manualChunks,
      chunkFileNames: '[name].js',
      entryFileNames: '[name].js',
    },
  ],
  plugins: [
    typescript({
      declaration: true,
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: { compilerOptions: { target: 'es5' } },
    }),
  ],
}
