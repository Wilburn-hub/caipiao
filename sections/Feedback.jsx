'use client';

import { motion } from 'framer-motion';
import styles from '../styles';
import { fadeIn, staggerContainer, zoomIn } from '../utils/motion';
import { TypingText, TitleText } from '../components';

const Feedback = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-6`}
    >
      <motion.div
        variants={fadeIn('right', 'tweeen', 0.2, 1)}
        className="flex-[0.4] lg:max-[370px] flex justify-end lg:justify-center flex-col gradient-05 sm:p-8 p-4 rounded-[32px] border-[1px] border-[#6a6a6a] relative"
      >
        <div className="feedback-gradient" />
        <div>
          <h4 className="font-bold sm:text-[32px] text-[26px] sm:leading-[40px] leading-[36px] text-white">张明</h4>
          <p className="mt-[8px] font-normal sm:text-[18px] text-[12px] sm:leading-[22px] leading-[16px] text-white">幸运彩票大奖得主</p>
        </div>
        <p className="mt-[24px] font-normal sm:text-[24px] text-[18px] sm:leading-[45px] leading-[39px] text-white">
          "我从未想过会中这么大的奖，这改变了我的一生！幸运彩票平台操作简单，提款迅速，服务也非常好。我会继续在这里购买彩票，希望再次中大奖！"
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn('left', 'tween', 0.2, 1)}
        className="relative flex-1 flex justify-center item-center"
      >
        <img src="/planet-09.png" alt="planet" className="w-full lg:h-[610px] h-auto min-h-[210px] object-cover rounded-[40px]" />
        <motion.div
          variants={zoomIn(0.4, 1)}
          className="lg:block hidden absolute -left-[10%] top-[3%]"
        >
          <img src="/stamp.png" alt="stamp" className="md:w-[170px] w-[115px] md:h-[170px] h-[115px] object-contain" />
        </motion.div>
      </motion.div>
    </motion.div>
    
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto mt-[100px]`}
    >
      <TypingText title="| 联系我们" textStyles="text-center" />
      <TitleText title="客户服务" textStyles="text-center" />
      
      <motion.div
        variants={fadeIn('up', 'tween', 0.3, 1)}
        className="mt-[50px] flex flex-col lg:flex-row gap-[30px]"
      >
        <div className="flex-1 glassmorphism p-[30px] rounded-[20px]">
          <h3 className="font-bold text-[24px] leading-[30px] text-white mb-[20px]">客户服务</h3>
          <p className="text-white opacity-70 mb-[10px]">电话：400-888-8888</p>
          <p className="text-white opacity-70 mb-[10px]">邮箱：support@luckylottery.com</p>
          <p className="text-white opacity-70 mb-[20px]">工作时间：周一至周日 9:00-22:00</p>
          <div className="flex gap-[15px]">
            <a href="#" className="py-[8px] px-[15px] bg-[rgba(255,255,255,0.1)] rounded-[30px] text-white">微信</a>
            <a href="#" className="py-[8px] px-[15px] bg-[rgba(255,255,255,0.1)] rounded-[30px] text-white">微博</a>
            <a href="#" className="py-[8px] px-[15px] bg-[rgba(255,255,255,0.1)] rounded-[30px] text-white">QQ</a>
          </div>
        </div>
        
        <div className="flex-1 glassmorphism p-[30px] rounded-[20px]">
          <h3 className="font-bold text-[24px] leading-[30px] text-white mb-[20px]">留言咨询</h3>
          <form className="flex flex-col gap-[15px]">
            <input type="text" placeholder="您的姓名" className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white" />
            <input type="email" placeholder="您的邮箱" className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white" />
            <textarea placeholder="您的留言" className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white min-h-[120px]"></textarea>
            <button type="submit" className="bg-gradient-to-r from-[#ff5e5e] to-[#ffcc00] text-[#1a232e] font-semibold py-[12px] px-[24px] rounded-[30px] self-start">提交</button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default Feedback;
