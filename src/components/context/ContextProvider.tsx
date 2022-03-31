import { ReactNode, useState } from "react";

import OptionMarketContext, {
  OptionMarketContextProvider,
} from "./OptionMarketContextInit";

type Props = {
  children?: ReactNode;
};

const ContextProvider = ({ children }: Props) => {
  const [optionMarkets, setOptionMarkets] = useState<any>();
  const [singlePairOptionMarkets, setSinglePairOptionMarkets] = useState<any>();
  const [openInterest, setOpenInterest] = useState<any[]>();
  const [tokenDict, setTokenDict] = useState<any>();
  const [serumMarkets, setSerumMarkets] = useState<any>({});
  const [activePair, setActivePair] = useState<any>("");

  const updateOptionMarkets = (_optionMarkets: any) => {
    setOptionMarkets(_optionMarkets);
  };

  const updateTokenDict = (_tokenDict: any) => {
    setTokenDict(_tokenDict);
  };
  const updateOpenInterest = (_openInterest: any) => {
    setOpenInterest(_openInterest);
  };
  const updateSerumMarkets = (_serumMarkets: any) => {
    setSerumMarkets(_serumMarkets);
  };
  const updateSinglePairOptionMarkets = (_optionMarkets: any) => {
    setSinglePairOptionMarkets(_optionMarkets);
  };
  const updateActivePair = (_activePair: any) => {
    setActivePair(_activePair);
  };

  const optionMarketContextValues = {
    optionMarkets,
    updateOptionMarkets,
    singlePairOptionMarkets,
    updateSinglePairOptionMarkets,
    openInterest,
    updateOpenInterest,
    tokenDict,
    updateTokenDict,
    serumMarkets,
    updateSerumMarkets,
    activePair,
    updateActivePair,
  };

  return (
    <OptionMarketContextProvider value={optionMarketContextValues}>
      <OptionMarketContext>{children}</OptionMarketContext>
    </OptionMarketContextProvider>
  );
};

export default ContextProvider;
