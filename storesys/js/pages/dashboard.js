/**
 * StoreSys — Página: Dashboard
 */

function renderDashboard() {
  const S   = AppState;
  const low = S.getLowStock();
  const out = S.getOutOfStock();
  const val = S.getTotalValue();

  document.getElementById('page-dashboard').innerHTML = `
    <div class="cards-grid">
      ${kpiCard('ti-box',             'icon-blue',  'Total Productos',    S.products.length, 'SKUs activos en almacén')}
      ${kpiCard('ti-currency-dollar', 'icon-green', 'Valor de Inventario', formatCurrencyShort(val), 'Valoración total')}
      ${kpiCard('ti-alert-triangle',  'icon-amber', 'Stock Bajo',          low.length, 'Por debajo del mínimo')}
      ${kpiCard('ti-circle-x',        'icon-red',   'Sin Stock',           out.length, 'Agotados')}
    </div>
    <div class="two-col">
      <div class="card">
        <div class="section-title"><i class="ti ti-chart-donut" style="color:#60a5fa"></i> Stock por Categoría</div>
        <div id="dash-categories"></div>
      </div>
      <div class="card">
        <div class="section-title"><i class="ti ti-clock" style="color:#60a5fa"></i> Últimos Movimientos</div>
        <div id="dash-recent"></div>
      </div>
    </div>
    <div class="table-card">
      <div class="table-header"><span class="table-title">Alertas Activas</span></div>
      <div style="padding:14px" id="dash-alerts"></div>
    </div>`;

  renderDashCategories();
  renderDashRecent();
  renderDashAlerts();
}

function kpiCard(icon, iconCls, label, value, sub) {
  return `
    <div class="card">
      <div class="card-icon ${iconCls}"><i class="ti ${icon}"></i></div>
      <div class="card-label">${label}</div>
      <div class="card-value">${value}</div>
      <div class="card-sub">${sub}</div>
    </div>`;
}

function renderDashCategories() {
  const cats  = {};
  AppState.products.forEach(p => { cats[p.cat] = (cats[p.cat] || 0) + p.stock; });
  const total = Object.values(cats).reduce((a, b) => a + b, 0) || 1;

  let bar  = '<div class="cat-bar">';
  let rows = '';

  Object.entries(cats).forEach(([cat, qty]) => {
    const pct   = Math.round(qty / total * 100);
    const color = CAT_COLORS[cat] || '#64748b';
    bar  += `<div class="cat-seg" style="width:${pct}%;background:${color}"></div>`;
    rows += `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:0.5px solid #1e2736;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:10px;height:10px;border-radius:2px;background:${color}"></div>
          <span style="font-size:13px;color:#cbd5e1">${cat}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:13px;font-weight:500;color:#e2e8f0">${qty}</span>
          <span style="font-size:11px;color:#64748b">${pct}%</span>
        </div>
      </div>`;
  });

  bar += '</div>';
  document.getElementById('dash-categories').innerHTML = bar + rows;
}

function renderDashRecent() {
  const recent = [...AppState.movements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  document.getElementById('dash-recent').innerHTML = recent.map(m => {
    const prod  = AppState.getProduct(m.productId);
    const color = TYPE_COLORS[m.type] || '#64748b';
    const icon  = TYPE_ICONS[m.type]  || 'ti-box';
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:0.5px solid #1e2736;">
        <div style="width:28px;height:28px;border-radius:8px;background:${color}20;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="ti ${icon}" style="color:${color};font-size:14px"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${prod ? prod.name : 'Desconocido'}</div>
          <div style="font-size:11px;color:#64748b">${m.date.slice(0, 10)}</div>
        </div>
        <div style="font-size:12px;font-weight:500;color:${color}">${m.type === 'salida' ? '-' : '+'}${Math.abs(m.qty)}</div>
      </div>`;
  }).join('') || '<div style="color:#475569;font-size:13px;padding:8px 0">Sin movimientos recientes.</div>';
}

function renderDashAlerts() {
  const low   = AppState.getLowStock();
  const out   = AppState.getOutOfStock();
  const items = [
    ...out.map(p => ({ danger: true, msg: `Agotado: <b>${p.name}</b> — 0 unidades. Mínimo: ${p.min}` })),
    ...low.map(p => ({ danger: false, msg: `Stock bajo: <b>${p.name}</b> — ${p.stock} unidades. Mínimo: ${p.min}` })),
  ];

  document.getElementById('dash-alerts').innerHTML = items.length
    ? items.map(a => `<div class="alert ${a.danger ? 'alert-danger' : 'alert-warn'}">
        <i class="ti ti-${a.danger ? 'circle-x' : 'alert-triangle'}"></i><span>${a.msg}</span></div>`).join('')
    : `<div class="alert alert-info"><i class="ti ti-check"></i> No hay alertas activas.</div>`;
}
