# Entrega de la tarea 108 · «Léelo en inglés» de la unidad 4 (`leelo4`, id 56)

Sesión `s-20261027T082801-cdf346ec`, 2026-10-27. Commit del código: **23c181b**. `disponible: false`: se entra por la URL.

## Ficheros

`practicas/leelo4/{logica,textos,practica}.js`, `estilos.css`, `index.html` (enlaza la hoja propia) y `tests/practicas-leelo4.test.js`
(15 tests; 3000 ítems por ejercicio con semillas fijas, contra un lector de inglés escrito en el propio test).

## Ejercicios y destrezas

| # | Nombre | Qué hace | Destrezas |
|---|---|---|---|
| 1 | Emparejar | 5 términos EN ↔ 5 ES (toca uno y su traducción; mismo número y color; «Comprobar» se oculta al responder). Pool de 34 términos en 3 tramos (sesiones 1-3, 5-7, 9-10); un ítem usa un solo tramo y cinco `familia`s distintas (nunca to add + sum, to divide + quotient…) | U4-1B-01, 1B-04, 1B-05, 1B-06, 1B-07, 2B-01, 2B-03, 3B-01, 3B-02 |
| 2 | La lectura | Fracción (a half / one half, three quarters / three fourths…) o cuenta (+ − · :) o potencia (squared / cubed) y 4 lecturas en inglés; sale `plus/minus/times\|multiplied by/divided by`, `equals\|is` | U4-1B-02, 1B-03 (lectura en el feedback), 2B-02, 2B-03, 3B-03 |
| 3 | ¿Qué pide? | Enunciado en inglés (left, the rest, shaded, out of, of) y 4 preguntas en español; sin calcular | U4-1B-01, 1B-07, 2B-01, 3B-02 |
| 4 | Dictado | Frase en inglés (con ▶ si el aparato habla) y el alumno escribe `a op b = c` (campos de texto + 4 botones de operación). Vale por valor; en + y · vale el otro orden | U4-1B-07, 2B-02, 2B-03, 3B-01, 3B-03 |

Todo fallo pasa a `api.responder` con `error` (id de `ERRORES_TIPICOS` o de `ERRORES_LECTURA`, con nombre {es,en}) y `respuesta`.

## Cotas de realismo (`COTAS` en logica.js; las comprueba el test)

dinero 20-600 € (múltiplo del denominador; tope general 2000) · pegatinas 12-60 · pizza 4-12 trozos (tope 3-15) · rectángulo 3-12 partes ·
clase 12-36 alumnos con la fracción entera y a/b ≤ 3/4 · denominadores de los enunciados ≤ 10 · operandos de las cuentas con denominador ≤ 12 y
resultado ≤ 36 (num ≤ 60) · cuadrado hasta 9² y cubo hasta 4³ (denominadores < 100, que se leen con ordinal).

## Cómo probarlo en 1 minuto

`npm run servir` → http://localhost:8080/practicas/leelo4/?ejercicio=N (N = 1-4) → «Probar sin código». (El código 7NPD no entra: la nube no lo conoce en este origen.) Probado en Chrome a 400 px, en ES y en EN: ej. 1 acertado a medias y fallado (feedback con las cinco parejas), ej. 2 y 3 acertar/fallar, ej. 4 fallo con la cuenta correcta.

## Propuestas pendientes (no decididas)

1. **«Nada que no se haya dado» y la semana.** La práctica es de toda la unidad y mezcla sesiones: el ej. 2 y el 4 incluyen sumas (s. 5), productos (s. 7) y cocientes (s. 9); el ej. 1, tres tramos. Cada ítem lleva `sesion` (mínima) y el ej. 1 `tramo`, pero la base no sabe en qué semana está el alumno. Para la tarea de la semana 1 (109) convendría o bien dejarla como ★ solo a partir de la semana 3, o bien una tarea que añada un filtro `?hasta=<sesión>` (cambia `practica.js`, no la base). Decídelo en la 109-111.
2. **`practicas-comun` y los 4 ejercicios**: sin cambios; el nombre «Dictado» y «Emparejar» coinciden con el catálogo.
3. El ej. 4 acepta equivalentes (4/6 por 2/3) porque una fracción y su equivalente son la misma respuesta (regla 1 de la unidad); si Juan Luis prefiere exigir lo dictado literalmente, es un cambio de una línea en `corregirDictado`.
4. U4-1B-02 (leer «three fifth» sin s) no se usa como distractor: en una pregunta de lectura suena igual.
