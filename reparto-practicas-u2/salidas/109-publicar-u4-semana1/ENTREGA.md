# Entrega de la tarea 109 · Revisión y publicación de las prácticas de la semana 1 de la U4, y propuesta de su tarea

Sesión `s-20261028T135932-e77025db`, 2026-10-28 (encadenada tras la reabierta de la 115). Commit: **26306eb**.

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `que-fraccion` (99, 47) | pasa, con erratas de texto corregidas | **PUBLICADA** · bloque «Semana 1» |
| `simplifica` (101, 49) | pasa | **PUBLICADA** · bloque «Semana 1» |
| `leelo4` (108, 56) | pasa como práctica de toda la unidad; errata corregida | **PUBLICADA** · bloque «Para toda la unidad» (ningún ejercicio en la tarea de la semana 1) |
| `equivalentes` (100, 48) | **no pasa**: feedback del ej. 4 falso y dos casos del papel | sin publicar · `hechos/reabiertas/100--s-20261028T135932-e77025db-revision.md` (MEDIO) |
| `compara` (102, 50) | **no pasa**: feedback del ej. 2 falso en 1981 de 3000 ítems | sin publicar · `hechos/reabiertas/102--s-20261028T135932-e77025db-revision.md` (MEDIO) |

Comprobado: la U4 es la unidad actual desde el lun 14-12 (`UNIDADES`, `unidadActual('2026-12-14') = 4`), y `bloquesPublicados(CATALOGO, 4)` enseña
«Semana 1 → que-fraccion, simplifica» y «Para toda la unidad → leelo4». Los ids de `DESTREZAS` y del §7 de `docs/practicas-unidad4.md` están todos en el
inventario firmado (F0).

**Quién publica las dos reabiertas:** la 110 (publicación de la semana 2), que según su ficha publica también las que reabrió la anterior, verificadas
otra vez. Pero la tarea de la semana 1 se monta el **lun 14-12** y su plazo de publicación es el **jue 10-12**: para llegar, las reabiertas de la 100 y la
102 (MEDIO, cortas, ficheros disjuntos: caben a la vez) tienen que cerrar antes, y la 110 (ALTO) correr después. Si no llegan, vale el plan B de abajo.

## Ficheros (git show --stat 26306eb)
- `practicas/_comun/catalogo.js`: `disponible: true` de `que-fraccion`, `simplifica` y `leelo4` (solo ese campo).
- `practicas/que-fraccion/textos.js` y `logica.js`, **erratas de texto** (sin tocar lógica): concordancia con 1 («hay 1 sombreada», «1 is shaded», «Se ha
  comido 1», «1 es de chocolate negro»); «en cada figura» solo si hay más de una; «Esta semana no se simplifica» → «Aquí no se simplifica» (la sesión 2
  de la misma semana sí simplifica); el plural inglés «sixs» → «sixes» en un distractor del ej. 4 (111 de 3000 ítems en inglés).
- `practicas/leelo4/textos.js`: introducción del ej. 3 en inglés, «2/5 of 30 means 2/5 · 30» (el producto es de la sesión 7) → «of = de: 2/5 of 30 is
  2/5 de 30», como la versión en español.
- `tests/practicas-semana.test.js`: el test de portada de la U4 comprobaba «ninguna publicada»; ahora lo comprueba sobre una copia del catálogo y
  exige que la portada enseñe justo las publicadas (la trampa de la 93, mismo arreglo que el test de la U3).

`npm test`: 1322/1322.

## Cómo se revisó
Cinco revisiones en paralelo (una por práctica, subagentes de esta sesión, solo lectura) y cada defecto comprobado después en el código por esta sesión:
- **Regla de oro**: 30-40 ítems por ejercicio leídos a mano en es y en, y barrido de 3000 por ejercicio comparando por valor con `Fraccion`: 0 opciones
  equivalentes en las cinco; ninguna pareja válida enfrentada (*a half*/*one half*, *three quarters*/*three fourths*, *quarter*/*fourth*); en `leelo4`, 0
  distractores que sean otra lectura válida ni que difieran solo en guion o espacio.
- **Nada que no se haya dado**: ni decimales, ni mixtos, ni sumas ni productos de fracciones fuera de su sesión. Sesión mínima por ejercicio en la tabla de
  la propuesta.
- **Realismo**: solo `que-fraccion` y `leelo4` tienen contextos; todas sus cotas se cumplen en 3000 ítems (clase 12-36, tarta 3-15, caja 6-24, dinero
  múltiplo del denominador…).
- **Navegador con clics de ratón** (Chrome headless por CDP, «Probar sin código», 375 y 1100 px, es y en): acierto y fallo de cada ejercicio de las
  cinco; arrastre real en el ej. 3 de `equivalentes`. Sin desbordes ni excepciones (solo `ERR_CONNECTION_RESET` del `http.server` de Python).

## Propuesta de la tarea de la semana 1 (para que Juan Luis la monte en el panel; no está creada)

`U4 · Semana 1 · Qué es una fracción, equivalentes y comparar` / `U4 · Week 1 · What a fraction is, equivalent fractions and comparing`
· `unidad: 4` · `desde: '2026-12-14'` · `hasta: '2026-12-17'` (de lunes a jueves, como las demás; la prueba 1 es el vie 18-12).
Sesiones: 1 lun 14-12 (qué es una fracción), 2 mar 15-12 (equivalentes, simplificar, común denominador), 3 jue 17-12 (comparar y ordenar). Como en
la 93, lo de la sesión 3 va «a elegir», porque se da el mismo día del plazo.

### Plan A (si `equivalentes` y `compara` se publican antes del jue 10-12): 6 ★ + 4 a elegir = 100 puntos
| | Ejercicio | Destreza (sesión) | Publicado |
|---|---|---|---|
| ★ | `['ortografia', 5]` ¿porque o por qué? | — (calendario del 25-10) | sí |
| ★ | `['que-fraccion', 1]` Lee la figura | U4-1C-01, 1C-02, 1C-05 nucleares (1) | sí |
| ★ | `['que-fraccion', 4]` Léela | U4-1B-02 nuclear, 1B-03 (1) | sí |
| ★ | `['equivalentes', 1]` El término que falta | U4-1C-12 nuclear, 1C-10 (2) | tras la reabierta |
| ★ | `['simplifica', 3]` De una vez | U4-1C-14 nuclear (2) | sí |
| ★ | `['equivalentes', 4]` Común denominador | U4-1C-16 nuclear (2) | tras la reabierta |
| elegir | `['que-fraccion', 2]` Sombrea la fracción | U4-1C-01, 1C-03 (1) | sí |
| elegir | `['que-fraccion', 3]` De la frase a la fracción | U4-1C-04 (1) | sí |
| elegir | `['simplifica', 1]` Paso a paso | U4-1C-13, 1C-15, 1C-22 (2) | sí |
| elegir | `['simplifica', 2]` ¿Irreducible? | U4-1C-15, 1C-22 (2) | sí |
| elegir | `['equivalentes', 2]` ¿Son equivalentes? | U4-1C-11 (2) | tras la reabierta |
| elegir | `['equivalentes', 3]` Equipos | U4-1C-10, 1C-11 (2) | tras la reabierta |
| elegir | `['compara', 1]` Mayor o menor | U4-1C-17, 1C-19 nucleares, 1C-23 (3) | tras la reabierta |
| elegir | `['compara', 3]` Ordena | U4-1C-20 nuclear, 1C-23 (3) | tras la reabierta |
| elegir | `['compara', 2]` Frente a 1 y a un medio | U4-1C-18 (3) | tras la reabierta |
| elegir | `['compara', 4]` En la recta | U4-1C-21, 1C-24 (3) | tras la reabierta |

```js
  estrella: [['ortografia', 5], ['que-fraccion', 1], ['que-fraccion', 4], ['equivalentes', 1], ['simplifica', 3], ['equivalentes', 4]],
  elegir: [['que-fraccion', 2], ['que-fraccion', 3], ['simplifica', 1], ['simplifica', 2], ['equivalentes', 2], ['equivalentes', 3], ['compara', 1], ['compara', 3], ['compara', 2], ['compara', 4]],
  nElegir: 4,
```

### Plan B (con lo publicado hoy): 5 ★ + 5 a elegir = 100 puntos
Solo hay 7 ejercicios de la U4 publicados más la ortografía (80 puntos): los otros 2 son repaso de la U2 que prepara simplificar y el común denominador.
```js
  estrella: [['ortografia', 5], ['que-fraccion', 1], ['que-fraccion', 4], ['simplifica', 3], ['que-fraccion', 3]],
  elegir: [['que-fraccion', 2], ['simplifica', 1], ['simplifica', 2], ['venn', 2], ['venn', 3]],
  nElegir: 5,
```
(`venn` 2 «El m.c.d. con factores primos», `venn` 3 «El m.c.m. con factores primos»; si el modelo de tareas los quiere como repaso con prefijo de
unidad, van ahí.)

### Destrezas nucleares de la semana sin ejercicio en la tarea
- **U4-1A-01, 1A-02, 1A-03** (problemas de la semana) y **U4-1C-08** (fracción de una cantidad, sesión 1): las cubre `fraccion-de` (103), que es del
  bloque de la semana 2 y se publica en la 110. Si Juan Luis quiere la fracción de una cantidad ya en la semana 1, la 110 tendría que adelantarla.
- **U4-1B-01** (vocabulario básico): solo en `leelo4` 1, que mezcla tramos de las tres semanas (ver abajo).
- En el plan B, además, U4-1C-12, 1C-16, 1C-17, 1C-19 y 1C-20.

## Hallazgos fuera de criterio (no bloquean; decide Juan Luis)
- **`leelo4` no puede ir en la tarea de la semana 1**: cada ejercicio mezcla sesiones (ej. 1 hasta la s10, ej. 2 y 4 hasta la s9, ej. 3 hasta la s5). Además,
  tres etiquetas `sesion` están mal (ej. 1 declara el mínimo de sus términos y no el máximo; `dictado_de` dice s1 y necesita la s7; `queda` dice s1 y
  necesita la s5-6): no afectan hoy, pero romperían el filtro `?hasta=<sesión>` que propone la ENTREGA de la 108. En el feedback se pegan nombres de
  error en tercera persona («Ha elegido otra operación») cuando el resto tutea, y en inglés sin sujeto. U4-1B-03 (leer en español) figura como cubierta
  por `leelo4` y ningún ejercicio la practica.
- **`que-fraccion`**: pizza en 2 trozos (mitades) en el 5 % de los ítems de los ej. 1 y 2 (la cota del acta dice 3-15; el punto a permite «media pizza»).
  En el ej. 4 el idioma del ítem sigue al de la página (`?idioma=es` → nunca lectura inglesa, 1B-02 nuclear), aunque la introducción dice que salen
  mezclados. El 1/2 nunca sale en el sentido lectura → fracción. «Un equipo con 6 camisetas rojas de 19» es raro. *Slices* y *eaten* sin aclarar.
- **`simplifica`**: solo fracciones propias (simplificar impropias también es de la sesión 2); varios fallos dentro de un ítem del ej. 1 quitan una sola
  vida; a 375 px «m.c.d.(10, 96)» se parte en dos líneas.
- **`equivalentes`** (además de la reabierta): en el ej. 4 los denominadores son primos entre sí en el 78 % de los ítems, así que el error «producto en vez
  del m.c.m.» solo se detecta en el 22 %; «Correct! Correct: …» en inglés (patrón de la base).
- **`compara`** (además de la reabierta): en el ej. 1, «al revés que los numeradores» acierta siempre con positivas de distinto denominador, y con signos
  mixtos la negativa tiene siempre mayor valor absoluto; impropias en el 66 % y enteros en el 28 % de sus ítems; comunes denominadores de hasta 132 en el
  feedback; el 19 % del ej. 3 con 5 tarjetas (el inventario dice 3 o 4).
- **Casos parecidos al papel generados al azar** (no son casos fijos; pocos de 3000): la tarta 5/12 y 9/14 del examen semanal 1, el rectángulo de 9
  cuadros con 5/9, «1/3 of 27» de la hoja. Si se quieren fuera, cada práctica necesitaría su lista de reservados, como `equivalentes`.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/que-fraccion/ y /simplifica/ y /leelo4/ («Probar sin código»). En la portada no salen hasta el
14-12; `node -e` con `bloquesPublicados(CATALOGO, 4)` las enseña ya. `npm test`.
