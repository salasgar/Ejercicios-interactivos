# Entrega de la tarea 153 · «Problemas con ecuaciones» (`problemas-ecuaciones`, id 77)

Sesión `s-20261109T104503-1eca4331`, 2026-11-09. Commit del código: **`a05628e`**.

## Ficheros
`practicas/problemas-ecuaciones/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-problemas-ecuaciones.test.js` (13 tests; `npm test` 1790/1790).

## Ejercicios y destrezas (ids de la propuesta del 6-11, sin F0)
1. **¿Qué es x?** (U6-4A-01): una buena y tres datos que el enunciado ya da (error `incognita-dato`).
2. **¿Qué ecuación?** (U6-2A-01, 3A-01, 4C-01): cuatro ecuaciones con soluciones distintas (comprobado resolviendo); distractores = errores con nombre.
3. **Resuelve y contesta** (U6-2A-02, 2A-03, 3A-03, 4A-01 a 4A-05, 4A-09): campo de número (dinero con coma o punto); feedback con las cuatro fases; se pide a veces otra cantidad que x (`contestar-x`).
4. **¿Qué pide?** (U6-4A-01, 4A-08): cuatro cantidades del problema; la buena es la pedida.
5. **¿Tiene sentido?** (U6-4A-08): bien / error en la ecuación / error al resolver (siempre con solución absurda de verdad) / «el enunciado está mal» (nunca la buena).

Contextos (9): consecutivos, reparto con «veces», reparto de tres, edades con diferencia, edades dentro de n años (con paréntesis: semana 3 ya dada), entradas (euros), cuadernos (céntimos), perímetro con palabras, «pienso un número».

## Cotas de realismo (el test las comprueba)
Consecutivos: menor 5-120 (≤ 200); reparto «veces»: 3-40 cada uno, total ≤ 200; reparto de tres: 3-30, sobran 2-9; hermanos: menor 6-16, diferencia 2-8; padre 25-60 y el hijo 7-18 con n de 1 a 20 (se enumeran los casos exactos); entradas 3-25 € (extra 2-12 €); cuadernos 0,50-6,00 € (bolígrafo 0,50-4,00 €), múltiplos de 5 céntimos; lados ≤ 50 m o cm; número pensado 2-60 y resultado positivo. Solución siempre natural (o dinero exacto al céntimo).

## Hoja y examen de la semana 4
**No existían** al escribirla (ni `hojas-de-ejercicios/` ni `exámenes-semanales/`). `CASOS_HOJA` (formas canónicas, en claro) y `HUELLAS_EXAMEN` (FNV-1a de `huellaCanonica`) están vacíos pero operativos (`reservado`); los rellena la 159, que debe cotejar.

## Decisiones a revisar
- Ej. 1: «x» válidas solo una; los distractores son datos del enunciado (los otros unknowns no se ofrecen para no dar dos buenas).
- Ej. 5: la opción «el enunciado está mal» es siempre falsa (los problemas están bien por construcción).
- U6-4A-06 (monedas), 4A-07 (cuántos le da) y 3A-02 sin práctica; U6-3A-03 (la mitad y la tercera parte) no entra: haría falta denominadores en el problema (decide la 159).
- La ecuación de «edades dentro de n años» se enseña con paréntesis, que la hoja de la semana 3 ya da; la 159 confirma.
- Dinero: sin `decimales.js`; céntimos enteros propios. Sin cambios en la base, catálogo ni docs.

## Probarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/problemas-ecuaciones/ → «Probar sin código». Probado con Chrome (ES y EN, un ítem fallado por ejercicio; corregido un choque con la clase `.pasos` de la base). **No probado a 375 px** (la ventana no se redimensionó). `disponible: false` sigue; la publica la 159.

## Reabierta del 10-11 (acta de la U6)
- `eurosDe` siempre con dos decimales (`7,00 €` / `€7.00`) en enunciados, opciones, feedback y respuestas modelo; `leerCantidad` sigue aceptando `12` y `12,00`.
- «cuántas veces más» pasa a «por cuánto hay que multiplicar lo de A para tener lo de B» (reparto-veces y reparto-tres); test: ningún texto con «veces más».
- Fuera el jardín (`SITIOS`; quedan patio y póster) y fuera `edades-futuro` entera (relacionaba dos edades en el futuro: es de papel), con `EDADES_FUTURO`, `PADRES`, `paren` y los tres mensajes de error de edades. Cotas y `assert` del resto, como estaban.
- Test nuevo de 3000 ítems: sin «veces más», sin jardín, todo euro con dos decimales. Sin probar en navegador. `catalogo.js` sin tocar.
