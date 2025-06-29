import React from 'react';
import { Star, Globe, Home as Comet, Rocket, Satellite, ExternalLink, MapPin, Lightbulb, X } from 'lucide-react';
import { AstronomicalEvent } from '../types/astronomy';

interface HoverDataPanelProps {
  event: AstronomicalEvent | null;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export const HoverDataPanel: React.FC<HoverDataPanelProps> = ({
  event,
  isVisible,
  position,
  onClose
}) => {
  if (!isVisible || !event) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Star': return <Star className="w-4 h-4 text-yellow-400" />;
      case 'Planet': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'Comet': return <Comet className="w-4 h-4 text-green-400" />;
      case 'Mission': return <Rocket className="w-4 h-4 text-purple-400" />;
      default: return <Satellite className="w-4 h-4 text-white" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Star': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Planet': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Comet': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Mission': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-white bg-white/10 border-white/20';
    }
  };

  // Calculate position to keep panel on screen
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 380),
    y: Math.min(position.y, window.innerHeight - 300)
  };

  return (
    <div
      className="fixed z-50 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300"
      style={{
        left: `${adjustedPosition.x + 20}px`,
        top: `${adjustedPosition.y - 10}px`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/20 border border-blue-400/30 rounded-lg">
            {getEventIcon(event.type)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-48">
              {event.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getEventTypeColor(event.type)}`}>
              {event.type}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 bg-slate-800/50 border border-slate-600/50 rounded hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location & Coordinates */}
        <div className="flex items-center gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="text-slate-300">{event.constellation}</span>
          </div>
          {event.coordinates && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-mono">
                {event.coordinates.ra} {event.coordinates.dec}
              </span>
            </div>
          )}
          {event.magnitude && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-slate-400">
                {event.magnitude.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-300 text-xs leading-relaxed mb-3">
          {event.description}
        </p>

        {/* NASA Fact */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-yellow-400 mb-1">NASA Insight</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {event.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 bg-blue-600/20 border border-blue-400/30 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-600/30 text-xs font-medium transition-all duration-200"
        >
          <ExternalLink className="w-3 h-3" />
          Explore on NASA
        </a>
      </div>

      {/* Hover indicator beam */}
      <div className="absolute -left-5 top-1/2 w-5 h-0.5 bg-gradient-to-l from-blue-400/80 to-transparent" />
    </div>
  );
};