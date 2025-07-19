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

-- Update property_submissions table to include individual_rooms
ALTER TABLE property_submissions 
ADD COLUMN IF NOT EXISTS individual_rooms JSONB DEFAULT '[]';

-- Create a function to automatically calculate general amenities from individual rooms
CREATE OR REPLACE FUNCTION calculate_general_amenities(rooms JSONB)
RETURNS TEXT[] AS $$
DECLARE
    amenities TEXT[] := '{}';
    room JSONB;
    room_amenity TEXT;
BEGIN
    -- Loop through each room
    FOR room IN SELECT * FROM jsonb_array_elements(rooms)
    LOOP
        -- Add amenities based on room features
        IF (room->>'has_ac')::boolean = true THEN
            amenities := array_append(amenities, 'Air Conditioning');
        END IF;
        
        IF (room->>'has_ceiling_fan')::boolean = true THEN
            amenities := array_append(amenities, 'Ceiling Fan');
        END IF;
        
        IF (room->>'has_balcony_access')::boolean = true THEN
            amenities := array_append(amenities, 'Balcony Access');
        END IF;
        
        IF (room->>'has_attached_toilet')::boolean = true THEN
            amenities := array_append(amenities, 'Attached Bathroom');
        END IF;
        
        IF (room->>'has_cupboard')::boolean = true THEN
            amenities := array_append(amenities, 'Cupboard/Wardrobe');
        END IF;
        
        -- Add room-specific amenities
        IF room ? 'room_amenities' THEN
            FOR room_amenity IN SELECT * FROM jsonb_array_elements_text(room->'room_amenities')
            LOOP
                amenities := array_append(amenities, room_amenity);
            END LOOP;
        END IF;
    END LOOP;
    
    -- Remove duplicates and return
    RETURN ARRAY(SELECT DISTINCT unnest(amenities));
END;
$$ LANGUAGE plpgsql;

-- Create amenities table if it doesn't exist
CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default amenities
INSERT INTO amenities (name, icon, category) VALUES
-- General amenities
('Free WiFi', 'wifi', 'connectivity'),
('Swimming Pool', 'waves', 'recreation'),
('Restaurant', 'utensils', 'dining'),
('Free Parking', 'car', 'parking'),
('Air Conditioning', 'snowflake', 'comfort'),
('Spa Services', 'flower', 'wellness'),
('Gym/Fitness Center', 'dumbbell', 'fitness'),
('24/7 Room Service', 'room-service', 'service'),
('Conference Hall', 'users', 'business'),
('Kids Play Area', 'baby', 'family'),
('Garden/Lawn', 'tree', 'outdoor'),
('Travel Desk', 'map', 'service'),
('Doctor on Call', 'stethoscope', 'medical'),
('Bonfire Area', 'flame', 'outdoor'),
('Adventure Sports', 'mountain', 'recreation'),
('Pet Friendly', 'heart', 'policy'),
('Carrom', 'square', 'games'),
('Cycles', 'bike', 'transport'),
('Terrace', 'building', 'outdoor'),
('Smart TV', 'tv', 'entertainment'),
('TV (Normal)', 'monitor', 'entertainment'),
('Heater (Hot Water)', 'thermometer', 'comfort'),
('Food Delivery', 'truck', 'dining'),
('Ceiling Fan', 'fan', 'comfort'),
('Balcony Access', 'door-open', 'outdoor'),
('Attached Bathroom', 'bath', 'facilities'),
('Cupboard/Wardrobe', 'cabinet', 'furniture')
ON CONFLICT (name) DO NOTHING;

-- Sample data for testing individual rooms
INSERT INTO individual_rooms (
    room_name, floor, room_type, max_occupancy, base_price,
    has_attached_toilet, toilet_count, bed_type, has_mattress, has_cupboard,
    has_ac, has_ceiling_fan, has_balcony_access, room_amenities
) VALUES 
(
    'Deluxe Room 101', 'Ground Floor', 'deluxe', 2, 2500.00,
    true, 1, 'Queen', true, true,
    true, true, true, '["WiFi", "TV", "Mini Fridge"]'
),
(
    'Standard Room 102', 'Ground Floor', 'double', 2, 1800.00,
    true, 1, 'Double', true, true,
    false, true, false, '["WiFi", "TV"]'
),
(
    'Family Suite 201', '1st Floor', 'family', 4, 3500.00,
    true, 2, 'King', true, true,
    true, true, true, '["WiFi", "Smart TV", "Mini Fridge", "Sofa/Seating Area"]'
);
