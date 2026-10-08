// Base común de las prácticas de la unidad 2 (practicas/_comun/), panel del
// profesor (practicas/resultados.js) y práctica de plantilla: códigos,
// contador, aritmética por fuerza bruta y el contrato de la base.

import test from 'node:test';
import assert from 'node:assert/strict';
import * as divisores from '../divisores/logica.js';
import { CATALOGO, ID_PLANTILLA, MAX_EJERCICIOS, practicaPorSlug, practicaPorId } from '../practicas/_comun/catalogo.js';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  ALFABETO, MAX_ALUMNOS, codigoAlumno, leerCodigoAlumno, codigoResultado, leerCodigoResultado, extraerCodigosResultado,
} from '../practicas/_comun/codigos.js';
import { ejercicioNuevo, anotar, queHaPasado, migrarProgreso, diaDe, fechaDeDia, OBJETIVO, PENALIZACION, VIDAS, RACHA, EXTRA } from '../practicas/_comun/contador.js';
import {
  validarPractica, parametrosDe, claveProgreso, documentoNube, claveIdiomaFijo,
  modoIdioma, crearSecuenciaIdiomas,
} from '../practicas/_comun/base.js';
import {
  PRIMOS, esPrimo, factorizar, valorDe, divisores as divisoresDe, parejasDivisores, raizEntera, mcd, mcm, sumaCifras, cifras,
  criterio, CRITERIOS, multiplicarFact, dividirFact, esMultiploFact, mcdFact, mcmFact, htmlFact, textoFact,
} from '../practicas/_comun/aritmetica.js';
import { T, TRADUCCION, unir, esc } from '../practicas/_comun/textos.js';
import { juntarResultados, juntarResumen, leerDocumentos } from '../practicas/resultados.js';
import {
  generarPrimo, clasePrimo, primosAProbar, generarFactorizacion, esFactorizacionDe, factDe, BASES, EXPONENTE_MAXIMO, NUMEROS,
} from '../practicas/plantilla/logica.js';
import { TX } from '../practicas/plantilla/textos.js';

const LIMITE = 500;

// Definiciones independientes de las del código, por fuerza bruta.
const divideA = (d, n) => { for (let k = 0; k <= n; k++) if (d * k === n) return true; return false; };
const divisoresBrutos = n => Array.from({ length: n }, (_, i) => i + 1).filter(d => divideA(d, n));
const primoBruto = n => n >= 2 && divisoresBrutos(n).length === 2;

// --- Catálogo ---------------------------------------------------------------------

test('catálogo: los ids y los slugs fijados por el reparto, sin repetir', () => {
  assert.deepEqual(CATALOGO.map(p => [p.id, p.slug, p.nEjercicios]), [
    [0, 'divisores', 6], [1, 'semaforo', 4], [2, 'rectangulos', 3], [3, 'recta', 3], [4, 'criba', 3], [5, 'arbol', 3],
    [6, 'divisiones', 3], [7, 'fabrica', 3], [8, 'venn', 4], [9, 'imposibles', 3], [10, 'clasificador', 3], [11, 'reloj', 3],
    [12, 'baldosas', 3], [13, 'errores', 3], [14, 'leelo', 3], [15, 'factorizaciones', 3], [16, 'parentesis', 4],
    [17, 'jerarquia', 4], [18, 'exponente', 3], [19, 'raiz', 3], [20, 'division', 4], [21, 'expresion', 3], [22, 'redondeo', 3],
    [23, 'constructor', 3], [24, 'distributiva', 3], [25, 'potencias10', 3], [26, 'dictado', 3], [27, 'mental', 3],
    [28, 'especiales', 2], [29, 'errores1', 3], [30, 'propiedades', 3], [31, 'plantilla', 2],
  ]);
  for (const p of CATALOGO) {
    assert.ok(p.id >= 0 && p.id < 32, 'el id cabe en 5 bits');
    assert.ok(p.nEjercicios >= 1 && p.nEjercicios <= MAX_EJERCICIOS);
    assert.ok(p.nombre.es && p.nombre.en && p.ruta.endsWith('/'));
    assert.match(p.slug, /^[a-z0-9-]+$/, 'el slug vale para el id del documento de Firestore');
    assert.equal(practicaPorSlug(p.slug), p);
    assert.equal(practicaPorId(p.id), p);
  }
  assert.equal(practicaPorSlug('no-existe'), null);
  assert.equal(practicaPorId(32), null);
  assert.equal(ID_PLANTILLA, 31);
});

// --- Azar -------------------------------------------------------------------------

test('rng: da exactamente lo mismo que el de divisores/', () => {
  const a = crearRng(123), b = divisores.crearRng(123);
  for (let i = 0; i < 200; i++) assert.equal(a.azar(), b.azar());
  assert.deepEqual(crearRng(7).barajar([1, 2, 3, 4, 5, 6]), divisores.crearRng(7).barajar([1, 2, 3, 4, 5, 6]));
  assert.equal(crearRng(9).entero(1, 1000), divisores.crearRng(9).entero(1, 1000));
});

// --- Códigos ----------------------------------------------------------------------

test('códigos de alumno: los mismos que en divisores/ para los 1024', () => {
  assert.equal(ALFABETO, divisores.ALFABETO);
  assert.equal(MAX_ALUMNOS, divisores.MAX_ALUMNOS);
  for (let i = 0; i < MAX_ALUMNOS; i++) {
    const c = codigoAlumno(i);
    assert.equal(c, divisores.codigoAlumno(i));
    assert.equal(leerCodigoAlumno(c), i);
    assert.equal(leerCodigoAlumno(` ${c.toLowerCase()} `), i, 'da igual en minúsculas o con espacios');
  }
  for (const malo of ['', 'ABC', 'ABCDE', 'AB1D', 'ABOD']) assert.equal(leerCodigoAlumno(malo), null);
});

test('códigos de alumno: los inventados se leen igual que en divisores/', () => {
  const rng = crearRng(5);
  for (let i = 0; i < 5000; i++) {
    const texto = Array.from({ length: 4 }, () => rng.elegir([...ALFABETO])).join('');
    assert.equal(leerCodigoAlumno(texto), divisores.leerCodigoAlumno(texto));
  }
});

test('código de resultado: ida y vuelta en todas las prácticas, con los extremos', () => {
  for (const p of CATALOGO) {
    for (const indice of [0, 1, 500, 1023]) {
      for (const fallos of [0, 15]) {
        for (const dia of [0, 1023]) {
          const ejercicios = Array.from({ length: p.nEjercicios }, (_, n) => ({ terminado: n % 2 === 0, fallos }));
          const codigo = codigoResultado(p.id, indice, ejercicios, dia);
          assert.match(codigo, /^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){3}$/);
          assert.deepEqual(leerCodigoResultado(codigo), { practica: p.id, indice, ejercicios, dia });
          assert.deepEqual(leerCodigoResultado(codigo.toLowerCase().replaceAll('-', ' ')), { practica: p.id, indice, ejercicios, dia });
        }
      }
    }
  }
});

test('código de resultado: ida y vuelta al azar, y todos distintos', () => {
  const rng = crearRng(11);
  const vistos = new Map();
  for (let i = 0; i < 2000; i++) {
    const p = rng.elegir(CATALOGO);
    const dato = {
      practica: p.id,
      indice: rng.entero(0, MAX_ALUMNOS - 1),
      ejercicios: Array.from({ length: p.nEjercicios }, () => ({ terminado: rng.azar() < 0.6, fallos: rng.entero(0, 15) })),
      dia: rng.entero(0, 1023),
    };
    const codigo = codigoResultado(dato.practica, dato.indice, dato.ejercicios, dato.dia);
    assert.deepEqual(leerCodigoResultado(codigo), dato);
    const clave = JSON.stringify(dato);
    if (vistos.has(codigo)) assert.equal(vistos.get(codigo), clave, 'dos resultados distintos no dan el mismo código');
    vistos.set(codigo, clave);
  }
});

test('código de resultado: los fallos se guardan hasta 15 y sobran los ejercicios de más', () => {
  const muchos = Array.from({ length: 9 }, () => ({ terminado: true, fallos: 40 }));
  const leido = leerCodigoResultado(codigoResultado(1, 3, muchos, 40));
  assert.equal(leido.ejercicios.length, 4, 'la práctica 1 tiene 4 ejercicios');
  assert.deepEqual(leido.ejercicios[0], { terminado: true, fallos: 15 });
  // Con menos ejercicios de los que tiene la práctica, los que faltan van sin hacer.
  assert.deepEqual(leerCodigoResultado(codigoResultado(1, 3, [{ terminado: true, fallos: 2 }], 40)).ejercicios,
    [{ terminado: true, fallos: 2 }, { terminado: false, fallos: 0 }, { terminado: false, fallos: 0 }, { terminado: false, fallos: 0 }]);
});

test('código de resultado: un carácter cambiado lo invalida', () => {
  const rng = crearRng(9);
  let colados = 0;
  const PROBADOS = 3000;
  for (let i = 0; i < PROBADOS; i++) {
    const p = rng.elegir(CATALOGO);
    const ejercicios = Array.from({ length: p.nEjercicios }, () => ({ terminado: rng.azar() < 0.6, fallos: rng.entero(0, 15) }));
    const codigo = codigoResultado(p.id, rng.entero(0, MAX_ALUMNOS - 1), ejercicios, rng.entero(0, 1023));
    const pos = rng.elegir([...codigo].map((c, j) => (c === '-' ? -1 : j)).filter(j => j >= 0));
    const otro = rng.elegir([...ALFABETO].filter(c => c !== codigo[pos]));
    if (leerCodigoResultado(codigo.slice(0, pos) + otro + codigo.slice(pos + 1)) !== null) colados++;
  }
  assert.equal(colados, 0, `${colados} de ${PROBADOS} códigos alterados pasan por buenos`);
});

test('código de resultado: no vale el de otro alumno, ni uno al azar, ni de una práctica que no existe', () => {
  const rng = crearRng(21);
  let validos = 0;
  for (let i = 0; i < 20000; i++) {
    if (leerCodigoResultado(Array.from({ length: 16 }, () => rng.elegir([...ALFABETO])).join('')) !== null) validos++;
  }
  assert.equal(validos, 0, `${validos} códigos al azar válidos de 20000 (se espera 1 de cada 33 millones)`);
  const ej = [{ terminado: true, fallos: 0 }, { terminado: true, fallos: 0 }];
  assert.notEqual(codigoResultado(31, 4, ej, 30), codigoResultado(31, 5, ej, 30), 'el código dice de quién es');
  assert.notEqual(codigoResultado(31, 4, ej, 30), codigoResultado(2, 4, ej, 30), 'y de qué práctica');
  for (const malo of ['', 'ABCD-EFGH', 'ABCD-EFGH-JKLM-NPQ', 'ABCD-EFGH-JKLM-NPQR-STUV', 'ABCD-EFGH-JKLM-NPQ1']) assert.equal(leerCodigoResultado(malo), null);
});

test('código de resultado: el de 12 caracteres de divisores/ se lee como práctica 0', () => {
  const ejercicios = divisores.EJERCICIOS.map(n => ({ terminado: n < 3, fallos: n }));
  const viejo = divisores.codigoResultado(17, ejercicios, 36);
  // El código antiguo solo trae los cinco ejercicios de entonces (el 6, los bichos, llegó después).
  assert.deepEqual(leerCodigoResultado(viejo), { practica: 0, indice: 17, ejercicios, dia: 36 });
  // Sobre la base, divisores/ da códigos de 16 con la misma práctica 0 y sus 6 ejercicios.
  const seis = [...ejercicios, { terminado: false, fallos: 0 }];
  assert.deepEqual(leerCodigoResultado(codigoResultado(0, 17, seis, 36)), { practica: 0, indice: 17, ejercicios: seis, dia: 36 });
  assert.deepEqual(leerCodigoResultado(codigoResultado(0, 17, ejercicios, 36)).ejercicios, seis, 'con cinco declarados, el sexto sale sin hacer');
  assert.equal(leerCodigoResultado('ABCD-EFGH-JKLM'), null);
});

test('extraerCodigosResultado: encuentra los de 12 y los de 16 en un texto cualquiera', () => {
  const ej = [{ terminado: true, fallos: 1 }, { terminado: false, fallos: 0 }];
  const de16 = codigoResultado(31, 0, ej, 36);
  const otro16 = codigoResultado(4, 9, [{ terminado: true, fallos: 0 }], 37);
  const de12 = divisores.codigoResultado(3, divisores.EJERCICIOS.map(() => ({ terminado: true, fallos: 0 })), 36);
  const texto = `Hola profe, soy Ana. Mi código es ${de16.toLowerCase()}. Gracias.
    El de divisores: ${de12}
    Luis: ${otro16.replaceAll('-', ' ')}   (y otra vez ${de16})
    Sin guiones: ${de16.replaceAll('-', '')}`;
  assert.deepEqual(extraerCodigosResultado(texto), [de16, de12, otro16]);
  assert.deepEqual(extraerCodigosResultado('nada que ver, 123456'), []);
  // Uno de 12 pegado a una palabra de cuatro letras no se toma por uno de 16.
  assert.deepEqual(extraerCodigosResultado(`${de12} para`), [de12]);
  assert.deepEqual(extraerCodigosResultado(`casa ${de12}`), [de12]);
  // Los que tienen la forma pero no son válidos salen también, para avisar.
  assert.deepEqual(extraerCodigosResultado('ABCD-EFGH-JKLM-NPQR'), ['ABCD-EFGH-JKLM-NPQR']);
  assert.equal(leerCodigoResultado('ABCD-EFGH-JKLM-NPQR'), null);
});

// --- Contador ---------------------------------------------------------------------

test('contador: por defecto 10 puntos, −1 por fallo, 5 vidas y 5 seguidos dan 1 extra', () => {
  assert.deepEqual([OBJETIVO, PENALIZACION, VIDAS, RACHA, EXTRA], [10, 1, 5, 5, 1]);
  assert.deepEqual(ejercicioNuevo(), { puntos: 0, objetivo: 10, vidas: 5, racha: 0, aciertos: 0, fallos: 0, rapidos: 0, reinicios: 0, terminado: false, dia: 0, repeticiones: 0 });
  let ej = ejercicioNuevo();
  const vistos = [];
  for (let i = 0; i < 9; i++) { ej = anotar(ej, true, 7); vistos.push(ej.puntos); }
  assert.deepEqual(vistos, [1, 2, 3, 4, 6, 7, 8, 9, 10], 'el quinto seguido vale doble');
  assert.deepEqual([ej.terminado, ej.dia, ej.aciertos, ej.racha], [true, 7, 9, 9]);
  assert.equal(anotar(ej, false, 10), ej, 'una vez terminado ya no cambia');
  // Sin racha: 10 aciertos justos; el fallo quita 1 punto y 1 vida y corta la racha.
  let b = ejercicioNuevo();
  for (let i = 0; i < 4; i++) b = anotar(b, true, 1);
  b = anotar(b, false, 1);
  assert.deepEqual([b.puntos, b.vidas, b.racha, b.aciertos, b.fallos], [3, 4, 0, 4, 1]);
  for (let i = 0; i < 4; i++) b = anotar(b, true, 1);
  assert.deepEqual([b.puntos, b.racha, b.terminado], [7, 4, false], 'la racha empieza de nuevo tras el fallo');
  b = anotar(b, true, 2);
  assert.deepEqual([b.puntos, b.terminado], [9, false]);
  b = anotar(b, true, 3);
  assert.deepEqual([b.puntos, b.terminado, b.dia], [10, true, 3]);
  // Los puntos nunca pasan del objetivo ni bajan de 0.
  let c = ejercicioNuevo(5);
  for (let i = 0; i < 5; i++) c = anotar(c, true, 1);
  assert.deepEqual([c.puntos, c.terminado], [5, true], 'el extra del quinto no pasa del objetivo');
  assert.deepEqual([anotar(ejercicioNuevo(), false, 1).puntos, anotar(ejercicioNuevo(), false, 1).fallos], [0, 1]);
});

test('contador: sin vidas, el ejercicio vuelve a empezar y los fallos se conservan', () => {
  let ej = ejercicioNuevo();
  for (let i = 0; i < 3; i++) ej = anotar(ej, true, 1);
  const vidas = [];
  for (let i = 0; i < 4; i++) { ej = anotar(ej, false, 1); vidas.push(ej.vidas); }
  assert.deepEqual(vidas, [4, 3, 2, 1]);
  assert.deepEqual([ej.puntos, ej.aciertos, ej.fallos, ej.reinicios], [0, 3, 4, 0]);
  ej = anotar(ej, false, 1);
  assert.deepEqual([ej.puntos, ej.vidas, ej.aciertos, ej.fallos, ej.reinicios, ej.racha, ej.terminado], [0, 5, 0, 5, 1, 0, false]);
  // Con vidas a medida (el juego puede pedir 3), se reponen las declaradas.
  let g = ejercicioNuevo(10, 3);
  for (let i = 0; i < 3; i++) g = anotar(g, false, 1, { vidas: 3 });
  assert.deepEqual([g.vidas, g.reinicios], [3, 1]);
});

test('contador: objetivo y penalización a medida (la criba usa 5; los paréntesis, 0 de penalización)', () => {
  let ej = ejercicioNuevo(5);
  assert.deepEqual([ej.puntos, ej.objetivo], [0, 5]);
  ej = anotar(anotar(ej, true, 1), false, 1, { penalizacion: 0 });
  assert.deepEqual([ej.puntos, ej.vidas, ej.fallos], [1, 4, 1], 'con penalización 0 se pierde la vida pero no el punto');
  for (let i = 0; i < 4; i++) ej = anotar(ej, true, 2);
  assert.ok(ej.terminado);
  assert.equal(ej.dia, 2);
  assert.equal(anotar({ ...ejercicioNuevo(), puntos: 7 }, false, 1, { penalizacion: 3 }).puntos, 4);
  assert.equal(anotar({ ...ejercicioNuevo(), puntos: 2 }, false, 1, { penalizacion: 3 }).puntos, 0, 'nunca por debajo de 0');
  assert.equal(anotar(ejercicioNuevo(), true, 1, { racha: 0 }).puntos, 1, 'racha 0 = sin extra');
  let r = ejercicioNuevo();
  for (let i = 0; i < 3; i++) r = anotar(r, true, 1, { racha: 3, extra: 2 });
  assert.equal(r.puntos, 5, 'racha y extra a medida');
});

test('contador: las pistas se suman a los fallos sin tocar puntos ni vidas', () => {
  let ej = anotar(ejercicioNuevo(4), true, 1, { pistas: 2 });
  assert.deepEqual([ej.puntos, ej.vidas, ej.aciertos, ej.fallos, ej.racha], [1, 5, 1, 2, 1]);
  ej = anotar(ej, false, 1, { pistas: 1 });
  assert.deepEqual([ej.puntos, ej.vidas, ej.aciertos, ej.fallos], [0, 4, 1, 4], 'un fallo con una pista: dos fallos');
  ej = anotar(ej, true, 1);
  assert.equal(ej.fallos, 4);
});

test('contador: queHaPasado resume el cambio para el feedback', () => {
  const a = { ...ejercicioNuevo(), puntos: 4, aciertos: 4, racha: 4 };
  assert.deepEqual(queHaPasado(a, anotar(a, true, 1)), { ganados: 2, perdidos: 0, extra: true, reinicio: false, vidas: 5 });
  const b = { ...ejercicioNuevo(), puntos: 3, aciertos: 3, racha: 1 };
  assert.deepEqual(queHaPasado(b, anotar(b, true, 1)), { ganados: 1, perdidos: 0, extra: false, reinicio: false, vidas: 5 });
  assert.deepEqual(queHaPasado(b, anotar(b, false, 1)), { ganados: 0, perdidos: 1, extra: false, reinicio: false, vidas: 4 });
  const c = { ...b, vidas: 1 };
  assert.deepEqual(queHaPasado(c, anotar(c, false, 1)), { ganados: 0, perdidos: 3, extra: false, reinicio: true, vidas: 5 });
  const d = { ...b, puntos: 0 };
  assert.deepEqual(queHaPasado(d, anotar(d, false, 1)).perdidos, 0);
});

test('contador: migra lo guardado con el modelo antiguo o con otro objetivo, sin perder lo terminado', () => {
  // Modelo antiguo (pendientes): si estaba terminado, sigue terminado con sus fallos y su día.
  const viejoHecho = { pendientes: 0, aciertos: 12, fallos: 3, rapidos: 0, terminado: true, dia: 30, repeticiones: 1 };
  const m = migrarProgreso(viejoHecho, { objetivo: 10, vidas: 5 });
  assert.deepEqual([m.terminado, m.fallos, m.dia, m.repeticiones, m.puntos, m.objetivo, m.vidas], [true, 3, 30, 1, 10, 10, 5]);
  // Sin terminar: se empieza de cero (nadie lo había usado), conservando los fallos.
  assert.deepEqual(migrarProgreso({ pendientes: 7, aciertos: 5, fallos: 2, terminado: false }, { objetivo: 10, vidas: 5 }),
    { ...ejercicioNuevo(10, 5), fallos: 2 });
  // Modelo nuevo con los mismos parámetros: el mismo objeto.
  const igual = { ...ejercicioNuevo(10, 5), puntos: 4, aciertos: 4 };
  assert.equal(migrarProgreso(igual, { objetivo: 10, vidas: 5 }), igual);
  // Si el objetivo baja por debajo de los puntos, no se da por terminado solo: queda a 1 del final.
  assert.deepEqual(migrarProgreso({ ...igual, puntos: 8, aciertos: 8 }, { objetivo: 6, vidas: 5 }).puntos, 5);
  assert.deepEqual(migrarProgreso({ ...igual, puntos: 8, aciertos: 8 }, { objetivo: 6, vidas: 5 }).objetivo, 6);
  // Si las vidas bajan, no se tienen más de las nuevas; si suben, se conservan las que había.
  assert.equal(migrarProgreso(igual, { objetivo: 10, vidas: 3 }).vidas, 3);
  assert.equal(migrarProgreso({ ...igual, vidas: 2 }, { objetivo: 10, vidas: 3 }).vidas, 2);
  const terminado = { ...ejercicioNuevo(10, 5), puntos: 10, terminado: true, dia: 4 };
  assert.equal(migrarProgreso(terminado, { objetivo: 20, vidas: 3 }), terminado, 'terminado con otras normas sigue terminado');
});

test('fechas: las mismas que en divisores/', () => {
  assert.equal(diaDe(new Date(2026, 8, 1)), 0);
  assert.equal(fechaDeDia(diaDe(new Date(2026, 9, 7, 23, 30))), '7/10/2026');
  assert.equal(fechaDeDia(diaDe(new Date(2027, 5, 20, 0, 5))), '20/6/2027');
  assert.equal(diaDe(new Date(2020, 0, 1)), 0);
  assert.equal(diaDe(new Date(2040, 0, 1)), 1023);
  for (const f of [new Date(2026, 9, 25, 2, 30), new Date(2027, 2, 28, 3, 0), new Date(2026, 11, 31, 23, 59)]) {
    assert.equal(diaDe(f), divisores.diaDe(f));
    assert.equal(fechaDeDia(diaDe(f)), divisores.fechaDeDia(divisores.diaDe(f)));
  }
});

// --- Aritmética -------------------------------------------------------------------

test('aritmética: primos, frente a la definición', () => {
  for (let n = 0; n <= LIMITE; n++) assert.equal(esPrimo(n), primoBruto(n), `${n}`);
  assert.deepEqual(PRIMOS, Array.from({ length: 200 }, (_, n) => n).filter(primoBruto));
  assert.equal(PRIMOS.at(-1), 199);
  assert.equal(esPrimo(1), false);
  assert.equal(esPrimo(0), false);
  assert.equal(esPrimo(2.5), false);
});

test('aritmética: factorizar da primos crecientes cuyo producto es el número', () => {
  for (let n = 1; n <= LIMITE; n++) {
    const f = factorizar(n);
    assert.equal(valorDe(f), n);
    f.forEach(([p, e], i) => {
      assert.ok(primoBruto(p), `${p} es primo`);
      assert.ok(e >= 1);
      if (i) assert.ok(p > f[i - 1][0], 'bases de menor a mayor');
    });
  }
  assert.deepEqual(factorizar(1), []);
  assert.deepEqual(factorizar(72), [[2, 3], [3, 2]]);
  assert.deepEqual(factorizar(363), [[3, 1], [11, 2]]);
  assert.deepEqual(factorizar(338), [[2, 1], [13, 2]]);
  assert.throws(() => factorizar(0));
});

test('aritmética: divisores, parejas y raíz entera', () => {
  for (let n = 1; n <= LIMITE; n++) {
    assert.deepEqual(divisoresDe(n), divisoresBrutos(n), `divisores de ${n}`);
    const parejas = parejasDivisores(n);
    for (const [a, b] of parejas) { assert.equal(a * b, n); assert.ok(a <= b); }
    assert.deepEqual([...new Set(parejas.flat())].sort((a, b) => a - b), divisoresBrutos(n));
    assert.equal(parejas.length, Math.ceil(divisoresBrutos(n).length / 2));
    const r = raizEntera(n);
    assert.ok(r * r <= n && (r + 1) * (r + 1) > n, `raíz entera de ${n}`);
  }
  assert.deepEqual(parejasDivisores(24), [[1, 24], [2, 12], [3, 8], [4, 6]]);
  assert.deepEqual(parejasDivisores(36).at(-1), [6, 6]);
  assert.deepEqual(divisoresDe(36), [1, 2, 3, 4, 6, 9, 12, 18, 36]);
  assert.deepEqual(divisoresDe(1), [1]);
});

test('aritmética: m.c.d. y m.c.m., frente a la definición', () => {
  for (let a = 1; a <= 60; a++) {
    for (let b = 1; b <= 60; b++) {
      const comunes = divisoresBrutos(a).filter(d => divideA(d, b));
      assert.equal(mcd(a, b), Math.max(...comunes), `mcd(${a}, ${b})`);
      let m = Math.max(a, b);
      while (m % a || m % b) m++;
      assert.equal(mcm(a, b), m, `mcm(${a}, ${b})`);
      assert.equal(mcd(a, b) * mcm(a, b), a * b);
    }
  }
  assert.equal(mcd(12, 18, 30), 6);
  assert.equal(mcm(4, 6, 10), 60);
  assert.equal(mcd(7), 7);
  assert.equal(mcd(0, 9), 9);
});

test('aritmética: cifras y suma de cifras', () => {
  assert.deepEqual(cifras(308), [3, 0, 8]);
  assert.deepEqual(cifras(0), [0]);
  assert.equal(sumaCifras(308), 11);
  for (let n = 0; n <= LIMITE; n++) assert.equal(sumaCifras(n), [...String(n)].reduce((s, c) => s + Number(c), 0));
});

test('criterios de divisibilidad: aciertan siempre y dan la razón con los números', () => {
  assert.deepEqual(CRITERIOS, [2, 3, 5, 9, 10, 11]);
  for (const d of CRITERIOS) {
    for (let n = 0; n <= 3000; n++) {
      const c = criterio(n, d);
      assert.equal(c.divisible, n % d === 0, `${n} entre ${d}`);
      assert.ok(c.razon.es && c.razon.en);
      assert.doesNotMatch(c.razon.es + c.razon.en, /undefined|NaN|-\d|×/);
    }
  }
  assert.equal(criterio(51, 3).razon.es, 'la suma de sus cifras es 5 + 1 = 6, que es múltiplo de 3');
  assert.equal(criterio(52, 3).razon.en, 'the sum of its digits is 5 + 2 = 7, which is not a multiple of 3');
  assert.equal(criterio(7, 9).razon.es, 'la suma de sus cifras es 7, que no es múltiplo de 9');
  assert.equal(criterio(138, 2).razon.es, 'acaba en 8, que es una cifra par');
  assert.equal(criterio(135, 2).razon.en, 'it ends in 5, which is an odd digit');
  assert.equal(criterio(135, 5).razon.es, 'acaba en 5');
  assert.equal(criterio(132, 5).razon.es, 'acaba en 2, y no en 0 ni en 5');
  assert.equal(criterio(130, 10).razon.en, 'it ends in 0');
  assert.equal(criterio(135, 10).razon.es, 'acaba en 5, y no en 0');
  assert.equal(criterio(539, 11).razon.es, 'las cifras de lugar impar suman 5 + 9 = 14 y las de lugar par suman 3; la diferencia es 14 − 3 = 11, que es múltiplo de 11');
  assert.equal(criterio(286, 11).razon.es, 'las cifras de lugar impar suman 2 + 6 = 8 y las de lugar par suman 8; la diferencia es 8 − 8 = 0, que es múltiplo de 11');
  assert.equal(criterio(7, 11).razon.en, 'the digits in odd places add up to 7 and the digits in even places add up to 0; the difference is 7 − 0 = 7, which is not a multiple of 11');
  assert.throws(() => criterio(12, 7));
});

test('factorizaciones: producto, cociente, múltiplo, m.c.d. y m.c.m.', () => {
  for (let a = 1; a <= 80; a++) {
    for (let b = 1; b <= 80; b++) {
      const f = factorizar(a), g = factorizar(b);
      assert.deepEqual(multiplicarFact(f, g), factorizar(a * b));
      assert.equal(esMultiploFact(f, g), a % b === 0, `¿${a} es múltiplo de ${b}?`);
      assert.deepEqual(dividirFact(f, g), a % b === 0 ? factorizar(a / b) : null);
      assert.deepEqual(mcdFact(f, g), factorizar(mcd(a, b)));
      assert.deepEqual(mcmFact(f, g), factorizar(mcm(a, b)));
    }
  }
  assert.deepEqual(mcdFact(factorizar(12), factorizar(18), factorizar(30)), factorizar(6));
  assert.deepEqual(mcmFact(factorizar(4), factorizar(6), factorizar(10)), factorizar(60));
  const f = factorizar(72);
  multiplicarFact(f, f);
  assert.deepEqual(f, [[2, 3], [3, 2]], 'no se modifican los argumentos');
});

test('factorizaciones: cómo se escriben', () => {
  assert.equal(htmlFact(factorizar(360)), '2<sup>3</sup> · 3<sup>2</sup> · 5');
  assert.equal(textoFact(factorizar(360)), '2^3 · 3^2 · 5');
  assert.equal(htmlFact(factorizar(286)), '2 · 11 · 13');
  assert.equal(htmlFact(factorizar(97)), '97');
  assert.equal(htmlFact([]), '1');
  assert.equal(textoFact([]), '1');
  for (let n = 2; n <= LIMITE; n++) assert.doesNotMatch(htmlFact(factorizar(n)), /×|\*|<sup>1<\/sup>/);
});

// --- Textos -----------------------------------------------------------------------

test('textos comunes: los dos idiomas tienen lo mismo, con producto de punto', () => {
  assert.deepEqual(Object.keys(T.es).sort(), Object.keys(T.en).sort());
  for (const clave of Object.keys(T.es)) assert.equal(typeof T.es[clave], typeof T.en[clave], clave);
  assert.equal(T.es.animos.length, T.en.animos.length);
  assert.match(T.es.menu_regla(10, 1, 5), /llegar a 10 puntos.*5 aciertos seguidos dan 1 extra.*quita 1 punto y una vida: tienes 5/);
  assert.match(T.es.menu_regla(6, 0, 3), /quita una vida: tienes 3/);
  assert.match(T.en.menu_regla(10, 2, 5), /reach 10 points.*5 correct answers in a row give 1 extra.*takes away 2 points and one life: you have 5/);
  assert.match(T.es.menu_regla_varia(5, 1), /5 aciertos seguidos/);
  assert.equal(T.es.penalizacion(1), '−1 punto');
  assert.equal(T.en.penalizacion(2), '−2 points');
  assert.equal(T.es.penalizacion(0), 'No pierdes puntos (estás en 0)');
  assert.equal(T.es.puntos(3, 10), '3/10 puntos');
  assert.equal(T.es.vidas_quedan(1), 'Te queda 1 vida');
  assert.equal(T.en.racha_extra(5, 1), '5 in a row! +1 extra point.');
  assert.equal(T.es.ejercicio(1), 'Ejercicio 1');
  assert.match(T.en.resultado_parcial(2, 3), /2 of 3 exercises/);
  assert.doesNotMatch(JSON.stringify([T, TX], (k, v) => (typeof v === 'function' ? v(2, 3, 5) : v)), /×|HCF|\bfactor de\b/);
});

test('textos: unir y esc', () => {
  assert.equal(unir(['a', 'b', 'c'], 'es'), 'a, b y c');
  assert.equal(unir(['a', 'b'], 'en'), 'a and b');
  assert.equal(unir(['2', '3', '5'], 'es', 'o'), '2, 3 o 5');
  assert.equal(unir(['a'], 'es'), 'a');
  assert.equal(unir([], 'es'), '');
  assert.equal(esc('<b a="1">&\'</b>'), '&lt;b a=&quot;1&quot;&gt;&amp;&#39;&lt;/b&gt;');
});

// --- El contrato de la base ---------------------------------------------------------

const ejercicioValido = () => ({ nombre: { es: 'a', en: 'a' }, detalle: { es: 'b', en: 'b' }, generar: () => ({}), montar: () => {} });

test('base: una práctica bien declarada pasa, y se dice qué le falta a la que no', () => {
  assert.equal(validarPractica({ slug: 'plantilla', ejercicios: [ejercicioValido(), ejercicioValido()] }), practicaPorSlug('plantilla'));
  assert.throws(() => validarPractica({ slug: 'inventada', ejercicios: [] }), /no está en practicas\/_comun\/catalogo\.js/);
  assert.throws(() => validarPractica({ slug: 'plantilla', ejercicios: [ejercicioValido()] }), /tiene que declarar 2 ejercicios.*declara 1/);
  assert.throws(() => validarPractica({ slug: 'plantilla' }), /declara 0/);
  const con = cambios => ({ slug: 'plantilla', ejercicios: [ejercicioValido(), { ...ejercicioValido(), ...cambios }] });
  assert.throws(() => validarPractica(con({ nombre: 'solo en español' })), /ejercicio 2: falta «nombre» como \{ es, en \}/);
  assert.throws(() => validarPractica(con({ detalle: { es: 'x' } })), /falta «detalle»/);
  assert.throws(() => validarPractica(con({ montar: undefined })), /falta la función «montar»/);
  assert.throws(() => validarPractica(con({ generar: 'x' })), /falta la función «generar»/);
  assert.throws(() => validarPractica(con({ introduccion: '<p>hola</p>' })), /«introduccion» tiene que ser \{ es, en \}/);
  assert.throws(() => validarPractica(con({ objetivo: 0 })), /enteros/);
  assert.throws(() => validarPractica(con({ vidas: 0 })), /vidas ≥ 1/);
  assert.throws(() => validarPractica(con({ penalizacion: 1.5 })), /enteros/);
  assert.throws(() => validarPractica(con({ penalizacion: -1 })), /penalizacion ≥ 0/);
  assert.throws(() => validarPractica(con({ inicial: 10 })), /«inicial» ya no existe/);
  assert.throws(() => validarPractica(con({ maximo: 20 })), /«maximo» ya no existe/);
  assert.ok(validarPractica(con({ objetivo: 5, penalizacion: 0, introduccion: { es: 'a', en: 'b' }, clave: () => 'x' })));
  assert.ok(validarPractica(con({ objetivo: 50, vidas: 3 })));
});

test('base: parámetros del contador y nombres de lo guardado', () => {
  assert.deepEqual(parametrosDe({}), { objetivo: 10, penalizacion: 1, vidas: 5 });
  assert.deepEqual(parametrosDe({ objetivo: 5 }), { objetivo: 5, penalizacion: 1, vidas: 5 });
  assert.deepEqual(parametrosDe({ penalizacion: 0, vidas: 3 }), { objetivo: 10, penalizacion: 0, vidas: 3 });
  assert.equal(claveProgreso('semaforo', 'ABCD'), 'practicas.v1.semaforo.ABCD');
  assert.equal(claveIdiomaFijo('ABCD'), 'practicas.idioma_fijo.ABCD');
  // El id del documento tiene que cumplir la regla de Firestore.
  const regla = /^[a-z0-9-]+--[A-HJ-NP-Z2-9]{4}$/;
  for (const p of CATALOGO) for (const i of [0, 77, 1023]) assert.match(documentoNube(p.slug, codigoAlumno(i)), regla);
});

test('base: el modo de idioma sale del parámetro de la URL o, si no, de lo guardado', () => {
  assert.equal(modoIdioma('?idioma=es', null), 'es');
  assert.equal(modoIdioma('?c=ABCD&idioma=en', 'es'), 'en', 'el parámetro manda sobre lo guardado');
  assert.equal(modoIdioma('?idioma=alterno', 'en'), null, 'alterno quita lo fijado');
  assert.equal(modoIdioma('?c=ABCD', 'en'), 'en', 'sin parámetro, lo guardado');
  assert.equal(modoIdioma('?c=ABCD', null), null, 'sin parámetro ni nada guardado: alterno');
  assert.equal(modoIdioma('?idioma=fr', 'es'), 'es', 'un valor que no es es/en/alterno no cambia nada');
});

test('base: la secuencia de idiomas alterna de forma equilibrada', () => {
  // Por bloques de 4 (dos «es» y dos «en»): en cada bloque completo, exactos
  // 2 y 2; en 10 ítems (dos bloques y medio), cerca de 5 y 5 pero no siempre
  // exacto (el bloque a medias puede caer del mismo lado). Nunca más de 4
  // iguales seguidos (como mucho los dos últimos de un bloque y los dos
  // primeros del siguiente).
  for (let semilla = 0; semilla < 1000; semilla++) {
    const secuencia = crearSecuenciaIdiomas(crearRng(semilla));
    const ocho = Array.from({ length: 8 }, () => secuencia.siguiente());
    assert.equal(ocho.filter(i => i === 'es').length, 4, `semilla ${semilla}: dos bloques completos`);
    assert.equal(ocho.filter(i => i === 'en').length, 4, `semilla ${semilla}`);
  }
  let es = 0, en = 0, maxRacha = 0;
  for (let semilla = 0; semilla < 1000; semilla++) {
    const secuencia = crearSecuenciaIdiomas(crearRng(semilla));
    const diez = Array.from({ length: 10 }, () => secuencia.siguiente());
    diez.forEach(i => (i === 'es' ? es++ : en++));
    let racha = 1;
    for (let i = 1; i < diez.length; i++) {
      racha = diez[i] === diez[i - 1] ? racha + 1 : 1;
      assert.ok(racha <= 4, `semilla ${semilla}: más de 4 seguidos del mismo idioma`);
      maxRacha = Math.max(maxRacha, racha);
    }
  }
  assert.ok(es > 4500 && es < 5500, `desequilibrado: ${es} es de ${es + en}`);
  assert.equal(maxRacha, 4, 'el caso de 4 seguidos (fin de un bloque y principio del siguiente) tiene que darse alguna vez en 1000 intentos');
});

test('textos: el botón de traducción nombra el idioma AL QUE se cambia', () => {
  assert.deepEqual(Object.keys(TRADUCCION).sort(), ['en', 'es']);
  assert.match(TRADUCCION.es, /español/i);
  assert.match(TRADUCCION.en, /english/i);
});

// --- Panel del profesor -------------------------------------------------------------

test('panel: tabla de una práctica con lista, códigos y nube', () => {
  const hecho = { terminado: true, fallos: 2 }, sin = { terminado: false, fallos: 0 };
  const filas = juntarResultados(
    ['Ana', 'Luis', '', 'Eva'],
    [{ indice: 0, ejercicios: [hecho, sin, sin], dia: 40 }, { indice: 7, ejercicios: [hecho, sin, sin], dia: 41 }, { indice: 3, ejercicios: [{ terminado: true, fallos: 15 }], dia: 39 }],
    [{ indice: 0, ej: [0, 1, 2].map(() => ({ puntos: 10, objetivo: 10, aciertos: 10, fallos: 0, terminado: true, dia: 42 })) },
      { indice: 3, ej: [{ puntos: 10, objetivo: 10, aciertos: 12, fallos: 16, terminado: true, dia: 39 }, { puntos: 6, objetivo: 10, vidas: 4, aciertos: 8, fallos: 1, terminado: false, dia: 0 }] }],
    3,
  );
  assert.deepEqual(filas.map(f => [f.indice, f.nombre, f.hechos, f.fuente, f.dia]), [
    [0, 'Ana', 3, 'nube', 42],      // la nube tiene más ejercicios terminados que el código
    [1, 'Luis', 0, '', 0],          // está en la lista y no ha hecho nada
    [3, 'Eva', 1, 'nube', 39],      // a igualdad de terminados gana la nube, que trae más detalle
    [7, '', 1, 'código', 41],       // envió código pero no está en la lista
  ]);
  for (const f of filas) assert.equal(f.ejercicios.length, 3);
  assert.equal(filas[2].ejercicios[1].puntos, 6);
  assert.equal(filas[2].ejercicios[0].fallos, 16);
  assert.equal(filas[3].ejercicios[0].tope, false);
  // Solo con el código, 15 fallos son «15 o más».
  assert.equal(juntarResultados([], [{ indice: 3, ejercicios: [{ terminado: true, fallos: 15 }], dia: 39 }], [], 2)[0].ejercicios[0].tope, true);
  assert.deepEqual(juntarResultados([], [], [{ indice: 2 }], 3), [], 'un documento de la nube sin ejercicios se ignora');
});

test('panel: resumen de alumnos por prácticas', () => {
  const hecho = { terminado: true, fallos: 0 }, sin = { terminado: false, fallos: 0 };
  const practicas = [practicaPorId(0), practicaPorId(1), practicaPorId(31)];
  const filas = juntarResumen(
    ['Ana', 'Luis'],
    [
      { practica: 31, indice: 0, ejercicios: [hecho, hecho], dia: 40 },
      { practica: 1, indice: 0, ejercicios: [hecho, sin, sin, sin], dia: 41 },
      { practica: 1, indice: 5, ejercicios: [hecho, hecho, hecho, hecho], dia: 41 },
      { practica: 7, indice: 1, ejercicios: [hecho, hecho, hecho], dia: 41 },   // práctica que no está entre las columnas
    ],
    [{ practica: 0, indice: 1, ej: [{ puntos: 5, objetivo: 10, aciertos: 5, fallos: 0, terminado: false }] }],
    practicas,
  );
  assert.deepEqual(filas.map(f => [f.indice, f.nombre, f.completas, f.practicas.map(p => `${p.hechos}/${p.n}`).join(' ')]), [
    [0, 'Ana', 1, '0/6 1/4 2/2'],
    [1, 'Luis', 0, '0/6 0/4 0/2'],
    [5, '', 1, '0/6 4/4 0/2'],
  ]);
  assert.equal(filas[1].practicas[0].empezada, true, 'Luis va a medias en divisores');
  assert.equal(filas[1].practicas[1].empezada, false);
  assert.deepEqual(filas[0].practicas.map(p => p.id), [0, 1, 31]);
});

test('panel: documentos de la nube de las dos colecciones', () => {
  const estado = JSON.stringify({ v: 1, idioma: 'es', ej: [{ pendientes: 0, aciertos: 20, fallos: 1, terminado: true, dia: 36 }] });
  const c = codigoAlumno(4);
  const nuevos = leerDocumentos([
    { id: documentoNube('semaforo', c), estado, actualizado: 5 },
    { id: documentoNube('divisores', c), estado, actualizado: 6 },
    { id: `inventada--${c}`, estado },          // práctica que no existe
    { id: 'semaforo--ZZZZ', estado },           // código que no es de nadie
    { id: documentoNube('recta', c), estado: '{roto' },
    { id: 'semaforo', estado },
  ]);
  assert.deepEqual(nuevos.map(d => [d.practica, d.indice, d.actualizado, d.ej[0].fallos]), [[1, 4, 5, 1], [0, 4, 6, 1]]);
  const viejos = leerDocumentos([{ id: c, estado, actualizado: 7 }, { id: 'ZZZZ', estado }], 'divisores');
  assert.deepEqual(viejos.map(d => [d.practica, d.indice, d.actualizado]), [[0, 4, 7]]);
  // Y de ahí a la tabla.
  assert.equal(juntarResultados(['a', 'b', 'c', 'd', 'Eva'], [], nuevos.filter(d => d.practica === 1), 4)[4].hechos, 1);
});

// --- Práctica de plantilla ------------------------------------------------------------

test('plantilla, ejercicio 1: la opción buena es verdad y la otra es falsa', () => {
  const rng = crearRng(31);
  const veces = { primo: 0, compuesto: 0 };
  const vistos = new Set();
  for (let i = 0; i < 3000; i++) {
    const item = generarPrimo(rng);
    assert.ok(Number.isInteger(item.n) && item.n >= 2 && item.n <= 150, 'ni el 0 ni el 1, que no son primos ni compuestos');
    const clase = clasePrimo(item);
    assert.equal(clase === 'primo', primoBruto(item.n));
    assert.equal(clase === 'compuesto', divisoresBrutos(item.n).length > 2);
    veces[clase]++;
    vistos.add(item.n);
    assert.deepEqual(JSON.parse(JSON.stringify(item)), item, 'el ítem es datos puros');
  }
  assert.ok(veces.primo > 1200 && veces.compuesto > 1200, 'no gana quien pulsa siempre lo mismo');
  assert.ok(vistos.size > 100, 'hay variedad');
  for (const n of [51, 57, 87, 91, 119, 143]) assert.ok(vistos.has(n), `sale el ${n}, que parece primo`);
});

test('plantilla, ejercicio 1: la explicación de por qué un número es primo', () => {
  assert.deepEqual(primosAProbar(97), { probados: [2, 3, 5, 7], siguiente: 11 });
  assert.deepEqual(primosAProbar(2), { probados: [], siguiente: 2 });
  assert.deepEqual(primosAProbar(149), { probados: [2, 3, 5, 7, 11], siguiente: 13 });
  for (const p of PRIMOS.filter(q => q <= 150)) {
    const { probados, siguiente } = primosAProbar(p);
    assert.ok(siguiente * siguiente > p);
    for (const q of probados) { assert.ok(q * q <= p); assert.notEqual(p % q, 0); }
  }
});

test('plantilla, ejercicio 2: solo vale la factorización, y siempre se puede construir', () => {
  assert.deepEqual(BASES, [2, 3, 5, 7, 11, 13]);
  for (const n of [242, 286, 338, 363]) assert.ok(NUMEROS.includes(n), `sale el ${n} (factores 11 y 13)`);
  for (const n of NUMEROS) {
    const f = factorizar(n);
    assert.ok(f.length >= 2 || f[0][1] >= 2, `${n} no es primo`);
    assert.ok(f.every(([p, e]) => BASES.includes(p) && e <= EXPONENTE_MAXIMO), `${n} se puede escribir con los botones`);
    const buenos = BASES.map(p => f.find(([q]) => q === p)?.[1] ?? 0);
    assert.ok(esFactorizacionDe({ n }, buenos));
    assert.deepEqual(factDe(buenos), f);
    // Cualquier otro juego de exponentes da otro número: no hay dos respuestas buenas.
    buenos.forEach((e, i) => {
      for (const otro of [e - 1, e + 1]) {
        if (otro < 0 || otro > EXPONENTE_MAXIMO) continue;
        assert.ok(!esFactorizacionDe({ n }, buenos.with(i, otro)));
      }
    });
  }
  assert.ok(!esFactorizacionDe({ n: 72 }, [0, 0, 0, 0, 0, 0]), 'sin elegir nada no es 72');
  const rng = crearRng(2);
  const vistos = new Set();
  for (let i = 0; i < 500; i++) vistos.add(generarFactorizacion(rng).n);
  assert.equal(vistos.size, NUMEROS.length);
});

test('plantilla: textos propios en los dos idiomas', () => {
  const hojas = (obj, ruta = '') => Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !('es' in v) ? hojas(v, `${ruta}${k}.`) : [[`${ruta}${k}`, v]]));
  for (const [ruta, v] of hojas(TX)) {
    assert.deepEqual(Object.keys(v).sort(), ['en', 'es'], ruta);
    assert.equal(typeof v.es, typeof v.en, ruta);
  }
  assert.equal(TX.primo.es_compuesto.es(51), '51 es compuesto');
  assert.match(TX.primo.se_pasa.en(97, 11), /11 · 11 = 121/);
});
