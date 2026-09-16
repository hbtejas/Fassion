"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ModelPhotoModal from "@/components/ModelPhotoModal";
import WardrobeDrawer from "@/components/WardrobeDrawer";
import AgentNetworkModal from "@/components/AgentNetworkModal";
import { Message, ChatResponse, WardrobeItem } from "@/types";
import { filesToBase64, fileToBase64, sendMessage, getSession } from "@/lib/api";

export default function Home() {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [modelImagePreview, setModelImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Modals & Drawers
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isWardrobeDrawerOpen, setIsWardrobeDrawerOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem("fashion_session_id");

    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadSessionHistory(savedSessionId);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("fashion_session_id", sessionId);
    }
  }, [sessionId]);

  const handleSetModelImage = (file: File | null) => {
    setModelImage(file);
    if (file) {
      setModelImagePreview(URL.createObjectURL(file));
    } else {
      setModelImagePreview(null);
    }
  };

  const handleNewChat = () => {
    localStorage.removeItem("fashion_session_id");
    setSessionId(null);
    setMessages([]);
  };

  const loadSessionHistory = async (sid: string) => {
    setIsLoadingHistory(true);
    try {
      const sessionData = await getSession(sid);
      if (sessionData && sessionData.messages) {
        setMessages(
          sessionData.messages.map((message, index) => ({
            id: `history-${index}-${Date.now()}`,
            role: message.role,
            content: message.content,
            images: message.images || undefined,
            analysis: message.analysis || undefined,
            products: message.products || undefined,
            timestamp: new Date(),
          }))
        );
      } else {
        localStorage.removeItem("fashion_session_id");
        setSessionId(null);
      }
    } catch (error) {
      console.error("Failed to load session", error);
      localStorage.removeItem("fashion_session_id");
      setSessionId(null);
    }
    setIsLoadingHistory(false);
  };

  const handleSendMessage = async (content: string, images: File[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      images:
        images.length > 0
          ? images.map((file, idx) => ({
              image_id: `local-${idx}`,
              url: URL.createObjectURL(file),
              bbox: null,
              type: "user_provided" as const,
            }))
          : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const imageUrls = images.length > 0 ? await filesToBase64(images) : null;
      const modelImageBase64 = modelImage ? await fileToBase64(modelImage) : null;

      const response: ChatResponse = await sendMessage({
        query: content,
        session_id: sessionId,
        images: imageUrls,
        model_image: modelImageBase64,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        images: response.images || undefined,
        analysis: response.analysis || undefined,
        products: response.products || undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an issue connecting with the styling service. Please check your network or try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectWardrobeItem = (item: WardrobeItem) => {
    handleSendMessage(
      `Please retrieve and style an outfit around my ${item.label} (ID: ${item.id}) from my wardrobe.`,
      []
    );
  };

  const handleDirectAnalyze = () => {
    handleSendMessage(
      "Please analyze my skin tone, undertone, and body silhouette from my uploaded photo, and recommend my most flattering color palette and tailoring rules.",
      modelImage ? [modelImage] : []
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-screen flex-col bg-[#07090e] text-[#f1f3f7]">
      {/* Haute Couture Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b12]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-gradient flex items-center justify-center font-serif font-black text-black text-lg shadow-md tracking-wider">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold tracking-wider text-white">
                  ATELIER VOGUE
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#d4af37]/15 text-[#fcebc2] border border-[#d4af37]/30">
                  Haute AI
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Engine Active · RTX 3050 · Qdrant Vector</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Agent Network Modal Button */}
            <button
              onClick={() => setIsNetworkModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold glass-panel hover:bg-white/10 border-white/10 text-[#fcebc2] transition-all shadow-sm"
              title="View Multi-Agent Architecture"
            >
              <span>🕸️</span>
              <span className="hidden md:inline">Agent Architecture</span>
            </button>

            {/* Model Photo Button */}
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
                modelImagePreview
                  ? "bg-[#d4af37]/20 border-[#d4af37] text-[#fcebc2]"
                  : "glass-panel hover:bg-white/10 border-white/10 text-gray-300"
              }`}
            >
              <span>👤</span>
              <span className="hidden sm:inline">
                {modelImagePreview ? "Active Fitting Model ✓" : "Set My Photo"}
              </span>
            </button>

            {/* Wardrobe Drawer Button */}
            <button
              onClick={() => setIsWardrobeDrawerOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold bg-gold-gradient text-black hover:opacity-90 transition-all shadow-md font-medium"
            >
              <span>👗</span>
              <span>Wardrobe Closet</span>
            </button>

            {/* New Session Button */}
            <button
              onClick={handleNewChat}
              className="p-2 rounded-xl glass-panel hover:bg-white/10 border-white/10 text-gray-400 hover:text-white transition-all text-xs"
              title="New Styling Session"
            >
              ↺
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        {isLoadingHistory ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
              <p className="text-xs text-gray-400 font-serif tracking-widest uppercase">
                Restoring Styling Suite...
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          /* Editorial Hero Welcome Canvas */
          <div className="flex h-full flex-col items-center justify-center text-center max-w-2xl mx-auto px-4">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8c6d17] via-[#d4af37] to-[#fcebc2] p-[1px] shadow-2xl shadow-[#d4af37]/20">
                <div className="w-full h-full bg-[#090b12] rounded-2xl flex items-center justify-center font-serif text-3xl font-black text-[#d4af37]">
                  V
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#d4af37]" />
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-wide text-white mb-2">
              Your Personal Haute Couture Stylist
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed mb-6 font-light">
              Autonomous multi-agent intelligence analyzing skin tone, undertones, and silhouettes, retrieving pieces from your local vector closet, and styling buyable looks on Amazon, Flipkart, and Meesho.
            </p>

            {/* Quick-action visual cues */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-8 text-left">
              <div
                onClick={() => setIsWardrobeDrawerOpen(true)}
                className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-[#d4af37]/40 cursor-pointer transition-all group"
              >
                <div className="text-lg mb-1 group-hover:scale-110 transition-transform">🧥</div>
                <div className="text-xs font-semibold text-white mb-0.5">Vector Closet</div>
                <div className="text-[10px] text-gray-400">23 Fashion-CLIP embedded pieces</div>
              </div>

              <div
                onClick={() => setIsPhotoModalOpen(true)}
                className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-[#d4af37]/40 cursor-pointer transition-all group"
              >
                <div className="text-lg mb-1 group-hover:scale-110 transition-transform">✨</div>
                <div className="text-xs font-semibold text-white mb-0.5">Visage & Tone</div>
                <div className="text-[10px] text-gray-400">Flattering palette & silhouette</div>
              </div>

              <div
                onClick={() => handleSendMessage("Find me an emerald green party outfit on Amazon or Meesho suitable for my undertone.", [])}
                className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-[#d4af37]/40 cursor-pointer transition-all group"
              >
                <div className="text-lg mb-1 group-hover:scale-110 transition-transform">🛍️</div>
                <div className="text-xs font-semibold text-white mb-0.5">Online Finds</div>
                <div className="text-[10px] text-gray-400">Amazon · Flipkart · Meesho</div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div className="mx-auto max-w-4xl space-y-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Stylist Thinking Skeleton */}
            {isLoading && (
              <div className="flex justify-start mb-6 animate-in fade-in duration-300">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8c6d17] flex items-center justify-center font-serif font-bold text-black text-xs shadow-md">
                    AV
                  </div>
                  <div className="glass-panel rounded-2xl px-5 py-4 border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#d4af37] animate-ping" />
                      <span className="text-xs font-medium text-gray-300">
                        Atelier Stylist is curating your look...
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Searching vector embeddings & composing silhouettes
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Floating Bottom Command Bar */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      {/* Modals & Drawers */}
      <ModelPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        previewUrl={modelImagePreview}
        onSetFile={handleSetModelImage}
        onAnalyze={handleDirectAnalyze}
      />

      <WardrobeDrawer
        isOpen={isWardrobeDrawerOpen}
        onClose={() => setIsWardrobeDrawerOpen(false)}
        onSelectItem={handleSelectWardrobeItem}
      />

      <AgentNetworkModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  );
}