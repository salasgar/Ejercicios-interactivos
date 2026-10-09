// Corrector de los exámenes semanales: interfaz. La lógica está en logica.js.
//
// Los datos (alumnos, claves y registros) viven en localStorage de este navegador;
// la pestaña «Datos» los exporta a CSV y a una copia de seguridad JSON que se puede
// restaurar en otro navegador. Nada sale del ordenador.

import * as L from './logica.js';

const ALMACEN = 'corrector-examenes-v1';
const ALMACEN_UI = 'corrector-examenes-ui-v1'; // preferencias: la última unidad elegida
const POR_BLOQUE = 4; // filas por tabla de respuestas, como en la franja del examen

let estado = cargar();
const ui = { pestana: 'corregir', unidad: null, semana: null, grupo: '', alumno: '', codigo: '', resp: '', obs: '', editando: null, verTodos: false, unidadRes: null, semanaRes: null, grupoRes: '', alumnoRes: '' };

// ---------------------------------------------------------------------------
// Almacenamiento
// ---------------------------------------------------------------------------
function vacio() { return { alumnos: [], claves: {}, registros: {} }; }

function cargar() {
  try {
    const dato = JSON.parse(localStorage.getItem(ALMACEN) ?? 'null');
    if (dato && Array.isArray(dato.alumnos) && dato.claves && dato.registros) return L.migrar(dato);
  } catch (e) { console.error(e); }
  return vacio();
}

function unidadGuardada() {
  try { return JSON.parse(localStorage.getItem(ALMACEN_UI) ?? '{}').unidad ?? null; } catch { return null; }
}

function guardarUnidad(unidad) {
  try { localStorage.setItem(ALMACEN_UI, JSON.stringify({ unidad })); } catch { /* da igual: solo es una preferencia */ }
}

function guardar() {
  try { localStorage.setItem(ALMACEN, JSON.stringify(estado)); } catch (e) { alert('No se ha podido guardar en el navegador: ' + e.message); }
}

async function cargarDatosIniciales() {
  if (estado.alumnos.length > 0 || Object.keys(estado.claves).length > 0) return; // Ya hay datos
  try {
    const resp = await fetch('./data/datos-iniciales.json');
    if (!resp.ok) return;
    const dato = await resp.json();
    if (dato && Array.isArray(dato.alumnos) && dato.claves && dato.registros) {
      estado = L.migrar(dato);
      guardar();
      render();
    }
  } catch (e) { console.log('No se encontraron datos iniciales para cargar'); }
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = x => (x === null || x === undefined ? '' : x.toLocaleString('es-ES', { maximumFractionDigits: 2 }));
const pct = (a, n) => (n ? Math.round(100 * a / n) + ' %' : '');
const unidades = () => [...new Set(Object.values(estado.claves).map(c => c.unidad))].sort((a, b) => a - b);
const semanasDe = unidad => Object.values(estado.claves).filter(c => c.unidad === unidad).map(c => c.semana).sort((a, b) => a - b);
const claveDe = (unidad, semana) => estado.claves[L.idClave(unidad, semana)] ?? null;
const grupos = () => [...new Set(estado.alumnos.map(a => a.grupo))].sort((a, b) => a.localeCompare(b, 'es'));
const registros = () => Object.values(estado.registros);
const registrosSemana = (unidad, semana) => registros().filter(r => r.unidad === unidad && r.semana === semana);
const alumnoDe = id => estado.alumnos.find(a => a.id === id);
const claveActual = () => (ui.unidad === null || ui.semana === null ? null : claveDe(ui.unidad, ui.semana));

function opciones(lista, valor, vacioTexto) {
  const out = vacioTexto !== undefined ? [`<option value="">${esc(vacioTexto)}</option>`] : [];
  for (const [v, texto] of lista) out.push(`<option value="${esc(v)}"${String(v) === String(valor) ? ' selected' : ''}>${esc(texto)}</option>`);
  return out.join('');
}

function descargar(nombre, contenido, tipo = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = document.createElement('a');
  a.href = url; a.download = nombre;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fechaArchivo() {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function aviso(texto, tipo = '') {
  const zona = $('#aviso-corregir');
  if (zona) zona.innerHTML = texto ? `<div class="aviso ${tipo}">${texto}</div>` : '';
}

// ---------------------------------------------------------------------------
// Pestañas
// ---------------------------------------------------------------------------
$('#pestanas').addEventListener('click', e => {
  const b = e.target.closest('button[data-pestana]');
  if (!b) return;
  ui.pestana = b.dataset.pestana;
  for (const x of $('#pestanas').children) x.classList.toggle('activa', x === b);
  render();
});

function render() {
  const us = unidades();
  // La unidad por defecto es la última elegida en la sesión anterior; si ya no existe, la más alta.
  if (ui.unidad === null || !us.includes(ui.unidad)) ui.unidad = us.includes(unidadGuardada()) ? unidadGuardada() : us.at(-1) ?? null;
  if (ui.unidad === null || !semanasDe(ui.unidad).includes(ui.semana)) ui.semana = semanasDe(ui.unidad).at(-1) ?? null;
  if (ui.unidadRes === null || !us.includes(ui.unidadRes)) ui.unidadRes = ui.unidad;
  if (ui.unidadRes === null || !semanasDe(ui.unidadRes).includes(ui.semanaRes)) ui.semanaRes = semanasDe(ui.unidadRes).at(-1) ?? null;
  ({ corregir: renderCorregir, resultados: renderResultados, alumnos: renderAlumnos, claves: renderClaves, datos: renderDatos })[ui.pestana]();
}

// ---------------------------------------------------------------------------
// Corregir
// ---------------------------------------------------------------------------
function alumnosDelGrupo(grupo) {
  return L.ordenarAlumnos(estado.alumnos.filter(a => !grupo || a.grupo === grupo));
}

function renderCorregir(foco = '#sel-alumno') {
  const clave = claveActual();
  const avisos = [];
  if (!unidades().length) avisos.push('No hay ninguna clave cargada: ve a la pestaña <b>Claves</b> y carga el JSON de la semana.');
  if (!estado.alumnos.length) avisos.push('No hay alumnos: ve a la pestaña <b>Alumnos</b> y pega la lista.');
  if (estado.alumnos.length && clave && !ui.verTodos && !L.sinRegistrar(alumnosDelGrupo(ui.grupo), registrosSemana(ui.unidad, ui.semana), ui.semana).length)
    avisos.push(`Ya están registrados todos los alumnos${ui.grupo ? ` de ${esc(ui.grupo)}` : ''} en la semana ${ui.semana} de la unidad ${ui.unidad}. Para corregir o repasar alguno, marca <b>Ver también los ya corregidos</b>.`);
  const regs = clave ? L.resumenSemana(clave, registrosSemana(ui.unidad, ui.semana), estado.alumnos) : [];
  const hechos = new Map(regs.map(r => [r.alumno, r]));
  const delGrupo = alumnosDelGrupo(ui.grupo);
  // Por defecto solo se ofrecen los que faltan; el que se está editando sigue visible.
  const ofrecidos = ui.verTodos ? delGrupo : delGrupo.filter(a => !hechos.has(a.id) || a.id === ui.alumno);
  const quedan = L.sinRegistrar(delGrupo, registrosSemana(ui.unidad, ui.semana), ui.semana).length;
  const listaAlumnos = ofrecidos.map(a => {
    const r = hechos.get(a.id);
    return [a.id, `${a.nombre}${ui.grupo ? '' : ' · ' + a.grupo}${r ? ` · ✓ ${num(r.nota)}` : ''}`];
  });
  $('#app').innerHTML = `
    ${avisos.map(t => `<div class="aviso aviso--atencion">${t}</div>`).join('')}
    <div class="tarjeta">
      <div class="controles">
        <label>Unidad <select id="sel-unidad">${opciones(unidades().map(u => [u, `Unidad ${u}`]), ui.unidad)}</select></label>
        <label>Semana <select id="sel-semana">${opciones(semanasDe(ui.unidad).map(s => [s, `Semana ${s}${claveDe(ui.unidad, s).fecha ? ' · ' + claveDe(ui.unidad, s).fecha : ''}`]), ui.semana)}</select></label>
        <label>Grupo <select id="sel-grupo">${opciones(grupos().map(g => [g, g]), ui.grupo, 'Todos')}</select></label>
        <label>Alumno${quedan ? ` <span class="pequeno suave">(faltan ${quedan})</span>` : ''} <select id="sel-alumno">${opciones(listaAlumnos, ui.alumno, '— elige —')}</select></label>
        <label>Examen (número o código) <input type="text" id="in-codigo" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(ui.codigo)}"></label>
        <span id="info-version" class="pequeno suave"></span>
        <label class="pequeno suave"><input type="checkbox" id="ck-todos" ${ui.verTodos ? 'checked' : ''}> Ver también los ya corregidos</label>
      </div>
      <div class="entrada">
        <input type="text" id="in-resp" autocomplete="off" spellcheck="false" autocapitalize="characters"
          placeholder="Teclea las respuestas en orden: ABBCAD… o UIIOUP… (U I O P = A B C D; «-» en blanco, «?» nula)" value="${esc(ui.resp)}">
        <span class="contador" id="contador"></span>
        <button class="boton" id="btn-guardar">Guardar (Intro)</button>
        <button class="boton-2" id="btn-limpiar">Limpiar</button>
      </div>
      <div id="aviso-corregir"></div>
      <div class="bloques" id="bloques"></div>
      <div class="marcador" id="marcador"></div>
      <p class="pequeno suave" style="margin-top:.8rem">También puedes hacer clic en las casillas. Escribe la respuesta <b>que vale</b>: si el alumno tachó una fila y contestó detrás, teclea la de detrás.</p>
      <label class="pequeno suave">Observaciones (opcional) <input type="text" id="in-obs" style="width:100%" value="${esc(ui.obs)}"></label>
    </div>
    <div class="tarjeta">
      <h3 style="margin-top:0">Registrados en la unidad ${ui.unidad ?? '—'} · semana ${ui.semana ?? '—'}${ui.grupo ? ' · ' + esc(ui.grupo) : ''}</h3>
      <div id="lista-registros"></div>
    </div>`;

  $('#sel-unidad').addEventListener('change', e => {
    ui.unidad = Number(e.target.value);
    guardarUnidad(ui.unidad);
    ui.semana = semanasDe(ui.unidad).at(-1) ?? null;
    limpiarFormulario(true, true);
    renderCorregir();
  });
  $('#sel-semana').addEventListener('change', e => { ui.semana = Number(e.target.value); limpiarFormulario(true, true); renderCorregir(); });
  $('#sel-grupo').addEventListener('change', e => { ui.grupo = e.target.value; limpiarFormulario(true); renderCorregir(); });
  $('#ck-todos').addEventListener('change', e => { ui.verTodos = e.target.checked; renderCorregir('#sel-alumno'); });
  $('#sel-alumno').addEventListener('change', e => { elegirAlumno(e.target.value); });
  $('#in-codigo').addEventListener('input', e => {
    ui.codigo = e.target.value.replace(/\D/g, '').slice(0, 4);
    e.target.value = ui.codigo;
    pintarVersion();
    if (ui.codigo.length === 4 && L.versionDe(clave, ui.codigo)) $('#in-resp').focus();
  });
  $('#in-resp').addEventListener('input', e => {
    ui.resp = L.limpiarTecleo(e.target.value, clave?.n_preguntas ?? 20);
    if (e.target.value !== ui.resp) e.target.value = ui.resp;
    pintarBloques();
  });
  $('#in-codigo').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#in-resp').focus(); } });
  for (const id of ['#in-resp', '#in-obs']) {
    $(id).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); guardarRegistro(); } });
  }
  $('#in-obs').addEventListener('input', e => { ui.obs = e.target.value; });
  $('#btn-guardar').addEventListener('click', guardarRegistro);
  $('#btn-limpiar').addEventListener('click', () => { limpiarFormulario(true, true); renderCorregir('#sel-alumno'); });
  $('#bloques').addEventListener('click', e => {
    const td = e.target.closest('td.celda');
    if (!td) return;
    ui.resp = L.marcar(ui.resp, clave?.n_preguntas ?? 20, Number(td.dataset.q), td.dataset.l);
    $('#in-resp').value = ui.resp;
    pintarBloques();
    $('#in-resp').focus();
  });
  $('#lista-registros').addEventListener('click', e => {
    const b = e.target.closest('button[data-accion]');
    if (!b) return;
    const r = estado.registros[b.dataset.id];
    if (!r) return;
    if (b.dataset.accion === 'editar') {
      if (ui.grupo && alumnoDe(r.alumno)?.grupo !== ui.grupo) ui.grupo = '';
      elegirAlumno(r.alumno);
    } else if (b.dataset.accion === 'borrar') {
      const a = alumnoDe(r.alumno);
      if (confirm(`¿Borrar el registro de ${a?.nombre ?? r.alumno} en la unidad ${r.unidad}, semana ${r.semana}?`)) {
        delete estado.registros[b.dataset.id];
        guardar();
        if (ui.editando === b.dataset.id) limpiarFormulario(true);
        renderCorregir();
      }
    }
  });

  pintarVersion();
  pintarBloques();
  pintarLista(regs);
  if (foco) $(foco)?.focus();
}

/**
 * `todo` suelta también al alumno; `codigo`, el código de la versión.
 * El código se conserva salvo que se pida borrarlo: los exámenes se corrigen
 * ordenados por versión, así que el siguiente alumno suele llevar la misma.
 */
function limpiarFormulario(todo = false, codigo = false) {
  ui.resp = ''; ui.obs = ''; ui.editando = null;
  if (codigo) ui.codigo = '';
  if (todo) ui.alumno = '';
}

/** Al elegir un alumno: si ya tiene registro esta semana, se carga para editarlo. */
function elegirAlumno(id) {
  ui.alumno = id;
  const idReg = L.idRegistro(ui.unidad, ui.semana, id);
  const r = id ? estado.registros[idReg] : null;
  if (r) {
    ui.codigo = r.codigo; ui.resp = r.respuestas.replace(/-+$/, ''); ui.obs = r.obs ?? ''; ui.editando = idReg;
    renderCorregir('#in-resp');
    aviso(`<b>${esc(alumnoDe(id)?.nombre)}</b> ya está registrado esta semana (${L.fechaTexto(r.ts)}). Estás editando ese registro: al guardar se sustituye.`, 'aviso--atencion');
  } else {
    // El código se mantiene de un alumno al siguiente; si ya vale, se va directo a las respuestas.
    ui.resp = ''; ui.obs = ''; ui.editando = null;
    // El indicador verde de al lado del código dice qué versión sigue puesta.
    renderCorregir(L.versionDe(claveActual(), ui.codigo) ? '#in-resp' : '#in-codigo');
  }
}

function pintarVersion() {
  const clave = claveActual();
  const info = $('#info-version');
  if (!clave || !ui.codigo) { info.textContent = ''; info.className = 'pequeno suave'; pintarBloques(); return; }
  const v = L.versionDe(clave, ui.codigo);
  const nombre = clave.rotulo === 'Exam no.' ? 'Examen' : 'Versión';
  const cuales = clave.versiones.length <= 8 ? `: ${clave.versiones.map(x => x.codigo).join(', ')}`
    : ` (hay ${clave.versiones.length}: del ${clave.versiones[0].codigo} al ${clave.versiones.at(-1).codigo})`;
  if (v) { info.textContent = `${nombre} ${v.codigo}${v.extra ? ' (extra)' : ''}${ui.codigo.length < 4 ? ' · Enter para pasar a las respuestas' : ''}`; info.className = 'pequeno'; info.style.color = 'var(--correcto)'; }
  else if (ui.codigo.length === 4 || !clave.versiones.some(x => String(x.codigo).startsWith(ui.codigo))) { info.textContent = `Ese ${nombre.toLowerCase()} no es de la semana ${clave.semana}${cuales}`; info.className = 'pequeno'; info.style.color = 'var(--error)'; }
  else { info.textContent = ''; }
  pintarBloques();
}

function pintarBloques() {
  const clave = claveActual();
  const n = clave?.n_preguntas ?? 20;
  const version = clave ? L.versionDe(clave, ui.codigo) : null;
  const resp = ui.resp;
  const filas = [];
  for (let b = 0; b < Math.ceil(n / POR_BLOQUE); b++) {
    // La cabecera recuerda qué tecla de U I O P es cada opción.
    const tecla = Object.fromEntries(Object.entries(L.POSICIONAL).map(([k, v]) => [v, k]));
    let t = '<table class="bloque"><tr><th>Q</th>'
      + [...L.LETRAS].map(l => `<th>${l}<span class="pequeno suave"> ${tecla[l]}</span></th>`).join('')
      + '</tr>';
    for (let q = b * POR_BLOQUE + 1; q <= Math.min(n, (b + 1) * POR_BLOQUE); q++) {
      const r = resp[q - 1] ?? L.BLANCO;
      const correcta = version?.preguntas[q - 1]?.correcta ?? null;
      const clases = [q - 1 === resp.length ? 'actual' : '', r === L.NULA ? 'nula' : '', version?.anuladas?.includes(q) ? 'anulada' : ''].join(' ');
      t += `<tr class="${clases}"><td class="q">${r === L.NULA ? '?' : q}</td>`;
      for (const l of L.LETRAS) {
        let c = 'celda';
        if (r === l) c += correcta ? (l === correcta ? ' bien' : ' mal') : ' sinclave';
        else if (correcta === l && L.LETRAS.includes(r)) c += ' correcta';
        t += `<td class="${c}" data-q="${q}" data-l="${l}">${r === l ? '×' : ''}</td>`;
      }
      t += '</tr>';
    }
    filas.push(t + '</table>');
  }
  $('#bloques').innerHTML = filas.join('');
  $('#contador').textContent = `${resp.length} / ${n}`;
  const m = $('#marcador');
  if (!version) { m.innerHTML = '<span class="suave">Teclea el número de examen (o el código de la versión) y pulsa Enter para corregir.</span>'; return; }
  const c = L.corregir(version, resp, clave.opciones);
  m.innerHTML = `<span>Aciertos <b>${c.aciertos}</b></span><span>Fallos <b>${c.fallos}</b></span><span>En blanco <b>${c.blancos}</b></span>`
    + (c.nulas ? `<span>Nulas <b>${c.nulas}</b></span>` : '')
    + (c.anuladas ? `<span>Anuladas <b>${c.anuladas}</b></span>` : '')
    + `<span>Puntos <b>${num(c.puntos)}</b> / ${c.sobre}</span><span>Nota <b class="nota">${num(c.nota)}</b></span>`;
}

function pintarLista(regs) {
  const zona = $('#lista-registros');
  const del = ui.grupo ? regs.filter(r => r.grupo === ui.grupo) : regs;
  const total = alumnosDelGrupo(ui.grupo).length;
  if (!del.length) { zona.innerHTML = `<p class="suave">Todavía no hay registros${total ? ` (${total} alumnos)` : ''}.</p>`; return; }
  const filas = del.map(r => `
    <tr${ui.editando === L.idRegistro(r.unidad, r.semana, r.alumno) ? ' class="resaltada"' : ''}>
      <td>${esc(r.nombre)}</td><td>${esc(r.grupo)}</td><td class="mono">${esc(r.codigo)}</td>
      <td class="mono">${esc(r.respuestas)}</td>
      <td class="num">${r.aciertos}</td><td class="num">${r.fallos}</td><td class="num">${r.blancos + r.nulas}</td>
      <td class="num"><b>${num(r.nota)}</b></td>
      <td>${esc(r.obs ?? '')}</td>
      <td class="acciones"><button class="boton-2 mini" data-accion="editar" data-id="${esc(L.idRegistro(r.unidad, r.semana, r.alumno))}">Editar</button>
        <button class="boton-peligro mini" data-accion="borrar" data-id="${esc(L.idRegistro(r.unidad, r.semana, r.alumno))}">Borrar</button></td>
    </tr>`).join('');
  zona.innerHTML = `
    <p class="pequeno suave">${del.length} de ${total} · media ${num(L.media(del.map(r => r.nota)))}</p>
    <table class="lista"><tr><th>Alumno</th><th>Grupo</th><th>Examen</th><th>Respuestas</th><th class="num">Aciertos</th><th class="num">Fallos</th><th class="num">Blanco</th><th class="num">Nota</th><th>Obs.</th><th></th></tr>${filas}</table>`;
}

function guardarRegistro() {
  const clave = claveActual();
  if (!clave) { aviso('No hay clave cargada para esta semana.', 'aviso--error'); return; }
  if (!ui.alumno) { aviso('Elige el alumno.', 'aviso--error'); $('#sel-alumno').focus(); return; }
  const version = L.versionDe(clave, ui.codigo);
  if (!version) { aviso('El código de la versión no es válido.', 'aviso--error'); $('#in-codigo').focus(); return; }
  const n = clave.n_preguntas;
  if (ui.resp.length < n && !confirm(`Solo hay ${ui.resp.length} respuestas de ${n}. ¿Guardar las que faltan como «en blanco»?`)) { $('#in-resp').focus(); return; }
  const id = L.idRegistro(ui.unidad, ui.semana, ui.alumno);
  const a = alumnoDe(ui.alumno);
  const previo = estado.registros[id];
  if (previo && ui.editando !== id && !confirm(`${a?.nombre} ya tiene un registro en la unidad ${ui.unidad}, semana ${ui.semana} (código ${previo.codigo}, respuestas ${previo.respuestas}). ¿Sustituirlo?`)) return;
  const respuestas = L.completar(ui.resp, n);
  estado.registros[id] = { unidad: ui.unidad, semana: ui.semana, alumno: ui.alumno, codigo: version.codigo, respuestas, obs: ui.obs.trim(), ts: Date.now() };
  guardar();
  const c = L.corregir(version, respuestas, clave.opciones);
  limpiarFormulario(true);
  renderCorregir('#sel-alumno');
  aviso(`Guardado: <b>${esc(a?.nombre)}</b> · código ${version.codigo} · ${c.aciertos} aciertos, ${c.fallos} fallos, ${c.blancos + c.nulas} en blanco · nota <b>${num(c.nota)}</b>`, 'aviso--ok');
}

// ---------------------------------------------------------------------------
// Resultados
// ---------------------------------------------------------------------------
function renderResultados() {
  const clave = ui.unidadRes === null || ui.semanaRes === null ? null : claveDe(ui.unidadRes, ui.semanaRes);
  if (!clave) { $('#app').innerHTML = '<div class="aviso aviso--atencion">No hay ninguna clave cargada.</div>'; return; }
  const delExamen = registrosSemana(ui.unidadRes, ui.semanaRes);
  const regs = L.resumenSemana(clave, delExamen, estado.alumnos).filter(r => !ui.grupoRes || r.grupo === ui.grupoRes);
  const sinRegistro = alumnosDelGrupo(ui.grupoRes).filter(a => !regs.some(r => r.alumno === a.id));
  const stats = L.estadisticasPreguntas(clave, delExamen.filter(r => !ui.grupoRes || alumnoDe(r.alumno)?.grupo === ui.grupoRes));

  const filasAlumnos = regs.map(r => `<tr><td>${esc(r.nombre)}</td><td>${esc(r.grupo)}</td><td class="mono">${esc(r.codigo)}</td>
    <td class="num">${r.aciertos}</td><td class="num">${r.fallos}</td><td class="num">${r.blancos + r.nulas}</td><td class="num">${num(r.puntos)}</td><td class="num"><b>${num(r.nota)}</b></td><td>${esc(r.obs ?? '')}</td></tr>`).join('');

  const elegidas = L.opcionesElegidas(clave, stats);
  const filasPreg = stats.map((p, i) => {
    const { variantes, masElegido: m } = elegidas[i];
    const tablas = variantes.map(v => {
      const max = Math.max(0, ...v.opciones.filter(o => !o.correcta).map(o => o.cuenta));
      const filas = v.opciones.map(o => `<tr class="${o.correcta ? 'ok' : o.cuenta && o.cuenta === max ? 'fuerte' : ''}">
        <td>${esc(L.aPlano(o.texto))}</td><td class="num">${o.cuenta}</td>
        <td><div class="barra"><div style="width:${v.n ? 100 * o.cuenta / v.n : 0}%"></div></div></td>
        <td class="expl">${esc(L.aPlano(o.expl))}</td></tr>`).join('');
      const otras = [v.blancos ? `en blanco ${v.blancos}` : '', v.nulas ? `nulas ${v.nulas}` : ''].filter(Boolean).join(' · ');
      const quien = v.codigos.length === 1 && v.codigos[0] === v.nombre ? `versión <span class="mono">${esc(v.nombre)}</span>`
        : `variante <span class="mono">${esc(v.nombre)}</span> · ${v.codigos.length === 1 ? 'examen' : 'exámenes'} ${esc(v.codigos.join(', '))}`;
      return `<table class="opciones"><caption>${quien} · ${v.n} alumnos · ${esc(L.aPlano(v.enunciado))}</caption>
        ${filas}${otras ? `<tr><td colspan="4" class="suave pequeno">${otras}</td></tr>` : ''}</table>`;
    }).join('');
    const error = m ? `<span title="${esc(L.aPlano(m.expl))}"><b>${m.cuenta}</b> · <span class="mono">${esc(m.nombre)}</span> ${esc(L.aPlano(m.texto))}</span>` : '';
    return `<tr><td class="num">${p.pos}</td><td class="mono">${esc(p.item)}</td><td class="num">${p.n}</td>
      <td><div class="barra"><div style="width:${p.n ? 100 * p.aciertos / p.n : 0}%"></div></div></td>
      <td class="num">${pct(p.aciertos, p.n)}</td><td class="num">${pct(p.fallos, p.n)}</td><td class="num">${pct(p.blancos, p.n)}</td>
      <td class="pequeno">${error}</td>
      <td><details><summary>respuestas</summary>${tablas}</details></td></tr>`;
  }).join('');

  $('#app').innerHTML = `
    <div class="tarjeta">
      <div class="controles">
        <label>Unidad <select id="sel-unidad-res">${opciones(unidades().map(u => [u, `Unidad ${u}`]), ui.unidadRes)}</select></label>
        <label>Semana <select id="sel-semana-res">${opciones(semanasDe(ui.unidadRes).map(s => [s, `Semana ${s}${claveDe(ui.unidadRes, s).fecha ? ' · ' + claveDe(ui.unidadRes, s).fecha : ''}`]), ui.semanaRes)}</select></label>
        <label>Grupo <select id="sel-grupo-res">${opciones(grupos().map(g => [g, g]), ui.grupoRes, 'Todos')}</select></label>
      </div>
      <h3>Notas</h3>
      <p class="pequeno suave">${regs.length} registros · media <b>${num(L.media(regs.map(r => r.nota)))}</b>${sinRegistro.length ? ` · sin registro: ${esc(sinRegistro.map(a => a.nombre).join(', '))}` : ''}</p>
      ${regs.length ? `<table class="lista"><tr><th>Alumno</th><th>Grupo</th><th>Examen</th><th class="num">Aciertos</th><th class="num">Fallos</th><th class="num">Blanco</th><th class="num">Puntos</th><th class="num">Nota</th><th>Obs.</th></tr>${filasAlumnos}</table>` : ''}
      <h3>Por pregunta (destreza)</h3>
      <p class="pequeno suave">Cada posición es la misma destreza en todos los exámenes; el número impreso cambia de un examen a otro. <b>Respuestas</b> despliega, variante a variante (a, b, c, d; e y f son las de los exámenes extra), cuántos eligieron cada opción y de qué error sale: en verde la correcta, en negrita el distractor más elegido. Las opciones se cuentan por su texto, porque la letra cambia de un examen a otro. <b>Error más elegido</b> es el distractor con más votos de una sola variante (pasa el ratón para ver la explicación): las variantes no se suman porque cada una lleva sus números.</p>
      <table class="lista"><tr><th class="num">Pos.</th><th>Destreza</th><th class="num">N</th><th></th><th class="num">Acierto</th><th class="num">Fallo</th><th class="num">Blanco</th><th>Error más elegido</th><th></th></tr>${filasPreg}</table>
    </div>
    <div class="tarjeta">
      <h3 style="margin-top:0">Ficha de un alumno (todas las semanas)</h3>
      <div class="controles"><label>Alumno <select id="sel-alumno-res">${opciones(L.ordenarAlumnos(estado.alumnos).map(a => [a.id, `${a.nombre} · ${a.grupo}`]), ui.alumnoRes, '— elige —')}</select></label></div>
      <div id="ficha">${ui.alumnoRes ? htmlFicha(ui.alumnoRes) : ''}</div>
    </div>`;
  $('#sel-unidad-res').addEventListener('change', e => {
    ui.unidadRes = Number(e.target.value);
    guardarUnidad(ui.unidadRes);
    ui.semanaRes = semanasDe(ui.unidadRes).at(-1) ?? null;
    renderResultados();
  });
  $('#sel-semana-res').addEventListener('change', e => { ui.semanaRes = Number(e.target.value); renderResultados(); });
  $('#sel-grupo-res').addEventListener('change', e => { ui.grupoRes = e.target.value; renderResultados(); });
  $('#sel-alumno-res').addEventListener('change', e => { ui.alumnoRes = e.target.value; $('#ficha').innerHTML = ui.alumnoRes ? htmlFicha(ui.alumnoRes) : ''; });
}

function htmlFicha(id) {
  const ficha = L.fichaAlumno(estado.claves, registros(), id);
  if (!ficha.length) return '<p class="suave">Sin registros.</p>';
  const resumen = `<table class="lista"><tr><th>Unidad</th><th>Semana</th><th>Fecha</th><th>Examen</th><th class="num">Aciertos</th><th class="num">Fallos</th><th class="num">Blanco</th><th class="num">Nota</th><th>Obs.</th></tr>
    ${ficha.map(s => `<tr><td>${s.unidad}</td><td>${s.semana}</td><td>${esc(s.fecha)}</td><td class="mono">${esc(s.codigo)}</td><td class="num">${s.aciertos}</td><td class="num">${s.fallos}</td><td class="num">${s.blancos + s.nulas}</td><td class="num"><b>${num(s.nota)}</b></td><td>${esc(s.obs)}</td></tr>`).join('')}</table>`;
  const detalle = ficha.map(s => `
    <h3>Unidad ${s.unidad} · semana ${s.semana} · código ${esc(s.codigo)} · nota ${num(s.nota)}</h3>
    <table class="lista"><tr><th class="num">Nº</th><th>Destreza</th><th>Pregunta</th><th>Resp.</th><th>Correcta</th><th>Resultado</th><th>Qué error lleva a esa opción</th></tr>
    ${s.preguntas.map(p => `<tr><td class="num">${p.n}</td><td class="mono">${esc(p.item)}</td><td>${esc(L.aPlano(p.enunciado))}</td>
      <td class="mono">${esc(p.respuesta)}${p.elegida ? ' · ' + esc(L.aPlano(p.elegida.texto)) : ''}</td>
      <td class="mono">${p.correcta}${p.buena ? ' · ' + esc(L.aPlano(p.buena.texto)) : ''}</td>
      <td style="color:${p.estado === 'acierto' ? 'var(--correcto)' : p.estado === 'fallo' ? 'var(--error)' : 'var(--texto-suave)'}">${p.estado}</td>
      <td class="expl">${p.estado === 'fallo' && p.elegida?.expl ? esc(L.aPlano(p.elegida.expl)) : ''}</td></tr>`).join('')}</table>`).join('');
  return resumen + detalle;
}

// ---------------------------------------------------------------------------
// Alumnos
// ---------------------------------------------------------------------------
function renderAlumnos() {
  const cuenta = id => registros().filter(r => r.alumno === id).length;
  const filas = L.ordenarAlumnos(estado.alumnos).map(a => `<tr><td>${esc(a.nombre)}</td><td class="mono">${esc(a.id)}</td><td>${esc(a.grupo)}</td><td class="num">${cuenta(a.id)}</td>
    <td><button class="boton-peligro mini" data-id="${esc(a.id)}">Borrar</button></td></tr>`).join('');
  $('#app').innerHTML = `
    <div class="tarjeta">
      <h2>Añadir alumnos</h2>
      <p class="pequeno suave">Una línea por alumno, con el mismo formato que el alta por lotes de la app: <code>Nombre Apellidos; Grupo</code> o <code>Nombre Apellidos; usuario o email; Grupo</code>. Sin usuario, el identificador se forma como en la app («maria.garcia»); pon el mismo usuario o email que tienen en la app para poder cruzar los datos.</p>
      <textarea id="ta-alumnos" placeholder="María García López; 1ºA&#10;Juan Pérez Ruiz; juan.perez; 1ºC/D"></textarea>
      <div style="margin-top:.5rem"><button class="boton" id="btn-anadir">Añadir</button></div>
      <div id="aviso-alumnos"></div>
    </div>
    <div class="tarjeta" id="zona-alumnos">
      <h2>Alumnos (${estado.alumnos.length})</h2>
      ${estado.alumnos.length ? `<table class="lista"><tr><th>Nombre</th><th>Identificador</th><th>Grupo</th><th class="num">Registros</th><th></th></tr>${filas}</table>` : '<p class="suave">Ninguno todavía.</p>'}
    </div>`;
  $('#btn-anadir').addEventListener('click', () => {
    const { alumnos, errores } = L.analizarAlumnos($('#ta-alumnos').value, estado.alumnos);
    if (errores.length) { $('#aviso-alumnos').innerHTML = `<div class="aviso aviso--error">${errores.map(esc).join('<br>')}</div>`; return; }
    if (!alumnos.length) return;
    estado.alumnos.push(...alumnos);
    guardar();
    renderAlumnos();
    $('#aviso-alumnos').innerHTML = `<div class="aviso aviso--ok">Añadidos ${alumnos.length} alumnos.</div>`;
  });
  $('#zona-alumnos').addEventListener('click', e => {
    const b = e.target.closest('button[data-id]');
    if (!b) return;
    const a = alumnoDe(b.dataset.id);
    const n = cuenta(a.id);
    if (!confirm(`¿Borrar a ${a.nombre}${n ? ` y sus ${n} registros` : ''}?`)) return;
    estado.alumnos = estado.alumnos.filter(x => x.id !== a.id);
    for (const [k, r] of Object.entries(estado.registros)) if (r.alumno === a.id) delete estado.registros[k];
    guardar();
    renderAlumnos();
  });
}

// ---------------------------------------------------------------------------
// Claves
// ---------------------------------------------------------------------------
function renderClaves() {
  const lista = Object.values(estado.claves).sort((a, b) => a.unidad - b.unidad || a.semana - b.semana);
  const filas = lista.map(c => {
    const k = L.idClave(c.unidad, c.semana);
    const n = registrosSemana(c.unidad, c.semana).length;
    const normales = c.versiones.filter(v => !v.extra), extra = c.versiones.filter(v => v.extra);
    const cuales = c.versiones.length <= 8 ? c.versiones.map(v => v.codigo + (v.extra ? ' (extra)' : '')).join(', ')
      : `${normales.length} exámenes (${normales[0].codigo}–${normales.at(-1).codigo})${extra.length ? ` + extra ${extra.map(v => v.codigo).join(', ')}` : ''}`;
    return `<tr><td>${c.unidad}</td><td>${c.semana}</td><td>${esc(c.fecha ?? '')}</td><td class="mono">${cuales}</td>
      <td class="num">${c.n_preguntas}</td><td class="mono">${esc(L.textoAnuladas(c)) || '—'}</td><td class="num">${n}</td>
      <td class="acciones"><button class="boton-2 mini" data-anular="${esc(k)}">Anular…</button>
        <button class="boton-peligro mini" data-borrar="${esc(k)}">Borrar</button></td></tr>`;
  }).join('');
  $('#app').innerHTML = `
    <div class="tarjeta">
      <h2>Cargar la clave de una semana</h2>
      <p class="pequeno suave">El archivo <code>clave-semanaN.json</code> lo produce <code>comun/exportar_clave.py</code> en la carpeta de los exámenes (<code>python3 comun/exportar_clave.py semana-N</code>). Se pueden elegir varios a la vez.</p>
      <input type="file" id="in-claves" accept=".json,application/json" multiple>
      <div id="aviso-claves"></div>
    </div>
    <div class="tarjeta" id="zona-claves">
      <h2>Claves cargadas</h2>
      ${lista.length ? `<table class="lista"><tr><th>Unidad</th><th>Semana</th><th>Examen</th><th>Versiones</th><th class="num">Preguntas</th><th>Anuladas</th><th class="num">Registros</th><th></th></tr>${filas}</table>
        <p class="pequeno suave"><b>Anular…</b> quita preguntas de la nota: <code>código:número</code>, separadas por comas (<code>8930:10, 4816:9</code>). Solo se anulan a quien no las acertó: quien acertó conserva su punto; a los demás la pregunta deja de contar y la nota se calcula sobre una pregunta menos.</p>` : '<p class="suave">Ninguna todavía.</p>'}
    </div>`;
  $('#in-claves').addEventListener('change', async e => {
    const mensajes = [];
    for (const f of e.target.files) {
      try {
        const clave = JSON.parse(await f.text());
        const error = L.comprobarClave(clave);
        if (error) { mensajes.push(`${f.name}: ${error}`); continue; }
        const previa = claveDe(clave.unidad, clave.semana);
        if (previa && !confirm(`Ya hay una clave de la unidad ${clave.unidad}, semana ${clave.semana}. ¿Sustituirla? (los registros y las preguntas anuladas se conservan)`)) continue;
        // Las anuladas se deciden aquí, no en el exportador: que no se pierdan al recargar.
        for (const v of clave.versiones) {
          const antes = L.versionDe(previa, v.codigo)?.anuladas;
          if (antes?.length && v.anuladas === undefined) v.anuladas = antes;
        }
        estado.claves[L.idClave(clave.unidad, clave.semana)] = clave;
        mensajes.push(`${f.name}: unidad ${clave.unidad}, semana ${clave.semana} cargada (${clave.versiones.length} versiones).`);
      } catch (err) { mensajes.push(`${f.name}: ${err.message}`); }
    }
    guardar();
    renderClaves();
    $('#aviso-claves').innerHTML = `<div class="aviso">${mensajes.map(esc).join('<br>')}</div>`;
  });
  $('#zona-claves').addEventListener('click', e => {
    const an = e.target.closest('button[data-anular]');
    if (an) {
      const c = estado.claves[an.dataset.anular];
      const texto = prompt(`Preguntas anuladas de la unidad ${c.unidad}, semana ${c.semana}, como código:número separadas por comas (vacío = ninguna).\nVersiones: ${c.versiones.map(v => v.codigo).join(', ')}`, L.textoAnuladas(c));
      if (texto === null) return;
      const { anuladas, error } = L.analizarAnuladas(texto, c);
      if (error) { alert(error); return; }
      for (const v of c.versiones) { if (anuladas[v.codigo]) v.anuladas = anuladas[v.codigo]; else delete v.anuladas; }
      guardar();
      renderClaves();
      return;
    }
    const b = e.target.closest('button[data-borrar]');
    if (!b) return;
    const c = estado.claves[b.dataset.borrar];
    const n = registrosSemana(c.unidad, c.semana).length;
    if (!confirm(`¿Borrar la clave de la unidad ${c.unidad}, semana ${c.semana}${n ? ` y sus ${n} registros` : ''}?`)) return;
    delete estado.claves[b.dataset.borrar];
    for (const [k, r] of Object.entries(estado.registros)) if (r.unidad === c.unidad && r.semana === c.semana) delete estado.registros[k];
    guardar();
    renderClaves();
  });
}

// ---------------------------------------------------------------------------
// Datos: exportar, copia de seguridad, restaurar
// ---------------------------------------------------------------------------
function renderDatos() {
  const nReg = registros().length;
  $('#app').innerHTML = `
    <div class="tarjeta">
      <h2>Exportar</h2>
      <p class="pequeno suave">CSV con «;» y coma decimal, para abrirlo con Excel o Numbers. Todas las semanas.</p>
      <div class="acciones"><button class="boton" id="btn-csv-resumen">CSV resumen (una fila por alumno y semana)</button>
      <button class="boton" id="btn-csv-detalle">CSV detalle (una fila por respuesta)</button></div>
    </div>
    <div class="tarjeta">
      <h2>Copia de seguridad</h2>
      <p class="pequeno suave">Los datos están solo en este navegador de este ordenador (${estado.alumnos.length} alumnos, ${Object.keys(estado.claves).length} claves, ${nReg} registros). Guarda una copia después de cada sesión de corrección; con ella se restaura todo en otro navegador.</p>
      <div class="acciones"><button class="boton" id="btn-copia">Descargar copia (JSON)</button></div>
      <h3>Restaurar una copia</h3>
      <p class="pequeno suave">Sustituye todo lo que hay ahora por el contenido de la copia.</p>
      <input type="file" id="in-copia" accept=".json,application/json">
      <div id="aviso-datos"></div>
    </div>
    <div class="tarjeta">
      <h2>Borrar todo</h2>
      <button class="boton-peligro" id="btn-borrar-todo">Borrar alumnos, claves y registros</button>
    </div>`;
  $('#btn-csv-resumen').addEventListener('click', () => descargar(`examenes-resumen-${fechaArchivo()}.csv`, L.csvResumen(estado.claves, registros(), estado.alumnos)));
  $('#btn-csv-detalle').addEventListener('click', () => descargar(`examenes-detalle-${fechaArchivo()}.csv`, L.csvDetalle(estado.claves, registros(), estado.alumnos)));
  $('#btn-copia').addEventListener('click', () => descargar(`corrector-copia-${fechaArchivo()}.json`, JSON.stringify(estado), 'application/json'));
  $('#in-copia').addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const bruto = JSON.parse(await f.text());
      if (!bruto || !Array.isArray(bruto.alumnos) || typeof bruto.claves !== 'object' || typeof bruto.registros !== 'object') throw new Error('no es una copia del corrector');
      const dato = L.migrar(bruto); // admite copias de antes de haber unidades
      for (const c of Object.values(dato.claves)) { const err = L.comprobarClave(c); if (err) throw new Error(err); }
      const n = Object.keys(dato.registros).length;
      if (!confirm(`La copia tiene ${dato.alumnos.length} alumnos, ${Object.keys(dato.claves).length} claves y ${n} registros. ¿Sustituir todo lo actual?`)) return;
      estado = dato;
      guardar();
      renderDatos();
      $('#aviso-datos').innerHTML = '<div class="aviso aviso--ok">Copia restaurada.</div>';
    } catch (err) { $('#aviso-datos').innerHTML = `<div class="aviso aviso--error">No se ha podido restaurar: ${esc(err.message)}</div>`; }
  });
  $('#btn-borrar-todo').addEventListener('click', () => {
    if (!confirm('¿Borrar todos los datos del corrector en este navegador? Si no tienes copia, se pierden.')) return;
    if (!confirm('¿Seguro?')) return;
    estado = vacio();
    guardar();
    renderDatos();
  });
}

render();
cargarDatosIniciales();
