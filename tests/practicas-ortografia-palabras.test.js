// Ortografía: palabras que se confunden (practicas/ortografia-palabras, tarea 138). Lo que se
// puede comprobar sin el navegador: la forma de los tres bancos, los niveles, el equilibrio de
// los botones, que el generador nunca sube de nivel, la lista negra, que cada mala del
// ejercicio 3 sale de su buena con el cambio de su error, y que ninguna frase repite las de la
// 45 ni las de ortografia-letras (136). El significado de cada frase se revisa a mano: lo que
// la RAE admite de dos maneras está en LISTA_NEGRA (docs/practicas-ortografia.md, §6).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { nivelDe } from '../practicas/_comun/nivel.js';
import { PAREJAS } from '../practicas/ortografia/logica.js';
import {
  LISTA_NEGRA, INEXISTENTES, plano, partes, rellenar, idConfusion,
  JUNTAS, generarJuntas, explicacionJuntas, idErrorJuntas,
  SIGNIFICADOS, PARES, HOMOFONOS, opcionesHomofono, generarHomofonos, explicacionHomofono, idErrorHomofono,
  ERRORES, NUMEROS, SIMBOLOS, NUMEROS_Y_SIMBOLOS, generarNumeros, opcionesNumero, explicacionNumero, idErrorNumero,
} from '../practicas/ortografia-palabras/logica.js';

// La 136 se escribe en paralelo: si su fichero aún no carga o no exporta los bancos, no se compara con ella.
const letras = await import('../practicas/ortografia-letras/logica.js').catch(() => ({}));

const PATRON_ERROR = /^[a-z0-9-]{1,40}$/;
const NEGRAS = new Set(LISTA_NEGRA.flat().map(f => f.toLowerCase()));
const esPareja = (a, b) => LISTA_NEGRA.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const palabras = frase => frase.replace('_', 'X').split(/\s+/).length;

// Los tres ejercicios con lo que necesita cada comprobación.
const EJERCICIOS = [
  {
    nombre: 'junto o separado', banco: JUNTAS, generar: generarJuntas,
    opciones: it => it.opciones, explicacion: explicacionJuntas, idError: idErrorJuntas,
    // Lo que se mide en el equilibrio: si la buena va junta o separada (los botones van siempre así).
    boton: (it) => (it.buena.includes(' ') ? 'separado' : 'junto'),
  },
  {
    nombre: 'homófonos', banco: HOMOFONOS, generar: generarHomofonos,
    opciones: opcionesHomofono, explicacion: explicacionHomofono, idError: idErrorHomofono,
    boton: it => String(opcionesHomofono(it).indexOf(it.buena)),
  },
  {
    nombre: 'números y símbolos', banco: NUMEROS_Y_SIMBOLOS, generar: generarNumeros,
    opciones: it => [it.buena, it.mala], explicacion: explicacionNumero, idError: () => 'x',
    boton: null, // las dos opciones se barajan en cada ítem: se mide el orden que sale
  },
];

test('ortografia-palabras: cada ítem tiene nivel 1-3, una frase con un hueco no inicial y la buena entre sus opciones', () => {
  for (const ej of EJERCICIOS) {
    for (const it of ej.banco) {
      assert.ok([1, 2, 3].includes(it.nivel), `${ej.nombre}: ${it.frase}`);
      assert.equal(it.frase.split('_').length, 2, `${ej.nombre}: un solo hueco en «${it.frase}»`);
      assert.ok(!/^[¿¡]?_/.test(it.frase), `${ej.nombre}: el hueco no va al principio en «${it.frase}»`);
      const ops = ej.opciones(it);
      assert.ok(ops.length >= 2 && ops.length <= 3, it.frase);
      assert.equal(new Set(ops).size, ops.length, `opciones repetidas en «${it.frase}»`);
      assert.equal(ops.filter(o => o === it.buena).length, 1, `la buena, una vez, en «${it.frase}»`);
      assert.ok(palabras(it.frase) <= 14, `frase de más de 14 palabras: «${it.frase}»`);
    }
  }
});

test('ortografia-palabras: al menos 16 ítems por nivel y ejercicio (12 con tres opciones), y ninguna frase repetida', () => {
  for (const ej of EJERCICIOS) {
    for (const n of [1, 2, 3]) {
      const del = ej.banco.filter(it => it.nivel === n);
      const tresOpciones = del.every(it => ej.opciones(it).length >= 3);
      assert.ok(del.length >= (tresOpciones ? 12 : 16), `${ej.nombre}, nivel ${n}: ${del.length} ítems`);
    }
  }
  const frases = [...JUNTAS, ...HOMOFONOS, ...NUMEROS_Y_SIMBOLOS].map(it => it.frase);
  assert.equal(new Set(frases).size, frases.length, 'frase repetida');
});

test('ortografia-palabras: equilibrio, ningún botón acierta más del 60 % dentro de su nivel', () => {
  for (const ej of EJERCICIOS.filter(e => e.boton)) {
    for (const n of [1, 2, 3]) {
      const del = ej.banco.filter(it => it.nivel === n);
      const cuenta = {};
      for (const it of del) cuenta[ej.boton(it)] = (cuenta[ej.boton(it)] ?? 0) + 1;
      for (const [b, c] of Object.entries(cuenta)) assert.ok(c / del.length <= 0.6, `${ej.nombre}, nivel ${n}: «${b}» acierta ${c} de ${del.length}`);
    }
  }
  // Ejercicio 3: la buena sale primera más o menos la mitad de las veces.
  const rng = crearRng(138);
  let primera = 0;
  for (let k = 0; k < 3000; k++) if (generarNumeros(rng, { puntos: 9, vidas: 5 }).orden === 0) primera++;
  assert.ok(primera / 3000 > 0.4 && primera / 3000 < 0.6, `ejercicio 3: la buena primera ${primera} de 3000`);
});

test('ortografia-palabras: el generador nunca da un ítem de nivel superior al del alumno (3000 por nivel y ejercicio)', () => {
  const sesiones = [{ puntos: 0, vidas: 5 }, { puntos: 4, vidas: 5 }, { puntos: 8, vidas: 5 }, { puntos: 8, vidas: 3 }, { puntos: 8, vidas: 1 }];
  for (const ej of EJERCICIOS) {
    for (const sesion of sesiones) {
      const rng = crearRng(1000 + sesion.puntos * 10 + sesion.vidas);
      const tope = nivelDe(sesion);
      const vistos = new Set();
      for (let k = 0; k < 3000; k++) {
        const item = ej.generar(rng, sesion);
        assert.equal(item.nivel, tope, `${ej.nombre}: la etiqueta dice el nivel del alumno`);
        const it = ej.banco[item.i];
        assert.ok(it, `${ej.nombre}: índice ${item.i}`);
        assert.ok(it.nivel <= tope, `${ej.nombre}: ítem de nivel ${it.nivel} con el alumno en el ${tope}`);
        assert.doesNotThrow(() => JSON.stringify(item));
        vistos.add(it.nivel);
      }
      assert.ok(vistos.has(tope), `${ej.nombre}: en el nivel ${tope} salen ítems de ese nivel`);
    }
    // `forzado` (el ?nivel= de «Probar sin código») manda.
    const rng = crearRng(7);
    for (let k = 0; k < 500; k++) assert.ok(ej.banco[ej.generar(rng, { puntos: 9, vidas: 5 }, { forzado: 1 }).i].nivel === 1);
  }
});

test('ortografia-palabras: lista negra, ninguna mala es una forma que la RAE admite ni enfrenta a dos formas válidas', () => {
  for (const ej of EJERCICIOS) {
    for (const it of ej.banco) {
      const ops = ej.opciones(it);
      for (const mala of ops.filter(o => o !== it.buena)) {
        assert.ok(!NEGRAS.has(mala.toLowerCase()), `${ej.nombre}: la mala «${mala}» está en la lista negra («${it.frase}»)`);
        assert.ok(!esPareja(mala, it.buena), `${ej.nombre}: «${it.buena}» / «${mala}» valen las dos`);
      }
    }
  }
  // Los descartes del cotejo, por si alguien los vuelve a meter.
  const todas = [...JUNTAS.flatMap(it => it.opciones), ...HOMOFONOS.flatMap(opcionesHomofono), ...NUMEROS_Y_SIMBOLOS.flatMap(it => [it.buena, it.mala])];
  for (const fuera of ['al rededor', 'enmedio', 'asimismo', 'a sí mismo', 'enseguida', 'porqué', 'por que', 'ojear', 'hojear', 'casa', 'caza', 'decimoprimero', 'undécimo', 'treintaiuno'])
    assert.ok(!todas.includes(fuera), `«${fuera}» no puede ser opción`);
  // Nada del 31 al 99 en letras, ni separador de millares (salvo el año mal escrito), ni apócope en femenino.
  for (const t of todas) assert.ok(!/(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)( y |i)/.test(t), t);
  for (const it of NUMEROS_Y_SIMBOLOS) {
    assert.ok(!/\d\.\d{3}/.test(it.buena), `la buena «${it.buena}» lleva separador de millares`);
    if (/\d\.\d{3}/.test(it.mala)) assert.equal(it.error, 'punto-en-ano', it.frase);
  }
  for (const it of NUMEROS.filter(i => i.error === 'sin-apocope')) assert.ok(!/ (alumnas|vez|niñas|personas)\b/.test(partes(it.frase).despues), it.frase);
});

test('ortografia-palabras: ejercicio 1, cada par es la misma palabra quitando espacios y tildes, y las «siempre así» declaran su mala', () => {
  // «también» / «tan bien»: al juntarse, la n pasa a m delante de b y p (tampoco).
  const comoJunta = texto => plano(texto).replace(/n(?=[bp])/g, 'm');
  for (const it of JUNTAS) {
    const planos = new Set(it.opciones.map(comoJunta));
    assert.equal(planos.size, 1, `«${it.opciones.join(' / ')}» no son la misma palabra junta y separada`);
    // Botones siempre en el mismo orden: primero la forma junta («apesar de» antes que «a pesar de»).
    const espacios = o => o.split(' ').length;
    assert.ok(it.opciones.slice(1).every(o => espacios(o) > espacios(it.opciones[0])), `el primer botón va junto: ${it.opciones.join(' / ')}`);
    assert.match(it.motivo, new RegExp(`<b>[^<]*${it.buena.split(' ')[0]}`), `el motivo nombra la buena: ${it.frase}`);
  }
  for (const [mala, buena] of Object.entries(INEXISTENTES)) {
    assert.equal(plano(mala), plano(buena), mala);
    const items = JUNTAS.filter(it => it.buena === buena);
    assert.ok(items.length && items.every(it => it.opciones.includes(mala)), `«${mala}» sale como mala de «${buena}»`);
    assert.ok(!/no existe/.test(items[0].motivo), 'la explicación no dice «no existe» (aveces, osea y asique son formas raras de un verbo)');
  }
  // Nada de las parejas que tienen sus propias prácticas.
  for (const it of JUNTAS) for (const o of it.opciones) assert.ok(!['porque', 'por qué', 'a ver', 'haber', 'hay', 'ahí'].includes(o), o);
});

test('ortografia-palabras: ejercicio 2, cada par existe con significados distintos y cada palabra tiene su frase', () => {
  const SESEO = ['casa', 'caza', 'cocer', 'coser', 'abrazar', 'abrasar', 'cima', 'sima', 'ciervo', 'siervo', 'cerrar', 'serrar', 'cien', 'sien', 'cegar', 'segar', 'cauce', 'cause'];
  for (const [clave, ops] of Object.entries(PARES)) {
    for (const p of ops) {
      assert.equal(typeof SIGNIFICADOS[p], 'string', `significado de «${p}»`);
      assert.ok(!SESEO.includes(p), `«${p}» solo es homófono con seseo`);
    }
    assert.equal(new Set(ops.map(p => SIGNIFICADOS[p])).size, ops.length, `significados distintos en ${clave}`);
    const items = HOMOFONOS.filter(it => it.par === clave);
    for (const p of ops) assert.ok(items.some(it => it.buena === p), `«${p}» (${clave}) tiene alguna frase donde es la buena`);
  }
  for (const it of HOMOFONOS) assert.ok(PARES[it.par], it.par);
});

test('ortografia-palabras: ejercicio 3, cada mala es su buena con el cambio de su error', () => {
  for (const it of NUMEROS_Y_SIMBOLOS) {
    const e = ERRORES[it.error];
    assert.ok(e, `error «${it.error}» sin declarar`);
    assert.ok(e.comprueba(it.buena, it.mala), `«${it.mala}» no es «${it.buena}» con el error ${it.error}`);
    for (const [otro, o] of Object.entries(ERRORES)) if (otro !== it.error) assert.ok(!o.comprueba(it.buena, it.mala), `«${it.mala}» encaja también en ${otro}`);
    assert.equal(idErrorNumero(it), it.error);
  }
  assert.ok(NUMEROS.every(it => it.nivel <= 2) && SIMBOLOS.every(it => it.nivel === 3), 'NUMEROS en los niveles 1-2 y SIMBOLOS en el 3');
  for (const id of Object.keys(ERRORES)) assert.ok(NUMEROS_Y_SIMBOLOS.some(it => it.error === id), `${id} sin ítems`);
  const rng = crearRng(3);
  for (let k = 0; k < 200; k++) {
    const item = generarNumeros(rng, { puntos: 9, vidas: 5 });
    const ops = opcionesNumero(NUMEROS_Y_SIMBOLOS[item.i], item.orden);
    assert.deepEqual([...ops].sort(), [NUMEROS_Y_SIMBOLOS[item.i].buena, NUMEROS_Y_SIMBOLOS[item.i].mala].sort());
  }
});

test('ortografia-palabras: explicaciones con la buena en <b> y idError con el patrón', () => {
  for (const ej of EJERCICIOS) {
    for (const it of ej.banco) {
      const html = ej.explicacion(it);
      assert.ok(html.includes(`<b>${it.buena}`) || (ej.banco === JUNTAS && html.includes('<b>')), `${ej.nombre}: «${it.buena}» en <b> (${html})`);
      for (const mala of ej.opciones(it).filter(o => o !== it.buena)) {
        const id = ej.banco === NUMEROS_Y_SIMBOLOS ? idErrorNumero(it) : ej.idError(it, mala);
        assert.match(id, PATRON_ERROR, `${ej.nombre}: «${id}»`);
      }
    }
  }
  assert.equal(idErrorJuntas(JUNTAS.find(it => it.buena === 'sino'), 'si no'), 'si-no-por-sino');
  assert.equal(idErrorJuntas(JUNTAS.find(it => it.buena === 'a veces'), 'aveces'), 'aveces-por-a-veces');
  assert.equal(idErrorHomofono(HOMOFONOS.find(it => it.buena === 'tubo'), 'tuvo'), 'tuvo-por-tubo');
  assert.equal(idConfusion('habría', 'abría'), 'habria-por-abria');
  // El idError es por confusión, no por frase: las frases de un mismo par dan los mismos.
  const ids = new Set(HOMOFONOS.filter(it => it.par === 'tubo').map(it => idErrorHomofono(it, opcionesHomofono(it).find(o => o !== it.buena))));
  assert.equal(ids.size, 2);
});

test('ortografia-palabras: ninguna frase repite las de la 45 (ortografia) ni las de ortografia-letras (136)', () => {
  const marco = f => f.replace(/\{\}|_/g, '_').trim();
  const ajenas = new Set(Object.values(PAREJAS).flatMap(p => p.frases.map(([f]) => marco(f))));
  for (const banco of Object.values(letras.BANCOS ?? {})) for (const it of banco) {
    if (it.texto) ajenas.add(marco(it.texto));
    if (it.frase) ajenas.add(marco(it.frase));
  }
  for (const it of [...JUNTAS, ...HOMOFONOS, ...NUMEROS_Y_SIMBOLOS]) assert.ok(!ajenas.has(marco(it.frase)), `frase repetida: «${it.frase}»`);
  // Y con la palabra puesta, tampoco (por si otra práctica escribe la frase entera).
  const llenas = new Set([...ajenas]);
  for (const it of HOMOFONOS) assert.ok(!llenas.has(rellenar(it.frase, it.buena)), it.frase);
});

test('ortografia-palabras: ninguna frase del ejercicio 3 caduca con el año (estamos en, este año es, el año en curso)', () => {
  for (const it of NUMEROS) {
    assert.ok(!/estamos en|este año es|este año, febrero/i.test(it.frase), it.frase);
    assert.ok(!/\b202[6-9]\b/.test(`${it.frase} ${it.buena}`) && !/dos mil veinti/.test(it.buena), it.frase);
  }
});
