# Paleta de Colores Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar los colores por defecto del scaffold de Next.js por la paleta de marca (fondo `#f9fafa`, azules `azul-insecap-300/400/500`) y eliminar el dark mode automático, dejando la app en un único tema claro.

**Architecture:** Cambio de configuración puro en `src/app/globals.css`. Los tokens se declaran como CSS custom properties en `:root` y se exponen a Tailwind CSS v4 mediante el bloque `@theme inline` ya existente, lo que genera automáticamente utilidades (`bg-*`, `text-*`, `border-*`) para cada token. No se toca lógica de componentes ni JSX.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (`@tailwindcss/postcss`), CSS custom properties.

## Global Constraints

- Fondo global fijo: `#f9fafa`, sin variante oscura (spec: [[2026-08-04-color-palette-design.md]]).
- Texto principal (`foreground`): `#171717` (valor por defecto del scaffold, sin cambios).
- Acento de marca `azul-insecap-500`: `#369fdb`.
- Acento de transición `azul-insecap-400`: `#77a6f9`.
- Acento claro `azul-insecap-300`: `#69cdfa`.
- Nombre de la paleta: `azul-insecap` (no `accent`, no sobrescribe el `blue` nativo de Tailwind).
- Fuera de alcance: colores semánticos (éxito/error/advertencia), dark mode, aplicación a componentes del dashboard (aún no existen).

---

### Task 1: Reemplazar tokens de color en `globals.css` y eliminar dark mode

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produce (para tareas futuras del dashboard): utilidades Tailwind `bg-background`, `bg-foreground`/`text-foreground`, `bg-azul-insecap-300`, `bg-azul-insecap-400`, `bg-azul-insecap-500` (y sus variantes `text-*`, `border-*`), generadas automáticamente por Tailwind v4 a partir de `--color-*` en `@theme inline`.

- [ ] **Step 1: Reemplazar el contenido de `globals.css`**

Contenido actual (referencia, para ubicar el diff):

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

Reemplazar por:

```css
@import "tailwindcss";

:root {
  --background: #f9fafa;
  --foreground: #171717;
  --azul-insecap-300: #69cdfa;
  --azul-insecap-400: #77a6f9;
  --azul-insecap-500: #369fdb;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-azul-insecap-300: var(--azul-insecap-300);
  --color-azul-insecap-400: var(--azul-insecap-400);
  --color-azul-insecap-500: var(--azul-insecap-500);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

Cambios clave respecto al original:
- `--background` pasa de `#ffffff` a `#f9fafa`.
- Se agregan `--azul-insecap-300/400/500` en `:root` y su exposición en `@theme inline` como `--color-azul-insecap-300/400/500`.
- Se elimina por completo el bloque `@media (prefers-color-scheme: dark) { ... }` (app light-only).
- `--foreground` y el resto del archivo quedan sin cambios.

- [ ] **Step 2: Verificar lint**

Run: `npm run lint`
Expected: sin errores (el archivo modificado es CSS, este comando valida que no se haya roto nada en el resto del proyecto).

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build exitoso (`Compiled successfully`). Esto confirma que Tailwind v4 procesa el bloque `@theme inline` con los nuevos tokens sin errores de sintaxis.

- [ ] **Step 4: Confirmar que los valores compilados están presentes**

Run (bash):
```bash
grep -r "369fdb\|69cdfa\|77a6f9\|f9fafa" .next/static/css/*.css
```
Expected: al menos una coincidencia por cada uno de los 4 valores hex, confirmando que las CSS custom properties llegaron al CSS final compilado.

Nota: las clases de utilidad (`bg-azul-insecap-500`, etc.) sólo aparecen en el CSS compilado cuando se usan en algún componente JSX (comportamiento JIT de Tailwind v4). Como esta tarea no aplica la paleta a componentes (fuera de alcance, ver spec), es normal que `grep -r "azul-insecap-500" .next/static/css/*.css` no encuentre la clase de utilidad todavía — sólo las variables CSS. Esto se verificará naturalmente cuando se construyan los componentes del dashboard.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: aplica paleta de colores azul-insecap y quita dark mode"
```
