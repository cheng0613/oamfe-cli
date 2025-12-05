# oamfe CLI

一个功能强大的前端脚手架工具，帮助你快速创建前端项目，并集成代码生成、Git hooks等开发工具。

## ✨ 特性

- 🚀 **GitLab 模板克隆** - 从 GitLab 仓库快速克隆项目模板
- 🎯 **智能组件生成** - 支持 React、Vue、原生 JS 组件生成
- 🔧 **Git 工作流** - 集成 husky、commitlint、cz-git 标准化提交
- 📝 **代码质量** - 内置 ESLint、Prettier、lint-staged
- 🔄 **Plop 集成** - 支持自定义代码生成器

## 📦 安装

### 全局安装

```bash
npm install -g oamfe-cli
```

### 开发模式安装

```bash
git clone <repository-url>
cd oamfe-cli
npm install
npm link
```

## 🚀 使用

### 创建新项目

```bash
oamfe create <project-name>
```

支持以下项目模板：

#### 🏢 ruoyi-vue3 - 企业级后台管理系统

- 从 GitLab 仓库克隆企业级项目模板
- 完整的后台管理系统架构
- Vue 3 + TypeScript + Element Plus
- 仓库地址：`ssh://git@gitlab.juneyaoair.com:10022/yidongyunxing/ruoyi-vue3.git`

### 查看可用信息

```bash
oamfe list
```

### 快速创建组件

⚠️ **重要**：请在您的项目目录中运行组件生成命令，不要在 CLI 工具目录中运行。

```bash
# 首先进入您的项目目录
cd your-project

# 然后生成组件
oamfe component <component-name>
# 或简写
# oamfe c <component-name>
```

### 使用 Plop 生成器

```bash
oamfe generate
# 或简写
# oamfe g
```

### 查看帮助

```bash
oamfe --help
```

## 📋 项目模板

### RuoYi-Vue3

- 🏢 **来源**：GitLab 企业级项目模板
- 🖖 **技术栈**：Vue 3 + TypeScript + Vite
- 📦 **特性**：
  - 企业级前端框架
  - 完整的后台管理系统模板
  - TypeScript 支持
  - 现代化构建工具
  - 权限管理系统
  - 丰富的组件库

📋 **GitLab 仓库**：

```
ssh://git@gitlab.juneyaoair.com:10022/yidongyunxing/ruoyi-vue3.git
```

## 🎯 组件生成

支持生成三种类型的组件：

- **React 组件** - 包含 TypeScript 类型定义、CSS Modules、测试文件
- **Vue 组件** - 使用 Composition API，支持 TypeScript
- **原生 JS 组件** - 简单的类组件模式

### 组件生成选项

- ✅ 自动创建目录结构
- ✅ 支持样式文件（CSS/CSS Modules）
- ✅ 可选测试文件
- ✅ 自定义组件描述
- ✅ 灵活的目标目录选择

## 🔧 Git Hooks 工作流

项目自动集成以下 Git hooks：

### pre-commit

- 自动运行 ESLint 和 Prettier
- 只检查暂存区的文件
- 自动修复可修复的错误

### commit-msg

- 使用 commitlint 验证提交信息格式
- 支持 Conventional Commits 规范
- 集成 cz-git 提供交互式提交界面

### 使用标准化提交

```bash
npm run commit
# 或使用 git-cz
npx git-cz
```

## 📝 示例

### 创建新项目

```bash
# 创建企业级后台管理系统项目
oamfe create my-admin-app
```

### 生成组件

```bash
# 生成 React 组件
oamfe component Button

# 生成 Vue 组件
oamfe c UserCard

# 生成带测试文件的组件
oamfe c Modal --hasTests
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 链接到全局（用于开发）
npm link

# 代码检查
npm run lint

# 代码格式化
npm run format

# 使用交互式提交
npm run commit
```

## 📁 项目结构

```
oamfe-cli/
├── cli.js                 # 主 CLI 入口
├── plopfile.js           # Plop 生成器配置
├── templates/            # 项目模板
│   ├── react/           # React 模板
│   ├── vue/             # Vue 模板
│   └── vanilla/         # 原生 JS 模板
├── plop/                # Plop 模板文件
│   └── templates/       # 组件生成模板
├── .husky/              # Git hooks 配置
├── commitlint.config.js # 提交信息校验配置
└── .cz-config.js        # 交互式提交配置
```

## 📄 许可证

ISC
