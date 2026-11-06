// Práctica «La fracción de una cantidad» (reparto-practicas-u2, tarea 103): fuerza bruta con
// 3000 ítems por ejercicio y semilla fija. Cotas de realismo por contexto, cantidad múltiplo
// del denominador, respuesta irreducible, distractores con error típico con nombre, ninguna
// opción que valga lo mismo que otra y textos limpios (sin ×, sin decimales, sin barra como
// fracción, sin fracciones negativas ni mixtas, sin letras de variable).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import { fraccion, hayEquivalentes, ERRORES_TIPICOS, htmlFraccion } from '../practicas/_comun/fracciones.js';
import {
  F, RESERVADOS, esReservadoProblema, CONTEXTOS, IDS_CONTEXTO, GRUPOS, IDS_GRUPO, ESCENARIOS, VARIANTES, ERRORES_PROPIOS,
  enCota, totalesPosibles, errorConNombre, generarCalculo, generarContexto, generarParte, generarProblema,
  errorDeCalculo, errorDeParte, respuestaParte, respuestaProblema, cotaDe, gastosDe,
  esCasoExamenCalculo, esCasoExamenParte, esCasoExamenProblema,
} from '../practicas/fraccion-de/logica.js';
import {
  TX, FRASES, GRUPOS_TX, PROBLEMAS, enunciadoContexto, enunciadoParte, enunciadoProblema,
  solucionProblema, explicaOpcion,
} from '../practicas/fraccion-de/textos.js';

const N = 3000;
const IDIOMAS = ['es', 'en'];
const generar = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));

// Todo texto que ve el alumno: sin ×, sin decimales, sin barra entre cifras (la fracción lleva raya),
// sin guion delante de una cifra (no hay negativas), sin número mixto y sin letras de variable.
function limpio(texto, donde) {
  const plano = String(texto).replace(/<[^>]*>/g, '');
  assert.ok(!plano.includes('×'), `× en ${donde}: ${plano}`);
  assert.ok(!/\d[.,]\d/.test(plano), `decimal en ${donde}: ${plano}`);
  assert.ok(!/\d\s*\/\s*\d/.test(plano), `barra como fracción en ${donde}: ${plano}`);
  assert.ok(!/-\d/.test(plano), `guion como signo en ${donde}: ${plano}`);
  assert.ok(!/\d\s+\d+\s*\/\s*\d/.test(plano), `número mixto en ${donde}: ${plano}`);
  assert.ok(!/\d[xyn](?![\p{L}])|(?<![\p{L}\d])[xyn]\s*[=+−·:]|[=+−·:]\s*[xyn](?![\p{L}\d])/u.test(plano), `letra de variable en ${donde}: ${plano}`);
  assert.ok(!/undefined|NaN|\[object/.test(plano), `valor sin pintar en ${donde}: ${plano}`);
}

// --- Cotas ---------------------------------------------------------------------------

test('cada contexto tiene cota, unidad y frases en los dos idiomas, y las cotas son las del acta', () => {
  for (const ctx of IDS_CONTEXTO) {
    const c = CONTEXTOS[ctx];
    assert.ok(c.min <= c.max && c.dens.length > 0, ctx);
    assert.ok(c.unidad.es && c.unidad.en, ctx);
    for (const idioma of IDIOMAS) {
      assert.equal(typeof FRASES[ctx][idioma].texto, 'function', `${ctx} ${idioma}`);
      assert.equal(typeof FRASES[ctx][idioma].pregunta, 'function', `${ctx} ${idioma}`);
    }
  }
  const cota = (id, min, max) => assert.deepEqual([CONTEXTOS[id].min, CONTEXTOS[id].max], [min, max], id);
  cota('deposito', 20, 90);       // depósito de coche
  cota('garrafa', 5, 50);         // garrafa hasta 50 L
  assert.ok(CONTEXTOS.botella.max <= 3000);   // botella hasta 3 L = 3000 ml
  cota('clase', 12, 36);
  cota('instituto', 200, 3000);
  cota('pizza', 3, 15);
  assert.ok(CONTEXTOS.ahorro.max <= 2000);
  assert.ok(CONTEXTOS.bici.max <= 50);
  assert.ok(CONTEXTOS.coche.max <= 1000);
  cota('hora', 60, 60);
  assert.deepEqual(CONTEXTOS.hora.dens, [2, 3, 4, 6, 12]);   // medias, tercios, cuartos, sextos y doceavos (no quintos ni décimos)
  assert.deepEqual(CONTEXTOS.botella.totales, [200, 250, 400, 500, 750, 1000, 1500, 2000, 2500, 3000]);   // acta del 26-10, punto j
  for (const [variante, esc] of Object.entries(ESCENARIOS)) {
    for (const [id, c] of Object.entries(esc)) {
      assert.ok(c.min <= c.max && c.unidad.es && c.unidad.en, `${variante}.${id}`);
      for (const idioma of IDIOMAS) assert.equal(typeof PROBLEMAS[variante][id][idioma].texto, 'function', `${variante}.${id} ${idioma}`);
    }
  }
  for (const g of IDS_GRUPO) for (const idioma of IDIOMAS) assert.equal(typeof GRUPOS_TX[g][idioma].texto, 'function', `${g} ${idioma}`);
});

test('totalesPosibles y enCota: múltiplos del denominador dentro de la cota y del paso', () => {
  for (const ctx of IDS_CONTEXTO) {
    for (const d of CONTEXTOS[ctx].dens) {
      for (const t of totalesPosibles(CONTEXTOS[ctx], d)) {
        assert.ok(enCota(CONTEXTOS[ctx], t) && t % d === 0, `${ctx} ${d} ${t}`);
      }
    }
  }
  assert.ok(!enCota(CONTEXTOS.clase, 11) && !enCota(CONTEXTOS.clase, 37) && !enCota(CONTEXTOS.clase, 24.5));
  assert.ok(!enCota(CONTEXTOS.ahorro, 105));
});

// --- Ejercicio 1: calcula ------------------------------------------------------------

test('ejercicio 1: la cantidad es múltiplo del denominador, el resultado entero y la fracción propia', () => {
  const items = generar(generarCalculo, 103001);
  const vistos = new Set();
  for (const it of items) {
    assert.ok(it.n >= 1 && it.n < it.d, JSON.stringify(it));
    assert.equal(it.total % it.d, 0);
    assert.ok(it.total >= 2 * it.d && it.total <= 200, JSON.stringify(it));
    assert.equal(it.resultado, (it.total / it.d) * it.n);
    assert.ok(it.resultado >= 2 && it.resultado < it.total);
    assert.ok(F(it).multiplicar(it.total).esEntera() && F(it).multiplicar(it.total).aEntero() === it.resultado);
    vistos.add(`${it.n}/${it.d}:${it.total}`);
  }
  assert.ok(vistos.size > 500, `poca variedad: ${vistos.size}`);
  assert.ok(items.some(it => it.n === 1) && items.some(it => it.n > 1));
  for (const d of [7, 9, 12]) assert.ok(items.some(it => it.d === d), `falta el denominador ${d}`);
});

test('ejercicio 1: cada resultado equivocado típico se reconoce con su nombre; el bueno no es error', () => {
  const nombres = new Set();
  for (const it of generar(generarCalculo, 103002)) {
    assert.equal(errorDeCalculo(it, it.resultado), null);
    const f = F(it);
    for (const id of ['fraccion-de-al-reves', 'se-queda-en-la-unitaria', 'multiplica-por-el-denominador']) {
      const r = ERRORES_TIPICOS[id].fn(f, it.total);
      if (r && r.esEntera() && r.aEntero() !== it.resultado) {
        const e = errorDeCalculo(it, r.aEntero());
        assert.ok(errorConNombre(e), `${id}: ${e}`);
        nombres.add(e);
        assert.notEqual(e, 'otro-error', `${id} con ${JSON.stringify(it)} no se reconoce`);
      }
    }
    // Multiplicar sin dividir se reconoce (o, si da lo mismo que otro error de la lista, se llama como él).
    if (it.n > 1) {
      const e = errorDeCalculo(it, it.total * it.n);
      assert.notEqual(e, 'otro-error');
      nombres.add(e);
    }
    assert.equal(errorDeCalculo(it, it.resultado + 1), 'otro-error');
    assert.ok(errorValido(errorDeCalculo(it, it.resultado + 1)));
  }
  for (const id of ['fraccion-de-al-reves', 'se-queda-en-la-unitaria', 'multiplica-por-el-denominador', 'multiplica-sin-dividir']) {
    assert.ok(nombres.has(id), `nunca salió ${id}`);
  }
});

// --- Ejercicio 2: con contexto -------------------------------------------------------

test('ejercicio 2: cada ítem cabe en la cota de su contexto y da un resultado entero menor que el total', () => {
  const items = generar(generarContexto, 103003);
  const porContexto = {};
  for (const it of items) {
    const cfg = CONTEXTOS[it.ctx];
    assert.ok(enCota(cfg, it.total), `${it.ctx}: ${it.total}`);
    assert.ok(cfg.dens.includes(it.d), `${it.ctx}: denominador ${it.d}`);
    assert.equal(it.total % it.d, 0);
    assert.ok(it.n >= 1 && it.n < it.d);
    assert.equal(it.resultado, (it.total / it.d) * it.n);
    assert.ok(Number.isInteger(it.resultado) && it.resultado >= 1 && it.resultado < it.total);
    porContexto[it.ctx] = (porContexto[it.ctx] ?? 0) + 1;
  }
  for (const ctx of IDS_CONTEXTO) assert.ok(porContexto[ctx] > 100, `${ctx} casi no sale: ${porContexto[ctx]}`);
  // Casos concretos de la regla de realismo: nada fuera de la cota por muy raro que sea.
  assert.ok(items.every(it => it.ctx !== 'hora' || it.total === 60));
  assert.ok(items.every(it => it.ctx !== 'pizza' || (it.total >= 3 && it.total <= 15)));
  assert.ok(items.every(it => it.ctx !== 'deposito' || (it.total >= 20 && it.total <= 90)));
  // La botella solo tiene los tamaños del acta; la hora solo las fracciones de hora de uso corriente.
  const botellas = items.filter(it => it.ctx === 'botella');
  assert.ok(botellas.length > 100 && botellas.every(it => CONTEXTOS.botella.totales.includes(it.total)));
  assert.ok(items.filter(it => it.ctx === 'hora').every(it => [2, 3, 4, 6, 12].includes(it.d)));
  // En un problema la fracción del enunciado es irreducible.
  assert.ok(items.every(it => F(it).esIrreducible()), 'fracción sin simplificar en el ejercicio 2');
});

// --- Casos reservados para el examen (regla 9) ---------------------------------------

test('los casos reservados para el examen no salen nunca (ejercicios 1-4)', () => {
  // Las hojas de la unidad (en claro): las tres de siempre y las que añadió la reabierta del 30-10.
  for (const caso of [[3, 4, 44], [5, 8, 56], [4, 9, 72], [1, 3, 27], [1, 4, 52], [2, 3, 27], [5, 6, 42], [3, 8, 64], [7, 10, 90], [3, 7, 28]]) {
    assert.ok(RESERVADOS.fraccionDe.some(r => r.join() === caso.join()), `falta ${caso} en RESERVADOS.fraccionDe`);
  }
  for (const caso of [[15, 27], [6, 20], [14, 20]]) {
    assert.ok(RESERVADOS.parte.some(r => r.join() === caso.join()), `falta ${caso} en RESERVADOS.parte`);
  }
  const reservado = it => RESERVADOS.fraccionDe.some(([n, d, t]) => it.n === n && it.d === d && it.total === t);
  for (const [i, fn] of [generarCalculo, generarContexto].entries()) {
    assert.ok(generar(fn, 103020 + i).every(it => !reservado(it)));
  }
  assert.ok(generar(generarParte, 103022).every(it => !RESERVADOS.parte.some(([p, t]) => it.parte === p && it.total === t)));
  assert.ok(generar(generarProblema, 103023).every(it => !esReservadoProblema(it)));
  // El detector reconoce los casos reservados con las formas con que podrían salir.
  const base = { esc: 'x', opciones: [] };
  assert.ok(esReservadoProblema({ ...base, variante: 'parte', total: 56, f1: { n: 5, d: 8 }, dato: 35 }));
  assert.ok(esReservadoProblema({ ...base, variante: 'restante', total: 36, f1: { n: 5, d: 12 }, dato: 21 }));
  assert.ok(esReservadoProblema({ ...base, variante: 'dos', total: 150, f1: { n: 1, d: 5 }, f2: { n: 3, d: 10 } }));
  assert.ok(esReservadoProblema({ ...base, variante: 'dos', total: 150, f1: { n: 3, d: 10 }, f2: { n: 1, d: 5 } }));
  assert.ok(esReservadoProblema({ ...base, variante: 'queda', total: 44, f1: { n: 3, d: 4 } }));
  assert.ok(!esReservadoProblema({ ...base, variante: 'queda', total: 40, f1: { n: 3, d: 4 } }));
  // Casos nuevos de las hojas (ejercicio 4): 3/7 y 96, 5/9 y 12, 2/3 y 18, 3/7 y 36, y 2/9+1/6 de 180.
  assert.ok(esReservadoProblema({ ...base, variante: 'parte', total: 224, f1: { n: 3, d: 7 }, dato: 96 }));
  assert.ok(esReservadoProblema({ ...base, variante: 'restante', total: 27, f1: { n: 5, d: 9 }, dato: 12 }));
  assert.ok(esReservadoProblema({ ...base, variante: 'parte', total: 27, f1: { n: 2, d: 3 }, dato: 18 }));
  assert.ok(esReservadoProblema({ ...base, variante: 'restante', total: 84, f1: { n: 3, d: 7 }, dato: 36 }));
  assert.ok(esReservadoProblema({ ...base, variante: 'dos', total: 180, f1: { n: 2, d: 9 }, f2: { n: 1, d: 6 } }));
});

// --- Casos de examen (huella FNV-1a; regla nueva de la reabierta del 30-10) -----------

test('los casos de examen no salen nunca (por huella), y la detección no depende del orden', () => {
  for (const [i, fn] of [generarCalculo, generarContexto].entries()) {
    assert.ok(generar(fn, 103900 + i).every(it => !esCasoExamenCalculo(it.n, it.d, it.total)), `ejercicio ${i === 0 ? 1 : 2}`);
  }
  assert.ok(generar(generarParte, 103902).every(it => !esCasoExamenParte(it.parte, it.tipo === 'partes' ? it.otra : it.total - it.parte)));
  assert.ok(generar(generarProblema, 103903).every(it => !esCasoExamenProblema(it)));
  // Ejercicio 4 (reabierta del 2-11): 3000 ítems de cualquier variante, en tres semillas; ninguno es caso de examen
  // (las seis huellas de U4-1A-01 con la clave de `queda` incluidas: el examen pregunta la parte y la práctica lo que queda).
  for (const semilla of [103910, 103911, 103912]) {
    const rng = crearRng(semilla);
    for (let i = 0; i < 1000; i++) assert.ok(!esCasoExamenProblema(generarProblema(rng)), `ítem ${i}, semilla ${semilla}`);
  }
  // Ejercicio 3: la huella no depende de qué parte se dé primero (pareja sin orden natural).
  assert.equal(esCasoExamenParte(3, 17), esCasoExamenParte(17, 3));
  assert.equal(esCasoExamenParte(17, 3), esCasoExamenParte(17, 3));
  // Ejercicio 4, variante 'dos': no depende del orden en que se dan las dos fracciones.
  const base = { esc: 'x', opciones: [] };
  const a = { ...base, variante: 'dos', total: 999, f1: { n: 1, d: 3 }, f2: { n: 1, d: 4 } };
  const b = { ...base, variante: 'dos', total: 999, f1: { n: 1, d: 4 }, f2: { n: 1, d: 3 } };
  assert.equal(esCasoExamenProblema(a), esCasoExamenProblema(b));
});

// Reabierta del 6-11: cada fracción SUELTA con su total cuenta (el primer paso de un problema de examen), en los
// ejercicios 1, 2 y 4 `dos`; y el ahorro del ejercicio 4 gasta cantidades creíbles.
test('ejercicios 1, 2 y 4: una fracción suelta con su total, si es de un problema de examen, tampoco sale (3000 ítems por ejercicio)', () => {
  // La detección no expone casos: lo que es caso en `queda` (fracción|total) lo es también en `dos`, en cualquier posición,
  // y en los ejercicios 1 y 2 (que sobre-excluyen a propósito).
  const base = { esc: 'x', opciones: [] };
  let hay = 0;
  for (let d = 2; d <= 12; d++) for (let n = 1; n < d; n++) for (let total = 2; total <= 3000; total++) {
    if (!esCasoExamenProblema({ ...base, variante: 'queda', total, f1: { n, d } })) continue;
    hay++;
    assert.ok(esCasoExamenProblema({ ...base, variante: 'dos', total, f1: { n, d }, f2: { n: 1, d: 99 } }), `dos, primera: ${n}/${d} ${total}`);
    assert.ok(esCasoExamenProblema({ ...base, variante: 'dos', total, f1: { n: 1, d: 99 }, f2: { n, d } }), `dos, segunda: ${n}/${d} ${total}`);
    assert.ok(esCasoExamenCalculo(n, d, total), `ejercicio 1-2: ${n}/${d} ${total}`);
  }
  assert.ok(hay >= 6, `el filtro tiene que conocer los casos de U4-1A-01, 2A-02 y 3A-04 (${hay})`);
  for (const semilla of [106030, 106031, 106032]) {
    for (const it of generar(generarCalculo, semilla)) assert.ok(!esCasoExamenCalculo(it.n, it.d, it.total));
    for (const it of generar(generarContexto, semilla)) assert.ok(!esCasoExamenCalculo(it.n, it.d, it.total));
    for (const it of generar(generarProblema, semilla)) {
      assert.ok(!esCasoExamenProblema(it));
      if (it.variante === 'dos') for (const f of [it.f1, it.f2]) assert.ok(!esCasoExamenProblema({ ...base, variante: 'queda', total: it.total, f1: f }), JSON.stringify(it));
    }
  }
});

test('ejercicio 4, ahorro: cada compra cabe en su gasto máximo (regalo y ropa, nunca cientos de euros)', () => {
  for (const v of ['queda', 'dos']) assert.ok(ESCENARIOS[v].ahorro.gastoMax <= 250, `${v}.ahorro sin gastoMax creíble`);
  let vistos = 0;
  for (const semilla of [106040, 106041, 106042]) {
    for (const it of generar(generarProblema, semilla)) {
      if (it.esc !== 'ahorro' || (it.variante !== 'queda' && it.variante !== 'dos')) continue;
      vistos++;
      for (const g of gastosDe(it)) assert.ok(g >= 1 && g <= ESCENARIOS[it.variante].ahorro.gastoMax, `${it.variante}.ahorro gasta ${g} € de ${it.total}: ${JSON.stringify(it)}`);
    }
  }
  assert.ok(vistos > 200, `salen pocos ítems de ahorro (${vistos})`);
  for (const v of ['queda', 'dos']) {
    const textos = [PROBLEMAS[v].ahorro.es.texto(500, '1/5', '1/4'), PROBLEMAS[v].ahorro.en.texto(500, '1/5', '1/4')].join(' ');
    assert.ok(!/libro|book/i.test(textos), 'el libro de cientos de euros vuelve');
  }
});

// --- Ejercicio 3: ¿qué fracción es? --------------------------------------------------

test('ejercicio 3: la parte es menor que el total, dentro de la cota del grupo, y la respuesta es la irreducible', () => {
  const items = generar(generarParte, 103004);
  let simplificables = 0;
  for (const it of items) {
    const g = GRUPOS[it.ctx];
    assert.equal(it.tipo, g.tipo);
    assert.ok(it.parte >= 1 && it.parte < it.total, JSON.stringify(it));
    assert.ok(it.total >= g.min && it.total <= g.max, JSON.stringify(it));
    if (it.tipo === 'partes') assert.equal(it.parte + it.otra, it.total);
    // Nunca 1 de nada: con 1 el plural del enunciado («1 pegatinas», «1 chicas») no concuerda.
    assert.ok(it.parte >= 2 && (it.tipo !== 'partes' || it.otra >= 2), JSON.stringify(it));
    const r = respuestaParte(it);
    assert.ok(r.esIrreducible() && r.equals(fraccion(it.parte, it.total)));
    if (mcd(it.parte, it.total) > 1) simplificables++;
    // El bueno no es error; una equivalente sin simplificar, sí; el error típico se nombra.
    assert.equal(errorDeParte(it, r), null);
    if (mcd(it.parte, it.total) > 1) assert.equal(errorDeParte(it, fraccion(it.parte, it.total)), 'sin-simplificar');
    const e = ERRORES_TIPICOS['parte-entre-el-resto'].fn(it.parte, it.total);
    assert.ok(e && !e.equals(r));
    assert.equal(errorDeParte(it, e), 'parte-entre-el-resto');
  }
  assert.ok(simplificables > N * 0.75 && simplificables < N, `simplificables: ${simplificables}`);
  assert.ok(items.some(it => it.tipo === 'partes') && items.some(it => it.tipo === 'total'));
});

test('ejercicio 3: «sin simplificar» y «otro error» no se confunden con el bueno', () => {
  const it = { ctx: 'andando', tipo: 'total', parte: 18, total: 30 };
  assert.equal(errorDeParte(it, fraccion(3, 5)), null);
  assert.equal(errorDeParte(it, fraccion(18, 30)), 'sin-simplificar');
  assert.equal(errorDeParte(it, fraccion(6, 10)), 'sin-simplificar');
  assert.equal(errorDeParte(it, fraccion(18, 12)), 'parte-entre-el-resto');
  assert.equal(errorDeParte(it, fraccion(3, 4)), 'otro-error');
  const ya = { ctx: 'andando', tipo: 'total', parte: 7, total: 20 };
  assert.equal(errorDeParte(ya, fraccion(7, 20)), null);
});

// --- Ejercicio 4: el problema --------------------------------------------------------

/** La respuesta buena recalculada desde cero con los datos del ítem (no con el generador). */
function respuestaIndependiente(it) {
  const T = it.total;
  if (it.variante === 'queda') return T - (T / it.f1.d) * it.f1.n;
  if (it.variante === 'dos') return T - (T / it.f1.d) * it.f1.n - (T / it.f2.d) * it.f2.n;
  // parte y restante: el total es lo que hay que hallar
  return T;
}

test('ejercicio 4: cuatro opciones, una buena, distintas y sin dos equivalentes', () => {
  const items = generar(generarProblema, 103005);
  const variantes = {};
  for (const it of items) {
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.error === null).length, 1);
    assert.equal(respuestaProblema(it), respuestaIndependiente(it), JSON.stringify(it));
    // ninguna opción vale lo mismo que otra: las cantidades, distintas; las fracciones, no equivalentes; y una fracción no es una cantidad
    const cantidades = it.opciones.filter(o => o.tipo === 'cantidad').map(o => o.v);
    assert.equal(new Set(cantidades).size, cantidades.length, JSON.stringify(it.opciones));
    const fracciones = it.opciones.filter(o => o.tipo === 'fraccion').map(F);
    assert.ok(!hayEquivalentes(fracciones));
    for (const f of fracciones) assert.ok(!f.esEntera() && f.esPropia(), 'la fracción-opción es propia');
    // cada distractor sale de un error con nombre y es creíble
    for (const o of it.opciones) {
      if (o.error === null) continue;
      assert.ok(errorConNombre(o.error), o.error);
      assert.ok(errorValido(o.error));
    }
    variantes[it.variante] = (variantes[it.variante] ?? 0) + 1;
  }
  for (const v of VARIANTES) assert.ok(variantes[v] > 300, `${v}: ${variantes[v]}`);
});

test('ejercicio 4: el total en la cota, todo entero ≥ 2, partes de un todo que suman menos que 1, «lo que queda» ≥ 0', () => {
  for (const it of generar(generarProblema, 103006)) {
    const cfg = cotaDe(it);
    assert.ok(Number.isInteger(it.total) && it.total >= cfg.min && it.total <= cfg.max && it.total % cfg.paso === 0, JSON.stringify(it));
    assert.equal(it.total % it.f1.d, 0);
    assert.ok(it.f1.n >= 1 && it.f1.n < it.f1.d);
    if (it.variante === 'dos') {
      assert.equal(it.total % it.f2.d, 0);
      const suma = F(it.f1).sumar(F(it.f2));
      assert.ok(suma.num < suma.den, 'las dos partes suman menos que el todo');
      assert.ok(respuestaProblema(it) >= 2);
      assert.ok(it.f1.d !== it.f2.d);
    }
    if (it.variante === 'queda') assert.ok(respuestaProblema(it) >= 2 && respuestaProblema(it) < it.total);
    if (it.variante === 'parte') assert.equal(it.dato, (it.total / it.f1.d) * it.f1.n);
    if (it.variante === 'restante') assert.equal(it.dato, (it.total / it.f1.d) * (it.f1.d - it.f1.n));
    for (const o of it.opciones) {
      if (o.tipo !== 'cantidad') continue;
      assert.ok(Number.isInteger(o.v) && o.v >= 2, `opción ${o.v}`);
      if (it.variante === 'queda' || it.variante === 'dos') assert.ok(o.v < it.total, `una opción de «lo que queda» no puede pasar del total: ${o.v} ≥ ${it.total}`);
      else {
        // Se pregunta por el total: toda opción dentro de la cota del escenario y mayor que el dato.
        assert.ok(o.v >= cfg.min && o.v <= cfg.max, `${it.variante}.${it.esc}: opción de «el total» fuera de la cota ${cfg.min}-${cfg.max}: ${o.v}`);
        assert.ok(o.v > it.dato, `${it.variante}.${it.esc}: la opción ${o.v} no supera al dato ${it.dato}`);
      }
    }
    // En un problema la fracción del enunciado va irreducible.
    assert.ok(F(it.f1).esIrreducible() && (!it.f2 || F(it.f2).esIrreducible()), JSON.stringify(it));
  }
});

test('ejercicio 4: los distractores son los errores que dicen los inventarios, con los números del ítem', () => {
  const vistos = new Set();
  for (const it of generar(generarProblema, 103007)) {
    const T = it.total, { n, d } = it.f1;
    for (const o of it.opciones) {
      if (o.error === null) continue;
      vistos.add(o.error);
      if (o.tipo === 'fraccion') {
        const q = it.variante === 'queda' ? fraccion(d - n, d) : fraccion(1, 1).restar(F(it.f1)).restar(it.f2 ? F(it.f2) : 0);
        assert.equal(o.error, 'da-la-fraccion-en-vez-de-la-cantidad');
        assert.ok(F(o).equals(q), JSON.stringify(it));
        continue;
      }
      const k = T / d;
      switch (o.error) {
        case 'gastado-como-queda': assert.equal(o.v, it.variante === 'queda' ? k * n : F(it.f1).sumar(F(it.f2)).multiplicar(T).aEntero()); break;
        case 'se-queda-en-la-unitaria': assert.equal(o.v, k); break;
        case 'resta-el-numerador': assert.equal(o.v, T - n); break;
        case 'olvida-restar-la-primera': assert.equal(o.v, T - (T / it.f2.d) * it.f2.n); break;
        case 'olvida-restar-la-segunda': assert.equal(o.v, T - k * n); break;
        case 'cuenta-una-parte-de-menos': assert.equal(o.v, T - k); break;
        case 'cuenta-una-parte-de-mas': assert.equal(o.v, T + k); break;
        case 'duplica-el-dato': assert.equal(o.v, 2 * it.dato); break;
        case 'multiplica-el-dato-por-el-denominador': assert.equal(o.v, it.dato * d); break;
        case 'da-el-resto': assert.equal(o.v, k * (d - n)); break;
        case 'da-la-parte-ya-hecha': assert.equal(o.v, k * n); break;
        default: assert.fail(`error sin comprobar: ${o.error}`);
      }
    }
  }
  assert.ok(vistos.size >= 8, `solo salen ${[...vistos]}`);
});

test('ejercicio 4: el feedback usa el singular con m o n = 1, y «de … cada una» sin ambigüedad', () => {
  const vistosUno = new Set();
  for (const idioma of IDIOMAS) {
    for (const it of generar(generarProblema, 103008)) {
      for (const o of it.opciones) {
        if (o.error === null) continue;
        const exp = explicaOpcion(it, o, idioma);
        // Nunca «1 partes»/«1 parts», ni «fueran 1 <unidad-s»/«were 1 <unidad-s» (reabierta del 30-10, puntos 3-4).
        assert.ok(!/\b1 partes\b/.test(exp), `«1 partes» en ${o.error}: ${exp}`);
        assert.ok(!/\b1 parts\b/.test(exp), `«1 parts» en ${o.error}: ${exp}`);
        assert.ok(!/fuera(n|) 1 [a-záéíóúñ]+s\b/i.test(exp), `plural tras «1» en ${o.error}: ${exp}`);
        assert.ok(!/were 1 [a-z]+s\b/i.test(exp), `plural tras «1» en ${o.error}: ${exp}`);
        if (['cuenta-una-parte-de-menos', 'cuenta-una-parte-de-mas', 'da-la-parte-ya-hecha'].includes(o.error)) {
          assert.ok(/cada una|each\b/.test(exp), `sin «cada una»/«each» en ${o.error}: ${exp}`);
        }
        if (o.error === 'duplica-el-dato' && it.dato !== undefined) {
          const m = it.variante === 'parte' ? it.f1.n : it.f1.d - it.f1.n;
          if (m === 1) vistosUno.add(idioma);
        }
      }
    }
  }
  assert.ok(vistosUno.has('es') && vistosUno.has('en'), 'el caso m = 1 de duplica-el-dato no salió en los 3000 ítems');
});

// --- Textos --------------------------------------------------------------------------

test('textos: sin ×, decimales, barras, negativas, mixtos ni variables, en los dos idiomas', () => {
  for (const idioma of IDIOMAS) {
    for (const ej of Object.values(TX)) {
      for (const clave of ['nombre', 'detalle', 'introduccion', 'instruccion']) {
        if (ej[clave]) limpio(ej[clave][idioma], `TX ${clave} ${idioma}`);
      }
    }
    for (const it of generar(generarCalculo, 103010).slice(0, 600)) {
      limpio(TX.calculo.razon[idioma](it), `razon1 ${idioma}`);
      limpio(TX.calculo.pista1[idioma](it), 'pista1');
      limpio(TX.calculo.pista2[idioma](it), 'pista2');
      for (const id of Object.keys(TX.calculo.fallo)) limpio(TX.calculo.fallo[id][idioma](it), `fallo1 ${id}`);
    }
    for (const it of generar(generarContexto, 103011).slice(0, 1000)) {
      const e = enunciadoContexto(it, idioma);
      limpio(`${e.texto} ${e.pregunta} ${e.unidad}`, `enunciado2 ${it.ctx} ${idioma}`);
      limpio(TX.contexto.razon[idioma](it), `razon2 ${idioma}`);
    }
    for (const it of generar(generarParte, 103012).slice(0, 1000)) {
      const e = enunciadoParte(it, idioma);
      limpio(`${e.texto} ${e.pregunta}`, `enunciado3 ${it.ctx} ${idioma}`);
      limpio(TX.parte.razon[idioma](it), `razon3 ${idioma}`);
      for (const id of Object.keys(TX.parte.fallo)) limpio(TX.parte.fallo[id][idioma](it), `fallo3 ${id}`);
    }
    for (const it of generar(generarProblema, 103013).slice(0, 1500)) {
      const e = enunciadoProblema(it, idioma);
      limpio(`${e.texto} ${e.pregunta}`, `enunciado4 ${it.variante}.${it.esc} ${idioma}`);
      limpio(solucionProblema(it, idioma), `solucion4 ${it.variante}.${it.esc} ${idioma}`);
      for (const o of it.opciones) {
        if (o.error === null) continue;
        const exp = explicaOpcion(it, o, idioma);
        assert.ok(exp.length > 10, `sin explicación para ${o.error}`);
        limpio(exp, `explica4 ${o.error} ${idioma}`);
      }
    }
  }
});

test('textos: toda fracción de un enunciado va con raya y las que se muestran son propias', () => {
  for (const it of generar(generarContexto, 103014).slice(0, 500)) {
    const e = enunciadoContexto(it, 'es');
    const f = htmlFraccion(fraccion(it.n, it.d));
    assert.ok(`${e.texto} ${e.pregunta}`.includes(f), `la fracción no está en el enunciado: ${e.texto}`);
    assert.ok(F(it).esPropia());
  }
});

test('textos: cada error que puede salir tiene su frase de feedback en los dos idiomas', () => {
  for (const id of ['fraccion-de-al-reves', 'se-queda-en-la-unitaria', 'multiplica-por-el-denominador', 'multiplica-sin-dividir', 'otro-error']) {
    for (const idioma of IDIOMAS) assert.equal(typeof TX.calculo.fallo[id][idioma], 'function', `${id} ${idioma}`);
  }
  for (const id of ['parte-entre-el-resto', 'sin-simplificar', 'otro-error']) {
    for (const idioma of IDIOMAS) assert.equal(typeof TX.parte.fallo[id][idioma], 'function', `${id} ${idioma}`);
  }
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) assert.ok(e.nombre.es && e.nombre.en, id);
});

test('la práctica declara los cuatro ejercicios del catálogo con sus textos bilingües', () => {
  for (const ej of [TX.calculo, TX.contexto, TX.parte, TX.problema]) {
    for (const campo of ['nombre', 'detalle', 'introduccion']) {
      assert.ok(typeof ej[campo].es === 'string' && typeof ej[campo].en === 'string', campo);
    }
  }
  assert.equal(TX.calculo.nombre.es, 'Calcula');
  assert.equal(TX.contexto.nombre.es, 'Con contexto');
  assert.equal(TX.parte.nombre.es, '¿Qué fracción es?');
  assert.equal(TX.problema.nombre.es, 'El problema');
});
