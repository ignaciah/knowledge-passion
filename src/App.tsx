import React, { useState, useEffect } from "react";
import CompassHeader from "./components/CompassHeader";
import CompassHome from "./components/CompassHome";
import MapExplorer from "./components/MapExplorer";
import UnexpectedOverlaps from "./components/UnexpectedOverlaps";
import Playbook from "./components/Playbook";
import MasterclassModal from "./components/MasterclassModal";
import { PassionMap, SavedItem, DeepenResponse } from "./types";
import { History, Compass, ArrowRight, AlertCircle, X, Sparkles, BookOpen } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("map");
  const [mapData, setMapData] = useState<PassionMap | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Deepening states
  const [deepeningSubArea, setDeepeningSubArea] = useState<string | null>(null);
  const [masterclassData, setMasterclassData] = useState<DeepenResponse | null>(null);

  // Persistent States
  const [history, setHistory] = useState<string[]>([]);
  const [savedPlaybook, setSavedPlaybook] = useState<SavedItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("compass_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const savedLedger = localStorage.getItem("compass_playbook");
    if (savedLedger) {
      try {
        setSavedPlaybook(JSON.parse(savedLedger));
      } catch (e) {
        console.error("Failed to parse playbook", e);
      }
    }

    // Try loading last map data if exists
    const lastMap = localStorage.getItem("compass_last_map");
    if (lastMap) {
      try {
        const parsed = JSON.parse(lastMap);
        setMapData(parsed);
        setActiveTab("map");
      } catch (e) {
        console.error("Failed to parse last map", e);
      }
    }
  }, []);

  // Sync saved playbook to localStorage
  const syncPlaybook = (newPlaybook: SavedItem[]) => {
    setSavedPlaybook(newPlaybook);
    localStorage.setItem("compass_playbook", JSON.stringify(newPlaybook));
  };

  // Generate passion map
  const handleSearch = async (passion: string) => {
    if (!passion.trim()) return;
    setLoading(true);
    setError(null);
    setMapData(null);

    try {
      const response = await fetch("/api/generate-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passion: passion.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate passion map.");
      }

      setMapData(data);
      setActiveTab("map");
      localStorage.setItem("compass_last_map", JSON.stringify(data));

      // Update history
      const updatedHistory = [
        passion.trim(),
        ...history.filter((h) => h.toLowerCase() !== passion.trim().toLowerCase())
      ].slice(0, 10); // Keep max 10
      setHistory(updatedHistory);
      localStorage.setItem("compass_history", JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  // Deepen node to get Masterclass
  const handleDeepenNode = async (parentArea: string, subArea: string) => {
    if (!mapData) return;
    setDeepeningSubArea(subArea);
    setError(null);

    try {
      const response = await fetch("/api/deepen-node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passion: mapData.passion,
          parentArea,
          subArea,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate masterclass.");
      }

      setMasterclassData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate Masterclass. Please try again.");
    } finally {
      setDeepeningSubArea(null);
    }
  };

  // Saved Playbook Handlers
  const handleSaveItem = (item: Omit<SavedItem, "id" | "completed">) => {
    const newItem: SavedItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
    };
    const updated = [newItem, ...savedPlaybook];
    syncPlaybook(updated);
  };

  const handleRemoveItem = (title: string) => {
    const updated = savedPlaybook.filter((item) => item.title !== title);
    syncPlaybook(updated);
  };

  const handleRemoveItemById = (id: string) => {
    const updated = savedPlaybook.filter((item) => item.id !== id);
    syncPlaybook(updated);
  };

  const handleToggleComplete = (id: string) => {
    const updated = savedPlaybook.map((item) => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    syncPlaybook(updated);
  };

  const handleClearPlaybook = () => {
    if (confirm("Are you sure you want to clear all saved items from your Playbook ledger?")) {
      syncPlaybook([]);
    }
  };

  const handleReset = () => {
    setMapData(null);
    setError(null);
    localStorage.removeItem("compass_last_map");
    setActiveTab("map");
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Clear your search coordinates history?")) {
      setHistory([]);
      localStorage.removeItem("compass_history");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans antialiased selection:bg-teal-100 selection:text-teal-900" id="app-root">
      
      {/* Header */}
      <CompassHeader 
        savedCount={savedPlaybook.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasMap={mapData !== null}
        onReset={handleReset}
      />

      {/* Main Page Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 relative shadow-sm animate-in fade-in" id="error-alert">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="grow">
              <h4 className="font-display font-bold text-sm text-gray-900">Navigation Signal Error</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-rose-100/50 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Dashboard Shell with Left History Sidebar on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Workspace content */}
          <div className={`${mapData === null ? "lg:col-span-12" : "lg:col-span-10 lg:col-start-2"} space-y-8`}>
            
            {/* 1. Home / Input dashboard when no map is active */}
            {mapData === null ? (
              <div className="space-y-12">
                <CompassHome onSearch={handleSearch} loading={loading} />

                {/* Search History Tray on Home Screen */}
                {history.length > 0 && !loading && (
                  <div className="max-w-2xl mx-auto border border-teal-50 bg-white p-5 rounded-2xl shadow-sm" id="history-box">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-mono font-bold text-teal-800 uppercase tracking-widest flex items-center gap-1.5">
                        <History className="h-4 w-4 text-teal-600" />
                        <span>Previous Map Coordinates</span>
                      </h4>
                      <button 
                        onClick={handleClearHistory}
                        className="text-[10px] font-mono font-bold text-rose-500 hover:text-rose-700 uppercase"
                        id="clear-history-btn"
                      >
                        Clear coordinates
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {history.map((h, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearch(h)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 text-xs font-medium text-gray-700 rounded-xl transition-all cursor-pointer group"
                        >
                          <span>{h}</span>
                          <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 2. Map loaded, show relevant Tab panels */
              <div className="animate-in fade-in duration-300">
                {activeTab === "map" && (
                  <MapExplorer
                    mapData={mapData}
                    savedPlaybook={savedPlaybook}
                    onSaveItem={handleSaveItem}
                    onRemoveItem={handleRemoveItem}
                    onDeepenNode={handleDeepenNode}
                    deepeningSubArea={deepeningSubArea}
                  />
                )}

                {activeTab === "connections" && (
                  <UnexpectedOverlaps 
                    connections={mapData.unexpectedConnections} 
                    passion={mapData.passion}
                  />
                )}

                {activeTab === "playbook" && (
                  <Playbook
                    items={savedPlaybook}
                    onToggleComplete={handleToggleComplete}
                    onRemoveItemById={handleRemoveItemById}
                    onClearPlaybook={handleClearPlaybook}
                  />
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Global Floating Return to Map CTA */}
        {mapData !== null && activeTab !== "map" && (
          <div className="fixed bottom-6 right-6 z-30">
            <button
              onClick={() => setActiveTab("map")}
              className="flex items-center gap-2 px-4.5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              id="return-map-floating-btn"
            >
              <Compass className="h-4 w-4 animate-spin-slow" />
              <span>Back to {mapData.passion} Map</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-teal-50 bg-white/50 py-6 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-teal-800">Passion Compass</span>
            <span>&bull; Google AI Studio</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Discover your coordinate paths today</span>
          </p>
        </div>
      </footer>

      {/* Masterclass Syllabus Drawer Modal */}
      {masterclassData && (
        <MasterclassModal
          data={masterclassData}
          passion={mapData ? mapData.passion : ""}
          onClose={() => setMasterclassData(null)}
          savedPlaybook={savedPlaybook}
          onSaveItem={handleSaveItem}
          onRemoveItem={handleRemoveItem}
        />
      )}

    </div>
  );
}
