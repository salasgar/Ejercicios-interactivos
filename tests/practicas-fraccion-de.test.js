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
  F, CONTEXTOS, IDS_CONTEXTO, GRUPOS, IDS_GRUPO, ESCENARIOS, VARIANTES, ERRORES_PROPIOS,
  enCota, totalesPosibles, errorConNombre, generarCalculo, generarContexto, generarParte, generarProblema,
  errorDeCalculo, errorDeParte, respuestaParte, respuestaProblema, cotaDe,
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
      else assert.ok(o.v <= cfg.max, `una opción de «el total» fuera de la cota: ${o.v} > ${cfg.max}`);
    }
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
        case 'fraccion-del-dato': assert.equal(o.v, F(it.f1).multiplicar(it.dato).aEntero()); break;
        case 'se-queda-en-la-unitaria-del-dato': assert.equal(o.v, k); break;
        case 'multiplica-el-dato-por-el-denominador': assert.equal(o.v, it.dato * d); break;
        case 'da-el-resto': assert.equal(o.v, k * (d - n)); break;
        case 'da-la-parte-ya-hecha': assert.equal(o.v, k * n); break;
        default: assert.fail(`error sin comprobar: ${o.error}`);
      }
    }
  }
  assert.ok(vistos.size >= 8, `solo salen ${[...vistos]}`);
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
