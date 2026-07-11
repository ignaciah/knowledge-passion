import React from "react";
import { SavedItem } from "../types";
import { 
  Bookmark, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Wrench, 
  BookOpen, 
  Compass, 
  HelpCircle,
  FileText
} from "lucide-react";

interface PlaybookProps {
  items: SavedItem[];
  onToggleComplete: (id: string) => void;
  onRemoveItemById: (id: string) => void;
  onClearPlaybook: () => void;
}

export default function Playbook({
  items,
  onToggleComplete,
  onRemoveItemById,
  onClearPlaybook,
}: PlaybookProps) {
  const completedCount = items.filter((item) => item.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-8" id="playbook-container">
      {/* Intro / Stats Banner */}
      <div className="bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl border border-emerald-100/50 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="h-5 w-5 text-emerald-600" />
              <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold">Personal Navigation Ledger</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl text-gray-900 tracking-tight leading-tight">
              Your Saved Playbook
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed font-medium">
              This is your curated roadmap for exploration. Check off your accomplishments, review saved project ideas, and research tools as you dive deeper into your passions.
            </p>
          </div>

          {/* Progress Card */}
          {items.length > 0 && (
            <div className="bg-white border border-emerald-100 p-5 rounded-2xl md:min-w-64 shrink-0 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                  Progress Coordinates
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  {completedCount}/{items.length} Completed ({progressPercent}%)
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3 bg-emerald-50 border border-emerald-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={onClearPlaybook}
                  className="text-[10px] font-mono font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase cursor-pointer"
                  id="clear-playbook-btn"
                >
                  Reset Ledger
                </button>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold uppercase font-mono">
                  <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                  <span>Mastery Awaits</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playbook List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-teal-100 rounded-2xl bg-white bg-grid-subtle" id="empty-playbook">
          <Bookmark className="h-12 w-12 text-teal-200 mb-4 animate-float" />
          <h3 className="font-display font-bold text-lg text-gray-900 tracking-tight text-center">
            Your Playbook is Empty
          </h3>
          <p className="mt-2 text-xs text-gray-500 text-center max-w-sm font-medium leading-relaxed">
            As you explore generated Passion Maps, click the <strong className="text-teal-700">Save Entry Point</strong> or save guides inside Masterclasses to build your dynamic action checklist here!
          </p>
        </div>
      ) : (
        <div className="space-y-4" id="playbook-items-list">
          {items.map((item) => (
            <div 
              key={item.id}
              className={`border rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-4 ${
                item.completed 
                  ? "bg-gray-50/50 border-gray-100 opacity-75" 
                  : "bg-white border-teal-50 hover:border-teal-100 hover:shadow-sm"
              }`}
              id={`playbook-item-${item.id}`}
            >
              {/* Checkbox button */}
              <button
                onClick={() => onToggleComplete(item.id)}
                className="mt-1 text-teal-600 hover:text-teal-700 transition-colors shrink-0 cursor-pointer"
                id={`toggle-item-complete-${item.id}`}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 hover:text-teal-600" />
                )}
              </button>

              {/* Item Details */}
              <div className="grow space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-800 rounded-full">
                    {item.passion}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md font-semibold">
                    {item.type}
                  </span>
                  {item.subtitle && (
                    <span className="text-[10px] text-gray-400 font-medium font-mono">
                      • {item.subtitle}
                    </span>
                  )}
                </div>

                <h4 className={`font-display font-bold text-sm sm:text-base ${
                  item.completed ? "text-gray-500 line-through" : "text-gray-900"
                }`}>
                  {item.title}
                </h4>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {item.type === "Resource" && (
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(item.title + " " + item.passion)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                    title="Search Resource on Web"
                  >
                    <BookOpen className="h-4.5 w-4.5" />
                  </a>
                )}
                <button
                  onClick={() => onRemoveItemById(item.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  id={`remove-item-${item.id}`}
                  title="Remove from Playbook"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
