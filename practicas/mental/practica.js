// Práctica «Cálculo mental con estrategia» (repaso de la unidad 1). Contrato de
// la base: ver ../plantilla/practica.js.
//
// 1. Compensar: redondeo, ajuste y resultado, en tres pasos.
// 2. Descomponer: elegir cómo partir el factor y ejecutarlo.
// 3. ¿Qué conviene?: elegir la estrategia; solo falla la que no se puede aplicar.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarCompensar, generarDescomponer, generarEstrategia, enunciadoCompensar, lineaCompensar,
  redondeoCorrecto, ajusteCorrecto, resultadoCorrecto, valorOpcion, reconstruye, lineaDescomponer,
  descomposicionCorrecta, estrategiaValida, mejorEstrategia, lineaEstrategia, razonNoAplica, descomposicionComoda,
} from './logica.js';

const P = '·';

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

function montarCompensar(contenedor, item, api) {
  const { tt } = api;
  const x = TX.compensar;
  const texto = enunciadoCompensar(item);
  const explicacion = (item.variante === 'producto' ? tt(x.explicacion_producto) : tt(x.explicacion_suma))(item.n, item.k, item.R, item.falta, item.valor);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.pregunta)(texto)}</p>
    <div class="operacion">${texto}</div>
    <div class="mental-linea" id="linea"></div>
    <div id="paso"></div>`;
  const linea = contenedor.querySelector('#linea');
  const paso = contenedor.querySelector('#paso');
  const fallo = html => api.responder({ acierto: false, html, espera: 3800 });

  // Paso 1: el redondeo.
  paso.innerHTML = `<p class="instruccion">${tt(x.paso_redondeo)(item.k)}</p>`;
  const r = elecciones(paso, {
    clase: 'mental-opciones',
    opciones: item.redondeos.map((o, i) => ({ valor: i, html: o.texto })),
    alElegir(i) {
      if (api.respondido()) return;
      r.marcar([item.redondeos.findIndex(o => o.correcta)], i);
      if (!redondeoCorrecto(item, i)) return fallo(`${tt(x.redondeo_mal)(item.k, item.R)} ${explicacion}`);
      linea.innerHTML = `<span class="cuenta">${lineaCompensar(item)}</span>`;
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
          return fallo(`${tt(x.ajuste_mal)(mala.expr, mala.valor, item.valor)} ${explicacion}`);
        }
        linea.innerHTML = `<span class="cuenta">${lineaCompensar(item, item.ajustes[bien])}</span>`;
        paso3();
      },
    });
  }

  // Paso 3: el resultado.
  function paso3() {
    pedirNumero(paso, api, tt(x.paso_resultado), valor => {
      if (resultadoCorrecto(item, valor)) return api.responder({ acierto: true, html: explicacion, espera: 2800 });
      fallo(`${tt(x.resultado_mal)(item.valor)} ${explicacion}`);
    });
  }
}

// ─── Ejercicio 2: descomponer ──────────────────────────────────────────────────

function montarDescomponer(contenedor, item, api) {
  const { tt } = api;
  const x = TX.descomponer;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.pregunta)(item.a, item.b)}</p>
    <div class="operacion">${item.a} ${P} ${item.b}</div>
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
          html: `${tt(x.no_reconstruye)(op.texto, valorOpcion(op), item.b)} <span class="cuenta">${lineaDescomponer(item, item.opciones.find(o => o.correcta && o.clase === 'producto'))}</span>`,
          espera: 3600,
        });
      }
      linea.innerHTML = `<span class="cuenta">${lineaDescomponer(item, op).split(' = ').slice(0, 3).join(' = ')}</span>`;
      pedirNumero(paso, api, tt(x.resultado), valor => {
        const acierto = descomposicionCorrecta(item, i, valor);
        const completa = `<span class="cuenta">${lineaDescomponer(item, op)}</span>`;
        const comoda = op.clase === 'producto' ? '' : ` ${tt(x.comoda)(item.a, item.p, item.q, item.b)}`;
        if (acierto) return api.responder({ acierto: true, html: `${completa}.${comoda}`, espera: comoda ? 3600 : 2600 });
        api.responder({ acierto: false, html: `${tt(x.cuenta_mal)(item.valor)} ${completa}`, espera: 3600 });
      });
    },
  });
}

// ─── Ejercicio 3: ¿qué conviene? ───────────────────────────────────────────────

function montarEstrategia(contenedor, item, api) {
  const { tt } = api;
  const x = TX.estrategia;
  const { a, b } = item.op;
  const problema = item.enunciado ? tt(x.problemas[item.enunciado])(a, b) : null;
  contenedor.innerHTML = `
    ${problema ? `<p class="frase">${problema}</p>` : `<div class="operacion">${item.texto}</div>`}
    <p class="instruccion">${tt(x.pregunta)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'mental-estrategias',
    opciones: item.botones.map(e => ({ valor: e, html: tt(x.boton[e]) })),
    alElegir(e) {
      if (api.respondido()) return;
      const validas = item.botones.filter(v => estrategiaValida(item, v));
      botones.marcar(validas, e);
      const mejor = mejorEstrategia(item);
      const consejo = mejor === 'compensar' || mejor === 'descomponer'
        ? `${tt(x.mejor[mejor])} <span class="cuenta">${lineaEstrategia(item, mejor)}</span>.`
        : tt(x.mejor[mejor]);
      const cuenta = `<span class="cuenta">${item.texto} = ${item.valor}</span>`;
      if (estrategiaValida(item, e)) {
        return api.responder({ acierto: true, html: `${tt(x.vale)} ${e === mejor ? '' : `${consejo} `}${cuenta}.`.replace('  ', ' '), espera: 3200 });
      }
      const razon = razonNoAplica(item, e);
      const porque = tt(x[`no_${razon.clave}`])(razon.a, razon.b);
      api.responder({ acierto: false, html: `${porque} ${consejo}`, espera: 3800 });
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
    },
    {
      nombre: TX.descomponer.nombre,
      detalle: TX.descomponer.detalle,
      introduccion: TX.descomponer.introduccion,
      generar: generarDescomponer,
      clave: item => `${item.a}${item.b}`,
      montar: montarDescomponer,
    },
    {
      nombre: TX.estrategia.nombre,
      detalle: TX.estrategia.detalle,
      introduccion: TX.estrategia.introduccion,
      generar: generarEstrategia,
      clave: item => `${item.texto}${item.enunciado}`,
      montar: montarEstrategia,
    },
  ],
});
