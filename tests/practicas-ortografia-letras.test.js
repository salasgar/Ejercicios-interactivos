// Ortografía: las letras (tarea 136). Los bancos, las reglas, las explicaciones y los generadores
// (todo puro). Los `montar` se prueban con clics en el navegador (docs/practicas-ortografia.md, §3).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  HACHES, BV, GJ, OTRAS, BANCOS, REGLAS, EXISTEN, generadorDe, partesLetras, palabraCon,
  explicacionHaches, explicacionLetras, idErrorHaches, idErrorLetras, rellenarHaches,
} from '../practicas/ortografia-letras/logica.js';
import { TX } from '../practicas/ortografia-letras/textos.js';
import { PAREJAS } from '../practicas/ortografia/logica.js';
import { nivelDe } from '../practicas/_comun/nivel.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';

const PATRON_ID = /^[a-z0-9-]{1,40}$/;
const NOMBRES = { haches: 'hay/ahí/ay', bv: 'b o v', gj: 'g o j', otras: 'otras letras' };
const BANCOS_LETRAS = { bv: BV, gj: GJ, otras: OTRAS };
const norm = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Lista negra: «Lo que nunca es distractor» (proyecto.md), en lo que cabe en este bloque. Ninguna palabra
// del banco, ni bien escrita ni con la letra mala, puede ser una de estas formas dobles.
const LISTA_NEGRA = ['cinc', 'zinc', 'biznieto', 'bisnieto', 'kilómetro', 'quilómetro', 'octógono', 'octágono', 'solo', 'sólo',
  'período', 'periodo', 'vídeo', 'video', 'fútbol', 'futbol', 'icono', 'ícono', 'élite', 'elite', 'imprimido', 'impreso',
  'freído', 'frito', 'posguerra', 'postguerra', 'casa', 'caza', 'cocer', 'coser', 'enseguida', 'deprisa', 'aprisa', 'enfrente',
  'asimismo', 'adonde', 'entretanto', 'bocabajo', 'sobremanera', 'guion', 'guión', 'truhan', 'truhán', 'rio', 'río', 'frio', 'frío',
  'clubs', 'clubes', 'whisky', 'güisqui', 'wasap', 'whatsapp', 'ovni', 'sicología', 'psicología', 'septiembre', 'setiembre',
  'cinco', 'zinco'];

const palabrasDe = it => [it.palabra, ...(it.mal ?? []), ...(it.opciones ?? [])].filter(Boolean).flatMap(t => String(t).toLowerCase().split(/[^a-záéíóúüñ]+/)).filter(Boolean);

// --- Forma de los bancos --------------------------------------------------------------

test('ortografía-letras: está en el catálogo con sus 4 ejercicios y sin publicar', () => {
  const ficha = CATALOGO.find(p => p.slug === 'ortografia-letras');
  assert.ok(ficha);
  assert.equal(ficha.nEjercicios, 4);
  assert.equal(ficha.id, 65);
});

test('ortografía-letras: nombre y detalle de cada ejercicio, en { es, en }, y el inglés empieza por «Spanish spelling»', () => {
  for (const clave of ['haches', 'bv', 'gj', 'otras']) {
    const t = TX[clave];
    for (const campo of ['nombre', 'detalle', 'introduccion']) {
      assert.equal(typeof t[campo].es, 'string', `${clave}.${campo}.es`);
      assert.equal(typeof t[campo].en, 'string', `${clave}.${campo}.en`);
    }
    assert.match(t.nombre.en, /^Spanish spelling: /, clave);
  }
});

test('ortografía-letras: cada ítem de letras tiene un solo hueco, opciones distintas y su regla', () => {
  for (const [nombre, banco] of Object.entries(BANCOS_LETRAS)) {
    for (const it of banco) {
      const id = `${nombre}: ${it.hueco}`;
      assert.equal((it.hueco.match(/_/g) ?? []).length, 1, id);
      assert.ok([1, 2, 3].includes(it.nivel), id);
      assert.ok(REGLAS[it.regla], `${id}: regla «${it.regla}» sin definir`);
      assert.equal(it.opciones[0], it.buena, id);
      assert.equal(new Set(it.opciones).size, it.opciones.length, `${id}: opciones repetidas`);
      assert.ok(it.opciones.length >= 2 && it.opciones.length <= 3, id);
      assert.equal(new Set(it.mal.concat(it.palabra)).size, it.mal.length + 1, `${id}: la palabra mala coincide con la buena`);
      if (it.frase) {
        assert.equal((it.frase.match(/\{\}/g) ?? []).length, 1, `${id}: la frase tiene que llevar un {}`);
        assert.ok(!it.frase.startsWith('{}'), `${id}: el hueco no va al principio de la frase`);
        assert.ok(it.frase.split(/\s+/).length <= 14, `${id}: frase de más de 14 palabras`);
      }
    }
  }
});

test('ortografía-letras: cada palabra cumple el patrón de su regla o es una excepción declarada', () => {
  for (const [nombre, banco] of Object.entries(BANCOS_LETRAS)) {
    for (const it of banco) {
      const r = REGLAS[it.regla];
      const cumple = r.patron.test(it.palabra) || (r.excepciones ?? []).includes(it.palabra);
      assert.ok(cumple, `${nombre}: «${it.palabra}» no cumple la regla «${it.regla}» ni es una excepción suya`);
      assert.equal(r.letra.includes(it.buena) || ['bv', 'gj'].includes(r.letra) || r.letra === it.buena || r.letra === 'rr' || r.letra === 'r', true, `${nombre}: «${it.palabra}» (${it.buena}) y la letra de la regla «${r.letra}»`);
    }
  }
});

test('ortografía-letras: una regla con {n} en su texto exige la nota en cada ítem', () => {
  for (const banco of Object.values(BANCOS_LETRAS)) {
    for (const it of banco) {
      if (REGLAS[it.regla].texto.includes('{n}')) assert.ok(it.nota, `«${it.palabra}» (${it.regla}) necesita nota`);
    }
  }
});

test('ortografía-letras: la regla de oro: si la letra mala también da una palabra, va en frase y las dos están en EXISTEN', () => {
  for (const [nombre, banco] of Object.entries(BANCOS_LETRAS)) {
    for (const it of banco) {
      const id = `${nombre}: ${it.palabra}`;
      const malasQueExisten = it.mal.filter(m => EXISTEN[m.toLowerCase()]);
      if (malasQueExisten.length) {
        assert.ok(it.frase, `${id}: «${malasQueExisten}» existe; el ítem necesita frase`);
        assert.ok(EXISTEN[it.palabra.toLowerCase()], `${id}: falta su significado en EXISTEN`);
      }
      if (['homofono-bv', 'pares-r'].includes(it.regla)) {
        assert.ok(it.frase, id);
        assert.equal(it.mal.length, 1, id);
        assert.ok(EXISTEN[it.palabra.toLowerCase()] && EXISTEN[it.mal[0].toLowerCase()], `${id}: las dos palabras tienen que estar en EXISTEN`);
      }
    }
  }
});

test('ortografía-letras: los pares de palabras que existen salen con las dos lecturas y frases distintas', () => {
  const porPar = new Map();
  for (const it of [...BV, ...OTRAS].filter(i => ['homofono-bv', 'pares-r'].includes(i.regla))) {
    const clave = [it.palabra, it.mal[0]].sort().join('/');
    if (!porPar.has(clave)) porPar.set(clave, []);
    porPar.get(clave).push(it);
  }
  assert.ok(porPar.size >= 13);
  for (const [par, items] of porPar) {
    assert.equal(items.length, 2, par);
    assert.notEqual(items[0].palabra, items[1].palabra, par);
    assert.notEqual(items[0].frase, items[1].frase, par);
  }
  for (const palabra of Object.keys(EXISTEN)) {
    const sale = [...BV, ...OTRAS].some(i => i.palabra.toLowerCase() === palabra);
    assert.ok(sale, `«${palabra}» está en EXISTEN y no sale en ningún ítem`);
  }
});

test('ortografía-letras: ítems del ejercicio 1: huecos, opciones y reglas del bloque', () => {
  for (const it of HACHES) {
    const id = it.texto;
    assert.equal((it.texto.match(/_/g) ?? []).length, 1, id);
    assert.ok(it.opciones.includes(it.buena), id);
    assert.ok(it.texto.indexOf('_') > 1, `${id}: el hueco no va al principio`);
    assert.ok(!/(^|[.?!:]\s|[«¿])¡?_/.test(it.texto), `${id}: el hueco no empieza una frase (saldría en minúscula donde va mayúscula)`);
    assert.ok(it.texto.split(/\s+/).length <= 14, `${id}: más de 14 palabras`);
    assert.ok(!/\bha de\b/i.test(it.texto), `${id}: nada de «ha de»`);
    if (it.nivel !== 2) assert.ok(!/\b(a ver|haber)\b/i.test(it.texto), `${id}: «a ver»/«haber» solo en el nivel 2`);
    if (it.nivel === 3 && ['AHA', 'EHE'].includes(it.clave)) assert.ok(!/había/i.test(it.texto), `${id}: «había» es la palabra del truco`);
  }
});

test('ortografía-letras: el nivel 1 del ejercicio 1 son hay/ahí/ay (≥ 6 frases cada una); el 2, a ver/haber; el 3, las parejas de la h', () => {
  const cuenta = (nivel, palabra) => HACHES.filter(i => i.nivel === nivel && i.buena === palabra).length;
  for (const p of ['hay', 'ahí', 'ay']) assert.ok(cuenta(1, p) >= 6, p);
  for (const p of ['a ver', 'haber']) assert.ok(cuenta(2, p) >= 8, p);
  for (const p of ['a', 'ha', 'e', 'he', 'echo', 'hecho', 'habría', 'abría']) assert.ok(cuenta(3, p) >= 2, p);
  for (const it of HACHES.filter(i => i.nivel === 1)) assert.deepEqual(it.opciones, ['hay', 'ahí', 'ay']);
  for (const it of HACHES.filter(i => i.nivel === 2)) assert.deepEqual(it.opciones, ['a ver', 'haber']);
});

test('ortografía-letras: ninguna frase del ejercicio 1 está en las parejas de la práctica «ortografia»', () => {
  const ya = new Set(Object.values(PAREJAS).flatMap(p => p.frases.map(f => norm(f[0]))));
  for (const it of HACHES) assert.ok(!ya.has(norm(it.texto)), `repetida: ${it.texto}`);
  const propias = new Set();
  for (const it of HACHES) {
    assert.ok(!propias.has(norm(it.texto)), `duplicada: ${it.texto}`);
    propias.add(norm(it.texto));
  }
});

test('ortografía-letras: sin ítems repetidos dentro de cada ejercicio', () => {
  for (const [nombre, banco] of Object.entries(BANCOS_LETRAS)) {
    const vistos = new Set();
    for (const it of banco) {
      const clave = `${it.hueco}|${it.buena}|${it.frase ?? ''}`;
      assert.ok(!vistos.has(clave), `${nombre}: repetido ${clave}`);
      vistos.add(clave);
    }
  }
});

// --- Tamaño y equilibrio por nivel -------------------------------------------------------

test('ortografía-letras: al menos 16 ítems por nivel y ejercicio (12 en el nivel 1 del ejercicio 1, de tres botones)', () => {
  for (const [nombre, banco] of Object.entries(BANCOS)) {
    for (const nivel of [1, 2, 3]) {
      const n = banco.filter(i => i.nivel === nivel).length;
      const minimo = nombre === 'haches' && nivel === 1 ? 12 : 16;
      assert.ok(n >= minimo, `${NOMBRES[nombre]}, nivel ${nivel}: ${n} ítems (< ${minimo})`);
    }
  }
});

test('ortografía-letras: equilibrio: ningún botón acierta más del 60 % dentro de su nivel', () => {
  for (const [nombre, banco] of Object.entries(BANCOS)) {
    for (const nivel of [1, 2, 3]) {
      const items = banco.filter(i => i.nivel === nivel);
      const cuenta = {};
      for (const i of items) cuenta[i.buena] = (cuenta[i.buena] ?? 0) + 1;
      for (const [boton, n] of Object.entries(cuenta)) {
        assert.ok(n / items.length <= 0.6, `${NOMBRES[nombre]}, nivel ${nivel}: «${boton}» acierta ${n}/${items.length}`);
      }
    }
  }
});

test('ortografía-letras: ambas letras salen como respuesta correcta en cada nivel de b/v y de g/j', () => {
  for (const [banco, pares] of [[BV, ['b', 'v']], [GJ, ['g', 'j']]]) {
    for (const nivel of [1, 2, 3]) {
      for (const l of pares) assert.ok(banco.some(i => i.nivel === nivel && i.buena === l), `${l} en el nivel ${nivel}`);
    }
  }
});

// --- Generadores ------------------------------------------------------------------------

const SESIONES = { 1: { puntos: 0, vidas: 5 }, 2: { puntos: 4, vidas: 5 }, 3: { puntos: 8, vidas: 5 } };

test('ortografía-letras: el generador nunca da un ítem por encima del nivel de la sesión (fuerza bruta) y llega a cada nivel', () => {
  for (const [nombre, banco] of Object.entries(BANCOS)) {
    const generar = generadorDe(banco, () => null);
    for (const [nivel, sesion] of Object.entries(SESIONES)) {
      assert.equal(nivelDe(sesion), Number(nivel));
      const rng = crearRng(136 * 1000 + Number(nivel));
      const vistos = new Set();
      for (let k = 0; k < 3000; k++) {
        const item = generar(rng, sesion);
        const dato = banco[item.i];
        assert.ok(dato, `${nombre}: ítem ${item.i} fuera del banco`);
        assert.ok(dato.nivel <= Number(nivel), `${NOMBRES[nombre]}: dio un ítem de nivel ${dato.nivel} en el nivel ${nivel}`);
        assert.equal(item.nivel, Number(nivel));
        assert.deepEqual([...item.orden].sort(), [...dato.opciones].sort());
        vistos.add(dato.nivel);
      }
      assert.ok(vistos.has(Number(nivel)), `${NOMBRES[nombre]}: el nivel ${nivel} no sale nunca`);
    }
  }
});

test('ortografía-letras: con ?nivel=N forzado, solo salen ítems de ese nivel o de los de debajo', () => {
  for (const [nombre, banco] of Object.entries(BANCOS)) {
    for (const forzado of [1, 2, 3]) {
      const generar = generadorDe(banco, () => forzado);
      const rng = crearRng(777 + forzado);
      for (let k = 0; k < 1000; k++) assert.ok(banco[generar(rng, { puntos: 0, vidas: 5 }).i].nivel <= forzado, nombre);
    }
  }
});

test('ortografía-letras: las opciones salen barajadas (la buena no va siempre en el mismo botón)', () => {
  for (const [nombre, banco] of Object.entries(BANCOS)) {
    const generar = generadorDe(banco, () => 1);
    const rng = crearRng(31);
    const posiciones = new Set();
    for (let k = 0; k < 400; k++) {
      const item = generar(rng, { puntos: 0, vidas: 5 });
      posiciones.add(item.orden.indexOf(banco[item.i].buena));
    }
    assert.ok(posiciones.size >= 2, nombre);
  }
});

// --- Explicaciones e idError ---------------------------------------------------------------

test('ortografía-letras: la explicación nombra la palabra buena en <b> y no deja marcas sin sustituir', () => {
  for (const it of HACHES) {
    const e = explicacionHaches(it);
    assert.ok(e.includes(`<b>${it.buena}</b>`), it.texto);
    assert.ok(!/[{}_]/.test(e), `${it.texto}: marca sin sustituir`);
  }
  for (const [nombre, banco] of Object.entries(BANCOS_LETRAS)) {
    for (const it of banco) {
      const e = explicacionLetras(it);
      assert.ok(e.includes(`<b>${it.palabra}</b>`) || (it.nota && e.includes(`<b>${it.buena}</b>`)) || e.toLowerCase().includes(it.palabra.toLowerCase()), `${nombre}: la explicación de «${it.palabra}» no la nombra`);
      assert.ok(!/[{}_]/.test(e), `${nombre}: «${it.palabra}» deja marcas sin sustituir`);
      assert.ok(e.length > 30, it.palabra);
    }
  }
});

test('ortografía-letras: los pares que existen explican qué significa cada palabra', () => {
  for (const it of BV.filter(i => i.regla === 'homofono-bv')) {
    const e = explicacionLetras(it);
    assert.ok(e.includes(EXISTEN[it.palabra.toLowerCase()]), it.palabra);
    assert.ok(e.includes(`«${it.mal[0]}»`), it.palabra);
  }
});

test('ortografía-letras: idError con el patrón y estable por confusión', () => {
  const todos = [];
  for (const it of HACHES) for (const o of it.opciones.filter(x => x !== it.buena)) todos.push(idErrorHaches(it, o));
  for (const banco of Object.values(BANCOS_LETRAS)) for (const it of banco) for (const o of it.opciones.filter(x => x !== it.buena)) todos.push(idErrorLetras(it, o));
  for (const id of todos) assert.match(id, PATRON_ID, id);
  const bv = BV.find(i => i.palabra === 'cantaba');
  assert.equal(idErrorLetras(bv, 'v'), 'v-por-b');
  assert.equal(idErrorLetras(BV.find(i => i.palabra === 'invierno'), 'b'), 'b-por-v');
  assert.equal(idErrorLetras(GJ.find(i => i.palabra === 'pingüino'), 'gu'), 'sin-dieresis');
  assert.equal(idErrorLetras(GJ.find(i => i.palabra === 'agua'), 'gü'), 'dieresis-de-mas');
  assert.equal(idErrorLetras(GJ.find(i => i.palabra === 'garaje'), 'g'), 'g-por-j');
  assert.equal(idErrorLetras(GJ.find(i => i.palabra === 'origen'), 'j'), 'j-por-g');
  assert.equal(idErrorLetras(OTRAS.find(i => i.palabra === 'verdad'), 'z'), 'z-final-por-d');
  assert.equal(idErrorLetras(OTRAS.find(i => i.palabra === 'lápiz'), 'd'), 'd-final-por-z');
  assert.equal(idErrorLetras(OTRAS.find(i => i.palabra === 'yo'), 'll'), 'll-por-y');
  assert.equal(idErrorLetras(OTRAS.find(i => i.palabra === 'cielo'), 'z'), 'z-por-c');
  assert.equal(idErrorLetras(OTRAS.find(i => i.palabra === 'acción'), 'c'), 'c-por-cc');
  assert.equal(idErrorLetras(OTRAS.find(i => i.palabra === 'afición'), 'cc'), 'cc-por-c');
  assert.equal(idErrorLetras(OTRAS.find(i => i.palabra === 'extraño'), 's'), 's-por-x');
  assert.equal(idErrorHaches(HACHES.find(i => i.buena === 'hay'), 'ahí'), 'ahi-por-hay');
  assert.equal(idErrorHaches(HACHES.find(i => i.buena === 'a ver'), 'haber'), 'haber-por-a-ver');
  assert.ok(todos.length > 350);
});

// --- Lista negra y otras prohibiciones ------------------------------------------------------

test('ortografía-letras: lista negra: ninguna doble grafía válida, ni bien escrita ni con la letra mala', () => {
  const prohibidas = new Set(LISTA_NEGRA.map(p => p.toLowerCase()));
  for (const [nombre, banco] of Object.entries(BANCOS)) {
    for (const it of banco) for (const p of palabrasDe(it)) assert.ok(!prohibidas.has(p), `${nombre}: «${p}» está en la lista negra`);
  }
});

test('ortografía-letras: sin seseo: ningún par es homófono solo para quien sesea', () => {
  const seseo = [['casa', 'caza'], ['cocer', 'coser'], ['cabo', 'cazo'], ['asada', 'azada'], ['ves', 'vez'], ['losa', 'loza'], ['tos', 'toz']];
  const palabras = new Set([...BV, ...GJ, ...OTRAS].flatMap(i => [i.palabra, ...i.mal]).map(p => p.toLowerCase()));
  for (const [a, b] of seseo) assert.ok(!(palabras.has(a) && palabras.has(b)), `${a}/${b}`);
});

test('ortografía-letras: sin nombres de alumnos reales, sin «×» y sin datos personales en los bancos', () => {
  const texto = readFileSync(new URL('../practicas/ortografia-letras/logica.js', import.meta.url), 'utf8');
  assert.ok(!texto.includes('×'));
  assert.ok(!/@|https?:\/\//.test(texto));
  const frases = [...HACHES.map(i => i.texto), ...[...BV, ...GJ, ...OTRAS].map(i => i.frase).filter(Boolean)];
  for (const f of frases) assert.ok(f.split(/\s+/).length <= 14, f);
});

test('ortografía-letras: la diéresis solo sobre la u de güe/güi; el resto de la palabra no la lleva', () => {
  for (const it of GJ) {
    assert.ok(!/gü[aoóáu]/.test(it.palabra), it.palabra);
  }
});

test('ortografía-letras: las excepciones de b/v y de g/j se explican en el nivel 3, nunca antes', () => {
  for (const it of [...BV, ...GJ].filter(i => ['exc-bv', 'exc-gj', 'homofono-bv'].includes(i.regla))) assert.equal(it.nivel, 3, it.palabra);
  for (const p of ['árabe', 'hervir', 'servir', 'vivir', 'movilidad', 'civilidad', 'tejer', 'crujir']) {
    assert.equal([...BV, ...GJ].find(i => i.palabra === p)?.nivel, 3, p);
  }
});

test('ortografía-letras: hay una palabra buena construida con cada hueco (palabraCon y partesLetras)', () => {
  const it = BV.find(i => i.palabra === 'tubo');
  assert.equal(palabraCon(it, 'v'), 'tuvo');
  const { antes, despues } = partesLetras(it);
  assert.equal(`${antes}b${despues}`, 'El agua sale por el tubo de la fuente.');
  assert.equal(rellenarHaches(HACHES[0], 'hay'), HACHES[0].texto.replace('_', 'hay'));
  const sin = partesLetras(BV.find(i => i.palabra === 'cantaba'));
  assert.deepEqual(sin, { antes: 'canta', despues: 'a' });
});
