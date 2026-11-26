// Página de acertijos (WEB, tarea 08): lógica pura de acertijos/logica.js y coherencia del catálogo de ejemplo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  TIPOS, NIVELES, normalizar, estrellas, esValido, normalizarCatalogo, unidadesDe, filtrar, ordenar, contador, alAzar, enlaceDe, deHash, enlacesDe,
} from '../acertijos/logica.js';

const ejemplo = JSON.parse(readFileSync(new URL('../acertijos/catalogo-ejemplo.json', import.meta.url), 'utf8'));
const cat = normalizarCatalogo(ejemplo);
const ids = l => l.map(a => a.id);

test('el catálogo de ejemplo tiene cinco acertijos válidos y distintos', () => {
  assert.equal(ejemplo.length, 5);
  assert.equal(cat.length, 5);
  assert.equal(new Set(ids(cat)).size, 5);
  for (const a of ejemplo) assert.ok(esValido(a), a.id);
});

test('normalizarCatalogo descarta lo inválido y los id repetidos, y rellena opcionales', () => {
  const r = normalizarCatalogo([{ id: 'a', titulo: 'A', enunciado: 'x', tipo: 'L', nivel: '★' }, { id: 'a', titulo: 'B', enunciado: 'x', tipo: 'L', nivel: '★' },
    { id: 'b', titulo: 'B', enunciado: 'x', tipo: 'Z', nivel: '★' }, null, { id: 'c', titulo: 'C', enunciado: 'x', tipo: 'L', nivel: '★★★★' }]);
  assert.deepEqual(ids(r), ['a']);
  assert.equal(r[0].pista, ''); assert.equal(r[0].unidad, null); assert.equal(r[0].idioma, 'es');
  assert.deepEqual(normalizarCatalogo(undefined), []);
});

test('normalizar quita tildes, mayúsculas y espacios sobrantes', () => {
  assert.equal(normalizar('  Lógica   y DEDUCCIÓN '), 'logica y deduccion');
  assert.equal(normalizar(null), '');
});

test('estrellas', () => {
  assert.equal(estrellas('★'), 1); assert.equal(estrellas('★★★'), 3); assert.equal(estrellas('★★★★'), 0); assert.equal(estrellas(undefined), 0);
});

test('filtrar por tipo, nivel, unidad e idioma, y combinados', () => {
  assert.deepEqual(ids(filtrar(cat)), ids(cat));
  assert.deepEqual(ids(filtrar(cat, { tipo: 'N' })), ['ej02']);
  assert.deepEqual(ids(filtrar(cat, { nivel: '★★' })), ['ej01', 'ej03']);
  assert.deepEqual(ids(filtrar(cat, { unidad: '3' })), ['ej03']);
  assert.deepEqual(ids(filtrar(cat, { unidad: 3 })), ['ej03']);
  assert.deepEqual(ids(filtrar(cat, { idioma: 'en' })), ['ej04']);
  assert.deepEqual(ids(filtrar(cat, { nivel: '★★', tipo: 'P' })), ['ej03']);
  assert.deepEqual(filtrar(cat, { nivel: '★★★', tipo: 'P' }), []);
});

test('cada filtro de tipo y de nivel del ejemplo reduce o iguala la lista, y la unión de todos los valores la recompone', () => {
  const porTipo = Object.keys(TIPOS).flatMap(t => ids(filtrar(cat, { tipo: t })));
  assert.deepEqual(porTipo.sort(), ids(cat).sort());
  const porNivel = Object.keys(NIVELES).flatMap(n => ids(filtrar(cat, { nivel: n })));
  assert.deepEqual(porNivel.sort(), ids(cat).sort());
});

test('buscar por texto: sin tildes, varias palabras (todas), en título, enunciado, pista y tipo', () => {
  assert.deepEqual(ids(filtrar(cat, { texto: 'bombilla' })), ['ej01']);
  assert.deepEqual(ids(filtrar(cat, { texto: 'INTERRUPTORES' })), ['ej01']);
  assert.deepEqual(ids(filtrar(cat, { texto: 'jarra litros' })), ['ej03']);
  assert.deepEqual(filtrar(cat, { texto: 'jarra bombilla' }), []);
  assert.deepEqual(ids(filtrar(cat, { texto: 'logica' })), []);           // el tipo de ej01 es T, no L
  assert.deepEqual(ids(filtrar(cat, { texto: 'lateral' })), ['ej01']);    // pero «lateral» es su tipo
  assert.deepEqual(ids(filtrar(cat, { texto: 'neighbours' })), ['ej04']);  // texto de la pista
  assert.deepEqual(ids(filtrar(cat, { texto: '   ' })), ids(cat));
  assert.deepEqual(ids(filtrar(cat, { texto: 'bombilla', tipo: 'N' })), []);
});

test('no se busca en la solución (no se chiva)', () => {
  assert.deepEqual(filtrar(cat, { texto: '5050' }), []);
});

test('ordenar: por orden, luego nivel, luego título; no modifica la entrada', () => {
  const revuelto = [cat[4], cat[0], cat[2], cat[1], cat[3]];
  const copia = [...revuelto];
  assert.deepEqual(ids(ordenar(revuelto)), ['ej01', 'ej02', 'ej03', 'ej04', 'ej05']);
  assert.deepEqual(revuelto, copia);
  const empate = normalizarCatalogo([
    { id: 'z', titulo: 'Zeta', enunciado: 'x', tipo: 'L', nivel: '★★' }, { id: 'y', titulo: 'Beta', enunciado: 'x', tipo: 'L', nivel: '★★' },
    { id: 'x', titulo: 'Alfa', enunciado: 'x', tipo: 'L', nivel: '★★★' }, { id: 'w', titulo: 'Omega', enunciado: 'x', tipo: 'L', nivel: '★' }]);
  assert.deepEqual(ids(ordenar(empate)), ['w', 'y', 'z', 'x']);
});

test('unidadesDe: ordenadas y sin repetir', () => {
  assert.deepEqual(unidadesDe(cat), [2, 3, 4, 6, 8]);
});

test('contador: singular y plural', () => {
  assert.equal(contador(0), '0 acertijos'); assert.equal(contador(1), '1 acertijo'); assert.equal(contador(5), '5 acertijos');
});

test('alAzar: acota el índice y devuelve null con la lista vacía', () => {
  assert.equal(alAzar([], () => 0.5), null);
  assert.equal(alAzar(cat, () => 0).id, 'ej01');
  assert.equal(alAzar(cat, () => 0.999999).id, 'ej05');
  assert.equal(alAzar(cat, () => 1).id, 'ej05');
});

test('enlace directo: #id y vuelta desde el hash', () => {
  for (const a of cat) assert.equal(deHash(enlaceDe(a), cat).id, a.id);
  assert.equal(deHash('#no-existe', cat), null);
  assert.equal(deHash('', cat), null);
  assert.equal(deHash('#%E0%A4%A', cat), null);
});

test('los ficheros de la página existen y la página no depende de nada externo', () => {
  for (const f of ['index.html', 'estilos.css', 'pagina.js', 'logica.js']) {
    const t = readFileSync(new URL(`../acertijos/${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(t, /https?:\/\//, `${f} no debe llamar a nada externo`);
  }
});

test('enlaces: solo https y con texto; imágenes extra y de la solución, con valores por defecto', () => {
  const base = { id: 'a', titulo: 'A', enunciado: 'x', tipo: 'L', nivel: '★' };
  const protocolo = 'https:' + '//';
  const r = normalizarCatalogo([{ ...base, imagenes: ['b.png', '', 3], imagen_solucion: 's.png',
    enlaces: [{ texto: ' Vídeo ', url: protocolo + 'example.org/v' }, { texto: 'malo', url: 'javascript:alert(1)' }, { texto: '', url: protocolo + 'example.org' }, null] }])[0];
  assert.deepEqual(r.enlaces, [{ texto: 'Vídeo', url: protocolo + 'example.org/v' }]);
  assert.deepEqual(r.imagenes, ['b.png']);
  assert.equal(r.imagen_solucion, 's.png');
  const s = normalizarCatalogo([base])[0];
  assert.deepEqual([s.enlaces, s.imagenes, s.imagen_solucion], [[], [], '']);
  assert.deepEqual(enlacesDe(null), []);
});
