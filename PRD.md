# Product Requirements Document (PRD)

## Project: Ganesh Residency – Beach Resort & CRM

### 1. Executive Summary
Ganesh Residency is a premium beachfront resort located in Pondicherry. The project consists of two primary components:
- **Public-Facing Website:** A high-conversion, luxury-themed direct booking platform for guests.
- **Internal Hotel CRM:** A role-based management system for resort staff to handle operations, reservations, and finances.

### 2. Target Audience
- **Guests:** Tourists, families, and corporate travelers seeking beachfront accommodation.
- **Staff:** Owners (Super Admin), Managers, Receptionists, Housekeeping, and Accountants.

### 3. Key Features & Functional Requirements

#### A. Public Website & Booking Engine
- **Premium Hero Section:** Immersive visuals with a sticky availability search bar.
- **Room Catalog:** Detailed listing of room types (Executive, Triple, Four-Occupancy, Six-Bed) with amenities and real-time pricing.
- **4-Step Direct Booking Flow:**
  - *Step 1 (Selection):* Date and room selection with a sticky summary panel.
  - *Step 2 (Guest Info):* Secure form for personal details and special requests.
  - *Step 3 (Payment):* Simulated checkout with UPI and Card options (Stripe/Razorpay ready).
  - *Step 4 (Confirmation):* Success screen with Booking ID, invoice download, and WhatsApp integration.
- **Floating Support:** Persistent WhatsApp button for instant guest queries.

#### B. Role-Based Hotel CRM
- **Unified Authentication:** Single login page with role-based redirection.
- **Role-Specific Dashboards:**
  - *Super Admin:* Full financial analytics, occupancy trends, and staff management.
  - *Manager:* Daily operations overview (check-ins/outs, availability).
  - *Reception:* Guest check-in/out, reservation management, and room assignment.
  - *Housekeeping:* Room cleaning status and maintenance alerts.
  - *Accountant:* Revenue reports, GST tracking, and invoice management.
- **Interactive Calendar View:** A visual timeline of room occupancy and maintenance.
- **Guest Directory:** Searchable database of guest history and preferences.
- **Invoice System:** Generation of GST-compliant invoices with PDF export capability.

### 4. Technical Specifications
- **Frontend:** React 19 (Functional Components, Hooks).
- **Build Tool:** Vite (Fast HMR and optimized production builds).
- **Styling:** Tailwind CSS 4.0 (Utility-first, mobile-responsive).
- **Animations:** Framer Motion (Smooth page transitions and micro-interactions).
- **Icons:** Lucide React (Consistent, lightweight SVG icons).
- **Charts:** Recharts (Data visualization for revenue and occupancy).
- **State Management:** React Context API (Auth and Global State).

### 5. Design Principles
- **Aesthetic:** "Ocean-Premium" — Ocean blue primary colors, warm sand neutrals, and clean white surfaces.
- **Typography:** Playfair Display (Headings) for elegance; Inter (Body) for legibility.
- **Usability:** Mobile-first responsive design, large tap targets, and minimum friction in the booking process.
- **Trust:** Visible security badges, clear pricing breakdowns, and professional SaaS-style admin interface.

### 6. User Journeys

#### Guest Journey
1. Land on Home page -> Search dates.
2. Select a room from the catalog.
3. Fill guest details and agree to policies.
4. Pay via preferred method.
5. Receive instant confirmation and WhatsApp notification.

#### Staff Journey
1. Login via the "Staff Login" link in the footer.
2. View dashboard tailored to specific job responsibilities.
3. Perform tasks (e.g., Receptionist checks in a guest; Housekeeper marks a room as "Clean").
4. Log out securely.

### 7. Future Roadmap
- **Real-time Updates:** Integration with Supabase/WebSockets for live room status.
- **OTA Sync:** Channel manager integration (Booking.com, Agoda).
- **Automated Messaging:** n8n or Zapier workflows for automated guest emails and feedback loops.
- **Mobile App:** Dedicated staff app for housekeeping and maintenance.
