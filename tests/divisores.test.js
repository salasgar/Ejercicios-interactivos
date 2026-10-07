// Práctica «divisor, múltiplo, divisible» (divisores/): que ninguna opción
// que se da por mala pueda ser buena, el contador 20/+5 y los códigos.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  crearRng, generar, esCorrecta, solucionArrastrar, cumple, RELACIONES, EJERCICIOS,
  ejercicioNuevo, anotar, esRapido, INICIALES, PENALIZACION, PENALIZACION_RAPIDO, MAXIMO, diaDe, fechaDeDia,
  codigoAlumno, leerCodigoAlumno, codigoResultado, leerCodigoResultado, extraerCodigosResultado, MAX_ALUMNOS, ALFABETO,
} from '../divisores/logica.js';
import { juntarResultados } from '../divisores/resultados.js';
import { T, frase, razon, textoOperacion } from '../divisores/textos.js';

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

test('contador: 20 aciertos seguidos terminan; un fallo pensado añade 2', () => {
  let ej = ejercicioNuevo();
  for (let i = 0; i < INICIALES - 1; i++) ej = anotar(ej, true, 7);
  assert.equal(ej.pendientes, 1);
  assert.equal(ej.terminado, false);
  ej = anotar(ej, false, 7);
  assert.equal(ej.pendientes, 1 + PENALIZACION);
  for (let i = 0; i < 1 + PENALIZACION; i++) ej = anotar(ej, true, 9);
  assert.deepEqual(ej, { pendientes: 0, aciertos: INICIALES + PENALIZACION, fallos: 1, rapidos: 0, terminado: true, dia: 9, repeticiones: 0 });
  assert.equal(anotar(ej, false, 10), ej, 'una vez terminado ya no cambia');
});

test('contador: los pendientes nunca pasan de 40', () => {
  assert.equal(MAXIMO, 40);
  let ej = ejercicioNuevo();
  const vistos = [];
  for (let i = 0; i < 8; i++) { ej = anotar(ej, false, 1, true); vistos.push(ej.pendientes); }
  assert.deepEqual(vistos, [25, 30, 35, 40, 40, 40, 40, 40]);
  assert.equal(ej.fallos, 8, 'los fallos se siguen contando');
  ej = anotar(anotar(anotar(ej, true, 1), true, 1), false, 1, true);
  assert.equal(ej.pendientes, 40, 'de 38 sube a 40, no a 43');
  assert.equal(anotar(anotar(ej, true, 1), false, 1).pendientes, 40, 'de 39 con un fallo pensado sube a 40, no a 41');
});

test('contador: fallar deprisa añade 5; fallar pensándolo, 2', () => {
  assert.equal(PENALIZACION, 2);
  assert.equal(PENALIZACION_RAPIDO, 5);
  const pensado = anotar(ejercicioNuevo(), false, 1, false);
  assert.deepEqual([pensado.pendientes, pensado.fallos, pensado.rapidos], [22, 1, 0]);
  const rapido = anotar(ejercicioNuevo(), false, 1, true);
  assert.deepEqual([rapido.pendientes, rapido.fallos, rapido.rapidos], [25, 1, 1]);
  assert.equal(anotar(ejercicioNuevo(), true, 1, true).pendientes, 19, 'acertar deprisa no penaliza');
  assert.ok(esRapido('eleccion', 2999) && !esRapido('eleccion', 3000));
  assert.ok(esRapido('preposicion', 1000) && !esRapido('preposicion', 3500));
  assert.ok(esRapido('arrastrar', 4999) && !esRapido('arrastrar', 5000), 'mover dos fichas lleva más tiempo');
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

test('tabla del profesor: lista, códigos y nube', () => {
  const hecho = { terminado: true, fallos: 2 }, sin = { terminado: false, fallos: 0 };
  const filas = juntarResultados(
    ['Ana', 'Luis', '', 'Eva'],
    [{ indice: 0, ejercicios: [hecho, hecho, sin, sin, sin], dia: 40 }, { indice: 7, ejercicios: [hecho, sin, sin, sin, sin], dia: 41 }],
    [{ indice: 0, ej: EJERCICIOS.map(() => ({ pendientes: 0, aciertos: 20, fallos: 0, terminado: true, dia: 42 })) },
      { indice: 3, ej: [{ pendientes: 12, aciertos: 8, fallos: 0, terminado: false, dia: 0 }] }],
  );
  assert.deepEqual(filas.map(f => [f.indice, f.nombre, f.hechos, f.fuente, f.dia]), [
    [0, 'Ana', 5, 'nube', 42],      // la nube tiene más ejercicios terminados que el código
    [1, 'Luis', 0, '', 0],          // está en la lista y no ha hecho nada
    [3, 'Eva', 0, 'nube', 0],       // va a medias
    [7, '', 1, 'código', 41],       // envió código pero no está en la lista
  ]);
  assert.equal(filas[2].ejercicios[0].pendientes, 12);
});
