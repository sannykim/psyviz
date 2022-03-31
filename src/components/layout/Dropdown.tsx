import moment from "moment";
import { useEffect, useState } from "react";
type Props = {
  labelType: string;
  currentLabel: any;
  handleLabelSelection: any;
  choices: any;
  optionType: string;
  activePair: string;
};
export default function ActivePairDropdown({
  labelType,
  currentLabel,
  handleLabelSelection,
  choices,
  optionType,
  activePair,
}: Props) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [hasOptions, setHasOptions] = useState(false);
  const [spDivide, setSpDivide] = useState(1);
  const [csDivide, setCsDivide] = useState(1);
  const handleSelection = (choice: string) => {
    handleLabelSelection(labelType, choice, optionType);
    setShowDropdown(false);
  };
  useEffect(() => {
    if (choices.length > 1) {
      setHasOptions(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices]);
  useEffect(() => {
    let curr = activePair.split("/")[0];
    let spDivide, csDivide;
    if (curr === "BTC") {
      spDivide = 10 ** 4;
      csDivide = 10 ** 5;
    } else if ("ETH") {
      spDivide = 10 ** 4;
      csDivide = 10 ** 6;
    } else if ("SOL") {
      spDivide = 10 ** 1;
      csDivide = 1; // TODO
    }
    if (spDivide && csDivide) {
      setSpDivide(spDivide);
      setCsDivide(csDivide);
    }
  }, [activePair]);

  return (
    <>
      {choices && (
        <div className="dropdown mr-2 font-bold">
          <div
            className={`btn font-bold bg-white text-black   text-md dropdown-end  px-5 ${
              hasOptions
                ? `hover:bg-gray-300 hover:cursor-pointer `
                : `border-none hover:bg-white hover:cursor-auto`
            }`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {labelType === "expiration"
              ? moment.unix(parseInt(currentLabel)).format("MM/DD")
              : labelType === "strikePrice"
              ? parseInt(currentLabel) / spDivide
              : parseInt(currentLabel) / csDivide}
          </div>

          {hasOptions && showDropdown && (
            <ul
              style={{ backgroundColor: "#2a2e37" }}
              className="p-2 mt-3 text-md text-white  shadow menu dropdown-content-custom bg-base-100 rounded-box w-52"
            >
              {choices
                .filter((d: any) => {
                  return d.toString() !== currentLabel.toString();
                })
                .sort()
                .map((choice: any, key: number) => {
                  let displayValue = choice;
                  if (labelType === "expiration") {
                    displayValue = moment
                      .unix(parseInt(choice))
                      .format("MM/DD");
                  } else if (labelType === "strikePrice") {
                    displayValue = parseInt(choice) / spDivide;
                  } else {
                    displayValue = parseInt(choice) / csDivide;
                  }
                  return (
                    <li key={key}>
                      {
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a onClick={() => handleSelection(choice)}>
                          {displayValue}
                        </a>
                      }
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
