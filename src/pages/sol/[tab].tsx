import type { NextPage } from 'next'
import { RecentTradeGrid } from '../../features/RecentTradeGrid'
import { useMemo } from 'react'
import { TabPanel } from '../../components/TabPanel'
import { CollectionGrid } from '../../features/CollectionGrid'
import { useRouter } from 'next/router'
import { GridLayout } from '../../features/GridLayout'

const Home: NextPage = () => {
  const router = useRouter()
  const { tab } = router.query
  const tabs = useMemo(
    () => [
      {
        url: '/',
        isActive: /^home$/.test(`${tab}`),
        title: () => <>Solana NFT</>,
        content: () => <CollectionGrid />,
      },
      {
        url: '/sol/recenttrade',
        isActive: /^recenttrade$/.test(`${tab}`),
        title: () => <>Recent Trades</>,
        content: () => <RecentTradeGrid />,
      },
    ],
    [tab]
  )
  return (
    <GridLayout
      header={
        <h1 className='m-0 text-3xl text-center dark:text-white sm:m-4 sm:text-left md:w-auto'>
          {tabs
            .filter((t) => t.isActive)
            .map(({ title: Title }, i) => (
              <Title key={i} />
            ))}
        </h1>
      }
    >
      <TabPanel tabs={tabs} />
    </GridLayout>
  )
}

export default Home
