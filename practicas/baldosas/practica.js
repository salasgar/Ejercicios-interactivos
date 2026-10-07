// PRÁCTICA «Baldosas y cuerdas»: los problemas de m.c.d. con dibujo. Elegir
// el lado de la baldosa (ejercicio 1), contar cuántas hacen falta (ejercicio
// 2) y cortar cuerdas en trozos iguales (ejercicio 3), sin confundir el lado
// de la baldosa con cuántas hay, ni las baldosas (se multiplican) con los
// trozos de cuerdas distintas (se suman).
//
// Reparto de ficheros: logica.js (puro), textos.js, practica.js (interfaz),
// estilos.css (el dibujo de la cuadrícula y de las cuerdas, y la entrada
// numérica; lo demás ya está en ../_comun/estilos.css).

import { arrancar } from '../_comun/base.js';
import { factorizar, htmlFact } from '../_comun/aritmetica.js';
import { TX } from './textos.js';
import {
  generarBaldosa, esLaMasGrande, cabeEnLado,
  generarCuantas, esNumeroDeBaldosas,
  generarCuerdas, esCorteDeCuerdas,
} from './logica.js';

// La cuadrícula no se dibuja celda a celda: un SVG con un <pattern> que se
// repite, así que una baldosa de lado 2 en un suelo de 90 × 90 no tarda nada.
function dibujarCuadricula(contenedor, a, b, lado) {
  const wFull = Math.floor(a / lado) * lado;
  const hFull = Math.floor(b / lado) * lado;
  const sobraX = a - wFull, sobraY = b - hFull;
  contenedor.innerHTML = `
    <svg viewBox="0 0 ${a} ${b}" class="baldosas-dibujo" role="img" aria-hidden="true">
      <defs>
        <pattern id="baldosas-cuadricula" width="${lado}" height="${lado}" patternUnits="userSpaceOnUse">
          <rect width="${lado}" height="${lado}" fill="var(--primario-claro)" stroke="var(--primario)" stroke-width="0.4"/>
        </pattern>
        <pattern id="baldosas-rayado" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="var(--error-claro)"/>
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--error)" stroke-width="2.2"/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="${wFull}" height="${hFull}" fill="url(#baldosas-cuadricula)"/>
      ${sobraX > 0 ? `<rect x="${wFull}" y="0" width="${sobraX}" height="${b}" fill="url(#baldosas-rayado)"/>` : ''}
      ${sobraY > 0 ? `<rect x="0" y="${hFull}" width="${wFull}" height="${sobraY}" fill="url(#baldosas-rayado)"/>` : ''}
      <rect x="0" y="0" width="${a}" height="${b}" fill="none" stroke="var(--primario-oscuro)" stroke-width="1.2"/>
    </svg>`;
}

// Barras proporcionales con marcas cada unidad (gris claro); con `trozo`, se
// ven además los cortes. Las marcas son un fondo repetido, no un div por raya.
function dibujarBarras(contenedor, longitudes, trozo) {
  const maxL = Math.max(...longitudes);
  contenedor.innerHTML = longitudes.map(l => {
    const pct = (l / maxL) * 100;
    const paso = trozo ? (trozo / l) * 100 : (1 / l) * 100;
    const color = trozo ? 'var(--primario-oscuro)' : 'var(--borde)';
    const ancho = trozo ? 2.4 : 1;
    return `
      <div class="baldosas-cuerda" style="width:${pct}%; background-image: repeating-linear-gradient(to right, ${color} 0 ${ancho}px, transparent ${ancho}px ${paso}%);">
        <span class="baldosas-cuerda__etiqueta">${l} dm</span>
      </div>`;
  }).join('');
}

function explicarMcd(tt, a, b, g) {
  if (Math.max(a, b) <= 50) return tt(TX.baldosa.correcto_simple)(a, b, g);
  return tt(TX.baldosa.correcto_factorizado)(a, b, g, htmlFact(factorizar(a)), htmlFact(factorizar(b)));
}

// ─── Ejercicio 1: la baldosa más grande ────────────────────────────────────────

function montarBaldosa(contenedor, item, api) {
  const { tt } = api;
  const T = TX.baldosa;
  const { a, b, g, candidatos } = item;
  let ladoActual = candidatos[0];

  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.instruccion)(a, b)}</p>
    <div class="botones-numeros" id="lados"></div>
    <div id="dibujo"></div>
    <p id="mensaje" class="frase"></p>
    <button type="button" class="comprobar" id="esta">${tt(T.boton_es_esta)}</button>`;

  const cajaLados = contenedor.querySelector('#lados');
  const dibujo = contenedor.querySelector('#dibujo');
  const mensaje = contenedor.querySelector('#mensaje');
  const botonEsta = contenedor.querySelector('#esta');

  const botones = candidatos.map(s => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = String(s);
    boton.setAttribute('aria-pressed', String(s === ladoActual));
    boton.addEventListener('click', () => {
      if (api.respondido()) return;
      ladoActual = s;
      botones.forEach(x => x.boton.setAttribute('aria-pressed', String(x.valor === s)));
      pintar(s);
    });
    cajaLados.append(boton);
    return { boton, valor: s };
  });

  function pintar(s) {
    dibujarCuadricula(dibujo, a, b, s);
    const ca = cabeEnLado(a, s), cb = cabeEnLado(b, s);
    if (ca.cabe && cb.cabe) {
      mensaje.innerHTML = tt(T.cabe)(a, b, s);
    } else if (!ca.cabe && !cb.cabe) {
      const fa = tt(T.sobra_una)(a, s, ca.cociente, ca.resto);
      const fb = tt(T.sobra_una)(b, s, cb.cociente, cb.resto);
      mensaje.innerHTML = tt(T.sobra_dos)(a, b, s, `${fa} `, `${fb} `);
    } else {
      const [dim, c] = ca.cabe ? [b, cb] : [a, ca];
      mensaje.innerHTML = tt(T.sobra_una)(dim, s, c.cociente, c.resto);
    }
  }

  pintar(ladoActual);

  botonEsta.addEventListener('click', () => {
    if (api.respondido()) return;
    const s = ladoActual;
    botones.forEach(({ boton, valor }) => {
      boton.disabled = true;
      if (valor === g) boton.classList.add('bien');
      else if (valor === s) boton.classList.add('mal');
    });
    botonEsta.hidden = true;
    const acierto = esLaMasGrande(item, s);
    let html;
    if (acierto) {
      html = explicarMcd(tt, a, b, g);
    } else {
      const ca = cabeEnLado(a, s), cb = cabeEnLado(b, s);
      const base = (ca.cabe && cb.cabe) ? tt(T.incorrecto_no_mayor)(s, g) : tt(T.incorrecto_no_cabe)(s);
      html = `${base} ${tt(T.y_el_mcd)(a, b, g)}`;
    }
    api.responder({ acierto, html, espera: 2800 });
  });
}

// ─── Ejercicio 2: ¿cuántas baldosas? ────────────────────────────────────────────

function montarCuantas(contenedor, item, api) {
  const { tt } = api;
  const T = TX.cuantas;
  const { a, b, g, cuantas, errorSuma } = item;

  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.instruccion)(a, b, g)}</p>
    <div id="dibujo"></div>
    <label class="instruccion" for="baldosas-cuantas">${tt(T.respuesta_label)}</label>
    <input type="number" inputmode="numeric" id="baldosas-cuantas" class="baldosas-entero" autocomplete="off">
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;

  dibujarCuadricula(contenedor.querySelector('#dibujo'), a, b, g);
  const campo = contenedor.querySelector('#baldosas-cuantas');
  const boton = contenedor.querySelector('#comprobar');

  function comprobar() {
    if (api.respondido()) return;
    const respuesta = Number(campo.value);
    const acierto = esNumeroDeBaldosas(item, respuesta);
    campo.disabled = true;
    boton.hidden = true;
    const cuenta = tt(T.cuenta)(a, b, g, a / g, b / g, cuantas);
    let html = cuenta;
    if (!acierto) {
      if (respuesta === errorSuma) html = `${tt(T.error_suma)(a / g, b / g, cuantas)} ${cuenta}`;
      else if (respuesta === g) html = `${tt(T.error_lado)(g)} ${cuenta}`;
    }
    api.responder({ acierto, html, espera: 2800 });
  }
  boton.addEventListener('click', comprobar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); });
}

// ─── Ejercicio 3: cuerdas ───────────────────────────────────────────────────────

function montarCuerdas(contenedor, item, api) {
  const { tt } = api;
  const T = TX.cuerdas;
  const { longitudes, g, porCuerda, trozosTotal } = item;
  let trozoUsuario = null;

  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.instruccion)(longitudes)}</p>
    <div id="barras"></div>
    <div id="paso-a">
      <label class="instruccion" for="cuerdas-trozo">${tt(T.pregunta_a)}</label>
      <input type="number" inputmode="numeric" id="cuerdas-trozo" class="baldosas-entero" autocomplete="off">
      <button type="button" class="comprobar" id="comprobar-a">${api.t.comprobar}</button>
    </div>
    <div id="paso-b" hidden>
      <label class="instruccion" for="cuerdas-total">${tt(T.pregunta_b)}</label>
      <input type="number" inputmode="numeric" id="cuerdas-total" class="baldosas-entero" autocomplete="off">
      <button type="button" class="comprobar" id="comprobar-b">${api.t.comprobar}</button>
    </div>`;

  const barras = contenedor.querySelector('#barras');
  dibujarBarras(barras, longitudes, null);

  const campoA = contenedor.querySelector('#cuerdas-trozo');
  const botonA = contenedor.querySelector('#comprobar-a');
  const pasoB = contenedor.querySelector('#paso-b');
  const campoB = contenedor.querySelector('#cuerdas-total');
  const botonB = contenedor.querySelector('#comprobar-b');

  botonA.addEventListener('click', () => {
    if (api.respondido() || trozoUsuario !== null) return;
    trozoUsuario = Number(campoA.value);
    campoA.disabled = true;
    botonA.hidden = true;
    dibujarBarras(barras, longitudes, trozoUsuario);
    pasoB.hidden = false;
    campoB.focus();
  });
  campoA.addEventListener('keydown', ev => { if (ev.key === 'Enter') botonA.click(); });

  function comprobarFinal() {
    if (api.respondido()) return;
    const totalUsuario = Number(campoB.value);
    campoB.disabled = true;
    botonB.hidden = true;
    const acierto = esCorteDeCuerdas(item, trozoUsuario, totalUsuario);
    const partes = [];
    if (trozoUsuario !== g) partes.push(tt(T.pista_trozo_mal)(g));
    if (totalUsuario !== trozosTotal) partes.push(tt(T.pista_total_mal)(porCuerda, trozosTotal));
    partes.push(tt(T.cuenta)(longitudes, g, porCuerda, trozosTotal));
    api.responder({ acierto, html: partes.join(' '), espera: 3000 });
  }
  botonB.addEventListener('click', comprobarFinal);
  campoB.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobarFinal(); });
}

// ─── La práctica ────────────────────────────────────────────────────────────────

arrancar({
  slug: 'baldosas',
  ejercicios: [
    {
      nombre: TX.baldosa.nombre,
      detalle: TX.baldosa.detalle,
      introduccion: TX.baldosa.introduccion,
      generar: generarBaldosa,
      clave: item => `${item.a}x${item.b}`,
      montar: montarBaldosa,
    },
    {
      nombre: TX.cuantas.nombre,
      detalle: TX.cuantas.detalle,
      introduccion: TX.cuantas.introduccion,
      generar: generarCuantas,
      clave: item => `${item.a}x${item.b}`,
      montar: montarCuantas,
    },
    {
      nombre: TX.cuerdas.nombre,
      detalle: TX.cuerdas.detalle,
      introduccion: TX.cuerdas.introduccion,
      generar: generarCuerdas,
      clave: item => item.longitudes.join(','),
      montar: montarCuerdas,
    },
  ],
});
