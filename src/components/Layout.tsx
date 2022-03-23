import { PropsWithChildren, ReactNode } from 'react'
import { GlobalHead } from './GlobalHead'
import { NavMenu } from './NavMenu'
import { SearchBox } from './SearchBox'
import { SolanaStatsBar } from './SolanaStatsBar'

export function Layout({
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
