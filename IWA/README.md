# IWA Academy Nigeria

Learning platform foundation for the Nigerian learning programme. The public-facing copy uses en-NG and live class times use WAT. The original Sites preview is owner-private. This folder also includes a static build for repository hosting.

## Build

Run `npm ci`, `npm run check`, then `npm run build`. Sites serves `dist`. The source repo is the handoff for future changes.

## Demo and production

Use **Explore demo** to test the learner path. Demo progress and text assignments only use this browser. Demo lessons are examples and do not contain the full programme, approved recordings, or a real Zoom session.

To enable the live data path:

1. Create a dedicated Supabase project. Apply the migration in `supabase/migrations` in that project. Use separate test accounts before opening applications.
2. Set the project URL and **publishable** key in `src/backend-config.json`. Do not place a secret or service role key there. Rebuild and deploy.
3. Set Supabase Auth Site URL and allowed redirects for the deployed origin. Enable email verification and configure SMTP for applicant signup and reset.
4. Insert the approved programme, modules, lessons, cohort, groups, and group sessions. Admit each learner by associating the verified Auth user ID with a cohort and group in `enrolments`. Use dashboard-admin access for this pilot operation. Add real content only with permission.
5. Test separate learner accounts for isolation and cross-device resume. Approve the intake privacy notice and anti-abuse plan before opening access outside review.

The migration implements learner-scoped programmes, groups, lessons, schedules, application/status, lesson position/completion and text assignments. Grades/feedback fields are read-only for learners. Instructor permissions and staff UI, private file submissions, protected video hosting, automated Zoom attendance, Moodle synchronization and certificate decisions are future implementation stages. The platform does not currently prevent a sixth group or more than 20 enrolments at the administrative database level. Keep intake private until capacity controls and staff workflow are in place. A programme's approved hours belong in academic scheduling and are not inferred from sample data.

## GitHub folder deployment

This project lives in `Mo31D/Elasrag/IWA`. The root `index.html`, `app.js`, `style.css`, and `backend-config.json` are the compiled static site. After editing `src`, run `npm ci`, `npm run check`, `npm run build`, then copy those four files from `dist/` into this folder before committing. Keep all changes within `IWA/`. No backend secrets belong in this repository. The current configuration is intentionally empty and the demo remains available.
