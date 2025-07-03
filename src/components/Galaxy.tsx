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
  onCrosshairHover?: (star: Star | null) => void;
}

const GalaxyComponent: React.ForwardRefRenderFunction<HTMLDivElement, GalaxyProps> = ({
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
  onCrosshairHover
}, ref) => {
  const filteredStars = useMemo(() => {
    if (filter === 'All') return stars;
    return stars.filter(star => {
      return star.type === filter;
    });
  }, [stars, filter]);

  // Find star under crosshair
  const crosshairStar = useMemo(() => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // Convert screen center to galaxy coordinates
    const galaxyCenterX = (centerX - position.x) / position.zoom;
    const galaxyCenterY = (centerY - position.y) / position.zoom;
    
    // Find closest star within crosshair radius
    const crosshairRadius = 15 / position.zoom; // Adjust for zoom
    
    let closestStar: Star | null = null;
    let closestDistance = crosshairRadius;
    
    filteredStars.forEach(star => {
      const distance = Math.sqrt(
        Math.pow(star.x - galaxyCenterX, 2) + Math.pow(star.y - galaxyCenterY, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestStar = star;
      }
    });
    
    return closestStar;
  }, [filteredStars, position, containerWidth, containerHeight]);

  // Notify parent about crosshair hover
  React.useEffect(() => {
    if (onCrosshairHover) {
      onCrosshairHover(crosshairStar);
    }
  }, [crosshairStar, onCrosshairHover]);

  // Get star color based on type
  const getStarColor = (star: Star, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse';
    }
    
    switch (star.type) {
      case 'Star':
        return 'bg-blue-400 hover:bg-blue-300 hover:shadow-lg hover:shadow-blue-400/50';
      case 'Planet':
        return 'bg-orange-400 hover:bg-orange-300 hover:shadow-lg hover:shadow-orange-400/50';
      case 'Comet':
        return 'bg-green-400 hover:bg-green-300 hover:shadow-lg hover:shadow-green-400/50';
      case 'Mission':
        return 'bg-purple-400 hover:bg-purple-300 hover:shadow-lg hover:shadow-purple-400/50';
      default:
        return 'bg-white hover:bg-yellow-200';
    }
  };

  // Get star glow effect
  const getStarGlow = (star: Star, isSelected: boolean) => {
    if (isSelected) {
      return '0 0 20px rgba(255, 255, 0, 0.8), 0 0 40px rgba(255, 255, 0, 0.4)';
    }
    
    switch (star.type) {
      case 'Star':
        return '0 0 10px rgba(59, 130, 246, 0.6)';
      case 'Planet':
        return '0 0 10px rgba(251, 146, 60, 0.6)';
      case 'Comet':
        return '0 0 10px rgba(74, 222, 128, 0.6)';
      case 'Mission':
        return '0 0 10px rgba(168, 85, 247, 0.6)';
      default:
        return 'none';
    }
  };

  // Calculate responsive crosshair size
  const crosshairSize = Math.min(containerWidth, containerHeight) * 0.3;
  const centerGlowSize = Math.min(containerWidth, containerHeight) * 0.15;

  return (
    <div
      ref={ref}
      className="galaxy-container relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    >
      {/* Background stars */}
      <div className="galaxy-background absolute inset-0 opacity-30">
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
        className={`galaxy-main relative transition-transform duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          position: 'relative',
          transform: `translate(${position.x}px, ${position.y}px) scale(${position.zoom})`,
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Galaxy center glow */}
        <div
          className="galaxy-center absolute bg-gradient-radial from-yellow-400/20 via-orange-500/10 to-transparent rounded-full"
          style={{
            width: `${centerGlowSize}px`,
            height: `${centerGlowSize}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute'
          }}
        />

        {/* Interactive Stars */}
        {filteredStars.map((star) => {
          const isSelected = selectedStar?.id === star.id;
          const isUnderCrosshair = crosshairStar?.id === star.id;
          const baseSize = 2 + star.brightness * 3;
          
          return (
            <div
              key={star.id}
              className={`star-element absolute rounded-full transition-all duration-300 cursor-pointer touch-manipulation
                ${getStarColor(star, isSelected)} 
                ${isUnderCrosshair ? 'scale-125 ring-2 ring-white/50' : ''}
                hover:scale-125 md:hover:scale-150 active:scale-110 md:active:scale-125 z-10
                ${isSelected ? 'z-20' : ''}
              `}
              style={{
                left: `${star.x}px`,
                top: `${star.y}px`,
                width: `${baseSize}px`,
                height: `${baseSize}px`,
                opacity: star.brightness,
                boxShadow: getStarGlow(star, isSelected),
                transform: 'translate(-50%, -50%)',
                position: 'absolute'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onStarClick(star);
              }}
              title={`${star.type} - ${star.date} - ${star.constellation}`}
            />
          );
        })}
      </div>

      {/* Telescope viewport overlay */}
      <div className="telescope-overlay fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div 
          className="telescope-viewport border-4 border-white/30 rounded-full relative"
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
          <div className="telescope-center absolute left-1/2 top-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const Galaxy = forwardRef(GalaxyComponent);