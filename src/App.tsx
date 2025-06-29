import React, { useState, useEffect, useRef } from 'react';
import { Galaxy } from './components/Galaxy';
import { DiscoveryPanel } from './components/DiscoveryPanel';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { useGalaxyInteraction } from './hooks/useGalaxyInteraction';
import { generateStarPositions } from './utils/starPositions';
import { astronomyApi } from './services/astronomyApi';
import { Star, FilterType, DayEvents } from './types/astronomy';
import { Satellite, Wifi, WifiOff, Menu, X } from 'lucide-react';

function App() {
  const galaxyContainerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });
  const [stars, setStars] = useState<Star[]>([]);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [centerStar, setCenterStar] = useState<Star | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [events, setEvents] = useState<DayEvents | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [isDiscoveryPanelOpen, setIsDiscoveryPanelOpen] = useState(false);
  const [autoLoadTimeout, setAutoLoadTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    position,
    coordinates,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setZoom,
    focusOnPosition
  } = useGalaxyInteraction(containerDimensions.width, containerDimensions.height);

  // Update container dimensions and regenerate stars when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (galaxyContainerRef.current) {
        const rect = galaxyContainerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (galaxyContainerRef.current) {
      resizeObserver.observe(galaxyContainerRef.current);
    }

    // Initial measurement
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Regenerate stars when container dimensions change
  useEffect(() => {
    if (containerDimensions.width > 0 && containerDimensions.height > 0) {
      setStars(generateStarPositions(containerDimensions.width, containerDimensions.height));
    }
  }, [containerDimensions]);

  // Close discovery panel when clicking outside on mobile
  const handleOutsideClick = () => {
    if (window.innerWidth < 768) setIsDiscoveryPanelOpen(false);
  };

  // Test NASA API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        setApiStatus('loading');
        await astronomyApi.getTodaysEvents();
        setApiStatus('connected');
      } catch (error) {
        console.error('NASA API connection failed:', error);
        setApiStatus('disconnected');
      }
    };

    testConnection();
  }, []);

  // Handle automatic star data loading when crosshairs center on a star
  const handleCenterStarChange = (star: Star | null) => {
    setCenterStar(star);
    
    // Clear previous timeout
    if (autoLoadTimeout) {
      clearTimeout(autoLoadTimeout);
      setAutoLoadTimeout(null);
    }
    
    if (star) {
      // Auto-load data after star is centered for 1 second
      const timeout = setTimeout(() => {
        handleStarClick(star);
      }, 1000);
      setAutoLoadTimeout(timeout);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoLoadTimeout) {
        clearTimeout(autoLoadTimeout);
      }
    };
  }, [autoLoadTimeout]);
  const handleStarClick = async (star: Star) => {
    setSelectedStar(star);
    setSelectedDate(star.date);
    setIsLoading(true);
    
    try {
      const eventData = await astronomyApi.getEventsForDate(star.date);
      setEvents(eventData);
      setApiStatus('connected');
    } catch (error) {
      console.error('Error fetching events:', error);
      setApiStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    
    // Find the star for this date
    const star = stars.find(s => s.date === date);
    if (star) {
      setSelectedStar(star);
      focusOnPosition(star.x, star.y);
      handleStarClick(star);
    }
  };

  const handleCloseModal = () => {
    setEvents(null);
    setSelectedStar(null);
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
        centerStar={centerStar}
      />

      {/* Main Content */}
      <div className="flex-1 relative bg-black">
        {/* Mobile Menu Button - positioned to not interfere with telescope */}
        <button
          onClick={() => setIsDiscoveryPanelOpen(true)}
          className="md:hidden fixed top-4 right-4 z-30 p-3 bg-black/90 backdrop-blur-sm border border-slate-600/50 rounded-lg hover:bg-slate-800/90 transition-all duration-300"
          title="Open Controls"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Top Bar - positioned above telescope */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
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
                      <span className="text-xs text-green-400">NASA API Connected</span>
                    </>
                  )}
                  {apiStatus === 'disconnected' && (
                    <>
                      <WifiOff className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-400" />
                      <span className="text-xs text-red-400">NASA API Offline</span>
                    </>
                  )}
                  {apiStatus === 'loading' && (
                    <>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-blue-400">Connecting...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Component */}
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* Galaxy View */}
        <div className="w-full h-full ml-0 md:ml-64">
          <Galaxy
            ref={galaxyContainerRef}
            stars={stars}
            containerWidth={containerDimensions.width}
            containerHeight={containerDimensions.height}
            position={position}
            selectedStar={selectedStar}
            filter={filter}
            onStarClick={handleStarClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            isDragging={isDragging}
            onClick={handleOutsideClick}
            onCenterStarChange={handleCenterStarChange}
          />
        </div>

        {/* Loading Indicator */}
        {centerStar && !selectedStar && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-900/90 backdrop-blur-sm border border-blue-500/50 rounded-lg px-6 py-3 z-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <div>
                <div className="text-white font-medium">Star Centered</div>
                <div className="text-xs text-blue-300">Loading data for {centerStar.date}...</div>
              </div>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm border border-slate-600/50 rounded-lg px-6 py-3 z-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <div>
                <div className="text-white font-medium">Loading NASA Data</div>
                <div className="text-xs text-slate-400">Fetching real astronomical events...</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions - positioned at bottom right */}
        <div className="hidden lg:block absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <Satellite className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Telescope Operation</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>🔭 Drag to explore starfield</li>
            <li>⭐ Center crosshairs on stars</li>
            <li>🤖 Auto-loads NASA data</li>
            <li>📅 Use calendar to jump to dates</li>
            <li>🔍 Use controls to filter objects</li>
            <li>🎯 Red crosshairs target objects</li>
            <li>🛰️ Real NASA data integration</li>
          </ul>
        </div>
      </div>

      {/* Event Modal */}
      {events && (
        <EventModal
          events={events}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;