// Portada de las prácticas: una sección por unidad (la actual arriba y abierta;
// las anteriores, plegadas), cada una con sus tareas y sus prácticas
// publicadas (`disponible` en el catálogo). En las unidades 2, 3 y 4 las prácticas
// van ordenadas por la semana de la unidad en que tocan. Lleva lo que ha hecho el
// alumno según lo guardado en este navegador.
//
// El enlace que reparte el profesor es `practicas/?c=ABCD`: la portada guarda
// el código y todas las prácticas lo encuentran. «Cerrar sesión» lo olvida
// (para un aparato compartido); lo hecho sigue guardado con el código.
//
// En cada unidad, las tareas que ya han llegado a su día (`desde` en
// `_comun/tareas.js`) con su plazo y lo que lleva el alumno en cada una.

import { CATALOGO, ID_PLANTILLA, UNIDADES } from './_comun/catalogo.js';
import { leerCodigoSecreto } from './_comun/codigos.js';
import { leer, escribir, borrar, cerrarSesion, progresoGuardado } from './_comun/base.js';
import { T, esc } from './_comun/textos.js';
import { TAREAS, estadoTarea, fechaISO } from './_comun/tareas.js';
import { diaDe } from './_comun/contador.js';
import { progresoDeTarea, asignacionGuardada, cargarAsignacion, asignadaAMi, vistaPlazo, seccionesPorUnidad, unidadesAbiertas, recordarUnidad, contextoGuardado, identificar } from './vista-tareas.js';

// El orden de la portada no es el del catálogo (que no se puede renumerar):
// es el de la unidad. Cada bloque es de una unidad (`unidad`); las unidades sin
// bloques (la 1) enseñan sus prácticas en una lista sin subtítulos. Una
// práctica del catálogo que no esté en ningún bloque de su unidad sale al
// final, en «Otras», para que no se pierda.
export const BLOQUES = [
  {
    unidad: 2,
    titulo: { es: 'Semana 1 · Múltiplos, divisores y criterios', en: 'Week 1 · Multiples, divisors and divisibility rules' },
    slugs: ['semaforo', 'rectangulos', 'recta'],
  },
  {
    unidad: 2,
    titulo: { es: 'Semana 2 · Números primos y factorización', en: 'Week 2 · Prime numbers and factorisation' },
    slugs: ['criba', 'arbol', 'divisiones', 'fabrica', 'factorizaciones'],
  },
  {
    unidad: 2,
    titulo: { es: 'Semana 3 · m.c.d. y m.c.m. con factores primos', en: 'Week 3 · GCD and LCM with prime factors' },
    slugs: ['venn', 'imposibles', 'por-primos'],
  },
  {
    unidad: 2,
    titulo: { es: 'Semana 4 · Problemas y errores típicos', en: 'Week 4 · Word problems and common mistakes' },
    slugs: ['clasificador', 'reloj', 'baldosas', 'errores'],
  },
  {
    unidad: 2,
    titulo: { es: 'Para toda la unidad · Vocabulario', en: 'For the whole unit · Vocabulary' },
    slugs: ['leelo', 'divisores'],
  },
  {
    unidad: 2,
    titulo: { es: 'Para toda la unidad · Refuerzo: las fichas del parchís', en: 'For the whole unit · Support: Ludo counters' },
    slugs: ['fichas-de-pablo'],
  },
  // Unidad 3 (PU2, tarea 79): cada práctica sale en su bloque cuando su tarea de la semana la publica.
  {
    unidad: 3,
    titulo: { es: 'Semana 1 · Los enteros: recta, orden, sumas y restas', en: 'Week 1 · Integers: number line, order, adding and subtracting' },
    slugs: ['termometro', 'opuestos', 'situaciones', 'saltos'],
  },
  {
    unidad: 3,
    titulo: { es: 'Semana 2 · Dos signos seguidos y la regla de los signos', en: 'Week 2 · Two signs in a row and the rule of signs' },
    slugs: ['dos-signos', 'signos-producto'],
  },
  {
    unidad: 3,
    titulo: { es: 'Semana 3 · Potencias, jerarquía y paréntesis', en: 'Week 3 · Powers, order of operations and brackets' },
    slugs: ['potencias-enteros', 'jerarquia-enteros', 'parentesis-enteros'],
  },
  {
    unidad: 3,
    titulo: { es: 'Semana 4 · Problemas y errores típicos', en: 'Week 4 · Word problems and common mistakes' },
    slugs: ['variacion', 'errores3'],
  },
  {
    unidad: 3,
    titulo: { es: 'Para toda la unidad · Vocabulario', en: 'For the whole unit · Vocabulary' },
    slugs: ['leelo3'],
  },
  // Unidad 4 (PU2, tarea 98): cada práctica sale en su bloque cuando su tarea de la semana la publica (109-111).
  {
    unidad: 4,
    titulo: { es: 'Semana 1 · Qué es una fracción, equivalentes y comparar', en: 'Week 1 · What a fraction is, equivalent fractions and comparing' },
    slugs: ['que-fraccion', 'equivalentes', 'simplifica', 'compara'],
  },
  {
    unidad: 4,
    titulo: { es: 'Semana 2 · La fracción de una cantidad, sumas y restas', en: 'Week 2 · Fraction of a quantity, adding and subtracting' },
    slugs: ['fraccion-de', 'suma-resta'],
  },
  {
    unidad: 4,
    titulo: { es: 'Semana 3 · Multiplicar, dividir, combinadas y errores', en: 'Week 3 · Multiplying, dividing, mixed operations and mistakes' },
    slugs: ['multiplica-divide', 'combinadas-fracciones', 'errores4'],
  },
  {
    unidad: 4,
    titulo: { es: 'Para toda la unidad · Vocabulario', en: 'For the whole unit · Vocabulary' },
    slugs: ['leelo4'],
  },
];
const OTRAS = { es: 'Otras', en: 'Others' };

/** Qué se practica en cada una, en una línea. */
export const DESCRIPCION = {
  divisores: { es: '«Divisor de», «múltiplo de» o «divisible entre»: completa la frase a partir de una multiplicación o de una división.', en: '“Divisor of”, “multiple of” or “divisible by”: complete the sentence from a multiplication or a division.' },
  semaforo: { es: 'Los criterios del 2, 3, 5, 9, 10 y 11, los criterios compuestos y la cifra que falta.', en: 'The divisibility rules for 2, 3, 5, 9, 10 and 11, the combined rules and the missing digit.' },
  rectangulos: { es: 'Todos los divisores de un número, por parejas, y cuándo se deja de buscar.', en: 'All the divisors of a number, in pairs, and when to stop looking.' },
  recta: { es: 'Múltiplos y divisores en la recta numérica, con el 0 y el 1, y frases de verdadero o falso.', en: 'Multiples and divisors on the number line, with 0 and 1, and true or false sentences.' },
  criba: { es: 'La criba de Eratóstenes, primo o compuesto, y hasta qué primo hay que probar.', en: 'The sieve of Eratosthenes, prime or composite, and how far you need to try.' },
  arbol: { es: 'Descompón un número con un árbol de factores hasta que solo queden primos.', en: 'Break a number down with a factor tree until only primes are left.' },
  divisiones: { es: 'Factoriza dividiendo entre el menor primo, escríbelo con potencias y comprueba multiplicando.', en: 'Factorise by dividing by the smallest prime, write it with powers and check by multiplying.' },
  fabrica: { es: 'Cuenta los divisores de un número con su factorización y decide sin dividir si uno es divisor de otro.', en: 'Count the divisors of a number from its factorisation and decide without dividing if one number is a divisor of another.' },
  factorizaciones: { es: 'Multiplica, divide y decide si un número es múltiplo de otro mirando solo las factorizaciones.', en: 'Multiply, divide and decide if a number is a multiple of another by looking only at the factorisations.' },
  venn: { es: 'Reparte los factores primos de dos números: lo común es el m.c.d. y todo junto es el m.c.m.', en: 'Sort the prime factors of two numbers: the common part is the GCD and everything together is the LCM.' },
  imposibles: { es: 'Respuestas que no pueden ser: lo que el m.c.d. y el m.c.m. cumplen siempre, y cómo se nombra la respuesta.', en: 'Answers that cannot be right: what the GCD and the LCM always satisfy, and how to name the answer.' },
  'por-primos': { es: 'Toca · 2, : 3… hasta que el número sea múltiplo o divisor del objetivo, y busca el m.c.m. y el m.c.d., o fabrica todos los divisores de un número.', en: 'Tap · 2, : 3… until the number is a multiple or a divisor of the target, and find the LCM and the GCD, or build all the divisors of a number.' },
  'fichas-de-pablo': { es: 'Cada número es un montón de fichas de colores: multiplicar es juntar, dividir es quitar, el m.c.d. son las fichas que tienen los dos y el m.c.m. es el montón más pequeño que contiene a los dos.', en: 'Every number is a pile of coloured counters: multiplying is putting them together, dividing is taking them away, the GCD is the counters they both have and the LCM is the smallest pile that contains both.' },
  clasificador: { es: 'Lee el problema y decide, sin calcular, si pide el m.c.d. o el m.c.m., y por qué.', en: 'Read the problem and decide, without calculating, if it asks for the GCD or the LCM, and why.' },
  reloj: { es: 'Problemas de coincidencias: cada cuánto coinciden y a qué hora.', en: 'Coincidence problems: how often things coincide and at what time.' },
  baldosas: { es: 'La baldosa más grande que cubre un suelo sin cortar y los trozos de cuerda iguales más largos.', en: 'The biggest tile that covers a floor without cutting and the longest equal pieces of rope.' },
  errores: { es: 'Procedimientos de toda la unidad: decide si hay un error, en qué línea está y qué error es.', en: 'Worked answers from the whole unit: decide if there is a mistake, which line it is in and what mistake it is.' },
  leelo: { es: 'Escucha y lee en inglés factorizaciones, m.c.d. y m.c.m., y completa frases con la palabra que falta.', en: 'Listen to and read factorisations, GCDs and LCMs in English, and complete sentences with the missing word.' },
  jerarquia: { es: 'Toca la operación que se hace primero, paso a paso, con potencias, raíces y paréntesis.', en: 'Tap the operation that comes first, step by step, with powers, roots and brackets.' },
  parentesis: { es: 'Coloca paréntesis en una expresión para conseguir el resultado que se pide.', en: 'Place brackets in an expression to get the result you are asked for.' },
  exponente: { es: 'A qué afecta el exponente, la potencia como multiplicación repetida y el cuadrado de una suma.', en: 'What the index applies to, a power as repeated multiplication and the square of a sum.' },
  raiz: { es: 'La raíz cuadrada formando cuadrados con fichas: raíz exacta, raíz entera y resto.', en: 'Square roots by making squares with counters: exact root, whole root and remainder.' },
  division: { es: 'Reparte en cajas: cociente, resto, la prueba de la división y qué significa el resto.', en: 'Share into boxes: quotient, remainder, checking a division and what the remainder means.' },
  expresion: { es: 'Del enunciado de un problema a su expresión, con paréntesis solo donde hacen falta.', en: 'From a word problem to its expression, with brackets only where they are needed.' },
  redondeo: { es: 'Redondea en la recta y a tres órdenes, estima y decide si un resultado es razonable.', en: 'Round on the number line and to three place values, estimate and decide if a result is reasonable.' },
  constructor: { es: 'Construye números con sus cifras, di cuánto vale cada cifra y escríbelos con cifras y con palabras.', en: 'Build numbers from their digits, say the value of each digit and write them in figures and in words.' },
  distributiva: { es: 'La propiedad distributiva y el factor común con rectángulos, y multiplicar por 99 de cabeza.', en: 'The distributive property and the common factor with rectangles, and multiplying by 99 in your head.' },
  potencias10: { es: 'Potencias de 10, sus ceros y sus nombres: million, billion y trillion frente al español.', en: 'Powers of 10, their zeros and their names: million, billion and trillion compared with Spanish.' },
  dictado: { es: 'Escucha un número y escríbelo con cifras; cómo se escriben los números en inglés y en español.', en: 'Listen to a number and write it in figures; how to spell numbers in English and in Spanish.' },
  mental: { es: 'Compensar, descomponer y elegir la estrategia que conviene a cada cuenta.', en: 'Compensating, splitting a factor and choosing the best strategy for each calculation.' },
  especiales: { es: 'Exponentes 0 y 1, potencias de 10 y las igualdades con las que todos se confunden.', en: 'Indices 0 and 1, powers of 10 and the equalities that everyone gets wrong.' },
  errores1: { es: 'Procedimientos de la unidad 1: decide si hay un error, en qué línea está y qué error es.', en: 'Worked answers from unit 1: decide if there is a mistake, which line it is in and what mistake it is.' },
  propiedades: { es: 'Ampliación: producto, cociente y potencia de potencias de la misma base, y el reto de la última cifra.', en: 'Extension: product, quotient and power of powers with the same base, and the last-digit challenge.' },
  termometro: { es: 'Coloca y lee enteros en la recta y en el termómetro, compáralos y ordénalos.', en: 'Place and read integers on the number line and on a thermometer, compare them and put them in order.' },
  opuestos: { es: 'El opuesto, como el simétrico respecto del 0, y el valor absoluto, como la distancia al 0.', en: 'The opposite, as the mirror image across 0, and the absolute value, as the distance from 0.' },
  situaciones: { es: 'Temperaturas, plantas, saldos, buceo y años: de la situación al entero y del entero a la situación.', en: 'Temperatures, floors, money, diving and years: from the situation to the integer and back.' },
  saltos: { es: 'Sumas y restas sin paréntesis con saltos en la recta, el signo antes de calcular y cadenas de varios términos.', en: 'Adding and subtracting without brackets with jumps on the number line, the sign before you calculate and chains of several terms.' },
  'dos-signos': { es: 'Sumar y restar un negativo: de dos signos seguidos a uno solo, y quitar los paréntesis de los números.', en: 'Adding and subtracting a negative number: from two signs in a row to just one, and removing the brackets around numbers.' },
  'signos-producto': { es: 'Multiplica y divide con la regla de los signos, sin confundirla con la de la suma.', en: 'Multiply and divide with the rule of signs, without mixing it up with addition.' },
  'potencias-enteros': { es: 'El signo de un producto de varios factores y de una potencia de base negativa: (−3)² frente a −3².', en: 'The sign of a product of several factors and of a power with a negative base: (−3)² compared with −3².' },
  'jerarquia-enteros': { es: 'Toca la operación que va primero, paso a paso, con enteros, productos y potencias.', en: 'Tap the operation that comes first, step by step, with integers, products and powers.' },
  'parentesis-enteros': { es: 'Quita paréntesis precedidos de + y de −, opera de dentro afuera y coloca paréntesis para conseguir un resultado.', en: 'Remove brackets after + and after −, work from the inside out and place brackets to get a result.' },
  errores3: { es: 'Procedimientos de la unidad 3: dónde está el error, qué error es y qué no es un error.', en: 'Worked answers from unit 3: where the mistake is, which mistake it is and what is not a mistake.' },
  variacion: { es: 'Cuánto ha subido o bajado, diferencias de temperaturas y de alturas, el dato que falta y los años antes de Cristo.', en: 'How much it has risen or fallen, differences of temperatures and heights, the missing piece and years BC.' },
  leelo3: { es: 'Lee en inglés enteros, sumas, productos y potencias con signo, y pasa de las palabras a los símbolos.', en: 'Read integers, sums, products and powers with signs in English, and go from words to symbols.' },
  'que-fraccion': { es: 'Partes iguales de un todo: lee la fracción de una figura, sombréala, sácala de una frase y dila en inglés.', en: 'Equal parts of a whole: read the fraction in a picture, shade it, find it in a sentence and say it in English.' },
  equivalentes: { es: 'Amplía y reduce, completa el término que falta, decide si dos fracciones son equivalentes y busca el común denominador.', en: 'Make equivalent fractions, fill in the missing number, decide if two fractions are equivalent and find a common denominator.' },
  simplifica: { es: 'Simplifica paso a paso o de una vez con el m.c.d. hasta la fracción irreducible, también con negativas.', en: 'Simplify step by step or in one go with the GCD until the fraction is in lowest terms, also with negative fractions.' },
  compara: { es: 'Compara con el mismo denominador, con el mismo numerador o con común denominador, frente a 1 y a un medio; ordena y sitúa en la recta, también con negativas.', en: 'Compare with the same denominator, the same numerator or a common denominator, against 1 and a half; put in order and place on the number line, also with negative fractions.' },
  'fraccion-de': { es: 'La fracción de una cantidad, la fracción que es una parte y problemas con contexto.', en: 'A fraction of a quantity, the fraction that a part is, and word problems.' },
  'suma-resta': { es: 'Suma y resta con el mismo y con distinto denominador, con naturales y con negativas, lo que queda y los errores típicos.', en: 'Add and subtract with the same and with different denominators, with whole numbers and negative fractions, what is left and the common mistakes.' },
  'multiplica-divide': { es: 'Producto, fracción de una fracción, potencias, la inversa y la división por los dos métodos.', en: 'Multiplying, a fraction of a fraction, powers, the reciprocal and dividing in two ways.' },
  'combinadas-fracciones': { es: 'Toca la operación que va primero y resuelve paso a paso, con fracciones y paréntesis.', en: 'Tap the operation that comes first and work it out step by step, with fractions and brackets.' },
  errores4: { es: 'Procedimientos de la unidad 4: si están bien o mal, en qué línea está el error y cómo se arregla.', en: 'Worked answers from unit 4: right or wrong, which line has the mistake and how to fix it.' },
  leelo4: { es: 'El vocabulario de las fracciones en inglés: empareja, lee fracciones y cuentas, entiende la pregunta y escribe lo que oyes.', en: 'Fraction vocabulary in English: match, read fractions and calculations, understand the question and write what you hear.' },
};

const PANEL = { es: 'Panel del profesor', en: 'Teacher’s panel' };

/**
 * Las prácticas publicadas de una unidad, agrupadas en los bloques de la
 * portada (sin bloques vacíos). Si la unidad no tiene bloques, un solo grupo
 * sin título (`titulo: null`).
 */
export function bloquesPublicados(catalogo = CATALOGO, unidad = 2) {
  const publicadas = catalogo.filter(p => p.disponible && p.id !== ID_PLANTILLA && p.unidad === unidad);
  const propios = BLOQUES.filter(b => b.unidad === unidad);
  if (!propios.length) return publicadas.length ? [{ titulo: null, practicas: publicadas }] : [];
  const colocadas = new Set(propios.flatMap(b => b.slugs));
  const bloques = propios.map(b => ({
    titulo: b.titulo,
    practicas: b.slugs.map(slug => publicadas.find(p => p.slug === slug)).filter(Boolean),
  }));
  bloques.push({ titulo: OTRAS, practicas: publicadas.filter(p => !colocadas.has(p.slug)) });
  return bloques.filter(b => b.practicas.length);
}

const enNavegador = typeof document !== 'undefined';
const app = enNavegador ? document.querySelector('#app') : null;
let idioma = leer('practicas.idioma') === 'en' ? 'en' : 'es';

// Con código (4 u 8 caracteres, registrado), las tareas y las fechas son las de su profesor, de su
// espacio en la nube. Mientras llega la respuesta, la copia del navegador; sin copia, las de `tareas.js`
// (y cambian al saber de quién es).
const textoCodigo = enNavegador ? new URLSearchParams(location.search).get('c') ?? leer('practicas.codigo') ?? '' : '';
let contexto = contextoGuardado(textoCodigo);
let codigo = contexto?.codigo ?? leerCodigoSecreto(textoCodigo);
let tareas = contexto?.tareas ?? TAREAS;
let unidades = contexto?.unidades ?? UNIDADES;
let profesor = contexto?.profesor ?? null;
let avisoEspacio = null;       // 'no-existe' | 'sin-red' | 'sin-tareas' | null: lo que se dice sobre el espacio del profesor
if (codigo) escribir('practicas.codigo', codigo);

/** Pone las tareas, las fechas y el espacio de un alumno (`null`: sin código, lo de siempre). */
function ponerContexto(c) {
  contexto = c;
  tareas = c?.tareas ?? TAREAS;
  unidades = c?.unidades ?? UNIDADES;
  profesor = c?.profesor ?? null;
  avisoEspacio = null;
}

/** Ejercicios terminados de una práctica, según lo guardado en este navegador. */
function hechos(practica) {
  if (!codigo) return 0;
  // (`progresoGuardado` mira también la clave antigua de `divisores/`.)
  return progresoGuardado(practica.slug, codigo).filter(e => e?.terminado).length;
}

// Ids de las tareas asignadas a este alumno (copia del navegador; la nube la pone al día en `arrancar`).
let asignacion = codigo ? asignacionGuardada(codigo) : null;

/**
 * En qué orden salen las tareas de una unidad: en la actual, de la más nueva a la más
 * antigua (la de esta semana, arriba); en las anteriores, en su orden (semana 1, 2…).
 */
/** La unidad actual sale siempre abierta (ahí está la tarea nueva); las demás, solo si el alumno la abrió. */
export const unidadSaleAbierta = (seccion, abiertas = {}) => Boolean(seccion.actual) || Boolean(abiertas[seccion.unidad.n]);

export const ordenTareas =(tareas, actual) => (actual ? [...tareas].reverse() : [...tareas]);

/** Las tareas de una unidad, con su plazo y lo que lleva el alumno en cada una. */
function htmlTareas(t, tareas, actual) {
  if (!tareas.length) return '';
  const hoyDia = diaDe(new Date());
  const fila = tarea => {
    const est = codigo ? estadoTarea(tarea, progresoDeTarea(tarea, codigo)) : null;
    const plazo = est ? vistaPlazo(tarea, est, hoyDia, asignadaAMi(tarea, asignacion), t) : null;
    const etiqueta = !est?.empezada ? ''
      : est.cumplida ? `<span class="etiqueta etiqueta--ok">✓ ${t.semana_cumplida}</span>`
        : `<span class="etiqueta">${t.semana_marcador_puntos(est.puntos, est.maximo)}</span>`;
    const tipo = plazo ? `<span class="etiqueta etiqueta--${plazo.tipo}">${plazo.etiqueta}</span>` : '';
    const frase = plazo?.frase ? `<span class="portada__plazo portada__plazo--${plazo.estado}">${plazo.frase}</span>` : '';
    return `
      <li class="lista__item">
        <div><h3>${esc(tarea.titulo[idioma])}</h3><div class="portada__estado">${tipo}${frase}</div>${etiqueta}</div>
        <a class="boton ${est?.cumplida ? 'secundario' : ''}" href="semana.html?t=${tarea.id}${codigo ? `&c=${codigo}` : ''}">${t.portada_abrir}</a>
      </li>`;
  };
  return `
      <h3 class="portada__bloque">${t.unidad_tareas}</h3>
      <ul class="lista">${ordenTareas(tareas, actual).map(fila).join('')}</ul>`;
}

/** Una sección de unidad: sus tareas y sus prácticas (con subtítulos si la unidad tiene bloques). */
function htmlUnidad(t, seccion, filaPractica) {
  const grupos = bloquesPublicados(CATALOGO, seccion.unidad.n);
  const practicas = grupos.map(b => `
      ${b.titulo ? `<h4 class="portada__subbloque">${b.titulo[idioma]}</h4>` : ''}
      <ul class="lista">${b.practicas.map(filaPractica).join('')}</ul>`).join('');
  return `
      ${htmlTareas(t, seccion.tareas, seccion.actual)}
      ${practicas ? `<h3 class="portada__bloque portada__bloque--todas">${t.unidad_practicas}</h3>${practicas}` : ''}`;
}

function pintar() {
  const t = T[idioma];
  document.documentElement.lang = idioma;
  document.title = t.portada_titulo;
  document.querySelector('#cabecera-titulo').textContent = t.portada_titulo;
  document.querySelector('#idiomas').innerHTML = ['es', 'en']
    .map(i => `<button type="button" data-idioma="${i}" aria-pressed="${i === idioma}">${i.toUpperCase()}</button>`).join('');

  const fila = p => {
    const n = hechos(p);
    const completa = n === p.nEjercicios;
    const etiqueta = n ? `<span class="etiqueta ${completa ? 'etiqueta--ok' : ''}">${completa ? '✓ ' : ''}${t.portada_hechos(n, p.nEjercicios)}</span>` : '';
    return `
      <li class="lista__item">
        <div><h3>${esc(p.nombre[idioma])}</h3><div class="detalle">${DESCRIPCION[p.slug]?.[idioma] ?? ''}</div>${etiqueta}</div>
        <a class="boton ${completa ? 'secundario' : ''}" href="${p.ruta}${codigo ? `?c=${codigo}` : ''}">${t.portada_abrir}</a>
      </li>`;
  };
  // Todas las unidades se pliegan. La actual sale siempre abierta; las anteriores, plegadas salvo las que abrió el alumno (se recuerda).
  const abiertas = unidadesAbiertas();
  const secciones = seccionesPorUnidad(fechaISO(new Date()), { tareas, unidades }).map(s => {
    const titulo = t.unidad_titulo(s.unidad.n, s.unidad.titulo[idioma]);
    return `<details class="portada__unidad" data-unidad="${s.unidad.n}" data-actual="${Boolean(s.actual)}"${unidadSaleAbierta(s, abiertas) ? ' open' : ''}>
          <summary><h2 class="portada__titulo-unidad">${titulo}</h2></summary>${htmlUnidad(t, s, fila)}</details>`;
  }).join('');
  const frase = { 'no-existe': t.entrada_no_existe, 'sin-red': t.espacio_sin_red, 'sin-tareas': t.espacio_sin_tareas }[avisoEspacio];
  app.innerHTML = `
    <section>
      ${frase ? `<div class="aviso ${avisoEspacio === 'sin-tareas' ? '' : 'aviso--error'}">${frase}</div>` : ''}
      <p>${t.portada_ayuda}${codigo ? ` <span class="portada__codigo">${t.portada_codigo(codigo)}</span>
        <button type="button" class="discreto" id="cerrar-sesion">${t.cambiar_codigo}</button>` : ''}</p>
      ${secciones || `<p class="vacio">${t.portada_vacia}</p>`}
      <p class="portada__pie"><a href="profesor.html">${PANEL[idioma]}</a></p>
    </section>`;
  for (const d of app.querySelectorAll('details[data-unidad]:not([data-actual="true"])')) {
    d.addEventListener('toggle', () => recordarUnidad(d.dataset.unidad, d.open));
  }
  app.querySelector('#cerrar-sesion')?.addEventListener('click', () => {
    cerrarSesion();
    codigo = null;
    ponerContexto(null);
    asignacion = null;
    pintar();
  });
}

if (enNavegador) {
  document.querySelector('#idiomas').addEventListener('click', ev => {
    const elegido = ev.target.closest('[data-idioma]')?.dataset.idioma;
    if (!elegido || elegido === idioma) return;
    idioma = elegido;
    escribir('practicas.idioma', idioma);
    pintar();
  });
  // Al volver atrás desde una práctica, se actualiza lo hecho.
  addEventListener('pageshow', pintar);
  pintar();
  arrancar();
}

/**
 * Con código, de qué profesor es y cuáles son sus tareas (la copia del navegador ya está pintada).
 */
async function arrancar() {
  const suyo = codigo;
  if (suyo) {
    const c = await identificar(suyo);
    if (suyo !== codigo) return;
    if (c.error === 'no-existe') {
      // Un código que la nube no conoce no se recuerda: se vuelve a la portada sin sesión.
      borrar('practicas.codigo');
      cerrarSesion();
      codigo = null;
      ponerContexto(null);
      avisoEspacio = 'no-existe';
      return pintar();
    }
    if (c.error) {
      // Sin red y sin copia: las prácticas se pueden hacer; las tareas, no se saben.
      ponerContexto(null);
      tareas = [];
      avisoEspacio = 'sin-red';
      return pintar();
    }
    ponerContexto(c);
    avisoEspacio = c.sinConfig ? 'sin-red' : tareas.length ? null : 'sin-tareas';
    asignacion = asignacionGuardada(codigo);
    pintar();
  }
  // Con alguna tarea asignada, se mira la asignación en la nube (como mucho 4 s) y se repinta si cambia.
  if (codigo && tareas.some(x => x.asignada)) {
    cargarAsignacion(suyo, { profesor }).then(lista => {
      if (suyo !== codigo || JSON.stringify(lista) === JSON.stringify(asignacion)) return;
      asignacion = lista;
      pintar();
    });
  }
}
