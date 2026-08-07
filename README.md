# Hackadisc-front-26

Dashboard de HackaDisc 2026 (Insecap). Next 16 + Tailwind + recharts, contra la
API de `Hackadisc-back-26`.

**No hay datos de ejemplo.** Todo lo que se ve viene de la API; si un número no
está en la respuesta, no se muestra. El front no calcula ningún KPI.

## Arrancar

Primero el backend (ver `Hackadisc-back-26/README.md`), después:

```bash
npm install
npm run dev          # http://localhost:3000
```

La URL de la API sale de `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).

> **Windows:** `next build` falla con `InvariantError: Expected workStore to be
> initialized` si se corre desde una ruta con el casing distinto al real
> (`C:\Users\...\documents\github\...` en vez de `Documents\GitHub`). Next resuelve
> los módulos con dos casings y termina cargando dos instancias del mismo módulo.
> `cd` a la ruta con las mayúsculas correctas antes de compilar. `npm run dev` no
> se ve afectado.

## Rutas

| Ruta | Qué muestra |
|---|---|
| `/` | Vista gerencial: proyección, pipeline, valor perdido, mora, tracker mes a mes, scorecard, conversión por ejecutivo, cobranza, riesgo de clientes |
| `/ejecutivo/[vendedor]` | Vista personal: su proyección, avance vs. su meta ponderada, conversión con IC contra el equipo, cobranza, pendientes de facturar |
| `/clientes/[id]` | Drill-down: los 4 ejes de riesgo, diagnóstico, historia de compra, operaciones en mora |

## Decisiones de visualización que no son estéticas

Cada una viene de una decisión ya tomada con evidencia en los documentos de
modelado (`08_Vistas_Gerencial_y_Ejecutivo.md` §6). Cambiarlas sin leer eso
deshace con CSS lo que el modelo corrigió con datos:

- **La proyección individual se ve distinta según el ejecutivo.** Los que tienen
  R² negativo muestran un rango gris punteado sin punto central y con nota
  explícita. Si todos se vieran igual, el diseño transmitiría una confianza que
  los datos no respaldan. El backend además no emite el punto para ellos.
- **`P(meta)` es un badge neutro, no un semáforo.** El equipo supera la meta hace
  8 meses seguidos: un verde permanente se deja de mirar.
- **Los 4 ejes de riesgo de cliente van en columnas separadas.** Nunca un gauge
  único: la correlación cancelación–mora es ≈ −0,05, son fenómenos distintos.
- **Los estados `"sin ..."` van en gris**, jamás con el color de "bajo riesgo".
  Están en la misma columna pero significan "no sabemos".
- **El scorecard son barras por eje**, no un número compuesto.
- **La conversión lleva su intervalo de confianza dibujado.** Barras que no se
  solapan son diferencia real; el porcentaje solo no lo dice.
- **Los días a facturación son siempre un rango P25–P75**, nunca un día exacto.
- **El roster de ejecutivos se lee de `GET /vendedores`**, nunca se hardcodea: una
  lista copiada a mano ya dejó a una ejecutiva desvinculada en pantalla una vez.
- **El pipeline vencido ($689,8M) va aparte y etiquetado como higiene de datos**,
  nunca sumado al pipeline real.
