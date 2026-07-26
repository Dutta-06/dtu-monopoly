import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const DiceFace = ({ value }) => {
  const dots = {
    1: ['center'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
  };

  return (
    <div style={{
      width: 'var(--dice-size)',
      height: 'var(--dice-size)',
      backgroundColor: 'white',
      borderRadius: 'clamp(8px, 1.5vw, 16px)',
      position: 'relative',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.4)',
      padding: 'clamp(10px, 2vw, 16px)'
    }}>
      {dots[value].map((pos, i) => {
        let style = {
          position: 'absolute', width: 'var(--dot-size)', height: 'var(--dot-size)',
          backgroundColor: '#1e293b', borderRadius: '50%', transform: 'translate(-50%, -50%)'
        };
        if (pos.includes('top')) style.top = '25%';
        if (pos.includes('bottom')) style.top = '75%';
        if (pos.includes('middle') || pos.includes('center')) style.top = '50%';
        if (pos.includes('left')) style.left = '25%';
        if (pos.includes('right')) style.left = '75%';
        if (pos.includes('center')) style.left = '50%';
        return <div key={i} style={style} />;
      })}
    </div>
  );
};

const DiceRoller = () => {
  const { players, currentPlayerIndex, handleRoll, pendingAction } = useGame();
  
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isWaitingForResult, setIsWaitingForResult] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  const rollDice = () => {
    if (isRolling || isWaitingForResult || pendingAction) return;
    
    setIsRolling(true);

    let rolls = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 15) {
        clearInterval(interval);
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        setDice1(d1);
        setDice2(d2);
        setIsRolling(false);
        setIsWaitingForResult(true);
        
        // Wait 1 second so players can see the dice roll result before opening the card pop up
        setTimeout(() => {
          handleRoll(d1 + d2, d1 === d2);
          setIsWaitingForResult(false);
        }, 1000);
      }
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 3vw, 30px)' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 3px 0', color: 'var(--text-muted)', fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>Current Turn</h3>
        <h2 style={{ margin: 0, color: 'var(--dtu-yellow)', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>{currentPlayer?.name}</h2>
      </div>

      <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 30px)' }}>
        <motion.div animate={{ rotate: isRolling ? [0, 90, 180, 270, 360] : 0 }} transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0 }}>
          <DiceFace value={dice1} />
        </motion.div>
        <motion.div animate={{ rotate: isRolling ? [0, -90, -180, -270, -360] : 0 }} transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0 }}>
          <DiceFace value={dice2} />
        </motion.div>
      </div>

      <button 
        className="glass-button primary"
        onClick={rollDice}
        disabled={isRolling || isWaitingForResult || pendingAction}
        style={{ fontSize: '1.2rem', padding: '16px 48px', opacity: (isRolling || isWaitingForResult || pendingAction) ? 0.5 : 1 }}
      >
        {isRolling ? 'Rolling...' : isWaitingForResult ? 'Moving...' : 'ROLL DICE'}
      </button>

    </div>
  );
};

export default DiceRoller;
