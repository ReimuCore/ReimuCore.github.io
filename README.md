# Kabikingu Site

咔比大王Kingu 社区主页前端项目。

## 当前架构

- 前端：静态页面（`home/index.html`）
- API：独立 Node.js + Express 服务（`http://api.kabikingu.com`）
- 说明：旧 Cloudflare Worker 已废弃，不再使用

## 主要功能

- 展示用户统计信息（粉丝数、获赞数）
- 展示投稿视频列表（按年月分组、可滚动定位）
- 使用本地封面地址（`/covers/<filename>`）优先加载视频封面

## 目录结构

```text
kabikingu-site/
├── home/
│   └── index.html
├── static/
├── fonts/
├── docs/
│   ├── PROJECT_STRUCTURE.md
│   └── API_IMPLEMENTATION.md
├── index.html
├── CNAME
└── README.md
```

## API 使用说明

线上根域名：

```text
http://api.kabikingu.com/
```

前端当前使用的核心接口：

- `GET /card?mid=3493274442533075`
- `GET /videos`

### `/card` 返回结构（示例）

```json
{
  "ok": true,
  "source": "cache",
  "updatedAt": 1710000000000,
  "data": {
    "code": 0,
    "message": "0",
    "ttl": 1,
    "data": {
      "follower": 123456,
      "like_num": 654321
    }
  }
}
```

### `/videos` 返回结构（示例）

```json
{
  "ok": true,
  "count": 45,
  "data": [
    {
      "bvid": "BV1wxZnBuE2D",
      "title": "示例标题",
      "cover": "https://i0.hdslb.com/bfs/archive/xxx.jpg",
      "coverLocal": "/covers/BV1wxZnBuE2D.jpg",
      "pubdate": 1710000000
    }
  ]
}
```

## 本地开发

```bash
npx http-server home -p 8000
```

打开 [http://localhost:8000](http://localhost:8000)。

## 前端配置

在 `home/index.html` 中：

```javascript
const USER_MID = '3493274442533075';
const API_BASE_URL = 'http://api.kabikingu.com';
const VIDEOS_API_URL = `${API_BASE_URL}/videos`;
```

## 备注

- `/card` 在 API 服务端已做缓存，前端无需高频轮询。
- 如需补齐视频或封面，请在 API 服务侧使用 `/sync-videos/*` 与 `/sync-covers`。
