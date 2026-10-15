# Adam Learning Adventures

A small, static, British-English learning space within the main [Elasrag](https://www.elasrag.com/) GitHub Pages site.

## Website
- Landing page: https://www.elasrag.com/adam/
- Entry file: `adam/index.html`
- No framework or build process is needed.
- The root website (`/index.html`) is not modified.

## Current capabilities
- English episode 01: The Mystery of the Missing Trophy.
- Four vocabulary cards with browser pronunciation using en-GB where available.
- Animated 16:9 school-mystery stages, following the original narration timing.
- Two speaking pauses, vocabulary check, and sentence builder.
- A three-question starter Maths Quest.
- Local progress in `localStorage`.
- Optional narration saved to the *current browser* via IndexedDB.

## Publish the actual Google AI Studio voiceover

Upload the file `Adam_Episode_01_Narration.mp3` to the repository and name it:

`adam/audio/english-001.mp3`

On GitHub: navigate to the `adam/audio` folder -> **Add file** -> **Upload files** -> select the WAV -> rename it to `english-001.wav` if necessary -> **Commit changes**.

This makes the sound publicly accessible on the public website. It will also be downloadable by anyone who knows the URL. For a private family-only product, add authentication and private object storage before publishing sensitive material.

An alternative for testing, with no public sound upload: open **Parent desk** on the site, choose the downloaded WAV file. The page stores the audio in that browser's IndexedDB, provided enough storage is available. It will **not** follow the learner to other browsers or devices.

## Future roadmap
1. Parent-only login and secure hosted lesson uploads.
2. Separate lesson JSON files for every episode; keep the UI reusable.
3. Persist progress privately and securely across devices.
4. Formal Year 1–6 skills checklist, revision schedule and adaptive Maths Quest.
5. Separate account and learning track for Joseph.

## Development / safeguarding
- Keep child progress and personal/health-related details out of the public repository.
- The site has no server-side APIs, authentication, or shared storage. Do not present local data as synchronised.
- The chapter timings come from an initial estimate, so verify and adjust against the actual WAV as needed.
- Child-facing pages use British English. Parent setup is currently in English.
