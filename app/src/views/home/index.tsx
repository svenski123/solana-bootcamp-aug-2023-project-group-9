// Next, React
import { FC, useEffect, useMemo, useState } from "react";

// Anchor
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, TransactionSignature } from "@solana/web3.js";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { Blackjack } from "../../types/blackjack";
import IDL from "../../utils/blackjack.json";
import { notify } from "../../utils/notifications";
import { OPTS, PROGRAM_ID } from "utils/connection";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

export const HomeView: FC = ({}) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameState, setGameState] = useState();
  const [gameKeypair, setGameKeypair] = useState<Keypair>();
  const [playerKeypair, setPlayerKeypair] = useState<Keypair>();
  const [winner, setWinner] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();

  const program = useMemo(() => {
    if (wallet && connection) {
      const provider = new anchor.AnchorProvider(connection, wallet!, OPTS);
      return new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    }
  }, [wallet, connection]);
  console.log("PROGRAM", program);

  const createNewGame = async () => {
    const game = anchor.web3.Keypair.generate();
    const player = anchor.web3.Keypair.generate();
    setGameKeypair(game);
    setPlayerKeypair(player);
    console.log(game);
    console.log(player);

    let signature: TransactionSignature = "";
    try {
      const signature = await program.methods
        .initialize()
        .accounts({ game: game.publicKey, player: player.publicKey })
        .signers([game, player])
        .rpc();
      console.log("New Game! Signature:", signature);
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `Unable to start new Game`,
        description: error?.message,
        txid: signature,
      });
    }
  };

  const winnerMessage = (
    <h1 className="w-2/6 text-8xl text-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      {winner && winner !== "Dealer" ? "You win!" : "Dealer wins"}
    </h1>
  );

  return (
    <div className="w-full h-full m-auto p-4">
      <div className="mt-16 h-3/4 flex justify-between">
        <h1 className="w-2/6 text-5xl text-center">
          Your score: {playerScore}
        </h1>
        <h1 className="w-2/6 text-5xl text-center">
          Dealer&apos;s score: {dealerScore}
        </h1>
        {winner && winnerMessage}
      </div>
      <div className="w-full mx-auto flex justify-evenly">
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => createNewGame()}
        >
          <span className="text-2xl">New Game </span>
        </button>
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("DEAL")}
        >
          <span className="text-2xl">Deal </span>
        </button>
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("Clicked Hit")}
        >
          <span className="text-2xl">Hit </span>
        </button>

        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("Clicked Stand")}
        >
          <span className="text-2xl">Stand </span>
        </button>
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("CHECK")}
        >
          <span className="text-2xl">Check </span>
        </button>
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => console.log("CLOSE")}
        >
          <span className="text-2xl">Close </span>
        </button>
      </div>
    </div>
  );
};
