import { create } from 'zustand';
import { GetItemResponse, GetTagResponse } from '@/lib/gen/models';

interface CartItem {
  itemId: number;
  count: number;
  customInstructions: string;
}

interface SearchModalState {
  show: boolean;
  searchValue: string;
  searchList: Array<GetItemResponse>;
  searchLoading: boolean;
  tags: Array<GetTagResponse>;
  selectedTags: Array<number>;
  cart: Array<CartItem>;
  onSearch: (() => void) | null;
  onConfirm: ((cartItems: Array<CartItem>) => void) | null;

  open: (tags: Array<GetTagResponse>, onSearch: () => void, onConfirm: (cartItems: Array<CartItem>) => void) => void;
  close: () => void;
  updateSearchValue: (value: string) => void;
  updateSearchList: (list: Array<GetItemResponse>) => void;
  setSearchLoading: (loading: boolean) => void;
  toggleTag: (index: number) => void;
  addToCart: (itemId: number, count: number, customInstructions: string) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  reset: () => void;
}

export const useSearchModalStore = create<SearchModalState>((set, get) => ({
  show: false,
  searchValue: '',
  searchList: [],
  searchLoading: false,
  tags: [],
  selectedTags: [],
  cart: [],
  onSearch: null,
  onConfirm: null,

  open: (tags, onSearch, onConfirm) => {
    set({
      show: true,
      tags,
      onSearch,
      onConfirm
    });
    if (onSearch) {
      setTimeout(() => onSearch(), 100);
    }
  },

  close: () =>
    set({
      show: false,
      searchValue: '',
      searchList: [],
      searchLoading: false,
      tags: [],
      selectedTags: [],
      cart: [],
      onSearch: null,
      onConfirm: null
    }),

  updateSearchValue: (value) => set({ searchValue: value }),

  updateSearchList: (list) => set({ searchList: list }),

  setSearchLoading: (loading) => set({ searchLoading: loading }),

  toggleTag: (index) => {
    const { selectedTags } = get();
    set({
      selectedTags: selectedTags.includes(index) ? selectedTags.filter((t) => t !== index) : [...selectedTags, index]
    });
  },

  addToCart: (itemId, count, customInstructions) => {
    const { cart } = get();
    const existingItemIndex = cart.findIndex((item) => item.itemId === itemId);

    if (count === 0) {
      if (existingItemIndex >= 0) {
        const updatedCart = cart.filter((item) => item.itemId !== itemId);
        set({ cart: updatedCart });
      }
    } else {
      if (existingItemIndex >= 0) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex] = { itemId, count, customInstructions };
        set({ cart: updatedCart });
      } else {
        set({ cart: [...cart, { itemId, count, customInstructions }] });
      }
    }
  },

  removeFromCart: (itemId) => {
    const { cart } = get();
    set({ cart: cart.filter((item) => item.itemId !== itemId) });
  },

  clearCart: () => set({ cart: [] }),

  reset: () =>
    set({
      show: false,
      searchValue: '',
      searchList: [],
      searchLoading: false,
      tags: [],
      selectedTags: [],
      cart: [],
      onSearch: null,
      onConfirm: null
    })
}));
