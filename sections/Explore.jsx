'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from '../styles';
import { TypingText, ExploreCard, TitleText } from '../components';
import { exploreWorlds } from '../constants';
import { staggerContainer } from '../utils/motion';

const Explore = () => {
  const [active, setActive] = useState('world-2');
  const router = useRouter();
  
  const handleCardClick = (id, title) => {
    setActive(id);
    
    // 延迟导航，让动画有时间完成
    setTimeout(() => {
      router.push(`/purchase?game=${title}`);
    }, 800);
  };

  return (
    <section className={`${styles.paddings}`} id="explore">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText title="| 彩种选择" textStyles="text-center" />
        <TitleText
          title={<>选择你喜欢的彩种<br className="md:block hidden" /> 开启数字奇遇</>}
          textStyles="text-center"
        />
        <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
          {exploreWorlds.map((world, index) => (
            <ExploreCard
              key={world.id}
              {...world}
              index={index}
              active={active}
              handleClick={() => handleCardClick(world.id, world.title)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Explore;
