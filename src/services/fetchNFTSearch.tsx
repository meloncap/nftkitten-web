import { SolscanPayload, SolscanSearch } from '../global'
import { useMyStore } from '../hooks/useMyStore'

export async function fetchNFTSearch(keyword: string): Promise<SolscanSearch> {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(
    `${solscanBaseUrl}/nft/search?keyword=` + encodeURIComponent(keyword)
  )
  if (res.ok) {
    const result: SolscanPayload<SolscanSearch> = await res.json()
    if (!result.success) {
      throw JSON.stringify(result)
    }
    return result.data
  }
  throw JSON.stringify(res)
}
