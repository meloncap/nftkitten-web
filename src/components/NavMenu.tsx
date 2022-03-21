// import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const NavMenu: FC = () => {
  // const anchorWallet = useAnchorWallet()
  return (
    <nav className='py-2.5 px-2 dark:bg-gray-800 border-2 border-stone-800 sm:px-4'>
      <div className='container flex flex-wrap justify-between items-center mx-auto'>
        <a href='#' className='flex items-center'>
          <Image
            src='/meow.webp'
            className='mr-3 h-6 rounded sm:h-10'
            alt='NFTKitten.io'
            width={40}
            height={40}
            unoptimized
          />
          <span className='self-center ml-1 text-xl font-semibold dark:text-white whitespace-nowrap'>
            NFTKitten.io
          </span>
        </a>
        <div className='block w-auto' id='mobile-menu'>
          <ul className='flex flex-col mt-4 md:flex-row md:mt-0 md:space-x-8 md:text-sm md:font-medium'>
            <li className='flex justify-center items-center'>
              <Link href='/'>Home</Link>
            </li>
            <li className='flex justify-center items-center'>
              <Link href='/magiceden'>Magic Eden</Link>
            </li>
            <li>
              <WalletMultiButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
