// «Hoy» del panel: lo que cuenta el informe diario (quién no ha
// entrado, qué ejercicios fallan demasiado, entregas), para los profesores que no
// reciben el correo (DISENO.md, F.1 y F.3; tarea 68 del reparto PU2).
//
// Los cálculos son los del informe (`herramientas/informe-actividad.mjs`), los mismos
// que usa `--espacio`: aquí solo se les dan los datos que el panel ya tiene leídos
// (`contexto.resultados().documentos`) y los nombres descifrados de «Mis alumnos».
// `montar` lo llama `profesor.js` una vez, al abrir el espacio, con el contenedor
// `#panel-hoy`; el contexto está documentado en `profesor-tareas.js`.

import {
  agregar, sinAlumnosDePrueba, tareaVigente, fechaMadrid, textoEntrega, documentosAMapa, asignacionesAMapa,
} from '../herramientas/informe-actividad.mjs';
import { PUNTOS_POR_EJERCICIO } from './_comun/tareas.js';

export const HORAS = [24, 48, 72];

/**
 * El informe de «Hoy». Puro (se prueba sin navegador).
 *   tareas       las tareas del profesor (`config().tareas`)
 *   alumnos      [{ n, nombre, codigo }] de «Mis alumnos»; sin código no cuentan
 *   documentos   los crudos del panel: { 'progreso-libre', 'progreso-tareas', asignaciones }
 *   tareaId      la tarea elegida; sin ella, la obligatoria vigente por fecha
 * Devuelve `{ motivoVacio }` si no hay tareas o códigos con los que calcular, o `{ tarea, motivo, resumen, horas, ahora }`.
 */
export function calcularHoy({ tareas, alumnos, documentos, tareaId = null, horas = 24, ahora = Date.now() }) {
  if (!tareas?.length) return { motivoVacio: 'tareas' };
  // Sin los alumnos de prueba (n.º ≥ 1000, p. ej. AJJN): no cuentan en nada, ni en «sin alumnos».
  const lista = sinAlumnosDePrueba((alumnos ?? []).filter(a => a.codigo).map(a => ({ numero: a.n, codigo: a.codigo })));
  if (!lista.length) return { motivoVacio: 'alumnos' };
  let tarea = tareaId === null ? null : tareas.find(t => t.id === tareaId);
  let motivo = null;
  if (!tarea) ({ tarea, motivo } = tareaVigente(fechaMadrid(ahora), tareas));
  const nombres = new Map(alumnos.filter(a => a.nombre).map(a => [a.n, a.nombre]));
  const docs = documentosAMapa(documentos?.['progreso-libre'] ?? [], documentos?.['progreso-tareas'] ?? []);
  const asignaciones = asignacionesAMapa(documentos?.asignaciones);
  const resumen = agregar({ docs, tarea, lista, nombres, desde: ahora - horas * 3600 * 1000, asignaciones, ahora });
  return { tarea, motivo, resumen, horas, ahora };
}

/** Cómo se llama a un alumno en pantalla: su nombre, o su número si la lista no está descifrada. */
export const etiqueta = f => f.nombre ?? `n.º ${f.numero}`;

const el = (nombre, texto, clase) => {
  const e = document.createElement(nombre);
  if (texto !== undefined) e.textContent = texto;
  if (clase) e.className = clase;
  return e;
};

function lista(titulo, items, vacio) {
  const caja = el('div');
  caja.append(el('h3', titulo));
  if (!items.length) { if (vacio) caja.append(el('p', vacio, 'pequeno')); return caja; }
  const ul = el('ul');
  for (const t of items) ul.append(el('li', t));
  caja.append(ul);
  return caja;
}

/** Pinta el resultado de `calcularHoy` en `contenedor` (sin `innerHTML`: los nombres son texto). */
function pintar(contenedor, hoy) {
  if (hoy.motivoVacio === 'tareas') { contenedor.append(el('p', 'Aún no tienes tareas: créalas en «Tareas». Aquí verás cómo va la tarea vigente.', 'pequeno')); return; }
  if (hoy.motivoVacio === 'alumnos') { contenedor.append(el('p', 'Aún no hay alumnos con código: genéralos en «Mis alumnos».', 'pequeno')); return; }
  const { tarea, motivo, resumen: r, horas } = hoy;
  const titulo = tarea.titulo?.es ?? `Tarea ${tarea.id}`;
  contenedor.append(el('p', `${titulo}. Ventana: últimas ${horas} h.${motivo ? ` Tarea elegida automáticamente: ${motivo}.` : ''}`, 'pequeno'));
  if (tarea.asignada) contenedor.append(el('p', `Tarea asignada: cuentan solo los ${r.total} alumnos asignados (${r.noAsignados} no asignados, fuera de todas las cifras).`, 'pequeno'));

  contenedor.append(lista(r.alertas.length ? '⚠ Alertas' : 'Sin alertas', r.alertas, 'Todo dentro de los umbrales.'));

  const completas = r.alumnos.filter(f => f.completa).length;
  const maximo = PUNTOS_POR_EJERCICIO * (tarea.estrella.length + tarea.nElegir);
  const pct = (a, b) => (b ? `${Math.round((100 * a) / b)} %` : '—');
  const resumen = [
    `Han entrado alguna vez: ${r.hanEntrado} de ${r.total} (${pct(r.hanEntrado, r.total)}).`,
    `Activos en la ventana: ${r.activos} (${pct(r.activos, r.total)}).`,
    `Tarea completa (${maximo} puntos): ${completas}.`,
  ];
  if (r.plazo) {
    const p = r.plazo;
    resumen.push(p.vencido
      ? `Plazo vencido (hasta el ${p.hasta}): ${p.aTiempo} a tiempo, ${p.conRetraso} con retraso, ${p.sinEntregar} sin entregar.`
      : `Plazo: hasta el ${p.hasta}. Entregadas: ${p.aTiempo}; sin entregar: ${p.sinEntregar}.`);
  }
  contenedor.append(lista('Resumen', resumen, ''));

  contenedor.append(lista('Aún no han entrado', r.alumnos.filter(f => !f.existe).map(etiqueta), 'Todos han entrado alguna vez.'));
  if (r.plazo) {
    const sin = r.alumnos.filter(f => !f.entrega.entregada && f.entrega.tipo !== 'repaso');
    const tarde = r.alumnos.filter(f => f.entrega.entregada && f.entrega.fueraDePlazo);
    contenedor.append(lista('Sin entregar', sin.map(f => `${etiqueta(f)}: ${textoEntrega(f.entrega)}`), 'Nadie falta por entregar.'));
    contenedor.append(lista('Entregadas con retraso', tarde.map(f => `${etiqueta(f)}: ${textoEntrega(f.entrega)}`), 'Ninguna.'));
  }

  const tabla = el('table');
  const cab = el('tr');
  for (const c of ['Ejercicio', 'Prueban', 'Terminan', 'Fallos', 'Reinician']) cab.append(el('th', c));
  tabla.append(cab);
  for (const e of r.ejercicios) {
    const fila = el('tr');
    const fallos = e.aciertos + e.fallos > 0 ? `${Math.round((100 * e.fallos) / (e.aciertos + e.fallos))} % (${e.fallos})` : '—';
    for (const c of [`${e.slug} ej. ${e.n}${e.estrella ? ' ★' : ''}`, e.intentan, e.terminan, fallos, e.reinician]) fila.append(el('td', String(c)));
    tabla.append(fila);
  }
  contenedor.append(el('h3', 'Ejercicios de la tarea'));
  const caja = el('div', undefined, 'tabla');
  caja.append(tabla);
  contenedor.append(caja);
}

/** Monta «Hoy» en `contenedor`: elige la tarea y la ventana, y se repinta con cada lectura de la nube. */
export function montar(contenedor, contexto) {
  let tareaId = null;
  let horas = 24;
  const cabecera = el('div', undefined, 'botonera');
  const selTarea = el('select');
  selTarea.setAttribute('aria-label', 'Tarea');
  const selHoras = el('select');
  selHoras.setAttribute('aria-label', 'Ventana de actividad');
  for (const h of HORAS) selHoras.append(new Option(`últimas ${h} h`, String(h)));
  const actualizar = el('button', 'Actualizar', 'secundario');
  actualizar.type = 'button';
  cabecera.append(selTarea, selHoras, actualizar);
  const cuerpo = el('div');
  contenedor.replaceChildren(cabecera, cuerpo);

  function repintar() {
    const tareas = contexto.config()?.tareas ?? [];
    selTarea.replaceChildren(new Option('La vigente (automática)', ''), ...tareas.map(t => new Option(t.titulo?.es ?? `Tarea ${t.id}`, String(t.id))));
    selTarea.value = tareaId !== null && tareas.some(t => t.id === tareaId) ? String(tareaId) : '';
    if (selTarea.value === '') tareaId = null;
    cabecera.hidden = !tareas.length;
    const hoy = calcularHoy({
      tareas, alumnos: contexto.alumnos(), documentos: contexto.resultados().documentos, tareaId, horas,
    });
    cuerpo.replaceChildren();
    pintar(cuerpo, hoy);
  }
  selTarea.addEventListener('change', () => { tareaId = selTarea.value === '' ? null : Number(selTarea.value); repintar(); });
  selHoras.addEventListener('change', () => { horas = Number(selHoras.value); repintar(); });
  actualizar.addEventListener('click', repintar);
  contexto.alCargar(repintar);
  repintar();
}
