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
  NIVEL, esNumero, esNatural, signo, texto, cadena, toca, paso, validos, motivo, exigidos, lineal, esCorrecto, evaluar,
  generarPasos1, generarPasos2, generarPasos3, generarInvisibles,
} from './logica.js';

const conExponentes = s => s.replace(/\^(\d)/g, '<sup>$1</sup>');
const htmlTexto = (fichas, idioma) => conExponentes(texto(fichas, idioma));

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
  // Los estados se van haciendo con lo que toca el alumno: si hay dos operaciones que
  // no se estorban, el orden que elija es el que se escribe en el historial.
  const estados = api.respondido() ? cadena(item.fichas) : [{ fichas: cadena(item.fichas)[0].fichas }];
  const fin = () => estados.at(-1).fichas.length === 1;
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
    const k = estados.length - 1;
    historial.innerHTML = estados.slice(0, k).map((e, j) =>
      `<div class="jer-hist">${j ? '= ' : ''}${htmlTexto(e.fichas, idioma)}</div>`).join('');
    linea.innerHTML = `${k ? '<span class="jer-igual">=</span>' : ''}${htmlFichas(estados[k].fichas, idioma, !fin() && !api.respondido())}`;
    linea.classList.toggle('jer-linea--nueva', !!nuevo);
    linea.classList.toggle('jer-linea--fin', fin());
  };

  const textoMotivo = (m, fichas, i) => {
    if (m.clave === 'parentesis') return tt(TX.motivo.parentesis)();
    if (m.clave === 'prioridad') return tt(TX.motivo.prioridad)(m.nivel, NIVEL[fichas[i]]);
    return tt(TX.motivo.izquierda)(m.nivel);
  };

  linea.addEventListener('click', ev => {
    const boton = ev.target.closest('button[data-i]');
    if (!boton || api.respondido() || fin()) return;
    const i = Number(boton.dataset.i);
    const fichas = estados.at(-1).fichas;
    const m = validos(fichas).includes(i) ? null : motivo(fichas, i);
    // Si no valía, la app hace por él el paso canónico y el ítem queda fallado.
    const hecho = m ? toca(fichas) : i;
    if (m) {
      fallo = true;
      const por = textoMotivo(m, fichas, i);
      if (!primerMotivo) primerMotivo = por;
      aviso.textContent = `${tt(TX.has_fallado)} ${por}`;
    } else {
      aviso.textContent = '';
    }
    estados.push({ fichas: paso(fichas, hecho).fichas });
    pintar(true);
    if (fin()) terminar();
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
    const que = i => (raya ? (i === 0 ? 'num' : 'den') : 'rad');
    const faltan = piden.map((r, i) => (r && !p[i] ? que(i) : null)).filter(Boolean);
    const faltas = faltan.map(c => tt(TX[`falta_${c}`])).join('; ');
    const porque = faltan.map(c => tt(TX[`porque_${c}`])).join(' ');
    // Solo se escribe lo que sale si es un natural: con decimales o negativos no se ha dado nada.
    const sale = evaluar(lineal(item, p));
    const linea = texto(lineal(item, p), idioma);
    const resultado = esNatural(sale)
      ? `${tt(TX.saldria)(sale)} ${item.valor}: <span class="cuenta">${linea} = ${sale}</span>.`
      : `${tt(TX.no_da)(item.valor)}: <span class="cuenta">${linea}</span>.`;
    api.responder({
      acierto: false,
      html: `${faltas}. ${porque} ${resultado} ${tt(TX.correcta)}: <span class="jer-cadena">${correcta}</span>.${sobran}`,
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
