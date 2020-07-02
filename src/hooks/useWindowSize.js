import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}