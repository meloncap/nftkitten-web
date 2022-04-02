import { UseInfiniteQueryOptions } from 'react-query'
import { PageInfo } from '../types'

export function queryOption<
  T extends { data: unknown[]; pageParam: number }
>(): UseInfiniteQueryOptions<T> {
  return {
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length > 0) {
        return lastPage.pageParam + 1
      }
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage.pageParam > 0) {
        return lastPage.pageParam - 1
      }
    },
    retry: 10,
  }
}

export function queryOptionQL<
  T extends { data: unknown[]; pageParam: PageInfo }
>(): UseInfiniteQueryOptions<T> {
  return {
    getNextPageParam: (lastPage) => {
      if (lastPage.pageParam.hasNextPage) {
        return {
          endCursor: lastPage.pageParam.endCursor,
        }
      }
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage.pageParam.hasPreviousPage) {
        return {
          startCursor: lastPage.pageParam.startCursor,
        }
      }
    },
    retry: 10,
  }
}
