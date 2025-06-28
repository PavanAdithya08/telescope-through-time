import React from 'react';
import { X, Star, Globe, Home as Comet, Rocket, ExternalLink, MapPin, Lightbulb, Satellite } from 'lucide-react';
import { DayEvents } from '../types/astronomy';

interface EventModalProps {
  events: DayEvents | null;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ events, onClose }) => {
  if (!events) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Star': return <Star className="w-5 h-5 text-yellow-400" />;
      case 'Planet': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Comet': return <Comet className="w-5 h-5 text-green-400" />;
      case 'Mission': return <Rocket className="w-5 h-5 text-purple-400" />;
      default: return <Satellite className="w-5 h-5 text-white" />;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 border border-blue-400/30 rounded-lg">
              <Satellite className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                NASA Astronomical Data
              </h2>
              <p className="text-slate-300 text-sm">
                {formatDate(events.date)} • Real-time space data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Events List */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {events.events.length === 0 ? (
            <div className="text-center py-12">
              <Satellite className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Events Available</h3>
              <p className="text-slate-400">NASA data is temporarily unavailable for this date</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.events.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-slate-800/40 to-slate-800/20 border border-slate-600/30 rounded-xl p-6 hover:from-slate-800/60 hover:to-slate-800/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-white">
                            {event.name}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{event.constellation}</span>
                        </div>
                        {event.coordinates && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-xs">
                              {event.coordinates.ra} {event.coordinates.dec}
                            </span>
                          </div>
                        )}
                        {event.magnitude && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-slate-400 text-xs">
                              Mag: {event.magnitude.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        {event.description}
                      </p>

                      {/* NASA Fact Section */}
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-400 mb-2">NASA Insight</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {event.fact}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-600/30 text-sm font-medium transition-all duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Explore on NASA
                        </a>
                        
                        <div className="text-xs text-slate-500">
                          Event #{index + 1} of {events.events.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/50 p-4 bg-slate-800/30">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Satellite className="w-4 h-4" />
            <span>Powered by NASA Open Data Portal</span>
            <span>•</span>
            <span>Real-time astronomical information</span>
          </div>
        </div>
      </div>
    </div>
  );
};