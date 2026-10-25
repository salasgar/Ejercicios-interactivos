# Entrega de la tarea 94 · Revisión y publicación de la semana 2 de la unidad 3

Sesión `s-20261025T210819-a6a5693e`, 2026-10-25. Commit del código: **cd07056**.

## En una línea

**Publicadas: `signos-producto` (85) y las tres reabiertas de la 93, ya arregladas: `termometro` (80), `saltos` (83) y `leelo3` (91).**
**Reabierta (sin publicar): `dos-signos` (84)**: en el ejercicio 3, el «Comprobar» del resultado no responde al clic (solo a la tecla Intro).
El arreglo es corto (banda MEDIO), pero **la 84 tiene que estar publicada antes del jueves 19-11** para entrar en la tarea de la semana 2,
y la 95 (que es quien la publica tras verificarla) puede haber cerrado ya cuando se arregle. Ver «Para Juan Luis», abajo.

Con esto, **la semana 1 de la U3 queda completa** (las cinco prácticas publicadas, más la ortografía): la propuesta de tarea de la 93
ya se puede montar entera.

## Ficheros (git show --stat cd07056)
- `practicas/_comun/catalogo.js`: `disponible: true` de `termometro`, `saltos`, `signos-producto` y `leelo3` (solo ese campo).
- `practicas/signos-producto/textos.js`: cinco erratas de texto de una línea cada una:
  - el feedback de los ejercicios 1 y 2 empezaba en minúscula tras el «No es correcto.» de la base («No es correcto. los signos son
    iguales…») → «Los signos…» / «The signs…»;
  - en inglés llamaba *sum* a un producto, justo en el ejercicio que pregunta si es suma o producto: «What is this sum?» → «What is
    this calculation?»; «First decide what the sum is» → «what the calculation is»; «You decided right; the sum is» → «the result is»;
    y en el ejercicio 5 «choose the sum that is written correctly» → «the product».

`npm test`: 1166/1166.

## Portada
Hoy no cambia nada para los alumnos: la U3 sale en la portada desde su `desde` (lun 16-11). Ese día enseña (comprobado con
`bloquesPublicados(CATALOGO, 3)`): «Semana 1» con `termometro`, `opuestos`, `situaciones` y `saltos`; «Semana 2» con `signos-producto`
(y `dos-signos` cuando se publique); «Para toda la unidad · Vocabulario» con `leelo3`; «Otras» con la ortografía. Por URL directa ya funcionan.

## Qué se ha revisado y cómo

**84 y 85 (semana 2), enteras:**
- **Regla de oro**: lógica y textos leídos enteros; 30 ítems de cada ejercicio generados con su `logica.js` y leídos, más 3000 para las
  proporciones. Las opciones son: el signo (+/−, una sola buena), las dos reescrituras de `a ± (−b)` (una sola buena), «¿es un producto o
  una suma o resta?» (inequívoco: hay o no hay ·) y «¿cuál está bien escrita/o?» (una sola con paréntesis; las otras dos, con dos signos
  seguidos). **Ningún distractor puede darse por bueno.** Las parejas válidas no se enfrentan nunca.
- **Nada que no se haya dado**: todo es de la sesión 6 (mar 24-11) salvo `signos-producto` 4 «¿Suma o producto?» (U3-2C-21, sesión 7,
  jue 26-11) y `saltos` 4 y 5 (sesión 5, lun 23-11). Sin potencias, sin paréntesis que envuelvan operaciones, sin letras. `(+6)` solo en
  `dos-signos` (es la práctica que enseña a quitarlos, U3-2C-07 y 2C-08).
- **Realismo**: sin contexto (solo cuentas). Cotas leídas: `dos-signos`, primer número 1-20, entre paréntesis 1-9, resultado −30…30;
  `signos-producto`, factores 2-12 (productos hasta 144), cocientes 1-12, sumas y restas con 1-9; 0 : d en el 17 % y d : 0 en el 8 % de
  los ítems de dividir (la ficha pedía 1/6 y 1/12).
- **Navegador** (Chrome headless por CDP, «Probar sin código», servidor propio): `dos-signos` y `signos-producto`, un acierto y un fallo de
  cada ejercicio a 375 px en español (en el 2 de `signos-producto`, también 0 : d y d : 0), y un fallo por ejercicio a 1000 px en inglés.
  Sin desbordes (scrollWidth = ancho), sin errores de consola. La cuenta larga del ej. 3 de `dos-signos` (cinco números) se parte en dos
  líneas y no se sale. Ahí salieron el fallo de la 84 y la minúscula.

**80, 83 y 91 (reabiertas de la 93), verificadas otra vez:**
- **80 `termometro`**: «Mayor o menor» con dos positivos o con 0 y positivo da ahora su propio error (`compara-positivos`) y «Mira la recta:
  6 es mayor que 5…» (visto en el navegador); el aviso del ej. 4 usa dos negativos del ítem (el ítem lleva siempre al menos dos).
- **83 `saltos`**: 5000 ítems del ej. 5 → **0 frases fuera de la cota de su contexto** y ninguna repetida (antes, el 58 %). Erratas («te
  falta 1», comillas inglesas, «the diver») corregidas. Ej. 5 en inglés en el navegador, bien.
- **91 `leelo3`**: 5000 ítems del ej. 1 → **0 temperaturas fuera de −30…45 °C**. Ej. 4: cada pareja de ciudades con su cota de un mismo día
  de invierno (Madrid/Rome/Athens 5-18 °C, Cairo 12-25, Lima 18-30; las frías −15…−1). Distractores leídos otra vez: ninguno válido.

## Por qué se reabre la 84 (detalle en `hechos/reabiertas/84--s-20261025T210819-a6a5693e-revision.md`)
En el ejercicio 3, `pedirResultado` busca `zona.querySelector('.comprobar')` y encuentra antes el botón oculto «Comprobar los signos», que
también está en `#zona`. El clic del alumno en «Comprobar» no hace nada; con Intro sí contesta (por eso los tests no lo ven). En el móvil,
el alumno se queda atascado. Además, el feedback del ej. 1 empieza en minúscula (como el de la 85). Lo demás de la 84 está bien.

## Propuesta de la tarea de la semana 2 (para que Juan Luis la monte en el panel; no está creada)

`U3 · Semana 2 · Varios términos y la regla de los signos` / `U3 · Week 2 · Several terms and the rule of signs`
· `unidad: 3` · `desde: '2026-11-23'` · `hasta: '2026-11-26'` (de lunes a jueves; la prueba 2 es el vie 27-11, sesiones 5 a 7).
**7 ★ + 3 a elegir = 100 puntos** (la ortografía es uno de los ★: el resto suma 90).

| | Ejercicio | Destreza (sesión) | Publicado |
|---|---|---|---|
| ★ | `['ortografia', 2]` «¿e o he?» | — (decisión del 23-10) | sí |
| ★ | `['saltos', 4]` Varios términos | U3-2A-01 y 2C-01 nucleares, 1C-15, 2C-02, 2C-03 (5) | sí |
| ★ | `['saltos', 5]` Varios movimientos | U3-2C-04 nuclear (5) | sí |
| ★ | `['dos-signos', 2]` Sumar o restar un negativo | U3-2C-05 y 2C-06 nucleares (6) | **tras la reabierta** |
| ★ | `['dos-signos', 3]` Quita los paréntesis y calcula | U3-2C-08 nuclear (6) | **tras la reabierta** |
| ★ | `['signos-producto', 1]` Multiplica | U3-2C-15 nuclear (6) | sí |
| ★ | `['signos-producto', 2]` Divide | U3-2C-18 nuclear, 2C-20 (6) | sí |
| elegir | `['dos-signos', 1]` Un solo signo | U3-2C-07 nuclear (6) | **tras la reabierta** |
| elegir | `['signos-producto', 4]` ¿Suma o producto? | U3-2C-21 nuclear (7) | sí |
| elegir | `['leelo3', 2]` Sumas, restas y productos (en inglés) | U3-2B-01 y 2B-03 nucleares, 2B-02 (5-7) | sí |
| elegir | `['signos-producto', 3]` El factor que falta | U3-2C-19 (6) | sí |
| elegir | `['signos-producto', 5]` ¿Cuál está bien escrito? | U3-2C-16 (6) | sí |
| elegir | `['dos-signos', 4]` ¿Cuál está bien escrita? | U3-2C-10 (6) | **tras la reabierta** |

`nElegir: 3` (6 en la lista).

```js
  estrella: [['ortografia', 2], ['saltos', 4], ['saltos', 5], ['dos-signos', 2], ['dos-signos', 3], ['signos-producto', 1], ['signos-producto', 2]],
  elegir: [['dos-signos', 1], ['signos-producto', 4], ['leelo3', 2], ['signos-producto', 3], ['signos-producto', 5], ['dos-signos', 4]],
  nElegir: 3,
```

Criterio: los ★ son lo que más pesa en la prueba del viernes: varios términos (agrupando o de izquierda a derecha) y problemas de varios
movimientos (sesión 5), quitar el paréntesis de un número al sumar y restar, y multiplicar y dividir con la regla de los signos (sesión 6).
`signos-producto` 4 (U3-2C-21, «no uses la regla del producto en una suma», el error más caro de la unidad) va en «a elegir» porque es de
la sesión 7, el jueves 26-11, el mismo día del plazo, como hizo la 93 con `saltos` 3. Si prefieres que sea ★ (es la que más se equivoca),
cámbiala por `signos-producto` 2 y deja la división a elegir: los números siguen sumando 100.

- **Destrezas nucleares de la semana sin práctica: ninguna.** Las 12 (2A-01, 2B-01, 2B-03, 2C-01, 04, 05, 06, 07, 08, 15, 18 y 21) tienen al
  menos un ejercicio en la lista. Sin ejercicio, a propósito (solo hoja y examen abierto): U3-2A-04, 2C-09 y 2C-17 (el patrón de 2C-17 es la
  introducción de `signos-producto` 1).
- **Si el jueves 19-11 `dos-signos` no estuviera publicada**, sus cuatro ejercicios no se pueden poner. Con lo publicado hoy:
  ★ `ortografia` 2, `saltos` 4 y 5, `signos-producto` 1 y 2; a elegir 4 de `signos-producto` 3, 4 y 5 y `leelo3` 2 → **90 puntos**: haría
  falta un ejercicio de repaso de la U2 para llegar a 100. Y quitar el paréntesis de un número (2C-05 a 2C-08, nucleares de la sesión 6)
  quedaría sin práctica en la semana.

Validada con `erroresTareas` (las dos versiones): sin errores.

## Para Juan Luis
1. **Quién publica la 84.** La 94 la reabre; la arregla cualquier sesión MEDIO (un cambio de una línea y la mayúscula), y la publica la
   tarea de publicación siguiente tras verificarla otra vez. Esa es la 95, pero yo la encadeno ahora y la 84 no estará arreglada para
   entonces. Para que llegue al jueves 19-11, lo más sencillo es abrir una sesión MEDIO para la reabierta de la 84 (frase al final) y
   que, al cerrarla, una sesión ALTO la verifique y ponga `disponible: true`, o decirle a la de la 84 que lo ponga ella si su prueba
   en navegador con el clic sale bien. Lo decides tú.
2. `signos-producto` 4: el feedback de un valor mal calculado dice «Está bien lo que has decidido; la cuenta es −4 + 6 = 2», con los números
   del ítem pero sin nombrar el error (la ficha no lo pedía; el error sí se registra). No lo he tocado.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/signos-producto/ («Probar sin código»), …/termometro/, …/saltos/, …/leelo3/. `npm test`.
