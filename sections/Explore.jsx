'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import styles from '../styles';
import { TypingText, ExploreCard, TitleText } from '../components';
import { staggerContainer } from '../utils/motion';

// 创建彩票游戏数据
const lotteryGames = [
  {
    id: 'game-1',
    imgUrl: '/planet-01.png',
    title: '双色球',
    subtitle: '中国最受欢迎的彩票游戏，每周三、六开奖',
    prize: '奖池：¥1,500,000,000'
  },
  {
    id: 'game-2',
    imgUrl: '/planet-02.png',
    title: '大乐透',
    subtitle: '超高奖金，每周一、三、六开奖',
    prize: '奖池：¥1,200,000,000'
  },
  {
    id: 'game-3',
    imgUrl: '/planet-03.png',
    title: '福彩3D',
    subtitle: '简单易玩，天天开奖',
    prize: '固定奖金：¥1,000'
  },
  {
    id: 'game-4',
    imgUrl: '/planet-04.png',
    title: '七乐彩',
    subtitle: '多种玩法，每周一、三、五开奖',
    prize: '奖池：¥500,000,000'
  },
  {
    id: 'game-5',
    imgUrl: '/planet-05.png',
    title: '排列5',
    subtitle: '天天开奖，简单刺激',
    prize: '固定奖金：¥100,000'
  },
];

const Explore = () => {
  const [active, setActive] = useState('game-2');

  return (
    <section className={`${styles.paddings}`} id="explore">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText title="| 彩票游戏" textStyles="text-center" />
        <TitleText title={<>选择您想要参与的<br className="md:block hidden" />彩票游戏</>} textStyles="text-center" />

        <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-5">
          {lotteryGames.map((game, index) => (
            <ExploreCard
              key={game.id}
              {...game}
              index={index}
              active={active}
              handleClick={setActive}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Explore;
