# Entrega de la tarea 103 · La fracción de una cantidad (fraccion-de)

Sesión `s-20261102T092216-fe590005`, 2026-11-02. Corrige la reabierta del 30-10
(`hechos/reabiertas/103--s-20261030T081542-dab2aa98-revision.md`). Commit del código: **92df0dd**.

## Qué corrige

1. **Casos de examen por huella (regla nueva de la reabierta): `huella` (FNV-1a de 32 bits) sobre
   la clave del ítem** — `n/d de T` (ej. 1-2), la pareja (parte, otra parte) sin orden (ej. 3) y
   la fracción (o las dos, sin orden) con el dato o el total (ej. 4) — comparada contra tres
   `Set` de huellas (`HUELLAS_EJ1`, `HUELLAS_EJ3`, `HUELLAS_EJ4` en `logica.js`). Las huellas se
   calcularon con un guion de scratchpad (no comiteado) que leyó `casos-examen-semanaN.tsv` de
   las tres semanas y los tres `.tex` del examen final de `4. Fractions/`; **ningún caso en claro
   entra en el repositorio**. Cubre `U4-1C-08`, `U4-1A-01`, `U4-1A-03`, `U4-1A-02`, `U4-2A-02`
   (semanas 2 y 3) y `U4-2A-03`, más las fracciones derivadas de los «5a» de los tres modelos del
   examen final.
2. **Casos de las hojas (en claro) añadidos a `RESERVADOS`**: `fraccionDe` (1/3 de 27, 1/4 de 52,
   2/3 de 27, 5/6 de 42, 3/8 de 64, 7/10 de 90, 3/7 de 28), `parte` ([6,20], [14,20]) y `problema`
   (3/7+96, 5/9+12, 2/3+18, 3/7+36, 2/9 y 1/6 de 180).
3. **`duplica-el-dato` y `multiplica-el-dato-por-el-denominador` en singular cuando la fracción
   vale 1 parte**, y **`resta-el-numerador` en singular cuando el numerador es 1** (textos.js,
   helper `singular`/`partes`).
4. **`cuenta-una-parte-de-menos`/`-de-mas` y `da-la-parte-ya-hecha` con «de … cada una»/«… each»**:
   «11 partes de 3» se leía como «11 de cada 3» (fracción), no como «11 trozos de tamaño 3».
5. **`comoFraccion` simplifica siempre**: la opción «ha dado la fracción en vez de la cantidad»
   podía salir sin simplificar (`da-la-fraccion-en-vez-de-la-cantidad`); ahora es irreducible,
   como las fracciones del enunciado.

## Ficheros
`practicas/fraccion-de/{logica.js,textos.js}` (no se tocó `index.html`, `practica.js` ni
`estilos.css`) y `tests/practicas-fraccion-de.test.js` (65 tests; dos nuevos: huellas y
singular/«cada una» del ejercicio 4, sobre 3000 ítems con semilla fija).

## Probarlo en 1 minuto
`node --test tests/practicas-comun.test.js tests/practicas-fraccion-de.test.js` (65/65) y
`npm test` (1359/1359). En el navegador (`npm run servir` →
http://localhost:8080/practicas/fraccion-de/ → «Probar sin código»; el código 7NPD volvió a
decir «no existe» en esta máquina): ejercicio 4 a 375 px, ES y EN, fallando a propósito
`resta-el-numerador` con n = 1 («… como si fuera 1 trozo» / «as if it were 1 slice», singular) y
`duplica-el-dato` («aquí 250 es 5 partes de 12»); ejercicio 3 con dos ítems acertados.

## Segunda reabierta (2-11, sesión `s-20261102T151801-c080c1cd`; commit **b4fbd71**)
Reabierta de la 119 (`hechos/reabiertas/103--s-20261102T141053-b5277421-revision.md`): el ej. 4 se filtraba con
`claveProblema`, que en `queda` es `n/d|total`, y sus huellas no incluían los casos de U4-1A-01. Ahora `HUELLAS_EJ4`
lleva, para U4-1A-01, U4-2A-02 y U4-3A-04 de los tres exámenes semanales (extras incluidas), cada fracción y cada pareja
con cada cantidad del enunciado, con las claves de `queda` y `dos`: 25 → 61 huellas (ninguno de los casos en claro). Sobre-excluye a
propósito (un paso del mismo problema también cuenta, como en la 117). Test nuevo: 3000 ítems de `generarProblema`
(tres semillas) sin ningún caso de examen. Barrido independiente aparte (guion de scratchpad, 60000 ítems de ej. 4 contra
los tres `casos-examen-semanaN.tsv`, misma fracción y mismo total en `queda`/`dos`): 0 coincidencias, salvo las de
U4-1C-08 (sin contexto: «n/d de T», no cuenta, como dice la reabierta). Tests propios 63/63 y `npm test` 1365/1365.
Sin probar en navegador: el cambio es solo un conjunto de huellas. No se tocó `catalogo.js`.

## Tercera reabierta (6-11, sesión `s-20261106T144247-865eb0fb`; commit **b91b092**)
Reabierta de la 162 (`hechos/reabiertas/103--s-20261106T124028-694d9f2a-revision.md`). Tres cosas, ninguna en claro:
1. **Fracción suelta con su total contra `HUELLAS_EJ4`** (misma clave `n/d|total` que `queda`): en el ej. 4 `dos`
   (`esCasoExamenProblema`, cada una de las dos fracciones) y en los ej. 1 y 2 (`esCasoExamenCalculo`, además de `HUELLAS_EJ1`).
   Sobre-excluye a propósito: también cuenta un paso del problema de examen.
2. **Ahorro creíble** (`queda` y `dos`): nueva cota `gastoMax: 250` € por compra en `ESCENARIOS.*.ahorro`; el ítem que la
   pasa se descarta. En `dos`, «un libro» pasa a «ropa» / «clothes (ropa)» (el regalo se queda). `gastosDe(item)` expone los gastos para el test.
3. **Tests** (`tests/practicas-fraccion-de.test.js`, 67 en total): (a) todo lo que es caso en `queda` lo es en `dos` en cualquier
   posición y en los ej. 1-2 (barrido de n/d y total sin exponer casos), y 3 semillas × 3000 ítems de ej. 1, 2 y 4 sin ninguno;
   (b) 3 × 3000 ítems de ej. 4: cada compra de ahorro ≤ 250 € y el libro ya no está en los textos.
Barrido independiente (guion de scratchpad, casos de U4-1A-01, 2A-02 y 3A-04 de los tres `casos-examen-semanaN.tsv`, cada fracción
con cada cantidad del enunciado, 120000 ítems por ejercicio): ej. 1 y 2: **0**; ej. 4 `queda` y `dos`: **0** (antes, 257 y 118 por
cada 100000). Quedan 683 coincidencias en las variantes inversas `parte` (517) y `restante` (166): son el hallazgo 1 de la 162
(la cantidad del examen es el total de la práctica; no es la misma tarea ni un paso), que no se excluye porque la reabierta no lo
pedía; lo decide Juan Luis o la coordinadora.
Sin probar en navegador (cambia una cota, huellas y una palabra del texto). No se tocó `catalogo.js`. Sigue **sin publicar**; plazo jue 17-12.
