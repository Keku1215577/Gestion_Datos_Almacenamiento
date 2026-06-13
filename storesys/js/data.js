/**
 * StoreSys — Capa de Datos
 * Estado global de la aplicación con datos de ejemplo
 */

const AppState = {
  products: [
    { id: 1, sku: 'ELC-001', name: 'Laptop HP ProBook', cat: 'Electrónica', desc: 'Laptop 14" Intel i5', stock: 12, min: 5, price: 850, unit: 'unidad', loc: 'Estante A-1', supplierId: 1 },
    { id: 2, sku: 'ELC-002', name: 'Monitor LG 24"',    cat: 'Electrónica', desc: 'Monitor Full HD',    stock: 3,  min: 5, price: 220, unit: 'unidad', loc: 'Estante A-2', supplierId: 1 },
    { id: 3, sku: 'OFI-001', name: 'Resma de Papel A4', cat: 'Oficina',     desc: 'Papel 75gr 500 hjs', stock: 0,  min: 10, price: 5.5, unit: 'resma', loc: 'Estante B-1', supplierId: 2 },
    { id: 4, sku: 'OFI-002', name: 'Bolígrafo Azul',    cat: 'Oficina',     desc: 'Caja de 50 bolis',  stock: 8,  min: 20, price: 12,  unit: 'caja',   loc: 'Estante B-2', supplierId: 2 },
    { id: 5, sku: 'INS-001', name: 'Aceite Lubricante', cat: 'Insumos',     desc: 'Aceite industrial 1L', stock: 45, min: 10, price: 8.75, unit: 'litro', loc: 'Bodega C-1', supplierId: 3 },
    { id: 6, sku: 'HER-001', name: 'Taladro Eléctrico', cat: 'Herramientas', desc: 'Taladro 750W',     stock: 6,  min: 2,  price: 95,  unit: 'unidad', loc: 'Estante D-1', supplierId: 3 },
    { id: 7, sku: 'ELC-003', name: 'Teclado Inalámbrico', cat: 'Electrónica', desc: 'Teclado Bluetooth', stock: 2, min: 5, price: 45, unit: 'unidad', loc: 'Estante A-3', supplierId: 1 },
    { id: 8, sku: 'OFI-003', name: 'Grapadora Escritorio', cat: 'Oficina',   desc: 'Capacidad 50 hjs', stock: 15, min: 5,  price: 18,  unit: 'unidad', loc: 'Estante B-3', supplierId: 2 },
  ],

  movements: [
    { id: 1, date: '2024-06-15 10:30', type: 'entrada',  productId: 1, qty: 5,   ref: 'OC-2024-001', responsible: 'Ana García',   notes: 'Compra mensual' },
    { id: 2, date: '2024-06-15 14:00', type: 'salida',   productId: 3, qty: 10,  ref: 'SO-2024-015', responsible: 'Carlos López',  notes: 'Uso oficina' },
    { id: 3, date: '2024-06-14 09:15', type: 'entrada',  productId: 5, qty: 20,  ref: 'OC-2024-002', responsible: 'Ana García',   notes: '' },
    { id: 4, date: '2024-06-13 16:45', type: 'ajuste',   productId: 2, qty: -2,  ref: 'AJ-2024-003', responsible: 'Luis Torres',  notes: 'Inventario físico' },
    { id: 5, date: '2024-06-12 11:00', type: 'salida',   productId: 6, qty: 1,   ref: 'SO-2024-014', responsible: 'María Ruiz',   notes: 'Préstamo depto.' },
    { id: 6, date: '2024-06-11 08:30', type: 'entrada',  productId: 4, qty: 3,   ref: 'OC-2024-003', responsible: 'Ana García',   notes: '' },
    { id: 7, date: '2024-06-10 15:20', type: 'traslado', productId: 7, qty: 5,   ref: 'TR-2024-001', responsible: 'Carlos López', notes: 'A almacén auxiliar' },
  ],

  suppliers: [
    { id: 1, company: 'TechPro Solutions',   contact: 'Roberto Méndez',   email: 'r.mendez@techpro.com',       phone: '+1 809 555 0101', cats: 'Electrónica',          active: true },
    { id: 2, company: 'Papelería Central',   contact: 'Silvia Vargas',    email: 's.vargas@papelcentral.com',  phone: '+1 809 555 0202', cats: 'Oficina',               active: true },
    { id: 3, company: 'Industrias del Norte', contact: 'Miguel Ángel Roa', email: 'm.roa@indusnorte.com',      phone: '+1 809 555 0303', cats: 'Insumos, Herramientas', active: true },
  ],

  locations: [
    { id: 1, code: 'A-01', type: 'Estante',     desc: 'Zona de electrónica',      cap: 50,  occ: 23 },
    { id: 2, code: 'B-01', type: 'Estante',     desc: 'Zona de oficina',           cap: 100, occ: 23 },
    { id: 3, code: 'C-01', type: 'Bodega',      desc: 'Insumos industriales',      cap: 200, occ: 45 },
    { id: 4, code: 'D-01', type: 'Estante',     desc: 'Herramientas',              cap: 40,  occ: 6  },
    { id: 5, code: 'E-01', type: 'Refrigerado', desc: 'Zona climatizada',          cap: 80,  occ: 0  },
  ],

  currentPage: 'dashboard',
  editingProduct: null,
  invFilter: 'all',
  nextId: 200,

  // Helpers
  getProduct(id)  { return this.products.find(p => p.id === id); },
  getSupplier(id) { return this.suppliers.find(s => s.id === id); },
  getLocation(id) { return this.locations.find(l => l.id === id); },

  getLowStock()   { return this.products.filter(p => p.stock > 0 && p.stock < p.min); },
  getOutOfStock() { return this.products.filter(p => p.stock === 0); },
  getAlertCount() { return this.getLowStock().length + this.getOutOfStock().length; },

  getTotalValue() { return this.products.reduce((s, p) => s + p.stock * p.price, 0); },

  newId() { return ++this.nextId; },
};
