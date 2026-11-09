// PRÁCTICA «¿Es solución?» (unidad 6, semana 2, sesión 5): comprobar si un número es solución de una ecuación
// sustituyendo, reconocer la ecuación que tiene una solución dada, distinguir identidad y ecuación, e inventar una.
//
// Reparto de ficheros: logica.js (puro: ítems, errores, corrección), textos.js, practica.js (interfaz),
// estilos.css (la ecuación destacada y el aviso del campo).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import {
  ecuacionDe, htmlDe, ecuacion3, claveDe, generarComprueba, generarQueEcuacion, generarIdentidad, generarInventa,
  errorDeComprueba, errorDeIdentidad, validar, errorDeInventa, textoDe, numTexto,
} from './logica.js';
import { TX } from './textos.js';

const xIgual = (v, idioma) => `<i>x</i> = ${numTexto(v, idioma)}`;

// ─── Enunciados ──────────────────────────────────────────────────────────────────────────────

const enunciado1 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej1.instruccion)(item)}</p>
  <p class="expresion-destacada">${htmlDe(item)}</p>`;

const enunciado2 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej2.instruccion)(item)}</p>`;

const enunciado3 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej3.instruccion)}</p>
  <p class="expresion-destacada">${ecuacion3(item).aHtml()}</p>`;

const enunciado4 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej4.instruccion)(item)}</p>`;

// ─── Montaje ─────────────────────────────────────────────────────────────────────────────────

function montar1(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado1(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: [{ valor: 'si', html: tt(TX.botones.si) }, { valor: 'no', html: tt(TX.botones.no) }],
    alElegir(valor) {
      if (api.respondido()) return;
      const error = errorDeComprueba(item, valor);
      botones.marcar([item.esSolucion ? 'si' : 'no'], valor);
      api.responder({
        acierto: error === null, error: error ?? undefined, respuesta: valor === 'si' ? 'sí' : 'no', espera: 3200,
        html: ({ tt: t2 }) => (error === null ? t2(TX.ej1.correcto)(item) : t2(TX.ej1.por_que)(item, error)),
      });
    },
  });
}

function montar2(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado2(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: htmlDe(o.e) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const o = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((x, i) => (x.correcta ? i : null)).filter(i => i !== null).map(String), valor);
      api.responder({
        acierto: o.correcta, error: o.error ?? undefined, respuesta: textoDe(o.e), espera: 3600,
        html: ({ tt }) => (o.correcta ? tt(TX.ej2.correcto)(item) : tt(TX.ej2.por_que)(item, o) + tt(TX.ej2.correcto)(item)),
      });
    },
  });
}

function montar3(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado3(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: [{ valor: 'identidad', html: tt(TX.botones.identidad) }, { valor: 'ecuacion', html: tt(TX.botones.ecuacion) }],
    alElegir(valor) {
      if (api.respondido()) return;
      const error = errorDeIdentidad(item, valor);
      botones.marcar([item.tipo], valor);
      api.responder({
        acierto: error === null, error: error ?? undefined, respuesta: valor, espera: 3600,
        html: ({ tt: t2 }) => (error === null ? t2(TX.ej3.correcto)(item) : t2(TX.ej3.por_que)(item)),
      });
    },
  });
}

function montar4(contenedor, item, api) {
  const { tt, idioma } = api;
  contenedor.innerHTML = `${enunciado4(item, api)}
    <input type="text" class="campo-ecuacion" id="campo" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(tt(TX.campos.ecuacion))}">
    <p class="aviso-campo" id="aviso" role="status"></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#campo'), boton = contenedor.querySelector('#comprobar'), aviso = contenedor.querySelector('#aviso');
  const actualizar = () => {
    boton.disabled = caja.value.trim() === '' || api.respondido();
    aviso.textContent = '';
  };
  const comprobar = () => {
    if (api.respondido() || caja.value.trim() === '') return;
    const v = validar(caja.value, item);
    if (!v.ok) {
      aviso.textContent = v.mensaje ? v.mensaje[idioma] : '';
      caja.classList.add('campo-numero--malo');
      return;
    }
    caja.classList.remove('campo-numero--malo');
    caja.disabled = true;
    boton.hidden = true;
    const error = errorDeInventa(v.q, item);
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: caja.value.trim(), espera: 3600,
      html: ({ tt: t2 }) => (error === null ? t2(TX.ej4.correcto)(item, v.q) : t2(TX.ej4.por_que)(item, v.q, error) + t2(TX.ej4.ejemplo)(item)),
    });
  };
  caja.addEventListener('input', () => { caja.classList.remove('campo-numero--malo'); actualizar(); });
  caja.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
});

arrancar({
  slug: 'es-solucion',
  ejercicios: [
    ejercicio(TX.ej1, generarComprueba, montar1, enunciado1),
    ejercicio(TX.ej2, generarQueEcuacion, montar2, enunciado2),
    ejercicio(TX.ej3, generarIdentidad, montar3, enunciado3),
    ejercicio(TX.ej4, generarInventa, montar4, enunciado4),
  ],
});
