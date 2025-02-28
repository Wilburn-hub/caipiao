'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Footer } from '../../components';
import styles from '../../styles';
import { fadeIn, staggerContainer } from '../../utils/motion';

const LotteryHistory = () => {
  const [selectedType, setSelectedType] = useState('双色球');
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  
  const lotteryTypes = [
    '双色球', '福彩3D', '七乐彩', '大乐透', '排列三', '排列五', '七星彩'
  ];
  
  // 获取历史开奖数据
  const fetchHistoryData = async (type, page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 使用API路由获取数据
      const response = await fetch(`/api/lottery-history?type=${type}&page=${page}&pageSize=10`);
      
      if (!response.ok) {
        throw new Error('获取历史开奖数据失败');
      }
      
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('历史开奖数据格式不正确');
      }
      
      setHistoryData(data.results);
      
      // 计算总页数
      const total = data.total || data.results.length;
      const pageSize = data.pageSize || 10;
      setTotalPages(Math.ceil(total / pageSize));
      
      if (data.error) {
        setError(data.error);
      }
      
      console.log(`成功获取${type}历史开奖数据:`, data.results.length, '条记录');
    } catch (error) {
      console.error('获取历史开奖数据时出错:', error);
      setError('获取历史开奖数据失败，请刷新页面重试');
      setHistoryData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载和类型变更时获取数据
  useEffect(() => {
    fetchHistoryData(selectedType, currentPage);
  }, [selectedType, currentPage]);
  
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
  
  // 处理页面变更
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
            彩票历史开奖查询
          </motion.h1>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 1)}
            className="bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px]"
          >
            {/* 彩票类型选择 */}
            <div className="flex flex-wrap gap-[15px] mb-[30px] overflow-x-auto pb-[10px]">
              {lotteryTypes.map(type => (
                <button 
                  key={type}
                  className={`py-[8px] px-[20px] rounded-[20px] whitespace-nowrap ${selectedType === type ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                  onClick={() => {
                    setSelectedType(type);
                    setCurrentPage(1);
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* 历史开奖数据表格 */}
            {isLoading ? (
              <div className="flex justify-center items-center py-[50px]">
                <div className="animate-spin rounded-full h-[50px] w-[50px] border-t-2 border-b-2 border-[#ffcc00]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 text-red-400 p-[15px] rounded-[10px] mb-[20px]">
                {error}
              </div>
            ) : historyData.length === 0 ? (
              <div className="text-center text-white/60 py-[50px]">
                暂无历史开奖数据
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="bg-[rgba(255,255,255,0.1)]">
                      <th className="p-[10px] text-left">期号</th>
                      <th className="p-[10px] text-left">开奖日期</th>
                      <th className="p-[10px] text-left">开奖号码</th>
                      {(selectedType === '双色球' || selectedType === '福彩3D' || selectedType === '七乐彩') && (
                        <>
                          <th className="p-[10px] text-left">奖池金额</th>
                          <th className="p-[10px] text-left">销售金额</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="p-[10px]">{item.period}</td>
                        <td className="p-[10px]">{item.date}</td>
                        <td className="p-[10px]">
                          <div className="flex flex-wrap items-center">
                            {formatNumbers(item.numbers.red, item.numbers.blue)}
                          </div>
                        </td>
                        {(selectedType === '双色球' || selectedType === '福彩3D' || selectedType === '七乐彩') && (
                          <>
                            <td className="p-[10px]">{item.poolAmount || '-'}</td>
                            <td className="p-[10px]">{item.salesAmount || '-'}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* 分页控制 */}
            <div className="flex justify-center items-center mt-[30px]">
              <button 
                className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[8px] px-[15px] rounded-l-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                上一页
              </button>
              
              <div className="bg-[rgba(255,255,255,0.15)] text-white py-[8px] px-[15px]">
                {currentPage} / {totalPages}
              </div>
              
              <button 
                className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[8px] px-[15px] rounded-r-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                下一页
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LotteryHistory; 