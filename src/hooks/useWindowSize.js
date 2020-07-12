import { useState, useEffect } from 'react';

/**
 * Hooks that returns the dynamically updated window's size
 * @returns {Number[]} the latest [window.innerWidth, window.innerHeight]
 */
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