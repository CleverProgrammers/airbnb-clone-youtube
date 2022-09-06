use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub last_airbnb: u8,
    pub airbnb_count: u8,
}

/// Size 2605 = 32 + 1 + 4 + 256 + 4 + 2048 + 4 + 256
#[account]
#[derive(Default)]
pub struct AirbnbAccount {
    pub authority: Pubkey,   // 32
    pub idx: u8,             // 1
    pub location: String, // 4 + 256
    pub country: String, // 4 + 256
    pub image: String,   // 4 + 2048
    pub price: String,   // 4 + 256
    pub isReserved: bool // 8
}

#[account]
#[derive(Default)]
pub struct BookingAccount {
    pub authority: Pubkey, //32
    pub date: String, // 4 + 256
    pub idx: u8, // 1
    pub location: String, // 4 + 256
    pub country: String, // 4 + 256
    pub image: String,   // 4 + 2048
    pub price: String,   // 4 + 256
    pub isReserved: bool // 8
}