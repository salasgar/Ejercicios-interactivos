// Constructor de números (repaso de la unidad 1). Tres ejercicios:
//   1. Construye: cifras en casillas con nombre para cumplir una consigna.
//   2. Valor de las cifras: descomposición (a suma, a número), valor y posición de una cifra.
//   3. Comas, puntos y palabras: la notación inglesa/española y números dichos con palabras.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, POSICION } from './textos.js';
import {
  fmt, generarConstruir, esAciertoConstruir, generarDescomposicion, esAciertoASuma, esAciertoANumero,
  errorPegado, esAciertoOpcion, generarComaPalabras, esAciertoComa, escribir, esAciertoPalabras, enPalabras,
} from './logica.js';

const num = (n, api) => fmt(n, api.idioma);

/** Un número con cada cifra en su span (la que está en `marcada`, resaltada) y un hueco cada tres. */
function numeroConMarca(n, marcada) {
  const s = String(n);
  return s.split('').map((d, i) => {
    const pos = s.length - 1 - i;
    const clases = ['cifra'];
    if (pos === marcada) clases.push('cifra--marca');
    if (pos % 3 === 2 && i > 0) clases.push('cifra--grupo');
    return `<span class="${clases.join(' ')}">${d}</span>`;
  }).join('');
}

// ─── Ejercicio 1: construye ─────────────────────────────────────────────────────

function montarConstruir(contenedor, item, api) {
  const { tt } = api;
  const T = TX.construir;
  const L = item.cifras.length;
  const consigna = item.consigna === 'cercano' ? tt(T.consigna.cercano)(num(item.objetivo, api)) : tt(T.consigna[item.consigna]);
  contenedor.innerHTML = `
    <p class="instruccion">${consigna}</p>
    <div class="casillas" id="casillas">${Array.from({ length: L }, (_, i) => `
      <div class="casilla-col">
        <button type="button" class="casilla" data-i="${i}" aria-label="${api.esc(tt(T.quitar))}">&nbsp;</button>
        <span class="casilla-nombre">${tt(POSICION[L - 1 - i])}</span>
      </div>`).join('')}
    </div>
    <div class="botones-numeros" id="fichas">${item.cifras.map((c, i) => `<button type="button" data-i="${i}">${c}</button>`).join('')}</div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;

  const casillas = [...contenedor.querySelectorAll('.casilla')];
  const fichas = [...contenedor.querySelectorAll('#fichas button')];
  const boton = contenedor.querySelector('#comprobar');
  const puesta = Array(L).fill(null); // índice de ficha en cada casilla

  const pintar = () => {
    casillas.forEach((c, i) => { c.textContent = puesta[i] === null ? ' ' : item.cifras[puesta[i]]; c.classList.toggle('casilla--llena', puesta[i] !== null); });
    fichas.forEach((f, i) => { f.disabled = puesta.includes(i); });
    boton.disabled = puesta.includes(null);
  };
  fichas.forEach((f, i) => f.addEventListener('click', () => {
    if (api.respondido()) return;
    const hueco = puesta.indexOf(null);
    if (hueco >= 0) { puesta[hueco] = i; pintar(); }
  }));
  casillas.forEach((c, i) => c.addEventListener('click', () => {
    if (api.respondido() || puesta[i] === null) return;
    puesta[i] = null; pintar();
  }));

  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const mias = puesta.map(i => item.cifras[i]);
    const acierto = esAciertoConstruir(item, mias);
    boton.style.display = 'none';
    casillas.forEach(c => { c.disabled = true; c.classList.add(acierto ? 'casilla--bien' : 'casilla--mal'); });
    fichas.forEach(f => { f.disabled = true; });
    const buena = num(item.solucion, api);
    const ultima = item.solucion % 10;
    const porQue = {
      mayor: () => tt(T.por_que.mayor)(),
      menor: () => tt(T.por_que.menor)(item.hayCero),
      menor_par: () => tt(T.por_que.menor_par)(ultima),
      mayor_impar: () => tt(T.por_que.mayor_impar)(ultima),
      cercano: () => tt(T.por_que.cercano)(num(item.objetivo, api), num(Math.abs(item.solucion - item.objetivo), api)),
    }[item.consigna]();
    const mio = Number(mias.join(''));
    const cabecera = acierto ? tt(T.bien)(buena) : tt(T.hecho)(mias[0] === 0 ? mias.join('') : num(mio, api), buena);
    api.responder({ acierto, html: `${cabecera}${porQue}`, espera: 3200 });
  });
}

// ─── Ejercicio 2: valor de las cifras ───────────────────────────────────────────

function montarASuma(contenedor, item, api) {
  const { tt } = api;
  const T = TX.descomposicion;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.a_suma_instr)(num(item.n, api))}</p>
    <div class="operacion">${num(item.n, api)}</div>
    <div class="botones-numeros" id="fichas">${item.fichas.map(v => `<button type="button" data-v="${v}" aria-pressed="false">${num(v, api)}</button>`).join('')}</div>
    <p class="instruccion" id="suma">&nbsp;</p>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const fichas = [...contenedor.querySelectorAll('#fichas button')];
  const suma = contenedor.querySelector('#suma');
  const elegidas = () => fichas.filter(f => f.getAttribute('aria-pressed') === 'true').map(f => Number(f.dataset.v));
  fichas.forEach(f => f.addEventListener('click', () => {
    if (api.respondido()) return;
    f.setAttribute('aria-pressed', String(f.getAttribute('aria-pressed') !== 'true'));
    const s = elegidas();
    suma.innerHTML = s.length ? tt(T.tu_suma)(`${s.map(v => num(v, api)).join(' + ')} = ${num(s.reduce((a, b) => a + b, 0), api)}`) : '&nbsp;';
  }));
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const acierto = esAciertoASuma(item, elegidas());
    ev.target.style.display = 'none';
    fichas.forEach(f => {
      f.disabled = true;
      const bueno = item.correctas.includes(Number(f.dataset.v));
      if (bueno) f.classList.add('bien');
      else if (f.getAttribute('aria-pressed') === 'true') f.classList.add('mal');
    });
    api.responder({ acierto, html: tt(T.a_suma_fb)(num(item.n, api), item.correctas.map(v => num(v, api)).join(' + ')), espera: 3000 });
  });
}

function montarANumero(contenedor, item, api) {
  const { tt } = api;
  const T = TX.descomposicion;
  const partes = item.sumandos.map(v => num(v, api)).join(' + ');
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.a_numero_instr)}</p>
    <div class="operacion">${partes}</div>
    <input type="number" inputmode="numeric" id="respuesta" class="constructor-entero" autocomplete="off">
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('#respuesta');
  const boton = contenedor.querySelector('#comprobar');
  const comprobar = () => {
    if (api.respondido() || campo.value.trim() === '') return;
    const escrito = Number(campo.value);
    const acierto = esAciertoANumero(item, escrito);
    campo.disabled = true; boton.style.display = 'none';
    const pegado = errorPegado(item);
    let html = tt(T.a_numero_fb)(num(item.n, api), partes);
    if (!acierto && escrito === pegado) html += tt(T.pegado)(num(item.n, api), num(pegado, api));
    api.responder({ acierto, html, espera: 2800 });
  };
  boton.addEventListener('click', comprobar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); });
}

function montarValor(contenedor, item, api) {
  const { tt } = api;
  const T = TX.descomposicion;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.valor_pregunta)(item.cifra, num(item.n, api))}</p>
    <div class="operacion operacion--cifras">${numeroConMarca(item.n, item.pos)}</div>`;
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4',
    opciones: item.opciones.map(v => ({ valor: v, html: num(v, api) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.correcto], valor);
      api.responder({
        acierto: esAciertoOpcion(item, valor),
        html: tt(T.valor_fb)(num(item.n, api), item.cifra, item.pos, num(item.correcto, api)),
        espera: 2600,
      });
    },
  });
}

function montarPosicion(contenedor, item, api) {
  const { tt } = api;
  const T = TX.descomposicion;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.posicion_pregunta)(item.cifra, num(item.n, api))}</p>
    <div class="operacion operacion--cifras">${numeroConMarca(item.n, item.pos)}</div>`;
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4',
    opciones: item.opciones.map(p => ({ valor: p, html: tt(POSICION[p]) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.correcto], valor);
      api.responder({
        acierto: esAciertoOpcion(item, valor),
        html: tt(T.posicion_fb)(num(item.n, api), item.cifra, item.pos),
        espera: 2600,
      });
    },
  });
}

function montarDescomposicion(contenedor, item, api) {
  if (item.tipo === 'a_suma') return montarASuma(contenedor, item, api);
  if (item.tipo === 'a_numero') return montarANumero(contenedor, item, api);
  if (item.tipo === 'valor') return montarValor(contenedor, item, api);
  return montarPosicion(contenedor, item, api);
}

// ─── Ejercicio 3: comas, puntos y palabras ──────────────────────────────────────

function montarComa(contenedor, item, api) {
  const { tt } = api;
  const T = TX.coma;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.pregunta[item.dir])}</p>
    <div class="operacion">${item.dado}</div>`;
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4',
    opciones: item.opciones.map(o => ({ valor: o, html: o })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.correcto], valor);
      const fb = (item.sub === 'miles' ? T.fb_miles : T.fb_decimal)[item.dir];
      const destino = item.dir === 'en_es' ? 'es' : 'en';
      let html = tt(fb)(item.dado, item.correcto);
      if (Number.isFinite(item.mal) && item.mal !== item.c) html += tt(T.trampa)(item.dado, escribir(item.mal, destino, item.estilo));
      api.responder({ acierto: esAciertoComa(item, valor), html, espera: 3600 });
    },
  });
}

function montarPalabras(contenedor, item, api) {
  const { tt } = api;
  const T = TX.coma;
  const texto = enPalabras(item.n, api.idioma);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.palabras_instr)}</p>
    <div class="operacion operacion--texto">${api.esc(texto)}</div>
    <input type="text" inputmode="numeric" id="respuesta" class="constructor-entero" autocomplete="off" aria-label="${api.esc(tt(T.palabras_instr))}">
    <p class="constructor-grupos" id="vista" aria-live="polite">&nbsp;</p>
    <p class="constructor-aviso" id="aviso" role="status"></p>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('#respuesta');
  const vista = contenedor.querySelector('#vista');
  const aviso = contenedor.querySelector('#aviso');
  const boton = contenedor.querySelector('#comprobar');
  campo.addEventListener('input', () => {
    const digitos = campo.value.replace(/\D/g, '');
    vista.textContent = digitos ? fmt(Number(digitos), api.idioma) : ' ';
  });
  const comprobar = () => {
    if (api.respondido()) return;
    if (campo.value.replace(/\D/g, '') === '') { aviso.textContent = tt(T.falta); return; }
    const acierto = esAciertoPalabras(item, campo.value);
    campo.disabled = true; boton.style.display = 'none'; aviso.textContent = '';
    const m = Math.floor(item.n / 1000000), k = Math.floor(item.n / 1000) % 1000, u = item.n % 1000;
    const g = x => String(x).padStart(3, '0');
    const grupos = tt(T.grupos_nombres)(m, g(k), g(u));
    api.responder({ acierto, html: tt(T.palabras_fb)(num(item.n, api), grupos), espera: 3600 });
  };
  boton.addEventListener('click', comprobar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); });
}

function montarComaPalabras(contenedor, item, api) {
  return item.tipo === 'coma' ? montarComa(contenedor, item, api) : montarPalabras(contenedor, item, api);
}

// ─── La práctica ────────────────────────────────────────────────────────────────

arrancar({
  slug: 'constructor',
  ejercicios: [
    {
      nombre: TX.construir.nombre,
      detalle: TX.construir.detalle,
      introduccion: TX.construir.introduccion,
      generar: generarConstruir,
      clave: item => `${item.cifras.join('')}/${item.consigna}/${item.objetivo ?? ''}`,
      montar: montarConstruir,
    },
    {
      nombre: TX.descomposicion.nombre,
      detalle: TX.descomposicion.detalle,
      introduccion: TX.descomposicion.introduccion,
      generar: generarDescomposicion,
      clave: item => `${item.tipo}/${item.n}`,
      montar: montarDescomposicion,
    },
    {
      nombre: TX.coma.nombre,
      detalle: TX.coma.detalle,
      introduccion: TX.coma.introduccion,
      generar: generarComaPalabras,
      clave: item => `${item.tipo}/${item.n ?? item.dado}`,
      montar: montarComaPalabras,
    },
  ],
});
