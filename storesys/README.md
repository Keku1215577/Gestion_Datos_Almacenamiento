# StoreSys — Sistema de Gestión de Almacenamiento

Aplicación web de gestión de inventario y almacenamiento desarrollada con HTML, CSS y JavaScript vanilla.

## Objetivo

Centralizar información operativa de inventario para consultar existencias, movimientos, proveedores, ubicaciones, alertas y reportes desde una interfaz única.

## Funcionalidades

| Módulo | Propósito |
|---|---|
| Dashboard | KPIs y resumen operativo |
| Inventario | Gestión de productos, filtros y estados |
| Movimientos | Entradas, salidas, ajustes y traslados |
| Proveedores | Gestión y estado de proveedores |
| Ubicaciones | Visualización de estantes y bodegas |
| Alertas | Identificación de stock bajo o agotado |
| Reportes | Resúmenes por categoría y actividad |

## Arquitectura

```text
storesys/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── data.js
    ├── utils.js
    ├── modals.js
    ├── app.js
    └── pages/
        ├── dashboard.js
        ├── inventory.js
        ├── movements.js
        ├── suppliers.js
        ├── locations.js
        ├── alerts.js
        └── reports.js
```

## Tecnologías

- HTML5
- CSS3
- JavaScript ES6+
- Tabler Icons mediante CDN

## Datos

La versión actual utiliza datos en memoria para fines demostrativos. No depende de un servidor para ejecutarse.

La evolución natural hacia producción sería conectar una API y una base de datos para persistencia, autenticación, auditoría y operaciones multiusuario.

## Ejecución

Abrir `storesys/index.html` en un navegador moderno.

## Relación con mi perfil

Este proyecto demuestra fundamentos útiles para desarrollo de software:

- Organización modular de JavaScript.
- Interfaces orientadas a procesos de negocio.
- CRUD y manejo de estados en el cliente.
- Filtrado y presentación de información.
- Diseño de dashboards y reportes.
- Base para una futura arquitectura frontend + API + base de datos.

## Alcance

Proyecto académico/personal de práctica. Los datos incluidos son demostrativos y la aplicación no pretende representar un sistema de producción.

Autor: Juan Sebastian De la Cruz Amparo
