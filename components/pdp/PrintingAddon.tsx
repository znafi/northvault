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
  const [number, setNumber] = useState<string>(
    value?.number !== undefined ? String(value.number) : ""
  );

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
    <div className="border border-line-light rounded-xl p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggle}
      >
        <div>
          <p className="text-sm font-semibold text-ink">
            Add name & number printing
          </p>
          <p className="text-xs text-muted-fg mt-0.5">
            +${PRINTING_FEE.toFixed(2)} CAD per item
          </p>
        </div>
        {enabled ? (
          <ToggleRight size={28} className="text-brand flex-shrink-0" />
        ) : (
          <ToggleLeft size={28} className="text-muted-fg flex-shrink-0" />
        )}
      </div>

      {enabled && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-fg block mb-1">
                Name (max 12 chars)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="MESSI"
                maxLength={12}
                className="w-full border border-line-light rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wider focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-fg block mb-1">
                Number (0–99)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={number}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="10"
                className="w-full border border-line-light rounded-lg px-3 py-2 text-sm font-medium text-center tabular-nums focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          {/* Live preview */}
          {name || number ? (
            <div className="bg-ink rounded-lg px-4 py-2.5 flex items-center justify-between">
              <span className="text-white/50 text-xs">Preview:</span>
              <span className="font-archivo font-black text-white uppercase tracking-widest text-sm">
                {name || "NAME"} {number || "0"}
              </span>
            </div>
          ) : null}

          <div className="flex items-start gap-1.5">
            <Info size={12} className="text-muted-fg mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-fg">
              Personalized items are final sale and cannot be returned or
              exchanged.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
