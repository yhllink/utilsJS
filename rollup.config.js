const path = require('path')
const ts = require('rollup-plugin-typescript2')
const { readDirSync, writeFileSync } = require('yhl-explorer-js')

const pkg = require('./package.json')

const srcPath = path.resolve(__dirname, './src')
const inputPath = path.resolve(srcPath, './index.ts')

let { data: srcList } = readDirSync(srcPath)
srcList = srcList.filter((name) => !['index.ts', '.DS_Store'].includes(name))

let indexStr = ''
for (let i = 0, l = srcList.length; i < l; i++) {
  const name = srcList[i]
  indexStr += `import ${name} from './${name}/${name}'\n`
}
indexStr += `\nexport default { ${srcList.join(', ')} }`
writeFileSync(inputPath, indexStr)

module.exports = {
  input: inputPath,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'yhlUtils',
    },
  ],
  plugins: [
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
      tsconfigOverride: {
        compilerOptions: { target: 'es5' },
        include: ['src'],
        exclude: ['test', 'test-dts'],
      },
    }),
  ],
}
