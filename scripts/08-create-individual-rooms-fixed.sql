-- Create individual_rooms table for detailed room management
CREATE TABLE IF NOT EXISTS individual_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES property_submissions(id) ON DELETE CASCADE,
    
    -- Basic room information
    room_name VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) NOT NULL DEFAULT 'double',
    max_occupancy INTEGER NOT NULL DEFAULT 2,
    base_price DECIMAL(10,2) NOT NULL,
    
    -- Toilet facilities
    has_attached_toilet BOOLEAN DEFAULT true,
    toilet_count INTEGER DEFAULT 1,
    
    -- Furniture & Bedding
    bed_type VARCHAR(50) DEFAULT 'Double',
    has_mattress BOOLEAN DEFAULT true,
    has_cupboard BOOLEAN DEFAULT true,
    
    -- Electrical & Comfort
    has_ac BOOLEAN DEFAULT false,
    has_ceiling_fan BOOLEAN DEFAULT true,
    has_balcony_access BOOLEAN DEFAULT false,
    
    -- Additional amenities (JSON array)
    room_amenities JSONB DEFAULT '[]',
    
    -- Status and availability
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_individual_rooms_hotel_id ON individual_rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_individual_rooms_submission_id ON individual_rooms(submission_id);
CREATE INDEX IF NOT EXISTS idx_individual_rooms_room_type ON individual_rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_individual_rooms_is_available ON individual_rooms(is_available);

-- Add individual_rooms column to property_submissions table
ALTER TABLE property_submissions 
ADD COLUMN IF NOT EXISTS individual_rooms JSONB DEFAULT '[]';

-- Add kitchen_amenities column if it doesn't exist
ALTER TABLE property_submissions 
ADD COLUMN IF NOT EXISTS kitchen_amenities JSONB DEFAULT '[]';

-- Add food_delivery_details column if it doesn't exist
ALTER TABLE property_submissions 
ADD COLUMN IF NOT EXISTS food_delivery_details TEXT;

-- Create amenities table if it doesn't exist
CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on amenities name
CREATE UNIQUE INDEX IF NOT EXISTS idx_amenities_name_unique ON amenities(name);

-- Insert default amenities (using INSERT with WHERE NOT EXISTS to avoid conflicts)
INSERT INTO amenities (name, icon, category) 
SELECT 'Free WiFi', 'wifi', 'connectivity'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Free WiFi');

INSERT INTO amenities (name, icon, category) 
SELECT 'Swimming Pool', 'waves', 'recreation'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Swimming Pool');

INSERT INTO amenities (name, icon, category) 
SELECT 'Restaurant', 'utensils', 'dining'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Restaurant');

INSERT INTO amenities (name, icon, category) 
SELECT 'Free Parking', 'car', 'parking'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Free Parking');

INSERT INTO amenities (name, icon, category) 
SELECT 'Air Conditioning', 'snowflake', 'comfort'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Air Conditioning');

INSERT INTO amenities (name, icon, category) 
SELECT 'Spa Services', 'flower', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Spa Services');

INSERT INTO amenities (name, icon, category) 
SELECT 'Gym/Fitness Center', 'dumbbell', 'fitness'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Gym/Fitness Center');

INSERT INTO amenities (name, icon, category) 
SELECT '24/7 Room Service', 'room-service', 'service'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = '24/7 Room Service');

INSERT INTO amenities (name, icon, category) 
SELECT 'Conference Hall', 'users', 'business'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Conference Hall');

INSERT INTO amenities (name, icon, category) 
SELECT 'Kids Play Area', 'baby', 'family'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Kids Play Area');

INSERT INTO amenities (name, icon, category) 
SELECT 'Garden/Lawn', 'tree', 'outdoor'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Garden/Lawn');

INSERT INTO amenities (name, icon, category) 
SELECT 'Travel Desk', 'map', 'service'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Travel Desk');

INSERT INTO amenities (name, icon, category) 
SELECT 'Doctor on Call', 'stethoscope', 'medical'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Doctor on Call');

INSERT INTO amenities (name, icon, category) 
SELECT 'Bonfire Area', 'flame', 'outdoor'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Bonfire Area');

INSERT INTO amenities (name, icon, category) 
SELECT 'Adventure Sports', 'mountain', 'recreation'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Adventure Sports');

INSERT INTO amenities (name, icon, category) 
SELECT 'Pet Friendly', 'heart', 'policy'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Pet Friendly');

INSERT INTO amenities (name, icon, category) 
SELECT 'Carrom', 'square', 'games'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Carrom');

INSERT INTO amenities (name, icon, category) 
SELECT 'Cycles', 'bike', 'transport'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Cycles');

INSERT INTO amenities (name, icon, category) 
SELECT 'Terrace', 'building', 'outdoor'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Terrace');

INSERT INTO amenities (name, icon, category) 
SELECT 'Smart TV', 'tv', 'entertainment'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Smart TV');

INSERT INTO amenities (name, icon, category) 
SELECT 'TV (Normal)', 'monitor', 'entertainment'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'TV (Normal)');

INSERT INTO amenities (name, icon, category) 
SELECT 'Heater (Hot Water)', 'thermometer', 'comfort'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Heater (Hot Water)');

INSERT INTO amenities (name, icon, category) 
SELECT 'Food Delivery', 'truck', 'dining'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Food Delivery');

INSERT INTO amenities (name, icon, category) 
SELECT 'Ceiling Fan', 'fan', 'comfort'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Ceiling Fan');

INSERT INTO amenities (name, icon, category) 
SELECT 'Balcony Access', 'door-open', 'outdoor'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Balcony Access');

INSERT INTO amenities (name, icon, category) 
SELECT 'Attached Bathroom', 'bath', 'facilities'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Attached Bathroom');

INSERT INTO amenities (name, icon, category) 
SELECT 'Cupboard/Wardrobe', 'cabinet', 'furniture'
WHERE NOT EXISTS (SELECT 1 FROM amenities WHERE name = 'Cupboard/Wardrobe');
