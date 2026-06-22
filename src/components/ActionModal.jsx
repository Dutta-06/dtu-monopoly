import React from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const ActionModal = () => {
  const { pendingAction } = useGame();

  if (!pendingAction) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.1)', zIndex: 4000, // Very light background, no blur
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start', // Align to top
          paddingTop: '80px', // Push down a bit from the very top
          pointerEvents: 'auto' // Catch clicks to prevent rolling again
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass"
          style={{ 
            width: '90%', maxWidth: '400px', padding: '25px', 
            textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(15, 23, 42, 0.95)' // Make it slightly more opaque so text is readable
          }}
        >
          <h2 style={{ margin: 0, color: 'var(--dtu-blue)' }}>{pendingAction.title}</h2>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>{pendingAction.message}</p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
            {pendingAction.onReject && (
              <button 
                className="glass-button" 
                onClick={pendingAction.onReject}
                style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--dtu-red)' }}
              >
                {pendingAction.rejectText || 'Cancel'}
              </button>
            )}
            <button 
              className="glass-button primary" 
              onClick={pendingAction.onConfirm}
              style={{ flex: 1 }}
            >
              {pendingAction.confirmText || 'OK'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActionModal;
