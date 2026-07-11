import React from "react";
import { Compass, Bookmark, Sparkles } from "lucide-react";

interface CompassHeaderProps {
  savedCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasMap: boolean;
  onReset: () => void;
}

export default function CompassHeader({
  savedCount,
  activeTab,
  setActiveTab,
  hasMap,
  onReset,
}: CompassHeaderProps) {
  return (
    <header className="border-b border-teal-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          id="header-logo-container"
        >
          <div className="p-2 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl group-hover:from-teal-100 group-hover:to-emerald-100 transition-colors border border-teal-100">
            <Compass className="h-6 w-6 text-teal-600 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-gray-900 tracking-tight flex items-center gap-1.5">
              Passion Compass
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            </h1>
            <p className="text-[10px] font-mono text-teal-600 tracking-widest uppercase">
              Knowledge Navigator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          {hasMap && (
            <nav className="flex items-center gap-1 bg-teal-50/50 p-1 rounded-xl border border-teal-50">
              <button
                onClick={() => setActiveTab("map")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "map"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                }`}
                id="tab-map-btn"
              >
                Explorer Map
              </button>
              <button
                onClick={() => setActiveTab("connections")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "connections"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                }`}
                id="tab-connections-btn"
              >
                Surprising Overlaps
              </button>
            </nav>
          )}

          <button
            onClick={() => setActiveTab("playbook")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all border ${
              activeTab === "playbook"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-teal-200 hover:bg-teal-50/30"
            }`}
            id="tab-playbook-btn"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Playbook</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center h-5 min-w-5 px-1.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
