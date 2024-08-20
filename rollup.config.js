import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { readDirSync, writeFileSync, deletePathSync } from 'yhl-explorer-js'

import pkg from './package.json'

deletePathSync(path.resolve(pkg.main, '../'))
deletePathSync(path.resolve(pkg.module, '../'))

function getRollupConfig({ input, output }) {
  return {
    input,
    output: [
      { file: path.resolve(pkg.main, ...output), format: 'cjs', exports: 'auto' },
      { file: path.resolve(pkg.module, ...output), format: 'esm', exports: 'auto' },
    ],
    plugins: [
      typescript({
        verbosity: 0,
        useTsconfigDeclarationDir: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        tsconfigOverride: { compilerOptions: { target: 'es5' } },
      }),
    ],
    external: (id) => !/^(src\/.*)/.test(id) && !id.startsWith('.'),
  }
}

const srcPath = path.resolve(__dirname, './src')
const inputPath = path.resolve(srcPath, './index.ts')

let { data: srcList } = readDirSync(srcPath)
srcList = srcList.filter((name) => !['index.ts', '.DS_Store', 'lazy'].includes(name))

const utilsConfigs = []

let indexStr = ''
for (let i = 0, l = srcList.length; i < l; i++) {
  const name = srcList[i]
  indexStr += `import ${name} from './${name}/${name}'\n`
  utilsConfigs.push(
    getRollupConfig({
      input: path.resolve(srcPath, name, name + '.ts'),
      output: () => ['../', name, 'index.js'],
    })
  )
}
indexStr += `\nexport { ${srcList.join(', ')} }`
writeFileSync(inputPath, indexStr)

const { data: lazyList } = readDirSync(path.resolve(__dirname, './src/lazy'))
for (let i = 0, l = lazyList.length; i < l; i++) {
  const name = lazyList[i]

  utilsConfigs.push(
    getRollupConfig({
      input: path.resolve(srcPath, 'lazy', name, name + '.ts'),
      output: () => ['../', 'lazy', name, 'index.js'],
    })
  )
}

export default [getRollupConfig({ input: inputPath, output: () => [] }), ...utilsConfigs]
