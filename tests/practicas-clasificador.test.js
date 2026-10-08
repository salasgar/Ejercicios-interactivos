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

test('el banco tiene 36 plantillas: 24 limpias (12+12) y 12 con trampa (6+6)', () => {
  const limpios = BANCO.filter(p => !p.trampa);
  const trampas = BANCO.filter(p => p.trampa);
  assert.equal(BANCO.length, 36);
  assert.equal(limpios.length, 24);
  assert.equal(trampas.length, 12);
  assert.equal(limpios.filter(p => p.clase === 'mcd').length, 12);
  assert.equal(limpios.filter(p => p.clase === 'mcm').length, 12);
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
  assert.ok(vistos.size > 20, 'se han usado bastantes plantillas distintas de las 36');
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
