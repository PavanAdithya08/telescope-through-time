import { useEffect, useState, useRef } from 'react';

export const useContainerSize = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    // Initial measurement
    updateDimensions();

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Also listen for window resize as backup
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return { 
    containerRef, 
    width: size.width, 
    height: size.height 
  };
};