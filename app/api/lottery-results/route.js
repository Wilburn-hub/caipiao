import { NextResponse } from 'next/server';
import axios from 'axios';

// 缓存机制
let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 3600000; // 缓存1小时

export async function GET() {
  try {
    // 检查缓存是否有效
    const now = Date.now();
    if (cachedData && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
      console.log('返回缓存的彩票数据');
      return NextResponse.json({ results: cachedData, lastUpdated: new Date(lastFetchTime).toLocaleString() });
    }

    console.log('开始获取彩票开奖数据...');
    
    // 使用开放API获取数据
    // 这里使用了一个公开的彩票API，您可能需要替换为其他可用的API
    const apiUrl = 'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=30&isVerify=1&pageNo=1';
    
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
    const apiData = response.data.value.list;
    const results = [];
    
    // 处理大乐透数据
    apiData.forEach(item => {
      const redNumbers = item.lotteryDrawResult.split(' ').slice(0, 5).map(num => parseInt(num));
      const blueNumbers = item.lotteryDrawResult.split(' ').slice(5).map(num => parseInt(num));
      
      results.push({
        type: '大乐透',
        period: item.lotteryDrawNum,
        date: item.lotteryDrawTime.split(' ')[0],
        numbers: {
          red: redNumbers,
          blue: blueNumbers
        },
        drawTime: '一、三、六',
        poolAmount: item.poolBalanceAfterdraw || '未知',
        salesAmount: item.totalSaleAmount || '未知'
      });
    });
    
    // 获取双色球数据
    try {
      const ssqUrl = 'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=01&provinceId=0&pageSize=30&isVerify=1&pageNo=1';
      const ssqResponse = await axios.get(ssqUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.sporttery.cn/',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      if (ssqResponse.status === 200 && ssqResponse.data && ssqResponse.data.value && ssqResponse.data.value.list) {
        const ssqData = ssqResponse.data.value.list;
        
        ssqData.forEach(item => {
          const redNumbers = item.lotteryDrawResult.split(' ').slice(0, 6).map(num => parseInt(num));
          const blueNumbers = [parseInt(item.lotteryDrawResult.split(' ')[6])];
          
          results.push({
            type: '双色球',
            period: item.lotteryDrawNum,
            date: item.lotteryDrawTime.split(' ')[0],
            numbers: {
              red: redNumbers,
              blue: blueNumbers
            },
            drawTime: '二、四、日',
            poolAmount: item.poolBalanceAfterdraw || '未知',
            salesAmount: item.totalSaleAmount || '未知'
          });
        });
      }
    } catch (ssqError) {
      console.error('获取双色球数据失败:', ssqError);
    }
    
    // 获取福彩3D数据
    try {
      const fc3dUrl = 'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=44&provinceId=0&pageSize=30&isVerify=1&pageNo=1';
      const fc3dResponse = await axios.get(fc3dUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.sporttery.cn/',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      if (fc3dResponse.status === 200 && fc3dResponse.data && fc3dResponse.data.value && fc3dResponse.data.value.list) {
        const fc3dData = fc3dResponse.data.value.list;
        
        fc3dData.forEach(item => {
          const redNumbers = item.lotteryDrawResult.split(' ').map(num => parseInt(num));
          
          results.push({
            type: '福彩3D',
            period: item.lotteryDrawNum,
            date: item.lotteryDrawTime.split(' ')[0],
            numbers: {
              red: redNumbers,
              blue: []
            },
            drawTime: '每日',
            poolAmount: item.poolBalanceAfterdraw || '未知',
            salesAmount: item.totalSaleAmount || '未知'
          });
        });
      }
    } catch (fc3dError) {
      console.error('获取福彩3D数据失败:', fc3dError);
    }
    
    // 获取排列三数据
    try {
      const pl3Url = 'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=35&provinceId=0&pageSize=30&isVerify=1&pageNo=1';
      const pl3Response = await axios.get(pl3Url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.sporttery.cn/',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      if (pl3Response.status === 200 && pl3Response.data && pl3Response.data.value && pl3Response.data.value.list) {
        const pl3Data = pl3Response.data.value.list;
        
        pl3Data.forEach(item => {
          const redNumbers = item.lotteryDrawResult.split(' ').map(num => parseInt(num));
          
          results.push({
            type: '排列三',
            period: item.lotteryDrawNum,
            date: item.lotteryDrawTime.split(' ')[0],
            numbers: {
              red: redNumbers,
              blue: []
            },
            drawTime: '每日',
            poolAmount: item.poolBalanceAfterdraw || '未知',
            salesAmount: item.totalSaleAmount || '未知'
          });
        });
      }
    } catch (pl3Error) {
      console.error('获取排列三数据失败:', pl3Error);
    }
    
    // 获取排列五数据
    try {
      const pl5Url = 'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=350133&provinceId=0&pageSize=30&isVerify=1&pageNo=1';
      const pl5Response = await axios.get(pl5Url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.sporttery.cn/',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      if (pl5Response.status === 200 && pl5Response.data && pl5Response.data.value && pl5Response.data.value.list) {
        const pl5Data = pl5Response.data.value.list;
        
        pl5Data.forEach(item => {
          const redNumbers = item.lotteryDrawResult.split(' ').map(num => parseInt(num));
          
          results.push({
            type: '排列五',
            period: item.lotteryDrawNum,
            date: item.lotteryDrawTime.split(' ')[0],
            numbers: {
              red: redNumbers,
              blue: []
            },
            drawTime: '每日',
            poolAmount: item.poolBalanceAfterdraw || '未知',
            salesAmount: item.totalSaleAmount || '未知'
          });
        });
      }
    } catch (pl5Error) {
      console.error('获取排列五数据失败:', pl5Error);
    }
    
    if (results.length === 0) {
      throw new Error('未能获取到任何彩票数据');
    }
    
    // 更新缓存
    cachedData = results;
    lastFetchTime = now;
    
    console.log(`成功获取 ${results.length} 条彩票数据`);
    
    return NextResponse.json({ 
      results: results,
      lastUpdated: new Date().toLocaleString()
    });
  } catch (error) {
    console.error('获取彩票数据失败:', error);
    
    // 如果有缓存数据，返回缓存
    if (cachedData) {
      console.log('返回缓存的彩票数据（出错后）');
      return NextResponse.json({ 
        results: cachedData, 
        lastUpdated: lastFetchTime ? new Date(lastFetchTime).toLocaleString() : '未知',
        error: '获取最新数据失败，显示缓存数据'
      });
    }
    
    // 如果没有缓存，返回静态数据
    const staticResults = [
      {
        type: '双色球',
        period: '2023135',
        date: '2023-11-14',
        numbers: {
          red: [3, 10, 11, 19, 28, 33],
          blue: [6]
        },
        drawTime: '二、四、日'
      },
      {
        type: '福彩3D',
        period: '2023311',
        date: '2023-11-14',
        numbers: {
          red: [5, 8, 9],
          blue: []
        },
        drawTime: '每日'
      },
      {
        type: '大乐透',
        period: '2023135',
        date: '2023-11-15',
        numbers: {
          red: [3, 10, 15, 25, 30],
          blue: [2, 8]
        },
        drawTime: '一、三、六'
      },
      {
        type: '排列三',
        period: '2023315',
        date: '2023-11-15',
        numbers: {
          red: [5, 2, 8],
          blue: []
        },
        drawTime: '每日'
      },
      {
        type: '排列五',
        period: '2023315',
        date: '2023-11-15',
        numbers: {
          red: [5, 2, 8, 3, 6],
          blue: []
        },
        drawTime: '每日'
      }
    ];
    
    return NextResponse.json({ 
      results: staticResults,
      lastUpdated: '2023-11-15',
      error: '获取实时数据失败，显示静态数据'
    });
  }
} 