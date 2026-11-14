// «No lo sé» en «Las fichas del parchís» (tarea 186; el slug del catálogo sigue siendo fichas-de-pablo):
// la explicación de cada ejercicio lleva la solución del ítem, calculada con aritmética de números
// (no con el modelo de montones del feedback), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T, esc } from '../practicas/_comun/textos.js';
import { mcd, mcm, divisores } from '../practicas/_comun/aritmetica.js';
import {
  valor, generarLee, generarConstruye, generarProducto, generarQuita, generarRegla,
  generarTablaDivisores, generarMcd, generarMcm, nFichas,
} from '../practicas/fichas-del-parchis/logica.js';
import {
  explicaLee, explicaConstruye, explicaProducto, explicaQuita, explicaRegla, explicaDivisores, explicaMcd, explicaMcm,
} from '../practicas/fichas-del-parchis/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc });
const plano = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const generar = (fn, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
// El número aparece como palabra suelta (con o sin separador de miles), no dentro de otro.
const tiene = (h, n) => new RegExp(`(^|[^0-9])${n}([^0-9]|$)`).test(plano(h));

function caso(nombre, generador, semilla, explica, solucion) {
  test(`fichas-del-parchis, «${nombre}»: la explicación lleva la solución del ítem (${N} ítems, es y en)`, () => {
    for (const item of generar(generador, semilla)) {
      const hs = IDIOMAS.map(idioma => explica(item, textosDe(idioma)));
      hs.forEach((h, k) => {
        assert.doesNotMatch(h, /undefined|NaN|\[object|null|×/, plano(h));
        assert.ok(plano(h).length > 60, 'demasiado corta');
        solucion(item, h, IDIOMAS[k]);
      });
      assert.notEqual(hs[0], hs[1]);
    }
  });
}

caso('lee', generarLee, 1861, explicaLee, (item, h) => assert.ok(tiene(h, valor(item.m)), `lleva ${valor(item.m)}: ${plano(h)}`));
caso('construye', generarConstruye, 1862, explicaConstruye, (item, h) => assert.ok(tiene(h, valor(item.m)) && nFichas(item.m) > 0, plano(h)));
caso('producto', generarProducto, 1863, explicaProducto, (item, h) => {
  const producto = item.tipo === 'anadir' ? valor(item.a) * item.k : valor(item.a) * valor(item.b);
  assert.ok(tiene(h, producto), `lleva el producto ${producto}: ${plano(h)}`);
});
caso('quita', generarQuita, 1864, explicaQuita, (item, h) => {
  assert.equal(valor(item.a) % valor(item.d), 0, 'el ítem es una división exacta');
  assert.ok(tiene(h, valor(item.a) / valor(item.d)), `lleva el cociente: ${plano(h)}`);
});
caso('regla', generarRegla, 1865, explicaRegla, (item, h, idioma) => {
  if (item.divisible) {
    assert.equal(valor(item.a) % valor(item.d), 0);
    assert.ok(tiene(h, valor(item.a) / valor(item.d)), `lleva el cociente: ${plano(h)}`);
  } else {
    assert.notEqual(valor(item.a) % valor(item.d), 0);
    assert.match(plano(h), idioma === 'es' ? /no es divisible entre/ : /is not divisible by/);
  }
});
caso('divisores', generarTablaDivisores, 1866, explicaDivisores, (item, h) => {
  const ds = divisores(valor(item.a));
  assert.equal(item.n, ds.length);
  assert.ok(plano(h).includes(ds.join(', ')), `lleva todos los divisores: ${plano(h)}`);
  assert.ok(tiene(h, ds.length), 'lleva cuántos son');
});
caso('mcd', generarMcd, 1867, explicaMcd, (item, h) => {
  const g = mcd(valor(item.a), valor(item.b));
  assert.ok(tiene(h, g), `lleva el m.c.d. ${g}: ${plano(h)}`);
});
caso('mcm', generarMcm, 1868, explicaMcm, (item, h) => {
  const m = mcm(valor(item.a), valor(item.b));
  assert.ok(tiene(h, m), `lleva el m.c.m. ${m}: ${plano(h)}`);
});
