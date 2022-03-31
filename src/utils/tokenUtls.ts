// import { TokenListProvider } from "@solana/spl-token-registry";
import { PublicKey } from "@solana/web3.js";
import { connection } from "./global";

// let tokenDict: any = {};
// export const getTokenDict = async () => {
//   const tokenList = await new TokenListProvider().resolve().then((tokens) => {
//     const tokenList = tokens.filterByClusterSlug("mainnet-beta").getList();
//     return tokenList;
//   });

//   for (const tkn of tokenList) {
//     tokenDict[tkn.address] = tkn;
//   }
//   return tokenDict;
// };

// export const getTokenData = async (mint: string) => {
//   // fix so  it doesnt get called every time

//   if (tokenDict[mint]) {
//     const tkn = tokenDict[mint];
//     const name = tkn.name;
//     const symbol = tkn.symbol;
//     const tags = tkn.tags;
//     const logoURI = tkn.logoURI;
//     const decimals = tkn.decimals;

//     return {
//       name,
//       symbol,
//       mint,
//       tags,
//       logoURI,
//       decimals,
//     };
//   } else {
//     return {
//       name: "Unknown",
//       symbol: "Unknown",
//       mint: mint,
//       tags: "Unknown",
//       logoURI: "Unknown",
//       decimals: "Unknown",
//     };
//   }
// };

export const getTokenBalance = async (key: string) => {
  let mintPK = new PublicKey(key);
  const accountInfo: any = await connection.getParsedAccountInfo(mintPK);

  const balance =
    accountInfo && accountInfo.value.data.parsed.info.tokenAmount.amount;
  const decimals =
    accountInfo && accountInfo.value.data.parsed.info.tokenAmount.decimals;

  return { balance: balance && balance, decimals: decimals && decimals };
};
