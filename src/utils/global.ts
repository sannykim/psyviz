import * as anchor from "@project-serum/anchor";
export const endpoint: string = "https://ssc-dao.genesysgo.net";
export const connection: anchor.web3.Connection = new anchor.web3.Connection(
  endpoint
);
export const textEncoder: TextEncoder = new TextEncoder();
export const SERUM_DEX_V3 = new anchor.web3.PublicKey(
  "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
);
export const PSY_PROGRAM_ID = new anchor.web3.PublicKey(
  "R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs"
);
export const WRAPPED_BTC_MINT = new anchor.web3.PublicKey(
  "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"
);
export const WRAPPED_ETH_MINT = new anchor.web3.PublicKey(
  "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"
);
export const WRAPPED_SOL_MINT = new anchor.web3.PublicKey(
  "So11111111111111111111111111111111111111112"
);
export const allMints: any = {
  "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk": {
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk/logo.png",
    mint: "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
    symbol: "soETH",
    name: "Wrapped Ethereum (Sollet)",
  },
  "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E": {
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png",
    mint: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
    symbol: "BTC",
    name: "Wrapped Bitcoin (Sollet)",
  },
  So11111111111111111111111111111111111111112: {
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Wrapped SOL",
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
  },
};

export const symbolToMint: any = {
  BTC: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  SOL: "So11111111111111111111111111111111111111112",
  soETH: "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
};

export const CurrencyPairs = {
  BTC_USDC: "BTC/USDC",
};

export const pairToCoinGecko: any = {
  "BTC/USDC": "bitcoin",
  "SOL/USDC": "solana",
  "soETH/USDC": "ethereum",
};

export function dynamicDateSort(property: any) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    let result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

export const formatNumber = (n: number) => {
  return n
    .toFixed(2)
    .replace(/[.,]00$/, "")
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
