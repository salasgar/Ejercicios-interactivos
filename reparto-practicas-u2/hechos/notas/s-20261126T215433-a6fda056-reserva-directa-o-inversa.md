# Lista de reserva de `directa-o-inversa` (tarea 228; s-20261126T215433-a6fda056)

Calculada sobre una copia de HEAD 54747b6 y **probada contra la propia práctica** (/tmp/pu2-228-a6fd/reservas.mjs, semillas 2280NN):
sin reserva salen, de 20 000 ítems por ejercicio, ej. 2: 3 (hoja; 0 del examen); ej. 3: 98 de la hoja y 22 del examen.
Con estas huellas descartadas no queda ningún caso del papel. La hoja 2 va en claro; el examen 2, solo por huella (regla 9; nunca en claro).
Las huellas de la hoja que también estuvieran en el examen van solo en la lista de la hoja.

**«El mismo caso»**: por valor y sin unidades ni contexto. Ej. 2: la tabla, por cada par y cada trío de columnas (x, y) ordenados por x
(`huellaCaso('columnas', [x1, y1, x2, y2(, x3, y3)])`). Ej. 3: «a ⟶ b; c ⟶ ?» con su sentido (`huellaCaso(item.sentido, [a, b, c])`,
con `val` de `logica.js`); del papel, el tiempo también en minutos y en horas. El ej. 1 (situaciones sin números propios) no tiene casos con
el criterio de la 156 y la 157 («el vocabulario y las construcciones sin número propio no son casos»).

**Qué hay que añadir** (las huellas de abajo en un `reserva.js` nuevo, como `practicas/regla-de-tres/reserva.js`, y `huellasDe` en `logica.js`;
los generadores vuelven a sortear mientras alguna huella esté reservada, como `sinReservados` de `regla-de-tres`):
```js
import { huellaCaso } from '../_comun/proporcion.js';
const subconj = (xs, k) => k === 0 ? [[]] : xs.flatMap((x, i) => subconj(xs.slice(i + 1), k - 1).map(s => [x, ...s]));
const hColumnas = cols => huellaCaso('columnas', [...cols].sort((p, q) => p[0] - q[0]).flat().map(v => fraccion(v, 1)));
export function huellasDe(it) {
  if (it.n === 2) return [2, 3].flatMap(k => subconj(it.xs.map((x, i) => [x, it.ys[i]]), k).map(hColumnas));
  if (it.n === 3) return [huellaCaso(it.sentido, [val(it.a), val(it.b), val(it.c)])];
  return [];
}
```
Test: en 3000 ítems por ejercicio, ninguno reservado; y `grep` del test y de `reserva.js` contra `casos-examen-semana2.tsv` antes de comitear.

## Hoja 2 (en claro)

- ej. 1 a) autocares (5, 54) y (6, 45) → mydktq
- ej. 1 b) gastado y lo que queda (6, 24) y (12, 18) → 1iy4bgp
- ej. 1 c) libro (10, 18) y (20, 9) → 12bd8re
- ej. 4 A) (2, 9), (3, 6), (6, 3) → 1ximiom
- ej. 4 B) (5, 25), (10, 20), (15, 15) → 1r7811g
- ej. 4 C) (12, 40), (16, 30), (24, 20) → 1bkyi58
- apoyo: 5 limpiadores, 8 h → 4 → vzm7dg, 1uw7feg
- ej. 5 a) 4 pintores, 9 días → 6 → cr0qvi
- ej. 5 b) 6 grifos, 14 h → 7 → 2ryuuv, o21u88
- ej. 5 c) 8 jardineros, 15 días → 10 días → 11zeyow, dan3h6
- ej. 6) 6 pintores, 12 días → 3 → 45825
- ej. 7 a) 12 caballos, 36,00 € al día → 15 → 18uhyb7
- ej. 7 b) 12 caballos, 25 días → 15 → 1q2a8aj
- ej. 8 a) 3 kg, 4,80 € → 7 kg → mxlyyx
- ej. 8 b) 80 km/h, 3 h → 120 km/h → qao8nx, 159umfb
- ej. 8 c) 4 personas, 2 huevos → 10 → 1lrf0l6
- ej. 8 d) 10 máquinas, 9 h → 6 → 1yycufx, 1ghcw39
- ej. 9 a) 6 máquinas, 2 h 20 min → 4 → xvz3ya, 1ubyck6
- ej. 9 b) 3 cocineros, 2 h 40 min → 4 → o46umj, 4bpzx4
- ej. 9 c) 100 km/h, 1 h 12 min → 90 km/h → 1cvcw16, 12vq3lf
- ej. 10 a) 10 perros, 4 semanas → 14 → 11zr2jv, 1jcq0vd
- ej. 10 b) 10 perros, 4 semanas → 8 → 1yl46cm, 3ia8s8

## Examen 2 (solo huellas; nunca en claro)

'10wgj39', '151bjhe', '1595724', '17w4tx6', '18ym7lw', '1a6byf4', '1jzatvw', '1p2g6x4', '1ub0d5j', '1vw72wv', '1vyla4b', '1w8larv', '1wy0fnv', '40mmpq', '730mzi', 'bqsjbv', 'c6yt4n', 'c7pija', 'eyqei4', 'h4wn4v', 'i4yeai', 'iobc6q', 'l7vn5j', 'qie8vl', 't39bgp', 'xg7hns'
