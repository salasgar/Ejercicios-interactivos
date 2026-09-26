// Corrector de los exámenes semanales tipo test: la lógica, sin DOM ni
// almacenamiento, para poder probarla con `npm test` (tests/corrector.test.js).
//
// Datos con los que trabaja:
//   clave     el JSON que exporta `comun/exportar_clave.py` (carpeta de los
//             exámenes en iCloud): por versión (código de 4 cifras), las 20
//             preguntas en el orden impreso, con destreza, letra correcta y
//             las 4 opciones con su explicación.
//   alumno    { id, nombre, grupo }; el id es el mismo que usa la app
//             (usuario corto o email), para poder cruzar los datos.
//   registro  { semana, alumno, codigo, respuestas, obs, ts }; `respuestas`
//             es la cadena de 20 símbolos tal como se tecleó: A-D, «-» en
//             blanco y «?» nula (ilegible o dos cruces).
//
// Puntuación (la que va impresa en el examen): acierto +1, fallo −1/(opciones−1),
// blanco y nula 0, nota mínima 0. La nota sobre 10 es puntos / n × 10.
//
// Preguntas anuladas: una versión puede llevar `anuladas`, la lista de números
// impresos que no cuentan (p. ej. porque su contenido no se llegó a dar en clase).
// Se anulan solo a quien no la acertó: quien la acertó conserva su punto, porque
// quitársela siempre le bajaría la nota. Para los demás, la pregunta sale del
// examen: su fallo deja de restar y la nota se calcula sobre n − 1.

import { usuarioDesdeNombre, normalizarUsuario, esEmail } from '../src/altas.js';

export const BLANCO = '-';
export const NULA = '?';
export const LETRAS = 'ABCD';
export const FORMATO_CLAVE = 1;

// ---------------------------------------------------------------------------
// Alumnos
// ---------------------------------------------------------------------------

/**
 * Analiza la lista pegada, una línea por alumno, campos separados por «;» o tabulador:
 *   Nombre Apellidos; Grupo                → id = usuario corto generado («maria.garcia»)
 *   Nombre Apellidos; usuario o email; Grupo
 * El mismo formato que el alta por lotes de la app, para pegar la misma lista.
 * `existentes`: alumnos ya registrados, para no repetir identificadores.
 */
export function analizarAlumnos(texto, existentes = []) {
  const usados = new Set(existentes.map(a => a.id));
  const alumnos = [], errores = [];
  const lineas = texto.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  lineas.forEach((linea, i) => {
    const campos = linea.split(/;|\t/).map(c => c.trim());
    let nombre, usuario, grupo;
    if (campos.length === 2) [nombre, grupo] = campos;
    else if (campos.length === 3) [nombre, usuario, grupo] = campos;
    else { errores.push(`Línea ${i + 1}: se esperaban 2 o 3 campos separados por «;»`); return; }
    if (!nombre || !grupo) { errores.push(`Línea ${i + 1}: faltan el nombre o el grupo`); return; }
    const id = usuario ? (esEmail(usuario) ? usuario.toLowerCase() : normalizarUsuario(usuario)) : usuarioDesdeNombre(nombre);
    if (!id) { errores.push(`Línea ${i + 1}: no se puede formar un identificador`); return; }
    if (usados.has(id)) { errores.push(`Línea ${i + 1}: el identificador «${id}» ya existe (añade un usuario distinto)`); return; }
    usados.add(id);
    alumnos.push({ id, nombre, grupo });
  });
  return { alumnos, errores };
}

/**
 * Los que todavía no tienen registro en esa semana, en el mismo orden en que llegan.
 * Es lo que se ofrece al corregir: los ya tecleados estorban para encontrar al siguiente.
 */
export function sinRegistrar(alumnos, registros, semana) {
  const hechos = new Set(registros.filter(r => r.semana === semana).map(r => r.alumno));
  return alumnos.filter(a => !hechos.has(a.id));
}

export function ordenarAlumnos(alumnos) {
  return [...alumnos].sort((a, b) => a.grupo.localeCompare(b.grupo, 'es') || a.nombre.localeCompare(b.nombre, 'es'));
}

// ---------------------------------------------------------------------------
// Claves
// ---------------------------------------------------------------------------

/** Devuelve un texto de error si el objeto no es una clave válida; si lo es, null. */
export function comprobarClave(clave) {
  if (!clave || typeof clave !== 'object') return 'No es un JSON de clave';
  if (clave.formato !== FORMATO_CLAVE) return `Formato de clave ${clave.formato}, se esperaba ${FORMATO_CLAVE}`;
  if (!Number.isInteger(clave.semana)) return 'Falta el número de semana';
  const n = clave.n_preguntas;
  if (!Number.isInteger(n) || n < 1) return 'Falta n_preguntas';
  if (!Array.isArray(clave.destrezas) || clave.destrezas.length !== n) return 'La lista de destrezas no tiene n_preguntas entradas';
  if (!Array.isArray(clave.versiones) || clave.versiones.length === 0) return 'No hay versiones';
  const codigos = new Set();
  for (const v of clave.versiones) {
    if (!/^\d{4}$/.test(String(v.codigo))) return `Código de versión no válido: ${v.codigo}`;
    if (codigos.has(v.codigo)) return `Código repetido: ${v.codigo}`;
    codigos.add(v.codigo);
    if (!Array.isArray(v.preguntas) || v.preguntas.length !== n) return `La versión ${v.codigo} no tiene ${n} preguntas`;
    const posiciones = new Set();
    for (const p of v.preguntas) {
      if (!LETRAS.includes(p.correcta)) return `Versión ${v.codigo}, pregunta ${p.n}: letra correcta «${p.correcta}»`;
      if (!Number.isInteger(p.pos) || p.pos < 1 || p.pos > n || posiciones.has(p.pos)) return `Versión ${v.codigo}: posiciones mal`;
      posiciones.add(p.pos);
      if (clave.destrezas[p.pos - 1] !== p.item) return `Versión ${v.codigo}, pregunta ${p.n}: destreza que no casa`;
    }
    if (v.clave !== v.preguntas.map(p => p.correcta).join('')) return `Versión ${v.codigo}: la clave no casa con las preguntas`;
    const error = comprobarAnuladas(v.anuladas, n);
    if (error) return `Versión ${v.codigo}: ${error}`;
  }
  return null;
}

/** Error si `anuladas` no es una lista de números de pregunta distintos entre 1 y n (puede faltar). */
export function comprobarAnuladas(anuladas, n) {
  if (anuladas === undefined) return null;
  if (!Array.isArray(anuladas) || anuladas.some(q => !Number.isInteger(q) || q < 1 || q > n)) return `preguntas anuladas no válidas (van de 1 a ${n})`;
  if (new Set(anuladas).size !== anuladas.length) return 'pregunta anulada repetida';
  if (anuladas.length >= n) return 'no se pueden anular todas las preguntas';
  return null;
}

/**
 * Lee lo que se teclea para anular preguntas de una semana: «8930:10, 4816:9»
 * (código:número; varias del mismo código, «8930:10:12»). Vacío = ninguna.
 * Devuelve { anuladas: { codigo: [números] }, error }.
 */
export function analizarAnuladas(texto, clave) {
  const anuladas = {};
  for (const trozo of String(texto ?? '').split(/[,;\s]+/).filter(Boolean)) {
    const [codigo, ...nums] = trozo.split(':');
    const v = versionDe(clave, codigo);
    if (!v) return { anuladas: null, error: `«${codigo}» no es un código de la semana ${clave.semana}` };
    if (!nums.length) return { anuladas: null, error: `falta el número de pregunta en «${trozo}» (código:número)` };
    const lista = anuladas[v.codigo] ??= [];
    lista.push(...nums.map(Number));
    const error = comprobarAnuladas(lista, v.preguntas.length);
    if (error) return { anuladas: null, error: `${v.codigo}: ${error}` };
  }
  for (const lista of Object.values(anuladas)) lista.sort((a, b) => a - b);
  return { anuladas, error: null };
}

/** Lo contrario de analizarAnuladas: «8930:10, 4816:9». */
export function textoAnuladas(clave) {
  return clave.versiones.filter(v => v.anuladas?.length).map(v => [v.codigo, ...v.anuladas].join(':')).join(', ');
}

export function versionDe(clave, codigo) {
  const cod = String(codigo ?? '').trim();
  return clave?.versiones.find(v => String(v.codigo) === cod) ?? null;
}

// ---------------------------------------------------------------------------
// Respuestas y corrección
// ---------------------------------------------------------------------------

/**
 * Teclado posicional: las cuatro opciones caen en cuatro teclas seguidas de la fila
 * de arriba, en el mismo orden en que están impresas en la franja del examen. Se
 * teclea con los dedos quietos, sin buscar la A, la B, la C y la D por el teclado.
 */
export const POSICIONAL = { U: 'A', I: 'B', O: 'C', P: 'D' };

/**
 * Convierte lo tecleado en la cadena de respuestas: letras A-D (en cualquier caja),
 * «-», espacio, «_», «0» o «.» en blanco, «?» o «x» nula. Todo lo demás se ignora.
 * Corta en n símbolos. Con `posicional`, además U I O P valen por A B C D (las
 * letras normales siguen valiendo: no estorban, porque U, I, O y P no son opciones).
 */
export function limpiarTecleo(texto, n, posicional = false) {
  let out = '';
  for (const bruto of String(texto ?? '').toUpperCase()) {
    if (out.length >= n) break;
    const ch = posicional ? POSICIONAL[bruto] ?? bruto : bruto;
    if (LETRAS.includes(ch)) out += ch;
    else if ('- _0.'.includes(ch)) out += BLANCO;
    else if (ch === '?' || ch === 'X') out += NULA;
  }
  return out;
}

/** Rellena con blancos hasta n símbolos (o corta). */
export function completar(respuestas, n) {
  return (String(respuestas ?? '') + BLANCO.repeat(n)).slice(0, n);
}

/** Cambia la respuesta de la pregunta q (1..n): la misma letra otra vez la deja en blanco. */
export function marcar(respuestas, n, q, letra) {
  const resp = completar(respuestas, n).split('');
  resp[q - 1] = resp[q - 1] === letra ? BLANCO : letra;
  return resp.join('').replace(new RegExp(`\\${BLANCO}+$`), '');
}

/**
 * Corrige una cadena de respuestas con una versión. Devuelve el detalle por pregunta
 * (en el orden impreso), los recuentos, los puntos (sobre `sobre`: n menos las
 * preguntas anuladas a este alumno) y la nota (sobre 10). Una pregunta anulada que
 * el alumno no acertó queda con estado 'anulada'; `real` guarda lo que habría sido.
 */
export function corregir(version, respuestas, opciones = 4) {
  const n = version.preguntas.length;
  const resp = completar(respuestas, n);
  const penalizacion = 1 / (opciones - 1);
  const anuladas = new Set(version.anuladas ?? []);
  const detalle = version.preguntas.map((p, i) => {
    const r = resp[i];
    const real = r === BLANCO ? 'blanco' : r === NULA ? 'nula' : r === p.correcta ? 'acierto' : 'fallo';
    const estado = anuladas.has(p.n) && real !== 'acierto' ? 'anulada' : real;
    return { n: p.n, pos: p.pos, item: p.item, respuesta: r, correcta: p.correcta, estado, real };
  });
  const cuenta = e => detalle.filter(d => d.estado === e).length;
  const aciertos = cuenta('acierto'), fallos = cuenta('fallo'), blancos = cuenta('blanco'), nulas = cuenta('nula'), anuladasAqui = cuenta('anulada');
  const sobre = n - anuladasAqui;
  const puntosExactos = Math.max(0, aciertos - fallos * penalizacion);
  return { respuestas: resp, detalle, aciertos, fallos, blancos, nulas, anuladas: anuladasAqui, sobre, puntos: redondear(puntosExactos), nota: redondear(puntosExactos / sobre * 10) };
}

export function redondear(x, decimales = 2) {
  const f = 10 ** decimales;
  return Math.round((x + Number.EPSILON) * f) / f;
}

export function idRegistro(semana, alumno) {
  return `${semana}|${alumno}`;
}

// ---------------------------------------------------------------------------
// Resultados
// ---------------------------------------------------------------------------

/**
 * Una fila por registro de la semana, corregido y con los datos del alumno,
 * ordenadas por grupo y nombre.
 */
export function resumenSemana(clave, registros, alumnos) {
  const porId = new Map(alumnos.map(a => [a.id, a]));
  const filas = [];
  for (const r of registros) {
    const version = versionDe(clave, r.codigo);
    if (!version) continue;
    const a = porId.get(r.alumno) ?? { id: r.alumno, nombre: r.alumno, grupo: '' };
    filas.push({ ...r, nombre: a.nombre, grupo: a.grupo, ...corregir(version, r.respuestas, clave.opciones) });
  }
  return filas.sort((x, y) => x.grupo.localeCompare(y.grupo, 'es') || x.nombre.localeCompare(y.nombre, 'es'));
}

export function media(valores) {
  return valores.length ? redondear(valores.reduce((s, x) => s + x, 0) / valores.length) : null;
}

/**
 * Por posición (destreza) de la semana: cuántos la han contestado, aciertos, fallos,
 * blancos (nulas incluidas) y, por versión, el número impreso, la letra correcta y
 * cuántos han elegido cada símbolo.
 */
export function estadisticasPreguntas(clave, registros) {
  const posiciones = clave.destrezas.map((item, i) => ({ pos: i + 1, item, n: 0, aciertos: 0, fallos: 0, blancos: 0, versiones: {} }));
  for (const r of registros) {
    const version = versionDe(clave, r.codigo);
    if (!version) continue;
    for (const d of corregir(version, r.respuestas, clave.opciones).detalle) {
      const p = posiciones[d.pos - 1];
      p.n += 1;
      // Lo que contestó de verdad, aunque se le anulara: esto mide la destreza.
      if (d.real === 'acierto') p.aciertos += 1;
      else if (d.real === 'fallo') p.fallos += 1;
      else p.blancos += 1;
      const v = p.versiones[version.codigo] ??= { numero: d.n, correcta: d.correcta, n: 0, aciertos: 0, letras: { A: 0, B: 0, C: 0, D: 0, [BLANCO]: 0, [NULA]: 0 } };
      v.n += 1;
      if (d.estado === 'acierto') v.aciertos += 1;
      v.letras[d.respuesta] += 1;
    }
  }
  return posiciones;
}

/**
 * Ficha de un alumno: sus registros de todas las semanas, corregidos, y por cada
 * pregunta la opción que eligió con su explicación (para saber qué error cometió).
 */
export function fichaAlumno(claves, registros, alumnoId) {
  const semanas = [];
  for (const r of registros.filter(r => r.alumno === alumnoId)) {
    const clave = claves[r.semana];
    const version = clave && versionDe(clave, r.codigo);
    if (!version) continue;
    const c = corregir(version, r.respuestas, clave.opciones);
    const preguntas = c.detalle.map(d => {
      const p = version.preguntas[d.n - 1];
      const elegida = p.opciones.find(o => o.letra === d.respuesta) ?? null;
      const buena = p.opciones.find(o => o.letra === d.correcta) ?? null;
      return { ...d, enunciado: p.enunciado, elegida, buena };
    });
    semanas.push({ semana: r.semana, fecha: clave.fecha ?? '', codigo: r.codigo, obs: r.obs ?? '', ...c, preguntas });
  }
  return semanas.sort((a, b) => a.semana - b.semana);
}

// ---------------------------------------------------------------------------
// CSV (mismas convenciones que la app: «;», BOM y coma decimal, para Excel en español)
// ---------------------------------------------------------------------------

function celda(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') return String(v).replace('.', ',');
  const s = String(v);
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function aCsv(cabecera, filas) {
  return '﻿' + [cabecera, ...filas].map(f => f.map(celda).join(';')).join('\r\n') + '\r\n';
}

export function fechaTexto(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Una fila por alumno y semana. */
export function csvResumen(claves, registros, alumnos) {
  const cabecera = ['Semana', 'Fecha examen', 'Usuario', 'Nombre', 'Grupo', 'Código', 'Respuestas', 'Aciertos', 'Fallos', 'En blanco', 'Nulas', 'Anuladas', 'Puntos', 'Sobre', 'Nota', 'Observaciones', 'Registrado el'];
  const filas = [];
  for (const semana of Object.keys(claves).map(Number).sort((a, b) => a - b)) {
    const clave = claves[semana];
    for (const f of resumenSemana(clave, registros.filter(r => r.semana === semana), alumnos)) {
      filas.push([semana, clave.fecha ?? '', f.alumno, f.nombre, f.grupo, f.codigo, f.respuestas, f.aciertos, f.fallos, f.blancos, f.nulas, f.anuladas, f.puntos, f.sobre, f.nota, f.obs ?? '', fechaTexto(f.ts)]);
    }
  }
  return aCsv(cabecera, filas);
}

/** Una fila por respuesta. */
export function csvDetalle(claves, registros, alumnos) {
  const cabecera = ['Semana', 'Usuario', 'Nombre', 'Grupo', 'Código', 'Nº', 'Posición', 'Destreza', 'Respuesta', 'Correcta', 'Resultado', 'Opción elegida', 'Enunciado'];
  const porId = new Map(alumnos.map(a => [a.id, a]));
  const filas = [];
  for (const semana of Object.keys(claves).map(Number).sort((a, b) => a - b)) {
    const clave = claves[semana];
    for (const r of registros.filter(r => r.semana === semana)) {
      const version = versionDe(clave, r.codigo);
      if (!version) continue;
      const a = porId.get(r.alumno) ?? { nombre: r.alumno, grupo: '' };
      for (const d of corregir(version, r.respuestas, clave.opciones).detalle) {
        const p = version.preguntas[d.n - 1];
        const elegida = p.opciones.find(o => o.letra === d.respuesta);
        filas.push([semana, r.alumno, a.nombre, a.grupo, r.codigo, d.n, d.pos, d.item, d.respuesta, d.correcta, d.estado,
          elegida ? aPlano(elegida.texto) : '', aPlano(p.enunciado)]);
      }
    }
  }
  return aCsv(cabecera, filas);
}

// ---------------------------------------------------------------------------
// Texto plano a partir del LaTeX de los enunciados y opciones (solo para mostrar)
// ---------------------------------------------------------------------------
export function aPlano(tex) {
  return String(tex ?? '')
    .replace(/\\(textbf|emph|text|mathbf)\{([^{}]*)\}/g, '$2')
    .replace(/\\sqrt\{([^{}]*)\}/g, '√$1')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\^\{([^{}]*)\}/g, (_, e) => superindice(e))
    .replace(/\^(\d)/g, (_, e) => superindice(e))
    .replace(/\\times\s*/g, '×').replace(/\\div\s*/g, '÷').replace(/\\cdot\s*/g, '·')
    .replace(/\s*\\to\s*/g, ' → ')
    .replace(/\\ldots\s*/g, '…').replace(/\\,/g, ' ').replace(/\\ /g, ' ')
    .replace(/~/g, ' ').replace(/\$/g, '').replace(/\s+/g, ' ').trim();
}

function superindice(s) {
  const mapa = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  return [...s].map(c => mapa[c] ?? c).join('');
}
