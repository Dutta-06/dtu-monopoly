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
      width: '100px',
      height: '100px',
      backgroundColor: 'white',
      borderRadius: '16px',
      position: 'relative',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.4)',
      padding: '16px'
    }}>
      {dots[value].map((pos, i) => {
        let style = {
          position: 'absolute', width: '18px', height: '18px',
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

  const currentPlayer = players[currentPlayerIndex];

  const rollDice = () => {
    if (isRolling || pendingAction) return;
    
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
        
        // Trigger the board logic
        handleRoll(d1 + d2, d1 === d2);
      }
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-muted)' }}>Current Turn</h3>
        <h2 style={{ margin: 0, color: 'var(--dtu-yellow)', fontSize: '2rem' }}>{currentPlayer?.name}</h2>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
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
        disabled={isRolling || pendingAction}
        style={{ fontSize: '1.2rem', padding: '16px 48px', opacity: (isRolling || pendingAction) ? 0.5 : 1 }}
      >
        {isRolling ? 'Rolling...' : 'ROLL DICE'}
      </button>

    </div>
  );
};

export default DiceRoller;
