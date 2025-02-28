import { NextResponse } from 'next/server';
import axios from 'axios';

// 缓存机制
const historyCache = {};
const CACHE_DURATION = 86400000; // 24小时缓存

export async function GET(request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const lotteryType = searchParams.get('type') || '双色球';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    // 缓存键
    const cacheKey = `${lotteryType}_${page}_${pageSize}`;
    
    // 检查缓存
    if (historyCache[cacheKey] && (Date.now() - historyCache[cacheKey].timestamp < CACHE_DURATION)) {
      console.log(`返回缓存的历史开奖数据: ${cacheKey}`);
      return NextResponse.json(historyCache[cacheKey].data);
    }
    
    console.log(`开始获取${lotteryType}历史开奖数据...`);
    
    // 根据彩票类型选择API
    let apiUrl = '';
    let gameNo = '';
    
    if (lotteryType === '双色球') {
      gameNo = '01';
    } else if (lotteryType === '福彩3D') {
      gameNo = '44';
    } else if (lotteryType === '大乐透') {
      gameNo = '85';
    } else if (lotteryType === '排列三') {
      gameNo = '35';
    } else if (lotteryType === '排列五') {
      gameNo = '350133';
    } else {
      // 默认双色球
      gameNo = '01';
    }
    
    apiUrl = `https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=${gameNo}&provinceId=0&pageSize=${pageSize}&isVerify=1&pageNo=${page}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.sporttery.cn/',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.status !== 200 || !response.data || !response.data.value || !response.data.value.list) {
      throw new Error('API返回数据格式不正确');
    }
    
    // 解析数据
    const apiData = response.data.value;
    const results = [];
    
    // 处理数据
    apiData.list.forEach(item => {
      let redNumbers = [];
      let blueNumbers = [];
      
      if (lotteryType === '双色球') {
        redNumbers = item.lotteryDrawResult.split(' ').slice(0, 6).map(num => parseInt(num));
        blueNumbers = [parseInt(item.lotteryDrawResult.split(' ')[6])];
      } else if (lotteryType === '大乐透') {
        redNumbers = item.lotteryDrawResult.split(' ').slice(0, 5).map(num => parseInt(num));
        blueNumbers = item.lotteryDrawResult.split(' ').slice(5).map(num => parseInt(num));
      } else {
        // 福彩3D, 排列三, 排列五
        redNumbers = item.lotteryDrawResult.split(' ').map(num => parseInt(num));
      }
      
      results.push({
        type: lotteryType,
        period: item.lotteryDrawNum,
        date: item.lotteryDrawTime.split(' ')[0],
        numbers: {
          red: redNumbers,
          blue: blueNumbers
        },
        poolAmount: item.poolBalanceAfterdraw || '未知',
        salesAmount: item.totalSaleAmount || '未知'
      });
    });
    
    // 构建响应数据
    const responseData = {
      type: lotteryType,
      page,
      pageSize,
      total: apiData.total || results.length,
      results
    };
    
    // 更新缓存
    historyCache[cacheKey] = {
      data: responseData,
      timestamp: Date.now()
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('获取历史开奖数据失败:', error);
    
    // 返回静态数据
    const staticData = {
      type: lotteryType,
      page,
      pageSize,
      total: 100,
      results: [
        {
          type: '双色球',
          period: '2023135',
          date: '2023-11-14',
          numbers: {
            red: [3, 10, 11, 19, 28, 33],
            blue: [6]
          },
          poolAmount: '10.36亿',
          salesAmount: '4.28亿'
        },
        {
          type: '双色球',
          period: '2023134',
          date: '2023-11-12',
          numbers: {
            red: [1, 7, 15, 24, 26, 31],
            blue: [10]
          },
          poolAmount: '10.21亿',
          salesAmount: '4.15亿'
        }
      ],
      error: '获取实时数据失败，显示静态数据'
    };
    
    return NextResponse.json(staticData);
  }
} 