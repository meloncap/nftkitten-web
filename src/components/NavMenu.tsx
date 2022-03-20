import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { FC } from 'react'
import useScrollPosition from '../hooks/useScrollPosition'

export const NavMenu: FC = () => {
  const [_scrollY, _scrollHeight, _clientHeight, delta] = useScrollPosition()
  const anchorWallet = useAnchorWallet()
  return (
    <nav className='border-stone-800 px-2 sm:px-4 py-2.5 dark:bg-gray-800 border-2'>
      <div className='container flex flex-wrap justify-between items-center mx-auto'>
        <a href='#' className='flex items-center'>
          <img
            src='/meow.webp'
            className='mr-3 h-6 sm:h-10 rounded'
            alt='NFTKitten.io'
          />
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            NFTKitten.io
          </span>
        </a>
        <div className='w-full block w-auto' id='mobile-menu'>
          <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
            <li>
              <WalletMultiButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
