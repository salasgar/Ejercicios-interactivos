// Práctica «Suma y resta» de fracciones (reparto-practicas-u2, tarea 104): fuerza bruta con
// 3000 ítems por ejercicio y semilla fija. Mismo denominador y negativas, m.c.m. y equivalentes,
// naturales, partes de un todo que suman menos que 1, una sola línea mal en «caza el error»,
// distractores con error típico con nombre y textos limpios (sin ×, decimales, barras entre
// cifras, mixtos ni variables).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import { fraccion, hayEquivalentes, ERRORES_TIPICOS } from '../practicas/_comun/fracciones.js';
import {
  F, ERRORES_PROPIOS, errorConNombre, generarMismo, generarPasos, generarNaturales, generarQueda, generarCaza,
  resultadoMismo, errorDeMismo, equivalentes, resultadoPasos, corregirPasos, terminosNat, resultadoNat, errorDeNat,
  respuestaQueda, lineaCorrecta, RESERVADOS, MAX_TROZOS_PIZZA, esReservadoMismo, esReservadoPasos, esReservadoQueda,
} from '../practicas/suma-resta/logica.js';
import {
  TX, cuentaMismo, solucionMismo, cuentaPasos, solucionPasos, cuentaNat, solucionNat, enunciadoQueda,
  solucionQueda, explicaOpcion, lineasCaza, explicaCaza, nombreError,
} from '../practicas/suma-resta/textos.js';

const N = 3000;
const IDIOMAS = ['es', 'en'];
const generar = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const mcd = (a, b) => (b === 0 ? Math.abs(a) : mcd(b, a % b));
const mcm = (a, b) => (a / mcd(a, b)) * b;

function limpio(texto, donde) {
  const plano = String(texto).replace(/<[^>]*>/g, '');
  assert.ok(!plano.includes('×'), `× en ${donde}: ${plano}`);
  assert.ok(!/\d[.,]\d/.test(plano), `decimal en ${donde}: ${plano}`);
  assert.ok(!/\d\s*\/\s*\d/.test(plano), `barra como fracción en ${donde}: ${plano}`);
  assert.ok(!/-\d/.test(plano), `guion como signo en ${donde}: ${plano}`);
  assert.ok(!/\(\s*[+−]/.test(plano), `paréntesis con signo en ${donde}: ${plano}`);
  assert.ok(!/undefined|NaN|\[object/.test(plano), `valor sin pintar en ${donde}: ${plano}`);
  assert.ok(!/\d[xyn](?![\p{L}])|(?<![\p{L}\d])[xyn]\s*[=+−·:]|[=+−·:]\s*[xyn](?![\p{L}\d])/u.test(plano), `letra de variable en ${donde}: ${plano}`);
}

// --- Ejercicio 1 ----------------------------------------------------------------------

test('ejercicio 1: mismo denominador, negativas en ≥ 20 % y resultado entero nunca', () => {
  const items = generar(generarMismo, 104001);
  let negativas = 0, irred = 0;
  const errores = new Set();
  for (const it of items) {
    assert.equal(it.a.d, it.b.d);
    assert.ok(it.a.d >= 3 && it.a.d <= 12);
    assert.ok(Math.abs(it.b.n) >= 1 && it.b.n > 0 && it.b.n < it.b.d, 'el segundo término es positivo y propio');
    assert.ok(it.op === '+' || it.op === '-');
    const r = resultadoMismo(it);
    assert.ok(!r.simplificar().esEntera(), JSON.stringify(it));
    if (it.neg) {
      negativas++;
      assert.ok(it.a.n < 0 || r.num < 0, 'una negativa de verdad');
    } else {
      assert.ok(it.a.n > 0 && r.num > 0, 'sin negativas: todo positivo');
    }
    if (it.irred) irred++;
    assert.equal(errorDeMismo(it, r), it.irred && !r.esIrreducible() ? 'sin-simplificar' : null);
    assert.equal(errorDeMismo(it, r.simplificar()), null);
    // los errores se reconocen con su nombre
    if (it.op === '+') {
      const e = ERRORES_TIPICOS['suma-arriba-y-abajo'].fn(F(it.a), F(it.b));
      if (e) { const n = errorDeMismo(it, e); assert.equal(n, 'suma-arriba-y-abajo'); errores.add(n); }
    }
    if (r.num < 0) { const n = errorDeMismo(it, r.opuesta()); assert.equal(n, 'signo-perdido'); errores.add(n); }
    const raro = fraccion(r.num + 1, r.den + 7);
    if (!raro.equals(r)) assert.ok(errorConNombre(errorDeMismo(it, raro)));
  }
  assert.ok(negativas >= N * 0.2 && negativas <= N * 0.3, `negativas: ${negativas}`);
  assert.ok(irred > N * 0.4 && irred < N * 0.6, `irreducible: ${irred}`);
  assert.ok(errores.has('suma-arriba-y-abajo') && errores.has('signo-perdido'));
  assert.ok(items.some(it => it.a.n < 0) && items.some(it => it.neg && it.a.n > 0 && it.op === '-'));
});

// --- Ejercicio 2 ----------------------------------------------------------------------

test('ejercicio 2: el m.c.m., las equivalentes, el reparto múltiplo/no múltiplo y sin negativas', () => {
  const items = generar(generarPasos, 104002);
  let multiplo = 0, dos = 0, tres = 0;
  for (const it of items) {
    const dens = it.fracs.map(f => f.d);
    assert.ok(dens.every(d => d >= 2 && d <= 12));
    assert.equal(it.m, dens.reduce(mcm, 1));
    assert.ok(it.m <= 60);
    assert.ok(it.fracs.every(f => f.n >= 1 && f.n < f.d), 'sin negativas');
    assert.equal(it.ops.length, it.fracs.length - 1);
    const eq = equivalentes(it);
    eq.forEach((x, i) => assert.ok(fraccion(x, it.m).equals(F(it.fracs[i])) && Number.isInteger(x)));
    const r = resultadoPasos(it);
    assert.ok(r.num > 0 && !r.simplificar().esEntera());
    if (it.fracs.length === 2) {
      dos++;
      if (dens[0] % dens[1] === 0 || dens[1] % dens[0] === 0) multiplo++;
    } else tres++;
  }
  assert.ok(multiplo > dos * 0.25 && multiplo < dos * 0.42, `múltiplos: ${multiplo}/${dos}`);
  assert.ok(tres > N * 0.12 && tres < N * 0.28, `con tres fracciones: ${tres}`);
});

test('ejercicio 2: la corrección da por buenos los pasos buenos, uno solo cuenta y nombra el error', () => {
  const vistos = new Set();
  for (const it of generar(generarPasos, 104003)) {
    const eqs = equivalentes(it).map((x, i) => fraccion(x, it.m));
    const r = resultadoPasos(it);
    const buena = { m: it.m, equivs: eqs, res: it.irred ? r.simplificar() : r };
    const c = corregirPasos(it, buena);
    assert.ok(c.acierto && c.mcmBien && c.resBien && c.equivBien.every(Boolean), JSON.stringify(it));
    // un m.c.m. equivocado: error de m.c.m., y las equivalentes con ese denominador no castigan otra vez
    const m2 = it.m * 2;
    const c2 = corregirPasos(it, { m: m2, equivs: it.fracs.map(f => fraccion((f.n * m2) / f.d, m2)), res: buena.res });
    assert.equal(c2.error, 'mcm-equivocado');
    assert.ok(c2.equivBien.every(Boolean));
    vistos.add(c2.error);
    // una equivalente que solo cambia el denominador
    const sinNum = it.fracs.map((f, i) => (i === 0 ? fraccion(f.n, it.m) : eqs[i]));
    if (it.fracs[0].d !== it.m) {
      const c3 = corregirPasos(it, { m: it.m, equivs: sinNum, res: buena.res });
      assert.equal(c3.error, 'amplia-solo-denominador');
      assert.equal(c3.equivBien[0], false);
      vistos.add(c3.error);
    }
    // el resultado simplificado de más o de menos
    if (it.irred && !r.mismaForma(r.simplificar())) {
      assert.equal(corregirPasos(it, { ...buena, res: r }).error, 'sin-simplificar');
      vistos.add('sin-simplificar');
    }
    if (it.fracs.length === 2 && it.ops[0] === '+') {
      const [a, b] = it.fracs.map(F);
      const mal = ERRORES_TIPICOS['suma-arriba-y-abajo'].fn(a, b);
      if (mal) { const c4 = corregirPasos(it, { ...buena, res: mal }); assert.equal(c4.error, 'suma-arriba-y-abajo'); vistos.add(c4.error); }
    }
    // los errores que devuelve tienen nombre
    for (const e of [c2.error]) assert.ok(errorConNombre(e));
  }
  for (const id of ['mcm-equivocado', 'amplia-solo-denominador', 'sin-simplificar', 'suma-arriba-y-abajo']) assert.ok(vistos.has(id), id);
});

// --- Ejercicio 3 ----------------------------------------------------------------------

test('ejercicio 3: positivo salvo en los de resultado negativo (≥ 20 %), la fracción irreducible y el resultado también', () => {
  const items = generar(generarNaturales, 104004);
  let neg = 0;
  const errores = new Set();
  for (const it of items) {
    assert.ok(it.nat >= 1 && it.nat <= 5);
    assert.ok(it.f.n >= 1 && it.f.n < it.f.d && it.f.d >= 2 && it.f.d <= 12);
    assert.equal(mcd(it.f.n, it.f.d), 1);
    const r = resultadoNat(it);
    assert.ok(r.esIrreducible() && !r.esEntera(), JSON.stringify(it));
    if (it.tipo === 'f-nat') { neg++; assert.ok(r.num < 0); } else assert.ok(r.num > 0);
    const { x, op, y } = terminosNat(it);
    assert.ok((x.den === 1) !== (y.den === 1) || x.den === 1 || y.den === 1, 'un término es el natural');
    assert.equal(errorDeNat(it, r), null);
    assert.equal(errorDeNat(it, fraccion(r.num * 2, r.den * 2)), 'sin-simplificar');
    if (r.num < 0) { assert.equal(errorDeNat(it, r.opuesta()), 'signo-perdido'); errores.add('signo-perdido'); }
    const n = ERRORES_TIPICOS['natural-al-numerador'].fn(it.nat, F(it.f), op);
    if (n && !n.equals(r) && !(r.num < 0 && n.equals(r.opuesta()))) { assert.equal(errorDeNat(it, n), 'natural-al-numerador'); errores.add('natural-al-numerador'); }
    const raro = fraccion(r.num + 3, r.den + 5);
    if (!raro.equals(r)) assert.ok(errorConNombre(errorDeNat(it, raro)));
  }
  assert.ok(neg >= N * 0.2 && neg <= N * 0.3, `negativos: ${neg}`);
  for (const t of ['nat+f', 'nat-f', 'f+nat', 'f-nat']) assert.ok(items.some(it => it.tipo === t), t);
  assert.ok(errores.has('signo-perdido') && errores.has('natural-al-numerador'));
});

// --- Ejercicio 4 ----------------------------------------------------------------------

test('ejercicio 4: las partes suman menos que 1, cuatro opciones propias, irreducibles y no equivalentes', () => {
  const items = generar(generarQueda, 104005);
  const preguntas = { queda: 0, gastan: 0 };
  const errores = new Set();
  for (const it of items) {
    const a = F(it.a), b = F(it.b);
    const suma = a.sumar(b);
    assert.ok(suma.num < suma.den && a.num > 0 && b.num > 0, 'las partes suman menos que el todo');
    assert.ok(a.esIrreducible() && b.esIrreducible() && it.a.d !== it.b.d);
    preguntas[it.pregunta]++;
    const buena = it.pregunta === 'queda' ? fraccion(1, 1).restar(suma).simplificar() : suma.simplificar();
    assert.ok(respuestaQueda(it).equals(buena));
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.error === null).length, 1);
    assert.ok(F(it.opciones.find(o => o.error === null)).equals(buena));
    const fr = it.opciones.map(F);
    assert.ok(!hayEquivalentes(fr), 'ninguna opción equivale a otra');
    for (const f of fr) assert.ok(f.num > 0 && f.num < f.den && f.esIrreducible(), 'cada opción es propia e irreducible');
    for (const o of it.opciones) {
      if (o.error === null) continue;
      assert.ok(errorConNombre(o.error) && errorValido(o.error), o.error);
      errores.add(o.error);
    }
  }
  assert.ok(preguntas.queda > 1000 && preguntas.gastan > 1000, JSON.stringify(preguntas));
  assert.ok(errores.size >= 6, [...errores].join());
});

test('ejercicio 4: los distractores son los errores del inventario con los números del ítem', () => {
  const uno = fraccion(1, 1);
  for (const it of generar(generarQueda, 104006)) {
    const a = F(it.a), b = F(it.b), suma = a.sumar(b);
    for (const o of it.opciones) {
      const v = F(o);
      switch (o.error) {
        case null: break;
        case 'gastado-como-queda': assert.ok(v.equals(suma)); break;
        case 'queda-como-gastado': assert.ok(v.equals(uno.restar(suma))); break;
        case 'olvida-restar-la-primera': assert.ok(v.equals(uno.restar(b))); break;
        case 'olvida-restar-la-segunda': assert.ok(v.equals(uno.restar(a))); break;
        case 'suma-arriba-y-abajo': {
          const mal = ERRORES_TIPICOS['suma-arriba-y-abajo'].fn(a, b);
          assert.ok(v.equals(it.pregunta === 'queda' ? uno.restar(mal) : mal)); break;
        }
        case 'suma-solo-cambia-denominador': assert.ok(v.equals(ERRORES_TIPICOS['suma-solo-cambia-denominador'].fn(a, b, '+'))); break;
        case 'suma-multiplicando-denominadores': assert.ok(v.equals(ERRORES_TIPICOS['suma-multiplicando-denominadores'].fn(a, b))); break;
        case 'en-cruz-al-sumar': assert.ok(v.equals(ERRORES_TIPICOS['en-cruz-al-sumar'].fn(a, b))); break;
        default: assert.fail(`error sin comprobar: ${o.error}`);
      }
    }
  }
});

// --- Ejercicio 5 ----------------------------------------------------------------------

test('ejercicio 5: exactamente una línea mal (o ninguna, en la mitad) y el error tiene nombre', () => {
  const items = generar(generarCaza, 104007);
  let sinError = 0;
  const vistos = new Set();
  for (const it of items) {
    const malas = [0, 1, 2].filter(i => !lineaCorrecta(it, i));
    if (it.mala === null) {
      sinError++;
      assert.deepEqual(malas, [], JSON.stringify(it));
      assert.equal(it.error, null);
      assert.deepEqual(it.razones, []);
    } else {
      assert.deepEqual(malas, [it.mala], `${JSON.stringify(it)}`);
      assert.ok(errorConNombre(it.error) && errorValido(it.error));
      assert.equal(it.razones.length, 2);
      assert.ok(it.razones.includes(it.error));
      assert.notEqual(it.razones[0], it.razones[1]);
      vistos.add(it.error);
    }
    const a = F(it.a), b = F(it.b);
    assert.ok(a.sumar(b).num < a.sumar(b).den && it.m <= 60 && it.m === mcm(it.a.d, it.b.d));
    assert.ok(F(it.l3.r).esIrreducible() || it.mala === 2);
  }
  assert.ok(sinError > N * 0.45 && sinError < N * 0.55, `sin error: ${sinError}`);
  assert.deepEqual([...vistos].sort(), ['amplia-solo-denominador', 'simplifica-solo-numerador', 'suma-arriba-y-abajo']);
});

// --- Textos ---------------------------------------------------------------------------

test('textos: sin ×, decimales, barras, mixtos, paréntesis con signo ni variables, en los dos idiomas', () => {
  for (const idioma of IDIOMAS) {
    for (const ej of Object.values(TX)) {
      for (const clave of ['nombre', 'detalle', 'introduccion']) limpio(ej[clave][idioma], `TX ${clave} ${idioma}`);
    }
    for (const it of generar(generarMismo, 104010).slice(0, 800)) {
      limpio(cuentaMismo(it), 'cuenta1');
      limpio(solucionMismo(it, idioma), `solucion1 ${idioma}`);
      limpio(TX.mismo.instruccion[idioma](it.irred), 'instruccion1');
      for (const id of Object.keys(TX.mismo.fallo)) limpio(TX.mismo.fallo[id][idioma](it), `fallo1 ${id}`);
    }
    for (const it of generar(generarPasos, 104011).slice(0, 800)) {
      limpio(cuentaPasos(it), 'cuenta2');
      limpio(solucionPasos(it, idioma), `solucion2 ${idioma}`);
      for (const id of Object.keys(TX.pasos.fallo)) limpio(TX.pasos.fallo[id][idioma](it), `fallo2 ${id}`);
    }
    for (const it of generar(generarNaturales, 104012).slice(0, 800)) {
      limpio(cuentaNat(it), 'cuenta3');
      limpio(solucionNat(it, idioma), `solucion3 ${idioma}`);
    }
    for (const it of generar(generarQueda, 104013).slice(0, 800)) {
      const e = enunciadoQueda(it, idioma);
      limpio(`${e.texto} ${e.pregunta}`, `enunciado4 ${it.ctx} ${idioma}`);
      limpio(solucionQueda(it, idioma), `solucion4 ${idioma}`);
      for (const o of it.opciones) if (o.error) { const x = explicaOpcion(it, o, idioma); assert.ok(x.length > 10, o.error); limpio(x, `explica4 ${o.error}`); }
    }
    for (const it of generar(generarCaza, 104014).slice(0, 800)) {
      for (const l of lineasCaza(it)) limpio(l, 'linea5');
      limpio(explicaCaza(it, idioma), `explica5 ${idioma}`);
      for (const r of it.razones) limpio(nombreError(r, idioma), `razon5 ${r}`);
    }
  }
});

test('textos: cada error que puede salir tiene su frase en los dos idiomas', () => {
  for (const id of ['suma-arriba-y-abajo', 'signo-perdido', 'signo-del-primero', 'sin-simplificar', 'otro-error']) assert.ok(TX.mismo.fallo[id].es && TX.mismo.fallo[id].en, id);
  for (const id of ['mcm-equivocado', 'amplia-solo-denominador', 'equivalente-equivocada', 'suma-arriba-y-abajo', 'en-cruz-al-sumar', 'suma-solo-cambia-denominador', 'suma-multiplicando-denominadores', 'sin-simplificar', 'otro-error']) assert.ok(TX.pasos.fallo[id].es && TX.pasos.fallo[id].en, id);
  for (const id of ['natural-al-numerador', 'suma-arriba-y-abajo', 'signo-perdido', 'sin-simplificar', 'otro-error']) assert.ok(TX.nat.fallo[id].es && TX.nat.fallo[id].en, id);
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) assert.ok(e.nombre.es && e.nombre.en && errorValido(id), id);
  for (const ej of [TX.mismo, TX.pasos, TX.nat, TX.queda, TX.caza]) {
    for (const campo of ['nombre', 'detalle', 'introduccion']) assert.ok(typeof ej[campo].es === 'string' && typeof ej[campo].en === 'string');
  }
  assert.deepEqual([TX.mismo, TX.pasos, TX.nat, TX.queda, TX.caza].map(e => e.nombre.es), ['Mismo denominador', 'Distinto denominador, paso a paso', 'Con naturales', '¿Qué queda?', 'Caza el error']);
});

// --- Realismo de la pizza (acta del 26-10, punto j: 3-15 trozos) ----------------------

test('ejercicio 4: una pizza solo con partes que caben en 12 trozos iguales como mucho', () => {
  const items = generar(generarQueda, 104031);
  const pizzas = items.filter(it => it.ctx === 'pizza');
  assert.ok(pizzas.length > 300, `casi no sale la pizza: ${pizzas.length}`);
  assert.equal(MAX_TROZOS_PIZZA, 12);
  for (const it of pizzas) {
    const trozos = mcm(it.a.d, it.b.d);
    assert.ok(trozos >= 3 && trozos <= MAX_TROZOS_PIZZA, `pizza de ${trozos} trozos: ${JSON.stringify(it)}`);
  }
  // Los demás contextos siguen usando todos los denominadores (un m.c.m. grande es creíble con dinero, litros o km).
  assert.ok(items.some(it => it.ctx !== 'pizza' && mcm(it.a.d, it.b.d) > 15));
});

// --- Casos reservados para el examen (regla 9) ---------------------------------------

test('los casos reservados para el examen no salen nunca (ejercicios 1, 2 y 4)', () => {
  assert.ok(generar(generarMismo, 104032).every(it => !esReservadoMismo(it)));
  assert.ok(generar(generarPasos, 104033).every(it => !esReservadoPasos(it)));
  assert.ok(generar(generarQueda, 104034).every(it => !esReservadoQueda(it)));
  // El detector reconoce los casos con las formas con que podrían salir.
  const f = (n, d) => ({ n, d });
  assert.ok(esReservadoPasos({ fracs: [f(3, 10), f(5, 8)], ops: ['+'] }));
  assert.ok(esReservadoPasos({ fracs: [f(5, 8), f(3, 10)], ops: ['+'] }));
  assert.ok(!esReservadoPasos({ fracs: [f(3, 10), f(5, 8)], ops: ['-'] }));
  assert.ok(esReservadoPasos({ fracs: [f(5, 9), f(2, 15)], ops: ['-'] }));
  assert.ok(!esReservadoPasos({ fracs: [f(2, 15), f(5, 9)], ops: ['-'] }));
  assert.ok(esReservadoPasos({ fracs: [f(1, 12), f(5, 18), f(1, 4)], ops: ['+', '-'] }));
  assert.ok(esReservadoMismo({ a: f(4, 15), b: f(7, 15), op: '+' }));
  assert.ok(esReservadoMismo({ a: f(17, 20), b: f(9, 20), op: '-' }));
  assert.ok(esReservadoQueda({ a: f(5, 12), b: f(1, 3) }));
  assert.ok(!esReservadoQueda({ a: f(1, 3), b: f(1, 4) }));
  assert.equal(RESERVADOS.pasos.length, 4);
});

test('ejercicio 4: si lo que queda no es irreducible, el paso a paso lo simplifica', () => {
  const it = { ctx: 'dinero', pregunta: 'queda', a: { n: 1, d: 4 }, b: { n: 1, d: 4 + 0 }, opciones: [] };
  const item = { ...it, a: { n: 1, d: 5 }, b: { n: 3, d: 10 } };   // 1 − 1/2 = 1/2: 10/10 − 5/10 = 5/10 = 1/2
  for (const idioma of IDIOMAS) {
    const t = solucionQueda(item, idioma).replace(/<[^>]*>/g, '');
    assert.ok(/5\s*10\s*=\s*1\s*2/.test(t.replace(/\s+/g, ' ')), `sin el paso de simplificar: ${t}`);
  }
});
