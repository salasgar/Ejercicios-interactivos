import { test } from 'node:test';
import assert from 'node:assert/strict';
import { usuarioDesdeNombre, analizarAltas, generarContrasena, normalizarUsuario, esEmail } from '../src/altas.js';

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
  assert.deepEqual(alumnos[0], { nombre: 'Ana García', grupo: '1A', usuario: 'ana.garcia', contrasena: 'sol-100' });
  assert.equal(alumnos[1].usuario, 'luisp2');
  assert.deepEqual(alumnos[2], { nombre: 'Eva Ruiz', grupo: '1B', usuario: 'evar', contrasena: 'secreta1' });
  assert.equal(alumnos[3].usuario, 'ana.garcia2');
  assert.equal(errores.length, 2);
  assert.match(errores[0], /Línea 5/);
  assert.match(errores[1], /Línea 6.*6 caracteres/);
});

test('analizarAltas: con email se da de alta para entrar con Google, sin contraseña', () => {
  const texto = `Ana García; Ana.Garcia@murciaeduca.es; 1A
Luis Pérez; luis@murciaeduca.es; abc123; 1A
Eva Ruiz; eva@murciaeduca.es; 1B`;
  const { alumnos, errores } = analizarAltas(texto, ['eva@murciaeduca.es']);
  assert.deepEqual(alumnos, [{ nombre: 'Ana García', grupo: '1A', email: 'ana.garcia@murciaeduca.es' }]);
  assert.equal(errores.length, 2);
  assert.match(errores[0], /Línea 2.*Google/);
  assert.match(errores[1], /Línea 3.*ya está/);
  assert.ok(esEmail('a.b@c.es'));
  assert.ok(!esEmail('ana.garcia'));
});
