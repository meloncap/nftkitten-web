import type { NextPage } from 'next'
import { RecentTradePanel } from '../../components/RecentTradePanel'
import { useMemo } from 'react'
import { TabPanel } from '../../components/TabPanel'
import { HighVolCollectionPanel } from '../../components/HighVolCollectionPanel'
import { useRouter } from 'next/router'
import { Layout } from '../../components/Layout'

const Home: NextPage = () => {
  const router = useRouter()
  const { tab } = router.query
  const tabs = useMemo(
    () => [
      {
        url: '/',
        isActive: /^home$/.test(`${tab}`),
        title: () => <>Popular NFT</>,
        content: () => <HighVolCollectionPanel />,
      },
      {
        url: '/sol/recenttrade',
        isActive: /^recenttrade$/.test(`${tab}`),
        title: () => <>Recent Trades</>,
        content: () => <RecentTradePanel />,
      },
    ],
    [tab]
  )
  return (
    <Layout
      header={
        <h1 className='m-4 text-3xl dark:text-white md:w-auto'>
          {tabs
            .filter((t) => t.isActive)
            .map(({ title: Title }, i) => (
              <Title key={i} />
            ))}
        </h1>
      }
    >
      <TabPanel tabs={tabs} />
    </Layout>
  )
}

export default Home
