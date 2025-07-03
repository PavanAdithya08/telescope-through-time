import { useState, useCallback, useRef, useEffect } from 'react';
import { TelescopePosition } from '../types/astronomy';
import { screenToTelescopeCoordinates } from '../utils/starPositions';

export const useGalaxyInteraction = (containerWidth: number, containerHeight: number) => {
  const [position, setPosition] = useState<TelescopePosition>({ x: 0, y: 0, zoom: 3 });
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ ra: '12h 0m', dec: '+00°' });
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Center the galaxy when container dimensions are available
  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0) {
      // Calculate initial position to center the galaxy
      // Galaxy is generated with center at (containerWidth/2, containerHeight/2)
      // To center it on screen with zoom 3x, we need to translate it
      const initialX = -containerWidth;
      const initialY = -containerHeight;
      
      setPosition(prev => ({
        ...prev,
        x: initialX,
        y: initialY
      }));

      // Update coordinates to show the galaxy center
      const newCoords = screenToTelescopeCoordinates(
        containerWidth / 2, 
        containerHeight / 2, 
        containerWidth, 
        containerHeight
      );
      setCoordinates(newCoords);
    }
  }, [containerWidth, containerHeight]);

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

    // Update coordinates to show what's at the telescope center (screen center)
    const galaxyCenterX = (containerWidth / 2 - (position.x + deltaX)) / position.zoom;
    const galaxyCenterY = (containerHeight / 2 - (position.y + deltaY)) / position.zoom;
    const newCoords = screenToTelescopeCoordinates(galaxyCenterX, galaxyCenterY, containerWidth, containerHeight);
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
      zoom: Math.max(0.5, Math.min(5, zoom)) // Increased max zoom to 5x
    }));
  }, []);

  const focusOnPosition = useCallback((x: number, y: number) => {
    // Calculate the translation needed to center the star at screen center
    const newX = containerWidth / 2 - x * position.zoom;
    const newY = containerHeight / 2 - y * position.zoom;
    
    setPosition(prev => ({
      ...prev,
      x: newX,
      y: newY
    }));

    // Update coordinates to show the selected star's position
    const newCoords = screenToTelescopeCoordinates(x, y, containerWidth, containerHeight);
    setCoordinates(newCoords);
  }, [containerWidth, containerHeight, position.zoom]);

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