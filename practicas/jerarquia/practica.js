// «¿Qué se hace primero?» (repaso de la unidad 1, tarea 20): contrato de la base
// en ../_comun/base.js; la lógica pura, en logica.js.
//
// Ejercicios 1-3: la expresión es una fila de fichas y cada operador es un botón;
// un toque = un paso. Un toque equivocado marca el ítem como fallado, dice por
// qué y la app resuelve el paso correcto para seguir. Ejercicio 4: el alumno pone
// o quita el paréntesis de cada grupo (numerador, denominador, radicando).

import { arrancar } from '../_comun/base.js';
import { TX } from './textos.js';
import {
  NIVEL, esNumero, signo, texto, cadena, motivo, exigidos, lineal, esCorrecto, evaluar,
  generarPasos1, generarPasos2, generarPasos3, generarInvisibles,
} from './logica.js';

const conExponentes = s => s.replace(/\^(\d)/g, '<sup>$1</sup>');
const htmlTexto = (fichas, idioma) => conExponentes(texto(fichas, idioma));
const numeroBonito = v => String(Math.round(v * 100) / 100);

// ─── Ejercicios 1-3: tocar el operador que toca ────────────────────────────────

function htmlFichas(fichas, idioma, activo) {
  return fichas.map((f, i) => {
    if (esNumero(f)) return `<span class="jer-n">${f}</span>`;
    if (f === '(' || f === ')') return `<span class="jer-par">${f}</span>`;
    const exponente = f[0] === '^';
    const clase = `jer-op${exponente ? ' jer-op--exp' : ''}${f === '√' ? ' jer-op--raiz' : ''}`;
    const cara = exponente ? `<sup>${f[1]}</sup>` : signo(f, idioma);
    return activo
      ? `<button type="button" class="${clase}" data-i="${i}">${cara}</button>`
      : `<span class="${clase} jer-op--quieto">${cara}</span>`;
  }).join('');
}

function montarPasos(contenedor, item, api) {
  const { tt, idioma } = api;
  const estados = cadena(item.fichas);
  const ultimo = estados.length - 1;
  let k = api.respondido() ? ultimo : 0;
  let fallo = false, primerMotivo = '';

  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.instruccion)}</p>
    <div class="jer-historial"></div>
    <div class="jer-linea" role="group"></div>
    <p class="jer-aviso" role="status"></p>`;
  const historial = contenedor.querySelector('.jer-historial');
  const linea = contenedor.querySelector('.jer-linea');
  const aviso = contenedor.querySelector('.jer-aviso');

  const pintar = nuevo => {
    historial.innerHTML = estados.slice(0, k).map((e, j) =>
      `<div class="jer-hist">${j ? '= ' : ''}${htmlTexto(e.fichas, idioma)}</div>`).join('');
    const fin = k === ultimo;
    linea.innerHTML = `${k ? '<span class="jer-igual">=</span>' : ''}${htmlFichas(estados[k].fichas, idioma, !fin && !api.respondido())}`;
    linea.classList.toggle('jer-linea--nueva', !!nuevo);
    linea.classList.toggle('jer-linea--fin', fin);
  };

  const textoMotivo = (m, fichas, i) => {
    if (m.clave === 'parentesis') return tt(TX.motivo.parentesis)();
    if (m.clave === 'prioridad') return tt(TX.motivo.prioridad)(m.nivel, NIVEL[fichas[i]]);
    return tt(TX.motivo.izquierda)(m.nivel);
  };

  linea.addEventListener('click', ev => {
    const boton = ev.target.closest('button[data-i]');
    if (!boton || api.respondido() || k === ultimo) return;
    const i = Number(boton.dataset.i);
    const fichas = estados[k].fichas;
    if (i !== estados[k + 1].indice) {
      fallo = true;
      const por = textoMotivo(motivo(fichas, i), fichas, i);
      if (!primerMotivo) primerMotivo = por;
      aviso.textContent = `${tt(TX.has_fallado)} ${por}`;
    } else {
      aviso.textContent = '';
    }
    k++;
    pintar(true);
    if (k === ultimo) terminar();
  });

  function terminar() {
    const cuenta = estados.map(e => htmlTexto(e.fichas, idioma)).join(' = ');
    const por = fallo ? `${primerMotivo} ` : '';
    api.responder({ acierto: !fallo, html: `${por}<span class="jer-cadena">${cuenta}</span>`, espera: 2200 });
  }

  pintar(false);
}

// ─── Ejercicio 4: agrupadores invisibles ───────────────────────────────────────

function montarInvisibles(contenedor, item, api) {
  const { tt, idioma } = api;
  const raya = item.agrupador === 'raya';
  const quieto = api.respondido();
  const p = item.grupos.map(() => false);
  const fuera = fichas => (fichas.length ? `<span class="jer-fuera">${texto(fichas, idioma)}</span>` : '');
  const grupo = i => `<button type="button" class="jer-grupo" data-g="${i}" ${quieto ? 'disabled' : ''}>`
    + `<span class="jer-grupo__par"></span><span>${texto(item.grupos[i], idioma)}</span><span class="jer-grupo__par"></span></button>`;
  const cuerpo = raya
    ? `<span class="jer-frac">${grupo(0)}<span class="jer-raya"></span>${grupo(1)}</span>`
    : `<span class="jer-rad"><span class="jer-rad__signo">√</span>${grupo(0)}</span>`;

  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.instruccion4)}</p>
    <div class="jer-dos-alturas">${fuera(item.antes)}${cuerpo}${fuera(item.despues)}</div>
    <p class="jer-lineal">${tt(TX.tu_linea)} <span class="cuenta" id="lineal"></span></p>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const botones = [...contenedor.querySelectorAll('.jer-grupo')];
  const salida = contenedor.querySelector('#lineal');

  const pintar = () => {
    botones.forEach((b, i) => {
      b.classList.toggle('jer-grupo--con', p[i]);
      const [a, c] = b.querySelectorAll('.jer-grupo__par');
      a.textContent = p[i] ? '(' : '';
      c.textContent = p[i] ? ')' : '';
    });
    salida.textContent = texto(lineal(item, p), idioma);
  };
  botones.forEach((b, i) => b.addEventListener('click', () => {
    if (api.respondido()) return;
    p[i] = !p[i];
    pintar();
  }));
  pintar();

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    botones.forEach(b => { b.disabled = true; });
    ev.target.hidden = true;
    const piden = exigidos(item);
    const acierto = esCorrecto(item, p);
    const correcta = cadena(item.correcta).map(e => texto(e.fichas, idioma)).join(' = ');
    const explicacion = tt(raya ? TX.explicacion_raya : TX.explicacion_radical);
    const sobran = p.map((m, i) => (m && !piden[i] ? i : -1)).filter(i => i >= 0)
      .map(i => ` ${tt(TX.sobran)(`<span class="cuenta">${texto(item.grupos[i], idioma)}</span>`)}`).join('');
    if (acierto) {
      return api.responder({ acierto: true, html: `${explicacion} <span class="jer-cadena">${correcta}</span>.${sobran}`, espera: 2600 });
    }
    const faltas = piden.map((r, i) => (r && !p[i] ? (raya ? (i === 0 ? TX.falta_num : TX.falta_den) : TX.falta_rad) : null))
      .filter(Boolean).map(tx => tt(tx)).join('; ');
    const sale = numeroBonito(evaluar(lineal(item, p)));
    api.responder({
      acierto: false,
      html: `${faltas}. ${explicacion} ${tt(TX.saldria)(sale)} ${item.valor}: <span class="cuenta">${texto(lineal(item, p), idioma)} = ${sale}</span>.`
        + ` ${tt(TX.correcta)}: <span class="jer-cadena">${correcta}</span>.${sobran}`,
    });
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

const clavePasos = item => item.fichas.join(' ');

arrancar({
  slug: 'jerarquia',
  ejercicios: [
    { nombre: TX.nombre1, detalle: TX.detalle1, introduccion: TX.intro1, generar: generarPasos1, clave: clavePasos, montar: montarPasos },
    { nombre: TX.nombre2, detalle: TX.detalle2, introduccion: TX.intro2, generar: generarPasos2, clave: clavePasos, montar: montarPasos },
    { nombre: TX.nombre3, detalle: TX.detalle3, introduccion: TX.intro3, generar: generarPasos3, clave: clavePasos, montar: montarPasos },
    {
      nombre: TX.nombre4, detalle: TX.detalle4, introduccion: TX.intro4, generar: generarInvisibles,
      clave: item => `${item.antes.join('')}|${item.grupos.map(g => g.join('')).join('/')}|${item.despues.join('')}`,
      montar: montarInvisibles,
    },
  ],
});
