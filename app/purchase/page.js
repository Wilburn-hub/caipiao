'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar, Footer, LoginModal, BalanceDisplay } from '../../components';
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
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [personalType, setPersonalType] = useState(''); // 'birthday', 'zodiac', 'name', 'mood'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  
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
  
  // 检查用户是否已登录
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // 如果用户数据中没有余额，则设置初始余额为10000
        if (userData && !userData.balance) {
          userData.balance = 10000;
          localStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, []);
  
  const handleLogin = (username) => {
    const userData = { username, avatar: '/avatar.png' };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // 处理提交购买
  const handleSubmit = () => {
    if (!user) {
      // 如果用户未登录，显示登录弹窗
      setIsLoginModalOpen(true);
      return;
    }
    
    // 检查余额是否足够
    if ((user.balance || 0) < totalAmount) {
      alert(`余额不足！当前余额: ¥${user.balance?.toFixed(2) || '0.00'}，需要: ¥${totalAmount.toFixed(2)}`);
      return;
    }
    
    // 扣减余额
    const updatedUser = {
      ...user,
      balance: (user.balance || 0) - totalAmount
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // 添加购买记录
    const orderId = `L${Date.now()}`;
    const newOrder = {
      id: orderId,
      type: 'lottery',
      game: selectedGame,
      amount: totalAmount,
      betCount: betCount,
      date: new Date().toISOString(),
      status: 'success',
      bets: isComplex ? complexBets : selectedBets
    };
    
    // 获取现有订单并添加新订单
    let orders = [];
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        orders = JSON.parse(storedOrders);
      }
    } catch (e) {
      console.error('Failed to parse orders from localStorage');
    }
    
    orders = [newOrder, ...orders];
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert(`购买成功！订单号: ${orderId}，共 ${betCount} 注，总金额 ¥${totalAmount.toFixed(2)}`);
    
    // 清空选择
    setNumbers([]);
    setBlueNumbers([]);
    setSelectedBets([]);
    if (isComplex) {
      setComplexBets([]);
    }
  };
  
  // 个性选号函数
  const handlePersonalSelect = () => {
    setIsPersonalModalOpen(true);
  };
  
  // 关闭个性选号模态框
  const closePersonalModal = () => {
    setIsPersonalModalOpen(false);
    setPersonalType('');
  };
  
  // 根据生日选号
  const selectByBirthday = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    
    // 提取年月日的数字
    const yearDigits = year.toString().split('').map(Number);
    const monthDigits = month < 10 ? [month] : month.toString().split('').map(Number);
    const dayDigits = day < 10 ? [day] : day.toString().split('').map(Number);
    
    // 合并所有数字并去重
    let allDigits = [...yearDigits, ...monthDigits, ...dayDigits];
    
    // 根据当前游戏规则选择红球
    let newReds = [];
    for (let digit of allDigits) {
      // 调整数字到红球范围内
      let adjustedDigit = digit === 0 ? 10 : digit;
      while (adjustedDigit > currentGame.redRange) {
        adjustedDigit -= 10;
      }
      if (adjustedDigit > 0 && adjustedDigit <= currentGame.redRange && !newReds.includes(adjustedDigit)) {
        newReds.push(adjustedDigit);
      }
      
      // 如果数字不够，添加数字的组合
      if (newReds.length < currentGame.redCount && yearDigits.length >= 2) {
        const combined = yearDigits[0] * 10 + yearDigits[1];
        const adjusted = combined > currentGame.redRange ? combined % currentGame.redRange : combined;
        if (adjusted > 0 && !newReds.includes(adjusted)) {
          newReds.push(adjusted);
        }
      }
    }
    
    // 如果还不够，随机补充
    while (newReds.length < currentGame.redCount) {
      const randomNum = Math.floor(Math.random() * currentGame.redRange) + 1;
      if (!newReds.includes(randomNum)) {
        newReds.push(randomNum);
      }
    }
    
    // 如果超过了，截取前面的
    if (newReds.length > currentGame.redCount && !isComplex) {
      newReds = newReds.slice(0, currentGame.redCount);
    }
    
    // 排序
    newReds.sort((a, b) => a - b);
    
    // 选择蓝球
    let newBlues = [];
    if (currentGame.blueCount > 0) {
      // 使用月份和日期的组合
      let blueNum = (month + day) % currentGame.blueRange;
      blueNum = blueNum === 0 ? currentGame.blueRange : blueNum;
      newBlues.push(blueNum);
      
      // 如果是复式投注或需要多个蓝球，添加额外的蓝球
      while (newBlues.length < currentGame.blueCount || (isComplex && newBlues.length < currentGame.blueCount + 1)) {
        const randomBlue = Math.floor(Math.random() * currentGame.blueRange) + 1;
        if (!newBlues.includes(randomBlue)) {
          newBlues.push(randomBlue);
        }
      }
      
      newBlues.sort((a, b) => a - b);
    }
    
    setNumbers(newReds);
    setBlueNumbers(newBlues);
    closePersonalModal();
  };
  
  // 根据星座选号
  const selectByZodiac = (zodiac) => {
    // 每个星座对应的幸运数字
    const zodiacNumbers = {
      'aries': [1, 9, 17, 23, 31],
      'taurus': [2, 6, 15, 24, 33],
      'gemini': [3, 12, 18, 25, 32],
      'cancer': [4, 7, 13, 22, 30],
      'leo': [5, 11, 19, 26, 29],
      'virgo': [6, 10, 15, 27, 33],
      'libra': [7, 14, 21, 28, 32],
      'scorpio': [8, 16, 24, 29, 31],
      'sagittarius': [9, 17, 25, 30, 33],
      'capricorn': [10, 18, 26, 31, 32],
      'aquarius': [11, 19, 27, 28, 33],
      'pisces': [12, 20, 22, 29, 30]
    };
    
    // 获取星座对应的幸运数字
    let luckyNumbers = zodiacNumbers[zodiac] || [];
    
    // 过滤掉超出红球范围的数字
    luckyNumbers = luckyNumbers.filter(num => num <= currentGame.redRange);
    
    // 如果数字不够，随机补充
    while (luckyNumbers.length < currentGame.redCount) {
      const randomNum = Math.floor(Math.random() * currentGame.redRange) + 1;
      if (!luckyNumbers.includes(randomNum)) {
        luckyNumbers.push(randomNum);
      }
    }
    
    // 如果是复式投注，可以多选几个
    if (isComplex) {
      // 再随机添加1-3个数字
      const extraCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < extraCount; i++) {
        const randomNum = Math.floor(Math.random() * currentGame.redRange) + 1;
        if (!luckyNumbers.includes(randomNum)) {
          luckyNumbers.push(randomNum);
        }
      }
    } else if (luckyNumbers.length > currentGame.redCount) {
      // 如果不是复式投注且数字超过了，截取前面的
      luckyNumbers = luckyNumbers.slice(0, currentGame.redCount);
    }
    
    // 排序
    luckyNumbers.sort((a, b) => a - b);
    
    // 选择蓝球
    let blueNumbers = [];
    if (currentGame.blueCount > 0) {
      // 根据星座选择蓝球
      const zodiacBlue = {
        'aries': [1, 9],
        'taurus': [2, 10],
        'gemini': [3, 11],
        'cancer': [4, 12],
        'leo': [5, 13],
        'virgo': [6, 14],
        'libra': [7, 15],
        'scorpio': [8, 16],
        'sagittarius': [9, 1],
        'capricorn': [10, 2],
        'aquarius': [11, 3],
        'pisces': [12, 4]
      };
      
      let blueOptions = zodiacBlue[zodiac] || [];
      blueOptions = blueOptions.filter(num => num <= currentGame.blueRange);
      
      // 如果选项不够，随机补充
      while (blueOptions.length < currentGame.blueCount) {
        const randomBlue = Math.floor(Math.random() * currentGame.blueRange) + 1;
        if (!blueOptions.includes(randomBlue)) {
          blueOptions.push(randomBlue);
        }
      }
      
      // 如果是复式投注，可以多选一个
      if (isComplex) {
        const extraBlue = Math.floor(Math.random() * currentGame.blueRange) + 1;
        if (!blueOptions.includes(extraBlue)) {
          blueOptions.push(extraBlue);
        }
      }
      
      // 取需要的数量
      blueNumbers = isComplex 
        ? blueOptions.slice(0, Math.min(blueOptions.length, currentGame.blueCount + 1))
        : blueOptions.slice(0, currentGame.blueCount);
      
      blueNumbers.sort((a, b) => a - b);
    }
    
    setNumbers(luckyNumbers);
    setBlueNumbers(blueNumbers);
    closePersonalModal();
  };
  
  // 根据姓名选号
  const selectByName = (name) => {
    // 将姓名转换为数字
    const nameSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    // 生成红球
    let redNumbers = [];
    let seed = nameSum;
    
    while (redNumbers.length < currentGame.redCount) {
      // 使用名字总和生成一个随机数
      seed = (seed * 9301 + 49297) % 233280;
      const randomNum = Math.floor((seed / 233280) * currentGame.redRange) + 1;
      
      if (!redNumbers.includes(randomNum)) {
        redNumbers.push(randomNum);
      }
    }
    
    // 如果是复式投注，多选几个
    if (isComplex) {
      const extraCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < extraCount; i++) {
        seed = (seed * 9301 + 49297) % 233280;
        const randomNum = Math.floor((seed / 233280) * currentGame.redRange) + 1;
        
        if (!redNumbers.includes(randomNum)) {
          redNumbers.push(randomNum);
        }
      }
    }
    
    redNumbers.sort((a, b) => a - b);
    
    // 生成蓝球
    let blueNumbers = [];
    if (currentGame.blueCount > 0) {
      // 使用名字长度和总和生成蓝球
      let blueSeed = nameSum + name.length;
      
      while (blueNumbers.length < currentGame.blueCount) {
        blueSeed = (blueSeed * 9301 + 49297) % 233280;
        const blueNum = Math.floor((blueSeed / 233280) * currentGame.blueRange) + 1;
        
        if (!blueNumbers.includes(blueNum)) {
          blueNumbers.push(blueNum);
        }
      }
      
      // 如果是复式投注，多选一个蓝球
      if (isComplex) {
        blueSeed = (blueSeed * 9301 + 49297) % 233280;
        const extraBlue = Math.floor((blueSeed / 233280) * currentGame.blueRange) + 1;
        
        if (!blueNumbers.includes(extraBlue)) {
          blueNumbers.push(extraBlue);
        }
      }
      
      blueNumbers.sort((a, b) => a - b);
    }
    
    setNumbers(redNumbers);
    setBlueNumbers(blueNumbers);
    closePersonalModal();
  };
  
  // 根据心情选号
  const selectByMood = (mood) => {
    // 不同心情对应的数字特征
    const moodPatterns = {
      'happy': { prefer: [1, 3, 6, 8, 9], avoid: [4, 7] },
      'calm': { prefer: [2, 5, 7, 10, 11], avoid: [3, 9] },
      'excited': { prefer: [3, 6, 9, 12, 15], avoid: [5, 10] },
      'nostalgic': { prefer: [4, 8, 12, 16, 20], avoid: [1, 13] },
      'hopeful': { prefer: [5, 10, 15, 20, 25], avoid: [4, 14] }
    };
    
    const pattern = moodPatterns[mood] || { prefer: [], avoid: [] };
    
    // 生成红球
    let redNumbers = [];
    
    // 首先添加偏好的数字
    for (let num of pattern.prefer) {
      if (num <= currentGame.redRange && !redNumbers.includes(num)) {
        redNumbers.push(num);
      }
    }
    
    // 随机补充到需要的数量
    while (redNumbers.length < currentGame.redCount) {
      const randomNum = Math.floor(Math.random() * currentGame.redRange) + 1;
      if (!redNumbers.includes(randomNum) && !pattern.avoid.includes(randomNum)) {
        redNumbers.push(randomNum);
      }
    }
    
    // 如果是复式投注，多选几个
    if (isComplex) {
      const extraCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < extraCount; i++) {
        const randomNum = Math.floor(Math.random() * currentGame.redRange) + 1;
        if (!redNumbers.includes(randomNum) && !pattern.avoid.includes(randomNum)) {
          redNumbers.push(randomNum);
        }
      }
    }
    
    redNumbers.sort((a, b) => a - b);
    
    // 生成蓝球
    let blueNumbers = [];
    if (currentGame.blueCount > 0) {
      // 根据心情选择蓝球
      const moodBlue = {
        'happy': [1, 6],
        'calm': [2, 7],
        'excited': [3, 8],
        'nostalgic': [4, 9],
        'hopeful': [5, 10]
      };
      
      let blueOptions = moodBlue[mood] || [];
      blueOptions = blueOptions.filter(num => num <= currentGame.blueRange);
      
      // 如果选项不够，随机补充
      while (blueOptions.length < currentGame.blueCount) {
        const randomBlue = Math.floor(Math.random() * currentGame.blueRange) + 1;
        if (!blueOptions.includes(randomBlue)) {
          blueOptions.push(randomBlue);
        }
      }
      
      // 如果是复式投注，可以多选一个
      if (isComplex) {
        const extraBlue = Math.floor(Math.random() * currentGame.blueRange) + 1;
        if (!blueOptions.includes(extraBlue)) {
          blueOptions.push(extraBlue);
        }
      }
      
      // 取需要的数量
      blueNumbers = isComplex 
        ? blueOptions.slice(0, Math.min(blueOptions.length, currentGame.blueCount + 1))
        : blueOptions.slice(0, currentGame.blueCount);
      
      blueNumbers.sort((a, b) => a - b);
    }
    
    setNumbers(redNumbers);
    setBlueNumbers(blueNumbers);
    closePersonalModal();
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
            className="text-center text-white font-bold text-[32px] sm:text-[40px] mb-[30px]"
          >
            选号购买
          </motion.h1>
          
          <motion.div
            variants={fadeIn('up', 'tween', 0.3, 1)}
          >
            <BalanceDisplay />
          </motion.div>
          
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
            
            {/* 添加机选注数控制部分 */}
            {!isComplex ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[15px] mb-[20px]">
                <div className="flex items-center gap-[10px] w-full sm:w-auto">
                  <span className="text-white whitespace-nowrap">机选注数：</span>
                  <div className="flex items-center flex-1">
                    <button
                      className="purchase-button secondary py-[5px] px-[12px] rounded-full"
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
                      className="purchase-button secondary py-[5px] px-[12px] rounded-full"
                      onClick={() => setRandomCount(Math.min(100, randomCount + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  className="purchase-button secondary py-[8px] px-[15px] rounded-[20px] w-full sm:w-auto whitespace-nowrap"
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
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[15px] mb-[20px]">
                <div className="flex items-center gap-[10px] w-full sm:w-auto">
                  <span className="text-white whitespace-nowrap">机选注数：</span>
                  <div className="flex items-center flex-1">
                    <button
                      className="purchase-button secondary py-[5px] px-[12px] rounded-full"
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
                      className="purchase-button secondary py-[5px] px-[12px] rounded-full"
                      onClick={() => setComplexRandomCount(Math.min(100, complexRandomCount + 1))}
                    >
                      +
                    </button>
                  </div>
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
                <p className="text-white mr-[20px] mb-[10px]">
                  投注方式：<span className="text-[#ffcc00]">{isComplex ? '复式投注' : '单式投注'}{isAdditional ? ' + 追加投注' : ''}</span>
                </p>
                
                <p className="text-white mr-[20px] mb-[10px]">
                  注数：<span className="text-[#ffcc00] font-bold">{betCount}</span>
                </p>
                
                <p className="text-white mr-[20px] mb-[10px]">
                  单注金额：<span className="text-[#ffcc00]">¥{currentGame.price.toFixed(2)}{isAdditional ? ` + ¥${currentGame.additionalPrice.toFixed(2)}` : ''}</span>
                </p>
                
                <p className="text-white font-bold">
                  总金额：<span className="text-[#ffcc00] text-[20px]">¥{totalAmount.toFixed(2)}</span>
                </p>
              </div>
            </div>
            
            {/* 按钮部分 */}
            <div className="grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-[10px] mb-[20px]">
              <button
                className="purchase-button secondary w-full sm:w-auto text-center py-[12px] px-[15px] rounded-[30px]"
                onClick={handleRandomSelect}
              >
                <span className="hidden sm:inline">
                  {isComplex ? `机选${complexRandomCount}注` : `机选${randomCount}注`}
                </span>
                <span className="sm:hidden">
                  机选{isComplex ? complexRandomCount : randomCount}注
                </span>
              </button>
              
              <button
                className="purchase-button secondary w-full sm:w-auto text-center py-[12px] px-[15px] rounded-[30px]"
                onClick={handlePersonalSelect}
              >
                <span className="hidden sm:inline">个性选号</span>
                <span className="sm:hidden">个性选号</span>
              </button>
              
              <button
                className="purchase-button secondary w-full sm:w-auto text-center py-[12px] px-[15px] rounded-[30px]"
                onClick={() => {
                  setNumbers([]);
                  setBlueNumbers([]);
                  if (!isComplex) {
                    setSelectedBets([]);
                  }
                }}
              >
                <span className="hidden sm:inline">清空选择</span>
                <span className="sm:hidden">清空选择</span>
              </button>
              
              <button
                className={`purchase-button w-full sm:w-auto text-center py-[12px] px-[15px] rounded-[30px] ${betCount > 0 ? 'primary' : 'disabled'}`}
                onClick={handleSubmit}
                disabled={betCount === 0}
              >
                <span className="hidden sm:inline">确认购买</span>
                <span className="sm:hidden">确认购买</span>
              </button>
            </div>
            
            {/* 添加到投注列表按钮 - 仅在单式投注且有选择号码时显示 */}
            {!isComplex && numbers.length === currentGame.redCount && 
             (currentGame.blueCount === 0 || blueNumbers.length === currentGame.blueCount) && (
              <div className="flex justify-center mt-[10px]">
                <button
                  className="purchase-button secondary py-[10px] px-[20px]"
                  onClick={handleAddCurrentBet}
                >
                  添加到投注列表
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>
      
      {/* 个性选号模态框 */}
      {isPersonalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-[20px]">
          <div className="bg-[#1B2838] rounded-[20px] p-[30px] max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-[20px]">
              <h2 className="text-white font-bold text-[24px]">个性选号</h2>
              <button 
                className="text-white text-[24px] hover:text-[#ffcc00]"
                onClick={closePersonalModal}
              >
                ×
              </button>
            </div>
            
            {!personalType ? (
              <div className="flex flex-col gap-[15px]">
                <p className="text-white mb-[20px]">选择一种个性化的选号方式：</p>
                
                <button 
                  className="purchase-button secondary w-full text-left flex items-center gap-[10px] py-[15px]"
                  onClick={() => setPersonalType('birthday')}
                >
                  <span className="bg-[#ff5e5e] w-[40px] h-[40px] rounded-full flex items-center justify-center text-white">
                    🎂
                  </span>
                  <div>
                    <p className="font-bold">生日选号</p>
                    <p className="text-[14px] text-white/70">根据您的生日日期生成幸运号码</p>
                  </div>
                </button>
                
                <button 
                  className="purchase-button secondary w-full text-left flex items-center gap-[10px] py-[15px]"
                  onClick={() => setPersonalType('zodiac')}
                >
                  <span className="bg-[#5e8eff] w-[40px] h-[40px] rounded-full flex items-center justify-center text-white">
                    ♈
                  </span>
                  <div>
                    <p className="font-bold">星座选号</p>
                    <p className="text-[14px] text-white/70">根据您的星座特质生成幸运号码</p>
                  </div>
                </button>
                
                <button 
                  className="purchase-button secondary w-full text-left flex items-center gap-[10px] py-[15px]"
                  onClick={() => setPersonalType('name')}
                >
                  <span className="bg-[#ffcc00] w-[40px] h-[40px] rounded-full flex items-center justify-center text-white">
                    📝
                  </span>
                  <div>
                    <p className="font-bold">姓名选号</p>
                    <p className="text-[14px] text-white/70">根据您的姓名生成专属号码</p>
                  </div>
                </button>
                
                <button 
                  className="purchase-button secondary w-full text-left flex items-center gap-[10px] py-[15px]"
                  onClick={() => setPersonalType('mood')}
                >
                  <span className="bg-[#8855ff] w-[40px] h-[40px] rounded-full flex items-center justify-center text-white">
                    😊
                  </span>
                  <div>
                    <p className="font-bold">心情选号</p>
                    <p className="text-[14px] text-white/70">根据您当前的心情生成号码</p>
                  </div>
                </button>
              </div>
            ) : personalType === 'birthday' ? (
              <div>
                <p className="text-white mb-[20px]">请选择您的生日：</p>
                <input 
                  type="date" 
                  className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white mb-[20px]"
                  onChange={(e) => selectByBirthday(e.target.value)}
                />
                <div className="flex justify-between">
                  <button 
                    className="purchase-button secondary"
                    onClick={() => setPersonalType('')}
                  >
                    返回
                  </button>
                </div>
              </div>
            ) : personalType === 'zodiac' ? (
              <div>
                <p className="text-white mb-[20px]">请选择您的星座：</p>
                <div className="grid grid-cols-3 gap-[10px] mb-[20px]">
                  {['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].map((zodiac) => (
                    <button 
                      key={zodiac}
                      className="purchase-button secondary py-[10px] px-[5px] text-[14px]"
                      onClick={() => selectByZodiac(zodiac)}
                    >
                      {zodiac === 'aries' && '白羊座 ♈'}
                      {zodiac === 'taurus' && '金牛座 ♉'}
                      {zodiac === 'gemini' && '双子座 ♊'}
                      {zodiac === 'cancer' && '巨蟹座 ♋'}
                      {zodiac === 'leo' && '狮子座 ♌'}
                      {zodiac === 'virgo' && '处女座 ♍'}
                      {zodiac === 'libra' && '天秤座 ♎'}
                      {zodiac === 'scorpio' && '天蝎座 ♏'}
                      {zodiac === 'sagittarius' && '射手座 ♐'}
                      {zodiac === 'capricorn' && '摩羯座 ♑'}
                      {zodiac === 'aquarius' && '水瓶座 ♒'}
                      {zodiac === 'pisces' && '双鱼座 ♓'}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button 
                    className="purchase-button secondary"
                    onClick={() => setPersonalType('')}
                  >
                    返回
                  </button>
                </div>
              </div>
            ) : personalType === 'name' ? (
              <div>
                <p className="text-white mb-[20px]">请输入您的姓名：</p>
                <input 
                  type="text" 
                  placeholder="输入姓名" 
                  className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[10px] p-[12px] text-white mb-[20px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      selectByName(e.target.value.trim());
                    }
                  }}
                />
                <div className="flex justify-between">
                  <button 
                    className="purchase-button secondary"
                    onClick={() => setPersonalType('')}
                  >
                    返回
                  </button>
                  <button 
                    className="purchase-button primary"
                    onClick={(e) => {
                      const nameInput = e.target.parentNode.previousSibling;
                      if (nameInput.value.trim()) {
                        selectByName(nameInput.value.trim());
                      }
                    }}
                  >
                    生成号码
                  </button>
                </div>
              </div>
            ) : personalType === 'mood' ? (
              <div>
                <p className="text-white mb-[20px]">请选择您当前的心情：</p>
                <div className="grid grid-cols-2 gap-[15px] mb-[20px]">
                  <button 
                    className="purchase-button secondary py-[15px]"
                    onClick={() => selectByMood('happy')}
                  >
                    开心 😊
                  </button>
                  <button 
                    className="purchase-button secondary py-[15px]"
                    onClick={() => selectByMood('calm')}
                  >
                    平静 😌
                  </button>
                  <button 
                    className="purchase-button secondary py-[15px]"
                    onClick={() => selectByMood('excited')}
                  >
                    兴奋 🤩
                  </button>
                  <button 
                    className="purchase-button secondary py-[15px]"
                    onClick={() => selectByMood('nostalgic')}
                  >
                    怀旧 🥹
                  </button>
                  <button 
                    className="purchase-button secondary py-[15px]"
                    onClick={() => selectByMood('hopeful')}
                  >
                    充满希望 🌟
                  </button>
                </div>
                <div className="flex justify-between">
                  <button 
                    className="purchase-button secondary"
                    onClick={() => setPersonalType('')}
                  >
                    返回
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      
      {/* 登录模态框 */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      
      <Footer />
    </div>
  );
};

export default Purchase;