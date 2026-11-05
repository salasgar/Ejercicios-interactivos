// Práctica «Lee y escribe decimales» de la unidad 5 (PU2, tarea 123): 3000 ítems por ejercicio con
// semillas fijas, contra comprobaciones escritas AQUÍ, aparte del generador (lector de inglés, aritmética
// con BigInt). La opción buena dice lo que se ve, cada falsa vale otra cosa y nace de un error con nombre,
// nunca se enfrentan dos escrituras del mismo valor, no sale ningún caso de la hoja 1 ni del examen, y
// ningún texto de alumno lleva ×, porcentajes ni coma en inglés / punto en español.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { aTexto, enPalabras, esLecturaValida, lecturasValidas, deTexto, hayIguales, decimal } from '../practicas/_comun/decimales.js';
import { numeroAIngles } from '../src/ejercicios/palabras.js';
import { opcionesRecta, indiceDe } from '../practicas/_comun/recta-decimales.js';
import { TX } from '../practicas/lee-decimales/textos.js';
import {
  generarLeelo, generarCifra, generarFraccionDecimal, generarRecta, ERRORES, ESTA_DEFINIDO, nombreDe,
  esReservado, CASOS_DE_LA_HOJA, HUELLAS_EXAMEN, huella, D, Fr, huecosHasta, corregirToque, corregirLeido,
  terminosDe, sumaDe, MAX_CIFRAS, COTAS_RECTA, claveItem, pasoDeRecta,
} from '../practicas/lee-decimales/logica.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => generar(rng, { idioma: i % 2 ? 'es' : 'en' }));
};

// ─── Comprobaciones independientes del generador ─────────────────────────────────────────

/** m1/10^k1 = m2/10^k2, con BigInt. */
const igualesBig = (a, b) => BigInt(a.m) * 10n ** BigInt(b.k) === BigInt(b.m) * 10n ** BigInt(a.k);
const sinCeroFinal = d => d.k === 0 || d.m % 10 !== 0;
const valoresDistintos = lista => lista.every((a, i) => lista.every((b, j) => i === j || !igualesBig(a, b)));

const ENTERO_EN = new Map(Array.from({ length: 100000 }, (_, n) => [numeroAIngles(n), n]));
ENTERO_EN.set('nought', 0);
const CIFRA_EN = { nought: 0, zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };

/** Lector de «forty-one point three seven» → { m, k }, o null si no es una lectura así. */
function leerIngles(texto) {
  const [a, b, resto] = texto.split(' point ');
  if (resto !== undefined) return null;
  const entera = ENTERO_EN.get(a);
  if (entera === undefined) return null;
  const dec = b === undefined ? [] : b.split(' ').map(w => CIFRA_EN[w]);
  if (dec.some(c => c === undefined)) return null;
  return { m: Number(String(entera) + dec.join('')), k: dec.length };
}

const textoDe = (p, idioma) => aTexto(D(p), idioma);

// ─── Casos reservados ────────────────────────────────────────────────────────────────────

test('casos reservados: los de la hoja salen como reservados por valor, y los del examen por huella', () => {
  assert.ok(CASOS_DE_LA_HOJA.size >= 25);
  assert.ok(esReservado(deTexto('6.318')));
  assert.ok(esReservado(deTexto('6,30')), '6,3 y 6,30 son el mismo caso');
  assert.ok(!esReservado(deTexto('3.75')));
  assert.equal(HUELLAS_EXAMEN.size, 0, 'el 5-11 no había fichero de casos del examen de la semana 1: la publicación coteja');
  const h = huella('3.75');
  HUELLAS_EXAMEN.add(h);
  assert.ok(esReservado(deTexto('3,750')), 'una huella de examen reserva el decimal por valor');
  HUELLAS_EXAMEN.delete(h);
  assert.ok(!esReservado(deTexto('3.75')));
});

test('ningún ejercicio saca un decimal de la hoja', () => {
  const todos = [
    ...items(generarLeelo, 11).map(i => [i.d]),
    ...items(generarCifra, 12).map(i => [i.d]),
    ...items(generarFraccionDecimal, 13).map(i => [i.d]),
    ...items(generarRecta, 14).map(i => [i.valor]),
  ].flat();
  for (const p of todos) assert.ok(!esReservado(D(p)), `sale un caso reservado: ${textoDe(p, 'es')}`);
});

// ─── Ejercicio 1 · Léelo ─────────────────────────────────────────────────────────────────

test('ej. 1: 4 opciones, una buena, de valores distintos, y cada falsa nace de un error con nombre', () => {
  for (const item of items(generarLeelo, 101)) {
    const d = D(item.d);
    assert.ok(item.d.k >= 1 && item.d.k <= MAX_CIFRAS, 'de 1 a 3 cifras decimales');
    assert.ok(sinCeroFinal(item.d), `acaba en 0: ${textoDe(item.d, 'es')}`);
    assert.ok(d.m > 0 && item.d.m < 10 ** 8);
    assert.equal(item.opciones.length, 4);
    assert.equal(item.opciones.filter(o => o.correcta).length, 1);
    const buena = item.opciones.find(o => o.correcta);
    assert.ok(igualesBig(buena.valor, item.d));
    assert.ok(valoresDistintos(item.opciones.map(o => o.valor)), `dos opciones del mismo valor en ${textoDe(item.d, 'es')}`);
    assert.equal(hayIguales(item.opciones.map(o => D(o.valor))), false);
    for (const o of item.opciones.filter(x => !x.correcta)) {
      assert.ok(ESTA_DEFINIDO(o.error), `error sin nombre: ${o.error}`);
      assert.ok(!igualesBig(o.valor, item.d));
      assert.ok(o.valor.k <= MAX_CIFRAS);
    }
  }
});

test('ej. 1: en lectura, la buena es una lectura válida y ninguna falsa lo es; en inglés, un lector aparte lo confirma', () => {
  for (const item of items(generarLeelo, 102).filter(i => i.sentido === 'lectura')) {
    const d = D(item.d);
    const textos = item.opciones.map(o => o.texto);
    assert.equal(new Set(textos).size, 4, 'lecturas repetidas');
    for (const o of item.opciones) {
      assert.equal(esLecturaValida(d, o.texto, item.idioma), o.correcta, `«${o.texto}» para ${textoDe(item.d, item.idioma)}`);
      assert.doesNotMatch(o.texto, /\d/, 'la lectura no lleva cifras');
      if (item.idioma === 'en') {
        const leido = leerIngles(o.texto);
        assert.ok(leido, `no se lee: «${o.texto}»`);
        assert.equal(igualesBig(leido, o.valor), true, `«${o.texto}» no dice ${textoDe(o.valor, 'en')}`);
        assert.equal(igualesBig(leido, item.d), o.correcta);
      }
    }
  }
});

test('ej. 1: en cifras, la lectura vista es una de las válidas y las opciones se escriben con la coma o el punto del idioma', () => {
  for (const item of items(generarLeelo, 103).filter(i => i.sentido === 'cifras')) {
    const d = D(item.d);
    assert.ok(esLecturaValida(d, item.lectura, item.idioma), `«${item.lectura}» no es lectura válida de ${textoDe(item.d, item.idioma)}`);
    if (item.idioma === 'en') {
      assert.ok(igualesBig(leerIngles(item.lectura), item.d));
      assert.doesNotMatch(item.lectura, /^zero|point$/);
    } else {
      assert.ok(!item.lectura.startsWith('cero unidades'), 'con parte entera 0 no se lee «cero unidades»');
    }
    const escritas = item.opciones.map(o => textoDe(o.valor, item.idioma));
    assert.equal(new Set(escritas).size, 4);
    for (const t of escritas) assert.doesNotMatch(t, item.idioma === 'en' ? /,/ : /\./);
  }
});

test('ej. 1: un tercio con «nought», ceros intermedios y los dos sentidos e idiomas', () => {
  const lista = items(generarLeelo, 104);
  const cero = lista.filter(i => i.d.m < 10 ** i.d.k).length / N;
  assert.ok(cero > 0.2 && cero < 0.5, `parte entera 0 en ${cero}`);
  const enMedio = lista.filter(i => String(i.d.m).padStart(i.d.k + 1, '0').slice(-i.d.k, -1).includes('0')).length / N;
  assert.ok(enMedio > 0.1, `ceros en medio: ${enMedio}`);
  assert.ok(lista.filter(i => i.sentido === 'lectura').length > 1000 && lista.filter(i => i.sentido === 'cifras').length > 1000);
  assert.ok(lista.filter(i => i.idioma === 'en').length === N / 2);
  for (const i of lista.filter(x => x.idioma === 'en' && x.d.m < 10 ** x.d.k)) assert.match(enPalabras(D(i.d), 'en'), /^nought point/);
  // Las dos lecturas del español existen para el mismo número y no se enfrentan nunca.
  assert.ok(lecturasValidas(decimal(375, 2), 'es').length >= 2);
});

// ─── Ejercicio 2 · ¿Qué vale esta cifra? ─────────────────────────────────────────────────

test('ej. 2: el valor de la cifra marcada es el correcto (cuenta aparte con la cadena de cifras), y las opciones, distintas', () => {
  const valores = items(generarCifra, 201).filter(i => i.tipo === 'valor');
  assert.ok(valores.length > 1200);
  for (const item of valores) {
    const digitos = String(item.d.m).padStart(item.d.k + 1, '0');
    const cifra = Number(digitos[item.indice]);
    const exponente = digitos.length - item.d.k - 1 - item.indice;
    assert.ok(cifra !== 0, 'la cifra preguntada no es 0');
    assert.equal(cifra, item.cifra);
    assert.equal(exponente, item.exponente);
    const esperado = exponente >= 0 ? { m: cifra * 10 ** exponente, k: 0 } : { m: cifra, k: -exponente };
    const buena = item.opciones.find(o => o.correcta);
    assert.ok(igualesBig(buena.valor, esperado), `valor de ${cifra} en ${textoDe(item.d, 'es')}`);
    assert.equal(item.opciones.length, 4);
    assert.ok(valoresDistintos(item.opciones.map(o => o.valor)));
    for (const o of item.opciones.filter(x => !x.correcta)) assert.ok(ESTA_DEFINIDO(o.error));
  }
});

test('ej. 2: la descomposición buena suma el número; las falsas, otra cosa; los cuatro totales, distintos', () => {
  const sumas = items(generarCifra, 202).filter(i => i.tipo === 'suma');
  assert.ok(sumas.length > 1000);
  const total = terminos => terminos.reduce((s, t) => ({ m: s.m * 10 ** t.k + t.m * 10 ** s.k, k: s.k + t.k }), { m: 0, k: 0 });
  for (const item of sumas) {
    assert.equal(item.opciones.length, 4);
    assert.equal(item.opciones.filter(o => o.correcta).length, 1);
    const totales = item.opciones.map(o => total(o.terminos));
    item.opciones.forEach((o, i) => assert.equal(igualesBig(totales[i], item.d), o.correcta, `${textoDe(item.d, 'es')} con ${o.error}`));
    assert.ok(valoresDistintos(totales));
    const buena = item.opciones.find(o => o.correcta);
    assert.ok(buena.terminos.length >= 2);
    assert.deepEqual(buena.terminos, terminosDe(D(item.d)).map(t => ({ m: t.m, k: t.k })));
    assert.ok(igualesBig(sumaDe(buena.terminos.map(D)), item.d));
    for (const o of item.opciones.filter(x => !x.correcta)) assert.ok(ESTA_DEFINIDO(o.error));
    // Los textos de las cuatro sumas son distintos.
    assert.equal(new Set(item.opciones.map(o => o.terminos.map(t => textoDe(t, 'es')).join(' + '))).size, 4);
  }
});

// ─── Ejercicio 3 · La fracción decimal ───────────────────────────────────────────────────

test('ej. 3: de decimal a fracción decimal, sin simplificar y con ninguna opción que valga lo mismo que otra', () => {
  const lista = items(generarFraccionDecimal, 301).filter(i => i.sentido === 'a-fraccion');
  assert.ok(lista.length > 1200);
  for (const item of lista) {
    const buena = item.opciones.find(o => o.correcta);
    assert.deepEqual(buena.fr, { n: item.d.m, d: 10 ** item.d.k }, 'sin simplificar: todas las cifras sobre 1 y tantos ceros como cifras decimales');
    assert.ok([10, 100, 1000].includes(buena.fr.d));
    assert.equal(item.opciones.length, 4);
    const claves = item.opciones.map(o => BigInt(o.fr.n) * 10n ** 6n / BigInt(o.fr.d));
    assert.equal(new Set(claves.map(String)).size, 4, 'dos fracciones equivalentes');
    assert.equal(hayIguales(item.opciones.map(o => Fr(o.fr))), false);
    assert.ok(Math.trunc(item.d.m / 10 ** item.d.k) >= 1, 'parte entera ≥ 1');
    for (const o of item.opciones.filter(x => !x.correcta)) assert.ok(ESTA_DEFINIDO(o.error));
  }
});

test('ej. 3: de fracción decimal a decimal, con cuatro decimales de valores distintos', () => {
  const lista = items(generarFraccionDecimal, 302).filter(i => i.sentido === 'a-decimal');
  assert.ok(lista.length > 1200);
  for (const item of lista) {
    assert.ok([10, 100, 1000].includes(item.fr.d));
    assert.ok(item.fr.n % 10 !== 0, 'sin ceros a la derecha del numerador');
    const buena = item.opciones.find(o => o.correcta);
    assert.ok(igualesBig(buena.valor, { m: item.fr.n, k: Math.log10(item.fr.d) }));
    assert.equal(item.opciones.length, 4);
    assert.ok(valoresDistintos(item.opciones.map(o => o.valor)));
    assert.equal(new Set(item.opciones.map(o => textoDe(o.valor, 'es'))).size, 4);
    for (const o of item.opciones.filter(x => !x.correcta)) assert.ok(ESTA_DEFINIDO(o.error));
    assert.ok(item.fr.n / item.fr.d < 100, 'a lo sumo dos cifras enteras');
  }
});

// ─── Ejercicio 4 · En la recta ───────────────────────────────────────────────────────────

test('ej. 4: el número cae en una marca de un tramo coherente, entre dos naturales o entre dos décimas', () => {
  for (const item of items(generarRecta, 401)) {
    assert.ok(item.cifras === 1 || item.cifras === 2);
    const o = opcionesRecta({ desde: D(item.desde), hasta: D(item.hasta), cifras: item.cifras });
    assert.equal(o.n, 11, 'diez huecos iguales');
    const i = indiceDe(D(item.valor), o);
    assert.ok(i !== null && i >= 1 && i <= 9, 'dentro del tramo y no en un extremo');
    assert.equal(huecosHasta(item, item.valor), i);
    assert.equal(item.marcas, i);
    if (item.cifras === 1) { assert.equal(item.desde.k, 0); assert.ok(item.desde.m <= COTAS_RECTA.enteroMax); }
    else { assert.equal(item.desde.k, 1); assert.ok(item.desde.m / 10 < COTAS_RECTA.enteroMaxCentesimas); }
    assert.ok(igualesBig({ m: item.hasta.m - item.desde.m, k: item.desde.k }, { m: 1, k: item.cifras - 1 }));
    assert.deepEqual(pasoDeRecta(item).m, 1);
    assert.ok(['tocar', 'leer'].includes(item.sentido));
  }
});

test('ej. 4: la corrección acepta el valor (también con ceros), nombra «contar marcas» y «2,07» y no deja pasar otra cosa', () => {
  let probados = 0;
  for (const item of items(generarRecta, 402)) {
    const buena = D(item.valor);
    assert.deepEqual(corregirToque(item, buena), { acierto: true, error: null });
    assert.deepEqual(corregirLeido(item, buena.conCifras(3)), { acierto: true, error: null }, '2,7 = 2,700');
    const paso = pasoDeRecta(item);
    const masUno = decimal(buena.m + 1, buena.k), menosUno = decimal(buena.m - 1, buena.k);
    for (const otro of [masUno, menosUno]) {
      assert.equal(corregirToque(item, otro).error, 'cuenta-marcas-en-vez-de-huecos');
      assert.equal(corregirLeido(item, otro).error, 'cuenta-marcas-en-vez-de-huecos');
    }
    const lejos = decimal(buena.m + 3, buena.k);
    assert.equal(corregirToque(item, lejos).acierto, false);
    assert.equal(corregirLeido(item, lejos).acierto, false);
    if (item.cifras === 1) {
      const centesima = decimal(item.desde.m * 100 + item.marcas, 2);
      assert.equal(corregirLeido(item, centesima).error, 'decimas-por-centesimas', '2,7 leído como 2,07');
      probados++;
    }
    assert.equal(paso.m, 1);
  }
  assert.ok(probados > 1000);
  for (const e of ['cuenta-marcas-en-vez-de-huecos', 'recta-otro-lugar', 'decimas-por-centesimas']) assert.ok(ESTA_DEFINIDO(e));
});

// ─── Todos los ejercicios ────────────────────────────────────────────────────────────────

test('los errores de la práctica tienen nombre en los dos idiomas', () => {
  for (const [id, e] of Object.entries(ERRORES)) {
    assert.ok(e.nombre.es.length > 10 && e.nombre.en.length > 10, id);
    assert.doesNotMatch(`${e.nombre.es} ${e.nombre.en}`, /[×%]/);
  }
  assert.equal(nombreDe('no-existe'), undefined);
});

test('la clave de ítem distingue ítems distintos y es estable', () => {
  const rng = crearRng(5);
  const a = generarLeelo(rng, { idioma: 'en' });
  assert.equal(claveItem(a), claveItem(JSON.parse(JSON.stringify(a))));
  const b = generarLeelo(rng, { idioma: 'en' });
  assert.notEqual(claveItem(a), claveItem(b));
});

test('los generadores son deterministas con la misma semilla', () => {
  for (const g of [generarLeelo, generarCifra, generarFraccionDecimal, generarRecta]) {
    assert.deepEqual(g(crearRng(9), { idioma: 'es' }), g(crearRng(9), { idioma: 'es' }));
  }
});

test('textos: ninguno lleva ×, porcentajes ni letras de variable, y los dos idiomas están completos', () => {
  const muestras = ['3,75', 2, '0,07', 4, 5, 'y'];
  const recorre = (x, ruta, salida) => {
    if (typeof x === 'string') salida.push([ruta, x]);
    else if (typeof x === 'function') {
      try { salida.push([ruta, String(x(...muestras))]); } catch { /* una función de otro tipo de argumentos */ }
    } else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) recorre(v, `${ruta}.${k}`, salida);
  };
  const hojas = [];
  recorre(TX, 'TX', hojas);
  assert.ok(hojas.length > 60);
  for (const [ruta, t] of hojas) {
    assert.doesNotMatch(t, /[×%]/, `${ruta}: ${t}`);
    assert.doesNotMatch(t, /undefined|NaN|\[object/, `${ruta}: ${t}`);
  }
  // Cada texto {es, en} tiene los dos idiomas.
  const pares = (x, ruta) => {
    if (x && typeof x === 'object' && !Array.isArray(x)) {
      if ('es' in x || 'en' in x) { assert.ok(x.es !== undefined && x.en !== undefined, `${ruta} sin los dos idiomas`); return; }
      for (const [k, v] of Object.entries(x)) pares(v, `${ruta}.${k}`);
    } else if (Array.isArray(x)) x.forEach((v, i) => pares(v, `${ruta}[${i}]`));
  };
  pares(TX, 'TX');
  assert.equal(TX.ejercicios.length, 4);
  for (const e of TX.ejercicios) {
    assert.match(e.introduccion.es, /<h3>/);
    assert.match(e.introduccion.en, /<h3>/);
  }
});

test('el ejemplo de las introducciones no es un caso reservado', () => {
  for (const t of ['3.75', '4.507', '7.4', '0.7']) {
    // 7,4 y 0,7 son de la hoja a propósito de la comprobación: los de la introducción son 3,75 y 4,507.
    if (t === '3.75' || t === '4.507') assert.ok(!esReservado(deTexto(t)), `${t} está en la hoja`);
  }
});
