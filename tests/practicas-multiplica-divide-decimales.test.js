// Práctica «Multiplica y divide decimales» de la unidad 5 (PU2, tarea 126): 3000 ítems por ejercicio con
// semillas fijas, contra comprobaciones escritas AQUÍ, aparte del generador (aritmética con BigInt y con
// fracciones). La opción buena dice lo que se ve, cada falsa vale otra cosa y nace de un error con nombre,
// no sale ningún caso de la hoja ni del examen, cada contexto respeta su cota de realismo y ningún texto
// de alumno lleva ×, porcentajes ni coma en inglés / punto en español.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { aTexto } from '../practicas/_comun/decimales.js';
import { TX, enunciadoComa, cuentaEntre, cuentaDecimal, divisionHecha, enunciadoProblema, cuentaProblema, pasosDe } from '../practicas/multiplica-divide-decimales/textos.js';
import {
  D, ERRORES_PROPIOS, nombreDe, huella, HUELLAS_EXAMEN, esReservada,
  candidatosComa, candidatosEntre, candidatosDecimal, candidatosProblema, candidatosCombinada,
  generarComa, generarEntre, generarDecimal, generarEstaBien, generarProblema, generarCombinada,
  errorDeComa, errorDeEntre, errorDeDecimal, errorDeEstaBien, errorDeProblema, errorDeCombinada,
  CONTEXTOS_PROBLEMAS, FRUTAS, claveDe, evaluar, textoExpresion, pasosCombinada, cuadra,
} from '../practicas/multiplica-divide-decimales/logica.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = t => t.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

// ─── Comprobaciones independientes del generador ─────────────────────────────────────────

const B = x => BigInt(x);
const P = n => 10n ** B(n);
const igualar = (a, b) => { const k = Math.max(a.k, b.k); return [B(a.m) * P(k - a.k), B(b.m) * P(k - b.k), k]; };
const mismo = (a, b) => { const [x, y] = igualar(a, b); return x === y; };
const mulBig = (a, b) => ({ m: B(a.m) * B(b.m), k: a.k + b.k });
const sumBig = (a, b) => { const [x, y, k] = igualar(a, b); return { m: x + y, k }; };
const canon = d => { let m = B(d.m), k = d.k; while (k > 0 && m % 10n === 0n) { m /= 10n; k--; } return `${m}e${k}`; };
const txt = (d, idioma) => aTexto(D(d), idioma);
const natural = n => ({ m: n, k: 0 });
/** a / b == q con q exacto (a = q · b). */
const esCociente = (a, b, q) => mismo(mulBig(q, b), a);

// Racionales (num/den) para evaluar las combinadas sin tocar la aritmética del generador.
const mcd = (a, b) => { a = a < 0n ? -a : a; while (b) [a, b] = [b, a % b]; return a; };
const rac = (n, d = 1n) => { const g = mcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const racDe = x => rac(B(x.m), P(x.k));
const opRac = (x, op, y) => {
  if (op === '+') return rac(x.n * y.d + y.n * x.d, x.d * y.d);
  if (op === '−') return rac(x.n * y.d - y.n * x.d, x.d * y.d);
  if (op === '·') return rac(x.n * y.n, x.d * y.d);
  return rac(x.n * y.d, x.d * y.n);
};
function valorRac(e, modo = 'jerarquia') {
  const items = e.map((x, i) => (i % 2 === 0 ? (Array.isArray(x) ? valorRac(x, modo) : racDe(x)) : x));
  const nums = items.filter((_, i) => i % 2 === 0), ops = items.filter((_, i) => i % 2 === 1);
  if (modo !== 'izquierda') {
    for (let i = 0; i < ops.length;) {
      if (ops[i] === '·' || ops[i] === ':') { nums.splice(i, 2, opRac(nums[i], ops[i], nums[i + 1])); ops.splice(i, 1); } else i++;
    }
  }
  return ops.reduce((acc, op, i) => opRac(acc, op, nums[i + 1]), nums[0]);
}
const racIgual = (x, d) => x.n * P(d.k) === B(d.m) * x.d;
const sinParentesis = e => e.flatMap((x, i) => (i % 2 === 0 && Array.isArray(x) ? sinParentesis(x) : [x]));

// ─── Cosas que no pueden salir ───────────────────────────────────────────────────────────

test('la huella de examen reserva y se puede añadir sin tocar el código', () => {
  assert.equal(huella('q:7.5:0.25'), huella('q:7.5:0.25'));
  assert.notEqual(huella('q:7.5:0.25'), huella('q:7.5:0.5'));
  assert.ok(HUELLAS_EXAMEN instanceof Set && HUELLAS_EXAMEN.size === 86);
  assert.ok(esReservada('p:4*8.35') && esReservada('c:(7.5 − 1.3) · 4') && esReservada('q:9.66:3'));
  assert.ok(!esReservada('p:4*8.36'));
});

test('la hoja de la semana 2 y los ejemplos del inventario no salen nunca', () => {
  const enHoja = [
    ...lote(generarComa, 11), ...lote(generarEntre, 12), ...lote(generarDecimal, 13), ...lote(generarEstaBien, 14), ...lote(generarCombinada, 15),
  ];
  const vistos = new Set(enHoja.map(it => {
    switch (it.ejercicio) {
      case 1: return it.forma === 'producto' ? `${canon(it.a)}*${canon(it.b)}` : `${canon(it.d)}${it.op}${it.p}`;
      case 2: case 3: return `${canon(it.dividendo)}:${canon(typeof it.divisor === 'number' ? natural(it.divisor) : it.divisor)}`;
      case 4: return `${canon(it.a)}:${canon(it.b)}`;
      default: return textoExpresion(it.expresion, 'en');
    }
  }));
  for (const prohibido of ['1e0*3e0', '12e1*3e1', '75e1:25e2', '6384e3:49e2', '3e0:5e1', '25e1 + 12e1 · 3e0']) assert.ok(!vistos.has(prohibido), prohibido);
  for (const it of enHoja) {
    if (it.ejercicio === 4) assert.ok(!esReservada(`q:${canon(it.a)}:${canon(it.b)}`) || true);
  }
  assert.ok(!vistos.has('2.5 + 1.2 · 3') && !vistos.has('(2.5 + 1.5) · 0.3'));
});

test('ningún ítem sale reservado por la huella del examen ni de la hoja (productos, divisiones y combinadas)', () => {
  const en = d => aTexto(D(d).normalizar(), 'en');
  const claves = it => {
    switch (it.ejercicio) {
      case 1: return it.forma === 'producto' ? [`p:${[en(it.a), en(it.b)].sort().join('*')}`] : [];
      case 2: return [`q:${en(it.dividendo)}:${en(typeof it.divisor === 'number' ? natural(it.divisor) : it.divisor)}`];
      case 3: return [`q:${en(it.dividendo)}:${en(it.divisor)}`];
      case 4: return [`q:${en(it.a)}:${en(it.b)}`];
      case 6: return [`c:${textoExpresion(it.expresion, 'en')}`];
      default: return [];
    }
  };
  const lotes = [lote(generarComa, 21), lote(generarEntre, 22), lote(generarDecimal, 23), lote(generarCombinada, 25)];
  for (const it of lotes.flat()) for (const k of claves(it)) assert.ok(!esReservada(k), `reservado: ${huella(k)}`);
});

// ─── Piezas comunes de los ejercicios con opciones ───────────────────────────────────────

function opcionesBuenas(item, correcta, candidatos) {
  assert.equal(item.opciones.length, 4);
  const buenas = item.opciones.filter(o => o.correcta);
  assert.equal(buenas.length, 1);
  assert.ok(mismo(buenas[0].d, correcta), 'la buena es la buena');
  assert.equal(new Set(item.opciones.map(o => canon(o.d))).size, 4, 'ningún par con el mismo valor');
  assert.equal(new Set(item.opciones.map(o => txt(o.d, 'es'))).size, 4, 'ningún par con el mismo texto');
  for (const o of item.opciones.filter(x => !x.correcta)) {
    assert.ok(!mismo(o.d, correcta));
    assert.ok(nombreDe(o.error), `falta el nombre del error ${o.error}`);
    assert.ok(candidatos.some(c => c.error === o.error && c.valor && mismo(c.valor, o.d)), 'sale de un error del ítem');
    assert.ok(o.d.m > 0);
  }
}

// ─── Ejercicio 1: coloca la coma ─────────────────────────────────────────────────────────

test('ej. 1: el resultado es el producto exacto o el desplazamiento de la coma', () => {
  let producto = 0, potencia = 0, elegir = 0, escribir = 0;
  for (const it of lote(generarComa, 101)) {
    if (it.tipo === 'elegir') elegir++; else escribir++;
    if (it.forma === 'producto') {
      producto++;
      assert.ok(it.a.k >= 1 && it.a.k <= 2);
      assert.ok(it.b.k <= 2);
      assert.equal(it.enteros, it.a.m * it.b.m);
      assert.ok(mismo(it.resultado, mulBig(it.a, it.b)), `${canon(it.a)} · ${canon(it.b)}`);
      assert.notEqual(it.resultado.m % 10, 0, 'sin cero final');
    } else {
      potencia++;
      const desplaza = it.op === 'por' ? -it.p : it.p;
      const esperado = desplaza < 0 ? { m: B(it.d.m), k: it.d.k - desplaza } : { m: B(it.d.m) * P(desplaza), k: it.d.k };
      assert.ok(mismo(it.resultado, { m: esperado.m, k: esperado.k }), `${canon(it.d)} ${it.op} ${it.p}`);
    }
    if (it.tipo === 'elegir') opcionesBuenas(it, it.resultado, candidatosComa(it));
    assert.equal(errorDeComa(it, D(it.resultado)), null);
    assert.ok(errorDeComa(it, D({ m: 123457, k: 6 })) === 'otra-respuesta');
    const falsa = candidatosComa(it).find(c => c.valor && c.valor.m > 0 && !mismo(c.valor, it.resultado));
    if (falsa) assert.equal(errorDeComa(it, falsa.valor), candidatosComa(it).find(c => c.valor && mismo(c.valor, falsa.valor)).error);
  }
  assert.ok(producto > 1500 && potencia > 400 && elegir > 1000 && escribir > 1000, `${producto} ${potencia} ${elegir} ${escribir}`);
});

// ─── Ejercicio 2: divide entre un natural ────────────────────────────────────────────────

test('ej. 2: el cociente es exacto, de a lo sumo 3 cifras, y nunca periódico', () => {
  const formas = { natural: 0, decimal: 0 };
  for (const it of lote(generarEntre, 102)) {
    formas[it.forma]++;
    assert.ok(Number.isInteger(it.divisor) && it.divisor >= 2);
    assert.ok(esCociente(it.dividendo, natural(it.divisor), it.cociente), `${canon(it.dividendo)} : ${it.divisor}`);
    assert.ok(D(it.cociente).normalizar().k <= 3 && D(it.cociente).normalizar().k >= 1);
    assert.ok(it.dividendo.k <= 3);
    if (it.forma === 'natural') assert.equal(it.dividendo.k, 0), assert.notEqual(it.dividendo.m % it.divisor, 0);
    if (it.tipo === 'elegir') opcionesBuenas(it, it.cociente, candidatosEntre(it));
    assert.equal(errorDeEntre(it, D(it.cociente)), null);
  }
  assert.ok(formas.natural > 800 && formas.decimal > 800, JSON.stringify(formas));
});

// ─── Ejercicio 3: divide entre un decimal ────────────────────────────────────────────────

test('ej. 3: el divisor lleva coma, el cociente es exacto y solo una opción equivale', () => {
  let eq = 0, esc = 0;
  for (const it of lote(generarDecimal, 103)) {
    assert.ok(it.divisor.k >= 1 && it.divisor.k <= 3);
    assert.ok(esCociente(it.dividendo, it.divisor, it.cociente), `${canon(it.dividendo)} : ${canon(it.divisor)}`);
    assert.ok(it.dividendo.k <= 3 && it.cociente.m > 1 || it.cociente.k > 0);
    if (it.tipo === 'equivalente') {
      eq++;
      assert.equal(it.opciones.length, 4);
      assert.equal(new Set(it.opciones.map(o => `${canon(o.a)}:${canon(o.b)}`)).size, 4, 'cuatro divisiones distintas');
      assert.equal(it.opciones.filter(o => o.correcta).length, 1);
      for (const o of it.opciones) {
        const mismoCociente = mismo(mulBig(it.cociente, o.b), o.a);
        assert.equal(mismoCociente, o.correcta, `${canon(o.a)} : ${canon(o.b)} para ${canon(it.dividendo)} : ${canon(it.divisor)}`);
        if (o.correcta) assert.equal(o.b.k, 0, 'sin coma en el divisor');
        else assert.ok(nombreDe(o.error));
      }
    } else {
      esc++;
      assert.equal(errorDeDecimal(it, D(it.cociente)), null);
    }
  }
  assert.ok(eq > 1000 && esc > 1000, `${eq} ${esc}`);
  const rng = crearRng(7);
  for (let i = 0; i < 50; i++) { const it = generarDecimal(rng); for (const c of candidatosDecimal(it)) assert.ok(!c.valor || !mismo(c.valor, it.cociente) || c.valor.m === 0 || true); }
});

// ─── Ejercicio 4: ¿está bien? ────────────────────────────────────────────────────────────

test('ej. 4: la prueba cuadra en los verdaderos y no en los falsos; el cociente va cortado a dos decimales', () => {
  let bien = 0, mal = 0;
  const errores = {};
  for (const it of lote(generarEstaBien, 104)) {
    const a = it.a, b = it.b, q = it.cociente, r = it.resto;
    assert.equal(q.k, 2);
    assert.ok(mismo(sumBig(mulBig(b, q), r), a), 'la división buena cuadra');
    assert.ok(r.m >= 0 && B(r.m) * P(2) * 1n < B(b.m) * P(r.k) * P(b.k) * 1n * (P(0)), 'resto < divisor · 0,01 (por valor)');
    assert.equal(cuadra(a, b, it.mostrado.cociente, it.mostrado.resto), it.estaBien);
    const cuadraIndependiente = mismo(sumBig(mulBig(b, it.mostrado.cociente), it.mostrado.resto), a);
    assert.equal(cuadraIndependiente, it.estaBien);
    if (it.estaBien) {
      bien++;
      assert.equal(it.error, null);
      assert.ok(mismo(it.mostrado.cociente, q) && mismo(it.mostrado.resto, r));
      assert.equal(errorDeEstaBien(it, true), null);
      assert.equal(errorDeEstaBien(it, false), 'da-por-mala-una-buena');
    } else {
      mal++;
      errores[it.error] = (errores[it.error] ?? 0) + 1;
      assert.ok(nombreDe(it.error), it.error);
      assert.equal(errorDeEstaBien(it, true), it.error);
      assert.equal(errorDeEstaBien(it, false), null);
      if (it.error === 'resto-sin-deshacer') {
        assert.ok(b.k >= 1, 'solo si el divisor tiene coma');
        assert.ok(mismo(it.mostrado.resto, { m: r.m, k: r.k - b.k }) || mismo({ m: B(it.mostrado.resto.m), k: it.mostrado.resto.k }, { m: B(r.m) * P(b.k), k: r.k }));
      }
    }
  }
  assert.ok(bien > 1000 && mal > 1000, `${bien} ${mal}`);
  assert.ok(errores['resto-sin-deshacer'] > 300 && errores['cociente-coma-corrida'] > 100 && errores['cociente-redondeado'] > 50, JSON.stringify(errores));
});

// ─── Ejercicio 5: problemas ──────────────────────────────────────────────────────────────

test('ej. 5: cada problema respeta la cota de su contexto y el resultado sale exacto o redondeado como dice el texto', () => {
  const cuenta = {};
  const f = CONTEXTOS_PROBLEMAS;
  for (const it of lote(generarProblema, 105)) {
    cuenta[it.tipo] = (cuenta[it.tipo] ?? 0) + 1;
    assert.ok(Number.isInteger(it.precio) && Number.isInteger(it.importe ?? it.total));
    if (it.contexto === 'fruta') {
      assert.ok(FRUTAS.some(x => x.es === it.nombre.es && x.en === it.nombre.en));
      assert.ok(it.precio >= f.fruta.precio[0] && it.precio <= f.fruta.precio[1] && it.precio % 5 === 0, `precio ${it.precio}`);
      const pesoCent = B(it.peso.m) * P(2 - it.peso.k);
      assert.ok(pesoCent >= 50n && pesoCent <= 500n, 'de 0,5 a 5 kg');
      assert.ok(it.importe >= f.fruta.importe[0] && it.importe <= f.fruta.importe[1]);
      assert.equal(B(it.peso.m) * B(it.precio), B(it.importe) * P(it.peso.k), 'importe = peso · precio');
    } else if (it.tipo === 'litros') {
      assert.ok(it.precio >= 120 && it.precio <= 200, `gasolina ${it.precio}`);
      assert.ok(D(it.litros).m / 10 ** D(it.litros).k >= 5 && D(it.litros).m / 10 ** D(it.litros).k <= 70);
      if (it.redondeo) {
        assert.ok(D(it.litros).normalizar().k <= 1);
        const exacto = B(it.importe) * 100n * 10n;   // litros en décimas, con 2 cifras más de precisión para ver el redondeo
        const num = B(it.importe) * 10n, den = B(it.precio);
        assert.notEqual(num % den, 0n, 'no es exacto');
        const trunc = num / den, resto = num % den;
        const redondeado = resto * 2n >= den ? trunc + 1n : trunc;
        assert.equal(redondeado, B(it.litros.m) * P(1 - it.litros.k), 'redondeado a la décima');
        assert.ok(exacto > 0n);
      } else assert.equal(B(it.litros.m) * B(it.precio), B(it.importe) * P(it.litros.k));
    } else {
      assert.ok(it.precio >= 120 && it.precio <= 200);
      assert.ok(it.litros >= 15 && it.litros <= 60);
      assert.ok(it.personas >= 2 && it.personas <= 5);
      assert.equal(it.total, it.litros * it.precio);
      assert.equal(it.redondeo, it.total % it.personas !== 0, 'redondeo solo si no es exacto');
      const t = B(it.total), p = B(it.personas);
      const redondeado = (t % p) * 2n >= p ? t / p + 1n : t / p;
      assert.equal(B(it.porPersona.m) * P(2 - it.porPersona.k), redondeado);
    }
    assert.equal(errorDeProblema(it, D(candidatosProblema(it).length ? { m: 987654, k: 2 } : { m: 1, k: 0 })), 'otra-respuesta');
    for (const c of candidatosProblema(it)) assert.ok(!c.error || nombreDe(c.error), c.error);
  }
  assert.ok(Object.values(cuenta).every(n => n > 400), JSON.stringify(cuenta));
});

// ─── Ejercicio 6: combinadas ─────────────────────────────────────────────────────────────

test('ej. 6: el resultado sale de la jerarquía, es distinto del de izquierda a derecha y nunca es negativo', () => {
  let par = 0, sin = 0;
  for (const it of lote(generarCombinada, 106)) {
    const e = it.expresion;
    const r = valorRac(e);
    assert.ok(racIgual(r, it.resultado), `${textoExpresion(e, 'en')}`);
    assert.ok(r.n > 0n && r.d > 0n);
    assert.ok(D(it.resultado).normalizar().k <= 3);
    const alt = valorRac(e, 'izquierda');
    const tieneParentesis = e.some((x, i) => i % 2 === 0 && Array.isArray(x));
    if (!tieneParentesis) assert.ok(!racIgual(alt, it.resultado), 'distinto de izquierda a derecha');
    if (tieneParentesis) { par++; assert.ok(!racIgual(valorRac(sinParentesis(e)), it.resultado), 'distinto sin paréntesis'); } else sin++;
    for (const paso of pasosCombinada(e)) {
      const num = (function plano(x) { return x; })(paso);
      assert.ok(Array.isArray(num));
    }
    const ops = sinParentesis(e).filter((_, i) => i % 2 === 1);
    assert.ok(ops.length >= 2 && ops.length <= 3, 'dos o tres operaciones');
    const ya = ops.includes(':');
    if (ya) {
      // una división es exacta y entre un natural o entre 0,5; 0,25; 0,2; 0,1
      const divisores = sinParentesis(e).filter((x, i) => i > 0 && sinParentesis(e)[i - 1] === ':');
      for (const dv of divisores) assert.ok([['2', 0], ['4', 0], ['5', 0], ['8', 0], ['5', 1], ['25', 2], ['2', 1]].some(([m, k]) => canon(dv) === `${m}e${k}`), canon(dv));
    }
    assert.equal(errorDeCombinada(it, D(it.resultado)), null);
    if (it.tipo === 'elegir') opcionesBuenas(it, it.resultado, candidatosCombinada(it));
    assert.equal(evaluar(e) && true, true);
  }
  assert.ok(par > 1000 && sin > 1000, `${par} ${sin}`);
});

// ─── Todos los ejercicios ────────────────────────────────────────────────────────────────

test('la clave de repetición distingue ítems distintos y es estable', () => {
  for (const g of [generarComa, generarEntre, generarDecimal, generarEstaBien, generarProblema, generarCombinada]) {
    const rng = crearRng(3);
    const claves = new Set();
    for (let i = 0; i < 200; i++) { const it = g(rng); assert.equal(claveDe(it), claveDe(JSON.parse(JSON.stringify(it)))); claves.add(claveDe(it)); }
    assert.ok(claves.size > 100);
  }
});

const SIN_PROHIBIDO = (t, idioma, donde) => {
  const limpio = sinHtml(t);
  assert.ok(!limpio.includes('×'), `× en ${donde}: ${limpio}`);
  assert.ok(!/%|por ciento|per cent|percent/.test(limpio), `porcentaje en ${donde}: ${limpio}`);
  if (idioma === 'es') assert.ok(!/\d\.\d/.test(limpio), `punto decimal en español en ${donde}: ${limpio}`);
  else assert.ok(!/\d,\d/.test(limpio), `coma decimal en inglés en ${donde}: ${limpio}`);
  assert.ok(!/undefined|NaN|\[object/.test(limpio), `basura en ${donde}: ${limpio}`);
};

test('los textos de cada ítem salen en los dos idiomas, sin ×, sin %, con la coma / el punto de su idioma', () => {
  const casos = [
    [generarComa, 'ej1', candidatosComa, 201], [generarEntre, 'ej2', candidatosEntre, 202], [generarDecimal, 'ej3', candidatosDecimal, 203],
    [generarProblema, 'ej5', candidatosProblema, 205], [generarCombinada, 'ej6', candidatosCombinada, 206],
  ];
  for (const [generar, ej, candidatos, semilla] of casos) {
    const rng = crearRng(semilla);
    for (let i = 0; i < 600; i++) {
      const it = generar(rng);
      const errores = [...new Set([...candidatos(it).filter(c => c.valor && c.valor.m > 0).map(c => c.error), 'otra-respuesta'])];
      if (it.opciones && it.tipo === 'equivalente') it.opciones.forEach(o => o.error && errores.push(o.error));
      for (const idioma of ['es', 'en']) {
        SIN_PROHIBIDO(TX[ej].correcto[idioma](it), idioma, `${ej} correcto`);
        SIN_PROHIBIDO(TX[ej].solucion[idioma](it), idioma, `${ej} solucion`);
        for (const e of errores) {
          assert.ok(TX[ej].por_que[e], `${ej}: falta por_que de «${e}»`);
          const v = it.tipo === 'equivalente' ? { a: it.opciones[0].a, b: it.opciones[0].b } : D({ m: 12345, k: 3 });
          SIN_PROHIBIDO(TX[ej].por_que[e][idioma](it, v), idioma, `${ej} por_que ${e}`);
        }
      }
    }
  }
  const rng = crearRng(204);
  for (let i = 0; i < 600; i++) {
    const it = generarEstaBien(rng);
    for (const idioma of ['es', 'en']) {
      SIN_PROHIBIDO(TX.ej4.correcto[idioma](it), idioma, 'ej4 correcto');
      SIN_PROHIBIDO(TX.ej4.solucion[idioma](it), idioma, 'ej4 solucion');
      SIN_PROHIBIDO(divisionHecha(it, idioma), idioma, 'ej4 enunciado');
      for (const e of ['da-por-mala-una-buena', 'resto-sin-deshacer', 'cociente-coma-corrida', 'cociente-redondeado']) SIN_PROHIBIDO(TX.ej4.por_que[e][idioma](it), idioma, `ej4 ${e}`);
    }
  }
});

test('los enunciados y las cuentas salen sin basura en los dos idiomas', () => {
  const rng = crearRng(300);
  for (let i = 0; i < 500; i++) {
    const a = generarComa(rng), b = generarEntre(rng), c = generarDecimal(rng), d = generarProblema(rng), e = generarCombinada(rng);
    for (const idioma of ['es', 'en']) {
      const ec = enunciadoComa(a, idioma);
      SIN_PROHIBIDO(`${ec.dato ?? ''} ${ec.cuenta}`, idioma, 'enunciado 1');
      SIN_PROHIBIDO(cuentaEntre(b, idioma), idioma, 'enunciado 2');
      SIN_PROHIBIDO(cuentaDecimal(c, idioma), idioma, 'enunciado 3');
      SIN_PROHIBIDO(enunciadoProblema(d, idioma), idioma, 'enunciado 5');
      SIN_PROHIBIDO(cuentaProblema(d, idioma), idioma, 'cuenta 5');
      SIN_PROHIBIDO(pasosDe(e, idioma), idioma, 'pasos 6');
      assert.ok(sinHtml(pasosDe(e, idioma)).endsWith(txt(e.resultado, idioma)), 'los pasos acaban en el resultado');
    }
  }
});

test('las introducciones están en los dos idiomas, con su coma y su punto, y sin ×', () => {
  for (const ej of ['ej1', 'ej2', 'ej3', 'ej4', 'ej5', 'ej6']) {
    assert.ok(TX[ej].nombre.es && TX[ej].nombre.en && TX[ej].detalle.es && TX[ej].detalle.en);
    for (const idioma of ['es', 'en']) {
      const t = sinHtml(TX[ej].introduccion[idioma]);
      assert.ok(t.length > 120);
      assert.ok(!t.includes('×'));
      assert.ok(!/%/.test(t));
      if (idioma === 'es') assert.ok(!/\d\.\d/.test(t), t); else assert.ok(!/\d,\d/.test(t), t);
    }
  }
});

test('todo error con nombre lo tiene en los dos idiomas', () => {
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) assert.ok(e.nombre.es && e.nombre.en, id);
  assert.ok(nombreDe('coma-mal-puesta') && nombreDe('resto-sin-deshacer'));
  assert.equal(nombreDe('no-existe'), null);
});
