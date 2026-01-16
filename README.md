# Kabikingu Site

## 项目结构

```
kabikingu-site/
├── home/                 # 前端页面
├── static/               # 静态资源
├── docs/                 # 文档
└── scripts/              # 工具脚本
    └── cloudflare_worker.js  # Cloudflare Workers API
```

## 快速开始

### 访问页面

直接打开 `home/index.html` 文件，或使用任意静态文件服务器（如 VS Code Live Server、Python http.server 等）。

**使用 Python 简单服务器：**
```bash
cd home
python -m http.server 8000
```

然后访问 `http://localhost:8000/`

## API接口

项目使用 **Cloudflare Workers** 作为 API 代理，前端直接调用：

```
https://quiet-dew-d623.484540891.workers.dev/?mid=<用户ID>
```

### 返回数据格式

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

## 技术栈

- **API**: Cloudflare Workers - B站API代理
- **前端**: HTML/CSS/JavaScript

## 文档

- [项目结构说明](docs/PROJECT_STRUCTURE.md)
- [API实现说明](docs/API_IMPLEMENTATION.md)
