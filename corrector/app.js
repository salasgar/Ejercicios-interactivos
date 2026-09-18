// Corrector de los exámenes semanales: interfaz. La lógica está en logica.js.
//
// Los datos (alumnos, claves y registros) viven en localStorage de este navegador;
// la pestaña «Datos» los exporta a CSV y a una copia de seguridad JSON que se puede
// restaurar en otro navegador. Nada sale del ordenador.

import * as L from './logica.js';

const ALMACEN = 'corrector-examenes-v1';
const POR_BLOQUE = 4; // filas por tabla de respuestas, como en la franja del examen

let estado = cargar();
const ui = { pestana: 'corregir', semana: null, grupo: '', alumno: '', codigo: '', resp: '', obs: '', editando: null, verTodos: false, semanaRes: null, grupoRes: '', alumnoRes: '' };

// ---------------------------------------------------------------------------
// Almacenamiento
// ---------------------------------------------------------------------------
function vacio() { return { alumnos: [], claves: {}, registros: {}, ajustes: { posicional: false } }; }

function cargar() {
  try {
    const dato = JSON.parse(localStorage.getItem(ALMACEN) ?? 'null');
    // Las copias anteriores no traen `ajustes`: se completan con los valores por defecto.
    if (dato && Array.isArray(dato.alumnos) && dato.claves && dato.registros) return { ...vacio(), ...dato };
  } catch (e) { console.error(e); }
  return vacio();
}

function guardar() {
  try { localStorage.setItem(ALMACEN, JSON.stringify(estado)); } catch (e) { alert('No se ha podido guardar en el navegador: ' + e.message); }
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = x => (x === null || x === undefined ? '' : x.toLocaleString('es-ES', { maximumFractionDigits: 2 }));
const pct = (a, n) => (n ? Math.round(100 * a / n) + ' %' : '');
const semanas = () => Object.keys(estado.claves).map(Number).sort((a, b) => a - b);
const grupos = () => [...new Set(estado.alumnos.map(a => a.grupo))].sort((a, b) => a.localeCompare(b, 'es'));
const registros = () => Object.values(estado.registros);
const registrosSemana = semana => registros().filter(r => r.semana === semana);
const alumnoDe = id => estado.alumnos.find(a => a.id === id);
const claveActual = () => (ui.semana === null ? null : estado.claves[ui.semana] ?? null);
const posicional = () => !!estado.ajustes?.posicional;

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
  if (ui.semana === null || !estado.claves[ui.semana]) ui.semana = semanas().at(-1) ?? null;
  if (ui.semanaRes === null || !estado.claves[ui.semanaRes]) ui.semanaRes = ui.semana;
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
  if (!semanas().length) avisos.push('No hay ninguna clave cargada: ve a la pestaña <b>Claves</b> y carga el JSON de la semana.');
  if (!estado.alumnos.length) avisos.push('No hay alumnos: ve a la pestaña <b>Alumnos</b> y pega la lista.');
  if (estado.alumnos.length && clave && !ui.verTodos && !L.sinRegistrar(alumnosDelGrupo(ui.grupo), registrosSemana(ui.semana), ui.semana).length)
    avisos.push(`Ya están registrados todos los alumnos${ui.grupo ? ` de ${esc(ui.grupo)}` : ''} en la semana ${ui.semana}. Para corregir o repasar alguno, marca <b>Ver también los ya corregidos</b>.`);
  const regs = clave ? L.resumenSemana(clave, registrosSemana(ui.semana), estado.alumnos) : [];
  const hechos = new Map(regs.map(r => [r.alumno, r]));
  const delGrupo = alumnosDelGrupo(ui.grupo);
  // Por defecto solo se ofrecen los que faltan; el que se está editando sigue visible.
  const ofrecidos = ui.verTodos ? delGrupo : delGrupo.filter(a => !hechos.has(a.id) || a.id === ui.alumno);
  const quedan = L.sinRegistrar(delGrupo, registrosSemana(ui.semana), ui.semana).length;
  const listaAlumnos = ofrecidos.map(a => {
    const r = hechos.get(a.id);
    return [a.id, `${a.nombre}${ui.grupo ? '' : ' · ' + a.grupo}${r ? ` · ✓ ${num(r.nota)}` : ''}`];
  });
  $('#app').innerHTML = `
    ${avisos.map(t => `<div class="aviso aviso--atencion">${t}</div>`).join('')}
    <div class="tarjeta">
      <div class="controles">
        <label>Semana <select id="sel-semana">${opciones(semanas().map(s => [s, `Semana ${s}${estado.claves[s].fecha ? ' · ' + estado.claves[s].fecha : ''}`]), ui.semana)}</select></label>
        <label>Grupo <select id="sel-grupo">${opciones(grupos().map(g => [g, g]), ui.grupo, 'Todos')}</select></label>
        <label>Alumno${quedan ? ` <span class="pequeno suave">(faltan ${quedan})</span>` : ''} <select id="sel-alumno">${opciones(listaAlumnos, ui.alumno, '— elige —')}</select></label>
        <label>Código de la versión <input type="text" id="in-codigo" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(ui.codigo)}"></label>
        <span id="info-version" class="pequeno suave"></span>
        <label class="pequeno suave"><input type="checkbox" id="ck-todos" ${ui.verTodos ? 'checked' : ''}> Ver también los ya corregidos</label>
        <label class="pequeno suave"><input type="checkbox" id="ck-posicional" ${posicional() ? 'checked' : ''}> Teclado posicional (U I O P = A B C D)</label>
      </div>
      <div class="entrada">
        <input type="text" id="in-resp" autocomplete="off" spellcheck="false" autocapitalize="characters"
          placeholder="${posicional()
            ? 'Teclea con U I O P (= A B C D), en orden: UIIOUP…   («-» en blanco, «?» nula)'
            : 'Teclea las respuestas en orden: ABBCAD…   («-» en blanco, «?» nula)'}" value="${esc(ui.resp)}">
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
      <h3 style="margin-top:0">Registrados en la semana ${ui.semana ?? '—'}${ui.grupo ? ' · ' + esc(ui.grupo) : ''}</h3>
      <div id="lista-registros"></div>
    </div>`;

  $('#sel-semana').addEventListener('change', e => { ui.semana = Number(e.target.value); limpiarFormulario(true, true); renderCorregir(); });
  $('#sel-grupo').addEventListener('change', e => { ui.grupo = e.target.value; limpiarFormulario(true); renderCorregir(); });
  $('#ck-todos').addEventListener('change', e => { ui.verTodos = e.target.checked; renderCorregir('#sel-alumno'); });
  $('#ck-posicional').addEventListener('change', e => {
    estado.ajustes = { ...estado.ajustes, posicional: e.target.checked };
    guardar();                       // el modo se recuerda de una sesión a otra
    renderCorregir('#in-resp');
  });
  $('#sel-alumno').addEventListener('change', e => { elegirAlumno(e.target.value); });
  $('#in-codigo').addEventListener('input', e => {
    ui.codigo = e.target.value.replace(/\D/g, '').slice(0, 4);
    e.target.value = ui.codigo;
    pintarVersion();
    if (ui.codigo.length === 4 && L.versionDe(clave, ui.codigo)) $('#in-resp').focus();
  });
  $('#in-resp').addEventListener('input', e => {
    ui.resp = L.limpiarTecleo(e.target.value, clave?.n_preguntas ?? 20, posicional());
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
      if (confirm(`¿Borrar el registro de ${a?.nombre ?? r.alumno} en la semana ${r.semana}?`)) {
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
  const idReg = L.idRegistro(ui.semana, id);
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
  if (v) { info.textContent = `Versión ${v.codigo}${v.extra ? ' (extra)' : ''}`; info.className = 'pequeno'; info.style.color = 'var(--correcto)'; }
  else if (ui.codigo.length === 4) { info.textContent = `Ese código no es de la semana ${clave.semana}: ${clave.versiones.map(x => x.codigo).join(', ')}`; info.className = 'pequeno'; info.style.color = 'var(--error)'; }
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
    // Con el teclado posicional, la cabecera recuerda qué tecla es cada opción.
    const tecla = Object.fromEntries(Object.entries(L.POSICIONAL).map(([k, v]) => [v, k]));
    let t = '<table class="bloque"><tr><th>Q</th>'
      + [...L.LETRAS].map(l => `<th>${l}${posicional() ? `<span class="pequeno suave"> ${tecla[l]}</span>` : ''}</th>`).join('')
      + '</tr>';
    for (let q = b * POR_BLOQUE + 1; q <= Math.min(n, (b + 1) * POR_BLOQUE); q++) {
      const r = resp[q - 1] ?? L.BLANCO;
      const correcta = version?.preguntas[q - 1]?.correcta ?? null;
      const clases = [q - 1 === resp.length ? 'actual' : '', r === L.NULA ? 'nula' : ''].join(' ');
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
  if (!version) { m.innerHTML = '<span class="suave">Teclea el código de la versión (4 cifras) para corregir.</span>'; return; }
  const c = L.corregir(version, resp, clave.opciones);
  m.innerHTML = `<span>Aciertos <b>${c.aciertos}</b></span><span>Fallos <b>${c.fallos}</b></span><span>En blanco <b>${c.blancos}</b></span>`
    + (c.nulas ? `<span>Nulas <b>${c.nulas}</b></span>` : '')
    + `<span>Puntos <b>${num(c.puntos)}</b> / ${n}</span><span>Nota <b class="nota">${num(c.nota)}</b></span>`;
}

function pintarLista(regs) {
  const zona = $('#lista-registros');
  const del = ui.grupo ? regs.filter(r => r.grupo === ui.grupo) : regs;
  const total = alumnosDelGrupo(ui.grupo).length;
  if (!del.length) { zona.innerHTML = `<p class="suave">Todavía no hay registros${total ? ` (${total} alumnos)` : ''}.</p>`; return; }
  const filas = del.map(r => `
    <tr${ui.editando === L.idRegistro(r.semana, r.alumno) ? ' class="resaltada"' : ''}>
      <td>${esc(r.nombre)}</td><td>${esc(r.grupo)}</td><td class="mono">${esc(r.codigo)}</td>
      <td class="mono">${esc(r.respuestas)}</td>
      <td class="num">${r.aciertos}</td><td class="num">${r.fallos}</td><td class="num">${r.blancos + r.nulas}</td>
      <td class="num"><b>${num(r.nota)}</b></td>
      <td>${esc(r.obs ?? '')}</td>
      <td class="acciones"><button class="boton-2 mini" data-accion="editar" data-id="${esc(L.idRegistro(r.semana, r.alumno))}">Editar</button>
        <button class="boton-peligro mini" data-accion="borrar" data-id="${esc(L.idRegistro(r.semana, r.alumno))}">Borrar</button></td>
    </tr>`).join('');
  zona.innerHTML = `
    <p class="pequeno suave">${del.length} de ${total} · media ${num(L.media(del.map(r => r.nota)))}</p>
    <table class="lista"><tr><th>Alumno</th><th>Grupo</th><th>Código</th><th>Respuestas</th><th class="num">Aciertos</th><th class="num">Fallos</th><th class="num">Blanco</th><th class="num">Nota</th><th>Obs.</th><th></th></tr>${filas}</table>`;
}

function guardarRegistro() {
  const clave = claveActual();
  if (!clave) { aviso('No hay clave cargada para esta semana.', 'aviso--error'); return; }
  if (!ui.alumno) { aviso('Elige el alumno.', 'aviso--error'); $('#sel-alumno').focus(); return; }
  const version = L.versionDe(clave, ui.codigo);
  if (!version) { aviso('El código de la versión no es válido.', 'aviso--error'); $('#in-codigo').focus(); return; }
  const n = clave.n_preguntas;
  if (ui.resp.length < n && !confirm(`Solo hay ${ui.resp.length} respuestas de ${n}. ¿Guardar las que faltan como «en blanco»?`)) { $('#in-resp').focus(); return; }
  const id = L.idRegistro(ui.semana, ui.alumno);
  const a = alumnoDe(ui.alumno);
  const previo = estado.registros[id];
  if (previo && ui.editando !== id && !confirm(`${a?.nombre} ya tiene un registro en la semana ${ui.semana} (código ${previo.codigo}, respuestas ${previo.respuestas}). ¿Sustituirlo?`)) return;
  const respuestas = L.completar(ui.resp, n);
  estado.registros[id] = { semana: ui.semana, alumno: ui.alumno, codigo: version.codigo, respuestas, obs: ui.obs.trim(), ts: Date.now() };
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
  const clave = ui.semanaRes === null ? null : estado.claves[ui.semanaRes];
  if (!clave) { $('#app').innerHTML = '<div class="aviso aviso--atencion">No hay ninguna clave cargada.</div>'; return; }
  const regs = L.resumenSemana(clave, registrosSemana(ui.semanaRes), estado.alumnos).filter(r => !ui.grupoRes || r.grupo === ui.grupoRes);
  const sinRegistro = alumnosDelGrupo(ui.grupoRes).filter(a => !regs.some(r => r.alumno === a.id));
  const stats = L.estadisticasPreguntas(clave, registrosSemana(ui.semanaRes).filter(r => !ui.grupoRes || alumnoDe(r.alumno)?.grupo === ui.grupoRes));

  const filasAlumnos = regs.map(r => `<tr><td>${esc(r.nombre)}</td><td>${esc(r.grupo)}</td><td class="mono">${esc(r.codigo)}</td>
    <td class="num">${r.aciertos}</td><td class="num">${r.fallos}</td><td class="num">${r.blancos + r.nulas}</td><td class="num">${num(r.puntos)}</td><td class="num"><b>${num(r.nota)}</b></td><td>${esc(r.obs ?? '')}</td></tr>`).join('');

  const filasPreg = stats.map(p => {
    const versiones = Object.entries(p.versiones).map(([cod, v]) => {
      const letras = Object.entries(v.letras).map(([l, k]) => `<span class="${l === v.correcta ? 'ok' : ''}">${l} ${k}</span>`).join('');
      const pregunta = clave.versiones.find(x => x.codigo === cod)?.preguntas[v.numero - 1];
      return `<div class="letras" title="${esc(L.aPlano(pregunta?.enunciado))}"><span class="mono">${esc(cod)}</span> nº ${v.numero} · ${pct(v.aciertos, v.n)}: ${letras}</div>`;
    }).join('');
    return `<tr><td class="num">${p.pos}</td><td class="mono">${esc(p.item)}</td><td class="num">${p.n}</td>
      <td><div class="barra"><div style="width:${p.n ? 100 * p.aciertos / p.n : 0}%"></div></div></td>
      <td class="num">${pct(p.aciertos, p.n)}</td><td class="num">${pct(p.fallos, p.n)}</td><td class="num">${pct(p.blancos, p.n)}</td>
      <td><details><summary>por versión</summary>${versiones}</details></td></tr>`;
  }).join('');

  $('#app').innerHTML = `
    <div class="tarjeta">
      <div class="controles">
        <label>Semana <select id="sel-semana-res">${opciones(semanas().map(s => [s, `Semana ${s}${estado.claves[s].fecha ? ' · ' + estado.claves[s].fecha : ''}`]), ui.semanaRes)}</select></label>
        <label>Grupo <select id="sel-grupo-res">${opciones(grupos().map(g => [g, g]), ui.grupoRes, 'Todos')}</select></label>
      </div>
      <h3>Notas</h3>
      <p class="pequeno suave">${regs.length} registros · media <b>${num(L.media(regs.map(r => r.nota)))}</b>${sinRegistro.length ? ` · sin registro: ${esc(sinRegistro.map(a => a.nombre).join(', '))}` : ''}</p>
      ${regs.length ? `<table class="lista"><tr><th>Alumno</th><th>Grupo</th><th>Código</th><th class="num">Aciertos</th><th class="num">Fallos</th><th class="num">Blanco</th><th class="num">Puntos</th><th class="num">Nota</th><th>Obs.</th></tr>${filasAlumnos}</table>` : ''}
      <h3>Por pregunta (destreza)</h3>
      <p class="pequeno suave">Cada posición es la misma destreza en todas las versiones; el número impreso cambia de una versión a otra. En verde, la letra correcta de cada versión.</p>
      <table class="lista"><tr><th class="num">Pos.</th><th>Destreza</th><th class="num">N</th><th></th><th class="num">Acierto</th><th class="num">Fallo</th><th class="num">Blanco</th><th></th></tr>${filasPreg}</table>
    </div>
    <div class="tarjeta">
      <h3 style="margin-top:0">Ficha de un alumno (todas las semanas)</h3>
      <div class="controles"><label>Alumno <select id="sel-alumno-res">${opciones(L.ordenarAlumnos(estado.alumnos).map(a => [a.id, `${a.nombre} · ${a.grupo}`]), ui.alumnoRes, '— elige —')}</select></label></div>
      <div id="ficha">${ui.alumnoRes ? htmlFicha(ui.alumnoRes) : ''}</div>
    </div>`;
  $('#sel-semana-res').addEventListener('change', e => { ui.semanaRes = Number(e.target.value); renderResultados(); });
  $('#sel-grupo-res').addEventListener('change', e => { ui.grupoRes = e.target.value; renderResultados(); });
  $('#sel-alumno-res').addEventListener('change', e => { ui.alumnoRes = e.target.value; $('#ficha').innerHTML = ui.alumnoRes ? htmlFicha(ui.alumnoRes) : ''; });
}

function htmlFicha(id) {
  const ficha = L.fichaAlumno(estado.claves, registros(), id);
  if (!ficha.length) return '<p class="suave">Sin registros.</p>';
  const resumen = `<table class="lista"><tr><th>Semana</th><th>Fecha</th><th>Código</th><th class="num">Aciertos</th><th class="num">Fallos</th><th class="num">Blanco</th><th class="num">Nota</th><th>Obs.</th></tr>
    ${ficha.map(s => `<tr><td>${s.semana}</td><td>${esc(s.fecha)}</td><td class="mono">${esc(s.codigo)}</td><td class="num">${s.aciertos}</td><td class="num">${s.fallos}</td><td class="num">${s.blancos + s.nulas}</td><td class="num"><b>${num(s.nota)}</b></td><td>${esc(s.obs)}</td></tr>`).join('')}</table>`;
  const detalle = ficha.map(s => `
    <h3>Semana ${s.semana} · código ${esc(s.codigo)} · nota ${num(s.nota)}</h3>
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
  const filas = semanas().map(s => {
    const c = estado.claves[s];
    const n = registrosSemana(s).length;
    return `<tr><td>${s}</td><td>${esc(c.fecha ?? '')}</td><td class="mono">${c.versiones.map(v => v.codigo + (v.extra ? ' (extra)' : '')).join(', ')}</td>
      <td class="num">${c.n_preguntas}</td><td class="num">${n}</td><td><button class="boton-peligro mini" data-semana="${s}">Borrar</button></td></tr>`;
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
      ${semanas().length ? `<table class="lista"><tr><th>Semana</th><th>Examen</th><th>Versiones</th><th class="num">Preguntas</th><th class="num">Registros</th><th></th></tr>${filas}</table>` : '<p class="suave">Ninguna todavía.</p>'}
    </div>`;
  $('#in-claves').addEventListener('change', async e => {
    const mensajes = [];
    for (const f of e.target.files) {
      try {
        const clave = JSON.parse(await f.text());
        const error = L.comprobarClave(clave);
        if (error) { mensajes.push(`${f.name}: ${error}`); continue; }
        if (estado.claves[clave.semana] && !confirm(`Ya hay una clave de la semana ${clave.semana}. ¿Sustituirla? (los registros se conservan)`)) continue;
        estado.claves[clave.semana] = clave;
        mensajes.push(`${f.name}: semana ${clave.semana} cargada (${clave.versiones.length} versiones).`);
      } catch (err) { mensajes.push(`${f.name}: ${err.message}`); }
    }
    guardar();
    renderClaves();
    $('#aviso-claves').innerHTML = `<div class="aviso">${mensajes.map(esc).join('<br>')}</div>`;
  });
  $('#zona-claves').addEventListener('click', e => {
    const b = e.target.closest('button[data-semana]');
    if (!b) return;
    const s = Number(b.dataset.semana);
    const n = registrosSemana(s).length;
    if (!confirm(`¿Borrar la clave de la semana ${s}${n ? ` y sus ${n} registros` : ''}?`)) return;
    delete estado.claves[s];
    for (const [k, r] of Object.entries(estado.registros)) if (r.semana === s) delete estado.registros[k];
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
      <p class="pequeno suave">Los datos están solo en este navegador de este ordenador (${estado.alumnos.length} alumnos, ${semanas().length} claves, ${nReg} registros). Guarda una copia después de cada sesión de corrección; con ella se restaura todo en otro navegador.</p>
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
      const dato = JSON.parse(await f.text());
      if (!dato || !Array.isArray(dato.alumnos) || typeof dato.claves !== 'object' || typeof dato.registros !== 'object') throw new Error('no es una copia del corrector');
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
