// «Problemas de proporcionalidad directa» (PU2, tarea 214), unidad 7: la lógica de los cuatro ejercicios.
//   1. ¿Cuánto cuesta 1?      reducción a la unidad en dos casillas (1 kg ⟶ …; 5 kg ⟶ …)       (U7-1A-01, 1A-02)
//   2. ¿Qué planteamiento?    cuatro planteamientos de la regla de tres, sin el resultado        (U7-1A-04)
//   3. Resuelve y contesta    el número y la unidad de la respuesta; las dos direcciones         (U7-1A-05, 1C-10)
//   4. ¿Tiene sentido?        una solución dada; se elige el motivo de que sea absurda           (U7-1C-13)
// Los ítems son JSON plano (el contador los guarda con cada fallo): las cantidades, como «num/den».
// Las cuentas, los errores y los contextos vienen de `_comun/proporcion.js`; aquí solo se arman los ítems.

import {
  CONTEXTOS, generarDatos, proporcionDirecta, distractores, cantidad, mismoValor, esExacta,
  aTexto, numeroATexto, deTexto,
} from '../_comun/proporcion.js';
import { fraccion, comparar } from '../_comun/fracciones.js';

// ─── Los datos de cada contexto que no están en el banco ───────────────────────

const ET = (es1, es2, en1, en2) => ({ es: [es1, es2], en: [en1, en2] });

/**
 * Por contexto: los nombres de las dos magnitudes y de la razón (para los botones de unidad del ejercicio 3),
 * la pregunta al revés (dado `d`, preguntar por `c`) y si admite el ejercicio 1 (el precio de 1 tiene sentido).
 */
export const META = Object.freeze({
  'fruteria-naranjas': { A: ET('kg', 'kg', 'kg', 'kg'), B: ET('€', '€', '€', '€'), K: ET('€/kg', '€/kg', '€/kg', '€/kg'), unidad1: true,
    inv: { es: 'En una frutería, {a} de naranjas cuestan {b}. ¿Cuántos kilos de naranjas se pueden comprar con {d}?',
      en: 'At a fruit shop, {a} of oranges cost {b}. How many kilos of oranges can you buy with {d}? (fruit shop = frutería)' } },
  'fruteria-fresas': { A: ET('kg', 'kg', 'kg', 'kg'), B: ET('€', '€', '€', '€'), K: ET('€/kg', '€/kg', '€/kg', '€/kg'), unidad1: true,
    inv: { es: 'En el mercado, {a} de fresas cuestan {b}. ¿Cuántos kilos de fresas se pueden comprar con {d}?',
      en: 'At the market, {a} of strawberries cost {b}. How many kilos of strawberries can you buy with {d}? (strawberries = fresas)' } },
  'receta-harina': { A: ET('personas', 'personas', 'people', 'people'), B: ET('g', 'g', 'g', 'g'), K: ET('g por persona', 'g por persona', 'g per person', 'g per person'), unidad1: true,
    inv: { es: 'Un bizcocho para {a} lleva {b} de harina. ¿Para cuántas personas es un bizcocho con {d} de harina?',
      en: 'A sponge cake for {a} needs {b} of flour. How many people is a sponge cake with {d} of flour for? (flour = harina)' } },
  'receta-leche': { A: ET('personas', 'personas', 'people', 'people'), B: ET('mL', 'mL', 'mL', 'mL'), K: ET('mL por persona', 'mL por persona', 'mL per person', 'mL per person'), unidad1: true,
    inv: { es: 'Unas natillas para {a} llevan {b} de leche. ¿Para cuántas personas son unas natillas con {d} de leche?',
      en: 'Custard for {a} needs {b} of milk. How many people is custard with {d} of milk for? (custard = natillas)' } },
  'receta-huevos': { A: ET('personas', 'personas', 'people', 'people'), B: ET('huevos', 'huevos', 'eggs', 'eggs'), K: ET('huevos por persona', 'huevos por persona', 'eggs per person', 'eggs per person'), unidad1: false,
    inv: { es: 'Una tortilla para {a} lleva {b}. ¿Para cuántas personas es una tortilla con {d}?',
      en: 'An omelette for {a} needs {b}. How many people is an omelette with {d} for? (omelette = tortilla)' } },
  'consumo-coche': { A: ET('km', 'km', 'km', 'km'), B: ET('L', 'L', 'L', 'L'), K: ET('L/100 km', 'L/100 km', 'L/100 km', 'L/100 km'), unidad1: false,
    inv: { es: 'Un coche gasta {b} de gasolina en {a}. Si conduce igual, ¿cuántos kilómetros recorre con {d} de gasolina?',
      en: 'A car uses {b} of petrol to travel {a}. Driving in the same way, how many kilometres does it travel with {d} of petrol? (petrol = gasolina)' } },
  gasolinera: { A: ET('L', 'L', 'L', 'L'), B: ET('€', '€', '€', '€'), K: ET('€/L', '€/L', '€/L', '€/L'), unidad1: true,
    inv: { es: 'En una gasolinera, {a} de gasolina cuestan {b}. ¿Cuántos litros de gasolina se pueden echar con {d}?',
      en: 'At a petrol station, {a} of petrol cost {b}. How many litres of petrol can you put in for {d}? (petrol = gasolina)' } },
  cuadernos: { A: ET('cuadernos', 'cuadernos', 'notebooks', 'notebooks'), B: ET('€', '€', '€', '€'), K: ET('€ por cuaderno', '€ por cuaderno', '€ per notebook', '€ per notebook'), unidad1: true,
    inv: { es: '{a} iguales cuestan {b}. ¿Cuántos cuadernos se pueden comprar con {d}?',
      en: '{a}, all the same, cost {b}. How many notebooks can you buy with {d}? (notebooks = cuadernos)' } },
  'entradas-cine': { A: ET('entradas', 'entradas', 'tickets', 'tickets'), B: ET('€', '€', '€', '€'), K: ET('€ por entrada', '€ por entrada', '€ per ticket', '€ per ticket'), unidad1: true,
    inv: { es: 'En un cine, {a} cuestan {b}. ¿Cuántas entradas se pueden comprar con {d}?',
      en: 'At a cinema, {a} cost {b}. How many tickets can you buy with {d}? (tickets = entradas)' } },
});

export const IDS = Object.freeze(Object.keys(META));
export const ctxDe = id => CONTEXTOS.find(c => c.id === id && c.tipo === 'directa');
const IDS_UNIDAD = IDS.filter(id => META[id].unidad1);

// ─── Pasar de ítem a cantidades y a texto ──────────────────────────────────────

const guarda = c => `${c.valor.num}/${c.valor.den}`;
const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
/** La cantidad `clave` (a, b, c, d, k) del ítem, con la unidad que le da su contexto. */
export const Q = (item, clave) => {
  const spec = clave === 'k' ? null : ctxDe(item.ctx).datos[clave];
  return cantidad(val(item[clave]), spec?.unidad ?? null);
};

/** Una cantidad (a, b, c, d) como texto: «3,5 kg», «9,50 €», «4 personas». Con una Fraccion y la clave del lado, igual. */
export function txt(item, clave, idioma, valor = null) {
  const ctx = ctxDe(item.ctx);
  const spec = ctx.datos[clave];
  const v = valor ?? val(item[clave]);
  if (spec.etiqueta) return `${numeroATexto(v, idioma)} ${spec.etiqueta[idioma][v.equals(fraccion(1)) ? 0 : 1]}`;
  return aTexto(cantidad(v, spec.unidad ?? null), idioma);
}
/** Un número suelto (sin unidad) como texto. */
export const num = (f, idioma) => numeroATexto(f, idioma);
/** El nombre de la unidad del lado A o B (la de a y c, o la de b y d), en singular para 1. */
export function unidadDe(item, lado, idioma, uno = false) {
  const spec = ctxDe(item.ctx).datos[lado === 'A' ? 'a' : 'b'];
  if (spec.etiqueta) return spec.etiqueta[idioma][uno ? 0 : 1];
  return spec.unidad;
}
/** «1 kg», «1 cuaderno»: la unidad sola, con el 1 delante. */
export const unoDe = (item, idioma) => `1 ${unidadDe(item, 'A', idioma, true)}`;

const CIFRAS = { '€': 2, g: 0, mL: 0, L: 2, km: 0, kg: 1 };
const cifrasDe = (ctx, clave) => ctx.datos[clave].cifras ?? CIFRAS[ctx.datos[clave].unidad ?? null] ?? 0;
const exactoEnSuLado = (ctx, clave, f) => esExacta(f, cifrasDe(ctx, clave));
const cotaD = ctx => ctx.datos.d.cota;
const dentro = (f, [min, max]) => comparar(f, cantidad(min).valor) >= 0 && comparar(f, cantidad(max).valor) <= 0;

// ─── Un ítem base ──────────────────────────────────────────────────────────────

function base(rng, ids, extra = {}) {
  const ctx = ctxDe(rng.elegir(ids));
  const d = generarDatos(ctx, rng);
  return { ctx: ctx.id, a: guarda(d.a), b: guarda(d.b), c: guarda(d.c), d: guarda(d.d), k: guarda(d.k), ...extra };
}

/** Los números de la cuenta, para pasárselos a proporcion.js: a ⟶ b, c ⟶ x. */
export const cuenta = item => proporcionDirecta({ a: Q(item, 'a'), b: Q(item, 'b'), c: Q(item, 'c') });
/** Al revés: b ⟶ a, d ⟶ x (cuántos c salen con d). */
export const cuentaAlReves = item => proporcionDirecta({ a: Q(item, 'b'), b: Q(item, 'a'), c: Q(item, 'd') });
export const solucion = item => (item.sentido === 'inversa' ? cuentaAlReves(item) : cuenta(item)).resultado;

const dist = (candidatos, correcta) => distractores(candidatos, correcta);

// ─── Ejercicio 1: ¿cuánto cuesta 1? ────────────────────────────────────────────

export function generarUnidad(rng) { return { n: 1, ...base(rng, IDS_UNIDAD) }; }

/** Lo que vale 1 (b : a), con la unidad de b. */
export const valorDeUno = item => cantidad(val(item.k), Q(item, 'b').unidad);

/** Lo que el alumno escribe (texto) a número; null si no se entiende. */
export const leerCampo = (texto, idioma, unidad = null) => deTexto(texto, unidad ? { unidad, idioma } : { magnitud: 'numero', idioma });

/** El fallo de la casilla «1»: dividir al revés, sumar, o el otro número. */
export function errorUno(item, escrito) {
  const A = Q(item, 'a'), B = Q(item, 'b');
  const bien = valorDeUno(item);
  for (const e of dist([['invertir-razon', B.valor, A.valor], ['razonar-sumando', A, B, cantidad(1, A.unidad)], ['contestar-otra-cosa', B, bien]], bien)) {
    if (mismoValor(cantidad(e.valor.valor), cantidad(escrito.valor))) return e.error;
  }
  return 'otro';
}
/** El fallo de la casilla «c». */
export function errorCasilla(item, escrito) {
  const A = Q(item, 'a'), B = Q(item, 'b'), C = Q(item, 'c'), bien = Q(item, 'd');
  for (const e of dist([['razonar-sumando', A, B, C], ['inversa-en-directa', A, B, C], ['productos-en-linea', A.valor, B.valor, C.valor],
    ['contestar-otra-cosa', cantidad(val(item.k)), bien]], bien)) {
    if (mismoValor(cantidad(e.valor.valor), cantidad(escrito.valor))) return e.error;
  }
  return 'otro';
}

// ─── Ejercicio 2: ¿qué planteamiento? ──────────────────────────────────────────

/**
 * Las cuatro filas de planteamientos: cada una son dos filas de la tabla y la cuenta; solo una es la buena.
 *   buena            a ⟶ b / c ⟶ x     x = b · c : a
 *   columna          a ⟶ b / x ⟶ c     x = a · c : b     (la x en la columna que no es)
 *   cruzada          c ⟶ b / a ⟶ x     x = a · b : c     (la inversa, aplicada a una directa)
 *   suma             a ⟶ b / c ⟶ x     x = b + c − a     (sumar en vez de multiplicar)
 */
export function generarPlanteamiento(rng) {
  for (let i = 0; i < 200; i++) {
    const item = { n: 2, ...base(rng, IDS) };
    const A = Q(item, 'a'), B = Q(item, 'b'), C = Q(item, 'c');
    const mal = dist([['productos-en-linea', A.valor, B.valor, C.valor], ['inversa-en-directa', A, B, C], ['razonar-sumando', A, B, C]], Q(item, 'd'));
    if (mal.length < 3) continue;
    const todas = [
      { tipo: 'buena', error: null },
      ...mal.map(m => ({ tipo: m.error, error: m.error })),
    ];
    return { ...item, opciones: rng.barajar(todas).map(o => ({ ...o })) };
  }
  throw new Error('generarPlanteamiento: sin ítem con cuatro valores distintos');
}

/** El valor de x de cada planteamiento, por una segunda vía (la cuenta que muestra, sin pasar por ERRORES_TIPICOS). */
export function valorDelPlanteamiento(item, tipo) {
  const a = val(item.a), b = val(item.b), c = val(item.c);
  switch (tipo) {
    case 'buena': return b.multiplicar(c).dividir(a).simplificar();
    case 'productos-en-linea': return a.multiplicar(c).dividir(b).simplificar();
    case 'inversa-en-directa': return a.multiplicar(b).dividir(c).simplificar();
    case 'razonar-sumando': return b.sumar(c).restar(a).simplificar();
    default: throw new Error(`Planteamiento desconocido: ${tipo}`);
  }
}

// ─── Ejercicio 3: resuelve y contesta ──────────────────────────────────────────

export function generarContesta(rng) {
  const sentido = rng.azar() < 0.5 ? 'directa' : 'inversa';
  const item = { n: 3, sentido, ...base(rng, IDS) };
  return { ...item, orden: rng.barajar(['A', 'B', 'K']) };
}

/** La unidad buena de la respuesta: la de lo que se pide (b y d en directa; a y c al revés). */
export const unidadBuena = item => (item.sentido === 'inversa' ? 'A' : 'B');

/** El error numérico (el valor no es el bueno) por los candidatos del caso; 'otro' si no es ninguno conocido. */
export function errorContesta(item, escrito) {
  const A = Q(item, 'a'), B = Q(item, 'b'), C = Q(item, 'c'), D = Q(item, 'd'), K = cantidad(val(item.k));
  const bien = solucion(item);
  const candidatos = item.sentido === 'inversa'
    ? [['razonar-sumando', B, A, D], ['inversa-en-directa', B, A, D], ['contestar-otra-cosa', K, bien]]
    : [['razonar-sumando', A, B, C], ['inversa-en-directa', A, B, C], ['contestar-otra-cosa', K, bien]];
  for (const e of dist(candidatos, bien)) if (mismoValor(cantidad(e.valor.valor), cantidad(escrito.valor))) return e.error;
  return 'otro';
}

// ─── Ejercicio 4: ¿tiene sentido? ──────────────────────────────────────────────

export const MOTIVOS = Object.freeze(['ok', 'va-al-reves', 'unidad-equivocada', 'fuera-de-cota']);
const DIEZ = fraccion(10), CIEN = fraccion(100);

/**
 * La solución que se da: un tercio buena y el resto absurda por un solo motivo.
 *   va-al-reves        la de la inversa (con más cantidad sale menos): dentro de la cota y con la unidad buena
 *   unidad-equivocada  el valor bueno con la unidad del otro lado (3 kg en vez de 3 €), solo si ese valor es creíble en esa unidad
 *   fuera-de-cota      el valor bueno por 10 o por 100, con c > a (así sigue el sentido bueno y solo se sale de lo creíble)
 */
export function generarSentido(rng) {
  const motivo = rng.elegir(['ok', 'ok', 'ok', 'va-al-reves', 'va-al-reves', 'unidad-equivocada', 'unidad-equivocada', 'fuera-de-cota', 'fuera-de-cota']);
  for (let i = 0; i < 2000; i++) {
    const item = { n: 4, motivo, ...base(rng, IDS) };
    const ctx = ctxDe(item.ctx);
    const a = val(item.a), b = val(item.b), c = val(item.c), d = val(item.d);
    let mostrado = item.d, lado = 'B';
    if (motivo === 'va-al-reves') {
      const alReves = a.multiplicar(b).dividir(c).simplificar();
      if (!exactoEnSuLado(ctx, 'd', alReves) || !dentro(alReves, cotaD(ctx)) || alReves.equals(d)) continue;
      mostrado = `${alReves.num}/${alReves.den}`;
    } else if (motivo === 'unidad-equivocada') {
      if (!dentro(d, [ctx.datos.a.rango[0], ctx.datos.a.rango[1]]) || !exactoEnSuLado(ctx, 'a', d)) continue;
      lado = 'A';
    } else if (motivo === 'fuera-de-cota') {
      if (comparar(c, a) <= 0) continue;
      const mal = [DIEZ, CIEN].map(f => d.multiplicar(f).simplificar()).find(f => !dentro(f, cotaD(ctx)));
      if (!mal || !exactoEnSuLado(ctx, 'd', mal)) continue;
      mostrado = `${mal.num}/${mal.den}`;
    }
    return { ...item, mostrado, lado };
  }
  throw new Error('generarSentido: sin datos');
}

/** El valor que se da, como texto con la unidad que lleva (la buena, o la del otro lado si es el caso de la unidad). */
export function respuestaDada(item, idioma) {
  const f = val(item.mostrado);
  if (item.lado === 'B') return txt(item, 'd', idioma, f);
  const ctx = ctxDe(item.ctx);
  const spec = ctx.datos.a;
  if (spec.etiqueta) return `${num(f, idioma)} ${spec.etiqueta[idioma][f.equals(fraccion(1)) ? 0 : 1]}`;
  return aTexto(cantidad(f, spec.unidad), idioma);
}

/** ¿Lo dado por bueno es el valor de verdad (misma magnitud)? Lo dice el motivo. */
export const esCorrecta = item => item.motivo === 'ok';
