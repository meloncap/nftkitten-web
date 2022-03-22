import { SolscanPayload, PagingResult, SolscanCollection } from '../global'
import { useMyStore } from '../hooks/useMyStore'

export const fetchSolCollectionByVol = async ({
  pageParam = 0,
}): Promise<PagingResult<SolscanCollection>> => {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(`${solscanBaseUrl}/collection?sortBy=volume`)
  if (res.ok) {
    const result: SolscanPayload<SolscanCollection[]> = await res.json()
    if (!result.success) {
      throw JSON.stringify(result)
    }
    const data = result.data
    return {
      pageParam,
      data,
    }
  }
  throw JSON.stringify(res)
}
