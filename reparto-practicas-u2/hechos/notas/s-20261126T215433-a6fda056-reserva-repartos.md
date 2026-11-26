# Lista de reserva de `repartos` (tarea 228; s-20261126T215433-a6fda056)

Calculada sobre una copia de HEAD 54747b6 y **probada contra la propia práctica** (/tmp/pu2-228-a6fd/reservas.mjs, semillas 2280NN):
sin reserva salen, de 20 000 ítems por ejercicio, ej. 1: 709 de la hoja y 43 del examen; ej. 2: 672 y 48; ej. 3: 511 y 29; ej. 4: 535 y 48.
Con estas huellas descartadas no queda ningún caso del papel. La hoja 2 va en claro; el examen 2, solo por huella (regla 9; nunca en claro).
Las huellas de la hoja que también estuvieran en el examen van solo en la lista de la hoja.

**«El mismo caso»**: el total por valor (el dinero en euros; los mL y los cromos, tal cual; sin unidades ni contexto: 45 caramelos y 45,00 € son el mismo
caso) y la razón irreducible y ordenada de menor a mayor (`3 : 5` y `5 : 3` son el mismo reparto con los nombres cambiados):
`huellaCaso('reparto', [T, r1, r2(, r3)])`. Sirve para los cuatro ejercicios.

**Qué hay que añadir** (las huellas de abajo en un `reserva.js` nuevo, como `practicas/regla-de-tres/reserva.js`, y `huellasDe` en `logica.js`;
los generadores vuelven a sortear mientras alguna huella esté reservada, como `sinReservados` de `regla-de-tres`):
```js
import { huellaCaso } from '../_comun/proporcion.js';
const mcd = (x, y) => (y === 0 ? x : mcd(y, x % y));
export function huellasDe(it) {
  const g = mcd(it.a, it.b), T = CONTEXTOS[it.ctx].din ? new Fraccion(it.T, 100) : new Fraccion(it.T, 1);
  return [huellaCaso('reparto', [T, ...[it.a / g, it.b / g].sort((p, q) => p - q).map(v => new Fraccion(v, 1))])];
}
```
Test: en 3000 ítems por ejercicio, ninguno reservado; y `grep` del test y de `reserva.js` contra `casos-examen-semana2.tsv` antes de comitear.

## Hoja 2 (en claro)

- apoyo: 140,00 € en 3 : 4 → 1vj1gwk
- ej. 11 a) 56,00 € en 3 : 5 → mz9ag3
- ej. 11 b) 45 caramelos en 4 : 5 → j5xawu
- ej. 11 c) 72,00 € en 2 : 3 : 4 → 7iv4j0
- ej. 12) 180,00 € en 3 : 2 → k71efq
- ej. 13 a) 200,00 € en 8 : 5 : 7 → 1q6k3z2
- ej. 13 b) 64,00 € en 5 : 3 → ap3sq
- ej. 14 a) 60,00 € en 1 : 2 : 3 → 1ljunv4
- ej. 14 b) 50,00 € en 2 : 3 → hu6ddc
- ej. 14 c) 90,00 € en 2 : 7 → 19ibks8
- ej. 15) 4 : 7 con 36,00 € (99,00 €) → knm2l9

## Examen 2 (solo huellas; nunca en claro)

'10ntvx0', '12cqlr8', '1d2f889', '1ebmd5c', '1mvczee', '1my0llq', '1ne6wzz', '1pqcg9q', '1qbfjlt', '1sns2mm', '1uf3z5z', '1xi3ex3', '40tdob', '4nto5t', 'cloo1o', 'gx18dn', 'o5ue5d', 'su7zpq'
