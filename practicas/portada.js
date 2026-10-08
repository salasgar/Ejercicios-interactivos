// Portada de las prácticas de la unidad 2: la lista de las que están
// publicadas (`disponible` en el catálogo), ordenadas por la semana de la
// unidad en que tocan, con lo que lleva hecho el alumno en cada una según lo
// guardado en este navegador.
//
// El enlace que reparte el profesor es `practicas/?c=ABCD`: la portada guarda
// el código y todas las prácticas lo encuentran.

import { CATALOGO, ID_PLANTILLA } from './_comun/catalogo.js';
import { leerCodigoAlumno, codigoAlumno } from './_comun/codigos.js';
import { leer, escribir, claveProgreso } from './_comun/base.js';
import { T } from './_comun/textos.js';

// El orden de la portada no es el del catálogo (que no se puede renumerar):
// es el de la unidad. Una práctica del catálogo que no esté en ningún bloque
// sale al final, en «Otras», para que no se pierda.
export const BLOQUES = [
  {
    titulo: { es: 'Semana 1 · Múltiplos, divisores y criterios', en: 'Week 1 · Multiples, divisors and divisibility rules' },
    slugs: ['semaforo', 'rectangulos', 'recta'],
  },
  {
    titulo: { es: 'Semana 2 · Números primos y factorización', en: 'Week 2 · Prime numbers and factorisation' },
    slugs: ['criba', 'arbol', 'divisiones', 'fabrica', 'factorizaciones'],
  },
  {
    titulo: { es: 'Semana 3 · m.c.d. y m.c.m. con factores primos', en: 'Week 3 · GCD and LCM with prime factors' },
    slugs: ['venn', 'imposibles'],
  },
  {
    titulo: { es: 'Semana 4 · Problemas y errores típicos', en: 'Week 4 · Word problems and common mistakes' },
    slugs: ['clasificador', 'reloj', 'baldosas', 'errores'],
  },
  {
    titulo: { es: 'Para toda la unidad · Vocabulario', en: 'For the whole unit · Vocabulary' },
    slugs: ['leelo', 'divisores'],
  },
  {
    titulo: { es: 'Repaso de la unidad 1', en: 'Unit 1 review' },
    slugs: ['jerarquia', 'parentesis', 'exponente', 'raiz', 'division', 'expresion', 'redondeo', 'constructor',
      'distributiva', 'potencias10', 'dictado', 'mental', 'especiales', 'errores1', 'propiedades'],
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
  fabrica: { es: 'Construye los divisores de un número con sus factores primos y cuenta cuántos tiene.', en: 'Build the divisors of a number from its prime factors and count how many it has.' },
  factorizaciones: { es: 'Multiplica, divide y decide si un número es múltiplo de otro mirando solo las factorizaciones.', en: 'Multiply, divide and decide if a number is a multiple of another by looking only at the factorisations.' },
  venn: { es: 'Reparte los factores primos de dos números: lo común es el m.c.d. y todo junto es el m.c.m.', en: 'Sort the prime factors of two numbers: the common part is the GCD and everything together is the LCM.' },
  imposibles: { es: 'Respuestas que no pueden ser: lo que el m.c.d. y el m.c.m. cumplen siempre, y cómo se nombra la respuesta.', en: 'Answers that cannot be right: what the GCD and the LCM always satisfy, and how to name the answer.' },
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
};

const PANEL = { es: 'Panel del profesor', en: 'Teacher’s panel' };
// En el bloque de repaso sobra la coletilla que el catálogo pone a cada nombre.
const SIN_COLETILLA = / \((repaso de la unidad 1|unit 1 review)\)$/;

/** Las prácticas publicadas, agrupadas en los bloques de la portada (sin bloques vacíos). */
export function bloquesPublicados(catalogo = CATALOGO) {
  const publicadas = catalogo.filter(p => p.disponible && p.id !== ID_PLANTILLA);
  const colocadas = new Set(BLOQUES.flatMap(b => b.slugs));
  const bloques = BLOQUES.map(b => ({
    titulo: b.titulo,
    practicas: b.slugs.map(slug => publicadas.find(p => p.slug === slug)).filter(Boolean),
  }));
  bloques.push({ titulo: OTRAS, practicas: publicadas.filter(p => !colocadas.has(p.slug)) });
  return bloques.filter(b => b.practicas.length);
}

const enNavegador = typeof document !== 'undefined';
const app = enNavegador ? document.querySelector('#app') : null;
let idioma = leer('practicas.idioma') === 'en' ? 'en' : 'es';

const indice = enNavegador
  ? leerCodigoAlumno(new URLSearchParams(location.search).get('c') ?? leer('practicas.codigo') ?? '') : null;
const codigo = indice === null ? null : codigoAlumno(indice);
if (codigo) escribir('practicas.codigo', codigo);

/** Ejercicios terminados de una práctica, según lo guardado en este navegador. */
function hechos(practica) {
  if (!codigo) return 0;
  // Quien hizo `divisores/` antes de que se montara sobre la base lo tiene con la clave antigua.
  const claves = [claveProgreso(practica.slug, codigo), ...(practica.slug === 'divisores' ? [`divisores.v1.${codigo}`] : [])];
  return Math.max(0, ...claves.map(clave => {
    try { return (JSON.parse(leer(clave))?.ej ?? []).filter(e => e?.terminado).length; } catch { return 0; }
  }));
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
        <div><h3>${p.nombre[idioma].replace(SIN_COLETILLA, '')}</h3><div class="detalle">${DESCRIPCION[p.slug]?.[idioma] ?? ''}</div>${etiqueta}</div>
        <a class="boton ${completa ? 'secundario' : ''}" href="${p.ruta}${codigo ? `?c=${codigo}` : ''}">${t.portada_abrir}</a>
      </li>`;
  };
  const bloques = bloquesPublicados().map(b => `
      <h2 class="portada__bloque">${b.titulo[idioma]}</h2>
      <ul class="lista">${b.practicas.map(fila).join('')}</ul>`).join('');
  app.innerHTML = `
    <section>
      <p>${t.portada_ayuda}${codigo ? ` <span class="portada__codigo">${t.portada_codigo(codigo)}</span>` : ''}</p>
      ${bloques || `<p class="vacio">${t.portada_vacia}</p>`}
      <p class="portada__pie"><a href="profesor.html">${PANEL[idioma]}</a></p>
    </section>`;
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
}
