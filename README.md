# Kabikingu Site

一个展示 Bilibili UP主 统计信息和投稿内容的个人网站。

> **注意**：本项目使用 Cloudflare Workers 作为 API 代理，解决跨域和请求频率限制问题。

## 功能特性

### 📊 用户统计
- 实时显示粉丝数、获赞数、投稿数等统计数据
- 每5秒自动更新（仅在数值增长时更新，避免不必要的动画）
- 数字动画效果，支持平滑过渡
- 响应式设计，适配各种屏幕尺寸

### 📹 投稿展示
- 按年月分类展示所有投稿视频
- 视频封面展示，支持 16:9 比例
- 点击未选中的投稿可滚动定位，点击选中的投稿跳转到 Bilibili
- 鼠标悬停显示视频标题和发布日期
- 滚轮切换投稿，支持连续滚动
- 年月选择器自动同步当前选中的投稿

### 🎨 交互体验
- 平滑的滚动动画和自动对齐
- 响应式布局，移动端优化
- 侧边栏导航，支持移动端展开/收起
- Footer 图片悬停效果

## 项目结构

```
kabikingu-site/
├── home/                    # 前端页面
│   └── index.html          # 主页面
├── static/                 # 静态资源
│   ├── bilibili.png       # B站图标
│   ├── footer-png1.png    # Footer 图片1
│   ├── footer-png2.png    # Footer 图片2
│   └── favicon.ico        # 网站图标
├── fonts/                  # 字体文件
│   └── Minecraft.ttf      # Minecraft 字体
├── docs/                   # 文档
│   ├── PROJECT_STRUCTURE.md  # 项目结构说明
│   └── API_IMPLEMENTATION.md  # API实现说明
├── worker.js              # Cloudflare Workers API代码
├── index.html             # 首页（建设中页面）
├── CNAME                  # GitHub Pages域名配置
└── README.md               # 本文件
```

## 快速开始

### 访问页面

直接打开 `home/index.html` 文件，或使用任意静态文件服务器。

**使用 Python 简单服务器：**
```bash
cd home
python -m http.server 8000
```

然后访问 `http://localhost:8000/`

**使用 Node.js (http-server)：**
```bash
npx http-server home -p 8000
```

## API 接口

项目使用 **Cloudflare Workers** 作为 API 代理，绕过 Bilibili 的请求频率限制。

### 用户统计 API

```
GET https://dataapi.kabikingu.com/?mid=<用户ID>
```

**返回数据格式：**
```json
{
  "mid": "3493274442533075",
  "follower": 359097,
  "like_num": 2856980,
  "archive_count": 462,
  "article_count": 0,
  "following": false
}
```

### 视频列表 API

```
GET https://dataapi.kabikingu.com/videos?mid=<用户ID>
```

**返回数据格式：**
```json
{
  "mid": "3493274442533075",
  "count": 35,
  "videos": [
    {
      "bvid": "BVxxxxxxxxxx",
      "title": "视频标题",
      "cover": "https://dataapi.kabikingu.com/image?url=...",
      "pubdate": 1234567890
    },
    ...
  ]
}
```

**数据说明：**
- `mid`: 用户ID
- `count`: 视频总数
- `videos`: 视频数组
  - `bvid`: 视频 BV 号
  - `title`: 视频标题
  - `cover`: 视频封面 URL（已通过图片代理处理）
  - `pubdate`: 发布时间（Unix 时间戳）

### 图片代理 API

```
GET https://dataapi.kabikingu.com/image?url=<图片URL>
```

用于代理B站图片，解决跨域和防盗链问题。返回的图片会自动添加缓存头（24小时）。

## 技术栈

- **前端**: HTML5 / CSS3 / JavaScript (ES6+)
- **API**: Cloudflare Workers - Bilibili API 代理
- **字体**: Minecraft 字体
- **布局**: Flexbox / CSS Grid
- **动画**: CSS Animations / requestAnimationFrame

## 主要功能实现

### 投稿展示系统
- 按年月自动分类投稿
- 从旧到新排序显示
- 支持滚轮切换和点击定位
- 自动同步年月选择器

### 响应式设计
- 桌面端：投稿列表和选择器位于页面右侧
- 移动端：垂直布局，适配小屏幕
- 断点：768px, 480px

### 交互优化
- 平滑滚动动画
- 自动对齐到中心
- 点击未选中投稿自动定位
- 悬停显示详细信息

## 配置说明

### 前端配置

在 `home/index.html` 中可以修改以下配置：

```javascript
const USER_MID = '3493274442533075';  // Bilibili 用户 ID
const API_BASE_URL = 'https://dataapi.kabikingu.com';  // API 基础地址
const VIDEOS_API_URL = 'https://dataapi.kabikingu.com/videos';  // 视频API地址
const UPDATE_INTERVAL = 5000;  // 更新间隔（毫秒），默认5秒
```

### API 配置

`worker.js` 中硬编码了视频BV列表，如需更新视频列表，需要修改 `worker.js` 中的 `bvList` 数组。

**注意**：当前实现使用硬编码的BV列表，后续可优化为从B站API动态获取。

## 浏览器支持

- Chrome / Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 移动端浏览器

## 部署说明

### 前端部署

本项目可以部署到任何静态文件托管服务：

- **GitHub Pages**: 推送到仓库后自动部署
- **Netlify / Vercel**: 连接GitHub仓库自动部署
- **Cloudflare Pages**: 连接GitHub仓库自动部署

### API 部署（Cloudflare Workers）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 创建新的 Worker
4. 将 `worker.js` 的内容复制到 Worker 编辑器
5. （可选）绑定自定义域名 `dataapi.kabikingu.com`
6. 保存并部署

详细部署说明请参考 [API实现说明](docs/API_IMPLEMENTATION.md)

## 开发说明

### 代码结构

- **`home/index.html`**: 单文件应用，包含所有HTML、CSS和JavaScript代码
- **`worker.js`**: Cloudflare Workers API代理服务
- **代码注释**: 关键功能模块已添加详细注释，便于维护

### 调试

- 打开浏览器开发者工具（F12）查看控制台日志
- 检查 Network 标签页查看API请求状态
- 保留的 `console.error` 和 `console.warn` 用于错误提示

## 文档

- [项目结构说明](docs/PROJECT_STRUCTURE.md) - 详细的目录结构和文件说明
- [API实现说明](docs/API_IMPLEMENTATION.md) - API架构、数据流程和部署指南

## 许可证

本项目仅供学习和个人使用。
