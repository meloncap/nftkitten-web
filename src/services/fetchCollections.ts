import { MECollectionPayload, MECollectionsResult } from '../global'
import { PAGE_LIMIT } from '../constants'
import useMyStore from '../hooks/useMyStore'

const fetchCollections = async ({
  pageParam = 0,
}): Promise<MECollectionsResult> => {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  me_collection(offset: ${pageParam * PAGE_LIMIT}, limit: ${PAGE_LIMIT}) {
    data
  }
}
`,
    }),
  })
  if (res.ok) {
    const result: MECollectionPayload = await res.json()
    if (!result.data) {
      throw JSON.stringify(result)
    }
    const data = result.data.me_collection.map((c) => c.data)
    return {
      pageParam,
      data,
    }
  }
  throw JSON.stringify(res)
}
export default fetchCollections
