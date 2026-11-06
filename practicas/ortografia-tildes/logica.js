// Ortografía: las tildes. Lógica (tarea 135, 2026-11-06): el motor de reglas, los
// bancos de ítems con `nivel: 1 | 2 | 3`, los generadores (con `elegirDeNivel` de
// ../_comun/nivel.js), las explicaciones ligadas al ítem y los `idError`. Todo puro
// (sin DOM): lo prueba tests/practicas-ortografia-tildes.test.js.
//
// El motor `acentuar(silabas, tonica)` escribe la palabra como manda la Ortografía de
// 2010 a partir de sus sílabas (sin tildes) y de cuál es la tónica. Cada palabra de los
// bancos se escribe a mano con su partición, su tónica Y su forma correcta; el test
// comprueba que el motor da esa forma, así que una tilde mal puesta en un banco no llega
// al alumno. No hay silabeador automático: la partición se escribe a mano.
//
// Notación de los bancos (una cadena por palabra): las sílabas separadas por «-», la
// tónica precedida de «'» y la palabra escrita con sus tildes («'lá-piz», «ca-'fé»).
// Los adverbios en -mente llevan «|mente» detrás del adjetivo («'fá-cil|mente»): la
// tilde la decide el adjetivo.

import { elegirDeNivel, nivelForzado } from '../_comun/nivel.js';
import { slug } from '../_comun/ortografia.js';

// --- El motor de reglas ------------------------------------------------------------

const VOCALES = 'aeiou';
const ABIERTAS = 'aeo';
const CERRADAS = 'iu';
const CON_TILDE = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' };

/** Quita las tildes (no la ñ ni la diéresis): «Ángel» → «Angel», «camión» → «camion». */
export const sinTildes = texto => String(texto).normalize('NFD').replace(/́/g, '').normalize('NFC');

/** Posiciones de las vocales de una sílaba; la u muda de «que, qui, gue, gui» no cuenta. */
export function vocalesDe(silaba) {
  const s = silaba.toLowerCase();
  const posiciones = [];
  for (let i = 0; i < s.length; i++) {
    if (!VOCALES.includes(s[i])) continue;
    if (s[i] === 'u' && i > 0 && (s[i - 1] === 'q' || (s[i - 1] === 'g' && i + 1 < s.length && 'ei'.includes(s[i + 1])))) continue;
    posiciones.push(i);
  }
  return posiciones;
}

/** Las vocales de una sílaba como texto («cion» → «io», «ia» → «ia», «qui» → «i»). */
export const nucleo = silaba => vocalesDe(silaba).map(i => silaba[i].toLowerCase()).join('');

/** Una sílaba tiene un solo núcleo: una vocal, un diptongo (cerrada con abierta, o dos cerradas) o un triptongo (cerrada, abierta, cerrada). */
export function nucleoValido(silaba) {
  const v = nucleo(silaba);
  if (v.length === 1) return true;
  if (v.length === 2) return !(ABIERTAS.includes(v[0]) && ABIERTAS.includes(v[1]));
  if (v.length === 3) return CERRADAS.includes(v[0]) && ABIERTAS.includes(v[1]) && CERRADAS.includes(v[2]);
  return false;
}

/** Dónde va la tilde dentro de una sílaba: la vocal única, la abierta de un diptongo o triptongo, la segunda de dos cerradas. */
export function posicionTilde(silaba) {
  const pos = vocalesDe(silaba);
  const abierta = pos.find(i => ABIERTAS.includes(silaba[i].toLowerCase()));
  return abierta ?? pos.at(-1);
}

function conTilde(silaba) {
  const i = posicionTilde(silaba);
  return silaba.slice(0, i) + CON_TILDE[silaba[i]] + silaba.slice(i + 1);
}

/**
 * ¿Es la tónica una i o una u sola que va junto a una vocal abierta (en la sílaba de al lado, con
 * h en medio o sin ella)? Es un hiato con vocal cerrada tónica: lleva tilde siempre (dí-a, ra-íz, bú-ho).
 */
export function hiatoConCerrada(silabas, tonica) {
  const s = silabas[tonica].toLowerCase();
  const v = vocalesDe(s);
  if (v.length !== 1 || !CERRADAS.includes(s[v[0]])) return false;
  const antes = silabas[tonica - 1]?.toLowerCase();
  const despues = silabas[tonica + 1]?.toLowerCase();
  const alPrincipio = v[0] === 0 || (v[0] === 1 && s[0] === 'h');
  const alFinal = v[0] === s.length - 1;
  return Boolean((alPrincipio && antes && ABIERTAS.includes(antes.at(-1))) || (alFinal && despues && /^h?[aeo]/.test(despues)));
}

/** La clase de la palabra por su tónica. */
export function clase(silabas, tonica) {
  const desde = silabas.length - 1 - tonica;
  if (silabas.length === 1) return 'monosilaba';
  return desde === 0 ? 'aguda' : desde === 1 ? 'llana' : desde === 2 ? 'esdrujula' : 'sobresdrujula';
}

/** ¿Acaba en vocal, en n o en s (y la s no va detrás de otra consonante)? La y final cuenta como consonante. */
export function acabaEnVocalNS(silabas) {
  const palabra = silabas.join('').toLowerCase();
  const fin = palabra.at(-1);
  if (VOCALES.includes(fin) || fin === 'n') return true;
  return fin === 's' && VOCALES.includes(palabra.at(-2));
}

/**
 * Qué manda la Ortografía para esta palabra: { clase, lleva, motivo }. `motivo`: monosilaba,
 * hiato, aguda-con, aguda-sin, llana-con, llana-sin, esdrujula o sobresdrujula.
 */
export function razon(silabas, tonica) {
  const c = clase(silabas, tonica);
  if (c === 'monosilaba') return { clase: c, lleva: false, motivo: 'monosilaba' };
  if (hiatoConCerrada(silabas, tonica)) return { clase: c, lleva: true, motivo: 'hiato' };
  if (c === 'esdrujula' || c === 'sobresdrujula') return { clase: c, lleva: true, motivo: c };
  const termina = acabaEnVocalNS(silabas);
  if (c === 'aguda') return { clase: c, lleva: termina, motivo: termina ? 'aguda-con' : 'aguda-sin' };
  return { clase: c, lleva: !termina, motivo: termina ? 'llana-sin' : 'llana-con' };
}

/** Las sílabas con la tilde puesta donde toca. */
export function acentuarSilabas(silabas, tonica) {
  const { lleva } = razon(silabas, tonica);
  return silabas.map((s, i) => (i === tonica && lleva ? conTilde(s) : s));
}

/** La palabra escrita como manda la Ortografía. */
export const acentuar = (silabas, tonica) => acentuarSilabas(silabas, tonica).join('');

/** Lo mismo para un ítem de los bancos: en los adverbios en -mente, la tilde es la del adjetivo. */
export function escritaDe(item) {
  return item.mente ? acentuar(item.silabas.slice(0, -2), item.tonica) + 'mente' : acentuar(item.silabas, item.tonica);
}

/** ¿Lleva tilde el ítem? (el adverbio en -mente, si la lleva el adjetivo). */
export function llevaTilde(item) {
  return razon(item.mente ? item.silabas.slice(0, -2) : item.silabas, item.tonica).lleva;
}

/** Cuál es la razón del ítem (la del adjetivo, en los adverbios en -mente). */
export const razonDe = item => razon(item.mente ? item.silabas.slice(0, -2) : item.silabas, item.tonica);

/** La posición, dentro de la palabra entera, de la letra que lleva la tilde (null si no la lleva). */
export function letraConTilde(item) {
  if (!llevaTilde(item)) return null;
  const antes = item.silabas.slice(0, item.tonica).join('').length;
  return antes + posicionTilde(item.silabas[item.tonica]);
}

/**
 * Qué junta de vocales tiene la palabra: 'hiato' (i o u tónica junto a una abierta), 'triptongo',
 * 'ui-iu' (diptongo de dos cerradas), 'diptongo', 'hiato-abiertas' (dos vocales contiguas en sílabas
 * distintas, sin cerrada tónica) o null si no tiene vocales juntas.
 */
export function tipoUnion(silabas, tonica) {
  if (hiatoConCerrada(silabas, tonica)) return 'hiato';
  const nucleos = silabas.map(nucleo);
  if (nucleos.some(v => v.length === 3)) return 'triptongo';
  const dos = nucleos.filter(v => v.length === 2);
  if (dos.some(v => v === 'ui' || v === 'iu')) return 'ui-iu';
  if (dos.length) return 'diptongo';
  for (let i = 1; i < silabas.length; i++) {
    if (VOCALES.includes(silabas[i - 1].toLowerCase().at(-1)) && /^h?[aeiou]/.test(silabas[i].toLowerCase())) return 'hiato-abiertas';
  }
  return null;
}

/** «'lá-piz» → { palabra: 'lapiz', escrita: 'lápiz', silabas: ['la','piz'], tonica: 0, mente: false, nivel }. */
export function parsear(crudo, nivel) {
  const mente = crudo.endsWith('|mente');
  const partes = (mente ? crudo.slice(0, -'|mente'.length) : crudo).split('-');
  let tonica = -1;
  const escritas = partes.map((p, i) => {
    if (!p.startsWith("'")) return p;
    tonica = i;
    return p.slice(1);
  });
  if (tonica < 0) throw new Error(`Falta la tónica en «${crudo}»`);
  const silabas = escritas.map(sinTildes);
  if (mente) silabas.push('men', 'te');
  return { palabra: silabas.join(''), escrita: escritas.join('') + (mente ? 'mente' : ''), silabas, tonica, mente, nivel };
}

const banco = (porNivel, extra = () => ({})) =>
  [1, 2, 3].flatMap(nivel => porNivel[nivel].map(crudo => {
    const p = parsear(crudo, nivel);
    return { ...p, ...extra(p) };
  }));

// --- Ejercicio 1: la sílaba tónica -----------------------------------------------------

const CRUDO_TONICA = {
  1: [
    "re-'loj", "pa-'pel", "ca-'lor", "ver-'dad", "ca-'fé", // agudas
    "'ca-sa", "'me-sa", "ven-'ta-na", "co-'ci-na", "'li-bro", // llanas
    "'sá-ba-do", "'mé-di-co", "'mú-si-ca", "te-'lé-fo-no", "'pá-ja-ro", "'cá-ma-ra", // esdrújulas
  ],
  2: [
    "can-ta-'rá", "can-'tó", "es-cri-'bir", "de-ci-'mal", "hos-pi-'tal",
    "can-'ta-ba", "e-'xa-men", "ca-'rác-ter", "ca-rac-'te-res", "i-'ma-gen",
    "e-'xá-me-nes", "'jó-ve-nes", "i-'má-ge-nes", "vo-'lú-me-nes", "'ór-de-nes", "re-'sú-me-nes",
  ],
  3: [
    "ba-lom-'pié", "a-de-'más", "es-ta-bi-li-'dad", "res-pon-sa-bi-li-'dad", // agudas
    "ciu-da-'da-no", "cui-da-'do-so", "pa-'ra-guas", "an-'ti-guo", // llanas
    "mur-'cié-la-go", "de-ci-mo-'sép-ti-mo", "ma-te-'má-ti-ca", "ve-'hí-cu-lo", // esdrújulas
    "de-'vuél-ve-me-lo", "'cuén-ta-me-lo", "'có-me-te-lo", "ex-'plí-ca-se-lo", // sobresdrújulas
  ],
};

/** Palabras para decir cuál es la tónica y cómo es la palabra. */
export const TONICA = banco(CRUDO_TONICA, p => ({ clase: clase(p.silabas, p.tonica) }));

// --- Ejercicio 2: ¿lleva tilde? ----------------------------------------------------------

const CRUDO_TILDE = {
  1: [
    "ca-'mión", "can-'ción", "so-'fá", "des-'pués", "ja-'más", "a-de-'más", "'mú-si-ca", "'sá-ba-do", // con tilde
    "re-'loj", "pa-'red", "ver-'dad", "can-'tar", "a-'zul", "fe-'liz", "e-'xa-men", "'lu-nes", // sin tilde
  ],
  2: [
    "'ár-bol", "'lá-piz", "'fá-cil", "di-'fí-cil", "'cár-cel", "'cés-ped", "'ál-bum", "e-'xá-me-nes", // con tilde
    "ca-rac-'te-res", "o-'ri-gen", "re-'su-men", "vo-'lu-men", "pro-fe-'sor", "tra-ba-'jar", "ho-ri-zon-'tal", "a-ni-'mal", // sin tilde
  ],
  3: [
    "'bí-ceps", "'có-mics", "'fá-cil|mente", "'rá-pi-da|mente", "'Án-gel", "'Á-fri-ca", "'Ós-car", "'Úr-su-la", // con tilde
    "'fue", "'dio", "'vio", "'pie", "jer-'sey", "ro-'bots", "tran-'qui-la|mente", "'so-la|mente", // sin tilde
  ],
};

/** Palabras sin tildes, partidas en sílabas: ¿cuál lleva la tilde? */
export const TILDE = banco(CRUDO_TILDE);

// --- Ejercicio 3: diptongos e hiatos ------------------------------------------------------

const CRUDO_VOCALES = {
  1: [
    "'dí-a", "'tí-a", "pa-'ís", "ra-'íz", "ma-'íz", "o-'ír", "ba-'úl", "Ma-'rí-a", // hiatos con tilde
    "'Luis", "'rui-do", "cui-'da-do", "ciu-'dad", "'jui-cio", "'ai-re", "'cau-sa", "'pei-ne", // diptongos sin tilde
  ],
  2: [
    "tam-'bién", "des-'pués", "'náu-ti-co", "'hués-ped", "'cuí-da-te", "le-'ón", "a-'é-re-o", "'hé-ro-e", // con tilde
    "po-'e-ta", "to-'a-lla", "te-'a-tro", "ca-'no-a", "mu-'se-o", "i-'de-a", "'cie-lo", "'tiem-po", // sin tilde
  ],
  3: [
    "pro-'hí-be", "'bú-ho", "ve-'hí-cu-lo", "a-'hín-co", "re-'hén", "es-tu-'diáis", "cam-'biéis", "a-ve-ri-'guáis", // con tilde
    "'hui-da", "je-'sui-ta", "cons-'trui-do", "'viu-da", "des-'cui-do", "'sua-ve", "'cuo-ta", // sin tilde
  ],
};

/** «aún» o «aun», solo en frase: la frase fuerza una sola lectura. */
const AUN = [
  { antes: 'Son las nueve y ', despues: ' no ha llegado el autobús.', buena: 'aún', otra: 'aun', razon: 'todavia' },
  { antes: 'Lucía ', despues: ' está en clase.', buena: 'aún', otra: 'aun', razon: 'todavia' },
  { antes: '', despues: ' así, aprobó el examen.', buena: 'Aun', otra: 'Aún', razon: 'incluso' },
  { antes: '', despues: ' los más pequeños pueden hacerlo.', buena: 'Aun', otra: 'Aún', razon: 'incluso' },
];

/** Palabras con vocales juntas (¿lleva tilde y en qué letra?) y, en el nivel 3, cuatro frases de aún / aun. */
export const VOCALES_BANCO = [
  ...banco(CRUDO_VOCALES, p => ({ tipo: 'tocar', union: tipoUnion(p.silabas, p.tonica) })),
  ...AUN.map(a => ({ tipo: 'aun', nivel: 3, ...a })),
];

// --- Ejercicio 4: las palabras de Matemáticas -----------------------------------------------

// { raw, antes, despues, mal? }: `raw` en la notación de arriba; `mal` es la forma sin tilde que
// el alumno cree (la forma con tilde mal puesta) cuando la buena NO lleva tilde. Con tilde, la
// mala es la misma sin tilde. La frase fuerza la palabra (regla 2: «numero», «calculo»,
// «formula» o «grafica» existen como formas de un verbo, y la frase no las admite).
const CRUDO_MATES = {
  1: [
    { raw: "'nú-me-ro", antes: 'El ', despues: ' 36 es múltiplo de 9.' },
    { raw: "di-vi-'sión", antes: 'Aprendimos a hacer una ', despues: ' entre dos números.' },
    { raw: "'múl-ti-plo", antes: 'El 20 es ', despues: ' de 5.' },
    { raw: "'má-xi-mo", antes: 'El ', despues: ' común divisor de 12 y 18 es 6.' },
    { raw: "die-ci-'séis", antes: 'Ocho más ocho son ', despues: '.' },
    { raw: "Ma-te-'má-ti-cas", antes: 'Mañana tenemos examen de ', despues: '.' },
    { raw: "'cál-cu-lo", antes: 'El ', despues: ' mental es una buena forma de entrenar la cabeza.' },
    { raw: "tam-'bién", antes: 'Ana sabe sumar y ', despues: ' restar.' },
    { raw: "e-'xa-men", mal: 'exámen', antes: 'Mañana tengo un ', despues: ' de la unidad 2.' },
    { raw: "di-vi-'sor", mal: 'divisór', antes: 'En 12 : 4 = 3, el 4 es el ', despues: '.' },
    { raw: "co-'cien-te", mal: 'cocíente', antes: 'En 17 : 5, el ', despues: ' es 3 y el resto es 2.' },
    { raw: "ex-po-'nen-te", mal: 'exponénte', antes: 'En 2³, el 3 es el ', despues: '.' },
    { raw: "po-'ten-cia", mal: 'poténcia', antes: '5² es una ', despues: ' de base 5.' },
    { raw: "de-ci-'mal", mal: 'decimál', antes: 'El número 3,5 es un ', despues: '.' },
    { raw: "cua-'dra-do", mal: 'cuádrado', antes: 'El área de un ', despues: ' de lado 3 es 9.' },
    { raw: "'res-to", mal: 'résto', antes: 'En 17 : 5, el ', despues: ' es 2.' },
  ],
  2: [
    { raw: "'á-re-a", antes: 'El ', despues: ' de un rectángulo es base por altura.' },
    { raw: "'án-gu-lo", antes: 'Un ', despues: ' recto mide 90 grados.' },
    { raw: "rec-'tán-gu-lo", antes: 'Un cuadrado es un ', despues: ' con los cuatro lados iguales.' },
    { raw: "pe-'rí-me-tro", antes: 'El ', despues: ' es la suma de todos los lados.' },
    { raw: "ki-'ló-me-tro", antes: 'De casa al instituto hay un ', despues: '.' },
    { raw: "'dé-ci-ma", antes: 'El 7 de 0,7 es una ', despues: '.' },
    { raw: "'fór-mu-la", antes: 'Aprendimos la ', despues: ' del área del rectángulo.' },
    { raw: "frac-'ción", antes: 'La mitad de una pizza es una ', despues: '.' },
    { raw: "frac-'cio-nes", mal: 'fracciónes', antes: '1/2 y 3/4 son ', despues: '.' },
    { raw: "de-'ce-nas", mal: 'decénas', antes: 'En 356 hay 5 ', despues: '.' },
    { raw: "cen-'te-nas", mal: 'centénas', antes: 'En 356 hay 3 ', despues: '.' },
    { raw: "u-ni-'da-des", mal: 'unidádes', antes: 'En 356 hay 6 ', despues: '.' },
    { raw: "pa-ra-'le-las", mal: 'paralélas', antes: 'Dos rectas que nunca se cortan son ', despues: '.' },
    { raw: "dia-go-'nal", mal: 'diagonál', antes: 'La ', despues: ' de un cuadrado va de una esquina a la opuesta.' },
    { raw: "seg-'men-to", mal: 'ségmento', antes: 'Un ', despues: ' es la parte de una recta entre dos puntos.' },
    { raw: "cir-cun-fe-'ren-cia", mal: 'circunferéncia', antes: 'Dibuja una ', despues: ' con el compás.' },
  ],
  3: [
    { raw: "ra-'íz", antes: 'La ', despues: ' cuadrada de 49 es 7.' },
    { raw: "es-ta-'dís-ti-ca", antes: 'Con los datos de la clase hacemos una tabla de ', despues: '.' },
    { raw: "po-'lí-go-no", antes: 'Una figura cerrada de lados rectos es un ', despues: '.' },
    { raw: "pen-'tá-go-no", antes: 'Una figura de cinco lados es un ', despues: '.' },
    { raw: "'diá-me-tro", antes: 'El ', despues: ' de la circunferencia pasa por el centro.' },
    { raw: "'vér-ti-ce", antes: 'Cada esquina de un polígono es un ', despues: '.' },
    { raw: "i-'sós-ce-les", antes: 'Un triángulo con dos lados iguales es ', despues: '.' },
    { raw: "vi-'gé-si-mo", antes: 'En una carrera, quien llega el número 20 queda ', despues: '.' },
    { raw: "al-go-'rit-mo", mal: 'algorítmo', antes: 'Dividir por pasos, siempre igual, es un ', despues: '.' },
    { raw: "de-ci-mo-ter-'ce-ro", mal: 'décimotercero', antes: 'Mi hermano quedó ', despues: ' en la carrera.' },
    { raw: "de-ci-mo-'quin-to", mal: 'décimoquinto', antes: 'El 15.º lugar es el ', despues: '.' },
    { raw: "he-xa-go-'nal", mal: 'hexagonál', antes: 'Un prisma con base de seis lados es ', despues: '.' },
    { raw: "pa-ra-le-lo-'gra-mo", mal: 'paralelógramo', antes: 'Un cuadrilátero con lados paralelos dos a dos es un ', despues: '.' },
    { raw: "tra-'pe-cio", mal: 'trapécio', antes: 'Un cuadrilátero con solo dos lados paralelos es un ', despues: '.' },
    { raw: "pro-por-cio-'nal", mal: 'proporciónal', antes: 'Si una cantidad se duplica y la otra también, la relación es directamente ', despues: '.' },
    { raw: "ci-'lin-dro", mal: 'cílindro', antes: 'Una lata de refresco tiene forma de ', despues: '.' },
  ],
};

export const MATES = [1, 2, 3].flatMap(nivel => CRUDO_MATES[nivel].map(({ raw, mal, antes, despues }) => {
  const p = parsear(raw, nivel);
  const lleva = p.escrita !== p.palabra;
  return { ...p, antes, despues, lleva, mala: lleva ? p.palabra : mal };
}));

// --- Los generadores -------------------------------------------------------------------

/** Un generador de ítems para un banco: { i, nivel }, con `nivel` el del alumno (el de la etiqueta). */
const generadorDe = bancoDe => (rng, sesion) => {
  const { item, actual } = elegirDeNivel(rng, bancoDe, sesion, { forzado: nivelForzado() });
  return { i: bancoDe.indexOf(item), nivel: actual };
};

export const generarTonica = generadorDe(TONICA);
export const generarTilde = generadorDe(TILDE);
export function generarVocales(rng, sesion) {
  return { ...generadorDe(VOCALES_BANCO)(rng, sesion), orden: rng.azar() < 0.5 ? 0 : 1 };
}

/** En el ejercicio 4 también va el orden de los dos botones (0: la buena primero). */
export function generarMates(rng, sesion) {
  return { ...generadorDe(MATES)(rng, sesion), orden: rng.azar() < 0.5 ? 0 : 1 };
}

// --- Textos de las explicaciones (ligados al ítem) ----------------------------------------------

const NOMBRE_CLASE = { aguda: 'aguda', llana: 'llana', esdrujula: 'esdrújula', sobresdrujula: 'sobresdrújula', monosilaba: 'monosílaba' };
const DONDE_CLASE = {
  aguda: 'la tónica es la última sílaba',
  llana: 'la tónica es la penúltima sílaba',
  esdrujula: 'la tónica es la antepenúltima sílaba',
  sobresdrujula: 'la tónica es anterior a la antepenúltima sílaba',
};

export const nombreClase = c => NOMBRE_CLASE[c];

/** Las clases entre las que elige el alumno en el paso 2: tres, y cuatro en el nivel 3. */
export const clasesDe = item => (item.nivel === 3 ? ['aguda', 'llana', 'esdrujula', 'sobresdrujula'] : ['aguda', 'llana', 'esdrujula']);

/** «la-piz» con la tónica en mayúsculas y con su tilde: «LÁ-piz». */
export function silabasMarcadas(item) {
  const adj = item.mente ? item.silabas.slice(0, -2) : item.silabas;
  const escritas = acentuarSilabas(adj, item.tonica);
  const todas = item.mente ? [...escritas, 'men', 'te'] : escritas;
  return todas.map((s, i) => (i === item.tonica ? s.toUpperCase() : s)).join('-');
}

/** Cómo acaba la palabra, dicho para la explicación. */
function finDe(item) {
  const palabra = item.silabas.join('').toLowerCase();
  const fin = palabra.at(-1);
  if (VOCALES.includes(fin)) return 'en vocal';
  if (fin === 'n') return 'en n';
  if (fin === 'y') return 'en y, que cuenta como consonante';
  if (fin === 's') return VOCALES.includes(palabra.at(-2)) ? 'en s' : `en s detrás de otra consonante (${palabra.slice(-2)}), que cuenta como consonante`;
  return `en ${fin}, que no es vocal, n ni s`;
}

/** Paso 1 del ejercicio 1: «La sílaba que más se oye de papel es “pel”: pa-PEL». */
export function explicacionTonica1(item) {
  const partida = item.silabas.map((s, i) => (i === item.tonica ? s.toUpperCase() : s)).join('-');
  return `En <b>${item.palabra}</b> la sílaba que más se oye es «${item.silabas[item.tonica]}»: ${partida}.`;
}

/** Paso 2 del ejercicio 1. */
export function explicacionTonica2(item) {
  return `<b>${item.escrita}</b> (${silabasMarcadas(item)}) es <b>${nombreClase(item.clase)}</b>: ${DONDE_CLASE[item.clase]}.`;
}

/** Ejercicio 2: la regla aplicada a esa palabra. */
export function explicacionTilde(item) {
  const r = razonDe(item);
  const palabra = `<b>${item.escrita}</b> (${silabasMarcadas(item)})`;
  const mayuscula = /^[A-ZÁÉÍÓÚ]/.test(item.escrita) && r.lleva ? ' Las mayúsculas también llevan tilde.' : '';
  if (item.mente) {
    const adjetivo = item.escrita.slice(0, -'mente'.length);
    return r.lleva
      ? `${palabra}: los adverbios en -mente conservan la tilde del adjetivo, y <b>${adjetivo}</b> la lleva: <b>${item.escrita}</b> también.`
      : `${palabra}: los adverbios en -mente conservan la tilde del adjetivo, y <b>${adjetivo}</b> no la lleva: <b>${item.escrita}</b> tampoco.`;
  }
  const fin = finDe(item);
  switch (r.motivo) {
    case 'monosilaba': return `<b>${item.escrita}</b> tiene una sola sílaba: las palabras de una sílaba no llevan tilde.`;
    case 'hiato': return `${palabra}: la ${item.silabas[item.tonica].toLowerCase().includes('u') ? 'u' : 'i'} es tónica y va junto a otra vocal, así que son dos sílabas (hiato): el hiato con i o u tónica siempre lleva tilde.`;
    case 'aguda-con': return `${palabra} es aguda y acaba ${fin}: las agudas acabadas en vocal, n o s llevan tilde.${mayuscula}`;
    case 'aguda-sin': return `${palabra} es aguda y acaba ${fin}: las agudas solo llevan tilde si acaban en vocal, n o s. No lleva tilde.`;
    case 'llana-sin': return `${palabra} es llana y acaba ${fin}: las llanas acabadas en vocal, n o s no llevan tilde.`;
    case 'llana-con': return `${palabra} es llana y acaba ${fin}: las llanas llevan tilde si no acaban en vocal, n ni s.${mayuscula}`;
    default: return `${palabra} es ${nombreClase(r.clase)}: las ${nombreClase(r.clase)}s siempre llevan tilde.${mayuscula}`;
  }
}

/** Ejercicio 3: diptongo o hiato, y la regla de esa palabra. */
export function explicacionVocales(item) {
  const r = razonDe(item);
  const palabra = `<b>${item.escrita}</b> (${silabasMarcadas(item)})`;
  const reglas = r.motivo === 'monosilaba'
    ? 'tiene una sola sílaba y no lleva tilde'
    : `es ${nombreClase(r.clase)} y acaba ${finDe(item)}: ${r.lleva ? 'lleva' : 'no lleva'} tilde`;
  const frase = reglas.charAt(0).toUpperCase() + reglas.slice(1);
  switch (item.union) {
    case 'hiato': return `${palabra}: la ${nucleo(item.silabas[item.tonica])} tónica va junto a otra vocal y se separan (hiato). El hiato con i o u tónica siempre lleva tilde, en esa vocal.`;
    case 'triptongo': return `${palabra}: tres vocales juntas en una sílaba son un triptongo, y la tilde va en la vocal abierta. ${frase}.`;
    case 'ui-iu': return `${palabra}: «ui» e «iu» son un diptongo (una sola sílaba). ${frase}${r.lleva ? ', en la segunda vocal' : ''}.`;
    case 'diptongo': return `${palabra}: las dos vocales van en la misma sílaba (diptongo). ${frase}${r.lleva ? ', en la vocal abierta' : ''}.`;
    default: return `${palabra}: dos vocales abiertas seguidas no forman diptongo, son dos sílabas (hiato), y se acentúa con las reglas generales: ${reglas}.`;
  }
}

/** Ejercicio 3, aún / aun. */
export function explicacionAun(item) {
  return item.razon === 'todavia'
    ? '<b>aún</b>, con tilde, quiere decir <i>todavía</i>: «Son las nueve y todavía no ha llegado». Si puedes cambiarlo por «todavía», lleva tilde.'
    : '<b>aun</b>, sin tilde, quiere decir <i>incluso</i> o <i>hasta</i>: «Incluso así, aprobó». Si puedes cambiarlo por «incluso», no lleva tilde.';
}

/** Ejercicio 4. */
export function explicacionMates(item) {
  const r = razon(item.silabas, item.tonica);
  const palabra = `<b>${item.escrita}</b> (${silabasMarcadas(item)})`;
  const mayuscula = /^[A-Z]/.test(item.escrita) ? ' Las mayúsculas también llevan tilde.' : '';
  switch (r.motivo) {
    case 'aguda-con': return `${palabra} es aguda y acaba ${finDe(item)}: lleva tilde.`;
    case 'llana-con': return `${palabra} es llana y acaba ${finDe(item)}: lleva tilde.`;
    case 'hiato': return `${palabra}: la i tónica va junto a otra vocal (hiato): lleva tilde siempre.`;
    case 'aguda-sin': return `${palabra} es aguda y acaba ${finDe(item)}: no lleva tilde.`;
    case 'llana-sin': return `${palabra} es llana y acaba ${finDe(item)}: no lleva tilde.`;
    default: return `${palabra} es ${nombreClase(r.clase)}: las ${nombreClase(r.clase)}s siempre llevan tilde.${mayuscula}`;
  }
}

// --- idError (estable por confusión, ^[a-z0-9-]{1,40}$) -----------------------------------------------

export const idErrorTonica1 = () => 'tonica-mal';
export const idErrorTonica2 = (dicha, item) => `clase-${dicha}-por-${item.clase}`;

/** Ejercicio 2: `tocadas` son las piezas tocadas (vacío: «Ninguna»). */
export function idErrorTilde(item, tocadas) {
  const r = razonDe(item);
  const etiqueta = item.mente ? 'mente' : /^[A-ZÁÉÍÓÚ]/.test(item.escrita) && r.lleva ? 'mayuscula' : r.motivo === 'hiato' ? 'hiato' : r.clase;
  if (r.lleva) return tocadas.length ? 'tilde-en-otra-silaba' : `sin-tilde-${etiqueta}`;
  return r.motivo === 'monosilaba' ? 'tilde-en-monosilabo' : `tilde-de-mas-${etiqueta}`;
}

/** Ejercicio 3: `tocadas` son las letras tocadas (vacío: «Ninguna»). */
export function idErrorVocales(item, tocadas) {
  const r = razonDe(item);
  if (r.lleva) return tocadas.length ? 'tilde-en-otra-vocal' : `sin-tilde-${item.union === 'hiato-abiertas' ? 'hiato' : item.union}`;
  return `tilde-en-${item.union === 'hiato-abiertas' ? 'hiato' : item.union}`;
}

export const idErrorAun = (item, elegida) => (item.buena.toLowerCase() === 'aun' ? 'aun-con-tilde-por-aun' : 'aun-por-aun-con-tilde');

export const idErrorMates = item => (item.lleva ? 'sin-tilde-mates' : 'tilde-de-mas-mates');

export { slug };
