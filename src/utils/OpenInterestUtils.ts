import { PublicKey } from "@solana/web3.js";
import moment from "moment";
import { getAccountInfo, getProgramAccounts } from "./solanaUtils";
import { getOptionType } from "./utils";

export const getOpenInterestFromPair2 = async (
  optionMarketsByPair: any,
  activePair: string
) => {
  let markets: any = {};
  const marketArray = [];
  for (const marketPair in optionMarketsByPair) {
    let mp = marketPair.split("/");
    if (mp.includes("USDC")) {
      // ignores unkown / unknown pair
      for (const market of optionMarketsByPair[marketPair]) {
        const data = await getStrikePriceAndTokenAmount(market);
        let strikePrice, calls, puts;
        if (data) {
          strikePrice = data?.strikePrice;
          calls = data.calls ? data.calls : 0;
          puts = data.puts ? data.puts : 0;
        }
        marketArray.push({
          expiration: market.expiration,
          quoteAmountPerContract: market.underlyingAmountPerContract,
          underlyingAmountPerContract: market.quoteAmountPerContract,
          optionMarketKey: market.optionMarketKey,
          type: getOptionType(marketPair),
          strikePrice,
          puts: calls, // TODO SWITCH
          calls: puts, // TODO SWITCH
        });
      }
    }
  }
  markets[activePair] = marketArray;
  return markets;
};

const getStrikePriceAndTokenAmount = async (market: any) => {
  let strikePrice;
  if (market.quoteAssetMint && market.underlyingAssetMint) {
    if (market.quoteAssetMint.symbol === "USDC") {
      strikePrice =
        parseInt(market.quoteAmountPerContract.toString()) /
        (parseInt(market.underlyingAmountPerContract.toString()) / 10000);
      // GET CIRCULATION OF TOKEN
      const tokens = await getTokenCirculation(market);

      return { strikePrice, puts: tokens };
    } else if (market.underlyingAssetMint.symbol === "USDC") {
      strikePrice =
        parseInt(market.underlyingAmountPerContract.toString()) /
        (parseInt(market.quoteAmountPerContract.toString()) / 10000);
      // GET CIRCULATION OF TOKEN
      const tokens = await getTokenCirculation(market);

      return { strikePrice, calls: tokens };
    }
  }
  return;
};

const getTokenCirculation = async (market: any) => {
  const optionMint = await getAccountInfo(new PublicKey(market.optionMint));

  const optionMintHolders = await getProgramAccounts(
    new PublicKey(market.optionMint)
  );
  let optionTokenCount = 0;
  for (const holder of optionMintHolders) {
    optionTokenCount += parseInt(holder.tokenAmount);
  }
  if (parseInt(optionMint.supply) === optionTokenCount) {
    return optionTokenCount;
  } else {
    console.error("option token supply does not match circulation");
  }
};

export const getFormattedOpenActivePair = (openActivePair: any) => {
  const formattedOpenActivePair: any = openActivePair.map(function (obj: any) {
    return {
      expiration: moment.unix(parseInt(obj.expiration)).format("MM/DD"),
      strikePrice: parseInt(obj.strikePrice),
      calls: obj.calls,
      puts: obj.puts,
    };
  });
  return formattedOpenActivePair;
};

export const getExpiredData2 = (formattedOpenActivePair: any) => {
  let expiryData: any = Object.values(
    formattedOpenActivePair.reduce((result: any, object: any) => {
      result[object.expiration] = result[object.expiration] || {
        expiration: object.expiration,
      };
      ["calls", "puts"].forEach(
        (key) =>
          (result[object.expiration][key] =
            (result[object.expiration][key] || 0) + object[key])
      );
      return result;
    }, Object.create(null))
  );
  expiryData = expiryData.filter((i: any) => i.calls || i.puts);

  expiryData = expiryData.map(function (obj: any) {
    return {
      label: obj.expiration,
      calls: obj.calls,
      puts: obj.puts,
    };
  });
  expiryData.sort(function (a: any, b: any) {
    var keyA = new Date(a.label),
      keyB = new Date(b.label);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  return expiryData;
};

export const getStrikeData = (openActivePair: any) => {
  let openAlpha = openActivePair.filter((i: any) => i.calls || i.puts);

  let properAlpha: any = {};
  Object.entries(openAlpha).forEach(([_, v]: any) => {
    if (v.strikePrice in properAlpha) {
      properAlpha[v.strikePrice].calls += v.calls;
      properAlpha[v.strikePrice].puts += v.puts;
    } else {
      properAlpha[v.strikePrice] = { calls: v.calls, puts: v.puts };
    }
  });

  let sortedAlpha = Object.keys(properAlpha)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = properAlpha[key];
      return obj;
    }, {});

  let alphaData = Object.keys(sortedAlpha).map(function (key) {
    return {
      label: key.slice(0, -4),
      calls: sortedAlpha[key].calls,
      puts: sortedAlpha[key].puts,
    };
  });

  return alphaData;
};

export const getTotalTVL = (
  singlePairOptionMarkets: any,
  currencyPrice: number
) => {
  let totalValue = 0;
  for (const marketSide in singlePairOptionMarkets) {
    for (const market of singlePairOptionMarkets[marketSide]) {
      let quoteValue;
      if (market.quoteAssetMint.symbol === "USDC") {
        quoteValue =
          market.quoteAssetPool.balance / 10 ** market.quoteAssetPool.decimals;
      } else {
        quoteValue =
          (market.quoteAssetPool.balance /
            10 ** market.quoteAssetPool.decimals) *
          currencyPrice;
      }

      totalValue += quoteValue;

      let underlyingValue;
      if (market.underlyingAssetMint.symbol === "USDC") {
        underlyingValue =
          market.underlyingAssetPool.balance /
          10 ** market.underlyingAssetPool.decimals;
      } else {
        underlyingValue =
          (market.underlyingAssetPool.balance /
            10 ** market.underlyingAssetPool.decimals) *
          currencyPrice;
      }
      totalValue += underlyingValue;
    }
  }
  return totalValue;
};
