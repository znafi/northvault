"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";

const sizeData = [
  { size: "S", chestCm: "86–91", chestIn: "34–36", lengthCm: "68", lengthIn: "26.75" },
  { size: "M", chestCm: "96–101", chestIn: "37.75–39.75", lengthCm: "70", lengthIn: "27.5" },
  { size: "L", chestCm: "106–111", chestIn: "41.75–43.75", lengthCm: "72", lengthIn: "28.25" },
  { size: "XL", chestCm: "116–121", chestIn: "45.75–47.75", lengthCm: "74", lengthIn: "29" },
  { size: "2XL", chestCm: "126–131", chestIn: "49.75–51.75", lengthCm: "76", lengthIn: "30" },
];

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 text-xs text-brand underline hover:no-underline">
        <Ruler size={12} /> Size Guide
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label="Size Guide" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-line-dark rounded-2xl shadow-2xl z-50 w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-archivo font-black uppercase text-white tracking-tight text-lg">Size Guide</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white" aria-label="Close size guide">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-white/40 mb-4">Measure your chest at the widest point. Match-fit jerseys run slim — if between sizes, size up.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line-dark">
                    <th className="text-left py-2 font-semibold text-white">Size</th>
                    <th className="text-left py-2 font-semibold text-white">Chest (cm)</th>
                    <th className="text-left py-2 font-semibold text-white">Chest (in)</th>
                    <th className="text-left py-2 font-semibold text-white">Length (cm)</th>
                    <th className="text-left py-2 font-semibold text-white">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-dark">
                  {sizeData.map((row) => (
                    <tr key={row.size}>
                      <td className="py-2.5 font-bold text-white">{row.size}</td>
                      <td className="py-2.5 text-white/40 tabular-nums">{row.chestCm}</td>
                      <td className="py-2.5 text-white/40 tabular-nums">{row.chestIn}</td>
                      <td className="py-2.5 text-white/40 tabular-nums">{row.lengthCm}</td>
                      <td className="py-2.5 text-white/40 tabular-nums">{row.lengthIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-white/30 mt-4">All measurements are approximate and may vary slightly by kit.</p>
          </div>
        </>
      )}
    </>
  );
}
