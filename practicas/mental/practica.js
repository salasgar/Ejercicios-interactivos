// Práctica «Cálculo mental con estrategia» (repaso de la unidad 1). Contrato de
// la base: ver ../plantilla/practica.js.
//
// 1. Compensar: redondeo, ajuste y resultado, en tres pasos.
// 2. Descomponer: elegir cómo partir el factor y ejecutarlo.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarCompensar, generarDescomponer, enunciadoCompensar, lineaCompensar,
  redondeoCorrecto, ajusteCorrecto, resultadoCorrecto, valorOpcion, reconstruye, lineaDescomponer,
  descomposicionCorrecta,
} from './logica.js';

const P = '·';

/** Una cadena de igualdades que se parte por los «=» (cada tramo no se parte), para que quepa en 375 px. */
const cadena = linea => linea.split(' = ').map(t => `<span class="cuenta">${t}</span>`).join(' = ');

function campoNumero(id) {
  return `<input type="number" inputmode="numeric" id="${id}" class="mental-entero" autocomplete="off">`;
}

/** Entrada numérica + «Comprobar» dentro de `caja`; llama a `alComprobar(valor)` una vez. */
function pedirNumero(caja, api, etiqueta, alComprobar) {
  caja.innerHTML = `
    <label class="instruccion" for="num">${etiqueta}</label>
    ${campoNumero('num')}
    <button type="button" class="comprobar" id="ok">${api.t.comprobar}</button>`;
  const campo = caja.querySelector('#num');
  const boton = caja.querySelector('#ok');
  campo.focus();
  const comprobar = () => {
    if (api.respondido() || campo.value === '') return;
    campo.disabled = true;
    boton.hidden = true;
    alComprobar(campo.value);
  };
  boton.addEventListener('click', comprobar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); });
}

// ─── Ejercicio 1: compensar ────────────────────────────────────────────────────

const enunciadoCompensarTexto = (item, { tt }) => {
  const texto = enunciadoCompensar(item);
  return `
    <p class="instruccion">${tt(TX.compensar.pregunta)(texto)}</p>
    <div class="operacion">${texto}</div>`;
};

/** La explicación del ítem, en el idioma de los textos que recibe. */
const explicacionCompensar = (item, { tt }) => {
  const x = TX.compensar;
  return (item.variante === 'producto' ? tt(x.explicacion_producto) : tt(x.explicacion_suma))(item.n, item.k, item.R, item.falta, item.valor);
};

function montarCompensar(contenedor, item, api) {
  const { tt } = api;
  const x = TX.compensar;
  contenedor.innerHTML = `${enunciadoCompensarTexto(item, api)}
    <div class="mental-linea" id="linea"></div>
    <div id="paso"></div>`;
  const linea = contenedor.querySelector('#linea');
  const paso = contenedor.querySelector('#paso');
  const fallo = html => api.responder({ acierto: false, html, espera: 3800 });
  const conExplicacion = frase => textos => `${frase(textos)} ${explicacionCompensar(item, textos)}`;

  // Paso 1: el redondeo.
  paso.innerHTML = `<p class="instruccion">${tt(x.paso_redondeo)(item.k)}</p>`;
  const r = elecciones(paso, {
    clase: 'mental-opciones',
    opciones: item.redondeos.map((o, i) => ({ valor: i, html: o.texto })),
    alElegir(i) {
      if (api.respondido()) return;
      r.marcar([item.redondeos.findIndex(o => o.correcta)], i);
      if (!redondeoCorrecto(item, i)) return fallo(conExplicacion(({ tt }) => tt(x.redondeo_mal)(item.k, item.R)));
      linea.innerHTML = cadena(lineaCompensar(item));
      paso2();
    },
  });

  // Paso 2: el ajuste.
  function paso2() {
    paso.innerHTML = `<p class="instruccion">${tt(x.paso_ajuste)}</p>`;
    const a = elecciones(paso, {
      clase: 'mental-opciones',
      opciones: item.ajustes.map((o, i) => ({ valor: i, html: o.texto })),
      alElegir(i) {
        if (api.respondido()) return;
        const bien = item.ajustes.findIndex(o => o.correcta);
        a.marcar([bien], i);
        if (!ajusteCorrecto(item, i)) {
          const mala = item.ajustes[i];
          return fallo(conExplicacion(({ tt }) => tt(x.ajuste_mal)(mala.expr, mala.valor, item.valor)));
        }
        linea.innerHTML = cadena(lineaCompensar(item, item.ajustes[bien]));
        paso3();
      },
    });
  }

  // Paso 3: el resultado.
  function paso3() {
    pedirNumero(paso, api, tt(x.paso_resultado), valor => {
      if (resultadoCorrecto(item, valor)) return api.responder({ acierto: true, html: textos => explicacionCompensar(item, textos), espera: 2800 });
      fallo(conExplicacion(({ tt }) => tt(x.resultado_mal)(item.valor)));
    });
  }
}

// ─── Ejercicio 2: descomponer ──────────────────────────────────────────────────

const enunciadoDescomponer = (item, { tt }) => `
    <p class="instruccion">${tt(TX.descomponer.pregunta)(item.a, item.b)}</p>
    <div class="operacion">${item.a} ${P} ${item.b}</div>`;

function montarDescomponer(contenedor, item, api) {
  const { tt } = api;
  const x = TX.descomponer;
  contenedor.innerHTML = `${enunciadoDescomponer(item, api)}
    <div class="mental-linea" id="linea"></div>
    <div id="paso"></div>`;
  const linea = contenedor.querySelector('#linea');
  const paso = contenedor.querySelector('#paso');
  const botones = elecciones(paso, {
    clase: 'mental-opciones',
    opciones: item.opciones.map((o, i) => ({ valor: i, html: o.texto })),
    alElegir(i) {
      if (api.respondido()) return;
      const op = item.opciones[i];
      botones.marcar(item.opciones.map((o, j) => (reconstruye(item, o) ? j : -1)).filter(j => j >= 0), i);
      if (!reconstruye(item, op)) {
        return api.responder({
          acierto: false,
          html: ({ tt }) => `${tt(x.no_reconstruye)(op.texto, valorOpcion(op), item.b)} ${cadena(lineaDescomponer(item, item.opciones.find(o => o.correcta && o.clase === 'producto')))}`,
          espera: 3600,
        });
      }
      linea.innerHTML = cadena(lineaDescomponer(item, op).split(' = ').slice(0, 3).join(' = '));
      pedirNumero(paso, api, tt(x.resultado), valor => {
        const acierto = descomposicionCorrecta(item, i, valor);
        const completa = cadena(lineaDescomponer(item, op));
        const esProducto = op.clase === 'producto';
        const comoda = ({ tt }) => esProducto ? '' : ` ${tt(x.comoda)(item.a, item.p, item.q, item.b)}`;
        if (acierto) return api.responder({ acierto: true, html: textos => `${completa}.${comoda(textos)}`, espera: esProducto ? 2600 : 3600 });
        api.responder({ acierto: false, html: ({ tt }) => `${tt(x.cuenta_mal)(item.valor)} ${completa}`, espera: 3600 });
      });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'mental',
  ejercicios: [
    {
      nombre: TX.compensar.nombre,
      detalle: TX.compensar.detalle,
      introduccion: TX.compensar.introduccion,
      generar: generarCompensar,
      clave: item => `${item.variante}${item.n}${item.k}`,
      montar: montarCompensar,
      enunciado: enunciadoCompensarTexto,
    },
    {
      nombre: TX.descomponer.nombre,
      detalle: TX.descomponer.detalle,
      introduccion: TX.descomponer.introduccion,
      generar: generarDescomponer,
      clave: item => `${item.a}${item.b}`,
      montar: montarDescomponer,
      enunciado: enunciadoDescomponer,
    },
  ],
});
