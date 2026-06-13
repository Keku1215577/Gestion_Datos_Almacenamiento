/**
 * StoreSys — Página: Reportes
 */

function renderReports() {
  document.getElementById('page-reports').innerHTML = `
    <div class="two-col">
      <div class="card">
        <div class="section-title"><i class="ti ti-chart-bar" style="color:#60a5fa"></i> Resumen de Inventario</div>
        <div id="report-summary"></div>
      </div>
      <div class="card">
        <div class="section-title"><i class="ti ti-trending-up" style="color:#4ade80"></i> Movimientos Registrados</div>
        <div id="report-movements"></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title"><i class="ti ti-award" style="color:#fbbf24"></i> Productos más Activos</div>
      <div id="report-top"></div>
    </div>`;

  renderReportSummary();
  renderReportMovements();
  renderReportTop();
}

function renderReportSummary() {
  const P        = AppState.products;
  const totalVal = AppState.getTotalValue();
  const low      = AppState.getLowStock().length;
  const out      = AppState.getOutOfStock().length;

  let html = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <div style="background:#0f1117;border-radius:8px;padding:12px;text-align:center">
        <div style="font-size:11px;color:#64748b;margin-bottom:4px">Valor total</div>
        <div style="font-size:20px;font-weight:600;color:#4ade80">${formatCurrencyShort(totalVal)}</div>
      </div>
      <div style="background:#0f1117;border-radius:8px;padding:12px;text-align:center">
        <div style="font-size:11px;color:#64748b;margin-bottom:4px">SKUs activos</div>
        <div style="font-size:20px;font-weight:600;color:#60a5fa">${P.length}</div>
      </div>
      <div style="background:#0f1117;border-radius:8px;padding:12px;text-align:center">
        <div style="font-size:11px;color:#64748b;margin-bottom:4px">Stock bajo</div>
        <div style="font-size:20px;font-weight:600;color:#fbbf24">${low}</div>
      </div>
      <div style="background:#0f1117;border-radius:8px;padding:12px;text-align:center">
        <div style="font-size:11px;color:#64748b;margin-bottom:4px">Agotados</div>
        <div style="font-size:20px;font-weight:600;color:#f87171">${out}</div>
      </div>
    </div>
    <div style="font-size:12px;color:#64748b;margin-bottom:8px">Valor por categoría</div>`;

  const cats = [...new Set(P.map(p => p.cat))];
  cats.forEach(cat => {
    const catVal = P.filter(p => p.cat === cat).reduce((s, p) => s + p.stock * p.price, 0);
    const pct    = totalVal > 0 ? Math.round(catVal / totalVal * 100) : 0;
    html += `
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span style="color:#94a3b8">${cat}</span>
          <span style="color:#e2e8f0;font-weight:500">${formatCurrencyShort(catVal)} (${pct}%)</span>
        </div>
        <div class="progress"><div class="progress-fill fill-blue" style="width:${pct}%"></div></div>
      </div>`;
  });

  document.getElementById('report-summary').innerHTML = html;
}

function renderReportMovements() {
  const M        = AppState.movements;
  const entradas = M.filter(m => m.type === 'entrada').reduce((s, m) => s + m.qty, 0);
  const salidas  = M.filter(m => m.type === 'salida').reduce((s, m) => s + m.qty, 0);

  let html = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <div style="background:#0f1117;border-radius:8px;padding:12px;text-align:center">
        <div style="font-size:11px;color:#64748b;margin-bottom:4px">Total entradas</div>
        <div style="font-size:20px;font-weight:600;color:#4ade80">+${entradas}</div>
      </div>
      <div style="background:#0f1117;border-radius:8px;padding:12px;text-align:center">
        <div style="font-size:11px;color:#64748b;margin-bottom:4px">Total salidas</div>
        <div style="font-size:20px;font-weight:600;color:#f87171">-${salidas}</div>
      </div>
    </div>
    <div style="font-size:12px;color:#64748b;margin-bottom:8px">Distribución por tipo</div>`;

  const types = ['entrada', 'salida', 'ajuste', 'traslado'];
  const barClasses = { entrada: 'fill-green', salida: 'fill-red', ajuste: 'fill-amber', traslado: 'fill-blue' };

  types.forEach(t => {
    const cnt = M.filter(m => m.type === t).length;
    const pct = M.length > 0 ? Math.round(cnt / M.length * 100) : 0;
    html += `
      <div style="margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px">
          <span style="color:#94a3b8">${TYPE_LABELS[t]}</span>
          <span style="color:#e2e8f0">${cnt} (${pct}%)</span>
        </div>
        <div class="progress"><div class="progress-fill ${barClasses[t]}" style="width:${pct}%"></div></div>
      </div>`;
  });

  document.getElementById('report-movements').innerHTML = html;
}

function renderReportTop() {
  const M = AppState.movements;
  const top = AppState.products
    .map(p => ({ ...p, moves: M.filter(m => m.productId === p.id).reduce((s, m) => s + Math.abs(m.qty), 0) }))
    .sort((a, b) => b.moves - a.moves)
    .slice(0, 5);

  document.getElementById('report-top').innerHTML = top.map((p, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:0.5px solid #1e2736;">
      <div style="width:24px;height:24px;border-radius:50%;background:#1e3a5f;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#60a5fa;flex-shrink:0">${i + 1}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500;color:#e2e8f0">${p.name}</div>
        <div style="font-size:11px;color:#64748b">${p.sku} · ${p.cat}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:13px;font-weight:500;color:#fbbf24">${p.moves} mov.</div>
        <div style="font-size:11px;color:#64748b">Stock: ${p.stock}</div>
      </div>
    </div>`).join('') || `<div class="empty-state">Sin datos de movimientos.</div>`;
}
