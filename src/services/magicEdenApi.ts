import {
  MECollection,
  MECollectionStats,
  MELaunchpad,
  PagingResultQL,
} from '../types'
import { ME_PAGE_LIMIT } from '../contants'
import { useMyStore } from '../hooks/useMyStore'
import { formatSol } from '../utils/numberFormatter'
import { PageInfo } from '../types'
import { request, gql } from 'graphql-request'

export type CollectionApiOutput = {
  id: string
  src: string
  alt: string | undefined
  sol: number
  solFormatted: string
  count: number
  volumeAll: number
  tokenimage: string | null
}

export async function collectionApi({
  pageParam = {},
}: {
  pageParam?: PageInfo
}): Promise<PagingResultQL<CollectionApiOutput>> {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res: {
    me_collection_connection: {
      edges: Array<{ node: MECollection & MECollectionStats }>
      pageInfo: {
        endCursor: string | null
        hasNextPage?: boolean | undefined
        hasPreviousPage?: boolean | undefined
        startCursor: string | null
      }
    }
  } = await request(
    `${apiBaseUrl}beta1/relay`,
    gql`
      query MyQuery($before: String, $first: Int, $after: String, $last: Int)
      @cached {
        me_collection_connection(
          order_by: { id: desc }
          first: $first
          last: $last
          before: $before
          after: $after
        ) {
          edges {
            node {
              symbol: data(path: "$.symbol")
              image: data(path: "$.image")
              name: data(path: "$.name")
              floorPrice: stats(path: "$.floorPrice")
              listedCount: stats(path: "$.listedCount")
              volumeAll: stats(path: "$.volumeAll")
              tokenimage: stats(path: "$.meta.metadata.data.image")
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    `,
    pageParam.endCursor
      ? {
          first: ME_PAGE_LIMIT,
          after: pageParam.endCursor,
        }
      : pageParam.startCursor
      ? {
          last: ME_PAGE_LIMIT,
          before: pageParam.startCursor,
        }
      : {
          first: ME_PAGE_LIMIT,
        }
  )
  const data = res.me_collection_connection.edges
    .map((e) => e.node)
    .sort((a, b) => (b.stats?.volumeAll ?? 0) - (a.stats?.volumeAll ?? 0))
    .map((data) => ({
      id: data.symbol,
      src: data.image ?? '',
      alt: data.name ?? undefined,
      sol: data.floorPrice ?? 0,
      solFormatted: formatSol(data.floorPrice),
      count: data.listedCount ?? 0,
      volumeAll: data.volumeAll,
      tokenimage: data.tokenimage ?? null,
    }))
  return {
    pageParam: res.me_collection_connection.pageInfo,
    data,
  }
}

export type LaunchpadApiOutput = {
  id: string
  src: string
  alt: string | undefined
  date: string
  featured: boolean
  tokenimage: string | null
}

export async function launchpadApi({
  pageParam = {},
}: {
  pageParam?: PageInfo
}): Promise<PagingResultQL<LaunchpadApiOutput>> {
  const apiBaseUrl = useMyStore.getState().apiBaseUrl
  const res: {
    me_launchpad_connection: {
      edges: Array<{ node: MELaunchpad }>
      pageInfo: {
        endCursor: string | null
        hasNextPage?: boolean | undefined
        hasPreviousPage?: boolean | undefined
        startCursor: string | null
      }
    }
  } = await request(
    `${apiBaseUrl}beta1/relay`,
    gql`
      query MyQuery($before: String, $first: Int, $after: String, $last: Int)
      @cached {
        me_launchpad_connection(
          order_by: { id: desc }
          first: $first
          last: $last
          before: $before
          after: $after
        ) {
          edges {
            node {
              symbol: data(path: "$.symbol")
              image: data(path: "$.image")
              name: data(path: "$.name")
              launchDatetime: data(path: "$.launchDatetime")
              featured: data(path: "$.featured")
              tokenimage: stats(path: "$.meta.metadata.data.image")
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    `,
    pageParam.endCursor
      ? {
          first: ME_PAGE_LIMIT,
          after: pageParam.endCursor,
        }
      : pageParam.startCursor
      ? {
          last: ME_PAGE_LIMIT,
          before: pageParam.startCursor,
        }
      : {
          first: ME_PAGE_LIMIT,
        }
  )
  const data = res.me_launchpad_connection.edges
    .map((e) => e.node)
    .filter((row) => row?.image)
    .sort((a, b) =>
      (a.launchDatetime ?? '') < (b.launchDatetime ?? '')
        ? 1
        : (a.launchDatetime ?? '') > (b.launchDatetime ?? '')
        ? -1
        : 0
    )
    .map((row) => ({
      id: row.symbol,
      src: row.image ?? '',
      alt: row.name ?? undefined,
      date: row.launchDatetime ?? ``,
      featured: !!row.featured,
      tokenimage: row.tokenimage ?? null,
    }))
  return {
    pageParam: res.me_launchpad_connection.pageInfo,
    data,
  }
}
