// Práctica «Caza el error (unidad 1)»: lógica pura (sin DOM ni red). Los generadores
// devuelven DATOS: la base vuelve a montar el mismo ítem al cambiar de idioma.
//
// Ítem: { tipo: 'hay' | 'nombre', plantilla, params, lineas, error, opciones, solucion }
// Ejercicio 2: { tipo: 'columnas', plantilla (familia), params, enunciado, columnas: [{ruta, lineas, error, falsa,
//   porque}], preguntas: [{col, solucion, opciones}], solucion: [línea mala o null por columna] }
// Ejercicio 4: { tipo: 'pasos', plantilla, params, lineas, salta, opciones: ['si', 'no'], solucion }
//   lineas   [{ es, en }, …] el procedimiento (2 a 4 líneas)
//   error    null o { linea (desde 0), nombre (clave de NOMBRES) }
//   opciones 'hay': ['bien', 'error'] · 'nombre': 4 claves
//   solucion la opción correcta (la misma forma que las opciones)

import { PLANTILLAS, PLANTILLA_POR_ID, PASOS, PASOS_POR_ID, CLAVES_NOMBRES, CONFUNDIBLES, CUENTA } from './textos.js';
import { evaluar, SORTEO } from './familias.js';

const CON_ERROR = PLANTILLAS.filter(p => p.error);
const SIN_ERROR = PLANTILLAS.filter(p => !p.error);

function ficha(plantilla, params, tipo, opciones, solucion) {
  return { tipo, plantilla: plantilla.id, params, lineas: plantilla.lineas(params), error: plantilla.error, opciones, solucion };
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

const aLinea = expr => ({ es: expr, en: expr.replace(/:/g, '÷') });
const detalle = (x, params) => (typeof x === 'function' ? x(params) : x);

/**
 * Una columna con las líneas de una ruta, o null si los números no la dejan verdadera (buena) o falsa justo en su
 * línea de error (mala). `falsa` es la línea mala (con el enunciado como 0) o null.
 */
export function columnaDe(ruta, params) {
  const lineas = ruta.lineas(params);
  const valor = evaluar(lineas[0]);
  const e = ruta.error?.linea ?? null;
  for (let i = 1; i < lineas.length; i++) {
    const v = evaluar(lineas[i]);
    const debeIgualar = e === null || i < e;
    if (Number.isNaN(v) || (debeIgualar ? v !== valor : v === valor)) return null;
    if (e !== null && i > e && v !== evaluar(lineas[e])) return null;
  }
  if (e !== null && e >= lineas.length) return null;
  return { ruta: ruta.id, lineas: lineas.map(aLinea), error: ruta.error?.nombre ?? null, falsa: e, excluidos: ruta.excluidos ?? [] };
}

/** Las columnas posibles: sin dos iguales, y las malas con errores distintos entre sí. */
export function columnasPosibles(familia, params) {
  const buenas = familia.bien.map(r => ({ r, c: columnaDe(r, params) })).filter(x => x.c);
  const malas = familia.mal.map(r => ({ r, c: columnaDe(r, params) })).filter(x => x.c);
  const clave = c => c.lineas.map(l => l.es).join('|');
  const unicas = lista => lista.filter((x, i) => lista.findIndex(y => clave(y.c) === clave(x.c)) === i);
  return { bien: unicas(buenas), mal: unicas(malas) };
}

/** Nombres que NO pueden ser distractores de una columna mala: los de todos los errores del ítem y sus confundibles. */
function distractoresDe(rng, columna, malas) {
  const fuera = new Set([...malas.map(c => c.error), ...columna.excluidos, ...malas.flatMap(c => c.excluidos)]);
  for (const nombre of malas.map(c => c.error)) {
    for (const [a, b] of CONFUNDIBLES) {
      if (a === nombre) fuera.add(b);
      if (b === nombre) fuera.add(a);
    }
  }
  return rng.barajar(CLAVES_NOMBRES.filter(c => !fuera.has(c))).slice(0, 2);
}

const CERCANOS = [1, -1, 2, -2, 10, -10];

/**
 * Lo que daría la última cuenta («13 + 3», «7^2») con otra operación o con un error del catálogo: un fallo de cuenta
 * nunca puede valer eso, o sería un error con nombre (7^2 = 14 es «la potencia como producto»).
 */
function conNombre(antes, bien) {
  const valores = new Set([-bien]);
  const m = /^(\d+) ([+−·]) (\d+)$/.exec(antes);
  if (m) {
    const a = Number(m[1]), b = Number(m[3]);
    for (const v of [a + b, a - b, b - a, a * b]) valores.add(v);
  }
  const p = /^(\d+)\^(\d+)$/.exec(antes);
  if (p) valores.add(Number(p[1]) * Number(p[2]));
  return valores;
}

/**
 * El fallo de cuenta (JL, 23-11): una ruta buena que no sale en el ítem con la última cuenta mal hecha, un número
 * cercano (±1, ±2, ±10). No tiene nombre en el catálogo, así que su columna no lleva pregunta. `prohibidos` son los
 * resultados de las otras columnas y de todos los errores con nombre de la familia.
 */
function columnaDeCuenta(rng, origen, prohibidos) {
  const lineas = origen.c.lineas, ultima = lineas.length - 1, bien = evaluar(lineas[ultima].es);
  const nombrados = conNombre(lineas[ultima - 1].es, bien);
  const posibles = CERCANOS.map(d => bien + d).filter(x => x >= 1 && !prohibidos.has(x) && !nombrados.has(x));
  if (!posibles.length) return null;
  const mal = rng.elegir(posibles);
  return {
    r: origen.r,
    c: { ...origen.c, lineas: [...lineas.slice(0, -1), aLinea(String(mal))], error: CUENTA, falsa: ultima, cuenta: { bien, mal } },
  };
}

/**
 * Ejercicio 2 en columnas: el mismo cálculo hecho por 2-4 alumnos, 1-2 bien (de formas distintas) y 1-2 mal (con
 * errores distintos; con una sola mala con nombre, a veces otra con un fallo de cuenta). Una pregunta por columna
 * mala con nombre: el nombre bueno y dos que no pueden describirla.
 */
export function generarColumnas(rng) {
  for (let intento = 0; intento < 500; intento++) {
    const familia = rng.elegir(SORTEO);
    const params = familia.numeros(rng);
    const { bien, mal } = columnasPosibles(familia, params);
    if (!bien.length || !mal.length) continue;
    const dos = () => (rng.azar() < 0.6 ? 2 : 1);
    const todasBuenas = rng.barajar(bien), buenas = todasBuenas.slice(0, dos());
    const malas = [];
    for (const m of rng.barajar(mal)) if (malas.length < dos() && !malas.some(x => x.c.error === m.c.error)) malas.push(m);
    const elegidas = [...buenas, ...malas];
    if (malas.length === 1 && rng.azar() < 0.4) {
      const clave = c => c.lineas.slice(0, -1).map(l => l.es).join('|');
      const sobrantes = todasBuenas.slice(buenas.length).filter(x => !elegidas.some(e => clave(e.c) === clave(x.c)));
      if (sobrantes.length) {
        const prohibidos = new Set([...elegidas, ...mal].map(x => evaluar(x.c.lineas.at(-1).es)));
        const cuenta = columnaDeCuenta(rng, rng.elegir(sobrantes), prohibidos);
        if (cuenta) elegidas.push(cuenta);
      }
    }
    const columnas = rng.barajar(elegidas).map(({ r, c }) => ({
      ...c,
      porque: c.error ? null : detalle(r.porque, params),
    }));
    const malasColumnas = columnas.filter(c => c.error && c.error !== CUENTA);
    const preguntas = columnas.map((c, col) => ({ c, col })).filter(({ c }) => c.error && c.error !== CUENTA).map(({ c, col }) => {
      const opciones = rng.barajar([c.error, ...distractoresDe(rng, c, malasColumnas)]);
      return { col, solucion: c.error, opciones };
    });
    const enunciado = columnas[0].lineas[0].es;
    const sinEnunciado = columnas.map(({ excluidos, ...c }) => c);
    return {
      tipo: 'columnas', plantilla: familia.id, params, enunciado: aLinea(enunciado), columnas: sinEnunciado, preguntas,
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

const SALTA = PASOS.filter(p => p.salta);
const NO_SALTA = PASOS.filter(p => !p.salta);

/** Ejercicio 4: todas las igualdades son verdaderas; ¿se ha saltado algún paso? Mitad y mitad. */
export function generarPasos(rng) {
  const salta = rng.azar() < 0.5;
  const plantilla = rng.elegir(salta ? SALTA : NO_SALTA);
  const params = plantilla.numeros(rng);
  return { tipo: 'pasos', plantilla: plantilla.id, params, lineas: plantilla.lineas(params), salta, opciones: ['si', 'no'], solucion: salta ? 'si' : 'no' };
}

/** Clave para que la base no repita el ítem anterior. */
export const claveItem = item => `${item.plantilla}|${JSON.stringify(item.params)}`;
/** Clave del ejercicio 4: no repite la misma estructura dos veces seguidas. */
export const clavePasos = item => item.plantilla;

export { PLANTILLA_POR_ID, PASOS_POR_ID, CUENTA };
