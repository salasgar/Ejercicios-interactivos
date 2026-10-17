#!/usr/bin/env node
// Informe de actividad de los alumnos en las prácticas (pedido por Juan Luis el
// 2026-10-16, para detectar pronto a quien no sabe entrar y los ejercicios que
// fallan demasiado). Lo ejecuta una rutina diaria en la nube, que le manda el
// resultado por correo; también vale a mano.
//
// Lee Firestore por REST **sin autenticación**: las reglas dejan leer con `get`
// cada documento (solo números, sin nombres), y los códigos de los alumnos salen
// de su número de lista (`codigoAlumno` en practicas/_comun/codigos.js). No lee
// `fallos/` ni lista colecciones: eso exige la cuenta del profesor y una rutina
// en la nube no la tiene. Los documentos son:
//   - `practicas/<slug>--<código>` en la tarea 1 (`progresoPorPractica`);
//   - `practicas-tareas/t<id>--<slug>--<código>` en las demás (modelo v2);
//   - `practicas-asignaciones/<código>` en las tareas `asignada`: solo cuentan
//     los alumnos asignados (los demás no entran en ninguna cifra ni alerta).
// Con plazo (`hasta`) el informe mide la entrega: a tiempo, N días tarde o sin
// entregar.
//
// Uso:
//   node herramientas/informe-actividad.mjs [--alumnos 51] [--tarea 1] [--horas 24]
//        [--grupos "1.º A:1-29,E1CB:30-46,E1DB:47-51"] [--json]
//
//   --alumnos  cuántas líneas tiene la lista del panel (los códigos 1..N)
//   --tarea    id de la tarea (practicas/_comun/tareas.js). Sin él, la tarea
//              obligatoria vigente por fecha (ver `tareaVigente`).
//   --horas    ventana de «actividad reciente» (desde hace tantas horas)
//   --grupos   nombre:desde-hasta por grupo, con los números de lista
//   --json     además del informe, el resumen completo en JSON (última línea)
//
// En el espacio de un profesor (varios profesores, tareas 68 y 70), con una cuenta
// lectora (LECTOR_EMAIL y LECTOR_CLAVE en el entorno):
//   node herramientas/informe-actividad.mjs --espacio <uid> [--alumnos 51 | --codigos <CSV>]
//        [--grupos …] [--tarea N] [--horas 24] [--json]
//   --alumnos  (Juan Luis, desde su paso al sistema nuevo) sus códigos de siempre 1..N
//   --codigos  el CSV de «Mis alumnos» (número y código; códigos de 4 u 8)
//   Sin ninguno de los dos, el informe no sabe quién no ha entrado.
//
// Las funciones de cálculo (resumirEjercicio, agregar, formatear) son puras y
// están probadas en tests/herramientas-informe.test.js.

import { codigoAlumno } from '../practicas/_comun/codigos.js';
import { TAREAS, tareaPorId, PUNTOS_POR_EJERCICIO, estadoTarea, estadoPlazo, diaDeFecha, configDeJSON } from '../practicas/_comun/tareas.js';
import {
  urlDocumento, leerDocumentoRest, leerAsignacion, idDocumentoPractica, idDocumentoTarea, COLECCION_TAREAS,
  leerConfig, leerAsignacionRest, coleccionEspacio,
} from '../practicas/_comun/nube.js';
import { firebaseConfig } from '../src/config.js';
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

/** Clave del Map de documentos de una práctica en una tarea: `slug--código` (tarea 1) o `t<id>--slug--código` (v2). */
export function claveDocumento(tarea, slug, codigo) {
  return tarea.progresoPorPractica ? idDocumentoPractica(slug, codigo) : idDocumentoTarea(tarea.id, slug, codigo);
}

/** 'AAAA-MM-DD' de un instante, en la hora peninsular (la de los alumnos y la de Juan Luis). */
export function fechaMadrid(ms) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ms));
}

/**
 * La tarea obligatoria vigente el día `hoy` ('AAAA-MM-DD'), para cuando no se
 * pasa `--tarea`: entre las publicadas con plazo (`hasta`) y no `asignada`
 * (obligatorias para todos), la de plazo abierto más próximo; si ninguna está
 * abierta, la última cuyo plazo venció. Devuelve { tarea, motivo }.
 */
export function tareaVigente(hoy, tareas = TAREAS) {
  const conPlazo = tareas.filter(t => t.hasta && !t.asignada).sort((a, b) => (a.hasta < b.hasta ? -1 : a.hasta > b.hasta ? 1 : a.id - b.id));
  const publicadas = conPlazo.filter(t => !t.desde || t.desde <= hoy);
  const abierta = publicadas.find(t => t.hasta >= hoy);
  if (abierta) return { tarea: abierta, motivo: `la obligatoria con el plazo abierto más próximo (hasta el ${abierta.hasta})` };
  if (publicadas.length) {
    const ultima = publicadas[publicadas.length - 1];
    return { tarea: ultima, motivo: `ninguna tiene el plazo abierto; la última que venció (el ${ultima.hasta})` };
  }
  const primera = conPlazo[0] ?? tareas[0];
  return { tarea: primera, motivo: 'ninguna tarea obligatoria publicada todavía; la primera con plazo' };
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
 *   docs     Map `claveDocumento(tarea, slug, codigo)` → { ej, actualizado } | null (null = no existe)
 *   tarea    la tarea (tareas.js)
 *   alumnos  cuántos (códigos 1..alumnos)
 *   desde    ms: desde cuándo cuenta como actividad reciente
 *   grupos   [{ nombre, desde, hasta }]
 *   asignaciones  Map código → { tareas: [ids] } | null; solo se mira si la tarea es `asignada`
 *   ahora    ms: «hoy», para el plazo y el retraso (por defecto, ahora mismo)
 */
export function agregar({ docs, tarea, alumnos, lista = null, listaCompleta = true, nombres = null, desde, grupos = [], asignaciones = null, ahora = Date.now(), umbrales = UMBRALES }) {
  // `lista` ([{ numero, codigo }]) sustituye a «los códigos 1..alumnos» del modo antiguo (en el espacio
  // de un profesor los códigos son secretos); `numero` puede ser null si no se conoce. `nombres`
  // (Map número → nombre) solo lo usa la pestaña «Hoy» del panel, que los tiene descifrados.
  const alumnosDe = lista ?? Array.from({ length: alumnos }, (_, i) => ({ numero: i + 1, codigo: codigoAlumno(i) }));
  const ejercicios = ejerciciosDe(tarea);
  const slugs = [...new Set(ejercicios.map(e => e.slug))];
  const porEjercicio = ejercicios.map(e => ({ ...e, intentan: 0, terminan: 0, aciertos: 0, fallos: 0, reinicios: 0, reinician: 0 }));
  const diaDesde = diaDe(new Date(desde));
  const hoyDia = diaDeFecha(fechaMadrid(ahora));
  const plazoVencido = Boolean(tarea.hasta) && hoyDia > diaDeFecha(tarea.hasta);
  const filas = [];
  let noAsignados = 0;
  for (const { numero, codigo } of alumnosDe) {
    if (tarea.asignada && !asignaciones?.get(codigo)?.tareas?.includes(tarea.id)) { noAsignados++; continue; }
    let existe = false, ultima = 0;
    const porSlug = new Map();
    for (const slug of slugs) {
      const d = docs.get(claveDocumento(tarea, slug, codigo));
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
    const estado = estadoTarea(tarea, (slug, n) => porSlug.get(slug)?.[n - 1] ?? null);
    const entrega = estadoPlazo(tarea, estado, hoyDia, true);
    filas.push({
      numero, codigo, ...(nombres?.get(numero) && { nombre: nombres.get(numero) }), grupo: numero ? grupoDe(numero, grupos) : '?', existe, activo: existe && ultima >= desde, ultima, entrega,
      puntos, terminadosEstrella, terminadosElegir: Math.min(terminadosElegir, tarea.nElegir), terminadosHoy, fallos, reinicios,
      completa: terminadosEstrella === tarea.estrella.length && terminadosElegir >= tarea.nElegir,
    });
  }
  for (const pe of porEjercicio) {
    pe.ratioFallos = pe.aciertos + pe.fallos > 0 ? pe.fallos / (pe.aciertos + pe.fallos) : 0;
    pe.ratioReinicios = pe.intentan > 0 ? pe.reinician / pe.intentan : 0;
  }

  const alertas = [];
  const total = filas.length;
  const activos = filas.filter(f => f.activo).length;
  const hanEntrado = filas.filter(f => f.existe).length;
  // Pasado el plazo es normal que casi nadie esté activo: no se avisa.
  if (listaCompleta && !plazoVencido && total > 0 && activos < umbrales.parteActivaBaja * total) {
    alertas.push(`Poca actividad: solo ${activos} de ${total} alumnos han hecho algo en la ventana (${hanEntrado} han entrado alguna vez).`);
  }
  for (const f of filas) {
    if (f.existe && f.puntos === 0 && f.fallos >= umbrales.fallosSinPuntos) {
      alertas.push(`${f.nombre ? `${f.nombre} (n.º ${f.numero}, código ${f.codigo})` : `El alumno ${f.numero ? `n.º ${f.numero}` : 'con código'} (${f.grupo}, código ${f.codigo})`} lleva ${f.fallos} fallos y 0 puntos: puede que no se aclare.`);
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
  // Entregas (solo en tareas obligatorias con plazo): a tiempo, con retraso, sin entregar.
  const conPlazo = Boolean(tarea.hasta) && filas.some(f => f.entrega.tipo !== 'repaso');
  const plazo = conPlazo ? {
    hasta: tarea.hasta,
    vencido: plazoVencido,
    aTiempo: filas.filter(f => f.entrega.entregada && !f.entrega.fueraDePlazo).length,
    conRetraso: filas.filter(f => f.entrega.entregada && f.entrega.fueraDePlazo).length,
    sinEntregar: filas.filter(f => !f.entrega.entregada).length,
  } : null;
  return { alumnos: filas, ejercicios: porEjercicio, alertas, activos, hanEntrado, total, noAsignados, plazo, desde, diaDesde, ...(listaCompleta ? {} : { listaCompleta }) };
}

/** «a tiempo», «3 días tarde» o «sin entregar» (vacío si la tarea no tiene plazo para el alumno). */
export function textoEntrega(e) {
  if (!e || e.tipo === 'repaso') return '';
  const dias = n => `${n} ${n === 1 ? 'día' : 'días'}`;
  if (e.entregada) return e.fueraDePlazo ? `entregada ${dias(e.diasRetraso)} tarde` : 'entregada a tiempo';
  return e.fueraDePlazo ? `sin entregar, ${dias(e.diasRetraso)} de retraso` : 'sin entregar';
}

const pct = (a, b) => (b ? `${Math.round((100 * a) / b)} %` : '—');

/** El informe en Markdown (en español, para Juan Luis). */
export function formatear(r, { tarea, ahora = Date.now(), horas = 24, motivo = null, fuente: fuenteTexto = null } = {}) {
  const fecha = f => new Date(f).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const L = [];
  L.push(`# Actividad en las prácticas · ${fecha(ahora)} (hora peninsular)`);
  L.push('');
  L.push(`Tarea: ${tarea.titulo.es}. Ventana: últimas ${horas} h (desde ${fecha(r.desde)}).`);
  if (motivo) L.push(`Tarea elegida automáticamente: ${motivo}.`);
  if (tarea.asignada) L.push(`Tarea asignada: cuentan solo los ${r.total} alumnos asignados (${r.noAsignados} no asignados, fuera de todas las cifras).`);
  L.push('');
  L.push(r.alertas.length ? '## ⚠ Alertas' : '## Sin alertas');
  for (const a of r.alertas) L.push(`- ${a}`);
  L.push('');
  L.push('## Resumen');
  L.push(`- Han entrado alguna vez: **${r.hanEntrado} de ${r.total}** (${pct(r.hanEntrado, r.total)}).`);
  L.push(`- Activos en la ventana: **${r.activos}** (${pct(r.activos, r.total)}).`);
  const completas = r.alumnos.filter(f => f.completa).length;
  const terminadosHoy = r.alumnos.reduce((s, f) => s + f.terminadosHoy, 0);
  const maximo = PUNTOS_POR_EJERCICIO * (tarea.estrella.length + tarea.nElegir);
  L.push(`- Tarea completa (${maximo} puntos): **${completas}**. Ejercicios terminados en la ventana: ${terminadosHoy}.`);
  if (r.plazo) {
    const p = r.plazo;
    L.push(p.vencido
      ? `- Plazo vencido (hasta el ${p.hasta}): **${p.aTiempo} a tiempo, ${p.conRetraso} con retraso, ${p.sinEntregar} sin entregar**.`
      : `- Plazo: hasta el ${p.hasta}. Entregadas: ${p.aTiempo}; sin entregar: ${p.sinEntregar}.`);
  }
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
    L.push(`- ${f.numero ?? f.codigo} · ${f.grupo} · ${f.puntos} pt · ${f.terminadosEstrella}/${r.ejercicios.filter(e => e.estrella).length} ★ + ${f.terminadosElegir} · ${f.fallos} fallos · ${fecha(f.ultima)}${f.activo ? ' ✓ (activo en la ventana)' : ''}${textoEntrega(f.entrega) ? ` · ${textoEntrega(f.entrega)}` : ''}`);
  }
  if (!orden.length) L.push('- (nadie ha entrado todavía)');
  const nunca = r.alumnos.filter(f => !f.existe).map(f => f.numero);
  L.push('');
  if (r.listaCompleta === false) L.push('No se sabe quién no ha entrado: el informe no tiene la lista de códigos del espacio (pásala con --codigos <CSV de «Mis alumnos»>).');
  else L.push(nunca.length ? `Nunca han entrado (números de lista): ${nunca.join(', ')}.` : 'Todos han entrado alguna vez.');
  L.push('');
  const fuente = fuenteTexto ?? (tarea.progresoPorPractica ? 'practicas/<slug>--<código>' : 'practicas-tareas/t<id>--<slug>--<código>');
  L.push(`_Fuente: documentos ${fuente} de Firestore (día ${r.diaDesde} = ${fechaDeDia(r.diaDesde)} en adelante para «terminados en la ventana»)._`);
  return L.join('\n');
}

// --- Datos del espacio de un profesor (varios profesores, tarea 68) -----------------
//
// Los mismos cálculos de arriba sirven a la pestaña «Hoy» del panel (en el navegador)
// y a `--espacio` (en Node). Los documentos llegan crudos, como los devuelven el SDK
// del panel y la lista REST de abajo: `{ id, estado, actualizado }` (`estado` es el JSON
// de la app) y, en las asignaciones, `{ id, tareas }`.

/** Documentos crudos de `progreso-libre` y `progreso-tareas` → Map id → { ej, actualizado } (lo ilegible se descarta). */
export function documentosAMapa(...listas) {
  const docs = new Map();
  for (const doc of listas.flat()) {
    try {
      const estado = JSON.parse(doc.estado);
      if (Array.isArray(estado?.ej)) docs.set(String(doc.id), { ej: estado.ej, actualizado: Number(doc.actualizado) || 0 });
    } catch { /* un documento ilegible no cuenta */ }
  }
  return docs;
}

/** Asignaciones crudas ({ id: código, tareas: [ids] }) → Map código → { tareas }. */
export function asignacionesAMapa(crudas) {
  const mapa = new Map();
  for (const a of crudas ?? []) if (Array.isArray(a?.tareas)) mapa.set(String(a.id), { tareas: a.tareas.map(Number).filter(Number.isInteger) });
  return mapa;
}

/** Los códigos del profesor (`listarMisCodigos`: [{ id, n }]) → [{ numero, codigo }] por número de lista. */
export function listaDeCodigos(codigos) {
  return (codigos ?? []).filter(c => typeof c?.id === 'string' && Number.isInteger(c?.n) && c.n >= 1)
    .map(c => ({ numero: c.n, codigo: c.id })).sort((a, b) => a.numero - b.numero);
}

/**
 * La lista de códigos de un CSV de «Mis alumnos» (número, nombre, código, enlace): solo
 * se leen el número y el código, no los nombres. Acepta `,` o `;` y comillas.
 */
export function leerCsvCodigos(texto) {
  const lista = [];
  const deCodigo = c => c.replace(/-/g, '').toUpperCase();
  const es8 = c => /^[A-HJ-NP-Z2-9]{8}$/.test(c);
  const es4u8 = c => /^[A-HJ-NP-Z2-9]{4}(?:[A-HJ-NP-Z2-9]{4})?$/.test(c);
  for (const linea of String(texto ?? '').split(/\r?\n/)) {
    const campos = camposCsv(linea);
    const numero = Number(campos[0]);
    // De 8 o de 4 (tarea 72: los de Juan Luis son los de siempre). Uno de 4 solo se
    // toma de la columna «Código» o del enlace (?c=…): un nombre como «Juan» también
    // son cuatro letras del alfabeto.
    const columna = deCodigo(campos[2] ?? '');
    const enlace = campos.map(c => c.match(/[?&]c=([A-Za-z0-9]{4,8})(?:[&#]|$)/)?.[1]).find(Boolean);
    const codigo = es4u8(columna) ? columna
      : campos.map(deCodigo).find(es8) ?? (enlace && es4u8(deCodigo(enlace)) ? deCodigo(enlace) : null);
    if (Number.isInteger(numero) && numero >= 1 && codigo) lista.push({ numero, codigo });
  }
  return lista.sort((a, b) => a.numero - b.numero);
}

/** Los campos de una línea CSV, con `,` o `;` y comillas (dentro de comillas, ni el separador ni `""` cortan). */
function camposCsv(linea) {
  const campos = [];
  let actual = '', comillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (comillas) {
      if (c === '"' && linea[i + 1] === '"') { actual += '"'; i++; }
      else if (c === '"') comillas = false;
      else actual += c;
    } else if (c === '"') comillas = true;
    else if (c === ',' || c === ';') { campos.push(actual.trim()); actual = ''; }
    else actual += c;
  }
  campos.push(actual.trim());
  return campos;
}

/**
 * Los códigos de siempre de los números 1..N (`codigoAlumno`): la lista de Juan Luis
 * en su espacio (tarea 70: sus alumnos conservan los códigos de 4 del modo antiguo).
 */
export function listaDeSiempre(alumnos) {
  return Array.from({ length: alumnos }, (_, i) => ({ numero: i + 1, codigo: codigoAlumno(i) }));
}

/** Sin lista de códigos: los que aparecen en los documentos (el último trozo del id), sin número de lista. */
export function listaDeDocumentos(docs, asignaciones = null) {
  const codigos = new Set();
  for (const id of docs.keys()) codigos.add(id.split('--').at(-1));
  for (const c of asignaciones?.keys() ?? []) codigos.add(c);
  return [...codigos].sort().map(codigo => ({ numero: null, codigo }));
}

// --- Lectura de Firestore -----------------------------------------------------------

async function leerDocumento(tarea, slug, codigo) {
  const url = urlDocumento(slug, codigo, undefined, tarea.progresoPorPractica ? {} : { coleccion: COLECCION_TAREAS, id: idDocumentoTarea(tarea.id, slug, codigo) });
  if (!url) throw new Error('Sin configuración de Firebase (src/config.js)');
  const r = await fetch(url);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${claveDocumento(tarea, slug, codigo)}`);
  const json = await r.json();
  const leido = leerDocumentoRest(json);
  return { ej: leido?.ej ?? [], actualizado: Number(json?.fields?.actualizado?.integerValue) || 0 };
}

async function leerTodos(tarea, slugs, alumnos, concurrencia = 8) {
  // Primero las asignaciones (si la tarea es `asignada`): los no asignados no se leen.
  const asignaciones = new Map();
  if (tarea.asignada) {
    const codigos = Array.from({ length: alumnos }, (_, i) => codigoAlumno(i));
    let j = 0;
    await Promise.all(Array.from({ length: concurrencia }, async () => {
      while (j < codigos.length) { const c = codigos[j++]; asignaciones.set(c, await leerAsignacion(c)); }
    }));
  }
  const pendientes = [];
  for (let i = 0; i < alumnos; i++) {
    const codigo = codigoAlumno(i);
    if (tarea.asignada && !asignaciones.get(codigo)?.tareas?.includes(tarea.id)) continue;
    for (const slug of slugs) pendientes.push([slug, codigo]);
  }
  const docs = new Map();
  const errores = [];
  let k = 0;
  async function obrero() {
    while (k < pendientes.length) {
      const [slug, codigo] = pendientes[k++];
      try { docs.set(claveDocumento(tarea, slug, codigo), await leerDocumento(tarea, slug, codigo)); }
      catch (e) { errores.push(`${claveDocumento(tarea, slug, codigo)}: ${e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: concurrencia }, obrero));
  return { docs, errores, asignaciones };
}

// Con `--espacio <uid>`: una cuenta de solo lectura (correo y contraseña de Firebase, en las
// variables de entorno LECTOR_EMAIL y LECTOR_CLAVE) que el profesor ha añadido como lectora
// de su espacio. Inicio de sesión y lectura por REST, sin el SDK.

/** Inicia sesión con correo y contraseña; devuelve el token. Los errores no repiten la contraseña. */
async function iniciarSesion(email, clave) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: clave, returnSecureToken: true }),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok || !json.idToken) throw new Error(`No se ha podido iniciar sesión con la cuenta lectora (HTTP ${r.status}: ${json?.error?.message ?? 'sin detalle'})`);
  return json.idToken;
}

/** Todos los documentos de una subcolección del espacio, crudos como los da el SDK; 403 si la cuenta no es lectora. */
export async function listarSubcoleccion(uid, sub, token, { pedir = globalThis.fetch, config = firebaseConfig } = {}) {
  const base = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${coleccionEspacio(uid, sub)}`;
  const docs = [];
  let pagina = '';
  do {
    const r = await pedir(`${base}?pageSize=300${pagina}`, { headers: { Authorization: `Bearer ${token}` } });
    if (r.status === 403) throw new Error(`Sin permiso para leer «${sub}» del espacio (403): la cuenta no es lectora de ese espacio`);
    if (!r.ok) throw new Error(`HTTP ${r.status} al leer «${sub}»`);
    const json = await r.json();
    for (const d of json.documents ?? []) {
      const f = d.fields ?? {};
      docs.push({
        id: d.name.split('/').at(-1),
        estado: f.estado?.stringValue,
        actualizado: Number(f.actualizado?.integerValue) || 0,
        ...(sub === 'asignaciones' ? leerAsignacionRest(d) : {}),
      });
    }
    pagina = json.nextPageToken ? `&pageToken=${encodeURIComponent(json.nextPageToken)}` : '';
  } while (pagina);
  return docs;
}

function argumento(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : porDefecto;
}

/** El informe de un espacio (`--espacio`): tareas del profesor, documentos del espacio, lista de códigos del CSV si se da. */
async function mainEspacio(uid) {
  const email = process.env.LECTOR_EMAIL;
  const clave = process.env.LECTOR_CLAVE;
  if (!email || !clave) { console.error('Faltan LECTOR_EMAIL y LECTOR_CLAVE (variables de entorno) para --espacio'); process.exit(2); }
  const horas = Number(argumento('horas', 24));
  const grupos = leerGrupos(argumento('grupos', ''));
  const ahora = Date.now();
  const lectura = await leerConfig(uid);
  if (lectura.estado !== 'ok') { console.error(`No se ha podido leer la configuración de tareas del espacio (${lectura.estado})`); process.exit(1); }
  const tareas = configDeJSON(lectura.json)?.tareas ?? [];
  const idPedido = argumento('tarea', null);
  const elegida = idPedido === null ? tareaVigente(fechaMadrid(ahora), tareas) : { tarea: tareaPorId(Number(idPedido), tareas), motivo: null };
  const { tarea, motivo } = elegida;
  if (!tarea) { console.error('Ese espacio no tiene esa tarea (o no tiene ninguna)'); process.exit(2); }
  const token = await iniciarSesion(email, clave);
  const [libre, deTareas, crudasAsignaciones] = await Promise.all(['progreso-libre', 'progreso-tareas', 'asignaciones'].map(s => listarSubcoleccion(uid, s, token)));
  const docs = documentosAMapa(libre, deTareas);
  const asignaciones = asignacionesAMapa(crudasAsignaciones);
  const csv = argumento('codigos', null);
  // `node:fs` solo se pide aquí: este módulo también lo importa el navegador (pestaña «Hoy»).
  const listaCsv = csv ? leerCsvCodigos((await import('node:fs')).readFileSync(csv, 'utf8')) : [];
  // `--alumnos N` (sin CSV): los códigos de siempre 1..N, los del espacio de Juan Luis (tarea 70).
  const alumnos = Number(argumento('alumnos', 0));
  const listaFija = listaCsv.length ? listaCsv : alumnos > 0 ? listaDeSiempre(alumnos) : [];
  const listaCompleta = listaFija.length > 0;
  const lista = listaCompleta ? listaFija : listaDeDocumentos(docs, tarea.asignada ? asignaciones : null);
  const resumen = agregar({ docs, tarea, lista, listaCompleta, desde: ahora - horas * 3600 * 1000, grupos, asignaciones, ahora });
  console.log(formatear(resumen, { tarea, ahora, horas, motivo, fuente: `practicas-espacios/${uid}/progreso-tareas y progreso-libre (cuenta lectora)` }));
  if (process.argv.includes('--json')) console.log(JSON.stringify(resumen));
}

async function main() {
  const espacio = argumento('espacio', null);
  if (espacio) return mainEspacio(espacio);
  const alumnos = Number(argumento('alumnos', 51));
  const horas = Number(argumento('horas', 24));
  const grupos = leerGrupos(argumento('grupos', '1.º A:1-29,E1CB:30-46,E1DB:47-51'));
  const ahora = Date.now();
  const idPedido = argumento('tarea', null);
  const elegida = idPedido === null ? tareaVigente(fechaMadrid(ahora)) : { tarea: tareaPorId(Number(idPedido)), motivo: null };
  const { tarea, motivo } = elegida;
  if (!tarea) { console.error('Tarea desconocida'); process.exit(2); }
  const desde = ahora - horas * 3600 * 1000;
  const slugs = [...new Set(ejerciciosDe(tarea).map(e => e.slug))];
  const { docs, errores, asignaciones } = await leerTodos(tarea, slugs, alumnos);
  const resumen = agregar({ docs, tarea, alumnos, desde, grupos, asignaciones, ahora });
  console.log(formatear(resumen, { tarea, ahora, horas, motivo }));
  if (errores.length) {
    console.log(`\n⚠ ${errores.length} lecturas han fallado (el informe puede quedarse corto):`);
    for (const e of errores.slice(0, 10)) console.log(`- ${e}`);
  }
  if (process.argv.includes('--json')) console.log(JSON.stringify(resumen));
}

// En el navegador (pestaña «Hoy») `process` no existe: solo se ejecuta como programa en Node.
if (typeof process !== 'undefined' && process.argv?.[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch(e => { console.error(e); process.exit(1); });
}
