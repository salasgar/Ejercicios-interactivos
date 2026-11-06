// Ortografía: ampliación (practicas/ortografia-ampliacion, tarea 139). Lo que se puede comprobar
// sin el navegador: la forma de los cuatro bancos, los niveles, el equilibrio de los botones, que
// el generador nunca sube de nivel, la lista negra, las reglas de forma del ejercicio 1 (qué va
// delante y detrás del hueco), que ERRORES está completo, que cada mala de los ejercicios 3 y 4 es
// la buena con el cambio de su error, y que ninguna frase repite las de la 45, la 137 o la 138.
// El significado de cada frase se revisa a mano (cotejo con el DPD: cabecera de logica.js).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { nivelDe } from '../practicas/_comun/nivel.js';
import { PAREJAS } from '../practicas/ortografia/logica.js';
import { SIGNOS } from '../practicas/ortografia/signos.js';
import {
  LISTA_NEGRA, FUERA, partes, rellenar, anterior,
  FORMAS, ID_FORMA, DETERMINANTES, MARCAS_INDIRECTA, RIGEN_POR, RIGEN_CON_INDICATIVO, SUBJUNTIVOS,
  PORQUES, generarPorques, explicacionPorque, idErrorPorque,
  ERRORES, VERBOS, generarVerbos, opcionesVerbo, explicacionVerbo, idErrorVerbo,
  MOTIVOS, SIGLAS, AVANZADA, generarSiglas, generarAvanzada, explicacionElegir, idErrorElegir,
} from '../practicas/ortografia-ampliacion/logica.js';

// Los bloques hermanos: si alguno no carga, no se compara con él.
const puntuacion = await import('../practicas/ortografia-puntuacion/logica.js').catch(() => ({}));
const palabrasBloque = await import('../practicas/ortografia-palabras/logica.js').catch(() => ({}));

const PATRON_ERROR = /^[a-z0-9-]{1,40}$/;
const palabras = texto => texto.replace('_', 'X').trim().split(/\s+/).length;
/** Solo las letras, sin tildes y en minúsculas: «—Ya voy —dijo» → «yavoydijo». */
const letras = texto => String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-zñ0-9]/g, '');
const esPareja = (a, b) => LISTA_NEGRA.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const ELEGIR = [['siglas', SIGLAS, generarSiglas], ['puntuación avanzada', AVANZADA, generarAvanzada]];
const opcionesElegir = it => [it.bien, ...it.malas.map(m => m[0])];

test('ortografia-ampliacion: ejercicios 1 y 2, cada ítem con nivel 1-3, un hueco no inicial y frases cortas', () => {
  for (const [nombre, banco] of [['porques', PORQUES], ['verbos', VERBOS]]) {
    for (const it of banco) {
      assert.ok([1, 2, 3].includes(it.nivel), `${nombre}: ${it.frase}`);
      assert.equal(it.frase.split('_').length, 2, `${nombre}: un solo hueco en «${it.frase}»`);
      assert.ok(!/^[¿¡]?_/.test(it.frase), `${nombre}: el hueco no va al principio en «${it.frase}»`);
      assert.ok(palabras(it.frase) <= 14, `${nombre}: más de 14 palabras en «${it.frase}»`);
    }
  }
  for (const it of PORQUES) assert.ok(FORMAS.includes(it.buena), it.frase);
  const frases = [...PORQUES, ...VERBOS].map(it => it.frase);
  assert.equal(new Set(frases).size, frases.length, 'frase repetida');
});

test('ortografia-ampliacion: ejercicios 3 y 4, la buena y una o dos malas distintas, con su motivo', () => {
  for (const [nombre, banco] of ELEGIR) {
    for (const it of banco) {
      assert.ok([1, 2, 3].includes(it.nivel), `${nombre}: ${it.bien}`);
      assert.ok(it.malas.length >= 1 && it.malas.length <= 2, `${nombre}: ${it.bien}`);
      const ops = opcionesElegir(it);
      assert.equal(new Set(ops).size, ops.length, `${nombre}: opciones repetidas en «${it.bien}»`);
      for (const [, id] of it.malas) assert.ok(MOTIVOS[id], `${nombre}: «${id}» sin motivo`);
      for (const o of ops) assert.ok(palabras(o) <= 14, `${nombre}: más de 14 palabras en «${o}»`);
      // Los diálogos, cortos: a 375 px tienen que caber las tres versiones sin partirse mucho.
      if (it.bien.startsWith('—')) assert.ok(palabras(it.bien) <= 10, `diálogo largo: «${it.bien}»`);
    }
    const buenas = banco.map(it => it.bien);
    assert.equal(new Set(buenas).size, buenas.length, `${nombre}: buena repetida`);
  }
  // Cada motivo se usa.
  const usados = new Set([...SIGLAS, ...AVANZADA].flatMap(it => it.malas.map(m => m[1])));
  for (const id of Object.keys(MOTIVOS)) assert.ok(usados.has(id), `motivo «${id}» sin ítems`);
});

test('ortografia-ampliacion: al menos 16 ítems por nivel y ejercicio (12 en el de los cuatro porque)', () => {
  for (const [nombre, banco, minimo] of [['porques', PORQUES, 12], ['verbos', VERBOS, 16], ['siglas', SIGLAS, 16], ['avanzada', AVANZADA, 16]]) {
    for (const n of [1, 2, 3]) {
      const del = banco.filter(it => it.nivel === n).length;
      assert.ok(del >= minimo, `${nombre}, nivel ${n}: ${del} ítems`);
    }
  }
});

test('ortografia-ampliacion: equilibrio, en el ejercicio 1 cada forma entre el 15 % y el 60 % de su nivel; en los otros, la buena no tiene sitio fijo', () => {
  for (const n of [1, 2, 3]) {
    const del = PORQUES.filter(it => it.nivel === n);
    for (const f of FORMAS) {
      const parte = del.filter(it => it.buena === f).length / del.length;
      assert.ok(parte >= 0.15 && parte <= 0.6, `porques, nivel ${n}: «${f}» acierta en ${(parte * 100).toFixed(0)} %`);
    }
  }
  const rng = crearRng(139);
  let primera = 0;
  for (let k = 0; k < 3000; k++) if (generarVerbos(rng, { puntos: 9, vidas: 5 }).orden === 0) primera++;
  assert.ok(primera / 3000 > 0.4 && primera / 3000 < 0.6, `verbos: la buena primera ${primera} de 3000`);
  for (const [nombre, , generar] of ELEGIR) {
    const sitios = [0, 0, 0];
    for (let k = 0; k < 3000; k++) sitios[generar(rng, { puntos: 9, vidas: 5 }).opciones.findIndex(o => o.k === 0)]++;
    for (const s of sitios.slice(0, 2)) assert.ok(s / 3000 > 0.25 && s / 3000 < 0.6, `${nombre}: la buena en cada sitio ${sitios.join(' / ')}`);
  }
});

test('ortografia-ampliacion: el generador nunca da un ítem de nivel superior al del alumno (3000 por nivel y ejercicio)', () => {
  const sesiones = [{ puntos: 0, vidas: 5 }, { puntos: 4, vidas: 5 }, { puntos: 8, vidas: 5 }, { puntos: 8, vidas: 3 }, { puntos: 8, vidas: 1 }];
  for (const [nombre, banco, generar] of [['porques', PORQUES, generarPorques], ['verbos', VERBOS, generarVerbos], ...ELEGIR]) {
    for (const sesion of sesiones) {
      const rng = crearRng(2000 + sesion.puntos * 10 + sesion.vidas);
      const tope = nivelDe(sesion);
      const vistos = new Set();
      for (let k = 0; k < 3000; k++) {
        const item = generar(rng, sesion, null);
        assert.equal(item.nivel, tope, `${nombre}: la etiqueta dice el nivel del alumno`);
        const it = banco[item.i];
        assert.ok(it, `${nombre}: índice ${item.i}`);
        assert.ok(it.nivel <= tope, `${nombre}: ítem de nivel ${it.nivel} con el alumno en el ${tope}`);
        assert.doesNotThrow(() => JSON.stringify(item));
        vistos.add(it.nivel);
      }
      assert.ok(vistos.has(tope), `${nombre}: en el nivel ${tope} salen ítems de ese nivel`);
    }
    // `forzado` (el ?nivel= de «Probar sin código») manda.
    const rng = crearRng(7);
    for (let k = 0; k < 500; k++) assert.equal(banco[generar(rng, { puntos: 9, vidas: 5 }, 1).i].nivel, 1);
  }
});

test('ortografia-ampliacion: lista negra, ninguna opción con una forma dudosa ni dos formas que la RAE admite', () => {
  const textos = [
    ...PORQUES.map(it => it.frase), ...VERBOS.flatMap(it => [rellenar(it.frase, it.buena), rellenar(it.frase, it.mala)]),
    ...[...SIGLAS, ...AVANZADA].flatMap(opcionesElegir),
  ];
  for (const t of textos) {
    const suyas = t.split(/[\s.,;:¿?¡!«»()—-]+/);
    for (const f of FUERA) assert.ok(!suyas.includes(f), `«${f}» no puede salir: «${t}»`);
  }
  // En el ejercicio 2, la buena y la mala no son una pareja de la lista; en el 3 y el 4, tampoco las palabras que cambian.
  for (const it of VERBOS) assert.ok(!esPareja(it.buena, it.mala), `${it.buena} / ${it.mala}`);
  for (const it of [...SIGLAS, ...AVANZADA]) {
    const buenas = it.bien.split(/\s+/);
    for (const [mala] of it.malas) {
      const suyas = mala.split(/\s+/);
      for (const p of suyas.filter(p => !buenas.includes(p))) for (const b of buenas.filter(b => !suyas.includes(b))) assert.ok(!esPareja(p, b), `${b} / ${p}`);
    }
  }
  // «porque» y «por que» valen las dos con sentido final: el ejercicio 1 solo pone «por que» tras verbos de elegir.
  for (const verbo of ['preocupa', 'esfuerza', 'lucha', 'vota', 'votó', 'ruego', 'abogan']) assert.ok(!RIGEN_POR[verbo], verbo);
});

test('ortografia-ampliacion: ejercicio 1, las reglas de forma de cada una de las cuatro', () => {
  const frasesSin = new Set();
  for (const it of PORQUES) {
    const { antes, despues } = partes(it.frase);
    const previa = anterior(it.frase);
    const ultimas = antes.toLowerCase().replace(/[¿¡,;:]/g, ' ').trim().split(/\s+/).slice(-3);
    const indirecta = ultimas.some(p => MARCAS_INDIRECTA.includes(p));
    if (it.buena === 'por qué') {
      assert.ok(antes.includes('¿') || indirecta, `«por qué» sin pregunta directa ni indirecta: «${it.frase}»`);
      assert.ok(!DETERMINANTES.includes(previa), it.frase);
    }
    if (it.buena === 'porqué') {
      assert.ok(DETERMINANTES.includes(previa), `«porqué» sin determinante delante: «${it.frase}»`);
      assert.ok(!despues.includes('?'), `«porqué» dentro de una pregunta: «${it.frase}»`);
    }
    if (it.buena === 'por que') {
      assert.ok(RIGEN_POR[previa], `«por que» sin un verbo que rija «por» delante: «${it.frase}»`);
      if (!RIGEN_CON_INDICATIVO.includes(previa)) {
        const siguientes = despues.toLowerCase().replace(/[.,;]/g, '').trim().split(/\s+/).slice(0, 4);
        assert.ok(siguientes.some(p => SUBJUNTIVOS.includes(p)), `«por que» sin subjuntivo detrás: «${it.frase}»`);
      }
    }
    if (it.buena === 'porque') {
      assert.ok(!/¿\s*$/.test(antes), `«porque» justo tras ¿: «${it.frase}»`);
      assert.ok(!DETERMINANTES.includes(previa) && !RIGEN_POR[previa], it.frase);
      // Tras un verbo de preguntar o saber, solo si su complemento ya está («Me lo preguntó porque…»).
      if (indirecta) assert.match(antes, /\blo\b/i, `«porque» tras «${ultimas.join(' ')}» sin complemento: «${it.frase}»`);
    }
    frasesSin.add(it.frase);
  }
  // Ninguna frase de la pareja porque / por qué de la 45 (ni con el hueco relleno).
  for (const [f, buena] of PAREJAS.porque.frases) {
    assert.ok(!frasesSin.has(f), `frase de la 45: «${f}»`);
    assert.ok(!PORQUES.some(it => rellenar(it.frase, it.buena) === rellenar(f, buena)), f);
  }
});

test('ortografia-ampliacion: ejercicio 2, ERRORES completo y cada ítem con su buena y su mala', () => {
  for (const [id, e] of Object.entries(ERRORES)) {
    assert.ok(e.buena && e.mala && e.buena !== e.mala, id);
    assert.ok(e.regla.length > 20, `regla corta en ${id}`);
    assert.ok(VERBOS.some(it => it.error === id), `${id} sin ítems`);
  }
  for (const it of VERBOS) {
    assert.ok(ERRORES[it.error], it.frase);
    assert.equal(it.buena, ERRORES[it.error].buena);
    assert.equal(it.mala, ERRORES[it.error].mala);
  }
  // Las de «-stes» llevan siempre «tú» (con «vos» es otra conjugación: DPD «voseo»).
  for (const it of VERBOS.filter(i => i.mala.endsWith('stes'))) assert.match(it.frase, /(^|[\s¿¡])[Tt]ú\s/, it.frase);
  // Las impersonales de haber, solo en el nivel 3 (es gramática, y la ficha la pone como ampliación).
  for (const it of VERBOS.filter(i => /hab/.test(i.buena) && i.error !== 'haya')) assert.equal(it.nivel, 3, it.frase);
  const rng = crearRng(3);
  for (let k = 0; k < 200; k++) {
    const item = generarVerbos(rng, { puntos: 9, vidas: 5 });
    assert.deepEqual([...opcionesVerbo(VERBOS[item.i], item.orden)].sort(), [VERBOS[item.i].buena, VERBOS[item.i].mala].sort());
  }
});

test('ortografia-ampliacion: ejercicios 3 y 4, cada mala es la buena con el cambio de su error', () => {
  const sinUna = (texto, letra) => [...texto].map((c, i) => (c === letra ? texto.slice(0, i) + texto.slice(i + 1) : null)).filter(Boolean);
  for (const it of [...SIGLAS, ...AVANZADA]) {
    for (const [mala, id] of it.malas) {
      const b = letras(it.bien), m = letras(mala);
      // Separado, el prefijo deja la palabra con su r de siempre («auto retrato»): también vale una r menos.
      if (id === 'r-simple-tras-prefijo' || (id === 'prefijo-separado' && /rr/.test(it.bien) && m !== b)) assert.ok(sinUna(b, 'r').includes(m), `«${mala}» no es «${it.bien}» con una r menos`);
      else if (id === 'plural-en-sigla') assert.ok(sinUna(m, 's').includes(b), `«${mala}» no es «${it.bien}» con una s de más`);
      else if (id === 'plural-mal') {
        const pb = it.bien.split(' '), pm = mala.split(' ');
        assert.equal(pb.length, pm.length, mala);
        assert.equal(pb.filter((p, i) => p !== pm[i]).length, 1, `«${mala}»: una sola palabra distinta`);
      } else assert.equal(m, b, `«${mala}» cambia letras de «${it.bien}» (${id})`);
    }
  }
  // Nada de lo que la lista de la ficha deja fuera: comillas inglesas, coma por punto y coma en frase corta.
  for (const it of AVANZADA) for (const o of opcionesElegir(it)) assert.ok(!/["“”]/.test(o), o);
  for (const it of AVANZADA) for (const [, id] of it.malas) if (id === 'coma-por-punto-y-coma') assert.ok((it.bien.match(/;/g) ?? []).length >= 1 && (it.bien.match(/,/g) ?? []).length >= 1, it.bien);
});

test('ortografia-ampliacion: explicaciones con la buena en <b> y idError con el patrón', () => {
  for (const it of PORQUES) {
    const html = explicacionPorque(it);
    assert.ok(html.includes(`<b>${it.buena}</b>`), html);
    assert.ok(!html.includes('undefined'), html);
    for (const puso of FORMAS.filter(f => f !== it.buena)) assert.match(idErrorPorque(it, puso), PATRON_ERROR);
  }
  assert.equal(new Set(Object.values(ID_FORMA)).size, 4, 'los cuatro identificadores distintos');
  assert.equal(idErrorPorque(PORQUES.find(it => it.buena === 'por qué'), 'porque'), 'porque-por-por-que');
  for (const it of VERBOS) {
    assert.ok(explicacionVerbo(it).startsWith(`<b>${it.buena}</b>`), it.frase);
    assert.match(idErrorVerbo(it), PATRON_ERROR);
  }
  assert.equal(idErrorVerbo(VERBOS.find(it => it.error === 'dijiste')), 'dijistes-por-dijiste');
  assert.equal(idErrorVerbo(VERBOS.find(it => it.error === 'ha-habido')), 'han-habido-por-ha-habido');
  for (const it of [...SIGLAS, ...AVANZADA]) {
    assert.ok(explicacionElegir(it, 0).includes('<b>'), it.bien);
    it.malas.forEach(([, id], j) => {
      assert.match(idErrorElegir(it, j + 1), PATRON_ERROR);
      assert.equal(idErrorElegir(it, j + 1), id);
    });
    assert.equal(idErrorElegir(it, 0), null);
  }
});

test('ortografia-ampliacion: ninguna frase repite las de la 45, la 137 (puntuación) ni la 138 (palabras)', () => {
  const ajenas = new Set(SIGNOS.map(s => s.bien));
  for (const banco of ['PUNTO_COMA', 'DOS_PUNTOS', 'BANCO_CORREOS']) for (const it of puntuacion[banco] ?? []) if (it.bien) ajenas.add(it.bien);
  for (const banco of ['JUNTAS', 'HOMOFONOS', 'NUMEROS_Y_SIMBOLOS']) for (const it of palabrasBloque[banco] ?? []) ajenas.add(rellenar(it.frase, it.buena));
  for (const it of [...SIGLAS, ...AVANZADA]) assert.ok(!ajenas.has(it.bien), `frase repetida: «${it.bien}»`);
  for (const it of [...PORQUES, ...VERBOS]) assert.ok(!ajenas.has(rellenar(it.frase, it.buena)), `frase repetida: «${it.frase}»`);
  // Y que se ha comparado con algo (si la 137 deja de exportar sus bancos, este test no sirve).
  assert.ok(ajenas.size > 100, `solo ${ajenas.size} frases ajenas`);
});
