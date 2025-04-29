-- Initial database schema for Crypto Trader SaaS

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    subscription_tier TEXT DEFAULT 'free_trial',
    subscription_expires TIMESTAMP,
    preferences TEXT -- JSON string for user preferences
);

-- API Credentials table (encrypted)
CREATE TABLE IF NOT EXISTS api_credentials (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    provider TEXT NOT NULL, -- 'coinbase', etc.
    encrypted_key TEXT NOT NULL,
    encrypted_secret TEXT NOT NULL,
    is_sandbox BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Trading Settings table
CREATE TABLE IF NOT EXISTS trading_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    max_transaction_percent REAL DEFAULT 20.0,
    max_position_percent REAL DEFAULT 20.0,
    trading_frequency TEXT DEFAULT 'Optimal',
    risk_level TEXT DEFAULT 'Medium',
    active_cryptocurrencies TEXT, -- JSON array of active crypto symbols
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Trade History table
CREATE TABLE IF NOT EXISTS trade_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    side TEXT NOT NULL, -- 'BUY' or 'SELL'
    size REAL NOT NULL,
    price REAL NOT NULL,
    value REAL NOT NULL,
    order_id TEXT,
    status TEXT NOT NULL,
    reasoning TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Portfolio Snapshots table
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    snapshot_data TEXT NOT NULL, -- JSON string of portfolio data
    total_value REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI Analysis Logs table
CREATE TABLE IF NOT EXISTS ai_analysis_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    analysis_type TEXT NOT NULL, -- 'technical', 'sentiment', 'recommendation'
    analysis_data TEXT NOT NULL, -- JSON string of analysis data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trade_history_user_id ON trade_history(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_history_product_id ON trade_history(product_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_user_id ON portfolio_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_logs_user_id ON ai_analysis_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_credentials_user_id ON api_credentials(user_id);
