import React, { useState, useEffect } from "react";
import { Compass, ArrowRight, Sparkles, Map, Search, Flame } from "lucide-react";

interface CompassHomeProps {
  onSearch: (passion: string) => void;
  loading: boolean;
}

const PRESETS = [
  {
    name: "Acoustic Ecology",
    tagline: "Soundscapes & Nature Conservation",
    description: "Listen to the voice of the biosphere. Explore how environmental sound shapes ecology and science.",
    color: "from-teal-500/10 to-emerald-500/10 border-teal-100 text-teal-700",
  },
  {
    name: "Generative Art",
    tagline: "Code, Geometry & Creativity",
    description: "Write algorithms that grow, blossom, and paint. Uncover the magic of letting software co-create with you.",
    color: "from-amber-500/10 to-orange-500/10 border-amber-100 text-amber-700",
  },
  {
    name: "Kintsugi Art",
    tagline: "Japanese Ceramics & Wabi-Sabi",
    description: "Mend shattered pottery with liquid gold. Learn the profound philosophy of embracing flaws as beautiful histories.",
    color: "from-rose-500/10 to-purple-500/10 border-rose-100 text-rose-700",
  },
  {
    name: "Sourdough Fermentation",
    tagline: "Microbiology, Baking & Patience",
    description: "Nurture wild yeast colonies. Harness biochemistry, temperature, and time to craft the ultimate crispy crust.",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-100 text-emerald-700",
  },
  {
    name: "Competitive Lockpicking",
    tagline: "Mechanical Puzzles & Security",
    description: "Decode the secret mechanisms hidden inside solid brass. Develop a blind hyper-focus on minute tactile feedback.",
    color: "from-cyan-500/10 to-blue-500/10 border-cyan-100 text-cyan-700",
  }
];

const LOADING_MESSAGES = [
  "Awakening the Compass...",
  "Scanning the landscape for hidden pathways...",
  "Forging surprising links between distant disciplines...",
  "Assembling practical starter toolkits...",
  "Drafting curated crossover projects just for you...",
  "Aligning the compass coordinates to your curiosity..."
];

export default function CompassHome({ onSearch, loading }: CompassHomeProps) {
  const [input, setInput] = useState("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSearch(input);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[70vh]" id="loading-container">
        <div className="relative mb-8">
          {/* Glowing Compass Halo */}
          <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-xl animate-compass-pulse"></div>
          
          <div className="relative w-36 h-36 bg-white border-2 border-teal-100 rounded-full flex items-center justify-center shadow-lg">
            {/* Spinning Compass Card */}
            <div className="absolute inset-2 border border-dashed border-teal-200 rounded-full animate-spin-slow"></div>
            
            {/* Navigational markings */}
            <span className="absolute top-2 text-[10px] font-bold text-teal-600">N</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-teal-600">S</span>
            <span className="absolute left-2 text-[10px] font-bold text-teal-600">W</span>
            <span className="absolute right-2 text-[10px] font-bold text-teal-600">E</span>
            
            {/* Main Spinner needle */}
            <div className="relative w-24 h-24 flex items-center justify-center animate-spin">
              <div className="w-1.5 h-12 bg-gradient-to-t from-transparent to-teal-600 rounded-full absolute origin-bottom bottom-12"></div>
              <div className="w-1.5 h-12 bg-gradient-to-b from-transparent to-amber-500 rounded-full absolute origin-top top-12"></div>
              <div className="w-4 h-4 bg-teal-700 rounded-full border-2 border-white shadow-sm z-10"></div>
            </div>
          </div>
        </div>

        <h2 className="font-display font-bold text-2xl text-gray-900 tracking-tight text-center max-w-md animate-pulse">
          Mapping Your Passion
        </h2>
        
        {/* Dynamic Encouraging Loading Phrase */}
        <p className="mt-3 text-sm text-gray-500 text-center font-medium max-w-sm h-6 transition-all duration-500">
          {LOADING_MESSAGES[loadingMsgIdx]}
        </p>

        <div className="mt-8 flex gap-2 items-center justify-center bg-teal-50 px-4 py-2 rounded-full border border-teal-100/50">
          <Sparkles className="h-4 w-4 text-amber-500 animate-bounce" />
          <span className="text-xs text-teal-800 font-medium">Passion Compass: Where curiosity meets direction.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8" id="home-container">
      {/* Title / Slogan */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-full border border-teal-100/50 mb-4 animate-float">
          <Compass className="h-4 w-4 text-teal-600 animate-spin-slow" />
          <span className="text-xs font-semibold text-teal-800 tracking-wide">Your expert knowledge mapper and guide</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-gray-900 tracking-tight leading-none mb-4">
          Chart the Course of <br/>
          <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent">
            Your Infinite Curiosities
          </span>
        </h2>
        <p className="max-w-xl mx-auto text-base text-gray-500 font-medium mt-2 leading-relaxed">
          Input any passion, hobby, or abstract interest. Passion Compass will generate a structured, professional knowledge map highlighting hidden links, step-by-step masterclasses, and exact entry tools.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-16 relative max-w-2xl mx-auto" id="search-form">
        <div className="relative rounded-2xl shadow-md border border-teal-100/80 bg-white p-2 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
          <div className="pl-3 text-gray-400 group-focus-within:text-teal-600 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type anything... (e.g., Acoustic Ecology, Medieval Blacksmithing, Coffee Brewing)"
            className="w-full py-3 px-1 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none"
            id="passion-input-field"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            id="submit-passion-btn"
          >
            <span>Chart Path</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Preset Inspirations */}
      <div>
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest text-center mb-6 flex items-center justify-center gap-2">
          <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
          <span>Need Inspiration? Choose a Coordinates Preset</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="preset-cards-grid">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onSearch(preset.name)}
              className={`p-5 rounded-2xl border text-left bg-gradient-to-br transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between h-full group ${preset.color}`}
              id={`preset-${preset.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display font-bold text-lg text-gray-900 group-hover:text-teal-700 transition-colors">
                    {preset.name}
                  </h4>
                  <Sparkles className="h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] font-mono tracking-wider text-teal-800 uppercase mb-2 font-semibold">
                  {preset.tagline}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {preset.description}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-teal-700 self-end opacity-60 group-hover:opacity-100 transition-opacity">
                <span>Map this passion</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
