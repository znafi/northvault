export const metadata = {
  title: "Size Guide",
  description: "Find your perfect jersey fit with our World Cup 2026 size guide.",
};

const sizeData = [
  { size: "S", chestCm: "86–91", chestIn: "34–36", lengthCm: "68", lengthIn: "26.75", waistCm: "71–76", waistIn: "28–30" },
  { size: "M", chestCm: "96–101", chestIn: "37.75–39.75", lengthCm: "70", lengthIn: "27.5", waistCm: "81–86", waistIn: "32–34" },
  { size: "L", chestCm: "106–111", chestIn: "41.75–43.75", lengthCm: "72", lengthIn: "28.25", waistCm: "91–96", waistIn: "36–38" },
  { size: "XL", chestCm: "116–121", chestIn: "45.75–47.75", lengthCm: "74", lengthIn: "29", waistCm: "101–106", waistIn: "40–42" },
  { size: "2XL", chestCm: "126–131", chestIn: "49.75–51.75", lengthCm: "76", lengthIn: "30", waistCm: "111–116", waistIn: "44–46" },
];

export default function SizeGuidePage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-archivo font-black uppercase text-white text-4xl sm:text-5xl tracking-tight">
            Size Guide
          </h1>
          <p className="text-white/50 text-sm mt-2">Find your perfect fit.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <section>
          <h2 className="font-archivo font-bold uppercase text-ink text-xl tracking-tight mb-4">
            How to measure
          </h2>
          <div className="bg-white rounded-xl border border-line-light p-5 space-y-3 text-sm text-muted-fg leading-relaxed">
            <p>
              <strong className="text-ink">Chest:</strong> Measure around the
              fullest part of your chest, keeping the tape horizontal and
              parallel to the floor.
            </p>
            <p>
              <strong className="text-ink">Length:</strong> Measure from the
              highest point of the shoulder to the hem.
            </p>
            <p>
              <strong className="text-ink">Fit note:</strong> Match-fit jerseys
              are designed to sit close to the body. For a relaxed fit, we
              recommend sizing up one size.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-archivo font-bold uppercase text-ink text-xl tracking-tight mb-4">
            Jersey sizing
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-line-light overflow-hidden">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Chest (cm)</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Chest (in)</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Length (cm)</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Length (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-light">
                {sizeData.map((row) => (
                  <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-ink">{row.size}</td>
                    <td className="px-4 py-3 text-muted-fg tabular-nums">{row.chestCm}</td>
                    <td className="px-4 py-3 text-muted-fg tabular-nums">{row.chestIn}</td>
                    <td className="px-4 py-3 text-muted-fg tabular-nums">{row.lengthCm}</td>
                    <td className="px-4 py-3 text-muted-fg tabular-nums">{row.lengthIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-fg mt-3">
            Measurements are approximate and may vary slightly by kit and maker (Nike / adidas / Puma).
          </p>
        </section>

        <section className="bg-brand/5 border border-brand/20 rounded-xl p-5">
          <p className="text-sm font-semibold text-ink mb-1">Still unsure?</p>
          <p className="text-sm text-muted-fg">
            Contact us at{" "}
            <a href="/contact" className="text-brand hover:underline">
              our support page
            </a>{" "}
            and we&apos;ll help you pick the right size.
          </p>
        </section>
      </div>
    </div>
  );
}
