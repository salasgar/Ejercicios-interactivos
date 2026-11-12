// «No lo sé» en ortografia-tildes (tarea 182): la explicación termina en la solución que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  TONICA, TILDE, VOCALES_BANCO, MATES, generarTonica, generarTilde, generarVocales, generarMates,
  ayudaTonica, ayudaTilde, ayudaVocales, ayudaMates, llevaTilde, letraConTilde, escritaDe, nombreClase, sinTildes,
} from '../practicas/ortografia-tildes/logica.js';

const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ([.,;:])/g, '$1').trim();
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: i % 10, vidas: 5, anterior: null, idioma: 'es' });
const limpia = (html, donde) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|×/, donde);
  assert.doesNotMatch(plano(html), /\bnull\b/, donde);
};

function recorrer(generar, semilla, comprobar) {
  const rng = crearRng(semilla);
  for (let i = 0; i < N; i++) comprobar(generar(rng, sesion(i)));
}

test('ortografia-tildes, la sílaba tónica: la explicación nombra la tónica y la clase', () => {
  recorrer(generarTonica, 182001, item => {
    const it = TONICA[item.i];
    const html = ayudaTonica(it);
    const p = plano(html);
    limpia(html, p);
    assert.ok(p.endsWith(`palabra ${nombreClase(it.clase)}.`), p);
    assert.match(p, /La respuesta es: tónica «[^»]+»/, p);
  });
});

test('ortografia-tildes, ¿lleva tilde?: termina en la sílaba tocada o en «Ninguna»', () => {
  recorrer(generarTilde, 182002, item => {
    const it = TILDE[item.i];
    const html = ayudaTilde(it);
    const p = plano(html);
    limpia(html, p);
    if (llevaTilde(it)) {
      assert.ok(p.endsWith(`${escritaDe(it)}.`), p);
      assert.ok(escritaDe(it) !== sinTildes(escritaDe(it)), 'si lleva tilde, la forma escrita la tiene');
    } else {
      assert.ok(p.endsWith('«Ninguna»: no lleva tilde.'), p);
    }
  });
});

test('ortografia-tildes, diptongos e hiatos: termina en la letra con tilde, en «Ninguna» o en aún / aun', () => {
  recorrer(generarVocales, 182003, item => {
    const it = VOCALES_BANCO[item.i];
    const html = ayudaVocales(it);
    const p = plano(html);
    limpia(html, p);
    if (it.tipo === 'aun') {
      assert.ok(p.endsWith(`La respuesta es ${it.buena}.`), p);
      return;
    }
    const pos = letraConTilde(it);
    if (pos === null) assert.ok(p.endsWith('«Ninguna»: no lleva tilde.'), p);
    else assert.ok(p.endsWith(`tocar la «${it.escrita[pos]}»: ${it.escrita}.`), p);
  });
});

test('ortografia-tildes, las palabras de Matemáticas: termina en la palabra bien escrita', () => {
  recorrer(generarMates, 182004, item => {
    const it = MATES[item.i];
    const html = ayudaMates(it);
    const p = plano(html);
    limpia(html, p);
    assert.ok(p.endsWith(`La respuesta es ${it.escrita}.`), p);
  });
});
