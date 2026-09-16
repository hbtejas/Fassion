"use client";

import { useState, useEffect } from "react";
import { WardrobeItem } from "@/types";
import { getWardrobe } from "@/lib/api";

interface WardrobeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: WardrobeItem) => void;
}

export default function WardrobeDrawer({
  isOpen,
  onClose,
  onSelectItem,
}: WardrobeDrawerProps) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && items.length === 0) {
      fetchItems();
    }
  }, [isOpen]);

  const fetchItems = async () => {
    setLoading(true);
    const data = await getWardrobe();
    setItems(data.items);
    setLoading(false);
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.label)))];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((i) => i.label === selectedCategory);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#0a0d14] border-l border-white/10 shadow-2xl flex flex-col p-6 overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧥</span>
              <h2 className="text-lg font-semibold text-white">My Smart Closet</h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {items.length} indexed items in Qdrant Vector Engine
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            ✕
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#d4af37] text-black font-semibold shadow-sm"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
              <p className="text-sm">Accessing wardrobe embeddings...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No items in this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-2.5 flex flex-col group relative overflow-hidden"
                >
                  <div className="w-full h-32 rounded-lg bg-black/40 overflow-hidden mb-2">
                    <img
                      src={item.image_url}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-medium text-white truncate">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-400">ID: {item.id}</span>
                  <button
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    className="mt-2 w-full py-1.5 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-black text-[11px] font-semibold text-gray-200 transition-colors"
                  >
                    ✨ Style This
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-white/10 text-center">
          <button
            onClick={fetchItems}
            className="text-xs text-[#d4af37] hover:underline"
          >
            ↻ Sync Closet from Qdrant
          </button>
        </div>
      </div>
    </div>
  );
}
