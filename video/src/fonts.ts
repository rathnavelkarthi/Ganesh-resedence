// Shared Google Fonts for the video
// Inter — clean, modern sans-serif for body text
// Playfair Display — elegant serif for headings
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';

const inter = loadInter();
const playfair = loadPlayfair();

export const FONTS = {
    sans: inter.fontFamily,
    serif: playfair.fontFamily,
};
