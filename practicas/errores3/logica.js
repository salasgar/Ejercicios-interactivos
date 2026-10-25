// Práctica «Caza el error» de la unidad 3 (PU2, tarea 89): lógica pura (sin DOM ni red).
// Los generadores devuelven DATOS: la base vuelve a montar el mismo ítem al cambiar de idioma.
//
// Un cálculo son 3 o 4 líneas: la expresión y sus desarrollos (los de después se escriben con
// «= » delante en pantalla). Cada línea es una expresión que `analizar` de `enteros.js`
// entiende (`3 − (−2) + 5`, `(−2)^4 − 3`), así que el test puede evaluarlas una a una:
// una línea es FALSA cuando su valor no es el de la línea anterior.
//
// Ítem: { tipo: 'donde' | 'cual' | 'si-no', plantilla, params, lineas: [expresión, …],
//         falsa: índice de la línea falsa o null, error: id de ERRORES_TIPICOS o null,
//         opciones, solucion }
//   'donde'  opciones: los índices de las líneas; solucion = falsa
//   'cual'   opciones: 3 ids de error; solucion = error
//   'si-no'  opciones ['bien', 'error']; solucion = falsa === null ? 'bien' : 'error'

import { fmt, fmtPar, ERRORES_TIPICOS } from '../_comun/enteros.js';

const f = ERRORES_TIPICOS;

/** `−3 + 8 − 2` a partir de los términos con su signo. */
export function terminos(lista) {
  return lista.map((t, i) => (i === 0 ? fmt(t) : t < 0 ? `− ${-t}` : `+ ${t}`)).join(' ');
}
const cs = c => (c < 0 ? `− ${-c}` : `+ ${c}`);                // «+ 3» o «− 3» para el final de una línea
const resto = (c, ...lineas) => lineas.map(l => `${l} ${cs(c)}`);   // añade el último término a cada línea
const signado = (rng, min, max) => rng.elegir([-1, 1]) * rng.entero(min, max);
const elevar = (b, n) => b ** n;

/**
 * Grupos de errores. Un error nunca es distractor de otro del mismo grupo: en cada grupo hay
 * errores cuyo nombre podría describir también el cálculo malo del compañero (por ejemplo,
 * `3 − (−2) = 3 − 2` es «restar un negativo como si fuera positivo» y también «olvidar que el
 * opuesto de un negativo es positivo»). Entre grupos distintos, el nombre habla de otra
 * operación y es inequívocamente falso.
 */
export const GRUPOS = {
  signos: ['regla-signos-en-suma', 'suma-valores-absolutos', 'olvida-el-signo', 'signo-del-primero', 'signo-del-mayor-producto', 'signo-del-mayor-cociente'],
  negativos: ['restar-negativo', 'sumar-negativo', 'opuesto-del-opuesto', 'menos-solo-al-primero', 'mismo-signo-dos-veces'],
  potencia: ['potencia-par-negativa', 'potencia-impar-positiva', 'potencia-positiva-negativa', 'base-por-exponente', 'menos-en-la-base', 'signos-antes-de-la-potencia'],
  orden: ['derecha-a-izquierda', 'sin-jerarquia'],
};
export const GRUPO_DE = Object.fromEntries(Object.entries(GRUPOS).flatMap(([g, ids]) => ids.map(id => [id, g])));

// ─── Plantillas con error ──────────────────────────────────────────────────────
// { id, error, numeros(rng) → params | null, lineas(params) → [3 expresiones], corregida(params) → expresión
//   de la línea mala bien escrita, porque(params) → { es, en } }

/** Dos términos con el error de la tabla y un tercero que se queda igual. */
function dosTerminos(error, valido, porque) {
  return {
    id: error, error,
    numeros(rng) {
      const a = signado(rng, 1, 9), b = signado(rng, 1, 9), c = signado(rng, 1, 9);
      return valido(a, b) && f[error].fn(a, b) !== null ? [a, b, c] : null;
    },
    lineas([a, b, c]) {
      const w = f[error].fn(a, b);
      return [terminos([a, b, c]), terminos([w, c]), fmt(w + c)];
    },
    corregida: ([a, b, c]) => terminos([a + b, c]),
    porque,
  };
}

const L = (es, en) => ({ es, en });
const MENOS_ANTES = (a, b) => `${fmt(a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;

export const PLANTILLAS = [
  dosTerminos('regla-signos-en-suma', (a, b) => a < 0 && b < 0,
    ([a, b]) => L(`${MENOS_ANTES(a, b)}: vas hacia abajo dos veces; ${-a} + ${-b} = ${-a - b}, y el resultado es ${fmt(a + b)}. La regla de los signos es de los productos, no de las sumas.`,
      `${MENOS_ANTES(a, b)}: you go down twice; ${-a} + ${-b} = ${-a - b}, and the result is ${fmt(a + b)}. The rule of signs is for products, not for additions.`)),
  dosTerminos('suma-valores-absolutos', (a, b) => a < 0 !== b < 0,
    ([a, b]) => L(`${MENOS_ANTES(a, b)}: con signos distintos se resta, no se suma: ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(a + b)}, y el resultado es ${fmt(a + b)}.`,
      `${MENOS_ANTES(a, b)}: with different signs you subtract, not add: ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(a + b)}, and the result is ${fmt(a + b)}.`)),
  dosTerminos('olvida-el-signo', (a, b) => a + b < 0,
    ([a, b]) => L(`${MENOS_ANTES(a, b)}: la cuenta sale ${Math.abs(a + b)}, pero el de mayor valor absoluto es negativo; el resultado es ${fmt(a + b)}.`,
      `${MENOS_ANTES(a, b)}: the sum comes to ${Math.abs(a + b)}, but the number with the greater absolute value is negative; the result is ${fmt(a + b)}.`)),
  dosTerminos('signo-del-primero', () => true,
    ([a, b]) => L(`${MENOS_ANTES(a, b)}: el signo es el del número de mayor valor absoluto, no el del primero: el resultado es ${fmt(a + b)}.`,
      `${MENOS_ANTES(a, b)}: the sign is the one of the number with the greater absolute value, not the first one: the result is ${fmt(a + b)}.`)),

  {
    id: 'restar-negativo', error: 'restar-negativo',
    numeros: rng => [rng.entero(2, 9), -rng.entero(2, 9), signado(rng, 1, 9)],
    lineas([a, b, c]) {
      const [l0, l1] = resto(c, `${a} − (${fmt(b)})`, `${a} − ${-b}`);
      return [l0, l1, fmt(a + b + c)];
    },
    corregida: ([a, b, c]) => resto(c, `${a} + ${-b}`)[0],
    porque: ([a, b]) => L(`${a} − (${fmt(b)}): restar un negativo es sumar su opuesto, así que es ${a} + ${-b} = ${a - b}, no ${a} − ${-b}.`,
      `${a} − (${fmt(b)}): subtracting a negative number is adding its opposite, so it is ${a} + ${-b} = ${a - b}, not ${a} − ${-b}.`),
  },
  {
    id: 'sumar-negativo', error: 'sumar-negativo',
    numeros: rng => [rng.entero(2, 9), -rng.entero(2, 9), signado(rng, 1, 9)],
    lineas([a, b, c]) {
      const [l0, l1] = resto(c, `${a} + (${fmt(b)})`, `${a} + ${-b}`);
      return [l0, l1, fmt(a - b + c)];
    },
    corregida: ([a, b, c]) => resto(c, `${a} − ${-b}`)[0],
    porque: ([a, b]) => L(`${a} + (${fmt(b)}): sumar un negativo es restar, así que es ${a} − ${-b} = ${fmt(a + b)}, no ${a} + ${-b}.`,
      `${a} + (${fmt(b)}): adding a negative number is subtracting, so it is ${a} − ${-b} = ${fmt(a + b)}, not ${a} + ${-b}.`),
  },
  {
    id: 'opuesto-del-opuesto', error: 'opuesto-del-opuesto',
    numeros: rng => [rng.entero(2, 9), signado(rng, 1, 9)],
    lineas([a, c]) {
      const [l0, l1] = resto(c, `−(${fmt(-a)})`, fmt(-a));
      return [l0, l1, fmt(-a + c)];
    },
    corregida: ([a, c]) => resto(c, fmt(a))[0],
    porque: ([a]) => L(`−(${fmt(-a)}): el opuesto de ${fmt(-a)} es ${a}, así que −(${fmt(-a)}) = ${a}, no ${fmt(-a)}.`,
      `−(${fmt(-a)}): the opposite of ${fmt(-a)} is ${a}, so −(${fmt(-a)}) = ${a}, not ${fmt(-a)}.`),
  },
  {
    id: 'menos-solo-al-primero', error: 'menos-solo-al-primero',
    numeros(rng) {
      const a = rng.entero(1, 9), b = rng.entero(1, 9), c = signado(rng, 2, 9);
      return f['menos-solo-al-primero'].fn(a, b, c) === null ? null : [a, b, c];
    },
    lineas([a, b, c]) {
      return [`${a} − (${terminos([b, c])})`, terminos([a, -b, c]), fmt(a - b + c)];
    },
    corregida: ([a, b, c]) => terminos([a, -b, -c]),
    porque: ([a, b, c]) => L(`${a} − (${terminos([b, c])}): el menos cambia el signo de TODO lo que hay dentro: ${a} − ${b} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${fmt(a - b - c)}.`,
      `${a} − (${terminos([b, c])}): the minus changes the sign of EVERYTHING inside: ${a} − ${b} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${fmt(a - b - c)}.`),
  },
  {
    id: 'mismo-signo-dos-veces', error: 'mismo-signo-dos-veces',
    numeros: rng => [signado(rng, 1, 9), rng.entero(2, 9), rng.entero(2, 9)],
    lineas([a, p, q]) {
      return [`${fmt(a)} − ${p} · ${q}`, `${fmt(a)} − (−${p * q})`, fmt(a + p * q)];
    },
    corregida: ([a, p, q]) => `${fmt(a)} − ${p * q}`,
    porque: ([a, p, q]) => L(`${fmt(a)} − ${p} · ${q}: primero el producto, ${p} · ${q} = ${p * q}, y ese menos se queda como está: ${fmt(a)} − ${p * q} = ${fmt(a - p * q)}. No se pone otro signo.`,
      `${fmt(a)} − ${p} · ${q}: first the product, ${p} · ${q} = ${p * q}, and that minus stays as it is: ${fmt(a)} − ${p * q} = ${fmt(a - p * q)}. No other sign is added.`),
  },

  {
    id: 'signo-del-mayor-producto', error: 'signo-del-mayor-producto',
    numeros(rng) {
      const a = signado(rng, 2, 9), b = (a < 0 ? 1 : -1) * rng.entero(2, 9);
      return f['signo-del-mayor-producto'].fn(a, b) === null ? null : [a, b, signado(rng, 1, 9)];
    },
    lineas([a, b, c]) {
      const w = f['signo-del-mayor-producto'].fn(a, b);
      const [l0, l1] = resto(c, `${fmt(a)} · ${fmtPar(b)}`, fmt(w));
      return [l0, l1, fmt(w + c)];
    },
    corregida: ([a, b, c]) => resto(c, fmt(a * b))[0],
    porque: ([a, b]) => L(`${fmt(a)} · ${fmtPar(b)}: los signos son distintos, así que el producto es negativo; el signo del mayor no cuenta aquí. ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)} y sale ${fmt(a * b)}.`,
      `${fmt(a)} · ${fmtPar(b)}: the signs are different, so the product is negative; the sign of the bigger number does not matter here. ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)} and it comes to ${fmt(a * b)}.`),
  },
  {
    id: 'signo-del-mayor-cociente', error: 'signo-del-mayor-cociente',
    numeros(rng) {
      const b = rng.entero(2, 6) * rng.elegir([-1, 1]), q = -rng.entero(2, 9);
      const a = b * q;
      return f['signo-del-mayor-cociente'].fn(a, b) === null ? null : [a, b, signado(rng, 1, 9)];
    },
    lineas([a, b, c]) {
      const w = f['signo-del-mayor-cociente'].fn(a, b);
      const [l0, l1] = resto(c, `${fmt(a)} : ${fmtPar(b)}`, fmt(w));
      return [l0, l1, fmt(w + c)];
    },
    corregida: ([a, b, c]) => resto(c, fmt(a / b))[0],
    porque: ([a, b]) => L(`${fmt(a)} : ${fmtPar(b)}: los signos son distintos, así que el cociente es negativo. ${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(a / b)} y sale ${fmt(a / b)}.`,
      `${fmt(a)} : ${fmtPar(b)}: the signs are different, so the quotient is negative. ${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(a / b)} and it comes to ${fmt(a / b)}.`),
  },

  // Potencias: (base, exponente) con bases y exponentes que dejan potencias razonables (hasta 256).
  potencia('potencia-par-negativa', rng => [-rng.elegir([2, 3, 4, 5, 6, 7, 8, 9]), 2], rng => [-rng.elegir([2, 3]), 4],
    (b, n) => `(${fmt(b)})^${n}`,
    (b, n) => L(`(${fmt(b)})^${n}: el exponente es par, así que el resultado es positivo: ${fmt(b)} multiplicado ${n} veces da ${elevar(b, n)}.`,
      `(${fmt(b)})^${n}: the exponent is even, so the result is positive: ${fmt(b)} multiplied ${n} times gives ${elevar(b, n)}.`)),
  potencia('potencia-impar-positiva', rng => [-rng.elegir([2, 3, 4, 5]), 3], rng => [-2, 5],
    (b, n) => `(${fmt(b)})^${n}`,
    (b, n) => L(`(${fmt(b)})^${n}: la base es negativa y el exponente impar, así que el resultado es negativo: ${fmt(elevar(b, n))}.`,
      `(${fmt(b)})^${n}: the base is negative and the exponent is odd, so the result is negative: ${fmt(elevar(b, n))}.`)),
  potencia('potencia-positiva-negativa', rng => [rng.elegir([2, 3, 4, 5]), rng.elegir([2, 3])], rng => [2, 4],
    (b, n) => `${b}^${n}`,
    (b, n) => L(`${b}^${n}: la base es positiva, así que el resultado es positivo: ${elevar(b, n)}. El menos no sale de la nada.`,
      `${b}^${n}: the base is positive, so the result is positive: ${elevar(b, n)}. A minus sign cannot just appear.`)),
  potencia('base-por-exponente', rng => [signado(rng, 3, 5), rng.elegir([2, 3])], rng => [signado(rng, 2, 3), 4],
    (b, n) => `${fmtPar(b)}^${n}`,
    (b, n) => L(`${fmtPar(b)}^${n}: una potencia no es base por exponente. Es ${n} veces la base multiplicada: ${fmt(elevar(b, n))}.`,
      `${fmtPar(b)}^${n}: a power is not base times exponent. It is the base multiplied ${n} times: ${fmt(elevar(b, n))}.`)),
  potencia('menos-en-la-base', rng => [rng.entero(2, 9), 2], rng => [rng.elegir([2, 3]), 4],
    (a, n) => `−${a}^${n}`,
    (a, n) => L(`−${a}^${n}: la base es ${a}, no −${a}. Primero la potencia, ${a}^${n} = ${elevar(a, n)}, y después el menos: ${fmt(-elevar(a, n))}.`,
      `−${a}^${n}: the base is ${a}, not −${a}. First the power, ${a}^${n} = ${elevar(a, n)}, and then the minus: ${fmt(-elevar(a, n))}.`),
    (a, n) => -elevar(a, n)),
  potencia('signos-antes-de-la-potencia', rng => [-rng.entero(2, 9), 2], rng => [-rng.elegir([2, 3]), 4],
    (b, n) => `−(${fmt(b)})^${n}`,
    (b, n) => L(`−(${fmt(b)})^${n}: primero la potencia, (${fmt(b)})^${n} = ${elevar(b, n)}, y después el menos de delante: ${fmt(-elevar(b, n))}. No se juntan los dos signos antes.`,
      `−(${fmt(b)})^${n}: first the power, (${fmt(b)})^${n} = ${elevar(b, n)}, and then the minus in front: ${fmt(-elevar(b, n))}. The two signs are not combined first.`),
    (b, n) => -elevar(b, n)),

  {
    id: 'derecha-a-izquierda', error: 'derecha-a-izquierda',
    numeros: rng => [signado(rng, 1, 9), rng.entero(1, 9), rng.entero(1, 9)],
    lineas([a, b, c]) { return [`${fmt(a)} − ${b} + ${c}`, `${fmt(a)} − ${b + c}`, fmt(a - b - c)]; },
    corregida: ([a, b, c]) => `${fmt(a - b)} + ${c}`,
    porque: ([a, b, c]) => L(`${fmt(a)} − ${b} + ${c}: se va de izquierda a derecha. ${fmt(a)} − ${b} = ${fmt(a - b)}, y ${fmt(a - b)} + ${c} = ${fmt(a - b + c)}.`,
      `${fmt(a)} − ${b} + ${c}: you work from left to right. ${fmt(a)} − ${b} = ${fmt(a - b)}, and ${fmt(a - b)} + ${c} = ${fmt(a - b + c)}.`),
  },
  {
    id: 'sin-jerarquia', error: 'sin-jerarquia',
    numeros(rng) {
      const a = signado(rng, 1, 9), b = rng.entero(2, 6), c = rng.entero(2, 6), s = rng.elegir([1, -1]);
      return a + s * b === 0 ? null : [a, b, c, s];
    },
    lineas([a, b, c, s]) {
      const op = s < 0 ? '−' : '+';
      return [`${fmt(a)} ${op} ${b} · ${c}`, `${fmt(a + s * b)} · ${c}`, fmt((a + s * b) * c)];
    },
    corregida: ([a, b, c, s]) => `${fmt(a)} ${s < 0 ? '−' : '+'} ${b * c}`,
    porque: ([a, b, c, s]) => L(`${fmt(a)} ${s < 0 ? '−' : '+'} ${b} · ${c}: el producto va antes que la suma y la resta. ${b} · ${c} = ${b * c}, y ${fmt(a)} ${s < 0 ? '−' : '+'} ${b * c} = ${fmt(a + s * b * c)}.`,
      `${fmt(a)} ${s < 0 ? '−' : '+'} ${b} · ${c}: multiplication comes before addition and subtraction. ${b} · ${c} = ${b * c}, and ${fmt(a)} ${s < 0 ? '−' : '+'} ${b * c} = ${fmt(a + s * b * c)}.`),
  },
];

/**
 * Plantilla de potencia. `base(rng)` y `base2(rng)` dan [base, exponente] (el segundo, la variante con
 * exponente 4 o 5); `cuerpo(b, n)` es la línea 0 sin el resto; `porque(b, n)`. `bien(b, n)` (opcional)
 * da el valor bueno si no es la potencia de la base.
 */
function potencia(id, base, base2, cuerpo, porque, bien) {
  return {
    id, error: id,
    numeros(rng) {
      const [b, n] = rng.azar() < 0.25 ? base2(rng) : base(rng);
      return f[id].fn(b, n) === null ? null : [b, n, signado(rng, 1, 9)];
    },
    lineas([b, n, c]) {
      const w = f[id].fn(b, n);
      const [l0, l1] = resto(c, cuerpo(b, n), fmt(w));
      return [l0, l1, fmt(w + c)];
    },
    corregida: ([b, n, c]) => resto(c, fmt(bien ? bien(b, n) : elevar(b, n)))[0],
    porque: ([b, n]) => porque(b, n),
  };
}

export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));

// ─── Plantillas sin error (lo que NO es un error: parejas válidas de U3-4C-09) ──
// Cada una tiene su «gemela» con error en PLANTILLAS (`parecido`): lo que un alumno podría
// creer mal. Todas las líneas son verdaderas.

export const VALIDAS = [
  {
    id: 'agrupar', parecido: 'regla-signos-en-suma',
    numeros(rng) {
      const t = rng.barajar([rng.entero(1, 9), rng.entero(1, 9), -rng.entero(1, 9), -rng.entero(1, 9)]);
      return t;
    },
    lineas(t) {
      const p = t.filter(x => x > 0).reduce((s, x) => s + x, 0), n = -t.filter(x => x < 0).reduce((s, x) => s + x, 0);
      return [terminos(t), `${p} − ${n}`, fmt(p - n)];
    },
    porque(t) {
      const pos = t.filter(x => x > 0), neg = t.filter(x => x < 0).map(x => -x);
      const p = pos.reduce((s, x) => s + x, 0), n = neg.reduce((s, x) => s + x, 0);
      return L(`Está bien: se pueden agrupar los positivos (${pos.join(' + ')} = ${p}) y los negativos (${neg.join(' + ')} = ${n}): ${p} − ${n} = ${fmt(p - n)}. Ir de izquierda a derecha da lo mismo.`,
        `It is right: you can group the positive numbers (${pos.join(' + ')} = ${p}) and the negative ones (${neg.join(' + ')} = ${n}): ${p} − ${n} = ${fmt(p - n)}. Going from left to right gives the same.`);
    },
  },
  {
    id: 'quitar-parentesis', parecido: 'menos-solo-al-primero',
    numeros: rng => [rng.entero(1, 9), rng.entero(1, 9), signado(rng, 2, 9)],
    lineas([a, b, c]) { return [`${a} − (${terminos([b, c])})`, terminos([a, -b, -c]), fmt(a - b - c)]; },
    porque: ([a, b, c]) => L(`Está bien: al quitar el paréntesis cambian los signos de todo lo de dentro: ${a} − ${b} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${fmt(a - b - c)}. Operar dentro del paréntesis da lo mismo.`,
      `It is right: when you remove the brackets, every sign inside changes: ${a} − ${b} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${fmt(a - b - c)}. Working inside the brackets gives the same.`),
  },
  {
    id: 'operar-dentro', parecido: 'menos-solo-al-primero',
    numeros(rng) {
      const a = rng.entero(1, 9), b = rng.entero(1, 9), c = rng.entero(1, 9);
      return b === c ? null : [a, b, c];
    },
    lineas([a, b, c]) { return [`${a} − (${b} − ${c})`, `${a} − ${fmtPar(b - c)}`, fmt(a - (b - c))]; },
    porque: ([a, b, c]) => L(`Está bien: primero se hace lo de dentro del paréntesis, ${b} − ${c} = ${fmt(b - c)}, y después ${a} − ${fmtPar(b - c)} = ${fmt(a - b + c)}.`,
      `It is right: first you work out what is inside the brackets, ${b} − ${c} = ${fmt(b - c)}, and then ${a} − ${fmtPar(b - c)} = ${fmt(a - b + c)}.`),
  },
  {
    id: 'izquierda-a-derecha', parecido: 'derecha-a-izquierda',
    numeros: rng => [signado(rng, 1, 9), signado(rng, 1, 9), signado(rng, 1, 9)],
    lineas([a, b, c]) { return [terminos([a, b, c]), terminos([a + b, c]), fmt(a + b + c)]; },
    porque: ([a, b, c]) => L(`Está bien: de izquierda a derecha, ${fmt(a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fmt(a + b)}, y ${fmt(a + b)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${fmt(a + b + c)}.`,
      `It is right: from left to right, ${fmt(a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fmt(a + b)}, and ${fmt(a + b)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${fmt(a + b + c)}.`),
  },
  {
    id: 'producto-bien', parecido: 'signo-del-mayor-producto',
    numeros(rng) {
      const a = signado(rng, 2, 9), b = (a < 0 ? 1 : -1) * rng.entero(2, 9);
      return Math.abs(a) === Math.abs(b) ? null : [a, b, signado(rng, 1, 9)];
    },
    lineas([a, b, c]) { const [l0, l1] = resto(c, `${fmt(a)} · ${fmtPar(b)}`, fmt(a * b)); return [l0, l1, fmt(a * b + c)]; },
    porque: ([a, b]) => L(`Está bien: signos distintos, producto negativo. ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)}, así que ${fmt(a)} · ${fmtPar(b)} = ${fmt(a * b)}.`,
      `It is right: different signs, negative product. ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)}, so ${fmt(a)} · ${fmtPar(b)} = ${fmt(a * b)}.`),
  },
  {
    id: 'potencia-bien', parecido: 'potencia-par-negativa',
    numeros: rng => rng.azar() < 0.3 ? [-rng.elegir([2, 3]), 4, signado(rng, 1, 9)] : [-rng.entero(2, 9), 2, signado(rng, 1, 9)],
    lineas([b, n, c]) { const [l0, l1] = resto(c, `(${fmt(b)})^${n}`, fmt(elevar(b, n))); return [l0, l1, fmt(elevar(b, n) + c)]; },
    porque: ([b, n]) => L(`Está bien: la base es ${fmt(b)} y el exponente es par, así que el resultado es positivo: ${elevar(b, n)}.`,
      `It is right: the base is ${fmt(b)} and the exponent is even, so the result is positive: ${elevar(b, n)}.`),
  },
  {
    id: 'restar-negativo-bien', parecido: 'restar-negativo',
    numeros: rng => [rng.entero(2, 9), -rng.entero(2, 9), signado(rng, 1, 9)],
    lineas([a, b, c]) { const [l0, l1] = resto(c, `${a} − (${fmt(b)})`, `${a} + ${-b}`); return [l0, l1, fmt(a - b + c)]; },
    porque: ([a, b]) => L(`Está bien: restar ${fmt(b)} es sumar su opuesto, ${-b}. ${a} + ${-b} = ${a - b}.`,
      `It is right: subtracting ${fmt(b)} is adding its opposite, ${-b}. ${a} + ${-b} = ${a - b}.`),
  },
  {
    id: 'menos-en-la-base-bien', parecido: 'menos-en-la-base',
    numeros: rng => [rng.entero(2, 9), 2, signado(rng, 1, 9)],
    lineas([a, n, c]) { const [l0, l1] = resto(c, `−${a}^${n}`, fmt(-elevar(a, n))); return [l0, l1, fmt(-elevar(a, n) + c)]; },
    porque: ([a, n]) => L(`Está bien: la base es ${a}; primero la potencia, ${a}^${n} = ${elevar(a, n)}, y después el menos.`,
      `It is right: the base is ${a}; first the power, ${a}^${n} = ${elevar(a, n)}, and then the minus.`),
  },
  {
    id: 'jerarquia-bien', parecido: 'sin-jerarquia',
    numeros: rng => [signado(rng, 1, 9), rng.entero(2, 6), rng.entero(2, 6), rng.elegir([1, -1])],
    lineas([a, b, c, s]) { return [`${fmt(a)} ${s < 0 ? '−' : '+'} ${b} · ${c}`, `${fmt(a)} ${s < 0 ? '−' : '+'} ${b * c}`, fmt(a + s * b * c)]; },
    porque: ([a, b, c, s]) => L(`Está bien: primero el producto, ${b} · ${c} = ${b * c}, y después ${fmt(a)} ${s < 0 ? '−' : '+'} ${b * c} = ${fmt(a + s * b * c)}.`,
      `It is right: first the multiplication, ${b} · ${c} = ${b * c}, and then ${fmt(a)} ${s < 0 ? '−' : '+'} ${b * c} = ${fmt(a + s * b * c)}.`),
  },
];
export const VALIDA_POR_ID = Object.fromEntries(VALIDAS.map(p => [p.id, p]));

// ─── Generadores ───────────────────────────────────────────────────────────────

/** Un parámetro válido de la plantilla, o null si el azar no dio uno bueno (se reintenta). */
function conParams(plantilla, rng) {
  for (let i = 0; i < 200; i++) {
    const params = plantilla.numeros(rng);
    if (params) return params;
  }
  throw new Error(`La plantilla «${plantilla.id}» no encuentra números`);
}

/** Plantillas cuya primera línea acaba en un término suelto («… + 5»): se pueden alargar un paso. */
const SIN_COLA = new Set(['menos-solo-al-primero', 'mismo-signo-dos-veces', 'derecha-a-izquierda', 'sin-jerarquia',
  'agrupar', 'quitar-parentesis', 'operar-dentro', 'izquierda-a-derecha']);

/**
 * Con la mitad de las veces, parte el último término de la línea 0 en dos («… + 5» → «… + 2 + 3») y deja
 * la expresión original como línea 1, que es verdadera: así el error no está siempre en la misma línea.
 */
function alargar(rng, plantilla, lineas, falsa) {
  const m = SIN_COLA.has(plantilla.id) ? null : /^(.*) ([+−]) (\d+)$/.exec(lineas[0]);
  if (!m || Number(m[3]) < 2 || rng.azar() < 0.5) return { lineas, falsa };
  const d = rng.entero(1, Number(m[3]) - 1);
  return { lineas: [`${m[1]} ${m[2]} ${d} ${m[2]} ${Number(m[3]) - d}`, ...lineas], falsa: falsa === null ? null : falsa + 1 };
}

function conError(rng, plantilla = rng.elegir(PLANTILLAS)) {
  const params = conParams(plantilla, rng);
  const { lineas, falsa } = alargar(rng, plantilla, plantilla.lineas(params), 1);
  return { plantilla: plantilla.id, params, lineas, falsa, error: plantilla.error };
}

function sinError(rng, plantilla = rng.elegir(VALIDAS)) {
  const params = conParams(plantilla, rng);
  const { lineas, falsa } = alargar(rng, plantilla, plantilla.lineas(params), null);
  return { plantilla: plantilla.id, params, lineas, falsa, error: null };
}

/** Ejercicio 1: ¿dónde está el error? La línea falsa es la 1 o la 2 (la 0 es el enunciado). Cada línea es una opción. */
export function generarDonde(rng) {
  const base = conError(rng);
  return { ...base, tipo: 'donde', opciones: base.lineas.map((_, i) => i), solucion: base.falsa };
}

/**
 * Ejercicio 2: ¿qué error es? El nombre bueno y dos de OTRO grupo (ver GRUPOS), que no pueden describir
 * este cálculo.
 */
export function generarCual(rng) {
  const base = conError(rng);
  const grupo = GRUPO_DE[base.error];
  const posibles = PLANTILLAS.map(p => p.error).filter(id => GRUPO_DE[id] !== grupo);
  const distractores = rng.barajar(posibles).slice(0, 2);
  return { ...base, tipo: 'cual', opciones: rng.barajar([base.error, ...distractores]), solucion: base.error };
}

/** Ejercicio 3: ¿error o no? Mitad y mitad. */
export function generarSiNo(rng) {
  const mal = rng.azar() < 0.5;
  const base = mal ? conError(rng) : sinError(rng);
  return { ...base, tipo: 'si-no', opciones: ['bien', 'error'], solucion: mal ? 'error' : 'bien' };
}

/** Clave para que la base no repita el ítem anterior. */
export const claveItem = item => `${item.plantilla}|${item.params.join(',')}`;
