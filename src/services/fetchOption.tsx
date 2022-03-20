import { UseInfiniteQueryOptions } from 'react-query';
import { MECollectionsResult } from '../global';

export const fetchOption = (): UseInfiniteQueryOptions<MECollectionsResult> => {
  return {
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length > 0) {
        return lastPage.pageParam + 1;
      }
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage.pageParam > 0) {
        return lastPage.pageParam + 1;
      }
    },
    retry: 10,
  };
};
