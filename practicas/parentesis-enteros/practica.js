// Paréntesis y corchetes (unidad 3). Interfaz de los cinco ejercicios; toda la
// aritmética está en logica.js, aquí solo hay pantalla.

import { arrancar } from '../_comun/base.js';
import { campoEntero, html as htmlExpr, aTexto, analizar, evaluar, fmt, nodoEn, MENOS } from '../_comun/enteros.js';
import { TX } from './textos.js';
import {
  generar, arbolQuita, signosBuenos, reescritura, errorQuita,
  operandoDentro, quitandoParentesis, erroresCalcula, errorDe,
  erroresPotencia, cadenaHtml, internos, pendientes, valorEn, calculado, erroresDe, erroresResto,
  textoColocado, buenas,
} from './logica.js';

const operacion = s => `<div class="operacion">${s}</div>`;
const SIMBOLO = { '+': '+', '−': MENOS, '·': '·' };

// ─── 1. Quita el paréntesis ────────────────────────────────────────────────────────

const enunciadoQuita = (item, { tt }) => `<p class="instruccion">${tt(TX.quita.instruccion)}</p>${operacion(htmlExpr(item.expr))}`;

/** «+ 3», «− 8» (el primero de la cuenta, sin el +). */
const etiqueta = (signo, valor, primero) => (primero ? `${signo < 0 ? MENOS : ''}${valor}` : `${signo < 0 ? MENOS : '+'} ${valor}`);

function montarQuita(contenedor, item, api) {
  const { tt } = api;
  const signos = item.dentro.map(t => t.signo);
  contenedor.innerHTML = `${enunciadoQuita(item, api)}
    <div class="fichas" id="fichas" role="group"><span class="fichas__etiqueta">${tt(TX.quita.fichas)}</span></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const fichas = contenedor.querySelector('#fichas');
  const botones = [];
  let k = 0;
  const fija = t => {
    const e = document.createElement('span');
    e.className = 'ficha ficha--fija';
    e.textContent = etiqueta(t.signo, t.valor, k++ === 0);
    fichas.append(e);
  };
  item.antes.forEach(fija);
  item.dentro.forEach((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ficha';
    b.setAttribute('aria-label', `${tt(TX.quita.cambiar)} ${t.valor}`);
    const primero = k++ === 0;
    b.addEventListener('click', () => { signos[i] = -signos[i]; pintar(); });
    b.pintar = () => { b.textContent = etiqueta(signos[i], t.valor, primero); };
    botones.push(b);
    fichas.append(b);
  });
  item.despues.forEach(fija);
  const pintar = () => botones.forEach(b => b.pintar());
  pintar();

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const error = errorQuita(item, signos);
    const buenos = signosBuenos(item);
    botones.forEach((b, i) => { b.disabled = true; b.classList.add(signos[i] === buenos[i] ? 'ficha--bien' : 'ficha--mal'); });
    ev.target.hidden = true;
    const valor = evaluar(item.expr);
    const bien = reescritura(item, buenos);
    const suya = reescritura(item, signos);
    api.responder({
      acierto: error === null,
      error: error ?? undefined,
      respuesta: aTexto(suya),
      espera: 2000,
      html: ({ tt }) => {
        const cuenta = `<span class="cuenta">${htmlExpr(arbolQuita(item))} = ${htmlExpr(bien)} = ${fmt(valor)}</span>. ${tt(item.signoPar > 0 ? TX.quita.razon_mas : TX.quita.razon_menos)}`;
        if (error === null) return cuenta;
        return `<p>${tt(TX.quita.error[error])}</p>
          <p>${tt(TX.quita.tuya)}: <span class="cuenta">${htmlExpr(suya)} ${tt(TX.quita.vale)} ${fmt(evaluar(suya))}</span>; ${tt(TX.quita.original)} ${tt(TX.quita.vale)} ${fmt(valor)}.</p>
          <p>${cuenta}</p>`;
      },
    });
  });
}

// ─── 2. Calcula ────────────────────────────────────────────────────────────────────

const enunciadoCalcula = (item, { tt }) => `<p class="instruccion">${tt(TX.calcula.instruccion)}</p>${operacion(htmlExpr(item.expr))}`;

function montarCalcula(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoCalcula(item, api)}
    <div class="acciones">
      <button type="button" class="secundario" data-camino="dentro">${tt(TX.calcula.ayuda_dentro)}</button>
      <button type="button" class="secundario" data-camino="quito">${tt(TX.calcula.ayuda_quito)}</button>
    </div>
    <div class="resolucion" id="ayuda" aria-live="polite"></div>
    <div id="campo"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const ayuda = contenedor.querySelector('#ayuda');
  const boton = contenedor.querySelector('#comprobar');
  let pistas = 0;
  contenedor.querySelectorAll('[data-camino]').forEach(b => b.addEventListener('click', () => {
    if (api.respondido()) return;
    const dentro = b.dataset.camino === 'dentro';
    pistas++;
    b.disabled = true;
    ayuda.insertAdjacentHTML('beforeend', `<div class="paso"><span class="resolucion__titulo">${tt(dentro ? TX.calcula.camino_dentro : TX.calcula.camino_quito)}</span><br>= ${htmlExpr(dentro ? operandoDentro(item) : quitandoParentesis(item))}</div>`);
  }));
  const campo = campoEntero(contenedor.querySelector('#campo'), { nombre: tt(TX.calcula.resultado), boton, alEnviar: comprobar });
  boton.addEventListener('click', () => comprobar(campo.valor()));

  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    contenedor.querySelectorAll('[data-camino]').forEach(b => { b.disabled = true; });
    const bien = evaluar(item.expr);
    const acierto = valor === bien;
    const error = acierto ? undefined : errorDe(erroresCalcula(item), valor);
    api.responder({
      acierto,
      error,
      pistas,
      respuesta: fmt(valor),
      espera: 2600,
      html: ({ tt }) => {
        const dentro = `<div class="paso">${tt(TX.calcula.camino_dentro)}: ${htmlExpr(item.expr)} = ${htmlExpr(operandoDentro(item))} = ${fmt(bien)}</div>`;
        const quito = `<div class="paso">${tt(TX.calcula.camino_quito)}: ${htmlExpr(item.expr)} = ${htmlExpr(quitandoParentesis(item))} = ${fmt(bien)}</div>`;
        const mal = acierto ? '' : `<p>${tt(TX.calcula.tuyo)(fmt(valor))}. ${error !== 'otro' ? tt(TX.calcula.error[error]) : ''}</p>`;
        return `${mal}<div class="resolucion resolucion--fija">${dentro}${quito}</div><p>${tt(TX.calcula.mismo)}</p>`;
      },
    });
  }
}

// ─── 3. ¿Al paréntesis o al número? ────────────────────────────────────────────────

const enunciadoPotencia = (item, { tt }) => {
  const pareja = item.exprs.length === 2;
  const cuentas = item.exprs.map((e, i) => `<div class="cuenta-campo">${pareja ? `<p class="cuenta-campo__nombre">${tt(i ? TX.potencia.cuenta_b : TX.potencia.cuenta_a)}</p>` : ''}${operacion(htmlExpr(e))}</div>`).join('');
  return `<p class="instruccion">${tt(pareja ? TX.potencia.instruccion_pareja : TX.potencia.instruccion_sola)}</p>${cuentas}`;
};

function montarPotencia(contenedor, item, api) {
  const { tt } = api;
  const pareja = item.exprs.length === 2;
  contenedor.innerHTML = `<p class="instruccion">${tt(pareja ? TX.potencia.instruccion_pareja : TX.potencia.instruccion_sola)}</p>
    ${item.exprs.map((e, i) => `<div class="cuenta-campo">${pareja ? `<p class="cuenta-campo__nombre">${tt(i ? TX.potencia.cuenta_b : TX.potencia.cuenta_a)}</p>` : ''}${operacion(htmlExpr(e))}<div data-campo="${i}"></div></div>`).join('')}
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campos = item.exprs.map((_, i) => campoEntero(contenedor.querySelector(`[data-campo="${i}"]`), {
    nombre: `${tt(TX.potencia.resultado)}${pareja ? ` ${i ? 'B' : 'A'}` : ''}`,
    alEnviar: () => comprobar(),
  }));
  const refrescar = () => { boton.disabled = campos.some(c => c.valor() === null); };
  contenedor.addEventListener('input', refrescar);
  contenedor.addEventListener('click', refrescar);
  refrescar();
  boton.addEventListener('click', comprobar);

  function comprobar() {
    if (api.respondido()) return;
    const respuestas = campos.map(c => c.valor());
    if (respuestas.some(r => r === null)) { campos.find(c => c.valor() === null)?.elemento.focus(); return; }
    campos.forEach(c => c.bloquear());
    boton.hidden = true;
    const fallos = respuestas.map((r, i) => r !== item.valores[i]);
    const primero = fallos.indexOf(true);
    const error = primero < 0 ? undefined : errorDe(erroresPotencia(item, primero), respuestas[primero]);
    campos.forEach((c, i) => { if (fallos[i]) c.elemento.classList.add('campo-numero--malo'); });
    api.responder({
      acierto: primero < 0,
      error,
      respuesta: respuestas.map(fmt).join(' ; '),
      espera: 2800,
      html: ({ tt }) => {
        const lineas = item.exprs.map((e, i) => `<div class="paso">${pareja ? `${i ? 'B' : 'A'}: ` : ''}${cadenaHtml(e)}</div>`).join('');
        const nota = item.tipo === 'par-pot' ? `<p>${tt(TX.potencia.nota_par_pot)(item.meta)}</p>`
          : item.tipo === 'prod-neg' ? `<p>${tt(TX.potencia.nota_prod_neg)(item.meta)}</p>` : '';
        const mal = primero < 0 ? ''
          : `<p>${pareja ? tt(TX.potencia.tus_respuestas)(fmt(respuestas[0]), fmt(respuestas[1])) : tt(TX.potencia.tu_respuesta)(fmt(respuestas[0]))}. ${error !== 'otro' ? tt(TX.potencia.error[error]) : ''}</p>`;
        return `${mal}<div class="resolucion resolucion--fija">${lineas}</div>${nota}`;
      },
    });
  }
}

// ─── 4. De dentro afuera ───────────────────────────────────────────────────────────

const enunciadoCorchetes = (item, { tt }) => `<p class="instruccion">${tt(TX.corchetes.toca)}</p>${operacion(htmlExpr(item.expr))}`;

function montarCorchetes(contenedor, item, api) {
  const { tt } = api;
  let arbol = analizar(item.expr);
  const historial = [];
  let elegido = null, pistas = 0;
  contenedor.innerHTML = `<p class="instruccion" id="instr" aria-live="polite"></p>
    <div class="resolucion" id="hist"></div>
    <div class="operacion" id="expr"></div>
    <p class="mensaje mensaje--aviso" id="mensaje" aria-live="polite"></p>
    <div id="zona"></div>`;
  const instr = contenedor.querySelector('#instr');
  const hist = contenedor.querySelector('#hist');
  const exprEl = contenedor.querySelector('#expr');
  const mensaje = contenedor.querySelector('#mensaje');
  const zona = contenedor.querySelector('#zona');
  let campo = null;

  function pintar() {
    const pend = pendientes(arbol);
    const dentro = new Set(internos(arbol));
    const envolver = {};
    pend.forEach(r => {
      envolver[r] = `par-tocable${dentro.has(r) ? '' : ' par-tocable--fuera'}${r === elegido ? ' par-tocable--elegido' : ''} r-${r.replace(/\./g, '-')}`;
    });
    hist.innerHTML = historial.map(h => `<div class="paso">${h}</div>`).join('');
    exprEl.innerHTML = htmlExpr(arbol, { envolver });
    zona.innerHTML = '';
    campo = null;
    const final = pend.length === 0;
    instr.textContent = final ? tt(TX.corchetes.final) : elegido === null ? tt(TX.corchetes.toca) : tt(TX.corchetes.cuanto);
    if (!final && elegido === null) return;
    if (!final) zona.insertAdjacentHTML('beforeend', `<div class="operacion">${htmlExpr(nodoEn(arbol, elegido))} = ?</div>`);
    zona.insertAdjacentHTML('beforeend', '<div id="campo"></div><button type="button" class="comprobar" id="comprobar"></button>');
    const boton = zona.querySelector('#comprobar');
    boton.textContent = api.t.comprobar;
    campo = campoEntero(zona.querySelector('#campo'), { nombre: tt(TX.corchetes.valor_de), boton, alEnviar: enviar });
    boton.addEventListener('click', () => enviar(campo.valor()));
    campo.elemento.focus();
  }

  exprEl.addEventListener('click', ev => {
    if (api.respondido() || campo?.elemento.disabled) return;
    const el = ev.target.closest('.par-tocable');
    if (!el) return;
    const ruta = [...el.classList].find(c => c.startsWith('r-')).slice(2).replace(/-/g, '.');
    mensaje.textContent = '';
    if (!internos(arbol).includes(ruta)) {
      pistas++;
      mensaje.textContent = tt(TX.corchetes.primero_dentro);
      return;
    }
    elegido = ruta;
    pintar();
  });

  function terminar(acierto, valor, error) {
    campo.bloquear();
    zona.querySelector('#comprobar').hidden = true;
    api.responder({
      acierto,
      error,
      pistas,
      respuesta: fmt(valor),
      espera: 2600,
      html: ({ tt }) => {
        const mal = acierto ? '' : `<p>${tt(TX.corchetes.tu_respuesta)(fmt(valor))}. ${error && error !== 'otro' ? tt(TX.corchetes.error[error]) : ''}</p>`;
        return `${mal}<div class="resolucion resolucion--fija"><div class="paso">${cadenaHtml(item.expr)}</div></div>`;
      },
    });
  }

  function enviar(valor) {
    if (api.respondido() || valor === null) return;
    const final = pendientes(arbol).length === 0;
    const bien = final ? evaluar(arbol) : valorEn(arbol, elegido);
    if (valor !== bien) {
      const error = errorDe(final ? erroresResto(arbol) : erroresDe(arbol, elegido), valor);
      mensaje.textContent = '';
      exprEl.querySelectorAll('.par-tocable').forEach(e => e.classList.add('par-tocable--bloqueado'));
      terminar(false, valor, error);
      return;
    }
    if (final) { terminar(true, valor); return; }
    historial.push(htmlExpr(arbol));
    arbol = calculado(arbol, elegido, valor);
    elegido = null;
    pintar();
  }

  pintar();
}

// ─── 5. Coloca los paréntesis ──────────────────────────────────────────────────────

const enunciadoColocar = (item, { tt }) => `<p class="instruccion">${tt(TX.colocar.instruccion)}</p>
  <div class="objetivo">${fmt(item.objetivo)}</div>${operacion(htmlExpr(item.expr))}`;

function montarColocar(contenedor, item, api) {
  const { tt } = api;
  const n = item.numeros.length;
  let abre = null, cierra = null;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.colocar.instruccion)}</p>
    <div class="objetivo">${fmt(item.objetivo)}</div>
    <div class="expr" id="expr" role="group">${item.numeros.map((v, i) => `${i ? '<span class="grupo">' : ''}${i ? `<span class="signo">${SIMBOLO[item.ops[i - 1]]}</span>` : ''}
      <span class="celda">
        <button type="button" class="hueco-p" data-i="${i}" data-lado="abre" aria-label="${tt(TX.colocar.hueco_abre)} ${fmt(v)}"></button>
        <span class="num">${fmt(v)}</span>
        <button type="button" class="hueco-p" data-i="${i}" data-lado="cierra" aria-label="${tt(TX.colocar.hueco_cierra)} ${fmt(v)}"></button>
      </span>${i ? '</span>' : ''}`).join('')}</div>
    <div class="acciones"><button type="button" class="secundario" id="borrar">${tt(TX.colocar.borrar)}</button></div>
    <p class="mensaje mensaje--aviso" id="mensaje" aria-live="polite"></p>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const huecos = [...contenedor.querySelectorAll('.hueco-p')];
  const mensaje = contenedor.querySelector('#mensaje');
  const pintar = (rojo = false) => huecos.forEach(h => {
    const i = Number(h.dataset.i);
    const puesto = h.dataset.lado === 'abre' ? abre === i : cierra === i;
    h.textContent = puesto ? (h.dataset.lado === 'abre' ? '(' : ')') : '';
    h.classList.toggle('hueco-p--puesto', puesto);
    h.classList.toggle('hueco-p--rojo', rojo && puesto);
  });
  huecos.forEach(h => h.addEventListener('click', () => {
    if (api.respondido()) return;
    const i = Number(h.dataset.i);
    if (h.dataset.lado === 'abre') abre = abre === i ? null : i; else cierra = cierra === i ? null : i;
    mensaje.textContent = '';
    pintar();
  }));
  contenedor.querySelector('#borrar').addEventListener('click', () => {
    if (api.respondido()) return;
    abre = null; cierra = null; mensaje.textContent = ''; pintar();
  });

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const aviso = abre === null || cierra === null ? TX.colocar.falta
      : cierra <= abre ? TX.colocar.orden
      : abre === 0 && cierra === n - 1 ? TX.colocar.todo : null;
    if (aviso) { mensaje.textContent = tt(aviso); pintar(true); return; }
    huecos.forEach(h => { h.disabled = true; });
    contenedor.querySelector('#borrar').disabled = true;
    ev.target.hidden = true;
    const texto = textoColocado(item, abre, cierra);
    const valor = evaluar(texto);
    const acierto = valor === item.objetivo;
    api.responder({
      acierto,
      error: acierto ? undefined : 'parentesis-mal-colocado',
      respuesta: aTexto(texto),
      espera: 2600,
      html: ({ tt }) => {
        const suya = `<p>${tt(TX.colocar.tu_colocacion)}: <span class="cuenta">${cadenaHtml(texto)}</span></p>`;
        if (acierto) return suya;
        const otra = buenas(item)[0];
        return `${suya}<p>${tt(TX.colocar.da)} ${fmt(valor)}, ${tt(TX.colocar.no)} ${fmt(item.objetivo)}.</p>
          <p>${tt(TX.colocar.una_vale)}: <span class="cuenta">${cadenaHtml(otra.texto)}</span></p>`;
      },
    });
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────────

const MONTAR = [montarQuita, montarCalcula, montarPotencia, montarCorchetes, montarColocar];
const ENUNCIADO = [enunciadoQuita, enunciadoCalcula, enunciadoPotencia, enunciadoCorchetes, enunciadoColocar];
// Los ejercicios con ítems largos (dos cuentas, o varios pasos) piden menos aciertos.
const OBJETIVO = [undefined, undefined, 8, 6, undefined];

arrancar({
  slug: 'parentesis-enteros',
  ejercicios: TX.ejercicios.map((x, i) => ({
    nombre: x.nombre,
    detalle: x.detalle,
    introduccion: x.introduccion,
    ...(OBJETIVO[i] ? { objetivo: OBJETIVO[i] } : {}),
    clave: item => item.expr ?? item.exprs.join(' | '),
    generar: rng => generar(i + 1, rng),
    montar: MONTAR[i],
    enunciado: ENUNCIADO[i],
  })),
});
