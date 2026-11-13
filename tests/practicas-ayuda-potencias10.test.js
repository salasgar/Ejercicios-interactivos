// «No lo sé» en `potencias10` (tarea 188): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/potencias10/logica.js';
import * as X from '../practicas/potencias10/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(\d+)<\/sup>/g, '^$1').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.;,:])/g, '$1');
const AG = n => L.agrupar(n).replace(/\s/g, ' ');   // «1 000» lleva espacio duro; plano() lo normaliza
const RESP ={ es: 'La respuesta es', en: 'The answer is' };
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('potencias10 · ejercicio 1: la explicación lleva la posición del deslizador y el número', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(L.generarDeslizador, 1)) {
    vistos[item.pide] = (vistos[item.pide] ?? 0) + 1;
    const t = plano(X.explicaDeslizador(item, ctx(idioma)));
    assert.ok(L.esRespuestaDeslizador(item, item.n));
    assert.ok(t.includes(`${RESP[idioma]} ${item.n}:`), t);
    assert.ok(t.includes(`10^${item.n} = ${AG(10 ** item.n)}`), t);
    assert.ok(t.includes(L.enNum(10 ** item.n)) && t.includes(L.esNum(10 ** item.n)), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['ceros', 'cifras', 'potencia']);
});

test('potencias10 · ejercicio 2: «and» y cifras llevan los números que da por buenos el ejercicio', () => {
  const vistos = { and: 0, cifras: 0 };
  const gen = rng => (rng.azar() < 0.5 ? L.generarAnd(rng) : L.generarCifras(rng));
  for (const idioma of IDIOMAS) for (const item of generar(gen, 2)) {
    vistos[item.tipo]++;
    const t = plano(X.explicaAndOCifras(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'and') {
      item.nombres.forEach((nombre, i) => assert.ok(t.includes(`${nombre} = ${AG(item.numeros[item.solucion[i]])}`), t));
    } else {
      assert.ok(L.esRespuestaCifras(item, String(item.n)));
      assert.ok(t.endsWith(`${RESP[idioma]} ${AG(item.n)}.`), t);
    }
  }
  assert.ok(vistos.and > 0 && vistos.cifras > 0);
});

test('potencias10 · ejercicio 3: billion lleva la opción correcta (o sí/no) de cada clase', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(L.generarBillion, 3, 2000)) {
    vistos[item.clase] = (vistos[item.clase] ?? 0) + 1;
    const t = plano(X.explicaBillion(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.clase === 'mismo') {
      assert.ok(t.endsWith(`${RESP[idioma]} ${item.verdad ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No'}.`), t);
    } else if (item.clase === 'potencia') {
      const { c, e } = item.opciones[item.solucion];
      assert.deepEqual([c, e], [item.c, item.e]);
      assert.ok(t.endsWith(`${RESP[idioma]} ${c > 1 ? `${c} · 10^${e}` : `10^${e}`}.`), t);
    } else {
      assert.ok(t.endsWith(`${RESP[idioma]} ${item.opciones[item.solucion]}.`), t);
    }
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['espanol', 'mismo', 'nombre', 'potencia']);
});
