"use client";

import React from "react";
import { SkinToneBodyAnalysis } from "@/types";

interface ProfileAnalysisCardProps {
    analysis: SkinToneBodyAnalysis;
}

// Map color names to approximate hex codes for preview swatches
const COLOR_HEX_MAP: Record<string, string> = {
    emerald: "#097969",
    "emerald green": "#50c878",
    green: "#2e8b57",
    olive: "#808000",
    gold: "#d4af37",
    bronze: "#cd7f32",
    copper: "#b87333",
    mustard: "#e1ad01",
    terracotta: "#e2725b",
    rust: "#b7410e",
    coral: "#ff7f50",
    peach: "#ffe5b4",
    burgundy: "#800020",
    maroon: "#800000",
    navy: "#000080",
    "navy blue": "#001f3f",
    teal: "#008080",
    cobalt: "#0047ab",
    sapphire: "#0f52ba",
    royal: "#4169e1",
    plum: "#dda0dd",
    magenta: "#ff00ff",
    lavender: "#e6e6fa",
    lilac: "#c8a2c8",
    ruby: "#e0115f",
    champagne: "#fad6a5",
    cream: "#fffdd0",
    ivory: "#fffff0",
    taupe: "#483c32",
    charcoal: "#36454f",
    black: "#111111",
    white: "#ffffff",
    yellow: "#ffd700",
    red: "#c41e3a",
    orange: "#ff7518",
    pink: "#ff69b4",
    rose: "#ff007f",
    mint: "#98ff98",
    khaki: "#c3b091",
    camel: "#c19a6b",
};

function getColorSwatch(colorName: string): string {
    const clean = colorName.toLowerCase().trim();
    for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
        if (clean.includes(key)) {
            return hex;
        }
    }
    return "#c5a059";
}

export const ProfileAnalysisCard: React.FC<ProfileAnalysisCardProps> = ({ analysis }) => {
    return (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#1c1815]/90 via-[#131317]/95 to-[#0b0a0f]/95 border border-[#d4af37]/35 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#d4af37]/60">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c5a059] to-[#d4af37] flex items-center justify-center text-black font-bold shadow-md shadow-[#d4af37]/20">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-serif text-base tracking-wide text-white font-medium flex items-center gap-2">
                            Personal Visage & Silhouette Profile
                            <span className="text-[10px] uppercase font-sans tracking-widest px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                                Haute Vision
                            </span>
                        </h4>
                        <p className="text-xs text-white/50">Custom color harmony & tailoring analysis</p>
                    </div>
                </div>
            </div>

            {/* Core Metrics: Skin Tone, Undertone, Body Silhouette */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {/* Skin Tone */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1 font-medium">Skin Tone</span>
                    <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#c5a059] shadow-inner ring-2 ring-white/20" />
                        <span className="text-sm font-medium text-white tracking-wide">{analysis.skin_tone}</span>
                    </div>
                </div>

                {/* Undertone */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1 font-medium">Undertone</span>
                    <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ring-2 ring-white/20 ${
                            analysis.undertone.toLowerCase().includes("warm")
                                ? "bg-amber-500"
                                : analysis.undertone.toLowerCase().includes("cool")
                                ? "bg-cyan-400"
                                : "bg-emerald-400"
                        }`} />
                        <span className="text-sm font-medium text-white tracking-wide">{analysis.undertone}</span>
                    </div>
                </div>

                {/* Body Type */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1 font-medium">Body Silhouette</span>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium text-white tracking-wide">{analysis.body_type}</span>
                    </div>
                </div>
            </div>

            {/* Color Harmonies */}
            <div className="mb-4">
                <span className="block text-[11px] uppercase tracking-wider text-white/50 mb-2 font-medium">
                    Flattering Color Palette (Radiance Enhancers)
                </span>
                <div className="flex flex-wrap gap-2">
                    {analysis.flattering_colors.map((color, idx) => {
                        const swatch = getColorSwatch(color);
                        return (
                            <div
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-white/90 shadow-sm"
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full border border-white/30"
                                    style={{ backgroundColor: swatch }}
                                />
                                <span>{color}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Colors to avoid */}
            {analysis.colors_to_avoid && analysis.colors_to_avoid.length > 0 && (
                <div className="mb-4">
                    <span className="block text-[11px] uppercase tracking-wider text-white/40 mb-2 font-medium">
                        Tones to Avoid or Use as Accents
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {analysis.colors_to_avoid.map((color, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/30 border border-red-500/25 text-[11px] text-red-300/80"
                            >
                                <span className="text-red-400 font-mono">×</span> {color}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Silhouette Tailoring Guidelines */}
            {analysis.silhouette_tips && analysis.silhouette_tips.length > 0 && (
                <div className="pt-3 border-t border-white/[0.08]">
                    <span className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-2 font-medium">
                        Silhouette & Fit Recommendations
                    </span>
                    <ul className="space-y-1.5">
                        {analysis.silhouette_tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-white/80 leading-relaxed">
                                <span className="text-[#d4af37] text-sm leading-none mt-0.5">✦</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
