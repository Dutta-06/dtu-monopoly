import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import DiceRoller from './components/DiceRoller';
import PlayerCard from './components/PlayerCard';
import Properties from './components/Properties';
import ActionModal from './components/ActionModal';
import WinnerModal from './components/WinnerModal';
import { Map, Trophy } from 'lucide-react';
const MainBoard = () => {
  const { players, currentPlayerIndex, endGame, boardSpaces } = useGame();
  const [showProperties, setShowProperties] = useState(false);

  const activePlayer = players[currentPlayerIndex];
  const playerPos = activePlayer?.position || 0;
  const currentSpace = boardSpaces[playerPos] || boardSpaces[0];
  // DTU Monopoly Board: 0=Main Gate (Top-Right, 45°), 10=Fail (Bottom-Right, 135°), 20=Golf Cart (Bottom-Left, 225°), 30=Detention (Top-Left, 315°)
  const boardAngleDeg = 45 + (playerPos * 9);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* 4 Corner Player Cards */}
      {players.map((player, index) => (
        <PlayerCard key={player.id} player={player} position={index} />
      ))}

      {/* Centerpiece: Digital Dice & Directional Turn Arrow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5
      }}>
        <img
          src="/header-logo.png"
          alt="DTU Monopoly"
          style={{ width: '100%', maxWidth: 'clamp(200px, 45vw, 380px)', margin: '0 0 10px 0' }}
        />

        <DiceRoller />

        {/* Standalone Directional Board Pointer (No Box) pointing to active player's space on physical board */}
        {activePlayer && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'clamp(38px, 7vw, 54px)',
            height: 'clamp(38px, 7vw, 54px)',
            background: 'radial-gradient(circle, rgba(20,24,33,0.95) 0%, rgba(10,12,18,0.95) 100%)',
            border: `2px solid ${activePlayer.color || '#eab308'}`,
            color: activePlayer.color || '#eab308',
            borderRadius: '50%',
            fontWeight: '900',
            fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
            marginTop: 'clamp(10px, 2vw, 20px)',
            transform: `rotate(${boardAngleDeg}deg)`,
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, color 0.3s ease',
            boxShadow: `0 0 20px ${activePlayer.color || '#eab308'}66, inset 0 0 10px rgba(0,0,0,0.8)`
          }}>
            ↑
          </div>
        )}
      </div>

      {/* Floating Bottom Bar: Property Guide & End Game */}
      <div style={{
        position: 'absolute', bottom: 'max(16px, env(safe-area-inset-bottom, 16px))', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '10px', zIndex: 20,
        flexWrap: 'wrap', justifyContent: 'center'
      }}>
        <button
          className="glass-button"
          onClick={() => setShowProperties(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
            padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2.5vw, 24px)'
          }}
        >
          <Map size={18} />
          Property Guide
        </button>
        <button
          className="glass-button"
          onClick={endGame}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
            padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2.5vw, 24px)',
            border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171'
          }}
        >
          <Trophy size={18} />
          End Game & Results
        </button>
      </div>

      {/* Popups & Overlays */}
      <ActionModal />
      <WinnerModal />
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
