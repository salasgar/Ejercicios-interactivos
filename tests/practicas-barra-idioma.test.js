// La barra del ejercicio va en el idioma del ítem (tarea 60). Es una red gruesa, no una
// prueba de comportamiento (no hay DOM en los tests): en el cuerpo de cabeceraEjercicio y
// pintarContador, ninguna llamada a t() sin idioma ni a tt() con un solo argumento, y el
// pie en inglés presente en el CSS común. Lo que se ve de verdad se comprueba en el navegador.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = readFileSync(new URL('../practicas/_comun/base.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../practicas/_comun/estilos.css', import.meta.url), 'utf8');

/** Cuerpo de `function nombre(...) { ... }` por balance de llaves. */
function cuerpo(nombre) {
  const ini = base.indexOf(`function ${nombre}(`);
  assert.ok(ini >= 0, `no encuentro ${nombre}`);
  const abre = base.indexOf('{', base.indexOf(')', ini));
  let prof = 0;
  for (let i = abre; i < base.length; i++) {
    if (base[i] === '{') prof++;
    else if (base[i] === '}' && --prof === 0) return base.slice(abre, i + 1);
  }
  throw new Error(`${nombre} sin cerrar`);
}

/** Argumentos (como texto) de cada llamada `nombre(...)` del texto, con paréntesis anidados. */
function llamadas(texto, nombre) {
  const res = [];
  const re = new RegExp(`(?<![\\w.])${nombre}\\(`, 'g');
  let m;
  while ((m = re.exec(texto))) {
    let prof = 1, i = re.lastIndex;
    for (; i < texto.length && prof > 0; i++) {
      if (texto[i] === '(') prof++;
      else if (texto[i] === ')') prof--;
    }
    res.push(texto.slice(re.lastIndex, i - 1));
  }
  return res;
}

/** Número de argumentos de nivel superior (comas fuera de paréntesis, llaves y corchetes). */
function nArgs(args) {
  if (!args.trim()) return 0;
  let prof = 0, n = 1;
  for (const c of args) {
    if ('([{'.includes(c)) prof++;
    else if (')]}'.includes(c)) prof--;
    else if (c === ',' && prof === 0) n++;
  }
  return n;
}

for (const f of ['cabeceraEjercicio', 'pintarContador']) {
  test(`${f}: t() y tt() llevan el idioma del ítem`, () => {
    const c = cuerpo(f);
    const t = llamadas(c, 't');
    const tt = llamadas(c, 'tt');
    assert.ok(t.length > 0, 'se esperaba al menos una llamada a t()');
    for (const a of t) assert.ok(nArgs(a) === 1, `t(${a}) sin idioma`);
    for (const a of tt) assert.ok(nArgs(a) === 2, `tt(${a}) sin idioma`);
  });
}

test('textoSalir recibe el idioma', () => {
  assert.match(base, /const textoSalir = idioma =>/);
  assert.match(cuerpo('cabeceraEjercicio'), /textoSalir\(idi\)/);
});

test('el pie sale en inglés con lang="en"', () => {
  assert.match(css, /html:lang\(en\) body::after[^}]*All rights reserved/);
});
