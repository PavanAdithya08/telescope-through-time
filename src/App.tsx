import React, { useState, useEffect, useRef } from 'react';
import { TelescopeTimeline } from './components/TelescopeTimeline';
import { DiscoveryPanel } from './components/DiscoveryPanel';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { useGalaxyInteraction } from './hooks/useGalaxyInteraction';
import { FilterType } from './types/astronomy';
import { TimelineEvent } from './types/timeline';
import { Satellite, Wifi, WifiOff, Menu, X } from 'lucide-react';

function App() {
  const telescopeContainerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'loading'>('connected');
  const [isDiscoveryPanelOpen, setIsDiscoveryPanelOpen] = useState(false);

  const {
    coordinates,
    setZoom,
    position
  } = useGalaxyInteraction(containerDimensions.width, containerDimensions.height);

  // Update container dimensions and regenerate stars when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (telescopeContainerRef.current) {
        const rect = telescopeContainerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (telescopeContainerRef.current) {
      resizeObserver.observe(telescopeContainerRef.current);
    }

    // Initial measurement
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Close discovery panel when clicking outside on mobile
  const handleOutsideClick = () => {
    if (window.innerWidth < 768) setIsDiscoveryPanelOpen(false);
  };

  const handleEventSelect = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="h-screen bg-black flex overflow-hidden relative">
      {/* Discovery Panel */}
      <DiscoveryPanel
        filter={filter}
        onFilterChange={setFilter}
        zoom={position.zoom}
        onZoomChange={setZoom}
        coordinates={coordinates}
        isOpen={isDiscoveryPanelOpen}
        onToggle={() => setIsDiscoveryPanelOpen(!isDiscoveryPanelOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 relative bg-black">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsDiscoveryPanelOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:bg-slate-800/90 transition-all duration-300"
          title="Open Controls"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Telescope Eyepiece Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          {/* Calculate responsive telescope dimensions */}
          {(() => {
            const centerX = containerDimensions.width / 2;
            const centerY = containerDimensions.height / 2;
            const eyepieceRadius = Math.min(containerDimensions.width, containerDimensions.height) * 0.35;
            const lensRadius = eyepieceRadius * 0.9;
            const viewRadius = eyepieceRadius * 0.75;
            
            return (
              <>
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
                
                {/* Secondary rim */}
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
                
                {/* Outer lens element */}
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

                {/* Crosshairs overlay */}
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

                {/* Vignetting effect */}
                <div 
                  className="absolute pointer-events-none"
                  style={{
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
              </>
            );
          })()}
        </div>

        {/* Top Bar */}
        <div className="absolute top-4 left-4 md:left-80 z-10 ml-16 md:ml-4">
          <div className="bg-black/90 backdrop-blur-sm border border-slate-600/50 rounded-lg px-3 md:px-4 py-2 md:py-3">
            <div className="flex items-center gap-3">
              <Satellite className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">
                  Telescope Through Time
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {apiStatus === 'connected' && (
                    <>
                      <Wifi className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-400" />
                      <span className="text-xs text-green-400">Timeline Active</span>
                    </>
                  )}
                  {apiStatus === 'disconnected' && (
                    <>
                      <WifiOff className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-400" />
                      <span className="text-xs text-red-400">Timeline Offline</span>
                    </>
                  )}
                  {apiStatus === 'loading' && (
                    <>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-blue-400">Loading...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Telescope Timeline View */}
        <div 
          ref={telescopeContainerRef}
          className="w-full h-full"
          style={{
            clipPath: `circle(${Math.min(containerDimensions.width, containerDimensions.height) * 0.75 * 0.75}px at center)`,
          }}
        >
          <TelescopeTimeline
            onEventSelect={handleEventSelect}
            selectedEvent={selectedEvent}
          />
        </div>

        {/* Instructions */}
        <div className="hidden lg:block absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 max-w-sm z-20">
          <div className="flex items-center gap-2 mb-3">
            <Satellite className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Timeline Navigation</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>📜 Scroll to explore 2025 events</li>
            <li>🎯 Click events for details</li>
            <li>🔍 Use filters to focus</li>
            <li>⭐ Look for rare events</li>
            <li>🌟 Major events highlighted</li>
            <li>🛰️ Real NASA information</li>
          </ul>
        </div>
      </div>

    </div>
  );
}

export default App;