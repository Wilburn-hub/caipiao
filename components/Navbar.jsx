'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from '../styles';
import { navVariants } from '../utils/motion';
import Link from 'next/link';
import { LoginModal } from '.';
import { Dropdown } from 'antd';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  
  // 检查本地存储中是否有用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, []);
  
  const handleLogin = (username) => {
    // 使用内置的默认头像，确保它存在
    const userData = { 
      username, 
      avatar: '/default-avatar.png' 
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
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
  
  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div className="absolute w-[50%] inset-0 gradient-01" />
      <div
        className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}
      >
        <Link href="/" className="font-extrabold text-[24px] leading-[30.24px] text-white flex items-center">
          来财✨来财
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/purchase" className="text-white hover:text-[#ffcc00] transition-colors">
            选号购买
          </Link>
          <Link href="#explore" className="text-white hover:text-[#ffcc00] transition-colors">
            彩种介绍
          </Link>
          <Link href="#insights" className="text-white hover:text-[#ffcc00] transition-colors">
            趣味分享
          </Link>
          <Link href="#feedback" className="text-white hover:text-[#ffcc00] transition-colors">
            用户故事
          </Link>
          
          {user ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: <Link href="/profile">个人中心</Link>,
                  },
                  {
                    key: 'orders',
                    label: <Link href="/orders">我的订单</Link>,
                  },
                  {
                    key: 'logout',
                    label: <a onClick={handleLogout}>退出登录</a>,
                  },
                ],
              }}
              placement="bottomRight"
              trigger={['hover']}
            >
              <div className="flex items-center gap-[8px] cursor-pointer">
                <div className="w-[32px] h-[32px] rounded-full overflow-hidden border-2 border-[#ffcc00] bg-gray-700 flex items-center justify-center">
                  <img 
                    src={getAvatarUrl()}
                    alt="用户头像" 
                    className="w-full h-full object-cover"
                    onError={handleAvatarError}
                  />
                </div>
                <span className="text-white">{user.username}</span>
              </div>
            </Dropdown>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-white hover:text-[#ffcc00] transition-colors"
            >
              登录/注册
            </button>
          )}
        </div>
        
        <div className="md:hidden relative">
          <div className="flex items-center gap-[15px]">
            {user ? (
              <div 
                className="w-[32px] h-[32px] rounded-full overflow-hidden border-2 border-[#ffcc00] bg-gray-700 flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <img 
                  src={getAvatarUrl()}
                  alt="用户头像" 
                  className="w-full h-full object-cover"
                  onError={handleAvatarError}
                />
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-white hover:text-[#ffcc00] transition-colors text-[14px]"
              >
                登录
              </button>
            )}
            
            <img
              src="/menu.svg"
              alt="menu"
              className="w-[24px] h-[24px] object-contain cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
          
          {isMenuOpen && (
            <div className="absolute top-[40px] right-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-md p-[20px] rounded-[15px] z-50 min-w-[200px]">
              <div className="flex flex-col gap-[15px]">
                {user && (
                  <div className="flex items-center gap-[8px] pb-[10px] border-b border-white/10">
                    <div className="w-[24px] h-[24px] rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                      <img 
                        src={getAvatarUrl()}
                        alt="用户头像" 
                        className="w-full h-full object-cover"
                        onError={handleAvatarError}
                      />
                    </div>
                    <span className="text-white">{user.username}</span>
                  </div>
                )}
                
                <Link 
                  href="/purchase" 
                  className="text-white hover:text-[#ffcc00] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  选号购买
                </Link>
                <Link 
                  href="#explore" 
                  className="text-white hover:text-[#ffcc00] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  彩种介绍
                </Link>
                <Link 
                  href="#insights" 
                  className="text-white hover:text-[#ffcc00] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  趣味分享
                </Link>
                <Link 
                  href="#feedback" 
                  className="text-white hover:text-[#ffcc00] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  用户故事
                </Link>
                
                {user && (
                  <>
                    <Link 
                      href="/profile" 
                      className="text-white hover:text-[#ffcc00] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      个人中心
                    </Link>
                    <Link 
                      href="/orders" 
                      className="text-white hover:text-[#ffcc00] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      我的订单
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-white hover:text-[#ffcc00] transition-colors text-left"
                    >
                      退出登录
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </motion.nav>
  );
};

export default Navbar;
