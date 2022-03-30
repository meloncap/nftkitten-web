import { UseInfiniteQueryOptions } from 'react-query'

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
