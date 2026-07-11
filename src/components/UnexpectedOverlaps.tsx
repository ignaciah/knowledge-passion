import React from "react";
import { Sparkles, ArrowRight, Lightbulb, Compass, Share2 } from "lucide-react";
import { UnexpectedConnection } from "../types";

interface UnexpectedOverlapsProps {
  connections: UnexpectedConnection[];
  passion: string;
}

export default function UnexpectedOverlaps({ connections, passion }: UnexpectedOverlapsProps) {
  return (
    <div className="space-y-8" id="unexpected-overlaps-container">
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 rounded-3xl border border-amber-100/50 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500 animate-float" />
            <span className="text-[10px] font-mono tracking-widest text-amber-700 uppercase font-bold">Overlapping Horizons</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-gray-900 tracking-tight leading-tight">
            Surprising Overlaps for {passion}
          </h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed font-medium">
            True expertise comes from bridging fields that rarely speak to each other. Passion Compass has uncovered these unexpected connections where your interest crosses paths with entirely different disciplines.
          </p>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="overlaps-grid">
        {connections.map((conn, idx) => (
          <div 
            key={idx}
            className="bg-white border border-teal-50/80 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden bg-grid-subtle flex flex-col justify-between group hover:shadow-md transition-all"
            id={`overlap-card-${idx}`}
          >
            <div>
              {/* Card Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
                  Crossover #{idx + 1}
                </span>
                <Compass className="h-4.5 w-4.5 text-amber-400 group-hover:rotate-180 transition-transform duration-700" />
              </div>

              {/* Title / Overlap Name */}
              <h3 className="font-display font-extrabold text-xl text-gray-900 mb-3 group-hover:text-teal-700 transition-colors leading-snug">
                {conn.connectedTo}
              </h3>

              {/* Narrative Story */}
              <p className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                {conn.story}
              </p>
            </div>

            {/* Spark Project Idea (Actionable concept) */}
            <div className="bg-gradient-to-br from-teal-50/40 via-white to-emerald-50/40 border border-teal-100/50 p-5 rounded-xl space-y-2.5 shadow-inner">
              <h4 className="font-display font-bold text-xs text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-amber-500 animate-pulse" />
                <span>Spark Project Idea</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {conn.sparkIdea}
              </p>
              
              <div className="pt-2 flex justify-end">
                <div className="text-[10px] font-mono font-bold text-teal-700 flex items-center gap-1 cursor-pointer hover:underline">
                  <span>Explore this fusion</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
