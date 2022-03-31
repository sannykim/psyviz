import CoinGecko from "coingecko-api";

const CoinGeckoClient = new CoinGecko();

export default async function retrieveHistory(coin) {
  let res = await CoinGeckoClient.coins.fetchMarketChart(coin, {
    days: 14,
    interval: "daily"
  });
  const d = res.data.prices.map((p) => {
    let temp = new Date(p[0]).toDateString();
    return {
      x: temp.split(" ")[2],
      y: p[1]
    };
  });
  d.pop();
  return d;
}
