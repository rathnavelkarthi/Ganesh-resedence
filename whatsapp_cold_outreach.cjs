const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ============ CONFIGURATION ============
const CONFIG = {
  EVOLUTION_API_URL: 'http://140.245.217.175:8080',
  API_KEY: 'desmond@123',
  INSTANCE_NAME: 'tenant-85e0fb25',
  EXCEL_FILE: './EasyStay_Target_Leads_v2.xlsx',
  OUTPUT_FILE: './EasyStay_Outreach_Status.xlsx',
  LOG_FILE: './outreach_log.json',

  // Safety limits
  MAX_MESSAGES_PER_DAY: 15,       // Start with 15, increase after week 1
  DELAY_BETWEEN_MESSAGES_MS: 180000, // 3 minutes between messages
  RANDOM_DELAY_MS: 60000,           // ±1 min random variation

  // Message stage: 'day1', 'day2', 'day5', 'day10', 'day20'
  CURRENT_STAGE: 'day1',

  // Set to true to do a dry run (no actual messages sent)
  DRY_RUN: false,

  // Optional: attach poster image path (set null to skip)
  POSTER_IMAGE: null,  // e.g., './posters/poster1.jpg'
};

// ============ HELPERS ============

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomDelay() {
  return CONFIG.DELAY_BETWEEN_MESSAGES_MS + (Math.random() * CONFIG.RANDOM_DELAY_MS * 2 - CONFIG.RANDOM_DELAY_MS);
}

function cleanPhoneNumber(phone) {
  let cleaned = phone.replace(/[^+\d]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
  if (cleaned.startsWith('0')) cleaned = '91' + cleaned.substring(1);
  if (!cleaned.startsWith('91') && cleaned.length === 10) cleaned = '91' + cleaned;
  return cleaned;
}

function loadLog() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.LOG_FILE, 'utf8'));
  } catch {
    return { sent: {}, checked: {}, errors: [], lastRun: null };
  }
}

function saveLog(log) {
  log.lastRun = new Date().toISOString();
  fs.writeFileSync(CONFIG.LOG_FILE, JSON.stringify(log, null, 2));
}

// ============ EVOLUTION API FUNCTIONS ============

async function checkWhatsAppNumber(phone) {
  const number = cleanPhoneNumber(phone);
  try {
    const res = await fetch(`${CONFIG.EVOLUTION_API_URL}/chat/whatsappNumbers/${CONFIG.INSTANCE_NAME}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': CONFIG.API_KEY },
      body: JSON.stringify({ numbers: [number] })
    });
    const data = await res.json();
    if (data && Array.isArray(data)) {
      const result = data.find(d => d.exists);
      return result ? { exists: true, jid: result.jid } : { exists: false, jid: null };
    }
    return { exists: false, jid: null };
  } catch (err) {
    console.error(`  Error checking ${number}:`, err.message);
    return { exists: false, jid: null, error: err.message };
  }
}

async function sendTextMessage(phone, message) {
  const number = cleanPhoneNumber(phone);
  if (CONFIG.DRY_RUN) {
    console.log(`  [DRY RUN] Would send to ${number}: ${message.substring(0, 80)}...`);
    return { success: true, dryRun: true };
  }

  try {
    const res = await fetch(`${CONFIG.EVOLUTION_API_URL}/message/sendText/${CONFIG.INSTANCE_NAME}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': CONFIG.API_KEY },
      body: JSON.stringify({
        number: number,
        text: message
      })
    });
    const data = await res.json();
    if (data?.key?.id) {
      return { success: true, messageId: data.key.id };
    }
    return { success: false, error: JSON.stringify(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function sendImageMessage(phone, imageUrl, caption) {
  const number = cleanPhoneNumber(phone);
  if (CONFIG.DRY_RUN) {
    console.log(`  [DRY RUN] Would send image to ${number}`);
    return { success: true, dryRun: true };
  }

  try {
    const body = {
      number: number,
      mediatype: 'image',
      caption: caption || '',
    };

    // If it's a local file, convert to base64
    if (imageUrl && fs.existsSync(imageUrl)) {
      const imageBuffer = fs.readFileSync(imageUrl);
      body.media = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      body.fileName = path.basename(imageUrl);
    } else if (imageUrl) {
      body.media = imageUrl;
    }

    const res = await fetch(`${CONFIG.EVOLUTION_API_URL}/message/sendMedia/${CONFIG.INSTANCE_NAME}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': CONFIG.API_KEY },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return data?.key?.id ? { success: true, messageId: data.key.id } : { success: false, error: JSON.stringify(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ============ MAIN OUTREACH FUNCTION ============

async function runOutreach() {
  console.log('\n========================================');
  console.log('  EasyStay WhatsApp Cold Outreach');
  console.log('========================================');
  console.log(`Mode: ${CONFIG.DRY_RUN ? '🧪 DRY RUN (no messages sent)' : '🚀 LIVE MODE'}`);
  console.log(`Stage: ${CONFIG.CURRENT_STAGE}`);
  console.log(`Max messages today: ${CONFIG.MAX_MESSAGES_PER_DAY}`);
  console.log(`Delay between messages: ~${Math.round(CONFIG.DELAY_BETWEEN_MESSAGES_MS / 60000)} min`);
  console.log('========================================\n');

  // Load Excel
  const wb = XLSX.readFile(CONFIG.EXCEL_FILE);
  const ws = wb.Sheets['Target Leads'];
  const leads = XLSX.utils.sheet_to_json(ws);
  console.log(`Loaded ${leads.length} leads from Excel\n`);

  // Load previous log
  const log = loadLog();

  // Determine which message column to use
  const stageColumnMap = {
    'day1': 'Cold Message (Day 1)',
    'day2': 'Follow-up (Day 2)',
    'day5': 'Follow-up (Day 5)',
    'day10': 'Follow-up (Day 10)',
    'day20': 'Follow-up (Day 20)',
  };
  const messageColumn = stageColumnMap[CONFIG.CURRENT_STAGE];

  // Filter leads based on stage
  let eligibleLeads = leads.filter(lead => {
    const phone = lead['WhatsApp Number'];
    if (!phone) return false;

    const key = cleanPhoneNumber(phone);
    const history = log.sent[key] || {};

    // For day1: skip if already sent day1
    if (CONFIG.CURRENT_STAGE === 'day1' && history.day1) return false;
    // For day2: only send if day1 was sent AND no reply AND day2 not sent
    if (CONFIG.CURRENT_STAGE === 'day2' && (!history.day1 || history.replied || history.day2)) return false;
    // For day5: only if day2 sent AND no reply
    if (CONFIG.CURRENT_STAGE === 'day5' && (!history.day2 || history.replied || history.day5)) return false;
    // For day10: only if day5 sent AND no reply
    if (CONFIG.CURRENT_STAGE === 'day10' && (!history.day5 || history.replied || history.day10)) return false;
    // For day20: only if day10 sent AND no reply
    if (CONFIG.CURRENT_STAGE === 'day20' && (!history.day10 || history.replied || history.day20)) return false;

    // Skip if they said stop
    if (history.optedOut) return false;

    return true;
  });

  // Sort by priority: ULTRA_HOT first
  const priorityOrder = { 'ULTRA_HOT': 0, 'HOT': 1, 'WARM': 2, 'COLD': 3 };
  eligibleLeads.sort((a, b) => (priorityOrder[a['Lead Priority']] || 2) - (priorityOrder[b['Lead Priority']] || 2));

  console.log(`Eligible leads for ${CONFIG.CURRENT_STAGE}: ${eligibleLeads.length}`);
  const batch = eligibleLeads.slice(0, CONFIG.MAX_MESSAGES_PER_DAY);
  console.log(`Will process: ${batch.length} (max ${CONFIG.MAX_MESSAGES_PER_DAY}/day)\n`);

  if (batch.length === 0) {
    console.log('No eligible leads for this stage. Nothing to do.');
    return;
  }

  // Step 1: Verify WhatsApp numbers
  console.log('--- Step 1: Checking WhatsApp numbers ---\n');
  const verified = [];

  for (const lead of batch) {
    const phone = lead['WhatsApp Number'];
    const key = cleanPhoneNumber(phone);

    // Use cached check if available
    if (log.checked[key]) {
      if (log.checked[key].exists) {
        verified.push({ ...lead, whatsappJid: log.checked[key].jid });
        console.log(`  ✅ ${lead['Property Name']} (${phone}) — cached: on WhatsApp`);
      } else {
        console.log(`  ❌ ${lead['Property Name']} (${phone}) — cached: NOT on WhatsApp`);
      }
      continue;
    }

    // Check fresh
    const check = await checkWhatsAppNumber(phone);
    log.checked[key] = { exists: check.exists, jid: check.jid, checkedAt: new Date().toISOString() };

    if (check.exists) {
      verified.push({ ...lead, whatsappJid: check.jid });
      console.log(`  ✅ ${lead['Property Name']} (${phone}) — on WhatsApp`);
    } else {
      console.log(`  ❌ ${lead['Property Name']} (${phone}) — NOT on WhatsApp`);
    }

    await sleep(2000); // Small delay between checks
  }

  saveLog(log);
  console.log(`\nVerified: ${verified.length} / ${batch.length} are on WhatsApp\n`);

  if (verified.length === 0) {
    console.log('No verified WhatsApp numbers. Exiting.');
    return;
  }

  // Step 2: Send messages
  console.log('--- Step 2: Sending messages ---\n');
  let sentCount = 0;
  let failCount = 0;

  for (let i = 0; i < verified.length; i++) {
    const lead = verified[i];
    const phone = lead['WhatsApp Number'];
    const key = cleanPhoneNumber(phone);
    const message = lead[messageColumn];

    if (!message) {
      console.log(`  ⚠️  ${lead['Property Name']} — no message for ${CONFIG.CURRENT_STAGE}, skipping`);
      continue;
    }

    console.log(`  [${i + 1}/${verified.length}] Sending to ${lead['Property Name']} (${phone})...`);

    // Send text message
    const result = await sendTextMessage(phone, message);

    if (result.success) {
      sentCount++;
      if (!log.sent[key]) log.sent[key] = {};
      log.sent[key][CONFIG.CURRENT_STAGE] = {
        sentAt: new Date().toISOString(),
        messageId: result.messageId || 'dry-run',
        property: lead['Property Name']
      };
      console.log(`  ✅ Sent! (${sentCount}/${CONFIG.MAX_MESSAGES_PER_DAY})`);

      // Send poster if configured (only on day1)
      if (CONFIG.POSTER_IMAGE && CONFIG.CURRENT_STAGE === 'day1') {
        await sleep(5000);
        const imgResult = await sendImageMessage(phone, CONFIG.POSTER_IMAGE, '');
        console.log(`  📷 Poster: ${imgResult.success ? 'sent' : 'failed'}`);
      }
    } else {
      failCount++;
      log.errors.push({ phone: key, stage: CONFIG.CURRENT_STAGE, error: result.error, at: new Date().toISOString() });
      console.log(`  ❌ Failed: ${result.error}`);
    }

    saveLog(log);

    // Wait between messages (skip delay after last one)
    if (i < verified.length - 1) {
      const delay = getRandomDelay();
      console.log(`  ⏳ Waiting ${Math.round(delay / 60000)} min before next message...\n`);
      await sleep(delay);
    }
  }

  // Step 3: Summary
  console.log('\n========================================');
  console.log('  OUTREACH COMPLETE');
  console.log('========================================');
  console.log(`  Sent: ${sentCount}`);
  console.log(`  Failed: ${failCount}`);
  console.log(`  Stage: ${CONFIG.CURRENT_STAGE}`);
  console.log(`  Log saved to: ${CONFIG.LOG_FILE}`);
  console.log('========================================\n');

  // Update Excel with status
  updateExcelStatus(log);
}

// ============ UPDATE EXCEL WITH STATUS ============

function updateExcelStatus(log) {
  const wb = XLSX.readFile(CONFIG.EXCEL_FILE);
  const ws = wb.Sheets['Target Leads'];
  const leads = XLSX.utils.sheet_to_json(ws);

  const updated = leads.map(lead => {
    const phone = lead['WhatsApp Number'];
    if (!phone) return lead;

    const key = cleanPhoneNumber(phone);
    const whatsappCheck = log.checked[key];
    const sendHistory = log.sent[key];

    // Update WhatsApp status
    if (whatsappCheck) {
      lead['WhatsApp Verified'] = whatsappCheck.exists ? 'YES ✅' : 'NO ❌';
    }

    // Update contact status based on send history
    if (sendHistory) {
      if (sendHistory.replied) {
        lead['Contact Status'] = 'REPLIED ✅';
      } else if (sendHistory.optedOut) {
        lead['Contact Status'] = 'OPTED OUT 🚫';
      } else if (sendHistory.day20) {
        lead['Contact Status'] = 'ALL FOLLOW-UPS SENT';
      } else if (sendHistory.day10) {
        lead['Contact Status'] = 'DAY 10 SENT';
      } else if (sendHistory.day5) {
        lead['Contact Status'] = 'DAY 5 SENT';
      } else if (sendHistory.day2) {
        lead['Contact Status'] = 'DAY 2 SENT';
      } else if (sendHistory.day1) {
        lead['Contact Status'] = 'DAY 1 SENT';
      }

      // Add timestamp of last message
      const stages = ['day20', 'day10', 'day5', 'day2', 'day1'];
      for (const s of stages) {
        if (sendHistory[s]) {
          lead['Last Contacted'] = sendHistory[s].sentAt;
          break;
        }
      }
    }

    return lead;
  });

  const wsNew = XLSX.utils.json_to_sheet(updated);
  const wbNew = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbNew, wsNew, 'Target Leads');

  // Copy other sheets
  for (const name of wb.SheetNames) {
    if (name !== 'Target Leads') {
      XLSX.utils.book_append_sheet(wbNew, wb.Sheets[name], name);
    }
  }

  XLSX.writeFile(wbNew, CONFIG.OUTPUT_FILE);
  console.log(`Updated Excel saved to: ${CONFIG.OUTPUT_FILE}`);
}

// ============ UTILITY: Mark a lead as replied ============

async function markReplied(phone) {
  const log = loadLog();
  const key = cleanPhoneNumber(phone);
  if (!log.sent[key]) log.sent[key] = {};
  log.sent[key].replied = true;
  log.sent[key].repliedAt = new Date().toISOString();
  saveLog(log);
  console.log(`Marked ${phone} as replied`);
}

// ============ UTILITY: Mark a lead as opted out ============

async function markOptedOut(phone) {
  const log = loadLog();
  const key = cleanPhoneNumber(phone);
  if (!log.sent[key]) log.sent[key] = {};
  log.sent[key].optedOut = true;
  log.sent[key].optedOutAt = new Date().toISOString();
  saveLog(log);
  console.log(`Marked ${phone} as opted out — will NOT send more messages`);
}

// ============ RUN ============

const args = process.argv.slice(2);

if (args[0] === 'replied') {
  markReplied(args[1]);
} else if (args[0] === 'optout') {
  markOptedOut(args[1]);
} else if (args[0] === 'status') {
  const log = loadLog();
  const sentKeys = Object.keys(log.sent);
  const stages = ['day1', 'day2', 'day5', 'day10', 'day20'];
  console.log('\n--- Outreach Status ---');
  console.log(`Numbers checked: ${Object.keys(log.checked).length}`);
  console.log(`On WhatsApp: ${Object.values(log.checked).filter(c => c.exists).length}`);
  stages.forEach(s => {
    console.log(`${s} sent: ${sentKeys.filter(k => log.sent[k][s]).length}`);
  });
  console.log(`Replied: ${sentKeys.filter(k => log.sent[k].replied).length}`);
  console.log(`Opted out: ${sentKeys.filter(k => log.sent[k].optedOut).length}`);
  console.log(`Errors: ${log.errors.length}`);
  console.log(`Last run: ${log.lastRun || 'Never'}`);
} else {
  runOutreach().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
