import { useCallback, useState, MouseEvent } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMoralis } from 'react-moralis'

export const NavMenu = () => {
  const router = useRouter()
  const [hiddenMenu, setHiddenMenu] = useState(true)

  const getMenuStyle = useCallback(
    (regex: RegExp) => {
      return regex.test(router.pathname)
        ? 'block py-2 pr-4 pl-3 text-white dark:text-white bg-blue-700 rounded md:p-0 md:text-blue-700 md:bg-transparent'
        : 'block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 md:p-0 md:hover:text-blue-700 md:dark:hover:text-white md:hover:bg-transparent md:dark:hover:bg-transparent md:border-0'
    },
    [router.pathname]
  )
  const handleToggleMenu = useCallback(
    () => setHiddenMenu(!hiddenMenu),
    [hiddenMenu]
  )
  const { authenticate, isAuthenticated, isAuthenticating, logout } =
    useMoralis()
  const handleLogin = useCallback(
    (type?: 'sol' | undefined) => async (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault()
      if (!isAuthenticated) {
        await authenticate({ signingMessage: 'Log in NFTKitten', type })
          .then(function (user) {
            if (!user) return
            // eslint-disable-next-line no-console
            console.log('logged in user:', user)
            // eslint-disable-next-line no-console
            console.log(user.get('ethAddress'))
          })
          .catch(function (error) {
            // eslint-disable-next-line no-console
            console.error(error)
          })
      }
    },
    [authenticate, isAuthenticated]
  )

  const handleLogout = useCallback(
    async (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault()
      await logout()
      // eslint-disable-next-line no-console
      console.log('logged out')
    },
    [logout]
  )

  return (
    <nav className='py-2.5 px-2 bg-slate-300 dark:bg-gray-800 rounded border-gray-200 sm:px-4'>
      <div className='flex flex-wrap justify-between items-center mx-auto'>
        <Link href='/' passHref>
          <a className='flex items-center'>
            <Image
              src='/img/meow.webp'
              className='mr-3 h-6 rounded sm:h-10'
              alt='NFTKitten.io'
              width={40}
              height={40}
            />
            <span className='hidden self-center mr-5 ml-2 text-xl font-semibold dark:text-white whitespace-nowrap sm:inline'>
              NFTKitten.io
            </span>
          </a>
        </Link>
        <div className='flex md:order-2'>
          <button
            type='button'
            className='inline-flex items-center p-2 text-sm rounded-lg focus:outline-none md:hidden'
            aria-controls='mobile-menu-4'
            aria-expanded='false'
            onClick={handleToggleMenu}
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
            <svg
              className={classNames({ hidden: hiddenMenu }, 'w-6 h-6')}
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={classNames(
            { hidden: hiddenMenu },
            'justify-between items-center w-full md:flex md:order-1 md:w-auto md:grow md:justify-end md:mr-4'
          )}
          id='mobile-menu-4'
        >
          <ul className='flex flex-col mt-4 md:flex-row md:mt-0 md:space-x-8 md:text-sm md:font-medium'>
            <li>
              <Link href='/' passHref>
                <a className={getMenuStyle(/^\/$|\/sol($|\/)/i)}>Home</a>
              </Link>
            </li>
            <li>
              <Link href='/magiceden/launchpad' passHref>
                <a className={getMenuStyle(/^\/magiceden\//)}>Magic Eden</a>
              </Link>
            </li>
            <li className={classNames({ hidden: isAuthenticating })}>
              <a
                className='flex py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 md:p-0 md:hover:text-blue-700 md:dark:hover:text-white md:hover:bg-transparent md:dark:hover:bg-transparent md:border-0'
                href='#'
                onClick={handleLogin('sol')}
              >
                <span className='pr-1'>Connect</span>
                <Image alt='Solana' src='/img/sol.svg' width={16} height={16} />
              </a>
            </li>
            <li className={classNames({ hidden: isAuthenticating })}>
              <a
                className='flex py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 md:p-0 md:hover:text-blue-700 md:dark:hover:text-white md:hover:bg-transparent md:dark:hover:bg-transparent md:border-0'
                href='#'
                onClick={handleLogin()}
              >
                <span className='pr-1'>Connect</span>
                <Image
                  alt='Ethereum'
                  src='/img/eth.svg'
                  width={16}
                  height={16}
                />
              </a>
            </li>
            <li className={classNames({ hidden: !isAuthenticating })}>
              <a
                className='block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 md:p-0 md:hover:text-blue-700 md:dark:hover:text-white md:hover:bg-transparent md:dark:hover:bg-transparent md:border-0'
                href='#'
                type='button'
                onClick={handleLogout}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
