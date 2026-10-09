// «¿Qué se hace primero?» (repaso de la unidad 1): lógica pura, sin DOM ni red.
//
// Una expresión es una lista plana de fichas (strings):
//   número   '12'
//   binarios '+'  '-'  '*'  ':'      (se enseñan + − · : )
//   potencia '^2'  '^3'               (va detrás de su base: un número o un ')')
//   raíz     '√'                      (va delante de su radicando: un número o un '(')
//   agrupa   '('  ')'
//
// Regla de «lo que toca»: se mira el paréntesis que se cierra primero (de dentro
// hacia fuera). Dentro, una operación vale como paso siguiente (`validos`) si sus
// operandos ya son números y ninguna operación pegada a ellos la estorba: ni una
// de más nivel (potencias y raíces, luego · y :, luego + y −), ni una del mismo
// nivel a su izquierda con la que comparta operando y cuyo orden importe (cadenas
// como 20 : 4 · 5 o 10 − 4 + 3, de izquierda a derecha; en 10 · 8 : 4 da igual).
// Dos operaciones que no se estorban valen las dos.
// `toca` da la canónica (la de mayor nivel y, a igualdad, la de más a la izquierda)
// y es la que se hace sola cuando el alumno se equivoca. Los paréntesis que
// rodean un solo número se quitan solos.

export const NIVEL = { '+': 1, '-': 1, '*': 2, ':': 2, '^2': 3, '^3': 3, '√': 3 };
const MAXIMO = 999;

export const esNumero = t => /^\d+$/.test(t);

// ─── Paso a paso ───────────────────────────────────────────────────────────────

/** [primero, último] índices de las fichas donde se trabaja ahora. */
export function ambito(fichas) {
  const cierre = fichas.indexOf(')');
  if (cierre < 0) return [0, fichas.length - 1];
  return [fichas.lastIndexOf('(', cierre) + 1, cierre - 1];
}

/**
 * Operadores pegados a `i` que lo estorban: los de más nivel y los del mismo nivel
 * que están a su izquierda (la cadena se hace de izquierda a derecha). Se miran
 * las dos fichas de cada lado: así también cuenta un operando que aún no es número.
 */
function estorbos(fichas, i, desde, hasta) {
  const mio = NIVEL[fichas[i]];
  const salida = [];
  for (const j of [i - 2, i - 1, i + 1, i + 2]) {
    if (j < desde || j > hasta) continue;
    const n = NIVEL[fichas[j]];
    if (!n) continue;
    if (n > mio) salida.push({ j, nivel: n });
    else if (n === mio && j < i && !(j === i - 2 && adelantarNoCambiaNada(fichas, i))) salida.push({ j, nivel: n });
  }
  return salida;
}

/**
 * En una cadena (10 · 8 : 4, 5 + 3 + 2) hacer antes la segunda operación solo es
 * fallo si cambia el valor (10 − 4 + 3) o da algo que no es natural: en
 * 10 · 8 : 4, hacer 8 : 4 primero sale lo mismo y no se penaliza; tampoco en
 * 9 + 8 − 8, aunque el paso intermedio sea 0.
 */
function adelantarNoCambiaNada(fichas, i) {
  const p = paso(fichas, i);
  return !!p && Math.abs(evaluar(p.fichas) - evaluar(fichas)) < 1e-9;
}

/** Índices de todas las operaciones que valen como paso siguiente. */
export function validos(fichas) {
  const [desde, hasta] = ambito(fichas);
  const salida = [];
  for (let i = desde; i <= hasta; i++) {
    if (NIVEL[fichas[i]] && !estorbos(fichas, i, desde, hasta).length) salida.push(i);
  }
  return salida;
}

/** Índice de la ficha-operador canónica (mayor nivel, más a la izquierda), o −1 si no queda ninguna. */
export function toca(fichas) {
  const [desde, hasta] = ambito(fichas);
  let mejor = -1, nivel = 0;
  for (let i = desde; i <= hasta; i++) {
    const n = NIVEL[fichas[i]];
    if (n && n > nivel) { nivel = n; mejor = i; }
  }
  return mejor;
}

export function quitarParentesisInutiles(fichas) {
  let t = fichas;
  for (;;) {
    const i = t.findIndex((x, k) => x === '(' && esNumero(t[k + 1] ?? '') && t[k + 2] === ')');
    if (i < 0) return t;
    t = [...t.slice(0, i), t[i + 1], ...t.slice(i + 3)];
  }
}

/** Resuelve la operación `i`. null si el resultado no es natural. */
export function paso(fichas, i) {
  const f = fichas[i];
  let desde = i - 1, hasta = i + 1, valor;
  if (f === '√') {
    const a = Number(fichas[i + 1]), r = Math.round(Math.sqrt(a));
    if (r * r !== a) return null;
    desde = i; valor = r;
  } else if (f[0] === '^') {
    valor = Number(fichas[i - 1]) ** Number(f[1]);
    hasta = i;
  } else {
    const a = Number(fichas[i - 1]), b = Number(fichas[i + 1]);
    if (f === '+') valor = a + b;
    else if (f === '-') valor = a - b;
    else if (f === '*') valor = a * b;
    else {
      if (b === 0 || a % b !== 0) return null;
      valor = a / b;
    }
  }
  if (!Number.isInteger(valor) || valor < 0) return null;
  const nuevas = quitarParentesisInutiles([...fichas.slice(0, desde), String(valor), ...fichas.slice(hasta + 1)]);
  return { fichas: nuevas, valor };
}

/** Un paso «bonito»: nada de ceros, de multiplicar o dividir por 1, ni de números enormes. */
function bonito(fichas, i, valor) {
  const f = fichas[i];
  if (valor < 1 || valor > MAXIMO) return false;
  if (f === '*' || f === ':') return Number(fichas[i + 1]) >= 2 && Number(fichas[i - 1]) >= 2;
  if (f[0] === '^') return Number(fichas[i - 1]) >= 2;
  if (f === '√') return Number(fichas[i + 1]) >= 4;
  return true;
}

/**
 * Todos los estados de la expresión, del primero al número final:
 * [{ fichas }, { fichas, operador, indice, valor }, …]. null si algún paso no
 * es natural o no es «bonito».
 */
export function cadena(inicial) {
  if (inicial.some(f => esNumero(f) && Number(f) > MAXIMO)) return null;
  let t = quitarParentesisInutiles(inicial);
  const estados = [{ fichas: t }];
  while (t.length > 1) {
    const i = toca(t);
    if (i < 0) return null;
    const p = paso(t, i);
    if (!p || !bonito(t, i, p.valor)) return null;
    estados.push({ fichas: p.fichas, operador: t[i], indice: i, valor: p.valor });
    t = p.fichas;
  }
  return estados;
}

/**
 * Por qué NO vale el operador `tocado`: está fuera del paréntesis que toca, o lo
 * estorba una operación de más nivel ('prioridad') o una seguida del mismo nivel
 * a su izquierda ('izquierda'). null si en realidad sí valía.
 */
export function motivo(fichas, tocado) {
  const [desde, hasta] = ambito(fichas);
  if (tocado < desde || tocado > hasta) return { clave: 'parentesis' };
  const fuertes = estorbos(fichas, tocado, desde, hasta);
  if (!fuertes.length) return null;
  const mio = NIVEL[fichas[tocado]];
  const mayor = fuertes.reduce((a, b) => (b.nivel > a.nivel ? b : a));
  if (mayor.nivel > mio) return { clave: 'prioridad', nivel: mayor.nivel, malo: fichas[tocado] };
  return { clave: 'izquierda', nivel: mio };
}

/** ¿Es un número natural que se puede escribir sin explicaciones (entero, no negativo)? */
export const esNatural = v => Number.isInteger(v) && v >= 0;

// ─── Mostrar ───────────────────────────────────────────────────────────────────

const SIGNO = { '+': '+', '-': '−', '*': '·' };

export function signo(f, idioma = 'es') {
  if (f === ':') return idioma === 'en' ? '÷' : ':';
  return SIGNO[f] ?? f;
}

/** Texto plano de una lista de fichas (el que se escribe en el historial). */
export function texto(fichas, idioma = 'es') {
  return fichas.map(f => {
    if (f === '+' || f === '-' || f === '*' || f === ':') return ` ${signo(f, idioma)} `;
    return f;
  }).join('');
}

// ─── Evaluación directa (para decir cuánto sale lo que escribe el alumno) ─────

export function evaluar(fichas) {
  let p = 0;
  const atomo = () => {
    const t = fichas[p++];
    if (t === '(') { const v = suma(); p++; return v; }
    if (t === '√') return Math.sqrt(atomo());
    return Number(t);
  };
  const potencia = () => {
    let v = atomo();
    while (fichas[p]?.[0] === '^') v **= Number(fichas[p++][1]);
    return v;
  };
  const producto = () => {
    let v = potencia();
    while (fichas[p] === '*' || fichas[p] === ':') {
      const o = fichas[p++], w = potencia();
      v = o === '*' ? v * w : v / w;
    }
    return v;
  };
  const suma = () => {
    let v = producto();
    while (fichas[p] === '+' || fichas[p] === '-') {
      const o = fichas[p++], w = producto();
      v = o === '+' ? v + w : v - w;
    }
    return v;
  };
  return suma();
}

// ─── Generadores ───────────────────────────────────────────────────────────────

const OPS = ['+', '+', '-', '-', '*', '*', ':'];
const INTENTOS = 20000;

/** a − b + c, a − b − c, a : b : c, a : b · c: aquí el orden izquierda-derecha cambia el resultado. */
export function trampaOrden(fichas) {
  for (let j = 1; j + 2 < fichas.length; j++) {
    const o = fichas[j];
    if ((o === '-' || o === ':') && esNumero(fichas[j - 1]) && esNumero(fichas[j + 1])
        && NIVEL[fichas[j + 2]] === NIVEL[o] && NIVEL[o] < 3) return true;
  }
  return false;
}

const mezclaNiveles = ops => ops.some(o => NIVEL[o] === 1) && ops.some(o => NIVEL[o] === 2);

function intercalar(numeros, ops) {
  return numeros.flatMap((n, i) => (i < ops.length ? [String(n), ops[i]] : [String(n)]));
}

function item(ejercicio, fichas, extra = {}) {
  const estados = cadena(fichas);
  return {
    tipo: 'pasos', ejercicio, fichas,
    pasos: estados.slice(1).map(e => ({ operador: e.operador, indice: e.indice, resultado: e.valor, fichas: e.fichas })),
    ...extra,
  };
}

/** Pone divisores donde hay «:» para que las divisiones salgan exactas más a menudo. */
function ajustarDivisiones(rng, ops, nums) {
  ops.forEach((o, k) => {
    if (o !== ':') return;
    const d = rng.entero(2, 6);
    nums[k + 1] = d;
    if (nums[k] % d !== 0) nums[k] = d * rng.entero(2, 9);
  });
}

/** Ejercicio 1: dos y tres operaciones sin paréntesis. */
export function generarPasos1(rng) {
  const trampa = rng.azar() < 0.5;
  for (let k = 0; k < INTENTOS; k++) {
    const n = rng.elegir([2, 3, 3]);
    const ops = Array.from({ length: n }, () => rng.elegir(OPS));
    const nums = Array.from({ length: n + 1 }, () => rng.entero(2, 20));
    ajustarDivisiones(rng, ops, nums);
    const fichas = intercalar(nums, ops);
    if (trampa ? !trampaOrden(fichas) : !mezclaNiveles(ops)) continue;
    if (cadena(fichas)) return item(1, fichas);
  }
  throw new Error('generarPasos1: sin ítem válido');
}

export const RAICES = Array.from({ length: 19 }, (_, i) => i + 2); // 2..20 (cuadrados 4..400)

function termino(rng, tipo) {
  if (tipo === 'n') return [String(rng.entero(2, 12))];
  if (tipo === 'p') return rng.azar() < 0.7 ? [String(rng.entero(2, 10)), '^2'] : [String(rng.entero(2, 5)), '^3'];
  return ['√', String(rng.elegir(RAICES) ** 2)];
}

/** Ejercicio 2: potencias y raíces con · : + −, tres o cuatro operaciones. */
export function generarPasos2(rng) {
  const ambas = rng.azar() < 0.5;
  for (let k = 0; k < INTENTOS; k++) {
    const nT = rng.elegir([2, 3]);
    const tipos = Array.from({ length: nT }, () => rng.elegir(['n', 'p', 'r']));
    const unarios = tipos.filter(t => t !== 'n').length;
    const total = nT - 1 + unarios;
    if (unarios < 1 || total < 3 || total > 4) continue;
    if (ambas && !(tipos.includes('p') && tipos.includes('r'))) continue;
    const fichas = tipos.flatMap((t, i) => [...(i ? [rng.elegir(OPS)] : []), ...termino(rng, t)]);
    if (cadena(fichas)) return item(2, fichas);
  }
  throw new Error('generarPasos2: sin ítem válido');
}

const PLANTILLAS3 = [
  'N O ( N O ( N O N ) )',
  '( N O ( N O N ) ) O N',
  '( ( N O N ) O N ) O N',
  'N O ( ( N O N ) O N )',
];

/** Ejercicio 3: paréntesis anidados (dos niveles), con una potencia en el 40 %. */
export function generarPasos3(rng) {
  const conPotencia = rng.azar() < 0.4;
  for (let k = 0; k < INTENTOS; k++) {
    const plantilla = rng.elegir(PLANTILLAS3).split(' ');
    const ops = [];
    let fichas = plantilla.map(p => {
      if (p === 'N') return String(rng.entero(2, 15));
      if (p === 'O') { const o = rng.elegir(OPS); ops.push(o); return o; }
      return p;
    });
    if (!mezclaNiveles(ops) && !(ops.some(o => NIVEL[o] === 1) && conPotencia)) continue;
    if (conPotencia) {
      const c = fichas.indexOf(')');
      fichas = [...fichas.slice(0, c + 1), rng.azar() < 0.8 ? '^2' : '^3', ...fichas.slice(c + 1)];
    }
    if (cadena(fichas)) return item(3, fichas, { conPotencia });
  }
  throw new Error('generarPasos3: sin ítem válido');
}

// ─── Ejercicio 4: agrupadores invisibles (raya de fracción y raíz) ─────────────

/** Qué grupos NECESITAN paréntesis al escribir la expresión en una línea. */
export function exigidos(it) {
  if (it.agrupador === 'raya') return [it.grupos[0].some(f => f === '+' || f === '-'), it.grupos[1].length > 1];
  return [it.grupos[0].length > 1];
}

/** La expresión en una línea, con paréntesis en los grupos marcados en `p`. */
export function lineal(it, p) {
  const envolver = (g, si) => (si ? ['(', ...g, ')'] : g);
  if (it.agrupador === 'raya') return [...it.antes, ...envolver(it.grupos[0], p[0]), ':', ...envolver(it.grupos[1], p[1]), ...it.despues];
  return [...it.antes, '√', ...envolver(it.grupos[0], p[0]), ...it.despues];
}

export const esCorrecto = (it, p) => exigidos(it).every((r, i) => !r || p[i]);

/** Todas las combinaciones de paréntesis posibles para los grupos del ítem. */
export function combinaciones(it) {
  return it.grupos.length === 2
    ? [[false, false], [false, true], [true, false], [true, true]]
    : [[false], [true]];
}

/** ¿Sale distinto de la verdad cada combinación a la que le falta un paréntesis necesario? */
function faltasSeNotan(it) {
  return combinaciones(it).every(p => esCorrecto(it, p) || Math.abs(evaluar(lineal(it, p)) - it.valor) > 1e-9);
}

function grupoDe(rng, valor, formas) {
  // Devuelve fichas de un grupo que vale `valor`, o null si no hay forma de hacerlo.
  const forma = rng.elegir(formas);
  if (forma === 'n') return [String(valor)];
  if (forma === '+') {
    if (valor < 4) return null;
    const a = rng.entero(2, valor - 2);
    return [String(a), '+', String(valor - a)];
  }
  if (forma === '-') {
    const b = rng.entero(2, 30);
    return [String(valor + b), '-', String(b)];
  }
  const pares = [];
  for (let a = 2; a * a <= valor; a++) if (valor % a === 0) pares.push([a, valor / a]);
  if (!pares.length) return null;
  const [a, b] = rng.elegir(pares);
  return rng.azar() < 0.5 ? [String(a), '*', String(b)] : [String(b), '*', String(a)];
}

function cerrar(it) {
  const fichas = lineal(it, exigidos(it));
  const estados = cadena(fichas);
  if (!estados || !exigidos(it).some(Boolean)) return null;
  const valor = estados.at(-1).fichas[0];
  const listo = { ...it, valor: Number(valor), correcta: fichas };
  return faltasSeNotan(listo) ? listo : null;
}

function generarRaya(rng) {
  for (let k = 0; k < INTENTOS; k++) {
    const dv = rng.entero(2, 9), q = rng.entero(2, 9);
    const den = grupoDe(rng, dv, ['n', 'n', '+', '+', '-', '*']);
    const num = grupoDe(rng, dv * q, ['n', '+', '+', '-', '*']);
    if (!den || !num) continue;
    let antes = [];
    if (rng.azar() < 0.6) {
      const o = rng.elegir(['+', '-']);
      antes = [String(o === '-' ? q + rng.entero(1, 10) : rng.entero(2, 20)), o];
    }
    const hecho = cerrar({ tipo: 'invisibles', agrupador: 'raya', antes, grupos: [num, den], despues: [] });
    if (hecho) return hecho;
  }
  throw new Error('generarRaya: sin ítem válido');
}

function generarRadical(rng) {
  for (let k = 0; k < INTENTOS; k++) {
    const r = rng.entero(3, 15), r2 = r * r;
    const rad = grupoDe(rng, r2, ['+', '+', '+', '-', '*']);
    if (!rad || rad.length < 3) continue;
    let antes = [], despues = [];
    const u = rng.azar();
    if (u < 0.35) antes = [String(rng.entero(2, 20)), rng.elegir(['+', '*'])];
    else if (u < 0.7) despues = [rng.elegir(['+', '-']), String(rng.entero(2, Math.max(2, r - 1)))];
    const hecho = cerrar({ tipo: 'invisibles', agrupador: 'radical', antes, grupos: [rad], despues });
    if (hecho) return hecho;
  }
  throw new Error('generarRadical: sin ítem válido');
}

/** Ejercicio 4: mitad con raya de fracción, mitad con raíz sobre una operación. */
export function generarInvisibles(rng) {
  return rng.azar() < 0.5 ? generarRaya(rng) : generarRadical(rng);
}
