# Pricing Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 3-tier high-price pricing page with a 4-tier market-competitive pricing page (Free Starter, Growth ₹2,499, Pro ₹4,999, Enterprise ₹9,999) to target Indian hotel/PG market.

**Architecture:** Update-in-place — modify existing PricingPage.tsx, PricingCard.tsx, BillingToggle.tsx, and FAQAccordion.tsx. No new files needed. Grid changes from 3-col to 4-col. PricingCard gains support for a free tier variant.

**Tech Stack:** React, TypeScript, Tailwind CSS, motion/react (framer-motion), lucide-react icons

---

### Task 1: Update BillingToggle — change save percentage

**Files:**
- Modify: `src/components/pricing/BillingToggle.tsx`

**Step 1: Update the save badge text**

In `BillingToggle.tsx`, change the save percentage from 18% to 20%:

```tsx
// Line 34, change:
Save 18%
// To:
Save 20%
```

**Step 2: Verify in browser**

Run: `npm run dev`
Navigate to pricing page. Confirm toggle shows "Save 20%".

**Step 3: Commit**

```bash
git add src/components/pricing/BillingToggle.tsx
git commit -m "feat(pricing): update annual save percentage to 20%"
```

---

### Task 2: Update PricingCard to handle free tier

**Files:**
- Modify: `src/components/pricing/PricingCard.tsx`

**Step 1: Add isFree prop and update display logic**

Update the interface and component to handle a free tier:

```tsx
interface PricingCardProps {
    name: string;
    price: string;
    period?: string;        // NEW: "/mo" or "/yr" or empty for free
    description: string;
    features: string[];
    isPopular?: boolean;
    isFree?: boolean;        // NEW
    ctaText: string;
    onCtaClick?: () => void;
    index: number;
}
```

Update the component signature to accept `isFree` and `period`:

```tsx
export default function PricingCard({
    name, price, period, description, features,
    isPopular, isFree, ctaText, onCtaClick, index
}: PricingCardProps) {
```

Update the price display section (around line 46-49). Replace the hardcoded "/ year" with dynamic period:

```tsx
<div className="mb-8 pb-8 border-b border-gray-100 flex items-baseline gap-1">
    <span className="text-4xl lg:text-5xl font-bold text-[#0E2A38] tracking-tight">{price}</span>
    {period && <span className="text-gray-400 font-medium tracking-wide">{period}</span>}
</div>
```

Update the CTA button styling (around line 60-68) to add a green variant for the free tier:

```tsx
<button
    onClick={onCtaClick}
    className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-sm ${
        isPopular
            ? 'bg-[#0E2A38] hover:bg-[#091b24] text-[#C9A646] hover:shadow-lg'
            : isFree
                ? 'bg-[#2E7D5B] hover:bg-[#256b4d] text-white hover:shadow-lg'
                : 'bg-[#F7F4EF] hover:bg-[#edeade] text-[#0E2A38] border border-gray-200'
    }`}
>
    {ctaText}
</button>
```

**Step 2: Verify component compiles**

Run: `npm run dev`
Check for TypeScript errors in terminal. Page should still render (existing cards won't pass new props yet, which is fine since they're optional).

**Step 3: Commit**

```bash
git add src/components/pricing/PricingCard.tsx
git commit -m "feat(pricing): add free tier support to PricingCard component"
```

---

### Task 3: Update PricingPage — new tiers, 4-col grid, updated ROI

**Files:**
- Modify: `src/pages/PricingPage.tsx`

**Step 1: Update pricing data**

Replace lines 9-14 (the pricing state and calculations) with:

```tsx
const [isYearly, setIsYearly] = useState(true);

// New pricing tiers
const starterPrice = "Free";
const growthPrice = isYearly ? "₹23,999" : "₹2,499";
const growthPeriod = isYearly ? "/ year" : "/ month";
const proPrice = isYearly ? "₹47,999" : "₹4,999";
const proPeriod = isYearly ? "/ year" : "/ month";
const enterprisePrice = isYearly ? "₹95,999" : "₹9,999";
const enterprisePeriod = isYearly ? "/ year" : "/ month";
```

**Step 2: Update hero text**

Replace lines 32-33 (the h1 content):

```tsx
Simple Pricing.<br />Start Free.
```

Replace lines 40-41 (the subtitle):

```tsx
One platform. Complete hotel & restaurant operations. Free to start.
```

**Step 3: Update the pricing grid**

Replace the entire pricing grid section (lines 55-105) with a 4-column grid:

```tsx
{/* PRICING GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-32 items-start">
    <PricingCard
        index={0}
        name="STARTER"
        isFree={true}
        price={starterPrice}
        description="Try HospitalityOS with zero commitment."
        ctaText="Start Free"
        features={[
            "Basic Booking Page",
            "Up to 5 Rooms",
            "Calendar View",
            "20 Bookings / month",
            "Email Support"
        ]}
    />
    <PricingCard
        index={1}
        name="GROWTH"
        price={growthPrice}
        period={growthPeriod}
        description="For independent hotels going digital."
        ctaText="Get Started"
        features={[
            "Everything in Starter, plus:",
            "Custom Booking Website",
            "Booking Engine",
            "CRM Dashboard",
            "Guest Management",
            "GST Invoice System",
            "WhatsApp (100 msgs/mo)"
        ]}
    />
    <PricingCard
        index={2}
        name="PRO"
        isPopular={true}
        price={proPrice}
        period={proPeriod}
        description="Complete hotel + restaurant platform."
        ctaText="Start Pro Plan"
        features={[
            "Everything in Growth, plus:",
            "OTA Booking Sync",
            "Restaurant POS & Menu",
            "Food Orders & Inventory",
            "Full WhatsApp Automation",
            "Revenue Analytics",
            "Priority Support"
        ]}
    />
    <PricingCard
        index={3}
        name="ENTERPRISE"
        price={enterprisePrice}
        period={enterprisePeriod}
        description="For hotel groups and chains."
        ctaText="Contact Sales"
        features={[
            "Everything in Pro, plus:",
            "Unlimited Rooms",
            "Multi-Property Dashboard",
            "API Access",
            "Custom Branding",
            "Dedicated Account Manager",
            "On-Site Training"
        ]}
    />
</div>
```

**Step 4: Remove the old Enterprise banner section**

Delete the entire Enterprise section (lines 107-133 in original, the `motion.div` with "Enterprise & Multi-Property" heading). This is now a card in the grid.

**Step 5: Update ROI section math**

Replace the ROI content (inside the `bg-white/5` div, lines 159-175) with:

```tsx
<div className="space-y-6 text-[17px] font-medium text-white/90">
    <p className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-gray-500" /> Growth plan costs just <strong className="text-white text-xl ml-2">₹2,499/month</strong></p>
    <p className="flex items-center gap-4"><span className="w-2 h-2 rounded-full bg-gray-500" /> One extra direct booking at <strong className="text-[#2E7D5B] text-xl ml-2 bg-[#E8F3EF]/10 px-2 py-0.5 rounded">₹3,000/night</strong> covers it</p>

    <div className="h-[1px] bg-white/20 my-8" />

    <div className="flex items-center justify-between gap-12">
        <span className="text-white/60 text-lg">Annual ROI</span>
        <span className="font-serif text-4xl lg:text-5xl font-bold text-[#C9A646]">12x return</span>
    </div>
</div>

<div className="mt-12 pt-8 border-t border-white/10 text-center">
    <p className="text-lg font-bold tracking-widest uppercase text-white/80">
        One booking pays for <span className="text-white">the entire month.</span>
    </p>
</div>
```

**Step 6: Remove unused imports**

The `Building2` icon was used in the Enterprise banner. Check if it's still used in the trust section — it is (line 187: `{ icon: Building2, title: "Annual Contracts" }`), so keep it.

**Step 7: Verify in browser**

Run: `npm run dev`
Navigate to pricing page. Confirm:
- 4 cards render in a row on desktop
- Free tier shows "Free" with no period
- Pro has "Most Popular" badge
- Toggle switches between monthly/yearly prices
- ROI section shows updated math
- No Enterprise banner below cards

**Step 8: Commit**

```bash
git add src/pages/PricingPage.tsx
git commit -m "feat(pricing): new 4-tier pricing with free starter and competitive Indian market rates"
```

---

### Task 4: Update FAQAccordion — new tier names and free tier FAQ

**Files:**
- Modify: `src/components/pricing/FAQAccordion.tsx`

**Step 1: Replace the faqs array**

Replace the entire `faqs` array (lines 10-31) with:

```tsx
const faqs: FAQ[] = [
    {
        question: "Is there a free plan?",
        answer: "Yes! Our Starter plan is completely free — up to 5 rooms, 20 bookings per month, and a basic booking page. No credit card required. Upgrade anytime as you grow."
    },
    {
        question: "Is there a setup fee?",
        answer: "No. All onboarding, initial data migration, and training are included in your subscription. We believe your success is our success."
    },
    {
        question: "Do you integrate with OTAs?",
        answer: "Yes, our Pro and Enterprise plans include seamless two-way synchronization with all major OTAs (MakeMyTrip, Goibibo, Booking.com, Agoda) via our channel manager."
    },
    {
        question: "Can I manage my hotel restaurant too?",
        answer: "Absolutely. Our Pro plan includes a full restaurant POS — menu management, food orders with kitchen tracking, table management, and inventory control. All integrated with your hotel operations."
    },
    {
        question: "Can I manage multiple properties?",
        answer: "Yes. The Enterprise plan includes a multi-property dashboard where you can manage all your hotels from a single login, with per-property staff roles and unified analytics."
    },
    {
        question: "What happens after Year 1?",
        answer: "Your subscription locks in your pricing for 12 months. After Year 1, you can renew at the same rate, ensuring predictable, transparent operational costs."
    }
];
```

**Step 2: Verify in browser**

Run: `npm run dev`
Scroll to FAQ section. Confirm 6 FAQs render with updated content.

**Step 3: Commit**

```bash
git add src/components/pricing/FAQAccordion.tsx
git commit -m "feat(pricing): update FAQs for new tier names and free plan"
```

---

### Task 5: Final visual QA and responsive check

**Step 1: Check responsive breakpoints**

In browser dev tools, check:
- **Mobile (375px):** Cards stack vertically, 1 column
- **Tablet (768px):** Cards in 2x2 grid
- **Desktop (1280px):** All 4 cards in a row

**Step 2: Check billing toggle**

Toggle between Monthly and Yearly:
- Starter stays "Free" in both modes
- Growth shows ₹2,499/month vs ₹23,999/year
- Pro shows ₹4,999/month vs ₹47,999/year
- Enterprise shows ₹9,999/month vs ₹95,999/year
- "Save 20%" badge visible on yearly toggle

**Step 3: Check animations**

Scroll through page — all motion animations should work (fade in on scroll, card hover lift, FAQ accordion open/close).

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(pricing): responsive and visual polish for 4-tier layout"
```
