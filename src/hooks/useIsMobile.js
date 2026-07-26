import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint || (window.innerHeight <= 700 && window.innerWidth <= 1024);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= breakpoint || (window.innerHeight <= 700 && window.innerWidth <= 1024)
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};

export const useIsLandscape = () => {
  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight && window.innerHeight <= 700 && window.innerWidth <= 1200;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(
        window.innerWidth > window.innerHeight && window.innerHeight <= 700 && window.innerWidth <= 1200
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return isLandscape;
};

export const useIsPortrait = () => {
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth && window.innerWidth <= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(
        window.innerHeight > window.innerWidth && window.innerWidth <= 1024
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return isPortrait;
};
