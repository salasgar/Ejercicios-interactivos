// Base común de las prácticas de la unidad 2: todo lo que no es propio de una
// práctica. Entrada por código de alumno, menú de ejercicios con contador,
// feedback, código de resultado, guardado (navegador y Firestore) y ES/EN.
//
// Cada práctica llama a `arrancar(practica)` con sus ejercicios. El contrato
// está explicado, con un ejemplo que funciona, en `../plantilla/practica.js`.
//
// El progreso se guarda en el navegador (por código de alumno) y en la nube
// (Firestore, `{slug}--{código}` en el espacio de su profesor). Al entrar con el código se lee la
// nube y se fusiona con lo del navegador antes de subir nada (`nube.js`): así
// se sigue desde cualquier aparato. Si la nube falla no pasa nada: se sigue con
// lo del navegador, y el código de resultado lleva lo necesario para calificar.
//
// Abierta desde una tarea del modelo v2 (`?ejercicio=n&semana=<id>`, tarea sin
// `progresoPorPractica`), la base trabaja en el ÁMBITO DE LA TAREA (tarea 51,
// DISENO.md C.2): mismo formato, misma fusión y misma migración, pero con la
// clave `practicas.v1.{slug}.{código}.t{id}` y el documento
// `progreso-tareas/t{id}--{slug}--{código}`. Lo hecho en la tarea no sale en la
// práctica libre ni al revés. La tarea 1 se queda con el progreso de la práctica.
//
// Varios profesores (tareas 64 y 72, DISENO.md de la 57, B y F.2): la base
// pregunta al entrar de qué profesor es el código (`resolverCodigo`, espacio.js)
// y, si está registrado (4 u 8 caracteres), guarda el progreso, el de las tareas
// y los fallos en el ESPACIO de ese profesor (`practicas-espacios/{uid}/…`), con
// las tareas de su configuración. Un código que la nube no conoce no existe (desde
// la tarea 71 ya no hay modo antiguo). Las claves del navegador no cambian: el
// código ya distingue al alumno.

import { practicaPorSlug, adaptarProgreso } from './catalogo.js';
import { leerCodigoSecreto, formatoDeCodigo } from './codigos.js';
import { ejercicioNuevo, anotar, queHaPasado, migrarProgreso, diaDe, OBJETIVO, PENALIZACION, VIDAS, RACHA, EXTRA } from './contador.js';
import { resolverCodigo } from './espacio.js';
import {
  leerNube, escribirNube, subirFusionado, fusionarProgreso, canonico,
  idDocumentoPractica, idDocumentoTarea, claveProgresoTarea, coleccionEspacio,
} from './nube.js';
import { datosFallo, registrarFallo, enviarPendientes } from './registro.js';
import { crearRng } from './rng.js';
import { TAREAS, tareaPorId } from './tareas.js';
import { T, TRADUCCION, esc } from './textos.js';

const CAMPOS_TEXTO = ['nombre', 'detalle'];
const esBilingue = obj => typeof obj?.es === 'string' && typeof obj?.en === 'string';

/**
 * Comprueba que la práctica cumple el contrato y devuelve su entrada del
 * catálogo. Lanza un error que dice qué falta: es lo primero que ve quien
 * escribe una práctica nueva.
 */
export function validarPractica(practica) {
  const ficha = practicaPorSlug(practica?.slug);
  if (!ficha) throw new Error(`La práctica «${practica?.slug}» no está en practicas/_comun/catalogo.js`);
  if (practica.idioma !== undefined && practica.idioma !== 'es' && practica.idioma !== 'en') throw new Error(`«${ficha.slug}»: «idioma» tiene que ser 'es' o 'en' (o no ponerse)`);
  const ejercicios = practica.ejercicios;
  if (!Array.isArray(ejercicios) || ejercicios.length !== ficha.nEjercicios) {
    throw new Error(`La práctica «${ficha.slug}» tiene que declarar ${ficha.nEjercicios} ejercicios (catálogo) y declara ${ejercicios?.length ?? 0}`);
  }
  ejercicios.forEach((e, i) => {
    for (const campo of CAMPOS_TEXTO) {
      if (!esBilingue(e[campo])) throw new Error(`«${ficha.slug}», ejercicio ${i + 1}: falta «${campo}» como { es, en }`);
    }
    if (e.introduccion !== undefined && !esBilingue(e.introduccion)) throw new Error(`«${ficha.slug}», ejercicio ${i + 1}: «introduccion» tiene que ser { es, en }`);
    for (const fn of ['generar', 'montar']) {
      if (typeof e[fn] !== 'function') throw new Error(`«${ficha.slug}», ejercicio ${i + 1}: falta la función «${fn}»`);
    }
    if (e.enunciado !== undefined && typeof e.enunciado !== 'function') throw new Error(`«${ficha.slug}», ejercicio ${i + 1}: «enunciado» tiene que ser una función (item, { idioma, t, tt, esc })`);
    for (const viejo of ['inicial', 'maximo']) {
      if (e[viejo] !== undefined) throw new Error(`«${ficha.slug}», ejercicio ${i + 1}: «${viejo}» ya no existe; el contador es por puntos («objetivo», «penalizacion», «vidas»)`);
    }
    const p = parametrosDe(e);
    if (![p.objetivo, p.penalizacion, p.vidas].every(Number.isInteger) || p.objetivo < 1 || p.penalizacion < 0 || p.vidas < 1) {
      throw new Error(`«${ficha.slug}», ejercicio ${i + 1}: «objetivo», «penalizacion» y «vidas» tienen que ser enteros, con objetivo ≥ 1, penalizacion ≥ 0 y vidas ≥ 1`);
    }
  });
  return ficha;
}

/**
 * Parámetros del contador de un ejercicio, con sus valores por defecto:
 * llegar a 10 puntos, cada fallo quita 1 punto y una vida, y hay 5 vidas.
 */
export function parametrosDe(ejercicio) {
  return {
    objetivo: ejercicio.objetivo ?? OBJETIVO,
    penalizacion: ejercicio.penalizacion ?? PENALIZACION,
    vidas: ejercicio.vidas ?? VIDAS,
  };
}

/** Clave de `localStorage` y nombre del documento de Firestore de un alumno en una práctica. */
export const claveProgreso = (slug, codigo) => `practicas.v1.${slug}.${codigo}`;
export const documentoNube = (slug, codigo) => `${slug}--${codigo}`;
/** Clave del idioma fijado para un alumno (vacía de alumno a alumno). */
export const claveIdiomaFijo = codigo => `practicas.idioma_fijo.${codigo}`;

/**
 * En qué ámbito trabaja la base (DISENO.md, C.2). `semana` es el id de tarea del
 * enlace (`&semana=`) o null; `tarea`, esa tarea de `tareas.js` (null si no
 * existe); `n`, el ejercicio pedido (empezando en 1). Devuelve:
 *   tipo     'tarea': progreso propio de la tarea (v2, con el ejercicio dentro);
 *            'practica': el de la práctica libre (también la tarea 1).
 *   tareaId  la tarea a la que se apuntan los fallos, o null.
 *   semana   a qué tarea se vuelve al salir del ejercicio, o null (menú).
 * Si el ejercicio no está en una tarea v2 (enlace tocado a mano), se ignora
 * `semana`: práctica libre. Una tarea que no existe se trata como hasta ahora
 * (se vuelve a su página, que lo dice), sin ámbito propio ni fallos apuntados.
 */
export function ambitoDe(semana, tarea, slug, n) {
  if (semana === null || semana === undefined) return { tipo: 'practica', tareaId: null, semana: null };
  if (!tarea) return { tipo: 'practica', tareaId: null, semana };
  if (tarea.progresoPorPractica) return { tipo: 'practica', tareaId: tarea.id, semana };
  const dentro = [...tarea.estrella, ...tarea.elegir].some(([s, k]) => s === slug && k === n);
  return dentro ? { tipo: 'tarea', tareaId: tarea.id, semana } : { tipo: 'practica', tareaId: null, semana: null };
}

/**
 * Una tarea de la que solo se sabe el id (código sin la configuración de
 * su profesor: sin red al entrar): se supone que el ejercicio pedido está
 * dentro y que es del modelo v2, que es lo que enlaza la página de la tarea.
 */
export const tareaSupuesta = (id, slug, n) => ({ id, estrella: [[slug, n]], elegir: [] });

/**
 * Dónde se guarda el progreso de un alumno en una práctica: la clave del
 * navegador y la colección y el id del documento de la nube (lo que reciben
 * `leerNube`, `escribirNube` y `subirFusionado`). Sin `tareaId`, los de la
 * práctica libre (y de la tarea 1); con él, los de esa tarea (modelo v2).
 * La nube es la del espacio de su profesor (`profesor`, el uid):
 * `progreso-libre` y `progreso-tareas`. Sin profesor conocido (sin red al
 * entrar) no hay nube (`nube: null`): se guarda solo en el navegador hasta
 * saberlo.
 */
export function ubicacionProgreso(slug, codigo, tareaId = null, profesor = null) {
  const deTarea = tareaId !== null && tareaId !== undefined;
  const clave = deTarea ? claveProgresoTarea(slug, codigo, tareaId) : claveProgreso(slug, codigo);
  const id = deTarea ? idDocumentoTarea(tareaId, slug, codigo) : idDocumentoPractica(slug, codigo);
  if (!profesor) return { clave, nube: null };
  return { clave, nube: { coleccion: coleccionEspacio(profesor, deTarea ? 'progreso-tareas' : 'progreso-libre'), id } };
}

/**
 * El modo de idioma a partir del parámetro `?idioma=` de la URL y de lo
 * guardado para ese alumno: 'es' o 'en' lo fijan todo; `null` es el modo
 * alterno (por ítem, al azar). `?idioma=alterno` quita un fijado anterior.
 */
export function modoIdioma(busqueda, guardado) {
  const param = new URLSearchParams(busqueda).get('idioma');
  if (param === 'es' || param === 'en') return param;
  if (param === 'alterno') return null;
  return guardado === 'es' || guardado === 'en' ? guardado : null;
}

/**
 * Secuencia de idiomas equilibrada para el modo alterno: bloques de 4 (dos
 * `es` y dos `en`) barajados con `rng`. En cada bloque completo hay exactos
 * 2 de cada uno (en un ejercicio de 10 aciertos sin fallos, cerca de 5 y 5),
 * y nunca salen más de 4 iguales seguidos (como mucho los dos últimos de un
 * bloque y los dos primeros del siguiente).
 */
export function crearSecuenciaIdiomas(rng) {
  let bloque = [];
  return {
    siguiente() {
      if (!bloque.length) bloque = rng.barajar(['es', 'es', 'en', 'en']);
      return bloque.shift();
    },
  };
}

// --- Almacén del navegador (puede no estar: modo privado, bloqueado…) ---------

export function leer(clave) {
  try { return localStorage.getItem(clave); } catch { return null; }
}
export function escribir(clave, valor) {
  try { localStorage.setItem(clave, valor); } catch { /* sin almacén: se sigue sin guardar */ }
}
export function borrar(clave) {
  try { localStorage.removeItem(clave); } catch { /* nada */ }
}

/** La misma dirección sin el código del alumno (`?c=`), y sin `?` si no queda nada. */
export function sinCodigo(href) {
  const url = new URL(href);
  url.searchParams.delete('c');
  return url.href;
}

/**
 * Cierra la sesión en este navegador: olvida el código recordado y lo quita
 * de la dirección (si se quedara, al recargar volvería a entrar el anterior,
 * aunque el siguiente ya hubiera escrito el suyo). Lo hecho no se pierde:
 * sigue guardado con el código, aquí y en la nube.
 */
export function cerrarSesion() {
  borrar('practicas.codigo');
  try { history.replaceState(history.state, '', sinCodigo(location.href)); } catch { /* nada */ }
}

/** Portada de las prácticas (`practicas/`), esté donde esté la práctica. */
export const URL_PORTADA = new URL('../', import.meta.url).href;

/** Página de una tarea de la semana, con el código del alumno si se sabe. */
export const urlSemana = (id, codigo = null) => `${URL_PORTADA}semana.html?t=${id}${codigo ? `&c=${codigo}` : ''}`;

/**
 * Lo que tiene guardado en este navegador un alumno en una práctica: la lista
 * de sus ejercicios tal como la guarda la base ({ puntos, objetivo, fallos,
 * terminado, dia… }), vacía si no ha hecho nada. En `divisores` se mira
 * también la clave de antes de la tarea 17 y, ejercicio a ejercicio, gana el
 * terminado (o el que tenga más fallos, si ninguno lo está). Con `tareaId`, lo
 * que lleva dentro de esa tarea (modelo v2), sin mezclar la práctica libre.
 * Una lista guardada antes de quitar un ejercicio se adapta (`adaptarProgreso`).
 */
export function progresoGuardado(slug, codigo, tareaId = null) {
  const claves = tareaId !== null && tareaId !== undefined ? [ubicacionProgreso(slug, codigo, tareaId).clave]
    : [claveProgreso(slug, codigo), ...(slug === 'divisores' ? [`divisores.v1.${codigo}`] : [])];
  const listas = claves.map(clave => {
    try {
      const ej = JSON.parse(leer(clave))?.ej;
      return Array.isArray(ej) ? adaptarProgreso(slug, ej) : [];
    } catch { return []; }
  });
  const largo = Math.max(...listas.map(l => l.length));
  return Array.from({ length: largo }, (_, n) => listas.map(l => l[n]).filter(e => e && typeof e === 'object')
    .reduce((mejor, e) => (!mejor || (e.terminado && !mejor.terminado) || (!mejor.terminado && (e.fallos ?? 0) > (mejor.fallos ?? 0)) ? e : mejor), null));
}

// --- Progreso en la nube (ver nube.js) -------------------------------------------------

/**
 * Si en este navegador no hay nada dicho sobre el idioma del alumno y la nube
 * dice que lo tiene fijado ('es' o 'en'), se adopta: el alumno de dislexia con
 * su enlace `&idioma=es` sigue igual en otro aparato. `?idioma=alterno` deja
 * guardado 'alterno', que no se pisa.
 */
export function adoptarIdioma(codigo, idiomaNube) {
  if ((idiomaNube === 'es' || idiomaNube === 'en') && leer(claveIdiomaFijo(codigo)) === null) escribir(claveIdiomaFijo(codigo), idiomaNube);
}

/**
 * Pone de acuerdo el navegador y la nube para un alumno en una práctica, sin
 * conocer sus ejercicios (lo usa la página de la semana): lee el documento,
 * fusiona con lo guardado aquí, guarda la fusión en el navegador y la sube si
 * la nube no la tenía. Sin red o sin permiso, no toca nada. Devuelve el
 * resultado de `leerNube` (su `estado`). Con `opciones.tareaId`, el progreso de
 * esa tarea (modelo v2: su clave y su documento de `progreso-tareas`).
 * `opciones.profesor` es el uid del espacio del alumno (sin él no hay nube:
 * devuelve el estado 'error' sin preguntar a nadie).
 */
export async function sincronizarGuardado(slug, codigo, { tareaId = null, profesor = null, ...opciones } = {}) {
  const { clave, nube } = ubicacionProgreso(slug, codigo, tareaId, profesor);
  if (!nube) return { estado: 'error', ej: null, idioma: null };
  const lectura = await leerNube(slug, codigo, { ...opciones, ...nube });
  if (lectura.estado !== 'ok' && lectura.estado !== 'vacio') return lectura;
  if (lectura.estado === 'ok') adoptarIdioma(codigo, lectura.idioma);
  const local = progresoGuardado(slug, codigo, tareaId);
  const fusion = fusionarProgreso(local, lectura.ej);
  if (!fusion.some(Boolean)) return lectura;
  if (canonico(fusion) !== canonico(local)) escribir(clave, JSON.stringify({ ej: fusion }));
  if (lectura.adaptado || canonico(fusion) !== canonico(lectura.ej)) await escribirNube(slug, codigo, fusion, leer(claveIdiomaFijo(codigo)) ?? 'alterno', { ...opciones, ...nube });
  return lectura;
}

// --- Leer lo que declara una práctica sin arrancarla ---------------------------------

// La página de la semana necesita el nombre de cada ejercicio, que solo está en
// el `practica.js` de cada práctica. `declaracionDe` importa ese módulo con la
// base en modo «solo declarar»: su llamada a `arrancar` guarda la declaración y
// no pinta nada. Una vez puesto, el modo dura lo que la página.
let soloDeclarar = false;
const declaradas = new Map();

/**
 * La declaración ({ slug, ejercicios }) de una práctica del catálogo, o null si
 * su módulo no carga. `ficha` es su fila del catálogo.
 */
export async function declaracionDe(ficha) {
  soloDeclarar = true;
  if (!declaradas.has(ficha.slug)) {
    try { await import(new URL(`${ficha.ruta}practica.js`, URL_PORTADA).href); } catch { return null; }
  }
  return declaradas.get(ficha.slug) ?? null;
}

// --- La aplicación --------------------------------------------------------------

/** Arranca una práctica. Ver el contrato en `../plantilla/practica.js`. */
export function arrancar(practica) {
  if (soloDeclarar) {
    declaradas.set(practica?.slug, practica);
    return;
  }
  let app = document.querySelector('#app');
  if (!app) {
    // Página sin armazón: se pone el mismo que lleva `plantilla/index.html`.
    document.body.insertAdjacentHTML('afterbegin', `
      <header class="cabecera">
        <span class="cabecera__titulo" id="cabecera-titulo"></span>
        <div class="cabecera__usuario idiomas" id="idiomas" role="group" aria-label="Idioma / Language"></div>
      </header>
      <main id="app" class="app"></main>`);
    app = document.querySelector('#app');
  }

  let ficha;
  try {
    ficha = validarPractica(practica);
  } catch (e) {
    app.innerHTML = `<div class="aviso aviso--error">${esc(e.message)}</div>`;
    throw e;
  }

  const defs = practica.ejercicios;
  const params = defs.map(parametrosDe);
  const nuevos = () => params.map(p => ejercicioNuevo(p.objetivo, p.vidas));
  const rng = crearRng((Date.now() ^ Math.floor(Math.random() * 2 ** 32)) >>> 0);
  const idiomasDe = defs.map(() => crearSecuenciaIdiomas(rng));
  // Una práctica de un solo idioma (la de ortografía española) lo declara en
  // `idioma`: manda sobre el sorteo y sobre el idioma fijado del alumno.
  const idiomaPropio = practica.idioma ?? null;

  const estado = {
    idiomaFijo: null,  // 'es' | 'en' | null (modo alterno); nunca lo elige el alumno
    codigo: null,      // código del alumno, o null si practica sin código
    indice: null,
    espacio: null,     // código registrado (4 u 8): { profesor, n, config, sinConfig } de resolverCodigo; null si no se sabe
    ej: nuevos(),
  };
  let actual = null;    // ejercicio en curso: { n, sesion, practica, item, idioma, respondido }
  let turno = 0;        // invalida los temporizadores y las respuestas al cambiar de pantalla
  let sinSubir = 0;

  // `?ejercicio=n` (empezando en 1) abre ese ejercicio en cuanto se sabe quién
  // es el alumno, en vez del menú. Con `&semana=<id>` además se viene de una
  // tarea de la semana: al salir del ejercicio o al terminarlo se vuelve a
  // ella, y no se enseña el código de resultado de la práctica (la tarea tiene
  // el suyo). Sin estos parámetros, todo es como siempre. En una tarea v2 con
  // ese ejercicio dentro, además, el progreso es el de la tarea (`ambitoDe`).
  const parametros = new URLSearchParams(location.search);
  const pedido = Number(parametros.get('ejercicio'));
  let ejercicioPedido = Number.isInteger(pedido) && pedido >= 1 && pedido <= defs.length ? pedido - 1 : null;
  const semanaPedida = ejercicioPedido !== null && /^\d{1,4}$/.test(parametros.get('semana') ?? '') ? Number(parametros.get('semana')) : null;
  const indicePedido = ejercicioPedido;
  // El ámbito depende de las tareas del profesor del alumno: las de `tareas.js`
  // (la plantilla) sin código, las de su configuración con código. Se fija al
  // arrancar con las de `tareas.js` y otra vez al entrar (`fijarAmbito`).
  let ambito, semana, tareaDelProgreso, numTarea;
  /** `tareas`: la lista donde buscar la tarea del enlace; null si no se sabe (se supone, `tareaSupuesta`). */
  function fijarAmbito(tareas) {
    const tarea = semanaPedida === null ? null
      : tareas ? tareaPorId(semanaPedida, tareas) : tareaSupuesta(semanaPedida, ficha.slug, indicePedido + 1);
    ambito = ambitoDe(semanaPedida, tarea, ficha.slug, indicePedido + 1);
    semana = ambito.semana;
    tareaDelProgreso = ambito.tipo === 'tarea' ? ambito.tareaId : null;
    // `&num=k`: el número que tiene ese ejercicio en la lista de la tarea (1, 2…),
    // que es el que ve el alumno en la cabecera en vez del de la práctica.
    numTarea = semana !== null && /^\d{1,2}$/.test(parametros.get('num') ?? '') ? Number(parametros.get('num')) : null;
  }
  fijarAmbito(TAREAS);
  /** Clave del navegador y documento de la nube del alumno, en este ámbito y en el espacio de su profesor. */
  const ubicacion = () => ubicacionProgreso(ficha.slug, estado.codigo, tareaDelProgreso, estado.espacio?.profesor ?? null);
  /** El número que se enseña del ejercicio n (desde 0): el de la tarea si se vino de ella. */
  const numeroVisible = n => (numTarea !== null && n === indicePedido ? numTarea : n + 1);

  /** Al salir de un ejercicio: a la tarea de la semana si se vino de ella; si no, al menú. */
  function salirDelEjercicio() {
    if (semana === null) return pintarMenu();
    turno++;
    location.replace(urlSemana(semana, estado.codigo));
  }
  const textoSalir = idioma => (semana === null ? t(idioma).salir : t(idioma).volver_semana);

  /** Tras entrar (con código o sin él): el ejercicio pedido en la URL, una sola vez, o el menú. */
  function pintarInicio() {
    if (ejercicioPedido === null) return pintarMenu();
    const n = ejercicioPedido;
    ejercicioPedido = null;
    abrirEjercicio(n);
  }

  const idiomaInterfaz = () => idiomaPropio ?? estado.idiomaFijo ?? 'es';
  const t = (idioma = idiomaInterfaz()) => T[idioma];
  const tt = (obj, idioma = idiomaInterfaz()) => obj[idioma];

  /** Lee `?idioma=` y lo guardado para el alumno; persiste un cambio explícito. */
  function aplicarIdiomaFijo() {
    const param = new URLSearchParams(location.search).get('idioma');
    // 'alterno' se guarda (no se borra) para que la nube no vuelva a fijarlo (adoptarIdioma).
    if (estado.codigo && (param === 'es' || param === 'en' || param === 'alterno')) escribir(claveIdiomaFijo(estado.codigo), param);
    const guardado = estado.codigo ? leer(claveIdiomaFijo(estado.codigo)) : null;
    estado.idiomaFijo = modoIdioma(location.search, guardado);
  }

  /** El progreso guardado en este navegador, fusionado con el de la nube si se pasa (`remoto`). */
  function cargarProgreso(remoto = null) {
    let local = [], adaptado = false;
    try {
      const guardado = JSON.parse(leer(ubicacion().clave));
      if (Array.isArray(guardado?.ej)) {
        local = adaptarProgreso(ficha.slug, guardado.ej);
        adaptado = local !== guardado.ej;
      }
    } catch { /* guardado ilegible: se empieza de cero */ }
    const fusion = remoto ? fusionarProgreso(local, remoto) : local;
    estado.ej = nuevos().map((nuevo, n) => migrarProgreso({ ...nuevo, ...fusion[n] }, params[n]));
    // Una lista de antes de quitar un ejercicio se guarda ya con los de hoy.
    if (adaptado) guardar();
  }

  function guardar() {
    if (estado.codigo) escribir(ubicacion().clave, JSON.stringify({ ej: estado.ej }));
  }

  // La nube. Nada se sube antes de haber intentado leerla al entrar (`nubeLeida`):
  // es lo que hacía que un aparato machacara lo que había subido otro. Las
  // subidas van en cola, una detrás de otra, y cada una vuelve a leer y fusiona.
  let nubeLeida = false;
  let ultimoRemoto = null;   // lo último que se supo de la nube (para subir sin poder leer)
  let colaSubidas = Promise.resolve();
  let ultimaLectura = 0;

  /**
   * Copia del progreso en Firestore (documento `{slug}--{código}` del espacio, o
   * el de la tarea en su ámbito), fusionada con lo que ya haya.
   */
  function subir() {
    sinSubir = 0;
    if (!estado.codigo || !nubeLeida) return;
    const [slug, codigo, ej, idioma, { nube }] = [ficha.slug, estado.codigo, estado.ej.map(e => ({ ...e })), estado.idiomaFijo ?? 'alterno', ubicacion()];
    if (!nube) return;   // sin profesor conocido: solo en el navegador
    colaSubidas = colaSubidas
      .then(() => subirFusionado(slug, codigo, ej, idioma, { ultimo: ultimoRemoto, ...nube }))
      .then(({ ej: enNube }) => { if (codigo === estado.codigo) ultimoRemoto = enNube; }, () => {});
  }

  /**
   * Lee la nube y la fusiona con lo del navegador (al entrar, y al volver a la
   * pestaña en el menú). Sube la fusión si la nube no la tenía. Sin red, sin
   * documento o sin permiso, se sigue con lo del navegador.
   */
  async function leerYFusionar() {
    const codigo = estado.codigo;
    const { nube } = ubicacion();
    if (!nube) {
      // Código sin profesor conocido (sin red al entrar): lo del navegador,
      // sin subir nada hasta saber a qué espacio va (`nubeLeida` se queda en false).
      cargarProgreso();
      return;
    }
    const lectura = await leerNube(ficha.slug, codigo, nube);
    ultimaLectura = Date.now();
    if (codigo !== estado.codigo) return;   // ha cambiado de código mientras tanto
    nubeLeida = true;
    if (lectura.estado === 'ok') {
      ultimoRemoto = lectura.ej;
      adoptarIdioma(codigo, lectura.idioma);
      aplicarIdiomaFijo();
      cargarProgreso(lectura.ej);
      guardar();
    } else {
      cargarProgreso();
    }
    // Se sube si la nube no tiene lo de este navegador (o si aún no hay documento).
    const empezado = estado.ej.some(e => e.terminado || e.aciertos + e.fallos > 0);
    if (lectura.estado === 'ok' ? lectura.adaptado || canonico(estado.ej) !== canonico(lectura.ej) : lectura.estado === 'vacio' && empezado) subir();
  }

  // --- Cabecera: título y, durante un ítem, su idioma ----------------------------

  /**
   * `idiomaItem` solo se pasa mientras se ve un ítem (null en el resto de
   * pantallas): ahí, si el idioma no está fijado, se enseña una etiqueta no
   * pulsable con el idioma de ese ítem. El alumno no elige idioma en ningún
   * sitio: lo decide la base (alterno) o el enlace del profesor (fijo).
   */
  function pintarCabecera(idiomaItem = null) {
    const idi = idiomaItem ?? idiomaInterfaz();
    document.documentElement.lang = idi;
    document.title = tt(ficha.nombre, idi);
    const titulo = document.querySelector('#cabecera-titulo');
    if (titulo) titulo.textContent = tt(ficha.nombre, idi);
    const idiomas = document.querySelector('#idiomas');
    if (idiomas) {
      idiomas.innerHTML = (idiomaItem && !estado.idiomaFijo && !idiomaPropio)
        ? `<span class="etiqueta-idioma" aria-hidden="true">${idiomaItem.toUpperCase()}</span>` : '';
    }
  }

  // --- Entrada --------------------------------------------------------------------

  /** `error`: 'formato' (no es un código), 'no-existe' (código que la nube no conoce) o nada. */
  function pintarEntrada(error = null) {
    turno++;
    actual = null;
    pintarCabecera();
    const aviso = error === 'no-existe' ? t().entrada_no_existe : error ? t().entrada_error : '';
    app.innerHTML = `
      <section class="entrada">
        <form class="tarjeta" id="form-codigo">
          <h2>${t().entrada_titulo}</h2>
          <p class="pequeno">${t().entrada_ayuda} ${t().entrada_aparatos}</p>
          <input id="codigo" type="text" class="codigo-entrada" maxlength="12" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="${t().entrada_titulo}" required>
          ${aviso ? `<div class="aviso aviso--error">${aviso}</div>` : ''}
          <button type="submit" class="ancho">${t().entrada_boton}</button>
        </form>
        <button type="button" id="probar" class="secundario ancho">${t().probar}</button>
        <p class="pequeno centrado">${t().probar_aviso}</p>
      </section>`;
    app.querySelector('#form-codigo').addEventListener('submit', ev => {
      ev.preventDefault();
      const texto = app.querySelector('#codigo').value;
      if (formatoDeCodigo(texto) === null) return pintarEntrada('formato');
      entrar(texto);
    });
    app.querySelector('#probar').addEventListener('click', () => {
      estado.codigo = null;
      estado.indice = null;
      estado.espacio = null;
      fijarAmbito(TAREAS);
      estado.ej = nuevos();
      aplicarIdiomaFijo();
      pintarInicio();
    });
  }

  /**
   * Entra con un código (tecleado, del enlace o recordado): lo del navegador al
   * momento y, antes de enseñar nada, lo de la nube fusionado (como mucho
   * ESPERA_LECTURA; sin red, se sigue). Antes se pregunta de qué profesor es
   * (`resolverCodigo`): si la nube no conoce el código, vuelve a la entrada con
   * el aviso; sin red y sin copia en el navegador, se practica igual y solo
   * se guarda aquí (sube al volver la red: al entrar otra vez o al volver a la pestaña).
   */
  async function entrar(texto) {
    if (formatoDeCodigo(texto) === null) return pintarEntrada('formato');
    turno++;
    actual = null;
    app.innerHTML = `<p class="vacio">${t().cargando_progreso}</p>`;
    const turnoResolver = turno;
    const resuelto = await resolverCodigo(texto);
    if (turnoResolver !== turno) return;
    if (resuelto.error === 'no-valido') return pintarEntrada('formato');
    if (resuelto.error === 'no-existe') {
      // Ni recordado ni en la dirección: al recargar no tiene que volver a intentarlo.
      if (leerCodigoSecreto(leer('practicas.codigo') ?? '') === leerCodigoSecreto(texto)) borrar('practicas.codigo');
      try { history.replaceState(history.state, '', sinCodigo(location.href)); } catch { /* nada */ }
      estado.codigo = null;
      estado.indice = null;
      estado.espacio = null;
      return pintarEntrada('no-existe');
    }
    estado.espacio = resuelto.error ? null : espacioDe(resuelto);   // 'sin-red': aún no se sabe
    estado.codigo = leerCodigoSecreto(texto);
    estado.indice = estado.espacio?.n ?? null;
    // `config?.`: una respuesta sin configuración (copia vieja o corrupta del navegador) no puede
    // dejar la práctica en «Cargando…» (hallazgo de la tarea 97, 2026-10-25): se trata como sin config.
    fijarAmbito(estado.espacio && !estado.espacio.sinConfig ? (estado.espacio.config?.tareas ?? null) : null);
    escribir('practicas.codigo', estado.codigo);
    aplicarIdiomaFijo();
    cargarProgreso();
    nubeLeida = false;
    ultimoRemoto = null;
    turno++;
    actual = null;
    pintarCabecera();
    app.innerHTML = `<p class="vacio">${t().cargando_progreso}</p>`;
    const miTurno = turno;
    await leerYFusionar();
    if (miTurno === turno) pintarInicio();
    enviarPendientes();   // fallos que no llegaron a la nube la última vez (registro.js)
  }

  /** Lo que se guarda de un código resuelto. */
  const espacioDe = r => ({
    profesor: r.profesor,
    n: r.n,
    config: r.config ?? { unidades: [], tareas: [] },
    sinConfig: Boolean(r.sinConfig) || !r.config,   // sin configuración legible, el ámbito es el supuesto
  });

  /**
   * Código cuyo profesor no se supo al entrar (sin red): se vuelve a
   * preguntar. Si ahora se sabe, el progreso ya tiene adónde subir. El ámbito
   * no cambia (se queda el supuesto, para no cambiar de clave a mitad).
   */
  async function reintentarEspacio() {
    const codigo = estado.codigo;
    const resuelto = await resolverCodigo(codigo);
    if (codigo !== estado.codigo || resuelto.error) return false;
    estado.espacio = espacioDe(resuelto);
    estado.indice = resuelto.n;
    return true;
  }

  // Al volver a esta pestaña en el menú (quizá después de practicar en otro
  // aparato), se vuelve a leer la nube; como mucho una vez cada 30 s. Con un
  // código sin profesor conocido, antes se vuelve a preguntar de quién es,
  // y si ya se sabe se sube lo hecho y los fallos que esperaban.
  addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || !estado.codigo || actual !== null || Date.now() - ultimaLectura < 30000) return;
    const miTurno = turno;
    const sinEspacio = !ubicacion().nube;
    if (sinEspacio) {
      ultimaLectura = Date.now();
      if (!(await reintentarEspacio()) || miTurno !== turno) return;
    } else if (!nubeLeida) return;
    await leerYFusionar();
    if (miTurno === turno && actual === null && estado.codigo) pintarMenu();
    if (sinEspacio) enviarPendientes();
  });

  // --- Menú -----------------------------------------------------------------------

  /** Cuando están todos los ejercicios terminados, la frase de que el profesor ya lo ve (en la nube). */
  function cajaResultado() {
    if (estado.indice === null || semana !== null || !estado.ej.every(e => e.terminado)) return '';
    return `<div class="resultado-discreto"><p class="pequeno resultado-discreto__fin">${t().resultado_completo(defs.length)}</p></div>`;
  }

  /** La frase del menú que explica el contador, según lo que declaren los ejercicios. */
  function htmlRegla() {
    const p = params[0];
    const iguales = params.every(q => Object.keys(p).every(c => q[c] === p[c]));
    return iguales ? t().menu_regla(p.objetivo, p.penalizacion, p.vidas, RACHA, EXTRA) : t().menu_regla_varia(RACHA, EXTRA);
  }

  function pintarMenu() {
    turno++;
    actual = null;
    pintarCabecera();
    const regla = htmlRegla();
    const varia = regla === t().menu_regla_varia(RACHA, EXTRA);
    const filas = defs.map((def, n) => {
      const e = estado.ej[n];
      const empezado = e.aciertos + e.fallos > 0;
      const etiqueta = e.terminado
        ? `<span class="etiqueta etiqueta--ok">✓ ${t().hecho} · ${t().fallos(e.fallos)}</span>`
        : empezado ? `<span class="etiqueta">${t().puntos(e.puntos, e.objetivo)}</span>`
          : varia ? `<span class="etiqueta">${t().regla_fila(params[n].objetivo, params[n].penalizacion, params[n].vidas)}</span>` : '';
      const boton = e.terminado ? t().repetir : empezado ? t().seguir : t().empezar;
      return `
        <li class="lista__item">
          <div><h3>${t().ejercicio(n + 1)} · ${tt(def.nombre)}</h3><div class="detalle">${tt(def.detalle)}</div>${etiqueta}</div>
          <button type="button" data-ejercicio="${n}" class="${e.terminado ? 'secundario' : ''}">${boton}</button>
        </li>`;
    }).join('');
    app.innerHTML = `
      <section>
        <h2>${t().menu_titulo}</h2>
        <p>${regla}</p>
        ${estado.codigo ? '' : `<div class="aviso">${t().sin_codigo}</div>`}
        <ul class="lista">${filas}</ul>
        ${cajaResultado()}
        <div class="pie-menu">
          <a class="enlace-portada" href="${URL_PORTADA}${estado.codigo ? `?c=${estado.codigo}` : ''}">${t().todas}</a>
          <button type="button" class="discreto" id="cambiar">${estado.codigo ? `${t().cambiar_codigo} (${estado.codigo})` : t().entrar_codigo}</button>
        </div>
      </section>`;
    app.querySelectorAll('[data-ejercicio]').forEach(b => b.addEventListener('click', () => abrirEjercicio(Number(b.dataset.ejercicio))));
    app.querySelector('#cambiar').addEventListener('click', () => {
      cerrarSesion();
      estado.codigo = null;
      estado.indice = null;
      estado.espacio = null;
      nubeLeida = false;
      ultimoRemoto = null;
      pintarEntrada();
    });
  }

  // --- Ejercicio ------------------------------------------------------------------

  function abrirEjercicio(n) {
    // Un ejercicio ya terminado se puede repetir para practicar, sin tocar lo guardado.
    const repeticion = estado.ej[n].terminado;
    actual = { n, practica: repeticion, sesion: repeticion ? ejercicioNuevo(params[n].objetivo, params[n].vidas) : estado.ej[n], item: null, idioma: null, respondido: false };
    if (defs[n].introduccion) pintarIntroduccion(); else siguiente();
  }

  /** Idioma de la barra: el del ítem que se ve; en la introducción (sin ítem), el de la interfaz. */
  const idiomaBarra = () => actual.idioma ?? idiomaInterfaz();

  function cabeceraEjercicio() {
    const idi = idiomaBarra();
    return `
      <button type="button" class="discreto volver" id="salir">${textoSalir(idi)}</button>
      <div class="progreso"><span>${t(idi).ejercicio(numeroVisible(actual.n))} · ${tt(defs[actual.n].nombre, idi)}</span><span class="marcador"><strong id="puntos"></strong><span class="vidas" id="vidas"></span></span></div>
      <div class="barra"><div id="barra"></div></div>`;
  }

  /** Puntos sobre el objetivo, la barra y las vidas (♥ llenas y ♡ perdidas). */
  function pintarContador() {
    const s = actual.sesion;
    const total = params[actual.n].vidas;
    const idi = idiomaBarra();
    app.querySelector('#puntos').textContent = t(idi).puntos(s.puntos, s.objetivo);
    app.querySelector('#barra').style.width = `${Math.round(100 * s.puntos / Math.max(1, s.objetivo))}%`;
    const vidas = app.querySelector('#vidas');
    vidas.textContent = '♥'.repeat(Math.max(0, Math.min(total, s.vidas))) + '♡'.repeat(Math.max(0, total - s.vidas));
    vidas.setAttribute('aria-label', t(idi).vidas_quedan(s.vidas));
  }

  function pintarIntroduccion() {
    turno++;
    pintarCabecera();
    app.innerHTML = `
      <section>
        ${cabeceraEjercicio()}
        <div class="tarjeta introduccion">
          ${tt(defs[actual.n].introduccion)}
          <button type="button" class="ancho" id="empezar">${t().empezar}</button>
        </div>
      </section>`;
    pintarContador();
    app.querySelector('#salir').addEventListener('click', salirDelEjercicio);
    app.querySelector('#empezar').addEventListener('click', siguiente);
  }

  function siguiente() {
    turno++;
    if (actual.sesion.terminado) return pintarFin();
    const def = defs[actual.n];
    const clave = def.clave ?? JSON.stringify;
    const anterior = actual.item;
    // El idioma del ítem se fija antes de generarlo (y no al mostrarlo): un
    // recargado de la pantalla (por ejemplo tras la traducción) no lo cambia,
    // y `generar` lo recibe en `sesion.idioma` por si tiene ítems de un solo idioma.
    actual.idioma = idiomaPropio ?? estado.idiomaFijo ?? idiomasDe[actual.n].siguiente();
    const sesion = { aciertos: actual.sesion.aciertos, fallos: actual.sesion.fallos, puntos: actual.sesion.puntos, vidas: actual.sesion.vidas, anterior, idioma: actual.idioma };
    let item = def.generar(rng, sesion);
    for (let i = 0; i < 5 && anterior !== null && clave(item) === clave(anterior); i++) item = def.generar(rng, sesion);
    actual.item = item;
    actual.respondido = false;
    actual.feedback = null;
    pintarEjercicio();
  }

  function pintarEjercicio() {
    pintarCabecera(actual.idioma);
    app.innerHTML = `
      <section>
        ${cabeceraEjercicio()}
        <div class="tarjeta ejercicio">
          <div id="item"></div>
          <div id="feedback" aria-live="polite"></div>
        </div>
      </section>`;
    pintarContador();
    app.querySelector('#salir').addEventListener('click', salirDelEjercicio);

    const miTurno = turno;
    const idi = actual.idioma;
    const api = {
      ...textosDe(idi),
      respondido: () => miTurno !== turno || actual.respondido,
      responder: ({ acierto, html = '', espera = 1300, pistas = 0, error, respuesta }) => {
        if (miTurno !== turno || actual.respondido) return;
        // `html` puede ser una función de los textos de un idioma: entonces el
        // feedback se puede traducir (botón «See in English» / «Ver en español»).
        actual.feedback = typeof html === 'function' ? html : null;
        const texto = actual.feedback ? actual.feedback(textosDe(idi)) : html;
        registrar(Boolean(acierto), Math.max(0, Math.floor(pistas) || 0));
        mostrarFeedback(Boolean(acierto), texto, espera);
        if (!acierto) anotarFallo({ html: texto, error, respuesta });
      },
    };
    try {
      defs[actual.n].montar(app.querySelector('#item'), actual.item, api);
    } catch (e) {
      // Un fallo de la práctica no debe dejar al alumno atascado ni penalizarle.
      console.error(e);
      actual.respondido = true;
      app.querySelector('#item').innerHTML = '';
      app.querySelector('#feedback').innerHTML = `<div class="aviso aviso--error">${t(idi).error_item}</div><button type="button" id="siguiente" class="ancho">${t(idi).siguiente}</button>`;
      app.querySelector('#siguiente').addEventListener('click', siguiente);
    }
  }

  /** Anota la respuesta en el contador y lo guarda. */
  function registrar(acierto, pistas) {
    const p = params[actual.n];
    actual.respondido = true;
    const antes = actual.sesion;
    actual.sesion = anotar(actual.sesion, acierto, diaDe(new Date()), { penalizacion: p.penalizacion, vidas: p.vidas, pistas });
    // Para saber cuánto se ha hecho en inglés (no entra en el código de resultado).
    if (actual.idioma === 'en') {
      actual.sesion.en_aciertos = (actual.sesion.en_aciertos ?? 0) + (acierto ? 1 : 0);
      actual.sesion.en_fallos = (actual.sesion.en_fallos ?? 0) + (acierto ? 0 : 1);
    }
    if (actual.practica) {
      if (actual.sesion.terminado) { estado.ej[actual.n].repeticiones++; guardar(); subir(); }
    } else {
      estado.ej[actual.n] = actual.sesion;
      guardar();
      if (actual.sesion.terminado || ++sinSubir >= 5) subir();
    }
    actual.cambio = queHaPasado(antes, actual.sesion);
    pintarContador();
  }

  /**
   * Registra el fallo en la nube (la colección `fallos` del espacio del
   * profesor; ver registro.js), sin esperar y sin que el
   * alumno note nada. Sin código no se registra.
   */
  function anotarFallo({ html, error, respuesta }) {
    if (!estado.codigo) return;
    try {
      registrarFallo(datosFallo({
        codigo: estado.codigo, slug: ficha.slug, ejercicio: actual.n + 1, idioma: actual.idioma, item: actual.item,
        html, respuesta, error, t: Date.now(), dia: diaDe(new Date()), repeticion: actual.practica, tarea: ambito.tareaId,
      }), { profesor: estado.espacio?.profesor ?? null });
    } catch { /* el registro nunca molesta al alumno */ }
  }

  /** Lo que reciben `montar` (dentro de `api`), `enunciado` y el feedback traducible. */
  function textosDe(idi) {
    return { idioma: idi, t: t(idi), tt: obj => tt(obj, idi), esc };
  }

  /**
   * Botón «See in English» / «Ver en español» y su caja (cerrada). Solo si la
   * práctica da el feedback como función: sin él, la traducción no aporta.
   */
  function botonTraduccion() {
    if (idiomaPropio || estado.idiomaFijo || !actual.feedback) return '';
    const otro = actual.idioma === 'es' ? 'en' : 'es';
    return `<button type="button" class="discreto traducir" id="traducir">${TRADUCCION[otro]}</button><div class="traduccion" id="caja-traduccion" lang="${otro}" hidden></div>`;
  }

  /**
   * Abre y cierra la traducción: el enunciado (si la práctica lo da) y el
   * feedback en el otro idioma. `tarjeta(idioma, html)` es el feedback entero.
   * `alAbrir` se llama la primera vez que se abre.
   */
  function activarTraduccion(tarjeta, alAbrir) {
    const boton = app.querySelector('#traducir');
    if (!boton) return;
    const caja = app.querySelector('#caja-traduccion');
    const otro = actual.idioma === 'es' ? 'en' : 'es';
    const { item, feedback, n } = actual;
    boton.addEventListener('click', () => {
      caja.hidden = !caja.hidden;
      if (caja.hidden || caja.dataset.montada) return;
      caja.dataset.montada = '1';
      let enunciado = '';
      try { enunciado = defs[n].enunciado?.(item, textosDe(otro)) ?? ''; } catch (e) { console.error(e); }
      let html = '';
      try { html = feedback(textosDe(otro)); } catch (e) { console.error(e); }
      caja.innerHTML = `${enunciado}${tarjeta(otro, html)}`;
      alAbrir?.();
    });
  }

  function mostrarFeedback(acierto, html, espera) {
    const idi = actual.idioma;
    const caja = app.querySelector('#feedback');
    const cambio = actual.cambio;
    if (acierto) {
      const tarjeta = (i, texto) => {
        const racha = cambio.extra ? `<p class="racha">${t(i).racha_extra(RACHA, cambio.ganados - 1)}</p>` : '';
        return `<div class="feedback feedback--bien"><strong>✓ ${t(i).bien}</strong> ${texto}${racha}</div>`;
      };
      caja.innerHTML = `${tarjeta(idi, html)}${botonTraduccion()}`;
      const miTurno = turno;
      const temporizador = setTimeout(() => { if (miTurno === turno) siguiente(); }, espera + (cambio.extra ? 900 : 0));
      // Si abre la traducción, no se pasa solo al siguiente: le damos tiempo a leerla.
      activarTraduccion(tarjeta, () => {
        clearTimeout(temporizador);
        caja.insertAdjacentHTML('beforeend', `<button type="button" id="siguiente" class="ancho">${t(idi).siguiente}</button>`);
        caja.querySelector('#siguiente').addEventListener('click', siguiente);
      });
      return;
    }
    // El mismo ánimo en los dos idiomas (las listas son paralelas).
    const animo = rng.elegir(t(idi).animos.map((_, i) => i));
    const tarjeta = (i, texto) => {
      const vidas = cambio.reinicio
        ? `<p class="sin-vidas">${t(i).sin_vidas}</p>`
        : `<p class="penalizacion">${t(i).penalizacion(cambio.perdidos)} · ${t(i).vidas_quedan(cambio.vidas)}</p><p class="animo">${t(i).animos[animo % t(i).animos.length]}</p>`;
      return `<div class="feedback feedback--mal"><strong>✗ ${t(i).mal}</strong> ${texto}${vidas}</div>`;
    };
    caja.innerHTML = `
      ${tarjeta(idi, html)}
      ${botonTraduccion()}
      <button type="button" id="siguiente" class="ancho">${t(idi).siguiente}</button>`;
    activarTraduccion(tarjeta);
    const boton = app.querySelector('#siguiente');
    boton.addEventListener('click', siguiente);
    boton.focus({ preventScroll: true });
    boton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // --- Fin de un ejercicio ----------------------------------------------------------

  function pintarFin() {
    pintarCabecera();
    const { sesion, practica: repeticion, n } = actual;
    app.innerHTML = `
      <section>
        <div class="tarjeta fin">
          <div class="fin__icono" aria-hidden="true">🎉</div>
          <h2>${t().fin_titulo}</h2>
          <p>${t().ejercicio(numeroVisible(n))} · ${tt(defs[n].nombre)} · ${t().fin_resumen(sesion.puntos, sesion.fallos)}</p>
          ${sesion.reinicios ? `<p class="pequeno">${t().fin_reinicios(sesion.reinicios)}</p>` : ''}
          ${repeticion ? `<p class="pequeno">${t().fin_practica}</p>` : ''}
        </div>
        ${cajaResultado()}
        <button type="button" class="ancho" id="al-menu">${textoSalir()}</button>
      </section>`;
    app.querySelector('#al-menu').addEventListener('click', salirDelEjercicio);
  }

  // --- Arranque ---------------------------------------------------------------------

  // Antes de saber el código (si lo hay) solo cuenta un `?idioma=` explícito;
  // `entrar()` lo recalcula en cuanto conoce al alumno, con lo guardado para él.
  estado.idiomaFijo = modoIdioma(location.search, null);
  pintarCabecera();
  // El código puede venir en el enlace (…/?c=ABCD o ?c=K7QMP3XA) o estar recordado de otra práctica.
  const inicial = new URLSearchParams(location.search).get('c') ?? leer('practicas.codigo') ?? '';
  if (formatoDeCodigo(inicial) === null) pintarEntrada(); else entrar(inicial);
}
