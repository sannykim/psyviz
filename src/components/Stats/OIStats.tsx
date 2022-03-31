import { formatNumber } from "../../utils/global";
import Skeleton from "../Skeleton";

export default function OIStats(props: any) {
  return (
    <div className="shadow bg-white stats  ">
      <div className="stat bg-white text-black">
        <div className="stat-title text-lg text-black font-bold">
          Total Open Interest
        </div>
        <div className="stat-value min-h-6 w-full">
          {props.TOI >= 0 ? formatNumber(props.TOI) : <Skeleton small={true} />}
        </div>
        <div className={`stat-desc${props.TOI <= 0 && ` h-6`}`}></div>
      </div>
    </div>
  );
}
