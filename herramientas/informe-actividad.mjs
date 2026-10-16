#!/usr/bin/env node
// Informe de actividad de los alumnos en las prácticas (pedido por Juan Luis el
// 2026-10-16, para detectar pronto a quien no sabe entrar y los ejercicios que
// fallan demasiado). Lo ejecuta una rutina diaria en la nube, que le manda el
// resultado por correo; también vale a mano.
//
// Lee Firestore por REST **sin autenticación**: las reglas dejan leer con `get`
// cada documento `practicas/<slug>--<código>` (solo números, sin nombres), y los
// códigos de los alumnos salen de su número de lista (`codigoAlumno` en
// practicas/_comun/codigos.js). No lee `fallos/` ni lista colecciones: eso exige
// la cuenta del profesor y una rutina en la nube no la tiene.
//
// Uso:
//   node herramientas/informe-actividad.mjs [--alumnos 51] [--tarea 1] [--horas 24]
//        [--grupos "1.º A:1-29,E1CB:30-46,E1DB:47-51"] [--json]
//
//   --alumnos  cuántas líneas tiene la lista del panel (los códigos 1..N)
//   --tarea    id de la tarea de la semana (practicas/_comun/tareas.js)
//   --horas    ventana de «actividad reciente» (desde hace tantas horas)
//   --grupos   nombre:desde-hasta por grupo, con los números de lista
//   --json     además del informe, el resumen completo en JSON (última línea)
//
// Las funciones de cálculo (resumirEjercicio, agregar, formatear) son puras y
// están probadas en tests/herramientas-informe.test.js.

import { codigoAlumno } from '../practicas/_comun/codigos.js';
import { tareaPorId, PUNTOS_POR_EJERCICIO } from '../practicas/_comun/tareas.js';
import { urlDocumento, leerDocumentoRest } from '../practicas/_comun/nube.js';
import { diaDe, fechaDeDia } from '../practicas/_comun/contador.js';

// --- Umbrales de las alertas (se pueden ajustar) --------------------------------

export const UMBRALES = {
  minimoIntentos: 5,        // alumnos que han probado un ejercicio para opinar sobre él
  ratioFallosAlto: 0.5,     // fallos / (aciertos + fallos) a partir del cual se avisa
  ratioReiniciosAlto: 0.3,  // alumnos que han perdido las 5 vidas / alumnos que lo prueban
  fallosSinPuntos: 10,      // un alumno con tantos fallos y 0 puntos no se aclara
  parteActivaBaja: 0.3,     // menos de este porcentaje de alumnos activos: aviso
};

// --- Cálculo puro -----------------------------------------------------------------

/** Un ejercicio tal como lo guarda la app, en los dos formatos (nuevo con puntos; antiguo con pendientes). */
export function resumirEjercicio(e, objetivo = PUNTOS_POR_EJERCICIO) {
  if (!e || typeof e !== 'object') return { puntos: 0, aciertos: 0, fallos: 0, reinicios: 0, terminado: false, dia: 0, intentado: false };
  const obj = Number.isFinite(e.objetivo) ? e.objetivo : objetivo;
  let puntos = Number.isFinite(e.puntos) ? e.puntos : (Number.isFinite(e.pendientes) ? obj - e.pendientes : 0);
  if (e.terminado) puntos = obj;
  puntos = Math.max(0, Math.min(obj, puntos));
  const aciertos = Number.isFinite(e.aciertos) ? e.aciertos : 0;
  const fallos = Number.isFinite(e.fallos) ? e.fallos : 0;
  return {
    puntos, aciertos, fallos,
    reinicios: Number.isFinite(e.reinicios) ? e.reinicios : 0,
    terminado: Boolean(e.terminado),
    dia: Number.isFinite(e.dia) ? e.dia : 0,
    intentado: aciertos + fallos > 0,
  };
}

/** Los ejercicios de una tarea: [{ slug, n, estrella }], n desde 1. */
export function ejerciciosDe(tarea) {
  return [
    ...tarea.estrella.map(([slug, n]) => ({ slug, n, estrella: true })),
    ...tarea.elegir.map(([slug, n]) => ({ slug, n, estrella: false })),
  ];
}

function grupoDe(numero, grupos) {
  const g = grupos.find(x => numero >= x.desde && numero <= x.hasta);
  return g ? g.nombre : '?';
}

/** «1.º A:1-29,E1CB:30-46» → [{ nombre, desde, hasta }]. */
export function leerGrupos(texto) {
  if (!texto) return [];
  return texto.split(',').map(parte => {
    const [nombre, rango] = parte.split(':');
    const [desde, hasta] = rango.split('-').map(Number);
    return { nombre: nombre.trim(), desde, hasta };
  });
}

/**
 * Agrega los documentos leídos.
 *   docs     Map `${slug}--${codigo}` → { ej, actualizado } | null (null = no existe)
 *   tarea    la tarea de la semana (tareas.js)
 *   alumnos  cuántos (códigos 1..alumnos)
 *   desde    ms: desde cuándo cuenta como actividad reciente
 *   grupos   [{ nombre, desde, hasta }]
 */
export function agregar({ docs, tarea, alumnos, desde, grupos = [], umbrales = UMBRALES }) {
  const ejercicios = ejerciciosDe(tarea);
  const slugs = [...new Set(ejercicios.map(e => e.slug))];
  const porEjercicio = ejercicios.map(e => ({ ...e, intentan: 0, terminan: 0, aciertos: 0, fallos: 0, reinicios: 0, reinician: 0 }));
  const diaDesde = diaDe(new Date(desde));
  const filas = [];
  for (let i = 0; i < alumnos; i++) {
    const codigo = codigoAlumno(i);
    const numero = i + 1;
    let existe = false, ultima = 0;
    const porSlug = new Map();
    for (const slug of slugs) {
      const d = docs.get(`${slug}--${codigo}`);
      if (!d) continue;
      existe = true;
      ultima = Math.max(ultima, Number(d.actualizado) || 0);
      porSlug.set(slug, Array.isArray(d.ej) ? d.ej : []);
    }
    let puntosEstrella = 0, terminadosEstrella = 0, fallos = 0, reinicios = 0, terminadosHoy = 0;
    const puntosElegir = [];
    let terminadosElegir = 0;
    ejercicios.forEach((e, k) => {
      const r = resumirEjercicio(porSlug.get(e.slug)?.[e.n - 1]);
      fallos += r.fallos; reinicios += r.reinicios;
      if (r.terminado && r.dia >= diaDesde) terminadosHoy++;
      if (e.estrella) { puntosEstrella += r.puntos; if (r.terminado) terminadosEstrella++; }
      else { puntosElegir.push(r.puntos); if (r.terminado) terminadosElegir++; }
      const pe = porEjercicio[k];
      if (r.intentado) { pe.intentan++; pe.aciertos += r.aciertos; pe.fallos += r.fallos; pe.reinicios += r.reinicios; if (r.reinicios > 0) pe.reinician++; }
      if (r.terminado) pe.terminan++;
    });
    puntosElegir.sort((a, b) => b - a);
    const puntos = puntosEstrella + puntosElegir.slice(0, tarea.nElegir).reduce((a, b) => a + b, 0);
    filas.push({
      numero, codigo, grupo: grupoDe(numero, grupos), existe, activo: existe && ultima >= desde, ultima,
      puntos, terminadosEstrella, terminadosElegir: Math.min(terminadosElegir, tarea.nElegir), terminadosHoy, fallos, reinicios,
      completa: terminadosEstrella === tarea.estrella.length && terminadosElegir >= tarea.nElegir,
    });
  }
  for (const pe of porEjercicio) {
    pe.ratioFallos = pe.aciertos + pe.fallos > 0 ? pe.fallos / (pe.aciertos + pe.fallos) : 0;
    pe.ratioReinicios = pe.intentan > 0 ? pe.reinician / pe.intentan : 0;
  }

  const alertas = [];
  const activos = filas.filter(f => f.activo).length;
  const hanEntrado = filas.filter(f => f.existe).length;
  if (activos < umbrales.parteActivaBaja * alumnos) {
    alertas.push(`Poca actividad: solo ${activos} de ${alumnos} alumnos han hecho algo en la ventana (${hanEntrado} han entrado alguna vez).`);
  }
  for (const f of filas) {
    if (f.existe && f.puntos === 0 && f.fallos >= umbrales.fallosSinPuntos) {
      alertas.push(`El alumno n.º ${f.numero} (${f.grupo}, código ${f.codigo}) lleva ${f.fallos} fallos y 0 puntos: puede que no se aclare.`);
    }
  }
  for (const pe of porEjercicio) {
    if (pe.intentan < umbrales.minimoIntentos) continue;
    const nombre = `${pe.slug} ej. ${pe.n}${pe.estrella ? ' ★' : ''}`;
    if (pe.ratioFallos >= umbrales.ratioFallosAlto) {
      alertas.push(`Ejercicio difícil o confuso: ${nombre}: ${Math.round(pe.ratioFallos * 100)} % de fallos entre ${pe.intentan} alumnos (${pe.aciertos} aciertos, ${pe.fallos} fallos).`);
    } else if (pe.ratioReinicios >= umbrales.ratioReiniciosAlto) {
      alertas.push(`Muchos reinicios: ${nombre}: ${pe.reinician} de ${pe.intentan} alumnos han perdido las 5 vidas alguna vez.`);
    }
  }
  return { alumnos: filas, ejercicios: porEjercicio, alertas, activos, hanEntrado, total: alumnos, desde, diaDesde };
}

const pct = (a, b) => (b ? `${Math.round((100 * a) / b)} %` : '—');

/** El informe en Markdown (en español, para Juan Luis). */
export function formatear(r, { tarea, ahora = Date.now(), horas = 24 } = {}) {
  const fecha = f => new Date(f).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const L = [];
  L.push(`# Actividad en las prácticas · ${fecha(ahora)} (hora peninsular)`);
  L.push('');
  L.push(`Tarea: ${tarea.titulo.es}. Ventana: últimas ${horas} h (desde ${fecha(r.desde)}).`);
  L.push('');
  L.push(r.alertas.length ? '## ⚠ Alertas' : '## Sin alertas');
  for (const a of r.alertas) L.push(`- ${a}`);
  L.push('');
  L.push('## Resumen');
  L.push(`- Han entrado alguna vez: **${r.hanEntrado} de ${r.total}** (${pct(r.hanEntrado, r.total)}).`);
  L.push(`- Activos en la ventana: **${r.activos}** (${pct(r.activos, r.total)}).`);
  const completas = r.alumnos.filter(f => f.completa).length;
  const terminadosHoy = r.alumnos.reduce((s, f) => s + f.terminadosHoy, 0);
  L.push(`- Tarea completa (100 puntos): **${completas}**. Ejercicios terminados en la ventana: ${terminadosHoy}.`);
  const porGrupo = new Map();
  for (const f of r.alumnos) {
    const g = porGrupo.get(f.grupo) ?? { total: 0, entrado: 0, activos: 0, completas: 0, puntos: 0 };
    g.total++; if (f.existe) g.entrado++; if (f.activo) g.activos++; if (f.completa) g.completas++; g.puntos += f.puntos;
    porGrupo.set(f.grupo, g);
  }
  if (porGrupo.size > 1) {
    L.push('');
    L.push('| Grupo | Alumnos | Han entrado | Activos | Completas | Puntos medios |');
    L.push('|---|---|---|---|---|---|');
    for (const [g, v] of porGrupo) L.push(`| ${g} | ${v.total} | ${v.entrado} | ${v.activos} | ${v.completas} | ${(v.puntos / v.total).toFixed(1)} |`);
  }
  L.push('');
  L.push('## Ejercicios de la tarea');
  L.push('| Ejercicio | Prueban | Terminan | Fallos | Reinician |');
  L.push('|---|---|---|---|---|');
  for (const e of r.ejercicios) {
    L.push(`| ${e.slug} ej. ${e.n}${e.estrella ? ' ★' : ''} | ${e.intentan} | ${e.terminan} | ${pct(e.fallos, e.aciertos + e.fallos)} (${e.fallos}) | ${e.reinician} |`);
  }
  L.push('');
  L.push('## Alumnos (número de lista · grupo · puntos de la tarea · ★ terminadas · fallos · última actividad)');
  const orden = [...r.alumnos].filter(f => f.existe).sort((a, b) => b.puntos - a.puntos || a.numero - b.numero);
  for (const f of orden) {
    L.push(`- ${f.numero} · ${f.grupo} · ${f.puntos} pt · ${f.terminadosEstrella}/${r.ejercicios.filter(e => e.estrella).length} ★ + ${f.terminadosElegir} · ${f.fallos} fallos · ${fecha(f.ultima)}${f.activo ? ' ✓ (activo en la ventana)' : ''}`);
  }
  if (!orden.length) L.push('- (nadie ha entrado todavía)');
  const nunca = r.alumnos.filter(f => !f.existe).map(f => f.numero);
  L.push('');
  L.push(nunca.length ? `Nunca han entrado (números de lista): ${nunca.join(', ')}.` : 'Todos han entrado alguna vez.');
  L.push('');
  L.push(`_Fuente: documentos practicas/<slug>--<código> de Firestore (día ${r.diaDesde} = ${fechaDeDia(r.diaDesde)} en adelante para «terminados en la ventana»)._`);
  return L.join('\n');
}

// --- Lectura de Firestore -----------------------------------------------------------

async function leerDocumento(slug, codigo) {
  const url = urlDocumento(slug, codigo);
  if (!url) throw new Error('Sin configuración de Firebase (src/config.js)');
  const r = await fetch(url);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${slug}--${codigo}`);
  const json = await r.json();
  const leido = leerDocumentoRest(json);
  return { ej: leido?.ej ?? [], actualizado: Number(json?.fields?.actualizado?.integerValue) || 0 };
}

async function leerTodos(slugs, alumnos, concurrencia = 8) {
  const pendientes = [];
  for (let i = 0; i < alumnos; i++) for (const slug of slugs) pendientes.push([slug, codigoAlumno(i)]);
  const docs = new Map();
  const errores = [];
  let k = 0;
  async function obrero() {
    while (k < pendientes.length) {
      const [slug, codigo] = pendientes[k++];
      try { docs.set(`${slug}--${codigo}`, await leerDocumento(slug, codigo)); }
      catch (e) { errores.push(`${slug}--${codigo}: ${e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: concurrencia }, obrero));
  return { docs, errores };
}

function argumento(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : porDefecto;
}

async function main() {
  const alumnos = Number(argumento('alumnos', 51));
  const tarea = tareaPorId(Number(argumento('tarea', 1)));
  const horas = Number(argumento('horas', 24));
  const grupos = leerGrupos(argumento('grupos', '1.º A:1-29,E1CB:30-46,E1DB:47-51'));
  if (!tarea) { console.error('Tarea desconocida'); process.exit(2); }
  const ahora = Date.now();
  const desde = ahora - horas * 3600 * 1000;
  const slugs = [...new Set(ejerciciosDe(tarea).map(e => e.slug))];
  const { docs, errores } = await leerTodos(slugs, alumnos);
  const resumen = agregar({ docs, tarea, alumnos, desde, grupos });
  console.log(formatear(resumen, { tarea, ahora, horas }));
  if (errores.length) {
    console.log(`\n⚠ ${errores.length} lecturas han fallado (el informe puede quedarse corto):`);
    for (const e of errores.slice(0, 10)) console.log(`- ${e}`);
  }
  if (process.argv.includes('--json')) console.log(JSON.stringify(resumen));
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch(e => { console.error(e); process.exit(1); });
}
