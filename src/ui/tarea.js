// Pantalla de una tarea: un ejercicio cada vez, corrección inmediata, feedback
// y refuerzo. La lógica está en motor.js; aquí solo se pinta y se guarda.

import { responder, resumen, ejercicioActual, terminada, nombreConcepto, REFUERZOS_POR_FALLO } from '../motor.js';
import { renderTex } from './formulas.js';

const LETRAS = ['a', 'b', 'c', 'd'];

/**
 *   progreso: el estado de la tarea (se va sustituyendo por el nuevo).
 *   guardar(progreso): promesa; se llama tras cada respuesta.
 *   alSalir(): volver a la lista.
 */
export function pantallaTarea(app, { progreso, guardar, alSalir }) {
  let estado = progreso;

  function pintar() {
    if (terminada(estado)) return pintarResumen();
    const ej = ejercicioActual(estado);
    const total = estado.ejercicios.length;
    app.innerHTML = `
      <section class="tarjeta">
        <div class="progreso">
          <span>${estado.titulo}</span>
          <span>Ejercicio <b>${estado.indice + 1}</b> de ${total}</span>
        </div>
        <div class="barra"><div style="width:${Math.round((100 * estado.indice) / total)}%"></div></div>
        ${ej.refuerzo ? `<div class="refuerzo-aviso">Refuerzo: ${nombreConcepto(ej.origen)}</div>` : ''}
        <p class="pregunta">${escapar(ej.texto ?? '')}</p>
        <div class="enunciado" id="enunciado" ${ej.enunciado ? '' : 'hidden'}></div>
        <div class="opciones" id="opciones"></div>
        <div id="feedback"></div>
        <div class="botonera" id="botonera">
          <button type="button" class="discreto" id="salir">Guardar y salir</button>
        </div>
      </section>`;
    if (ej.enunciado) renderTex(app.querySelector('#enunciado'), ej.enunciado, { displayMode: true });
    const contenedor = app.querySelector('#opciones');
    ej.opciones.forEach((op, i) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'opcion';
      boton.dataset.indice = i;
      const letra = document.createElement('span');
      letra.className = 'opcion__letra';
      letra.textContent = LETRAS[i];
      const tex = document.createElement('span');
      tex.className = 'opcion__tex';
      renderTex(tex, op.tex);
      boton.append(letra, tex);
      boton.addEventListener('click', () => contestar(i));
      contenedor.appendChild(boton);
    });
    app.querySelector('#salir').addEventListener('click', alSalir);
  }

  async function contestar(i) {
    const ej = ejercicioActual(estado);
    const antes = estado.ejercicios.length;
    estado = responder(estado, i);
    const anadidos = estado.ejercicios.length - antes;
    const opcion = ej.opciones[i];

    // Pintar el resultado en los botones.
    app.querySelectorAll('.opcion').forEach(b => {
      const j = Number(b.dataset.indice);
      b.disabled = true;
      if (ej.opciones[j].correcta) b.classList.add('opcion--correcta');
      else if (j === i) b.classList.add('opcion--elegida-mal');
      else b.classList.add('opcion--apagada');
    });

    const feedback = app.querySelector('#feedback');
    if (opcion.correcta) {
      feedback.innerHTML = `<div class="feedback feedback--ok"><strong>¡Correcto!</strong></div>`;
    } else {
      const refuerzo = anadidos > 0
        ? `<span class="refuerzo">Se han añadido ${anadidos} ejercicios de <b>${nombreConcepto(opcion.error.concepto)}</b> para practicar.</span>`
        : '';
      feedback.innerHTML = `<div class="feedback feedback--mal"><strong>No es correcto.</strong>${escapar(opcion.error.feedback)}${refuerzo}</div>`;
    }

    const botonera = app.querySelector('#botonera');
    botonera.innerHTML = '';
    const siguiente = document.createElement('button');
    siguiente.type = 'button';
    siguiente.className = 'ancho';
    siguiente.textContent = terminada(estado) ? 'Ver resultado' : 'Siguiente';
    siguiente.addEventListener('click', pintar);
    botonera.appendChild(siguiente);
    siguiente.focus();

    try {
      await guardar(estado);
    } catch (e) {
      console.error(e);
      const aviso = document.createElement('div');
      aviso.className = 'aviso aviso--error';
      aviso.textContent = 'No se pudo guardar la respuesta (¿sin conexión?). Se volverá a intentar con la siguiente.';
      feedback.appendChild(aviso);
    }
  }

  function pintarResumen() {
    const r = resumen(estado);
    const conceptos = Object.entries(r.erroresPorConcepto).sort((a, b) => b[1] - a[1]);
    app.innerHTML = `
      <section class="tarjeta">
        <h2>${escapar(estado.titulo)}: terminada</h2>
        <div class="resumen-grande">${r.porcentaje}%</div>
        <p style="text-align:center">de aciertos</p>
        <div class="resumen-datos">
          <div><b>${r.aciertos}</b><span>aciertos</span></div>
          <div><b>${r.hechos - r.aciertos}</b><span>fallos</span></div>
          <div><b>${r.refuerzosAnadidos}</b><span>de refuerzo</span></div>
        </div>
        ${conceptos.length ? `<h3>Lo que conviene repasar</h3><ul>${conceptos.map(([c, n]) => `<li>${nombreConcepto(c)}: ${n} ${n === 1 ? 'fallo' : 'fallos'}</li>`).join('')}</ul>` : '<p class="mensaje-ok">Sin fallos de concepto. ¡Muy bien!</p>'}
        <div class="botonera"><button type="button" class="ancho" id="volver">Volver</button></div>
      </section>`;
    app.querySelector('#volver').addEventListener('click', alSalir);
  }

  pintar();
}

export function escapar(texto) {
  return String(texto).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
