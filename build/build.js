const path = require('path')
// const rollup = require('rollup')
const { readDirSync } = require('yhl-explorer-js')

const srcPath = path.resolve(__dirname, '../', 'src')

const { data: srcList } = readDirSync(srcPath)

function getConfig(name) {
  return {}
}
srcList.map((name) => {
  const config = getConfig(name)

  rollup
    .rollup(config)
    .then((bundle) => bundle.generate(output))
    .then(async ({ output: [{ code }] }) => {
      // if (isProd) {
      //   const { code: minifiedCode } = await terser.minify(code, {
      //     toplevel: true,
      //     compress: {
      //       pure_funcs: ['makeMap'],
      //     },
      //     format: {
      //       ascii_only: true,
      //     },
      //   })
      //   const minified = (banner ? banner + '\n' : '') + minifiedCode
      //   return write(file, minified, true)
      // } else {
      return write(file, code)
      // }
    })
})

console.dir(srcList)
