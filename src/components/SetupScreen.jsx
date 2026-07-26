import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useIsMobile, useIsLandscape } from '../hooks/useIsMobile';
import { Play } from 'lucide-react';

const SetupScreen = () => {
  const { startGame, boardSpaces, updatePropertyPrice, resetPropertyPrices, goReward, setGoReward } = useGame();
  const isMobile = useIsMobile(768);
  const isLandscape = useIsLandscape();
  const [playerCount, setPlayerCount] = useState(1);
  const [names, setNames] = useState(['', '', '', '']);
  const [avatarIndices, setAvatarIndices] = useState([0, 1, 2, 3]);
  const [isAvatarSelected, setIsAvatarSelected] = useState([false, false, false, false]);
  const [showCustomPricesModal, setShowCustomPricesModal] = useState(false);

  const purchasableSpaces = boardSpaces ? boardSpaces.filter(space => space.price !== undefined) : [];

  const playerAccents = [
    { color: '#eab308', label: 'P1' }, // Gold
    { color: '#38bdf8', label: 'P2' }, // Sky Blue
    { color: '#f43f5e', label: 'P3' }, // Rose
    { color: '#10b981', label: 'P4' }, // Emerald
  ];

  const handleStart = () => {
    if (names.slice(0, playerCount).some(n => n.trim() !== '')) {
      const playerData = names
        .slice(0, playerCount)
        .map((name, idx) => ({
          name: name.trim(),
          avatar: `/avatar-${avatarIndices[idx] + 1}.png`
        }))
        .filter(p => p.name !== '');
      startGame(playerData);
    } else {
      alert("Please enter at least one player name!");
    }
  };

  const updateName = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const prevAvatar = (index) => {
    if (isAvatarSelected[index]) return;
    setAvatarIndices(prev => {
      const next = [...prev];
      next[index] = (next[index] - 1 + 4) % 4;
      return next;
    });
  };

  const nextAvatar = (index) => {
    if (isAvatarSelected[index]) return;
    setAvatarIndices(prev => {
      const next = [...prev];
      next[index] = (next[index] + 1) % 4;
      return next;
    });
  };

  const toggleSelectAvatar = (index) => {
    setIsAvatarSelected(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const renderAvatarCard = (index) => {
    if (index >= playerCount || !names[index] || names[index].trim() === '') return null;
    const accent = playerAccents[index];
    const avatarIdx = avatarIndices[index];
    const selected = isAvatarSelected[index];

    // Position in the center of their respective quarters
    const cornerStyles = {
      position: 'absolute',
      width: '250px',
      padding: '16px',
      background: 'rgba(10, 12, 18, 0.94)',
      border: `2px solid ${accent.color}`,
      boxShadow: '0 20px 45px rgba(0,0,0,0.9)',
      borderRadius: '0px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      zIndex: 25,
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      animation: 'emergeAvatarCorner 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both'
    };

    if (index === 0) { cornerStyles.top = '25%'; cornerStyles.left = '13%'; } // Top-Left Quarter Center
    if (index === 1) { cornerStyles.top = '25%'; cornerStyles.left = '87%'; } // Top-Right Quarter Center
    if (index === 2) { cornerStyles.top = '76%'; cornerStyles.left = '13%'; } // Bottom-Left Quarter Center
    if (index === 3) { cornerStyles.top = '76%'; cornerStyles.left = '87%'; } // Bottom-Right Quarter Center

    return (
      <div key={index} style={cornerStyles}>
        {/* Player Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '10px' }}>
          <div style={{
            background: accent.color,
            color: '#000000',
            fontWeight: '800',
            fontSize: '0.8rem',
            padding: '4px 10px',
            borderRadius: '0px'
          }}>
            {accent.label}
          </div>
          <span style={{
            fontFamily: "'Playfair Display', 'Book Antiqua', 'Palatino Linotype', serif",
            fontWeight: '700',
            fontSize: '1.2rem',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {names[index]}
          </span>
        </div>

        {/* Avatar Image with Left/Right Switcher Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
          <button
            onClick={() => prevAvatar(index)}
            disabled={selected}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '12px 14px',
              borderRadius: '0px',
              cursor: selected ? 'not-allowed' : 'pointer',
              opacity: selected ? 0.25 : 1,
              fontWeight: 'bold',
              fontSize: '1.4rem',
              lineHeight: 1,
              transition: 'all 0.2s ease'
            }}
          >
            &#8249;
          </button>

          <div style={{
            width: '150px',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.45)',
            border: selected ? '2px solid #22c55e' : `1px solid ${accent.color}`,
            borderRadius: '0px',
            boxShadow: selected ? '0 0 20px #22c55e88' : '0 5px 15px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            padding: '6px'
          }}>
            <img
              src={`/avatar-${avatarIdx + 1}.png`}
              alt={`Avatar ${avatarIdx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <button
            onClick={() => nextAvatar(index)}
            disabled={selected}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '12px 14px',
              borderRadius: '0px',
              cursor: selected ? 'not-allowed' : 'pointer',
              opacity: selected ? 0.25 : 1,
              fontWeight: 'bold',
              fontSize: '1.4rem',
              lineHeight: 1,
              transition: 'all 0.2s ease'
            }}
          >
            &#8250;
          </button>
        </div>

        {/* Select / Deselect Avatar Button */}
        <button
          onClick={() => toggleSelectAvatar(index)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '0px',
            border: selected ? '2px solid #22c55e' : `1px solid ${accent.color}`,
            background: selected ? 'rgba(34, 197, 94, 0.25)' : 'rgba(234, 179, 8, 0.12)',
            color: selected ? '#4ade80' : accent.color,
            fontFamily: "'Playfair Display', 'Book Antiqua', 'Palatino Linotype', serif",
            fontWeight: '700',
            fontSize: '0.9rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {selected ? 'DESELECT' : 'SELECT'}
        </button>
      </div>
    );
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'flex-start' : 'center',
      minHeight: '100vh',
      gap: '20px',
      width: '100vw',
      overflow: isMobile ? 'auto' : 'hidden',
      overflowX: 'hidden',
      padding: isMobile ? '16px 12px 40px 12px' : '20px'
    }}>
      
      {/* Top Right Corner: Made with Love BY DTU Times */}
      <div style={{
        position: isMobile ? 'relative' : 'absolute',
        top: isMobile ? 'auto' : '25px',
        right: isMobile ? 'auto' : '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        margin: isMobile ? '0 auto 8px auto' : 0,
        zIndex: 20
      }}>
        <div style={{ textAlign: isMobile ? 'center' : 'right', lineHeight: '1.2' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Made with Love</div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--dtu-yellow)', letterSpacing: '0.5px' }}>BY DTU Times</div>
        </div>
        <img 
          src="/dtu-times-logo.png" 
          alt="DTU Times Logo" 
          style={{ height: '52px', width: 'auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
        />
      </div>

      {/* Bottom Right Corner: Credit & GitHub Repo */}
      <div style={{
        position: isMobile ? 'relative' : 'absolute',
        bottom: isMobile ? 'auto' : '25px',
        right: isMobile ? 'auto' : '30px',
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
        margin: isMobile ? '10px auto 0 auto' : 0,
        order: isMobile ? 10 : 0,
        zIndex: 20
      }}>
        Odwitiyo Dutta |{' '}
        <a
          href="https://github.com/Dutta-06/dtu-monopoly"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--dtu-yellow)',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          GitHub
        </a>
      </div>

      {/* 4 Quarter Center Avatar Selectors (Emerge when name is entered) - DESKTOP ONLY */}
      {!isMobile && names.map((_, i) => renderAvatarCard(i))}

      {/* Header Logo Banner - Cinematic Zoom-In Animation */}
      <div style={{
        position: isMobile ? 'relative' : 'absolute',
        top: isMobile ? 'auto' : '18px',
        left: isMobile ? 'auto' : '50%',
        transform: isMobile ? 'none' : 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
        width: '100%',
        maxWidth: isLandscape ? '180px' : (isMobile ? '260px' : '460px'),
        margin: isMobile ? '0 auto 6px auto' : 0,
        animation: isMobile ? 'fadeInMobile 0.8s ease both' : 'zoomInHeader 2.4s cubic-bezier(0.16, 1, 0.3, 1) both'
      }}>
        <img 
          src="/header-logo.png" 
          alt="DTU Monopoly" 
          style={{
            width: '100%',
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.8))'
          }} 
        />
      </div>

      {/* Centered Registration Hub - Emerges from Nothingness after Header Zooms */}
      <div style={{
        position: isMobile ? 'relative' : 'absolute',
        top: isMobile ? 'auto' : '55%',
        left: isMobile ? 'auto' : '50%',
        transform: isMobile ? 'none' : 'translate(-50%, -50%)',
        width: isMobile ? '100%' : '90%',
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '14px' : '20px',
        zIndex: 15,
        animation: isMobile ? 'fadeInMobile 0.8s ease 0.2s both' : 'fadeInRegistration 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both'
      }}>
        {/* Editorial Title - Who's Playing? (Lifted Higher) */}
        <h2 style={{
          margin: '0 0 18px 0',
          marginTop: isMobile ? '0px' : '-55px',
          fontSize: isMobile ? '2rem' : '2.4rem',
          fontWeight: '900',
          fontFamily: "'Playfair Display', 'Book Antiqua', 'Palatino Linotype', serif",
          color: '#000000',
          letterSpacing: '1px',
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.5)'
        }}>
          Who&apos;s Playing?
        </h2>

        {/* Dynamic Grid for Adding Players (Starts with 1, up to 4) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile || playerCount === 1 ? '1fr' : 'repeat(2, 1fr)',
          gap: '16px',
          width: '100%'
        }}>
          {names.slice(0, playerCount).map((name, i) => {
            const accent = playerAccents[i];
            const hasName = name.trim() !== '';
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#000000',
                  border: hasName ? `2px solid ${accent.color}` : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0px',
                  padding: '14px 16px',
                  boxShadow: hasName ? `0 10px 25px rgba(0,0,0,0.9), 0 0 15px ${accent.color}22` : '0 5px 15px rgba(0,0,0,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{
                    background: accent.color,
                    color: '#000000',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '0px',
                    letterSpacing: '1px'
                  }}>
                    {accent.label}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: hasName ? accent.color : '#64748b', fontWeight: '600' }}>
                    {hasName ? 'ACTIVE' : 'EMPTY'}
                  </span>
                </div>

                <input
                  type="text"
                  placeholder={`Player ${i + 1} Name...`}
                  value={name}
                  onChange={(e) => updateName(i, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 0 4px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: hasName ? `1px solid ${accent.color}` : '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontFamily: "'Playfair Display', 'Book Antiqua', 'Palatino Linotype', serif",
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />

                {isMobile && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => prevAvatar(i)}
                        disabled={isAvatarSelected[i]}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: '#fff',
                          padding: '6px 14px',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          cursor: isAvatarSelected[i] ? 'not-allowed' : 'pointer',
                          opacity: isAvatarSelected[i] ? 0.3 : 1
                        }}
                      >
                        &#8249;
                      </button>

                      <img
                        src={`/avatar-${avatarIndices[i] + 1}.png`}
                        alt="Avatar"
                        style={{
                          width: '64px',
                          height: '64px',
                          objectFit: 'cover',
                          border: isAvatarSelected[i] ? '2px solid #22c55e' : `1px solid ${accent.color}`,
                          boxShadow: isAvatarSelected[i] ? '0 0 10px #22c55e' : 'none'
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => nextAvatar(i)}
                        disabled={isAvatarSelected[i]}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: '#fff',
                          padding: '6px 14px',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          cursor: isAvatarSelected[i] ? 'not-allowed' : 'pointer',
                          opacity: isAvatarSelected[i] ? 0.3 : 1
                        }}
                      >
                        &#8250;
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSelectAvatar(i)}
                      style={{
                        background: isAvatarSelected[i] ? '#22c55e' : accent.color,
                        color: '#000000',
                        border: 'none',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        width: '100%',
                        letterSpacing: '1px'
                      }}
                    >
                      {isAvatarSelected[i] ? 'SELECTED ✓' : 'SELECT AVATAR'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Player Option */}
        {playerCount < 4 && (
          <button
            onClick={() => setPlayerCount(prev => Math.min(prev + 1, 4))}
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              border: '2px dashed #eab308',
              color: '#eab308',
              fontFamily: "'Playfair Display', 'Book Antiqua', 'Palatino Linotype', serif",
              fontWeight: '700',
              fontSize: '1rem',
              padding: '12px 24px',
              borderRadius: '0px',
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              width: '100%',
              transition: 'all 0.2s ease',
              boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(234, 179, 8, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.75)';
            }}
          >
            + Add Player
          </button>
        )}

        {/* Custom Property Prices / House Rules Button */}
        <button
          onClick={() => setShowCustomPricesModal(true)}
          style={{
            background: 'rgba(20, 24, 33, 0.9)',
            border: '1px solid rgba(234, 179, 8, 0.5)',
            color: '#eab308',
            fontFamily: "'Playfair Display', 'Book Antiqua', 'Palatino Linotype', serif",
            fontWeight: '700',
            fontSize: '0.95rem',
            padding: '12px 24px',
            borderRadius: '0px',
            cursor: 'pointer',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            width: '100%',
            transition: 'all 0.2s ease',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
            marginBottom: '15px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(234, 179, 8, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(20, 24, 33, 0.9)';
          }}
        >
          ⚙️ CUSTOMIZE PROPERTY PRICES
        </button>

        {/* Professional Luxury Start Button */}
        <button
          onClick={handleStart}
          style={{
            background: '#eab308',
            border: '2px solid #eab308',
            color: '#000000',
            fontFamily: "'Playfair Display', 'Book Antiqua', 'Palatino Linotype', serif",
            fontWeight: '800',
            fontSize: '1.25rem',
            padding: '16px 48px',
            borderRadius: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(234, 179, 8, 0.35), 0 0 20px rgba(234, 179, 8, 0.2)',
            transition: 'all 0.2s ease',
            width: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#facc15';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(234, 179, 8, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#eab308';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(234, 179, 8, 0.35), 0 0 20px rgba(234, 179, 8, 0.2)';
          }}
        >
          <Play size={20} fill="#000000" /> LET&apos;S BEGIN!
        </button>
      </div>

      {/* Custom Property Prices Modal */}
      {showCustomPricesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0e1118',
            border: '2px solid var(--dtu-yellow)',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 0 50px rgba(0,0,0,0.9), 0 0 30px rgba(234, 179, 8, 0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: '#141824'
            }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--dtu-yellow)', fontFamily: "'Playfair Display', serif", fontSize: '1.4rem' }}>
                  CUSTOM PROPERTY PRICES
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Adjust property prices and GO reward before starting the game
                </span>
              </div>
              <button
                onClick={resetPropertyPrices}
                style={{
                  background: 'transparent',
                  border: '1px solid #f43f5e',
                  color: '#f43f5e',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Reset to Defaults
              </button>
            </div>

            {/* Scrollable Property List */}
            <div style={{
              padding: '20px 24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1
            }}>
              {/* Pass GO Reward Rule Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid var(--dtu-yellow)',
                padding: '12px 16px',
                marginBottom: '4px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ color: 'var(--dtu-yellow)', fontWeight: '800', fontSize: '1rem', letterSpacing: '1px' }}>
                    PASSING GO REWARD
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    Money collected when passing Main Gate
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--dtu-yellow)', fontWeight: '800' }}>M</span>
                  <input
                    type="number"
                    value={goReward}
                    onChange={(e) => setGoReward(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    style={{
                      width: '80px',
                      padding: '6px 10px',
                      background: '#000000',
                      border: '1px solid var(--dtu-yellow)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: '700',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Property Prices Label */}
              <div style={{
                color: '#64748b',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '1px',
                textAlign: 'left',
                marginTop: '4px'
              }}>
                PROPERTY PURCHASE PRICES
              </div>

              {purchasableSpaces.map(space => (
                <div key={space.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '10px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {space.color && (
                      <div style={{
                        width: '14px',
                        height: '14px',
                        backgroundColor: space.color,
                        border: '1px solid rgba(255,255,255,0.3)'
                      }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem' }}>
                        {space.name}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        {space.type.toUpperCase()} · SPACE {space.id}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--dtu-yellow)', fontWeight: '800' }}>M</span>
                    <input
                      type="number"
                      value={space.price}
                      onChange={(e) => updatePropertyPrice(space.id, e.target.value)}
                      style={{
                        width: '80px',
                        padding: '6px 10px',
                        background: '#000000',
                        border: '1px solid var(--dtu-yellow)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: '700',
                        textAlign: 'right',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              background: '#141824',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowCustomPricesModal(false)}
                style={{
                  background: 'var(--dtu-yellow)',
                  border: 'none',
                  color: '#000000',
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: '800',
                  fontSize: '1rem',
                  padding: '12px 32px',
                  cursor: 'pointer',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SetupScreen;
