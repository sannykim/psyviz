import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { connection } from "./global";

export const getAccountInfo = async (key: PublicKey) => {
  const accountInfo: any = await connection.getParsedAccountInfo(key);
  const info = accountInfo.value.data.parsed.info;
  return {
    decimals: info.decimals,
    // freezeAuthority: info.freezeAuthority,
    // isInitialized: info.isInitialized,
    mintAuthority: info.mintAuthority,
    supply: info.supply,
    // type: accountInfo.value.data.parsed.type,
  };
};

export const getProgramAccounts = async (key: PublicKey) => {
  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 0,
          bytes: key.toBase58(),
        },
      },
    ],
  });

  const strippedAccounts = [];
  for (const account of accounts) {
    if (account) {
      // @ts-ignore
      const parsedData = account.account.data?.parsed;
      strippedAccounts.push({
        mint: parsedData.info.mint,
        owner: parsedData.info.owner,
        tokenAmount: parsedData.info.tokenAmount.amount,
        tokenDecimals: parsedData.info.tokenAmount.decimals,
      });
    }
  }
  return strippedAccounts;
};
