import { PublicKey } from "@solana/web3.js";
import { Market, Orderbook } from "@project-serum/serum";
import { connection, SERUM_DEX_V3, textEncoder } from "./global";

export const getSerumAddressAndMarketData = async (
  programId: PublicKey,
  optionMarketKey: PublicKey,
  priceCurrencyKey1: PublicKey,
  priceCurrencyKey2: PublicKey
) => {
  const [serumAddress1] = await deriveSerumMarketAddress(
    programId,
    optionMarketKey,
    priceCurrencyKey1
  );
  const [serumAddress2] = await deriveSerumMarketAddress(
    programId,
    optionMarketKey,
    priceCurrencyKey2
  );

  // TRY FOR EACH TO SEE IF MARKET EXISTS!
  let marketData = await getSerumMarketData(
    serumAddress1,
    optionMarketKey.toBase58()
  );
  if (!marketData) {
    marketData = await getSerumMarketData(
      serumAddress2,
      optionMarketKey.toBase58()
    );
  }
  if (marketData) {
    return marketData;
  }
};

export const getSerumMarketData = async (
  marketAddress: PublicKey,
  optionMarketKey?: string
) => {
  try {
    const market = await getSerumMarket(marketAddress);

    if (market) {
      const marketData = await _getSerumMarketData(market);

      let fullMarketData = {
        ...marketData,
        serumMarketAddress: marketAddress.toBase58(),
        optionMarketAddress: optionMarketKey ? optionMarketKey : undefined,
      };

      return fullMarketData;
    }
  } catch {
    // it's likely that no market exists
    return;
  }
  // }
};

export const deriveSerumMarketAddress = async (
  programId: PublicKey,
  optionMarketKey: PublicKey,
  priceCurrencyKey: PublicKey
) => {
  return PublicKey.findProgramAddress(
    [
      optionMarketKey.toBuffer(),
      priceCurrencyKey.toBuffer(),
      textEncoder.encode("serumMarket"),
    ],
    programId
  );
};

export const getSerumMarket = async (marketAddress: PublicKey) => {
  let programAddress = SERUM_DEX_V3;
  let market = await Market.load(connection, marketAddress, {}, programAddress);

  if (market) {
    return market;
  } else return;
};

const _getSerumMarketData = async (market: Market) => {
  const baseMintAddress = market.baseMintAddress.toBase58();
  const quoteMintAddress = market.quoteMintAddress.toBase58();

  return {
    baseMintAddress,
    quoteMintAddress,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOrderBookData = async (asks: Orderbook, bids: Orderbook) => {
  const orderBook = [];
  //@ts-ignore
  for (let order of asks) {
    // const oo = await getOpenOrders(order.openOrdersAddress.toBase58());
    orderBook.push({
      orderId: order.orderId,
      price: order.price,
      priceLots: order.priceLots,
      size: order.size,
      feeTier: order.feeTier,
      openOrdersAddress: order.openOrdersAddress.toBase58(),
      openOrdersSlot: order.openOrdersSlot,
      side: order.side, // 'buy' or 'sell'
      // openOrders: oo,
    });
  }
  //@ts-ignore
  for (let order of bids) {
    // const oo = await getOpenOrders(order.openOrdersAddress.toBase58());
    orderBook.push({
      orderId: order.orderId,
      price: order.price,
      priceLots: order.priceLots,
      size: order.size,
      feeTier: order.feeTier,
      openOrdersAddress: order.openOrdersAddress.toBase58(),
      openOrdersSlot: order.openOrdersSlot,
      side: order.side, // 'buy' or 'sell'
      // openOrders: oo,
    });
  }

  return orderBook;
};

export const getDailyStatsAndVolume = async (address: string) => {
  const data = JSON.stringify({
    query: `
    query {
        dailyStats(markets: "${address}") {
          stats {
            vol7dUsd
            vol24hUsd
            trades24h
            trades7d
          }
          volume {
            volume
            trades
            interval
          }
        }
    } `,
    variables: `{
          "address": "${address}"
        }`,
  });

  const response = await fetch("https://api.serum.markets/", {
    method: "post",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  let json;
  if (response) {
    json = await response.json();
  }
  let allStats: any = {};

  if (json.data && json.data.dailyStats) {
    if (json.data.dailyStats.volume) {
      allStats["volume"] = json.data.dailyStats.volume;
    }
    if (json.data.dailyStats.stats) {
      let stats = {
        ...json.data.dailyStats.stats,
        vol7dUsd: json.data.dailyStats.stats.vol7dUsd
          ? parseInt(json.data.dailyStats.stats.vol7dUsd) / 10 ** 5
          : 0,
        vol24hUsd: json.data.dailyStats.stats.vol24hUsd
          ? parseInt(json.data.dailyStats.stats.vol24hUsd) / 10 ** 5
          : 0,
      };
      allStats["stats"] = stats;
    }
    return allStats;
  }
  return;
};

export const fetchCurrentSerumMarkets = async (
  currentSerumMarkets: any,
  singlePairOptionMarkets: any,
  programId: any,
  activePair: any
) => {
  let _serumData: any = {};
  const splitPair = activePair.split("/");
  const revPair = splitPair[1] + "/" + splitPair[0];
  if (
    singlePairOptionMarkets &&
    (singlePairOptionMarkets[activePair] || singlePairOptionMarkets[revPair])
  ) {
    let om;
    if (
      singlePairOptionMarkets[activePair] &&
      singlePairOptionMarkets[revPair]
    ) {
      om = singlePairOptionMarkets[activePair].concat(
        singlePairOptionMarkets[revPair]
      );
    } else if (singlePairOptionMarkets[activePair]) {
      om = singlePairOptionMarkets[activePair];
    } else if (singlePairOptionMarkets[revPair]) {
      om = singlePairOptionMarkets[revPair];
    }
    if (om) {
      for (const m in om) {
        const sd = await getSerum(om[m], programId);

        if (sd && sd.optionMarketAddress && sd.serumMarketAddress) {
          _serumData[sd.optionMarketAddress] = sd;
        }
      }

      let _serumMarkets = {
        ...currentSerumMarkets,
        [activePair]: _serumData,
      };
      return _serumMarkets;
    }
  }
};

const getSerum = async (m: any, programId: any) => {
  if (programId) {
    const data = await getSerumAddressAndMarketData(
      programId,
      new PublicKey(m.optionMarketKey),
      new PublicKey(m.quoteAssetMint.mint),
      new PublicKey(m.underlyingAssetMint.mint)
    );
    return data;
  }
};

export const getOrderBooksByOptionKey = async (
  singlePairMarket: any,
  serumMarkets: any,
  activePair: string
) => {
  let callResp: any = [];
  let putResp: any = [];
  let allCallExpirations: any = [];
  let allPutExpirations: any = [];
  let allCallContractSizes: any = [];
  let allPutContractSizes: any = [];
  let allCallStrikePrices: any = [];
  let allPutStrikePrices: any = [];
  for (const market of singlePairMarket) {
    if (serumMarkets[market.optionMarketKey]) {
      const serumMarket = serumMarkets[market.optionMarketKey];
      let _serumMarket = await Market.load(
        connection,
        new PublicKey(serumMarket.serumMarketAddress),
        {},
        SERUM_DEX_V3
      );

      const asks = await _serumMarket.loadAsks(connection);
      const bids = await _serumMarket.loadBids(connection);
      // Full orderbook data
      const orderBook = await getOrderBookData(asks, bids);
      if (orderBook.length > 0) {
        if (market.type === "call") {
          callResp.push({
            orderBook,
            pair: activePair,
            expiration: parseInt(market.expiration),
            contractSize: parseInt(market.quoteAmountPerContract),
            strikePrice: parseInt(market.strikePrice),
          });
          if (!allCallContractSizes.includes(market.quoteAmountPerContract)) {
            allCallContractSizes.push(market.quoteAmountPerContract);
          }
          if (!allCallExpirations.includes(market.expiration)) {
            allCallExpirations.push(market.expiration);
          }
          if (!allCallStrikePrices.includes(market.strikePrice)) {
            allCallStrikePrices.push(market.strikePrice);
          }
        } else {
          putResp.push({
            orderBook,
            pair: activePair,
            expiration: parseInt(market.expiration),
            contractSize: parseInt(market.underlyingAmountPerContract),
            strikePrice: parseInt(market.strikePrice),
          });
          if (
            !allPutContractSizes.includes(market.underlyingAmountPerContract)
          ) {
            allPutContractSizes.push(market.underlyingAmountPerContract);
          }
          if (!allPutExpirations.includes(market.expiration)) {
            allPutExpirations.push(market.expiration);
          }
          if (!allPutStrikePrices.includes(market.strikePrice)) {
            allPutStrikePrices.push(market.strikePrice);
          }
        }
      }
    }
  }

  const combined = {
    call: callResp,
    put: putResp,
    allCallExpirations,
    allPutExpirations,
    allCallContractSizes,
    allPutContractSizes,
    allCallStrikePrices,
    allPutStrikePrices,
  };

  return combined;
};
