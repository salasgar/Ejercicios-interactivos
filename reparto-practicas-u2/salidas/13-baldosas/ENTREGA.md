# Entrega — Tarea 13, Baldosas y cuerdas

Commit: `7f427aa`

## Ficheros

- `practicas/baldosas/{index.html,practica.js,logica.js,textos.js,estilos.css}`
- `tests/practicas-baldosas.test.js`

## Qué tiene

Tres ejercicios, todos con el patrón CONSTRUIR (sin elecciones, con dibujo):

1. **La baldosa más grande**: candidatos (hasta 8 lados) sobre un rectángulo a × b
   (12-90, a ≠ b, m.c.d. ≥ 2); al elegir un lado se dibuja la cuadrícula en un
   `<svg>` con `<pattern>` (nunca celda a celda) y se marca en rayado la parte que
   no cabe. Botón «Esta es la más grande»; acierto si el lado es el m.c.d. Si
   a o b pasa de 50, la explicación usa la factorización (`htmlFact`).
2. **¿Cuántas baldosas?**: mismo tipo de rectángulo, ya cubierto con la baldosa de
   lado g (acotado a ≤ 72 baldosas para que quepa en el móvil); entrada numérica;
   feedback distinto si la respuesta es la suma de los dos lados o el propio lado.
3. **Cuerdas**: dos (70 %) o tres cuerdas con m.c.d. ≥ 3; barras proporcionales con
   marcas cada unidad (fondo repetido, no un div por raya); dos preguntas en dos
   pasos (longitud del trozo, después número total) resueltas con una sola llamada
   a `responder`; al acertar a) se ven los cortes en el dibujo.

## Destrezas cubiertas

U2-4A-04, U2-4A-03, U2-4A-07, U2-3A-01, U2-2A-02 (ver la ficha de la tarea).

## Cómo probarlo en 1 minuto

```
npm run servir
```
`http://localhost:8080/practicas/baldosas/?c=SF3A` (código de prueba del alumno 0).
Prueba cada ejercicio una vez acertando y una vez fallando, en español e inglés
(botones ES/EN de la cabecera), y en una ventana de 375 px.

## Trampa encontrada (no mía, no bloquea)

Durante la prueba en el navegador, la tarea 35 tenía reclamo vivo sobre
`practicas/_comun/base.js` y `tests/practicas-comun.test.js`: un `npm test`
completo falla hoy por los valores de `contador` a medio cambiar (no es un
fallo de esta tarea). Con `node --test tests/practicas-comun.test.js
tests/practicas-baldosas.test.js` aislado, sí pasaba limpio antes de que la 35
reclamara esos ficheros. `node --test tests/practicas-baldosas.test.js` solo,
en verde (7/7).

## Petición a la tarea 18

Poner `disponible: true` en `practicas/_comun/catalogo.js` para `baldosas`
(id 12) cuando cierre.

## Propuestas pendientes

Ninguna que cambie el contrato.

## Reabierta (2026-10-08, sesión s-20261008T181518-7bafe7d1) — commit `fa3c9265`

Corregidos los siete puntos de `hechos/reabiertas/13--s-20261008T051928-1cba9950.md`: (1) introducción del ejercicio 2 con el ejemplo 40 dm por 56 dm, lado 8, sin letras; (2) mensaje de «no cabe en ninguno» sin duplicar; (3) «7 filas de 5» coherente con el dibujo; (4) «7 no vale: 40 : 7 = 5, sobran 5 dm…» con los números; (5) si el alumno falla el trozo pero suma bien con el suyo, se le dice que la suma está bien; (6) ids de `<pattern>` únicos por dibujo; (7) «tiles of side 8». No tocada la decisión pendiente de «×» en «Suelo de 40 × 56 dm».
