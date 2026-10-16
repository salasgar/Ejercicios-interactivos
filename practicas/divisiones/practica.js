// Práctica «Divisiones sucesivas guiadas»: la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica (generadores y comprobaciones) está en
// `logica.js`, puro y probado en `tests/practicas-divisiones.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { htmlFact } from '../_comun/aritmetica.js';
import {
  botonesEscalera, generarEscalera, evaluarEleccion, razonNoDivide, razonNoMenor, razonCompuesto, explicarEscalera,
  generarPotencias, exponenteDe, esFactorizacionCorrecta, explicarPotencias,
  generarEjercicio3, explicarEj3,
} from './logica.js';
import { TX } from './textos.js';

const EXPONENTE_MAXIMO = 6;

// ─── Ejercicio 1: la escalera de divisiones ─────────────────────────────────────
// El alumno pulsa, paso a paso, el MENOR primo que divide al número actual. Si
// se equivoca (no divide, es compuesto, o divide pero no es el menor), la app
// lo explica y el número se queda como está hasta que pulse el primo correcto.
// El ítem termina al llegar a 1 y es acierto solo si no hubo ningún error.

const enunciadoEscalera = (item, { tt }) => `
    <p class="instruccion">${tt(TX.escalera.instruccion)}</p>
    <div class="operacion">${item.n}</div>`;

function montarEscalera(contenedor, item, api) {
  let m = item.n;
  let errores = 0;
  const realizados = [];
  contenedor.innerHTML = `
    <p class="instruccion">${api.tt(TX.escalera.instruccion)}</p>
    <div class="operacion" id="numero">${m}</div>
    <p class="frase" id="mensaje"></p>
    <div class="botones-numeros" id="botones" role="group" aria-label="primos"></div>`;
  const numeroEl = contenedor.querySelector('#numero');
  const mensajeEl = contenedor.querySelector('#mensaje');
  const cajaBotones = contenedor.querySelector('#botones');

  const botones = botonesEscalera(item).map(p => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(p);
    b.addEventListener('click', () => manejar(p));
    cajaBotones.append(b);
    return b;
  });

  function avanzar(p) {
    realizados.push([m, p]);
    m /= p;
    numeroEl.textContent = String(m);
    if (m === 1) {
      botones.forEach(b => { b.disabled = true; });
      api.responder({ acierto: errores === 0, html: ({ idioma }) => explicarEscalera(item.n, realizados, idioma), espera: 2600 });
    }
  }

  // Al fallar el número se queda como está: el alumno hace la escalera entera.
  function manejar(p) {
    if (api.respondido() || m === 1) return;
    const { resultado, correcto } = evaluarEleccion(m, p);
    if (resultado === 'correcto') {
      mensajeEl.textContent = '';
      avanzar(p);
      return;
    }
    errores++;
    mensajeEl.innerHTML = resultado === 'no_divide' ? razonNoDivide(m, p, api.idioma)
      : resultado === 'compuesto' ? razonCompuesto(m, p, api.idioma)
        : razonNoMenor(m, p, correcto, api.idioma);
  }
}

// ─── Ejercicio 2: la forma de potencias ─────────────────────────────────────────
// Se da la lista de primos («2 · 2 · 2 · 3 · 3 · 5») y el alumno fija, con
// steppers, el exponente de cada base candidata (las que aparecen, más una que
// no, para que poner 0 también sea una respuesta válida).

const enunciadoPotencias = (item, { tt }) => `
    <p class="instruccion">${tt(TX.potencias.instruccion)}</p>
    <div class="operacion">${item.n} = ${item.lista.join(' · ')}</div>`;

function montarPotencias(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.potencias.instruccion)}</p>
    <div class="operacion" id="lista">${item.n} = ${item.lista.join(' · ')}</div>
    <div class="operacion" id="expresion"></div>
    <div class="grupo-pasos" id="controles"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const cajaControles = contenedor.querySelector('#controles');
  const expresion = contenedor.querySelector('#expresion');
  const controles = [];
  // La expresión que se va formando: las bases con exponente 0 no aparecen; el hueco es «□».
  function pintarExpresion() {
    const f = item.bases.map((p, i) => [p, controles[i] ? controles[i].valor() : 0]).filter(([, e]) => e > 0);
    expresion.innerHTML = `${item.n} = ${f.length ? htmlFact(f) : '□'}`;
  }
  item.bases.forEach(p => controles.push(pasos(cajaControles, {
    max: EXPONENTE_MAXIMO,
    nombre: tt(TX.potencias.exponente_de(p)),
    // Con exponente 0 la base no cuenta: se ve tachada, no como un «3» suelto.
    pinta: e => (e === 0 ? `<s>${p}</s>` : `${p}<sup>${e}</sup>`),
    alCambiar: pintarExpresion,
  })));
  pintarExpresion();
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const exponentes = controles.map(c => c.valor());
    const acierto = esFactorizacionCorrecta(item, exponentes);
    controles.forEach(c => c.bloquear());
    ev.target.hidden = true;
    api.responder({ acierto, html: ({ idioma }) => explicarPotencias(item.factorizacion, idioma), espera: 2200 });
  });
}

// ─── Ejercicio 3: comprobar multiplicando ───────────────────────────────────────
// Variante «valor» (opciones numéricas) o «sino» (¿es correcta esta igualdad?),
// según `item.tipo`. Las tres opciones falsas son siempre inequívocamente
// falsas: el error clásico de tratar p^e como p·e, ese mismo error en solo uno
// de los factores, y el valor correcto ± un factor.

const enunciadoValor = (item, { tt }) => `<p class="instruccion instruccion--enunciado">${tt(TX.ej3.pregunta_valor)(htmlFact(item.factorizacion))}</p>`;
const enunciadoSino = (item, { tt }) => `<p class="instruccion instruccion--enunciado">${tt(TX.ej3.pregunta_sino)(htmlFact(item.factorizacion), item.valorMostrado)}</p>`;
const enunciadoEj3 = (item, textos) => (item.tipo === 'sino' ? enunciadoSino(item, textos) : enunciadoValor(item, textos));

function montarValor(contenedor, item, api) {
  contenedor.innerHTML = enunciadoValor(item, api);
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(v => ({ valor: v, html: String(v) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: ({ idioma }) => explicarEj3(item.factorizacion, idioma), espera: 2000 });
    },
  });
}

function montarSino(contenedor, item, api) {
  contenedor.innerHTML = enunciadoSino(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const correcta = item.igualdadCorrecta ? 'si' : 'no';
      botones.marcar([correcta], valor);
      api.responder({ acierto: valor === correcta, html: ({ idioma }) => explicarEj3(item.factorizacion, idioma), espera: 2000 });
    },
  });
}

function montarEj3(contenedor, item, api) {
  if (item.tipo === 'sino') return montarSino(contenedor, item, api);
  return montarValor(contenedor, item, api);
}

// ─── La práctica ─────────────────────────────────────────────────────────────────

arrancar({
  slug: 'divisiones',
  ejercicios: [
    {
      nombre: TX.escalera.nombre,
      detalle: TX.escalera.detalle,
      generar: generarEscalera,
      clave: item => String(item.n),
      montar: montarEscalera,
      enunciado: enunciadoEscalera,
    },
    {
      nombre: TX.potencias.nombre,
      detalle: TX.potencias.detalle,
      generar: generarPotencias,
      clave: item => item.lista.join(','),
      montar: montarPotencias,
      enunciado: enunciadoPotencias,
    },
    {
      nombre: TX.ej3.nombre,
      detalle: TX.ej3.detalle,
      generar: generarEjercicio3,
      montar: montarEj3,
      enunciado: enunciadoEj3,
    },
  ],
});
