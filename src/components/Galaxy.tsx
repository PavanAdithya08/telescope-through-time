import React, { useMemo, forwardRef, useState } from 'react';
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
  onMouseMove: (e: React.MouseMove) => void;
  onMouseUp: () => void;
  isDragging: boolean;
  onClick?: () => void;
}

interface HoverInfo {
  star: Star;
  x: number;
  y: number;
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
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const filteredStars = useMemo(() => {
    if (filter === 'All') return stars;
    return stars.filter(star => star.objectType === filter);
  }, [stars, filter]);

  const getObjectColor = (objectType: string, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return 'bg-yellow-400 shadow-lg shadow-yellow-400/50';
    
    const baseColors = {
      'Star': 'bg-blue-400',
      'Planet': 'bg-amber-400',
      'Comet': 'bg-emerald-400',
      'Mission': 'bg-purple-400'
    };

    const hoverColors = {
      'Star': 'hover:bg-blue-300 hover:shadow-lg hover:shadow-blue-400/50',
      'Planet': 'hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/50',
      'Comet': 'hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/50',
      'Mission': 'hover:bg-purple-300 hover:shadow-lg hover:shadow-purple-400/50'
    };

    return `${baseColors[objectType]} ${hoverColors[objectType]}`;
  };

  const getObjectGlow = (objectType: string, isSelected: boolean) => {
    if (isSelected) return '0 0 20px rgba(255, 255, 0, 0.8), 0 0 40px rgba(255, 255, 0, 0.4)';
    
    const glows = {
      'Star': '0 0 10px rgba(59, 130, 246, 0.6)',
      'Planet': '0 0 10px rgba(245, 158, 11, 0.6)',
      'Comet': '0 0 10px rgba(16, 185, 129, 0.6)',
      'Mission': '0 0 10px rgba(147, 51, 234, 0.6)'
    };

    return glows[objectType];
  };

  const handleStarHover = (star: Star, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setHoverInfo({
      star,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleStarLeave = () => {
    setHoverInfo(null);
  };

  // Calculate responsive elements
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const eyepieceRadius = Math.min(containerWidth, containerHeight) * 0.35;
  const lensRadius = eyepieceRadius * 0.9;
  const viewRadius = eyepieceRadius * 0.75;
  const centerGlowSize = Math.min(containerWidth, containerHeight) * 0.15;

  return (
    <div 
      ref={ref}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
      onClick={onClick}
    >
      {/* Enhanced Telescope Eyepiece Structure */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer telescope housing */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${eyepieceRadius * 2.6}px`,
            height: `${eyepieceRadius * 2.6}px`,
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 25%, #374151 50%, #111827 75%, #1f2937 100%)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)'
          }}
        />
        
        {/* Telescope grip ridges */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${eyepieceRadius * 2.4}px`,
            height: `${eyepieceRadius * 2.4}px`,
            background: `repeating-conic-gradient(
              from 0deg,
              #374151 0deg 5deg,
              #4b5563 5deg 10deg
            )`,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
          }}
        />
        
        {/* Secondary rim with metallic finish */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${eyepieceRadius * 2.2}px`,
            height: `${eyepieceRadius * 2.2}px`,
            background: 'linear-gradient(45deg, #6b7280 0%, #374151 25%, #6b7280 50%, #374151 75%, #6b7280 100%)',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7), 0 0 5px rgba(255,255,255,0.1)'
          }}
        />
        
        {/* Main lens housing */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${eyepieceRadius * 2}px`,
            height: `${eyepieceRadius * 2}px`,
            background: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 25%, #9ca3af 50%, #374151 75%, #6b7280 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)'
          }}
        />
        
        {/* Outer lens element with coatings */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${lensRadius * 2}px`,
            height: `${lensRadius * 2}px`,
            background: `
              radial-gradient(circle at 30% 30%, rgba(100,150,255,0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(255,100,150,0.1) 0%, transparent 70%),
              linear-gradient(45deg, rgba(100,150,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(100,150,255,0.1) 100%)
            `,
            border: '3px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset 0 0 20px rgba(100,150,255,0.1), 0 0 15px rgba(255,255,255,0.1)'
          }}
        />
        
        {/* Inner lens element */}
        <div 
          className="absolute rounded-full"
          style={{
            width: `${viewRadius * 2.1}px`,
            height: `${viewRadius * 2.1}px`,
            background: `
              radial-gradient(circle at 25% 25%, rgba(200,220,255,0.12) 0%, transparent 60%),
              linear-gradient(135deg, rgba(200,220,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(200,220,255,0.08) 100%)
            `,
            border: '2px solid rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 0 15px rgba(200,220,255,0.1)'
          }}
        />

        {/* Telescope brand/model indicator */}
        <div 
          className="absolute text-xs font-bold text-white/40 tracking-widest"
          style={{
            top: `${centerY - eyepieceRadius * 1.45}px`,
            left: `${centerX}px`,
            transform: 'translateX(-50%)'
          }}
        >
          NASA-SCOPE
        </div>

        {/* Focus knobs */}
        <div 
          className="absolute bg-gradient-to-r from-amber-600 to-amber-500 rounded-full"
          style={{
            width: '8px',
            height: '16px',
            top: `${centerY}px`,
            right: `${centerX - eyepieceRadius * 1.1}px`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
          }}
        />
        <div 
          className="absolute bg-gradient-to-r from-amber-600 to-amber-500 rounded-full"
          style={{
            width: '8px',
            height: '16px',
            top: `${centerY}px`,
            left: `${centerX - eyepieceRadius * 1.1}px`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
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
        {/* Enhanced star field background */}
        <div 
          className="relative"
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            transform: `translate(${-centerX}px, ${-centerY}px)`,
            background: `
              radial-gradient(ellipse at 20% 80%, #1e293b 0%, #0f172a 40%, #020617 100%),
              radial-gradient(ellipse at 80% 20%, #1e293b 0%, #0f172a 40%, #020617 100%)
            `
          }}
        >
          {/* Enhanced background stars with twinkling */}
          <div className="absolute inset-0 opacity-50">
            {Array.from({ length: Math.floor((containerWidth * containerHeight) / 3000) }).map((_, i) => {
              const twinkleDelay = Math.random() * 5;
              const twinkleDuration = 2 + Math.random() * 3;
              return (
                <div
                  key={`bg-star-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${0.5 + Math.random() * 1.5}px`,
                    height: `${0.5 + Math.random() * 1.5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: `hsl(${200 + Math.random() * 60}, 70%, ${70 + Math.random() * 30}%)`,
                    animation: `pulse ${twinkleDuration}s ease-in-out infinite`,
                    animationDelay: `${twinkleDelay}s`
                  }}
                />
              );
            })}
          </div>

          {/* Enhanced galaxy center */}
          <div
            className="absolute rounded-full"
            style={{
              width: `${centerGlowSize}px`,
              height: `${centerGlowSize}px`,
              left: `${containerWidth / 2}px`,
              top: `${containerHeight / 2}px`,
              transform: 'translate(-50%, -50%)',
              background: `
                radial-gradient(circle, 
                  rgba(255, 215, 0, 0.3) 0%,
                  rgba(255, 140, 0, 0.2) 30%,
                  rgba(255, 69, 0, 0.1) 60%,
                  transparent 100%
                )
              `,
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />

          {/* Interactive celestial objects */}
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
              const baseSize = 2.5 + star.brightness * 3.5;
              
              return (
                <div
                  key={star.id}
                  className={`absolute rounded-full transition-all duration-300 cursor-pointer touch-manipulation z-10
                    ${getObjectColor(star.objectType, isSelected, false)}
                    ${isSelected ? 'animate-pulse' : ''}
                    hover:scale-125 md:hover:scale-150 active:scale-110 md:active:scale-125
                  `}
                  style={{
                    left: `${star.x}px`,
                    top: `${star.y}px`,
                    width: `${baseSize}px`,
                    height: `${baseSize}px`,
                    opacity: star.brightness,
                    boxShadow: getObjectGlow(star.objectType, isSelected)
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarClick(star);
                  }}
                  onMouseEnter={(e) => handleStarHover(star, e)}
                  onMouseLeave={handleStarLeave}
                  title={`${star.date} - ${star.constellation} (${star.objectType})`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced crosshairs and reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="relative"
          style={{
            width: `${viewRadius * 2}px`,
            height: `${viewRadius * 2}px`
          }}
        >
          {/* Main crosshairs */}
          <div 
            className="absolute left-1/2 w-0.5 bg-red-400/70 transform -translate-x-0.5"
            style={{
              top: `${viewRadius * 0.1}px`,
              bottom: `${viewRadius * 0.1}px`
            }}
          />
          <div 
            className="absolute top-1/2 h-0.5 bg-red-400/70 transform -translate-y-0.5"
            style={{
              left: `${viewRadius * 0.1}px`,
              right: `${viewRadius * 0.1}px`
            }}
          />
          
          {/* Center targeting circle */}
          <div 
            className="absolute border-2 border-red-500/60 rounded-full animate-pulse"
            style={{
              width: '20px',
              height: '20px',
              left: `${viewRadius - 10}px`,
              top: `${viewRadius - 10}px`
            }}
          />
          
          {/* Reticle circles */}
          <div 
            className="absolute border border-white/30 rounded-full"
            style={{
              width: `${viewRadius * 0.6}px`,
              height: `${viewRadius * 0.6}px`,
              left: `${viewRadius * 0.7}px`,
              top: `${viewRadius * 0.7}px`
            }}
          />
          <div 
            className="absolute border border-white/15 rounded-full"
            style={{
              width: `${viewRadius * 1.2}px`,
              height: `${viewRadius * 1.2}px`,
              left: `${viewRadius * 0.4}px`,
              top: `${viewRadius * 0.4}px`
            }}
          />
          
          {/* Distance markers */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div
              key={angle}
              className="absolute w-1 h-4 bg-white/40"
              style={{
                left: `${viewRadius + (viewRadius * 0.9) * Math.cos((angle * Math.PI) / 180) - 2}px`,
                top: `${viewRadius + (viewRadius * 0.9) * Math.sin((angle * Math.PI) / 180) - 8}px`,
                transform: `rotate(${angle + 90}deg)`,
                transformOrigin: 'center'
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced vignetting effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: `${viewRadius * 2.4}px`,
          height: `${viewRadius * 2.4}px`,
          background: `radial-gradient(circle, 
            transparent ${viewRadius * 0.75}px, 
            rgba(0,0,0,0.1) ${viewRadius * 0.85}px,
            rgba(0,0,0,0.4) ${viewRadius * 0.95}px,
            rgba(0,0,0,0.8) ${viewRadius * 1.1}px,
            black ${viewRadius * 1.2}px
          )`,
          borderRadius: '50%'
        }}
      />

      {/* Hover Information Tooltip */}
      {hoverInfo && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoverInfo.x}px`,
            top: `${hoverInfo.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 shadow-xl max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  hoverInfo.star.objectType === 'Star' ? 'bg-blue-400' :
                  hoverInfo.star.objectType === 'Planet' ? 'bg-amber-400' :
                  hoverInfo.star.objectType === 'Comet' ? 'bg-emerald-400' :
                  'bg-purple-400'
                }`}
              />
              <h4 className="text-sm font-bold text-white">{hoverInfo.star.objectType}</h4>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div><span className="text-slate-400">Date:</span> {hoverInfo.star.date}</div>
              <div><span className="text-slate-400">Constellation:</span> {hoverInfo.star.constellation}</div>
              <div><span className="text-slate-400">Brightness:</span> {hoverInfo.star.brightness.toFixed(2)}</div>
            </div>
            <div className="mt-2 text-xs text-blue-400">
              Click for NASA data →
            </div>
          </div>
        </div>
      )}
    </div>
  );
});