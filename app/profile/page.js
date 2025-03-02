'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '../../components';
import styles from '../../styles';
import { fadeIn, staggerContainer } from '../../utils/motion';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 检查用户是否已登录
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // 如果用户数据中没有余额，则设置初始余额为10000
        if (userData && !userData.balance) {
          userData.balance = 10000;
          localStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData);
        
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
  
  // 处理头像加载错误
  const handleAvatarError = () => {
    setAvatarError(true);
  };
  
  // 获取头像URL
  const getAvatarUrl = () => {
    if (avatarError || !user?.avatar) {
      return '/default-avatar.png';
    }
    return user.avatar;
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // 充值余额
  const handleRecharge = (amount) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: (user.balance || 0) + amount
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // 添加充值记录
      const newOrder = {
        id: `R${Date.now()}`,
        type: 'recharge',
        amount: amount,
        date: new Date().toISOString(),
        status: 'success'
      };
      
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      alert(`充值成功！已充值 ¥${amount.toFixed(2)}`);
    }
  };
  
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
            个人中心
          </motion.h1>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 1)}
            className="flex flex-col md:flex-row gap-[30px]"
          >
            {/* 左侧用户信息 */}
            <div className="md:w-[300px] bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px] h-fit">
              <div className="flex flex-col items-center mb-[30px]">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-[#ffcc00] bg-gray-700 flex items-center justify-center mb-[15px]">
                  <img 
                    src={getAvatarUrl()}
                    alt="用户头像" 
                    className="w-full h-full object-cover"
                    onError={handleAvatarError}
                  />
                </div>
                <h2 className="text-white text-[24px] font-bold">{user.username}</h2>
                <p className="text-[#ffcc00] mt-[5px]">普通会员</p>
              </div>
              
              <div className="bg-[rgba(255,255,255,0.1)] p-[15px] rounded-[10px] mb-[20px]">
                <div className="flex justify-between items-center mb-[10px]">
                  <span className="text-white">账户余额</span>
                  <span className="text-[#ffcc00] font-bold">¥{user.balance?.toFixed(2) || '0.00'}</span>
                </div>
                <button 
                  className="w-full bg-[#ffcc00] text-black font-bold py-[8px] rounded-[5px] hover:bg-[#ffdd33] transition-colors"
                  onClick={() => setActiveTab('recharge')}
                >
                  立即充值
                </button>
              </div>
              
              <div className="flex flex-col gap-[10px]">
                <button 
                  className={`text-left p-[10px] rounded-[5px] ${activeTab === 'account' ? 'bg-[rgba(255,204,0,0.2)] text-[#ffcc00]' : 'text-white hover:bg-[rgba(255,255,255,0.1)]'} transition-colors`}
                  onClick={() => setActiveTab('account')}
                >
                  账户信息
                </button>
                <button 
                  className={`text-left p-[10px] rounded-[5px] ${activeTab === 'orders' ? 'bg-[rgba(255,204,0,0.2)] text-[#ffcc00]' : 'text-white hover:bg-[rgba(255,255,255,0.1)]'} transition-colors`}
                  onClick={() => setActiveTab('orders')}
                >
                  购彩记录
                </button>
                <button 
                  className={`text-left p-[10px] rounded-[5px] ${activeTab === 'recharge' ? 'bg-[rgba(255,204,0,0.2)] text-[#ffcc00]' : 'text-white hover:bg-[rgba(255,255,255,0.1)]'} transition-colors`}
                  onClick={() => setActiveTab('recharge')}
                >
                  充值中心
                </button>
                <button 
                  className={`text-left p-[10px] rounded-[5px] ${activeTab === 'settings' ? 'bg-[rgba(255,204,0,0.2)] text-[#ffcc00]' : 'text-white hover:bg-[rgba(255,255,255,0.1)]'} transition-colors`}
                  onClick={() => setActiveTab('settings')}
                >
                  账户设置
                </button>
              </div>
            </div>
            
            {/* 右侧内容区 */}
            <div className="flex-1 bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px]">
              {/* 账户信息 */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-white text-[24px] font-bold mb-[20px]">账户信息</h2>
                  
                  <div className="bg-[rgba(255,255,255,0.05)] p-[20px] rounded-[10px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                      <div>
                        <p className="text-white/60 mb-[5px]">用户名</p>
                        <p className="text-white">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-[5px]">账户余额</p>
                        <p className="text-[#ffcc00] font-bold">¥{user.balance?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-[5px]">会员等级</p>
                        <p className="text-white">普通会员</p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-[5px]">注册时间</p>
                        <p className="text-white">{formatDate(user.registerDate || new Date().toISOString())}</p>
                      </div>
                    </div>
                    
                    <div className="mt-[30px]">
                      <h3 className="text-white text-[18px] font-bold mb-[15px]">账户安全</h3>
                      <div className="flex items-center justify-between p-[15px] border-b border-white/10">
                        <div>
                          <p className="text-white">登录密码</p>
                          <p className="text-white/60 text-[14px]">定期修改密码可以保护账户安全</p>
                        </div>
                        <button className="text-[#ffcc00] hover:underline">修改</button>
                      </div>
                      <div className="flex items-center justify-between p-[15px] border-b border-white/10">
                        <div>
                          <p className="text-white">手机绑定</p>
                          <p className="text-white/60 text-[14px]">未绑定</p>
                        </div>
                        <button className="text-[#ffcc00] hover:underline">绑定</button>
                      </div>
                      <div className="flex items-center justify-between p-[15px]">
                        <div>
                          <p className="text-white">实名认证</p>
                          <p className="text-white/60 text-[14px]">未认证</p>
                        </div>
                        <button className="text-[#ffcc00] hover:underline">认证</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 购彩记录 */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-white text-[24px] font-bold mb-[20px]">购彩记录</h2>
                  
                  {orders.filter(order => order.type === 'lottery').length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-white">
                        <thead className="bg-[rgba(255,255,255,0.1)]">
                          <tr>
                            <th className="p-[10px] text-left">订单号</th>
                            <th className="p-[10px] text-left">彩种</th>
                            <th className="p-[10px] text-left">金额</th>
                            <th className="p-[10px] text-left">购买时间</th>
                            <th className="p-[10px] text-left">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders
                            .filter(order => order.type === 'lottery')
                            .map(order => (
                              <tr key={order.id} className="border-b border-white/10">
                                <td className="p-[10px]">{order.id}</td>
                                <td className="p-[10px]">{order.game}</td>
                                <td className="p-[10px]">¥{order.amount.toFixed(2)}</td>
                                <td className="p-[10px]">{formatDate(order.date)}</td>
                                <td className="p-[10px]">
                                  <span className={`px-[8px] py-[2px] rounded-full text-[12px] ${
                                    order.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {order.status === 'success' ? '已出票' :
                                     order.status === 'pending' ? '出票中' : '出票失败'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-[rgba(255,255,255,0.05)] p-[30px] rounded-[10px] text-center">
                      <p className="text-white/60 mb-[20px]">暂无购彩记录</p>
                      <button 
                        className="bg-[#ffcc00] text-black font-bold py-[10px] px-[20px] rounded-[5px] hover:bg-[#ffdd33] transition-colors"
                        onClick={() => router.push('/purchase')}
                      >
                        立即购彩
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* 充值中心 */}
              {activeTab === 'recharge' && (
                <div>
                  <h2 className="text-white text-[24px] font-bold mb-[20px]">充值中心</h2>
                  
                  <div className="bg-[rgba(255,255,255,0.05)] p-[20px] rounded-[10px] mb-[20px]">
                    <p className="text-white mb-[15px]">当前余额：<span className="text-[#ffcc00] font-bold">¥{user.balance?.toFixed(2) || '0.00'}</span></p>
                    
                    <div className="grid grid-cols-3 gap-[10px] mb-[20px]">
                      <button 
                        className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] rounded-[5px] transition-colors"
                        onClick={() => handleRecharge(50)}
                      >
                        ¥50
                      </button>
                      <button 
                        className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] rounded-[5px] transition-colors"
                        onClick={() => handleRecharge(100)}
                      >
                        ¥100
                      </button>
                      <button 
                        className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] rounded-[5px] transition-colors"
                        onClick={() => handleRecharge(200)}
                      >
                        ¥200
                      </button>
                      <button 
                        className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] rounded-[5px] transition-colors"
                        onClick={() => handleRecharge(500)}
                      >
                        ¥500
                      </button>
                      <button 
                        className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] rounded-[5px] transition-colors"
                        onClick={() => handleRecharge(1000)}
                      >
                        ¥1000
                      </button>
                      <button 
                        className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[10px] rounded-[5px] transition-colors"
                        onClick={() => handleRecharge(5000)}
                      >
                        ¥5000
                      </button>
                    </div>
                    
                    <div className="flex gap-[10px] mb-[20px]">
                      <input
                        type="number"
                        placeholder="输入充值金额"
                        className="flex-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
                        min="1"
                        step="1"
                        id="customRechargeAmount"
                      />
                      <button 
                        className="bg-[#ffcc00] text-black font-bold py-[10px] px-[20px] rounded-[5px] hover:bg-[#ffdd33] transition-colors whitespace-nowrap"
                        onClick={() => {
                          const input = document.getElementById('customRechargeAmount');
                          const amount = parseFloat(input.value);
                          if (!isNaN(amount) && amount > 0) {
                            handleRecharge(amount);
                            input.value = '';
                          } else {
                            alert('请输入有效的充值金额');
                          }
                        }}
                      >
                        确认充值
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white text-[18px] font-bold mb-[15px]">充值记录</h3>
                    
                    {orders.filter(order => order.type === 'recharge').length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-white">
                          <thead className="bg-[rgba(255,255,255,0.1)]">
                            <tr>
                              <th className="p-[10px] text-left">订单号</th>
                              <th className="p-[10px] text-left">金额</th>
                              <th className="p-[10px] text-left">充值时间</th>
                              <th className="p-[10px] text-left">状态</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders
                              .filter(order => order.type === 'recharge')
                              .map(order => (
                                <tr key={order.id} className="border-b border-white/10">
                                  <td className="p-[10px]">{order.id}</td>
                                  <td className="p-[10px]">¥{order.amount.toFixed(2)}</td>
                                  <td className="p-[10px]">{formatDate(order.date)}</td>
                                  <td className="p-[10px]">
                                    <span className="px-[8px] py-[2px] rounded-full text-[12px] bg-green-500/20 text-green-400">
                                      充值成功
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-[rgba(255,255,255,0.05)] p-[20px] rounded-[10px] text-center">
                        <p className="text-white/60">暂无充值记录</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 账户设置 */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-white text-[24px] font-bold mb-[20px]">账户设置</h2>
                  
                  <div className="bg-[rgba(255,255,255,0.05)] p-[20px] rounded-[10px]">
                    <div className="mb-[30px]">
                      <h3 className="text-white text-[18px] font-bold mb-[15px]">个人资料</h3>
                      
                      <div className="grid grid-cols-1 gap-[20px]">
                        <div>
                          <label className="block text-white/80 mb-[8px]">用户名</label>
                          <input
                            type="text"
                            value={user.username}
                            readOnly
                            className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 mb-[8px]">头像</label>
                          <div className="flex items-center gap-[15px]">
                            <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-[#ffcc00] bg-gray-700 flex items-center justify-center">
                              <img 
                                src={getAvatarUrl()}
                                alt="用户头像" 
                                className="w-full h-full object-cover"
                                onError={handleAvatarError}
                              />
                            </div>
                            <button className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[8px] px-[15px] rounded-[5px] transition-colors">
                              更换头像
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white/80 mb-[8px]">手机号码</label>
                          <div className="flex gap-[10px]">
                            <input
                              type="text"
                              placeholder="请绑定手机号码"
                              className="flex-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
                            />
                            <button className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[8px] px-[15px] rounded-[5px] transition-colors whitespace-nowrap">
                              绑定手机
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white text-[18px] font-bold mb-[15px]">修改密码</h3>
                      
                      <div className="grid grid-cols-1 gap-[20px]">
                        <div>
                          <label className="block text-white/80 mb-[8px]">当前密码</label>
                          <input
                            type="password"
                            placeholder="请输入当前密码"
                            className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 mb-[8px]">新密码</label>
                          <input
                            type="password"
                            placeholder="请输入新密码"
                            className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 mb-[8px]">确认新密码</label>
                          <input
                            type="password"
                            placeholder="请再次输入新密码"
                            className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
                          />
                        </div>
                        
                        <div>
                          <button className="bg-[#ffcc00] text-black font-bold py-[10px] px-[20px] rounded-[5px] hover:bg-[#ffdd33] transition-colors">
                            保存修改
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Profile; 