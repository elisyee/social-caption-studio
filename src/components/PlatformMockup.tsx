import React from "react";
import { PlatformId, CaptionContent } from "../types";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  ThumbsUp, 
  Share2, 
  MoreHorizontal, 
  Globe, 
  CheckCircle2 
} from "lucide-react";

interface PlatformMockupProps {
  platformId: PlatformId;
  caption: CaptionContent;
}

export const PlatformMockup: React.FC<PlatformMockupProps> = ({ platformId, caption }) => {
  if (platformId === "instagramTikTok") {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs max-w-md mx-auto text-neutral-900 font-sans">
        {/* Instagram/TikTok Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-neutral-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[11px] font-bold text-neutral-800">
                MY
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-semibold">my.trade.logistics</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
              </div>
              <p className="text-[10px] text-neutral-400">Port Klang, Malaysia • Sponsored</p>
            </div>
          </div>
          <button className="text-neutral-400 hover:text-neutral-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Graphic Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-blue-900 p-6 text-white text-center relative aspect-4/3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px] text-blue-200 tracking-wider uppercase font-medium">
            <span>🇲🇾 Port Klang • PTP • Penang</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">SWIPE ➡️</span>
          </div>

          <div className="my-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-neutral-950 text-xs font-bold mb-3 shadow-xs">
              MALAYSIA SHIPPING GUIDE
            </div>
            <h3 className="text-lg font-bold leading-snug max-w-xs mx-auto">
              Stop Demurrage Fines: Borang K1 & K2 Customs Secrets
            </h3>
            <p className="text-xs text-blue-200 mt-2">
              For Malaysian Importers & Exporters
            </p>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          </div>
        </div>

        {/* Action icons */}
        <div className="p-3.5 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3.5 text-neutral-800">
              <Heart className="w-5 h-5 cursor-pointer hover:text-rose-500 transition-colors" />
              <MessageCircle className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
              <Send className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
            </div>
            <Bookmark className="w-5 h-5 text-neutral-800 cursor-pointer hover:text-amber-500 transition-colors" />
          </div>

          <p className="text-xs font-bold text-neutral-900 mb-1">1,428 likes</p>

          {/* Caption text */}
          <div className="text-xs text-neutral-800 space-y-2 leading-relaxed">
            <p>
              <span className="font-semibold mr-1.5">my.trade.logistics</span>
              {caption.hook}
            </p>
            <div className="whitespace-pre-line text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
              {caption.body}
            </div>
            <p className="font-medium text-neutral-900">{caption.callToAction}</p>
            <p className="text-blue-700 break-words leading-normal text-[11px]">
              {caption.hashtags.join(" ")}
            </p>
          </div>

          <p className="text-[10px] text-neutral-400 uppercase mt-2.5 tracking-wider">
            2 hours ago • View all 38 comments
          </p>
        </div>
      </div>
    );
  }

  if (platformId === "linkedIn") {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs text-neutral-900 font-sans max-w-xl mx-auto">
        {/* LinkedIn Header */}
        <div className="p-4 flex items-start justify-between border-b border-neutral-100">
          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs">
              TS
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold hover:underline cursor-pointer">
                  Tan Sri Farhan Logistics & Trade Advisory
                </span>
                <span className="text-xs text-neutral-400">• 1st</span>
              </div>
              <p className="text-xs text-neutral-500 leading-tight">
                Senior Trade Compliance Advisor | ASEAN Supply Chain & Customs
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-neutral-400 mt-0.5">
                <span>3h • Edited • </span>
                <Globe className="w-3 h-3 text-neutral-400" />
              </div>
            </div>
          </div>
          <button className="text-neutral-400 hover:text-neutral-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Post content */}
        <div className="p-4 space-y-3.5 text-sm leading-relaxed text-neutral-800">
          <p className="font-semibold text-neutral-900 leading-snug">
            {caption.hook}
          </p>
          <div className="whitespace-pre-line space-y-2 text-neutral-700">
            {caption.body}
          </div>
          <p className="font-medium text-neutral-900 bg-sky-50/70 p-3 rounded-lg border border-sky-100">
            {caption.callToAction}
          </p>
          <p className="text-blue-700 font-medium text-xs break-words">
            {caption.hashtags.join(" ")}
          </p>
        </div>

        {/* Reaction Stats */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
          <div className="flex items-center space-x-1.5">
            <span className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white">👍</span>
              <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white">💡</span>
              <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[9px] text-white">❤️</span>
            </span>
            <span>312 reactions</span>
          </div>
          <span>47 comments • 19 reposts</span>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 border-t border-neutral-100 flex items-center justify-around text-xs font-semibold text-neutral-600">
          <button className="flex items-center space-x-1.5 py-1.5 px-3 rounded hover:bg-neutral-100">
            <ThumbsUp className="w-4 h-4" />
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-1.5 py-1.5 px-3 rounded hover:bg-neutral-100">
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-1.5 py-1.5 px-3 rounded hover:bg-neutral-100">
            <Share2 className="w-4 h-4" />
            <span>Repost</span>
          </button>
          <button className="flex items-center space-x-1.5 py-1.5 px-3 rounded hover:bg-neutral-100">
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    );
  }

  // Facebook Mockup
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs text-neutral-900 font-sans max-w-xl mx-auto">
      {/* Facebook Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            🇲🇾
          </div>
          <div>
            <h4 className="text-sm font-semibold hover:underline cursor-pointer">
              Malaysian Entrepreneurs & SME Exporters Group
            </h4>
            <div className="flex items-center space-x-1 text-xs text-neutral-400">
              <span>Admin • 5 hrs • </span>
              <Globe className="w-3 h-3 text-neutral-400" />
            </div>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Facebook content */}
      <div className="p-4 space-y-3 text-sm leading-relaxed text-neutral-800">
        <p className="font-semibold text-neutral-950 text-base">
          {caption.hook}
        </p>
        <div className="whitespace-pre-line space-y-2 text-neutral-800">
          {caption.body}
        </div>
        <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 font-medium text-amber-950">
          {caption.callToAction}
        </div>
        <p className="text-blue-600 text-xs break-words">
          {caption.hashtags.join(" ")}
        </p>
      </div>

      {/* Reactions & Comments bar */}
      <div className="px-4 py-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center space-x-1.5">
          <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">👍</span>
          <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white">😮</span>
          <span>189</span>
        </div>
        <span>62 comments • 44 shares</span>
      </div>

      <div className="px-4 py-1.5 border-t border-neutral-100 flex items-center justify-around text-xs font-semibold text-neutral-600">
        <button className="flex items-center space-x-1.5 py-1.5 px-4 rounded hover:bg-neutral-100">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1.5 py-1.5 px-4 rounded hover:bg-neutral-100">
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1.5 py-1.5 px-4 rounded hover:bg-neutral-100">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
