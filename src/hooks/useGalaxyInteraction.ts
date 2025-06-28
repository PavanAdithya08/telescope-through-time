import { useState, useCallback, useRef } from 'react';
import { TelescopePosition } from '../types/astronomy';
import { screenToTelescopeCoordinates } from '../utils/starPositions';

export const useGalaxyInteraction = () => {
  const [position, setPosition] = useState<TelescopePosition>({ x: 0, y: 0, zoom: 3 }); // Changed base zoom to 3x
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

    setPosition(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    // Update coordinates
    const newCoords = screenToTelescopeCoordinates(e.clientX, e.clientY);
    setCoordinates(newCoords);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setPosition(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(5, zoom)) // Increased max zoom to 5x
    }));
  }, []);

  const focusOnPosition = useCallback((x: number, y: number) => {
    setPosition(prev => ({
      ...prev,
      x: -x + 400,
      y: -y + 300
    }));

    const newCoords = screenToTelescopeCoordinates(x, y);
    setCoordinates(newCoords);
  }, []);

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