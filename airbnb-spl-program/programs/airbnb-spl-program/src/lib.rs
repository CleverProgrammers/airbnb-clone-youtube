use anchor_lang::prelude::*;
pub mod constant;
pub mod states;
use crate::{constant::*, states::*};

declare_id!("J5yzCZrNZJR6K5FUwwZ2SzjTvg8DzomcYqcaZJm27Y6v");

#[program]
pub mod clever_airbnb {
    use super::*;

    pub fn initialize_user(
        ctx: Context<InitializeUser>
    ) -> Result<()> {
        // Initialize user profile with default data
  
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_airbnb = 0;
        user_profile.airbnb_count = 0;

        Ok(())
    }

    pub fn add_airbnb(
        ctx: Context<AddAirbnb>, 
        location: String, 
        country: String, 
        price: String,
        img: String,
    ) -> Result<()> {
        let airbnb_account = &mut ctx.accounts.airbnb_account;
        let user_profile = &mut ctx.accounts.user_profile;

        // Fill contents with argument
        airbnb_account.authority = ctx.accounts.authority.key();
        airbnb_account.idx = user_profile.last_airbnb;
        airbnb_account.location = location;
        airbnb_account.country = country;
        airbnb_account.price = price;
        airbnb_account.image = img;
        airbnb_account.isReserved = false;

        // Increase airbnb idx for PDA
        user_profile.last_airbnb = user_profile.last_airbnb
            .checked_add(1)
            .unwrap();

        // Increase total airbnb count
        user_profile.airbnb_count = user_profile.airbnb_count
            .checked_add(1)
            .unwrap();

        Ok(())
    }

    pub fn update_airbnb(
        ctx: Context<UpdateAirbnb>, 
        airbnb_idx: u8,
        location: String, 
        country: String, 
        price: String,
        img: String,
    ) -> Result<()> {
        let airbnb_account = &mut ctx.accounts.airbnb_account;

        // Mark todo
        airbnb_account.location = location;
        airbnb_account.country = country;
        airbnb_account.price = price;
        airbnb_account.image = img;
        Ok(())
    }

    pub fn remove_airbnb(ctx: Context<RemoveAirbnb>, _airbnb_idx: u8) -> Result<()> {
        // Decreate total airbnb count
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.airbnb_count = user_profile.airbnb_count
            .checked_sub(1)
            .unwrap();

        // No need to decrease last airbnb idx

        // Todo PDA already closed in context

        Ok(())
    }

    // Need a function that reserves an Airbnb
    pub fn book_airbnb(
        ctx: Context<BookAirbnb>,
        idx: u8,
        date: String,
        location: String, 
        country: String, 
        price: String,
        img: String,
    ) -> Result<()> {
        let booking_account = &mut ctx.accounts.booking_account;
        
        // // Fill contents with argument
        booking_account.authority = ctx.accounts.authority.key();
        booking_account.idx = idx;
        booking_account.date = date;
        booking_account.location = location;
        booking_account.country = country;
        booking_account.price = price;
        booking_account.image = img;
        booking_account.isReserved = true;

        
        Ok(())
    }

    pub fn cancel_booking(ctx: Context<CancelBook>, _booking_idx: u8) -> Result<()> {
        // Decreate total airbnb count
        let user_profile = &mut ctx.accounts.user_profile;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddAirbnb<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [AIRBNB_TAG, authority.key().as_ref(), &[user_profile.last_airbnb]],
        bump,
        payer = authority,
        space = 2865 + 8,
    )]
    pub airbnb_account: Box<Account<'info, AirbnbAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(airbnb_idx: u8)]
pub struct UpdateAirbnb<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        mut,
        seeds = [AIRBNB_TAG, authority.key().as_ref(), &[airbnb_idx].as_ref()],
        bump,
        has_one = authority,
    )]
    pub airbnb_account: Box<Account<'info, AirbnbAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(airbnb_idx: u8)]
pub struct RemoveAirbnb<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,
 
    #[account(
        mut,
        close = authority,
        seeds = [AIRBNB_TAG, authority.key().as_ref(), &[airbnb_idx].as_ref()],
        bump,
        has_one = authority,
    )]
    pub airbnb_account: Box<Account<'info, AirbnbAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// #[instruction()]
// pub struct BookAirbnb<'info> {
//     #[account(
//         mut,
//         seeds = [USER_TAG, authority.key().as_ref()],
//         bump,
//         has_one = authority,
//     )]
//     pub user_profile: Box<Account<'info, UserProfile>>,

//     #[account(
//         init,
//         seeds = [BOOK_TAG, airbnb_account.key().as_ref()],
//         bump,
//         payer = booking_authority,
//         space = 3125 + 8,
//     )]
//     pub booking_account: Box<Account<'info, BookingAccount>>,

//     #[account(mut)]
//     pub authority: Signer<'info>,

//     pub system_program: Program<'info, System>,
// }

#[derive(Accounts)]
#[instruction()]
pub struct BookAirbnb<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,
    
    #[account(
        init,
        seeds = [BOOK_TAG, authority.key().as_ref() ],
        bump,
        payer = authority,
        space = 3125 + 8,
    )]
    pub booking_account: Box<Account<'info, BookingAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelBook<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,
 
    #[account(
        mut,
        close = authority,
        seeds = [BOOK_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub booking_account: Box<Account<'info, BookingAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
