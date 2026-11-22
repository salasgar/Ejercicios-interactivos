// «No lo sé» en `errores1` (tarea 189): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/errores1/logica.js';
import * as X from '../practicas/errores1/textos.js';
import { lineaN, entreLineas } from '../practicas/_comun/procedimiento.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };
const Q = { es: x => `«${x}»`, en: x => `“${x}”` };
/** Revisión 193: la respuesta, sin dos puntos tras «es», al final y una sola vez. */
const alFinal = (t, idioma, txt) => {
  const r = `${RESP[idioma]} ${txt}.`;
  assert.ok(t.trim().endsWith(r), t);
  assert.ok(!t.includes(`${RESP[idioma]}:`), t);
};

test('errores1 · ejercicio 1: la explicación dice si hay error o no', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarHay, 1)) {
    const t = plano(X.explicaHay(item, ctx(idioma)));
    assert.equal(item.solucion, item.error ? 'error' : 'bien');
    alFinal(t, idioma, Q[idioma](item.error ? X.TX.error[idioma] : X.TX.bien[idioma]));
    // El veredicto no se dice dos veces («Está bien: …» al principio y otra vez al final)
    assert.equal(t.split(item.error ? X.TX.error[idioma] : X.TX.bien[idioma]).length - 1, 1, t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('errores1 · ejercicio 2: la explicación señala la línea del error', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarLinea, 2)) {
    const t = plano(X.explicaLinea(item, ctx(idioma)));
    assert.equal(item.solucion, item.error.linea);
    alFinal(t, idioma, lineaN(item.error.linea, idioma));
    // JL, 22-11: ni «It is the first line that is wrong» ni «3.» delante de la línea; la regla rota, en negrita.
    assert.doesNotMatch(t, /first line that is wrong|primera línea que falla|\b\d\. =/, t);
    assert.ok(X.explicaLinea(item, ctx(idioma)).includes(`<strong class="regla-rota">${X.html(X.REGLAS[item.error.nombre][idioma])}</strong>`), t);
    assert.ok(t.includes(plano(X.html(item.lineas[item.error.linea][idioma]))), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('errores1 · ejercicio 3: la explicación da el nombre del error', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarNombre, 3)) {
    const t = plano(X.explicaNombre(item, ctx(idioma)));
    assert.equal(item.solucion, item.error.nombre);
    const nombre = X.NOMBRES[item.error.nombre][idioma].replace(/\.$/, '');
    alFinal(t, idioma, Q[idioma](nombre));
    assert.equal(t.split(nombre).length - 1, 1, t);   // el nombre solo en la respuesta
    assert.ok(!t.includes('..'), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('errores1 · ejercicio 4: la explicación dice si falta un paso', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarPasos, 4)) {
    const t = plano(X.explicaPasos(item, ctx(idioma)));
    assert.equal(item.solucion, item.salta ? 'si' : 'no');
    alFinal(t, idioma, Q[idioma]((item.salta ? X.TX.si : X.TX.no)[idioma]));
    if (item.salta) {
      // La línea que falta, con sus números, y el número de la línea tras la que va
      const p = L.PASOS_POR_ID[item.plantilla];
      const k = p.entre ?? item.lineas.length - 1;
      const entre = entreLineas(k - 1, k, idioma);
      assert.ok(t.includes(idioma === 'es' ? `${entre[0].toUpperCase()}${entre.slice(1)} falta esta:` : `missing ${entre}:`), t);
      assert.ok(t.includes(plano(X.html(`= ${p.falta(item.params)}`)).trim()), t);
    }
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('errores1 · ejercicios 1-3: regla delante; con error, la línea mala y la cuenta bien hecha, en minúscula tras «sería:»', () => {
  const fns = [[X.explicaHay, L.generarHay], [X.explicaLinea, L.generarLinea], [X.explicaNombre, L.generarNombre]];
  for (const [explica, gen] of fns) for (const idioma of IDIOMAS) for (const item of generar(gen, 5)) {
    const html = explica(item, ctx(idioma));
    const t = plano(html);
    assert.ok(/^<p>[^<]+<\/p>/.test(html), html);   // la regla, en su párrafo, delante
    if (!item.error) continue;
    const corregida = plano(X.html(L.PLANTILLA_POR_ID[item.plantilla].corregida(item.params)[idioma])).trim();
    assert.ok(t.toLowerCase().includes(corregida.toLowerCase()), t);
    assert.ok(t.includes(plano(X.html(item.lineas[item.error.linea][idioma])).trim()), t);
    const tras = t.split(idioma === 'es' ? 'Lo correcto es:' : 'The right way is:')[1].trim();
    assert.ok(!/^[A-ZÁÉÍÓÚ][a-záéíóúñ]/.test(tras), t);
  }
});
