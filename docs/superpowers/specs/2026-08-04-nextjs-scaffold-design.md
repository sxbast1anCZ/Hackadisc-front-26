# Diseño: Scaffold inicial de Next.js para el frontend del dashboard (Hackathon)

## Contexto

Este proyecto será el frontend visual de un dashboard (KPIs, gráficos, etc.) para un
proyecto de hackathon. Se conectará más adelante a un backend en FastAPI que expone
modelos predictivos aún no definidos. Esta tarea cubre **únicamente** la inicialización
del proyecto Next.js; el layout del dashboard, los componentes de KPI/gráficos y la
integración con la API se abordarán en tareas posteriores, una vez que el backend esté
más definido.

## Alcance

- Inicializar un proyecto Next.js nuevo con `create-next-app`.
- Ninguna lógica de negocio, componente de dashboard, dato mock ni llamada a API en
  esta tarea.

## Versión y compatibilidad

- **Next.js 16.3.0** (última versión estable al momento de este diseño).
- Requiere Node.js ≥20.9.0. La máquina de desarrollo tiene Node v22.18.0 (LTS activa),
  por lo tanto no se requiere cambiar de versión de Node.
- Bundler: Turbopack (default en Next 16).
- Router: App Router (Pages Router está deprecado para proyectos nuevos, no se
  considera).

## Configuración del scaffold

Ejecutado vía `create-next-app` con las siguientes opciones:

- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Linting:** ESLint
- **Estructura de carpetas:** con directorio `src/`
- **Alias de imports:** `@/*` (default)
- **Package manager:** npm
- **Git:** se deja que `create-next-app` inicialice el repositorio git y haga el commit
  inicial (el directorio no era un repo git previamente)

## Estructura resultante

```
Hackadisc-front-26/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── .gitignore
```

## Fuera de alcance

- Layout del dashboard (sidebar/navbar).
- Componentes de KPI y librería de gráficos.
- Conexión con la API FastAPI.
- Manejo de estado/datos (mock o real).

Estos puntos se definirán en un diseño e implementación separados cuando haya más
claridad sobre el backend y los modelos predictivos.
