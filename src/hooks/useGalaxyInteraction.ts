import { useState, useCallback, useRef } from 'react';
import { TelescopePosition } from '../types/astronomy';
import { screenToTelescopeCoordinates } from '../utils/starPositions';

export const useGalaxyInteraction = (containerWidth: number, containerHeight: number) => {
  const [position, setPosition] = useState<TelescopePosition>({ 
    x: 0, 
    y: 0, 
    zoom: 3 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ ra: '12h 0m', dec: '+00°' });
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Calculate center offsets for perfect positioning
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setPosition(prev => {
      const newX = prev.x + deltaX;
      const newY = prev.y + deltaY;
      
      // Ensure smooth movement with proper boundaries
      return {
        ...prev,
        x: newX,
        y: newY
      };
    });

    // Update coordinates
    const newCoords = screenToTelescopeCoordinates(
      centerX, 
      centerY, 
      containerWidth, 
      containerHeight
    );
    setCoordinates(newCoords);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, containerWidth, containerHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setPosition(prev => {
      const clampedZoom = Math.max(0.5, Math.min(5, zoom));
      
      return {
        ...prev,
        zoom: clampedZoom
      };
    });
  }, []);

  const focusOnPosition = useCallback((x: number, y: number) => {
    // Calculate perfect centering offset
    const offsetX = centerX - x;
    const offsetY = centerY - y;
    
    setPosition(prev => ({
      ...prev,
      x: offsetX,
      y: offsetY
    }));

    const newCoords = screenToTelescopeCoordinates(
      centerX, 
      centerY, 
      containerWidth, 
      containerHeight
    );
    setCoordinates(newCoords);
  }, [containerWidth, containerHeight, centerX, centerY]);

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