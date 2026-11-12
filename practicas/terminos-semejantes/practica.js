// Práctica «Términos semejantes» de la unidad 6 (Algebra): reconocer semejantes, coeficiente y parte
// literal, reducir y cazar el error de una reducción. Contrato de la base en `../_comun/base.js`; la
// lógica (ítems, distractores, corrección) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, NO_SE_HACERLO, explicaSemejantes, explicaCoeficiente, explicaReduce, explicaErrores } from './textos.js';
import {
  generarSemejantes, generarCoeficiente, generarReducir, generarErrores, corregirReducir, claveItem,
  explicaError, OPCIONES_ERROR,
} from './logica.js';

const cuenta = h => `<span class="cuenta">${h}</span>`;

const enunciadoSemejantes = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.semejantes)}</p>
    <div class="pareja">${cuenta(item.htmlA)}${cuenta(item.htmlB)}</div>`;

const enunciadoCoeficiente = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones[item.pregunta])}</p>
    <p class="frase">${cuenta(item.htmlTermino)}</p>`;

const enunciadoReduce = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.reduce)}</p>
    <p class="frase">${cuenta(item.htmlOrigen)}</p>`;

const enunciadoErrores = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.errores)}</p>
    <p class="frase">${cuenta(`${item.htmlOrigen} = ${item.htmlResultado}`)}</p>`;

function montarElegir(contenedor, item, api, enunciado, opciones, clase, alElegir) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase,
    opciones,
    alElegir(valor) {
      if (api.respondido()) return;
      const r = alElegir(valor);
      botones.marcar(r.correctas, valor);
      api.responder({ ...r.respuesta, espera: 2200 });
    },
  });
}

function montarSemejantes(contenedor, item, api) {
  const opciones = [
    { valor: 'si', html: api.tt(TX.semejantes.si) },
    { valor: 'no', html: api.tt(TX.semejantes.no) },
  ];
  montarElegir(contenedor, item, api, enunciadoSemejantes, opciones, 'elecciones si-no', valor => {
    const acierto = valor === item.correcta;
    return {
      correctas: [item.correcta],
      respuesta: {
        acierto, error: acierto ? undefined : item.error, respuesta: valor === 'si' ? 'semejantes' : 'no semejantes',
        html: ({ tt, idioma }) => (acierto ? '' : `${explicaError(item.error, idioma)}. `) + tt(item.solucion),
      },
    };
  });
}

function montarCoeficiente(contenedor, item, api) {
  const opciones = item.opciones.map(o => ({ valor: o.valor, html: o.html }));
  montarElegir(contenedor, item, api, enunciadoCoeficiente, opciones, 'elecciones elecciones--1', valor => {
    const o = item.opciones.find(x => x.valor === valor);
    return {
      correctas: item.opciones.filter(x => x.correcta).map(x => x.valor),
      respuesta: {
        acierto: o.correcta, error: o.error ?? undefined, respuesta: o.texto,
        html: ({ tt }) => (o.correcta ? '' : `${tt(o.por_que)} `) + tt(item.solucion),
      },
    };
  });
}

function montarErrores(contenedor, item, api) {
  const ids = ['ninguno', ...OPCIONES_ERROR];
  const opciones = ids.map(id => ({ valor: id, html: api.esc(api.tt(TX.errores[id])) }));
  montarElegir(contenedor, item, api, enunciadoErrores, opciones, 'elecciones elecciones--1', valor => {
    const acierto = valor === item.correcta;
    const aviso = acierto ? null : item.error === null ? TX.errores.noHayError : valor === 'ninguno' ? TX.errores.haError : TX.errores.otroError;
    return {
      correctas: [item.correcta],
      respuesta: {
        acierto, error: acierto ? undefined : `elegido-${valor}`, respuesta: valor,
        html: ({ tt }) => (aviso ? `${tt(aviso)} ` : '') + tt(item.solucion),
      },
    };
  });
}

function montarReduce(contenedor, item, api) {
  const { tt, esc } = api;
  contenedor.innerHTML = `
    ${enunciadoReduce(item, api)}
    <input type="text" class="campo-expresion" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(tt(TX.reduce.campo))}" placeholder="${TX.reduce.placeholder}">
    <p class="aviso-campo" aria-live="polite"></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('.campo-expresion');
  const aviso = contenedor.querySelector('.aviso-campo');
  const boton = contenedor.querySelector('#comprobar');

  const estado = () => {
    const v = campo.value.trim();
    if (v === '') return { listo: false };
    const r = corregirReducir(item, v);
    return r.valida ? { listo: true } : { listo: false, mensaje: r.mensaje };
  };
  const actualizar = () => {
    const e = estado();
    aviso.textContent = e.mensaje ? tt(e.mensaje) : '';
    campo.classList.toggle('campo-expresion--malo', Boolean(e.mensaje));
    campo.setAttribute('aria-invalid', String(Boolean(e.mensaje)));
    boton.disabled = !e.listo;
  };
  function comprobar() {
    if (api.respondido() || !estado().listo) return;
    const r = corregirReducir(item, campo.value);
    campo.disabled = true;
    boton.hidden = true;
    campo.classList.add(r.acierto ? 'campo-expresion--bien' : 'campo-expresion--mal');
    api.responder({
      acierto: r.acierto,
      error: r.acierto ? undefined : r.error,
      respuesta: campo.value.trim(),
      espera: 2200,
      html: ({ tt: t, idioma }) => `${r.acierto ? '' : `${r.error === 'otra-expresion' ? '' : `${explicaError(r.error, idioma)}. `}`}${t(item.solucion)}`,
    });
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

const ejercicio = (i, { generar, montar, enunciado, explicacion, noLoSe }) => ({
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  generar, clave: claveItem, montar, enunciado, explicacion,
  ...(noLoSe ? { noLoSe: NO_SE_HACERLO } : {}),
});

arrancar({
  slug: 'terminos-semejantes',
  ejercicios: [
    ejercicio(0, { generar: generarSemejantes, montar: montarSemejantes, enunciado: enunciadoSemejantes, explicacion: explicaSemejantes }),
    ejercicio(1, { generar: generarCoeficiente, montar: montarCoeficiente, enunciado: enunciadoCoeficiente, explicacion: explicaCoeficiente }),
    ejercicio(2, { generar: generarReducir, montar: montarReduce, enunciado: enunciadoReduce, explicacion: explicaReduce, noLoSe: true }),
    ejercicio(3, { generar: generarErrores, montar: montarErrores, enunciado: enunciadoErrores, explicacion: explicaErrores }),
  ],
});
