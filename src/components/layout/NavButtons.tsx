

export default function NavButtons(props: any) {
  const handleSelection = (e: any, pair: string) => {
    e.preventDefault();
    props.setActivePair(pair);
  };
  return (
    <div className="flex font-bold">
      <div
        className={`btn ${
          props.activePair !== "BTC/USDC" && `bg-transparent `
        }  font-bold mr-2 text-md  hover:cursor-pointer px-5`}
        onClick={(e) => handleSelection(e, "BTC/USDC")}
      >
        BTC / USDC
      </div>
      <div
        className={`btn ${
          props.activePair !== "soETH/USDC" && `bg-transparent `
        }  font-bold mr-2 text-md  hover:cursor-pointer px-5`}
        onClick={(e) => handleSelection(e, "soETH/USDC")}
      >
        ETH / USDC
      </div>
      <div
        className={`btn ${
          props.activePair !== "SOL/USDC" && `bg-transparent `
        }  font-bold mr-2 text-md  hover:cursor-pointer px-5`}
        onClick={(e) => handleSelection(e, "SOL/USDC")}
      >
        SOL / USDC
      </div>
    </div>
  );
}
