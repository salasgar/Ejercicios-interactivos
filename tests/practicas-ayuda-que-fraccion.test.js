// «No lo sé» en `que-fraccion` (tarea 171): la explicación de cada ejercicio lleva la solución
// del ítem, calculada con la lógica de la práctica y no copiada de la explicación. Por fuerza
// bruta: 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/que-fraccion/logica.js';
import * as X from '../practicas/que-fraccion/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const h = (num, den) => htmlFraccion({ num, den }, { compacta: true });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const generar = (fn, semilla, n = 1200) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};

test('que-fraccion · ejercicio 1: la explicación lleva la fracción que sale de contar', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarLeeFigura, 101)) {
      const html = X.explicaLeeFigura(item, ctx(idioma));
      assert.ok(html.includes(h(item.num, item.den)), `fracción ${item.num}/${item.den}`);
      assert.ok(plano(html).includes(` ${item.den}.`), 'las partes');
      assert.equal(L.errorLeeFigura(item, { num: item.num, den: item.den }), null, 'es la que el ejercicio da por buena');
      assert.equal(html.includes('equivalente') || html.includes('equivalent'), !item.exacta, 'solo lo dice si vale cualquier equivalente');
    }
  }
});

test('que-fraccion · ejercicio 2: la explicación lleva las partes que hay que sombrear', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarSombrea, 102)) {
      const html = X.explicaSombrea(item, ctx(idioma));
      assert.equal(L.errorSombrea(item, item.objetivo), null, 'es la cantidad que el ejercicio da por buena');
      const p = plano(html).trim();
      const partes = n => (idioma === 'es' ? `${n} ${n === 1 ? 'parte' : 'partes'}` : `${n} ${n === 1 ? 'part' : 'parts'}`);
      const fin = idioma === 'es' ? `La respuesta es ${partes(item.objetivo)} de las ${item.partes}.` : `The answer is ${partes(item.objetivo)} out of ${item.partes}.`;
      assert.ok(p.endsWith(fin), `la respuesta al final: ${p}`);
      assert.ok(p.startsWith(idioma === 'es' ? 'El denominador dice en cuántos trozos' : 'The denominator says how many'), 'la regla, delante');
      // Revisión 190: «Hay que sombrear» salía tres veces y «hay que sombrear 1 parte» se repetía en la respuesta.
      assert.ok(!/hay que sombrear|you have to shade/i.test(p), 'sin repetir el enunciado');
      assert.equal(html.includes(`${item.partes} : ${item.den} = ${item.m}`), item.m > 1, 'la división solo si hay más partes que el denominador');
      if (item.m > 1) assert.ok(html.includes(`${item.num} · ${item.m} = ${item.objetivo}`));
      assert.ok(!/\b1 (partes|trozos|parts|shares)\b/.test(p), 'singular con 1');
    }
  }
});

test('que-fraccion · ejercicio 3: la explicación lleva la fracción de los que cumplen', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarFrase, 103)) {
      const html = X.explicaFrase(item, ctx(idioma));
      assert.equal(L.errorFrase(item, { num: item.k, den: item.n }), null);
      assert.ok(html.includes(h(item.k, item.n)), 'la fracción');
      const p = plano(html);
      assert.ok(p.includes(`Total: ${item.n} `), 'el total, con lo que se cuenta');
      assert.ok(p.includes(`: ${item.k}. `), 'la parte');
      assert.ok(p.includes(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} `), 'la respuesta explícita');
      // Revisión 190: «no solo los que no cumplen» daba a entender que abajo van también los que no cumplen.
      assert.ok(!/no solo|not only/.test(p));
    }
  }
});

test('que-fraccion · ejercicio 4: la explicación lleva la lectura que el ejercicio da por buena', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarLee, 104)) {
      const html = X.explicaLee(item, ctx(idioma));
      const buena = item.opciones.find(o => o.correcta);
      const texto = item.sentido === 'lectura' ? buena.texto : item.texto;
      assert.equal(texto, item.texto);
      assert.ok(html.includes(item.texto), 'la lectura');
      assert.ok(html.includes(h(item.num, item.den)), 'la fracción');
      const nombre = item.texto.split(' ').pop();
      assert.ok(html.includes(`«${nombre}»`) || html.includes(`“${nombre}”`), 'el nombre del denominador');
      // Revisión 190: en español el denominador no se lee con ordinales (onceavos, tercios), y cuartos no es
      // un caso especial; el consejo «nunca como un número normal» era falso con «tres partido por cinco».
      if (item.idioma === 'es') {
        assert.ok(!/ordinal|caso especial|special case|nombre propio|own name/.test(html), 'en español, ni ordinales ni casos especiales');
        assert.ok(html.includes(item.den <= 10 ? 'décimos' : '-avos'), 'la regla del español que toca');
      } else if (item.den !== 2 && item.den !== 4) assert.ok(html.includes('ordinal'));
      assert.ok(!/nunca|never/.test(html));
    }
  }
});
