import React from "react";
import { 
  X, 
  Award, 
  BookOpen, 
  Sparkles, 
  Search, 
  Bookmark, 
  Check, 
  Clock, 
  Compass,
  ArrowRight,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { DeepenResponse, SavedItem } from "../types";

interface MasterclassModalProps {
  data: DeepenResponse;
  passion: string;
  onClose: () => void;
  savedPlaybook: SavedItem[];
  onSaveItem: (item: Omit<SavedItem, "id" | "completed">) => void;
  onRemoveItem: (title: string) => void;
}

export default function MasterclassModal({
  data,
  passion,
  onClose,
  savedPlaybook,
  onSaveItem,
  onRemoveItem,
}: MasterclassModalProps) {
  const isSaved = (title: string) => {
    return savedPlaybook.some((item) => item.title === title);
  };

  const handleToggleSaveConcept = (conceptName: string, explanation: string) => {
    if (isSaved(conceptName)) {
      onRemoveItem(conceptName);
    } else {
      onSaveItem({
        passion,
        type: "Concept",
        title: conceptName,
        subtitle: data.subAreaName,
        description: explanation,
      });
    }
  };

  const handleToggleSaveGuide = (guideTitle: string, time: string, steps: string[]) => {
    if (isSaved(guideTitle)) {
      onRemoveItem(guideTitle);
    } else {
      onSaveItem({
        passion,
        type: "Guide",
        title: guideTitle,
        subtitle: `${data.subAreaName} (${time})`,
        description: `Step-by-step guide: ${steps.join(" → ")}`,
      });
    }
  };

  const handleToggleSaveResource = (resName: string, type: string, desc: string) => {
    if (isSaved(resName)) {
      onRemoveItem(resName);
    } else {
      onSaveItem({
        passion,
        type: "Resource",
        title: resName,
        subtitle: `${data.subAreaName} (${type})`,
        description: desc,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all" id="masterclass-modal">
      <div className="bg-white rounded-3xl shadow-2xl border border-teal-100 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            id="close-masterclass-btn"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <Award className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-teal-200 uppercase font-bold">
              Custom Masterclass Syllabus
            </span>
          </div>
          
          <h3 className="font-display font-extrabold text-2xl tracking-tight leading-tight">
            {data.subAreaName} Masterclass
          </h3>
          <p className="text-xs text-teal-100 mt-1 font-medium font-mono">
            Focus Discipline of {passion}
          </p>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar grow">
          
          {/* Section 1: Concept Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-teal-800 uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-teal-100 pb-2">
              <Compass className="h-4 w-4 text-teal-600" />
              <span>1. Core Concept Blueprint (Theory)</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="concepts-blueprint-grid">
              {data.conceptBreakdown.map((concept, idx) => {
                const saved = isSaved(concept.concept);
                return (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border border-teal-50/70 bg-gradient-to-b from-teal-50/10 to-white flex flex-col justify-between hover:shadow-sm transition-all"
                    id={`concept-${idx}`}
                  >
                    <div>
                      <h5 className="font-display font-bold text-sm text-gray-900 mb-2 leading-snug">
                        {concept.concept}
                      </h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                        {concept.explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleSaveConcept(concept.concept, concept.explanation)}
                      className={`mt-4 w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded-lg border cursor-pointer transition-all ${
                        saved 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-teal-200 hover:text-teal-700"
                      }`}
                      id={`save-concept-btn-${idx}`}
                    >
                      {saved ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Saved Blueprint</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>Save Concept</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Quick Start Guides */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-teal-800 uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-teal-100 pb-2">
              <TrendingUp className="h-4 w-4 text-teal-600" />
              <span>2. Quick Start Project Blueprints (Practice)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="guides-blueprint-grid">
              {data.quickStartGuides.map((guide, idx) => {
                const saved = isSaved(guide.title);
                return (
                  <div 
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl border border-emerald-100/50 bg-gradient-to-br from-emerald-50/5 via-white to-teal-50/5 flex flex-col justify-between"
                    id={`guide-${idx}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-mono font-bold">
                          <Clock className="h-3 w-3" />
                          <span>{guide.estimatedTime}</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">
                          Project #{idx + 1}
                        </span>
                      </div>

                      <h5 className="font-display font-bold text-base text-gray-900 mb-4 leading-snug">
                        {guide.title}
                      </h5>

                      <ol className="space-y-3 mb-6">
                        {guide.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex gap-2 text-xs text-gray-600 font-medium">
                            <span className="flex h-5 w-5 bg-white border border-teal-200 text-teal-700 font-mono font-bold text-[10px] rounded-full items-center justify-center shrink-0 shadow-sm">
                              {sIdx + 1}
                            </span>
                            <span className="mt-0.5 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <button
                      onClick={() => handleToggleSaveGuide(guide.title, guide.estimatedTime, guide.steps)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold rounded-xl border cursor-pointer transition-all ${
                        saved 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-emerald-600 text-white border-emerald-600 shadow-sm hover:bg-emerald-700"
                      }`}
                      id={`save-guide-btn-${idx}`}
                    >
                      {saved ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Saved Guide to Playbook</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          <span>Save Complete Guide</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Curated Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-teal-800 uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-teal-100 pb-2">
              <BookOpen className="h-4 w-4 text-teal-600" />
              <span>3. Curated Real-World Resource Vault</span>
            </h4>

            <div className="space-y-3" id="resources-vault-list">
              {data.curatedResources.map((res, idx) => {
                const saved = isSaved(res.name);
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-teal-50 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-all"
                    id={`curated-resource-${idx}`}
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-gray-900">
                          {res.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md font-semibold">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {res.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(res.urlQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-teal-100 text-teal-700 bg-teal-50/50 hover:bg-teal-50 rounded-lg text-[10px] font-bold font-mono transition-colors"
                        title="Search for this resource on Google"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>Search Web</span>
                      </a>

                      <button
                        onClick={() => handleToggleSaveResource(res.name, res.type, res.description)}
                        className={`flex items-center gap-1 py-1.5 px-2.5 text-[10px] font-bold rounded-lg border cursor-pointer transition-all ${
                          saved 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-teal-200 hover:text-teal-700"
                        }`}
                        id={`save-resource-btn-${idx}`}
                      >
                        {saved ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-3.5 w-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Encouraging Closing Words */}
          <div className="bg-teal-50 border border-teal-100 p-6 rounded-2xl flex items-start gap-4" id="encouraging-quote-box">
            <div className="p-2.5 bg-white border border-teal-100 rounded-xl text-teal-600 shrink-0">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <h5 className="font-display font-bold text-xs text-teal-800 uppercase tracking-wide">
                Closing Guidance from the Compass
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed italic font-medium">
                &ldquo;{data.encouragingMessage}&rdquo;
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-teal-100 p-4 shrink-0 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            id="close-masterclass-footer-btn"
          >
            Acknowledge Syllabus
          </button>
        </div>

      </div>
    </div>
  );
}
