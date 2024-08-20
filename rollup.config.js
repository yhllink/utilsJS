import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { readDirSync, writeFileSync, readFileSync, deletePathSync } from 'yhl-explorer-js'

import pkg from './package.json'

deletePathSync(path.resolve(pkg.main, '../'))
deletePathSync(path.resolve(pkg.module, '../'))

const srcPath = path.resolve(__dirname, './src')
const inputPath = path.resolve(srcPath, './index.ts')

let { data: srcList } = readDirSync(srcPath)
srcList = srcList.filter((name) => !['index.ts', '.DS_Store', 'lazy'].includes(name))

const utilsConfigs = []

let indexStr = ''
for (let i = 0, l = srcList.length; i < l; i++) {
  const name = srcList[i]
  indexStr += `import ${name} from './${name}/${name}'\n`
  utilsConfigs.push({
    input: path.resolve(srcPath, name, name + '.ts'),
    output: [
      { file: path.resolve(pkg.main, '../', name, 'index.js'), format: 'cjs', exports: 'auto' },
      { file: path.resolve(pkg.module, '../', name, 'index.js'), format: 'esm', exports: 'auto' },
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

const { data: lazyList } = readDirSync(path.resolve(__dirname, './src/lazy'))
for (let i = 0, l = lazyList.length; i < l; i++) {
  const name = lazyList[i]

  utilsConfigs.push({
    input: path.resolve(srcPath, 'lazy', name, name + '.ts'),
    output: [
      { file: path.resolve(pkg.main, '../', 'lazy', name, 'index.js'), format: 'cjs', exports: 'auto' },
      { file: path.resolve(pkg.module, '../', 'lazy', name, 'index.js'), format: 'esm', exports: 'auto' },
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

setTimeout(() => {
  writeFileSync(
    path.resolve(__dirname, './README.md'),
    [
      '# ' + pkg.name + '\n\n',

      ...srcList.map((name) => {
        const { data } = readFileSync(path.resolve(__dirname, './es', name, name + '.d.ts'))

        console.log(data)
        console.log(name)

        return `### ${name}\n` + '```typescript\n' + data + '\n```\n\n'
      }),
    ].join('')
  )
}, 1000)

export default [
  {
    input: inputPath,
    output: [
      { file: pkg.main, format: 'cjs', exports: 'auto' },
      { file: pkg.module, format: 'esm', exports: 'auto' },
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
