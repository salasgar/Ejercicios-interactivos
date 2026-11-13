// «No lo sé» en errores5: cada explicación acaba con la respuesta del ítem. El valor bueno de cada
// plantilla ya lo comprueba a mano `tests/practicas-errores5.test.js` (enteros con BigInt); aquí se
// comprueba que la explicación lleva justo esa respuesta, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, aTexto, deTexto, sumar, multiplicar, mismoValor } from '../practicas/_comun/decimales.js';
import { fraccion, htmlFraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/errores5/logica.js';
import * as X from '../practicas/errores5/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };

/**
 * Acaba con la respuesta y, además (revisión de la tarea 190): sin fracciones con barra, sin «<» / «>» sin
 * escapar, sin «Se llama:» (en el ej. 2 repetía la respuesta) y sin las frases del feedback que enseñan mal
 * («añadir un cero» con · 100 o · 1000; la cadena de redondeos con «→»).
 */
function comprobar(html, idioma, esperado, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.doesNotMatch(html, /\d\/\d/, `${que}: fracción con barra — ${plano(html)}`);
  assert.doesNotMatch(html, /\s[<>]\s/, `${que}: signo sin escapar — ${plano(html)}`);
  // (lo de antes de la respuesta: el nombre del error del ej. 2 sí puede decir «añadiendo un cero»)
  assert.doesNotMatch(html.split(FIN[idioma])[0], /Se llama:|It is called:|→|[Aa]ñadir un cero|[Aa]dding a zero/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} <strong>(.*?)</strong>\\.$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
}
const OPCION = { es: t => `«${t}»`, en: t => `“${t}”` };

/** Lo que tiene que enseñar siempre: la línea mala y la buena (si hay error) y el resultado bueno del cálculo. */
function enseña(item, html, idioma, que) {
  const p = L.PLANTILLA_POR_ID[item.plantilla];
  const bien = p.bien(item.params);
  if (bien && typeof bien === 'object') assert.ok(plano(html).includes(aTexto(bien, idioma)) || plano(html).includes(aTexto(bien.normalizar(), idioma)), `${que}: falta el resultado bueno ${aTexto(bien, idioma)} — ${plano(html)}`);
  if (item.falsa === null) return;
  const buena = L.htmlLinea(p.cadena(item.params, false).lineas[item.falsa], idioma);
  assert.ok(html.includes(L.htmlLinea(item.lineas[item.falsa], idioma)), `${que}: falta la línea mala`);
  assert.ok(html.includes(buena), `${que}: falta la línea buena ${buena}`);
}

test('ej. 1: acaba con la línea mala, o con «Todo está bien» como el botón; y enseña cómo se hace, también sin error', () => {
  let sinError = 0;
  for (const item of items(L.generarDonde, 1)) {
    assert.equal(item.falsa === null, item.error === null);
    if (item.falsa === null) sinError++;
    for (const idioma of IDIOMAS) {
      const esperado = item.falsa === null
        ? OPCION[idioma](X.TX.todo_bien[idioma])
        : { es: `la línea ${item.falsa + 1}`, en: `line ${item.falsa + 1}` }[idioma];
      const html = X.explicaDonde(item, ctx(idioma));
      comprobar(html, idioma, esperado, `ej1 ${idioma}`);
      enseña(item, html, idioma, `ej1 ${item.plantilla} ${idioma}`);
      assert.ok(html.includes(L.comoSeHace(item, idioma)), `ej1 ${idioma}: falta cómo se hace`);
    }
  }
  assert.ok(sinError > 100 && sinError < N - 100, 'salen ítems con y sin error');
});

test('ej. 2: acaba con el nombre del error verdadero, con sus fracciones con raya', () => {
  for (const item of items(L.generarQue, 2)) {
    assert.ok(item.opciones.includes(item.solucion));
    for (const idioma of IDIOMAS) {
      const nombre = ERRORES_TIPICOS[item.solucion].nombre[idioma]
        .replace(/(\d+)\/(\d+)/g, (_, a, b) => htmlFraccion(fraccion(Number(a), Number(b)), { compacta: true }));
      const html = X.explicaQue(item, ctx(idioma));
      comprobar(html, idioma, OPCION[idioma](nombre), `ej2 ${idioma}`);
      enseña(item, html, idioma, `ej2 ${item.plantilla} ${idioma}`);
    }
  }
});

test('ej. 3: acaba con el resultado bien, con las cifras decimales que pide la línea', () => {
  for (const item of items(L.generarCorrige, 3)) {
    for (const idioma of IDIOMAS) {
      const esperado = aTexto(L.resultadoBueno(item), idioma, item.cifras);
      const html = X.explicaCorrige(item, ctx(idioma));
      comprobar(html, idioma, esperado, `ej3 ${idioma}`);
      enseña(item, html, idioma, `ej3 ${item.plantilla} ${idioma}`);
    }
  }
});

test('cómo se hace: el redondeo sube o se deja según la cifra siguiente, y las cuentas que dice son verdad', () => {
  for (const item of items(L.generarDonde, 4)) {
    for (const idioma of IDIOMAS) {
      const t = plano(L.comoSeHace(item, idioma));
      const r = t.match(idioma === 'es' ? /cifra siguiente, (\d): como es (5 o más|menor que 5)/ : /next digit, (\d): it is (5 or more|less than 5)/);
      if (item.plantilla.startsWith('redondea')) {
        assert.ok(r, `${idioma}: ${t}`);
        assert.equal(Number(r[1]) >= 5, r[2] === '5 o más' || r[2] === '5 or more', `${idioma}: ${t}`);
      }
      // Toda «a + b = c» y «a : b = c» con números que dice la tarjeta, cierta.
      for (const [, a, op, b, c] of t.matchAll(/(?<!· |[\d.,])(\d+(?:[.,]\d+)?) ([+:]) (\d+(?:[.,]\d+)?) = (\d+(?:[.,]\d+)?)(?![\d…]|[.,]\d)/g)) {
        const [x, y, z] = [a, b, c].map(s => deTexto(s));
        const ok = op === '+' ? mismoValor(sumar(x, y), z) : mismoValor(multiplicar(y, z), x);
        assert.ok(ok, `${idioma}: ${a} ${op} ${b} = ${c} — ${t}`);
      }
    }
  }
});
