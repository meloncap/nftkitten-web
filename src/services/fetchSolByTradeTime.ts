import { SolscanPayload, PagingResult, SolscanToken } from '../global'
import { useMyStore } from '../hooks/useMyStore'

export async function fetchSolByTradeTime({
  pageParam = 0,
}): Promise<PagingResult<SolscanToken>> {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(`${solscanBaseUrl}/nft?sortBy=tradeTime`)
  if (res.ok) {
    const result: SolscanPayload<SolscanToken[]> = await res.json()
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
