import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { readDirSync, writeFileSync } from 'yhl-explorer-js'
import dts from 'rollup-plugin-dts'

import pkg from './package.json'

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
      { file: path.resolve(pkg.main, '../', name, name + '.js'), format: 'cjs' },
      { file: path.resolve(pkg.module, '../', name, name + '.js'), format: 'esm' },
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
// indexStr += `\nexport default { ${srcList.join(', ')} }`
writeFileSync(inputPath, indexStr)

console.log(utilsConfigs[2])
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
