// Proporcionalidad y porcentajes para las prácticas de la unidad 7 (PU2, tarea 211): la
// cantidad con su unidad, lo que teclea el alumno, cómo se escribe y se lee en los dos
// idiomas, las cuentas de la unidad con su paso a paso, los errores típicos (de donde salen
// los distractores), la huella de un caso y el banco de contextos con la cota de cada uno.
// Puro (sin DOM ni red). Todo valor es una `Fraccion` de `fracciones.js`, exacta: nada de
// coma flotante, ni `toFixed`, ni `eval`. El dinero se guarda exacto y se escribe al
// céntimo. Probado en `tests/practicas-proporcion.test.js`.
//
// ─── La cantidad ───────────────────────────────────────────────────────────────
//
//   cantidad('3,5', 'km') (nunca 3.5: el texto o la fracción), cantidad(fraccion(7, 2), 'km'), cantidad(20, '%'), cantidad(12, '€').
//   Inmutable: { valor: Fraccion irreducible, unidad: símbolo de UNIDADES_MEDIDA o null (un número) }.
//   aCantidad(x) acepta una Cantidad, una Fraccion, un entero, un Decimal o un texto (lo lee deTexto).
//     c.magnitud()               'numero' (sin unidad y '%'), 'longitud', 'masa', 'capacidad', 'superficie',
//                                'tiempo', 'dinero', 'velocidad', 'consumo', 'precio-masa', 'precio-capacidad', 'precio-tiempo'
//     c.valorBase()              en la unidad base: 20 % → 1/5; 2,5 km → 2500 (m); 1,5 h → 5400 (s)
//     c.enUnidad(u)              la misma cantidad en otra unidad de su magnitud (sin pasos; con pasos, cambiarUnidad)
//   mismoValor(a, b)             la comparación de la regla 1: misma magnitud y mismo valor en la unidad base.
//                                20 % = 0,2 = 1/5; 3/4 = 6/8 = 0,75 = 75 %; 2,5 km = 2500 m; 12 € = 12,00 €;
//                                1,5 h = 90 min; un número suelto toma la unidad del otro (9 = 9 €; 9 € = 900 céntimos).
//                                0,33 no es 1/3; 20 % no es 20. Con listas, elemento a elemento.
//   UNIDADES_MEDIDA[símbolo] = { simbolo, magnitud, factor (Fraccion, a la base), nombre: { es: [sing, pl], en } }.
//
// ─── Lo que teclea el alumno ───────────────────────────────────────────────────
//
//   leerCantidad(texto, { unidad, magnitud, idioma, razon }) → { ok: true, valor: Cantidad, escrito, forma,
//   fraccion, razon, unidadEscrita } o { ok: false, motivo, mensaje: { es, en } }. deTexto(texto, opciones) →
//   Cantidad o null. `forma`: 'entero', 'decimal', 'fraccion' (y `fraccion` es la Fraccion TAL COMO SE
//   ESCRIBIÓ: 6/8 sigue siendo 6/8), 'razon' (y `razon` es [a, b] tal cual) o 'complejo' (1 h 30 min).
//   Acepta 20 %, 20%, 0,2, 0.2, 1/5, 12 €, 12,00 €, 12.00, €12, 12 euros, 2,5 km, 2500 m, 2 500 m,
//   1 h 30 min, 3 km 250 m, la unidad en mayúsculas o minúsculas (KM, l, ml) y, solo con `razon: true`,
//   3 : 4, 3:4, «3 a 4» y «3 to 4» (1 : 50 000, 1:50000). Con `unidad`, el número solo vale (en un campo de
//   '%', «20» es el 20 % y «0,15» es el 0,15 %); otra unidad de la misma magnitud también vale (no es error
//   dar la cantidad en otra unidad: lo dice `unidadEscrita`). Motivos: vacio, basura, unidad-que-no-toca,
//   sin-unidad (con `magnitud` y sin unidad), dos-comas, millares-con-punto (50.000; en inglés, también
//   50,000), periodico (0,333…), division-entre-0, expresion (una cuenta sin hacer: 0,2 · 150, 3 : 4 sin
//   `razon`). Nunca `eval` ni `Number(texto)` sobre lo escrito.
//
// ─── Escritura y lectura ───────────────────────────────────────────────────────
//
//   aTexto(x, idioma, { cifras, forma }) y aHtml(...): 20 % (con espacio de no separación) en español y 20%
//   en inglés; coma decimal en español y punto en inglés; espacio fino (U+202F) entre grupos de tres desde las
//   cinco cifras (50 000; 2500 sin separar); el dinero, con dos decimales (12,00 € / €12.00); la unidad
//   separada con espacio de no separación (3,5 km). Un valor que no es decimal exacto sale como fracción
//   (`aHtml`, con la raya de htmlFraccion); `forma: 'fraccion'` lo fuerza. Nunca ×, ni un periódico.
//   numeroATexto(f, idioma, { cifras }) es lo mismo para un número suelto.
//   razonATexto(a, b, idioma, forma) y razonAHtml(...): forma 'fraccion' (3/4, sin simplificar), 'palabras'
//   (3 a 4 / 3 to 4), 'de-cada' (3 de cada 4 / 3 out of 4) o 'dos-puntos' (3 : 4: solo escalas y repartos).
//   escalaATexto(50000) → 1 : 50 000. complejoATexto(partes, idioma) → 1 h 30 min.
//   enPalabras(x, idioma), lecturasValidas(x, idioma) y esLecturaValida(x, texto, idioma), con x una
//   Cantidad, { razon: [a, b] } o { escala: n }: twenty per cent / percent; three to four; one to fifty
//   thousand; veinte por ciento; tres a cuatro; uno a cincuenta mil. Ninguna lectura válida es distractor.
//
// ─── Las cuentas, con sus pasos ────────────────────────────────────────────────
//
//   Todas devuelven { resultado, pasos, … }; `pasos` es una lista de líneas { es, en } (texto plano, una
//   operación por línea) para el feedback y para el «No lo sé».
//     sonProporcion(a, b, c, d)            a/b y c/d por productos cruzados (resultado: booleano; productos)
//     terminoQueFalta(a, b, c, d)          el que vale null es la x: 3/4 = x/20 → 4x = 3 · 20 → 4x = 60 → x = 60 : 4 → x = 15
//     esTablaDirecta(t), esTablaInversa(t), constante(t, tipo), completarTabla(t, tipo)   t = [[x, y], …]
//     proporcionDirecta({ a, b, c }, metodo)   a ⟶ b, c ⟶ x; metodo 'regla-de-tres' (la oficial, con `tabla`),
//                                          'unidad' (¿cuánto es 1?) o 'constante'. Los tres dan lo mismo.
//     proporcionInversa({ a, b, c }, metodo)   'regla-de-tres' (una razón invertida) o 'producto'; con `comprobacion`
//     porcentajeDe(p, c, metodo)           'fraccion', 'decimal', 'diez', 'uno' o 'regla-de-tres'
//     quePorcentaje(parte, total)          null si no sale un porcentaje exacto
//     totalDesdePorcentaje(p, parte)
//     aplicarPorcentaje(c, p, 'descuento' | 'aumento') → { cambio, final, factor, pasosDosPasos,
//                                          pasosComplementario, pasosUnPaso }
//     repartir(total, [2, 3])              null si no sale exacto (al céntimo; personas y cosas, enteros)
//     realidad(plano, escala, unidad), enElPlano(real, escala, unidad), hallarEscala(plano, real); `escala`
//                                          las junta: escala.realidad, escala.enElPlano, escala.hallar, escala.aTexto
//     cambiarUnidad(c, unidad)             con los saltos de la escalera (o el 60 del tiempo) como pasos
//     aComplejo(c, unidades), aIncomplejo(partes, unidad)   1,5 h = 1 h 30 min; 3 km 250 m = 3250 m
//     redondear(x, cifras)                 al más cercano, la mitad hacia arriba; solo si el enunciado lo pide
//
// ─── Errores típicos ───────────────────────────────────────────────────────────
//
//   ERRORES_TIPICOS[id] = { fn, devuelve, ejemplo, nombre: { es, en }, es, en } (es y en repiten el nombre).
//   `fn`, con los números del ítem, da el resultado equivocado (una Cantidad o una lista de Cantidades), o
//   null cuando da lo mismo que lo bueno, no se aplica o no es exacto (un periódico nunca es una opción;
//   las tres razones —invertir-razon, parte-parte-como-parte-todo y al revés— sí dan fracciones como 4/3).
//   El id vale como `error` de `api.responder`. distractores([[id, …args], …], correcta) junta los que
//   sirven, sin dos que valgan lo mismo entre sí ni con la correcta (por mismoValor); hayEquivalentes(lista).
//   NO_ES_ERROR: lo que nunca es distractor ni fallo.
//
// ─── Huella y contextos ────────────────────────────────────────────────────────
//
//   huella(s): la FNV-1a de `equivalentes/logica.js` y de `algebra.js`. huellaCaso(tipo, datos): la del caso
//   normalizado por valor (el 20 % de 150, el 20 % de 150 € y 0,2 · 150 dan la misma; 3/4 = x/20 y x/20 = 3/4,
//   también). Para excluir los casos de examen sin escribirlos: se calculan fuera del repositorio.
//   CONTEXTOS: el banco, cada contexto con su tipo, sus datos con `rango` (los que se sortean) o `cota` (los
//   que salen de la cuenta), `cifras` (lo exacto: personas enteras, dinero al céntimo) y el enunciado en los
//   dos idiomas por pregunta. generarDatos(contexto, rng) elige al azar hasta que todo cuadra;
//   dentroDeCota(contexto, datos) es lo que afirman los tests; enunciado(contexto, datos, idioma, pregunta).
//   NOMBRES: personajes inventados (ningún alumno real).

import { Fraccion, fraccion, aFraccion as fraccionDe, aTexto as textoFraccion, htmlFraccion, htmlRaya, comparar, MENOS } from './fracciones.js';
import { Decimal, deFraccion, aFraccion as decimalAFraccion, aTexto as textoDecimal, deTexto as leerDecimal,
  enPalabras as decimalEnPalabras, lecturasValidas as lecturasDecimal, dineroEnPalabras, lecturasDinero } from './decimales.js';
import { numeroAIngles, numeroAInglesSinAnd, numeroAEspanol } from '../../src/ejercicios/palabras.js';

export { MENOS };

export class ErrorProporcion extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorProporcion';
    this.codigo = codigo;
  }
}

/** Espacio de no separación (entre el número y la unidad o el %) y espacio fino (entre los millares). */
export const NBSP = ' ';
export const FINO = ' ';

const F = (n, d = 1) => new Fraccion(n, d).simplificar();
const CERO = F(0);
const UNO = F(1);
const CIEN = F(100);
const pot10 = n => 10 ** n;

/** Una Fraccion irreducible a partir de una Fraccion, un entero, un Decimal o un texto ('3,5', '3/4'). */
function aValor(x) {
  if (x instanceof Fraccion) return x.simplificar();
  if (x instanceof Decimal) return decimalAFraccion(x);
  if (Number.isSafeInteger(x)) return F(x);
  if (typeof x === 'string') {
    const r = leerNumeroPlano(normalizar(x), 'es');
    if (r.ok) return r.valor;
  }
  if (x instanceof Cantidad) return x.valor;
  throw new ErrorProporcion('no-es-numero', `«${String(x)}» no es un número exacto`);
}

// ─── Unidades ──────────────────────────────────────────────────────────────────

const U = (simbolo, magnitud, factor, es, en, extra = {}) => Object.freeze({ simbolo, magnitud, factor: aValor(factor), nombre: { es, en }, ...extra });

/**
 * Cada unidad con su magnitud y su factor exacto a la unidad base de la magnitud (el metro, el gramo, el
 * litro, el metro cuadrado, el segundo, el euro). El litro, con L mayúscula (SI); los nombres en inglés,
 * británicos. El orden de los escalones está en ESCALERAS (cada salto es por 10, o por 100 en superficie).
 */
export const UNIDADES_MEDIDA = Object.freeze({
  '%': U('%', 'numero', fraccion(1, 100), ['por ciento', 'por ciento'], ['per cent', 'per cent']),
  km: U('km', 'longitud', 1000, ['kilómetro', 'kilómetros'], ['kilometre', 'kilometres']),
  hm: U('hm', 'longitud', 100, ['hectómetro', 'hectómetros'], ['hectometre', 'hectometres']),
  dam: U('dam', 'longitud', 10, ['decámetro', 'decámetros'], ['decametre', 'decametres']),
  m: U('m', 'longitud', 1, ['metro', 'metros'], ['metre', 'metres']),
  dm: U('dm', 'longitud', fraccion(1, 10), ['decímetro', 'decímetros'], ['decimetre', 'decimetres']),
  cm: U('cm', 'longitud', fraccion(1, 100), ['centímetro', 'centímetros'], ['centimetre', 'centimetres']),
  mm: U('mm', 'longitud', fraccion(1, 1000), ['milímetro', 'milímetros'], ['millimetre', 'millimetres']),
  t: U('t', 'masa', 1000000, ['tonelada', 'toneladas'], ['tonne', 'tonnes']),
  kg: U('kg', 'masa', 1000, ['kilogramo', 'kilogramos'], ['kilogram', 'kilograms']),
  hg: U('hg', 'masa', 100, ['hectogramo', 'hectogramos'], ['hectogram', 'hectograms']),
  dag: U('dag', 'masa', 10, ['decagramo', 'decagramos'], ['decagram', 'decagrams']),
  g: U('g', 'masa', 1, ['gramo', 'gramos'], ['gram', 'grams']),
  dg: U('dg', 'masa', fraccion(1, 10), ['decigramo', 'decigramos'], ['decigram', 'decigrams']),
  cg: U('cg', 'masa', fraccion(1, 100), ['centigramo', 'centigramos'], ['centigram', 'centigrams']),
  mg: U('mg', 'masa', fraccion(1, 1000), ['miligramo', 'miligramos'], ['milligram', 'milligrams']),
  kL: U('kL', 'capacidad', 1000, ['kilolitro', 'kilolitros'], ['kilolitre', 'kilolitres']),
  hL: U('hL', 'capacidad', 100, ['hectolitro', 'hectolitros'], ['hectolitre', 'hectolitres']),
  daL: U('daL', 'capacidad', 10, ['decalitro', 'decalitros'], ['decalitre', 'decalitres']),
  L: U('L', 'capacidad', 1, ['litro', 'litros'], ['litre', 'litres']),
  dL: U('dL', 'capacidad', fraccion(1, 10), ['decilitro', 'decilitros'], ['decilitre', 'decilitres']),
  cL: U('cL', 'capacidad', fraccion(1, 100), ['centilitro', 'centilitros'], ['centilitre', 'centilitres']),
  mL: U('mL', 'capacidad', fraccion(1, 1000), ['mililitro', 'mililitros'], ['millilitre', 'millilitres']),
  'km²': U('km²', 'superficie', 1000000, ['kilómetro cuadrado', 'kilómetros cuadrados'], ['square kilometre', 'square kilometres']),
  'hm²': U('hm²', 'superficie', 10000, ['hectómetro cuadrado', 'hectómetros cuadrados'], ['square hectometre', 'square hectometres']),
  'dam²': U('dam²', 'superficie', 100, ['decámetro cuadrado', 'decámetros cuadrados'], ['square decametre', 'square decametres']),
  'm²': U('m²', 'superficie', 1, ['metro cuadrado', 'metros cuadrados'], ['square metre', 'square metres']),
  'dm²': U('dm²', 'superficie', fraccion(1, 100), ['decímetro cuadrado', 'decímetros cuadrados'], ['square decimetre', 'square decimetres']),
  'cm²': U('cm²', 'superficie', fraccion(1, 10000), ['centímetro cuadrado', 'centímetros cuadrados'], ['square centimetre', 'square centimetres']),
  'mm²': U('mm²', 'superficie', fraccion(1, 1000000), ['milímetro cuadrado', 'milímetros cuadrados'], ['square millimetre', 'square millimetres']),
  h: U('h', 'tiempo', 3600, ['hora', 'horas'], ['hour', 'hours']),
  min: U('min', 'tiempo', 60, ['minuto', 'minutos'], ['minute', 'minutes']),
  s: U('s', 'tiempo', 1, ['segundo', 'segundos'], ['second', 'seconds']),
  '€': U('€', 'dinero', 1, ['euro', 'euros'], ['euro', 'euros']),
  cent: U('cent', 'dinero', fraccion(1, 100), ['céntimo', 'céntimos'], ['cent', 'cents'], { conNombre: true }),
  'km/h': U('km/h', 'velocidad', 1, ['kilómetro por hora', 'kilómetros por hora'], ['kilometre per hour', 'kilometres per hour']),
  'L/100 km': U('L/100 km', 'consumo', 1, ['litro cada 100 kilómetros', 'litros cada 100 kilómetros'], ['litre per 100 kilometres', 'litres per 100 kilometres']),
  '€/kg': U('€/kg', 'precio-masa', 1, ['euro el kilo', 'euros el kilo'], ['euro per kilogram', 'euros per kilogram']),
  '€/L': U('€/L', 'precio-capacidad', 1, ['euro el litro', 'euros el litro'], ['euro per litre', 'euros per litre']),
  '€/h': U('€/h', 'precio-tiempo', 1, ['euro la hora', 'euros la hora'], ['euro per hour', 'euros per hour']),
});

/** Los escalones de cada magnitud, de mayor a menor (la t no es un escalón: está tres por encima del kg). */
export const ESCALERAS = Object.freeze({
  longitud: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
  masa: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
  capacidad: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'],
  superficie: ['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²'],
});

const infoUnidad = u => {
  const i = UNIDADES_MEDIDA[u];
  if (!i) throw new ErrorProporcion('unidad', `«${u}» no es una unidad de la tabla`);
  return i;
};

/** Lo que el alumno puede escribir como unidad → el símbolo (sin mayúsculas, sin el punto final). */
const ALIAS = (() => {
  const a = new Map();
  const pon = (u, ...formas) => { for (const f of formas) a.set(f.toLowerCase(), u); };
  for (const [u, i] of Object.entries(UNIDADES_MEDIDA)) pon(u, u, ...i.nombre.es, ...i.nombre.en);
  pon('%', 'por ciento', 'porciento', 'percent', 'per cent', 'pc');
  pon('€', 'eur', 'euro', 'euros', '€.');
  pon('cent', 'céntimo', 'céntimos', 'centimo', 'centimos', 'cents', 'cent', 'cts', 'cts.', 'cént', 'cént.');
  pon('km', 'kilometer', 'kilometers', 'kilometro', 'kilometros');
  pon('m', 'meter', 'meters', 'mts');
  pon('cm', 'centimeter', 'centimeters', 'centimetro', 'centimetros');
  pon('mm', 'millimeter', 'millimeters', 'milimetro', 'milimetros');
  pon('kg', 'kilo', 'kilos', 'kgs', 'kilogramo', 'kilogramos');
  pon('g', 'gr', 'grs', 'gramme', 'grammes');
  pon('L', 'l', 'lt', 'lts', 'liter', 'liters', 'litro', 'litros');
  pon('mL', 'ml', 'milliliter', 'milliliters', 'mililitro', 'mililitros');
  pon('h', 'hr', 'hrs', 'hora', 'horas', 'hour', 'hours');
  pon('min', 'mins', 'minuto', 'minutos', 'minute', 'minutes', "'");
  pon('s', 'seg', 'segs', 'sec', 'secs', 'segundo', 'segundos', 'second', 'seconds');
  pon('t', 'tonelada', 'toneladas', 'tonne', 'tonnes');
  pon('km/h', 'kmh', 'km/hora', 'km por hora', 'kph', 'kilómetros por hora', 'kilometros por hora', 'kilometres per hour', 'kilometers per hour');
  pon('L/100 km', 'l/100km', 'l/100 km', 'l / 100 km', 'l cada 100 km', 'litros cada 100 km');
  pon('€/kg', '€/kilo', 'euros/kg', 'euros el kilo', '€ el kilo', 'euros/kilo', 'eur/kg');
  pon('€/L', 'euros/l', '€/litro', 'euros el litro', '€ el litro', 'eur/l');
  pon('€/h', 'euros/h', '€/hora', 'euros la hora', '€ la hora', 'eur/h');
  for (const m of ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm']) pon(`${m}²`, `${m}2`, `${m}^2`);
  return a;
})();

const unidadDe = texto => ALIAS.get(texto.toLowerCase().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').replace(/\.$/, '')) ?? ALIAS.get(texto.toLowerCase()) ?? null;

// ─── La cantidad ───────────────────────────────────────────────────────────────

export class Cantidad {
  constructor(valor, unidad = null) {
    if (unidad !== null) infoUnidad(unidad);
    this.valor = aValor(valor);
    this.unidad = unidad;
    Object.freeze(this);
  }
  magnitud() { return this.unidad === null ? 'numero' : UNIDADES_MEDIDA[this.unidad].magnitud; }
  valorBase() { return this.unidad === null ? this.valor : this.valor.multiplicar(UNIDADES_MEDIDA[this.unidad].factor).simplificar(); }
  /** La misma cantidad en otra unidad de la misma magnitud (null = número suelto, '%' = tanto por ciento). */
  enUnidad(unidad) {
    const m = unidad === null ? 'numero' : infoUnidad(unidad).magnitud;
    if (m !== this.magnitud()) throw new ErrorProporcion('magnitud', `${this.unidad} y ${unidad} no son de la misma magnitud`);
    const f = unidad === null ? UNO : UNIDADES_MEDIDA[unidad].factor;
    return new Cantidad(this.valorBase().dividir(f), unidad);
  }
  equals(otra) { return mismoValor(this, otra); }
  esExacta() { return deFraccion(this.valor) !== null; }
  toString() { return aTexto(this, 'es'); }
}

export const cantidad = (valor, unidad = null) => new Cantidad(valor, unidad);

/** Una Cantidad desde una Cantidad, una Fraccion, un entero, un Decimal o un texto (lo lee deTexto); lanza si no se puede. */
export function aCantidad(x, unidad = null) {
  if (x instanceof Cantidad) return x;
  if (x && typeof x === 'object' && !(x instanceof Fraccion) && !(x instanceof Decimal) && 'valor' in x) return new Cantidad(x.valor, x.unidad ?? null);
  if (typeof x === 'string') {
    const r = leerCantidad(x, { razon: true });
    if (!r.ok) throw new ErrorProporcion(r.motivo, `«${x}»: ${r.mensaje.es}`);
    return r.valor;
  }
  return new Cantidad(x, unidad);
}

const cantidadSegura = x => { try { return aCantidad(x); } catch (e) { return null; } };

/** ¿Valen lo mismo? Ver la cabecera. Con listas, elemento a elemento; con booleanos o textos, ===. */
export function mismoValor(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => mismoValor(x, b[i]));
  if (typeof a === 'boolean' || typeof b === 'boolean') return a === b;
  const x = cantidadSegura(a), y = cantidadSegura(b);
  if (!x || !y) return a === b;
  if (x.magnitud() === y.magnitud()) return x.valorBase().equals(y.valorBase());
  if (x.unidad === null) return new Cantidad(x.valor, y.unidad).valorBase().equals(y.valorBase());
  if (y.unidad === null) return new Cantidad(y.valor, x.unidad).valorBase().equals(x.valorBase());
  return false;
}

/** ¿Hay en la lista dos que valgan lo mismo? (regla 1 de la unidad: no puede haberlas entre las opciones). */
export function hayEquivalentes(lista) {
  for (let i = 0; i < lista.length; i++) for (let j = i + 1; j < lista.length; j++) if (mismoValor(lista[i], lista[j])) return true;
  return false;
}

/** ¿Es un decimal exacto (y, si se dice, con como mucho `cifras` decimales)? */
export function esExacta(x, cifras = null) {
  const v = x instanceof Cantidad ? x.valor : aValor(x);
  if (cifras !== null) return v.multiplicar(pot10(cifras)).esEntera();
  return deFraccion(v) !== null;
}

// ─── Lo que teclea el alumno ───────────────────────────────────────────────────

export const MENSAJES = Object.freeze({
  vacio: { es: 'Escribe tu respuesta.', en: 'Write your answer.' },
  basura: { es: 'No entiendo lo que has escrito. Escribe solo el número y, si hace falta, la unidad.', en: 'I can’t read that. Write just the number and, if needed, the unit.' },
  'unidad-que-no-toca': { es: 'Esa unidad no va aquí: no es de lo que se pregunta.', en: 'That unit doesn’t belong here: it isn’t what the question asks about.' },
  'sin-unidad': { es: 'Escribe también la unidad.', en: 'Write the unit too.' },
  'dos-comas': { es: 'Hay más de una coma o de un punto. Escribe el número con una sola coma decimal.', en: 'There is more than one decimal point. Write the number with just one.' },
  'millares-con-punto': { es: '¿Es un decimal o son millares? Para los millares no se pone punto: escribe 50000 o 50 000.', en: 'Is it a decimal or thousands? Don’t use a point or a comma for thousands: write 50000 or 50 000.' },
  periodico: { es: 'Sin puntos suspensivos: aquí todo sale exacto. Repasa la cuenta.', en: 'No dots at the end: everything here comes out exact. Check your working.' },
  'division-entre-0': { es: 'No se puede dividir entre 0.', en: 'You can’t divide by 0.' },
  expresion: { es: 'Haz la cuenta y escribe solo el resultado.', en: 'Do the calculation and write only the answer.' },
});

const fallo = motivo => ({ ok: false, motivo, mensaje: MENSAJES[motivo] });

function normalizar(texto) {
  return String(texto ?? '').normalize('NFC')
    .replace(/[      ]/g, ' ')
    .replace(/[−–—‒﹣－]/g, '-')
    .replace(/[⁄∕]/g, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Un número sin unidad: entero, decimal (coma o punto; millares con espacio) o fracción de enteros.
 * → { ok, valor (irreducible), forma, fraccion (tal cual) } o un fallo.
 */
function leerNumeroPlano(s, idioma) {
  let t = s.trim();
  let signo = 1;
  if (/^-/.test(t)) { signo = -1; t = t.slice(1).trim(); }
  if (t === '') return fallo('basura');
  if (t.includes('/')) {
    const partes = t.split('/');
    if (partes.length !== 2) return fallo('expresion');
    const [n, d] = partes.map(p => leerEnteroConEspacios(p.trim()));
    if (n === null || d === null) return /[.,]/.test(t) ? fallo('expresion') : fallo('basura');
    if (d === 0) return fallo('division-entre-0');
    const tal = new Fraccion(signo * n, d);
    return { ok: true, valor: tal.simplificar(), forma: 'fraccion', fraccion: tal };
  }
  const comas = (t.match(/,/g) ?? []).length;
  const puntos = (t.match(/\./g) ?? []).length;
  if (puntos >= 1 && comas >= 1) return fallo('millares-con-punto');
  if (puntos >= 2) return /^\d{1,3}(\.\d{3})+$/.test(t) ? fallo('millares-con-punto') : fallo('dos-comas');
  if (comas >= 2) return idioma === 'en' && /^\d{1,3}(,\d{3})+$/.test(t) ? fallo('millares-con-punto') : fallo('dos-comas');
  if (/^[1-9]\d{0,2}\.\d{3}$/.test(t)) return fallo('millares-con-punto');
  if (idioma === 'en' && /^[1-9]\d{0,2},\d{3}$/.test(t)) return fallo('millares-con-punto');
  const m = /^(\d{1,3}(?: \d{3})+|\d+)?(?:[.,](\d+))?$/.exec(t);
  if (!m || (m[1] === undefined && m[2] === undefined)) return fallo('basura');
  const d = leerDecimal((m[1] ?? '0').replace(/ /g, '') + (m[2] !== undefined ? ',' + m[2] : ''));
  if (!d) return fallo('basura');
  const v = decimalAFraccion(d);
  return { ok: true, valor: signo < 0 ? v.opuesta() : v, forma: m[2] !== undefined ? 'decimal' : 'entero', fraccion: null };
}

function leerEnteroConEspacios(s) {
  if (!/^(\d{1,3}(?: \d{3})+|\d+)$/.test(s)) return null;
  const n = Number(s.replace(/ /g, ''));
  return Number.isSafeInteger(n) ? n : null;
}

const NUM = String.raw`-?\d[\d ]*(?:[.,]\d+)*(?:[.,]\d+)?(?:\s*\/\s*\d[\d ]*)?`;
const SOLO = new RegExp(String.raw`^(€\s*)?(${NUM})\s*(.*)$`);

/** Lo que teclea el alumno: ver la cabecera. */
export function leerCantidad(texto, { unidad, magnitud = null, idioma = 'es', razon = false } = {}) {
  const escrito = String(texto ?? '').trim();
  const s = normalizar(texto);
  if (s === '') return fallo('vacio');
  if (/(\.\.\.|…)/.test(s) || /\d[.,]\d*\(\d+\)/.test(s) || /\d̅/.test(s)) return fallo('periodico');

  // La razón (solo si el campo la pide): 3 : 4, 3:4, 3 a 4, 3 to 4.
  if (razon) {
    const r = /^(.+?)\s*(?::|\s(?:a|to|es a|is to)\s)\s*(.+)$/i.exec(s);
    if (r && /\d$/.test(r[1].trim()) && /^\d/.test(r[2].trim())) {
      const a = leerNumeroPlano(r[1], idioma), b = leerNumeroPlano(r[2], idioma);
      if (!a.ok) return a;
      if (!b.ok) return b;
      if (b.valor.esCero()) return fallo('division-entre-0');
      return { ok: true, valor: new Cantidad(a.valor.dividir(b.valor), null), escrito, forma: 'razon', fraccion: null, razon: [a.valor, b.valor], unidadEscrita: null };
    }
  }
  if (/[+·*×÷=()[\]]/.test(s) || /\d\s*[xX]\s*\d/.test(s) || /\d\s*:\s*\d/.test(s) || /\d\s*-\s*\d/.test(s) || /\s(?:de|of)\s/i.test(s)) return fallo('expresion');

  const leido = leerComplejo(s, idioma) ?? leerSimple(s, idioma);
  if (!leido.ok) return leido;
  return comprobarUnidad({ ...leido, escrito }, unidad, magnitud);
}

/** 1 h 30 min, 3 km 250 m, 2 kg 300 g: dos o más parejas número-unidad, de mayor a menor y de la misma magnitud. */
function leerComplejo(s, idioma) {
  if (!/^(?:\d[\d.,]*\s*[a-zA-Z']+\.?\s*(?:(?:y|and)\s+)?){2,}$/.test(s)) return null;
  const parejas = [...s.matchAll(/(\d[\d.,]*)\s*([a-zA-Z']+)\.?/g)];
  let total = null, magnitud = null, ultimo = null, unidadFinal = null;
  for (const [, n, u] of parejas) {
    const uni = unidadDe(u);
    if (!uni) return fallo('basura');
    const info = UNIDADES_MEDIDA[uni];
    if (magnitud !== null && info.magnitud !== magnitud) return fallo('basura');
    if (ultimo !== null && comparar(info.factor, ultimo) >= 0) return fallo('basura');
    const v = leerNumeroPlano(n, idioma);
    if (!v.ok) return v;
    const c = new Cantidad(v.valor, uni);
    total = total === null ? c.valorBase() : total.sumar(c.valorBase()).simplificar();
    magnitud = info.magnitud;
    ultimo = info.factor;
    unidadFinal = uni;
  }
  return { ok: true, valor: new Cantidad(total.dividir(UNIDADES_MEDIDA[unidadFinal].factor), unidadFinal), forma: 'complejo', fraccion: null, razon: null, unidadEscrita: unidadFinal };
}

function leerSimple(s, idioma) {
  const m = SOLO.exec(s);
  if (!m) return fallo('basura');
  const euroDelante = Boolean(m[1]);
  const resto = m[3].trim();
  // «2 500 m» está bien (millares con espacio); «3 4» no (lo rechaza leerNumeroPlano).
  const v = leerNumeroPlano(m[2].trim(), idioma);
  if (!v.ok) return v;
  let uni = null;
  if (euroDelante) {
    if (resto !== '' && unidadDe(resto) !== '€') return fallo('basura');
    uni = '€';
  } else if (resto !== '') {
    uni = unidadDe(resto);
    if (!uni) return fallo('basura');
  }
  return { ok: true, valor: new Cantidad(v.valor, uni), forma: uni === '%' ? 'porcentaje' : v.forma, fraccion: v.fraccion, razon: null, unidadEscrita: uni };
}

function comprobarUnidad(r, unidad, magnitud) {
  const escrita = r.unidadEscrita;
  if (unidad !== undefined && unidad !== null) {
    const esperada = infoUnidad(unidad).magnitud;
    if (escrita === null) return { ...r, valor: new Cantidad(r.valor.valor, unidad) };
    if (UNIDADES_MEDIDA[escrita].magnitud !== esperada) return fallo('unidad-que-no-toca');
    return r;
  }
  if (magnitud) {
    if (escrita === null) return magnitud === 'numero' ? r : fallo('sin-unidad');
    if (UNIDADES_MEDIDA[escrita].magnitud !== magnitud) return fallo('unidad-que-no-toca');
  }
  return r;
}

/** La Cantidad que se ha tecleado, o null. Mismas opciones que leerCantidad. */
export function deTexto(texto, opciones = {}) {
  const r = leerCantidad(texto, opciones);
  return r.ok ? r.valor : null;
}

// ─── Escritura ─────────────────────────────────────────────────────────────────

/** Los millares con espacio fino desde las cinco cifras: 50000 → 50 000; 2500 se queda. */
function agrupar(s) {
  const m = /^(−?)(\d+)(.*)$/.exec(s);
  if (!m || m[2].length < 5) return s;
  return m[1] + m[2].replace(/\B(?=(\d{3})+(?!\d))/g, FINO) + m[3];
}

/** Un número (Fraccion, entero, Decimal) como texto: coma o punto según el idioma; si no es decimal exacto, como fracción. */
export function numeroATexto(x, idioma = 'es', { cifras = null, forma = null } = {}) {
  const f = aValor(x);
  if (forma === 'fraccion') return textoFraccion(f);
  const d = deFraccion(f);
  if (d === null) return textoFraccion(f);
  let y = d.normalizar();
  if (cifras !== null) {
    const z = y.conCifras(cifras);
    if (!z) throw new ErrorProporcion('cifras', `${textoDecimal(y, idioma)} tiene más de ${cifras} cifras decimales`);
    y = z;
  }
  return agrupar(textoDecimal(y, idioma));
}

const nombreUnidad = (u, v, idioma) => UNIDADES_MEDIDA[u].nombre[idioma][v.equals(UNO) ? 0 : 1];

function escribir(x, idioma, opciones, html) {
  const c = aCantidad(x);
  const { cifras = null, forma = null } = opciones;
  const exacto = deFraccion(c.valor) !== null;
  // El dinero, con dos decimales; si no es exacto al céntimo (una cuenta intermedia), con los que tenga.
  const cifrasDinero = c.unidad === '€' && esExacta(c.valor, 2) ? 2 : cifras;
  const n = (html && (forma === 'fraccion' || !exacto)) ? htmlFraccion(c.valor) : numeroATexto(c.valor, idioma, { cifras: cifrasDinero, forma });
  switch (c.unidad) {
    case null: return n;
    case '%': return idioma === 'en' ? `${n}%` : `${n}${NBSP}%`;
    case '€': return idioma === 'en' ? `€${n}` : `${n}${NBSP}€`;
    case 'cent': return `${n}${NBSP}${nombreUnidad('cent', c.valor, idioma)}`;
    default: return `${n}${NBSP}${c.unidad}`;
  }
}

/** La cantidad (o el número) como texto con la notación de la unidad: ver la cabecera. */
export const aTexto = (x, idioma = 'es', opciones = {}) => escribir(x, idioma, opciones, false);
/** Igual que aTexto, en HTML: un valor que no es decimal exacto (o con forma 'fraccion'), con la raya. */
export const aHtml = (x, idioma = 'es', opciones = {}) => escribir(x, idioma, opciones, true);

const RAZON_PALABRAS = { es: 'a', en: 'to' };
const RAZON_DE_CADA = { es: 'de cada', en: 'out of' };

/** La razón a : b (sin simplificar) como texto: 'fraccion' (3/4), 'palabras', 'de-cada' o 'dos-puntos'. */
export function razonATexto(a, b, idioma = 'es', forma = 'fraccion') {
  const x = numeroATexto(a, idioma), y = numeroATexto(b, idioma);
  if (forma === 'fraccion') return `${x}/${y}`;
  if (forma === 'palabras') return `${x} ${RAZON_PALABRAS[idioma]} ${y}`;
  if (forma === 'de-cada') return `${x} ${RAZON_DE_CADA[idioma]} ${y}`;
  if (forma === 'dos-puntos') return `${x}${NBSP}:${NBSP}${y}`;
  throw new ErrorProporcion('forma', `Forma de razón desconocida: ${forma}`);
}

/** Igual, en HTML: con forma 'fraccion', la raya horizontal con los dos términos tal cual (12 sobre 8). */
export function razonAHtml(a, b, idioma = 'es', forma = 'fraccion') {
  if (forma === 'fraccion') return htmlRaya(numeroATexto(a, idioma), numeroATexto(b, idioma));
  return razonATexto(a, b, idioma, forma);
}

/** 1 : 50 000 (con espacios de no separación y el espacio fino de los millares). */
export const escalaATexto = n => `1${NBSP}:${NBSP}${numeroATexto(n)}`;

/** Las partes de un complejo como texto: [1 h, 30 min] → '1 h 30 min'. */
export const complejoATexto = (partes, idioma = 'es') => partes.map(p => aTexto(p, idioma)).join(' ');

// ─── En palabras ───────────────────────────────────────────────────────────────

function lecturasNumero(v, idioma) {
  const d = deFraccion(v);
  if (d === null) throw new ErrorProporcion('no-exacta', `${textoFraccion(v)} no se lee como decimal exacto`);
  const salida = new Set(lecturasDecimal(d, idioma));
  if (idioma === 'en' && v.esEntera() && v.num >= 0 && v.num <= 1000000) salida.add(numeroAInglesSinAnd(v.num));
  return [...salida];
}
const palabraNumero = (v, idioma) => decimalEnPalabras(deFraccion(v), idioma);

/** La lectura principal: Cantidad, { razon: [a, b] } o { escala: n }. */
export function enPalabras(x, idioma = 'en') {
  if (x && x.razon) return `${palabraNumero(aValor(x.razon[0]), idioma)} ${RAZON_PALABRAS[idioma]} ${palabraNumero(aValor(x.razon[1]), idioma)}`;
  if (x && x.escala) return `${idioma === 'en' ? 'one' : 'uno'} ${RAZON_PALABRAS[idioma]} ${palabraNumero(aValor(x.escala), idioma)}`;
  const c = aCantidad(x);
  if (c.unidad === '€') return dineroEnPalabras(deFraccion(c.valor), idioma);
  const n = palabraNumero(c.valor, idioma);
  if (c.unidad === null) return n;
  return `${n} ${nombreUnidad(c.unidad, c.valor, idioma)}`;
}

/** Todas las lecturas que valen (ninguna puede ser distractor en una pregunta de lectura). */
export function lecturasValidas(x, idioma = 'en') {
  const salida = new Set([enPalabras(x, idioma)]);
  const cruzar = (as, bs, juntas) => { for (const a of as) for (const b of bs) for (const j of juntas) salida.add(`${a} ${j} ${b}`); };
  if (x && x.razon) {
    cruzar(lecturasNumero(aValor(x.razon[0]), idioma), lecturasNumero(aValor(x.razon[1]), idioma), idioma === 'en' ? ['to', 'is to'] : ['a', 'es a']);
    return [...salida];
  }
  if (x && x.escala) {
    cruzar(idioma === 'en' ? ['one'] : ['uno'], lecturasNumero(aValor(x.escala), idioma), idioma === 'en' ? ['to', 'in'] : ['a', 'es a']);
    return [...salida];
  }
  const c = aCantidad(x);
  if (c.unidad === '€') return [...new Set([...salida, ...lecturasDinero(deFraccion(c.valor), idioma)])];
  const ns = lecturasNumero(c.valor, idioma);
  if (c.unidad === null) return [...new Set([...salida, ...ns])];
  const nombres = c.unidad === '%' ? (idioma === 'en' ? ['per cent', 'percent'] : ['por ciento']) : [nombreUnidad(c.unidad, c.valor, idioma)];
  for (const n of ns) for (const u of nombres) salida.add(`${n} ${u}`);
  return [...salida];
}

const plano = t => normalizar(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[-‐]/g, ' ').replace(/\s+/g, ' ').trim();

/** ¿Es `texto` una lectura válida de x? Sin mayúsculas, tildes, guiones ni espacios de más. */
export function esLecturaValida(x, texto, idioma = 'en') {
  const t = plano(texto);
  return lecturasValidas(x, idioma).some(l => plano(l) === t);
}

// ─── Las cuentas ───────────────────────────────────────────────────────────────

/** Una línea de pasos en los dos idiomas: linea(t => `${t(a)} : 3 = ${t(b)}`), con t = aTexto en cada idioma. */
const linea = (fn, en = null) => ({ es: fn(x => aTexto(x, 'es'), 'es'), en: (en ?? fn)(x => aTexto(x, 'en'), 'en') });
const num = x => (x instanceof Cantidad ? x.valor : typeof x === 'string' ? aCantidad(x).valor : aValor(x));
/** El coeficiente de la x: 4x, 1,5x, x (nunca 1x). */
const coefX = (k, t) => (k.equals(UNO) ? 'x' : `${t(k)}x`);
/** La división entre números con «:», con espacios. */
const DIV = ':';

/** a/b y c/d forman proporción si a · d = b · c. */
export function sonProporcion(a, b, c, d) {
  const [x, y, z, w] = [a, b, c, d].map(num);
  const ad = x.multiplicar(w).simplificar(), bc = y.multiplicar(z).simplificar();
  const resultado = ad.equals(bc);
  const pasos = [
    linea(t => `${t(x)} · ${t(w)} = ${t(ad)}`),
    linea(t => `${t(y)} · ${t(z)} = ${t(bc)}`),
    linea(t => (resultado ? `${t(ad)} = ${t(bc)}: sí forman proporción` : `${t(ad)} ≠ ${t(bc)}: no forman proporción`),
      t => (resultado ? `${t(ad)} = ${t(bc)}: they form a proportion` : `${t(ad)} ≠ ${t(bc)}: they do not form a proportion`)),
  ];
  return { resultado, productos: [ad, bc], pasos };
}

/**
 * El término que falta en a/b = c/d (el que vale null es la x), por productos cruzados: la x nunca se
 * «despeja» del denominador (acta de la U6). 3/4 = x/20 → 4x = 3 · 20 → 4x = 60 → x = 60 : 4 → x = 15.
 */
export function terminoQueFalta(a, b, c, d) {
  const terminos = [a, b, c, d];
  const i = terminos.findIndex(v => v === null || v === undefined);
  if (i < 0 || terminos.filter(v => v === null || v === undefined).length !== 1) throw new ErrorProporcion('x', 'Tiene que faltar exactamente un término');
  const v = terminos.map(x => (x === null || x === undefined ? null : num(x)));
  // Producto cruzado: a·d = b·c. La x va con su compañero de producto; los otros dos se multiplican.
  const pareja = [3, 2, 1, 0][i];
  const [o1, o2] = i === 0 || i === 3 ? [v[1], v[2]] : [v[0], v[3]];
  const k = v[pareja];
  if (k.esCero()) throw new ErrorProporcion('division-entre-0', 'Un término 0 deja la x sin valor');
  const producto = o1.multiplicar(o2).simplificar();
  const resultado = producto.dividir(k).simplificar();
  const escrita = (t, idioma) => {
    const s = v.map(x => (x === null ? 'x' : t(x)));
    return `${s[0]}/${s[1]} = ${s[2]}/${s[3]}`;
  };
  const pasos = [
    linea(escrita),
    linea(t => `${coefX(k, t)} = ${t(o1)} · ${t(o2)}`),
    linea(t => `${coefX(k, t)} = ${t(producto)}`),
    ...(k.equals(UNO) ? [] : [linea(t => `x = ${t(producto)} ${DIV} ${t(k)}`), linea(t => `x = ${t(resultado)}`)]),
  ];
  return { resultado, pasos, exacto: deFraccion(resultado) !== null };
}

const parejas = tabla => tabla.map(([x, y]) => [x === null || x === undefined ? null : num(x), y === null || y === undefined ? null : num(y)]);

/** ¿Es de proporcionalidad directa? El cociente y : x es siempre el mismo (el precio por unidad). */
export function esTablaDirecta(tabla) {
  const t = parejas(tabla);
  const cocientes = t.map(([x, y]) => (x.esCero() ? null : y.dividir(x).simplificar()));
  const resultado = cocientes.every(q => q !== null && q.equals(cocientes[0]));
  const pasos = t.map(([x, y], i) => linea(tt => `${tt(y)} ${DIV} ${tt(x)} = ${cocientes[i] === null ? '—' : tt(cocientes[i])}`));
  return { resultado, cocientes, constante: resultado ? cocientes[0] : null, pasos };
}

/** ¿Es de proporcionalidad inversa? El producto x · y es siempre el mismo. */
export function esTablaInversa(tabla) {
  const t = parejas(tabla);
  const productos = t.map(([x, y]) => x.multiplicar(y).simplificar());
  const resultado = productos.every(p => p.equals(productos[0])) && !productos[0].esCero();
  const pasos = t.map(([x, y], i) => linea(tt => `${tt(x)} · ${tt(y)} = ${tt(productos[i])}`));
  return { resultado, productos, constante: resultado ? productos[0] : null, pasos };
}

/** La constante de una tabla completa (el cociente y : x en la directa, el producto en la inversa), o null. */
export function constante(tabla, tipo = 'directa') {
  return (tipo === 'inversa' ? esTablaInversa(tabla) : esTablaDirecta(tabla)).constante;
}

/** Rellena los huecos (null) de una tabla con la constante de las parejas completas. */
export function completarTabla(tabla, tipo = 'directa') {
  const t = parejas(tabla);
  const llenas = t.filter(([x, y]) => x !== null && y !== null);
  if (!llenas.length) throw new ErrorProporcion('tabla', 'Hace falta al menos una pareja completa');
  const [x0, y0] = llenas[0];
  const k = tipo === 'inversa' ? x0.multiplicar(y0).simplificar() : y0.dividir(x0).simplificar();
  const resultado = t.map(([x, y]) => {
    if (x !== null && y !== null) return [x, y];
    if (tipo === 'inversa') return x === null ? [k.dividir(y).simplificar(), y] : [x, k.dividir(x).simplificar()];
    return x === null ? [y.dividir(k).simplificar(), y] : [x, k.multiplicar(x).simplificar()];
  });
  const pasos = t.flatMap(([x, y], i) => {
    if (x !== null && y !== null) return [];
    const [rx, ry] = resultado[i];
    if (tipo === 'inversa') return [linea(tt => (x === null ? `${tt(k)} ${DIV} ${tt(y)} = ${tt(rx)}` : `${tt(k)} ${DIV} ${tt(x)} = ${tt(ry)}`))];
    return [linea(tt => (x === null ? `${tt(y)} ${DIV} ${tt(k)} = ${tt(rx)}` : `${tt(x)} · ${tt(k)} = ${tt(ry)}`))];
  });
  return { resultado, constante: k, pasos };
}

/** Pasa `c` a la unidad de `a` si son de la misma magnitud y distinta unidad (con su línea), o lo deja. */
function igualarUnidades(a, c) {
  if (a.unidad === c.unidad || a.unidad === null || c.unidad === null) return { c, pasos: [] };
  const r = cambiarUnidad(c, a.unidad);
  return { c: r.resultado, pasos: [linea(t => `${t(c)} = ${t(r.resultado)}`)] };
}

/**
 * Proporcionalidad directa: a ⟶ b, c ⟶ x (3 kg cuestan 4,50 €; ¿y 5 kg?). Los tres métodos dan lo mismo.
 * 'regla-de-tres' (la oficial, punto b de la 01 de la U7): con `tabla` { cabeceras, filas } para pintarla
 * con las magnitudes arriba, la proporción 3/5 = 4,50/x y los productos cruzados.
 */
export function proporcionDirecta({ a, b, c }, metodo = 'regla-de-tres') {
  const A = aCantidad(a), B = aCantidad(b);
  const ig = igualarUnidades(A, aCantidad(c));
  const C = ig.c;
  if (A.valor.esCero()) throw new ErrorProporcion('division-entre-0', 'a no puede ser 0');
  const k = B.valor.dividir(A.valor).simplificar();
  const x = k.multiplicar(C.valor).simplificar();
  const resultado = new Cantidad(x, B.unidad);
  let pasos;
  if (metodo === 'unidad') {
    const uno = new Cantidad(k, B.unidad);
    pasos = [linea(t => `${t(B)} ${DIV} ${t(A.valor)} = ${t(uno)}`), linea(t => `${t(C.valor)} · ${t(uno)} = ${t(resultado)}`)];
  } else if (metodo === 'constante') {
    pasos = [linea(t => `${t(B.valor)} ${DIV} ${t(A.valor)} = ${t(k)}`), linea(t => `${t(k)} · ${t(C.valor)} = ${t(x)}`)];
  } else if (metodo === 'regla-de-tres') {
    pasos = terminoQueFalta(A.valor, C.valor, B.valor, null).pasos;
  } else throw new ErrorProporcion('metodo', `Método desconocido: ${metodo}`);
  const tabla = { filas: [[A, B], [C, null]] };
  return { resultado, pasos: [...ig.pasos, ...pasos], metodo, constante: k, tabla, exacto: deFraccion(x) !== null };
}

/**
 * Proporcionalidad inversa: a ⟶ b, c ⟶ x (6 pintores, al mismo ritmo, tardan 10 días; ¿y 4?).
 * 'regla-de-tres': 6/4 = x/10 → 4x = 6 · 10 → … ; 'producto': 6 · 10 = 60 → 60 : 4 = 15. Con `comprobacion`.
 */
export function proporcionInversa({ a, b, c }, metodo = 'regla-de-tres') {
  const A = aCantidad(a), B = aCantidad(b);
  const ig = igualarUnidades(A, aCantidad(c));
  const C = ig.c;
  if (C.valor.esCero()) throw new ErrorProporcion('division-entre-0', 'c no puede ser 0');
  const producto = A.valor.multiplicar(B.valor).simplificar();
  const x = producto.dividir(C.valor).simplificar();
  const resultado = new Cantidad(x, B.unidad);
  let pasos;
  if (metodo === 'producto') {
    pasos = [linea(t => `${t(A.valor)} · ${t(B.valor)} = ${t(producto)}`), linea(t => `${t(producto)} ${DIV} ${t(C.valor)} = ${t(x)}`)];
  } else if (metodo === 'regla-de-tres') {
    pasos = terminoQueFalta(A.valor, C.valor, null, B.valor).pasos;
  } else throw new ErrorProporcion('metodo', `Método desconocido: ${metodo}`);
  const comprobacion = linea(t => `${t(A.valor)} · ${t(B.valor)} = ${t(C.valor)} · ${t(x)} = ${t(producto)}`);
  return { resultado, pasos: [...ig.pasos, ...pasos], metodo, constante: producto, comprobacion, tabla: { filas: [[A, B], [C, null]] }, exacto: deFraccion(x) !== null };
}

const porCiento = p => (p instanceof Cantidad ? (p.unidad === '%' ? p.valor : p.valor.multiplicar(100).simplificar()) : aValor(p));
const DE = { es: 'de', en: 'of' };

/** El p % de una cantidad, con el método pedido (ver la cabecera). p es el número (20) o una Cantidad en %. */
export function porcentajeDe(p, c, metodo = 'fraccion') {
  const P = porCiento(p), Cc = aCantidad(c);
  const pc = new Cantidad(P, '%');
  const r = Cc.valor.multiplicar(P).dividir(100).simplificar();
  const resultado = new Cantidad(r, Cc.unidad);
  let pasos;
  if (metodo === 'fraccion') {
    pasos = [linea((t, i) => `${t(pc)} ${DE[i]} ${t(Cc)} = ${t(P)}/100 · ${t(Cc)}`), linea(t => `${t(P)}/100 · ${t(Cc)} = ${t(resultado)}`)];
  } else if (metodo === 'decimal') {
    const dec = P.dividir(100).simplificar();
    const cifras = Math.max(2, deFraccion(dec).normalizar().k);
    pasos = [linea((t, i) => `${t(pc)} = ${numeroATexto(dec, i, { cifras })}`),
      linea((t, i) => `${numeroATexto(dec, i, { cifras })} · ${t(Cc)} = ${t(resultado)}`)];
  } else if (metodo === 'diez' && P.esEntera() && P.num % 5 === 0 && P.num > 0) {
    const diez = new Cantidad(Cc.valor.dividir(10), Cc.unidad);
    pasos = [linea((t, i) => `${t(new Cantidad(10, '%'))} ${DE[i]} ${t(Cc)} = ${t(Cc)} ${DIV} 10 = ${t(diez)}`)];
    if (P.num % 10 === 0) {
      if (P.num !== 10) pasos.push(linea(t => `${P.num / 10} · ${t(diez)} = ${t(resultado)}`));
    } else {
      const cinco = new Cantidad(diez.valor.dividir(2), Cc.unidad);
      pasos.push(linea((t, i) => `${t(new Cantidad(5, '%'))} ${DE[i]} ${t(Cc)} = ${t(diez)} ${DIV} 2 = ${t(cinco)}`));
      if (P.num !== 5) pasos.push(linea(t => `${P.num / 5} · ${t(cinco)} = ${t(resultado)}`));
    }
  } else if (metodo === 'uno' || metodo === 'diez') {
    const uno = new Cantidad(Cc.valor.dividir(100), Cc.unidad);
    pasos = [linea((t, i) => `${t(new Cantidad(1, '%'))} ${DE[i]} ${t(Cc)} = ${t(Cc)} ${DIV} 100 = ${t(uno)}`),
      linea(t => `${t(P)} · ${t(uno)} = ${t(resultado)}`)];
  } else if (metodo === 'regla-de-tres') {
    pasos = terminoQueFalta(100, P, Cc.valor, null).pasos;
  } else throw new ErrorProporcion('metodo', `Método desconocido: ${metodo}`);
  const usado = metodo === 'diez' && !(P.esEntera() && P.num % 5 === 0 && P.num > 0) ? 'uno' : metodo;
  return { resultado, pasos, metodo: usado, exacto: deFraccion(r) !== null };
}

/** ¿Qué porcentaje es parte de total? 30 de 150 → 30/150 = 1/5 = 20/100 = 20 %. null si no sale exacto. */
export function quePorcentaje(parte, total) {
  const Pa = aCantidad(parte), To = aCantidad(total);
  const pa = Pa.magnitud() === To.magnitud() ? Pa.valorBase() : Pa.valor;
  const to = Pa.magnitud() === To.magnitud() ? To.valorBase() : To.valor;
  if (to.esCero()) return null;
  const f = pa.dividir(to).simplificar();
  const p = f.multiplicar(100).simplificar();
  if (deFraccion(p) === null) return null;
  const resultado = new Cantidad(p, '%');
  const pasos = [];
  const enteros = Pa.valor.esEntera() && To.valor.esEntera() && Pa.unidad === To.unidad;
  const tal = `${Pa.valor.num}/${To.valor.num}`;
  if (enteros && 100 % To.valor.num === 0) {
    if (To.valor.num !== 100) pasos.push(linea(t => `${tal} = ${t(p)}/100`));
    pasos.push(linea(t => `${t(p)}/100 = ${t(resultado)}`));
  } else if (enteros && 100 % f.den === 0) {
    pasos.push(linea(() => `${tal} = ${textoFraccion(f)}`));
    if (f.den !== 100) pasos.push(linea(t => `${textoFraccion(f)} = ${t(p)}/100`));
    pasos.push(linea(t => `${t(p)}/100 = ${t(resultado)}`));
  } else {
    const dec = deFraccion(f);
    pasos.push(linea((t, i) => `${t(pa)} ${DIV} ${t(to)} = ${textoDecimal(dec, i)}`));
    pasos.push(linea((t, i) => `${textoDecimal(dec, i)} = ${t(resultado)}`));
  }
  return { resultado, pasos, fraccion: f };
}

/** El total cuando se sabe que el p % son `parte`: p/100 = parte/x → px = 100 · parte → … */
export function totalDesdePorcentaje(p, parte) {
  const P = porCiento(p), Pa = aCantidad(parte);
  if (P.esCero()) throw new ErrorProporcion('division-entre-0', 'El 0 % no da el total');
  const r = terminoQueFalta(P, 100, Pa.valor, null);
  return { resultado: new Cantidad(r.resultado, Pa.unidad), pasos: r.pasos, exacto: r.exacto };
}

/**
 * Un descuento o un aumento del p %: { cambio, final, factor, pasosDosPasos, pasosComplementario, pasosUnPaso }.
 * 45 € con un 20 % de descuento: 9,00 € y 36,00 €; o 100 % − 20 % = 80 %, 80 % de 45,00 € = 36,00 €; o 0,80 · 45,00 €.
 */
export function aplicarPorcentaje(c, p, tipo = 'descuento') {
  if (tipo !== 'descuento' && tipo !== 'aumento') throw new ErrorProporcion('tipo', `Tipo desconocido: ${tipo}`);
  const Cc = aCantidad(c), P = porCiento(p);
  const s = tipo === 'descuento' ? -1 : 1;
  const cambio = new Cantidad(Cc.valor.multiplicar(P).dividir(100), Cc.unidad);
  const final = new Cantidad(s < 0 ? Cc.valor.restar(cambio.valor) : Cc.valor.sumar(cambio.valor), Cc.unidad);
  const pf = s < 0 ? CIEN.restar(P).simplificar() : CIEN.sumar(P).simplificar();
  const factor = pf.dividir(100).simplificar();
  const cifras = Math.max(2, deFraccion(factor) ? deFraccion(factor).normalizar().k : 2);
  const pc = new Cantidad(P, '%'), pfc = new Cantidad(pf, '%'), cien = new Cantidad(100, '%');
  const op = s < 0 ? MENOS : '+';
  const pasosDosPasos = [linea((t, i) => `${t(pc)} ${DE[i]} ${t(Cc)} = ${t(cambio)}`), linea(t => `${t(Cc)} ${op} ${t(cambio)} = ${t(final)}`)];
  const pasosComplementario = [linea(t => `${t(cien)} ${op} ${t(pc)} = ${t(pfc)}`), linea((t, i) => `${t(pfc)} ${DE[i]} ${t(Cc)} = ${t(final)}`)];
  const pasosUnPaso = [linea(t => `${t(cien)} ${op} ${t(pc)} = ${t(pfc)}`),
    { es: `${numeroATexto(factor, 'es', { cifras })} · ${aTexto(Cc, 'es')} = ${aTexto(final, 'es')}`, en: `${numeroATexto(factor, 'en', { cifras })} · ${aTexto(Cc, 'en')} = ${aTexto(final, 'en')}` }];
  const exacto = Cc.unidad === '€' ? esExacta(final, 2) && esExacta(cambio, 2) : deFraccion(final.valor) !== null;
  return { cambio, final, factor, resultado: final, pasos: pasosDosPasos, pasosDosPasos, pasosComplementario, pasosUnPaso, exacto };
}

/** ¿Es exacta para su unidad? El dinero, al céntimo; un número suelto (personas, cosas), entero; lo demás, decimal exacto. */
function exactaParaSuUnidad(c) {
  if (c.unidad === '€') return esExacta(c, 2);
  if (c.unidad === null) return c.valor.esEntera();
  return deFraccion(c.valor) !== null;
}

/**
 * Reparto directamente proporcional: repartir(120 €, [2, 3]) → partes 48 € y 72 €, unaParte 24 €, totalPartes 5,
 * pasos (2 + 3 = 5; 120 € : 5 = 24 €; 2 · 24 € = 48 €; 3 · 24 € = 72 €) y comprobacion (48 € + 72 € = 120 €).
 * null si no sale exacto (al céntimo; con un número suelto —personas, cromos—, entero).
 */
export function repartir(total, razon) {
  const T = aCantidad(total);
  const r = razon.map(num);
  if (r.length < 2 || r.some(x => x.num <= 0)) throw new ErrorProporcion('razon', 'La razón necesita dos o más números positivos');
  const suma = r.reduce((s, x) => s.sumar(x), CERO).simplificar();
  const una = new Cantidad(T.valor.dividir(suma), T.unidad);
  const partes = r.map(x => new Cantidad(una.valor.multiplicar(x), T.unidad));
  if (!partes.every(exactaParaSuUnidad)) return null;
  const pasos = [
    linea(t => `${r.map(t).join(' + ')} = ${t(suma)}`),
    linea(t => `${t(T)} ${DIV} ${t(suma)} = ${t(una)}`),
    ...r.map((x, i) => linea(t => `${t(x)} · ${t(una)} = ${t(partes[i])}`)),
  ];
  const comprobacion = linea(t => `${partes.map(t).join(' + ')} = ${t(T)}`);
  return { resultado: partes, partes, unaParte: una, totalPartes: suma, pasos, comprobacion };
}

/** Del plano (o el mapa, o la maqueta) a la realidad: 3 cm a 1 : 50 000 → 150 000 cm → 1,5 km. */
export function realidad(enPlano, n, unidad = null) {
  const P = aCantidad(enPlano), N = aValor(n);
  const real = new Cantidad(P.valor.multiplicar(N), P.unidad);
  const pasos = [linea(t => `${t(P)} · ${t(N)} = ${t(real)}`)];
  if (unidad === null || unidad === P.unidad) return { resultado: real, pasos };
  const r = cambiarUnidad(real, unidad);
  return { resultado: r.resultado, pasos: [...pasos, linea(t => `${t(real)} = ${t(r.resultado)}`)] };
}

/** De la realidad al plano: 4,5 m a 1 : 50 → 450 cm → 9 cm. */
export function enElPlano(real, n, unidad = 'cm') {
  const R = aCantidad(real), N = aValor(n);
  const pasos = [];
  let r = R;
  if (R.unidad !== unidad && R.unidad !== null) {
    r = cambiarUnidad(R, unidad).resultado;
    pasos.push(linea(t => `${t(R)} = ${t(r)}`));
  }
  const resultado = new Cantidad(r.valor.dividir(N), r.unidad);
  pasos.push(linea(t => `${t(r)} ${DIV} ${t(N)} = ${t(resultado)}`));
  return { resultado, pasos };
}

/** La escala de un plano: 6 cm son 30 km → 3 000 000 cm : 6 cm = 500 000 → 1 : 500 000. null si no sale un natural. */
export function hallarEscala(enPlano, real) {
  const P = aCantidad(enPlano), R = aCantidad(real);
  const pasos = [];
  let r = R;
  if (R.unidad !== P.unidad) {
    r = cambiarUnidad(R, P.unidad).resultado;
    pasos.push(linea(t => `${t(R)} = ${t(r)}`));
  }
  const n = r.valor.dividir(P.valor).simplificar();
  if (!n.esEntera() || n.num < 1) return null;
  pasos.push(linea(t => `${t(r)} ${DIV} ${t(P)} = ${t(n)}`));
  pasos.push(linea(() => escalaATexto(n.num)));
  return { resultado: n.num, pasos };
}

export const escala = Object.freeze({ realidad, enElPlano, hallar: hallarEscala, aTexto: escalaATexto });

const log10Exacto = f => {
  // f es 10^k (k entero, positivo o negativo) o no: devuelve k o null.
  let k = 0, x = f.simplificar();
  if (x.num === 1) { while (x.den % 10 === 0) { x = F(x.num, x.den / 10); k--; } return x.den === 1 ? k : null; }
  if (x.den !== 1) return null;
  while (x.num % 10 === 0) { x = F(x.num / 10); k++; }
  return x.num === 1 ? k : null;
};

/**
 * Cambio de unidad con sus pasos: 3,5 km → m: «De km a m hay 3 saltos hacia abajo: se multiplica por 1000»,
 * 3,5 · 1000 = 3500, 3,5 km = 3500 m. El tiempo, con el 60. { resultado, pasos, factor, multiplica, saltos }.
 */
export function cambiarUnidad(c, unidad) {
  const Cc = aCantidad(c);
  const destino = infoUnidad(unidad);
  if (Cc.unidad === null || UNIDADES_MEDIDA[Cc.unidad].magnitud !== destino.magnitud) throw new ErrorProporcion('magnitud', `No se pasa de ${Cc.unidad} a ${unidad}`);
  const origen = UNIDADES_MEDIDA[Cc.unidad];
  const factor = origen.factor.dividir(destino.factor).simplificar();
  const resultado = new Cantidad(Cc.valor.multiplicar(factor), unidad);
  if (Cc.unidad === unidad) return { resultado, pasos: [], factor, multiplica: true, saltos: 0 };
  const multiplica = comparar(factor, UNO) > 0;
  const por = multiplica ? factor : factor.inversa();
  const k = log10Exacto(por);
  const sup = destino.magnitud === 'superficie';
  const saltos = k === null ? null : sup ? k / 2 : k;
  const pasos = [];
  const enEscalera = ESCALERAS[destino.magnitud]?.includes(Cc.unidad) && ESCALERAS[destino.magnitud].includes(unidad);
  if (saltos !== null && Number.isInteger(saltos) && enEscalera) {
    pasos.push({
      es: `De ${Cc.unidad} a ${unidad} hay ${saltos} ${saltos === 1 ? 'salto' : 'saltos'} hacia ${multiplica ? 'abajo' : 'arriba'}: se ${multiplica ? 'multiplica' : 'divide'} por ${numeroATexto(por, 'es')}`,
      en: `From ${Cc.unidad} to ${unidad} there ${saltos === 1 ? 'is 1 step' : `are ${saltos} steps`} ${multiplica ? 'down' : 'up'}: ${multiplica ? 'multiply' : 'divide'} by ${numeroATexto(por, 'en')}`,
    });
  } else {
    pasos.push({
      es: `1 ${multiplica ? Cc.unidad : unidad} = ${numeroATexto(por, 'es')} ${multiplica ? unidad : Cc.unidad}: se ${multiplica ? 'multiplica' : 'divide'} por ${numeroATexto(por, 'es')}`,
      en: `1 ${multiplica ? Cc.unidad : unidad} = ${numeroATexto(por, 'en')} ${multiplica ? unidad : Cc.unidad}: ${multiplica ? 'multiply' : 'divide'} by ${numeroATexto(por, 'en')}`,
    });
  }
  pasos.push(linea(t => `${t(Cc.valor)} ${multiplica ? '·' : DIV} ${t(por)} = ${t(resultado.valor)}`));
  pasos.push(linea(t => `${t(Cc)} = ${t(resultado)}`));
  return { resultado, pasos, factor, multiplica, saltos };
}

const COMPLEJO_POR_DEFECTO = { tiempo: ['h', 'min', 's'], longitud: ['km', 'm'], masa: ['kg', 'g'], capacidad: ['L', 'mL'] };

/** De incomplejo a complejo: 1,5 h → [1 h, 30 min]; 150 min → [2 h, 30 min]; 3250 m → [3 km, 250 m]. Sin las partes 0. */
export function aComplejo(c, unidades = null) {
  const Cc = aCantidad(c);
  const lista = unidades ?? COMPLEJO_POR_DEFECTO[Cc.magnitud()];
  if (!lista) throw new ErrorProporcion('magnitud', `Sin complejo por defecto para ${Cc.magnitud()}`);
  let resto = Cc.valorBase();
  const partes = [];
  lista.forEach((u, i) => {
    const f = infoUnidad(u).factor;
    const enU = resto.dividir(f).simplificar();
    const q = i === lista.length - 1 ? enU : F(Math.floor(enU.num / enU.den));
    if (!q.esCero()) partes.push(new Cantidad(q, u));
    resto = resto.restar(q.multiplicar(f)).simplificar();
  });
  const pasos = [];
  const mayor = UNIDADES_MEDIDA[lista[0]];
  if (Cc.unidad === lista[0]) {
    let r = Cc.valor.restar(F(Math.floor(Cc.valor.num / Cc.valor.den))).simplificar();
    for (let i = 1; i < lista.length && !r.esCero(); i++) {
      const ant = lista[i - 1], u = lista[i];
      const k = infoUnidad(ant).factor.dividir(infoUnidad(u).factor).simplificar();
      const enU = r.multiplicar(k).simplificar();
      pasos.push(linea(t => `${t(new Cantidad(r, ant))} · ${t(k)} = ${t(new Cantidad(enU, u))}`));
      r = enU.restar(F(Math.floor(enU.num / enU.den))).simplificar();
    }
  } else if (comparar(UNIDADES_MEDIDA[Cc.unidad].factor, mayor.factor) < 0) {
    let v = Cc;
    for (let i = lista.indexOf(Cc.unidad) - 1; i >= 0; i--) {
      const u = lista[i], de = v.unidad;
      const k = infoUnidad(u).factor.dividir(infoUnidad(de).factor).simplificar();
      const q = F(Math.floor(v.valor.num / (v.valor.den * k.num)));
      const sobra = v.valor.restar(q.multiplicar(k)).simplificar();
      pasos.push(linea(
        t => `${t(v.valor)} ${DIV} ${t(k)} = ${t(q)}, y sobran ${t(new Cantidad(sobra, de))}`,
        t => `${t(v.valor)} ${DIV} ${t(k)} = ${t(q)}, remainder ${t(new Cantidad(sobra, de))}`));
      v = new Cantidad(q, u);
      if (q.esCero()) break;
    }
  }
  pasos.push({ es: `${aTexto(Cc, 'es')} = ${complejoATexto(partes, 'es')}`, en: `${aTexto(Cc, 'en')} = ${complejoATexto(partes, 'en')}` });
  return { resultado: partes, partes, pasos };
}

/** De complejo a incomplejo: [3 km, 250 m] → 3250 m (cada parte pasada a la unidad y sumadas). */
export function aIncomplejo(partes, unidad) {
  const ps = partes.map(p => aCantidad(p));
  const pasadas = ps.map(p => (p.unidad === unidad ? { resultado: p } : cambiarUnidad(p, unidad)));
  const total = pasadas.reduce((s, r) => s.sumar(r.resultado.valor), CERO).simplificar();
  const resultado = new Cantidad(total, unidad);
  const pasos = [
    ...ps.flatMap((p, i) => (p.unidad === unidad ? [] : [linea(t => `${t(p)} = ${t(pasadas[i].resultado)}`)])),
    linea(t => `${pasadas.map(r => t(r.resultado)).join(' + ')} = ${t(resultado)}`),
  ];
  return { resultado, pasos };
}

/** Redondear al más cercano con `cifras` decimales, la mitad hacia arriba (en valor absoluto). Fraccion o Cantidad. */
export function redondear(x, cifras = 0) {
  if (x instanceof Cantidad) return new Cantidad(redondear(x.valor, cifras), x.unidad);
  const f = aValor(x);
  const p = pot10(cifras);
  const a = Math.abs(f.num) * p;
  const q = Math.floor((2 * a + f.den) / (2 * f.den));
  return F(Math.sign(f.num) * q, p);
}

// ─── Errores típicos ───────────────────────────────────────────────────────────

/**
 * El valor equivocado si sirve de distractor; null si es lo mismo que el bueno, no es exacto o no es positivo.
 * Con { fraccion: true } (una razón, que se escribe como fracción), 4/3 vale aunque no sea un decimal exacto.
 */
function siSirve(mal, bien, { fraccion: esRazon = false } = {}) {
  if (mal === null || mal === undefined) return null;
  const lista = Array.isArray(mal) ? mal : [mal];
  if (lista.some(m => !(m instanceof Cantidad) || (!esRazon && deFraccion(m.valor) === null) || m.valor.num <= 0)) return null;
  return mismoValor(mal, bien) ? null : mal;
}
const Q = (v, unidad) => new Cantidad(v, unidad);
const conUnidad = (x, de) => Q(num(x), de instanceof Cantidad ? de.unidad : null);

/** 2 cuestan 5 €; 4 cuestan 5 + (4 − 2) = 7 € (en vez de 10 €). */
export function razonarSumando(a, b, c) {
  const A = aCantidad(a), B = aCantidad(b), C = igualarUnidades(A, aCantidad(c)).c;
  const bien = proporcionDirecta({ a: A, b: B, c: C }).resultado;
  return siSirve(Q(B.valor.sumar(C.valor.restar(A.valor)), B.unidad), bien);
}
/** 4/3 por 3/4. */
export function invertirRazon(a, b) { return siSirve(Q(num(b).dividir(num(a))), Q(num(a).dividir(num(b))), { fraccion: true }); }
/** Chicos y chicas en la razón 2 a 3: «2/3 de la clase son chicos» (es 2/5). */
export function parteParteComoParteTodo(a, b) { return siSirve(Q(num(a).dividir(num(b))), Q(num(a).dividir(num(a).sumar(num(b)))), { fraccion: true }); }
/** Al revés: la razón de chicos a chicas como 2/5 (es 2/3). */
export function parteTodoComoParteParte(a, b) { return siSirve(Q(num(a).dividir(num(a).sumar(num(b)))), Q(num(a).dividir(num(b))), { fraccion: true }); }
/** a/b = c/x resuelto multiplicando en línea: x = a · c : b (15/20 = 12/x → 9, en vez de 16). */
export function productosEnLinea(a, b, c) {
  const bien = num(b).multiplicar(num(c)).dividir(num(a));
  return siSirve(conUnidad(num(a).multiplicar(num(c)).dividir(num(b)), c), conUnidad(bien, c));
}
/** Una inversa resuelta como directa: 6 obreros, 10 días → 3 obreros, 5 días (son 20). */
export function directaEnInversa(a, b, c) {
  const A = aCantidad(a), B = aCantidad(b), C = igualarUnidades(A, aCantidad(c)).c;
  return siSirve(Q(B.valor.multiplicar(C.valor).dividir(A.valor), B.unidad), proporcionInversa({ a: A, b: B, c: C }).resultado);
}
/** Una directa resuelta como inversa: 2 kg, 3 € → 4 kg, 1,50 € (son 6 €). */
export function inversaEnDirecta(a, b, c) {
  const A = aCantidad(a), B = aCantidad(b), C = igualarUnidades(A, aCantidad(c)).c;
  return siSirve(Q(A.valor.multiplicar(B.valor).dividir(C.valor), B.unidad), proporcionDirecta({ a: A, b: B, c: C }).resultado);
}
/** Dar por proporcional lo que no lo es: el taxi de 8,00 € por 5 km → «16,00 € por 10 km» (son 13,00 €). */
export function noProporcionalComoProporcional(x1, y1, x2, y2) {
  const Y1 = aCantidad(y1);
  return siSirve(Q(Y1.valor.multiplicar(num(x2)).dividir(num(x1)), Y1.unidad), conUnidad(y2, Y1));
}
/** El 20 % de 50 como 50 : 20 = 2,5 (es 10). */
export function dividirEntreElPorcentaje(p, c) {
  const Cc = aCantidad(c), P = porCiento(p);
  return siSirve(Q(Cc.valor.dividir(P), Cc.unidad), porcentajeDe(P, Cc).resultado);
}
const porcentajeMal = (p, c, divisor) => {
  const P = porCiento(p);
  if (c === null || c === undefined) return siSirve(Q(P.dividir(divisor)), Q(P.dividir(100)));
  const Cc = aCantidad(c);
  return siSirve(Q(Cc.valor.multiplicar(P).dividir(divisor), Cc.unidad), porcentajeDe(P, Cc).resultado);
};
/** 20 % = 0,02 (sin c, el decimal; con c, el porcentaje de c calculado así). */
export const porcentajeEntreMil = (p, c = null) => porcentajeMal(p, c, 1000);
/** 5 % = 0,5; 20 % = 2. */
export const porcentajeEntreDiez = (p, c = null) => porcentajeMal(p, c, 10);
/** 20 % = 20: el 20 % de 150 como 20 · 150. */
export const porcentajeSinDividir = (p, c = null) => porcentajeMal(p, c, 1);
/** Rebajar un 20 % como restar 20: 50 − 20 = 30 (son 40). */
export function restarElPorcentajeComoNumero(c, p) {
  const Cc = aCantidad(c), P = porCiento(p);
  return siSirve(Q(Cc.valor.restar(P), Cc.unidad), aplicarPorcentaje(Cc, P, 'descuento').final);
}
/** Subir un 20 % como sumar 20: 50 + 20 = 70 (son 60). */
export function sumarElPorcentajeComoNumero(c, p) {
  const Cc = aCantidad(c), P = porCiento(p);
  return siSirve(Q(Cc.valor.sumar(P), Cc.unidad), aplicarPorcentaje(Cc, P, 'aumento').final);
}
/** Piden el precio final y se da el descuento: 45 € con un 20 % → 9 € (se pagan 36,00 €). Con 'aumento', la subida por el precio final. */
export function descuentoPorPrecioFinal(c, p, tipo = 'descuento') {
  const r = aplicarPorcentaje(c, p, tipo);
  return siSirve(r.cambio, r.final);
}
/** Piden el descuento y se da el precio final: 36,00 € por 9,00 €. */
export function precioFinalPorDescuento(c, p, tipo = 'descuento') {
  const r = aplicarPorcentaje(c, p, tipo);
  return siSirve(r.final, r.cambio);
}
/** Hacer un descuento donde va un aumento (o al revés): 50 € más el 20 % → 40 € (son 60 €). */
export function aumentoPorDescuento(c, p, tipo = 'aumento') {
  const otro = tipo === 'aumento' ? 'descuento' : 'aumento';
  return siSirve(aplicarPorcentaje(c, p, otro).final, aplicarPorcentaje(c, p, tipo).final);
}
/** «Sube un 20 % y baja un 20 %: se queda igual»: 100 € → 120 € → 96 €, no 100 €. */
export function subeYBajaSeQuedaIgual(c, p) {
  const Cc = aCantidad(c);
  const bien = aplicarPorcentaje(aplicarPorcentaje(Cc, p, 'aumento').final, p, 'descuento').final;
  return siSirve(Cc, bien);
}
/** Para hallar el total, el porcentaje del dato: el 20 % son 30 → 6 (son 150). */
export function porcentajeDelDato(p, parte) {
  const Pa = aCantidad(parte), P = porCiento(p);
  return siSirve(Q(Pa.valor.multiplicar(P).dividir(100), Pa.unidad), totalDesdePorcentaje(P, Pa).resultado);
}
/** «¿Qué porcentaje es 30 de 150?» dividiendo al revés: 150 : 30 → 500 % (es el 20 %). */
export function porcentajeAlReves(parte, total) {
  const bien = quePorcentaje(parte, total);
  const mal = quePorcentaje(total, parte);
  return bien && mal ? siSirve(mal.resultado, bien.resultado) : null;
}
/** Dejar la fracción sin pasar a tanto por ciento: 30 de 150 → «0,2 %» (es el 20 %). En un campo de %, escribir 0,2. */
export function fraccionSinPasarAPorcentaje(parte, total) {
  const bien = quePorcentaje(parte, total);
  return bien ? siSirve(Q(bien.fraccion, '%'), bien.resultado) : null;
}
/** Repartir a partes iguales: 120 € en la razón 2 : 3 → 60 € y 60 € (son 48 € y 72 €). */
export function repartoAPartesIguales(total, razon) {
  const T = aCantidad(total), bien = repartir(T, razon);
  if (!bien) return null;
  const iguales = razon.map(() => Q(T.valor.dividir(razon.length), T.unidad));
  return iguales.every(exactaParaSuUnidad) ? siSirve(iguales, bien.partes) : null;
}
/** Dividir el total entre cada término: 120 € en la razón 2 : 3 → 60 € y 40 €. */
export function repartoSinSumarLasPartes(total, razon) {
  const T = aCantidad(total), bien = repartir(T, razon);
  if (!bien) return null;
  const mal = razon.map(r => Q(T.valor.dividir(num(r)), T.unidad));
  return mal.every(exactaParaSuUnidad) ? siSirve(mal, bien.partes) : null;
}
/** Dividir entre la escala cuando toca multiplicar (o al revés). sentido 'realidad' (del plano) o 'plano'. */
export function escalaAlReves(medida, n, sentido = 'realidad', unidad = null) {
  const M = aCantidad(medida), N = aValor(n);
  if (sentido === 'realidad') {
    const bien = realidad(M, N, unidad).resultado;
    const mal = Q(M.valor.dividir(N), M.unidad);
    return siSirve(unidad ? mal.enUnidad(unidad) : mal, bien);
  }
  const u = unidad ?? 'cm';
  const bien = enElPlano(M, N, u).resultado;
  const enU = M.unidad === u ? M : cambiarUnidad(M, u).resultado;
  return siSirve(Q(enU.valor.multiplicar(N), u), bien);
}
/** Olvidar el cambio de unidad: 3 cm a 1 : 50 000 → «150 000 km» (es 1,5 km); 4,5 m a 1 : 50 → «0,09 cm» (son 9 cm). */
export function escalaSinCambioDeUnidad(medida, n, sentido = 'realidad', unidad = null) {
  const M = aCantidad(medida), N = aValor(n);
  if (sentido === 'realidad') {
    if (!unidad || unidad === M.unidad) return null;
    return siSirve(Q(M.valor.multiplicar(N), unidad), realidad(M, N, unidad).resultado);
  }
  const u = unidad ?? 'cm';
  if (M.unidad === u) return null;
  return siSirve(Q(M.valor.dividir(N), u), enElPlano(M, N, u).resultado);
}
/** En un cambio de unidad, multiplicar cuando toca dividir (o al revés): 3500 m → «3 500 000 km». */
export function subirPorBajar(c, unidad) {
  const r = cambiarUnidad(c, unidad);
  if (r.factor.equals(UNO)) return null;
  return siSirve(Q(aCantidad(c).valor.dividir(r.factor), unidad), r.resultado);
}
/** En superficie, saltos de 10 en vez de 100: 3 m² → «30 dm²» (son 300 dm²). */
export function superficiePorDiez(c, unidad) {
  const Cc = aCantidad(c);
  if (Cc.magnitud() !== 'superficie') return null;
  const r = cambiarUnidad(Cc, unidad);
  const k = log10Exacto(r.multiplica ? r.factor : r.factor.inversa());
  if (k === null || k % 2 !== 0 || k === 0) return null;
  const diez = F(pot10(k / 2));
  return siSirve(Q(r.multiplica ? Cc.valor.multiplicar(diez) : Cc.valor.dividir(diez), unidad), r.resultado);
}
/** 1,5 h leído como 1 h 50 min (son 1 h 30 min). Devuelve los minutos. */
export function horaDecimalComoMinutos(horas) {
  const H = aCantidad(horas, 'h');
  const h = H.unidad === 'h' ? H.valor : H.enUnidad('h').valor;
  const entera = F(Math.floor(h.num / h.den));
  const parte = h.restar(entera).simplificar().multiplicar(100).simplificar();
  if (parte.esCero() || !parte.esEntera()) return null;
  return siSirve(Q(entera.multiplicar(60).sumar(parte), 'min'), Q(h.multiplicar(60), 'min'));
}
/** 1 h 30 min escrito como 1,30 h (es 1,5 h). */
export function minutosComoHoraDecimal(horas, minutos) {
  const h = aValor(horas), m = aValor(minutos);
  if (m.esCero()) return null;
  return siSirve(Q(h.sumar(m.dividir(100)), 'h'), Q(h.sumar(m.dividir(60)), 'h'));
}
/** Contestar otra cosa de las que salen en la cuenta (el precio de 1 kg cuando piden el de 5; la parte del otro). */
export function contestarOtraCosa(otro, correcta) { return siSirve(Array.isArray(otro) ? otro.map(o => aCantidad(o)) : aCantidad(otro), correcta); }

/** Una entrada de la tabla. Un resultado que se sale de los enteros seguros (3 km² en mm², al revés) no es una opción: null. */
const E = (fn, devuelve, ejemplo, es, en) => ({
  fn: (...args) => { try { return fn(...args); } catch (e) { if (e.codigo === 'no-entero') return null; throw e; } },
  devuelve, ejemplo, nombre: { es, en }, es, en,
});

export const ERRORES_TIPICOS = Object.freeze({
  'razonar-sumando': E(razonarSumando, 'cantidad', '2 cuestan 5 € → 4 cuestan 7 € (son 10 €)',
    'Ha sumado en vez de multiplicar: al doble le corresponde el doble', 'Added instead of multiplying: twice as much means twice the price'),
  'invertir-razon': E(invertirRazon, 'cantidad', '3 a 4 escrito como 4/3',
    'Ha escrito la razón al revés', 'Wrote the ratio the wrong way round'),
  'parte-parte-como-parte-todo': E(parteParteComoParteTodo, 'cantidad', 'chicos y chicas 2 a 3 → «2/3 de la clase» (son 2/5)',
    'Ha tomado una parte con la otra como si fuera una parte del total', 'Compared one part with the other instead of with the whole'),
  'parte-todo-como-parte-parte': E(parteTodoComoParteParte, 'cantidad', 'chicos a chicas, 2 a 3, escrito como 2/5 (es 2/3)',
    'Ha comparado con el total en vez de con la otra parte', 'Compared with the whole instead of with the other part'),
  'productos-en-linea': E(productosEnLinea, 'cantidad', '15/20 = 12/x → x = 15 · 12 : 20 = 9 (es 16)',
    'Ha multiplicado en línea en vez de en cruz', 'Multiplied across instead of cross-multiplying'),
  'directa-en-inversa': E(directaEnInversa, 'cantidad', '6 obreros, 10 días → 3 obreros, 5 días (son 20)',
    'La ha resuelto como directa, pero es inversa: con menos obreros se tarda más', 'Solved it as direct, but it is inverse: fewer workers take longer'),
  'inversa-en-directa': E(inversaEnDirecta, 'cantidad', '2 kg, 3 € → 4 kg, 1,50 € (son 6 €)',
    'La ha resuelto como inversa, pero es directa: al doble, el doble', 'Solved it as inverse, but it is direct: twice as many, twice as much'),
  'no-proporcional-como-proporcional': E(noProporcionalComoProporcional, 'cantidad', 'taxi: 5 km, 8,00 € → 10 km, 16,00 € (son 13,00 €)',
    'Lo ha tratado como proporcional y no lo es', 'Treated it as proportional, but it is not'),
  'dividir-entre-el-porcentaje': E(dividirEntreElPorcentaje, 'cantidad', 'el 20 % de 50 → 50 : 20 = 2,5 (es 10)',
    'Ha dividido entre el porcentaje: el 20 % es 20 de cada 100', 'Divided by the percentage: 20% means 20 out of every 100'),
  'porcentaje-entre-mil': E(porcentajeEntreMil, 'cantidad', '20 % = 0,02 (es 0,2)',
    'Ha dividido entre 1000: el tanto por ciento es entre 100', 'Divided by 1000: per cent means divided by 100'),
  'porcentaje-entre-diez': E(porcentajeEntreDiez, 'cantidad', '5 % = 0,5 (es 0,05)',
    'Ha dividido entre 10: el tanto por ciento es entre 100', 'Divided by 10: per cent means divided by 100'),
  'porcentaje-sin-dividir': E(porcentajeSinDividir, 'cantidad', 'el 20 % de 150 → 20 · 150 = 3000 (es 30)',
    'Ha multiplicado por el porcentaje sin dividir entre 100', 'Multiplied by the percentage without dividing by 100'),
  'restar-el-porcentaje-como-numero': E(restarElPorcentajeComoNumero, 'cantidad', '50 € con un 20 % de descuento → 50 − 20 = 30 € (son 40 €)',
    'Ha restado el número del porcentaje en vez del porcentaje de la cantidad', 'Took away the percentage number instead of the percentage of the amount'),
  'sumar-el-porcentaje-como-numero': E(sumarElPorcentajeComoNumero, 'cantidad', '50 € más un 20 % → 50 + 20 = 70 € (son 60 €)',
    'Ha sumado el número del porcentaje en vez del porcentaje de la cantidad', 'Added the percentage number instead of the percentage of the amount'),
  'descuento-por-precio-final': E(descuentoPorPrecioFinal, 'cantidad', '45 € con un 20 % → 9 € (se pagan 36,00 €)',
    'Ha dado el descuento, pero piden lo que se paga', 'Gave the discount, but the question asks for the price you pay'),
  'precio-final-por-descuento': E(precioFinalPorDescuento, 'cantidad', '45 € con un 20 % → 36 € (el descuento es 9,00 €)',
    'Ha dado el precio final, pero piden el descuento', 'Gave the final price, but the question asks for the discount'),
  'aumento-por-descuento': E(aumentoPorDescuento, 'cantidad', '50 € más el 20 % → 40 € (son 60 €)',
    'Ha restado donde había que sumar (o al revés)', 'Took away where it should add (or the other way round)'),
  'sube-y-baja-se-queda-igual': E(subeYBajaSeQuedaIgual, 'cantidad', '100 € sube un 20 % y baja un 20 % → «100 €» (son 96 €)',
    'Bajar un 20 % se calcula sobre el precio ya subido: no vuelve al de antes', 'The 20% decrease is worked out on the new, higher price: it does not go back to the start'),
  'porcentaje-del-dato': E(porcentajeDelDato, 'cantidad', 'el 20 % son 30 → 6 (son 150)',
    'Ha calculado el porcentaje del dato, pero el dato ya es la parte', 'Worked out the percentage of the number given, but that number is already the part'),
  'porcentaje-al-reves': E(porcentajeAlReves, 'cantidad', '30 de 150 → 150 : 30 → 500 % (es el 20 %)',
    'Ha dividido al revés: es la parte entre el total', 'Divided the wrong way round: it is the part divided by the whole'),
  'fraccion-sin-pasar-a-porcentaje': E(fraccionSinPasarAPorcentaje, 'cantidad', '30 de 150 → «0,2 %» (es el 20 %)',
    'Ha dejado el decimal sin pasarlo a tanto por ciento', 'Left the decimal without turning it into a percentage'),
  'reparto-a-partes-iguales': E(repartoAPartesIguales, 'lista', '120 € en la razón 2 : 3 → 60 € y 60 € (son 48 € y 72 €)',
    'Ha repartido a partes iguales, sin la razón', 'Shared it equally, ignoring the ratio'),
  'reparto-sin-sumar-las-partes': E(repartoSinSumarLasPartes, 'lista', '120 € en la razón 2 : 3 → 60 € y 40 €',
    'Ha dividido el total entre cada número sin sumar antes las partes', 'Divided the total by each number without adding the parts first'),
  'escala-al-reves': E(escalaAlReves, 'cantidad', '3 cm a 1 : 50 000 → 3 : 50 000',
    'Ha dividido donde había que multiplicar (o al revés)', 'Divided where it should multiply (or the other way round)'),
  'escala-sin-cambio-de-unidad': E(escalaSinCambioDeUnidad, 'cantidad', '3 cm a 1 : 50 000 → «150 000 km» (es 1,5 km)',
    'Ha olvidado cambiar de unidad: la escala va en la misma unidad', 'Forgot to change the unit: both numbers of a scale are in the same unit'),
  'subir-por-bajar': E(subirPorBajar, 'cantidad', '3500 m → «3 500 000 km» (son 3,5 km)',
    'Ha multiplicado donde había que dividir (o al revés)', 'Multiplied where it should divide (or the other way round)'),
  'superficie-por-diez': E(superficiePorDiez, 'cantidad', '3 m² → «30 dm²» (son 300 dm²)',
    'En superficie cada salto es por 100, no por 10', 'For area units each step means multiplying by 100, not by 10'),
  'hora-decimal-como-minutos': E(horaDecimalComoMinutos, 'cantidad', '1,5 h → «1 h 50 min» (es 1 h 30 min)',
    'Ha leído los decimales de la hora como minutos: media hora son 30 minutos', 'Read the decimal part of the hour as minutes: half an hour is 30 minutes'),
  'minutos-como-hora-decimal': E(minutosComoHoraDecimal, 'cantidad', '1 h 30 min → «1,30 h» (es 1,5 h)',
    'Ha escrito los minutos como decimales de la hora: una hora tiene 60 minutos, no 100', 'Wrote the minutes as decimals of an hour: an hour has 60 minutes, not 100'),
  'contestar-otra-cosa': E(contestarOtraCosa, 'cantidad', 'piden el precio de 5 kg y contesta el de 1 kg',
    'Ha contestado otra cosa de la cuenta, no lo que se pregunta', 'Answered a different number from the working, not what was asked'),
});

/** Lo que nunca es distractor ni fallo (reglas 1, 4 y 5 de la unidad). */
export const NO_ES_ERROR = Object.freeze({
  'otra-escritura': { es: 'Escribir la misma cantidad de otra forma cuando no se pide la forma (0,2 o 1/5 por 20 %)', en: 'Writing the same amount another way when the form is not asked for (0.2 or 1/5 for 20%)' },
  'otro-metodo': { es: 'Resolver con otro método (reducción a la unidad, regla de tres, la constante, productos cruzados)', en: 'Using another method (unit rate, rule of three, the constant, cross-multiplying)' },
  percent: { es: 'Escribir percent en vez de per cent', en: 'Writing percent instead of per cent' },
  'dinero-sin-ceros': { es: 'Escribir 12 € en vez de 12,00 €', en: 'Writing €12 instead of €12.00' },
  'razon-sin-simplificar': { es: 'Dar la razón sin simplificar cuando no se pide la más sencilla', en: 'Giving the ratio unsimplified when the simplest form is not asked for' },
  'otra-unidad': { es: 'Dar la misma cantidad en otra unidad cuando no se pide la unidad (2500 m por 2,5 km)', en: 'Giving the same amount in another unit when the unit is not asked for (2500 m for 2.5 km)' },
  'espacio-del-porcentaje': { es: 'Escribir 20% pegado o 20 % con espacio', en: 'Writing 20% or 20 %' },
  'coma-o-punto': { es: 'Teclear la coma o el punto decimal', en: 'Typing a decimal comma or a decimal point' },
});

/**
 * [{ valor, error }] de los candidatos [[id, …args], …] que sirven: sin null, sin lo que valga lo mismo que la
 * correcta y sin dos que valgan lo mismo entre sí (se queda el primero), por mismoValor. El orden es el de los
 * candidatos: barájalos antes si son más de los que caben (trampa del motor: construirOpciones toma los primeros).
 */
export function distractores(candidatos, correcta) {
  const vistos = [correcta];
  const salida = [];
  for (const [id, ...args] of candidatos) {
    const e = ERRORES_TIPICOS[id];
    if (!e) throw new Error(`Error típico desconocido: ${id}`);
    const valor = e.fn(...args);
    if (valor === null) continue;
    if (vistos.some(v => mismoValor(v, valor))) continue;
    vistos.push(valor);
    salida.push({ valor, error: id });
  }
  return salida;
}

// ─── Huella ────────────────────────────────────────────────────────────────────

/** FNV-1a de 32 bits en base 36, la de `equivalentes/logica.js` y `algebra.js`. */
export const huella = s => { let h = 0x811c9dc5; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };

const claveNumero = v => {
  if (v === null || v === undefined) return 'x';
  if (Array.isArray(v)) return `[${v.map(claveNumero).join(',')}]`;
  const c = aCantidad(v);
  const f = c.unidad === '%' ? c.valorBase() : c.valor;
  return `${f.num}/${f.den}`;
};

/**
 * El caso normalizado por valor (regla 9): el tipo y los datos como fracciones irreducibles, sin unidades
 * (salvo el %, que pasa a p/100), en el orden dado. Con tipo 'proporcion' y datos [a, b, c, d] (la x, null),
 * las dos razones se ordenan: 3/4 = x/20 y x/20 = 3/4 son el mismo caso. Un objeto de datos, por sus claves.
 */
export function normalizarCaso(tipo, datos) {
  let lista = Array.isArray(datos) ? datos.map(claveNumero) : Object.keys(datos).sort().map(k => `${k}=${claveNumero(datos[k])}`);
  if (tipo === 'proporcion' && lista.length === 4) {
    const r = [`${lista[0]}:${lista[1]}`, `${lista[2]}:${lista[3]}`].sort();
    lista = r;
  }
  return `${tipo}|${lista.join('|')}`;
}

/** La huella del caso normalizado: «el 20 % de 150», «el 20 % de 150 €» y «0,2 · 150» dan la misma. */
export const huellaCaso = (tipo, datos) => huella(normalizarCaso(tipo, datos));

// ─── Contextos ─────────────────────────────────────────────────────────────────

/** Personajes inventados para los enunciados (ningún alumno real: lo vigila tests/sin-nombres-de-alumnos.test.js). */
export const NOMBRES = Object.freeze(['Nora', 'Iker', 'Bruno', 'Vera', 'Teo', 'Alma', 'Gael', 'Irene', 'Marco', 'Olga', 'Hugo', 'Elsa', 'Rita', 'Leo', 'Maya', 'Óscar']);

const ET = (es1, es2, en1, en2) => ({ es: [es1, es2], en: [en1, en2] });
const PERSONAS = ET('persona', 'personas', 'person', 'people');
const ALUMNOS = ET('alumno', 'alumnos', 'pupil', 'pupils');
const DIAS = ET('día', 'días', 'day', 'days');
const HORAS = ET('hora', 'horas', 'hour', 'hours');
const DESCUENTOS = ['10', '15', '20', '25', '30', '40', '50', '60', '70'];

/**
 * Las fórmulas de cada tipo: con los datos sorteados, calculan los que salen de la cuenta.
 * directa: a ⟶ b, c ⟶ d (b = k · a : porCada si se sortea k). inversa: a · b = c · d. porcentaje: parte = p % de total.
 * descuento / aumento: cambio y final. reparto: las partes. escala: real = plano · escala (en la unidad de real).
 * velocidad: d = v · t (t en minutos). moneda: otra = euros · k.
 */
const FORMULAS = {
  directa(d, ctx) {
    const por = aValor(ctx.porCada ?? 1);
    if (d.k && !d.b) d.b = Q(d.k.valor.multiplicar(d.a.valor).dividir(por), ctx.datos.b.unidad ?? null);
    if (!d.k) d.k = Q(d.b.valor.multiplicar(por).dividir(d.a.valor), ctx.datos.k?.unidad ?? null);
    d.d = Q(d.b.valor.multiplicar(d.c.valor).dividir(d.a.valor), ctx.datos.d.unidad ?? null);
  },
  inversa(d, ctx) { d.d = Q(d.a.valor.multiplicar(d.b.valor).dividir(d.c.valor), ctx.datos.d.unidad ?? null); },
  porcentaje(d, ctx) { d.parte = Q(d.total.valor.multiplicar(d.p.valor).dividir(100), ctx.datos.parte.unidad ?? null); },
  descuento(d) { const r = aplicarPorcentaje(d.precio, d.p.valor, 'descuento'); d.cambio = r.cambio; d.final = r.final; },
  aumento(d) { const r = aplicarPorcentaje(d.precio, d.p.valor, 'aumento'); d.cambio = r.cambio; d.final = r.final; },
  reparto(d, ctx) {
    const claves = Object.keys(ctx.datos).filter(k => /^r\d$/.test(k)).sort();
    const suma = claves.reduce((s, k) => s.sumar(d[k].valor), CERO);
    claves.forEach((k, i) => { d[`p${i + 1}`] = Q(d.total.valor.multiplicar(d[k].valor).dividir(suma), d.total.unidad); });
  },
  escala(d, ctx) { d.real = Q(d.plano.valor.multiplicar(d.escala.valor), d.plano.unidad).enUnidad(ctx.datos.real.unidad); },
  velocidad(d) { d.d = Q(d.v.valor.multiplicar(d.t.valor).dividir(60), 'km'); },
  moneda(d, ctx) { d.otra = Q(d.euros.valor.multiplicar(d.k.valor), ctx.datos.otra.unidad ?? null); },
};

/** Cifras decimales que se admiten por unidad si el contexto no lo dice: dinero, 2; números sueltos y minutos, 0. */
const CIFRAS = { '€': 2, null: 0, min: 0, g: 0, mL: 0, s: 0, '%': 2 };
const cifrasDe = (ctx, clave) => ctx.datos[clave].cifras ?? CIFRAS[ctx.datos[clave].unidad ?? null] ?? 2;

const entre = (v, [min, max]) => comparar(v, aValor(min)) >= 0 && comparar(v, aValor(max)) <= 0;

/** ¿Están todos los datos dentro de su cota (o de su rango, o de su lista), exactos para su unidad, y a ≠ c? */
export function dentroDeCota(ctx, datos) {
  for (const [clave, spec] of Object.entries(ctx.datos)) {
    const c = datos[clave];
    if (!(c instanceof Cantidad)) return false;
    if (c.valor.num <= 0) return false;
    if (!esExacta(c, cifrasDe(ctx, clave))) return false;
    const limites = spec.cota ?? (spec.rango ? [spec.rango[0], spec.rango[1]] : null);
    if (limites && !entre(c.valor, limites)) return false;
    if (spec.lista && !spec.lista.some(v => aValor(v).equals(c.valor))) return false;
  }
  if ((ctx.tipo === 'directa' || ctx.tipo === 'inversa') && datos.a.valor.equals(datos.c.valor)) return false;
  if (ctx.distintos && ctx.distintos.some(([x, y]) => datos[x].valor.equals(datos[y].valor))) return false;
  return true;
}

function sortear(spec, rng) {
  if (spec.lista) return aValor(rng.elegir(spec.lista));
  const [min, max, paso] = spec.rango.map(aValor);
  const pasos = max.restar(min).dividir(paso).simplificar();
  return min.sumar(paso.multiplicar(rng.entero(0, Math.floor(pasos.num / pasos.den)))).simplificar();
}

/**
 * Datos al azar de un contexto, dentro de su cota y exactos: { clave: Cantidad, …, nombres }. Se sortean los que
 * llevan `rango` o `lista` y se calculan los demás; se repite hasta que todo cuadra (lanza si no lo consigue).
 */
export function generarDatos(ctx, rng, { intentos = 5000 } = {}) {
  for (let i = 0; i < intentos; i++) {
    const d = {};
    for (const [clave, spec] of Object.entries(ctx.datos)) if (spec.rango || spec.lista) d[clave] = Q(sortear(spec, rng), spec.unidad ?? null);
    FORMULAS[ctx.tipo](d, ctx);
    if (dentroDeCota(ctx, d)) {
      if (ctx.personajes) d.nombres = rng.barajar(NOMBRES).slice(0, ctx.personajes);
      return d;
    }
  }
  throw new ErrorProporcion('sin-datos', `El contexto ${ctx.id} no da datos dentro de su cota`);
}

function textoDato(ctx, clave, c, idioma) {
  const spec = ctx.datos[clave] ?? {};
  if (spec.formato === 'escala') return escalaATexto(c.valor.num);
  if (spec.formato === 'complejo') return complejoATexto(aComplejo(c, ['h', 'min']).partes, idioma);
  const n = spec.formato === 'dinero' ? numeroATexto(c.valor, idioma, { cifras: 2 }) : aTexto(c.valor, idioma);
  if (spec.etiqueta) return `${n} ${spec.etiqueta[idioma][c.valor.equals(UNO) ? 0 : 1]}`;
  return aTexto(c, idioma);
}

/** El enunciado del contexto con sus datos, en el idioma pedido; `pregunta` elige el texto si hay varios. */
export function enunciado(ctx, datos, idioma = 'es', pregunta = null) {
  const plantillas = ctx[idioma];
  const p = typeof plantillas === 'string' ? plantillas : plantillas[pregunta ?? ctx.pregunta ?? Object.keys(plantillas)[0]];
  if (!p) throw new ErrorProporcion('pregunta', `El contexto ${ctx.id} no tiene la pregunta ${pregunta}`);
  return p.replace(/\{(\w+)\}/g, (_, k) => {
    const n = /^n(\d)$/.exec(k);
    if (n) return datos.nombres[Number(n[1]) - 1];
    if (!datos[k]) throw new ErrorProporcion('dato', `Falta el dato ${k} en ${ctx.id}`);
    return textoDato(ctx, k, datos[k], idioma);
  });
}

const directa = (id, origen, datos, es, en, extra = {}) => ({ id, tipo: 'directa', origen, datos, es, en, pregunta: 'd', ...extra });
const inversa = (id, origen, datos, es, en, extra = {}) => ({ id, tipo: 'inversa', origen, datos, es, en, pregunta: 'd', ...extra });
const deCtx = (id, tipo, origen, datos, es, en, extra = {}) => ({ id, tipo, origen, datos, es, en, ...extra });

/**
 * El banco de contextos (propuesta hasta el acta de la 02 de la U7: «qué contextos usa la app» es su punto t).
 * Cada dato: `unidad` (o null y `etiqueta` para contar personas, días…), `rango: [mín, máx, paso]` o `lista` si se
 * sortea, `cota: [mín, máx]` si sale de la cuenta, `cifras` (lo exacto). Las cotas son las de la regla 7.
 * `origen`: 'nuevo' o la nota de la cantera de la montadora de la U7 de la que sale el contexto (con números nuevos).
 */
export const CONTEXTOS = Object.freeze([
  // ── Directa: la compra al peso, las recetas, el coche, los precios por unidad ──
  directa('fruteria-naranjas', 'nuevo', {
    a: { unidad: 'kg', rango: ['0,5', '5', '0,5'], cifras: 1 }, k: { unidad: '€/kg', rango: ['0,80', '2,50', '0,10'] },
    c: { unidad: 'kg', rango: ['0,5', '5', '0,5'], cifras: 1 }, b: { unidad: '€', cota: ['0,40', '12,50'] }, d: { unidad: '€', cota: ['0,40', '12,50'] },
  }, 'En una frutería, {a} de naranjas cuestan {b}. ¿Cuánto cuestan {c}?',
  'At a fruit shop, {a} of oranges cost {b}. How much do {c} cost? (fruit shop = frutería)'),
  directa('fruteria-fresas', 'nuevo', {
    a: { unidad: 'kg', rango: ['0,5', '3', '0,5'], cifras: 1 }, k: { unidad: '€/kg', rango: ['2,00', '6,00', '0,10'] },
    c: { unidad: 'kg', rango: ['0,5', '3', '0,5'], cifras: 1 }, b: { unidad: '€', cota: ['1,00', '18,00'] }, d: { unidad: '€', cota: ['1,00', '18,00'] },
  }, 'En el mercado, {a} de fresas cuestan {b}. ¿Cuánto cuestan {c}?',
  'At the market, {a} of strawberries cost {b}. How much do {c} cost? (strawberries = fresas)'),
  directa('receta-harina', 'cantera', {
    a: { unidad: null, etiqueta: PERSONAS, rango: [2, 12, 1] }, k: { unidad: null, rango: [20, 60, 5] },
    c: { unidad: null, etiqueta: PERSONAS, rango: [2, 12, 1] }, b: { unidad: 'g', cota: [50, 1000] }, d: { unidad: 'g', cota: [50, 1000] },
  }, 'Para hacer un bizcocho para {a} hacen falta {b} de harina. ¿Cuánta harina hace falta para un bizcocho para {c}?',
  'A sponge cake for {a} needs {b} of flour. How much flour does a sponge cake for {c} need? (flour = harina)'),
  directa('receta-leche', 'nuevo', {
    a: { unidad: null, etiqueta: PERSONAS, rango: [2, 12, 1] }, k: { unidad: null, rango: [50, 150, 25] },
    c: { unidad: null, etiqueta: PERSONAS, rango: [2, 12, 1] }, b: { unidad: 'mL', cota: [100, 2000] }, d: { unidad: 'mL', cota: [100, 2000] },
  }, 'Unas natillas para {a} llevan {b} de leche. ¿Cuánta leche llevan unas natillas para {c}?',
  'Custard for {a} needs {b} of milk. How much milk does custard for {c} need? (custard = natillas)'),
  directa('receta-huevos', 'cantera', {
    a: { unidad: null, etiqueta: PERSONAS, rango: [2, 12, 1] }, b: { unidad: null, etiqueta: ET('huevo', 'huevos', 'egg', 'eggs'), rango: [2, 12, 1] },
    c: { unidad: null, etiqueta: PERSONAS, rango: [2, 12, 1] }, d: { unidad: null, etiqueta: ET('huevo', 'huevos', 'egg', 'eggs'), cota: [1, 12] },
  }, 'Una tortilla para {a} lleva {b}. ¿Cuántos huevos lleva una tortilla para {c}?',
  'An omelette for {a} needs {b}. How many eggs does an omelette for {c} need? (omelette = tortilla)'),
  directa('consumo-coche', 'nuevo', {
    a: { unidad: 'km', rango: [100, 1000, 50], cifras: 0 }, k: { unidad: 'L/100 km', rango: ['4', '9', '0,5'] },
    c: { unidad: 'km', rango: [100, 1000, 50], cifras: 0 }, b: { unidad: 'L', cota: [4, 90] }, d: { unidad: 'L', cota: [4, 90] },
  }, 'Un coche gasta {b} de gasolina en {a}. Si conduce igual, ¿cuánta gasolina gasta en {c}?',
  'A car uses {b} of petrol to travel {a}. Driving in the same way, how much petrol does it use for {c}? (petrol = gasolina)', { porCada: 100 }),
  directa('gasolinera', 'nuevo', {
    a: { unidad: 'L', rango: [5, 60, 5], cifras: 0 }, k: { unidad: '€/L', rango: ['1,20', '2,00', '0,01'] },
    c: { unidad: 'L', rango: [5, 60, 5], cifras: 0 }, b: { unidad: '€', cota: ['6,00', '120,00'] }, d: { unidad: '€', cota: ['6,00', '120,00'] },
  }, 'En una gasolinera, {a} de gasolina cuestan {b}. ¿Cuánto cuestan {c}?',
  'At a petrol station, {a} of petrol cost {b}. How much do {c} cost? (petrol = gasolina)'),
  directa('cuadernos', 'cantera', {
    a: { unidad: null, etiqueta: ET('cuaderno', 'cuadernos', 'notebook', 'notebooks'), rango: [2, 12, 1] }, k: { unidad: '€', rango: ['0,50', '4,00', '0,05'] },
    c: { unidad: null, etiqueta: ET('cuaderno', 'cuadernos', 'notebook', 'notebooks'), rango: [2, 12, 1] }, b: { unidad: '€', cota: ['1,00', '48,00'] }, d: { unidad: '€', cota: ['1,00', '48,00'] },
  }, '{a} iguales cuestan {b}. ¿Cuánto cuestan {c}?',
  '{a}, all the same, cost {b}. How much do {c} cost? (notebooks = cuadernos)'),
  directa('entradas-cine', 'nuevo', {
    a: { unidad: null, etiqueta: ET('entrada', 'entradas', 'ticket', 'tickets'), rango: [2, 10, 1] }, k: { unidad: '€', rango: ['4,50', '9,00', '0,50'] },
    c: { unidad: null, etiqueta: ET('entrada', 'entradas', 'ticket', 'tickets'), rango: [2, 10, 1] }, b: { unidad: '€', cota: ['9,00', '90,00'] }, d: { unidad: '€', cota: ['9,00', '90,00'] },
  }, 'En un cine, {a} cuestan {b}. ¿Cuánto cuestan {c}?',
  'At a cinema, {a} cost {b}. How much do {c} cost? (tickets = entradas)'),

  // ── Velocidad (distancia y tiempo a velocidad constante): tiempo en minutos ──
  ...[
    ['andando', [3, 6, 1], [15, 180, 15], ['0,5', 18], 'camina', 'walks', 'walks {d}'],
    ['corriendo', [8, 12, 1], [10, 60, 5], [1, 12], 'corre', 'runs', 'runs {d}'],
    ['bici', [10, 25, 1], [15, 180, 15], [2, 50], 'va en bici', 'cycles', 'cycles {d}'],
    ['coche', [60, 120, 10], [30, 360, 15], [30, 720], 'va en coche', 'drives', 'drives {d}'],
    ['tren', [80, 300, 10], [30, 300, 15], [40, 1000], 'viaja en tren', 'travels by train', 'travels {d} by train'],
  ].map(([id, v, t, d, es, en, enRecorre]) => deCtx(`velocidad-${id}`, 'velocidad', 'cantera', {
    v: { unidad: 'km/h', rango: v, cifras: 0 }, t: { unidad: 'min', rango: t, formato: 'complejo' },
    d: { unidad: 'km', cota: d, cifras: 1 },
  }, {
    d: `{n1} ${es} siempre a {v}. ¿Cuántos kilómetros recorre en {t}?`,
    t: `{n1} ${es} siempre a {v}. ¿Cuánto tarda en recorrer {d}?`,
    v: `{n1} ${es} y recorre {d} en {t}, siempre a la misma velocidad. ¿A qué velocidad va?`,
  }, {
    d: `{n1} ${en} at a steady {v}. How many kilometres does {n1} cover in {t}? (steady = siempre igual)`,
    t: `{n1} ${en} at a steady {v}. How long does it take {n1} to cover {d}? (steady = siempre igual)`,
    v: `{n1} ${enRecorre} in {t}, always at the same speed. What is the speed? (speed = velocidad)`,
  }, { pregunta: 'd', personajes: 1 })),

  // ── Inversa (todos al mismo ritmo, dicho en el enunciado) ──
  inversa('pintores', 'cantera', {
    a: { unidad: null, etiqueta: ET('pintor', 'pintores', 'painter', 'painters'), rango: [2, 12, 1] }, b: { unidad: null, etiqueta: DIAS, rango: [3, 60, 1] },
    c: { unidad: null, etiqueta: ET('pintor', 'pintores', 'painter', 'painters'), rango: [2, 12, 1] }, d: { unidad: null, etiqueta: DIAS, cota: [3, 60] },
  }, '{a}, todos al mismo ritmo, pintan un colegio en {b}. ¿Cuántos días tardan {c} que trabajan al mismo ritmo?',
  '{a}, all working at the same rate, paint a school in {b}. How many days do {c} working at the same rate take? (at the same rate = al mismo ritmo)'),
  inversa('grifos', 'cantera', {
    a: { unidad: null, etiqueta: ET('grifo', 'grifos', 'tap', 'taps'), rango: [2, 8, 1] }, b: { unidad: null, etiqueta: HORAS, rango: [1, 24, 1] },
    c: { unidad: null, etiqueta: ET('grifo', 'grifos', 'tap', 'taps'), rango: [2, 8, 1] }, d: { unidad: null, etiqueta: HORAS, cota: [1, 24] },
  }, '{a} iguales llenan un depósito en {b}. ¿Cuántas horas tardan en llenarlo {c} iguales?',
  '{a}, all the same, fill a tank in {b}. How many hours do {c} like them take to fill it? (taps = grifos; tank = depósito)'),
  inversa('maquinas', 'cantera', {
    a: { unidad: null, etiqueta: ET('máquina', 'máquinas', 'machine', 'machines'), rango: [2, 12, 1] }, b: { unidad: null, etiqueta: HORAS, rango: [1, 24, 1] },
    c: { unidad: null, etiqueta: ET('máquina', 'máquinas', 'machine', 'machines'), rango: [2, 12, 1] }, d: { unidad: null, etiqueta: HORAS, cota: [1, 24] },
  }, 'En una fábrica, {a} iguales embotellan un pedido en {b}. ¿Cuántas horas tardan {c} iguales?',
  'In a factory, {a}, all the same, bottle an order in {b}. How many hours do {c} like them take? (bottle = embotellar)'),
  inversa('pienso', 'cantera', {
    a: { unidad: null, etiqueta: ET('oveja', 'ovejas', 'sheep', 'sheep'), rango: [10, 60, 5] }, b: { unidad: null, etiqueta: DIAS, rango: [5, 60, 1] },
    c: { unidad: null, etiqueta: ET('oveja', 'ovejas', 'sheep', 'sheep'), rango: [10, 60, 5] }, d: { unidad: null, etiqueta: DIAS, cota: [5, 60] },
  }, 'Un granjero tiene pienso para {a} durante {b}, y todas comen lo mismo. ¿Para cuántos días le llega el pienso si tiene {c}?',
  'A farmer has enough feed for {a} for {b}, and they all eat the same amount. How many days does the feed last for {c}? (feed = pienso)'),
  inversa('viaje', 'cantera', {
    a: { unidad: 'km/h', rango: [40, 120, 10], cifras: 0 }, b: { unidad: 'min', rango: [30, 360, 15], formato: 'complejo' },
    c: { unidad: 'km/h', rango: [40, 120, 10], cifras: 0 }, d: { unidad: 'min', cota: [20, 540], formato: 'complejo' },
  }, 'Un coche que va siempre a {a} tarda {b} en hacer un viaje. ¿Cuánto tarda en hacer el mismo viaje a {c}?',
  'A car going at a steady {a} takes {b} to make a journey. How long does the same journey take at {c}? (steady = siempre igual)'),

  // ── Porcentaje de un grupo (personas enteras) ──
  ...[
    ['clase', [20, 30, 1], ALUMNOS, 'En una clase de {total}', 'In a class of {total}', 'va al instituto andando', 'van al instituto andando', 'walk to school', 'walk to school', 'alumnos', 'pupils', 'la clase', 'the class'],
    ['encuesta', [200, 1200, 50], ALUMNOS, 'En una encuesta a {total} de un instituto', 'In a survey of {total} at a school', 'prefiere el baloncesto', 'prefieren el baloncesto', 'prefer basketball', 'prefer basketball', 'alumnos', 'pupils', 'los encuestados', 'the pupils asked'],
    ['club', [100, 2000, 50], ET('socio', 'socios', 'member', 'members'), 'En un club deportivo de {total}', 'In a sports club of {total}', 'juega al tenis', 'juegan al tenis', 'play tennis', 'play tennis', 'socios', 'members', 'los socios del club', 'the club members'],
  ].map(([id, rango, et, abreEs, abreEn, verboEs, verboPlEs, verboEn, verboPlEn, quienEs, quienEn, todoEs, todoEn]) => deCtx(id, 'porcentaje', 'nuevo', {
    total: { unidad: null, etiqueta: et, rango }, p: { unidad: '%', rango: [1, 99, 1], cifras: 0 }, parte: { unidad: null, etiqueta: et, cota: [2, rango[1]] },
  }, {
    parte: `${abreEs}, el {p} ${verboEs}. ¿Cuántos ${quienEs} ${verboPlEs}?`,
    total: `El {p} de ${todoEs} ${verboEs}, y son {parte}. ¿Cuántos ${quienEs} hay en total?`,
    porcentaje: `${abreEs}, {parte} ${verboPlEs}. ¿Qué porcentaje ${verboEs}?`,
  }, {
    parte: `${abreEn}, {p} of them ${verboEn}. How many ${quienEn} ${verboPlEn}?`,
    total: `{p} of ${todoEn} ${verboEn}, and that is {parte}. How many ${quienEn} are there altogether? (altogether = en total)`,
    porcentaje: `${abreEn}, {parte} ${verboPlEn}. What percentage ${verboPlEn}?`,
  }, { pregunta: 'parte' })),
  deCtx('tiros', 'porcentaje', 'nuevo', {
    total: { unidad: null, etiqueta: ET('tiro libre', 'tiros libres', 'free throw', 'free throws'), rango: [10, 50, 1] },
    p: { unidad: '%', rango: [10, 90, 1], cifras: 0 }, parte: { unidad: null, etiqueta: ET('tiro', 'tiros', 'throw', 'throws'), cota: [2, 45] },
  }, {
    parte: 'En una temporada, {n1} ha lanzado {total} y ha encestado el {p}. ¿Cuántos tiros ha encestado?',
    total: '{n1} ha encestado el {p} de sus tiros libres, que son {parte}. ¿Cuántos tiros libres ha lanzado?',
    porcentaje: '{n1} ha lanzado {total} y ha encestado {parte}. ¿Qué porcentaje ha encestado?',
  }, {
    parte: 'This season {n1} has taken {total} and scored {p} of them. How many has {n1} scored? (scored = encestado)',
    total: '{n1} has scored {p} of the free throws taken, that is {parte}. How many free throws has {n1} taken? (scored = encestado)',
    porcentaje: '{n1} has taken {total} and scored {parte}. What percentage has {n1} scored? (scored = encestado)',
  }, { pregunta: 'parte', personajes: 1 }),
  deCtx('test', 'porcentaje', 'nuevo', {
    total: { unidad: null, etiqueta: ET('pregunta', 'preguntas', 'question', 'questions'), rango: [10, 50, 5] },
    p: { unidad: '%', rango: [10, 95, 1], cifras: 0 }, parte: { unidad: null, etiqueta: ET('pregunta', 'preguntas', 'question', 'questions'), cota: [2, 50] },
  }, {
    parte: 'Un examen tipo test tiene {total}, y {n1} ha acertado el {p}. ¿Cuántas preguntas ha acertado?',
    total: '{n1} ha acertado el {p} de las preguntas de un test, que son {parte}. ¿Cuántas preguntas tenía el test?',
    porcentaje: 'Un examen tipo test tiene {total}, y {n1} ha acertado {parte}. ¿Qué porcentaje ha acertado?',
  }, {
    parte: 'A multiple-choice test has {total}, and {n1} got {p} of them right. How many did {n1} get right? (got right = acertó)',
    total: '{n1} got {p} of the questions in a test right, that is {parte}. How many questions were there? (got right = acertó)',
    porcentaje: 'A multiple-choice test has {total}, and {n1} got {parte} right. What percentage did {n1} get right? (got right = acertó)',
  }, { pregunta: 'parte', personajes: 1 }),
  deCtx('ahorros', 'porcentaje', 'nuevo', {
    total: { unidad: '€', rango: [20, 500, 5] }, p: { unidad: '%', rango: [5, 95, 5], cifras: 0 }, parte: { unidad: '€', cota: ['1,00', '475,00'] },
  }, {
    parte: '{n1} tiene {total} ahorrados y se gasta el {p} en un regalo. ¿Cuánto le cuesta el regalo?',
    total: '{n1} se gasta el {p} de sus ahorros en un regalo que cuesta {parte}. ¿Cuánto tenía ahorrado?',
    porcentaje: '{n1} tiene {total} ahorrados y se gasta {parte} en un regalo. ¿Qué porcentaje de sus ahorros se ha gastado?',
  }, {
    parte: '{n1} has {total} in savings and spends {p} of it on a present. How much does the present cost? (savings = ahorros)',
    total: '{n1} spends {p} of the savings on a present that costs {parte}. How much were the savings? (savings = ahorros)',
    porcentaje: '{n1} has {total} in savings and spends {parte} on a present. What percentage of the savings has {n1} spent? (savings = ahorros)',
  }, { pregunta: 'parte', personajes: 1 }),

  // ── Descuentos (prendas, móviles, videojuegos) ──
  ...[
    ['rebajas-camiseta', ['5,00', '40,00', '0,50'], 'Una camiseta', 'A T-shirt', 'a'],
    ['rebajas-chaqueta', ['30,00', '120,00', '1,00'], 'Una chaqueta', 'A jacket', 'a'],
    ['rebajas-videojuego', ['10,00', '80,00', '1,00'], 'Un videojuego', 'A video game', 'o'],
    ['rebajas-movil', [80, 1200, 10], 'Un móvil', 'A mobile phone', 'o'],
  ].map(([id, rango, es, en, g]) => deCtx(id, 'descuento', 'nuevo', {
    precio: { unidad: '€', rango }, p: { unidad: '%', lista: id === 'rebajas-movil' ? ['10', '15', '20', '25', '30'] : DESCUENTOS, cifras: 0 },
    cambio: { unidad: '€', cota: ['0,50', '840,00'] }, final: { unidad: '€', cota: ['1,00', '1200,00'] },
  }, {
    final: `${es} cuesta {precio} y está rebajad${g} un {p}. ¿Cuánto se paga por ${g === 'a' ? 'ella' : 'él'}?`,
    cambio: `${es} cuesta {precio} y está rebajad${g} un {p}. ¿Cuánto dinero se descuenta?`,
  }, {
    final: `${en} costs {precio} and has a {p} discount. How much do you pay for it? (discount = descuento)`,
    cambio: `${en} costs {precio} and has a {p} discount. How much money is taken off? (discount = descuento)`,
  }, { pregunta: 'final' })),

  // ── Aumentos: el IVA de España (4, 10 y 21 %) y las subidas (1-20 %) ──
  ...[
    ['iva-libro', ['5,00', '40,00', '0,25'], '4', 'Un libro', 'A book', 'los libros', 'books'],
    ['iva-restaurante', ['10,00', '80,00', '0,10'], '10', 'Una comida en un restaurante', 'A meal in a restaurant', 'las comidas en un restaurante', 'restaurant meals'],
    ['iva-patinete', [100, 600, 1], '21', 'Un patinete', 'A scooter', 'los patinetes', 'scooters'],
  ].map(([id, rango, p, es, en, cosasEs, cosasEn]) => deCtx(id, 'aumento', 'nuevo', {
    precio: { unidad: '€', rango }, p: { unidad: '%', lista: [p], cifras: 0 }, cambio: { unidad: '€', cota: ['0,20', '126,00'] }, final: { unidad: '€', cota: ['5,20', '726,00'] },
  }, {
    final: `${es} cuesta {precio} sin IVA, y el IVA de ${cosasEs} es del {p}. ¿Cuánto cuesta con IVA?`,
    cambio: `${es} cuesta {precio} sin IVA, y el IVA de ${cosasEs} es del {p}. ¿Cuánto es el IVA?`,
  }, {
    final: `${en} costs {precio} before VAT, and the VAT on ${cosasEn} is {p}. How much does it cost with VAT? (VAT = IVA)`,
    cambio: `${en} costs {precio} before VAT, and the VAT on ${cosasEn} is {p}. How much is the VAT? (VAT = IVA)`,
  }, { pregunta: 'final' })),
  deCtx('subida-abono', 'aumento', 'nuevo', {
    precio: { unidad: '€', rango: [20, 60, 1] }, p: { unidad: '%', rango: [1, 20, 1], cifras: 0 }, cambio: { unidad: '€', cota: ['0,20', '12,00'] }, final: { unidad: '€', cota: ['20,20', '72,00'] },
  }, {
    final: 'El abono mensual del autobús cuesta {precio} y el año que viene sube un {p}. ¿Cuánto costará?',
    cambio: 'El abono mensual del autobús cuesta {precio} y el año que viene sube un {p}. ¿Cuánto sube?',
  }, {
    final: 'A monthly bus pass costs {precio}, and next year it goes up by {p}. How much will it cost? (bus pass = abono; goes up = sube)',
    cambio: 'A monthly bus pass costs {precio}, and next year it goes up by {p}. By how much does it go up? (bus pass = abono; goes up = sube)',
  }, { pregunta: 'final' }),
  deCtx('poblacion', 'aumento', 'nuevo', {
    precio: { unidad: null, etiqueta: ET('habitante', 'habitantes', 'inhabitant', 'inhabitants'), rango: [500, 20000, 100] }, p: { unidad: '%', rango: [1, 20, 1], cifras: 0 },
    cambio: { unidad: null, etiqueta: ET('habitante', 'habitantes', 'inhabitant', 'inhabitants'), cota: [5, 4000] }, final: { unidad: null, etiqueta: ET('habitante', 'habitantes', 'inhabitant', 'inhabitants'), cota: [505, 24000] },
  }, {
    final: 'Un pueblo tenía {precio} hace diez años, y desde entonces la población ha crecido un {p}. ¿Cuántos habitantes tiene ahora?',
    cambio: 'Un pueblo tenía {precio} hace diez años, y desde entonces la población ha crecido un {p}. ¿Cuántos habitantes más tiene?',
  }, {
    final: 'A village had {precio} ten years ago, and since then the population has grown by {p}. How many inhabitants does it have now? (grown = crecido)',
    cambio: 'A village had {precio} ten years ago, and since then the population has grown by {p}. How many more inhabitants does it have? (grown = crecido)',
  }, { pregunta: 'final' }),

  // ── Repartos directamente proporcionales (2-3 personas, a algo dicho, exactos) ──
  deCtx('paga', 'reparto', 'nuevo', {
    total: { unidad: '€', rango: [20, 200, 5] }, r1: { unidad: null, rango: [8, 16, 1] }, r2: { unidad: null, rango: [8, 16, 1] },
    p1: { unidad: '€', cota: ['1,00', '200,00'] }, p2: { unidad: '€', cota: ['1,00', '200,00'] },
  }, 'Una abuela reparte {total} entre sus nietos {n1} y {n2} de forma proporcional a sus edades: {n1} tiene {r1} años y {n2}, {r2}. ¿Cuánto le toca a cada uno?',
  'A grandmother shares {total} between her grandchildren {n1} and {n2} in proportion to their ages: {n1} is {r1} and {n2} is {r2}. How much does each one get? (share = repartir)',
  { personajes: 2, distintos: [['r1', 'r2']], pregunta: 'partes' }),
  deCtx('trabajo-horas', 'reparto', 'nuevo', {
    total: { unidad: '€', rango: [20, 300, 5] }, r1: { unidad: null, rango: [2, 10, 1] }, r2: { unidad: null, rango: [2, 10, 1] },
    p1: { unidad: '€', cota: ['1,00', '300,00'] }, p2: { unidad: '€', cota: ['1,00', '300,00'] },
  }, '{n1} y {n2} han pintado juntos una valla: {n1} ha trabajado {r1} horas y {n2}, {r2} horas. Les pagan {total} y lo reparten de forma proporcional a las horas de cada uno. ¿Cuánto le toca a cada uno?',
  '{n1} and {n2} painted a fence together: {n1} worked for {r1} hours and {n2} for {r2} hours. They are paid {total} and share it in proportion to the hours each one worked. How much does each one get? (fence = valla; share = repartir)',
  { personajes: 2, distintos: [['r1', 'r2']], pregunta: 'partes' }),
  deCtx('premio-tres', 'reparto', 'cantera', {
    total: { unidad: '€', rango: [60, 600, 30] }, r1: { unidad: null, rango: [2, 10, 1] }, r2: { unidad: null, rango: [2, 10, 1] }, r3: { unidad: null, rango: [2, 10, 1] },
    p1: { unidad: '€', cota: ['1,00', '600,00'] }, p2: { unidad: '€', cota: ['1,00', '600,00'] }, p3: { unidad: '€', cota: ['1,00', '600,00'] },
  }, '{n1}, {n2} y {n3} ponen {r1} €, {r2} € y {r3} € para comprar juntos un número de una rifa del instituto. Les toca un premio de {total} y lo reparten de forma proporcional a lo que puso cada uno. ¿Cuánto le toca a cada uno?',
  '{n1}, {n2} and {n3} put in €{r1}, €{r2} and €{r3} to buy a school raffle ticket together. They win {total} and share it in proportion to what each one put in. How much does each one get? (raffle = rifa; share = repartir)',
  { personajes: 3, pregunta: 'partes' }),
  deCtx('cromos', 'reparto', 'nuevo', {
    total: { unidad: null, etiqueta: ET('cromo', 'cromos', 'sticker', 'stickers'), rango: [20, 200, 5] }, r1: { unidad: null, rango: [1, 5, 1] }, r2: { unidad: null, rango: [1, 5, 1] },
    p1: { unidad: null, cota: [1, 200] }, p2: { unidad: null, cota: [1, 200] },
  }, '{n1} y {n2} se reparten {total} en la razón {r1} : {r2}. ¿Cuántos cromos se queda cada uno?',
  '{n1} and {n2} share {total} in the ratio {r1} : {r2}. How many stickers does each one get? (share = repartir)',
  { personajes: 2, distintos: [['r1', 'r2']], pregunta: 'partes' }),
  deCtx('refresco', 'reparto', 'nuevo', {
    total: { unidad: 'mL', rango: [200, 2000, 50] }, r1: { unidad: null, rango: [1, 4, 1] }, r2: { unidad: null, rango: [2, 6, 1] },
    p1: { unidad: 'mL', cota: [25, 2000] }, p2: { unidad: 'mL', cota: [25, 2000] },
  }, 'Un refresco se hace mezclando zumo y agua en la razón {r1} : {r2}. ¿Cuánto zumo y cuánta agua hacen falta para {total} de refresco?',
  'A drink is made by mixing juice and water in the ratio {r1} : {r2}. How much juice and how much water are needed for {total} of drink? (juice = zumo)',
  { distintos: [['r1', 'r2']], pregunta: 'partes' }),

  // ── Escalas: planos, mapas y maquetas (la escala, a longitudes) ──
  deCtx('plano-habitacion', 'escala', 'cantera', {
    escala: { unidad: null, lista: [50, 100, 200], formato: 'escala' }, plano: { unidad: 'cm', rango: ['0,5', '20', '0,5'], cifras: 1 }, real: { unidad: 'm', cota: [2, 10], cifras: 2 },
  }, {
    real: 'En el plano de una casa a escala {escala}, el largo de una habitación mide {plano}. ¿Cuánto mide en la realidad?',
    plano: 'Una habitación mide {real} de largo. ¿Cuánto mide en un plano a escala {escala}?',
  }, {
    real: 'On a plan of a house at a scale of {escala}, the length of a room is {plano}. How long is it in real life?',
    plano: 'A room is {real} long. How long is it on a plan at a scale of {escala}?',
  }, { pregunta: 'real' }),
  deCtx('mapa', 'escala', 'cantera', {
    escala: { unidad: null, lista: [25000, 50000, 100000, 200000, 250000, 500000, 1000000], formato: 'escala' },
    plano: { unidad: 'cm', rango: ['0,5', '30', '0,5'], cifras: 1 }, real: { unidad: 'km', cota: ['0,5', '300'], cifras: 3 },
  }, {
    real: 'En un mapa a escala {escala}, dos pueblos están a {plano}. ¿A cuántos kilómetros están en la realidad?',
    plano: 'Dos pueblos están a {real}. ¿A cuántos centímetros están en un mapa a escala {escala}?',
  }, {
    real: 'On a map at a scale of {escala}, two villages are {plano} apart. How many kilometres apart are they in real life?',
    plano: 'Two villages are {real} apart. How many centimetres apart are they on a map at a scale of {escala}?',
  }, { pregunta: 'real' }),
  deCtx('maqueta-coche', 'escala', 'nuevo', {
    escala: { unidad: null, lista: [18, 24, 43], formato: 'escala' }, plano: { unidad: 'cm', rango: ['8', '28', '0,1'], cifras: 1 }, real: { unidad: 'm', cota: ['3,5', '5'], cifras: 2 },
  }, {
    real: 'Una maqueta de un coche a escala {escala} mide {plano} de largo. ¿Cuánto mide el coche de verdad?',
    plano: 'Un coche mide {real} de largo. ¿Cuánto mide su maqueta a escala {escala}?',
  }, {
    real: 'A scale model of a car at {escala} is {plano} long. How long is the real car? (scale model = maqueta)',
    plano: 'A car is {real} long. How long is its scale model at {escala}? (scale model = maqueta)',
  }, { pregunta: 'real' }),
  deCtx('maqueta-tren', 'escala', 'nuevo', {
    escala: { unidad: null, lista: [87], formato: 'escala' }, plano: { unidad: 'cm', rango: ['11,5', '28,7', '0,1'], cifras: 1 }, real: { unidad: 'm', cota: [10, 25], cifras: 2 },
  }, {
    real: 'Un vagón de un tren de juguete a escala {escala} mide {plano}. ¿Cuánto mide el vagón de verdad?',
    plano: 'Un vagón de tren mide {real}. ¿Cuánto mide en un tren de juguete a escala {escala}?',
  }, {
    real: 'A carriage of a model train at a scale of {escala} is {plano} long. How long is the real carriage? (carriage = vagón)',
    plano: 'A train carriage is {real} long. How long is it on a model train at a scale of {escala}? (carriage = vagón)',
  }, { pregunta: 'real' }),

  // ── Cambio de moneda: el tipo, inventado y dicho en el enunciado ──
  deCtx('moneda-dolares', 'moneda', 'nuevo', {
    k: { unidad: null, etiqueta: ET('dólar', 'dólares', 'dollar', 'dollars'), rango: ['1,05', '1,30', '0,05'], cifras: 2, formato: 'dinero' }, euros: { unidad: '€', rango: [10, 500, 5] },
    otra: { unidad: null, etiqueta: ET('dólar', 'dólares', 'dollar', 'dollars'), cota: ['10,50', '650'], cifras: 2, formato: 'dinero' },
  }, { otra: 'Un día, 1 € vale {k}. ¿Cuántos dólares dan por {euros}?', euros: 'Un día, 1 € vale {k}. ¿Cuántos euros dan por {otra}?' },
  { otra: 'One day, €1 is worth {k}. How many dollars do you get for {euros}? (is worth = vale)', euros: 'One day, €1 is worth {k}. How many euros do you get for {otra}? (is worth = vale)' },
  { pregunta: 'otra' }),
  deCtx('moneda-libras', 'moneda', 'nuevo', {
    k: { unidad: null, etiqueta: ET('libra', 'libras', 'pound', 'pounds'), rango: ['0,80', '0,95', '0,05'], cifras: 2, formato: 'dinero' }, euros: { unidad: '€', rango: [10, 500, 5] },
    otra: { unidad: null, etiqueta: ET('libra', 'libras', 'pound', 'pounds'), cota: ['8', '475'], cifras: 2, formato: 'dinero' },
  }, { otra: 'Un día, 1 € vale {k}. ¿Cuántas libras dan por {euros}?', euros: 'Un día, 1 € vale {k}. ¿Cuántos euros dan por {otra}?' },
  { otra: 'One day, €1 is worth {k}. How many pounds do you get for {euros}? (is worth = vale)', euros: 'One day, €1 is worth {k}. How many euros do you get for {otra}? (is worth = vale)' },
  { pregunta: 'otra' }),
]);

/** El contexto con ese id (lanza si no existe). */
export function contexto(id) {
  const c = CONTEXTOS.find(x => x.id === id);
  if (!c) throw new ErrorProporcion('contexto', `No hay contexto ${id}`);
  return c;
}
