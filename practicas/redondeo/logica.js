// Redondeo y estimación: lógica pura (sin DOM ni red). Los generadores devuelven
// DATOS; el HTML y los textos viven en practica.js y textos.js.
//
// Redondear a un orden (10, 100, 1000) es quedarse con el múltiplo de ese orden
// más cercano; si está justo en medio (4 750 a la centena), se sube. Solo naturales.

export const ORDENES = [10, 100, 1000];

/** Fracción del tramo (5 %) que se admite de error al tocar dónde cae el número en la recta. */
export const TOLERANCIA = 0.05;

/** Redondea n al múltiplo de `orden` más cercano; el punto medio, hacia arriba. */
export function redondear(n, orden) {
  return Math.floor((n + orden / 2) / orden) * orden;
}

/** ¿Por exceso (el redondeado es mayor que n)? Con n múltiplo del orden no hay ni exceso ni defecto. */
export const esExceso = (n, orden) => redondear(n, orden) > n;

/** La cifra que decide el redondeo a `orden`: la que está justo debajo (decena → unidades). */
export const cifraDecisiva = (n, orden) => Math.floor(n / (orden / 10)) % 10;

/** ¿n está justo en medio de sus dos marcas? (4 750 para la centena). */
export const esPuntoMedio = (n, orden) => n % orden === orden / 2;

/** Los dos múltiplos consecutivos del orden entre los que cae n (n no es múltiplo). */
export const marcasDe = (n, orden) => [Math.floor(n / orden) * orden, Math.floor(n / orden) * orden + orden];

/** Fracción (0..1) del tramo entre las dos marcas en la que cae n. */
export const fraccionDe = (n, orden) => (n - marcasDe(n, orden)[0]) / orden;

/** Texto de un número con separador de miles: «4 732» en español, «4,732» en inglés. */
export function fmt(n, idioma = 'es') {
  const s = String(n);
  if (s.length < 4) return s;
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, idioma === 'en' ? ',' : ' ');
}

/**
 * Lo que escribe el alumno → número natural, o null si no lo es. Vale con o sin separador de
 * miles: «4730», «4.730», «4,730», «4 730». «4.73» o «-5» no son naturales y dan null.
 */
export function leerEntero(texto) {
  const t = String(texto).trim();
  if (/^\d+$/.test(t)) return Number(t);
  if (/^\d{1,3}([.,\s   ]\d{3})+$/.test(t)) return Number(t.replace(/\D/g, ''));
  return null;
}

// Genera un entero de `cifras` cifras que no acabe en 0 (así no es múltiplo de ningún orden).
function sinCero(rng, cifras) {
  const minimo = 10 ** (cifras - 1);
  let n;
  do n = rng.entero(minimo, minimo * 10 - 1); while (n % 10 === 0);
  return n;
}

// ─── Ejercicio 1: en la recta ─────────────────────────────────────────────────

/**
 * Ítem: { tipo: 'recta', n, orden, marcas: [inf, sup], redondeado, exceso, medio }.
 * Un 15 % de las veces n está justo en medio (se redondea hacia arriba por convenio).
 */
export function generarRecta(rng) {
  const cifras = rng.entero(3, 5);
  const ordenes = ORDENES.filter(o => o * 2 <= 10 ** cifras);
  const orden = rng.elegir(ordenes);
  let n;
  if (rng.azar() < 0.15) {
    const base = rng.entero(Math.ceil(10 ** (cifras - 1) / orden), Math.floor((10 ** cifras - 1) / orden) - 1);
    n = base * orden + orden / 2;
  } else {
    do n = rng.entero(10 ** (cifras - 1), 10 ** cifras - 1); while (n % orden === 0 || esPuntoMedio(n, orden));
  }
  return { tipo: 'recta', n, orden, marcas: marcasDe(n, orden), redondeado: redondear(n, orden), exceso: esExceso(n, orden), medio: esPuntoMedio(n, orden) };
}

/** ¿Ha tocado el alumno la zona buena de la recta? `x` es la fracción (0..1) tocada. */
export const posicionCorrecta = (item, x) => Math.abs(x - fraccionDe(item.n, item.orden)) <= TOLERANCIA;

/** Acierto con las dos cosas: la posición y la marca (un número de `item.marcas`). */
export const esAciertoRecta = (item, x, marca) => posicionCorrecta(item, x) && marca === item.redondeado;

// ─── Ejercicio 2: a tres órdenes ──────────────────────────────────────────────

/**
 * Ítem: { tipo: 'tres', n, redondeados: { 10, 100, 1000 }, excesos: { 10, 100, 1000 } }.
 * n de 4 o 5 cifras y sin acabar en 0, para que ningún redondeo sea el propio n.
 */
export function generarTres(rng) {
  const n = sinCero(rng, rng.entero(4, 5));
  const redondeados = {}, excesos = {};
  for (const o of ORDENES) { redondeados[o] = redondear(n, o); excesos[o] = redondear(n, o) > n; }
  return { tipo: 'tres', n, redondeados, excesos };
}

/** `respuestas`: { redondeados: { 10, 100, 1000 }, excesos: { 10, 100, 1000 } (booleanos) }. */
export function esAciertoTres(item, respuestas) {
  return ORDENES.every(o => Number(respuestas.redondeados[o]) === item.redondeados[o] && respuestas.excesos[o] === item.excesos[o]);
}

// ─── Ejercicio 3: estimar y cazar el error ────────────────────────────────────

const aplicar = (op, valores) => (op === '+' ? valores.reduce((a, b) => a + b, 0) : valores.reduce((a, b) => a * b, 1));

/** Estimación de una operación redondeando cada término al orden dado. */
export const estimarCon = (op, terminos, orden) => aplicar(op, terminos.map(t => redondear(t, orden)));

export const exactoDe = (op, terminos) => aplicar(op, terminos);

// Términos sin acabar en 0 (para que redondear cambie algo).
const termino = (rng, cifras) => sinCero(rng, cifras);

/**
 * Ítem estimar: { tipo: 'estimar', op, terminos, ordenes, estimaciones: { orden: est }, exacto }.
 * Suma de 3 o 4 sumandos de 3 cifras (órdenes 10 y 100) o de 4 cifras (100 y 1000), o producto
 * de dos factores de dos cifras (solo la decena: no se pregunta el orden).
 */
export function generarEstimar(rng) {
  let op, terminos, ordenes;
  if (rng.azar() < 0.6) {
    op = '+';
    const cifras = rng.elegir([3, 4]);
    terminos = Array.from({ length: rng.entero(3, 4) }, () => termino(rng, cifras));
    ordenes = cifras === 3 ? [10, 100] : [100, 1000];
  } else {
    op = '·';
    terminos = [rng.entero(31, 94), rng.entero(31, 94)].map(t => (t % 10 === 0 ? t + 1 : t));
    ordenes = [10];
  }
  const estimaciones = {};
  for (const o of ordenes) estimaciones[o] = estimarCon(op, terminos, o);
  return { tipo: 'estimar', op, terminos, ordenes, estimaciones, exacto: exactoDe(op, terminos) };
}

/** Diferencia (siempre positiva) entre el exacto y la estimación hecha a ese orden. */
export const diferenciaCon = (item, orden) => Math.abs(item.exacto - item.estimaciones[orden]);

/**
 * Acierto: el alumno eligió un orden de los ofrecidos, su estimación coincide con redondear cada
 * término a ESE orden, y la diferencia que escribe es la de esa estimación con el exacto.
 */
export function esAciertoEstimar(item, orden, estimacion, diferencia) {
  if (!item.ordenes.includes(orden)) return false;
  return Number(estimacion) === item.estimaciones[orden] && Number(diferencia) === diferenciaCon(item, orden);
}

/**
 * Ítem razonable: { tipo: 'razonable', op, terminos, propuesto, exacto, razonable, motivo, orden, estimacion }.
 * `razonable` (Sí) solo cuando propuesto === exacto. En los No, el propuesto se aleja de verdad:
 * más del doble o menos de la mitad del exacto (nada de «casi»).
 * motivo: 'igual' | 'mas' (una cifra de más) | 'menos' (una cifra de menos) | 'suma' (sumó en vez de multiplicar).
 */
export function generarRazonable(rng) {
  let op, terminos, orden;
  if (rng.azar() < 0.6) {
    op = '·';
    terminos = [rng.entero(31, 94), rng.entero(31, 94)].map(t => (t % 10 === 0 ? t + 1 : t));
    orden = 10;
  } else {
    op = '+';
    terminos = Array.from({ length: 3 }, () => termino(rng, 3));
    orden = 100;
  }
  const exacto = exactoDe(op, terminos);
  const motivos = op === '·' ? ['igual', 'mas', 'menos', 'suma'] : ['igual', 'mas', 'menos'];
  const motivo = rng.azar() < 0.4 ? 'igual' : rng.elegir(motivos.slice(1));
  let propuesto;
  if (motivo === 'igual') propuesto = exacto;
  else if (motivo === 'mas') propuesto = exacto * 10 + rng.entero(1, 9);
  else if (motivo === 'menos') propuesto = Math.floor(exacto / 10);
  else propuesto = terminos[0] + terminos[1];
  return { tipo: 'razonable', op, terminos, propuesto, exacto, razonable: motivo === 'igual', motivo, orden, estimacion: estimarCon(op, terminos, orden) };
}

/** ¿Es razonable el resultado propuesto? (`quiere`: true = el alumno dice que sí). */
export const esAciertoRazonable = (item, quiere) => quiere === item.razonable;

/**
 * Ítem contexto: { tipo: 'contexto', n, orden, contexto, opciones, correcto }.
 * «Redondea a la centena» entre cuatro cantidades: la buena y tres falsas (el mismo número redondeado
 * a otro orden o en el sentido contrario). Ninguna falsa coincide con la buena (a veces dos órdenes
 * dan el mismo valor: 3 996 → 4 000 en centena y en millar; ese no es distractor).
 */
export const NUM_CONTEXTOS = 5;

export function generarContexto(rng) {
  const n = sinCero(rng, rng.entero(4, 5));
  const orden = rng.elegir(ORDENES);
  // Sin punto medio: aquí no se discute el convenio.
  if (esPuntoMedio(n, orden)) return generarContexto(rng);
  const correcto = redondear(n, orden);
  const [inf, sup] = marcasDe(n, orden);
  const contrario = correcto === inf ? sup : inf;
  // Los dos últimos son marcas más lejanas (inf − orden, sup + orden): sirven de relleno cuando otros órdenes dan lo mismo.
  const pool = [contrario, ...ORDENES.filter(o => o !== orden).map(o => redondear(n, o)), n, inf - orden, sup + orden];
  const falsos = rng.barajar([...new Set(pool.filter(v => v > 0 && v !== correcto))]).slice(0, 3);
  const opciones = rng.barajar([correcto, ...falsos]);
  return { tipo: 'contexto', n, orden, contexto: rng.entero(0, NUM_CONTEXTOS - 1), opciones, correcto };
}

export const esAciertoContexto = (item, elegido) => Number(elegido) === item.correcto;

/** Ejercicio 3: mezcla los tres tipos (40 % estimar, 35 % razonable, 25 % contexto). */
export function generarEstimacion(rng) {
  const r = rng.azar();
  if (r < 0.4) return generarEstimar(rng);
  if (r < 0.75) return generarRazonable(rng);
  return generarContexto(rng);
}
