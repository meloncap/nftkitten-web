import create from 'zustand'

export const useMyStore = create(() => ({
  apiBaseUrl: '',
  meApiBasUrl: '',
  imageBaseUrl: '',
  solscanApiBaseUrl: '',
  solscanPublicApiBaseUrl: '',
}))
