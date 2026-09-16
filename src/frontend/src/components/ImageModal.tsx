"use client";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title?: string;
  type?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  type,
}: ImageModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full glass-panel rounded-2xl p-4 overflow-hidden border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#d4af37] uppercase">
              {type || "Fashion Item"}
            </span>
            <h3 className="text-lg font-medium text-white">{title || "Item Preview"}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center bg-black/40 rounded-xl overflow-hidden max-h-[70vh]">
          <img
            src={imageUrl}
            alt={title || "Item"}
            className="max-h-[65vh] w-auto object-contain rounded-lg"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>AI Wardrobe Intelligence</span>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d4af37] hover:underline"
          >
            Open Original ↗
          </a>
        </div>
      </div>
    </div>
  );
}
