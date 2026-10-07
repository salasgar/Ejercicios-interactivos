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
import { T, esc } from './textos.js';

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
 * 20 aciertos, +5 por fallo y nunca más de 40 pendientes.
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

  const estado = {
    idioma: leer('practicas.idioma') === 'en' ? 'en' : 'es',
    codigo: null,     // código del alumno, o null si practica sin código
    indice: null,
    ej: nuevos(),
  };
  let actual = null;        // ejercicio en curso: { n, sesion, practica, item, respondido }
  let repintar = () => {};  // vuelve a pintar la pantalla actual (al cambiar de idioma)
  let turno = 0;            // invalida los temporizadores y las respuestas al cambiar de pantalla
  let sinSubir = 0;

  const t = () => T[estado.idioma];
  const tt = obj => obj[estado.idioma];

  function cargarProgreso() {
    estado.ej = nuevos();
    try {
      const guardado = JSON.parse(leer(claveProgreso(ficha.slug, estado.codigo)));
      if (Array.isArray(guardado?.ej)) estado.ej = estado.ej.map((nuevo, n) => ({ ...nuevo, ...guardado.ej[n] }));
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
      estado: { stringValue: JSON.stringify({ v: 1, idioma: estado.idioma, ej: estado.ej }) },
      actualizado: { integerValue: String(Date.now()) },
    };
    fetch(url, { method: 'PATCH', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) }).catch(() => {});
  }

  // --- Cabecera: título e idioma -------------------------------------------------

  function pintarCabecera() {
    document.documentElement.lang = estado.idioma;
    document.title = tt(ficha.nombre);
    const titulo = document.querySelector('#cabecera-titulo');
    if (titulo) titulo.textContent = tt(ficha.nombre);
    const idiomas = document.querySelector('#idiomas');
    if (idiomas) {
      idiomas.innerHTML = ['es', 'en']
        .map(i => `<button type="button" data-idioma="${i}" aria-pressed="${i === estado.idioma}">${i.toUpperCase()}</button>`).join('');
    }
  }

  document.querySelector('#idiomas')?.addEventListener('click', ev => {
    const idioma = ev.target.closest('[data-idioma]')?.dataset.idioma;
    if (!idioma || idioma === estado.idioma) return;
    estado.idioma = idioma;
    escribir('practicas.idioma', idioma);
    pintarCabecera();
    repintar();
  });

  // --- Entrada --------------------------------------------------------------------

  function pintarEntrada(error = false) {
    turno++;
    actual = null;
    repintar = () => pintarEntrada();
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
      pintarMenu();
    });
  }

  function entrar(indice) {
    estado.indice = indice;
    estado.codigo = codigoAlumno(indice);
    escribir('practicas.codigo', estado.codigo);
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
    repintar = pintarMenu;
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
    actual = { n, practica: repeticion, sesion: repeticion ? ejercicioNuevo(params[n].inicial) : estado.ej[n], item: null, respondido: false };
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
    repintar = pintarIntroduccion;
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
    actual.respondido = false;
    pintarEjercicio();
  }

  function pintarEjercicio() {
    // Al cambiar de idioma: se vuelve a montar el mismo ítem (por eso tiene que
    // ser datos puros) o, si ya estaba respondido, se pasa al siguiente.
    repintar = () => (actual.respondido ? siguiente() : pintarEjercicio());
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
    const api = {
      idioma: estado.idioma,
      t: t(),
      tt,
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
      app.querySelector('#feedback').innerHTML = `<div class="aviso aviso--error">${t().error_item}</div><button type="button" id="siguiente" class="ancho">${t().siguiente}</button>`;
      app.querySelector('#siguiente').addEventListener('click', siguiente);
    }
  }

  /** Anota la respuesta en el contador y lo guarda. */
  function registrar(acierto, pistas) {
    const p = params[actual.n];
    actual.respondido = true;
    const antes = actual.sesion.pendientes;
    actual.sesion = anotar(actual.sesion, acierto, diaDe(new Date()), { penalizacion: p.penalizacion, maximo: p.maximo, pistas });
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

  function mostrarFeedback(acierto, html, espera) {
    const caja = app.querySelector('#feedback');
    if (acierto) {
      caja.innerHTML = `<div class="feedback feedback--bien"><strong>✓ ${t().bien}</strong> ${html}</div>`;
      const miTurno = turno;
      setTimeout(() => { if (miTurno === turno) siguiente(); }, espera);
      return;
    }
    caja.innerHTML = `
      <div class="feedback feedback--mal"><strong>✗ ${t().mal}</strong> ${html}<p class="penalizacion">${t().penalizacion(actual.sumadas)}</p><p class="animo">${rng.elegir(t().animos)}</p></div>
      <button type="button" id="siguiente" class="ancho">${t().siguiente}</button>`;
    const boton = app.querySelector('#siguiente');
    boton.addEventListener('click', siguiente);
    boton.focus({ preventScroll: true });
    boton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // --- Fin de un ejercicio ----------------------------------------------------------

  function pintarFin() {
    repintar = pintarFin;
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

  pintarCabecera();
  // El código puede venir en el enlace (…/?c=ABCD) o estar recordado de otra práctica.
  const inicial = leerCodigoAlumno(new URLSearchParams(location.search).get('c') ?? leer('practicas.codigo') ?? '');
  if (inicial === null) pintarEntrada(); else entrar(inicial);
}
