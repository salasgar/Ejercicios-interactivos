// Niveles adaptables (tarea 134, 2026-11-03): un ejercicio elige sus ítems según
// cómo vaya el alumno. Sin estado nuevo y sin tocar la base: `generar(rng, sesion)`
// ya recibe `sesion = { puntos, vidas, … }` (ver ../plantilla/practica.js).
//
//   NIVELES        3: 1 = lo que todo alumno de 1.º ESO tiene que dominar; 2 = el
//                  resto de 1.º; 3 = más allá de 1.º.
//   nivelDe        el nivel que toca con esos puntos y esas vidas.
//   nivelForzado   `?nivel=N` en la dirección, solo practicando sin código.
//   elegirDeNivel  un ítem de un banco con `nivel` en cada ítem.
//   etiquetaNivel  «Nivel 2 · ●●○», para la esquina del ítem.
//
// Puro salvo `nivelForzado`, que por defecto lee la dirección y el navegador (y
// fuera del navegador no encuentra nada). Lo prueba tests/practicas-nivel.test.js.
//
// Uso en un generador (docs/practicas-ortografia.md, §3):
//
//   generar: (rng, sesion) => {
//     const { item, actual } = elegirDeNivel(rng, BANCO, sesion, { forzado: nivelForzado() });
//     return { i: BANCO.indexOf(item), nivel: actual };
//   }

import { OBJETIVO, VIDAS } from './contador.js';

export const NIVELES = 3;

// Umbrales (decisión explicada a Juan Luis el 2026-11-03; no se cambian sin dejar aquí el porqué).
// Por puntos, en décimas del objetivo (menos del 30 % → 1; menos del 70 % → 2; si no, 3): con el
// objetivo de siempre (10), 0-2 puntos → nivel 1, 3-6 → nivel 2, 7-10 → nivel 3. El contador ya
// mide cómo va el alumno: no hace falta guardar nada.
export const UMBRAL_NIVEL_2 = 3;
export const UMBRAL_NIVEL_3 = 7;
// Tope por vidas perdidas en este intento: con 0 o 1 perdidas, sin tope; con 2, como mucho el
// nivel 2; con 3 o más, el nivel 1. Con las 5 vidas de siempre: 5 o 4 vidas, sin tope; 3, nivel 2
// como mucho; 2 o menos, nivel 1. Así quien falla no sube (no se desespera) y el nivel 3 lo
// alcanza quien llega a 7 puntos habiendo fallado una vez como mucho. Se cuentan las perdidas
// (y no las que quedan) para que un ejercicio con otras `vidas` no empiece ya con tope.
export const PERDIDAS_TOPE_2 = 2;
export const PERDIDAS_TOPE_1 = 3;
// En `elegirDeNivel`, la parte de ítems del nivel actual (el resto, de los niveles de debajo).
export const PARTE_NIVEL_ACTUAL = 0.7;

const esNivel = n => Number.isInteger(n) && n >= 1 && n <= NIVELES;

/**
 * El nivel (1-3) que toca. `sesion` es la que recibe `generar` (`puntos` y `vidas`); vacía o
 * sin campos, nivel 1. `objetivo` y `vidasTotales` son los del ejercicio (por defecto, los de
 * siempre). Con `forzado` (1-3, de `nivelForzado`), ese y nada más.
 */
export function nivelDe(sesion, { objetivo = OBJETIVO, vidasTotales = VIDAS, forzado = null } = {}) {
  if (esNivel(forzado)) return forzado;
  const puntos = Number.isFinite(sesion?.puntos) ? Math.max(0, sesion.puntos) : 0;
  // En enteros (puntos · 10 frente a objetivo · 3): sin decimales que fallen en el borde.
  const porPuntos = puntos * 10 < objetivo * UMBRAL_NIVEL_2 ? 1 : puntos * 10 < objetivo * UMBRAL_NIVEL_3 ? 2 : 3;
  if (!Number.isFinite(sesion?.vidas)) return porPuntos;
  const perdidas = vidasTotales - sesion.vidas;
  const tope = perdidas >= PERDIDAS_TOPE_1 ? 1 : perdidas >= PERDIDAS_TOPE_2 ? 2 : NIVELES;
  return Math.min(porPuntos, tope);
}

/**
 * ¿Hay un alumno con código en esta página? Lo mismo que mira la base al arrancar: `?c=` en la
 * dirección o el código recordado en el navegador («Probar sin código» solo se ve sin ninguno de
 * los dos; «Cambiar código» borra el recordado). La base no expone su `estado.codigo` y no se toca.
 */
export function hayCodigoEnLaPagina(busqueda = typeof location === 'undefined' ? '' : location.search) {
  if (new URLSearchParams(busqueda).get('c')) return true;
  try { return typeof localStorage !== 'undefined' && localStorage.getItem('practicas.codigo') !== null; } catch { return false; }
}

/**
 * `?nivel=N` (1-3) de la dirección, solo practicando sin código: para revisar los ítems de un
 * nivel (tareas 140-142) y para enseñarlo en clase. Con código, o con otro valor, null: un alumno
 * no se salta los niveles a mano (y si lo intentara, ni le sale).
 */
export function nivelForzado(busqueda = typeof location === 'undefined' ? '' : location.search, hayCodigo = hayCodigoEnLaPagina(busqueda)) {
  if (hayCodigo) return null;
  const texto = new URLSearchParams(busqueda).get('nivel');
  if (!/^[1-9]$/.test(texto ?? '')) return null;
  const n = Number(texto);
  return esNivel(n) ? n : null;
}

/**
 * Un ítem de `banco` para esta `sesion`: con probabilidad 0,7 del nivel actual y 0,3 de uno de
 * los niveles de debajo (si los hay); nunca de uno de arriba. Si el nivel actual no tiene ítems,
 * baja al más alto que los tenga. Devuelve { item, nivel, actual }: `nivel`, el del ítem; `actual`,
 * el del alumno (el que se enseña con `etiquetaNivel`).
 *
 * `nivelDe` dice el nivel de un ítem (por defecto, su campo `nivel`); `forzado`, `objetivo` y
 * `vidasTotales` pasan a `nivelDe(sesion, …)`. Un banco sin ningún ítem de ese nivel ni de los de
 * debajo es un banco mal hecho (los tests de cada bloque piden ≥ 12-16 por nivel); para no dejar
 * al alumno parado, entonces se usa el nivel más bajo que haya.
 */
export function elegirDeNivel(rng, banco, sesion, { nivelDe: nivelDelItem = item => item.nivel, forzado = null, objetivo, vidasTotales } = {}) {
  if (!banco?.length) throw new Error('elegirDeNivel: el banco está vacío');
  const alumno = nivelDe(sesion, { objetivo, vidasTotales, forzado });
  const porNivel = new Map();
  for (const item of banco) {
    const n = nivelDelItem(item);
    if (!porNivel.has(n)) porNivel.set(n, []);
    porNivel.get(n).push(item);
  }
  const niveles = [...porNivel.keys()].filter(esNivel).sort((a, b) => a - b);
  if (!niveles.length) throw new Error('elegirDeNivel: ningún ítem tiene un nivel de 1 a 3');
  const alcanzables = niveles.filter(n => n <= alumno);
  const actual = alcanzables.length ? alcanzables.at(-1) : niveles[0];
  const inferiores = niveles.filter(n => n < actual).flatMap(n => porNivel.get(n));
  const item = inferiores.length && rng.azar() >= PARTE_NIVEL_ACTUAL ? rng.elegir(inferiores) : rng.elegir(porNivel.get(actual));
  return { item, nivel: nivelDelItem(item), actual };
}

/** Textos del nivel, en español (las prácticas que lo usan van en español). */
export const TX_NIVEL = {
  nivel: n => `Nivel ${n}`,
  de: (n, total = NIVELES) => `Nivel ${n} de ${total}`,
  sube: n => `¡Subes al nivel ${n}!`,
};

/**
 * HTML pequeño para la esquina del ítem: «Nivel 2 · ●●○». Con un nivel que no es 1-3, nada.
 * `esc` es el de `api.esc` (por si el texto llevara algo que escapar).
 */
export function etiquetaNivel(nivel, esc = texto => String(texto).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)) {
  if (!esNivel(nivel)) return '';
  const puntos = '●'.repeat(nivel) + '○'.repeat(NIVELES - nivel);
  return `<span class="etiqueta etiqueta-nivel" aria-label="${esc(TX_NIVEL.de(nivel))}">${esc(TX_NIVEL.nivel(nivel))} · <span aria-hidden="true">${puntos}</span></span>`;
}
