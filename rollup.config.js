import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { readDirSync, writeFileSync, deletePathSync } from 'yhl-explorer-js'

import pkg from './package.json'

deletePathSync(pkg.main)
deletePathSync(pkg.module)

const srcPath = path.resolve(__dirname, './src')
const inputPath = path.resolve(srcPath, './index.ts')

let { data: srcList } = readDirSync(srcPath)
srcList = srcList.filter((name) => !['index.ts', '.DS_Store'].includes(name))

const utilsConfigs = []

let indexStr = ''
for (let i = 0, l = srcList.length; i < l; i++) {
  const name = srcList[i]
  indexStr += `import ${name} from './${name}/${name}'\n`

  utilsConfigs.push({
    input: path.resolve(srcPath, name, name + '.ts'),
    output: [
      { file: path.resolve(pkg.main, '../', name, 'index.js'), format: 'cjs' },
      { file: path.resolve(pkg.module, '../', name, 'index.js'), format: 'esm' },
    ],
    plugins: [
      typescript({
        verbosity: 0,
        useTsconfigDeclarationDir: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: { target: 'es5' },
        },
      }),
    ],
  })
}
indexStr += `\nexport { ${srcList.join(', ')} }`
writeFileSync(inputPath, indexStr)

export default [
  {
    input: inputPath,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' },
    ],
    plugins: [
      typescript({
        verbosity: 0,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: { target: 'es5' },
          include: ['src'],
        },
      }),
    ],
  },
  ...utilsConfigs,
]
