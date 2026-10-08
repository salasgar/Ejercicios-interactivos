// Potencias de 10 y números grandes (repaso de la unidad 1): la interfaz.
// Tres ejercicios: el deslizador de ceros, el «and» y los ceros de cada grupo, y billion.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  N_MAXIMO, agrupar, gruposDe, mostrarDeslizador, formasDe,
  generarDeslizador, esRespuestaDeslizador, generarAnd, generarCifras, esRespuestaCifras, generarBillion,
} from './logica.js';

const { pot } = TX;
const potencia = n => `10<sup>${n}</sup>`;

// ─── Ejercicio 1: el deslizador de ceros ─────────────────────────────────────

function montarDeslizador(contenedor, item, api) {
  const { tt } = api;
  const pregunta = {
    cifras: () => tt(TX.desl.cifras)(mostrarDeslizador(item.n).en),
    potencia: () => tt(TX.desl.potencia)(mostrarDeslizador(item.n).cifras),
    ceros: () => tt(TX.desl.ceros)(item.n),
  }[item.pide]();
  contenedor.innerHTML = `
    <p class="instruccion">${pregunta}</p>
    <div class="deslizador">
      <div class="operacion" id="pot"></div>
      <div class="deslizador__numero" id="num"></div>
      <div class="deslizador__ceros" id="ceros"></div>
      <div class="deslizador__nombres" id="nombres"></div>
      <input type="range" id="desl" min="0" max="${N_MAXIMO}" step="1" value="${item.inicio}" aria-label="${tt(TX.desl.etiqueta)}">
      <div class="deslizador__marcas" aria-hidden="true">${Array.from({ length: N_MAXIMO + 1 }, (_, i) => `<span>${i}</span>`).join('')}</div>
    </div>
    <button type="button" class="comprobar" id="este">${tt(TX.desl.este)}</button>`;
  const desl = contenedor.querySelector('#desl');
  const pintar = () => {
    const v = mostrarDeslizador(Number(desl.value));
    contenedor.querySelector('#pot').innerHTML = potencia(v.n);
    contenedor.querySelector('#num').textContent = v.cifras;
    contenedor.querySelector('#ceros').textContent = tt(TX.desl.ceros_dice)(v.ceros);
    contenedor.querySelector('#nombres').innerHTML =
      `<div><span class="lengua">EN</span> ${v.en}${v.enGb ? ` <span class="o">= ${v.enGb}</span>` : ''}</div>` +
      `<div><span class="lengua">ES</span> ${v.es}</div>`;
  };
  desl.addEventListener('input', pintar);
  pintar();

  contenedor.querySelector('#este').addEventListener('click', ev => {
    if (api.respondido()) return;
    const elegido = Number(desl.value);
    const acierto = esRespuestaDeslizador(item, elegido);
    desl.disabled = true;
    ev.target.hidden = true;
    const v = mostrarDeslizador(item.n);
    const buena = `<span class="cuenta">${potencia(item.n)} = ${v.cifras}</span> (${tt(TX.desl.ceros_dice)(item.n)}) = ${v.en}${v.enGb ? ` = ${v.enGb} (${tt(TX.desl.gb)})` : ''} = ${v.es}.`;
    api.responder({
      acierto,
      html: acierto ? buena : `${tt(TX.desl.tu_respuesta)(elegido)} ${buena}`,
      espera: 2200,
    });
  });
}

// ─── Ejercicio 2: el «and» y los ceros de cada grupo ─────────────────────────

function montarAnd(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.and.empareja)}</p>
    <div class="parejas" id="parejas">${item.nombres.map((nombre, i) => `
      <div class="pareja">
        <div class="pareja__nombre">${nombre}</div>
        <div class="pareja__numeros">${item.numeros.map((n, j) =>
    `<button type="button" class="pareja__boton" data-i="${i}" data-j="${j}" aria-pressed="false">${agrupar(n)}</button>`).join('')}</div>
      </div>`).join('')}
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const botones = [...contenedor.querySelectorAll('.pareja__boton')];
  const boton = (i, j) => botones.find(b => b.dataset.i === String(i) && b.dataset.j === String(j));
  const asignado = [null, null];
  const pintar = () => {
    botones.forEach(b => b.setAttribute('aria-pressed', String(asignado[Number(b.dataset.i)] === Number(b.dataset.j))));
    contenedor.querySelector('#comprobar').disabled = asignado[0] === null;
  };
  botones.forEach(b => b.addEventListener('click', () => {
    if (api.respondido()) return;
    const i = Number(b.dataset.i), j = Number(b.dataset.j);
    asignado[i] = j;
    asignado[1 - i] = 1 - j;          // son dos nombres y dos números: el otro es el que sobra
    pintar();
  }));
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido() || asignado[0] === null) return;
    const acierto = asignado.every((j, i) => j === item.solucion[i]);
    botones.forEach(b => { b.disabled = true; });
    ev.target.hidden = true;
    item.solucion.forEach((j, i) => boton(i, j).classList.add('pareja__boton--correcta'));
    if (!acierto) boton(0, asignado[0]).classList.add('pareja__boton--mal'), boton(1, asignado[1]).classList.add('pareja__boton--mal');
    // El nombre en su línea (se puede partir) y el número debajo; y por qué: dónde va el «and»
    const lineas = item.nombres.map((nombre, i) => {
      const n = item.numeros[item.solucion[i]], g = gruposDe(n);
      const razon = tt(/ thousand and /.test(nombre) ? TX.and.por_que.despues : TX.and.por_que.dentro)(g.miles, g.unidades);
      return `${nombre}<br><span class="cuenta">= ${agrupar(n)}</span><br>${razon}`;
    });
    api.responder({ acierto, html: lineas.join('<br><br>'), espera: 4200 });
  });
}

const MAX_CIFRAS = 12;

function montarCifras(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.and.escribe)(item.texto)}</p>
    <div class="operacion operacion--teclado" id="pantalla"></div>
    <div class="botones-numeros teclado" id="teclado">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<button type="button" data-d="${d}">${d}</button>`).join('')}
      <button type="button" data-d="borrar" class="teclado__borrar" aria-label="${tt(TX.and.borrar)}">⌫</button>
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  let escrito = '';
  const pantalla = contenedor.querySelector('#pantalla');
  const pintar = () => {
    pantalla.textContent = escrito ? agrupar(Number(escrito)) : '…';
    pantalla.classList.toggle('operacion--vacia', !escrito);
    contenedor.querySelector('#comprobar').disabled = !escrito;
  };
  pintar();
  contenedor.querySelector('#teclado').addEventListener('click', ev => {
    const b = ev.target.closest('button');
    if (!b || api.respondido()) return;
    if (b.dataset.d === 'borrar') escrito = escrito.slice(0, -1);
    else if (escrito.length < MAX_CIFRAS && !(escrito === '' && b.dataset.d === '0')) escrito += b.dataset.d;
    pintar();
  });
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido() || !escrito) return;
    const acierto = esRespuestaCifras(item, escrito);
    contenedor.querySelectorAll('#teclado button').forEach(b => { b.disabled = true; });
    ev.target.hidden = true;
    pantalla.classList.add(acierto ? 'operacion--bien' : 'operacion--mal');
    const g = gruposDe(item.n);
    const buena = `${item.texto}<br><span class="cuenta">= ${agrupar(item.n)}</span><br>${tt(TX.and.grupos)(g)}`;
    api.responder({
      acierto,
      html: acierto ? buena : `${tt(TX.and.tu_respuesta)(agrupar(Number(escrito)))} ${buena}<br>${tt(item.lengua === 'en' ? TX.and.pista_grupos : TX.and.pista_grupos_es)}`,
      espera: 3000,
    });
  });
}

function montarAndOCifras(contenedor, item, api) {
  (item.tipo === 'and' ? montarAnd : montarCifras)(contenedor, item, api);
}

// ─── Ejercicio 3: billion ────────────────────────────────────────────────────

/** Todas las formas de nombrar c · 10ᵉ, con los números de ese ítem. */
function descripcion(c, e, api) {
  const f = formasDe(c, e);
  let texto = `<span class="cuenta">${f.cifras} = ${pot(c, e)}</span> = ${f.en}${f.enGb ? ` = ${f.enGb}` : ''} = ${f.es}.`;
  if (e === 9) texto += ` ${api.tt(TX.billion.nota_billion)}`;
  if (e === 12) texto += ` ${api.tt(TX.billion.nota_trillion)}`;
  return texto;
}

function montarBillion(contenedor, item, api) {
  const { tt } = api;
  let pregunta, opciones, clase = '', buena;
  if (item.clase === 'potencia') {
    pregunta = tt(TX.billion.potencia)(item.nombre, item.uso);
    opciones = item.opciones.map((o, i) => ({ valor: i, html: pot(o.c, o.e) }));
  } else if (item.clase === 'nombre') {
    pregunta = tt(TX.billion.en_ingles)(agrupar(item.c * 10 ** item.e), pot(item.c, item.e));
    opciones = item.opciones.map((o, i) => ({ valor: i, html: o }));
  } else if (item.clase === 'espanol') {
    pregunta = tt(TX.billion.en_espanol)(item.nombre, item.uso);
    opciones = item.opciones.map((o, i) => ({ valor: i, html: o }));
  } else {
    pregunta = tt(TX.billion.mismo)(`${item.a.texto}${item.a.uso ? ` (${item.a.uso})` : ''}`, `${item.b.texto}${item.b.uso ? ` (${item.b.uso})` : ''}`);
    opciones = [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }];
    clase = 'si-no';
    buena = item.verdad ? 'si' : 'no';
  }
  contenedor.innerHTML = `<p class="instruccion">${pregunta}</p>`;
  const botones = elecciones(contenedor, {
    clase: clase || `elecciones elecciones--4 elecciones--palabras`,
    opciones,
    alElegir(valor) {
      if (api.respondido()) return;
      const correcta = item.clase === 'mismo' ? buena : item.solucion;
      botones.marcar([correcta], valor);
      const acierto = String(valor) === String(correcta);
      let html;
      if (item.clase === 'mismo') {
        html = `${item.a.texto}<br><span class="cuenta">= ${agrupar(item.a.valor)}</span><br>${item.b.texto}<br><span class="cuenta">= ${agrupar(item.b.valor)}</span><br>${tt(item.verdad ? TX.billion.es_igual : TX.billion.es_distinto)}.`;
        if (item.verdad) html += ` ${tt(TX.billion.nota_billion)}`;
        else if ([item.a, item.b].some(x => /trillion/.test(x.texto))) html += ` ${tt(TX.billion.nota_trillion)}`;
      } else {
        html = descripcion(item.c, item.e, api);
      }
      api.responder({ acierto, html, espera: 3200 });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────

arrancar({
  slug: 'potencias10',
  ejercicios: [
    {
      nombre: TX.desl.nombre,
      detalle: TX.desl.detalle,
      generar: generarDeslizador,
      montar: montarDeslizador,
    },
    {
      nombre: TX.and.nombre,
      detalle: TX.and.detalle,
      introduccion: TX.and.introduccion,
      generar: rng => (rng.azar() < 0.5 ? generarAnd(rng) : generarCifras(rng)),
      montar: montarAndOCifras,
    },
    {
      nombre: TX.billion.nombre,
      detalle: TX.billion.detalle,
      introduccion: TX.billion.introduccion,
      generar: generarBillion,
      montar: montarBillion,
    },
  ],
});
