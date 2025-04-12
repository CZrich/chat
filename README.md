# Chat en Tiempo Real con GraphQL

Una aplicación de chat en tiempo real que utiliza GraphQL para comunicación entre cliente y servidor, con soporte para suscripciones en tiempo real mediante WebSockets.

## Tecnologías Utilizadas

### Frontend
- React 19
- Apollo Client para consumo de GraphQL
- React Router para navegación
- TailwindCSS para estilos
- TypeScript para tipado estático
- Vite como bundler y servidor de desarrollo

### Backend
- Node.js con Express como servidor
- Apollo Server para implementación de GraphQL
- GraphQL con soporte para suscripciones en tiempo real
- MongoDB (utilizando Mongoose) como base de datos
- TypeScript para tipado estático

## Requisitos previos

- Node.js (versión recomendada: 18.x o superior)
- MongoDB Atlas cuenta (para la conexión a la base de datos)
- Credenciales de Google OAuth (para la autenticación)

## Instalación y configuración

### Configuración del Backend

1. Navega a la carpeta del servidor:
   ```bash
   cd chat-server
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   MONGO_URI="mongodb+srv://usuario:contraseña@cluster.mongodb.net/?retryWrites=true&w=majority"

   ```

   > **Importante**: Reemplaza los valores por tus propias credenciales. Para MongoDB Atlas, crea un cluster y copia la URL de conexión.

4. Compila el proyecto TypeScript:
   ```bash
   npm run build
   ```

5. Inicia el servidor:
   ```bash
   npm start
   ```

   Para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

### Configuración del Frontend

1. Navega a la carpeta del cliente:
   ```bash
   cd server-client
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Para construcción de producción:
   ```bash
   npm run build
   ```


## Desarrollo

### GraphQL Playground

Una vez que el servidor esté corriendo, puedes acceder al GraphQL Playground en:
```
http://localhost:4000/graphql
```

Aquí podrás probar queries, mutations y suscripciones antes de implementarlas en el frontend.

## Despliegue

### Backend
1. Asegúrate de que el build es correcto: `npm run build`
2. Para producción, configura las variables de entorno en tu plataforma de despliegue
3. Inicia el servidor con `npm start`

### Frontend
1. Construye la aplicación: `npm run build`
2. Despliega el contenido de la carpeta `dist` en tu servidor web estático preferido

Una vez que el servidor esté corriendo, puedes acceder al Chat en:
```
http://localhost:5173
```

## Solución de problemas comunes

- **Error de conexión a MongoDB**: Verifica que la URI de MongoDB en el archivo `.env` sea correcta y que tu IP esté permitida en Atlas o tener un ventana de abierta en tu cluster en tu navegador.
- **Problemas con las suscripciones**: Asegúrate de que WebSockets esté correctamente configurado y que no haya firewalls bloqueando las conexiones.


