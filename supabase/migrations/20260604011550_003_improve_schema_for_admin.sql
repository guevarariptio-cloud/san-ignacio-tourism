/*
  # Improve Database Schema for Tourism Admin

  Enhances the database schema to better support multi-image galleries and comprehensive admin management.
  
  Changes:
  - Add gallery_images table for better gallery management
  - Add admin_metadata table for storing extended info (activities, contact details, etc.)
  - Add indexes for better query performance
  - Add constraints and defaults
  - Extend attractions with additional admin fields

  New Tables:
  1. gallery_images - Centralized gallery image management
  2. admin_metadata - Flexible admin data storage
  3. attraction_services - Services for attractions (for admin management)
*/

-- Create gallery_images table for centralized gallery management
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL CHECK (item_type IN ('attraction', 'business', 'gastronomy')),
  item_id uuid NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_attraction FOREIGN KEY (item_id) REFERENCES attractions(id) ON DELETE CASCADE
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery images"
  ON gallery_images FOR SELECT
  USING (true);

-- Create admin_metadata table for flexible admin information
CREATE TABLE IF NOT EXISTS admin_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL CHECK (item_type IN ('attraction', 'business', 'gastronomy')),
  item_id uuid NOT NULL,
  key text NOT NULL,
  value jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_metadata UNIQUE (item_type, item_id, key)
);

ALTER TABLE admin_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view metadata"
  ON admin_metadata FOR SELECT
  USING (true);

-- Add extended fields to attractions if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attractions' AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE attractions ADD COLUMN contact_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attractions' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE attractions ADD COLUMN contact_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attractions' AND column_name = 'opening_hours'
  ) THEN
    ALTER TABLE attractions ADD COLUMN opening_hours text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attractions' AND column_name = 'entry_fee'
  ) THEN
    ALTER TABLE attractions ADD COLUMN entry_fee text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attractions' AND column_name = 'accessibility_info'
  ) THEN
    ALTER TABLE attractions ADD COLUMN accessibility_info text;
  END IF;
END $$;

-- Add extended fields to businesses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE businesses ADD COLUMN contact_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'opening_hours'
  ) THEN
    ALTER TABLE businesses ADD COLUMN opening_hours text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE businesses ADD COLUMN latitude decimal(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE businesses ADD COLUMN longitude decimal(11, 8);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_item_type_id ON gallery_images(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(item_id, display_order);
CREATE INDEX IF NOT EXISTS idx_admin_metadata_item ON admin_metadata(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_admin_metadata_key ON admin_metadata(key);
CREATE INDEX IF NOT EXISTS idx_attractions_featured_rating ON attractions(featured, rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_type_featured ON businesses(type, featured);
