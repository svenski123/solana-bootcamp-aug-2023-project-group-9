// Next, React
import { FC, useEffect, useMemo, useState } from "react";

// Anchor
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  TransactionSignature,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from "@solana/web3.js";

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
  const [winnerText, setWinnerText] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();

  const program = useMemo(() => {
    if (wallet && connection) {
      const provider = new anchor.AnchorProvider(connection, wallet!, OPTS);
      return new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    }
  }, [wallet, connection]);
  console.log("PROGRAM", program);

  // Calculates winner based on current score.
  // Call when game over
  // Alternatively make a call to fetch game state and compare
  const calculateWinner = () => {
    if (dealerScore > 21 && playerScore > 21) {
      setWinnerText("Draw - You both lose");
    } else if (dealerScore === playerScore) {
      setWinnerText("Draw");
    } else if (dealerScore > playerScore) {
      setWinnerText("Dealer wins");
    } else if (dealerScore < playerScore) {
      setWinnerText("You win");
    }
  };

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
      notify({
        type: "success",
        message: "New game created!",
        txid: signature,
      });
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

  const deal = async () => {
    let signature: TransactionSignature = "";
    try {
      const signature = await program.methods
        .deal(1)
        .accounts({
          game: gameKeypair.publicKey,
          player: playerKeypair.publicKey,
          slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
        })
        .signers([playerKeypair])
        .rpc();
      notify({ type: "success", message: "Cards dealt!", txid: signature });
      console.log("Cards dealt. Signature:", signature);
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `Unable to deal`,
        description: error?.message,
        txid: signature,
      });
    }
  };

  const checkScore = async () => {
    // RPC call to check
    let signature: TransactionSignature = "";
    try {
      const signature = await program.methods
        .check()
        .accounts({ game: gameKeypair.publicKey })
        .rpc();
      notify({ type: "success", message: "Cards checked!", txid: signature });
      console.log("Cards checked. Signature:", signature);
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `Unable to check cards`,
        description: error?.message,
        txid: signature,
      });
    }

    // Should set game state
  };

  const hit = async () => {
    // RPC call to hit
    let signature: TransactionSignature = "";
    try {
      const signature = await program.methods
        .hit()
        .accounts({
          game: gameKeypair.publicKey,
          player: playerKeypair.publicKey,
          slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
        })
        .signers([playerKeypair])
        .rpc();
      notify({ type: "success", message: "Hit!", txid: signature });
      console.log("Hit successful. Signature:", signature);
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `Unable to hit`,
        description: error?.message,
        txid: signature,
      });
    }

    // Should call check to look at gamestate and update scores (react state)
  };

  const stand = async () => {
    // RPC call to stand
    let signature: TransactionSignature = "";
    try {
      const signature = await program.methods
        .stand()
        .accounts({
          game: gameKeypair.publicKey,
          player: playerKeypair.publicKey,
          slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
        })
        .signers([playerKeypair])
        .rpc();
      notify({ type: "success", message: "Stand!", txid: signature });
      console.log("Stand successful. Signature:", signature);
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `Unable to stand`,
        description: error?.message,
        txid: signature,
      });
    }
  };

  const close = async () => {
    // RPC call to close
    let signature: TransactionSignature = "";
    try {
      const signature = await program.methods
        .close()
        .accounts({
          game: gameKeypair.publicKey,
          player: playerKeypair.publicKey,
        })
        .signers([playerKeypair])
        .rpc();
      notify({ type: "success", message: "Game ended!", txid: signature });
      console.log("Close successful. Signature:", signature);
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `Unable to close game`,
        description: error?.message,
        txid: signature,
      });
    }
  };

  const winnerMessage = (
    <h1 className="absolute w-2/6 text-center text-8xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      {winnerText}
    </h1>
  );

  return (
    <div className="w-full h-full p-4 m-auto">
      <div className="flex justify-between mt-16 h-3/4">
        <h1 className="w-2/6 text-5xl text-center">
          Your score: {playerScore}
        </h1>
        <h1 className="w-2/6 text-5xl text-center">
          Dealer&apos;s score: {dealerScore}
        </h1>
        {winnerText && winnerMessage}
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
          onClick={() => deal()}
        >
          <span className="text-2xl">Deal </span>
        </button>
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => hit()}
        >
          <span className="text-2xl">Hit </span>
        </button>

        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => stand()}
        >
          <span className="text-2xl">Stand </span>
        </button>
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => checkScore()}
        >
          <span className="text-2xl">Check </span>
        </button>
        <button
          className=" px-12 py-2 w-[200px] rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white"
          onClick={() => close()}
        >
          <span className="text-2xl">Close </span>
        </button>
      </div>
    </div>
  );
};
