import create, { UseBoundStore } from 'zustand'
import { StoreState } from '../global'

export const useMyStore: UseBoundStore<StoreState, any> = create(() => ({
  apiBaseUrl: '',
  meApiBasUrl: '',
  imageBaseUrl: '',
  solscanApiBaseUrl: '',
  solscanPublicApiBaseUrl: '',
}))
