import React, { useEffect, useMemo, useState } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { TokenListProvider } from "@solana/spl-token-registry";
import * as anchor from "@project-serum/anchor";

//to initialize the program it can be done somewhat like the following:
import { PsyAmericanIdl } from "@mithraic-labs/psy-american";

import { PublicKey } from "@solana/web3.js";
import { Program, Provider } from "@project-serum/anchor";
import { connection, PSY_PROGRAM_ID } from "./utils/global";



const MyWallet: React.FC = () => {

  let walletAddress = "";

  const wallet = useWallet();
  if (wallet.connected && wallet.publicKey) {
    walletAddress = wallet.publicKey.toString();
  }

  useEffect(() => {
    if (wallet) {
      const anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
      } as typeof anchor.Wallet;
      const provider = new anchor.Provider(connection, anchorWallet, {
        preflightCommitment: "recent",
      });
      const program = new Program(PsyAmericanIdl, PSY_PROGRAM_ID, provider);

    }
  }, [wallet]);



  return (
    <>
      {(wallet.connected && <p>Your wallet is {walletAddress}</p>) || (
        <p>Hello! Click the button to connect</p>
      )}

      <div className="multi-wrapper">
        <span className="button-wrapper">
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </span>
        {wallet.connected && <WalletDisconnectButton />}
       
      </div>
    </>
  );
};

export default MyWallet;
