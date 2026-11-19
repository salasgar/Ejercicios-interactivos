// «¿Qué porcentaje? ¿De cuánto?» (PU2, tarea 220), unidad 7: la lógica de los cuatro ejercicios.
//   1. ¿Qué porcentaje es?     12 de 80: la parte entre el total, pasada a porcentaje        (U7-3A-02, 3C-06)
//   2. ¿De cuánto?             el 20 % de una cantidad es 30: ¿cuál es la cantidad?           (U7-3A-04, 3C-07)
//   3. ¿Cuál de los tres es?   piden la parte, el porcentaje o el total; sin calcular        (U7-3A-07)
//   4. Problemas               un paso con contexto: porcentaje, total o parte, con su unidad (U7-3A-02, 3A-04, 3C-06, 3C-07)
// Los datos se generan al revés: p entero (1-99) y total múltiplo de 100 : m.c.d.(p, 100), así la parte es natural.
// Nunca un descuento, una rebaja ni un aumento (sesión 12). Los ítems son JSON plano.

import { CONTEXTOS, generarDatos, cantidad, mismoValor, deTexto, numeroATexto, aTexto } from '../_comun/proporcion.js';
import { fraccion } from '../_comun/fracciones.js';

const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const guarda = f => `${f.num}/${f.den}`;
export const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
export const multiploDe = p => 100 / mcd(p, 100);
const enRango = (paso, min, max) => { const r = []; for (let n = Math.ceil(min / paso) * paso; n <= max; n += paso) r.push(n); return r; };

/** La parte: p · N : 100, un natural en todos los ítems generados. */
export const parteDe = (p, N) => fraccion(p * N, 100).simplificar();

/** ¿Es un decimal exacto (solo 2 y 5 en el denominador)? */
export function decimalExacto(f) {
  let d = f.simplificar().den;
  for (const k of [2, 5]) while (d % k === 0) d /= k;
  return d === 1;
}

// ─── Ejercicios 1 y 2: el mismo dato (p, N, parte) pedido por dos lados ────────

export const FACILES_P = Object.freeze([5, 10, 20, 25, 40, 50, 60, 75, 80, 90]);
export const FACILES_N = Object.freeze([10, 20, 25, 40, 50, 80, 100, 200]);
export const RANGO_N = Object.freeze([10, 500]);

function generarTrio(rng, sesion, n) {
  const primeros = (sesion?.aciertos ?? 0) < 3;
  for (let i = 0; i < 500; i++) {
    const p = rng.elegir(primeros ? FACILES_P : Array.from({ length: 99 }, (_, k) => k + 1));
    const m = multiploDe(p);
    const N = rng.elegir(primeros ? FACILES_N.filter(x => x % m === 0) : enRango(m, RANGO_N[0], RANGO_N[1]));
    if (N === undefined) continue;
    return { n, p, N, parte: parteDe(p, N).num };
  }
  throw new Error('generarTrio: sin datos');
}
export const generarPorcentaje = (rng, sesion) => generarTrio(rng, sesion, 1);
export const generarTotal = (rng, sesion) => generarTrio(rng, sesion, 2);

/** Lo que teclea el alumno: con unidad '%', el número suelto es un porcentaje; null si no se entiende. */
export const leerCampo = (texto, idioma, unidad = null) => deTexto(texto, unidad ? { unidad, idioma } : { magnitud: 'numero', idioma });

/**
 * Los errores con nombre de las dos preguntas con sus valores (fracciones exactas, P = el porcentaje, A = la parte,
 * T = el total). `null` si no se aplican, dan lo bueno o no son un decimal exacto (un periódico nunca es opción).
 */
const sinRepetir = (lista, bien) => {
  const vistos = [bien];
  return lista.flatMap(([error, v]) => {
    if (!v || v.num <= 0 || !decimalExacto(v)) return [];
    const s = v.simplificar();
    if (vistos.some(x => x.equals(s))) return [];
    vistos.push(s);
    return [{ error, valor: s }];
  });
};
export const erroresPorcentaje = (P, A, T) => sinRepetir([
  ['decimal-sin-pasar', P.dividir(100)],
  ['dividir-al-reves', T.dividir(A)],
  ['la-parte-como-porcentaje', A],
  ['restar', T.restar(A)],
], P);
export const erroresTotal = (P, A, T) => sinRepetir([
  ['porcentaje-del-dato', P.multiplicar(A).dividir(100)],
  ['multiplicar-por-el-porcentaje', P.multiplicar(A)],
  ['sumar-el-porcentaje', A.sumar(P)],
  ['dividir-sin-el-cien', A.dividir(P)],
], T);
export const erroresParte = (P, A, T) => sinRepetir([
  ['porcentaje-sin-dividir', P.multiplicar(T)],
  ['dividir-entre-el-porcentaje', T.dividir(P)],
  ['restar-el-porcentaje', T.restar(P)],
  ['dar-el-resto', T.restar(A)],
], A);
const ERRORES = { porcentaje: erroresPorcentaje, total: erroresTotal, parte: erroresParte };

/** El nombre del error de lo escrito (una Cantidad), o 'otro'. `unidad` es la de la respuesta ('%', '€', null…). */
export function errorDe(pregunta, P, A, T, escrito, unidad = null) {
  return ERRORES[pregunta](P, A, T).find(e => mismoValor(escrito, cantidad(e.valor, unidad)))?.error ?? 'otro';
}

const aFraccion = x => (typeof x === 'string' ? val(x) : fraccion(x));
export const trioDe = it => ({ P: fraccion(it.p), A: aFraccion(it.parte), T: aFraccion(it.total ?? it.N) });

// ─── Los contextos (ejercicios 3 y 4) ──────────────────────────────────────────

/** Los contextos de porcentaje del banco de proporcion.js (nunca uno de precio) y la cota propia de p. */
export const IDS_CONTEXTOS = Object.freeze(['clase', 'encuesta', 'club', 'tiros', 'test', 'ahorros']);
export const P_CONTEXTOS = Object.freeze([5, 90]);
export const PREGUNTAS = Object.freeze(['parte', 'porcentaje', 'total']);
export const ctxDe = id => CONTEXTOS.find(c => c.id === id && c.tipo === 'porcentaje');

function generarContexto(rng, n, pregunta) {
  for (let i = 0; i < 2000; i++) {
    const ctx = ctxDe(rng.elegir(IDS_CONTEXTOS));
    const d = generarDatos(ctx, rng);
    const p = d.p.valor.num;
    if (d.p.valor.den !== 1 || p < P_CONTEXTOS[0] || p > P_CONTEXTOS[1]) continue;
    return { n, ctx: ctx.id, pregunta, total: guarda(d.total.valor), p, parte: guarda(d.parte.valor), nombres: d.nombres };
  }
  throw new Error('generarContexto: sin datos');
}

/** Ejercicio 3: un tercio de cada pregunta (parte, porcentaje, total). */
export const generarTipo = rng => generarContexto(rng, 3, rng.elegir(PREGUNTAS));

/** Ejercicio 4: la mitad piden el porcentaje, un tercio el total y el resto la parte. */
export function generarProblema(rng) {
  const k = rng.entero(0, 5);
  return generarContexto(rng, 4, k < 3 ? 'porcentaje' : k < 5 ? 'total' : 'parte');
}

/** Las cantidades del ítem con la unidad de su contexto. */
export function datosDe(item) {
  const ctx = ctxDe(item.ctx);
  return {
    total: cantidad(val(item.total), ctx.datos.total.unidad ?? null),
    p: cantidad(item.p, '%'),
    parte: cantidad(val(item.parte), ctx.datos.parte.unidad ?? null),
    nombres: item.nombres,
  };
}

/** La Cantidad que se pide. */
export const respuestaDe = item => {
  const d = datosDe(item);
  return item.pregunta === 'porcentaje' ? d.p : item.pregunta === 'total' ? d.total : d.parte;
};

/** La unidad de lectura de lo que se pide ('%', '€' o null si son personas, tiros, preguntas). */
export const unidadLectura = item => (item.pregunta === 'porcentaje' ? '%' : ctxDe(item.ctx).datos[item.pregunta].unidad ?? null);

/** Lo que va tras el campo: '%', '€', 'alumnos'… */
export function unidadDeCampo(item, idioma) {
  if (item.pregunta === 'porcentaje') return '%';
  const spec = ctxDe(item.ctx).datos[item.pregunta];
  return spec.etiqueta ? spec.etiqueta[idioma][1] : spec.unidad;
}

/** Un dato ('total' o 'parte') como texto con su unidad: «25 alumnos», «12,00 €». */
export function textoDato(item, clave, idioma) {
  const spec = ctxDe(item.ctx).datos[clave];
  const v = val(item[clave]);
  if (spec.etiqueta) return `${numeroATexto(v, idioma)} ${spec.etiqueta[idioma][v.equals(fraccion(1)) ? 0 : 1]}`;
  return aTexto(cantidad(v, spec.unidad), idioma);
}

export const aciertaProblema = (item, escrito) => mismoValor(escrito, respuestaDe(item));

export function errorProblema(item, escrito) {
  const { P, A, T } = { P: fraccion(item.p), A: val(item.parte), T: val(item.total) };
  return errorDe(item.pregunta, P, A, T, escrito, unidadLectura(item));
}
