import { SolscanPayload, PagingResult, SolscanCollection } from '../global'
import { useMyStore } from '../hooks/useMyStore'
import { formatSol } from './numberFormatter'

export type fetchSolCollectionByVolResult = {
  id: string
  src: string
  alt: string | undefined
  sol: number
  solFormatted: string
}

export function fetchSolCollectionByVol(type: string) {
  return async function ({
    pageParam = 0,
  }): Promise<PagingResult<fetchSolCollectionByVolResult>> {
    const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
    const res = await fetch(`${solscanBaseUrl}/collection?sortBy=volume${type}`)
    if (!res.ok) {
      throw JSON.stringify(res)
    }
    const result: SolscanPayload<SolscanCollection[]> = await res.json()
    if (!result.success) {
      throw JSON.stringify(result)
    }
    const data = result.data
      .filter((d) => d?.data?.avatar)
      .sort((a, b) => (a.volume < b.volume ? 1 : a.volume > b.volume ? -1 : 0))
      .map((d) => ({
        id: d.data.collectionId,
        src: d.data.avatar,
        alt: d.data.collection,
        sol: d.floorPrice ?? 0,
        solFormatted: formatSol(d.floorPrice),
      }))
    return {
      pageParam,
      data,
    }
  }
}
