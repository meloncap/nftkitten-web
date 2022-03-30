import type { NextPage } from 'next'
import { MeCollectionGrid } from '../../features/MeCollectionGrid'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { MeLaunchpadGrid } from '../../features/MeLaunchpadGrid'
import { GridLayout } from '../../features/GridLayout'
import { TabPanel } from '../../components/TabPanel'

const MagicEden: NextPage = () => {
  const router = useRouter()
  const { tab } = router.query
  const tabs = useMemo(
    () => [
      {
        url: '/magiceden/launchpad',
        isActive: /^launchpad$/i.test(`${tab}`),
        title: () => <>Launchpad</>,
        content: () => <MeLaunchpadGrid />,
      },
      {
        url: '/magiceden/collection',
        isActive: /^collection$/i.test(`${tab}`),
        title: () => <>Collection</>,
        content: () => <MeCollectionGrid />,
      },
    ],
    [tab]
  )
  return (
    <GridLayout
      header={
        <h1 className='m-0 text-3xl text-center dark:text-white sm:m-4 sm:text-left md:w-auto'>
          <a href='https://www.magiceden.io' target='_blank' rel='noreferrer'>
            MagicEden.io
          </a>{' '}
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

export default MagicEden
