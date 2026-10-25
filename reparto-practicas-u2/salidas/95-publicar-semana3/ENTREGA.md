# Entrega de la tarea 95 · Revisión y publicación de la semana 3 de la unidad 3

Sesión `s-20261025T212329-34d74420`, 2026-10-25 (encadenada tras la 94). Commit del código: **5e8dc23**.

## En una línea

**Publicadas las tres de la semana 3: `potencias-enteros` (86), `jerarquia-enteros` (87) y `parentesis-enteros` (88).** Ninguna reabierta.
La única que reabrió la 94, `dos-signos` (84), **sigue sin arreglar** (nadie la ha cogido aún): no se ha podido verificar ni publicar
aquí. Ver «Para Juan Luis».

## Ficheros (git show --stat 5e8dc23)
- `practicas/_comun/catalogo.js`: `disponible: true` de `potencias-enteros`, `jerarquia-enteros` y `parentesis-enteros` (solo ese campo).
- `practicas/parentesis-enteros/textos.js`: errata de una línea: en el ej. 1, «…vale 32; La cuenta original vale 10» → «; la cuenta
  original» (y en inglés «; the original sum»). Ese texto solo sale detrás del punto y coma.

`npm test`: 1166/1166. Portada (con `bloquesPublicados(CATALOGO, 3)`): «Semana 3 · Potencias, jerarquía y paréntesis» con las tres, desde el
16-11 como toda la U3.

## Qué se ha revisado y cómo
- **Regla de oro**: lógica y textos leídos. Casi todo se contesta escribiendo un número; donde hay opciones: el signo (positivo/negativo),
  la base (−a o a: una sola es la base), «¿qué enteros al cuadrado dan n?» (las falsas, 2r, −2r, n y n/2, nunca elevan al cuadrado a n:
  sin «7 y ±7»), y los valores de un paso en `jerarquia-enteros` 2 (todos distintos del bueno y cada uno de un error con nombre). Ninguna
  opción falsa puede darse por buena. En `jerarquia-enteros` 1, adelantar una operación solo es fallo si cambia el valor (regla de Juan Luis
  del 8-10): «Podían ir primero: −12 : (−6), 7 · 3».
- **Nada que no se haya dado** (contra la columna `sesion` del inventario y la secuenciación): ej. de la sesión 13, dentro de prácticas de
  esta semana y fuera de la propuesta de tarea: `jerarquia-enteros` 4 (combinadas, U3-4A-02) y `parentesis-enteros` 3, 4 y 5 (U3-4A-06,
  4A-07 con corchetes y 4A-04). `jerarquia-enteros` 1 ya no lleva combinadas (decisión del 25-10). Las de la sesión 11 (jueves 3-12, el
  día del plazo): `jerarquia-enteros` 1 y 2 y `parentesis-enteros` 1 y 2.
- **Realismo**: sin contextos (solo cuentas). Cotas leídas en el código: productos de 3-5 factores |f| ≤ 5 y |producto| ≤ 500; potencias
  |valor| ≤ 1000 (de (−10)³ a (−5)⁴); cuadrados perfectos 1-144; jerarquía, final en ±100 y pasos en ±200 y nunca 0; paréntesis, ±200.
- **Navegador** (Chrome headless por CDP, «Probar sin código»), **con clics de verdad en cada botón** (lo que no vio nadie en la 84):
  - `potencias-enteros`, 375 px, español: acierto y fallo de los ej. 1, 2 y 3; el ej. 4 entero hasta 10 puntos (cuadrados, raíz y raíz
    de negativo acertados) y un fallo de cada tipo. Inglés a 1000 px: un fallo en 1, 2 y 3.
  - `jerarquia-enteros`, 375 px, español: ej. 1 acierto y fallo (cadena tocando la del medio), ej. 2 paso a paso hasta el final (acierto)
    y un valor mal elegido (fallo con «4³ = 64. Una base positiva da siempre un resultado positivo»), ej. 3 cadena entera acertada y el par
    `12 : (−2) · (−3)` / `12 : (−2 · (−3))` fallado (explica que el paréntesis agrupa). Inglés a 1000 px: fallo del ej. 1 y opciones del 2.
  - `parentesis-enteros`, ej. 1 y 2, 375 px en español y 1000 px en inglés: acierto y fallo de cada uno, con la ayuda «opero dentro».
  Sin desbordes (scrollWidth = ancho), sin errores de consola, «Comprobar» oculto al responder, feedback con los números del ítem.
  Los ej. 4 de `jerarquia-enteros` y 3-5 de `parentesis-enteros` (semana 4) los prueba la 96.

## Propuesta de la tarea de la semana 3 (para que Juan Luis la monte en el panel; no está creada)

`U3 · Semana 3 · Potencias, jerarquía y paréntesis` / `U3 · Week 3 · Powers, order of operations and brackets`
· `unidad: 3` · `desde: '2026-11-30'` · `hasta: '2026-12-03'` (de lunes a jueves; la prueba 3 es el vie 4-12, sesiones 9 a 11).
**5 ★ + 5 a elegir = 100 puntos** (la ortografía es uno de los ★: el resto suma 90).

| | Ejercicio | Destreza (sesión) | Publicado |
|---|---|---|---|
| ★ | `['ortografia', 3]` «¿echo o hecho?» | — (decisión del 23-10) | sí |
| ★ | `['potencias-enteros', 1]` Cuenta los negativos | U3-3C-02 nuclear, 3C-03 (9) | sí |
| ★ | `['jerarquia-enteros', 3]` Cadenas de · y : | U3-3C-20 nuclear, 3A-03 (9) | sí |
| ★ | `['potencias-enteros', 2]` Potencia de base negativa | U3-3C-10 y 3C-11 nucleares (10) | sí |
| ★ | `['potencias-enteros', 3]` ¿Cuál es la base? | U3-3C-12 nuclear, 3C-15 (10) | sí |
| elegir | `['jerarquia-enteros', 2]` Producto o potencia dentro de una suma | U3-3A-01 y 3A-02 nucleares (11) | sí |
| elegir | `['parentesis-enteros', 1]` Quita el paréntesis | U3-3C-18 nuclear, 3C-17 (11) | sí |
| elegir | `['parentesis-enteros', 2]` Calcula | U3-3A-04 y 3C-16 nucleares (11) | sí |
| elegir | `['jerarquia-enteros', 1]` ¿Qué va primero? | U3-3A-01, 3A-02, 3A-03 (9 y 11) | sí |
| elegir | `['potencias-enteros', 4]` Cuadrados y raíces | U3-3C-13 y 3C-14 (10) | sí |
| elegir | `['leelo3', 3]` Potencias (en inglés) | U3-3B-02 (10) | sí |

`nElegir: 5` (6 en la lista).

```js
  estrella: [['ortografia', 3], ['potencias-enteros', 1], ['jerarquia-enteros', 3], ['potencias-enteros', 2], ['potencias-enteros', 3]],
  elegir: [['jerarquia-enteros', 2], ['parentesis-enteros', 1], ['parentesis-enteros', 2], ['jerarquia-enteros', 1], ['potencias-enteros', 4], ['leelo3', 3]],
  nElegir: 5,
```

Criterio (el de la 93 y la 94): los ★ son de las sesiones 9 y 10, que el alumno ha visto antes de hacer la tarea; lo de la sesión 11 va en
«a elegir» porque se da el jueves 3-12, el mismo día del plazo. Pero aquí son **cuatro ejercicios nucleares** de esa sesión (jerarquía con
enteros y quitar paréntesis), y con 5 de 6 a elegir el alumno hace al menos tres de ellos. **Alternativa**, si prefieres que la jerarquía
y los paréntesis sean obligatorios (pesan mucho en la prueba del viernes): pasar `jerarquia-enteros` 2 y `parentesis-enteros` 2 a ★ y
dejar `nElegir: 3` de los otros cuatro (sigue sumando 100), o alargar el plazo al viernes por la mañana.

- **Destrezas nucleares de la semana sin práctica: ninguna.** Las 10 (3A-01, 3A-02, 3A-04, 3C-02, 3C-10, 3C-11, 3C-12, 3C-16, 3C-18 y 3C-20)
  tienen al menos un ejercicio en la lista. No nucleares sin ejercicio en la tarea: U3-3C-21 (problema con producto o cociente, sesión 9),
  que solo sale en `variacion` 5, de la semana 4 y aún sin publicar; y U3-3C-19 (encontrar el error con paréntesis), que está en `errores3`
  1, también de la semana 4.
- Validada con `erroresTareas`: sin errores.

## Para la 96
- **Sin publicar y LISTA cuando se arregle: la 84 (`dos-signos`)**, reabierta por la 94. La ficha de la 96 solo le deja publicar «las que
  reabrió la anterior»: la 95 no ha reabierto ninguna, pero la 84 tiene que publicarla alguien, y antes del jueves 19-11 (semana 2).
- `variacion` ej. 2 («La diferencia»), visto de pasada en su ENTREGA: «Burgos −12..8 / Málaga 10..30; Moscú −25..3 / Murcia 8..35» con
  rangos que «no se solapan». Si el enunciado da las dos temperaturas como del mismo momento, Moscú −25 con Murcia 35 no se da el mismo día
  (es lo que la 93 reabrió en `leelo3` ej. 4). Mirarlo.

## Para Juan Luis
1. **La 84 (`dos-signos`) sigue reabierta.** Hay que abrir una sesión MEDIO para ella (la frase va en mi último mensaje). La 96 la puede
   verificar y publicar si para entonces está LISTA; si no, lo decides tú (ENTREGA de la 94, «Para Juan Luis» 1).

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/potencias-enteros/, …/jerarquia-enteros/, …/parentesis-enteros/ («Probar sin código»). `npm test`.
