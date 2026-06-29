export const metadata = {
  title: "Size Guide",
  description: "Find your perfect jersey fit with our World Cup 2026 size guide.",
};

const sizeData = [
  { size: "S", chestCm: "86–91", chestIn: "34–36", lengthCm: "68", lengthIn: "26.75" },
  { size: "M", chestCm: "96–101", chestIn: "37.75–39.75", lengthCm: "70", lengthIn: "27.5" },
  { size: "L", chestCm: "106–111", chestIn: "41.75–43.75", lengthCm: "72", lengthIn: "28.25" },
  { size: "XL", chestCm: "116–121", chestIn: "45.75–47.75", lengthCm: "74", lengthIn: "29" },
  { size: "2XL", chestCm: "126–131", chestIn: "49.75–51.75", lengthCm: "76", lengthIn: "30" },
];

export default function SizeGuidePage() {
  return (
    <div className="bg-ink min-h-screen">
      <div className="bg-surface border-b border-line-dark py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-archivo font-black uppercase text-white text-4xl sm:text-5xl tracking-tight">Size Guide</h1>
          <p className="text-white/40 text-sm mt-2">Find your perfect fit.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <section>
          <h2 className="font-archivo font-bold uppercase text-white text-xl tracking-tight mb-4">How to measure</h2>
          <div className="bg-surface rounded-xl border border-line-dark p-5 space-y-3 text-sm text-white/50 leading-relaxed">
            <p><strong className="text-white/80">Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal and parallel to the floor.</p>
            <p><strong className="text-white/80">Length:</strong> Measure from the highest point of the shoulder to the hem.</p>
            <p><strong className="text-white/80">Fit note:</strong> Match-fit jerseys are designed to sit close to the body. For a relaxed fit, we recommend sizing up one size.</p>
          </div>
        </section>

        <section>
          <h2 className="font-archivo font-bold uppercase text-white text-xl tracking-tight mb-4">Jersey sizing</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-surface rounded-xl border border-line-dark overflow-hidden">
              <thead className="bg-white/5 border-b border-line-dark">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">Chest (cm)</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">Chest (in)</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">Length (cm)</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">Length (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-dark">
                {sizeData.map((row) => (
                  <tr key={row.size} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">{row.size}</td>
                    <td className="px-4 py-3 text-white/40 tabular-nums">{row.chestCm}</td>
                    <td className="px-4 py-3 text-white/40 tabular-nums">{row.chestIn}</td>
                    <td className="px-4 py-3 text-white/40 tabular-nums">{row.lengthCm}</td>
                    <td className="px-4 py-3 text-white/40 tabular-nums">{row.lengthIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/30 mt-3">Measurements are approximate and may vary slightly by kit and maker (Nike / adidas / Puma).</p>
        </section>

        <section className="bg-brand/5 border border-brand/20 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-1">Still unsure?</p>
          <p className="text-sm text-white/50">
            Contact us at <a href="/contact" className="text-brand hover:underline">our support page</a> and we&apos;ll help you pick the right size.
          </p>
        </section>
      </div>
    </div>
  );
}
