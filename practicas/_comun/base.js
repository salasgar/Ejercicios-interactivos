// Base común de las prácticas de la unidad 2: todo lo que no es propio de una
// práctica. Entrada por código de alumno, menú de ejercicios con contador,
// feedback, código de resultado, guardado (navegador y Firestore) y ES/EN.
//
// Cada práctica llama a `arrancar(practica)` con sus ejercicios. El contrato
// está explicado, con un ejemplo que funciona, en `../plantilla/practica.js`.
//
// El progreso se guarda en el navegador (por código de alumno) y, si las
// reglas de Firestore lo permiten, también en la nube. Si la nube falla no
// pasa nada: el código de resultado lleva lo necesario para calificar.

import { firebaseConfig } from '../../src/config.js';
import { practicaPorSlug } from './catalogo.js';
import { codigoAlumno, leerCodigoAlumno, codigoResultado } from './codigos.js';
import { ejercicioNuevo, anotar, diaDe, INICIAL, PENALIZACION, MAXIMO } from './contador.js';
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
    const p = parametrosDe(e);
    if (![p.inicial, p.penalizacion, p.maximo].every(Number.isInteger) || p.inicial < 1 || p.penalizacion < 0 || p.maximo < p.inicial) {
      throw new Error(`«${ficha.slug}», ejercicio ${i + 1}: «inicial», «penalizacion» y «maximo» tienen que ser enteros, con 1 ≤ inicial ≤ maximo`);
    }
  });
  return ficha;
}

/**
 * Parámetros del contador de un ejercicio, con sus valores por defecto:
 * 10 aciertos, +2 por fallo y nunca más de 20 pendientes.
 */
export function parametrosDe(ejercicio) {
  return {
    inicial: ejercicio.inicial ?? INICIAL,
    penalizacion: ejercicio.penalizacion ?? PENALIZACION,
    maximo: ejercicio.maximo ?? MAXIMO,
  };
}

/** Clave de `localStorage` y nombre del documento de Firestore de un alumno en una práctica. */
export const claveProgreso = (slug, codigo) => `practicas.v1.${slug}.${codigo}`;
export const documentoNube = (slug, codigo) => `${slug}--${codigo}`;
/** Clave del idioma fijado para un alumno (vacía de alumno a alumno). */
export const claveIdiomaFijo = codigo => `practicas.idioma_fijo.${codigo}`;

/**
 * Encaja un progreso guardado con una versión anterior de los parámetros del
 * contador (por ejemplo, el cambio de 20 a 10 aciertos): sin esto, un alumno
 * con muchas `pendientes` de antes se queda con un ejercicio imposible de
 * terminar o, si ya lo tenía por encima del tope nuevo, nunca llega a 0.
 */
export function recortarProgreso(ej, { inicial, maximo }) {
  if (ej.terminado) return ej;
  let pendientes = Math.min(ej.pendientes, maximo);
  const tope = 2 * inicial;
  if (ej.aciertos + pendientes > tope) pendientes = Math.max(0, tope - ej.aciertos);
  return pendientes === ej.pendientes ? ej : { ...ej, pendientes };
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

/** Portada de las prácticas (`practicas/`), esté donde esté la práctica. */
export const URL_PORTADA = new URL('../', import.meta.url).href;

// --- La aplicación --------------------------------------------------------------

/** Arranca una práctica. Ver el contrato en `../plantilla/practica.js`. */
export function arrancar(practica) {
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
  const nuevos = () => params.map(p => ejercicioNuevo(p.inicial));
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

  const idiomaInterfaz = () => estado.idiomaFijo ?? 'es';
  const t = (idioma = idiomaInterfaz()) => T[idioma];
  const tt = (obj, idioma = idiomaInterfaz()) => obj[idioma];

  /** Lee `?idioma=` y lo guardado para el alumno; persiste un cambio explícito. */
  function aplicarIdiomaFijo() {
    const param = new URLSearchParams(location.search).get('idioma');
    if (estado.codigo && (param === 'es' || param === 'en')) escribir(claveIdiomaFijo(estado.codigo), param);
    else if (estado.codigo && param === 'alterno') borrar(claveIdiomaFijo(estado.codigo));
    const guardado = estado.codigo ? leer(claveIdiomaFijo(estado.codigo)) : null;
    estado.idiomaFijo = modoIdioma(location.search, guardado);
  }

  function cargarProgreso() {
    estado.ej = nuevos();
    try {
      const guardado = JSON.parse(leer(claveProgreso(ficha.slug, estado.codigo)));
      if (Array.isArray(guardado?.ej)) {
        estado.ej = estado.ej.map((nuevo, n) => recortarProgreso({ ...nuevo, ...guardado.ej[n] }, params[n]));
      }
    } catch { /* guardado ilegible: se empieza de cero */ }
  }

  function guardar() {
    if (estado.codigo) escribir(claveProgreso(ficha.slug, estado.codigo), JSON.stringify({ ej: estado.ej }));
  }

  /** Copia del progreso en Firestore (documento `practicas/{slug}--{código}`), por REST. */
  function subir() {
    sinSubir = 0;
    if (!estado.codigo || !firebaseConfig?.apiKey) return;
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/practicas/${documentoNube(ficha.slug, estado.codigo)}?key=${firebaseConfig.apiKey}`;
    const fields = {
      estado: { stringValue: JSON.stringify({ v: 1, idioma: estado.idiomaFijo ?? 'alterno', ej: estado.ej }) },
      actualizado: { integerValue: String(Date.now()) },
    };
    fetch(url, { method: 'PATCH', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) }).catch(() => {});
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
          <p class="pequeno">${t().entrada_ayuda}</p>
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
      pintarMenu();
    });
  }

  function entrar(indice) {
    estado.indice = indice;
    estado.codigo = codigoAlumno(indice);
    escribir('practicas.codigo', estado.codigo);
    aplicarIdiomaFijo();
    cargarProgreso();
    pintarMenu();
  }

  // --- Menú -----------------------------------------------------------------------

  function cajaResultado() {
    const hechos = estado.ej.filter(e => e.terminado);
    if (estado.indice === null || !hechos.length) return '';
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
    return iguales ? t().menu_regla(p.inicial, p.penalizacion, p.maximo) : t().menu_regla_varia;
  }

  function pintarMenu() {
    turno++;
    actual = null;
    pintarCabecera();
    const regla = htmlRegla();
    const varia = regla === t().menu_regla_varia;
    const filas = defs.map((def, n) => {
      const e = estado.ej[n];
      const empezado = e.aciertos + e.fallos > 0;
      const etiqueta = e.terminado
        ? `<span class="etiqueta etiqueta--ok">✓ ${t().hecho} · ${t().fallos(e.fallos)}</span>`
        : empezado ? `<span class="etiqueta">${t().quedan(e.pendientes)}</span>`
          : varia ? `<span class="etiqueta">${t().regla_fila(params[n].inicial, params[n].penalizacion)}</span>` : '';
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
      pintarEntrada();
    });
    activarCopiar();
  }

  // --- Ejercicio ------------------------------------------------------------------

  function abrirEjercicio(n) {
    // Un ejercicio ya terminado se puede repetir para practicar, sin tocar lo guardado.
    const repeticion = estado.ej[n].terminado;
    actual = { n, practica: repeticion, sesion: repeticion ? ejercicioNuevo(params[n].inicial) : estado.ej[n], item: null, idioma: null, respondido: false };
    if (defs[n].introduccion) pintarIntroduccion(); else siguiente();
  }

  function cabeceraEjercicio() {
    return `
      <button type="button" class="discreto volver" id="salir">${t().salir}</button>
      <div class="progreso"><span>${t().ejercicio(actual.n + 1)} · ${tt(defs[actual.n].nombre)}</span><strong id="quedan"></strong></div>
      <div class="barra"><div id="barra"></div></div>`;
  }

  function pintarContador() {
    const s = actual.sesion;
    app.querySelector('#quedan').textContent = t().quedan(s.pendientes);
    app.querySelector('#barra').style.width = `${Math.round(100 * s.aciertos / Math.max(1, s.aciertos + s.pendientes))}%`;
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
    app.querySelector('#salir').addEventListener('click', pintarMenu);
    app.querySelector('#empezar').addEventListener('click', siguiente);
  }

  function siguiente() {
    turno++;
    if (actual.sesion.terminado) return pintarFin();
    const def = defs[actual.n];
    const clave = def.clave ?? JSON.stringify;
    const anterior = actual.item;
    const sesion = { aciertos: actual.sesion.aciertos, fallos: actual.sesion.fallos, pendientes: actual.sesion.pendientes, anterior };
    let item = def.generar(rng, sesion);
    for (let i = 0; i < 5 && anterior !== null && clave(item) === clave(anterior); i++) item = def.generar(rng, sesion);
    actual.item = item;
    // El idioma del ítem se fija al generarlo (no al mostrarlo): un recargado
    // de la pantalla (por ejemplo tras la traducción) no lo cambia.
    actual.idioma = estado.idiomaFijo ?? idiomasDe[actual.n].siguiente();
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
    app.querySelector('#salir').addEventListener('click', pintarMenu);

    const miTurno = turno;
    const idi = actual.idioma;
    const api = {
      idioma: idi,
      t: t(idi),
      tt: obj => tt(obj, idi),
      esc,
      respondido: () => miTurno !== turno || actual.respondido,
      responder: ({ acierto, html = '', espera = 1300, pistas = 0 }) => {
        if (miTurno !== turno || actual.respondido) return;
        registrar(Boolean(acierto), Math.max(0, Math.floor(pistas) || 0));
        mostrarFeedback(Boolean(acierto), html, espera);
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
    const antes = actual.sesion.pendientes;
    actual.sesion = anotar(actual.sesion, acierto, diaDe(new Date()), { penalizacion: p.penalizacion, maximo: p.maximo, pistas });
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
    actual.sumadas = Math.max(0, actual.sesion.pendientes - antes);
    pintarContador();
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
    if (acierto) {
      caja.innerHTML = `<div class="feedback feedback--bien"><strong>✓ ${t(idi).bien}</strong> ${html}</div>${botonTraduccion()}`;
      activarTraduccion();
      const miTurno = turno;
      setTimeout(() => { if (miTurno === turno) siguiente(); }, espera);
      return;
    }
    caja.innerHTML = `
      <div class="feedback feedback--mal"><strong>✗ ${t(idi).mal}</strong> ${html}<p class="penalizacion">${t(idi).penalizacion(actual.sumadas)}</p><p class="animo">${rng.elegir(t(idi).animos)}</p></div>
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
          <p>${t().ejercicio(n + 1)} · ${tt(defs[n].nombre)} · ${t().fin_resumen(sesion.aciertos, sesion.fallos)}</p>
          ${repeticion ? `<p class="pequeno">${t().fin_practica}</p>` : ''}
        </div>
        ${cajaResultado()}
        <button type="button" class="ancho" id="al-menu">${t().salir}</button>
      </section>`;
    app.querySelector('#al-menu').addEventListener('click', pintarMenu);
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
