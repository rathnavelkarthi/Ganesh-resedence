const XLSX = require('xlsx');
const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('./leads_merged.json', 'utf8'));

// Pain point detection from reviews and property data
function detectPainPoints(lead) {
  const painPoints = [];

  // No website = biggest pain point
  if (!lead.website) {
    painPoints.push('NO_WEBSITE');
  }

  // Low rating = guest experience issues
  if (lead.totalScore && lead.totalScore < 4.0) {
    painPoints.push('LOW_RATING');
  }

  // High review count but moderate rating = inconsistent service
  if (lead.reviewsCount > 100 && lead.totalScore && lead.totalScore < 4.3) {
    painPoints.push('INCONSISTENT_SERVICE');
  }

  // Few reviews = low visibility/no online presence
  if (lead.reviewsCount < 20) {
    painPoints.push('LOW_VISIBILITY');
  }

  // Categories that suggest small operations
  const smallOp = ['Homestay', 'Guest house', 'Lodge', 'Inn', 'House', 'Villa', 'Cottage'];
  if (lead.categories?.some(c => smallOp.some(s => c.toLowerCase().includes(s.toLowerCase())))) {
    painPoints.push('SMALL_OPERATION');
  }

  // Has website but it's a booking.com or OTA link = dependent on OTAs
  if (lead.website && (
    lead.website.includes('booking.com') ||
    lead.website.includes('goibibo') ||
    lead.website.includes('makemytrip') ||
    lead.website.includes('airbnb') ||
    lead.website.includes('agoda')
  )) {
    painPoints.push('OTA_DEPENDENT');
  }

  // Default
  if (painPoints.length === 0) {
    painPoints.push('GENERAL_EFFICIENCY');
  }

  return painPoints;
}

// Generate personalized message based on pain points
function generateMessage(lead, painPoints) {
  const name = lead.title.replace(/ - .*$/, '').trim(); // Remove room type suffixes
  const rating = lead.totalScore ? `${lead.totalScore}/5` : '';
  const location = lead.searchString?.replace(/^.*in\s+/i, '') || '';

  // Lead priority scoring
  let priority = 'WARM';
  if (painPoints.includes('NO_WEBSITE')) priority = 'HOT';
  if (painPoints.includes('OTA_DEPENDENT')) priority = 'HOT';
  if (painPoints.includes('LOW_RATING') && painPoints.includes('LOW_VISIBILITY')) priority = 'HOT';
  if (lead.totalScore >= 4.5 && lead.website) priority = 'COLD';

  const messages = {
    NO_WEBSITE: `Hi! I noticed *${name}* in ${location} doesn't have its own website yet. Many guests search online before booking — you might be losing direct bookings to OTAs that charge 15-20% commission.\n\nWe built *EasyStay* (esaystay.com) — an all-in-one platform that gives you:\n✅ Your own booking website (ready in 5 min)\n✅ WhatsApp booking confirmations\n✅ Guest management CRM\n✅ Channel manager for OTAs\n\nWould you like a free demo? I can set up your property in 5 minutes and show you how it works.`,

    OTA_DEPENDENT: `Hi! I see *${name}* is listed on OTA platforms — great for visibility! But those 15-20% commissions add up fast.\n\nWhat if you could get *direct bookings* through your own professional website + WhatsApp?\n\n*EasyStay* (esaystay.com) helps properties like yours:\n✅ Own booking website with payment gateway\n✅ Auto WhatsApp confirmations & reminders\n✅ Manage OTA + direct bookings in one place\n✅ POS for restaurant/services\n\nProperties using EasyStay save ₹50,000+ monthly on OTA commissions. Want a quick demo?`,

    LOW_RATING: `Hi! I came across *${name}* — it looks like a wonderful property in ${location}. I noticed some guest reviews mention booking/communication issues.\n\n*EasyStay* (esaystay.com) can help fix these:\n✅ Auto WhatsApp booking confirmations\n✅ Digital check-in/out\n✅ Guest feedback system\n✅ Streamlined operations\n\nBetter guest communication = better reviews = more bookings. Can I show you a quick demo?`,

    LOW_VISIBILITY: `Hi! I found *${name}* on Google Maps — looks like a hidden gem in ${location}! But with only ${lead.reviewsCount} reviews, many travelers might not discover you.\n\n*EasyStay* (esaystay.com) can help boost your visibility:\n✅ Your own professional booking website\n✅ WhatsApp marketing to past guests\n✅ Automated review requests after checkout\n✅ Channel manager to list on all OTAs\n\nWant to see how other properties in ${location} increased their bookings by 40%?`,

    INCONSISTENT_SERVICE: `Hi! *${name}* has great volume with ${lead.reviewsCount}+ reviews! But managing that many guests manually can lead to inconsistencies.\n\n*EasyStay* (esaystay.com) automates the entire guest journey:\n✅ Online booking → Auto confirmation\n✅ WhatsApp check-in reminders\n✅ Digital invoicing & POS\n✅ Guest history & preferences\n\nLess manual work = consistent 5-star experience. Quick demo?`,

    SMALL_OPERATION: `Hi! Running a ${lead.categoryName?.toLowerCase() || 'property'} like *${name}* means you handle everything — bookings, WhatsApp messages, check-ins, billing.\n\n*EasyStay* (esaystay.com) is built specifically for properties like yours:\n✅ Guests book directly on your website\n✅ Auto WhatsApp confirmations\n✅ One dashboard for everything\n✅ No tech skills needed — ready in 5 min\n\nStarting at just ₹999/month. Want to see it in action?`,

    GENERAL_EFFICIENCY: `Hi! I came across *${name}* in ${location} — looks like a great property!\n\nWe built *EasyStay* (esaystay.com) to help hospitality businesses like yours:\n✅ Your own booking website\n✅ WhatsApp CRM & auto-messages\n✅ Channel manager for OTAs\n✅ POS & invoicing\n\nAll-in-one platform, starting ₹999/month. Interested in a free demo?`
  };

  // Pick the most relevant message
  const primaryPain = painPoints[0];
  const message = messages[primaryPain] || messages.GENERAL_EFFICIENCY;

  return { message, priority };
}

// Follow-up message templates
function getFollowUpMessage(lead, dayNum) {
  const name = lead.title.replace(/ - .*$/, '').trim();

  const followUps = {
    2: `Hi! Just following up on EasyStay. I'd love to give you a free 15-min demo — no commitment. When works best for you? 🙏`,
    5: `Hi! Quick question — are you currently using any software to manage bookings at *${name}*, or is it mostly manual/WhatsApp?\n\nEither way, I have some tips that could help. Happy to share!`,
    10: `Hi! Last message from me 🙂 We're offering a *free 30-day trial* of EasyStay for properties in your area. Your own booking website + WhatsApp automation, zero risk.\n\nShall I set it up for *${name}*? Takes 5 minutes.`
  };

  return followUps[dayNum] || '';
}

// Process all leads
console.log('Processing', leads.length, 'leads...');

const rows = leads.slice(0, 100).map((lead, i) => {
  const painPoints = detectPainPoints(lead);
  const { message, priority } = generateMessage(lead, painPoints);
  const name = lead.title.replace(/ - .*$/, '').trim();
  const location = lead.searchString?.replace(/^.*in\s+/i, '') || '';

  // Clean phone number for WhatsApp
  let phone = (lead.phone || '').replace(/[^+\d]/g, '');
  if (phone.startsWith('0')) phone = '+91' + phone.slice(1);
  if (!phone.startsWith('+')) phone = '+91' + phone;

  return {
    '#': i + 1,
    'Property Name': name,
    'Category': lead.categoryName || '',
    'Location': location,
    'Full Address': lead.address || '',
    'Phone': lead.phone || '',
    'WhatsApp Number': phone,
    'Google Rating': lead.totalScore || '',
    'Review Count': lead.reviewsCount || 0,
    'Has Website': lead.website ? 'Yes' : 'No',
    'Website URL': lead.website || '',
    'Google Maps URL': lead.url || '',
    'Pain Points': painPoints.join(', '),
    'Lead Priority': priority,
    'Personalized Message': message,
    'Follow-up Day 2': getFollowUpMessage(lead, 2),
    'Follow-up Day 5': getFollowUpMessage(lead, 5),
    'Follow-up Day 10': getFollowUpMessage(lead, 10),
    'Status': 'Not Contacted',
    'Notes': ''
  };
});

// Sort by priority: HOT first, then WARM, then COLD
const priorityOrder = { 'HOT': 0, 'WARM': 1, 'COLD': 2 };
rows.sort((a, b) => (priorityOrder[a['Lead Priority']] || 1) - (priorityOrder[b['Lead Priority']] || 1));

// Re-number after sort
rows.forEach((r, i) => r['#'] = i + 1);

// Create workbook
const wb = XLSX.utils.book_new();

// Main leads sheet
const ws = XLSX.utils.json_to_sheet(rows);

// Set column widths
ws['!cols'] = [
  { wch: 4 },   // #
  { wch: 35 },  // Property Name
  { wch: 15 },  // Category
  { wch: 20 },  // Location
  { wch: 50 },  // Full Address
  { wch: 18 },  // Phone
  { wch: 18 },  // WhatsApp Number
  { wch: 10 },  // Google Rating
  { wch: 12 },  // Review Count
  { wch: 12 },  // Has Website
  { wch: 40 },  // Website URL
  { wch: 60 },  // Google Maps URL
  { wch: 30 },  // Pain Points
  { wch: 12 },  // Lead Priority
  { wch: 80 },  // Personalized Message
  { wch: 60 },  // Follow-up Day 2
  { wch: 60 },  // Follow-up Day 5
  { wch: 60 },  // Follow-up Day 10
  { wch: 15 },  // Status
  { wch: 30 },  // Notes
];

XLSX.utils.book_append_sheet(wb, ws, 'Leads');

// Summary sheet
const summary = [
  { Metric: 'Total Leads', Value: rows.length },
  { Metric: 'HOT Leads', Value: rows.filter(r => r['Lead Priority'] === 'HOT').length },
  { Metric: 'WARM Leads', Value: rows.filter(r => r['Lead Priority'] === 'WARM').length },
  { Metric: 'COLD Leads', Value: rows.filter(r => r['Lead Priority'] === 'COLD').length },
  { Metric: 'Without Website', Value: rows.filter(r => r['Has Website'] === 'No').length },
  { Metric: 'Low Rating (<4.0)', Value: rows.filter(r => r['Google Rating'] && r['Google Rating'] < 4.0).length },
  { Metric: '', Value: '' },
  { Metric: '--- OUTREACH STRATEGY ---', Value: '' },
  { Metric: 'Day 1', Value: 'Send personalized first message via WhatsApp' },
  { Metric: 'Day 2', Value: 'Send follow-up if no response' },
  { Metric: 'Day 5', Value: 'Send value-add message (tips/question)' },
  { Metric: 'Day 10', Value: 'Send final offer (free trial)' },
  { Metric: 'Day 15+', Value: 'Move to nurture list (monthly tips)' },
  { Metric: '', Value: '' },
  { Metric: '--- POSTER IDEAS ---', Value: '' },
  { Metric: 'Poster 1', Value: 'Problem: "Still managing bookings on WhatsApp?" → Solution: EasyStay automates everything' },
  { Metric: 'Poster 2', Value: 'Stats: "Hotels using EasyStay save ₹50,000/month on OTA commissions"' },
  { Metric: 'Poster 3', Value: 'Before/After: Messy WhatsApp groups vs Clean EasyStay dashboard' },
  { Metric: 'Poster 4', Value: 'Testimonial style: "I got my first direct booking within 24 hours" (create after first customer)' },
  { Metric: 'Poster 5', Value: 'Feature highlight: Your property website ready in 5 minutes (with QR code)' },
];

const ws2 = XLSX.utils.json_to_sheet(summary);
ws2['!cols'] = [{ wch: 30 }, { wch: 80 }];
XLSX.utils.book_append_sheet(wb, ws2, 'Summary & Strategy');

// WhatsApp Automation Guide sheet
const automation = [
  { Step: '1. EVOLUTION API SETUP', Details: 'Install Evolution API v2, connect your WhatsApp Business number' },
  { Step: '2. IMPORT CONTACTS', Details: 'Use the WhatsApp Number column from Leads sheet. Verify numbers first using Evolution API checkWhatsApp endpoint' },
  { Step: '3. WARM-UP PERIOD', Details: 'Send 10-15 messages/day for first week, gradually increase to 30-50/day. Never blast 100 at once!' },
  { Step: '4. SENDING SCHEDULE', Details: 'Best times: 10-11 AM and 4-5 PM IST (property owners check phones between guest activities)' },
  { Step: '5. MESSAGE FLOW', Details: 'Day 1: Personalized message (from Leads sheet) → Day 2: Follow-up → Day 5: Value message → Day 10: Free trial offer' },
  { Step: '6. RESPONSE HANDLING', Details: 'Set up webhook in Evolution API to notify you instantly when someone replies. Respond within 5 minutes!' },
  { Step: '7. TRACKING', Details: 'Update Status column: Not Contacted → Message Sent → Replied → Demo Booked → Converted → Not Interested' },
  { Step: '8. POSTER DELIVERY', Details: 'Send posters as WhatsApp images AFTER the text message. Use catalog feature for property-specific mockups.' },
  { Step: '9. AVOID BANS', Details: 'Use WhatsApp Business API (not personal). Vary messages slightly. Stop messaging if someone says stop. Max 50/day.' },
  { Step: '10. CONVERSION TIPS', Details: 'Offer free setup call. Show their property on a demo site. Create urgency with "first 10 properties in [area] get 3 months free"' },
];

const ws3 = XLSX.utils.json_to_sheet(automation);
ws3['!cols'] = [{ wch: 25 }, { wch: 100 }];
XLSX.utils.book_append_sheet(wb, ws3, 'WhatsApp Automation Guide');

// Write file
const outputPath = './EasyStay_100_Warm_Leads.xlsx';
XLSX.writeFile(wb, outputPath);

console.log(`\n✅ Excel file generated: ${outputPath}`);
console.log(`Total leads: ${rows.length}`);
console.log(`HOT: ${rows.filter(r => r['Lead Priority'] === 'HOT').length}`);
console.log(`WARM: ${rows.filter(r => r['Lead Priority'] === 'WARM').length}`);
console.log(`COLD: ${rows.filter(r => r['Lead Priority'] === 'COLD').length}`);
console.log(`Without website: ${rows.filter(r => r['Has Website'] === 'No').length}`);
