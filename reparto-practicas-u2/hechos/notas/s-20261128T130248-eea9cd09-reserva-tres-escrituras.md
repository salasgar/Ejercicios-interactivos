# Lista de reserva de `tres-escrituras` (tarea 229; s-20261128T130248-eea9cd09)

Calculada sobre una copia de HEAD 0bb692b y **probada contra la propia práctica** (/tmp/pu2-229-eea9/reservas.mjs, semillas 2295NN, 20 000
ítems por ejercicio): sin reserva salen ej2: 3219 de la hoja (10 casos) y 613 del examen (4 casos); reservado el 19,16 %. Con estas huellas descartadas no queda ningún caso del papel. La hoja 3
(`hoja-unidad7-semana3.tex`, única por el acta, punto u) va en claro; el examen 3 (`casos-examen-semana3.tsv`), solo por huella (regla 9; nunca en claro).
Las huellas de la hoja que también estuvieran en el examen van solo en la lista de la hoja.

**«El mismo caso»** (ej. 2): el valor del porcentaje que se convierte, en cualquier sentido (35 %, 0,35 y 7/20 son el mismo caso): `huellaCaso('porcentaje-escrito', [p/100])`. El ej. 1 (los seis porcentajes fáciles) no tiene casos: es la tabla que la hoja (apoyo de la sesión 9) y la propia práctica enseñan para aprendérsela, como las situaciones sin números propios de la 156 y la 157. El ej. 3 (tres fracciones a la vez) y el ej. 4 (cuatro números) se cotejaron como ítem entero (el trío; los tres o los dos números de los ej. 4 a, b y c de la hoja): 0 en 20 000; no necesitan reserva.

**Qué hay que añadir** (las huellas de abajo en un `reserva.js` nuevo, como `practicas/repartos/reserva.js`, y `huellasDe` en `logica.js`; los
generadores vuelven a sortear mientras alguna huella esté reservada, como `sinReservados` de `repartos` o de `inversa`):
```js
import { huellaCaso } from '../_comun/proporcion.js';
export function huellasDe(it) {
  if (it.ejercicio === 2) return [huellaCaso('porcentaje-escrito', [fraccion(it.p, 100)])];
  return [];   // ej. 1 (los seis porcentajes fáciles: una tabla que se aprende), ej. 3 y ej. 4: 0 casos del papel (ver abajo)
}
```
Antes de pegar, comprueba que tu `huellasDe` da las huellas de la hoja de abajo para sus casos (p. ej. la primera de la lista). Test: en 3000 ítems
por ejercicio, ninguno reservado; y `grep` del test y de `reserva.js` contra `casos-examen-semana3.tsv` antes de comitear. **Al cerrar,
`git status --porcelain practicas/tres-escrituras` tiene que salir vacío** (un `reserva.js` nuevo no entra en `git commit -- rutas` si no se nombra: incidencia
de la 228).

## Hoja 3 (en claro)

- ej. 1 a) 35 % → uu27wm
- ej. 1 b) 4 % → 6wrlc3
- ej. 1 c) 0,7 → 2j3lnh
- ej. 1 d) 0,08 → work6k
- ej. 1 e) 17/20 → 1d6wku9
- ej. 1 f) 13/50 → 1gkqejm
- apoyo: 15 % = 15/100 = 3/20 = 0,15 → bj9wde
- ej. 2 a) 5 % como decimal → 7qqef0
- ej. 2 b) 0,3 como porcentaje → 9v94pl
- ej. 2 c) 40 % = 0,04 (Rosa) → 1dwlobo

## Examen 3 (solo huellas; nunca en claro)

'1362yzf', '1j6y5sq', '1y7t893', 'd6chw4'
