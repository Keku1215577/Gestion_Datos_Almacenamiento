# StoreSys — Sistema de Gestión de Almacenamiento

Sistema web completo para gestión de inventario y almacenamiento, adaptable a cualquier tipo de empresa.

## 📁 Estructura del Proyecto

```
storesys/
├── index.html              # Punto de entrada principal
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── data.js             # Estado global y datos de ejemplo
│   ├── utils.js            # Funciones utilitarias compartidas
│   ├── modals.js           # Gestión de modales y formularios
│   ├── app.js              # Controlador principal y navegación
│   └── pages/
│       ├── dashboard.js    # Página: KPIs y resumen
│       ├── inventory.js    # Página: Inventario de productos
│       ├── movements.js    # Página: Historial de movimientos
│       ├── suppliers.js    # Página: Proveedores
│       ├── locations.js    # Página: Ubicaciones físicas
│       ├── alerts.js       # Página: Alertas de stock
│       └── reports.js      # Página: Reportes y análisis
└── README.md
```

## 🚀 Cómo usar

1. Descarga o clona el proyecto.
2. Abre `index.html` directamente en tu navegador (no requiere servidor).
3. Todos los datos son en memoria; para persistencia conecta un backend o usa `localStorage`.

## 🧩 Módulos

| Módulo        | Descripción                                              |
|---------------|----------------------------------------------------------|
| Dashboard     | KPIs en tiempo real, categorías, movimientos recientes   |
| Inventario    | CRUD completo de productos con filtros y estados         |
| Movimientos   | Registro de entradas, salidas, ajustes y traslados       |
| Proveedores   | Gestión de proveedores con activación/desactivación      |
| Ubicaciones   | Mapa visual de estantes/bodegas con ocupación            |
| Alertas       | Lista de productos con stock bajo o agotado              |
| Reportes      | Valor por categoría y productos más activos              |

## ⚙️ Personalización

- **Categorías**: Edita `CAT_COLORS` en `js/utils.js`.
- **Datos iniciales**: Modifica los arrays en `js/data.js`.
- **Estilos**: Ajusta variables de color en `css/styles.css`.

## 🛠️ Tecnologías

- HTML5 / CSS3 / JavaScript vanilla (sin frameworks)
- [Tabler Icons](https://tabler.io/icons) via CDN

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Sin dependencias de servidor ni instalación
