'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '../../components';
import styles from '../../styles';
import { fadeIn, staggerContainer } from '../../utils/motion';

const Orders = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'lottery', 'recharge'
  
  // 检查用户是否已登录
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        
        // 获取订单数据
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
      }
    } else {
      // 如果用户未登录，重定向到首页
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // 过滤订单
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.type === filter;
  });
  
  if (isLoading) {
    return (
      <div className="bg-primary-black min-h-screen flex items-center justify-center">
        <div className="text-white text-[24px]">加载中...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="bg-primary-black min-h-screen flex items-center justify-center">
        <div className="text-white text-[24px]">请先登录</div>
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
          <motion.h1
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="text-center text-white font-bold text-[32px] sm:text-[40px] mb-[50px]"
          >
            我的订单
          </motion.h1>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 1)}
            className="bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px]"
          >
            <div className="flex flex-wrap gap-[15px] mb-[30px]">
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] ${filter === 'all' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setFilter('all')}
              >
                全部订单
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] ${filter === 'lottery' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setFilter('lottery')}
              >
                购彩订单
              </button>
              <button 
                className={`py-[8px] px-[20px] rounded-[20px] ${filter === 'recharge' ? 'bg-[#ffcc00] text-black font-bold' : 'bg-[rgba(255,255,255,0.1)] text-white'}`}
                onClick={() => setFilter('recharge')}
              >
                充值记录
              </button>
            </div>
            
            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead className="bg-[rgba(255,255,255,0.1)]">
                    <tr>
                      <th className="p-[10px] text-left">订单号</th>
                      <th className="p-[10px] text-left">类型</th>
                      <th className="p-[10px] text-left">金额</th>
                      <th className="p-[10px] text-left">时间</th>
                      <th className="p-[10px] text-left">状态</th>
                      <th className="p-[10px] text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="border-b border-white/10">
                        <td className="p-[10px]">{order.id}</td>
                        <td className="p-[10px]">
                          {order.type === 'lottery' ? (
                            <span className="px-[8px] py-[2px] rounded-full text-[12px] bg-blue-500/20 text-blue-400">
                              {order.game || '购彩'}
                            </span>
                          ) : (
                            <span className="px-[8px] py-[2px] rounded-full text-[12px] bg-green-500/20 text-green-400">
                              充值
                            </span>
                          )}
                        </td>
                        <td className="p-[10px]">¥{order.amount.toFixed(2)}</td>
                        <td className="p-[10px]">{formatDate(order.date)}</td>
                        <td className="p-[10px]">
                          <span className="px-[8px] py-[2px] rounded-full text-[12px] bg-green-500/20 text-green-400">
                            {order.type === 'lottery' ? '已出票' : '充值成功'}
                          </span>
                        </td>
                        <td className="p-[10px]">
                          {order.type === 'lottery' && (
                            <button 
                              className="text-[#ffcc00] hover:underline"
                              onClick={() => router.push(`/order-detail?id=${order.id}`)}
                            >
                              查看详情
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-[rgba(255,255,255,0.05)] p-[30px] rounded-[10px] text-center">
                <p className="text-white/60 mb-[20px]">暂无订单记录</p>
                {filter === 'lottery' || filter === 'all' ? (
                  <button 
                    className="bg-[#ffcc00] text-black font-bold py-[10px] px-[20px] rounded-[5px] hover:bg-[#ffdd33] transition-colors"
                    onClick={() => router.push('/purchase')}
                  >
                    立即购彩
                  </button>
                ) : (
                  <button 
                    className="bg-[#ffcc00] text-black font-bold py-[10px] px-[20px] rounded-[5px] hover:bg-[#ffdd33] transition-colors"
                    onClick={() => router.push('/profile')}
                  >
                    去充值
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Orders; 