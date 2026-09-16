export interface ChatRequest {
    query: string;
    session_id: string | null;
    images: string[] | null;
    model_image: string | null;
}

export interface ImageResult {
    image_id: string;
    url: string;
    bbox: [number, number, number, number] | null;
    type: "user_provided" | "retrieved" | "virtual_try_on";
}

export interface SkinToneBodyAnalysis {
    skin_tone: string;
    undertone: string;
    flattering_colors: string[];
    colors_to_avoid: string[];
    body_type: string;
    silhouette_tips: string[];
}

export interface ECommerceProduct {
    title: string;
    platform: "Amazon" | "Flipkart" | "Meesho" | "Store" | string;
    price?: string;
    url: string;
    image_url?: string;
    reason?: string;
}

export interface ChatResponse {
    answer: string;
    session_id: string;
    images: ImageResult[] | null;
    analysis?: SkinToneBodyAnalysis | null;
    products?: ECommerceProduct[] | null;
}

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    images?: ImageResult[];
    analysis?: SkinToneBodyAnalysis | null;
    products?: ECommerceProduct[] | null;
    timestamp: Date;
}

export interface MessageHistory {
    role: "user" | "assistant";
    content: string;
    images: ImageResult[] | null;
    analysis?: SkinToneBodyAnalysis | null;
    products?: ECommerceProduct[] | null;
}

export interface SessionDataResponse {
    session_id: string;
    messages: MessageHistory[];
    has_model_image: boolean;
}

export interface WardrobeItem {
    id: number | string;
    label: string;
    image_url: string;
    bbox: [number, number, number, number] | null;
}