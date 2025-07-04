import React, { useState, useEffect, useRef } from 'react';
import { MainMenu } from './components/MainMenu';
import { Galaxy } from './components/Galaxy';
import { DiscoveryPanel } from './components/DiscoveryPanel';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { useGalaxyInteraction } from './hooks/useGalaxyInteraction';
import { useContainerSize } from './hooks/useContainerSize';
import { generateStarPositions } from './utils/starPositions';
import { astronomyApi } from './services/astronomyApi';
import { Star, FilterType, DayEvents } from './types/astronomy';
import { Satellite, Wifi, WifiOff, Menu, X, ArrowLeft } from 'lucide-react';

function App() {
  const [showMainMenu, setShowMainMenu] = useState(true);
  const { containerRef, width, height } = useContainerSize();
  const [stars, setStars] = useState<Star[]>([]);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [events, setEvents] = useState<DayEvents | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const [isDiscoveryPanelOpen, setIsDiscoveryPanelOpen] = useState(false);
  const [crosshairStar, setCrosshairStar] = useState<Star | null>(null);

  const {
    position,
    coordinates,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setZoom,
    focusOnPosition
  } = useGalaxyInteraction(width, height);

  // Regenerate stars when container dimensions change
  useEffect(() => {
    if (width > 0 && height > 0) {
      setStars(generateStarPositions(width, height));
    }
  }, [width, height]);

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

  const handleCrosshairHover = (star: Star | null) => {
    setCrosshairStar(star);
  };

  const handleEnterTelescope = () => {
    setShowMainMenu(false);
  };

  // Show main menu first
  if (showMainMenu) {
    return <MainMenu onEnterTelescope={handleEnterTelescope} />;
  }

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden relative">
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
      <div className="flex-1 relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsDiscoveryPanelOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:bg-slate-800/90 transition-all duration-300"
          title="Open Controls"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Top Bar */}
        <div className="absolute top-4 left-4 md:left-4 z-10 ml-16 md:ml-0">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 md:px-4 py-2 md:py-3">
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
        <div className="w-full h-full">
          <Galaxy
            ref={containerRef}
            stars={stars}
            containerWidth={width}
            containerHeight={height}
            position={position}
            selectedStar={selectedStar}
            filter={filter}
            onStarClick={handleStarClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            isDragging={isDragging}
            onClick={handleOutsideClick}
            onCrosshairHover={handleCrosshairHover}
          />
        </div>

        {/* Crosshair Info Panel */}
        {crosshairStar && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-3 max-w-sm">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full 
                ${crosshairStar.type === 'Star' ? 'bg-blue-400' : 
                  crosshairStar.type === 'Planet' ? 'bg-orange-400' : 
                  crosshairStar.type === 'Comet' ? 'bg-green-400' : 'bg-purple-400'}
              `} />
              <div>
                <div className="text-white font-medium text-sm">
                  {crosshairStar.type} - {crosshairStar.date}
                </div>
                <div className="text-slate-300 text-xs">
                  {crosshairStar.constellation} • Click for NASA data
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Main Menu Button */}
        <button
          onClick={() => setShowMainMenu(true)}
          className="fixed bottom-4 left-4 z-30 p-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800/90 transition-all duration-300 hover:scale-105 shadow-lg group"
          title="Back to Main Menu"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
            <span className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">Menu</span>
          </div>
        </button>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <div>
                <div className="text-white font-medium">Loading NASA Data</div>
                <div className="text-xs text-slate-400">Fetching real astronomical events...</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="hidden lg:block absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <Satellite className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">NASA-Powered Guide</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>🔭 Drag to explore the galaxy</li>
            <li>⭐ Click blue stars for NASA events</li>
            <li>📅 Use calendar to jump to dates</li>
            <li>🔍 Filter by event types</li>
            <li>🎯 Red dot shows telescope center</li>
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