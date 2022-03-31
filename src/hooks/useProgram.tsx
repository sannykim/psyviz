import { Program } from "@project-serum/anchor";
import { useState, useEffect } from "react";
import * as anchor from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, PSY_PROGRAM_ID } from "../utils/global";
import { PsyAmericanIdl } from "@mithraic-labs/psy-american";

export function useProgram() {
  const [program, setProgram] = useState<Program | undefined>();

  const wallet = useWallet();

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
      const p = new Program(PsyAmericanIdl, PSY_PROGRAM_ID, provider);
      setProgram(p);
    }
  }, [wallet]);

  return program;
}
