import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import typescript from 'rollup-plugin-typescript2'
import { readDirSync, writeFileSync, dirHasSync, deletePathSync } from 'yhl-explorer-js'

import pkg from './package.json' assert { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

deletePathSync(path.resolve(pkg.main, '../'))
deletePathSync(path.resolve(pkg.module, '../'))

const srcPath = path.resolve(__dirname, './src')

writeFileSync(
  path.resolve(srcPath, './export.ts'),
  'export default Object.freeze({\n' +
    readDirSync(srcPath)
      .data.filter((name) => !['.DS_Store', 'modules'].includes(name) && dirHasSync(path.resolve(srcPath, name)).code === 200)
      .map((i) => `  ${i}: () => import('./${i}/${i}'),\n`)
      .join('') +
    `})`
)

export default [
  {
    input: path.resolve(srcPath, './index.ts'),
    output: [
      { dir: path.resolve(pkg.main, '../'), format: 'cjs', assetFileNames: '[name][extname]', chunkFileNames: '[name]/[name].js' },
      { dir: path.resolve(pkg.module, '../'), format: 'esm', assetFileNames: '[name][extname]', chunkFileNames: '[name]/[name].js' },
    ],
    plugins: [
      typescript({
        declaration: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        tsconfigOverride: { compilerOptions: { target: 'es5' }, include: ['src'] },
      }),
    ],
  },
]
