import React, { useState } from "react";
import { Sparkles, X, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { GenerationParams } from "../types";

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: GenerationParams) => Promise<void>;
  isGenerating: boolean;
  currentTopic: string;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  currentTopic,
}) => {
  const [topic, setTopic] = useState(currentTopic);
  const [angle, setAngle] = useState("");
  const [tone, setTone] = useState("Balanced & High-Converting");
  const [targetAudience, setTargetAudience] = useState("Malaysian SME Importers & Exporters");

  if (!isOpen) return null;

  const quickAngleSuggestions = [
    "How to reduce shipping cost by 20-35% in Malaysia",
    "How to avoid Port Klang demurrage & detention fees",
    "Borang K1 vs K2 customs declaration common mistakes",
    "SST 2025 compliance updates for air & sea freight",
    "FOB vs CIF Incoterms for first-time Malaysian traders",
    "Claiming 0% duty with ATIGA Form D & ACFTA Form E",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate({
      topic,
      angle,
      tone,
      targetAudience,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-neutral-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Regenerate or Tailor Captions with AI
              </h3>
              <p className="text-xs text-neutral-500">
                Powered by Gemini 3.8 Flash with Malaysian trade context
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Core Topic
            </label>
            <input
              id="input-customizer-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Shipping Guide for Malaysian Importers & Exporters"
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Specific Angle or Sub-Focus (Optional)
            </label>
            <input
              id="input-customizer-angle"
              type="text"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="e.g. Demurrage prevention, K1/K2 documentation, Free Trade Agreements..."
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
            {/* Quick Angle Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAngleSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAngle(suggestion)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Desired Tone
              </label>
              <select
                id="select-customizer-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900 font-medium text-neutral-800"
              >
                <option value="Balanced & High-Converting">Balanced & High-Converting (Default)</option>
                <option value="Punchy, Urgent & Cost-Saving">Punchy, Urgent & Cost-Saving</option>
                <option value="Executive Thought-Leadership & Advisory">Executive Thought-Leadership & Advisory</option>
                <option value="Friendly, Relatable & Community-Led">Friendly, Relatable & Community-Led</option>
                <option value="Step-by-Step Educational Tutorial">Step-by-Step Educational Tutorial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Target Audience
              </label>
              <select
                id="select-customizer-audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900 font-medium text-neutral-800"
              >
                <option value="Malaysian SME Importers & Exporters">Malaysian SME Importers & Exporters</option>
                <option value="E-Commerce Sellers (Shopee, Lazada, TikTok Shop MY)">E-Commerce Cross-Border Sellers</option>
                <option value="Supply Chain Directors & Procurement Managers">C-Suite & Supply Chain Directors</option>
                <option value="First-Time Malaysian Business Founders">First-Time Founders & Traders</option>
              </select>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-xl border border-neutral-200"
            >
              Cancel
            </button>
            <button
              id="btn-submit-generate"
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-xl shadow-xs flex items-center space-x-1.5"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Captions...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate New 3 Captions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
