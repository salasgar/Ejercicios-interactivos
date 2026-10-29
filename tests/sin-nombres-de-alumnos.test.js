// Ningún fichero versionado del repo público lleva nombres de alumnos reales.
// La lista sale de los nombres de fichero de «Alumnos/» en la carpeta de datos del curso
// (clave datos_curso de ~/.config/docencia/rutas.json); sin ella, el test se salta.
// Busca pares («Apellido1 Apellido2», «Nombre Apellido1») y el id de la app, no apellidos
// ni nombres sueltos: «López» o «Juan» están en ejemplos legítimos de la interfaz.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { usuarioDesdeNombre } from '../src/altas.js';

const EXTENSIONES = /\.(js|mjs|md|json|html|css|tex|py|tsv|csv|txt|yml|yaml|sty)$/;
const MINIMO_ALUMNOS = 40;

function carpetaAlumnos() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'docencia', 'rutas.json'), 'utf8'));
    const dir = path.join(cfg.datos_curso, 'Alumnos');
    return fs.existsSync(dir) ? dir : null;
  } catch (e) { return null; }
}

const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const limitado = (patron, banderas) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${patron}(?![\\p{L}\\p{N}])`, banderas);

function patronesDe(dir) {
  const patrones = [];
  let alumnos = 0;
  for (const f of fs.readdirSync(dir)) {
    const m = f.normalize('NFC').match(/^\dº[A-D] - (.+), (.+)\.md$/);
    if (!m) continue;
    alumnos++;
    const apellidos = m[1].trim().split(/\s+/);
    const nombre = m[2].trim().split(/\s+/);
    if (apellidos.length >= 2) patrones.push(`${apellidos[0]} ${apellidos[1]}`);
    patrones.push(`${nombre[0]} ${apellidos[0]}`);
    const id = usuarioDesdeNombre(`${nombre[0]} ${apellidos[0]}`);
    if (id) patrones.push(id);
  }
  return { alumnos, patrones: [...new Set(patrones)] };
}

const dir = carpetaAlumnos();

test('ningún fichero versionado lleva nombres de alumnos', { skip: !dir && 'sin la carpeta de datos del curso' }, () => {
  const { alumnos, patrones } = patronesDe(dir);
  assert.ok(alumnos >= MINIMO_ALUMNOS, `se esperaban al menos ${MINIMO_ALUMNOS} alumnos y salieron ${alumnos}: parseo roto`);
  const regex = patrones.map(p => ({ p, re: limitado(escapar(p).replace(/\s+/g, '\\s+'), 'iu') }));
  const raiz = path.resolve(import.meta.dirname, '..');
  const ficheros = execSync('git ls-files -z', { cwd: raiz, maxBuffer: 1 << 26 }).toString('utf8')
    .split('\0').filter(f => f && EXTENSIONES.test(f) && !f.startsWith('node_modules/'));
  const hallazgos = [];
  for (const f of ficheros) {
    let texto;
    try { texto = fs.readFileSync(path.join(raiz, f), 'utf8').normalize('NFC'); } catch (e) { continue; }
    const lineas = texto.split('\n');
    lineas.forEach((l, i) => {
      for (const { p, re } of regex) if (re.test(l)) hallazgos.push(`${f}:${i + 1} (${p})`);
    });
  }
  assert.deepEqual(hallazgos, [], `nombres de alumnos en ficheros versionados:\n${hallazgos.join('\n')}`);
});
