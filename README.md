# @spore-ui/spore-template-npm

WEB 公共组件模板

## 特性

- 使用 lint-staged 校验提交日志
- commit-lint 代码提交校验
- ls-lint 文件名称校验
- develop 分支开发，master 分支发布
- master 分支拒绝直接提交代码
- 非 master 分支拒绝发布模块
- changelog 自动生成
- 版本号基于 semantic-release 自动生成
- 支持 HMR
- TypeScript 开发
- 支持 tree-shaking
- 可引入 less, css
- 接入 jest 单元测试
- 输出 es5, es6 2 套代码
- 导出 umd 模块
- 提供多页面示例
- 基于 git path 与 版本号的 CDN 映射方案

## 基本指令

```bash
# 开发
npm run dev
# 构建
npm run build
# 测试
npm test
# 构建，测试，更新版本号和 changelog，提交到 develop
npm run release
# 上传文件
npm run upload
```

- 开发服务启动后
  - 访问 `http://localhost:8090` 查看 public/index.ejs 渲染的示例页面
  - 访问 `http://localhost:8090/test.html` 查看 public/test.ejs 渲染的示例页面

## 基本开发流程

- 在 develop 分支开发代码
- 执行 `npm run relaease` 更新模块版本号
- 合并到 master 触发 CI 更新线上文件
