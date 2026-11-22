// «No lo sé» en errores3: cada explicación acaba con la respuesta que el ejercicio da por buena
// (línea, nombre del error o bien/error) y, si hay error, trae la línea mala y cómo queda bien.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, evaluar, html as htmlEntero } from '../practicas/_comun/enteros.js';
import * as L from '../practicas/errores3/logica.js';
import * as X from '../practicas/errores3/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };

function comprobar(html, idioma, esperado, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FIN[idioma]} <strong>(.*?)</strong>\\.$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
}

/**
 * Con error, la tarjeta enseña la línea mala y «Bien hecho sería: = …», y esa línea corregida vale lo
 * mismo que la anterior (se evalúa). No dice «Se llama: …»: el nombre solo sale como respuesta del ej. 2.
 */
function comprobarCuerpo(item, html, idioma, que) {
  assert.doesNotMatch(html, /Se llama|It is called/, `${que}: ${plano(html)}`);
  if (item.falsa === null) return;
  assert.ok(html.includes(X.linea(item.lineas[item.falsa], item.falsa)), `${que}: falta la línea mala — ${plano(html)}`);
  const corregida = L.PLANTILLA_POR_ID[item.plantilla].corregida(item.params);
  assert.equal(evaluar(corregida), evaluar(item.lineas[item.falsa - 1]), `${que}: la línea corregida no vale lo de antes`);
  assert.ok(html.includes(`${T_CORRECTA[idioma]} <span class="linea-mala">= ${htmlEntero(corregida)}</span>`), `${que}: falta cómo queda bien — ${plano(html)}`);
}
const T_CORRECTA = { es: 'Lo correcto es:', en: 'The right way is:' };

test('ej. 1 (columnas): cada columna dice si está bien o su línea mala, el error, la regla en negrita y lo correcto; al final, qué columnas', () => {
  for (const item of items(L.generarDonde, 1)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaDonde(item, ctx(idioma));
      assert.doesNotMatch(html, /undefined|NaN|\[object|null|×|Se llama|It is called|línea \d|line \d/, plano(html));
      const letras = item.columnas.map((c, j) => (c.error ? L.LETRAS[j] : null)).filter(Boolean);
      const lista = letras.length === 1 ? letras[0] : `${letras[0]} ${idioma === 'es' ? 'y' : 'and'} ${letras[1]}`;
      const fin = idioma === 'es' ? `El error está en <strong>${letras.length === 1 ? 'la columna' : 'las columnas'} ${lista}</strong>.` : `The mistake is in <strong>${letras.length === 1 ? 'column' : 'columns'} ${lista}</strong>.`;
      assert.ok(html.endsWith(fin), `${idioma}: ${plano(html)}`);
      item.columnas.forEach((c, j) => {
        assert.ok(html.includes(`${idioma === 'es' ? 'Columna' : 'Column'} ${L.LETRAS[j]}.`), plano(html));
        if (!c.error) return;
        assert.ok(html.includes(`= ${htmlEntero(c.lineas[c.falsa])}</span>`), `falta la línea mala de ${L.LETRAS[j]}`);
        assert.ok(html.includes(X.REGLAS[c.error][idioma].replace(/\^(\d+)/g, '<sup>$1</sup>')), 'la regla');
        assert.ok(html.includes(`${T_CORRECTA[idioma]} <span class="linea-mala">= ${htmlEntero(L.explicaColumna(c).corregida)}</span>`), 'lo correcto');
      });
    }
  }
});

test('ej. 2: acaba con el nombre del error verdadero, que sale una sola vez', () => {
  for (const item of items(L.generarCual, 2)) {
    assert.ok(item.opciones.includes(item.solucion));
    for (const idioma of IDIOMAS) {
      const nombre = idioma === 'es' ? `«${ERRORES_TIPICOS[item.solucion].nombre.es}»` : `“${ERRORES_TIPICOS[item.solucion].nombre.en}”`;
      const html = X.explicaCual(item, ctx(idioma));
      comprobar(html, idioma, nombre, `ej2 ${idioma}`);
      comprobarCuerpo(item, html, idioma, `ej2 ${idioma}`);
      assert.equal(html.split(ERRORES_TIPICOS[item.solucion].nombre[idioma]).length, 2, `ej2 ${idioma}: el nombre sale más de una vez`);
    }
  }
});

test('ej. 3: acaba con «hay un error» o «está bien», según el ítem', () => {
  let bien = 0;
  for (const item of items(L.generarSiNo, 3)) {
    if (item.solucion === 'bien') bien++;
    for (const idioma of IDIOMAS) {
      const esperado = { bien: { es: '«Está bien»', en: '“It is right”' }, error: { es: '«Hay un error»', en: '“There is a mistake”' } }[item.solucion][idioma];
      const html = X.explicaSiNo(item, ctx(idioma));
      comprobar(html, idioma, esperado, `ej3 ${idioma}`);
      comprobarCuerpo(item, html, idioma, `ej3 ${idioma}`);
    }
  }
  assert.ok(bien > 100 && bien < N - 100, 'salen ítems con y sin error');
});
