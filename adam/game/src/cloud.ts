import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import config from './cloud-config.json';
import { playCloudLesson } from './cloud-mission';
export interface CloudContent {
  version: 1;
  template: 'feeling-detective-v1';
  title: string;
  word: string;
  definition: string;
  example: string;
  story: string[];
  question: string;
  choices: string[];
  answer: number;
  hint: string;
  sentenceParts: string[];
}
export interface CloudMissionSummary {
  id: string;
  title: string;
}
export interface Hooks {
  openDialog: (title: string, body: string) => void;
  closeDialog: () => void;
  shell: (body: string, place: string, name?: string) => void;
  map: () => void;
  setView: (view: string) => void;
  setCloudMissions?: (missions: CloudMissionSummary[]) => void;
}
const esc = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
const cloudErrors: Record<string, string> = {
  parent_not_enrolled:
    'This account has not been enrolled as a parent in Adam. The project administrator must grant access.',
  invalid_session: 'Please sign in again.',
  gemini_secret_missing:
    'The server-side GEMINI_API_KEY secret is not configured.',
  server_free_tier_confirmation_required:
    'The server has not confirmed free-tier-only usage. Generation is paused.',
  free_tier_confirmation_required:
    'Confirm free-tier usage and enable generation in the parent settings first.',
  generation_limit_reached:
    'The daily limit or one-minute cooldown has been reached. Please try later.',
  no_suitable_skill:
    'There is no new suitable skill in the starter catalogue. Review existing learning first.',
  provider_quota_exceeded:
    'Gemini reported a quota limit. No paid fallback was used.',
  request_failed: 'The request failed. Your local adventure remains available.',
};
export class CloudGateway {
  client: SupabaseClient;
  constructor(
    public projectUrl: string,
    public key: string,
  ) {
    if (
      !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(projectUrl) ||
      !key.startsWith('sb_publishable_')
    )
      throw Error('Invalid verified cloud configuration');
    this.client = createClient(projectUrl, key, {
      auth: {
        persistSession: true,
        detectSessionInUrl: false,
        autoRefreshToken: true,
        storageKey: 'ala-parent-session',
      },
    });
  }
  async signIn(email: string, password: string) {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      throw Error('Sign-in failed. Check your parent account details.');
  }
  async request(action: string, args: Record<string, unknown> = {}) {
    const {
      data: { session },
    } = await this.client.auth.getSession();
    if (!session) throw Error('Please sign in to the parent account.');
    const res = await fetch(this.projectUrl + '/functions/v1/learning-api', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + session.access_token,
        apikey: this.key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...args, action }),
      signal: AbortSignal.timeout(action === 'generate' ? 60000 : 20000),
    });
    const value = await res.json().catch(() => ({ error: 'request_failed' }));
    if (!res.ok)
      throw Error(
        cloudErrors[value.error] ||
          'The secure request could not be completed.',
      );
    return value;
  }
  async signOut() {
    await this.client.auth.signOut({ scope: 'local' });
  }
}
let gateway: CloudGateway | undefined;
let hooks: Hooks;
let dashboard: any;
let selectedStudent = '';
const btn = (id: string, label: string, cls = 'secondary') =>
  `<button type="button" data-cloud="${id}" class="${cls}">${label}</button>`;
function body() {
  return document.querySelector<HTMLDivElement>('#cloud-body')!;
}
function message(text: string) {
  const node = document.querySelector('#cloud-message');
  if (node) node.textContent = text;
}
async function guarded(button: HTMLButtonElement, task: () => Promise<void>) {
  button.disabled = true;
  try {
    await task();
  } catch (e) {
    message((e as Error).message);
  } finally {
    button.disabled = false;
  }
}
export async function openCloudDesk(h: Hooks) {
  hooks = h;
  h.openDialog(
    'Secure family learning',
    `<div id="cloud-body"><p>Checking cloud setup…</p></div>`,
  );
  if (!config.enabled) {
    body().innerHTML = `<p class="definition">Cloud connection is not active.</p><p>${esc(config.reason)}</p><p>Your existing local profiles and Episode 1 continue to work. No records have been uploaded and no Gemini calls have been made.</p><p class="muted">GEMINI_API_KEY belongs only in Supabase → Adam → Edge Functions → Secrets. Never enter it into this game or a chat message.</p>`;
    return;
  }
  try {
    gateway ??= new CloudGateway(config.projectUrl, config.publishableKey);
    const {
      data: { session },
    } = await gateway.client.auth.getSession();
    if (session) await refresh();
    else login();
  } catch (e) {
    body().textContent = (e as Error).message;
  }
}
function login() {
  body().innerHTML = `<p>Sign in with an enrolled parent account. This trusted device will remember the session until you choose Sign out.</p><form id="cloud-login"><label for="parent-email">Parent email</label><input id="parent-email" type="email" required autocomplete="username"><label for="parent-password">Password</label><input id="parent-password" type="password" required autocomplete="current-password"><button class="primary">Sign in securely</button></form><p id="cloud-message" role="status"></p><p class="muted">Use Sign out when using a shared device. There is no public parent enrolment or child sign-up; an administrator must enrol the parent in the dedicated Adam project.</p>`;
  document
    .querySelector('#cloud-login')!
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      const b = document.querySelector<HTMLButtonElement>(
        '#cloud-login button',
      )!;
      await guarded(b, async () => {
        const email = (
            document.querySelector('#parent-email') as HTMLInputElement
          ).value,
          password = (
            document.querySelector('#parent-password') as HTMLInputElement
          ).value;
        await gateway!.signIn(email, password);
        (document.querySelector('#parent-password') as HTMLInputElement).value =
          '';
        await refresh();
      });
    });
}

export async function restoreCloudSession(h: Hooks) {
  hooks = h;
  if (!config.enabled) return false;
  try {
    gateway ??= new CloudGateway(config.projectUrl, config.publishableKey);
    const {
      data: { session },
    } = await gateway.client.auth.getSession();
    if (!session) return false;
    dashboard = await gateway.request('dashboard');
    if (
      !dashboard.students.some((student: any) => student.id === selectedStudent)
    )
      selectedStudent = dashboard.students[0]?.id || '';
    syncMissions();
    return true;
  } catch {
    return false;
  }
}
async function refresh() {
  dashboard = await gateway!.request('dashboard');
  if (!dashboard.students.some((s: any) => s.id === selectedStudent))
    selectedStudent = dashboard.students[0]?.id || '';
  syncMissions();
  renderDesk();
}
function syncMissions() {
  hooks.setCloudMissions?.(
    (dashboard?.lessons || [])
      .filter((lesson: any) => lesson.status === 'approved')
      .map((lesson: any) => ({
        id: lesson.id,
        title: lesson.content?.title || 'English expedition',
      })),
  );
}
function renderDesk() {
  const d = dashboard;
  const st = d.students.find((s: any) => s.id === selectedStudent);
  const pending = d.lessons.filter((l: any) => l.status === 'pending_review');
  const approved = d.lessons.filter((l: any) => l.status === 'approved');
  const xp = d.xp
    .filter((x: any) => x.student_id === selectedStudent)
    .reduce((n: number, x: any) => n + x.amount, 0);
  body().innerHTML = `<div class="choices">${btn('refresh', 'Refresh')}${btn('signout', 'Sign out', 'quiet')}</div><label for="cloud-student">Explorer</label><select id="cloud-student">${d.students.map((s: any) => `<option value="${esc(s.id)}" ${s.id === selectedStudent ? 'selected' : ''}>${esc(s.nickname)} · Year ${s.school_year}</option>`).join('')}</select><p>${st ? esc(st.nickname) + ' has ' + xp + ' cloud adventure XP.' : 'Add a cloud explorer to begin. Local profiles are not uploaded automatically.'}</p><details><summary>Add a cloud explorer</summary><form id="cloud-add-student"><label for="cloud-name">Nickname</label><input id="cloud-name" maxlength="30" required><label for="cloud-year">Starting stage</label><select id="cloud-year"><option value="6">Year 6</option><option value="4">Year 4</option></select><p>England primary · British English</p><button class="secondary">Create private profile</button></form></details><details><summary>Reset cloud learning progress · parent only</summary><p class="muted">This permanently erases cloud attempt history, mastery evidence, XP and reward entries for every explorer in this parent account. Approved lessons, generated content and student accounts are kept. Device progress is separate.</p>${btn('reset-learning','Reset all cloud learning progress','quiet')}</details><details><summary>Generation limits and free-tier confirmation</summary><form id="cloud-settings"><label><input id="cloud-free" type="checkbox" ${d.settings?.free_tier_confirmed ? 'checked' : ''}> I have confirmed this Gemini key's Google project is on the Free tier with no paid billing.</label><label><input id="cloud-enabled" type="checkbox" ${d.settings?.generation_enabled ? 'checked' : ''}> Enable parent-triggered text generation</label><label for="cloud-limit">Maximum requests per day (failed requests count)</label><input id="cloud-limit" type="number" min="1" max="5" value="${d.settings?.daily_limit || 2}"><button class="secondary">Save generation settings</button></form><p class="muted">Default limit: 2 per day, at most 1 per minute, 1,800 output tokens per request. This app cannot inspect Google's billing configuration. Automatic scheduling, paid fallback, audio generation and Reward Credits remain disabled.</p></details><div class="choices">${btn('generate', 'Prepare next English mission', 'primary')}</div><p class="muted">Approved suitable content is reused before requesting a new lesson. Every new lesson needs adult review. Only a generic skill and word go to Gemini; no nickname, email or learning history is sent.</p><h3>Content review · ${pending.length} pending</h3>${d.lessons.map((l: any) => `<div class="cloud-lesson-row"><strong>${esc(l.content?.title || 'Quarantined output')}</strong><span>${esc(l.status)}</span>${btn('review:' + l.id, l.status === 'pending_review' ? 'Inspect and review' : 'Inspect', 'quiet')}</div>`).join('') || '<p>No generated content yet.</p>'}<h3>Approved expeditions</h3>${approved.length ? `<div class="choices">${approved.map((l: any) => btn('play:' + l.id, esc(l.content.title), 'secondary')).join('')}${btn('atlas', 'Show approved missions on atlas', 'primary')}</div>` : '<p>Only approved lessons appear here.</p>'}<h3>Skills and next reviews</h3>${
    d.progress
      .filter((p: any) => p.student_id === selectedStudent)
      .map(
        (p: any) =>
          `<p>${esc(p.skill_id)} · ${new Date(p.next_review_at) < new Date() ? 'Review due' : esc(p.state)} · ${p.next_review_at ? new Date(p.next_review_at).toLocaleDateString('en-GB') : ''}</p>`,
      )
      .join('') ||
    '<p>No cloud evidence yet. Watching a story does not count as mastery.</p>'
  }<details><summary>Generation activity and usage</summary>${d.jobs.map((j: any) => `<p>${new Date(j.created_at).toLocaleString('en-GB')} · ${esc(j.status)} · ${j.input_tokens} input / ${j.output_tokens} output tokens ${j.failure_code ? '· ' + esc(j.failure_code) : ''}</p>`).join('') || '<p>No provider requests recorded.</p>'}<p class="muted">Token counts are usage estimates, not a Google invoice or guarantee of zero cost. Requests with unknown outcome stay counted against the cap. No automatic retries are made.</p></details><p id="cloud-message" role="status"></p>`;
  document.querySelector('#cloud-student')!.addEventListener('change', (e) => {
    selectedStudent = (e.target as HTMLSelectElement).value;
    renderDesk();
  });
  document
    .querySelector('#cloud-add-student')!
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      await guarded(
        document.querySelector<HTMLButtonElement>('#cloud-add-student button')!,
        async () => {
          await gateway!.request('add-student', {
            nickname: (
              document.querySelector('#cloud-name') as HTMLInputElement
            ).value,
            year: Number(
              (document.querySelector('#cloud-year') as HTMLSelectElement)
                .value,
            ),
          });
          await refresh();
        },
      );
    });
  document
    .querySelector('#cloud-settings')!
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      await guarded(
        document.querySelector<HTMLButtonElement>('#cloud-settings button')!,
        async () => {
          await gateway!.request('settings', {
            dailyLimit: Number(
              (document.querySelector('#cloud-limit') as HTMLInputElement)
                .value,
            ),
            enabled: (
              document.querySelector('#cloud-enabled') as HTMLInputElement
            ).checked,
            freeTierConfirmed: (
              document.querySelector('#cloud-free') as HTMLInputElement
            ).checked,
          });
          await refresh();
        },
      );
    });
  bindDesk();
}
function bindDesk() {
  body()
    .querySelectorAll<HTMLButtonElement>('[data-cloud]')
    .forEach(
      (b) =>
        (b.onclick = () =>
          guarded(b, async () => {
            const action = b.dataset.cloud!;
            if (action === 'refresh') await refresh();
            else if (action === 'signout') {
              await gateway!.signOut();
              hooks.setCloudMissions?.([]);
              login();
            } else if (action === 'reset-learning') {
              if (!window.confirm('Delete cloud XP, answers and skills for ALL cloud explorers? Approved lessons and accounts remain. This cannot be undone.')) return;
              const phrase = window.prompt('To confirm cloud progress deletion, enter: RESET CLOUD LEARNING','');
              if (phrase !== 'RESET CLOUD LEARNING') return;
              await gateway!.request('reset-learning',{confirm:phrase});
              await refresh();
              message('Cloud learning progress reset. To reset device learning data, use the Parent Desk device reset.');
            } else if (action === 'generate') {
              if (!selectedStudent)
                throw Error('Choose or add a cloud explorer first.');
              const result = await gateway!.request('generate', {
                studentId: selectedStudent,
              });
              await refresh();
              message(
                result.reused
                  ? 'Suitable content or an existing request was reused. No duplicate generation was requested.'
                  : 'Lesson prepared for adult review.',
              );
            } else if (action === 'atlas') {
              hooks.closeDialog();
              hooks.map();
            } else if (action.startsWith('review:')) review(action.slice(7));
            else if (action.startsWith('play:')) {
              if (!selectedStudent) throw Error('Choose an explorer first.');
              const l = dashboard.lessons.find(
                (l: any) => l.id === action.slice(5),
              );
              if (l?.status !== 'approved')
                throw Error('An approved lesson is required.');
              playCloudLesson(
                l,
                dashboard.students.find((s: any) => s.id === selectedStudent),
                hooks,
                gateway!,
              );
            }
          })),
    );
}

export async function playCloudMission(id: string, h: Hooks) {
  hooks = h;
  if (!config.enabled) return openCloudDesk(h);
  gateway ??= new CloudGateway(config.projectUrl, config.publishableKey);
  const {
    data: { session },
  } = await gateway.client.auth.getSession();
  if (!session) return openCloudDesk(h);
  dashboard = await gateway.request('dashboard');
  if (
    !dashboard.students.some((student: any) => student.id === selectedStudent)
  )
    selectedStudent = dashboard.students[0]?.id || '';
  syncMissions();
  const lesson = dashboard.lessons.find(
    (item: any) => item.id === id && item.status === 'approved',
  );
  const student = dashboard.students.find(
    (item: any) => item.id === selectedStudent,
  );
  if (!lesson || !student) return openCloudDesk(h);
  playCloudLesson(lesson, student, h, gateway);
}
function review(id: string) {
  const l = dashboard.lessons.find((l: any) => l.id === id);
  body().innerHTML = `${btn('back', 'Back to family desk', 'quiet')}<h3>${esc(l.content?.title || 'Content output')}</h3><pre class="cloud-preview">${esc(JSON.stringify(l.content, null, 2))}</pre><p>Automated checks: ${esc(JSON.stringify(l.validation))}</p>${l.status === 'pending_review' ? `<form id="review-form">${['answer', 'language', 'curriculum', 'safety'].map((k) => `<label><input type="checkbox" id="review-${k}" required> I checked ${k === 'curriculum' ? 'the objective and appropriate difficulty' : k === 'safety' ? 'age-appropriate and supportive content' : k === 'answer' ? 'the answer, hint and sentence meaning' : 'natural British English and the vocabulary example'}.</label>`).join('')}<button class="primary">Approve this version</button></form>` : ''}${['pending_review', 'quarantined'].includes(l.status) ? btn('reject', 'Reject this version', 'quiet') : ''}<p id="cloud-message" role="status"></p>`;
  body().querySelector<HTMLButtonElement>('[data-cloud="back"]')!.onclick =
    renderDesk;
  body()
    .querySelector<HTMLButtonElement>('[data-cloud="reject"]')
    ?.addEventListener('click', async () => {
      try {
        await gateway!.request('review', {
          lessonId: id,
          decision: 'rejected',
          checks: {},
        });
        await refresh();
      } catch (e) {
        message((e as Error).message);
      }
    });
  document
    .querySelector('#review-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await guarded(
        document.querySelector<HTMLButtonElement>('#review-form button')!,
        async () => {
          const checks = Object.fromEntries(
            ['answer', 'language', 'curriculum', 'safety'].map((k) => [
              k,
              (document.querySelector('#review-' + k) as HTMLInputElement)
                .checked,
            ]),
          );
          await gateway!.request('review', {
            lessonId: id,
            decision: 'approved',
            checks,
          });
          await refresh();
        },
      );
    });
}
