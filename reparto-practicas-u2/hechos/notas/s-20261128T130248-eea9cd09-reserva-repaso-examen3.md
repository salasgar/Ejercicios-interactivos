# Repaso del examen 3 contra las prácticas publicadas de los paquetes 1 y 2 (tarea 229; s-20261128T130248-eea9cd09)

El examen 3 de la U7 (vie 9-4) lleva cuatro preguntas de repaso de los paquetes 1 y 2 (U7-1C-01, U7-1A-02, U7-2A-01 y U7-2C-04; acta de la 02,
«Qué evalúa cada examen»). Barridas con el `huellasDe` de **cada práctica** (su convenio, el que ya usa su `reserva.js`), 200 000 ítems por
ejercicio (/tmp/pu2-229-eea9/cotejo-repaso.mjs y desglose-*.mjs, semillas 2296NN), sobre HEAD 0bb692b:

| Práctica | Ejercicios con casos del repaso del examen 3 (ítems de 200 000) |
|---|---|
| `razones` (212) | ninguno (0 en los cuatro) |
| `tabla-proporcional` (213) | ej. 1: 95 · ej. 2: 560 · ej. 3: 110 (una tabla con las dos columnas de un problema directo del examen) |
| `regla-de-tres` (214) | ej. 1: 44 · ej. 3: 16 · ej. 4: 31 (el mismo problema directo por valor, en otro contexto) |
| `inversa` (215) | ninguno (0 en los cuatro) |
| `directa-o-inversa` (216) | ej. 3: 226 (el mismo problema inverso, a veces con el mismo contexto) |
| `repartos` (217) | ej. 1: 2223 · ej. 2: 2278 · ej. 3: 1851 · ej. 4: 2256 (≈ 1,1 % de los ítems: el mismo reparto por valor) |

**Qué hay que hacer** en cada una (reabierta de la 229, **sigue publicada**): añadir a su `reserva.js` las huellas de abajo, en su convenio, sin
tocar `huellasDe`; test: en 3000 ítems por ejercicio, ninguno reservado (el que ya tenga, con las huellas nuevas). Solo huellas: el examen 3
nunca en claro.

## `tabla-proporcional` (`huellaCaso('tabla-directa', [k, x1, x2])`, k en euros por unidad)

'15cyj0f', '18spygm', 'fhlbba', 'u4jy79'

## `regla-de-tres` (`huellaCaso('directa', [a, b, c])`, con el valor y con el valor en la unidad base)

'1bzwy1s', '1f9tygy', '1mgje8v', '1on2def', '1qdh4n4', '4ny1uz', '7walnd', 'kovjom'

## `directa-o-inversa` (`huellaCaso(sentido, [a, b, c])`)

'1bzwy1s', '1f9tygy', '1mgje8v', '1on2def', '1sfbdli', '1trqg7z', '28gp4b', 'yrqzbo'

## `repartos` (`huellaCaso('reparto', [T, r1, r2])`)

'1dvjji4', '6wu53a'
