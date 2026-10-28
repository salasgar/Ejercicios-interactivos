# Entrega de la tarea 115 · Revisión a mano y publicación de `dos-signos` (84) y `variacion` (90)

Sesión `s-20261027T082912-2939c478`, 2026-10-27. Commit: **ca0cd84**.

## Resultado
- **`dos-signos` (84): PUBLICADA** (`disponible: true`). Sale en la portada de la U3, bloque «Semana 2 · Dos signos seguidos y la regla de los
  signos», junto a `signos-producto` (comprobado con `bloquesPublicados(CATALOGO, 3)`; la U3 aparece para los alumnos desde el lun 16-11, y por
  URL directa ya funciona).
- **`variacion` (90): NO SE PUBLICA, reabierta otra vez**, por realismo: `hechos/reabiertas/90--s-20261027T082912-2939c478-revision.md`. Lo que
  pedía la reabierta de la 96 (ciudades del ej. 2) está bien; fallan los ej. 1 y 3 (temperaturas que bajan hasta 20 grados entre las 8:00 y las
  14:00 o «durante el día», y hasta 40 °C a las 8:00: un 25 % de los ítems de temperatura bajan 10 o más) y el ej. 4 (monedas anteriores al
  600 a. C., hasta del 2528 a. C., en el 19 % de los ítems). **Se queda sin publicador; plazo, jue 3-12.**

## Ficheros (git show --stat ca0cd84)
- `practicas/_comun/catalogo.js`: `disponible: true` de `dos-signos` (solo ese campo).
- `docs/practicas-unidad3.md`: la línea de «Publicadas» (a 2026-10-27: todas salvo `variacion`).

`npm test`: 1298/1298.

## Qué se ha revisado y cómo
- **Lo que pedían las reabiertas, en el navegador y con clics de ratón** (Chrome headless por CDP con `Input.dispatchMouseEvent` en el centro de
  cada botón; nunca Intro ni `element.click()`; «Probar sin código»; 375 y 1100 px; `?idioma=es` y `?idioma=en`):
  - `dos-signos` ej. 3: el «Comprobar» del segundo paso responde al clic y se oculta al responder (0 «Comprobar» visibles tras contestar, en
    los 4 recorridos; antes de contestar, 1). Ej. 1: el feedback de un fallo empieza en mayúscula («No es correcto. Los signos son distintos (+ y
    −): se queda −…» / «That is not correct. The signs are different…»).
  - `variacion` ej. 2: Burgos −10…6 con Málaga 10…22 y Moscú −25…−1 con Murcia 6…22, todos de un mismo día de invierno; su test comprueba los
    3000 ítems. Leídos 30 enunciados enteros (es y en).
- **Regla de oro, a mano**: 30 ítems de cada ejercicio de las dos prácticas, generados con su `logica.js` (script en el scratchpad) y leídos
  distractor a distractor. `dos-signos`: signo +/− (uno solo bueno), las dos reescrituras de `a ± (−b)` (b ≥ 1: nunca valen lo mismo), «¿cuál
  está bien escrita?» (una sola con paréntesis). `variacion`: en los ej. 1 y 5 ningún distractor da el valor bueno (filtrado por valor en la
  lógica y comprobado en la muestra). **Ningún distractor puede darse por bueno** en ninguna de las dos.
- **Navegador, todos los ejercicios**: un acierto y al menos un fallo de cada ejercicio de las dos prácticas, en es y en, a 375 y a 1100 px
  (`dos-signos`: 11 pasos por recorrido; `variacion`: 11). El feedback dice qué ha pasado con los números del ítem; nada se desborda
  (`scrollWidth = clientWidth`); sin excepciones en la consola (los únicos avisos fueron `ERR_CONNECTION_RESET` del `http.server` de Python 3.9
  al recargar deprisa; la página cargó y funcionó igual).

## Propuestas de tarea, al día
- **Semana 2 (tarea del lun 23-11; `desde '2026-11-23'`, `hasta '2026-11-26'`)**: la propuesta de la 94 (`salidas/94-publicar-semana2/ENTREGA.md`)
  **vale tal cual**: los cuatro ejercicios de `dos-signos` que cita (★ 2 y 3; a elegir 1 y 4) son los mismos y con el mismo número, y ya están
  todos publicados. 7 ★ + 3 a elegir = 100 puntos.
- **Semana 4 (tarea del lun 7-12; `desde '2026-12-07'`, `hasta '2026-12-10'`)**: la propuesta de la 96 (`salidas/96-publicar-semana4/ENTREGA.md`)
  **vale solo si `variacion` se arregla y se publica antes del jue 3-12** (lleva `variacion` 1 y 5 como ★ y 2, 3 y 4 a elegir; la reabierta no
  cambia la numeración). **Si no llega, el plan B de la 96**, sin ella: ★ `['ortografia', 4]`, `['errores3', 1]`, `['errores3', 2]`,
  `['saltos', 5]`; a elegir `jerarquia-enteros` 4, `parentesis-enteros` 3, 4 y 5, `errores3` 3 y `leelo3` 4, `nElegir: 6` (U3-4C-02 y 4C-07,
  nucleares, quedarían sin práctica esa semana). **Hoy (27-10) la que se puede montar es el plan B**; la principal, cuando `variacion` esté publicada.

## Para Juan Luis
1. `variacion` necesita **otra sesión MEDIO** (`PU2 T90 (MEDIO)`, como reabierta) y después **alguien que la verifique y la publique**: una
   tarea corta de publicación que dé de alta la coordinadora, o que autorices a la propia sesión de la 90 a ponerle `disponible: true` si su
   prueba con clics sale bien. Plazo: jue 3-12.
2. Observación de base, no de estas prácticas (no bloquea): `.cuenta` es `display: inline-block` (`practicas/_comun/estilos.css`, línea 205);
   cuando una cuenta larga del feedback se parte en dos líneas, el punto final se queda solo en el renglón siguiente (visto en `dos-signos` ej. 3
   a 375 px: «… = 5» y debajo «.»). Pasa en cualquier práctica con cuentas largas.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/dos-signos/ → «Probar sin código» → Ejercicio 3: pon los signos, «Comprobar los signos»,
escribe el resultado y **pulsa** «Comprobar» con el ratón: responde y desaparece. `node --test tests/practicas-dos-signos.test.js`.

---

## Reabierta de la 115 (solo `variacion`), sesión `s-20261028T135932-e77025db`, 2026-10-28 · commit **ca3888c**

Reabierta: `hechos/reabiertas/115--s-20261026T114336-7477f785.md` (coordinadora de la U4). La 90 se cerró otra vez el 27-10 (commit 2055c00).

### Resultado
- **`variacion` (90): PUBLICADA** (`disponible: true`). Sale en la portada de la U3, bloque «Semana 4 · Problemas y errores típicos», junto a
  `errores3` (comprobado con `bloquesPublicados(CATALOGO, 3)`). Con esto **la unidad 3 está publicada entera**.

### Ficheros (git show --stat ca3888c)
- `practicas/_comun/catalogo.js`: `disponible: true` de `variacion` (solo ese campo).
- `docs/practicas-unidad3.md`: la línea de «Publicadas» (a 2026-10-28: todas) y las cotas de la fila de `variacion`, que seguían siendo las
  de antes de la reabierta (−20…40 °C, 3000 a. C.).
- `practicas/variacion/textos.js`: **errata de texto** (dos frases del ej. 3 en inglés, temperatura): «Since yesterday at noon the temperature
  ~~went~~ **has gone** up…» y «Today, at the same time, it ~~went~~ **has gone** down…» («since» pide *present perfect*). Solo texto; los tests no
  lo miran.

`node --test tests/practicas-comun.test.js tests/practicas-variacion.test.js`: 59/59. `npm test`: 1322/1322.

### Qué se ha revisado y cómo
- **Lo que pedía la reabierta de la 115, punto por punto, con 3000 ítems por ejercicio** (semilla 7, distinta de la del test; script en el scratchpad):
  - Ej. 1, temperatura (748 ítems): siempre «Ayer a mediodía … y hoy a mediodía …», sin horas de la mañana ni de la tarde; valores −15…40 °C,
    cambio 1…15 grados (350 suben, 398 bajan: de mediodía a mediodía las dos cosas son creíbles). 0 ítems sin «mediodía»/«noon».
  - Ej. 3, temperatura (759 ítems): igual; dato y resultado −15…40 °C, cambio ≤ 15. «Durante el día» ya no aparece. Cuentas: 0 mal en 3000.
  - Ej. 4: en a. C. (854 ítems) la moneda va del 50 al **600 a. C.** como mucho; la vasija, hasta el 2699 a. C.; con eras distintas (1197) la moneda
    es d. C. Ningún caso de papel (753, 476, 44 a. C. → 2026, 287 → 212 a. C.); `d = a + b − 1` al cruzar, en todos.
  - Espacio de no separación ante °C, € y m en `valor()`: comprobado (U+00A0 en los tres). Paréntesis anidados del inglés en el ej. 2: quitados.
- **Regla de oro**: en el ej. 1, 0 ítems de 3000 con más de una frase verdadera (las otras dos son siempre el sentido contrario o un número que no
  es la variación); en el ej. 5 ningún distractor da el valor bueno (filtrado en la lógica; visto en la muestra). Los ej. 2-4 son de escribir.
- **Leídos 10 enunciados enteros** de los ej. 1, 3 y 4 en español y en inglés (de ahí sale la errata).
- **Navegador con clics de ratón** (Chrome headless por CDP, `Input.dispatchMouseEvent`; «Probar sin código»; 375 y 1100 px; es y en): un
  acierto y un fallo de cada uno de los cinco ejercicios en las cuatro pasadas. El feedback dice qué ha pasado con los números del ítem
  («−4 − (−13) = 9. The change is positive: it went up 9 degrees»; «Del 991 a. C. al 1 a. C. hay 990 años…: 1040 años»); nada se desborda; sin
  excepciones (un `ERR_CONNECTION_RESET` del `http.server` de Python al recargar deprisa, la trampa conocida).

### Propuesta de la semana 4, al día
**La de la 96 (`salidas/96-publicar-semana4/ENTREGA.md`) vale tal cual**: `variacion` mantiene sus cinco ejercicios con la misma numeración, y
ahora los cinco de la tabla marcados «tras la reabierta» están publicados. Tarea del **lun 7-12** (`desde '2026-12-07'`, `hasta '2026-12-10'`;
en la práctica del mié 9 al jue 10): ★ `['ortografia', 4]`, `['errores3', 1]`, `['errores3', 2]`, `['variacion', 1]`, `['variacion', 5]`; a
elegir 5 de `['jerarquia-enteros', 4]`, `['parentesis-enteros', 3]`, `['parentesis-enteros', 4]`, `['parentesis-enteros', 5]`, `['errores3', 3]`,
`['variacion', 2]`, `['variacion', 3]`, `['variacion', 4]`, `['leelo3', 4]`. **El plan B ya no hace falta.** La de la semana 2 sigue como se dijo el
27-10 (vale tal cual). Juan Luis las monta en el panel.

### Hallazgo fuera de criterio (no bloquea; decide Juan Luis)
- **Ej. 5, temperatura por horas**: «La temperatura sube/baja 5 grados cada hora durante 4 horas» (`PRODUCTO.temperatura`: 1-5 °C por hora,
  2-6 horas, ≤ 20 en total). En 3000 ítems, 50 de los 323 de temperatura van a 5 °C/h y 100 a 4 o 5 °C/h sostenidos durante 3-4 horas (15-20 grados).
  No es imposible (un frente frío, una mañana de verano en el interior), pero es raro; lo normal son 1-3 °C por hora. Si lo quiere más creíble, el
  cambio es una línea de `logica.js` (`d: [1, 3]`) y una reabierta MEDIO corta de la 90; no lo he tocado porque esta tarea no corrige código.

### Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/variacion/?idioma=en → «Try without a code» → Exercise 3 hasta que salga una temperatura:
«Since yesterday at noon the temperature has gone…». En la portada, la U3 → bloque «Semana 4».
