import { SolscanPayload, PagingResult, SolscanToken } from '../global'
import { useMyStore } from '../hooks/useMyStore'
import { formatSol } from './numberFormatter'

export type fetchSolByTradeTimeResult = {
  id: string
  src: string
  alt: string | undefined
  sol: number
  solFormatted: string
}

export async function fetchSolByTradeTime({
  pageParam = 0,
}): Promise<PagingResult<fetchSolByTradeTimeResult>> {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(`${solscanBaseUrl}/nft?sortBy=tradeTime`)
  if (!res.ok) {
    throw JSON.stringify(res)
  }
  const result: SolscanPayload<SolscanToken[]> = await res.json()
  if (!result.success) {
    throw JSON.stringify(result)
  }
  const data = result.data
    .filter((d) => d?.info?.meta?.image)
    .sort((a, b) => b.trade.tradeTime - a.trade.tradeTime)
    .map((d) => ({
      id: d.info.mint,
      src: d.info.meta.image,
      alt: d.info.data.name,
      sol: d.trade.price ?? 0,
      solFormatted: formatSol(d.trade.price),
    }))
  return {
    pageParam,
    data,
  }
}
