# 项目结构说明

## 目录结构

```
kabikingu-site/
├── home/                       # 前端页面
│   └── index.html             # 主页面（显示用户统计）
├── static/                     # 静态资源
│   ├── favicon.ico            # 网站图标
│   └── bilibili.png           # B站图标
├── docs/                       # 文档
│   ├── API_IMPLEMENTATION.md  # API实现说明
│   └── PROJECT_STRUCTURE.md   # 本文件
├── scripts/                    # 工具脚本
│   └── cloudflare_worker.js   # Cloudflare Workers API代码
└── README.md                   # 项目说明
```

## 文件说明

### 前端

- **`home/index.html`**
  - 主页面，显示用户粉丝数和获赞数
  - 每3秒自动从 Cloudflare Workers API 获取数据
  - 使用Flexbox布局，左侧显示统计数据，右侧显示iframe

### API

- **`scripts/cloudflare_worker.js`**
  - Cloudflare Workers API代码
  - 代理B站 `https://api.bilibili.com/x/web-interface/card` API
  - 处理CORS，返回格式化的JSON数据
  - 不需要Cookie或WBI签名

## 数据流

```
用户打开 home/index.html
    ↓
前端JavaScript每3秒调用 Cloudflare Workers API
    ↓
Cloudflare Workers 代理请求 B站API
    ↓
返回数据给前端
    ↓
前端更新页面显示
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
3. 创建新的 Worker
4. 将 `scripts/cloudflare_worker.js` 的内容复制到 Worker
5. 保存并部署

## 技术栈

- **API**: Cloudflare Workers - B站API代理
- **前端**: HTML/CSS/JavaScript
- **布局**: CSS Flexbox
