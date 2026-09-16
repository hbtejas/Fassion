"use client";

import { useState, useRef, ChangeEvent, FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string, images: File[]) => void;
  isLoading: boolean;
  onSelectSuggestion?: (text: string) => void;
}

const SUGGESTIONS = [
  { label: "✨ Skin Tone & Silhouette", prompt: "Analyze my skin tone and body type from my uploaded photo, and recommend flattering colors and tailoring guidelines." },
  { label: "🛍️ Shop Amazon & Flipkart", prompt: "Find a flattering emerald green party dress on Amazon, Flipkart, or Meesho that suits my skin tone and frame." },
  { label: "👗 Meesho Cocktail & Party", prompt: "Search Meesho and Amazon for an elegant cocktail outfit tailored for my silhouette." },
  { label: "🍸 Evening Gala Closet", prompt: "Recommend an elegant evening gala outfit with shoes and a stylish coat from my wardrobe." },
  { label: "💼 Sharp Business", prompt: "Create a sophisticated business outfit pairing tailored trousers with a jacket." },
];

export default function ChatInput({
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (message.trim() || selectedImages.length > 0) {
      onSendMessage(message, selectedImages);
      setMessage("");
      setSelectedImages([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-white/10 bg-[#0a0d14]/90 backdrop-blur-xl p-4 sm:p-5">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Quick Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(s.prompt)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] hover:bg-[#d4af37]/15 border border-white/10 hover:border-[#d4af37]/40 text-gray-300 hover:text-[#fcebc2] transition-all cursor-pointer shadow-sm"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Selected Image Pills */}
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative group/pill">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${index + 1}`}
                  className="h-14 w-14 rounded-lg object-cover border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-end gap-2.5 glass-panel rounded-2xl p-2 sm:p-2.5 shadow-2xl border-white/10 focus-within:border-[#d4af37]/50 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach inspiration or item images"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white transition-all border border-white/5"
            disabled={isLoading}
          >
            📸
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask your stylist (e.g. 'Style an outfit with black shoes from my closet')..."
            className="flex-1 max-h-32 bg-transparent px-2 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none resize-none leading-relaxed"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || (!message.trim() && selectedImages.length === 0)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-black font-bold shadow-md hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "➤"
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-gray-500">
          Powered by Gemini 3.1 & Qdrant Vector Wardrobe · Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-gray-400">Enter</kbd> to consult
        </p>
      </div>
    </div>
  );
}