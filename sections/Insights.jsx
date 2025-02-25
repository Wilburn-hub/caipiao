'use client';

import { motion } from 'framer-motion';

import styles from '../styles';
import { InsightCard, TitleText, TypingText } from '../components';
import { staggerContainer } from '../utils/motion';

// 创建彩票统计数据
const lotteryStats = [
  {
    imgUrl: '/planet-06.png',
    title: '热门号码分析',
    subtitle: '过去30天出现频率最高的号码：07、11、22、33、15',
  },
  {
    imgUrl: '/planet-07.png',
    title: '冷门号码分析',
    subtitle: '超过60天未出现的号码：02、19、26、31、09',
  },
  {
    imgUrl: '/planet-08.png',
    title: '奖池趋势分析',
    subtitle: '近6个月奖池持续增长，目前已达历史新高',
  },
];

const Insights = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >
      <TypingText title="| 数据分析" textStyles="text-center" />
      <TitleText title="彩票数据统计" textStyles="text-center" />

      <div className="mt-[50px] flex flex-col gap-[30px]">
        {lotteryStats.map((item, index) => (
          <InsightCard key={`insight-${index}`} {...item} index={index + 1} />
        ))}
      </div>
    </motion.div>
  </section>
);

export default Insights;
