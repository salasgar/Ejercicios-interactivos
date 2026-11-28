# Lista de reserva de `que-porcentaje` (tarea 229; s-20261128T130248-eea9cd09)

Calculada sobre una copia de HEAD 0bb692b y **probada contra la propia práctica** (/tmp/pu2-229-eea9/reservas.mjs, semillas 2295NN, 20 000
ítems por ejercicio): sin reserva salen ej1: 137 de la hoja (27 casos) y 183 del examen (20 casos); reservado el 1,6 %; ej1 (primeros 3 ítems): 379 de la hoja (1 caso) y 681 del examen (2 casos); reservado el 5,3 %; ej2: 146 de la hoja (26 casos) y 192 del examen (20 casos); reservado el 1,69 %; ej2 (primeros 3 ítems): 381 de la hoja (1 caso) y 654 del examen (2 casos); reservado el 5,17 %; ej3: 555 de la hoja (29 casos) y 59 del examen (10 casos); reservado el 3,07 %; ej4: 524 de la hoja (28 casos) y 77 del examen (14 casos); reservado el 3 %. Con estas huellas descartadas no queda ningún caso del papel. La hoja 3
(`hoja-unidad7-semana3.tex`, única por el acta, punto u) va en claro; el examen 3 (`casos-examen-semana3.tsv`), solo por huella (regla 9; nunca en claro).
Las huellas de la hoja que también estuvieran en el examen van solo en la lista de la hoja.

**«El mismo caso»**: como en `tanto-por-ciento` (la misma huella, para que una lista sirva a las dos): `huellaCaso('porcentaje-de', [p/100, T])`, con T el total por valor; «30 de 150», «el 20 % de 150» y «el 20 % son 30» son el mismo trío.

**Qué hay que añadir** (las huellas de abajo en un `reserva.js` nuevo, como `practicas/repartos/reserva.js`, y `huellasDe` en `logica.js`; los
generadores vuelven a sortear mientras alguna huella esté reservada, como `sinReservados` de `repartos` o de `inversa`):
```js
import { huellaCaso } from '../_comun/proporcion.js';
// ej. 1 y 2: it.N; ej. 3 y 4: it.total ('n/d', en euros si es dinero). La pregunta (parte, porcentaje o total) NO entra: el mismo trío es el mismo caso.
export function huellasDe(it) {
  const T = it.total !== undefined ? val(it.total) : fraccion(it.N);
  return [huellaCaso('porcentaje-de', [fraccion(it.p, 100), T])];
}
```
Antes de pegar, comprueba que tu `huellasDe` da las huellas de la hoja de abajo para sus casos (p. ej. la primera de la lista). Test: en 3000 ítems
por ejercicio, ninguno reservado; y `grep` del test y de `reserva.js` contra `casos-examen-semana3.tsv` antes de comitear. **Al cerrar,
`git status --porcelain practicas/que-porcentaje` tiene que salir vacío** (un `reserva.js` nuevo no entra en `git commit -- rutas` si no se nombra: incidencia
de la 228).

## Hoja 3 (en claro)

- ej. 3 a) 50 % de 70 → 10w9l23
- ej. 3 b) 25 % de 120 → blj183
- ej. 3 c) 10 % de 450 → 1dk818a
- ej. 3 d) 75 % de 40 → 1mxlbgg
- ej. 3 e) 20 % de 85 → 13g7c3g
- ej. 3 f) 1 % de 600 → 1g91wwj
- ej. 3 g) 10 % de 480 → 1k77ztf
- ej. 3 g) 5 % de 480 → 4dxxhc
- ej. 3 g) 20 % de 480 → dvj4vt
- ej. 3 g) 15 % de 480 → 1guocqa
- ej. 4 d) 150 % de 60 → 8lkkdo
- ej. 4 e) 0,5 % de 600 → 1yv6quy
- apoyo: 35 % de 60 → 1blqdl8
- ej. 5 a) 15 % de 200 → zsye7w
- ej. 5 b) 40 % de 35 → czac48
- ej. 5 c) 8 % de 650 → 2ouuer
- ej. 5 d) 65 % de 40 → bixp3n
- ej. 5 e) 20 % de 90 → 136rb2u
- ej. 6 a) 850 alumnos, 12 % en autobús → 6r17pg
- ej. 6 a) los que no (88 %) → 7zobsj
- ej. 6 b) 450 butacas, 64 % vendidas → bqz3gy
- ej. 6 b) las vacías (36 %) → 5hh3ce
- ej. 7 a) 2,5 % de 1200 huevos → 1teq92h
- ej. 7 b) 12,5 % de 3 km → xvh589
- apoyo: 16 de 64 → 1fgd3ew
- apoyo: 40 % son 18 → 1ewzlpr
- ej. 8 a) 22 de 40 → z0108x
- ej. 8 b) 21 de 28 → 1b0stze
- ej. 8 c) 6 de 120 → 10c72uh
- ej. 8 d) 45 de 75 → 177cr6t
- ej. 8 e) 19 de 25 tiros libres → 1ojm8ld
- ej. 9 a) 25 % son 17 → s8bol8
- ej. 9 b) 10 % son 23 → 9zbmi
- ej. 9 c) 70 % son 63 → xju3h6
- ej. 9 d) 252 alumnos, 45 % → 16b7pi1
- ej. 10) 360 novelas, 40 % → 1fbkalj
- ej. 11) 196 coches, 30 % libres → 1xp0jhr
- ej. 11) las libres → 1m6totn
- ej. 14 a) 1200 socios, 35 % mujeres → 12uif99
- ej. 14 b) 240 mujeres, 60 % → 1huz4yb
- ej. 14 c) 270 de 900 → qd5yv6

## Examen 3 (solo huellas; nunca en claro)

'108g71k', '10n3ky', '10wfehd', '16srv7t', '18wr3x0', '1agn7ho', '1az4fxl', '1bhcjc3', '1c29erw', '1c94ujp', '1djqk7t', '1kbndd3', '1mm3hne', '1oefigb', '1px3rm', '1qqdrsv', '1rivji', '1rtmnxj', '1suh83t', '1t8jyed', '1v6ybua', '1x8qorh', '1y1fgue', '1y7f2si', '2eslq5', '4z7i0i', '5f0e3s', '83ce0k', 'c6bfsc', 'ccdoso', 'd2a1p8', 'er77pd', 'etxanm', 'fechz6', 'k116u4', 'm5abx6', 'mckid1', 'me5lm0', 'okhw29', 'pr2mlg', 'qh1b3o', 'u4qiwu', 'v5jn6b', 'vjdgue', 'w72dqp', 'xwvf6h'
