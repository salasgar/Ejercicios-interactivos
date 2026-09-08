// Panel del profesor: alumnos, tareas y resultados (con descarga de CSV).

import { TIPOS } from '../ejercicios/index.js';
import { resumen } from '../motor.js';
import { analizarAltas } from '../altas.js';
import { mensajeDeError } from '../firebase.js';
import { csvResumen, csvDetalle, descargar, fecha } from './csv.js';
import { escapar } from './tarea.js';

const PESTANAS = [
  ['alumnos', 'Alumnos', pestanaAlumnos],
  ['tareas', 'Tareas', pestanaTareas],
  ['resultados', 'Resultados', pestanaResultados],
];

export function pantallaProfesor(app, { datos }, pestanaInicial = 'tareas') {
  app.innerHTML = `
    <div class="pestanas" role="tablist">
      ${PESTANAS.map(([id, nombre]) => `<button type="button" role="tab" data-pestana="${id}">${nombre}</button>`).join('')}
    </div>
    <div id="contenido"></div>`;
  const contenido = app.querySelector('#contenido');
  const botones = app.querySelectorAll('[data-pestana]');

  function ir(id) {
    botones.forEach(b => b.setAttribute('aria-selected', String(b.dataset.pestana === id)));
    const [, , pintar] = PESTANAS.find(p => p[0] === id);
    contenido.innerHTML = '<p class="cargando">Cargando…</p>';
    pintar(contenido, datos).catch(e => {
      contenido.innerHTML = `<div class="aviso aviso--error">${escapar(mensajeDeError(e))}</div>`;
      console.error(e);
    });
  }
  botones.forEach(b => b.addEventListener('click', () => ir(b.dataset.pestana)));
  ir(pestanaInicial);
}

function nombreArchivo(base) {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${base}-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.csv`.replace(/[^\w.-]+/g, '_');
}

function gruposDe(alumnos) {
  return [...new Set(alumnos.map(a => a.grupo))].sort((a, b) => a.localeCompare(b, 'es'));
}

// --- Alumnos ---------------------------------------------------------------

async function pestanaAlumnos(el, datos) {
  const [alumnos, credenciales] = await Promise.all([datos.listarAlumnos(), datos.listarCredenciales()]);
  const grupos = gruposDe(alumnos);
  el.innerHTML = `
    <section class="tarjeta">
      <h3>Dar de alta alumnos</h3>
      <p class="pequeno">Una línea por alumno, campos separados por «;»:<br>
        <code>Nombre Apellidos; Grupo</code> (usuario y contraseña automáticos)<br>
        <code>Nombre Apellidos; usuario; Grupo</code><br>
        <code>Nombre Apellidos; usuario; contraseña; Grupo</code></p>
      <textarea id="altas" placeholder="Ana García López; 1A&#10;Luis Pérez Ruiz; 1A"></textarea>
      <button type="button" id="crear">Crear alumnos</button>
      <div id="resultado-altas"></div>
    </section>
    <section class="tarjeta">
      <h3>Alumnos dados de alta (${alumnos.length})</h3>
      <label for="filtro-grupo">Grupo</label>
      <select id="filtro-grupo"><option value="">Todos</option>${grupos.map(g => `<option>${escapar(g)}</option>`).join('')}</select>
      <div class="tabla-envoltorio"><table>
        <thead><tr><th>Nombre</th><th>Usuario</th><th>Contraseña</th><th>Grupo</th></tr></thead>
        <tbody id="cuerpo-alumnos"></tbody>
      </table></div>
      <p class="pequeno">Las contraseñas se guardan aquí para que puedas recordárselas a quien la olvide; el alumno no puede cambiarla.</p>
    </section>`;

  const cuerpo = el.querySelector('#cuerpo-alumnos');
  function pintarTabla() {
    const grupo = el.querySelector('#filtro-grupo').value;
    const filas = alumnos.filter(a => !grupo || a.grupo === grupo);
    cuerpo.innerHTML = filas.length
      ? filas.map(a => `<tr><td>${escapar(a.nombre)}</td><td><code>${escapar(a.usuario)}</code></td><td><code>${escapar(credenciales[a.id] ?? '?')}</code></td><td>${escapar(a.grupo)}</td></tr>`).join('')
      : '<tr><td colspan="4" class="vacio">Ningún alumno</td></tr>';
  }
  el.querySelector('#filtro-grupo').addEventListener('change', pintarTabla);
  pintarTabla();

  el.querySelector('#crear').addEventListener('click', async () => {
    const boton = el.querySelector('#crear');
    const salida = el.querySelector('#resultado-altas');
    const { alumnos: nuevos, errores } = analizarAltas(el.querySelector('#altas').value, alumnos.map(a => a.usuario));
    if (errores.length) {
      salida.innerHTML = `<div class="aviso aviso--error">${errores.map(escapar).join('<br>')}</div>`;
      return;
    }
    if (!nuevos.length) return;
    boton.disabled = true;
    const lineas = [];
    for (const n of nuevos) {
      try {
        await datos.crearAlumno(n);
        lineas.push(`<li class="mensaje-ok">${escapar(n.nombre)} → usuario <code>${escapar(n.usuario)}</code>, contraseña <code>${escapar(n.contrasena)}</code></li>`);
      } catch (e) {
        lineas.push(`<li style="color:var(--error)">${escapar(n.nombre)}: ${escapar(mensajeDeError(e))}</li>`);
      }
      salida.innerHTML = `<ul>${lineas.join('')}</ul>`;
    }
    boton.disabled = false;
    // Recargar la pestaña para que la tabla muestre los nuevos.
    const copia = salida.innerHTML;
    await pestanaAlumnos(el, datos);
    el.querySelector('#resultado-altas').innerHTML = copia;
  });
}

// --- Tareas ----------------------------------------------------------------

async function pestanaTareas(el, datos) {
  const [tareas, alumnos] = await Promise.all([datos.listarTareas(), datos.listarAlumnos()]);
  const grupos = gruposDe(alumnos);
  el.innerHTML = `
    <section class="tarjeta">
      <h3>Nueva tarea</h3>
      <form id="form-tarea">
        <label for="titulo">Título</label>
        <input id="titulo" type="text" required placeholder="Ej.: Repaso de potencias">
        <label for="grupo">Grupo</label>
        <input id="grupo" type="text" required list="lista-grupos" placeholder="Ej.: 1A">
        <datalist id="lista-grupos">${grupos.map(g => `<option value="${escapar(g)}">`).join('')}</datalist>
        <label>Ejercicios de cada tipo</label>
        ${Object.values(TIPOS).map(t => `
          <div class="fila-tipo">
            <span>${escapar(t.nombre)}</span>
            <input type="number" min="0" max="30" value="0" data-tipo="${t.id}" inputmode="numeric">
          </div>`).join('')}
        <p class="pequeno" style="margin-top:.8rem">Además, por cada fallo se añaden 2 ejercicios de refuerzo del concepto fallado (máximo 6 por concepto).</p>
        <div id="mensaje-tarea"></div>
        <button type="submit">Crear tarea</button>
      </form>
    </section>
    <section class="tarjeta">
      <h3>Tareas (${tareas.length})</h3>
      <div class="tabla-envoltorio"><table>
        <thead><tr><th>Título</th><th>Grupo</th><th>Ejercicios</th><th>Creada</th><th>Estado</th><th></th></tr></thead>
        <tbody>${tareas.map(t => `
          <tr data-id="${t.id}">
            <td>${escapar(t.titulo)}</td><td>${escapar(t.grupo)}</td>
            <td>${t.ejercicios.map(e => `${TIPOS[e.tipo]?.nombre ?? e.tipo} ×${e.cantidad}`).join(', ')}</td>
            <td>${fecha(t.creadaEn)}</td>
            <td>${t.activa === false ? 'Oculta' : '<span class="etiqueta etiqueta--ok">Activa</span>'}</td>
            <td><button type="button" class="discreto" data-accion="alternar">${t.activa === false ? 'Mostrar' : 'Ocultar'}</button>
                <button type="button" class="discreto" data-accion="borrar">Borrar</button></td>
          </tr>`).join('') || '<tr><td colspan="6" class="vacio">Ninguna tarea</td></tr>'}
        </tbody>
      </table></div>
      <p class="pequeno">Una tarea oculta no aparece a los alumnos, pero sus resultados se conservan. Borrar una tarea no borra los resultados guardados.</p>
    </section>`;

  el.querySelector('#form-tarea').addEventListener('submit', async ev => {
    ev.preventDefault();
    const form = ev.target;
    const mensaje = el.querySelector('#mensaje-tarea');
    const ejercicios = [...form.querySelectorAll('[data-tipo]')]
      .map(i => ({ tipo: i.dataset.tipo, cantidad: Number(i.value) || 0 }))
      .filter(e => e.cantidad > 0);
    if (!ejercicios.length) {
      mensaje.innerHTML = '<div class="aviso aviso--error">Indica al menos un ejercicio.</div>';
      return;
    }
    form.querySelector('button[type=submit]').disabled = true;
    try {
      await datos.crearTarea({ titulo: form.titulo.value.trim(), grupo: form.grupo.value.trim(), ejercicios, activa: true });
      await pestanaTareas(el, datos);
    } catch (e) {
      mensaje.innerHTML = `<div class="aviso aviso--error">${escapar(mensajeDeError(e))}</div>`;
      form.querySelector('button[type=submit]').disabled = false;
    }
  });

  el.querySelectorAll('[data-accion]').forEach(boton => boton.addEventListener('click', async () => {
    const id = boton.closest('tr').dataset.id;
    const tarea = tareas.find(t => t.id === id);
    try {
      if (boton.dataset.accion === 'alternar') {
        await datos.actualizarTarea(id, { activa: tarea.activa === false });
      } else if (confirm(`¿Borrar la tarea «${tarea.titulo}»?`)) {
        await datos.borrarTarea(id);
      } else return;
      await pestanaTareas(el, datos);
    } catch (e) {
      alert(mensajeDeError(e));
    }
  }));
}

// --- Resultados ------------------------------------------------------------

async function pestanaResultados(el, datos) {
  const [tareas, alumnos] = await Promise.all([datos.listarTareas(), datos.listarAlumnos()]);
  el.innerHTML = `
    <section class="tarjeta">
      <h3>Resultados por tarea</h3>
      <label for="sel-tarea">Tarea</label>
      <select id="sel-tarea">
        <option value="">Elige una tarea…</option>
        ${tareas.map(t => `<option value="${t.id}">${escapar(t.grupo)} · ${escapar(t.titulo)} (${fecha(t.creadaEn).slice(0, 10)})</option>`).join('')}
      </select>
      <div id="tabla-resultados"></div>
    </section>
    <section class="tarjeta">
      <h3>Exportar todo</h3>
      <p class="pequeno">Todas las tareas y todos los alumnos en un solo archivo.</p>
      <div class="botonera">
        <button type="button" class="secundario" id="todo-resumen">CSV resumen (todo)</button>
        <button type="button" class="secundario" id="todo-detalle">CSV detalle (todo)</button>
      </div>
    </section>`;

  const porUid = Object.fromEntries(alumnos.map(a => [a.id, a]));
  const porTareaId = Object.fromEntries(tareas.map(t => [t.id, t]));

  function filasDe(progresos) {
    // progresos: [{ uid, tareaId, ...progreso }]
    return progresos.map(p => {
      const a = porUid[p.uid] ?? { usuario: '?', nombre: '?', grupo: '?' };
      return { usuario: a.usuario, nombre: a.nombre, grupo: a.grupo, tarea: p.titulo ?? porTareaId[p.tareaId]?.titulo ?? p.tareaId, progreso: p, resumen: resumen(p), empezadaEn: p.empezadaEn, terminadaEn: p.terminadaEn };
    });
  }

  el.querySelector('#sel-tarea').addEventListener('change', async ev => {
    const id = ev.target.value;
    const zona = el.querySelector('#tabla-resultados');
    if (!id) { zona.innerHTML = ''; return; }
    const tarea = porTareaId[id];
    zona.innerHTML = '<p class="cargando">Cargando…</p>';
    const delGrupo = alumnos.filter(a => a.grupo === tarea.grupo);
    const progresos = await datos.progresosDeTarea(id, delGrupo);
    const filas = delGrupo.map(a => {
      const p = progresos[a.id];
      return { alumno: a, progreso: p, resumen: p ? resumen(p) : null };
    });
    zona.innerHTML = `
      <div class="tabla-envoltorio"><table>
        <thead><tr><th>Alumno</th><th class="num">Hechos</th><th class="num">Aciertos</th><th class="num">%</th><th class="num">Refuerzos</th><th>Estado</th></tr></thead>
        <tbody>${filas.map(({ alumno, resumen: r }) => r
          ? `<tr><td>${escapar(alumno.nombre)}</td><td class="num">${r.hechos}/${r.total}</td><td class="num">${r.aciertos}</td><td class="num">${r.porcentaje}</td><td class="num">${r.refuerzosAnadidos}</td><td>${r.terminada ? '<span class="etiqueta etiqueta--ok">Terminada</span>' : '<span class="etiqueta etiqueta--curso">En curso</span>'}</td></tr>`
          : `<tr><td>${escapar(alumno.nombre)}</td><td class="num">0</td><td class="num">–</td><td class="num">–</td><td class="num">–</td><td><span class="etiqueta">Sin empezar</span></td></tr>`).join('') || '<tr><td colspan="6" class="vacio">No hay alumnos en el grupo</td></tr>'}
        </tbody>
      </table></div>
      <div class="botonera">
        <button type="button" class="secundario" id="csv-resumen">CSV resumen</button>
        <button type="button" class="secundario" id="csv-detalle">CSV detalle</button>
      </div>`;
    const conProgreso = filasDe(filas.filter(f => f.progreso).map(f => ({ uid: f.alumno.id, tareaId: id, ...f.progreso })));
    zona.querySelector('#csv-resumen').addEventListener('click', () => descargar(nombreArchivo(`resumen-${tarea.grupo}-${tarea.titulo}`), csvResumen(conProgreso)));
    zona.querySelector('#csv-detalle').addEventListener('click', () => descargar(nombreArchivo(`detalle-${tarea.grupo}-${tarea.titulo}`), csvDetalle(conProgreso)));
  });

  async function exportarTodo(generador, base) {
    try {
      const filas = filasDe(await datos.todosLosProgresos());
      descargar(nombreArchivo(base), generador(filas));
    } catch (e) {
      alert(mensajeDeError(e));
    }
  }
  el.querySelector('#todo-resumen').addEventListener('click', () => exportarTodo(csvResumen, 'resumen-todo'));
  el.querySelector('#todo-detalle').addEventListener('click', () => exportarTodo(csvDetalle, 'detalle-todo'));
}
