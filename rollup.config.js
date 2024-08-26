import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { readDirSync, writeFileSync, deletePathSync } from 'yhl-explorer-js'

import pkg from './package.json'

deletePathSync(path.resolve(pkg.main, '../'))
deletePathSync(path.resolve(pkg.module, '../'))

const srcPath = path.resolve(__dirname, './src')
const inputPath = path.resolve(srcPath, './index.ts')

const srcList = (() => {
  try {
    const { data } = readDirSync(srcPath)
    return data.filter((name) => !['index.ts', '.DS_Store', 'lazy', 'modules'].includes(name))
  } catch (error) {}
  return []
})()

const utilsConfigs = []

let indexStr = ''
for (let i = 0, l = srcList.length; i < l; i++) {
  const name = srcList[i]
  indexStr += `import ${name} from './${name}/${name}'\n`
  utilsConfigs.push({
    input: path.resolve(srcPath, name, name + '.ts'),
    output: [
      { dir: path.resolve(pkg.main, '../', name), format: 'cjs', exports: 'auto' },
      { dir: path.resolve(pkg.module, '../', name), format: 'esm', exports: 'auto' },
    ],
    plugins: [
      typescript({
        verbosity: 0,
        useTsconfigDeclarationDir: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: { compilerOptions: { target: 'es5' } },
      }),
    ],
  })
}
indexStr += `\nexport { ${srcList.join(', ')} }`
writeFileSync(inputPath, indexStr)

const lazyList = (() => {
  try {
    const { data } = readDirSync(path.resolve(__dirname, './src/lazy'))
    return data
  } catch (error) {}
  return []
})()
for (let i = 0, l = lazyList.length; i < l; i++) {
  const name = lazyList[i]

  utilsConfigs.push({
    input: path.resolve(srcPath, 'lazy', name, name + '.ts'),
    output: [
      { dir: path.resolve(pkg.main, '../', 'lazy', name), format: 'cjs', exports: 'auto' },
      { dir: path.resolve(pkg.module, '../', 'lazy', name), format: 'esm', exports: 'auto' },
    ],
    plugins: [
      typescript({
        verbosity: 0,
        useTsconfigDeclarationDir: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: { compilerOptions: { target: 'es5' } },
      }),
    ],
  })
}

export default [
  {
    input: inputPath,
    output: [
      { dir: path.resolve(pkg.main, '../'), format: 'cjs', exports: 'auto' },
      { dir: path.resolve(pkg.module, '../'), format: 'esm', exports: 'auto' },
    ],
    plugins: [
      typescript({
        verbosity: 0,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: { compilerOptions: { target: 'es5' }, include: ['src'] },
      }),
    ],
  },
  ...utilsConfigs,
]
