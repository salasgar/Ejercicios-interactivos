// Tareas de la semana: lo que se manda a los alumnos cada semana con UN enlace
// (`practicas/semana.html?t=<id>`). Cada tarea son unos ejercicios con ★,
// obligatorios, y una lista de la que el alumno elige `nElegir`. La página de
// la semana enseña el marcador y, al cumplirla, da un único código de
// resultado de la tarea (20 caracteres; ver `codigos.js`).
//
// ESTE FICHERO SE CAMBIA A MANO. El formato de cada tarea:
//
//   id        1, 2, 3… Viaja dentro del código de resultado de la tarea: NO se
//             renumera ni se reutiliza. Una tarea ya mandada a los alumnos no
//             se cambia (el código dice «el 3.º ★ terminado», y si cambia la
//             lista cambia lo que significa): si hay que cambiarla, se copia
//             con un id nuevo y se manda el enlace nuevo.
//   titulo    { es, en }
//   desde     opcional, 'AAAA-MM-DD': desde ese día la portada la enseña (antes,
//             el enlace funciona igual, pero la portada no la lista).
//   estrella  los obligatorios: lista de [slug, n] = ejercicio n (empezando en
//             1) de la práctica `slug` del catálogo, en el orden en que salen.
//             Como mucho 10.
//   elegir    los de elegir, igual. Como mucho 15.
//   nElegir   cuántos de `elegir` hay que terminar (como mucho, todos).
//
// Cada ejercicio vale 10 puntos (`PUNTOS_POR_EJERCICIO`): con 6 ★ y 4 a
// elegir, la tarea son 100 puntos. `npm test` (tests/practicas-semana.test.js)
// comprueba que todo [slug, n] existe en el catálogo, que no hay repetidos
// dentro de una tarea y los topes de arriba.
//
// Qué ejercicios lleva cada semana lo decide Juan Luis. Las cuatro de abajo son
// el borrador de la coordinadora del 2026-10-09 (reparto PU2,
// hechos/notas/s-20261008T174225-f75f5cdb-temporizacion.md), copiado tal cual.
// Los `desde` van con el calendario retrasado una semana (decisión del
// 2026-10-15: la semana 1 empieza el lunes 19-10).

import { practicaPorSlug } from './catalogo.js';

export const TAREAS = [
  {
    id: 1,
    titulo: { es: 'Semana 1 · Múltiplos, divisores y criterios', en: 'Week 1 · Multiples, divisors and divisibility rules' },
    desde: '2026-10-19',
    estrella: [['divisores', 4], ['recta', 1], ['recta', 2], ['rectangulos', 2], ['semaforo', 1], ['clasificador', 1]],
    elegir: [['semaforo', 2], ['semaforo', 4], ['recta', 3], ['rectangulos', 1], ['reloj', 1], ['leelo', 2], ['jerarquia', 1], ['division', 2]],
    nElegir: 4,
  },
  {
    id: 2,
    titulo: { es: 'Semana 2 · Números primos y factorización', en: 'Week 2 · Prime numbers and factorisation' },
    desde: '2026-10-26',
    estrella: [['criba', 2], ['semaforo', 3], ['arbol', 1], ['divisiones', 1], ['divisiones', 2], ['fabrica', 1]],
    elegir: [['criba', 1], ['arbol', 2], ['arbol', 3], ['divisiones', 3], ['fabrica', 2], ['factorizaciones', 2], ['exponente', 2], ['especiales', 1]],
    nElegir: 4,
  },
  {
    id: 3,
    titulo: { es: 'Semana 3 · m.c.d. y m.c.m. con factores primos', en: 'Week 3 · GCD and LCM with prime factors' },
    desde: '2026-11-02',
    estrella: [['venn', 1], ['venn', 2], ['venn', 3], ['venn', 4], ['imposibles', 1], ['factorizaciones', 1]],
    elegir: [['imposibles', 2], ['imposibles', 3], ['factorizaciones', 3], ['fabrica', 3], ['leelo', 3], ['divisores', 6], ['parentesis', 1], ['raiz', 2]],
    nElegir: 4,
  },
  {
    id: 4,
    titulo: { es: 'Semana 4 · Problemas y errores típicos', en: 'Week 4 · Word problems and common mistakes' },
    desde: '2026-11-09',
    estrella: [['clasificador', 2], ['reloj', 2], ['baldosas', 1], ['baldosas', 2], ['errores', 1], ['errores', 2]],
    elegir: [['clasificador', 3], ['reloj', 3], ['baldosas', 3], ['errores', 3], ['leelo', 1], ['criba', 3], ['expresion', 1], ['errores1', 1]],
    nElegir: 4,
  },
];

export const PUNTOS_POR_EJERCICIO = 10;
/** Topes que impone el código de resultado de la tarea (10 y 15 bits). */
export const MAX_ESTRELLA = 10;
export const MAX_ELEGIR = 15;
export const MAX_ID_TAREA = 1023;

export function tareaPorId(id) {
  return TAREAS.find(t => t.id === id) ?? null;
}

/**
 * Las tareas que enseña la portada el día `hoy` ('AAAA-MM-DD', fecha local):
 * las que no tienen `desde` y las que ya han llegado a su día.
 */
export function tareasPublicadas(hoy, tareas = TAREAS) {
  return tareas.filter(t => !t.desde || t.desde <= hoy);
}

/**
 * Enlace, relativo a `practicas/`, que abre el ejercicio n de una práctica
 * desde la tarea `tareaId`: la base lo abre directamente y, al salir o al
 * terminarlo, vuelve a la tarea (`?ejercicio=n&semana=id`, ver base.js).
 */
export function enlaceEjercicio(slug, n, tareaId, codigo = null, num = null) {
  const ficha = practicaPorSlug(slug);
  return `${ficha.ruta}?${codigo ? `c=${codigo}&` : ''}ejercicio=${n}&semana=${tareaId}${num ? `&num=${num}` : ''}`;
}

/** 'AAAA-MM-DD' de una fecha, en la hora local. */
export function fechaISO(fecha) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

/**
 * Lo que ve el alumno de una tarea, a partir de su progreso. `progresoDe(slug, n)`
 * devuelve el ejercicio n (empezando en 1) de esa práctica tal como lo guarda la
 * base ({ puntos, objetivo, fallos, terminado, dia… }) o null si no lo ha empezado.
 *
 * Cada ejercicio vale PUNTOS_POR_EJERCICIO: los 10 si está terminado y, si va a
 * medias, la parte proporcional de sus puntos (sin llegar a 10). De los de
 * elegir cuentan los `nElegir` que mejor lleve. La tarea está cumplida cuando
 * están terminados todos los ★ y al menos `nElegir` de los de elegir. Un
 * ejercicio terminado antes de que existiera la tarea cuenta igual.
 */
export function estadoTarea(tarea, progresoDe) {
  const fila = ([slug, n]) => {
    const ej = progresoDe(slug, n) ?? null;
    const terminado = Boolean(ej?.terminado);
    const empezado = terminado || (ej?.aciertos ?? 0) + (ej?.fallos ?? 0) > 0;
    const puntos = terminado ? PUNTOS_POR_EJERCICIO
      : ej?.puntos > 0 && ej?.objetivo > 0 ? Math.min(PUNTOS_POR_EJERCICIO - 1, Math.floor(PUNTOS_POR_EJERCICIO * ej.puntos / ej.objetivo)) : 0;
    return { slug, n, ej, terminado, empezado, puntos };
  };
  const estrella = tarea.estrella.map(fila);
  const elegir = tarea.elegir.map(fila);
  const estrellaHechos = estrella.filter(e => e.terminado).length;
  const elegirHechos = elegir.filter(e => e.terminado).length;
  const mejores = elegir.map(e => e.puntos).sort((a, b) => b - a).slice(0, tarea.nElegir);
  const todos = [...estrella, ...elegir];
  return {
    estrella,
    elegir,
    estrellaHechos,
    elegirHechos,
    cumplida: estrellaHechos === estrella.length && elegirHechos >= tarea.nElegir,
    empezada: todos.some(e => e.empezado),
    puntos: estrella.reduce((s, e) => s + e.puntos, 0) + mejores.reduce((s, p) => s + p, 0),
    maximo: PUNTOS_POR_EJERCICIO * (estrella.length + tarea.nElegir),
    fallos: todos.reduce((s, e) => s + (e.ej?.fallos ?? 0), 0),
    dia: Math.max(0, ...todos.filter(e => e.terminado).map(e => e.ej.dia ?? 0)),
  };
}

/**
 * Lo que está mal en una lista de tareas, en frases (vacía si todo está bien).
 * Lo usa el test; sirve también para comprobar a mano un cambio en este fichero.
 */
export function erroresTareas(tareas = TAREAS) {
  const errores = [];
  const ids = new Set();
  for (const t of tareas) {
    const nombre = `tarea ${t.id}`;
    if (!Number.isInteger(t.id) || t.id < 1 || t.id > MAX_ID_TAREA) errores.push(`${nombre}: el id tiene que ser un entero entre 1 y ${MAX_ID_TAREA}`);
    if (ids.has(t.id)) errores.push(`${nombre}: id repetido`);
    ids.add(t.id);
    if (typeof t.titulo?.es !== 'string' || typeof t.titulo?.en !== 'string') errores.push(`${nombre}: falta «titulo» como { es, en }`);
    if (t.desde !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(t.desde)) errores.push(`${nombre}: «desde» tiene que ser 'AAAA-MM-DD'`);
    if (!Array.isArray(t.estrella) || !Array.isArray(t.elegir)) { errores.push(`${nombre}: «estrella» y «elegir» tienen que ser listas`); continue; }
    if (t.estrella.length > MAX_ESTRELLA) errores.push(`${nombre}: más de ${MAX_ESTRELLA} ejercicios con ★`);
    if (t.elegir.length > MAX_ELEGIR) errores.push(`${nombre}: más de ${MAX_ELEGIR} ejercicios para elegir`);
    if (!Number.isInteger(t.nElegir) || t.nElegir < 0 || t.nElegir > t.elegir.length) errores.push(`${nombre}: «nElegir» tiene que estar entre 0 y ${t.elegir.length}`);
    if (!t.estrella.length && !t.nElegir) errores.push(`${nombre}: no pide nada`);
    const vistos = new Set();
    for (const par of [...t.estrella, ...t.elegir]) {
      const [slug, n] = Array.isArray(par) ? par : [];
      const practica = practicaPorSlug(slug);
      if (!practica) errores.push(`${nombre}: «${slug}» no está en el catálogo`);
      else if (!Number.isInteger(n) || n < 1 || n > practica.nEjercicios) errores.push(`${nombre}: ${slug} no tiene ejercicio ${n} (tiene ${practica.nEjercicios})`);
      if (vistos.has(`${slug}/${n}`)) errores.push(`${nombre}: ${slug}/${n} está repetido`);
      vistos.add(`${slug}/${n}`);
    }
  }
  return errores;
}
