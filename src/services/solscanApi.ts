import {
  SolscanPayload,
  SolscanMarket,
  PagingResult,
  SolscanCollection,
  SolscanToken,
  SolscanSearch,
} from '../types'
import { useMyStore } from '../hooks/useMyStore'
import { formatSol } from '../utils/numberFormatter'

export async function ethereumPriceApi(): Promise<SolscanMarket> {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(`${solscanBaseUrl}/market?symbol=ETH`)
  if (!res.ok) {
    throw JSON.stringify(res)
  }
  const result: SolscanPayload<SolscanMarket> = await res.json()
  if (!result.success) {
    throw JSON.stringify(result)
  }
  return result.data
}

export async function solanaPriceApi(): Promise<SolscanMarket> {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(`${solscanBaseUrl}/market?symbol=SOL`)
  if (!res.ok) {
    throw JSON.stringify(res)
  }
  const result: SolscanPayload<SolscanMarket> = await res.json()
  if (!result.success) {
    throw JSON.stringify(result)
  }
  return result.data
}

export type CollectionByVolApiOutput = {
  id: string
  src: string
  alt: string | undefined
  sol: number
  solFormatted: string
}

export function collectionByVolApi(type: string) {
  return async function ({
    pageParam = 0,
  }): Promise<PagingResult<CollectionByVolApiOutput>> {
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
      .sort((a, b) => b.volume - a.volume)
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

export type TradeByTimeApiOutput = {
  id: string
  src: string
  alt: string | undefined
  sol: number
  solFormatted: string
}

export async function tradeByTimeApi({
  pageParam = 0,
}): Promise<PagingResult<TradeByTimeApiOutput>> {
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

export type CollectionSearchApiOutput = {
  [family: string]: Array<SolscanSearch['collection'][0]>
}

export async function CollectionSearchApi(
  keyword: string
): Promise<CollectionSearchApiOutput> {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(
    `${solscanBaseUrl}/nft/search?keyword=` + encodeURIComponent(keyword)
  )
  if (!res.ok) {
    throw JSON.stringify(res)
  }
  const result: SolscanPayload<SolscanSearch> = await res.json()
  if (!result.success) {
    throw JSON.stringify(result)
  }
  if (result.data?.collection.length) {
    return result.data?.collection.reduce(
      (
        g: { [family: string]: Array<SolscanSearch['collection'][0]> },
        i: SolscanSearch['collection'][0]
      ) => {
        const family = i.family ?? ''
        if (family in g) {
          g[family].push(i)
        } else {
          g[family] = [i]
        }
        return g
      },
      {}
    )
  }
  return {}
}
