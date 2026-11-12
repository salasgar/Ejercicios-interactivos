// «No lo sé» en «Valor numérico» (tarea 175): la explicación lleva la solución que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import {
  generarSustituye, generarTabla, generarQueValor, valorDe, numTexto, errorDeSustituye, erroresDeTabla, htmlDe, F,
} from '../practicas/valor-numerico/logica.js';
import { explicaSustituye, explicaTabla, explicaQueValor } from '../practicas/valor-numerico/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: 'es' });

test('valor-numerico, «sustituye»: la explicación lleva la cuenta y el resultado de cada ítem', () => {
  const rng = crearRng(175001);
  for (let i = 0; i < N; i++) {
    const item = generarSustituye(rng, sesion(i));
    const real = valorDe(item.e, item.v);
    assert.equal(errorDeSustituye(item, real), null, 'lo que se da por bueno');
    for (const idioma of IDIOMAS) {
      const html = explicaSustituye(item, textosDe(idioma));
      const que = `${idioma}: ${plano(html)}`;
      assert.ok(html.endsWith(`<span class="cuenta">${numTexto(real, idioma)}</span>.`), `el resultado al final — ${que}`);
      assert.ok(plano(html).includes(`= ${numTexto(real, idioma)}`), `la cuenta termina en el resultado — ${que}`);
      assert.doesNotMatch(html, /undefined|NaN|×/, que);
    }
  }
});

test('valor-numerico, «tabla»: la explicación lleva el valor de cada hueco', () => {
  const rng = crearRng(175002);
  for (let i = 0; i < N; i++) {
    const item = generarTabla(rng, sesion(i));
    for (const idioma of IDIOMAS) {
      const html = explicaTabla(item, textosDe(idioma));
      const que = `${idioma}: ${plano(html)}`;
      item.huecos.forEach(col => {
        const x = { num: item.xs[col], den: 1 };
        assert.equal(erroresDeTabla(item, item.huecos.map(h => F(item.valores[h]))).every(e => e === null), true);
        assert.ok(plano(html).includes(`= ${numTexto(valorDe(item.e, x), idioma)}`), `el hueco x = ${item.xs[col]} — ${que}`);
      });
      const finales = item.huecos.map(col => numTexto(valorDe(item.e, { num: item.xs[col], den: 1 }), idioma)).join(idioma === 'es' ? ' y ' : ' and ');
      assert.ok(html.endsWith(`<span class="cuenta">${finales}</span>.`), `los huecos al final — ${que}`);
      assert.doesNotMatch(html, /undefined|NaN|×/, que);
    }
  }
});

test('valor-numerico, «¿qué valor?»: la explicación señala la expresión que vale N', () => {
  const rng = crearRng(175003);
  for (let i = 0; i < N; i++) {
    const item = generarQueValor(rng, sesion(i));
    const buenas = item.opciones.filter(o => valorDe(o.e, item.v).equals(F(item.N)));
    assert.equal(buenas.length, 1, 'una sola expresión vale N');
    for (const idioma of IDIOMAS) {
      const html = explicaQueValor(item, textosDe(idioma));
      const que = `${idioma}: ${plano(html)}`;
      assert.ok(html.endsWith(`${htmlDe(buenas[0].e)}.`), `la expresión buena al final — ${que}`);
      assert.ok(plano(html).includes(`= ${numTexto(item.N, idioma)}`), `la cuenta da N — ${que}`);
      assert.doesNotMatch(html, /undefined|NaN|×/, que);
    }
  }
});
