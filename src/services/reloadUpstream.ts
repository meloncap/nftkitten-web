import fetch from 'node-fetch';
import { Client } from 'pg';
import { concatMap, Subject, count, bufferTime, catchError, from, mergeMap, of } from "rxjs";

const ME_API = `https://api-mainnet.magiceden.dev/v2`
const BATCH_SIZE = 500;
const UPSERT_PER_SECOND = 1000;
const QUERY_PER_SECOND = 2;

export const reloadUpstream = async (payload: any) => {
   const force = payload?.force;
   const client = new Client();
   await client.connect();
   const tokenMints: {[tokenMint: string]: 1} = {};
   const walletAddresses: {[wallet: string]: 1} = {};

   const scannedIn24Hours = await queryScanLog(client);
   
   await queryAndUpsertMany('launchpad/collections', 
      getUpsertSql(`launchpad`), v => [(v as any).symbol, v], client);

   const collectionStatSet = await queryIdSet('collection_id', 'collection_stat', client);
   const collectionQueue: Subject<() => Promise<unknown>> = new Subject();
   const collectionQueuePromise = waitForQueries(collectionQueue);
   const collections = await queryAndUpsertMany('collections', 
      getUpsertSql(`collection`), v => [(v as any).symbol, v], client);
   for (let i = collections.length - 1; i >= 0; i--) {
      const v = collections[i];
      const id = (v as any).symbol;
      if (force || !scannedIn24Hours.has(`collection_stat.${id}`) && !collectionStatSet.has(id)) {
         collectionQueue.next(() => queryAndUpsertMany(`collections/${id}/listings`, getUpsertSqlWithParent(`collection`, `listing`),
            v => [id, v, (v as any).pdaAddress], client));
         collectionQueue.next(() => queryAndUpsertMany(`collections/${id}/activities`, getUpsertSqlWithParent(`collection`, `activity`),
            v => [id, v, (v as any).signature], client));
         collectionQueue.next(() => queryAndUpsertOne(`collections/${id}/stats`, getUpsertSql('collection_stat', 'collection_'),
            v => [id, v], client));
      }
   }
   collectionQueue.complete();
   console.log(`collection queue ${await collectionQueuePromise} complete`);

   for (const tokenMint in await queryIdSet("data->'tokenMint'", 'collection_listing', client))
      tokenMints[tokenMint] = 1;
      
   for (const seller in await queryIdSet("data->'seller'", 'collection_listing', client))
      walletAddresses[seller] = 1;

   for (const tokenMint in await queryIdSet("data->'tokenMint'", 'collection_activity', client))
      tokenMints[tokenMint] = 1;

   for (const buyer in await queryIdSet("data->'buyer'", 'collection_activity', client))
      walletAddresses[buyer] = 1;

   for (const mintAddress in await queryIdSet("data->'mintAddress'", 'wallet_token', client))
      tokenMints[mintAddress] = 1;
      
   for (const buyer in await queryIdSet("data->'buyer'", 'wallet_activity', client))
      walletAddresses[buyer] = 1;

   for (const seller in await queryIdSet("data->'seller'", 'wallet_activity', client))
      walletAddresses[seller] = 1;

   for (const tokenMint in await queryIdSet("data->'tokenMint'", 'wallet_offers_made', client))
      tokenMints[tokenMint] = 1;
      
   for (const buyer in await queryIdSet("data->'buyer'", 'wallet_offers_made', client))
      walletAddresses[buyer] = 1;

   for (const tokenMint in await queryIdSet("data->'tokenMint'", 'wallet_offers_received', client))
      tokenMints[tokenMint] = 1;
      
   for (const buyer in await queryIdSet("data->'buyer'", 'wallet_offers_received', client))
      walletAddresses[buyer] = 1;

   const tokenSet = await queryIdSet('id', 'token', client);
   const tokenQueue: Subject<() => Promise<unknown>> = new Subject();
   const tokenQueuePromise = waitForQueries(tokenQueue);
   for (const id in tokenMints) {
      if (force || !scannedIn24Hours.has(`token.${id}`) && !tokenSet.has(id)) {
         tokenQueue.next(() => queryAndUpsertMany(`tokens/${id}`, getUpsertSql(`token`),
            v => [id, v, (v as any).mintAddress], client));
         tokenQueue.next(() => queryAndUpsertMany(`tokens/${id}/listings`, getUpsertSqlWithParent(`token`, `listing`),
            v => [id, v, (v as any).pdaAddress], client, false));
         tokenQueue.next(() => queryAndUpsertMany(`tokens/${id}/offer_received`, getUpsertSqlWithParent(`token`, `offer_received`),
            v => [id, v, (v as any).pdaAddress], client));
         tokenQueue.next(() => queryAndUpsertMany(`tokens/${id}/activities`, getUpsertSqlWithParent(`token`, `activity`),
            v => [id, v, (v as any).signature], client));
      }
   }
   tokenQueue.complete();
   console.log(`collection queue ${await tokenQueuePromise} complete`);

   for (const seller in await queryIdSet("data->'seller'", 'token_listing', client))
      walletAddresses[seller] = 1;
      
   for (const buyer in await queryIdSet("data->'seller'", 'token_offer_received', client))
      walletAddresses[buyer] = 1;
      
   for (const seller in await queryIdSet("data->'seller'", 'token_activity', client))
      walletAddresses[seller] = 1;

   const walletTokenSet = await queryIdSet('wallet_id', 'wallet_token', client);
   const walletQueue: Subject<() => Promise<unknown>> = new Subject();
   const walletQueuePromise = waitForQueries(walletQueue);
   for (const id in walletAddresses) {
      if (force || !scannedIn24Hours.has(`wallet_token.${id}`) && !walletTokenSet.has(id)) {
         walletQueue.next(() => queryAndUpsertMany(`wallets/${id}/tokens`,
            getUpsertSqlWithParent(`wallet`, `token`), v => [id, v, (v as any).pdaAddress], client));
         walletQueue.next(() => queryAndUpsertMany(`wallets/${id}/activities`,
            getUpsertSqlWithParent(`wallet`, `activity`), v => [id, v, (v as any).signature], client));
         walletQueue.next(() => queryAndUpsertMany(`wallets/${id}/offers_made`,
            getUpsertSqlWithParent(`wallet`, `offers_made`), v => [id, v, (v as any).pdaAddress], client));
         walletQueue.next(() => queryAndUpsertMany(`wallets/${id}/offers_received`,
            getUpsertSqlWithParent(`wallet`, `offers_received`), v => [id, v, (v as any).pdaAddress], client));
         walletQueue.next((() => queryAndUpsertOne(`wallets/${id}/escrow_balance`,
            getUpsertSql('wallet_escrow_balance', 'wallet_'), v => [id, v], client)));
      }
   }
   walletQueue.complete();
   console.log(`collection queue ${await walletQueuePromise} complete`);

   await client.end();
   console.log(`records upserted.`);

};

const getUpsertSql = (obj: string, id_prefix: string = '') => {
   return [`INSERT INTO me_${obj}(${id_prefix}id,data)VALUES($1::text,$2)
ON CONFLICT(${id_prefix}id)WHERE data@>$2 AND $2@>data
DO UPDATE SET data=$2,updated_at=now()`,
`INSERT INTO me_scan_log(id,scanned_at)VALUES(CONCAT('${obj}.',$1::text),now())
ON CONFLICT(id) DO UPDATE SET scanned_at=now()`];
}

const getUpsertSqlWithParent = (parent: string, obj: string) => {
   return [`INSERT INTO me_${parent}_${obj}(id,${parent}_id,data)VALUES($3::text,$1::text,$2)
ON CONFLICT(${parent}_id,id)WHERE data@>$2 AND $2@>data
DO UPDATE SET data=$2,updated_at=now()`,
`INSERT INTO me_scan_log(id,scanned_at)VALUES(CONCAT('${parent}_${obj}.',$1::text),now())
ON CONFLICT(id) DO UPDATE SET scanned_at=now()`];
}

const queryScanLog = async (client: Client) => {
   const idSet = new Set<string>();
   let {rows} = await client.query(`SELECT id FROM me_scan_log WHERE scanned_at >= NOW() - INTERVAL '24 HOURS'`);
   for (const row of rows) {
      idSet.add(row['id']);
   }
   return idSet;
}

const queryIdSet = async (field1: string, obj: string, client: Client) => {
   const idSet = new Set<string>();
   let {rows} = await client.query(`SELECT DISTINCT ${field1} AS id FROM me_${obj}`);
   for (const row of rows) {
      idSet.add(row['id']);
   }
   return idSet;
}

const queryAndUpsertMany = async (endpoint: string, texts: string[],
   valuesAccessor: (v: unknown) => unknown[], client: Client, paging: boolean = true) => {

   console.info(`query: ${endpoint}`);

   const queue: Subject<() => Promise<unknown>> = new Subject();
   const queuePromise = waitForUpserts(queue);
   const result: unknown[] = [];
   let offset = 0;
   
   let data = await fetchFromUpstream(`${ME_API}/${endpoint}` + (
      paging ? `?offset=${offset}&limit=${BATCH_SIZE}` : ``), []);
   while (data.length) {
      Array.prototype.push.apply(result, data);
      queue.next(() => upsert(client, texts[0], valuesAccessor, data));
      queue.next(() => upsert(client, texts[1], d => [valuesAccessor(d)[0]], data));
      if (!paging) break;
      offset += BATCH_SIZE;
      data = await fetchFromUpstream(`${ME_API}/${endpoint}?offset=${offset}&limit=${BATCH_SIZE}`, []);
      // console.info(`queryList: ${endpoint} offset: ${offset}`);
   }
   queue.complete();
   console.info(`done ${(await queuePromise) / 2.0}: ${endpoint}`);
   return result;
}

const queryAndUpsertOne = async (endpoint: string, texts: string[],
   valuesAccessor: (v: unknown) => unknown[], client: Client) => {

   console.info(`query: ${endpoint}`);
   let value = await fetchFromUpstream(`${ME_API}/${endpoint}`, null);
   if (value) await upsert(client, texts[0], valuesAccessor, [value]);
   await upsert(client, texts[1], d => [valuesAccessor(d)[0]], [value])
   return value;
}

const waitForUpserts = (queue: Subject<() => Promise<unknown>>) =>
   new Promise<number>(resolve => {
      queue.pipe(
         bufferTime(1000, null, UPSERT_PER_SECOND),
         concatMap(o => from(o).pipe(concatMap(p => from(p())))),
         count(),
      ).subscribe(resolve);
   });

const waitForQueries = (queue: Subject<() => Promise<unknown>>) =>
   new Promise<number>(resolve => {
      queue.pipe(
         bufferTime(1000, null, QUERY_PER_SECOND),
         concatMap(o => from(o).pipe(concatMap(p => from(p())))),
         count(),
      ).subscribe(resolve);
   });

const fetchFromUpstream = <T>(url: string, defVal: T) =>
   fetch(url)
      .then(r => {
         if (r.ok)
            return r.json() as Promise<T>;
         
         // if (r.status === 429)
         //    throw r.statusText;
            
         console.error(`! status ${r.status}: ${url}`);
         return defVal;
      }).catch(ex => {
         console.error(ex);
         return defVal;
      });

const upsert = (client: Client, text: string,
   valuesAccessor: (v: unknown) => unknown[], data: unknown[]) => new Promise(resolve =>
   from(data).pipe(
      concatMap(value => {
         const values = valuesAccessor(value);
         return from(client.query({ text: text, values, rowMode: 'array' })).pipe(
            catchError(ex => {
               console.error({ex,values,test:text});
               return of(ex);
            })
         );
      }),
      count()
   ).subscribe(count => resolve(count)));
