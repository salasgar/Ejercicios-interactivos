// Árbol de factores (tarea 06 del reparto PU2): la interfaz de los tres
// ejercicios. El contrato de la base está explicado en ../plantilla/practica.js;
// la lógica (pura, con su test) está en logica.js y los textos en textos.js.
//
// La base puede montar el mismo ítem dos veces en la misma página (la segunda,
// de solo lectura, para la traducción): por eso aquí no hay ningún `id` y todo
// se busca dentro de `contenedor`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { unir } from '../_comun/textos.js';
import { esPrimo, factorizar, htmlFact } from '../_comun/aritmetica.js';
import { TX } from './textos.js';
import {
  generar, parejasPropias, rutasDe, nodoEn, tieneVariosArboles, porQueCompuesto, primosAProbar, explicar,
  esCorrectaCompletar, ramasMal, solucionCompletar,
} from './logica.js';

// ─── El dibujo del árbol ───────────────────────────────────────────────────────
// Cada rama es una columna (el nodo y, debajo, sus dos hijos en fila), así que
// el árbol mide de ancho lo que sus hojas. Las líneas van en un <svg> detrás,
// y se vuelven a trazar cada vez que el árbol cambia de tamaño.

function htmlRama(nodo, ruta, pinta) {
  const hijos = nodo.hijos.length
    ? `<div class="rama__hijos">${nodo.hijos.map((hijo, i) => htmlRama(hijo, ruta + i, pinta)).join('')}</div>`
    : '';
  return `<div class="rama">${pinta(nodo, ruta)}${hijos}</div>`;
}

function trazar(caja) {
  const svg = caja.querySelector('.arbol__lineas');
  const marco = caja.getBoundingClientRect();
  if (!svg || !marco.width) return;
  const lineas = [];
  caja.querySelectorAll('.rama').forEach(rama => {
    const [padre, hijos] = rama.children;
    if (!hijos) return;
    const p = padre.getBoundingClientRect();
    for (const hija of hijos.children) {
      const h = hija.firstElementChild.getBoundingClientRect();
      lineas.push(`<line x1="${p.left + p.width / 2 - marco.left}" y1="${p.bottom - marco.top + 2}" x2="${h.left + h.width / 2 - marco.left}" y2="${h.top - marco.top - 2}"/>`);
    }
  });
  svg.setAttribute('viewBox', `0 0 ${marco.width} ${marco.height}`);
  svg.innerHTML = lineas.join('');
}

const vigiladas = new WeakSet();

/** Pinta `arbol` dentro de `caja` (un <div class="arbol">). `pinta(nodo, ruta)` da el HTML de cada nodo. */
function pintarArbol(caja, arbol, pinta) {
  caja.innerHTML = `<svg class="arbol__lineas" aria-hidden="true"></svg>${htmlRama(arbol, '', pinta)}`;
  trazar(caja);
  if (!vigiladas.has(caja) && typeof ResizeObserver !== 'undefined') {
    vigiladas.add(caja);
    new ResizeObserver(() => trazar(caja)).observe(caja);
  }
}

/** Un árbol terminado, sin nada que tocar: los primos, rodeados. */
const nodoFijo = nodo => `<span class="nodo ${nodo.hijos.length ? 'nodo--partido' : 'nodo--primo'}">${nodo.valor}</span>`;

/** «101 es primo: no es divisible entre 2, 3, 5 ni 7, y 11 · 11 = 121 ya se pasa de 101». */
function porQuePrimo(p, { tt }) {
  const { probados, siguiente } = primosAProbar(p);
  if (probados.length < 2) return tt(TX.es_primo_pequeno)(p);
  return tt(TX.es_primo_probando)(p, `${probados.slice(0, -1).join(', ')} ${tt(TX.ni)} ${probados.at(-1)}`, siguiente);
}

const porQueNoPrimo = (c, { tt }) => tt(TX.no_es_primo)(c, ...porQueCompuesto(c));
const igualdadFinal = n => `<span class="cuenta">${n} = ${htmlFact(factorizar(n))}</span>`;

// ─── Ejercicio 1: construye el árbol ───────────────────────────────────────────
// De cada número de las puntas el alumno dice si es primo (se rodea) o si se
// puede partir (elige él el producto: cualquiera vale). Equivocarse se dice en
// el acto y cuenta como fallo del ítem, pero el árbol se termina igual.

function montarConstruir(contenedor, item, api) {
  const { tt } = api;
  const x = TX.construir;
  const lectura = api.respondido();
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.instruccion)}</p>
    <div class="arbol"></div>
    <div class="panel-arbol"></div>`;
  const caja = contenedor.querySelector('.arbol');
  const panel = contenedor.querySelector('.panel-arbol');

  const nuevo = valor => ({ valor, hijos: [], primo: false });
  const raiz = nuevo(item.n);
  const abiertas = () => rutasDe(raiz).filter(ruta => { const n = nodoEn(raiz, ruta); return !n.hijos.length && !n.primo; });
  let elegida = '';        // ruta del número sobre el que se está decidiendo
  let partiendo = false;   // ya se sabe que se puede partir: se enseñan los productos
  let aviso = '';          // el error que se acaba de cometer
  const errores = new Set();

  const pintaNodo = (nodo, ruta) => {
    if (nodo.hijos.length) return `<span class="nodo nodo--partido">${nodo.valor}</span>`;
    if (nodo.primo) return `<span class="nodo nodo--primo" aria-label="${tt(x.nodo_primo)(nodo.valor)}">${nodo.valor}</span>`;
    return `<button type="button" class="nodo nodo--abierto${ruta === elegida ? ' nodo--elegido' : ''}" data-ruta="${ruta}"
      aria-label="${tt(x.nodo_abierto)(nodo.valor)}"${lectura ? ' disabled' : ''}>${nodo.valor}</button>`;
  };

  const avanzar = () => { elegida = abiertas()[0] ?? null; partiendo = false; };
  const error = html => { aviso = html; errores.add(html); };

  function pintar() {
    pintarArbol(caja, raiz, pintaNodo);
    const quedan = abiertas().length > 0;
    const nodo = quedan ? nodoEn(raiz, elegida) : null;
    let cuerpo;
    if (!quedan) {
      cuerpo = `<p class="panel-arbol__pregunta">${tt(x.todo_rodeado)}</p>`;
    } else if (partiendo) {
      cuerpo = `<p class="panel-arbol__pregunta">${tt(x.elige)(nodo.valor)}</p>
        <div class="botones-numeros productos">${parejasPropias(nodo.valor).map(([a, b], i) => `<button type="button" data-pareja="${i}">${a} · ${b}</button>`).join('')}</div>`;
    } else {
      cuerpo = `<p class="panel-arbol__pregunta">${tt(x.pregunta)(nodo.valor)}</p>
        <div class="si-no">
          <button type="button" class="eleccion" data-decide="primo"${lectura ? ' disabled' : ''}>${tt(x.si_primo)}</button>
          <button type="button" class="eleccion" data-decide="partir"${lectura ? ' disabled' : ''}>${tt(x.no_partir)}</button>
        </div>`;
    }
    panel.innerHTML = `
      ${aviso ? `<p class="aviso-arbol" role="alert">${aviso}.</p>` : ''}
      ${cuerpo}
      <button type="button" class="comprobar terminado"${quedan || lectura ? ' disabled' : ''}>${tt(x.terminado)}</button>`;
  }

  function decidir(decision) {
    const nodo = nodoEn(raiz, elegida);
    const primo = esPrimo(nodo.valor);
    aviso = '';
    if (decision === 'primo' && primo) { nodo.primo = true; avanzar(); }
    else if (decision === 'primo') { error(porQueNoPrimo(nodo.valor, api)); partiendo = true; }
    else if (primo) { error(tt(TX.es_primo_pequeno)(nodo.valor)); nodo.primo = true; avanzar(); }
    else partiendo = true;
  }

  function terminar() {
    panel.remove();   // ni pregunta, ni aviso, ni botón: queda el árbol y la corrección
    const otros = tieneVariosArboles(item.n) ? ` ${tt(x.otros_arboles)}` : '';
    const lista = [...errores].map(e => `${e}.`).join('<br>');
    api.responder({
      acierto: errores.size === 0,
      html: `${lista ? `${lista}<br>` : ''}${igualdadFinal(item.n)}.${otros}`,
      espera: 2800,
    });
  }

  contenedor.addEventListener('click', ev => {
    if (lectura || api.respondido()) return;
    const boton = ev.target.closest('button');
    if (!boton || !contenedor.contains(boton)) return;
    if (boton.classList.contains('terminado')) return terminar();
    if (boton.dataset.ruta !== undefined) { elegida = boton.dataset.ruta; partiendo = false; aviso = ''; }
    else if (boton.dataset.decide) decidir(boton.dataset.decide);
    else if (boton.dataset.pareja !== undefined) {
      const nodo = nodoEn(raiz, elegida);
      nodo.hijos = parejasPropias(nodo.valor)[Number(boton.dataset.pareja)].map(nuevo);
      aviso = '';
      avanzar();
    } else return;
    pintar();
  });

  pintar();
}

// ─── Ejercicio 2: ¿está terminada? ─────────────────────────────────────────────
// La igualdad siempre es verdad: se juzga si todos los factores son primos. Si
// el alumno dice que no, tiene que tocar el factor compuesto.

function montarTerminada(contenedor, item, api) {
  const { tt } = api;
  const x = TX.terminada;
  const lectura = api.respondido();
  const factores = item.igualdad.map(([base, e], i) =>
    `<button type="button" class="factor" data-i="${i}" aria-label="${tt(x.factor)(base, e)}" disabled>${base}${e > 1 ? `<sup>${e}</sup>` : ''}</button>`);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.instruccion)}</p>
    <div class="operacion igualdad">${item.n} = ${factores.join(' · ')}</div>
    <p class="instruccion paso-dos" hidden>${tt(x.toca)}</p>`;
  const igualdad = contenedor.querySelector('.igualdad');
  const botonesFactor = [...igualdad.querySelectorAll('.factor')];
  const datos = explicar(item);
  const seria = () => `${tt(x.seria)(item.n, htmlFact(datos.factorizacion))}.`;

  /** Por qué está terminada: todos son primos, y del más grande se dice por qué lo es. */
  const razonTerminada = () => {
    const bases = item.igualdad.map(([base]) => base);
    const frase = bases.length > 1 ? tt(x.todos_primos)(unir(bases, api.idioma)) : tt(x.un_primo)(bases[0]);
    const mayor = Math.max(...bases);
    return `${frase}.${mayor > 13 ? ` ${porQuePrimo(mayor, api)}.` : ''}`;
  };

  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: tt(x.si) }, { valor: 'no', html: tt(x.no) }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.terminada ? 'si' : 'no'], valor);
      if (item.terminada) return api.responder({ acierto: valor === 'si', html: razonTerminada(), espera: 2200 });
      if (valor === 'si') {
        marcarFactores(null);
        return api.responder({ acierto: false, html: `${porQueNoPrimo(item.compuesto, api)}. ${seria()}` });
      }
      // Ha dicho que no, y es verdad: ahora tiene que encontrar el compuesto.
      contenedor.querySelector('.paso-dos').hidden = false;
      igualdad.classList.add('igualdad--tocar');
      botonesFactor.forEach(b => { b.disabled = false; });
    },
  });
  if (lectura) botones.elemento.querySelectorAll('button').forEach(b => { b.disabled = true; });

  function marcarFactores(tocado) {
    igualdad.classList.remove('igualdad--tocar');
    botonesFactor.forEach((b, i) => {
      b.disabled = true;
      if (item.igualdad[i][0] === item.compuesto) b.classList.add('factor--bien');
      else if (i === tocado) b.classList.add('factor--mal');
    });
  }

  botonesFactor.forEach((boton, i) => boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const base = item.igualdad[i][0];
    marcarFactores(i);
    const porQue = `${porQueNoPrimo(item.compuesto, api)}. ${seria()}`;
    if (base === item.compuesto) return api.responder({ acierto: true, html: porQue, espera: 2600 });
    api.responder({ acierto: false, html: `${tt(x.no_era_ese)(base, item.compuesto)}. ${porQue}` });
  }));
}

// ─── Ejercicio 3: completa el árbol ────────────────────────────────────────────
// Fichas que se arrastran (ratón, dedo o lápiz) o se tocan, como en divisores/.
// Tocar una ficha la lleva al hueco activo (el resaltado; se cambia tocando otro
// hueco vacío); tocarla otra vez la devuelve al banco.

function montarCompletar(contenedor, item, api) {
  const { tt } = api;
  const x = TX.completar;
  const lectura = api.respondido();
  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.instruccion)}</p>
    <div class="arbol arbol--huecos"></div>
    <div class="banco">${item.banco.map((v, i) => `<span class="sitio" data-sitio="${i}"><button type="button" class="ficha" data-ficha="${i}"${lectura ? ' disabled' : ''}>${v}</button></span>`).join('')}</div>
    <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>
    <div class="despues"></div>`;
  const caja = contenedor.querySelector('.arbol');
  pintarArbol(caja, item.arbol, (nodo, ruta) => {
    const h = item.huecos.indexOf(ruta);
    return h < 0 ? nodoFijo(nodo) : `<span class="nodo nodo--hueco" data-hueco="${h}" aria-label="${tt(x.hueco)}"></span>`;
  });
  if (lectura) return;

  const huecos = [...caja.querySelectorAll('[data-hueco]')].sort((a, b) => a.dataset.hueco - b.dataset.hueco);
  const fichas = [...contenedor.querySelectorAll('.ficha')];
  const comprobar = contenedor.querySelector('.comprobar');
  const colocadas = item.huecos.map(() => null);   // en cada hueco, el índice de su ficha
  let activo = 0;

  function pintarFichas() {
    fichas.forEach((ficha, i) => {
      const h = colocadas.indexOf(i);
      const destino = h >= 0 ? huecos[h] : contenedor.querySelector(`[data-sitio="${i}"]`);
      if (ficha.parentElement !== destino) destino.append(ficha);
    });
    if (colocadas[activo] !== null) activo = colocadas.indexOf(null);
    huecos.forEach((el, h) => {
      el.classList.toggle('nodo--lleno', colocadas[h] !== null);
      el.classList.toggle('nodo--activo', h === activo);
    });
    comprobar.disabled = colocadas.includes(null);
    trazar(caja);
  }

  function colocar(i, h) {
    const antes = colocadas.indexOf(i);
    const ocupante = colocadas[h];
    if (antes >= 0) colocadas[antes] = null;
    // Si el hueco ya tenía ficha, se intercambian (o la otra vuelve al banco).
    if (ocupante !== null && ocupante !== i && antes >= 0) colocadas[antes] = ocupante;
    colocadas[h] = i;
  }

  function quitar(i) {
    const h = colocadas.indexOf(i);
    if (h >= 0) { colocadas[h] = null; activo = h; }
  }

  /** Hueco bajo el punto (con un margen generoso, para dedos), o -1. */
  function huecoEn(px, py) {
    const margen = 14;
    return huecos.findIndex(el => {
      const r = el.getBoundingClientRect();
      return px >= r.left - margen && px <= r.right + margen && py >= r.top - margen && py <= r.bottom + margen;
    });
  }

  /** Tocar una ficha: va al hueco activo; si ya está en un hueco, vuelve al banco. */
  function tocar(i) {
    if (colocadas.includes(i)) quitar(i);
    else if (activo >= 0) colocar(i, activo);
    pintarFichas();
  }

  fichas.forEach((ficha, i) => {
    ficha.addEventListener('pointerdown', ev => {
      if (api.respondido() || ev.button > 0) return;
      ev.preventDefault();
      try { ficha.setPointerCapture?.(ev.pointerId); } catch { /* sin captura también funciona */ }
      const x0 = ev.clientX, y0 = ev.clientY;
      let arrastrando = false;
      const mover = e => {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (!arrastrando && Math.hypot(dx, dy) > 6) { arrastrando = true; ficha.classList.add('ficha--arrastrando'); }
        if (arrastrando) ficha.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const soltar = e => {
        ficha.removeEventListener('pointermove', mover);
        ficha.removeEventListener('pointerup', soltar);
        ficha.removeEventListener('pointercancel', soltar);
        ficha.style.transform = '';
        ficha.classList.remove('ficha--arrastrando');
        if (e.type === 'pointercancel') return pintarFichas();
        if (!arrastrando) return tocar(i);
        const h = huecoEn(e.clientX, e.clientY);
        if (h >= 0) colocar(i, h); else quitar(i);
        pintarFichas();
      };
      ficha.addEventListener('pointermove', mover);
      ficha.addEventListener('pointerup', soltar);
      ficha.addEventListener('pointercancel', soltar);
    });
    // Con el teclado (Intro o espacio) no hay eventos de puntero: `detail` es 0.
    ficha.addEventListener('click', ev => { if (ev.detail === 0 && !api.respondido()) tocar(i); });
  });

  huecos.forEach((el, h) => el.addEventListener('click', ev => {
    if (api.respondido() || ev.target !== el || colocadas[h] !== null) return;
    activo = h;
    pintarFichas();
  }));

  /** Debajo de todo, un árbol terminado con su título. */
  function ensenar(titulo, arbol) {
    const despues = contenedor.querySelector('.despues');
    despues.innerHTML = `<p class="instruccion">${titulo}</p><div class="arbol"></div>`;
    pintarArbol(despues.querySelector('.arbol'), arbol, nodoFijo);
  }

  comprobar.addEventListener('click', () => {
    if (api.respondido() || colocadas.includes(null)) return;
    const valores = colocadas.map(i => item.banco[i]);
    const acierto = esCorrectaCompletar(item, valores);
    const mal = ramasMal(item, valores);
    comprobar.remove();
    fichas.forEach(f => { f.disabled = true; });
    huecos.forEach((el, h) => {
      const ruta = item.huecos[h];
      const falla = mal.some(r => r.ruta === ruta || r.ruta === ruta.slice(0, -1));
      el.classList.remove('nodo--activo');
      el.classList.add(falla ? 'nodo--mal' : 'nodo--bien');
    });
    const fact = htmlFact(factorizar(item.n));
    if (acierto) {
      if (item.otro) ensenar(`${tt(TX.otro_arbol)(item.n, fact)}.`, item.otro);
      return api.responder({ acierto: true, html: `${tt(x.bien)(item.n, fact)}.`, espera: item.otro ? 5000 : 1800 });
    }
    ensenar(tt(x.correcto), item.arbol);
    const cuentas = mal.map(r => tt(x.rama_mal)(r.a, r.b, r.producto, r.valor)).join('; ');
    api.responder({ acierto: false, html: `${cuentas}. ${tt(x.faltaban)(unir(solucionCompletar(item), api.idioma))}.` });
  });

  pintarFichas();
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'arbol',
  ejercicios: [
    {
      nombre: TX.construir.nombre,
      detalle: TX.construir.detalle,
      // Un árbol son entre 8 y 16 decisiones: con 6 árboles bien hechos basta.
      objetivo: 6,
      introduccion: TX.construir.introduccion,
      generar: rng => generar('construir', rng),
      clave: item => String(item.n),
      montar: montarConstruir,
    },
    {
      nombre: TX.terminada.nombre,
      detalle: TX.terminada.detalle,
      generar: rng => generar('terminada', rng),
      montar: montarTerminada,
    },
    {
      nombre: TX.completar.nombre,
      detalle: TX.completar.detalle,
      generar: rng => generar('completar', rng),
      clave: item => String(item.n),
      montar: montarCompletar,
    },
  ],
});
