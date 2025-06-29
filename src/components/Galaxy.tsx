import React, { useMemo, forwardRef } from 'react';
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
  onClick
}, ref) => {
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

  // Calculate telescope eyepiece dimensions
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const eyepieceRadius = Math.min(containerWidth, containerHeight) * 0.35;
  const lensRadius = eyepieceRadius * 0.9;
  const viewRadius = eyepieceRadius * 0.75;

  return (
    <div 
      ref={ref}
      className="relative w-full h-full overflow-hidden bg-black"
      onClick={onClick}
    >
      {/* Telescope Eyepiece Structure */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer telescope rim */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${eyepieceRadius * 2.4}px`,
            height: `${eyepieceRadius * 2.4}px`,
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 25%, #3a3a3a 50%, #1a1a1a 75%, #2a2a2a 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)'
          }}
        />
        
        {/* Secondary rim */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${eyepieceRadius * 2.2}px`,
            height: `${eyepieceRadius * 2.2}px`,
            background: 'linear-gradient(45deg, #4a4a4a 0%, #2a2a2a 50%, #4a4a4a 100%)',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)'
          }}
        />
        
        {/* Lens housing */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${eyepieceRadius * 2}px`,
            height: `${eyepieceRadius * 2}px`,
            background: 'linear-gradient(135deg, #6a6a6a 0%, #3a3a3a 25%, #5a5a5a 50%, #2a2a2a 75%, #4a4a4a 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)'
          }}
        />
        
        {/* Outer lens element */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${lensRadius * 2}px`,
            height: `${lensRadius * 2}px`,
            background: 'linear-gradient(45deg, rgba(100,150,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(100,150,255,0.1) 100%)',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: 'inset 0 0 20px rgba(100,150,255,0.1), 0 0 10px rgba(255,255,255,0.1)'
          }}
        />
        
        {/* Inner lens element */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${viewRadius * 2.1}px`,
            height: `${viewRadius * 2.1}px`,
            background: 'linear-gradient(135deg, rgba(200,220,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(200,220,255,0.08) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 15px rgba(200,220,255,0.1)'
          }}
        />

        {/* Telescope eyepiece top indicator */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '12px',
            height: '12px',
            top: `${centerY - eyepieceRadius * 1.3}px`,
            left: `${centerX - 6}px`,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
          }}
        />
      </div>

      {/* Telescope view area with clipping */}
      <div 
        className="absolute flex items-center justify-center"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: `${viewRadius * 2}px`,
          height: `${viewRadius * 2}px`,
          clipPath: `circle(${viewRadius}px)`,
          overflow: 'hidden'
        }}
      >
        {/* Star field background */}
        <div 
          className="relative"
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            transform: `translate(${-centerX}px, ${-centerY}px)`,
            background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 70%, #000000 100%)'
          }}
        >
          {/* Background stars */}
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: Math.floor((containerWidth * containerHeight) / 3000) }).map((_, i) => (
              <div
                key={`bg-star-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          {/* Galaxy center glow */}
          <div
            className="absolute bg-gradient-radial from-yellow-400/15 via-orange-500/8 to-transparent rounded-full"
            style={{
              width: `${Math.min(containerWidth, containerHeight) * 0.15}px`,
              height: `${Math.min(containerWidth, containerHeight) * 0.15}px`,
              left: `${containerWidth / 2}px`,
              top: `${containerHeight / 2}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Interactive stars with galaxy transformations */}
          <div
            className={`relative w-full h-full transition-transform duration-300 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${position.zoom})`
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {filteredStars.map((star) => {
              const isSelected = selectedStar?.id === star.id;
              const baseSize = 2 + star.brightness * 3;
              
              return (
                <div
                  key={star.id}
                  className={`absolute rounded-full transition-all duration-300 cursor-pointer touch-manipulation
                    ${isSelected 
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse z-20' 
                      : star.hasEvents 
                        ? 'bg-blue-400 hover:bg-blue-300 hover:shadow-lg hover:shadow-blue-400/50 z-10' 
                        : 'bg-white hover:bg-yellow-200 z-10'
                    }
                    hover:scale-125 md:hover:scale-150 active:scale-110 md:active:scale-125
                  `}
                  style={{
                    left: `${star.x}px`,
                    top: `${star.y}px`,
                    width: `${baseSize}px`,
                    height: `${baseSize}px`,
                    opacity: star.brightness,
                    boxShadow: isSelected 
                      ? '0 0 20px rgba(255, 255, 0, 0.8), 0 0 40px rgba(255, 255, 0, 0.4)' 
                      : star.hasEvents 
                        ? '0 0 10px rgba(59, 130, 246, 0.6)'
                        : 'none'
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

      {/* Telescope crosshairs overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="relative"
          style={{
            width: `${viewRadius * 2}px`,
            height: `${viewRadius * 2}px`
          }}
        >
          {/* Vertical crosshair */}
          <div 
            className="absolute left-1/2 w-0.5 bg-red-400/60 transform -translate-x-0.5"
            style={{
              top: `${viewRadius * 0.1}px`,
              bottom: `${viewRadius * 0.1}px`
            }}
          />
          {/* Horizontal crosshair */}
          <div 
            className="absolute top-1/2 h-0.5 bg-red-400/60 transform -translate-y-0.5"
            style={{
              left: `${viewRadius * 0.1}px`,
              right: `${viewRadius * 0.1}px`
            }}
          />
          
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          
          {/* Reticle circles */}
          <div 
            className="absolute border border-white/20 rounded-full"
            style={{
              width: `${viewRadius * 0.6}px`,
              height: `${viewRadius * 0.6}px`,
              left: `${viewRadius * 0.7}px`,
              top: `${viewRadius * 0.7}px`
            }}
          />
          <div 
            className="absolute border border-white/10 rounded-full"
            style={{
              width: `${viewRadius * 1.2}px`,
              height: `${viewRadius * 1.2}px`,
              left: `${viewRadius * 0.4}px`,
              top: `${viewRadius * 0.4}px`
            }}
          />
        </div>
      </div>

      {/* Vignetting effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: `${viewRadius * 2.4}px`,
          height: `${viewRadius * 2.4}px`,
          background: `radial-gradient(circle, transparent ${viewRadius * 0.8}px, rgba(0,0,0,0.3) ${viewRadius * 0.9}px, rgba(0,0,0,0.7) ${viewRadius * 1.1}px, black ${viewRadius * 1.2}px)`,
          borderRadius: '50%'
        }}
      />
    </div>
  );
});