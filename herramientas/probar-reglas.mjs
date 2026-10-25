#!/usr/bin/env node
// Banco de pruebas de las reglas de Firestore de los espacios de los profesores
// (tarea 61 del reparto PU2; diseño en reparto-practicas-u2/salidas/57-diseno-
// varios-profesores/DISENO.md, C.2 y C.3). Comprueba por REST, en el proyecto
// real y con las reglas ya publicadas, que cada profesor ve lo suyo y no lo del
// otro, que el alumno sin cuenta solo llega a lo de su código y, desde la tarea
// 71, que las colecciones del modo antiguo (practicas, practicas-tareas,
// practicas-asignaciones, fallos y divisores) no se leen ni se escriben. Sin
// emulador: este Mac no tiene Java.
//
// Necesita dos cuentas de prueba de correo y contraseña, creadas en la consola
// (Authentication → Users) y dadas de alta a mano como profesores
// (practicas-profesores/<uid> = { activo: true, alta: 1 }). Sus correos y
// contraseñas se pasan por variables de entorno y no se escriben en ningún
// fichero:
//
//   PROFE_A_EMAIL=… PROFE_A_CLAVE=… PROFE_B_EMAIL=… PROFE_B_CLAVE=… \
//     node herramientas/probar-reglas.mjs [--dejar] [--baja]
//
//   --dejar  no borra al final los datos de prueba (para mirarlos en la consola)
//   --baja   B está de baja (activo: false en la consola): solo comprueba que
//            un profesor de baja no entra en su espacio
//
// Además crea por REST una tercera cuenta desechable, «sin alta», y la borra al
// terminar. Los datos de prueba llevan códigos inventados de 8 caracteres que
// empiezan por ZZ y, desde la tarea 72, de 4 que empiezan por ZZ (nunca uno
// de los 1024 calculables, que son los de los alumnos de Juan Luis). Además, si
// nadie lo tiene registrado, registra un rato en el espacio de A el código de
// prueba 60 (7NPD, calculable) y lo borra.
// No imprime uids, correos ni contraseñas. Termina con código 1 si alguna
// comprobación no da lo esperado.

import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { firebaseConfig } from '../src/config.js';
import { leerCodigoAlumno } from '../practicas/_comun/codigos.js';

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // el de practicas/_comun/codigos.js
const { apiKey, projectId } = firebaseConfig;
const BASE = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const AUTH = 'https://identitytoolkit.googleapis.com/v1/accounts';
const DEJAR = process.argv.includes('--dejar');
const BAJA = process.argv.includes('--baja');

// --- Utilidades ----------------------------------------------------------------------

function azar(n, alfabeto = ALFABETO) {
  const v = webcrypto.getRandomValues(new Uint8Array(n));
  return [...v].map(x => alfabeto[x % alfabeto.length]).join('');
}
const codigoPrueba = () => `ZZ${azar(6)}`;
/** Código de prueba de 4 (tarea 72): ZZ + 2, nunca uno de los 1024 calculables (los de los alumnos de Juan Luis). */
function codigoPrueba4() {
  for (;;) { const c = `ZZ${azar(2)}`; if (leerCodigoAlumno(c) === null) return c; }
}
/** El código de prueba 60, calculable (nunca el de un alumno). */
const ANTIGUO_PRUEBA = '7NPD';
const N_ANTIGUO_PRUEBA = 60;

/** Un valor JS en el formato de Firestore REST. */
function valor(v) {
  if (typeof v === 'boolean') return { booleanValue: v };
  if (Number.isInteger(v)) return { integerValue: String(v) };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(valor) } };
  return { stringValue: String(v) };
}
const campos = obj => ({ fields: Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, valor(v)])) });

async function peticion(metodo, ruta, { quien = null, cuerpo, consulta = '' } = {}) {
  const sep = consulta ? '&' : '';
  const url = `${BASE}${ruta ? `/${ruta}` : ''}?${consulta}${sep}key=${apiKey}`;
  const headers = { 'Content-Type': 'application/json' };
  if (quien?.token) headers.Authorization = `Bearer ${quien.token}`;
  const r = await fetch(url, { method: metodo, headers, body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo) });
  let json = null;
  try { json = await r.json(); } catch { /* DELETE devuelve vacío */ }
  return { status: r.status, json };
}
const leer = (ruta, quien) => peticion('GET', ruta, { quien });
const listar = (ruta, quien) => peticion('GET', ruta, { quien, consulta: 'pageSize=50' });
const escribir = (ruta, datos, quien) => peticion('PATCH', ruta, { quien, cuerpo: campos(datos) });
const borrar = (ruta, quien) => peticion('DELETE', ruta, { quien });
function crearEn(coleccion, id, datos, quien) {
  return peticion('POST', coleccion, { quien, cuerpo: campos(datos), consulta: `documentId=${encodeURIComponent(id)}` });
}
/** Consulta practicas-alumnos con profesor == uid (la única forma de listarla). */
function consultarCodigos(uid, quien) {
  const structuredQuery = { from: [{ collectionId: 'practicas-alumnos' }] };
  if (uid) structuredQuery.where = { fieldFilter: { field: { fieldPath: 'profesor' }, op: 'EQUAL', value: { stringValue: uid } } };
  return fetch(`${BASE}:runQuery?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(quien?.token ? { Authorization: `Bearer ${quien.token}` } : {}) },
    body: JSON.stringify({ structuredQuery }),
  }).then(async r => ({ status: r.status, json: await r.json().catch(() => null) }));
}

async function entrar(email, clave) {
  const r = await fetch(`${AUTH}:signInWithPassword?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: clave, returnSecureToken: true }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`no se pudo iniciar sesión con ${email.replace(/^(.).*@/, '$1…@')}: ${j?.error?.message ?? r.status}`);
  return { token: j.idToken, uid: j.localId, email: j.email };
}
/** Cuenta desechable «sin alta» (null si el proyecto no deja crear cuentas por REST). */
async function cuentaDesechable() {
  const email = `zz-sin-alta-${azar(8, 'abcdefghijkmnpqrstuvwxyz23456789')}@example.com`;
  const r = await fetch(`${AUTH}:signUp?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: azar(24), returnSecureToken: true }),
  });
  const j = await r.json();
  if (!r.ok) return { error: j?.error?.message ?? String(r.status) };
  return { token: j.idToken, uid: j.localId, email: j.email };
}
async function borrarCuenta(cuenta) {
  const r = await fetch(`${AUTH}:delete?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: cuenta.token }),
  });
  return r.ok;
}

// --- Registro de comprobaciones -------------------------------------------------------

const filas = [];
let seccion = '';
const titulo = t => { seccion = t; };
/** esperado: un número o una lista de números aceptables. extra(respuesta) → texto o null; si devuelve {fallo}, cuenta como ✗. */
async function comprobar(nombre, esperado, accion, extra = null) {
  const lista = [].concat(esperado);
  let obtenido, ok, nota = '';
  try {
    const r = await accion();
    obtenido = r.status;
    ok = lista.includes(r.status);
    if (extra && ok) {
      const e = extra(r);
      if (e && typeof e === 'object' && e.fallo) { ok = false; nota = e.fallo; } else if (e) nota = e;
    }
    if (!ok && !nota) nota = r.json?.error?.status ?? r.json?.[0]?.error?.status ?? '';
  } catch (err) {
    obtenido = 'error'; ok = false; nota = err.message;
  }
  filas.push({ seccion, nombre, esperado: lista.join(' o '), obtenido, ok, nota });
  return ok;
}
function omitir(nombre, motivo) {
  filas.push({ seccion, nombre, esperado: '—', obtenido: 'omitida', ok: true, nota: motivo });
}

function imprimir() {
  const ancho = Math.max(...filas.map(f => f.nombre.length), 20);
  let ultima = '';
  for (const f of filas) {
    if (f.seccion !== ultima) { console.log(`\n## ${f.seccion}\n`); ultima = f.seccion; console.log(`${'comprobación'.padEnd(ancho)} · esperado · obtenido · ✓/✗`); }
    const marca = f.obtenido === 'omitida' ? '–' : f.ok ? '✓' : '✗';
    console.log(`${f.nombre.padEnd(ancho)} · ${String(f.esperado).padEnd(8)} · ${String(f.obtenido).padEnd(8)} · ${marca}${f.nota ? `  (${f.nota})` : ''}`);
  }
}

// --- Comprobaciones estáticas (sin red) -----------------------------------------------

function estaticas() {
  titulo('Lectura de firestore.rules (sin red)');
  const reglas = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
  const inicio = reglas.indexOf('===== Varios profesores');
  const espacio = reglas.slice(reglas.indexOf('match /practicas-espacios/{uid}', inicio));
  const subcolecciones = [...espacio.matchAll(/match \/([a-z-]+)\/\{/g)].map(m => m[1]);
  const recursivos = [...reglas.matchAll(/match \/\{[a-zA-Z]+=\*\*\}\/([a-zA-Z0-9_-]+)\//g)].map(m => m[1]);
  const ok = (nombre, cond, nota = '') => filas.push({ seccion, nombre, esperado: 'sí', obtenido: cond ? 'sí' : 'no', ok: cond, nota });
  ok('la sección nueva va después de match /tareas/', inicio > reglas.indexOf('match /tareas/{tareaId}'));
  ok('esAdmin/esProfesor no aparecen en el espacio', !/esAdmin\(|esProfesor\(/.test(espacio), 'el administrador no lee lo de otros');
  ok('ningún comodín ** alcanza el espacio', !subcolecciones.some(s => recursivos.includes(s)), `subcolecciones: ${subcolecciones.join(', ')}; comodines: ${recursivos.join(', ')}`);
  // Tarea 71: fuera del espacio, ningún bloque de las colecciones del modo antiguo.
  const fuera = reglas.slice(0, reglas.indexOf('match /practicas-espacios/{uid}', inicio));
  const viejas = ['practicas', 'practicas-tareas', 'practicas-asignaciones', 'fallos', 'divisores'].filter(c => fuera.includes(`match /${c}/{`));
  ok('sin reglas para las colecciones del modo antiguo', !viejas.length, viejas.length ? `quedan: ${viejas.join(', ')}` : '');
}

// --- Comprobaciones por REST ----------------------------------------------------------

async function main() {
  estaticas();
  const env = process.env;
  const faltan = ['PROFE_A_EMAIL', 'PROFE_A_CLAVE', 'PROFE_B_EMAIL', 'PROFE_B_CLAVE'].filter(k => !env[k]);
  if (faltan.length) {
    imprimir();
    console.error(`\nFaltan variables de entorno: ${faltan.join(', ')}. Solo se han hecho las comprobaciones sin red.`);
    process.exit(2);
  }
  const A = await entrar(env.PROFE_A_EMAIL, env.PROFE_A_CLAVE);
  const B = await entrar(env.PROFE_B_EMAIL, env.PROFE_B_CLAVE);
  const anon = null;
  const ahora = Date.now();
  const esp = uid => `practicas-espacios/${uid}`;

  if (BAJA) {
    titulo('Profesor de baja (B con activo: false)');
    const cod = codigoPrueba();
    await comprobar('B lee su alta (de baja)', 200, () => leer(`practicas-profesores/${B.uid}`, B),
      r => (r.json?.fields?.activo?.booleanValue === false ? 'activo: false' : { fallo: 'B no está de baja en la consola' }));
    await comprobar('B crea un código', 403, () => escribir(`practicas-alumnos/${cod}`, { profesor: B.uid, n: 1, alta: ahora }, B));
    await comprobar('B escribe su configuración', 403, () => escribir(`${esp(B.uid)}/config/tareas`, { json: '{}', actualizado: ahora }, B));
    await comprobar('B lista su progreso libre', 403, () => listar(`${esp(B.uid)}/progreso-libre`, B));
    await comprobar('B lista sus códigos (consulta)', 403, () => consultarCodigos(B.uid, B));
    return terminar([]);
  }

  // Códigos inventados: dos de A, uno de B, uno que no existe.
  const cA1 = codigoPrueba(), cA2 = codigoPrueba(), cB1 = codigoPrueba(), cX = codigoPrueba();
  // Y de 4 (tarea 72): dos de A y uno de B.
  const cA4 = codigoPrueba4(), cB4 = codigoPrueba4();
  let cA4b = codigoPrueba4();
  while (cA4b === cA4 || cA4b === cB4) cA4b = codigoPrueba4();
  if (cB4 === cA4) throw new Error('dos códigos de prueba de 4 iguales: vuelve a lanzarlo');

  // Tarea 71: las colecciones del modo antiguo ya no tienen reglas. Nadie las lee (get ni
  // lista) ni las escribe, ni sin cuenta ni con una de profesor. Con el código de prueba 60
  // (7NPD) y datos que las reglas de antes sí habrían dejado escribir: si alguna da 200, las
  // reglas publicadas aún son las viejas.
  titulo('Colecciones del modo antiguo, cerradas (tarea 71)');
  const viejas = [
    ['practicas', 'semaforo--7NPD', { estado: '{"ej":[]}', actualizado: ahora }],
    ['practicas-tareas', 't2--semaforo--7NPD', { estado: '{"ej":[]}', actualizado: ahora }],
    ['practicas-asignaciones', '7NPD', { tareas: [2], actualizado: ahora }],
    ['fallos', `7NPD-${ahora.toString(36)}-abcd`, { v: 1, alumno: '7NPD', practica: 'semaforo', ejercicio: 2, t: ahora, dia: 0, idioma: 'es', item: 'Prueba de reglas', feedback: 'Prueba de reglas', repeticion: false }],
    ['divisores', '7NPD', { estado: '{}', actualizado: ahora }],
  ];
  for (const [coleccion, id, datos] of viejas) {
    for (const [quien, cuenta] of [['sin cuenta', anon], ['A', A]]) {
      await comprobar(`${quien}: get ${coleccion}/${id}`, 403, () => leer(`${coleccion}/${id}`, cuenta));
      await comprobar(`${quien}: lista ${coleccion}`, 403, () => listar(coleccion, cuenta));
      await comprobar(`${quien}: crea en ${coleccion}`, 403, () => crearEn(coleccion, id, datos, cuenta));
    }
  }

  titulo('Alta de profesores');
  const altaA = await comprobar('A lee su alta', 200, () => leer(`practicas-profesores/${A.uid}`, A),
    r => (r.json?.fields?.activo?.booleanValue === true ? 'activo: true' : { fallo: 'A no tiene activo: true' }));
  const altaB = await comprobar('B lee su alta', 200, () => leer(`practicas-profesores/${B.uid}`, B),
    r => (r.json?.fields?.activo?.booleanValue === true ? 'activo: true' : { fallo: 'B no tiene activo: true' }));
  if (!altaA || !altaB) {
    imprimir();
    console.error('\nA o B no están dados de alta: crea practicas-profesores/<uid> con activo: true (booleano) y alta: 1 (número) en la consola.');
    process.exit(1);
  }
  await comprobar('A lee el alta de B', 403, () => leer(`practicas-profesores/${B.uid}`, A));
  await comprobar('A lista practicas-profesores', 403, () => listar('practicas-profesores', A));
  await comprobar('sin cuenta: lee el alta de A', 403, () => leer(`practicas-profesores/${A.uid}`, anon));
  await comprobar('A se escribe su propia alta', 403, () => escribir(`practicas-profesores/${A.uid}`, { activo: true, alta: 2 }, A));
  await comprobar('A lista practicas-solicitudes', 403, () => listar('practicas-solicitudes', A));

  const C = await cuentaDesechable();
  const solicitudes = [];
  if (C.error) {
    for (const n of ['C (sin alta) deja su solicitud', 'C lee su solicitud', 'A lee la solicitud de C', 'C deja una solicitud a nombre de A',
      'C deja su solicitud con otro correo', 'C se escribe su alta', 'C crea un código', 'C crea su espacio', 'C escribe su configuración']) omitir(n, `sin cuenta desechable: ${C.error}`);
  } else {
    await comprobar('C (sin alta) deja su solicitud', 200, () => escribir(`practicas-solicitudes/${C.uid}`, { email: C.email, nombre: 'Prueba sin alta', pedido: ahora }, C));
    solicitudes.push('C');
    await comprobar('C lee su solicitud', 200, () => leer(`practicas-solicitudes/${C.uid}`, C));
    await comprobar('A lee la solicitud de C', 403, () => leer(`practicas-solicitudes/${C.uid}`, A));
    await comprobar('C deja una solicitud a nombre de A', 403, () => escribir(`practicas-solicitudes/${A.uid}`, { email: C.email, nombre: 'Ajena', pedido: ahora }, C));
    await comprobar('C deja su solicitud con otro correo', 403, () => escribir(`practicas-solicitudes/${C.uid}`, { email: 'otro@example.com', nombre: 'Otro', pedido: ahora }, C));
    await comprobar('C se escribe su alta', 403, () => escribir(`practicas-profesores/${C.uid}`, { activo: true, alta: 1 }, C));
    await comprobar('C crea un código', 403, () => escribir(`practicas-alumnos/${codigoPrueba()}`, { profesor: C.uid, n: 1, alta: ahora }, C));
    await comprobar('C crea su espacio', 403, () => escribir(esp(C.uid), { lectores: [], actualizado: ahora }, C));
    await comprobar('C escribe su configuración', 403, () => escribir(`${esp(C.uid)}/config/tareas`, { json: '{}', actualizado: ahora }, C));
  }

  titulo('Códigos de los alumnos (practicas-alumnos)');
  await comprobar('A crea un código suyo (n.º 1)', 200, () => escribir(`practicas-alumnos/${cA1}`, { profesor: A.uid, n: 1, alta: ahora }, A));
  await comprobar('A crea otro (n.º 2)', 200, () => escribir(`practicas-alumnos/${cA2}`, { profesor: A.uid, n: 2, alta: ahora }, A));
  await comprobar('B crea un código suyo (n.º 1)', 200, () => escribir(`practicas-alumnos/${cB1}`, { profesor: B.uid, n: 1, alta: ahora }, B));
  await comprobar('B se queda un código de A', 403, () => escribir(`practicas-alumnos/${cA1}`, { profesor: B.uid, n: 1, alta: ahora }, B));
  await comprobar('A crea un código a nombre de B', 403, () => escribir(`practicas-alumnos/${cX}`, { profesor: B.uid, n: 3, alta: ahora }, A));
  await comprobar('A crea un código con I y O', 403, () => escribir('practicas-alumnos/ZZIOIOIO', { profesor: A.uid, n: 3, alta: ahora }, A));
  await comprobar('A crea un código de 5', 403, () => escribir('practicas-alumnos/ZZABC', { profesor: A.uid, n: 3, alta: ahora }, A));
  await comprobar('A crea un código de 7', 403, () => escribir('practicas-alumnos/ZZABCDE', { profesor: A.uid, n: 3, alta: ahora }, A));
  await comprobar('A crea con n = 0', 403, () => escribir(`practicas-alumnos/${cX}`, { profesor: A.uid, n: 0, alta: ahora }, A));
  await comprobar('A crea con n = 1024', 403, () => escribir(`practicas-alumnos/${cX}`, { profesor: A.uid, n: 1024, alta: ahora }, A));
  await comprobar('A cambia su n.º 2 a 1023', 200, () => escribir(`practicas-alumnos/${cA2}`, { profesor: A.uid, n: 1023, alta: ahora }, A));
  await comprobar('A lo cambia a 1024', 403, () => escribir(`practicas-alumnos/${cA2}`, { profesor: A.uid, n: 1024, alta: ahora }, A));
  await comprobar('A lo deja en 2', 200, () => escribir(`practicas-alumnos/${cA2}`, { profesor: A.uid, n: 2, alta: ahora }, A));
  await comprobar('A crea con un campo de más', 403, () => escribir(`practicas-alumnos/${cX}`, { profesor: A.uid, n: 3, alta: ahora, nombre: 'x' }, A));
  await comprobar('sin cuenta: get de un código', 200, () => leer(`practicas-alumnos/${cA1}`, anon),
    r => (r.json?.fields?.n?.integerValue === '1' ? 'n = 1' : { fallo: 'no trae n = 1' }));
  await comprobar('sin cuenta: get de un código que no existe', 404, () => leer(`practicas-alumnos/${cX}`, anon));
  await comprobar('sin cuenta: crea un código', 403, () => escribir(`practicas-alumnos/${cX}`, { profesor: A.uid, n: 3, alta: ahora }, anon));
  await comprobar('A consulta sus códigos (profesor == A)', 200, () => consultarCodigos(A.uid, A), r => {
    const docs = (r.json ?? []).filter(x => x.document).map(x => x.document);
    const deA = docs.every(d => d.fields?.profesor?.stringValue === A.uid);
    const ids = docs.map(d => d.name.split('/').pop());
    return deA && ids.includes(cA1) && ids.includes(cA2) && !ids.includes(cB1) ? `${docs.length} códigos, todos de A` : { fallo: 'trae códigos ajenos o le faltan los suyos' };
  });
  await comprobar('A lista practicas-alumnos sin filtro', 403, () => listar('practicas-alumnos', A));
  await comprobar('A consulta los códigos de B', 403, () => consultarCodigos(B.uid, A));
  await comprobar('sin cuenta: consulta los códigos de A', 403, () => consultarCodigos(A.uid, anon));
  await comprobar('B borra un código de A', 403, () => borrar(`practicas-alumnos/${cA1}`, B));

  titulo('Espacio del profesor');
  await comprobar('A lista su progreso libre sin espacio creado', 200, () => listar(`${esp(A.uid)}/progreso-libre`, A));
  await comprobar('A crea su espacio', 200, () => escribir(esp(A.uid), { lectores: [], actualizado: ahora }, A));
  await comprobar('A lee su espacio', 200, () => leer(esp(A.uid), A));
  await comprobar('B lee el espacio de A', 403, () => leer(esp(A.uid), B));
  await comprobar('B escribe el espacio de A', 403, () => escribir(esp(A.uid), { lectores: [B.uid], actualizado: ahora }, B));
  await comprobar('sin cuenta: lee el espacio de A', 403, () => leer(esp(A.uid), anon));
  await comprobar('A pone 6 lectores', 403, () => escribir(esp(A.uid), { lectores: ['a', 'b', 'c', 'd', 'e', 'f'], actualizado: ahora }, A));
  await comprobar('listar practicas-espacios (A)', 403, () => listar('practicas-espacios', A));

  titulo('Configuración de tareas (config/tareas)');
  await comprobar('A guarda sus tareas', 200, () => escribir(`${esp(A.uid)}/config/tareas`, { json: '{"unidades":[],"tareas":[]}', actualizado: ahora }, A));
  await comprobar('sin cuenta: lee las tareas de A', 200, () => leer(`${esp(A.uid)}/config/tareas`, anon));
  await comprobar('sin cuenta: lista config de A', 403, () => listar(`${esp(A.uid)}/config`, anon));
  await comprobar('B escribe las tareas de A', 403, () => escribir(`${esp(A.uid)}/config/tareas`, { json: '{}', actualizado: ahora }, B));
  await comprobar('A guarda config/otra', 403, () => escribir(`${esp(A.uid)}/config/otra`, { json: '{}', actualizado: ahora }, A));

  titulo('Lista de nombres cifrada (privado/nombres)');
  const nombres = { v: 1, sal: 'c2FsLWRlLXBydWViYQ==', iv: 'aXYtZGUtcHJ1ZWJh', cifrado: 'Y2lmcmFkby1kZS1wcnVlYmE=', actualizado: ahora };
  await comprobar('A guarda su lista', 200, () => escribir(`${esp(A.uid)}/privado/nombres`, nombres, A));
  await comprobar('A lee su lista', 200, () => leer(`${esp(A.uid)}/privado/nombres`, A));
  await comprobar('B lee la lista de A', 403, () => leer(`${esp(A.uid)}/privado/nombres`, B));
  await comprobar('sin cuenta: lee la lista de A', 403, () => leer(`${esp(A.uid)}/privado/nombres`, anon));
  await comprobar('A guarda la lista sin sal válida', 403, () => escribir(`${esp(A.uid)}/privado/nombres`, { ...nombres, sal: 5 }, A));
  await comprobar('A guarda privado/otra', 403, () => escribir(`${esp(A.uid)}/privado/otra`, nombres, A));

  const estado = { estado: '{"ej":[]}', actualizado: ahora };
  titulo('Progreso de práctica libre (alumno sin cuenta)');
  const libre = `${esp(A.uid)}/progreso-libre`;
  await comprobar('alumno de A guarda su progreso', 200, () => escribir(`${libre}/semaforo--${cA1}`, estado, anon));
  await comprobar('alumno de A lee su progreso (get)', 200, () => leer(`${libre}/semaforo--${cA1}`, anon));
  await comprobar('código de B escribe en el espacio de A', 403, () => escribir(`${libre}/semaforo--${cB1}`, estado, anon));
  await comprobar('código que no existe escribe', 403, () => escribir(`${libre}/semaforo--${cX}`, estado, anon));
  await comprobar('código de 4 sin registrar escribe en el espacio', 403, () => escribir(`${libre}/semaforo--${ANTIGUO_PRUEBA}`, estado, anon));
  await comprobar('progreso con un campo de más', 403, () => escribir(`${libre}/semaforo--${cA1}`, { ...estado, nombre: 'x' }, anon));
  await comprobar('subcolección «progreso» (nombre viejo)', 403, () => escribir(`${esp(A.uid)}/progreso/semaforo--${cA1}`, estado, anon));
  await comprobar('sin cuenta: lista el progreso de A', 403, () => listar(libre, anon));
  await comprobar('A lista su progreso libre', 200, () => listar(libre, A), r => `${(r.json?.documents ?? []).length} documento(s)`);
  await comprobar('B lista el progreso libre de A', 403, () => listar(libre, B));
  await comprobar('B borra un progreso de A', 403, () => borrar(`${libre}/semaforo--${cA1}`, B));

  titulo('Progreso por tarea (alumno sin cuenta)');
  const tareas = `${esp(A.uid)}/progreso-tareas`;
  await comprobar('alumno de A guarda la tarea 2', 200, () => escribir(`${tareas}/t2--semaforo--${cA1}`, estado, anon));
  await comprobar('alumno de A la lee (get)', 200, () => leer(`${tareas}/t2--semaforo--${cA1}`, anon));
  await comprobar('código de B escribe en el espacio de A', 403, () => escribir(`${tareas}/t2--semaforo--${cB1}`, estado, anon));
  await comprobar('id sin «t<n>--»', 403, () => escribir(`${tareas}/semaforo--${cA1}`, estado, anon));
  await comprobar('A lista su progreso por tarea', 200, () => listar(tareas, A));
  await comprobar('B lista el progreso por tarea de A', 403, () => listar(tareas, B));
  await comprobar('sin cuenta: lo lista', 403, () => listar(tareas, anon));

  titulo('Asignaciones');
  const asig = `${esp(A.uid)}/asignaciones`;
  await comprobar('A asigna la tarea 2 a su alumno', 200, () => escribir(`${asig}/${cA1}`, { tareas: [2], actualizado: ahora }, A));
  await comprobar('alumno de A lee su asignación (get)', 200, () => leer(`${asig}/${cA1}`, anon));
  await comprobar('A asigna en su espacio a un código de B', 403, () => escribir(`${asig}/${cB1}`, { tareas: [2], actualizado: ahora }, A));
  await comprobar('B asigna en el espacio de A', 403, () => escribir(`${asig}/${cA1}`, { tareas: [3], actualizado: ahora }, B));
  await comprobar('sin cuenta: escribe una asignación', 403, () => escribir(`${asig}/${cA1}`, { tareas: [3], actualizado: ahora }, anon));
  await comprobar('A lista sus asignaciones', 200, () => listar(asig, A));
  await comprobar('B lista las asignaciones de A', 403, () => listar(asig, B));

  titulo('Registro de fallos (alumno sin cuenta)');
  const fallos = `${esp(A.uid)}/fallos`;
  const idF = c => `${c}-${ahora.toString(36)}-${azar(4, 'abcdefghijklmnopqrstuvwxyz0123456789')}`;
  const fallo = c => ({ v: 1, alumno: c, practica: 'semaforo', ejercicio: 2, t: ahora, dia: 0, idioma: 'es', item: 'Prueba de reglas', feedback: 'Prueba de reglas', repeticion: false, tarea: 2 });
  const idBueno = idF(cA1);
  await comprobar('alumno de A registra un fallo', 200, () => crearEn(fallos, idBueno, fallo(cA1), anon));
  await comprobar('código de B registra en el espacio de A', 403, () => crearEn(fallos, idF(cB1), fallo(cB1), anon));
  await comprobar('id de un código y alumno de otro', 403, () => crearEn(fallos, idF(cA2), fallo(cA1), anon));
  await comprobar('fallo con un campo de más', 403, () => crearEn(fallos, idF(cA1), { ...fallo(cA1), nombre: 'x' }, anon));
  await comprobar('fallo con tarea = 1024', 403, () => crearEn(fallos, idF(cA1), { ...fallo(cA1), tarea: 1024 }, anon));
  await comprobar('fallo con código de 4 sin registrar', 403, () => crearEn(fallos, `${ANTIGUO_PRUEBA}-${ahora.toString(36)}-abcd`, fallo(ANTIGUO_PRUEBA), anon));
  await comprobar('sin cuenta: lee un fallo', 403, () => leer(`${fallos}/${idBueno}`, anon));
  await comprobar('sin cuenta: cambia un fallo', 403, () => escribir(`${fallos}/${idBueno}`, fallo(cA1), anon));
  await comprobar('A lista sus fallos', 200, () => listar(fallos, A), r => `${(r.json?.documents ?? []).length} documento(s)`);
  await comprobar('B lista los fallos de A', 403, () => listar(fallos, B));

  // Tarea 72: un código de 4 del sistema nuevo vale lo mismo que uno de 8 en su espacio, y en
  // ningún otro. Uno generado (ZZ + 2) y, si está libre, el de prueba 60 (7NPD).
  titulo('Códigos de 4 (tarea 72)');
  const idsF4 = [];
  await comprobar('A crea un código de 4 (n.º 3)', 200, () => escribir(`practicas-alumnos/${cA4}`, { profesor: A.uid, n: 3, alta: ahora }, A));
  await comprobar('B crea un código de 4 (n.º 2)', 200, () => escribir(`practicas-alumnos/${cB4}`, { profesor: B.uid, n: 2, alta: ahora }, B));
  await comprobar('B se queda el código de 4 de A', 403, () => escribir(`practicas-alumnos/${cA4}`, { profesor: B.uid, n: 3, alta: ahora }, B));
  await comprobar('sin cuenta: get del código de 4', 200, () => leer(`practicas-alumnos/${cA4}`, anon),
    r => (r.json?.fields?.n?.integerValue === '3' ? 'n = 3' : { fallo: 'no trae n = 3' }));
  await comprobar('alumno de 4 de A guarda su progreso', 200, () => escribir(`${libre}/semaforo--${cA4}`, estado, anon));
  await comprobar('alumno de 4 de A lo lee (get)', 200, () => leer(`${libre}/semaforo--${cA4}`, anon));
  await comprobar('alumno de 4 de A guarda la tarea 2', 200, () => escribir(`${tareas}/t2--semaforo--${cA4}`, estado, anon));
  await comprobar('alumno de 4 de A la lee (get)', 200, () => leer(`${tareas}/t2--semaforo--${cA4}`, anon));
  const idF4 = idF(cA4);
  await comprobar('alumno de 4 de A registra un fallo', 200, () => crearEn(fallos, idF4, fallo(cA4), anon), r => { idsF4.push(idF4); return null; });
  await comprobar('A asigna la tarea 2 a su alumno de 4', 200, () => escribir(`${asig}/${cA4}`, { tareas: [2], actualizado: ahora }, A));
  await comprobar('alumno de 4 de A lee su asignación (get)', 200, () => leer(`${asig}/${cA4}`, anon));
  await comprobar('código de 4 de B escribe en el espacio de A', 403, () => escribir(`${libre}/semaforo--${cB4}`, estado, anon));
  await comprobar('código de 4 de B registra un fallo en A', 403, () => crearEn(fallos, idF(cB4), fallo(cB4), anon));
  await comprobar('B asigna en el espacio de A a un código de 4', 403, () => escribir(`${asig}/${cA4}`, { tareas: [3], actualizado: ahora }, B));
  await comprobar('A asigna en su espacio a un código de 4 de B', 403, () => escribir(`${asig}/${cB4}`, { tareas: [2], actualizado: ahora }, A));
  await comprobar('A lista su progreso libre (con el de 4)', 200, () => listar(libre, A), r => {
    const ids = (r.json?.documents ?? []).map(d => d.name.split('/').pop());
    return ids.includes(`semaforo--${cA4}`) ? `${ids.length} documento(s), con semaforo--${cA4}` : { fallo: 'no sale el progreso del código de 4' };
  });
  await comprobar('A consulta sus códigos (con el de 4)', 200, () => consultarCodigos(A.uid, A), r => {
    const ids = (r.json ?? []).filter(x => x.document).map(x => x.document.name.split('/').pop());
    return ids.includes(cA4) && !ids.includes(cB4) ? 'el suyo sí, el de B no' : { fallo: 'falta el suyo o sale el de B' };
  });
  await comprobar('B lista el progreso libre de A', 403, () => listar(libre, B));
  await comprobar('B borra el código de 4 de A', 403, () => borrar(`practicas-alumnos/${cA4}`, B));
  await comprobar('A crea un código de 4 con n = 1000', 200, () => escribir(`practicas-alumnos/${cA4b}`, { profesor: A.uid, n: 1000, alta: ahora }, A));

  // El de prueba 60 (7NPD, uno de los de 4 calculables), registrado en el espacio de A como hizo la
  // tarea 70 con los de Juan Luis: registrado vale como cualquier otro; sin registrar, en ningún sitio.
  const libreAntiguo = await leer(`practicas-alumnos/${ANTIGUO_PRUEBA}`, anon);
  let antiguoRegistrado = false;
  if (libreAntiguo.status !== 404) {
    for (const n of ['A registra el código antiguo de prueba', 'su alumno guarda en el espacio de A', 'y lo lee (get)', 'y registra un fallo en A',
      'y fuera del espacio no se lee (practicas/)', 'A borra su progreso en el espacio', 'A lo borra', 'ya no escribe en el espacio de A']) omitir(n, `${ANTIGUO_PRUEBA} ya está registrado (get: ${libreAntiguo.status}); no se toca`);
  } else {
    antiguoRegistrado = await comprobar('A registra el código antiguo de prueba', 200,
      () => escribir(`practicas-alumnos/${ANTIGUO_PRUEBA}`, { profesor: A.uid, n: N_ANTIGUO_PRUEBA, alta: ahora }, A));
    await comprobar('su alumno guarda en el espacio de A', 200, () => escribir(`${libre}/semaforo--${ANTIGUO_PRUEBA}`, estado, anon));
    await comprobar('y lo lee (get)', 200, () => leer(`${libre}/semaforo--${ANTIGUO_PRUEBA}`, anon));
    const idFA = idF(ANTIGUO_PRUEBA);
    await comprobar('y registra un fallo en A', 200, () => crearEn(fallos, idFA, fallo(ANTIGUO_PRUEBA), anon), () => { idsF4.push(idFA); return null; });
    await comprobar('y fuera del espacio no se lee (practicas/)', 403, () => leer(`practicas/semaforo--${ANTIGUO_PRUEBA}`, anon));
    await comprobar('A borra su progreso en el espacio', 200, () => borrar(`${libre}/semaforo--${ANTIGUO_PRUEBA}`, A));
    const borrado = await comprobar('A lo borra', 200, () => borrar(`practicas-alumnos/${ANTIGUO_PRUEBA}`, A));
    if (borrado) antiguoRegistrado = false;
    await comprobar('ya no escribe en el espacio de A', 403, () => escribir(`${libre}/semaforo--${ANTIGUO_PRUEBA}`, estado, anon));
  }

  titulo('Lectores (B, lector del espacio de A)');
  await comprobar('A pone a B de lector', 200, () => escribir(esp(A.uid), { lectores: [B.uid], actualizado: ahora }, A));
  await comprobar('B lista el progreso libre de A', 200, () => listar(libre, B));
  await comprobar('B lista el progreso por tarea de A', 200, () => listar(tareas, B));
  await comprobar('B lista las asignaciones de A', 200, () => listar(asig, B));
  await comprobar('B lista los fallos de A', 200, () => listar(fallos, B));
  await comprobar('B lee la lista de nombres de A', 403, () => leer(`${esp(A.uid)}/privado/nombres`, B));
  await comprobar('B lee el espacio de A', 403, () => leer(esp(A.uid), B));
  await comprobar('B escribe las tareas de A', 403, () => escribir(`${esp(A.uid)}/config/tareas`, { json: '{}', actualizado: ahora }, B));
  await comprobar('B asigna en el espacio de A', 403, () => escribir(`${asig}/${cA1}`, { tareas: [3], actualizado: ahora }, B));
  await comprobar('B borra un fallo de A', 403, () => borrar(`${fallos}/${idBueno}`, B));
  await comprobar('B consulta los códigos de A', 403, () => consultarCodigos(A.uid, B));
  await comprobar('A quita a B de lector', 200, () => escribir(esp(A.uid), { lectores: [], actualizado: ahora }, A));
  await comprobar('B ya no lista el progreso de A', 403, () => listar(libre, B));

  const quedan = [];
  if (antiguoRegistrado) quedan.push(`practicas-alumnos/${ANTIGUO_PRUEBA} en el espacio de A (no se pudo borrar: bórralo en la consola)`);
  if (DEJAR) {
    quedan.push(`practicas-alumnos/{${cA1}, ${cA2}, ${cB1}, ${cA4}, ${cA4b}, ${cB4}}`, `practicas-espacios/<uid de A> con config/tareas, privado/nombres, progreso-libre/semaforo--{${cA1}, ${cA4}}, progreso-tareas/t2--semaforo--{${cA1}, ${cA4}}, asignaciones/{${cA1}, ${cA4}}, fallos/{${[idBueno, ...idsF4].join(', ')}}`);
  } else {
    titulo('Limpieza (el dueño borra lo suyo)');
    await comprobar('A borra el fallo', 200, () => borrar(`${fallos}/${idBueno}`, A));
    await comprobar('A borra la asignación', 200, () => borrar(`${asig}/${cA1}`, A));
    await comprobar('A borra el progreso por tarea', 200, () => borrar(`${tareas}/t2--semaforo--${cA1}`, A));
    await comprobar('A borra el progreso libre', 200, () => borrar(`${libre}/semaforo--${cA1}`, A));
    await comprobar('A borra lo de sus códigos de 4', 200, async () => {
      const rs = [
        ...await Promise.all(idsF4.map(id => borrar(`${fallos}/${id}`, A))),
        await borrar(`${asig}/${cA4}`, A),
        await borrar(`${tareas}/t2--semaforo--${cA4}`, A),
        await borrar(`${libre}/semaforo--${cA4}`, A),
        await borrar(`practicas-alumnos/${cA4}`, A),
        await borrar(`practicas-alumnos/${cA4b}`, A),
      ];
      return rs.find(r => r.status !== 200) ?? rs[0];
    });
    await comprobar('B borra su código de 4', 200, () => borrar(`practicas-alumnos/${cB4}`, B));
    await comprobar('A borra su lista de nombres', 200, () => borrar(`${esp(A.uid)}/privado/nombres`, A));
    await comprobar('A borra sus tareas', 200, () => borrar(`${esp(A.uid)}/config/tareas`, A));
    await comprobar('A borra su espacio', 200, () => borrar(esp(A.uid), A));
    await comprobar('A borra sus códigos', 200, async () => {
      const r1 = await borrar(`practicas-alumnos/${cA1}`, A);
      const r2 = await borrar(`practicas-alumnos/${cA2}`, A);
      return r1.status !== 200 ? r1 : r2;
    });
    await comprobar('B borra su código', 200, () => borrar(`practicas-alumnos/${cB1}`, B));
  }
  if (solicitudes.length) quedan.push('una solicitud de la cuenta desechable en practicas-solicitudes (solo la borra el administrador, desde su panel o la consola)');
  if (!C.error) {
    const ok = await borrarCuenta(C);
    if (!ok) quedan.push('la cuenta desechable zz-sin-alta-…@example.com en Authentication (no se pudo borrar)');
  }
  return terminar(quedan, [cA1, cA2, cB1, cX, cA4, cA4b, cB4]);
}

function terminar(quedan, codigos = []) {
  imprimir();
  const fallan = filas.filter(f => !f.ok);
  const hechas = filas.filter(f => f.obtenido !== 'omitida').length;
  console.log(`\n${hechas - fallan.length} de ${hechas} comprobaciones como se esperaba${fallan.length ? `; FALLAN ${fallan.length}` : ''}.`);
  if (codigos.length) console.log(`Códigos de prueba de esta ejecución (inventados): ${codigos.join(', ')}.`);
  console.log(quedan.length ? `Quedan en la nube:\n${quedan.map(q => `- ${q}`).join('\n')}` : 'No quedan datos de prueba en la nube.');
  process.exit(fallan.length ? 1 : 0);
}

main().catch(err => { console.error(err.message); process.exit(1); });
