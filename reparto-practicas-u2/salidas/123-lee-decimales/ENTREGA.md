# Entrega de la tarea 123 · Práctica «Lee y escribe decimales» (`lee-decimales`, id 57)

Sesión `s-20261105T233548-2123b75d`, 2026-11-05. Commit del código: **`885bf61`**. La práctica sigue con
`disponible: false`: la publica la tarea 130 (semana 1, antes del jue 14-1).

## Ficheros

`practicas/lee-decimales/{index.html, practica.js, logica.js, textos.js, estilos.css}` (sustituyen el esqueleto de la 122) y
`tests/practicas-lee-decimales.test.js` (nuevo, 17 tests, 3000 ítems por ejercicio con semillas fijas).

## Ejercicios y destrezas (ids del inventario aprobado el 3-11; todas de la sesión 1)

| # | Ejercicio | Qué hace | Destrezas |
|---|---|---|---|
| 1 | Léelo · Say it | Un decimal → elegir su lectura; o una lectura → elegir el decimal. En el idioma del ítem (inglés: *nought point …*; español: *coma* o *unidades y … centésimas*, nunca enfrentadas) | U5-1B-01, 1B-02, 1B-03 (con ceros en medio), 1B-04 (vocabulario de los órdenes, en las introducciones y el feedback) |
| 2 | ¿Qué vale esta cifra? | Cifra marcada → su valor; o decimal → su descomposición correcta | U5-1C-01, 1C-03 |
| 3 | La fracción decimal | 3,75 → 375/100 (sin simplificar; parte entera ≥ 1) y 463/100 → 4,63 | U5-1C-04 |
| 4 | En la recta | Tocar la marca de un decimal (con «Comprobar»), o escribir el que marca un punto; tramos de 10 huecos entre dos naturales (décimas) o entre dos décimas (centésimas) | U5-1C-06 |

U5-1C-02 (expresar en décimas, centésimas o milésimas) **sigue sin ejercicio**: la ficha no lo recogía y no cabe en los cuatro del catálogo; propuesta abajo.

## Cotas de realismo fijadas

Sin contextos (no hay problemas con enunciado en esta práctica). Cotas numéricas, comprobadas por el test: 1-3 cifras decimales, sin 0 final;
parte entera 0 (un tercio de los ítems de ej. 1) o 1-99 (ej. 1 y 2), 1-9 (descomposiciones), 1-20 (ej. 3 `a-fraccion`); ej. 3 `a-decimal` con numerador
sin 0 final y a lo sumo dos cifras enteras; recta: tramos entre 0 y 30 (décimas) y entre 0,1 y 9 (centésimas); ningún distractor pasa de las milésimas.

## Casos de la hoja y del examen que excluye

- **Hoja 1 de la U5** (`hoja-unidad5-semana1.tex`, existe): sus 31 decimales de leer, valor de cada cifra, fracción decimal y recta
  (8,263; 6,318; 7,206; 4,63; …; los de la flecha 7,2, 7,6, 7,9) están **en claro** en `DE_LA_HOJA` de `logica.js`; se excluyen por valor.
- **Examen de la semana 1: no existía fichero de casos** (`exámenes-semanales/semana-1/` solo tiene `destrezas-semana1.md`). `HUELLAS_EXAMEN`
  está **vacío** y preparado (FNV-1a de la clave canónica del decimal, `huella(aTexto(d.normalizar(), 'en'))`; el test comprueba que una huella reserva
  el decimal por valor). **La 130 tiene que cotejar** y, si hay casos, añadir sus huellas (nunca en claro) y reabrir si hace falta.

## Probado

`node --test tests/practicas-comun.test.js tests/practicas-lee-decimales.test.js` 63/63; `npm test` 1442/1442. En Chrome (servidor local, «Probar sin código»,
ventana de 320 px de ancho), en español y en inglés, los cuatro ejercicios con aciertos y fallos: feedback con los números del ítem, «Comprobar» que se oculta,
cuatro estados de la recta, campo decimal con coma o punto. No se probó a 1100 px.

## Cómo probarlo en 1 minuto

`npm run servir` → http://localhost:8080/practicas/lee-decimales/ → «Probar sin código» (`?ejercicio=4` abre directamente el 4; `?idioma=en` lo fija).
No sale en la portada.

## Propuestas (no decididas por esta tarea)

1. **U5-1C-02** (decimal en décimas/centésimas/milésimas; «3,75 son 375 centésimas») sin ejercicio: encajaría como tercer sentido del ej. 2
   (`valor` / `suma` / `en-ordenes`), sin tocar `nEjercicios`. Lo decide la coordinadora o la 130.
2. Los distractores de la lectura en español de un decimal con parte entera 0 se evitan con «cero unidades y…» fuera de la opción buena (suena raro);
   `lecturasValidas` de la base lo genera: quien toque la base podría dejar de emitirlo cuando la parte entera es 0.
3. «Léelo · Say it» se llama igual que el ejercicio 2 de `leelo5` (ya lo señalaba la ENTREGA de la 122, punto 6).
