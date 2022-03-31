import MarketCountStats from "./MarketCountStats";
import OIStats from "./OIStats";
import TVLStats from "./TVLStats";

type Props = {
  activePair: string;
  TVL: number;
  openCalls: number;
  openPuts: number;
  callMarketCount: number;
  putMarketCount: number;
};
export default function Stats({
  activePair,
  TVL,
  openCalls,
  openPuts,
  callMarketCount,
  putMarketCount,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-4 sm:grid-cols-2 mx-2">
      <TVLStats activePair={activePair} TVL={TVL} />
      {openCalls && openPuts ? (
        <OIStats TOI={openCalls + openPuts} />
      ) : (
        <OIStats TOI={-1} />
      )}
      <MarketCountStats
        count={callMarketCount}
        title="Total Call Option Markets"
      />
      <MarketCountStats
        count={putMarketCount}
        title="Total Put Option Markets"
      />
    </div>
  );
}
