-- Comprehensive Demo Population Script for demo-hotel-777
-- Run this in Supabase SQL Editor

-- 1. Ensure Tenant exists
INSERT INTO tenants (id, business_name, business_type, subdomain, template, plan, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000777', 
  'Ocean View Demo Resort', 
  'combined', 
  'demo-ocean-view', 
  'luxury', 
  'enterprise', 
  true
) ON CONFLICT (id) DO UPDATE SET 
  business_name = EXCLUDED.business_name,
  business_type = EXCLUDED.business_type,
  subdomain = EXCLUDED.subdomain;

-- 2. Clear old demo data (Optional, but recommended for a clean demo)
DELETE FROM reservations WHERE tenant_id = '00000000-0000-0000-0000-000000000777';
DELETE FROM rooms WHERE tenant_id = '00000000-0000-0000-0000-000000000777';
DELETE FROM menu_items WHERE category_id IN (SELECT id FROM menu_categories WHERE tenant_id = '00000000-0000-0000-0000-000000000777');
DELETE FROM menu_categories WHERE tenant_id = '00000000-0000-0000-0000-000000000777';
DELETE FROM restaurant_tables WHERE tenant_id = '00000000-0000-0000-0000-000000000777';
DELETE FROM food_orders WHERE tenant_id = '00000000-0000-0000-0000-000000000777';

-- 3. Add Rooms
INSERT INTO rooms (tenant_id, room_number, type, status, price_per_night, max_occupancy, amenities, images, is_available)
VALUES 
  ('00000000-0000-0000-0000-000000000777', '101', 'Deluxe Ocean Room', 'Available', 4500, 2, '["Ocean View", "King Bed", "Mini Bar", "WiFi"]', '["https://images.unsplash.com/photo-1590490360182-c33d57733427"]', true),
  ('00000000-0000-0000-0000-000000000777', '102', 'Deluxe Ocean Room', 'Available', 4500, 2, '["Ocean View", "King Bed", "Mini Bar", "WiFi"]', '["https://images.unsplash.com/photo-1566665797739-1674de7a421a"]', true),
  ('00000000-0000-0000-0000-000000000777', '201', 'Executive Suite', 'Available', 8500, 3, '["Private Balcony", "Living Area", "Jacuzzi", "WiFi"]', '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"]', true),
  ('00000000-0000-0000-0000-000000000777', '202', 'Family Villa', 'Available', 12500, 4, '["Private Pool", "Kitchenette", "2 Bedrooms", "WiFi"]', '["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"]', true),
  ('00000000-0000-0000-0000-000000000777', '301', 'Royal Penthouse', 'Occupied', 25000, 2, '["360 View", "Private Chef", "Spa Room", "WiFi"]', '["https://images.unsplash.com/photo-1590490359683-658d3d23f972"]', false);

-- 4. Add Menu Categories
INSERT INTO menu_categories (tenant_id, name, description, sort_order)
VALUES 
  ('00000000-0000-0000-0000-000000000777', 'Signature Starters', 'Perfect beginning to your coastal feast', 1),
  ('00000000-0000-0000-0000-000000000777', 'Main Course', 'Chef curated global flavors', 2),
  ('00000000-0000-0000-0000-000000000777', 'Desserts', 'Sweet endings to remember', 3),
  ('00000000-0000-0000-0000-000000000777', 'Refreshments', 'Freshly squeezed juices and cocktails', 4);

-- 5. Add Menu Items
DO $$
DECLARE
    cat1_id int;
    cat2_id int;
    cat3_id int;
    cat4_id int;
BEGIN
    SELECT id INTO cat1_id FROM menu_categories WHERE tenant_id = '00000000-0000-0000-0000-000000000777' AND name = 'Signature Starters';
    SELECT id INTO cat2_id FROM menu_categories WHERE tenant_id = '00000000-0000-0000-0000-000000000777' AND name = 'Main Course';
    SELECT id INTO cat3_id FROM menu_categories WHERE tenant_id = '00000000-0000-0000-0000-000000000777' AND name = 'Desserts';
    SELECT id INTO cat4_id FROM menu_categories WHERE tenant_id = '00000000-0000-0000-0000-000000000777' AND name = 'Refreshments';

    INSERT INTO menu_items (category_id, name, description, price, is_veg, image_url, sort_order)
    VALUES 
      (cat1_id, 'Crispy Calamari', 'Fresh coastal squid with lemon aioli', 450, false, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0', 1),
      (cat1_id, 'Paneer Tikka', 'Clay oven roasted cottage cheese with mint chutney', 380, true, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', 2),
      (cat2_id, 'Thai Green Curry', 'Aromatic curry served with jasmine rice', 550, true, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', 1),
      (cat2_id, 'Grilled Sea Bass', 'Lemon butter sauce with seasonal greens', 850, false, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', 2),
      (cat3_id, 'Chocolate Lava Cake', 'Warm melting heart served with vanilla bean ice-cream', 350, true, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 1),
      (cat3_id, 'Tropical Fruit Platter', 'Slices of passion fruit, mango, and papaya', 280, true, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e', 2),
      (cat4_id, 'Classic Mojito', 'Fresh mint, lime, and soda', 250, true, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd', 1);
END $$;

-- 6. Add Restaurant Tables
INSERT INTO restaurant_tables (tenant_id, table_number, capacity, status, section)
VALUES 
  ('00000000-0000-0000-0000-000000000777', 'T-01', 2, 'available', 'Indoor'),
  ('00000000-0000-0000-0000-000000000777', 'T-02', 2, 'available', 'Indoor'),
  ('00000000-0000-0000-0000-000000000777', 'T-03', 4, 'occupied', 'Window Side'),
  ('00000000-0000-0000-0000-000000000777', 'T-04', 4, 'available', 'Window Side'),
  ('00000000-0000-0000-0000-000000000777', 'P-01', 6, 'reserved', 'Poolside'),
  ('00000000-0000-0000-0000-000000000777', 'P-02', 4, 'available', 'Poolside');

-- 7. Add Staff
INSERT INTO staff (id, tenant_id, name, email, phone, role, status)
VALUES 
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000777', 'Anita Sharma', 'anita@demo.com', '+91 91234 56789', 'Receptionist', 'ACTIVE'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000777', 'Rajesh Kumar', 'rajesh@demo.com', '+91 92234 56789', 'Chef', 'ACTIVE'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000777', 'Sarah Jones', 'sarah@demo.com', '+91 93234 56789', 'Housekeeping', 'ACTIVE');

-- 8. Add Sample Reservations
INSERT INTO reservations (tenant_id, guest_name, room_type, check_in, check_out, status, amount, payment_status, source)
VALUES 
  ('00000000-0000-0000-0000-000000000777', 'Alice Wonder', 'Deluxe Ocean Room', CURRENT_DATE, CURRENT_DATE + 2, 'Confirmed', 9000, 'PAID', 'WEBSITE'),
  ('00000000-0000-0000-0000-000000000777', 'Bob Builder', 'Executive Suite', CURRENT_DATE + 3, CURRENT_DATE + 5, 'Pending', 17000, 'PENDING', 'BOOKING.COM');
