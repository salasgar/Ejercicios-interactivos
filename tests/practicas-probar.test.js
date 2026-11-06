// Enlace «probar» del editor de tareas (tarea 164 del reparto PU2): abre un ejercicio en modo de prueba.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { enlaceProbar, ejerciciosDeUnidad } from '../practicas/profesor-tareas.js';
import { modoPrueba } from '../practicas/_comun/base.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';

test('el enlace de cada ejercicio apunta a la ruta de su práctica con su número', () => {
  let vistos = 0;
  for (const unidad of [2, 3, 4, 5]) {
    for (const e of ejerciciosDeUnidad(unidad)) {
      const url = new URL(enlaceProbar(e.practica, e.n), 'https://ejemplo.test/practicas/');
      assert.equal(url.searchParams.get('probar'), '1');
      assert.equal(url.searchParams.get('ejercicio'), String(e.n));
      assert.equal(url.searchParams.has('c'), false, 'el enlace nunca lleva código de alumno');
      assert.equal(url.searchParams.has('semana'), false, 'no se viene de una tarea: no hay vuelta a la semana');
      // La ruta es la del catálogo (el slug y la carpeta no siempre coinciden: fichas-de-pablo).
      assert.equal(url.href, new URL(`${e.practica.ruta}?probar=1&ejercicio=${e.n}`, 'https://ejemplo.test/practicas/').href);
      vistos++;
    }
  }
  assert.ok(vistos > 50);
});

test('«divisores» (ruta ../divisores/) también tiene enlace', () => {
  const p = CATALOGO.find(x => x.slug === 'divisores');
  assert.equal(enlaceProbar(p, 2), '../divisores/?probar=1&ejercicio=2');
});

test('modoPrueba: solo con probar=1', () => {
  assert.equal(modoPrueba('?probar=1&ejercicio=3'), true);
  assert.equal(modoPrueba('?ejercicio=3&probar=1&c=ABCD'), true);
  assert.equal(modoPrueba(''), false);
  assert.equal(modoPrueba('?probar=0'), false);
  assert.equal(modoPrueba('?probar'), false);
  assert.equal(modoPrueba('?c=ABCD'), false);
});

test('con el modo de prueba la base arranca sin código antes de leer el recordado ni resolver nada', () => {
  const src = readFileSync(new URL('../practicas/_comun/base.js', import.meta.url), 'utf8');
  const arranque = src.slice(src.lastIndexOf('// --- Arranque'));
  const iPrueba = arranque.indexOf('if (modoPrueba(location.search)) entrarSinCodigo();');
  assert.ok(iPrueba > 0, 'el arranque comprueba el modo de prueba');
  assert.ok(iPrueba < arranque.indexOf('entrar(inicial)'), 'antes de entrar con un código');
  // entrarSinCodigo no toca la nube ni el almacén: ni resolverCodigo, ni leerYFusionar, ni guardar, ni borrar.
  const fn = src.slice(src.indexOf('function entrarSinCodigo()'));
  const cuerpo = fn.slice(0, fn.indexOf('\n  }\n'));
  for (const prohibido of ['resolverCodigo', 'leerYFusionar', 'guardar(', 'subir(', 'escribir(', 'borrar(', 'cerrarSesion', 'leer(']) {
    assert.equal(cuerpo.includes(prohibido), false, `entrarSinCodigo no debe llamar a ${prohibido}`);
  }
});
