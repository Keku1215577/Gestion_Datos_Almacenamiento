/**
 * StoreSys — Controlador Principal
 */

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  inventory: 'Inventario',
  movements: 'Movimientos',
  suppliers: 'Proveedores',
  locations: 'Ubicaciones',
  alerts:    'Alertas',
  reports:   'Reportes',
};

const PAGE_RENDERERS = {
  dashboard: renderDashboard,
  inventory: renderInventory,
  movements: renderMovements,
  suppliers: renderSuppliers,
  locations: renderLocations,
  alerts:    renderAlerts,
  reports:   renderReports,
};

const App = {
  renderCurrent() {
    const renderer = PAGE_RENDERERS[AppState.currentPage];
    if (renderer) renderer();
  },
};

// ── Navigation ──────────────────────────────────────────────────────────────

function showPage(page, btn) {
  // Hide all pages
  document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-' + page).classList.remove('hidden');

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Update header title
  document.getElementById('page-title').textContent = PAGE_TITLES[page] || page;

  AppState.currentPage = page;

  const renderer = PAGE_RENDERERS[page];
  if (renderer) renderer();
}

// ── Global search ───────────────────────────────────────────────────────────

function globalSearch(val) {
  if (!val.trim()) return;
  // Navigate to inventory and apply search
  const navBtns = document.querySelectorAll('.nav-item');
  navBtns.forEach(b => {
    if (b.textContent.trim().startsWith('Inventario')) {
      showPage('inventory', b);
    }
  });
  setTimeout(() => {
    const input = document.getElementById('inv-search');
    if (input) { input.value = val; filterAndRenderInventoryTable(); }
  }, 50);
}

// ── Init ────────────────────────────────────────────────────────────────────

(function init() {
  updateBadges();
  renderDashboard();
})();
