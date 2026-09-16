"use client";

import { useState } from "react";
import { Message, ImageResult } from "@/types";
import ImageModal from "./ImageModal";
import { ProfileAnalysisCard } from "./ProfileAnalysisCard";
import { ProductCard } from "./ProductCard";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Lightweight markdown formatter for bold, lists, and line breaks
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bold handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-[#fcebc2]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-gray-200 my-1 leading-relaxed">
            {renderedLine}
          </li>
        );
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="my-1.5 pl-2 border-l-2 border-[#d4af37]/40 text-gray-200 leading-relaxed">
            {renderedLine}
          </div>
        );
      }

      // Headings
      if (line.trim().startsWith("### ")) {
        return (
          <h4 key={idx} className="text-base font-serif font-bold text-[#d4af37] mt-3 mb-1">
            {line.trim().slice(4)}
          </h4>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed text-gray-200">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 group animate-in fade-in duration-300`}>
        <div className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {/* Avatar */}
          <div
            className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shadow-md ${
              isUser
                ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
                : "bg-gradient-to-br from-[#d4af37] to-[#8c6d17] text-black font-serif font-bold tracking-wider"
            }`}
          >
            {isUser ? "YOU" : "AV"}
          </div>

          {/* Bubble */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-xs font-medium text-gray-400">
                {isUser ? "You" : "Atelier Stylist"}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div
              className={`rounded-2xl px-5 py-4 text-sm shadow-lg ${
                isUser
                  ? "bg-gradient-to-br from-indigo-600/90 to-purple-800/90 text-white border border-indigo-500/20"
                  : "glass-panel text-gray-100 border border-white/10"
              }`}
            >
              <div className="break-words">{renderFormattedContent(message.content)}</div>

              {/* Skin Tone and Body Type Profile Analysis Card */}
              {message.analysis && (
                <ProfileAnalysisCard analysis={message.analysis} />
              )}

              {/* Real-time E-Commerce Recommendations (Amazon, Flipkart, Meesho) */}
              {message.products && message.products.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🛍️</span> Curated Online Finds ({message.products.length})
                    </span>
                    <span className="text-[10px] text-white/40">Amazon · Flipkart · Meesho</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {message.products.map((product, pIdx) => (
                      <ProductCard key={pIdx} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Wardrobe / Result Images */}
              {message.images && message.images.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider block mb-2">
                    {isUser ? `Attached Portrait / Reference (${message.images.length})` : `Retrieved Wardrobe Pieces (${message.images.length})`}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {message.images.map((img) => (
                      <div
                        key={img.image_id}
                        onClick={() => setSelectedImage(img)}
                        className="group/img relative rounded-xl overflow-hidden bg-black/40 border border-white/10 cursor-pointer hover:border-[#d4af37]/60 transition-all hover:scale-[1.02] shadow-sm"
                      >
                        <img
                          src={img.url}
                          alt="Wardrobe piece"
                          className="h-28 w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 flex flex-col justify-end p-2">
                          <span className="text-[10px] font-medium text-white truncate">
                            ID: {img.image_id}
                          </span>
                          <span className="text-[9px] text-[#d4af37] uppercase font-semibold">
                            {img.type.replace("_", " ")}
                          </span>
                        </div>
                        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/70 rounded-full p-1 text-white text-[10px]">
                          🔍
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Micro action bar */}
            {!isUser && (
              <div className="flex items-center gap-2 mt-1.5 px-2">
                <button
                  onClick={handleCopy}
                  className="text-[11px] text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || null}
        title={`Wardrobe Item ${selectedImage?.image_id || ""}`}
        type={selectedImage?.type}
      />
    </>
  );
}