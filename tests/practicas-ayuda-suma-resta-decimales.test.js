// «No lo sé» de suma-resta-decimales (tareas 173 y 190): cada explicación acaba con la respuesta del ítem,
// calculada con la lógica de la práctica, y lleva la cuenta. Además vigila lo que corrigió la revisión 190:
// la regla delante y una sola vez, los dos pasos (con sus cuentas verdaderas) cuando hay dos operaciones,
// «primero suma» solo si hay algo que sumar, y en «Mueve la coma» la regla antes de la cuenta y qué pasa
// con un número sin coma o cuando faltan cifras.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { aTexto, deTexto, sumar, restar } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/suma-resta-decimales/logica.js';
import { explicaAlinea, explicaSuper, explicaMedidas, explicaMueve } from '../practicas/suma-resta-decimales/ayuda.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const items = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng, {})); };
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const sano = (html, que) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.ok(html.length > 60, `${que}: corta`);
  assert.match(html, /^<p>/, `${que}: empieza por la regla`);
  assert.match(html, /<p><strong>(La respuesta es|The answer is) [^]*\.<\/strong><\/p>$/, `${que}: la respuesta, al final`);
  assert.equal((plano(html).match(/alinean las comas|Line up the decimal points/g) ?? []).length, 0, `${que}: la regla no se repite con «Se alinean las comas»`);
};

/** Cada «a ± b = c» de los pasos (<li>) es verdad. */
function pasosVerdaderos(html, idioma) {
  const lis = [...html.matchAll(/<li>(.*?)<\/li>/g)].map(m => plano(m[1]));
  for (const li of lis) {
    const m = li.match(/(\S+) ([+−]) (\S+) = (\S+)/);
    assert.ok(m, `paso sin cuenta: ${li}`);
    const [, a, op, b, c] = m;
    const r = (op === '+' ? sumar : restar)(deTexto(a), deTexto(b));
    assert.equal(aTexto(r.normalizar(), 'en'), aTexto(deTexto(c).normalizar(), 'en'), `${idioma}: ${li}`);
  }
  return lis.length;
}

test('suma-resta-decimales · ejercicio 1: la explicación da el resultado de la cuenta y, con tres números, los dos pasos', () => {
  for (const item of items(L.generarAlinea, 1)) {
    for (const idioma of IDIOMAS) {
      const html = explicaAlinea(item, textosDe(idioma));
      sano(html, `alinea ${idioma}`);
      assert.ok(html.includes(`${aTexto(L.D(item.resultado), idioma)}.</strong>`), plano(html));
      if (item.tipo === 'tres') assert.equal(pasosVerdaderos(html, idioma), 2);
      else assert.match(plano(html), idioma === 'es' ? (item.op === '+' ? / suma columna/ : / resta columna/) : (item.op === '+' ? / add column/ : / subtract column/));
    }
  }
});

test('suma-resta-decimales · ejercicio 2: la explicación da el total o la vuelta', () => {
  for (const item of items(L.generarSuper, 2)) {
    const esperado = L.respuestaSuper(item);
    for (const idioma of IDIOMAS) {
      const html = explicaSuper(item, textosDe(idioma));
      sano(html, `super ${idioma}`);
      assert.ok(html.includes(`${aTexto(esperado, idioma)} ${idioma === 'es' ? '€' : 'euros'}.</strong>`), plano(html));
      // «Primero suma» solo si hay más de un importe.
      if (item.importes.length === 1) assert.doesNotMatch(plano(html), /primero suma|first add/i, plano(html));
      // En inglés, «(la vuelta)» aclara «change», no «note».
      if (idioma === 'en') assert.doesNotMatch(html, /note \(la vuelta\)/, plano(html));
    }
  }
});

test('suma-resta-decimales · ejercicio 3: la explicación da la medida con su unidad y, si se quitan dos, los dos pasos', () => {
  for (const item of items(L.generarMedidas, 3)) {
    const unidad = L.CONTEXTOS_MEDIDAS[item.contexto].unidad;
    for (const idioma of IDIOMAS) {
      const html = explicaMedidas(item, textosDe(idioma));
      sano(html, `medidas ${idioma}`);
      assert.ok(html.includes(`${aTexto(L.D(item.respuesta), idioma)} ${unidad}.</strong>`), plano(html));
      if (item.forma === 'resto2') assert.equal(pasosVerdaderos(html, idioma), 2);
      // En la botella se llenan vasos: la regla no habla de «trozos».
      assert.doesNotMatch(plano(html), /trozo|piece/, plano(html));
    }
  }
});

test('suma-resta-decimales · ejercicio 4: la regla delante, la cuenta y qué pasa sin coma o si faltan cifras', () => {
  let sinComa = 0, faltan = 0;
  for (const item of items(L.generarMueve, 4)) {
    const d = L.D(item.d);
    for (const idioma of IDIOMAS) {
      const html = explicaMueve(item, textosDe(idioma));
      sano(html, `mueve ${idioma}`);
      assert.ok(html.includes(`${aTexto(L.D(item.respuesta), idioma)}.</strong>`), plano(html));
      const laCuenta = `= ${aTexto(L.D(item.respuesta).normalizar(), idioma)}`;
      assert.ok(plano(html).includes(laCuenta), 'la cuenta');
      assert.ok(plano(html).indexOf(idioma === 'es' ? 'la coma se mueve' : 'the point moves') < plano(html).indexOf(laCuenta), 'la regla va delante');
      if (d.k === 0) { sinComa++; assert.match(plano(html), /no tiene coma|has no point/, plano(html)); }
      const enteras = String(Math.abs(d.m)).length - d.k;
      if ((item.op === 'por' && item.n > d.k) || (item.op === 'entre' && item.n >= enteras)) {
        faltan++;
        assert.match(plano(html), /se ponen ceros|se pone un 0|add zeros|write a 0/, plano(html));
      }
    }
  }
  assert.ok(sinComa > 0 && faltan > 0, 'salen naturales y casos en que faltan cifras');
});
