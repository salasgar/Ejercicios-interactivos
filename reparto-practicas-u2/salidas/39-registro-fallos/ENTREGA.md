# Entrega · Tarea 39 · Registro de cada fallo y sección «Fallos, uno a uno» del panel

Sesión: s-20261016T050222-d0960de2 · Commits: 0a96ea4 (firestore.rules), 45b1125 (código, tests y docs), 90be2b0 y 8b5aaae (dos retoques del panel)

## Decisión de Juan Luis (16-10-2026, 05:0xZ)
Un documento por fallo en la colección `fallos` (opción a). Regla publicada por él a las 05:25Z.

## Ficheros
- firestore.rules: bloque `match /fallos/{id}` (el alumno solo crea, con id, campos y tamaños fijados; lee solo el profesor).
- practicas/_comun/registro.js (nuevo): qué se guarda (`datosFallo`, `LIMITES`), texto plano del feedback, cola del navegador con reintento sin duplicar, lectura del panel con el token del profesor, `DESTREZAS` (práctica → destrezas del §7).
- practicas/_comun/base.js: `api.responder` admite `error` y `respuesta` opcionales y registra cada fallo sin esperar; al entrar manda los pendientes.
- practicas/plantilla/practica.js (comentarios del contrato), practicas/profesor.{html,js} (sección 3), practicas/resultados.js (`agruparFallos`), tests/practicas-registro.test.js (9 tests), docs/practicas-unidad2.md, README.md.

## Cómo provocar tres fallos y verlos (1 minuto)
1. `https://salasgar.github.io/Ejercicios-interactivos/practicas/recta/?c=KTFN&ejercicio=3` (código de prueba, n.º 61): contesta mal dos frases.
2. `…/practicas/semaforo/?c=KTFN&ejercicio=1`: marca un criterio que no se cumple y «Comprobar».
3. Panel → sección «3. Fallos, uno a uno» → «Cargar fallos» → en «Alumno» elige «61 (KTFN)» (con la lista escrita, si no se elige, solo cuentan los de la lista). Salen dos grupos (recta 3: 2 veces; semáforo 1: 1) con el ítem y la explicación, y «Descargar los fallos (CSV)» da una fila por fallo con las destrezas.
