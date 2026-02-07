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
        const pathname = url.pathname
              // ===== 新增：视频列表接口（不影响原逻辑）=====
              if (pathname === '/image') {
                const imageUrl = url.searchParams.get('url')
                if (!imageUrl) {
                  return new Response('missing url', { status: 400 })
                }
              
                const resp = await fetch(imageUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://www.bilibili.com'
                  }
                })
              
                return new Response(resp.body, {
                  headers: {
                    'Content-Type': resp.headers.get('Content-Type') || 'image/jpeg',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=86400'
                  }
                })
              }
              
              if (pathname.startsWith('/videos')) {
                const mid = url.searchParams.get('mid') || '3493274442533075'
        
                const bvList = [
                  'BV18C6EBTEzd',
                  'BV1FazNBLEzN',
                  'BV1MWrdBzEaW',
                  'BV1er6RB5EiG',
                  'BV1aXiFBCEf8',
                  'BV1F1BzBzEi1',
                  'BV13JBUBEENp',
                  'BV1zwBxBhEFG',
                  'BV1EWqXBMEkn',
                  'BV1nQq5BvE5a',
                  'BV1Cvm7BuEEX',
                  'BV1FZ2kBqETQ',
                  'BV1J42xB9EYn',
                  'BV1ziSjBiEpQ',
                  'BV1XmUhBhEHx',
                  'BV1MiUrBSEjT',
                  'BV1fpCxByEBY',
                  'BV19o1DBLEEu',
                  'BV1Tk2MBSEAA',
                  'BV1KCyDBwEf4',
                  'BV1yDsSzZEhd',
                  'BV1UFsBzPE6f',
                  'BV1cJWpzGEiC',
                  'BV1vj4yzeE7q',
                  'BV17vxDzQEnR',
                  'BV126nCzqEdM',
                  'BV1ZnnpzfEZa',
                  'BV1G8WTzJEGY',
                  'BV1f5HfzYEcw',
                  'BV11raozYEFn',
                  'BV1ujaNzfEDA',
                  'BV13rhmzUE6V',
                  'BV1zdejzUEe5',
                  'BV1QHeczdEhE',
                  'BV1cZtfzdEXv',
                  'BV1BXbPzeEdy',
                  'BV1XYtwz1EUa',
                  'BV1vC81z1E7b',
                  'BV1oJbSz9Ebn'
                ]
        
                const results = []
        
                for (const bvid of bvList) {
                  const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
        
                  const resp = await fetch(apiUrl, {
                    headers: {
                      'User-Agent': 'Mozilla/5.0',
                      'Referer': 'https://www.bilibili.com'
                    }
                  })
        
                  const json = await resp.json()
                  if (json.code === 0) {
                    const data = json.data
                    results.push({
                      bvid,
                      title: data.title,
                      cover: `https://dataapi.kabikingu.com/image?url=${encodeURIComponent(data.pic)}`,
                      pubdate: data.pubdate
                    })
                  }
                }
        
                return new Response(
                  JSON.stringify({
                    mid,
                    count: results.length,
                    videos: results
                  }),
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*'
                    }
                  }
                )
              }
  
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