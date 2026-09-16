"use client";

import React from "react";
import { ECommerceProduct } from "@/types";

interface ProductCardProps {
    product: ECommerceProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const platformLower = product.platform.toLowerCase();

    // Style platform badges
    let platformBadgeClass = "bg-purple-500/15 text-purple-300 border-purple-500/30";
    let platformLabel = product.platform;

    if (platformLower.includes("amazon")) {
        platformBadgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/40";
        platformLabel = "Amazon";
    } else if (platformLower.includes("flipkart")) {
        platformBadgeClass = "bg-blue-500/20 text-blue-300 border-blue-500/40";
        platformLabel = "Flipkart";
    } else if (platformLower.includes("meesho")) {
        platformBadgeClass = "bg-pink-500/20 text-pink-300 border-pink-500/40";
        platformLabel = "Meesho";
    }

    return (
        <div className="group relative flex flex-col justify-between p-4 rounded-xl bg-[#141419]/90 border border-white/10 hover:border-[#d4af37]/60 hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300 backdrop-blur-md">
            <div>
                {/* Header: Platform Badge + Price */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${platformBadgeClass}`}>
                        {platformLabel}
                    </span>
                    {product.price && (
                        <span className="text-xs font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                            {product.price}
                        </span>
                    )}
                </div>

                {/* Product Title */}
                <h4 className="text-sm font-medium text-white/95 line-clamp-2 leading-snug group-hover:text-[#f4d068] transition-colors mb-2">
                    {product.title}
                </h4>

                {/* Optional match reason */}
                {product.reason && (
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-3 italic">
                        &ldquo;{product.reason}&rdquo;
                    </p>
                )}
            </div>

            {/* Action: Buy Button */}
            <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-medium bg-gradient-to-r from-white/10 to-white/5 hover:from-[#d4af37] hover:to-[#c5a059] text-white hover:text-black transition-all duration-200 border border-white/10 hover:border-transparent group-hover:shadow-md"
            >
                <span>View on {platformLabel}</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        </div>
    );
};
