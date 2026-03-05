# Pricing Page Redesign — Indian Market Strategy

**Date:** 2026-03-05
**Status:** Approved

## Goal

Update the pricing page from 3 tiers (Basic ₹69,999/yr, Pro ₹1,24,999/yr, Elite ₹1,99,999/yr) to 4 market-competitive tiers targeting $10K USD MRR through volume at lower price points.

## New Tiers

| Tier | Monthly | Annual (20% off) | Room Limit | Target |
|---|---|---|---|---|
| Starter | Free | Free | 5 rooms, 1 property, 20 bookings/mo | Lead gen, viral acquisition |
| Growth | ₹2,499 | ₹23,999/yr | 30 rooms | Small hotels, PGs |
| Pro | ₹4,999 | ₹47,999/yr | 75 rooms | Mid-size hotels w/ restaurant |
| Enterprise | ₹9,999 | ₹95,999/yr | Unlimited | Hotel groups, chains |

## Changes

### PricingPage.tsx
- 4-column grid instead of 3
- Remove separate Enterprise banner section
- Update hero: "Simple Pricing. Start Free."
- Update ROI section math for lower price points

### PricingCard.tsx
- Handle free tier (show "Free" instead of price, different CTA styling)
- All 4 tiers use the same card component

### BillingToggle.tsx
- Update save percentage from 18% to 20%

### FAQAccordion.tsx
- Update tier name references (Basic→Starter, Elite→Enterprise)
- Add FAQ about free tier limitations

## Visual Design
- Keep existing design language: #0E2A38 navy, #C9A646 gold, #2E7D5B green
- Keep serif headings, motion animations, noise textures
- Pro tier gets "Most Popular" badge

## Feature Lists Per Tier

**Starter (Free):**
- Basic Booking Page
- Up to 5 Rooms
- Calendar View
- 20 Bookings/month
- Email Support

**Growth (₹2,499/mo):**
- Everything in Starter
- Custom Booking Website
- Booking Engine
- CRM Dashboard
- Guest Management
- GST Invoices
- WhatsApp (100 msgs/mo)

**Pro (₹4,999/mo):**
- Everything in Growth
- OTA Booking Sync
- Restaurant POS & Menu
- Food Orders & Inventory
- Full WhatsApp Automation
- Revenue Analytics
- Priority Support

**Enterprise (₹9,999/mo):**
- Everything in Pro
- Unlimited Rooms
- Multi-Property Dashboard
- API Access
- Custom Branding
- Dedicated Account Manager
- On-Site Training
