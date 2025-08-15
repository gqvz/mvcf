import { create } from 'zustand';

interface TipModalState {
  show: boolean;
  tip: number;
  onConfirm: (() => void) | null;

  open: (onConfirm: () => void) => void;
  close: () => void;
  updateTip: (tip: number) => void;
  reset: () => void;
}

export const useTipModalStore = create<TipModalState>((set) => ({
  show: false,
  tip: 0,
  onConfirm: null,

  open: (onConfirm) =>
    set({
      show: true,
      tip: 0,
      onConfirm
    }),

  close: () =>
    set({
      show: false,
      tip: 0,
      onConfirm: null
    }),

  updateTip: (tip) => set({ tip }),

  reset: () =>
    set({
      show: false,
      tip: 0,
      onConfirm: null
    })
}));
