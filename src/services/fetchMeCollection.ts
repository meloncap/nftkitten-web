import { MECollection, MECollectionStats, PagingResult } from '../global'
import { ME_PAGE_LIMIT } from '../constants'
import { useMyStore } from '../hooks/useMyStore'
import { formatSol } from './numberFormatter'

export type fetchMeCollectionResult = {
  id: string
  src: string
  alt: string | undefined
  sol: number
  solFormatted: string
  count: number
}

export async function fetchMeCollection({
  pageParam = 0,
}): Promise<PagingResult<fetchMeCollectionResult>> {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  me_collection(offset: ${pageParam * ME_PAGE_LIMIT}, limit: ${ME_PAGE_LIMIT}) {
    data
    stats
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
      me_collection: Array<{ data: MECollection; stats: MECollectionStats | null }>
    }
  } = await res.json()
  if (!result?.data?.me_collection) {
    throw JSON.stringify(result)
  }
  const data = result.data.me_collection.map(({ data, stats }) => ({
    id: stats?.symbol,
    src: data.image ?? '',
    alt: data.name ?? undefined,
    sol: stats?.floorPrice ?? 0,
    solFormatted: formatSol(stats?.floorPrice),
    count: stats?.listedCount ?? 0,
    volumeAll: stats?.volumeAll,
  }))
  return {
    pageParam,
    data,
  }
}
