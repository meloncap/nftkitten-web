import { MECollection, PagingResult } from '../global'
import { ME_PAGE_LIMIT } from '../constants'
import { useMyStore } from '../hooks/useMyStore'

export async function fetchMeCollection({
  pageParam = 0,
}): Promise<PagingResult<MECollection>> {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  meCollections(offset: ${pageParam * ME_PAGE_LIMIT}, limit: ${ME_PAGE_LIMIT}) {
    symbol
    description
    image
    name
    twitter
    website
    discord
    categories
  }
}
`,
    }),
  })
  if (res.ok) {
    const result: { data: { meCollections: MECollection[] } } = await res.json()
    if (!result) {
      throw JSON.stringify(result)
    }
    const data = result.data.meCollections
    return {
      pageParam,
      data,
    }
  }
  throw JSON.stringify(res)
}
