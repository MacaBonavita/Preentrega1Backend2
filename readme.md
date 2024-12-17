# Guitar Store - Backend 2 (Entrega 4)

## Descripción del Proyecto

Este proyecto es la continuación y cuarta entrega del curso de Backend, ahora para Backend 2. Guitar Store es una aplicación de comercio electrónico especializada en instrumentos musicales, específicamente guitarras. Esta versión incorpora funcionalidades avanzadas de autenticación, manejo de sesiones y gestión de carritos de compra.

## Características Principales

1. **Modelo de Usuario Mejorado**:
   - Campos: `first_name`, `last_name`, `email`, `age`, `password`, `cart`, `role`.
   - Generación automática de carrito al registrarse.

2. **Seguridad Mejorada**:
   - Encriptación de contraseñas utilizando bcrypt.

3. **Autenticación Avanzada**:
   - Implementación de estrategias de Passport.
   - Sistema de login con JWT (JSON Web Tokens).

4. **Manejo de Sesiones**:
   - Estrategia "current" para extraer y validar tokens de cookies.
   - Rutas separadas para validación de usuarios en web y API.

5. **Gestión de Carritos**:
   - Modelo de carrito con campos `id` y `productos`.
   - Funcionalidades para agregar, eliminar y obtener productos del carrito de un usuario.

## Endpoints

### Sesiones y Autenticación

- `POST /api/sessions/register`: Registro de nuevos usuarios.
- `POST /api/sessions/login`: Inicio de sesión.
- `POST /api/sessions/logout`: Cierre de sesión.
- `GET /api/sessions/current`: Obtener información del usuario actual (versión web).
- `GET /api/sessions/current-api`: Obtener información del usuario actual (para Postman, requiere bearer token).

### Carritos

- `GET /api/carts/:cid`: Obtener un carrito específico (requiere bearer token).
- `GET /api/carts`: Listar todos los carritos (requiere bearer token).
- `DELETE /api/carts/:cid`: Eliminar un carrito (requiere bearer token).
- `POST /api/carts/:cid/products/:pid`: Agregar un producto a un carrito (requiere bearer token).
- `DELETE /api/carts/:cid/products/:pid`: Eliminar un producto de un carrito (requiere bearer token).

### Productos

- `GET /api/products`: Listar todos los productos.
- `GET /api/products/:pid`: Obtener un producto específico.
- `PUT /api/products/:pid`: Actualizar un producto (requiere bearer token).

### Usuarios

- `DELETE /api/users/`: Eliminar un usuario (requiere bearer token).

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB con Mongoose
- Passport.js
- JWT para autenticación
- bcrypt para encriptación
- Handlebars para vistas
- Socket.io para comunicación en tiempo real
- dotenv para manejo de variables de entorno
- cookie-parser para manejo de cookies
- express-session para manejo de sesiones

## Instalación y Configuración

1. Clonar el repositorio
2. Instalar dependencias
3. Configurar variables de entorno:
    Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
        MONGODB_URI=tu_uri_de_mongodb
        JWT_SECRET=tu_secreto_jwt
        SESSION_SECRET=tu_secreto_de_sesion
        PORT=8080
4. Iniciar el servidor:
    npm run dev

## Uso

Una vez iniciado el servidor, puedes acceder a la aplicación web a través de `http://localhost:8080`. 

Para pruebas con Postman:
- Usa `http://localhost:8080/api/sessions/current-api` para obtener información del usuario actual.
- Para endpoints que requieren autenticación, incluye el bearer token en el header de la solicitud.

## Contribución

Si deseas contribuir al proyecto, por favor:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu feature (`git checkout -b feature/AmazingFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

