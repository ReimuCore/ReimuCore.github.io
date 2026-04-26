# API 实现说明（当前版本）

## 架构

```text
前端 (home/index.html)
    ↓ HTTP 请求
kabi-api (Node.js + Express)
    ↓
返回 JSON / 静态封面文件
```

线上 API 根域名：

```text
http://api.kabikingu.com/
```

## 前端已接入接口

### 1) 用户统计

- `GET /card?mid=<MID>`
- 前端读取：`data.data.follower`、`data.data.like_num`
- 说明：服务端已做缓存，前端页面加载时拉取一次即可

### 2) 视频列表

- `GET /videos`
- 前端读取：`data.data`（数组）
- 字段优先级：`coverLocal` > `cover`

### 3) 封面资源

- `GET /covers/<filename>`
- 当 `coverLocal` 存在时，前端拼接为：
  - `http://api.kabikingu.com${coverLocal}`

## 返回结构约定

### `/card`（示例）

```json
{
  "ok": true,
  "source": "bilibili",
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

### `/videos`（示例）

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

## 调试建议

1. 在浏览器 Network 面板检查 `/card` 与 `/videos` 返回结构
2. 若封面加载失败，优先检查 `coverLocal` 是否可直接访问
3. 若接口异常，直接访问：
   - [http://api.kabikingu.com/card?mid=3493274442533075](http://api.kabikingu.com/card?mid=3493274442533075)
   - [http://api.kabikingu.com/videos](http://api.kabikingu.com/videos)

## 迁移说明

- 本项目已不再使用 Cloudflare Worker。
- 文档与前端逻辑均以 `kabi-api` 为准。
