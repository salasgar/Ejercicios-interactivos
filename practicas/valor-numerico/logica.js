// LÓGICA PURA de «Valor numérico» (unidad 6, semana 1, sesión 2): sustituir la letra por un número y
// calcular (U6-1C-05, 1C-06, 1C-07). Sin DOM. Todo exacto, con Fraccion: nunca coma flotante ni eval.
//
// Alcance (ver ENTREGA de la tarea 146): expresiones 3x + 2, 2 + 3x, 3x − 2, 10 − 2x y 2(x − 1);
// SIN x² (1C-09 sigue siendo propuesta pendiente) y SIN ecuaciones (el ejercicio 3 busca la
// expresión que vale N, no resuelve nada). Valores de x: natural, negativo (entre paréntesis al
// sustituir) o decimal sencillo (0,5; 1,5; 2,5).
//
// Un ítem es un objeto plano: las fracciones van como { num, den }.

import { Fraccion } from '../_comun/fracciones.js';
import { lineal, ERRORES_TIPICOS, huella } from '../_comun/algebra.js';

const MENOS = '−';
const simp = f => f.simplificar();

// ─── Números ──────────────────────────────────────────────────────────────────────────────────

export const F = p => new Fraccion(p.num, p.den);
export const plano = f => { const s = f.simplificar(); return { num: s.num, den: s.den }; };
const igual = (a, b) => a.equals(b);

/** Un número como texto: 12, −8, 0,5 / 0.5 (si no se puede en decimal, 1/3). */
export function numTexto(x, idioma = 'es') {
  const f = (x instanceof Fraccion ? x : F(x)).simplificar();
  const signo = f.num < 0 ? MENOS : '';
  const a = Math.abs(f.num);
  if (f.den === 1) return `${signo}${a}`;
  for (let k = 1; k <= 4; k++) {
    const m = 10 ** k;
    if (m % f.den === 0) {
      const cifras = String(a * (m / f.den)).padStart(k + 1, '0');
      const t = `${cifras.slice(0, -k)}.${cifras.slice(-k)}`.replace(/0+$/, '');
      return `${signo}${idioma === 'es' ? t.replace('.', ',') : t}`;
    }
  }
  return `${signo}${a}/${f.den}`;
}

/** El número que se sustituye: entre paréntesis si es negativo. */
export const sustituido = (x, idioma = 'es') => {
  const f = x instanceof Fraccion ? x : F(x);
  const t = numTexto(f, idioma);
  return f.num < 0 ? `(${t})` : t;
};

// ─── Expresiones ──────────────────────────────────────────────────────────────────────────────
// { forma: 'lineal', a, b, delante } → ax + b (delante: b + ax; con a < 0 siempre b − |a|x)
// { forma: 'parentesis', k, c }      → k(x + c)

export const lineal_ = e => lineal(e.a, e.b);

export function valorDe(e, v) {
  const x = v instanceof Fraccion ? v : F(v);
  return (e.forma === 'parentesis' ? x.sumar(e.c).multiplicar(e.k) : lineal_(e).evaluar(x)).simplificar();
}

/** La expresión en texto plano: «3x + 2», «10 − 2x», «2(x − 1)». */
export function textoDe(e) {
  if (e.forma === 'parentesis') return `${e.k}(x ${e.c < 0 ? MENOS : '+'} ${Math.abs(e.c)})`;
  return lineal_(e).aTexto('es', { constanteDelante: e.delante });
}
/** La expresión en HTML (la letra en cursiva). */
export function htmlDe(e) {
  if (e.forma === 'parentesis') return `${e.k}(<i>x</i> ${e.c < 0 ? MENOS : '+'} ${Math.abs(e.c)})`;
  return lineal_(e).aHtml({ constanteDelante: e.delante });
}
export const claveExpr = e => (e.forma === 'parentesis' ? `p:${e.k}:${e.c}` : lineal_(e).clave());

/** Una expresión de la forma pedida (o al azar). */
export function expresion(rng, forma = null) {
  const f = forma ?? rng.elegir(['A', 'A', 'B', 'C', 'P']);
  switch (f) {
    case 'A': return { forma: 'lineal', a: rng.entero(2, 9), b: rng.entero(1, 9), delante: rng.entero(0, 1) === 1 };
    case 'B': return { forma: 'lineal', a: rng.entero(2, 9), b: -rng.entero(1, 9), delante: false };
    case 'C': return { forma: 'lineal', a: -rng.entero(2, 5), b: rng.entero(6, 20), delante: true };
    default: { const c = rng.entero(1, 5); return { forma: 'parentesis', k: rng.entero(2, 5), c: rng.entero(0, 1) ? c : -c }; }
  }
}

/** El valor de x: natural, negativo o decimal sencillo. */
export function valorX(rng, { decimales = true } = {}) {
  const r = rng.entero(1, decimales ? 9 : 8);
  if (r <= 5) return { num: rng.entero(2, 9), den: 1 };
  if (r <= 8) return { num: -rng.entero(1, 6), den: 1 };
  return { num: rng.elegir([1, 3, 5]), den: 2 };
}

// ─── Errores ──────────────────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  'suma-en-vez-de-multiplicar': { es: 'Ha sumado en vez de multiplicar', en: 'Added instead of multiplying' },
  'resta-al-reves': { es: 'Ha restado al revés', en: 'Subtracted the wrong way round' },
  'multiplica-solo-el-primero': { es: 'Solo ha multiplicado el primer término del paréntesis', en: 'Multiplied only the first term in the brackets' },
  'olvida-el-factor': { es: 'Ha olvidado multiplicar por el número de fuera', en: 'Forgot to multiply by the number outside' },
  'otra-respuesta': { es: 'Otra respuesta', en: 'Another answer' },
};
export const nombreError = id => ERRORES_TIPICOS[id]?.nombre ?? ERRORES_PROPIOS[id];


/** Lo que sale de cada error con esta expresión y este valor: [{ error, valor: Fraccion | null }]. */
export function candidatos(e, v) {
  const x = v instanceof Fraccion ? v : F(v);
  if (e.forma === 'parentesis') {
    const dentro = x.sumar(e.c);
    return [
      { error: 'multiplica-solo-el-primero', valor: simp(x.multiplicar(e.k).sumar(e.c)) },
      { error: 'suma-en-vez-de-multiplicar', valor: simp(x.sumar(e.k).sumar(e.c)) },
      { error: 'olvida-el-factor', valor: simp(dentro) },
      { error: 'signo-al-sustituir', valor: x.num < 0 ? simp(x.opuesta().sumar(e.c).multiplicar(e.k)) : null },
    ];
  }
  const l = lineal_(e);
  const ap = Math.abs(e.a);
  let suma, alReves = null;
  if (e.a < 0) { suma = new Fraccion(e.b).restar(ap).sumar(x); alReves = x.multiplicar(ap).restar(e.b); }
  else suma = new Fraccion(ap).sumar(x).sumar(e.b);
  return [
    { error: 'yuxtaponer-al-sustituir', valor: ERRORES_TIPICOS['yuxtaponer-al-sustituir'].fn(l, x) },
    { error: 'signo-al-sustituir', valor: ERRORES_TIPICOS['signo-al-sustituir'].fn(l, x) },
    { error: 'jerarquia-al-sustituir', valor: ERRORES_TIPICOS['jerarquia-al-sustituir'].fn(l, x, { constanteDelante: e.delante || e.a < 0 }) },
    { error: 'suma-en-vez-de-multiplicar', valor: simp(suma) },
    { error: 'resta-al-reves', valor: alReves && simp(alReves) },
  ];
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

// ─── Casos reservados (hoja y examen) ─────────────────────────────────────────────────────────
// A fecha 2026-11-09 la hoja y el examen de la U6 no existen: no hay nada que excluir. Si se
// escriben, sus casos se añaden aquí por huella (FNV-1a de «expresión@valor»), sin escribirlos.

export const HUELLAS_RESERVADAS = new Set([]);
export const huellaCaso = (e, v) => huella(`${claveExpr(e)}@${plano(v instanceof Fraccion ? v : F(v)).num}/${plano(v instanceof Fraccion ? v : F(v)).den}`);
export const esReservado = (e, v) => HUELLAS_RESERVADAS.has(huellaCaso(e, v));

// ─── Ejercicio 1: Sustituye y calcula ─────────────────────────────────────────────────────────

function opcionesDe(rng, cands, correcta) {
  const tres = rng.barajar(buenos(cands, correcta)).slice(0, 3);
  if (tres.length < 3) return null;
  return rng.barajar([
    { r: plano(correcta), correcta: true, error: null },
    ...tres.map(c => ({ r: plano(c.valor), correcta: false, error: c.error })),
  ]);
}

const razonable = f => Math.abs(f.valor()) <= 60;

export function generarSustituye(rng) {
  for (let i = 0; i < 500; i++) {
    const tipo = rng.elegir(['escribir', 'elegir']);
    const e = expresion(rng), v = valorX(rng);
    if (esReservado(e, v)) continue;
    const correcta = valorDe(e, v), cands = candidatos(e, v);
    if (!razonable(correcta) || buenos(cands, correcta).length < 3) continue;
    const item = { e, v, tipo, resultado: plano(correcta) };
    if (tipo === 'elegir') {
      item.opciones = opcionesDe(rng, cands, correcta);
      if (!item.opciones) continue;
    }
    return item;
  }
  throw new Error('valor-numerico: no sale un ítem del ejercicio 1');
}

export const errorDeSustituye = (item, valor) => clasificar(candidatos(item.e, item.v), F(item.resultado), valor);

// ─── Ejercicio 2: La tabla ────────────────────────────────────────────────────────────────────

export function generarTabla(rng) {
  for (let i = 0; i < 500; i++) {
    const e = expresion(rng);
    const paso = rng.elegir([1, 1, 2]), ini = rng.entero(-3, 4);
    const xs = [0, 1, 2, 3].map(j => ini + paso * j);
    if (xs.some(x => esReservado(e, { num: x, den: 1 }))) continue;
    const valores = xs.map(x => plano(valorDe(e, { num: x, den: 1 })));
    if (valores.some(r => Math.abs(r.num / r.den) > 60) || new Set(valores.map(r => r.num)).size < 4) continue;
    const huecos = rng.barajar([0, 1, 2, 3]).slice(0, 2).sort();
    return { e, xs, valores, huecos };
  }
  throw new Error('valor-numerico: no sale un ítem del ejercicio 2');
}

/** Para cada hueco: null si acierta, el nombre del error si no. */
export function erroresDeTabla(item, respuestas) {
  return item.huecos.map((col, k) => {
    const v = { num: item.xs[col], den: 1 };
    const w = respuestas[k];
    return w === null ? 'otra-respuesta' : clasificar(candidatos(item.e, v), F(item.valores[col]), w);
  });
}

// ─── Ejercicio 3: ¿Qué expresión vale N? ──────────────────────────────────────────────────────
// Cuatro expresiones y un valor de x: solo una vale N. Cada falsa es una expresión que da N si se
// sustituye con un error típico (así quien se equivoca encuentra «su» respuesta). Sin ecuaciones.

const POOL = [];
for (let a = 2; a <= 9; a++) for (let b = 1; b <= 9; b++) {
  POOL.push({ forma: 'lineal', a, b, delante: false }, { forma: 'lineal', a, b, delante: true }, { forma: 'lineal', a, b: -b, delante: false });
}
for (let a = 2; a <= 5; a++) for (let b = 6; b <= 20; b++) POOL.push({ forma: 'lineal', a: -a, b, delante: true });

const INDICES = new Map();
/** Para un valor de x: N → { buenas: [expr], porError: Map(error → [expr]) } solo con los N viables. */
function indiceDe(v) {
  const k = `${v.num}/${v.den}`;
  if (INDICES.has(k)) return INDICES.get(k);
  const x = F(v), mapa = new Map();
  const dePaso = n => { const c = `${n.num}/${n.den}`; if (!mapa.has(c)) mapa.set(c, { buenas: [], porError: new Map() }); return mapa.get(c); };
  for (const e of POOL) {
    const real = valorDe(e, x);
    if (razonable(real)) dePaso(plano(real)).buenas.push(e);
    for (const c of candidatos(e, x)) {
      if (!c.valor || igual(c.valor, real) || !razonable(c.valor)) continue;
      const m = dePaso(plano(c.valor)).porError;
      if (!m.has(c.error)) m.set(c.error, []);
      m.get(c.error).push(e);
    }
  }
  const viables = [...mapa.entries()].filter(([, g]) => g.buenas.length && g.porError.size >= 3);
  INDICES.set(k, viables);
  return viables;
}

export function generarQueValor(rng) {
  for (let i = 0; i < 500; i++) {
    const v = rng.elegir([2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
    const viables = indiceDe({ num: v, den: 1 });
    if (!viables.length) continue;
    const [clave, g] = rng.elegir(viables);
    const correcta = rng.elegir(g.buenas);
    const N = F({ num: Number(clave.split('/')[0]), den: Number(clave.split('/')[1]) });
    const usadas = new Set([claveExpr(correcta)]);
    const falsas = [];
    for (const [error, lista] of rng.barajar([...g.porError.entries()])) {
      const libres = lista.filter(e => !usadas.has(claveExpr(e)) && !igual(valorDe(e, { num: v, den: 1 }), N));
      if (!libres.length) continue;
      const e = rng.elegir(libres);
      usadas.add(claveExpr(e));
      falsas.push({ e, correcta: false, error });
      if (falsas.length === 3) break;
    }
    if (falsas.length < 3) continue;
    if (esReservado(correcta, { num: v, den: 1 })) continue;
    return { v: { num: v, den: 1 }, N: plano(N), opciones: rng.barajar([{ e: correcta, correcta: true, error: null }, ...falsas]) };
  }
  throw new Error('valor-numerico: no sale un ítem del ejercicio 3');
}

// ─── Claves (para no repetir ítems en una sesión) ─────────────────────────────────────────────

export function claveDe(item) {
  if (item.xs) return `t:${claveExpr(item.e)}:${item.xs.join(',')}:${item.huecos.join(',')}`;
  if (item.N) return `q:${item.v.num}/${item.v.den}:${item.N.num}/${item.N.den}:${item.opciones.map(o => claveExpr(o.e)).sort().join('|')}`;
  return `s:${claveExpr(item.e)}@${item.v.num}/${item.v.den}:${item.tipo}`;
}
