import { SolscanPayload, SolscanSearch } from '../global'
import { useMyStore } from '../hooks/useMyStore'

export type fetchNFTSearchResult = {
  [family: string]: Array<SolscanSearch['collection'][0]>
}

export async function fetchNFTSearch(
  keyword: string
): Promise<fetchNFTSearchResult> {
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
        if (i.family && i.family in g) {
          g[i.family].push(i)
        } else {
          g[i.family ?? ``] = [i]
        }
        return g
      },
      {}
    )
  }
  return {}
}
