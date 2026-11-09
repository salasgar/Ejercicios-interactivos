// Ortografía: puntuación y mayúsculas (practicas/ortografia-puntuacion/, tarea 137): los
// cuatro bancos (mayúsculas, el punto y la coma, dos puntos y el saludo, el correo al
// profesor), sus niveles y sus generadores. Lo que se puede comprobar por la forma:
// que las malas sean la buena con UN cambio de signos, espacios, mayúsculas, tildes o
// abreviaturas; que cada nivel tenga ítems suficientes; que ningún botón gane más del
// 60 %; que el generador nunca dé un ítem por encima del nivel del alumno. El
// significado de cada frase hay que revisarlo a mano (docs/practicas-ortografia.md, §6).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { crearRng } from '../practicas/_comun/rng.js';
import { nivelDe, etiquetaNivel } from '../practicas/_comun/nivel.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import {
  MAYUSCULAS, REGLAS_MAYUSCULAS, PUNTO_COMA, DOS_PUNTOS, CORREOS, ASUNTO_CUERPO, BANCO_CORREOS, MOTIVOS, ABREVIATURAS,
  esAsuntoCuerpo, piezasMayusculas, buenasMayusculas, explicacionMayusculas, idErrorMayusculas,
  generarMayusculas, generarPuntoComa, generarDosPuntos, generarCorreos, explicacionElegir, idErrorElegir,
} from '../practicas/ortografia-puntuacion/logica.js';
import { TX } from '../practicas/ortografia-puntuacion/textos.js';

const PATRON_ID = /^[a-z0-9-]{1,40}$/;
const NIVELES = [1, 2, 3];
const porNivel = (banco, n) => banco.filter(x => x.nivel === n);

// Lo que nunca es distractor (docs/practicas-ortografia.md, §6): ninguna frase del bloque usa
// una palabra de estas parejas, que la RAE admite de dos maneras o que dependen del sentido.
const LISTA_NEGRA = [
  'sólo', 'solo', 'período', 'periodo', 'vídeo', 'video', 'cardíaco', 'olimpíada', 'policíaco', 'fútbol', 'futbol', 'chófer',
  'icono', 'ícono', 'élite', 'quilómetro', 'octógono', 'octágono', 'zinc', 'biznieto', 'bisnieto',
  'enseguida', 'en seguida', 'deprisa', 'de prisa', 'aprisa', 'enfrente', 'en frente', 'asimismo', 'así mismo', 'adonde', 'a donde',
  'entretanto', 'bocabajo', 'sobremanera', 'treintaiuno', 'undécimo', 'decimoprimero', 'duodécimo', 'decimotercero', 'onceavo', 'doceavo',
  'imprimido', 'freído', 'proveído', 'posguerra', 'postguerra', 'clubs', 'wasap', 'whatsapp', 'güisqui', 'whisky',
  'veintiún', 'caza', 'cocer', 'coser',
];
const SENTIDO = [/\bsol\b/i, /\bluna\b/i, /\btierra\b/i, /\binternet\b/i, /\bayuntamiento\b/i, /\bestado\b/i, /\biglesia\b/i, /mar menor/i];
const enLista = texto => LISTA_NEGRA.filter(p => new RegExp(`(^|[^\\p{L}])${p}($|[^\\p{L}])`, 'iu').test(texto));

// Nombres de los saludos y de las firmas: inventados (nunca de alumnos reales).
const NOMBRES_PERMITIDOS = ['Juan Luis', 'Marta', 'Lucía', 'Pablo', 'Marcos', 'Ángela', 'Álvaro', 'Hugo', 'Elena', 'Carmen', 'Ana', 'Coco'];

const sinTildes = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '');
/** Solo las letras y las cifras, sin mayúsculas: lo que no cambia entre una buena y una mala de signos. */
const letras = t => t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
/** Igual, sin tildes y con las abreviaturas del chat deshechas. */
const letrasCorreo = t => sinTildes(t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean).map(p => ABREVIATURAS[p] ?? p).join('')).replace(/\s/g, '');

// --- Forma de los bancos ---------------------------------------------------------------

test('puntuación: mayúsculas, texto y correcto solo difieren en mayúsculas y minúsculas, en 1-3 palabras, con un tipo por palabra', () => {
  for (const f of MAYUSCULAS) {
    const a = f.texto.split(' '), b = f.correcto.split(' ');
    assert.equal(a.length, b.length, f.texto);
    assert.equal(f.texto.toLowerCase(), f.correcto.toLowerCase(), `solo cambian mayúsculas y minúsculas: ${f.texto}`);
    const cambian = buenasMayusculas(f);
    assert.ok(cambian.length >= 1 && cambian.length <= 3, `1-3 palabras mal: ${f.texto}`);
    assert.equal(f.tipos.length, cambian.length, `un tipo por palabra cambiada: ${f.texto}`);
    for (const t of f.tipos) assert.ok(REGLAS_MAYUSCULAS[t], `tipo conocido: ${t}`);
    assert.ok(NIVELES.includes(f.nivel));
    assert.equal(piezasMayusculas(f).length, a.length);
  }
});

test('puntuación: mayúsculas, ≥ 25 % de las frases de cada nivel tienen una mayúscula de más', () => {
  for (const n of NIVELES) {
    const frases = porNivel(MAYUSCULAS, n);
    const deMas = frases.filter(f => f.texto.split(' ').some((p, i) => /^\p{Lu}/u.test(p) && /^\p{Ll}/u.test(f.correcto.split(' ')[i])));
    assert.ok(deMas.length / frases.length >= 0.25, `nivel ${n}: ${deMas.length}/${frases.length}`);
  }
});

test('puntuación: mayúsculas, ninguna frase usa palabras que dependen del sentido ni «matemáticas» como ciencia', () => {
  for (const f of MAYUSCULAS) {
    for (const re of SENTIDO) {
      assert.ok(!re.test(f.texto) && !re.test(f.correcto), `${re}: ${f.texto}`);
    }
    assert.ok(!/matemáticas/.test(f.correcto), `«matemáticas» en minúscula: ${f.correcto}`);
    assert.deepEqual(enLista(f.correcto), [], f.correcto);
  }
});

test('puntuación: mayúsculas, el nombre de una asignatura solo aparece en contextos inequívocos de asignatura', () => {
  for (const f of MAYUSCULAS.filter(x => /Matem[aá]ticas/.test(x.correcto))) {
    assert.match(f.correcto, /(examen de|Aprobé|profesora de|clase de) Matemáticas|Aprobé Matemáticas/, f.correcto);
  }
});

test('puntuación: «Mar Menor» y los genéricos geográficos: el genérico va en minúscula y el nombre propio con mayúscula', () => {
  for (const f of MAYUSCULAS.filter(x => x.tipos.includes('mayuscula-en-generico-geografico'))) {
    assert.match(f.correcto, /\b(río|mar|monte|isla|sierra)( de)? \p{Lu}/u, f.correcto);
  }
});

function comprobarMalas(banco, nombre, { letrasDe = letras, tildes = true } = {}) {
  const vistas = new Set();
  for (const f of banco) {
    assert.ok(NIVELES.includes(f.nivel), `${nombre}: nivel de «${f.bien}»`);
    assert.ok(f.malas.length >= 1 && f.malas.length <= 2, `${nombre}: 1-2 malas: ${f.bien}`);
    assert.ok(!vistas.has(f.bien), `${nombre}: repetida: ${f.bien}`);
    vistas.add(f.bien);
    const textos = new Set([f.bien]);
    for (const [mala, id] of f.malas) {
      assert.notEqual(mala, f.bien, `${nombre}: la mala es la buena: ${f.bien}`);
      assert.ok(!textos.has(mala), `${nombre}: malas repetidas: ${mala}`);
      textos.add(mala);
      assert.equal(letrasDe(mala), letrasDe(f.bien), `${nombre}: la mala cambia letras, no solo signos: «${mala}» frente a «${f.bien}»`);
      assert.match(id, PATRON_ID, `idError de «${mala}»`);
      assert.ok(MOTIVOS[id] && MOTIVOS[id].length > 20, `motivo de ${id}`);
      if (tildes) assert.equal(sinTildes(mala).length > 0, true);
    }
  }
}

test('puntuación: punto y coma, las malas son la buena con cambios de signos, espacios o mayúsculas, y cada una con su motivo', () => {
  comprobarMalas(PUNTO_COMA, 'punto-coma');
  // Con las tildes también: ninguna mala cambia una letra acentuada.
  for (const f of PUNTO_COMA) for (const [mala] of f.malas) assert.equal(mala.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''), f.bien.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''));
});

test('puntuación: dos puntos, las malas son la buena con cambios de signos, espacios o mayúsculas, y cada una con su motivo', () => {
  comprobarMalas(DOS_PUNTOS, 'dos-puntos');
});

test('puntuación: correos, las malas son la buena con abreviaturas, tildes, mayúsculas o signos cambiados', () => {
  comprobarMalas(CORREOS, 'correos', { letrasDe: letrasCorreo });
});

test('puntuación: correos, las abreviaturas del chat solo salen en las malas (nunca en la buena)', () => {
  for (const f of CORREOS) {
    const palabras = f.bien.toLowerCase().split(/[^\p{L}\p{N}]+/u);
    for (const abreviatura of Object.keys(ABREVIATURAS)) assert.ok(!palabras.includes(abreviatura), `${abreviatura} en la buena: ${f.bien}`);
  }
  for (const f of CORREOS) {
    const conAbreviatura = f.malas.filter(([mala]) => mala.toLowerCase().split(/[^\p{L}\p{N}]+/u).some(p => ABREVIATURAS[p]));
    for (const [, id] of conAbreviatura) assert.equal(id, 'abreviatura-de-chat', f.bien);
    for (const [, id] of f.malas.filter(m => !conAbreviatura.includes(m))) assert.notEqual(id, 'abreviatura-de-chat', f.bien);
  }
});

test('puntuación: ninguna mala cambia solo las comillas, ni una coma por un punto y coma en una frase corta, ni un espacio ante % o €', () => {
  const sinComillas = t => t.replace(/[«»“”]/g, '"');
  const sinEspacioMoneda = t => t.replace(/\s+([%€])/g, '$1');
  for (const banco of [PUNTO_COMA, DOS_PUNTOS, CORREOS]) {
    for (const f of banco) {
      for (const [mala] of f.malas) {
        assert.notEqual(sinComillas(mala), sinComillas(f.bien), `solo comillas: ${mala}`);
        assert.notEqual(sinEspacioMoneda(mala), sinEspacioMoneda(f.bien), `solo espacio ante % o €: ${mala}`);
        if (f.bien.length < 40 && !f.bien.includes(';')) assert.ok(!(mala.replace(/;/g, ',') === f.bien), `coma por punto y coma: ${mala}`);
      }
    }
  }
});

test('puntuación: las comillas del bloque son las latinas «», las mismas en la buena y en las malas', () => {
  for (const f of [...PUNTO_COMA, ...DOS_PUNTOS]) {
    for (const t of [f.bien, ...f.malas.map(m => m[0])]) {
      assert.ok(!/[“”"]/.test(t), t);
      assert.equal((t.match(/«/g) ?? []).length, (t.match(/»/g) ?? []).length, t);
    }
  }
});

test('puntuación: los puntos suspensivos son tres puntos, nunca el carácter …, y «etc.» no los lleva en la buena', () => {
  for (const f of DOS_PUNTOS) {
    assert.ok(!f.bien.includes('…'), f.bien);
    assert.ok(!/etc\.\.\./.test(f.bien), f.bien);
    for (const [mala] of f.malas) assert.ok(!mala.includes('…'), mala);
  }
});

test('puntuación: la coma tras el saludo es siempre la mala y la buena lleva dos puntos', () => {
  for (const f of DOS_PUNTOS.filter(x => x.nivel === 1)) {
    const primera = f.bien.split('\n')[0];
    assert.match(primera, /:$/, f.bien);
    assert.ok(f.bien.split('\n').length === 2 && /^[¿¡]?\p{Lu}/u.test(f.bien.split('\n')[1]), `la línea siguiente empieza con mayúscula: ${f.bien}`);
  }
});

test('puntuación: asunto y cuerpo, doce ítems o más, mitad y mitad, y los títulos no llevan verbo conjugado ni punto final', () => {
  assert.ok(ASUNTO_CUERPO.length >= 12);
  const asuntos = ASUNTO_CUERPO.filter(a => a.donde === 'asunto');
  const cuerpos = ASUNTO_CUERPO.filter(a => a.donde === 'cuerpo');
  assert.equal(asuntos.length, cuerpos.length);
  for (const a of ASUNTO_CUERPO) {
    assert.equal(a.nivel, 3);
    assert.ok(['asunto', 'cuerpo'].includes(a.donde));
  }
  for (const a of asuntos) {
    assert.ok(a.texto.split(' ').length <= 6, a.texto);
    assert.ok(!/[.¿?!¡:;]/.test(a.texto), a.texto);
  }
  for (const a of cuerpos) assert.match(a.texto, /[.?!]$/, a.texto);
  assert.equal(new Set(ASUNTO_CUERPO.map(a => a.texto)).size, ASUNTO_CUERPO.length, 'sin repetidos');
});

test('puntuación: los correos del nivel 3 llevan saludo con dos puntos, despedida con coma y la firma en otra línea', () => {
  for (const f of CORREOS.filter(x => x.nivel === 3)) {
    const lineas = f.bien.split('\n');
    assert.equal(lineas.length, 4, f.bien);
    assert.match(lineas[0], /:$/, f.bien);
    assert.match(lineas[2], /,$/, f.bien);
    assert.match(lineas[3], /^\p{Lu}\p{Ll}+$/u, f.bien);
  }
});

test('puntuación: sin repetidos y sin palabras de la lista negra en ningún banco', () => {
  for (const banco of [PUNTO_COMA, DOS_PUNTOS, CORREOS]) {
    for (const f of banco) {
      const todo = [f.bien, ...f.malas.map(m => m[0])].join(' ');
      assert.deepEqual(enLista(todo), [], todo);
      for (const re of SENTIDO) assert.ok(!re.test(todo), `${re}: ${todo}`);
    }
  }
  for (const a of ASUNTO_CUERPO) assert.deepEqual(enLista(a.texto), [], a.texto);
  const bienes = [...PUNTO_COMA, ...DOS_PUNTOS, ...CORREOS].map(f => f.bien);
  assert.equal(new Set(bienes).size, bienes.length);
});

test('puntuación: los nombres propios que salen son los inventados de la lista corta', () => {
  const texto = [
    ...MAYUSCULAS.map(f => f.correcto), ...PUNTO_COMA.map(f => f.bien), ...DOS_PUNTOS.map(f => f.bien), ...CORREOS.map(f => f.bien),
  ].join(' ');
  const nombres = ['Marta', 'Lucía', 'Pablo', 'Marcos', 'Ángela', 'Álvaro', 'Hugo', 'Elena', 'Carmen', 'Ana', 'Coco', 'Juan Luis'];
  for (const n of nombres) assert.ok(NOMBRES_PERMITIDOS.includes(n));
  // Ningún otro nombre de persona conocido del curso: lo vigila además tests/sin-nombres-de-alumnos.test.js.
  assert.ok(texto.includes('Marta'));
});

// --- Niveles, equilibrio y generadores ---------------------------------------------------

test('puntuación: cada ejercicio tiene ≥ 16 ítems por nivel (≥ 12 en mayúsculas y en asunto / cuerpo)', () => {
  for (const n of NIVELES) {
    assert.ok(porNivel(MAYUSCULAS, n).length >= 12, `mayúsculas nivel ${n}: ${porNivel(MAYUSCULAS, n).length}`);
    assert.ok(porNivel(PUNTO_COMA, n).length >= 16, `punto y coma nivel ${n}: ${porNivel(PUNTO_COMA, n).length}`);
    assert.ok(porNivel(DOS_PUNTOS, n).length >= 16, `dos puntos nivel ${n}: ${porNivel(DOS_PUNTOS, n).length}`);
    assert.ok(porNivel(CORREOS, n).length >= 16, `correos nivel ${n}: ${porNivel(CORREOS, n).length}`);
  }
  assert.ok(ASUNTO_CUERPO.length >= 12);
});

/** Una sesión simulada en cada nivel: puntos y vidas que dan ese nivel. */
const SESIONES = { 1: { puntos: 0, vidas: 5 }, 2: { puntos: 4, vidas: 5 }, 3: { puntos: 8, vidas: 5 } };

test('puntuación: las sesiones de prueba dan de verdad los niveles 1, 2 y 3', () => {
  for (const n of NIVELES) assert.equal(nivelDe(SESIONES[n]), n);
});

const EJERCICIOS = [
  { nombre: 'mayúsculas', banco: MAYUSCULAS, generar: generarMayusculas },
  { nombre: 'punto y coma', banco: PUNTO_COMA, generar: generarPuntoComa },
  { nombre: 'dos puntos', banco: DOS_PUNTOS, generar: generarDosPuntos },
  { nombre: 'correo', banco: BANCO_CORREOS, generar: generarCorreos },
];

test('puntuación: el generador nunca da un ítem de un nivel superior al del alumno (3000 ítems por ejercicio y nivel)', () => {
  const rng = crearRng(137);
  for (const { nombre, banco, generar } of EJERCICIOS) {
    for (const n of NIVELES) {
      const vistos = new Set();
      for (let k = 0; k < 3000; k++) {
        const item = generar(rng, SESIONES[n]);
        assert.ok(banco[item.i], `${nombre}: ítem ${item.i}`);
        assert.ok(banco[item.i].nivel <= nivelDe(SESIONES[n]), `${nombre} nivel ${n}: sale uno de nivel ${banco[item.i].nivel}`);
        assert.equal(item.nivel, n, `${nombre}: la etiqueta enseña el nivel del alumno`);
        vistos.add(banco[item.i].nivel);
      }
      assert.ok(vistos.has(n), `${nombre} nivel ${n}: sale algún ítem de su nivel`);
      if (n > 1) assert.ok(vistos.has(n - 1), `${nombre} nivel ${n}: sale también alguno de debajo`);
    }
  }
});

test('puntuación: con `?nivel=N` forzado, el generador sigue sin pasar de ese nivel', () => {
  const rng = crearRng(1370);
  for (const { banco, generar } of EJERCICIOS) {
    for (const n of NIVELES) {
      for (let k = 0; k < 500; k++) assert.ok(banco[generar(rng, SESIONES[1], n).i].nivel <= n);
    }
  }
});

test('puntuación: equilibrio, ningún botón acierta más del 60 % dentro de su nivel', () => {
  const rng = crearRng(1371);
  for (const { nombre, banco, generar } of EJERCICIOS.slice(1)) {
    for (const n of NIVELES) {
      const posiciones = {};
      let total = 0;
      for (let k = 0; k < 3000; k++) {
        const item = generar(rng, SESIONES[n], n);
        const ficha = banco[item.i];
        if (ficha.nivel !== n) continue;
        const clave = esAsuntoCuerpo(ficha) ? `ac-${ficha.donde}` : `pos-${item.opciones.findIndex(o => o.k === 0)}`;
        posiciones[clave] = (posiciones[clave] ?? 0) + 1;
        total++;
      }
      for (const [clave, veces] of Object.entries(posiciones)) {
        assert.ok(veces / total <= 0.6, `${nombre} nivel ${n}: ${clave} ${veces}/${total}`);
      }
      assert.ok(total > 100);
    }
  }
});

test('puntuación: mayúsculas, equilibrio, la primera palabra mal reparte entre posiciones', () => {
  for (const n of NIVELES) {
    const frases = porNivel(MAYUSCULAS, n);
    const primeras = {};
    for (const f of frases) { const p = buenasMayusculas(f)[0]; primeras[p] = (primeras[p] ?? 0) + 1; }
    for (const [p, veces] of Object.entries(primeras)) assert.ok(veces / frases.length <= 0.6, `nivel ${n}: posición ${p} ${veces}/${frases.length}`);
    const enDeMas = frases.filter(f => f.tipos.some(t => t.startsWith('mayuscula-'))).length;
    assert.ok(enDeMas / frases.length <= 0.75, `nivel ${n}: hay frases con solo minúsculas por corregir (${enDeMas}/${frases.length})`);
  }
});

test('puntuación: el ítem que devuelve el generador es pequeño y serializable, y las opciones guardan la posición de cada texto', () => {
  const rng = crearRng(1372);
  for (const { banco, generar } of EJERCICIOS) {
    for (let k = 0; k < 300; k++) {
      const item = JSON.parse(JSON.stringify(generar(rng, SESIONES[3])));
      assert.ok(JSON.stringify(item).length < 1500);
      const ficha = banco[item.i];
      if (!item.opciones) continue;
      if (esAsuntoCuerpo(ficha)) { assert.deepEqual(item.opciones.map(o => o.k), ['asunto', 'cuerpo']); continue; }
      const textos = [ficha.bien, ...ficha.malas.map(m => m[0])];
      assert.equal(item.opciones.length, textos.length);
      for (const { k: pos, texto } of item.opciones) assert.equal(textos[pos], texto);
    }
  }
});

// --- Explicaciones e idError ------------------------------------------------------------

test('puntuación: mayúsculas, la explicación dice la frase buena con lo cambiado en <b> y el porqué de cada palabra', () => {
  for (const f of MAYUSCULAS) {
    const buenas = buenasMayusculas(f);
    const e = explicacionMayusculas(f, buenas);
    assert.equal((e.match(/<b>/g) ?? []).length, buenas.length, f.texto);
    for (const t of new Set(f.tipos)) assert.match(f.tipos.length ? e : '', /«/, t);
    assert.ok(e.length > 40);
    assert.equal(idErrorMayusculas(f, []), f.tipos[0]);
    assert.equal(idErrorMayusculas(f, [...buenas, f.texto.split(' ').findIndex((_, i) => !buenas.includes(i))]), 'tocadas-de-mas');
    for (const t of f.tipos) assert.match(t, PATRON_ID);
  }
});

test('puntuación: mayúsculas, si el alumno toca una que estaba bien, la explicación lo dice con esa palabra', () => {
  const f = MAYUSCULAS[0]; // mañana viene marta a mi casa.
  const buenas = buenasMayusculas(f);
  const otra = f.texto.split(' ').findIndex((_, i) => !buenas.includes(i));
  const e = explicacionMayusculas(f, [...buenas, otra]);
  assert.match(e, /Has tocado «viene»/);
  assert.equal(idErrorMayusculas(f, [...buenas, otra]), 'tocadas-de-mas');
  assert.equal(idErrorMayusculas(f, [buenas[1]]), f.tipos[0], 'le falta la primera: sale su tipo');
});

test('puntuación: «¿cuál está bien escrita?», la explicación enseña la buena en <b> y el motivo de la mala elegida', () => {
  for (const banco of [PUNTO_COMA, DOS_PUNTOS, CORREOS]) {
    for (const f of banco) {
      const acierto = explicacionElegir(f, 0);
      assert.match(acierto, /<b>/);
      assert.equal(idErrorElegir(f, 0), null);
      f.malas.forEach(([mala, id], j) => {
        const e = explicacionElegir(f, j + 1);
        assert.ok(e.includes(MOTIVOS[id]), `${id}: ${f.bien}`);
        assert.match(e, /<b>/);
        assert.equal(idErrorElegir(f, j + 1), id);
        assert.ok(mala.length > 0);
      });
    }
  }
});

test('puntuación: asunto y cuerpo, la explicación y el idError dependen de dónde iba', () => {
  for (const a of ASUNTO_CUERPO) {
    const e = explicacionElegir(a, a.donde);
    assert.ok(e.includes(`<b>${a.donde}</b>`), a.texto);
    assert.equal(idErrorElegir(a, a.donde === 'asunto' ? 'cuerpo' : 'asunto'), a.donde === 'asunto' ? 'cuerpo-por-asunto' : 'asunto-por-cuerpo');
  }
});

test('puntuación: los idError de todo el bloque cumplen el patrón y se reparten en varias confusiones', () => {
  const ids = new Set();
  for (const f of MAYUSCULAS) f.tipos.forEach(t => ids.add(t));
  for (const banco of [PUNTO_COMA, DOS_PUNTOS, CORREOS]) for (const f of banco) f.malas.forEach(m => ids.add(m[1]));
  ids.add('cuerpo-por-asunto').add('asunto-por-cuerpo').add('tocadas-de-mas');
  for (const id of ids) assert.match(id, PATRON_ID, id);
  assert.ok(ids.size >= 30, `${ids.size} confusiones distintas`);
  for (const id of Object.keys(MOTIVOS)) assert.match(id, PATRON_ID, id);
});

// --- Textos y catálogo --------------------------------------------------------------------

test('puntuación: los cuatro ejercicios tienen nombre y detalle en español y en inglés (el inglés, «Spanish spelling: …»)', () => {
  for (const clave of ['mayusculas', 'puntoComa', 'dosPuntos', 'correos']) {
    const t = TX[clave];
    for (const campo of ['nombre', 'detalle']) {
      assert.ok(t[campo].es.length > 3, `${clave}.${campo}.es`);
      assert.match(t[campo].en, /^Spanish spelling: /, `${clave}.${campo}.en`);
    }
    assert.ok(t.introduccion.es.includes('<p>') && t.introduccion.en.includes('<p>'), clave);
    assert.ok(t.instruccion.length > 5);
  }
});

test('puntuación: el catálogo declara 4 ejercicios y la práctica pone sus cuatro en orden, sin esqueletos', () => {
  const fila = CATALOGO.find(p => p.slug === 'ortografia-puntuacion');
  assert.equal(fila.id, 66);
  assert.equal(fila.nEjercicios, 4);
  const codigo = readFileSync(new URL('../practicas/ortografia-puntuacion/practica.js', import.meta.url), 'utf8');
  assert.ok(!/enConstruccion/.test(codigo), 'ya no queda ningún esqueleto');
  assert.equal((codigo.match(/nombre: TX\./g) ?? []).length, 4);
  assert.match(codigo, /idioma: 'es'/);
  for (const orden of [['mayusculas', 'puntoComa'], ['puntoComa', 'dosPuntos'], ['dosPuntos', 'correos']]) {
    assert.ok(codigo.indexOf(`TX.${orden[0]}.nombre`) < codigo.indexOf(`TX.${orden[1]}.nombre`), orden.join(' < '));
  }
});

test('puntuación: la etiqueta de nivel sale para los tres niveles', () => {
  for (const n of NIVELES) assert.match(etiquetaNivel(n), new RegExp(`Nivel ${n}`));
});
