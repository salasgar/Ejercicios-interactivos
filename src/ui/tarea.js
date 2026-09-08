// Pantalla de una tarea: un ejercicio cada vez, corrección inmediata, feedback
// y refuerzo. La lógica está en motor.js; aquí solo se pinta y se guarda.

import { responder, resumen, ejercicioActual, terminada, REFUERZOS_POR_FALLO } from '../motor.js';
import { renderTex } from './formulas.js';
import { t, forzar, alCambiarIdioma, bilingue } from '../i18n/index.js';
import { preguntaDe, feedbackDe, nombreConcepto, notaDe } from '../textos.js';

const LETRAS = ['a', 'b', 'c', 'd'];

/**
 *   progreso: el estado de la tarea (se va sustituyendo por el nuevo).
 *   guardar(progreso): promesa; se llama tras cada respuesta.
 *   alSalir(): volver a la lista.
 */
export function pantallaTarea(app, { progreso, guardar, alSalir }) {
  let estado = progreso;
  // Fase de la pantalla, para poder repintarla al cambiar el idioma sin perder nada.
  let fase = 'pregunta';
  let ultima = null; // { ejercicio, elegida, anadidos, errorGuardado }

  forzar({ idioma: estado.idioma, notacion: estado.notacion });
  alCambiarIdioma(() => pintar());
  const salir = () => { forzar({}); alCambiarIdioma(null); alSalir(); };

  function pintar() {
    if (terminada(estado) && fase !== 'feedback') return pintarResumen();
    const ej = fase === 'feedback' ? ultima.ejercicio : ejercicioActual(estado);
    const numero = fase === 'feedback' ? estado.indice : estado.indice + 1;
    const total = estado.ejercicios.length;
    app.innerHTML = `
      <section class="tarjeta">
        <div class="progreso">
          <span>${escapar(estado.titulo)}</span>
          <span>${t('ejercicio_de', { n: `<b>${numero}</b>`, total })}</span>
        </div>
        <div class="barra"><div style="width:${Math.round((100 * (numero - 1)) / total)}%"></div></div>
        ${ej.refuerzo ? `<div class="refuerzo-aviso">${t('refuerzo', { concepto: escapar(nombreConcepto(ej.origen)) })}</div>` : ''}
        <p class="pregunta">${escapar(preguntaDe(ej))}</p>
        <div class="enunciado" id="enunciado" ${ej.enunciado ? '' : 'hidden'}></div>
        <div class="opciones${ej.opciones.length === 2 ? ' opciones--dos' : ''}" id="opciones"></div>
        <div id="feedback"></div>
        <div class="botonera" id="botonera">
          <button type="button" class="discreto" id="salir">${t('guardar_y_salir')}</button>
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
      const cuerpo = document.createElement('span');
      cuerpo.className = 'opcion__tex';
      if (op.tex != null) renderTex(cuerpo, op.tex);
      else { cuerpo.classList.add('opcion__texto'); cuerpo.textContent = bilingue(op.texto); }
      boton.append(letra, cuerpo);
      boton.addEventListener('click', () => contestar(i));
      contenedor.appendChild(boton);
    });
    app.querySelector('#salir').addEventListener('click', salir);
    if (fase === 'feedback') pintarFeedback();
  }

  async function contestar(i) {
    if (fase !== 'pregunta') return;
    const ej = ejercicioActual(estado);
    const antes = estado.ejercicios.length;
    estado = responder(estado, i);
    ultima = { ejercicio: ej, elegida: i, anadidos: estado.ejercicios.length - antes, errorGuardado: false };
    fase = 'feedback';
    pintarFeedback();
    try {
      await guardar(estado);
    } catch (e) {
      console.error(e);
      ultima.errorGuardado = true;
      if (fase === 'feedback') pintarFeedback();
    }
  }

  function pintarFeedback() {
    const { ejercicio: ej, elegida: i, anadidos } = ultima;
    const opcion = ej.opciones[i];
    app.querySelectorAll('.opcion').forEach(b => {
      const j = Number(b.dataset.indice);
      b.disabled = true;
      b.classList.remove('opcion--correcta', 'opcion--elegida-mal', 'opcion--apagada');
      if (ej.opciones[j].correcta) b.classList.add('opcion--correcta');
      else if (j === i) b.classList.add('opcion--elegida-mal');
      else b.classList.add('opcion--apagada');
    });

    const feedback = app.querySelector('#feedback');
    if (opcion.correcta) {
      feedback.innerHTML = `<div class="feedback feedback--ok"><strong>${t('correcto')}</strong></div>`;
    } else {
      const refuerzo = anadidos > 0
        ? `<span class="refuerzo">${t('refuerzo_anadido', { n: anadidos, concepto: `<b>${escapar(nombreConcepto(opcion.error.concepto))}</b>` })}</span>`
        : '';
      feedback.innerHTML = `<div class="feedback feedback--mal"><strong>${t('incorrecto')}</strong>${escapar(feedbackDe(ej.tipo, opcion.error.id))}${refuerzo}</div>`;
    }
    // Pasos: lo que ha hecho el alumno (si falló y el distractor los tiene) y la solución.
    if (!opcion.correcta && opcion.pasos?.length) {
      feedback.appendChild(bloquePasos(t('lo_que_has_hecho'), ej.tipo, opcion.pasos, t('aqui_esta_el_fallo'), false));
    }
    if (ej.solucion?.length) {
      feedback.appendChild(bloquePasos(t('como_se_hace'), ej.tipo, ej.solucion, null, opcion.correcta));
    }
    if (ultima.errorGuardado) {
      const aviso = document.createElement('div');
      aviso.className = 'aviso aviso--error';
      aviso.textContent = t('no_guardado');
      feedback.appendChild(aviso);
    }

    const botonera = app.querySelector('#botonera');
    botonera.innerHTML = '';
    const siguiente = document.createElement('button');
    siguiente.type = 'button';
    siguiente.className = 'ancho';
    siguiente.textContent = terminada(estado) ? t('ver_resultado') : t('siguiente');
    siguiente.addEventListener('click', () => { fase = 'pregunta'; ultima = null; pintar(); });
    botonera.appendChild(siguiente);
    siguiente.focus();
  }

  function pintarResumen() {
    fase = 'resumen';
    const r = resumen(estado);
    const conceptos = Object.entries(r.erroresPorConcepto).sort((a, b) => b[1] - a[1]);
    app.innerHTML = `
      <section class="tarjeta">
        <h2>${t('terminada', { titulo: escapar(estado.titulo) })}</h2>
        <div class="resumen-grande">${r.porcentaje}%</div>
        <p style="text-align:center">${t('de_aciertos')}</p>
        <div class="resumen-datos">
          <div><b>${r.aciertos}</b><span>${t('aciertos')}</span></div>
          <div><b>${r.hechos - r.aciertos}</b><span>${t('fallos')}</span></div>
          <div><b>${r.refuerzosAnadidos}</b><span>${t('de_refuerzo')}</span></div>
        </div>
        ${conceptos.length
          ? `<h3>${t('conviene_repasar')}</h3><ul>${conceptos.map(([c, n]) => `<li>${escapar(nombreConcepto(c))}: ${n} ${n === 1 ? t('fallo') : t('fallos_plural')}</li>`).join('')}</ul>`
          : `<p class="mensaje-ok">${t('sin_fallos')}</p>`}
        <div class="botonera"><button type="button" class="ancho" id="volver">${t('volver')}</button></div>
      </section>`;
    app.querySelector('#volver').addEventListener('click', salir);
  }

  pintar();
}

/**
 * Lista de pasos. Cada paso: { tex, calculo?, nota?, mal? }. El paso marcado
 * como `mal` va en rojo con la explicación del error debajo. Si `plegado`, va
 * dentro de un desplegable (cuando el alumno ha acertado).
 */
function bloquePasos(titulo, tipo, pasos, explicacionError, plegado) {
  const contenedor = document.createElement(plegado ? 'details' : 'section');
  contenedor.className = 'pasos';
  const cabecera = document.createElement(plegado ? 'summary' : 'h3');
  cabecera.textContent = plegado ? t('ver_pasos') : titulo;
  contenedor.appendChild(cabecera);
  const lista = document.createElement('ol');
  lista.className = 'pasos__lista';
  for (const p of pasos) {
    const li = document.createElement('li');
    li.className = 'paso' + (p.mal ? ' paso--mal' : '');
    const formula = document.createElement('div');
    formula.className = 'paso__formula';
    renderTex(formula, p.tex, { displayMode: true });
    li.appendChild(formula);
    const detalle = document.createElement('div');
    detalle.className = 'paso__detalle';
    if (p.calculo) {
      const calc = document.createElement('span');
      calc.className = 'paso__calculo';
      calc.appendChild(document.createTextNode('('));
      renderTex(calc.appendChild(document.createElement('span')), p.calculo);
      calc.appendChild(document.createTextNode(')'));
      detalle.appendChild(calc);
    }
    const nota = p.mal ? (explicacionError ?? '') : notaDe(tipo, p.nota);
    if (nota) {
      const span = document.createElement('span');
      span.className = 'paso__nota';
      span.textContent = p.mal ? t('aqui_esta_el_fallo') : nota;
      detalle.appendChild(span);
    }
    if (detalle.childNodes.length) li.appendChild(detalle);
    lista.appendChild(li);
  }
  contenedor.appendChild(lista);
  return contenedor;
}

export function escapar(texto) {
  return String(texto).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
