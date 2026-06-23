-- Run this in Supabase SQL editor
-- Adds columns and tables needed for auto deal sync

-- deals: add columns for auto-sync
ALTER TABLE deals
  ADD COLUMN IF NOT EXISTS cf_product_id TEXT UNIQUE,       -- Commission Factory product ID
  ADD COLUMN IF NOT EXISTS expires_at    TIMESTAMPTZ,       -- auto-expire date
  ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ DEFAULT NOW();

-- Index for fast expiry queries
CREATE INDEX IF NOT EXISTS deals_expires_at_idx ON deals (expires_at)
  WHERE is_active = true;

-- Index for CF upserts
CREATE INDEX IF NOT EXISTS deals_cf_product_id_idx ON deals (cf_product_id)
  WHERE cf_product_id IS NOT NULL;

-- sync_log: track every cron run
CREATE TABLE IF NOT EXISTS sync_log (
  id           BIGSERIAL PRIMARY KEY,
  ran_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deals_synced INT         DEFAULT 0,
  deals_expired INT        DEFAULT 0,
  notes        TEXT,
  error        TEXT
);

-- View the last 10 sync runs
-- SELECT ran_at, deals_synced, deals_expired, error FROM sync_log ORDER BY ran_at DESC LIMIT 10;
