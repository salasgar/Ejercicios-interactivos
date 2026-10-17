// «Tareas» del panel, sistema nuevo: el editor de tareas del profesor (DISENO.md, D.5;
// tarea 67 del reparto PU2). Cada profesor hace aquí sus tareas y sus fechas de
// comienzo de unidad y las guarda en su espacio (`config/tareas`) con `guardarConfig`.
//
// Casi todo es lógica pura, exportada y comprobada en tests/practicas-editor.test.js;
// `montar` solo pinta y recoge lo que el profesor toca. `profesor.js` lo llama una vez,
// al abrir el espacio, con el contenedor `#editor-tareas` de `profesor.html`.
//
// `contexto` (lo monta `profesor.js`; ver `contexto` allí):
//   uid, esAdmin, datos (`leerConfig`, `guardarConfig(json)`, …), config() la
//   configuración de ahora { unidades: [{ n, desde }], tareas: [...] },
//   cambiarConfig(config) avisa al panel de una configuración nueva ya guardada,
//   alumnos(), resultados(), alCargar(fn), recargar().

import { CATALOGO, UNIDADES, unidadesCon } from './_comun/catalogo.js';
import { configAJSON, configPlantilla, erroresConfig, fechaISO, MAX_ESTRELLA, MAX_ELEGIR, MAX_ID_TAREA } from './_comun/tareas.js';

// --- Lógica pura ------------------------------------------------------------------------

const clonar = x => JSON.parse(JSON.stringify(x));

/** Id de una tarea nueva: el mayor que haya + 1 (los ids no se reutilizan: el editor no borra tareas). */
export function siguienteId(tareas) {
  return tareas.reduce((m, t) => Math.max(m, t.id), 0) + 1;
}

/** Una tarea en blanco de la unidad `unidad`, con el id que toca. Sin fechas: voluntaria y visible. */
export function tareaNueva(config, unidad) {
  return { id: siguienteId(config.tareas), unidad, titulo: { es: '', en: '' }, estrella: [], elegir: [], nElegir: 0 };
}

/** Copia de la tarea `id` con el id siguiente, sin fechas ni «asignada» y con «(copia)» en el título. */
export function duplicarTarea(config, id) {
  const origen = config.tareas.find(t => t.id === id);
  if (!origen) return null;
  const copia = clonar(origen);
  copia.id = siguienteId(config.tareas);
  delete copia.desde;
  delete copia.hasta;
  delete copia.asignada;
  copia.titulo = { es: `${origen.titulo.es} (copia)`, en: `${origen.titulo.en} (copy)` };
  return copia;
}

/** Una tarea no cambia de ejercicios desde su `desde`: el código de resultado dice «el 3.º ★ terminado». */
export function estaBloqueada(tarea, hoy) {
  return Boolean(tarea?.desde) && tarea.desde <= hoy;
}

/**
 * La tarea que resulta de guardar `editada` donde estaba `original`. Si `original` está
 * bloqueada, los ejercicios (y cuántos hay que elegir) se quedan como estaban.
 */
export function conservarSiBloqueada(original, editada, hoy) {
  if (!original || !estaBloqueada(original, hoy)) return editada;
  return { ...editada, estrella: clonar(original.estrella), elegir: clonar(original.elegir), nElegir: original.nElegir };
}

/** Sustituye la tarea de ese id (o la añade al final si es nueva). Devuelve una configuración nueva. */
export function guardarTarea(config, tarea) {
  const tareas = config.tareas.some(t => t.id === tarea.id)
    ? config.tareas.map(t => (t.id === tarea.id ? tarea : t))
    : [...config.tareas, tarea];
  return { ...config, tareas };
}

/** Pone la fecha de comienzo de una unidad (o la quita, con `desde` vacío, para que valga la del curso). */
export function ponerFechaUnidad(config, n, desde) {
  const resto = config.unidades.filter(u => u.n !== n);
  return { ...config, unidades: desde ? [...resto, { n, desde }].sort((a, b) => a.n - b.n) : resto };
}

/**
 * «Cargar la plantilla del curso»: sin tareas, la configuración es la plantilla (con sus
 * fechas de unidad); con tareas, se conservan y se añaden las de la plantilla con ids nuevos.
 * `sustituye` dice cuál de los dos casos es (para el aviso).
 */
export function cargarPlantilla(config) {
  const plantilla = configPlantilla();
  if (!config.tareas.length) return { config: { unidades: config.unidades.length ? config.unidades : plantilla.unidades, tareas: plantilla.tareas }, sustituye: true };
  let id = siguienteId(config.tareas);
  const nuevas = plantilla.tareas.map(t => ({ ...t, id: id++ }));
  return { config: { ...config, tareas: [...config.tareas, ...nuevas] }, sustituye: false };
}

/** Las tareas agrupadas por unidad, en el orden de `UNIDADES`; las unidades sin tareas salen vacías. */
export function tareasPorUnidad(config) {
  return UNIDADES.map(u => ({ unidad: u, tareas: config.tareas.filter(t => t.unidad === u.n) }));
}

/** Los ejercicios del catálogo de una unidad: [{ slug, n, practica }] (sin la plantilla ni las no disponibles). */
export function ejerciciosDeUnidad(unidad) {
  return CATALOGO.filter(p => unidad !== null && p.unidad === unidad && p.disponible)
    .flatMap(p => Array.from({ length: p.nEjercicios }, (_, i) => ({ slug: p.slug, n: i + 1, practica: p })));
}

/**
 * La tarea que resulta de las marcas del formulario. `marcas` es una lista de
 * `{ slug, n, tipo }` con `tipo` 'estrella' | 'elegir' | '' (sin marcar), en el orden del catálogo.
 */
export function tareaDeFormulario(base, { tituloEs, tituloEn, unidad, desde, hasta, asignada, nElegir, marcas }) {
  const t = { id: base.id, unidad, titulo: { es: tituloEs.trim(), en: tituloEn.trim() } };
  if (desde) t.desde = desde;
  if (hasta) t.hasta = hasta;
  if (asignada) t.asignada = true;
  t.estrella = marcas.filter(m => m.tipo === 'estrella').map(m => [m.slug, m.n]);
  t.elegir = marcas.filter(m => m.tipo === 'elegir').map(m => [m.slug, m.n]);
  t.nElegir = Math.max(0, Math.min(Number.isFinite(nElegir) ? nElegir : 0, t.elegir.length));
  return t;
}

/**
 * Los avisos de guardar `tarea` (en frases): los de `erroresConfig` sobre la configuración
 * resultante que corresponden a esa tarea o a las fechas de unidad, más que el título no
 * esté vacío. Vacía si se puede guardar.
 */
export function avisosDeTarea(config, tarea) {
  const avisos = [];
  if (!tarea.titulo.es) avisos.push('Falta el título en español.');
  if (!tarea.titulo.en) avisos.push('Falta el título en inglés.');
  const nombre = `tarea ${tarea.id}: `;
  for (const e of erroresConfig(guardarTarea(config, tarea))) {
    if (e.startsWith(nombre)) avisos.push(e.slice(nombre.length));
    else if (e.startsWith('unidad ') || e.startsWith('la configuración')) avisos.push(e);
  }
  if (tarea.id > MAX_ID_TAREA) avisos.push(`Ya no caben más tareas (el número llega a ${MAX_ID_TAREA}).`);
  return avisos;
}

/** Resumen de la tarea para la lista: «6 ★ + 4 de 8 · desde 26-10 · plazo 29-10». */
export function resumenTarea(t) {
  const corta = f => f.split('-').slice(1).reverse().join('-');
  const fechas = [t.desde ? `desde ${corta(t.desde)}` : 'sin fecha de comienzo', t.hasta ? `plazo ${corta(t.hasta)}` : null].filter(Boolean).join(' · ');
  return `${t.estrella.length} ★ + ${t.nElegir} de ${t.elegir.length}${t.asignada ? ' · asignada' : ''} · ${fechas}`;
}

// --- Pantalla ---------------------------------------------------------------------------

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Monta el editor en `contenedor`. */
export function montar(contenedor, contexto) {
  const nombres = new Map();      // 'slug/n' → { es, en }, se llena al cargar la declaración de cada práctica
  let editando = null;            // { tarea, nueva } mientras el formulario está abierto
  let mensaje = '';
  let ocupado = false;

  const config = () => {
    const c = contexto.config() ?? {};
    return { unidades: c.unidades ?? [], tareas: c.tareas ?? [] };
  };
  const hoy = () => fechaISO(new Date());

  async function cargarNombres(unidad) {
    const { declaracionDe } = await import('./_comun/base.js');
    await Promise.all(CATALOGO.filter(p => p.unidad === unidad && p.disponible).map(async p => {
      const d = await declaracionDe(p);
      d?.ejercicios?.forEach((e, i) => nombres.set(`${p.slug}/${i + 1}`, e.nombre));
    }));
  }
  const nombreDe = (slug, n) => nombres.get(`${slug}/${n}`)?.es ?? `ejercicio ${n}`;

  async function guardar(nueva, texto) {
    ocupado = true; mensaje = 'Guardando…'; pintar();
    try {
      await contexto.datos.guardarConfig(configAJSON(nueva));
      contexto.cambiarConfig(nueva);
      mensaje = texto;
    } catch (e) {
      mensaje = `No se ha podido guardar: ${e?.message ?? e}`;
    }
    ocupado = false;
  }

  function pintarLista() {
    const c = config();
    const fechas = unidadesCon(c.unidades);
    const grupos = tareasPorUnidad(c).map(({ unidad, tareas }) => `
      <div class="editor-unidad">
        <h3>Unidad ${unidad.n} · ${esc(unidad.titulo.es)}</h3>
        <label class="pequeno">Empieza el <input type="date" data-unidad="${unidad.n}" value="${fechas.find(u => u.n === unidad.n).desde}"></label>
        ${tareas.length ? `<ul class="editor-lista">${tareas.map(t => `
          <li><strong>Tarea ${t.id} · ${esc(t.titulo.es)}</strong>${estaBloqueada(t, hoy()) ? ' 🔒' : ''}<br><span class="pequeno">${esc(resumenTarea(t))}</span>
            <span class="botonera"><button type="button" class="secundario" data-editar="${t.id}">Editar</button> <button type="button" class="secundario" data-duplicar="${t.id}">Duplicar</button></span></li>`).join('')}</ul>`
          : '<p class="pequeno">Sin tareas.</p>'}
        <button type="button" class="secundario" data-nueva="${unidad.n}">Nueva tarea en la unidad ${unidad.n}</button>
      </div>`).join('');
    contenedor.innerHTML = `
      ${grupos}
      <p class="botonera"><button type="button" class="secundario" id="editor-plantilla">Cargar la plantilla del curso</button></p>
      <p class="pequeno" id="editor-mensaje" role="status">${esc(mensaje)}</p>`;
    contenedor.querySelectorAll('[data-unidad]').forEach(el => el.addEventListener('change', async () => {
      const nueva = ponerFechaUnidad(config(), Number(el.dataset.unidad), el.value);
      const avisos = erroresConfig(nueva).filter(e => e.startsWith('unidad '));
      if (avisos.length) { mensaje = avisos.join(' '); pintar(); return; }
      await guardar(nueva, 'Fecha de la unidad guardada.'); pintar();
    }));
    contenedor.querySelectorAll('[data-nueva]').forEach(b => b.addEventListener('click', async () => {
      const u = Number(b.dataset.nueva);
      await cargarNombres(u);
      editando = { tarea: tareaNueva(config(), u), nueva: true }; mensaje = ''; pintar();
    }));
    contenedor.querySelectorAll('[data-editar]').forEach(b => b.addEventListener('click', async () => {
      const t = config().tareas.find(x => x.id === Number(b.dataset.editar));
      await cargarNombres(t.unidad);
      editando = { tarea: clonar(t), nueva: false }; mensaje = ''; pintar();
    }));
    contenedor.querySelectorAll('[data-duplicar]').forEach(b => b.addEventListener('click', async () => {
      const c2 = config();
      const copia = duplicarTarea(c2, Number(b.dataset.duplicar));
      if (!copia) return;
      await guardar(guardarTarea(c2, copia), `Tarea ${copia.id} creada como copia; edítala para cambiar sus ejercicios.`);
      pintar();
    }));
    contenedor.querySelector('#editor-plantilla').addEventListener('click', async () => {
      const c2 = config();
      const { config: nueva, sustituye } = cargarPlantilla(c2);
      const aviso = sustituye
        ? 'Se cargarán las tareas y fechas de la plantilla del curso. ¿Seguir?'
        : `Ya tienes ${c2.tareas.length} tareas: se añadirán las de la plantilla con números nuevos, sin tocar las tuyas. ¿Seguir?`;
      if (!globalThis.confirm?.(aviso)) return;
      await guardar(nueva, 'Plantilla cargada.'); pintar();
    });
  }

  function pintarFormulario() {
    const { tarea, nueva } = editando;
    const bloqueada = !nueva && estaBloqueada(tarea, hoy());
    const ejercicios = ejerciciosDeUnidad(tarea.unidad);
    const tipoDe = (slug, n) => tarea.estrella.some(([s, k]) => s === slug && k === n) ? 'estrella' : tarea.elegir.some(([s, k]) => s === slug && k === n) ? 'elegir' : '';
    const filas = ejercicios.map(e => `
      <tr><td>${esc(e.practica.nombre.es)}</td><td>${e.n}. ${esc(nombreDe(e.slug, e.n))}</td>
        <td><select data-ej="${e.slug}/${e.n}" ${bloqueada ? 'disabled' : ''}>
          ${[['', '—'], ['estrella', '★ obligatorio'], ['elegir', 'a elegir']].map(([v, r]) => `<option value="${v}" ${tipoDe(e.slug, e.n) === v ? 'selected' : ''}>${r}</option>`).join('')}
        </select></td></tr>`).join('');
    contenedor.innerHTML = `
      <h3>${nueva ? 'Tarea nueva' : `Tarea ${tarea.id}`} · unidad ${tarea.unidad}</h3>
      ${bloqueada ? '<p class="aviso">🔒 Esta tarea ya ha empezado: puedes cambiar el título y las fechas, pero no los ejercicios. Para cambiarlos, duplícala.</p>' : ''}
      <label>Título (español) <input type="text" id="f-es" value="${esc(tarea.titulo.es)}"></label>
      <label>Title (English) <input type="text" id="f-en" value="${esc(tarea.titulo.en)}"></label>
      <label>Visible desde <input type="date" id="f-desde" value="${tarea.desde ?? ''}"></label>
      <label>Plazo (hasta el final de ese día) <input type="date" id="f-hasta" value="${tarea.hasta ?? ''}"></label>
      <label><input type="checkbox" id="f-asignada" ${tarea.asignada ? 'checked' : ''}> Obligatoria solo para algunos alumnos (los marcas en «Asignar tareas»)</label>
      <div class="tabla"><table><thead><tr><th>Práctica</th><th>Ejercicio</th><th>En la tarea</th></tr></thead><tbody>${filas}</tbody></table></div>
      <p class="pequeno">Hasta ${MAX_ESTRELLA} obligatorios y ${MAX_ELEGIR} a elegir. Salen en el orden del catálogo.</p>
      <label>Cuántos de los «a elegir» hay que terminar <input type="number" id="f-nelegir" min="0" max="${MAX_ELEGIR}" value="${tarea.nElegir}" ${bloqueada ? 'disabled' : ''}></label>
      <ul class="pequeno" id="f-avisos"></ul>
      <p class="botonera"><button type="button" id="f-guardar">Guardar</button> <button type="button" class="secundario" id="f-cancelar">Cancelar</button></p>`;
    const leerFormulario = () => {
      const marcas = ejercicios.map(e => ({ slug: e.slug, n: e.n, tipo: contenedor.querySelector(`[data-ej="${e.slug}/${e.n}"]`).value }));
      const t = tareaDeFormulario(tarea, {
        tituloEs: contenedor.querySelector('#f-es').value, tituloEn: contenedor.querySelector('#f-en').value, unidad: tarea.unidad,
        desde: contenedor.querySelector('#f-desde').value, hasta: contenedor.querySelector('#f-hasta').value,
        asignada: contenedor.querySelector('#f-asignada').checked, nElegir: Number(contenedor.querySelector('#f-nelegir').value), marcas,
      });
      return nueva ? t : conservarSiBloqueada(editando.tarea, t, hoy());
    };
    const avisar = () => {
      const avisos = avisosDeTarea(config(), leerFormulario());
      contenedor.querySelector('#f-avisos').innerHTML = avisos.map(a => `<li>⚠ ${esc(a)}</li>`).join('');
      return avisos;
    };
    contenedor.querySelectorAll('input, select').forEach(el => el.addEventListener('input', avisar));
    contenedor.querySelector('#f-cancelar').addEventListener('click', () => { editando = null; pintar(); });
    contenedor.querySelector('#f-guardar').addEventListener('click', async () => {
      if (avisar().length) return;
      const t = leerFormulario();
      editando = null;
      await guardar(guardarTarea(config(), t), `Tarea ${t.id} guardada.`);
      pintar();
    });
    if (!nueva) avisar();
  }

  function pintar() {
    if (editando) pintarFormulario(); else pintarLista();
    if (ocupado) contenedor.querySelectorAll('button').forEach(b => { b.disabled = true; });
  }

  contexto.alCargar(() => { if (!editando) pintar(); });
  pintar();
}
