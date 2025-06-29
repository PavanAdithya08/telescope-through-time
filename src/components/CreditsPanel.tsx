import React from 'react';
import { User, Code } from 'lucide-react';

export const CreditsPanel: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <Code className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Made by</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 text-green-400" />
          <span className="text-white text-sm font-medium">Pavanadithya Karnan</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 text-blue-400" />
          <span className="text-white text-sm font-medium">Harish S</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 text-center">
          Built with React & NASA APIs
        </div>
      </div>
    </div>
  );
};