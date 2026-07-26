import React, { useState, useEffect } from 'react';
import { useIsMobile, useIsLandscape } from '../hooks/useIsMobile';
import { RotateCcw } from 'lucide-react';

const OrientationPrompt = () => {
  const isMobile = useIsMobile(768);
  const isLandscape = useIsLandscape();
  const [dismissed, setDismissed] = useState(false);

  // If the user rotates to landscape, reset dismissed state so it prompts cleanly if rotated back
  useEffect(() => {
    if (isLandscape) {
      setDismissed(false);
    }
  }, [isLandscape]);

  if (!isMobile || isLandscape || dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      animation: 'fadeInMobile 0.4s ease both'
    }}>
      <div className="glass" style={{
        width: '90%',
        maxWidth: '420px',
        padding: '24px 20px',
        textAlign: 'center',
        border: '2px solid var(--dtu-yellow)',
        boxShadow: '0 0 35px rgba(234, 179, 8, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(234, 179, 8, 0.15)',
          border: '1px solid var(--dtu-yellow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--dtu-yellow)',
          marginBottom: '4px'
        }}>
          <RotateCcw size={30} />
        </div>

        <h2 style={{
          margin: 0,
          color: 'var(--dtu-yellow)',
          fontSize: '1.4rem',
          letterSpacing: '0.5px'
        }}>
          Rotate to Landscape
        </h2>

        <p style={{
          margin: 0,
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          lineHeight: '1.4',
          maxWidth: '320px'
        }}>
          DTU Monopoly is best experienced in horizontal (landscape) orientation. Please rotate your phone for widescreen play.
        </p>

        <button
          className="glass-button"
          onClick={() => setDismissed(true)}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            fontSize: '0.85rem',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.05)',
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
