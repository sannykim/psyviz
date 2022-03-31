import { useState } from "react";

export default function ActivePairDropdown(props: any) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const handleSelection = (e: any, pair: string) => {
    e.preventDefault();
    setShowDropdown(false);
    props.setActivePair(pair);
  };
  return (
    <div className="dropdown font-bold">
      <div
        className="btn font-bold text-md dropdown-end hover:cursor-pointer px-5"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {props.activePair === "soETH/USDC" ? "ETH/USDC" : props.activePair}
      </div>

      {showDropdown && (
        <ul
          style={{ backgroundColor: "#2a2e37" }}
          className="p-2 mt-3 text-md text-white  shadow menu dropdown-content-custom bg-base-100 rounded-box w-52"
        >
          <li>
            {
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a onClick={(e) => handleSelection(e, "BTC/USDC")}>BTC/USDC</a>
            }
          </li>
          <li>
            {
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a onClick={(e) => handleSelection(e, "soETH/USDC")}>ETH/USDC</a>
            }
          </li>
          <li>
            {
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a onClick={(e) => handleSelection(e, "SOL/USDC")}>SOL/USDC</a>
            }
          </li>
        </ul>
      )}
    </div>
  );
}
