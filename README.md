# Tienda Tec — Evaluación Parcial de Programación Web

Aplicación React + Vite desarrollada a partir del Producto Académico 1. Proyecto académico demostrativo: **no procesa ventas reales**. Los precios son ficticios.

## Requisitos
- Node.js 20.19+ o 22.12+
- npm

## Ejecutar la interfaz

```bash
npm install
npm run dev
```

Abrir la URL local que indique Vite (habitualmente http://localhost:5173).

Para comprobar el empaquetado: `npm run build`. Para la revisión de calidad: `npm run lint`.

## Arquitectura y consumo del servicio

- `src/App.jsx`: componentes React, eventos y estados de la interfaz.
- `src/services/productosService.js`: **capa de acceso a servicios**, consume datos mediante `fetch`, valida respuesta y gestiona errores.
- `public/data/productos.json`: **servicio simulado a través de HTTP**; permite una demo publicada en Vercel sin base de datos.
- `src/services/carritoService.js`: reglas del carrito, cálculo de totales y persistencia local en el navegador.
- `backend/`: ejemplo de API REST con Java y Spring Boot que separa `controller`, `service`, `repository` y `model`.

**Flujo de datos (demo pública)**: navegador → React → productosService → solicitud HTTP GET /data/productos.json → JSON → React → catálogo.

**Flujo con backend opcional**: navegador → React → productosService → GET http://localhost:8080/api/productos → ProductoController → ProductoService → ProductoRepository → datos en memoria.

Para conectar el frontend al backend local: copiar `.env.example` a `.env.local`, descomentar `VITE_API_URL=http://localhost:8080` y reiniciar Vite.

No se requiere instalar MySQL, Docker ni pagar un servidor para la demo simulada. El backend de ejemplo se usa **solo si lo ejecutas localmente**; publicarlo requiere alojarlo aparte.

## Funciones implementadas
- Secciones: inicio, categorías, catálogo, carrito, nosotros y contacto.
- Catálogo consultado mediante `fetch`, estados de carga y error, botón de reintento.
- Filtros por categoría y búsqueda por nombre.
- Carrito con cantidades, eliminación, vaciado y totales; se conserva en `localStorage`.
- Formulario con validación nativa, simulado: no manda mensajes a correo real.

## Publicación

1. Subir el contenido de `tienda-tec` a un repositorio de GitHub (sin `node_modules`, `dist` ni `.env.local`).
2. Importar ese repositorio en Vercel. Framework: Vite. Build command: `npm run build`; output directory: `dist`.
3. No establecer `VITE_API_URL` en Vercel para usar el JSON simulado incluido en los archivos.
4. Comprobar el catálogo, la búsqueda y el carrito en la URL pública y pegar los enlaces reales en el informe.

## Pendiente para el proyecto final
- Base de datos real y persistencia de productos/pedidos.
- Autenticación y cuentas, seguridad y compra real.
- Publicación de backend, si se desea conectar la API Spring Boot en producción.
