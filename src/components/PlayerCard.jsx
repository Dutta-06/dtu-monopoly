import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, Minus } from 'lucide-react';
const PlayerCard = ({ player, position, isMobile }) => {
  const { updateBalance, propertyOwnership, propertyLevels, currentPlayerIndex, players, boardSpaces } = useGame();
  const [amount, setAmount] = useState('');

  if (!player) return null;

  const isCurrentTurn = players[currentPlayerIndex]?.id === player.id;
  const isBankrupt = player.isBankrupt;

  const handleTransaction = (isAdding) => {
    if (isBankrupt) return;
    const val = parseInt(amount);
    if (!isNaN(val) && val > 0) {
      updateBalance(player.id, isAdding ? val : -val);
      setAmount('');
    }
  };

  // Find owned properties
  const ownedProps = boardSpaces.filter(space => propertyOwnership[space.id] === player.id);

  // Determine corner styling
  const cornerStyles = isMobile ? {
    position: 'relative',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    zIndex: 10,
    border: isBankrupt ? '1px solid #334155' : (isCurrentTurn ? '2px solid var(--dtu-yellow)' : '1px solid var(--border-card)'),
    boxShadow: isBankrupt ? 'none' : (isCurrentTurn ? '0 0 15px rgba(234, 179, 8, 0.4)' : 'var(--glass-shadow)'),
    transition: 'all 0.3s ease',
    opacity: isBankrupt ? 0.5 : 1,
    filter: isBankrupt ? 'grayscale(100%)' : 'none'
  } : {
    position: 'absolute',
    width: 'var(--card-width)',
    padding: 'var(--card-padding)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    zIndex: 10,
    border: isBankrupt ? '1px solid #334155' : (isCurrentTurn ? '2px solid var(--dtu-yellow)' : '1px solid var(--border-card)'),
    boxShadow: isBankrupt ? 'none' : (isCurrentTurn ? '0 0 20px rgba(234, 179, 8, 0.4)' : 'var(--glass-shadow)'),
    transition: 'all 0.3s ease',
    opacity: isBankrupt ? 0.5 : 1,
    filter: isBankrupt ? 'grayscale(100%)' : 'none'
  };

  if (!isMobile) {
    if (position === 0) { cornerStyles.top = '10px'; cornerStyles.left = '10px'; }   // Top Left
    if (position === 1) { cornerStyles.top = '10px'; cornerStyles.right = '10px'; }  // Top Right
    if (position === 2) { cornerStyles.bottom = '10px'; cornerStyles.left = '10px'; } // Bottom Left
    if (position === 3) { cornerStyles.bottom = '10px'; cornerStyles.right = '10px'; } // Bottom Right
  }

  return (
    <div className="glass" style={cornerStyles}>
      {isBankrupt && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', color: 'red', border: '4px solid red', padding: '10px', fontSize: '1.5rem', fontWeight: 'bold', zIndex: 20 }}>
          ELIMINATED
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {player.avatar && (
          <img
            src={player.avatar}
            alt={player.name}
            style={{ width: 'clamp(28px, 5vw, 42px)', height: 'clamp(28px, 5vw, 42px)', borderRadius: '0px', objectFit: 'cover', border: '1px solid var(--dtu-yellow)', flexShrink: 0 }}
          />
        )}
        <h3 style={{ margin: 0, fontSize: 'clamp(0.75rem, 2vw, 1.1rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isCurrentTurn && !isBankrupt ? 'var(--dtu-yellow)' : 'white' }}>
          {player.name}
        </h3>
      </div>
      
      <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 2rem)', fontWeight: 'bold', color: 'var(--dtu-green)', margin: '0' }}>
        M{player.balance}
      </div>

      <div style={{ display: 'flex', gap: '4px', width: '100%', boxSizing: 'border-box' }}>
        <input
          type="number"
          placeholder="Adjust M"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isBankrupt}
          style={{
            minWidth: 0,
            flex: 1,
            width: '100%',
            padding: '4px 6px',
            borderRadius: '6px',
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-card)',
            color: 'white',
            outline: 'none',
            fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
            boxSizing: 'border-box'
          }}
        />
        <button disabled={isBankrupt} onClick={() => handleTransaction(false)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid var(--dtu-red)', color: 'white', borderRadius: '6px', padding: '0 6px', cursor: 'pointer', flexShrink: 0 }}><Minus size={12} /></button>
        <button disabled={isBankrupt} onClick={() => handleTransaction(true)} style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid var(--dtu-green)', color: 'white', borderRadius: '6px', padding: '0 6px', cursor: 'pointer', flexShrink: 0 }}><Plus size={12} /></button>
      </div>

      {/* Owned Properties List */}
      <div style={{ marginTop: '3px', maxHeight: 'clamp(60px, 10vh, 100px)', overflowY: 'auto', borderTop: '1px solid var(--border-card)', paddingTop: '4px' }}>
        <p style={{ margin: '0 0 3px 0', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', color: 'var(--text-muted)' }}>Owned Deeds:</p>
        {ownedProps.length === 0 ? (
          <p style={{ margin: 0, fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', color: '#64748b' }}>None</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {ownedProps.map(p => {
              const lvl = propertyLevels[p.id] || 0;
              return (
                <span key={p.id} style={{ 
                  fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)', padding: '2px 5px', borderRadius: '4px', 
                  background: p.color ? `var(--dtu-${p.color})` : '#475569',
                  color: p.color === 'yellow' || p.color === 'lightblue' || p.color === 'pink' ? 'black' : 'white',
                  fontWeight: lvl > 0 ? 'bold' : 'normal',
                  border: lvl > 0 ? '1px solid white' : 'none'
                }}>
                  {p.name} {lvl > 0 && `(L${lvl})`}
                </span>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default PlayerCard;
