// «No lo sé» en transposicion (tarea 176): cada explicación lleva la solución que el ejercicio da por buena.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import * as L from '../practicas/transposicion/logica.js';
import * as X from '../practicas/transposicion/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinRestos = (html, donde) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, donde);
  assert.ok(html.length > 40, donde);
};
/** «x = 5» o «x = −3/4» en texto plano, tal como lo escribe la explicación (la fracción con raya queda «−3 4»). */
const termina = (html, esperado, donde) => assert.ok(plano(html).includes(esperado), `${donde}: falta «${esperado}» en «${plano(html)}»`);

test('transposicion ej. 1: la explicación lleva la operación o el número que falta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarConNumeros, 1)) {
      const html = X.explicaConNumeros(item, ctx(idioma));
      sinRestos(html, `ej1 ${idioma}`);
      termina(html, `${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${item.respuesta}.`, 'ej1');
      termina(html, item.tipo === 'operador' ? `${item.izq} = ${item.der} ${item.respuesta} ${item.bnum}` : X.llegadaCon(item, item.respuesta), 'ej1 cuenta');
    }
  }
});

const fraccionPlano = p => { const f = L.F(p).simplificar(); return f.den === 1 ? `${L.num(f.num)}` : `${L.num(f.num)}${f.den}`; };

for (const [n, nombre, generar, explica] of [
  [2, 'una operación', L.generarUnaOperacion, X.explicaUnaOperacion],
  [3, 'dos operaciones', L.generarDosOperaciones, X.explicaDosOperaciones],
  [4, 'frente', L.generarFrente, X.explicaFrente],
]) {
  test(`transposicion ej. ${n} (${nombre}): la explicación termina con la solución del ítem`, () => {
    for (const idioma of IDIOMAS) {
      for (const item of items(generar, 10 + n)) {
        const html = explica(item, ctx(idioma));
        sinRestos(html, `ej${n} ${idioma}`);
        termina(html, `${idioma === 'es' ? 'La respuesta es' : 'The answer is'} x = ${fraccionPlano(item.solucion)}.`, `ej${n}`);
        // Fracciones con raya, nunca con barra (revisión 191: el ej. 3 decía «x/3» y el 4, «−3/7»).
        assert.doesNotMatch(plano(html), /\d\/\d|x\//, `ej${n}: fracción con barra — ${plano(html)}`);
        // El ej. 3 hace la cuenta del primer paso antes del segundo.
        if (n === 3) {
          const r = L.segundoPaso(item).c;
          assert.match(plano(html), new RegExp(`${idioma === 'es' ? 'o sea' : 'that is'}, [^.]*= ${L.num(r)}\\.`), `ej3 cuenta — ${plano(html)}`);
        }
      }
    }
  });
}

test('transposicion ej. 5: dice si estaba bien y, si no, la solución correcta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of items(L.generarComprueba, 25)) {
      const html = X.explicaComprueba(item, ctx(idioma));
      sinRestos(html, `ej5 ${idioma}`);
      // El feedback de «signo-cambiado» dice «es positivo» aunque sea negativo: la tarjeta no lo repite (revisión 191).
      assert.doesNotMatch(plano(html), /es positivo \(−|is positive \(−|es negativo \((?!−)|is negative \((?!−)/, `ej5 signo — ${plano(html)}`);
      if (item.buena) termina(html, idioma === 'es' ? 'La respuesta es sí, está bien.' : 'The answer is yes, it is right.', 'ej5');
      else termina(html, `x = ${fraccionPlano(item.solucion)}.`, 'ej5');
    }
  }
});
