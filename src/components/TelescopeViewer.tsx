import React from 'react';
import { Telescope, Settings, Focus, RotateCcw } from 'lucide-react';

interface TelescopeViewerProps {
  isActive: boolean;
  isHovering: boolean;
  targetStar: string | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  coordinates: { ra: string; dec: string };
}

export const TelescopeViewer: React.FC<TelescopeViewerProps> = ({
  isActive,
  isHovering,
  targetStar,
  zoom,
  onZoomChange,
  coordinates
}) => {
  return (
    <div className="fixed bottom-6 left-6 z-30">
      {/* Telescope Base */}
      <div className={`relative transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
        {/* Telescope Mount */}
        <div className="relative">
          {/* Base Tripod */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full shadow-lg" />
            <div className="w-16 h-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full mx-auto mt-1" />
          </div>

          {/* Mount Column */}
          <div className="relative mx-auto w-6 h-16 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-lg shadow-lg">
            <div className="absolute inset-0.5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg opacity-30" />
          </div>

          {/* Telescope Body */}
          <div className={`relative transition-all duration-300 ${isHovering ? 'animate-pulse' : ''}`}>
            {/* Main Tube */}
            <div className="relative w-32 h-8 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 rounded-full shadow-xl transform -rotate-12 origin-left">
              {/* Chrome Highlights */}
              <div className="absolute top-1 left-2 right-8 h-1.5 bg-gradient-to-r from-white/60 to-transparent rounded-full" />
              <div className="absolute bottom-1 left-2 right-8 h-1 bg-gradient-to-r from-slate-600/60 to-transparent rounded-full" />
              
              {/* Lens Housing */}
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-slate-800 to-black rounded-full shadow-inner">
                <div className="absolute inset-1 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-full">
                  <div className="absolute inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                </div>
              </div>

              {/* Eyepiece */}
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full shadow-lg">
                <div className="absolute inset-0.5 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full">
                  <div className="absolute inset-1 bg-black rounded-full" />
                </div>
              </div>

              {/* Focus Knobs */}
              <div className="absolute top-full left-8 w-3 h-3 bg-gradient-to-br from-brass-400 to-brass-600 rounded-full shadow-md">
                <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full" />
              </div>
              <div className="absolute top-full left-12 w-2.5 h-2.5 bg-gradient-to-br from-brass-400 to-brass-600 rounded-full shadow-md">
                <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full" />
              </div>
            </div>

            {/* Status Indicators */}
            <div className="absolute -top-2 left-4 flex gap-1">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-600'
              }`} />
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isHovering ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-gray-600'
              }`} />
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                targetStar ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 'bg-gray-600'
              }`} />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="absolute -right-32 top-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 min-w-28">
          <div className="flex items-center gap-2 mb-3">
            <Telescope className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-white">CONTROL</span>
          </div>

          {/* Zoom Control */}
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Focus className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">ZOOM</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onZoomChange(Math.max(1.0, zoom - 0.5))}
                className="p-1 bg-slate-800/50 border border-slate-600/50 rounded text-white hover:bg-slate-700/50 transition-colors"
                disabled={zoom <= 1.0}
              >
                <span className="text-xs">-</span>
              </button>
              <div className="flex-1 text-center">
                <span className="text-xs font-mono text-white">{zoom.toFixed(1)}x</span>
              </div>
              <button
                onClick={() => onZoomChange(Math.min(5.0, zoom + 0.5))}
                className="p-1 bg-slate-800/50 border border-slate-600/50 rounded text-white hover:bg-slate-700/50 transition-colors"
                disabled={zoom >= 5.0}
              >
                <span className="text-xs">+</span>
              </button>
            </div>
          </div>

          {/* Coordinates */}
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Settings className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">COORDS</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">RA:</span>
                <span className="text-white font-mono">{coordinates.ra}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">DEC:</span>
                <span className="text-white font-mono">{coordinates.dec}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">STATUS</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
                <span className="text-slate-300">ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${isHovering ? 'bg-blue-400' : 'bg-gray-600'}`} />
                <span className="text-slate-300">TARGET</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${targetStar ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                <span className="text-slate-300">LOCK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Targeting Beam Effect */}
        {isHovering && (
          <div className="absolute top-8 left-28 w-96 h-0.5 bg-gradient-to-r from-red-500/80 via-red-400/60 to-transparent animate-pulse" 
               style={{ transform: 'rotate(-12deg)' }} />
        )}
      </div>
    </div>
  );
};