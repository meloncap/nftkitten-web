import create, { StoreApi } from 'zustand'

export type MyStoreState = {
  apiBaseUrl: string
  meApiBasUrl: string
  imageBaseUrl: string
  solscanApiBaseUrl: string
  solscanPublicApiBaseUrl: string
  openSeaApiBaseUrl: string
}

export const useMyStore = create<
  MyStoreState,
  unknown,
  unknown,
  StoreApi<MyStoreState>
>(() => ({
  apiBaseUrl: '',
  meApiBasUrl: '',
  imageBaseUrl: '',
  solscanApiBaseUrl: '',
  solscanPublicApiBaseUrl: '',
  openSeaApiBaseUrl: '',
}))
