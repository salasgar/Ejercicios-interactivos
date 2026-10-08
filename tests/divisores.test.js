// Práctica «divisor, múltiplo, divisible» (divisores/): que ninguna opción
// que se da por mala pueda ser buena, las fechas y los códigos (el contador
// es el de la base común: tests/practicas-comun.test.js).

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  crearRng, generar, esCorrecta, solucionArrastrar, cumple, RELACIONES, EJERCICIOS, EJERCICIOS_ACTUALES,
  generarBichos, bichosSegun, fraseAzar, claveDe, TONOS,
  diaDe, fechaDeDia,
  codigoAlumno, leerCodigoAlumno, codigoResultado, leerCodigoResultado, extraerCodigosResultado, MAX_ALUMNOS, ALFABETO,
} from '../divisores/logica.js';
import { T, frase, razon, razonFalsa, fraseRazonada, textoOperacion } from '../divisores/textos.js';

const TIRADAS = 3000;

// Definiciones independientes de las del código, por fuerza bruta.
const existeK = (pequeno, grande) => { for (let k = 0; k <= 1000; k++) if (pequeno * k === grande) return true; return false; };
const verdad = {
  divisor: (x, y) => x !== 0 && existeK(x, y),      // y = x · k
  multiplo: (x, y) => y !== 0 && existeK(y, x),     // x = y · k
  divisible: (x, y) => y !== 0 && existeK(y, x),    // x : y exacta
};

function cadaItem(ejercicio, fn) {
  const rng = crearRng(1000 + ejercicio);
  for (let i = 0; i < TIRADAS; i++) fn(generar(ejercicio, rng));
}

test('la operación que se enseña es cierta', () => {
  for (const n of EJERCICIOS) {
    cadaItem(n, ({ op }) => {
      if (op.clase === 'producto') assert.equal(op.a * op.b, op.c);
      else { assert.notEqual(op.b, 0); assert.equal(op.b * op.c, op.a); }
    });
  }
});

test('ejercicios 1, 2 y 3: las opciones buenas son verdad y las malas son falsas', () => {
  for (const n of [1, 2, 3]) {
    cadaItem(n, item => {
      assert.ok(item.correctas.length >= 1, 'hay al menos una opción buena');
      for (const r of RELACIONES) {
        assert.equal(item.correctas.includes(r), verdad[r](item.x, item.y), `${item.x} es ${r} de ${item.y}`);
        assert.equal(esCorrecta(item, r), verdad[r](item.x, item.y));
      }
      assert.notEqual(item.y, 0, 'nunca «… de 0» ni «… entre 0»');
    });
  }
});

test('ejercicios 1 a 3: no gana quien pulsa siempre lo mismo', () => {
  for (const n of [1, 2, 3]) {
    const veces = { divisor: 0, multiplo: 0, divisible: 0 };
    cadaItem(n, item => item.correctas.forEach(r => veces[r]++));
    for (const r of RELACIONES) assert.ok(veces[r] < 0.7 * TIRADAS, `«${r}» acierta ${veces[r]} de ${TIRADAS}`);
  }
});

test('ejercicio 0: la frase es verdad, la preposición es la suya y salen las dos por igual', () => {
  let entre = 0;
  cadaItem(0, item => {
    assert.ok(verdad[item.relacion](item.x, item.y), `${item.x} ${item.relacion} ${item.y}`);
    assert.equal(item.correcta, item.relacion === 'divisible' ? 'entre' : 'de');
    assert.ok(esCorrecta(item, item.correcta));
    assert.ok(!esCorrecta(item, item.correcta === 'de' ? 'entre' : 'de'));
    if (item.correcta === 'entre') entre++;
  });
  assert.ok(entre > 0.4 * TIRADAS && entre < 0.6 * TIRADAS, `«entre» sale ${entre} de ${TIRADAS}`);
});

test('ejercicio 4: sin ceros, con solución, y solo se acepta lo que es verdad', () => {
  cadaItem(4, item => {
    assert.ok(!item.numeros.includes(0));
    assert.equal(item.numeros.length, 3);
    const sol = solucionArrastrar(item);
    assert.ok(sol && verdad[item.relacion](...sol));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === j) continue;
        const par = [item.numeros[i], item.numeros[j]];
        assert.equal(esCorrecta(item, par), verdad[item.relacion](...par), `${par[0]} ${item.relacion} ${par[1]}`);
      }
    }
  });
});

test('salen los casos especiales: factor 1, factor 0 y un número consigo mismo', () => {
  const vistos = { uno: false, cero: false, iguales: false };
  cadaItem(3, item => {
    if (item.op.a === 1 || item.op.b === 1) vistos.uno = true;
    if (item.x === 0) vistos.cero = true;
    if (item.x === item.y) { vistos.iguales = true; assert.equal(item.correctas.length, 3); }
  });
  assert.deepEqual(vistos, { uno: true, cero: true, iguales: true });
});

test('hay variedad', () => {
  for (const n of EJERCICIOS) {
    const claves = new Set();
    cadaItem(n, item => claves.add(JSON.stringify(item)));
    assert.ok(claves.size > 300, `ejercicio ${n}: ${claves.size} distintos`);
  }
});

test('las frases y las cuentas del feedback', () => {
  assert.equal(frase('divisor', 5, 60, 'es'), '5 es divisor de 60');
  assert.equal(frase('divisible', 60, 5, 'es'), '60 es divisible entre 5');
  assert.equal(frase('multiplo', 60, 5, 'en'), '60 is a multiple of 5');
  assert.equal(frase('divisible', 60, 5, 'en'), '60 is divisible by 5');
  assert.equal(razon('multiplo', 60, 5, 'es'), '60 = 5 · 12');
  assert.equal(razon('multiplo', 0, 14, 'es'), '0 = 14 · 0');
  assert.equal(razon('divisor', 5, 60, 'en'), '60 : 5 = 12, remainder 0');
  assert.equal(textoOperacion({ clase: 'division', a: 75, b: 3, c: 25 }, 'es'), '75 : 3 = 25, resto = 0');
  assert.deepEqual(Object.keys(T.es).sort(), Object.keys(T.en).sort(), 'los dos idiomas tienen los mismos textos');
});

// --- Ejercicio 5: ¿quién miente? (los bichos) --------------------------------------

/** Verdad de una frase del bicho, con la definición independiente de arriba. */
const esVerdad = f => verdad[f.relacion](f.x, f.y);

function cadaRonda(fn, puntos = 0) {
  const rng = crearRng(2026 + puntos);
  for (let i = 0; i < TIRADAS; i++) fn(generarBichos(rng, { puntos }));
}

test('bichos: hay exactamente un objetivo y es el único que cumple la consigna', () => {
  assert.deepEqual(EJERCICIOS_ACTUALES, [...EJERCICIOS, 5]);
  for (const puntos of [0, 5, 9]) {
    cadaRonda(item => {
      assert.equal(item.tipo, 'bichos');
      assert.equal(item.frases.length, bichosSegun(puntos));
      const buscada = item.modo === 'verdad';
      const candidatos = item.frases.map((f, i) => (esVerdad(f) === buscada ? i : -1)).filter(i => i >= 0);
      assert.deepEqual(candidatos, [item.objetivo], `${item.modo}: ${item.frases.map(f => `${f.x} ${f.relacion} ${f.y}`).join(' / ')}`);
      for (let i = 0; i < item.frases.length; i++) assert.equal(esCorrecta(item, i), i === item.objetivo);
      for (const f of item.frases) {
        assert.equal(f.verdadera, esVerdad(f), 'lo que el ítem dice que es verdad, lo es');
        assert.ok(f.relacion === 'divisor' || f.y !== 0, 'nunca «múltiplo de 0» ni «divisible entre 0»');
        assert.ok(Number.isInteger(f.x) && Number.isInteger(f.y) && f.x >= 0 && f.y >= 0 && f.x <= 300 && f.y <= 300);
      }
      assert.equal(new Set(item.frases.map(f => `${f.x} ${f.relacion} ${f.y}`)).size, item.frases.length, 'sin frases repetidas');
      assert.equal(item.tonos.length, item.frases.length);
      assert.equal(new Set(item.tonos).size, item.tonos.length, 'cada bicho de un color');
      for (const t of item.tonos) assert.ok(TONOS.includes(t));
    }, puntos);
  }
});

test('bichos: el número de bichos crece con los puntos (2, 3, 4) y los dos modos salen por igual', () => {
  assert.deepEqual([0, 3, 4, 6, 7, 9].map(bichosSegun), [2, 2, 3, 3, 4, 4]);
  assert.equal(generarBichos(crearRng(1)).frases.length, 2, 'sin sesión, como al empezar');
  let verdad = 0;
  cadaRonda(item => { if (item.modo === 'verdad') verdad++; });
  assert.ok(verdad > 0.4 * TIRADAS && verdad < 0.6 * TIRADAS, `modo verdad ${verdad} de ${TIRADAS}`);
  const posiciones = [0, 0, 0, 0];
  cadaRonda(item => posiciones[item.objetivo]++, 9);
  for (const p of posiciones) assert.ok(p > 0.15 * TIRADAS, `el objetivo no está siempre en el mismo sitio: ${posiciones}`);
});

test('bichos: salen las trampas en los dos sentidos', () => {
  const vistas = { unoDivisor: false, mismo: false, ceroMultiplo: false, alReves: false, ceroDivisor: false, sieteDivisorDeUno: false, restoNoCero: false };
  const rng = crearRng(77);
  for (let i = 0; i < TIRADAS; i++) {
    for (const verdadera of [true, false]) {
      const f = fraseAzar(rng, verdadera);
      if (f.relacion !== 'divisor' && f.y === 0) continue;
      if (verdadera) {
        if (f.relacion === 'divisor' && f.x === 1) vistas.unoDivisor = true;
        if (f.x === f.y) vistas.mismo = true;
        if (f.x === 0 && f.relacion !== 'divisor') vistas.ceroMultiplo = true;
      } else {
        if (f.relacion === 'divisor' && f.x > f.y && f.y > 1 && f.x % f.y === 0) vistas.alReves = true;
        if (f.relacion !== 'divisor' && f.y > f.x && f.x > 1 && f.y % f.x === 0) vistas.alReves = true;
        if (f.relacion === 'divisor' && f.x === 0) vistas.ceroDivisor = true;
        if (f.relacion === 'divisor' && f.y === 1 && f.x > 1) vistas.sieteDivisorDeUno = true;
        if (f.relacion === 'divisor' ? (f.x > 1 && f.y % f.x !== 0) : (f.y > 1 && f.x % f.y !== 0)) vistas.restoNoCero = true;
      }
    }
  }
  assert.deepEqual(vistas, { unoDivisor: true, mismo: true, ceroMultiplo: true, alReves: true, ceroDivisor: true, sieteDivisorDeUno: true, restoNoCero: true });
});

test('bichos: las cuentas del feedback son verdad, en los dos idiomas', () => {
  assert.equal(razonFalsa('divisor', 60, 5, 'es'), '5 : 60 = 0, resto 5');
  assert.equal(razonFalsa('multiplo', 61, 5, 'en'), '61 : 5 = 12, remainder 1');
  assert.equal(razonFalsa('divisible', 1, 7, 'es'), '1 : 7 = 0, resto 1');
  assert.match(razonFalsa('divisor', 0, 8, 'es'), /0 no es divisor de ningún número/);
  assert.match(fraseRazonada({ x: 1, relacion: 'divisor', y: 7, verdadera: true }, 'es'), /^1 es divisor de 7: <span class="cuenta">7 : 1 = 7, resto 0<\/span>$/);
  assert.match(fraseRazonada({ x: 16, relacion: 'divisor', y: 2, verdadera: false }, 'en'), /^16 is not a divisor of 2: <span class="cuenta">2 : 16 = 0, remainder 2<\/span>$/);
  // Por fuerza bruta: la división que se enseña como no exacta no lo es, y los cocientes y restos son los de verdad.
  const rng = crearRng(3);
  for (let i = 0; i < TIRADAS; i++) {
    const f = fraseAzar(rng, false);
    if (f.relacion !== 'divisor' && f.y === 0) continue;
    if (esVerdad(f)) continue;
    const [D, d] = f.relacion === 'divisor' ? [f.y, f.x] : [f.x, f.y];
    if (d === 0) continue;
    const m = razonFalsa(f.relacion, f.x, f.y, 'es').match(/^(\d+) : (\d+) = (\d+), resto (\d+)$/);
    assert.ok(m, razonFalsa(f.relacion, f.x, f.y, 'es'));
    const [, DD, dd, q, r] = m.map(Number);
    assert.deepEqual([DD, dd], [D, d]);
    assert.ok(r > 0 && r < d && q * d + r === D);
  }
  assert.deepEqual(Object.keys(T.es.bichos).sort(), Object.keys(T.en.bichos).sort());
  assert.equal(T.es.ejercicios.length, 6);
  assert.equal(T.en.ejercicios.length, 6);
});

test('bichos: la clave distingue rondas distintas y generar(5) pasa la sesión', () => {
  const rng = crearRng(5);
  const claves = new Set();
  for (let i = 0; i < 500; i++) claves.add(claveDe(generar(5, rng, { puntos: 8 })));
  assert.ok(claves.size > 480, `${claves.size} rondas distintas de 500`);
  assert.equal(generar(5, crearRng(8), { puntos: 8 }).frases.length, 4);
});

test('fechas', () => {
  assert.equal(diaDe(new Date(2026, 8, 1)), 0);
  assert.equal(fechaDeDia(diaDe(new Date(2026, 9, 7, 23, 30))), '7/10/2026');
  assert.equal(fechaDeDia(diaDe(new Date(2027, 5, 20, 0, 5))), '20/6/2027');
});

test('códigos de alumno: distintos, de ida y vuelta, y casi ninguno inventado vale', () => {
  const todos = new Set();
  for (let i = 0; i < MAX_ALUMNOS; i++) {
    const c = codigoAlumno(i);
    assert.match(c, /^[A-HJ-NP-Z2-9]{4}$/);
    assert.equal(leerCodigoAlumno(c), i);
    assert.equal(leerCodigoAlumno(` ${c.toLowerCase()} `), i, 'da igual en minúsculas o con espacios');
    todos.add(c);
  }
  assert.equal(todos.size, MAX_ALUMNOS);
  const rng = crearRng(5);
  let validos = 0;
  for (let i = 0; i < 20000; i++) {
    if (leerCodigoAlumno(Array.from({ length: 4 }, () => rng.elegir([...ALFABETO])).join('')) !== null) validos++;
  }
  assert.ok(validos < 60, `${validos} códigos al azar válidos de 20000 (se espera 1 de cada 1024)`);
  for (const malo of ['', 'ABC', 'ABCDE', 'AB1D', 'ABOD', null]) assert.equal(leerCodigoAlumno(malo ?? ''), null);
});

test('código de resultado: de ida y vuelta, y un carácter cambiado lo invalida', () => {
  const rng = crearRng(9);
  let colados = 0, probados = 0;
  for (let i = 0; i < 400; i++) {
    const indice = rng.entero(0, MAX_ALUMNOS - 1);
    const ejercicios = EJERCICIOS.map(() => ({ terminado: rng.azar() < 0.6, fallos: rng.entero(0, 15) }));
    const dia = rng.entero(0, 1023);
    const codigo = codigoResultado(indice, ejercicios, dia);
    assert.match(codigo, /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
    assert.deepEqual(leerCodigoResultado(codigo), { indice, ejercicios, dia });
    assert.deepEqual(leerCodigoResultado(codigo.toLowerCase().replaceAll('-', ' ')), { indice, ejercicios, dia });
    assert.deepEqual(extraerCodigosResultado(`Hola profe, mi código es ${codigo.toLowerCase()}. Gracias`), [codigo]);
    const pos = rng.elegir([0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]);
    const otro = rng.elegir([...ALFABETO].filter(c => c !== codigo[pos]));
    probados++;
    if (leerCodigoResultado(codigo.slice(0, pos) + otro + codigo.slice(pos + 1)) !== null) colados++;
  }
  assert.ok(colados <= 2, `${colados} de ${probados} códigos alterados pasan por buenos`);
  assert.equal(leerCodigoResultado('ABCD-EFGH'), null);
});

test('los fallos se guardan en el código hasta 15', () => {
  const ejercicios = EJERCICIOS.map(() => ({ terminado: true, fallos: 40 }));
  assert.deepEqual(leerCodigoResultado(codigoResultado(3, ejercicios, 40)).ejercicios[0], { terminado: true, fallos: 15 });
});

// La tabla del profesor (juntar lista, códigos y nube) ya no vive en
// `divisores/`: la tarea 17 la sustituyó por el panel único de
// `practicas/profesor.js`, que usa `practicas/resultados.js` y se prueba en
// `tests/practicas-comun.test.js` («panel: …», con la colección `divisores`
// incluida).
