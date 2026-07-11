import React, { useState } from "react";
import { 
  ChevronRight, 
  MapPin, 
  Wrench, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  Bookmark, 
  Compass, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Brain,
  Award,
  Check
} from "lucide-react";
import { PassionMap, LandscapeArea, DepthArea, EntryPoint, SavedItem } from "../types";

interface MapExplorerProps {
  mapData: PassionMap;
  savedPlaybook: SavedItem[];
  onSaveItem: (item: Omit<SavedItem, "id" | "completed">) => void;
  onRemoveItem: (title: string) => void;
  onDeepenNode: (parentArea: string, subArea: string) => void;
  deepeningSubArea: string | null;
}

export default function MapExplorer({
  mapData,
  savedPlaybook,
  onSaveItem,
  onRemoveItem,
  onDeepenNode,
  deepeningSubArea,
}: MapExplorerProps) {
  const [selectedArea, setSelectedArea] = useState<LandscapeArea>(mapData.landscape[0]);
  const [selectedSub, setSelectedSub] = useState<DepthArea>(mapData.landscape[0].depthAreas[0]);

  const handleAreaClick = (area: LandscapeArea) => {
    setSelectedArea(area);
    setSelectedSub(area.depthAreas[0]);
  };

  const isSaved = (title: string) => {
    return savedPlaybook.some((item) => item.title === title);
  };

  const handleToggleSave = (entry: EntryPoint, subName: string) => {
    if (isSaved(entry.name)) {
      onRemoveItem(entry.name);
    } else {
      onSaveItem({
        passion: mapData.passion,
        type: entry.type,
        title: entry.name,
        subtitle: subName,
        description: entry.description,
      });
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "intermediate":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "advanced":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="space-y-8" id="map-explorer-container">
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-amber-500/5 rounded-3xl border border-teal-100/50 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="h-5 w-5 text-teal-600 animate-spin-slow" />
              <span className="text-[10px] font-mono tracking-widest text-teal-700 uppercase font-bold">Mapped Coordinates</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl text-gray-900 tracking-tight leading-tight">
              {mapData.passion}
            </h2>
            <p className="text-sm font-medium text-teal-800 font-display mt-1 tracking-wide uppercase italic">
              &ldquo;{mapData.tagline}&rdquo;
            </p>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed font-medium">
              {mapData.intro}
            </p>
          </div>
          <div className="bg-white border border-teal-100 p-5 rounded-2xl md:max-w-xs shrink-0 shadow-sm">
            <h4 className="font-display font-bold text-xs text-teal-800 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-teal-600" />
              <span>Journey Kickstarters</span>
            </h4>
            <ul className="space-y-2.5">
              {mapData.nextSteps.map((step, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-gray-600 font-medium align-top">
                  <span className="flex h-5 w-5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 items-center justify-center font-bold font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (lg:col-span-7) - Interactive Map Nodes */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-teal-600" />
            <span>Interactive Landscape Map</span>
          </h3>

          <div className="bg-white border border-teal-50 rounded-2xl p-5 shadow-sm space-y-6 relative overflow-hidden bg-grid-subtle">
            {/* Landscape Categories (Broad nodes) */}
            <div className="grid grid-cols-2 gap-3" id="landscape-categories-grid">
              {mapData.landscape.map((area) => {
                const isActive = selectedArea.id === area.id;
                return (
                  <button
                    key={area.id}
                    onClick={() => handleAreaClick(area)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative group ${
                      isActive
                        ? "bg-gradient-to-br from-teal-50 to-white border-teal-400 shadow-md ring-1 ring-teal-400/20"
                        : "bg-white border-gray-100 hover:border-teal-200 hover:bg-teal-50/10"
                    }`}
                    id={`area-node-${area.id}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-lg border transition-colors ${
                        isActive ? "bg-teal-600 text-white border-teal-600" : "bg-teal-50 text-teal-700 border-teal-100"
                      }`}>
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-gray-900 group-hover:text-teal-700 transition-colors">
                        {area.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {area.description}
                    </p>
                    {isActive && (
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Connecting Visual SVG Line */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-px bg-dashed bg-teal-200 grow"></div>
              <span className="text-[10px] font-mono text-teal-600/70 uppercase tracking-widest font-semibold px-2">
                Coordinates Branches
              </span>
              <div className="h-px bg-dashed bg-teal-200 grow"></div>
            </div>

            {/* Sub-Topics (Depth nodes under the selected landscape) */}
            <div className="space-y-3" id="depth-nodes-container">
              <h5 className="text-[11px] font-mono text-teal-800 uppercase tracking-widest font-bold">
                Specializations in: {selectedArea.name}
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedArea.depthAreas.map((sub) => {
                  const isSubActive = selectedSub.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-full group ${
                        isSubActive
                          ? "bg-teal-600 text-white border-teal-600 shadow-md scale-[1.02]"
                          : "bg-white border-teal-50/80 hover:border-teal-200"
                      }`}
                      id={`sub-node-${sub.id}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                            isSubActive
                              ? "bg-teal-700 text-white border-teal-800"
                              : getDifficultyColor(sub.difficulty)
                          }`}>
                            {sub.difficulty}
                          </span>
                          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${
                            isSubActive ? "text-teal-200 translate-x-0.5" : "text-gray-300 group-hover:translate-x-0.5"
                          }`} />
                        </div>
                        <h5 className={`font-display font-bold text-xs leading-tight mb-1.5 ${
                          isSubActive ? "text-white" : "text-gray-900"
                        }`}>
                          {sub.name}
                        </h5>
                      </div>
                      <p className={`text-[10px] line-clamp-3 leading-relaxed mt-1 ${
                        isSubActive ? "text-teal-100" : "text-gray-500"
                      }`}>
                        {sub.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-5) - Detail Inspector */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-teal-600" />
            <span>Sub-Topic Deep Explorer</span>
          </h3>

          <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-md relative" id="inspector-pane">
            <div className="flex items-start justify-between gap-3 mb-4 border-b border-gray-100 pb-4">
              <div>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${getDifficultyColor(selectedSub.difficulty)}`}>
                  {selectedSub.difficulty} Level
                </span>
                <h4 className="font-display font-bold text-lg text-gray-900 mt-2 leading-tight">
                  {selectedSub.name}
                </h4>
                <p className="text-[11px] text-teal-600 font-mono tracking-wider mt-0.5 uppercase">
                  Part of {selectedArea.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
              {selectedSub.description}
            </p>

            {/* Practical Entry Points */}
            <div className="space-y-4 mb-8">
              <h5 className="text-[11px] font-mono text-teal-800 uppercase tracking-widest font-bold flex items-center gap-1">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span>Actionable Entry Points</span>
              </h5>

              <div className="space-y-3" id="entry-points-list">
                {selectedSub.entryPoints.map((entry) => {
                  const saved = isSaved(entry.name);
                  return (
                    <div 
                      key={entry.name}
                      className="p-3.5 rounded-xl border border-teal-50/60 bg-gradient-to-r from-teal-50/10 to-white flex items-start gap-3 transition-all hover:shadow-sm"
                    >
                      <div className="mt-0.5 p-2 bg-white border border-teal-100 rounded-lg text-teal-600 shrink-0">
                        {entry.type === "Tool" && <Wrench className="h-4 w-4 text-emerald-600" />}
                        {entry.type === "Project" && <Sparkles className="h-4 w-4 text-amber-500" />}
                        {entry.type === "Resource" && <BookOpen className="h-4 w-4 text-blue-600" />}
                      </div>
                      
                      <div className="grow space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display font-bold text-xs text-gray-900">
                            {entry.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md font-semibold">
                            {entry.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {entry.description}
                        </p>
                        
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleToggleSave(entry, selectedSub.name)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border cursor-pointer ${
                              saved 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-white text-gray-600 border-gray-200 hover:border-teal-200 hover:text-teal-700"
                            }`}
                            id={`save-btn-${entry.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {saved ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Saved to Playbook</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="h-3 w-3" />
                                <span>Save Entry Point</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deepen Masterclass CTA */}
            <div className="border-t border-gray-100 pt-6">
              <button
                onClick={() => onDeepenNode(selectedArea.name, selectedSub.name)}
                disabled={deepeningSubArea !== null}
                className="w-full bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:via-teal-800 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-xl font-semibold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                id="deepen-node-cta-btn"
              >
                {deepeningSubArea === selectedSub.name ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Drafting Custom Masterclass...</span>
                  </>
                ) : (
                  <>
                    <Award className="h-4.5 w-4.5 text-amber-300 animate-pulse" />
                    <span>Generate Custom Masterclass</span>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                Uses expert guidance to construct structured concepts, step-by-step guides, and essential tools.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
