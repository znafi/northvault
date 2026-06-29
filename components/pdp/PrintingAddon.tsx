"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight, Info } from "lucide-react";
import { PrintingOptions } from "@/lib/types";
import { PRINTING_FEE } from "@/lib/data";

interface PrintingAddonProps {
  value: PrintingOptions | null;
  onChange: (v: PrintingOptions | null) => void;
}

export function PrintingAddon({ value, onChange }: PrintingAddonProps) {
  const [enabled, setEnabled] = useState(!!value);
  const [name, setName] = useState(value?.name ?? "");
  const [number, setNumber] = useState<string>(value?.number !== undefined ? String(value.number) : "");

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) {
      onChange(null);
    } else if (name && number !== "") {
      onChange({ name: name.toUpperCase(), number: parseInt(number), fee: PRINTING_FEE });
    }
  };

  const handleNameChange = (v: string) => {
    const cleaned = v.toUpperCase().slice(0, 12);
    setName(cleaned);
    if (enabled && cleaned && number !== "") {
      onChange({ name: cleaned, number: parseInt(number), fee: PRINTING_FEE });
    } else {
      onChange(null);
    }
  };

  const handleNumberChange = (v: string) => {
    const cleaned = v.replace(/\D/g, "").slice(0, 2);
    setNumber(cleaned);
    const n = parseInt(cleaned);
    if (enabled && name && cleaned !== "" && n >= 0 && n <= 99) {
      onChange({ name: name.toUpperCase(), number: n, fee: PRINTING_FEE });
    } else {
      onChange(null);
    }
  };

  return (
    <div className="border border-line-dark rounded-xl p-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={toggle}>
        <div>
          <p className="text-sm font-semibold text-white">Add name & number printing</p>
          <p className="text-xs text-white/40 mt-0.5">+${PRINTING_FEE.toFixed(2)} CAD per item</p>
        </div>
        {enabled ? (
          <ToggleRight size={28} className="text-brand flex-shrink-0" />
        ) : (
          <ToggleLeft size={28} className="text-white/30 flex-shrink-0" />
        )}
      </div>

      {enabled && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-white/40 block mb-1">Name (max 12 chars)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="MESSI"
                maxLength={12}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white uppercase tracking-wider placeholder:text-white/20 focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/40 block mb-1">Number (0–99)</label>
              <input
                type="text"
                inputMode="numeric"
                value={number}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="10"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white text-center tabular-nums placeholder:text-white/20 focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          {(name || number) ? (
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 flex items-center justify-between">
              <span className="text-white/40 text-xs">Preview:</span>
              <span className="font-archivo font-black text-white uppercase tracking-widest text-sm">{name || "NAME"} {number || "0"}</span>
            </div>
          ) : null}

          <div className="flex items-start gap-1.5">
            <Info size={12} className="text-white/30 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/30">Personalized items are final sale and cannot be returned or exchanged.</p>
          </div>
        </div>
      )}
    </div>
  );
}
