# NFTKitten.io

## Motivate

When I first heard of NFT, I looked into the details. I wasn't a big fan. Because I thought it was just some metadata on a smart contract linked to some AWS website! I was thinking what if the AWS owner stopped paying for the service, wouldn't that NFT became a 404 page?

Then I saw the evolution of the NFT, people start using IPFS, arweave instead of AWS. more utilities are being added for NFT.

NFT brings crypto into the mainstream, even celebrities. people who used to think crypto was a SCAM, start to pay more attention to NFT, they want to learn more about it, youtuber start asking how to create NFT. NFT changed their perspective of crypto. And since NFT is just a smart contract, there are unlimited possibilities in the future.

Content creator can finally get what they deserve, their contents are free to download as it always has been, at the same time they get paid directly for their creation without a third party.

I want to learn more about NFT that's why I create this with all the free services I can found. Usually I try to find time to work on this on weekend.

## 2 weeks after create this site

The two blockchains I try to study is Ethereum and Solana.

For Ethereum there 2 standards [ERC-721](https://eips.ethereum.org/EIPS/eip-721) and [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155), for Solana [Metaplex](https://docs.metaplex.com/) is the NFT standard and the URI JSON Schem is compatiable with [ERC-1155 JSON Schema](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema) in order to easily port NFTs across different chains using the wormhole bridge.

As I learn more about NFT, I found ERC721/ERC1155 NFTs are mutable by design

> The URI MAY be mutable (i.e. it changes from time to time). We considered an NFT representing ownership of a house, in this case metadata about the house (image, occupants, etc.) can naturally change.

## ERC721 NFTs are mutable by design

As you see the most common use cases we’re seeing nowadays (using NFTs as proof of ownership over pieces of immutable digital art) was probably not the intended use case.

Storing the data on decentralized storage systems like IPFS, or in the smart contract itself stored as base64 encoded JSONs is probably just a hack to work around this design flaw.

## ERC1155 NFTs are mutable by design

> The URI value allows for ID substitution by clients. If the string {id} exists in any URI, clients MUST replace this with the actual token ID in hexadecimal form. This allows for a large number of tokens to use the same on-chain string by defining a URI once, for that large number of tokens.

ERC721s can potentially have a different URI for every token, but ERC1155 tries to unify all tokens in the same smart contract by introducing the comcept of URI “template”.

Now, this is a big problem for immutability.

It is a big problem because it forces centralized storage.

We can’t use decentralized storage like IPFS, because the URIs in IPFS are hashes of unique pieces of content and we can’t have completely unique URIs for every token in ERC1155.

We can’t also store the data as a base64 encoded JSON for the same reason.

We’re just left with a URI template and a literal string we must replace in order to get the actual NFT metadata.

Which means, in my understanding, that ERC1155s are just mutable by design, and can’t be turned into immutable NFTs.

## Solana Metaplex Standard

For Metaplex there is is_mutable flag to indicate whether the NFT is mutable or not.

## Non-standard NFTs

One famous example of non-standard NFTs are Cryptopunks, which arguably inspired the ERC721 specification.

## Problems with mutable NFTs

- Rarity is not determined at mint and metadata is manually assignable after minting, Rarity is not permanent
- The tokenURI might just change over time
- CORS and data innacesibility
- [Service-dependent rendering](https://moxie.org/2022/01/07/web3-first-impressions.html)

## Problems with IPFS

- IPFS can turn into regular centralized storage, in practice
- IPFS is not permanent: content hash addressing does not imply persistence. Someone needs to pay the bills
- The need for a centralized gateway

## Problems with arweave

- I don't know yet

## to be continue

Right now I trying make use of https://moralis.io/ and https://algolia.com, trynig deploy service to akash.network and see if I can build a mobile in my spare time.
I don't have much artistic sense, but I enjoy video games, I played World of Warcraft for years.
It looks like mutable NFT will make more sense for gaming, I am trying find out how it works.
