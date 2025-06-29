import React, { useState, useRef, useEffect } from 'react';
import { Star, Globe, Home as Comet, Rocket, Calendar, ExternalLink, Lightbulb, MapPin } from 'lucide-react';
import { TimelineEvent } from '../types/timeline';
import { astronomicalEvents2025 } from '../data/astronomicalEvents';

interface TelescopeTimelineProps {
  onEventSelect: (event: TimelineEvent) => void;
  selectedEvent: TimelineEvent | null;
}

export const TelescopeTimeline: React.FC<TelescopeTimelineProps> = ({
  onEventSelect,
  selectedEvent
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    setScrollPosition(element.scrollTop);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Planet': return <Globe className="w-4 h-4" />;
      case 'Comet': return <Comet className="w-4 h-4" />;
      case 'Mission': return <Rocket className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Star': return 'bg-blue-400 text-blue-400 border-blue-400/30 shadow-blue-400/20';
      case 'Planet': return 'bg-amber-400 text-amber-400 border-amber-400/30 shadow-amber-400/20';
      case 'Comet': return 'bg-emerald-400 text-emerald-400 border-emerald-400/30 shadow-emerald-400/20';
      case 'Mission': return 'bg-purple-400 text-purple-400 border-purple-400/30 shadow-purple-400/20';
      default: return 'bg-blue-400 text-blue-400 border-blue-400/30 shadow-blue-400/20';
    }
  };

  const getEventRarity = (event: TimelineEvent) => {
    if (event.isRare) return '⭐ RARE';
    if (event.isMajor) return '🌟 MAJOR';
    return '';
  };

  // Calculate parallax offset for background elements
  const parallaxOffset = scrollPosition * 0.3;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Background Stars with Parallax */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          background: `
            radial-gradient(ellipse at 20% 80%, #1e293b 0%, #0f172a 40%, #020617 100%),
            radial-gradient(ellipse at 80% 20%, #1e293b 0%, #0f172a 40%, #020617 100%)
          `
        }}
      >
        {/* Twinkling background stars */}
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${0.5 + Math.random() * 1.5}px`,
              height: `${0.5 + Math.random() * 1.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 200}%`,
              backgroundColor: `hsl(${200 + Math.random() * 60}, 70%, ${70 + Math.random() * 30}%)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Distant galaxies */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`galaxy-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 150}%`,
              background: `radial-gradient(circle, rgba(100, 150, 255, 0.3) 0%, transparent 70%)`,
              transform: `translateY(${parallaxOffset * 0.5}px)`
            }}
          />
        ))}
      </div>

      {/* Scrollable Timeline Content */}
      <div 
        ref={timelineRef}
        className="relative z-10 h-full overflow-y-auto overflow-x-hidden px-6 py-8 scroll-smooth"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(148, 163, 184, 0.3) transparent'
        }}
      >
        {/* Timeline Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl px-6 py-4">
            <Calendar className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Astronomical Events 2025</h2>
              <p className="text-sm text-slate-300">NASA-Powered Timeline Discovery</p>
            </div>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {astronomicalEvents2025.map((event, index) => {
            const isSelected = selectedEvent?.id === event.id;
            const colorClasses = getEventColor(event.type);
            const rarity = getEventRarity(event);
            
            return (
              <div
                key={event.id}
                className={`group relative ${isSelected ? 'z-20' : 'z-10'}`}
                style={{
                  transform: `translateY(${parallaxOffset * (0.1 + (index % 3) * 0.05)}px)`
                }}
              >
                {/* Timeline connector line */}
                {index < astronomicalEvents2025.length - 1 && (
                  <div 
                    className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-slate-600/50 to-transparent"
                    style={{
                      transform: `translateY(${parallaxOffset * 0.02}px)`
                    }}
                  />
                )}

                {/* Event Card */}
                <div
                  className={`relative bg-slate-900/80 backdrop-blur-md border rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-[1.02] hover:bg-slate-800/80
                    ${isSelected 
                      ? 'border-blue-400/50 shadow-lg shadow-blue-400/20 scale-[1.02]' 
                      : 'border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  onClick={() => onEventSelect(event)}
                >
                  {/* Event Icon & Type Badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className={`flex-shrink-0 p-3 rounded-xl border bg-opacity-20 shadow-lg ${colorClasses.split(' ').slice(1).join(' ')}`}
                    >
                      <div className={colorClasses.split(' ')[1]}>
                        {getEventIcon(event.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {event.name}
                        </h3>
                        {rarity && (
                          <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2 py-1 whitespace-nowrap">
                            {rarity}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">{event.date}</span>
                        </div>
                        {event.time && (
                          <div className="text-sm text-slate-400">
                            {event.time}
                          </div>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClasses.split(' ').slice(2).join(' ')}`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Description */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">{event.location}</span>
                      </div>
                    )}
                    
                    {event.visibility && (
                      <div className="text-sm">
                        <span className="text-slate-400">Visibility:</span>
                        <span className="text-slate-300 ml-1">{event.visibility}</span>
                      </div>
                    )}
                    
                    {event.equipment && (
                      <div className="text-sm">
                        <span className="text-slate-400">Equipment:</span>
                        <span className="text-slate-300 ml-1">{event.equipment}</span>
                      </div>
                    )}
                    
                    {event.duration && (
                      <div className="text-sm">
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-slate-300 ml-1">{event.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* NASA Insight */}
                  {event.fact && (
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-400 mb-1">NASA Insight</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {event.fact}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-600/30 text-sm font-medium transition-all duration-200 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (event.link) {
                          window.open(event.link, '_blank');
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Learn More
                    </button>
                    
                    <div className="text-xs text-slate-500">
                      Event {index + 1} of {astronomicalEvents2025.length}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -right-2 -top-2">
                      <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Footer */}
        <div className="text-center mt-12 pb-8">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">End of 2025 Timeline</span>
          </div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="absolute right-4 top-4 bottom-4 w-1 bg-slate-700/30 rounded-full overflow-hidden">
        <div 
          className="w-full bg-gradient-to-b from-blue-400 to-purple-400 rounded-full transition-all duration-300"
          style={{
            height: `${Math.min(100, (scrollPosition / (timelineRef.current?.scrollHeight || 1)) * 100)}%`
          }}
        />
      </div>
    </div>
  );
};