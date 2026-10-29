// PRÁCTICA «Fracciones equivalentes» (unidad 4, semana 1, sesión 2): el término que falta, ¿son
// equivalentes?, equipos de tarjetas y común denominador. Cuatro ejercicios.
//
// Reparto de ficheros: logica.js (puro: ítems y errores), textos.js, practica.js (interfaz),
// estilos.css (las tarjetas y las cajas del ejercicio 3).

import { arrancar } from '../_comun/base.js';
import { elecciones, campoNumero } from '../_comun/piezas.js';
import { htmlFraccion, htmlRaya } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import {
  generarTermino, generarSonEquivalentes, generarEquipos, generarComun, errorTermino, errorEquivalentes,
  evaluarEquipos, errorMcm, errorNumeradores, cruzados, claveDe,
} from './logica.js';

const hf = f => htmlFraccion({ num: f.num, den: f.den });
const hueco = '<span class="hueco-eq" data-hueco></span>';

// ─── Ejercicio 1: el término que falta ─────────────────────────────────────────────────

const enunciado1 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej1.instruccion)}</p>
  <div class="operacion">${hf(item.izq)} = ${htmlRaya(item.hueco === 'num' ? hueco : item.der.num, item.hueco === 'den' ? hueco : item.der.den)}</div>`;

function montarTermino(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado1(item, api)}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  // El enunciado lleva `hueco` como un <span>; se sustituye por el campo.
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoNumero(contenedor.querySelector('[data-hueco]'), {
    nombre: tt(TX.ej1.instruccion), cifras: 3, idioma: api.idioma, boton, alEnviar: comprobar,
  });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    const error = errorTermino(item, valor);
    api.responder({
      acierto: error === null,
      error: error ?? undefined,
      respuesta: String(valor),
      html: ({ tt }) => (error === null ? tt(TX.ej1.correcto)(item) : tt(TX.ej1.por_que[error])(item, valor) + tt(TX.ej1.solucion)(item)),
      espera: 2600,
    });
  }
}

// ─── Ejercicio 2: ¿son equivalentes? ───────────────────────────────────────────────────

const enunciado2 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej2.instruccion)}</p>
  <div class="operacion">${hf(item.a)} <span class="eq-y">&nbsp;${tt({ es: 'y', en: 'and' })}&nbsp;</span> ${hf(item.b)}</div>`;

function montarSonEquivalentes(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado2(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const dijoSi = valor === 'si';
      botones.marcar([item.equivalentes ? 'si' : 'no'], valor);
      const error = errorEquivalentes(item, dijoSi);
      api.responder({
        acierto: error === null,
        error: error ?? undefined,
        respuesta: dijoSi ? 'Sí' : 'No',
        html: ({ tt }) => (error === null ? '' : tt(TX.ej2.por_que[error])(item)) + tt(TX.ej2.cruzados)(item, cruzados(item)),
        espera: 3200,
      });
    },
  });
}

// ─── Ejercicio 3: equipos ──────────────────────────────────────────────────────────────

const enunciado3 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej3.instruccion)(item)}</p>`;

function montarEquipos(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado3(item, api)}
    <div class="eq-cajas" id="cajas"></div>
    <p class="eq-titulo">${tt(TX.ej3.bandeja)}</p>
    <div class="eq-bandeja" id="bandeja" data-zona="bandeja"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const cajasDiv = contenedor.querySelector('#cajas');
  const bandeja = contenedor.querySelector('#bandeja');
  const boton = contenedor.querySelector('#comprobar');
  const asignacion = Object.fromEntries(item.tarjetas.map(t => [t.id, null]));
  const marcas = new Map();
  let elegida = null, bloqueado = false;

  cajasDiv.innerHTML = Array.from({ length: item.cajas }, (_, c) => `<div class="eq-caja" data-zona="${c}">
    <p class="eq-titulo">${tt(TX.ej3.caja)(c + 1)}</p><div class="eq-fichas" data-caja="${c}"></div></div>`).join('');

  function llevar(id, zona) {
    asignacion[id] = zona === 'bandeja' ? null : Number(zona);
    elegida = null;
    pintar();
  }

  function activar(ficha, id) {
    ficha.addEventListener('pointerdown', ev => {
      if (bloqueado || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      ev.preventDefault();
      ficha.setPointerCapture?.(ev.pointerId);
      const x0 = ev.clientX, y0 = ev.clientY;
      let arrastrando = false;
      const mover = e => {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (!arrastrando && Math.hypot(dx, dy) > 6) { arrastrando = true; ficha.classList.add('eq-ficha--arrastrando'); }
        if (arrastrando) ficha.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const soltar = e => {
        ficha.removeEventListener('pointermove', mover);
        ficha.removeEventListener('pointerup', soltar);
        ficha.removeEventListener('pointercancel', soltar);
        ficha.style.transform = '';
        ficha.classList.remove('eq-ficha--arrastrando');
        if (bloqueado || e.type === 'pointercancel') return;
        if (!arrastrando) { elegida = elegida === id ? null : id; return pintar(); }
        ficha.style.visibility = 'hidden';
        const destino = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-zona]');
        ficha.style.visibility = '';
        if (destino && contenedor.contains(destino)) llevar(id, destino.dataset.zona);
        else { elegida = null; pintar(); }
      };
      ficha.addEventListener('pointermove', mover);
      ficha.addEventListener('pointerup', soltar);
      ficha.addEventListener('pointercancel', soltar);
    });
    ficha.addEventListener('keydown', ev => {
      if (bloqueado || (ev.key !== 'Enter' && ev.key !== ' ')) return;
      ev.preventDefault();
      elegida = elegida === id ? null : id;
      pintar();
    });
  }

  function pintar() {
    bandeja.innerHTML = '';
    cajasDiv.querySelectorAll('.eq-fichas').forEach(d => { d.innerHTML = ''; });
    for (const t of item.tarjetas) {
      const ficha = document.createElement('button');
      ficha.type = 'button';
      ficha.className = `eq-ficha${elegida === t.id ? ' eq-ficha--elegida' : ''}${marcas.has(t.id) ? ` eq-ficha--${marcas.get(t.id)}` : ''}`;
      ficha.innerHTML = htmlFraccion({ num: t.num, den: t.den }, { compacta: true });
      ficha.disabled = bloqueado;
      activar(ficha, t.id);
      const destino = asignacion[t.id] === null ? bandeja : cajasDiv.querySelector(`[data-caja="${asignacion[t.id]}"]`);
      destino.append(ficha);
    }
    boton.disabled = bloqueado || item.tarjetas.some(t => asignacion[t.id] === null);
  }

  contenedor.querySelectorAll('[data-zona]').forEach(z => z.addEventListener('click', ev => {
    if (bloqueado || elegida === null || ev.target.closest('.eq-ficha')) return;
    llevar(elegida, z.dataset.zona);
  }));

  boton.addEventListener('click', () => {
    if (api.respondido() || boton.disabled) return;
    const r = evaluarEquipos(item, asignacion);
    for (const e of r.estados) marcas.set(e.id, e.estado);
    bloqueado = true;
    elegida = null;
    boton.hidden = true;
    pintar();
    api.responder({
      acierto: r.acierto,
      error: r.error ?? undefined,
      respuesta: item.tarjetas.map(t => `${t.num}/${t.den}→${asignacion[t.id] + 1}`).join(' '),
      html: ({ tt }) => {
        if (r.acierto) return tt(TX.ej3.correcto);
        const malas = item.tarjetas.filter(t => r.estados.find(e => e.id === t.id)?.estado === 'mal');
        return tt(TX.ej3.por_que[r.error])(malas) + tt(TX.ej3.solucion)(item);
      },
      espera: 4200,
    });
  });

  pintar();
}

// ─── Ejercicio 4: común denominador ────────────────────────────────────────────────────

const enunciado4 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej4.paso1)}</p>
  <div class="operacion">${hf(item.a)} <span class="eq-y">&nbsp;;&nbsp;</span> ${hf(item.b)}</div>`;

function montarComun(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado4(item, api)}
    <div id="paso1"></div>
    <button type="button" class="comprobar" id="comprobar1" disabled>${api.t.comprobar}</button>
    <div id="paso2"></div>`;
  const boton1 = contenedor.querySelector('#comprobar1');
  const campo1 = campoNumero(contenedor.querySelector('#paso1'), { nombre: tt(TX.ej4.paso1), cifras: 3, idioma: api.idioma, boton: boton1, alEnviar: paso1 });
  boton1.addEventListener('click', () => paso1(campo1.valor()));

  function paso1(valor) {
    if (api.respondido() || valor === null || campo1.bloqueado) return;
    campo1.bloquear();
    boton1.hidden = true;
    const error = errorMcm(item, valor);
    if (error !== null) {
      return api.responder({
        acierto: false,
        error,
        respuesta: String(valor),
        html: ({ tt }) => tt(TX.ej4.por_que[error])(item) + tt(TX.ej4.solucion1)(item) + ' ' + tt(TX.ej4.solucion2)(item),
        espera: 4200,
      });
    }
    campo1.bloqueado = true;
    paso2();
  }

  function paso2() {
    const zona = contenedor.querySelector('#paso2');
    zona.innerHTML = `<p class="instruccion">${tt(TX.ej4.paso2)(item)}</p>
      <div class="operacion eq-dos">
        <span>${hf(item.a)} = ${htmlRaya('<span data-n1></span>', item.mcm)}</span>
        <span>${hf(item.b)} = ${htmlRaya('<span data-n2></span>', item.mcm)}</span>
      </div>
      <button type="button" class="comprobar" id="comprobar2" disabled>${api.t.comprobar}</button>`;
    const boton2 = zona.querySelector('#comprobar2');
    const campos = ['data-n1', 'data-n2'].map(a => campoNumero(zona.querySelector(`[${a}]`), { nombre: tt(TX.ej4.paso2)(item), cifras: 3, idioma: api.idioma, alEnviar: comprobar2 }));
    const actualizar = () => { boton2.disabled = campos.some(c => c.valor() === null); };
    campos.forEach(c => c.elemento.addEventListener('input', actualizar));
    boton2.addEventListener('click', comprobar2);
    function comprobar2() {
      if (api.respondido() || campos.some(c => c.valor() === null)) return;
      const [n1, n2] = campos.map(c => c.valor());
      campos.forEach(c => c.bloquear());
      boton2.hidden = true;
      const error = errorNumeradores(item, n1, n2);
      api.responder({
        acierto: error === null,
        error: error ?? undefined,
        respuesta: `${item.mcm}; ${n1}, ${n2}`,
        html: ({ tt }) => (error === null ? tt(TX.ej4.correcto)(item) : tt(TX.ej4.por_que[error])(item, { n1, n2 }) + tt(TX.ej4.solucion2)(item)),
        espera: 3200,
      });
    }
  }
}

// ─── La práctica ───────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
});

arrancar({
  slug: 'equivalentes',
  ejercicios: [
    ejercicio(TX.ej1, generarTermino, montarTermino, enunciado1),
    ejercicio(TX.ej2, generarSonEquivalentes, montarSonEquivalentes, enunciado2),
    ejercicio(TX.ej3, generarEquipos, montarEquipos, enunciado3),
    ejercicio(TX.ej4, generarComun, montarComun, enunciado4),
  ],
});
