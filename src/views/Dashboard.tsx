import React, { useContext, useEffect, useState } from "react";

import retrieveHistory from "../data/historicaldata";
import "../styles.css";
import { OptionMarketContext } from "../components/context/OptionMarketContextInit";
import {
  CurrencyPairs,
  dynamicDateSort,
  pairToCoinGecko,
} from "../utils/global";
import { findAllByKey } from "../utils/findAllByKeys";
import {
  getExpiredData2,
  getFormattedOpenActivePair,
  getOpenInterestFromPair2,
  getStrikeData,
  getTotalTVL,
} from "../utils/OpenInterestUtils";
import { combinePairDict } from "../utils/optionMarketUtils";
import {
  fetchCurrentSerumMarkets,
  getDailyStatsAndVolume,
  getOrderBooksByOptionKey,
} from "../utils/serumUtils";
import { useProgram } from "../hooks/useProgram";
import Navbar from "../components/layout/Navbar";
import ResponsiveGridComponent from "../components/ResponsiveGridComponent";
import Stats from "../components/Stats/Stats";
import ProgressBar from "../components/layout/ProgressBar";
import { hackyFixPrice, otherSide } from "../utils/utils";

export default function App() {
  const [currencyPrice, setCurrencyPrice] = useState<number>();
  const [historicData, setHistoricData] = useState<any>();
  const [shapedData, setShapedData] = useState<any>();
  const [expiryData, setExpiryData] = useState<any>();
  const [openCalls, setOpenCalls] = useState<any>();
  const [openPuts, setOpenPuts] = useState<any>();
  const [dataVolume, setDataVolume] = useState<any>();
  const [dataTrades, setDataTrades] = useState<any>();
  const [calendarData, setCalendarData] = useState<any>();
  const [biweeklyVolume, setBiweeklyVolume] = useState<any>();
  const [biweeklyTrades, setBiweeklyTrades] = useState<any>();

  const [serumLoadProgress, setSerumLoadProgress] = useState<any>({});
  const [TVL, setTVL] = useState(-1);
  const [putMarketCount, setPutMarketCount] = useState(-1);
  const [callMarketCount, setCallMarketCount] = useState(-1);
  const [fullOrderBookData, setFullOrderBookData] = useState<any>();

  const [callOrderBookData, setCallOrderBookData] = useState([]);
  const [currentCallStrikePrice, setCurrentCallStrikePrice] = useState<any>();
  const [currentCallExpiration, setCurrentCallExpiration] = useState<any>();
  const [currentCallContractSize, setCurrentCallContractSize] = useState<any>();
  const [putOrderBookData, setPutOrderBookData] = useState([]);
  const [currentPutStrikePrice, setCurrentPutStrikePrice] = useState<any>();
  const [currentPutExpiration, setCurrentPutExpiration] = useState<any>();
  const [currentPutContractSize, setCurrentPutContractSize] = useState<any>();

  const [activePair, setActivePair] = useState<string>(CurrencyPairs.BTC_USDC);

  const [OIELoading, setOIELoading] = useState<boolean>(true);
  const [OISPLoading, setOISPLoading] = useState<boolean>(true);
  const [OICLoading, setOICLoading] = useState<boolean>(true);
  const [DVLoading, setDVLoading] = useState<boolean>(true);
  const [DTLoading, setDTLoading] = useState<boolean>(true);
  const [CDLoading, setCDLoading] = useState<boolean>(true);
  const [VMLoading, setVMLoading] = useState<boolean>(true);
  const [TMLoading, setTMLoading] = useState<boolean>(true);
  const [putOrderBookLoading, setPutOrderBookLoading] = useState<boolean>(true);
  const [callOrderBookLoading, setCallOrderBookLoading] =
    useState<boolean>(true);

  const program = useProgram();

  const optionMarketContext = useContext(OptionMarketContext);

  // on load
  useEffect(() => {
    optionMarketContext.updateActivePair("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (optionMarketContext.singlePairOptionMarkets) {
      let putMarkets, callMarkets;
      for (const pair in optionMarketContext.singlePairOptionMarkets) {
        if (pair.split("/")[0] === "USDC") {
          putMarkets = optionMarketContext.singlePairOptionMarkets[pair].length;
        } else {
          callMarkets =
            optionMarketContext.singlePairOptionMarkets[pair].length;
        }
      }
      setPutMarketCount(putMarkets);
      setCallMarketCount(callMarkets);
    }
  }, [optionMarketContext.singlePairOptionMarkets]);

  // Coingecko data
  useEffect(() => {
    async function fetchPrice(currency: string) {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`
      );
      if (res) {
        const json = await res.json();
        setCurrencyPrice(json[currency].usd);
      }
    }
    async function getPrices(currency: string) {
      const prices = await retrieveHistory(currency);
      const pp = {
        id: "price",
        color: "#66FFC7", //#8b5cf6",//#66D4FE", //"#91ffd7",
        data: prices,
      };
      setHistoricData(pp);
    }

    if (activePair) {
      const currency = pairToCoinGecko[activePair];
      fetchPrice(currency);
      getPrices(currency);
      const interval = setInterval(() => {
        fetchPrice(currency);
      }, 100000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [activePair]);

  useEffect(() => {
    if (currencyPrice && optionMarketContext.singlePairOptionMarkets) {
      const totalValue = getTotalTVL(
        optionMarketContext.singlePairOptionMarkets,
        currencyPrice
      );
      setTVL(totalValue);
    }
  }, [currencyPrice, optionMarketContext.singlePairOptionMarkets]);

  // OPEN INTEREST DATA
  useEffect(() => {
    if (
      optionMarketContext.openInterest &&
      optionMarketContext.openInterest[activePair]
    ) {
      const openActivePair = optionMarketContext.openInterest[activePair];
      // OPEN CALLS & PUTS
      const openCalls = findAllByKey(openActivePair, "calls").reduce(
        (partialSum: any, a: any) => partialSum + a,
        0
      );
      const openPuts = findAllByKey(openActivePair, "puts").reduce(
        (partialSum: any, a: any) => partialSum + a,
        0
      );
      setOpenCalls(openCalls);
      setOpenPuts(openPuts);

      // EXPIRY DATA
      const formattedOpenActivePair =
        getFormattedOpenActivePair(openActivePair);

      let expiryData = getExpiredData2(formattedOpenActivePair);
      setExpiryData(expiryData);
      setOIELoading(false);

      // STIKE PRICE DATA
      const shapedData = getStrikeData(openActivePair);

      setShapedData(shapedData);
      setOISPLoading(false);

      setOICLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionMarketContext.openInterest]);

  useEffect(() => {
    if (
      activePair &&
      optionMarketContext.openInterest &&
      optionMarketContext.openInterest[activePair] &&
      optionMarketContext.serumMarkets &&
      optionMarketContext.serumMarkets[activePair]
    ) {
      _getOrderBooksByOptionKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activePair,
    optionMarketContext.openInterest,
    optionMarketContext.serumMarkets,
  ]);
  const _getOrderBooksByOptionKey = async () => {
    // getOrderbookFilters(optionMarketContext.openInterest, activePair);
    const _fullOrderBookData: any = await getOrderBooksByOptionKey(
      optionMarketContext.openInterest[activePair],
      optionMarketContext.serumMarkets[activePair],
      activePair
    );
    setFullOrderBookData(_fullOrderBookData);
    if (_fullOrderBookData["call"].length > 0) {
      updateCallOrderBook(
        _fullOrderBookData["call"],
        _fullOrderBookData["allCallStrikePrices"]
      );
    } else {
      setCallOrderBookLoading(false);
    }
    if (_fullOrderBookData["put"].length > 0) {
      updatePutOrderBook(
        _fullOrderBookData["put"],
        _fullOrderBookData["allPutStrikePrices"]
      );
    } else {
      setPutOrderBookLoading(false);
    }
  };

  const updateCallOrderBook = (
    callOrderBookData: any,
    _allCallStrikePrices: any
  ) => {
    // TODO: REMOVE
    // let temp = [];
    // for (const i of _allCallStrikePrices) {
    //   // eslint-disable-next-line eqeqeq
    //   if (i != 250000000) {
    //     temp.push(i);
    //   }
    // }
    // let _currentStrikePrice = Math.min(...temp);
    let _currentStrikePrice = Math.min(..._allCallStrikePrices);

    let availCallDataAfterSP = [];
    let availExpirations = [];
    let availContractSizes = [];
    for (const ob of callOrderBookData) {
      if (ob.strikePrice === _currentStrikePrice) {
        availCallDataAfterSP.push(ob);
        availExpirations.push(ob.expiration);
        availContractSizes.push(ob.contractSize);
      }
    }

    let _currentExpiration = Math.min(...availExpirations);
    let availCallDataAfterExp = [];
    for (const ob of availCallDataAfterSP) {
      if (ob.expiration === _currentExpiration) {
        availCallDataAfterExp.push(ob);
        availContractSizes.push(ob.contractSize);
      }
    }

    let initCallData = [];
    let _currentContractSize = Math.min(...availContractSizes);
    for (const ob of availCallDataAfterExp) {
      if (ob.contractSize === _currentContractSize) {
        for (const d of ob.orderBook) {
          const price = hackyFixPrice(d.price);

          initCallData.push({
            price: price,
            size: d.size, //d.openOrdersSlot
            side: d.side,
          });
        }
      }
    }
    setCurrentCallStrikePrice(_currentStrikePrice);
    setCurrentCallExpiration(_currentExpiration);
    setCurrentCallContractSize(_currentContractSize);
    getOrderBookData(initCallData, "call");
    setCallOrderBookLoading(false);
  };

  const updatePutOrderBook = (
    putOrderBookData: any,
    _allPutStrikePrices: any
  ) => {
    // TODO: REMOVE
    // let temp = [];
    // for (const i of _allPutStrikePrices) {
    //   // eslint-disable-next-line eqeqeq
    //   if (i != 250000000) {
    //     temp.push(i);
    //   }
    // }
    // let _currentStrikePrice = Math.min(...temp);
    let _currentStrikePrice = Math.min(..._allPutStrikePrices);

    let availPutDataAfterSP = [];
    let availExpirations = [];
    let availContractSizes = [];
    for (const ob of putOrderBookData) {
      if (ob.strikePrice === _currentStrikePrice) {
        availPutDataAfterSP.push(ob);
        availExpirations.push(ob.expiration);
        availContractSizes.push(ob.contractSize);
      }
    }

    let _currentExpiration = Math.min(...availExpirations);
    let availPutDataAfterExp = [];
    for (const ob of availPutDataAfterSP) {
      if (ob.expiration === _currentExpiration) {
        availPutDataAfterExp.push(ob);
        availContractSizes.push(ob.contractSize);
      }
    }

    let initPutData = [];
    let _currentContractSize = Math.min(...availContractSizes);
    for (const ob of availPutDataAfterExp) {
      if (ob.contractSize === _currentContractSize) {
        for (const d of ob.orderBook) {
          const price = hackyFixPrice(d.price);

          initPutData.push({
            price: price,
            size: d.size, //d.openOrdersSlot
            side: d.side,
          });
        }
      }
    }

    setCurrentPutStrikePrice(_currentStrikePrice);
    setCurrentPutExpiration(_currentExpiration);
    setCurrentPutContractSize(_currentContractSize);
    getOrderBookData(initPutData, "put");
    setPutOrderBookLoading(false);
  };

  const handleLabelSelection = (
    labelType: string,
    choice: any,
    optionType: string
  ) => {
    if (optionType === "call") {
      let _currentStrikePrice =
        labelType === "strikePrice" ? choice : currentCallStrikePrice;

      let availCallDataAfterSP = [];
      let availExpirations = [];
      let availContractSizes = [];
      for (const ob of fullOrderBookData["call"]) {
        if (ob.strikePrice === _currentStrikePrice) {
          availCallDataAfterSP.push(ob);
          availExpirations.push(ob.expiration);
          availContractSizes.push(ob.contractSize);
        }
      }

      let _currentExpiration =
        labelType === "expiration" ? choice : currentCallExpiration;
      let availCallDataAfterExp = [];
      for (const ob of availCallDataAfterSP) {
        if (ob.expiration === _currentExpiration) {
          availCallDataAfterExp.push(ob);
          availContractSizes.push(ob.contractSize);
        }
      }

      let initCallData = [];
      let _currentContractSize =
        labelType === "contractSize" ? choice : currentCallContractSize;
      for (const ob of availCallDataAfterExp) {
        if (ob.contractSize === _currentContractSize) {
          for (const d of ob.orderBook) {
            const price = hackyFixPrice(d.price);
            initCallData.push({
              price: price,
              size: d.openOrdersSlot,
              side: d.side,
            });
          }
        }
      }

      setCurrentCallStrikePrice(_currentStrikePrice);
      setCurrentCallExpiration(_currentExpiration);
      setCurrentCallContractSize(_currentContractSize);
      getOrderBookData(initCallData, "call");
      setCallOrderBookLoading(false);
    } else if (optionType === "put") {
      let _currentStrikePrice =
        labelType === "strikePrice" ? choice : currentPutStrikePrice;

      let availPutDataAfterSP = [];
      let availExpirations = [];
      let availContractSizes = [];
      for (const ob of fullOrderBookData["put"]) {
        if (ob.strikePrice === _currentStrikePrice) {
          availPutDataAfterSP.push(ob);
          availExpirations.push(ob.expiration);
          availContractSizes.push(ob.contractSize);
        }
      }

      let _currentExpiration =
        labelType === "expiration" ? choice : currentPutExpiration;
      let availPutDataAfterExp = [];
      for (const ob of availPutDataAfterSP) {
        if (ob.expiration === _currentExpiration) {
          availPutDataAfterExp.push(ob);
          availContractSizes.push(ob.contractSize);
        }
      }

      let initPutData = [];
      let _currentContractSize =
        labelType === "contractSize" ? choice : currentPutContractSize;
      for (const ob of availPutDataAfterExp) {
        if (ob.contractSize === _currentContractSize) {
          for (const d of ob.orderBook) {
            const price = hackyFixPrice(d.price);
            initPutData.push({
              price: price,
              size: d.openOrdersSlot,
              side: d.side,
            });
          }
        }
      }

      setCurrentPutStrikePrice(_currentStrikePrice);
      setCurrentPutExpiration(_currentExpiration);
      setCurrentPutContractSize(_currentContractSize);
      getOrderBookData(initPutData, "put");
      setPutOrderBookLoading(false);
    }
  };
  const clearOrderBookData = () => {
    setCallOrderBookData([]);
    setCurrentCallStrikePrice(undefined);
    setCurrentCallExpiration(undefined);
    setCurrentCallContractSize(undefined);
    setPutOrderBookData([]);
    setCurrentPutStrikePrice(undefined);
    setCurrentPutExpiration(undefined);
    setCurrentPutContractSize(undefined);
    setPutOrderBookLoading(true);
    setCallOrderBookLoading(true);
  };
  // UPDATE ACTIVE PAIR
  useEffect(() => {
    async function updateActivePair(pair: string) {
      setOIELoading(true);
      setOISPLoading(true);
      setOICLoading(true);
      setDVLoading(true);
      setDTLoading(true);
      setCDLoading(true);
      setVMLoading(true);
      setTMLoading(true);

      clearOrderBookData();
      let _singlePairOptionMarkets: any = combinePairDict(
        optionMarketContext.optionMarkets,
        pair
      );

      if (_singlePairOptionMarkets) {
        optionMarketContext.updateSinglePairOptionMarkets(
          _singlePairOptionMarkets
        );
        const openInterest: any = await getOpenInterestFromPair2(
          _singlePairOptionMarkets,
          pair
        );
        let newOpenInterest = { ...optionMarketContext.openInterest };
        newOpenInterest[pair] = openInterest[pair];
        optionMarketContext.updateOpenInterest(newOpenInterest);
        if (optionMarketContext.serumMarkets) {
          fetchSerumData(
            _singlePairOptionMarkets,
            optionMarketContext.serumMarkets
          );
        } else {
          fetchSerumData(_singlePairOptionMarkets, {});
        }
      }
    }
    if (activePair && optionMarketContext.optionMarkets) {
      updateActivePair(activePair);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePair]);

  useEffect(() => {
    if (dataVolume && VMLoading) {
      setVMLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVolume]);

  useEffect(() => {
    if (dataTrades && TMLoading) {
      setTMLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTrades]);

  useEffect(() => {
    if (calendarData && CDLoading) {
      setCDLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarData]);

  useEffect(() => {
    if (biweeklyVolume && DVLoading) {
      setDVLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biweeklyVolume]);

  useEffect(() => {
    if (biweeklyTrades && DTLoading) {
      setDTLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biweeklyTrades]);

  const fetchSerumData = async (
    singlePairOptionMarkets: any,
    serumMarkets: any
  ) => {
    if (optionMarketContext.singlePairOptionMarkets && program) {
      const _serumMarkets = await fetchCurrentSerumMarkets(
        serumMarkets,
        singlePairOptionMarkets,
        program.programId,
        activePair
      );
      optionMarketContext.updateSerumMarkets(_serumMarkets);
    }
  };

  // VOLUME DATA
  useEffect(() => {
    if (
      optionMarketContext.serumMarkets &&
      optionMarketContext.serumMarkets[activePair]
    ) {
      let serumMarketsToGetVolumeFrom = [];
      for (const oms in optionMarketContext.optionMarkets) {
        for (const om of optionMarketContext.optionMarkets[oms]) {
          if (
            optionMarketContext.serumMarkets[activePair][om.optionMarketKey]
          ) {
            serumMarketsToGetVolumeFrom.push(
              optionMarketContext.serumMarkets[activePair][om.optionMarketKey]
                .serumMarketAddress
            );
          }
        }
      }
      if (optionMarketContext.activePair !== activePair) {
        optionMarketContext.updateActivePair(activePair);
        getDailySerumStatsAndVol(serumMarketsToGetVolumeFrom);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionMarketContext.serumMarkets]);

  const getDailySerumStatsAndVol = async (addresses: string[]) => {
    const aggregatedStats: any = {};
    const aggregatedVolume: any[] = [];
    const n = addresses.length;
    setSerumLoadProgress({ n, curr: 1 });
    for (let i = 0; i < addresses.length; i += 1) {
      setSerumLoadProgress({ n, curr: i + 1 });
      const data = await getDailyStatsAndVolume(addresses[i]);
      if (data.stats) {
        aggregatedStats[addresses[i]] = data.stats;
      }
      if (data.volume) {
        data.volume.forEach((d: any) => aggregatedVolume.push(d));
      }
      // if (i > 0 && i % 8 === 0) {
      //   await delay(1000);
      // }
    }

    setSerumLoadProgress({});
    getDailySerumStats(aggregatedStats);
    if (aggregatedVolume.length > 0) {
      getBiweekVol(aggregatedVolume);
    } else {
      setDVLoading(false);
      setDTLoading(false);
      setBiweeklyVolume([
        {
          id: "volume",
          color: "#66FFC7", //#8b5cf6",//#66D4FE", //"#91ffd7",
          data: [{ x: "0", y: 0 }],
        },
      ]);
      setBiweeklyTrades([
        {
          id: "volume",
          color: "#66FFC7", //#8b5cf6",//#66D4FE", //"#91ffd7",
          data: [{ x: "0", y: 0 }],
        },
      ]);
    }
  };

  const getDailySerumStats = async (aggregatedStats: any) => {
    const volume7: any = Object.values(aggregatedStats).reduce(
      (acc, curr: any) => (acc = acc + curr.vol7dUsd),
      0
    );
    const volume24: any = Object.values(aggregatedStats).reduce(
      (acc, curr: any) => (acc = acc + curr.vol24hUsd),
      0
    );
    const trades7 = Object.values(aggregatedStats).reduce(
      (acc, curr: any) => (acc = acc + curr.trades7d),
      0
    );
    const trades24 = Object.values(aggregatedStats).reduce(
      (acc, curr: any) => (acc = acc + curr.trades24h),
      0
    );

    const _dataVolume = [
      { label: "24hr", volume: Math.floor(volume24) },
      { label: "7d", volume: Math.floor(volume7) },
    ];

    const _dataTrades = [
      { label: "24hr", trades: trades24 },
      { label: "7d", trades: trades7 },
    ];

    setDataVolume(_dataVolume);
    setDataTrades(_dataTrades);
  };

  const getBiweekVol = async (aggregatedVolume: any[]) => {
    if (aggregatedVolume.length > 0) {
      const _calendarData = aggregatedVolume.map(function (key) {
        return {
          value: key.trades,
          day: key.interval.split("T")[0],
        };
      });

      setCalendarData(_calendarData);

      const mergedWeekVolume = aggregatedVolume.reduce((a, c) => {
        let x = a.find((e: any) => e.interval === c.interval);
        let obj = { ...c, volume: parseInt(c.volume) };
        if (!x) {
          a.push(Object.assign({}, obj));
        } else {
          x.volume += obj.volume;
          x.trades += obj.trades;
        }
        return a;
      }, []);

      mergedWeekVolume.sort(dynamicDateSort("interval"));

      const extractedVolume = mergedWeekVolume.map((p: any) => {
        return {
          x: p.interval.split("T")[0].split("2022-")[1],
          y: p.volume / 10 ** 5, // p.volume.slice(0, -9), // is decimal correct??
        };
      });

      const volumeWeeks = [
        {
          id: "volume",
          color: "#66FFC7", //#8b5cf6",//#66D4FE", //"#91ffd7",
          data: extractedVolume,
        },
      ];
      const extractedTrades = mergedWeekVolume.map((p: any) => {
        return {
          x: p.interval.split("T")[0].split("2022-")[1],
          y: p.trades,
        };
      });

      const tradesWeeks = [
        {
          id: "volume",
          color: "#66FFC7", //#8b5cf6",//#66D4FE", //"#91ffd7",
          data: extractedTrades,
        },
      ];
      setBiweeklyVolume(volumeWeeks);
      setBiweeklyTrades(tradesWeeks);
    }
  };

  const getOrderBookData = (_orderBook: any, orderType: string) => {
    /// CHANGE - Orderbook
    let orderData = _orderBook.filter((i: any) => i.size);
    let tempOrderBook: any = {};
    Object.entries(orderData).forEach(([_, v]: any) => {
      let tempSide = v.side;
      let tempFloat = parseFloat(v.price) * 10000;
      if (tempFloat in tempOrderBook) {
        tempOrderBook[tempFloat][tempSide] += v.size;
      } else {
        tempOrderBook[tempFloat] = {
          label: v.price,
          [tempSide]: v.size,
          [otherSide(tempSide)]: 0,
        };
      }
    });

    tempOrderBook = Object.keys(tempOrderBook)
      .sort(function (a: any, b: any) {
        return a - b;
      })
      .reduce((obj: any, key) => {
        obj[key] = tempOrderBook[key];
        return obj;
      }, {});
    let _orderBookData: any = Object.keys(tempOrderBook).map(function (key) {
      return {
        label: tempOrderBook[key].label,
        buy: tempOrderBook[key].buy,
        sell: tempOrderBook[key].sell,
      };
    });

    _orderBookData.sort(function (a: any, b: any) {
      var keyA = new Date(a.label),
        keyB = new Date(b.label);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });

    if (orderType === "call") {
      setCallOrderBookData(_orderBookData);
    } else if (orderType === "put") {
      setPutOrderBookData(_orderBookData);
    }
  };

  return (
    <div style={{ maxWidth: "3000px" }} className="mx-auto">
      <div>
        <Navbar
          title="PsyOptions Dashboard"
          activePair={activePair}
          setActivePair={setActivePair}
        />
      </div>
      <ProgressBar serumLoadProgress={serumLoadProgress} />
      <div className="w-full pb-5 px-5 ">
        <Stats
          activePair={activePair}
          TVL={TVL}
          openCalls={openCalls}
          openPuts={openPuts}
          callMarketCount={callMarketCount}
          putMarketCount={putMarketCount}
        />

        <ResponsiveGridComponent
          activePair={activePair}
          currencyPrice={currencyPrice}
          historicData={historicData}
          dataVolume={dataVolume}
          VMLoading={VMLoading}
          dataTrades={dataTrades}
          TMLoading={TMLoading}
          openCalls={openCalls}
          openPuts={openPuts}
          OICLoading={OICLoading}
          shapedData={shapedData}
          OISPLoading={OISPLoading}
          biweeklyVolume={biweeklyVolume}
          DVLoading={DVLoading}
          expiryData={expiryData}
          OIELoading={OIELoading}
          biweeklyTrades={biweeklyTrades}
          DTLoading={DTLoading}
          callOrderBookData={callOrderBookData}
          putOrderBookData={putOrderBookData}
          currentCallStrikePrice={currentCallStrikePrice}
          handleLabelSelection={handleLabelSelection}
          fullOrderBookData={fullOrderBookData}
          currentCallExpiration={currentCallExpiration}
          currentCallContractSize={currentCallContractSize}
          currentPutStrikePrice={currentPutStrikePrice}
          currentPutExpiration={currentPutExpiration}
          currentPutContractSize={currentPutContractSize}
          callOrderBookLoading={callOrderBookLoading}
          putOrderBookLoading={putOrderBookLoading}
        />
      </div>
    </div>
  );
}
