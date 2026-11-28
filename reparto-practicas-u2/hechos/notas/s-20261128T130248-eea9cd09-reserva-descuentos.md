# Lista de reserva de `descuentos` (tarea 229; s-20261128T130248-eea9cd09)

Calculada sobre una copia de HEAD 0bb692b y **probada contra la propia práctica** (/tmp/pu2-229-eea9/reservas.mjs, semillas 2295NN, 20 000
ítems por ejercicio): sin reserva salen ej1: 54 de la hoja (6 casos) y 48 del examen (8 casos); reservado el 0,51 %; ej2: 1741 de la hoja (8 casos) y 20 del examen (8 casos); reservado el 8,8 %; ej3: 234 de la hoja (3 casos) y 164 del examen (3 casos); reservado el 1,99 %; ej4: 108 de la hoja (9 casos) y 77 del examen (11 casos); reservado el 0,93 %; ej5: 0 de la hoja (0 casos) y 481 del examen (1 caso); reservado el 2,4 %. Con estas huellas descartadas no queda ningún caso del papel. La hoja 3
(`hoja-unidad7-semana3.tex`, única por el acta, punto u) va en claro; el examen 3 (`casos-examen-semana3.tsv`), solo por huella (regla 9; nunca en claro).
Las huellas de la hoja que también estuvieran en el examen van solo en la lista de la hoja.

**«El mismo caso»**: el precio en euros y el porcentaje, con el tipo (un descuento o un aumento; el IVA es un aumento): `huellaCaso('descuento' | 'aumento', [P, p/100])`; el multiplicador de un paso sin precio (ej. 2, «elegir»): `huellaCaso('multiplicador-descuento' | 'multiplicador-aumento', [p/100])`; dos cambios seguidos (ej. 5): `huellaCaso('cadena', [P, ±p1/100, ±p2/100])`.

**Qué hay que añadir** (las huellas de abajo en un `reserva.js` nuevo, como `practicas/repartos/reserva.js`, y `huellasDe` en `logica.js`; los
generadores vuelven a sortear mientras alguna huella esté reservada, como `sinReservados` de `repartos` o de `inversa`):
```js
import { huellaCaso } from '../_comun/proporcion.js';
// P en céntimos → euros; el IVA es un aumento; el multiplicador de un paso, sin precio, también es un caso (ej. 2, «elegir»)
export function huellasDe(it, n) {
  const P = () => new Fraccion(it.P, 100), p = x => new Fraccion(x, 100);
  if (n === 1 || n === 4) return [huellaCaso(it.tipo === 'descuento' ? 'descuento' : 'aumento', [P(), p(it.p)])];
  if (n === 2) return it.modo === 'elegir' ? [huellaCaso(`multiplicador-${it.tipo}`, [p(it.p)])] : [huellaCaso(it.tipo, [P(), p(it.p)])];
  if (n === 3) return [huellaCaso('aumento', [P(), p(it.r)])];
  const s = it.orden === 'sube-baja' ? 1 : -1;
  return [huellaCaso('cadena', [P(), p(s * it.p), p(-s * it.p)])];
}
```
Antes de pegar, comprueba que tu `huellasDe` da las huellas de la hoja de abajo para sus casos (p. ej. la primera de la lista). Test: en 3000 ítems
por ejercicio, ninguno reservado; y `grep` del test y de `reserva.js` contra `casos-examen-semana3.tsv` antes de comitear. **Al cerrar,
`git status --porcelain practicas/descuentos` tiene que salir vacío** (un `reserva.js` nuevo no entra en `git commit -- rutas` si no se nombra: incidencia
de la 228).

## Hoja 3 (en claro)

- apoyo: zapatillas 70,00 €, 30 % → 13zw44b
- apoyo: pagar el 70 % (0,70) → 67ei4
- ej. 12 a) chaqueta 56,00 €, 25 % → 1n4k8ps
- ej. 12 b) gimnasio 35,00 €, sube 4 % → 1jb223x
- ej. 12 c) vaqueros 50,00 €, 20 % → xba211
- ej. 13 a) bici 120,00 €, 15 % → kmebgw
- ej. 13 a) en un paso: pagar el 85 % → 14ouu9z
- ej. 13 b) casco 30,00 € + 21 % → p8gtmo
- ej. 13 c) libro 15,00 € + 4 % → 12c8qz
- ej. 14 d) 40,00 € → 34,00 € → 1qguzd5
- ej. 15 a) 64,00 € tras un 20 % → vryakc
- ej. 15 b) 40,00 €, +20 % y −20 % → djxs6g
- ej. 15 c) 200,00 €, −20 % y −10 % → 1k8mkij

## Examen 3 (solo huellas; nunca en claro)

'10nwop', '15gjqm', '19642uc', '19yb0wv', '1af2gbz', '1bkxduc', '1g7yuv7', '1peglmh', '1ui0k8', '1waptnc', '3a1vfw', '4rgfeo', '9yeqa4', 'b91i5m', 'gm03x8', 'hvwohi', 'i6m8cb', 'ingisc', 'lyxydh', 'ouiwdd', 'psrucl', 'xdwcjq', 'xzxitk'
