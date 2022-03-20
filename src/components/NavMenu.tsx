// import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { FC } from 'react'
import Image from 'next/image'

export const NavMenu: FC = () => {
  // const anchorWallet = useAnchorWallet()
  return (
    <nav className='px-2 border-2 border-stone-800 sm:px-4 py-2.5 dark:bg-gray-800'>
      <div className='container flex flex-wrap items-center justify-between mx-auto'>
        <a href='#' className='flex items-center'>
          <Image
            src='/meow.webp'
            className='h-6 mr-3 rounded sm:h-10'
            alt='NFTKitten.io'
            width={40}
            height={40}
          />
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            NFTKitten.io
          </span>
        </a>
        <div className='block w-auto' id='mobile-menu'>
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
