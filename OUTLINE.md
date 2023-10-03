# Solana Blackjack

General Overview: <https://en.wikipedia.org/wiki/Blackjack>

## Version One:
- 13 ranks: A 2 3 4 5 6 7 8 9 J Q K
- 4 suits: H D C S
- Values of cards:
-- Cards numbered 2-9 are worth their face number
-- J Q K are worth ten each
-- A is worth either one or eleven
- One deck consists of 52 cards
- Single player versus dealer
- Start of play
-- 1 deck of cards are "shuffled"
-- 2 cards dealt to player face up
-- 1 card dealt to dealer face up
- Player round
-- If player stands, goto dealer round
-- If player hits, then:
--- 1 card dealt to player face up
--- If total value of hand greater than 21, then go player bust
--- Else goto player round
- Dealer round
-- If dealer hand worth less than 17, then:
--- 1 card dealt to dealer face up
--- If total value of hand greater than 21, then go dealer bust
--- Else goto dealer round
-- Else dealer stands and goto faceoff
- Faceoff
-- If player hand worth more than dealer's, then dealer wins
-- Else if player hand worth less than dealer's, then player wins
-- Else player and dealer tie

Program On-Chain Account Types:
- (1) Program (BPLLoaderUpgradeable)
- (n) Game

Game Account Layout
- Header
-- Version of game
-- Type of account (only one now: game)
- Player pubkey
- Array of remaining undealt cards by suit/rank in deck
-- 52 byte array of u8 representing number of cards of given suit and rank remaining in deck
-- index is 13*suit+rank
--- suit: H D C S => 0 1 2 3
--- rank: A 2 3 4 5 6 7 8 9 J Q K => 0 1 2 3 4 5 6 7 8 9 a b
- Array of cards dealt to player
-- 23 byte array of u8 representing cards dealt to player
- Number (u8) of cards dealt to player
- Array of cards dealt to dealer
-- 23 byte array of u8 representing cards dealt to player
- Number (u8) of cards dealt to player
- Number of remaining cards (u16; u8 only allows up to four decks: 4*52=208<256)

Program Actions
- Create New Game
-- Initialise new game account
-- Set player pubkey (player must sign)
-- Initialise undealt card deck
- Deal
-- Only valid on initialise game account (empty hands etc.)
-- Select two cards from deck, append to player hand
-- Select one card from deck, append to dealer hand
-- Anybody can sign
- Hit
-- Only valid if player not bust and dealer hand worth less than seventeen
-- Select one card from deck, append to player hand
-- Player must sign
- Stand
-- Only valid if player not bust and dealer hand worth less than seventeen
-- While dealer hand < 17 and dealer not bust:
--- Select one card from deck, append to dealer hand
-- Player must sign
- Cleanup game
-- Only valid if dealer hand worth seventeen or more (i.e. game is finished)
-- Return game account rent to player
-- Anybody can sign

## Notes / Comments
- Largest number of cards in valid hand with one deck is 11: AAAA2222333
- Largest number of cards in valid hand with six decks is 21: AAAAAAAAAAAAAAAAAAAAA
- Array of undealt cards can be worked out from number of decks and cards already dealt
-- This saves space, but is it computationally feasible?
- Selecting a card involves choosing an undealt card at random which can be done in multiple ways:
-- Method One
--- Generate C = random number modulo 52; (C represent a card of given suit & rank)
--- If deck_array[C] > 0, decrement deck_array[C] and return C as selected card
--- Otherwise no card of given suit & rank remain; generate new random nunber and repeat
-- Method Two
--- Generate N = random number modulo (52 * number of decks - number of cards already dealt)
--- Set *P = &deck_array[0]; while (N>0) { N-=*P; }; C = P-&deck_array[0]
--- (to paraphrase, walk N cards forward from start of deck array
