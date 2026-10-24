// Enteros para las prácticas de la unidad 3 (PU2, tarea 79): cómo se escriben y
// se leen, un evaluador de expresiones con la jerarquía de verdad, los pasos que
// se pueden dar en cada momento y los errores típicos de la unidad, de donde
// salen los distractores. Puro (sin DOM ni red), salvo `campoEntero`, que solo
// toca `document` cuando se le llama. La recta y el termómetro están en
// `recta-enteros.js`. Probado en `tests/practicas-enteros.test.js`.
//
// ─── Escritura ─────────────────────────────────────────────────────────────────
//
//   El menos que se ve en pantalla es siempre U+2212 (`MENOS`), nunca el guion.
//   fmt(−5) → '−5'   fmt(5) → '5' (nunca '+5')   fmtPar(−5) → '(−5)'   fmtPar(5) → '5'
//   leerEntero('-5') → −5: el alumno puede teclear -, − o –, un + delante y espacios.
//
// ─── Expresiones ───────────────────────────────────────────────────────────────
//
//   analizar(texto) → árbol. El texto admite enteros, + − · : ^ ( ) [ ] y el menos
//   (o el más) delante de un número o de un paréntesis; también * x × / ÷ y los
//   exponentes como superíndices (3²). La jerarquía es la de clase:
//   −3² = −9   (−3)² = 9   −(−3)² = −9   30 : (−5) · 2 = −12   30 : (−5 · 2) = −3
//   El árbol conserva lo escrito (paréntesis y signos), para poder volver a pintarlo:
//     { tipo: 'num', valor }          un número (los que escribe el alumno, ≥ 0; un
//                                     resultado de un paso puede ser negativo)
//     { tipo: 'neg', arg }            el menos delante: −3, −(−4), −3²
//     { tipo: 'pos', arg }            el más delante: +5, (+6)
//     { tipo: 'op', op, izq, der }    op: '+' '-' '*' ':'
//     { tipo: 'pot', base, exp }      exp: un natural
//     { tipo: 'par', forma, arg }     forma: '(' o '['
//   Una «ruta» señala un nodo: '' es la raíz y 'izq.der' es el derecho del izquierdo
//   (hijos: izq y der en 'op', arg en 'neg', 'pos' y 'par', base en 'pot').
//
//   evaluar(árbol o texto) → entero. Lanza un ErrorEnteros con `codigo`
//     'sintaxis', 'division-no-exacta' o 'division-entre-0'.
//   html(árbol o texto, opciones) → HTML con −, ·, : y <sup>. Un resultado negativo
//     que no va el primero sale entre paréntesis: 3 + (−8) · 2. Opciones:
//       marcarOperadores  cada operación, en <span class="ent-op" data-ruta="…">
//                         (en una potencia, el exponente): para tocar la que va primero
//       envolver          { [ruta]: 'clase' }: ese trozo, en <span class="clase">
//                         (por ejemplo, para resaltar la base de una potencia)
//       dividir           ':' (por defecto) o '÷'
//   aTexto(árbol o texto) → el mismo texto sin HTML (exponentes como ², ³…); se puede
//     volver a analizar, y vale como clave de un ítem.
//
// ─── Paso a paso ───────────────────────────────────────────────────────────────
//
//   pasosPosibles(árbol) → las operaciones que se pueden hacer YA, en el orden en que
//     se leen: [{ ruta, tipo, op, a, b, valor, nivel, profundidad, cadena, operacion }].
//     Regla de Juan Luis (2026-10-08): una operación independiente de otra que también
//     podía ir primero no es fallo (3² + 5 · 4 → valen la potencia y el producto); en
//     una cadena del mismo nivel se va de izquierda a derecha, y adelantar la segunda
//     operación solo vale si no cambia el valor (10 · 8 : 4 → 10 · 2 sí; 2 − 4 + 3 →
//     2 − 7 no). Esas se marcan `cadena: true`; `{ cadenas: false }` las quita.
//   aplicarPaso(árbol, i o paso) → el árbol con esa operación hecha. Un paréntesis
//     que se queda con un solo número se quita: (3 − 5) · 4 → −2 · 4.
//   pasoCanonico(árbol) → el que se hace solo cuando el alumno falla: el paréntesis
//     de más adentro, la operación de más nivel y, a igualdad, la de la izquierda.
//   cadenaDePasos(árbol) → [{ arbol }, { arbol, paso }, …] hasta el número final.
//
//   terminos / deTerminos   los términos de una suma o resta, con su signo
//   quitarParentesis(árbol, ruta)  quita un paréntesis precedido de + o de −
//   quitarParentesisDeNumeros(árbol)  5 − (−3) + (+2) → 5 + 3 + 2 (U3-2C-08)
//   bienEscrita(árbol o texto)  false si hay dos signos seguidos sin paréntesis
//                               (5 − −3, 5 · −2): U3-2C-10 y U3-2C-16
//
// ─── Errores típicos ───────────────────────────────────────────────────────────
//
//   Cada error de la nota de U3-4C-08 del inventario es una función que, con los
//   números del ítem, da el resultado equivocado, o `null` cuando ese error no
//   sirve de distractor ahí (porque da lo mismo que la cuenta buena o no se aplica):
//   reglaSignosEnSuma(−2, −3) → 5, pero reglaSignosEnSuma(−2, 3) → null.
//   `ERRORES_TIPICOS[id]` tiene su función, su nombre { es, en } en una frase corta
//   (sirve de opción en «¿Qué error es?» y de `error` en `api.responder`) y un ejemplo.
//   `distractores([[id, …números], …], correcta)` junta los valores que sirven.

export const MENOS = '−';

/** Un entero como se escribe en pantalla: '−5', '0', '5' (nunca '+5'). */
export function fmt(n) {
  return n < 0 ? `${MENOS}${-n}` : `${limpio(n)}`;
}

/** Entre paréntesis si es negativo: para el factor o el divisor que no va primero, la base de una potencia o el −(−4). */
export function fmtPar(n) {
  return n < 0 ? `(${fmt(n)})` : fmt(n);
}

/** Un entero escrito a mano, o null: admite -, − (U+2212) y – (U+2013), un + delante y espacios; nada de decimales. */
export function leerEntero(texto) {
  const t = String(texto ?? '').replace(/[\s  ]+/g, '').replace(/[−‒–—﹣－]/g, '-');
  if (!/^[+-]?\d+$/.test(t)) return null;
  const n = Number(t);
  return Number.isSafeInteger(n) ? limpio(n) : null;
}

/** Quita el −0 de JavaScript. */
const limpio = n => (n === 0 ? 0 : n);

export class ErrorEnteros extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorEnteros';
    this.codigo = codigo;
  }
}

// ─── Análisis ──────────────────────────────────────────────────────────────────

const SUPERINDICE = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const A_SUPERINDICE = Object.fromEntries(Object.entries(SUPERINDICE).map(([s, d]) => [d, s]));
const ES_MENOS = /[-−‒–—﹣－]/;

function fichas(texto) {
  const s = String(texto ?? '');
  const salida = [];
  for (let i = 0; i < s.length;) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/\d/.test(c) || SUPERINDICE[c]) {
      const sup = Boolean(SUPERINDICE[c]);
      let j = i, cifras = '';
      while (j < s.length && (sup ? SUPERINDICE[s[j]] : /\d/.test(s[j]))) cifras += sup ? SUPERINDICE[s[j++]] : s[j++];
      if (sup) salida.push({ t: '^' });
      salida.push({ t: 'num', v: Number(cifras) });
      i = j;
      continue;
    }
    if (c === '+') salida.push({ t: '+' });
    else if (ES_MENOS.test(c)) salida.push({ t: '-' });
    else if ('*·xX×⋅∙'.includes(c)) salida.push({ t: '*' });
    else if (':/÷'.includes(c)) salida.push({ t: ':' });
    else if ('^()[]'.includes(c)) salida.push({ t: c });
    else throw new ErrorEnteros('sintaxis', `No se entiende «${c}» en «${s}»`);
    i++;
  }
  return salida;
}

/** El árbol de una expresión (si ya es un árbol, se devuelve tal cual). */
export function analizar(texto) {
  if (texto && typeof texto === 'object') return texto;
  const ts = fichas(texto);
  let k = 0;
  const ver = () => ts[k]?.t;
  const mal = que => new ErrorEnteros('sintaxis', `${que} en «${texto}»`);
  function suma() {
    let izq = producto();
    while (ver() === '+' || ver() === '-') { const op = ts[k++].t; izq = { tipo: 'op', op, izq, der: producto() }; }
    return izq;
  }
  function producto() {
    let izq = signo();
    while (ver() === '*' || ver() === ':') { const op = ts[k++].t; izq = { tipo: 'op', op, izq, der: signo() }; }
    return izq;
  }
  // El signo de delante va después de la potencia: −3² es −(3²).
  function signo() {
    if (ver() === '-') { k++; return { tipo: 'neg', arg: signo() }; }
    if (ver() === '+') { k++; return { tipo: 'pos', arg: signo() }; }
    return potencia();
  }
  function potencia() {
    const base = atomo();
    if (ver() !== '^') return base;
    k++;
    if (ver() !== 'num') throw mal('Falta el exponente');
    const exp = ts[k++].v;
    if (ver() === '^') throw mal('Dos exponentes seguidos');
    return { tipo: 'pot', base, exp };
  }
  function atomo() {
    const f = ts[k++];
    if (!f) throw mal('Falta un número');
    if (f.t === 'num') return num(f.v);
    if (f.t === '(' || f.t === '[') {
      const arg = suma();
      if (ver() !== (f.t === '(' ? ')' : ']')) throw mal('Falta cerrar un paréntesis');
      k++;
      return { tipo: 'par', forma: f.t, arg };
    }
    throw mal(`Sobra «${f.t}»`);
  }
  const arbol = suma();
  if (k < ts.length) throw mal(`Sobra «${ts[k].t}»`);
  return arbol;
}

const arbolDe = x => analizar(x);

/** Un número suelto (también negativo, como resultado de un paso). */
export const num = valor => ({ tipo: 'num', valor: limpio(valor) });

// ─── Evaluación ────────────────────────────────────────────────────────────────

/** a op b, con división exacta. */
export function operar(op, a, b) {
  if (op === '+') return limpio(a + b);
  if (op === '-') return limpio(a - b);
  if (op === '*') return limpio(a * b);
  if (b === 0) throw new ErrorEnteros('division-entre-0', `${fmt(a)} : 0 no se puede hacer`);
  if (a % b !== 0) throw new ErrorEnteros('division-no-exacta', `${fmt(a)} : ${fmtPar(b)} no es exacta`);
  return limpio(a / b);
}

const elevar = (b, e) => limpio(b ** e);

/** El valor de una expresión (árbol o texto). */
export function evaluar(x) {
  const n = arbolDe(x);
  switch (n.tipo) {
    case 'num': return n.valor;
    case 'neg': return limpio(-evaluar(n.arg));
    case 'pos': case 'par': return evaluar(n.arg);
    case 'pot': return elevar(evaluar(n.base), n.exp);
    case 'op': return operar(n.op, evaluar(n.izq), evaluar(n.der));
    default: throw new ErrorEnteros('sintaxis', `Nodo desconocido: ${n.tipo}`);
  }
}

/** ¿Es un número con su signo (−3, +5), y no una operación? */
const esNumeroConSigno = n => (n.tipo === 'neg' || n.tipo === 'pos') && n.arg.tipo === 'num' && n.arg.valor >= 0;

/** El valor si el nodo es un número ya escrito (5, −3, (−3), (+6)), o null si todavía hay que operar. */
export function valorLiteral(n) {
  if (n.tipo === 'num') return n.valor;
  if (esNumeroConSigno(n)) return n.tipo === 'neg' ? limpio(-n.arg.valor) : n.arg.valor;
  if (n.tipo === 'par') return valorLiteral(n.arg);
  return null;
}

export const esLiteral = n => valorLiteral(arbolDe(n)) !== null;

// ─── Pintar ────────────────────────────────────────────────────────────────────

const hijo = (ruta, k) => (ruta ? `${ruta}.${k}` : k);
const supTexto = e => [...String(e)].map(d => A_SUPERINDICE[d]).join('');

function pintar(n, ruta, primero, o) {
  const marcar = (s, r) => (o.marcarOperadores && !o.texto ? `<span class="ent-op" data-ruta="${r}">${s}</span>` : s);
  let s;
  switch (n.tipo) {
    case 'num':
      s = n.valor < 0 && !primero ? `(${fmt(n.valor)})` : fmt(n.valor);
      break;
    case 'neg': case 'pos': {
      const signo = n.tipo === 'neg' ? MENOS : '+';
      s = `${esNumeroConSigno(n) ? signo : marcar(signo, ruta)}${pintar(n.arg, hijo(ruta, 'arg'), false, o)}`;
      break;
    }
    case 'par': {
      const [abre, cierra] = n.forma === '[' ? ['[', ']'] : ['(', ')'];
      s = `${abre}${pintar(n.arg, hijo(ruta, 'arg'), true, o)}${cierra}`;
      break;
    }
    case 'pot':
      s = `${pintar(n.base, hijo(ruta, 'base'), false, o)}${marcar(o.texto ? supTexto(n.exp) : `<sup>${n.exp}</sup>`, ruta)}`;
      break;
    case 'op': {
      const simbolo = { '+': '+', '-': MENOS, '*': '·', ':': o.dividir === '÷' ? '÷' : ':' }[n.op];
      s = `${pintar(n.izq, hijo(ruta, 'izq'), primero, o)} ${marcar(simbolo, ruta)} ${pintar(n.der, hijo(ruta, 'der'), false, o)}`;
      break;
    }
    default: throw new ErrorEnteros('sintaxis', `Nodo desconocido: ${n.tipo}`);
  }
  const clase = o.envolver?.[ruta];
  return clase && !o.texto ? `<span class="${clase}">${s}</span>` : s;
}

/** HTML de una expresión, con −, ·, : y <sup> (ver las opciones arriba). */
export function html(x, opciones = {}) {
  return pintar(arbolDe(x), '', true, { ...opciones, texto: false });
}

/** La expresión como texto sin HTML ('−3² + 5 · (−2)'); `analizar` la vuelve a leer. */
export function aTexto(x, opciones = {}) {
  return pintar(arbolDe(x), '', true, { ...opciones, texto: true });
}

// ─── Rutas ─────────────────────────────────────────────────────────────────────

/** El nodo de una ruta ('' es la raíz). */
export function nodoEn(x, ruta) {
  let n = arbolDe(x);
  for (const k of ruta ? ruta.split('.') : []) n = n?.[k];
  return n ?? null;
}

/** Copia del árbol con el nodo de `ruta` cambiado por `nuevo`. */
export function reemplazar(x, ruta, nuevo) {
  const n = arbolDe(x);
  if (!ruta) return nuevo;
  const [k, ...resto] = ruta.split('.');
  return { ...n, [k]: reemplazar(n[k], resto.join('.'), nuevo) };
}

/** Quita los paréntesis que solo tienen dentro un número sin signo (los que deja un paso). */
function normalizar(n) {
  switch (n.tipo) {
    case 'par': return n.arg.tipo === 'num' ? n.arg : { ...n, arg: normalizar(n.arg) };
    case 'neg': case 'pos': return { ...n, arg: normalizar(n.arg) };
    case 'pot': return { ...n, base: normalizar(n.base) };
    case 'op': return { ...n, izq: normalizar(n.izq), der: normalizar(n.der) };
    default: return n;
  }
}

// ─── Paso a paso ───────────────────────────────────────────────────────────────

export const NIVEL = { '+': 1, '-': 1, '*': 2, ':': 2, pot: 3, signo: 4 };

function textoOperacion(tipo, op, a, b) {
  if (tipo === 'pot') return `${fmtPar(a)}${supTexto(b)}`;
  if (tipo === 'neg') return `${MENOS}${fmtPar(a)}`;
  if (tipo === 'pos') return `+${fmtPar(a)}`;
  return `${fmt(a)} ${{ '+': '+', '-': MENOS, '*': '·', ':': ':' }[op]} ${fmtPar(b)}`;
}

/** Las operaciones que se pueden hacer ya (ver arriba), en el orden en que se leen. */
export function pasosPosibles(x, { cadenas = true } = {}) {
  const salida = [];
  const intentar = (paso, calcular) => {
    try { salida.push({ ...paso, valor: calcular(), operacion: textoOperacion(paso.tipo, paso.op, paso.a, paso.b) }); } catch { /* no es exacta: no es un paso */ }
  };
  function recorrer(n, ruta, profundidad) {
    switch (n.tipo) {
      case 'par': recorrer(n.arg, hijo(ruta, 'arg'), profundidad + 1); break;
      case 'neg': case 'pos': {
        const a = esNumeroConSigno(n) ? null : valorLiteral(n.arg);
        if (a !== null) intentar({ ruta, tipo: n.tipo, op: n.tipo === 'neg' ? '-' : '+', a, b: null, nivel: NIVEL.signo, profundidad, cadena: false }, () => (n.tipo === 'neg' ? limpio(-a) : a));
        recorrer(n.arg, hijo(ruta, 'arg'), profundidad);
        break;
      }
      case 'pot': {
        recorrer(n.base, hijo(ruta, 'base'), profundidad);
        const a = valorLiteral(n.base);
        if (a !== null) intentar({ ruta, tipo: 'pot', op: '^', a, b: n.exp, nivel: NIVEL.pot, profundidad, cadena: false }, () => elevar(a, n.exp));
        break;
      }
      case 'op': {
        recorrer(n.izq, hijo(ruta, 'izq'), profundidad);
        const a = valorLiteral(n.izq), b = valorLiteral(n.der);
        if (a !== null && b !== null) {
          intentar({ ruta, tipo: 'op', op: n.op, a, b, nivel: NIVEL[n.op], profundidad, cadena: false }, () => operar(n.op, a, b));
        } else if (cadenas && b !== null && n.izq.tipo === 'op' && NIVEL[n.izq.op] === NIVEL[n.op]) {
          // a op1 m op2 b: adelantar «m op2 b» solo vale si no cambia el valor.
          const m = valorLiteral(n.izq.der);
          if (m !== null) {
            intentar({ ruta, tipo: 'op', op: n.op, a: m, b, nivel: NIVEL[n.op], profundidad, cadena: true }, () => {
              const v = operar(n.op, m, b);
              if (evaluar({ tipo: 'op', op: n.izq.op, izq: n.izq.izq, der: num(v) }) !== evaluar(n)) throw new Error('cambia el valor');
              return v;
            });
          }
        }
        recorrer(n.der, hijo(ruta, 'der'), profundidad);
        break;
      }
      default: break;
    }
  }
  recorrer(arbolDe(x), '', 0);
  return salida;
}

/** El árbol con el paso hecho (`p`: su índice en `pasosPosibles(árbol)` o el propio paso). */
export function aplicarPaso(x, p) {
  const arbol = arbolDe(x);
  const paso = typeof p === 'number' ? pasosPosibles(arbol)[p] : p;
  if (!paso) throw new ErrorEnteros('sintaxis', 'Ese paso no existe');
  const nodo = nodoEn(arbol, paso.ruta);
  const nuevo = paso.cadena ? { tipo: 'op', op: nodo.izq.op, izq: nodo.izq.izq, der: num(paso.valor) } : num(paso.valor);
  return normalizar(reemplazar(arbol, paso.ruta, nuevo));
}

/** El paso que toca: el paréntesis de más adentro, la operación de más nivel y, a igualdad, la de la izquierda. */
export function pasoCanonico(x) {
  let mejor = null;
  for (const p of pasosPosibles(x, { cadenas: false })) {
    if (!mejor || p.profundidad > mejor.profundidad || (p.profundidad === mejor.profundidad && p.nivel > mejor.nivel)) mejor = p;
  }
  return mejor;
}

/** Todos los estados, del primero al número final, con los pasos canónicos: [{ arbol }, { arbol, paso }, …]. */
export function cadenaDePasos(x) {
  let arbol = arbolDe(x);
  const estados = [{ arbol }];
  for (let i = 0; i < 200 && valorLiteral(arbol) === null; i++) {
    const paso = pasoCanonico(arbol);
    if (!paso) throw new ErrorEnteros('division-no-exacta', `No se puede terminar «${aTexto(arbol)}»`);
    arbol = aplicarPaso(arbol, paso);
    estados.push({ arbol, paso });
  }
  return estados;
}

// ─── Términos y paréntesis ─────────────────────────────────────────────────────

const esSumaOResta = n => n.tipo === 'op' && (n.op === '+' || n.op === '-');

/**
 * Los términos de una suma o resta, con su signo: '−3 + 5 − (−2)' →
 * [{ signo: −1, arbol: 3 }, { signo: 1, arbol: 5 }, { signo: −1, arbol: (−2) }].
 * Los nodos son los del árbol (la misma referencia). Algo que no es suma ni resta es un solo término.
 */
export function terminos(x) {
  const n = arbolDe(x);
  if (esSumaOResta(n)) return [...terminos(n.izq), { signo: n.op === '-' ? -1 : 1, arbol: n.der }];
  if (n.tipo === 'neg' || n.tipo === 'pos') return [{ signo: n.tipo === 'neg' ? -1 : 1, arbol: n.arg }];
  return [{ signo: 1, arbol: n }];
}

/** Al revés que `terminos`: el primero lleva su menos delante si es negativo; los demás, + o −. */
export function deTerminos(lista) {
  const [primero, ...resto] = lista;
  let arbol = primero.signo < 0 ? { tipo: 'neg', arg: primero.arbol } : primero.arbol;
  for (const t of resto) arbol = { tipo: 'op', op: t.signo < 0 ? '-' : '+', izq: arbol, der: t.arbol };
  return arbol;
}

/**
 * Quita el paréntesis de `ruta`, que tiene que ser un término de una suma o una
 * resta (o la expresión entera): precedido de +, los signos de dentro no cambian;
 * de −, cambian todos (U3-3C-17, U3-3C-18). null si ese paréntesis no se puede
 * quitar así (está en un producto, en una potencia…).
 */
export function quitarParentesis(x, ruta) {
  const arbol = arbolDe(x);
  const par = nodoEn(arbol, ruta);
  if (par?.tipo !== 'par') return null;
  // La suma o resta de la que es término: se sube mientras se venga por la izquierda de otra suma o resta.
  const partes = ruta ? ruta.split('.') : [];
  let raiz = partes.length;
  if (raiz > 0) {
    const padre = nodoEn(arbol, partes.slice(0, -1).join('.'));
    const ultimo = partes.at(-1);
    if (esSumaOResta(padre) && (ultimo === 'der' || ultimo === 'izq')) raiz -= 1;
    else if ((padre.tipo === 'neg' || padre.tipo === 'pos') && ultimo === 'arg') raiz -= 1;
    else return null;
    while (raiz > 0 && partes[raiz - 1] === 'izq' && esSumaOResta(nodoEn(arbol, partes.slice(0, raiz - 1).join('.')))) raiz -= 1;
  }
  const rutaRaiz = partes.slice(0, raiz).join('.');
  const fuera = terminos(nodoEn(arbol, rutaRaiz));
  const i = fuera.findIndex(t => t.arbol === par);
  if (i < 0) return null;
  const dentro = terminos(par.arg).map(t => ({ signo: t.signo * fuera[i].signo, arbol: t.arbol }));
  return reemplazar(arbol, rutaRaiz, deTerminos([...fuera.slice(0, i), ...dentro, ...fuera.slice(i + 1)]));
}

/** Un número entre paréntesis ((−3), (+6), (5)): su valor, o null. */
function numeroEntreParentesis(n) {
  if (n.tipo !== 'par') return null;
  return n.arg.tipo === 'num' || esNumeroConSigno(n.arg) ? valorLiteral(n.arg) : null;
}

/**
 * Quita los paréntesis de los números de las sumas y restas (U3-2C-08):
 * 5 − (−3) + (+2) → 5 + 3 + 2; (−4) − (+6) → −4 − 6. Los de los productos se quedan: 5 · (−2).
 */
export function quitarParentesisDeNumeros(x) {
  function q(n, primero) {
    if (esSumaOResta(n)) {
      const izq = q(n.izq, primero);
      const v = numeroEntreParentesis(n.der) ?? (n.der.tipo === 'num' && n.der.valor < 0 ? n.der.valor : null);
      if (v !== null) {
        const resta = (n.op === '-') !== (v < 0);
        return { tipo: 'op', op: resta ? '-' : '+', izq, der: num(Math.abs(v)) };
      }
      return { ...n, izq, der: q(n.der, false) };
    }
    if (primero) {
      const v = numeroEntreParentesis(n) ?? (n.tipo === 'pos' && esNumeroConSigno(n) ? n.arg.valor : null);
      if (v !== null) return v < 0 ? { tipo: 'neg', arg: num(-v) } : num(v);
    }
    switch (n.tipo) {
      case 'par': return { ...n, arg: q(n.arg, true) };
      case 'neg': case 'pos': return { ...n, arg: q(n.arg, false) };
      case 'pot': return { ...n, base: q(n.base, false) };
      case 'op': return { ...n, izq: q(n.izq, primero), der: q(n.der, false) };
      default: return n;
    }
  }
  return q(arbolDe(x), true);
}

/** false si hay dos signos seguidos sin paréntesis: 5 − −3, 5 −− 3, 5 · −2, −−3. */
export function bienEscrita(x) {
  let arbol;
  try { arbol = arbolDe(x); } catch { return false; }
  const conSigno = n => n.tipo === 'neg' || n.tipo === 'pos';
  function bien(n) {
    switch (n.tipo) {
      case 'op': return !conSigno(n.der) && bien(n.izq) && bien(n.der);
      case 'neg': case 'pos': return !conSigno(n.arg) && bien(n.arg);
      case 'par': return bien(n.arg);
      case 'pot': return bien(n.base);
      default: return true;
    }
  }
  return bien(arbol);
}

// ─── Errores típicos ───────────────────────────────────────────────────────────
// Cada función da el resultado equivocado con los números del ítem, o null si ese
// error no sirve ahí (da lo mismo que la cuenta buena, o no se aplica). En las
// sumas y restas, (a, b) son los dos términos con su signo: −2 − 3 es (−2, −3).

const signo = n => (n < 0 ? -1 : 1);
const siDistinto = (mal, bien) => (mal === null || mal === bien ? null : limpio(mal));
const intentarValor = f => { try { return f(); } catch { return null; } };

/** −2 − 3 = 5: «menos y menos, más» en una suma. Solo con los dos negativos (en −2 + 3 no cambia nada). */
export const reglaSignosEnSuma = (a, b) => (a < 0 && b < 0 ? siDistinto(-a - b, a + b) : null);

/** −7 + 3 = −10: con signos distintos, suma en vez de restar (y deja el signo del mayor). */
export const sumaValoresAbsolutos = (a, b) => (a !== 0 && b !== 0 && signo(a) !== signo(b)
  ? siDistinto(signo(Math.abs(a) >= Math.abs(b) ? a : b) * (Math.abs(a) + Math.abs(b)), a + b) : null);

/** 3 − 7 = 4: resta bien, pero se olvida del signo menos del resultado. */
export const olvidaElSigno = (a, b) => (a + b < 0 ? siDistinto(-(a + b), a + b) : null);

/** −3 + 5 = −2: pone el signo del primero, no el del de mayor valor absoluto. */
export const signoDelPrimero = (a, b) => (a !== 0 ? siDistinto(signo(a) * Math.abs(a + b), a + b) : null);

/** −(−9) = −9: el opuesto de un negativo se queda negativo. `n` es el de dentro (−9). */
export const opuestoDelOpuesto = n => (n < 0 ? siDistinto(n, -n) : null);

/** |−4| = −4. */
export const valorAbsolutoNegativo = n => (n < 0 ? siDistinto(n, -n) : null);

/** 3 − (−2) = 3 − 2: resta un negativo como si fuera positivo. `b` es el negativo (−2). */
export const restarNegativo = (a, b) => (b < 0 ? siDistinto(a + b, a - b) : null);

/** 5 + (−3) = 8: suma un negativo como si fuera positivo. */
export const sumarNegativo = (a, b) => (b < 0 ? siDistinto(a - b, a + b) : null);

/** 5 · (−2) = 10 y (−2) · (−3) = −6: el producto con el signo del factor de mayor valor absoluto, como en una suma. */
export const signoDelMayorEnProducto = (a, b) => (Math.abs(a) !== Math.abs(b) && a !== 0 && b !== 0
  ? siDistinto(signo(Math.abs(a) > Math.abs(b) ? a : b) * Math.abs(a * b), a * b) : null);

/** 12 : (−3) = 4: el cociente con el signo del de mayor valor absoluto. */
export const signoDelMayorEnCociente = (a, b) => (b !== 0 && a % b === 0 && Math.abs(a) !== Math.abs(b) && a !== 0
  ? siDistinto(signo(Math.abs(a) > Math.abs(b) ? a : b) * Math.abs(a / b), a / b) : null);

/** (−2)⁴ = −16: potencia de base negativa y exponente par, con signo menos. */
export const potenciaParNegativa = (b, n) => (b < 0 && n % 2 === 0 && n > 0 ? siDistinto(-elevar(b, n), elevar(b, n)) : null);

/** (−2)³ = 8: potencia de base negativa y exponente impar, con signo más. */
export const potenciaImparPositiva = (b, n) => (b < 0 && n % 2 === 1 ? siDistinto(-elevar(b, n), elevar(b, n)) : null);

/** 4³ = −64: signo menos en una potencia de base positiva. */
export const potenciaDePositivoNegativa = (b, n) => (b > 0 && n > 0 ? siDistinto(-elevar(b, n), elevar(b, n)) : null);

/** (−5)² = −10: multiplica la base por el exponente (2² = 4 no sirve: da lo mismo). */
export const basePorExponente = (b, n) => siDistinto(b * n, elevar(b, n));

/** −3² = 9: eleva también el menos de delante, que no está en la base. `a` es la base (3). */
export const menosEnLaBase = (a, n) => (a > 0 ? siDistinto(elevar(-a, n), -elevar(a, n)) : null);

/** −(−3)² = 9: junta los signos antes de hacer la potencia. `b` es la base negativa (−3). */
export const signosAntesDeLaPotencia = (b, n) => (b < 0 ? siDistinto(elevar(-b, n), -elevar(b, n)) : null);

/** −(−3²) = −9: dentro del paréntesis, toma −3² por (−3)². `a` es la base (3). */
export const menosEnLaBaseDentro = (a, n) => (a > 0 ? siDistinto(-elevar(-a, n), elevar(a, n)) : null);

/** 4 − 5 · 2 = 4 − (−10): usa el menos dos veces. `p` es lo que vale lo que se resta (5 · 2 = 10). */
export const mismoSignoDosVeces = (a, p) => siDistinto(a + p, a - p);

/** 5 − (2 − 7) = 5 − 2 − 7: al quitar el paréntesis, solo cambia el signo del primero. `b` y `c`, los términos de dentro. */
export const menosSoloAlPrimero = (a, b, c) => siDistinto(a - b + c, a - b - c);

/** Inicial menos final en vez de final menos inicial. */
export const inicialMenosFinal = (inicial, final) => siDistinto(inicial - final, final - inicial);

/** La diferencia entre 5 y −3 es 2: resta los números sin su signo. */
export const diferenciaSinSigno = (a, b) => siDistinto(Math.abs(Math.abs(a) - Math.abs(b)), Math.abs(a - b));

/** Se equivoca de signo (el simétrico en la recta, el factor que falta con el signo cambiado…). */
export const signoCambiado = v => siDistinto(-v, v);

/** −5 > −2: compara los negativos como si fueran naturales. Da '<' o '>' (el símbolo equivocado), o null. */
export const comparaComoNaturales = (a, b) => (a < 0 && b < 0 && a !== b ? (a < b ? '>' : '<') : null);

/** Ordena los negativos como si fueran naturales (por su valor absoluto). Da la lista equivocada, o null. */
export function ordenaComoNaturales(lista, creciente = true) {
  const bien = [...lista].sort((x, y) => (creciente ? x - y : y - x));
  const mal = [...lista].sort((x, y) => {
    const k = (x < 0 && y < 0) ? Math.abs(x) - Math.abs(y) : x - y;
    return creciente ? k : -k;
  });
  return mal.join() === bien.join() ? null : mal;
}

// Errores de una expresión entera (reciben el árbol o el texto).

function reasociar(n) {
  switch (n.tipo) {
    case 'par': case 'neg': case 'pos': return { ...n, arg: reasociar(n.arg) };
    case 'pot': return { ...n, base: reasociar(n.base) };
    case 'op': {
      const ops = [], partes = [];
      let m = n;
      while (m.tipo === 'op' && NIVEL[m.op] === NIVEL[n.op]) { ops.unshift(m.op); partes.unshift(m.der); m = m.izq; }
      partes.unshift(m);
      const r = partes.map(reasociar);
      let acc = r.at(-1);
      for (let i = ops.length - 1; i >= 0; i--) acc = { tipo: 'op', op: ops[i], izq: r[i], der: acc };
      return acc;
    }
    default: return n;
  }
}

/** 2 − 4 + 3 = 2 − 7: opera de derecha a izquierda en las cadenas del mismo nivel. */
export function derechaAIzquierda(x) {
  const arbol = arbolDe(x);
  return siDistinto(intentarValor(() => evaluar(reasociar(arbol))), intentarValor(() => evaluar(arbol)));
}

function sinJ(n) {
  switch (n.tipo) {
    case 'num': return n.valor;
    case 'neg': return limpio(-sinJ(n.arg));
    case 'pos': case 'par': return sinJ(n.arg);
    case 'pot': return elevar(sinJ(n.base), n.exp);
    case 'op': {
      // En orden, de izquierda a derecha, sin mirar si es suma o producto.
      const seq = [];
      const aplanar = m => { if (m.tipo === 'op') { aplanar(m.izq); seq.push(m.op); aplanar(m.der); } else seq.push(sinJ(m)); };
      aplanar(n);
      let acc = seq[0];
      for (let i = 1; i < seq.length; i += 2) acc = operar(seq[i], acc, seq[i + 1]);
      return acc;
    }
    default: return null;
  }
}

/** 3 + 4 · 2 = 7 · 2: sin jerarquía, todo de izquierda a derecha (las potencias sí se hacen antes). */
export function sinJerarquia(x) {
  const arbol = arbolDe(x);
  return siDistinto(intentarValor(() => sinJ(arbol)), intentarValor(() => evaluar(arbol)));
}

/** 30 : (−5 · 2) = 30 : (−5) · 2: no tiene en cuenta el paréntesis (el de `ruta` o todos los que agrupan una operación). */
export function ignoraElParentesis(x, ruta = null) {
  const arbol = arbolDe(x);
  function quitar(n, r) {
    switch (n.tipo) {
      case 'par': {
        const dentro = quitar(n.arg, hijo(r, 'arg'));
        return valorLiteral(n.arg) === null && (ruta === null || r === ruta) ? dentro : { ...n, arg: dentro };
      }
      case 'neg': case 'pos': return { ...n, arg: quitar(n.arg, hijo(r, 'arg')) };
      case 'pot': return { ...n, base: quitar(n.base, hijo(r, 'base')) };
      case 'op': return { ...n, izq: quitar(n.izq, hijo(r, 'izq')), der: quitar(n.der, hijo(r, 'der')) };
      default: return n;
    }
  }
  const mal = intentarValor(() => evaluar(analizar(aTexto(quitar(arbol, '')))));
  return siDistinto(mal, intentarValor(() => evaluar(arbol)));
}

/**
 * Los errores típicos de la unidad (nota de U3-4C-08 del inventario), por su id
 * (el que se pasa como `error` a `api.responder`). `entrada`: 'numeros' (la
 * función recibe números) o 'expresion' (recibe el árbol o el texto).
 */
export const ERRORES_TIPICOS = {
  'regla-signos-en-suma': { fn: reglaSignosEnSuma, entrada: 'numeros', ejemplo: '−2 − 3 = 5',
    nombre: { es: 'Ha aplicado la regla de los signos a una suma', en: 'Used the rule of signs in an addition' } },
  'suma-valores-absolutos': { fn: sumaValoresAbsolutos, entrada: 'numeros', ejemplo: '−7 + 3 = −10',
    nombre: { es: 'Ha sumado los números aunque tienen signos distintos', en: 'Added the numbers although their signs are different' } },
  'olvida-el-signo': { fn: olvidaElSigno, entrada: 'numeros', ejemplo: '3 − 7 = 4',
    nombre: { es: 'Ha olvidado el signo menos del resultado', en: 'Forgot the minus sign of the result' } },
  'signo-del-primero': { fn: signoDelPrimero, entrada: 'numeros', ejemplo: '−3 + 5 = −2',
    nombre: { es: 'Ha puesto el signo del primer número, no el del mayor valor absoluto', en: 'Used the sign of the first number, not the one with the greater absolute value' } },
  'opuesto-del-opuesto': { fn: opuestoDelOpuesto, entrada: 'numeros', ejemplo: '−(−9) = −9',
    nombre: { es: 'Ha olvidado que el opuesto de un negativo es positivo', en: 'Forgot that the opposite of a negative number is positive' } },
  'valor-absoluto-negativo': { fn: valorAbsolutoNegativo, entrada: 'numeros', ejemplo: '|−4| = −4',
    nombre: { es: 'Ha dejado negativo un valor absoluto', en: 'Left an absolute value negative' } },
  'restar-negativo': { fn: restarNegativo, entrada: 'numeros', ejemplo: '3 − (−2) = 3 − 2',
    nombre: { es: 'Ha restado un negativo como si fuera positivo', en: 'Subtracted a negative number as if it were positive' } },
  'sumar-negativo': { fn: sumarNegativo, entrada: 'numeros', ejemplo: '5 + (−3) = 8',
    nombre: { es: 'Ha sumado un negativo como si fuera positivo', en: 'Added a negative number as if it were positive' } },
  'signo-del-mayor-producto': { fn: signoDelMayorEnProducto, entrada: 'numeros', ejemplo: '5 · (−2) = 10',
    nombre: { es: 'Ha puesto al producto el signo del número mayor, como en una suma', en: 'Gave the product the sign of the bigger number, as in an addition' } },
  'signo-del-mayor-cociente': { fn: signoDelMayorEnCociente, entrada: 'numeros', ejemplo: '12 : (−3) = 4',
    nombre: { es: 'Ha puesto al cociente el signo del número mayor, como en una suma', en: 'Gave the quotient the sign of the bigger number, as in an addition' } },
  'potencia-par-negativa': { fn: potenciaParNegativa, entrada: 'numeros', ejemplo: '(−2)⁴ = −16',
    nombre: { es: 'Ha dejado negativa una potencia de exponente par', en: 'Left a power with an even exponent negative' } },
  'potencia-impar-positiva': { fn: potenciaImparPositiva, entrada: 'numeros', ejemplo: '(−2)³ = 8',
    nombre: { es: 'Ha dejado positiva una potencia de base negativa y exponente impar', en: 'Made a power with a negative base and an odd exponent positive' } },
  'potencia-positiva-negativa': { fn: potenciaDePositivoNegativa, entrada: 'numeros', ejemplo: '4³ = −64',
    nombre: { es: 'Ha puesto signo menos a una potencia de base positiva', en: 'Put a minus sign on a power with a positive base' } },
  'base-por-exponente': { fn: basePorExponente, entrada: 'numeros', ejemplo: '(−5)² = −10',
    nombre: { es: 'Ha multiplicado la base por el exponente', en: 'Multiplied the base by the exponent' } },
  'menos-en-la-base': { fn: menosEnLaBase, entrada: 'numeros', ejemplo: '−3² = 9',
    nombre: { es: 'Ha elevado también el signo menos, que no está en la base', en: 'Also raised the minus sign, which is not part of the base' } },
  'signos-antes-de-la-potencia': { fn: signosAntesDeLaPotencia, entrada: 'numeros', ejemplo: '−(−3)² = 9',
    nombre: { es: 'Ha juntado los signos antes de hacer la potencia', en: 'Combined the signs before working out the power' } },
  'menos-en-la-base-dentro': { fn: menosEnLaBaseDentro, entrada: 'numeros', ejemplo: '−(−3²) = −9',
    nombre: { es: 'Ha tomado −3² por (−3)² dentro del paréntesis', en: 'Took −3² as (−3)² inside the brackets' } },
  'mismo-signo-dos-veces': { fn: mismoSignoDosVeces, entrada: 'numeros', ejemplo: '4 − 5 · 2 = 4 − (−10)',
    nombre: { es: 'Ha usado el mismo signo menos dos veces', en: 'Used the same minus sign twice' } },
  'menos-solo-al-primero': { fn: menosSoloAlPrimero, entrada: 'numeros', ejemplo: '5 − (2 − 7) = 5 − 2 − 7',
    nombre: { es: 'Al quitar el paréntesis, solo ha cambiado el signo del primer número', en: 'When removing the brackets, only changed the sign of the first number' } },
  'inicial-menos-final': { fn: inicialMenosFinal, entrada: 'numeros', ejemplo: 'de −3 a 5: −3 − 5 = −8',
    nombre: { es: 'Ha restado al revés: el inicial menos el final', en: 'Subtracted the wrong way round: start minus end' } },
  'diferencia-sin-signo': { fn: diferenciaSinSigno, entrada: 'numeros', ejemplo: 'entre 5 y −3: 5 − 3 = 2',
    nombre: { es: 'Ha restado los números sin tener en cuenta su signo', en: 'Subtracted the numbers without looking at their signs' } },
  'signo-cambiado': { fn: signoCambiado, entrada: 'numeros', ejemplo: '−5 → 5',
    nombre: { es: 'Se ha equivocado de signo', en: 'Got the sign wrong' } },
  'compara-como-naturales': { fn: comparaComoNaturales, entrada: 'numeros', ejemplo: '−5 > −2',
    nombre: { es: 'Ha comparado los negativos como si fueran naturales', en: 'Compared negative numbers as if they were natural numbers' } },
  'ordena-como-naturales': { fn: ordenaComoNaturales, entrada: 'numeros', ejemplo: '−2 < −5 < 3',
    nombre: { es: 'Ha ordenado los negativos como si fueran naturales', en: 'Ordered negative numbers as if they were natural numbers' } },
  'derecha-a-izquierda': { fn: derechaAIzquierda, entrada: 'expresion', ejemplo: '2 − 4 + 3 = 2 − 7',
    nombre: { es: 'Ha operado de derecha a izquierda', en: 'Worked from right to left' } },
  'sin-jerarquia': { fn: sinJerarquia, entrada: 'expresion', ejemplo: '3 + 4 · 2 = 7 · 2',
    nombre: { es: 'Ha hecho la suma o la resta antes que el producto', en: 'Did the addition or subtraction before the multiplication' } },
  'ignora-el-parentesis': { fn: ignoraElParentesis, entrada: 'expresion', ejemplo: '30 : (−5 · 2) = 30 : (−5) · 2',
    nombre: { es: 'No ha tenido en cuenta el paréntesis', en: 'Ignored the brackets' } },
};

/**
 * Los distractores que sirven: `candidatos` es una lista de [id, …argumentos]
 * de ERRORES_TIPICOS; devuelve [{ valor, error }] sin los null, sin la respuesta
 * correcta y sin valores repetidos (se queda el primero que lo da).
 */
export function distractores(candidatos, correcta) {
  const vistos = new Set([JSON.stringify(correcta)]);
  const salida = [];
  for (const [id, ...args] of candidatos) {
    const e = ERRORES_TIPICOS[id];
    if (!e) throw new Error(`Error típico desconocido: ${id}`);
    const valor = e.fn(...args);
    const clave = JSON.stringify(valor);
    if (valor === null || vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push({ valor, error: id });
  }
  return salida;
}

// ─── Campo para escribir un entero ─────────────────────────────────────────────

/**
 * Como `campoNumero` de `piezas.js` (que solo lee naturales), pero para un entero.
 * En el móvil, el teclado de cifras no tiene signo menos: por eso lleva delante
 * un botón «±» que pone o quita el menos. Con teclado se puede escribir -, − o –.
 *
 *   const campo = campoEntero(contenedor, { nombre: 'Resultado', boton, alEnviar: comprobar });
 *   campo.valor();     // el entero, o null
 *   campo.bloquear();  // tras responder (bloquea también el botón)
 *
 * Usa el estilo `.campo-numero` de `estilos.css` (y `.campo-numero--malo`).
 */
export function campoEntero(contenedor, { nombre = '', cifras = 4, boton = null, alEnviar = null } = {}) {
  const caja = document.createElement('div');
  caja.className = 'campo-entero';
  caja.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:.5rem;margin:0 auto .9rem;';
  const signo = document.createElement('button');
  signo.type = 'button';
  signo.className = 'campo-entero__signo secundario';
  signo.textContent = `+/${MENOS}`;
  signo.setAttribute('aria-label', `+/${MENOS}`);
  signo.style.cssText = 'min-width:3.2rem;font-size:1.2rem;font-weight:700;margin:0;';
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.inputMode = 'numeric';
  campo.className = 'campo-numero';
  campo.autocomplete = 'off';
  campo.spellcheck = false;
  campo.setAttribute('autocorrect', 'off');
  campo.setAttribute('enterkeyhint', 'done');
  campo.style.setProperty('--cifras', cifras + 1);
  campo.style.margin = '0';
  if (nombre) campo.setAttribute('aria-label', nombre);
  let bloqueado = false;
  const valor = () => leerEntero(campo.value);
  const actualizar = () => {
    const malo = valor() === null && campo.value.trim() !== '';
    campo.classList.toggle('campo-numero--malo', malo);
    campo.setAttribute('aria-invalid', String(malo));
    if (boton) boton.disabled = bloqueado || valor() === null;
  };
  signo.addEventListener('click', () => {
    if (bloqueado) return;
    const t = campo.value.trim();
    campo.value = ES_MENOS.test(t[0] ?? '') ? t.slice(1).trim() : `${MENOS}${t.replace(/^\+/, '')}`;
    actualizar();
    campo.focus();
  });
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    if (!bloqueado && valor() !== null && alEnviar) alEnviar(valor());
  });
  caja.append(signo, campo);
  contenedor.append(caja);
  actualizar();
  return {
    elemento: campo,
    valor,
    bloquear() { bloqueado = true; campo.disabled = true; signo.disabled = true; actualizar(); },
  };
}
