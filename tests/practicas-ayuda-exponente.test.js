// «No lo sé» en `exponente` (tarea 187): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/exponente/logica.js';
import * as X from '../practicas/exponente/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const sinMiles = t => t.replace(/(?<=\d)[ ,](?=\d{3}(?!\d))/g, '');
const sano = html => assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));

test('ej. 1: la explicación trae la cuenta bien hecha y nombra la base correcta', () => {
  const rng = crearRng(401);
  for (let n = 0; n < N; n++) {
    const item = L.generarAlcance(rng);
    const p = item.partes[item.preguntada];
    for (const idioma of IDIOMAS) {
      const html = X.explicaAlcance(item, ctx(idioma));
      sano(html);
      const cuenta = plano(html.match(/<span class="cuenta">(.*?)<\/span>/)[1]);
      assert.equal(Number(sinMiles(cuenta).split(' = ').at(-1)), L.valorParte(p), cuenta);
      // el paréntesis que se toca, escrito con sus números (y sin «es:», que no lleva dos puntos)
      const grupo = { grupo: `(${p.a} · ${p.b})`, sumagrupo: `(${p.a} + ${p.b})`, intermedia: `(${p.b} + ${p.c})` }[p.forma];
      const base = L.idBaseDe(p.forma) === 'grupo'
        ? (idioma === 'es' ? `todo el paréntesis ${grupo}` : `the whole bracket ${grupo}`)
        : (idioma === 'es' ? `el número ${p.b}` : `the number ${p.b}`);
      const fin = idioma === 'es' ? 'La respuesta es' : 'The answer is';
      assert.ok(plano(html).endsWith(`${fin} ${base}.`), plano(html));
      assert.doesNotMatch(plano(html), /(es|is):/);
    }
  }
});

test('ej. 2: la explicación de cada subtipo lleva su solución', () => {
  const rng = crearRng(402);
  const vistos = new Set();
  for (let n = 0; n < N; n++) {
    const item = L.generarMultiplicacion(rng);
    vistos.add(item.tipo);
    for (const idioma of IDIOMAS) {
      const html = X.explicaMultiplicacion(item, ctx(idioma));
      sano(html);
      const texto = plano(html);
      if (item.tipo === 'valor') {
        assert.match(texto, new RegExp(`= ${item.correcta}(?!\\d)`), texto);
        // «(no 2 · 2)» no: con base = exponente, b · e es justo el producto bueno
        if (item.base === item.exponente) assert.doesNotMatch(texto, /\((no|not) \d/, texto);
        else assert.ok(texto.includes(`${idioma === 'es' ? '(no' : '(not'} ${item.base} · ${item.exponente})`), texto);
        assert.doesNotMatch(texto, /sí mismo|by itself/);
        assert.ok(texto.endsWith(` ${item.correcta}.`), texto);
      } else if (item.tipo === 'repetida') {
        assert.ok(texto.endsWith(` ${L.secuenciaCorrecta(item).join(' ')}.`), texto);
        assert.ok(L.aciertaRepetida(item, L.secuenciaCorrecta(item)));
      } else {
        assert.ok(texto.endsWith(idioma === 'es' ? `base ${item.base}, exponente ${item.exponente}.` : `base ${item.base}, exponent ${item.exponente}.`), texto);
        assert.ok(L.aciertaPotencia(item, item.base, item.exponente));
      }
    }
  }
  assert.deepEqual([...vistos].sort(), ['potencia', 'repetida', 'valor']);
});

test('ej. 3: la explicación da las dos respuestas que el ejercicio da por buenas', () => {
  const rng = crearRng(403);
  for (let n = 0; n < N; n++) {
    const item = L.generarAreas(rng);
    const { pregunta1, pregunta2 } = L.respuestasAreas(item);
    for (const idioma of IDIOMAS) {
      const html = X.explicaAreas(item, ctx(idioma));
      sano(html);
      const texto = plano(html);
      const y = idioma === 'es' ? 'y' : 'and';
      assert.ok(texto.endsWith(`${pregunta1} ${y} ${pregunta2}.`), texto);
      const finales = [...html.matchAll(/<li><span class="cuenta">(.*?)<\/span><\/li>/g)].map(m => Number(sinMiles(plano(m[1])).split(' = ').at(-1)));
      assert.deepEqual(finales, [pregunta1, pregunta2]);
    }
  }
});

test('ej. 2: el feedback dice «producto de e factores», sin «(no b · e)» si base = exponente, y sin cifras de 5 o más sin separar', () => {
  const rng = crearRng(403);
  const cincoSeguidas = /\d{5}/;
  let iguales = 0;
  for (let n = 0; n < 300; n++) {
    const item = L.generarMultiplicacion(rng);
    const { base: b, exponente: e } = item;
    const prod = Array(e).fill(b).join(' · ');
    const textos = [];
    for (const idioma of IDIOMAS) {
      textos.push(X.explicaMultiplicacion(item, ctx(idioma)));
      if (item.tipo === 'valor') {
        textos.push(X.TX.valor.bien[idioma](b, e, item.correcta));
        for (const o of item.opciones.filter(x => x !== item.correcta)) textos.push(X.TX.valor.mal[idioma](b, e, item.correcta, o));
      } else if (item.tipo === 'repetida') {
        textos.push(X.TX.repetida.bien[idioma](b, e, prod));
      } else {
        textos.push(X.TX.potencia.bien[idioma](b, e, prod));
      }
    }
    for (const t of textos) {
      assert.doesNotMatch(t, /por sí mismo \d+ veces|by itself \d+ times/, plano(t));
      assert.doesNotMatch(plano(t), cincoSeguidas, plano(t));
      if (b === e) { assert.doesNotMatch(t, /\(no |\(not /, plano(t)); iguales++; }
    }
  }
  assert.ok(iguales > 0, 'el test tiene que ver ítems con base = exponente');
});

test('ej. 1: las cuentas del feedback y de la tarjeta no traen cifras de 5 o más sin separar, en los dos idiomas', () => {
  const rng = crearRng(404);
  for (let n = 0; n < 300; n++) {
    const item = L.generarAlcance(rng);
    const p = item.partes[item.preguntada];
    for (const idioma of IDIOMAS) {
      const textos = [X.explicaAlcance(item, ctx(idioma)), L.cuentaParte(p, idioma), L.cuentaErronea(p, idioma),
        ...L.REGIONES[p.forma].map(id => L.cuentaTocada(p, id, idioma))];
      for (const t of textos) assert.doesNotMatch(plano(t), /\d{5}/, plano(t));
    }
  }
  assert.equal(L.fmt(52488, 'es'), '52 488');
  assert.equal(L.fmt(52488, 'en'), '52,488');
  assert.equal(L.fmt(2401, 'es'), '2401');
});
