-- Create cat_clicks table in Supabase
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS cat_clicks (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_clicks INTEGER NOT NULL DEFAULT 0,
  last_clicked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial record if it doesn't exist
INSERT INTO cat_clicks (id, total_clicks, last_clicked_at, created_at)
VALUES (1, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable real-time updates for this table
ALTER PUBLICATION supabase_realtime ADD TABLE cat_clicks;

-- Optional: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_cat_clicks_id ON cat_clicks(id);
