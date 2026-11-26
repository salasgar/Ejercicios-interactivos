# Lista de reserva de `tabla-proporcional` (tarea 227; s-20261126T211424-60469b12, relevo de s-20261126T163420-462f6c1c)

Calculada sobre HEAD 777a0da (el código de `tabla-proporcional` no ha cambiado desde e4eb054) y **probada contra la propia práctica**: en
una copia de /tmp, descartando los ítems con alguna huella de esta lista, el barrido de 200 000 ítems por ejercicio da **0 casos** de la
hoja 1 y del examen 1; la variedad máxima no cambia (0,04 %, 0,01 % y 0,01 % en los ej. 1, 2 y 3) y se descartan el 1,1 %, el 3,9 %
y el 0,7 % de los ítems. Sin la reserva salen, de 200 000: ej. 1, 2185 ítems (826 del examen); ej. 2, 7490 (542 del examen); ej. 3, 1478
(ninguno del examen). Script: /tmp/pu2-227-6046/reserva-213.mjs (se pierde al reiniciar el Mac).

**«El mismo caso»** es por valor, sea cual sea el contexto: el mismo precio por unidad `k` (en euros, no en céntimos, o en la unidad de la
fila de abajo) y **todas las columnas `x` del caso del papel dentro de la tabla del ítem** (la tabla del papel cabe en la de la app). En el
ej. 1, las tablas no proporcionales también cuentan: se mira cada grupo de columnas que sí sea proporcional.

**Qué hay que añadir a `logica.js`** (y meter las huellas de abajo en un `reserva.js` nuevo, como `practicas/razones/reserva.js`):
```js
import { huellaCaso } from '../_comun/proporcion.js';
import { fraccion } from '../_comun/fracciones.js';
/** Las huellas de un ítem de los ej. 1-3: una por cada grupo de columnas que sea proporcional (x tal como se ve; el coche, en km). */
export function huellasDe(it) {
  const din = (CONTEXTOS[it.ctx] ?? CTX_CONSTANTE[it.ctx]).din, out = [];
  for (let m = 1; m < 1 << it.cols.length; m++) {
    const s = it.cols.filter((_, i) => m & (1 << i));
    if (!s.every(q => q.y * s[0].x === s[0].y * q.x)) continue;
    const k = fraccion(s[0].y, s[0].x * (din ? 100 : 1));
    out.push(huellaCaso('tabla-directa', [k, ...s.map(q => q.x).sort((a, b) => a - b).map(x => fraccion(x, 1))]));
  }
  return out;
}
```
Con `fraccion` de `_comun/fracciones.js` (la que usé; si usas `F`, comprueba antes que `huellaCaso` de `F(270, 300)` da lo mismo que la de
`F(9, 10)`). Los tres generadores vuelven a sortear mientras `huellasDe(it).some(h => HUELLAS_RESERVADAS.has(h))`. Test: en 3000 ítems por
ejercicio, ninguno reservado y `huellasDe` nunca vacía; `HUELLAS_RESERVADAS.size === 14`; y `grep` del test y de `reserva.js` contra el TSV
del examen antes de comitear (ningún caso del examen en claro).

## Hoja 1 (en claro)

- recuadro «Recuerda»: 3 latas 2,70 € y 5 latas 4,50 € (0,90 € cada una) → 1fl9pbl
- ej. tabla A: manzanas, 2, 3 y 5 kg a 1,70 € el kilo → 6t6wou
- ej. tabla C: bolígrafos, 3, 6 y 10 a 1,30 € → 4l1n0m
- ej. a): aceite, 2 botellas 11,80 € (5,90 € cada una) → 1lpjwjy
- ej. b): aparcamiento, 3 h 5,70 € (1,90 € la hora) → w10klp
- ej. c): patatas, 4 kg 3,60 € (0,90 € el kilo) → gezr97

(La tabla B de la hoja, edad y altura, no es proporcional: no hay caso que reservar.)

## Examen 1 (solo huellas; nunca en claro)

- U7-1C-07 → 1aoxp36, 173ytmr, 1vvzfd2, eqpwjo
- U7-1C-09 → id3492, g0etuf, 2cbyce, kvzlgk

(Las de U7-1C-09 no las saca hoy ningún generador, pero se reservan igual. U7-1C-08 es de frases sin el mismo dato que el banco del
ej. 4: no hay caso que reservar.)
