// LÓGICA PURA de «Pasa al otro lado» (unidad 6, semana 2, sesiones 6-7): transponer con números,
// ecuaciones de una y dos operaciones, `ax = b` frente a `bx = a` y comprobar una resolución
// (U6-2C-06 a 2C-11). Sin DOM. Todo exacto, con Fraccion: nunca coma flotante ni eval.
//
// Alcance (ver ENTREGA de la tarea 149): una sola letra, x; coeficientes y números enteros; sin x²,
// sin x en los dos miembros, sin paréntesis, sin denominadores salvo `x/n` (con n entero) y sin
// ecuaciones sin solución. Soluciones negativas desde los ítems medios (acta, punto g).
//
// Un ítem es un objeto plano: las fracciones van como { num, den }.

import { Fraccion } from '../_comun/fracciones.js';
import { deEcuacion, ERRORES_TIPICOS, huella } from '../_comun/algebra.js';

const MENOS = '−';

// ─── Números ──────────────────────────────────────────────────────────────────────────────────

/** Un entero como texto, con el menos U+2212. */
export const num = n => `${n < 0 ? MENOS : ''}${Math.abs(n)}`;
/** Un entero entre paréntesis si es negativo (para ponerlo detrás de una operación). */
export const sub = n => (n < 0 ? `(${MENOS}${Math.abs(n)})` : `${n}`);

export const F = p => new Fraccion(p.num, p.den);
export const plano = f => { const s = (f instanceof Fraccion ? f : F(f)).simplificar(); return { num: s.num, den: s.den }; };
const igual = (a, b) => a.equals(b);
/** Un número (entero o fracción irreducible) como texto: −5, 1/4, −3/2. */
export const solTexto = p => { const f = F(p).simplificar(); return f.den === 1 ? num(f.num) : `${num(f.num)}/${f.den}`; };

/** Lo que escribe el alumno como solución: «7», «x = 7», «−5», «x=−5», «3/12». Null si no es un número. */
export function leerSolucion(texto, leer) {
  const t = String(texto ?? '').replace(/^\s*[xX]\s*=\s*/, '');
  return leer(t);
}

/** Pone en cursiva la x de un texto que solo lleva matemáticas. */
export const ital = t => t.replace(/x/g, '<i>x</i>');

// ─── Errores ──────────────────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  // ejercicio 1
  'misma-operacion': { es: 'Ha pasado el número al otro lado sin cambiar la operación', en: 'Moved the number across without changing the operation' },
  'otra-operacion': { es: 'Ha puesto una operación que no es la contraria', en: 'Put an operation that is not the opposite one' },
  'numero-que-no-pasa': { es: 'Ha puesto un número que no es el que cambia de lado', en: 'Put a number that is not the one that changes sides' },
  // ejercicios 2-5
  'olvida-pasar': { es: 'Ha olvidado pasar el número al otro lado', en: 'Forgot to move the number across' },
  'signo-cambiado': { es: 'Ha cambiado el signo de la solución', en: 'Changed the sign of the solution' },
  'dividir-en-vez-de-multiplicar': { es: 'Ha dividido en vez de multiplicar', en: 'Divided instead of multiplying' },
  'pasar-divisor-restando': { es: 'Ha pasado restando el número que divide a la x', en: 'Subtracted the number that divides x instead of multiplying' },
  // ejercicio 3
  'resta-al-reves': { es: 'Ha restado al revés', en: 'Subtracted the wrong way round' },
  'divide-solo-un-termino': { es: 'Ha dividido solo el término con x', en: 'Divided only the term with x' },
  'multiplicar-solo-un-termino': { es: 'Ha multiplicado solo el término con x', en: 'Multiplied only the term with x' },
  // ejercicio 5
  'da-por-mala': { es: 'Ha dado por mala una resolución que estaba bien', en: 'Said a correct solution was wrong' },
  'otra-respuesta': { es: 'Otra respuesta', en: 'Another answer' },
};
export const nombreError = id => ERRORES_TIPICOS[id]?.nombre ?? ERRORES_PROPIOS[id];

// ─── Casos reservados (hoja y examen) ─────────────────────────────────────────────────────────
// A fecha 2026-11-09 la hoja y el examen de la semana 2 de la U6 no existen (no hay carpeta
// `hojas-de-ejercicios/` ni `exámenes-semanales/`): no hay nada que excluir. Si se escriben, sus
// ecuaciones se añaden aquí por la huella FNV-1a de su forma canónica (`huellaCanonica` de
// `_comun/algebra.js`), calculada fuera del repositorio y sin escribir nunca el caso en claro.

export const HUELLAS_RESERVADAS = new Set([]);
/** La huella de una ecuación escrita como texto (forma canónica: `x + 3 = 10` y `3 + x = 10`, la misma). */
export const huellaDe = texto => huella(deEcuacion(texto).clave());
export const esReservado = texto => HUELLAS_RESERVADAS.has(huellaDe(texto));

/** Calcula una cuenta con + − · : sin paréntesis (con la jerarquía): «9 − 3», «3 · 2 + 4». Devuelve Fraccion. */
export function calcular(texto) {
  const toks = String(texto).replace(/−/g, '-').match(/\d+|[-+·:]/g) ?? [];
  const terminos = [];  // [signo, Fraccion]
  let signo = 1, valor = null, op = null;
  const cierra = () => { terminos.push(valor.multiplicar(signo)); };
  for (const t of toks) {
    if (/\d/.test(t)) {
      const n = new Fraccion(Number(t));
      if (valor === null) valor = n;
      else valor = op === '·' ? valor.multiplicar(n) : valor.dividir(n);
    } else if (t === '·' || t === ':') op = t;
    else { cierra(); signo = t === '-' ? -1 : 1; valor = null; }
  }
  cierra();
  return terminos.reduce((a, b) => a.sumar(b)).simplificar();
}

// ─── Ejercicio 1: Con números ─────────────────────────────────────────────────────────────────
// Niveles 1-2 (una operación): el alumno elige la operación contraria en `a = c □ b`.
// Bidireccional y nivel 4 (con jerarquía): el alumno escribe el número que falta en el hueco.
// Todo con naturales: aquí no hay ecuaciones, solo igualdades que se comprueban con las cuentas.

export const OPS = ['+', MENOS, '·', ':'];
const NOMBRE_OP = { '+': 'suma', [MENOS]: 'resta', '·': 'producto', ':': 'cociente' };
export const nombreOp = op => NOMBRE_OP[op];
export const HUECO = '□';

/** ¿Es verdadero `izq = der op b`? (el cociente, sin decimales: izq · b = der) */
export const verdadera = (op, izq, der, b) => {
  switch (op) {
    case '+': return izq === der + b;
    case MENOS: return izq === der - b;
    case '·': return izq === der * b;
    default: return izq * b === der;
  }
};

const FORMAS_OP = {
  // partida, llegada (con el hueco de la operación), correcta, misma (la que no cambia)
  suma: (a, b) => ({ c: a + b, partida: c => `${a} + ${b} = ${c}`, izq: a, der: a + b, b, correcta: MENOS, misma: '+' }),
  resta: (a, b) => ({ c: a + b, partida: c => `${c} ${MENOS} ${b} = ${a}`, izq: a + b, der: a, b, correcta: '+', misma: MENOS }),
  producto: (a, b) => ({ c: a * b, partida: c => `${a} · ${b} = ${c}`, izq: a, der: a * b, b, correcta: ':', misma: '·' }),
  cociente: (a, b) => ({ c: a * b, partida: c => `${c} : ${b} = ${a}`, izq: a * b, der: a, b, correcta: '·', misma: ':' }),
};

export function generarOperador(rng) {
  for (let i = 0; i < 500; i++) {
    const forma = rng.elegir(['suma', 'resta', 'producto', 'cociente']);
    const a = forma === 'suma' || forma === 'resta' ? rng.entero(2, 15) : rng.entero(2, 9);
    const b = forma === 'suma' || forma === 'resta' ? rng.entero(2, 15) : rng.entero(2, 9);
    const f = FORMAS_OP[forma](a, b);
    // Una sola operación de las cuatro tiene que hacer verdadera la igualdad de llegada.
    if (OPS.filter(op => verdadera(op, f.izq, f.der, f.b)).length !== 1) continue;
    return {
      tipo: 'operador', forma, a, b, c: f.c,
      partida: f.partida(f.c),
      llegada: `${f.izq} = ${f.der} ${HUECO} ${f.b}`,
      izq: f.izq, der: f.der, bnum: f.b,
      respuesta: f.correcta, misma: f.misma,
    };
  }
  throw new Error('transposicion: no sale un ítem del ejercicio 1 (operador)');
}

export function generarHueco(rng) {
  const forma = rng.elegir(['bidi1', 'bidi2', 'jer1', 'jer2']);
  for (let i = 0; i < 500; i++) {
    let it;
    if (forma === 'bidi1') { // a − b = c + d → a − d = c + □
      const b = rng.entero(2, 9), c = rng.entero(2, 12), d = rng.entero(2, 9), a = b + c + d;
      it = { partida: `${a} ${MENOS} ${b} = ${c} + ${d}`, llegada: `${a} ${MENOS} ${d} = ${c} + ${HUECO}`, respuesta: b };
    } else if (forma === 'bidi2') { // a + b = c − d → a + d = c − □
      const a = rng.entero(2, 12), b = rng.entero(2, 9), d = rng.entero(2, 9), c = a + b + d;
      it = { partida: `${a} + ${b} = ${c} ${MENOS} ${d}`, llegada: `${a} + ${d} = ${c} ${MENOS} ${HUECO}`, respuesta: b };
    } else if (forma === 'jer1') { // a · b + c = d → a · b = d − □
      const a = rng.entero(2, 9), b = rng.entero(2, 9), c = rng.entero(2, 12), d = a * b + c;
      it = { partida: `${a} · ${b} + ${c} = ${d}`, llegada: `${a} · ${b} = ${d} ${MENOS} ${HUECO}`, respuesta: c };
    } else { // jer2: a · b − c = d → a · b = d + □
      const a = rng.entero(2, 9), b = rng.entero(2, 9), p = a * b;
      const c = rng.entero(2, Math.min(12, p - 1)), d = p - c;
      it = { partida: `${a} · ${b} ${MENOS} ${c} = ${d}`, llegada: `${a} · ${b} = ${d} + ${HUECO}`, respuesta: c };
    }
    if (it.respuesta >= 2) return { tipo: 'hueco', forma, ...it, visibles: (it.partida.match(/\d+/g) ?? []).map(Number) };
  }
  throw new Error('transposicion: no sale un ítem del ejercicio 1 (hueco)');
}

export function generarConNumeros(rng) {
  return rng.entero(1, 2) === 1 ? generarOperador(rng) : generarHueco(rng);
}

/** null si acierta; si no, el nombre del error. `respuesta` es la operación (operador) o el número (hueco). */
export function errorDeConNumeros(item, respuesta) {
  if (item.tipo === 'operador') {
    if (respuesta === item.respuesta) return null;
    return respuesta === item.misma ? 'misma-operacion' : 'otra-operacion';
  }
  if (respuesta === item.respuesta) return null;
  return item.visibles.includes(respuesta) ? 'numero-que-no-pasa' : 'otra-respuesta';
}

// ─── Ejercicios 2 y 5: ecuaciones de una operación ────────────────────────────────────────────
// { forma: 'suma' | 'resta' | 'producto' | 'cociente', k (suma y resta: x + k = c), A (producto),
//   n (cociente), c, delante (5 + x = 3) }.

export function textoEcuacion(it) {
  switch (it.forma) {
    case 'suma': return it.delante ? `${it.k} + x = ${it.c}` : `x + ${it.k} = ${it.c}`;
    case 'resta': return `x ${MENOS} ${-it.k} = ${it.c}`;
    case 'producto': return `${num(it.A)}x = ${num(it.c)}`;
    default: return `x/${it.n} = ${num(it.c)}`;
  }
}

/** La solución exacta, sacada de la ecuación tal como se escribe (no de cómo se generó). */
export const solucionDe = it => deEcuacion(textoEcuacion(it)).resolver();

const fr = (a, b = 1) => new Fraccion(a, b).simplificar();

/** Lo que sale de cada error con esta ecuación: [{ error, valor: Fraccion | null }]. */
export function candidatos(it) {
  const s = solucionDe(it);
  switch (it.forma) {
    case 'suma':
    case 'resta': {
      const k = it.k, c = it.c;
      return [
        { error: 'transponer-sin-signo', valor: fr(c + k) },
        { error: 'olvida-pasar', valor: fr(c) },
        s.num < 0 ? { error: 'signo-de-la-solucion', valor: s.opuesta().simplificar() } : { error: 'signo-cambiado', valor: s.opuesta().simplificar() },
      ];
    }
    case 'producto': {
      const A = it.A, c = it.c;
      return [
        { error: 'pasar-factor-restando', valor: fr(c - A) },
        { error: 'multiplicar-en-vez-de-dividir', valor: fr(c * A) },
        { error: 'invertir-coeficiente', valor: c === 0 ? null : fr(A, c) },
        { error: 'signo-al-dividir', valor: A < 0 ? fr(c, -A) : null },
        { error: 'signo-cambiado', valor: s.opuesta().simplificar() },
      ];
    }
    default: {
      const n = it.n, c = it.c;
      return [
        { error: 'dividir-en-vez-de-multiplicar', valor: fr(c, n) },
        { error: 'pasar-divisor-restando', valor: fr(c - n) },
        { error: 'olvida-pasar', valor: fr(c) },
      ];
    }
  }
}

/** Solo los candidatos con valor, distinto del correcto y distintos entre sí (se queda el primero). */
export function buenos(cands, correcta) {
  const salida = [];
  for (const c of cands) {
    if (!c.valor || igual(c.valor, correcta) || salida.some(b => igual(b.valor, c.valor))) continue;
    salida.push(c);
  }
  return salida;
}

/** El nombre del error de lo que ha escrito el alumno (null si acierta). */
export function clasificar(cands, correcta, valor) {
  if (igual(valor, correcta)) return null;
  return cands.find(c => c.valor && igual(c.valor, valor))?.error ?? 'otra-respuesta';
}

const razonable = f => Math.abs(f.num) <= 200 && f.den <= 40;

/** Una ecuación de una operación (sin tipo ni opciones). `negativas`: permite soluciones negativas. */
function ecuacionUnaOperacion(rng, negativas) {
  const forma = rng.elegir(['suma', 'suma', 'resta', 'producto', 'producto', 'cociente']);
  switch (forma) {
    case 'suma': {
      const delante = rng.entero(0, 1) === 1;
      if (negativas && rng.entero(1, 3) === 1) { const k = rng.entero(3, 12); return { forma, k, c: rng.entero(1, k - 1), delante }; }
      const k = rng.entero(2, 12);
      return { forma, k, c: rng.entero(2, 15) + k, delante };
    }
    case 'resta': { const b = rng.entero(2, 12); return { forma, k: -b, c: rng.entero(1, 12), delante: false }; }
    case 'producto': {
      const a = rng.entero(2, 9), t = rng.entero(2, 12);
      const v = negativas ? rng.entero(0, 3) : 0;
      if (v === 1) return { forma, A: a, c: -a * t };       // 3x = −12
      if (v === 2) return { forma, A: -a, c: a * t };       // −3x = 12
      if (v === 3) return { forma, A: -a, c: -a * t };      // −3x = −12
      return { forma, A: a, c: a * t };
    }
    default: return { forma, n: rng.entero(2, 9), c: rng.entero(2, 10) };
  }
}

/** Una ecuación de una operación con al menos tres distractores válidos, no reservada. */
export function nuevaUnaOperacion(rng, { negativas = false } = {}) {
  for (let i = 0; i < 500; i++) {
    const it = ecuacionUnaOperacion(rng, negativas);
    if (esReservado(textoEcuacion(it))) continue;
    const s = solucionDe(it);
    if (!(s instanceof Fraccion) || !razonable(s)) continue;
    const bs = buenos(candidatos(it), s);
    if (bs.length < 3 || bs.some(b => !razonable(b.valor))) continue;
    return it;
  }
  throw new Error('transposicion: no sale una ecuación de una operación');
}

export function generarUnaOperacion(rng) {
  const it = nuevaUnaOperacion(rng, { negativas: true });
  const tipo = rng.elegir(['escribir', 'elegir']);
  const s = solucionDe(it);
  const item = { ...it, tipo, solucion: plano(s) };
  if (tipo === 'elegir') {
    const tres = rng.barajar(buenos(candidatos(it), s)).slice(0, 3);
    item.opciones = rng.barajar([
      { r: plano(s), correcta: true, error: null },
      ...tres.map(c => ({ r: plano(c.valor), correcta: false, error: c.error })),
    ]);
  }
  return item;
}

export const errorDeUnaOperacion = (item, valor) => clasificar(candidatos(item), F(item.solucion), valor);

/** La línea donde se pasa el número, con el error o sin él: «x = 12 − 7 = 5». Solo matemáticas, con x suelta. */
export function linea(it, error = null) {
  const s = solucionDe(it);
  const v = error === null ? s : candidatos(it).find(c => c.error === error).valor;
  const R = solTexto(plano(v));
  switch (it.forma) {
    case 'suma':
    case 'resta': {
      const { k, c } = it;
      if (error === null) return it.forma === 'suma' ? `x = ${c} ${MENOS} ${k} = ${R}` : `x = ${c} + ${-k} = ${R}`;
      if (error === 'transponer-sin-signo') return `x = ${c} ${k > 0 ? '+' : MENOS} ${Math.abs(k)} = ${R}`;
      if (error === 'olvida-pasar') return `x = ${c}`;
      return `x = ${R}`;
    }
    case 'producto': {
      const { A, c } = it;
      if (error === null) return `x = ${num(c)} : ${sub(A)} = ${R}`;
      if (error === 'pasar-factor-restando') return `x = ${num(c)} ${MENOS} ${sub(A)} = ${R}`;
      if (error === 'multiplicar-en-vez-de-dividir') return `x = ${num(c)} · ${sub(A)} = ${R}`;
      if (error === 'invertir-coeficiente') return `x = ${num(A)} : ${sub(c)} = ${R}`;
      if (error === 'signo-al-dividir') return `x = ${num(c)} : ${-A} = ${R}`;
      return `x = ${R}`;
    }
    default: {
      const { n, c } = it;
      if (error === null) return `x = ${c} · ${n} = ${R}`;
      if (error === 'dividir-en-vez-de-multiplicar') return `x = ${c} : ${n} = ${R}`;
      if (error === 'pasar-divisor-restando') return `x = ${c} ${MENOS} ${n} = ${R}`;
      return `x = ${c}`;
    }
  }
}

/** La comprobación sustituyendo la solución correcta: «5 + 7 = 12». */
export function comprobacion(it) {
  const s = plano(solucionDe(it)), sn = s.num; // la solución de estos ítems es siempre entera
  switch (it.forma) {
    case 'suma': return it.delante ? `${it.k} + ${sub(sn)} = ${it.c}` : `${num(sn)} + ${it.k} = ${it.c}`;
    case 'resta': return `${num(sn)} ${MENOS} ${-it.k} = ${it.c}`;
    case 'producto': return `${num(it.A)} · ${sub(sn)} = ${num(it.c)}`;
    default: return `${sn} : ${it.n} = ${it.c}`;
  }
}

// ─── Ejercicio 3: Dos operaciones, paso a paso ────────────────────────────────────────────────
// a·x + b = c (b con signo, a de 2 a 9) o x/n + b = c. El alumno elige el paso que deja la x con su
// coeficiente en un lado y los números en el otro (primero lo que suma o resta); después escribe x.

const eq = (izq, der, derecha) => (derecha ? `${der} = ${izq}` : `${izq} = ${der}`);

export function generarDosOperaciones(rng) {
  for (let i = 0; i < 500; i++) {
    const cociente = rng.entero(1, 5) === 1;
    const derecha = rng.entero(1, 4) === 1;
    const b = rng.elegir([1, -1]) * rng.entero(1, 12);
    let a, n, s, c;
    if (cociente) { n = rng.entero(2, 6); s = n * rng.entero(2, 8); c = s / n + b; a = 1; }
    else { a = rng.entero(2, 9); s = rng.entero(1, 12); c = a * s + b; n = 1; }
    if (c < 1 || c > 100) continue;
    const bTxt = `${b > 0 ? '+' : MENOS} ${Math.abs(b)}`;
    const x = cociente ? `x/${n}` : `${a}x`;
    const original = `${x} ${bTxt} = ${c}`;
    if (esReservado(original)) continue;
    const contrario = b > 0 ? MENOS : '+', mismo = b > 0 ? '+' : MENOS;
    const mal = [
      { texto: `${x} = ${c} ${mismo} ${Math.abs(b)}`, error: 'transponer-sin-signo' },
      cociente
        ? { texto: `x ${bTxt} = ${c} ${MENOS} ${n}`, error: 'pasar-divisor-restando' }
        : { texto: `x ${bTxt} = ${c} ${MENOS} ${a}`, error: 'pasar-factor-restando' },
      cociente
        ? { texto: `x ${bTxt} = ${c}`, error: 'multiplicar-solo-un-termino' }
        : { texto: `x ${bTxt} = ${c}`, error: 'divide-solo-un-termino' },
      { texto: `${x} = ${num(b)} ${MENOS} ${c}`, error: 'resta-al-reves' },
    ];
    const buena = { texto: `${x} = ${c} ${contrario} ${Math.abs(b)}`, error: null, correcta: true };
    const q0 = deEcuacion(original);
    // La buena es equivalente a la original; las malas, no, y ningún par comparte solución.
    if (!q0.equivalente(deEcuacion(buena.texto))) continue;
    const malas = mal.filter(m => !q0.equivalente(deEcuacion(m.texto)));
    const vistas = [q0.resolver()];
    const utiles = [];
    for (const m of rng.barajar(malas)) {
      const sol = deEcuacion(m.texto).resolver();
      if (!(sol instanceof Fraccion) || vistas.some(v => igual(v, sol))) continue;
      vistas.push(sol);
      utiles.push(m);
    }
    if (utiles.length < 3) continue;
    const opciones = rng.barajar([buena, ...utiles.slice(0, 3).map(m => ({ ...m, correcta: false }))])
      .map(o => ({ texto: o.texto, correcta: Boolean(o.correcta), error: o.error }));
    return {
      a, n, b, c, cociente, derecha,
      ecuacion: eq(original.split(' = ')[0], String(c), derecha),
      opciones: opciones.map(o => ({ ...o, texto: eq(o.texto.split(' = ')[0], o.texto.split(' = ')[1], derecha) })),
      solucion: { num: s, den: 1 },
    };
  }
  throw new Error('transposicion: no sale un ítem del ejercicio 3');
}

/** Los candidatos del segundo paso: la ecuación `a·x = r` (o `x/n = r`) ya con el número pasado. */
export function segundoPaso(item) {
  const r = item.cociente ? item.solucion.num / item.n : item.solucion.num * item.a;
  return item.cociente ? { forma: 'cociente', n: item.n, c: r } : { forma: 'producto', A: item.a, c: r };
}
export const errorDeDosOperaciones = (item, valor) => {
  const it = segundoPaso(item);
  return clasificar(candidatos(it), F(item.solucion), valor);
};

/** El texto del paso bueno (`2x = 17 − 5`) con la ecuación original: lo usa el feedback. */
export const pasoBueno = item => item.opciones.find(o => o.correcta).texto;

// ─── Ejercicio 4: 3x = 12 frente a 12x = 3 ────────────────────────────────────────────────────
// Los mismos dos números, de las dos maneras: `3x = 12` (x = 4) y `12x = 3` (x = 1/4). El alumno da la
// solución como número entero o fracción irreducible, o la elige entre cuatro.

export function generarFrente(rng) {
  for (let i = 0; i < 500; i++) {
    // La mitad de las veces, uno múltiplo del otro (solución entera o 1/k); si no, al azar (fracción).
    const p = rng.entero(2, 12);
    const g = rng.entero(0, 1) === 1 && p <= 7 ? p * rng.entero(2, Math.floor(15 / p)) : rng.entero(2, 15);
    if (p === g) continue;
    const pequeno = Math.min(p, g), grande = Math.max(p, g);
    const inverso = rng.entero(0, 1) === 1;
    const coef = inverso ? grande : pequeno, rhs = inverso ? pequeno : grande;
    const v = rng.entero(1, 5); // 1: −coef · x = rhs · 2: coef · x = −rhs
    const A = v === 1 ? -coef : coef, C = v === 2 ? -rhs : rhs;
    const it = { forma: 'producto', A, c: C };
    const texto = textoEcuacion(it);
    if (esReservado(texto)) continue;
    const s = solucionDe(it);
    const al = s.simplificar();
    const bs = buenos(candidatos(it), s);
    if (bs.length < 3 || bs.some(b => !razonable(b.valor))) continue;
    const tipo = rng.elegir(['escribir', 'elegir']);
    const item = {
      tipo, A, c: C, pequeno, grande, inverso, solucion: { num: al.num, den: al.den },
      // La ecuación con los mismos números al revés, siempre en positivo: su solución es la inversa.
      otra: { A: inverso ? pequeno : grande, c: inverso ? grande : pequeno },
    };
    if (tipo === 'elegir') {
      item.opciones = rng.barajar([
        { r: plano(s), correcta: true, error: null },
        ...rng.barajar(bs).slice(0, 3).map(c => ({ r: plano(c.valor), correcta: false, error: c.error })),
      ]);
    }
    return item;
  }
  throw new Error('transposicion: no sale un ítem del ejercicio 4');
}

export const errorDeFrente = (item, valor) => clasificar(candidatos({ forma: 'producto', A: item.A, c: item.c }), F(item.solucion), valor);
export const textoFrente = item => textoEcuacion({ forma: 'producto', A: item.A, c: item.c });

// ─── Ejercicio 5: Comprueba y corrige ─────────────────────────────────────────────────────────

export function generarComprueba(rng) {
  const it = nuevaUnaOperacion(rng, { negativas: true });
  const s = solucionDe(it);
  const correcta = rng.entero(0, 1) === 1;
  if (correcta) return { ...it, buena: true, error: null, mostrada: plano(s), solucion: plano(s), linea: linea(it) };
  const mal = rng.elegir(buenos(candidatos(it), s));
  return { ...it, buena: false, error: mal.error, mostrada: plano(mal.valor), solucion: plano(s), linea: linea(it, mal.error) };
}

/** Segunda parte (solo si estaba mal y el alumno lo vio): el error de la solución que escribe. */
export const errorDeCorrige = (item, valor) => clasificar(candidatos(item), F(item.solucion), valor);

// ─── Claves (para no repetir ítems en una sesión) ─────────────────────────────────────────────

export function claveDe(item) {
  if (item.tipo === 'operador') return `o:${item.partida}`;
  if (item.tipo === 'hueco') return `h:${item.partida}`;
  if (item.opciones && item.ecuacion) return `d:${item.ecuacion}`;
  if (item.otra) return `f:${item.A}:${item.c}:${item.tipo}`;
  if (item.buena !== undefined) return `c:${textoEcuacion(item)}:${item.mostrada.num}/${item.mostrada.den}`;
  return `u:${textoEcuacion(item)}:${item.tipo}`;
}
