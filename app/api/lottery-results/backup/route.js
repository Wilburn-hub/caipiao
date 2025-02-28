import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    console.log('使用备用数据源爬取彩票开奖数据...');
    
    // 使用备用数据源
    const response = await axios.get('https://www.zhcw.com/kjxx/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000
    });
    
    // 使用 cheerio 解析 HTML
    const $ = cheerio.load(response.data);
    const results = [];
    
    // 双色球开奖结果解析
    $('.kj_ball_list').each((index, element) => {
      const $element = $(element);
      const title = $element.prev('.kj_title').text().trim();
      
      if (title.includes('双色球')) {
        const redBalls = [];
        const blueBalls = [];
        
        $element.find('.red_ball').each((i, ball) => {
          redBalls.push(parseInt($(ball).text().trim()));
        });
        
        $element.find('.blue_ball').each((i, ball) => {
          blueBalls.push(parseInt($(ball).text().trim()));
        });
        
        // 获取期号和日期
        const infoText = $element.prev('.kj_title').find('.kj_date').text().trim();
        const periodMatch = infoText.match(/第(\d+)期/);
        const dateMatch = infoText.match(/(\d{4}-\d{2}-\d{2})/);
        
        const period = periodMatch ? periodMatch[1] : '';
        const date = dateMatch ? dateMatch[1] : '';
        
        results.push({
          type: '双色球',
          period,
          date,
          numbers: {
            red: redBalls,
            blue: blueBalls
          },
          drawTime: '二、四、日'
        });
      }
      
      // 福彩3D开奖结果解析
      if (title.includes('福彩3D')) {
        const redBalls = [];
        
        $element.find('.red_ball').each((i, ball) => {
          redBalls.push(parseInt($(ball).text().trim()));
        });
        
        // 获取期号和日期
        const infoText = $element.prev('.kj_title').find('.kj_date').text().trim();
        const periodMatch = infoText.match(/第(\d+)期/);
        const dateMatch = infoText.match(/(\d{4}-\d{2}-\d{2})/);
        
        const period = periodMatch ? periodMatch[1] : '';
        const date = dateMatch ? dateMatch[1] : '';
        
        results.push({
          type: '福彩3D',
          period,
          date,
          numbers: {
            red: redBalls,
            blue: []
          },
          drawTime: '每日'
        });
      }
      
      // 七乐彩开奖结果解析
      if (title.includes('七乐彩')) {
        const redBalls = [];
        const blueBalls = [];
        
        $element.find('.red_ball').each((i, ball) => {
          redBalls.push(parseInt($(ball).text().trim()));
        });
        
        $element.find('.blue_ball').each((i, ball) => {
          blueBalls.push(parseInt($(ball).text().trim()));
        });
        
        // 获取期号和日期
        const infoText = $element.prev('.kj_title').find('.kj_date').text().trim();
        const periodMatch = infoText.match(/第(\d+)期/);
        const dateMatch = infoText.match(/(\d{4}-\d{2}-\d{2})/);
        
        const period = periodMatch ? periodMatch[1] : '';
        const date = dateMatch ? dateMatch[1] : '';
        
        results.push({
          type: '七乐彩',
          period,
          date,
          numbers: {
            red: redBalls,
            blue: blueBalls
          },
          drawTime: '一、三、五'
        });
      }
    });
    
    console.log(`备用数据源成功提取 ${results.length} 条彩票开奖数据`);
    
    if (results.length === 0) {
      throw new Error('未能从备用数据源提取到有效数据');
    }
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('备用数据源爬取失败:', error);
    
    // 返回模拟数据
    const mockResults = [
      {
        type: '双色球',
        period: '2025021',
        date: '2025-02-27',
        numbers: {
          red: [7, 8, 16, 18, 25, 312],
          blue: [14]
        },
        drawTime: '二、四、日'
      },
      {
        type: '福彩3D',
        period: '2025049',
        date: '2025-02-28',
        numbers: {
          red: [0, 0, 4],
          blue: []
        },
        drawTime: '每日'
      },
      {
        type: '七乐彩',
        period: '2025021',
        date: '2025-02-28',
        numbers: {
          red: [2, 3, 5, 6, 11, 13, 24],
          blue: [26]
        },
        drawTime: '一、三、五'
      },
      {
        type: '大乐透',
        period: '2025020',
        date: '2025-02-26',
        numbers: {
          red: [1, 9, 12, 22, 29],
          blue: [5, 9]
        },
        drawTime: '一、三、六'
      }
    ];
    
    return NextResponse.json(
      { results: mockResults, error: '备用数据源爬取失败，显示模拟数据' },
      { status: 200 }
    );
  }
} 