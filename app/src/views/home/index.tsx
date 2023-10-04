// Next, React
import { FC, useEffect, useState } from "react";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="w-1/2 h-full mx-auto p-4">
      <div className="relative top-3/4 flex justify-between">
        <button
          className="px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("Clicked Hit")}
        >
          <span className="text-2xl">Hit </span>
        </button>

        <button
          className="px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("Clicked Pass")}
        >
          <span className="text-2xl">Pass </span>
        </button>
      </div>
    </div>
  );
};
