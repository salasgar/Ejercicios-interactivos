// «No lo sé» en «Léelo en inglés» (tarea 186): la explicación de cada ejercicio lleva la solución del
// ítem, calculada con la lógica de la práctica, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T, esc } from '../practicas/_comun/textos.js';
import {
  generarEscuchar, opcionesEscuchar, generarLeer, opcionesLeer, generarCompletar, comprobarCompletar,
} from '../practicas/leelo/logica.js';
import { explicaEscuchar, explicaLeer, explicaCompletar, piezas } from '../practicas/leelo/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc });
const plano = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const generar = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const limpio = (h, donde) => {
  assert.doesNotMatch(h, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(h)}`);
  assert.ok(plano(h).length > 40, `${donde}: demasiado corta`);
};

test('leelo, ejercicio 1: la explicación lleva lo que se oye y la notación correcta', () => {
  for (const item of generar(generarEscuchar, 1871)) {
    const { correcta } = opcionesEscuchar(item);
    for (const idioma of IDIOMAS) {
      const h = explicaEscuchar(item, textosDe(idioma));
      limpio(h, `ej1 ${idioma}`);
      assert.ok(h.includes(correcta), `lleva la notación ${correcta}: ${plano(h)}`);
    }
    assert.notEqual(explicaEscuchar(item, textosDe('es')), explicaEscuchar(item, textosDe('en')));
  }
});

test('leelo, ejercicio 2: la explicación lleva la lectura correcta, en el estilo del ítem', () => {
  for (const item of generar(generarLeer, 1872)) {
    const { correcta } = opcionesLeer(item);
    for (const idioma of IDIOMAS) {
      const h = explicaLeer(item, textosDe(idioma));
      limpio(h, `ej2 ${idioma}`);
      assert.ok(h.includes(esc(correcta)), `lleva la lectura «${correcta}»: ${plano(h)}`);
    }
  }
});

test('leelo: las piezas de la explicación componen la lectura entera (en orden)', () => {
  for (const item of [...generar(generarEscuchar, 1873).slice(0, 300), ...generar(generarLeer, 1874).slice(0, 300)]) {
    const palabras = piezas(item, item.estilo).map(([ing]) => ing);
    const leido = opcionesLeer(item).correcta;
    for (const p of palabras) assert.ok(leido.includes(p), `«${p}» no está en «${leido}»`);
  }
});

test('leelo, ejercicio 3: la explicación lleva la frase correcta y la regla de la plantilla', () => {
  const vistas = new Set();
  for (const item of generar(generarCompletar, 1875)) {
    assert.ok(comprobarCompletar(item), 'la frase del ítem es verdadera');
    vistas.add(item.plantilla);
    const frase = item.frase.replace('___', item.solucion);
    for (const idioma of IDIOMAS) {
      const h = explicaCompletar(item, textosDe(idioma));
      limpio(h, `ej3 ${idioma} ${item.plantilla}`);
      assert.ok(h.includes(esc(frase)), `lleva la frase «${frase}»: ${plano(h)}`);
    }
    assert.notEqual(explicaCompletar(item, textosDe('es')), explicaCompletar(item, textosDe('en')));
  }
  assert.equal(vistas.size, 11, 'salen las 11 plantillas');
});

// ─── Revisión de la tarea 193 ─────────────────────────────────────────────────

const FIN = { es: 'La respuesta es', en: 'The answer is' };
const veces = (h, txt) => h.split(txt).length - 1;
/** Pareja -teen/-ty calculada aparte: 13..19 ↔ 30..90 de diez en diez. */
const parejaDe = x => (x >= 13 && x <= 19 ? (x - 10) * 10 : x >= 30 && x <= 90 && x % 10 === 0 ? x / 10 + 10 : null);

test('leelo, ejercicios 1 y 2: la regla delante, la respuesta al final y una vez, sin listas de un solo paso', () => {
  for (const [fn, gen, sem, regla] of [
    [explicaEscuchar, generarEscuchar, 1931, { es: 'Cada trozo se escribe con su símbolo', en: 'Each part is written with its symbol' }],
    [explicaLeer, generarLeer, 1932, { es: 'Cada símbolo se lee con su palabra', en: 'Each symbol is read with its word' }],
  ]) {
    for (const item of generar(gen, sem)) {
      for (const idioma of IDIOMAS) {
        const h = fn(item, textosDe(idioma));
        assert.ok(h.includes(regla[idioma]), `regla: ${plano(h)}`);
        assert.equal(veces(h, FIN[idioma]), 1);
        assert.ok(h.indexOf(regla[idioma]) < h.indexOf(FIN[idioma]), 'la regla va antes de la respuesta');
        assert.doesNotMatch(h, /<ol|respuesta es:|answer is:/);
      }
    }
  }
});

test('leelo: el «·» va entre los factores (donde se dice) y la coma de GCD(a, b) es «and»', () => {
  for (const item of generar(generarLeer, 1933).slice(0, 400)) {
    const lista = piezas(item, item.estilo);
    if (item.clase === 'fact') {
      const i = lista.findIndex(([, s]) => s === '·');
      if (item.f.length > 1) assert.equal(i, 3, 'el «·» va detrás del primer factor');
      else assert.equal(i, -1);
    } else {
      assert.deepEqual(lista[2], ['and', ',']);
    }
    // Las piezas, en su orden, recorren la lectura entera.
    const leido = opcionesLeer(item).correcta;
    let desde = 0;
    for (const [ing] of lista) {
      const j = leido.indexOf(ing, desde);
      assert.ok(j >= 0, `«${ing}» en orden dentro de «${leido}»`);
      desde = j + ing.length;
    }
  }
});

test('leelo: el consejo «-teen»/«-ty» sale solo si un número del ítem tiene pareja, y con esa pareja', () => {
  let con = 0, sin = 0;
  for (const item of [...generar(generarEscuchar, 1934), ...generar(generarLeer, 1935)]) {
    const x = [item.n, item.a, item.b, item.valor].find(v => v !== undefined && parejaDe(v) !== null);
    for (const idioma of IDIOMAS) {
      const h = (item.estilo ? explicaLeer : explicaEscuchar)(item, textosDe(idioma));
      const consejo = /Consejo:|Tip:/.test(h);
      assert.equal(consejo, x !== undefined, `consejo con ${x}: ${plano(h)}`);
      if (x !== undefined) {
        const [teen, ty] = x < 20 ? [x, parejaDe(x)] : [parejaDe(x), x];
        const verbo = idioma === 'es' ? 'es' : 'is';
        assert.ok(h.includes(` ${verbo} ${teen} `) && h.includes(` ${verbo} ${ty}.`), `pareja de ${x}: ${plano(h)}`);
        con++;
      } else sin++;
    }
  }
  assert.ok(con > 100 && sin > 100, 'salen ítems con consejo y sin él');
  // El 20 no tiene pareja -teen: sin consejo.
  const h = explicaEscuchar({ clase: 'gcd', a: 20, b: 7, valor: 1 }, textosDe('es'));
  assert.doesNotMatch(h, /Consejo/);
});

test('leelo, ejercicio 3: la palabra elegida, en la respuesta final, sin «La frase correcta es:»; y el 0 es múltiplo de todos', () => {
  for (const item of generar(generarCompletar, 1936)) {
    for (const idioma of IDIOMAS) {
      const h = explicaCompletar(item, textosDe(idioma));
      const palabra = idioma === 'es' ? `«${esc(item.solucion)}»` : `“${esc(item.solucion)}”`;
      assert.ok(h.includes(`${FIN[idioma]} <strong>${palabra}</strong>: `), plano(h));
      assert.equal(veces(h, FIN[idioma]), 1);
      assert.doesNotMatch(h, /<ol|frase correcta es:|correct sentence is:/);
      if (item.plantilla === 'zero_multiple') {
        assert.match(h, idioma === 'es' ? /el 0 es múltiplo de todos los números/ : /0 is a multiple of every number/);
        assert.doesNotMatch(h, /sale al multiplicarlo|by multiplying\./);
      }
    }
  }
});
