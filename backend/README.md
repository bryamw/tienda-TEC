# Backend opcional — Spring Boot

Arquitectura: `controller` (recibe peticiones HTTP) → `service` (validaciones y reglas) → `repository` (datos simulados en memoria) → `model` (datos de Producto).

Requisitos: Java 17+ y Maven 3.9+. Desde esta carpeta ejecutar `mvn spring-boot:run`.

Endpoints: `GET http://localhost:8080/api/productos`, `GET /api/productos?categoria=Laptops`, `GET /api/productos/1`.

Para conectar React, definir `VITE_API_URL=http://localhost:8080` en `tienda-tec/.env.local` y reiniciar Vite. No se requiere MySQL para este avance; **el backend no está publicado**.
