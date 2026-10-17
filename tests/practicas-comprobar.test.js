// «Comprobar» se oculta al responder (tarea 58). Es una red gruesa, no una prueba de
// comportamiento: cada práctica que pinta un botón con class="comprobar" y lo escucha
// tiene que contener alguna forma de ocultarlo (.hidden = true, style.display = 'none'
// o .remove()). Sirve contra la próxima práctica que se olvide; lo que de verdad
// desaparece al responder se comprueba en el navegador.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const raiz = new URL('../practicas/', import.meta.url);

// Prácticas correctas que no pasan la red por cómo están escritas: slug → motivo.
const EXCEPCIONES = {
  recta: 'pendiente: otra sesión tiene cambios sin commit en practicas/recta/; quitar al ocultar el botón',
};

const ocultan = /\.hidden\s*=\s*true|style\.display\s*=\s*['"]none['"]|\.remove\(\)/;

test('toda práctica con botón «comprobar» escuchado lo oculta al responder', () => {
  const sinOcultar = [];
  for (const d of readdirSync(raiz, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name === 'plantilla' || d.name.startsWith('_')) continue;
    const ruta = new URL(`${d.name}/practica.js`, raiz);
    if (!existsSync(ruta)) continue;
    const src = readFileSync(ruta, 'utf8');
    if (!/class="comprobar/.test(src) || !/addEventListener\('click'/.test(src)) continue;
    if (EXCEPCIONES[d.name]) continue;
    if (!ocultan.test(src)) sinOcultar.push(d.name);
  }
  assert.deepEqual(sinOcultar, [], `Sin ocultar «Comprobar» al responder: ${sinOcultar.join(', ')}`);
});
