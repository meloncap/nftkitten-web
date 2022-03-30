import {
  MECollection,
  MECollectionStats,
  MELaunchpad,
  PagingResult,
} from '../types'
import { ME_PAGE_LIMIT } from '../contants'
import { useMyStore } from '../hooks/useMyStore'
import { formatSol } from '../utils/numberFormatter'

export type CollectionApiOutput = {
  id: string
  src: string
  alt: string | undefined
  sol: number
  solFormatted: string
  count: number
  volumeAll: number
  tokenimage: string | null
}

export async function collectionApi({
  pageParam = 0,
}): Promise<PagingResult<CollectionApiOutput>> {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  me_collection(offset: ${pageParam * ME_PAGE_LIMIT}, limit: ${ME_PAGE_LIMIT}) {
    symbol: data(path: "$.symbol")
    image: data(path: "$.image")
    name: data(path: "$.name")
    floorPrice: stats(path: "$.floorPrice")
    listedCount: stats(path: "$.listedCount")
    volumeAll: stats(path: "$.volumeAll")
    tokenimage: stats(path: "$.meta.metadata.data.image")
  }
}
`,
    }),
  })
  if (!res.ok) {
    throw JSON.stringify(res)
  }
  const result: {
    data: {
      me_collection: Array<MECollection & MECollectionStats>
    }
  } = await res.json()
  if (!result?.data?.me_collection) {
    throw JSON.stringify(result)
  }
  const data = result.data.me_collection
    .sort((a, b) => (b.stats?.volumeAll ?? 0) - (a.stats?.volumeAll ?? 0))
    .map((data) => ({
      id: data.symbol,
      src: data.image ?? '',
      alt: data.name ?? undefined,
      sol: data.floorPrice ?? 0,
      solFormatted: formatSol(data.floorPrice),
      count: data.listedCount ?? 0,
      volumeAll: data.volumeAll,
      tokenimage: data.tokenimage ?? null,
    }))
  return {
    pageParam,
    data,
  }
}

export type LaunchpadApiOutput = {
  id: string
  src: string
  alt: string | undefined
  date: string
  featured: boolean
  tokenimage: string | null
}

export async function launchpadApi({
  pageParam = 0,
}): Promise<PagingResult<LaunchpadApiOutput>> {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  me_launchpad(offset: ${pageParam * ME_PAGE_LIMIT}, limit: ${ME_PAGE_LIMIT}) {
    symbol: data(path: "$.symbol")
    image: data(path: "$.image")
    name: data(path: "$.name")
    launchDatetime: data(path: "$.launchDatetime")
    featured: data(path: "$.featured")
    tokenimage: stats(path: "$.meta.metadata.data.image")
  }
}
`,
    }),
  })
  if (!res.ok) {
    throw JSON.stringify(res)
  }
  const result: { data: { me_launchpad: Array<MELaunchpad> } } =
    await res.json()
  if (!result?.data?.me_launchpad) {
    throw JSON.stringify(result)
  }
  const data = result.data.me_launchpad
    .filter((row) => row?.image)
    .sort((a, b) =>
      (a.launchDatetime ?? '') < (b.launchDatetime ?? '')
        ? 1
        : (a.launchDatetime ?? '') > (b.launchDatetime ?? '')
        ? -1
        : 0
    )
    .map((row) => ({
      id: row.symbol,
      src: row.image ?? '',
      alt: row.name ?? undefined,
      date: row.launchDatetime ?? ``,
      featured: !!row.featured,
      tokenimage: row.tokenimage ?? null,
    }))
  return {
    pageParam,
    data,
  }
}
