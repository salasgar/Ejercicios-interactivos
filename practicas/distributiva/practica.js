// Práctica «Distributiva con rectángulos» (repaso de la unidad 1). Contrato de
// la base: ver ../plantilla/practica.js.
//
// 1. Parte el rectángulo: se arrastra el corte, se confirma y se teclea el total.
// 2. Saca factor común: dos rectángulos que se juntan (fichas) o cuatro opciones.
// 3. Compensa con 99: se teclea el resultado y se elige la escritura correcta.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarPartir, generarFactorValido, generarCompensar, corteCorrecto, cortesCorrectos, totalCorrecto, igualdad,
  juntarCorrecto, textoFichas, valorFichas, sumaDeProductos, compensarCorrecto, enunciadoCompensar, fmt,
} from './logica.js';

const MENOS = '−';
const P = '·';

// ─── Utilidades de dibujo ──────────────────────────────────────────────────────

/** Rejilla de filas por columnas celdas; `clases(columna)` da la clase de cada columna. */
function celdasHtml(filas, columnas, clases = () => '') {
  let html = '';
  for (let f = 0; f < filas; f++) for (let c = 0; c < columnas; c++) html += `<span class="dist-celda ${clases(c)}"></span>`;
  return html;
}

// Campo de texto (no `type="number"`): admite «1.188», «1,188» o «1 188» y se lee con leerEntero.
function campoNumero(id) {
  return `<input type="text" inputmode="numeric" id="${id}" class="dist-entero" autocomplete="off">`;
}

/** Una igualdad en cadena: cada tramo en su `.cuenta` y el «=» fuera, para que la línea pueda partirse en el móvil. */
function cadenaHtml(texto) {
  return texto.split(' = ').map(t => `<span class="cuenta">${t}</span>`).join(' = ');
}

// ─── Ejercicio 1: parte el rectángulo ──────────────────────────────────────────

function montarPartir(contenedor, item, api) {
  const { tt } = api;
  const x = TX.partir;
  const { a, b, c, resta, largo, corte } = item;
  const pregunta = resta ? x.pregunta_resta : x.pregunta_suma;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(pregunta)(a, b, c)}</p>
    <div class="dist-rect" id="rect" style="--columnas:${largo};--filas:${a}">
      <div class="dist-etiquetas" id="etiquetas"></div>
      <div class="dist-cuadricula" id="cuadricula">${celdasHtml(a, largo)}<span class="dist-cursor" id="cursor"></span></div>
    </div>
    <div class="dist-mando" id="mando">
      <button type="button" class="dist-flecha" id="izq" aria-label="${tt(x.izquierda)}">◀</button>
      <button type="button" class="comprobar dist-cortar" id="cortar">${tt(x.cortar)}</button>
      <button type="button" class="dist-flecha" id="der" aria-label="${tt(x.derecha)}">▶</button>
    </div>
    <div id="paso2"></div>`;
  const rect = contenedor.querySelector('#rect');
  const cuadricula = contenedor.querySelector('#cuadricula');
  const cursor = contenedor.querySelector('#cursor');
  const etiquetas = contenedor.querySelector('#etiquetas');
  const mando = contenedor.querySelector('#mando');
  const celdas = [...cuadricula.querySelectorAll('.dist-celda')];

  // El cursor empieza en un sitio que no es ya el buen corte (si hay donde elegir).
  const buenos = cortesCorrectos(item);
  let pos = [1, largo - 1, 2].find(p => !buenos.includes(p)) ?? 1;
  let cortado = false;
  const ponerEtiquetaEntera = () => {
    etiquetas.innerHTML = `<span class="dist-etiqueta" style="flex:1">${resta ? b : `${b} + ${c}`}</span>`;
  };
  const pintarCursor = () => { cursor.style.left = `${(pos / largo) * 100}%`; };
  const pintarPartes = (p) => {
    celdas.forEach((el, i) => {
      const col = i % largo;
      el.classList.toggle('dist-izq', col < p);
      el.classList.toggle('dist-der', col >= p && !resta);
      el.classList.toggle('dist-quitada', col >= p && resta);
    });
  };
  const mover = nueva => {
    if (cortado) return;
    pos = Math.max(1, Math.min(largo - 1, nueva));
    pintarCursor();
  };
  const desdeX = clientX => {
    const r = cuadricula.getBoundingClientRect();
    return Math.round(((clientX - r.left) / r.width) * largo);
  };
  ponerEtiquetaEntera();
  pintarCursor();

  cuadricula.addEventListener('pointerdown', ev => {
    if (cortado || api.respondido()) return;
    cuadricula.setPointerCapture?.(ev.pointerId);
    cuadricula.dataset.arrastrando = '1';
    mover(desdeX(ev.clientX));
  });
  cuadricula.addEventListener('pointermove', ev => { if (cuadricula.dataset.arrastrando) mover(desdeX(ev.clientX)); });
  const soltar = () => { delete cuadricula.dataset.arrastrando; };
  cuadricula.addEventListener('pointerup', soltar);
  cuadricula.addEventListener('pointercancel', soltar);
  contenedor.querySelector('#izq').addEventListener('click', () => mover(pos - 1));
  contenedor.querySelector('#der').addEventListener('click', () => mover(pos + 1));

  function mostrarCorte(p) {
    cortado = true;
    pos = p;
    pintarCursor();
    pintarPartes(p);
    mando.hidden = true;
    // Con la suma vale cortar por b o por c: la izquierda es la parte que tiene p celdas.
    const alReves = !resta && p !== corte;
    const izq = resta ? `${b} ${MENOS} ${c}` : `${alReves ? c : b}`;
    const der = resta ? `${c}` : `${alReves ? b : c}`;
    etiquetas.innerHTML = `
      <span class="dist-etiqueta dist-etiqueta--izq" style="flex:${p}">${izq}</span>
      <span class="dist-etiqueta ${resta ? 'dist-etiqueta--quitada' : 'dist-etiqueta--der'}" style="flex:${largo - p}">${der}</span>`;
  }

  contenedor.querySelector('#cortar').addEventListener('click', () => {
    if (api.respondido() || cortado) return;
    if (!corteCorrecto(item, pos)) {
      mostrarCorte(corte);
      const razon = resta ? tt(x.corte_mal_resta)(b, c, b - c) : tt(x.corte_mal_suma)(b, c);
      return api.responder({ acierto: false, html: `${razon} ${cadenaHtml(igualdad(item))}`, espera: 3200 });
    }
    mostrarCorte(pos);
    const paso2 = contenedor.querySelector('#paso2');
    const otroOrden = !resta && pos !== corte ? `<p class="frase">${tt(x.otro_orden)(b, c)}</p>` : '';
    paso2.innerHTML = `
      ${otroOrden}
      <p class="frase">${cadenaHtml(igualdad(item).split(' = ').slice(0, 3).join(' = '))}</p>
      <label class="instruccion" for="total">${tt(x.total_label)}</label>
      ${campoNumero('total')}
      <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
    const campo = paso2.querySelector('#total');
    const boton = paso2.querySelector('#comprobar');
    campo.focus();
    const comprobar = () => {
      if (api.respondido() || campo.value === '') return;
      const acierto = totalCorrecto(item, campo.value);
      campo.disabled = true;
      boton.hidden = true;
      const completa = cadenaHtml(igualdad(item));
      api.responder({ acierto, html: acierto ? `${completa}.` : `${tt(x.total_mal)(item.solucion)} ${completa}`, espera: 2400 });
    };
    boton.addEventListener('click', comprobar);
    campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); });
  });
}

// ─── Ejercicio 2: junta y saca factor común ────────────────────────────────────

function dibujoDosRectangulos(item, junto) {
  const { a, b, c } = item;
  return `
    <div class="dist-dos${junto ? ' dist-dos--junto' : ''}" id="dos" style="--filas:${a}">
      <div class="dist-bloque dist-izq" style="flex:${b};--columnas:${b}">${celdasHtml(a, b, () => 'dist-izq')}</div>
      <div class="dist-bloque ${item.resta ? 'dist-quitada' : 'dist-der'}" style="flex:${c};--columnas:${c}">${celdasHtml(a, c, () => (item.resta ? 'dist-quitada' : 'dist-der'))}</div>
    </div>
    <div class="dist-etiquetas">
      <span class="dist-etiqueta dist-etiqueta--izq" style="flex:${b}">${a} ${P} ${b}</span>
      <span class="dist-etiqueta ${item.resta ? 'dist-etiqueta--quitada' : 'dist-etiqueta--der'}" style="flex:${c}">${a} ${P} ${c}</span>
    </div>`;
}

function montarFactor(contenedor, item, api) {
  if (item.tipo === 'juntar') return montarJuntar(contenedor, item, api);
  return montarElegirFactor(contenedor, item, api);
}

function montarJuntar(contenedor, item, api) {
  const { tt } = api;
  const x = TX.factor;
  const valores = { a: item.a, b: item.b, c: item.c };
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.pregunta_juntar)(sumaDeProductos(item))}</p>
    ${dibujoDosRectangulos(item, false)}
    <div class="dist-linea" id="linea"><span class="dist-vacio">${tt(x.vacio)}</span></div>
    <div class="botones-numeros" id="fichas">
      ${item.fichas.map((f, i) => `<button type="button" data-i="${i}" data-ficha="${f}">${valores[f] ?? f}</button>`).join('')}
    </div>
    <div class="dist-mando">
      <button type="button" class="dist-borrar" id="borrar">${tt(x.borrar)}</button>
      <button type="button" class="comprobar dist-cortar" id="comprobar">${api.t.comprobar}</button>
    </div>`;
  const linea = contenedor.querySelector('#linea');
  const botones = [...contenedor.querySelectorAll('#fichas button')];
  const puestas = []; // índices de botón, en orden
  const pintar = () => {
    const fichas = puestas.map(i => botones[i].dataset.ficha);
    linea.innerHTML = fichas.length ? `<span class="cuenta">${textoFichas(item, fichas)}</span>` : `<span class="dist-vacio">${tt(x.vacio)}</span>`;
    botones.forEach((b, i) => { b.disabled = puestas.includes(i) || api.respondido(); });
  };
  botones.forEach((b, i) => b.addEventListener('click', () => {
    if (api.respondido() || puestas.includes(i)) return;
    puestas.push(i);
    pintar();
  }));
  contenedor.querySelector('#borrar').addEventListener('click', () => {
    if (api.respondido()) return;
    puestas.pop();
    pintar();
  });
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido() || !puestas.length) return;
    const fichas = puestas.map(i => botones[i].dataset.ficha);
    const acierto = juntarCorrecto(item, fichas);
    botones.forEach(b => { b.disabled = true; });
    contenedor.querySelector('#borrar').disabled = true;
    ev.target.hidden = true;
    if (acierto) contenedor.querySelector('#dos').classList.add('dist-dos--junto');
    const buena = cadenaHtml(igualdad(item).split(' = ').slice(0, 2).reverse().join(' = '));
    const completa = cadenaHtml(igualdad(item));
    // Lo que escribió: cuánto vale, o que no es una cuenta completa (regla 8: el fallo habla de sus números).
    const escrito = textoFichas(item, fichas);
    const v = valorFichas(item, fichas);
    // Nada de negativos (aún no se han dado): si no es un natural, solo se dice que no coincide.
    const suyo = v === null ? tt(x.incompleta)(escrito)
      : v < 0 ? tt(x.no_coincide)(escrito)
      : tt(v === item.valor ? x.mismo_valor : x.tu_valor)(escrito, fmt(v, api.idioma));
    api.responder({
      acierto,
      html: acierto ? `${completa}.` : `${suyo} ${tt(x.correcta)} ${buena}. ${completa}.`,
      espera: 2600,
    });
  });
  pintar();
}

function montarElegirFactor(contenedor, item, api) {
  const { tt } = api;
  const x = TX.factor;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.pregunta_elegir)(`<span class="cuenta">${sumaDeProductos(item)}</span>`)}</p>
    <div class="operacion">${sumaDeProductos(item)}</div>`;
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map((o, i) => ({ valor: i, html: o.expr })),
    alElegir(i) {
      if (api.respondido()) return;
      const buena = item.opciones.findIndex(o => o.correcta);
      botones.marcar([buena], i);
      const elegida = item.opciones[i];
      const completa = cadenaHtml(igualdad(item));
      if (i === buena) return api.responder({ acierto: true, html: `${completa}.`, espera: 2400 });
      api.responder({
        acierto: false,
        html: `${tt(x.no_igual)(elegida.expr, fmt(elegida.valor, api.idioma), fmt(item.valor, api.idioma))} ${tt(x.correcta)} <span class="cuenta">${item.opciones[buena].expr}</span>. ${completa}.`,
        espera: 3200,
      });
    },
  });
}

// ─── Ejercicio 3: compensación con 99 y 98 ─────────────────────────────────────

function dibujoCompensar(item, api) {
  const { tt } = api;
  const x = TX.compensar;
  const { n, k, falta } = item;
  return `
    <div class="dist-comp">
      <div class="dist-comp__filas">${tt(x.dibujo_filas)(n)}</div>
      <div class="dist-comp__cuerpo">
        <div class="dist-comp__grande"><span>${tt(x.dibujo_100)(k)}</span></div>
        <div class="dist-comp__falta"><span>${falta}</span></div>
      </div>
      <div class="dist-comp__pie">${tt(x.dibujo_resta)(falta, n)}</div>
    </div>`;
}

function montarCompensar(contenedor, item, api) {
  const { tt } = api;
  const x = TX.compensar;
  const texto = enunciadoCompensar(item);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.pregunta)(texto)}</p>
    <div class="operacion">${texto}</div>
    ${item.tipo === 'producto' ? dibujoCompensar(item, api) : ''}
    <div id="paso1">
      <label class="instruccion" for="resultado">${tt(x.label)}</label>
      ${campoNumero('resultado')}
      <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>
    </div>
    <div id="paso2"></div>`;
  const explicacion = item.tipo === 'producto'
    ? tt(x.explicacion_producto)(item.n, item.k, item.falta, item.valor)
    : tt(x.explicacion_suma)(item.n, item.k, item.falta, item.valor);
  const campo = contenedor.querySelector('#resultado');
  const boton = contenedor.querySelector('#comprobar');

  function comprobar() {
    if (api.respondido() || campo.value === '') return;
    campo.disabled = true;
    boton.hidden = true;
    if (!compensarCorrecto(item, campo.value)) {
      return api.responder({ acierto: false, html: `<span class="cuenta">${texto} = ${fmt(item.valor, api.idioma)}</span>. ${explicacion}`, espera: 3600 });
    }
    contenedor.querySelector('#paso2').innerHTML = `<p class="instruccion">${tt(x.elige)}</p>`;
    const botones = elecciones(contenedor.querySelector('#paso2'), {
      clase: 'dist-escrituras',
      opciones: item.opciones.map((o, i) => ({ valor: i, html: o.expr })),
      alElegir(i) {
        if (api.respondido()) return;
        const buena = item.opciones.findIndex(o => o.correcta);
        botones.marcar([buena], i);
        if (i === buena) return api.responder({ acierto: true, html: explicacion, espera: 2800 });
        const mala = item.opciones[i];
        api.responder({
          acierto: false,
          html: `${tt(x.escritura_mal)(mala.expr, mala.valor, item.valor)} ${explicacion}`,
          espera: 3600,
        });
      },
    });
  }
  boton.addEventListener('click', comprobar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'distributiva',
  ejercicios: [
    {
      nombre: TX.partir.nombre,
      detalle: TX.partir.detalle,
      introduccion: TX.partir.introduccion,
      generar: generarPartir,
      montar: montarPartir,
    },
    {
      nombre: TX.factor.nombre,
      detalle: TX.factor.detalle,
      introduccion: TX.factor.introduccion,
      generar: generarFactorValido,
      clave: item => `${item.tipo}${item.a}${item.b}${item.c}${item.resta}`,
      montar: montarFactor,
    },
    {
      nombre: TX.compensar.nombre,
      detalle: TX.compensar.detalle,
      introduccion: TX.compensar.introduccion,
      generar: generarCompensar,
      clave: item => `${item.tipo}${item.n}${item.k}`,
      montar: montarCompensar,
    },
  ],
});
