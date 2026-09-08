import { test } from 'node:test';
import assert from 'node:assert/strict';
import { usuarioDesdeNombre, analizarAltas, generarContrasena, normalizarUsuario } from '../src/altas.js';

test('usuarioDesdeNombre quita tildes y usa nombre.apellido', () => {
  assert.equal(usuarioDesdeNombre('María José Gárcía López'), 'maria.jose');
  assert.equal(usuarioDesdeNombre('  Ñoño  Pérez '), 'nono.perez');
  assert.equal(usuarioDesdeNombre('Ana'), 'ana');
  assert.equal(normalizarUsuario('Ana García'), 'anagarcia');
});

test('generarContrasena tiene al menos 6 caracteres', () => {
  for (let i = 0; i < 50; i++) assert.ok(generarContrasena().length >= 6);
  assert.equal(generarContrasena(() => 0), 'sol-100');
});

test('analizarAltas admite 2, 3 y 4 campos y evita usuarios repetidos', () => {
  const texto = `Ana García; 1A
Luis Pérez; luisp; 1A
Eva Ruiz; evar; secreta1; 1B
Ana García; 1A
Mal
Pepe; ; abc; 1A`;
  const { alumnos, errores } = analizarAltas(texto, ['luisp'], () => 0);
  assert.equal(alumnos.length, 4);
  assert.deepEqual(alumnos[0], { nombre: 'Ana García', usuario: 'ana.garcia', contrasena: 'sol-100', grupo: '1A' });
  assert.equal(alumnos[1].usuario, 'luisp2');
  assert.deepEqual(alumnos[2], { nombre: 'Eva Ruiz', usuario: 'evar', contrasena: 'secreta1', grupo: '1B' });
  assert.equal(alumnos[3].usuario, 'ana.garcia2');
  assert.equal(errores.length, 2);
  assert.match(errores[0], /Línea 5/);
  assert.match(errores[1], /Línea 6.*6 caracteres/);
});
