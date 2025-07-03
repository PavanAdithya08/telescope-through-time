import { useState, useCallback, useRef, useEffect } from 'react';
import { TelescopePosition } from '../types/astronomy';
import { screenToTelescopeCoordinates } from '../utils/starPositions';

export const useGalaxyInteraction = (containerWidth: number, containerHeight: number) => {
  // Initialize with centered position - galaxy center should be at screen center
  const [position, setPosition] = useState<TelescopePosition>({ 
    x: 0, 
    y: 0, 
    zoom: 3 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ ra: '12h 0m', dec: '+00°' });
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Center the galaxy when container dimensions change or on initial load
  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0) {
      // Calculate the offset needed to center the galaxy
      // Galaxy center is at (containerWidth/2, containerHeight/2) in galaxy coordinates
      // We want this to appear at screen center, so we need to translate by:
      // screen_center - (galaxy_center * zoom)
      const galaxyCenterX = containerWidth / 2;
      const galaxyCenterY = containerHeight / 2;
      const screenCenterX = containerWidth / 2;
      const screenCenterY = containerHeight / 2;
      
      const offsetX = screenCenterX - (galaxyCenterX * position.zoom);
      const offsetY = screenCenterY - (galaxyCenterY * position.zoom);
      
      setPosition(prev => ({
        ...prev,
        x: offsetX,
        y: offsetY
      }));

      // Update coordinates to show what's at screen center
      const centerCoords = screenToTelescopeCoordinates(
        screenCenterX, 
        screenCenterY, 
        containerWidth, 
        containerHeight
      );
      setCoordinates(centerCoords);
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
      const newPosition = {
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      };

      // Calculate what galaxy coordinates are currently at screen center
      const screenCenterX = containerWidth / 2;
      const screenCenterY = containerHeight / 2;
      
      // Convert screen center back to galaxy coordinates
      const galaxyCenterX = (screenCenterX - newPosition.x) / newPosition.zoom;
      const galaxyCenterY = (screenCenterY - newPosition.y) / newPosition.zoom;
      
      // Update coordinates based on what's actually at the telescope center
      const newCoords = screenToTelescopeCoordinates(
        galaxyCenterX, 
        galaxyCenterY, 
        containerWidth, 
        containerHeight
      );
      setCoordinates(newCoords);

      return newPosition;
    });

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, containerWidth, containerHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const setZoom = useCallback((zoom: number) => {
    const newZoom = Math.max(1.0, Math.min(5, zoom));
    
    setPosition(prev => {
      // Calculate current galaxy center coordinates
      const screenCenterX = containerWidth / 2;
      const screenCenterY = containerHeight / 2;
      const currentGalaxyCenterX = (screenCenterX - prev.x) / prev.zoom;
      const currentGalaxyCenterY = (screenCenterY - prev.y) / prev.zoom;
      
      // Maintain the same galaxy center at screen center with new zoom
      const newOffsetX = screenCenterX - (currentGalaxyCenterX * newZoom);
      const newOffsetY = screenCenterY - (currentGalaxyCenterY * newZoom);
      
      return {
        ...prev,
        x: newOffsetX,
        y: newOffsetY,
        zoom: newZoom
      };
    });
  }, [containerWidth, containerHeight]);

  const focusOnPosition = useCallback((x: number, y: number) => {
    setPosition(prev => {
      // Center the specified galaxy coordinates (x, y) at screen center
      const screenCenterX = containerWidth / 2;
      const screenCenterY = containerHeight / 2;
      
      const newOffsetX = screenCenterX - (x * prev.zoom);
      const newOffsetY = screenCenterY - (y * prev.zoom);
      
      return {
        ...prev,
        x: newOffsetX,
        y: newOffsetY
      };
    });

    // Update coordinates to show the focused position
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