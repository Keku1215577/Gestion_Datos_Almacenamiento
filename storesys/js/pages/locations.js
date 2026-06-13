/**
 * StoreSys — Página: Ubicaciones
 */

function renderLocations() {
  const container = document.getElementById('page-locations');
  container.innerHTML = `
    <div class="filters">
      <button class="btn btn-primary btn-sm" onclick="openModal('add-location')">
        <i class="ti ti-plus"></i> Nueva Ubicación
      </button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;" id="loc-grid"></div>`;
  renderLocationCards();
}

function renderLocationCards() {
  const grid = document.getElementById('loc-grid');
  if (!grid) return;

  grid.innerHTML = AppState.locations.map(l => {
    const pct   = l.cap > 0 ? Math.round(l.occ / l.cap * 100) : 0;
    const barCls = pct > 85 ? 'fill-red' : pct > 60 ? 'fill-amber' : 'fill-green';
    const icon   = LOC_ICONS[l.type] || 'ti-box';
    return `
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="card-icon icon-blue" style="margin:0;width:28px;height:28px;font-size:14px">
              <i class="ti ${icon}"></i>
            </div>
            <div>
              <div style="font-weight:600;color:#e2e8f0;font-size:14px">${l.code}</div>
              <div style="font-size:11px;color:#64748b">${l.type}</div>
            </div>
          </div>
          <button class="btn btn-sm btn-danger" onclick="deleteLocation(${l.id})">
            <i class="ti ti-trash"></i>
          </button>
        </div>
        <div style="font-size:12px;color:#94a3b8;margin-bottom:10px">${l.desc || '—'}</div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:4px">
          <span>Ocupación</span>
          <span style="color:#e2e8f0;font-weight:500">${l.occ} / ${l.cap}</span>
        </div>
        <div class="progress">
          <div class="progress-fill ${barCls}" style="width:${pct}%"></div>
        </div>
        <div style="font-size:11px;color:#64748b;margin-top:4px;text-align:right">${pct}%</div>
      </div>`;
  }).join('') || `<div class="empty-state" style="grid-column:1/-1">No hay ubicaciones registradas.</div>`;
}

function deleteLocation(id) {
  if (!confirm('¿Eliminar esta ubicación?')) return;
  AppState.locations = AppState.locations.filter(l => l.id !== id);
  renderLocationCards();
}
