"use client";

interface AgentNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NODES = [
  {
    id: "descriptor",
    name: "Descriptor Tool",
    icon: "👁️",
    desc: "Multimodal visual feature extraction & garment classification",
    tech: "Gemini Vision + CLIP",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300",
  },
  {
    id: "vton",
    name: "VTON Tool",
    icon: "📸",
    desc: "Generative Virtual Try-On synthesis on user portrait",
    tech: "Gemini 3 Pro Image",
    color: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/40 text-fuchsia-300",
  },
  {
    id: "retrieval",
    name: "Retrieval Tool [wardrobe]",
    icon: "🧥",
    desc: "Cosine similarity search across indexed wardrobe vectors",
    tech: "Qdrant + Fashion-CLIP 512d",
    color: "from-rose-500/20 to-red-500/10 border-rose-500/50 text-rose-300",
    badge: "Active DB (23 Items)",
  },
  {
    id: "recommender",
    name: "Recommender Tool",
    icon: "✨",
    desc: "Haute-couture outfit combination & harmony analysis",
    tech: "Gemini 3.1 Flash",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300",
  },
  {
    id: "search",
    name: "Internet Search Tool",
    icon: "🌐",
    desc: "Real-time web discovery for trending fashion & luxury items",
    tech: "DuckDuckGo API",
    color: "from-sky-500/20 to-blue-500/10 border-sky-500/40 text-sky-300",
  },
];

export default function AgentNetworkModal({
  isOpen,
  onClose,
}: AgentNetworkModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🕸️</span>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                Multi-Agent Architecture & Tool Network
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Autonomous LangGraph orchestrator directing 5 specialized fashion tool spokes
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            ✕
          </button>
        </div>

        {/* Interactive Network Diagram */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-6">
          {/* Central Hub Card */}
          <div className="mx-auto max-w-md p-5 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 via-[#181d2a] to-[#0d1017] border-2 border-[#d4af37]/60 shadow-xl text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37] text-black tracking-wider uppercase shadow">
              Central Orchestrator
            </div>
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-lg font-serif font-bold text-[#fcebc2]">
              Stylist Agent (LangGraph Hub)
            </h4>
            <p className="text-xs text-gray-300 mt-1">
              Maintains conversation state, analyzes user intention, routes to specialist tools, and synthesizes the final bespoke styling recommendation.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-gray-400">
              <span>Model: Gemini 3.1 Flash</span>
              <span>•</span>
              <span className="text-emerald-400">● Live</span>
            </div>
          </div>

          {/* Connected Spokes Grid */}
          <div>
            <h5 className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-3">
              Specialist Spoke Tools (Bidirectional Protocol)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {NODES.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-2xl border bg-gradient-to-br transition-all hover:scale-[1.01] ${node.color}`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{node.icon}</span>
                      <h5 className="text-sm font-bold text-white">{node.name}</h5>
                    </div>
                    {node.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/30 text-rose-200 border border-rose-500/50">
                        {node.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mb-2 leading-relaxed">
                    {node.desc}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-400">
                    <span>Engine: {node.tech}</span>
                    <span className="text-emerald-400 font-medium">Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
          <span>Real-time Multi-Agent Loop Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gold-gradient text-black font-semibold text-xs hover:brightness-110"
          >
            Back to Stylist
          </button>
        </div>
      </div>
    </div>
  );
}
