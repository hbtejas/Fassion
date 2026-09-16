"use client";

import { useRef } from "react";

interface ModelPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewUrl: string | null;
  onSetFile: (file: File | null) => void;
  onAnalyze?: () => void;
}

export default function ModelPhotoModal({
  isOpen,
  onClose,
  previewUrl,
  onSetFile,
  onAnalyze,
}: ModelPhotoModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full glass-panel rounded-2xl p-6 border border-[#d4af37]/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-lg font-semibold text-white">Virtual Try-On Fitting Photo</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-5">
          Upload a full-body or portrait photo of yourself. The AI stylist uses this to generate realistic virtual try-on previews with retrieved wardrobe items.
        </p>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onSetFile(file);
          }}
        />

        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-48 h-64 rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-lg">
              <img
                src={previewUrl}
                alt="Your model avatar"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-[#d4af37] backdrop-blur-sm">
                Active Model
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onAnalyze) onAnalyze();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c5a059] hover:from-[#e5c068] hover:to-[#d4af37] text-black font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>✨ Analyze Complexion & Silhouette Now</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  onSetFile(null);
                }}
                className="py-2 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-[#d4af37]/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04]"
          >
            <div className="mx-auto w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-2xl mb-3 text-[#d4af37]">
              📸
            </div>
            <p className="text-sm font-medium text-white mb-1">Upload Your Picture</p>
            <p className="text-xs text-gray-400">PNG, JPG, or WEBP up to 10MB</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-semibold text-sm hover:brightness-110 transition-all shadow-md"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
