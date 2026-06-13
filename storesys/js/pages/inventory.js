/**
 * StoreSys — Página: Inventario
 */

function renderInventory() {
  const container = document.getElementById('page-inventory');
  if (!container.dataset.init) {
    container.innerHTML = buildInventoryShell();
    container.dataset.init = '1';
    populateCategoryFilter();
  }
  filterAndRenderInventoryTable();
}

function buildInventoryShell() {
  return `
    <div class="tabs" id="inv-tabs">
      <button class="tab active" onclick="setInvFilter('all', this)">Todos</button>
      <button class="tab" onclick="setInvFilter('ok',  this)">En stock</button>
      <button class="tab" onclick="setInvFilter('low', this)">Stock bajo</button>
      <button class="tab" onclick="setInvFilter('out', this)">Agotados</button>
    </div>
    <div class="filters">
      <div class="search-box" style="max-width:300px">
        <i class="ti ti-search"></i>
        <input type="text" id="inv-search" placeholder="Buscar producto o SKU..." oninput="filterAndRenderInventoryTable()">
      </div>
      <select id="inv-cat" onchange="filterAndRenderInventoryTable()">
        <option value="">Todas las categorías</option>
      </select>
      <select id="inv-sort" onchange="filterAndRenderInventoryTable()">
        <option value="name">Nombre A-Z</option>
        <option value="stock-asc">Stock ↑</option>
        <option value="stock-desc">Stock ↓</option>
        <option value="value">Valor ↓</option>
      </select>
      <button class="btn btn-primary btn-sm" onclick="openModal('add-product')"><i class="ti ti-plus"></i> Nuevo</button>
    </div>
    <div class="table-card">
      <div class="table-header">
        <span class="table-title" id="inv-count">Productos</span>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead>
            <tr>
              <th>SKU</th><th>Producto</th><th>Categoría</th>
              <th>Stock</th><th>Mínimo</th><th>Precio</th>
              <th>Ubicación</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody id="inv-tbody"></tbody>
        </table>
      </div>
    </div>`;
}

function populateCategoryFilter() {
  const sel  = document.getElementById('inv-cat');
  const cats = [...new Set(AppState.products.map(p => p.cat))].sort();
  cats.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
}

function setInvFilter(value, el) {
  AppState.invFilter = value;
  document.querySelectorAll('#inv-tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  filterAndRenderInventoryTable();
}

function filterAndRenderInventoryTable() {
  const search = (document.getElementById('inv-search')?.value || '').toLowerCase();
  const cat    = document.getElementById('inv-cat')?.value  || '';
  const sort   = document.getElementById('inv-sort')?.value || 'name';
  const filter = AppState.invFilter;

  let prods = AppState.products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search);
    const matchCat    = !cat    || p.cat === cat;
    const matchFilter = filter === 'all'
      || (filter === 'ok'  && p.stock >= p.min)
      || (filter === 'low' && p.stock > 0 && p.stock < p.min)
      || (filter === 'out' && p.stock === 0);
    return matchSearch && matchCat && matchFilter;
  });

  prods.sort((a, b) => {
    if (sort === 'name')       return a.name.localeCompare(b.name);
    if (sort === 'stock-asc')  return a.stock - b.stock;
    if (sort === 'stock-desc') return b.stock - a.stock;
    if (sort === 'value')      return (b.stock * b.price) - (a.stock * a.price);
    return 0;
  });

  const el = document.getElementById('inv-count');
  if (el) el.textContent = `${prods.length} Producto${prods.length !== 1 ? 's' : ''}`;

  const tbody = document.getElementById('inv-tbody');
  if (!tbody) return;

  tbody.innerHTML = prods.map(p => {
    const { cls, label } = getProductStatus(p);
    const pct = p.min > 0 ? Math.min(100, Math.round(p.stock / p.min * 100)) : 100;
    const barCls = cls === 'ok' ? 'fill-green' : cls === 'low' ? 'fill-amber' : 'fill-red';
    return `
      <tr>
        <td><span style="font-family:monospace;font-size:12px;color:#60a5fa">${p.sku}</span></td>
        <td>
          <div style="font-size:13px;font-weight:500;color:#e2e8f0">${p.name}</div>
          <div style="font-size:11px;color:#64748b">${p.desc}</div>
        </td>
        <td><span class="chip">${p.cat}</span></td>
        <td>
          <div style="font-size:14px;font-weight:600;color:#e2e8f0">${p.stock}</div>
          <div class="progress" style="width:60px">
            <div class="progress-fill ${barCls}" style="width:${pct}%"></div>
          </div>
        </td>
        <td style="color:#64748b">${p.min} ${p.unit}</td>
        <td>${formatCurrency(p.price)}</td>
        <td style="font-size:12px;color:#94a3b8">${p.loc || '—'}</td>
        <td><span class="status status-${cls}">${label}</span></td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm" onclick="editProduct(${p.id})" title="Editar"><i class="ti ti-edit"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})" title="Eliminar"><i class="ti ti-trash"></i></button>
          </div>
        </td>
      </tr>`;
  }).join('') || `<tr><td colspan="9" class="empty-state">No se encontraron productos.</td></tr>`;
}

function editProduct(id) {
  AppState.editingProduct = AppState.getProduct(id);
  openModal('add-product');
}

function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto permanentemente?')) return;
  AppState.products = AppState.products.filter(p => p.id !== id);
  filterAndRenderInventoryTable();
  updateBadges();
}
