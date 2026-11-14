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
    // Revisión 193: «La respuesta es 10^n» (o «n ceros») y el deslizador entre paréntesis, al final.
    const sol = item.pide === 'ceros' ? `${item.n} ${idioma === 'es' ? 'ceros' : 'zeros'}` : `10^${item.n}`;
    assert.ok(t.endsWith(`${RESP[idioma]} ${sol} ${idioma === 'es' ? `(el deslizador, en ${item.n})` : `(the slider at ${item.n})`}.`), t);
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
      // Revisión 193: el botón entre comillas (sin mayúscula a media frase) y la frase de delante con mayúscula.
      const boton = item.verdad ? (idioma === 'es' ? '«Sí»' : '“Yes”') : (idioma === 'es' ? '«No»' : '“No”');
      assert.ok(t.endsWith(`${RESP[idioma]} ${boton}.`), t);
      assert.equal(L.enNum(item.a.valor, { gb: /thousand million/.test(item.a.texto) }), item.a.texto);
      assert.equal(item.a.valor === item.b.valor, item.verdad);
      assert.ok(t.includes(item.verdad ? (idioma === 'es' ? 'Son el mismo número.' : 'They are the same number.') : (idioma === 'es' ? 'Son números distintos.' : 'They are different numbers.')), t);
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

// ─── Revisión 193 ───────────────────────────────────────────────────────────────

test('potencias10 · ejercicio 2 (revisión 193): sin la regla falsa del «and», sin «·» entre grupos, respuesta al final', () => {
  const gen = rng => (rng.azar() < 0.5 ? L.generarAnd(rng) : L.generarCifras(rng));
  for (const idioma of IDIOMAS) for (const item of generar(gen, 32)) {
    const t = plano(X.explicaAndOCifras(item, ctx(idioma)));
    assert.ok(!t.includes('·'), `el «·» es el producto en la U1: ${t}`);
    assert.ok(!/La respuesta es:|The answer is:/.test(t), t);
    assert.ok(!/unidades sueltas|loose units/.test(t), `«el and marca las unidades» no vale para «… and sixty thousand»: ${t}`);
    assert.equal(t.split(RESP[idioma]).length, 2, t);
    if (item.tipo === 'and') {
      const [x, y] = item.nombres.map((nombre, i) => `${nombre} = ${AG(item.numeros[item.solucion[i]])}`);
      assert.ok(t.endsWith(`${RESP[idioma]} ${x} ${idioma === 'es' ? 'y' : 'and'} ${y}.`), t);
      // Cada nombre, con su razón: el «and» tras «thousand» da unidades < 100 y miles redondos.
      item.nombres.forEach((nombre, i) => {
        const n = item.numeros[item.solucion[i]];
        const despues = / thousand and /.test(nombre);
        assert.equal(despues, n % 1000 !== 0 && n % 1000 < 100);
        assert.ok(t.includes(despues ? (idioma === 'es' ? 'va después de «thousand»' : 'comes after “thousand”') : (idioma === 'es' ? 'va antes de «thousand»' : 'comes before “thousand”')), t);
      });
    } else {
      const k = Math.floor((item.n % 1e6) / 1e3), u = item.n % 1e3, g = x => String(x).padStart(3, '0');
      assert.ok(t.includes(`${g(k)};`) && t.includes(` ${g(u)}.`), t);
      if (k === 0 || u === 0) assert.ok(t.includes('000'), t);
    }
  }
});

test('potencias10 · ejercicio 3 (revisión 193): la tarjeta nunca dice que billion sea 10^12', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarBillion, 33, 2000)) {
    const t = plano(X.explicaBillion(item, ctx(idioma)));
    assert.ok(!/billion (es|is) 10\^12|billion = 10\^12/.test(t), t);
    for (const m of t.matchAll(/(\w+(?:[ -]\w+)*?) billion = ([\d ]+)/g)) assert.equal(m[2].replace(/\D/g, '').length, 10 + String(item.c).length - 1, t);
  }
});
