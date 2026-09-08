// Generación y descarga de CSV. Separador «;», BOM y coma decimal para que
// Excel en español lo abra directamente con un doble clic.

import { texAPlano } from './formulas.js';
import { CONCEPTOS } from '../ejercicios/index.js';

const SEP = ';';

function celda(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') return String(v).replace('.', ',');
  if (typeof v === 'boolean') return v ? 'sí' : 'no';
  const s = String(v);
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function fecha(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function aCsv(cabecera, filas) {
  const lineas = [cabecera, ...filas].map(f => f.map(celda).join(SEP));
  return '﻿' + lineas.join('\r\n') + '\r\n';
}

/**
 * Una fila por alumno y tarea.
 *   filas: [{ usuario, nombre, grupo, tarea, resumen, empezadaEn, terminadaEn }]
 */
export function csvResumen(filas) {
  const conceptos = Object.keys(CONCEPTOS);
  const cabecera = ['Usuario', 'Nombre', 'Grupo', 'Tarea', 'Ejercicios', 'Hechos', 'Aciertos', 'Porcentaje', 'Refuerzos', 'Terminada',
    ...conceptos.map(c => `Errores: ${CONCEPTOS[c].nombre}`), 'Empezada', 'Terminada el'];
  return aCsv(cabecera, filas.map(f => [
    f.usuario, f.nombre, f.grupo, f.tarea,
    f.resumen.total, f.resumen.hechos, f.resumen.aciertos, f.resumen.porcentaje, f.resumen.refuerzosAnadidos, f.resumen.terminada,
    ...conceptos.map(c => f.resumen.erroresPorConcepto[c] ?? 0),
    fecha(f.empezadaEn), fecha(f.terminadaEn),
  ]));
}

/**
 * Una fila por respuesta.
 *   filas: [{ usuario, nombre, grupo, tarea, progreso }]
 */
export function csvDetalle(filas) {
  const cabecera = ['Usuario', 'Nombre', 'Grupo', 'Tarea', 'Nº', 'Tipo', 'Refuerzo', 'Enunciado', 'Respuesta', 'Correcta', 'Solución', 'Error', 'Concepto', 'Fecha'];
  const salida = [];
  for (const f of filas) {
    for (const r of f.progreso.respuestas ?? []) {
      const ej = f.progreso.ejercicios[r.n - 1];
      const solucion = ej?.opciones.find(o => o.correcta)?.tex;
      salida.push([
        f.usuario, f.nombre, f.grupo, f.tarea, r.n, r.tipo, r.refuerzo,
        ej ? `${ej.texto ?? ''} ${texAPlano(ej.enunciado)}`.trim() : '', ej ? texAPlano(ej.opciones[r.elegida]?.tex ?? '') : '',
        r.correcta, solucion ? texAPlano(solucion) : '',
        r.errorId ?? '', r.concepto ? CONCEPTOS[r.concepto]?.nombre ?? r.concepto : '', fecha(r.ts),
      ]);
    }
  }
  return aCsv(cabecera, salida);
}

export function descargar(nombre, contenido) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
