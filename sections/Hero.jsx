'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from '../styles';
import { slideIn, staggerContainer, textVariant } from '../utils/motion';

const Hero = () => {
  const router = useRouter();
  
  const handleBuyNow = () => {
    router.push('/purchase');
  };
  
  return (
    <section className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth2} mx-auto flex flex-col`}
      >
        <div className="flex flex-col items-center justify-center relative z-10">
          <motion.h1
            variants={textVariant(1.1)}
            className={styles.heroHeading}
          >
            来财✨来财
          </motion.h1>
          <motion.div
            variants={textVariant(1.2)}
            className="flex flex-row items-center justify-center"
          >
            <h1 className={styles.heroHeading}>玩出</h1>
            <div className={styles.heroDText} />
            <h1 className={styles.heroHeading}>精彩</h1>
          </motion.div>
          <motion.p
            variants={textVariant(1.25)}
            className="text-white text-center max-w-[600px] mt-4"
          >
            这里不只是选号码，更是一场数字的冒险！每一注都是一个故事的开始，来吧，让我们一起玩转数字世界！
          </motion.p>
          <motion.button
            variants={textVariant(1.3)}
            className="lottery-button mt-28"
            onClick={handleBuyNow}
          >
            开始冒险
          </motion.button>
        </div>

        <motion.div
          variants={slideIn('right', 'tween', 0.2, 1)}
          className="relative w-full lg:-mt-[30px] md:-mt-[18px] -mt-[15px]"
        >
          <div className="absolute w-full h-[300px] hero-gradient rounded-tl-[140px] z-[0] sm:-top-[20px] -top-[10px]" />
          <img
            src="/cover.png"
            alt="cover"
            className="w-full sm:h-[500px] h-[350px] object-cover rounded-tl-[140px] z-10 relative"
          />

          <a href="#explore">
            <div className="w-full flex justify-end sm:-mt-[70px] -mt-[50px] pr-[40px] relative z-10 2xl:-ml-[100px]">
              <motion.img
                src="/stamp.png"
                alt="stamp"
                className="sm:w-[155px] w-[100px] sm:h-[155px] h-[100px] object-contain"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 7, repeatType: 'loop' }}
              />
            </div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
