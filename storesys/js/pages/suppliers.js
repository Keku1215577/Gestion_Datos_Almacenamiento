/**
 * StoreSys — Página: Proveedores
 */

function renderSuppliers() {
  const container = document.getElementById('page-suppliers');
  if (!container.dataset.init) {
    container.innerHTML = buildSuppliersShell();
    container.dataset.init = '1';
  }
  filterAndRenderSuppliersTable();
}

function buildSuppliersShell() {
  return `
    <div class="filters">
      <div class="search-box" style="max-width:280px">
        <i class="ti ti-search"></i>
        <input type="text" id="sup-search" placeholder="Buscar proveedor..." oninput="filterAndRenderSuppliersTable()">
      </div>
      <button class="btn btn-primary btn-sm" onclick="openModal('add-supplier')">
        <i class="ti ti-plus"></i> Nuevo Proveedor
      </button>
    </div>
    <div class="table-card">
      <div class="table-header">
        <span class="table-title" id="sup-count">Proveedores</span>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Empresa</th><th>Contacto</th>
              <th>Email</th><th>Teléfono</th><th>Categorías</th>
              <th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody id="sup-tbody"></tbody>
        </table>
      </div>
    </div>`;
}

function filterAndRenderSuppliersTable() {
  const search = (document.getElementById('sup-search')?.value || '').toLowerCase();
  const sups   = AppState.suppliers.filter(s =>
    !search || s.company.toLowerCase().includes(search) || s.contact.toLowerCase().includes(search)
  );

  const el = document.getElementById('sup-count');
  if (el) el.textContent = `${sups.length} Proveedor${sups.length !== 1 ? 'es' : ''}`;

  document.getElementById('sup-tbody').innerHTML = sups.map(s => `
    <tr>
      <td style="font-family:monospace;font-size:12px;color:#475569">SUP-${String(s.id).padStart(3,'0')}</td>
      <td style="font-size:13px;font-weight:500;color:#e2e8f0">${s.company}</td>
      <td style="color:#94a3b8">${s.contact}</td>
      <td style="color:#60a5fa;font-size:12px">${s.email}</td>
      <td style="font-size:12px;color:#94a3b8">${s.phone}</td>
      <td>${s.cats.split(',').map(c => `<span class="chip">${c.trim()}</span>`).join(' ')}</td>
      <td><span class="status status-${s.active ? 'active' : 'out'}">${s.active ? 'Activo' : 'Inactivo'}</span></td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-sm" onclick="toggleSupplier(${s.id})" title="${s.active ? 'Desactivar' : 'Activar'}">
            <i class="ti ti-${s.active ? 'ban' : 'check'}"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteSupplier(${s.id})" title="Eliminar">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </td>
    </tr>`).join('') || `<tr><td colspan="8" class="empty-state">No se encontraron proveedores.</td></tr>`;
}

function toggleSupplier(id) {
  const s = AppState.suppliers.find(s => s.id === id);
  if (s) s.active = !s.active;
  filterAndRenderSuppliersTable();
}

function deleteSupplier(id) {
  if (!confirm('¿Eliminar este proveedor?')) return;
  AppState.suppliers = AppState.suppliers.filter(s => s.id !== id);
  filterAndRenderSuppliersTable();
}
