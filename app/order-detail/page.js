'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar, Footer } from '../../components';
import styles from '../../styles';
import { fadeIn, staggerContainer } from '../../utils/motion';

const OrderDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 检查用户是否已登录并获取订单详情
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        
        // 获取订单数据
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
          const orders = JSON.parse(storedOrders);
          const foundOrder = orders.find(o => o.id === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            // 订单不存在，返回订单列表
            router.push('/orders');
          }
        }
      } catch (e) {
        console.error('Failed to parse data from localStorage', e);
      }
    } else {
      // 如果用户未登录，重定向到首页
      router.push('/');
    }
    setIsLoading(false);
  }, [router, orderId]);
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
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
  
  if (isLoading) {
    return (
      <div className="bg-primary-black min-h-screen flex items-center justify-center">
        <div className="text-white text-[24px]">加载中...</div>
      </div>
    );
  }
  
  if (!user || !order) {
    return (
      <div className="bg-primary-black min-h-screen flex items-center justify-center">
        <div className="text-white text-[24px]">订单不存在或已过期</div>
      </div>
    );
  }
  
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
          <motion.div
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="flex items-center mb-[30px]"
          >
            <button 
              className="flex items-center text-white hover:text-[#ffcc00] transition-colors"
              onClick={() => router.push('/orders')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="ml-[5px]">返回订单列表</span>
            </button>
            <h1 className="text-white font-bold text-[24px] sm:text-[32px] ml-auto">
              订单详情
            </h1>
          </motion.div>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 1)}
            className="bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px]"
          >
            <div className="bg-[rgba(255,255,255,0.05)] p-[20px] rounded-[10px] mb-[30px]">
              <h2 className="text-white text-[20px] font-bold mb-[15px]">订单信息</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                <div>
                  <p className="text-white/60">订单号</p>
                  <p className="text-white">{order.id}</p>
                </div>
                <div>
                  <p className="text-white/60">购买时间</p>
                  <p className="text-white">{formatDate(order.date)}</p>
                </div>
                <div>
                  <p className="text-white/60">彩种</p>
                  <p className="text-white">{order.game}</p>
                </div>
                <div>
                  <p className="text-white/60">状态</p>
                  <p className="text-green-400">已出票</p>
                </div>
                <div>
                  <p className="text-white/60">注数</p>
                  <p className="text-white">{order.betCount}注</p>
                </div>
                <div>
                  <p className="text-white/60">金额</p>
                  <p className="text-[#ffcc00] font-bold">¥{order.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[rgba(255,255,255,0.05)] p-[20px] rounded-[10px]">
              <h2 className="text-white text-[20px] font-bold mb-[15px]">投注详情</h2>
              
              {order.bets && order.bets.length > 0 ? (
                <div className="space-y-[15px]">
                  {order.bets.map((bet, index) => (
                    <div key={index} className="p-[15px] bg-[rgba(255,255,255,0.05)] rounded-[10px]">
                      <div className="flex justify-between items-center mb-[10px]">
                        <span className="text-white">第 {index + 1} 注</span>
                        <span className="text-[#ffcc00]">
                          {order.game === '双色球' && '单式投注'}
                          {order.game === '大乐透' && '单式投注'}
                          {order.game === '福彩3D' && '直选单式'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center">
                        {formatNumbers(bet.reds, bet.blues)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-center py-[20px]">暂无投注详情</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
};

export default OrderDetail; 