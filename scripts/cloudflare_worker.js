// Cloudflare Workers - B站用户卡片API代理
export default {
  async fetch(request) {
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }

    try {
      const url = new URL(request.url)
      const mid = url.searchParams.get('mid') || '3493274442533075'
      const photo = url.searchParams.get('photo') || 'false'

      // 调用B站API
      const apiUrl = `https://api.bilibili.com/x/web-interface/card?mid=${mid}&photo=${photo}`
      const resp = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://space.bilibili.com/${mid}`,
          'Accept': 'application/json, text/plain, */*'
        }
      })

      if (!resp.ok) {
        return new Response(
          JSON.stringify({ error: `HTTP错误: ${resp.status} ${resp.statusText}` }),
          {
            status: resp.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      const json = await resp.json()

      // 检查B站API返回的状态码
      if (json.code !== 0) {
        return new Response(
          JSON.stringify({
            error: json.message || '获取失败',
            code: json.code
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      // 解析数据 - B站API返回结构: { code: 0, data: { follower, like_num, card: {...} } }
      const cardData = json.data || {}
      
      // 优先从data直接获取，如果没有则从card对象获取
      let follower = cardData.follower
      let like_num = cardData.like_num

      // 如果data中有card对象，尝试从card中获取（字段名可能不同）
      if (cardData.card && typeof cardData.card === 'object') {
        const card = cardData.card
        // card中可能是fans而不是follower
        if (follower === undefined && card.fans !== undefined) {
          follower = card.fans
        }
        // card中可能是like而不是like_num
        if (like_num === undefined && card.like !== undefined) {
          like_num = card.like
        }
      }

      // 返回数据
      return new Response(
        JSON.stringify({
          mid: cardData.mid || mid,
          follower: follower || 0,
          like_num: like_num || 0,
          archive_count: cardData.archive_count || 0,
          article_count: cardData.article_count || 0,
          following: cardData.following || false
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message || '处理失败'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }
  }
}
