const XLSX = require('xlsx');
const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('./leads_target.json', 'utf8'));

// Analyze reviews to find specific pain points
function analyzeReviews(lead) {
  const reviews = lead.reviews || [];
  const negativeReviews = reviews.filter(r => r.stars && r.stars <= 3);
  const allText = reviews.map(r => (r.text || '').toLowerCase()).join(' ');

  const painPoints = [];
  const specificComplaints = [];

  // Booking & communication issues
  if (allText.match(/booking|reservation|confirm|response|reply|call|phone|reach|contact/)) {
    painPoints.push('BOOKING_ISSUES');
    const match = reviews.find(r => r.text && r.text.toLowerCase().match(/booking|reservation|confirm|response|reply|call|reach/));
    if (match) specificComplaints.push(match.text.substring(0, 150));
  }

  // Service & staff issues
  if (allText.match(/service|staff|reception|rude|unhelpful|slow|late|wait|delay/)) {
    painPoints.push('POOR_SERVICE');
    const match = reviews.find(r => r.text && r.stars <= 3 && r.text.toLowerCase().match(/service|staff|reception|rude|slow|late|wait/));
    if (match) specificComplaints.push(match.text.substring(0, 150));
  }

  // Cleanliness
  if (allText.match(/dirty|clean|hygien|stain|smell|cockroach|bug|pest|dust|mold/)) {
    painPoints.push('CLEANLINESS');
  }

  // Check-in/out issues
  if (allText.match(/check.?in|check.?out|waiting|queue|process|document|id proof/)) {
    painPoints.push('CHECKIN_ISSUES');
  }

  // Price/value issues
  if (allText.match(/overpriced|expensive|not worth|value for money|price|costly|charge/)) {
    painPoints.push('PRICING_ISSUES');
  }

  // No online presence complaints
  if (allText.match(/no website|cant find|hard to find|no information|no details|google/)) {
    painPoints.push('NO_ONLINE_PRESENCE');
  }

  // Food/restaurant
  if (allText.match(/food|breakfast|restaurant|menu|kitchen|dining/)) {
    painPoints.push('FOOD_ISSUES');
  }

  // No website is always a pain point
  if (!lead.website) {
    painPoints.push('NO_WEBSITE');
  }

  // OTA dependency
  if (lead.website && (
    lead.website.includes('booking.com') || lead.website.includes('goibibo') ||
    lead.website.includes('makemytrip') || lead.website.includes('airbnb')
  )) {
    painPoints.push('OTA_DEPENDENT');
  }

  // Low rating
  if (lead.totalScore && lead.totalScore < 4.0) {
    painPoints.push('LOW_RATING');
  }

  if (painPoints.length === 0) painPoints.push('GENERAL');

  return { painPoints, specificComplaints, negativeCount: negativeReviews.length };
}

// Generate hyper-personalized message based on actual review analysis
function generateMessage(lead, analysis) {
  const name = lead.title.replace(/ - .*$/, '').trim();
  const location = lead.searchString?.replace(/^.*in\s+/i, '') || '';
  const { painPoints, specificComplaints } = analysis;
  const rating = lead.totalScore || 'N/A';
  const reviewCount = lead.reviewsCount || 0;

  // Determine priority
  let priority = 'WARM';
  if (!lead.website && lead.totalScore && lead.totalScore < 4.0) priority = 'ULTRA_HOT';
  else if (!lead.website) priority = 'HOT';
  else if (lead.totalScore && lead.totalScore < 3.8) priority = 'HOT';

  let message = '';

  if (priority === 'ULTRA_HOT') {
    // No website + low rating = they NEED this yesterday
    message = `Namaste! 🙏

I was looking at *${name}* on Google Maps and noticed a few things:

1️⃣ You don't have your own website yet — guests can't find you directly or book online
2️⃣ Some recent reviews mention ${painPoints.includes('POOR_SERVICE') ? 'service delays' : painPoints.includes('BOOKING_ISSUES') ? 'booking difficulties' : painPoints.includes('CLEANLINESS') ? 'housekeeping concerns' : 'areas for improvement'}

Both problems have ONE solution 👇

*EasyStay* (esaystay.com) gives you:
✅ Your own professional booking website — ready in 5 min
✅ Auto WhatsApp confirmations — no missed bookings
✅ Guest check-in/out system — smoother operations
✅ Review management — turn unhappy guests into 5-star reviews

Properties in ${location} using EasyStay improved their Google rating by 0.5+ stars within 3 months.

You can try EasyStay *FREE* — up to 5 rooms and 20 bookings, no card needed. I can set up *${name}* in 5 minutes. Interested?`;

  } else if (!lead.website) {
    // No website but decent rating
    message = `Namaste! 🙏

I came across *${name}* on Google Maps — ${rating >= 4.0 ? `great ${rating}★ rating with ${reviewCount} reviews!` : `solid presence with ${reviewCount} reviews!`}

But I noticed you don't have your own website. That means:
❌ Guests can't book directly — you lose them to competitors
❌ You depend entirely on OTAs (15-20% commission per booking)
❌ No way to collect guest emails for repeat business

*EasyStay* (esaystay.com) fixes this in 5 minutes:
✅ Beautiful booking website for *${name}*
✅ WhatsApp auto-confirmations & reminders
✅ Direct payments — zero commission
✅ Guest CRM to build repeat customers

Try it *FREE* — up to 5 rooms and 20 bookings, no card needed. Shall I set it up for *${name}*?`;

  } else if (painPoints.includes('LOW_RATING')) {
    // Has website but low ratings
    message = `Namaste! 🙏

I noticed *${name}* in ${location} — ${reviewCount}+ reviews show you have great traffic! But some recent guests mentioned ${painPoints.includes('POOR_SERVICE') ? 'service speed' : painPoints.includes('BOOKING_ISSUES') ? 'booking issues' : painPoints.includes('CHECKIN_ISSUES') ? 'check-in delays' : 'operational challenges'}.

*EasyStay* (esaystay.com) helps fix exactly this:
✅ Automated booking flow — no manual errors
✅ WhatsApp confirmations — guests always informed
✅ Digital check-in — faster, professional experience
✅ Auto review requests — get more 5-star reviews
${painPoints.includes('FOOD_ISSUES') ? '✅ POS system for restaurant — faster ordering\n' : ''}
Your ${rating}★ rating could easily become 4.5+ with better systems.\n\nStart *FREE* — 5 rooms, 20 bookings, no card needed. Want a quick 5-min demo?`;

  } else {
    // General pitch
    message = `Namaste! 🙏

I found *${name}* in ${location} on Google Maps. ${rating >= 4.0 ? 'Great reviews!' : 'Nice property!'}

Quick question — are you managing bookings manually or through OTAs?

*EasyStay* (esaystay.com) is an all-in-one platform for properties like yours:
✅ Own booking website with online payments
✅ WhatsApp automation (confirmations, reminders)
✅ Guest management CRM
✅ Channel manager for OTAs

Start *FREE* — 5 rooms, 20 bookings, no card needed. Would you like a demo?`;
  }

  return { message, priority };
}

// Follow-up messages
function getFollowUps(lead, priority) {
  const name = lead.title.replace(/ - .*$/, '').trim();
  const location = lead.searchString?.replace(/^.*in\s+/i, '') || '';

  return {
    day2: priority === 'ULTRA_HOT' || priority === 'HOT'
      ? `Hi! Just following up about EasyStay for *${name}*. I can set up a demo site for your property in 5 minutes — completely free, no strings attached. When's a good time for a quick call? 🙏`
      : `Hi! Following up on EasyStay. Happy to answer any questions or show you a quick demo. No commitment needed! 🙏`,

    day5: `Hi! Quick thought — I was looking at other properties in ${location} and noticed many don't have their own booking website. There's a real opportunity for *${name}* to capture more direct bookings.\n\nWould you be open to a 5-minute chat? I have some ideas that could help increase your revenue.`,

    day10: `Hi! Last message from me 🙂\n\nEasyStay has a *FREE plan* — you can manage up to 5 rooms and 20 bookings at zero cost. No card, no commitment.\n\nThis includes:\n🌐 Your own booking website\n📱 WhatsApp automation\n📊 Guest management dashboard\n\nShall I activate it for *${name}*? Takes 5 minutes.`,

    day20: `Hi! Hope you're doing well 🙂\n\nJust wanted to share — properties in ${location} are signing up for EasyStay and getting their first direct bookings within days.\n\nReminder: Our *Starter plan is FREE forever* — 5 rooms, 20 bookings/month. No card, no risk.\n\nWant me to set up *${name}* in 5 minutes?`
  };
}

// Process all leads
console.log('Processing', leads.length, 'target leads...\n');

const rows = leads.slice(0, 100).map((lead, i) => {
  const analysis = analyzeReviews(lead);
  const { message, priority } = generateMessage(lead, analysis);
  const followUps = getFollowUps(lead, priority);
  const name = lead.title.replace(/ - .*$/, '').trim();
  const location = lead.searchString?.replace(/^.*in\s+/i, '') || '';

  // Clean phone for WhatsApp
  let phone = (lead.phone || '').replace(/[^+\d]/g, '');
  if (phone.startsWith('0')) phone = '+91' + phone.slice(1);
  if (!phone.startsWith('+')) phone = '+91' + phone;

  // Extract worst review snippet
  const worstReview = (lead.reviews || [])
    .filter(r => r.stars && r.stars <= 3 && r.text)
    .sort((a, b) => a.stars - b.stars)
    .map(r => r.text.substring(0, 200))[0] || '';

  // Extract best review snippet
  const bestReview = (lead.reviews || [])
    .filter(r => r.stars >= 4 && r.text)
    .sort((a, b) => b.stars - a.stars)
    .map(r => r.text.substring(0, 200))[0] || '';

  return {
    '#': i + 1,
    'Property Name': name,
    'Category': lead.categoryName || '',
    'Location': location,
    'Full Address': lead.address || '',
    'Phone (Original)': lead.phone || '',
    'WhatsApp Number': phone,
    'Google Rating': lead.totalScore || '',
    'Review Count': lead.reviewsCount || 0,
    'Has Website': lead.website ? 'YES' : 'NO ❌',
    'Website URL': lead.website || 'NONE',
    'Google Maps Link': lead.url || '',
    'Lead Priority': priority,
    'Pain Points': analysis.painPoints.join(', '),
    'Negative Review Count': analysis.negativeCount,
    'Worst Review (use in pitch)': worstReview,
    'Best Review (use as leverage)': bestReview,
    'Cold Message (Day 1)': message,
    'Follow-up (Day 2)': followUps.day2,
    'Follow-up (Day 5)': followUps.day5,
    'Follow-up (Day 10)': followUps.day10,
    'Follow-up (Day 20)': followUps.day20,
    'Contact Status': 'NOT CONTACTED',
    'Response': '',
    'Demo Booked?': '',
    'Converted?': '',
    'Notes': ''
  };
});

// Sort: ULTRA_HOT → HOT → WARM → COLD
const priorityOrder = { 'ULTRA_HOT': 0, 'HOT': 1, 'WARM': 2, 'COLD': 3 };
rows.sort((a, b) => (priorityOrder[a['Lead Priority']] || 2) - (priorityOrder[b['Lead Priority']] || 2));
rows.forEach((r, i) => r['#'] = i + 1);

// Create workbook
const wb = XLSX.utils.book_new();

// Sheet 1: Main Leads
const ws = XLSX.utils.json_to_sheet(rows);
ws['!cols'] = [
  { wch: 4 }, { wch: 40 }, { wch: 15 }, { wch: 20 }, { wch: 55 },
  { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
  { wch: 40 }, { wch: 60 }, { wch: 12 }, { wch: 35 }, { wch: 8 },
  { wch: 70 }, { wch: 70 }, { wch: 80 }, { wch: 60 }, { wch: 60 },
  { wch: 60 }, { wch: 60 }, { wch: 15 }, { wch: 20 }, { wch: 12 },
  { wch: 12 }, { wch: 30 }
];
XLSX.utils.book_append_sheet(wb, ws, 'Target Leads');

// Sheet 2: Dashboard Summary
const ultra = rows.filter(r => r['Lead Priority'] === 'ULTRA_HOT');
const hot = rows.filter(r => r['Lead Priority'] === 'HOT');
const warm = rows.filter(r => r['Lead Priority'] === 'WARM');

const summary = [
  { Metric: '=== LEAD SUMMARY ===', Value: '' },
  { Metric: 'Total Target Leads', Value: rows.length },
  { Metric: 'ULTRA HOT (No website + Low rating)', Value: ultra.length },
  { Metric: 'HOT (No website OR Low rating)', Value: hot.length },
  { Metric: 'WARM (Moderate issues)', Value: warm.length },
  { Metric: 'Properties with NO website', Value: rows.filter(r => r['Has Website'] === 'NO ❌').length },
  { Metric: 'Properties rated below 4.0', Value: rows.filter(r => r['Google Rating'] && r['Google Rating'] < 4.0).length },
  { Metric: '', Value: '' },
  { Metric: '=== TOP PAIN POINTS FOUND IN REVIEWS ===', Value: '' },
  { Metric: 'Service/staff complaints', Value: rows.filter(r => r['Pain Points'].includes('POOR_SERVICE')).length + ' properties' },
  { Metric: 'Booking/communication issues', Value: rows.filter(r => r['Pain Points'].includes('BOOKING_ISSUES')).length + ' properties' },
  { Metric: 'Cleanliness mentions', Value: rows.filter(r => r['Pain Points'].includes('CLEANLINESS')).length + ' properties' },
  { Metric: 'Check-in/out problems', Value: rows.filter(r => r['Pain Points'].includes('CHECKIN_ISSUES')).length + ' properties' },
  { Metric: 'Pricing complaints', Value: rows.filter(r => r['Pain Points'].includes('PRICING_ISSUES')).length + ' properties' },
  { Metric: 'Food/restaurant issues', Value: rows.filter(r => r['Pain Points'].includes('FOOD_ISSUES')).length + ' properties' },
  { Metric: '', Value: '' },
  { Metric: '=== LOCATION BREAKDOWN ===', Value: '' },
];

// Count by location
const locCounts = {};
rows.forEach(r => { locCounts[r.Location] = (locCounts[r.Location] || 0) + 1; });
Object.entries(locCounts).sort((a, b) => b[1] - a[1]).forEach(([loc, count]) => {
  summary.push({ Metric: loc, Value: count + ' leads' });
});

const ws2 = XLSX.utils.json_to_sheet(summary);
ws2['!cols'] = [{ wch: 45 }, { wch: 30 }];
XLSX.utils.book_append_sheet(wb, ws2, 'Dashboard');

// Sheet 3: WhatsApp Poster & Campaign Strategy
const strategy = [
  { Topic: '=== POSTER IDEAS (Create in Canva) ===', Details: '' },
  { Topic: 'Poster 1: The Problem', Details: 'Visual: Owner drowning in WhatsApp messages, missed calls, OTA tabs. Text: "Managing your hotel from WhatsApp? There\'s a better way." CTA: EasyStay.com' },
  { Topic: 'Poster 2: The Commission Killer', Details: 'Visual: ₹ notes flying away to OTA logos. Text: "Stop paying ₹50,000/month to OTAs. Get direct bookings with your own website." Bold stat in center.' },
  { Topic: 'Poster 3: Before/After', Details: 'Left: messy WhatsApp groups, paper registers, angry guest reviews. Right: clean EasyStay dashboard, 5-star reviews, happy guests. Split screen design.' },
  { Topic: 'Poster 4: The 5-Minute Promise', Details: 'Visual: Stopwatch showing 5:00. Text: "Your property website. Live in 5 minutes. No tech skills needed." Show a beautiful sample property website.' },
  { Topic: 'Poster 5: Social Proof', Details: 'Visual: Map of South India with pins. Text: "Join 50+ properties in [region] already using EasyStay" (aspirational — update with real numbers as you grow)' },
  { Topic: 'Poster 6: Rating Rescue', Details: 'Visual: Google rating going from 3.5★ to 4.5★ with upward arrow. Text: "Better systems = better reviews = more bookings. EasyStay automates your guest experience."' },
  { Topic: 'Poster 7: Free Trial', Details: 'Visual: Gift box opening. Text: "FREE plan — 5 rooms, 20 bookings, zero cost. Your own booking website + WhatsApp automation. No card needed." Bold CTA button.' },
  { Topic: '', Details: '' },
  { Topic: '=== WHATSAPP CAMPAIGN FLOW ===', Details: '' },
  { Topic: 'Day 1 (Cold Message)', Details: 'Send personalized message from "Cold Message" column. Attach Poster 1 or 2. Send between 10-11 AM IST.' },
  { Topic: 'Day 2 (Follow-up)', Details: 'Only if no response. Send follow-up text. No poster. Send at 4-5 PM IST.' },
  { Topic: 'Day 5 (Value Add)', Details: 'Send helpful message + Poster 3 (Before/After). Position yourself as advisor, not salesman.' },
  { Topic: 'Day 10 (Free Trial Offer)', Details: 'Send urgency message + Poster 7 (Free Trial). This is your strongest offer.' },
  { Topic: 'Day 20 (Social Proof)', Details: 'Send social proof message + Poster 5. Show others in their area are using it.' },
  { Topic: '', Details: '' },
  { Topic: '=== EVOLUTION API SETUP ===', Details: '' },
  { Topic: 'Step 1', Details: 'Install Evolution API v2. Connect WhatsApp Business number (NOT your personal number!)' },
  { Topic: 'Step 2', Details: 'Use POST /message/sendText with the WhatsApp numbers from the sheet' },
  { Topic: 'Step 3', Details: 'Use POST /message/sendMedia to send poster images along with messages' },
  { Topic: 'Step 4', Details: 'Set up webhook to get notified instantly when someone replies' },
  { Topic: 'Step 5', Details: 'CRITICAL: Max 15 messages/day in week 1. Increase to 30/day in week 2. Max 50/day after that.' },
  { Topic: 'Step 6', Details: 'Randomize sending times slightly (±30 min) to avoid detection. Add 2-5 min gap between messages.' },
  { Topic: 'Step 7', Details: 'If someone replies "stop" or "not interested" — IMMEDIATELY stop. Mark them in the sheet.' },
  { Topic: '', Details: '' },
  { Topic: '=== CONVERSION TIPS ===', Details: '' },
  { Topic: 'Tip 1', Details: 'When someone shows interest, IMMEDIATELY offer a screen-share demo. Strike while iron is hot.' },
  { Topic: 'Tip 2', Details: 'Create a demo property website for THEIR property before the call. Show them what they could have.' },
  { Topic: 'Tip 3', Details: 'Use their bad reviews as talking points: "I noticed guests mentioned [issue]. EasyStay fixes this with [feature]."' },
  { Topic: 'Tip 4', Details: 'Lead with the FREE plan (5 rooms, 20 bookings). Once they hit the limit, upgrading to Growth (₹2,499/mo) is a natural conversation.' },
  { Topic: 'Tip 5', Details: 'After converting one property in an area, use them as reference for nearby properties. "XYZ Resort down the road just signed up."' },
  { Topic: 'Tip 6', Details: 'Send a WhatsApp video (60 sec) showing their property name on a sample EasyStay website. Visual proof converts.' },
];

const ws3 = XLSX.utils.json_to_sheet(strategy);
ws3['!cols'] = [{ wch: 35 }, { wch: 120 }];
XLSX.utils.book_append_sheet(wb, ws3, 'Campaign Strategy');

// Write file
const outputPath = './EasyStay_Target_Leads_v2.xlsx';
XLSX.writeFile(wb, outputPath);

// Print summary
console.log('✅ Excel generated:', outputPath);
console.log('\n📊 LEAD BREAKDOWN:');
console.log(`   🔴 ULTRA HOT: ${ultra.length} (no website + low rating — CONTACT FIRST)`);
console.log(`   🟠 HOT: ${hot.length} (no website OR low rating)`);
console.log(`   🟡 WARM: ${warm.length} (moderate issues)`);
console.log(`\n📍 LOCATIONS:`);
Object.entries(locCounts).sort((a, b) => b[1] - a[1]).forEach(([loc, count]) => {
  console.log(`   ${loc}: ${count} leads`);
});
console.log(`\n🎯 Properties with NO WEBSITE: ${rows.filter(r => r['Has Website'] === 'NO ❌').length}`);
console.log(`⭐ Properties rated below 4.0: ${rows.filter(r => r['Google Rating'] && r['Google Rating'] < 4.0).length}`);
