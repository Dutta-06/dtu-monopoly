import React, { useState, useEffect } from 'react';
import { useIsPortrait, useIsLandscape } from '../hooks/useIsMobile';
import { RotateCcw } from 'lucide-react';

const OrientationPrompt = () => {
  const isPortrait = useIsPortrait();
  const isLandscape = useIsLandscape();
  const [dismissed, setDismissed] = useState(false);

  // If the user rotates to landscape, reset dismissed state so it prompts cleanly if rotated back to portrait
  useEffect(() => {
    if (isLandscape) {
      setDismissed(false);
    }
  }, [isLandscape]);

  if (!isPortrait || dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeInMobile 0.4s ease both'
    }}>
      <div className="glass" style={{
        width: '90%',
        maxWidth: '420px',
        padding: '28px 22px',
        textAlign: 'center',
        border: '2px solid var(--dtu-yellow)',
        boxShadow: '0 0 40px rgba(234, 179, 8, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(234, 179, 8, 0.15)',
          border: '2px solid var(--dtu-yellow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--dtu-yellow)',
          marginBottom: '4px'
        }}>
          <RotateCcw size={34} />
        </div>

        <h2 style={{
          margin: 0,
          color: 'var(--dtu-yellow)',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}>
          Rotate to Landscape
        </h2>

        <p style={{
          margin: 0,
          color: 'var(--text-muted)',
          fontSize: '1rem',
          lineHeight: '1.4',
          maxWidth: '320px'
        }}>
          DTU Monopoly is best experienced in horizontal (landscape) orientation. Please rotate your phone for widescreen play.
        </p>

        <button
          className="glass-button"
          onClick={() => setDismissed(true)}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            fontSize: '0.9rem',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            cursor: 'pointer'
          }}
        >
          Continue in Portrait Anyway
        </button>
      </div>
    </div>
  );
};

export default OrientationPrompt;
