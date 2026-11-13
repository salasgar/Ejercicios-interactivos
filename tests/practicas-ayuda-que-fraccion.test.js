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
      assert.ok(plano(html).includes(`sombrear ${item.objetivo} parte`) || plano(html).includes(`shade ${item.objetivo} of`) || plano(html).includes(`shade ${item.objetivo} parts`), 'el objetivo');
      assert.equal(html.includes(`${item.partes} : ${item.den} = ${item.m}`), item.m > 1, 'la división solo si hay más partes que el denominador');
      if (item.m > 1) assert.ok(html.includes(`${item.num} · ${item.m} = ${item.objetivo}`));
    }
  }
});

test('que-fraccion · ejercicio 3: la explicación lleva la fracción de los que cumplen', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarFrase, 103)) {
      const html = X.explicaFrase(item, ctx(idioma));
      assert.equal(L.errorFrase(item, { num: item.k, den: item.n }), null);
      assert.ok(html.includes(h(item.k, item.n)), 'la fracción');
      assert.ok(plano(html).includes(`${item.n}`) && plano(html).includes(`${item.k}`));
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
      if (item.den !== 2 && item.den !== 4) {
        const ordinal = item.texto.split(' ').pop();
        assert.ok(html.includes(`«${ordinal}»`) || html.includes(`“${ordinal}”`), 'el ordinal');
      }
    }
  }
});
