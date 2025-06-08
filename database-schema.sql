-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid INTEGER UNIQUE NOT NULL,
  username TEXT,
  display_name TEXT,
  pfp_url TEXT,
  bio TEXT, -- Added since we fetch this from Farcaster
  wallet_address TEXT, -- Track connected wallet
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(), -- Track when user data was refreshed
  last_seen TIMESTAMP DEFAULT NOW()
);

-- Activity table (purchases, listings, shares, likes)
CREATE TABLE activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('purchase', 'listing', 'share', 'like', 'view')),
  nft_contract TEXT NOT NULL,
  nft_token_id TEXT NOT NULL,
  nft_name TEXT,
  collection_name TEXT, -- Added for better organization
  marketplace_listing_id TEXT, -- Track specific marketplace listing
  price_eth DECIMAL(18,8), -- Specify precision for ETH (18 decimals)
  price_usd DECIMAL(12,2), -- USD equivalent at time of activity
  tx_hash TEXT,
  block_number BIGINT, -- Better blockchain tracking
  from_address TEXT, -- For transfers/purchases
  to_address TEXT, -- For transfers/purchases
  cast_hash TEXT, -- If shared via Farcaster
  metadata JSONB, -- Flexible field for additional data
  created_at TIMESTAMP DEFAULT NOW()
);

-- User favorites/watchlist
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nft_contract TEXT NOT NULL,
  nft_token_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, nft_contract, nft_token_id) -- Prevent duplicates
);

-- NFT Collections metadata (optional - for better UX)
CREATE TABLE nft_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_address TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  floor_price_eth DECIMAL(18,8),
  total_volume_eth DECIMAL(18,8),
  total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_fid ON users(fid);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_activity_user ON activity(user_id);
CREATE INDEX idx_activity_type ON activity(activity_type);
CREATE INDEX idx_activity_nft ON activity(nft_contract, nft_token_id);
CREATE INDEX idx_activity_created ON activity(created_at DESC);
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_collections_contract ON nft_collections(contract_address);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON nft_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_collections ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your auth strategy)
-- Users can read all user data but only update their own
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Activity is readable by all, writable by authenticated users
CREATE POLICY "Activity is viewable by everyone" ON activity FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert activity" ON activity FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites" ON user_favorites USING (auth.uid()::text = user_id::text);

-- Collections are readable by all, writable by service role
CREATE POLICY "Collections are viewable by everyone" ON nft_collections FOR SELECT USING (true); 