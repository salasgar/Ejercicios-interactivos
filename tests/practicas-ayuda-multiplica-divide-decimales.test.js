// «No lo sé» en multiplica-divide-decimales: cada explicación lleva la solución del ítem, calculada
// aquí con las funciones de la lógica y de decimales.js (no copiada de la explicación).

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { aTexto, multiplicar, porPotenciaDe10, comparar } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/multiplica-divide-decimales/logica.js';
import * as X from '../practicas/multiplica-divide-decimales/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const FINAL = { es: 'La respuesta es', en: 'The answer is' };

/** La explicación acaba con «La respuesta es <strong>X</strong>.» y X es lo que se calcula aquí. */
function comprobar(html, idioma, esperado, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FINAL[idioma]} <strong>(.*?)</strong>\\.$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
}

test('ej. 1: la explicación acaba con el resultado, calculado con enteros escalados', () => {
  for (const item of items(L.generarComa, 1)) {
    const buena = item.forma === 'producto'
      ? multiplicar(L.D(item.a), L.D(item.b))
      : porPotenciaDe10(L.D(item.d), item.op === 'por' ? -item.p : item.p);
    for (const idioma of IDIOMAS) {
      const html = X.explicaComa(item, ctx(idioma));
      comprobar(html, idioma, aTexto(buena.normalizar(), idioma), `ej1 ${idioma}`);
    }
  }
});

test('ej. 2: la explicación acaba con el cociente exacto (cociente · divisor = dividendo)', () => {
  for (const item of items(L.generarEntre, 2)) {
    assert.equal(comparar(multiplicar(L.D(item.cociente), L.D({ m: item.divisor, k: 0 })), L.D(item.dividendo)), 0);
    for (const idioma of IDIOMAS) comprobar(X.explicaEntre(item, ctx(idioma)), idioma, aTexto(L.D(item.cociente).normalizar(), idioma), `ej2 ${idioma}`);
  }
});

test('ej. 3: la explicación acaba con el cociente o con la división sin coma en el divisor', () => {
  for (const item of items(L.generarDecimal, 3)) {
    assert.equal(comparar(multiplicar(L.D(item.cociente), L.D(item.divisor)), L.D(item.dividendo)), 0);
    const s = L.D(item.divisor).k;
    for (const idioma of IDIOMAS) {
      const esperado = item.tipo === 'equivalente'
        ? `${aTexto(porPotenciaDe10(L.D(item.dividendo), s).normalizar(), idioma)} : ${aTexto(porPotenciaDe10(L.D(item.divisor), s).normalizar(), idioma)}`
        : aTexto(L.D(item.cociente).normalizar(), idioma);
      comprobar(X.explicaDecimal(item, ctx(idioma)), idioma, esperado, `ej3 ${item.tipo} ${idioma}`);
    }
  }
});

test('ej. 4: la explicación dice «está bien» solo cuando la prueba cuadra', () => {
  for (const item of items(L.generarEstaBien, 4)) {
    const cuadraMostrado = L.cuadra(item.a, item.b, item.mostrado.cociente, item.mostrado.resto);
    assert.equal(cuadraMostrado, item.estaBien);
    const esperado = { es: cuadraMostrado ? 'que está bien hecha' : 'que está mal hecha', en: cuadraMostrado ? 'that it is right' : 'that it is wrong' };
    for (const idioma of IDIOMAS) comprobar(X.explicaEstaBien(item, ctx(idioma)), idioma, esperado[idioma], `ej4 ${idioma}`);
  }
});

test('ej. 5: la explicación acaba con la respuesta del problema', () => {
  for (const item of items(L.generarProblema, 5)) {
    const r = aTexto(L.respuestaProblema(item), 'es');
    for (const idioma of IDIOMAS) {
      const html = X.explicaProblema(item, ctx(idioma));
      const valor = aTexto(L.respuestaProblema(item), idioma);
      const esperado = item.tipo === 'litros' ? `${valor} L` : (idioma === 'en' ? `€${valor}` : `${valor} €`);
      comprobar(html, idioma, esperado, `ej5 ${item.tipo} ${idioma} (${r})`);
    }
  }
});

test('ej. 6: la explicación acaba con el resultado de la combinada, por jerarquía', () => {
  for (const item of items(L.generarCombinada, 6)) {
    const buena = L.evaluar(item.expresion);
    for (const idioma of IDIOMAS) comprobar(X.explicaCombinada(item, ctx(idioma)), idioma, aTexto(buena.normalizar(), idioma), `ej6 ${idioma}`);
  }
});
