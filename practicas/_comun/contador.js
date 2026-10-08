// Contador de un ejercicio: puntos, vidas y racha. Y las fechas.
//
// Modelo (decisión de Juan Luis del 2026-10-08, antes de que ningún alumno
// usara las prácticas; sustituye al «10 aciertos, +2 por fallo, tope 20»):
//
//   - El alumno tiene que llegar a OBJETIVO puntos. Cada acierto da 1 punto.
//   - RACHA aciertos seguidos dan EXTRA punto(s) más (y una felicitación).
//   - Cada fallo quita PENALIZACION puntos (nunca por debajo de 0) y una vida.
//     Sin vidas, el ejercicio vuelve a empezar: puntos a 0 y vidas nuevas.
//     Los fallos acumulados se conservan: son lo que ve el profesor.
//
// Los valores están aquí, en un solo sitio, para ajustarlos cuando se vea
// cómo reaccionan los alumnos. Un ejercicio puede declarar su propio
// `objetivo`, `penalizacion` y `vidas` (ver ../plantilla/practica.js).
export const OBJETIVO = 10;
export const PENALIZACION = 1;
export const VIDAS = 5;
export const RACHA = 5;
export const EXTRA = 1;

/**
 * `aciertos` son los del intento en curso (vuelven a 0 al perder las vidas:
 * los ejercicios por pasos, como la criba, lo usan como número de paso).
 * `fallos` acumula todos, también los de intentos anteriores. `rapidos` no lo
 * usa la base (siempre 0): está para que los documentos de Firestore de
 * `divisores` y de `practicas` tengan la misma forma.
 */
export function ejercicioNuevo(objetivo = OBJETIVO, vidas = VIDAS) {
  return { puntos: 0, objetivo, vidas, racha: 0, aciertos: 0, fallos: 0, rapidos: 0, reinicios: 0, terminado: false, dia: 0, repeticiones: 0 };
}

/**
 * Anota una respuesta y devuelve el ejercicio nuevo (el de entrada no se toca).
 * Las `pistas` (ayudas usadas en el ítem) se suman a los fallos sin tocar los
 * puntos ni las vidas. `vidas` son las que se reponen al perderlas todas.
 */
export function anotar(ej, acierto, dia = 0, { penalizacion = PENALIZACION, vidas = VIDAS, racha = RACHA, extra = EXTRA, pistas = 0 } = {}) {
  if (ej.terminado) return ej;
  const sig = { ...ej };
  sig.fallos += pistas;
  if (acierto) {
    sig.aciertos++;
    sig.racha++;
    sig.puntos++;
    if (racha > 0 && sig.racha % racha === 0) sig.puntos += extra;
    if (sig.puntos >= sig.objetivo) { sig.puntos = sig.objetivo; sig.terminado = true; sig.dia = dia; }
  } else {
    sig.fallos++;
    sig.racha = 0;
    sig.puntos = Math.max(0, sig.puntos - penalizacion);
    sig.vidas--;
    if (sig.vidas <= 0) { sig.puntos = 0; sig.aciertos = 0; sig.vidas = vidas; sig.reinicios++; }
  }
  return sig;
}

/**
 * Qué ha pasado entre dos estados seguidos del contador, para el feedback:
 * puntos ganados o perdidos, si ha habido punto extra por la racha y si se
 * han perdido todas las vidas (el ejercicio vuelve a empezar).
 */
export function queHaPasado(antes, despues) {
  const reinicio = despues.reinicios > antes.reinicios;
  return {
    ganados: Math.max(0, despues.puntos - antes.puntos),
    perdidos: reinicio ? antes.puntos : Math.max(0, antes.puntos - despues.puntos),
    extra: despues.aciertos > antes.aciertos && despues.puntos - antes.puntos > 1,
    reinicio,
    vidas: despues.vidas,
  };
}

/**
 * Encaja un progreso guardado con otra versión del contador: uno guardado
 * con el modelo antiguo (con `pendientes`, sin `puntos`) y uno cuyo objetivo
 * o vidas han cambiado después. Un ejercicio terminado sigue terminado,
 * fueran cuales fueran las normas con las que se terminó.
 */
export function migrarProgreso(ej, { objetivo = OBJETIVO, vidas = VIDAS } = {}) {
  if (ej.terminado) return ej.puntos === undefined ? { ...ejercicioNuevo(objetivo, vidas), ...ej, puntos: objetivo, objetivo } : ej;
  if (ej.puntos === undefined) return { ...ejercicioNuevo(objetivo, vidas), fallos: ej.fallos ?? 0 };
  if (ej.objetivo === objetivo && ej.vidas <= vidas) return ej;
  return { ...ej, objetivo, puntos: Math.min(ej.puntos, objetivo - 1), vidas: Math.min(ej.vidas, vidas) };
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
