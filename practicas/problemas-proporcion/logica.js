// «Problemas de toda la unidad» (PU2, tarea 224), unidad 7: la lógica de los tres ejercicios que el acta de la 02 admite
// por ahora (sin acta: no se escriben la velocidad ni el cambio de moneda ni la casilla «inversa»).
//   1. ¿Qué tipo de problema es?   directa, porcentaje, reparto o escala                  (U7-5A-01)
//   4. La mejor oferta              dos envases, se elige por el precio por unidad          (U7-5A-03)
//   5. ¿Tiene sentido?              una respuesta dada: bien, la unidad, el redondeo o absurda (U7-5A-04, 5A-06, 1C-11)
// Los ítems son JSON plano (el contador los guarda con cada fallo): las cantidades, como «num/den».
// Las cuentas y los contextos vienen de `_comun/proporcion.js`; aquí solo se arman los ítems.

import {
  CONTEXTOS, generarDatos, cantidad, esExacta, normalizarCaso, huella,
} from '../_comun/proporcion.js';
import { fraccion, comparar } from '../_comun/fracciones.js';

// ─── Lo que ya salió en las hojas (en claro) y en los exámenes (huella FNV-1a del caso normalizado) ───

/** Casos de las hojas, normalizados con `normalizarCaso`. Vacío hasta que existan la hoja y el examen del paquete 5. */
export const CASOS_HOJA = new Set([]);
/** Huellas (calculadas fuera del repo) de los casos de los exámenes. */
export const HUELLAS_EXAMEN = new Set([]);
export const esReservado = (tipo, datos) => {
  const caso = normalizarCaso(tipo, datos);
  return CASOS_HOJA.has(caso) || HUELLAS_EXAMEN.has(huella(caso));
};

const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const guarda = f => `${f.num}/${f.den}`;
const dentro = (f, [min, max]) => comparar(f, cantidad(min).valor) >= 0 && comparar(f, cantidad(max).valor) <= 0;
/** Fuera de la cota por un factor de 10 o más (por arriba o por abajo). */
export const muyFuera = (f, [min, max]) => comparar(f, cantidad(max).valor.multiplicar(fraccion(10))) >= 0 || comparar(f.multiplicar(fraccion(10)), cantidad(min).valor) <= 0;

// ─── Ejercicio 1: ¿qué tipo de problema es? ────────────────────────────────────

export const TIPOS = Object.freeze(['directa', 'porcentaje', 'reparto', 'escala']);
const TIPO_DE_CTX = { directa: 'directa', porcentaje: 'porcentaje', descuento: 'porcentaje', aumento: 'porcentaje', reparto: 'reparto', escala: 'escala' };
const SIN_CASILLA = new Set(['refresco']);
const IDS_TIPO = Object.fromEntries(TIPOS.map(t => [t, CONTEXTOS.filter(c => TIPO_DE_CTX[c.tipo] === t && !SIN_CASILLA.has(c.id)).map(c => c.id)]));

export const ctxPorId = id => CONTEXTOS.find(c => c.id === id);

/** Los datos del ítem (cadenas «num/den») a Cantidades con la unidad de su contexto, listos para `enunciado`. */
export function datosDe(item) {
  const ctx = ctxPorId(item.ctx);
  const d = {};
  for (const [clave, s] of Object.entries(item.v)) d[clave] = cantidad(val(s), ctx.datos[clave]?.unidad ?? null);
  if (item.nombres) d.nombres = item.nombres;
  return d;
}

const empaquetar = (ctx, d) => Object.fromEntries(Object.keys(ctx.datos).map(k => [k, guarda(d[k].valor)]));

export function generarTipo(rng) {
  for (let i = 0; i < 500; i++) {
    const tipo = rng.elegir(TIPOS);
    const ctx = ctxPorId(rng.elegir(IDS_TIPO[tipo]));
    const d = generarDatos(ctx, rng);
    if (esReservado(tipo, Object.fromEntries(Object.keys(ctx.datos).map(k => [k, d[k]])))) continue;
    return { n: 1, tipo, ctx: ctx.id, v: empaquetar(ctx, d), nombres: d.nombres ?? null };
  }
  throw new Error('generarTipo: sin ítem libre');
}

// ─── Ejercicio 4: la mejor oferta ──────────────────────────────────────────────

/**
 * Por producto: el precio por unidad (céntimos, de 5 en 5) dentro de su cota y los tamaños de envase que se venden.
 * Se elige primero el precio por unidad y se multiplica: así los dos cocientes son exactos al céntimo.
 */
export const PRODUCTOS = Object.freeze({
  zumo: { pu: [90, 300], envases: [1, 2, 3, 5, 6], por: 'L' },
  leche: { pu: [70, 160], envases: [1, 2, 3, 5, 6], por: 'L' },
  arroz: { pu: [80, 300], envases: [1, 2, 3, 5], por: 'kg' },
  manzanas: { pu: [100, 600], envases: [1, 2, 3, 5], por: 'kg' },
  yogures: { pu: [20, 90], envases: [4, 6, 8, 12], por: 'yogur' },
  cuadernos: { pu: [80, 300], envases: [2, 3, 5], por: 'cuaderno' },
});
export const IDS_PRODUCTO = Object.freeze(Object.keys(PRODUCTOS));
const PRECIO_MAX = 3000;

/** Quién gana por el precio por unidad, con enteros (producto cruzado): 0, 1 o 2 (empate). */
export function mejorOferta(e) {
  const [[q1, p1], [q2, p2]] = e;
  const x = p1 * q2, y = p2 * q1; // precio de 1 unidad de la primera < de la segunda ⇔ p1/q1 < p2/q2 ⇔ p1·q2 < p2·q1
  return x < y ? 0 : x > y ? 1 : 2;
}

export function generarOferta(rng) {
  const empate = rng.azar() < 0.15, grandeGana = rng.azar() < 0.5;
  for (let i = 0; i < 1000; i++) {
    const prod = rng.elegir(IDS_PRODUCTO);
    const P = PRODUCTOS[prod];
    const [q1, q2] = rng.barajar(P.envases).slice(0, 2);
    const paso = (P.pu[1] - P.pu[0]) / 5;
    const nuevo = () => P.pu[0] + 5 * rng.entero(0, paso);
    const pu1 = nuevo();
    let pu2 = pu1;
    if (!empate) {
      const grande = q1 > q2 ? 1 : 2;
      do { pu2 = nuevo(); } while (pu2 === pu1);
      const gana1 = (pu1 < pu2);
      if (((grande === 1) === gana1) !== grandeGana) continue;
    }
    const e = [[q1, pu1 * q1], [q2, pu2 * q2]];
    if (e.some(([, p]) => p > PRECIO_MAX || p < 20)) continue;
    if (esReservado('oferta', e.flat().sort((a, b) => a - b))) continue;
    return { n: 4, prod, e, buena: mejorOferta(e) };
  }
  throw new Error('generarOferta: sin ítem libre');
}

/** Lo que ve el alumno si elige mal: el error y el motivo (el más barato en total, el grande, o el empate). */
export function errorOferta(item, elegida) {
  if (elegida === item.buena) return null;
  if (elegida === 2) return 'cree-que-cuestan-lo-mismo';
  const [[q1, p1], [q2, p2]] = item.e;
  const barato = p1 < p2 ? 0 : 1;
  if (elegida === barato) return 'mas-barato-en-total';
  const grande = q1 > q2 ? 0 : 1;
  return elegida === grande ? 'el-grande-siempre' : 'otro';
}

// ─── Ejercicio 5: ¿tiene sentido la respuesta? ─────────────────────────────────

export const MOTIVOS = Object.freeze(['ok', 'unidad', 'redondeo', 'absurdo']);

/** Contextos de «hacen falta N»: el cociente tiene decimales exactos y hay que redondear hacia arriba. */
export const REDONDEO = Object.freeze({
  autobuses: { total: [100, 400, 10], cap: [40, 50], por: { es: 'plazas', en: 'seats' }, cosa: { es: ['autobús', 'autobuses'], en: ['bus', 'buses'] } },
  coches: { total: [10, 40, 1], cap: [4, 5], por: { es: 'plazas', en: 'seats' }, cosa: { es: ['coche', 'coches'], en: ['car', 'cars'] } },
  cajas: { total: [25, 195, 5], cap: [10, 20], por: { es: 'unidades', en: 'pens' }, cosa: { es: ['caja', 'cajas'], en: ['box', 'boxes'] } },
});
export const IDS_REDONDEO = Object.freeze(Object.keys(REDONDEO));

const CTX_SENTIDO = Object.freeze({
  directa: CONTEXTOS.filter(c => c.tipo === 'directa' && c.datos.b.unidad === '€' && !c.porCada).map(c => c.id),
  descuento: CONTEXTOS.filter(c => c.tipo === 'descuento').map(c => c.id),
  porcentaje: ['clase', 'encuesta', 'club', 'tiros', 'test'],
  escala: CONTEXTOS.filter(c => c.tipo === 'escala').map(c => c.id),
});
const CLAVE_RESPUESTA = { directa: 'd', descuento: 'final', porcentaje: 'parte', escala: 'real' };
const UNIDADES_ESCALA = ['cm', 'm', 'km'];

const ceil = f => fraccion(Math.ceil(f.num / f.den));
const cotaDe = (ctx, clave) => ctx.datos[clave].cota;
const exactoEn = (ctx, clave, f) => esExacta(cantidad(f, ctx.datos[clave].unidad ?? null), ctx.datos[clave].cifras ?? (ctx.datos[clave].unidad === '€' ? 2 : 0));

/**
 * Un ítem: el enunciado de un contexto y la respuesta de un compañero, con un solo defecto o ninguno (un tercio, bien).
 *   ok        el valor bueno con su unidad
 *   unidad    el valor bueno con la unidad de otro lado (9,00 kg en vez de 9,00 €; 1,5 cm en vez de 1,5 km)
 *   redondeo  (solo «hacen falta N»): 7,5 autobuses; el bueno son 8
 *   absurdo   la unidad es la buena y el valor, no: fuera de la cota por un factor de 10 o más, o un descuento que sube el precio
 */
export function generarSentido(rng) {
  const motivo = rng.elegir(['ok', 'ok', 'ok', 'unidad', 'unidad', 'redondeo', 'redondeo', 'absurdo', 'absurdo']);
  const redondea = motivo === 'redondeo' || (motivo === 'ok' && rng.azar() < 0.25);
  const kind = redondea ? 'redondeo' : rng.elegir(motivo === 'unidad' ? ['directa', 'escala'] : motivo === 'absurdo' ? ['directa', 'descuento', 'porcentaje', 'escala'] : Object.keys(CTX_SENTIDO));
  for (let i = 0; i < 3000; i++) {
    if (redondea) {
      const id = rng.elegir(IDS_REDONDEO);
      const R = REDONDEO[id];
      const cap = rng.elegir(R.cap);
      const total = R.total[0] + R.total[2] * rng.entero(0, (R.total[1] - R.total[0]) / R.total[2]);
      if (total % cap === 0) continue;
      const cociente = fraccion(total, cap).simplificar();
      if (esReservado('sentido-redondeo', [total, cap])) continue;
      return { n: 5, motivo, kind, ctx: id, total, cap, mostrado: guarda(motivo === 'ok' ? ceil(cociente) : cociente) };
    }
    const ctx = ctxPorId(rng.elegir(CTX_SENTIDO[kind]));
    const d = generarDatos(ctx, rng);
    const clave = CLAVE_RESPUESTA[kind];
    const bien = d[clave].valor;
    let mostrado = bien, unidad = null;
    if (motivo === 'unidad') {
      if (kind === 'escala') {
        unidad = rng.elegir(UNIDADES_ESCALA.filter(u => u !== ctx.datos.real.unidad));
      } else {
        const a = ctx.datos.a;
        if (!dentro(bien, [a.rango[0], a.rango[1]]) || !esExacta(cantidad(bien, a.unidad ?? null), a.cifras ?? 0)) continue;
        unidad = 'A';
      }
    } else if (motivo === 'absurdo') {
      if (kind === 'descuento') mostrado = d.precio.valor.sumar(d.cambio.valor).simplificar();
      else if (kind === 'porcentaje') mostrado = d.total.valor.multiplicar(d.p.valor).simplificar();
      else if (kind === 'escala') mostrado = d.plano.valor.multiplicar(d.escala.valor).simplificar();
      else {
        if (comparar(d.c.valor, d.a.valor) <= 0) continue;
        mostrado = [fraccion(10), fraccion(100)].map(f => bien.multiplicar(f).simplificar()).find(f => muyFuera(f, cotaDe(ctx, 'd')));
        if (!mostrado || !exactoEn(ctx, 'd', mostrado)) continue;
      }
      if (kind !== 'descuento' && !muyFuera(mostrado, cotaDe(ctx, clave))) continue;
    }
    if (esReservado(`sentido-${kind}`, Object.fromEntries(Object.keys(ctx.datos).map(k => [k, d[k]])))) continue;
    return { n: 5, motivo, kind, ctx: ctx.id, v: empaquetar(ctx, d), nombres: d.nombres ?? null, mostrado: guarda(mostrado), unidad };
  }
  throw new Error('generarSentido: sin ítem libre');
}

/** La respuesta buena de un ítem del ejercicio 5 (el valor, como Fraccion). */
export function valorBueno(item) {
  if (item.kind === 'redondeo') return ceil(fraccion(item.total, item.cap).simplificar());
  return val(item.v[CLAVE_RESPUESTA[item.kind]]);
}
export const claveRespuesta = kind => CLAVE_RESPUESTA[kind];
