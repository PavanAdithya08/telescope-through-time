import { useEffect, useState, useCallback } from 'react';

export const useContainerSize = () => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Callback ref function
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (!node) return;

    const updateDimensions = () => {
      if (node) {
        const rect = node.getBoundingClientRect();
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

    resizeObserver.observe(node);

    // Also listen for window resize as backup
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [node]); // Now depends on the node state

  return { 
    containerRef, 
    width: size.width, 
    height: size.height 
  };
};