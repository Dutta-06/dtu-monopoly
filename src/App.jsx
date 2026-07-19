import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import DiceRoller from './components/DiceRoller';
import PlayerCard from './components/PlayerCard';
import Properties from './components/Properties';
import ActionModal from './components/ActionModal';
import { Map } from 'lucide-react';

const MainBoard = () => {
  const { players } = useGame();
  const [showProperties, setShowProperties] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 4 Corner Player Cards */}
      {players.map((player, index) => (
        <PlayerCard key={player.id} player={player} position={index} />
      ))}

      {/* Centerpiece: Digital Dice */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5
      }}>
        <img 
          src="/header-logo.png" 
          alt="DTU Monopoly" 
          style={{ width: '100%', maxWidth: '400px', margin: '0 0 20px 0' }} 
        />
        <DiceRoller />
      </div>

      {/* Floating Property Button */}
      <button 
        className="glass-button"
        onClick={() => setShowProperties(true)}
        style={{
          position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', zIndex: 20
        }}
      >
        <Map size={24} />
        Property Guide
      </button>

      {/* Popups & Overlays */}
      <ActionModal />
      {showProperties && <Properties onClose={() => setShowProperties(false)} />}
      
    </div>
  );
};

const AppContent = () => {
  const { isGameStarted } = useGame();
  return isGameStarted ? <MainBoard /> : <SetupScreen />;
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
