-- Fix user_role enum and create missing tables
DO $$ 
BEGIN
    -- Create user_role enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('guest', 'partner', 'admin');
    END IF;
END $$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role user_role DEFAULT 'guest',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to property_submissions if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'property_submissions' AND column_name = 'individual_rooms') THEN
        ALTER TABLE property_submissions ADD COLUMN individual_rooms INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'property_submissions' AND column_name = 'room_details') THEN
        ALTER TABLE property_submissions ADD COLUMN room_details TEXT;
    END IF;
END $$;

-- Update hotels table to ensure all required columns exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'slug') THEN
        ALTER TABLE hotels ADD COLUMN slug VARCHAR(255) UNIQUE;
        -- Generate slugs for existing hotels
        UPDATE hotels SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '''', '')) WHERE slug IS NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'short_description') THEN
        ALTER TABLE hotels ADD COLUMN short_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'website') THEN
        ALTER TABLE hotels ADD COLUMN website VARCHAR(255);
    END IF;
END $$;

-- Ensure room_types table has only existing columns
CREATE TABLE IF NOT EXISTS room_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    max_occupancy INTEGER NOT NULL,
    bed_type VARCHAR(100),
    has_ac BOOLEAN DEFAULT FALSE,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_tv BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data if tables are empty
INSERT INTO users (email, password_hash, full_name, role, is_verified) 
VALUES 
    ('admin@yelagiribookings.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin', TRUE),
    ('partner@yelagiribookings.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Partner User', 'partner', TRUE),
    ('guest@yelagiribookings.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Guest User', 'guest', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Ensure we have the test hotel
INSERT INTO hotels (
    id, name, slug, description, short_description, location, area, address, phone, email, 
    total_rooms, starting_price, average_rating, total_reviews, is_featured, status, created_at, updated_at
) VALUES (
    'yelagiri-hills-grand-resort-id',
    'Yelagiri Hills Grand Resort',
    'yelagiri-hills-grand-resort',
    'Experience luxury and tranquility at Yelagiri Hills Grand Resort, nestled in the scenic hills of Yelagiri. Our resort offers breathtaking views, world-class amenities, and exceptional service to make your stay unforgettable. Perfect for couples, families, and business travelers seeking a peaceful retreat in nature.',
    'Luxury resort with scenic hill views and world-class amenities in Yelagiri Hills',
    'Yelagiri',
    'Yelagiri Hills',
    'Punganur Lake Road, Yelagiri Hills, Tamil Nadu 635853',
    '+91 98765 43210',
    'info@yelagirihillsresort.com',
    50,
    3500,
    4.5,
    127,
    true,
    'active',
    NOW(),
    NOW()
) ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    area = EXCLUDED.area,
    updated_at = NOW();

-- Add room types for the hotel
INSERT INTO room_types (
    id, hotel_id, name, description, base_price, max_occupancy, bed_type, 
    has_ac, has_wifi, has_tv, created_at, updated_at
) VALUES 
(
    'deluxe-room-id',
    'yelagiri-hills-grand-resort-id',
    'Deluxe Room',
    'Spacious room with hill views, modern amenities, and comfortable furnishing. Perfect for couples seeking a romantic getaway.',
    3500,
    2,
    'King Size Bed',
    true,
    true,
    true,
    NOW(),
    NOW()
),
(
    'suite-room-id',
    'yelagiri-hills-grand-resort-id',
    'Executive Suite',
    'Luxurious suite with separate living area, panoramic hill views, and premium amenities. Ideal for families and extended stays.',
    5500,
    4,
    'King Size Bed + Sofa Bed',
    true,
    true,
    true,
    NOW(),
    NOW()
),
(
    'standard-room-id',
    'yelagiri-hills-grand-resort-id',
    'Standard Room',
    'Comfortable room with essential amenities and partial hill views. Great value for budget-conscious travelers.',
    2500,
    2,
    'Queen Size Bed',
    false,
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    updated_at = NOW();

-- Add hotel images
INSERT INTO hotel_images (
    id, hotel_id, image_url, alt_text, is_primary, display_order, image_type, created_at
) VALUES
(
    'hotel-image-1',
    'yelagiri-hills-grand-resort-id',
    '/placeholder.svg?height=400&width=600&text=Yelagiri+Hills+Resort+Exterior',
    'Yelagiri Hills Grand Resort Exterior View',
    true,
    1,
    'exterior',
    NOW()
),
(
    'hotel-image-2',
    'yelagiri-hills-grand-resort-id',
    '/placeholder.svg?height=400&width=600&text=Resort+Interior+Lobby',
    'Resort Lobby Interior',
    false,
    2,
    'interior',
    NOW()
),
(
    'hotel-image-3',
    'yelagiri-hills-grand-resort-id',
    '/placeholder.svg?height=400&width=600&text=Hill+View+from+Resort',
    'Scenic Hill View from Resort',
    false,
    3,
    'view',
    NOW()
),
(
    'hotel-image-4',
    'yelagiri-hills-grand-resort-id',
    '/placeholder.svg?height=400&width=600&text=Resort+Swimming+Pool',
    'Resort Swimming Pool',
    false,
    4,
    'amenity',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Add amenities and link them to the hotel
INSERT INTO amenities (id, name, category, icon, description, is_active) VALUES
('wifi-amenity', 'Free WiFi', 'connectivity', 'wifi', 'High-speed internet access', true),
('parking-amenity', 'Free Parking', 'convenience', 'car', 'Complimentary parking space', true),
('restaurant-amenity', 'Restaurant', 'dining', 'utensils', 'On-site dining options', true),
('pool-amenity', 'Swimming Pool', 'recreation', 'waves', 'Outdoor swimming pool', true),
('gym-amenity', 'Fitness Center', 'recreation', 'dumbbell', 'Well-equipped gym', true),
('spa-amenity', 'Spa Services', 'wellness', 'flower', 'Relaxing spa treatments', true)
ON CONFLICT (id) DO NOTHING;

-- Link amenities to the hotel
INSERT INTO hotel_amenities (id, hotel_id, amenity_id, created_at) VALUES
('hotel-wifi-link', 'yelagiri-hills-grand-resort-id', 'wifi-amenity', NOW()),
('hotel-parking-link', 'yelagiri-hills-grand-resort-id', 'parking-amenity', NOW()),
('hotel-restaurant-link', 'yelagiri-hills-grand-resort-id', 'restaurant-amenity', NOW()),
('hotel-pool-link', 'yelagiri-hills-grand-resort-id', 'pool-amenity', NOW()),
('hotel-gym-link', 'yelagiri-hills-grand-resort-id', 'gym-amenity', NOW()),
('hotel-spa-link', 'yelagiri-hills-grand-resort-id', 'spa-amenity', NOW())
ON CONFLICT (id) DO NOTHING;

-- Add sample reviews
INSERT INTO reviews (
    id, hotel_id, guest_name, guest_location, rating, title, review_text,
    cleanliness_rating, service_rating, location_rating, value_rating, is_approved, created_at
) VALUES
(
    'review-1',
    'yelagiri-hills-grand-resort-id',
    'Rajesh Kumar',
    'Chennai, Tamil Nadu',
    5,
    'Excellent Stay with Amazing Views',
    'Had a wonderful time at this resort. The views are breathtaking and the staff is very courteous. The rooms are clean and well-maintained. Highly recommended for a peaceful getaway.',
    5, 5, 5, 4, true,
    NOW() - INTERVAL '30 days'
),
(
    'review-2',
    'yelagiri-hills-grand-resort-id',
    'Priya Sharma',
    'Bangalore, Karnataka',
    4,
    'Great Location and Service',
    'The resort is located in a perfect spot with great hill views. The food was delicious and the amenities were good. Only minor issue was the WiFi speed could be better.',
    4, 5, 5, 4, true,
    NOW() - INTERVAL '15 days'
),
(
    'review-3',
    'yelagiri-hills-grand-resort-id',
    'Amit Patel',
    'Mumbai, Maharashtra',
    5,
    'Perfect Weekend Getaway',
    'Amazing experience! The resort exceeded our expectations. Beautiful location, excellent service, and great food. Will definitely visit again.',
    5, 5, 5, 5, true,
    NOW() - INTERVAL '7 days'
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON hotels(slug);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id ON reviews(hotel_id);
CREATE INDEX IF NOT EXISTS idx_room_types_hotel_id ON room_types(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_images_hotel_id ON hotel_images(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_amenities_hotel_id ON hotel_amenities(hotel_id);

COMMIT;
