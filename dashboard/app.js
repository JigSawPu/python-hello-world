const config = window.PROJECT_LEDGER_CONFIG || {};
const client = config.supabaseUrl && config.supabasePublishableKey && window.supabase
  ? window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey)
  : null;

const els = {
  servicesGrid: document.querySelector('#servicesGrid'),
  timeline: document.querySelector('#timeline'),
  serviceSearch: document.querySelector('#serviceSearch'),
  refreshBtn: document.querySelector('#refreshBtn'),
  serviceCount: document.querySelector('#serviceCount'),
  statServices: document.querySelector('#statServices'),
  statLive: document.querySelector('#statLive'),
  statDeploys: document.querySelector('#statDeploys'),
  dataMode: document.querySelector('#dataMode'),
  serviceTemplate: document.querySelector('#serviceTemplate')
};

let state = { services: [], events: [], deployments: [] };
let authGate = null;

const demo = {
  services: [
    { id: 'demo-static', name: 'project-ledger-dashboard', service_type: 'static_site', status: 'live', public_url: '#', dashboard_url: '#', branch: 'project-ledger-dashboard', repo_full_name: 'JigSawPu/python-hello-world', environment: 'staging' },
    { id: 'demo-coffee', name: 'ember-oak-coffee-landing', service_type: 'static_site', status: 'live', public_url: 'https://ember-oak-coffee-landing.onrender.com', dashboard_url: '#', branch: 'coffee-shop-landing', repo_full_name: 'JigSawPu/python-hello-world', environment: 'production' }
  ],
  deployments: [{ id: 'demo-deploy-1', status: 'live' }, { id: 'demo-deploy-2', status: 'live' }],
  events: [
    { event_type: 'render_deploy_live', title: 'Coffee landing page went live', summary: 'Render marked the deployment live.', occurred_at: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
    { event_type: 'github_commit', title: 'Dashboard branch created', summary: 'Started Project Ledger on an isolated GitHub branch.', occurred_at: new Date(Date.now() - 1000 * 60 * 47).toISOString() },
    { event_type: 'project_created', title: 'Project Ledger initialized', summary: 'Staging environment prepared for structured project history.', occurred_at: new Date(Date.now() - 1000 * 60 * 70).toISOString() }
  ]
};

function safeUrl(value) { return value && value !== '#' ? value : null; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch]); }
function relativeTime(value) {
  const date = new Date(value); const seconds = Math.max(1, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`; const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`; const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`; return `${Math.round(hours / 24)}d ago`;
}

function renderServices(filter = '') {
  const needle = filter.trim().toLowerCase();
  const services = state.services.filter(service => `${service.name || ''} ${service.service_type || ''} ${service.repo_full_name || ''} ${service.environment || ''}`.toLowerCase().includes(needle));
  els.servicesGrid.innerHTML = '';
  if (!services.length) { els.servicesGrid.innerHTML = '<div class="empty-state">No services match this view yet.</div>'; return; }
  services.forEach(service => {
    const node = els.serviceTemplate.content.cloneNode(true);
    const status = node.querySelector('.service-status');
    const open = node.querySelector('.service-open'); const dash = node.querySelector('.service-dashboard');
    const live = /live|healthy|active/i.test(service.status || '');
    node.querySelector('.service-type').textContent = `${service.environment || 'unknown'} · ${(service.service_type || 'service').replaceAll('_', ' ')}`;
    node.querySelector('.service-name').textContent = service.name || 'Unnamed service';
    node.querySelector('.service-meta').textContent = [service.repo_full_name, service.branch].filter(Boolean).join(' · ') || 'No repository metadata';
    status.textContent = live ? '● LIVE' : `● ${(service.status || 'unknown').toUpperCase()}`; status.classList.add(live ? 'live' : 'failed');
    const publicUrl = safeUrl(service.public_url); const dashboardUrl = safeUrl(service.dashboard_url);
    if (publicUrl) open.href = publicUrl; else open.style.display = 'none';
    if (dashboardUrl) dash.href = dashboardUrl; else dash.style.display = 'none';
    els.servicesGrid.appendChild(node);
  });
}

function renderTimeline() {
  els.timeline.innerHTML = '';
  const events = [...state.events].sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at));
  if (!events.length) { els.timeline.innerHTML = '<div class="empty-state">Activity will appear here as builds, commits, deployments, and conversations are recorded.</div>'; return; }
  events.slice(0, 60).forEach(event => {
    const row = document.createElement('article'); row.className = 'timeline-item';
    row.innerHTML = `<div class="timeline-marker"></div><div class="timeline-copy"><strong>${escapeHtml(event.title || event.event_type || 'Activity')}</strong><p>${escapeHtml(event.summary || '')}</p>${event.url ? `<a href="${escapeHtml(event.url)}" target="_blank" rel="noreferrer">Open source ↗</a>` : ''}</div><time class="timeline-time" datetime="${escapeHtml(event.occurred_at || '')}">${relativeTime(event.occurred_at)}</time>`;
    els.timeline.appendChild(row);
  });
}

function renderStats() {
  const live = state.services.filter(service => /live|healthy|active/i.test(service.status || '')).length;
  els.serviceCount.textContent = state.services.length; els.statServices.textContent = state.services.length; els.statLive.textContent = live; els.statDeploys.textContent = state.deployments.length;
}
function renderAll() { renderStats(); renderServices(els.serviceSearch.value); renderTimeline(); }

function showAuthGate() {
  if (authGate || !client) return;
  authGate = document.createElement('div'); authGate.className = 'auth-gate';
  authGate.innerHTML = `<form class="auth-card glass" id="authForm"><p class="eyebrow">PRIVATE WORKSPACE</p><h2>Sign in to Project Ledger</h2><p>Enter your email to receive a Supabase magic link.</p><input id="authEmail" type="email" autocomplete="email" placeholder="you@example.com" required><button type="submit" class="primary-button">Send magic link</button><small id="authStatus"></small></form>`;
  document.body.appendChild(authGate);
  authGate.querySelector('#authForm').addEventListener('submit', async event => {
    event.preventDefault(); const email = authGate.querySelector('#authEmail').value; const status = authGate.querySelector('#authStatus'); status.textContent = 'Sending…';
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } });
    status.textContent = error ? error.message : 'Magic link sent. Check your inbox.';
  });
}

async function loadFromSupabase() {
  if (!client) throw new Error('Supabase config unavailable');
  const [servicesResult, eventsResult, deploymentsResult] = await Promise.all([
    client.from('render_services').select('*').order('updated_at', { ascending: false }),
    client.from('events').select('*').order('occurred_at', { ascending: false }).limit(100),
    client.from('render_deployments').select('id,status,started_at,finished_at').order('started_at', { ascending: false }).limit(500)
  ]);
  const failure = servicesResult.error || eventsResult.error || deploymentsResult.error; if (failure) throw failure;
  return { services: servicesResult.data || [], events: eventsResult.data || [], deployments: deploymentsResult.data || [] };
}

async function refresh() {
  els.refreshBtn.disabled = true; els.refreshBtn.textContent = '…';
  try { state = await loadFromSupabase(); els.dataMode.textContent = `Connected · Supabase ${config.environment || 'staging'}`; }
  catch (error) { console.info('Using preview data:', error.message); state = demo; els.dataMode.textContent = 'Preview mode · sign in for staging data'; }
  finally { renderAll(); els.refreshBtn.disabled = false; els.refreshBtn.textContent = '↻'; }
}

async function boot() {
  if (!client) { state = demo; els.dataMode.textContent = 'Preview mode · configuration missing'; renderAll(); return; }
  const { data: { session } } = await client.auth.getSession();
  if (!session) { showAuthGate(); state = demo; els.dataMode.textContent = 'Preview mode · sign in for staging data'; renderAll(); }
  else await refresh();
  client.auth.onAuthStateChange((_event, nextSession) => { if (nextSession) { authGate?.remove(); authGate = null; refresh(); } });
}

els.serviceSearch.addEventListener('input', event => renderServices(event.target.value));
els.refreshBtn.addEventListener('click', refresh);
boot();
