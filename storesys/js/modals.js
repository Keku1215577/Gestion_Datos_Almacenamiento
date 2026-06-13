/**
 * StoreSys — Gestión de Modales
 */

function openModal(name) {
  document.getElementById('modal-overlay').classList.remove('hidden');
  // Remove any existing modal
  const old = document.getElementById('active-modal');
  if (old) old.remove();

  const el = document.createElement('div');
  el.className = 'modal';
  el.id = 'active-modal';
  el.innerHTML = buildModalHTML(name);
  document.getElementById('modals-container').appendChild(el);
  initModalFields(name);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  const m = document.getElementById('active-modal');
  if (m) m.remove();
  AppState.editingProduct = null;
}

function closeAllModals(e) {
  if (e.target.id === 'modal-overlay') closeModal();
}

// ── Build HTML ──────────────────────────────────────────────────────────────

function buildModalHTML(name) {
  switch (name) {
    case 'add-product':   return modalProduct();
    case 'add-movement':  return modalMovement();
    case 'add-supplier':  return modalSupplier();
    case 'add-location':  return modalLocation();
    default: return '';
  }
}

function modalCloseBtn() {
  return `<button class="modal-close" onclick="closeModal()"><i class="ti ti-x"></i></button>`;
}

function modalProduct() {
  const isEdit = !!AppState.editingProduct;
  const supplierOptions = AppState.suppliers
    .map(s => `<option value="${s.id}">${s.company}</option>`)
    .join('');

  return `
    <div class="modal-title">
      <span>${isEdit ? 'Editar Producto' : 'Nuevo Producto'}</span>
      ${modalCloseBtn()}
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">SKU *</label>
        <input class="form-input" id="f-sku" placeholder="Ej. PRD-001">
      </div>
      <div class="form-group">
        <label class="form-label">Categoría *</label>
        <select class="form-input" id="f-cat">
          ${Object.keys(CAT_COLORS).map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Nombre del Producto *</label>
      <input class="form-input" id="f-name" placeholder="Nombre descriptivo">
    </div>
    <div class="form-group">
      <label class="form-label">Descripción</label>
      <input class="form-input" id="f-desc" placeholder="Descripción breve (opcional)">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Stock Actual *</label>
        <input class="form-input" id="f-stock" type="number" min="0" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Stock Mínimo *</label>
        <input class="form-input" id="f-min" type="number" min="0" placeholder="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Precio Unitario ($)</label>
        <input class="form-input" id="f-price" type="number" step="0.01" min="0" placeholder="0.00">
      </div>
      <div class="form-group">
        <label class="form-label">Unidad</label>
        <select class="form-input" id="f-unit">
          <option>unidad</option><option>kg</option><option>litro</option>
          <option>caja</option><option>rollo</option><option>metro</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Ubicación</label>
        <input class="form-input" id="f-loc" placeholder="Ej. Estante A-3">
      </div>
      <div class="form-group">
        <label class="form-label">Proveedor</label>
        <select class="form-input" id="f-supplier">
          <option value="">Sin proveedor</option>
          ${supplierOptions}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveProduct()"><i class="ti ti-check"></i> Guardar</button>
    </div>`;
}

function modalMovement() {
  const productOptions = AppState.products
    .map(p => `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`)
    .join('');
  return `
    <div class="modal-title">
      <span>Registrar Movimiento</span>
      ${modalCloseBtn()}
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tipo *</label>
        <select class="form-input" id="m-type">
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
          <option value="ajuste">Ajuste</option>
          <option value="traslado">Traslado</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Producto *</label>
        <select class="form-input" id="m-product">${productOptions}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Cantidad *</label>
        <input class="form-input" id="m-qty" type="number" min="1" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Referencia</label>
        <input class="form-input" id="m-ref" placeholder="Ej. OC-2024-001">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Responsable</label>
      <input class="form-input" id="m-responsible" placeholder="Nombre del responsable">
    </div>
    <div class="form-group">
      <label class="form-label">Notas</label>
      <input class="form-input" id="m-notes" placeholder="Observaciones opcionales">
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveMovement()"><i class="ti ti-check"></i> Registrar</button>
    </div>`;
}

function modalSupplier() {
  return `
    <div class="modal-title">
      <span>Nuevo Proveedor</span>
      ${modalCloseBtn()}
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Empresa *</label>
        <input class="form-input" id="s-company" placeholder="Nombre de la empresa">
      </div>
      <div class="form-group">
        <label class="form-label">Contacto *</label>
        <input class="form-input" id="s-contact" placeholder="Persona de contacto">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" id="s-email" type="email" placeholder="email@empresa.com">
      </div>
      <div class="form-group">
        <label class="form-label">Teléfono</label>
        <input class="form-input" id="s-phone" placeholder="+1 000 000 0000">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Categorías que suministra</label>
      <input class="form-input" id="s-cats" placeholder="Ej. Electrónica, Insumos">
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveSupplier()"><i class="ti ti-check"></i> Guardar</button>
    </div>`;
}

function modalLocation() {
  return `
    <div class="modal-title">
      <span>Nueva Ubicación</span>
      ${modalCloseBtn()}
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Código *</label>
        <input class="form-input" id="l-code" placeholder="Ej. A-01">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select class="form-input" id="l-type">
          <option>Estante</option><option>Bodega</option>
          <option>Refrigerado</option><option>Patio</option><option>Caja fuerte</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Descripción</label>
      <input class="form-input" id="l-desc" placeholder="Descripción de la ubicación">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Capacidad máxima</label>
        <input class="form-input" id="l-cap" type="number" min="0" placeholder="100">
      </div>
      <div class="form-group">
        <label class="form-label">Ocupación actual</label>
        <input class="form-input" id="l-occ" type="number" min="0" placeholder="0">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveLocation()"><i class="ti ti-check"></i> Guardar</button>
    </div>`;
}

// ── Pre-fill edit fields ────────────────────────────────────────────────────

function initModalFields(name) {
  if (name === 'add-product' && AppState.editingProduct) {
    const p = AppState.editingProduct;
    document.getElementById('f-sku').value      = p.sku;
    document.getElementById('f-cat').value      = p.cat;
    document.getElementById('f-name').value     = p.name;
    document.getElementById('f-desc').value     = p.desc;
    document.getElementById('f-stock').value    = p.stock;
    document.getElementById('f-min').value      = p.min;
    document.getElementById('f-price').value    = p.price;
    document.getElementById('f-unit').value     = p.unit;
    document.getElementById('f-loc').value      = p.loc;
    document.getElementById('f-supplier').value = p.supplierId || '';
  }
}

// ── Save handlers ───────────────────────────────────────────────────────────

function saveProduct() {
  const sku  = document.getElementById('f-sku').value.trim();
  const name = document.getElementById('f-name').value.trim();
  if (!sku || !name) { alert('SKU y nombre son obligatorios.'); return; }

  const data = {
    sku,
    name,
    cat:        document.getElementById('f-cat').value,
    desc:       document.getElementById('f-desc').value.trim(),
    stock:      parseInt(document.getElementById('f-stock').value) || 0,
    min:        parseInt(document.getElementById('f-min').value)   || 0,
    price:      parseFloat(document.getElementById('f-price').value) || 0,
    unit:       document.getElementById('f-unit').value,
    loc:        document.getElementById('f-loc').value.trim(),
    supplierId: parseInt(document.getElementById('f-supplier').value) || null,
  };

  if (AppState.editingProduct) {
    Object.assign(AppState.editingProduct, data);
  } else {
    AppState.products.push({ id: AppState.newId(), ...data });
  }

  closeModal();
  App.renderCurrent();
  updateBadges();
}

function saveMovement() {
  const productId = parseInt(document.getElementById('m-product').value);
  const qty       = parseInt(document.getElementById('m-qty').value);
  const type      = document.getElementById('m-type').value;
  if (!qty || qty <= 0) { alert('La cantidad debe ser mayor a 0.'); return; }

  const prod = AppState.getProduct(productId);
  if (prod) {
    if      (type === 'entrada') prod.stock += qty;
    else if (type === 'salida')  prod.stock  = Math.max(0, prod.stock - qty);
    else if (type === 'ajuste')  prod.stock  = Math.max(0, prod.stock + qty);
    // traslado no modifica stock
  }

  AppState.movements.unshift({
    id:          AppState.newId(),
    date:        nowString(),
    type,
    productId,
    qty,
    ref:         document.getElementById('m-ref').value.trim()         || 'MOV-' + AppState.nextId,
    responsible: document.getElementById('m-responsible').value.trim() || 'Admin',
    notes:       document.getElementById('m-notes').value.trim(),
  });

  closeModal();
  App.renderCurrent();
  updateBadges();
}

function saveSupplier() {
  const company = document.getElementById('s-company').value.trim();
  if (!company) { alert('El nombre de la empresa es obligatorio.'); return; }

  AppState.suppliers.push({
    id:      AppState.newId(),
    company,
    contact: document.getElementById('s-contact').value.trim(),
    email:   document.getElementById('s-email').value.trim(),
    phone:   document.getElementById('s-phone').value.trim(),
    cats:    document.getElementById('s-cats').value.trim() || 'General',
    active:  true,
  });

  closeModal();
  App.renderCurrent();
}

function saveLocation() {
  const code = document.getElementById('l-code').value.trim();
  if (!code) { alert('El código de ubicación es obligatorio.'); return; }

  AppState.locations.push({
    id:   AppState.newId(),
    code,
    type: document.getElementById('l-type').value,
    desc: document.getElementById('l-desc').value.trim(),
    cap:  parseInt(document.getElementById('l-cap').value) || 0,
    occ:  parseInt(document.getElementById('l-occ').value) || 0,
  });

  closeModal();
  App.renderCurrent();
}
