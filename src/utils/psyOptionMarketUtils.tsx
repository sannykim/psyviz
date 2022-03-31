import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { allMints } from "./global";
import { parseOptionMarket } from "./optionMarketUtils";
import { deriveSerumMarketAddress, getSerumMarketData } from "./serumUtils";
import { getAccountInfo, getProgramAccounts } from "./solanaUtils";
import { optionMarketIsNotExpired } from "./utils";

export const isActiveMainPairMarket = (optionMarket: any) => {
  if (
    allMints[optionMarket.account.quoteAssetMint.toBase58()] &&
    allMints[optionMarket.account.underlyingAssetMint.toBase58()] &&
    optionMarketIsNotExpired(optionMarket)
  ) {
    return true;
  }
};

export const getParsedMarketsGroupedByPair = async (program: Program) => {
  const optionMarkets = await program.account.optionMarket.all();
  let markets: any = {};
  for (const _optionMarket of optionMarkets) {
    if (isActiveMainPairMarket(_optionMarket)) {
      const parsedOptionMarket = await parseOptionMarket(_optionMarket);
      if (
        parsedOptionMarket &&
        parsedOptionMarket.quoteAssetMint &&
        parsedOptionMarket.underlyingAssetMint
      ) {
        const pair =
          parsedOptionMarket.quoteAssetMint.symbol +
          "/" +
          parsedOptionMarket.underlyingAssetMint.symbol;
        if (markets[pair]) {
          markets[pair].push(parsedOptionMarket);
        } else {
          markets[pair] = [parsedOptionMarket];
        }
      } else {
        console.error(
          "No parsedOptionMarket (and / or mint)",
          parsedOptionMarket
        );
      }
    }
  }
  return markets;
};

export const getOptionMintInfo = async (optionMint: PublicKey) => {
  const optionMintAccountInfo = await getAccountInfo(optionMint);
  return optionMintAccountInfo;
};

export const getOptionMintHolders = async (optionMint: PublicKey) => {
  const optionMintHolders = await getProgramAccounts(optionMint);
  return optionMintHolders;
};

export const getSerumMarket = async (
  programId: PublicKey,
  optionMarketKey: PublicKey,
  priceCurrencyKey1: PublicKey,
  priceCurrencyKey2: PublicKey
) => {
  const [serumMarketAddress1] = await deriveSerumMarketAddress(
    programId,
    optionMarketKey,
    priceCurrencyKey1
  );
  const [serumMarketAddress2] = await deriveSerumMarketAddress(
    programId,
    optionMarketKey,
    priceCurrencyKey2
  );

  let serumMarket = await getSerumMarketData(serumMarketAddress1);
  let serumMarketKey;
  if (serumMarket) {
    serumMarketKey = serumMarketAddress1.toBase58();
  } else {
    serumMarket = await getSerumMarketData(serumMarketAddress2);
    if (serumMarket) {
      serumMarketKey = serumMarketAddress2.toBase58();
    }
  }
  if (serumMarketKey) {
    return [serumMarket, serumMarketKey];
  }
  return;
};
