import ActivePairDropdown from "./ActivePairDropdown";
import NavButtons from "./NavButtons";
import logo from "../../assets/pv-512.png";
type Props = {
  title?: string;
  activePair?: string;
  setActivePair?: React.Dispatch<React.SetStateAction<string>>;
};

export default function Footer({ title, activePair, setActivePair }: Props) {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500  p-3 shadow-lg rounded-lg">
        <div className="flex items-center">
          <img
            src={logo}
            className="h-12 shadow-lg hidden sm:block rounded-md mr-2"
            alt="logo"
          />

          <h1 className="text-2xl text-white "> - {title}</h1>
        </div>
        <div className="flex">
          {
            <div className="hidden md:flex">
              <NavButtons
                activePair={activePair}
                setActivePair={setActivePair}
              />
            </div>
          }
          {
            <div className="md:hidden">
              <ActivePairDropdown
                activePair={activePair}
                setActivePair={setActivePair}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}
