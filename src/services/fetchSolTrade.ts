import { SolscanTradePayload, SolscanTradeResult } from '../global'
import useMyStore from '../hooks/useMyStore'

const fetchSolTrade = async ({
  pageParam = 0,
}): Promise<SolscanTradeResult> => {
  const solScanBaseUrl = useMyStore
    .getState()
    .solScanApiBaseUrl.replace('public-', '')
  const res = await fetch(`${solScanBaseUrl}/nft?sortBy=tradeTime`)
  if (res.ok) {
    const result: SolscanTradePayload = await res.json()
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
