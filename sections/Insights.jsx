'use client';

import { motion } from 'framer-motion';
import styles from '../styles';
import { insights } from '../constants';
import { staggerContainer } from '../utils/motion';
import { InsightCard, TitleText, TypingText } from '../components';

const Insights = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >
      <TypingText title="| 趣味分享" textStyles="text-center" />
      <TitleText title={<>数字背后的故事</>} textStyles="text-center" />
      <div className="mt-[50px] flex flex-col gap-[30px]">
        {insights.map((item, index) => (
          <InsightCard key={`insight-${index}`} {...item} index={index + 1} />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-[70px] text-center"
      >
        <a 
          href="#" 
          className="inline-block bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] transition-all py-[15px] px-[30px] rounded-[30px] text-white font-semibold"
        >
          查看更多有趣故事
        </a>
      </motion.div>
    </motion.div>
  </section>
);

export default Insights;
