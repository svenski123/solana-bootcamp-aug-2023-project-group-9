import * as anchor from "@coral-xyz/anchor";
import { ConfirmOptions } from "@solana/web3.js";

export const PROGRAM_ID = new anchor.web3.PublicKey(
  "11111111111111111111111111111111"
);

export const OPTS = {
  preflightCommitment: "processed",
} as ConfirmOptions;

const endpoint = "http://localhost:8899";

export const connection = new anchor.web3.Connection(
  endpoint,
  OPTS.preflightCommitment
);
