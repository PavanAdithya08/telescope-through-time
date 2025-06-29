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

  // Calculate telescope aperture dimensions
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const apertureRadius = Math.min(containerWidth, containerHeight) * 0.35;

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
    <div className="absolute inset-0 z-10">
      {/* Black telescope overlay with aperture cutout */}
      <div className="absolute inset-0 bg-black">
        {/* Aperture cutout using clip-path */}
        <div 
          className="absolute inset-0"
          style={{
            clipPath: `circle(${apertureRadius}px at ${centerX}px ${centerY}px)`,
            background: 'transparent'
          }}
        >
          <div className="w-full h-full bg-transparent" />
        </div>
        
        {/* Everything outside the aperture remains black */}
        <div 
          className="absolute inset-0 bg-black"
          style={{
            clipPath: `polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, ${centerX - apertureRadius}px ${centerY}px, ${centerX}px ${centerY - apertureRadius}px, ${centerX + apertureRadius}px ${centerY}px, ${centerX}px ${centerY + apertureRadius}px, ${centerX - apertureRadius}px ${centerY}px)`
          }}
        />
      </div>

      {/* Telescope eyepiece structure */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer telescope rim */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${apertureRadius * 2.4}px`,
            height: `${apertureRadius * 2.4}px`,
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 25%, #3a3a3a 50%, #1a1a1a 75%, #2a2a2a 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)'
          }}
        />
        
        {/* Secondary rim */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${apertureRadius * 2.2}px`,
            height: `${apertureRadius * 2.2}px`,
            background: 'linear-gradient(45deg, #4a4a4a 0%, #2a2a2a 50%, #4a4a4a 100%)',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)'
          }}
        />
        
        {/* Lens housing */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${apertureRadius * 2}px`,
            height: `${apertureRadius * 2}px`,
            background: 'linear-gradient(135deg, #6a6a6a 0%, #3a3a3a 25%, #5a5a5a 50%, #2a2a2a 75%, #4a4a4a 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)'
          }}
        />
        
        {/* Lens elements */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${apertureRadius * 1.8}px`,
            height: `${apertureRadius * 1.8}px`,
            background: 'linear-gradient(45deg, rgba(100,150,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(100,150,255,0.1) 100%)',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: 'inset 0 0 20px rgba(100,150,255,0.1), 0 0 10px rgba(255,255,255,0.1)'
          }}
        />
      </div>

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
            className="absolute left-1/2 w-0.5 bg-red-400/70 transform -translate-x-0.5"
            style={{
              top: `${apertureRadius * 0.1}px`,
              bottom: `${apertureRadius * 0.1}px`
            }}
          />
          {/* Horizontal crosshair */}
          <div 
            className="absolute top-1/2 h-0.5 bg-red-400/70 transform -translate-y-0.5"
            style={{
              left: `${apertureRadius * 0.1}px`,
              right: `${apertureRadius * 0.1}px`
            }}
          />
          
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse border border-red-300" />
          
          {/* Reticle circles */}
          <div 
            className="absolute border border-white/20 rounded-full"
            style={{
              width: `${apertureRadius * 0.6}px`,
              height: `${apertureRadius * 0.6}px`,
              left: `${apertureRadius * 0.7}px`,
              top: `${apertureRadius * 0.7}px`
            }}
          />
          <div 
            className="absolute border border-white/10 rounded-full"
            style={{
              width: `${apertureRadius * 1.2}px`,
              height: `${apertureRadius * 1.2}px`,
              left: `${apertureRadius * 0.4}px`,
              top: `${apertureRadius * 0.4}px`
            }}
          />
        </div>
      </div>

      {/* Telescope top indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="absolute rounded-full"
          style={{
            width: '14px',
            height: '14px',
            top: `${centerY - apertureRadius * 1.3}px`,
            left: `${centerX - 7}px`,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
          }}
        />
      </div>

      {/* Star detection indicator */}
      {detectedStar && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm border border-blue-400/50 rounded-lg px-4 py-2 z-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div className="text-white text-sm">
              <span className="font-medium">Star Detected:</span> {detectedStar.date}
            </div>
          </div>
        </div>
      )}

      {/* Discovery Panel on Telescope Layer */}
      <DiscoveryPanel
        filter={filter}
        onFilterChange={onFilterChange}
        zoom={position.zoom}
        onZoomChange={onZoomChange}
        coordinates={coordinates}
        isOpen={isDiscoveryPanelOpen}
        onToggle={onDiscoveryPanelToggle}
      />

      {/* Calendar on Telescope Layer */}
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />

      {/* Vignetting effect around aperture */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: `${apertureRadius * 2.6}px`,
          height: `${apertureRadius * 2.6}px`,
          background: `radial-gradient(circle, transparent ${apertureRadius * 0.8}px, rgba(0,0,0,0.2) ${apertureRadius * 0.9}px, rgba(0,0,0,0.5) ${apertureRadius * 1.1}px, rgba(0,0,0,0.8) ${apertureRadius * 1.3}px)`,
          borderRadius: '50%'
        }}
      />
    </div>
  );
};