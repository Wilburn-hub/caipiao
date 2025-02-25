'use client';

import { motion } from 'framer-motion';

import styles from '../styles';
import { newFeatures } from '../constants';
import { NewFeatures, TitleText, TypingText } from '../components';
import { planetVariants, staggerContainer, fadeIn } from '../utils/motion';

// 创建最新开奖数据
const latestDraws = [
  {
    title: '双色球',
    subtitle: '2023年10月15日',
    numbers: ['05', '11', '14', '22', '27', '33'],
    blueNumber: '16',
    prize: '一等奖：5注，每注奖金¥8,000,000'
  },
  {
    title: '大乐透',
    subtitle: '2023年10月14日',
    numbers: ['03', '15', '21', '25', '35'],
    blueNumbers: ['02', '12'],
    prize: '一等奖：2注，每注奖金¥10,000,000'
  },
];

const WhatsNew = () => {
  const newFeatures = [
    {
      imgUrl: '/vrpano.svg',
      title: '趣味选号',
      subtitle: '告别枯燥的数字选择！我们的趣味选号功能让你用星座、生肖、心情等有趣方式选出你的幸运数字',
    },
    {
      imgUrl: '/headset.svg',
      title: '号码分析',
      subtitle: '独家开发的号码分析工具，帮你发现数字规律，但记住，最终还是要靠运气和直觉哦！',
    },
  ];

  return (
    <section className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
      >
        <motion.div
          variants={fadeIn('right', 'tween', 0.2, 1)}
          className="flex-[0.95] flex justify-center flex-col"
        >
          <TypingText title="| 有趣功能" />
          <TitleText title={<>玩转数字，乐在其中</>} />
          <div className="mt-[48px] flex flex-wrap justify-between gap-[24px]">
            {newFeatures.map((feature) => (
              <NewFeatures key={feature.title} {...feature} />
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={planetVariants('right')}
          className={`flex-1 ${styles.flexCenter}`}
        >
          <img
            src="/whats-new.png"
            alt="get-started"
            className="w-[90%] h-[90%] object-contain"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhatsNew;
