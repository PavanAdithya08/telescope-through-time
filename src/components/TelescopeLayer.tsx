import React, { useEffect, useState } from 'react';
import { DiscoveryPanel } from './DiscoveryPanel';
import { Calendar } from './Calendar';
import { Star, FilterType, Coordinates, DayEvents } from '../types/astronomy';

interface TelescopeLayerProps {
  stars: Star[];
  containerWidth: number;
  containerHeight: number;
  position: { x: number; y: number; zoom: number };
  selectedDate: string | null;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onZoomChange: (zoom: number) => void;
  onDateSelect: (date: string) => void;
  coordinates: Coordinates;
  isDiscoveryPanelOpen: boolean;
  onDiscoveryPanelToggle: () => void;
  onStarDetected: (star: Star | null) => void;
  focusOnPosition: (x: number, y: number) => void;
}

export const TelescopeLayer: React.FC<TelescopeLayerProps> = ({
  stars,
  containerWidth,
  containerHeight,
  position,
  selectedDate,
  filter,
  onFilterChange,
  onZoomChange,
  onDateSelect,
  coordinates,
  isDiscoveryPanelOpen,
  onDiscoveryPanelToggle,
  onStarDetected,
  focusOnPosition
}) => {
  const [detectedStar, setDetectedStar] = useState<Star | null>(null);

  // Calculate telescope aperture dimensions - much smaller now
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const apertureRadius = Math.min(containerWidth, containerHeight) * 0.18; // Reduced from 0.35 to 0.18

  // Detect star under crosshairs
  useEffect(() => {
    const detectStarUnderCrosshairs = () => {
      const crosshairX = centerX;
      const crosshairY = centerY;
      
      // Find the closest star to the crosshair center, accounting for zoom and position
      let closestStar: Star | null = null;
      let minDistance = 15; // Detection radius in pixels
      
      stars.forEach(star => {
        // Calculate star's screen position with current transform
        const transformedX = star.x * position.zoom + position.x;
        const transformedY = star.y * position.zoom + position.y;
        
        // Calculate distance from crosshair center
        const distance = Math.sqrt(
          Math.pow(transformedX - crosshairX, 2) + 
          Math.pow(transformedY - crosshairY, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestStar = star;
        }
      });
      
      if (closestStar !== detectedStar) {
        setDetectedStar(closestStar);
        onStarDetected(closestStar);
      }
    };

    // Debounce the detection to avoid too many API calls
    const timeoutId = setTimeout(detectStarUnderCrosshairs, 300);
    return () => clearTimeout(timeoutId);
  }, [position, stars, centerX, centerY, detectedStar, onStarDetected]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Telescope eyepiece structure */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer telescope rim */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${apertureRadius * 2.6}px`,
            height: `${apertureRadius * 2.6}px`,
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 25%, #3a3a3a 50%, #1a1a1a 75%, #2a2a2a 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)'
          }}
        />
        
        {/* Secondary rim */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${apertureRadius * 2.4}px`,
            height: `${apertureRadius * 2.4}px`,
            background: 'linear-gradient(45deg, #4a4a4a 0%, #2a2a2a 50%, #4a4a4a 100%)',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)'
          }}
        />
        
        {/* Lens housing */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${apertureRadius * 2.2}px`,
            height: `${apertureRadius * 2.2}px`,
            background: 'linear-gradient(135deg, #6a6a6a 0%, #3a3a3a 25%, #5a5a5a 50%, #2a2a2a 75%, #4a4a4a 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)'
          }}
        />
        
        {/* Lens elements */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${apertureRadius * 2}px`,
            height: `${apertureRadius * 2}px`,
            background: 'linear-gradient(45deg, rgba(100,150,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(100,150,255,0.1) 100%)',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: 'inset 0 0 20px rgba(100,150,255,0.1), 0 0 10px rgba(255,255,255,0.1)'
          }}
        />

        {/* Aperture area - this allows seeing through to the galaxy */}
        <div 
          className="absolute rounded-full pointer-events-none bg-transparent"
          style={{
            width: `${apertureRadius * 1.9}px`,
            height: `${apertureRadius * 1.9}px`,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />
      </div>

      {/* Dark overlay that covers everything except the aperture */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${centerX}px ${centerY}px, transparent ${apertureRadius * 0.95}px, rgba(0,0,0,0.3) ${apertureRadius * 1.1}px, rgba(0,0,0,0.7) ${apertureRadius * 1.3}px, rgba(0,0,0,0.95) ${apertureRadius * 1.8}px)`
        }}
      />

      {/* Telescope crosshairs overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="relative"
          style={{
            width: `${apertureRadius * 2}px`,
            height: `${apertureRadius * 2}px`
          }}
        >
          {/* Vertical crosshair */}
          <div 
            className="absolute left-1/2 w-0.5 bg-red-400/80 transform -translate-x-0.5"
            style={{
              top: `${apertureRadius * 0.2}px`,
              bottom: `${apertureRadius * 0.2}px`
            }}
          />
          {/* Horizontal crosshair */}
          <div 
            className="absolute top-1/2 h-0.5 bg-red-400/80 transform -translate-y-0.5"
            style={{
              left: `${apertureRadius * 0.2}px`,
              right: `${apertureRadius * 0.2}px`
            }}
          />
          
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse border border-red-300" />
          
          {/* Reticle circles */}
          <div 
            className="absolute border border-white/30 rounded-full"
            style={{
              width: `${apertureRadius * 0.8}px`,
              height: `${apertureRadius * 0.8}px`,
              left: `${apertureRadius * 0.6}px`,
              top: `${apertureRadius * 0.6}px`
            }}
          />
          <div 
            className="absolute border border-white/20 rounded-full"
            style={{
              width: `${apertureRadius * 1.4}px`,
              height: `${apertureRadius * 1.4}px`,
              left: `${apertureRadius * 0.3}px`,
              top: `${apertureRadius * 0.3}px`
            }}
          />
        </div>
      </div>

      {/* Telescope top indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="absolute rounded-full"
          style={{
            width: '10px',
            height: '10px',
            top: `${centerY - apertureRadius * 1.4}px`,
            left: `${centerX - 5}px`,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
          }}
        />
      </div>

      {/* Star detection indicator */}
      {detectedStar && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm border border-blue-400/50 rounded-lg px-4 py-2 z-30 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div className="text-white text-sm">
              <span className="font-medium">Star Detected:</span> {detectedStar.date}
            </div>
          </div>
        </div>
      )}

      {/* Discovery Panel on Telescope Layer - restore pointer events */}
      <div className="pointer-events-auto">
        <DiscoveryPanel
          filter={filter}
          onFilterChange={onFilterChange}
          zoom={position.zoom}
          onZoomChange={onZoomChange}
          coordinates={coordinates}
          isOpen={isDiscoveryPanelOpen}
          onToggle={onDiscoveryPanelToggle}
        />
      </div>

      {/* Calendar on Telescope Layer - restore pointer events */}
      <div className="pointer-events-auto">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>
    </div>
  );
};