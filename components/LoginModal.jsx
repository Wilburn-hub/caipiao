'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username.trim()) {
      setErrorMessage('请输入用户名');
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage('请输入密码');
      return;
    }
    
    setIsLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      setIsLoading(false);
      // 模拟登录成功
      if (password === '123456' || password === 'password') {
        onLogin(username);
        onClose();
      } else {
        setErrorMessage('用户名或密码错误');
      }
    }, 1000);
  };

  if (!isOpen || !mounted) return null;

  // 使用 Portal 渲染到 body
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <motion.div
        variants={fadeIn('up', 'tween', 0.2, 0.5)}
        initial="hidden"
        animate="show"
        className="bg-[#1A232E] rounded-[20px] p-[30px] w-[90%] max-w-[400px] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-[15px] right-[15px] text-white/50 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2 className="text-white text-[24px] font-bold mb-[20px] text-center">
          登录来财✨来财
        </h2>
        
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-[10px] rounded-[10px] mb-[20px]">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-[20px]">
            <label className="block text-white/80 mb-[8px]">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
              placeholder="请输入用户名"
            />
          </div>
          
          <div className="mb-[20px]">
            <label className="block text-white/80 mb-[8px]">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white focus:outline-none focus:border-[#ffcc00]"
              placeholder="请输入密码"
            />
          </div>
          
          <div className="flex items-center justify-between mb-[20px]">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-[8px] h-[16px] w-[16px]"
              />
              <label htmlFor="rememberMe" className="text-white/80 text-[14px]">
                记住我
              </label>
            </div>
            
            <button type="button" className="text-[#ffcc00] text-[14px] hover:underline">
              忘记密码？
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-[12px] rounded-[10px] text-center font-bold text-[16px] ${
              isLoading ? 'bg-[#ffcc00]/50 cursor-not-allowed' : 'bg-[#ffcc00] hover:bg-[#ffdd33]'
            } text-black transition-colors`}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
          
          <div className="mt-[20px] text-center">
            <p className="text-white/60 text-[14px]">
              还没有账号？ 
              <button type="button" className="text-[#ffcc00] ml-[5px] hover:underline">
                立即注册
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default LoginModal; 