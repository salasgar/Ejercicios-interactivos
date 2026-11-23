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

import { fmt, fmtPar, ERRORES_TIPICOS, evaluar } from '../_comun/enteros.js';

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
    /** ¿Estos números dan este error? (lo usan las familias de columnas). */
    valido: ([a, b]) => valido(a, b) && f[error].fn(a, b) !== null,
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

/**
 * «−9 + 4 = −5: 9 − 4 = 5, con el signo del 9» o, si la cuenta ya es la resta de los valores absolutos
 * («8 − 3»), solo «8 − 3 = 5» (antes decía «8 − 3 = 5, y el resultado es 5»).
 */
function restaDeAbsolutos(a, b) {
  const [M, m] = [Math.max(Math.abs(a), Math.abs(b)), Math.min(Math.abs(a), Math.abs(b))];
  const mayor = Math.abs(a) >= Math.abs(b) ? a : b;
  if (MENOS_ANTES(a, b) === `${M} − ${m}`) return L(`${M} − ${m} = ${fmt(a + b)}.`, `${M} − ${m} = ${fmt(a + b)}.`);
  return L(`${MENOS_ANTES(a, b)} = ${fmt(a + b)}: ${M} − ${m} = ${Math.abs(a + b)}, con el signo del ${fmt(mayor)}.`,
    `${MENOS_ANTES(a, b)} = ${fmt(a + b)}: ${M} − ${m} = ${Math.abs(a + b)}, with the sign of ${fmt(mayor)}.`);
}

export const PLANTILLAS = [
  // Los porqués solo llevan los números del ítem: la regla va aparte, en negrita (JL, 22-11).
  dosTerminos('regla-signos-en-suma', (a, b) => a < 0 && b < 0,
    ([a, b]) => L(`${MENOS_ANTES(a, b)}: vas hacia abajo dos veces, ${-a} + ${-b} = ${-a - b}, así que da ${fmt(a + b)}.`,
      `${MENOS_ANTES(a, b)}: you go down twice, ${-a} + ${-b} = ${-a - b}, so it is ${fmt(a + b)}.`)),
  dosTerminos('suma-valores-absolutos', (a, b) => a < 0 !== b < 0, ([a, b]) => restaDeAbsolutos(a, b)),
  dosTerminos('olvida-el-signo', (a, b) => a + b < 0, ([a, b]) => restaDeAbsolutos(a, b)),
  dosTerminos('signo-del-primero', () => true, ([a, b]) => restaDeAbsolutos(a, b)),

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
    porque: ([a, b, c]) => L(`${a} − (${terminos([b, c])}) = ${a} − ${b} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${fmt(a - b - c)}: también cambia el signo del ${Math.abs(c)}.`,
      `${a} − (${terminos([b, c])}) = ${a} − ${b} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${fmt(a - b - c)}: the sign of ${Math.abs(c)} changes too.`),
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
    porque: ([a, b]) => L(`${fmt(a)} · ${fmtPar(b)}: ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)}, con signos distintos: ${fmt(a * b)}. El signo del mayor no cuenta aquí.`,
      `${fmt(a)} · ${fmtPar(b)}: ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)}, with different signs: ${fmt(a * b)}. The sign of the bigger number does not matter here.`),
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
    porque: ([a, b]) => L(`${fmt(a)} : ${fmtPar(b)}: ${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(a / b)}, con signos distintos: ${fmt(a / b)}.`,
      `${fmt(a)} : ${fmtPar(b)}: ${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(a / b)}, with different signs: ${fmt(a / b)}.`),
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

// ─── Ejercicio 1 en columnas (JL, 22-11) ────────────────────────────────────────
//
// El mismo cálculo resuelto por varios alumnos, uno por columna: de 2 a 4 columnas, 1 o 2 bien y 1 o 2 con un
// error (errores distintos). El alumno toca la línea mala de cada columna que esté mal (no se le dice cuántas
// hay) y después nombra el error de cada una. Antes era un solo cálculo de tres líneas, y el error se deducía:
// si la última cuenta cuadra, tiene que estar en la segunda.
//
// Una FAMILIA es una forma de cálculo con sus números (`numeros`) y sus rutas: plantillas con error y parejas
// válidas de arriba que, con esos números, empiezan por la misma expresión (`mapa` pasa los números de la
// familia a los de la plantilla, o da null si no vale), y rutas propias (`propia`). Todas las columnas de un
// ítem empiezan por la misma línea: el enunciado.

/** Una ruta propia (sin plantilla): { id, error, lineas(params) → [expresiones tras la 0], falsa, corregida, porque }. */
const propia = r => ({ propia: true, ...r });

const PARENTESIS_RESTAR = propia({
  // 5 − (3 − 7) = 5 − (−4) = 5 − 4 = 1: opera bien dentro y luego resta el negativo como si fuera positivo.
  id: 'parentesis-restar-negativo', error: 'restar-negativo',
  vale: ([, b, c]) => b + c < 0,
  lineas: ([a, b, c]) => [`${a} − (${fmt(b + c)})`, `${a} − ${-(b + c)}`, fmt(a + b + c)],
  falsa: 2,
  corregida: ([a, b, c]) => `${a} + ${-(b + c)}`,
  porque: ([a, b, c]) => PLANTILLA_POR_ID['restar-negativo'].porque([a, b + c]),
});
const PARENTESIS_OPERAR = propia({
  // 5 − (3 − 7) = 5 − (−4) = 5 + 4 = 9 (o 5 − (3 + 4) = 5 − 7 = −2): opera dentro del paréntesis.
  id: 'parentesis-operar-dentro', error: null,
  vale: ([, b, c]) => b + c !== 0,
  lineas: ([a, b, c]) => (b + c < 0 ? [`${a} − (${fmt(b + c)})`, `${a} + ${-(b + c)}`, fmt(a - b - c)] : [`${a} − ${b + c}`, fmt(a - b - c)]),
  porque: ([a, b, c]) => L(`Está bien: primero lo de dentro del paréntesis, ${terminos([b, c])} = ${fmt(b + c)}, y después ${a} − ${fmtPar(b + c)} = ${fmt(a - b - c)}.`,
    `It is right: first what is inside the brackets, ${terminos([b, c])} = ${fmt(b + c)}, and then ${a} − ${fmtPar(b + c)} = ${fmt(a - b - c)}.`),
});
const PARENTESIS_QUITAR = propia({
  // 5 − (3 − 7) = 5 − 3 + 7 = 2 + 7 = 9: quita el paréntesis cambiando los signos de dentro.
  id: 'parentesis-quitar', error: null,
  lineas: ([a, b, c]) => [terminos([a, -b, -c]), terminos([a - b, -c]), fmt(a - b - c)],
  porque: ([a, b, c]) => VALIDA_POR_ID['quitar-parentesis'].porque([a, b, c]),
});
const PARENTESIS_MENOS = propia({
  // 5 − (3 − 7) = 5 − 3 − 7 = 2 − 7 = −5: el menos solo cambia el primer término.
  id: 'parentesis-menos-solo-al-primero', error: 'menos-solo-al-primero',
  vale: ([a, b, c]) => f['menos-solo-al-primero'].fn(a, b, c) !== null,
  lineas: ([a, b, c]) => [terminos([a, -b, c]), terminos([a - b, c]), fmt(a - b + c)],
  falsa: 1,
  corregida: ([a, b, c]) => terminos([a, -b, -c]),
  porque: p => PLANTILLA_POR_ID['menos-solo-al-primero'].porque(p),
});
const SUMAR_NEGATIVO_BIEN = propia({
  id: 'sumar-negativo-bien', error: null,
  lineas: ([a, b, c]) => { const [l1] = resto(c, `${a} − ${-b}`); return [l1, fmt(a + b + c)]; },
  porque: ([a, b]) => L(`Está bien: sumar ${fmt(b)} es restar ${-b}. ${a} − ${-b} = ${fmt(a + b)}.`, `It is right: adding ${fmt(b)} is subtracting ${-b}. ${a} − ${-b} = ${fmt(a + b)}.`),
});
const DE_GOLPE_RESTAR = propia({
  // 2 − (−6) + 3 = 8 + 3 = 11: hace la resta del negativo de una vez.
  id: 'restar-negativo-de-golpe', error: null,
  lineas: ([a, b, c]) => [`${fmt(a - b)} ${cs(c)}`, fmt(a - b + c)],
  porque: ([a, b]) => L(`Está bien: restar ${fmt(b)} es sumar ${-b}, así que ${a} − (${fmt(b)}) = ${fmt(a - b)}.`, `It is right: subtracting ${fmt(b)} is adding ${-b}, so ${a} − (${fmt(b)}) = ${fmt(a - b)}.`),
});
const DE_GOLPE_SUMAR = propia({
  // 6 + (−8) − 2 = −2 − 2 = −4: hace la suma del negativo de una vez.
  id: 'sumar-negativo-de-golpe', error: null,
  lineas: ([a, b, c]) => [`${fmt(a + b)} ${cs(c)}`, fmt(a + b + c)],
  porque: ([a, b]) => L(`Está bien: sumar ${fmt(b)} es restar ${-b}, así que ${a} + (${fmt(b)}) = ${fmt(a + b)}.`, `It is right: adding ${fmt(b)} is subtracting ${-b}, so ${a} + (${fmt(b)}) = ${fmt(a + b)}.`),
});
const AGRUPAR_TRES = propia({
  // −3 + 8 − 2 = 8 − 5 = 3: junta los negativos (vale cuando hay dos del mismo signo y uno del otro).
  id: 'agrupar-tres', error: null,
  // Si los dos del mismo signo van delante, sale igual que de izquierda a derecha y la columna se descarta.
  vale: t => t.some(x => x > 0) && t.some(x => x < 0),
  lineas: t => {
    const p = t.filter(x => x > 0).reduce((s, x) => s + x, 0), n = -t.filter(x => x < 0).reduce((s, x) => s + x, 0);
    return [`${p} − ${n}`, fmt(p - n)];
  },
  porque: t => {
    const pos = t.filter(x => x > 0), neg = t.filter(x => x < 0).map(x => -x);
    const p = pos.reduce((s, x) => s + x, 0), n = neg.reduce((s, x) => s + x, 0);
    // Con 3 términos, un signo tiene dos números y el otro uno: solo se juntan los dos.
    const [dos, es, en] = pos.length > 1 ? [pos, 'los positivos', 'the positive numbers'] : [neg, 'los negativos', 'the negative ones'];
    return L(`Está bien: se pueden juntar ${es} (${dos.join(' + ')} = ${dos[0] + dos[1]}): ${p} − ${n} = ${fmt(p - n)}.`,
      `It is right: you can put ${en} together (${dos.join(' + ')} = ${dos[0] + dos[1]}): ${p} − ${n} = ${fmt(p - n)}.`);
  },
});

/** Ruta que es una plantilla o una pareja válida de arriba, con sus números a partir de los de la familia. */
const ruta = (id, mapa = x => x) => ({ id, mapa });

export const FAMILIAS = [
  {
    // a + b + c con signos: de izquierda a derecha o juntando; mal, los cuatro errores de signos y el de
    // derecha a izquierda.
    id: 'suma-tres',
    numeros: rng => [signado(rng, 1, 9), signado(rng, 1, 9), signado(rng, 1, 9)],
    enunciado: t => terminos(t),
    bien: [ruta('izquierda-a-derecha'), AGRUPAR_TRES],
    mal: [ruta('regla-signos-en-suma'), ruta('suma-valores-absolutos'), ruta('olvida-el-signo'), ruta('signo-del-primero'),
      ruta('derecha-a-izquierda', ([a, b, c]) => (b < 0 && c > 0 ? [a, -b, c] : null))],
  },
  {
    // a − (b ± c): el ejemplo de Juan Luis, 5 − (3 − 7).
    id: 'parentesis',
    numeros(rng) { const a = rng.entero(1, 9), b = rng.entero(1, 9), c = signado(rng, 2, 9); return b + c === 0 ? null : [a, b, c]; },
    enunciado: ([a, b, c]) => `${a} − (${terminos([b, c])})`,
    bien: [PARENTESIS_QUITAR, PARENTESIS_OPERAR],
    mal: [PARENTESIS_MENOS, PARENTESIS_RESTAR],
  },
  {
    // a − (−b) ± c
    id: 'restar-negativo',
    numeros: rng => [rng.entero(2, 9), -rng.entero(2, 9), signado(rng, 1, 9)],
    enunciado: ([a, b, c]) => resto(c, `${a} − (${fmt(b)})`)[0],
    bien: [ruta('restar-negativo-bien'), DE_GOLPE_RESTAR],
    mal: [ruta('restar-negativo')],
  },
  {
    // a + (−b) ± c
    id: 'sumar-negativo',
    numeros: rng => [rng.entero(2, 9), -rng.entero(2, 9), signado(rng, 1, 9)],
    enunciado: ([a, b, c]) => resto(c, `${a} + (${fmt(b)})`)[0],
    bien: [SUMAR_NEGATIVO_BIEN, DE_GOLPE_SUMAR],
    mal: [ruta('sumar-negativo')],
  },
  {
    // a ± b · c: el producto primero; mal, sin jerarquía o (con la resta) poniendo el menos dos veces.
    id: 'jerarquia',
    numeros(rng) { const a = signado(rng, 1, 9), b = rng.entero(2, 6), c = rng.entero(2, 6), s = rng.elegir([1, -1]); return a + s * b === 0 ? null : [a, b, c, s]; },
    enunciado: ([a, b, c, s]) => `${fmt(a)} ${s < 0 ? '−' : '+'} ${b} · ${c}`,
    bien: [ruta('jerarquia-bien')],
    mal: [ruta('sin-jerarquia'), ruta('mismo-signo-dos-veces', ([a, b, c, s]) => (s < 0 ? [a, b, c] : null))],
  },
  {
    // a · (−b) ± c con signos distintos
    id: 'producto',
    numeros(rng) { const a = signado(rng, 2, 9), b = (a < 0 ? 1 : -1) * rng.entero(2, 9); return Math.abs(a) === Math.abs(b) ? null : [a, b, signado(rng, 1, 9)]; },
    enunciado: ([a, b, c]) => resto(c, `${fmt(a)} · ${fmtPar(b)}`)[0],
    bien: [ruta('producto-bien')],
    mal: [ruta('signo-del-mayor-producto')],
  },
  {
    // (−b)^n ± c con n par
    id: 'potencia-par',
    numeros: rng => (rng.azar() < 0.3 ? [-rng.elegir([2, 3]), 4, signado(rng, 1, 9)] : [-rng.entero(2, 9), 2, signado(rng, 1, 9)]),
    enunciado: ([b, n, c]) => resto(c, `(${fmt(b)})^${n}`)[0],
    bien: [ruta('potencia-bien')],
    mal: [ruta('potencia-par-negativa'), ruta('base-por-exponente', ([b, n, c]) => (Math.abs(b) >= 3 && Math.abs(b) <= 5 && n <= 3 ? [b, n, c] : null))],
  },
  {
    // −a^n ± c
    id: 'menos-en-la-base',
    numeros: rng => [rng.entero(2, 9), 2, signado(rng, 1, 9)],
    enunciado: ([a, n, c]) => resto(c, `−${a}^${n}`)[0],
    bien: [ruta('menos-en-la-base-bien')],
    mal: [ruta('menos-en-la-base')],
  },
];
export const FAMILIA_POR_ID = Object.fromEntries(FAMILIAS.map(fa => [fa.id, fa]));
/** Las familias con más rutas salen más (dan 3 y 4 columnas). */
const PESOS = { 'suma-tres': 3, parentesis: 3, jerarquia: 2, 'potencia-par': 2, producto: 1, 'restar-negativo': 1, 'sumar-negativo': 1, 'menos-en-la-base': 1 };
const SORTEO = FAMILIAS.flatMap(fa => Array(PESOS[fa.id]).fill(fa));

/**
 * La columna de una ruta con los números de la familia, o null si no vale: { ruta, params, lineas (con la 0),
 * falsa, error }. Comprueba que empieza por el enunciado.
 */
export function columnaDe(familia, r, params) {
  const enunciado = familia.enunciado(params);
  if (r.propia) {
    if (r.vale && !r.vale(params)) return null;
    const lineas = [enunciado, ...r.lineas(params)], falsa = r.error ? r.falsa : null;
    const falsas = lineas.map((l, i) => (i && evaluar(l) !== evaluar(lineas[i - 1]) ? i : -1)).filter(i => i >= 0);
    if (falsas.join() !== (falsa === null ? '' : String(falsa))) return null;
    return { ruta: r.id, params, lineas, falsa, error: r.error };
  }
  const p = r.mapa(params);
  if (!p) return null;
  const plantilla = PLANTILLA_POR_ID[r.id] ?? VALIDA_POR_ID[r.id];
  if (plantilla.valido && !plantilla.valido(p)) return null;
  let lineas;
  try { lineas = plantilla.lineas(p); } catch { return null; }
  if (lineas[0] !== enunciado || lineas.some(l => /null|undefined|NaN/.test(l))) return null;
  const falsa = plantilla.error ? 1 : null;
  // Con error, exactamente la línea 1 es falsa; sin error, ninguna (el error típico puede no aplicarse a esos números).
  const falsas = lineas.map((l, i) => (i && evaluar(l) !== evaluar(lineas[i - 1]) ? i : -1)).filter(i => i >= 0);
  if (falsas.join() !== (falsa === null ? '' : String(falsa))) return null;
  return { ruta: r.id, params: p, lineas, falsa, error: plantilla.error ?? null };
}

/** Las columnas posibles de una familia con unos números: { bien: [...], mal: [...] } (sin dos iguales). */
export function columnasPosibles(familia, params) {
  const vistas = new Set();
  const sinRepetir = c => { if (!c) return false; const k = c.lineas.join('|'); if (vistas.has(k)) return false; vistas.add(k); return true; };
  const bien = familia.bien.map(r => columnaDe(familia, r, params)).filter(sinRepetir);
  const errores = new Set();
  const mal = familia.mal.map(r => columnaDe(familia, r, params)).filter(c => sinRepetir(c) && !errores.has(c.error) && errores.add(c.error));
  return { bien, mal };
}

const PROPIAS = [PARENTESIS_RESTAR, PARENTESIS_OPERAR, PARENTESIS_QUITAR, PARENTESIS_MENOS, SUMAR_NEGATIVO_BIEN, DE_GOLPE_RESTAR, DE_GOLPE_SUMAR, AGRUPAR_TRES];
const PROPIA_POR_ID = Object.fromEntries(PROPIAS.map(r => [r.id, r]));

/**
 * El fallo de cuenta (JL, 23-11): un error que no está en el catálogo, así que no tiene nombre y su columna no lleva
 * pregunta tipo test. Es una ruta buena que no sale en el ítem con la última cuenta mal hecha: un número cercano
 * (±1, ±2, ±10), nunca el de otra columna ni el de un error típico de la familia (no se confunde con ninguno).
 */
export const CUENTA = 'fallo-de-cuenta';
const CERCANOS = [1, -1, 2, -2, 10, -10];

/**
 * Lo que daría la última cuenta («5 − 7») con cada error de signos del catálogo, y con el signo cambiado: un fallo de
 * cuenta nunca puede dar eso, o sería un error con nombre (5 − 7 = −12 es «ha sumado aunque los signos son
 * distintos», no un despiste).
 */
function conNombre(antes, bien) {
  const valores = new Set([-bien]);
  const m = /^(−?\d+) ([+−]) (\d+)$/.exec(antes);
  if (m) {
    const a = Number(m[1].replace('−', '-')), b = (m[2] === '−' ? -1 : 1) * Number(m[3]);
    for (const id of GRUPOS.signos) {
      try { const v = f[id].fn(a, b); if (typeof v === 'number') valores.add(v); } catch { /* no se aplica */ }
    }
  }
  return valores;
}

function columnaDeCuenta(rng, origen, prohibidos) {
  const ultima = origen.lineas.length - 1, bien = evaluar(origen.lineas[ultima]);
  const conNombres = conNombre(origen.lineas[ultima - 1], bien);
  const posibles = CERCANOS.map(d => bien + d).filter(x => Math.abs(x) <= 300 && !prohibidos.has(x) && !conNombres.has(x));
  if (!posibles.length) return null;
  const mal = rng.elegir(posibles);
  return { ...origen, lineas: [...origen.lineas.slice(0, -1), fmt(mal)], falsa: ultima, error: CUENTA, cuenta: { bien, mal } };
}

/** Lo que explica una columna con sus números: { porque: { es, en }, corregida: expresión | null }. */
export function explicaColumna(c) {
  if (c.error === CUENTA) {
    const antes = c.lineas[c.falsa - 1];
    return {
      porque: L(`${antes} = ${fmt(c.cuenta.bien)}, no ${fmt(c.cuenta.mal)}.`, `${antes} = ${fmt(c.cuenta.bien)}, not ${fmt(c.cuenta.mal)}.`),
      corregida: fmt(c.cuenta.bien),
    };
  }
  const r = PROPIA_POR_ID[c.ruta] ?? PLANTILLA_POR_ID[c.ruta] ?? VALIDA_POR_ID[c.ruta];
  return { porque: r.porque(c.params), corregida: c.error ? r.corregida(c.params) : null };
}

/** Las LETRAS de las columnas. */
export const LETRAS = ['A', 'B', 'C', 'D'];

/**
 * Ejercicio 1: el mismo cálculo en 2-4 columnas, 1-2 bien y 1-2 mal (como mucho una, con un fallo de cuenta). La
 * respuesta (`solucion`) es, por columna, el índice de la línea mala o null; después, una pregunta por cada columna
 * mala con nombre, con el nombre bueno y dos de otro grupo (como en el ejercicio 2).
 */
export function generarDonde(rng) {
  for (let intento = 0; intento < 500; intento++) {
    const familia = rng.elegir(SORTEO);
    const params = familia.numeros(rng);
    if (!params) continue;
    const { bien, mal } = columnasPosibles(familia, params);
    if (!bien.length || !mal.length) continue;
    const dos = () => (rng.azar() < 0.6 ? 2 : 1);
    const nBien = Math.min(bien.length, dos()), nMal = Math.min(mal.length, dos());
    const buenas = rng.barajar(bien), malas = rng.barajar(mal).slice(0, nMal);
    const elegidas = [...buenas.slice(0, nBien), ...malas];
    // Con una sola columna mala con nombre, a veces otra con un fallo de cuenta, sacada de una ruta buena que no sale.
    if (nMal === 1 && buenas.length > nBien && rng.azar() < 0.8) {
      const prohibidos = new Set([...bien, ...mal].map(c => evaluar(c.lineas.at(-1))));
      const cuenta = columnaDeCuenta(rng, buenas[nBien], prohibidos);
      if (cuenta) elegidas.push(cuenta);
    }
    const columnas = rng.barajar(elegidas);
    // Pregunta tipo test solo para los errores con nombre: el fallo de cuenta no se puede nombrar (JL, 23-11).
    const preguntas = columnas.map((c, col) => ({ c, col })).filter(({ c }) => c.error && c.error !== CUENTA).map(({ c, col }) => {
      const grupo = GRUPO_DE[c.error];
      const otros = rng.barajar(PLANTILLAS.map(p => p.error).filter(id => GRUPO_DE[id] !== grupo)).slice(0, 2);
      return { col, opciones: rng.barajar([c.error, ...otros]), solucion: c.error };
    });
    return {
      tipo: 'donde', plantilla: familia.id, params, enunciado: familia.enunciado(params), columnas, preguntas,
      solucion: columnas.map(c => c.falsa),
    };
  }
  throw new Error('generarDonde: no salen columnas');
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
