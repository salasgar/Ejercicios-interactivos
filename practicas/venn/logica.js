// m.c.d. y m.c.m. con factores primos (Venn): lógica. Todo puro (sin DOM ni
// red), para probarlo con `npm test`. Los generadores devuelven DATOS; las
// funciones `explicar…` devuelven el HTML del feedback, con los números del ítem.
//
// Ítem: { tipo: 'venn' | 'mcd' | 'mcm' | 'mezcla', a, b, fa, fb,
//         comunes, soloA, soloB, pide: 'mcd' | 'mcm', solucion }
// (factorizaciones como en ../_comun/aritmetica.js: [[primo, exponente], …]).
// En el Venn `pide` es 'mcd': las parejas del centro son los factores del m.c.d.

import { factorizar, mcdFact, mcmFact, dividirFact, valorDe, htmlFact } from '../_comun/aritmetica.js';
import { TX, NOMBRE, ENTRE } from './textos.js';

// --- Los números ----------------------------------------------------------------

const MINIMO = 12, MAXIMO = 400;
/** Tope del m.c.m., para que las cuentas del feedback se puedan leer. */
const MCM_MAXIMO = 3000;
/** Hasta aquí, un número es «pequeño»: la mayoría de los ítems son de estos. */
const PEQUENO = 150;
/** Fichas por número en el Venn: con 4 + 4 caben en 375 px. */
const FICHAS_MAXIMO = 4;
/** Tope de los contadores de exponente (el mayor exponente de un ítem es 4). */
export const EXPONENTE_MAXIMO = 6;

/** Números de 12 a 400 con dos o tres primos distintos, todos ≤ 13 (también el 11 y el 13), y exponentes hasta 4. */
export const NUMEROS = Array.from({ length: MAXIMO - MINIMO + 1 }, (_, i) => i + MINIMO).filter(n => {
  const f = factorizar(n);
  return (f.length === 2 || f.length === 3) && f.at(-1)[0] <= 13 && f.every(([, e]) => e <= 4);
});

const cuantasFichas = f => f.reduce((s, [, e]) => s + e, 0);

/**
 * Las parejas {a < b} que valen, por clase ('sin' primos comunes, uno 'divisor'
 * del otro, 'normal') y, dentro de cada clase, con y sin primos 11 o 13.
 * `paraVenn` se queda con las de pocas fichas.
 */
function clasificar(paraVenn) {
  const vacia = () => [0, 1].map(() => ({ todas: [], pequenas: [] }));
  const clases = { sin: vacia(), divisor: vacia(), normal: vacia() };
  const datos = NUMEROS.map(n => ({ n, f: factorizar(n) })).filter(d => !paraVenn || cuantasFichas(d.f) <= FICHAS_MAXIMO);
  for (let i = 0; i < datos.length; i++) {
    for (let j = i + 1; j < datos.length; j++) {
      const A = datos[i], B = datos[j];
      const todo = mcmFact(A.f, B.f);
      if (todo.length > 4 || valorDe(todo) > MCM_MAXIMO) continue;
      const comun = mcdFact(A.f, B.f);
      const clase = comun.length === 0 ? 'sin' : valorDe(comun) === A.n ? 'divisor' : 'normal';
      const lista = clases[clase][todo.at(-1)[0] >= 11 ? 1 : 0];
      lista.todas.push([A.n, B.n]);
      if (B.n <= PEQUENO) lista.pequenas.push([A.n, B.n]);
    }
  }
  return clases;
}

const PAREJAS = { venn: clasificar(true), reglas: clasificar(false) };

/**
 * Cuotas: 15 % sin primos comunes y 15 % con uno divisor del otro; una de cada
 * cuatro, con 11 o 13; y seis de cada diez, con los dos números hasta 150 (si no,
 * como hay muchas más parejas grandes que pequeñas, casi todas saldrían grandes).
 */
function elegirPareja(rng, parejas) {
  const r = rng.azar();
  const clase = r < 0.15 ? 'sin' : r < 0.30 ? 'divisor' : 'normal';
  const lista = parejas[clase][rng.azar() < 0.25 ? 1 : 0];
  const [a, b] = rng.elegir(rng.azar() < 0.6 ? lista.pequenas : lista.todas);
  return rng.azar() < 0.5 ? [a, b] : [b, a];
}

/** Lo común y lo que le queda a cada uno: comunes + soloA = fa, comunes + soloB = fb. */
export function repartir(fa, fb) {
  const comunes = mcdFact(fa, fb);
  return { comunes, soloA: dividirFact(fa, comunes), soloB: dividirFact(fb, comunes) };
}

function item(tipo, [a, b], pide) {
  const fa = factorizar(a), fb = factorizar(b);
  return { tipo, a, b, fa, fb, ...repartir(fa, fb), pide, solucion: pide === 'mcd' ? mcdFact(fa, fb) : mcmFact(fa, fb) };
}

export const generarVenn = rng => item('venn', elegirPareja(rng, PAREJAS.venn), 'mcd');
export const generarMcd = rng => item('mcd', elegirPareja(rng, PAREJAS.reglas), 'mcd');
export const generarMcm = rng => item('mcm', elegirPareja(rng, PAREJAS.reglas), 'mcm');
export const generarMezcla = rng => item('mezcla', elegirPareja(rng, PAREJAS.reglas), rng.azar() < 0.5 ? 'mcd' : 'mcm');

const GENERADORES = { venn: generarVenn, mcd: generarMcd, mcm: generarMcm, mezcla: generarMezcla };

export function generar(tipo, rng) {
  return GENERADORES[tipo](rng);
}

/** La base no repite dos veces seguidas la misma pareja (en ningún orden). */
export function clave(it) {
  return `${Math.min(it.a, it.b)}-${Math.max(it.a, it.b)}`;
}

// --- Utilidades de factorizaciones ----------------------------------------------

/** Las fichas de una factorización: [[2, 3], [3, 1]] → [2, 2, 2, 3]. */
export function fichasDe(f) {
  return f.flatMap(([p, e]) => Array(e).fill(p));
}

export function exponente(f, p) {
  return f.find(([q]) => q === p)?.[1] ?? 0;
}

/** Los primos de a o de b, de menor a mayor: las columnas de la tabla. */
export function primosDe(it) {
  return mcmFact(it.fa, it.fb).map(([p]) => p);
}

/** La respuesta de los contadores (exponentes en el orden de `primosDe`) como factorización. */
export function factDe(it, exponentes) {
  return primosDe(it).map((p, i) => [p, exponentes[i]]).filter(([, e]) => e > 0);
}

const iguales = (x, y) => x.length === y.length && [...x].sort((m, n) => m - n).join() === [...y].sort((m, n) => m - n).join();
const cuenta = (lista, p) => lista.filter(q => q === p).length;

// --- Ejercicio 1: el Venn ---------------------------------------------------------
// zonas = { soloA, comunA, comunB, soloB }: los primos (repetidos) que el alumno
// ha puesto en cada sitio. En «común» hay fichas de a (comunA) y de b (comunB).

/** Bien si todas las fichas están repartidas y las parejas de «común» son los factores del m.c.d. */
export function esCorrectaVenn(it, zonas) {
  const comunes = fichasDe(it.comunes);
  return iguales([...zonas.soloA, ...zonas.comunA], fichasDe(it.fa))
    && iguales([...zonas.soloB, ...zonas.comunB], fichasDe(it.fb))
    && iguales(zonas.comunA, comunes) && iguales(zonas.comunB, comunes);
}

/**
 * Qué falla en «común»: { codigo, p } o null si no falla nada.
 *   'no_comun'  hay una ficha de un primo que solo tiene uno de los dos números
 *   'sobra'     hay más fichas de p de las que pueden tener pareja
 *   'falta'     se pueden hacer más parejas de p
 */
export function diagnosticarVenn(it, zonas) {
  const filas = primosDe(it).map(p => {
    const ea = exponente(it.fa, p), eb = exponente(it.fb, p);
    const ca = cuenta(zonas.comunA, p), cb = cuenta(zonas.comunB, p);
    return { p, minimo: Math.min(ea, eb), mas: Math.max(ca, cb), hechas: Math.min(ca, cb) };
  });
  const es = (codigo, fila) => fila && { codigo, p: fila.p };
  return es('no_comun', filas.find(f => f.minimo === 0 && f.mas > 0))
    ?? es('sobra', filas.find(f => f.mas > f.minimo))
    ?? es('falta', filas.find(f => f.hechas < f.minimo))
    ?? null;
}

const numA = it => `<span class="va">${it.a}</span>`;
const numB = it => `<span class="vb">${it.b}</span>`;
const producto = f => fichasDe(f).join(' · ');

/** El feedback de un Venn mal repartido, con los números de ese ítem. */
export function explicarVenn(it, zonas, idioma) {
  const d = diagnosticarVenn(it, zonas);
  const x = TX.venn;
  if (!d) return '';
  const ea = exponente(it.fa, d.p), eb = exponente(it.fb, d.p);
  if (d.codigo === 'no_comun') {
    return ea > 0 ? x.no_comun[idioma](d.p, numA(it), numB(it)) : x.no_comun[idioma](d.p, numB(it), numA(it));
  }
  const cuantos = x.cuantos[idioma](d.p, numA(it), ea, numB(it), eb);
  const minimo = Math.min(ea, eb);
  if (d.codigo === 'sobra') return `${cuantos}: ${x.sobra[idioma](d.p, minimo)}`;
  const hechas = Math.min(cuenta(zonas.comunA, d.p), cuenta(zonas.comunB, d.p));
  return `${cuantos}: ${x.falta[idioma](d.p, minimo, hechas)}`;
}

/** Lo que enseña el Venn bien repartido: el m.c.d. (lo común) y el m.c.m. (todo). */
export function resumenVenn(it, idioma) {
  const x = TX.venn;
  const todo = mcmFact(it.fa, it.fb);
  const mcd = it.comunes.length
    ? `<span class="cuenta">${NOMBRE.mcd[idioma]} = ${it.comunes.length === 1 && it.comunes[0][1] === 1 ? '' : `${producto(it.comunes)} = `}${valorDe(it.comunes)}</span> (${x.lo_comun[idioma]})`
    : x.sin_comunes[idioma](numA(it), numB(it));
  const mcm = `<span class="cuenta venn-larga">${NOMBRE.mcm[idioma]} = ${producto(todo)} = ${valorDe(todo)}</span> (${x.todo[idioma]})`;
  return `${mcd}.<br>${mcm}.`;
}

// --- Ejercicios 2, 3 y 4: las dos reglas -----------------------------------------
// La respuesta es una factorización (la de los contadores; la lista vacía vale 1)
// o el número 0 (el alumno ha dicho que el m.c.d. es 0).

const limpia = f => f.filter(([, e]) => e > 0);

/** ¿Rompe la desigualdad? El m.c.d. no pasa del menor; el m.c.m. no baja del mayor. */
export function violaDesigualdad(it, respuesta) {
  const v = respuesta === 0 ? 0 : valorDe(limpia(respuesta));
  return it.pide === 'mcd' ? v > Math.min(it.a, it.b) : v < Math.max(it.a, it.b);
}

/** El primer primo que falla y por qué, mirando solo las dos reglas. */
function diagnosticoDeReglas(it, f) {
  const primos = primosDe(it);
  if (f.some(([p]) => !primos.includes(p))) return { codigo: 'otro', p: null };
  const filas = primos.map(p => {
    const ea = exponente(it.fa, p), eb = exponente(it.fb, p);
    return { p, er: exponente(f, p), minimo: Math.min(ea, eb), maximo: Math.max(ea, eb) };
  });
  const es = (codigo, fila) => fila && { codigo, p: fila.p };
  if (it.pide === 'mcd') {
    return es('no_comun', filas.find(x => x.minimo === 0 && x.er > 0))
      ?? es('exponente_mayor', filas.find(x => x.er > x.minimo))
      ?? es('falta_comun', filas.find(x => x.minimo > 0 && x.er === 0))
      ?? es('se_queda_corto', filas.find(x => x.er < x.minimo))
      ?? { codigo: 'otro', p: null };
  }
  return es('faltan_no_comunes', filas.find(x => x.minimo === 0 && x.er === 0))
    ?? es('falta_comun', filas.find(x => x.er === 0))
    ?? es('exponente_menor', filas.find(x => x.er < x.maximo))
    ?? es('se_pasa', filas.find(x => x.er > x.maximo))
    ?? { codigo: 'otro', p: null };
}

/**
 * El error de una respuesta, o null si está bien:
 *   'cero'               ha dicho 0
 *   'es_el_otro'         ha dado justo la otra cantidad (m.c.m. por m.c.d. o al revés)
 *   'desigualdad'        (solo en la mezcla) un m.c.d. mayor que el menor o un m.c.m. menor que el mayor
 *   m.c.d.: 'no_comun' (un primo que no es común), 'exponente_mayor', 'falta_comun',
 *           'se_queda_corto' (divisor común, pero no el mayor)
 *   m.c.m.: 'faltan_no_comunes', 'falta_comun', 'exponente_menor',
 *           'se_pasa' (múltiplo común, pero no el menor)
 *   'otro'               nada de lo anterior
 */
export function diagnosticar(it, respuesta) {
  if (respuesta === 0) return 'cero';
  const f = limpia(respuesta);
  const v = valorDe(f);
  if (v === valorDe(it.solucion)) return null;
  const laOtra = it.pide === 'mcd' ? mcmFact(it.fa, it.fb) : mcdFact(it.fa, it.fb);
  if (v === valorDe(laOtra)) return 'es_el_otro';
  if (it.tipo === 'mezcla' && violaDesigualdad(it, f)) return 'desigualdad';
  return diagnosticoDeReglas(it, f).codigo;
}

const potencia = (p, e) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);
/** «2² · 3 = 12», o solo «12» si no hay cuenta que enseñar (un primo solo, o el 1). */
const cuentaDe = f => {
  const sola = f.length === 0 || (f.length === 1 && f[0][1] === 1);
  return `<span class="cuenta">${sola ? '' : `${htmlFact(f)} = `}${valorDe(f)}</span>`;
};
const igualdad = (n, f, clase) => `<span class="cuenta"><span class="${clase}">${n}</span> = ${htmlFact(f)}</span>`;

/** El feedback de una respuesta equivocada, con los números de ese ítem. */
export function explicar(it, respuesta, idioma) {
  const x = TX.reglas;
  const codigo = diagnosticar(it, respuesta);
  if (codigo === null) return '';
  const A = numA(it), B = numB(it);
  if (codigo === 'cero') {
    const resto = it.comunes.length
      ? x.cero_con_comunes[idioma](A, B, it.comunes.map(([p]) => p).join(', '))
      : x.cero_sin_comunes[idioma];
    return `${x.cero[idioma]} ${resto}`;
  }
  const f = limpia(respuesta);
  const v = valorDe(f);
  // En la mezcla, la desigualdad se dice antes que nada (también si es «la otra»).
  const antes = it.tipo === 'mezcla' && violaDesigualdad(it, f)
    ? `${x.desigualdad[it.pide][idioma](v, it.pide === 'mcd' ? Math.min(it.a, it.b) : Math.max(it.a, it.b))} `
    : '';
  if (codigo === 'es_el_otro') return `${antes}${x.es_el_otro[it.pide][idioma](cuentaDe(f))}`;

  const d = diagnosticoDeReglas(it, f);
  if (d.codigo === 'otro') return `${antes}${x.otro[idioma]}`;
  const { p } = d;
  const ea = exponente(it.fa, p), eb = exponente(it.fb, p), er = exponente(f, p);
  const igA = igualdad(it.a, it.fa, 'va'), igB = igualdad(it.b, it.fb, 'vb');
  const mia = `<span class="cuenta">${potencia(p, er)}</span>`;
  const menor = `<span class="cuenta">${potencia(p, Math.min(ea, eb))}</span>`;
  const mayor = `<span class="cuenta">${potencia(p, Math.max(ea, eb))}</span>`;
  const frase = {
    no_comun: () => (ea > 0 ? x.no_comun[idioma](p, A, B) : x.no_comun[idioma](p, B, A)),
    // El que tiene menos p es el que no se deja dividir.
    exponente_mayor: () => x.exponente_mayor[idioma](mia, ea <= eb ? igA : igB, p, menor),
    falta_comun: () => x.falta_comun[it.pide][idioma](p, A, B),
    se_queda_corto: () => x.se_queda_corto[idioma](cuentaDe(f), A, B, p, menor),
    faltan_no_comunes: () => x.faltan_no_comunes[idioma](p, ea > 0 ? A : B),
    // El que tiene más p es del que no llega a ser múltiplo.
    exponente_menor: () => x.exponente_menor[idioma](mia, ea >= eb ? igA : igB, p, mayor),
    se_pasa: () => (v === it.a * it.b ? x.producto : x.se_pasa)[idioma](cuentaDe(f), A, B, p, mayor),
  }[d.codigo]();
  return `${antes}${frase}`;
}

/** La respuesta buena, con su porqué: «m.c.d. = 2² · 3 = 12 (los primos comunes, con el menor exponente)». */
export function solucionHtml(it, idioma) {
  const x = TX.reglas;
  const nombre = `<span class="venn-${it.pide}">${NOMBRE[it.pide][idioma]}</span>`;
  if (it.pide === 'mcd' && it.comunes.length === 0) return `${x.sin_comunes[idioma](numA(it), numB(it))}.`;
  const sola = it.solucion.length === 1 && it.solucion[0][1] === 1;
  const base = `<span class="cuenta">${nombre} = ${sola ? '' : `${htmlFact(it.solucion)} = `}${valorDe(it.solucion)}</span> (${x.porque[it.pide][idioma]}).`;
  const menor = Math.min(it.a, it.b), mayor = Math.max(it.a, it.b);
  if (mayor % menor !== 0) return base;
  const clase = n => `<span class="${n === it.a ? 'va' : 'vb'}">${n}</span>`;
  return `${base} ${x.uno_divide[it.pide][idioma](clase(menor), clase(mayor))}`;
}

/**
 * Las dos comprobaciones de la respuesta buena (U2-3C-10):
 * «12 ≤ 24 (el menor) ✓ y 24 : 12 = 2, 36 : 12 = 3 (divisiones exactas) ✓».
 */
export function comprobaciones(it, idioma) {
  const x = TX.reglas;
  const v = valorDe(it.solucion);
  const entre = ENTRE[idioma];
  if (it.pide === 'mcd') {
    return `${x.comprobacion[idioma]} <span class="cuenta">${v} ≤ ${Math.min(it.a, it.b)}</span> (${x.el_menor[idioma]}) ✓ ${x.y[idioma]} `
      + `<span class="cuenta">${it.a} ${entre} ${v} = ${it.a / v}</span>, <span class="cuenta">${it.b} ${entre} ${v} = ${it.b / v}</span> (${x.exactas[idioma]}) ✓`;
  }
  return `${x.comprobacion[idioma]} <span class="cuenta">${v} ≥ ${Math.max(it.a, it.b)}</span> (${x.el_mayor[idioma]}) ✓ ${x.y[idioma]} `
    + `<span class="cuenta">${v} ${entre} ${it.a} = ${v / it.a}</span>, <span class="cuenta">${v} ${entre} ${it.b} = ${v / it.b}</span> (${x.exactas[idioma]}) ✓`;
}
