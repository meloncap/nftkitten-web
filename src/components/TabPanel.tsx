import Link from 'next/link'
import { ComponentType } from 'react'
import classNames from 'classnames'

type Tab = {
  url: string
  isActive: boolean
  title: ComponentType
  content: ComponentType
}

export function TabPanel({ tabs }: { tabs: Tab[] }) {
  return (
    <>
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <ul className='flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
          {tabs.map(({ url, isActive, title: Title }, i) => (
            <li className='mr-2' key={i}>
              <Link href={url} passHref>
                <a
                  className={classNames(
                    'group inline-flex p-4 rounded-t-lg border-b-2',
                    {
                      'text-blue-600 dark:text-blue-500 border-blue-600 dark:border-blue-500':
                        isActive,
                      'hover:text-gray-600 dark:hover:text-gray-300 border-transparent hover:border-gray-300':
                        !isActive,
                    }
                  )}
                  aria-current='page'
                >
                  <svg
                    className={classNames('mr-2 w-5 h-5', {
                      'text-blue-600 dark:text-blue-500': isActive,
                      'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300':
                        !isActive,
                    })}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'></path>
                  </svg>
                  <Title />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {tabs
        .filter((t) => t.isActive)
        .map(({ content: Content }, i) => (
          <Content key={i} />
        ))}
    </>
  )
}
