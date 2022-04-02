import {
  MECollection,
  MECollectionStats,
  PageInfo,
  PagingResultQL,
} from '../types'
import { useMyStore } from '../hooks/useMyStore'
import { formatSol } from '../utils/numberFormatter'
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
  const openSeaApiBaseUrl = useMyStore.getState().openSeaApiBaseUrl
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
    `${openSeaApiBaseUrl}beta1/relay`,
    gql`
    query RankingsPageQuery(
      $chain: [ChainScalar!]
      $count: Int!
      $cursor: String
      $sortBy: CollectionSort
      $parents: [CollectionSlug!]
      $createdAfter: DateTime
    ) {
      ...RankingsPage_data
    }
    
    fragment PaymentAssetLogo_data on PaymentAssetType {
      symbol
      asset {
        imageUrl
        id
      }
    }
    
    fragment RankingsPage_data on Query {
      rankings(after: $cursor, chains: $chain, first: $count, sortBy: $sortBy, parents: $parents, createdAfter: $createdAfter) {
        edges {
          node {
            createdDate
            name
            slug
            logo
            isVerified
            nativePaymentAsset {
              ...PaymentAssetLogo_data
              id
            }
            statsV2 {
              floorPrice {
                unit
                eth
              }
              numOwners
              totalSupply
              sevenDayChange
              sevenDayVolume {
                unit
              }
              oneDayChange
              oneDayVolume {
                unit
              }
              thirtyDayChange
              thirtyDayVolume {
                unit
              }
              totalVolume {
                unit
              }
            }
            id
            __typename
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    `,
    pageParam.endCursor
      ? {
          chain: null,
          count: 100,
          cursor: pageParam.endCursor,
          sortBy: 'SEVEN_DAY_VOLUME',
          parents: ['art'],
          createdAfter: null,
        }
      : {
          chain: null,
          count: 100,
          cursor: null,
          sortBy: 'SEVEN_DAY_VOLUME',
          parents: ['art'],
          createdAfter: null,
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

/*
fetch("https://api.opensea.io/graphql/", {
  "headers": {
    "accept": "*"+"/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
    "x-build-id": "Z1alX8YiZQa_4dYsBandy",
    "x-signed-query": "68a9ee13e282478180ad3d72fc295ebe41c5c449f0621e2ab51a7c43fd811fde"
  },
  "referrer": "https://opensea.io/",
  "referrerPolicy": "strict-origin",
  "body": "{\"id\":\"AssetSearchQuery\",\"query\":\"query AssetSearchQuery(\\n  $categories: [CollectionSlug!]\\n  $chains: [ChainScalar!]\\n  $collection: CollectionSlug\\n  $collectionQuery: String\\n  $collectionSortBy: CollectionSort\\n  $collections: [CollectionSlug!]\\n  $count: Int\\n  $cursor: String\\n  $identity: IdentityInputType\\n  $includeHiddenCollections: Boolean\\n  $numericTraits: [TraitRangeType!]\\n  $paymentAssets: [PaymentAssetSymbol!]\\n  $priceFilter: PriceFilterType\\n  $query: String\\n  $resultModel: SearchResultModel\\n  $showContextMenu: Boolean = false\\n  $shouldShowQuantity: Boolean = false\\n  $sortAscending: Boolean\\n  $sortBy: SearchSortBy\\n  $stringTraits: [TraitInputType!]\\n  $toggles: [SearchToggle!]\\n  $creator: IdentityInputType\\n  $assetOwner: IdentityInputType\\n  $isPrivate: Boolean\\n  $safelistRequestStatuses: [SafelistRequestStatus!]\\n) {\\n  query {\\n    ...AssetSearch_data_2hBjZ1\\n  }\\n}\\n\\nfragment AssetCardAnnotations_assetBundle on AssetBundleType {\\n  assetCount\\n}\\n\\nfragment AssetCardAnnotations_asset_3Aax2O on AssetType {\\n  assetContract {\\n    chain\\n    id\\n  }\\n  decimals\\n  ownedQuantity(identity: $identity) @include(if: $shouldShowQuantity)\\n  relayId\\n  favoritesCount\\n  isDelisted\\n  isFavorite\\n  isFrozen\\n  hasUnlockableContent\\n  ...AssetCardBuyNow_data\\n  orderData {\\n    bestAsk {\\n      orderType\\n      relayId\\n      maker {\\n        address\\n        id\\n      }\\n    }\\n  }\\n  ...AssetContextMenu_data_3z4lq0 @include(if: $showContextMenu)\\n}\\n\\nfragment AssetCardBuyNow_data on AssetType {\\n  tokenId\\n  relayId\\n  assetContract {\\n    address\\n    chain\\n    id\\n  }\\n  collection {\\n    slug\\n    id\\n  }\\n  orderData {\\n    bestAsk {\\n      relayId\\n      decimals\\n      paymentAssetQuantity {\\n        asset {\\n          usdSpotPrice\\n          decimals\\n          id\\n        }\\n        quantity\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment AssetCardContent_asset on AssetType {\\n  relayId\\n  name\\n  ...AssetMedia_asset\\n  assetContract {\\n    address\\n    chain\\n    openseaVersion\\n    id\\n  }\\n  tokenId\\n  collection {\\n    slug\\n    id\\n  }\\n  isDelisted\\n}\\n\\nfragment AssetCardContent_assetBundle on AssetBundleType {\\n  assetQuantities(first: 18) {\\n    edges {\\n      node {\\n        asset {\\n          relayId\\n          ...AssetMedia_asset\\n          id\\n        }\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment AssetCardFooter_assetBundle on AssetBundleType {\\n  ...AssetCardAnnotations_assetBundle\\n  name\\n  assetCount\\n  assetQuantities(first: 18) {\\n    edges {\\n      node {\\n        asset {\\n          collection {\\n            name\\n            relayId\\n            slug\\n            isVerified\\n            ...collection_url\\n            id\\n          }\\n          id\\n        }\\n        id\\n      }\\n    }\\n  }\\n  assetEventData {\\n    lastSale {\\n      unitPriceQuantity {\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n  orderData {\\n    bestBid {\\n      orderType\\n      paymentAssetQuantity {\\n        quantity\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n    bestAsk {\\n      maker {\\n        address\\n        id\\n      }\\n      closedAt\\n      orderType\\n      dutchAuctionFinalPrice\\n      openedAt\\n      priceFnEndedAt\\n      quantity\\n      decimals\\n      paymentAssetQuantity {\\n        quantity\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment AssetCardFooter_asset_3Aax2O on AssetType {\\n  ...AssetCardAnnotations_asset_3Aax2O\\n  name\\n  tokenId\\n  collection {\\n    slug\\n    name\\n    isVerified\\n    ...collection_url\\n    id\\n  }\\n  isDelisted\\n  assetContract {\\n    address\\n    chain\\n    openseaVersion\\n    id\\n  }\\n  assetEventData {\\n    lastSale {\\n      unitPriceQuantity {\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n  orderData {\\n    bestBid {\\n      orderType\\n      paymentAssetQuantity {\\n        quantity\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n    bestAsk {\\n      maker {\\n        address\\n        id\\n      }\\n      closedAt\\n      orderType\\n      dutchAuctionFinalPrice\\n      openedAt\\n      priceFnEndedAt\\n      quantity\\n      decimals\\n      paymentAssetQuantity {\\n        quantity\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment AssetContextMenu_data_3z4lq0 on AssetType {\\n  ...asset_edit_url\\n  ...asset_url\\n  ...itemEvents_data\\n  relayId\\n  isDelisted\\n  isEditable {\\n    value\\n    reason\\n  }\\n  isListable\\n  ownership(identity: {}) {\\n    isPrivate\\n    quantity\\n  }\\n  creator {\\n    address\\n    id\\n  }\\n  collection {\\n    isAuthorizedEditor\\n    id\\n  }\\n  imageUrl\\n  ownedQuantity(identity: {})\\n}\\n\\nfragment AssetMedia_asset on AssetType {\\n  animationUrl\\n  backgroundColor\\n  collection {\\n    displayData {\\n      cardDisplayStyle\\n    }\\n    id\\n  }\\n  isDelisted\\n  imageUrl\\n  displayImageUrl\\n}\\n\\nfragment AssetQuantity_data on AssetQuantityType {\\n  asset {\\n    ...Price_data\\n    id\\n  }\\n  quantity\\n}\\n\\nfragment AssetSearchFilter_data_3KTzFc on Query {\\n  ...CollectionFilter_data_2qccfC\\n  collection(collection: $collection) {\\n    numericTraits {\\n      key\\n      value {\\n        max\\n        min\\n      }\\n      ...NumericTraitFilter_data\\n    }\\n    stringTraits {\\n      key\\n      ...StringTraitFilter_data\\n    }\\n    defaultChain {\\n      identifier\\n    }\\n    id\\n  }\\n  ...PaymentFilter_data_2YoIWt\\n}\\n\\nfragment AssetSearchList_data_3Aax2O on SearchResultType {\\n  asset {\\n    assetContract {\\n      address\\n      chain\\n      id\\n    }\\n    collection {\\n      isVerified\\n      relayId\\n      id\\n    }\\n    relayId\\n    tokenId\\n    ...AssetSelectionItem_data\\n    ...asset_url\\n    id\\n  }\\n  assetBundle {\\n    relayId\\n    id\\n  }\\n  ...Asset_data_3Aax2O\\n}\\n\\nfragment AssetSearch_data_2hBjZ1 on Query {\\n  ...AssetSearchFilter_data_3KTzFc\\n  ...SearchPills_data_2Kg4Sq\\n  search(after: $cursor, chains: $chains, categories: $categories, collections: $collections, first: $count, identity: $identity, numericTraits: $numericTraits, paymentAssets: $paymentAssets, priceFilter: $priceFilter, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, creator: $creator, isPrivate: $isPrivate, safelistRequestStatuses: $safelistRequestStatuses) {\\n    edges {\\n      node {\\n        ...AssetSearchList_data_3Aax2O\\n        __typename\\n      }\\n      cursor\\n    }\\n    totalCount\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n}\\n\\nfragment AssetSelectionItem_data on AssetType {\\n  backgroundColor\\n  collection {\\n    displayData {\\n      cardDisplayStyle\\n    }\\n    imageUrl\\n    id\\n  }\\n  imageUrl\\n  name\\n  relayId\\n}\\n\\nfragment Asset_data_3Aax2O on SearchResultType {\\n  asset {\\n    relayId\\n    isDelisted\\n    ...AssetCardContent_asset\\n    ...AssetCardFooter_asset_3Aax2O\\n    ...AssetMedia_asset\\n    ...asset_url\\n    ...itemEvents_data\\n    orderData {\\n      bestAsk {\\n        paymentAssetQuantity {\\n          quantityInEth\\n          id\\n        }\\n      }\\n    }\\n    id\\n  }\\n  assetBundle {\\n    relayId\\n    ...bundle_url\\n    ...AssetCardContent_assetBundle\\n    ...AssetCardFooter_assetBundle\\n    orderData {\\n      bestAsk {\\n        paymentAssetQuantity {\\n          quantityInEth\\n          id\\n        }\\n      }\\n    }\\n    id\\n  }\\n}\\n\\nfragment CollectionFilter_data_2qccfC on Query {\\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\\n    edges {\\n      node {\\n        assetCount\\n        imageUrl\\n        name\\n        slug\\n        isVerified\\n        id\\n      }\\n    }\\n  }\\n  collections(assetOwner: $assetOwner, assetCreator: $creator, onlyPrivateAssets: $isPrivate, chains: $chains, first: 100, includeHidden: $includeHiddenCollections, parents: $categories, query: $collectionQuery, sortBy: $collectionSortBy) {\\n    edges {\\n      node {\\n        assetCount\\n        imageUrl\\n        name\\n        slug\\n        isVerified\\n        id\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n}\\n\\nfragment CollectionModalContent_data on CollectionType {\\n  description\\n  imageUrl\\n  name\\n  slug\\n}\\n\\nfragment NumericTraitFilter_data on NumericTraitTypePair {\\n  key\\n  value {\\n    max\\n    min\\n  }\\n}\\n\\nfragment PaymentFilter_data_2YoIWt on Query {\\n  paymentAssets(first: 10) {\\n    edges {\\n      node {\\n        symbol\\n        relayId\\n        id\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n  PaymentFilter_collection: collection(collection: $collection) {\\n    paymentAssets {\\n      symbol\\n      relayId\\n      id\\n    }\\n    id\\n  }\\n}\\n\\nfragment Price_data on AssetType {\\n  decimals\\n  imageUrl\\n  symbol\\n  usdSpotPrice\\n  assetContract {\\n    blockExplorerLink\\n    chain\\n    id\\n  }\\n}\\n\\nfragment SearchPills_data_2Kg4Sq on Query {\\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\\n    edges {\\n      node {\\n        imageUrl\\n        name\\n        slug\\n        ...CollectionModalContent_data\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment StringTraitFilter_data on StringTraitType {\\n  counts {\\n    count\\n    value\\n  }\\n  key\\n}\\n\\nfragment asset_edit_url on AssetType {\\n  assetContract {\\n    address\\n    chain\\n    id\\n  }\\n  tokenId\\n  collection {\\n    slug\\n    id\\n  }\\n}\\n\\nfragment asset_url on AssetType {\\n  assetContract {\\n    address\\n    chain\\n    id\\n  }\\n  tokenId\\n}\\n\\nfragment bundle_url on AssetBundleType {\\n  slug\\n}\\n\\nfragment collection_url on CollectionType {\\n  slug\\n}\\n\\nfragment itemEvents_data on AssetType {\\n  assetContract {\\n    address\\n    chain\\n    id\\n  }\\n  tokenId\\n}\\n\",\"variables\":{\"categories\":null,\"chains\":null,\"collection\":\"boredapeyachtclub\",\"collectionQuery\":null,\"collectionSortBy\":\"SEVEN_DAY_VOLUME\",\"collections\":[\"boredapeyachtclub\"],\"count\":32,\"cursor\":null,\"identity\":null,\"includeHiddenCollections\":null,\"numericTraits\":null,\"paymentAssets\":null,\"priceFilter\":null,\"query\":\"\",\"resultModel\":null,\"showContextMenu\":true,\"shouldShowQuantity\":false,\"sortAscending\":true,\"sortBy\":\"PRICE\",\"stringTraits\":null,\"toggles\":null,\"creator\":null,\"assetOwner\":null,\"isPrivate\":null,\"safelistRequestStatuses\":null}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
*/
