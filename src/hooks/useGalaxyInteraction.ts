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
      // After zoom transformation, to center it on screen we need:
      // position.x = containerWidth/2 - (containerWidth/2) * zoom
      // position.y = containerHeight/2 - (containerHeight/2) * zoom
      const initialX = (containerWidth / 2) * (1 - position.zoom);
      const initialY = (containerHeight / 2) * (1 - position.zoom);
      
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
  }, [containerWidth, containerHeight, position.zoom]);

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
      
      // Calculate what galaxy coordinates are at the telescope center (screen center)
      const galaxyCenterX = (containerWidth / 2 - newX) / prev.zoom;
      const galaxyCenterY = (containerHeight / 2 - newY) / prev.zoom;
      
      // Update coordinates
      const newCoords = screenToTelescopeCoordinates(galaxyCenterX, galaxyCenterY, containerWidth, containerHeight);
      setCoordinates(newCoords);
      
      return {
        ...prev,
        x: newX,
        y: newY
      };
    });

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, containerWidth, containerHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(0.5, Math.min(5, newZoom));
    
    setPosition(prev => {
      // Maintain the current galaxy coordinates at screen center when zooming
      const currentGalaxyCenterX = (containerWidth / 2 - prev.x) / prev.zoom;
      const currentGalaxyCenterY = (containerHeight / 2 - prev.y) / prev.zoom;
      
      // Calculate new position to keep the same galaxy point at screen center
      const newX = containerWidth / 2 - currentGalaxyCenterX * clampedZoom;
      const newY = containerHeight / 2 - currentGalaxyCenterY * clampedZoom;
      
      return {
        x: newX,
        y: newY,
        zoom: clampedZoom
      };
    });
  }, [containerWidth, containerHeight]);

  const focusOnPosition = useCallback((x: number, y: number) => {
    setPosition(prev => {
      // Calculate the translation needed to center the star at screen center
      const newX = containerWidth / 2 - x * prev.zoom;
      const newY = containerHeight / 2 - y * prev.zoom;
      
      // Update coordinates to show the selected star's position
      const newCoords = screenToTelescopeCoordinates(x, y, containerWidth, containerHeight);
      setCoordinates(newCoords);
      
      return {
        ...prev,
        x: newX,
        y: newY
      };
    });
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