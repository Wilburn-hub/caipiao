'use client';

import { motion } from 'framer-motion';
import styles from '../styles';
import { TitleText, TypingText } from '../components';
import { fadeIn, staggerContainer } from '../utils/motion';

const World = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >
      <TypingText title="| 全国玩家" textStyles="text-center" />
      <TitleText
        title={<>来自全国各地的数字爱好者<br className="md:block hidden" />一起探索数字的奥秘</>}
        textStyles="text-center"
      />

      <motion.div
        variants={fadeIn('up', 'tween', 0.3, 1)}
        className="relative mt-[68px] flex w-full h-[550px]"
      >
        <img src="/map.png" alt="map" className="w-full h-full object-cover" />

        <div className="absolute bottom-20 right-20 w-[70px] h-[70px] p-[6px] rounded-full bg-[#5D6680]">
          <img src="/people-01.png" alt="people" className="w-full h-full" />
        </div>

        <div className="absolute top-10 left-20 w-[70px] h-[70px] p-[6px] rounded-full bg-[#5D6680]">
          <img src="/people-02.png" alt="people" className="w-full h-full" />
        </div>

        <div className="absolute top-1/2 left-[45%] w-[70px] h-[70px] p-[6px] rounded-full bg-[#5D6680]">
          <img src="/people-03.png" alt="people" className="w-full h-full" />
        </div>
        
        <div className="absolute top-1/3 right-[30%] bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-[15px] rounded-[15px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
              <img src="/people-04.png" alt="user" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white text-[14px] font-medium">小李</p>
              <p className="text-white/70 text-[12px]">刚刚中了小奖！</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 left-[25%] bg-[rgba(255,255,255,0.1)] backdrop-blur-sm p-[15px] rounded-[15px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
              <img src="/people-05.png" alt="user" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white text-[14px] font-medium">小张</p>
              <p className="text-white/70 text-[12px]">选了一组幸运数字！</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default World;
