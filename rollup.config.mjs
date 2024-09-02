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

const srcList = readDirSync(srcPath).data.filter((name) => !['.DS_Store', 'modules'].includes(name) && dirHasSync(path.resolve(srcPath, name)).code === 200)

const writeList = srcList.map((i) => `export * from './${i}/${i}'\n`)
// const writeList = srcList.map((i) => `import ${i} from './${i}/${i}'\n`)
// writeList.push(`\nexport { ${srcList.join(', ')} }`)
// writeList.push(`\n\n`)
// writeList.push(...srcList.map((i) => `const ${i} = ()=>import('./${i}/${i}')\n`))
writeFileSync(inputPath, writeList.join(''))

export default [
  {
    input: inputPath,
    output: [
      {
        dir: path.resolve(pkg.main, '../'),
        format: 'cjs',
        splitChunks: true,
        chunkFileNames: 'modules/[name].js',
        entryFileNames: '[name].js',
      },
      {
        dir: path.resolve(pkg.module, '../'),
        format: 'esm',
        splitChunks: true,
        chunkFileNames: 'modules/[name].js',
        entryFileNames: '[name].js',
      },
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
