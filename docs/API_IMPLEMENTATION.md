# API实现逻辑说明

## 架构设计

### Cloudflare Workers 代理模式

```
前端 (home/index.html)
    ↓ 跨域请求
Cloudflare Workers API
    ↓ 代理请求
B站API (https://api.bilibili.com/x/web-interface/card)
    ↓ 返回数据
Cloudflare Workers
    ↓ 返回JSON给前端（带CORS头）
前端显示数据
```

## 数据流程

### 1. 前端请求 (`home/index.html`)

```javascript
// 每5秒调用一次（实际代码中为UPDATE_INTERVAL常量）
const API_BASE_URL = 'https://dataapi.kabikingu.com';
fetch(`${API_BASE_URL}?mid=3493274442533075`)
```

### 2. Cloudflare Workers (`worker.js`)

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url)
    const mid = url.searchParams.get('mid')
    
    // 调用B站API
    const resp = await fetch(`https://api.bilibili.com/x/web-interface/card?mid=${mid}`)
    const json = await resp.json()
    
    // 解析并返回数据
    return new Response(JSON.stringify({
      follower: ...,
      like_num: ...
    }), {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}
```

### 3. B站API

```
https://api.bilibili.com/x/web-interface/card?mid=<用户ID>
```

**注意**：此API不需要Cookie或WBI签名，可以直接调用。

## 数据结构

### B站API返回结构

```json
{
  "code": 0,
  "data": {
    "follower": 359097,      // 粉丝数
    "like_num": 2856980,     // 获赞数
    "archive_count": 462,
    "article_count": 0,
    "following": false,
    "card": {
      "mid": 3493274442533075,
      "fans": 359097,        // 备用字段（如果data中没有follower）
      "like": 2856980        // 备用字段（如果data中没有like_num）
    }
  }
}
```

### Cloudflare Workers 返回结构

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

## 部署 Cloudflare Workers

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 创建新的 Worker
4. 将 `worker.js` 的内容复制到 Worker 编辑器
5. 绑定自定义域名 `dataapi.kabikingu.com`（可选）
6. 保存并部署

## 可能的问题

### 1. CORS 错误

**原因**：Cloudflare Workers 没有正确设置 CORS 头

**解决**：确保 Worker 代码中包含 `'Access-Control-Allow-Origin': '*'` 头

### 2. 数据字段缺失

**原因**：B站API返回的数据结构可能变化

**解决**：检查 Worker 代码中的数据提取逻辑，确保从多个位置尝试获取数据

### 3. 网络请求失败

**原因**：网络问题或 B站API 不可用

**解决**：检查网络连接，查看 Cloudflare Workers 日志

## 调试方法

### 1. 查看浏览器控制台

打开浏览器开发者工具（F12），查看：
- Network标签：检查API请求是否成功
- Console标签：查看JavaScript错误和调试信息

### 2. 测试 Cloudflare Workers API

直接在浏览器中访问：
```
https://dataapi.kabikingu.com/?mid=3493274442533075
```

应该返回JSON格式的数据。

### 3. 查看 Cloudflare Workers 日志

在 Cloudflare Dashboard 中查看 Workers 的实时日志，检查是否有错误。

## 常见错误

### 错误1: "Failed to fetch"

**原因**：网络问题或 Cloudflare Workers 不可用

**解决**：
1. 检查网络连接
2. 确认 Cloudflare Workers 已正确部署
3. 检查 Worker URL 是否正确

### 错误2: "数据缺失"

**原因**：API返回的数据结构不符合预期

**解决**：检查 Cloudflare Workers 代码中的数据提取逻辑

### 错误3: CORS 错误

**原因**：Cloudflare Workers 没有设置正确的 CORS 头

**解决**：确保 Worker 代码中返回响应时包含 CORS 头

## 测试步骤

1. **打开页面**
   - 使用静态文件服务器打开 `home/index.html`
   - 或直接双击打开（某些浏览器可能限制跨域请求）

2. **查看数据**
   - 页面应该显示粉丝数和获赞数
   - 每5秒自动更新（UPDATE_INTERVAL常量控制）
   - 查看浏览器控制台是否有错误

3. **如果失败**
   - 打开浏览器开发者工具（F12）
   - 查看Network标签，检查API请求
   - 查看Console标签，查看错误信息
   - 直接访问 Cloudflare Workers URL 测试API是否正常
