// «El tanto por ciento de una cantidad» (PU2, tarea 219), unidad 7: la lógica de los cuatro ejercicios.
//   1. De cabeza            el 10 %, 50 %, 25 %… de una cantidad que lo hace exacto            (U7-3A-01, 3C-05)
//   2. Con el decimal       el 15 % de 80: cualquier camino, solo se mira el resultado          (U7-3C-04)
//   3. ¿Qué operación?      cuatro cuentas sin hacer; solo una da el resultado                  (U7-3C-04)
//   4. Problemas            un paso con contexto: la parte, con su unidad                        (U7-3C-02, 3C-04)
// Los casos de la hoja 3 y del examen 3 no salen (reserva.js, por huella).
// Solo se pide la parte (el p % de N). Todo sale exacto: p · N es múltiplo de 100, sin redondeos.
// Los ítems son JSON plano (el contador los guarda con cada fallo); las cuentas vienen de `_comun/proporcion.js`.

import { CONTEXTOS, generarDatos, cantidad, mismoValor, deTexto, numeroATexto, aTexto, huellaCaso } from '../_comun/proporcion.js';
import { fraccion } from '../_comun/fracciones.js';
import { HUELLAS_RESERVADAS } from './reserva.js';

const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const guarda = f => `${f.num}/${f.den}`;
const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
const num = (f, idioma) => numeroATexto(f, idioma);

// ─── Casos reservados (la hoja 3 y el examen 3 de la unidad 7) ─────────────────────────────────

/** El caso por valor: el porcentaje y el total, sin unidades ni contexto y sin la pregunta. */
export function huellasDe(it) {
  const T = it.n === 4 ? val(it.total) : fraccion(it.N);
  return [huellaCaso('porcentaje-de', [fraccion(it.p, 100), T])];
}
export const esReservado = it => huellasDe(it).some(h => HUELLAS_RESERVADAS.has(h));
/** Sortea de nuevo mientras el caso sea del papel. */
function sinReservados(generar) {
  return rng => {
    for (let i = 0; i < 200; i++) { const it = generar(rng); if (!esReservado(it)) return it; }
    throw new Error('sinReservados: todos los casos reservados');
  };
}

/** El resultado de p · N : 100 como fracción irreducible (un natural en todos los ítems generados). */
export const parteDe = (p, N) => fraccion(p * N, 100).simplificar();

/** ¿Es el número un decimal exacto (solo 2 y 5 en el denominador)? */
export function decimalExacto(f) {
  let d = f.simplificar().den;
  for (const k of [2, 5]) while (d % k === 0) d /= k;
  return d === 1;
}

// ─── Ejercicio 1: de cabeza ────────────────────────────────────────────────────

/** Cada porcentaje de cabeza con el múltiplo que hace exacta la cuenta. */
export const DE_CABEZA = Object.freeze({
  50: 2, 25: 4, 75: 4, 10: 10, 20: 10, 30: 10, 40: 10, 60: 10, 70: 10, 90: 10, 5: 20, 1: 100, 2: 100, 3: 100,
});
export const PORCENTAJES_CABEZA = Object.freeze(Object.keys(DE_CABEZA).map(Number));
const enRango = (paso, min, max) => { const r = []; for (let n = Math.ceil(min / paso) * paso; n <= max; n += paso) r.push(n); return r; };

export const generarCabeza = sinReservados(rng => {
  const p = rng.elegir(PORCENTAJES_CABEZA);
  const N = rng.elegir(enRango(DE_CABEZA[p], 20, 800));
  return { n: 1, p, N };
});

// ─── Ejercicio 2: con el decimal ───────────────────────────────────────────────

export const PORCENTAJES_DECIMAL = Object.freeze(Array.from({ length: 99 }, (_, i) => i + 1).filter(p => !PORCENTAJES_CABEZA.includes(p)));
const UNA_CIFRA = PORCENTAJES_DECIMAL.filter(p => p < 10);
export const multiploDe = p => 100 / mcd(p, 100);

export const generarDecimal = sinReservados(rng => {
  const p = rng.azar() < 1 / 3 ? rng.elegir(UNA_CIFRA) : rng.elegir(PORCENTAJES_DECIMAL);
  const N = rng.elegir(enRango(multiploDe(p), 20, 1000));
  return { n: 2, p, N };
});

/** Lo que el alumno teclea (número suelto); null si no se entiende. */
export const leerCampo = (texto, idioma, unidad = null) => deTexto(texto, unidad ? { unidad, idioma } : { magnitud: 'numero', idioma });

/**
 * Los errores con nombre de «el p % de N» y su valor: todos como fracciones exactas. `null` si no se aplican
 * o dan lo bueno. Los ids son los de `ERRORES_TIPICOS` donde existen.
 */
export function erroresDe(p, N) {
  const bien = parteDe(p, N);
  const c = [
    ['dividir-entre-el-porcentaje', fraccion(N, p)],
    ['porcentaje-sin-dividir', fraccion(p * N)],
    ['porcentaje-entre-mil', fraccion(p * N, 1000)],
    ['porcentaje-entre-diez', fraccion(p * N, 10)],
    ['restar-el-porcentaje', fraccion(N - p)],
    ['dar-el-resto', fraccion(N).restar(bien)],
    ...(p === 25 ? [['mitad-por-cuarto', fraccion(N, 2)]] : []),
  ];
  const vistos = [];
  const r = [];
  for (const [error, valor] of c) {
    const v = valor.simplificar();
    if (v.num <= 0 || v.equals(bien) || vistos.some(x => x.equals(v))) continue;
    vistos.push(v);
    r.push({ error, valor: v });
  }
  return r;
}

/** El nombre del error del valor escrito; 'otro' si no es ninguno conocido. */
export function errorDe(p, N, escrito) {
  return erroresDe(p, N).find(e => e.valor.equals(escrito.valor))?.error ?? 'otro';
}

// ─── Ejercicio 3: ¿qué operación? ──────────────────────────────────────────────

export const ESTILOS = Object.freeze(['decimal', 'fraccion', 'orden']);

/**
 * La cuenta de cada tipo para el p % de N, sin hacer: `partes` son los operandos (en HTML en el ejercicio) y `valor`
 * lo que da, con fracciones exactas. `null` si no se aplica (o su valor no es un decimal exacto, que nunca es opción).
 */
export function cuentaDe(tipo, p, N) {
  const P = fraccion(p), Nn = fraccion(N), CIEN = fraccion(100);
  const por = (a, b) => a.multiplicar(b).simplificar();
  const c = {
    decimal: { forma: 'prod', a: P.dividir(CIEN).simplificar(), b: Nn, valor: por(P.dividir(CIEN), Nn) },
    fraccion: { forma: 'fraccion', p, b: Nn, valor: por(P.dividir(CIEN), Nn) },
    orden: { forma: 'orden', N, p, valor: por(Nn.dividir(CIEN), P) },
    'dividir-entre-el-porcentaje': { forma: 'div', a: Nn, b: P, valor: Nn.dividir(P).simplificar() },
    'porcentaje-sin-dividir': { forma: 'prod', a: P, b: Nn, valor: por(P, Nn) },
    'porcentaje-entre-mil': { forma: 'prod', a: P.dividir(fraccion(1000)).simplificar(), b: Nn, valor: por(P.dividir(fraccion(1000)), Nn) },
    'porcentaje-entre-diez': { forma: 'prod', a: P.dividir(fraccion(10)).simplificar(), b: Nn, valor: por(P.dividir(fraccion(10)), Nn) },
    'restar-el-porcentaje': { forma: 'resta', a: Nn, b: P, valor: Nn.restar(P).simplificar() },
    'dividir-por-el-decimal': { forma: 'div', a: Nn, b: P.dividir(CIEN).simplificar(), valor: Nn.dividir(P.dividir(CIEN)).simplificar() },
  }[tipo];
  if (!c || c.valor.num <= 0 || !decimalExacto(c.valor)) return null;
  return c;
}

export const DISTRACTORES = Object.freeze([
  'dividir-entre-el-porcentaje', 'porcentaje-sin-dividir', 'porcentaje-entre-mil', 'porcentaje-entre-diez',
  'restar-el-porcentaje', 'dividir-por-el-decimal',
]);

/** Cuatro cuentas: la buena (de un estilo que rota) y tres errores con nombre, de valores distintos entre sí. */
export const generarOperacion = sinReservados(rng => {
  for (let i = 0; i < 500; i++) {
    const p = rng.elegir(PORCENTAJES_DECIMAL);
    const N = rng.elegir(enRango(multiploDe(p), 20, 1000));
    const estilo = rng.elegir(ESTILOS);
    const buena = cuentaDe(estilo, p, N);
    const bien = parteDe(p, N);
    const vistos = [bien];
    const malas = [];
    for (const t of rng.barajar([...DISTRACTORES])) {
      const c = cuentaDe(t, p, N);
      if (!c || vistos.some(v => v.equals(c.valor))) continue;
      vistos.push(c.valor);
      malas.push({ tipo: t, error: t });
      if (malas.length === 3) break;
    }
    if (!buena || malas.length < 3) continue;
    return { n: 3, p, N, estilo, opciones: rng.barajar([{ tipo: estilo, error: null }, ...malas]) };
  }
  throw new Error('generarOperacion: sin ítem con cuatro valores distintos');
});

// ─── Ejercicio 4: problemas ────────────────────────────────────────────────────

/** Los contextos de «la parte» del banco de proporcion.js y la cota propia de p para que sea creíble. */
export const IDS_PROBLEMAS = Object.freeze(['clase', 'encuesta', 'club', 'tiros', 'test', 'ahorros']);
export const P_PROBLEMAS = Object.freeze([5, 95]);
/** El regalo de `ahorros`, como mucho 60,00 € (la entrada de 3-60 € de la unidad 5): 95 % de 500 € no es creíble. */
export const REGALO_MAX = 60;
export const ctxDe = id => CONTEXTOS.find(c => c.id === id && c.tipo === 'porcentaje');

export const generarProblema = sinReservados(rng => {
  for (let i = 0; i < 2000; i++) {
    const ctx = ctxDe(rng.elegir(IDS_PROBLEMAS));
    const d = generarDatos(ctx, rng);
    const p = d.p.valor.num;
    if (p < P_PROBLEMAS[0] || p > P_PROBLEMAS[1] || d.p.valor.den !== 1) continue;
    if (ctx.id === 'ahorros' && d.parte.valor.num > REGALO_MAX * d.parte.valor.den) continue;
    return { n: 4, ctx: ctx.id, total: guarda(d.total.valor), p, parte: guarda(d.parte.valor), nombres: d.nombres };
  }
  throw new Error('generarProblema: sin datos');
});

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

/** La unidad que sigue al campo (€, alumnos…) y la que pide `leerCampo`. */
export function unidadDeProblema(item, idioma) {
  const spec = ctxDe(item.ctx).datos.parte;
  return spec.etiqueta ? spec.etiqueta[idioma][1] : spec.unidad;
}
export const unidadLectura = item => ctxDe(item.ctx).datos.parte.unidad ?? null;

/** La respuesta como texto con su unidad: «5 alumnos», «12,00 €». */
export function textoParte(item, idioma, valor = null) {
  const spec = ctxDe(item.ctx).datos.parte;
  const v = valor ?? val(item.parte);
  if (spec.etiqueta) return `${num(v, idioma)} ${spec.etiqueta[idioma][v.equals(fraccion(1)) ? 0 : 1]}`;
  return aTexto(cantidad(v, spec.unidad), idioma);
}

/** El error del problema: el mismo nombre de los ejercicios 2 y 3 (o 'otro'). */
export function errorProblema(item, escrito) {
  return errorDe(item.p, val(item.total).num, escrito);
}

export const aciertaProblema = (item, escrito) => mismoValor(escrito, datosDe(item).parte);
