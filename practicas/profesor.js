// Panel único del profesor para todas las prácticas de la unidad 2.
// Reparte un código a cada alumno de la lista y lee los resultados, de dos
// fuentes: los códigos de resultado que envían los alumnos y Firestore.
// La lista de nombres vive solo en este navegador.

import { CATALOGO, ID_PLANTILLA, practicaPorId } from './_comun/catalogo.js';
import { codigoAlumno, leerCualquierCodigo, extraerCodigosResultado, MAX_ALUMNOS } from './_comun/codigos.js';
import { fechaDeDia } from './_comun/contador.js';
import { esc } from './_comun/textos.js';
import { TAREAS, tareaPorId } from './_comun/tareas.js';
import { juntarResultados, juntarResumen, juntarTareas, leerDocumentos } from './resultados.js';

const $ = id => document.getElementById(id);
// La lista es la misma que la del panel antiguo de `divisores/`: mismos alumnos, mismos códigos.
const CLAVE_LISTA = 'divisores.profesor.lista';
const URL_PORTADA = new URL('./', location.href).href;
const RESUMEN = 'resumen';
const TAREAS_SEMANA = 'tareas';

let nube = [];   // datos de Firestore ya leídos: [{ practica, indice, ej, actualizado }]

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
          <td>${t.estrella.length} ★ + ${t.nElegir} de ${t.elegir.length}${t.desde ? ` · en la portada desde el ${t.desde.split('-').reverse().join('/')}` : ''}</td>
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
 * Los códigos pegados, de los tres tipos mezclados: los de práctica (16, y los
 * de 12 de `divisores/`) en `validos`, los de tarea de la semana (20) en
 * `deTareas`, y los que no son válidos.
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

function celdaTarea(c) {
  if (c.cumplida) return `<td class="num celda--ok">✓ cumplida</td>`;
  if (c.empezada) return `<td class="num celda--medio">★ ${c.estrellaHechos} de ${c.nEstrella} · ${c.elegirHechos} de ${c.nElegir}</td>`;
  return '<td class="num celda--no">sin empezar</td>';
}

function htmlTareas(validos, deTareas) {
  const filas = juntarTareas(nombres(), deTareas, validos, nube, TAREAS);
  if (!filas.length) return '<p class="vacio">Todavía no hay nada: escribe la lista de alumnos, pega códigos o carga la nube.</p>';
  return `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${TAREAS.map(t => `<th class="practica">${esc(t.titulo.es)}</th>`).join('')}<th class="num">Cumplidas</th></tr></thead>
      <tbody>${filas.map(f => `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoAlumno(f.indice)}</code></td>
          ${f.tareas.map(celdaTarea).join('')}
          <td class="num">${f.tareas.filter(c => c.cumplida).length}/${TAREAS.length}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">«★ x de 6 · y de 4»: obligatorios terminados y, de los de elegir, cuántos ha terminado. Un ejercicio cuenta si lo dice el código de la tarea <strong>o</strong> lo que se sabe de su práctica (sus códigos o la nube), así que se ve el avance de quien todavía no ha mandado el código de la tarea. El CSV trae también los fallos y el día.</p>`;
}

function csvTareas(validos, deTareas) {
  const filas = juntarTareas(nombres(), deTareas, validos, nube, TAREAS);
  const cab = ['N.º', 'Alumno', 'Código', ...TAREAS.flatMap(t => [`T${t.id} estado`, `T${t.id} ★ (de ${t.estrella.length})`, `T${t.id} a elegir (de ${t.nElegir})`, `T${t.id} fallos`, `T${t.id} día`, `T${t.id} fuente`])];
  return [cab, ...filas.map(f => [
    f.indice + 1, f.nombre, codigoAlumno(f.indice),
    ...f.tareas.flatMap(c => [c.cumplida ? 'cumplida' : c.empezada ? 'a medias' : 'sin empezar', c.estrellaHechos, c.elegirHechos, `${c.fallos}${c.tope ? '+' : ''}`, c.dia ? fechaDeDia(c.dia) : '', c.fuente]),
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
      : htmlPractica(practicaPorId(Number(vista)), validos);
}

function descargarResultados() {
  const { validos, deTareas } = pegados();
  const vista = $('vista').value;
  if (vista === RESUMEN) return descargar('resultados-practicas-resumen.csv', csvResumen(practicasVisibles(validos), validos));
  if (vista === TAREAS_SEMANA) return descargar('resultados-tareas-de-la-semana.csv', csvTareas(validos, deTareas));
  const practica = practicaPorId(Number(vista));
  descargar(`resultados-${practica.slug}.csv`, csvPractica(practica, validos));
}

// --- Nube ----------------------------------------------------------------------

let firebase = null;

async function cargarNube() {
  const estado = $('estado-nube');
  estado.textContent = 'Conectando…';
  try {
    if (!firebase) {
      const { iniciarFirebase } = await import('../src/firebase.js');
      firebase = await iniciarFirebase();
      await new Promise(listo => firebase.observarSesion(listo));
    }
    if (!firebase.usuario()) await firebase.entrarConGoogle();
    if (!firebase.esProfesor(firebase.usuario())) {
      estado.textContent = 'Esa cuenta no es la del profesor.';
      await firebase.salir();
      return;
    }
    // Dos colecciones: la de todas las prácticas y la antigua de `divisores/`.
    // Si una falla (por ejemplo, la regla de `practicas` sin publicar), se enseña la otra.
    const [nuevas, viejas] = await Promise.allSettled([firebase.datos.listarPracticas(), firebase.datos.listarPracticaDivisores()]);
    nube = [
      ...(nuevas.status === 'fulfilled' ? leerDocumentos(nuevas.value, 'practicas') : []),
      ...(viejas.status === 'fulfilled' ? leerDocumentos(viejas.value, 'divisores') : []),
    ];
    const fallos = [nuevas, viejas].filter(r => r.status === 'rejected');
    const { mensajeDeError } = await import('../src/firebase.js');
    estado.textContent = `Cargados ${nube.length} registros de ${new Set(nube.map(d => d.indice)).size} alumnos (${new Date().toLocaleTimeString('es')}).`
      + (fallos.length ? ` No se ha podido leer ${nuevas.status === 'rejected' ? 'la colección «practicas»' : 'la colección «divisores»'}: ${mensajeDeError(fallos[0].reason)}` : '');
    pintarResultados();
  } catch (e) {
    const { mensajeDeError } = await import('../src/firebase.js');
    estado.textContent = `No se ha podido cargar: ${mensajeDeError(e)}`;
  }
}

// --- Arranque ------------------------------------------------------------------

try { $('lista').value = localStorage.getItem(CLAVE_LISTA) ?? ''; } catch { /* sin almacén */ }
$('lista').addEventListener('input', () => {
  try { localStorage.setItem(CLAVE_LISTA, $('lista').value); } catch { /* sin almacén */ }
  pintarCodigos();
  pintarResultados();
});
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
pintarCodigos();
pintarResultados();
