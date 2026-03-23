# yhl-utils 按需加载分析 Spec

## Why

当前 yhl-utils 库需要支持使用方按需加载，减少最终打包体积。虽然 Rollup 已配置模块级代码分割（manualChunks），但 package.json 缺少 exports 字段配置，导致无法通过子路径导入实现真正的按需加载。

## What Changes

- 分析当前项目的打包配置和产物结构
- 验证按需加载的可行性
- 提出改进方案

## Impact

- Affected specs: package.json, rollup.config.mjs
- Affected code: 打包配置、发布流程

## 当前实现分析

### 打包配置现状

**rollup.config.mjs** 已配置：
- `splitChunks: true` - 启用代码分割
- `manualChunks` - 每个工具模块单独打包

```javascript
function manualChunks(chunkPath) {
  if (chunkPath.indexOf(srcPath) === 0) {
    const name = chunkPath.split('/').at(-2)
    return name + '/' + name  // 生成 formatNumber/formatNumber.js
  }
  return 'vendors/' + chunkPath
}
```

### 产物结构

构建后会生成：
```
es/
  ├── index.js              # 主入口
  ├── formatNumber/
  │   ├── formatNumber.js   # 独立 chunk
  │   └── formatNumber.d.ts # 类型定义
  └── ...
lib/
  └── (同样结构)
```

### 关键问题

**package.json 缺少 exports 字段**

当前 package.json：
```json
{
  "main": "lib/index.js",
  "module": "es/index.js"
}
```

这意味着：
- ❌ 无法通过 `import { formatNumber } from 'yhl-utils/es/formatNumber'` 导入
- ❌ 使用方必须从主入口导入，引入全部代码

## ADDED Requirements

### Requirement: 配置 package.json exports 字段

库 SHALL 支持子路径导入，使用方可通过以下方式按需加载：

#### Scenario: ESM 子路径导入

- **WHEN** 使用方执行 `import { formatNumber } from 'yhl-utils/es/formatNumber/formatNumber'`
- **THEN** 仅加载 formatNumber 模块代码

#### Scenario: CJS 子路径导入

- **WHEN** 使用方执行 `const { formatNumber } = require('yhl-utils/lib/formatNumber/formatNumber')`
- **THEN** 仅加载 formatNumber 模块代码

### Requirement: 确保类型定义正确

子路径导入 SHALL 正确获得类型提示。

## MODIFIED Requirements

### Requirement: package.json 配置

添加 exports 字段支持子路径导入：

```json
{
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.js",
      "require": "./lib/index.js"
    },
    "./es/formatNumber/formatNumber": {
      "types": "./es/formatNumber/formatNumber.d.ts",
      "import": "./es/formatNumber/formatNumber.js",
      "require": "./lib/formatNumber/formatNumber.js"
    }
  }
}
```

## REMOVED Requirements

无需移除任何功能。

## 验收标准

1. 使用方可通过子路径导入单个工具
2. 子路径导入有正确的 TypeScript 类型支持
3. 不影响现有从主入口的导入方式
