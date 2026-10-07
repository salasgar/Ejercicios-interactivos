// Contador de repeticiones de un ejercicio y fechas. Como el de
// `divisores/logica.js`, pero con el número inicial, la penalización y el tope
// como parámetros, porque no todas las prácticas usan los mismos.

// 10 aciertos, no 20 (decisión de Juan Luis del 2026-10-07 tras probar en el
// móvil): el tope se reduce en la misma proporción. La penalización pasa a
// ser la misma que `divisores/` tiene publicada hoy (2, no 5).
export const INICIAL = 10;
export const PENALIZACION = 2;
export const MAXIMO = 20;   // tope de pendientes, para que nadie se hunda

/**
 * El campo `rapidos` no lo usa la base (siempre 0): está para que los
 * documentos de Firestore de `divisores` y de `practicas` tengan la misma forma.
 */
export function ejercicioNuevo(inicial = INICIAL) {
  return { pendientes: inicial, aciertos: 0, fallos: 0, rapidos: 0, terminado: false, dia: 0, repeticiones: 0 };
}

/**
 * Anota una respuesta: un acierto quita una pendiente; un fallo añade
 * `penalizacion`, sin pasar de `maximo` (y sin bajar si ya se estaba por
 * encima). Las `pistas` (ayudas usadas en el ítem) se suman a los fallos sin
 * tocar las pendientes.
 */
export function anotar(ej, acierto, dia = 0, { penalizacion = PENALIZACION, maximo = MAXIMO, pistas = 0 } = {}) {
  if (ej.terminado) return ej;
  const sig = { ...ej };
  sig.fallos += pistas;
  if (acierto) { sig.aciertos++; sig.pendientes--; } else {
    sig.fallos++;
    sig.pendientes = Math.max(sig.pendientes, Math.min(maximo, sig.pendientes + penalizacion));
  }
  if (sig.pendientes <= 0) { sig.pendientes = 0; sig.terminado = true; sig.dia = dia; }
  return sig;
}

// --- Fechas -----------------------------------------------------------------

const ORIGEN = Date.UTC(2026, 8, 1); // 1 de septiembre de 2026 = día 0

/** Días desde el 1-9-2026 (en la fecha local del alumno), entre 0 y 1023. */
export function diaDe(fecha) {
  const utc = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  return Math.max(0, Math.min(1023, Math.round((utc - ORIGEN) / 86400000)));
}

/** «7/10/2026» a partir del número de día. */
export function fechaDeDia(dia) {
  const f = new Date(ORIGEN + dia * 86400000);
  return `${f.getUTCDate()}/${f.getUTCMonth() + 1}/${f.getUTCFullYear()}`;
}
