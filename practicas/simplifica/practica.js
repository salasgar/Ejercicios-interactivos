// Práctica «Simplifica» (PU2, tarea 101): la interfaz (los `montar`) y la llamada a
// `arrancar`. La lógica está en `logica.js`, puro y probado en
// `tests/practicas-simplifica.test.js`.

import { arrancar } from '../_comun/base.js';
import { campoNumero, claseCorreccion } from '../_comun/piezas.js';
import { aTexto, fraccion, htmlCuenta, htmlFraccion } from '../_comun/fracciones.js';
import {
  BOTONES, generarPasos, fraccionDe, evaluarPaso, avisoNoDivide, evaluarIrreducible, avisoTodavia, explicarPasos,
  generarIrreducibles, irreduciblesDe, errorIrreducibles, explicarIrreducibles,
  generarDeUnaVez, evaluarDeUnaVez, respuestaDeUnaVez, explicarDeUnaVez,
} from './logica.js';
import { TX } from './textos.js';

// ─── Ejercicio 1: paso a paso ──────────────────────────────────────────────────
// El alumno pulsa :2, :3, :5 o :7 (divide arriba y abajo si se puede) hasta que pulsa
// «Es irreducible». Cada intento malo cuenta como fallo y se explica con los números; el
// ítem termina al pulsar «Es irreducible» cuando de verdad lo es, y es acierto sin fallos.

const enunciadoPasos = (item, { tt }) => `
    <p class="instruccion">${tt(TX.pasos.instruccion)}</p>
    <div class="operacion">${htmlFraccion(fraccionDe(item))}</div>`;

function montarPasos(contenedor, item, api) {
  const { tt } = api;
  let actual = fraccionDe(item);
  const cadena = [actual];
  let errores = 0, primerError = null, primeraRespuesta = '';
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.pasos.instruccion)}</p>
    <div class="operacion" id="cadena"></div>
    <p class="aviso-paso" id="mensaje" role="status"></p>
    <div class="botones-numeros" id="botones" role="group" aria-label="${BOTONES.map(k => `:${k}`).join(' ')}"></div>
    <div class="elecciones elecciones--1"><button type="button" class="eleccion" id="irreducible">${tt(TX.pasos.irreducible)}</button></div>`;
  const cadenaEl = contenedor.querySelector('#cadena');
  const mensajeEl = contenedor.querySelector('#mensaje');
  const cajaBotones = contenedor.querySelector('#botones');
  const botonIrreducible = contenedor.querySelector('#irreducible');

  const pintar = () => {
    cadenaEl.innerHTML = htmlCuenta(cadena.flatMap((f, i) => (i ? ['=', f] : [f])));
  };
  pintar();

  const botones = BOTONES.map(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `:${k}`;
    b.addEventListener('click', () => dividir(k));
    cajaBotones.append(b);
    return b;
  });

  function fallar(error, respuesta, mensaje) {
    errores++;
    if (!primerError) { primerError = error; primeraRespuesta = respuesta; }
    mensajeEl.innerHTML = mensaje;
  }

  function dividir(k) {
    if (api.respondido()) return;
    const paso = evaluarPaso(actual, k);
    if (paso.resultado !== 'correcto') return fallar(paso.error, `:${k}`, avisoNoDivide(actual, k, api.idioma));
    mensajeEl.textContent = '';
    actual = paso.fraccion;
    cadena.push(actual);
    pintar();
  }

  botonIrreducible.addEventListener('click', () => {
    if (api.respondido()) return;
    const r = evaluarIrreducible(actual);
    if (!r.correcto) return fallar(r.error, aTexto(actual), avisoTodavia(actual, api.idioma));
    botones.forEach(b => { b.disabled = true; });
    botonIrreducible.disabled = true;
    mensajeEl.textContent = '';
    const copia = [...cadena];
    api.responder({
      acierto: errores === 0,
      html: ({ idioma }) => explicarPasos(copia, idioma),
      espera: 2600,
      ...(errores ? { error: primerError, respuesta: primeraRespuesta } : {}),
    });
  });
}

// ─── Ejercicio 2: ¿irreducible? ────────────────────────────────────────────────
// Cuatro fracciones; el alumno marca las irreducibles (una o más; nunca todas) y comprueba.

const enunciadoIrred = (item, { tt }) => `<p class="instruccion instruccion--enunciado">${tt(TX.irred.instruccion)}</p>`;

function montarIrred(contenedor, item, api) {
  const { tt } = api;
  const buenas = new Set(irreduciblesDe(item));
  const marcadas = new Set();
  contenedor.innerHTML = `
    ${enunciadoIrred(item, api)}
    <div class="botones-numeros botones-fracciones" id="fracciones" role="group"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#fracciones');
  const botones = item.fracs.map((f, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = htmlFraccion(fraccion(f.num, f.den));
    b.addEventListener('click', () => {
      if (api.respondido()) return;
      if (marcadas.has(i)) marcadas.delete(i); else marcadas.add(i);
      b.setAttribute('aria-pressed', String(marcadas.has(i)));
    });
    caja.append(b);
    return b;
  });
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    botones.forEach((b, i) => {
      const clase = claseCorreccion(marcadas.has(i), buenas.has(i));
      b.disabled = true;
      if (clase) b.classList.add(clase);
    });
    ev.target.hidden = true;
    const mias = [...marcadas].sort((a, b) => a - b);
    const error = errorIrreducibles(item, mias);
    const texto = mias.length ? mias.map(i => aTexto(fraccion(item.fracs[i].num, item.fracs[i].den))).join(', ') : '—';
    api.responder({
      acierto: error === null,
      html: ({ idioma }) => explicarIrreducibles(item, mias, idioma),
      espera: 4200,
      ...(error ? { error, respuesta: texto } : {}),
    });
  });
}

// ─── Ejercicio 3: de una vez ───────────────────────────────────────────────────
// El alumno escribe el m.c.d. y la fracción irreducible (el signo menos, con un botón; el
// numerador y el denominador, en dos campos). Solo es acierto si las dos cosas están bien.

const enunciadoVez = (item, { tt }) => `
    <p class="instruccion">${tt(TX.vez.instruccion)}</p>
    <div class="operacion">${htmlFraccion(fraccionDe(item))}</div>`;

function montarVez(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.vez.instruccion)}</p>
    <div class="operacion">${htmlFraccion(fraccionDe(item))}</div>
    <div class="respuesta-vez">
      <div class="respuesta-vez__mcd"><span>${tt(TX.vez.etiqueta_mcd)} =</span><span id="mcd"></span></div>
      <div class="respuesta-vez__fraccion">
        <button type="button" class="signo-menos" id="signo" aria-pressed="false" aria-label="${tt(TX.vez.nombre_signo)}">−</button>
        <span class="frac"><span id="num"></span><span id="den"></span></span>
      </div>
    </div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const signo = contenedor.querySelector('#signo');
  const campoMcd = campoNumero(contenedor.querySelector('#mcd'), { nombre: tt(TX.vez.nombre_mcd), cifras: 3, idioma: api.idioma });
  const campoNum = campoNumero(contenedor.querySelector('#num'), { nombre: tt(TX.vez.nombre_num), cifras: 3, idioma: api.idioma });
  const campoDen = campoNumero(contenedor.querySelector('#den'), { nombre: tt(TX.vez.nombre_den), cifras: 3, idioma: api.idioma });
  const campos = [campoMcd, campoNum, campoDen];
  let negativo = false;

  const respuesta = () => ({ mcd: campoMcd.valor(), num: campoNum.valor(), den: campoDen.valor(), negativo });
  const completa = () => campos.every(c => c.valor() !== null) && campoDen.valor() > 0;
  const actualizar = () => { boton.disabled = !completa(); };
  campos.forEach(c => c.elemento.addEventListener('input', actualizar));
  signo.addEventListener('click', () => {
    if (api.respondido()) return;
    negativo = !negativo;
    signo.setAttribute('aria-pressed', String(negativo));
    signo.classList.toggle('signo-menos--puesto', negativo);
  });
  actualizar();

  function comprobar() {
    if (api.respondido() || !completa()) return;
    const mia = respuesta();
    const r = evaluarDeUnaVez(item, mia);
    campos.forEach(c => c.bloquear());
    signo.disabled = true;
    boton.hidden = true;
    campoMcd.elemento.classList.add(r.mcdOk ? 'respuesta--bien' : 'respuesta--mal');
    [campoNum, campoDen].forEach(c => c.elemento.classList.add(r.fraccionOk ? 'respuesta--bien' : 'respuesta--mal'));
    api.responder({
      acierto: r.acierto,
      html: ({ idioma }) => explicarDeUnaVez(item, r.error, mia, idioma),
      espera: 3200,
      ...(r.acierto ? {} : { error: r.error, respuesta: respuestaDeUnaVez(mia) }),
    });
  }
  boton.addEventListener('click', comprobar);
  campos.forEach(c => c.elemento.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); }));
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'simplifica',
  ejercicios: [
    {
      nombre: TX.pasos.nombre,
      detalle: TX.pasos.detalle,
      introduccion: TX.pasos.introduccion,
      generar: generarPasos,
      clave: item => `${item.num}/${item.den}`,
      montar: montarPasos,
      enunciado: enunciadoPasos,
    },
    {
      nombre: TX.irred.nombre,
      detalle: TX.irred.detalle,
      introduccion: TX.irred.introduccion,
      generar: generarIrreducibles,
      clave: item => item.fracs.map(f => `${f.num}/${f.den}`).join(','),
      montar: montarIrred,
      enunciado: enunciadoIrred,
    },
    {
      nombre: TX.vez.nombre,
      detalle: TX.vez.detalle,
      introduccion: TX.vez.introduccion,
      generar: generarDeUnaVez,
      clave: item => `${item.num}/${item.den}`,
      montar: montarVez,
      enunciado: enunciadoVez,
    },
  ],
});
