-- Step-by-step data insertion for Yelagiri Bookings
-- Run this script in your Supabase SQL Editor

-- Step 1: Insert Users
INSERT INTO users (id, email, full_name, phone, role, is_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@yelagiribookings.com', 'Admin User', '+91 98765 43210', 'admin', true),
('22222222-2222-2222-2222-222222222222', 'owner1@gmail.com', 'Rajesh Kumar', '+91 87654 32109', 'hotel_owner', true),
('33333333-3333-3333-3333-333333333333', 'owner2@gmail.com', 'Priya Sharma', '+91 76543 21098', 'hotel_owner', true);

-- Verify users inserted
SELECT 'Users inserted:' as step, count(*) as count FROM users;

-- Step 2: Insert Hotel Categories
INSERT INTO hotel_categories (id, name, description, icon) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Luxury Resort', 'Premium resorts with world-class amenities', 'crown'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Budget Hotel', 'Comfortable stays at affordable prices', 'home'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Boutique Hotel', 'Unique, stylish accommodations', 'star');

-- Verify categories inserted
SELECT 'Categories inserted:' as step, count(*) as count FROM hotel_categories;

-- Step 3: Insert Amenities
INSERT INTO amenities (id, name, description, icon, category, is_active) VALUES
('a1111111-1111-1111-1111-111111111111', 'Free WiFi', 'High-speed wireless internet', 'wifi', 'basic', true),
('a2222222-2222-2222-2222-222222222222', 'Swimming Pool', 'Outdoor swimming pool', 'waves', 'recreation', true),
('a3333333-3333-3333-3333-333333333333', 'Restaurant', 'On-site dining facility', 'utensils', 'basic', true),
('a4444444-4444-4444-4444-444444444444', 'Free Parking', 'Complimentary parking', 'car', 'basic', true),
('a5555555-5555-5555-5555-555555555555', 'Air Conditioning', 'Climate controlled rooms', 'wind', 'basic', true);

-- Verify amenities inserted
SELECT 'Amenities inserted:' as step, count(*) as count FROM amenities;

-- Step 4: Insert Hotels (one by one to ensure they work)
INSERT INTO hotels (
    id, name, description, short_description, owner_id, category_id,
    address, latitude, longitude, area, phone, email,
    starting_price, currency, average_rating, total_reviews, total_rooms,
    status, is_featured, is_verified, slug
) VALUES (
    'h1111111-1111-1111-1111-111111111111',
    'Yelagiri Hills Grand Resort',
    'Experience luxury amidst the serene hills of Yelagiri. Our grand resort offers world-class amenities, breathtaking views, and exceptional service.',
    'Luxury resort with stunning hill views and premium amenities',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Yelagiri Hills, Near Lake, Vellore District, Tamil Nadu 635853',
    12.5810, 78.6413,
    'Lake View Area',
    '+91 98765 43210',
    'info@yelagirihillsgrand.com',
    2999.00, 'INR', 4.5, 156, 45,
    'active', true, true,
    'yelagiri-hills-grand-resort'
);

-- Verify first hotel
SELECT 'First hotel inserted:' as step, name, is_featured FROM hotels WHERE id = 'h1111111-1111-1111-1111-111111111111';

INSERT INTO hotels (
    id, name, description, short_description, owner_id, category_id,
    address, latitude, longitude, area, phone, email,
    starting_price, currency, average_rating, total_reviews, total_rooms,
    status, is_featured, is_verified, slug
) VALUES (
    'h2222222-2222-2222-2222-222222222222',
    'Mountain View Lodge',
    'A cozy lodge with panoramic mountain views, perfect for nature lovers and adventure enthusiasts.',
    'Comfortable lodge with panoramic mountain views',
    '33333333-3333-3333-3333-333333333333',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Swamimalai Road, Yelagiri Hills, Tamil Nadu 635853',
    12.5825, 78.6398,
    'Swamimalai Area',
    '+91 87654 32109',
    'stay@mountainviewlodge.com',
    1899.00, 'INR', 4.2, 89, 25,
    'active', true, true,
    'mountain-view-lodge'
);

INSERT INTO hotels (
    id, name, description, short_description, owner_id, category_id,
    address, latitude, longitude, area, phone, email,
    starting_price, currency, average_rating, total_reviews, total_rooms,
    status, is_featured, is_verified, slug
) VALUES (
    'h3333333-3333-3333-3333-333333333333',
    'Lake Side Retreat',
    'Peaceful lakeside accommodation with direct lake access and serene ambiance.',
    'Peaceful retreat with direct lake access',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Lake Road, Yelagiri Hills, Tamil Nadu 635853',
    12.5795, 78.6425,
    'Lake View Area',
    '+91 76543 21098',
    'hello@lakesideretreat.com',
    2299.00, 'INR', 4.3, 124, 30,
    'active', true, true,
    'lake-side-retreat'
);

INSERT INTO hotels (
    id, name, description, short_description, owner_id, category_id,
    address, latitude, longitude, area, phone, email,
    starting_price, currency, average_rating, total_reviews, total_rooms,
    status, is_featured, is_verified, slug
) VALUES (
    'h4444444-4444-4444-4444-444444444444',
    'Budget Stay Inn',
    'Clean, comfortable, and affordable accommodation in the heart of Yelagiri.',
    'Clean and affordable accommodation',
    '33333333-3333-3333-3333-333333333333',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Main Road, Yelagiri Hills, Tamil Nadu 635853',
    12.5800, 78.6400,
    'Town Center',
    '+91 65432 10987',
    'info@budgetstayinn.com',
    999.00, 'INR', 3.8, 67, 20,
    'active', false, true,
    'budget-stay-inn'
);

-- Verify all hotels
SELECT 'Total hotels inserted:' as step, count(*) as count FROM hotels;
SELECT 'Featured hotels:' as step, count(*) as count FROM hotels WHERE is_featured = true;

-- Step 5: Insert Hotel Images
INSERT INTO hotel_images (hotel_id, image_url, alt_text, is_primary, display_order, image_type) VALUES
('h1111111-1111-1111-1111-111111111111', '/placeholder.svg?height=400&width=600&text=Grand+Resort', 'Yelagiri Hills Grand Resort', true, 1, 'primary'),
('h2222222-2222-2222-2222-222222222222', '/placeholder.svg?height=400&width=600&text=Mountain+Lodge', 'Mountain View Lodge', true, 1, 'primary'),
('h3333333-3333-3333-3333-333333333333', '/placeholder.svg?height=400&width=600&text=Lake+Retreat', 'Lake Side Retreat', true, 1, 'primary'),
('h4444444-4444-4444-4444-444444444444', '/placeholder.svg?height=400&width=600&text=Budget+Inn', 'Budget Stay Inn', true, 1, 'primary');

-- Verify images
SELECT 'Hotel images inserted:' as step, count(*) as count FROM hotel_images;

-- Step 6: Insert Hotel Amenities
INSERT INTO hotel_amenities (hotel_id, amenity_id, is_available) VALUES
-- Grand Resort (all amenities)
('h1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', true),
('h1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', true),
('h1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', true),
('h1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', true),
('h1111111-1111-1111-1111-111111111111', 'a5555555-5555-5555-5555-555555555555', true),

-- Mountain View Lodge (basic amenities)
('h2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', true),
('h2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', true),
('h2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', true),
('h2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', true),

-- Lake Side Retreat
('h3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', true),
('h3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', true),
('h3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', true),
('h3333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', true),

-- Budget Stay Inn (basic only)
('h4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', true),
('h4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', true),
('h4444444-4444-4444-4444-444444444444', 'a5555555-5555-5555-5555-555555555555', true);

-- Verify amenities
SELECT 'Hotel amenities inserted:' as step, count(*) as count FROM hotel_amenities;

-- Step 7: Insert Room Types
INSERT INTO room_types (
    id, hotel_id, name, description, max_occupancy, base_price, area_sqft, bed_type, 
    total_rooms, available_rooms, has_ac, has_wifi, has_tv, has_balcony, has_bathroom
) VALUES
-- Grand Resort rooms
('r1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Deluxe Room', 'Spacious room with mountain views', 2, 2999.00, 350, 'queen', 20, 20, true, true, true, true, true),
('r1111112-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Premium Suite', 'Luxury suite with living area', 4, 4499.00, 600, 'king', 15, 15, true, true, true, true, true),

-- Mountain View Lodge rooms
('r2222221-2222-2222-2222-222222222222', 'h2222222-2222-2222-2222-222222222222', 'Mountain View Room', 'Room with panoramic mountain views', 2, 1899.00, 300, 'queen', 20, 20, true, true, true, true, true),

-- Lake Side Retreat rooms
('r3333331-3333-3333-3333-333333333333', 'h3333333-3333-3333-3333-333333333333', 'Lakeside Cottage', 'Private cottage with lake access', 3, 2799.00, 400, 'queen', 15, 15, true, true, true, true, true),

-- Budget Stay Inn rooms
('r4444441-4444-4444-4444-444444444444', 'h4444444-4444-4444-4444-444444444444', 'Standard Room', 'Clean and comfortable room', 2, 999.00, 200, 'double', 15, 15, true, true, true, false, true);

-- Verify room types
SELECT 'Room types inserted:' as step, count(*) as count FROM room_types;

-- Step 8: Insert Sample Reviews
INSERT INTO reviews (
    hotel_id, rating, title, review_text, guest_name, guest_location, 
    is_verified, is_approved, cleanliness_rating, service_rating, location_rating, value_rating
) VALUES
('h1111111-1111-1111-1111-111111111111', 5, 'Amazing luxury resort!', 'Had a wonderful stay. The staff was exceptional and the views were breathtaking.', 'Rajesh Kumar', 'Chennai', true, true, 5, 5, 5, 4),
('h2222222-2222-2222-2222-222222222222', 4, 'Perfect mountain getaway', 'Cozy lodge with amazing mountain views. Perfect for a peaceful retreat.', 'Amit Patel', 'Mumbai', true, true, 4, 4, 5, 5),
('h3333333-3333-3333-3333-333333333333', 5, 'Lakeside paradise', 'Waking up to lake views was magical. Great for nature lovers.', 'Sunita Reddy', 'Hyderabad', true, true, 5, 4, 5, 4);

-- Verify reviews
SELECT 'Reviews inserted:' as step, count(*) as count FROM reviews;

-- Final verification
SELECT '=== FINAL SUMMARY ===' as summary;
SELECT 'Users:' as table_name, count(*) as count FROM users
UNION ALL
SELECT 'Hotel Categories:', count(*) FROM hotel_categories
UNION ALL
SELECT 'Amenities:', count(*) FROM amenities
UNION ALL
SELECT 'Hotels:', count(*) FROM hotels
UNION ALL
SELECT 'Featured Hotels:', count(*) FROM hotels WHERE is_featured = true
UNION ALL
SELECT 'Hotel Images:', count(*) FROM hotel_images
UNION ALL
SELECT 'Hotel Amenities:', count(*) FROM hotel_amenities
UNION ALL
SELECT 'Room Types:', count(*) FROM room_types
UNION ALL
SELECT 'Reviews:', count(*) FROM reviews;

-- Test the exact query our app uses
SELECT 'Testing app query:' as test;
SELECT 
    h.id,
    h.name,
    h.short_description,
    h.area,
    h.starting_price,
    h.average_rating,
    h.total_reviews,
    h.slug,
    h.is_featured,
    h.status
FROM hotels h
WHERE h.status = 'active' AND h.is_featured = true
ORDER BY h.average_rating DESC;
