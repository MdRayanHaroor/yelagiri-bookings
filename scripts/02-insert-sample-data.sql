-- Insert hotel categories
INSERT INTO hotel_categories (name, description, icon) VALUES
('Luxury Resort', 'Premium resorts with world-class amenities', 'crown'),
('Budget Hotel', 'Comfortable stays at affordable prices', 'home'),
('Boutique Hotel', 'Unique, stylish accommodations', 'star'),
('Family Resort', 'Perfect for family vacations', 'users'),
('Business Hotel', 'Ideal for business travelers', 'briefcase');

-- Insert amenities
INSERT INTO amenities (name, description, icon, category) VALUES
('Free WiFi', 'Complimentary wireless internet access', 'wifi', 'basic'),
('Swimming Pool', 'Outdoor/Indoor swimming pool', 'waves', 'recreation'),
('Restaurant', 'On-site dining facility', 'utensils', 'basic'),
('Parking', 'Free parking facility', 'car', 'basic'),
('Air Conditioning', 'Climate controlled rooms', 'wind', 'basic'),
('Gym/Fitness Center', 'Exercise and fitness facilities', 'dumbbell', 'recreation'),
('Spa Services', 'Relaxation and wellness treatments', 'flower', 'premium'),
('Room Service', '24/7 room service available', 'bell', 'premium'),
('Conference Hall', 'Meeting and event spaces', 'presentation', 'business'),
('Kids Play Area', 'Safe play area for children', 'gamepad', 'recreation'),
('Garden/Lawn', 'Beautiful landscaped gardens', 'tree', 'recreation'),
('Balcony/Terrace', 'Private outdoor space', 'home', 'basic'),
('TV/Cable', 'Television with cable channels', 'tv', 'basic'),
('Mini Bar', 'In-room refreshment center', 'coffee', 'premium'),
('Laundry Service', 'Professional laundry facilities', 'shirt', 'basic');

-- Insert sample hotels
INSERT INTO hotels (
    name, description, short_description, address, area, phone, email, 
    starting_price, average_rating, total_reviews, total_rooms, 
    status, is_featured, slug
) VALUES
(
    'Yelagiri Hills Grand Resort',
    'Experience luxury amidst the serene hills of Yelagiri. Our grand resort offers world-class amenities, breathtaking views, and exceptional service. Perfect for families, couples, and business travelers seeking comfort and elegance.',
    'Luxury resort with stunning hill views and premium amenities',
    'Yelagiri Hills, Near Lake, Vellore District, Tamil Nadu 635853',
    'Lake View Area',
    '+91 98765 43210',
    'info@yelagirihillsgrand.com',
    2999.00,
    4.5,
    156,
    45,
    'active',
    true,
    'yelagiri-hills-grand-resort'
),
(
    'Mountain View Lodge',
    'A cozy lodge nestled in the heart of Yelagiri Hills, offering comfortable accommodation with panoramic mountain views. Ideal for nature lovers and adventure enthusiasts.',
    'Comfortable lodge with panoramic mountain views',
    'Swamimalai Road, Yelagiri Hills, Tamil Nadu 635853',
    'Swamimalai Area',
    '+91 87654 32109',
    'stay@mountainviewlodge.com',
    1899.00,
    4.2,
    89,
    25,
    'active',
    true,
    'mountain-view-lodge'
),
(
    'Lake Side Retreat',
    'Wake up to the gentle sounds of nature at our lakeside retreat. Offering peaceful accommodation with direct lake access, perfect for a tranquil getaway.',
    'Peaceful retreat with direct lake access',
    'Lake Road, Yelagiri Hills, Tamil Nadu 635853',
    'Lake View Area',
    '+91 76543 21098',
    'hello@lakesideretreat.com',
    2299.00,
    4.3,
    124,
    30,
    'active',
    false,
    'lake-side-retreat'
),
(
    'Budget Stay Inn',
    'Clean, comfortable, and affordable accommodation in the heart of Yelagiri. Perfect for budget-conscious travelers who don''t want to compromise on quality.',
    'Clean and affordable accommodation in town center',
    'Main Road, Yelagiri Hills, Tamil Nadu 635853',
    'Town Center',
    '+91 65432 10987',
    'info@budgetstayinn.com',
    999.00,
    3.8,
    67,
    20,
    'active',
    false,
    'budget-stay-inn'
),
(
    'Hilltop Paradise Resort',
    'Perched atop the highest point in Yelagiri, our resort offers unmatched views and luxury amenities. Experience paradise with our world-class spa, fine dining, and adventure activities.',
    'Luxury hilltop resort with unmatched views',
    'Hilltop Road, Yelagiri Hills, Tamil Nadu 635853',
    'Hilltop Area',
    '+91 54321 09876',
    'reservations@hilltopparadise.com',
    3499.00,
    4.7,
    203,
    60,
    'active',
    true,
    'hilltop-paradise-resort'
),
(
    'Nature''s Nest Hotel',
    'Surrounded by lush greenery and fruit orchards, Nature''s Nest offers an authentic hill station experience. Enjoy organic meals, nature walks, and bird watching.',
    'Eco-friendly hotel surrounded by nature',
    'Orchard Lane, Yelagiri Hills, Tamil Nadu 635853',
    'Orchard Area',
    '+91 43210 98765',
    'stay@naturesnest.com',
    1699.00,
    4.1,
    78,
    18,
    'active',
    false,
    'natures-nest-hotel'
);

-- Insert hotel images
INSERT INTO hotel_images (hotel_id, image_url, alt_text, is_primary, display_order, image_type) 
SELECT 
    h.id,
    '/placeholder.svg?height=400&width=600',
    h.name || ' - Main View',
    true,
    1,
    'primary'
FROM hotels h;

-- Insert additional images for each hotel
INSERT INTO hotel_images (hotel_id, image_url, alt_text, is_primary, display_order, image_type)
SELECT 
    h.id,
    '/placeholder.svg?height=300&width=500',
    h.name || ' - ' || image_types.type,
    false,
    image_types.order_num,
    image_types.type
FROM hotels h
CROSS JOIN (
    VALUES 
    ('exterior', 2),
    ('interior', 3),
    ('room', 4),
    ('amenity', 5)
) AS image_types(type, order_num);

-- Insert hotel amenities (random assignment)
INSERT INTO hotel_amenities (hotel_id, amenity_id)
SELECT DISTINCT
    h.id,
    a.id
FROM hotels h
CROSS JOIN amenities a
WHERE 
    (h.starting_price > 2000 AND a.category IN ('basic', 'premium', 'recreation')) OR
    (h.starting_price BETWEEN 1500 AND 2000 AND a.category IN ('basic', 'recreation')) OR
    (h.starting_price < 1500 AND a.category = 'basic')
ORDER BY RANDOM()
LIMIT 50;

-- Insert room types
INSERT INTO room_types (hotel_id, name, description, max_occupancy, base_price, total_rooms, available_rooms, bed_type, has_ac, has_wifi, has_tv)
SELECT 
    h.id,
    room_data.name,
    room_data.description,
    room_data.max_occupancy,
    h.starting_price + room_data.price_addon,
    room_data.room_count,
    room_data.room_count,
    room_data.bed_type,
    CASE WHEN h.starting_price > 1500 THEN true ELSE false END,
    true,
    true
FROM hotels h
CROSS JOIN (
    VALUES 
    ('Standard Room', 'Comfortable room with essential amenities', 2, 0, 'double', 8),
    ('Deluxe Room', 'Spacious room with premium amenities', 3, 500, 'queen', 6),
    ('Suite', 'Luxurious suite with separate living area', 4, 1000, 'king', 4)
) AS room_data(name, description, max_occupancy, price_addon, bed_type, room_count)
WHERE h.starting_price > 1200 OR room_data.name = 'Standard Room';

-- Insert sample reviews
INSERT INTO reviews (hotel_id, rating, title, review_text, guest_name, guest_location, is_approved, cleanliness_rating, service_rating, location_rating, value_rating)
SELECT 
    h.id,
    4 + (RANDOM() * 2)::INTEGER, -- Rating between 4-5
    review_data.title,
    review_data.review_text,
    review_data.guest_name,
    review_data.location,
    true,
    4 + (RANDOM() * 2)::INTEGER,
    4 + (RANDOM() * 2)::INTEGER,
    4 + (RANDOM() * 2)::INTEGER,
    4 + (RANDOM() * 2)::INTEGER
FROM hotels h
CROSS JOIN (
    VALUES 
    ('Amazing stay!', 'Had a wonderful time at this hotel. The staff was very friendly and the rooms were clean and comfortable.', 'Rajesh Kumar', 'Chennai'),
    ('Perfect getaway', 'Beautiful location with great amenities. Would definitely recommend to families.', 'Priya Sharma', 'Bangalore'),
    ('Excellent service', 'The hotel exceeded our expectations. Great food and amazing views.', 'Amit Patel', 'Mumbai'),
    ('Peaceful retreat', 'Exactly what we needed for a relaxing weekend. Will visit again!', 'Sunita Reddy', 'Hyderabad')
) AS review_data(title, review_text, guest_name, location)
ORDER BY RANDOM()
LIMIT 20;

-- Update hotel statistics based on inserted data
UPDATE hotels SET 
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviews.hotel_id = hotels.id),
    average_rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE reviews.hotel_id = hotels.id);

-- Insert hotel policies
INSERT INTO hotel_policies (hotel_id, policy_type, title, description)
SELECT 
    h.id,
    policy_data.type,
    policy_data.title,
    policy_data.description
FROM hotels h
CROSS JOIN (
    VALUES 
    ('cancellation', 'Cancellation Policy', 'Free cancellation up to 24 hours before check-in. Cancellations made within 24 hours will be charged one night stay.'),
    ('pet', 'Pet Policy', 'Pets are not allowed in the hotel premises for the comfort and safety of all guests.'),
    ('smoking', 'Smoking Policy', 'This is a non-smoking property. Smoking is only permitted in designated outdoor areas.'),
    ('child', 'Child Policy', 'Children under 12 years stay free when using existing bedding. Extra bed charges apply for additional guests.')
) AS policy_data(type, title, description);
