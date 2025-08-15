import { create } from 'zustand';
import { GetItemResponse, GetTagResponse } from '@/lib/gen/models';

interface ItemModalState {
  show: boolean;
  mode: 'create' | 'edit';
  item: GetItemResponse;
  tags: Array<GetTagResponse>;
  onSave: (() => void) | null;

  openCreate: (tags: Array<GetTagResponse>, onSave: () => void) => void;
  openEdit: (item: GetItemResponse, tags: Array<GetTagResponse>, onSave: () => void) => void;
  close: () => void;
  updateItem: (item: GetItemResponse) => void;
  reset: () => void;
}

const defaultItem: GetItemResponse = {
  name: '',
  price: 0,
  available: true,
  description: '',
  imageUrl: '',
  id: 0,
  tags: []
};

export const useItemModalStore = create<ItemModalState>((set) => ({
  show: false,
  mode: 'create',
  item: defaultItem,
  tags: [],
  onSave: null,

  openCreate: (tags, onSave) =>
    set({
      show: true,
      mode: 'create',
      item: defaultItem,
      tags,
      onSave
    }),

  openEdit: (item, tags, onSave) =>
    set({
      show: true,
      mode: 'edit',
      item,
      tags,
      onSave
    }),

  close: () =>
    set({
      show: false,
      mode: 'create',
      item: defaultItem,
      tags: [],
      onSave: null
    }),

  updateItem: (item) => set({ item }),

  reset: () =>
    set({
      show: false,
      mode: 'create',
      item: defaultItem,
      tags: [],
      onSave: null
    })
}));
