import { MELaunchpad, PagingResult } from '../global'
import { ME_PAGE_LIMIT } from '../constants'
import { useMyStore } from '../hooks/useMyStore'

export const fetchMeLaunchpad = async ({
  pageParam = 0,
}): Promise<PagingResult<MELaunchpad>> => {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  meLaunchpad(offset: ${pageParam * ME_PAGE_LIMIT}, limit: ${ME_PAGE_LIMIT}) {
    description
    edition
    featured
    image
    launchDatetime
    name
    price
    size
    symbol
  }
}
`,
    }),
  })
  if (res.ok) {
    const result: { data: { meLaunchpad: MELaunchpad[] } } = await res.json()
    if (!result) {
      throw JSON.stringify(result)
    }
    const data = result.data.meLaunchpad
    return {
      pageParam,
      data,
    }
  }
  throw JSON.stringify(res)
}
