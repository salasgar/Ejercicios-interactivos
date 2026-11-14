// «No lo sé» en «Caza el error» (tarea 186): la explicación de cada ejercicio lleva la solución del ítem,
// calculada con la lógica de la práctica (no copiada de la explicación), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T, esc } from '../practicas/_comun/textos.js';
import { generarHay, generarLinea, generarNombre } from '../practicas/errores/logica.js';
import { explicaItem, explicaHay, explicaLinea, explicaNombre, NOMBRES, PLANTILLAS, PLANTILLA_POR_ID, html } from '../practicas/errores/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc });
const plano = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;

function comun(item, idioma, h) {
  assert.doesNotMatch(h, /undefined|NaN|\[object|null|×/, plano(h));
  assert.ok(plano(h).length > 30, 'demasiado corta');
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  if (!item.error) {
    assert.ok(/Está bien|It is right/.test(h), `sin error: «${plano(h)}»`);
    assert.ok(h.includes(html(plantilla.porque(item.params)[idioma])), 'lleva el porqué de la plantilla');
  } else {
    const n = item.error.linea + 1;
    assert.ok(h.includes(idioma === 'es' ? `en la línea ${n}.` : `in line ${n}.`), `lleva la línea ${n}: ${plano(h)}`);
    assert.ok(h.includes(html(item.lineas[item.error.linea][idioma])), 'cita la línea que está mal');
    assert.ok(h.includes(html(plantilla.corregida(item.params)[idioma])), 'lleva la cuenta bien hecha');
    assert.ok(h.includes(esc(NOMBRES[item.error.nombre][idioma])), 'lleva el nombre del error');
  }
}

for (const [nombre, generador, semilla] of [['hay', generarHay, 1861], ['linea', generarLinea, 1862], ['nombre', generarNombre, 1863]]) {
  test(`errores, ejercicio «${nombre}»: la explicación lleva la solución del ítem (${N} ítems, es y en)`, () => {
    const rng = crearRng(semilla);
    let conError = 0;
    for (let i = 0; i < N; i++) {
      const item = generador(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] });
      if (item.error) conError++;
      const es = explicaItem(item, textosDe('es')), en = explicaItem(item, textosDe('en'));
      comun(item, 'es', es);
      comun(item, 'en', en);
      assert.notEqual(es, en);
      if (nombre === 'linea') assert.equal(item.solucion, item.error.linea, 'la solución es la línea del error');
      if (nombre === 'nombre') assert.equal(item.solucion, item.error.nombre);
    }
    if (nombre === 'hay') assert.ok(conError > N * 0.4 && conError < N * 0.6, 'sale de los dos tipos');
  });
}

test('errores: todas las plantillas dan explicación en los dos idiomas', () => {
  assert.ok(PLANTILLAS.length >= 28);
  const rng = crearRng(1864);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 50; i++) {
      const params = p.numeros(rng);
      const item = { plantilla: p.id, params, lineas: p.lineas(params), error: p.error };
      for (const idioma of IDIOMAS) comun(item, idioma, explicaItem(item, textosDe(idioma)));
    }
  }
});

// ─── La tarjeta del «No lo sé» (revisión de la tarea 193) ───────────────────────
// El feedback de arriba (explicaItem) no cambia; la tarjeta lleva la regla delante y la respuesta al final, una vez.

const REGLA_DE = {
  hay: { es: /^Repasa cada línea/, en: /^Check each line/ },
  linea: { es: /^Repasa las líneas en orden/, en: /^Check the lines in order/ },
  nombre: { es: /^Busca la línea mala/, en: /^Find the wrong line/ },
};
const cuenta = (h, txt) => h.split(txt).length - 1;

function tarjeta(nombre, item, idioma, h) {
  const p = plano(h);
  assert.doesNotMatch(h, /undefined|NaN|\[object|null|×|&quot;/, p);
  assert.doesNotMatch(p, /"/, `comillas rectas: ${p}`);
  assert.match(h, REGLA_DE[nombre][idioma], `la regla va delante: ${p}`);
  assert.doesNotMatch(h, /respuesta es:|answer is:/, 'sin dos puntos entre el verbo y la respuesta');
  // (la línea citada del alumno, tal cual, puede empezar por mayúscula)
  assert.doesNotMatch(plano(h.replace(/<span class="linea-mala">.*?<\/span>/, 'x.')), /: [A-ZÁÉÍÓÚ][a-záéíóú]/, `minúscula tras dos puntos: ${p}`);
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  const fin = idioma === 'es' ? 'La respuesta es' : 'The answer is';
  assert.equal(cuenta(h, fin), 1, 'una sola respuesta');
  const resp = h.slice(h.lastIndexOf(fin));
  // La solución que da por buena el ejercicio, al final.
  if (nombre === 'hay') {
    const buena = esc((item.solucion === 'error' ? { es: 'Hay un error', en: 'There is a mistake' } : { es: 'Está bien', en: 'It is right' })[idioma]);
    assert.ok(resp.includes(idioma === 'es' ? `«${buena}»` : `“${buena}”`), `respuesta del ej. 1: ${p}`);
  } else if (nombre === 'linea') {
    assert.ok(resp.includes(idioma === 'es' ? `la línea ${item.solucion + 1}</strong>.` : `line ${item.solucion + 1}</strong>.`), `respuesta del ej. 2: ${p}`);
  } else {
    const nom = esc(NOMBRES[item.solucion][idioma]).replace(/(?<!m\.c\.[dm])\.$/, '');
    assert.ok(resp.includes(idioma === 'es' ? `«${nom}»` : `“${nom}”`), `respuesta del ej. 3: ${p}`);
    assert.equal(cuenta(h, nom), 1, 'el nombre del error sale una sola vez');
  }
  if (!item.error) {
    assert.doesNotMatch(h, /Está bien:|It is right:/, 'el «Está bien» no se repite: ya es la respuesta');
    return;
  }
  // Con error: la línea mala citada y la cuenta bien hecha (sus números: el resultado bueno de la plantilla).
  assert.ok(h.includes(html(item.lineas[item.error.linea][idioma])), 'cita la línea que está mal');
  const corr = plano(html(plantilla.corregida(item.params)[idioma]));
  const numeros = corr.match(/\d+/g) ?? [];
  for (const x of numeros) assert.ok(p.includes(x), `lleva el ${x} de la cuenta bien hecha: ${p}`);
  if (nombre === 'linea') assert.equal(cuenta(p, `${item.error.linea + 1}. `) >= 1, true);
  else assert.ok(h.includes(idioma === 'es' ? `en la línea ${item.error.linea + 1}:` : `in line ${item.error.linea + 1}:`), 'dice en qué línea está');
}

const EXPLICA = { hay: explicaHay, linea: explicaLinea, nombre: explicaNombre };
for (const [nombre, generador, semilla] of [['hay', generarHay, 1931], ['linea', generarLinea, 1932], ['nombre', generarNombre, 1933]]) {
  test(`errores, tarjeta del ej. «${nombre}»: regla delante, línea mala, cuenta bien hecha y la respuesta al final (${N} ítems, es y en)`, () => {
    const rng = crearRng(semilla);
    for (let i = 0; i < N; i++) {
      const item = generador(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] });
      for (const idioma of IDIOMAS) tarjeta(nombre, item, idioma, EXPLICA[nombre](item, textosDe(idioma)));
    }
  });
}

test('errores, tarjeta: todas las plantillas, en el ej. 1 (y las de error, en el 2 y el 3)', () => {
  const rng = crearRng(1934);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 30; i++) {
      const params = p.numeros(rng);
      const base = { plantilla: p.id, params, lineas: p.lineas(params), error: p.error };
      const casos = [['hay', { ...base, solucion: p.error ? 'error' : 'bien' }]];
      if (p.error) casos.push(['linea', { ...base, solucion: p.error.linea }], ['nombre', { ...base, solucion: p.error.nombre }]);
      for (const [nombre, item] of casos) for (const idioma of IDIOMAS) tarjeta(nombre, item, idioma, EXPLICA[nombre](item, textosDe(idioma)));
    }
  }
});

test('errores, tarjeta de «m.c.d. = 0»: el m.c.d. es 1 porque es el ÚNICO divisor común, no solo porque el 1 divide a los dos', () => {
  const p = PLANTILLA_POR_ID['e-mcd-cero'];
  const params = p.numeros(crearRng(1935));
  const item = { plantilla: p.id, params, lineas: p.lineas(params), error: p.error, solucion: p.error.nombre };
  for (const idioma of IDIOMAS) {
    const h = explicaNombre(item, textosDe(idioma));
    assert.match(h, idioma === 'es' ? /único divisor que tienen en común/ : /only divisor that .* have in common/);
    assert.doesNotMatch(h, /El 1 es divisor de los dos números, así que|1 is a divisor of both numbers, so/);
  }
});

test('errores, tarjeta: comillas inglesas “” (no rectas) en «lowest/least common multiple»', () => {
  const p = PLANTILLA_POR_ID['b-lcm-nombres'];
  const params = p.numeros(crearRng(1936));
  const h = explicaHay({ plantilla: p.id, params, lineas: p.lineas(params), error: null, solucion: 'bien' }, textosDe('en'));
  assert.match(h, /“Lowest” and “least”/);
});
