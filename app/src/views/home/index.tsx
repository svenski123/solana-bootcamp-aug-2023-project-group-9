// Next, React
import { FC, useEffect, useState } from "react";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

export const HomeView: FC = ({}) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [winner, setWinner] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const winnerMessage = (
    <h1 className="w-2/6 text-8xl text-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      {winner && winner !== "Dealer" ? "You win!" : "Dealer wins"}
    </h1>
  );

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="w-3/4 h-full m-auto p-4">
      <div className="mt-16 h-3/4 flex justify-between">
        <h1 className="w-2/6 text-5xl text-center">
          Your score: {playerScore}
        </h1>
        <h1 className="w-2/6 text-5xl text-center">
          Dealer&apos;s score: {dealerScore}
        </h1>
        {winner && winnerMessage}
      </div>
      <div className="w-3/4 mx-auto flex justify-center">
        <button
          className="mx-12 px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("Clicked Hit")}
        >
          <span className="text-2xl">Hit </span>
        </button>

        <button
          className="mx-12 px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("Clicked Stand")}
        >
          <span className="text-2xl">Stand </span>
        </button>
      </div>
    </div>
  );
};
