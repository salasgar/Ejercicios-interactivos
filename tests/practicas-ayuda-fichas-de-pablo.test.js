// «No lo sé» en «Las fichas del parchís» (tarea 186; el slug del catálogo sigue siendo fichas-de-pablo):
// la explicación de cada ejercicio lleva la solución del ítem, calculada con aritmética de números
// (no con el modelo de montones del feedback), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T, esc } from '../practicas/_comun/textos.js';
import { mcd, mcm, divisores, factorizar, htmlFact } from '../practicas/_comun/aritmetica.js';
import { colorContado } from '../practicas/fichas-del-parchis/dibujo.js';
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
    assert.match(plano(h), idioma === 'es' ? /La respuesta es no, y falta el color/ : /The answer is no, and the missing colour is/);
  }
});
caso('divisores', generarTablaDivisores, 1866, explicaDivisores, (item, h, idioma) => {
  const ds = divisores(valor(item.a));
  assert.equal(item.n, ds.length);
  const conY = `${ds.slice(0, -1).join(', ')}${idioma === 'es' ? ' y ' : ' and '}${ds.at(-1)}`;
  assert.ok(plano(h).includes(conY), `lleva todos los divisores: ${plano(h)}`);
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

// ─── Revisión de la tarea 193: la respuesta, al final y tal como la pide cada ejercicio ───────
// Las fichas de la respuesta se calculan factorizando el NÚMERO (aritmetica.js), no con los montones.

const FIN = { es: 'La respuesta es ', en: 'The answer is ' };
/** «1 verde (green) y 2 azules (blue)» para un número, a partir de su factorización. */
function fichasDe(n, idioma) {
  const partes = factorizar(n).map(([p, e]) => colorContado(p, e, idioma));
  if (!partes.length) return idioma === 'es' ? 'ninguna ficha (no counters)' : 'no counters (ninguna ficha)';
  return partes.length === 1 ? partes[0] : `${partes.slice(0, -1).join(', ')}${idioma === 'es' ? ' y ' : ' and '}${partes.at(-1)}`;
}
const respuesta = (h, idioma) => {
  const p = plano(h).trim();
  assert.equal(p.split(FIN[idioma]).length - 1, 1, `una sola respuesta: ${p}`);
  return p.slice(p.indexOf(FIN[idioma]) + FIN[idioma].length).replace(/ ?\.$/, '').trim();
};
const sinSup = s => plano(s).trim();

function final(nombre, generador, semilla, explica, esperada) {
  test(`fichas-del-parchis, «${nombre}»: la tarjeta acaba con la respuesta del ejercicio, una vez (${N} ítems, es y en)`, () => {
    for (const item of generar(generador, semilla)) {
      for (const idioma of IDIOMAS) {
        const h = explica(item, textosDe(idioma));
        assert.equal(respuesta(h, idioma), sinSup(esperada(item, idioma)), plano(h));
        // Nada de «X = X» («125 : 25 = 5 = 5») ni de «quedan 1 …».
        assert.doesNotMatch(plano(h), /(?<![\d·] )\b(\d+) = \1(?=( ?[.),]| y | and | no | have |$))/, `igualdad repetida: ${plano(h)}`);
        assert.doesNotMatch(plano(h), /quedan 1 \S+ \(\S+\):/, 'con una sola ficha, «queda»');
        assert.doesNotMatch(h, /sin sumar nada|nothing is added/);
      }
    }
  });
}

final('lee', generarLee, 1931, explicaLee, item => `${valor(item.m)}`);
final('construye', generarConstruye, 1932, explicaConstruye, (item, idioma) => fichasDe(valor(item.m), idioma));
final('producto', generarProducto, 1933, explicaProducto, (item, idioma) => fichasDe(item.tipo === 'anadir' ? item.k : valor(item.a) * valor(item.b), idioma));
final('quita', generarQuita, 1934, explicaQuita, (item, idioma) => fichasDe(valor(item.d), idioma));
final('regla', generarRegla, 1935, explicaRegla, (item, idioma) => {
  if (item.divisible) {
    const q = htmlFact(factorizar(valor(item.a) / valor(item.d)));
    return idioma === 'es' ? `sí, y el cociente es ${q}` : `yes, and the quotient is ${q}`;
  }
  // El color que falta: el primo de d con más exponente que en a (calculado con los números).
  const fa = new Map(factorizar(valor(item.a)));
  const [c] = factorizar(valor(item.d)).find(([p, e]) => (fa.get(p) ?? 0) < e);
  const color = colorContado(c, 1, idioma).replace(/^1 /, '');
  return idioma === 'es' ? `no, y falta el color ${color.replace(/^(\S+)/, w => ({ verde: 'verde', azul: 'azul', amarilla: 'amarillo', roja: 'rojo' })[w] ?? w)}` : `no, and the missing colour is ${color.replace(/\((\S+)\)/, (_, w) => `(${({ verde: 'verde', azul: 'azul', amarilla: 'amarillo', roja: 'rojo' })[w] ?? w})`)}`;
});
final('divisores', generarTablaDivisores, 1936, explicaDivisores, (item, idioma) => {
  const ds = divisores(valor(item.a));
  return `${ds.slice(0, -1).join(', ')}${idioma === 'es' ? ' y ' : ' and '}${ds.at(-1)}`;
});
final('mcd', generarMcd, 1937, explicaMcd, (item, idioma) => {
  const g = mcd(valor(item.a), valor(item.b));
  if (g === 1) return idioma === 'es' ? '«Ninguna pareja», y el m.c.d. es 1' : '“No pairs”, and the GCD is 1';
  return fichasDe(g, idioma);
});
final('mcm', generarMcm, 1938, explicaMcm, (item, idioma) => fichasDe(mcm(valor(item.a), valor(item.b)), idioma));

test('fichas-del-parchis: la regla va delante y no se repite (en el m.c.m. salía dos veces)', () => {
  const pares = [[generarLee, explicaLee], [generarConstruye, explicaConstruye], [generarProducto, explicaProducto], [generarQuita, explicaQuita],
    [generarRegla, explicaRegla], [generarTablaDivisores, explicaDivisores], [generarMcd, explicaMcd], [generarMcm, explicaMcm]];
  pares.forEach(([gen, fn], k) => {
    for (const item of generar(gen, 1940 + k).slice(0, 200)) {
      for (const idioma of IDIOMAS) {
        const p = plano(fn(item, textosDe(idioma))).trim();
        const primera = p.split(/(?<=\.) /)[0];
        assert.ok(p.indexOf(primera, primera.length) < 0, `la regla dos veces: ${p}`);
        assert.doesNotMatch(p, /mayor número de fichas.*mayor número de fichas|largest number of counters.*larger number/);
        assert.ok(p.indexOf(FIN[idioma]) > primera.length, 'la regla, antes de la respuesta');
      }
    }
  });
});
