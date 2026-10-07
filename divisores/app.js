// Práctica «divisor, múltiplo, divisible»: pantallas del alumno.
//
// El progreso se guarda en el navegador (por código de alumno) y, si las
// reglas de Firestore lo permiten, también en la nube. Si la nube falla no
// pasa nada: el código de resultado lleva lo necesario para calificar.

import { firebaseConfig } from '../src/config.js';
import {
  EJERCICIOS, generar, esCorrecta, esRapido, solucionArrastrar, claveDe, ejercicioNuevo, anotar, diaDe,
  leerCodigoAlumno, codigoAlumno, codigoResultado, crearRng,
} from './logica.js';
import { T, textoOperacion, frase, fraseNegada, razon, unir } from './textos.js';

const app = document.querySelector('#app');
const rng = crearRng((Date.now() ^ Math.floor(Math.random() * 2 ** 32)) >>> 0);

// --- Almacén del navegador (puede no estar: modo privado, bloqueado…) ---------

function leer(clave) {
  try { return localStorage.getItem(clave); } catch { return null; }
}
function escribir(clave, valor) {
  try { localStorage.setItem(clave, valor); } catch { /* sin almacén: se sigue sin guardar */ }
}
function borrar(clave) {
  try { localStorage.removeItem(clave); } catch { /* nada */ }
}

// --- Estado -----------------------------------------------------------------

const estado = {
  idioma: leer('divisores.idioma') === 'en' ? 'en' : 'es',
  codigo: null,     // código del alumno, o null si practica sin código
  indice: null,
  ej: EJERCICIOS.map(ejercicioNuevo),
};
let actual = null;        // ejercicio en curso: { n, sesion, practica, item, respondido, colocadas }
let repintar = () => {};  // vuelve a pintar la pantalla actual (al cambiar de idioma)
let turno = 0;            // invalida los temporizadores al cambiar de pantalla
let sinSubir = 0;

const t = () => T[estado.idioma];

function cargarProgreso() {
  estado.ej = EJERCICIOS.map(ejercicioNuevo);
  try {
    const guardado = JSON.parse(leer(`divisores.v1.${estado.codigo}`));
    if (Array.isArray(guardado?.ej)) estado.ej = EJERCICIOS.map(n => ({ ...ejercicioNuevo(), ...guardado.ej[n] }));
  } catch { /* guardado ilegible: se empieza de cero */ }
}

function guardar() {
  if (estado.codigo) escribir(`divisores.v1.${estado.codigo}`, JSON.stringify({ ej: estado.ej }));
}

/** Copia del progreso en Firestore (documento `divisores/{código}`). */
function subir() {
  sinSubir = 0;
  if (!estado.codigo || !firebaseConfig?.apiKey) return;
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/divisores/${estado.codigo}?key=${firebaseConfig.apiKey}`;
  const fields = {
    estado: { stringValue: JSON.stringify({ v: 1, idioma: estado.idioma, ej: estado.ej }) },
    actualizado: { integerValue: String(Date.now()) },
  };
  fetch(url, { method: 'PATCH', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) }).catch(() => {});
}

// --- Cabecera: idioma ---------------------------------------------------------

function pintarCabecera() {
  document.documentElement.lang = estado.idioma;
  document.title = t().titulo;
  document.querySelector('#cabecera-titulo').textContent = t().titulo;
  document.querySelector('#idiomas').innerHTML = ['es', 'en']
    .map(i => `<button type="button" data-idioma="${i}" aria-pressed="${i === estado.idioma}">${i.toUpperCase()}</button>`).join('');
}

document.querySelector('#idiomas').addEventListener('click', ev => {
  const idioma = ev.target.closest('[data-idioma]')?.dataset.idioma;
  if (!idioma || idioma === estado.idioma) return;
  estado.idioma = idioma;
  escribir('divisores.idioma', idioma);
  pintarCabecera();
  repintar();
});

// --- Entrada ------------------------------------------------------------------

function pintarEntrada(error = false) {
  turno++;
  actual = null;
  repintar = () => pintarEntrada();
  app.innerHTML = `
    <section class="entrada">
      <form class="tarjeta" id="form-codigo">
        <h2>${t().entrada_titulo}</h2>
        <p class="pequeno">${t().entrada_ayuda}</p>
        <input id="codigo" type="text" class="codigo-entrada" maxlength="8" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="${t().entrada_titulo}" required>
        ${error ? `<div class="aviso aviso--error">${t().entrada_error}</div>` : ''}
        <button type="submit" class="ancho">${t().entrada_boton}</button>
      </form>
      <button type="button" id="probar" class="secundario ancho">${t().probar}</button>
      <p class="pequeno centrado">${t().probar_aviso}</p>
    </section>`;
  app.querySelector('#form-codigo').addEventListener('submit', ev => {
    ev.preventDefault();
    const indice = leerCodigoAlumno(app.querySelector('#codigo').value);
    if (indice === null) return pintarEntrada(true);
    entrar(indice);
  });
  app.querySelector('#probar').addEventListener('click', () => {
    estado.codigo = null;
    estado.indice = null;
    estado.ej = EJERCICIOS.map(ejercicioNuevo);
    pintarMenu();
  });
}

function entrar(indice) {
  estado.indice = indice;
  estado.codigo = codigoAlumno(indice);
  escribir('divisores.codigo', estado.codigo);
  cargarProgreso();
  pintarMenu();
}

// --- Menú ---------------------------------------------------------------------

function cajaResultado() {
  const hechos = estado.ej.filter(e => e.terminado);
  if (estado.indice === null || !hechos.length) return '';
  const codigo = codigoResultado(estado.indice, estado.ej, Math.max(...hechos.map(e => e.dia)));
  const completo = hechos.length === EJERCICIOS.length;
  return `
    <div class="tarjeta resultado ${completo ? 'resultado--completo' : ''}">
      <h3>${t().resultado_titulo}</h3>
      <p class="pequeno">${completo ? t().resultado_completo : t().resultado_parcial(hechos.length)}</p>
      <div class="resultado__fila">
        <output class="resultado__codigo" id="codigo-resultado">${codigo}</output>
        <button type="button" class="secundario" id="copiar">${t().copiar}</button>
      </div>
    </div>`;
}

function activarCopiar() {
  const boton = app.querySelector('#copiar');
  if (!boton) return;
  boton.addEventListener('click', async () => {
    const salida = app.querySelector('#codigo-resultado');
    try {
      await navigator.clipboard.writeText(salida.textContent);
      boton.textContent = t().copiado;
    } catch {
      // Sin permiso de portapapeles: se deja seleccionado para copiarlo a mano.
      getSelection().selectAllChildren(salida);
    }
  });
}

function pintarMenu() {
  turno++;
  actual = null;
  repintar = pintarMenu;
  const filas = EJERCICIOS.map(n => {
    const e = estado.ej[n];
    const empezado = e.aciertos + e.fallos > 0;
    const etiqueta = e.terminado
      ? `<span class="etiqueta etiqueta--ok">✓ ${t().hecho} · ${t().fallos(e.fallos)}</span>`
      : empezado ? `<span class="etiqueta">${t().quedan(e.pendientes)}</span>` : '';
    const boton = e.terminado ? t().repetir : empezado ? t().seguir : t().empezar;
    return `
      <li class="lista__item">
        <div><h3>${t().ejercicios[n].nombre}</h3><div class="detalle">${t().ejercicios[n].detalle}</div>${etiqueta}</div>
        <button type="button" data-ejercicio="${n}" class="${e.terminado ? 'secundario' : ''}">${boton}</button>
      </li>`;
  }).join('');
  app.innerHTML = `
    <section>
      <h2>${t().menu_titulo}</h2>
      <p>${t().menu_regla}</p>
      ${estado.codigo ? '' : `<div class="aviso">${t().sin_codigo}</div>`}
      <ul class="lista">${filas}</ul>
      ${cajaResultado()}
      <button type="button" class="discreto" id="cambiar">${t().cambiar_codigo}${estado.codigo ? ` (${estado.codigo})` : ''}</button>
    </section>`;
  app.querySelectorAll('[data-ejercicio]').forEach(b => b.addEventListener('click', () => abrirEjercicio(Number(b.dataset.ejercicio))));
  app.querySelector('#cambiar').addEventListener('click', () => {
    borrar('divisores.codigo');
    estado.codigo = null;
    estado.indice = null;
    pintarEntrada();
  });
  activarCopiar();
}

// --- Ejercicio ----------------------------------------------------------------

function abrirEjercicio(n) {
  // Un ejercicio ya terminado se puede repetir para practicar, sin tocar lo guardado.
  const practica = estado.ej[n].terminado;
  actual = { n, practica, sesion: practica ? ejercicioNuevo() : estado.ej[n], item: null, respondido: false };
  siguiente();
}

function siguiente() {
  turno++;
  if (actual.sesion.terminado) return pintarFin();
  const anterior = actual.item && claveDe(actual.item);
  let item = generar(actual.n, rng);
  for (let i = 0; i < 5 && claveDe(item) === anterior; i++) item = generar(actual.n, rng);
  actual.item = item;
  actual.respondido = false;
  actual.inicio = performance.now();
  actual.colocadas = [null, null];
  pintarEjercicio();
}

function hueco(clase = '', atributos = '') {
  return `<span class="hueco ${clase}" ${atributos}></span>`;
}

function htmlFrase(item) {
  const tt = t();
  if (item.tipo === 'eleccion') return `<span class="numero">${item.x}</span> ${tt.es} ${hueco('', 'id="hueco"')} <span class="numero">${item.y}</span>`;
  if (item.tipo === 'preposicion') return `<span class="numero">${item.x}</span> ${tt.es} ${tt.palabra[item.relacion]} ${hueco('hueco--corto', 'id="hueco"')} <span class="numero">${item.y}</span>`;
  return `${hueco('hueco--ficha', 'data-hueco="0"')} ${tt.es} ${tt.relacion[item.relacion]} ${hueco('hueco--ficha', 'data-hueco="1"')}`;
}

function htmlRespuestas(item) {
  const tt = t();
  if (item.tipo === 'arrastrar') {
    const sitios = item.numeros.map((num, i) => `<span class="sitio" data-sitio="${i}"><button type="button" class="ficha" data-ficha="${i}">${num}</button></span>`).join('');
    return `<div class="banco" id="banco">${sitios}</div><button type="button" id="comprobar" class="ancho" disabled>${tt.comprobar}</button>`;
  }
  const texto = item.tipo === 'eleccion' ? tt.relacion : tt.preposicion;
  return `<div class="elecciones elecciones--${item.opciones.length}">${item.opciones.map(o => `<button type="button" class="eleccion" data-opcion="${o}">${texto[o]}</button>`).join('')}</div>`;
}

function pintarContador() {
  const s = actual.sesion;
  app.querySelector('#quedan').textContent = t().quedan(s.pendientes);
  app.querySelector('#barra').style.width = `${Math.round(100 * s.aciertos / Math.max(1, s.aciertos + s.pendientes))}%`;
}

function pintarEjercicio() {
  // Al cambiar de idioma con la respuesta ya dada, se pasa al siguiente.
  repintar = () => (actual.respondido ? siguiente() : pintarEjercicio());
  const { item, n } = actual;
  app.innerHTML = `
    <section>
      <button type="button" class="discreto volver" id="salir">${t().salir}</button>
      <div class="progreso"><span>${t().ejercicios[n].nombre}</span><strong id="quedan"></strong></div>
      <div class="barra"><div id="barra"></div></div>
      <div class="tarjeta ejercicio">
        <p class="instruccion">${t().instruccion[item.tipo]}</p>
        <div class="operacion">${textoOperacion(item.op, estado.idioma)}</div>
        <div class="flecha" aria-hidden="true">↓</div>
        <div class="frase">${htmlFrase(item)}</div>
        ${htmlRespuestas(item)}
        <div id="feedback" aria-live="polite"></div>
      </div>
    </section>`;
  pintarContador();
  app.querySelector('#salir').addEventListener('click', pintarMenu);
  if (item.tipo === 'arrastrar') activarFichas();
  else app.querySelectorAll('.eleccion').forEach(b => b.addEventListener('click', () => responderOpcion(b.dataset.opcion)));
}

/** Anota la respuesta en el contador y lo guarda. */
function registrar(acierto) {
  actual.respondido = true;
  const antes = actual.sesion.pendientes;
  actual.rapido = !acierto && esRapido(actual.item.tipo, performance.now() - actual.inicio);
  actual.sesion = anotar(actual.sesion, acierto, diaDe(new Date()), actual.rapido);
  if (actual.practica) {
    if (actual.sesion.terminado) { estado.ej[actual.n].repeticiones++; guardar(); subir(); }
  } else {
    estado.ej[actual.n] = actual.sesion;
    guardar();
    if (actual.sesion.terminado || ++sinSubir >= 5) subir();
  }
  actual.sumadas = Math.max(0, actual.sesion.pendientes - antes);
  pintarContador();
}

function mostrarFeedback(acierto, html, espera = 1300) {
  const caja = app.querySelector('#feedback');
  if (acierto) {
    caja.innerHTML = `<div class="feedback feedback--bien"><strong>✓ ${t().bien}</strong> ${html}</div>`;
    const miTurno = turno;
    setTimeout(() => { if (miTurno === turno) siguiente(); }, espera);
    return;
  }
  // Fallo pensado: ánimos. Fallo por contestar deprisa: cartel de aviso.
  const cartel = actual.rapido ? `<div class="cartel" role="alert"><span aria-hidden="true">⚠️</span> ${t().aviso_rapido}</div>` : '';
  const animo = actual.rapido ? '' : `<p class="animo">${rng.elegir(t().animos)}</p>`;
  caja.innerHTML = `
    ${cartel}
    <div class="feedback feedback--mal"><strong>✗ ${t().mal}</strong> ${html}<p class="penalizacion">${t().penalizacion(actual.sumadas)}</p>${animo}</div>
    <button type="button" id="siguiente" class="ancho">${t().siguiente}</button>`;
  const boton = app.querySelector('#siguiente');
  boton.addEventListener('click', siguiente);
  boton.focus();
  boton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function responderOpcion(opcion) {
  if (actual.respondido) return;
  const { item } = actual;
  const idioma = estado.idioma;
  const acierto = esCorrecta(item, opcion);
  const correctas = item.tipo === 'eleccion' ? item.correctas : [item.correcta];
  registrar(acierto);

  app.querySelectorAll('.eleccion').forEach(b => {
    b.disabled = true;
    if (correctas.includes(b.dataset.opcion)) b.classList.add('eleccion--correcta');
    else if (b.dataset.opcion === opcion) b.classList.add('eleccion--mal');
  });
  const elHueco = app.querySelector('#hueco');
  elHueco.textContent = (item.tipo === 'eleccion' ? t().relacion : t().preposicion)[opcion];
  elHueco.classList.add(acierto ? 'hueco--bien' : 'hueco--mal');

  if (item.tipo === 'preposicion') {
    const buena = `${frase(item.relacion, item.x, item.y, idioma)}.`;
    return mostrarFeedback(acierto, acierto ? buena : `${t().se_dice}<br>${buena}`);
  }
  if (acierto) {
    const otras = correctas.filter(r => r !== opcion).map(r => frase(r, item.x, item.y, idioma));
    const extra = otras.length ? `<br>${t().tambien} ${unir(otras, idioma)}.` : '';
    return mostrarFeedback(true, `${frase(opcion, item.x, item.y, idioma)}.${extra}`, otras.length ? 2600 : 1300);
  }
  mostrarFeedback(false, `${fraseNegada(opcion, item.x, item.y, idioma)}.<br>
    ${t().fijate} <span class="cuenta">${razon(correctas[0], item.x, item.y, idioma)}</span>.
    ${t().por_eso} ${unir(correctas.map(r => frase(r, item.x, item.y, idioma)), idioma)}.`);
}

// --- Ejercicio 4: fichas que se arrastran (ratón, dedo o lápiz) o se tocan -----

function pintarFichas() {
  const { colocadas } = actual;
  app.querySelectorAll('.ficha').forEach(ficha => {
    const i = Number(ficha.dataset.ficha);
    const h = colocadas.indexOf(i);
    const destino = h >= 0 ? app.querySelector(`[data-hueco="${h}"]`) : app.querySelector(`[data-sitio="${i}"]`);
    if (ficha.parentElement !== destino) destino.append(ficha);
  });
  app.querySelectorAll('[data-hueco]').forEach((el, h) => el.classList.toggle('hueco--lleno', colocadas[h] !== null));
  app.querySelector('#comprobar').disabled = colocadas.includes(null);
}

function colocar(i, h) {
  const { colocadas } = actual;
  const antes = colocadas.indexOf(i);
  const ocupante = colocadas[h];
  if (antes >= 0) colocadas[antes] = null;
  // Si el hueco ya tenía ficha, se intercambian (o la otra vuelve a su sitio).
  if (ocupante !== null && ocupante !== i && antes >= 0) colocadas[antes] = ocupante;
  colocadas[h] = i;
}

function quitar(i) {
  const h = actual.colocadas.indexOf(i);
  if (h >= 0) actual.colocadas[h] = null;
}

/** Hueco bajo el punto (con un margen generoso, para dedos), o -1. */
function huecoEn(x, y) {
  const margen = 18;
  return [...app.querySelectorAll('[data-hueco]')].findIndex(el => {
    const r = el.getBoundingClientRect();
    return x >= r.left - margen && x <= r.right + margen && y >= r.top - margen && y <= r.bottom + margen;
  });
}

/** Tocar una ficha: va al primer hueco libre; si ya está en un hueco, vuelve. */
function tocar(i) {
  if (actual.colocadas.includes(i)) quitar(i);
  else if (actual.colocadas.includes(null)) colocar(i, actual.colocadas.indexOf(null));
  pintarFichas();
}

function activarFichas() {
  app.querySelectorAll('.ficha').forEach(ficha => {
    const i = Number(ficha.dataset.ficha);
    ficha.addEventListener('pointerdown', ev => {
      if (actual.respondido || ev.button > 0) return;
      ev.preventDefault();
      ficha.setPointerCapture?.(ev.pointerId);
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
    ficha.addEventListener('click', ev => { if (ev.detail === 0 && !actual.respondido) tocar(i); });
  });
  app.querySelector('#comprobar').addEventListener('click', comprobarFichas);
  pintarFichas();
}

function comprobarFichas() {
  if (actual.respondido || actual.colocadas.includes(null)) return;
  const { item } = actual;
  const idioma = estado.idioma;
  const [x, y] = actual.colocadas.map(i => item.numeros[i]);
  const acierto = esCorrecta(item, [x, y]);
  registrar(acierto);
  app.querySelector('#comprobar').hidden = true;
  app.querySelectorAll('.ficha').forEach(f => { f.disabled = true; });
  app.querySelectorAll('[data-hueco]').forEach(el => el.classList.add(acierto ? 'hueco--bien' : 'hueco--mal'));
  if (acierto) {
    return mostrarFeedback(true, `${frase(item.relacion, x, y, idioma)}: <span class="cuenta">${razon(item.relacion, x, y, idioma)}</span>.`, 1800);
  }
  const [sx, sy] = solucionArrastrar(item);
  mostrarFeedback(false, `${fraseNegada(item.relacion, x, y, idioma)}.<br>
    ${t().por_ejemplo} ${frase(item.relacion, sx, sy, idioma)}, <span class="cuenta">${razon(item.relacion, sx, sy, idioma)}</span>.`);
}

// --- Fin de un ejercicio --------------------------------------------------------

function pintarFin() {
  repintar = pintarFin;
  const { sesion, practica, n } = actual;
  app.innerHTML = `
    <section>
      <div class="tarjeta fin">
        <div class="fin__icono" aria-hidden="true">🎉</div>
        <h2>${t().fin_titulo}</h2>
        <p>${t().ejercicios[n].nombre} · ${t().fin_resumen(sesion.aciertos, sesion.fallos)}</p>
        ${practica ? `<p class="pequeno">${t().fin_practica}</p>` : ''}
      </div>
      ${cajaResultado()}
      <button type="button" class="ancho" id="al-menu">${t().salir}</button>
    </section>`;
  app.querySelector('#al-menu').addEventListener('click', pintarMenu);
  activarCopiar();
}

// --- Arranque -------------------------------------------------------------------

pintarCabecera();
// El código puede venir en el enlace (…/divisores/?c=ABCD) o estar recordado.
const inicial = leerCodigoAlumno(new URLSearchParams(location.search).get('c') ?? leer('divisores.codigo') ?? '');
if (inicial === null) pintarEntrada(); else entrar(inicial);
