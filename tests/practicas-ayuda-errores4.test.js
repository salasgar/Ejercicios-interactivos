// «No lo sé» en errores4 (tarea 172; revisada en la 190): cada explicación lleva la solución del ítem
// (verdadera o falsa, el nombre del error, la línea mala, el resultado bien hecho), en los dos idiomas.
// Además vigila lo que corrigió la revisión: la verdadera dice POR QUÉ lo es (la cuenta o la
// comparación bien hecha, no solo «Verdadera»); la respuesta va al final; los pasos de `pasosBien`
// son cuentas de verdad (cada uno vale lo mismo que el enunciado); sin «Se llama: Ha…» (mayúscula
// tras los dos puntos) y sin el consejo vago «el método bueno».

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, fraccion, aTexto, analizar, evaluar } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/errores4/logica.js';
import * as X from '../practicas/errores4/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const sano = (html, donde) => {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /\d\s*\/\s*\d/, `fracciones con raya — ${donde}`);
  assert.doesNotMatch(plano(html), /Se llama|It is called|método bueno|right method/, `${donde}: ${plano(html)}`);
};
const esComparacion = item => Boolean(L.COMPARACION_POR_ID[item.plantilla]);
const termina = (texto, fin) => assert.ok(texto.trim().endsWith(fin), `la respuesta va al final: ${texto}`);

test('pasosBien: cada paso de la cuenta bien hecha vale lo mismo que el enunciado y acaba en el resultado', () => {
  const rng = crearRng(9);
  for (const p of L.PLANTILLAS) for (let i = 0; i < 200; i++) {
    const params = p.numeros(rng);
    if (!params) continue;
    const pasos = X.pasosBien(p.id, params);
    const valor = evaluar(analizar(p.l0(params)));
    for (const paso of pasos) assert.ok(evaluar(analizar(paso)).equals(valor), `${p.id}: ${pasos.join(' = ')}`);
    assert.equal(pasos[0], p.l0(params));
    assert.equal(pasos.at(-1), aTexto(p.bien(params)), `${p.id}: ${pasos.join(' = ')}`);
    assert.equal(new Set(pasos).size, pasos.length, `sin pasos repetidos: ${pasos.join(' = ')}`);
  }
});

test('errores4, ejercicio 1: la cuenta o la comparación bien hecha, y al final si es verdadera o falsa (y el error)', () => {
  let verdaderas = 0, falsas = 0;
  for (const idioma of IDIOMAS) for (const item of items(L.generarBienMal, 1)) {
    const html = X.explicaBienMal(item, textosDe(idioma));
    sano(html, `bienmal ${idioma}`);
    const texto = plano(html);
    if (esComparacion(item)) {
      const rel = { '<': '&lt;', '>': '&gt;' }[L.relacionBuena(item.params)];
      assert.ok(html.includes(`${L.ex(item.izq)} ${rel} ${L.ex(item.der)}`), `la comparación bien hecha: ${texto}`);
    } else {
      const pasos = X.pasosBien(item.plantilla, item.params);
      assert.ok(html.includes(pasos.map(L.ex).join(' = ')), `la cuenta bien hecha: ${texto}`);
    }
    if (item.verdadera) {
      verdaderas++;
      termina(texto, idioma === 'es' ? '«Verdadera».' : '“True”.');
      assert.ok(!texto.includes(idioma === 'es' ? '«Falsa»' : '“False”'), texto);
    } else {
      falsas++;
      assert.ok(texto.includes(idioma === 'es' ? '«Falsa»' : '“False”'), texto);
      termina(texto, `${ERRORES_TIPICOS[item.error].nombre[idioma]}${idioma === 'es' ? '».' : '”.'}`);
    }
  }
  assert.ok(verdaderas > 300 && falsas > 300, 'salen de las dos clases');
});

test('errores4, ejercicio 2 en columnas: cada columna explicada, la regla rota en negrita y al final dónde está el error', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarColumnas, 2)) {
    const html = X.explicaLinea(item, textosDe(idioma));
    sano(html, `columnas ${idioma}`);
    const texto = plano(html).replace(/\s+\.$/, '.');
    const malas = item.columnas.map((c, j) => (c.error ? L.LETRAS[j] : null)).filter(Boolean);
    const lista = malas.length === 1 ? malas[0] : `${malas.slice(0, -1).join(', ')} ${idioma === 'es' ? 'y' : 'and'} ${malas.at(-1)}`;
    termina(texto, `${idioma === 'es' ? (malas.length > 1 ? 'las columnas' : 'la columna') : (malas.length > 1 ? 'columns' : 'column')} ${lista}.`);
    assert.doesNotMatch(texto, /línea \d|line \d/, 'sin números de línea (JL, 22-11)');
    assert.equal((html.match(/class="columna-explica"/g) ?? []).length, item.columnas.length, 'una explicación por columna');
    item.columnas.forEach((c, j) => {
      assert.ok(html.includes(`${idioma === 'es' ? 'Columna' : 'Column'} ${L.LETRAS[j]}.`), texto);
      if (!c.error) return;
      if (c.error === L.CUENTA) {
        // El fallo de cuenta no tiene nombre ni regla rota: dice que es un fallo de cuenta y la cuenta bien hecha (JL, 23-11).
        assert.ok(html.includes(X.TX.fallo_cuenta[idioma]), 'el fallo de cuenta');
        assert.ok(html.includes(`= ${L.ex(c.cuenta.bien)}`), texto);
        return;
      }
      assert.ok(html.includes('class="regla-rota"'), 'la regla rota, en negrita');
      const corregida = L.PLANTILLA_POR_ID[c.error].corregida(c.params);
      assert.ok(html.includes(`= ${L.ex(corregida)}`), texto);
      assert.ok(evaluar(analizar(corregida)).equals(evaluar(analizar(item.enunciado))), corregida);
      assert.ok(html.includes(ERRORES_TIPICOS[c.error].nombre[idioma]), texto);
    });
  }
});

test('errores4, ejercicio 3: la cuenta bien hecha paso a paso y al final el resultado (irreducible)', () => {
  for (const idioma of IDIOMAS) for (const item of items(L.generarArregla, 3)) {
    const html = X.explicaArregla(item, textosDe(idioma));
    sano(html, `arregla ${idioma}`);
    const bien = aTexto(fraccion(item.bien.num, item.bien.den));
    termina(html, `${L.ex(bien)}</span>.`);
    assert.ok(html.includes(X.pasosBien(item.plantilla, item.params).map(L.ex).join(' = ')), plano(html));
    assert.ok(html.includes(ERRORES_TIPICOS[item.error].nombre[idioma]), plano(html));
  }
});
