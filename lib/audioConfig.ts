/**
 * Audio System Configuration & Deployment Guide
 * 
 * This file documents the audio system setup for both localhost and public URL deployments
 */

export const AUDIO_CONFIG = {
  // Audio directory - must be in public/audio/
  audioDir: "/audio",
  
  // Supported formats
  formats: ["mp3", "wav", "ogg", "m4a"],
  
  // Preload strategy
  preloadStrategy: "auto",
  
  // CORS settings for public URLs
  cors: {
    enabled: true,
    methods: ["GET"],
    // If deploying to subdirectory, include basePath
  },
};

export const AUDIO_FILES = {
  // Ambient sounds
  ambient: {
    calm: "ambient-calm.mp3",
    tense: "ambient-tense.mp3",
    reflective: "ambient-reflective.mp3",
  },
  
  // UI feedback
  ui: {
    click: "ui-click.mp3",
    select: "ui-select.mp3",
    success: "ui-success.mp3",
    transition: "ui-transition.mp3",
  },
  
  // Effectiveness feedback
  feedback: {
    high: "feedback-high.mp3",
    moderate: "feedback-moderate.mp3",
    low: "feedback-low.mp3",
  },
};

/**
 * DEPLOYMENT CHECKLIST
 * 
 * For Localhost (http://localhost:3000):
 * 1. Ensure audio files are in public/audio/
 * 2. Run "npm run dev"
 * 3. AudioPathResolver will automatically use relative paths: /audio/filename.mp3
 * 
 * For Public URL (e.g., https://example.com):
 * 1. Ensure audio files are in public/audio/
 * 2. Build: npm run build
 * 3. Start: npm start
 * 4. AudioPathResolver will detect the domain and use correct paths
 * 
 * For Subdirectory Deployment (e.g., https://example.com/app-name/):
 * 1. Update next.config.ts with basePath:
 *    const nextConfig = {
 *      basePath: "/app-name",
 *      ...
 *    }
 * 2. Place audio files in public/audio/
 * 3. AudioPathResolver will use: /app-name/audio/filename.mp3
 * 
 * Troubleshooting:
 * - Audio not playing on public URL?
 *   → Check browser console for 404 errors
 *   → Verify audio files exist in public/audio/
 *   → Check that paths are correctly resolved using browser DevTools
 * 
 * - CORS errors?
 *   → Ensure audio files are served from same origin
 *   → Add CORS headers if audio is on different server
 *   → Verify next.config.ts doesn't block audio requests
 * 
 * - Autoplay issues?
 *   → Browser requires user interaction before autoplay
 *   → AudioManager handles this with click event listener
 *   → Ensure user has interacted with page before playing audio
 */

export default AUDIO_CONFIG;
