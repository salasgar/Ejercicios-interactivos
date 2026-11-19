// Práctica «Léelo en inglés» de la unidad 7 (Proportionality and percentages): lógica pura (sin DOM ni red).
// Cuatro ejercicios, todos de elegir una opción entre cuatro:
//   1. La palabra   un término del vocabulario y cuatro significados (o al revés)
//   2. Léelo        una razón, un porcentaje o una escala y cuatro lecturas en inglés; y al revés (cómo se escribe)
//   3. La consigna  una instrucción de examen en inglés y cuatro acciones en español
//   4. Completa     una frase en inglés con un hueco y cuatro palabras
//
// Un ítem es DATOS: { plantilla, instruccion, notacion (html), opciones, solucion, sesion, paquete, idioma }
// con `opciones` ya barajada: { texto, html?, correcta, error, por_que }.
//
// FILTRO POR FECHA (tarea 226): cada término, objeto, consigna y frase lleva su `paquete` y su `sesion`, y los
// generadores solo sacan lo que ya se ha dado en `sesion.fecha` (por defecto, hoy). Con los paquetes 1-2 no sale
// ni «%», ni *per cent*, ni *discount*, ni *VAT*, ni *scale*; con el paquete 3, ninguna escala. La parte de abril
// del paquete 3 (descuentos, aumentos, IVA) empieza el 5-4 (`DESDE_PAQUETE_3B`). Fechas de la PROPUESTA de la
// montadora (no hay acta todavía): si el acta las cambia, se cambian aquí y en ningún sitio más.
//
// Casos reservados: los del papel de la U7 (hojas y exámenes) no salen en ningún ejercicio con números; los
// consultan TODOS los generadores con `libre(tipo, datos)`. Hojas por clave en claro; exámenes por huella FNV-1a
// del caso normalizado por valor (`huellaCaso`), nunca en claro. Hoy no hay ninguno escrito: ambos están vacíos.

import { numeroAIngles } from '../../src/ejercicios/palabras.js';
import {
  razonATexto, razonAHtml, enPalabras, esLecturaValida, huellaCaso, cantidad, NBSP, FINO,
} from '../_comun/proporcion.js';

const par = (es, en) => ({ es, en });
void numeroAIngles;

// ─── Calendario ───────────────────────────────────────────────────────────────────────────

export const PAQUETES_DESDE = { 1: '2027-03-01', 2: '2027-03-08', 3: '2027-03-15', 4: '2027-04-12', 5: '2027-04-19' };
export const DESDE_PAQUETE_3B = '2027-04-05';

const pad = n => String(n).padStart(2, '0');
export const hoy = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

/** El último paquete empezado en `fecha` (AAAA-MM-DD); el 1 si la fecha es anterior al 1-3. */
export function paqueteHoy(fecha = hoy()) {
  let p = 1;
  for (const [n, desde] of Object.entries(PAQUETES_DESDE)) if (fecha >= desde) p = Number(n);
  return p;
}
const desdeDe = e => e.desde ?? (e.paquete === 1 ? '0000-00-00' : PAQUETES_DESDE[e.paquete]);
export const disponible = (e, fecha) => fecha >= desdeDe(e);
const activos = (lista, fecha) => lista.filter(e => disponible(e, fecha));

// ─── Errores propios de la práctica ───────────────────────────────────────────────────────

export const ERRORES_LEELO = {
  'vocabulario-confundido': { nombre: par('Ha tomado un término por la traducción de otro', 'Mixed up a term with the translation of another one') },
  'confunde-contrarios': { nombre: par('Ha confundido dos palabras contrarias (directly e inversely, increase y decrease…)', 'Mixed up two opposite words (directly and inversely, increase and decrease…)') },
  'confunde-parecidas': { nombre: par('Ha confundido dos palabras que se parecen (ratio y proportion, discount y sale price…)', 'Mixed up two words that look alike (ratio and proportion, discount and sale price…)') },
  'razon-al-reves': { nombre: par('Ha leído (o escrito) la razón al revés: 3 a 4 no es 4 a 3', 'Read (or wrote) the ratio the wrong way round: 3 to 4 is not 4 to 3') },
  'cero-de-mas-o-de-menos': { nombre: par('Ha puesto un cero de más o de menos (50 000 no es 5000)', 'Put one zero too many or too few (50,000 is not 5,000)') },
  'cifras-cambiadas': { nombre: par('Ha cambiado de sitio las cifras (35 no es 53)', 'Swapped the digits (35 is not 53)') },
  'teen-ty': { nombre: par('Ha confundido -teen y -ty (thirteen es 13 y thirty es 30)', 'Mixed up -teen and -ty (thirteen is 13 and thirty is 30)') },
  'otro-numero': { nombre: par('Ha leído otro número', 'Read a different number') },
  'coma-de-mas': { nombre: par('Ha puesto una coma decimal donde no iba (35 % no es 3,5 %)', 'Put a decimal point where it does not belong (35% is not 3.5%)') },
  'consigna-confundida': { nombre: par('Ha entendido otra tarea distinta de la que pide la consigna', 'Understood a different task from the one the instruction asks for') },
  'operacion-contraria': { nombre: par('Ha entendido lo contrario de lo que pide (subir en vez de bajar, directa en vez de inversa)', 'Understood the opposite of what is asked (raise instead of lower, direct instead of inverse)') },
  'palabra-que-no-encaja': { nombre: par('Ha elegido una palabra que no encaja en la frase', 'Chose a word that does not fit the sentence') },
};
export const nombreDe = id => ERRORES_LEELO[id]?.nombre;
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

// ─── Casos reservados ─────────────────────────────────────────────────────────────────────

export const HUELLAS_EXAMEN = new Set([]);
export const RESERVADOS_HOJA = new Set([]);
export const claveCaso = (tipo, datos) => `${tipo}:${datos.join(',')}`;
export function esReservado(tipo, datos) {
  try { if (HUELLAS_EXAMEN.has(huellaCaso(tipo, datos))) return true; } catch { /* sin huella */ }
  return RESERVADOS_HOJA.has(claveCaso(tipo, datos));
}

class ItemPobre extends Error {}
const libre = (tipo, datos) => { if (esReservado(tipo, datos)) throw new ItemPobre('reservado'); };

/** Una falsa de cada error primero (al azar), luego las que sobren; sin textos repetidos. */
function elegirFalsas(rng, falsas, n = 3) {
  const vistos = new Set();
  const unicas = [];
  for (const f of rng.barajar(falsas)) {
    if (vistos.has(f.texto)) continue;
    vistos.add(f.texto);
    unicas.push(f);
  }
  const elegidas = [];
  const errores = new Set();
  for (const f of unicas) if (elegidas.length < n && !errores.has(f.error)) { errores.add(f.error); elegidas.push(f); }
  for (const f of unicas) if (elegidas.length < n && !elegidas.includes(f)) elegidas.push(f);
  return elegidas;
}

function armar(rng, { plantilla, instruccion, notacion = '', correcta, falsas, solucion, sesion, paquete, idioma, fijas = [] }) {
  const resto = elegirFalsas(rng, falsas.filter(f => f.texto !== correcta.texto && !fijas.some(x => x.texto === f.texto)), 3 - fijas.length);
  const buenas = [...fijas, ...resto];
  if (buenas.length < 3) throw new ItemPobre(plantilla);
  const opciones = rng.barajar([{ ...correcta, correcta: true, error: null }, ...buenas.map(f => ({ ...f, correcta: false }))]);
  return { plantilla, instruccion, notacion, opciones, solucion, sesion, paquete, idioma };
}

function generarDe(rng, plantillas, sesion) {
  for (let i = 0; i < 80; i++) {
    try { return rng.elegir(plantillas)(rng, sesion); } catch (e) { if (!(e instanceof ItemPobre)) throw e; }
  }
  throw new Error('No se ha podido generar un ítem');
}

const frase = (texto, lang = 'en') => `<p class="texto-en" lang="${lang}">${texto}</p>`;
const entrada = (sesion = {}) => ({ fecha: sesion.fecha ?? hoy(), idioma: sesion.idioma === 'en' ? 'en' : 'es' });
const miles = n => { const s = String(n); return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, FINO) : s; };

// ─── Ejercicio 1 · La palabra ─────────────────────────────────────────────────────────────
// Cada término lleva una `familia`: en un ítem no entran dos de la misma (serían casi sinónimos).
// `contrario` es el término con el que más se confunde y entra siempre como distractor (si ya se ha dado).

export const VOCABULARIO = [
  { id: 'ratio', en: 'ratio', es: 'la razón (compara dos cantidades)', paquete: 1, sesion: 1, familia: 'razon', contrario: 'proportion' },
  { id: 'proportion', en: 'proportion', es: 'la proporción (igualdad de dos razones)', paquete: 1, sesion: 3, familia: 'proporcion', contrario: 'ratio' },
  { id: 'equivalent', en: 'equivalent ratios', es: 'razones equivalentes (las que valen lo mismo)', paquete: 1, sesion: 2, familia: 'equivalentes' },
  { id: 'simplest', en: 'simplest form', es: 'la forma más sencilla (la razón con los números más pequeños posibles)', paquete: 1, sesion: 2, familia: 'sencilla' },
  { id: 'directly', en: 'directly proportional', es: 'directamente proporcionales (si una se duplica, la otra también)', paquete: 1, sesion: 3, familia: 'directa', contrario: 'inversely' },
  { id: 'unit-rate', en: 'unit rate', es: 'lo que corresponde a una sola unidad', paquete: 1, sesion: 3, familia: 'unitaria' },
  { id: 'per', en: 'per', es: 'por cada (6 litros por cada 100 km)', paquete: 1, sesion: 1, familia: 'por-cada' },
  { id: 'for-every', en: 'for every', es: 'por cada (3 chicos por cada 4 chicas)', paquete: 1, sesion: 1, familia: 'por-cada' },
  { id: 'out-of', en: 'out of', es: 'de cada (3 de cada 4)', paquete: 1, sesion: 1, familia: 'de-cada' },
  { id: 'inversely', en: 'inversely proportional', es: 'inversamente proporcionales (si una se duplica, la otra se reduce a la mitad)', paquete: 2, sesion: 5, familia: 'inversa', contrario: 'directly' },
  { id: 'same-rate', en: 'at the same rate', es: 'al mismo ritmo', paquete: 2, sesion: 5, familia: 'ritmo' },
  { id: 'share', en: 'share in the ratio', es: 'repartir en la razón dada', paquete: 2, sesion: 7, familia: 'reparto' },
  { id: 'percentage', en: 'percentage', es: 'el porcentaje (cuántas partes de cada 100)', paquete: 3, sesion: 9, familia: 'porcentaje' },
  { id: 'discount', en: 'discount', es: 'el descuento (lo que se resta al precio)', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, familia: 'descuento', contrario: 'sale-price' },
  { id: 'sale-price', en: 'sale price', es: 'el precio rebajado (lo que se paga después del descuento)', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, familia: 'rebajado', contrario: 'discount' },
  { id: 'increase', en: 'increase', es: 'el aumento (una subida)', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, familia: 'aumento', contrario: 'decrease' },
  { id: 'decrease', en: 'decrease', es: 'la disminución (una bajada)', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, familia: 'disminucion', contrario: 'increase' },
  { id: 'vat', en: 'VAT', es: 'el IVA (el impuesto que se suma al precio)', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 13, familia: 'iva' },
  { id: 'scale', en: 'scale', es: 'la escala (cuántas veces es mayor la realidad que el dibujo)', paquete: 4, sesion: 16, familia: 'escala' },
  { id: 'map', en: 'map', es: 'el mapa', paquete: 4, sesion: 16, familia: 'mapa', contrario: 'plan' },
  { id: 'plan', en: 'plan', es: 'el plano (de una casa, de un aula)', paquete: 4, sesion: 16, familia: 'plano', contrario: 'map' },
  { id: 'model', en: 'model', es: 'la maqueta', paquete: 4, sesion: 17, familia: 'maqueta' },
];
const POR_ID = new Map(VOCABULARIO.map(v => [v.id, v]));
export const terminoDe = id => POR_ID.get(id);

/** Parejas de sinónimos válidos: nunca se enfrentan en un ítem (las comprueba el test). */
export const SINONIMOS = [
  ['per', 'for every'], ['discount', 'reduction'], ['VAT', 'IVA'], ['percent', 'per cent'],
  ['directly proportional', 'in direct proportion'], ['inversely proportional', 'in inverse proportion'],
  ['unit rate', 'rate per unit'], ['simplest form', 'lowest terms'], ['plan', 'floor plan'], ['model', 'scale model'],
];

const CONTRARIOS_PARECIDOS = new Set(['ratio', 'proportion', 'discount', 'sale-price', 'map', 'plan']);

export function generarPalabra(rng, sesion) {
  const { fecha, idioma } = entrada(sesion);
  const banco = activos(VOCABULARIO, fecha);
  const t = rng.elegir(banco);
  const sentido = rng.elegir(['en-es', 'es-en']);
  const opcion = (v, error) => (sentido === 'en-es'
    ? { texto: v.es, error, por_que: par(`«${v.es}» se dice «${v.en}» en inglés, no «${t.en}».`, `“${v.es}” is “${v.en}” in English, not “${t.en}”.`) }
    : { texto: v.en, error, por_que: par(`«${v.en}» significa «${v.es}», no «${t.es}».`, `“${v.en}” means “${v.es}”, not “${t.es}”.`) });
  const contrario = t.contrario ? banco.find(v => v.id === t.contrario) : null;
  const fijas = contrario ? [opcion(contrario, CONTRARIOS_PARECIDOS.has(t.id) ? 'confunde-parecidas' : 'confunde-contrarios')] : [];
  const familias = new Set([t.familia, ...(contrario ? [contrario.familia] : [])]);
  const otras = [];
  for (const v of rng.barajar(banco)) {
    if (familias.has(v.familia)) continue;
    familias.add(v.familia);
    otras.push(opcion(v, 'vocabulario-confundido'));
  }
  const correcta = sentido === 'en-es' ? { texto: t.es } : { texto: t.en };
  const solucion = par(`«${t.en}» significa «${t.es}».`, `“${t.en}” means “${t.es}”.`);
  const notacion = sentido === 'en-es' ? frase(t.en) : frase(t.es, 'es');
  return armar(rng, {
    plantilla: `palabra_${sentido.replace('-', '_')}`, instruccion: `palabra_${sentido.replace('-', '_')}`,
    notacion, correcta, falsas: otras, fijas, solucion, sesion: t.sesion, paquete: t.paquete, idioma,
  });
}

// ─── Ejercicio 2 · Léelo ──────────────────────────────────────────────────────────────────
// Objetos: una razón como fracción (3/4), la razón de un reparto (2 : 3), un porcentaje (20 %), una escala (1 : 50 000).
// Leer: el objeto y cuatro lecturas en inglés. Escribir: la lectura y cuatro notaciones. Las falsas son errores con
// nombre (razón al revés, cero de más o de menos, cifras cambiadas, -teen/-ty, otra cifra) y nunca otra lectura
// válida (`esLecturaValida`) ni un valor equivalente (3/4 y 6/8, 0,35 y 35 %).

const tenty = n => {
  if (n >= 13 && n <= 19) return (n % 10) * 10;
  if (n >= 30 && n <= 90 && n % 10 === 0) return n / 10 + 10;
  return null;
};

/** Otras cifras para n: [{ n, error }] (enteros positivos distintos de n). */
function variantesNumero(n) {
  const s = String(n);
  const salida = [];
  const pon = (m, error) => { if (Number.isInteger(m) && m > 0 && m <= 1000000 && m !== n && !salida.some(v => v.n === m)) salida.push({ n: m, error }); };
  pon(n * 10, 'cero-de-mas-o-de-menos');
  if (n % 10 === 0 && n >= 20) pon(n / 10, 'cero-de-mas-o-de-menos');
  if (s.length >= 2 && s[1] !== '0') pon(Number(`${s[0]}0${s.slice(1)}`), 'cero-de-mas-o-de-menos');
  if (s.length === 2 && s[0] !== s[1] && s[1] !== '0') pon(Number(s[1] + s[0]), 'cifras-cambiadas');
  const tt = tenty(n);
  if (tt !== null) pon(tt, 'teen-ty');
  pon(n % 10 === 0 ? n + (n >= 100 ? 100 : 10) : n + 1, 'otro-numero');
  pon(Number(String(Number(s[0]) % 9 + 1) + s.slice(1)), 'otro-numero');
  return salida;
}

const TERMINOS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50];
const PORCENTAJES = [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 90, 95];
const ESCALAS = [10, 20, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000];
const txtPorc = (p, idioma) => (idioma === 'en' ? `${String(p)}%` : `${String(p).replace('.', ',')}${NBSP}%`);
const xPorc = p => cantidad(Number.isInteger(p) ? p : String(p).replace('.', ','), '%');

const razonDe = (rng, distintos = true) => {
  for (;;) {
    const a = rng.elegir(TERMINOS), b = rng.elegir(TERMINOS);
    if (!distintos || a !== b) return { a, b };
  }
};
const variantesRazon = d => [
  { d: { a: d.b, b: d.a }, error: 'razon-al-reves' },
  ...variantesNumero(d.a).map(v => ({ d: { a: v.n, b: d.b }, error: v.error })),
  ...variantesNumero(d.b).map(v => ({ d: { a: d.a, b: v.n }, error: v.error })),
];

export const OBJETOS = [
  {
    id: 'razon-fraccion', paquete: 1, sesion: 1, tipo: 'razon',
    crear: rng => razonDe(rng),
    datos: d => [d.a, d.b],
    x: d => ({ razon: [d.a, d.b] }),
    escribir: (d, idioma) => ({ texto: razonATexto(d.a, d.b, idioma, 'fraccion'), html: razonAHtml(d.a, d.b, idioma, 'fraccion') }),
    igual: (d, e) => d.a * e.b === e.a * d.b,
    variantes: variantesRazon,
  },
  {
    id: 'reparto', paquete: 2, sesion: 7, tipo: 'reparto',
    crear: rng => { const a = rng.entero(1, 9), b = rng.entero(1, 9); return a === b ? { a, b: b === 9 ? 8 : b + 1 } : { a, b }; },
    datos: d => [d.a, d.b],
    x: d => ({ razon: [d.a, d.b] }),
    escribir: (d, idioma) => { const t = razonATexto(d.a, d.b, idioma, 'dos-puntos'); return { texto: t, html: t }; },
    igual: (d, e) => d.a * e.b === e.a * d.b,
    variantes: d => variantesRazon(d).filter(v => v.d.a < 10 || v.d.a === d.a).filter(v => v.d.b < 10 || v.d.b === d.b),
  },
  {
    id: 'porcentaje', paquete: 3, sesion: 9, tipo: 'porcentaje',
    crear: rng => ({ p: rng.elegir(PORCENTAJES) }),
    datos: d => [d.p],
    x: d => xPorc(d.p),
    escribir: (d, idioma) => { const t = txtPorc(d.p, idioma); return { texto: t, html: t }; },
    igual: (d, e) => d.p === e.p,
    variantes: d => {
      const v = variantesNumero(d.p).filter(x => x.n <= 1000).map(x => ({ d: { p: x.n }, error: x.error }));
      if (d.p >= 10 && d.p % 10 !== 0 && d.p < 100) v.push({ d: { p: d.p / 10 }, error: 'coma-de-mas', soloEscribir: true });
      return v;
    },
  },
  {
    id: 'escala', paquete: 4, sesion: 16, tipo: 'escala',
    crear: rng => ({ n: rng.elegir(ESCALAS) }),
    datos: d => [d.n],
    x: d => (d.inv ? { razon: [d.n, 1] } : { escala: d.n }),
    escribir: (d, idioma) => {
      const t = d.inv ? `${miles(d.n)}${NBSP}:${NBSP}1` : `1${NBSP}:${NBSP}${miles(d.n)}`;
      void idioma;
      return { texto: t, html: t };
    },
    igual: (d, e) => d.n === e.n && Boolean(d.inv) === Boolean(e.inv),
    variantes: d => [
      { d: { n: d.n, inv: true }, error: 'razon-al-reves' },
      ...variantesNumero(d.n).filter(v => v.n >= 5).map(v => ({ d: { n: v.n }, error: v.error })),
    ],
  },
];

function lectura(obj, d) { return enPalabras(obj.x(d), 'en'); }

function generarObjeto(rng, sesion) {
  const { fecha, idioma } = entrada(sesion);
  const obj = rng.elegir(activos(OBJETOS, fecha));
  const d = obj.crear(rng);
  libre(obj.tipo, obj.datos(d));
  const modo = rng.elegir(['leer', 'escribir']);
  const correctaLectura = lectura(obj, d);
  const xBuena = obj.x(d);
  const buenaEs = obj.escribir(d, 'es'), buenaEn = obj.escribir(d, 'en');
  const buenaNota = obj.escribir(d, idioma);
  const falsas = [];
  for (const v of obj.variantes(d)) {
    if (obj.igual(d, v.d)) continue;
    let lect;
    try { lect = lectura(obj, v.d); } catch { continue; }
    const fEs = obj.escribir(v.d, 'es'), fEn = obj.escribir(v.d, 'en'), fNota = obj.escribir(v.d, idioma);
    if (modo === 'leer') {
      if (v.soloEscribir || lect === correctaLectura || esLecturaValida(xBuena, lect, 'en')) continue;
      falsas.push({
        texto: lect, error: v.error,
        por_que: par(`«${lect}» se escribe ${fEs.html}, no ${buenaEs.html}.`, `“${lect}” is written ${fEn.html}, not ${buenaEn.html}.`),
      });
    } else {
      if (fNota.texto === buenaNota.texto) continue;
      falsas.push({
        texto: fNota.texto, html: fNota.html, error: v.error,
        por_que: par(`${fEs.html} se lee «${lect}», no «${correctaLectura}».`, `${fEn.html} is read “${lect}”, not “${correctaLectura}”.`),
      });
    }
  }
  const fijas = falsas.filter(f => f.error === 'razon-al-reves').slice(0, 1);
  const correcta = modo === 'leer' ? { texto: correctaLectura } : { texto: buenaNota.texto, html: buenaNota.html };
  const solucion = modo === 'leer'
    ? par(`${buenaEs.html} se lee «${correctaLectura}».`, `${buenaEn.html} is read “${correctaLectura}”.`)
    : par(`«${correctaLectura}» se escribe ${buenaEs.html}.`, `“${correctaLectura}” is written ${buenaEn.html}.`);
  const notacion = modo === 'leer' ? `<p class="operacion">${buenaNota.html}</p>` : frase(correctaLectura);
  return armar(rng, {
    plantilla: `${modo}_${obj.id}`, instruccion: `${modo}_${obj.id}`, notacion, correcta, falsas, fijas, solucion,
    sesion: obj.sesion, paquete: obj.paquete, idioma,
  });
}

export const PLANTILLAS_LEELO = [generarObjeto];
export const generarLeelo = (rng, sesion) => generarDe(rng, PLANTILLAS_LEELO, sesion);

// ─── Ejercicio 3 · La consigna ────────────────────────────────────────────────────────────
// La instrucción en inglés (con números del generador) y cuatro acciones en español. Las falsas son de otra
// familia (nunca una acción que también valga) y entra el contrario cuando existe.

const razonTxt = (a, b) => `${a}${NBSP}:${NBSP}${b}`;
const mult = (rng, ...rangos) => rangos.map(r => rng.elegir(r));

export const CONSIGNAS = [
  { id: 'simplificar', paquete: 1, sesion: 2, familia: 'equivalentes', es: 'Escribe la razón con los números más pequeños posibles.',
    crear: rng => { const [g, x, y] = [rng.entero(2, 6), ...rng.elegir([[2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [1, 4], [5, 6]])]; return { datos: [g * x, g * y], en: `Write the ratio ${razonTxt(g * x, g * y)} in its simplest form.` }; } },
  { id: 'equivalentes', paquete: 1, sesion: 2, familia: 'equivalentes', es: 'Escribe dos razones que valgan lo mismo que la dada.',
    crear: rng => { const a = rng.entero(1, 5), b = rng.entero(a + 1, 7); return { datos: [a, b], en: `Write two ratios equivalent to ${razonTxt(a, b)}.` }; } },
  { id: 'demostrar', paquete: 1, sesion: 3, familia: 'equivalentes', es: 'Demuestra que las dos razones valen lo mismo.',
    crear: rng => { const a = rng.entero(2, 5), b = rng.entero(a + 1, 8), k = rng.entero(2, 5); return { datos: [a, b, k], en: `Show that ${razonTxt(a, b)} and ${razonTxt(a * k, b * k)} are equivalent.` }; } },
  { id: 'tabla', paquete: 1, sesion: 3, familia: 'calcula-uno', es: 'Rellena los huecos de la tabla.',
    crear: rng => ({ datos: [], en: rng.elegir(['Complete the table.', 'Complete the table of values.', 'Fill in the missing values in the table.']) }) },
  { id: 'falta', paquete: 1, sesion: 3, familia: 'calcula-uno', es: 'Calcula el número que falta.',
    crear: rng => { const a = rng.entero(2, 5), b = rng.entero(a + 1, 8), k = rng.entero(2, 6); return { datos: [a, b, k], en: `Find the missing number: ${razonTxt(a, b)} = ${razonTxt(a * k, '___')}.` }; } },
  { id: 'unitaria', paquete: 1, sesion: 3, familia: 'calcula-uno', es: 'Calcula lo que corresponde a una sola unidad.',
    crear: rng => { const [n, u] = mult(rng, [4, 5, 6, 8, 10], [1, 2, 3]); return { datos: [n, u], en: `${n} pens cost £${n * u}. Work out the unit rate.` }; } },
  { id: 'fraccion', paquete: 1, sesion: 1, familia: 'fraccion', es: 'Escribe la razón en forma de fracción.',
    crear: rng => { const a = rng.entero(2, 9), b = rng.entero(2, 9); return { datos: [a, b], en: `There are ${a} boys and ${b} girls. Write the ratio of boys to girls as a fraction.` }; } },
  { id: 'directa', paquete: 1, sesion: 3, familia: 'directa', contrario: 'inversa', es: 'Decide si las dos cantidades son directamente proporcionales y explica por qué.',
    crear: rng => ({ datos: [], en: rng.elegir(['Are the two quantities directly proportional? Explain your answer.', 'Are the number of pens and the cost directly proportional? Explain.', 'Are the two quantities in the table directly proportional? Give a reason.']) }) },
  { id: 'rodear', paquete: 1, sesion: 1, familia: 'rodear', es: 'Marca la respuesta correcta.',
    crear: rng => ({ datos: [], en: rng.elegir(['Circle the correct answer.', 'Tick the correct box.', 'Choose the correct answer.']) }) },
  { id: 'repartir', paquete: 2, sesion: 7, familia: 'reparto', es: 'Reparte la cantidad en partes que siguen la razón dada.',
    crear: rng => { const a = rng.entero(1, 5), b = rng.entero(1, 5); if (a === b) throw new ItemPobre('igual'); const k = rng.entero(3, 12); return { datos: [a, b, k], en: `Share ${(a + b) * k} sweets in the ratio ${razonTxt(a, b)}.` }; } },
  { id: 'una-parte', paquete: 2, sesion: 7, familia: 'reparto', es: 'Calcula cuánto vale cada parte.',
    crear: rng => { const a = rng.entero(1, 5), b = rng.entero(1, 5); const k = rng.entero(3, 12); return { datos: [a, b, k], en: `The ratio ${razonTxt(a, b)} shares ${(a + b) * k} sweets. Find the value of one part.` }; } },
  { id: 'inversa', paquete: 2, sesion: 5, familia: 'inversa', contrario: 'directa', es: 'Decide si las dos cantidades son inversamente proporcionales y explica por qué.',
    crear: rng => ({ datos: [], en: rng.elegir(['Are the two quantities inversely proportional? Explain your answer.', 'Are the number of workers and the days inversely proportional? Explain.', 'Are the two quantities in the table inversely proportional? Give a reason.']) }) },
  { id: 'ritmo', paquete: 2, sesion: 5, familia: 'equivalentes', es: 'Comprueba si las dos máquinas van al mismo ritmo.',
    crear: rng => { const [n, m] = mult(rng, [20, 30, 40, 60], [5, 10]); return { datos: [n, m], en: `Machine A makes ${n} toys in ${m} minutes. Does machine B work at the same rate?` }; } },
  { id: 'porcentaje-de', paquete: 3, sesion: 9, familia: 'porcentaje-de', es: 'Calcula el porcentaje de una cantidad.',
    crear: rng => { const [p, n] = mult(rng, [10, 20, 25, 50], [40, 60, 80, 120, 150, 200]); return { datos: [p, n], en: `Work out ${p}% of ${n}.` }; } },
  { id: 'porcentaje-fraccion', paquete: 3, sesion: 9, familia: 'fraccion', es: 'Escribe el porcentaje en forma de fracción.',
    crear: rng => { const p = rng.elegir([10, 20, 25, 50, 75]); return { datos: [p], en: `Write ${p}% as a fraction.` }; } },
  { id: 'aumentar', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, familia: 'subir', contrario: 'disminuir', es: 'Calcula la cantidad después de subirla ese porcentaje.',
    crear: rng => { const [p, n] = mult(rng, [10, 20, 25, 50], [40, 60, 80, 120, 200]); return { datos: [p, n], en: `Increase ${n} by ${p}%.` }; } },
  { id: 'disminuir', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, familia: 'bajar', contrario: 'aumentar', es: 'Calcula la cantidad después de bajarla ese porcentaje.',
    crear: rng => { const [p, n] = mult(rng, [10, 20, 25, 50], [40, 60, 80, 120, 200]); return { datos: [p, n], en: `Decrease ${n} by ${p}%.` }; } },
  { id: 'rebajado', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, familia: 'bajar', es: 'Calcula el precio que se paga después del descuento.',
    crear: rng => { const [p, n] = mult(rng, [10, 20, 25, 50], [40, 60, 80, 120, 200]); return { datos: [p, n], en: `A coat costs £${n}. Work out the sale price after a ${p}% discount.` }; } },
  { id: 'iva', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 13, familia: 'subir', es: 'Calcula el precio con el IVA sumado.',
    crear: rng => { const n = rng.elegir([100, 200, 300, 400]); return { datos: [n], en: `A bike costs £${n} without VAT. Work out the price including 21% VAT.` }; } },
  { id: 'distancia-real', paquete: 4, sesion: 16, familia: 'real', es: 'Calcula la distancia real a partir de la distancia del mapa.',
    crear: rng => { const [e, n] = mult(rng, [25000, 50000, 100000], [2, 3, 4, 5, 8]); return { datos: [e, n], en: `The scale of a map is ${razonTxt(1, miles(e))}. Two towns are ${n} cm apart on the map. Work out the real distance.` }; } },
  { id: 'hallar-escala', paquete: 4, sesion: 17, familia: 'hallar-escala', es: 'Calcula la escala.',
    crear: rng => { const [a, b] = rng.elegir([[20, 4], [25, 5], [40, 4], [16, 4], [10, 5]]); return { datos: [a, b], en: `A model of a car is ${a} cm long. The real car is ${b} m long. Find the scale.` }; } },
  { id: 'plano', paquete: 4, sesion: 17, familia: 'dibujar', es: 'Dibuja el plano a la escala dada.',
    crear: rng => { const n = rng.elegir([20, 50, 100]); return { datos: [n], en: `Draw a plan of the classroom using a scale of ${razonTxt(1, n)}.` }; } },
];

function consigna(rng, sesion) {
  const { fecha, idioma } = entrada(sesion);
  const banco = activos(CONSIGNAS, fecha);
  const c = rng.elegir(banco);
  const { datos, en } = c.crear(rng);
  libre('consigna', [c.id.length, ...datos]);
  const contrario = c.contrario ? banco.find(v => v.id === c.contrario) : null;
  const opcion = (v, error) => ({
    texto: v.es, error,
    por_que: par(`«${v.es}» es otra tarea: la consigna pide «${c.es.replace(/\.$/, '')}».`, `“${v.es}” is a different task: the instruction asks for “${c.es.replace(/\.$/, '')}”.`),
  });
  const fijas = contrario ? [opcion(contrario, 'operacion-contraria')] : [];
  const familias = new Set([c.familia, ...(contrario ? [contrario.familia] : [])]);
  const otras = [];
  for (const v of rng.barajar(banco)) {
    if (familias.has(v.familia)) continue;
    familias.add(v.familia);
    otras.push(opcion(v, 'consigna-confundida'));
  }
  const solucion = par(`«${en}» pide: ${c.es.charAt(0).toLowerCase()}${c.es.slice(1)}`, `“${en}” asks you to do this: ${c.es.charAt(0).toLowerCase()}${c.es.slice(1)}`);
  return armar(rng, {
    plantilla: `consigna_${c.id}`, instruccion: 'consigna', notacion: frase(en), correcta: { texto: c.es },
    falsas: otras, fijas, solucion, sesion: c.sesion, paquete: c.paquete, idioma,
  });
}

export const generarConsigna = (rng, sesion) => generarDe(rng, [consigna], sesion);

// ─── Ejercicio 4 · Completa ───────────────────────────────────────────────────────────────
// Una frase en inglés con un hueco y cuatro palabras. Las falsas no encajan ni por el sentido ni por la gramática;
// nunca una forma válida (`for every` con «per», `percent` con «per cent»). El contrario entra si ya se ha dado.

const HUECO = '______';
const T = (texto, extra = {}) => ({ texto, ...extra });

export const COMPLETAS = [
  { id: 'out-of', paquete: 1, sesion: 1, nota: par('«out of» dice cuántos son del total.', '“out of” says how many there are in the total.'),
    crear: rng => { const b = rng.elegir([4, 5, 6, 8, 10, 12, 20, 25]); const a = rng.entero(2, b - 1); return { datos: [a, b], frase: `${a} ${HUECO} ${b} pupils walk to school.`, correcta: 'out of', falsas: ['per', 'than', 'equal', 'directly'] }; } },
  { id: 'per', paquete: 1, sesion: 1, nota: par('«per» es «por cada»: 6 litros por cada 100 km.', '“per” means “for each”: 6 litres per 100 km.'),
    crear: rng => { const a = rng.entero(4, 9); return { datos: [a], frase: `The car uses ${a} litres of petrol ${HUECO} 100 km.`, correcta: 'per', falsas: ['out of', 'than', 'directly', 'equal'] }; } },
  { id: 'equivalent', paquete: 1, sesion: 2, nota: par('Las razones que valen lo mismo son «equivalent».', 'Ratios that are worth the same are “equivalent”.'),
    crear: rng => { const a = rng.entero(1, 5), b = rng.entero(a + 1, 7), k = rng.entero(2, 5); return { datos: [a, b, k], frase: `The ratios ${razonTxt(a, b)} and ${razonTxt(a * k, b * k)} are ${HUECO}.`, correcta: 'equivalent', falsas: ['simplest', 'unit', 'per'] }; } },
  { id: 'directly', paquete: 1, sesion: 3, nota: par('Si una cantidad se duplica y la otra también, son «directly proportional».', 'If one quantity doubles and the other also doubles, they are “directly proportional”.'),
    crear: rng => { const [x, y] = rng.elegir([['pens', 'cost'], ['tickets', 'price'], ['kilos of apples', 'price'], ['packets of rice', 'weight'], ['metres of ribbon', 'cost'], ['litres of petrol', 'price']]); return { datos: [x.length], frase: `The number of ${x} and the ${y} are ${HUECO} proportional: when one doubles, the other also doubles.`, correcta: 'directly', falsas: ['equally', 'simply', 'mostly', T('inversely', { paquete: 2, contrario: true })] }; } },
  { id: 'simplest', paquete: 1, sesion: 2, nota: par('La razón con los números más pequeños es la «simplest form».', 'The ratio with the smallest numbers is the “simplest form”.'),
    crear: rng => { const [a, b] = rng.elegir([[2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [1, 4]]); const g = rng.entero(2, 6); return { datos: [a, b, g], frase: `The ratio ${razonTxt(g * a, g * b)} in its ${HUECO} form is ${razonTxt(a, b)}.`, correcta: 'simplest', falsas: ['biggest', 'longest', 'highest'] }; } },
  { id: 'unit', paquete: 1, sesion: 3, nota: par('Lo que corresponde a una sola unidad es la «unit rate».', 'What belongs to one single unit is the “unit rate”.'),
    crear: rng => { const [n, u] = [rng.elegir([4, 5, 6, 8, 10]), rng.elegir([1, 2, 3])]; return { datos: [n, u], frase: `${n} pens cost £${n * u}: the ${HUECO} rate is £${u} for one pen.`, correcta: 'unit', falsas: ['simplest', 'equivalent', 'biggest'] }; } },
  { id: 'proportion', paquete: 1, sesion: 3, nota: par('Una igualdad de dos razones es una «proportion».', 'An equality of two ratios is a “proportion”.'),
    crear: rng => { const a = rng.entero(1, 5), b = rng.entero(a + 1, 7), k = rng.entero(2, 5); return { datos: [a, b, k], frase: `A ${HUECO} says that two ratios are equal, for example ${razonTxt(a, b)} = ${razonTxt(a * k, b * k)}.`, correcta: 'proportion', falsas: ['unit', 'total', 'term'] }; } },
  { id: 'every', paquete: 1, sesion: 1, nota: par('«for every» es «por cada»: 3 chicos por cada 4 chicas.', '“for every” means “for each”: 3 boys for every 4 girls.'),
    crear: rng => { const a = rng.entero(2, 5), b = rng.entero(2, 6); return { datos: [a, b], frase: `There are ${a} boys for ${HUECO} ${b} girls.`, correcta: 'every', falsas: ['from', 'into', 'than'] }; } },
  { id: 'inversely', paquete: 2, sesion: 5, nota: par('Si una cantidad sube y la otra baja, son «inversely proportional».', 'If one quantity goes up and the other goes down, they are “inversely proportional”.'),
    crear: rng => { const [x, y] = rng.elegir([['workers', 'days'], ['taps', 'hours'], ['machines', 'days'], ['cooks', 'hours'], ['pumps', 'minutes']]); return { datos: [x.length], frase: `The more ${x}, the fewer ${y}: ${x} and ${y} are ${HUECO} proportional.`, correcta: 'inversely', falsas: ['simply', 'mostly', T('directly', { paquete: 1, contrario: true })] }; } },
  { id: 'share', paquete: 2, sesion: 7, nota: par('Se dice «share … in the ratio».', 'We say “share … in the ratio”.'),
    crear: rng => { const a = rng.entero(1, 5), b = rng.entero(1, 5); if (a === b) throw new ItemPobre('igual'); const k = rng.entero(3, 12); return { datos: [a, b, k], frase: `Share ${(a + b) * k} sweets ${HUECO} the ratio ${razonTxt(a, b)}.`, correcta: 'in', falsas: ['of', 'from', 'over'] }; } },
  { id: 'same', paquete: 2, sesion: 5, nota: par('«at the same rate» es «al mismo ritmo».', '“at the same rate” means “at the same speed”.'),
    crear: rng => { const [n, m] = mult(rng, [20, 30, 40, 60], [5, 10]); return { datos: [n, m], frase: `Two machines work at the ${HUECO} rate: each makes ${n} toys in ${m} minutes.`, correcta: 'same', falsas: ['other', 'next', 'opposite'] }; } },
  { id: 'per-cent', paquete: 3, sesion: 9, nota: par('«per cent» es «por ciento»: veinte por ciento.', '“per cent” means “out of every hundred”.'),
    crear: rng => { const p = rng.elegir([10, 20, 25, 30, 40, 50, 60, 75]); return { datos: [p], frase: `${p} ${HUECO} of the pupils walk to school.`, correcta: 'per cent', falsas: ['per', 'percentage', 'out of', 'percentages'] }; } },
  { id: 'increase', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, nota: par('Si el precio sube, es un «increase».', 'If the price goes up, it is an “increase”.'),
    crear: rng => { const [b, p] = rng.elegir([[50, 10], [50, 20], [80, 25], [80, 50], [100, 20], [100, 50], [200, 10], [200, 25]]); return { datos: [b, p], frase: `The price rose from £${b} to £${b + b * p / 100}: it is a ${p}% ${HUECO}.`, correcta: 'increase', falsas: [T('decrease', { contrario: true }), 'discount', 'VAT', 'ratio'] }; } },
  { id: 'discount', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, nota: par('Lo que se resta al precio es el «discount».', 'What is taken off the price is the “discount”.'),
    crear: rng => { const [b, p] = rng.elegir([[50, 10], [80, 25], [80, 50], [100, 20], [100, 50], [200, 10], [200, 25]]); return { datos: [b, p], frase: `The coat costs £${b} but has a ${p}% ${HUECO}: now it costs £${b - b * p / 100}.`, correcta: 'discount', falsas: [T('increase', { contrario: true }), 'VAT', 'ratio', 'table'] }; } },
  { id: 'sale', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 12, nota: par('El «sale price» es el precio rebajado.', 'The “sale price” is the price after the discount.'),
    crear: rng => { const [x, n] = [rng.elegir(['coat', 'bike', 'phone', 'jacket']), rng.elegir([40, 60, 80, 120, 200])]; return { datos: [n], frase: `The ${x} costs £${n} before the discount. The ${HUECO} price is what you pay after it.`, correcta: 'sale', falsas: ['unit', 'simplest', 'biggest'] }; } },
  { id: 'vat', paquete: 3, desde: DESDE_PAQUETE_3B, sesion: 13, nota: par('El impuesto que se suma al precio es el «VAT» (el IVA).', 'The tax that is added to the price is “VAT”.'),
    crear: rng => { const x = rng.elegir(['bike', 'phone', 'laptop', 'TV']); return { datos: [x.length], frase: `The shop adds 21% ${HUECO} to the price of the ${x}.`, correcta: 'VAT', falsas: ['discount', 'decrease', 'ratio'] }; } },
  { id: 'scale-n', paquete: 4, sesion: 16, nota: par('Con la escala 1 : n, 1 cm del mapa son n cm de la realidad.', 'With the scale 1 : n, 1 cm on the map is n cm in real life.'),
    crear: rng => { const n = rng.elegir([25000, 50000, 100000, 200000]); return { datos: [n], frase: `On a map with scale 1${NBSP}:${NBSP}${miles(n)}, 1 cm on the map is ${HUECO} cm in real life.`, correcta: miles(n), falsas: [miles(n / 10), miles(n * 10), miles(n / 100)] }; } },
  { id: 'model', paquete: 4, sesion: 17, nota: par('Una copia pequeña de un objeto real es una «model» (una maqueta).', 'A small copy of a real object is a “model”.'),
    crear: rng => { const x = rng.elegir(['plane', 'car', 'ship', 'bridge', 'train']); return { datos: [x.length], frase: `A ${HUECO} is a small copy of a real object, such as a ${x}.`, correcta: 'model', falsas: ['table', 'price', 'total'] }; } },
  { id: 'scale-word', paquete: 4, sesion: 16, nota: par('La «scale» es la escala del mapa.', 'The “scale” is the scale of the map.'),
    crear: rng => { const n = rng.elegir([25000, 50000, 100000]); return { datos: [n], frase: `The ${HUECO} of the map is 1${NBSP}:${NBSP}${miles(n)}.`, correcta: 'scale', falsas: ['price', 'table', 'total'] }; } },
];

export function generarCompleta(rng, sesion) {
  const { fecha, idioma } = entrada(sesion);
  const banco = activos(COMPLETAS, fecha);
  for (let i = 0; i < 80; i++) {
    const c = rng.elegir(banco);
    try {
      const m = c.crear(rng);
      libre('completa', [c.id.length, ...m.datos]);
      const falsas = m.falsas
        .map(f => (typeof f === 'string' ? T(f) : f))
        .filter(f => !f.paquete && !f.desde || disponible(f, fecha) || (f.paquete === 1))
        .map(f => ({
          texto: f.texto,
          error: f.contrario ? 'confunde-contrarios' : 'palabra-que-no-encaja',
          por_que: par(`«${f.texto}» no encaja en la frase: aquí va «${m.correcta}».`, `“${f.texto}” does not fit the sentence: “${m.correcta}” goes here.`),
        }));
      const completa = m.frase.replace(HUECO, m.correcta);
      const solucion = par(`«${completa}» ${c.nota.es}`, `“${completa}” ${c.nota.en}`);
      return armar(rng, {
        plantilla: `completa_${c.id}`, instruccion: 'completa', notacion: frase(m.frase),
        correcta: { texto: m.correcta }, falsas, solucion, sesion: c.sesion, paquete: c.paquete, idioma,
      });
    } catch (e) { if (!(e instanceof ItemPobre)) throw e; }
  }
  throw new Error('No se ha podido generar un ítem');
}

export const claveItem = item => `${item.plantilla}|${item.notacion ?? ''}|${item.solucion?.es ?? ''}`;
