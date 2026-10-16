// Práctica «¿m.c.d. o m.c.m.?»: el banco de enunciados no se comprueba contra
// un m.c.d./m.c.m. real (aquí no se calcula nada), sino por fuerza bruta
// contra reglas independientes: equilibrio de clases, forma del ítem del
// ejercicio 3 y ausencia de tokens prohibidos.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { BANCO, TX } from '../practicas/clasificador/textos.js';
import { generarLimpio, generarTrampa, generarJustificar } from '../practicas/clasificador/logica.js';

const PROHIBIDO = ['×', 'HCF', 'factor of'];

test('el banco tiene 37 plantillas: 25 limpias (12+13) y 12 con trampa (6+6)', () => {
  const limpios = BANCO.filter(p => !p.trampa);
  const trampas = BANCO.filter(p => p.trampa);
  assert.equal(BANCO.length, 37);
  assert.equal(limpios.length, 25);
  assert.equal(trampas.length, 12);
  assert.equal(limpios.filter(p => p.clase === 'mcd').length, 12);
  assert.equal(limpios.filter(p => p.clase === 'mcm').length, 13);
  assert.equal(trampas.filter(p => p.clase === 'mcd').length, 6);
  assert.equal(trampas.filter(p => p.clase === 'mcm').length, 6);
});

test('cada plantilla tiene es, en y razon en los dos idiomas, sin tokens prohibidos', () => {
  const rng = crearRng(777);
  for (const plantilla of BANCO) {
    for (let i = 0; i < 5; i++) {
      const numeros = plantilla.numeros(rng);
      assert.ok(Array.isArray(numeros) && (numeros.length === 2 || numeros.length === 3));
      const textoEs = plantilla.es(...numeros);
      const textoEn = plantilla.en(...numeros);
      const razon = plantilla.razon(...numeros);
      for (const texto of [textoEs, textoEn, razon.es, razon.en]) {
        assert.equal(typeof texto, 'string');
        assert.ok(texto.length > 0);
        for (const t of PROHIBIDO) assert.ok(!texto.includes(t), `«${t}» en: ${texto}`);
      }
      assert.ok(['mcd', 'mcm'].includes(plantilla.clase));
    }
  }
});

test('ejercicio 1 (limpio): las dos clases salen entre el 40 % y el 60 % en 3000 ítems', () => {
  const rng = crearRng(1234);
  let mcd = 0;
  for (let i = 0; i < 3000; i++) if (generarLimpio(rng).clase === 'mcd') mcd++;
  const proporcion = mcd / 3000;
  assert.ok(proporcion >= 0.4 && proporcion <= 0.6, `proporción m.c.d.: ${proporcion}`);
});

test('ejercicio 2 (trampa): las dos clases salen entre el 40 % y el 60 % en 3000 ítems', () => {
  const rng = crearRng(5678);
  let mcd = 0;
  for (let i = 0; i < 3000; i++) if (generarTrampa(rng).clase === 'mcd') mcd++;
  const proporcion = mcd / 3000;
  assert.ok(proporcion >= 0.4 && proporcion <= 0.6, `proporción m.c.d.: ${proporcion}`);
});

test('ejercicios 1 y 2: el ítem referencia una plantilla real de su tipo con sus mismos números', () => {
  const rng = crearRng(99);
  for (let i = 0; i < 500; i++) {
    const item = generarLimpio(rng);
    const plantilla = BANCO[item.plantilla];
    assert.equal(plantilla.trampa, false);
    assert.equal(plantilla.clase, item.clase);
    assert.doesNotThrow(() => plantilla.es(...item.numeros));
  }
  for (let i = 0; i < 500; i++) {
    const item = generarTrampa(rng);
    const plantilla = BANCO[item.plantilla];
    assert.equal(plantilla.trampa, true);
    assert.equal(plantilla.clase, item.clase);
    assert.doesNotThrow(() => plantilla.es(...item.numeros));
  }
});

test('ejercicio 3 (justificar): exactamente una opción es la correcta, y las clases están equilibradas', () => {
  const rng = crearRng(4242);
  let correctasVa = 0;
  const vistos = new Set();
  for (let i = 0; i < 2000; i++) {
    const item = generarJustificar(rng);
    assert.equal(item.opciones.length, 4);
    assert.equal(new Set(item.opciones).size, 4); // sin repetidos
    assert.ok(item.opciones.includes(item.solucion));
    // Regla independiente: la razón correcta es «va» si la clase es m.c.d., «contiene» si es m.c.m.
    // (en m.c.d. con trampa A la razón buena habla del tamaño: «tamano»).
    const correctaEsperada = item.clase === 'mcm' ? 'contiene' : BANCO[item.plantilla].tamano ? 'tamano' : 'va';
    assert.equal(item.solucion, correctaEsperada);
    // Las otras tres opciones, para este ítem, no son la correcta.
    const otras = item.opciones.filter(o => o !== item.solucion);
    assert.equal(otras.length, 3);
    for (const otra of otras) assert.notEqual(otra, correctaEsperada);
    if (item.clase === 'mcd') correctasVa++;
    vistos.add(item.plantilla);
  }
  const proporcion = correctasVa / 2000;
  assert.ok(proporcion >= 0.4 && proporcion <= 0.6, `proporción «va»: ${proporcion}`);
  assert.ok(vistos.size > 20, 'se han usado bastantes plantillas distintas de las 37');
});

// ─── Realismo de los enunciados (regla 9 de proyecto.md) ─────────────────────

function mcdBF(a, b) {
  for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d;
}

function numerosDe(p, rng) {
  const [a, b] = p.numeros(rng);
  return [a, b];
}

test('realismo: metrónomo en 3..30 décimas, corredor 90..200 s y semáforo 30..120 s, todos múltiplos de 10', () => {
  const rng = crearRng(2026);
  const por = frag => BANCO.find(p => p.es(2, 3).startsWith(frag));
  const metro = por('Un metrónomo');
  const corredor = por('Un corredor');
  const semaforo = por('Un semáforo');
  for (let i = 0; i < 400; i++) {
    const [a, b] = numerosDe(metro, rng);
    assert.ok([a, b].every(x => x >= 3 && x <= 30) && a !== b, `${a} ${b}`);
    assert.match(metro.es(a, b), /cuántas décimas de segundo/);
    const [c, d] = numerosDe(corredor, rng);
    assert.ok([c, d].every(x => x >= 90 && x <= 200 && x % 10 === 0) && c !== d, `${c} ${d}`);
    const [e, f] = numerosDe(semaforo, rng);
    assert.ok([e, f].every(x => x >= 30 && x <= 120 && x % 10 === 0) && e !== f, `${e} ${f}`);
  }
});

test('realismo: toda plantilla m.c.d. de dos números da m.c.d. >= 2', () => {
  const rng = crearRng(4040);
  for (const p of BANCO.filter(q => q.clase === 'mcd')) {
    for (let i = 0; i < 300; i++) {
      const [a, b] = numerosDe(p, rng);
      assert.ok(mcdBF(a, b) >= 2, `${a} ${b} en: ${p.es(a, b)}`);
    }
  }
});

test('realismo: ningún enunciado habla de canicas con pulseras, mangueras, cabinas ni «cuántos décimas»', () => {
  const rng = crearRng(5150);
  for (const p of BANCO) {
    for (let i = 0; i < 300; i++) {
      const n = p.numeros(rng);
      for (const texto of [p.es(...n), p.en(...n)]) {
        for (const mal of ['manguera', 'garden hose', 'cabina', 'cabin', 'cuántos décimas', 'cuántos días de segundo']) {
          assert.ok(!texto.includes(mal), `«${mal}» en: ${texto}`);
        }
        assert.ok(!/canicas.*pulseras|marbles.*bracelets/.test(texto), texto);
        assert.ok(!texto.includes('undefined'), texto);
      }
    }
  }
});

test('las opciones de justificación existen en TX.justificacion y no mencionan "factor"', () => {
  const claves = ['va', 'tamano', 'contiene', 'dice_mayor', 'dice_menor', 'datos_pequenos', 'dos_datos'];
  for (const clave of claves) {
    assert.ok(TX.justificacion[clave].es);
    assert.ok(TX.justificacion[clave].en);
    assert.ok(!TX.justificacion[clave].es.includes('factor'));
    assert.ok(!TX.justificacion[clave].en.includes('factor'));
  }
});

test('un «dice mayor/menor» nunca es distractor si el enunciado lleva esa palabra, y `dice` refleja el texto', () => {
  const rng = crearRng(31337);
  for (const p of BANCO) {
    const [a, b, c] = p.numeros(rng);
    for (const texto of [p.es(a, b, c), p.en(a, b, c)]) {
      if (/mayor|más grande|más larg|largest|as long as possible/i.test(texto)) assert.ok(p.dice.includes('mayor'), texto);
      if (/menor|smallest/i.test(texto)) assert.ok(p.dice.includes('menor'), texto);
    }
  }
  for (let i = 0; i < 3000; i++) {
    const item = generarJustificar(rng);
    const dice = BANCO[item.plantilla].dice;
    if (dice.includes('mayor')) assert.ok(!item.opciones.includes('dice_mayor'));
    if (dice.includes('menor')) assert.ok(!item.opciones.includes('dice_menor'));
    // «va» no se ofrece junto a «tamano» (ambigua).
    if (item.solucion === 'tamano') assert.ok(!item.opciones.includes('va'));
  }
});

test('la razón de los paquetes concuerda en género con el sustantivo del enunciado (sobres → todos, el resto → todas)', () => {
  const rng = crearRng(77);
  let sobres = 0, otros = 0;
  for (const p of BANCO.filter(q => !q.trampa && q.clase === 'mcd' && /todas llevan|todos llevan/.test(q.razon(1, 1).es))) {
    const [a, b] = p.numeros(rng);
    const razon = p.razon(a, b).es;
    if (/hacer el mayor número posible de sobres /.test(p.es(a, b))) {
      sobres++;
      assert.match(razon, /^El número de sobres .*\(todos llevan lo mismo/);
    } else {
      otros++;
      assert.match(razon, /\(todas llevan lo mismo/);
    }
  }
  assert.equal(sobres, 1);
  assert.equal(otros, 5);
});

test('las seis plantillas de trampa A piden un tamaño: todas llevan `tamano` y nombran piezas de una sola clase o corte', () => {
  const trampasMcd = BANCO.filter(p => p.trampa && p.clase === 'mcd');
  assert.equal(trampasMcd.length, 6);
  const rng = crearRng(5);
  for (const p of trampasMcd) {
    assert.equal(p.tamano, true);
    const [a, b] = p.numeros(rng);
    assert.ok(/solo de|only|cortar|cut/i.test(p.es(a, b) + p.en(a, b)));
  }
  assert.ok(BANCO.filter(p => !(p.trampa && p.clase === 'mcd')).every(p => !p.tamano));
});
