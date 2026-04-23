# Unity WebGL client (scaffold)

This repo’s primary prototype is the Next.js cinematic UI. If you want a **Unity WebGL** “interactive film” client, use this scaffold to build a Unity front-end that consumes the existing research APIs and Mongo logging.

## Recommended architecture
- Unity (WebGL) handles: scenes, transitions, audio, avatar animation/state, decision UI.
- Next.js handles: scenario JSON source-of-truth, scoring, report generation, persistence.

## How to use
1. Create a new Unity project (URP recommended).
2. Copy the folder `unity/Assets/Scripts` into your Unity project’s `Assets/Scripts`.
3. In Unity:
   - Create a simple UI (Text for context/prompt, 4 buttons for options)
   - Add `AssessmentGameController` to an empty GameObject
4. Build WebGL and copy Unity’s output into:
   - `public/unity/` (so `public/unity/index.html` exists)
5. Run Next.js and open:
   - `/unity`

## API expectations (same as Next UI)
- Create session: `POST /api/session` body `{ ageGroup }`
- Get scenario: `GET /api/scenarios?levelId=level-01`
- Save response: `POST /api/response`
- Generate report: `POST /api/report`

## Note on autoplay audio
Browsers usually block autoplay. In Unity, start audio after the first user click/tap.

