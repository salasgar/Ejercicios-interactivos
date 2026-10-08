// Práctica «¿m.c.d. o m.c.m.?»: lógica pura (sin DOM ni red). Aquí no se
// calcula nada: los ítems solo se clasifican según el enunciado, nunca contra
// el valor real de un m.c.d. o un m.c.m.

import { BANCO } from './textos.js';

export { BANCO };

const LIMPIOS = BANCO.filter(p => !p.trampa);
const TRAMPAS = BANCO.filter(p => p.trampa);

const DISTRACTORES = ['dice_mayor', 'dice_menor', 'datos_pequenos', 'dos_datos'];

function indiceBanco(plantilla) {
  return BANCO.indexOf(plantilla);
}

/** Ítem de los ejercicios 1 y 2: { tipo, plantilla (índice en BANCO), numeros, clase }. */
function generarDe(lista, tipo, rng) {
  const plantilla = rng.elegir(lista);
  return { tipo, plantilla: indiceBanco(plantilla), numeros: plantilla.numeros(rng), clase: plantilla.clase };
}

export function generarLimpio(rng) {
  return generarDe(LIMPIOS, 'limpio', rng);
}

export function generarTrampa(rng) {
  return generarDe(TRAMPAS, 'trampa', rng);
}

/** Ítem del ejercicio 3: añade `opciones` (4 claves de justificación, barajadas) y `solucion`. */
export function generarJustificar(rng) {
  const plantilla = rng.elegir(BANCO);
  // Trampa A: el número de piezas no divide a los datos; la razón buena habla del tamaño.
  const correcta = plantilla.clase === 'mcm' ? 'contiene' : plantilla.tamano ? 'tamano' : 'va';
  // La razón contraria: en m.c.d. con tamaño no se ofrece «va» (ambigua con el número de piezas).
  const incorrecta = plantilla.clase === 'mcd' ? 'contiene' : 'va';
  // Un «dice mayor/menor» solo es distractor si el enunciado NO lleva esa palabra.
  const distractores = rng.barajar(DISTRACTORES.filter(d => !plantilla.dice.includes(d === 'dice_mayor' ? 'mayor' : d === 'dice_menor' ? 'menor' : ''))).slice(0, 2);
  const opciones = rng.barajar([correcta, incorrecta, ...distractores]);
  return {
    tipo: 'justificar',
    plantilla: indiceBanco(plantilla),
    numeros: plantilla.numeros(rng),
    clase: plantilla.clase,
    opciones,
    solucion: correcta,
  };
}
