// Piezas comunes de la ortografía (practicas/_comun/ortografia.js, tarea 134): lo puro
// (textos, slug, barajar, conjuntos) y los esqueletos de los cinco bloques. Los `montar`
// necesitan el navegador y se prueban con clics (docs/practicas-ortografia.md, §3).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TXO, slug, barajarOpciones, conjuntoIgual, enConstruccion, ESTILOS, montarHueco, montarElegir, montarTocar, montarDosPasos } from '../practicas/_comun/ortografia.js';
import { slug as slugDeLa45 } from '../practicas/ortografia/logica.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { validarPractica } from '../practicas/_comun/base.js';
import { crearRng } from '../practicas/_comun/rng.js';

const BLOQUES = { 'ortografia-tildes': 135, 'ortografia-letras': 136, 'ortografia-puntuacion': 137, 'ortografia-palabras': 138, 'ortografia-ampliacion': 139 };

test('ortografía común: los textos, en español y sin huecos', () => {
  for (const clave of ['hueco', 'escrita', 'significado', 'tocar', 'tocar_varias', 'comprobar', 'ninguna', 'bien', 'mal']) {
    assert.equal(typeof TXO[clave], 'string', clave);
    assert.ok(TXO[clave].trim().length > 0, clave);
  }
  assert.equal(TXO.hueco, '¿Qué palabra va en el hueco?');
  assert.equal(TXO.escrita, '¿Cuál está bien escrita?');
  for (const f of [montarHueco, montarElegir, montarTocar, montarDosPasos]) assert.equal(typeof f, 'function');
  assert.match(ESTILOS, /\.oracion/);
});

test('ortografía común: slug sin tildes, en minúsculas y con guiones, como el de la 45', () => {
  assert.equal(slug('Haber'), 'haber');
  assert.equal(slug('por qué'), 'por-que');
  assert.equal(slug('Sí, él'), 'si-el');
  assert.equal(slug('aún/aun'), 'aun-aun');
  assert.equal(slug('pingüino'), 'pinguino');
  assert.equal(slug(12), '12');
  for (const t of ['¿Por qué?', 'Ésta es la prueba', 'más vale', 'echo de menos', 'ñandú']) {
    assert.equal(slug(t), slugDeLa45(t), t);
    assert.match(slug(t), /^[a-z0-9-]*$/, t);
  }
});

test('ortografía común: barajarOpciones guarda la posición de cada texto en `k` y no pierde ninguno', () => {
  const rng = crearRng(134);
  const textos = ['ha', 'a', 'ah'];
  const vistas = new Set();
  for (let i = 0; i < 300; i++) {
    const o = barajarOpciones(rng, textos);
    assert.equal(o.length, 3);
    for (const { k, texto } of o) assert.equal(textos[k], texto);
    assert.deepEqual(o.map(x => x.k).sort(), [0, 1, 2]);
    vistas.add(o.map(x => x.k).join(''));
  }
  assert.equal(vistas.size, 6, 'salen los seis órdenes');
  assert.deepEqual(textos, ['ha', 'a', 'ah'], 'no toca la lista original');
});

test('ortografía común: conjuntoIgual no mira el orden ni las repeticiones, y compara como texto', () => {
  assert.equal(conjuntoIgual([1, 3], [3, 1]), true);
  assert.equal(conjuntoIgual([], []), true);
  assert.equal(conjuntoIgual([2, 2], [2]), true);
  assert.equal(conjuntoIgual(['1'], [1]), true);
  assert.equal(conjuntoIgual([1], []), false);
  assert.equal(conjuntoIgual([], [0]), false);
  assert.equal(conjuntoIgual([1, 2], [1, 3]), false);
  assert.equal(conjuntoIgual([1, 2, 3], [1, 2]), false);
});

test('ortografía común: un ejercicio en construcción vale para la base y dice qué tarea lo escribe', () => {
  const e = enConstruccion(135);
  assert.deepEqual(e.nombre, { es: 'En construcción', en: 'Under construction' });
  assert.match(e.detalle.es, /135/);
  assert.match(e.detalle.en, /135/);
  assert.deepEqual(e.generar(), { n: 0 });
  const caja = { innerHTML: '' };
  e.montar(caja);
  assert.match(caja.innerHTML, /todavía no está: lo escribe la tarea 135/);
});

test('ortografía común: las seis prácticas de la sección, y cada esqueleto declara los ejercicios del catálogo', () => {
  const seccion = CATALOGO.filter(p => p.seccion === 'ortografia');
  assert.deepEqual(seccion.map(p => p.slug), ['ortografia', ...Object.keys(BLOQUES)]);
  for (const p of seccion) assert.equal(p.transversal, true, p.slug);
  for (const [slugBloque, tarea] of Object.entries(BLOQUES)) {
    const ficha = seccion.find(p => p.slug === slugBloque);
    // Los publicados tras su revisión (140-142); los demás, no hasta entonces.
    const PUBLICADOS = ['ortografia-letras']; // 140, 9-11-2026
    assert.equal(ficha.disponible, PUBLICADOS.includes(slugBloque), `${slugBloque}: se publica solo tras su revisión (140-142)`);
    assert.equal(ficha.ruta, `${slugBloque}/`);
    assert.match(ficha.nombre.es, /^Ortografía: /);
    assert.match(ficha.nombre.en, /^Spanish spelling: /);
    // El esqueleto, leído como texto (al importarlo arrancaría la base, que necesita el navegador).
    const fuente = readFileSync(new URL(`../practicas/${slugBloque}/practica.js`, import.meta.url), 'utf8');
    assert.match(fuente, new RegExp(`slug: '${slugBloque}'`));
    assert.match(fuente, /idioma: 'es'/);
    const llamadas = fuente.match(/enConstruccion\((\d+)\)/g) ?? [];
    // Mientras sea esqueleto, tantos «en construcción» como ejercicios; cuando el bloque tenga los suyos, ya no.
    if (llamadas.length) {
      assert.equal(llamadas.length, ficha.nEjercicios, slugBloque);
      assert.ok(llamadas.every(l => l === `enConstruccion(${tarea})`), `${slugBloque}: lo escribe la ${tarea}`);
      const ejercicios = Array.from({ length: ficha.nEjercicios }, () => enConstruccion(tarea));
      assert.equal(validarPractica({ slug: slugBloque, idioma: 'es', ejercicios }), ficha);
    }
    const html = readFileSync(new URL(`../practicas/${slugBloque}/index.html`, import.meta.url), 'utf8');
    assert.match(html, /<html lang="es">/);
    assert.ok(html.includes(`<title>${ficha.nombre.es}</title>`), `${slugBloque}: título`);
  }
});

test('portada: la ortografía sale en su sección, con lo publicado en el orden del catálogo, y no en la de la U3', async () => {
  const { seccionesPropias, seccionesPorUnidad } = await import('../practicas/vista-tareas.js');
  const { seccionSaleAbierta } = await import('../practicas/portada.js');
  const propias = seccionesPropias();
  assert.deepEqual(propias.map(s => s.seccion.id), ['ortografia']);
  assert.deepEqual(propias[0].seccion.titulo, { es: 'Ortografía', en: 'Spanish spelling' });
  const publicadas = CATALOGO.filter(p => p.seccion === 'ortografia' && p.disponible).map(p => p.slug);
  assert.deepEqual(propias[0].practicas.map(p => p.slug), publicadas);
  assert.equal(publicadas[0], 'ortografia', 'la 45, la primera');
  // Al publicar un bloque, sale detrás de la 45; sin nada publicado, la sección no sale.
  const conTildes = CATALOGO.map(p => (p.slug === 'ortografia-tildes' ? { ...p, disponible: true } : p));
  assert.deepEqual(seccionesPropias({ catalogo: conTildes })[0].practicas.map(p => p.slug).slice(0, 2), ['ortografia', 'ortografia-tildes']);
  assert.deepEqual(seccionesPropias({ catalogo: CATALOGO.map(p => (p.seccion ? { ...p, disponible: false } : p)) }), []);
  // En la U3 (desde el 16-11) ya no sale ninguna práctica con sección.
  for (const s of seccionesPorUnidad('2026-11-20', { tareas: [] })) {
    assert.ok(!s.practicas.some(p => p.seccion), `unidad ${s.unidad.n}`);
  }
  // Plegada salvo que el alumno la abriera.
  assert.equal(seccionSaleAbierta('ortografia', {}), false);
  assert.equal(seccionSaleAbierta('ortografia'), false);
  assert.equal(seccionSaleAbierta('ortografia', { ortografia: false, 3: true }), false);
  assert.equal(seccionSaleAbierta('ortografia', { ortografia: true }), true);
});
