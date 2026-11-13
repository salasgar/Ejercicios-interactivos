// «No lo sé» en ortografia (tarea 181): la explicación termina en la respuesta que el ejercicio da por buena.
// Revisión de la tarea 192: «La respuesta es X», sin dos puntos detrás de «es»; la frase buena sale una sola
// vez (ya no se repite al principio con «Bien escrita:»); y la pregunta de sí o no no dice la respuesta dos veces.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { PAREJAS, partes, estaBien } from '../practicas/ortografia/logica.js';
import { PARES, PREGUNTAS, frase, alPrincipio, mayuscula } from '../practicas/ortografia/tildes.js';
import { opciones as opcionesComa, buena as buenaComa } from '../practicas/ortografia/comas.js';
import { opcionesSignos } from '../practicas/ortografia/signos.js';
import { opcionesSujeto } from '../practicas/ortografia/sujeto.js';

const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,;:])/g, '$1').trim();
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'ortografia'));
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: i % 10, vidas: 5, anterior: null, idioma: 'es' });
const textos = { idioma: 'es', t: {}, tt: o => o.es, esc: x => x };
const FIN = '<br>La respuesta es ';
const veces = (texto, trozo) => texto.split(trozo).length - 1;

function recorrer(n, semilla, comprobar, { conFin = () => true } = {}) {
  const def = practica.ejercicios[n];
  const rng = crearRng(semilla);
  for (let i = 0; i < N; i++) {
    const item = def.generar(rng, sesion(i));
    const html = def.explicacion(item, textos);
    assert.doesNotMatch(html, /undefined|NaN|\[object|×/, html);
    assert.doesNotMatch(plano(html), /\bnull\b/, html);
    assert.doesNotMatch(html, /respuesta es:/i, `«La respuesta es:» lleva dos puntos de más: ${plano(html)}`);
    assert.doesNotMatch(html, /Bien escrita: /, `la frase buena ya va en la respuesta: ${plano(html)}`);
    if (!conFin(item)) { comprobar(item, null, html); continue; }
    assert.ok(html.includes(FIN), plano(html));
    comprobar(item, html.slice(html.lastIndexOf(FIN) + FIN.length), html);
  }
}

test('ortografia, ejercicios 1-3 y 5 (huecos): la respuesta es la palabra buena y la frase completa', () => {
  [0, 1, 2, 4].forEach(n => recorrer(n, 181300 + n, (item, resp) => {
    const { buena, antes, despues } = partes(item.pareja, item.n);
    assert.equal(resp, `<b>${buena}</b>: <i>${antes}${buena}${despues}</i>`);
    assert.ok(PAREJAS[item.pareja].frases[item.n][1] === buena);
  }));
});

test('ortografia, ejercicio 4 (¿está bien escrita?): la respuesta es «Bien escrita» solo si lo está', () => {
  recorrer(3, 181304, (item, resp, html) => {
    assert.equal(resp, `«<b>${estaBien(item) ? 'Bien escrita' : 'Mal escrita'}</b>».`);
    const { buena } = partes(item.pareja, item.n);
    if (!estaBien(item)) assert.ok(html.includes(`es «${buena}»`), plano(html));
  });
});

test('ortografia, ejercicios 6-7 (comas): la respuesta es la frase buena del ítem, y sale una sola vez', () => {
  [5, 6].forEach(n => recorrer(n, 181305 + n, (item, resp, html) => {
    const buena = opcionesComa(item).find(o => o.k === buenaComa(item));
    assert.equal(resp, `<i>${buena.texto}</i>`);
    assert.equal(veces(html, `<i>${buena.texto}</i>`), 1, plano(html));
    // Ninguna frase empieza en minúscula: «Aquí «chicos» es…», no ««chicos» es…».
    assert.doesNotMatch(plano(html), /^«[a-záéíóúñ]/, plano(html));
  }));
});

test('ortografia, ejercicios 8-9 (tildes): hueco, par de significado o sí/no', () => {
  const vistos = new Set();
  [7, 8].forEach(n => recorrer(n, 181307 + n, (item, resp, html) => {
    vistos.add(item.tipo ?? 'hueco');
    if (item.tipo === 'pregunta') {
      // La explicación del banco ya acaba en «la respuesta es <b>sí</b>»: una sola vez.
      const si = PREGUNTAS[item.i].respuesta;
      assert.equal(veces(html.toLowerCase(), 'la respuesta es'), 1, plano(html));
      assert.ok(html.includes(`respuesta es <b>${si}</b>`), plano(html));
      return;
    }
    if (item.tipo === 'par') {
      const buena = PARES[item.grupo][item.i].frases[item.cual];
      assert.equal(resp, `<i>${buena}</i>`);
      assert.equal(veces(html, `<i>${buena}</i>`), 1, plano(html));
      return;
    }
    const { buena } = frase(item.grupo, item.n);
    assert.equal(resp, `<b>${alPrincipio(item.grupo, item.n) ? mayuscula(buena) : buena}</b>.`);
  }, { conFin: item => item.tipo !== 'pregunta' }));
  assert.deepEqual([...vistos].sort(), ['hueco', 'pregunta', 'par'].sort());
});

test('ortografia, ejercicios 10-11 (signos y sujeto): la respuesta es la frase bien escrita (k = 0), una sola vez', () => {
  recorrer(9, 181310, (item, resp, html) => {
    const buena = opcionesSignos(item).find(o => o.k === 0).texto;
    assert.equal(resp, `<i>${buena}</i>`);
    assert.equal(veces(html, `<i>${buena}</i>`), 1, plano(html));
    assert.ok(html.startsWith('A las frases mal escritas: '), plano(html));
  });
  recorrer(10, 181311, (item, resp, html) => {
    const buena = opcionesSujeto(item).find(o => o.k === 0).texto;
    assert.equal(resp, `<i>${buena}</i>`);
    assert.equal(veces(html, `<i>${buena}</i>`), 1, plano(html));
    assert.ok(html.startsWith('Aquí «'), plano(html));
  });
});
