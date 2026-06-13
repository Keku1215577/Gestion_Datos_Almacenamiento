/**
 * StoreSys — Funciones Utilitarias
 */

const CAT_COLORS = {
  'Electrónica':  '#3b82f6',
  'Oficina':      '#8b5cf6',
  'Insumos':      '#22c55e',
  'Herramientas': '#f59e0b',
  'Alimentos':    '#f87171',
  'Ropa':         '#ec4899',
  'Otro':         '#64748b',
};

const TYPE_COLORS  = { entrada: '#22c55e', salida: '#f87171', ajuste: '#fbbf24', traslado: '#60a5fa' };
const TYPE_LABELS  = { entrada: 'Entrada', salida: 'Salida', ajuste: 'Ajuste', traslado: 'Traslado' };
const TYPE_ICONS   = { entrada: 'ti-arrow-down', salida: 'ti-arrow-up', ajuste: 'ti-adjustments', traslado: 'ti-arrows-exchange' };
const LOC_ICONS    = { Estante: 'ti-align-justified', Bodega: 'ti-building-warehouse', Refrigerado: 'ti-snowflake', Patio: 'ti-tree', 'Caja fuerte': 'ti-lock' };

function getProductStatus(p) {
  if (p.stock === 0)            return { cls: 'out',  label: 'Agotado'    };
  if (p.stock < p.min)          return { cls: 'low',  label: 'Stock bajo' };
  return                               { cls: 'ok',   label: 'En stock'   };
}

function formatCurrency(val) {
  return '$' + val.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCurrencyShort(val) {
  return '$' + val.toLocaleString('es-DO', { maximumFractionDigits: 0 });
}

function nowString() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

function updateBadges() {
  const count = AppState.getAlertCount();
  document.getElementById('badge-low').textContent    = count;
  document.getElementById('badge-alerts').textContent = count;
}
