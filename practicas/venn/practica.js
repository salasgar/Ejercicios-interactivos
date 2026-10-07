// m.c.d. y m.c.m. con factores primos: el diagrama de Venn, las dos reglas y no
// cruzarlas. La interfaz; los generadores, las comprobaciones y el feedback
// están en logica.js (puro, con su test), y los textos en textos.js.
//
// La base vuelve a llamar a `montar` con el mismo ítem para enseñar la
// traducción después de responder (con `api.respondido()` ya en true): ahí se
// pinta el ítem resuelto y sin nada que tocar.

import { arrancar } from '../_comun/base.js';
import { pasos } from '../_comun/piezas.js';
import { TX, NOMBRE } from './textos.js';
import {
  generarVenn, generarMcd, generarMcm, generarMezcla, clave, EXPONENTE_MAXIMO,
  fichasDe, exponente, primosDe, factDe,
  esCorrectaVenn, diagnosticarVenn, explicarVenn, resumenVenn,
  diagnosticar, explicar, solucionHtml, comprobaciones,
} from './logica.js';

// ─── Ejercicio 1: el Venn ──────────────────────────────────────────────────────
// Cada factor primo es una ficha (azul las de a, naranja las de b). Una ficha
// está en el banco (zona null), en su lado ('solo') o en el centro ('comun').
// Se coloca tocándola y tocando después la zona, o arrastrándola.

/** Las zonas del DOM a las que puede ir una ficha de cada lado. */
const DESTINOS = { a: { soloA: 'solo', comun: 'comun', banco: null }, b: { soloB: 'solo', comun: 'comun', banco: null } };

function montarVenn(contenedor, item, api) {
  const { tt } = api;
  const x = TX.venn;
  const numero = { a: item.a, b: item.b };
  let bloqueado = api.respondido();
  let elegida = null;      // id de la ficha tocada, a la espera de zona
  let aviso = '';          // lo último que hay que decirle al alumno
  let marcas = new Map();  // id → 'bien' | 'mal', después de comprobar

  let n = 0;
  const fichas = ['a', 'b'].flatMap(lado => fichasDe(lado === 'a' ? item.fa : item.fb).map(p => ({ id: n++, lado, p, zona: null })));
  if (bloqueado) {
    // Solo lectura (la traducción): el Venn bien repartido.
    for (const lado of ['a', 'b']) {
      for (const [p, e] of item.comunes) fichas.filter(f => f.lado === lado && f.p === p).slice(0, e).forEach(f => { f.zona = 'comun'; });
    }
    fichas.forEach(f => { f.zona ??= 'solo'; });
  }

  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.instruccion)}</p>
    <div class="venn-banco" data-zona="banco">
      <div class="venn-fila" data-fila="a"></div>
      <div class="venn-fila" data-fila="b"></div>
    </div>
    <div class="venn-rotulos" aria-hidden="true">
      <span class="va">${tt(x.solo)(item.a)}</span><span>${tt(x.comun)}</span><span class="vb">${tt(x.solo)(item.b)}</span>
    </div>
    <div class="venn">
      <div class="venn__zona" data-zona="soloA" role="group" aria-label="${tt(x.solo)(item.a)}"></div>
      <div class="venn__zona venn__zona--comun" data-zona="comun" role="group" aria-label="${tt(x.comun)}"></div>
      <div class="venn__zona" data-zona="soloB" role="group" aria-label="${tt(x.solo)(item.b)}"></div>
    </div>
    <p class="venn-ayuda" data-ayuda aria-live="polite"></p>
    <button type="button" class="comprobar" data-comprobar>${api.t.comprobar}</button>`;
  const zona = nombre => contenedor.querySelector(`[data-zona="${nombre}"]`);
  const boton = contenedor.querySelector('[data-comprobar]');
  if (bloqueado) boton.hidden = true;

  const htmlFicha = f => `<button type="button" class="vficha vficha--${f.lado}${f.id === elegida ? ' vficha--elegida' : ''}${marcas.has(f.id) ? ` vficha--${marcas.get(f.id)}` : ''}" data-id="${f.id}" aria-label="${tt(x.ficha)(f.p, numero[f.lado])}"${bloqueado ? ' disabled' : ''}>${f.p}</button>`;

  /** En el centro, una ficha azul y una naranja del mismo primo se ven como pareja. */
  function htmlComun() {
    const dentro = fichas.filter(f => f.zona === 'comun');
    const hueco = '<span class="venn-falta" aria-hidden="true">?</span>';
    return [...new Set(dentro.map(f => f.p))].sort((p, q) => p - q).map(p => {
      const deA = dentro.filter(f => f.p === p && f.lado === 'a'), deB = dentro.filter(f => f.p === p && f.lado === 'b');
      return Array.from({ length: Math.max(deA.length, deB.length) }, (_, i) => (
        `<span class="venn-pareja${deA[i] && deB[i] ? '' : ' venn-pareja--suelta'}">${deA[i] ? htmlFicha(deA[i]) : hueco}${deB[i] ? htmlFicha(deB[i]) : hueco}</span>`
      )).join('');
    }).join('');
  }

  function pintar() {
    for (const lado of ['a', 'b']) {
      const huecos = fichas.filter(f => f.lado === lado).map(f => (f.zona === null ? htmlFicha(f) : `<span class="venn-fantasma">${f.p}</span>`));
      contenedor.querySelector(`[data-fila="${lado}"]`).innerHTML = `<span class="v${lado}">${numero[lado]}</span> = ${huecos.join(' · ')}`;
    }
    zona('soloA').innerHTML = fichas.filter(f => f.lado === 'a' && f.zona === 'solo').map(htmlFicha).join('');
    zona('soloB').innerHTML = fichas.filter(f => f.lado === 'b' && f.zona === 'solo').map(htmlFicha).join('');
    zona('comun').innerHTML = htmlComun();
    pintarEstado();
    if (!bloqueado) contenedor.querySelectorAll('.vficha').forEach(activar);
  }

  /** Lo que no obliga a rehacer las fichas: la elegida, las zonas que la admiten y la ayuda. */
  function pintarEstado() {
    const f = fichas.find(q => q.id === elegida);
    contenedor.querySelectorAll('.vficha').forEach(b => b.classList.toggle('vficha--elegida', Number(b.dataset.id) === elegida));
    for (const nombre of ['soloA', 'comun', 'soloB']) zona(nombre).classList.toggle('venn__zona--destino', Boolean(f) && nombre in DESTINOS[f.lado]);
    const sueltas = fichas.filter(q => q.zona === null).length;
    boton.disabled = bloqueado || sueltas > 0;
    if (bloqueado) aviso = '';
    contenedor.querySelector('[data-ayuda]').textContent = aviso
      || (bloqueado ? '' : f ? tt(x.elige_zona) : sueltas === fichas.length ? tt(x.ayuda) : sueltas ? tt(x.quedan)(sueltas) : tt(x.todas));
  }

  /** Lleva una ficha a una zona del DOM, si puede ir. */
  function llevar(id, nombreZona) {
    const f = fichas.find(q => q.id === id);
    elegida = null;
    if (nombreZona in DESTINOS[f.lado]) {
      f.zona = DESTINOS[f.lado][nombreZona];
      aviso = '';
    } else {
      aviso = tt(x.no_puede)(numero[f.lado], numero[f.lado === 'a' ? 'b' : 'a']);
    }
    pintar();
  }

  function tocar(id) {
    elegida = elegida === id ? null : id;
    aviso = '';
    pintarEstado();
  }

  /** Arrastre con ratón, dedo o lápiz (como en divisores/); sin moverse, es un toque. */
  function activar(ficha) {
    const id = Number(ficha.dataset.id);
    ficha.addEventListener('pointerdown', ev => {
      if (bloqueado || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      ev.preventDefault();
      ficha.setPointerCapture?.(ev.pointerId);
      const x0 = ev.clientX, y0 = ev.clientY;
      let arrastrando = false;
      const mover = e => {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (!arrastrando && Math.hypot(dx, dy) > 6) { arrastrando = true; ficha.classList.add('vficha--arrastrando'); }
        if (arrastrando) ficha.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const soltar = e => {
        ficha.removeEventListener('pointermove', mover);
        ficha.removeEventListener('pointerup', soltar);
        ficha.removeEventListener('pointercancel', soltar);
        ficha.style.transform = '';
        ficha.classList.remove('vficha--arrastrando');
        if (bloqueado || e.type === 'pointercancel') return;
        if (!arrastrando) return tocar(id);
        // La ficha arrastrada está justo debajo del dedo: se esconde para ver qué zona hay detrás.
        ficha.style.visibility = 'hidden';
        const destino = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-zona]');
        ficha.style.visibility = '';
        if (destino && contenedor.contains(destino)) llevar(id, destino.dataset.zona);
        else { elegida = null; pintarEstado(); }
      };
      ficha.addEventListener('pointermove', mover);
      ficha.addEventListener('pointerup', soltar);
      ficha.addEventListener('pointercancel', soltar);
    });
    // Con teclado (o un lector de pantalla) no hay puntero: Intro o espacio la eligen.
    ficha.addEventListener('keydown', ev => {
      if (bloqueado || (ev.key !== 'Enter' && ev.key !== ' ')) return;
      ev.preventDefault();
      tocar(id);
    });
  }

  // Tocar una zona (o el banco) con una ficha elegida la lleva allí.
  contenedor.querySelectorAll('[data-zona]').forEach(z => z.addEventListener('click', ev => {
    if (bloqueado || elegida === null || ev.target.closest('.vficha')) return;
    llevar(elegida, z.dataset.zona);
  }));

  boton.addEventListener('click', () => {
    if (api.respondido() || fichas.some(f => f.zona === null)) return;
    const de = (lado, donde) => fichas.filter(f => f.lado === lado && f.zona === donde).map(f => f.p);
    const zonas = { soloA: de('a', 'solo'), comunA: de('a', 'comun'), soloB: de('b', 'solo'), comunB: de('b', 'comun') };
    const acierto = esCorrectaVenn(item, zonas);
    const d = diagnosticarVenn(item, zonas);
    // Se pinta la corrección: verdes las parejas; rojas las fichas del primo que falla.
    if (acierto) fichas.filter(f => f.zona === 'comun').forEach(f => marcas.set(f.id, 'bien'));
    else if (d) fichas.filter(f => f.p === d.p && f.zona === (d.codigo === 'falta' ? 'solo' : 'comun')).forEach(f => marcas.set(f.id, 'mal'));
    bloqueado = true;
    elegida = null;
    boton.hidden = true;
    pintar();
    const resumen = resumenVenn(item, api.idioma);
    api.responder({
      acierto,
      html: acierto ? resumen : `${explicarVenn(item, zonas, api.idioma)}<br>${resumen}`,
      espera: 5000,
    });
  });

  pintar();
}

// ─── Ejercicios 2, 3 y 4: construir el m.c.d. o el m.c.m. con contadores ───────
// Las dos factorizaciones, una sobre otra, con las bases en columnas; debajo, la
// fila que va construyendo el alumno con un contador de exponente por primo.

const celda = (p, e) => (e === 0 ? '<span class="tabla-fact__nada">—</span>' : e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);

function montarReglas(contenedor, item, api) {
  const { tt } = api;
  const x = TX.reglas;
  const soloLectura = api.respondido();
  const primos = primosDe(item);
  const nombre = `<strong class="venn-${item.pide}">${tt(NOMBRE[item.pide])}</strong>`;
  const fila = (clase, n, f) => `<tr><th scope="row" class="${clase}">${n} =</th>${primos.map(p => `<td>${celda(p, exponente(f, p))}</td>`).join('')}</tr>`;

  contenedor.innerHTML = `
    <p class="instruccion venn-pregunta">${tt(x.instruccion)(nombre, `<span class="va">${item.a}</span>`, `<span class="vb">${item.b}</span>`)}</p>
    <table class="tabla-fact">
      ${fila('va', item.a, item.fa)}
      ${fila('vb', item.b, item.fb)}
      <tr class="tabla-fact__mia"><th scope="row">${nombre} =</th>${primos.map(() => '<td></td>').join('')}</tr>
    </table>
    <div class="grupo-pasos venn-pasos"></div>
    <div class="venn-vacio" data-vacio hidden>
      <p>${tt(x.sin_primos)}</p>
      <div class="si-no">
        <button type="button" class="eleccion" data-valor="0">${nombre} = 0</button>
        <button type="button" class="eleccion" data-valor="1">${nombre} = 1</button>
      </div>
    </div>
    <button type="button" class="comprobar" data-comprobar>${api.t.comprobar}</button>`;
  const mias = [...contenedor.querySelectorAll('.tabla-fact__mia td')];
  const boton = contenedor.querySelector('[data-comprobar]');
  const vacio = contenedor.querySelector('[data-vacio]');
  const exponentes = () => controles.map(c => c.valor());

  const pintar = () => {
    const es = exponentes();
    mias.forEach((td, i) => { td.innerHTML = celda(primos[i], es[i]); });
    // El m.c.m. de dos números de estos nunca se queda sin primos; el m.c.d., a veces sí.
    boton.disabled = item.pide === 'mcm' && es.every(e => e === 0);
    if (!vacio.hidden) { vacio.hidden = true; boton.hidden = false; }
  };
  const controles = primos.map(p => pasos(contenedor.querySelector('.venn-pasos'), {
    valor: soloLectura ? exponente(item.solucion, p) : 0,
    max: EXPONENTE_MAXIMO,
    nombre: tt(x.exponente_de)(p),
    pinta: e => (e === 0 ? `${p}` : `${p}<sup>${e}</sup>`),
    alCambiar: pintar,
  }));
  pintar();
  if (soloLectura) {
    controles.forEach(c => c.bloquear());
    boton.hidden = true;
    return;
  }

  /** `respuesta`: la factorización de los contadores, o el número 0. */
  function entregar(respuesta) {
    if (api.respondido()) return;
    const acierto = diagnosticar(item, respuesta) === null;
    controles.forEach(c => c.bloquear());
    boton.hidden = true;
    vacio.querySelectorAll('button').forEach(b => { b.disabled = true; });
    // La fila del alumno, columna a columna: verde donde coincide con la buena.
    mias.forEach((td, i) => {
      const bien = respuesta !== 0 && exponente(respuesta, primos[i]) === exponente(item.solucion, primos[i]);
      td.classList.add(bien ? 'tabla-fact__bien' : 'tabla-fact__mal');
    });
    const partes = [];
    if (!acierto) partes.push(explicar(item, respuesta, api.idioma), `${tt(x.respuesta)} ${solucionHtml(item, api.idioma)}`);
    else partes.push(solucionHtml(item, api.idioma));
    if (item.tipo === 'mezcla') partes.push(comprobaciones(item, api.idioma));
    api.responder({ acierto, html: partes.join('<br>'), espera: item.tipo === 'mezcla' ? 5000 : 3000 });
  }

  boton.addEventListener('click', () => {
    const respuesta = factDe(item, exponentes());
    if (item.pide === 'mcd' && respuesta.length === 0) {
      // Sin ningún primo elegido hay que decir cuánto vale: ¿0 o 1?
      vacio.hidden = false;
      boton.hidden = true;
      return;
    }
    entregar(respuesta);
  });
  vacio.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    b.classList.add(b.dataset.valor === '1' && item.comunes.length === 0 ? 'eleccion--correcta' : 'eleccion--mal');
    entregar(b.dataset.valor === '0' ? 0 : []);
  }));
}

// ─── La práctica ───────────────────────────────────────────────────────────────

const [venn, mcd, mcm, mezcla] = TX.ejercicios;

arrancar({
  slug: 'venn',
  ejercicios: [
    { ...venn, generar: generarVenn, clave, montar: montarVenn },
    { ...mcd, generar: generarMcd, clave, montar: montarReglas },
    { ...mcm, generar: generarMcm, clave, montar: montarReglas },
    { ...mezcla, generar: generarMezcla, clave: item => `${clave(item)}-${item.pide}`, montar: montarReglas },
  ],
});
