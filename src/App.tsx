import React, { useState, useEffect } from 'react';
import { Galaxy } from './components/Galaxy';
import { DiscoveryPanel } from './components/DiscoveryPanel';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { useGalaxyInteraction } from './hooks/useGalaxyInteraction';
import { generateStarPositions } from './utils/starPositions';
import { astronomyApi } from './services/astronomyApi';
import { Star, FilterType, DayEvents } from './types/astronomy';
import { Satellite, Wifi, WifiOff } from 'lucide-react';

function App() {
  const [stars] = useState<Star[]>(() => generateStarPositions());
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [events, setEvents] = useState<DayEvents | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');

  const {
    position,
    coordinates,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setZoom,
    focusOnPosition
  } = useGalaxyInteraction();

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

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      {/* Discovery Panel */}
      <DiscoveryPanel
        filter={filter}
        onFilterChange={setFilter}
        zoom={position.zoom}
        onZoomChange={setZoom}
        coordinates={coordinates}
      />

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Top Bar */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <Satellite className="w-6 h-6 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Telescope Through Time
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {apiStatus === 'connected' && (
                    <>
                      <Wifi className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">NASA API Connected</span>
                    </>
                  )}
                  {apiStatus === 'disconnected' && (
                    <>
                      <WifiOff className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400">NASA API Offline</span>
                    </>
                  )}
                  {apiStatus === 'loading' && (
                    <>
                      <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
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
            stars={stars}
            position={position}
            selectedStar={selectedStar}
            filter={filter}
            onStarClick={handleStarClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            isDragging={isDragging}
          />
        </div>

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
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 max-w-sm">
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