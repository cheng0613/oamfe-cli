# oamfe CLI

一个简单易用的前端脚手架工具，帮助你快速创建现代化的前端项目。

## 安装

```bash
npm install -g oamfe-cli
```

或者直接克隆项目：

```bash
git clone <repository-url>
cd oamfe-cli
npm install
npm link
```

## 使用

### 创建新项目

```bash
oamfe create <project-name>
```

### 查看可用模板

```bash
oamfe list
```

### 查看帮助

```bash
oamfe --help
```

## 支持的模板

### React + TypeScript
- ⚛️ React 18
- 📦 TypeScript 支持
- ⚡️ Vite 构建
- 🎨 现代化开发体验

### Vue 3 + TypeScript
- 🖖 Vue 3 + Composition API
- 📦 TypeScript 支持
- ⚡️ Vite 构建
- 🎨 现代化开发体验

### 原生 JavaScript
- 📦 Vanilla JavaScript
- ⚡️ Vite 构建
- 🎨 现代化开发体验

## 示例

创建一个新的 React 项目：

```bash
oamfe create my-react-app
```

创建一个新的 Vue 项目：

```bash
oamfe create my-vue-app
```

创建一个原生 JavaScript 项目：

```bash
oamfe create my-vanilla-app
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 链接到全局（用于开发）
npm link
```

## 许可证

ISC