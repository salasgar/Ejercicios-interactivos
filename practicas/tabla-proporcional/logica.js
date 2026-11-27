// Práctica «Tablas de proporcionalidad» (unidad 7, sesión 2; PU2, tarea 213): puro, sin DOM.
// Ejercicios: 1 ¿es proporcional? (tabla), 2 completa la tabla, 3 la constante («lo que vale 1»), 4 ¿directamente
// proporcionales? (banco fijo). Toda la aritmética es entera o con Fraccion: nada de cocientes en coma flotante.
// El dinero va en céntimos enteros. «Constante», «k» y las letras no salen nunca en pantalla.

import { Fraccion, fraccion } from '../_comun/fracciones.js';
import { ERRORES_TIPICOS, cantidad, deTexto, huellaCaso, mismoValor } from '../_comun/proporcion.js';
import { HUELLAS_RESERVADAS } from './reserva.js';

export const F = (n, d = 1) => new Fraccion(n, d);
const NBSP = ' ';

// ─── Números en pantalla ─────────────────────────────────────────────────────────────────────────

/** Céntimos → «7,50» / «7.50» (sin símbolo; la unidad va en la cabecera). */
export function dineroCelda(c, idioma = 'es') {
  const e = Math.trunc(c / 100), cc = String(c % 100).padStart(2, '0');
  return `${e}${idioma === 'es' ? ',' : '.'}${cc}`;
}
/** Céntimos → «7,50 €» / «€7.50». */
export const dinero = (c, idioma = 'es') => (idioma === 'es' ? `${dineroCelda(c, 'es')}${NBSP}€` : `€${dineroCelda(c, 'en')}`);
/** Una Fraccion con decimal exacto (2,5; 0,4) → texto con coma o punto. */
export function decimal(f, idioma = 'es') {
  const s = f.simplificar();
  let d = s.den, dos = 0, cinco = 0;
  while (d % 2 === 0) { d /= 2; dos++; }
  while (d % 5 === 0) { d /= 5; cinco++; }
  if (d !== 1) throw new Error(`no es un decimal exacto: ${s.num}/${s.den}`);
  const cifras = Math.max(dos, cinco), pot = 10 ** cifras;
  const total = s.num * (pot / s.den), signo = total < 0 ? '−' : '', abs = Math.abs(total);
  const ent = Math.trunc(abs / pot), dec = String(abs % pot).padStart(cifras, '0');
  return `${signo}${ent}${cifras ? (idioma === 'es' ? ',' : '.') + dec : ''}`;
}

// ─── Contextos ───────────────────────────────────────────────────────────────────────────────────
// u = lo que se pide en la tabla en «unidades»; x = u · xMul. y = k · u (proporcional) con k en céntimos si
// `din`, o en gramos/litros. `umax` y `ks` son la cota creíble de cada contexto (la comprueba el test).

export const CONTEXTOS = {
  num: { din: false, xMul: 1, umax: 12, paso: 1, ks: [2, 3, 4, 5, 6, 7, 8, 9], yMax: 100 },
  fruta: { din: true, xMul: 1, umax: 8, paso: 50, ks: [80, 90, 120, 150, 160, 180, 190, 240, 250, 300, 350], unidadX: 'kg', unidadY: '€' },
  entradas: { din: true, xMul: 1, umax: 10, paso: 50, ks: [400, 450, 500, 600, 750, 800, 900, 1200, 1500], unidadX: null, unidadY: '€' },
  cuadernos: { din: true, xMul: 1, umax: 10, paso: 50, ks: [70, 80, 95, 120, 150, 185, 250], unidadX: null, unidadY: '€' },
  receta: { din: false, xMul: 1, umax: 12, paso: 10, ks: [60, 70, 75, 80, 100, 125], unidadX: null, unidadY: 'g', yMax: 1000 },
  coche: { din: false, xMul: 100, umax: 8, paso: 1, ks: [4, 5, 6, 7, 8, 9], unidadX: 'km', unidadY: 'L' },
  // no proporcionales con parte fija: y = (fija + por · u) euros
  taxi: { din: true, xMul: 1, umax: 20, fija: [2, 3, 4], por: [1, 2], unidadX: 'km', unidadY: '€' },
  gimnasio: { din: true, xMul: 1, umax: 12, fija: [20, 25, 30], por: [15, 20, 25, 30], unidadX: null, unidadY: '€' },
};
export const CTX_SI = ['fruta', 'entradas', 'cuadernos', 'receta', 'coche'];
export const CTX_FIJA = ['taxi', 'gimnasio'];

/** Dónde se corta cada ejercicio de contexto 3 (La constante). */
export const CTX_CONSTANTE = {
  fruta: { ks: [80, 90, 120, 150, 160, 180, 190, 240, 250, 300, 350, 450, 500, 600], umin: 2, umax: 9, din: true, unidadY: '€' },
  entrada: { ks: [300, 400, 500, 600, 800, 1000, 1200, 1500, 1800, 2000, 2500, 3000, 4000, 5000, 6000], umin: 2, umax: 9, din: true, unidadY: '€' },
  cuaderno: { ks: [50, 60, 75, 80, 95, 120, 150, 200, 250, 300, 400], umin: 2, umax: 12, din: true, unidadY: '€' },
  receta: { ks: [25, 30, 40, 50, 60, 75, 80, 100, 120, 150], umin: 2, umax: 10, din: false, unidadY: 'g', yMax: 1000 },
  coche: { ks: [4, 5, 6, 7, 8, 9], umin: 2, umax: 8, din: false, unidadY: 'L', xMul: 100 },
};

// ─── Errores ─────────────────────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  'proporcional-como-no-proporcional': { es: 'Ha dudado de una tabla que sí es proporcional', en: 'Doubted a table that is proportional' },
  'dividir-al-reves': { es: 'Ha dividido al revés', en: 'Divided the wrong way round' },
  'restar': { es: 'Ha restado en vez de dividir', en: 'Subtracted instead of dividing' },
  'multiplicar': { es: 'Ha multiplicado en vez de dividir', en: 'Multiplied instead of dividing' },
  'sin-pasar-a-cada-100': { es: 'Ha dividido entre los km sin pasar a «cada 100 km»', en: 'Divided by the km without changing to «every 100 km»' },
  'operacion-contraria': { es: 'Ha hecho la operación contraria', en: 'Did the opposite operation' },
  'otra-respuesta': { es: 'Otra respuesta', en: 'Another answer' },
};
export const nombreError = id => ERRORES_TIPICOS[id]?.nombre ?? ERRORES_PROPIOS[id];

// ─── Casos reservados (hoja y examen) ────────────────────────────────────────────────────────────

/** Una huella por cada grupo de columnas proporcional del ítem (x tal como se ve; el coche, en km). */
export function huellasDe(it) {
  const din = (CONTEXTOS[it.ctx] ?? CTX_CONSTANTE[it.ctx]).din, out = [];
  for (let m = 1; m < 1 << it.cols.length; m++) {
    const s = it.cols.filter((_, i) => m & (1 << i));
    if (!s.every(q => q.y * s[0].x === s[0].y * q.x)) continue;
    const k = fraccion(s[0].y, s[0].x * (din ? 100 : 1));
    out.push(huellaCaso('tabla-directa', [k, ...s.map(q => q.x).sort((a, b) => a - b).map(x => fraccion(x, 1))]));
  }
  return out;
}
export const esReservado = it => huellasDe(it).some(h => HUELLAS_RESERVADAS.has(h));
const sinReservados = crear => rng => {
  for (let i = 0; i < 50; i++) { const it = crear(rng); if (!esReservado(it)) return it; }
  throw new Error('tabla-proporcional: todo reservado');
};

// ─── Ejercicio 1: ¿es proporcional? ──────────────────────────────────────────────────────────────

/** ¿Todas las columnas cumplen y/x igual? Por productos cruzados, con enteros. */
export const esProporcional = (xs, ys) => xs.every((x, i) => ys[i] * xs[0] === ys[0] * x);

function elegirUs(rng, umax) {
  const m = umax >= 6 && rng.azar() < 0.35 ? 3 : 2;
  const a = rng.entero(1, Math.floor(umax / m));
  const resto = [];
  for (let u = 1; u <= umax; u++) if (u !== a && u !== m * a) resto.push(u);
  return { m, a, us: [a, m * a, ...rng.barajar(resto).slice(0, 2)].sort((p, q) => p - q) };
}

function umaxDe(ctx, k) {
  const c = CONTEXTOS[ctx];
  return c.yMax ? Math.min(c.umax, Math.floor(c.yMax / k)) : c.umax;
}

function columnas(ctx, us, ys) {
  const xMul = CONTEXTOS[ctx].xMul;
  return us.map((u, i) => ({ x: u * xMul, y: ys[i] }));
}

const crearEsProporcional = rng => {
  const r = rng.azar();
  const tipo = r < 0.5 ? 'si' : r < 0.67 ? 'suma' : r < 0.84 ? 'fija' : 'casilla';
  let ctx;
  if (tipo === 'suma') ctx = 'num';
  else if (tipo === 'fija') ctx = rng.elegir(CTX_FIJA);
  else ctx = rng.azar() < 0.5 ? 'num' : rng.elegir(CTX_SI);
  const c = CONTEXTOS[ctx];
  let us, m, a, ys;
  if (tipo === 'fija') {
    const e = elegirUs(rng, c.umax);
    ({ us, m, a } = e);
    const fija = rng.elegir(c.fija), por = rng.elegir(c.por);
    ys = us.map(u => (fija + por * u) * 100);
  } else if (tipo === 'suma') {
    const e = elegirUs(rng, c.umax);
    ({ us, m, a } = e);
    const d = rng.entero(2, 9);
    ys = us.map(u => u + d);
  } else {
    const k = rng.elegir(c.ks);
    const e = elegirUs(rng, umaxDe(ctx, k));
    ({ us, m, a } = e);
    ys = us.map(u => k * u);
    if (tipo === 'casilla') {
      const j = us.indexOf(m * a);
      let d = c.paso * rng.entero(1, 3);
      if (rng.azar() < 0.5) d = -d;
      if (ys[j] + d <= 0 || (c.yMax && ys[j] + d > c.yMax)) d = -d;
      ys[j] += d;
    }
  }
  const i = us.indexOf(a), j = us.indexOf(m * a);
  return { ctx, tipo, si: tipo === 'si', cols: columnas(ctx, us, ys), par: { i, j, m } };
};
export const generarEsProporcional = sinReservados(crearEsProporcional);

export const claveEsProporcional = it => `${it.ctx}|${it.tipo}|${it.cols.map(c => `${c.x}:${c.y}`).join(',')}`;
export const respuestaEsProporcional = it => esProporcional(it.cols.map(c => c.x), it.cols.map(c => c.y));
export const errorEsProporcional = (it, dijoSi) => {
  const real = respuestaEsProporcional(it);
  if (dijoSi === real) return null;
  return real ? 'proporcional-como-no-proporcional' : 'no-proporcional-como-proporcional';
};
/** El valor de y para 1 unidad (la razón y/u) cuando la tabla es proporcional, como Fraccion (céntimos o unidades). */
export const porUnidad = it => F(it.cols[0].y * 1, it.cols[0].x / CONTEXTOS[it.ctx].xMul).simplificar();

// ─── Ejercicio 2: completa la tabla ──────────────────────────────────────────────────────────────

const crearCompleta = rng => {
  const ctx = rng.elegir(['fruta', 'fruta', 'receta', 'coche', 'entradas', 'cuadernos']);
  const c = CONTEXTOS[ctx], k = rng.elegir(c.ks), umax = umaxDe(ctx, k);
  const us = rng.barajar(Array.from({ length: umax }, (_, i) => i + 1)).slice(0, 4).sort((p, q) => p - q);
  const cols = columnas(ctx, us, us.map(u => k * u));
  const orden = rng.barajar([0, 1, 2, 3]);
  const huecos = [{ col: orden[1], que: 'y' }, { col: orden[2], que: 'x' }];
  return { ctx, k, cols, ref: orden[0], huecos };
};
export const generarCompleta = sinReservados(crearCompleta);
export const claveCompleta = it => `${it.ctx}|${it.k}|${it.cols.map(c => c.x).join(',')}|${it.ref}|${it.huecos.map(h => h.col + h.que).join(',')}`;

/** Lo que vale cada hueco, como Fraccion en la unidad del hueco (euros, no céntimos). */
export function valorHueco(it, h) {
  const c = CONTEXTOS[it.ctx], col = it.cols[h.col];
  if (h.que === 'x') return F(col.x);
  return c.din ? F(col.y, 100) : F(col.y);
}
export const unidadHueco = (it, h) => (h.que === 'x' ? CONTEXTOS[it.ctx].unidadX ?? null : CONTEXTOS[it.ctx].unidadY ?? null);

export function leerNumero(texto, unidad, idioma) {
  try { return deTexto(texto, { unidad: unidad ?? undefined, idioma }); } catch (e) { return null; }
}
const sinRestos = v => v !== null && v !== undefined && v !== false;

/** Errores candidatos de un hueco (Fracciones), por id; sin los que coinciden con la solución. */
export function candidatosCompleta(it, h) {
  const c = CONTEXTOS[it.ctx], ref = it.cols[it.ref], col = it.cols[h.col];
  const yUnid = v => (c.din ? F(v, 100) : F(v));
  const yr = yUnid(ref.y), xr = F(ref.x), sol = valorHueco(it, h), out = {};
  if (h.que === 'y') {
    out['razonar-sumando'] = yr.sumar(F(col.x).restar(xr));
    out['operacion-contraria'] = F(col.x).multiplicar(xr).dividir(yr);
  } else {
    out['razonar-sumando'] = xr.sumar(yUnid(col.y).restar(yr));
    out['operacion-contraria'] = yUnid(col.y).multiplicar(yr).dividir(xr);
  }
  for (const id of Object.keys(out)) if (out[id].equals(sol)) delete out[id];
  return out;
}

/** Para cada hueco: null si está bien, o el id del error. */
export function erroresDeCompleta(it, textos, idioma = 'es') {
  return it.huecos.map((h, n) => {
    const l = leerNumero(textos[n], unidadHueco(it, h), idioma);
    if (!sinRestos(l)) return 'otra-respuesta';
    const sol = cantidad(valorHueco(it, h), unidadHueco(it, h));
    if (mismoValor(l, sol)) return null;
    for (const [id, v] of Object.entries(candidatosCompleta(it, h))) if (mismoValor(l, cantidad(v, unidadHueco(it, h)))) return id;
    return 'otra-respuesta';
  });
}

// ─── Ejercicio 3: la constante («lo que vale 1») ─────────────────────────────────────────────────

const crearConstante = rng => {
  const ctx = rng.elegir(Object.keys(CTX_CONSTANTE));
  const c = CTX_CONSTANTE[ctx], k = rng.elegir(c.ks);
  const tope = c.yMax ? Math.min(c.umax, Math.floor(c.yMax / k)) : c.umax;
  const us = rng.barajar(Array.from({ length: tope - c.umin + 1 }, (_, i) => c.umin + i)).slice(0, 2).sort((p, q) => p - q);
  const xMul = c.xMul ?? 1;
  return {
    ctx, forma: rng.azar() < 0.5 ? 'frase' : 'tabla', k,
    nombre: rng.elegir(['Nora', 'Iker', 'Bruno', 'Vera', 'Teo', 'Alma', 'Gael', 'Irene', 'Marco', 'Olga', 'Hugo', 'Elsa']),
    cols: us.map(u => ({ x: u * xMul, y: k * u })),
  };
};
export const generarConstante = sinReservados(crearConstante);
export const claveConstante = it => `${it.ctx}|${it.forma}|${it.nombre}|${it.k}|${it.cols.map(c => c.x).join(',')}`;
export const solucionConstante = it => (CTX_CONSTANTE[it.ctx].din ? F(it.k, 100) : F(it.k));
const yDe = (it, n = 0) => (CTX_CONSTANTE[it.ctx].din ? F(it.cols[n].y, 100) : F(it.cols[n].y));

export function candidatosConstante(it) {
  const c = CTX_CONSTANTE[it.ctx], x = F(it.cols[0].x), y = yDe(it), sol = solucionConstante(it), out = {};
  out['dividir-al-reves'] = x.dividir(y);
  out.restar = y.restar(x);
  out.multiplicar = y.multiplicar(x);
  if (c.xMul) out['sin-pasar-a-cada-100'] = y.dividir(x);
  for (const id of Object.keys(out)) if (out[id].equals(sol)) delete out[id];
  return out;
}
export function errorDeConstante(it, texto, idioma = 'es') {
  const c = CTX_CONSTANTE[it.ctx];
  const l = leerNumero(texto, c.unidadY, idioma);
  if (!sinRestos(l)) return 'otra-respuesta';
  if (mismoValor(l, cantidad(solucionConstante(it), c.unidadY))) return null;
  for (const [id, v] of Object.entries(candidatosConstante(it))) if (mismoValor(l, cantidad(v, c.unidadY))) return id;
  return 'otra-respuesta';
}

// ─── Ejercicio 4: ¿directamente proporcionales? (banco fijo) ─────────────────────────────────────

const B = (id, si, cond, a, b, por) => ({ id, si, cond, a, b, por });
export const BANCO = [
  B('naranjas', true,
    { es: 'Nora compra naranjas. Todas las naranjas cuestan lo mismo cada kilo.', en: 'Nora buys oranges. Every kilo of oranges costs the same.' },
    { es: 'los kilos de naranjas', en: 'the kilos of oranges' }, { es: 'el precio que paga', en: 'the price she pays' },
    { es: 'Si compra el doble de kilos, paga el doble.', en: 'If she buys twice the kilos, she pays twice as much.' }),
  B('entradas', true,
    { es: 'Iker compra entradas de cine. Todas las entradas valen lo mismo.', en: 'Iker buys cinema tickets. All the tickets cost the same.' },
    { es: 'el número de entradas', en: 'the number of tickets' }, { es: 'el precio total', en: 'the total price' },
    { es: 'Con el doble de entradas, paga el doble.', en: 'With twice the tickets, he pays twice as much.' }),
  B('gasolina', true,
    { es: 'Un coche gasta lo mismo en cada kilómetro.', en: 'A car uses the same petrol in every kilometre.' },
    { es: 'los kilómetros recorridos', en: 'the kilometres driven' }, { es: 'los litros de gasolina gastados', en: 'the litres of petrol used' },
    { es: 'Al doble de kilómetros le corresponde el doble de litros.', en: 'Twice the kilometres use twice the litres.' }),
  B('arroz', true,
    { es: 'En una receta, cada persona come la misma cantidad de arroz.', en: 'In a recipe, each person eats the same amount of rice.' },
    { es: 'el número de personas', en: 'the number of people' }, { es: 'los gramos de arroz', en: 'the grams of rice' },
    { es: 'Para el doble de personas hace falta el doble de arroz.', en: 'Twice the people need twice the rice.' }),
  B('horas', true,
    { es: 'Bruno cobra lo mismo cada hora de trabajo.', en: 'Bruno is paid the same for every hour of work.' },
    { es: 'las horas que trabaja', en: 'the hours he works' }, { es: 'el dinero que gana', en: 'the money he earns' },
    { es: 'Si trabaja el doble de horas, gana el doble.', en: 'If he works twice the hours, he earns twice as much.' }),
  B('cajas', true,
    { es: 'Vera llena cajas con el mismo número de libros en cada una.', en: 'Vera fills boxes with the same number of books in each one.' },
    { es: 'el número de cajas', en: 'the number of boxes' }, { es: 'el número de libros', en: 'the number of books' },
    { es: 'Con el doble de cajas, el doble de libros.', en: 'Twice the boxes hold twice the books.' }),
  B('cuadernos', true,
    { es: 'Teo compra cuadernos. Todos los cuadernos cuestan lo mismo.', en: 'Teo buys notebooks. All the notebooks cost the same.' },
    { es: 'el número de cuadernos', en: 'the number of notebooks' }, { es: 'el dinero que gasta', en: 'the money he spends' },
    { es: 'Con el doble de cuadernos, gasta el doble.', en: 'With twice the notebooks, he spends twice as much.' }),
  B('tela', true,
    { es: 'En una tienda, cada metro de tela cuesta lo mismo.', en: 'In a shop, every metre of cloth costs the same.' },
    { es: 'los metros de tela', en: 'the metres of cloth' }, { es: 'el precio', en: 'the price' },
    { es: 'El doble de metros cuesta el doble.', en: 'Twice the metres cost twice as much.' }),
  B('pasos', true,
    { es: 'Alma camina siempre con pasos igual de largos.', en: 'Alma always walks with steps of the same length.' },
    { es: 'el número de pasos', en: 'the number of steps' }, { es: 'los metros que recorre', en: 'the metres she covers' },
    { es: 'Con el doble de pasos, recorre el doble de metros.', en: 'With twice the steps, she covers twice the metres.' }),
  B('grifo', true,
    { es: 'Un depósito está vacío. Un grifo echa siempre el mismo agua cada minuto.', en: 'A tank is empty. A tap pours the same water every minute.' },
    { es: 'los minutos con el grifo abierto', en: 'the minutes the tap is open' }, { es: 'los litros que hay en el depósito', en: 'the litres in the tank' },
    { es: 'En el doble de minutos, el doble de litros (parte de 0).', en: 'In twice the minutes, twice the litres (it starts at 0).' }),
  B('folios', true,
    { es: 'Cada paquete trae 500 folios.', en: 'Each pack has 500 sheets of paper.' },
    { es: 'el número de paquetes', en: 'the number of packs' }, { es: 'el número de folios', en: 'the number of sheets' },
    { es: 'Con el doble de paquetes, el doble de folios.', en: 'Twice the packs have twice the sheets.' }),
  B('botellas', true,
    { es: 'Todas las botellas de agua son de litro y medio.', en: 'All the bottles of water hold one and a half litres.' },
    { es: 'el número de botellas', en: 'the number of bottles' }, { es: 'los litros de agua', en: 'the litres of water' },
    { es: 'Con el doble de botellas, el doble de litros.', en: 'Twice the bottles hold twice the litres.' }),
  B('pizzas', true,
    { es: 'Cada pizza se corta en 8 trozos.', en: 'Each pizza is cut into 8 slices.' },
    { es: 'el número de pizzas', en: 'the number of pizzas' }, { es: 'el número de trozos', en: 'the number of slices' },
    { es: 'Con el doble de pizzas, el doble de trozos.', en: 'Twice the pizzas give twice the slices.' }),
  B('edad-altura', false,
    { es: 'Nora mide 140 cm con 10 años y 170 cm con 20 años.', en: 'Nora is 140 cm tall at 10 years old and 170 cm tall at 20.' },
    { es: 'la edad', en: 'the age' }, { es: 'la altura', en: 'the height' },
    { es: '20 años es el doble de 10 años, pero 170 cm no es el doble de 140 cm (el doble serían 280 cm).', en: '20 years is twice 10 years, but 170 cm is not twice 140 cm (twice would be 280 cm).' }),
  B('edad-peso', false,
    { es: 'Iker pesa 35 kg con 10 años y 65 kg con 20 años.', en: 'Iker weighs 35 kg at 10 years old and 65 kg at 20.' },
    { es: 'la edad', en: 'the age' }, { es: 'el peso', en: 'the weight' },
    { es: '20 años es el doble de 10 años, pero 65 kg no es el doble de 35 kg (el doble serían 70 kg).', en: '20 years is twice 10 years, but 65 kg is not twice 35 kg (twice would be 70 kg).' }),
  B('taxi', false,
    { es: 'En un taxi, 1 km cuesta 4,00 € y 5 km cuestan 12,00 €.', en: 'In a taxi, 1 km costs €4.00 and 5 km cost €12.00.' },
    { es: 'los kilómetros', en: 'the kilometres' }, { es: 'el precio', en: 'the price' },
    { es: '5 km son 5 veces 1 km, pero 12,00 € no son 5 veces 4,00 € (serían 20,00 €).', en: '5 km is 5 times 1 km, but €12.00 is not 5 times €4.00 (that would be €20.00).' }),
  B('paginas', false,
    { es: 'Un libro tiene 300 páginas. Iker ha leído 50 y le quedan 250; ha leído 100 y le quedan 200.', en: 'A book has 300 pages. Iker has read 50 and has 250 left; he has read 100 and has 200 left.' },
    { es: 'las páginas leídas', en: 'the pages read' }, { es: 'las páginas que quedan', en: 'the pages left' },
    { es: '100 es el doble de 50, pero 200 no es el doble de 250. Al leer más, quedan menos.', en: '100 is twice 50, but 200 is not twice 250. The more he reads, the fewer pages are left.' }),
  B('gastado', false,
    { es: 'Alma tiene 50,00 €. Si gasta 10,00 €, le quedan 40,00 €; si gasta 20,00 €, le quedan 30,00 €.', en: 'Alma has €50.00. If she spends €10.00, she has €40.00 left; if she spends €20.00, she has €30.00 left.' },
    { es: 'el dinero gastado', en: 'the money spent' }, { es: 'el dinero que le queda', en: 'the money left' },
    { es: '20,00 € es el doble de 10,00 €, pero 30,00 € no es el doble de 40,00 €. Al gastar más, queda menos.', en: '€20.00 is twice €10.00, but €30.00 is not twice €40.00. The more she spends, the less is left.' }),
  B('factura', false,
    { es: 'Una factura de móvil tiene una cuota fija. Con 100 minutos se pagan 15,00 € y con 200 minutos se pagan 20,00 €.', en: 'A phone bill has a fixed fee. With 100 minutes you pay €15.00 and with 200 minutes you pay €20.00.' },
    { es: 'los minutos', en: 'the minutes' }, { es: 'lo que se paga', en: 'the amount paid' },
    { es: '200 minutos son el doble de 100, pero 20,00 € no es el doble de 15,00 € (serían 30,00 €).', en: '200 minutes is twice 100, but €20.00 is not twice €15.00 (that would be €30.00).' }),
  B('padre', false,
    { es: 'Bruno tiene 5 años y su padre 35. Cuando Bruno tenga 10, su padre tendrá 40.', en: 'Bruno is 5 and his father is 35. When Bruno is 10, his father will be 40.' },
    { es: 'la edad de Bruno', en: 'Bruno’s age' }, { es: 'la edad de su padre', en: 'his father’s age' },
    { es: '10 años es el doble de 5, pero 40 años no es el doble de 35 (sería 70).', en: '10 years is twice 5, but 40 years is not twice 35 (that would be 70).' }),
  B('bolsa', false,
    { es: 'Teo compra naranjas y paga 1,00 € por la bolsa. 1 kg de naranjas con bolsa cuesta 3,00 € y 2 kg cuestan 5,00 €.', en: 'Teo buys oranges and pays €1.00 for the bag. 1 kg of oranges with the bag costs €3.00 and 2 kg cost €5.00.' },
    { es: 'los kilos de naranjas', en: 'the kilos of oranges' }, { es: 'el precio con la bolsa', en: 'the price with the bag' },
    { es: '2 kg es el doble de 1 kg, pero 5,00 € no es el doble de 3,00 € (serían 6,00 €).', en: '2 kg is twice 1 kg, but €5.00 is not twice €3.00 (that would be €6.00).' }),
  B('grifo-lleno', false,
    { es: 'Un depósito ya tiene 20 L. Un grifo echa agua: con 1 minuto hay 50 L y con 2 minutos hay 80 L.', en: 'A tank already has 20 L. A tap pours water: after 1 minute there are 50 L and after 2 minutes there are 80 L.' },
    { es: 'los minutos', en: 'the minutes' }, { es: 'los litros que hay', en: 'the litres in the tank' },
    { es: '2 minutos son el doble de 1, pero 80 L no son el doble de 50 L (serían 100 L).', en: '2 minutes is twice 1, but 80 L is not twice 50 L (that would be 100 L).' }),
  B('montana', false,
    { es: 'Vera empieza a subir desde 1000 m de altura. Con 1 hora está a 1300 m y con 2 horas a 1600 m.', en: 'Vera starts climbing from 1000 m. After 1 hour she is at 1300 m and after 2 hours at 1600 m.' },
    { es: 'las horas de subida', en: 'the hours climbing' }, { es: 'la altura a la que está', en: 'the height she is at' },
    { es: '2 horas son el doble de 1, pero 1600 m no son el doble de 1300 m (serían 2600 m).', en: '2 hours is twice 1, but 1600 m is not twice 1300 m (that would be 2600 m).' }),
  B('anos-faltan', false,
    { es: 'Con 4 años, a Vera le faltan 14 para tener 18. Con 10 años, le faltan 8.', en: 'At 4 years old, Vera has 14 years to go until she is 18. At 10, she has 8 to go.' },
    { es: 'los años de Vera', en: 'Vera’s age' }, { es: 'los años que le faltan para tener 18', en: 'the years left until she is 18' },
    { es: 'Cuando sus años aumentan, los que le faltan disminuyen. En una proporcionalidad directa, los dos aumentan.', en: 'When her age goes up, the years left go down. In direct proportion, both go up.' }),
  B('envio', false,
    { es: 'Una tienda cobra 5,00 € de envío. 2 camisetas cuestan 25,00 € con el envío y 4 camisetas cuestan 45,00 €.', en: 'A shop charges €5.00 for delivery. 2 T-shirts cost €25.00 with delivery and 4 T-shirts cost €45.00.' },
    { es: 'el número de camisetas', en: 'the number of T-shirts' }, { es: 'el precio con el envío', en: 'the price with delivery' },
    { es: '4 camisetas son el doble de 2, pero 45,00 € no es el doble de 25,00 € (serían 50,00 €).', en: '4 T-shirts is twice 2, but €45.00 is not twice €25.00 (that would be €50.00).' }),
];
export const generarDirectas = rng => rng.elegir(BANCO);
export const claveDirectas = it => it.id;
export const errorDeDirectas = (it, dijoSi) => (dijoSi === it.si ? null : (it.si ? 'proporcional-como-no-proporcional' : 'no-proporcional-como-proporcional'));
