/**
 * Capa de acceso a servicios para el catálogo.
 * En modo público usa un servicio simulado (JSON por HTTP).
 * Al definir VITE_API_URL consulta la API de Spring Boot.
 */
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
const PRODUCTOS_URL = API_URL
  ? `${API_URL}/api/productos`
  : `${import.meta.env.BASE_URL}data/productos.json`;

export async function obtenerProductos({ signal } = {}) {
  const respuesta = await fetch(PRODUCTOS_URL, { signal });
  if (!respuesta.ok) {
    throw new Error(`El servicio respondió con HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  if (!Array.isArray(datos)) throw new Error('Formato inesperado del catálogo');
  return datos.map((producto) => {
    if (!Number.isInteger(producto.id) || typeof producto.nombre !== 'string' ||
        typeof producto.precio !== 'number' || producto.precio < 0 ||
        typeof producto.categoria !== 'string') {
      throw new Error('El servicio devolvió un producto inválido');
    }
    return producto;
  });
}

export async function obtenerProductoPorId(id, opciones = {}) {
  const productos = await obtenerProductos(opciones);
  return productos.find((producto) => producto.id === Number(id)) ?? null;
}

export const modoServicio = API_URL ? 'API REST Spring Boot' : 'Servicio HTTP simulado (JSON)';
