// Lista de nombres cifrada del panel (tarea 66 del reparto PU2; DISENO.md, F.1):
// cifrar y descifrar, contraseña mala, sal e iv distintos cada vez, contraseña corta.
// Casi todos con pocas vueltas, para que el test sea rápido; uno con las de verdad.

import test from 'node:test';
import assert from 'node:assert/strict';
import { cifrar, descifrar, errorContrasena, ContrasenaIncorrecta, VUELTAS, VERSION_CIFRADO, MIN_CONTRASENA } from '../practicas/_comun/cifrado.js';

const rapido = { vueltas: 1000 };
const LISTA = 'García López, Ana\nMartínez Ruiz, Luis\n\nPeña Ibáñez, Óscar ñ ü «»';
const CLAVE = 'una contraseña larga';

test('cifrar y descifrar devuelve la lista tal cual (tildes, eñes, líneas vacías)', async () => {
  const dato = await cifrar(LISTA, CLAVE, rapido);
  assert.equal(dato.v, VERSION_CIFRADO);
  for (const campo of ['sal', 'iv', 'cifrado']) assert.match(dato[campo], /^[A-Za-z0-9+/]+=*$/, campo);
  assert.equal(dato.cifrado.includes('Ana'), false);
  assert.equal(await descifrar(dato, CLAVE, rapido), LISTA);
});

test('con la contraseña mala falla con ContrasenaIncorrecta, también con un dato dañado', async () => {
  const dato = await cifrar(LISTA, CLAVE, rapido);
  await assert.rejects(descifrar(dato, 'otra contraseña larga', rapido), ContrasenaIncorrecta);
  await assert.rejects(descifrar(dato, '', rapido), ContrasenaIncorrecta);
  const bytes = Buffer.from(dato.cifrado, 'base64');
  bytes[0] ^= 1;
  await assert.rejects(descifrar({ ...dato, cifrado: bytes.toString('base64') }, CLAVE, rapido), ContrasenaIncorrecta);
  await assert.rejects(descifrar({ ...dato, v: 99 }, CLAVE, rapido), /Formato/);
});

test('sal e iv distintos cada vez: el mismo texto con la misma contraseña no se repite', async () => {
  const a = await cifrar(LISTA, CLAVE, rapido);
  const b = await cifrar(LISTA, CLAVE, rapido);
  assert.notEqual(a.sal, b.sal);
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.cifrado, b.cifrado);
  assert.equal(Buffer.from(a.sal, 'base64').length, 16);
  assert.equal(Buffer.from(a.iv, 'base64').length, 12);
});

test('contraseña de menos de 10 caracteres: no se cifra', async () => {
  assert.equal(MIN_CONTRASENA, 10);
  assert.notEqual(errorContrasena('corta'), '');
  assert.notEqual(errorContrasena('123456789'), '');
  assert.equal(errorContrasena('1234567890'), '');
  assert.notEqual(errorContrasena(undefined), '');
  await assert.rejects(cifrar(LISTA, 'corta', rapido), /al menos 10/);
});

test('con las vueltas de verdad (600 000): ida y vuelta, y las vueltas cuentan', async () => {
  assert.equal(VUELTAS, 600000);
  const dato = await cifrar('Ana\nLuis', CLAVE);
  assert.equal(await descifrar(dato, CLAVE), 'Ana\nLuis');
  await assert.rejects(descifrar(dato, CLAVE, rapido), ContrasenaIncorrecta);
});
