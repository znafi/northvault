"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  CartState,
  CartAction,
  CartLine,
  Size,
} from "@/lib/types";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  TAX_RATE,
  PROMO_CODE,
  PROMO_DISCOUNT,
} from "@/lib/data";

const STORAGE_KEY = "northvault.cart";

function cartLineKey(line: Pick<CartLine, "jerseyId" | "size" | "printing">): string {
  return `${line.jerseyId}:${line.size}:${JSON.stringify(line.printing ?? null)}`;
}

const initialState: CartState = {
  lines: [],
  promoCode: null,
  promoDiscount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_ITEM": {
      const key = cartLineKey(action.payload);
      const existing = state.lines.findIndex(
        (l) => cartLineKey(l) === key
      );
      if (existing >= 0) {
        const lines = [...state.lines];
        lines[existing] = {
          ...lines[existing],
          qty: lines[existing].qty + action.payload.qty,
        };
        return { ...state, lines };
      }
      return { ...state, lines: [...state.lines, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        lines: state.lines.filter((l) => cartLineKey(l) !== action.key),
      };

    case "UPDATE_QTY": {
      if (action.qty <= 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => cartLineKey(l) !== action.key),
        };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          cartLineKey(l) === action.key ? { ...l, qty: action.qty } : l
        ),
      };
    }

    case "UPDATE_SIZE": {
      return {
        ...state,
        lines: state.lines.map((l) =>
          cartLineKey(l) === action.key ? { ...l, size: action.newSize } : l
        ),
      };
    }

    case "APPLY_PROMO":
      if (action.code.toUpperCase() === PROMO_CODE) {
        return { ...state, promoCode: PROMO_CODE, promoDiscount: PROMO_DISCOUNT };
      }
      return state;

    case "CLEAR_PROMO":
      return { ...state, promoCode: null, promoDiscount: 0 };

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  hydrated: boolean;
  addItem: (line: CartLine) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  updateSize: (key: string, newSize: Size) => void;
  applyPromo: (code: string) => "ok" | "invalid";
  clearPromo: () => void;
  clear: () => void;
  lineKey: (line: Pick<CartLine, "jerseyId" | "size" | "printing">) => string;
  subtotal: number;
  itemCount: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartState = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const subtotal = state.lines.reduce(
    (sum, l) => sum + l.unitPrice * l.qty + (l.printing ? l.printing.fee * l.qty : 0),
    0
  );
  const discount = subtotal * state.promoDiscount;
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + shipping + tax;
  const itemCount = state.lines.reduce((sum, l) => sum + l.qty, 0);

  const addItem = useCallback((line: CartLine) => {
    dispatch({ type: "ADD_ITEM", payload: line });
  }, []);

  const removeItem = useCallback((key: string) => {
    dispatch({ type: "REMOVE_ITEM", key });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    dispatch({ type: "UPDATE_QTY", key, qty });
  }, []);

  const updateSize = useCallback((key: string, newSize: Size) => {
    dispatch({ type: "UPDATE_SIZE", key, newSize });
  }, []);

  const applyPromo = useCallback((code: string): "ok" | "invalid" => {
    if (code.toUpperCase() === PROMO_CODE) {
      dispatch({ type: "APPLY_PROMO", code });
      return "ok";
    }
    return "invalid";
  }, []);

  const clearPromo = useCallback(() => {
    dispatch({ type: "CLEAR_PROMO" });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        state,
        hydrated,
        addItem,
        removeItem,
        updateQty,
        updateSize,
        applyPromo,
        clearPromo,
        clear,
        lineKey: cartLineKey,
        subtotal,
        itemCount,
        discount,
        shipping,
        tax,
        total,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
