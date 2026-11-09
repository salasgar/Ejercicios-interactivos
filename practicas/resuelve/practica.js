// Práctica «Resuelve» de la unidad 6 (Algebra): la interfaz. PU2, tarea 150. La lógica pura está en
// `logica.js`; los textos, en `textos.js`; el contrato de la base, en `../plantilla/practica.js`.
//   1. El primer paso        elegir entre cuatro líneas
//   2. Paso a paso           tres huecos (el número de la x, el del otro miembro, la solución)
//   3. Resuélvela            escribir (o elegir) el valor de x
//   4. ¿Está bien resuelta?  tocar el paso con el error, o «Todo está bien»

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { terminosAHtml, terminosATexto, termino, MENOS } from '../_comun/algebra.js';
import { aTexto as textoFraccion, fraccion } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import {
  generarPrimerPaso, generarPasoAPaso, generarResuelve, generarResolucion,
  ecDe, ecuacionAC, ecuacionSolucion, solDe, nombreDe,
  lineasPrevias, huecoMalo, errorHueco, leerSolucion, errorSolucion, movimientos, lineasDeResolucion, solucionDe,
} from './logica.js';

const cuenta = html => `<span class="cuenta">${html}</span>`;
const htmlEc = ec => ec.aHtml();
const htmlDatos = datos => htmlEc(ecDe(datos));
const htmlSol = s => htmlEc(ecuacionSolucion(s));

/** El número entre paréntesis si hace falta (negativo o fracción). */
const entreParentesis = s => (s.num < 0 || s.den !== 1 ? `(${textoFraccion(s)})` : textoFraccion(s));

/** «4 · 2 + 6»: un miembro con la x sustituida por s. */
function sustituido(terminosLista, s) {
  return terminosLista.map((t, i) => {
    const c = t.coef.simplificar();
    const abs = Math.abs(c.num);
    const cuerpo = t.letra === null ? textoFraccion(fraccion(abs, c.den))
      : (abs === 1 && c.den === 1 ? entreParentesis(s) : `${textoFraccion(fraccion(abs, c.den))} · ${entreParentesis(s)}`);
    const signo = c.num < 0 ? (i === 0 ? MENOS : ` ${MENOS} `) : (i === 0 ? '' : ' + ');
    return `${signo}${cuerpo}`;
  }).join('');
}

/** «Comprobación (x = 2): 4 · 2 + 6 = 14 y 12 + 2 = 14 ✓». */
function comprobacion(ec, s, tt) {
  const vi = ec.izq.evaluar(s), vd = ec.der.evaluar(s);
  return `${tt(TX.ej3.comprobacion)} (x = ${textoFraccion(s)}): ${cuenta(`${sustituido(ec.terminosIzq, s)} = ${textoFraccion(vi.simplificar())}`)}`
    + ` y ${cuenta(`${sustituido(ec.terminosDer, s)} = ${textoFraccion(vd.simplificar())}`)} ✓`;
}

/** La resolución completa de una ecuación: cada línea en su cuenta. */
const resolucionHtml = ec => [ec, ...ec.pasos().map(p => p.ecuacion)].map(e => cuenta(htmlEc(e))).join(' → ');

// ─── Un campo de texto para un número, una fracción o «x = …» ───────────────────────────────────

function campoTexto(contenedor, { nombre, cifras = 6, sinX = false, alCambiar = () => {}, alEnviar = null }) {
  const c = document.createElement('input');
  c.type = 'text';
  c.inputMode = 'text';
  c.className = 'campo-numero campo-alg';
  c.autocomplete = 'off';
  c.spellcheck = false;
  c.setAttribute('autocapitalize', 'none');
  c.setAttribute('autocorrect', 'off');
  c.setAttribute('enterkeyhint', 'done');
  c.style.setProperty('--cifras', cifras);
  if (nombre) c.setAttribute('aria-label', nombre);
  contenedor.append(c);
  const leer = () => leerSolucion(sinX ? c.value.replace(/\s*[·*]?\s*x\s*$/i, '') : c.value);
  const valor = () => { const r = leer(); return r.ok ? r.valor : null; };
  c.addEventListener('input', () => {
    c.classList.toggle('campo-numero--malo', c.value.trim() !== '' && valor() === null);
    alCambiar(valor());
  });
  c.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    if (!c.disabled && alEnviar) alEnviar();
  });
  return { elemento: c, valor, texto: () => c.value.trim(), bloquear() { c.disabled = true; } };
}

const marca = (campo, bien) => campo.elemento.classList.add(bien ? 'campo-alg--bien' : 'campo-alg--mal');

// ─── Ejercicio 1: el primer paso ──────────────────────────────────────────────────────────────

const enunciado1 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej1.instruccion)}</p>
  <div class="operacion">${htmlDatos(item)}</div>`;

function feedback1(item, elegida, { tt }) {
  const buena = htmlDatos(item.opciones[item.buena]);
  const error = item.opciones[elegida].error;
  if (error === null) return tt(TX.ej1.bien)(buena);
  const m = movimientos(ecDe(item));
  const neg = t => terminosAHtml([termino(t.coef.opuesta(), t.letra)]);
  const x = TX.ej1.mal[error];
  if (error === 'transponer-sin-signo') return tt(x)(buena);
  if (error === 'x-sin-signo') return tt(x)(buena, terminosAHtml(m.xd.slice(0, 1)), neg(m.xd[0]));
  if (error === 'numero-sin-signo') return tt(x)(buena, terminosAHtml(m.ci.slice(0, 1)));
  return tt(x)(buena, terminosAHtml(m.ci.slice(-1)));   // pierde-un-termino
}

function montar1(contenedor, item, api) {
  contenedor.innerHTML = enunciado1(item, api);
  const botones = elecciones(contenedor, {
    clase: 'elecciones',
    opciones: item.opciones.map((o, i) => ({ valor: i, html: cuenta(htmlDatos(o)) })),
    alElegir(i) {
      if (api.respondido()) return;
      botones.marcar([item.buena], i);
      const op = item.opciones[i];
      api.responder({
        acierto: i === item.buena,
        html: textos => feedback1(item, i, textos),
        espera: 2600,
        ...(op.error ? { error: op.error, respuesta: ecDe(op).aTexto() } : {}),
      });
    },
  });
}

// ─── Ejercicio 2: paso a paso ─────────────────────────────────────────────────────────────────

const enunciado2 = (item, { tt }) => {
  const [ec, trans] = lineasPrevias(item);
  return `<p class="instruccion">${tt(TX.ej2.instruccion)}</p>
    <div class="alg-lineas">
      <div class="operacion">${htmlEc(ec)}</div>
      ${trans ? `<div class="flecha" aria-hidden="true">↓</div><div class="operacion">${htmlEc(trans)}</div>` : ''}
    </div>`;
};

/** La suma de los números de una lista de términos, tal como se escribe: «3 − 5». */
const sumaDeNumeros = ts => terminosATexto(ts.map(t => termino(t.coef, null)));

function feedback2(item, mios, { tt }) {
  const ec = ecDe(item);
  const s = solDe(item);
  const l1 = htmlEc(ecuacionAC(item.A, item.C));
  const l2 = htmlSol(s);
  const hueco = huecoMalo(item, mios);
  if (hueco === null) {
    const nota = mios.sol.mismaForma(s) ? '' : tt(TX.ej3.simplifica)(textoFraccion(s));
    return `${tt(TX.ej2.bien)(l1, l2)}${nota} ${comprobacion(ec, s, tt)}`;
  }
  const previas = lineasPrevias(item);
  const ultima = previas[previas.length - 1];
  if (hueco === 'A') return tt(TX.ej2.mal_x)(sumaDeNumeros(ultima.terminosIzq), item.A, l1);
  if (hueco === 'C') {
    if (ultima.terminosDer.length < 2) return tt(TX.ej2.copia)(l1);
    return tt(TX.ej2.mal_n)(sumaDeNumeros(ultima.terminosDer), item.C, l1);
  }
  const div = `${item.C} : ${entreParentesis(fraccion(item.A, 1))}`;
  return tt(TX.ej2.mal_sol)(l1, div, l2);
}

function montar2(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado2(item, api)}
    <div class="alg-hueco"><span id="h1"></span><span class="alg-x">x =</span><span id="h2"></span></div>
    <div class="alg-hueco"><span class="alg-x">x =</span><span id="h3"></span></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const listo = () => boton.disabled = campos.some(c => c.valor() === null);
  const comprobar = () => {
    if (api.respondido() || boton.disabled) return;
    const [cA, cC, cS] = campos;
    const mios = { A: cA.valor(), C: cC.valor(), sol: cS.valor() };
    const malo = huecoMalo(item, mios);
    campos.forEach(c => c.bloquear());
    boton.hidden = true;
    const s = solDe(item);
    marca(cA, mios.A.equals(item.A));
    marca(cC, mios.C.equals(item.C));
    marca(cS, mios.sol.equals(s));
    const respuesta = `${cA.texto()}x = ${cC.texto()}; x = ${cS.texto()}`;
    api.responder({
      acierto: malo === null,
      html: textos => feedback2(item, mios, textos),
      espera: 3200,
      ...(malo ? { error: errorHueco(item, malo, mios[malo === 'sol' ? 'sol' : malo]), respuesta } : {}),
    });
  };
  const campos = [
    campoTexto(contenedor.querySelector('#h1'), { nombre: tt(TX.ej2.suma_x), cifras: 3, sinX: true, alCambiar: listo, alEnviar: comprobar }),
    campoTexto(contenedor.querySelector('#h2'), { nombre: tt(TX.ej2.suma_n), cifras: 3, alCambiar: listo, alEnviar: comprobar }),
    campoTexto(contenedor.querySelector('#h3'), { nombre: tt(TX.ej2.solucion), cifras: 5, alCambiar: listo, alEnviar: comprobar }),
  ];
  boton.addEventListener('click', comprobar);
}

// ─── Ejercicio 3: resuélvela ──────────────────────────────────────────────────────────────────

const enunciado3 = (item, { tt }) => `<p class="instruccion">${tt(item.modo === 'elegir' ? TX.ej3.instruccion_elegir : TX.ej3.instruccion_escribir)}</p>
  <div class="operacion">${htmlDatos(item)}</div>`;

function feedback3(item, valor, error, textos) {
  const { tt } = textos;
  const ec = ecDe(item);
  const s = solDe(item);
  const res = `${tt(TX.ej3.resolucion)} ${resolucionHtml(ec)}.`;
  const comp = comprobacion(ec, s, tt);
  if (error === null) {
    const nota = valor.mismaForma(s) ? '' : tt(TX.ej3.simplifica)(textoFraccion(s));
    return `${tt(TX.ej3.bien)(res, comp)}${nota}`;
  }
  const { A, C } = ec.forma();
  const extra = {
    'transponer-sin-signo': () => tt(TX.ej3.mal[error])(),
    'pasar-factor-restando': () => tt(TX.ej3.mal[error])(textoFraccion(A), textoFraccion(C)),
    'multiplicar-en-vez-de-dividir': () => tt(TX.ej3.mal[error])(textoFraccion(A), textoFraccion(C)),
    'invertir-coeficiente': () => tt(TX.ej3.mal[error])(entreParentesis(A), textoFraccion(C)),
    'signo-al-dividir': () => tt(TX.ej3.mal[error])(entreParentesis(A), textoFraccion(C), textoFraccion(s)),
    'signo-de-la-solucion': () => tt(TX.ej3.mal[error])(textoFraccion(s)),
    'otra-respuesta': () => '',
  }[error]();
  return `${extra} ${res} ${comp}`.trim();
}

function montar3(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciado3(item, api);
  const ec = ecDe(item);
  const responder = (valor, texto) => {
    const error = errorSolucion(ec, valor);
    api.responder({
      acierto: error === null,
      html: textos => feedback3(item, valor, error, textos),
      espera: 3200,
      ...(error ? { error, respuesta: texto } : {}),
    });
  };
  if (item.modo === 'elegir') {
    const botones = elecciones(contenedor, {
      clase: 'elecciones elecciones--2',
      opciones: item.opciones.map((o, i) => ({ valor: i, html: cuenta(htmlSol(fraccion(o.num, o.den))) })),
      alElegir(i) {
        if (api.respondido()) return;
        const buena = item.opciones.findIndex(o => o.error === null);
        botones.marcar([buena], i);
        const o = item.opciones[i];
        responder(fraccion(o.num, o.den), textoFraccion(fraccion(o.num, o.den)));
      },
    });
    return;
  }
  contenedor.insertAdjacentHTML('beforeend', `<div class="alg-hueco"><span class="alg-x">x =</span><span id="h"></span></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`);
  const boton = contenedor.querySelector('#comprobar');
  const comprobar = () => {
    if (api.respondido() || boton.disabled) return;
    const valor = campo.valor();
    campo.bloquear();
    boton.hidden = true;
    marca(campo, valor.equals(solDe(item)));
    responder(valor, campo.texto());
  };
  const campo = campoTexto(contenedor.querySelector('#h'), {
    nombre: tt(TX.ej3.campo), cifras: 6, alEnviar: comprobar, alCambiar: v => { boton.disabled = v === null; },
  });
  boton.addEventListener('click', comprobar);
}

// ─── Ejercicio 4: ¿está bien resuelta? ────────────────────────────────────────────────────────

const enunciado4 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej4.instruccion)}</p>
  <div class="operacion">${htmlDatos(item.lineas[0])}</div>`;

function feedback4(item, k, textos) {
  const { tt, idioma } = textos;
  const nombre = item.error ? (nombreDe(item.error)?.[idioma] ?? '').toLowerCase() : '';
  const correcta = item.correcta ? htmlDatos(item.correcta) : '';
  if (k === item.malo) {
    if (k === 0) {
      const ec = lineasDeResolucion(item);
      return tt(TX.ej4.bien_ninguno)(comprobacion(ec[0], solucionDe(ec[0]), tt));
    }
    return tt(TX.ej4.bien_paso)(k, correcta, nombre);
  }
  const hay = item.malo ? tt(TX.ej4.hay_error)(item.malo, correcta, nombre) : tt(TX.ej4.no_hay_error);
  if (k === 0) return hay;
  return tt(TX.ej4.mal_paso_bueno)(k, hay);
}

function montar4(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciado4(item, api);
  const opciones = [1, 2, 3].map(n => ({
    valor: n,
    html: `<span class="alg-paso">${tt(TX.ej4.paso)(n)}</span> ${cuenta(htmlDatos(item.lineas[n]))}`,
  }));
  opciones.push({ valor: 0, html: tt(TX.ej4.todoBien) });
  const botones = elecciones(contenedor, {
    clase: 'elecciones',
    opciones,
    alElegir(k) {
      if (api.respondido()) return;
      botones.marcar([item.malo], k);
      const acierto = k === item.malo;
      api.responder({
        acierto,
        html: textos => feedback4(item, k, textos),
        espera: 3200,
        ...(acierto ? {} : {
          error: item.malo ? 'no-ve-el-error' : 've-error-donde-no-lo-hay',
          respuesta: k === 0 ? 'Todo bien' : `Paso ${k}`,
        }),
      });
    },
  });
}

// ─── La práctica ──────────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, montar, enunciado,
});

arrancar({
  slug: 'resuelve',
  ejercicios: [
    ejercicio(TX.ej1, generarPrimerPaso, montar1, enunciado1),
    ejercicio(TX.ej2, generarPasoAPaso, montar2, enunciado2),
    ejercicio(TX.ej3, generarResuelve, montar3, enunciado3),
    ejercicio(TX.ej4, generarResolucion, montar4, enunciado4),
  ],
});
