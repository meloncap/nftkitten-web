import { useState, useEffect } from 'react'

function getStorageValue(key: string, defaultValue: unknown) {
  // getting stored value
  if (typeof localStorage === 'undefined') return defaultValue
  const saved = localStorage.getItem(key)
  const initial = saved ? JSON.parse(saved) : undefined
  return initial || defaultValue
}

const useLocalStorage = (key: string, defaultValue: unknown) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
export default useLocalStorage
