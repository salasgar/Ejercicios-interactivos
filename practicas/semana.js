// Tarea de la semana (`practicas/semana.html?t=<id>`): los ejercicios de esa
// semana (los ★ y los de elegir, de `_comun/tareas.js`), con su estado, un
// marcador y un único código de resultado de la tarea.
//
// La página no guarda nada suyo: el progreso lo lee de donde lo guarda la
// base, en este navegador. Así no puede contradecir a las prácticas, y un
// ejercicio terminado antes de que existiera la tarea cuenta igual. Al entrar
// con el código, antes de pintar, pone de acuerdo el navegador y la nube en
// todas las prácticas de la tarea (`sincronizarGuardado`, en paralelo): así se
// ve lo hecho en otro aparato.
//
// El enlace que se pega en Classroom es `semana.html?t=<id>`: cada alumno
// escribe su código la primera vez (o ya lo tiene recordado de otra práctica).
// El panel da también el enlace de cada alumno, con `&c=<código>`.

import { practicaPorSlug } from './_comun/catalogo.js';
import { codigoTarea, modoDeCodigo } from './_comun/codigos.js';
import { leer, escribir, borrar, cerrarSesion, claveIdiomaFijo, modoIdioma, sincronizarGuardado, declaracionDe, URL_PORTADA } from './_comun/base.js';
import { T, esc } from './_comun/textos.js';
import { TAREAS, tareaPorId, tareasPublicadas, estadoTarea, enlaceEjercicio, fechaISO } from './_comun/tareas.js';
import { diaDe } from './_comun/contador.js';
import { ambitoDeTarea, progresoDeTarea, asignacionGuardada, cargarAsignacion, asignadaAMi, vistaPlazo, ejercicioFueraDePlazo, esRepasoDeOtraUnidad, identificar } from './vista-tareas.js';

const app = document.querySelector('#app');
const params = new URLSearchParams(location.search);
const idTarea = Number(params.get('t'));
// Con un código de 8, las tareas son las de su profesor (`entrar` las pone); sin código, las de siempre.
let tareas = TAREAS;
let tarea = tareaPorId(idTarea, tareas);
let profesor = null;             // uid del espacio del alumno (código de 8) o null (código de 4)
let sinConfig = false;           // el espacio no pudo dar las tareas del profesor (sin red y sin copia)

let codigo = null, indice = null;
let idioma = 'es';
let asignacion = null;           // ids de las tareas asignadas a este alumno (copia del navegador o de la nube)
const nombres = new Map();       // 'slug/n' → { es, en }: el nombre de cada ejercicio, de su práctica

/** Como en la base: `?idioma=es|en` lo fija para el alumno, `?idioma=alterno` lo quita. */
function aplicarIdioma() {
  const param = params.get('idioma');
  // 'alterno' se guarda (no se borra) para que la nube no vuelva a fijarlo (base.js, adoptarIdioma).
  if (codigo && (param === 'es' || param === 'en' || param === 'alterno')) escribir(claveIdiomaFijo(codigo), param);
  idioma = modoIdioma(location.search, codigo ? leer(claveIdiomaFijo(codigo)) : null) ?? 'es';
}

let ultimaLectura = 0;

/**
 * Navegador y nube de acuerdo en todas las prácticas de la tarea (cada una, como mucho 4 s;
 * en las tareas v2, sus documentos de la tarea), y la asignación del alumno.
 */
async function sincronizar() {
  const slugs = [...new Set([...tarea.estrella, ...tarea.elegir].map(([slug]) => slug))];
  const suyo = codigo;
  const [, asignada] = await Promise.all([
    Promise.all(slugs.map(slug => sincronizarGuardado(slug, suyo, { tareaId: ambitoDeTarea(tarea), profesor }))),
    tarea.asignada ? cargarAsignacion(suyo, { profesor }) : null,
  ]);
  if (suyo === codigo && tarea.asignada) asignacion = asignada;
  ultimaLectura = Date.now();
  return suyo === codigo;
}

/**
 * Entra con un código de 4 o de 8 (tecleado o del enlace). El de 8 se resuelve primero
 * (de qué profesor es y cuáles son sus tareas); la tarea de la dirección se busca entre las
 * de ese profesor. Si el código no vale, no existe o no se puede comprobar, vuelve a la entrada.
 */
async function entrar(texto) {
  if (modoDeCodigo(texto) === 'nuevo') {
    cabecera(T[idioma].semana_titulo);
    app.innerHTML = `<p class="vacio">${T[idioma].cargando_progreso}</p>`;
  }
  const c = await identificar(texto);
  if (c.error) {
    // Lo que había recordado no sirve: se olvida para que no vuelva a entrar al recargar.
    if (c.error === 'no-existe') borrar('practicas.codigo');
    return pintarEntrada(c.error === 'no-valido' ? 'formato' : c.error);
  }
  codigo = c.codigo;
  indice = c.indice;
  profesor = c.profesor;
  tareas = c.tareas;
  sinConfig = c.sinConfig;
  tarea = tareaPorId(idTarea, tareas);
  escribir('practicas.codigo', codigo);
  asignacion = asignacionGuardada(codigo);
  aplicarIdioma();
  if (!tarea) return pintar();
  cabecera(tarea.titulo[idioma]);
  app.innerHTML = `<p class="vacio">${T[idioma].cargando_progreso}</p>`;
  cargarNombres();
  if (!(await sincronizar())) return;
  aplicarIdioma();   // la nube puede haber traído el idioma fijado en otro aparato
  pintar();
}

function cabecera(titulo) {
  document.documentElement.lang = idioma;
  document.title = titulo;
  document.querySelector('#cabecera-titulo').textContent = titulo;
}

// --- Sin tarea o sin código -----------------------------------------------------------

function pintarSinTarea() {
  const t = T[idioma];
  cabecera(t.semana_titulo);
  const lista = tareasPublicadas(fechaISO(new Date()), tareas);
  app.innerHTML = `
    <section>
      <div class="aviso">${sinConfig ? t.espacio_sin_red : t.semana_no_existe}</div>
      ${lista.length ? `<p>${t.semana_elige_tarea}</p>
      <ul class="lista">${lista.map(x => `
        <li class="lista__item"><div><h3>${esc(x.titulo[idioma])}</h3></div>
          <a class="boton" href="semana.html?t=${x.id}${codigo ? `&c=${codigo}` : ''}">${t.portada_abrir}</a></li>`).join('')}</ul>` : ''}
      <p><a class="enlace-portada" href="${URL_PORTADA}${codigo ? `?c=${codigo}` : ''}">${t.todas}</a></p>
    </section>`;
}

/** `error`: false | 'formato' | 'no-existe' | 'sin-red' (el código no vale, la nube no lo conoce, no se pudo preguntar). */
function pintarEntrada(error = false) {
  const t = T[idioma];
  // Con un código de 8, la tarea solo se sabe después de resolverlo: antes, el título es genérico.
  const titulo = tarea ? tarea.titulo[idioma] : t.semana_titulo;
  const frase = { formato: t.entrada_error, 'no-existe': t.entrada_no_existe, 'sin-red': t.espacio_sin_red }[error];
  cabecera(titulo);
  app.innerHTML = `
    <section class="entrada">
      <h2>${esc(titulo)}</h2>
      <form class="tarjeta" id="form-codigo">
        <h2>${t.entrada_titulo}</h2>
        <p class="pequeno">${t.entrada_ayuda} ${t.entrada_aparatos}</p>
        <input id="codigo" type="text" class="codigo-entrada" maxlength="12" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="${t.entrada_titulo}" required>
        ${frase ? `<div class="aviso aviso--error">${frase}</div>` : ''}
        <button type="submit" class="ancho">${t.entrada_boton}</button>
      </form>
    </section>`;
  app.querySelector('#form-codigo').addEventListener('submit', ev => {
    ev.preventDefault();
    const texto = app.querySelector('#codigo').value;
    if (modoDeCodigo(texto) === null) return pintarEntrada('formato');
    entrar(texto);
  });
}

// --- La tarea -------------------------------------------------------------------------

function filaEjercicio(e, estrella, num, tipo) {
  const t = T[idioma];
  const ficha = practicaPorSlug(e.slug);
  const nombre = nombres.get(`${e.slug}/${e.n}`);
  const tarde = ejercicioFueraDePlazo(tarea, e.ej, tipo) ? ` <span class="etiqueta etiqueta--tarde">${t.tarea_ejercicio_fuera_de_plazo}</span>` : '';
  const etiqueta = e.terminado ? `<span class="etiqueta etiqueta--ok">${t.semana_terminado(e.ej.fallos ?? 0)}</span>${tarde}`
    : e.empezado ? `<span class="etiqueta">${t.puntos(e.ej.puntos ?? 0, e.ej.objetivo ?? 10)}</span>`
      : `<span class="pequeno">${t.semana_sin_empezar}</span>`;
  const boton = e.terminado ? t.repetir : e.empezado ? t.seguir : t.empezar;
  return `
    <li class="lista__item tarea-item ${e.terminado ? 'tarea-item--hecho' : ''}">
      <div>
        <div class="tarea-item__practica">${esc(ficha.nombre[idioma])}${esRepasoDeOtraUnidad(ficha, tarea) ? ` ${t.repaso_de_unidad(ficha.unidad)}` : ''}</div>
        <h3>${estrella ? '★ ' : ''}${t.ejercicio(num)} · <span data-nombre="${e.slug}/${e.n}">${nombre ? esc(nombre[idioma]) : t.semana_cargando_nombre}</span></h3>
        ${etiqueta}
      </div>
      <a class="boton ${e.terminado ? 'secundario' : ''}" href="${enlaceEjercicio(e.slug, e.n, tarea.id, codigo, num)}">${boton}</a>
    </li>`;
}

function cajaCodigo(est) {
  const t = T[idioma];
  // Sin número de lista que quepa en el código de resultado (código de 8 fuera de rango), no hay código.
  if (!est.cumplida || indice === null) return '';
  const texto = codigoTarea(tarea.id, indice, {
    estrella: est.estrella.map(e => e.terminado),
    elegir: est.elegir.map(e => e.terminado),
    fallos: est.fallos,
    // La tarea 1 conserva el día de siempre (el del último ejercicio terminado); las v2, el de entrega.
    dia: tarea.progresoPorPractica ? est.dia : est.diaEntrega,
  });
  return `
    <div class="tarjeta resultado resultado--completo">
      <h3>${t.semana_cumplida}</h3>
      <p class="pequeno">${t.semana_cumplida_texto}</p>
      <details class="pequeno">
        <summary>${t.resultado_desplegable}</summary>
        <div class="resultado__fila">
          <output class="resultado__codigo" id="codigo-resultado">${texto}</output>
          <button type="button" class="secundario" id="copiar">${t.copiar}</button>
        </div>
      </details>
    </div>`;
}

function pintarTarea() {
  const t = T[idioma];
  cabecera(tarea.titulo[idioma]);
  const est = estadoTarea(tarea, progresoDeTarea(tarea, codigo));
  const plazo = vistaPlazo(tarea, est, diaDe(new Date()), asignadaAMi(tarea, asignacion), t);
  const elegidos = Math.min(est.elegirHechos, tarea.nElegir);
  const marcador = [
    est.estrella.length ? `<span class="${est.estrellaHechos === est.estrella.length ? 'listo' : ''}">${t.semana_marcador_estrella(est.estrellaHechos, est.estrella.length)}</span>` : '',
    tarea.nElegir ? `<span class="${elegidos === tarea.nElegir ? 'listo' : ''}">${t.semana_marcador_elegir(elegidos, tarea.nElegir)}</span>` : '',
    `<strong>${t.semana_marcador_puntos(est.puntos, est.maximo)}</strong>`,
  ].join('');
  app.innerHTML = `
    <section>
      <h2>${esc(tarea.titulo[idioma])}</h2>
      <p class="semana__tipo"><span class="etiqueta etiqueta--${plazo.tipo}">${plazo.etiqueta}</span>${plazo.frase ? ` <span class="semana__plazo semana__plazo--${plazo.estado}">${plazo.frase}</span>` : ''}</p>
      <p class="semana__objetivo">${t.semana_objetivo(est.estrella.length, tarea.nElegir, est.maximo)}</p>
      <div class="tarjeta">
        <div class="semana__marcador" aria-live="polite">${marcador}</div>
        <div class="barra"><div style="width: ${Math.round(100 * est.puntos / Math.max(1, est.maximo))}%"></div></div>
      </div>
      ${cajaCodigo(est)}
      ${est.estrella.length ? `
        <h3 class="semana__bloque">${t.semana_estrella}</h3>
        <ul class="lista">${est.estrella.map((e, i) => filaEjercicio(e, true, i + 1, plazo.tipo)).join('')}</ul>` : ''}
      ${est.elegir.length ? `
        <h3 class="semana__bloque">${t.semana_elegir(tarea.nElegir)}</h3>
        <p class="pequeno semana__ayuda">${t.semana_elegir_ayuda(tarea.nElegir)}</p>
        <ul class="lista">${est.elegir.map((e, i) => filaEjercicio(e, false, est.estrella.length + i + 1, plazo.tipo)).join('')}</ul>` : ''}
      <div class="pie-menu">
        <a class="enlace-portada" href="${URL_PORTADA}?c=${codigo}">${t.todas}</a>
        <button type="button" class="discreto" id="cambiar">${t.cambiar_codigo} (${codigo})</button>
      </div>
    </section>`;
  app.querySelector('#copiar')?.addEventListener('click', async ev => {
    const salida = app.querySelector('#codigo-resultado');
    try {
      await navigator.clipboard.writeText(salida.textContent);
      ev.target.textContent = t.copiado;
    } catch {
      getSelection().selectAllChildren(salida);
    }
  });
  app.querySelector('#cambiar').addEventListener('click', () => {
    cerrarSesion();
    codigo = null;
    indice = null;
    profesor = null;
    tareas = TAREAS;
    sinConfig = false;
    tarea = tareaPorId(idTarea, tareas);
    pintar();
  });
}

/** Los nombres de los ejercicios están en cada práctica: se cargan aparte y se ponen al llegar. */
async function cargarNombres() {
  const slugs = [...new Set([...tarea.estrella, ...tarea.elegir].map(([slug]) => slug))];
  await Promise.all(slugs.map(async slug => {
    const declaracion = await declaracionDe(practicaPorSlug(slug));
    declaracion?.ejercicios?.forEach((e, i) => nombres.set(`${slug}/${i + 1}`, e.nombre));
    for (const span of app.querySelectorAll(`[data-nombre^="${slug}/"]`)) {
      const nombre = nombres.get(span.dataset.nombre);
      if (nombre) span.textContent = nombre[idioma];
    }
  }));
}

function pintar() {
  if (!tarea) return pintarSinTarea();
  if (codigo === null) return pintarEntrada();
  pintarTarea();
}

// --- Arranque -------------------------------------------------------------------------

const inicial = params.get('c') ?? leer('practicas.codigo') ?? '';
if (modoDeCodigo(inicial) === null) {
  aplicarIdioma();
  pintar();
  if (tarea) cargarNombres();
} else {
  entrar(inicial);
}
// Al volver atrás desde una práctica (si el navegador guarda la página), se actualiza el progreso.
addEventListener('pageshow', ev => { if (ev.persisted && codigo) pintar(); });
// Y al volver a la pestaña después de practicar en otra (sin borrar lo que se esté tecleando en la entrada);
// si hace más de 30 s de la última lectura, también se mira la nube (quizá se ha practicado en otro aparato).
addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible' || !codigo) return;
  pintar();
  if (tarea && Date.now() - ultimaLectura > 30000 && await sincronizar()) pintar();
});
