import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';

interface CalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(2025);
  const [isMinimized, setIsMinimized] = useState(false);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();

  const getDaysArray = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateKey = (day: number) => {
    return `${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isSelectedDate = (day: number) => {
    return selectedDate === formatDateKey(day);
  };

  const isToday = (day: number) => {
    return day === todayDate && currentMonth === todayMonth;
  };

  if (isMinimized) {
    return (
      <div className="fixed top-20 md:top-4 right-4 z-20">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-3 bg-black/90 backdrop-blur-sm border border-slate-600/50 rounded-lg hover:bg-slate-800/90 transition-all duration-300 hover:scale-105 shadow-lg"
          title="Expand Calendar"
        >
          <CalendarIcon className="w-5 h-5 text-blue-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 md:top-4 right-4 z-20 w-80 md:w-72 max-w-[calc(100vw-2rem)] bg-black/90 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 shadow-xl animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Observation Calendar</h3>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 bg-slate-800/70 border border-slate-600/50 rounded hover:bg-slate-700/70 transition-colors"
          title="Minimize Calendar"
        >
          <Minimize2 className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth(prev => (prev - 1 + 12) % 12)}
          className="p-1.5 bg-slate-800/70 border border-slate-600/50 rounded hover:bg-slate-700/70 transition-colors"
        >
          <ChevronLeft className="w-3 h-3 text-white" />
        </button>
        <div className="text-center">
          <h4 className="text-sm font-semibold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h4>
        </div>
        <button
          onClick={() => setCurrentMonth(prev => (prev + 1) % 12)}
          className="p-1.5 bg-slate-800/70 border border-slate-600/50 rounded hover:bg-slate-700/70 transition-colors"
        >
          <ChevronRight className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-400 p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {getDaysArray().map((day, index) => {
          if (day === null) {
            return <div key={index} className="p-1.5" />;
          }

          const isSelected = isSelectedDate(day);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day}
              onClick={() => onDateSelect(formatDateKey(day))}
              className={`p-1.5 text-xs rounded transition-all duration-200 hover:scale-105 md:hover:scale-110
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-400/30' 
                  : isTodayDate
                    ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-600/20 border border-yellow-400/30 rounded-full"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};