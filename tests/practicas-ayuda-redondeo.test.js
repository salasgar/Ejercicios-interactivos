// «No lo sé» en `redondeo` (tarea 188): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/redondeo/logica.js';
import * as X from '../practicas/redondeo/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.;,:])/g, '$1');
const F = (n, idioma) => L.fmt(n, idioma).replace(/\s/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('redondeo · ejercicio 1: la explicación lleva el número redondeado al final', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarRecta, 1)) {
    const t = plano(X.explicaRecta(item, ctx(idioma)));
    assert.ok(t.endsWith(`${F(L.redondear(item.n, item.orden), idioma)}.`), t);
    assert.ok(!/undefined|NaN/.test(t));
  }
});

test('redondeo · ejercicio 2: la explicación lleva los tres redondeos', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarTres, 2)) {
    const t = plano(X.explicaTres(item, ctx(idioma)));
    for (const o of L.ORDENES) assert.ok(t.includes(`${F(item.n, idioma)} → ${F(L.redondear(item.n, o), idioma)}`), t);
  }
});

test('redondeo · ejercicio 3: estimar, razonable y contexto llevan su solución', () => {
  const vistos = { estimar: 0, razonable: 0, contexto: 0 };
  for (const idioma of IDIOMAS) for (const item of generar(L.generarEstimacion, 3, 2000)) {
    vistos[item.tipo]++;
    const t = plano(X.explicaEstimacion(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'estimar') {
      const o = item.ordenes[0];
      assert.ok(t.includes(`= ${F(L.estimarCon(item.op, item.terminos, o), idioma)}`), t);
      assert.ok(t.includes(`= ${F(L.diferenciaCon(item, o), idioma)}`), t);
      // Revisión 193 (sesión): respuesta al final, sin «Mi estimación»; si se elige el orden, que valga cualquiera.
      const est = F(L.estimarCon(item.op, item.terminos, o), idioma), dif = F(L.diferenciaCon(item, o), idioma);
      assert.ok(t.endsWith(idioma === 'es' ? `La respuesta es ${est} de estimación y ${dif} de diferencia.` : `The answer is ${est} for the estimate and ${dif} for the difference.`), t);
      assert.ok(!/Mi estimación|My estimate/.test(t), t);
      assert.equal(/cualquier otro orden de los que se ofrecen|any other place value offered/.test(t), item.ordenes.length > 1, t);
    } else if (item.tipo === 'razonable') {
      const dice = item.propuesto === L.exactoDe(item.op, item.terminos);
      assert.equal(dice, item.razonable);
      // Revisión 193: sin mayúscula a media frase («La respuesta es Sí, …»); el botón, entre comillas.
      assert.ok(t.endsWith(dice ? (idioma === 'es' ? 'La respuesta es «Sí»: es razonable.' : 'The answer is “Yes”: it is reasonable.') : (idioma === 'es' ? 'La respuesta es «No»: no es razonable.' : 'The answer is “No”: it is not reasonable.')), t);
    } else {
      // Revisión 193: la respuesta, al final y una sola vez; y se dice qué cifra decide y si sube o baja.
      const r = F(L.redondear(item.n, item.orden), idioma);
      assert.ok(t.endsWith(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${r}.`), t);
      assert.equal(t.split(r).length - 1, 1, `la respuesta una sola vez: ${t}`);
      const c = L.cifraDecisiva(item.n, item.orden);
      const sube = c >= 5;
      assert.equal(L.redondear(item.n, item.orden) > item.n, sube);
      assert.ok(t.includes(idioma === 'es' ? `es un ${c}; como es ${sube ? '5 o más, sube' : 'menos de 5, baja'}` : `it is ${c}; it is ${sube ? '5 or more, so it goes up' : 'less than 5, so it goes down'}`), t);
      assert.ok(t.includes(idioma === 'es' ? `la cifra de ${X.CIFRA_ORDEN[item.orden].es}` : X.CIFRA_ORDEN[item.orden].en), t);
    }
  }
  assert.ok(vistos.estimar > 0 && vistos.razonable > 0 && vistos.contexto > 0);
});
