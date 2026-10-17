// Los cuatro estados de la corrección de los botones de números (tarea 56):
// la función que decide la clase y el CSS común que la pinta.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { claseCorreccion } from '../practicas/_comun/piezas.js';

const leer = ruta => readFileSync(new URL(`../${ruta}`, import.meta.url), 'utf8');

test('claseCorreccion: tabla de verdad de los cuatro estados', () => {
  assert.equal(claseCorreccion(true, true), 'bien');
  assert.equal(claseCorreccion(true, false), 'mal');
  assert.equal(claseCorreccion(false, true), 'falta');
  assert.equal(claseCorreccion(false, false), '');
});

test('CSS común: reglas de bien, falta y mal, después de [aria-pressed] y :disabled', () => {
  const css = leer('practicas/_comun/estilos.css');
  const pulsado = css.indexOf('.botones-numeros button[aria-pressed="true"]');
  const desactivado = css.indexOf('.botones-numeros button:disabled');
  const bien = css.indexOf('.botones-numeros button.bien { background');
  const falta = css.indexOf('.botones-numeros button.falta { background');
  const mal = css.indexOf('.botones-numeros button.mal { background');
  for (const [nombre, pos] of Object.entries({ pulsado, desactivado, bien, falta, mal })) {
    assert.ok(pos >= 0, `falta la regla ${nombre}`);
  }
  for (const pos of [bien, falta, mal]) {
    assert.ok(pos > pulsado && pos > desactivado, 'la regla de corrección debe ir después');
  }
  assert.match(css.slice(falta, css.indexOf('}', falta)), /dashed/);
  assert.match(css.slice(mal, css.indexOf('}', mal)), /line-through/);
});

test('las copias de semáforo y rectángulos no han vuelto', () => {
  for (const p of ['semaforo', 'rectangulos']) {
    const css = leer(`practicas/${p}/estilos.css`);
    const sueltas = css.split('\n').filter(l => /\.botones-numeros button\.(bien|falta|mal)\b/.test(l) && !/\.ninguno/.test(l));
    assert.deepEqual(sueltas, [], `${p}/estilos.css repite reglas del común`);
  }
});

test('las prácticas con botones de números pintan la corrección solo con claseCorreccion', () => {
  for (const p of ['semaforo', 'rectangulos', 'constructor', 'baldosas']) {
    const js = leer(`practicas/${p}/practica.js`);
    assert.match(js, /claseCorreccion/, `${p} no usa claseCorreccion`);
    assert.doesNotMatch(js, /classList\.add\(\s*['"](bien|mal|falta)['"]/, `${p} pinta a mano`);
    assert.doesNotMatch(js, /classList\.add\([^)]*\?\s*['"](bien|mal|falta)['"]/, `${p} pinta a mano`);
  }
});
