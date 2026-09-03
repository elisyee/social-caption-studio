import React, { useState } from "react";
import { MALAYSIA_CUSTOMS_FORMS, MAJOR_PORTS } from "../data/initialCaptions";
import { FileText, Anchor, ShieldAlert, BookOpen, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface MalaysianShippingGuideRefProps {
  onInsertAngle: (angleText: string) => void;
}

export const MalaysianShippingGuideRef: React.FC<MalaysianShippingGuideRefProps> = ({
  onInsertAngle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs mb-8">
      <button
        id="btn-toggle-trade-guide"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-neutral-50/70 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm md:text-base font-bold text-neutral-900">
                Malaysian Cross-Border Shipping Reference & Compliance Notes
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Quick Lookup
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Essential Customs Forms (K1/K2), Gateway Ports, and Incoterms 2020 for digital marketing posts
            </p>
          </div>
        </div>
        <div className="text-neutral-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-1 border-t border-neutral-100 bg-neutral-50/40 space-y-6">
          {/* Customs Forms Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-600" />
              Key Royal Malaysian Customs (JKDM) Forms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MALAYSIA_CUSTOMS_FORMS.map((form) => (
                <div
                  key={form.code}
                  className="bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-2xs hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-neutral-900">
                      {form.code}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                      {form.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-800 mb-1">{form.name}</p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
                    {form.description}
                  </p>
                  <button
                    id={`btn-use-form-${form.code.replace(/\s+/g, "-")}`}
                    onClick={() => onInsertAngle(`Focus on ${form.code} (${form.name}) procedures and common mistakes`)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Use in Prompt ➔
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Major Ports & Trade Incoterms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-neutral-600" />
                Primary Malaysian Commercial Ports
              </h4>
              <ul className="space-y-2 text-xs">
                {MAJOR_PORTS.map((port, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2 pb-1.5 border-b border-neutral-100 last:border-0 last:pb-0">
                    <span className="font-semibold text-neutral-900">{port.name}</span>
                    <span className="text-neutral-500 text-right text-[11px]">{port.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-neutral-600" />
                Incoterms 2020 Critical Notice for Malaysian SMEs
              </h4>
              <div className="space-y-2 text-xs text-neutral-700 leading-relaxed">
                <p>
                  <strong>FOB (Free On Board):</strong> Seller delivers goods on board the vessel at Port Klang/PTP. Buyer handles freight & insurance. Best for seasoned buyers with existing freight contracts.
                </p>
                <p>
                  <strong>CIF (Cost, Insurance & Freight):</strong> Seller pays freight & insurance to port of destination. Risk transfers once goods are loaded. Note: JKDM calculates SST/duties based on CIF valuation!
                </p>
                <p>
                  <strong>DDP (Delivered Duty Paid):</strong> Maximum risk on seller who must clear customs in destination country. Highly complex for Malaysian SME exporters unless using specialized 3PLs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
