# 项目结构说明

## 目录结构

```text
kabikingu-site/
├── home/
│   └── index.html             # 主页面（用户统计 + 投稿展示）
├── static/                    # 静态资源
├── fonts/                     # 字体资源
├── docs/
│   ├── API_IMPLEMENTATION.md
│   └── PROJECT_STRUCTURE.md
├── index.html                 # 站点首页（建设中页面）
├── CNAME
└── README.md
```

## 模块说明

- `home/index.html`
  - 页面 UI、交互逻辑、数据请求逻辑
  - 调用 `http://api.kabikingu.com/card` 与 `http://api.kabikingu.com/videos`
  - `/card` 仅在页面加载时请求一次（服务端已缓存）

- `docs/API_IMPLEMENTATION.md`
  - API 接入约定与返回结构说明

## 数据流

```text
用户打开 home/index.html
    ↓
前端请求 kabi-api
    ├── /card?mid=...
    └── /videos
    ↓
前端渲染统计信息与投稿列表
```

## 部署说明

- 前端：可部署到任意静态托管平台（GitHub Pages / Netlify / Vercel / Cloudflare Pages）
- API：由独立 `kabi-api` 服务提供（本仓库不包含 API 服务端代码）

## 说明

- 旧 Cloudflare Worker 已移除，不在当前架构内。
