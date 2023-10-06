import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Blackjack } from "../target/types/blackjack";
import { SYSVAR_SLOT_HASHES_PUBKEY } from "@solana/web3.js";

describe("blackjack", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);

    const LAMPORTS_PER_SOL = 1000000000;

    const program = anchor.workspace.Blackjack as Program<Blackjack>;
    const game = anchor.web3.Keypair.generate();
    const player = anchor.web3.Keypair.generate();

    before(async () => {
	// Top up all acounts that will need lamports for account creation
	await provider.connection.confirmTransaction(
	    await provider.connection.requestAirdrop(
		player.publicKey,
		2 * LAMPORTS_PER_SOL
	    )
	);
    });

    it("Is initialized!", async () => {
	const tx = await program.methods
	    .initialize()
	    .accounts({game: game.publicKey,
		       player: player.publicKey})
	    .signers([game,
		      player])
	    .rpc();
	console.log("Your transaction signature", tx);
    });

    it("Is dealt!", async () => {
	const tx = await program.methods.deal(1)
	    .accounts({game: game.publicKey,
		       player: player.publicKey,
		       slotHashes: SYSVAR_SLOT_HASHES_PUBKEY})
	    .signers([player])
	    .rpc();
	console.log("Your transaction signature", tx);
    });

    for (let i = 0; i < 3; ++i) {
    it("Is hit!", async () => {
	const tx = await program.methods.hit()
	    .accounts({game: game.publicKey,
		       player: player.publicKey,
		       slotHashes: SYSVAR_SLOT_HASHES_PUBKEY})
	    .signers([player])
	    .rpc();
	console.log("Your transaction signature", tx);
    });
    }

    it("Is stand!", async () => {
	const tx = await program.methods.stand()
	    .accounts({game: game.publicKey,
		       player: player.publicKey,
		       slotHashes: SYSVAR_SLOT_HASHES_PUBKEY})
	    .signers([player])
	    .rpc();
	console.log("Your transaction signature", tx);
    });

    it("Is closed!", async () => {
	const tx = await program.methods.close()
	    .accounts({game: game.publicKey,
		       player: player.publicKey})
	    .signers([player])
	    .rpc();
	console.log("Your transaction signature", tx);
    });

    if (0) {
    it("Is checked!", async () => {
	const tx = await program.methods.check()
	    .accounts({game: game.publicKey})
	    .rpc();
	console.log("Your transaction signature", tx);
    });
    }
});
