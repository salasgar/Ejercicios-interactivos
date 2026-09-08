// Pantalla del alumno: sus tareas y el acceso a cada una.

import { generarTarea, resumen } from '../motor.js';
import { pantallaTarea, escapar } from './tarea.js';
import { mensajeDeError } from '../firebase.js';

export async function pantallaAlumno(app, { uid, alumno, datos }) {
  app.innerHTML = '<p class="cargando">Cargando tus tareas…</p>';
  let tareas, progresos;
  try {
    [tareas, progresos] = await Promise.all([datos.listarTareas(alumno.grupo), datos.listarProgresos(uid)]);
  } catch (e) {
    app.innerHTML = `<div class="aviso aviso--error">No se pudieron cargar las tareas: ${escapar(mensajeDeError(e))}</div>`;
    return;
  }
  tareas = tareas.filter(t => t.activa !== false);

  if (tareas.length === 0) {
    app.innerHTML = `<h2>Hola, ${escapar(alumno.nombre)}</h2><p class="vacio">No tienes tareas pendientes.</p>`;
    return;
  }

  const lista = document.createElement('ul');
  lista.className = 'lista';
  for (const tarea of tareas) {
    const p = progresos[tarea.id];
    const r = p ? resumen(p) : null;
    const li = document.createElement('li');
    li.className = 'lista__item';
    const total = tarea.ejercicios.reduce((s, e) => s + e.cantidad, 0);
    let etiqueta, detalle, textoBoton;
    if (!p) { etiqueta = '<span class="etiqueta">Pendiente</span>'; detalle = `${total} ejercicios`; textoBoton = 'Empezar'; }
    else if (r.terminada) { etiqueta = `<span class="etiqueta etiqueta--ok">${r.porcentaje}% aciertos</span>`; detalle = `${r.aciertos} de ${r.hechos} aciertos`; textoBoton = 'Ver'; }
    else { etiqueta = '<span class="etiqueta etiqueta--curso">En curso</span>'; detalle = `${r.hechos} de ${r.total} hechos`; textoBoton = 'Continuar'; }
    li.innerHTML = `<div><h3>${escapar(tarea.titulo)}</h3><div class="detalle">${detalle} ${etiqueta}</div></div>`;
    const boton = document.createElement('button');
    boton.textContent = textoBoton;
    boton.addEventListener('click', () => abrir(tarea, p));
    li.appendChild(boton);
    lista.appendChild(li);
  }
  app.innerHTML = `<h2>Hola, ${escapar(alumno.nombre)}</h2>`;
  app.appendChild(lista);

  async function abrir(tarea, progreso) {
    if (!progreso) {
      progreso = generarTarea(tarea);
      try { await datos.guardarProgreso(uid, progreso); } catch (e) { console.error(e); }
    }
    pantallaTarea(app, {
      progreso,
      guardar: p => datos.guardarProgreso(uid, p),
      alSalir: () => pantallaAlumno(app, { uid, alumno, datos }),
    });
  }
}
