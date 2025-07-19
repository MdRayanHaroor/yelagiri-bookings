-- Create property submissions table for admin review
CREATE TABLE IF NOT EXISTS property_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    address TEXT NOT NULL,
    area VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Pricing and Features
    starting_price DECIMAL(10, 2) NOT NULL,
    total_rooms INTEGER NOT NULL,
    check_in_time TIME DEFAULT '14:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    
    -- Location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    slug VARCHAR(255),
    
    -- Owner Information (JSON)
    owner_info JSONB NOT NULL,
    
    -- Amenities and Room Types (JSON)
    amenities JSONB DEFAULT '[]',
    room_types JSONB DEFAULT '[]',
    
    -- Admin Notes
    admin_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_property_submissions_status ON property_submissions(status);
CREATE INDEX idx_property_submissions_area ON property_submissions(area);
CREATE INDEX idx_property_submissions_submission_date ON property_submissions(submission_date DESC);

-- Insert some sample submissions for testing
INSERT INTO property_submissions (
    name, description, short_description, address, area, phone, email,
    starting_price, total_rooms, owner_info, amenities, room_types, status
) VALUES (
    'Test Pending Hotel',
    'This is a test hotel submission pending admin approval.',
    'Test hotel for admin review',
    'Test Address, Yelagiri Hills',
    'Lake View Area',
    '+91 99999 88888',
    'test@hotel.com',
    1500.00,
    20,
    '{"name": "Test Owner", "phone": "+91 99999 88888", "email": "owner@test.com"}',
    '["Free WiFi", "Parking", "Restaurant"]',
    '[{"name": "Standard Room", "price": "1500", "occupancy": "2"}]',
    'pending'
);
