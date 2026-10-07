# Entrega de la tarea 01 · Base común, panel único del profesor y práctica de plantilla

Sesión: `s-20261007T192646-341f1b98` · Commit del código: `914d5b0`

## Ficheros entregados

- `practicas/_comun/`: `catalogo.js`, `rng.js`, `codigos.js`, `contador.js`, `aritmetica.js`,
  `textos.js`, `base.js`, `piezas.js` (añadido: no estaba en la ficha) y `estilos.css`.
- `practicas/index.html` + `practicas/portada.js` (portada).
- `practicas/profesor.html` + `practicas/profesor.js` + `practicas/resultados.js` (panel único).
- `practicas/plantilla/`: `index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`.
- `tests/practicas-comun.test.js` (35 tests).
- `firestore.rules` (regla de `practicas`), `src/firebase.js` (`datos.listarPracticas()`),
  `README.md` (apartado «Prácticas de la unidad 2»).

## URL locales (`npm run servir`)

- Portada: http://localhost:8080/practicas/
- Plantilla: http://localhost:8080/practicas/plantilla/
- Panel: http://localhost:8080/practicas/profesor.html

## Qué ejercicios tiene la plantilla

No cubre destrezas del inventario por sí misma: es el ejemplo del contrato.

1. **¿Primo o compuesto?** (patrón *elegir*, dos botones `.si-no`). Números del 2 al 150,
   con muchos compuestos que parecen primos (51, 57, 91, 119…). Feedback con los números
   del ítem: «93 = 3 · 31. Fíjate: la suma de sus cifras es 9 + 3 = 12, que es múltiplo de 3».
2. **Factorización** (patrón *construir*, contadores −/+ de exponentes y «Comprobar», con
   `introduccion`, `inicial: 10`, `penalizacion: 2`). Incluye 242, 286, 338 y 363.

## Cómo probarlo en un minuto

1. `node --test tests/practicas-comun.test.js` → 35 en verde.
2. `npm run servir` y abre http://localhost:8080/practicas/plantilla/?c=SF3A (SF3A es el
   código del alumno 1). Haz un ítem bien y otro mal de cada ejercicio; cambia ES/EN.
3. Para ver el código de resultado sin hacer 30 ítems, en la consola del navegador:
   `localStorage.setItem('practicas.v1.plantilla.SF3A', JSON.stringify({ ej: [{ pendientes: 1 }, { pendientes: 1 }] }))`
   y recarga. Termina los dos ejercicios, copia el código de 16 caracteres y pégalo en
   http://localhost:8080/practicas/profesor.html: lo atribuye al alumno 1 y a «Práctica de
   plantilla».

## Pendiente del usuario

**Publicar las reglas de Firestore** (`firestore.rules`): consola de Firebase → Firestore →
Reglas → Publicar, o `npx firebase-tools deploy --only firestore:rules`. Hasta entonces el
guardado en la nube de las prácticas falla en silencio (el código de resultado y el
guardado en el navegador funcionan igual).
