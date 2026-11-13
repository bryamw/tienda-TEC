// Reglas de negocio y persistencia local del carrito demostrativo.
const CLAVE = 'tiendaTecCarrito';

export function cargarCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    if (!Array.isArray(datos)) return [];
    return datos.filter((item) => Number.isInteger(item.id) &&
      Number.isInteger(item.cantidad) && item.cantidad > 0 && item.cantidad <= 99);
  } catch {
    return [];
  }
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE, JSON.stringify(carrito.map(({ id, cantidad }) => ({ id, cantidad }))));
}

export function calcularResumen(carrito) {
  return carrito.reduce((total, item) => ({
    cantidad: total.cantidad + item.cantidad,
    importe: total.importe + item.precio * item.cantidad,
  }), { cantidad: 0, importe: 0 });
}
