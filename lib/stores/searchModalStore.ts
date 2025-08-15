import { create } from 'zustand';
import { GetItemResponse, GetTagResponse } from '@/lib/gen/models';

interface SearchModalState {
  show: boolean;
  searchValue: string;
  searchList: Array<GetItemResponse>;
  searchLoading: boolean;
  tags: Array<GetTagResponse>;
  selectedTags: Array<number>;
  onSearch: (() => void) | null;
  onItemSelect: ((item: GetItemResponse) => void) | null;

  open: (tags: Array<GetTagResponse>, onSearch: () => void, onItemSelect: (item: GetItemResponse) => void) => void;
  close: () => void;
  updateSearchValue: (value: string) => void;
  updateSearchList: (list: Array<GetItemResponse>) => void;
  setSearchLoading: (loading: boolean) => void;
  toggleTag: (index: number) => void;
  reset: () => void;
}

export const useSearchModalStore = create<SearchModalState>((set, get) => ({
  show: false,
  searchValue: '',
  searchList: [],
  searchLoading: false,
  tags: [],
  selectedTags: [],
  onSearch: null,
  onItemSelect: null,

  open: (tags, onSearch, onItemSelect) =>
    set({
      show: true,
      tags,
      onSearch,
      onItemSelect
    }),

  close: () =>
    set({
      show: false,
      searchValue: '',
      searchList: [],
      searchLoading: false,
      tags: [],
      selectedTags: [],
      onSearch: null,
      onItemSelect: null
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

  reset: () =>
    set({
      show: false,
      searchValue: '',
      searchList: [],
      searchLoading: false,
      tags: [],
      selectedTags: [],
      onSearch: null,
      onItemSelect: null
    })
}));
