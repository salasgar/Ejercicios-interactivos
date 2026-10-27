// Editor de tareas del panel (tarea 67 del reparto PU2; DISENO.md, D.5): ids, duplicar,
// bloqueo desde `desde`, avisos antes de guardar, plantilla, fechas de unidad.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  siguienteId, tareaNueva, duplicarTarea, estaBloqueada, conservarSiBloqueada, guardarTarea,
  ponerFechaUnidad, cargarPlantilla, tareasPorUnidad, ejerciciosDeUnidad, tareaDeFormulario,
  avisosDeTarea, resumenTarea,
} from '../practicas/profesor-tareas.js';
import { erroresConfig, configPlantilla, configAJSON, configDeJSON, MAX_ESTRELLA, MAX_ELEGIR } from '../practicas/_comun/tareas.js';
import { CATALOGO, UNIDADES } from '../practicas/_comun/catalogo.js';

const vacia = () => ({ unidades: [], tareas: [] });
const bien = (extra = {}) => ({
  id: 1, unidad: 2, titulo: { es: 'Una', en: 'One' },
  estrella: [['semaforo', 1], ['recta', 1]], elegir: [['semaforo', 2], ['recta', 2], ['recta', 3]], nElegir: 2, ...extra,
});

test('los ids: el mayor + 1, y el 1 en una configuración vacía', () => {
  assert.equal(siguienteId([]), 1);
  assert.equal(siguienteId([{ id: 3 }, { id: 11 }, { id: 4 }]), 12);
  const c = { ...vacia(), tareas: [bien({ id: 7 })] };
  assert.equal(tareaNueva(c, 1).id, 8);
  assert.equal(tareaNueva(c, 1).unidad, 1);
});

test('duplicar: id nuevo, sin fechas ni asignada, ejercicios iguales y independientes', () => {
  const c = { ...vacia(), tareas: [bien({ id: 5, desde: '2026-10-01', hasta: '2026-10-05', asignada: true })] };
  const copia = duplicarTarea(c, 5);
  assert.equal(copia.id, 6);
  assert.equal(copia.desde, undefined);
  assert.equal(copia.hasta, undefined);
  assert.equal(copia.asignada, undefined);
  assert.deepEqual(copia.estrella, c.tareas[0].estrella);
  assert.match(copia.titulo.es, /\(copia\)$/);
  copia.estrella.push(['raiz', 1]);
  assert.equal(c.tareas[0].estrella.length, 2);
  assert.equal(duplicarTarea(c, 99), null);
});

test('una tarea se bloquea desde su día de comienzo (el mismo día ya), no antes ni sin fecha', () => {
  assert.equal(estaBloqueada(bien({ desde: '2026-10-20' }), '2026-10-19'), false);
  assert.equal(estaBloqueada(bien({ desde: '2026-10-20' }), '2026-10-20'), true);
  assert.equal(estaBloqueada(bien({ desde: '2026-10-20' }), '2026-12-01'), true);
  assert.equal(estaBloqueada(bien(), '2026-12-01'), false);
});

test('bloqueada: el título y las fechas cambian, los ejercicios no', () => {
  const original = bien({ desde: '2026-10-01', hasta: '2026-10-09' });
  const editada = { ...original, titulo: { es: 'Otro', en: 'Other' }, hasta: '2026-10-12', estrella: [['raiz', 1]], elegir: [], nElegir: 0 };
  const r = conservarSiBloqueada(original, editada, '2026-10-05');
  assert.equal(r.titulo.es, 'Otro');
  assert.equal(r.hasta, '2026-10-12');
  assert.deepEqual(r.estrella, original.estrella);
  assert.deepEqual(r.elegir, original.elegir);
  assert.equal(r.nElegir, 2);
  // Sin empezar, todo cambia.
  assert.deepEqual(conservarSiBloqueada(original, editada, '2026-09-30').estrella, [['raiz', 1]]);
});

test('guardarTarea sustituye por id o añade, sin tocar la configuración original', () => {
  const c = { ...vacia(), tareas: [bien()] };
  const a = guardarTarea(c, bien({ titulo: { es: 'Cambiada', en: 'Changed' } }));
  assert.equal(a.tareas.length, 1);
  assert.equal(a.tareas[0].titulo.es, 'Cambiada');
  assert.equal(c.tareas[0].titulo.es, 'Una');
  assert.equal(guardarTarea(c, bien({ id: 2 })).tareas.length, 2);
});

test('fechas de unidad: se ponen, se sustituyen y se quitan', () => {
  let c = ponerFechaUnidad(vacia(), 2, '2026-10-13');
  c = ponerFechaUnidad(c, 1, '2026-09-14');
  assert.deepEqual(c.unidades, [{ n: 1, desde: '2026-09-14' }, { n: 2, desde: '2026-10-13' }]);
  c = ponerFechaUnidad(c, 2, '2026-10-20');
  assert.equal(c.unidades.find(u => u.n === 2).desde, '2026-10-20');
  assert.equal(ponerFechaUnidad(c, 1, '').unidades.length, 1);
  assert.deepEqual(erroresConfig(ponerFechaUnidad(vacia(), 2, '2026-02-30')).length > 0, true);
});

test('la plantilla: sin tareas las sustituye; con tareas las añade con ids nuevos', () => {
  const sin = cargarPlantilla(vacia());
  assert.equal(sin.sustituye, true);
  assert.deepEqual(erroresConfig(sin.config), []);
  assert.equal(sin.config.tareas.length, configPlantilla().tareas.length);

  const mia = bien({ id: 3 });
  const con = cargarPlantilla({ unidades: [{ n: 2, desde: '2026-10-20' }], tareas: [mia] });
  assert.equal(con.sustituye, false);
  assert.equal(con.config.tareas[0], mia);
  assert.equal(con.config.tareas.length, 1 + configPlantilla().tareas.length);
  const ids = con.config.tareas.map(t => t.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(Math.min(...ids.slice(1)), 4);
  assert.deepEqual(con.config.unidades, [{ n: 2, desde: '2026-10-20' }]);
  assert.deepEqual(erroresConfig(con.config), []);
});

test('tareasPorUnidad sigue el orden de UNIDADES y deja vacías las que no tienen tareas', () => {
  const g = tareasPorUnidad({ ...vacia(), tareas: [bien({ id: 1, unidad: 2 }), bien({ id: 2, unidad: 1 })] });
  assert.deepEqual(g.map(x => x.unidad.n), UNIDADES.map(u => u.n));
  assert.deepEqual(g.map(x => x.tareas.length), [1, 1, 0, 0]);
});

test('ejerciciosDeUnidad: solo prácticas disponibles de esa unidad, todos sus ejercicios, sin la plantilla', () => {
  for (const u of UNIDADES) {
    const lista = ejerciciosDeUnidad(u.n);
    const esperados = CATALOGO.filter(p => p.unidad === u.n && p.disponible).reduce((s, p) => s + p.nEjercicios, 0);
    assert.equal(lista.length, esperados);
    assert.ok(lista.every(e => e.practica.unidad === u.n && e.slug !== 'plantilla'));
  }
  assert.equal(ejerciciosDeUnidad(null).length, 0);
});

test('tareaDeFormulario separa ★ y a elegir, recorta el título y acota nElegir', () => {
  const marcas = [
    { slug: 'semaforo', n: 1, tipo: 'estrella' }, { slug: 'semaforo', n: 2, tipo: '' },
    { slug: 'recta', n: 1, tipo: 'elegir' }, { slug: 'recta', n: 2, tipo: 'elegir' },
  ];
  const base = { id: 4 };
  const t = tareaDeFormulario(base, { tituloEs: '  Hola ', tituloEn: 'Hi', unidad: 2, desde: '', hasta: '2026-11-01', asignada: false, nElegir: 9, marcas });
  assert.deepEqual(t, { id: 4, unidad: 2, titulo: { es: 'Hola', en: 'Hi' }, hasta: '2026-11-01', estrella: [['semaforo', 1]], elegir: [['recta', 1], ['recta', 2]], nElegir: 2 });
  assert.equal(tareaDeFormulario(base, { tituloEs: 'a', tituloEn: 'b', unidad: 1, desde: '', hasta: '', asignada: true, nElegir: NaN, marcas }).nElegir, 0);
  assert.equal(tareaDeFormulario(base, { tituloEs: 'a', tituloEn: 'b', unidad: 1, desde: '', hasta: '', asignada: true, nElegir: -3, marcas }).asignada, true);
});

test('avisos antes de guardar: título, topes, repetidos, plazo anterior al comienzo, sin nada', () => {
  const c = vacia();
  assert.deepEqual(avisosDeTarea(c, bien()), []);
  assert.ok(avisosDeTarea(c, bien({ titulo: { es: '', en: 'x' } })).some(a => /título en español/.test(a)));
  assert.ok(avisosDeTarea(c, bien({ titulo: { es: 'x', en: '' } })).some(a => /inglés/.test(a)));
  assert.ok(avisosDeTarea(c, bien({ desde: '2026-10-10', hasta: '2026-10-05' })).some(a => /anterior/.test(a)));
  assert.ok(avisosDeTarea(c, bien({ estrella: [['semaforo', 1], ['semaforo', 1]], elegir: [], nElegir: 0 })).some(a => /repetido/.test(a)));
  assert.ok(avisosDeTarea(c, bien({ estrella: [], elegir: [], nElegir: 0 })).some(a => /no pide nada/.test(a)));
  const muchos = ejerciciosDeUnidad(1).map(e => [e.slug, e.n]);
  assert.ok(muchos.length > MAX_ESTRELLA + MAX_ELEGIR - 1);
  assert.ok(avisosDeTarea(c, bien({ estrella: muchos.slice(0, MAX_ESTRELLA + 1), elegir: [], nElegir: 0 })).some(a => /más de 10/.test(a)));
  assert.ok(avisosDeTarea(c, bien({ estrella: [], elegir: muchos.slice(0, MAX_ELEGIR + 1), nElegir: 1 })).some(a => /más de 15/.test(a)));
});

test('los avisos de una tarea no arrastran los errores de otra tarea ya guardada', () => {
  const rota = bien({ id: 1, hasta: '2026-01-01', desde: '2026-02-01' });
  const c = { ...vacia(), tareas: [rota] };
  assert.deepEqual(avisosDeTarea(c, bien({ id: 2 })), []);
});

test('lo que se guarda vuelve a leerse igual y sin errores', () => {
  const sin = cargarPlantilla(vacia()).config;
  const leida = configDeJSON(configAJSON(sin));
  assert.deepEqual(leida, { unidades: sin.unidades.map(u => ({ n: u.n, desde: u.desde })), tareas: sin.tareas });
  assert.deepEqual(erroresConfig(leida), []);
});

test('el resumen de la lista dice ★, a elegir y fechas', () => {
  assert.equal(resumenTarea(bien()), '2 ★ + 2 de 3 · sin fecha de comienzo');
  assert.equal(resumenTarea(bien({ desde: '2026-10-26', hasta: '2026-10-29', asignada: true })), '2 ★ + 2 de 3 · asignada · desde 26-10 · plazo 29-10');
});
