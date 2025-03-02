'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BalanceDisplay = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  
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
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, []);
  
  if (!user) return null;
  
  return (
    <div className="bg-[rgba(0,0,0,0.3)] p-[15px] rounded-[10px] mb-[20px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <span className="text-white">账户余额:</span>
          {showBalance ? (
            <span className="text-[#ffcc00] font-bold">¥{user.balance?.toFixed(2) || '0.00'}</span>
          ) : (
            <span className="text-[#ffcc00] font-bold">¥***.**</span>
          )}
          <button 
            className="text-white/60 hover:text-white"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        <div className="flex gap-[10px]">
          <button 
            className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[5px] px-[10px] rounded-[5px] text-[14px] transition-colors"
            onClick={() => router.push('/profile')}
          >
            充值
          </button>
          <button 
            className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white py-[5px] px-[10px] rounded-[5px] text-[14px] transition-colors"
            onClick={() => router.push('/orders')}
          >
            订单
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay; 