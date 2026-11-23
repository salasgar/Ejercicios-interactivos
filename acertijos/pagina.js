// Página de acertijos: carga catalogo.json (o catalogo-ejemplo.json si no existe) y pinta tarjetas con filtros.
import { TIPOS, NIVELES, IDIOMAS, normalizarCatalogo, unidadesDe, filtrar, ordenar, contador, alAzar, enlaceDe, deHash } from './logica.js';

const $ = id => document.getElementById(id);
let catalogo = [];

async function cargar() {
  for (const url of ['catalogo.json', 'catalogo-ejemplo.json']) {
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      if (!r.ok) continue;
      const datos = normalizarCatalogo(await r.json());
      if (datos.length) return datos;
    } catch { /* se prueba el siguiente */ }
  }
  return [];
}

function opciones(sel, pares) {
  for (const [v, t] of pares) { const o = document.createElement('option'); o.value = v; o.textContent = t; sel.append(o); }
}

const filtrosActuales = () => ({ tipo: $('f-tipo').value, nivel: $('f-nivel').value, unidad: $('f-unidad').value, idioma: $('f-idioma').value, texto: $('f-texto').value });

function el(tag, clase, texto) { const e = document.createElement(tag); if (clase) e.className = clase; if (texto !== undefined) e.textContent = texto; return e; }
function plegable(clase, titulo, texto) {
  const d = el('details', clase); d.append(el('summary', '', titulo), el('p', '', texto)); return d;
}

function tarjeta(a) {
  const t = el('article', 'tarjeta'); t.id = a.id;
  const h = el('h2'); const enlace = el('a', '', a.titulo); enlace.href = enlaceDe(a);
  const est = el('span', 'estrellas', a.nivel); est.title = NIVELES[a.nivel]; est.setAttribute('aria-label', `Nivel: ${NIVELES[a.nivel]}`);
  h.append(enlace, est); t.append(h);
  const et = el('ul', 'etiquetas');
  et.append(el('li', '', TIPOS[a.tipo]));
  if (a.unidad !== null) et.append(el('li', '', `Unidad ${a.unidad}`));
  if (a.idioma !== 'es') et.append(el('li', '', IDIOMAS[a.idioma] || a.idioma));
  t.append(et, el('p', 'enunciado', a.enunciado));
  if (a.imagen) { const i = el('img'); i.src = a.imagen; i.alt = `Dibujo de «${a.titulo}»`; i.loading = 'lazy'; t.append(i); }
  if (a.pista) t.append(plegable('pista', 'Ver pista', a.pista));
  if (a.solucion) t.append(plegable('solucion', 'Ver solución', a.solucion));
  if (a.fuente) t.append(el('p', 'fuente', `Fuente: ${a.fuente}`));
  return t;
}

function pintar(lista, marcar = '') {
  $('contador').textContent = contador(lista.length);
  const cont = $('lista'); cont.replaceChildren();
  if (!lista.length) { cont.append(el('p', 'vacio', 'Ningún acertijo con esos filtros.')); return; }
  for (const a of lista) cont.append(tarjeta(a));
  if (marcar) { const t = document.getElementById(marcar); if (t) { t.classList.add('tarjeta--marcada'); t.scrollIntoView({ block: 'start' }); } }
}

function actualizar() { pintar(ordenar(filtrar(catalogo, filtrosActuales()))); }

async function iniciar() {
  catalogo = await cargar();
  if (!catalogo.length) { $('lista').append(el('p', 'vacio', 'No se ha podido cargar el catálogo.')); $('contador').textContent = ''; return; }
  opciones($('f-tipo'), Object.entries(TIPOS));
  opciones($('f-nivel'), Object.entries(NIVELES).map(([k, v]) => [k, `${k} ${v}`]));
  opciones($('f-unidad'), unidadesDe(catalogo).map(u => [u, `Unidad ${u}`]));
  opciones($('f-idioma'), [...new Set(catalogo.map(a => a.idioma))].map(i => [i, IDIOMAS[i] || i]));
  for (const id of ['f-tipo', 'f-nivel', 'f-unidad', 'f-idioma']) $(id).addEventListener('change', actualizar);
  $('f-texto').addEventListener('input', actualizar);
  $('b-limpiar').addEventListener('click', () => { $('filtros').reset(); history.replaceState(null, '', location.pathname + location.search); actualizar(); });
  $('b-azar').addEventListener('click', () => {
    const a = alAzar(filtrar(catalogo, filtrosActuales()));
    if (!a) return;
    history.replaceState(null, '', enlaceDe(a)); pintar([a], a.id);
  });
  window.addEventListener('hashchange', () => { const a = deHash(location.hash, catalogo); if (a) { $('filtros').reset(); pintar(ordenar(catalogo), a.id); } });
  const a = deHash(location.hash, catalogo);
  if (a) pintar(ordenar(catalogo), a.id); else actualizar();
}
iniciar();
