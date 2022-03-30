import { PropsWithChildren, ReactNode } from 'react'
import { GlobalHead } from './GlobalHead'
import { NavMenu } from '../components/NavMenu'
import { SearchBox } from './search/SearchBox'
import { SolanaStatsBar } from '../components/SolanaStatsBar'

export function GridLayout({
  header,
  children,
}: PropsWithChildren<{
  header: ReactNode | ReactNode[]
}>) {
  return (
    <>
      <GlobalHead />
      <SolanaStatsBar />
      <NavMenu />
      <div className='flex flex-col-reverse md:flex-row md:justify-between'>
        {header}
        <SearchBox />
      </div>
      {children}
    </>
  )
}
