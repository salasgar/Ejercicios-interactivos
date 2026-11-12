// «No lo sé» en ortografia-puntuacion (tarea 181): la explicación termina en la respuesta que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { MAYUSCULAS, PUNTO_COMA, DOS_PUNTOS, BANCO_CORREOS, esAsuntoCuerpo, buenasMayusculas } from '../practicas/ortografia-puntuacion/logica.js';

const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,;:])/g, '$1').trim();
const escapa = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/\n/g, '<br>');
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'ortografia-puntuacion'));
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: i % 10, vidas: 5, anterior: null, idioma: 'es' });
const textos = { idioma: 'es', t: {}, tt: o => o.es, esc: x => x };
const limpio = html => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|×/, html);
  assert.doesNotMatch(plano(html), /\bnull\b/, html);
};

test('ortografia-puntuacion, mayúsculas: la explicación nombra cada palabra que hay que tocar', () => {
  const def = practica.ejercicios[0];
  const rng = crearRng(181201);
  for (let i = 0; i < N; i++) {
    const item = def.generar(rng, sesion(i));
    const it = MAYUSCULAS[item.i];
    const html = def.explicacion(item, textos);
    limpio(html);
    const malas = buenasMayusculas(it).map(k => it.texto.split(' ')[k].replace(/[.,;:¿?¡!«»]/g, ''));
    assert.ok(malas.length > 0);
    const frase = plano(html).split('La respuesta es:')[1];
    assert.ok(html.includes('<br>La respuesta es: hay que tocar '), plano(html));
    for (const m of malas) assert.ok(frase.includes(`«${m}»`), `${m} — ${plano(html)}`);
    assert.ok(plano(html).startsWith('Bien escrita: '), plano(html));
  }
});

[[PUNTO_COMA, 1], [DOS_PUNTOS, 2], [BANCO_CORREOS, 3]].forEach(([banco, n]) => {
  test(`ortografia-puntuacion, ejercicio ${n + 1}: la explicación acaba en la opción buena`, () => {
    const def = practica.ejercicios[n];
    const rng = crearRng(181210 + n);
    for (let i = 0; i < N; i++) {
      const item = def.generar(rng, sesion(i));
      const it = banco[item.i];
      const html = def.explicacion(item, textos);
      limpio(html);
      const fin = esAsuntoCuerpo(it)
        ? `<br>La respuesta es: <b>${it.donde === 'asunto' ? 'En el asunto' : 'En el cuerpo'}</b>`
        : `<br>La respuesta es: <b>${escapa(it.bien)}</b>`;
      assert.ok(html.endsWith(fin), plano(html));
      const buena = esAsuntoCuerpo(it) ? it.donde : it.bien;
      assert.ok(item.opciones.some(o => (o.k ?? o) === buena || o.texto === buena || o === buena || o.k === it.donde), 'la buena es una opción');
    }
  });
});
