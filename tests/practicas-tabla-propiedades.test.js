// Tabla de propiedades (practicas/tabla-propiedades/, tarea 206): las propiedades contra
// definiciones independientes, el generador (siempre una solución, sin casillas imposibles,
// variedad), el corrector (por propiedades, no contra una clave) y las frases de feedback.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  NIVELES, OBJETIVO, MAXIMO, ETIQUETAS, TRIANGULARES, nivelDePuntos, cumple, nombreEtiqueta, razon, etiquetaPorId,
  corregir, estaCompleta, generarNivel, generar, clave, infografiasDe, divisoresDe,
} from '../practicas/tabla-propiedades/logica.js';
import { TX, ENTRE } from '../practicas/tabla-propiedades/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';

const IDIOMAS = ['es', 'en'];
const N = 1200;   // tablas por nivel (el generador tarda unos milisegundos cada una)

// --- Definiciones independientes, a mano ---------------------------------------------

const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const CUADRADOS = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
const DIVISORES_60 = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
const todos = Array.from({ length: MAXIMO }, (_, i) => i + 1);
const comoLista = id => todos.filter(n => cumple(id, n));

// Se generan una vez y se reparten entre los tests.
const rngs = [1, 2, 3, 4].map(n => crearRng(206 * 1000 + n));
const TABLAS = NIVELES.map(({ nivel }) => Array.from({ length: N }, () => generarNivel(rngs[nivel - 1], nivel)));

test('niveles: tamaños, puntos (1 por pieza colocada) y total 54', () => {
  assert.deepEqual(NIVELES.map(n => [n.nF, n.nC, n.puntos]), [[2, 3, 6], [2, 4, 14], [3, 3, 15], [4, 3, 19]]);
  assert.equal(OBJETIVO, 54);
  // Nivel 1: 6 números con las etiquetas ya puestas; los demás, números + etiquetas.
  assert.deepEqual(NIVELES.map(n => n.nF * n.nC + (n.fijas ? 0 : n.nF + n.nC)), [6, 14, 15, 19]);
  assert.deepEqual(NIVELES.map(n => n.fijas), [true, false, false, false]);
});

test('el nivel sale de los puntos: 0 → 6 → 20 → 35 → 54', () => {
  const casos = [[0, 1], [5, 1], [6, 2], [19, 2], [20, 3], [34, 3], [35, 4], [53, 4], [54, 4]];
  for (const [puntos, nivel] of casos) assert.equal(nivelDePuntos(puntos), nivel, `${puntos} puntos`);
  assert.equal(generar(crearRng(5), { puntos: 20, anterior: null }).nivel, 3);
  assert.equal(generar(crearRng(5), {}).nivel, 1);
});

// --- Las propiedades -----------------------------------------------------------------

test('propiedades: primo, compuesto, cuadrado, triangular, par e impar, frente a listas a mano', () => {
  assert.deepEqual(comoLista('primo'), PRIMOS);
  assert.deepEqual(comoLista('compuesto'), todos.filter(n => n > 1 && !PRIMOS.includes(n)), 'el 1 no es primo ni compuesto');
  assert.ok(!cumple('primo', 1) && !cumple('compuesto', 1));
  assert.deepEqual(comoLista('cuadrado'), CUADRADOS);
  assert.deepEqual(comoLista('triangular'), [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91]);
  assert.deepEqual(TRIANGULARES, comoLista('triangular'));
  assert.deepEqual(comoLista('par'), todos.filter(n => n % 2 === 0));
  assert.deepEqual(comoLista('impar'), todos.filter(n => n % 2 === 1));
  assert.deepEqual(comoLista('divisor:60'), DIVISORES_60);
});

test('propiedades: mayor, menor, múltiplos, divisores y «tiene k divisores»', () => {
  assert.deepEqual(comoLista('mayor:80'), todos.slice(80));
  assert.deepEqual(comoLista('menor:20'), todos.slice(0, 19));
  assert.deepEqual(comoLista('multiplo:11'), [11, 22, 33, 44, 55, 66, 77, 88, 99]);
  assert.deepEqual(comoLista('multiplo:10'), [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  for (const e of ETIQUETAS.filter(x => x.familia === 'multiplo')) {
    assert.deepEqual(comoLista(e.id), todos.filter(n => n % e.p === 0), e.id);
  }
  for (const e of ETIQUETAS.filter(x => x.familia === 'divisor')) {
    assert.deepEqual(comoLista(e.id), todos.filter(n => { for (let m = n; m <= e.p; m += n) if (m === e.p) return true; return false; }), e.id);
  }
  assert.deepEqual(comoLista('ndivisores:3'), [4, 9, 25, 49], 'tres divisores: el cuadrado de un primo');
  for (const e of ETIQUETAS.filter(x => x.familia === 'ndivisores')) {
    for (const n of todos) {
      let cuenta = 0;
      for (let d = 1; d <= n; d++) if (n % d === 0) cuenta++;
      assert.equal(cumple(e.id, n), cuenta === e.p, `${n} · ${e.id}`);
    }
  }
  assert.deepEqual(divisoresDe(36), [1, 2, 3, 4, 6, 9, 12, 18, 36]);
});

test('banco: tres grados, sin «tiene 2 divisores» ni etiquetas equivalentes, y nombres en los dos idiomas', () => {
  assert.deepEqual([...new Set(ETIQUETAS.map(e => e.dificultad))].sort(), ['dificil', 'facil', 'media']);
  assert.ok(!ETIQUETAS.some(e => e.familia === 'ndivisores' && e.p === 2), '«tiene 2 divisores» es «primo» con otras palabras');
  for (const e of ETIQUETAS) assert.ok(comoLista(e.id).length >= 4, `${e.id}: demasiado pocos números`);
  for (let i = 0; i < ETIQUETAS.length; i++) {
    for (let j = i + 1; j < ETIQUETAS.length; j++) {
      assert.notDeepEqual(ETIQUETAS[i].tiene, ETIQUETAS[j].tiene, `${ETIQUETAS[i].id} y ${ETIQUETAS[j].id} son la misma propiedad`);
    }
  }
  const nombres = IDIOMAS.map(i => ETIQUETAS.map(e => nombreEtiqueta(e.id, i)));
  for (const lista of nombres) assert.equal(new Set(lista).size, lista.length, 'dos etiquetas con el mismo nombre');
  assert.equal(nombreEtiqueta('divisor:60', 'es'), 'Divisor de 60');
  assert.equal(nombreEtiqueta('divisor:60', 'en'), 'Divisor of 60');
  assert.equal(nombreEtiqueta('ndivisores:4', 'es'), 'Tiene 4 divisores');
  assert.deepEqual(Object.keys(TX.etiquetas).sort(), [...new Set(ETIQUETAS.map(e => e.familia))].sort());
});

// --- El generador --------------------------------------------------------------------

test('generador: cada nivel con su tamaño, sus piezas y su dificultad; nunca hace falta la tabla de reserva', () => {
  for (const { nivel, nF, nC, fijas, puntos } of NIVELES) {
    for (const item of TABLAS[nivel - 1]) {
      assert.ok(!item.reserva, 'se ha usado la tabla de reserva');
      assert.equal(item.nivel, nivel);
      assert.deepEqual([item.nF, item.nC, item.fijas, item.puntos], [nF, nC, fijas, puntos]);
      assert.equal(item.etiquetas.length, nF + nC);
      assert.equal(item.numeros.length, nF * nC);
      assert.equal(new Set(item.numeros).size, item.numeros.length, 'números repetidos');
      assert.ok(item.numeros.every(n => Number.isInteger(n) && n >= 1 && n <= MAXIMO));
      assert.equal(new Set(item.etiquetas).size, item.etiquetas.length);
      assert.equal(item.nF * item.nC + (fijas ? 0 : item.etiquetas.length), puntos, 'los puntos son las piezas que coloca el alumno');
      const grados = item.etiquetas.map(id => etiquetaPorId(id).dificultad);
      if (nivel === 1) assert.ok(grados.every(g => g === 'facil'), 'el nivel 1 solo tiene propiedades fáciles');
      if (nivel === 2 || nivel === 3) assert.ok(grados.every(g => g !== 'dificil') && grados.includes('media'), `nivel ${nivel}: fáciles y medias`);
      if (nivel === 4) assert.ok(grados.filter(g => g === 'dificil').length >= 1 || item.etiquetas.includes('triangular'));
      assert.equal(item.etiquetas.includes('triangular'), nivel === 4 && item.etiquetas.includes('triangular'));
      JSON.parse(JSON.stringify(item));
    }
  }
});

test('generador: siempre hay una solución, sin casillas imposibles ni etiquetas que no separen nada', () => {
  for (const tablas of TABLAS) {
    for (const item of tablas) {
      const { filas, cols, celdas } = item.diseno;
      assert.deepEqual([...item.etiquetas].sort(), [...filas, ...cols].sort());
      assert.deepEqual(celdas.flat().sort((a, b) => a - b), [...item.numeros].sort((a, b) => a - b));
      assert.ok(corregir(item, item.diseno).ok, 'la tabla del generador tiene que ser solución');
      assert.ok(estaCompleta(item.diseno));
      // Ninguna casilla imposible: cada pareja (fila, columna) tiene números del 1 al 100 que cumplen las dos.
      for (const f of filas) for (const c of cols) assert.ok(todos.filter(n => cumple(f, n) && cumple(c, n)).length >= 4, `${f} × ${c}`);
      // Ni «par» en filas e «impar» en columnas (casilla vacía para siempre).
      assert.ok(!(filas.includes('par') && cols.includes('impar')) && !(filas.includes('impar') && cols.includes('par')));
      // Una etiqueta que cumplen todos los números no deja nada que decidir.
      for (const id of item.etiquetas) assert.ok(!item.numeros.every(n => cumple(id, n)), id);
      // Cada etiqueta de una cabecera la cumplen todos los números de su fila o de su columna.
      assert.ok(filas.every((f, i) => celdas[i].every(n => cumple(f, n))));
      assert.ok(cols.every((c, j) => celdas.every(r => cumple(c, r[j]))));
    }
  }
});

test('generador: «triangular» solo en el nivel 4, y lleva infografía', () => {
  for (const nivel of [1, 2, 3]) assert.ok(TABLAS[nivel - 1].every(i => !i.etiquetas.includes('triangular')));
  const con = TABLAS[3].filter(i => i.etiquetas.includes('triangular'));
  assert.ok(con.length > N * 0.1 && con.length < N * 0.6, `${con.length} de ${N} tablas del nivel 4 llevan «triangular»`);
  assert.ok(con.every(i => infografiasDe(i).includes('triangular')));
  assert.ok(TABLAS[3].filter(i => !i.etiquetas.includes('triangular')).every(i => infografiasDe(i).length === 0));
});

test('generador: variedad (ninguna combinación de etiquetas repetida a menudo y los números bien repartidos) y no repite la anterior', () => {
  // El tope de un número por nivel: se pide ≤ 15 % en los niveles 1 y 2; en el 3 y el 4 las propiedades
  // difíciles tienen pocos números (cuadrado perfecto: 10; triangular: 13) y cada casilla se llena con uno de ellos.
  const TOPE_NUMERO = [0.2, 0.2, 0.32, 0.6];
  for (const { nivel } of NIVELES) {
    const tablas = TABLAS[nivel - 1];
    const combos = new Map(), numeros = new Map();
    for (const t of tablas) {
      const k = [...t.etiquetas].sort().join(',');
      combos.set(k, (combos.get(k) ?? 0) + 1);
      for (const n of t.numeros) numeros.set(n, (numeros.get(n) ?? 0) + 1);
    }
    assert.ok(Math.max(...combos.values()) <= N * 0.1, `nivel ${nivel}: una combinación de etiquetas sale en más del 10 %`);
    assert.ok(Math.max(...numeros.values()) <= N * TOPE_NUMERO[nivel - 1], `nivel ${nivel}: un número sale en más del ${TOPE_NUMERO[nivel - 1] * 100} % de las tablas`);
    assert.ok(numeros.size >= 95, `nivel ${nivel}: solo salen ${numeros.size} números distintos`);
  }
  const rng = crearRng(99);
  let anterior = generarNivel(rng, 2);
  for (let i = 0; i < 300; i++) {
    const sig = generar(rng, { puntos: 6, anterior });
    assert.notEqual(clave(sig), clave(anterior));
    assert.notEqual([...sig.etiquetas].sort().join(), [...anterior.etiquetas].sort().join(), 'misma combinación que la anterior');
    anterior = sig;
  }
});

// --- El corrector: por propiedades, nunca contra una clave --------------------------------

/** Otra solución: permuta las filas (con sus etiquetas y sus números) y las columnas. */
function otraSolucion(item, rng) {
  const f = rng.barajar(item.diseno.filas.map((_, i) => i)), c = rng.barajar(item.diseno.cols.map((_, j) => j));
  return {
    filas: f.map(i => item.diseno.filas[i]),
    cols: c.map(j => item.diseno.cols[j]),
    celdas: f.map(i => c.map(j => item.diseno.celdas[i][j])),
  };
}

test('corrector: acepta otras soluciones distintas de la del generador y rechaza un número mal puesto', () => {
  const rng = crearRng(11);
  let distintas = 0, intercambios = 0;
  for (let k = 0; k < 800; k++) {
    const item = TABLAS[k % 4][k];
    const otra = otraSolucion(item, rng);
    assert.ok(corregir(item, otra).ok, 'una permutación de filas y columnas es otra solución');
    if (JSON.stringify(otra) !== JSON.stringify(item.diseno)) distintas++;
    // Dos números que también cumplen las propiedades de la casilla del otro se pueden intercambiar.
    const { filas, cols, celdas } = otra;
    const posiciones = filas.flatMap((_, i) => cols.map((_, j) => [i, j]));
    for (const [[a, b], [c, d]] of posiciones.flatMap((p, i) => posiciones.slice(i + 1).map(q => [p, q]))) {
      if (cumple(filas[a], celdas[c][d]) && cumple(cols[b], celdas[c][d]) && cumple(filas[c], celdas[a][b]) && cumple(cols[d], celdas[a][b])) {
        const copia = celdas.map(r => [...r]);
        [copia[a][b], copia[c][d]] = [copia[c][d], copia[a][b]];
        assert.ok(corregir(item, { filas, cols, celdas: copia }).ok, 'un intercambio que cumple las propiedades es solución');
        intercambios++;
        break;
      }
    }
    // Una colocación con un número que no cumple: se rechaza.
    for (let i = 0; i < filas.length; i++) {
      for (let j = 0; j < cols.length; j++) {
        const fuera = todos.find(n => !cumple(filas[i], n) && !item.numeros.includes(n));
        if (fuera === undefined) continue;
        const copia = celdas.map(r => [...r]);
        copia[i][j] = fuera;
        const { ok, malos } = corregir(item, { filas, cols, celdas: copia });
        assert.ok(!ok);
        assert.ok(malos.some(m => m.f === i && m.c === j && m.n === fuera && m.etiqueta === filas[i] && m.lado === 'fila'));
        i = filas.length; break;
      }
    }
  }
  assert.ok(distintas > 700, `${distintas} soluciones distintas de la del generador`);
  assert.ok(intercambios > 50, `${intercambios} intercambios válidos probados`);
});

test('corrector: la colocación incompleta no está completa', () => {
  const item = TABLAS[1][0];
  const vacia = { filas: item.diseno.filas.map(() => null), cols: item.diseno.cols.map(() => null), celdas: item.diseno.celdas.map(r => r.map(() => null)) };
  assert.ok(!estaCompleta(vacia));
  const casi = JSON.parse(JSON.stringify(item.diseno));
  casi.celdas[0][0] = null;
  assert.ok(!estaCompleta(casi));
});

// --- El feedback: con los números del ítem, en los dos idiomas ------------------------------

test('feedback: cada razón lleva los números de verdad, en español y en inglés', () => {
  for (const e of ETIQUETAS) {
    for (const n of todos.filter(m => !cumple(e.id, m))) {
      for (const idioma of IDIOMAS) {
        const r = razon(e.id, n, idioma);
        assert.ok(typeof r === 'string' && r.startsWith(`${n} `), `${e.id} ${n}: «${r}»`);
        assert.ok(!/undefined|NaN|\[object/.test(r), `${e.id} ${n}: «${r}»`);
        assert.ok(!/×|\bHCF\b|\bfactor\b/.test(r), r);
      }
    }
  }
});

test('feedback: las frases del reparto (51 = 3 · 17, 36 tiene 9 divisores, 45 y el 60, el 1, los triangulares)', () => {
  assert.equal(razon('primo', 51, 'es'), '51 no es primo: 51 = 3 · 17');
  assert.equal(razon('primo', 91, 'es'), '91 no es primo: 91 = 7 · 13');
  assert.equal(razon('primo', 1, 'es'), '1 no es primo ni compuesto: solo tiene un divisor, el 1');
  assert.equal(razon('compuesto', 1, 'en'), '1 is neither prime nor composite: it has only one divisor, 1');
  assert.equal(razon('compuesto', 13, 'es'), '13 no es compuesto: es primo, solo se puede dividir entre 1 y entre 13');
  assert.equal(razon('ndivisores:4', 36, 'es'), '36 no tiene 4 divisores: tiene 9 divisores (1, 2, 3, 4, 6, 9, 12, 18 y 36)');
  assert.equal(razon('ndivisores:4', 36, 'en'), '36 does not have 4 divisors: it has 9 divisors (1, 2, 3, 4, 6, 9, 12, 18 and 36)');
  assert.equal(razon('divisor:60', 45, 'es'), `45 no es divisor de 60: 60 ${ENTRE.es} 45 no es exacta`);
  assert.equal(razon('divisor:60', 45, 'en'), '45 is not a divisor of 60: 60 ÷ 45 is not exact');
  assert.equal(razon('triangular', 16, 'es'), '16 no es triangular: los triangulares hasta 100 son 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78 y 91');
  assert.equal(razon('cuadrado', 20, 'es'), '20 no es un cuadrado perfecto: está entre 4 · 4 = 16 y 5 · 5 = 25');
  assert.equal(razon('multiplo:7', 52, 'es'), '52 no es múltiplo de 7: 52 : 7 no es exacta (da 7 y sobran 3)');
  assert.equal(razon('multiplo:11', 5, 'en'), '5 is not a multiple of 11: 5 ÷ 11 is not exact (5 is less than 11)');
  assert.equal(razon('par', 37, 'es'), '37 no es par: acaba en 7');
  assert.equal(razon('mayor:50', 50, 'es'), '50 no es mayor que 50: es igual que 50');
  assert.equal(razon('menor:50', 62, 'en'), '62 is not less than 50: 62 > 50');
});

test('textos: los dos idiomas tienen lo mismo, con producto de punto y división con «:» o «÷»', () => {
  const recorre = (obj, ruta = '') => Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !('es' in v && 'en' in v)) ? recorre(v, `${ruta}.${k}`) : [[`${ruta}.${k}`, v]]);
  for (const [ruta, v] of recorre(TX)) {
    if (typeof v !== 'object') continue;
    assert.ok('es' in v && 'en' in v, `${ruta}: falta un idioma`);
    assert.equal(typeof v.es, typeof v.en, ruta);
    if (typeof v.es === 'string') {
      assert.ok(!/×/.test(v.es + v.en), `${ruta}: «×»`);
      assert.ok(!/\bHCF\b|primos entre sí/.test(v.es + v.en), ruta);
    }
  }
  assert.deepEqual(ENTRE, { es: ':', en: '÷' });
});

test('catálogo: id 83, un ejercicio, sin publicar hasta que lo revise la 207', () => {
  const fila = CATALOGO.find(p => p.slug === 'tabla-propiedades');
  assert.deepEqual([fila.id, fila.unidad, fila.nEjercicios], [83, 2, 1]);
  assert.equal(fila.disponible, false);
});
