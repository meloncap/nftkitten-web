import create, { StoreApi, UseBoundStore } from 'zustand'
import { StoreState } from '../global'

type MyStoreApi = StoreApi<StoreState> & {}
const useStore: UseBoundStore<StoreState, MyStoreApi> = create(() => ({
  apiBaseUrl: '',
  meApiBasUrl: '',
  imageBaseUrl: '',
  solScanBaseUrl: '',
}))
export default useStore
