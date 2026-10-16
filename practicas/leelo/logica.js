// Práctica «Léelo en inglés»: lógica pura (sin DOM ni red). Tres ejercicios:
// escuchar una frase y elegir su notación, leer una notación y elegir su
// lectura en inglés, y completar una frase con la preposición o el nombre
// correcto. Todo lo que se oye o se lee está siempre en inglés (ver textos.js).

import {
  factorizar, valorDe, htmlFact, mcd, mcm, esPrimo,
} from '../_comun/aritmetica.js';
import { numeroAIngles } from '../../src/ejercicios/palabras.js';
import { crearRng } from '../_comun/rng.js';

// Re-exportado para que practica.js no importe directamente de src/ejercicios/.
export { numeroAIngles };

// ─── Números de las expresiones ────────────────────────────────────────────

/** Números a factorizar: los mismos que en la plantilla, con casos de 11 y 13. */
export const NUMEROS_FACT = [
  12, 18, 20, 24, 28, 36, 40, 45, 48, 50, 54, 56, 60, 63, 72, 75, 84, 90, 98, 99, 100, 108,
  120, 126, 132, 140, 150, 156, 180, 198, 242, 286, 338, 363,
];

/** Números de la pareja que dan juego a los distractores «palabra-número parecida»
 * (-teen/-ty: 13↔30...; cifras invertidas: 41↔14...). Dentro de 4..48. */
const ESPECIALES_PAR = [
  13, 14, 15, 16, 17, 18, 19, 30, 40,
  12, 21, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 36, 37, 38, 39, 41, 42, 43, 45, 46, 47, 48,
];

/** Pareja de números para GCD/LCM, pequeños para que la lectura sea corta. Más de la mitad
 * de las veces uno de los dos es de {13..19, 30, 40} o tiene cifras invertibles. */
export function generarPar(rng) {
  const a = rng.azar() < 0.55 ? rng.elegir(ESPECIALES_PAR) : rng.entero(4, 48);
  let b = rng.entero(4, 48);
  while (b === a) b = rng.entero(4, 48);
  return rng.azar() < 0.5 ? [a, b] : [b, a];
}

// ─── Lectura en inglés ──────────────────────────────────────────────────────

/** Estilos de lectura, todos válidos y nunca enfrentados entre sí como distractores. */
export const ESTILOS = [
  { verboFact: 'equals', veces: 'times', gcd: 'GCD', lcm: 'LCM', verboPred: 'is' },
  { verboFact: 'is equal to', veces: 'multiplied by', gcd: 'greatest common divisor', lcm: 'lowest common multiple', verboPred: 'equals' },
  { verboFact: 'equals', veces: 'times', gcd: 'greatest common divisor', lcm: 'least common multiple', verboPred: 'is equal to' },
];

/** 2² → «two squared»; 2³ → «two cubed»; 2⁴ → «two to the power of four»; 2¹ → «two». */
export function leerExponente(p, e) {
  const base = numeroAIngles(p);
  if (e === 1) return base;
  if (e === 2) return `${base} squared`;
  if (e === 3) return `${base} cubed`;
  return `${base} to the power of ${numeroAIngles(e)}`;
}

function leerFactConEstilo(f, estilo) {
  return f.length ? f.map(([p, e]) => leerExponente(p, e)).join(` ${estilo.veces} `) : numeroAIngles(1);
}

/** La lectura en inglés de una expresión, con un estilo dado (por defecto el primero). */
export function leer(expresion, estilo = ESTILOS[0]) {
  const { clase } = expresion;
  if (clase === 'fact') return `${numeroAIngles(expresion.n)} ${estilo.verboFact} ${leerFactConEstilo(expresion.f, estilo)}`;
  if (clase === 'gcd' || clase === 'lcm') {
    const nombre = clase === 'gcd' ? estilo.gcd : estilo.lcm;
    return `the ${nombre} of ${numeroAIngles(expresion.a)} and ${numeroAIngles(expresion.b)} ${estilo.verboPred} ${numeroAIngles(expresion.valor)}`;
  }
  if (clase === 'primo') return `${numeroAIngles(expresion.n)} is a prime number`;
  return `${numeroAIngles(expresion.n)} is a composite number`;
}

// ─── Notación (para el ejercicio 1: elegir la notación que se ha oído) ─────

export function notacion(expresion) {
  const { clase } = expresion;
  if (clase === 'fact') return `${expresion.n} = ${htmlFact(expresion.f)}`;
  if (clase === 'gcd') return `GCD(${expresion.a}, ${expresion.b}) = ${expresion.valor}`;
  return `LCM(${expresion.a}, ${expresion.b}) = ${expresion.valor}`;
}

// ─── Variantes (distractores que fallan solo en una potencia o en un número) ──

const PRIMOS_MUTACION = [2, 3, 5, 7, 11, 13];

/** Factorizaciones «parecidas» a `f`: un exponente ±1, o un primo cambiado por otro. */
function variantesFact(f) {
  const variantes = [];
  f.forEach(([p, e], i) => {
    if (e + 1 <= 6) variantes.push(f.map((x, j) => (j === i ? [x[0], x[1] + 1] : x)));
    if (e - 1 >= 1) variantes.push(f.map((x, j) => (j === i ? [x[0], x[1] - 1] : x)));
    PRIMOS_MUTACION.filter(q => q !== p && !f.some(([pp]) => pp === q)).forEach(q => {
      variantes.push(f.map((x, j) => (j === i ? [q, x[1]] : x)).sort((a, b) => a[0] - b[0]));
    });
  });
  return variantes;
}

/** Parejas (a, b, valor) «parecidas»: el valor cambiado, o `a`/`b` cambiados en 1. */
function variantesGcdLcm(a, b, valor, clase) {
  const op = clase === 'gcd' ? mcd : mcm;
  const variantes = [];
  [valor - 2, valor - 1, valor + 1, valor + 2].filter(v => v > 0 && v !== valor).forEach(v => variantes.push({ a, b, valor: v }));
  [a - 1, a + 1].filter(na => na >= 2 && na !== b).forEach(na => variantes.push({ a: na, b, valor: op(na, b) }));
  [b - 1, b + 1].filter(nb => nb >= 2 && nb !== a).forEach(nb => variantes.push({ a, b: nb, valor: op(a, nb) }));
  return variantes;
}

/** Expresiones «parecidas» a la dada, para construir las opciones falsas de los ejercicios 1 y 2. */
export function variantesDe(expresion) {
  if (expresion.clase === 'fact') {
    return variantesFact(expresion.f)
      .filter(f => valorDe(f) !== expresion.n)
      .map(f => ({ clase: 'fact', n: expresion.n, f }));
  }
  return variantesGcdLcm(expresion.a, expresion.b, expresion.valor, expresion.clase)
    .map(v => ({ clase: expresion.clase, a: v.a, b: v.b, valor: v.valor }));
}

/** Textos únicos (quitando repetidos y la propia correcta) de una lista de expresiones, con una función de texto. */
function textosUnicos(expresiones, textoCorrecta, aTexto) {
  const vistos = new Set([textoCorrecta]);
  const salida = [];
  for (const e of expresiones) {
    const texto = aTexto(e);
    if (!vistos.has(texto)) { vistos.add(texto); salida.push(texto); }
  }
  return salida;
}

// ─── Distractores que fallan en la LECTURA, no en los números ──────────────
// Tres familias, todas con los mismos números que la lectura correcta (salvo la C):
//  A. inglés incorrecto de una lista CERRADA (calcos del español), una pieza cada vez;
//  B. estructura cambiada (exponentes intercambiados; GCD ↔ LCM);
//  C. palabra-número parecida (-teen/-ty: 13↔30; cifras invertidas: 41↔14).
// Quedan fuera a propósito, por si alguien las diera por válidas: `by` como producto,
// `to the power N` (británico), `between`, `smallest common multiple`, `is a prime`,
// `to the second power` (americano), `raised to`.

const FALLOS_VECES = {
  times: ['multiplicated by', 'times by', 'multiplied for'],
  'multiplied by': ['multiplicated by', 'multiplied for', 'multiplied'],
};
const FALLOS_IGUAL = {
  equals: ['equals to', 'is equal', 'is the same that'],
  'is equal to': ['is equal than', 'equals to', 'is the same that'],
};
const FALLOS_GCD = {
  GCD: ['MCD', 'GDC'],
  'greatest common divisor': ['maximum common divisor', 'greatest common divider', 'greatest common division'],
};
const FALLOS_LCM = {
  LCM: ['MCM', 'LMC'],
  'lowest common multiple': ['minimum common multiple', 'lowest common multiply', 'lowest common multiplier'],
  'least common multiple': ['minimum common multiple', 'least common multiply', 'least common multiplier'],
};

/** Formas incorrectas de leer «p elevado a e» (e ≥ 2). */
function fallosExponente(p, e) {
  const base = numeroAIngles(p);
  if (e === 2) return [`${base} square`, `${base} elevated to two`, `${base} to the two`];
  if (e === 3) return [`${base} cube`, `${base} elevated to three`, `${base} to the three`];
  const w = numeroAIngles(e);
  return [`${base} elevated to ${w}`, `${base} powered to ${w}`];
}

/** Lectura de una expresión con UNA pieza sustituida: `m` puede traer `veces`, `igual`,
 * `nombre`, `de` ('from' | 'with') o `exp` ({ i, texto }: el término i de la factorización). */
function componer(expresion, estilo, m = {}) {
  if (expresion.clase === 'fact') {
    const veces = m.veces ?? estilo.veces;
    const cuerpo = expresion.f
      .map(([p, e], i) => (m.exp && m.exp.i === i ? m.exp.texto : leerExponente(p, e)))
      .join(` ${veces} `);
    return `${numeroAIngles(expresion.n)} ${m.igual ?? estilo.verboFact} ${cuerpo}`;
  }
  const nombre = m.nombre ?? (expresion.clase === 'gcd' ? estilo.gcd : estilo.lcm);
  const a = numeroAIngles(expresion.a), b = numeroAIngles(expresion.b);
  const sujeto = m.de === 'from' ? `from ${a} and ${b}` : m.de === 'with' ? `of ${a} with ${b}` : `of ${a} and ${b}`;
  return `the ${nombre} ${sujeto} ${m.igual ?? estilo.verboPred} ${numeroAIngles(expresion.valor)}`;
}

/** Familia A: grupos de textos falsos, un grupo por pieza sustituida. */
function gruposA(expresion, estilo) {
  const grupos = [];
  if (expresion.clase === 'fact') {
    if (expresion.f.length >= 2) grupos.push(FALLOS_VECES[estilo.veces].map(veces => componer(expresion, estilo, { veces })));
    expresion.f.forEach(([p, e], i) => {
      if (e >= 2) grupos.push(fallosExponente(p, e).map(texto => componer(expresion, estilo, { exp: { i, texto } })));
    });
    grupos.push(FALLOS_IGUAL[estilo.verboFact].map(igual => componer(expresion, estilo, { igual })));
  } else if (expresion.clase === 'gcd' || expresion.clase === 'lcm') {
    const tabla = expresion.clase === 'gcd' ? FALLOS_GCD : FALLOS_LCM;
    const nombreOk = expresion.clase === 'gcd' ? estilo.gcd : estilo.lcm;
    grupos.push(tabla[nombreOk].map(nombre => componer(expresion, estilo, { nombre })));
    grupos.push(['from', 'with'].map(de => componer(expresion, estilo, { de })));
    if (FALLOS_IGUAL[estilo.verboPred]) grupos.push(FALLOS_IGUAL[estilo.verboPred].map(igual => componer(expresion, estilo, { igual })));
  }
  return grupos;
}

/** Familia B: expresiones con la estructura cambiada (mismos números, valor distinto). */
function estructuraB(item) {
  if (item.clase === 'fact') {
    const salida = [];
    const f = item.f;
    for (let i = 0; i < f.length; i++) {
      for (let j = i + 1; j < f.length; j++) {
        if (f[i][1] === f[j][1]) continue;
        const g = f.map((x, k) => (k === i ? [x[0], f[j][1]] : k === j ? [x[0], f[i][1]] : x));
        if (valorDe(g) !== item.n) salida.push({ clase: 'fact', n: item.n, f: g });
      }
    }
    return salida;
  }
  if (item.clase === 'gcd' || item.clase === 'lcm') {
    // a ≠ b garantizado por generarPar: mcd(a, b) ≠ mcm(a, b), así que el nombre cambiado es falso.
    return [{ clase: item.clase === 'gcd' ? 'lcm' : 'gcd', a: item.a, b: item.b, valor: item.valor }];
  }
  return [];
}

/** Números cuya palabra se parece: 13↔30 (-teen/-ty) y 41↔14 (cifras invertidas). */
function numerosParecidos(x) {
  const s = new Set();
  if (x >= 13 && x <= 19) s.add((x - 10) * 10);
  if (x >= 30 && x <= 90 && x % 10 === 0) s.add(x / 10 + 10);
  if (x >= 10 && x <= 99) {
    const d = Math.floor(x / 10), u = x % 10;
    if (u !== 0 && d !== u) s.add(u * 10 + d);
  }
  return [...s];
}

/** Familia C: la misma expresión con UNA palabra-número cambiada por otra parecida. */
function parecidosC(item) {
  const salida = [];
  if (item.clase === 'fact') {
    numerosParecidos(item.n).filter(n => valorDe(item.f) !== n).forEach(n => salida.push({ ...item, n }));
  } else if (item.clase === 'gcd' || item.clase === 'lcm') {
    const op = item.clase === 'gcd' ? mcd : mcm;
    for (const campo of ['a', 'b', 'valor']) {
      numerosParecidos(item[campo]).forEach(x => {
        const e = { clase: item.clase, a: item.a, b: item.b, valor: item.valor, [campo]: x };
        if (e.a !== e.b && op(e.a, e.b) !== e.valor) salida.push(e);
      });
    }
  }
  return salida;
}

/** Elige hasta tres textos de las familias, sin repetir (y sin los `prohibidos`):
 * un A y, si hay, un B primero; el tercero (o los que falten) de cualquier familia. */
function elegirFalsas(rng, { A, B, C }, relleno) {
  const elegidas = [];
  const libres = lista => lista.filter(t => !elegidas.includes(t));
  const tomar = lista => {
    const l = libres(lista);
    if (!l.length) return false;
    elegidas.push(rng.elegir(l));
    return true;
  };
  const tomarA = () => {
    const grupos = A.map(g => ({ g, libres: libres(g) })).filter(x => x.libres.length);
    if (!grupos.length) return false;
    // Mejor una pieza que aún no ha fallado en otro distractor.
    const nuevas = grupos.filter(x => x.g.every(t => !elegidas.includes(t)));
    elegidas.push(rng.elegir(rng.elegir(nuevas.length ? nuevas : grupos).libres));
    return true;
  };
  tomarA();
  tomar(B);
  while (elegidas.length < 3) {
    const hecho = rng.barajar(['A', 'B', 'C']).some(f => (f === 'A' ? tomarA() : tomar(f === 'B' ? B : C)));
    if (!hecho) break;
  }
  for (const t of rng.barajar(relleno())) {
    if (elegidas.length >= 3) break;
    if (!elegidas.includes(t)) elegidas.push(t);
  }
  return elegidas;
}

/** Semilla estable a partir del contenido del ítem (para ítems que llegan sin `falsas`). */
function semillaDe(item) {
  let h = 2166136261;
  for (const c of JSON.stringify({ ...item, estilo: undefined })) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Guarda `falsas` en el ítem sin que `JSON.stringify` las vea (practica.js usa el JSON
 * del ítem como clave para no repetir). */
function guardarFalsas(item, falsas) {
  Object.defineProperty(item, 'falsas', { value: falsas, enumerable: false, writable: true, configurable: true });
}

/** Ejercicio 2: tres lecturas falsas en el estilo del ítem (A, B y C). */
function falsasLeer(item, rng) {
  const estilo = item.estilo;
  const prohibidos = new Set(ESTILOS.map(e => leer(item, e)));
  const ok = t => !prohibidos.has(t);
  return elegirFalsas(rng, {
    A: gruposA(item, estilo).map(g => g.filter(ok)).filter(g => g.length),
    B: estructuraB(item).map(e => componer(e, estilo)).filter(ok),
    C: parecidosC(item).map(e => componer(e, estilo)).filter(ok),
  }, () => textosUnicos(variantesDe(item), leer(item, estilo), e => leer(e, estilo)));
}

/** Ejercicio 1: tres notaciones falsas (B y C primero; la mutación antigua solo de relleno). */
function falsasEscuchar(item, rng) {
  const correcta = notacion(item);
  const ok = t => t !== correcta;
  return elegirFalsas(rng, {
    A: [],
    B: estructuraB(item).map(notacion).filter(ok),
    C: parecidosC(item).map(notacion).filter(ok),
  }, () => textosUnicos(variantesDe(item), correcta, notacion));
}

// ─── Ejercicio 1: Escúchalo (oír la frase, elegir la notación) ─────────────

const CLASES_ESCUCHAR = ['fact', 'fact', 'gcd', 'lcm'];

function generarExpresion(rng) {
  const clase = rng.elegir(CLASES_ESCUCHAR);
  if (clase === 'fact') {
    const n = rng.elegir(NUMEROS_FACT);
    return { clase, n, f: factorizar(n) };
  }
  const [a, b] = generarPar(rng);
  const valor = clase === 'gcd' ? mcd(a, b) : mcm(a, b);
  return { clase, a, b, valor };
}

/** Ítem: { clase, n, f } o { clase, a, b, valor }; las tres notaciones falsas van en
 * `item.falsas` (propiedad no enumerable). */
export function generarEscuchar(rng) {
  const item = generarExpresion(rng);
  guardarFalsas(item, falsasEscuchar(item, rng));
  return item;
}

/** Las opciones del ejercicio 1: la correcta (en notación) y exactamente tres falsas. */
export function opcionesEscuchar(item) {
  const falsas = item.falsas ?? falsasEscuchar(item, crearRng(semillaDe(item)));
  return { correcta: notacion(item), pool: falsas };
}

// ─── Ejercicio 2: ¿Cómo se lee? (ver la notación, elegir la lectura) ───────

/** Ítem: igual que el del ejercicio 1, más el estilo de lectura elegido para este ítem;
 * las tres lecturas falsas (en ese estilo) van en `item.falsas`. */
export function generarLeer(rng) {
  const item = generarExpresion(rng);
  item.estilo = rng.elegir(ESTILOS);
  guardarFalsas(item, falsasLeer(item, rng));
  return item;
}

/** Las opciones del ejercicio 2: la lectura correcta y exactamente tres falsas, todas
 * en el mismo estilo (nunca se enfrentan dos formas válidas entre sí). */
export function opcionesLeer(item) {
  const falsas = item.falsas ?? falsasLeer(item, crearRng(semillaDe(item)));
  return { correcta: leer(item, item.estilo), pool: falsas };
}

// ─── Ejercicio 3: Completa la frase ────────────────────────────────────────

/** Una plantilla: `generar(rng)` → { frase, correcta, falsas }. `falsas` son siempre
 * inequívocamente falsas (ninguna es una variante válida de la correcta). */
const PLANTILLAS = [
  {
    id: 'divisible_by',
    generar(rng) {
      const b = rng.entero(2, 12), a = b * rng.entero(2, 9);
      return { frase: `${a} is divisible ___ ${b}`, correcta: 'by', falsas: ['between', 'of'], datos: { a, b } };
    },
  },
  {
    id: 'divisor_of',
    generar(rng) {
      const b = rng.entero(2, 12), a = b * rng.entero(2, 9);
      return { frase: `${b} is a divisor ___ ${a}`, correcta: 'of', falsas: ['by', 'in'], datos: { a, b } };
    },
  },
  {
    id: 'multiple_of',
    generar(rng) {
      const b = rng.entero(2, 12), a = b * rng.entero(2, 9);
      return { frase: `${a} is a multiple ___ ${b}`, correcta: 'of', falsas: ['by', 'for'], datos: { a, b } };
    },
  },
  {
    id: 'goes_into',
    generar(rng) {
      const b = rng.entero(2, 12), k = rng.entero(2, 9), a = b * k;
      return { frase: `${b} ___ ${a} ${k === 2 ? 'twice' : `${numeroAIngles(k)} times`}`, correcta: 'goes into', falsas: ['goes between', 'divides for'], datos: { a, b } };
    },
  },
  {
    id: 'gcd_stands_for',
    generar() {
      return { frase: 'GCD stands for ___', correcta: 'greatest common divisor', falsas: ['greatest common multiple', 'general common divisor'], datos: {} };
    },
  },
  {
    id: 'lcm_stands_for',
    generar() {
      return { frase: 'LCM stands for ___', correcta: 'lowest common multiple', falsas: ['lowest common divisor', 'largest common multiple'], datos: {} };
    },
  },
  {
    id: 'one_is',
    generar() {
      return { frase: '1 is ___', correcta: 'neither prime nor composite', falsas: ['prime', 'composite'], datos: {} };
    },
  },
  {
    id: 'divisor_pair',
    generar(rng) {
      const x = rng.entero(2, 9), y = rng.entero(2, 9), a = x * y;
      return { frase: `${x} · ${y} is a ___ pair of ${a}`, correcta: 'divisor', falsas: ['remainder', 'quotient'], datos: { x, y, a } };
    },
  },
  {
    id: 'sieve_composite',
    generar(rng) {
      const n = rng.elegir(NUMEROS_FACT);
      return { frase: `${n} is crossed out in the sieve of Eratosthenes, so ${n} is ___`, correcta: 'composite', falsas: ['prime', 'a factor'], datos: { n } };
    },
  },
  {
    id: 'zero_multiple',
    generar(rng) {
      const n = rng.entero(2, 99);
      return { frase: `0 is a ___ of ${n}`, correcta: 'multiple', falsas: ['divisor', 'prime'], datos: { n } };
    },
  },
  {
    id: 'smallest_prime',
    generar() {
      return { frase: 'The smallest prime number is ___', correcta: '2', falsas: ['1', '3'], datos: {} };
    },
  },
];

/** Comprobación independiente (fuerza bruta) de que la plantilla dio una frase verdadera. */
export function comprobarCompletar(item) {
  const { plantilla, datos, solucion } = item;
  if (plantilla === 'divisible_by') return datos.a % datos.b === 0 && solucion === 'by';
  if (plantilla === 'divisor_of') return datos.a % datos.b === 0 && solucion === 'of';
  if (plantilla === 'multiple_of') return datos.a % datos.b === 0 && solucion === 'of';
  if (plantilla === 'goes_into') return datos.a % datos.b === 0 && solucion === 'goes into';
  if (plantilla === 'divisor_pair') return datos.x * datos.y === datos.a && solucion === 'divisor';
  if (plantilla === 'sieve_composite') return !esPrimo(datos.n) && solucion === 'composite';
  if (plantilla === 'zero_multiple') return solucion === 'multiple';
  if (plantilla === 'gcd_stands_for') return solucion === 'greatest common divisor';
  if (plantilla === 'lcm_stands_for') return solucion === 'lowest common multiple';
  if (plantilla === 'one_is') return solucion === 'neither prime nor composite';
  if (plantilla === 'smallest_prime') return solucion === '2' && esPrimo(2);
  throw new Error(`Plantilla desconocida: ${plantilla}`);
}

/** Ítem: { plantilla, datos, frase, opciones: [string, string, string], solucion }. */
export function generarCompletar(rng) {
  const plantilla = rng.elegir(PLANTILLAS);
  const { frase, correcta, falsas, datos } = plantilla.generar(rng);
  const opciones = rng.barajar([correcta, ...falsas]);
  return { tipo: 'completar', plantilla: plantilla.id, datos, frase, opciones, solucion: correcta };
}
