#!/usr/bin/env node
// Ensayo de «Pasar al sistema nuevo» (tarea 70 del reparto PU2) con el profesor de
// prueba A y los códigos de prueba 62 (XY4Z) y 63 (B5YN): la misma lógica que el
// botón del panel (practicas/profesor-migracion.js), por REST, sin tocar nada de
// Juan Luis. El 60 y el 61 son de la revisión (tarea 69): aquí no se tocan.
//
// Uso (las contraseñas, solo en el entorno; nunca en el repositorio):
//   PROFE_A_EMAIL=… PROFE_A_CLAVE=… node herramientas/ensayar-migracion.mjs [--sembrar] [--ejecutar] [--config]
//
//   (sin opciones)  solo el plan: qué se registraría y qué se copiaría; no escribe nada
//   --sembrar       antes, deja progreso de prueba del modo antiguo para el 62 (sin cuenta,
//                   como un alumno): practicas/recta--XY4Z y practicas-tareas/t2--criba--XY4Z
//   --ejecutar      pasa de verdad al espacio de A y lo comprueba (el plan repetido sale vacío,
//                   cada documento del modo antiguo está en el espacio sin retroceder, y la app
//                   resuelve los dos códigos al espacio de A con su número)
//   --config        además, sustituye la configuración de tareas de A por las de Juan Luis
//                   (la tarea 1 con progresoPorPractica); la anterior se guarda en un fichero
//                   temporal (lo dice al terminar). Sin --config, la de A no se toca.
//   --restaurar <fichero>  solo vuelve a poner en A la configuración guardada en ese fichero
//
// Los profesores de prueba no pueden listar las colecciones del modo antiguo ni leer
// sus fallos: el origen se lee documento a documento y los fallos no se copian (en el
// panel, Juan Luis sí los lee y los copia).

import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { firebaseConfig } from '../src/config.js';
import { codigoAlumno } from '../practicas/_comun/codigos.js';
import { configDeJSON } from '../practicas/_comun/tareas.js';
import { diaDe } from '../practicas/_comun/contador.js';
import { fusionarProgreso, canonico, coleccionEspacio, leerNube, escribirNube, idDocumentoTarea, COLECCION_TAREAS } from '../practicas/_comun/nube.js';
import { resolverCodigo } from '../practicas/_comun/espacio.js';
import {
  crearClienteRest, prepararPaso, ejecutarPaso, resumenDelPlan, planVacio, leerMisCodigos, configDeJuanLuis, alumnosQuePasan,
} from '../practicas/profesor-migracion.js';

const NUMEROS = [62, 63];
const opcion = nombre => process.argv.includes(`--${nombre}`);

async function entrar(email, clave) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: clave, returnSecureToken: true }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.idToken) throw new Error(`No se ha podido iniciar sesión con el profesor de prueba A (HTTP ${r.status}: ${j?.error?.message ?? 'sin detalle'})`);
  return { token: j.idToken, uid: j.localId };
}

/** Progreso de prueba del modo antiguo para el 62: lo escribe «el alumno», sin cuenta. */
async function sembrar() {
  const cod = codigoAlumno(61);
  const ej = (puntos, terminado = false) => ({ puntos, objetivo: 10, vidas: 4, racha: 0, aciertos: puntos + 1, fallos: 1, reinicios: 0, terminado, dia: terminado ? diaDe(new Date()) : 0 });
  const a = await escribirNube('recta', cod, [ej(10, true), ej(6), null], 'alterno');
  const b = await escribirNube('criba', cod, [null, ej(3)], 'alterno', { coleccion: COLECCION_TAREAS, id: idDocumentoTarea(2, 'criba', cod) });
  console.log(`Sembrado el progreso de prueba del ${NUMEROS[0]} (${cod}) en el modo antiguo: practicas/recta--${cod} ${a ? 'ok' : 'FALLO'}, practicas-tareas/t2--criba--${cod} ${b ? 'ok' : 'FALLO'}`);
}

async function main() {
  const { PROFE_A_EMAIL: email, PROFE_A_CLAVE: clave } = process.env;
  if (opcion('sembrar')) await sembrar();
  if (!email || !clave) {
    if (opcion('sembrar') && !opcion('ejecutar')) return;   // sembrar no necesita cuenta
    console.error('Faltan PROFE_A_EMAIL y PROFE_A_CLAVE (variables de entorno).'); process.exit(2);
  }
  const A = await entrar(email, clave);
  const token = async () => A.token;
  const cliente = crearClienteRest({ token });
  const i = process.argv.indexOf('--restaurar');
  if (i >= 0) {
    const json = readFileSync(process.argv[i + 1], 'utf8');
    if (!configDeJSON(json)) { console.error('Ese fichero no es una configuración de tareas.'); process.exit(2); }
    await cliente.escribir(`practicas-espacios/${A.uid}/config/tareas`, { json: { stringValue: json }, actualizado: { integerValue: String(Date.now()) } });
    console.log('Configuración de A restaurada.');
    return;
  }
  const alumnos = alumnosQuePasan(NUMEROS, { conPrueba: false });
  console.log(`Profesor de prueba A: ${A.uid.slice(0, 6)}…  Alumnos: ${alumnos.map(a => `${a.n} (${a.codigo})`).join(', ')}`);

  const opciones = { config: opcion('config') ? 'sustituir' : 'no', configNueva: configDeJuanLuis() };
  const preparar = async () => prepararPaso(cliente, { uid: A.uid, alumnos, listar: false, opciones, misCodigos: await leerMisCodigos(A.uid, { token }) });
  const { plan, origen } = await preparar();
  console.log('\n## Plan\n');
  for (const l of resumenDelPlan(plan)) console.log(`- ${l}`);
  if (!opcion('ejecutar')) { console.log('\n(Solo el plan: añade --ejecutar para pasar de verdad.)'); return; }
  if (plan.bloqueos.length) { console.error('\nHay bloqueos: no se escribe nada.'); process.exit(1); }

  if (plan.config?.antes) {
    const fichero = join(tmpdir(), `config-profesor-A-${Date.now()}.json`);
    writeFileSync(fichero, plan.config.antes);
    console.log(`\nLa configuración anterior de A se ha guardado en ${fichero}`);
  }
  console.log('\n## Paso\n');
  const r = await ejecutarPaso(cliente, plan, { alAvanzar: t => console.log(`… ${t}`) });
  console.log(`Registrados ${r.registrados} (ya lo estaban ${r.existian}), copiados ${r.escritos} documentos y ${r.fallosCopiados} fallos${r.config ? ', configuración guardada' : ''}.`);
  for (const e of r.errores) console.log(`✗ ${e}`);

  console.log('\n## Comprobaciones\n');
  let fallos = r.errores.length;
  const ok = (que, cond, nota = '') => { if (!cond) fallos++; console.log(`${cond ? '✓' : '✗'} ${que}${nota ? `  (${nota})` : ''}`); };
  const { plan: otra } = await preparar();
  ok('el plan repetido sale vacío (repetir no duplica)', planVacio(otra), resumenDelPlan(otra).join(' | '));
  for (const sub of ['progreso-libre', 'progreso-tareas', 'asignaciones']) {
    for (const d of origen[sub]) {
      const destino = await cliente.leer(`${coleccionEspacio(A.uid, sub)}/${d.id}`);
      if (sub === 'asignaciones') { ok(`${sub}/${d.id} está en el espacio`, Boolean(destino)); continue; }
      const de = JSON.parse(destino?.estado?.stringValue ?? 'null')?.ej;
      const or = JSON.parse(d.fields.estado.stringValue).ej;
      ok(`${sub}/${d.id} está en el espacio y no retrocede`, Array.isArray(de) && canonico(fusionarProgreso(de, or)) === canonico(de));
    }
  }
  for (const a of alumnos) {
    const res = await resolverCodigo(a.codigo, { almacen: null });
    ok(`la app resuelve ${a.codigo} al espacio de A con el n.º ${a.n}`, res.modo === 'nuevo' && res.profesor === A.uid && res.n === a.n, JSON.stringify({ modo: res.modo, n: res.n, error: res.error }));
  }
  const recta = await leerNube('recta', codigoAlumno(61), { coleccion: coleccionEspacio(A.uid, 'progreso-libre') });
  ok(`el alumno ${codigoAlumno(61)} lee su recta del espacio (sin cuenta, como la app)`, recta.estado === 'ok' || origen['progreso-libre'].every(d => !d.id.startsWith('recta--')), recta.estado);
  if (opcion('config')) {
    const cfg = await cliente.leer(`practicas-espacios/${A.uid}/config/tareas`);
    const leida = configDeJSON(cfg?.json?.stringValue);
    ok('la configuración de A tiene la tarea 1 con progresoPorPractica y códigos de 4', leida?.tareas?.[0]?.progresoPorPractica === true && leida?.longitudCodigo === 4);
  }
  console.log(`\n${fallos ? `${fallos} comprobaciones han fallado.` : 'Todo como se esperaba.'} Quedan en la nube, en el espacio de A: los códigos ${alumnos.map(a => a.codigo).join(' y ')} y lo copiado (se borran desde la consola o al limpiar los datos de prueba).`);
  process.exit(fallos ? 1 : 0);
}

main().catch(e => { console.error(e.message ?? e); process.exit(1); });
