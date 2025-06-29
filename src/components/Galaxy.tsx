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

  // Calculate responsive crosshair size
  const crosshairSize = Math.min(containerWidth, containerHeight) * 0.3;
  const centerGlowSize = Math.min(containerWidth, containerHeight) * 0.15;

  return (
    <div 
      ref={ref}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
      onClick={onClick}
    >
      {/* Background stars */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: Math.floor((containerWidth * containerHeight) / 4000) }).map((_, i) => (
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

      {/* Main galaxy container */}
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
        {/* Galaxy center glow */}
        <div
          className="absolute bg-gradient-radial from-yellow-400/20 via-orange-500/10 to-transparent rounded-full"
          style={{
            width: `${centerGlowSize}px`,
            height: `${centerGlowSize}px`,
            left: `${containerWidth / 2}px`,
            top: `${containerHeight / 2}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Interactive Stars */}
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

      {/* Telescope viewport overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="border-4 border-white/30 rounded-full relative"
          style={{
            width: `${crosshairSize}px`,
            height: `${crosshairSize}px`
          }}
        >
          <div 
            className="absolute border-2 border-white/20 rounded-full"
            style={{
              inset: `${crosshairSize * 0.0625}px` // 4px equivalent at 64px base size
            }}
          />
          <div 
            className="absolute border border-white/10 rounded-full"
            style={{
              inset: `${crosshairSize * 0.125}px` // 8px equivalent at 64px base size
            }}
          />
          
          {/* Crosshairs */}
          <div 
            className="absolute left-1/2 w-0.5 bg-white/20 transform -translate-x-0.5"
            style={{
              top: `${crosshairSize * 0.0625}px`,
              bottom: `${crosshairSize * 0.0625}px`
            }}
          />
          <div 
            className="absolute top-1/2 h-0.5 bg-white/20 transform -translate-y-0.5"
            style={{
              left: `${crosshairSize * 0.0625}px`,
              right: `${crosshairSize * 0.0625}px`
            }}
          />
          
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
});