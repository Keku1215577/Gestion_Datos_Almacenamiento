/**
 * StoreSys — Página: Movimientos
 */

function renderMovements() {
  const container = document.getElementById('page-movements');
  if (!container.dataset.init) {
    container.innerHTML = buildMovementsShell();
    container.dataset.init = '1';
  }
  filterAndRenderMovementsTable();
}

function buildMovementsShell() {
  return `
    <div class="filters">
      <div class="search-box" style="max-width:280px">
        <i class="ti ti-search"></i>
        <input type="text" id="mov-search" placeholder="Buscar producto o referencia..." oninput="filterAndRenderMovementsTable()">
      </div>
      <select id="mov-type" onchange="filterAndRenderMovementsTable()">
        <option value="">Todos los tipos</option>
        <option value="entrada">Entradas</option>
        <option value="salida">Salidas</option>
        <option value="ajuste">Ajustes</option>
        <option value="traslado">Traslados</option>
      </select>
      <button class="btn btn-primary btn-sm" onclick="openModal('add-movement')">
        <i class="ti ti-plus"></i> Registrar
      </button>
    </div>
    <div class="table-card">
      <div class="table-header">
        <span class="table-title" id="mov-count">Movimientos</span>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Fecha</th><th>Tipo</th><th>Producto</th>
              <th>Cantidad</th><th>Referencia</th><th>Responsable</th><th>Notas</th>
            </tr>
          </thead>
          <tbody id="mov-tbody"></tbody>
        </table>
      </div>
    </div>`;
}

function filterAndRenderMovementsTable() {
  const search = (document.getElementById('mov-search')?.value || '').toLowerCase();
  const type   = document.getElementById('mov-type')?.value || '';

  let movs = [...AppState.movements]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter(m => {
      const prod = AppState.getProduct(m.productId);
      const name = prod ? prod.name.toLowerCase() : '';
      return (!search || name.includes(search) || m.ref.toLowerCase().includes(search))
          && (!type   || m.type === type);
    });

  const el = document.getElementById('mov-count');
  if (el) el.textContent = `${movs.length} Movimiento${movs.length !== 1 ? 's' : ''}`;

  const statusMap = { entrada: 'active', salida: 'out', ajuste: 'low', traslado: 'ok' };

  document.getElementById('mov-tbody').innerHTML = movs.map(m => {
    const prod  = AppState.getProduct(m.productId);
    const color = TYPE_COLORS[m.type] || '#64748b';
    return `
      <tr>
        <td style="font-family:monospace;font-size:12px;color:#475569">#${m.id}</td>
        <td style="font-size:12px;color:#94a3b8">${m.date}</td>
        <td><span class="status status-${statusMap[m.type]}">${TYPE_LABELS[m.type]}</span></td>
        <td style="font-size:13px;color:#e2e8f0">${prod ? prod.name : '<span style="color:#64748b">N/A</span>'}</td>
        <td style="font-weight:600;color:${color}">${m.type === 'salida' ? '-' : '+'}${Math.abs(m.qty)}</td>
        <td style="font-family:monospace;font-size:12px;color:#60a5fa">${m.ref}</td>
        <td style="font-size:12px;color:#94a3b8">${m.responsible}</td>
        <td style="font-size:12px;color:#64748b">${m.notes || '—'}</td>
      </tr>`;
  }).join('') || `<tr><td colspan="8" class="empty-state">No se encontraron movimientos.</td></tr>`;
}
