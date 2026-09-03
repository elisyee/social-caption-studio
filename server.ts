import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/generate-captions", async (req, res) => {
  const { topic, angle, tone, targetAudience } = req.body;
  const currentTopic = topic || "Shipping Guide for Malaysian Importers & Exporters";

  const ai = getGeminiClient();

  if (!ai) {
    // If no API key is provided, return rich crafted templates tailored to topic
    return res.json({
      success: true,
      topic: currentTopic,
      source: "template",
      captions: getDefaultCaptions(currentTopic, tone),
    });
  }

  try {
    const prompt = `You are a high-level digital marketing strategist specializing in Southeast Asian international trade, supply chain, and B2B eCommerce.
Generate 3 distinct, ready-to-post social media captions for the following topic:
Topic: "${currentTopic}"
${angle ? `Specific angle/focus: "${angle}"` : ""}
${tone ? `Desired tone: "${tone}"` : ""}
${targetAudience ? `Target audience: "${targetAudience}"` : "Target audience: Malaysian SMEs, importers, exporters, logistics coordinators"}

Format requirements:
1. Instagram/TikTok: Short, catchy, high-engagement hook, 3-4 punchy bullet tips or checklist items, well-placed emojis, clear CTA, and 8-12 relevant hashtags including Malaysian-specific logistics and business hashtags (e.g. #MalaysiaShipping, #PortKlang, #ImportExportMY, etc.).
2. LinkedIn: Professional, thought-leadership angle, business-focused. Must mention practical Malaysian trade context (e.g. Royal Malaysian Customs Department / JKDM, Dagang Net, Form K1/K2, Port Klang/PTP, Incoterms 2020, SST compliance, Free Trade Agreements like ATIGA/RCEP), strategic takeaway, and a thought-provoking conversation question.
3. Facebook: Warm, community-driven, conversational. Opens with a relatable scenario or common struggle (e.g., clearance delays, surprise demurrage fees, documentation hurdles), provides practical friendly steps, and invites the SME community to share experiences in the comments.

Provide output strictly in the requested JSON structure.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instagramTikTok: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                fullCaption: { type: Type.STRING },
              },
              required: ["hook", "body", "callToAction", "hashtags", "fullCaption"],
            },
            linkedIn: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                fullCaption: { type: Type.STRING },
              },
              required: ["headline", "hook", "body", "callToAction", "hashtags", "fullCaption"],
            },
            facebook: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                fullCaption: { type: Type.STRING },
              },
              required: ["hook", "body", "callToAction", "hashtags", "fullCaption"],
            },
          },
          required: ["instagramTikTok", "linkedIn", "facebook"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({
      success: true,
      topic: currentTopic,
      source: "gemini",
      captions: parsed,
    });
  } catch (err: any) {
    console.error("Gemini generation error:", err);
    // Return high quality fallback
    return res.json({
      success: true,
      topic: currentTopic,
      source: "fallback",
      error: err.message,
      captions: getDefaultCaptions(currentTopic, tone),
    });
  }
});

function getDefaultCaptions(topic: string, tone?: string) {
  return {
    instagramTikTok: {
      hook: "Ever had your cargo stuck at Port Klang because of ONE missing document? 🤦‍♂️📦 Stop losing money on demurrage fees! Here’s your 30-second Malaysian shipping cheat sheet 🇲🇾👇",
      body: "1️⃣ Know your Customs Forms: Borang K1 for Import, Borang K2 for Export.\n2️⃣ Don't mess up Incoterms: FOB vs CIF can make or break your cash flow!\n3️⃣ Verify tariff codes on Dagang Net & Royal Malaysian Customs (JKDM) before departure.\n4️⃣ Tap into FTA duty exemptions: Form D (ATIGA) & Form E can slash import duties to 0% 💸.",
      callToAction: "💾 Save this reel before your next container booking! Drop 'GUIDE' below & we’ll DM you the complete shipping checklist 📲",
      hashtags: [
        "#MalaysiaShipping",
        "#ImportExportMY",
        "#PortKlang",
        "#LogisticsMalaysia",
        "#SMEBusinessMY",
        "#UsahawanMalaysia",
        "#FreightForwarding",
        "#SupplyChainMY",
        "#PTPPort",
        "#TikTokMalaysia",
      ],
      fullCaption: `Ever had your cargo stuck at Port Klang because of ONE missing document? 🤦‍♂️📦 Stop losing money on demurrage fees! Here’s your 30-second Malaysian shipping cheat sheet 🇲🇾👇\n\n1️⃣ Know your Customs Forms: Borang K1 for Import, Borang K2 for Export.\n2️⃣ Don't mess up Incoterms: FOB vs CIF can make or break your cash flow!\n3️⃣ Verify tariff codes on Dagang Net & Royal Malaysian Customs (JKDM) before departure.\n4️⃣ Tap into FTA duty exemptions: Form D (ATIGA) & Form E can slash import duties to 0% 💸.\n\n💾 Save this reel before your next container booking! Drop 'GUIDE' below & we’ll DM you the complete shipping checklist 📲\n\n#MalaysiaShipping #ImportExportMY #PortKlang #LogisticsMalaysia #SMEBusinessMY #UsahawanMalaysia #FreightForwarding #SupplyChainMY #PTPPort #TikTokMalaysia`,
    },
    linkedIn: {
      headline: "Navigating Malaysian Cross-Border Trade: A Strategic Logistics Guide for Importers & Exporters",
      hook: "Cross-border logistics in Malaysia is undergoing a massive shift. Yet, 6 out of 10 SME importers and exporters are still hemorrhaging margins to avoidable port demurrage, misclassified HS codes, and misaligned Incoterms 2020.",
      body: `Navigating trade through Port Klang (Northport & Westport) and the Port of Tanjung Pelepas (PTP) requires more than just booking a 20ft or 40ft container—it demands proactive customs governance.\n\nHere are 4 critical operational pillars every Malaysian supply chain executive and business owner must lock down:\n\n1. Customs Documentation Accuracy: A single discrepancy between your Commercial Invoice, Packing List, and Royal Malaysian Customs Department (JKDM) Form K1 (Import) or K2 (Export) via Dagang Net will trigger physical customs inspection red lanes.\n\n2. Free Trade Agreement (FTA) Arbitrage: Are you leveraging Form D (ATIGA), Form E (ACFTA), or RCEP? Proper Certificates of Origin (COO) issued through MITI's ePCO system can slash tariff duties from 15%+ to 0%.\n\n3. Demurrage & Detention Buffer: Congestion spikes around festive cycles require negotiating at least 14 free detention days with carrier lines, not settling for the standard 7.\n\n4. SST & Valuation Transparency: Ensure CIF (Cost, Insurance, and Freight) valuation accurately factors in SST liabilities to prevent post-clearance audit penalties.`,
      callToAction: "Logistics efficiency isn't merely an operational cost; in today's margin-sensitive landscape, it is your primary working capital lever.\n\nHow is your team hedging against regional port congestion and customs audit compliance this quarter? Let’s connect and discuss in the comments below.",
      hashtags: [
        "#MalaysianTrade",
        "#SupplyChainManagement",
        "#InternationalLogistics",
        "#ImportExport",
        "#PortKlang",
        "#TradeCompliance",
        "#SMEGrowthMY",
        "#CustomsClearance",
      ],
      fullCaption: `Cross-border logistics in Malaysia is undergoing a massive shift. Yet, 6 out of 10 SME importers and exporters are still hemorrhaging margins to avoidable port demurrage, misclassified HS codes, and misaligned Incoterms 2020.\n\nNavigating trade through Port Klang (Northport & Westport) and the Port of Tanjung Pelepas (PTP) requires more than just booking a 20ft or 40ft container—it demands proactive customs governance.\n\nHere are 4 critical operational pillars every Malaysian supply chain executive and business owner must lock down:\n\n1. Customs Documentation Accuracy: A single discrepancy between your Commercial Invoice, Packing List, and Royal Malaysian Customs Department (JKDM) Form K1 (Import) or K2 (Export) via Dagang Net will trigger physical customs inspection red lanes.\n\n2. Free Trade Agreement (FTA) Arbitrage: Are you leveraging Form D (ATIGA), Form E (ACFTA), or RCEP? Proper Certificates of Origin (COO) issued through MITI's ePCO system can slash tariff duties from 15%+ to 0%.\n\n3. Demurrage & Detention Buffer: Congestion spikes around festive cycles require negotiating at least 14 free detention days with carrier lines, not settling for the standard 7.\n\n4. SST & Valuation Transparency: Ensure CIF (Cost, Insurance, and Freight) valuation accurately factors in SST liabilities to prevent post-clearance audit penalties.\n\nLogistics efficiency isn't merely an operational cost; in today's margin-sensitive landscape, it is your primary working capital lever.\n\nHow is your team hedging against regional port congestion and customs audit compliance this quarter? Let’s connect and discuss in the comments below.\n\n#MalaysianTrade #SupplyChainManagement #InternationalLogistics #ImportExport #PortKlang #TradeCompliance #SMEGrowthMY #CustomsClearance`,
    },
    facebook: {
      hook: "Hands up if you’ve ever had that heart-stopping call from your freight forwarder saying: 'Boss, your container sangkut kat kastam...' 😅🚢",
      body: `We’ve all been there! Running an import/export business here in Malaysia is incredibly exciting, but let's be honest—dealing with shipping documentation, customs clearance, and surprise port storage charges can give any business owner sleepless nights.\n\nWhether you're bringing in raw materials from China and Vietnam, or exporting proudly Malaysian-made products to global markets, here is a friendly step-by-step checklist our community swears by:\n\n✅ Double-check your HS Code before cargo sails — don't leave it to guesswork!\n✅ Get your Form K1 (import) or Form K2 (export) submitted on Dagang Net early.\n✅ Make sure your packing list matches the physical container down to the exact carton count and gross weight.\n✅ Tap into MITI's Free Trade Agreements (ATIGA, ACFTA, CPTPP) to legally eliminate duties.\n✅ Always clarify with your forwarder whether your quote includes port handling charges, SST, and final trucking to your warehouse!`,
      callToAction: "What was the biggest shipping lesson you had to learn the hard way when you first started trading? Share your experience below—let’s help fellow Malaysian entrepreneurs avoid the same headache! 👇💬\n\n(Feel free to share this post with your business partners or logistics team!)",
      hashtags: [
        "#MalaysianEntrepreneurs",
        "#PerniagaanMalaysia",
        "#ImportExportMalaysia",
        "#LogistikMalaysia",
        "#SMECommunity",
        "#BisnesOnlineMY",
        "#PortKlang",
      ],
      fullCaption: `Hands up if you’ve ever had that heart-stopping call from your freight forwarder saying: 'Boss, your container sangkut kat kastam...' 😅🚢\n\nWe’ve all been there! Running an import/export business here in Malaysia is incredibly exciting, but let's be honest—dealing with shipping documentation, customs clearance, and surprise port storage charges can give any business owner sleepless nights.\n\nWhether you're bringing in raw materials from China and Vietnam, or exporting proudly Malaysian-made products to global markets, here is a friendly step-by-step checklist our community swears by:\n\n✅ Double-check your HS Code before cargo sails — don't leave it to guesswork!\n✅ Get your Form K1 (import) or Form K2 (export) submitted on Dagang Net early.\n✅ Make sure your packing list matches the physical container down to the exact carton count and gross weight.\n✅ Tap into MITI's Free Trade Agreements (ATIGA, ACFTA, CPTPP) to legally eliminate duties.\n✅ Always clarify with your forwarder whether your quote includes port handling charges, SST, and final trucking to your warehouse!\n\nWhat was the biggest shipping lesson you had to learn the hard way when you first started trading? Share your experience below—let’s help fellow Malaysian entrepreneurs avoid the same headache! 👇💬\n\n(Feel free to share this post with your business partners or logistics team!)\n\n#MalaysianEntrepreneurs #PerniagaanMalaysia #ImportExportMalaysia #LogistikMalaysia #SMECommunity #BisnesOnlineMY #PortKlang`,
    },
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
