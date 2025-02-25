'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from '../styles';
import { navVariants } from '../utils/motion';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
        </div>
        
        <div className="md:hidden relative">
          <img
            src="/menu.svg"
            alt="menu"
            className="w-[24px] h-[24px] object-contain cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          
          {isMenuOpen && (
            <div className="absolute top-[40px] right-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-md p-[20px] rounded-[15px] z-50 min-w-[200px]">
              <div className="flex flex-col gap-[15px]">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
