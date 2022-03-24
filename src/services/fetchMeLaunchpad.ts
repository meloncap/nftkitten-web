import { MELaunchpad, PagingResult } from '../global'
import { ME_PAGE_LIMIT } from '../constants'
import { useMyStore } from '../hooks/useMyStore'

export async function fetchMeLaunchpad({
  pageParam = 0,
}): Promise<PagingResult<MELaunchpad>> {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  me_launchpad(offset: ${pageParam * ME_PAGE_LIMIT}, limit: ${ME_PAGE_LIMIT}) {
    data
  }
}
`,
    }),
  })
  if (res.ok) {
    const result: { data: { me_launchpad: { data: MELaunchpad }[] } } = await res.json()
    if (!result) {
      throw JSON.stringify(result)
    }
    const data = result.data.me_launchpad.map(l => l.data)
    return {
      pageParam,
      data,
    }
  }
  throw JSON.stringify(res)
}
