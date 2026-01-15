# Markdown File Reader

一个使用 Tauri 构建的跨平台 Markdown 阅读器应用。

## 功能特性

- 打开并渲染 Markdown 文件
- 支持 GitHub Flavored Markdown (GFM)
- 美观的阅读界面
- 跨平台支持 (Windows, macOS, Linux)
- 小巧的体积 (~3-5MB)

## 开发环境要求

- Node.js (>= 18)
- Rust (>= 1.70)
- npm 或其他包管理器

## 安装步骤

1. **重要：重新打开终端**

   由于我们刚刚安装了 Rust，需要重新打开终端以加载环境变量。

2. **安装依赖**

   ```bash
   npm install
   ```

3. **运行开发服务器**

   ```bash
   npm run tauri:dev
   ```

4. **构建生产版本**

   ```bash
   npm run tauri:build
   ```

## 项目结构

```
markdown-file-reader/
├── src/                  # 前端源代码
│   ├── main.ts          # 主入口
│   └── styles.css       # 样式文件
├── src-tauri/           # Tauri 后端 (Rust)
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── index.html
├── package.json
└── vite.config.ts
```

## 使用说明

1. 启动应用后，点击"打开 Markdown 文件"按钮
2. 选择一个 .md 或 .markdown 文件
3. 文件内容会自动渲染并显示

## 注意事项

- 应用图标需要自行添加到 `src-tauri/icons/` 目录
- 可以使用 `@tauri-apps/cli` 的 `icon` 命令来生成各种尺寸的图标

## 技术栈

- **前端**: TypeScript + Vite
- **后端**: Rust + Tauri
- **Markdown 渲染**: marked.js
- **插件**:
  - tauri-plugin-dialog (文件选择)
  - tauri-plugin-fs (文件读取)
