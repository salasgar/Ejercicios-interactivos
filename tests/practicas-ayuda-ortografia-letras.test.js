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

// Revisión de la tarea 192: lo que la tarjeta ya no dice porque no es verdad siempre.
const FALSAS = [
  [/solo puede ir <b>b<\/b>/, 'después de la m también van p y n (campo, himno)'],
  [/Las sílabas <b>bl<\/b>/, 'bl y br no son sílabas'],
  [/demás consonantes/, 'delante de n va m (himno, alumno, gimnasio)'],
  [/Detrás de otra vocal, el sonido «i»/, 'leí, oí, caí y fui acaban en i'],
  [/del latín «bien»/, 'el latín es «bene»'],
  [/como los verbos en -aba/, 'lava, octava y esclava acaban en -ava y llevan v'],
  [/«Ingeniero».*-jero llevan j, pero esta es una excepción/, 'ingeniero no acaba en -jero'],
  [/algo existe[^«]*«Mañana <b>hay<\/b> que/, '«hay que» es «es necesario», no «algo existe»'],
];

test('ortografia-letras: ninguna tarjeta repite las reglas que la revisión 192 corrigió', () => {
  [HACHES, BV, GJ, OTRAS].forEach((banco, n) => {
    const def = practica.ejercicios[n];
    banco.forEach((it, i) => {
      const html = def.explicacion({ i, orden: it.opciones }, textos);
      for (const [mal, porque] of FALSAS) assert.doesNotMatch(html, mal, `${porque}: ${plano(html)}`);
    });
  });
  // Y las corregidas salen donde tocan.
  const ayuda = (banco, n, palabra) => practica.ejercicios[n].explicacion({ i: banco.findIndex(it => (it.palabra ?? it.texto) === palabra) }, textos);
  assert.match(ayuda(BV, 1, 'también'), /se escribe <b>b<\/b>, nunca v/);
  assert.match(ayuda(OTRAS, 3, 'hoy'), /«i» átono .* detrás de otra vocal/);
  assert.match(ayuda(OTRAS, 3, 'invitar'), /Delante de <b>c, d, s, t<\/b> y <b>v<\/b>/);
  assert.match(ayuda(GJ, 2, 'ingeniero'), /viene de «ingenio»/);
  assert.match(ayuda(BV, 1, 'sílaba'), /no es un verbo/);
  const hayQue = HACHES.findIndex(it => it.buena === 'hay' && /_ que /.test(it.texto));
  assert.ok(hayQue >= 0);
  assert.match(practica.ejercicios[0].explicacion({ i: hayQue }, textos), /«hay que» quiere decir «es necesario»/);
});
