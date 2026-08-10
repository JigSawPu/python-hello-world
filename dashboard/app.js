const config = window.PROJECT_LEDGER_CONFIG || {};
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

const demo = {
  services: [
    {
      id: 'demo-static',
      name: 'project-ledger-dashboard',
      service_type: 'static_site',
      status: 'live',
      public_url: '#',
      dashboard_url: '#',
      branch: 'project-ledger-dashboard',
      repo_full_name: 'JigSawPu/python-hello-world',
      environment: 'staging'
    },
    {
      id: 'demo-coffee',
      name: 'ember-oak-coffee-landing',
      service_type: 'static_site',
      status: 'live',
      public_url: 'https://ember-oak-coffee-landing.onrender.com',
      dashboard_url: '#',
      branch: 'coffee-shop-landing',
      repo_full_name: 'JigSawPu/python-hello-world',
      environment: 'production'
    }
  ],
  deployments: [{ id: 'demo-deploy-1', status: 'live' }, { id: 'demo-deploy-2', status: 'live' }],
  events: [
    { event_type: 'render_deploy_live', title: 'Coffee landing page went live', summary: 'Render marked the deployment live.', occurred_at: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
    { event_type: 'github_commit', title: 'Dashboard branch created', summary: 'Started Project Ledger on an isolated GitHub branch.', occurred_at: new Date(Date.now() - 1000 * 60 * 47).toISOString() },
    { event_type: 'project_created', title: 'Project Ledger initialized', summary: 'Staging environment prepared for structured project history.', occurred_at: new Date(Date.now() - 1000 * 60 * 70).toISOString() }
  ]
};

function safeUrl(value) {
  return value && value !== '#' ? value : null;
}

function renderServices(filter = '') {
  const needle = filter.trim().toLowerCase();
  const services = state.services.filter(service => {
    const haystack = `${service.name || ''} ${service.service_type || ''} ${service.repo_full_name || ''} ${service.environment || ''}`.toLowerCase();
    return !needle || haystack.includes(needle);
  });

  els.servicesGrid.innerHTML = '';
  if (!services.length) {
    els.servicesGrid.innerHTML = '<div class="empty-state">No services match this view yet.</div>';
    return;
  }

  services.forEach(service => {
    const node = els.serviceTemplate.content.cloneNode(true);
    const card = node.querySelector('.service-card');
    const status = node.querySelector('.service-status');
    const open = node.querySelector('.service-open');
    const dash = node.querySelector('.service-dashboard');
    const live = (service.status || '').toLowerCase() === 'live';

    node.querySelector('.service-type').textContent = `${service.environment || 'unknown'} · ${(service.service_type || 'service').replaceAll('_', ' ')}`;
    node.querySelector('.service-name').textContent = service.name || 'Unnamed service';
    node.querySelector('.service-meta').textContent = [service.repo_full_name, service.branch].filter(Boolean).join(' · ') || 'No repository metadata';
    status.textContent = live ? '● LIVE' : `● ${(service.status || 'unknown').toUpperCase()}`;
    status.classList.add(live ? 'live' : 'failed');

    const publicUrl = safeUrl(service.public_url);
    const dashboardUrl = safeUrl(service.dashboard_url);
    if (publicUrl) open.href = publicUrl; else open.style.display = 'none';
    if (dashboardUrl) dash.href = dashboardUrl; else dash.style.display = 'none';

    card.dataset.serviceId = service.id || '';
    els.servicesGrid.appendChild(node);
  });
}

function relativeTime(value) {
  const date = new Date(value);
  const seconds = Math.max(1, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function renderTimeline() {
  els.timeline.innerHTML = '';
  const events = [...state.events].sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at));
  if (!events.length) {
    els.timeline.innerHTML = '<div class="empty-state">Activity will appear here as builds, commits, deployments, and conversations are recorded.</div>';
    return;
  }

  events.slice(0, 40).forEach(event => {
    const row = document.createElement('article');
    row.className = 'timeline-item';
    row.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-copy">
        <strong>${escapeHtml(event.title || event.event_type || 'Activity')}</strong>
        <p>${escapeHtml(event.summary || '')}</p>
      </div>
      <time class="timeline-time" datetime="${escapeHtml(event.occurred_at || '')}">${relativeTime(event.occurred_at)}</time>
    `;
    els.timeline.appendChild(row);
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch]);
}

function renderStats() {
  const live = state.services.filter(service => (service.status || '').toLowerCase() === 'live').length;
  const services = state.services.length;
  const deploys = state.deployments.length;
  els.serviceCount.textContent = services;
  els.statServices.textContent = services;
  els.statLive.textContent = live;
  els.statDeploys.textContent = deploys;
}

async function loadFromSupabase() {
  if (!config.supabaseUrl || !config.supabasePublishableKey || !window.supabase) throw new Error('Supabase config unavailable');
  const client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey);

  const [servicesResult, eventsResult, deploymentsResult] = await Promise.all([
    client.from('render_services').select('*').order('updated_at', { ascending: false }),
    client.from('events').select('*').order('occurred_at', { ascending: false }).limit(100),
    client.from('render_deployments').select('id,status,started_at,finished_at').order('started_at', { ascending: false }).limit(500)
  ]);

  const failures = [servicesResult.error, eventsResult.error, deploymentsResult.error].filter(Boolean);
  if (failures.length) throw failures[0];

  return {
    services: servicesResult.data || [],
    events: eventsResult.data || [],
    deployments: deploymentsResult.data || []
  };
}

async function refresh() {
  els.refreshBtn.disabled = true;
  els.refreshBtn.textContent = '…';
  try {
    state = await loadFromSupabase();
    els.dataMode.textContent = `Connected · Supabase ${config.environment || 'staging'}`;
  } catch (error) {
    console.info('Using preview data:', error.message);
    state = demo;
    els.dataMode.textContent = 'Preview mode · waiting for staging data';
  } finally {
    renderStats();
    renderServices(els.serviceSearch.value);
    renderTimeline();
    els.refreshBtn.disabled = false;
    els.refreshBtn.textContent = '↻';
  }
}

els.serviceSearch.addEventListener('input', event => renderServices(event.target.value));
els.refreshBtn.addEventListener('click', refresh);
refresh();
