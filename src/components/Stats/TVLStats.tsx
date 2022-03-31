import { formatNumber } from "../../utils/global";
import Skeleton from "../Skeleton";

export default function TVLStats(props: any) {
  return (
    <div className="shadow bg-white stats  ">
      <div className="stat bg-white text-black">
        <div className="stat-title text-lg text-black  font-bold">
          TVL -{" "}
          {props.activePair.split("/")[0] +
            " / " +
            props.activePair.split("/")[1]}
        </div>
        {props.TVL >= 0 ? (
          <div className="stat-value">{"$" + formatNumber(props.TVL)}</div>
        ) : (
          <div className="stat-value">
            <Skeleton small={true} />
          </div>
        )}
        <div className="stat-desc">USD Value</div>
      </div>
    </div>
  );
}
