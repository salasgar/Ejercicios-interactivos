// Base común de las prácticas de la unidad 2: todo lo que no es propio de una
// práctica. Entrada por código de alumno, menú de ejercicios con contador,
// feedback, código de resultado, guardado (navegador y Firestore) y ES/EN.
//
// Cada práctica llama a `arrancar(practica)` con sus ejercicios. El contrato
// está explicado, con un ejemplo que funciona, en `../plantilla/practica.js`.
//
// El progreso se guarda en el navegador (por código de alumno) y en la nube
// (Firestore, `practicas/{slug}--{código}`). Al entrar con el código se lee la
// nube y se fusiona con lo del navegador antes de subir nada (`nube.js`): así
// se sigue desde cualquier aparato. Si la nube falla no pasa nada: se sigue con
// lo del navegador, y el código de resultado lleva lo necesario para calificar.

import { practicaPorSlug } from './catalogo.js';
import { codigoAlumno, leerCodigoAlumno, codigoResultado } from './codigos.js';
import { ejercicioNuevo, anotar, queHaPasado, migrarProgreso, diaDe, OBJETIVO, PENALIZACION, VIDAS, RACHA, EXTRA } from './contador.js';
import { leerNube, escribirNube, subirFusionado, fusionarProgreso, canonico } from './nube.js';
import { datosFallo, registrarFallo, enviarPendientes } from './registro.js';
import { crearRng } from './rng.js';
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

/** Portada de las prácticas (`practicas/`), esté donde esté la práctica. */
export const URL_PORTADA = new URL('../', import.meta.url).href;

/** Página de una tarea de la semana, con el código del alumno si se sabe. */
export const urlSemana = (id, codigo = null) => `${URL_PORTADA}semana.html?t=${id}${codigo ? `&c=${codigo}` : ''}`;

/**
 * Lo que tiene guardado en este navegador un alumno en una práctica: la lista
 * de sus ejercicios tal como la guarda la base ({ puntos, objetivo, fallos,
 * terminado, dia… }), vacía si no ha hecho nada. En `divisores` se mira
 * también la clave de antes de la tarea 17 y, ejercicio a ejercicio, gana el
 * terminado (o el que tenga más fallos, si ninguno lo está).
 */
export function progresoGuardado(slug, codigo) {
  const claves = [claveProgreso(slug, codigo), ...(slug === 'divisores' ? [`divisores.v1.${codigo}`] : [])];
  const listas = claves.map(clave => {
    try {
      const ej = JSON.parse(leer(clave))?.ej;
      return Array.isArray(ej) ? ej : [];
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
 * resultado de `leerNube` (su `estado`).
 */
export async function sincronizarGuardado(slug, codigo, opciones = {}) {
  const lectura = await leerNube(slug, codigo, opciones);
  if (lectura.estado !== 'ok' && lectura.estado !== 'vacio') return lectura;
  if (lectura.estado === 'ok') adoptarIdioma(codigo, lectura.idioma);
  const local = progresoGuardado(slug, codigo);
  const fusion = fusionarProgreso(local, lectura.ej);
  if (!fusion.some(Boolean)) return lectura;
  if (canonico(fusion) !== canonico(local)) escribir(claveProgreso(slug, codigo), JSON.stringify({ ej: fusion }));
  if (canonico(fusion) !== canonico(lectura.ej)) await escribirNube(slug, codigo, fusion, leer(claveIdiomaFijo(codigo)) ?? 'alterno', opciones);
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

  const estado = {
    idiomaFijo: null,  // 'es' | 'en' | null (modo alterno); nunca lo elige el alumno
    codigo: null,      // código del alumno, o null si practica sin código
    indice: null,
    ej: nuevos(),
  };
  let actual = null;    // ejercicio en curso: { n, sesion, practica, item, idioma, respondido }
  let turno = 0;        // invalida los temporizadores y las respuestas al cambiar de pantalla
  let sinSubir = 0;

  // `?ejercicio=n` (empezando en 1) abre ese ejercicio en cuanto se sabe quién
  // es el alumno, en vez del menú. Con `&semana=<id>` además se viene de una
  // tarea de la semana: al salir del ejercicio o al terminarlo se vuelve a
  // ella, y no se enseña el código de resultado de la práctica (la tarea tiene
  // el suyo). Sin estos parámetros, todo es como siempre.
  const parametros = new URLSearchParams(location.search);
  const pedido = Number(parametros.get('ejercicio'));
  let ejercicioPedido = Number.isInteger(pedido) && pedido >= 1 && pedido <= defs.length ? pedido - 1 : null;
  const semana = ejercicioPedido !== null && /^\d{1,4}$/.test(parametros.get('semana') ?? '') ? Number(parametros.get('semana')) : null;

  /** Al salir de un ejercicio: a la tarea de la semana si se vino de ella; si no, al menú. */
  function salirDelEjercicio() {
    if (semana === null) return pintarMenu();
    turno++;
    location.replace(urlSemana(semana, estado.codigo));
  }
  const textoSalir = () => (semana === null ? t().salir : t().volver_semana);

  /** Tras entrar (con código o sin él): el ejercicio pedido en la URL, una sola vez, o el menú. */
  function pintarInicio() {
    if (ejercicioPedido === null) return pintarMenu();
    const n = ejercicioPedido;
    ejercicioPedido = null;
    abrirEjercicio(n);
  }

  const idiomaInterfaz = () => estado.idiomaFijo ?? 'es';
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
    let local = [];
    try {
      const guardado = JSON.parse(leer(claveProgreso(ficha.slug, estado.codigo)));
      if (Array.isArray(guardado?.ej)) local = guardado.ej;
    } catch { /* guardado ilegible: se empieza de cero */ }
    const fusion = remoto ? fusionarProgreso(local, remoto) : local;
    estado.ej = nuevos().map((nuevo, n) => migrarProgreso({ ...nuevo, ...fusion[n] }, params[n]));
  }

  function guardar() {
    if (estado.codigo) escribir(claveProgreso(ficha.slug, estado.codigo), JSON.stringify({ ej: estado.ej }));
  }

  // La nube. Nada se sube antes de haber intentado leerla al entrar (`nubeLeida`):
  // es lo que hacía que un aparato machacara lo que había subido otro. Las
  // subidas van en cola, una detrás de otra, y cada una vuelve a leer y fusiona.
  let nubeLeida = false;
  let ultimoRemoto = null;   // lo último que se supo de la nube (para subir sin poder leer)
  let colaSubidas = Promise.resolve();
  let ultimaLectura = 0;

  /** Copia del progreso en Firestore (documento `practicas/{slug}--{código}`), fusionada con lo que ya haya. */
  function subir() {
    sinSubir = 0;
    if (!estado.codigo || !nubeLeida) return;
    const [slug, codigo, ej, idioma] = [ficha.slug, estado.codigo, estado.ej.map(e => ({ ...e })), estado.idiomaFijo ?? 'alterno'];
    colaSubidas = colaSubidas
      .then(() => subirFusionado(slug, codigo, ej, idioma, { ultimo: ultimoRemoto }))
      .then(({ ej: enNube }) => { if (codigo === estado.codigo) ultimoRemoto = enNube; }, () => {});
  }

  /**
   * Lee la nube y la fusiona con lo del navegador (al entrar, y al volver a la
   * pestaña en el menú). Sube la fusión si la nube no la tenía. Sin red, sin
   * documento o sin permiso, se sigue con lo del navegador.
   */
  async function leerYFusionar() {
    const codigo = estado.codigo;
    const lectura = await leerNube(ficha.slug, codigo);
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
    if (lectura.estado === 'ok' ? canonico(estado.ej) !== canonico(lectura.ej) : lectura.estado === 'vacio' && empezado) subir();
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
      idiomas.innerHTML = (idiomaItem && !estado.idiomaFijo)
        ? `<span class="etiqueta-idioma" aria-hidden="true">${idiomaItem.toUpperCase()}</span>` : '';
    }
  }

  // --- Entrada --------------------------------------------------------------------

  function pintarEntrada(error = false) {
    turno++;
    actual = null;
    pintarCabecera();
    app.innerHTML = `
      <section class="entrada">
        <form class="tarjeta" id="form-codigo">
          <h2>${t().entrada_titulo}</h2>
          <p class="pequeno">${t().entrada_ayuda} ${t().entrada_aparatos}</p>
          <input id="codigo" type="text" class="codigo-entrada" maxlength="8" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="${t().entrada_titulo}" required>
          ${error ? `<div class="aviso aviso--error">${t().entrada_error}</div>` : ''}
          <button type="submit" class="ancho">${t().entrada_boton}</button>
        </form>
        <button type="button" id="probar" class="secundario ancho">${t().probar}</button>
        <p class="pequeno centrado">${t().probar_aviso}</p>
      </section>`;
    app.querySelector('#form-codigo').addEventListener('submit', ev => {
      ev.preventDefault();
      const indice = leerCodigoAlumno(app.querySelector('#codigo').value);
      if (indice === null) return pintarEntrada(true);
      entrar(indice);
    });
    app.querySelector('#probar').addEventListener('click', () => {
      estado.codigo = null;
      estado.indice = null;
      estado.ej = nuevos();
      aplicarIdiomaFijo();
      pintarInicio();
    });
  }

  /**
   * Entra con un código: lo del navegador al momento y, antes de enseñar nada,
   * lo de la nube fusionado (como mucho ESPERA_LECTURA; sin red, se sigue).
   */
  async function entrar(indice) {
    estado.indice = indice;
    estado.codigo = codigoAlumno(indice);
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

  // Al volver a esta pestaña en el menú (quizá después de practicar en otro
  // aparato), se vuelve a leer la nube; como mucho una vez cada 30 s.
  addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || !estado.codigo || !nubeLeida || actual !== null || Date.now() - ultimaLectura < 30000) return;
    const miTurno = turno;
    await leerYFusionar();
    if (miTurno === turno && actual === null && estado.codigo) pintarMenu();
  });

  // --- Menú -----------------------------------------------------------------------

  function cajaResultado() {
    const hechos = estado.ej.filter(e => e.terminado);
    if (estado.indice === null || !hechos.length || semana !== null) return '';
    const codigo = codigoResultado(ficha.id, estado.indice, estado.ej, Math.max(...hechos.map(e => e.dia)));
    const completo = hechos.length === defs.length;
    return `
      <div class="tarjeta resultado ${completo ? 'resultado--completo' : ''}">
        <h3>${t().resultado_titulo}</h3>
        <p class="pequeno">${completo ? t().resultado_completo(defs.length) : t().resultado_parcial(hechos.length, defs.length)}</p>
        <div class="resultado__fila">
          <output class="resultado__codigo" id="codigo-resultado">${codigo}</output>
          <button type="button" class="secundario" id="copiar">${t().copiar}</button>
        </div>
      </div>`;
  }

  function activarCopiar() {
    const boton = app.querySelector('#copiar');
    if (!boton) return;
    boton.addEventListener('click', async () => {
      const salida = app.querySelector('#codigo-resultado');
      try {
        await navigator.clipboard.writeText(salida.textContent);
        boton.textContent = t().copiado;
      } catch {
        // Sin permiso de portapapeles (o sin HTTPS): se deja seleccionado para copiarlo a mano.
        getSelection().selectAllChildren(salida);
      }
    });
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
          <button type="button" class="discreto" id="cambiar">${t().cambiar_codigo}${estado.codigo ? ` (${estado.codigo})` : ''}</button>
        </div>
      </section>`;
    app.querySelectorAll('[data-ejercicio]').forEach(b => b.addEventListener('click', () => abrirEjercicio(Number(b.dataset.ejercicio))));
    app.querySelector('#cambiar').addEventListener('click', () => {
      borrar('practicas.codigo');
      estado.codigo = null;
      estado.indice = null;
      nubeLeida = false;
      ultimoRemoto = null;
      pintarEntrada();
    });
    activarCopiar();
  }

  // --- Ejercicio ------------------------------------------------------------------

  function abrirEjercicio(n) {
    // Un ejercicio ya terminado se puede repetir para practicar, sin tocar lo guardado.
    const repeticion = estado.ej[n].terminado;
    actual = { n, practica: repeticion, sesion: repeticion ? ejercicioNuevo(params[n].objetivo, params[n].vidas) : estado.ej[n], item: null, idioma: null, respondido: false };
    if (defs[n].introduccion) pintarIntroduccion(); else siguiente();
  }

  function cabeceraEjercicio() {
    return `
      <button type="button" class="discreto volver" id="salir">${textoSalir()}</button>
      <div class="progreso"><span>${t().ejercicio(actual.n + 1)} · ${tt(defs[actual.n].nombre)}</span><span class="marcador"><strong id="puntos"></strong><span class="vidas" id="vidas"></span></span></div>
      <div class="barra"><div id="barra"></div></div>`;
  }

  /** Puntos sobre el objetivo, la barra y las vidas (♥ llenas y ♡ perdidas). */
  function pintarContador() {
    const s = actual.sesion;
    const total = params[actual.n].vidas;
    app.querySelector('#puntos').textContent = t().puntos(s.puntos, s.objetivo);
    app.querySelector('#barra').style.width = `${Math.round(100 * s.puntos / Math.max(1, s.objetivo))}%`;
    const vidas = app.querySelector('#vidas');
    vidas.textContent = '♥'.repeat(Math.max(0, Math.min(total, s.vidas))) + '♡'.repeat(Math.max(0, total - s.vidas));
    vidas.setAttribute('aria-label', t().vidas_quedan(s.vidas));
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
    actual.idioma = estado.idiomaFijo ?? idiomasDe[actual.n].siguiente();
    const sesion = { aciertos: actual.sesion.aciertos, fallos: actual.sesion.fallos, puntos: actual.sesion.puntos, vidas: actual.sesion.vidas, anterior, idioma: actual.idioma };
    let item = def.generar(rng, sesion);
    for (let i = 0; i < 5 && anterior !== null && clave(item) === clave(anterior); i++) item = def.generar(rng, sesion);
    actual.item = item;
    actual.respondido = false;
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
      idioma: idi,
      t: t(idi),
      tt: obj => tt(obj, idi),
      esc,
      respondido: () => miTurno !== turno || actual.respondido,
      responder: ({ acierto, html = '', espera = 1300, pistas = 0, error, respuesta }) => {
        if (miTurno !== turno || actual.respondido) return;
        registrar(Boolean(acierto), Math.max(0, Math.floor(pistas) || 0));
        mostrarFeedback(Boolean(acierto), html, espera);
        if (!acierto) anotarFallo({ html, error, respuesta });
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
   * Registra el fallo en la nube (colección `fallos`, ver registro.js), sin
   * esperar y sin que el alumno note nada. Sin código no se registra.
   */
  function anotarFallo({ html, error, respuesta }) {
    if (!estado.codigo) return;
    try {
      registrarFallo(datosFallo({
        codigo: estado.codigo, slug: ficha.slug, ejercicio: actual.n + 1, idioma: actual.idioma, item: actual.item,
        html, respuesta, error, t: Date.now(), dia: diaDe(new Date()), repeticion: actual.practica,
      }));
    } catch { /* el registro nunca molesta al alumno */ }
  }

  /** Vuelve a montar el mismo ítem, de solo lectura, en el otro idioma. */
  function pintarTraduccion(contenedor) {
    const otro = actual.idioma === 'es' ? 'en' : 'es';
    const apiSolo = { idioma: otro, t: t(otro), tt: obj => tt(obj, otro), esc, respondido: () => true, responder: () => {} };
    try { defs[actual.n].montar(contenedor, actual.item, apiSolo); } catch { /* es solo un apoyo visual */ }
  }

  function botonTraduccion() {
    if (estado.idiomaFijo) return '';
    const otro = actual.idioma === 'es' ? 'en' : 'es';
    return `<button type="button" class="discreto traducir" id="traducir">${TRADUCCION[otro]}</button><div class="traduccion" id="caja-traduccion" hidden></div>`;
  }

  function activarTraduccion() {
    const boton = app.querySelector('#traducir');
    if (!boton) return;
    const caja = app.querySelector('#caja-traduccion');
    boton.addEventListener('click', () => {
      caja.hidden = !caja.hidden;
      if (!caja.hidden && !caja.dataset.montada) {
        caja.dataset.montada = '1';
        pintarTraduccion(caja);
      }
    });
  }

  function mostrarFeedback(acierto, html, espera) {
    const idi = actual.idioma;
    const caja = app.querySelector('#feedback');
    const cambio = actual.cambio;
    if (acierto) {
      const racha = cambio.extra ? `<p class="racha">${t(idi).racha_extra(RACHA, cambio.ganados - 1)}</p>` : '';
      caja.innerHTML = `<div class="feedback feedback--bien"><strong>✓ ${t(idi).bien}</strong> ${html}${racha}</div>${botonTraduccion()}`;
      activarTraduccion();
      const miTurno = turno;
      setTimeout(() => { if (miTurno === turno) siguiente(); }, espera + (cambio.extra ? 900 : 0));
      return;
    }
    const vidas = cambio.reinicio
      ? `<p class="sin-vidas">${t(idi).sin_vidas}</p>`
      : `<p class="penalizacion">${t(idi).penalizacion(cambio.perdidos)} · ${t(idi).vidas_quedan(cambio.vidas)}</p><p class="animo">${rng.elegir(t(idi).animos)}</p>`;
    caja.innerHTML = `
      <div class="feedback feedback--mal"><strong>✗ ${t(idi).mal}</strong> ${html}${vidas}</div>
      ${botonTraduccion()}
      <button type="button" id="siguiente" class="ancho">${t(idi).siguiente}</button>`;
    activarTraduccion();
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
          <p>${t().ejercicio(n + 1)} · ${tt(defs[n].nombre)} · ${t().fin_resumen(sesion.puntos, sesion.fallos)}</p>
          ${sesion.reinicios ? `<p class="pequeno">${t().fin_reinicios(sesion.reinicios)}</p>` : ''}
          ${repeticion ? `<p class="pequeno">${t().fin_practica}</p>` : ''}
        </div>
        ${cajaResultado()}
        <button type="button" class="ancho" id="al-menu">${textoSalir()}</button>
      </section>`;
    app.querySelector('#al-menu').addEventListener('click', salirDelEjercicio);
    activarCopiar();
  }

  // --- Arranque ---------------------------------------------------------------------

  // Antes de saber el código (si lo hay) solo cuenta un `?idioma=` explícito;
  // `entrar()` lo recalcula en cuanto conoce al alumno, con lo guardado para él.
  estado.idiomaFijo = modoIdioma(location.search, null);
  pintarCabecera();
  // El código puede venir en el enlace (…/?c=ABCD) o estar recordado de otra práctica.
  const inicial = leerCodigoAlumno(new URLSearchParams(location.search).get('c') ?? leer('practicas.codigo') ?? '');
  if (inicial === null) pintarEntrada(); else entrar(inicial);
}
