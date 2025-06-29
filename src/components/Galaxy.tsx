import React, { useMemo, forwardRef, useEffect, useRef } from 'react';
import { Star, FilterType } from '../types/astronomy';

interface GalaxyProps {
  stars: Star[];
  containerWidth: number;
  containerHeight: number;
  position: { x: number; y: number; zoom: number };
  selectedStar: Star | null;
  filter: FilterType;
  onStarClick: (star: Star) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  isDragging: boolean;
  onClick?: () => void;
  onCenterStarChange?: (star: Star | null) => void;
}

export const Galaxy = forwardRef<HTMLDivElement, GalaxyProps>(({
  stars,
  containerWidth,
  containerHeight,
  position,
  selectedStar,
  filter,
  onStarClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  isDragging,
  onClick,
  onCenterStarChange
}, ref) => {
  const centerDetectionRef = useRef<NodeJS.Timeout>();

  const filteredStars = useMemo(() => {
    if (filter === 'All') return stars;
    return stars.filter(star => {
      // For now, randomly assign filter types to stars
      const starType = Math.random();
      switch (filter) {
        case 'Star': return starType < 0.4;
        case 'Planet': return starType >= 0.4 && starType < 0.6;
        case 'Comet': return starType >= 0.6 && starType < 0.8;
        case 'Mission': return starType >= 0.8;
        default: return true;
      }
    });
  }, [stars, filter]);

  // Calculate aperture dimensions - centered on screen
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const apertureRadius = Math.min(containerWidth, containerHeight) * 0.2; // Smaller aperture for better exploration

  // Create a much larger starfield area for exploration
  const starfieldWidth = containerWidth * 3;
  const starfieldHeight = containerHeight * 3;

  // Detect star at center of crosshairs
  useEffect(() => {
    if (!onCenterStarChange) return;

    // Clear previous timeout
    if (centerDetectionRef.current) {
      clearTimeout(centerDetectionRef.current);
    }

    // Debounce center detection to avoid excessive calls
    centerDetectionRef.current = setTimeout(() => {
      const centerThreshold = 25; // Pixels from center to consider "centered"
      
      // Calculate the actual center position in the star coordinate system
      const actualCenterX = centerX - position.x;
      const actualCenterY = centerY - position.y;
      
      // Find star closest to center
      let closestStar: Star | null = null;
      let closestDistance = Infinity;
      
      filteredStars.forEach(star => {
        const scaledX = star.x * position.zoom;
        const scaledY = star.y * position.zoom;
        
        const distance = Math.sqrt(
          Math.pow(scaledX - actualCenterX, 2) + 
          Math.pow(scaledY - actualCenterY, 2)
        );
        
        if (distance < centerThreshold && distance < closestDistance) {
          closestDistance = distance;
          closestStar = star;
        }
      });
      
      onCenterStarChange(closestStar);
    }, 200); // Faster detection for better responsiveness

    return () => {
      if (centerDetectionRef.current) {
        clearTimeout(centerDetectionRef.current);
      }
    };
  }, [position, filteredStars, centerX, centerY, onCenterStarChange]);

  return (
    <div 
      ref={ref}
      className="relative w-full h-full overflow-hidden bg-black"
      onClick={onClick}
    >
      {/* Full screen starfield background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 70%, #000000 100%)'
        }}
      >
        {/* Dense background star field covering the entire exploration area */}
        <div className="absolute inset-0 opacity-70">
          {Array.from({ length: Math.floor((starfieldWidth * starfieldHeight) / 2000) }).map((_, i) => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3 + 0.5;
            const opacity = Math.random() * 0.8 + 0.4;
            const animationDelay = Math.random() * 8;
            const isBlue = Math.random() > 0.25; // 75% chance for blue stars like in the image
            
            return (
              <div
                key={`bg-star-${i}`}
                className={`absolute rounded-full animate-pulse ${
                  isBlue ? 'bg-blue-400' : 'bg-white'
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity,
                  animationDelay: `${animationDelay}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  boxShadow: isBlue 
                    ? '0 0 12px rgba(96, 165, 250, 0.8), 0 0 24px rgba(96, 165, 250, 0.4)' 
                    : '0 0 8px rgba(255, 255, 255, 0.6)'
                }}
              />
            );
          })}
        </div>

        {/* Multiple golden nebula regions for depth */}
        <div
          className="absolute bg-gradient-radial from-yellow-400/30 via-orange-500/20 to-transparent rounded-full animate-pulse"
          style={{
            width: `${Math.min(containerWidth, containerHeight) * 0.6}px`,
            height: `${Math.min(containerWidth, containerHeight) * 0.6}px`,
            left: `25%`,
            top: `20%`,
            transform: 'translate(-50%, -50%)',
            animationDuration: '8s'
          }}
        />
        
        <div
          className="absolute bg-gradient-radial from-amber-300/25 via-yellow-500/15 to-transparent rounded-full animate-pulse"
          style={{
            width: `${Math.min(containerWidth, containerHeight) * 0.4}px`,
            height: `${Math.min(containerWidth, containerHeight) * 0.4}px`,
            left: `75%`,
            top: `70%`,
            transform: 'translate(-50%, -50%)',
            animationDuration: '12s'
          }}
        />

        <div
          className="absolute bg-gradient-radial from-purple-400/20 via-blue-500/15 to-transparent rounded-full animate-pulse"
          style={{
            width: `${Math.min(containerWidth, containerHeight) * 0.5}px`,
            height: `${Math.min(containerWidth, containerHeight) * 0.5}px`,
            left: `50%`,
            top: `80%`,
            transform: 'translate(-50%, -50%)',
            animationDuration: '15s'
          }}
        />

        {/* Additional smaller nebula regions */}
        <div
          className="absolute bg-gradient-radial from-cyan-400/15 via-blue-400/10 to-transparent rounded-full animate-pulse"
          style={{
            width: `${Math.min(containerWidth, containerHeight) * 0.3}px`,
            height: `${Math.min(containerWidth, containerHeight) * 0.3}px`,
            left: `15%`,
            top: `60%`,
            transform: 'translate(-50%, -50%)',
            animationDuration: '10s'
          }}
        />

        <div
          className="absolute bg-gradient-radial from-orange-400/20 via-red-500/12 to-transparent rounded-full animate-pulse"
          style={{
            width: `${Math.min(containerWidth, containerHeight) * 0.35}px`,
            height: `${Math.min(containerWidth, containerHeight) * 0.35}px`,
            left: `85%`,
            top: `25%`,
            transform: 'translate(-50%, -50%)',
            animationDuration: '14s'
          }}
        />
      </div>

      {/* Movable telescope aperture view */}
      <div 
        className="absolute flex items-center justify-center pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: `${apertureRadius * 2}px`,
          height: `${apertureRadius * 2}px`,
          clipPath: `circle(${apertureRadius}px)`,
          overflow: 'hidden'
        }}
      >
        {/* Starfield visible through aperture */}
        <div 
          className="relative pointer-events-auto"
          style={{
            width: `${starfieldWidth}px`,
            height: `${starfieldHeight}px`,
            transform: `translate(${-starfieldWidth/2}px, ${-starfieldHeight/2}px)`,
            background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 70%, #000000 100%)'
          }}
        >
          {/* Interactive main stars distributed across larger area */}
          <div
            className={`relative w-full h-full transition-transform duration-300 ease-out ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${position.zoom})`,
              willChange: 'transform'
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {filteredStars.map((star) => {
              const isSelected = selectedStar?.id === star.id;
              const baseSize = 3 + star.brightness * 5; // Larger stars for better visibility
              
              return (
                <div
                  key={star.id}
                  className={`absolute rounded-full transition-all duration-500 cursor-pointer touch-manipulation transform-gpu
                    ${isSelected 
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/70 animate-pulse z-20 scale-150' 
                      : star.hasEvents 
                        ? 'bg-blue-400 hover:bg-blue-300 hover:shadow-lg hover:shadow-blue-400/60 z-10 hover:scale-125' 
                        : 'bg-white hover:bg-yellow-200 z-10 hover:scale-110'
                    }
                  `}
                  style={{
                    left: `${star.x}px`,
                    top: `${star.y}px`,
                    width: `${baseSize}px`,
                    height: `${baseSize}px`,
                    opacity: star.brightness,
                    boxShadow: isSelected 
                      ? '0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.6), 0 0 90px rgba(255, 255, 0, 0.3)' 
                      : star.hasEvents 
                        ? '0 0 18px rgba(59, 130, 246, 0.8), 0 0 36px rgba(59, 130, 246, 0.4)'
                        : '0 0 8px rgba(255, 255, 255, 0.4)',
                    willChange: 'transform, opacity'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarClick(star);
                  }}
                  title={`${star.date} - ${star.constellation}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Professional telescope aperture frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer aperture housing */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${apertureRadius * 2.3}px`,
            height: `${apertureRadius * 2.3}px`,
            background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 25%, #4a5568 50%, #1a202c 75%, #2d3748 100%)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.9)'
          }}
        />
        
        {/* Middle ring */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${apertureRadius * 2.15}px`,
            height: `${apertureRadius * 2.15}px`,
            background: 'linear-gradient(45deg, #718096 0%, #4a5568 50%, #718096 100%)',
            boxShadow: 'inset 0 0 25px rgba(0,0,0,0.7)'
          }}
        />
        
        {/* Inner aperture rim */}
        <div 
          className="absolute rounded-full border-2 border-gray-500/80"
          style={{
            width: `${apertureRadius * 2.05}px`,
            height: `${apertureRadius * 2.05}px`,
            boxShadow: 'inset 0 0 30px rgba(100,150,255,0.2), 0 0 15px rgba(255,255,255,0.1)'
          }}
        />

        {/* Lens coatings simulation */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${apertureRadius * 2}px`,
            height: `${apertureRadius * 2}px`,
            background: 'linear-gradient(45deg, rgba(100,150,255,0.08) 0%, rgba(255,255,255,0.03) 25%, rgba(200,220,255,0.06) 50%, rgba(255,255,255,0.02) 75%, rgba(100,150,255,0.08) 100%)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />
      </div>

      {/* Enhanced crosshairs and targeting system */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="relative"
          style={{
            width: `${apertureRadius * 2}px`,
            height: `${apertureRadius * 2}px`
          }}
        >
          {/* Primary crosshairs */}
          <div 
            className="absolute left-1/2 w-0.5 bg-red-400/90 transform -translate-x-0.5 animate-pulse"
            style={{
              top: `${apertureRadius * 0.15}px`,
              bottom: `${apertureRadius * 0.15}px`,
              animationDuration: '2s'
            }}
          />
          <div 
            className="absolute top-1/2 h-0.5 bg-red-400/90 transform -translate-y-0.5 animate-pulse"
            style={{
              left: `${apertureRadius * 0.15}px`,
              right: `${apertureRadius * 0.15}px`,
              animationDuration: '2s'
            }}
          />
          
          {/* Center targeting circle */}
          <div 
            className="absolute left-1/2 top-1/2 w-4 h-4 border-2 border-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" 
            style={{ animationDuration: '3s' }}
          />
          
          {/* Range finder rings */}
          <div 
            className="absolute border border-green-400/50 rounded-full animate-pulse"
            style={{
              width: `${apertureRadius * 0.6}px`,
              height: `${apertureRadius * 0.6}px`,
              left: `${apertureRadius * 0.7}px`,
              top: `${apertureRadius * 0.7}px`,
              animationDuration: '4s'
            }}
          />
          <div 
            className="absolute border border-green-400/30 rounded-full animate-pulse"
            style={{
              width: `${apertureRadius * 1.2}px`,
              height: `${apertureRadius * 1.2}px`,
              left: `${apertureRadius * 0.4}px`,
              top: `${apertureRadius * 0.4}px`,
              animationDuration: '5s'
            }}
          />
          
          {/* Corner targeting marks */}
          {[45, 135, 225, 315].map((rotation) => (
            <div
              key={rotation}
              className="absolute w-8 h-0.5 bg-cyan-400/70"
              style={{
                left: `${apertureRadius - 4}px`,
                top: `${apertureRadius * 0.2}px`,
                transformOrigin: `4px ${apertureRadius * 0.8}px`,
                transform: `rotate(${rotation}deg)`
              }}
            />
          ))}

          {/* Distance measurement marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <div
              key={angle}
              className="absolute w-3 h-0.5 bg-white/40"
              style={{
                left: `${apertureRadius - 1.5}px`,
                top: `${apertureRadius * 0.1}px`,
                transformOrigin: `1.5px ${apertureRadius * 0.9}px`,
                transform: `rotate(${angle}deg)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced vignetting for depth */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: `${apertureRadius * 2.8}px`,
          height: `${apertureRadius * 2.8}px`,
          background: `radial-gradient(circle, transparent ${apertureRadius * 0.95}px, rgba(0,0,0,0.1) ${apertureRadius * 1.0}px, rgba(0,0,0,0.4) ${apertureRadius * 1.1}px, rgba(0,0,0,0.7) ${apertureRadius * 1.2}px, rgba(0,0,0,0.9) ${apertureRadius * 1.3}px, black ${apertureRadius * 1.4}px)`,
          borderRadius: '50%'
        }}
      />
    </div>
  );
});