import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product, ProductInput } from '../types/product';
import { applyProductChanges, applyStockDelta, createProduct } from '../services/productService';

interface ProductStoreState {
  products: Product[];
  hasHydrated: boolean;
  addProduct: (input: ProductInput) => void;
  editProduct: (id: string, changes: ProductInput) => void;
  removeProduct: (id: string) => void;
  stockIn: (id: string, amount: number) => void;
  stockOut: (id: string, amount: number) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set) => ({
      products: [],
      hasHydrated: false,
      addProduct: (input) =>
        set((state) => ({ products: [...state.products, createProduct(input)] })),
      editProduct: (id, changes) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? applyProductChanges(p, changes) : p)),
        })),
      removeProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      stockIn: (id, amount) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? applyStockDelta(p, amount) : p)),
        })),
      stockOut: (id, amount) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? applyStockDelta(p, -amount) : p)),
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'stock-manager-products',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ products: state.products }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
