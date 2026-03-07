const XLSX = require('xlsx');
const fs = require('fs');
const leads = JSON.parse(fs.readFileSync('./leads_chennai_pondy_final.json', 'utf8'));

function getTier(lead) {
  if (!lead.website && lead.totalScore < 3) return 'TIER 1 - ULTRA HOT';
  if (!lead.website && lead.totalScore < 3.5) return 'TIER 2 - HOT';
  if (lead.website && lead.totalScore < 3) return 'TIER 3 - HOT (bad web)';
  return 'TIER 4 - WARM';
}

function analyzeReviews(lead) {
  const reviews = lead.reviews || [];
  const allText = reviews.map(r => (r.text || '').toLowerCase()).join(' ');
  const issues = [];
  if (allText.match(/dirty|clean|hygien|stain|smell|cockroach|bug/)) issues.push('cleanliness');
  if (allText.match(/service|staff|rude|slow|late|reception/)) issues.push('service');
  if (allText.match(/booking|reservation|confirm|response/)) issues.push('booking');
  if (allText.match(/overpriced|expensive|not worth|price/)) issues.push('overpriced');
  if (allText.match(/noise|noisy|loud|disturbance/)) issues.push('noise');
  if (allText.match(/food|breakfast|restaurant/)) issues.push('food');
  if (allText.match(/wifi|internet|network/)) issues.push('wifi');
  if (allText.match(/check.?in|check.?out|waiting/)) issues.push('check-in');
  return issues;
}

function generateMessage(lead, tier, issues) {
  const name = lead.title.replace(/ - .*$/, '').trim();
  const loc = lead.searchString?.replace(/^.*in\s+/i, '') || 'Chennai';
  const rating = lead.totalScore;
  const reviewCount = lead.reviewsCount || 0;
  const topIssue = issues[0] || 'guest experience';

  const issueText = {
    cleanliness: 'cleanliness concerns',
    service: 'service and staff issues',
    booking: 'booking and communication problems',
    overpriced: 'value-for-money concerns',
    noise: 'noise complaints',
    food: 'food quality issues',
    wifi: 'WiFi/connectivity problems',
    'check-in': 'check-in delays'
  };

  if (tier.includes('TIER 1') || tier.includes('TIER 2')) {
    return `Vanakkam! 🙏

I was looking at *${name}* on Google Maps. You have ${reviewCount} reviews but I noticed two things:

1️⃣ No website — guests searching online can't find or book you directly
2️⃣ Recent reviews mention ${issueText[topIssue] || 'areas for improvement'}

Both problems have ONE solution 👇

*EasyStay* (esaystay.com) gives you:
✅ Your own professional booking website — ready in 5 min
✅ Auto WhatsApp confirmations — no missed bookings
✅ Guest management system — smoother operations
✅ Review management — turn complaints into 5-star reviews

Properties using EasyStay improved their Google rating by 0.5+ stars.

Try it *FREE* — 5 rooms, 20 bookings, no card needed. Shall I set it up for *${name}*?`;
  }

  if (tier.includes('TIER 3')) {
    return `Vanakkam! 🙏

I noticed *${name}* in ${loc} has ${reviewCount} reviews but a ${rating}★ rating. Many guests mention ${issueText[topIssue] || 'operational challenges'}.

*EasyStay* (esaystay.com) can help fix this:
✅ Automated booking flow — no manual errors
✅ WhatsApp confirmations — guests always informed
✅ Digital check-in — faster, professional experience
✅ Auto review requests — get more positive reviews

Your ${rating}★ rating could become 4.0+ with better systems.

Start *FREE* — 5 rooms, 20 bookings, no card needed. Quick demo?`;
  }

  return `Vanakkam! 🙏

I came across *${name}* on Google Maps — ${reviewCount} reviews in ${loc}!

But I noticed you don't have your own website. That means:
❌ Guests can't book directly — you lose them to competitors
❌ You depend on OTAs (15-20% commission per booking)
❌ No way to collect guest data for repeat business

*EasyStay* (esaystay.com) fixes this in 5 minutes:
✅ Beautiful booking website for *${name}*
✅ WhatsApp auto-confirmations
✅ Direct payments — zero commission
✅ Guest CRM for repeat customers

Try it *FREE* — 5 rooms, 20 bookings, no card needed. Interested?`;
}

function getFollowUps(lead) {
  const name = lead.title.replace(/ - .*$/, '').trim();
  const loc = lead.searchString?.replace(/^.*in\s+/i, '') || 'your area';
  return {
    day2: `Hi! Just following up about EasyStay for *${name}*. I can set up a demo site for your property in 5 minutes — completely free. When's a good time for a quick call? 🙏`,
    day5: `Hi! I was looking at properties in ${loc} and many don't have their own booking website. There's a real opportunity for *${name}* to capture more direct bookings.\n\nWould you be open to a 5-minute chat? I have some ideas that could help.`,
    day10: `Hi! EasyStay has a *FREE plan* — 5 rooms, 20 bookings at zero cost. No card, no commitment.\n\nThis includes:\n🌐 Your own booking website\n📱 WhatsApp automation\n📊 Guest management dashboard\n\nShall I activate it for *${name}*? Takes 5 minutes.`,
    day20: `Hi! Properties in ${loc} are signing up for EasyStay and getting direct bookings within days.\n\nReminder: Starter plan is *FREE forever* — 5 rooms, 20 bookings/month.\n\nWant me to set up *${name}* in 5 minutes?`
  };
}

const rows = leads.map((lead, i) => {
  const tier = getTier(lead);
  const issues = analyzeReviews(lead);
  const msg = generateMessage(lead, tier, issues);
  const followUps = getFollowUps(lead);
  const name = lead.title.replace(/ - .*$/, '').trim();
  const loc = lead.searchString?.replace(/^.*in\s+/i, '') || '';

  let phone = (lead.phone || '').replace(/[^+\d]/g, '');
  if (!phone.startsWith('+')) phone = '+' + phone;
  if (!phone.startsWith('+91')) {
    phone = '+91' + phone.replace(/^\+/, '');
  }

  const worstReview = (lead.reviews || [])
    .filter(r => r.stars && r.stars <= 3 && r.text)
    .sort((a, b) => a.stars - b.stars)
    .map(r => r.text.substring(0, 200))[0] || '';

  return {
    '#': i + 1,
    'Property Name': name,
    'Category': lead.categoryName || '',
    'Location': loc,
    'Full Address': lead.address || '',
    'Phone': lead.phone || '',
    'WhatsApp Number': phone,
    'Google Rating': lead.totalScore || '',
    'Review Count': lead.reviewsCount || 0,
    'Has Website': lead.website ? 'YES' : 'NO',
    'Website URL': lead.website || 'NONE',
    'Google Maps Link': lead.url || '',
    'Tier': tier,
    'Pain Points': issues.join(', ') || 'no website',
    'Worst Review': worstReview,
    'Cold Message (Day 1)': msg,
    'Follow-up (Day 2)': followUps.day2,
    'Follow-up (Day 5)': followUps.day5,
    'Follow-up (Day 10)': followUps.day10,
    'Follow-up (Day 20)': followUps.day20,
    'Contact Status': 'NOT CONTACTED',
    'Notes': ''
  };
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(rows);
ws['!cols'] = [
  {wch:4},{wch:45},{wch:15},{wch:25},{wch:55},
  {wch:20},{wch:20},{wch:8},{wch:8},{wch:10},
  {wch:40},{wch:60},{wch:20},{wch:25},{wch:70},
  {wch:80},{wch:60},{wch:60},{wch:60},{wch:60},
  {wch:15},{wch:30}
];
XLSX.utils.book_append_sheet(wb, ws, 'Chennai Pondy Leads');

// Summary
const summary = [
  {Metric: 'Total Leads', Value: rows.length},
  {Metric: 'TIER 1 (No web + rating <3)', Value: rows.filter(r => r.Tier.includes('TIER 1')).length},
  {Metric: 'TIER 2 (No web + rating <3.5)', Value: rows.filter(r => r.Tier.includes('TIER 2')).length},
  {Metric: 'TIER 3 (Has web + rating <3)', Value: rows.filter(r => r.Tier.includes('TIER 3')).length},
  {Metric: 'TIER 4 (No web + rating <4)', Value: rows.filter(r => r.Tier.includes('TIER 4')).length},
  {Metric: '', Value: ''},
  {Metric: 'Chennai leads', Value: rows.filter(r => r.Location.toLowerCase().includes('chennai') || r.Location.toLowerCase().includes('egmore')).length},
  {Metric: 'Pondicherry leads', Value: rows.filter(r => r.Location.toLowerCase().includes('pondi') || r.Location.toLowerCase().includes('auroville')).length},
];
const ws2 = XLSX.utils.json_to_sheet(summary);
ws2['!cols'] = [{wch:30},{wch:20}];
XLSX.utils.book_append_sheet(wb, ws2, 'Summary');

XLSX.writeFile(wb, './EasyStay_Chennai_Pondy_Leads.xlsx');

console.log('\n✅ Excel generated: EasyStay_Chennai_Pondy_Leads.xlsx');
console.log('Total:', rows.length, 'leads');
console.log('TIER 1 (No web + <3):', rows.filter(r => r.Tier.includes('TIER 1')).length);
console.log('TIER 2 (No web + <3.5):', rows.filter(r => r.Tier.includes('TIER 2')).length);
console.log('TIER 3 (Has web + <3):', rows.filter(r => r.Tier.includes('TIER 3')).length);
console.log('TIER 4 (No web + <4):', rows.filter(r => r.Tier.includes('TIER 4')).length);
