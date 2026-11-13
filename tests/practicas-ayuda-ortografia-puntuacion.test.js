// «No lo sé» en ortografia-puntuacion (tarea 181): la explicación termina en la respuesta que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { MAYUSCULAS, PUNTO_COMA, DOS_PUNTOS, BANCO_CORREOS, MOTIVOS, esAsuntoCuerpo, buenasMayusculas } from '../practicas/ortografia-puntuacion/logica.js';

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
    const limpia = p => p.replace(/[.,;:¿?¡!«»]/g, '');
    const malas = buenasMayusculas(it).map(k => limpia(it.texto.split(' ')[k]));
    const bien = buenasMayusculas(it).map(k => limpia(it.correcto.split(' ')[k]));
    assert.ok(malas.length > 0);
    // Revisión 192: sin dos puntos tras «es», y cada palabra mal puesta con su forma buena al lado.
    assert.ok(html.includes('<br>La respuesta es tocar '), plano(html));
    const [tocar, quedan] = plano(html).split('La respuesta es tocar ')[1].split(/, que se escriben? /);
    assert.ok(quedan, plano(html));
    for (const m of malas) assert.ok(tocar.includes(`«${m}»`), `${m} — ${plano(html)}`);
    for (const b of bien) assert.ok(quedan.includes(`«${b}»`), `${b} — ${plano(html)}`);
    assert.ok(plano(html).startsWith('Bien escrita: '), plano(html));
    // Va con minúscula PORQUE no empieza la frase, no «aunque».
    assert.doesNotMatch(html, /aunque no sea la primera palabra/, plano(html));
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
        ? `<br>La respuesta es «<b>${it.donde === 'asunto' ? 'En el asunto' : 'En el cuerpo'}</b>».`
        : `<br>La respuesta es <b>${escapa(it.bien)}</b>`;
      assert.ok(html.endsWith(fin), plano(html));
      // Revisión 192: la frase buena sale una sola vez (al final), y cada mala lleva su motivo.
      if (!esAsuntoCuerpo(it)) {
        assert.equal(html.split(`<b>${escapa(it.bien)}</b>`).length - 1, 1, plano(html));
        assert.doesNotMatch(html, /Bien escrita: /, plano(html));
        for (const [mala] of it.malas) assert.match(html, new RegExp(`(En|en) <i>${escapa(mala).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</i> `), plano(html));
        // Segunda pasada de la 192: si las dos malas fallan en lo mismo, el motivo sale una sola vez.
        const ids = it.malas.map(m => m[1]);
        if (ids[0] === ids[1] && ids[0] !== 'sin-tilde-correo') {
          assert.equal(html.split(escapa(MOTIVOS[ids[0]]).replace(/&quot;/g, '"')).length - 1, 1, plano(html));
          assert.ok(html.includes(`</i> y en <i>`), plano(html));
        }
        // Y en un correo sin tildes, la tarjeta nombra las palabras de ESE correo que las llevan.
        for (const [mala, id] of it.malas) {
          if (id !== 'sin-tilde-correo') continue;
          const b = it.bien.split(/\s+/);
          const conTilde = mala.split(/\s+/).map((p, i) => [p, b[i]]).filter(([p, q]) => p !== q).map(([, q]) => q.replace(/[.,;:¿?¡!«»]/g, ''));
          assert.ok(conTilde.length > 0 && conTilde.every(p => /[áéíóú]/.test(p)), plano(html));
          for (const p of conTilde) assert.ok(plano(html).includes(`«${p}»`), `${p} — ${plano(html)}`);
          assert.doesNotMatch(html, /«explicación»…/, plano(html));
        }
      }
      const buena = esAsuntoCuerpo(it) ? it.donde : it.bien;
      assert.ok(item.opciones.some(o => (o.k ?? o) === buena || o.texto === buena || o === buena || o.k === it.donde), 'la buena es una opción');
    }
  });
});
