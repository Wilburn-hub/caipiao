'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Footer } from '../../components';
import styles from '../../styles';
import { fadeIn, staggerContainer } from '../../utils/motion';
import Link from 'next/link';

const LotteryResults = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lotteryResults, setLotteryResults] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  
  // 模拟获取开奖数据
  useEffect(() => {
    const fetchLotteryResults = async () => {
      try {
        setIsLoading(true);
        
        // 使用API路由获取数据
        const response = await fetch('/api/lottery-results');
        
        if (!response.ok) {
          throw new Error('获取彩票数据失败');
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          console.log('成功获取彩票数据:', data.results.length, '条记录');
          setLotteryResults(data.results);
          setLastUpdated(data.lastUpdated || '未知');
        } else {
          throw new Error('彩票数据格式不正确');
        }
      } catch (error) {
        console.error('获取彩票数据时出错:', error);
        // 显示错误信息
        setLotteryResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLotteryResults();
    
    // 设置定时刷新（每30分钟刷新一次）
    const refreshInterval = setInterval(() => {
      console.log('定时刷新彩票数据...');
      fetchLotteryResults();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // 根据选项卡筛选彩票结果
  const filteredResults = lotteryResults.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === activeTab;
  });
  
  // 格式化号码显示
  const formatNumbers = (reds, blues) => {
    let result = reds.map(num => (
      <span key={`red-${num}`} className="inline-block w-[30px] h-[30px] leading-[30px] text-center rounded-full bg-red-500 text-white mr-[5px]">
        {num.toString().padStart(2, '0')}
      </span>
    ));
    
    if (blues && blues.length > 0) {
      result = [
        ...result,
        <span key="separator" className="mx-[5px]">|</span>,
        ...blues.map(num => (
          <span key={`blue-${num}`} className="inline-block w-[30px] h-[30px] leading-[30px] text-center rounded-full bg-blue-500 text-white mr-[5px]">
            {num.toString().padStart(2, '0')}
          </span>
        ))
      ];
    }
    
    return result;
  };
  
  return (
    <div className="bg-primary-black overflow-hidden min-h-screen">
      <Navbar />
      
      <section className={`${styles.paddings} relative z-10`}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className={`${styles.innerWidth} mx-auto flex flex-col`}
        >
          <motion.h1
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="text-center text-white font-bold text-[32px] sm:text-[40px] mb-[50px]"
          >
            彩票开奖结果
          </motion.h1>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.25, 1)}
            className="flex justify-center mb-[30px]"
          >
            <Link 
              href="/lottery-history"
              className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] px-[20px] rounded-[10px] flex items-center gap-[10px] transition-colors"
            >
              <span>查看历史开奖记录</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </motion.div>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 1)}
            className="bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px]"
          >
            <div className="flex flex-wrap gap-[15px] mb-[30px] overflow-x-auto pb-[10px]">
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === 'all' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('all')}
              >
                全部彩种
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === '双色球' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('双色球')}
              >
                双色球
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === '福彩3D' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('福彩3D')}
              >
                福彩3D
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === '七乐彩' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('七乐彩')}
              >
                七乐彩
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === '大乐透' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('大乐透')}
              >
                大乐透
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === '排列三' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('排列三')}
              >
                排列三
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === '排列五' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('排列五')}
              >
                排列五
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${activeTab === '七星彩' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setActiveTab('七星彩')}
              >
                七星彩
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-[50px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : lotteryResults.length === 0 ? (
              <div className="text-center text-white py-[50px]">
                <p className="text-[18px]">暂无开奖数据</p>
                <button 
                  className="mt-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[8px] px-[20px] rounded-[10px]"
                  onClick={() => window.location.reload()}
                >
                  刷新页面
                </button>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-[20px]">
                {filteredResults.map((result, index) => (
                  <div key={`${result.type}-${result.period}`} className="bg-[rgba(255,255,255,0.05)] p-[20px] rounded-[15px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[15px]">
                      <div className="flex items-center mb-[10px] sm:mb-0">
                        <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-[#ff5e5e] to-[#ffcc00] flex items-center justify-center mr-[10px]">
                          <span className="text-white font-bold">{result.type.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-[18px]">{result.type}</h3>
                          <p className="text-white/60 text-[14px]">第 {result.period} 期</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-white">{result.date}</p>
                        <p className="text-white/60 text-[14px]">开奖日期：{result.drawTime}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[rgba(0,0,0,0.2)] p-[15px] rounded-[10px]">
                      <p className="text-white mb-[10px]">开奖号码：</p>
                      <div className="flex flex-wrap">
                        {formatNumbers(result.numbers.red, result.numbers.blue)}
                      </div>
                    </div>
                    
                    <div className="mt-[15px] flex justify-between">
                      <button className="text-[#ffcc00] hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-[5px]">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        查看详情
                      </button>
                      <button className="text-[#ffcc00] hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-[5px]">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                        投注此彩种
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[rgba(255,255,255,0.05)] p-[30px] rounded-[10px] text-center">
                <p className="text-white/60">暂无开奖数据</p>
              </div>
            )}
            
            <div className="mt-[30px] flex justify-center">
              <button className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] px-[20px] rounded-[10px] transition-colors">
                查看历史开奖
              </button>
            </div>
          </motion.div>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.4, 1)}
            className="mt-[30px] bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px]"
          >
            <h2 className="text-white font-bold text-[24px] mb-[20px]">开奖日历</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="bg-[rgba(255,255,255,0.1)]">
                  <tr>
                    <th className="p-[10px] text-left">彩种</th>
                    <th className="p-[10px] text-left">周一</th>
                    <th className="p-[10px] text-left">周二</th>
                    <th className="p-[10px] text-left">周三</th>
                    <th className="p-[10px] text-left">周四</th>
                    <th className="p-[10px] text-left">周五</th>
                    <th className="p-[10px] text-left">周六</th>
                    <th className="p-[10px] text-left">周日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="p-[10px]">双色球</td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-[10px]">福彩3D</td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-[10px]">七乐彩</td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]"></td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-[10px]">大乐透</td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-[10px]">排列三/五</td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[10px]">七星彩</td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                    <td className="p-[10px]"></td>
                    <td className="p-[10px]">
                      <span className="inline-block w-[20px] h-[20px] bg-red-500 rounded-full"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
          
          <div className="text-center text-white text-[14px] mb-[20px]">
            数据更新时间: {lastUpdated}
          </div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LotteryResults; 