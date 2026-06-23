-- Run this in your Supabase SQL editor
-- Adds the columns Negoshi needs that may not exist yet

-- providers: logo display
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS logo_color TEXT NOT NULL DEFAULT '#1B4332',
  ADD COLUMN IF NOT EXISTS logo_text  TEXT NOT NULL DEFAULT '?';

-- deals: pricing & metadata
ALTER TABLE deals
  ADD COLUMN IF NOT EXISTS retail_price        NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS is_featured         BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_member_exclusive BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS affiliate_url       TEXT    NOT NULL DEFAULT '#',
  ADD COLUMN IF NOT EXISTS is_active           BOOLEAN NOT NULL DEFAULT true;

-- Seed some sample deals so the homepage isn't empty
INSERT INTO providers (name, logo_color, logo_text) VALUES
  ('Telstra',          '#0057B8', 'TEL'),
  ('Optus',            '#FF6B00', 'OPT'),
  ('Aussie Broadband', '#1B4332', 'ABB'),
  ('Superloop',        '#8B1CF5', 'SLP')
ON CONFLICT (name) DO NOTHING;

-- (Adjust category ids to match your actual categories table)
-- INSERT INTO deals (...) VALUES (...) -- add real deals manually via Supabase dashboard
