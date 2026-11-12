// «No lo sé» en ortografia (tarea 181): la explicación termina en la respuesta que el ejercicio da por buena.
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
const FIN = '<br>La respuesta es: ';

function recorrer(n, semilla, comprobar) {
  const def = practica.ejercicios[n];
  const rng = crearRng(semilla);
  for (let i = 0; i < N; i++) {
    const item = def.generar(rng, sesion(i));
    const html = def.explicacion(item, textos);
    assert.doesNotMatch(html, /undefined|NaN|\[object|×/, html);
    assert.doesNotMatch(plano(html), /\bnull\b/, html);
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
    assert.equal(resp, `<b>${estaBien(item) ? 'Bien escrita' : 'Mal escrita'}</b>`);
    const { buena } = partes(item.pareja, item.n);
    if (!estaBien(item)) assert.ok(html.includes(`es «${buena}»`), plano(html));
  });
});

test('ortografia, ejercicios 6-7 (comas): la respuesta es la frase buena del ítem', () => {
  [5, 6].forEach(n => recorrer(n, 181305 + n, (item, resp) => {
    const buena = opcionesComa(item).find(o => o.k === buenaComa(item));
    assert.equal(resp, `<i>${buena.texto}</i>`);
  }));
});

test('ortografia, ejercicios 8-9 (tildes): hueco, par de significado o sí/no', () => {
  const vistos = new Set();
  [7, 8].forEach(n => recorrer(n, 181307 + n, (item, resp) => {
    vistos.add(item.tipo ?? 'hueco');
    if (item.tipo === 'pregunta') return assert.equal(resp, `<b>${PREGUNTAS[item.i].respuesta === 'sí' ? 'Sí' : 'No'}</b>`);
    if (item.tipo === 'par') return assert.equal(resp, `<i>${PARES[item.grupo][item.i].frases[item.cual]}</i>`);
    const { buena } = frase(item.grupo, item.n);
    assert.equal(resp, `<b>${alPrincipio(item.grupo, item.n) ? mayuscula(buena) : buena}</b>`);
  }));
  assert.deepEqual([...vistos].sort(), ['hueco', 'pregunta', 'par'].sort());
});

test('ortografia, ejercicios 10-11 (signos y sujeto): la respuesta es la frase bien escrita (k = 0)', () => {
  recorrer(9, 181310, (item, resp) => assert.equal(resp, `<i>${opcionesSignos(item).find(o => o.k === 0).texto}</i>`));
  recorrer(10, 181311, (item, resp) => assert.equal(resp, `<i>${opcionesSujeto(item).find(o => o.k === 0).texto}</i>`));
});
