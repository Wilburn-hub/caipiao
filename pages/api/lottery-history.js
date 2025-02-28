import axios from 'axios';
import cheerio from 'cheerio';

// 缓存机制
const historyCache = {};
const CACHE_DURATION = 86400000; // 24小时缓存

export default async function handler(req, res) {
  try {
    // 获取查询参数
    const { type = '双色球', page = 1, pageSize = 10 } = req.query;
    const lotteryType = String(type);
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    
    // 缓存键
    const cacheKey = `${lotteryType}_${pageNum}_${pageSizeNum}`;
    
    // 检查缓存
    if (historyCache[cacheKey] && (Date.now() - historyCache[cacheKey].timestamp < CACHE_DURATION)) {
      console.log(`返回缓存的历史开奖数据: ${cacheKey}`);
      return res.status(200).json(historyCache[cacheKey].data);
    }
    
    // 返回静态数据用于测试
    const staticData = {
      type: lotteryType,
      page: pageNum,
      pageSize: pageSizeNum,
      total: 100,
      results: [
       
      ],
      source: '测试数据'
    };
    
    // 更新缓存
    historyCache[cacheKey] = {
      data: staticData,
      timestamp: Date.now()
    };
    
    return res.status(200).json(staticData);
  } catch (error) {
    console.error('API处理失败:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 