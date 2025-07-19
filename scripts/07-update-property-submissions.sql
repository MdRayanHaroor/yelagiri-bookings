-- Update property submissions table to include new fields
ALTER TABLE property_submissions 
ADD COLUMN IF NOT EXISTS kitchen_amenities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS food_delivery_details TEXT,
ADD COLUMN IF NOT EXISTS toilet_info JSONB DEFAULT '{}';

-- Update room_types structure to include toilet information
-- Note: This will update the JSON structure for new submissions
-- Existing submissions will need to be handled separately if needed

-- Add some sample data with new structure
INSERT INTO property_submissions (
    name, description, short_description, address, area, phone, email,
    starting_price, total_rooms, owner_info, amenities, kitchen_amenities,
    room_types, food_delivery_details, status
) VALUES (
    'Test Hotel with New Features',
    'This is a test hotel submission with new amenities and toilet information.',
    'Test hotel with enhanced features',
    'Test Address, Yelagiri Hills',
    'Lake View Area',
    '+91 99999 77777',
    'newtest@hotel.com',
    2000.00,
    15,
    '{"name": "New Test Owner", "phone": "+91 99999 77777", "email": "newowner@test.com"}',
    '["Free WiFi", "Parking", "Restaurant", "Carrom", "Smart TV", "Terrace"]',
    '["Gas Stove", "Refrigerator", "Kitchen Utensils"]',
    '[{"name": "Deluxe Room", "price": "2000", "occupancy": "2", "toilet_type": "attached", "toilet_count": "1"}]',
    'Food delivery available from 7 AM to 11 PM. Partner restaurants include local favorites.',
    'pending'
);
