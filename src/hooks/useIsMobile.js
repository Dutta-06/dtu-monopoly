import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint || (window.innerHeight <= 600 && window.innerWidth <= 1024);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= breakpoint || (window.innerHeight <= 600 && window.innerWidth <= 1024)
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

export const useIsLandscape = () => {
  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight && window.innerHeight <= 600 && window.innerWidth <= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(
        window.innerWidth > window.innerHeight && window.innerHeight <= 600 && window.innerWidth <= 1024
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isLandscape;
};
