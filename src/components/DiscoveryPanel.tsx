import React from 'react';
import { Search, Telescope, Star, Globe, Home as Comet, Rocket, ZoomIn, ZoomOut, X } from 'lucide-react';
import { FilterType, Coordinates } from '../types/astronomy';

interface DiscoveryPanelProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  coordinates: Coordinates;
  isOpen: boolean;
  onToggle: () => void;
}

export const DiscoveryPanel: React.FC<DiscoveryPanelProps> = ({
  filter,
  onFilterChange,
  zoom,
  onZoomChange,
  coordinates,
  isOpen,
  onToggle
}) => {
  const filters: { type: FilterType; icon: React.ReactNode; label: string; color: string }[] = [
    { type: 'All', icon: <Search className="w-3 h-3" />, label: 'All', color: 'text-white' },
    { type: 'Star', icon: <Star className="w-3 h-3" />, label: 'Stars', color: 'text-yellow-400' },
    { type: 'Planet', icon: <Globe className="w-3 h-3" />, label: 'Planets', color: 'text-blue-400' },
    { type: 'Comet', icon: <Comet className="w-3 h-3" />, label: 'Comets', color: 'text-green-400' },
    { type: 'Mission', icon: <Rocket className="w-3 h-3" />, label: 'Missions', color: 'text-purple-400' }
  ];

  const zoomLevels = [1.0, 2.0, 3.0, 4.0, 5.0]; // Updated zoom levels starting from 1x to 5x

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Discovery Panel */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        w-80 md:w-64 h-full
        bg-slate-900/95 md:bg-slate-900/90 backdrop-blur-sm
        border-r border-slate-700/50
        p-4 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onToggle}
          className="md:hidden absolute top-4 right-4 p-2 bg-slate-800/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

      <div className="flex items-center gap-2 mb-6">
        <Telescope className="w-6 h-6 text-blue-400" />
        <h2 className="text-lg font-bold text-white">Discovery</h2>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Filters</h3>
        <div className="space-y-1">
          {filters.map(({ type, icon, label, color }) => (
            <button
              key={type}
              onClick={() => {
                onFilterChange(type);
                if (window.innerWidth < 768) onToggle();
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${filter === type 
                  ? 'bg-blue-600/30 border border-blue-400/50 shadow-sm' 
                  : 'bg-slate-800/30 border border-transparent hover:bg-slate-700/40'
                }
              `}
              title={label}
            >
              <span className={color}>{icon}</span>
              <span className="text-white text-xs font-medium">{label}</span>
              {filter === type && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Zoom</h3>
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={() => onZoomChange(Math.max(1.0, zoom - 0.5))}
            className="p-1.5 bg-slate-800/50 border border-slate-600/50 rounded-md hover:bg-slate-700/50 transition-colors"
            disabled={zoom <= 1.0}
          >
            <ZoomOut className="w-3 h-3 text-white" />
          </button>
          <div className="flex-1 text-center">
            <span className="text-white font-mono text-xs">{zoom.toFixed(1)}x</span>
          </div>
          <button
            onClick={() => onZoomChange(Math.min(5.0, zoom + 0.5))}
            className="p-1.5 bg-slate-800/50 border border-slate-600/50 rounded-md hover:bg-slate-700/50 transition-colors"
            disabled={zoom >= 5.0}
          >
            <ZoomIn className="w-3 h-3 text-white" />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {zoomLevels.map((level) => (
            <button
              key={level}
              onClick={() => onZoomChange(level)}
              className={`py-1 px-1 text-xs rounded transition-colors
                ${zoom === level 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }
              `}
            >
              {level}x
            </button>
          ))}
        </div>
      </div>

      {/* Telescope Coordinates */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Coordinates</h3>
        <div className="bg-slate-800/50 border border-slate-600/50 rounded-md p-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-mono text-xs">RA:</span>
              <span className="text-white font-mono text-xs">{coordinates.ra}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-mono text-xs">DEC:</span>
              <span className="text-white font-mono text-xs">{coordinates.dec}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-auto">
        <div className="bg-slate-800/20 border border-slate-600/20 rounded-md p-3">
          <h4 className="text-xs font-semibold text-white mb-2">Guide</h4>
          <ul className="text-xs text-slate-300 space-y-0.5">
            <li>• Drag to pan galaxy</li>
            <li>• Click stars for events</li>
            <li>• Blue = Stars, Orange = Planets</li>
            <li>• Green = Comets, Purple = Missions</li>
            <li>• Crosshair shows object info</li>
          </ul>
        </div>
      </div>
      </div>
    </>
  );
};