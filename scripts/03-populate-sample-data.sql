-- Clear existing data (in correct order to handle dependencies)
TRUNCATE TABLE seasonal_pricing CASCADE;
TRUNCATE TABLE hotel_policies CASCADE;
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE room_images CASCADE;
TRUNCATE TABLE room_types CASCADE;
TRUNCATE TABLE hotel_amenities CASCADE;
TRUNCATE TABLE hotel_images CASCADE;
TRUNCATE TABLE hotels CASCADE;
TRUNCATE TABLE amenities CASCADE;
TRUNCATE TABLE hotel_categories CASCADE;
TRUNCATE TABLE users CASCADE;

-- Insert sample users
INSERT INTO users (id, email, full_name, phone, role, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@yelagiribookings.com', 'Admin User', '+91 98765 43210', 'admin', true),
('550e8400-e29b-41d4-a716-446655440002', 'owner1@gmail.com', 'Rajesh Kumar', '+91 87654 32109', 'hotel_owner', true),
('550e8400-e29b-41d4-a716-446655440003', 'owner2@gmail.com', 'Priya Sharma', '+91 76543 21098', 'hotel_owner', true),
('550e8400-e29b-41d4-a716-446655440004', 'owner3@gmail.com', 'Amit Patel', '+91 65432 10987', 'hotel_owner', true),
('550e8400-e29b-41d4-a716-446655440005', 'guest1@gmail.com', 'Sunita Reddy', '+91 54321 09876', 'guest', true),
('550e8400-e29b-41d4-a716-446655440006', 'guest2@gmail.com', 'Vikram Singh', '+91 43210 98765', 'guest', true),
('550e8400-e29b-41d4-a716-446655440007', 'guest3@gmail.com', 'Meera Nair', '+91 32109 87654', 'guest', true);

-- Insert hotel categories
INSERT INTO hotel_categories (id, name, description, icon) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Luxury Resort', 'Premium resorts with world-class amenities and exceptional service', 'crown'),
('650e8400-e29b-41d4-a716-446655440002', 'Budget Hotel', 'Comfortable and clean accommodations at affordable prices', 'home'),
('650e8400-e29b-41d4-a716-446655440003', 'Boutique Hotel', 'Unique, stylish accommodations with personalized service', 'star'),
('650e8400-e29b-41d4-a716-446655440004', 'Family Resort', 'Perfect for family vacations with kid-friendly amenities', 'users'),
('650e8400-e29b-41d4-a716-446655440005', 'Business Hotel', 'Ideal for business travelers with meeting facilities', 'briefcase'),
('650e8400-e29b-41d4-a716-446655440006', 'Eco Resort', 'Environmentally conscious accommodations in natural settings', 'leaf');

-- Insert amenities
INSERT INTO amenities (id, name, description, icon, category, is_active) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Free WiFi', 'Complimentary high-speed wireless internet access', 'wifi', 'basic', true),
('750e8400-e29b-41d4-a716-446655440002', 'Swimming Pool', 'Outdoor swimming pool with mountain views', 'waves', 'recreation', true),
('750e8400-e29b-41d4-a716-446655440003', 'Restaurant', 'On-site multi-cuisine restaurant', 'utensils', 'basic', true),
('750e8400-e29b-41d4-a716-446655440004', 'Free Parking', 'Complimentary parking facility', 'car', 'basic', true),
('750e8400-e29b-41d4-a716-446655440005', 'Air Conditioning', 'Climate controlled rooms', 'wind', 'basic', true),
('750e8400-e29b-41d4-a716-446655440006', 'Gym/Fitness Center', 'Modern exercise and fitness facilities', 'dumbbell', 'recreation', true),
('750e8400-e29b-41d4-a716-446655440007', 'Spa Services', 'Relaxation and wellness treatments', 'flower', 'premium', true),
('750e8400-e29b-41d4-a716-446655440008', '24/7 Room Service', 'Round-the-clock room service', 'bell', 'premium', true),
('750e8400-e29b-41d4-a716-446655440009', 'Conference Hall', 'Meeting and event spaces', 'presentation', 'business', true),
('750e8400-e29b-41d4-a716-446655440010', 'Kids Play Area', 'Safe and fun play area for children', 'gamepad', 'recreation', true),
('750e8400-e29b-41d4-a716-446655440011', 'Garden/Lawn', 'Beautiful landscaped gardens', 'tree', 'recreation', true),
('750e8400-e29b-41d4-a716-446655440012', 'Balcony/Terrace', 'Private outdoor space with views', 'home', 'basic', true),
('750e8400-e29b-41d4-a716-446655440013', 'TV/Cable', 'Television with satellite channels', 'tv', 'basic', true),
('750e8400-e29b-41d4-a716-446655440014', 'Mini Bar', 'In-room refreshment center', 'coffee', 'premium', true),
('750e8400-e29b-41d4-a716-446655440015', 'Laundry Service', 'Professional laundry and dry cleaning', 'shirt', 'basic', true),
('750e8400-e29b-41d4-a716-446655440016', 'Travel Desk', 'Tour and travel assistance', 'map', 'basic', true),
('750e8400-e29b-41d4-a716-446655440017', 'Doctor on Call', '24/7 medical assistance', 'heart', 'premium', true),
('750e8400-e29b-41d4-a716-446655440018', 'Bonfire Area', 'Evening bonfire arrangements', 'flame', 'recreation', true),
('750e8400-e29b-41d4-a716-446655440019', 'Adventure Sports', 'Trekking, paragliding arrangements', 'mountain', 'recreation', true),
('750e8400-e29b-41d4-a716-446655440020', 'Pet Friendly', 'Pets allowed with prior notice', 'heart', 'basic', true);

-- Insert sample hotels
INSERT INTO hotels (
    id, name, description, short_description, owner_id, category_id,
    address, latitude, longitude, area, phone, email, website,
    starting_price, currency, average_rating, total_reviews, total_rooms,
    check_in_time, check_out_time, status, is_featured, is_verified, slug,
    meta_title, meta_description
) VALUES
(
    '850e8400-e29b-41d4-a716-446655440001',
    'Yelagiri Hills Grand Resort',
    'Experience luxury amidst the serene hills of Yelagiri at our grand resort. Nestled in the heart of nature, we offer world-class amenities, breathtaking panoramic views of the valley, and exceptional personalized service. Our resort features elegantly appointed rooms and suites, multiple dining options, a full-service spa, swimming pool, and adventure activity arrangements. Perfect for families, couples, and business travelers seeking comfort, elegance, and tranquility in the lap of nature.',
    'Luxury resort with stunning hill views, world-class amenities, and exceptional service',
    '550e8400-e29b-41d4-a716-446655440002',
    '650e8400-e29b-41d4-a716-446655440001',
    'Yelagiri Hills, Near Yelagiri Lake, Vellore District, Tamil Nadu 635853',
    12.5810, 78.6413,
    'Lake View Area',
    '+91 98765 43210',
    'info@yelagirihillsgrand.com',
    'https://yelagirihillsgrand.com',
    2999.00, 'INR', 4.5, 156, 45,
    '14:00:00', '11:00:00',
    'active', true, true,
    'yelagiri-hills-grand-resort',
    'Yelagiri Hills Grand Resort - Luxury Stay in Tamil Nadu',
    'Book your luxury stay at Yelagiri Hills Grand Resort. Premium amenities, stunning views, and exceptional service in the heart of Yelagiri Hills.'
),
(
    '850e8400-e29b-41d4-a716-446655440002',
    'Mountain View Lodge',
    'A cozy and comfortable lodge nestled in the heart of Yelagiri Hills, offering spectacular panoramic mountain views and a peaceful retreat from city life. Our lodge combines rustic charm with modern amenities, featuring well-appointed rooms with private balconies, an in-house restaurant serving local and continental cuisine, and easy access to popular trekking trails. Ideal for nature lovers, adventure enthusiasts, and those seeking a quiet getaway surrounded by lush greenery and fresh mountain air.',
    'Comfortable lodge with panoramic mountain views and rustic charm',
    '550e8400-e29b-41d4-a716-446655440003',
    '650e8400-e29b-41d4-a716-446655440003',
    'Swamimalai Road, Near Telescope Observatory, Yelagiri Hills, Tamil Nadu 635853',
    12.5825, 78.6398,
    'Swamimalai Area',
    '+91 87654 32109',
    'stay@mountainviewlodge.com',
    'https://mountainviewlodge.com',
    1899.00, 'INR', 4.2, 89, 25,
    '14:00:00', '11:00:00',
    'active', true, true,
    'mountain-view-lodge',
    'Mountain View Lodge Yelagiri - Cozy Hill Station Stay',
    'Experience comfort and tranquility at Mountain View Lodge. Panoramic mountain views, modern amenities, and easy access to adventure activities.'
),
(
    '850e8400-e29b-41d4-a716-446655440003',
    'Lake Side Retreat',
    'Wake up to the gentle sounds of nature at our exclusive lakeside retreat, offering direct access to the pristine Yelagiri Lake. Our property features beautifully designed cottages and rooms with unobstructed lake views, private sit-out areas, and modern amenities. Guests can enjoy boating, fishing, nature walks along the lake shore, and stunning sunrise and sunset views. The retreat also offers yoga sessions, meditation areas, and organic farm-to-table dining experiences, making it perfect for a peaceful and rejuvenating getaway.',
    'Peaceful lakeside retreat with direct lake access and serene ambiance',
    '550e8400-e29b-41d4-a716-446655440004',
    '650e8400-e29b-41d4-a716-446655440006',
    'Lake Road, Yelagiri Lake Front, Yelagiri Hills, Tamil Nadu 635853',
    12.5795, 78.6425,
    'Lake View Area',
    '+91 76543 21098',
    'hello@lakesideretreat.com',
    'https://lakesideretreat.com',
    2299.00, 'INR', 4.3, 124, 30,
    '14:00:00', '11:00:00',
    'active', false, true,
    'lake-side-retreat',
    'Lake Side Retreat Yelagiri - Waterfront Accommodation',
    'Stay at our exclusive lakeside retreat with direct lake access. Perfect for nature lovers seeking peace and tranquility by the water.'
),
(
    '850e8400-e29b-41d4-a716-446655440004',
    'Budget Stay Inn',
    'Clean, comfortable, and affordable accommodation in the heart of Yelagiri town, perfect for budget-conscious travelers who don''t want to compromise on quality and convenience. Our inn offers well-maintained rooms with essential amenities, friendly service, and easy access to local attractions, restaurants, and transportation. Located on the main road, guests can easily explore nearby attractions like the lake, viewpoints, and adventure activity centers. We provide excellent value for money with clean accommodations and helpful staff.',
    'Clean and affordable accommodation in the heart of Yelagiri town',
    '550e8400-e29b-41d4-a716-446655440002',
    '650e8400-e29b-41d4-a716-446655440002',
    'Main Road, Yelagiri Town Center, Yelagiri Hills, Tamil Nadu 635853',
    12.5800, 78.6400,
    'Town Center',
    '+91 65432 10987',
    'info@budgetstayinn.com',
    'https://budgetstayinn.com',
    999.00, 'INR', 3.8, 67, 20,
    '12:00:00', '10:00:00',
    'active', false, true,
    'budget-stay-inn',
    'Budget Stay Inn Yelagiri - Affordable Quality Accommodation',
    'Affordable and comfortable stay in Yelagiri town center. Clean rooms, friendly service, and great value for money.'
),
(
    '850e8400-e29b-41d4-a716-446655440005',
    'Hilltop Paradise Resort',
    'Perched majestically atop the highest accessible point in Yelagiri, our resort offers unmatched 360-degree panoramic views of the entire valley and surrounding hills. Experience paradise with our world-class spa offering traditional Ayurvedic treatments, multiple fine dining restaurants, infinity pool overlooking the valley, and comprehensive adventure activity center. Our luxurious villas and suites feature private pools, butler service, and state-of-the-art amenities. Perfect for honeymoons, special celebrations, and luxury getaways.',
    'Ultra-luxury hilltop resort with unmatched panoramic views and premium amenities',
    '550e8400-e29b-41d4-a716-446655440003',
    '650e8400-e29b-41d4-a716-446655440001',
    'Hilltop Road, Highest Point, Yelagiri Hills, Tamil Nadu 635853',
    12.5840, 78.6380,
    'Hilltop Area',
    '+91 54321 09876',
    'reservations@hilltopparadise.com',
    'https://hilltopparadise.com',
    3499.00, 'INR', 4.7, 203, 60,
    '15:00:00', '12:00:00',
    'active', true, true,
    'hilltop-paradise-resort',
    'Hilltop Paradise Resort - Ultra Luxury in Yelagiri Hills',
    'Experience ultimate luxury at Hilltop Paradise Resort. Panoramic valley views, world-class spa, fine dining, and premium amenities.'
),
(
    '850e8400-e29b-41d4-a716-446655440006',
    'Nature''s Nest Hotel',
    'Surrounded by lush fruit orchards and dense greenery, Nature''s Nest offers an authentic and eco-friendly hill station experience. Our property is designed to blend harmoniously with the natural environment, featuring traditional architecture with modern comforts. Guests can enjoy organic meals prepared with ingredients from our own garden, guided nature walks through fruit orchards, bird watching sessions, and educational tours about local flora and fauna. Perfect for families, nature enthusiasts, and those seeking an environmentally conscious stay.',
    'Eco-friendly hotel surrounded by fruit orchards and natural beauty',
    '550e8400-e29b-41d4-a716-446655440004',
    '650e8400-e29b-41d4-a716-446655440006',
    'Orchard Lane, Fruit Garden Area, Yelagiri Hills, Tamil Nadu 635853',
    12.5785, 78.6445,
    'Orchard Area',
    '+91 43210 98765',
    'stay@naturesnest.com',
    'https://naturesnest.com',
    1699.00, 'INR', 4.1, 78, 18,
    '13:00:00', '10:30:00',
    'active', false, true,
    'natures-nest-hotel',
    'Nature''s Nest Hotel - Eco-Friendly Stay in Yelagiri',
    'Stay close to nature at Nature''s Nest Hotel. Eco-friendly accommodation surrounded by fruit orchards and natural beauty.'
),
(
    '850e8400-e29b-41d4-a716-446655440007',
    'Adventure Base Camp',
    'The ultimate destination for adventure enthusiasts and thrill-seekers visiting Yelagiri Hills. Our specialized accommodation caters to guests interested in paragliding, trekking, rock climbing, and other adventure sports. We offer dormitory-style and private rooms, equipment rental, certified instructors, and organized adventure tours. The property features a common area for socializing, outdoor dining spaces, and direct access to popular adventure spots. Perfect for solo travelers, groups, and anyone looking to add excitement to their Yelagiri experience.',
    'Specialized accommodation for adventure enthusiasts with activity arrangements',
    '550e8400-e29b-41d4-a716-446655440002',
    '650e8400-e29b-41d4-a716-446655440005',
    'Adventure Sports Area, Near Paragliding Point, Yelagiri Hills, Tamil Nadu 635853',
    12.5820, 78.6390,
    'Adventure Zone',
    '+91 32109 87654',
    'info@adventurebasecamp.com',
    'https://adventurebasecamp.com',
    1299.00, 'INR', 4.0, 95, 22,
    '12:00:00', '10:00:00',
    'active', true, true,
    'adventure-base-camp',
    'Adventure Base Camp Yelagiri - Thrill Seekers Paradise',
    'Perfect base for adventure activities in Yelagiri. Paragliding, trekking, and more with expert guidance and equipment.'
),
(
    '850e8400-e29b-41d4-a716-446655440008',
    'Heritage Villa Resort',
    'Step back in time at our beautifully restored heritage villa, showcasing traditional Tamil architecture and colonial influences. Our resort offers a unique blend of historical charm and modern luxury, featuring antique furnishings, period decor, and contemporary amenities. Each room tells a story with carefully curated artifacts and vintage elements. Guests can enjoy traditional cultural performances, heritage walks, local craft workshops, and authentic regional cuisine prepared using traditional methods.',
    'Heritage property with traditional architecture and cultural experiences',
    '550e8400-e29b-41d4-a716-446655440003',
    '650e8400-e29b-41d4-a716-446655440003',
    'Heritage Lane, Old Yelagiri Road, Yelagiri Hills, Tamil Nadu 635853',
    12.5775, 78.6420,
    'Heritage Area',
    '+91 21098 76543',
    'heritage@villaresort.com',
    'https://heritagevilla.com',
    2199.00, 'INR', 4.4, 112, 16,
    '14:00:00', '11:00:00',
    'active', false, true,
    'heritage-villa-resort',
    'Heritage Villa Resort - Traditional Charm in Yelagiri',
    'Experience traditional Tamil architecture and heritage charm. Unique cultural experiences and authentic regional hospitality.'
);

-- Insert hotel images for each hotel
INSERT INTO hotel_images (hotel_id, image_url, alt_text, is_primary, display_order, image_type) VALUES
-- Yelagiri Hills Grand Resort
('850e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=400&width=600&text=Grand+Resort+Main+View', 'Yelagiri Hills Grand Resort - Main Building', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=300&width=500&text=Grand+Resort+Pool', 'Swimming Pool with Mountain Views', false, 2, 'amenity'),
('850e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=300&width=500&text=Grand+Resort+Room', 'Luxury Suite Interior', false, 3, 'room'),
('850e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=300&width=500&text=Grand+Resort+Restaurant', 'Fine Dining Restaurant', false, 4, 'interior'),
('850e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=300&width=500&text=Grand+Resort+Spa', 'Spa and Wellness Center', false, 5, 'amenity'),

-- Mountain View Lodge
('850e8400-e29b-41d4-a716-446655440002', '/placeholder.svg?height=400&width=600&text=Mountain+Lodge+View', 'Mountain View Lodge with Panoramic Views', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440002', '/placeholder.svg?height=300&width=500&text=Lodge+Balcony', 'Private Balcony with Mountain Views', false, 2, 'room'),
('850e8400-e29b-41d4-a716-446655440002', '/placeholder.svg?height=300&width=500&text=Lodge+Interior', 'Cozy Room Interior', false, 3, 'room'),
('850e8400-e29b-41d4-a716-446655440002', '/placeholder.svg?height=300&width=500&text=Lodge+Garden', 'Beautiful Garden Area', false, 4, 'exterior'),

-- Lake Side Retreat
('850e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=400&width=600&text=Lakeside+Retreat', 'Lake Side Retreat - Waterfront View', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=300&width=500&text=Lake+Cottage', 'Lakeside Cottage', false, 2, 'exterior'),
('850e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=300&width=500&text=Lake+View+Room', 'Room with Lake View', false, 3, 'room'),
('850e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=300&width=500&text=Boat+Dock', 'Private Boat Dock', false, 4, 'amenity'),

-- Budget Stay Inn
('850e8400-e29b-41d4-a716-446655440004', '/placeholder.svg?height=400&width=600&text=Budget+Inn', 'Budget Stay Inn - Clean and Comfortable', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440004', '/placeholder.svg?height=300&width=500&text=Budget+Room', 'Clean and Comfortable Room', false, 2, 'room'),
('850e8400-e29b-41d4-a716-446655440004', '/placeholder.svg?height=300&width=500&text=Inn+Lobby', 'Welcoming Lobby Area', false, 3, 'interior'),

-- Hilltop Paradise Resort
('850e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=400&width=600&text=Hilltop+Paradise', 'Hilltop Paradise Resort - Panoramic Views', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=300&width=500&text=Infinity+Pool', 'Infinity Pool with Valley Views', false, 2, 'amenity'),
('850e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=300&width=500&text=Luxury+Villa', 'Luxury Villa with Private Pool', false, 3, 'room'),
('850e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=300&width=500&text=Spa+Treatment', 'World-Class Spa Facility', false, 4, 'amenity'),
('850e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=300&width=500&text=Fine+Dining', 'Fine Dining Restaurant', false, 5, 'interior'),

-- Nature's Nest Hotel
('850e8400-e29b-41d4-a716-446655440006', '/placeholder.svg?height=400&width=600&text=Natures+Nest', 'Nature''s Nest Hotel in Orchard Setting', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440006', '/placeholder.svg?height=300&width=500&text=Fruit+Orchard', 'Surrounding Fruit Orchards', false, 2, 'exterior'),
('850e8400-e29b-41d4-a716-446655440006', '/placeholder.svg?height=300&width=500&text=Eco+Room', 'Eco-Friendly Room Design', false, 3, 'room'),
('850e8400-e29b-41d4-a716-446655440006', '/placeholder.svg?height=300&width=500&text=Organic+Garden', 'Organic Vegetable Garden', false, 4, 'exterior'),

-- Adventure Base Camp
('850e8400-e29b-41d4-a716-446655440007', '/placeholder.svg?height=400&width=600&text=Adventure+Base', 'Adventure Base Camp - Ready for Action', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440007', '/placeholder.svg?height=300&width=500&text=Paragliding+Gear', 'Paragliding Equipment Ready', false, 2, 'amenity'),
('850e8400-e29b-41d4-a716-446655440007', '/placeholder.svg?height=300&width=500&text=Dorm+Room', 'Comfortable Dormitory', false, 3, 'room'),
('850e8400-e29b-41d4-a716-446655440007', '/placeholder.svg?height=300&width=500&text=Common+Area', 'Social Common Area', false, 4, 'interior'),

-- Heritage Villa Resort
('850e8400-e29b-41d4-a716-446655440008', '/placeholder.svg?height=400&width=600&text=Heritage+Villa', 'Heritage Villa Resort - Traditional Architecture', true, 1, 'primary'),
('850e8400-e29b-41d4-a716-446655440008', '/placeholder.svg?height=300&width=500&text=Heritage+Room', 'Heritage Room with Antique Decor', false, 2, 'room'),
('850e8400-e29b-41d4-a716-446655440008', '/placeholder.svg?height=300&width=500&text=Courtyard', 'Traditional Courtyard', false, 3, 'exterior'),
('850e8400-e29b-41d4-a716-446655440008', '/placeholder.svg?height=300&width=500&text=Cultural+Show', 'Cultural Performance Area', false, 4, 'amenity');

-- Insert hotel amenities (assign amenities to hotels based on their category and price range)
INSERT INTO hotel_amenities (hotel_id, amenity_id, is_available, additional_info) VALUES
-- Yelagiri Hills Grand Resort (Luxury - all premium amenities)
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', true, 'High-speed fiber optic WiFi throughout property'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', true, 'Infinity pool with mountain views'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', true, 'Multi-cuisine restaurant and coffee shop'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', true, 'Valet parking available'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440005', true, 'Central AC with individual room controls'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440006', true, 'State-of-the-art fitness center'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440007', true, 'Full-service spa with Ayurvedic treatments'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440008', true, '24/7 room service menu'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440009', true, 'Multiple conference rooms and banquet halls'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440010', true, 'Supervised kids play area and game room'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440011', true, 'Landscaped gardens with walking paths'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440012', true, 'Private balconies in all rooms'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440013', true, 'Smart TVs with international channels'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440014', true, 'Well-stocked mini bar in all rooms'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440015', true, 'Same-day laundry service'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440016', true, 'Dedicated travel and tour desk'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440017', true, 'On-call doctor and medical assistance'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440018', true, 'Evening bonfire arrangements'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440019', true, 'Adventure sports booking and equipment'),

-- Mountain View Lodge (Boutique - selected amenities)
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', true, 'Complimentary WiFi in all areas'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', true, 'In-house restaurant with local cuisine'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', true, 'Free parking space'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', true, 'AC in all rooms'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440011', true, 'Beautiful garden with seating areas'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440012', true, 'Mountain view balconies'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440013', true, 'Cable TV in all rooms'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440015', true, 'Laundry service available'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440016', true, 'Local tour arrangements'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440018', true, 'Bonfire evenings on request'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440019', true, 'Trekking guide arrangements'),

-- Lake Side Retreat (Eco Resort - nature-focused amenities)
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', true, 'WiFi in common areas'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', true, 'Lakeside restaurant with organic menu'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440004', true, 'Parking near lake'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005', true, 'Eco-friendly cooling systems'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440007', true, 'Natural therapy spa treatments'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440011', true, 'Lakeside gardens and meditation areas'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440012', true, 'Lake view terraces'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440013', true, 'Entertainment systems'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440015', true, 'Eco-friendly laundry'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440016', true, 'Nature tour arrangements'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440018', true, 'Lakeside bonfire experiences'),

-- Budget Stay Inn (Basic amenities only)
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001', true, 'Basic WiFi in lobby'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', true, 'Limited parking spaces'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440005', true, 'AC in select rooms'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440013', true, 'Basic cable TV'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440015', true, 'Laundry service on request'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440016', true, 'Basic travel information'),

-- Hilltop Paradise Resort (Ultra Luxury - all premium amenities)
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440001', true, 'Ultra-high-speed WiFi throughout'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440002', true, 'Multiple pools including infinity pool'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440003', true, 'Multiple fine dining restaurants'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440004', true, 'Valet and concierge parking'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', true, 'Climate control in all areas'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440006', true, 'Premium fitness center with trainer'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440007', true, 'Award-winning spa and wellness center'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440008', true, 'Butler service and 24/7 room service'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440009', true, 'Executive conference facilities'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440010', true, 'Kids club with activities'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440011', true, 'Manicured gardens and landscapes'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440012', true, 'Private terraces with panoramic views'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440013', true, 'Premium entertainment systems'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440014', true, 'Premium mini bar service'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440015', true, 'Express laundry and dry cleaning'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440016', true, 'Dedicated concierge service'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440017', true, 'On-site medical facility'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440018', true, 'Private bonfire arrangements'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440019', true, 'Premium adventure packages'),

-- Nature's Nest Hotel (Eco-focused amenities)
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440001', true, 'WiFi in common areas only'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440003', true, 'Organic farm-to-table restaurant'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440004', true, 'Eco-friendly parking'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440005', true, 'Natural ventilation with fans'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440011', true, 'Organic gardens and fruit orchards'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440012', true, 'Garden view balconies'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440013', true, 'Basic entertainment'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440015', true, 'Eco-friendly laundry'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440016', true, 'Nature and bird watching tours'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440018', true, 'Organic bonfire experiences'),

-- Adventure Base Camp (Adventure-focused amenities)
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440001', true, 'WiFi in common areas'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440003', true, 'Cafeteria with energy foods'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440004', true, 'Secure parking for vehicles'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440005', true, 'Basic AC in private rooms'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440013', true, 'Common area entertainment'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440015', true, 'Quick laundry service'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440016', true, 'Adventure activity booking'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440018', true, 'Group bonfire sessions'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440019', true, 'Complete adventure sports package'),

-- Heritage Villa Resort (Heritage-focused amenities)
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440001', true, 'WiFi maintaining heritage aesthetics'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440003', true, 'Traditional cuisine restaurant'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440004', true, 'Heritage-style parking area'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440005', true, 'Period-appropriate climate control'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440007', true, 'Traditional wellness treatments'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440009', true, 'Heritage banquet halls'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440011', true, 'Heritage gardens and courtyards'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440012', true, 'Traditional architecture balconies'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440013', true, 'Period entertainment systems'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440015', true, 'Traditional laundry methods'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440016', true, 'Cultural and heritage tours');

-- Insert room types for each hotel
INSERT INTO room_types (
    id, hotel_id, name, description, max_occupancy, base_price, area_sqft, bed_type, 
    total_rooms, available_rooms, has_ac, has_wifi, has_tv, has_balcony, has_bathroom
) VALUES
-- Yelagiri Hills Grand Resort room types
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'Deluxe Mountain View', 'Spacious room with panoramic mountain views, modern amenities, and elegant furnishing', 2, 2999.00, 350, 'queen', 15, 15, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 'Premium Suite', 'Luxurious suite with separate living area, premium amenities, and stunning valley views', 4, 4499.00, 600, 'king', 10, 10, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', 'Presidential Villa', 'Ultimate luxury villa with private pool, butler service, and exclusive amenities', 6, 7999.00, 1200, 'king', 5, 5, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440001', 'Standard Room', 'Comfortable room with essential amenities and mountain glimpses', 2, 2499.00, 280, 'double', 15, 15, true, true, true, false, true),

-- Mountain View Lodge room types
('950e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440002', 'Mountain View Room', 'Cozy room with direct mountain views and private balcony', 2, 1899.00, 300, 'queen', 15, 15, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440002', 'Family Suite', 'Spacious suite perfect for families with connecting rooms', 4, 2899.00, 500, 'twin', 8, 8, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440002', 'Standard Room', 'Comfortable accommodation with garden views', 2, 1599.00, 250, 'double', 2, 2, true, true, true, false, true),

-- Lake Side Retreat room types
('950e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440003', 'Lakeside Cottage', 'Private cottage with direct lake access and water activities', 3, 2799.00, 400, 'queen', 12, 12, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440003', 'Lake View Room', 'Room with panoramic lake views and private terrace', 2, 2299.00, 320, 'double', 15, 15, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440010', '850e8400-e29b-41d4-a716-446655440003', 'Garden Room', 'Peaceful room overlooking landscaped gardens', 2, 1999.00, 280, 'double', 3, 3, true, true, true, false, true),

-- Budget Stay Inn room types
('950e8400-e29b-41d4-a716-446655440011', '850e8400-e29b-41d4-a716-446655440004', 'AC Room', 'Clean and comfortable room with air conditioning', 2, 1199.00, 200, 'double', 10, 10, true, true, true, false, true),
('950e8400-e29b-41d4-a716-446655440012', '850e8400-e29b-41d4-a716-446655440004', 'Standard Room', 'Basic comfortable room with fan cooling', 2, 999.00, 180, 'double', 8, 8, false, true, true, false, true),
('950e8400-e29b-41d4-a716-446655440013', '850e8400-e29b-41d4-a716-446655440004', 'Triple Room', 'Economical room for three guests', 3, 1299.00, 220, 'triple', 2, 2, true, true, true, false, true),

-- Hilltop Paradise Resort room types
('950e8400-e29b-41d4-a716-446655440014', '850e8400-e29b-41d4-a716-446655440005', 'Panoramic Suite', 'Luxury suite with 360-degree valley views', 2, 4999.00, 700, 'king', 20, 20, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440015', '850e8400-e29b-41d4-a716-446655440005', 'Presidential Villa', 'Ultra-luxury villa with private infinity pool', 4, 8999.00, 1500, 'king', 10, 10, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440016', '850e8400-e29b-41d4-a716-446655440005', 'Deluxe Room', 'Elegant room with premium amenities and valley views', 2, 3499.00, 400, 'queen', 25, 25, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440017', '850e8400-e29b-41d4-a716-446655440005', 'Honeymoon Suite', 'Romantic suite with private jacuzzi and sunset views', 2, 5999.00, 600, 'king', 5, 5, true, true, true, true, true),

-- Nature's Nest Hotel room types
('950e8400-e29b-41d4-a716-446655440018', '850e8400-e29b-41d4-a716-446655440006', 'Orchard View Room', 'Eco-friendly room overlooking fruit orchards', 2, 1699.00, 280, 'queen', 12, 12, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440019', '850e8400-e29b-41d4-a716-446655440006', 'Garden Cottage', 'Private cottage surrounded by organic gardens', 3, 2199.00, 350, 'double', 4, 4, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440020', '850e8400-e29b-41d4-a716-446655440006', 'Tree House', 'Unique elevated accommodation among trees', 2, 2499.00, 300, 'queen', 2, 2, false, true, false, true, true),

-- Adventure Base Camp room types
('950e8400-e29b-41d4-a716-446655440021', '850e8400-e29b-41d4-a716-446655440007', 'Private Room', 'Comfortable private room for adventure enthusiasts', 2, 1599.00, 200, 'double', 8, 8, true, true, true, false, true),
('950e8400-e29b-41d4-a716-446655440022', '850e8400-e29b-41d4-a716-446655440007', 'Dormitory Bed', 'Shared accommodation with adventure community', 1, 699.00, 50, 'single', 12, 12, false, true, false, false, true),
('950e8400-e29b-41d4-a716-446655440023', '850e8400-e29b-41d4-a716-446655440007', 'Adventure Suite', 'Premium room with gear storage and mountain views', 2, 1999.00, 300, 'queen', 2, 2, true, true, true, true, true),

-- Heritage Villa Resort room types
('950e8400-e29b-41d4-a716-446655440024', '850e8400-e29b-41d4-a716-446655440008', 'Heritage Room', 'Traditional room with antique furnishing and modern comfort', 2, 2199.00, 320, 'double', 10, 10, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440025', '850e8400-e29b-41d4-a716-446655440008', 'Royal Suite', 'Luxurious suite with period decor and royal treatment', 3, 3499.00, 500, 'king', 4, 4, true, true, true, true, true),
('950e8400-e29b-41d4-a716-446655440026', '850e8400-e29b-41d4-a716-446655440008', 'Courtyard Room', 'Room overlooking traditional courtyard with cultural ambiance', 2, 1899.00, 280, 'queen', 2, 2, true, true, true, false, true);

-- Insert room images
INSERT INTO room_images (room_type_id, image_url, alt_text, is_primary, display_order) VALUES
-- Grand Resort room images
('950e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=300&width=400&text=Deluxe+Mountain+View', 'Deluxe Mountain View Room', true, 1),
('950e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=300&width=400&text=Mountain+View+Balcony', 'Private Balcony with Mountain Views', false, 2),
('950e8400-e29b-41d4-a716-446655440002', '/placeholder.svg?height=300&width=400&text=Premium+Suite', 'Premium Suite Living Area', true, 1),
('950e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=300&width=400&text=Presidential+Villa', 'Presidential Villa with Private Pool', true, 1),
('950e8400-e29b-41d4-a716-446655440004', '/placeholder.svg?height=300&width=400&text=Standard+Room', 'Standard Room Interior', true, 1),

-- Mountain View Lodge room images
('950e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=300&width=400&text=Mountain+View+Room', 'Mountain View Room with Balcony', true, 1),
('950e8400-e29b-41d4-a716-446655440006', '/placeholder.svg?height=300&width=400&text=Family+Suite', 'Spacious Family Suite', true, 1),
('950e8400-e29b-41d4-a716-446655440007', '/placeholder.svg?height=300&width=400&text=Lodge+Standard', 'Standard Room with Garden View', true, 1),

-- Lake Side Retreat room images
('950e8400-e29b-41d4-a716-446655440008', '/placeholder.svg?height=300&width=400&text=Lakeside+Cottage', 'Private Lakeside Cottage', true, 1),
('950e8400-e29b-41d4-a716-446655440009', '/placeholder.svg?height=300&width=400&text=Lake+View+Room', 'Lake View Room with Terrace', true, 1),
('950e8400-e29b-41d4-a716-446655440010', '/placeholder.svg?height=300&width=400&text=Garden+Room', 'Peaceful Garden Room', true, 1),

-- Budget Stay Inn room images
('950e8400-e29b-41d4-a716-446655440011', '/placeholder.svg?height=300&width=400&text=AC+Room', 'Clean AC Room', true, 1),
('950e8400-e29b-41d4-a716-446655440012', '/placeholder.svg?height=300&width=400&text=Budget+Standard', 'Standard Budget Room', true, 1),
('950e8400-e29b-41d4-a716-446655440013', '/placeholder.svg?height=300&width=400&text=Triple+Room', 'Triple Occupancy Room', true, 1),

-- Hilltop Paradise room images
('950e8400-e29b-41d4-a716-446655440014', '/placeholder.svg?height=300&width=400&text=Panoramic+Suite', 'Panoramic Suite with Valley Views', true, 1),
('950e8400-e29b-41d4-a716-446655
