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
