import { ProgramAccount } from "@project-serum/anchor";
import { Idl, IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";
import {
  IdlTypes,
  TypeDef,
} from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { allMints } from "./global";
import {
  getTokenBalance,
  // getTokenData
} from "./tokenUtls";

export const parseOptionMarket = async (
  optionMarket: ProgramAccount<TypeDef<IdlTypeDef, IdlTypes<Idl>>>
) => {
  const exp = optionMarket.account.expirationUnixTimestamp.toString();
  if (Date.now() / 1000 < exp && !optionMarket.account.expired) {
    // const optionMarketKey = new PublicKey(opt.PublicKey.toString());

    const optionMarketKey = optionMarket.publicKey.toBase58();
    //   expiration
    // const expiration = moment.unix(exp).format("MM/DD/YYYY");
    const expiration = exp;

    // POOLS
    const quoteAssetPoolPK = optionMarket.account.quoteAssetPool.toBase58();
    const quoteAssetMintString = optionMarket.account.quoteAssetMint.toBase58();

    const underlyingAssetPoolPK =
      optionMarket.account.underlyingAssetPool.toBase58();
    const underlyingAssetMintString =
      optionMarket.account.underlyingAssetMint.toBase58();

    let quoteAssetMint;
    let quoteAssetPoolPKBalance;
    let quoteAssetPool;

    let underlyingAssetMint;
    let underlyingAssetPoolPKBalance;
    let underlyingAssetPool;

    if (allMints[quoteAssetMintString] && allMints[underlyingAssetMintString]) {
      const promises = [
        // [getTokenData, optionMarket.account.quoteAssetMint.toBase58()],
        // [getTokenData, optionMarket.account.underlyingAssetMint.toBase58()],
        [getTokenBalance, quoteAssetPoolPK],
        [getTokenBalance, underlyingAssetPoolPK],
      ];

      [
        // quoteAssetMint,
        // underlyingAssetMint,

        quoteAssetPoolPKBalance,
        underlyingAssetPoolPKBalance,
      ] = await Promise.all(promises.map((fn) => fn[0](fn[1])));

      quoteAssetMint = allMints[quoteAssetMintString];
      underlyingAssetMint = allMints[underlyingAssetMintString];

      quoteAssetPool = {
        publicKey: quoteAssetPoolPK,
        balance: quoteAssetPoolPKBalance.balance,
        decimals: quoteAssetPoolPKBalance.decimals,
        tokenMint: quoteAssetMintString,
      };

      underlyingAssetPool = {
        publicKey: underlyingAssetPoolPK,
        balance: underlyingAssetPoolPKBalance.balance,
        decimals: underlyingAssetPoolPKBalance.decimals,
        tokenMint: underlyingAssetMintString,
      };
    } else {
      // won't reach that for now since we're only looking at 3 main pairs
      quoteAssetMint = quoteAssetMintString;
      underlyingAssetMint = underlyingAssetMintString;
    }

    // AMOUNTS per contract
    const quoteAmountPerContract =
      optionMarket.account.quoteAmountPerContract.toString();
    const underlyingAmountPerContract =
      optionMarket.account.underlyingAmountPerContract.toString();

    // exerciseFeeAccount
    // const exerciseFeeAccount =
    //   optionMarket.account.exerciseFeeAccount.toBase58();

    // mintFeeAccount
    // const mintFeeAccount = optionMarket.account.mintFeeAccount.toBase58();

    // TOKENS
    const optionMint = optionMarket.account.optionMint.toBase58();
    const writerTokenMint = optionMarket.account.writerTokenMint.toBase58();

    return {
      optionMarketKey,

      expiration,

      quoteAssetMint,
      quoteAssetPool,
      quoteAmountPerContract,

      underlyingAssetMint,
      underlyingAssetPool,
      underlyingAmountPerContract,

      // exerciseFeeAccount,
      // mintFeeAccount,

      optionMint,
      writerTokenMint,
    };
  }
};

// PAIR SWAP HAPPENS HERE
export const combinePairDict = (optionMarketsByPair: any, pair: string) => {
  const _singlePairOptionMarkets: any = {};
  const splitPair = pair.split("/");
  const revPair = splitPair[1] + "/" + splitPair[0];

  if (optionMarketsByPair[pair] && optionMarketsByPair[revPair]) {
    _singlePairOptionMarkets[revPair] = optionMarketsByPair[pair];
    _singlePairOptionMarkets[pair] = optionMarketsByPair[revPair];
  } else if (optionMarketsByPair[pair]) {
    _singlePairOptionMarkets[revPair] = optionMarketsByPair[pair];
  } else if (optionMarketsByPair[revPair]) {
    _singlePairOptionMarkets[pair] = optionMarketsByPair[revPair];
  }

  return _singlePairOptionMarkets;
};
