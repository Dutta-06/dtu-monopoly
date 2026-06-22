import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, Minus } from 'lucide-react';
import { BOARD_SPACES } from '../data/board';

const PlayerCard = ({ player, position }) => {
  const { updateBalance, propertyOwnership, propertyLevels, currentPlayerIndex, players } = useGame();
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
  const ownedProps = BOARD_SPACES.filter(space => propertyOwnership[space.id] === player.id);

  // Determine corner styling
  const cornerStyles = {
    position: 'absolute',
    width: '240px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 10,
    border: isBankrupt ? '1px solid #334155' : (isCurrentTurn ? '2px solid var(--dtu-yellow)' : '1px solid var(--border-card)'),
    boxShadow: isBankrupt ? 'none' : (isCurrentTurn ? '0 0 20px rgba(234, 179, 8, 0.4)' : 'var(--glass-shadow)'),
    transition: 'all 0.3s ease',
    opacity: isBankrupt ? 0.5 : 1,
    filter: isBankrupt ? 'grayscale(100%)' : 'none'
  };

  if (position === 0) { cornerStyles.top = '20px'; cornerStyles.left = '20px'; } // Top Left
  if (position === 1) { cornerStyles.top = '20px'; cornerStyles.right = '20px'; } // Top Right
  if (position === 2) { cornerStyles.bottom = '20px'; cornerStyles.left = '20px'; } // Bottom Left
  if (position === 3) { cornerStyles.bottom = '20px'; cornerStyles.right = '20px'; } // Bottom Right

  return (
    <div className="glass" style={cornerStyles}>
      {isBankrupt && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', color: 'red', border: '4px solid red', padding: '10px', fontSize: '1.5rem', fontWeight: 'bold', zIndex: 20 }}>
          ELIMINATED
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isCurrentTurn && !isBankrupt ? 'var(--dtu-yellow)' : 'white' }}>
          {player.name}
        </h3>
      </div>
      
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--dtu-green)', margin: '0' }}>
        M{player.balance}
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <input
          type="number"
          placeholder="Adjust M"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isBankrupt}
          style={{
            width: '100%', padding: '6px', borderRadius: '8px',
            background: 'var(--bg-dark)', border: '1px solid var(--border-card)',
            color: 'white', outline: 'none'
          }}
        />
        <button disabled={isBankrupt} onClick={() => handleTransaction(false)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid var(--dtu-red)', color: 'white', borderRadius: '8px', padding: '0 8px', cursor: 'pointer' }}><Minus size={14} /></button>
        <button disabled={isBankrupt} onClick={() => handleTransaction(true)} style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid var(--dtu-green)', color: 'white', borderRadius: '8px', padding: '0 8px', cursor: 'pointer' }}><Plus size={14} /></button>
      </div>

      {/* Owned Properties List */}
      <div style={{ marginTop: '5px', maxHeight: '100px', overflowY: 'auto', borderTop: '1px solid var(--border-card)', paddingTop: '5px' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owned Deeds:</p>
        {ownedProps.length === 0 ? (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>None</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {ownedProps.map(p => {
              const lvl = propertyLevels[p.id] || 0;
              return (
                <span key={p.id} style={{ 
                  fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', 
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
