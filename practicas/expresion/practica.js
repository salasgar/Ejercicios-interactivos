// Práctica «Del enunciado a la expresión» (repaso de la unidad 1): montar con
// fichas la expresión que modela un problema, sin calcularla.
//
//   logica.js   analizar, equivalentes, quitarSobrantes, corregir y los generadores
//   textos.js   los textos y el banco de enunciados (PLANTILLAS)
//   este        la interfaz: la línea de montaje, el teclado de fichas y el feedback
//
// El contrato de la base está en `../plantilla/practica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  OPERADORES, MAX_FICHAS, aFichas, evaluar, corregir, erroresDe, plantillaPorId,
  generarSin, generarCon, generarPotencias, claveItem,
} from './logica.js';

// ─── Cómo se escribe una expresión ─────────────────────────────────────────────

/** El símbolo de una ficha: «−» para la resta y, en inglés, «÷» para la división. */
function simbolo(ficha, idioma) {
  if (ficha === '-') return '−';
  if (ficha === ':') return idioma === 'en' ? '÷' : ':';
  return String(ficha);
}

/** Fichas → HTML en una línea: «(7 + 3) · 2», «3<sup>2</sup> + 4<sup>2</sup>». */
function htmlExpresion(fichas, idioma) {
  return fichas.map(f => {
    if (OPERADORES.includes(f)) return ` ${simbolo(f, idioma)} `;
    return f === '²' ? '<sup>2</sup>' : simbolo(f, idioma);
  }).join('');
}

/** «expresión = valor» si el valor es un entero; si no, la expresión sola. */
function cuenta(fichas, valor, idioma) {
  const igual = Number.isInteger(valor) ? ` = ${String(valor).replace('-', '−')}` : '';
  return `<span class="cuenta">${htmlExpresion(fichas, idioma)}${igual}</span>`;
}

const htmlEnunciado = (item, idioma) => `<p class="enunciado">${plantillaPorId(item.plantilla)[idioma](item.numeros)}</p>`;

/** La explicación del modelo, con los números del ítem: «…: (7 + 3) · 2 = 20». */
function htmlModelo(item, api) {
  const plantilla = plantillaPorId(item.plantilla);
  const explica = plantilla.explica[api.idioma](item.numeros);
  const modelo = cuenta(aFichas(item.modelo), evaluar(item.modelo), api.idioma);
  // Si la explicación acaba en dos puntos, la expresión la remata; si no, va en su frase.
  return explica.endsWith(':') ? `${explica} ${modelo}.` : `${explica} ${api.tt(TX.la_expresion_es)} ${modelo}.`;
}

// ─── Montar la expresión con fichas ────────────────────────────────────────────

function montarExpresion(contenedor, item, api) {
  const { tt, idioma } = api;
  // Tras responder, la base vuelve a montar el ítem en el otro idioma: solo el enunciado.
  if (api.respondido()) { contenedor.innerHTML = htmlEnunciado(item, idioma); return; }

  const conPotencias = plantillaPorId(item.plantilla).ej === 3;
  const teclas = [
    item.opciones.map(n => ({ ficha: n, clase: 'tecla--numero' })),
    OPERADORES.map(ficha => ({ ficha })),
    ['(', ')', ...(conPotencias ? ['²', '√'] : [])].map(ficha => ({ ficha })),
  ];
  const fila = (lista, extra = '') => `<div class="teclado__fila">${lista.map(({ ficha, clase = '' }) =>
    `<button type="button" class="tecla ${clase}" data-ficha="${ficha}">${rotulo(ficha)}</button>`).join('')}${extra}</div>`;
  const rotulo = ficha => (ficha === '²' ? '□<sup>2</sup>' : simbolo(ficha, idioma));

  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.instruccion_montar)}</p>
    ${htmlEnunciado(item, idioma)}
    <div class="linea" role="group" aria-label="${tt(TX.linea_nombre)}"></div>
    <p class="aviso-linea" role="status" hidden></p>
    <div class="teclado">
      ${fila(teclas[0])}
      ${fila(teclas[1])}
      ${fila(teclas[2], `<button type="button" class="tecla tecla--quitar" aria-label="${tt(TX.quitar_ultima)}">⌫</button>`)}
    </div>
    <div class="acciones">
      <button type="button" class="secundario" data-accion="borrar">${api.t.borrar}</button>
      <button type="button" data-accion="comprobar">${api.t.comprobar}</button>
    </div>`;
  const linea = contenedor.querySelector('.linea');
  const aviso = contenedor.querySelector('.aviso-linea');
  const fichas = [];
  let bloqueado = false;

  const avisar = clave => {
    aviso.hidden = !clave;
    aviso.textContent = clave ? `${tt(TX.malformada[clave])}${clave === 'llena' ? '' : ` ${tt(TX.no_cuenta)}`}` : '';
  };
  const pintar = () => {
    linea.innerHTML = fichas.length
      ? fichas.map((f, i) => `<button type="button" class="pieza${typeof f === 'number' ? ' pieza--numero' : ''}${f === '²' ? ' pieza--cuadrado' : ''}" data-i="${i}" aria-label="${tt(TX.quitar)} ${simbolo(f, idioma)}"${bloqueado ? ' disabled' : ''}>${f === '²' ? '<sup>2</sup>' : simbolo(f, idioma)}</button>`).join('')
      : `<span class="linea__vacia">${tt(TX.linea_vacia)}</span>`;
  };
  pintar();

  contenedor.querySelector('.teclado').addEventListener('click', ev => {
    const tecla = ev.target.closest('.tecla');
    if (!tecla || bloqueado) return;
    avisar(null);
    if (tecla.classList.contains('tecla--quitar')) fichas.pop();
    else if (fichas.length >= MAX_FICHAS) avisar('llena');
    else fichas.push(tecla.classList.contains('tecla--numero') ? Number(tecla.dataset.ficha) : tecla.dataset.ficha);
    pintar();
  });
  // Tocar una ficha ya colocada la quita.
  linea.addEventListener('click', ev => {
    const pieza = ev.target.closest('.pieza');
    if (!pieza || bloqueado) return;
    avisar(null);
    fichas.splice(Number(pieza.dataset.i), 1);
    pintar();
  });
  contenedor.querySelector('[data-accion="borrar"]').addEventListener('click', () => {
    if (bloqueado) return;
    avisar(null);
    fichas.length = 0;
    pintar();
  });

  contenedor.querySelector('[data-accion="comprobar"]').addEventListener('click', () => {
    if (bloqueado || api.respondido()) return;
    const r = corregir(item, fichas);
    // Mal escrita: se avisa y se deja arreglar; no es un fallo.
    if (r.estado === 'malformada') return avisar(r.error);
    bloqueado = true;
    pintar();
    linea.classList.add(r.estado === 'bien' ? 'linea--bien' : 'linea--mal');
    contenedor.querySelector('.teclado').hidden = true;
    contenedor.querySelector('.acciones').hidden = true;

    if (r.estado === 'bien') {
      const sobraba = r.quitados
        ? ` ${tt(TX.sobraba)(r.quitados)} <span class="cuenta">${htmlExpresion(aFichas(r.limpia), idioma)}</span>.` : '';
      return api.responder({
        acierto: true,
        html: `${cuenta(fichas, r.valor, idioma)}.${sobraba} ${plantillaPorId(item.plantilla).explica[idioma](item.numeros).replace(/:$/, '.')}`,
        espera: r.quitados ? 4200 : 2600,
      });
    }
    const pegas = [
      r.faltan.length ? tt(TX.faltan)(r.faltan) : '',
      r.tipo ? tt(TX.error[r.tipo]) : '',
      r.casualidad ? tt(TX.casualidad) : '',
    ].filter(Boolean).join(' ');
    api.responder({
      acierto: false,
      html: `${tt(TX.has_escrito)} ${cuenta(fichas, r.valor, idioma)}. ${pegas} ${htmlModelo(item, api)}`,
    });
  });
}

// ─── Elegir entre el modelo y su gemela ────────────────────────────────────────

function montarEleccion(contenedor, item, api) {
  const { tt, idioma } = api;
  if (api.respondido()) { contenedor.innerHTML = htmlEnunciado(item, idioma); return; }
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.instruccion_elegir)}</p>
    ${htmlEnunciado(item, idioma)}`;
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map((arbol, valor) => ({ valor, html: htmlExpresion(aFichas(arbol), idioma) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      if (valor === item.solucion) return api.responder({ acierto: true, html: htmlModelo(item, api), espera: 2600 });
      const gemela = item.opciones[valor];
      const tipo = erroresDe(plantillaPorId(item.plantilla), item.numeros)[0].tipo;
      api.responder({
        acierto: false,
        html: `${tt(TX.has_elegido)} ${cuenta(aFichas(gemela), evaluar(gemela), idioma)}. ${tt(TX.error[tipo])} ${htmlModelo(item, api)}`,
      });
    },
  });
  botones.elemento.classList.add('expresiones');
}

const montar = (contenedor, item, api) => (item.tipo === 'elegir' ? montarEleccion : montarExpresion)(contenedor, item, api);

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'expresion',
  ejercicios: [
    { ...TX.sin, generar: generarSin, clave: claveItem, montar },
    { ...TX.con, generar: generarCon, clave: claveItem, montar },
    { ...TX.potencias, generar: generarPotencias, clave: claveItem, montar },
  ],
});
