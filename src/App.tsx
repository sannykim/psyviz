import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";
import { endpoint } from "./utils/global";
import Dashboard from "./views/Dashboard";
import ContextProvider from "./components/context/ContextProvider";
// import Footer from "./components/layout/Footer";

function App() {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint
  // const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = React.useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <ContextProvider>
          <div
            id="page-container"
            className="min-h-screen"
            style={{ backgroundColor: "#f5f5f5 !important" }}
          >
            <div id="content-wrap">
              
              {/* <Home />  */}
              <Dashboard />
              
            </div>
            {/* <div className=" h-96"></div> */}
            {/* <Footer /> */}
          </div>
        </ContextProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
