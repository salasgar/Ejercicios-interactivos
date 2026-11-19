// «No lo sé» en `errores7` (tarea 225): la explicación lleva la línea mala, el nombre del error y,
// en «Corrígelo», el resultado que el ejercicio da por bueno. 1200 ítems por ejercicio, dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, aTexto } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/errores7/logica.js';
import * as X from '../practicas/errores7/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const items = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('errores7 · ejercicio 1: dice la línea mala, el error y cómo queda; o que todo está bien', () => {
  let sinError = 0;
  for (const item of items(L.generarDonde, 701)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaDonde(item, ctx(idioma));
      if (item.falsa === null) {
        sinError++;
        assert.ok(html.includes(X.TX.todo_bien_es[idioma]));
      } else {
        assert.ok(html.includes(X.TX.la_linea_es[idioma](item.falsa + 1)), 'el número de línea');
        assert.ok(html.includes(ERRORES_TIPICOS[item.error].nombre[idioma]), 'el nombre del error');
        assert.ok(html.includes(L.porque(item, idioma)), 'el porqué con los números');
      }
    }
  }
  assert.ok(sinError > 100, 'hay ítems sin error');
});

test('errores7 · ejercicio 2: la explicación lleva el nombre del error que el ejercicio da por bueno', () => {
  for (const item of items(L.generarQue, 702)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaQue(item, ctx(idioma));
      assert.ok(html.includes(ERRORES_TIPICOS[item.solucion].nombre[idioma]));
      assert.ok(html.includes(X.TX.la_linea_es[idioma](item.falsa + 1)));
    }
  }
});

test('errores7 · ejercicio 3: la explicación acaba en el resultado que se acepta', () => {
  for (const item of items(L.generarCorrige, 703)) {
    const bueno = L.resultadoBueno(item);
    assert.equal(L.corregirCorrige(item, bueno).acierto, true, 'es la que el ejercicio da por buena');
    for (const idioma of IDIOMAS) {
      const html = X.explicaCorrige(item, ctx(idioma));
      assert.ok(html.endsWith(`<span class="cuenta">${aTexto(bueno, idioma)}</span>.`), `el resultado — ${html}`);
      assert.ok(html.includes(L.porque(item, idioma)));
      const ultima = L.lineasBuenas(item).at(-1);
      assert.ok(html.includes(L.htmlLinea(ultima, idioma)) || item.falsa === 2, `la última línea buena — ${html}`);
    }
  }
});
