# 项目结构说明

## 目录结构

```
kabikingu-site/
├── home/                       # 前端页面
│   └── index.html             # 主页面（显示用户统计和投稿列表）
├── static/                     # 静态资源
│   ├── favicon.ico            # 网站图标
│   ├── bilibili.png           # B站图标
│   ├── footer-png1.png        # Footer图片1
│   └── footer-png2.png        # Footer图片2
├── fonts/                      # 字体文件
│   └── Minecraft.ttf          # Minecraft字体
├── docs/                       # 文档
│   ├── API_IMPLEMENTATION.md  # API实现说明
│   └── PROJECT_STRUCTURE.md   # 本文件
├── worker.js                   # Cloudflare Workers API代码
├── index.html                  # 首页（建设中页面）
├── CNAME                       # GitHub Pages域名配置
└── README.md                   # 项目说明
```

## 文件说明

### 前端

- **`home/index.html`**
  - 主页面，显示用户粉丝数、获赞数和投稿列表
  - 每5秒自动从 API 获取统计数据
  - 支持桌面端和移动端响应式布局
  - 桌面端：右侧显示投稿列表和年月选择器
  - 移动端：支持页面切换（首页/投稿）

### API

- **`worker.js`**
  - Cloudflare Workers API代码
  - 代理B站 `https://api.bilibili.com/x/web-interface/card` API（用户统计）
  - 代理B站 `https://api.bilibili.com/x/web-interface/view` API（视频信息）
  - 提供图片代理功能（/image端点）
  - 处理CORS，返回格式化的JSON数据
  - 部署到 `dataapi.kabikingu.com` 域名

## 数据流

```
用户打开 home/index.html
    ↓
前端JavaScript每5秒调用 Cloudflare Workers API
    ↓
Cloudflare Workers 代理请求 B站API
    ↓
返回数据给前端（带CORS头）
    ↓
前端更新页面显示（仅在数值增长时更新）
```

## 部署说明

### 本地开发

1. 使用任意静态文件服务器打开 `home/index.html`

   **使用 Python：**
   ```bash
   cd home
   python -m http.server 8000
   ```

   **使用 Node.js：**
   ```bash
   npx http-server home -p 8000
   ```

   **使用 VS Code：**
   - 安装 Live Server 扩展
   - 右键 `home/index.html` 选择 "Open with Live Server"

2. 访问 `http://localhost:8000/`

### Cloudflare Workers

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 创建新的 Worker 或编辑现有 Worker
4. 将 `worker.js` 的内容复制到 Worker
5. 绑定自定义域名 `dataapi.kabikingu.com`
6. 保存并部署

## 技术栈

- **API**: Cloudflare Workers - B站API代理
- **前端**: HTML/CSS/JavaScript
- **布局**: CSS Flexbox
