// ElevenLabs Voiceover Generator — Josh voice, tuned for natural delivery
// Run: node scripts/generate-voiceover.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_bee2f6c1cc7024f6223f11055264b62440299ddab54f0f95';
const VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX'; // Josh - deep, warm, professional narrator

const SCRIPT = "India has over one million independent hotels.\n\nSeventy-three percent still manage bookings with pen and paper.\n\nEvery month, lakhs vanish. Missed reservations, no-shows, and guests who never come back.\n\nThere is a better way.\n\nIntroducing HospitalityOS.\n\nA complete operating system, built for the modern Indian hotel owner.\n\nOur smart dashboard puts everything in one place. Live occupancy, revenue, upcoming check-ins, and your entire guest history.\n\nGuests book directly from your hotel website. No OTA commissions. No middlemen. Every rupee stays with you. The process takes under two minutes, and every guest is automatically saved to your CRM.\n\nHere is what makes us truly different.\n\nThe moment a booking is confirmed, our system automatically sends a WhatsApp message to the guest. A day before check-in, a friendly reminder. Two hours after checkout, a personalized Google review request.\n\nThree messages. Zero manual work. Guests feel remembered. Reviews grow on their own.\n\nWe have already processed twenty-eight thousand bookings across five hundred hotels this quarter. Owners are saving twelve hours every single week.\n\nHospitalityOS. The operating system every Indian hotel deserves.\n\nJoin us.";

const body = JSON.stringify({
    text: SCRIPT,
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
        stability: 0.38,
        similarity_boost: 0.85,
        style: 0.45,
        use_speaker_boost: true,
    },
});

const outputPath = path.join(__dirname, '..', 'public', 'voiceover.mp3');

const options = {
    hostname: 'api.elevenlabs.io',
    path: '/v1/text-to-speech/' + VOICE_ID,
    method: 'POST',
    headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(body),
    },
};

console.log('Generating voiceover with Josh (ElevenLabs)...');

const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
        let err = '';
        res.on('data', (d) => { err += d; });
        res.on('end', () => console.error('API error', res.statusCode, err));
        return;
    }
    const file = fs.createWriteStream(outputPath);
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        const mb = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
        console.log('Done! Saved to:', outputPath, '(' + mb + ' MB)');
    });
});
req.on('error', (e) => console.error('Request error:', e.message));
req.write(body);
req.end();
