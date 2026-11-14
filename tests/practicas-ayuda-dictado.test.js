// «No lo sé» en `dictado` (tarea 189): la explicación lleva la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/dictado/logica.js';
import * as X from '../practicas/dictado/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const A = n => L.agrupar(n).replace(/\s/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };

test('dictado · ejercicio 1: la explicación lleva el número que da por bueno el ejercicio', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarDictado, 1)) {
    const t = plano(X.explicaDictado(item, ctx(idioma)));
    assert.ok(L.esRespuestaDictado(item, String(item.n)));
    assert.ok(t.includes(`${RESP[idioma]} ${A(item.n)}.`), t);
    assert.ok(t.includes(item.texto), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('dictado · ejercicio 2: -teen/-ty y escritura llevan su solución', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(rng => (rng.azar() < 0.5 ? L.generarTeen(rng) : L.generarEscritura(rng)), 2, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaTeenOEscritura(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    if (item.tipo === 'teen') {
      assert.equal(item.opciones[item.solucion], item.n);
      assert.ok(t.includes(`${RESP[idioma]} ${A(item.n)}.`), t);
    } else {
      const buena = item.opciones[item.solucion];
      assert.equal(buena, L.enNum(item.n));
      assert.ok(t.includes(`${RESP[idioma]} ${buena}.`), t);
    }
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['escritura', 'teen']);
});

test('dictado · ejercicio 3: las fichas llevan el texto del número y el dictado en español, la cifra', () => {
  const vistos = {};
  for (const idioma of IDIOMAS) for (const item of generar(rng => (rng.azar() < 0.6 ? L.generarFichas(rng) : L.generarDictadoEs(rng)), 3, 2400)) {
    vistos[item.tipo] = (vistos[item.tipo] ?? 0) + 1;
    const t = plano(X.explicaFichasODictadoEs(item, ctx(idioma)));
    assert.ok(!/undefined|NaN/.test(t), t);
    assert.equal(item.texto, L.esNum(item.n));
    if (item.tipo === 'fichas') {
      assert.ok(L.esSecuenciaCorrecta(item, item.texto.split(' ')));
      assert.ok(t.includes(`${RESP[idioma]} ${item.texto}.`), t);
    } else {
      assert.ok(t.includes(`${RESP[idioma]} ${A(item.n)}.`), t);
    }
  }
  assert.deepEqual(Object.keys(vistos).sort(), ['dictado_es', 'fichas']);
});

// ─── Revisión 193 ─────────────────────────────────────────────────────────────

test('dictado · ejercicios 1 y 3: los dos grupos dan el número (el de detrás de thousand/mil, a tres cifras), sin «·»', () => {
  const casos = { tres: 0, conCero: 0, sinDetras: 0 };
  const gen = [[L.generarDictado, 31], [L.generarDictadoEs, 32]];
  for (const [fn, semilla] of gen) for (const idioma of IDIOMAS) for (const item of generar(fn, semilla, 2000)) {
    const html = X.explicaDictado(item, ctx(idioma));
    const t = plano(html);
    assert.ok(!html.includes('·') && !html.includes('&middot;'), t);   // en la U1 «·» es el producto
    assert.ok(t.includes(item.texto), t);
    const n = item.n, k = Math.floor(n / 1000), u = n % 1000;
    if (k === 0) {
      casos.tres++;
      const [c, d, un] = String(n);
      assert.equal(Number(c) * 100 + Number(d) * 10 + Number(un), n);
      assert.match(t, new RegExp(`: ${c} \\D+, ${d} \\D+ (y|and) ${un} \\D+ → ${n} `), t);
      assert.ok(!/\b1 (centenas|decenas|unidades|hundreds|tens|units)\b/.test(t), t);
    } else {
      const detras = String(u).padStart(3, '0');
      if (/^0/.test(detras)) casos.conCero++;
      if (u === 0) casos.sinDetras++;
      assert.equal(Number(`${k}${detras}`), n);
      assert.ok(t.includes(`→ ${k} ;`) || t.includes(`→ ${k};`), t);
      assert.ok(t.includes(`→ ${detras}`), t);
      assert.ok(t.includes(idioma === 'es' ? `delante de «${item.tipo === 'dictado' ? 'thousand' : 'mil'}»` : `before “${item.tipo === 'dictado' ? 'thousand' : 'mil'}”`), t);
    }
  }
  assert.ok(casos.tres > 0 && casos.conCero > 0, JSON.stringify(casos));
});

test('dictado · ejercicio 2 (escritura): la regla va delante y la cuenta no se pega a la frase siguiente', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarEscritura, 33)) {
    const html = X.explicaTeenOEscritura(item, ctx(idioma));
    assert.ok(html.startsWith(`<p>${X.notaEscritura(item, ctx(idioma))}</p>`), html);
    assert.ok(!/= <span class="cuenta">[^<]+<\/span> [A-Z]/.test(html), html);
  }
});

test('dictado · ejercicio 3 (fichas): cada ficha que sobra tiene su porqué, con las comillas de cada idioma y sin «La respuesta es:»', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarFichas, 34)) {
    const html = X.explicaFichasODictadoEs(item, ctx(idioma));
    const t = plano(html);
    assert.ok(!/(es|is):/.test(t.split(item.texto).pop()), t);
    if (idioma === 'en') assert.ok(!/[«»"]/.test(t), t); else assert.ok(!/[“”"]/.test(t), t);
    for (const s of item.sobran) {
      assert.ok(!item.texto.split(' ').includes(s));
      const q = idioma === 'es' ? `«${s}»: ` : `“${s}”: `;
      assert.ok(t.includes(q), t);
      assert.match(t.split(q)[1], /^[a-z«“]/, t);   // minúscula tras los dos puntos
    }
    // «un mil» solo se dice cuando el número empieza por «mil»
    if (item.sobran.includes('un')) assert.equal(/un mil/.test(t), item.texto.startsWith('mil'), t);
  }
});

// ─── Reabierta del 14-11 de la tarea 29: el feedback (no solo la tarjeta) ───────

// Una minúscula o un dígito, un espacio y una mayúscula de principio de frase: «fifty = 50 Ojo…» (falta el punto).
// Un <br> es un salto de línea de verdad: separa frases.
const planoBr = html => plano(html.replace(/<br>/g, ' | '));
const PEGADA = /[\p{Ll}\d] (Ojo|Careful|Aquí|Here|Del|From|Fíjate|Look|En inglés|In English|Cuando|When|Si |If )/u;

test('dictado · feedback (14-11): ningún feedback lleva «·» ni frases pegadas, y los grupos son los de la tarjeta', () => {
  for (const idioma of IDIOMAS) {
    const c = ctx(idioma);
    for (const item of generar(L.generarDictado, 51, 1000)) {
      for (const [acierto, e] of [[true, String(item.n)], [false, String(item.n + 1)]]) {
        const t = planoBr(X.feedbackDictado(item, e, acierto, c));
        assert.ok(!t.includes('·'), t);
        assert.ok(!PEGADA.test(t), t);
      }
      if (item.n % 1000 !== 0 && item.n >= 1000 && item.n % 1000 !== item.n) {
        const k = Math.floor(item.n / 1000), u = item.n % 1000;
        const t = planoBr(X.feedbackDictado(item, String(item.n), true, c));
        if (k && u) assert.ok(t.includes(`→ ${k} ;`) && t.includes(`→ ${String(u).padStart(3, '0')}`), t);
      }
    }
    for (const item of generar(L.generarDictadoEs, 52, 1000)) {
      const t = planoBr(X.feedbackDictado(item, String(item.n + 1), false, c));
      assert.ok(!t.includes('·') && !PEGADA.test(t), t);
    }
    for (const item of generar(L.generarEscritura, 53, 1000)) {
      const t = planoBr(X.feedbackEscritura(item, c));
      assert.ok(!t.includes('·') && !PEGADA.test(t), t);
      assert.ok(/\d ?\. \S/.test(t), `«fifty = 50» lleva punto antes de la nota: ${t}`);
    }
    for (const item of generar(L.generarFichas, 54, 1000)) {
      for (const [acierto, mias] of [[true, item.fichas.slice(0, 1)], [false, item.sobran.concat(item.fichas.slice(0, 2))]]) {
        const t = planoBr(X.feedbackFichas(item, mias, acierto, c));
        assert.ok(!t.includes('·') && !PEGADA.test(t), t);
      }
    }
  }
});

test('dictado · comillas (14-11): ningún texto lleva comillas rectas', () => {
  const rectas = /(^|[\s(>])"[^"<>=]+"/;
  const visita = (o, ruta) => {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'function' || typeof v === 'string') {
        if ((k === 'en' || k === 'es') && rectas.test(String(v))) assert.fail(`${ruta}.${k}: ${String(v).slice(0, 120)}`);
      } else if (v && typeof v === 'object') visita(v, `${ruta}.${k}`);
    }
  };
  visita(X.TX, 'TX');
});
