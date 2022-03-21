/* eslint-disable no-console */
import { useState } from 'react'

function getStorageValue(key: string, defaultValue: unknown | undefined) {
  // getting stored value
  if (typeof localStorage === 'undefined') return defaultValue
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : defaultValue
}

const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState(getStorageValue(key, defaultValue))
  function setStorageValue(newValue: T) {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
        setValue(newValue)
      } catch (ex) {
        console.error(ex)
      }
    }
  }
  return [value, setStorageValue]
}
export default useLocalStorage
