// «La fracción de una cantidad» (PU2, tarea 103): lógica pura (sin DOM ni red).
//
// Cuatro ejercicios, cuyos ítems son DATOS; las frases (en los dos idiomas) salen de `textos.js`:
//   1. generarCalculo   { n, d, total, resultado }                    3/5 de 40 (U4-1C-08, 1C-09)
//   2. generarContexto  { ctx, n, d, total, resultado }               la misma cuenta con contexto (U4-1A-01)
//   3. generarParte     { ctx, tipo, parte, total [, otra] }          ¿qué fracción es? (U4-1C-04, 1A-03)
//   4. generarProblema  { variante, esc, total, f1, [f2], [dato],     el problema de cuatro respuestas
//                         opciones }                                  (U4-1A-01, 1A-02, 2A-02, 2A-03)
//
// Cada contexto lleva su cota creíble (`min`–`max`, de la regla de realismo del 16-10 y del
// acta del 26-10, punto j); la cantidad de la que se toma la fracción es siempre múltiplo del
// denominador, para que el resultado sea un entero. Los distractores salen de errores típicos
// con nombre: los de `_comun/fracciones.js` (`ERRORES_TIPICOS`) y los propios de esta práctica
// (`ERRORES_PROPIOS`). Ninguna opción repite el valor de otra ni el de la correcta, y todas
// caben en la cota del contexto.

import { fraccion, ERRORES_TIPICOS } from '../_comun/fracciones.js';

const DENOMINADORES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
// Para dos fracciones de la misma cantidad: denominadores cuyo m.c.m. no se dispara.
const DEN_DOS = [2, 3, 4, 5, 6, 8, 10, 12];

const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
const mcm = (a, b) => (a / mcd(a, b)) * b;

/**
 * Casos que las hojas de la unidad 4 ya han dado a los alumnos y se guardan para el examen
 * (regla 9 del reparto; `RESERVADOS_ANTERIORES` de `comprobar-semana3.py`): la práctica no
 * los saca nunca. Fracción de una cantidad: [numerador, denominador, cantidad].
 */
export const RESERVADOS = {
  fraccionDe: [[3, 4, 44], [5, 8, 56], [4, 9, 72]],
  parte: [[15, 27]],
  // Ejercicio 4: «5/8 de un depósito son 35 L», «5/12 y 21 L» y «1/5 y 3/10 de 150».
  problema: [
    { f: [5, 8], dato: 35 },
    { f: [5, 12], dato: 21 },
    { f: [1, 5], g: [3, 10], total: 150 },
  ],
};

const esReservadoFraccionDe = (n, d, total) => RESERVADOS.fraccionDe.some(([a, b, c]) => a === n && b === d && c === total);
const mismaFraccion = (x, [a, b]) => x.n * b === x.d * a;

/** ¿Es el ítem del ejercicio 4 uno de los casos reservados? */
export function esReservadoProblema(item) {
  if (esReservadoFraccionDe(item.f1.n, item.f1.d, item.total)) return true;
  if (item.f2 && esReservadoFraccionDe(item.f2.n, item.f2.d, item.total)) return true;
  return RESERVADOS.problema.some(r => {
    if (r.g) return item.f2 && item.total === r.total && ((mismaFraccion(item.f1, r.f) && mismaFraccion(item.f2, r.g)) || (mismaFraccion(item.f1, r.g) && mismaFraccion(item.f2, r.f)));
    return item.dato !== undefined && item.dato === r.dato && mismaFraccion(item.f1, r.f);
  });
}

/** La fracción de un ítem ({ n, d } → Fraccion). */
export const F = x => fraccion(x.n, x.d);

/** Errores típicos propios de la práctica (los demás vienen de `_comun/fracciones.js`). */
export const ERRORES_PROPIOS = {
  'multiplica-sin-dividir': {
    nombre: { es: 'Ha multiplicado la cantidad por el numerador sin dividir', en: 'Multiplied the amount by the numerator without dividing' },
  },
  'sin-simplificar': {
    nombre: { es: 'La fracción es la buena, pero no está simplificada', en: 'The fraction is right, but it is not in its simplest form' },
  },
  'da-la-fraccion-en-vez-de-la-cantidad': {
    nombre: { es: 'Ha dado la fracción en vez de la cantidad', en: 'Gave the fraction instead of the amount' },
  },
  'resta-el-numerador': {
    nombre: { es: 'Ha restado el numerador como si fuera la cantidad', en: 'Subtracted the numerator as if it were the amount' },
  },
  'olvida-restar-la-primera': {
    nombre: { es: 'Ha olvidado restar la primera parte', en: 'Forgot to subtract the first part' },
  },
  'olvida-restar-la-segunda': {
    nombre: { es: 'Ha olvidado restar la segunda parte', en: 'Forgot to subtract the second part' },
  },
  'cuenta-una-parte-de-menos': {
    nombre: { es: 'Ha contado una parte de menos', en: 'Counted one part too few' },
  },
  'cuenta-una-parte-de-mas': {
    nombre: { es: 'Ha contado una parte de más', en: 'Counted one part too many' },
  },
  'duplica-el-dato': {
    nombre: { es: 'Ha doblado el dato, como si fuera la mitad', en: 'Doubled the given amount, as if it were half' },
  },
  'multiplica-el-dato-por-el-denominador': {
    nombre: { es: 'Ha multiplicado el dato por el denominador', en: 'Multiplied the given amount by the denominator' },
  },
  'da-el-resto': {
    nombre: { es: 'Ha dado lo que falta en vez del total', en: 'Gave what is missing instead of the whole' },
  },
  'da-la-parte-ya-hecha': {
    nombre: { es: 'Ha dado la parte que ya hay en vez del total', en: 'Gave the part that is already there instead of the whole' },
  },
  'otro-error': {
    nombre: { es: 'Otro error', en: 'Another mistake' },
  },
};

/** ¿Es `id` un error con nombre (de la base o propio)? */
export const errorConNombre = id => id in ERRORES_TIPICOS || id in ERRORES_PROPIOS;

// ─── Ejercicio 1: calcula ──────────────────────────────────────────────────────

/** Ítem: { n, d, total, resultado }. 1/4 de las veces unitaria; total ≤ 200, múltiplo de d. */
export function generarCalculo(rng) {
  for (;;) {
    const d = rng.elegir(DENOMINADORES);
    const n = rng.azar() < 0.25 ? 1 : rng.entero(1, d - 1);
    const k = rng.entero(2, Math.min(20, Math.floor(200 / d)));
    if (esReservadoFraccionDe(n, d, d * k)) continue;
    return { n, d, total: d * k, resultado: n * k };
  }
}

/** Un numerador de 1 a d − 1 primo con d: la fracción del enunciado sale irreducible. */
const numeradorIrreducible = (rng, d) => rng.elegir(Array.from({ length: d - 1 }, (_, i) => i + 1).filter(n => mcd(n, d) === 1));

/** El paso a paso de la cuenta: { k: lo que vale 1/d, resultado }. */
export const pasos = item => ({ k: item.total / item.d, resultado: item.resultado });

/**
 * Qué error explica un resultado equivocado `v` (el entero que escribió el alumno), con
 * los números del ítem: el nombre del error típico o `otro-error`; `null` si es el bueno.
 */
export function errorDeCalculo(item, v) {
  if (v === item.resultado) return null;
  const f = F(item);
  for (const id of ['fraccion-de-al-reves', 'se-queda-en-la-unitaria', 'multiplica-por-el-denominador']) {
    const r = ERRORES_TIPICOS[id].fn(f, item.total);
    if (r && r.esEntera() && r.aEntero() === v) return id;
  }
  if (item.n > 1 && v === item.total * item.n) return 'multiplica-sin-dividir';
  return 'otro-error';
}

// ─── Ejercicio 2: con contexto ─────────────────────────────────────────────────

/**
 * Cota de cada contexto: la cantidad total `min`–`max` (en pasos de `paso`), los
 * denominadores que admite y la unidad en que se pide. Acta del 26-10, punto j: depósito
 * de coche 20-90 L; garrafa hasta 50 L; botella hasta 3 L; clase 12-36; instituto
 * 200-3000; pizza 3-15 trozos; ahorro hasta 2000 €; a pie o en bici hasta 50 km, en
 * coche hasta 1000 km; una hora son 60 minutos, en medias, cuartos, tercios, sextos y
 * doceavos. Si un contexto lleva `totales`, solo vale una cantidad de esa lista (la
 * botella: 1/5, 1/4, 2/5, 1/2, 3/4, 1, 3/2, 2, 5/2 y 3 L, en mililitros).
 */
export const CONTEXTOS = {
  deposito: { min: 20, max: 90, paso: 1, dens: [2, 3, 4, 5, 6, 8, 10], unidad: { es: 'litros', en: 'litres' } },
  garrafa: { min: 5, max: 50, paso: 1, dens: [2, 3, 4, 5, 6, 8, 10], unidad: { es: 'litros', en: 'litres' } },
  botella: { min: 200, max: 3000, paso: 50, totales: [200, 250, 400, 500, 750, 1000, 1500, 2000, 2500, 3000], dens: [2, 3, 4, 5, 6, 8, 10], unidad: { es: 'mililitros', en: 'millilitres' } },
  clase: { min: 12, max: 36, paso: 1, dens: DENOMINADORES, unidad: { es: 'alumnos', en: 'students' } },
  instituto: { min: 200, max: 3000, paso: 1, dens: DENOMINADORES, unidad: { es: 'alumnos', en: 'students' } },
  pizza: { min: 3, max: 15, paso: 1, dens: [2, 3, 4, 5, 6], unidad: { es: 'trozos', en: 'slices' } },
  ahorro: { min: 100, max: 2000, paso: 10, dens: [2, 3, 4, 5, 6, 8, 10], unidad: { es: 'euros', en: 'euros' } },
  bici: { min: 10, max: 50, paso: 1, dens: [2, 3, 4, 5, 6, 8, 10], unidad: { es: 'kilómetros', en: 'kilometres' } },
  coche: { min: 100, max: 1000, paso: 10, dens: [2, 3, 4, 5, 6, 8, 10], unidad: { es: 'kilómetros', en: 'kilometres' } },
  hora: { min: 60, max: 60, paso: 1, dens: [2, 3, 4, 6, 12], unidad: { es: 'minutos', en: 'minutes' } },
};
export const IDS_CONTEXTO = Object.keys(CONTEXTOS);

/** ¿Es `total` una cantidad creíble en ese contexto (entera, dentro de la cota, en su paso)? */
export const enCota = (cfg, total) => Number.isInteger(total) && total >= cfg.min && total <= cfg.max && total % cfg.paso === 0 && (!cfg.totales || cfg.totales.includes(total));

/** Las cantidades de la cota que son múltiplo de `d` (y de `mult`, si se pide). */
export function totalesPosibles(cfg, d, mult = 1) {
  const paso = mcm(cfg.paso, mcm(d, mult));
  if (cfg.totales) return cfg.totales.filter(t => t % paso === 0);
  const lista = [];
  for (let t = Math.ceil(cfg.min / paso) * paso; t <= cfg.max; t += paso) lista.push(t);
  return lista;
}

/** Ítem: { ctx, n, d, total, resultado }, con el total en la cota del contexto y múltiplo de d. */
export function generarContexto(rng) {
  for (let intento = 0; intento < 500; intento++) {
    const ctx = rng.elegir(IDS_CONTEXTO);
    const cfg = CONTEXTOS[ctx];
    const d = rng.elegir(cfg.dens);
    const posibles = totalesPosibles(cfg, d);
    if (!posibles.length) continue;
    const total = rng.elegir(posibles);
    const n = rng.azar() < 0.25 ? 1 : numeradorIrreducible(rng, d);
    if (esReservadoFraccionDe(n, d, total)) continue;
    return { ctx, n, d, total, resultado: (total / d) * n };
  }
  throw new Error('generarContexto: sin ítem posible');
}

// ─── Ejercicio 3: ¿qué fracción es? ────────────────────────────────────────────

/**
 * Grupos del ejercicio 3. `total`: el enunciado da la parte y el total («18 de los 30
 * alumnos…»). `partes`: da las dos partes y no el total («6 azules y 18 rojos…»; U4-1A-03),
 * y `min`–`max` acota la suma.
 */
export const GRUPOS = {
  andando: { tipo: 'total', min: 12, max: 36 },
  gafas: { tipo: 'total', min: 12, max: 36 },
  partidos: { tipo: 'total', min: 10, max: 38 },
  pegatinas: { tipo: 'total', min: 20, max: 120 },
  preguntas: { tipo: 'total', min: 10, max: 40 },
  rotuladores: { tipo: 'partes', min: 10, max: 40 },
  equipo: { tipo: 'partes', min: 10, max: 30 },
};
export const IDS_GRUPO = Object.keys(GRUPOS);

/**
 * Ítem: { ctx, tipo, parte, total [, otra] }. El 85 % de las veces la fracción se puede
 * simplificar; si no, la respuesta es la misma fracción del enunciado. En `partes`, la
 * pregunta es por la primera parte y `otra` es la segunda (total = parte + otra).
 */
export function generarParte(rng) {
  const ctx = rng.elegir(IDS_GRUPO);
  const g = GRUPOS[ctx];
  const simplificable = rng.azar() < 0.85;
  // La parte (y la otra parte, si se da) son siempre ≥ 2: con 1 el plural del enunciado no concuerda.
  let parte = 2, total = g.min;
  for (let intento = 0; intento < 500; intento++) {
    total = rng.entero(g.min, g.max);
    parte = rng.entero(2, total - (g.tipo === 'partes' ? 2 : 1));
    if (RESERVADOS.parte.some(([p, t]) => p === parte && t === total)) continue;
    if ((mcd(parte, total) > 1) === simplificable) break;
  }
  if (RESERVADOS.parte.some(([p, t]) => p === parte && t === total)) return generarParte(rng);
  return g.tipo === 'partes' ? { ctx, tipo: 'partes', parte, otra: total - parte, total } : { ctx, tipo: 'total', parte, total };
}

/** La respuesta buena, irreducible. */
export const respuestaParte = item => fraccion(item.parte, item.total).simplificar();

/**
 * Qué error explica la fracción `v` (Fraccion, tal como la escribió el alumno): `null` si es
 * la irreducible buena; `sin-simplificar` si vale lo mismo pero no está simplificada;
 * `parte-entre-el-resto` (8 de 20 → 8/12) o `otro-error`.
 */
export function errorDeParte(item, v) {
  const buena = fraccion(item.parte, item.total);
  if (v.equals(buena)) return v.esIrreducible() ? null : 'sin-simplificar';
  const e = ERRORES_TIPICOS['parte-entre-el-resto'].fn(item.parte, item.total);
  if (e && v.equals(e)) return 'parte-entre-el-resto';
  return 'otro-error';
}

// ─── Ejercicio 4: el problema ──────────────────────────────────────────────────

/**
 * Escenarios de cada variante, con su cota (`min`–`max`, `paso`). Variantes:
 *   queda      una fracción del total; se pregunta por lo que NO es esa parte
 *   dos        dos fracciones del total; se pregunta por el resto
 *   parte      una fracción del total vale `dato`; se pregunta por el total (U4-1A-02)
 *   restante   se ha hecho una fracción y faltan `dato`; se pregunta por el total (U4-2A-03)
 */
export const ESCENARIOS = {
  queda: {
    clase: { min: 12, max: 36, paso: 1, unidad: { es: 'alumnos', en: 'students' } },
    ahorro: { min: 100, max: 2000, paso: 10, unidad: { es: 'euros', en: 'euros' } },
    deposito: { min: 20, max: 90, paso: 1, unidad: { es: 'litros', en: 'litres' } },
    viaje: { min: 100, max: 1000, paso: 10, unidad: { es: 'kilómetros', en: 'kilometres' } },
    pizza: { min: 6, max: 15, paso: 1, unidad: { es: 'trozos', en: 'slices' } },
  },
  dos: {
    clase: { min: 12, max: 36, paso: 1, unidad: { es: 'alumnos', en: 'students' } },
    ahorro: { min: 100, max: 2000, paso: 10, unidad: { es: 'euros', en: 'euros' } },
    viaje: { min: 100, max: 1000, paso: 10, unidad: { es: 'kilómetros', en: 'kilometres' } },
  },
  parte: {
    clase: { min: 12, max: 36, paso: 1, unidad: { es: 'alumnos', en: 'students' } },
    libro: { min: 100, max: 600, paso: 1, unidad: { es: 'páginas', en: 'pages' } },
    ahorro: { min: 100, max: 2000, paso: 10, unidad: { es: 'euros', en: 'euros' } },
  },
  restante: {
    deposito: { min: 20, max: 90, paso: 1, unidad: { es: 'litros', en: 'litres' } },
    clase: { min: 12, max: 36, paso: 1, unidad: { es: 'alumnos', en: 'students' } },
  },
};
export const VARIANTES = Object.keys(ESCENARIOS);

/** La cota del escenario de un ítem del ejercicio 4. */
export const cotaDe = item => ESCENARIOS[item.variante][item.esc];

/** Una opción de cantidad con su error (null si es la buena). */
const cantidad = (v, error) => ({ tipo: 'cantidad', v, error });
const comoFraccion = (f, error) => ({ tipo: 'fraccion', n: f.num, d: f.den, error });

/** Un número de cantidad válido como opción: entero, ≥ 2, dentro de `tope` y distinto del bueno. */
const valido = (x, tope) => Number.isInteger(x) && x >= 2 && x <= tope;
const entero = fr => (fr && fr.esEntera() ? fr.aEntero() : null);

/**
 * Con la buena y el *pool* de candidatos (ya sin null), baraja el pool y se queda con tres
 * distintas (por valor) entre sí y de la buena. `null` si no salen tres: el llamante saca
 * otro ítem. (Trampa del motor: se baraja ANTES de cortar en tres.)
 */
function conOpciones(rng, buena, pool) {
  const vistos = new Set([`c${buena.v}`]);
  const elegidas = [];
  for (const o of rng.barajar(pool)) {
    const clave = o.tipo === 'cantidad' ? `c${o.v}` : `f${F(o).clave()}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    elegidas.push(o);
    if (elegidas.length === 3) break;
  }
  return elegidas.length === 3 ? rng.barajar([buena, ...elegidas]) : null;
}

function problemaQueda(rng) {
  const esc = rng.elegir(Object.keys(ESCENARIOS.queda));
  const cfg = ESCENARIOS.queda[esc];
  const d = rng.elegir(DENOMINADORES);
  const posibles = totalesPosibles(cfg, d);
  if (!posibles.length) return null;
  const total = rng.elegir(posibles);
  const n = numeradorIrreducible(rng, d);
  const f = fraccion(n, d), q = fraccion(d - n, d);
  const parte = (total / d) * n, queda = total - parte;
  if (queda < 2) return null;
  const tope = total - 1;
  const pool = [
    cantidad(entero(ERRORES_TIPICOS['gastado-como-queda'].fn(f)?.multiplicar(total)), 'gastado-como-queda'),
    cantidad(entero(ERRORES_TIPICOS['se-queda-en-la-unitaria'].fn(q, total)), 'se-queda-en-la-unitaria'),
    cantidad(total - n, 'resta-el-numerador'),
    comoFraccion(q, 'da-la-fraccion-en-vez-de-la-cantidad'),
  ].filter(o => o.tipo === 'fraccion' || valido(o.v, tope));
  const opciones = conOpciones(rng, cantidad(queda, null), pool);
  return opciones && { variante: 'queda', esc, total, f1: { n, d }, opciones };
}

function problemaDos(rng) {
  const esc = rng.elegir(Object.keys(ESCENARIOS.dos));
  const cfg = ESCENARIOS.dos[esc];
  const d1 = rng.elegir(DEN_DOS), d2 = rng.elegir(DEN_DOS);
  if (d1 === d2) return null;
  const posibles = totalesPosibles(cfg, mcm(d1, d2));
  if (!posibles.length) return null;
  const total = rng.elegir(posibles);
  const f1 = fraccion(numeradorIrreducible(rng, d1), d1), f2 = fraccion(numeradorIrreducible(rng, d2), d2);
  const suma = f1.sumar(f2);
  if (suma.num >= suma.den) return null;
  const a = entero(f1.multiplicar(total)), b = entero(f2.multiplicar(total));
  const queda = total - a - b;
  if (queda < 2) return null;
  const q = fraccion(1, 1).restar(suma);
  const tope = total - 1;
  const pool = [
    cantidad(entero(ERRORES_TIPICOS['gastado-como-queda'].fn(f1, f2)?.multiplicar(total)), 'gastado-como-queda'),
    cantidad(total - b, 'olvida-restar-la-primera'),
    cantidad(total - a, 'olvida-restar-la-segunda'),
    comoFraccion(q, 'da-la-fraccion-en-vez-de-la-cantidad'),
  ].filter(o => o.tipo === 'fraccion' || valido(o.v, tope));
  const opciones = conOpciones(rng, cantidad(queda, null), pool);
  return opciones && { variante: 'dos', esc, total, f1: { n: f1.num, d: f1.den }, f2: { n: f2.num, d: f2.den }, opciones };
}

/** `parte` (el dato es lo que vale la fracción) y `restante` (el dato es lo que falta). */
function problemaTotal(rng, variante) {
  const esc = rng.elegir(Object.keys(ESCENARIOS[variante]));
  const cfg = ESCENARIOS[variante][esc];
  const d = rng.elegir(variante === 'restante' ? [3, 4, 5, 6, 8, 9, 10, 12] : DENOMINADORES);
  const posibles = totalesPosibles(cfg, d).filter(t => t / d >= 2);
  if (!posibles.length) return null;
  const total = rng.elegir(posibles);
  const k = total / d;
  const n = numeradorIrreducible(rng, d);
  const f = fraccion(n, d);
  const dato = variante === 'parte' ? n * k : (d - n) * k;
  if (dato < 2) return null;
  // Se pregunta por el total: toda opción de cantidad está dentro de la cota del escenario y
  // es mayor que el dato (el total es siempre mayor que cualquiera de sus partes).
  const valida = o => o.v >= cfg.min && o.v <= cfg.max && o.v > dato && Number.isInteger(o.v);
  // Los errores que dan menos que el dato (aplicar la fracción al dato, quedarse en una parte)
  // no valen como opción: «3 alumnos» para el total de una clase no se cree nadie. Los que
  // quedan son totales posibles: de más, de menos o de otra forma de contar.
  const comunes = [
    cantidad(dato * d, 'multiplica-el-dato-por-el-denominador'),
    cantidad(total - k, 'cuenta-una-parte-de-menos'),
    cantidad(total + k, 'cuenta-una-parte-de-mas'),
    cantidad(dato * 2, 'duplica-el-dato'),
  ];
  const pool = variante === 'parte'
    ? [cantidad(k * (d - n), 'da-el-resto'), ...comunes]
    : [cantidad(k * n, 'da-la-parte-ya-hecha'), ...comunes];
  const opciones = conOpciones(rng, cantidad(total, null), pool.filter(o => o.v !== null && valida(o)));
  return opciones && { variante, esc, total, f1: { n, d }, dato, opciones };
}

/** Ítem del ejercicio 4 (ver la cabecera). Reintenta hasta que salen las cuatro opciones buenas. */
export function generarProblema(rng) {
  for (let intento = 0; intento < 1000; intento++) {
    const variante = rng.elegir(VARIANTES);
    const item = variante === 'queda' ? problemaQueda(rng) : variante === 'dos' ? problemaDos(rng) : problemaTotal(rng, variante);
    if (item && !esReservadoProblema(item)) return item;
  }
  throw new Error('generarProblema: sin ítem posible');
}

/** La cantidad buena de un ítem del ejercicio 4. */
export const respuestaProblema = item => item.opciones.find(o => o.error === null).v;
