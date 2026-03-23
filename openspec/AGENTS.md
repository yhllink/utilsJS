# AI 代理指令集 (AI Agents Directive)

## 角色定义 (Role Definition)
你是本项目的 AI 编程助手，负责协助人类开发者完成代码编写、测试、重构等工作。

## 核心约束 (Core Constraints)
1. **无规范不代码**: 严禁在未创建完整的 proposal.md、design.md、tasks.md 之前编写任何业务代码
2. **单一事实源**: 必须优先读取 openspec/specs/ 了解系统当前状态
3. **任务驱动**: 必须严格按 tasks.md 的顺序执行，不得跳跃、合并或重新排序
4. **变更隔离**: 所有修改必须限制在 openspec/changes/<id>/ 内，严禁直接修改 openspec/specs/
5. **文档同步**: 代码变更后必须同步更新对应的 spec 文档

## Slash Commands
| 命令 | 功能 | 触发条件 |
| :--- | :--- | :--- |
| /opsx:propose | 创建变更提案 | 收到新需求时 |
| /opsx:plan | 生成设计与任务 | proposal 批准后 |
| /opsx:implement | 执行任务清单 | plan 批准后 |
| /opsx:verify | 运行验证测试 | 代码完成后 |
| /opsx:archive | 归档变更 | 验证通过后 |

## 工作流程 (Workflow)
1. 接收需求 → 2. 创建 proposal.md → 3. 生成 design.md → 4. 生成 tasks.md → 5. 执行任务 → 6. 验证 → 7. 归档

## 项目特定规则 (Project-Specific Rules)

### 代码审查要求
- 所有函数必须包含完整的 JSDoc 注释，包括 @param、@returns、@example
- 使用 TypeScript 严格模式，禁止 any 类型滥用
- 每个模块必须包含完整的单元测试，覆盖率不低于 80%

### 测试覆盖要求
- 使用 Jest 作为测试框架，配置 jsdom 环境
- 每个功能模块必须包含边界条件测试和异常处理测试
- 测试文件必须与源文件同名，位于 test/unit/ 对应目录

### API 设计规范
- 函数命名采用 camelCase，类名采用 PascalCase
- 导出函数必须明确声明类型，避免隐式 any
- 异步函数必须返回 Promise，错误处理使用 try-catch

### 数据库变更流程
- 本项目为工具库，不涉及数据库操作
- 数据持久化使用浏览器存储 API (localStorage, sessionStorage)

### 安全合规要求
- 禁止在代码中硬编码敏感信息
- 所有用户输入必须进行验证和转义
- 使用 CSP 兼容的 DOM 操作方式

## 禁止行为 (Prohibited Actions)
- ❌ 直接修改 openspec/specs/ 中的文件
- ❌ 跳过 proposal 阶段直接写代码
- ❌ 在未验证的情况下执行归档
- ❌ 忽略 tasks.md 中的任务顺序
- ❌ 在未更新 spec 的情况下提交代码

## 会话初始化 (Session Initialization)
每次新会话开始时，AI 必须自动执行:
1. 读取 openspec/project.md 了解项目上下文
2. 读取 openspec/AGENTS.md 确认行为准则
3. 检查 openspec/changes/ 是否有进行中的变更
4. 读取 openspec/specs/ 了解相关模块的现有规范

## 技术栈特定约束

### TypeScript 开发规范
- 使用严格模式配置 (strict: true)
- 路径别名配置为 @/* 指向 ./src/*
- 目标编译为 ES2020，模块系统为 ESNext

### 构建工具配置
- 使用 Rollup 进行模块打包
- 输出格式支持 CommonJS (lib/) 和 ES Modules (es/)
- 使用 Babel 进行代码转换，支持现代浏览器

### 测试框架要求
- Jest 配置支持 TypeScript 和 jsdom 环境
- 测试文件必须位于 test/unit/ 目录下
- 覆盖率报告生成到 coverage/ 目录

## 模块开发规范

### 目录结构约定
- 每个功能模块独占一个目录，目录名与模块名一致
- 模块入口文件必须与目录同名，使用 PascalCase
- 测试文件必须与源文件同名，位于对应测试目录

### 代码风格要求
- 函数必须包含完整的 JSDoc 注释
- 使用 TypeScript 类型注解，避免隐式 any
- 导出语句必须明确，避免默认导出
- 错误处理必须使用 try-catch 或 Promise.catch

### 性能优化要求
- 避免在循环中创建函数或对象
- 使用 WeakMap 处理循环引用
- 合理使用缓存机制优化重复计算