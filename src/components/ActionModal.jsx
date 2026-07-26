import React from 'react';
import { useGame } from '../context/GameContext';
import { useIsLandscape } from '../hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';

const ActionModal = () => {
  const { pendingAction } = useGame();
  const isLandscape = useIsLandscape();

  if (!pendingAction) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 4000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: isLandscape ? '6px 12px' : 'clamp(10px, 3vh, 30px)',
          pointerEvents: 'auto'
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass"
          style={{ 
            width: isLandscape ? '95%' : '90%',
            maxWidth: isLandscape ? '580px' : '400px',
            maxHeight: '94vh',
            overflowY: 'auto',
            padding: isLandscape ? '10px 16px' : 'clamp(15px, 4vw, 25px)', 
            textAlign: isLandscape ? 'left' : 'center',
            display: 'flex',
            flexDirection: isLandscape ? 'row' : 'column',
            alignItems: 'center',
            gap: isLandscape ? '16px' : '15px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(15, 23, 42, 0.95)'
          }}
        >
          {pendingAction.spaceId !== undefined && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
              width: isLandscape ? '40%' : '100%',
              marginBottom: isLandscape ? 0 : '5px'
            }}>
              <img 
                src={`/cards/space-${pendingAction.spaceId}.png`} 
                alt={pendingAction.title}
                style={{
                  maxHeight: isLandscape ? '170px' : '240px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: '#000'
                }}
              />
            </div>
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isLandscape ? '8px' : '12px', width: '100%', textAlign: isLandscape ? 'left' : 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--dtu-blue)', fontSize: isLandscape ? '1.2rem' : '1.5rem' }}>{pendingAction.title}</h2>
            <p style={{ fontSize: isLandscape ? '0.95rem' : '1.2rem', margin: 0, lineHeight: '1.3' }}>{pendingAction.message}</p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: isLandscape ? 'flex-start' : 'center', marginTop: isLandscape ? '4px' : '10px' }}>
              {pendingAction.onReject && (
                <button 
                  className="glass-button" 
                  onClick={pendingAction.onReject}
                  style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--dtu-red)', padding: isLandscape ? '6px 12px' : undefined, fontSize: isLandscape ? '0.9rem' : undefined }}
                >
                  {pendingAction.rejectText || 'Cancel'}
                </button>
              )}
              <button 
                className="glass-button primary" 
                onClick={pendingAction.onConfirm}
                style={{ flex: 1, padding: isLandscape ? '6px 12px' : undefined, fontSize: isLandscape ? '0.9rem' : undefined }}
              >
                {pendingAction.confirmText || 'OK'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActionModal;
