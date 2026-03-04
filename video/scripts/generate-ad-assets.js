/**
 * Generate ad assets using Gemini API
 * - Ad copy variants for YouTube, Instagram, Google Ads, LinkedIn
 * - Image generation prompts (for manual use with Imagen/Canva)
 *
 * Usage: node scripts/generate-ad-assets.js
 */
const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyDLTiZfOmGIQMg5wYrmi7MYE58f297NdNI';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callGemini(prompt, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        if (attempt > 0) {
            const wait = (attempt + 1) * 15000;
            console.log(`  Rate limited, waiting ${wait / 1000}s before retry ${attempt + 1}...`);
            await sleep(wait);
        }
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.9,
                        maxOutputTokens: 4096,
                    },
                }),
            });
            if (res.status === 429) {
                if (attempt < retries - 1) continue;
                throw new Error('Rate limited after all retries');
            }
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`Gemini API error ${res.status}: ${err}`);
            }
            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (e) {
            if (attempt === retries - 1) throw e;
        }
    }
}

async function generateImageWithImagen(prompt, outputPath) {
    const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_KEY}`;
    try {
        const res = await fetch(imagenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: '16:9',
                    safetyFilterLevel: 'BLOCK_MEDIUM_AND_ABOVE',
                },
            }),
        });
        if (!res.ok) {
            console.log(`  Imagen not available (${res.status}), saving prompt instead`);
            return false;
        }
        const data = await res.json();
        const b64 = data.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
            fs.writeFileSync(outputPath, Buffer.from(b64, 'base64'));
            console.log(`  Saved image: ${outputPath}`);
            return true;
        }
        return false;
    } catch (e) {
        console.log(`  Imagen unavailable: ${e.message}`);
        return false;
    }
}

async function main() {
    const outDir = path.join(__dirname, '..', 'out', 'ad-assets');
    fs.mkdirSync(outDir, { recursive: true });

    console.log('Generating ad copy variants...\n');

    // ---- 1. AD COPY ----
    const copyPrompt = `You are a direct-response copywriter for a hospitality SaaS startup called HospitalityOS (website: safestay.superbots.in). The product replaces spreadsheets, disconnected booking tools, POS systems, and inventory management with one unified platform for hotels and restaurants in India.

Key stats: ₹8.2L average monthly revenue tracked, 87% occupancy rate, 142 bookings/month, +28% direct bookings increase, 500+ properties trust it.

Generate the following ad copy variants. Be punchy, specific, and avoid generic marketing language. Use real numbers. No emojis in headlines.

FORMAT: Output as clean markdown with headers.

## YouTube Pre-Roll (15-second script)
Write 3 variants. Each should be under 40 words. Hook in first 3 seconds.

## Instagram Reel Caption
Write 3 variants. Include hashtags. Under 150 characters each (excluding hashtags).

## Google Search Ads
Write 3 variants with:
- Headline 1 (30 chars max)
- Headline 2 (30 chars max)
- Headline 3 (30 chars max)
- Description (90 chars max)

## LinkedIn Sponsored Post
Write 2 variants. Professional tone. Under 200 words each. Target: hotel owners, hospitality operators, restaurant managers in India.

## YouTube Video Description
Write 1 optimized description for the pitch video. Include keywords: hotel management software, hospitality POS, direct booking engine, hotel website builder. Under 300 words.

## Facebook Ad (Primary Text)
Write 2 variants. Conversational. Under 125 words each.`;

    const adCopy = await callGemini(copyPrompt);
    const copyPath = path.join(outDir, 'ad-copy-variants.md');
    fs.writeFileSync(copyPath, `# HospitalityOS — Ad Copy Variants\n\nGenerated: ${new Date().toISOString()}\n\n${adCopy}`);
    console.log(`Ad copy saved: ${copyPath}\n`);

    // ---- 2. AD IMAGES ----
    console.log('Attempting image generation...\n');

    const imagePrompts = [
        {
            name: 'hotel-lobby-modern.png',
            prompt: 'Professional photograph of a modern boutique hotel lobby in India, warm lighting, reception desk with a tablet showing a dashboard, clean minimal interior design, no people, editorial photography style, 4K quality',
        },
        {
            name: 'hotel-dashboard-mockup.png',
            prompt: 'Clean SaaS dashboard UI on a MacBook Pro screen showing hotel analytics, revenue chart going up, occupancy at 87%, dark navy interface with gold accents, minimalist desk setup, photorealistic, product photography',
        },
        {
            name: 'restaurant-pos-tablet.png',
            prompt: 'Close-up photograph of an iPad showing a restaurant point-of-sale system with food order items, on a wooden table in an upscale Indian restaurant, warm ambient lighting, shallow depth of field, editorial style',
        },
        {
            name: 'hotel-room-view.png',
            prompt: 'Beautiful hotel room interior with ocean view through window, tablet on bedside table showing a booking confirmation screen, warm golden hour lighting, luxury boutique hotel in India, professional architecture photography',
        },
        {
            name: 'social-ad-banner.png',
            prompt: 'Clean social media ad banner for a hospitality software product, dark navy background (#0C2B35), gold accent text saying "Run Your Hotel Smarter", minimalist SaaS design, no photographs, geometric shapes and gradients only',
        },
    ];

    let imagesGenerated = 0;
    for (const img of imagePrompts) {
        console.log(`  Generating: ${img.name}...`);
        const imgPath = path.join(outDir, img.name);
        const success = await generateImageWithImagen(img.prompt, imgPath);
        if (success) imagesGenerated++;
    }

    // Save prompts regardless (for manual use)
    const promptsPath = path.join(outDir, 'image-prompts.md');
    const promptsMd = imagePrompts.map((p, i) =>
        `### ${i + 1}. ${p.name}\n\`\`\`\n${p.prompt}\n\`\`\``
    ).join('\n\n');
    fs.writeFileSync(promptsPath, `# Image Generation Prompts\n\nUse these prompts with Imagen 3, Midjourney, or DALL-E.\n\n${promptsMd}`);
    console.log(`\nImage prompts saved: ${promptsPath}`);

    // ---- 3. HASHTAG STRATEGY ----
    console.log('\nGenerating hashtag strategy...');

    const hashtagPrompt = `Generate a hashtag strategy for HospitalityOS — a hotel management SaaS product in India. Include:

1. **Primary hashtags** (5) — branded and product-specific
2. **Industry hashtags** (10) — hospitality, hotel management, restaurant POS
3. **Location hashtags** (5) — India-focused, key cities with hospitality industry
4. **Trending hashtags** (5) — relevant tech/startup hashtags currently popular

Format as a clean markdown list grouped by category. No explanations, just the hashtags.`;

    const hashtags = await callGemini(hashtagPrompt);
    const hashPath = path.join(outDir, 'hashtag-strategy.md');
    fs.writeFileSync(hashPath, `# Hashtag Strategy\n\n${hashtags}`);
    console.log(`Hashtag strategy saved: ${hashPath}`);

    // ---- SUMMARY ----
    console.log('\n========================================');
    console.log('  AD ASSETS GENERATED');
    console.log('========================================');
    console.log(`  Ad copy variants: ${copyPath}`);
    console.log(`  Image prompts:    ${promptsPath}`);
    console.log(`  Hashtag strategy: ${hashPath}`);
    console.log(`  Images generated: ${imagesGenerated}/${imagePrompts.length}`);
    console.log(`  Output directory: ${outDir}`);
    console.log('========================================\n');
}

main().catch(console.error);
