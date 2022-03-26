import styles from '../styles/loadingscreen.module.css'

export const LoadingScreen = () => (
  <div
    className={
      'flex fixed inset-0 justify-center items-center w-screen h-screen no-underline pointer-events-none ' +
      styles['loading-screen']
    }
  >
    <p className='font-sans text-xs text-gray-500 dark:text-gray-200'>
      LOADING...
    </p>
    <div className='cursor-default pointer-events-none select-none'>
      <b className='absolute font-sans text-xl text-gray-700 dark:text-white opacity-0'>
        N
      </b>
      <b className='absolute font-sans text-xl text-gray-700 dark:text-white opacity-0'>
        F
      </b>
      <b className='absolute font-sans text-xl text-gray-700 dark:text-white opacity-0'>
        T
      </b>
      <b className='absolute font-sans text-xl text-blue-500 dark:text-blue-300 opacity-0'>
        K
      </b>
      <b className='absolute font-sans text-xl text-blue-500 dark:text-blue-300 opacity-0'>
        i
      </b>
      <b className='absolute font-sans text-xl text-blue-500 dark:text-blue-300 opacity-0'>
        t
      </b>
      <b className='absolute font-sans text-xl text-blue-500 dark:text-blue-300 opacity-0'>
        t
      </b>
      <b className='absolute font-sans text-xl text-blue-500 dark:text-blue-300 opacity-0'>
        e
      </b>
      <b className='absolute font-sans text-xl text-blue-500 dark:text-blue-300 opacity-0'>
        n
      </b>
      <b className='absolute font-sans text-xl text-gray-700 dark:text-white opacity-0'>
        .
      </b>
      <b className='absolute font-sans text-xl text-gray-700 dark:text-white opacity-0'>
        i
      </b>
      <b className='absolute font-sans text-xl text-gray-700 dark:text-white opacity-0'>
        o
      </b>
    </div>
  </div>
)
