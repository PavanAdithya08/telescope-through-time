import { useState, useCallback, useRef } from 'react';
import { Star, AstronomicalEvent } from '../types/astronomy';
import { astronomyApi } from '../services/astronomyApi';

export const useStarHover = () => {
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [hoverEvent, setHoverEvent] = useState<AstronomicalEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentStarRef = useRef<string | null>(null);

  const checkStarHover = useCallback(async (
    mouseX: number, 
    mouseY: number, 
    containerWidth: number, 
    containerHeight: number,
    stars: Star[],
    position: { x: number; y: number; zoom: number }
  ) => {
    // Calculate telescope center in screen coordinates
    const telescopeCenterX = containerWidth / 2;
    const telescopeCenterY = containerHeight / 2;
    
    // Define hover detection radius (slightly larger than the red targeting dot)
    const hoverRadius = 15;
    
    // Find stars within hover radius of telescope center
    const starInRange = stars.find(star => {
      const starScreenX = star.x * position.zoom + position.x;
      const starScreenY = star.y * position.zoom + position.y;
      
      const distance = Math.sqrt(
        Math.pow(starScreenX - telescopeCenterX, 2) + 
        Math.pow(starScreenY - telescopeCenterY, 2)
      );
      
      return distance <= hoverRadius;
    });

    if (starInRange && starInRange.id !== currentStarRef.current) {
      // New star detected
      currentStarRef.current = starInRange.id;
      setHoveredStar(starInRange);
      setHoverPosition({ x: mouseX, y: mouseY });
      setIsLoading(true);

      // Clear existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Set new timeout for data fetching
      hoverTimeoutRef.current = setTimeout(async () => {
        try {
          const eventData = await astronomyApi.getEventsForDate(starInRange.date);
          if (eventData.events.length > 0 && currentStarRef.current === starInRange.id) {
            setHoverEvent(eventData.events[0]); // Show first event
          }
        } catch (error) {
          console.error('Error fetching hover event:', error);
        } finally {
          setIsLoading(false);
        }
      }, 500); // 500ms delay for stable hovering

    } else if (!starInRange && currentStarRef.current) {
      // No star in range, clear hover state
      clearHover();
    }
  }, []);

  const clearHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    currentStarRef.current = null;
    setHoveredStar(null);
    setHoverEvent(null);
    setIsLoading(false);
  }, []);

  const forceClose = useCallback(() => {
    clearHover();
  }, [clearHover]);

  return {
    hoveredStar,
    hoverEvent,
    isLoading,
    hoverPosition,
    checkStarHover,
    clearHover,
    forceClose
  };
};