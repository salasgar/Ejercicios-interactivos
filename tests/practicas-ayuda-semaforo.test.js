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
        // Revisión 193: «La respuesta es 2 y 3.», sin dos puntos; «Ninguno» entre comillas, como el botón.
        const esperado = item.correctos.length === 0 ? (idioma === 'es' ? `«${X.TX.ninguno.es}»` : `“${X.TX.ninguno.en}”`)
          : item.correctos.length === 1 ? String(item.correctos[0])
            : `${item.correctos.slice(0, -1).join(', ')}${y}${item.correctos.at(-1)}`;
        assert.ok(html.endsWith(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${esperado}.`), html);
        assert.ok(!/(respuesta es|answer is):/.test(html), html);
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
      // Revisión 193: la respuesta, al final y una vez; el criterio, aplicado con el hueco (como en los apuntes).
      const completas = item.cifras.map((c, i) => (i === item.hueco ? item.solucion : c));
      const n = Number(completas.join(''));
      assert.ok(html.endsWith(idioma === 'es' ? `La respuesta es ${item.solucion} (el número es ${n}).` : `The answer is ${item.solucion} (the number is ${n}).`), html);
      assert.equal(html.match(/La respuesta es|The answer is/g).length, 1, html);
      assert.ok(!/Prueba cifras|Try digits|La cifra que falta es|The missing digit is/.test(html), html);
      for (const d of item.divisores.filter(d => d === 3 || d === 9)) {
        const conocidas = item.cifras.filter((_, i) => i !== item.hueco);
        const suma = conocidas.reduce((s, c) => s + c, 0);
        assert.ok(html.includes(`${conocidas.join(' + ')} = ${suma}`), html);
        assert.ok(html.includes(`${suma} + ${item.solucion} = ${suma + item.solucion}`), html);
        assert.equal((suma + item.solucion) % d, 0);
      }
      if (item.divisores.includes(11)) {
        const s = p => completas.filter((_, i) => i % 2 === p).reduce((a, c) => a + c, 0);
        const [a, b] = [s(0), s(1)];
        assert.ok(html.includes(`${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)}`), html);
        assert.equal(Math.abs(a - b) % 11, 0);
      }
      const buenas = [];
      for (let x = 0; x <= 9; x++) {
        const c = [...item.cifras]; c[item.hueco] = x;
        const n = c.reduce((s, v) => s * 10 + v, 0);
        if (!(item.hueco === 0 && x === 0) && item.divisores.every(d => n % d === 0)) buenas.push(x);
      }
      assert.deepEqual(buenas, [item.solucion]);
      for (const d of item.divisores) assert.ok(html.includes(idioma === 'es' ? `Para el ${d}` : `For ${d}`), html);
    }
  }
});

test('semaforo: «No lo sé» declarado en los cuatro ejercicios', async () => {
  const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'semaforo'));
  assert.equal(practica.ejercicios.length, 4);
  practica.ejercicios.forEach(d => assert.equal(typeof d.explicacion, 'function'));
});
