// Práctica «Del enunciado a la expresión»: lógica. Todo puro (sin DOM ni red).
//
// Una expresión es una lista de FICHAS: los números son números de JS y lo
// demás, textos: '+', '-', '·', ':', '(', ')', '²' y '√'. `analizar` la
// convierte en un ÁRBOL con la jerarquía normal:
//
//   { op: 'n', v }                 un número
//   { op: '+' | '-' | '·' | ':', a, b }
//   { op: '²', a }   { op: '√', a }
//   { op: '()', a }                un paréntesis escrito (se conserva para
//                                  poder decir «este paréntesis sobraba»)
//
// La corrección es ESTRUCTURAL, nunca por el valor: dos expresiones son
// equivalentes cuando son la misma después de tratar cada número como si
// fuera una letra (ver `equivalentes`). Así 2 · (7 + 3), (7 + 3) · 2 y
// 7 · 2 + 3 · 2 valen las tres, y 7 + 3 · 2 no, dé lo que dé.

import { PLANTILLAS } from './textos.js';

export const OPERADORES = ['+', '-', '·', ':'];
/** Tope de fichas en la línea de montaje (cabe en un móvil y acota las cuentas). */
export const MAX_FICHAS = 15;

const esNumero = f => typeof f === 'number';
const esBinario = op => OPERADORES.includes(op);

// --- Analizar ---------------------------------------------------------------------
//
//   suma     := producto { (+ | -) producto }
//   producto := potencia { (· | :) potencia }
//   potencia := √ primario | primario { ² }
//   primario := número | ( suma )
//
// «√9²» no se admite (¿la raíz de 9², o el cuadrado de √9?): hay que poner
// el paréntesis que lo aclare.

/**
 * Lista de fichas → `{ ok: true, arbol }` o `{ ok: false, error, pos }`.
 * Errores: 'vacia', 'falta_numero' (operador sin número a un lado, «²» o «√»
 * sueltos), 'falta_operador' (dos números o dos bloques seguidos),
 * 'sin_cerrar', 'sin_abrir', 'parentesis_vacio' y 'raiz_ambigua'.
 */
export function analizar(fichas) {
  if (!fichas.length) return { ok: false, error: 'vacia', pos: 0 };
  let i = 0;
  let nivel = 0;
  const fallo = error => { throw { error, pos: i }; };

  const primario = () => {
    const f = fichas[i];
    if (esNumero(f)) { i++; return { op: 'n', v: f }; }
    if (f === '(') {
      i++;
      if (fichas[i] === ')') fallo('parentesis_vacio');
      nivel++;
      const a = suma();
      if (i >= fichas.length) fallo('sin_cerrar');
      if (fichas[i] !== ')') fallo('falta_operador');
      nivel--;
      i++;
      return { op: '()', a };
    }
    if (f === ')' && nivel === 0 && i === 0) fallo('sin_abrir');
    return fallo('falta_numero');
  };
  const potencia = () => {
    if (fichas[i] === '√') {
      i++;
      const a = primario();
      if (fichas[i] === '²') fallo('raiz_ambigua');
      return { op: '√', a };
    }
    let a = primario();
    while (fichas[i] === '²') { i++; a = { op: '²', a }; }
    return a;
  };
  const cadena = (operando, ops) => () => {
    let a = operando();
    while (ops.includes(fichas[i])) {
      const op = fichas[i++];
      a = { op, a, b: operando() };
    }
    return a;
  };
  const producto = cadena(potencia, ['·', ':']);
  const suma = cadena(producto, ['+', '-']);

  try {
    const arbol = suma();
    if (i < fichas.length) fallo(fichas[i] === ')' ? 'sin_abrir' : 'falta_operador');
    return { ok: true, arbol };
  } catch (e) {
    if (e?.error) return { ok: false, error: e.error, pos: e.pos };
    throw e;
  }
}

/** Árbol → fichas (los paréntesis son los que el árbol lleva escritos). */
export function aFichas(arbol) {
  switch (arbol.op) {
    case 'n': return [arbol.v];
    case '()': return ['(', ...aFichas(arbol.a), ')'];
    case '²': return [...aFichas(arbol.a), '²'];
    case '√': return ['√', ...aFichas(arbol.a)];
    default: return [...aFichas(arbol.a), arbol.op, ...aFichas(arbol.b)];
  }
}

/** Los números que aparecen en un árbol. */
export function numerosDe(arbol) {
  return aFichas(arbol).filter(esNumero);
}

// --- Evaluar (con fracciones exactas) -----------------------------------------------

const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
function fraccion(n, d) {
  if (d === 0 || !Number.isSafeInteger(n) || !Number.isSafeInteger(d)) return null;
  if (d < 0) { n = -n; d = -d; }
  const g = mcd(n, d) || 1;
  return { n: n / g, d: d / g };
}
const raizExacta = n => { const r = Math.round(Math.sqrt(n)); return n >= 0 && r * r === n ? r : null; };

function valorExacto(arbol) {
  if (arbol.op === 'n') return fraccion(arbol.v, 1);
  const a = valorExacto(arbol.a);
  if (!a) return null;
  if (arbol.op === '()') return a;
  if (arbol.op === '²') return fraccion(a.n * a.n, a.d * a.d);
  if (arbol.op === '√') {
    const n = raizExacta(a.n), d = raizExacta(a.d);
    return n === null || d === null ? null : fraccion(n, d);
  }
  const b = valorExacto(arbol.b);
  if (!b) return null;
  switch (arbol.op) {
    case '+': return fraccion(a.n * b.d + b.n * a.d, a.d * b.d);
    case '-': return fraccion(a.n * b.d - b.n * a.d, a.d * b.d);
    case '·': return fraccion(a.n * b.n, a.d * b.d);
    default: return fraccion(a.n * b.d, a.d * b.n);
  }
}

/**
 * Valor de un árbol, o `null` si no lo tiene: división entre 0, raíz que no
 * es exacta o números fuera de rango. Puede no ser natural (5 : 2 da 2,5).
 */
export function evaluar(arbol) {
  const v = valorExacto(arbol);
  return v ? v.n / v.d : null;
}

// --- Equivalencia estructural -------------------------------------------------------
//
// Cada número se trata como una letra y la expresión se desarrolla hasta un
// cociente de polinomios. Dos expresiones son equivalentes si dan el mismo
// cociente: eso admite la conmutativa y la asociativa de + y ·, los paréntesis
// que sobran, a − b − c por a − (b + c) y la distributiva, y rechaza todo lo
// que solo coincide en el valor con los números de ese ítem. Una raíz es una
// letra nueva, una por cada radicando distinto.
//
// Un polinomio es un Map «monomio → coeficiente»; el monomio, sus letras
// ordenadas y unidas con espacios ('' es el término independiente).

const pSuma = (p, q, signo = 1) => {
  const r = new Map(p);
  for (const [m, c] of q) {
    const k = (r.get(m) ?? 0) + signo * c;
    if (k) r.set(m, k); else r.delete(m);
  }
  return r;
};
const pProducto = (p, q) => {
  const r = new Map();
  for (const [m1, c1] of p) {
    for (const [m2, c2] of q) {
      const m = `${m1} ${m2}`.split(' ').filter(Boolean).sort().join(' ');
      const k = (r.get(m) ?? 0) + c1 * c2;
      if (k) r.set(m, k); else r.delete(m);
    }
  }
  return r;
};
const pIgual = (p, q) => p.size === q.size && [...p].every(([m, c]) => q.get(m) === c);
const letra = nombre => ({ n: new Map([[nombre, 1]]), d: new Map([['', 1]]) });
const cIgual = (x, y) => pIgual(pProducto(x.n, y.d), pProducto(y.n, x.d));

function cociente(arbol, raices, constantes) {
  if (arbol.op === 'n') {
    // Un número de `constantes` no es una letra: vale lo que vale (ver `sumaRepetida`).
    return constantes?.has(arbol.v) ? { n: new Map([['', arbol.v]]), d: new Map([['', 1]]) } : letra(`x${arbol.v}`);
  }
  const a = cociente(arbol.a, raices, constantes);
  if (!a) return null;
  if (arbol.op === '()') return a;
  if (arbol.op === '²') return { n: pProducto(a.n, a.n), d: pProducto(a.d, a.d) };
  if (arbol.op === '√') {
    let k = raices.findIndex(r => cIgual(r, a));
    if (k < 0) k = raices.push(a) - 1;
    return letra(`r${k}`);
  }
  const b = cociente(arbol.b, raices, constantes);
  if (!b) return null;
  switch (arbol.op) {
    case '+': return { n: pSuma(pProducto(a.n, b.d), pProducto(b.n, a.d)), d: pProducto(a.d, b.d) };
    case '-': return { n: pSuma(pProducto(a.n, b.d), pProducto(b.n, a.d), -1), d: pProducto(a.d, b.d) };
    case '·': return { n: pProducto(a.n, b.n), d: pProducto(a.d, b.d) };
    default: return b.n.size ? { n: pProducto(a.n, b.d), d: pProducto(a.d, b.n) } : null;
  }
}

/** ¿Son la misma expresión, se escriban como se escriban? (No compara valores.) */
export function equivalentes(a, b) {
  const raices = [];
  const x = cociente(a, raices), y = cociente(b, raices);
  return Boolean(x && y) && cIgual(x, y);
}

/**
 * ¿Es `arbol` el `modelo` con algún producto escrito como suma repetida?
 * √49 + √49 por 2 · √49, o 12 + 12 + 12 + 5 por 3 · 12 + 5. Devuelve los
 * números del modelo que hacían de «veces» (los que `arbol` no usa), de menor
 * a mayor, o `null` si no es el caso. Sigue siendo estructural: solo esos
 * números cuentan por su valor; los demás siguen siendo letras.
 */
export function sumaRepetida(arbol, modelo) {
  const usados = new Set(numerosDe(arbol));
  const veces = [...new Set(numerosDe(modelo))].filter(n => !usados.has(n)).sort((x, y) => x - y);
  if (!veces.length) return null;
  // Una sola ficha nunca es una suma repetida (es el resultado, no la expresión), ni lo es
  // una división de algo entre sí mismo (5 : 5 hace de 1 y fabrica identidades).
  if (arbol.op === 'n' || hayDivisionIdentica(arbol)) return null;
  // Cada número omitido tiene que ser «las veces» de un producto del modelo.
  const productos = productosDeVeces(modelo);
  if (!veces.every(v => productos.some(p => p.v === v))) return null;
  const raices = [], constantes = new Set(veces);
  const x = cociente(arbol, raices, constantes), y = cociente(modelo, raices, constantes);
  return x && y && cIgual(x, y) ? veces : null;
}

/** ¿Hay en `arbol` una división de una expresión entre ella misma (5 : 5)? */
function hayDivisionIdentica(arbol) {
  if (arbol.op === 'n') return false;
  if (arbol.op === ':' && aFichas(arbol.a).join(' ') === aFichas(arbol.b).join(' ')) return true;
  return hayDivisionIdentica(arbol.a) || (arbol.b ? hayDivisionIdentica(arbol.b) : false);
}

/**
 * Los números del modelo que pueden hacer de «veces»: factor directo de un producto al
 * que se llega solo por sumas, restas y otros productos (no desde dentro de un paréntesis,
 * una potencia, una raíz ni una división), y cuyo otro factor no lleva divisiones.
 * Devuelve `{ v, resta }`; `resta` dice si ese producto es el sustraendo de una resta.
 */
function productosDeVeces(modelo) {
  const res = [];
  const lleva = (nodo, op) => nodo.op === op || (nodo.a && lleva(nodo.a, op)) || Boolean(nodo.b && lleva(nodo.b, op));
  const ir = (nodo, resta) => {
    if (nodo.op === '+') { ir(nodo.a, resta); ir(nodo.b, resta); return; }
    if (nodo.op === '-') { ir(nodo.a, resta); ir(nodo.b, true); return; }
    if (nodo.op !== '·') return;
    for (const [uno, otro] of [[nodo.a, nodo.b], [nodo.b, nodo.a]]) {
      if (uno.op === 'n' && !lleva(otro, ':')) res.push({ v: uno.v, resta });
    }
    ir(nodo.a, resta); ir(nodo.b, resta);
  };
  ir(modelo, false);
  return res;
}

/** ¿Es la suma repetida en realidad una resta repetida (50 − 8 − 8)? Para elegir el texto. */
export function esRestaRepetida(modelo, veces) {
  const productos = productosDeVeces(modelo).filter(p => veces.includes(p.v));
  return productos.length > 0 && productos.every(p => p.resta);
}

// --- Paréntesis que sobran ----------------------------------------------------------

const PRECEDENCIA = { '+': 1, '-': 1, '·': 2, ':': 2, '²': 3, '√': 3, n: 4, '()': 4 };

/** ¿Sobra un paréntesis que encierra un `hijo` y cuelga del lado `lado` ('a' o 'b') de `padre`? */
function sobra(padre, lado, hijo) {
  if (hijo === 'n' || hijo === '()' || padre === null) return true;
  if (padre === '√') return false;
  if (padre === '²') return hijo === '²';
  const p = PRECEDENCIA[hijo];
  if (padre === '+') return true;
  if (padre === '-') return lado === 'a' || p >= 2;
  if (padre === '·') return p >= 2;
  return lado === 'a' ? p >= 2 : p >= 3;
}

/**
 * Quita los paréntesis que no cambian el valor: `{ arbol, quitados }`.
 * 7 + (3 · 2) → 7 + 3 · 2; (7 + 3) · 2 se queda como está.
 */
export function quitarSobrantes(arbol) {
  let quitados = 0;
  const limpiar = (nodo, padre, lado) => {
    if (nodo.op === 'n') return nodo;
    if (nodo.op === '()') {
      const dentro = limpiar(nodo.a, null, 'a');
      // `dentro` ya no lleva paréntesis por fuera: se decide con lo que encierra.
      if (sobra(padre, lado, dentro.op)) { quitados++; return dentro; }
      return { op: '()', a: dentro };
    }
    if (!esBinario(nodo.op)) return { op: nodo.op, a: limpiar(nodo.a, nodo.op, 'a') };
    return { op: nodo.op, a: limpiar(nodo.a, nodo.op, 'a'), b: limpiar(nodo.b, nodo.op, 'b') };
  };
  // Dentro de un paréntesis que se conserva, su contenido no tiene «padre»:
  // por eso `limpiar(nodo.a, null)` no puede quitar dos veces el mismo.
  const limpio = limpiar(arbol, null, 'a');
  return { arbol: limpio, quitados };
}

// --- Familias: la estructura de cada tipo de problema --------------------------------
//
// `modelo` y `errores` se escriben con las letras a, b, c y d en el lugar de
// los números de la plantilla. Los errores son las expresiones «típicamente
// erróneas»: el generador solo acepta números con los que ninguna da el mismo
// valor que el modelo. El PRIMER error de cada familia del ejercicio 3 es su
// «gemela»: la otra opción en la variante de elegir.
//
// Tipo de error: 'par_falta' (falta el paréntesis), 'par_sitio' (agrupa lo que
// no va junto), 'operacion', 'orden' (resta o división al revés), 'cuadrado'
// y 'raiz' (afectan a otra cosa).

export const FAMILIAS = {
  // Ejercicio 1: dos operaciones, sin paréntesis.
  suma_productos: { modelo: 'a·b+c·d', errores: [['a·(b+c)·d', 'par_sitio'], ['(a+b)·(c+d)', 'operacion'], ['a+b+c+d', 'operacion']] },
  producto_mas: { modelo: 'a·b+c', errores: [['a·(b+c)', 'par_sitio'], ['a+b+c', 'operacion'], ['a·b·c', 'operacion']] },
  cantidad_menos_producto: { modelo: 'a-b·c', errores: [['(a-b)·c', 'par_sitio'], ['a-b-c', 'operacion'], ['b·c-a', 'orden']] },
  producto_menos: { modelo: 'a·b-c', errores: [['a·(b-c)', 'par_sitio'], ['c-a·b', 'orden'], ['a·b+c', 'operacion']] },
  cadena: { modelo: 'a·b·c', errores: [['a·b+c', 'operacion'], ['a+b·c', 'operacion'], ['a+b+c', 'operacion']] },
  por_entre_por: { modelo: 'a·b:c·d', errores: [['a·b:(c·d)', 'par_sitio'], ['a·b·c·d', 'operacion'], ['a·b:c+d', 'operacion']] },
  mas_producto: { modelo: 'a+b·c', errores: [['(a+b)·c', 'par_sitio'], ['a+b+c', 'operacion'], ['a·b·c', 'operacion']] },
  mas_cociente: { modelo: 'a+b:c', errores: [['(a+b):c', 'par_sitio'], ['a+c:b', 'orden'], ['a+b·c', 'operacion']] },
  // Ejercicio 2: el paréntesis es imprescindible.
  reparto: { modelo: '(a+b):c', errores: [['a+b:c', 'par_falta'], ['(a+b)·c', 'operacion'], ['c:(a+b)', 'orden']] },
  todo_por: { modelo: '(a+b)·c', errores: [['a+b·c', 'par_falta'], ['a·c+b', 'par_falta'], ['a·b·c', 'operacion']] },
  menos_suma: { modelo: 'a-(b+c)', errores: [['a-b+c', 'par_falta'], ['b+c-a', 'orden'], ['a+b+c', 'operacion']] },
  resta_por: { modelo: '(a-b)·c', errores: [['a-b·c', 'par_falta'], ['a·c-b', 'par_falta'], ['(a+b)·c', 'operacion']] },
  entre_suma: { modelo: 'a:(b+c)', errores: [['a:b+c', 'par_falta'], ['(b+c):a', 'orden'], ['a:b:c', 'operacion']] },
  resta_entre: { modelo: '(a-b):c', errores: [['a-b:c', 'par_falta'], ['(a-b)·c', 'operacion'], ['c:(a-b)', 'orden']] },
  cajas_y_reparto: { modelo: '(a·b+c):d', errores: [['a·b+c:d', 'par_falta'], ['a·(b+c):d', 'par_sitio'], ['(a+b+c):d', 'operacion']] },
  // Ejercicio 3: potencias y raíces.
  cuadrado_suma: { modelo: '(a+b)²', errores: [['a+b²', 'par_falta'], ['a²+b²', 'cuadrado'], ['a²+b', 'cuadrado']] },
  suma_cuadrados: { modelo: 'a²+b²', errores: [['(a+b)²', 'cuadrado'], ['a+b²', 'cuadrado'], ['a²+b', 'cuadrado']] },
  cuadrado_diferencia: { modelo: '(a-b)²', errores: [['a-b²', 'par_falta'], ['a²-b²', 'cuadrado'], ['a²-b', 'cuadrado']] },
  diferencia_cuadrados: { modelo: 'a²-b²', errores: [['(a-b)²', 'cuadrado'], ['a²-b', 'cuadrado'], ['b²-a²', 'orden']] },
  por_cuadrado: { modelo: 'a·b²', errores: [['(a·b)²', 'cuadrado'], ['a²·b', 'cuadrado'], ['a·b', 'cuadrado']] },
  cuadrado_producto: { modelo: '(a·b)²', errores: [['a·b²', 'par_falta'], ['a²·b', 'cuadrado'], ['a·b', 'cuadrado']] },
  cuadrado_menos: { modelo: 'a²-b', errores: [['(a-b)²', 'cuadrado'], ['a-b', 'cuadrado'], ['a·b', 'operacion']] },
  raiz_suma: { modelo: '√(a+b)', errores: [['√a+b', 'par_falta'], ['√a+√b', 'raiz'], ['a+b', 'raiz']] },
  suma_raices: { modelo: '√a+√b', errores: [['√(a+b)', 'raiz'], ['√a+b', 'raiz'], ['a+b', 'raiz']] },
  por_raiz: { modelo: 'a·√b', errores: [['√(a·b)', 'raiz'], ['a·b', 'raiz'], ['a+√b', 'operacion']] },
  raiz_menos: { modelo: '√a-b', errores: [['√(a-b)', 'raiz'], ['a-b', 'raiz'], ['b-√a', 'orden']] },
};

/** 'a·(b+c)' con { a: 3, b: 12, c: 5 } → [3, '·', '(', 12, '+', 5, ')']. */
export function instanciar(texto, numeros) {
  return [...texto].map(c => (c in numeros ? numeros[c] : c));
}

const arbolDe = (texto, numeros) => {
  const r = analizar(instanciar(texto, numeros));
  if (!r.ok) throw new Error(`Expresión mal escrita en una familia: ${texto}`);
  return r.arbol;
};

/** El árbol modelo de una plantilla con unos números. */
export function modeloDe(plantilla, numeros) {
  return arbolDe(FAMILIAS[plantilla.familia].modelo, numeros);
}

/** Las expresiones erróneas declaradas por la familia: [{ arbol, tipo }]. */
export function erroresDe(plantilla, numeros) {
  return FAMILIAS[plantilla.familia].errores.map(([texto, tipo]) => ({ arbol: arbolDe(texto, numeros), tipo }));
}

export const plantillaPorId = id => PLANTILLAS.find(p => p.id === id) ?? null;

// --- Generar ------------------------------------------------------------------------

const esNatural = v => Number.isInteger(v) && v > 0;

/** ¿Dan un natural el árbol y todos sus pasos intermedios? (90 : 4 · 2 = 45, pero 90 : 4 no.) */
function pasosNaturales(arbol) {
  if (arbol.op === 'n') return true;
  return esNatural(evaluar(arbol)) && pasosNaturales(arbol.a) && (!arbol.b || pasosNaturales(arbol.b));
}

/**
 * ¿Valen estos números para la plantilla? Tienen que ser naturales distintos,
 * el modelo tiene que dar un natural EN CADA PASO (no salen 22,5 bolsas) y
 * ninguna expresión errónea puede dar lo mismo que el modelo.
 */
export function numerosValidos(plantilla, numeros) {
  const valores = Object.values(numeros);
  if (!valores.every(esNatural) || new Set(valores).size !== valores.length) return false;
  const modelo = modeloDe(plantilla, numeros);
  const resultado = evaluar(modelo);
  if (!pasosNaturales(modelo)) return false;
  return erroresDe(plantilla, numeros).every(e => evaluar(e.arbol) !== resultado);
}

function elegirPlantilla(candidatas, rng, sesion) {
  for (let intento = 0; intento < 500; intento++) {
    const plantilla = rng.elegir(candidatas);
    if (plantilla.id === sesion?.anterior?.plantilla && candidatas.length > 1) continue;
    const numeros = plantilla.numeros(rng);
    if (numerosValidos(plantilla, numeros)) return { plantilla, numeros };
  }
  throw new Error('No salen números válidos para ninguna plantilla');
}

/** Ítem de montar: las fichas de número (`opciones`), de menor a mayor. */
function itemMontar({ plantilla, numeros }) {
  const modelo = modeloDe(plantilla, numeros);
  return {
    tipo: 'montar',
    plantilla: plantilla.id,
    numeros,
    modelo,
    opciones: [...new Set(Object.values(numeros))].sort((x, y) => x - y),
    solucion: aFichas(modelo),
  };
}

/** Ítem de elegir: el modelo y su gemela, en orden al azar; `solucion` es el índice del modelo. */
function itemElegir({ plantilla, numeros }, rng) {
  const modelo = modeloDe(plantilla, numeros);
  const gemela = erroresDe(plantilla, numeros)[0].arbol;
  const solucion = rng.entero(0, 1);
  return {
    tipo: 'elegir',
    plantilla: plantilla.id,
    numeros,
    modelo,
    opciones: solucion === 0 ? [modelo, gemela] : [gemela, modelo],
    solucion,
  };
}

const deEjercicio = (ej, sobra = false) => PLANTILLAS.filter(p => p.ej === ej && Boolean(p.sobra) === sobra);

/** Probabilidad de la variante de cada ejercicio: paréntesis que sobra (2) y elegir (3). */
export const P_VARIANTE = 0.3;

/** Ejercicio 1: dos operaciones sin paréntesis. */
export function generarSin(rng, sesion) {
  return itemMontar(elegirPlantilla(deEjercicio(1), rng, sesion));
}

/** Ejercicio 2: paréntesis imprescindible; en el 30 %, un enunciado donde el paréntesis sobra. */
export function generarCon(rng, sesion) {
  return itemMontar(elegirPlantilla(deEjercicio(2, rng.azar() < P_VARIANTE), rng, sesion));
}

/** Ejercicio 3: potencias y raíces; en el 30 %, elegir entre el modelo y su gemela. */
export function generarPotencias(rng, sesion) {
  const elegir = rng.azar() < P_VARIANTE;
  const eleccion = elegirPlantilla(deEjercicio(3), rng, sesion);
  return elegir ? itemElegir(eleccion, rng) : itemMontar(eleccion);
}

export const claveItem = item => `${item.tipo}/${item.plantilla}/${Object.values(item.numeros).join(',')}`;

// --- Corregir -----------------------------------------------------------------------

/**
 * Corrige lo que ha montado el alumno:
 *
 *   { estado: 'malformada', error }                     no cuenta como fallo
 *   { estado: 'bien', valor, quitados, limpia, repetida }
 *                                                       `limpia`: sin los paréntesis que sobran;
 *                                                       `repetida`: null, o los números que no ha
 *                                                       usado porque ha escrito el producto como
 *                                                       suma repetida (también es acierto)
 *   { estado: 'mal', valor, faltan, tipo, casualidad }  `faltan`: números del problema sin usar;
 *                                                       `tipo`: el del error declarado que coincide
 *                                                       (o null); `casualidad`: da lo mismo que el
 *                                                       modelo sin ser equivalente.
 */
export function corregir(item, fichas) {
  const r = analizar(fichas);
  if (!r.ok) return { estado: 'malformada', error: r.error };
  const valor = evaluar(r.arbol);
  const repetida = equivalentes(r.arbol, item.modelo) ? null : sumaRepetida(r.arbol, item.modelo);
  if (repetida || equivalentes(r.arbol, item.modelo)) {
    const { arbol: limpia, quitados } = quitarSobrantes(r.arbol);
    return { estado: 'bien', valor, quitados, limpia, repetida };
  }
  const usados = new Set(numerosDe(r.arbol));
  const faltan = [...new Set(numerosDe(item.modelo))].filter(n => !usados.has(n)).sort((x, y) => x - y);
  const plantilla = plantillaPorId(item.plantilla);
  const error = erroresDe(plantilla, item.numeros).find(e => equivalentes(e.arbol, r.arbol));
  return {
    estado: 'mal',
    valor,
    faltan,
    tipo: error?.tipo ?? null,
    casualidad: valor !== null && valor === evaluar(item.modelo),
  };
}
