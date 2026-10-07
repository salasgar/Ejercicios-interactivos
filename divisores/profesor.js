// Panel del profesor de la práctica «divisor, múltiplo, divisible».
// Reparte un código a cada alumno de la lista y lee los resultados, de dos
// fuentes: los códigos de resultado que envían los alumnos y Firestore.
// La lista de nombres vive solo en este navegador.

import { EJERCICIOS, codigoAlumno, leerCodigoAlumno, leerCodigoResultado, extraerCodigosResultado, fechaDeDia, MAX_ALUMNOS } from './logica.js';
import { juntarResultados } from './resultados.js';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CLAVE_LISTA = 'divisores.profesor.lista';
const URL_PRACTICA = new URL('./', location.href).href;

let nube = [];   // documentos de Firestore: { id, estado, actualizado }

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

function pintarCodigos() {
  const filas = filasCodigos();
  $('tabla-codigos').innerHTML = filas.length ? `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th><th>Enlace directo</th></tr></thead>
      <tbody>${filas.map(f => `<tr><td class="num">${f.n}</td><td>${esc(f.nombre)}</td><td><code>${f.codigo}</code></td><td>${URL_PRACTICA}?c=${f.codigo}</td></tr>`).join('')}</tbody>
    </table>` : '';
}

const tablaCodigos = () => [['N.º', 'Alumno', 'Código', 'Enlace'], ...filasCodigos().map(f => [f.n, f.nombre, f.codigo, `${URL_PRACTICA}?c=${f.codigo}`])];

// --- 2. Resultados -------------------------------------------------------------

function resultados() {
  const textos = extraerCodigosResultado($('pegados').value);
  const leidos = textos.map(texto => ({ texto, ...leerCodigoResultado(texto) }));
  const deNube = nube.map(doc => {
    const indice = leerCodigoAlumno(doc.id);
    try { return indice === null ? null : { indice, ...JSON.parse(doc.estado), actualizado: doc.actualizado }; } catch { return null; }
  }).filter(Boolean);
  return {
    invalidos: leidos.filter(l => l.indice === undefined).map(l => l.texto),
    filas: juntarResultados(nombres(), leidos.filter(l => l.indice !== undefined), deNube),
  };
}

function celda(e) {
  if (e.terminado) return `<td class="num celda--ok">✓ ${e.fallos}${e.tope ? '+' : ''}</td>`;
  if (e.pendientes !== undefined && e.aciertos + e.fallos > 0) return `<td class="num">quedan ${e.pendientes}</td>`;
  return '<td class="num celda--no">—</td>';
}

function pintarResultados() {
  const { filas, invalidos } = resultados();
  $('avisos').innerHTML = invalidos.length
    ? `<div class="aviso aviso--error">Códigos que <strong>no son válidos</strong> (mal copiados o inventados): ${invalidos.map(esc).join(', ')}</div>` : '';
  if (!filas.length) { $('tabla-resultados').innerHTML = ''; return; }
  $('tabla-resultados').innerHTML = `
    <table>
      <thead><tr><th class="num">N.º</th><th>Alumno</th><th>Código</th>${EJERCICIOS.map(n => `<th class="num">Ej. ${n}</th>`).join('')}<th class="num">Hechos</th><th>Terminó el</th><th>Fuente</th></tr></thead>
      <tbody>${filas.map(f => `
        <tr>
          <td class="num">${f.indice + 1}</td><td>${esc(f.nombre || '(no está en la lista)')}</td><td><code>${codigoAlumno(f.indice)}</code></td>
          ${f.ejercicios.map(celda).join('')}
          <td class="num ${f.hechos === EJERCICIOS.length ? 'celda--ok' : ''}">${f.hechos}/${EJERCICIOS.length}</td>
          <td>${f.dia ? fechaDeDia(f.dia) : ''}</td><td>${f.fuente}</td>
        </tr>`).join('')}</tbody>
    </table>
    <p class="pequeno">En cada ejercicio: ✓ y el número de fallos. Con los códigos de resultado los fallos se cuentan hasta 15 («15+»).</p>`;
}

function tablaResultados() {
  const cab = ['N.º', 'Alumno', 'Código', ...EJERCICIOS.flatMap(n => [`Ej${n} hecho`, `Ej${n} fallos`]), 'Hechos', 'Terminó el', 'Fuente'];
  return [cab, ...resultados().filas.map(f => [
    f.indice + 1, f.nombre, codigoAlumno(f.indice),
    ...f.ejercicios.flatMap(e => [e.terminado ? 'sí' : 'no', e.fallos ?? '']),
    f.hechos, f.dia ? fechaDeDia(f.dia) : '', f.fuente,
  ])];
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
    nube = await firebase.datos.listarPracticaDivisores();
    estado.textContent = `Cargados los datos de ${nube.length} alumnos (${new Date().toLocaleTimeString('es')}).`;
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
$('pegados').addEventListener('input', pintarResultados);
$('copiar-codigos').addEventListener('click', async ev => {
  await navigator.clipboard.writeText(tablaCodigos().map(f => f.join('\t')).join('\n'));
  ev.target.textContent = '¡Copiada!';
});
$('csv-codigos').addEventListener('click', () => descargar('codigos-divisores.csv', tablaCodigos()));
$('csv-resultados').addEventListener('click', () => descargar('resultados-divisores.csv', tablaResultados()));
$('nube').addEventListener('click', cargarNube);
pintarCodigos();
pintarResultados();
