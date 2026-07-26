import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, RotateCcw, X, Award } from 'lucide-react';
const WinnerModal = () => {
  const { 
    players, 
    winnerModalOpen, 
    setWinnerModalOpen, 
    calculateNetWorth, 
    propertyOwnership, 
    propertyLevels, 
    resetGame,
    boardSpaces
  } = useGame();

  if (!winnerModalOpen) return null;

  // Calculate stats for all players
  const leaderboard = players.map(player => {
    const cash = player.balance;
    let propertyValue = 0;
    let propertiesOwnedCount = 0;

    boardSpaces.forEach(space => {
      if (propertyOwnership[space.id] === player.id) {
        propertiesOwnedCount++;
        const level = propertyLevels[space.id] || 0;
        propertyValue += (space.price || 0) + (level * (space.upgradeCost || 0));
      }
    });

    const netWorth = cash + propertyValue;

    return {
      ...player,
      cash,
      propertyValue,
      propertiesOwnedCount,
      netWorth
    };
  }).sort((a, b) => b.netWorth - a.netWorth);

  const winner = leaderboard[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      padding: '20px'
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '35px 30px',
        textAlign: 'center',
        border: '2px solid var(--dtu-yellow)',
        boxShadow: '0 0 40px rgba(234, 179, 8, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative'
      }}>
        
        {/* Close / Continue Button */}
        <button
          onClick={() => setWinnerModalOpen(false)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title="Continue Game"
        >
          <X size={24} />
        </button>

        {/* Title & Winner Banner */}
        <div>
          <Trophy size={60} color="var(--dtu-yellow)" style={{ margin: '0 auto 10px auto' }} />
          <h2 style={{ margin: 0, color: 'var(--dtu-yellow)', fontSize: '2rem', letterSpacing: '1px' }}>
            GAME OVER
          </h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>
            DTU Times Monopoly Edition 72
          </p>
        </div>

        {/* Winner Highlight Card */}
        {winner && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.15)',
            border: '2px solid var(--dtu-yellow)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--dtu-yellow)', fontWeight: 'bold' }}>
              <Award size={20} /> ULTIMATE WINNER
            </div>
            <h1 style={{ margin: 0, fontSize: '2.4rem', color: 'white' }}>
              {winner.name}
            </h1>
            <div style={{ fontSize: '1.4rem', color: 'var(--dtu-green)', fontWeight: 'bold' }}>
              Net Worth: M{winner.netWorth}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Cash: M{winner.cash} | Property Assets: M{winner.propertyValue} ({winner.propertiesOwnedCount} deeds)
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginTop: '5px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            Final Standings (Net Worth)
          </h4>
          
          {leaderboard.map((player, index) => (
            <div key={player.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              background: index === 0 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontWeight: 'bold',
                  color: index === 0 ? 'var(--dtu-yellow)' : 'var(--text-muted)',
                  width: '24px'
                }}>
                  #{index + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>
                    {player.name} {player.isBankrupt && <span style={{ color: 'var(--dtu-red)', fontSize: '0.75rem' }}>(BANKRUPT)</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Cash M{player.cash} + Assets M{player.propertyValue}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: index === 0 ? 'var(--dtu-yellow)' : 'var(--dtu-green)' }}>
                M{player.netWorth}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button
            className="glass-button"
            onClick={() => setWinnerModalOpen(false)}
            style={{ flex: 1, padding: '14px', fontSize: '1rem' }}
          >
            Continue Playing
          </button>
          <button
            className="glass-button primary"
            onClick={resetGame}
            style={{ flex: 1, padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <RotateCcw size={18} /> New Game
          </button>
        </div>

      </div>
    </div>
  );
};

export default WinnerModal;
