// Panel único del profesor para todas las prácticas de la unidad 2.
// Reparte un código a cada alumno de la lista y lee los resultados, de dos
// fuentes: los códigos de resultado que envían los alumnos y Firestore.
//
// Dos sistemas (tarea 66 del reparto PU2; DISENO.md de la 57, A.2 y F.1):
// - el ACTUAL (modo antiguo): códigos de 4 sacados del número de lista, las
//   colecciones `practicas`, `practicas-tareas`, `practicas-asignaciones` y
//   `fallos`, y las tareas de `tareas.js`. La lista de nombres vive solo en este
//   navegador. Es el de Juan Luis hasta su migración, y no cambia;
// - el NUEVO (el espacio del profesor): cada profesor entra con Google, genera
//   códigos secretos para sus alumnos (de 8 o, si lo elige, de 4; tarea 72) y
//   lee solo lo de su espacio; los
//   nombres suben a la nube cifrados con su contraseña (`_comun/cifrado.js`).
// Las vistas de los resultados (Resultados, Asignar tareas, Fallos) son las
// mismas en los dos: leen de `fuente`, la del sistema elegido.

import { CATALOGO, ID_PLANTILLA, practicaPorId, practicaPorSlug } from './_comun/catalogo.js';
import { codigoAlumno, leerCodigoAlumno, leerCualquierCodigo, extraerCodigosResultado, MAX_ALUMNOS, codigoSecreto, mostrarCodigoSecreto } from './_comun/codigos.js';
import { fechaDeDia, diaDe } from './_comun/contador.js';
import { esc } from './_comun/textos.js';
import { TAREAS, tareaPorId, fechaISO, configDeJSON, configAJSON, longitudDeCodigos } from './_comun/tareas.js';
import {
  juntarResultados, juntarResumen, juntarTareas, juntarFallos, agruparFallos, filtrarFallos, leerDocumentos, leerAsignaciones,
  calcularRetrasos, asignacionesParaGuardar, tareaPublicada, cumplidasDe,
  indicesDeCodigos, filasMisAlumnos, faltanCodigos, repartirCodigos, fusionarLeidos, desdeParaLeer, leerCodigoTareaEspacio,
} from './resultados.js';
import { DESTREZAS, leerFallos } from './_comun/registro.js';
import { declaracionDe } from './_comun/base.js';
import { cifrar, descifrar, errorContrasena, ContrasenaIncorrecta } from './_comun/cifrado.js';
import * as editorTareas from './profesor-tareas.js';
import * as panelHoy from './profesor-hoy.js';

const $ = id => document.getElementById(id);
// La lista es la misma que la del panel antiguo de `divisores/`: mismos alumnos, mismos códigos.
const CLAVE_LISTA = 'divisores.profesor.lista';
const CLAVE_MODO = 'practicas.profesor.modo';   // el último sistema usado en este navegador
const URL_PORTADA = new URL('./', location.href).href;
const RESUMEN = 'resumen';
const TAREAS_SEMANA = 'tareas';
const RETRASOS = 'retrasos';
const FALLOS = 'fallos';            // «Qué falla más», todas las prácticas
const FALLOS_TAREA = 'fallos-t';    // «Qué falla más» de una tarea: 'fallos-t<id>'

function leerLocal(clave) {
  try { return localStorage.getItem(clave); } catch { return null; }
}
function escribirLocal(clave, valor) {
  try { localStorage.setItem(clave, valor); } catch { /* sin almacén */ }
}

// --- Las dos fuentes -----------------------------------------------------------

const datosVacios = () => ({
  nube: [],                    // datos de práctica libre ya leídos: [{ practica, indice, ej, actualizado }]
  nubeTareas: [],              // los de las tareas v2: [{ tarea, practica, indice, ej, actualizado }]
  asignaciones: [],            // [{ indice, tareas: [ids] }]
  asignacionesCargadas: false, // hasta cargar la nube no se pueden guardar (se machacaría lo que hubiera)
  registro: [],                // fallos leídos de la nube, uno a uno
  textos: {},                  // lo que decían los avisos de estado y los códigos pegados al cambiar de sistema
});

/** El sistema actual (modo antiguo): todo como antes de la tarea 66. */
const antigua = {
  modo: 'antiguo',
  ...datosVacios(),
  nombres: () => $('lista').value.split('\n').map(l => l.trim()).slice(0, MAX_ALUMNOS),
  codigoDe: indice => codigoAlumno(indice),
  indiceDe: codigo => leerCodigoAlumno(codigo),
  tareas: () => TAREAS,
  leerCodigo: texto => leerCualquierCodigo(texto),
};

/** El sistema nuevo: el espacio del profesor que ha entrado. */
const espacio = {
  modo: 'nuevo',
  ...datosVacios(),
  uid: null,
  esAdmin: false,
  codigos: [],                 // sus filas de `practicas-alumnos`: [{ id: código, n, alta }]
  codigosLeidos: false,
  indices: indicesDeCodigos([]),
  config: { unidades: [], tareas: [] },
  cifrada: null,               // la lista de nombres cifrada de la nube, o null
  documentos: { 'progreso-libre': [], 'progreso-tareas': [], 'asignaciones': [] },
  nombres: () => $('lista-espacio').value.split('\n').map(l => l.trim()).slice(0, MAX_ALUMNOS),
  codigoDe: indice => espacio.indices.codigoDe(indice),
  indiceDe: codigo => espacio.indices.indiceDe(codigo),
  tareas: () => espacio.config.tareas,
  // Solo códigos de tarea (20), con las tareas de este profesor; los de 12 son de `divisores/`.
  leerCodigo: texto => leerCodigoTareaEspacio(texto, espacio.config.tareas),
};

let fuente = antigua;
const nombres = () => fuente.nombres();
const tareasDe = () => fuente.tareas();
const tareaDe = id => tareaPorId(id, tareasDe());
/** Cómo se enseña un código: los de 8, en dos grupos (`K7QM-P3XA`), como los teclea el alumno; los de 4, tal cual. */
const verCodigo = codigo => (codigo && fuente === espacio ? mostrarCodigoSecreto(codigo) : codigo);
/** El código del alumno n.º `indice + 1` tal como se enseña ('' si aún no tiene). */
const codigoVisible = indice => verCodigo(fuente.codigoDe(indice)) ?? '';

/** Lo que `juntarTareas` necesita además de los códigos: documentos de las tareas v2, asignaciones y hoy. */
const opcionesTareas = () => ({ deNubeTareas: fuente.nubeTareas, asignaciones: fuente.asignaciones, hoyDia: diaDe(new Date()) });

/** Escribe un aviso de estado de las vistas; si `f` no es el sistema de ahora, lo guarda para cuando vuelva. */
function ponerEstado(f, id, texto) {
  if (f === fuente) $(id).textContent = texto;
  else f.textos[id] = texto;
}

function descargar(nombre, filas) {
  const csv = filas.map(f => f.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(a.href);
}

// --- 1. Códigos de los alumnos (sistema actual) ----------------------------------

function filasCodigos() {
  return antigua.nombres().map((nombre, i) => ({ n: i + 1, nombre, codigo: codigoAlumno(i) })).filter(f => f.nombre);
}

/** El `&idioma=` que se añade a los enlaces, según el selector («alterno» no añade nada). */
function sufijoIdioma(idIdioma) {
  const idioma = $(idIdioma)?.value;
  return idioma && idioma !== 'alterno' ? `&idioma=${idioma}` : '';
}

/** Enlace de un alumno: a la portada o, si se elige en «Enlaces a», a una tarea de la semana. */
function enlaceDe(codigo, idDestino = 'destino-enlaces', idIdioma = 'idioma-enlaces') {
  const destino = $(idDestino)?.value;
  return destino && destino !== 'portada'
    ? `${URL_PORTADA}semana.html?t=${destino}&c=${codigo}${sufijoIdioma(idIdioma)}`
    : `${URL_PORTADA}?c=${codigo}${sufijoIdioma(idIdioma)}`;
}

/** Enlace común de una tarea (cada alumno escribe su código la primera vez): el que se pega en Classroom. */
const enlaceComun = tarea => `${URL_PORTADA}semana.html?t=${tarea.id}`;

/** El desplegable «Enlaces a» y la tabla de las tareas con su enlace común. */
function pintarTablaTareas(lista, idDestino, idTabla, vacio = '') {
  const elegido = $(idDestino).value;
  $(idDestino).innerHTML = '<option value="portada">La portada (todas las prácticas)</option>'
    + lista.map(t => `<option value="${t.id}">Tarea ${t.id} · ${esc(t.titulo.es)}</option>`).join('');
  if ([...$(idDestino).options].some(o => o.value === elegido)) $(idDestino).value = elegido;
  $(idTabla).innerHTML = !lista.length ? vacio : `
    <table>
      <thead><tr><th class="num">Tarea</th><th>Título</th><th>Pide</th><th>Enlace común (para Classroom)</th><th></th></tr></thead>
      <tbody>${lista.map(t => `
        <tr>
          <td class="num">${t.id}</td><td>${esc(t.titulo.es)}</td>
          <td>${t.estrella.length} ★ + ${t.nElegir} de ${t.elegir.length}${t.desde ? ` · en la portada desde el ${t.desde.split('-').reverse().join('/')}` : ''}${t.hasta ? ` · plazo ${t.hasta.split('-').reverse().join('/')}` : ''}${t.asignada ? ' · asignada' : ''}${t.progresoPorPractica ? '' : ' · progreso propio'}</td>
          <td class="celda-enlace"><code class="enlace">${enlaceComun(t)}</code></td>
          <td><button type="button" class="secundario" data-copiar-tarea="${t.id}">Copiar</button></td>
        </tr>`).join('')}</tbody>
    </table>`;
}

/** El botón «Copiar» de una fila de esa tabla; `lista` da las tareas de ahora. */
const copiarEnlaceTarea = lista => async ev => {
  const id = ev.target.dataset?.copiarTarea;
  const tarea = id && tareaPorId(Number(id), lista());
  if (!tarea) return;
  await navigator.clipboard.writeText(enlaceComun(tarea));
  ev.target.textContent = '¡Copiado!';
};

function pintarCodigos() {
  const filas = filasCodigos();
  $('tabla-codigos').innerHTML = filas.length ? `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th><th>Enlace directo</th></tr></thead>
      <tbody>${filas.map(f => `<tr><td class="num">${f.n}</td><td>${esc(f.nombre)}</td><td><code>${f.codigo}</code></td><td>${enlaceDe(f.codigo)}</td></tr>`).join('')}</tbody>
    </table>` : '';
}

const tablaCodigos = () => [['N.º', 'Alumno', 'Código', 'Enlace'], ...filasCodigos().map(f => [f.n, f.nombre, f.codigo, enlaceDe(f.codigo)])];

// --- 2. Resultados -------------------------------------------------------------

/**
 * Los códigos pegados, de los dos tipos mezclados: los de 12 de `divisores/`
 * en `validos`, los de tarea de la semana (20) en `deTareas`, y los que no son
 * válidos (también los de 16 de práctica, que ya no existen: salen en el aviso).
 * En el sistema nuevo solo valen los de tarea, con las tareas del profesor.
 */
function pegados() {
  const leidos = extraerCodigosResultado($('pegados').value).map(texto => ({ texto, dato: fuente.leerCodigo(texto) }));
  return {
    validos: leidos.filter(l => l.dato?.tipo === 'practica').map(l => l.dato),
    deTareas: leidos.filter(l => l.dato?.tipo === 'tarea').map(l => l.dato),
    invalidos: leidos.filter(l => !l.dato).map(l => l.texto),
  };
}

/** Las prácticas que salen en el panel: las publicadas y cualquiera de la que haya datos. */
function practicasVisibles(validos) {
  const conDatos = new Set([...validos, ...fuente.nube].map(d => d.practica));
  return CATALOGO.filter(p => conDatos.has(p.id) || (p.disponible && p.id !== ID_PLANTILLA));
}

function pintarSelector(practicas) {
  const elegida = $('vista').value || RESUMEN;
  $('vista').innerHTML = `<option value="${RESUMEN}">Resumen de todas las prácticas</option>`
    + `<option value="${TAREAS_SEMANA}">Tareas de la semana</option>`
    + `<option value="${RETRASOS}">Retrasos en las tareas</option>`
    + `<option value="${FALLOS}">Qué falla más · todas las prácticas</option>`
    + tareasDe().map(t => `<option value="${FALLOS_TAREA}${t.id}">Qué falla más · tarea ${t.id}</option>`).join('')
    + practicas.map(p => `<option value="${p.id}">${esc(p.nombre.es)}</option>`).join('');
  $('vista').value = [...$('vista').options].some(o => o.value === elegida) ? elegida : RESUMEN;
}

/** Cuánto de un ejercicio se hizo en inglés (solo lo sabe la nube, no el código de resultado). */
const enInglés = e => (e.en_aciertos || e.en_fallos ? ` <span class="pequeno">EN: ${e.en_aciertos ?? 0}/${e.en_fallos ?? 0}</span>` : '');

function celda(e) {
  if (e.terminado) return `<td class="num celda--ok">✓ ${e.fallos}${e.tope ? '+' : ''}${enInglés(e)}</td>`;
  if (e.puntos !== undefined && e.aciertos + e.fallos > 0) return `<td class="num">${e.puntos}/${e.objetivo ?? '?'} pt${e.reinicios ? ` · ↺${e.reinicios}` : ''}${enInglés(e)}</td>`;
  return '<td class="num celda--no">—</td>';
}

function htmlPractica(practica, validos) {
  const filas = juntarResultados(nombres(), validos.filter(d => d.practica === practica.id), fuente.nube.filter(d => d.practica === practica.id), practica.nEjercicios);
  if (!filas.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  const numeros = Array.from({ length: practica.nEjercicios }, (_, i) => i + 1);
  return `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${numeros.map(n => `<th class="num">Ej. ${n}</th>`).join('')}<th class="num">Hechos</th><th>Terminó el</th><th>Fuente</th></tr></thead>
      <tbody>${filas.map(f => `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoVisible(f.indice)}</code></td>
          ${f.ejercicios.map(celda).join('')}
          <td class="num ${f.hechos === practica.nEjercicios ? 'celda--ok' : ''}">${f.hechos}/${practica.nEjercicios}</td>
          <td>${f.dia ? fechaDeDia(f.dia) : ''}</td><td>${f.fuente}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">En cada ejercicio: ✓ y el número de fallos. Con los códigos de resultado los fallos se cuentan hasta 15 («15+»). Sin terminar: puntos sobre el objetivo y, si las ha perdido todas, cuántas veces ha vuelto a empezar (↺).</p>`;
}

function csvPractica(practica, validos) {
  const filas = juntarResultados(nombres(), validos.filter(d => d.practica === practica.id), fuente.nube.filter(d => d.practica === practica.id), practica.nEjercicios);
  const numeros = Array.from({ length: practica.nEjercicios }, (_, i) => i + 1);
  const cab = ['N.º', 'Alumno', 'Código', ...numeros.flatMap(n => [`Ej${n} hecho`, `Ej${n} fallos`]), 'Hechos', 'Terminó el', 'Fuente'];
  return [cab, ...filas.map(f => [
    f.indice + 1, f.nombre, codigoVisible(f.indice),
    ...f.ejercicios.flatMap(e => [e.terminado ? 'sí' : 'no', e.fallos ?? '']),
    f.hechos, f.dia ? fechaDeDia(f.dia) : '', f.fuente,
  ])];
}

function celdaResumen(p) {
  if (p.hechos === p.n) return `<td class="num celda--ok">✓ ${p.hechos}/${p.n}</td>`;
  if (p.hechos > 0 || p.empezada) return `<td class="num celda--medio">${p.hechos}/${p.n}</td>`;
  return '<td class="num celda--no">—</td>';
}

function htmlResumen(practicas, validos) {
  const filas = juntarResumen(nombres(), validos, fuente.nube, practicas);
  if (!filas.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  return `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${practicas.map(p => `<th class="practica">${esc(p.nombre.es)}</th>`).join('')}<th class="num">Completas</th></tr></thead>
      <tbody>${filas.map(f => `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoVisible(f.indice)}</code></td>
          ${f.practicas.map(celdaResumen).join('')}
          <td class="num ${f.completas === practicas.length ? 'celda--ok' : ''}">${f.completas}/${practicas.length}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">En cada práctica: ejercicios terminados de los que tiene. Elige una práctica arriba para ver los fallos de cada ejercicio.</p>`;
}

function csvResumen(practicas, validos) {
  const filas = juntarResumen(nombres(), validos, fuente.nube, practicas);
  const cab = ['N.º', 'Alumno', 'Código', ...practicas.map(p => `${p.nombre.es} (de ${p.nEjercicios})`), 'Prácticas completas'];
  return [cab, ...filas.map(f => [f.indice + 1, f.nombre, codigoVisible(f.indice), ...f.practicas.map(p => p.hechos), f.completas])];
}

// --- Tareas de la semana -------------------------------------------------------

/** «, 2 d tarde» / «, 3 d de retraso» si la tarea tiene plazo y hay retraso. */
function textoRetraso(c) {
  if (!c.conPlazo || !c.diasRetraso) return '';
  return c.cumplida ? ` · ${c.diasRetraso} d tarde` : ` · <span class="celda--no">${c.diasRetraso} d de retraso</span>`;
}

function celdaTarea(c) {
  // Tarea asignada a otros: «—» (o su avance voluntario en gris) y no cuenta.
  if (c.noAsignado) return `<td class="num celda--no">—${c.empezada ? ` <span class="pequeno">(voluntaria: ${c.cumplida ? 'cumplida' : `★ ${c.estrellaHechos} de ${c.nEstrella}`} · ${c.puntos} pt)</span>` : ''}</td>`;
  if (c.cumplida) return `<td class="num celda--ok">✓ cumplida · <strong>${c.puntos}</strong> pt${textoRetraso(c)}</td>`;
  if (c.empezada) return `<td class="num celda--medio">★ ${c.estrellaHechos} de ${c.nEstrella} · ${c.elegirHechos} de ${c.nElegir} · <strong>${c.puntos}</strong> pt${textoRetraso(c)}</td>`;
  return `<td class="num celda--no">sin empezar${textoRetraso(c)}</td>`;
}

const estadoTareaCsv = c => (c.cumplida ? 'cumplida' : c.empezada ? 'a medias' : 'sin empezar');
/** Fecha de un día contado desde el 1-9-2026, o '' si no hay. */
const fechaCsv = dia => (dia ? fechaDeDia(dia) : '');
const plazoCsv = c => (c.plazo ? c.plazo.split('-').reverse().join('/') : '');
const fechaCorta = iso => iso.split('-').reverse().slice(0, 2).join('/');

/** Encabezado de la columna de una tarea; las que aún no se han publicado, en gris y con su «desde». */
function cabeceraTarea(t, hoyDia) {
  const publicada = tareaPublicada(t, hoyDia);
  return `<th class="practica${publicada ? '' : ' celda--no'}">${esc(t.titulo.es)}${t.hasta ? `<br><span class="pequeno">plazo ${t.hasta.split('-').reverse().join('/')}</span>` : ''}${t.asignada ? '<br><span class="pequeno">asignada</span>' : ''}${publicada ? '' : `<br><span class="pequeno">desde ${fechaCorta(t.desde)}</span>`}</th>`;
}

function htmlTareas(validos, deTareas) {
  const { hoyDia } = opcionesTareas();
  const tareas = tareasDe();
  if (fuente === espacio && !tareas.length) return '<p class="vacio">Aún no tienes tareas (se crean en «Tareas», arriba).</p>';
  const filas = juntarTareas(nombres(), deTareas, validos, fuente.nube, tareas, opcionesTareas());
  if (!filas.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  return `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${tareas.map(t => cabeceraTarea(t, hoyDia)).join('')}<th class="num">Obligatorias</th><th class="num">Repaso</th></tr></thead>
      <tbody>${filas.map(f => {
        const c = cumplidasDe(f, tareas, hoyDia);
        return `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoVisible(f.indice)}</code></td>
          ${f.tareas.map(celdaTarea).join('')}
          <td class="num ${c.debidas && c.entregadas === c.debidas ? 'celda--ok' : ''}">${c.entregadas} de ${c.debidas}</td>
          <td class="num">${c.repaso}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>
    <p class="pequeno">«Obligatorias»: de las tareas ya publicadas que este alumno tenía que hacer (las que tienen plazo y, de las asignadas, aquellas en las que está marcado), cuántas ha entregado. «Repaso»: cuántas tareas voluntarias ha completado. Las tareas en gris aún no se han publicado (salen en la portada desde el día que dice) y no cuentan en nada.</p>
    <p class="pequeno">«★ x de 6 · y de 4 · N pt · D d tarde»: obligatorios terminados, de los de elegir cuántos ha terminado, los puntos de la tarea (sobre 100), los mismos que ve el alumno en su marcador: 10 por ejercicio terminado y, a medias, la parte proporcional (eso solo lo sabe la nube; de los de elegir cuentan los mejores), y los días de retraso sobre el plazo (en rojo, si todavía no la ha entregado). Una tarea <strong>asignada</strong> es obligatoria solo para los alumnos marcados en «Asignar tareas»: para los demás sale «—» (su avance voluntario, en gris) y no cuenta. ${fuente === antigua ? 'Las tareas con progreso propio (todas menos la 1) cuentan solo lo hecho dentro de la tarea; la 1 cuenta también lo de la práctica libre.' : 'Cada tarea cuenta solo lo hecho dentro de la tarea.'} Un ejercicio cuenta si lo dice el código de la tarea <strong>o</strong> los datos de la nube. El CSV trae también los fallos, el día, el plazo, la fecha de entrega, los días de retraso y si fue a tiempo.</p>`;
}

function csvTareas(validos, deTareas) {
  const tareas = tareasDe();
  const filas = juntarTareas(nombres(), deTareas, validos, fuente.nube, tareas, opcionesTareas());
  const cab = ['N.º', 'Alumno', 'Código', ...tareas.flatMap(t => [`T${t.id} estado`, `T${t.id} puntos (de ${10 * (t.estrella.length + t.nElegir)})`, `T${t.id} ★ (de ${t.estrella.length})`, `T${t.id} a elegir (de ${t.nElegir})`, `T${t.id} fallos`, `T${t.id} día`, `T${t.id} fuente`, `T${t.id} plazo`, `T${t.id} fecha de entrega`, `T${t.id} días de retraso`, `T${t.id} entrega`])];
  return [cab, ...filas.map(f => [
    f.indice + 1, f.nombre, codigoVisible(f.indice),
    ...f.tareas.flatMap(c => (c.noAsignado
      ? ['no asignada', '', '', '', '', '', '', '', '', '', '']
      : [estadoTareaCsv(c), c.puntos, c.estrellaHechos, c.elegirHechos, `${c.fallos}${c.tope ? '+' : ''}`, fechaCsv(c.dia), c.fuente, plazoCsv(c), fechaCsv(c.diaEntrega), c.conPlazo ? c.diasRetraso : '', c.entrega])),
  ])];
}

// --- Retrasos ------------------------------------------------------------------

/** Los retrasos de los alumnos de la lista (o de todos, si la lista está vacía). */
function datosRetrasos(validos, deTareas) {
  const hoyDia = opcionesTareas().hoyDia;
  let filas = juntarTareas(nombres(), deTareas, validos, fuente.nube, tareasDe(), opcionesTareas());
  if (nombres().some(Boolean)) filas = filas.filter(f => f.nombre);
  return calcularRetrasos(filas, tareasDe(), hoyDia);
}

const mediaTexto = x => (x ? decimal(x) : '—');

function htmlRetrasos(validos, deTareas) {
  const r = datosRetrasos(validos, deTareas);
  if (!r.alumnos.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  const tituloTarea = id => `T${id} · ${esc(tareaDe(id)?.titulo.es ?? '')}`;
  return `
    <h3>Por alumno</h3>
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th class="num">Con plazo</th><th class="num">A tiempo</th><th class="num">Con retraso</th><th class="num">Sin entregar</th><th class="num">Pendientes</th><th class="num">Días de retraso (total)</th><th class="num">Media</th><th class="num">Máximo</th></tr></thead>
      <tbody>${r.alumnos.map(a => `
        <tr>
          <td class="num">${a.indice + 1}</td><td>${esc(a.nombre || '(no está en la lista)')}</td>
          <td class="num">${a.conPlazo}</td><td class="num ${a.aTiempo === a.conPlazo - a.pendientes && a.conPlazo > a.pendientes ? 'celda--ok' : ''}">${a.aTiempo}</td>
          <td class="num ${a.conRetraso ? 'celda--medio' : ''}">${a.conRetraso}</td><td class="num ${a.sinEntregar ? 'celda--no' : ''}">${a.sinEntregar}</td><td class="num">${a.pendientes}</td>
          <td class="num"><strong>${a.dias}</strong></td><td class="num">${mediaTexto(a.media)}</td><td class="num">${a.maximo || '—'}</td>
        </tr>`).join('')}</tbody>
    </table>
    <h3>Por tarea</h3>
    <table>
      <thead><tr><th>Tarea</th><th class="num">Con plazo (alumnos)</th><th class="num">A tiempo</th><th class="num">Con retraso</th><th class="num">Sin entregar</th><th class="num">Pendientes</th><th class="num">Días de retraso (total)</th><th class="num">Media</th><th class="num">Máximo</th></tr></thead>
      <tbody>${r.tareas.map(t => `
        <tr>
          <td>${tituloTarea(t.id)}</td><td class="num">${t.conPlazo}</td><td class="num">${t.aTiempo}</td><td class="num">${t.conRetraso}</td><td class="num">${t.sinEntregar}</td><td class="num">${t.pendientes}</td>
          <td class="num"><strong>${t.dias}</strong></td><td class="num">${mediaTexto(t.media)}</td><td class="num">${t.maximo || '—'}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">Solo cuentan las tareas con plazo que ya están publicadas y, para cada alumno, las que son obligatorias para él (una tarea asignada, solo si está marcado). Los días son naturales, contados desde el plazo hasta el día en que se cumplió la tarea o, si todavía no la ha entregado, hasta hoy. «Pendientes»: el plazo no ha llegado y no la ha entregado todavía. «Media» y «Máximo» son de las tareas con retraso (entregadas tarde o sin entregar y con el plazo vencido). Si hay nombres en la lista, solo cuentan los alumnos de la lista. El CSV trae también las fechas de plazo y de entrega de cada tarea.</p>`;
}

function csvRetrasos(validos, deTareas) {
  const hoyDia = opcionesTareas().hoyDia;
  const r = datosRetrasos(validos, deTareas);
  const cab = ['N.º', 'Alumno', 'Código', 'Tareas con plazo', 'A tiempo', 'Con retraso', 'Sin entregar', 'Pendientes', 'Días de retraso (total)', 'Media de días (tareas con retraso)', 'Máximo de días'];
  const alumnos = r.alumnos.map(a => [a.indice + 1, a.nombre, codigoVisible(a.indice), a.conPlazo, a.aTiempo, a.conRetraso, a.sinEntregar, a.pendientes, a.dias, a.media ? decimal(a.media) : '', a.maximo || '']);
  // Una fila por alumno y tarea, con las fechas, para decidir el criterio con calma (días lectivos, por ejemplo).
  const filas = juntarTareas(nombres(), deTareas, validos, fuente.nube, tareasDe(), opcionesTareas()).filter(f => !nombres().some(Boolean) || f.nombre);
  const publicadas = new Set(tareasDe().filter(t => tareaPublicada(t, hoyDia)).map(t => t.id));
  const detalle = filas.flatMap(f => f.tareas.filter(c => c.conPlazo && publicadas.has(c.id)).map(c => [f.indice + 1, f.nombre, codigoVisible(f.indice), `T${c.id}`, plazoCsv(c), fechaCsv(c.diaEntrega), c.diasRetraso, c.entrega]));
  return [
    cab, ...alumnos,
    [],
    ['Tarea', 'Alumnos con plazo', 'A tiempo', 'Con retraso', 'Sin entregar', 'Pendientes', 'Días de retraso (total)', 'Media de días', 'Máximo de días'],
    ...r.tareas.map(t => [`T${t.id}`, t.conPlazo, t.aTiempo, t.conRetraso, t.sinEntregar, t.pendientes, t.dias, t.media ? decimal(t.media) : '', t.maximo || '']),
    [],
    ['N.º', 'Alumno', 'Código', 'Tarea', 'Plazo', 'Fecha de entrega', 'Días de retraso', 'Entrega'],
    ...detalle,
  ].map(f => (f.length ? f : ['']));
}

// --- Qué falla más -------------------------------------------------------------

// Los nombres de los ejercicios están en el practica.js de cada práctica: se
// cargan aparte la primera vez (declaracionDe) y se repinta al llegar.
const nombresEjercicio = new Map();   // 'slug/n' → nombre en español
const nombresPedidos = new Set();

function pedirNombres(practicas) {
  const faltan = practicas.filter(p => !nombresPedidos.has(p.slug));
  if (!faltan.length) return;
  faltan.forEach(p => nombresPedidos.add(p.slug));
  Promise.all(faltan.map(async p => {
    const declaracion = await declaracionDe(p);
    declaracion?.ejercicios?.forEach((e, i) => nombresEjercicio.set(`${p.slug}/${i + 1}`, e.nombre.es));
  })).then(() => {
    if ($('vista').value.startsWith(FALLOS)) pintarResultados();
    if (fuente.registro.length) pintarRegistro();
  });
}

/** Las filas de la vista: de todas las prácticas que salen en el panel, o de una tarea (con ★ o «elegir»). */
function ejerciciosDeVista(vista, practicas) {
  if (vista === FALLOS) return practicas.flatMap(p => Array.from({ length: p.nEjercicios }, (_, i) => ({ practica: p, n: i + 1, marca: '' })));
  const tarea = tareaDe(Number(vista.slice(FALLOS_TAREA.length)));
  if (!tarea) return [];
  return [...tarea.estrella.map(par => [par, '★']), ...tarea.elegir.map(par => [par, 'elegir'])]
    .map(([[slug, n], marca]) => ({ practica: practicaPorSlug(slug), n, marca }))
    .filter(e => e.practica);
}

function filasFallos(vista, practicas, validos) {
  const ejercicios = ejerciciosDeVista(vista, practicas);
  pedirNombres([...new Set(ejercicios.map(e => e.practica))]);
  const marcas = new Map(ejercicios.map(e => [`${e.practica.id}/${e.n}`, e.marca]));
  // Una tarea con progreso propio (modelo v2) cuenta solo lo hecho dentro de la tarea.
  const tarea = vista === FALLOS ? null : tareaDe(Number(vista.slice(FALLOS_TAREA.length)));
  const propia = tarea && !tarea.progresoPorPractica;
  const deCodigos = propia ? [] : validos;
  const deNube = propia ? fuente.nubeTareas.filter(d => d.tarea === tarea.id) : fuente.nube;
  return juntarFallos(nombres(), deCodigos, deNube, ejercicios).map(f => {
    const practica = practicaPorId(f.practica);
    return { ...f, practica, nombre: nombresEjercicio.get(`${practica.slug}/${f.n}`) ?? '', marca: marcas.get(`${f.practica}/${f.n}`) };
  });
}

const decimal = x => x.toLocaleString('es', { maximumFractionDigits: 1 });

function htmlFallos(vista, practicas, validos) {
  const filas = filasFallos(vista, practicas, validos);
  const conDatos = filas.filter(f => f.empezados);
  if (!conDatos.length) return '<p class="vacio">Todavía no hay nada: pega códigos o carga la nube.</p>';
  const deTarea = vista !== FALLOS;
  return `
    <table>
      <thead><tr><th>Práctica</th><th class="num">Ej.</th><th>Ejercicio</th>${deTarea ? '<th></th>' : ''}<th class="num">Lo han empezado</th><th class="num">Lo han terminado</th><th class="num">Fallos</th><th class="num">Fallos por alumno</th><th class="num">Veces sin vidas (↺)</th></tr></thead>
      <tbody>${filas.map(f => `
        <tr>
          <td>${esc(f.practica.nombre.es)}</td><td class="num">${f.n}</td><td>${esc(f.nombre)}</td>${deTarea ? `<td>${f.marca}</td>` : ''}
          <td class="num">${f.empezados || '—'}</td><td class="num">${f.empezados ? f.terminados : '—'}</td>
          <td class="num">${f.empezados ? `${f.fallos}${f.tope ? '+' : ''}` : '—'}</td>
          <td class="num"><strong>${f.empezados ? decimal(f.fallosPorAlumno) : '—'}</strong></td>
          <td class="num">${f.empezados ? f.reinicios : '—'}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">Una fila por ejercicio, de más a menos <strong>fallos por alumno que lo ha empezado</strong>. De cada alumno se toma lo mismo que en la tabla de su práctica (sus códigos o la nube, lo que tenga más terminado). Si hay nombres en la lista, solo cuentan los alumnos de la lista (así no cuenta un código de prueba). Con los códigos de resultado los fallos se cuentan hasta 15 («+») y no se saben las veces sin vidas: carga la nube para verlo todo.</p>`;
}

function csvFallos(vista, practicas, validos) {
  const cab = ['Práctica', 'Ej.', 'Ejercicio', 'En la tarea', 'Lo han empezado', 'Lo han terminado', 'Fallos', 'Fallos por alumno', 'Veces sin vidas'];
  return [cab, ...filasFallos(vista, practicas, validos).map(f => [
    f.practica.nombre.es, f.n, f.nombre, f.marca, f.empezados, f.terminados, `${f.fallos}${f.tope ? '+' : ''}`, decimal(f.fallosPorAlumno), f.reinicios,
  ])];
}

function pintarResultados() {
  const { validos, deTareas, invalidos } = pegados();
  $('avisos').innerHTML = invalidos.length
    ? `<div class="aviso aviso--error">Códigos que <strong>no son válidos</strong> (mal copiados o inventados${fuente === espacio ? ', o de una tarea que no es tuya' : ''}): ${invalidos.map(esc).join(', ')}</div>` : '';
  const practicas = practicasVisibles(validos);
  pintarSelector(practicas);
  const vista = $('vista').value;
  $('tabla-resultados').innerHTML = vista === RESUMEN ? htmlResumen(practicas, validos)
    : vista === TAREAS_SEMANA ? htmlTareas(validos, deTareas)
      : vista === RETRASOS ? htmlRetrasos(validos, deTareas)
        : vista.startsWith(FALLOS) ? htmlFallos(vista, practicas, validos)
          : htmlPractica(practicaPorId(Number(vista)), validos);
}

function descargarResultados() {
  const { validos, deTareas } = pegados();
  const vista = $('vista').value;
  if (vista === RESUMEN) return descargar('resultados-practicas-resumen.csv', csvResumen(practicasVisibles(validos), validos));
  if (vista === TAREAS_SEMANA) return descargar('resultados-tareas-de-la-semana.csv', csvTareas(validos, deTareas));
  if (vista === RETRASOS) return descargar('retrasos-en-las-tareas.csv', csvRetrasos(validos, deTareas));
  if (vista.startsWith(FALLOS)) return descargar(`que-falla-mas${vista === FALLOS ? '' : `-tarea-${vista.slice(FALLOS_TAREA.length)}`}.csv`, csvFallos(vista, practicasVisibles(validos), validos));
  const practica = practicaPorId(Number(vista));
  descargar(`resultados-${practica.slug}.csv`, csvPractica(practica, validos));
}

// --- Nube ----------------------------------------------------------------------

let firebase = null;

/** Firebase, cargado una vez por página (el SDK viene del CDN), con la sesión ya conocida. */
async function obtenerFirebase() {
  if (!firebase) {
    const { iniciarFirebase } = await import('../src/firebase.js');
    const listo = await iniciarFirebase();
    await new Promise(hecho => listo.observarSesion(hecho));
    firebase = listo;
  }
  return firebase;
}

async function mensajeDeError(e) {
  const { mensajeDeError: mensaje } = await import('../src/firebase.js');
  return mensaje(e);
}

/** Entra con la cuenta de Google del profesor (una vez por página). false si no es la suya. */
async function conectarProfesor(estado) {
  await obtenerFirebase();
  if (!firebase.usuario()) await firebase.entrarConGoogle();
  if (!firebase.esProfesor(firebase.usuario())) {
    estado.textContent = 'Esa cuenta no es la del profesor.';
    await firebase.salir();
    return false;
  }
  return true;
}

/** «Cargar de la nube» del sistema actual: las colecciones enteras, como siempre. */
async function cargarNubeAntigua() {
  const estado = $('estado-nube');
  estado.textContent = 'Conectando…';
  try {
    if (!(await conectarProfesor(estado))) return;
    // Cuatro colecciones: la de todas las prácticas, la antigua de `divisores/`, el progreso de
    // las tareas v2 y las asignaciones. Si una falla (por ejemplo, una regla sin publicar), se enseñan las otras.
    const lecturas = [
      ['practicas', firebase.datos.listarPracticas()],
      ['divisores', firebase.datos.listarPracticaDivisores()],
      ['practicas-tareas', firebase.datos.listarPracticasTareas()],
      ['practicas-asignaciones', firebase.datos.listarAsignaciones()],
    ];
    const resultado = await Promise.allSettled(lecturas.map(([, p]) => p));
    const leidas = Object.fromEntries(lecturas.map(([nombre], i) => [nombre, resultado[i]]));
    const ok = nombre => (leidas[nombre].status === 'fulfilled' ? leidas[nombre].value : null);
    antigua.nube = [
      ...leerDocumentos(ok('practicas') ?? [], 'practicas'),
      ...leerDocumentos(ok('divisores') ?? [], 'divisores'),
    ];
    antigua.nubeTareas = leerDocumentos(ok('practicas-tareas') ?? [], 'practicas-tareas');
    // Sin leer las asignaciones no se puede guardar nada: se machacaría lo que hubiera.
    antigua.asignaciones = leerAsignaciones(ok('practicas-asignaciones') ?? []);
    antigua.asignacionesCargadas = ok('practicas-asignaciones') !== null;
    const fallos = lecturas.map(([nombre]) => [nombre, leidas[nombre]]).filter(([, r]) => r.status === 'rejected');
    const textos = await Promise.all(fallos.map(async ([nombre, r]) => ` No se ha podido leer la colección «${nombre}»: ${await mensajeDeError(r.reason)}`));
    ponerEstado(antigua, 'estado-nube', `Cargados ${antigua.nube.length} registros de práctica y ${antigua.nubeTareas.length} de tareas, de ${new Set([...antigua.nube, ...antigua.nubeTareas].map(d => d.indice)).size} alumnos, y las asignaciones de ${antigua.asignaciones.length} (${new Date().toLocaleTimeString('es')}).` + textos.join(''));
    pintarResultados();
    pintarAsignar();
  } catch (e) {
    ponerEstado(antigua, 'estado-nube', `No se ha podido cargar: ${await mensajeDeError(e)}`);
  }
}

const cargarNube = () => (fuente === espacio ? cargarEspacio() : cargarNubeAntigua());

// --- 3. Fallos, uno a uno (registro de la tarea 39) ------------------------------

/** «N.º 12 · Ana García (ABCD)», o el código solo si no está en la lista. */
function nombreAlumno(codigo) {
  const indice = fuente.indiceDe(codigo);
  const nombre = indice === null ? '' : nombres()[indice];
  return indice === null ? verCodigo(codigo) : `${indice + 1}${nombre ? ` · ${nombre}` : ''} (${verCodigo(codigo)})`;
}

const nombreEjercicio = (slug, n) => nombresEjercicio.get(`${slug}/${n}`) ?? '';
const nombrePractica = slug => practicaPorSlug(slug)?.nombre.es ?? slug;
const destrezasDe = slug => (DESTREZAS[slug] ?? []).join(' ');
const fechaHora = t => new Date(t).toLocaleString('es', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });

/**
 * El filtro de tarea del registro. Los fallos llevan el campo `tarea` (tarea 51): «Tarea N»
 * enseña los de esa tarea; «Sin tarea», los que no lo traen (práctica libre o anteriores).
 * Para la tarea 1, que cuenta también la práctica libre, los fallos sin campo de sus
 * ejercicios siguen contando (así no se pierden los anteriores al campo).
 */
function filtroTareaRegistro() {
  const valor = $('fallos-tarea').value;
  if (valor === 'ninguna') return { tarea: 'ninguna' };
  const tarea = tareaDe(Number(valor));
  if (!tarea) return {};
  return { tarea: tarea.id, ejercicios: tarea.progresoPorPractica ? [...tarea.estrella, ...tarea.elegir] : undefined };
}

function filtrosRegistro() {
  const lista = nombres();
  const deLista = new Set(lista.map((n, i) => (n ? fuente.codigoDe(i) : null)).filter(Boolean));
  const alumno = $('fallos-alumno').value || undefined;
  return {
    ...filtroTareaRegistro(),
    practica: $('fallos-practica').value || undefined,
    alumno,
    // Con nombres en la lista, solo cuentan los de la lista (fuera queda el código de
    // prueba), salvo que se elija a mano un alumno concreto.
    alumnos: deLista.size && !alumno ? deLista : undefined,
  };
}

function pintarSelectoresRegistro() {
  const conservar = (id, html) => { const v = $(id).value; $(id).innerHTML = html; if ([...$(id).options].some(o => o.value === v)) $(id).value = v; };
  const registro = fuente.registro;
  conservar('fallos-tarea', '<option value="">Todas</option><option value="ninguna">Sin tarea (práctica libre)</option>' + tareasDe().map(t => `<option value="${t.id}">Tarea ${t.id}</option>`).join(''));
  const slugs = [...new Set(registro.map(f => f.practica))].sort((a, b) => nombrePractica(a).localeCompare(nombrePractica(b)));
  conservar('fallos-practica', '<option value="">Todas</option>' + slugs.map(s => `<option value="${esc(s)}">${esc(nombrePractica(s))}</option>`).join(''));
  const codigos = [...new Set(registro.map(f => f.alumno))].sort((a, b) => (fuente.indiceDe(a) ?? 9999) - (fuente.indiceDe(b) ?? 9999));
  conservar('fallos-alumno', '<option value="">Todos</option>' + codigos.map(c => `<option value="${esc(c)}">${esc(nombreAlumno(c))}</option>`).join(''));
}

function pintarRegistro() {
  const registro = fuente.registro;
  if (!registro.length) { $('tabla-fallos').innerHTML = ''; return; }
  pedirNombres([...new Set(registro.map(f => f.practica))].map(practicaPorSlug).filter(Boolean));
  const r = agruparFallos(registro, filtrosRegistro());
  if (!r.total) {
    const soloLista = filtrosRegistro().alumnos ? ' Solo cuentan los alumnos de la lista: para ver otro código, elígelo en «Alumno».' : '';
    $('tabla-fallos').innerHTML = `<p class="vacio">Ningún fallo con estos filtros.${soloLista}</p>`;
    return;
  }
  const ejemplo = e => `<div class="pequeno" style="min-width: 18rem; margin-bottom: .4rem"><code style="white-space: normal; word-break: break-all">${esc(e.item)}</code><br>${esc(e.feedback)}${e.respuesta ? ` <em>(contestó: ${esc(e.respuesta)})</em>` : ''} · ${esc(verCodigo(e.alumno))}, ${fechaHora(e.t)}</div>`;
  $('tabla-fallos').innerHTML = `
    <h3>Los fallos más repetidos (${r.total} fallos)</h3>
    <table>
      <thead><tr><th class="num">Veces</th><th class="num">Alumnos</th><th>Práctica</th><th class="num">Ej.</th><th>Ejercicio</th><th>Error</th><th>Destrezas de la práctica</th><th>Ejemplos (los más recientes)</th></tr></thead>
      <tbody>${r.grupos.map(g => `
        <tr>
          <td class="num"><strong>${g.veces}</strong></td><td class="num">${g.alumnos}</td>
          <td>${esc(nombrePractica(g.practica))}</td><td class="num">${g.ejercicio}</td><td>${esc(nombreEjercicio(g.practica, g.ejercicio))}</td>
          <td>${g.error ? `<code>${esc(g.error)}</code>` : '—'}</td><td class="pequeno">${esc(destrezasDe(g.practica))}</td>
          <td>${g.ejemplos.map(ejemplo).join('')}</td>
        </tr>`).join('')}</tbody>
    </table>
    <h3>Qué le cuesta a cada alumno</h3>
    <table>
      <thead><tr><th>Alumno</th><th class="num">Fallos</th><th>Ejercicios (de más a menos fallos)</th></tr></thead>
      <tbody>${r.porAlumno.map(a => `
        <tr>
          <td>${esc(nombreAlumno(a.alumno))}</td><td class="num"><strong>${a.total}</strong></td>
          <td>${a.ejercicios.map(e => `${esc(nombrePractica(e.practica))} ${e.ejercicio}${nombreEjercicio(e.practica, e.ejercicio) ? ` (${esc(nombreEjercicio(e.practica, e.ejercicio))})` : ''}: <strong>${e.veces}</strong>`).join(' · ')}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">Se agrupa por tipo de error en las prácticas que lo dan y, si no, por ejercicio. Las destrezas son las de la práctica entera (docs/practicas-unidad2.md, §7). ${filtrosRegistro().alumnos ? 'Solo cuentan los alumnos de la lista.' : ''}</p>`;
}

function csvRegistro() {
  const filas = filtrarFallos(fuente.registro, filtrosRegistro());
  const cab = ['Fecha', 'N.º', 'Alumno', 'Código', 'Práctica', 'Ej.', 'Ejercicio', 'Destrezas de la práctica', 'Error', 'Respuesta', 'Ítem', 'Explicación que vio', 'Idioma', 'Repitiendo un ejercicio ya terminado', 'Tarea'];
  return [cab, ...filas.map(x => {
    const i = fuente.indiceDe(x.alumno);
    return [fechaHora(x.t), i === null ? '' : i + 1, i === null ? '' : nombres()[i] ?? '', verCodigo(x.alumno), nombrePractica(x.practica), x.ejercicio, nombreEjercicio(x.practica, x.ejercicio),
      destrezasDe(x.practica), x.error ?? '', x.respuesta ?? '', x.item, x.feedback, x.idioma, x.repeticion ? 'sí' : 'no', x.tarea ?? ''];
  })];
}

async function cargarRegistro() {
  const f = fuente;
  const estado = $('fallos-estado');
  estado.textContent = 'Conectando…';
  try {
    if (f === antigua && !(await conectarProfesor(estado))) return;
    const [a, m, d] = ($('fallos-desde').value || '2026-09-01').split('-').map(Number);
    const desde = new Date(a, m - 1, d).getTime();
    let nuevos = null;
    if (f === antigua) antigua.registro = await leerFallos(desde, await firebase.usuario().getIdToken());
    else nuevos = await cargarRegistroEspacio(desde);
    ponerEstado(f, 'fallos-estado', `Cargados ${f.registro.length} fallos de ${new Set(f.registro.map(x => x.alumno)).size} alumnos desde el ${d}/${m}/${a}${nuevos === null ? '' : ` (${nuevos} pedidos a la nube; los demás estaban en este navegador)`} (${new Date().toLocaleTimeString('es')}).`);
    if (f !== fuente) return;
    pintarSelectoresRegistro();
    pintarRegistro();
  } catch (e) {
    ponerEstado(f, 'fallos-estado', `No se han podido cargar los fallos: ${await mensajeDeError(e)}`);
  }
}

// --- 4. Asignar tareas (DISENO.md, B.3) --------------------------------------------

const marcasAsignar = new Map();   // 'indice|tarea' → bool: lo marcado a mano y aún sin guardar

const asignablesAhora = () => tareasDe().filter(t => t.asignada);
const guardadas = indice => fuente.asignaciones.find(a => a.indice === indice)?.tareas ?? [];
const marcada = (indice, id) => (marcasAsignar.has(`${indice}|${id}`) ? marcasAsignar.get(`${indice}|${id}`) : guardadas(indice).includes(id));
/** Los alumnos de la lista que se pueden marcar: con nombre y con código (en el sistema nuevo, hay que generarlo antes). */
const alumnosAsignables = () => nombres().map((nombre, indice) => ({ indice, nombre })).filter(a => a.nombre && fuente.codigoDe(a.indice));

function pintarAsignar() {
  const tareas = asignablesAhora();
  const alumnos = alumnosAsignables();
  $('asignar-guardar').disabled = !fuente.asignacionesCargadas || !tareas.length || !alumnos.length;
  if (!tareas.length) {
    $('tabla-asignar').innerHTML = fuente === antigua
      ? '<p class="vacio">Ninguna tarea es <code>asignada</code> en <code>practicas/_comun/tareas.js</code> (campo <code>asignada: true</code>): no hay nada que asignar.</p>'
      : '<p class="vacio">Ninguna de tus tareas es «solo para algunos alumnos» (se marca en «Tareas»): no hay nada que asignar.</p>';
    return;
  }
  if (!alumnos.length) {
    $('tabla-asignar').innerHTML = fuente === antigua
      ? '<p class="vacio">Escribe antes la lista de alumnos (arriba).</p>'
      : '<p class="vacio">Escribe antes la lista de alumnos y genera sus códigos (arriba, en «Mis alumnos»).</p>';
    return;
  }
  $('tabla-asignar').innerHTML = `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${tareas.map(t => `<th class="practica">T${t.id} · ${esc(t.titulo.es)}${t.hasta ? `<br><span class="pequeno">plazo ${t.hasta.split('-').reverse().join('/')}</span>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${alumnos.map(a => `
        <tr>
          <td class="num">${a.indice + 1}</td><td>${esc(a.nombre)}</td><td><code>${codigoVisible(a.indice)}</code></td>
          ${tareas.map(t => `<td class="num"><input type="checkbox" data-asignar="${a.indice}|${t.id}" aria-label="Tarea ${t.id} para ${esc(a.nombre)}"${marcada(a.indice, t.id) ? ' checked' : ''}></td>`).join('')}
        </tr>`).join('')}</tbody>
    </table>`;
}

async function guardarAsignaciones() {
  const f = fuente;
  const estado = $('asignar-estado');
  if (!f.asignacionesCargadas) { estado.textContent = 'Carga primero la nube (arriba, «Cargar de la nube»): hace falta saber qué hay ya guardado.'; return; }
  estado.textContent = 'Conectando…';
  try {
    if (f === antigua && !(await conectarProfesor(estado))) return;
    const escribir = f === antigua ? firebase.datos.guardarAsignacion : firebase.datos.panel.guardarAsignacion;
    const ids = asignablesAhora().map(t => t.id);
    let guardados = 0;
    for (const a of alumnosAsignables()) {
      const previas = guardadas(a.indice);
      const nuevas = asignacionesParaGuardar(previas, ids, ids.filter(id => marcada(a.indice, id)));
      const igual = nuevas.length === previas.length && nuevas.every((id, i) => id === previas[i]);
      // Sin cambios no se escribe; y a un alumno sin documento y sin nada marcado tampoco se le crea uno.
      if (igual) continue;
      await escribir(f.codigoDe(a.indice), nuevas);
      const resto = f.asignaciones.filter(x => x.indice !== a.indice);
      f.asignaciones = [...resto, { indice: a.indice, tareas: nuevas }];
      guardados++;
    }
    marcasAsignar.clear();
    ponerEstado(f, 'asignar-estado', guardados ? `Guardadas las asignaciones de ${guardados} alumno${guardados === 1 ? '' : 's'} (${new Date().toLocaleTimeString('es')}).` : 'No había cambios que guardar.');
    if (f !== fuente) return;
    pintarAsignar();
    pintarResultados();
  } catch (e) {
    ponerEstado(f, 'asignar-estado', `No se han podido guardar: ${await mensajeDeError(e)}`);
  }
}

// --- Cambiar de sistema -----------------------------------------------------------

/** Lo que es de cada sistema en los elementos compartidos de las vistas. */
const TEXTOS_POR_SISTEMA = ['estado-nube', 'asignar-estado', 'fallos-estado'];

/** Pone las vistas sobre los datos de `f` (guarda los avisos y los códigos pegados del otro sistema). */
function usarFuente(f) {
  if (f !== fuente) {
    for (const id of TEXTOS_POR_SISTEMA) fuente.textos[id] = $(id).textContent;
    fuente.textos.pegados = $('pegados').value;
    fuente = f;
    for (const id of TEXTOS_POR_SISTEMA) $(id).textContent = f.textos[id] ?? '';
    $('pegados').value = f.textos.pegados ?? '';
    marcasAsignar.clear();
  }
  $('panel').dataset.modo = f.modo;
  $('modo').value = f.modo;
  repintarVistas();
}

function repintarVistas() {
  pintarResultados();
  pintarSelectoresRegistro();
  pintarRegistro();
  pintarAsignar();
}

/** Qué se ve: la pantalla de entrar, uno de los dos sistemas y las vistas comunes. */
function mostrar({ acceso = false, antiguo = false, nuevo = false } = {}) {
  $('acceso').hidden = !acceso;
  $('modo-antiguo').hidden = !antiguo;
  $('modo-nuevo').hidden = !nuevo;
  $('vistas').hidden = !(antiguo || nuevo);
}

/**
 * El sistema con que se abre la página: el último usado en este navegador o, la
 * primera vez, el actual si aquí ya hay una lista del panel antiguo (los
 * navegadores de Juan Luis) y el nuevo si no (los de sus compañeros).
 */
function modoInicial() {
  const guardado = leerLocal(CLAVE_MODO);
  if (guardado === 'antiguo' || guardado === 'nuevo') return guardado;
  return leerLocal(CLAVE_LISTA) ? 'antiguo' : 'nuevo';
}

function abrirAntiguo() {
  escribirLocal(CLAVE_MODO, 'antiguo');
  $('barra-modo').hidden = false;
  $('selector-modo').hidden = false;
  mostrar({ antiguo: true });
  usarFuente(antigua);
}

// --- Sistema nuevo: entrar (DISENO.md, A.2) -----------------------------------------

const panelDatos = () => firebase.datos.panel;

/** La pantalla de entrar: 'entrar', 'sin-alta', 'baja' o 'error' (con `texto`). */
function pintarAcceso(caso, texto = '') {
  mostrar({ acceso: true });
  $('barra-modo').hidden = true;
  const conCuenta = Boolean(firebase?.usuario());
  const correo = firebase?.usuario()?.email ?? '';
  $('acceso-texto').innerHTML = {
    'entrar': 'Entra con tu cuenta de Google del centro para ver tus alumnos y sus resultados.',
    'sin-alta': '<strong>Aún no tienes acceso. Juan Luis tiene que darte de alta.</strong>',
    'baja': '<strong>Tu acceso está desactivado.</strong> Habla con Juan Luis si crees que es un error.',
    'error': 'No se ha podido entrar.',
  }[caso];
  $('acceso-estado').textContent = caso === 'sin-alta'
    ? `Le ha llegado tu solicitud con tu correo (${correo}). Cuando te dé de alta, vuelve a esta página o pulsa «Volver a comprobar».${texto ? ` ${texto}` : ''}`
    : texto;
  $('acceso-entrar').textContent = conCuenta && caso !== 'entrar' ? 'Volver a comprobar' : 'Entrar con Google';
  $('acceso-salir').hidden = !conCuenta;
  $('acceso-antiguo').hidden = conCuenta && caso !== 'error';
}

/** Abre el sistema nuevo: si ya hay sesión, entra; si no, la pantalla de entrar. */
async function abrirNuevo() {
  escribirLocal(CLAVE_MODO, 'nuevo');
  pintarAcceso('entrar', 'Conectando…');
  $('acceso-entrar').disabled = true;
  try {
    await obtenerFirebase();
  } catch (e) {
    pintarAcceso('error', `No se ha podido conectar con la nube: ${await mensajeDeError(e)}`);
    return;
  } finally {
    $('acceso-entrar').disabled = false;
  }
  if (!firebase.usuario()) { pintarAcceso('entrar'); return; }
  await comprobarAcceso();
}

async function entrarNuevo() {
  try {
    await obtenerFirebase();
    if (!firebase.usuario()) await firebase.entrarConGoogle();
  } catch (e) {
    pintarAcceso('error', await mensajeDeError(e));
    return;
  }
  await comprobarAcceso();
}

async function salirNuevo() {
  try { await firebase?.salir(); } catch { /* ya estaba fuera */ }
  $('cuenta').textContent = '';
  $('salir').hidden = true;
  if (fuente === espacio || !$('acceso').hidden) pintarAcceso('entrar');
}

/** Con la sesión abierta: según `estadoProfesor()`, la solicitud de alta, el aviso de baja o el espacio. */
async function comprobarAcceso() {
  const usuario = firebase.usuario();
  pintarAcceso('entrar', 'Comprobando tu acceso…');
  let estado;
  try {
    estado = await panelDatos().estadoProfesor();
  } catch (e) {
    pintarAcceso('error', await mensajeDeError(e));
    return;
  }
  if (estado === 'sin-alta') {
    let aviso = '';
    try { await panelDatos().pedirAlta(); } catch (e) { aviso = `(No se ha podido dejar la solicitud: ${await mensajeDeError(e)}.)`; }
    pintarAcceso('sin-alta', aviso);
    return;
  }
  if (estado === 'baja') { pintarAcceso('baja'); return; }
  $('cuenta').textContent = usuario.email ?? '';
  $('salir').hidden = false;
  $('barra-modo').hidden = false;
  $('selector-modo').hidden = estado !== 'admin';   // los compañeros solo tienen el sistema nuevo
  await montarEspacio(usuario, estado === 'admin');
}

// --- Sistema nuevo: el espacio ------------------------------------------------------

const claveListaEspacio = uid => `practicas.profesor.${uid}.lista`;
/** Lo último que se subió o se bajó cifrado: `{ texto, actualizado }`; sirve para saber si hay cambios sin subir o una lista más nueva en la nube. */
const claveListaSubida = uid => `practicas.profesor.${uid}.lista-subida`;
const claveFallosDesde = uid => `practicas.profesor.${uid}.fallos-desde`;

let contrasenaSesion = null;   // la de la lista, solo mientras la página esté abierta (nunca se guarda)
let modulosMontados = false;
const alCargar = [];           // avisos de `contexto.alCargar`

/** Vacía lo de otro profesor (otra cuenta en el mismo navegador). */
function reiniciarEspacio(uid, esAdmin) {
  Object.assign(espacio, datosVacios(), {
    uid, esAdmin, codigos: [], codigosLeidos: false, indices: indicesDeCodigos([]),
    config: { unidades: [], tareas: [] }, configLeida: false, cifrada: null,
    documentos: { 'progreso-libre': [], 'progreso-tareas': [], 'asignaciones': [] },
  });
  contrasenaSesion = null;
  cache = null;
}

/**
 * Lo que reciben `montar` de `profesor-tareas.js` (tarea 67) y de `profesor-hoy.js`
 * (tarea 68). Está documentado allí.
 */
const contexto = {
  get uid() { return espacio.uid; },
  get esAdmin() { return espacio.esAdmin; },
  get datos() { return panelDatos(); },
  config: () => espacio.config,
  cambiarConfig: config => { espacio.config = config; pintarTareasEspacio(); if (fuente === espacio) repintarVistas(); },
  alumnos: () => filasMisAlumnos(espacio.nombres(), espacio.codigos),
  resultados: () => ({ nube: espacio.nube, nubeTareas: espacio.nubeTareas, asignaciones: espacio.asignaciones, registro: espacio.registro, documentos: espacio.documentos }),
  alCargar: fn => { alCargar.push(fn); },
  recargar: () => cargarEspacio(),
};

async function montarEspacio(usuario, esAdmin) {
  const uid = usuario.uid;
  if (espacio.uid !== uid) reiniciarEspacio(uid, esAdmin);
  mostrar({ nuevo: true });
  $('seccion-profesores').hidden = !esAdmin;
  $('lista-espacio').value = leerLocal(claveListaEspacio(uid)) ?? '';
  usarFuente(espacio);
  pintarMisAlumnos();
  pintarTareasEspacio();
  $('estado-codigos').textContent = 'Abriendo tu espacio…';
  try {
    // El administrador es también un profesor más, con su espacio (A.4): las reglas le piden estar de alta.
    if (esAdmin) {
      const profesores = await panelDatos().listarProfesores();
      if (!profesores.some(p => p.id === uid && p.activo)) await panelDatos().darDeAlta(uid);
    }
    await panelDatos().crearEspacio();
    const [codigos, config, cifrada] = await Promise.all([panelDatos().listarMisCodigos(), panelDatos().leerConfig(), panelDatos().leerNombresCifrados()]);
    ponerCodigos(codigos);
    ponerConfig(config);
    revisarListaCifrada(cifrada);
    $('estado-codigos').textContent = '';
  } catch (e) {
    $('estado-codigos').textContent = `No se ha podido abrir tu espacio: ${await mensajeDeError(e)}`;
    return;
  }
  pintarMisAlumnos();
  if (!modulosMontados) {
    modulosMontados = true;
    editorTareas.montar($('editor-tareas'), contexto);
    panelHoy.montar($('panel-hoy'), contexto);
  }
  if (esAdmin) pintarProfesores();
  await cargarEspacio();
}

/** Los códigos del profesor (`listarMisCodigos`): con ellos se sabe de quién es cada documento. */
function ponerCodigos(codigos) {
  espacio.codigos = codigos;
  espacio.codigosLeidos = true;
  espacio.indices = indicesDeCodigos(codigos);
  aplicarDocumentos();
  pintarMisAlumnos();
  if (fuente === espacio) repintarVistas();
}

function ponerConfig(leida) {
  const config = leida ? configDeJSON(leida.json) : null;
  espacio.config = config ?? { unidades: [], tareas: [] };
  espacio.configIlegible = Boolean(leida) && !config;
  espacio.configLeida = true;
  pintarTareasEspacio();
}

/**
 * «Longitud de los códigos nuevos» (tarea 72): se guarda en la configuración del
 * espacio (`longitudCodigo`) y solo afecta a los que se generen después. Solo con
 * la configuración leída y entendida, para no pisar las tareas guardadas.
 */
async function cambiarLongitud() {
  const elegida = Number($('longitud-codigos').value) === 4 ? 4 : 8;
  if (!espacio.configLeida || espacio.configIlegible || elegida === longitudDeCodigos(espacio.config)) return pintarMisAlumnos();
  $('longitud-codigos').disabled = true;
  const nueva = { ...espacio.config, longitudCodigo: elegida };
  try {
    await panelDatos().guardarConfig(configAJSON(nueva));
    contexto.cambiarConfig(nueva);
    $('estado-codigos').textContent = `Los códigos que generes a partir de ahora tendrán ${elegida} caracteres. Los ya repartidos no cambian.`;
  } catch (e) {
    $('estado-codigos').textContent = `No se ha podido guardar la longitud: ${await mensajeDeError(e)}`;
  }
  pintarMisAlumnos();
}

function pintarTareasEspacio() {
  pintarTablaTareas(espacio.config.tareas, 'destino-espacio', 'tabla-tareas-espacio',
    `<p class="vacio">${espacio.configIlegible ? 'Tus tareas guardadas en la nube no se entienden (¿JSON dañado?).' : 'Aún no tienes tareas.'}</p>`);
  pintarMisAlumnos();
}

// --- «Mis alumnos»: códigos, CSV y tarjetas (F.1) ---

function pintarMisAlumnos() {
  const lista = espacio.nombres();
  const filas = filasMisAlumnos(lista, espacio.codigos);
  const faltan = faltanCodigos(lista, espacio.codigos);
  $('generar-codigos').disabled = !espacio.codigosLeidos || !faltan.length;
  $('generar-codigos').textContent = faltan.length ? `Generar códigos (${faltan.length} sin código)` : 'Generar códigos';
  $('longitud-codigos').value = String(longitudDeCodigos(espacio.config));
  $('longitud-codigos').disabled = !espacio.configLeida || espacio.configIlegible;
  const enlace = codigo => enlaceDe(codigo, 'destino-espacio', 'idioma-espacio');
  $('tabla-espacio').innerHTML = filas.length ? `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th><th>Enlace directo</th></tr></thead>
      <tbody>${filas.map(f => `<tr><td class="num">${f.n}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td>${f.codigo ? `<code>${mostrarCodigoSecreto(f.codigo)}</code>` : '<span class="celda--no">sin código</span>'}</td><td>${f.codigo ? enlace(f.codigo) : ''}</td></tr>`).join('')}</tbody>
    </table>` : '';
}

/** «Generar códigos»: uno al azar para cada línea sin código; si alguno ya existe en la nube (de otro profesor), otro. */
async function generarCodigos() {
  const estado = $('estado-codigos');
  $('generar-codigos').disabled = true;
  estado.textContent = 'Generando y guardando los códigos…';
  try {
    let creados = 0;
    for (let vuelta = 0; vuelta < 5; vuelta++) {
      const faltan = faltanCodigos(espacio.nombres(), espacio.codigos);
      if (!faltan.length) break;
      const longitud = longitudDeCodigos(espacio.config);
      const lista = repartirCodigos(faltan, espacio.codigos.map(c => c.id), () => codigoSecreto(longitud));
      const { creados: hechos } = await panelDatos().crearCodigos(lista);
      const si = new Set(hechos);
      const ahora = Date.now();
      ponerCodigos([...espacio.codigos, ...lista.filter(x => si.has(x.codigo)).map(x => ({ id: x.codigo, profesor: espacio.uid, n: x.n, alta: ahora }))]);
      creados += hechos.length;
    }
    const quedan = faltanCodigos(espacio.nombres(), espacio.codigos).length;
    estado.textContent = `${creados === 1 ? 'Un código nuevo' : `${creados} códigos nuevos`}, guardados en la nube.`
      + (quedan ? ` Quedan ${quedan} sin código: vuelve a pulsar.` : '')
      + (listaSinSubir() ? ' Guarda también la lista cifrada (abajo), para tener los nombres en otro ordenador.' : '');
  } catch (e) {
    estado.textContent = `No se han podido generar: ${await mensajeDeError(e)}`;
  }
  pintarMisAlumnos();
}

const filasConCodigo = () => filasMisAlumnos(espacio.nombres(), espacio.codigos).filter(f => f.codigo);

function csvEspacio() {
  return [['N.º', 'Alumno', 'Código', 'Enlace'], ...filasConCodigo().map(f => [f.n, f.nombre, mostrarCodigoSecreto(f.codigo), enlaceDe(f.codigo, 'destino-espacio', 'idioma-espacio')])];
}

/** Tarjetas para recortar (nombre, código y enlace corto): CSS de impresión, sin bibliotecas ni QR. */
function imprimirTarjetas() {
  const filas = filasConCodigo().filter(f => f.nombre);
  if (!filas.length) { $('estado-codigos').textContent = 'No hay alumnos con nombre y código que imprimir.'; return; }
  $('tarjetas').innerHTML = filas.map(f => `
    <div class="tarjeta-alumno"><strong>${esc(f.nombre)}</strong>Tu código: <code>${mostrarCodigoSecreto(f.codigo)}</code><br>${esc(`${URL_PORTADA}?c=${f.codigo}`)}</div>`).join('');
  window.print();
}

// --- La lista de nombres, cifrada (F.1) ---

function leerSubida(uid) {
  try { return JSON.parse(leerLocal(claveListaSubida(uid))) ?? null; } catch { return null; }
}
const listaSinSubir = () => espacio.nombres().some(Boolean) && leerSubida(espacio.uid)?.texto !== $('lista-espacio').value;

/** Al abrir: si en la nube hay una lista más nueva que la de este ordenador, pide la contraseña para descifrarla. */
function revisarListaCifrada(cifrada) {
  espacio.cifrada = cifrada;
  const subida = leerSubida(espacio.uid);
  const aqui = $('lista-espacio').value.trim();
  // También con la lista de aquí vacía: es otro ordenador, o se ha borrado sin querer.
  const masNueva = Boolean(cifrada) && (!aqui || !subida || (cifrada.actualizado ?? 0) > (subida.actualizado ?? 0));
  $('caja-descifrar').hidden = !masNueva;
  if (masNueva) {
    $('texto-descifrar').innerHTML = `Tu lista de nombres está guardada <strong>cifrada</strong> en la nube (${fechaHora(cifrada.actualizado)})${aqui ? ' y es más reciente que la de este ordenador: al descifrarla, sustituye a la de aquí' : ''}. Escribe tu contraseña para verla aquí.`;
  }
  pintarEstadoNombres();
}

function pintarEstadoNombres() {
  const subida = leerSubida(espacio.uid);
  const hayLista = espacio.nombres().some(Boolean);
  $('estado-nombres').textContent = !espacio.cifrada
    ? (hayLista ? 'La lista aún no está guardada en la nube: ponle una contraseña para poder abrirla en otro ordenador.' : '')
    : subida?.texto === $('lista-espacio').value
      ? `Guardada en la nube, cifrada (${fechaHora(subida.actualizado)}).`
      : hayLista ? 'Hay cambios en la lista que no están en la nube: guárdala otra vez.' : '';
  $('contrasena').placeholder = contrasenaSesion ? 'Déjala en blanco para usar la de antes' : 'Contraseña (10 caracteres o más)';
}

async function descifrarLista() {
  const estado = $('estado-descifrar');
  const contrasena = $('contrasena-descifrar').value;
  estado.textContent = 'Descifrando…';
  try {
    const texto = await descifrar(espacio.cifrada, contrasena);
    $('lista-espacio').value = texto;
    escribirLocal(claveListaEspacio(espacio.uid), texto);
    escribirLocal(claveListaSubida(espacio.uid), JSON.stringify({ texto, actualizado: espacio.cifrada.actualizado ?? Date.now() }));
    contrasenaSesion = contrasena;
    $('contrasena-descifrar').value = '';
    $('caja-descifrar').hidden = true;
    estado.textContent = '';
    alCambiarLista();
  } catch (e) {
    estado.textContent = e instanceof ContrasenaIncorrecta
      ? 'Esa no es la contraseña de la lista. Si la has olvidado, vuelve a pegar la lista abajo y guárdala con otra contraseña (los códigos no se pierden).'
      : `No se ha podido descifrar: ${e.message}`;
  }
}

let avisoSustituir = false;   // en la nube hay una lista más nueva sin descifrar: el primer clic avisa

async function guardarNombres() {
  const estado = $('estado-nombres');
  let contrasena = $('contrasena').value;
  if (!contrasena && contrasenaSesion) contrasena = contrasenaSesion;
  else {
    const error = errorContrasena(contrasena);
    if (error) { estado.textContent = error; return; }
    if (contrasena !== $('contrasena2').value) { estado.textContent = 'Las dos contraseñas no coinciden.'; return; }
  }
  if (!$('caja-descifrar').hidden && !avisoSustituir) {
    avisoSustituir = true;
    estado.textContent = 'En la nube hay una lista más reciente que no has descifrado. Si guardas, la sustituye la de aquí: pulsa otra vez para guardar igualmente.';
    return;
  }
  avisoSustituir = false;
  estado.textContent = 'Cifrando y guardando…';
  try {
    const texto = $('lista-espacio').value;
    const dato = await cifrar(texto, contrasena);
    await panelDatos().guardarNombresCifrados(dato);
    const actualizado = Date.now();
    espacio.cifrada = { ...dato, actualizado };
    escribirLocal(claveListaSubida(espacio.uid), JSON.stringify({ texto, actualizado }));
    contrasenaSesion = contrasena;
    $('contrasena').value = '';
    $('contrasena2').value = '';
    $('caja-descifrar').hidden = true;
    pintarEstadoNombres();
  } catch (e) {
    estado.textContent = `No se ha podido guardar: ${await mensajeDeError(e)}`;
  }
}

/** La lista ha cambiado (tecleada o descifrada): todo lo que enseña nombres. */
function alCambiarLista() {
  pintarMisAlumnos();
  pintarEstadoNombres();
  if (fuente === espacio) repintarVistas();
}

// --- «Profesores»: altas y bajas (A.2; solo el administrador) ---

async function pintarProfesores() {
  const estado = $('estado-profesores');
  estado.textContent = 'Leyendo…';
  try {
    const [solicitudes, profesores] = await Promise.all([panelDatos().listarSolicitudes(), panelDatos().listarProfesores()]);
    // Las solicitudes no se borran al dar de alta: son lo único que dice el correo y el nombre de cada uno.
    const deAlta = new Set(profesores.map(p => p.id));
    const quien = new Map(solicitudes.map(s => [s.id, s]));
    const pendientes = solicitudes.filter(s => !deAlta.has(s.id));
    const fecha = t => (t ? new Date(t).toLocaleDateString('es') : '');
    $('tabla-solicitudes').innerHTML = pendientes.length ? `
      <table>
        <thead><tr><th>Nombre</th><th>Correo</th><th>Pedido el</th><th></th></tr></thead>
        <tbody>${pendientes.map(s => `
          <tr><td>${esc(s.nombre ?? '')}</td><td>${esc(s.email ?? '')}</td><td>${fecha(s.pedido)}</td>
          <td><button type="button" data-alta="${esc(s.id)}">Dar de alta</button> <button type="button" class="secundario" data-rechazar="${esc(s.id)}">Rechazar</button></td></tr>`).join('')}</tbody>
      </table>` : '<p class="vacio">No hay solicitudes pendientes.</p>';
    $('tabla-profesores').innerHTML = profesores.length ? `
      <table>
        <thead><tr><th>Nombre</th><th>Correo</th><th>De alta desde</th><th>Estado</th><th></th></tr></thead>
        <tbody>${profesores.map(p => {
          const yo = p.id === espacio.uid;
          const s = quien.get(p.id);
          return `
          <tr><td>${esc(yo ? 'Tú' : s?.nombre ?? '')}</td><td>${esc(yo ? firebase.usuario()?.email ?? '' : s?.email ?? p.id)}</td><td>${fecha(p.alta)}</td>
          <td class="${p.activo ? 'celda--ok' : 'celda--no'}">${p.activo ? 'activo' : 'de baja'}</td>
          <td>${yo ? '' : p.activo ? `<button type="button" class="secundario" data-baja="${esc(p.id)}">Dar de baja</button>` : `<button type="button" data-alta="${esc(p.id)}">Volver a dar de alta</button>`}</td></tr>`;
        }).join('')}</tbody>
      </table>` : '<p class="vacio">Nadie dado de alta todavía.</p>';
    estado.textContent = '';
  } catch (e) {
    estado.textContent = `No se ha podido leer: ${await mensajeDeError(e)}`;
  }
}

async function accionProfesor(ev) {
  const { alta, baja, rechazar } = ev.target.dataset ?? {};
  if (!alta && !baja && !rechazar) return;
  ev.target.disabled = true;
  try {
    if (alta) await panelDatos().darDeAlta(alta);
    else if (baja) await panelDatos().darDeBaja(baja);
    else await panelDatos().borrarSolicitud(rechazar);
  } catch (e) {
    $('estado-profesores').textContent = `No se ha podido: ${await mensajeDeError(e)}`;
    ev.target.disabled = false;
    return;
  }
  await pintarProfesores();
}

// --- Caché en el navegador y lectura de solo lo nuevo (F.1) ---
//
// IndexedDB (con 100 alumnos no cabe en localStorage): una base por espacio
// (`practicas-panel-<uid>`) con un almacén por colección. La caché es un extra:
// si el navegador no la deja, se lee todo de la nube cada vez.

const ALMACENES = ['progreso-libre', 'progreso-tareas', 'asignaciones', 'fallos'];
let cache = null;   // promesa de la base abierta (o null si no se puede)

function abrirCache(uid) {
  return new Promise(resolver => {
    try {
      const pedido = indexedDB.open(`practicas-panel-${uid}`, 1);
      pedido.onupgradeneeded = () => {
        for (const almacen of ALMACENES) if (!pedido.result.objectStoreNames.contains(almacen)) pedido.result.createObjectStore(almacen, { keyPath: 'id' });
      };
      pedido.onsuccess = () => { const db = pedido.result; db.onversionchange = () => db.close(); resolver(db); };
      pedido.onerror = () => resolver(null);
      pedido.onblocked = () => resolver(null);
    } catch {
      resolver(null);
    }
  });
}

const cacheDe = uid => (cache ??= abrirCache(uid));

/** Una operación sobre un almacén; nunca falla (sin caché, `[]`). */
function enCache(db, almacen, modo, hacer) {
  return new Promise(resolver => {
    if (!db) { resolver([]); return; }
    try {
      const tx = db.transaction(almacen, modo);
      const pedido = hacer(tx.objectStore(almacen));
      tx.oncomplete = () => resolver(pedido?.result ?? []);
      tx.onerror = tx.onabort = () => resolver([]);
    } catch {
      resolver([]);
    }
  });
}
const leerCache = (db, almacen) => enCache(db, almacen, 'readonly', s => s.getAll());
const guardarCache = (db, almacen, docs) => (docs.length ? enCache(db, almacen, 'readwrite', s => { docs.forEach(d => s.put(d)); }) : Promise.resolve());
const vaciarCache = (db, almacen) => enCache(db, almacen, 'readwrite', s => s.clear());

/** Los documentos crudos → los datos de las vistas, con el número de lista de cada código. */
function aplicarDocumentos() {
  const indiceDe = espacio.indiceDe;
  espacio.nube = leerDocumentos(espacio.documentos['progreso-libre'], 'progreso-libre', indiceDe);
  espacio.nubeTareas = leerDocumentos(espacio.documentos['progreso-tareas'], 'progreso-tareas', indiceDe);
  espacio.asignaciones = leerAsignaciones(espacio.documentos.asignaciones, indiceDe);
}

let cargando = null;

/**
 * «Cargar de la nube» del sistema nuevo: lo que hay en la caché, al momento, y
 * después solo lo nuevo de la nube (`leerDesde`). Con `todo`, empieza de cero.
 */
async function cargarEspacio({ todo = false } = {}) {
  // Una lectura cada vez; «Volver a leer todo» pedido a mitad de otra espera a que acabe.
  if (cargando) {
    await cargando;
    if (!todo) return;
  }
  cargando = (async () => {
    const uid = espacio.uid;
    const subcolecciones = ['progreso-libre', 'progreso-tareas', 'asignaciones'];
    ponerEstado(espacio, 'estado-nube', todo ? 'Leyendo todo de la nube…' : 'Leyendo lo nuevo de la nube…');
    const db = await cacheDe(uid);
    if (todo) {
      for (const almacen of ALMACENES) await vaciarCache(db, almacen);
      escribirLocal(claveFallosDesde(uid), '');
      espacio.registro = [];
      ponerEstado(espacio, 'fallos-estado', '');
    }
    for (const sub of subcolecciones) espacio.documentos[sub] = todo ? [] : await leerCache(db, sub);
    aplicarDocumentos();
    if (fuente === espacio) repintarVistas();
    try { ponerCodigos(await panelDatos().listarMisCodigos()); } catch { /* se queda con los que ya tenía */ }
    const leidas = await Promise.allSettled(subcolecciones.map(sub => panelDatos().leerDesde(sub, desdeParaLeer(espacio.documentos[sub]))));
    let nuevos = 0;
    const fallidas = [];
    for (const [i, sub] of subcolecciones.entries()) {
      if (leidas[i].status === 'fulfilled') {
        nuevos += leidas[i].value.length;
        espacio.documentos[sub] = fusionarLeidos(espacio.documentos[sub], leidas[i].value);
        await guardarCache(db, sub, leidas[i].value);
      } else fallidas.push([sub, leidas[i].reason]);
    }
    // Sin leer las asignaciones no se puede guardar nada: se machacaría lo que hubiera.
    espacio.asignacionesCargadas = !fallidas.some(([sub]) => sub === 'asignaciones');
    aplicarDocumentos();
    const textos = await Promise.all(fallidas.map(async ([sub, e]) => ` No se ha podido leer «${sub}»: ${await mensajeDeError(e)}`));
    ponerEstado(espacio, 'estado-nube', `Cargados ${espacio.nube.length} registros de práctica y ${espacio.nubeTareas.length} de tareas, de ${new Set([...espacio.nube, ...espacio.nubeTareas].map(d => d.indice)).size} alumnos, y las asignaciones de ${espacio.asignaciones.length}. De la nube se han pedido ${nuevos} documentos (lo cambiado desde la última lectura y, por si el reloj de algún alumno va atrasado, lo de los dos días anteriores); lo demás estaba en este navegador (${new Date().toLocaleTimeString('es')}).` + textos.join(''));
    if (fuente === espacio) repintarVistas();
    for (const fn of alCargar) { try { fn(); } catch { /* lo de la 67 o la 68 no rompe el panel */ } }
  })().catch(async e => {
    ponerEstado(espacio, 'estado-nube', `No se ha podido cargar: ${await mensajeDeError(e)}`);
  }).finally(() => { cargando = null; });
  return cargando;
}

/**
 * Los fallos desde `desde` (ms): los de la caché y, de la nube, solo los que no
 * están (desde lo último guardado, o desde `desde` si es anterior a lo que se tiene).
 * Devuelve cuántos han llegado de la nube.
 */
async function cargarRegistroEspacio(desde) {
  const uid = espacio.uid;
  const db = await cacheDe(uid);
  const previos = await leerCache(db, 'fallos');
  const cubierto = previos.length ? Number(leerLocal(claveFallosDesde(uid))) || null : null;
  const pedirDesde = cubierto === null || desde < cubierto ? desde - 1 : desdeParaLeer(previos, 't');
  const nuevos = await panelDatos().leerDesde('fallos', pedirDesde);
  await guardarCache(db, 'fallos', nuevos);
  escribirLocal(claveFallosDesde(uid), String(cubierto === null ? desde : Math.min(desde, cubierto)));
  espacio.registro = fusionarLeidos(previos, nuevos).filter(f => (f.t ?? 0) >= desde);
  return nuevos.length;
}

// --- Arranque ------------------------------------------------------------------

try { $('lista').value = localStorage.getItem(CLAVE_LISTA) ?? ''; } catch { /* sin almacén */ }
$('lista').addEventListener('input', () => {
  try { localStorage.setItem(CLAVE_LISTA, $('lista').value); } catch { /* sin almacén */ }
  pintarCodigos();
  pintarResultados();
  pintarSelectoresRegistro();
  pintarRegistro();
  pintarAsignar();
});
$('tabla-asignar').addEventListener('change', ev => {
  const clave = ev.target.dataset?.asignar;
  if (clave) marcasAsignar.set(clave, ev.target.checked);
});
$('asignar-guardar').addEventListener('click', guardarAsignaciones);
$('idioma-enlaces').addEventListener('change', pintarCodigos);
$('destino-enlaces').addEventListener('change', pintarCodigos);
pintarTablaTareas(TAREAS, 'destino-enlaces', 'tabla-tareas');
$('tabla-tareas').addEventListener('click', copiarEnlaceTarea(() => TAREAS));
$('pegados').addEventListener('input', pintarResultados);
$('vista').addEventListener('change', pintarResultados);
$('copiar-codigos').addEventListener('click', async ev => {
  await navigator.clipboard.writeText(tablaCodigos().map(f => f.join('\t')).join('\n'));
  ev.target.textContent = '¡Copiada!';
});
$('csv-codigos').addEventListener('click', () => descargar('codigos-practicas.csv', tablaCodigos()));
$('csv-resultados').addEventListener('click', descargarResultados);
$('nube').addEventListener('click', cargarNube);
$('fallos-desde').value = fechaISO(new Date(Date.now() - 7 * 86400000));
$('fallos-cargar').addEventListener('click', cargarRegistro);
for (const id of ['fallos-tarea', 'fallos-practica', 'fallos-alumno']) $(id).addEventListener('change', pintarRegistro);
$('fallos-csv').addEventListener('click', () => descargar('fallos.csv', csvRegistro()));

// Sistema nuevo.
$('modo').addEventListener('change', () => ($('modo').value === 'nuevo' ? abrirNuevo() : abrirAntiguo()));
$('ir-antiguo').addEventListener('click', abrirAntiguo);
$('acceso-entrar').addEventListener('click', entrarNuevo);
$('acceso-salir').addEventListener('click', salirNuevo);
$('salir').addEventListener('click', salirNuevo);
$('lista-espacio').addEventListener('input', () => {
  if (espacio.uid) escribirLocal(claveListaEspacio(espacio.uid), $('lista-espacio').value);
  alCambiarLista();
});
$('generar-codigos').addEventListener('click', generarCodigos);
$('longitud-codigos').addEventListener('change', cambiarLongitud);
$('guardar-nombres').addEventListener('click', guardarNombres);
$('descifrar').addEventListener('click', descifrarLista);
$('contrasena-descifrar').addEventListener('keydown', ev => { if (ev.key === 'Enter') descifrarLista(); });
$('destino-espacio').addEventListener('change', pintarMisAlumnos);
$('idioma-espacio').addEventListener('change', pintarMisAlumnos);
$('csv-espacio').addEventListener('click', () => descargar('codigos-alumnos.csv', csvEspacio()));
$('tarjetas-espacio').addEventListener('click', imprimirTarjetas);
$('tabla-tareas-espacio').addEventListener('click', copiarEnlaceTarea(() => espacio.config.tareas));
$('releer-todo').addEventListener('click', () => cargarEspacio({ todo: true }));
$('profesores-recargar').addEventListener('click', pintarProfesores);
for (const id of ['tabla-solicitudes', 'tabla-profesores']) $(id).addEventListener('click', accionProfesor);

pintarCodigos();
if (modoInicial() === 'nuevo') abrirNuevo();
else abrirAntiguo();
