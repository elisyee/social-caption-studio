import React, { useState } from "react";
import { PlatformId, CaptionContent } from "../types";
import { PlatformMockup } from "./PlatformMockup";
import { 
  Copy, 
  Check, 
  Eye, 
  Edit3, 
  Hash, 
  Sparkles, 
  Share2, 
  Layers, 
  Undo2 
} from "lucide-react";

interface CaptionCardProps {
  id: string;
  platformId: PlatformId;
  caption: CaptionContent;
  onUpdateCaption: (platformId: PlatformId, updated: Partial<CaptionContent>) => void;
}

export const CaptionCard: React.FC<CaptionCardProps> = ({
  id,
  platformId,
  caption,
  onUpdateCaption,
}) => {
  const [viewMode, setViewMode] = useState<"editorial" | "mockup">("editorial");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(caption.fullCaption);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSaveEdit = () => {
    onUpdateCaption(platformId, { fullCaption: editedText });
    setIsEditing(false);
  };

  const getPlatformHeaderStyle = () => {
    switch (platformId) {
      case "instagramTikTok":
        return {
          badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
          iconBg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white",
          accentColor: "rose",
        };
      case "linkedIn":
        return {
          badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
          iconBg: "bg-sky-700 text-white",
          accentColor: "sky",
        };
      case "facebook":
        return {
          badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
          iconBg: "bg-blue-600 text-white",
          accentColor: "blue",
        };
    }
  };

  const headerStyle = getPlatformHeaderStyle();
  const currentChars = isEditing ? editedText.length : caption.fullCaption.length;
  const isOverLimit = currentChars > caption.charLimit;

  return (
    <div
      id={id}
      className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden"
    >
      {/* Top Card Header */}
      <div className="p-5 pb-4 border-b border-neutral-100 flex items-start justify-between gap-3 bg-neutral-50/50">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${headerStyle.iconBg} flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
            {platformId === "instagramTikTok" && "IG/TT"}
            {platformId === "linkedIn" && "in"}
            {platformId === "facebook" && "fb"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                {caption.label}
              </h2>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${headerStyle.badgeBg}`}>
                {caption.platformName}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 leading-snug">
              {caption.audienceFocus}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-0.5 shadow-2xs shrink-0">
          <button
            id={`btn-toggle-editorial-${platformId}`}
            onClick={() => setViewMode("editorial")}
            title="Structured editorial breakdown"
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-all ${
              viewMode === "editorial"
                ? "bg-neutral-900 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Breakdown</span>
          </button>
          <button
            id={`btn-toggle-mockup-${platformId}`}
            onClick={() => setViewMode("mockup")}
            title="Live platform mockup preview"
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-all ${
              viewMode === "mockup"
                ? "bg-neutral-900 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mockup</span>
          </button>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {viewMode === "mockup" ? (
          <div className="py-2">
            <PlatformMockup platformId={platformId} caption={caption} />
          </div>
        ) : isEditing ? (
          <div className="space-y-3 flex-1 flex flex-col">
            <label className="text-xs font-semibold text-neutral-700 flex items-center justify-between">
              <span>Edit Full Caption:</span>
              <span className="text-neutral-400 text-[11px]">Markdown & Emojis supported</span>
            </label>
            <textarea
              id={`textarea-edit-${platformId}`}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full flex-1 min-h-[300px] p-3 text-xs md:text-sm font-mono text-neutral-800 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 leading-relaxed resize-y"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                id={`btn-cancel-edit-${platformId}`}
                onClick={() => {
                  setEditedText(caption.fullCaption);
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg border border-neutral-200"
              >
                Cancel
              </button>
              <button
                id={`btn-save-edit-${platformId}`}
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Hook Section */}
            <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-3.5 relative group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold tracking-wide uppercase text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Hook (Scroll-Stopper)
                </span>
                <button
                  id={`btn-copy-hook-${platformId}`}
                  onClick={() => handleCopy(caption.hook, "hook")}
                  className="text-amber-800 hover:text-amber-950 text-[11px] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity font-medium"
                >
                  {copiedType === "hook" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Hook</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs md:text-sm font-semibold text-amber-950 leading-relaxed">
                "{caption.hook}"
              </p>
            </div>

            {/* Body Section */}
            <div className="rounded-xl bg-neutral-50 border border-neutral-200/70 p-3.5">
              <span className="text-[11px] font-bold tracking-wide uppercase text-neutral-500 block mb-2">
                Core Content & Takeaways
              </span>
              <div className="text-xs md:text-sm text-neutral-800 whitespace-pre-line leading-relaxed font-sans">
                {caption.body}
              </div>
            </div>

            {/* Call to action */}
            <div className="rounded-xl bg-sky-50/60 border border-sky-200/60 p-3.5">
              <span className="text-[11px] font-bold tracking-wide uppercase text-sky-800 block mb-1">
                Engagement CTA
              </span>
              <p className="text-xs md:text-sm font-medium text-sky-950 leading-relaxed">
                {caption.callToAction}
              </p>
            </div>

            {/* Hashtags Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold tracking-wide uppercase text-neutral-500 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-neutral-400" />
                  Targeted Hashtags ({caption.hashtags.length})
                </span>
                <button
                  id={`btn-copy-hashtags-${platformId}`}
                  onClick={() => handleCopy(caption.hashtags.join(" "), "hashtags")}
                  className="text-neutral-500 hover:text-neutral-800 text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedType === "hashtags" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Tags Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy All Tags</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {caption.hashtags.map((tag, idx) => (
                  <button
                    key={idx}
                    id={`btn-tag-${platformId}-${idx}`}
                    onClick={() => handleCopy(tag, `tag-${idx}`)}
                    title="Click to copy single hashtag"
                    className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    {copiedType === `tag-${idx}` && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer with Character Counter & Copy All Button */}
        <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className={`font-mono font-medium ${isOverLimit ? "text-rose-600 font-bold" : "text-neutral-700"}`}>
              {currentChars.toLocaleString()}
            </span>
            <span>/</span>
            <span>{caption.charLimit.toLocaleString()} chars</span>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                id={`btn-edit-toggle-${platformId}`}
                onClick={() => {
                  setEditedText(caption.fullCaption);
                  setIsEditing(true);
                }}
                className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Edit caption inline"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            <button
              id={`btn-copy-full-${platformId}`}
              onClick={() => handleCopy(caption.fullCaption, "full")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                copiedType === "full"
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              }`}
            >
              {copiedType === "full" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Complete Caption</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
