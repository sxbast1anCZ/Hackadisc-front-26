# Diseño: Réplica del dashboard (UI shell + mock data)

## Contexto

El proyecto ya tiene el scaffold de Next.js 16 ([[2026-08-04-nextjs-scaffold-design.md]]) y
la paleta de marca azul-insecap ([[2026-08-04-color-palette-design.md]]), pero ningún layout
ni componente de dashboard todavía. El backend FastAPI con los modelos predictivos aún no
existe, así que esta tarea cubre **solo la capa visual** del dashboard: sidebar, header,
tarjetas de KPI, gráfico y paneles laterales, con datos de ejemplo (mock) locales.

El punto de partida visual es un mockup de UI8 (dashboard de Tran Mau Tri Tam) que el
usuario compartió como referencia de estilo: sidebar de iconos a la izquierda, header con
buscador y acciones, overview con dos KPIs y un banner de nuevos clientes, gráfico de
barras "Product view", y una columna derecha con "Popular products" y "Comments".

## Alcance

- Estructura de carpetas y componentes reutilizables (`components/ui`, `components/layout`)
  y específicos del dashboard (`features/dashboard`).
- Réplica visual del layout del mockup, adaptado a la paleta azul-insecap en vez de los
  colores originales (negro/verde) del mockup.
- Datos 100% mock, locales al proyecto, sin llamadas a red.
- Gráfico de barras con Recharts.
- Avatares y thumbnails de producto como bloques de iniciales/color (sin imágenes externas
  ni servicios de terceros).

### Fuera de alcance

- La barra de presentación de UI8 ("Tran Mau Tri Tam for UI8", Follow, Get in touch) — es
  empaque del marketplace, no del dashboard.
- Rutas funcionales para los demás ítems del sidebar (Products, Customers, Shop, Income,
  Promote) — quedan como visuales, no navegables.
- Toggle de tema claro/oscuro — el proyecto es light-only, no se incluye el control.
- Menús desplegables funcionales ("Last month", "Last 7 days") — se muestran como botones
  con chevron, sin abrir opciones (no hay otro periodo con datos reales aún).
- Drawer/sidebar responsive para mobile — el layout es desktop-first (caso de uso: demo de
  hackathon en laptop). Se apila en pantallas chicas pero el sidebar no colapsa a drawer.
- Tests automatizados.
- Conexión a la API FastAPI (se reemplazará el mock más adelante).

## Estructura de carpetas

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # renderiza <DashboardShell>
│   └── globals.css
├── components/
│   ├── ui/                          # primitivos compartidos, sin conocimiento del dashboard
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx               # iniciales sobre color de fondo
│   │   ├── Badge.tsx                # delta +/-, estados Active/Offline
│   │   ├── IconButton.tsx
│   │   └── Button.tsx
│   └── layout/                      # chrome de la app
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── DashboardShell.tsx       # compone Sidebar + Header + children
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── OverviewCard.tsx
│       │   ├── StatBlock.tsx
│       │   ├── NewCustomersBanner.tsx
│       │   ├── ProductViewChart.tsx
│       │   ├── PopularProductsCard.tsx
│       │   └── CommentsCard.tsx
│       ├── data/
│       │   └── mock.ts              # clientes, balance, serie del gráfico, productos, comentarios
│       └── types.ts
└── lib/
    ├── utils.ts                     # cn(), formatCurrency, formatNumber
    └── nav-items.ts                 # config del sidebar (icon, label, id)
```

Principio de la separación `components/` vs `features/`: `components/ui` y
`components/layout` no saben nada del dominio "dashboard" — son reutilizables en cualquier
pantalla futura. `features/dashboard` contiene todo lo específico de esta pantalla,
incluyendo los datos mock, de forma que cuando exista la API FastAPI solo haya que
reemplazar `features/dashboard/data/mock.ts` por llamadas reales (o un hook de fetching),
sin tocar los componentes visuales.

## Componentes

Mapeo directo a las secciones del mockup:

- **Sidebar** (`components/layout/Sidebar.tsx`): logo, lista de nav desde
  `lib/nav-items.ts` con iconos de `lucide-react` (`LayoutGrid`, `Package`, `Users`,
  `Store`, `TrendingUp`, `Megaphone`). Solo "Dashboard" tiene link real a `/` y estado
  activo; el resto son botones visuales sin navegación. Sin toggle de tema.
- **Header** (`components/layout/Header.tsx`): título de página, input de búsqueda,
  botón "Create" (pill, fondo `azul-insecap-500`), botón de notificaciones, botón de chat,
  `Avatar` del usuario.
- **OverviewCard** (`features/dashboard/components/OverviewCard.tsx`): título "Overview" +
  botón "Last month" (visual, con chevron, sin menú funcional); contiene dos
  `StatBlock` (Customers, Balance) y el `NewCustomersBanner`.
- **StatBlock** (`features/dashboard/components/StatBlock.tsx`): ícono, label, valor
  grande, `Badge` de delta (verde para positivo, rojo para negativo — colores semánticos
  estándar de Tailwind, no forman parte de la paleta de marca).
- **NewCustomersBanner**: texto + fila de `Avatar`s (iniciales) + botón circular "View all".
- **ProductViewChart** (`features/dashboard/components/ProductViewChart.tsx`): gráfico de
  barras con Recharts; la barra destacada usa `azul-insecap-500` y muestra un tooltip
  fijo tipo "2.2m"; valor grande "$10.2m" debajo, a la izquierda.
- **PopularProductsCard**: lista de 5 productos, cada uno con thumbnail (bloque de color +
  inicial, mismo patrón visual que `Avatar`), nombre, precio, `Badge` de estado
  (Active/Offline); botón "All products" al final.
- **CommentsCard**: lista de comentarios, cada uno con `Avatar`, "Autor on Producto",
  timestamp y texto del comentario.

## Datos

Todo en `features/dashboard/data/mock.ts`, tipado en `features/dashboard/types.ts`:
lista de clientes recientes, KPIs de overview (customers, balance, deltas), serie de datos
del gráfico de 7 días, lista de productos populares, lista de comentarios. Sin llamadas de
red — son constantes exportadas que los componentes (Server Components) consumen
directamente vía import.

## Estilo y responsive

- Fondo `--background`, tarjetas blancas (`bg-white`) con borde sutil (`border-black/5` o
  similar) y esquinas redondeadas grandes, siguiendo el estilo del mockup.
- Acentos de marca (`azul-insecap-500/400/300`) reemplazan los acentos negro/verde del
  mockup: botón "Create", nav activo del sidebar, barra destacada del gráfico.
- Colores semánticos (verde/rojo de badges de delta y estado) se aplican como utilidades
  puntuales de Tailwind (`text-emerald-600`, `text-rose-600`, etc.) sin agregarlos a
  `globals.css` — no se decidió aún una paleta semántica formal para KPIs
  ([[2026-08-04-color-palette-design.md]] los dejó fuera de alcance).
- Layout desktop-first: grid principal `lg:grid-cols-[1fr_360px]` que se apila a una
  columna en pantallas angostas; el sidebar permanece fijo a la izquierda (sin colapso a
  drawer en mobile).

## Dependencias nuevas

- `recharts` — gráfico de barras.
- `lucide-react` — iconografía.

Ambas se agregan a `package.json` en la fase de implementación.
