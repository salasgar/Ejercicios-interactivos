// Práctica «Resuelve» de la unidad 6: 3000 ítems por ejercicio con semillas fijas.
// Lo que se comprueba, por fuerza bruta y con aritmética entera propia (BigInt, nunca coma flotante):
//   · ej. 1: solo una opción es equivalente a la ecuación y las otras tres tienen otra solución distinta entre sí;
//   · ej. 2: A, C y la solución son exactas y |A| ≥ 2; la cadena de `pasos()` es la esperada;
//   · ej. 3: solución exacta; en «elegir», cuatro opciones distintas por valor y cada mala sale de un error con nombre;
//   · ej. 4: solo el paso marcado deja de salir de la línea anterior (y un tercio no tiene ninguno);
//   · cotas de los números, textos sin ×, %, x², 1x ni «+ −», y los casos reservados de la hoja y del examen no salen.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { Ecuacion, termino, huellaCanonica, ERRORES_TIPICOS } from '../practicas/_comun/algebra.js';
import { Fraccion, fraccion } from '../practicas/_comun/fracciones.js';
import {
  generarPrimerPaso, generarPasoAPaso, generarResuelve, generarResolucion, ecDe, ecuacionAC, solDe, datosDe,
  movimientos, lineasPrevias, huecoMalo, errorHueco, errorSolucion, leerSolucion, erroresDeSolucion,
  esReservada, CASOS_HOJA, HUELLAS_EXAMEN, EJEMPLOS_INTRO, nombreDe, ERRORES_PROPIOS, lineasDeResolucion,
  COEF_MAX, NUM_MAX, NUM_MAX_REDUCIR, SOL_ENTERA_MAX, SOL_NUM_MAX, SOL_DEN_MAX, tipoSol,
} from '../practicas/resuelve/logica.js';
import { TX } from '../practicas/resuelve/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };

// --- Aritmética entera independiente de `algebra.js` ---------------------------------------------
const mcdB = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
/** { A, C, num, den } de un ítem { izq, der } con BigInt: A·x = C, x = C/A irreducible. */
function indep({ izq, der }) {
  const x = ts => ts.filter(t => t.x).reduce((s, t) => s + BigInt(t.c), 0n);
  const n = ts => ts.filter(t => !t.x).reduce((s, t) => s + BigInt(t.c), 0n);
  const A = x(izq) - x(der), C = n(der) - n(izq);
  assert.notEqual(A, 0n);
  let num = C, den = A;
  if (den < 0n) { num = -num; den = -den; }
  const g = mcdB(num, den) || 1n;
  return { A, C, num: num / g, den: den / g };
}
const igualSol = (s, ind) => BigInt(s.num) === ind.num && BigInt(s.den) === ind.den;

const texto = ec => ec.aTexto();
const soloX = datos => [...datos.izq, ...datos.der].every(t => Number.isInteger(t.c));

function cotas(datos, { reducir = false } = {}) {
  for (const t of [...datos.izq, ...datos.der]) {
    assert.ok(Number.isInteger(t.c) && t.c !== 0 || (t.c === 0 && !t.x), `término ${JSON.stringify(t)}`);
    assert.ok(Math.abs(t.c) <= (t.x ? COEF_MAX : (reducir ? NUM_MAX_REDUCIR : NUM_MAX)), `fuera de cota: ${JSON.stringify(t)} en ${JSON.stringify(datos)}`);
  }
}
function cotaSolucion(s) {
  if (s.den === 1) assert.ok(Math.abs(s.num) <= SOL_ENTERA_MAX, `solución ${s.num}`);
  else assert.ok(s.den <= SOL_DEN_MAX && Math.abs(s.num) <= SOL_NUM_MAX, `solución ${s.num}/${s.den}`);
}

// --- Ejercicio 1 ---------------------------------------------------------------------------------

test('ej. 1: una opción buena (la que pasa los términos con el signo cambiado) y tres con otra solución distinta cada una', () => {
  const errores = new Set();
  const tipos = new Set();
  for (const it of lote(generarPrimerPaso, 6001)) {
    const ec = ecDe(it);
    cotas(it);
    const s = ec.resolver();
    assert.ok(s instanceof Fraccion, 'una sola solución');
    cotaSolucion(s);
    tipos.add(tipoSol(s));
    assert.equal(it.opciones.length, 4);
    const buenas = it.opciones.filter(o => ecDe(o).equivalente(ec));
    assert.equal(buenas.length, 1, `${texto(ec)}: ${it.opciones.map(o => texto(ecDe(o))).join(' | ')}`);
    assert.equal(it.opciones[it.buena].error, null);
    assert.ok(ecDe(it.opciones[it.buena]).equivalente(ec));
    // La buena es exactamente la transposición: x a la izquierda, números a la derecha, cambiando el signo.
    assert.equal(ecDe(it.opciones[it.buena]).clave(), movimientos(ec).buena.clave());
    const sols = new Set();
    for (const [i, o] of it.opciones.entries()) {
      if (i === it.buena) continue;
      assert.ok(nombreDe(o.error), `error sin nombre: ${o.error}`);
      errores.add(o.error);
      assert.ok(!ecDe(o).equivalente(ec), `${o.error} sale equivalente en ${texto(ec)}`);
      sols.add(JSON.stringify(ecDe(o).resolver()));
    }
    assert.equal(sols.size, 3, 'tres soluciones distintas entre sí');
    assert.ok(soloX(it));
  }
  assert.deepEqual([...errores].sort(), ['numero-sin-signo', 'pierde-un-termino', 'transponer-sin-signo', 'x-sin-signo']);
  for (const t of ['entera+', 'entera-', 'fraccion+', 'fraccion-']) assert.ok(tipos.has(t), `falta el tipo ${t}`);
});

test('ej. 1: la buena nunca está siempre en el mismo sitio', () => {
  const sitios = [0, 0, 0, 0];
  for (const it of lote(generarPrimerPaso, 6002)) sitios[it.buena]++;
  for (const n of sitios) assert.ok(n > N * 0.18 && n < N * 0.32, `reparto ${sitios}`);
});

// --- Ejercicio 2 ---------------------------------------------------------------------------------

test('ej. 2: A, C y la solución son exactas (BigInt) y la cadena de pasos es la esperada', () => {
  let dos = 0, reducir = 0, cero = 0, frac = 0, neg = 0;
  for (const it of lote(generarPasoAPaso, 6101)) {
    const ind = indep(it);
    cotas(it, { reducir: it.tipo === 'reducir' });
    assert.equal(BigInt(it.A), ind.A);
    assert.equal(BigInt(it.C), ind.C);
    assert.ok(igualSol(solDe(it), ind));
    cotaSolucion(solDe(it));
    assert.ok(Math.abs(it.A) >= 2, 'A = ±1 o 0 no deja el paso de dividir');
    const ec = ecDe(it);
    const pasos = ec.pasos().map(p => p.tipo);
    assert.deepEqual(pasos.filter(t => t !== 'transponer'), ['reducir', 'despejar']);
    assert.ok(pasos.length === 2 || pasos[0] === 'transponer');
    const previas = lineasPrevias(it);
    assert.ok(previas.length === 1 || previas.length === 2);
    for (const e of previas) assert.ok(e.equivalente(ec));
    // Los tres huecos con los valores buenos: ninguno falla; con uno cambiado, ese es el primero que falla.
    const buenos = { A: fraccion(it.A), C: fraccion(it.C), sol: solDe(it) };
    assert.equal(huecoMalo(it, buenos), null);
    assert.equal(huecoMalo(it, { ...buenos, A: fraccion(it.A + 1) }), 'A');
    assert.equal(huecoMalo(it, { ...buenos, C: fraccion(it.C + 1) }), 'C');
    assert.equal(huecoMalo(it, { ...buenos, sol: solDe(it).sumar(1) }), 'sol');
    assert.equal(huecoMalo(it, { ...buenos, sol: buenos.sol.equivalentePor(2) }), null, '6/4 vale como 3/2');
    assert.equal(errorHueco(it, 'A', fraccion(it.A + 1)), 'reduce-mal-las-x');
    assert.equal(errorHueco(it, 'C', fraccion(it.C + 1)), 'reduce-mal-los-numeros');
    if (it.tipo === 'dos') dos++; else reducir++;
    if (solDe(it).num === 0) cero++;
    if (solDe(it).den !== 1) frac++;
    if (solDe(it).num < 0) neg++;
  }
  assert.ok(dos > N * 0.5 && reducir > N * 0.3, `tipos ${dos}/${reducir}`);
  assert.ok(cero > 100 && cero < 400, `x = 0 en ${cero}`);
  assert.ok(frac > N * 0.2 && neg > N * 0.3);
});

// --- Ejercicio 3 ---------------------------------------------------------------------------------

test('ej. 3: solución exacta; «elegir» da cuatro opciones distintas por valor y cada mala sale de un error con nombre', () => {
  let elegir = 0, escribir = 0;
  const errores = new Set();
  for (const it of lote(generarResuelve, 6201)) {
    const ind = indep(it);
    cotas(it);
    assert.ok(igualSol(solDe(it), ind));
    cotaSolucion(solDe(it));
    if (it.modo === 'escribir') { escribir++; assert.equal(it.opciones, undefined); continue; }
    elegir++;
    assert.notEqual(solDe(it).num, 0, 'con x = 0 siempre se escribe');
    assert.equal(it.opciones.length, 4);
    const valores = it.opciones.map(o => fraccion(o.num, o.den));
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(!valores[i].equals(valores[j]), `dos opciones valen lo mismo en ${JSON.stringify(it)}`);
    assert.equal(it.opciones.filter(o => o.error === null).length, 1);
    const ec = ecDe(it);
    for (const [i, o] of it.opciones.entries()) {
      if (o.error === null) { assert.ok(valores[i].equals(solDe(it))); continue; }
      errores.add(o.error);
      assert.ok(nombreDe(o.error));
      // Se calcula con los números del ítem: el valor es el que da ese error.
      const hit = erroresDeSolucion(ec).find(([id]) => id === o.error);
      assert.ok(hit && hit[1].equals(valores[i]), `${o.error} en ${texto(ec)}`);
      assert.equal(errorSolucion(ec, valores[i]), o.error);
    }
  }
  assert.ok(elegir > N * 0.25 && escribir > N * 0.5, `modos ${elegir}/${escribir}`);
  assert.ok(errores.size >= 5, `errores vistos: ${[...errores]}`);
});

test('ej. 3: lo que teclea el alumno se lee por valor (6/4 = 3/2 = 1,5) y los errores se reconocen', () => {
  const v = t => { const r = leerSolucion(t); return r.ok ? r.valor : null; };
  assert.ok(v('3').equals(3));
  assert.ok(v('-5/2').equals(fraccion(-5, 2)));
  assert.ok(v('−5/2').equals(fraccion(-5, 2)));
  assert.ok(v('–5/2').equals(fraccion(-5, 2)));
  assert.ok(v('x = 1,5').equals(fraccion(3, 2)));
  assert.ok(v('1.5').equals(fraccion(3, 2)));
  assert.ok(v('6/4').equals(fraccion(3, 2)));
  assert.ok(v('X=-4').equals(-4));
  for (const malo of ['', '   ', 'abc', '2x', 'x', 'x = x', '3 = 3', '1/0']) assert.equal(v(malo), null, `«${malo}»`);
  assert.ok(leerSolucion('2x').mensaje.es && leerSolucion('2x').mensaje.en);
  const ec = ecDe({ izq: [{ c: 3, x: true }, { c: -4 }], der: [{ c: 5, x: true }, { c: -16 }] });   // x = 6
  assert.equal(errorSolucion(ec, fraccion(6)), null);
  assert.ok(['signo-de-la-solucion', 'signo-al-dividir'].includes(errorSolucion(ec, fraccion(-6))), 'x = -6 es un error de signo');
  const ec2 = ecDe({ izq: [{ c: 1, x: true }, { c: 9 }], der: [{ c: 4 }] });   // x = -5
  assert.equal(errorSolucion(ec2, fraccion(5)), 'signo-de-la-solucion');
  assert.equal(errorSolucion(ec, fraccion(7)), 'otra-respuesta');
});

// --- Ejercicio 4 ---------------------------------------------------------------------------------

test('ej. 4: solo el paso marcado deja de salir de la línea anterior; un tercio no tiene error', () => {
  const malos = [0, 0, 0, 0];
  const errores = new Set();
  for (const it of lote(generarResolucion, 6301)) {
    malos[it.malo]++;
    assert.equal(it.lineas.length, 4);
    const eq = lineasDeResolucion(it);
    for (const e of eq) assert.ok(e.resolver() instanceof Fraccion, 'cada línea tiene una sola solución');
    cotas(it.lineas[0]);
    cotaSolucion(eq[0].resolver());
    const rotos = [1, 2, 3].filter(k => !eq[k].equivalente(eq[k - 1]));
    if (it.malo === 0) {
      assert.deepEqual(rotos, []);
      assert.equal(it.error, null);
      assert.equal(it.correcta, null);
      assert.ok(igualSol(eq[3].resolver(), indep(it.lineas[0])));
      continue;
    }
    assert.deepEqual(rotos, [it.malo], `${eq.map(texto).join(' → ')}`);
    assert.ok(nombreDe(it.error), `error sin nombre: ${it.error}`);
    errores.add(it.error);
    // La línea buena para ese paso sí sale de la anterior; la mala, no.
    assert.ok(ecDe(it.correcta).equivalente(eq[it.malo - 1]));
    assert.ok(!eq[it.malo].equivalente(eq[it.malo - 1]));
    // Desde el paso malo el resto sigue bien a partir de él.
    for (let k = it.malo + 1; k <= 3; k++) assert.ok(eq[k].equivalente(eq[k - 1]));
  }
  assert.ok(malos[0] > N * 0.28 && malos[0] < N * 0.39, `sin error: ${malos[0]}`);
  for (const k of [1, 2, 3]) assert.ok(malos[k] > N * 0.17 && malos[k] < N * 0.26, `paso ${k}: ${malos[k]}`);
  assert.ok(errores.size >= 7, `errores vistos: ${[...errores]}`);
});

// --- Nombres de errores, textos y casos reservados ------------------------------------------------

test('todos los errores propios tienen nombre en los dos idiomas y los de algebra.js también', () => {
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) assert.ok(e.nombre.es && e.nombre.en, id);
  for (const id of ['transponer-sin-signo', 'pasar-factor-restando', 'multiplicar-en-vez-de-dividir', 'invertir-coeficiente', 'signo-al-dividir', 'signo-de-la-solucion']) {
    assert.ok(ERRORES_TIPICOS[id] && nombreDe(id).es && nombreDe(id).en, id);
  }
});

function recorrer(obj, visita, ruta = '') {
  if (typeof obj === 'string') return visita(obj, ruta);
  if (typeof obj === 'function') return visita(obj('11', '22', '33', '44'), ruta);
  for (const [k, v] of Object.entries(obj)) recorrer(v, visita, `${ruta}.${k}`);
}

test('ningún texto de alumno lleva ×, %, x², 1x, «+ −», «x^2» ni dos letras en una ecuación', () => {
  const plano = s => s.replace(/<[^>]+>/g, '');
  const malos = [[/×/, '×'], [/%/, '%'], [/x²|x\^2|x<sup>2/, 'x²'], [/(^|[^\d])1x/, '1x'], [/\+ −|\+ -|− −/, '+ −'], [/eval/, 'eval']];
  const revisar = (s, donde) => { for (const [re, nombre] of malos) assert.ok(!re.test(plano(s)), `«${nombre}» en ${donde}: ${plano(s)}`); };
  recorrer(TX, revisar);
  for (const generar of [generarPrimerPaso, generarPasoAPaso, generarResuelve, generarResolucion]) {
    const rng = crearRng(6401);
    for (let i = 0; i < 1000; i++) {
      const it = generar(rng);
      const ecs = [];
      if (it.opciones && it.opciones[0].izq) it.opciones.forEach(o => ecs.push(ecDe(o)));
      if (it.lineas) it.lineas.forEach(l => ecs.push(ecDe(l)));
      if (it.izq) ecs.push(ecDe(it));
      for (const e of ecs) {
        const t = e.aTexto();
        revisar(t, JSON.stringify(it));
        assert.ok(!/[a-wyz]/i.test(t), `otra letra en ${t}`);
        assert.equal(new Set(t.match(/[a-z]/gi) ?? []).size <= 1, true);
      }
    }
  }
});

test('los casos reservados (hoja en claro, examen por huella) y los ejemplos de las introducciones no salen', () => {
  // Los ejemplos de las introducciones están excluidos siempre.
  assert.equal(esReservada(ecDe({ izq: [{ c: 6, x: true }, { c: -2 }], der: [{ c: 2, x: true }, { c: 14 }] })), true);
  assert.equal(esReservada(ecDe({ izq: [{ c: 4, x: true }, { c: -3 }], der: [{ c: 7, x: true }, { c: -18 }] })), true);
  assert.equal(EJEMPLOS_INTRO.length, 2);
  // La misma ecuación con los términos en otro orden también es la reservada (forma canónica).
  assert.equal(esReservada(ecDe({ izq: [{ c: -2 }, { c: 6, x: true }], der: [{ c: 14 }, { c: 2, x: true }] })), true);
  // Se reserva la mitad de lo que salió con una semilla en claro y la otra mitad por huella; al volver a generar con la
  // misma semilla no puede salir ninguna.
  const generadores = [[generarPrimerPaso, 6501], [generarPasoAPaso, 6502], [generarResuelve, 6503], [generarResolucion, 6504]];
  const ecDeItem = it => (it.lineas ? ecDe(it.lineas[0]) : ecDe(it));
  const hojaAntes = CASOS_HOJA.length;
  try {
    for (const [generar, semilla] of generadores) {
      const rng = crearRng(semilla);
      const vistos = Array.from({ length: 100 }, () => ecDeItem(generar(rng)));
      vistos.forEach((e, i) => { if (i % 2) HUELLAS_EXAMEN.add(huellaCanonica(e)); else CASOS_HOJA.push(e.aTexto()); });
      const rng2 = crearRng(semilla);
      for (let i = 0; i < 600; i++) {
        const e = ecDeItem(generar(rng2));
        assert.ok(!esReservada(e), `salió una reservada: ${e.aTexto()}`);
      }
    }
    assert.ok(HUELLAS_EXAMEN.size > 100 && CASOS_HOJA.length > hojaAntes + 100, `${HUELLAS_EXAMEN.size} huellas, ${CASOS_HOJA.length} de la hoja`);
  } finally {
    CASOS_HOJA.length = hojaAntes;
    HUELLAS_EXAMEN.clear();
  }
});
