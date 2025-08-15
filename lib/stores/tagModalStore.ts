import { create } from 'zustand';

interface TagModalState {
  show: boolean;
  mode: 'create' | 'edit';
  tagName: string;
  onSave: (() => void) | null;

  openCreate: (onSave: () => void) => void;
  openEdit: (tagName: string, onSave: () => void) => void;
  close: () => void;
  updateTagName: (tagName: string) => void;
  reset: () => void;
}

export const useTagModalStore = create<TagModalState>((set) => ({
  show: false,
  mode: 'create',
  tagName: '',
  onSave: null,

  openCreate: (onSave) =>
    set({
      show: true,
      mode: 'create',
      tagName: '',
      onSave
    }),

  openEdit: (tagName, onSave) =>
    set({
      show: true,
      mode: 'edit',
      tagName,
      onSave
    }),

  close: () =>
    set({
      show: false,
      mode: 'create',
      tagName: '',
      onSave: null
    }),

  updateTagName: (tagName) => set({ tagName }),

  reset: () =>
    set({
      show: false,
      mode: 'create',
      tagName: '',
      onSave: null
    })
}));
