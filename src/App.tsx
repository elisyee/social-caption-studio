import { useState } from "react";
import { 
  INITIAL_CAPTIONS, 
  INITIAL_TOPIC, 
  REDUCE_SHIPPING_COST_TOPIC, 
  REDUCE_SHIPPING_COST_CAPTIONS 
} from "./data/initialCaptions";
import { CaptionSet, PlatformId, GenerationParams, CaptionContent } from "./types";
import { CaptionCard } from "./components/CaptionCard";
import { MalaysianShippingGuideRef } from "./components/MalaysianShippingGuideRef";
import { CustomizerModal } from "./components/CustomizerModal";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  SlidersHorizontal,
  Ship, 
  Coins,
  ArrowRight
} from "lucide-react";

export default function App() {
  const [captions, setCaptions] = useState<CaptionSet>(REDUCE_SHIPPING_COST_CAPTIONS);
  const [currentTopic, setCurrentTopic] = useState<string>(REDUCE_SHIPPING_COST_TOPIC);
  const [selectedTab, setSelectedTab] = useState<"all" | PlatformId>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  const handleUpdateCaption = (platformId: PlatformId, updated: Partial<CaptionContent>) => {
    setCaptions((prev) => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        ...updated,
      },
    }));
    showNotification(`Updated ${platformId} caption`);
  };

  const handleCopyAll = async () => {
    const combined = `TOPIC: ${currentTopic}\n\n` +
      `===============================\n` +
      `1. INSTAGRAM / TIKTOK\n` +
      `(Short, catchy, engaging, with relevant emojis and hashtags)\n` +
      `===============================\n\n` +
      `${captions.instagramTikTok.fullCaption}\n\n` +
      `===============================\n` +
      `2. LINKEDIN\n` +
      `(Professional, thought-leadership angle, business-focused)\n` +
      `===============================\n\n` +
      `${captions.linkedIn.fullCaption}\n\n` +
      `===============================\n` +
      `3. FACEBOOK\n` +
      `(Warm, community-driven, conversational)\n` +
      `===============================\n\n` +
      `${captions.facebook.fullCaption}\n`;

    try {
      await navigator.clipboard.writeText(combined);
      setCopiedAll(true);
      showNotification("All 3 captions copied to clipboard!");
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (err) {
      console.error("Failed to copy all:", err);
    }
  };

  const handleDownloadFile = () => {
    const combined = `TOPIC: ${currentTopic}\n` +
      `GENERATED FOR: Malaysian Importers & Exporters\n` +
      `DATE: ${new Date().toLocaleDateString("en-MY")}\n\n` +
      `-------------------------------------------------------------\n` +
      `1. INSTAGRAM / TIKTOK (Short, Catchy, Engaging + Emojis & Hashtags)\n` +
      `-------------------------------------------------------------\n` +
      `Hook: ${captions.instagramTikTok.hook}\n\n` +
      `Body:\n${captions.instagramTikTok.body}\n\n` +
      `CTA: ${captions.instagramTikTok.callToAction}\n\n` +
      `Hashtags: ${captions.instagramTikTok.hashtags.join(" ")}\n\n` +
      `-------------------------------------------------------------\n` +
      `2. LINKEDIN (Professional, Thought-Leadership Angle, Business-Focused)\n` +
      `-------------------------------------------------------------\n` +
      `Headline: ${captions.linkedIn.headline || ""}\n\n` +
      `Hook: ${captions.linkedIn.hook}\n\n` +
      `Body:\n${captions.linkedIn.body}\n\n` +
      `CTA: ${captions.linkedIn.callToAction}\n\n` +
      `Hashtags: ${captions.linkedIn.hashtags.join(" ")}\n\n` +
      `-------------------------------------------------------------\n` +
      `3. FACEBOOK (Warm, Community-Driven, Conversational)\n` +
      `-------------------------------------------------------------\n` +
      `Hook: ${captions.facebook.hook}\n\n` +
      `Body:\n${captions.facebook.body}\n\n` +
      `CTA: ${captions.facebook.callToAction}\n\n` +
      `Hashtags: ${captions.facebook.hashtags.join(" ")}\n`;

    const blob = new Blob([combined], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Malaysian_Shipping_Captions_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification("Downloaded text file successfully!");
  };

  const handleResetDefaults = () => {
    setCaptions(REDUCE_SHIPPING_COST_CAPTIONS);
    setCurrentTopic(REDUCE_SHIPPING_COST_TOPIC);
    showNotification("Restored Cost Reduction campaign captions.");
  };

  const handleSelectPresetTopic = (preset: "cost" | "general") => {
    if (preset === "cost") {
      setCurrentTopic(REDUCE_SHIPPING_COST_TOPIC);
      setCaptions(REDUCE_SHIPPING_COST_CAPTIONS);
      showNotification("Active topic: How to Reduce Shipping Cost");
    } else {
      setCurrentTopic(INITIAL_TOPIC);
      setCaptions(INITIAL_CAPTIONS);
      showNotification("Active topic: General Shipping Guide for Malaysian Importers & Exporters");
    }
  };

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (data.success && data.captions) {
        setCaptions({
          instagramTikTok: {
            ...INITIAL_CAPTIONS.instagramTikTok,
            ...data.captions.instagramTikTok,
          },
          linkedIn: {
            ...INITIAL_CAPTIONS.linkedIn,
            ...data.captions.linkedIn,
          },
          facebook: {
            ...INITIAL_CAPTIONS.facebook,
            ...data.captions.facebook,
          },
        });
        setCurrentTopic(params.topic);
        showNotification(
          data.source === "gemini"
            ? "Generated fresh captions via Gemini AI!"
            : "Generated tailored captions successfully!"
        );
      }
    } catch (err: any) {
      console.error("Failed to generate:", err);
      showNotification("Failed to generate captions. Check server connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const platforms: { id: PlatformId; label: string; shortLabel: string }[] = [
    { id: "instagramTikTok", label: "1. Instagram / TikTok", shortLabel: "Instagram / TikTok" },
    { id: "linkedIn", label: "2. LinkedIn", shortLabel: "LinkedIn" },
    { id: "facebook", label: "3. Facebook", shortLabel: "Facebook" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans antialiased flex flex-col selection:bg-amber-200">
      {/* Toast notification */}
      {statusNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-neutral-900">
                  Social Caption Studio
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 hidden sm:inline-block">
                  🇲🇾 Malaysian Trade Edition
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 hidden md:block">
                Tailored for Malaysian Importers, Exporters & Supply Chain Marketers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="btn-copy-all"
              onClick={handleCopyAll}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                copiedAll
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              }`}
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Copy All 3 Captions</span>
              <span className="sm:hidden">Copy All</span>
            </button>

            <button
              id="btn-open-customizer"
              onClick={() => setIsModalOpen(true)}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 shadow-2xs flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">AI Customize</span>
              <span className="sm:hidden">AI</span>
            </button>

            <button
              id="btn-download-txt"
              onClick={handleDownloadFile}
              title="Download TXT file"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="btn-reset-defaults"
              onClick={handleResetDefaults}
              title="Reset to initial captions"
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-colors hidden sm:inline-flex"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Topic Strip */}
      <section className="bg-white border-b border-neutral-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                <span>Active Campaign Topic</span>
                <span>•</span>
                <span className="text-neutral-500 font-normal">3 Distinct Formats Generated</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight flex flex-wrap items-center gap-3">
                <span>{currentTopic}</span>
                {currentTopic.toLowerCase().includes("cost") && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-sans">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    Cost Reduction Strategy
                  </span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-3xl">
                Ready-to-publish social media copy engineered for maximum reach, thought leadership, and community engagement across Port Klang, PTP, and ASEAN cross-border corridors.
              </p>

              {/* Quick Campaign Switcher */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Presets:
                </span>
                <button
                  id="preset-btn-cost"
                  onClick={() => handleSelectPresetTopic("cost")}
                  className={`text-xs font-medium px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    currentTopic === REDUCE_SHIPPING_COST_TOPIC
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Coins className="w-3 h-3 text-emerald-400" />
                  <span>How to Reduce Shipping Cost</span>
                </button>
                <button
                  id="preset-btn-general"
                  onClick={() => handleSelectPresetTopic("general")}
                  className={`text-xs font-medium px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    currentTopic === INITIAL_TOPIC
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Ship className="w-3 h-3 text-amber-500" />
                  <span>General Shipping Guide</span>
                </button>
                <button
                  id="preset-btn-custom"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg border border-dashed border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Custom Topic...</span>
                </button>
              </div>
            </div>

            {/* Platform Filter Tabs */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/80 self-start md:self-auto overflow-x-auto max-w-full">
              <button
                id="tab-all"
                onClick={() => setSelectedTab("all")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  selectedTab === "all"
                    ? "bg-white text-neutral-900 shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                All 3 Platforms
              </button>
              {platforms.map((p) => (
                <button
                  key={p.id}
                  id={`tab-${p.id}`}
                  onClick={() => setSelectedTab(p.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    selectedTab === p.id
                      ? "bg-white text-neutral-900 shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {p.shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Malaysian Trade Reference Card */}
        <MalaysianShippingGuideRef
          onInsertAngle={(angleText) => {
            setIsModalOpen(true);
          }}
        />

        {/* Captions Display Grid */}
        <div
          className={`grid gap-6 ${
            selectedTab === "all"
              ? "grid-cols-1 lg:grid-cols-3"
              : "grid-cols-1 max-w-2xl mx-auto"
          }`}
        >
          {(selectedTab === "all" || selectedTab === "instagramTikTok") && (
            <CaptionCard
              id="card-instagram-tiktok"
              platformId="instagramTikTok"
              caption={captions.instagramTikTok}
              onUpdateCaption={handleUpdateCaption}
            />
          )}

          {(selectedTab === "all" || selectedTab === "linkedIn") && (
            <CaptionCard
              id="card-linkedin"
              platformId="linkedIn"
              caption={captions.linkedIn}
              onUpdateCaption={handleUpdateCaption}
            />
          )}

          {(selectedTab === "all" || selectedTab === "facebook") && (
            <CaptionCard
              id="card-facebook"
              platformId="facebook"
              caption={captions.facebook}
              onUpdateCaption={handleUpdateCaption}
            />
          )}
        </div>

        {/* Digital Marketer Pro-Tips Footer Panel */}
        <div className="mt-12 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
            <span>Digital Marketer Playbook: Platform Best Practices for Malaysian Trade</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 leading-relaxed">
            <div className="space-y-1.5">
              <span className="font-bold text-neutral-900 text-sm block">1. Instagram / TikTok Strategy</span>
              <p>
                Lead with pain-point hooks (e.g. "Cargo sangkut kat Port Klang", unexpected demurrage charges). Pair with visual carousels breaking down K1 forms and Incoterms. Drive viewers to comment a keyword (e.g. "GUIDE") to trigger direct messages or link in bio.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-neutral-900 text-sm block">2. LinkedIn Strategy</span>
              <p>
                Adopt a high-credibility, strategic posture. Mention specific regulatory frameworks (JKDM, MITI, Dagang Net, ATIGA/ACFTA) and supply chain financial impacts. Conclude with open-ended inquiries to stimulate executive commentary and networking.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-neutral-900 text-sm block">3. Facebook Strategy</span>
              <p>
                Use colloquial, empathetic Malaysian phrasing (e.g., "Boss", "sangkut", "we've all been there"). Frame practical advice as an actionable checklist for SME owners, and ask readers to share their costliest shipping lessons in the comment thread.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* AI Customizer Modal */}
      <CustomizerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        currentTopic={currentTopic}
      />

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-neutral-200 py-4 px-4 text-center text-xs text-neutral-400">
        <p>
          Social Caption Studio • Shipping Guide for Malaysian Importers & Exporters • Built with React & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
