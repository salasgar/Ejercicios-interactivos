// Tareas de la semana: lo que se manda a los alumnos cada semana con UN enlace
// (`practicas/semana.html?t=<id>`). Cada tarea son unos ejercicios con ★,
// obligatorios, y una lista de la que el alumno elige `nElegir`. La página de
// la semana enseña el marcador y, al cumplirla, da un único código de
// resultado de la tarea (20 caracteres; ver `codigos.js`).
//
// Desde la tarea 71 este fichero es la PLANTILLA: lo que carga «Cargar la
// plantilla del curso» en el editor del panel (configPlantilla) y lo que se
// enseña sin código. Las tareas de cada profesor, también las de Juan Luis,
// viven en su espacio (`config/tareas`) y se cambian en el panel. Se cambia a
// mano. El formato de cada tarea:
//
//   id        1, 2, 3… Viaja dentro del código de resultado de la tarea: NO se
//             renumera ni se reutiliza. Una tarea ya mandada a los alumnos no
//             se cambia (el código dice «el 3.º ★ terminado», y si cambia la
//             lista cambia lo que significa): si hay que cambiarla, se copia
//             con un id nuevo y se manda el enlace nuevo.
//   titulo    { es, en }
//   unidad    la unidad del curso a la que pertenece (ver UNIDADES en
//             catalogo.js): es la sección de la portada en la que sale.
//   desde     opcional, 'AAAA-MM-DD': desde ese día la portada la enseña (antes,
//             el enlace funciona igual, pero la portada no la lista).
//   hasta     opcional, 'AAAA-MM-DD': el plazo, hasta el final de ese día (hora
//             local). Lo hecho después sigue contando, pero sale «fuera de
//             plazo» y se mide el retraso en días (ver estadoPlazo).
//   asignada  opcional, true: es obligatoria SOLO para los alumnos marcados en
//             el panel; para los demás es una tarea de repaso más.
//   progresoPorPractica  true solo en la tarea 1: su progreso sigue en el
//             documento de cada práctica (`progreso-libre/<slug>--<código>`) y lo de
//             la práctica libre le cuenta. Las demás llevan su propio progreso.
//             No se le quita nunca (erroresTareas lo comprueba).
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
// 2026-10-15: la semana 1 empieza el lunes 19-10). La semana 1 se adelantó al
// viernes 16-10 (Juan Luis la publicó en Classroom ese día, con plazo hasta el
// jueves 22-10); las demás siguen en sus lunes.

import { practicaPorSlug, UNIDADES } from './catalogo.js';
import { diaDe } from './contador.js';

export const TAREAS = [
  {
    id: 1,
    unidad: 2,
    titulo: { es: 'U2 · Semana 1 · Múltiplos, divisores y criterios', en: 'U2 · Week 1 · Multiples, divisors and divisibility rules' },
    desde: '2026-10-16',
    hasta: '2026-10-22',
    progresoPorPractica: true,
    estrella: [['divisores', 4], ['recta', 1], ['recta', 2], ['rectangulos', 2], ['semaforo', 1], ['clasificador', 1]],
    elegir: [['semaforo', 2], ['semaforo', 4], ['recta', 3], ['rectangulos', 1], ['reloj', 1], ['leelo', 2], ['jerarquia', 1], ['division', 2]],
    nElegir: 4,
  },
  {
    id: 2,
    unidad: 2,
    titulo: { es: 'U2 · Semana 2 · Números primos y factorización', en: 'U2 · Week 2 · Prime numbers and factorisation' },
    desde: '2026-10-26',
    hasta: '2026-10-29',
    // 2026-10-18 (tarea 76): la Fábrica perdió su ejercicio 1 («Construye el
    // divisor»), que era ★ aquí; lo sustituye el árbol 2, que estaba entre los de
    // elegir (decisión de Juan Luis). El antiguo fabrica 2 es ahora fabrica 1.
    estrella: [['criba', 2], ['semaforo', 3], ['arbol', 1], ['arbol', 2], ['divisiones', 1], ['divisiones', 2]],
    elegir: [['criba', 1], ['arbol', 3], ['divisiones', 3], ['fabrica', 1], ['factorizaciones', 2], ['exponente', 2], ['especiales', 1]],
    nElegir: 4,
  },
  {
    id: 3,
    unidad: 2,
    titulo: { es: 'U2 · Semana 3 · m.c.d. y m.c.m. con factores primos', en: 'U2 · Week 3 · GCD and LCM with prime factors' },
    desde: '2026-11-02',
    hasta: '2026-11-05',
    estrella: [['venn', 1], ['venn', 2], ['venn', 3], ['venn', 4], ['imposibles', 1], ['factorizaciones', 1]],
    elegir: [['imposibles', 2], ['imposibles', 3], ['factorizaciones', 3], ['fabrica', 2], ['leelo', 3], ['divisores', 6], ['parentesis', 1], ['raiz', 2]],
    nElegir: 4,
  },
  {
    id: 4,
    unidad: 2,
    titulo: { es: 'U2 · Semana 4 · Problemas y errores típicos', en: 'U2 · Week 4 · Word problems and common mistakes' },
    desde: '2026-11-09',
    hasta: '2026-11-12',
    estrella: [['clasificador', 2], ['reloj', 2], ['baldosas', 1], ['baldosas', 2], ['errores', 1], ['errores', 2]],
    elegir: [['clasificador', 3], ['reloj', 3], ['baldosas', 3], ['errores', 3], ['leelo', 1], ['criba', 3], ['expresion', 1], ['errores1', 1]],
    nElegir: 4,
  },
  // Las cuatro tareas de repaso de la unidad 1 (tarea 46, propuesta aprobada por
  // Juan Luis el 2026-10-16): sin `desde` ni `hasta`, o sea voluntarias y visibles
  // hasta que él las active.
  {
    id: 11,
    unidad: 1,
    titulo: { es: 'U1 · Semana 1 · Valor posicional, lectura de números y redondeo', en: 'U1 · Week 1 · Place value, reading numbers and rounding' },
    estrella: [['constructor', 2], ['dictado', 1], ['redondeo', 1], ['redondeo', 3], ['jerarquia', 1], ['parentesis', 1]],
    elegir: [['constructor', 1], ['constructor', 3], ['dictado', 2], ['dictado', 3], ['potencias10', 2], ['redondeo', 2]],
    nElegir: 4,
  },
  {
    id: 12,
    unidad: 1,
    titulo: { es: 'U1 · Semana 2 · División entera y propiedades de las operaciones', en: 'U1 · Week 2 · Division with remainder and properties of operations' },
    estrella: [['division', 1], ['division', 2], ['division', 3], ['distributiva', 2], ['mental', 1], ['parentesis', 3]],
    elegir: [['division', 4], ['distributiva', 1], ['distributiva', 3], ['mental', 2], ['parentesis', 2], ['jerarquia', 1], ['redondeo', 2]],
    nElegir: 4,
  },
  {
    id: 13,
    unidad: 1,
    titulo: { es: 'U1 · Semana 3 · Potencias y raíces cuadradas', en: 'U1 · Week 3 · Powers and square roots' },
    estrella: [['exponente', 2], ['exponente', 1], ['potencias10', 1], ['raiz', 2], ['jerarquia', 2], ['jerarquia', 4]],
    elegir: [['especiales', 1], ['especiales', 2], ['potencias10', 3], ['exponente', 3], ['raiz', 1], ['propiedades', 1], ['propiedades', 2], ['propiedades', 3]],
    nElegir: 4,
  },
  {
    id: 14,
    unidad: 1,
    titulo: { es: 'U1 · Semana 4 · Jerarquía de las operaciones y problemas', en: 'U1 · Week 4 · Order of operations and word problems' },
    estrella: [['jerarquia', 3], ['expresion', 1], ['expresion', 2], ['expresion', 3], ['raiz', 3], ['errores1', 1]],
    elegir: [['parentesis', 4], ['errores1', 2], ['errores1', 3], ['errores1', 4], ['jerarquia', 4], ['exponente', 3], ['division', 3], ['redondeo', 3]],
    nElegir: 4,
  },
];

export const PUNTOS_POR_EJERCICIO = 10;
/** Topes que impone el código de resultado de la tarea (10 y 15 bits). */
export const MAX_ESTRELLA = 10;
export const MAX_ELEGIR = 15;
export const MAX_ID_TAREA = 1023;

export function tareaPorId(id, tareas = TAREAS) {
  return tareas.find(t => t.id === id) ?? null;
}

/**
 * Las tareas que enseña la portada el día `hoy` ('AAAA-MM-DD', fecha local):
 * las que no tienen `desde` y las que ya han llegado a su día. Con `unidad`,
 * solo las de esa unidad.
 */
export function tareasPublicadas(hoy, tareas = TAREAS, unidad = null) {
  return tareas.filter(t => (!t.desde || t.desde <= hoy) && (unidad === null || t.unidad === unidad));
}

/** Número de día (contador.js: días desde el 1-9-2026) de una fecha 'AAAA-MM-DD'. */
export function diaDeFecha(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return diaDe(new Date(a, m - 1, d));
}

/**
 * Plazo y retraso de una tarea para un alumno (DISENO.md, B.1 y B.2). `estado` es
 * el de `estadoTarea`; `hoyDia` el día de hoy (contador.js); `asignadoAMi` si el
 * alumno está marcado en una tarea `asignada`. Días naturales; el plazo vale
 * hasta el final de `hasta`.
 *   tipo         'repaso' | 'obligatoria' | 'obligatoria_para_ti'
 *   entregada    la tarea está cumplida
 *   fueraDePlazo hay retraso (entregada después del plazo, o sin entregar y pasado)
 *   diasRetraso  entre el plazo y el día de entrega (o hoy, si no la ha entregado)
 */
export function estadoPlazo(tarea, estado, hoyDia, asignadoAMi = false) {
  const tipo = tarea.asignada ? (asignadoAMi ? 'obligatoria_para_ti' : 'repaso')
    : tarea.hasta ? 'obligatoria' : 'repaso';
  const entregada = Boolean(estado?.cumplida);
  const conPlazo = tipo !== 'repaso' && Boolean(tarea.hasta);
  const dia = entregada ? (estado.diaEntrega ?? 0) : hoyDia;
  const diasRetraso = conPlazo ? Math.max(0, dia - diaDeFecha(tarea.hasta)) : 0;
  return { tipo, entregada, fueraDePlazo: diasRetraso > 0, diasRetraso };
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
  const cumplida = estrellaHechos === estrella.length && elegirHechos >= tarea.nElegir;
  // Día en que se cumplió por primera vez: el mayor de (el último ★ terminado,
  // el nElegir-ésimo de elegir terminado por orden de día). 0 si no está cumplida.
  const dia = e => e.ej.dia ?? 0;
  const diasElegidos = elegir.filter(e => e.terminado).map(dia).sort((a, b) => a - b);
  const diaEntrega = cumplida
    ? Math.max(0, ...estrella.map(dia), tarea.nElegir > 0 ? diasElegidos[tarea.nElegir - 1] : 0)
    : 0;
  return {
    estrella,
    elegir,
    estrellaHechos,
    elegirHechos,
    cumplida,
    diaEntrega,
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
export function erroresTareas(tareas = TAREAS, { tareaUnoAntigua = true } = {}) {
  const errores = [];
  const ids = new Set();
  for (const t of tareas) {
    const nombre = `tarea ${t.id}`;
    if (!Number.isInteger(t.id) || t.id < 1 || t.id > MAX_ID_TAREA) errores.push(`${nombre}: el id tiene que ser un entero entre 1 y ${MAX_ID_TAREA}`);
    if (ids.has(t.id)) errores.push(`${nombre}: id repetido`);
    ids.add(t.id);
    if (typeof t.titulo?.es !== 'string' || typeof t.titulo?.en !== 'string') errores.push(`${nombre}: falta «titulo» como { es, en }`);
    if (t.desde !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(t.desde)) errores.push(`${nombre}: «desde» tiene que ser 'AAAA-MM-DD'`);
    if (!UNIDADES.some(u => u.n === t.unidad)) errores.push(`${nombre}: «unidad» tiene que ser una de ${UNIDADES.map(u => u.n).join(', ')}`);
    if (t.hasta !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(t.hasta)) errores.push(`${nombre}: «hasta» tiene que ser 'AAAA-MM-DD'`);
      else if (t.desde !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(t.desde) && t.hasta < t.desde) errores.push(`${nombre}: «hasta» no puede ser anterior a «desde»`);
    }
    if (t.asignada !== undefined && t.asignada !== true) errores.push(`${nombre}: «asignada» solo puede ser true o no estar`);
    if (!tareaUnoAntigua) {
      // Tareas del espacio de un profesor: la 1 es una tarea como las demás,
      // salvo en el espacio de Juan Luis, que la trajo del modo antiguo tal cual
      // (tarea 70: su progreso está en el de la práctica libre). Se puede llevar, no se exige.
      if (t.progresoPorPractica !== undefined && !(t.id === 1 && t.progresoPorPractica === true)) {
        errores.push(`${nombre}: «progresoPorPractica» solo existe en la tarea 1 que viene del sistema actual`);
      }
    } else {
      if (t.id === 1 && t.progresoPorPractica !== true) errores.push('tarea 1: tiene que llevar «progresoPorPractica: true» (conserva el modelo de la práctica libre)');
      if (t.id !== 1 && t.progresoPorPractica !== undefined) errores.push(`${nombre}: «progresoPorPractica» solo existe en la tarea 1`);
    }
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

// --- Configuración de un profesor (varios profesores, tarea 62) ---------------------
//
// Cada profesor guarda en su espacio (`config/tareas`) un objeto
// `{ unidades: [{ n, desde }], tareas: [...] }`: sus tareas, con los mismos campos
// que `TAREAS`, y solo las fechas de comienzo de las unidades (los títulos son
// comunes, en `UNIDADES`). Se guarda como texto JSON.

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const fechaValida = texto => {
  if (typeof texto !== 'string' || !FECHA.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
};

/**
 * La configuración que dice un texto JSON, o `null` si no es JSON o no tiene la
 * forma `{ unidades: [...], tareas: [...] }`. No comprueba el contenido: eso es
 * `erroresConfig`. Lleva `longitudCodigo: 4` solo si el profesor la eligió (sin
 * el campo, los códigos que genera son de 8).
 */
export function configDeJSON(texto) {
  let config;
  try { config = JSON.parse(texto); } catch { return null; }
  if (config === null || typeof config !== 'object' || !Array.isArray(config.unidades) || !Array.isArray(config.tareas)) return null;
  return { unidades: config.unidades, tareas: config.tareas, ...(longitudDeCodigos(config) === 4 && { longitudCodigo: 4 }) };
}

/**
 * Longitud de los códigos que genera el profesor en «Mis alumnos» (tarea 72):
 * 8 (por defecto, no se pueden adivinar probando) o 4 (más fáciles de recordar).
 * Solo vale para los que se generan: los ya repartidos no cambian.
 */
export const longitudDeCodigos = config => (config?.longitudCodigo === 4 ? 4 : 8);

/** El texto JSON que se guarda: `unidades` (n, desde), `tareas` y, si no es la de por defecto (8), `longitudCodigo`. */
export function configAJSON(config) {
  return JSON.stringify({
    unidades: (config?.unidades ?? []).map(u => ({ n: u.n, desde: u.desde })),
    tareas: config?.tareas ?? [],
    ...(longitudDeCodigos(config) === 4 && { longitudCodigo: 4 }),
  });
}

/**
 * Lo que está mal en una configuración, en frases (vacía si todo está bien):
 * lo de `erroresTareas` (con la tarea 1 como una más) y las fechas de unidad.
 */
export function erroresConfig(config) {
  if (config === null || typeof config !== 'object' || !Array.isArray(config.unidades) || !Array.isArray(config.tareas)) {
    return ['la configuración tiene que ser { unidades: [...], tareas: [...] }'];
  }
  const errores = [];
  const vistas = new Set();
  for (const u of config.unidades) {
    if (!UNIDADES.some(c => c.n === u?.n)) errores.push(`unidad ${u?.n}: no es una de ${UNIDADES.map(c => c.n).join(', ')}`);
    else if (vistas.has(u.n)) errores.push(`unidad ${u.n}: repetida`);
    else if (!fechaValida(u.desde)) errores.push(`unidad ${u.n}: «desde» tiene que ser una fecha 'AAAA-MM-DD'`);
    vistas.add(u?.n);
  }
  if (config.longitudCodigo !== undefined && config.longitudCodigo !== 4 && config.longitudCodigo !== 8) {
    errores.push('longitudCodigo: tiene que ser 4 u 8');
  }
  return [...errores, ...erroresTareas(config.tareas, { tareaUnoAntigua: false })];
}

/**
 * Lo que copia «Cargar la plantilla del curso»: las `TAREAS` y las fechas de
 * `UNIDADES` de hoy, sin el campo `progresoPorPractica` (solo lo lleva la tarea
 * 1 de Juan Luis, que viene del modo antiguo: en el espacio de un profesor nuevo
 * la tarea 1 es una más).
 */
export function configPlantilla() {
  const copia = JSON.parse(JSON.stringify(TAREAS));
  for (const t of copia) delete t.progresoPorPractica;
  return { unidades: UNIDADES.map(u => ({ n: u.n, desde: u.desde })), tareas: copia };
}
