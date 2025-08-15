import { create } from 'zustand';

interface OrderItemModalState {
  show: boolean;
  customInstructions: string;
  itemCount: number;
  selectedItemId: number;
  onAddItem: (() => void) | null;

  open: (selectedItemId: number, onAddItem: () => void) => void;
  close: () => void;
  updateCustomInstructions: (instructions: string) => void;
  updateItemCount: (count: number) => void;
  reset: () => void;
}

export const useOrderItemModalStore = create<OrderItemModalState>((set) => ({
  show: false,
  customInstructions: '',
  itemCount: 1,
  selectedItemId: 0,
  onAddItem: null,

  open: (selectedItemId, onAddItem) =>
    set({
      show: true,
      selectedItemId,
      onAddItem,
      customInstructions: '',
      itemCount: 1
    }),

  close: () =>
    set({
      show: false,
      customInstructions: '',
      itemCount: 1,
      selectedItemId: 0,
      onAddItem: null
    }),

  updateCustomInstructions: (instructions) => set({ customInstructions: instructions }),

  updateItemCount: (count) => set({ itemCount: count }),

  reset: () =>
    set({
      show: false,
      customInstructions: '',
      itemCount: 1,
      selectedItemId: 0,
      onAddItem: null
    })
}));
