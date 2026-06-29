export type Size = "S" | "M" | "L" | "XL" | "2XL";

export interface SizeStock {
  size: Size;
  inStock: boolean;
}

export interface Jersey {
  id: string;
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  region: "South America" | "North America" | "Europe" | "Africa";
  type: "Home" | "Away";
  maker: "Nike" | "adidas" | "Puma";
  price: number;
  colorway: string;
  description: string;
  highlights: string[];
  sizes: SizeStock[];
  images: string[];
  badges: string[];
  rating: number;
  reviewCount: number;
}

export interface PrintingOptions {
  name: string;
  number: number;
  fee: number;
}

export interface CartLine {
  jerseyId: string;
  slug: string;
  name: string;
  countryCode: string;
  country: string;
  size: Size;
  qty: number;
  unitPrice: number;
  image: string;
  printing?: PrintingOptions;
}

export interface CartState {
  lines: CartLine[];
  promoCode: string | null;
  promoDiscount: number;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartLine }
  | { type: "REMOVE_ITEM"; key: string }
  | { type: "UPDATE_QTY"; key: string; qty: number }
  | { type: "UPDATE_SIZE"; key: string; newSize: Size }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "CLEAR_PROMO" }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState };
