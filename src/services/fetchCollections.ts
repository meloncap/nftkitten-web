import { MECollectionPayload, MECollectionsResult, MEErrors } from '../global'
import { PAGE_LIMIT } from "../constants"
import useStore from '../hooks/useStore'

const fetchCollections = async ({
  pageParam = 0,
}): Promise<MECollectionsResult> => {
  const apiBaseUrl = useStore.getState().apiBaseUrl
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
    const result = await res.json()
    if (result.errors) {
      throw (result as MEErrors).errors[0].message
    }
    const data = (result as MECollectionPayload).data.me_collection.map(
      (c) => c.data
    )
    return {
      pageParam,
      data,
    }
  }
  throw `${res.status} ${res.statusText}`
}
export default fetchCollections