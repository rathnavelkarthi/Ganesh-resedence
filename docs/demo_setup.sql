-- Demo Setup Script for HospitalityOS
-- Run this in your Supabase SQL Editor to create a Demo Hotel environment.

-- 1. Create a Demo Tenant
INSERT INTO tenants (id, business_name, business_type, subdomain, template, plan, is_active)
VALUES (
  'demo-hotel-777', 
  'Ocean View Demo Resort', 
  'combined', 
  'demo-ocean-view', 
  'luxury', 
  'enterprise', 
  true
) ON CONFLICT (id) DO NOTHING;

-- 2. Link Demo User (Optional, the "Try Demo" button will handle this in UI)
-- Replace 'YOUR_USER_ID' with your Clerk User ID if you want to test with your own account.
-- INSERT INTO user_properties (user_id, tenant_id, role, is_owner)
-- VALUES ('user_2o8...', 'demo-hotel-777', 'SUPER_ADMIN', true);

-- 3. Add Demo Rooms
INSERT INTO rooms (id, tenant_id, room_number, type, status, price, housekeeper_id)
VALUES 
  (gen_random_uuid(), 'demo-hotel-777', '101', 'Deluxe Ocean', 'AVAILABLE', 4500, NULL),
  (gen_random_uuid(), 'demo-hotel-777', '102', 'Deluxe Ocean', 'OCCUPIED', 4500, NULL),
  (gen_random_uuid(), 'demo-hotel-777', '201', 'Suite', 'AVAILABLE', 8500, NULL),
  (gen_random_uuid(), 'demo-hotel-777', '202', 'Suite', 'MAINTENANCE', 8500, NULL),
  (gen_random_uuid(), 'demo-hotel-777', '301', 'Penthouse', 'AVAILABLE', 15000, NULL)
ON CONFLICT DO NOTHING;

-- 4. Add Demo Bookings
INSERT INTO reservations (id, tenant_id, guest_name, room_id, check_in, check_out, status, amount, payment_status)
VALUES 
  (gen_random_uuid(), 'demo-hotel-777', 'John Doe', NULL, CURRENT_DATE, CURRENT_DATE + 3, 'CONFIRMED', 13500, 'PAID'),
  (gen_random_uuid(), 'demo-hotel-777', 'Jane Smith', NULL, CURRENT_DATE + 5, CURRENT_DATE + 7, 'PENDING', 9000, 'PENDING')
ON CONFLICT DO NOTHING;
