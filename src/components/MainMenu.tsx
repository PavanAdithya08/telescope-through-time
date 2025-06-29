import React from 'react';
import { Telescope, Star, Satellite, ArrowRight, Sparkles } from 'lucide-react';

interface MainMenuProps {
  onEnterTelescope: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onEnterTelescope }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        {/* Hero Image */}
        <div className="mb-8 relative">
          <div className="w-80 h-64 md:w-96 md:h-72 lg:w-[480px] lg:h-80 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 relative">
            <img
              src="https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg"
              alt="Deep space telescope view showing the Milky Way galaxy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20" />
            
            {/* Telescope overlay effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-white/30 rounded-full relative">
                <div className="absolute inset-4 border border-white/20 rounded-full" />
                <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-white/20 transform -translate-x-0.5" />
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/20 transform -translate-y-0.5" />
                <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-red-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 p-3 bg-blue-600/20 border border-blue-400/30 rounded-full backdrop-blur-sm">
            <Satellite className="w-6 h-6 text-blue-400" />
          </div>
          <div className="absolute -bottom-4 -left-4 p-3 bg-purple-600/20 border border-purple-400/30 rounded-full backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Telescope className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Telescope Through Time
            </h1>
            <Star className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
          </div>
          
          <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed">
            Journey through the cosmos with our interactive astronomical calendar. 
            Discover real NASA events for every day of 2025 through a virtual telescope interface.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Real NASA Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>365 Daily Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Interactive Galaxy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span>Space Missions</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onEnterTelescope}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white text-lg font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 border border-blue-400/30"
        >
          <div className="flex items-center gap-3">
            <Telescope className="w-6 h-6 group-hover:animate-pulse" />
            <span>Enter Telescope View</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
          
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
        </button>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">365 Stars</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Each star represents a day in 2025, positioned in a beautiful spiral galaxy formation.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-600/20 border border-purple-400/30 rounded-lg">
                <Satellite className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">NASA Integration</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Real astronomical events, space missions, and celestial phenomena from NASA's databases.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-600/20 border border-green-400/30 rounded-lg">
                <Telescope className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Virtual Telescope</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Navigate through space with authentic telescope controls and crosshairs.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Satellite className="w-4 h-4" />
            <span>Powered by NASA Open Data Portal</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2025 Telescope Through Time • Explore the Universe
          </div>
        </div>
      </div>
    </div>
  );
};