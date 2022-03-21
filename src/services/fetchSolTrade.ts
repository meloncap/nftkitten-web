import { SolscanPayload, PagingResult, SolscanTrade } from '../global'
import useMyStore from '../hooks/useMyStore'

const fetchSolTrade = async ({
  pageParam = 0,
}): Promise<PagingResult<SolscanTrade>> => {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(`${solscanBaseUrl}/nft?sortBy=tradeTime`)
  if (res.ok) {
    const result: SolscanPayload<SolscanTrade[]> = await res.json()
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
export default fetchSolTrade
