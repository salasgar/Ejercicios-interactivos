// «No lo sé» en `errores7` (tarea 225): la explicación lleva la línea mala, el nombre del error y,
// en «Corrígelo», el resultado que el ejercicio da por bueno. 1200 ítems por ejercicio, dos idiomas.

import test from 'node:test';
import { errorEnLinea, LO_CORRECTO } from '../practicas/_comun/procedimiento.js';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, aTexto } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/errores7/logica.js';
import * as X from '../practicas/errores7/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const items = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };

test('errores7 · ejercicio 1 (columnas): cada columna dice si está bien o su línea mala, el error, la regla en negrita y lo correcto; al final, qué columnas', () => {
  for (const item of items(L.generarDonde, 701)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaDonde(item, ctx(idioma));
      // JL, 22-11: sin números de línea ni «Se llama:», y la regla rota en negrita.
      assert.doesNotMatch(html, /undefined|NaN|\[object|null|×|línea \d|line \d|Se llama|It is called|Todo está bien|All correct/, html);
      const letras = item.columnas.map((c, j) => (c.error ? L.LETRAS[j] : null)).filter(Boolean);
      const lista = letras.length === 1 ? letras[0] : `${letras[0]} ${idioma === 'es' ? 'y' : 'and'} ${letras[1]}`;
      const fin = idioma === 'es' ? `El error está en <strong>${letras.length === 1 ? 'la columna' : 'las columnas'} ${lista}</strong>.`
        : `The mistake is in <strong>${letras.length === 1 ? 'column' : 'columns'} ${lista}</strong>.`;
      assert.ok(html.endsWith(fin), `${idioma}: ${html}`);
      item.columnas.forEach((c, j) => {
        assert.ok(html.includes(`<strong>${idioma === 'es' ? 'Columna' : 'Column'} ${L.LETRAS[j]}.</strong> ${c.error ? '' : c.porque[idioma]}`), `columna ${L.LETRAS[j]}`);
        if (!c.error) return;
        assert.ok(html.includes(`<span class="linea-mala">${X.cuenta(L.htmlLinea(c.lineas[c.falsa], idioma))}</span>`), `falta la línea mala de ${L.LETRAS[j]}`);
        assert.ok(html.includes(`${ERRORES_TIPICOS[c.error].nombre[idioma]}.<strong class="regla-rota">${X.REGLAS[c.error][idioma]}</strong>${c.porque[idioma]}`), 'el error, la regla en negrita y el porqué');
        assert.ok(html.includes(`${LO_CORRECTO[idioma]} <span class="linea-mala">${X.cuenta(L.htmlLinea(c.corregida, idioma))}</span>`), 'lo correcto');
      });
    }
  }
});

test('errores7 · ejercicio 2: la explicación lleva el nombre del error que el ejercicio da por bueno', () => {
  for (const item of items(L.generarQue, 702)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaQue(item, ctx(idioma));
      assert.ok(html.includes(ERRORES_TIPICOS[item.solucion].nombre[idioma]));
      assert.ok(html.includes(errorEnLinea(item.falsa, idioma)));
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
