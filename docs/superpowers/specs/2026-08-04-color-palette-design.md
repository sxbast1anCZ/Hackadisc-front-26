# Diseño: Paleta de colores de la app

## Contexto

El proyecto es el frontend de un dashboard (KPIs, gráficos) para un hackathon
([[2026-08-04-nextjs-scaffold-design.md]]). El scaffold inicial de Next.js trae los
colores por defecto de `create-next-app` (fondo blanco/negro con soporte de dark mode
automático vía `prefers-color-scheme`). Esta tarea define la paleta de marca real que
reemplazará esos valores por defecto.

## Alcance

- Definir y aplicar los tokens de color de marca en `src/app/globals.css`.
- Eliminar el soporte de dark mode automático (la app es light-only).
- No incluye: colores semánticos adicionales (éxito/error/advertencia), ni el diseño
  de componentes del dashboard. Se agregarán en tareas posteriores si son necesarios.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `background` | `#f9fafa` | Fondo global de la app. Único valor, sin variante oscura. |
| `foreground` | `#171717` | Texto principal. Se mantiene el valor por defecto del scaffold; no se definió uno nuevo. |
| `azul-insecap-500` | `#369fdb` | Azul/celeste base — color de acento de marca. Botones, links, elementos interactivos. |
| `azul-insecap-400` | `#77a6f9` | Azul de transición — gradientes, estados hover intermedios. |
| `azul-insecap-300` | `#69cdfa` | Azul/celeste más claro — fondos sutiles, badges, estados suaves. |

`azul-insecap-500` es el tono base/por defecto de la marca. Los otros dos números son
tonos más claros alrededor de él, en el orden en que fueron entregados por el usuario
(no se generan tonos intermedios adicionales que no fueron especificados).

## Implementación

- Los tokens se definen como CSS custom properties en `:root` de `globals.css`.
- Se exponen a Tailwind CSS v4 a través del bloque `@theme inline` ya existente en el
  archivo (`--color-background`, `--color-azul-insecap-300/400/500`), lo que genera
  automáticamente las clases de utilidad de Tailwind (`bg-azul-insecap-500`,
  `text-azul-insecap-300`, `border-azul-insecap-400`, etc.).
- Se elimina el bloque `@media (prefers-color-scheme: dark)` de `globals.css`, ya que
  la app usa un único tema claro.
- No se modifica `--font-sans` / `--font-mono` (Geist), fuera de alcance de esta tarea.

## Fuera de alcance

- Colores semánticos (éxito, error, advertencia, info) para estados de KPIs.
- Modo oscuro.
- Aplicación de la paleta a componentes específicos del dashboard (aún no existen).

Estos puntos se definirán cuando haya más claridad sobre los componentes del
dashboard.
