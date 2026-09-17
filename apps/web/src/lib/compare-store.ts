import { create } from 'zustand';

export interface CompareProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
  brandName?: string;
  specifications: Record<string, any>;
}

interface CompareStore {
  items: CompareProduct[];
  isOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;
  toggleProduct: (product: CompareProduct) => void;
  removeProduct: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  isOpen: false,
  openCompare: () => set({ isOpen: true }),
  closeCompare: () => set({ isOpen: false }),
  toggleProduct: (product) => {
    const { items } = get();
    const exists = items.some((i) => i.id === product.id);
    if (exists) {
      set({ items: items.filter((i) => i.id !== product.id) });
    } else {
      if (items.length >= 3) {
        alert('Anda dapat membandingkan maksimal 3 mesin sekaligus.');
        return;
      }
      set({ items: [...items, product], isOpen: true });
    }
  },
  removeProduct: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  clearCompare: () => set({ items: [] }),
}));