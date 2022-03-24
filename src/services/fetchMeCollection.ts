import { MECollection, MECollectionStats, PagingResult } from '../global'
import { ME_PAGE_LIMIT } from '../constants'
import { useMyStore } from '../hooks/useMyStore'

export async function fetchMeCollection({
  pageParam = 0,
}): Promise<PagingResult<{ data: MECollection, stats: MECollectionStats }>> {
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
  if (res.ok) {
    const result: {
      data: {
        me_collection: { data: MECollection; stats: MECollectionStats }[]
      }
    } = await res.json()
    if (!result) {
      throw JSON.stringify(result)
    }
    const data = result.data.me_collection
    return {
      pageParam,
      data,
    }
  }
  throw JSON.stringify(res)
}
