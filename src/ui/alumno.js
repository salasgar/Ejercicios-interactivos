// Pantalla del alumno: sus tareas y el acceso a cada una.

import { generarTarea, resumen } from '../motor.js';
import { pantallaTarea, escapar } from './tarea.js';
import { mensajeDeError } from '../firebase.js';
import { t, alCambiarIdioma } from '../i18n/index.js';

export async function pantallaAlumno(app, { alumnoId, alumno, datos }) {
  const volver = () => pantallaAlumno(app, { alumnoId, alumno, datos });
  alCambiarIdioma(volver);
  app.innerHTML = `<p class="cargando">${t('cargando_tareas')}</p>`;
  let tareas, progresos;
  try {
    [tareas, progresos] = await Promise.all([datos.listarTareas(alumno.grupo), datos.listarProgresos(alumnoId)]);
  } catch (e) {
    app.innerHTML = `<div class="aviso aviso--error">${escapar(t('error_cargar_tareas', { error: mensajeDeError(e) }))}</div>`;
    return;
  }
  tareas = tareas.filter(t => t.activa !== false);

  if (tareas.length === 0) {
    app.innerHTML = `<h2>${escapar(t('hola', { nombre: alumno.nombre }))}</h2><p class="vacio">${t('sin_tareas')}</p>`;
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
    if (!p) { etiqueta = `<span class="etiqueta">${t('pendiente')}</span>`; detalle = t('n_ejercicios', { n: total }); textoBoton = t('empezar'); }
    else if (r.terminada) { etiqueta = `<span class="etiqueta etiqueta--ok">${t('porcentaje_aciertos', { p: r.porcentaje })}</span>`; detalle = t('aciertos_de', { aciertos: r.aciertos, total: r.hechos }); textoBoton = t('ver'); }
    else { etiqueta = `<span class="etiqueta etiqueta--curso">${t('en_curso')}</span>`; detalle = t('hechos_de', { hechos: r.hechos, total: r.total }); textoBoton = t('continuar'); }
    const idiomas = [tarea.idioma ? `<span class="etiqueta">${tarea.idioma.toUpperCase()}</span>` : '', tarea.notacion ? `<span class="etiqueta">${tarea.notacion === 'en' ? '2.5' : '2,5'}</span>` : ''].join(' ');
    li.innerHTML = `<div><h3>${escapar(tarea.titulo)}</h3><div class="detalle">${detalle} ${etiqueta} ${idiomas}</div></div>`;
    const boton = document.createElement('button');
    boton.textContent = textoBoton;
    boton.addEventListener('click', () => abrir(tarea, p));
    li.appendChild(boton);
    lista.appendChild(li);
  }
  app.innerHTML = `<h2>${escapar(t('hola', { nombre: alumno.nombre }))}</h2>`;
  app.appendChild(lista);

  async function abrir(tarea, progreso) {
    if (!progreso) {
      progreso = generarTarea(tarea);
      try { await datos.guardarProgreso(alumnoId, progreso); } catch (e) { console.error(e); }
    }
    pantallaTarea(app, {
      progreso,
      guardar: p => datos.guardarProgreso(alumnoId, p),
      alSalir: volver,
    });
  }
}
