// «No lo sé» en `semaforo` (tarea 183): la explicación lleva la solución que el ejercicio da por buena,
// calculada con su `logica.js`. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../practicas/semaforo/logica.js';
import * as X from '../practicas/semaforo/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<\/(li|p)>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const generar = (ejercicio, semilla, total = 1200) => { const rng = crearRng(semilla); return Array.from({ length: total }, () => L.generar(ejercicio, rng)); };

test('semaforo · ejercicios 1 y 2: la respuesta es la lista exacta de divisores, y cada botón lleva su criterio', () => {
  for (const ej of [1, 2]) {
    for (const idioma of IDIOMAS) {
      for (const item of generar(ej, ej)) {
        const html = plano(X.explicaSemaforo(item, ctx(idioma)));
        const y = idioma === 'es' ? ' y ' : ' and ';
        const esperado = item.correctos.length === 0 ? X.TX.ninguno[idioma]
          : item.correctos.length === 1 ? String(item.correctos[0])
            : `${item.correctos.slice(0, -1).join(', ')}${y}${item.correctos.at(-1)}`;
        assert.ok(html.endsWith(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'}: ${esperado}.`), html);
        assert.deepEqual(item.correctos, item.divisores.filter(d => item.n % d === 0), 'los correctos son los que dividen');
        for (const d of item.divisores) assert.ok(html.includes(`${d}: ${idioma === 'es' ? (item.n % d === 0 ? 'sí' : 'no') : (item.n % d === 0 ? 'yes' : 'no')}`), `botón ${d}: ${html}`);
        assert.equal(html.includes('11:'), ej === 2, 'el 11 solo sale en el ejercicio 2');
      }
    }
  }
});

test('semaforo · ejercicio 3: la respuesta es Sí/No y coincide con la división', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(3, 3)) {
      const html = plano(X.explicaSino(item, ctx(idioma)));
      const dicho = html.match(/(?:La respuesta es «|The answer is “)([^»”]+)[»”]\.$/)?.[1];
      assert.equal(dicho, item.correctos === 'si' ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No', html);
      const d = item.tipo === 'trampa' ? 24 : item.d;
      assert.equal(item.n % d === 0, item.correctos === 'si');
      assert.ok(html.includes(String(item.n)), html);
    }
  }
});

test('semaforo · ejercicio 4: la explicación da la cifra buena y es la única que cumple', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(4, 4)) {
      const html = plano(X.explicaCifra(item, ctx(idioma)));
      assert.ok(html.includes(`${idioma === 'es' ? 'La cifra que falta es' : 'The missing digit is'} ${item.solucion}:`), html);
      const buenas = [];
      for (let x = 0; x <= 9; x++) {
        const c = [...item.cifras]; c[item.hueco] = x;
        const n = c.reduce((s, v) => s * 10 + v, 0);
        if (!(item.hueco === 0 && x === 0) && item.divisores.every(d => n % d === 0)) buenas.push(x);
      }
      assert.deepEqual(buenas, [item.solucion]);
      for (const d of item.divisores) assert.ok(html.includes(`${d}: `), html);
    }
  }
});

test('semaforo: «No lo sé» declarado en los cuatro ejercicios', async () => {
  const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'semaforo'));
  assert.equal(practica.ejercicios.length, 4);
  practica.ejercicios.forEach(d => assert.equal(typeof d.explicacion, 'function'));
});
