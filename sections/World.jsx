'use client';

import { motion } from 'framer-motion';
import styles from '../styles';
import { TitleText, TypingText } from '../components';
import { staggerContainer, fadeIn } from '../utils/motion';

// 创建中奖者数据
const winners = [
  {
    name: '张先生 - 北京',
    game: '双色球一等奖',
    amount: '¥8,000,000',
    quote: '"我从未想过会中这么大的奖，这改变了我的一生！"',
    position: { top: '32%', left: '62%' },
    image: '/people-02.png'
  },
  {
    name: '李女士 - 上海',
    game: '大乐透一等奖',
    amount: '¥10,000,000',
    quote: '"我坚持购买了5年，终于等到了这一天！"',
    position: { top: '10%', left: '20%' },
    image: '/people-03.png'
  },
  {
    name: '王先生 - 广州',
    game: '福彩3D',
    amount: '¥1,000,000',
    quote: '"这是我第一次尝试在线购买彩票，没想到就中奖了！"',
    position: { bottom: '20%', right: '20%' },
    image: '/people-04.png'
  },
];

const World = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >
      <TypingText title="| 中奖者分布" textStyles="text-center" />
      <TitleText
        title={(
          <>
            查看全国各地的幸运中奖者，下一个可能就是您！
          </>
        )}
        textStyles="text-center"
      />

      <motion.div
        variants={fadeIn('up', 'tween', 0.3, 1)}
        className="relative mt-[69px] flex w-full h-[550px]"
      >
        <img src="/map.png" alt="map" className="w-full h-full object-cover" />

        {winners.map((winner, index) => (
          <div 
            key={index}
            className="absolute w-[70px] h-[70px] p-[6px] rounded-full bg-[#5d6680] winner-marker"
            style={winner.position}
          >
            <img src={winner.image} alt="winner" className="w-full h-full" />
            <div className="winner-tooltip">
              <h3>{winner.name}</h3>
              <p>{winner.game}</p>
              <p className="prize-amount">{winner.amount}</p>
              <p>{winner.quote}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default World;
