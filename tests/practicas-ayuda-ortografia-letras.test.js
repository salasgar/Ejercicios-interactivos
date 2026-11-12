// «No lo sé» en ortografia-letras (tarea 181): la explicación termina en la respuesta que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { HACHES, BV, GJ, OTRAS } from '../practicas/ortografia-letras/logica.js';

const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,;:])/g, '$1').trim();
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'ortografia-letras'));
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: i % 10, vidas: 5, anterior: null, idioma: 'es' });
const textos = { idioma: 'es', t: {}, tt: o => o.es, esc: x => x };

[HACHES, BV, GJ, OTRAS].forEach((banco, n) => {
  test(`ortografia-letras, ejercicio ${n + 1}: la explicación acaba en la respuesta del ítem`, () => {
    const def = practica.ejercicios[n];
    const rng = crearRng(181100 + n);
    for (let i = 0; i < N; i++) {
      const item = def.generar(rng, sesion(i));
      const it = banco[item.i];
      const html = def.explicacion(item, textos);
      const p = plano(html);
      assert.doesNotMatch(html, /undefined|NaN|\[object|×/, p);
      assert.doesNotMatch(p, /\bnull\b/, p);
      const fin = n === 0 ? `La respuesta es <b>${it.buena}</b>.` : `La respuesta es <b>${it.buena}</b>: <b>${it.hueco.replace('_', it.buena)}</b>.`;
      assert.ok(html.endsWith(fin), p);
      assert.ok(item.orden.includes(it.buena), 'la buena está entre los botones');
    }
  });
});
