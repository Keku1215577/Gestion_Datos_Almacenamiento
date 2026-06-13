/**
 * StoreSys — Página: Alertas
 */

function renderAlerts() {
  const low = AppState.getLowStock();
  const out = AppState.getOutOfStock();
  let html  = '';

  if (out.length) {
    html += `<div class="section-title"><i class="ti ti-circle-x" style="color:#f87171"></i> Sin Stock (${out.length})</div>`;
    out.forEach(p => {
      html += `
        <div class="alert alert-danger">
          <i class="ti ti-circle-x"></i>
          <div><b>${p.name}</b> (${p.sku}) — 0 unidades disponibles. Mínimo requerido: ${p.min} ${p.unit}</div>
        </div>`;
    });
  }

  if (low.length) {
    html += `<div class="section-title" style="margin-top:20px"><i class="ti ti-alert-triangle" style="color:#fbbf24"></i> Stock Bajo (${low.length})</div>`;
    low.forEach(p => {
      const pct = Math.round(p.stock / p.min * 100);
      html += `
        <div class="alert alert-warn">
          <i class="ti ti-alert-triangle"></i>
          <div style="flex:1">
            <b>${p.name}</b> (${p.sku}) — ${p.stock} ${p.unit} disponibles. Mínimo: ${p.min} ${p.unit}
            <div class="progress" style="max-width:200px;margin-top:6px">
              <div class="progress-fill fill-amber" style="width:${pct}%"></div>
            </div>
          </div>
          <span style="font-size:12px;color:#fbbf24;white-space:nowrap">${pct}% del mínimo</span>
        </div>`;
    });
  }

  if (!low.length && !out.length) {
    html = `<div class="alert alert-info"><i class="ti ti-check"></i> Todas las existencias están dentro del rango normal. No hay alertas activas.</div>`;
  }

  document.getElementById('page-alerts').innerHTML = html;
}
