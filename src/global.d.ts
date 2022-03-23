export type RenderingRows<T> = {
  ids: { [symbol: string]: number }
  rows: T[]
}

export type CollectionData = {
  name: string | null
  image: string | null
  symbol: string | null
  discord: string | null
  twitter: string | null
  categories: string[]
  description: string | null
}
export type CollectionActivityData = {
  slot: number
  type: string | null
  buyer: string | null
  price: number
  seller: string | null
  source: string | null
  blockTime: number
  signature: string | null
  tokenMint: string | null
  collection: string | null
  buyerReferral: string | null
  sellerReferral: string | null
}
export type CollectionListingData = {
  price: number
  seller: string
  tokenMint: string
  tokenSize: number
  pdaAddress: string
  auctionHouse: string
  tokenAddress: string
}
export type CollectionStatData = {
  symbol: string | null
  volumeAll: number
  floorPrice: number
  listedCount: number
  avgPrice24hr: number
}

export type METokenAttribute = {
  trait_type: string | null
  value: string | null
}

export type METokenProperty = {
  files: METokenFile[]
  category: string | null
  creators: METokenCreator[]
}

export type METokenFile = {
  uri: string
  type: string
}

export type METokenCreator = {
  address: string | null
  share: number | null
}

export type MECollection = {
  symbol: string
  name: string | null
  description: string | null
  image: string | null
  twitter: string | null
  discord: string | null
  website: string | null
  categories: [string]
}

export type MECollectionActivity = {
  signature: string
  type: string | null
  source: string | null
  tokenMint: string | null
  collection: string | null
  slot: number | null
  blockTime: number | null
  buyer: string | null
  buyerReferral: string | null
  seller: string | null
  sellerReferral: string | null
  price: number | null
}

export type METokenActivity = {
  signature: string
  type: string | null
  source: string | null
  tokenMint: string | null
  collectionSymbol: string | null
  slot: number | null
  blockTime: number | null
  buyer: string | null
  buyerReferral: string | null
  seller: string | null
  sellerReferral: string | null
  price: number | null
}

export type METoken = {
  mintAddress: string
  owner: string | null
  supply: number | null
  collection: string | null
  name: string | null
  updateAuthority: string | null
  primarySaleHappened: number | null
  sellerFeeBasisPoints: number | null
  image: string | null
  animationUrl: string | null
  externalUrl: string | null
  attributes: METokenAttribute[]
  properties: METokenProperty | null
}

export type MEOffer = {
  pdaAddress: string
  tokenMint: string | null
  auctionHouse: string | null
  buyer: string | null
  price: number | null
  tokenSize: number | null
  expiry: number | null
}

export type MEEscrowBalance = {
  buyerEscrow: string | null
  balance: number | null
}

export type MEListing = {
  pdaAddress: string
  auctionHouse: string | null
  tokenAddress: string | null
  tokenMint: string | null
  seller: string | null
  tokenSize: number | null
  price: number | null
}

export type MELaunchpad = {
  symbol: string
  name: string | null
  description: string | null
  featured: Boolean
  edition: string | null
  image: string | null
  price: number | null
  size: number | null
  launchDatetime: string | null
}

export type MECollectionStats = {
  symbol: string
  floorPrice: number
  listedCount: number
  volumeAll: number
}

export type MEErrors = {
  errors: MEError[]
}
export type MEError = {
  extensions: {
    internal: {
      error: string
      response: {
        status: number
        body: {
          errors: Array<{
            location: string
            value: string
            msg: string
            param: string
          }>
        }
        headers: Array<{
          value: string
          name: string
        }>
      }
      request: {
        body: {
          request_query: string
          session_variables: {
            [key: string]: string
          }
          input: {
            offset: number
            limit: number
          }
          action: {
            name: string
          }
        }
        transformed_request: {
          query_string: string
          body: string
          url: string
          headers: Array<[string, string]>
          method: string
          response_timeout: string
        }
        url: string
        headers: unknown[]
      }
    }
    path: string
    code: string
  }
  message: string
}

export type PagingResult<T> = {
  pageParam: number
  data: T[]
}

export type MECollectionPayload = {
  data: {
    me_collection: Array<{
      data: MECollection
    }>
  }
}

export type SolscanToken = {
  info: {
    _id: string
    key: number
    updateAuthority: string
    mint: string
    data: {
      name: string
      symbol: string
      uri: string
      sellerFeeBasisPoints: number
      creators: Array<{
        address: string
        verified: number
        share: number
      }>
      id: number
    }
    primarySaleHappened: number
    isMutable: number
    mintTx: string
    createdTime: number
    msgsource: string
    collection: string
    collectionId: string
    meta: {
      name: string
      symbol: string
      description: string
      seller_fee_basis_points: number
      image: string
      external_url: string
      edition: number
      attributes: Array<{
        trait_type: string
        value: string
      }>
      collection: {
        name: string
        family: string
      }
      properties: {
        files: Array<{
          type: string
          uri: string
        }>
        category: string
        creators: Array<{
          address: string
          share: number
        }>
      }
    }
    family: string
  }
  trade: {
    tradeCount: number
    tradeTime: number
    price: number
    dex: string
    signature: string
  }
}

export type SolscanMarket = {
  priceUsdt: number
  volumeUsdt: number
}

export type SolscanPayload<T> = {
  data: T
  success: boolean
}

export type SolscanSearch = {
  collection: Array<{
    _id: string
    collectionId: string
    attributes: Array<{
      trait_type: string
      value: string
    }>
    avatar: string
    collection: string
    creators: Array<{
      address: string
      verified: number
      share: number
    }>
    family?: string
  }>
  nft: any | null
}

export type SolscanCollection = {
  success: boolean
  data: {
    _id: string
    collectionId: string
    avatar: string
    collection: string
    createdTime: number
    creators: Array<{
      address: string
      verified: number
      share: number
    }>
    family: string
  }
  dex: string[]
  totalItems: number
  volume: number
  floorPrice: number
  lastTrade: Array<{
    _id: string
    mint: string
    name: string
    symbol: string
    buyer: string
    seller: string
    price: number
    collection: string
    collectionId: string
    tradeTime: number
    dex: string
    signature: string
    family: string
    image: string
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }>
  totalAttributes: number
}
