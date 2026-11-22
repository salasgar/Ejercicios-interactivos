// «No lo sé» en `errores6` (tarea 177): la explicación lleva la línea mala, el nombre del error y,
// en «Corrígelo», el valor de x que el ejercicio da por bueno. 1000+ ítems por ejercicio, dos idiomas.

import test from 'node:test';
import { errorEnLinea } from '../practicas/_comun/procedimiento.js';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS } from '../practicas/_comun/algebra.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/errores6/logica.js';
import * as X from '../practicas/errores6/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const items = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinDosSignos = html => html.replace(/· −(\d+)/g, '· (−$1)');

test('errores6 · ejercicio 1: dice la línea mala, el error y cómo queda; o que todo está bien', () => {
  let sinError = 0;
  for (const item of items(L.generarDonde, 701)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaDonde(item, ctx(idioma));
      if (item.falsa === null) {
        sinError++;
        assert.ok(html.includes(X.TX.todo_bien_es[idioma]));
      } else {
        // JL, 22-11: la línea con ordinal, sin números de línea ni «Se llama:», y la regla rota en negrita.
        assert.ok(html.includes(errorEnLinea(item.falsa, idioma)), 'la línea, con ordinal');
        assert.doesNotMatch(html, /línea \d|line \d|Se llama|It is called/, 'sin números de línea ni «Se llama:»');
        assert.ok(html.includes(`<strong class="regla-rota">${X.REGLAS[item.error][idioma]}</strong>`), 'la regla rota, en negrita');
        assert.ok(html.includes(ERRORES_TIPICOS[item.error].nombre[idioma]), 'el nombre del error');
        if (!X.SOLO_REGLA.has(item.error)) assert.ok(html.includes(sinDosSignos(L.porque(item, idioma))), 'el porqué con los números');
        assert.doesNotMatch(html, /· −\d/, 'un negativo detrás de «·» va entre paréntesis');
      }
    }
  }
  assert.ok(sinError > 100, 'hay ítems sin error');
});

test('errores6 · ejercicio 2: la explicación lleva el nombre del error que el ejercicio da por bueno', () => {
  for (const item of items(L.generarQue, 702)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaQue(item, ctx(idioma));
      assert.ok(html.includes(ERRORES_TIPICOS[item.solucion].nombre[idioma]));
      assert.ok(html.includes(errorEnLinea(item.falsa, idioma)));
    }
  }
});

test('errores6 · ejercicio 3: la explicación acaba en el valor de x que se acepta', () => {
  for (const item of items(L.generarCorrige, 703)) {
    const bueno = L.resultadoBueno(item);
    assert.equal(L.corregirCorrige(item, bueno).acierto, true, 'es la que el ejercicio da por buena');
    for (const idioma of IDIOMAS) {
      const html = X.explicaCorrige(item, ctx(idioma));
      // Revisión 191: la solución con raya, el porqué sin «· −6», y las líneas buenas desde la corregida hasta la x.
      assert.ok(html.endsWith(`<span class="cuenta"><i>x</i> = ${htmlFraccion(bueno)}</span>.`), 'el valor de x');
      if (!X.SOLO_REGLA.has(item.error)) assert.ok(html.includes(sinDosSignos(L.porque(item, idioma))));
      assert.doesNotMatch(html, /· −\d/);
      const ultima = L.lineasBuenas(item).filter(l => !l.t).at(-1);
      if (L.lineasBuenas(item).length > item.falsa + 1) assert.ok(html.includes(L.htmlLinea(ultima, idioma)), `la última línea buena — ${html}`);
    }
  }
});
