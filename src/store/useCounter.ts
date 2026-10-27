import { create } from "zustand";

// 1. Tạo store
export const useCount = create<{ count: number; increase: () => void }>(
  (set) => ({
    count: 10,
    increase: () => set((state) => ({ count: state.count + 1 })),
    decrease: () => set((state) => ({ count: state.count - 1 })),
  }),
);
