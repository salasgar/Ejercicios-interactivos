// Constructor de números: lógica pura (sin DOM ni red). Los generadores devuelven
// DATOS; el HTML y los textos viven en practica.js y textos.js.
//
// Ejercicio 1: construir con fichas de cifras (el mayor, el menor, el menor par,
//   el mayor impar, el más cercano a una cantidad), comprobado contra todas las
//   permutaciones.
// Ejercicio 2: descomposición (a suma, a número), valor y posición de una cifra.
// Ejercicio 3: coma inglesa / punto español, y números en palabras.

import { numeroAIngles, numeroAEspanol } from '../../src/ejercicios/palabras.js';

export { numeroAIngles, numeroAEspanol };

const NBSP = ' ';

/** Texto con separador de miles: «4 732» (español, sin comas) o «4,732» (inglés). */
export function fmt(n, idioma = 'es') {
  const s = String(n);
  if (s.length < 4) return s;
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, idioma === 'en' ? ',' : NBSP);
}

const cifrasDe = n => String(n).split('').map(Number);
const aNumero = cifras => Number(cifras.join(''));

// ─── Ejercicio 1: construye ─────────────────────────────────────────────────────

export const CONSIGNAS = ['mayor', 'menor', 'menor_par', 'mayor_impar', 'cercano'];

/** Todos los números que se forman con TODAS las cifras, sin cero delante. */
export function permutaciones(cifras) {
  const res = new Set();
  const usar = (resto, acum) => {
    if (!resto.length) { if (acum[0] !== 0) res.add(aNumero(acum)); return; }
    resto.forEach((c, i) => usar([...resto.slice(0, i), ...resto.slice(i + 1)], [...acum, c]));
  };
  usar(cifras, []);
  return [...res];
}

/** La solución única de una consigna, o null si no tiene solución o no es única (cercano). */
export function solucionDe(cifras, consigna, objetivo) {
  const todas = permutaciones(cifras);
  let cand;
  if (consigna === 'mayor') return Math.max(...todas);
  if (consigna === 'menor') return Math.min(...todas);
  if (consigna === 'menor_par') cand = todas.filter(n => n % 2 === 0);
  else if (consigna === 'mayor_impar') cand = todas.filter(n => n % 2 === 1);
  if (cand) return cand.length ? (consigna === 'menor_par' ? Math.min(...cand) : Math.max(...cand)) : null;
  // cercano a `objetivo`: tiene que haber un único número a la distancia mínima
  const d = Math.min(...todas.map(n => Math.abs(n - objetivo)));
  const mejores = todas.filter(n => Math.abs(n - objetivo) === d);
  return mejores.length === 1 ? mejores[0] : null;
}

/**
 * Ítem: { tipo: 'construir', cifras (en el orden en que se enseñan), consigna, objetivo (solo «cercano»),
 *         solucion, hayCero }. Cuatro o cinco cifras distintas; la mitad de las veces con un 0.
 */
export function generarConstruir(rng) {
  for (;;) {
    const k = rng.elegir([4, 4, 5]);
    const conCero = rng.azar() < 0.5;
    const pool = rng.barajar([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, conCero ? k - 1 : k);
    const cifras = rng.barajar(conCero ? [...pool, 0] : pool);
    const consigna = rng.elegir(CONSIGNAS);
    let objetivo;
    if (consigna === 'cercano') {
      const todas = permutaciones(cifras);
      const lo = Math.min(...todas), hi = Math.max(...todas);
      objetivo = Math.round(rng.entero(lo, hi) / 100) * 100;
    }
    const solucion = solucionDe(cifras, consigna, objetivo);
    if (solucion === null) continue;
    if (aNumero(cifras) === solucion) continue; // que no venga ya hecho
    return { tipo: 'construir', cifras, consigna, ...(consigna === 'cercano' ? { objetivo } : {}), solucion, hayCero: cifras.includes(0) };
  }
}

/** Acierto: el número construido es la solución (los ceros delante nunca coinciden). */
export const esAciertoConstruir = (item, puestas) => aNumero(puestas) === item.solucion && puestas[0] !== 0;

// ─── Ejercicio 2: descomposición, valor y posición ──────────────────────────────

/** Valores de las posiciones no nulas, de mayor a menor: 8274 → [8000, 200, 70, 4]. */
export const componentesDe = n => cifrasDe(n).map((d, i, a) => d * 10 ** (a.length - 1 - i)).filter(v => v > 0);

function numeroConCeros(rng, longitud, maxCeros) {
  for (;;) {
    const cifras = [rng.entero(1, 9)];
    for (let i = 1; i < longitud; i++) cifras.push(rng.azar() < 0.3 ? 0 : rng.entero(1, 9));
    if (cifras.filter(c => c === 0).length <= maxCeros) return aNumero(cifras);
  }
}

// ¿Hay algún subconjunto de `valores` que sume n y no sea exactamente el conjunto de `buenos`?
function subconjuntoAmbiguo(valores, buenos, n) {
  const key = a => [...a].sort((x, y) => x - y).join();
  for (let mask = 1; mask < 1 << valores.length; mask++) {
    const sel = valores.filter((_, i) => mask & (1 << i));
    if (sel.reduce((a, b) => a + b, 0) === n && key(sel) !== key(buenos)) return true;
  }
  return false;
}

/**
 * Ítem a_suma: { tipo: 'a_suma', n, correctas, fichas }. Las fichas son las correctas (una por posición
 * no nula) y 3 o 4 señuelos: la misma cifra en otra posición. Ninguna otra selección suma n.
 */
export function generarASuma(rng) {
  for (;;) {
    const n = numeroConCeros(rng, rng.elegir([4, 4, 5]), 2);
    const correctas = componentesDe(n);
    const cifras = cifrasDe(n);
    const L = cifras.length;
    const senuelos = new Set();
    const quieren = rng.entero(3, 4);
    let intentos = 0;
    while (senuelos.size < quieren && intentos++ < 50) {
      const i = rng.entero(0, L - 1);
      if (cifras[i] === 0) continue;
      const j = rng.entero(0, L - 1);
      const v = cifras[i] * 10 ** (L - 1 - j);
      if (!correctas.includes(v)) senuelos.add(v);
    }
    if (senuelos.size < 3) continue;
    const fichas = [...correctas, ...senuelos];
    if (subconjuntoAmbiguo(fichas, correctas, n)) continue;
    return { tipo: 'a_suma', n, correctas, fichas: rng.barajar(fichas) };
  }
}

/** ¿Suma la selección exactamente el número? (Con una sola solución posible, es la de `correctas`.) */
export const esAciertoASuma = (item, seleccion) => seleccion.reduce((a, b) => a + b, 0) === item.n;

/** Ítem a_numero: { tipo: 'a_numero', n, sumandos }. Casi siempre con un cero interior (5 032, no 532). */
export function generarANumero(rng) {
  for (;;) {
    const n = numeroConCeros(rng, rng.elegir([4, 4, 5]), 3);
    const sumandos = componentesDe(n);
    if (sumandos.length < 2) continue;
    const interior = String(n).slice(1, -1).includes('0');
    if (!interior && rng.azar() < 0.7) continue;
    return { tipo: 'a_numero', n, sumandos };
  }
}

export const esAciertoANumero = (item, escrito) => Number(escrito) === item.n;

/** El error típico: pegar las cifras no nulas (5 000 + 30 + 2 → 532). null si no hay confusión. */
export function errorPegado(item) {
  const pegado = Number(cifrasDe(item.n).filter(d => d > 0).join(''));
  return pegado !== item.n ? pegado : null;
}

// Número de 4 o 5 cifras con todas las cifras distintas (así «el 2» y «el 7» son únicos).
function numeroDistinto(rng, longitud) {
  const d = rng.barajar([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, longitud);
  if (d[0] === 0) [d[0], d[1]] = [d[1], d[0]];
  return aNumero(d);
}

/**
 * Ítem valor: { tipo: 'valor', n, cifra, pos (0 = unidades), opciones, correcto }.
 * La cifra es distinta de 0 y única en el número; opciones: la cifra en cuatro posiciones, la buena entre ellas.
 */
export function generarValor(rng) {
  const L = rng.elegir([4, 4, 5]);
  const n = numeroDistinto(rng, L);
  const cifras = cifrasDe(n);
  const idx = rng.elegir(cifras.map((d, i) => (d > 0 ? i : -1)).filter(i => i >= 0));
  const cifra = cifras[idx];
  const pos = L - 1 - idx;
  const otras = rng.barajar([...Array(L).keys()].filter(p => p !== pos)).slice(0, 3);
  const opciones = rng.barajar([pos, ...otras]).map(p => cifra * 10 ** p);
  return { tipo: 'valor', n, cifra, pos, opciones, correcto: cifra * 10 ** pos };
}

/** Ítem posicion: { tipo: 'posicion', n, cifra, pos, opciones (posiciones 0 = unidades), correcto }. */
export function generarPosicion(rng) {
  const L = rng.elegir([4, 4, 5]);
  const n = numeroDistinto(rng, L);
  const cifras = cifrasDe(n);
  const idx = rng.elegir(cifras.map((d, i) => (d > 0 ? i : -1)).filter(i => i >= 0));
  const pos = L - 1 - idx;
  const otras = rng.barajar([...Array(L).keys()].filter(p => p !== pos)).slice(0, 3);
  return { tipo: 'posicion', n, cifra: cifras[idx], pos, opciones: rng.barajar([pos, ...otras]), correcto: pos };
}

export const esAciertoOpcion = (item, elegida) => Number(elegida) === item.correcto;

/** Ejercicio 2: a_suma 30 %, a_numero 30 %, valor 20 %, posicion 20 %. */
export function generarDescomposicion(rng) {
  const r = rng.azar();
  if (r < 0.3) return generarASuma(rng);
  if (r < 0.6) return generarANumero(rng);
  if (r < 0.8) return generarValor(rng);
  return generarPosicion(rng);
}

// ─── Ejercicio 3: la coma inglesa y los números en palabras ─────────────────────

// Los valores se guardan en centésimas (enteros) para no pelearse con los decimales.

/** Parte entera y decimales (sin ceros finales) → texto a la española («12.500», «12 500», «12,5») o a la inglesa («12,500», «12.5»). */
function formatear(entera, frac, loc, estilo) {
  let e = entera;
  if (e.length >= 4) {
    const sep = loc === 'en' ? ',' : (estilo === 'espacio' ? NBSP : '.');
    e = e.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }
  return frac ? `${e}${loc === 'en' ? '.' : ','}${frac}` : e;
}

/** Escribe un valor (en centésimas) a la española o a la inglesa. */
export function escribir(c, loc, estilo = 'punto') {
  const frac = c % 100 ? String(c % 100).padStart(2, '0').replace(/0+$/, '') : '';
  return formatear(String(Math.floor(c / 100)), frac, loc, estilo);
}

/**
 * Lo que sale de leer `cadena` con las reglas del idioma `loc`, ya escrito a la manera de `loc`, SIN
 * redondear («836.369» leído a la inglesa es 836.369, no 836.37). null si con esas reglas no es un número.
 */
export function leerComo(cadena, loc, estilo = 'punto') {
  const s = cadena.replace(/[\s ]/g, '');
  const limpio = loc === 'es' ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  if (!/^\d+(\.\d+)?$/.test(limpio)) return null;
  const [entera, frac = ''] = limpio.split('.');
  return formatear(String(Number(entera)), frac.replace(/0+$/, ''), loc, estilo);
}

/**
 * Ítem coma: { tipo: 'coma', sub: 'miles' | 'decimal', dir: 'en_es' | 'es_en', c, estilo, dado, opciones, correcto }.
 * Se da un número escrito a un lado (12,500 en inglés) y se pide cómo se escribe al otro: 12.500. La
 * trampa de verdad —leerlo con las reglas del otro idioma (12,500 → 12,5)— va siempre de señuelo.
 */
export function generarComa(rng) {
  const sub = rng.azar() < 0.55 ? 'miles' : 'decimal';
  const dir = rng.elegir(['en_es', 'es_en']);
  const estilo = rng.elegir(['punto', 'espacio']);
  let c;
  if (sub === 'miles') {
    let n = rng.entero(1000, 999999);
    if (rng.azar() < 0.6) n = Math.max(1250, Math.round(n / 250) * 250); // muchos «12,500», «3,250»…
    c = n * 100;
  } else {
    const frac = rng.elegir([5, 10, 20, 25, 40, 50, 60, 75, 80]);
    c = rng.entero(1, 999) * 100 + frac;
  }
  const origen = dir === 'en_es' ? 'en' : 'es', destino = dir === 'en_es' ? 'es' : 'en';
  // El señuelo-trampa: leer la cadena de origen (en su forma con punto) con las reglas del otro idioma
  const cadenaOrigen = escribir(c, origen, 'punto');
  const mal = leerComo(cadenaOrigen, destino, estilo);
  const correcto = escribir(c, destino, estilo);
  const candidatos = [c * 10, c * 100, c % 10 === 0 ? c / 10 : null, c % 100 === 0 ? c / 100 : null]
    .filter(v => v !== null && v > 0).map(v => escribir(v, destino, estilo));
  const falsos = [];
  for (const o of [mal, ...rng.barajar([...new Set(candidatos)])]) {
    if (o !== null && o !== correcto && !falsos.includes(o)) falsos.push(o);
  }
  falsos.length = Math.min(falsos.length, 3);
  // Por si faltara alguno, se completan con desplazamientos de dos órdenes (siempre falsos)
  let k = 1;
  while (falsos.length < 3) { const o = escribir(c * 10 ** (k + 1), destino, estilo); if (o !== correcto && !falsos.includes(o)) falsos.push(o); k++; }
  const opciones = rng.barajar([correcto, ...falsos]);
  return { tipo: 'coma', sub, dir, c, estilo, dado: escribir(c, origen, estilo), opciones, correcto, mal };
}

export const esAciertoComa = (item, elegida) => elegida === item.correcto;

/** Parte de un número de 1 a 3 cifras con huecos: 0, 1..99, o «h0x» (305, 108…). */
function grupo(rng, puedeSerCero) {
  const r = rng.azar();
  if (puedeSerCero && r < 0.25) return 0;
  if (r < 0.65) return rng.entero(1, 99);
  return rng.entero(1, 9) * 100 + (rng.azar() < 0.6 ? rng.entero(1, 9) : rng.elegir([0, 10, 20, 30, 40, 50]));
}

/**
 * Ítem palabras: { tipo: 'palabras', n }. De 1 000 001 a 9 999 999: millones de una cifra, y los
 * grupos de miles y unidades con ceros (2 040 006, 3 000 105, 5 040 000…). El texto se hace en practica.js.
 */
export function generarPalabras(rng) {
  for (;;) {
    const m = rng.entero(1, 9);
    const miles = grupo(rng, true), resto = grupo(rng, true);
    const n = m * 1000000 + miles * 1000 + resto;
    const ceros = (String(n).match(/0/g) || []).length;
    if (ceros >= 2 && n > 1000000) return { tipo: 'palabras', n };
  }
}

/**
 * Lo que escribe el alumno → número natural, o null si no lo es. Vale con o sin separador de miles:
 * «4730», «4.730», «4,730», «4 730». «12.00», «1.2.0.0», «120,0» o «-1200» dan null (no se penalizan: se avisa).
 */
export function leerEntero(texto) {
  const t = String(texto).trim();
  if (/^\d+$/.test(t)) return Number(t);
  if (/^\d{1,3}([.,\s\u00a0\u202f]\d{3})+$/.test(t)) return Number(t.replace(/\D/g, ''));
  return null;
}

export const esAciertoPalabras = (item, escrito) => leerEntero(escrito) === item.n;

/** El texto del número en el idioma del ítem. */
export const enPalabras = (n, idioma) => (idioma === 'en' ? numeroAIngles(n) : apocoparUno(numeroAEspanol(n)));

/**
 * `numeroAEspanol` (src/ejercicios/palabras.js, que no es de esta práctica) apocopa «uno» delante de
 * «mil» solo tras «veinti-» y «… y», no tras «ciento»: «cuatrocientos uno mil». Aquí se corrige al salir.
 */
const apocoparUno = s => s.replace(/\buno (mil|millones|millón)\b/g, 'un $1');

/** Ejercicio 3: coma 50 %, palabras 50 %. */
export function generarComaPalabras(rng) {
  return rng.azar() < 0.5 ? generarComa(rng) : generarPalabras(rng);
}
