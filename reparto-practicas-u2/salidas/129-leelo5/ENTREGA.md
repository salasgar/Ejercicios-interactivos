# Entrega de la tarea 129 · Práctica «Léelo en inglés» de la unidad 5 (leelo5)

Sesión `s-20261106T125516-ac96224e` (relevo de s-20261105T234204-0afc2979), 2026-11-06. Commit del código: **`4484f9a`** (6 ficheros).

## Ficheros

`practicas/leelo5/{index.html,practica.js,logica.js,textos.js,estilos.css}` y `tests/practicas-leelo5.test.js` (18 tests, 3000 ítems por ejercicio y en los dos idiomas, probado con 6 semillas: `SEMILLA_LEELO5=100 node --test tests/practicas-leelo5.test.js`). No toca nada fuera de «Ficheros que toca».

## Ejercicios y destrezas (ids del inventario aprobado)

Los cuatro son de **elegir una opción entre cuatro**; ninguno tiene campo de texto (por eso no hay `inputmode="decimal"` ni «Comprobar»: se responde al tocar, como en la U4). Cada fallo pasa a `api.responder` con su `error` (nombre en `ERRORES_LEELO` o `ERRORES_TIPICOS`) y la `respuesta`. Cada ítem lleva `sesion` (primera sesión en que tiene sentido), por si la tarea de publicación quiere restringir.

| Ej. | Qué es | Destrezas |
|---|---|---|
| 1 La palabra | un término (32 del vocabulario) y cuatro significados, o al revés; parecidos (tenths/tens, hundredths/hundreds) y contrarios (greater/less, dividend/divisor…) como distractores | U5-1B-04, 1B-07 (vocabulario), 1B-06 (*cents*, *change*), 2B-01, 2B-02 (vocabulario) |
| 2 Léelo | decimal → lectura en inglés; dinero → lectura; palabras (inglés o español) → cifras, con ceros de en medio; cifras → lectura en español con los órdenes; cuenta con decimales → lectura (suma, resta, producto, cociente) | U5-1B-01, 1B-02, 1B-03, 1B-06, 2B-03 |
| 3 La consigna | una consigna de examen en inglés (round, simplest form, between, ascending/descending, greater/smaller, estimate, convert, divide… quotient) y cuatro traducciones | U5-1B-07, 2B-01, 2B-02 (en la consigna) |
| 4 Completa | una frase con un hueco y cuatro palabras: orden de una cifra, decimal places, greater/less/between, change, per litre, weighs, dividend/divisor/quotient/remainder, recurring/terminating, y los separadores (punto decimal, coma de millares inglesa) | U5-1B-04, 1B-05, 1B-06, 1B-07, 2B-01, 2B-02 |

## Cotas de realismo (las comprueba el test)

Dinero a leer 0,05–59,99 € (dos cifras); decimal a leer: 1–3 cifras, parte entera de 0 a 99, sin ceros finales; cuentas: operandos hasta 40, resultado hasta 3 cifras decimales, división exacta con divisor natural 2–9; libro 3–30 € pagado con billete de 5, 10, 20 o 50 € que lo cubre (vuelta > 0); gasolina 1,20–2,00 €/L y 5–70 L; bolsa de patatas 0,5–5 kg, paquete 0,1–30 kg, recién nacido 2,5–4,5 kg, persona 30–120 kg; división con prueba: divisor natural 3–49 (nunca múltiplo de 10), cociente de dos cifras decimales cortado y resto de la original, cuatro valores distintos. Las cotas están en enteros de la unidad pequeña (`COTAS`), nunca con `Number` con coma.

## Casos excluidos

- **Hoja** (semanas 1 y 2): en claro, todos los decimales de las dos hojas (`RESERVADOS_HOJA`, 217 valores); ni la notación ni la opción buena de ningún ítem los lleva (el test lo recorre).
- **Examen semanal**: **no existía al escribirla** (`exámenes-semanales/semana-N/` solo tiene `destrezas-semanaN.md`). `HUELLAS_EXAMEN` está **vacío** y la función `huella` (FNV-1a base 36 de `aTexto(normalizado,'en')`) y `esReservado` ya lo cotejan: **la tarea 130 (y la 131 para lo que toque) tiene que calcular las huellas fuera del repo y añadirlas**; el test exige `size === 0` para recordarlo (se cambia entonces). Examen final: tampoco existía.
- Las fracciones de las hojas no salen en la consigna de convertir.

## Propuestas (no decididas por esta tarea)

1. **Vocabulario de la semana 2 en una práctica de la semana 1** (el punto 4 de la ENTREGA de la 122): los ítems con `sesion: 5` o `6` (dividend/divisor/quotient/remainder, proof, convert, recurring/terminating, simplest form, las cuentas con producto y cociente, `consigna_fraccion`, `consigna_convertir`, `consigna_dividir`, `completa_rol`, `completa_tipo`) son de la semana 2. Si se publica con la semana 1, hay que **filtrar `sesion <= 3`** (los generadores no filtran: hay un campo por ítem) o publicar con la semana 2. Lo decide la 130.
2. *Weighs*, *per litre*, *change* y el dinero son de la sesión 3: también caen fuera de «las sesiones 1-2», si alguien restringe así.
3. *to estimate* sale como vocabulario y consigna (sesión 2) aunque estimar es destreza de hoja en la app (acta); no hay ítem de calcular, solo de entender la palabra. Si el acta lo prohíbe también como palabra, se quita `consigna_estimar` y el término.
4. Los contextos «la vuelta» (un libro pagado con billete) y la gasolina son de la lista del acta; la vuelta está reservada al papel: aquí solo pide la **palabra** *change*, no calcula. Si Juan Luis quiere la reserva exclusiva, se cambia `completaVuelta` por otro contexto.
5. No se ha tocado `catalogo.js`: sigue `disponible: false`.

## Cómo probarlo en 1 minuto

`node --test tests/practicas-comun.test.js tests/practicas-leelo5.test.js` (64 en verde); en el navegador `python3 -m http.server 8137` y http://localhost:8137/practicas/leelo5/ → «Probar sin código» → los cuatro ejercicios (el 8080 puede estar ocupado por otra sesión). Probado con clics: ej. 1, 2 (con un fallo y su feedback, en inglés), 3 y 4 en inglés y español; scrollWidth 371 px en un iframe de 375 px (sin desbordes) en los cuatro ejercicios. No probado el feedback de cada plantilla con clics (solo por test).
