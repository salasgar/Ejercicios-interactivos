// Práctica «Productos y potencias con signo» (PU2, tarea 86): la interfaz (los
// `montar`) y la llamada a `arrancar`. La lógica está en `logica.js`, puro y
// probado en `tests/practicas-potencias-enteros.test.js`.

import { arrancar } from '../_comun/base.js';
import { claseCorreccion } from '../_comun/piezas.js';
import { fmt, fmtPar, html as htmlEntero, campoEntero } from '../_comun/enteros.js';
import {
  generarProducto, producto, posicionesNegativas, expresionProducto, absolutosProducto, errorProducto,
  generarPotencia, valorPotencia, textoPotencia, errorPotencia,
  generarBase, textoBase, valorBase, rutaBase, baseDeItem, errorBase,
  generarRaiz, buenasCuadrados, cuadrado, errorCuadrados, errorRaiz, esAciertoRaiz,
} from './logica.js';
import { TX } from './textos.js';

const cuenta = texto => `<span class="cuenta">${texto}</span>`;
const mismos = (a, b) => a.length === b.length && a.every(x => b.includes(x));

/** Botones de elegir (uno o varios) que se encienden con aria-pressed, en la caja `.botones-numeros`. */
function interruptores(caja, textos, { varios = false, alCambiar = () => {} } = {}) {
  const elegidos = new Set();
  const botones = textos.map((texto, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = texto;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (b.disabled) return;
      if (elegidos.has(i)) elegidos.delete(i);
      else {
        if (!varios) { elegidos.clear(); botones.forEach(x => x.setAttribute('aria-pressed', 'false')); }
        elegidos.add(i);
      }
      b.setAttribute('aria-pressed', String(elegidos.has(i)));
      alCambiar([...elegidos].sort((x, y) => x - y));
    });
    caja.append(b);
    return b;
  });
  return {
    botones,
    elegidos: () => [...elegidos].sort((x, y) => x - y),
    /** Bloquea y pinta los cuatro estados: `esBueno(i)` dice cuáles eran correctos. */
    corregir(esBueno) {
      botones.forEach((b, i) => {
        b.disabled = true;
        const c = claseCorreccion(elegidos.has(i), esBueno(i));
        if (c) b.classList.add(c);
      });
    },
  };
}

/** Crea el campo para escribir un entero con el «Comprobar» de la caja. */
function campoConComprobar(contenedor, nombre, alEnviar) {
  const boton = contenedor.querySelector('.comprobar');
  const campo = campoEntero(contenedor.querySelector('.campo'), { nombre, boton, alEnviar: v => alEnviar(v) });
  boton.addEventListener('click', () => alEnviar(campo.valor()));
  return { campo, boton };
}

// ─── Ejercicio 1: cuenta los negativos ────────────────────────────────────────────

const enunciadoProducto = (item, { tt }) => `
  <p class="instruccion">${tt(TX.ej1.toca)}</p>
  <div class="operacion">${expresionProducto(item)}</div>`;

function explicarProducto(item, tocados, valor, { tt }) {
  const x = TX.ej1;
  const p = producto(item);
  const buenos = posicionesNegativas(item);
  const k = buenos.length;
  const par = k % 2 === 0;
  const partes = [];
  if (valor !== p) partes.push(`${tt(x.tu_valor)} ${cuenta(fmt(valor))}.`);
  if (!mismos(tocados, buenos)) partes.push(`${tt(x.tu_conteo)(tocados.length, k)}.`);
  if (item.factores.includes(0)) partes.push(`${tt(x.cero)}.`);
  else partes.push(`${tt(x.hay)(k, par)}, ${tt(x.asi_que)(par)}: ${cuenta(`${absolutosProducto(item)} = ${Math.abs(p)}`)}.`);
  partes.push(cuenta(`${expresionProducto(item)} = ${fmt(p)}`) + '.');
  return partes.join(' ');
}

function montarProducto(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.ej1.toca)}</p>
    <div class="botones-numeros producto" id="factores" role="group"></div>
    <p class="estado" id="marcados" aria-live="polite"></p>
    <p class="instruccion">${tt(TX.ej1.escribe)}</p>
    <div class="campo"></div>
    <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#factores');
  const marcados = contenedor.querySelector('#marcados');
  // Los puntos «·» entre los factores no son botones: se intercalan a mano.
  const grupo = interruptores(document.createElement('div'), item.factores.map(fmtPar), {
    varios: true,
    alCambiar: tocados => { marcados.textContent = tt(TX.ej1.marcados)(tocados.length); },
  });
  grupo.botones.forEach((b, i) => {
    if (i > 0) { const punto = document.createElement('span'); punto.className = 'punto'; punto.textContent = '·'; caja.append(punto); }
    caja.append(b);
  });
  marcados.textContent = tt(TX.ej1.marcados)(0);

  const { campo, boton } = campoConComprobar(contenedor, tt(TX.ej1.resultado), comprobar);
  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    const tocados = grupo.elegidos();
    const buenos = posicionesNegativas(item);
    campo.bloquear();
    boton.hidden = true;
    grupo.corregir(i => buenos.includes(i));
    const acierto = valor === producto(item) && mismos(tocados, buenos);
    api.responder({
      acierto,
      html: textos2 => explicarProducto(item, tocados, valor, textos2),
      espera: 2200,
      ...(acierto ? {} : { error: errorProducto(item, tocados, valor), respuesta: `${tocados.length} / ${fmt(valor)}` }),
    });
  }
}

// ─── Ejercicio 2: potencia de base negativa ───────────────────────────────────────

const enunciadoPotencia = (item, { tt }) => `
  <p class="instruccion">${tt(TX.ej2.signo)}</p>
  <div class="operacion">${htmlEntero(textoPotencia(item.base, item.exp))}</div>`;

function explicarPotencia(item, signoElegido, valor, { tt }) {
  const x = TX.ej2;
  const v = valorPotencia(item);
  const positivo = item.exp % 2 === 0;
  const factores = Array(item.exp).fill(fmtPar(item.base)).join(' · ');
  const partes = [];
  if (valor !== v) partes.push(`${tt(x.tu_valor)} ${cuenta(fmt(valor))}.`);
  partes.push(`${tt(x.par)(item.exp, positivo)}.`);
  partes.push(cuenta(`${htmlEntero(textoPotencia(item.base, item.exp))} = ${factores} = ${fmt(v)}`) + '.');
  return partes.join(' ');
}

function montarPotencia(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoPotencia(item, api)}
    <div class="botones-numeros" id="signo" role="group"></div>
    <div id="paso2" hidden>
      <p class="instruccion">${tt(TX.ej2.valor)}</p>
      <div class="campo"></div>
      <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>
    </div>`;
  const positivo = item.exp % 2 === 0;
  const signo = interruptores(contenedor.querySelector('#signo'),
    [`${tt(TX.ej2.positivo)} (+)`, `${tt(TX.ej2.negativo)} (−)`], {
      alCambiar: () => { contenedor.querySelector('#paso2').hidden = false; },
    });
  const { campo, boton } = campoConComprobar(contenedor, tt(TX.ej2.campo), comprobar);
  function comprobar(valor) {
    if (api.respondido() || valor === null || !signo.elegidos().length) return;
    const elegido = signo.elegidos()[0] === 0;       // true = positivo
    campo.bloquear();
    boton.hidden = true;
    signo.corregir(i => (i === 0) === positivo);
    const acierto = valor === valorPotencia(item) && elegido === positivo;
    api.responder({
      acierto,
      html: textos2 => explicarPotencia(item, elegido, valor, textos2),
      espera: 2200,
      ...(acierto ? {} : { error: errorPotencia(item, valor), respuesta: `${elegido ? '+' : '−'} / ${fmt(valor)}` }),
    });
  }
}

// ─── Ejercicio 3: ¿cuál es la base? ───────────────────────────────────────────────

const enunciadoBase = (item, { tt }) => `
  <p class="instruccion">${tt(TX.ej3.pregunta)}</p>
  <div class="operacion">${htmlEntero(textoBase(item))}</div>`;

function explicarBase(item, baseElegida, valor, { tt }) {
  const x = TX.ej3;
  const v = valorBase(item);
  const b = baseDeItem(item);
  const partes = [];
  if (valor !== v) partes.push(`${tt(x.tu_valor)} ${cuenta(fmt(valor))}.`);
  partes.push(`${tt(x.base_es)(cuenta(fmt(b)))}.`);
  const potencia = `${fmtPar(b)}<sup>${item.exp}</sup>`;
  const veces = Array(item.exp).fill(fmtPar(b)).join(' · ');
  const pot = b ** item.exp;
  if (item.tipo === 'a') partes.push(cuenta(`${potencia} = ${veces} = ${fmt(pot)}`) + '.');
  else {
    partes.push(`${tt(item.tipo === 'b' ? x.fuera : x.dentro)}.`);
    partes.push(cuenta(`${htmlEntero(textoBase(item), { envolver: { [rutaBase(item)]: 'base-resaltada' } })} = ${fmt(v)}`) + '.');
  }
  return partes.join(' ');
}

function montarBase(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoBase(item, api)}
    <div class="botones-numeros" id="base" role="group"></div>
    <div id="paso2" hidden>
      <p class="instruccion">${tt(TX.ej3.valor)}</p>
      <div class="campo"></div>
      <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>
    </div>`;
  const buena = baseDeItem(item);
  const opciones = [-item.a, item.a];
  const base = interruptores(contenedor.querySelector('#base'), opciones.map(fmt), {
    alCambiar: () => { contenedor.querySelector('#paso2').hidden = false; },
  });
  const { campo, boton } = campoConComprobar(contenedor, tt(TX.ej3.campo), comprobar);
  function comprobar(valor) {
    if (api.respondido() || valor === null || !base.elegidos().length) return;
    const elegida = opciones[base.elegidos()[0]];
    campo.bloquear();
    boton.hidden = true;
    base.corregir(i => opciones[i] === buena);
    // La base se resalta en la expresión, ahora que ya no da la respuesta.
    contenedor.querySelector('.operacion').innerHTML = htmlEntero(textoBase(item), { envolver: { [rutaBase(item)]: 'base-resaltada' } });
    const acierto = valor === valorBase(item) && elegida === buena;
    api.responder({
      acierto,
      html: textos2 => explicarBase(item, elegida, valor, textos2),
      espera: 2400,
      ...(acierto ? {} : {
        error: elegida !== buena ? 'base-equivocada' : errorBase(item, valor),
        respuesta: `${fmt(elegida)} / ${fmt(valor)}`,
      }),
    });
  }
}

// ─── Ejercicio 4: cuadrados y raíces ──────────────────────────────────────────────

const operacionRaiz = item => (item.tipo === 'negativa'
  ? `√(${fmt(-cuadrado(item))}) = □`
  : `√${cuadrado(item)} = □`);

const enunciadoRaiz = (item, { tt }) => (item.tipo === 'cuadrados'
  ? `<p class="instruccion">${tt(TX.ej4.cuadrados)(cuadrado(item))}</p><div class="operacion">□<sup>2</sup> = ${cuadrado(item)}</div>`
  : `<p class="instruccion">${tt(TX.ej4.raiz)}</p><div class="operacion">${operacionRaiz(item)}</div>`);

function explicarCuadrados(item, elegidas, { tt }) {
  const x = TX.ej4;
  const n = cuadrado(item);
  const partes = [];
  for (const v of elegidas) {
    if (v * v !== n) partes.push(`${tt(x.no_sirve)(fmt(v), cuenta(`${fmtPar(v)}<sup>2</sup> = ${v * v}`), n)}.`);
  }
  if (!elegidas.some(v => v * v === n) || elegidas.filter(v => v * v === n).length === 1) {
    const buenoElegido = elegidas.find(v => v * v === n);
    if (buenoElegido !== undefined) partes.push(`${tt(x.solo_uno)(item.r, buenoElegido)}.`);
  }
  partes.push(`${tt(x.los_dos)(item.r)}: ${cuenta(`${item.r} · ${item.r} = ${n}`)} ${tt({ es: 'y', en: 'and' })} ${cuenta(`(−${item.r}) · (−${item.r}) = ${n}`)}.`);
  return partes.join(' ');
}

function explicarRaiz(item, valor, { tt }) {
  const x = TX.ej4;
  const n = cuadrado(item);
  if (item.tipo === 'negativa') return `${tt(x.negativa_no_existe)(n)}. ${tt(x.negativa_ejemplo)(item.r)}.`;
  const partes = [];
  if (valor === 'no-existe') partes.push(`${tt(x.raiz_no_existe)(item.r)}.`);
  else if (valor === -item.r) partes.push(`${tt(x.raiz_negativa)(item.r)}.`);
  else if (valor !== item.r) partes.push(`${tt(TX.ej4.tu_valor)} ${cuenta(fmt(valor))}.`);
  partes.push(`${tt(x.raiz_buena)(item.r, n)}: ${cuenta(`${item.r} · ${item.r} = ${n}`)}.`);
  return partes.join(' ');
}

function montarRaiz(contenedor, item, api) {
  const { tt } = api;
  if (item.tipo === 'cuadrados') return montarCuadrados(contenedor, item, api);
  contenedor.innerHTML = `
    ${enunciadoRaiz(item, api)}
    <div class="campo"></div>
    <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>
    <button type="button" class="secundario no-existe">${tt(TX.ej4.no_existe)}</button>`;
  const noExiste = contenedor.querySelector('.no-existe');
  const { campo, boton } = campoConComprobar(contenedor, tt(TX.ej4.campo), v => cerrar(v));
  noExiste.addEventListener('click', () => cerrar('no-existe'));
  function cerrar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    noExiste.disabled = true;
    const acierto = esAciertoRaiz(item, valor);
    api.responder({
      acierto,
      html: textos2 => explicarRaiz(item, valor, textos2),
      espera: 2200,
      ...(acierto ? {} : { error: errorRaiz(item, valor), respuesta: valor === 'no-existe' ? 'no existe' : fmt(valor) }),
    });
  }
}

function montarCuadrados(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoRaiz(item, api)}
    <div class="botones-numeros" id="opciones" role="group"></div>
    <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('.comprobar');
  const grupo = interruptores(contenedor.querySelector('#opciones'), item.opciones.map(fmt), {
    varios: true,
    alCambiar: elegidos => { boton.disabled = elegidos.length === 0; },
  });
  boton.addEventListener('click', () => {
    if (api.respondido() || boton.disabled) return;
    const elegidas = grupo.elegidos().map(i => item.opciones[i]);
    const buenas = buenasCuadrados(item);
    boton.hidden = true;
    grupo.corregir(i => buenas.includes(item.opciones[i]));
    const acierto = mismos(elegidas, buenas);
    api.responder({
      acierto,
      html: textos2 => explicarCuadrados(item, elegidas, textos2),
      espera: 2200,
      ...(acierto ? {} : { error: errorCuadrados(item, elegidas), respuesta: elegidas.map(fmt).join(', ') }),
    });
  });
}

// ─── La práctica ──────────────────────────────────────────────────────────────────

arrancar({
  slug: 'potencias-enteros',
  ejercicios: [
    {
      nombre: TX.ej1.nombre,
      detalle: TX.ej1.detalle,
      introduccion: TX.ej1.introduccion,
      generar: generarProducto,
      clave: item => item.factores.join(','),
      montar: montarProducto,
      enunciado: enunciadoProducto,
    },
    {
      nombre: TX.ej2.nombre,
      detalle: TX.ej2.detalle,
      introduccion: TX.ej2.introduccion,
      generar: generarPotencia,
      clave: item => `${item.base}^${item.exp}`,
      montar: montarPotencia,
      enunciado: enunciadoPotencia,
    },
    {
      nombre: TX.ej3.nombre,
      detalle: TX.ej3.detalle,
      introduccion: TX.ej3.introduccion,
      generar: generarBase,
      clave: textoBase,
      montar: montarBase,
      enunciado: enunciadoBase,
    },
    {
      nombre: TX.ej4.nombre,
      detalle: TX.ej4.detalle,
      introduccion: TX.ej4.introduccion,
      generar: generarRaiz,
      clave: item => `${item.tipo}${item.r}`,
      montar: montarRaiz,
      enunciado: enunciadoRaiz,
    },
  ],
});
