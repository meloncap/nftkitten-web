import { MELaunchpad, PagingResult } from '../global'
import { ME_PAGE_LIMIT } from '../constants'
import { useMyStore } from '../hooks/useMyStore'

export type fetchMeLaunchpadResult = {
  id: string
  src: string
  alt: string | undefined
  date: string
  featured: boolean
  tokenimage: string | null
}

export async function fetchMeLaunchpad({
  pageParam = 0,
}): Promise<PagingResult<fetchMeLaunchpadResult>> {
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
