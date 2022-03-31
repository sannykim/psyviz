export function optionMarketIsNotExpired(obj: any) {
  const exp = obj.account.expirationUnixTimestamp.toString();
  if (Date.now() / 1000 < exp && !obj.account.expired) {
    return true;
  }
  return false;
}
export function otherSide(x: string) {
  if (x === "buy") {
    return "sell";
  } else {
    return "buy";
  }
}
export function getOptionType(pair: string) {
  let mp = pair.split("/");
  if (mp.includes("USDC")) {
    if (mp[0] === "USDC") {
      return "put";
    } else {
      return "call";
    }
  }
  return;
}
export const hackyFixPrice = (_price: any) => {
  let price = Math.floor(_price).toString();
  if (_price.toString().split(".")[1]) {
    if (_price.toString().split(".")[1].length > 1) {
      price = price + "." + _price.toString().split(".")[1].substring(0, 2);
    } else {
      price = price + "." + _price.toString().split(".")[1].substring(0, 1);
    }
  }
  return parseFloat(price);
};
