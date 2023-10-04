use anchor_lang::prelude::*;
use anchor_lang::solana_program::{hash,slot_hashes,sysvar,clock::Slot};
use core::mem;

declare_id!("11111111111111111111111111111111");

fn get_rand_u8s(clock: &Clock, slot: u64, hash: [u8; 32]) -> [u8; 32] {
    const _: () = assert!(mem::size_of::<Clock>() == 40);
    const _: () = assert!(mem::size_of::<u64>() == 8);
    const _: () = assert!(mem::size_of::<hash::Hash>() == 32);

    let mut buf = Vec::<u8>::with_capacity(40 + 8 + 32);

    buf.extend_from_slice(&clock.slot.to_ne_bytes());
    buf.extend_from_slice(&clock.epoch_start_timestamp.to_ne_bytes());
    buf.extend_from_slice(&clock.epoch.to_ne_bytes());
    buf.extend_from_slice(&clock.leader_schedule_epoch.to_ne_bytes());
    buf.extend_from_slice(&clock.unix_timestamp.to_ne_bytes());

    buf.extend_from_slice(&slot.to_ne_bytes());
    buf.extend_from_slice(&hash);

    hash::hash(&buf).to_bytes()
}

fn select_card(game: &mut Game, mut seed: u8) -> Option<u8> {
    let mut i: usize = 0;
    while i < 52 {
	if game.deck[i] > 0 {
	    break
	}
	i += 1
    }
    if i >= 52 { return None }
    while seed >= game.deck[i] {
	seed -= game.deck[i];
	i += 1;
	i %= 52;
    }
    game.deck[i] -= 1;
    Some(i as u8)
}

fn calc_hi_lo_score(cards: &[u8]) -> (u8, u8) {
    let mut aces: u8 = 0;
    let mut score: u8 = 0;
    for card in cards {
	let card = card % 13;
	if card == 0 {
	    aces += 1
	}
	if card < 10 {
	    score = score.saturating_add(card);
	} else {
	    score += 10;
	}
    }
    if score < 11 && aces > 0 {
	(score + 11, score)
    } else {
	(score, score)
    }
}

#[error_code]
pub enum BlackJackError {
    #[msg("num_decks must be between one and eight")]
    BadNumDecks,
    #[msg("game is over - player bust")]
    GameOverPlayerBust,
    #[msg("game is over - dealer done")]
    GameOverDealerDone,
}


fn get_slot_hash_from_sysvar(slot_hashes: &UncheckedAccount) -> (u64, [u8; 32]) {
    #[repr(C)]
    struct SlotHashesData {
	size: u64,
	entries: [(Slot, [u8; 32]); slot_hashes::MAX_ENTRIES],
    }

    let slot_hashes = slot_hashes.data.borrow();
    let slot_hashes = slot_hashes.as_ptr();
    let slot_hashes = slot_hashes as *const SlotHashesData;
    let slot_hashes = unsafe { &*slot_hashes };

    //msg!("gshfs: size:{} slot:{} hash:{:?}", slot_hashes.size, slot_hashes.entries[0].0, slot_hashes.entries[0].1);

    slot_hashes.entries[0]
}

#[program]
pub mod blackjack {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
	let game: &mut Account<Game> = &mut ctx.accounts.game;
        game.player = ctx.accounts.player.key();
	assert_eq!(0, game.player_hand_size);
	assert_eq!(0, game.dealer_hand_size);
        Ok(())
    }

    pub fn deal(ctx: Context<Deal>, num_decks: u8) -> Result<()> {
	require!(num_decks >= 1 && num_decks <= 8, BlackJackError::BadNumDecks);

	let game = &mut ctx.accounts.game;
	for i in 0..52 {
	    game.deck[i] = num_decks
	}

	let (slot, hash) = get_slot_hash_from_sysvar(&ctx.accounts.slot_hashes);
	let seeds: [u8; 32] = get_rand_u8s(&Clock::get()?, slot, hash);
	game.dealer_hand[0] = select_card(game, seeds[0]).unwrap();
	game.player_hand[0] = select_card(game, seeds[1]).unwrap();
	game.player_hand[1] = select_card(game, seeds[2]).unwrap();
	game.dealer_hand_size = 1;
	game.player_hand_size = 2;
        Ok(())
    }

    pub fn hit(ctx: Context<Hit>) -> Result<()> {
	let game = &mut ctx.accounts.game;
	let (player_hi, _player_lo) = calc_hi_lo_score(&game.player_hand[0..game.player_hand_size as usize]);
	let (_dealer_hi, dealer_lo) = calc_hi_lo_score(&game.dealer_hand[0..game.dealer_hand_size as usize]);
	require!(player_hi <= 21, BlackJackError::GameOverPlayerBust);
	require!(dealer_lo <= 16, BlackJackError::GameOverDealerDone); // dealer hits on soft ace
	let (slot, hash) = get_slot_hash_from_sysvar(&ctx.accounts.slot_hashes);
	let seeds: [u8; 32] = get_rand_u8s(&Clock::get()?, slot, hash);
	let i = game.player_hand_size as usize;
	game.player_hand[i] = select_card(game, seeds[0]).unwrap();
	game.player_hand_size += 1;
        Ok(())
    }

    pub fn stand(ctx: Context<Stand>) -> Result<()> {
	let game = &mut ctx.accounts.game;
	let (player_hi, _player_lo) = calc_hi_lo_score(&game.player_hand[0..game.player_hand_size as usize]);
	let (_dealer_hi, dealer_lo) = calc_hi_lo_score(&game.dealer_hand[0..game.dealer_hand_size as usize]);
	require!(player_hi <= 21, BlackJackError::GameOverPlayerBust);
	require!(dealer_lo <= 16, BlackJackError::GameOverDealerDone); // dealer hits on soft ace
	let (slot, hash) = get_slot_hash_from_sysvar(&ctx.accounts.slot_hashes);
	let seeds: [u8; 32] = get_rand_u8s(&Clock::get()?, slot, hash);
	let mut i = game.dealer_hand_size as usize;
	for seed in seeds {
	    game.dealer_hand[i] = select_card(game, seed).unwrap();
	    i += 1;
	    let (_dealer_hi, dealer_lo) = calc_hi_lo_score(&game.dealer_hand[0..i]);
	    if dealer_lo > 21 || dealer_lo > player_hi {
		break
	    }
	}
        Ok(())
    }

    pub fn close(_ctx: Context<Close>) -> Result<()> {
        Ok(())
    }

    pub fn check(ctx: Context<Check>) -> Result<()> {
	let game = &ctx.accounts.game;
	let (player_hi, player_lo) = calc_hi_lo_score(&game.player_hand[0..game.player_hand_size as usize]);
	let (dealer_hi, dealer_lo) = calc_hi_lo_score(&game.dealer_hand[0..game.dealer_hand_size as usize]);
	msg!("check: plo:{} phi:{} dlo:{} dhi:{}", player_lo, player_hi, dealer_lo, dealer_hi);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = player, space = 140)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deal<'info> {
    #[account(mut, has_one = player)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
    #[account(address = sysvar::slot_hashes::id())]
    /// CHECK:
    pub slot_hashes: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct Hit<'info> {
    #[account(mut, has_one = player)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
    #[account(address = sysvar::slot_hashes::id())]
    /// CHECK:
    pub slot_hashes: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct Stand<'info> {
    #[account(mut, has_one = player)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
    #[account(address = sysvar::slot_hashes::id())]
    /// CHECK:
    pub slot_hashes: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut, has_one = player, close = player)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct Check<'info> {
    pub game: Account<'info, Game>,
}

#[account]
pub struct Game {
    pub player: Pubkey,
    pub deck: [u8; 52],
    pub player_hand: [u8; 23],
    pub player_hand_size: u8,
    pub dealer_hand: [u8; 23],
    pub dealer_hand_size: u8,
}
