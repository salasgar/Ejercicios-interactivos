// «No lo sé» en `divisores` (tarea 183): la explicación lleva la solución que el ejercicio da por buena,
// calculada con su `logica.js`. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../divisores/logica.js';
import * as X from '../divisores/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<\/li>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (n, semilla, total = 1200) => {
  const rng = L.crearRng(semilla);
  return Array.from({ length: total }, (_, i) => L.generar(n, rng, { aciertos: i % 10, puntos: i % 10 }));
};
const RESP = /(?:La respuesta es|The answer is) (.*)\.(?: \(.*\))?(?: Consejo.*)?$/;
const nombres = (relaciones, idioma) => relaciones.map(r => `${idioma === 'es' ? '«' : '“'}${X.T[idioma].relacion[r]}${idioma === 'es' ? '»' : '”'}`);

test('divisores · ejercicio 1: la respuesta es «entre» solo con «divisible», y «de» con las demás', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(0, 1)) {
      const html = plano(X.explicaPreposicion(item, ctx(idioma)));
      const prep = item.relacion === 'divisible' ? (idioma === 'es' ? 'entre' : 'by') : (idioma === 'es' ? 'de' : 'of');
      const q = idioma === 'es' ? ['«', '»'] : ['“', '”'];
      assert.equal(html.match(RESP)?.[1], `${q[0]}${prep}${q[1]}`, html);
      assert.equal(X.T[idioma].preposicion[item.correcta], prep);
      assert.ok(html.includes(X.frase(item.relacion, item.x, item.y, idioma)), html);
      assert.ok(L.cumple(item.relacion, item.x, item.y), 'la frase es verdad');
      // Revisión 193: la preposición sale una vez en la frase completa y otra en la respuesta, no antes.
      assert.ok(!/lleva «|it takes “/.test(html), html);
    }
  }
});

test('divisores · ejercicios 2, 3 y 4: la respuesta nombra todas las relaciones verdaderas, con su cuenta', () => {
  for (const n of [1, 2, 3]) {
    for (const idioma of IDIOMAS) {
      for (const item of generar(n, 10 + n)) {
        const html = plano(X.explicaEleccion(item, ctx(idioma)));
        const dicho = html.match(RESP)?.[1];
        assert.ok(dicho, html);
        for (const r of L.RELACIONES) {
          const [nombre] = nombres([r], idioma);
          assert.equal(dicho.includes(nombre), item.correctas.includes(r), `${r}: ${html}`);
          assert.equal(L.cumple(r, item.x, item.y), item.correctas.includes(r));
        }
        for (const r of item.correctas) assert.ok(html.includes(X.frase(r, item.x, item.y, idioma)), html);
        // Revisión 193: «las dos valen» solo con dos; con tres, «las tres»; y sin «el 4 … o el 4 en la tabla del 4».
        const cuantas = { 1: null, 2: idioma === 'es' ? '(las dos valen)' : '(both are right)', 3: idioma === 'es' ? '(las tres valen)' : '(all three are right)' }[item.correctas.length];
        if (cuantas) assert.ok(html.includes(cuantas), html);
        assert.equal(/las dos valen|both are right/.test(html), item.correctas.length === 2, html);
        if (item.x === item.y) assert.ok(!html.includes(`en la tabla del ${item.x}, o el`) && !html.includes(`times table, or ${item.y} in`), html);
        assert.ok(html.includes(X.textoOperacion(item.op, idioma)), html);
      }
    }
  }
});

test('divisores · ejercicio 5: la solución que da vale y lleva su cuenta', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(4, 20)) {
      const sol = X.solucionExplicada(item);
      const html = plano(X.explicaArrastrar(item, ctx(idioma)));
      assert.ok(L.esCorrecta(item, sol));
      // Revisión 193: la colocación es la del consejo, el número grande de la operación con uno de los pequeños.
      const grande = Math.max(...item.numeros);
      assert.equal(item.relacion === 'divisor' ? sol[1] : sol[0], grande, html);
      assert.ok(item.numeros.includes(sol[0]) && item.numeros.includes(sol[1]), html);
      assert.ok(html.includes(X.frase(item.relacion, sol[0], sol[1], idioma)), html);
      assert.ok(html.includes(`${sol[0]} ${idioma === 'es' ? 'y' : 'and'} ${sol[1]}`), html);
      assert.ok(html.includes(X.cuentaRelacion(item.relacion, sol[0], sol[1], idioma)), html);
      // Revisión 193 (sesión): «La respuesta es …, por ejemplo», no «Una solución es».
      assert.ok(html.includes(idioma === 'es' ? `La respuesta es ${sol[0]} y ${sol[1]}, por ejemplo.` : `The answer is ${sol[0]} and ${sol[1]}, for example.`), html);
    }
  }
});

test('divisores: «No lo sé» declarado en los seis ejercicios (el 6, juego, sin botón)', async () => {
  const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'divisores'));
  const defs = practica.ejercicios;
  assert.equal(defs.length, 6);
  defs.slice(0, 5).forEach(d => assert.equal(typeof d.explicacion, 'function'));
  assert.deepEqual(defs[4].noLoSe, X.NO_SE_HACERLO);
  assert.ok(defs.slice(0, 4).every(d => !d.noLoSe));
  assert.match(defs[5].sinAyuda, /juego/);
  assert.equal(defs[5].explicacion, undefined);
});
