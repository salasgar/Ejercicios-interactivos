// Práctica «Caza el error»: lógica pura (sin DOM ni red). Los generadores
// devuelven DATOS: la base vuelve a montar el mismo ítem al cambiar de idioma.
//
// Ítem de los ejercicios 1 y 3: { tipo: 'hay' | 'nombre', plantilla, params, lineas, error, opciones, solucion }
//   lineas   [{ es, en }, …] el enunciado y el procedimiento (3 a 5 líneas); la 0 es el enunciado
//   error    null o { linea (índice en `lineas`, desde 1), nombre (clave de NOMBRES) }
//   opciones 'hay': ['bien', 'error'] · 'nombre': 4 claves
//   solucion la opción correcta (la misma forma que las opciones)
// Ítem del ejercicio 2 (columnas): { tipo: 'columnas', plantilla (id de la familia), params, enunciado, columnas,
//   preguntas, solucion } — ver generarColumnas.

import { PLANTILLAS, PLANTILLA_POR_ID, CLAVES_NOMBRES, CONFUNDIBLES, rutaDe, LETRAS, CUENTA, CUENTAS } from './textos.js';
import { factorizar } from '../_comun/aritmetica.js';

const CON_ERROR = PLANTILLAS.filter(p => p.error);
const SIN_ERROR = PLANTILLAS.filter(p => !p.error);

/** Las líneas que ve el alumno: el enunciado de la plantilla (si lo tiene aparte) y los pasos. */
export function lineasDe(plantilla, params) {
  const pasos = plantilla.lineas(params);
  return plantilla.enunciado ? [plantilla.enunciado(params), ...pasos] : pasos;
}
/** El error de la plantilla con la línea contada en `lineasDe` (el enunciado aparte la corre un puesto). */
export const errorDe = plantilla => plantilla.error && { ...plantilla.error, linea: plantilla.error.linea + (plantilla.enunciado ? 1 : 0) };

function ficha(plantilla, params, tipo, opciones, solucion) {
  return { tipo, plantilla: plantilla.id, params, lineas: lineasDe(plantilla, params), error: errorDe(plantilla), opciones, solucion };
}

/** Nombres que NO se pueden dar como distractores de un error: él mismo, sus excluidos y los confundibles. */
export function nombresExcluidos(plantilla) {
  const buenos = plantilla.error.nombre;
  const fuera = new Set([buenos, ...(plantilla.excluidos ?? [])]);
  for (const [a, b] of CONFUNDIBLES) {
    if (a === buenos) fuera.add(b);
    if (b === buenos) fuera.add(a);
  }
  return fuera;
}

/** Ejercicio 1. Mitad procedimientos bien y mitad con un error. */
export function generarHay(rng) {
  const conError = rng.azar() < 0.5;
  const plantilla = rng.elegir(conError ? CON_ERROR : SIN_ERROR);
  return ficha(plantilla, plantilla.numeros(rng), 'hay', ['bien', 'error'], conError ? 'error' : 'bien');
}

// ─── Ejercicio 2 en columnas (JL, 22-11) ────────────────────────────────────────
//
// El mismo enunciado resuelto por varios alumnos, uno por columna: de 2 a 4 columnas, 1 o 2 bien (de formas
// distintas) y 1 o 2 con un error (errores distintos). El alumno toca la primera línea mala de cada columna que
// esté mal (no se le dice cuántas hay) y después nombra el error de cada una. Antes era un solo procedimiento, y
// el error se deducía: si las otras líneas cuadran, tiene que estar en esta.
// Desde el 23-11, una de las malas puede ser un fallo de cuenta (`error: CUENTA`, con `cuenta: { bien, mal }`): se
// marca igual, pero no lleva pregunta tipo test.
//
// Una FAMILIA es un enunciado con sus números y sus rutas (ids de plantillas del banco o de RUTAS, en textos.js),
// todas con los mismos números. Una ruta con `vale(params)` falso no sale con esos números. Que cada columna buena
// es verdad línea a línea y cada mala tiene exactamente su línea falsa lo comprueba el test por fuerza bruta.
//
// Fuera del ejercicio 2 (siguen en el 1 y el 3): e-potencia y e-trozos (con un enunciado de un solo cálculo no hay
// dos formas buenas que no sean la misma con otras palabras), b-mcd-hcf, b-lcm-nombres, b-razonable y
// b-divisible-por (no resuelven: comentan el nombre o el resultado) y b-factores-11-13 (es un árbol: lo cubren
// c-arbol-1 y c-arbol-2).

const P = PLANTILLA_POR_ID;

/** Las parejas (c, d) con 2 ≤ c ≤ d y c · d = n: los árboles posibles. */
const parejas = n => Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).filter(c => n % c === 0).map(c => [c, n / c]);
/** Una hora y una duración como las del banco, sin el caso «2 horas y 0 minutos». */
function numerosHoras(rng) {
  for (;;) { const p = P['b-minutos-ok'].numeros(rng); if (p.m + p.d > 120) return p; }
}

export const FAMILIAS = [
  {
    // Pares con todos los primos comunes y exponentes distintos (los de e-cruzado).
    id: 'mcd',
    numeros: rng => P['e-cruzado'].numeros(rng),
    enunciado: p => P['b-mcd-ok'].enunciado(p),
    bien: ['b-mcd-ok', 'c-mcd-divisores'],
    mal: ['e-cruzado'],
  },
  {
    // Pares sin primos comunes: el m.c.d. es 1 (los de e-mcd-cero).
    id: 'mcd-1',
    numeros: rng => P['e-mcd-cero'].numeros(rng),
    enunciado: p => P['e-mcd-cero'].enunciado(p),
    bien: ['c-mcd-1-divisores', 'c-mcd-1-primos'],
    mal: ['e-mcd-cero'],
  },
  {
    // Pares con algún primo no común: «solo los comunes» y «los comunes con el menor exponente» son dos errores.
    id: 'mcm',
    numeros: rng => P['e-mcm-comunes'].numeros(rng),
    enunciado: p => P['b-mcm-ok'].enunciado(p),
    bien: ['b-mcm-ok', 'c-mcm-multiplos'],
    mal: ['e-mcm-comunes', 'c-mcm-cruzado'],
  },
  {
    // Los números de e-sin-terminar, con su descomposición a medias (a · b), un orden de los factores que no es
    // el de menor a mayor y dos árboles distintos.
    id: 'factoriza',
    numeros(rng) {
      const { n, a, b } = P['e-sin-terminar'].numeros(rng), f = factorizar(n);
      let orden = rng.barajar(f);
      while (orden.every(([p], i) => i === 0 || orden[i - 1][0] < p)) orden = rng.barajar(f);
      return { n, a, b, orden, arboles: rng.barajar(parejas(n)).slice(0, 2) };
    },
    enunciado: p => P['e-sin-terminar'].enunciado(p),
    bien: ['c-arbol-1', 'c-arbol-2', 'b-orden-factores', 'c-divisiones'],
    mal: ['e-sin-terminar'],
  },
  {
    // Números que no son múltiplos de 3 y acaban en 3, 6 o 9 (los de e-ultima-cifra-3).
    id: 'div3',
    numeros: rng => P['e-ultima-cifra-3'].numeros(rng),
    enunciado: p => P['e-ultima-cifra-3'].enunciado(p),
    bien: ['c-div3-suma', 'c-div3-division'],
    mal: ['e-ultima-cifra-3'],
  },
  {
    // Múltiplos de 3 que no lo son de 9.
    id: 'div3y9',
    numeros: rng => P['b-criterio-3-no-9'].numeros(rng),
    enunciado: p => P['b-criterio-3-no-9'].enunciado(p),
    bien: ['b-criterio-3-no-9', 'c-3y9-division'],
    mal: ['c-3y9-tres-nueve', 'c-3y9-ultima-cifra'],
  },
  {
    id: 'divisores',
    numeros: rng => P['b-divisores-ok'].numeros(rng),
    enunciado: p => P['b-divisores-ok'].enunciado(p),
    bien: ['b-divisores-ok', 'c-divisores-probando'],
    mal: ['e-olvida-1-n', 'e-olvida-n'],   // el mismo error: sale una de las dos
  },
  {
    // Impares que no son primos.
    id: 'primo',
    numeros: rng => P['e-impar-primo'].numeros(rng),
    enunciado: p => P['e-impar-primo'].enunciado(p),
    bien: ['b-impar-no-primo', 'c-primo-divisores'],
    mal: ['e-impar-primo'],
  },
  {
    id: 'horas',
    numeros: numerosHoras,
    enunciado: p => P['b-minutos-ok'].lineas(p)[0],
    bien: ['b-minutos-ok', 'c-minutos-horas-primero', 'c-minutos-hasta-la-hora'],
    mal: ['e-minutos'],
  },
  {
    id: 'relacion',
    numeros: rng => P['e-multiplo-divisor-a'].numeros(rng),
    enunciado: p => P['e-multiplo-divisor-a'].enunciado(p),
    bien: ['c-relacion-multiplo', 'c-relacion-divisor'],
    mal: ['e-multiplo-divisor-a', 'e-multiplo-divisor-b'],   // el mismo error: sale una de las dos
  },
];
export const FAMILIA_POR_ID = Object.fromEntries(FAMILIAS.map(fa => [fa.id, fa]));
/** Las familias con dos rutas malas salen más (dan 3 y 4 columnas). */
const PESOS = { mcm: 2, div3y9: 2 };
const SORTEO = FAMILIAS.flatMap(fa => Array(PESOS[fa.id] ?? 1).fill(fa));

const mismo = (x, y) => x.es === y.es && x.en === y.en;

/**
 * La columna de una ruta con los números de la familia, o null si no vale con ellos: { ruta, lineas (con el
 * enunciado en la 0), falsa (índice en `lineas`, o null), error (clave de NOMBRES, o null) }.
 */
export function columnaDe(familia, id, params) {
  const r = rutaDe(id);
  if (!r) throw new Error(`columnaDe: no hay ruta «${id}»`);
  if (r.vale && !r.vale(params)) return null;
  const enunciado = familia.enunciado(params);
  const delBanco = Boolean(PLANTILLA_POR_ID[id]);
  const lineas = delBanco ? lineasDe(r, params) : [enunciado, ...r.lineas(params)];
  if (!mismo(lineas[0], enunciado)) throw new Error(`columnaDe: «${id}» no empieza por el enunciado de «${familia.id}»`);
  const falsa = r.error ? (delBanco ? errorDe(r).linea : r.error.linea + 1) : null;
  return { ruta: id, lineas, falsa, error: r.error?.nombre ?? null };
}

/**
 * Las columnas posibles de una familia con unos números: { bien: [...], mal: [...] }, sin dos iguales ni dos
 * malas con el mismo error. `orden` baraja las rutas antes (para que, de dos con el mismo error, salgan las dos).
 */
export function columnasPosibles(familia, params, orden = rutas => rutas) {
  const vistas = new Set();
  const nueva = c => { if (!c) return false; const k = JSON.stringify(c.lineas); if (vistas.has(k)) return false; vistas.add(k); return true; };
  const bien = orden([...familia.bien]).map(id => columnaDe(familia, id, params)).filter(nueva);
  const errores = new Set();
  const mal = orden([...familia.mal]).map(id => columnaDe(familia, id, params))
    .filter(c => nueva(c) && !errores.has(c.error) && errores.add(c.error));
  return { bien, mal };
}

/**
 * El fallo de cuenta (JL, 23-11): la columna buena `origen` con la última cuenta mal hecha, un valor cercano al bueno
 * que no es el de ningún error con nombre ni el de otra columna (CUENTAS, en textos.js). Null si no queda ninguno.
 */
function columnaDeCuenta(rng, origen, params) {
  const k = CUENTAS[origen.ruta], bien = k.bien(params);
  const fuera = new Set([bien, ...k.conNombre(params)]);
  const posibles = k.cercanos(params).filter(x => !fuera.has(x));
  if (!posibles.length) return null;
  const mal = rng.elegir(posibles), falsa = origen.lineas.length - 1;
  return { ...origen, lineas: [...origen.lineas.slice(0, -1), k.ultima(params, mal)], falsa, error: CUENTA, cuenta: { bien, mal } };
}

/**
 * Ejercicio 2: el mismo enunciado en 2-4 columnas, 1-2 bien y 1-2 mal (como mucho una, con un fallo de cuenta). La
 * respuesta (`solucion`) es, por columna, el índice de la línea mala o null; después, una pregunta por cada columna
 * mala con nombre, con el nombre bueno y dos que no pueden describirla (ni excluidos ni confundibles, como en el
 * ejercicio 3).
 */
export function generarColumnas(rng) {
  for (let intento = 0; intento < 500; intento++) {
    const familia = rng.elegir(SORTEO);
    const params = familia.numeros(rng);
    const { bien, mal } = columnasPosibles(familia, params, rutas => rng.barajar(rutas));
    if (!bien.length || !mal.length) continue;
    const dos = () => (rng.azar() < 0.6 ? 2 : 1);
    const quiereBien = dos(), nMal = Math.min(mal.length, dos());
    // Con una sola columna mala con nombre, la mitad de las veces otra con un fallo de cuenta: sale de la ruta buena
    // con la cuenta al final (si la familia la tiene y le queda otra buena), que ya no sale bien en el ítem.
    let buenas = bien, cuenta = null;
    const origen = bien.find(c => CUENTAS[c.ruta]);
    if (nMal === 1 && origen && bien.length > 1 && rng.azar() < 0.5) {
      cuenta = columnaDeCuenta(rng, origen, params);
      if (cuenta) buenas = bien.filter(c => c !== origen);
    }
    const nBien = Math.min(buenas.length, quiereBien);
    const columnas = rng.barajar([...buenas.slice(0, nBien), ...mal.slice(0, nMal), ...(cuenta ? [cuenta] : [])]);
    // Pregunta tipo test solo para los errores con nombre: el fallo de cuenta no se puede nombrar (JL, 23-11).
    const preguntas = columnas.map((c, col) => ({ c, col })).filter(({ c }) => c.error && c.error !== CUENTA).map(({ c, col }) => {
      const fuera = nombresExcluidos(rutaDe(c.ruta));
      const otros = rng.barajar(CLAVES_NOMBRES.filter(k => !fuera.has(k))).slice(0, 2);
      return { col, opciones: rng.barajar([c.error, ...otros]), solucion: c.error };
    });
    return {
      tipo: 'columnas', plantilla: familia.id, params, enunciado: familia.enunciado(params), columnas, preguntas,
      solucion: columnas.map(c => c.falsa),
    };
  }
  throw new Error('generarColumnas: no salen columnas');
}

/** Ejercicio 3: el nombre correcto y tres que no pueden aplicarse a ese procedimiento. */
export function generarNombre(rng) {
  const plantilla = rng.elegir(CON_ERROR);
  const fuera = nombresExcluidos(plantilla);
  const distractores = rng.barajar(CLAVES_NOMBRES.filter(c => !fuera.has(c))).slice(0, 3);
  const opciones = rng.barajar([plantilla.error.nombre, ...distractores]);
  return ficha(plantilla, plantilla.numeros(rng), 'nombre', opciones, plantilla.error.nombre);
}

/** Clave para que la base no repita el ítem anterior. */
export const claveItem = item => `${item.plantilla}|${JSON.stringify(item.params)}`;

export { PLANTILLA_POR_ID, LETRAS, CUENTA };
