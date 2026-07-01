import { Jersey } from "./types";

export const jerseys: Jersey[] = [
  {
    id: "br-h",
    slug: "brazil-2026-home",
    name: "Brazil 2026 Home Jersey",
    country: "Brazil",
    countryCode: "BR",
    region: "South America",
    type: "Home",
    maker: "Nike",
    price: 60.00,
    colorway: "Yellow / Green",
    description:
      "The iconic canarinho yellow with green trim. The most recognizable shirt in world football, refreshed for 2026.",
    highlights: [
      "Classic CBF yellow",
      "Breathable match-weight fabric",
      "Embroidered crest",
      "Tagless collar",
    ],
    badges: ["Bestseller"],
    rating: 4.9,
    reviewCount: 218,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/brazil-home-1.jpeg",
      "/jerseys/brazil-home-2.jpeg",
    ],
  },
  {
    id: "br-a",
    slug: "brazil-2026-away",
    name: "Brazil 2026 Away Jersey",
    country: "Brazil",
    countryCode: "BR",
    region: "South America",
    type: "Away",
    maker: "Nike",
    price: 60.00,
    colorway: "Royal Blue",
    description:
      "Brazil's deep royal-blue away kit — a bold alternate to the famous yellow.",
    highlights: [
      "Royal blue colorway",
      "Match-weight fabric",
      "Embroidered crest",
      "Slim modern fit",
    ],
    badges: ["Bestseller"],
    rating: 4.8,
    reviewCount: 142,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/brazil-away-1.jpeg",
      "/jerseys/brazil-away-2.jpeg",
    ],
  },
  {
    id: "mx-h",
    slug: "mexico-2026-home",
    name: "Mexico 2026 Home Jersey",
    country: "Mexico",
    countryCode: "MX",
    region: "North America",
    type: "Home",
    maker: "adidas",
    price: 60.00,
    colorway: "Green / White",
    description:
      "El Tri's vibrant green home shirt — one of the loudest selling kits in North America.",
    highlights: [
      "Vibrant Tri green",
      "Aeroready-style fabric",
      "Woven crest",
      "Ribbed collar",
    ],
    badges: ["Bestseller"],
    rating: 4.8,
    reviewCount: 176,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/mexico-home-1.jpeg",
      "/jerseys/mexico-home-2.jpeg",
    ],
  },
  {
    id: "ma-h",
    slug: "morocco-2026-home",
    name: "Morocco 2026 Home Jersey",
    country: "Morocco",
    countryCode: "MA",
    region: "Africa",
    type: "Home",
    maker: "Puma",
    price: 60.00,
    colorway: "Red / Green",
    description:
      "The Atlas Lions' red home kit with green detailing — a runaway seller since 2022.",
    highlights: [
      "Bold red colorway",
      "Green star detailing",
      "Lightweight knit",
      "Embroidered crest",
    ],
    badges: ["New"],
    rating: 4.9,
    reviewCount: 131,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/morocco-home-1.jpeg",
      "/jerseys/morocco-home-2.jpeg",
      "/jerseys/morocco-home-3.jpeg",
    ],
  },
  {
    id: "de-h",
    slug: "germany-2026-home",
    name: "Germany 2026 Home Jersey",
    country: "Germany",
    countryCode: "DE",
    region: "Europe",
    type: "Home",
    maker: "adidas",
    price: 60.00,
    colorway: "White / Black",
    description:
      "Die Mannschaft's classic white home shirt with crisp black accents.",
    highlights: [
      "Classic white kit",
      "DFB crest",
      "Clean modern cut",
      "Moisture-wicking",
    ],
    badges: [],
    rating: 4.7,
    reviewCount: 98,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/germany-home-1.jpeg",
      "/jerseys/germany-home-2.jpeg",
    ],
  },
  {
    id: "eg-h",
    slug: "egypt-2026-home",
    name: "Egypt 2026 Home Jersey",
    country: "Egypt",
    countryCode: "EG",
    region: "Africa",
    type: "Home",
    maker: "Puma",
    price: 60.00,
    colorway: "Red / Black",
    description:
      "The Pharaohs' striking red home shirt — a fan favourite across the diaspora.",
    highlights: [
      "Signature red",
      "Gold crest detail",
      "Breathable fabric",
      "Ribbed collar",
    ],
    badges: [],
    rating: 4.7,
    reviewCount: 74,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/egypt-home-1.jpeg",
      "/jerseys/egypt-home-2.jpeg",
    ],
  },
  {
    id: "ca-h",
    slug: "canada-2026-home",
    name: "Canada 2026 Home Jersey",
    country: "Canada",
    countryCode: "CA",
    region: "North America",
    type: "Home",
    maker: "Nike",
    price: 60.00,
    colorway: "Red / Maple",
    description:
      "The host nation's bold red home shirt with the maple leaf front and centre. The shirt of the summer.",
    highlights: [
      "Host-nation home kit",
      "Centred maple leaf",
      "Match-weight fabric",
      "Embroidered crest",
    ],
    badges: ["Host Nation", "Bestseller"],
    rating: 5.0,
    reviewCount: 264,
    sizes: [
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
      { size: "3XL", inStock: true },
    ],
    images: [
      "/jerseys/canada-home-1.jpeg",
      "/jerseys/canada-home-2.jpeg",
    ],
  },
  {
    id: "ca-a",
    slug: "canada-2026-away",
    name: "Canada 2026 Away Jersey",
    country: "Canada",
    countryCode: "CA",
    region: "North America",
    type: "Away",
    maker: "Nike",
    price: 60.00,
    colorway: "Black / Ice",
    description:
      "Canada's darker away kit with a cracked-ice maple-leaf graphic. Sharp, modern, sold out fast last drop.",
    highlights: [
      "Cracked-ice graphic",
      "Host-nation away kit",
      "Slim athletic fit",
      "Tonal crest",
    ],
    badges: ["Host Nation"],
    rating: 4.9,
    reviewCount: 151,
    sizes: [
      { size: "S", inStock: true },
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
      { size: "3XL", inStock: true },
    ],
    images: [
      "/jerseys/canada-away-1.jpeg",
      "/jerseys/canada-away-2.jpeg",
    ],
  },
  {
    id: "fr-h",
    slug: "france-2026-home",
    name: "France 2026 Home Jersey",
    country: "France",
    countryCode: "FR",
    region: "Europe",
    type: "Home",
    maker: "Nike",
    price: 60.00,
    colorway: "Navy Blue",
    description:
      "Les Bleus' deep navy home shirt — always one of the top-selling kits of any tournament.",
    highlights: [
      "Deep navy blue",
      "FFF crest",
      "Premium match fabric",
      "Refined collar",
    ],
    badges: [],
    rating: 4.8,
    reviewCount: 120,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/france-home-1.jpeg",
      "/jerseys/france-home-2.jpeg",
    ],

  },
  {
    id: "ar-h",
    slug: "argentina-2026-home",
    name: "Argentina 2026 Home Jersey",
    country: "Argentina",
    countryCode: "AR",
    region: "South America",
    type: "Home",
    maker: "adidas",
    price: 60.00,
    colorway: "Sky Blue / White",
    description:
      "The reigning champions' iconic sky-blue and white stripes. Demand is relentless — order early.",
    highlights: [
      "Albiceleste stripes",
      "Three-star crest",
      "Match-weight knit",
      "Embroidered detailing",
    ],
    badges: ["Bestseller"],
    rating: 5.0,
    reviewCount: 312,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/argentina-home-1.jpeg",
      "/jerseys/argentina-home-2.png",
    ],
  },
  {
    id: "ar-a",
    slug: "argentina-2026-away",
    name: "Argentina 2026 Away Jersey",
    country: "Argentina",
    countryCode: "AR",
    region: "South America",
    type: "Away",
    maker: "adidas",
    price: 60.00,
    colorway: "Deep Purple",
    description:
      "Argentina's bold alternate away kit — a modern collector's favourite.",
    highlights: [
      "Statement colorway",
      "Three-star crest",
      "Slim fit",
      "Tonal trims",
    ],
    badges: [],
    rating: 4.8,
    reviewCount: 98,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/argentina-away-1.jpeg",
      "/jerseys/argentina-away-2.jpeg",
    ],
  },
  {
    id: "pt-h",
    slug: "portugal-2026-home",
    name: "Portugal 2026 Home Jersey",
    country: "Portugal",
    countryCode: "PT",
    region: "Europe",
    type: "Home",
    maker: "Puma",
    price: 60.00,
    colorway: "Deep Red / Green",
    description:
      "Portugal's rich red home shirt with green accents — a perennial top seller.",
    highlights: [
      "Deep red colorway",
      "Green collar trim",
      "FPF crest",
      "Lightweight knit",
    ],
    badges: [],
    rating: 4.8,
    reviewCount: 134,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/portugal-home-1.jpeg",
      "/jerseys/portugal-home-2.jpeg",
    ],
  },
  {
    id: "en-h",
    slug: "england-2026-home",
    name: "England 2026 Home Jersey",
    country: "England",
    countryCode: "GB",
    region: "Europe",
    type: "Home",
    maker: "Nike",
    price: 60.00,
    colorway: "White / Navy",
    description:
      "The Three Lions' classic white home shirt with navy trim.",
    highlights: [
      "Classic white kit",
      "Three Lions crest",
      "Clean cut",
      "Moisture-wicking",
    ],
    badges: [],
    rating: 4.7,
    reviewCount: 111,
    sizes: [
      { size: "M", inStock: true },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
      { size: "2XL", inStock: true },
    ],
    images: [
      "/jerseys/england-home-1.jpeg",
      "/jerseys/england-home-2.jpeg",
    ],
  },
];

export function getJerseyBySlug(slug: string): Jersey | undefined {
  return jerseys.find((j) => j.slug === slug);
}

export function getBestsellers(): Jersey[] {
  return jerseys.filter((j) => j.badges.includes("Bestseller"));
}

export function getByType(type: "Home" | "Away"): Jersey[] {
  return jerseys.filter((j) => j.type === type);
}

export function getHostNation(): Jersey[] {
  return jerseys.filter((j) => j.country === "Canada");
}

export function getRelated(current: Jersey, max = 4): Jersey[] {
  return jerseys
    .filter((j) => j.region === current.region && j.id !== current.id)
    .slice(0, max);
}

export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    BR: "🇧🇷",
    MX: "🇲🇽",
    MA: "🇲🇦",
    DE: "🇩🇪",
    EG: "🇪🇬",
    CA: "🇨🇦",
    FR: "🇫🇷",
    AR: "🇦🇷",
    PT: "🇵🇹",
    GB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  };
  return flags[countryCode] ?? "🏴";
}

export const PRINTING_FEE = 19.99;
export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING = 14.99;
export const EXPRESS_SHIPPING = 24.99;
export const TAX_RATE = 0.05;
export const PROMO_CODE = "WC2026";
export const PROMO_DISCOUNT = 0.1;
