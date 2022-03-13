import create, { StoreApi, UseBoundStore } from 'zustand'

type StoreState ={
   apiBaseUrl: string
};
type MyStoreApi = StoreApi<StoreState> & {};
export const useStore: UseBoundStore<StoreState, MyStoreApi> = create(set => ({
  apiBaseUrl: ''
}));