import { SolscanPayload, SolscanMarket } from '../global'
import { useMyStore } from '../hooks/useMyStore'

export async function fetchSolStats(): Promise<SolscanMarket> {
  const solscanBaseUrl = useMyStore.getState().solscanApiBaseUrl
  const res = await fetch(`${solscanBaseUrl}/market?symbol=SOL`)
  if (res.ok) {
    const result: SolscanPayload<SolscanMarket> = await res.json()
    if (!result.success) {
      throw JSON.stringify(result)
    }
    return result.data
  }
  throw JSON.stringify(res)
}
