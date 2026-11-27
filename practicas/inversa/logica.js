// Práctica «Proporcionalidad inversa» (unidad 7, sesiones 5 y 6; PU2, tarea 215): puro, sin DOM.
// Ejercicios: 1 ¿es inversa? (tabla), 2 completa la tabla, 3 problemas de un paso, 4 caza el error.
// Toda la aritmética es entera o con Fraccion; el dinero va en céntimos enteros. Método: el producto constante
// (a · b = P; P : c). Nunca «k» ni «constante» en pantalla.

import { Fraccion } from '../_comun/fracciones.js';
import { ERRORES_TIPICOS, NOMBRES, cantidad, deTexto, huellaCaso, mismoValor } from '../_comun/proporcion.js';
import { HUELLAS_RESERVADAS } from './reserva.js';

export const F = (n, d = 1) => new Fraccion(n, d);
const NBSP = ' ';

// ─── Números en pantalla ─────────────────────────────────────────────────────────────────────────

/** Céntimos → «7,50» / «7.50» (sin símbolo). */
export function dineroCelda(c, idioma = 'es') {
  const e = Math.trunc(c / 100), cc = String(c % 100).padStart(2, '0');
  return `${e}${idioma === 'es' ? ',' : '.'}${cc}`;
}
/** Céntimos → «7,50 €» / «€7.50». */
export const dinero = (c, idioma = 'es') => (idioma === 'es' ? `${dineroCelda(c, 'es')}${NBSP}€` : `€${dineroCelda(c, 'en')}`);

// ─── Contextos inversos: x · y = P (jornadas, horas de grifo, días de pienso, euros del regalo, km) ──
// `din`: y va en céntimos y P en euros. Todos los límites son la cota creíble del contexto (la comprueba el test).

export const CONTEXTOS = {
  obreros: { din: false, xMin: 2, xMax: 12, yMin: 2, yMax: 60, Ps: [12, 24, 30, 36, 40, 48, 60, 72, 90, 96, 120, 144, 180, 240, 360] },
  grifos: { din: false, xMin: 2, xMax: 6, yMin: 1, yMax: 24, Ps: [6, 12, 18, 24, 36, 48, 60, 72, 96, 120] },
  caballos: { din: false, xMin: 2, xMax: 12, yMin: 5, yMax: 60, Ps: [60, 72, 90, 120, 144, 180, 240, 300, 360] },
  amigos: { din: true, xMin: 2, xMax: 8, yMin: 150, yMax: 6000, Ps: [12, 18, 24, 30, 36, 48, 60, 72, 84, 96, 120] },
  coche: { din: false, xMin: 30, xMax: 120, yMin: 1, yMax: 10, paso: 5, Ps: [60, 90, 120, 150, 180, 240, 300, 360, 400, 480, 600, 720, 900] },
};
export const CTX_TABLA = ['obreros', 'grifos', 'caballos', 'amigos'];
export const CTX_PROBLEMA = ['obreros', 'grifos', 'caballos', 'amigos', 'coche'];

/** Contextos directos (solo para el ejercicio 4). */
export const DIRECTOS = {
  fruta: { din: true, xMin: 1, xMax: 8, ks: [80, 90, 120, 150, 160, 180, 190, 240, 250, 300, 350] },
  receta: { din: false, xMin: 2, xMax: 12, ks: [60, 70, 75, 80, 100, 125], yMax: 1000 },
};

const cm = ctx => (CONTEXTOS[ctx].din ? 100 : 1);
/** Valores admisibles de x para un P: divisores en la cota cuyo y es entero (céntimos en el dinero) y está en la cota. */
export function admisibles(ctx, P) {
  const c = CONTEXTOS[ctx], Pn = P * cm(ctx), out = [];
  for (let x = c.xMin; x <= c.xMax; x++) {
    if (c.paso && x % c.paso) continue;
    if (Pn % x) continue;
    const y = Pn / x;
    if (y >= c.yMin && y <= c.yMax) out.push(x);
  }
  return out;
}
/** Lo que vale un valor nativo (céntimos o unidades) en su unidad: euros o número. */
export const enUnidad = (ctx, v) => (CONTEXTOS[ctx].din ? F(v, 100) : F(v));
export const unidadY = ctx => (CONTEXTOS[ctx].din ? '€' : undefined);

// ─── Errores ─────────────────────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  'inversa-como-no-inversa': { es: 'Ha dudado de una tabla que sí es inversa', en: 'Doubted a table that is inverse' },
  'no-inversa-como-inversa': { es: 'Ha dado por inversa una tabla que no lo es', en: 'Took a table for inverse when it is not' },
  'resta-en-vez-de-dividir': { es: 'Ha sumado o restado la diferencia en vez de usar el producto', en: 'Added or subtracted the difference instead of using the product' },
  'da-por-bueno-lo-malo': { es: 'Ha dado por bien resuelto un problema mal resuelto', en: 'Said a wrongly solved problem was right' },
  've-error-donde-no-lo-hay': { es: 'Ha visto un error donde la resolución estaba bien', en: 'Saw a mistake in a correct solution' },
  'confunde-el-tipo': { es: 'Ha visto el error, pero ha confundido el tipo de problema', en: 'Saw the mistake, but mixed up the type of problem' },
  'otra-respuesta': { es: 'Otra respuesta', en: 'Another answer' },
};
export const nombreError = id => ERRORES_TIPICOS[id]?.nombre ?? ERRORES_PROPIOS[id];

export function leerNumero(texto, unidad, idioma) {
  try { return deTexto(texto, { unidad: unidad ?? undefined, idioma }); } catch (e) { return null; }
}
const hayValor = v => v !== null && v !== undefined && v !== false;
const nombreAlAzar = rng => rng.elegir(NOMBRES);

// ─── Ejercicio 1: ¿es inversa? ───────────────────────────────────────────────────────────────────

/** ¿Todas las columnas tienen el mismo producto? Enteros, sin coma flotante. */
export const esInversa = (xs, ys) => xs.every((x, i) => x * ys[i] === xs[0] * ys[0]);

const NUM_PS = [12, 24, 36, 48, 60, 72, 120, 180, 240];
const divisoresDe = P => { const d = []; for (let x = 1; x <= 40; x++) if (P % x === 0 && P / x <= 120) d.push(x); return d; };

function elegirUs(rng, P) {
  const d = divisoresDe(P);
  const pares = [];
  for (const a of d) for (const m of [2, 3]) if (d.includes(m * a)) pares.push([a, m]);
  const [a, m] = rng.elegir(pares);
  const resto = d.filter(u => u !== a && u !== m * a);
  return { a, m, us: [a, m * a, ...rng.barajar(resto).slice(0, 2)].sort((p, q) => p - q) };
}

function crearEsInversa(rng) {
  const r = rng.azar();
  const tipo = r < 0.5 ? 'si' : r < 0.67 ? 'directa' : r < 0.84 ? 'resta' : 'casilla';
  for (let intento = 0; intento < 200; intento++) {
    const P = rng.elegir(NUM_PS);
    if (divisoresDe(P).length < 4) continue;
    const { a, m, us } = elegirUs(rng, P);
    let ys = us.map(u => P / u);
    if (tipo === 'directa') {
      const k = rng.elegir([2, 3, 4, 5]);
      ys = us.map(u => k * u);
    } else if (tipo === 'resta') {
      const S = us[us.length - 1] + rng.entero(2, 10);
      ys = us.map(u => S - u);
    } else if (tipo === 'casilla') {
      const j = us.indexOf(m * a);
      let d = rng.entero(1, 3);
      if (rng.azar() < 0.5) d = -d;
      if (ys[j] + d <= 0) d = -d;
      ys[j] += d;
    }
    const cols = us.map((x, n) => ({ x, y: ys[n] }));
    const verdad = esInversa(us, ys);
    if (verdad !== (tipo === 'si')) continue;
    if (ys.some(y => y <= 0 || y > 240)) continue;
    return { tipo, si: tipo === 'si', cols, par: { i: us.indexOf(a), j: us.indexOf(m * a), m } };
  }
  throw new Error('no se ha podido generar la tabla del ejercicio 1');
}
export const claveEsInversa = it => `${it.tipo}|${it.cols.map(c => `${c.x}:${c.y}`).join(',')}`;
export const respuestaEsInversa = it => esInversa(it.cols.map(c => c.x), it.cols.map(c => c.y));
export const errorEsInversa = (it, dijoSi) => {
  const real = respuestaEsInversa(it);
  if (dijoSi === real) return null;
  return real ? 'inversa-como-no-inversa' : 'no-inversa-como-inversa';
};

// ─── Ejercicio 2: completa la tabla ──────────────────────────────────────────────────────────────

/** Un P y cuatro valores de x admisibles, de menor a mayor. */
function tablaInversa(ctx, rng, n = 4) {
  const c = CONTEXTOS[ctx];
  for (let intento = 0; intento < 500; intento++) {
    const P = rng.elegir(c.Ps), adm = admisibles(ctx, P);
    if (adm.length < n) continue;
    const xs = rng.barajar(adm).slice(0, n).sort((p, q) => p - q);
    return { P, cols: xs.map(x => ({ x, y: (P * cm(ctx)) / x })) };
  }
  throw new Error(`sin tabla para ${ctx}`);
}

function crearCompleta(rng) {
  const ctx = rng.elegir(CTX_TABLA), { P, cols } = tablaInversa(ctx, rng);
  const orden = rng.barajar([0, 1, 2, 3]);
  return { ctx, P, cols, ref: orden[0], huecos: [{ col: orden[1], que: 'y' }, { col: orden[2], que: 'x' }] };
}
export const claveCompleta = it => `${it.ctx}|${it.P}|${it.cols.map(c => c.x).join(',')}|${it.ref}|${it.huecos.map(h => h.col + h.que).join(',')}`;

export function valorHueco(it, h) {
  const col = it.cols[h.col];
  return h.que === 'x' ? F(col.x) : enUnidad(it.ctx, col.y);
}
export const unidadHueco = (it, h) => (h.que === 'x' ? undefined : unidadY(it.ctx));

/** Errores candidatos de un hueco (Fracciones), por id; sin los que coinciden con la solución. */
export function candidatosCompleta(it, h) {
  const ref = it.cols[it.ref], col = it.cols[h.col];
  const xr = F(ref.x), yr = enUnidad(it.ctx, ref.y), sol = valorHueco(it, h), out = {};
  if (h.que === 'y') {
    out['directa-en-inversa'] = yr.multiplicar(F(col.x)).dividir(xr);
    out['resta-en-vez-de-dividir'] = yr.restar(F(col.x).restar(xr));
  } else {
    const yc = enUnidad(it.ctx, col.y);
    out['directa-en-inversa'] = xr.multiplicar(yc).dividir(yr);
    out['resta-en-vez-de-dividir'] = xr.restar(yc.restar(yr));
  }
  if (out['resta-en-vez-de-dividir'].equals(out['directa-en-inversa'])) delete out['resta-en-vez-de-dividir'];
  for (const id of Object.keys(out)) if (out[id].equals(sol)) delete out[id];
  return out;
}

export function erroresDeCompleta(it, textos, idioma = 'es') {
  return it.huecos.map((h, n) => {
    const l = leerNumero(textos[n], unidadHueco(it, h), idioma);
    if (!hayValor(l)) return 'otra-respuesta';
    const u = unidadHueco(it, h) ?? null;
    if (mismoValor(l, cantidad(valorHueco(it, h), u))) return null;
    for (const [id, v] of Object.entries(candidatosCompleta(it, h))) if (mismoValor(l, cantidad(v, u))) return id;
    return 'otra-respuesta';
  });
}

// ─── Ejercicio 3: problemas ──────────────────────────────────────────────────────────────────────

function crearProblema(rng) {
  const ctx = rng.elegir(CTX_PROBLEMA), c = CONTEXTOS[ctx];
  for (let intento = 0; intento < 500; intento++) {
    const P = rng.elegir(c.Ps), adm = admisibles(ctx, P);
    if (adm.length < 2) continue;
    const [a, d] = rng.barajar(adm).slice(0, 2);
    return { ctx, P, a, c: d, nombre: nombreAlAzar(rng) };
  }
  throw new Error(`sin problema para ${ctx}`);
}
export const claveProblema = it => `${it.ctx}|${it.P}|${it.a}|${it.c}`;
/** Los valores nativos (céntimos o unidades): lo que se da para a y lo que se pide para c. */
export const datoProblema = it => (it.P * cm(it.ctx)) / it.a;
export const pedidoProblema = it => (it.P * cm(it.ctx)) / it.c;
export const solucionProblema = it => enUnidad(it.ctx, pedidoProblema(it));

export function candidatosProblema(it) {
  const b = enUnidad(it.ctx, datoProblema(it)), sol = solucionProblema(it), out = {};
  out['directa-en-inversa'] = b.multiplicar(F(it.c)).dividir(F(it.a));
  out['resta-en-vez-de-dividir'] = b.restar(F(it.c).restar(F(it.a)));
  if (out['resta-en-vez-de-dividir'].equals(out['directa-en-inversa'])) delete out['resta-en-vez-de-dividir'];
  for (const id of Object.keys(out)) if (out[id].equals(sol)) delete out[id];
  return out;
}
export function errorDeProblema(it, texto, idioma = 'es') {
  const u = unidadY(it.ctx) ?? null;
  const l = leerNumero(texto, unidadY(it.ctx), idioma);
  if (!hayValor(l)) return 'otra-respuesta';
  if (mismoValor(l, cantidad(solucionProblema(it), u))) return null;
  for (const [id, v] of Object.entries(candidatosProblema(it))) if (mismoValor(l, cantidad(v, u))) return id;
  return 'otra-respuesta';
}

// ─── Ejercicio 4: caza el error ──────────────────────────────────────────────────────────────────
// Cuatro tipos: inversa bien resuelta (1/4), inversa resuelta como directa (3/8), directa bien resuelta (1/8),
// directa resuelta como inversa (1/4). Las cuentas están siempre bien hechas para el planteamiento elegido.

export const TIPOS_CAZA = ['bien-inversa', 'inversa-como-directa', 'bien-directa', 'directa-como-inversa'];
const tipoCaza = rng => { const r = rng.azar(); return r < 0.25 ? TIPOS_CAZA[0] : r < 0.625 ? TIPOS_CAZA[1] : r < 0.75 ? TIPOS_CAZA[2] : TIPOS_CAZA[3]; };

function crearCaza(rng) {
  const tipo = tipoCaza(rng), inversa = tipo.includes('inversa') && tipo !== 'directa-como-inversa' ? true : tipo === 'bien-inversa' || tipo === 'inversa-como-directa';
  const esInv = tipo === 'bien-inversa' || tipo === 'inversa-como-directa';
  for (let intento = 0; intento < 4000; intento++) {
    let ctx, a, c, b, bien, P = null, tope;
    if (esInv) {
      ctx = rng.elegir(CTX_PROBLEMA);
      const cx = CONTEXTOS[ctx];
      P = rng.elegir(cx.Ps);
      const adm = admisibles(ctx, P);
      if (adm.length < 2) continue;
      [a, c] = rng.barajar(adm).slice(0, 2);
      b = (P * cm(ctx)) / a; bien = (P * cm(ctx)) / c; tope = cx.yMax;
    } else {
      ctx = rng.elegir(Object.keys(DIRECTOS));
      const dx = DIRECTOS[ctx], k = rng.elegir(dx.ks);
      const umax = dx.yMax ? Math.min(dx.xMax, Math.floor(dx.yMax / k)) : dx.xMax;
      const us = []; for (let u = dx.xMin; u <= umax; u++) us.push(u);
      if (us.length < 2) continue;
      [a, c] = rng.barajar(us).slice(0, 2);
      b = k * a; bien = k * c; tope = dx.din ? 100000 : (dx.yMax ?? 5000);
    }
    let mal = null;
    if (tipo === 'inversa-como-directa') { if ((b * c) % a) continue; mal = (b * c) / a; }
    if (tipo === 'directa-como-inversa') { if ((b * a) % c) continue; mal = (b * a) / c; }
    if (mal !== null && (mal === bien || mal <= 0 || mal > tope)) continue;
    return { tipo, ctx, esInv, P, a, c, b, bien, mal, nombre: nombreAlAzar(rng) };
  }
  throw new Error('no se ha podido generar el ítem del ejercicio 4');
}
export const claveCaza = it => `${it.tipo}|${it.ctx}|${it.a}|${it.c}|${it.b}`;
/** ¿Cómo está planteada la resolución que se enseña? */
export const planteamientoCaza = it => (it.tipo === 'bien-inversa' || it.tipo === 'directa-como-inversa' ? 'inversa' : 'directa');
/** El resultado que aparece en la resolución (nativo). */
export const resultadoCaza = it => (it.mal ?? it.bien);
/** La opción verdadera: 'bien', 'mal-directa' (es inversa, resuelto como directa) o 'mal-inversa' (es directa, resuelto como inversa). */
export const verdadCaza = it => (it.tipo.startsWith('bien') ? 'bien' : it.tipo === 'inversa-como-directa' ? 'mal-directa' : 'mal-inversa');
export function errorCaza(it, opcion) {
  const verdad = verdadCaza(it);
  if (opcion === verdad) return null;
  if (verdad === 'bien') return 've-error-donde-no-lo-hay';
  if (opcion === 'bien') return verdad === 'mal-directa' ? 'directa-en-inversa' : 'inversa-en-directa';
  return 'confunde-el-tipo';
}

// ─── Casos reservados (la hoja 2 y el examen 2 de la sesión 5) ──────────────────────────────────

const subconj = (xs, k) => (k === 0 ? [[]] : xs.flatMap((x, i) => subconj(xs.slice(i + 1), k - 1).map(r => [x, ...r])));
const hColumnas = cols => huellaCaso('columnas', [...cols].sort((p, q) => p[0] - q[0]).flat().map(v => F(v)));

/** Las huellas del caso por valor (sin unidades ni contexto); n = número de ejercicio. */
export function huellasDe(it, n) {
  if (n === 1) return [2, 3].flatMap(k => subconj(it.cols.map(c => [c.x, c.y]), k).map(hColumnas));
  if (n === 2) return subconj(it.cols.map(c => c.x), 3).map(xs => huellaCaso('tabla-inversa', [F(it.P), ...xs.sort((a, b) => a - b).map(x => F(x))]));
  if (n === 3) return [huellaCaso('inversa', [F(it.a), enUnidad(it.ctx, datoProblema(it)), F(it.c)])];
  const din = (CONTEXTOS[it.ctx] ?? DIRECTOS[it.ctx]).din;
  return [huellaCaso(it.esInv ? 'inversa' : 'directa', [F(it.a), din ? F(it.b, 100) : F(it.b), F(it.c)])];
}
export const esReservado = (it, n) => huellasDe(it, n).some(h => HUELLAS_RESERVADAS.has(h));

const sinReservados = (crear, n) => rng => {
  for (let i = 0; i < 200; i++) { const it = crear(rng); if (!esReservado(it, n)) return it; }
  throw new Error(`inversa: todo reservado (ejercicio ${n})`);
};
export const generarEsInversa = sinReservados(crearEsInversa, 1);
export const generarCompleta = sinReservados(crearCompleta, 2);
export const generarProblema = sinReservados(crearProblema, 3);
export const generarCaza = sinReservados(crearCaza, 4);
