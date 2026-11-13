
import { useEffect, useState } from 'react';
import './App.css';
import { obtenerProductos, modoServicio } from './services/productosService';
import { cargarCarrito, guardarCarrito, calcularResumen } from './services/carritoService';

// CATEGORÍAS DE LA TIENDA
const categorias = [
  {
    nombre: 'Laptops',
    imagen: '/img/categoria-laptops.png',
    descripcion: 'Equipos para estudiar, trabajar y jugar.',
  },
  {
    nombre: 'Smartphones',
    imagen: '/img/smartphones categtoria.jpg',
    descripcion: 'Innovación y conectividad en tus manos.',
  },
  {
    nombre: 'Audífonos',
    imagen: '/img/CATEGORIA AUDIFONOS.jpg',
    descripcion: 'Disfruta tu música con comodidad.',
  },
];

const formatoPrecio = (precio) =>
  `S/ ${precio.toLocaleString('es-PE')}`;

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');
  const [intento, setIntento] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [carritoInicializado, setCarritoInicializado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // DATOS DEL FORMULARIO
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    mensaje: '',
  });
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  // Consumo HTTP del servicio: estados de carga, error y reintento.
  useEffect(() => {
    const controller = new AbortController();
    obtenerProductos({ signal: controller.signal })
      .then((datos) => {
        setProductos(datos);
        setErrorProductos('');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setErrorProductos(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, [intento]);

  // Combinar el carrito almacenado con los datos oficiales del catálogo.
  useEffect(() => {
    if (cargando || errorProductos || carritoInicializado) return;
    const restaurado = cargarCarrito().flatMap(({ id, cantidad }) => {
      const producto = productos.find((p) => p.id === id);
      return producto ? [{ ...producto, cantidad }] : [];
    });
    setCarrito(restaurado);
    setCarritoInicializado(true);
  }, [productos, cargando, errorProductos, carritoInicializado]);

  useEffect(() => {
    if (carritoInicializado) guardarCarrito(carrito);
  }, [carrito, carritoInicializado]);

  // FILTRAR PRODUCTOS
  const productosFiltrados = productos.filter((producto) =>
    (categoriaActiva === 'Todos' || producto.categoria === categoriaActiva) &&
    producto.nombre.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es'))
  );

  // AGREGAR PRODUCTO
  function agregarAlCarrito(producto) {
    setCarrito((anterior) => {
      const existente = anterior.find(
        (item) => item.id === producto.id
      );

      if (existente) {
        return anterior.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock ?? 99) }
            : item
        );
      }

      return [...anterior, { ...producto, cantidad: 1 }];
    });

    setMensaje(`${producto.nombre} agregado al carrito`);
  }

  // MODIFICAR CANTIDAD
  function cambiarCantidad(id, cambio) {
    setCarrito((anterior) =>
      anterior
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.min(item.cantidad + cambio, item.stock ?? 99) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  // ELIMINAR PRODUCTO
  function eliminarProducto(id) {
    setCarrito((anterior) =>
      anterior.filter((item) => item.id !== id)
    );
    setMensaje('Producto eliminado del carrito');
  }

  // VACIAR CARRITO
  function vaciarCarrito() {
    setCarrito([]);
    setMensaje('El carrito se ha vaciado');
  }

  // CALCULAR CANTIDADES Y TOTAL
  const { cantidad: cantidadCarrito, importe: totalCarrito } = calcularResumen(carrito);

  // MOSTRAR PRODUCTOS DE UNA CATEGORÍA
  function seleccionarCategoria(nombre) {
    setCategoriaActiva(nombre);
    document.getElementById('productos')?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  // ACTUALIZAR DATOS DEL FORMULARIO
  function actualizarFormulario(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
    setFormularioEnviado(false);
  }

  // VALIDAR FORMULARIO DE DEMOSTRACIÓN
  function enviarFormulario(evento) {
    evento.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.correo.trim() ||
      !formulario.mensaje.trim()
    ) {
      return;
    }

    setFormularioEnviado(true);
    setFormulario({
      nombre: '',
      correo: '',
      mensaje: '',
    });
  }

  return (
    <>
      {/* ENCABEZADO */}
      <header className="header">
        <div className="contenedor header-contenido">
          <a href="#inicio" className="marca">
            <img src="/img/Logo.png" alt="Logo de Tienda Tec" />
            <span>TIENDA TEC</span>
          </a>

          <nav className="navegacion" aria-label="Menú principal">
            <a href="#inicio">Inicio</a>
            <a href="#productos">Productos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
            <a href="#carrito">
              🛒 Carrito ({cantidadCarrito})
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* BANNER PRINCIPAL */}
        <section id="inicio" className="hero">
          <div className="contenedor hero-contenido">
            <div className="hero-texto">
              <span className="hero-etiqueta">
                BIENVENIDO A TIENDA TEC
              </span>
              <h1>
                La tecnología que necesitas, al mejor alcance
              </h1>
              <p>
                Descubre nuestra selección de laptops,
                smartphones y audífonos. Encuentra la tecnología
                ideal para estudiar, trabajar y disfrutar.
              </p>
              <a href="#productos" className="boton-principal">
                Explorar productos
              </a>
            </div>

            <div className="hero-imagen">
              <img
                src="/img/banner.png"
                alt="Productos tecnológicos de Tienda Tec"
              />
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section id="categorias" className="seccion-categorias">
          <div className="contenedor">
            <div className="seccion-encabezado">
              <span className="seccion-etiqueta">
                NUESTRO CATÁLOGO
              </span>
              <h2>Explora nuestras categorías</h2>
              <p>
                Encuentra los productos tecnológicos
                que necesitas para tu día a día.
              </p>
            </div>

            <div className="categorias-grid">
              {categorias.map((categoria) => (
                <button
                  type="button"
                  className="categoria-tarjeta"
                  key={categoria.nombre}
                  onClick={() =>
                    seleccionarCategoria(categoria.nombre)
                  }
                >
                  <div className="categoria-imagen">
                    <img
                      src={categoria.imagen}
                      alt={categoria.nombre}
                    />
                  </div>
                  <div className="categoria-info">
                    <h3>{categoria.nombre}</h3>
                    <p>{categoria.descripcion}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CATÁLOGO */}
        <section id="productos" className="seccion-productos">
          <div className="contenedor">
            <div className="seccion-encabezado">
              <span className="seccion-etiqueta">
                TIENDA TEC
              </span>
              <h2>Nuestros productos</h2>
              <p>
                Descubre nuestra selección de tecnología.
              </p>
            </div>

            <div className="filtros-productos">
              {[
                'Todos',
                'Laptops',
                'Smartphones',
                'Audífonos',
              ].map((categoria) => (
                <button
                  type="button"
                  key={categoria}
                  className={
                    categoriaActiva === categoria
                      ? 'filtro activo'
                      : 'filtro'
                  }
                  onClick={() => setCategoriaActiva(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>

            <div className="catalogo-herramientas">
              <label htmlFor="buscar-producto">Buscar producto</label>
              <input id="buscar-producto" type="search" value={busqueda}
                placeholder="Ej. Laptop, Samsung..." onChange={(e) => setBusqueda(e.target.value)} />
              <small>Datos obtenidos de: {modoServicio}</small>
            </div>

            {cargando && <p className="catalogo-estado" role="status">Cargando productos desde el servicio...</p>}
            {errorProductos && <div className="catalogo-estado catalogo-error" role="alert">
              <p>No se pudo consultar el catálogo: {errorProductos}</p>
              <button type="button" onClick={() => { setCargando(true); setErrorProductos(''); setIntento((n) => n + 1); }}>Reintentar consulta</button>
            </div>}
            {!cargando && !errorProductos && productosFiltrados.length === 0 &&
              <p className="catalogo-estado">No encontramos productos con esos filtros.</p>}
            {!cargando && !errorProductos && <div className="productos-grid">
              {productosFiltrados.map((producto) => (
                <article
                  className="producto-tarjeta"
                  key={producto.id}
                >
                  <div className="producto-imagen">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                    />
                  </div>
                  <div className="producto-info">
                    <span className="producto-categoria">
                      {producto.categoria}
                    </span>
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
                    <div className="producto-compra">
                      <strong>
                        {formatoPrecio(producto.precio)}
                      </strong>
                      <button
                        type="button"
                        className="boton-carrito"
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock === 0}
                      >
                        {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>}
          </div>
        </section>

        {/* CARRITO DE COMPRAS */}
        <section id="carrito" className="seccion-carrito">
          <div className="contenedor">
            <div className="seccion-encabezado">
              <span className="seccion-etiqueta">
                TUS COMPRAS
              </span>
              <h2>Mi carrito de compras</h2>
              <p>
                Revisa los productos que has seleccionado.
              </p>
            </div>

            {carrito.length === 0 ? (
              <div className="carrito-vacio">
                <span className="carrito-icono">🛒</span>
                <h3>Tu carrito está vacío</h3>
                <p>
                  Explora nuestro catálogo y agrega
                  tus productos favoritos.
                </p>
                <a
                  href="#productos"
                  className="boton-principal"
                >
                  Ver productos
                </a>
              </div>
            ) : (
              <div className="carrito-contenido">
                <div className="carrito-lista">
                  {carrito.map((item) => (
                    <article
                      className="carrito-item"
                      key={item.id}
                    >
                      <img
                        className="carrito-imagen"
                        src={item.imagen}
                        alt={item.nombre}
                      />

                      <div className="carrito-detalles">
                        <h3>{item.nombre}</h3>
                        <p>{formatoPrecio(item.precio)}</p>

                        <div className="cantidad-control">
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(item.id, -1)
                            }
                            aria-label={`Disminuir cantidad de ${item.nombre}`}
                          >
                            −
                          </button>
                          <span>{item.cantidad}</span>
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(item.id, 1)
                            }
                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="boton-eliminar"
                          onClick={() => eliminarProducto(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>

                      <strong className="item-subtotal">
                        {formatoPrecio(
                          item.precio * item.cantidad
                        )}
                      </strong>
                    </article>
                  ))}
                </div>

                <aside className="resumen-compra">
                  <h3>Resumen de compra</h3>
                  <div className="resumen-fila">
                    <span>Artículos</span>
                    <span>{cantidadCarrito}</span>
                  </div>
                  <div className="resumen-fila resumen-total">
                    <strong>Total</strong>
                    <strong>
                      {formatoPrecio(totalCarrito)}
                    </strong>
                  </div>
                  <p className="resumen-aviso">
                    Carrito demostrativo del proyecto Tienda Tec.
                    No se realizan pagos reales.
                  </p>
                  <button
                    type="button"
                    className="boton-vaciar"
                    onClick={vaciarCarrito}
                  >
                    Vaciar carrito
                  </button>
                </aside>
              </div>
            )}
          </div>
        </section>

        {/* SOBRE NOSOTROS */}
        <section id="nosotros" className="seccion-nosotros">
          <div className="contenedor nosotros-contenido">
            <div className="nosotros-imagen">
              <img
                src="/img/nosotros.jpg"
                alt="Imagen representativa de Tienda Tec"
              />
            </div>

            <div className="nosotros-texto">
              <span className="seccion-etiqueta">
                SOBRE NOSOTROS
              </span>
              <h2>Conoce Tienda Tec</h2>
              <p>
                Tienda Tec es una propuesta de tienda virtual
                especializada en productos tecnológicos,
                desarrollada como proyecto académico.
              </p>
              <p>
                Nuestro objetivo es ofrecer una experiencia
                de compra sencilla, organizada y accesible,
                donde los visitantes puedan explorar laptops,
                smartphones y audífonos.
              </p>
              <h3>Nuestra misión</h3>
              <p>
                Acercar la tecnología a las personas mediante
                una plataforma fácil de utilizar, con información
                clara y un catálogo organizado.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="seccion-contacto">
          <div className="contenedor">
            <div className="seccion-encabezado">
              <span className="seccion-etiqueta">
                CONTÁCTANOS
              </span>
              <h2>¿Tienes alguna consulta?</h2>
              <p>
                Completa el siguiente formulario de demostración.
              </p>
            </div>

            <div className="contacto-contenido">
              <div className="contacto-informacion">
                <h3>Estamos para ayudarte</h3>
                <p>
                  En Tienda Tec buscamos que encuentres
                  fácilmente los productos que necesitas.
                </p>
                <p>
                  Puedes utilizar este formulario para
                  probar cómo funciona una sección de contacto
                  en una aplicación web.
                </p>
                <p className="contacto-nota">
                  Este es un proyecto académico.
                  No se envían mensajes a un correo real.
                </p>
              </div>

              <form
                className="formulario-contacto"
                onSubmit={enviarFormulario}
              >
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={actualizarFormulario}
                  placeholder="Escribe tu nombre"
                  required
                  minLength={2}
                  maxLength={80}
                />

                <label htmlFor="correo">Correo electrónico</label>
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  value={formulario.correo}
                  onChange={actualizarFormulario}
                  placeholder="ejemplo@correo.com"
                  required
                />

                <label htmlFor="mensajeContacto">Mensaje</label>
                <textarea
                  id="mensajeContacto"
                  name="mensaje"
                  value={formulario.mensaje}
                  onChange={actualizarFormulario}
                  placeholder="Escribe tu consulta..."
                  required
                  minLength={5}
                  maxLength={1000}
                  rows={5}
                />

                <button type="submit" className="boton-enviar">
                  Enviar consulta
                </button>

                {formularioEnviado && (
                  <p className="formulario-confirmacion" role="status">
                    ✓ Formulario validado correctamente.
                    Esta es una simulación; no se envió
                    ningún correo electrónico.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        <div className="contenedor footer-contenido">
          <div>
            <h3>TIENDA TEC</h3>
            <p>
              Tu espacio para descubrir tecnología.
            </p>
          </div>
          <div>
            <h3>Enlaces</h3>
            <a href="#inicio">Inicio</a>
            <a href="#productos">Productos</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
          </div>
          <div>
            <h3>Proyecto académico</h3>
            <p>
              Universidad Continental
            </p>
            <p>
              Curso: Programación Web
            </p>
          </div>
        </div>

        <div className="footer-final">
          © 2026 Tienda Tec. Proyecto académico.
        </div>
      </footer>

      {/* NOTIFICACIÓN DEL CARRITO */}
      {mensaje && (
        <div className="mensaje-carrito" role="status">
          <span>✓ {mensaje}</span>
          <button
            type="button"
            onClick={() => setMensaje('')}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default App;
