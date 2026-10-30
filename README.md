# Sistema de gestión de soporte técnico

Esta es una aplicación web fullstack para registrar, consultar, actualizar y eliminar tickets de soporte técnico. La información se guarda en una base de datos SQLite, por lo que permanece disponible después de cerrar y/o reiniciar la aplicación.

Estudiante: Sebastián González Maturana

Asignatura: Backend y TDD con Node.js

Ingeniería en informática

Instituto Profesional Virginio Gómez

Sede Chillán

Octubre de 2026


## Tecnologías utilizadas

| Capa | Tecnología |
| --- | --- |
| Frontend | Angular 22 (componentes standalone, Router, HttpClient, formularios reactivos, signals) |
| Backend | Node.js + Express |
| Base de datos | SQLite (mediante `better-sqlite3`) |
| Otras | CORS, Git y GitHub |

**¿Por qué SQLite?** Es una base de datos relacional real, que no requiere instalar ni administrar un servidor. Guarda los datos en un único archivo (`backend/tickets.db`), lo que la hace adecuada para el alcance de este proyecto y simple de ejecutar desde el repositorio.

## Ejecución

Se necesitan **dos terminales**.

**Terminal 1: API (puerto 3000)**

```bash
cd backend
npm run dev
```

Debe mostrar: `API corriendo en http://localhost:3000`

**Terminal 2: Angular (puerto 4200)**

```bash
cd frontend
ng serve
```

Luego abrir `http://localhost:4200` en el navegador.

## Estructura general del proyecto

```
sistema-tickets/
├── backend/
│   ├── routes/
│   │   └── tickets.js        # Endpoints REST (GET, POST, PUT, DELETE)
│   ├── db.js                 # Conexión a SQLite y creación de la tabla
│   ├── schema.sql            # Script de creación de la tabla tickets
│   ├── server.js             # Configuración de Express, CORS y manejo de errores
│   └── package.json
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── ticket-list/  # Listado de tickets, eliminación con confirmación
│       │   └── ticket-form/  # Formulario de creación y edición
│       ├── models/
│       │   └── ticket.ts     # Interfaz Ticket
│       ├── services/
│       │   └── ticket.service.ts  # Comunicación HTTP con la API
│       ├── app.routes.ts     # Rutas de la aplicación
│       └── app.config.ts     # Configuración (provideHttpClient, router)
└── README.md
```

### API REST

| Método | Ruta | Descripción | Respuesta exitosa |
| --- | --- | --- | --- |
| GET | `/api/tickets` | Lista todos los tickets | 200 |
| GET | `/api/tickets/:id` | Obtiene un ticket | 200 (404 si no existe) |
| POST | `/api/tickets` | Crea un ticket | 201 (400 si hay datos inválidos) |
| PUT | `/api/tickets/:id` | Actualiza un ticket | 200 (400 / 404) |
| DELETE | `/api/tickets/:id` | Elimina un ticket | 204 (404 si no existe) |

### Modelo de datos

| Campo | Tipo | Descripción |
| --- | --- | --- |
| id | INTEGER (PK, autoincremental) | Identificador único |
| asunto | TEXT | Resumen de la solicitud |
| solicitante | TEXT | Persona que solicita soporte |
| descripcion | TEXT | Detalle del problema |
| categoria | TEXT | Hardware, Software, Red, Cuentas y accesos u Otro |
| prioridad | TEXT | Baja, Media o Alta |
| estado | TEXT | Abierto, En proceso o Cerrado |
| fechaRegistro | TEXT | Fecha y hora de registro (automática) |

## Funcionalidades implementadas

- Listado de tickets obtenidos desde la base de datos.
- Registro de nuevos tickets mediante formulario.
- Visualización de la información almacenada.
- Edición de tickets existentes con persistencia de cambios.
- Eliminación de tickets con confirmación previa.
- Distinción visual de prioridad y estado mediante etiquetas de color.
- Validación de campos obligatorios en el frontend (formularios reactivos) y en el backend.
- Mensajes de error visibles al usuario cuando falla una operación o la API no responde, con botón para reintentar.
- Persistencia real: los datos se mantienen al recargar Angular y al reiniciar la API.
- Consultas SQL parametrizadas (uso de `?`) para evitar inyección SQL.

## Pruebas realizadas

| Prueba | Procedimiento | Resultado |
| --- | --- | --- |
| Inicio | Levantar API y Angular siguiendo este README | Correcto |
| GET | Abrir la aplicación y ver los tickets guardados | Correcto |
| POST | Crear un ticket desde el formulario de Angular | Correcto: aparece en la lista y persiste |
| PUT | Editar un ticket (ej. estado a "Cerrado") y recargar con F5 | Correcto: el cambio se mantiene |
| DELETE | Eliminar un ticket aceptando la confirmación | Correcto: desaparece de la interfaz y de la base |
| Validación | Intentar guardar el formulario vacío | Correcto: marca los campos y no envía nada |
| Error | Apagar la API e intentar operar desde Angular | Correcto: se muestra mensaje de error |
| Persistencia | Detener y reiniciar la API, luego recargar Angular | Correcto: los tickets siguen disponibles |

## Declaración de uso de inteligencia artificial generativa

Este proyecto fue desarrollado con la ayuda de Claude Code.
