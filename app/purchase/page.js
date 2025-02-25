'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar, Footer } from '../../components';
import styles from '../../styles';
import { fadeIn, staggerContainer } from '../../utils/motion';

const Purchase = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameParam = searchParams.get('game');
  
  const [selectedGame, setSelectedGame] = useState('双色球');
  const [numbers, setNumbers] = useState([]);
  const [blueNumbers, setBlueNumbers] = useState([]);
  const [isComplex, setIsComplex] = useState(false); // 复式投注
  const [isAdditional, setIsAdditional] = useState(false); // 追加投注
  const [randomCount, setRandomCount] = useState(1); // 机选注数
  const [selectedBets, setSelectedBets] = useState([]); // 已选择的投注
  const [complexRandomCount, setComplexRandomCount] = useState(1); // 复式机选注数
  const [complexBets, setComplexBets] = useState([]); // 复式投注列表
  const [currentComplexBetIndex, setCurrentComplexBetIndex] = useState(0); // 当前显示的复式投注索引
  const [pageSize, setPageSize] = useState(5); // 每页显示的复式投注数量
  
  const games = [
    { id: '双色球', redCount: 6, blueCount: 1, redRange: 33, blueRange: 16, price: 2, additionalPrice: 1 },
    { id: '大乐透', redCount: 5, blueCount: 2, redRange: 35, blueRange: 12, price: 2, additionalPrice: 1 },
    { id: '福彩3D', redCount: 3, blueCount: 0, redRange: 10, blueRange: 0, price: 2, additionalPrice: 0 },
    { id: '七乐彩', redCount: 7, blueCount: 0, redRange: 30, blueRange: 0, price: 2, additionalPrice: 0 },
    { id: '排列5', redCount: 5, blueCount: 0, redRange: 10, blueRange: 0, price: 2, additionalPrice: 0 },
  ];
  
  // 当URL参数中有游戏名称时，设置选中的游戏
  useEffect(() => {
    if (gameParam && games.some(game => game.id === gameParam)) {
      setSelectedGame(gameParam);
      setNumbers([]);
      setBlueNumbers([]);
      setIsComplex(false);
      setIsAdditional(false);
      setSelectedBets([]);
    }
  }, [gameParam]);
  
  const currentGame = games.find(game => game.id === selectedGame);
  
  // 计算注数和金额
  const { betCount, totalAmount } = useMemo(() => {
    let count = 0;
    
    if (isComplex) {
      // 复式投注计算
      if (numbers.length >= currentGame.redCount && blueNumbers.length >= currentGame.blueCount) {
        // 计算红球组合数
        let redCombinations = 1;
        if (numbers.length > currentGame.redCount) {
          // 计算组合数 C(n,m)
          let n = numbers.length;
          let m = currentGame.redCount;
          let result = 1;
          for (let i = 0; i < m; i++) {
            result *= (n - i);
            result /= (i + 1);
          }
          redCombinations = result;
        }
        
        // 计算蓝球组合数
        let blueCombinations = 1;
        if (blueNumbers.length > currentGame.blueCount && currentGame.blueCount > 0) {
          // 计算组合数 C(n,m)
          let n = blueNumbers.length;
          let m = currentGame.blueCount;
          let result = 1;
          for (let i = 0; i < m; i++) {
            result *= (n - i);
            result /= (i + 1);
          }
          blueCombinations = result;
        }
        
        count = redCombinations * blueCombinations;
      }
    } else {
      // 单式投注
      count = (numbers.length === currentGame.redCount && 
              (currentGame.blueCount === 0 || blueNumbers.length === currentGame.blueCount)) ? 1 : 0;
      
      // 加上已选择的投注数
      count += selectedBets.length;
    }
    
    // 计算总金额
    const basePrice = currentGame.price * count;
    const additionalPrice = isAdditional ? currentGame.additionalPrice * count : 0;
    const total = basePrice + additionalPrice;
    
    return { betCount: count, totalAmount: total };
  }, [numbers, blueNumbers, currentGame, isComplex, isAdditional, selectedBets]);
  
  const handleGameChange = (gameId) => {
    setSelectedGame(gameId);
    setNumbers([]);
    setBlueNumbers([]);
    setIsComplex(false);
    setIsAdditional(false);
    setSelectedBets([]);
  };
  
  const handleNumberClick = (num, isBlue = false) => {
    if (isBlue) {
      if (blueNumbers.includes(num)) {
        setBlueNumbers(blueNumbers.filter(n => n !== num));
      } else if (isComplex || blueNumbers.length < currentGame.blueCount) {
        setBlueNumbers([...blueNumbers, num]);
      }
    } else {
      if (numbers.includes(num)) {
        setNumbers(numbers.filter(n => n !== num));
      } else if (isComplex || numbers.length < currentGame.redCount) {
        setNumbers([...numbers, num]);
      }
    }
  };
  
  // 生成一注随机号码
  const generateRandomBet = () => {
    // 随机选择红球
    const randomReds = [];
    while (randomReds.length < currentGame.redCount) {
      const num = Math.floor(Math.random() * currentGame.redRange) + 1;
      if (!randomReds.includes(num)) {
        randomReds.push(num);
      }
    }
    randomReds.sort((a, b) => a - b);
    
    // 随机选择蓝球
    const randomBlues = [];
    while (randomBlues.length < currentGame.blueCount) {
      const num = Math.floor(Math.random() * currentGame.blueRange) + 1;
      if (!randomBlues.includes(num)) {
        randomBlues.push(num);
      }
    }
    randomBlues.sort((a, b) => a - b);
    
    return { reds: randomReds, blues: randomBlues };
  };
  
  // 生成复式随机号码
  const generateComplexRandomBet = () => {
    // 随机选择红球
    const randomReds = [];
    // 复式投注选择比基本要求多1-3个号码
    const redCount = Math.min(
      currentGame.redCount + Math.floor(Math.random() * 3) + 1, 
      currentGame.redRange
    );
    
    while (randomReds.length < redCount) {
      const num = Math.floor(Math.random() * currentGame.redRange) + 1;
      if (!randomReds.includes(num)) {
        randomReds.push(num);
      }
    }
    randomReds.sort((a, b) => a - b);
    
    // 随机选择蓝球
    const randomBlues = [];
    // 如果有蓝球，复式投注选择比基本要求多1-2个号码
    const blueCount = currentGame.blueCount > 0 ? 
                     Math.min(
                       currentGame.blueCount + Math.floor(Math.random() * 2) + 1, 
                       currentGame.blueRange
                     ) : 
                     currentGame.blueCount;
    
    while (randomBlues.length < blueCount) {
      const num = Math.floor(Math.random() * currentGame.blueRange) + 1;
      if (!randomBlues.includes(num)) {
        randomBlues.push(num);
      }
    }
    randomBlues.sort((a, b) => a - b);
    
    return { reds: randomReds, blues: randomBlues };
  };
  
  // 修改随机选择函数
  const handleRandomSelect = () => {
    if (isComplex) {
      // 复式投注的随机选择
      if (complexRandomCount === 1) {
        // 如果只选择一注，直接设置当前选择
        const bet = generateComplexRandomBet();
        setNumbers(bet.reds);
        setBlueNumbers(bet.blues);
        setComplexBets([]);
      } else {
        // 如果选择多注，生成多个复式投注
        const maxBets = 100; // 限制最大生成数量为100注
        const betsToGenerate = Math.min(complexRandomCount, maxBets);
        
        if (complexRandomCount > maxBets) {
          alert(`为保证系统性能，最多只能生成${maxBets}注复式投注`);
        }
        
        const newComplexBets = [];
        for (let i = 0; i < betsToGenerate; i++) {
          newComplexBets.push(generateComplexRandomBet());
        }
        
        // 设置复式投注列表
        setComplexBets(newComplexBets);
        
        // 显示第一注
        setCurrentComplexBetIndex(0);
        if (newComplexBets.length > 0) {
          setNumbers(newComplexBets[0].reds);
          setBlueNumbers(newComplexBets[0].blues);
        }
      }
    } else {
      // 单式投注的随机选择
      const maxBets = 100; // 限制最大生成数量为100注
      const betsToGenerate = Math.min(randomCount, maxBets);
      
      if (randomCount > maxBets) {
        alert(`为保证系统性能，最多只能生成${maxBets}注单式投注`);
      }
      
      const newBets = [];
      for (let i = 0; i < betsToGenerate; i++) {
        newBets.push(generateRandomBet());
      }
      
      // 检查是否超过总数限制
      const totalBetsAfterAdd = selectedBets.length + newBets.length;
      if (totalBetsAfterAdd > maxBets) {
        alert(`投注列表最多只能包含${maxBets}注，当前已有${selectedBets.length}注`);
        // 只添加不超过限制的部分
        const remainingSlots = maxBets - selectedBets.length;
        if (remainingSlots > 0) {
          setSelectedBets([...selectedBets, ...newBets.slice(0, remainingSlots)]);
        }
      } else {
        setSelectedBets([...selectedBets, ...newBets]);
      }
      
      setNumbers([]);
      setBlueNumbers([]);
    }
  };
  
  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.ceil(complexBets.length / pageSize);
  }, [complexBets, pageSize]);
  
  // 计算当前页码
  const currentPage = useMemo(() => {
    return Math.floor(currentComplexBetIndex / pageSize) + 1;
  }, [currentComplexBetIndex, pageSize]);
  
  // 获取当前页的复式投注
  const currentPageBets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return complexBets.slice(startIndex, startIndex + pageSize);
  }, [complexBets, currentPage, pageSize]);
  
  // 切换到指定页码
  const handlePageChange = (page) => {
    const startIndex = (page - 1) * pageSize;
    if (startIndex < complexBets.length) {
      setCurrentComplexBetIndex(startIndex);
      setNumbers(complexBets[startIndex].reds);
      setBlueNumbers(complexBets[startIndex].blues);
    }
  };
  
  // 添加当前选择到投注列表
  const handleAddCurrentBet = () => {
    if (numbers.length === currentGame.redCount && 
        (currentGame.blueCount === 0 || blueNumbers.length === currentGame.blueCount)) {
      setSelectedBets([...selectedBets, { reds: [...numbers], blues: [...blueNumbers] }]);
      setNumbers([]);
      setBlueNumbers([]);
    }
  };
  
  // 从投注列表中移除一注
  const handleRemoveBet = (index) => {
    setSelectedBets(selectedBets.filter((_, i) => i !== index));
  };
  
  // 提交购买
  const handleSubmit = () => {
    if (betCount > 0) {
      // 这里可以添加实际的购买逻辑
      alert(`购买成功！共${betCount}注，总金额：¥${totalAmount.toFixed(2)}`);
      router.push('/');
    }
  };
  
  return (
    <div className="bg-primary-black overflow-hidden">
      <Navbar />
      
      <section className={`${styles.paddings} relative z-10`}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className={`${styles.innerWidth} mx-auto flex flex-col`}
        >
          <motion.h1
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="text-center text-white font-bold text-[32px] sm:text-[40px] mb-[50px]"
          >
            购买{selectedGame}
          </motion.h1>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 1)}
            className="glassmorphism p-[30px] rounded-[20px] mb-[30px]"
          >
            <h2 className="text-white font-bold text-[24px] mb-[20px]">选择彩票类型</h2>
            <div className="flex flex-wrap gap-[15px] mb-[30px]">
              {games.map(game => (
                <button
                  key={game.id}
                  className={`purchase-button ${
                    selectedGame === game.id 
                      ? 'primary' 
                      : 'secondary'
                  }`}
                  onClick={() => handleGameChange(game.id)}
                >
                  {game.id}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-[15px] mb-[30px]">
              <button
                className={`purchase-button ${
                  isComplex 
                    ? 'primary' 
                    : 'secondary'
                }`}
                onClick={() => {
                  setIsComplex(!isComplex);
                  setSelectedBets([]);
                  setNumbers([]);
                  setBlueNumbers([]);
                }}
              >
                {isComplex ? '复式投注 ✓' : '复式投注'}
              </button>
              
              {currentGame.additionalPrice > 0 && (
                <button
                  className={`purchase-button ${
                    isAdditional 
                      ? 'primary' 
                      : 'secondary'
                  }`}
                  onClick={() => setIsAdditional(!isAdditional)}
                >
                  {isAdditional ? '追加投注 ✓' : '追加投注'}
                </button>
              )}
            </div>
            
            <h2 className="text-white font-bold text-[24px] mb-[20px]">选择号码</h2>
            
            {currentGame.redRange > 0 && (
              <div className="mb-[30px]">
                <h3 className="text-white text-[18px] mb-[15px]">
                  红球 {isComplex ? `(至少选${currentGame.redCount}个)` : `(选${currentGame.redCount}个)`}：已选{numbers.length}个
                </h3>
                <div className="flex flex-wrap gap-[10px] mb-[15px]">
                  {Array.from({ length: currentGame.redRange }, (_, i) => i + 1).map(num => (
                    <button
                      key={`red-${num}`}
                      className={`number-ball ${numbers.includes(num) ? 'selected-red' : ''}`}
                      onClick={() => handleNumberClick(num)}
                    >
                      {num < 10 ? `0${num}` : num}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {currentGame.blueRange > 0 && (
              <div className="mb-[30px]">
                <h3 className="text-white text-[18px] mb-[15px]">
                  蓝球 {isComplex ? `(至少选${currentGame.blueCount}个)` : `(选${currentGame.blueCount}个)`}：已选{blueNumbers.length}个
                </h3>
                <div className="flex flex-wrap gap-[10px] mb-[15px]">
                  {Array.from({ length: currentGame.blueRange }, (_, i) => i + 1).map(num => (
                    <button
                      key={`blue-${num}`}
                      className={`number-ball ${blueNumbers.includes(num) ? 'selected-blue' : ''}`}
                      onClick={() => handleNumberClick(num, true)}
                    >
                      {num < 10 ? `0${num}` : num}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {!isComplex && (
              <div className="mb-[30px]">
                <div className="flex items-center gap-[15px] mb-[20px]">
                  <button
                    className="purchase-button secondary"
                    onClick={handleAddCurrentBet}
                    disabled={!(numbers.length === currentGame.redCount && 
                              (currentGame.blueCount === 0 || blueNumbers.length === currentGame.blueCount))}
                    style={{
                      opacity: (numbers.length === currentGame.redCount && 
                              (currentGame.blueCount === 0 || blueNumbers.length === currentGame.blueCount)) ? 1 : 0.5
                    }}
                  >
                    添加到投注列表
                  </button>
                  
                  <div className="flex items-center">
                    <span className="text-white mr-[10px]">机选注数：</span>
                    <div className="flex items-center">
                      <button
                        className="purchase-button secondary py-[5px] px-[12px]"
                        onClick={() => setRandomCount(Math.max(1, randomCount - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="bg-[rgba(255,255,255,0.1)] text-white text-center w-[60px] mx-[10px] py-[5px] rounded-[5px]"
                        value={randomCount}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 1 && value <= 100) {
                            setRandomCount(value);
                          }
                        }}
                        min="1"
                        max="100"
                      />
                      <button
                        className="purchase-button secondary py-[5px] px-[12px]"
                        onClick={() => setRandomCount(Math.min(100, randomCount + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedBets.length > 0 && (
                  <div className="bg-[rgba(0,0,0,0.2)] p-[20px] rounded-[15px] mb-[20px]">
                    <h3 className="text-white font-bold text-[18px] mb-[15px]">已选择的投注（{selectedBets.length}注）</h3>
                    <div className="max-h-[300px] overflow-y-auto">
                      {selectedBets.map((bet, index) => (
                        <div key={index} className="flex items-center justify-between mb-[10px] p-[10px] bg-[rgba(255,255,255,0.05)] rounded-[10px]">
                          <div className="flex items-center">
                            <span className="text-white mr-[10px]">{index + 1}.</span>
                            <div className="flex flex-wrap gap-[5px]">
                              {bet.reds.map(num => (
                                <span key={`bet-${index}-red-${num}`} className="red-ball">
                                  {num < 10 ? `0${num}` : num}
                                </span>
                              ))}
                              
                              {bet.blues.map(num => (
                                <span key={`bet-${index}-blue-${num}`} className="blue-ball">
                                  {num < 10 ? `0${num}` : num}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            className="text-[rgba(255,255,255,0.7)] hover:text-white"
                            onClick={() => handleRemoveBet(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {isComplex && (
              <div className="flex items-center gap-[15px] mb-[20px]">
                <span className="text-white mr-[10px]">复式机选注数：</span>
                <div className="flex items-center">
                  <button
                    className="purchase-button secondary py-[5px] px-[12px]"
                    onClick={() => setComplexRandomCount(Math.max(1, complexRandomCount - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="bg-[rgba(255,255,255,0.1)] text-white text-center w-[60px] mx-[10px] py-[5px] rounded-[5px]"
                    value={complexRandomCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 100) {
                        setComplexRandomCount(value);
                      }
                    }}
                    min="1"
                    max="100"
                  />
                  <button
                    className="purchase-button secondary py-[5px] px-[12px]"
                    onClick={() => setComplexRandomCount(Math.min(100, complexRandomCount + 1))}
                  >
                    +
                  </button>
                </div>
                <span className="text-[rgba(255,255,255,0.7)] text-[14px]">（最多100注）</span>
              </div>
            )}
            
            {/* 修改复式投注分页控制 */}
            {isComplex && complexBets.length > 1 && (
              <div className="bg-[rgba(0,0,0,0.2)] p-[20px] rounded-[15px] mt-[30px] mb-[30px]">
                <h3 className="text-white font-bold text-[18px] mb-[15px]">
                  已生成的复式投注（{complexBets.length}注）
                </h3>
                
                <div className="max-h-[300px] overflow-y-auto mb-[20px]">
                  {currentPageBets.map((bet, index) => {
                    const globalIndex = (currentPage - 1) * pageSize + index;
                    return (
                      <div 
                        key={`complex-bet-${globalIndex}`} 
                        className={`flex items-center justify-between mb-[10px] p-[10px] rounded-[10px] cursor-pointer ${
                          globalIndex === currentComplexBetIndex 
                            ? 'bg-[rgba(255,94,94,0.2)]' 
                            : 'bg-[rgba(255,255,255,0.05)]'
                        }`}
                        onClick={() => {
                          setCurrentComplexBetIndex(globalIndex);
                          setNumbers(bet.reds);
                          setBlueNumbers(bet.blues);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="text-white mr-[10px]">{globalIndex + 1}.</span>
                          <div className="flex flex-wrap gap-[5px]">
                            {bet.reds.map(num => (
                              <span key={`complex-bet-${globalIndex}-red-${num}`} className="red-ball">
                                {num < 10 ? `0${num}` : num}
                              </span>
                            ))}
                            
                            {bet.blues.map(num => (
                              <span key={`complex-bet-${globalIndex}-blue-${num}`} className="blue-ball">
                                {num < 10 ? `0${num}` : num}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {globalIndex === currentComplexBetIndex && (
                          <span className="text-[#ffcc00] font-bold">当前选择</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[10px]">
                    <button
                      className="purchase-button secondary py-[5px] px-[15px]"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                      上一页
                    </button>
                    
                    <div className="flex gap-[5px]">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={`page-${page}`}
                          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all ${
                            page === currentPage 
                              ? 'bg-gradient-to-r from-[#ff5e5e] to-[#ffcc00] text-[#1a232e] font-bold' 
                              : 'bg-[rgba(255,255,255,0.1)] text-white'
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      className="purchase-button secondary py-[5px] px-[15px]"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                      下一页
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-[10px]">
                    <span className="text-white">每页显示：</span>
                    <select
                      className="bg-[rgba(255,255,255,0.1)] text-white py-[5px] px-[10px] rounded-[5px]"
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      <option value="5">5条</option>
                      <option value="10">10条</option>
                      <option value="20">20条</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-[rgba(0,0,0,0.3)] p-[25px] rounded-[15px] mb-[30px]">
              <h3 className="text-white font-bold text-[20px] mb-[20px]">您的选择</h3>
              
              {!isComplex && selectedBets.length === 0 && (
                <div className="flex items-center mb-[20px]">
                  <p className="text-white mr-[15px] min-w-[80px]">选择号码：</p>
                  <div className="flex flex-wrap gap-[8px]">
                    {numbers.map(num => (
                      <span key={`selected-${num}`} className="red-ball">
                        {num < 10 ? `0${num}` : num}
                      </span>
                    ))}
                    
                    {blueNumbers.map(num => (
                      <span key={`selected-blue-${num}`} className="blue-ball">
                        {num < 10 ? `0${num}` : num}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {isComplex && (
                <div className="flex items-center mb-[20px]">
                  <p className="text-white mr-[15px] min-w-[80px]">选择号码：</p>
                  <div className="flex flex-wrap gap-[8px]">
                    {numbers.map(num => (
                      <span key={`selected-${num}`} className="red-ball">
                        {num < 10 ? `0${num}` : num}
                      </span>
                    ))}
                    
                    {blueNumbers.map(num => (
                      <span key={`selected-blue-${num}`} className="blue-ball">
                        {num < 10 ? `0${num}` : num}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap items-center">
                <p className="text-white mr-[20px]">
                  投注方式：<span className="text-[#ffcc00]">{isComplex ? '复式投注' : '单式投注'}{isAdditional ? ' + 追加投注' : ''}</span>
                </p>
                
                <p className="text-white mr-[20px]">
                  注数：<span className="text-[#ffcc00] font-bold">{betCount}</span>
                </p>
                
                <p className="text-white mr-[20px]">
                  单注金额：<span className="text-[#ffcc00]">¥{currentGame.price.toFixed(2)}{isAdditional ? ` + ¥${currentGame.additionalPrice.toFixed(2)}` : ''}</span>
                </p>
                
                <p className="text-white font-bold">
                  总金额：<span className="text-[#ffcc00] text-[20px]">¥{totalAmount.toFixed(2)}</span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-[15px]">
                <button
                  className="purchase-button secondary"
                  onClick={handleRandomSelect}
                >
                  {isComplex ? `机选${complexRandomCount}注` : `机选${randomCount}注`}
                </button>
                
                <button
                  className="purchase-button secondary"
                  onClick={() => {
                    setNumbers([]);
                    setBlueNumbers([]);
                    if (!isComplex) {
                      setSelectedBets([]);
                    }
                  }}
                >
                  清空选择
                </button>
              </div>
              
              <button
                className={`purchase-button large ${betCount > 0 ? 'primary' : 'disabled'}`}
                onClick={handleSubmit}
                disabled={betCount === 0}
              >
                确认购买
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Purchase;