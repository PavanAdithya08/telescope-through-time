import { useState, useCallback, useRef } from 'react';
import { TelescopePosition } from '../types/astronomy';
import { screenToTelescopeCoordinates } from '../utils/starPositions';

export const useGalaxyInteraction = (containerWidth: number, containerHeight: number) => {
  const [position, setPosition] = useState<TelescopePosition>({ x: 0, y: 0, zoom: 2.5 }); // Optimal zoom for exploration
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ ra: '12h 0m', dec: '+00°' });
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setPosition(prev => {
      // Allow movement across the entire starfield area
      const maxX = containerWidth * 1.5;
      const maxY = containerHeight * 1.5;
      const minX = -maxX;
      const minY = -maxY;
      
      return {
        ...prev,
        x: Math.max(minX, Math.min(maxX, prev.x + deltaX)),
        y: Math.max(minY, Math.min(maxY, prev.y + deltaY))
      };
    });

    // Update coordinates
    const newCoords = screenToTelescopeCoordinates(e.clientX, e.clientY, containerWidth, containerHeight);
    setCoordinates(newCoords);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, containerWidth, containerHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setPosition(prev => ({
      ...prev,
      zoom: Math.max(1.0, Math.min(5, zoom)) // Zoom range 1x to 5x for better exploration
    }));
  }, []);

  const focusOnPosition = useCallback((x: number, y: number) => {
    // Adjust for the larger starfield
    setPosition(prev => ({
      ...prev,
      x: -(x - containerWidth * 1.5) + containerWidth / 2,
      y: -(y - containerHeight * 1.5) + containerHeight / 2
    }));

    const newCoords = screenToTelescopeCoordinates(x, y, containerWidth, containerHeight);
    setCoordinates(newCoords);
  }, [containerWidth, containerHeight]);

  return {
    position,
    coordinates,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setZoom,
    focusOnPosition
  };
};