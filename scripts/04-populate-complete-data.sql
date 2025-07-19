-- Complete data population script for Yelagiri Bookings

-- First, let's clear any existing data
DELETE FROM seasonal_pricing;
DELETE FROM hotel_policies;
DELETE FROM reviews;
DELETE FROM bookings;
DELETE FROM room_images;
DELETE FROM room_types;
DELETE FROM hotel_amenities;
DELETE FROM hotel_images;
DELETE FROM hotels;
DELETE FROM amenities;
DELETE FROM hotel_categories;
DELETE FROM users;

-- Insert sample users
INSERT INTO users (id, email, full_name, phone, role, is_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@yelagiribookings.com', 'Admin User', '+91 98765 43210', 'admin', true),
('22222222-2222-2222-2222-222222222222', 'owner1@gmail.com', 'Rajesh Kumar', '+91 87654 32109', 'hotel_owner', true),
('33333333-3333-3333-3333-333333333333', 'owner2@gmail.com', 'Priya Sharma', '+91 76543 21098', 'hotel_owner', true),
('44444444-4444-4444-4444-444444444444', 'guest1@gmail.com', 'Sunita Reddy', '+91 54321 09876', 'guest', true);

-- Insert hotel categories
INSERT INTO hotel_categories (id, name, description, icon) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Luxury Resort', 'Premium resorts with world-class amenities', 'crown'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Budget Hotel', 'Comfortable stays at affordable prices', 'home'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Boutique Hotel', 'Unique, stylish accommodations', 'star'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Family Resort', 'Perfect for family vacations', 'users');

-- Insert amenities
INSERT INTO amenities (id, name, description, icon, category, is_active) VALUES
('a1111111-1111-1111-1111-111111111111', 'Free WiFi', 'High-speed wireless internet', 'wifi', 'basic', true),
('a2222222-2222-2222-2222-222222222222', 'Swimming Pool', 'Outdoor swimming pool', 'waves', 'recreation', true),
('a3333333-3333-3333-3333-333333333333', 'Restaurant', 'On-site dining facility', 'utensils', 'basic', true),
('a4444444-4444-4444-4444-444444444444', 'Free Parking', 'Complimentary parking', 'car', 'basic', true),
('a5555555-5555-5555-5555-555555555555', 'Air Conditioning', 'Climate controlled rooms', 'wind', 'basic', true),
('a6666666-6666-6666-6666-666666666666', 'Spa Services', 'Wellness treatments', 'flower', 'premium', true),
('a7777777-7777-7777-7777-777777777777', 'Gym', 'Fitness center', 'dumbbell', 'recreation', true),
('a8888888-8888-8888-8888-888888888888', 'Room Service', '24/7 room service', 'bell', 'premium', true);

-- Insert hotels
INSERT INTO hotels (
    id, name, description, short_description, owner_id, category_id,
    address, latitude, longitude, area, phone, email, website,
    starting_price, currency, average_rating, total_reviews, total_rooms,
    check_in_time, check_out_time, status, is_featured, is_verified, slug,
    meta_title, meta_description
) VALUES
(
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
    'https://yelagirihillsgrand.com',
    2999.00, 'INR', 4.5, 156, 45,
    '14:00:00', '11:00:00',
    'active', true, true,
    'yelagiri-hills-grand-resort',
    'Yelagiri Hills Grand Resort - Luxury Stay',
    'Book luxury accommodation at Yelagiri Hills Grand Resort'
),
(
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
    'https://mountainviewlodge.com',
    1899.00, 'INR', 4.2, 89, 25,
    '14:00:00', '11:00:00',
    'active', true, true,
    'mountain-view-lodge',
    'Mountain View Lodge - Cozy Hill Station Stay',
    'Comfortable accommodation with mountain views'
),
(
    'h3333333-3333-3333-3333-333333333333',
    'Lake Side Retreat',
    'Peaceful lakeside accommodation with direct lake access and serene ambiance.',
    'Peaceful retreat with direct lake access',
    '22222222-2222-2222-2222-222222222222',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Lake Road, Yelagiri Hills, Tamil Nadu 635853',
    12.5795, 78.6425,
    'Lake View Area',
    '+91 76543 21098',
    'hello@lakesideretreat.com',
    'https://lakesideretreat.com',
    2299.00, 'INR', 4.3, 124, 30,
    '14:00:00', '11:00:00',
    'active', true, true,
    'lake-side-retreat',
    'Lake Side Retreat - Waterfront Stay',
    'Lakeside accommodation in Yelagiri Hills'
),
(
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
    'https://budgetstayinn.com',
    999.00, 'INR', 3.8, 67, 20,
    '12:00:00', '10:00:00',
    'active', false, true,
    'budget-stay-inn',
    'Budget Stay Inn - Affordable Accommodation',
    'Budget-friendly stay in Yelagiri town center'
),
(
    'h5555555-5555-5555-5555-555555555555',
    'Hilltop Paradise Resort',
    'Ultra-luxury resort perched atop Yelagiri with unmatched panoramic views.',
    'Ultra-luxury hilltop resort with panoramic views',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Hilltop Road, Yelagiri Hills, Tamil Nadu 635853',
    12.5840, 78.6380,
    'Hilltop Area',
    '+91 54321 09876',
    'reservations@hilltopparadise.com',
    'https://hilltopparadise.com',
    3499.00, 'INR', 4.7, 203, 60,
    '15:00:00', '12:00:00',
    'active', true, true,
    'hilltop-paradise-resort',
    'Hilltop Paradise Resort - Ultra Luxury',
    'Ultimate luxury experience in Yelagiri Hills'
),
(
    'h6666666-6666-6666-6666-666666666666',
    'Nature''s Nest Hotel',
    'Eco-friendly hotel surrounded by fruit orchards and natural beauty.',
    'Eco-friendly hotel in natural surroundings',
    '33333333-3333-3333-3333-333333333333',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Orchard Lane, Yelagiri Hills, Tamil Nadu 635853',
    12.5785, 78.6445,
    'Orchard Area',
    '+91 43210 98765',
    'stay@naturesnest.com',
    'https://naturesnest.com',
    1699.00, 'INR', 4.1, 78, 18,
    '13:00:00', '10:30:00',
    'active', true, true,
    'natures-nest-hotel',
    'Nature''s Nest Hotel - Eco-Friendly Stay',
    'Sustainable accommodation in Yelagiri'
);

-- Insert hotel images
INSERT INTO hotel_images (hotel_id, image_url, alt_text, is_primary, display_order, image_type) VALUES
-- Yelagiri Hills Grand Resort
('h1111111-1111-1111-1111-111111111111', '/placeholder.svg?height=400&width=600&text=Grand+Resort', 'Yelagiri Hills Grand Resort', true, 1, 'primary'),
('h1111111-1111-1111-1111-111111111111', '/placeholder.svg?height=300&width=500&text=Resort+Pool', 'Resort Swimming Pool', false, 2, 'amenity'),
('h1111111-1111-1111-1111-111111111111', '/placeholder.svg?height=300&width=500&text=Resort+Room', 'Luxury Room', false, 3, 'room'),

-- Mountain View Lodge
('h2222222-2222-2222-2222-222222222222', '/placeholder.svg?height=400&width=600&text=Mountain+Lodge', 'Mountain View Lodge', true, 1, 'primary'),
('h2222222-2222-2222-2222-222222222222', '/placeholder.svg?height=300&width=500&text=Lodge+View', 'Mountain Views', false, 2, 'exterior'),

-- Lake Side Retreat
('h3333333-3333-3333-3333-333333333333', '/placeholder.svg?height=400&width=600&text=Lake+Retreat', 'Lake Side Retreat', true, 1, 'primary'),
('h3333333-3333-3333-3333-333333333333', '/placeholder.svg?height=300&width=500&text=Lake+View', 'Lake Views', false, 2, 'exterior'),

-- Budget Stay Inn
('h4444444-4444-4444-4444-444444444444', '/placeholder.svg?height=400&width=600&text=Budget+Inn', 'Budget Stay Inn', true, 1, 'primary'),

-- Hilltop Paradise Resort
('h5555555-5555-5555-5555-555555555555', '/placeholder.svg?height=400&width=600&text=Hilltop+Resort', 'Hilltop Paradise Resort', true, 1, 'primary'),
('h5555555-5555-5555-5555-555555555555', '/placeholder.svg?height=300&width=500&text=Paradise+Pool', 'Infinity Pool', false, 2, 'amenity'),

-- Nature's Nest Hotel
('h6666666-6666-6666-6666-666666666666', '/placeholder.svg?height=400&width=600&text=Natures+Nest', 'Nature''s Nest Hotel', true, 1, 'primary');

-- Insert hotel amenities
INSERT INTO hotel_amenities (hotel_id, amenity_id, is_available) VALUES
-- Grand Resort (all amenities)
('h1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', true),
('h1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', true),
('h1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', true),
('h1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', true),
('h1111111-1111-1111-1111-111111111111', 'a5555555-5555-5555-5555-555555555555', true),
('h1111111-1111-1111-1111-111111111111', 'a6666666-6666-6666-6666-666666666666', true),
('h1111111-1111-1111-1111-111111111111', 'a7777777-7777-7777-7777-777777777777', true),
('h1111111-1111-1111-1111-111111111111', 'a8888888-8888-8888-8888-888888888888', true),

-- Mountain View Lodge (basic + some premium)
('h2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', true),
('h2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', true),
('h2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', true),
('h2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', true),

-- Lake Side Retreat
('h3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', true),
('h3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', true),
('h3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', true),
('h3333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', true),
('h3333333-3333-3333-3333-333333333333', 'a6666666-6666-6666-6666-666666666666', true),

-- Budget Stay Inn (basic only)
('h4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', true),
('h4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', true),
('h4444444-4444-4444-4444-444444444444', 'a5555555-5555-5555-5555-555555555555', true),

-- Hilltop Paradise (all premium)
('h5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', true),
('h5555555-5555-5555-5555-555555555555', 'a2222222-2222-2222-2222-222222222222', true),
('h5555555-5555-5555-5555-555555555555', 'a3333333-3333-3333-3333-333333333333', true),
('h5555555-5555-5555-5555-555555555555', 'a4444444-4444-4444-4444-444444444444', true),
('h5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', true),
('h5555555-5555-5555-5555-555555555555', 'a6666666-6666-6666-6666-666666666666', true),
('h5555555-5555-5555-5555-555555555555', 'a7777777-7777-7777-7777-777777777777', true),
('h5555555-5555-5555-5555-555555555555', 'a8888888-8888-8888-8888-888888888888', true),

-- Nature's Nest (eco-friendly)
('h6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', true),
('h6666666-6666-6666-6666-666666666666', 'a3333333-3333-3333-3333-333333333333', true),
('h6666666-6666-6666-6666-666666666666', 'a4444444-4444-4444-4444-444444444444', true);

-- Insert room types
INSERT INTO room_types (
    id, hotel_id, name, description, max_occupancy, base_price, area_sqft, bed_type, 
    total_rooms, available_rooms, has_ac, has_wifi, has_tv, has_balcony, has_bathroom
) VALUES
-- Grand Resort rooms
('r1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Deluxe Room', 'Spacious room with mountain views', 2, 2999.00, 350, 'queen', 20, 20, true, true, true, true, true),
('r1111112-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Premium Suite', 'Luxury suite with living area', 4, 4499.00, 600, 'king', 15, 15, true, true, true, true, true),

-- Mountain View Lodge rooms
('r2222221-2222-2222-2222-222222222222', 'h2222222-2222-2222-2222-222222222222', 'Mountain View Room', 'Room with panoramic mountain views', 2, 1899.00, 300, 'queen', 20, 20, true, true, true, true, true),
('r2222222-2222-2222-2222-222222222222', 'h2222222-2222-2222-2222-222222222222', 'Standard Room', 'Comfortable room with basic amenities', 2, 1599.00, 250, 'double', 5, 5, true, true, true, false, true),

-- Lake Side Retreat rooms
('r3333331-3333-3333-3333-333333333333', 'h3333333-3333-3333-3333-333333333333', 'Lakeside Cottage', 'Private cottage with lake access', 3, 2799.00, 400, 'queen', 15, 15, true, true, true, true, true),
('r3333332-3333-3333-3333-333333333333', 'h3333333-3333-3333-3333-333333333333', 'Lake View Room', 'Room with lake views', 2, 2299.00, 320, 'double', 15, 15, true, true, true, true, true),

-- Budget Stay Inn rooms
('r4444441-4444-4444-4444-444444444444', 'h4444444-4444-4444-4444-444444444444', 'AC Room', 'Clean room with air conditioning', 2, 1199.00, 200, 'double', 15, 15, true, true, true, false, true),
('r4444442-4444-4444-4444-444444444444', 'h4444444-4444-4444-4444-444444444444', 'Standard Room', 'Basic comfortable room', 2, 999.00, 180, 'double', 5, 5, false, true, true, false, true),

-- Hilltop Paradise rooms
('r5555551-5555-5555-5555-555555555555', 'h5555555-5555-5555-5555-555555555555', 'Panoramic Suite', 'Luxury suite with valley views', 2, 4999.00, 700, 'king', 30, 30, true, true, true, true, true),
('r5555552-5555-5555-5555-555555555555', 'h5555555-5555-5555-5555-555555555555', 'Presidential Villa', 'Ultra-luxury villa with private pool', 4, 8999.00, 1500, 'king', 15, 15, true, true, true, true, true),
('r5555553-5555-5555-5555-555555555555', 'h5555555-5555-5555-5555-555555555555', 'Deluxe Room', 'Premium room with valley views', 2, 3499.00, 400, 'queen', 15, 15, true, true, true, true, true),

-- Nature's Nest rooms
('r6666661-6666-6666-6666-666666666666', 'h6666666-6666-6666-6666-666666666666', 'Orchard View Room', 'Eco-friendly room with orchard views', 2, 1699.00, 280, 'queen', 15, 15, true, true, true, true, true),
('r6666662-6666-6666-6666-666666666666', 'h6666666-6666-6666-6666-666666666666', 'Garden Cottage', 'Private cottage in gardens', 3, 2199.00, 350, 'double', 3, 3, true, true, true, true, true);

-- Insert some sample reviews
INSERT INTO reviews (
    hotel_id, rating, title, review_text, guest_name, guest_location, 
    is_verified, is_approved, cleanliness_rating, service_rating, location_rating, value_rating
) VALUES
('h1111111-1111-1111-1111-111111111111', 5, 'Amazing luxury resort!', 'Had a wonderful stay. The staff was exceptional and the views were breathtaking.', 'Rajesh Kumar', 'Chennai', true, true, 5, 5, 5, 4),
('h1111111-1111-1111-1111-111111111111', 4, 'Great experience', 'Beautiful property with excellent amenities. Highly recommended!', 'Priya Sharma', 'Bangalore', true, true, 4, 5, 5, 4),
('h2222222-2222-2222-2222-222222222222', 4, 'Perfect mountain getaway', 'Cozy lodge with amazing mountain views. Perfect for a peaceful retreat.', 'Amit Patel', 'Mumbai', true, true, 4, 4, 5, 5),
('h3333333-3333-3333-3333-333333333333', 5, 'Lakeside paradise', 'Waking up to lake views was magical. Great for nature lovers.', 'Sunita Reddy', 'Hyderabad', true, true, 5, 4, 5, 4),
('h5555555-5555-5555-5555-555555555555', 5, 'Ultimate luxury', 'The best resort experience ever! Every detail was perfect.', 'Vikram Singh', 'Delhi', true, true, 5, 5, 5, 4),
('h6666666-6666-6666-6666-666666666666', 4, 'Great eco-friendly stay', 'Loved the sustainable approach and organic food. Very peaceful.', 'Meera Nair', 'Kochi', true, true, 4, 4, 4, 5);

-- Verify the data was inserted
SELECT 'Hotels inserted:' as info, count(*) as count FROM hotels;
SELECT 'Featured hotels:' as info, count(*) as count FROM hotels WHERE is_featured = true;
SELECT 'Hotel images:' as info, count(*) as count FROM hotel_images;
SELECT 'Amenities:' as info, count(*) as count FROM amenities;
SELECT 'Room types:' as info, count(*) as count FROM room_types;
SELECT 'Reviews:' as info, count(*) as count FROM reviews;
