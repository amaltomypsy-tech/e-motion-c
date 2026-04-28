# Audio System Guide

## Overview

The audio system is configured to work seamlessly on both localhost and public URLs. It uses dynamic path resolution to ensure audio files load correctly regardless of where the application is deployed.

## Architecture

### Key Components

1. **`lib/audioPath.ts`** - Path resolver that handles dynamic path construction
2. **`lib/audioManager.ts`** - Core audio playback manager
3. **`components/AudioSystem.tsx`** - React component that initializes all audio tracks
4. **`components/cinematic/BackgroundAudio.tsx`** - Component for scenario-specific background audio
5. **`lib/audioConfig.ts`** - Configuration and deployment guide

## How It Works

### Path Resolution

The `resolveAudioPath()` function automatically detects the deployment environment:

```typescript
// For localhost - uses relative paths
resolveAudioPath("ambient-calm.mp3") 
// → "/audio/ambient-calm.mp3"

// For public domain - uses root paths
resolveAudioPath("ambient-calm.mp3")
// → "/audio/ambient-calm.mp3"

// For subdirectory - includes basePath
// (when basePath is configured in next.config.ts)
resolveAudioPath("ambient-calm.mp3")
// → "/app-name/audio/ambient-calm.mp3"
```

### Loading Audio Tracks

All audio tracks must be stored in `public/audio/` directory.

```typescript
// In AudioSystem.tsx
audioManager.loadTrack("ambient-calm", "ambient-calm.mp3", {
  volume: 0.15,
  loop: true,
  fadeInDuration: 2000,
  fadeOutDuration: 1500,
});
```

Note: Pass only the filename - `audioManager.loadTrack()` handles path resolution internally.

### Playing Audio

```typescript
// Simple play
audioManager.play("ambient-calm");

// Play with fade-in
audioManager.play("ambient-calm", { fadeIn: true });

// Play with delay
audioManager.play("ambient-calm", { delay: 500 });
```

## Deployment

### Localhost (Development)

```bash
npm run dev
# Runs on http://localhost:3000
```

Audio paths resolve to `/audio/filename.mp3`

### Production Server

```bash
npm run build
npm start
# Runs on specified port
```

Audio paths automatically resolve based on current domain.

### Subdirectory Deployment

If deploying to a subdirectory (e.g., `https://example.com/myapp/`):

1. Update `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  basePath: "/myapp",
  // ... other config
};
```

2. Audio files still go in `public/audio/`
3. Paths automatically resolve to `/myapp/audio/filename.mp3`

## File Organization

```
public/
├── audio/
│   ├── ambient-calm.mp3
│   ├── ambient-tense.mp3
│   ├── ambient-reflective.mp3
│   ├── ui-click.mp3
│   ├── ui-select.mp3
│   ├── ui-success.mp3
│   ├── ui-transition.mp3
│   ├── feedback-high.mp3
│   ├── feedback-moderate.mp3
│   └── feedback-low.mp3
├── avatars/
├── images/
├── scenes/
└── unity/
```

## Troubleshooting

### Audio Not Playing

**Symptom**: Audio files don't play on localhost or public URL

**Solutions**:
1. Check browser console for errors (DevTools → Console)
2. Verify audio files exist in `public/audio/`
3. Check Network tab to see actual path being requested
4. Ensure audio files are MP3 format (or add MIME type support)

### 404 Errors for Audio Files

**Symptom**: "GET /audio/filename.mp3 404 Not Found"

**Solutions**:
1. Verify file exists: `ls public/audio/filename.mp3`
2. Check file permissions
3. Rebuild: `npm run build`
4. Restart server: `npm start`

### Autoplay Not Working

**Symptom**: Audio doesn't autoplay on page load

**Reason**: Modern browsers require user interaction before playing audio

**Solution**: AudioManager automatically handles this:
- Listens for first click event
- Resumes audio playback after user interaction
- Users can still manually enable/disable with audio button

### CORS Issues (Subdomain/Proxy)

If audio is served from different domain:

```typescript
// In public/audio (or server) - add CORS headers
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## Adding New Audio Files

1. Add `.mp3` file to `public/audio/`
2. Update `lib/audioConfig.ts` with new filename
3. Update `components/AudioSystem.tsx` to load the track:

```typescript
audioManager.loadTrack("new-sound", "new-sound.mp3", {
  volume: 0.5,
  loop: false,
});
```

4. Use in code:
```typescript
audioManager.play("new-sound");
```

## Performance Notes

- Audio preload strategy: `"auto"` - allows browser optimization
- Master volume: Controlled globally via `audioManager.setMasterVolume()`
- Fade-in/fade-out: Smooth transitions prevent audio jarring
- Cleanup: All audio stopped on component unmount

## Testing

### Test Localhost
```bash
npm run dev
# Open http://localhost:3000
# Click audio toggle button - should hear UI sound effects
```

### Test Production Build
```bash
npm run build
npm start
# Should work identically to localhost
```

### Test with DevTools
```javascript
// In browser console:
// Check resolved path
const { resolveAudioPath } = await import('/lib/audioPath');
console.log(resolveAudioPath("ambient-calm.mp3"));

// Check audio manager
const { audioManager } = await import('/lib/audioManager');
audioManager.play("ui-click");
```

## Migration Notes

### Changes Made (April 2026)

**Old approach** (hardcoded paths):
```typescript
audioManager.loadTrack("ambient-calm", "/audio/ambient-calm.mp3", {...})
```

**New approach** (dynamic paths):
```typescript
audioManager.loadTrack("ambient-calm", "ambient-calm.mp3", {...})
```

Benefits:
- ✅ Works on localhost and public URLs
- ✅ Supports subdirectory deployments
- ✅ No configuration needed for different environments
- ✅ Automatic path resolution

---

**Last Updated**: April 2026
**Version**: 2.0.0
