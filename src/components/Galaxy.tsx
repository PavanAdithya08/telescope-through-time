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

  // Calculate aperture dimensions
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const apertureRadius = Math.min(containerWidth, containerHeight) * 0.35;

  // Detect star at center of crosshairs
  useEffect(() => {
    if (!onCenterStarChange) return;

    // Clear previous timeout
    if (centerDetectionRef.current) {
      clearTimeout(centerDetectionRef.current);
    }

    // Debounce center detection to avoid excessive calls
    centerDetectionRef.current = setTimeout(() => {
      const centerThreshold = 30; // Pixels from center to consider "centered"
      
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
    }, 300); // 300ms debounce

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
      {/* Aperture mask - creates the circular telescope view */}
      <div 
        className="absolute flex items-center justify-center"
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
        {/* Starfield background visible through aperture */}
        <div 
          className="relative"
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            transform: `translate(${-centerX}px, ${-centerY}px)`,
            background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 70%, #000000 100%)'
          }}
        >
          {/* Dense background star field */}
          <div className="absolute inset-0 opacity-60">
            {Array.from({ length: Math.floor((containerWidth * containerHeight) / 2000) }).map((_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const size = Math.random() * 1.5 + 0.5;
              const opacity = Math.random() * 0.8 + 0.2;
              const animationDelay = Math.random() * 5;
              
              return (
                <div
                  key={`bg-star-${i}`}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity,
                    animationDelay: `${animationDelay}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              );
            })}
          </div>

          {/* Nebula-like galaxy center glow */}
          <div
            className="absolute bg-gradient-radial from-purple-400/20 via-blue-500/10 via-orange-500/5 to-transparent rounded-full animate-pulse"
            style={{
              width: `${Math.min(containerWidth, containerHeight) * 0.3}px`,
              height: `${Math.min(containerWidth, containerHeight) * 0.3}px`,
              left: `${containerWidth / 2}px`,
              top: `${containerHeight / 2}px`,
              transform: 'translate(-50%, -50%)',
              animationDuration: '8s'
            }}
          />

          {/* Distant galaxy spiral arms */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 5 }).map((_, armIndex) => (
              <div
                key={`spiral-arm-${armIndex}`}
                className="absolute"
                style={{
                  left: `${containerWidth / 2}px`,
                  top: `${containerHeight / 2}px`,
                  width: '2px',
                  height: `${Math.min(containerWidth, containerHeight) * 0.4}px`,
                  background: 'linear-gradient(to bottom, rgba(147, 197, 253, 0.3), transparent)',
                  transformOrigin: 'top center',
                  transform: `rotate(${armIndex * 72}deg) translate(-50%, 0)`,
                  borderRadius: '1px'
                }}
              />
            ))}
          </div>

          {/* Interactive main stars with smooth transformations */}
          <div
            className={`relative w-full h-full transition-transform duration-500 ease-out ${
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
              const baseSize = 2 + star.brightness * 4;
              
              return (
                <div
                  key={star.id}
                  className={`absolute rounded-full transition-all duration-500 cursor-pointer touch-manipulation transform-gpu
                    ${isSelected 
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/60 animate-pulse z-20 scale-150' 
                      : star.hasEvents 
                        ? 'bg-blue-400 hover:bg-blue-300 hover:shadow-lg hover:shadow-blue-400/50 z-10 hover:scale-125' 
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
                      ? '0 0 25px rgba(255, 255, 0, 0.9), 0 0 50px rgba(255, 255, 0, 0.5), 0 0 75px rgba(255, 255, 0, 0.3)' 
                      : star.hasEvents 
                        ? '0 0 15px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.3)'
                        : 'none',
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

      {/* Aperture frame with realistic telescope optics */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer aperture ring */}
        <div 
          className="absolute rounded-full border-4 border-gray-600/80"
          style={{
            width: `${apertureRadius * 2.1}px`,
            height: `${apertureRadius * 2.1}px`,
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.9)'
          }}
        />
        
        {/* Inner lens ring */}
        <div 
          className="absolute rounded-full border-2 border-gray-400/60"
          style={{
            width: `${apertureRadius * 2.05}px`,
            height: `${apertureRadius * 2.05}px`,
            boxShadow: 'inset 0 0 20px rgba(100,150,255,0.2)'
          }}
        />
      </div>

      {/* Professional crosshairs overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="relative"
          style={{
            width: `${apertureRadius * 2}px`,
            height: `${apertureRadius * 2}px`
          }}
        >
          {/* Main crosshairs */}
          <div 
            className="absolute left-1/2 w-0.5 bg-red-400/80 transform -translate-x-0.5 animate-pulse"
            style={{
              top: `${apertureRadius * 0.2}px`,
              bottom: `${apertureRadius * 0.2}px`
            }}
          />
          <div 
            className="absolute top-1/2 h-0.5 bg-red-400/80 transform -translate-y-0.5 animate-pulse"
            style={{
              left: `${apertureRadius * 0.2}px`,
              right: `${apertureRadius * 0.2}px`
            }}
          />
          
          {/* Center targeting dot */}
          <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" 
               style={{ animationDuration: '2s' }} />
          
          {/* Range finder circles */}
          <div 
            className="absolute border border-white/30 rounded-full animate-pulse"
            style={{
              width: `${apertureRadius * 0.8}px`,
              height: `${apertureRadius * 0.8}px`,
              left: `${apertureRadius * 0.6}px`,
              top: `${apertureRadius * 0.6}px`,
              animationDuration: '3s'
            }}
          />
          <div 
            className="absolute border border-white/20 rounded-full animate-pulse"
            style={{
              width: `${apertureRadius * 1.4}px`,
              height: `${apertureRadius * 1.4}px`,
              left: `${apertureRadius * 0.3}px`,
              top: `${apertureRadius * 0.3}px`,
              animationDuration: '4s'
            }}
          />
          
          {/* Corner alignment marks */}
          {[0, 90, 180, 270].map((rotation) => (
            <div
              key={rotation}
              className="absolute w-6 h-0.5 bg-green-400/60"
              style={{
                left: `${apertureRadius - 3}px`,
                top: `${apertureRadius * 0.3}px`,
                transformOrigin: `3px ${apertureRadius * 0.7}px`,
                transform: `rotate(${rotation}deg)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Sophisticated vignetting effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: `${apertureRadius * 2.6}px`,
          height: `${apertureRadius * 2.6}px`,
          background: `radial-gradient(circle, transparent ${apertureRadius * 0.9}px, rgba(0,0,0,0.2) ${apertureRadius * 1.0}px, rgba(0,0,0,0.6) ${apertureRadius * 1.15}px, rgba(0,0,0,0.9) ${apertureRadius * 1.25}px, black ${apertureRadius * 1.3}px)`,
          borderRadius: '50%'
        }}
      />
    </div>
  );
});