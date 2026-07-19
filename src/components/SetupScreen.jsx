import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users } from 'lucide-react';

const SetupScreen = () => {
  const { startGame } = useGame();
  const [names, setNames] = useState(['', '', '', '']);

  const handleStart = () => {
    // Only start if at least one player has a name
    if (names.some(n => n.trim() !== '')) {
      startGame(names);
    } else {
      alert("Please enter at least one player name!");
    }
  };

  const updateName = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '30px' }}>
      
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/header-logo.png" 
          alt="DTU Monopoly" 
          style={{ width: '100%', maxWidth: '400px', margin: '0 0 10px 0' }} 
        />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>judge mat krna bhai jaldbazi me bnaya hai</p>
      </div>

      <div className="glass" style={{ padding: '30px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, justifyContent: 'center' }}>
          <Users color="var(--dtu-blue)" /> Player Setup
        </h2>
        
        {names.map((name, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Player ${i + 1} Name`}
            value={name}
            onChange={(e) => updateName(i, e.target.value)}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-card)',
              color: 'white',
              fontSize: '1.1rem',
              outline: 'none'
            }}
          />
        ))}

        <button 
          className="glass-button primary" 
          onClick={handleStart}
          style={{ fontSize: '1.2rem', padding: '16px', marginTop: '10px' }}
        >
          START GAME
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
