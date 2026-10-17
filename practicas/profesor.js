// Panel único del profesor para todas las prácticas de la unidad 2.
// Reparte un código a cada alumno de la lista y lee los resultados, de dos
// fuentes: los códigos de resultado que envían los alumnos y Firestore.
// La lista de nombres vive solo en este navegador.

import { CATALOGO, ID_PLANTILLA, practicaPorId, practicaPorSlug } from './_comun/catalogo.js';
import { codigoAlumno, leerCodigoAlumno, leerCualquierCodigo, extraerCodigosResultado, MAX_ALUMNOS } from './_comun/codigos.js';
import { fechaDeDia, diaDe } from './_comun/contador.js';
import { esc } from './_comun/textos.js';
import { TAREAS, tareaPorId, fechaISO } from './_comun/tareas.js';
import { juntarResultados, juntarResumen, juntarTareas, juntarFallos, agruparFallos, filtrarFallos, leerDocumentos, leerAsignaciones, calcularRetrasos, asignacionesParaGuardar, tareaPublicada, cumplidasDe } from './resultados.js';
import { DESTREZAS, leerFallos } from './_comun/registro.js';
import { declaracionDe } from './_comun/base.js';

const $ = id => document.getElementById(id);
// La lista es la misma que la del panel antiguo de `divisores/`: mismos alumnos, mismos códigos.
const CLAVE_LISTA = 'divisores.profesor.lista';
const URL_PORTADA = new URL('./', location.href).href;
const RESUMEN = 'resumen';
const TAREAS_SEMANA = 'tareas';
const RETRASOS = 'retrasos';
const FALLOS = 'fallos';            // «Qué falla más», todas las prácticas
const FALLOS_TAREA = 'fallos-t';    // «Qué falla más» de una tarea: 'fallos-t<id>'

let nube = [];   // datos de Firestore ya leídos: [{ practica, indice, ej, actualizado }]
let nubeTareas = [];   // los de la colección `practicas-tareas` (modelo v2): [{ tarea, practica, indice, ej, actualizado }]
let asignaciones = [];   // [{ indice, tareas: [ids] }] de `practicas-asignaciones`
let asignacionesCargadas = false;   // hasta cargar la nube no se pueden guardar (se machacaría lo que hubiera)

/** Lo que `juntarTareas` necesita además de los códigos: documentos de las tareas v2, asignaciones y hoy. */
const opcionesTareas = () => ({ deNubeTareas: nubeTareas, asignaciones, hoyDia: diaDe(new Date()) });

function nombres() {
  return $('lista').value.split('\n').map(l => l.trim()).slice(0, MAX_ALUMNOS);
}

function descargar(nombre, filas) {
  const csv = filas.map(f => f.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(a.href);
}

// --- 1. Códigos de los alumnos -------------------------------------------------

function filasCodigos() {
  return nombres().map((nombre, i) => ({ n: i + 1, nombre, codigo: codigoAlumno(i) })).filter(f => f.nombre);
}

/** El `&idioma=` que se añade a los enlaces, según el selector («alterno» no añade nada). */
function sufijoIdioma() {
  const idioma = $('idioma-enlaces')?.value;
  return idioma && idioma !== 'alterno' ? `&idioma=${idioma}` : '';
}

/** Enlace de un alumno: a la portada o, si se elige en «Enlaces a», a una tarea de la semana. */
function enlaceDe(codigo) {
  const destino = $('destino-enlaces')?.value;
  return destino && destino !== 'portada'
    ? `${URL_PORTADA}semana.html?t=${destino}&c=${codigo}${sufijoIdioma()}`
    : `${URL_PORTADA}?c=${codigo}${sufijoIdioma()}`;
}

/** Enlace común de una tarea (cada alumno escribe su código la primera vez): el que se pega en Classroom. */
const enlaceComun = tarea => `${URL_PORTADA}semana.html?t=${tarea.id}`;

function pintarTareasEnlaces() {
  $('destino-enlaces').innerHTML = '<option value="portada">La portada (todas las prácticas)</option>'
    + TAREAS.map(t => `<option value="${t.id}">Tarea ${t.id} · ${esc(t.titulo.es)}</option>`).join('');
  $('tabla-tareas').innerHTML = `
    <table>
      <thead><tr><th class="num">Tarea</th><th>Título</th><th>Pide</th><th>Enlace común (para Classroom)</th><th></th></tr></thead>
      <tbody>${TAREAS.map(t => `
        <tr>
          <td class="num">${t.id}</td><td>${esc(t.titulo.es)}</td>
          <td>${t.estrella.length} ★ + ${t.nElegir} de ${t.elegir.length}${t.desde ? ` · en la portada desde el ${t.desde.split('-').reverse().join('/')}` : ''}${t.hasta ? ` · plazo ${t.hasta.split('-').reverse().join('/')}` : ''}${t.asignada ? ' · asignada' : ''}${t.progresoPorPractica ? '' : ' · progreso propio'}</td>
          <td class="celda-enlace"><code class="enlace">${enlaceComun(t)}</code></td>
          <td><button type="button" class="secundario" data-copiar-tarea="${t.id}">Copiar</button></td>
        </tr>`).join('')}</tbody>
    </table>`;
  $('tabla-tareas').addEventListener('click', async ev => {
    const id = ev.target.dataset?.copiarTarea;
    if (!id) return;
    await navigator.clipboard.writeText(enlaceComun(tareaPorId(Number(id))));
    ev.target.textContent = '¡Copiado!';
  });
}

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
 */
function pegados() {
  const leidos = extraerCodigosResultado($('pegados').value).map(texto => ({ texto, dato: leerCualquierCodigo(texto) }));
  return {
    validos: leidos.filter(l => l.dato?.tipo === 'practica').map(l => l.dato),
    deTareas: leidos.filter(l => l.dato?.tipo === 'tarea').map(l => l.dato),
    invalidos: leidos.filter(l => !l.dato).map(l => l.texto),
  };
}

/** Las prácticas que salen en el panel: las publicadas y cualquiera de la que haya datos. */
function practicasVisibles(validos) {
  const conDatos = new Set([...validos, ...nube].map(d => d.practica));
  return CATALOGO.filter(p => conDatos.has(p.id) || (p.disponible && p.id !== ID_PLANTILLA));
}

function pintarSelector(practicas) {
  const elegida = $('vista').value || RESUMEN;
  $('vista').innerHTML = `<option value="${RESUMEN}">Resumen de todas las prácticas</option>`
    + `<option value="${TAREAS_SEMANA}">Tareas de la semana</option>`
    + `<option value="${RETRASOS}">Retrasos en las tareas</option>`
    + `<option value="${FALLOS}">Qué falla más · todas las prácticas</option>`
    + TAREAS.map(t => `<option value="${FALLOS_TAREA}${t.id}">Qué falla más · tarea ${t.id}</option>`).join('')
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
  const filas = juntarResultados(nombres(), validos.filter(d => d.practica === practica.id), nube.filter(d => d.practica === practica.id), practica.nEjercicios);
  if (!filas.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  const numeros = Array.from({ length: practica.nEjercicios }, (_, i) => i + 1);
  return `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${numeros.map(n => `<th class="num">Ej. ${n}</th>`).join('')}<th class="num">Hechos</th><th>Terminó el</th><th>Fuente</th></tr></thead>
      <tbody>${filas.map(f => `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoAlumno(f.indice)}</code></td>
          ${f.ejercicios.map(celda).join('')}
          <td class="num ${f.hechos === practica.nEjercicios ? 'celda--ok' : ''}">${f.hechos}/${practica.nEjercicios}</td>
          <td>${f.dia ? fechaDeDia(f.dia) : ''}</td><td>${f.fuente}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">En cada ejercicio: ✓ y el número de fallos. Con los códigos de resultado los fallos se cuentan hasta 15 («15+»). Sin terminar: puntos sobre el objetivo y, si las ha perdido todas, cuántas veces ha vuelto a empezar (↺).</p>`;
}

function csvPractica(practica, validos) {
  const filas = juntarResultados(nombres(), validos.filter(d => d.practica === practica.id), nube.filter(d => d.practica === practica.id), practica.nEjercicios);
  const numeros = Array.from({ length: practica.nEjercicios }, (_, i) => i + 1);
  const cab = ['N.º', 'Alumno', 'Código', ...numeros.flatMap(n => [`Ej${n} hecho`, `Ej${n} fallos`]), 'Hechos', 'Terminó el', 'Fuente'];
  return [cab, ...filas.map(f => [
    f.indice + 1, f.nombre, codigoAlumno(f.indice),
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
  const filas = juntarResumen(nombres(), validos, nube, practicas);
  if (!filas.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  return `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${practicas.map(p => `<th class="practica">${esc(p.nombre.es)}</th>`).join('')}<th class="num">Completas</th></tr></thead>
      <tbody>${filas.map(f => `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoAlumno(f.indice)}</code></td>
          ${f.practicas.map(celdaResumen).join('')}
          <td class="num ${f.completas === practicas.length ? 'celda--ok' : ''}">${f.completas}/${practicas.length}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">En cada práctica: ejercicios terminados de los que tiene. Elige una práctica arriba para ver los fallos de cada ejercicio.</p>`;
}

function csvResumen(practicas, validos) {
  const filas = juntarResumen(nombres(), validos, nube, practicas);
  const cab = ['N.º', 'Alumno', 'Código', ...practicas.map(p => `${p.nombre.es} (de ${p.nEjercicios})`), 'Prácticas completas'];
  return [cab, ...filas.map(f => [f.indice + 1, f.nombre, codigoAlumno(f.indice), ...f.practicas.map(p => p.hechos), f.completas])];
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
  const filas = juntarTareas(nombres(), deTareas, validos, nube, TAREAS, opcionesTareas());
  if (!filas.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  return `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${TAREAS.map(t => cabeceraTarea(t, hoyDia)).join('')}<th class="num">Obligatorias</th><th class="num">Repaso</th></tr></thead>
      <tbody>${filas.map(f => {
        const c = cumplidasDe(f, TAREAS, hoyDia);
        return `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoAlumno(f.indice)}</code></td>
          ${f.tareas.map(celdaTarea).join('')}
          <td class="num ${c.debidas && c.entregadas === c.debidas ? 'celda--ok' : ''}">${c.entregadas} de ${c.debidas}</td>
          <td class="num">${c.repaso}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>
    <p class="pequeno">«Obligatorias»: de las tareas ya publicadas que este alumno tenía que hacer (las que tienen plazo y, de las asignadas, aquellas en las que está marcado), cuántas ha entregado. «Repaso»: cuántas tareas voluntarias ha completado. Las tareas en gris aún no se han publicado (salen en la portada desde el día que dice) y no cuentan en nada.</p>
    <p class="pequeno">«★ x de 6 · y de 4 · N pt · D d tarde»: obligatorios terminados, de los de elegir cuántos ha terminado, los puntos de la tarea (sobre 100), los mismos que ve el alumno en su marcador: 10 por ejercicio terminado y, a medias, la parte proporcional (eso solo lo sabe la nube; de los de elegir cuentan los mejores), y los días de retraso sobre el plazo (en rojo, si todavía no la ha entregado). Una tarea <strong>asignada</strong> es obligatoria solo para los alumnos marcados en «Asignar tareas»: para los demás sale «—» (su avance voluntario, en gris) y no cuenta. Las tareas con progreso propio (todas menos la 1) cuentan solo lo hecho dentro de la tarea; la 1 cuenta también lo de la práctica libre. Un ejercicio cuenta si lo dice el código de la tarea <strong>o</strong> los datos de la nube. El CSV trae también los fallos, el día, el plazo, la fecha de entrega, los días de retraso y si fue a tiempo.</p>`;
}

function csvTareas(validos, deTareas) {
  const filas = juntarTareas(nombres(), deTareas, validos, nube, TAREAS, opcionesTareas());
  const cab = ['N.º', 'Alumno', 'Código', ...TAREAS.flatMap(t => [`T${t.id} estado`, `T${t.id} puntos (de ${10 * (t.estrella.length + t.nElegir)})`, `T${t.id} ★ (de ${t.estrella.length})`, `T${t.id} a elegir (de ${t.nElegir})`, `T${t.id} fallos`, `T${t.id} día`, `T${t.id} fuente`, `T${t.id} plazo`, `T${t.id} fecha de entrega`, `T${t.id} días de retraso`, `T${t.id} entrega`])];
  return [cab, ...filas.map(f => [
    f.indice + 1, f.nombre, codigoAlumno(f.indice),
    ...f.tareas.flatMap(c => (c.noAsignado
      ? ['no asignada', '', '', '', '', '', '', '', '', '', '']
      : [estadoTareaCsv(c), c.puntos, c.estrellaHechos, c.elegirHechos, `${c.fallos}${c.tope ? '+' : ''}`, fechaCsv(c.dia), c.fuente, plazoCsv(c), fechaCsv(c.diaEntrega), c.conPlazo ? c.diasRetraso : '', c.entrega])),
  ])];
}

// --- Retrasos ------------------------------------------------------------------

/** Los retrasos de los alumnos de la lista (o de todos, si la lista está vacía). */
function datosRetrasos(validos, deTareas) {
  const hoyDia = opcionesTareas().hoyDia;
  let filas = juntarTareas(nombres(), deTareas, validos, nube, TAREAS, opcionesTareas());
  if (nombres().some(Boolean)) filas = filas.filter(f => f.nombre);
  return calcularRetrasos(filas, TAREAS, hoyDia);
}

const mediaTexto = x => (x ? decimal(x) : '—');

function htmlRetrasos(validos, deTareas) {
  const r = datosRetrasos(validos, deTareas);
  if (!r.alumnos.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  const tituloTarea = id => `T${id} · ${esc(tareaPorId(id)?.titulo.es ?? '')}`;
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
  const alumnos = r.alumnos.map(a => [a.indice + 1, a.nombre, codigoAlumno(a.indice), a.conPlazo, a.aTiempo, a.conRetraso, a.sinEntregar, a.pendientes, a.dias, a.media ? decimal(a.media) : '', a.maximo || '']);
  // Una fila por alumno y tarea, con las fechas, para decidir el criterio con calma (días lectivos, por ejemplo).
  const filas = juntarTareas(nombres(), deTareas, validos, nube, TAREAS, opcionesTareas()).filter(f => !nombres().some(Boolean) || f.nombre);
  const publicadas = new Set(TAREAS.filter(t => tareaPublicada(t, hoyDia)).map(t => t.id));
  const detalle = filas.flatMap(f => f.tareas.filter(c => c.conPlazo && publicadas.has(c.id)).map(c => [f.indice + 1, f.nombre, codigoAlumno(f.indice), `T${c.id}`, plazoCsv(c), fechaCsv(c.diaEntrega), c.diasRetraso, c.entrega]));
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
    if (registro.length) pintarRegistro();
  });
}

/** Las filas de la vista: de todas las prácticas que salen en el panel, o de una tarea (con ★ o «elegir»). */
function ejerciciosDeVista(vista, practicas) {
  if (vista === FALLOS) return practicas.flatMap(p => Array.from({ length: p.nEjercicios }, (_, i) => ({ practica: p, n: i + 1, marca: '' })));
  const tarea = tareaPorId(Number(vista.slice(FALLOS_TAREA.length)));
  if (!tarea) return [];
  return [...tarea.estrella.map(par => [par, '★']), ...tarea.elegir.map(par => [par, 'elegir'])]
    .map(([[slug, n], marca]) => ({ practica: practicaPorSlug(slug), n, marca }));
}

function filasFallos(vista, practicas, validos) {
  const ejercicios = ejerciciosDeVista(vista, practicas);
  pedirNombres([...new Set(ejercicios.map(e => e.practica))]);
  const marcas = new Map(ejercicios.map(e => [`${e.practica.id}/${e.n}`, e.marca]));
  // Una tarea con progreso propio (modelo v2) cuenta solo lo hecho dentro de la tarea.
  const tarea = vista === FALLOS ? null : tareaPorId(Number(vista.slice(FALLOS_TAREA.length)));
  const propia = tarea && !tarea.progresoPorPractica;
  const deCodigos = propia ? [] : validos;
  const deNube = propia ? nubeTareas.filter(d => d.tarea === tarea.id) : nube;
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
    ? `<div class="aviso aviso--error">Códigos que <strong>no son válidos</strong> (mal copiados o inventados): ${invalidos.map(esc).join(', ')}</div>` : '';
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

/** Entra con la cuenta de Google del profesor (una vez por página). false si no es la suya. */
async function conectarProfesor(estado) {
  if (!firebase) {
    const { iniciarFirebase } = await import('../src/firebase.js');
    firebase = await iniciarFirebase();
    await new Promise(listo => firebase.observarSesion(listo));
  }
  if (!firebase.usuario()) await firebase.entrarConGoogle();
  if (!firebase.esProfesor(firebase.usuario())) {
    estado.textContent = 'Esa cuenta no es la del profesor.';
    await firebase.salir();
    return false;
  }
  return true;
}

async function cargarNube() {
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
    nube = [
      ...leerDocumentos(ok('practicas') ?? [], 'practicas'),
      ...leerDocumentos(ok('divisores') ?? [], 'divisores'),
    ];
    nubeTareas = leerDocumentos(ok('practicas-tareas') ?? [], 'practicas-tareas');
    // Sin leer las asignaciones no se puede guardar nada: se machacaría lo que hubiera.
    asignaciones = leerAsignaciones(ok('practicas-asignaciones') ?? []);
    asignacionesCargadas = ok('practicas-asignaciones') !== null;
    const fallos = lecturas.map(([nombre]) => [nombre, leidas[nombre]]).filter(([, r]) => r.status === 'rejected');
    const { mensajeDeError } = await import('../src/firebase.js');
    estado.textContent = `Cargados ${nube.length} registros de práctica y ${nubeTareas.length} de tareas, de ${new Set([...nube, ...nubeTareas].map(d => d.indice)).size} alumnos, y las asignaciones de ${asignaciones.length} (${new Date().toLocaleTimeString('es')}).`
      + fallos.map(([nombre, r]) => ` No se ha podido leer la colección «${nombre}»: ${mensajeDeError(r.reason)}`).join('');
    pintarResultados();
    pintarAsignar();
  } catch (e) {
    const { mensajeDeError } = await import('../src/firebase.js');
    estado.textContent = `No se ha podido cargar: ${mensajeDeError(e)}`;
  }
}

// --- 3. Fallos, uno a uno (registro de la tarea 39) ------------------------------

let registro = [];   // fallos leídos de la nube: [{ alumno, practica, ejercicio, t, item, feedback, respuesta?, error?, idioma, repeticion }]

/** «N.º 12 · Ana García (ABCD)», o el código solo si no está en la lista. */
function nombreAlumno(codigo) {
  const indice = leerCodigoAlumno(codigo);
  const nombre = indice === null ? '' : nombres()[indice];
  return indice === null ? codigo : `${indice + 1}${nombre ? ` · ${nombre}` : ''} (${codigo})`;
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
  const tarea = tareaPorId(Number(valor));
  if (!tarea) return {};
  return { tarea: tarea.id, ejercicios: tarea.progresoPorPractica ? [...tarea.estrella, ...tarea.elegir] : undefined };
}

function filtrosRegistro() {
  const lista = nombres();
  const deLista = new Set(lista.map((n, i) => (n ? codigoAlumno(i) : null)).filter(Boolean));
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
  conservar('fallos-tarea', '<option value="">Todas</option><option value="ninguna">Sin tarea (práctica libre)</option>' + TAREAS.map(t => `<option value="${t.id}">Tarea ${t.id}</option>`).join(''));
  const slugs = [...new Set(registro.map(f => f.practica))].sort((a, b) => nombrePractica(a).localeCompare(nombrePractica(b)));
  conservar('fallos-practica', '<option value="">Todas</option>' + slugs.map(s => `<option value="${esc(s)}">${esc(nombrePractica(s))}</option>`).join(''));
  const codigos = [...new Set(registro.map(f => f.alumno))].sort((a, b) => (leerCodigoAlumno(a) ?? 9999) - (leerCodigoAlumno(b) ?? 9999));
  conservar('fallos-alumno', '<option value="">Todos</option>' + codigos.map(c => `<option value="${esc(c)}">${esc(nombreAlumno(c))}</option>`).join(''));
}

function pintarRegistro() {
  if (!registro.length) { $('tabla-fallos').innerHTML = ''; return; }
  pedirNombres([...new Set(registro.map(f => f.practica))].map(practicaPorSlug).filter(Boolean));
  const r = agruparFallos(registro, filtrosRegistro());
  if (!r.total) {
    const soloLista = filtrosRegistro().alumnos ? ' Solo cuentan los alumnos de la lista: para ver otro código, elígelo en «Alumno».' : '';
    $('tabla-fallos').innerHTML = `<p class="vacio">Ningún fallo con estos filtros.${soloLista}</p>`;
    return;
  }
  const ejemplo = e => `<div class="pequeno" style="min-width: 18rem; margin-bottom: .4rem"><code style="white-space: normal; word-break: break-all">${esc(e.item)}</code><br>${esc(e.feedback)}${e.respuesta ? ` <em>(contestó: ${esc(e.respuesta)})</em>` : ''} · ${esc(e.alumno)}, ${fechaHora(e.t)}</div>`;
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
  const filas = filtrarFallos(registro, filtrosRegistro());
  const cab = ['Fecha', 'N.º', 'Alumno', 'Código', 'Práctica', 'Ej.', 'Ejercicio', 'Destrezas de la práctica', 'Error', 'Respuesta', 'Ítem', 'Explicación que vio', 'Idioma', 'Repitiendo un ejercicio ya terminado', 'Tarea'];
  return [cab, ...filas.map(x => {
    const i = leerCodigoAlumno(x.alumno);
    return [fechaHora(x.t), i === null ? '' : i + 1, i === null ? '' : nombres()[i] ?? '', x.alumno, nombrePractica(x.practica), x.ejercicio, nombreEjercicio(x.practica, x.ejercicio),
      destrezasDe(x.practica), x.error ?? '', x.respuesta ?? '', x.item, x.feedback, x.idioma, x.repeticion ? 'sí' : 'no', x.tarea ?? ''];
  })];
}

async function cargarRegistro() {
  const estado = $('fallos-estado');
  estado.textContent = 'Conectando…';
  try {
    if (!(await conectarProfesor(estado))) return;
    const [a, m, d] = ($('fallos-desde').value || '2026-09-01').split('-').map(Number);
    const desde = new Date(a, m - 1, d).getTime();
    registro = await leerFallos(desde, await firebase.usuario().getIdToken());
    estado.textContent = `Cargados ${registro.length} fallos de ${new Set(registro.map(f => f.alumno)).size} alumnos desde el ${d}/${m}/${a} (${new Date().toLocaleTimeString('es')}).`;
    pintarSelectoresRegistro();
    pintarRegistro();
  } catch (e) {
    const { mensajeDeError } = await import('../src/firebase.js');
    estado.textContent = `No se han podido cargar los fallos: ${mensajeDeError(e)}`;
  }
}

// --- 4. Asignar tareas (DISENO.md, B.3) --------------------------------------------

const marcasAsignar = new Map();   // 'indice|tarea' → bool: lo marcado a mano y aún sin guardar

const asignablesAhora = () => TAREAS.filter(t => t.asignada);
const guardadas = indice => asignaciones.find(a => a.indice === indice)?.tareas ?? [];
const marcada = (indice, id) => (marcasAsignar.has(`${indice}|${id}`) ? marcasAsignar.get(`${indice}|${id}`) : guardadas(indice).includes(id));

function pintarAsignar() {
  const tareas = asignablesAhora();
  const alumnos = nombres().map((nombre, indice) => ({ indice, nombre })).filter(a => a.nombre);
  $('asignar-guardar').disabled = !asignacionesCargadas || !tareas.length || !alumnos.length;
  if (!tareas.length) {
    $('tabla-asignar').innerHTML = '<p class="vacio">Ninguna tarea es <code>asignada</code> en <code>practicas/_comun/tareas.js</code> (campo <code>asignada: true</code>): no hay nada que asignar.</p>';
    return;
  }
  if (!alumnos.length) {
    $('tabla-asignar').innerHTML = '<p class="vacio">Escribe antes la lista de alumnos (arriba).</p>';
    return;
  }
  $('tabla-asignar').innerHTML = `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${tareas.map(t => `<th class="practica">T${t.id} · ${esc(t.titulo.es)}${t.hasta ? `<br><span class="pequeno">plazo ${t.hasta.split('-').reverse().join('/')}</span>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${alumnos.map(a => `
        <tr>
          <td class="num">${a.indice + 1}</td><td>${esc(a.nombre)}</td><td><code>${codigoAlumno(a.indice)}</code></td>
          ${tareas.map(t => `<td class="num"><input type="checkbox" data-asignar="${a.indice}|${t.id}" aria-label="Tarea ${t.id} para ${esc(a.nombre)}"${marcada(a.indice, t.id) ? ' checked' : ''}></td>`).join('')}
        </tr>`).join('')}</tbody>
    </table>`;
}

async function guardarAsignaciones() {
  const estado = $('asignar-estado');
  if (!asignacionesCargadas) { estado.textContent = 'Carga primero la nube (arriba, «Cargar de la nube»): hace falta saber qué hay ya guardado.'; return; }
  estado.textContent = 'Conectando…';
  try {
    if (!(await conectarProfesor(estado))) return;
    const ids = asignablesAhora().map(t => t.id);
    let guardados = 0;
    for (const a of nombres().map((nombre, indice) => ({ indice, nombre })).filter(a => a.nombre)) {
      const previas = guardadas(a.indice);
      const nuevas = asignacionesParaGuardar(previas, ids, ids.filter(id => marcada(a.indice, id)));
      const igual = nuevas.length === previas.length && nuevas.every((id, i) => id === previas[i]);
      // Sin cambios no se escribe; y a un alumno sin documento y sin nada marcado tampoco se le crea uno.
      if (igual) continue;
      await firebase.datos.guardarAsignacion(codigoAlumno(a.indice), nuevas);
      const resto = asignaciones.filter(x => x.indice !== a.indice);
      asignaciones = [...resto, { indice: a.indice, tareas: nuevas }];
      guardados++;
    }
    marcasAsignar.clear();
    estado.textContent = guardados ? `Guardadas las asignaciones de ${guardados} alumno${guardados === 1 ? '' : 's'} (${new Date().toLocaleTimeString('es')}).` : 'No había cambios que guardar.';
    pintarAsignar();
    pintarResultados();
  } catch (e) {
    const { mensajeDeError } = await import('../src/firebase.js');
    estado.textContent = `No se han podido guardar: ${mensajeDeError(e)}`;
  }
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
pintarTareasEnlaces();
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
pintarSelectoresRegistro();
pintarCodigos();
pintarResultados();
pintarAsignar();
