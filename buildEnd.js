const path = require('path')
const { readDirSync, dirHasSync, writeFileSync, readFileSync, deletePathSync } = require('yhl-explorer-js')

const pkg = require('./package.json')

const esPath = path.resolve(__dirname, './es')
const esList = (() => {
  try {
    const { data } = readDirSync(esPath)
    return data
      .filter((name) => !['lazy', 'modules'].includes(name) && dirHasSync(path.resolve(esPath, name)).code === 200)
      .map((i) => ({ name: i, dirPath: path.resolve(esPath, i) }))
  } catch (error) {}
  return []
})()

const libPath = path.resolve(__dirname, './lib')
const libList = (() => {
  try {
    const { data } = readDirSync(libPath)
    return data
      .filter((name) => !['lazy', 'modules'].includes(name) && dirHasSync(path.resolve(libPath, name)).code === 200)
      .map((i) => ({ name: i, dirPath: path.resolve(libPath, i) }))
  } catch (error) {}
  return []
})()

const allList = [...esList, ...libList]
for (let i = 0, l = allList.length; i < l; i++) {
  const { name, dirPath } = allList[i]
  const { code: code1, data: data1 } = readFileSync(path.resolve(dirPath, name + '.d.ts'))
  if (code1 === 200 && data1) {
    writeFileSync(path.resolve(dirPath, 'index.d.ts'), data1)
    deletePathSync(path.resolve(dirPath, name + '.d.ts'))
  }
  const { code: code2, data: data2 } = readFileSync(path.resolve(dirPath, name + '.js'))
  if (code2 === 200 && data2) {
    writeFileSync(path.resolve(dirPath, 'index.js'), data2)
    deletePathSync(path.resolve(dirPath, name + '.js'))
  }
}

const esLazyList = (() => {
  try {
    const esLazyPath = path.resolve(esPath, 'lazy')
    const { data } = readDirSync(esLazyPath)
    return data.map((i) => ({ name: i, dirPath: path.resolve(esLazyPath, i) }))
  } catch (error) {}
  return []
})()

const libLazyList = (() => {
  try {
    const libLazyPath = path.resolve(libPath, 'lazy')
    let { data } = readDirSync(libLazyPath)
    return data.map((i) => ({ name: i, dirPath: path.resolve(libLazyPath, i) }))
  } catch (error) {}
  return []
})()

const allLazyList = [...esLazyList, ...libLazyList]
for (let i = 0, l = allLazyList.length; i < l; i++) {
  const { name, dirPath } = allLazyList[i]
  const { code: code1, data: data1 } = readFileSync(path.resolve(dirPath, name + '.d.ts'))
  if (code1 === 200 && data1) {
    writeFileSync(path.resolve(dirPath, 'index.d.ts'), data1)
    deletePathSync(path.resolve(dirPath, name + '.d.ts'))
  }
  const { code: code2, data: data2 } = readFileSync(path.resolve(dirPath, name + '.js'))
  if (code2 === 200 && data2) {
    writeFileSync(path.resolve(dirPath, 'index.js'), data2)
    deletePathSync(path.resolve(dirPath, name + '.js'))
  }
}

let indexType = ''
for (let i = 0, l = esList.length; i < l; i++) {
  const name = esList[i].name
  indexType += `import ${name} from './${name}';\n`
}
indexType += `export { ${esList.map((i) => i.name).join(', ')} }`
writeFileSync(path.resolve(esPath, 'index.d.ts'), indexType)
writeFileSync(path.resolve(libPath, 'index.d.ts'), indexType)

// 生成md
writeFileSync(
  path.resolve(__dirname, './README.md'),
  [
    '# ' + pkg.name + '\n\n',

    ...esList.map(({ name, dirPath }) => {
      const { code, data } = readFileSync(path.resolve(dirPath, 'index.d.ts'))
      if (code !== 200) return ''

      return `
### ${name}

导入
\`\`\`typescript
import { ${name} } from '${pkg.name}'
\`\`\`

类型定义
\`\`\`typescript
${data}
\`\`\`
`
    }),

    '\n\n## lazy 懒加载的模块',

    ...esLazyList.map(({ name, dirPath }) => {
      const { code, data } = readFileSync(path.resolve(dirPath, 'index.d.ts'))
      if (code !== 200) return ''

      return `
### ${name}

导入
\`\`\`typescript
import ${name} from '${pkg.name}/es/lazy/${name}'
\`\`\`

类型定义
\`\`\`typescript
${data}
\`\`\`
`
    }),
  ].join('')
)
