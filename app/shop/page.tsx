import { Suspense } from "react";
import { ShopCatalog } from "./ShopCatalog";

export const metadata = {
  title: "Shop All Jerseys",
  description:
    "Browse all World Cup 2026 national-team football jerseys. Filter by country, region, kit type, and brand.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-paper min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-fg text-sm">
            Loading jerseys...
          </div>
        </div>
      }
    >
      <ShopCatalog />
    </Suspense>
  );
}
