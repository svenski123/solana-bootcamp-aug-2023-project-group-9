use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod blackjack {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
