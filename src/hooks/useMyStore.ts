import create, { UseBoundStore } from 'zustand'
import { StoreState } from '../global'

const useMyStore: UseBoundStore<StoreState, any> = create(() => ({
  apiBaseUrl: '',
  meApiBasUrl: '',
  imageBaseUrl: '',
  solscanApiBaseUrl: '',
  solscanPublicApiBaseUrl: '',
}))
export default useMyStore
