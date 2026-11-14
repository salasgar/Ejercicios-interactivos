// Álgebra inicial (unidad 6, tarea 161 del reparto PU2): valor numérico, reducir términos
// semejantes, quitar paréntesis y traducir frases a expresiones. Cada subtipo declara las
// destrezas del inventario de la unidad 6 que cubre (`items`), como `enteros.js` y los
// generadores de fracciones y decimales.
//
// Aritmética EXACTA: los coeficientes son racionales {n, d} de enteros pequeños (nada de coma
// flotante ni de `redondear`). Los exporta para `ecuaciones_primer_grado.js`, que los comparte.
//
// Escritura (acta de la unidad 6, punto p): coeficiente delante y pegado (`3x`, `-2x`, `x` por
// `1x`), el producto con `\cdot` solo entre números, la división con letras como fracción
// (`\frac{x}{2}`), `3(x - 2)` sin punto.

import { construirOpciones, conReintentos, erroresDe, tex, texFraccion } from './index.js';

// ---------------------------------------------------------------------------
// Racionales exactos.

const mcdE = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mcdE(n, d) || 1; return { n: n / g, d: d / g }; };
const q = v => (typeof v === 'number' ? Q(v) : v);
export const qNeg = p => Q(-p.n, p.d);
export const qSuma = (p, r) => Q(p.n * r.d + r.n * p.d, p.d * r.d);
export const qResta = (p, r) => qSuma(p, qNeg(r));
export const qPor = (p, r) => Q(p.n * r.n, p.d * r.d);
export const qEntre = (p, r) => Q(p.n * r.d, p.d * r.n);
export const qEsCero = p => p.n === 0;
export const qEsEntero = p => p.d === 1;
export const qClave = p => `${p.n}/${p.d}`;
export const qTex = p => texFraccion(p.n, p.d);

// ---------------------------------------------------------------------------
// Términos: { c, x } (c·x si x, el número c si no) y { k, dentro } (k(…), k entero).

export const tX = c => ({ c: q(c), x: true });
export const tN = c => ({ c: q(c), x: false });
export const tP = (k, dentro) => ({ k: q(k), dentro });

function cuerpo(t) {
  const n = Math.abs(t.c.n), d = t.c.d;
  if (t.x) {
    if (d === 1) return n === 1 ? 'x' : `${n}x`;
    return n === 1 ? `\\frac{x}{${d}}` : `\\frac{${n}x}{${d}}`;
  }
  return d === 1 ? String(n) : `\\frac{${n}}{${d}}`;
}

/** La suma de términos tal como se escribe: `5 - 2x`, `-(x - 2)`, `\frac{x}{2} - 3`. */
export function texTerminos(ts) {
  return ts.map((t, i) => {
    let neg, body;
    if (t.dentro) {
      neg = t.k.n < 0;
      const kk = Math.abs(t.k.n);
      body = `${kk === 1 ? '' : kk}(${texTerminos(t.dentro)})`;
    } else { neg = t.c.n < 0; body = cuerpo(t); }
    if (i === 0) return (neg ? '-' : '') + body;
    return `${neg ? ' - ' : ' + '}${body}`;
  }).join('') || '0';
}

/** { a, b }: la expresión a·x + b, reducida y exacta. */
export function lineal(ts) {
  let a = Q(0), b = Q(0);
  for (const t of ts) {
    if (t.dentro) { const r = lineal(t.dentro); a = qSuma(a, qPor(t.k, r.a)); b = qSuma(b, qPor(t.k, r.b)); }
    else if (t.x) a = qSuma(a, t.c);
    else b = qSuma(b, t.c);
  }
  return { a, b };
}
export const claveLineal = ({ a, b }) => `${qClave(a)}|${qClave(b)}`;
/** La expresión reducida como términos: la x primero, y el número después (si no es 0). */
export const terminosDe = ({ a, b }) => {
  const ts = [];
  if (!qEsCero(a)) ts.push(tX(a));
  if (!qEsCero(b) || ts.length === 0) ts.push(tN(b));
  return ts;
};
export const texLineal = r => texTerminos(terminosDe(r));
/** Los términos con los paréntesis quitados (cada uno por su k), en el orden en que están. */
export const expandirTerminos = ts => ts.flatMap(t => (t.dentro
  ? t.dentro.map(u => ({ ...u, c: qPor(t.k, u.c) }))
  : [t]));

// ---------------------------------------------------------------------------

export const errores = {
  // Valor numérico (U6-1C-05, 1C-06, 1C-09)
  yuxtapone: { concepto: 'expresiones_algebraicas',
    es: 'Al sustituir, «3x» significa 3 · x: hay que multiplicar, no escribir el número pegado.', en: 'When you substitute, "3x" means 3 · x: you must multiply, not write the number next to it.' },
  jerarquia_al_sustituir: { concepto: 'expresiones_algebraicas',
    es: 'Hay que respetar la jerarquía: primero se multiplica y después se suma o se resta.', en: 'You must follow the order of operations: multiply first, then add or subtract.' },
  suma_en_vez_de_multiplicar: { concepto: 'expresiones_algebraicas',
    es: 'El coeficiente multiplica a la x, no se suma con ella.', en: 'The coefficient multiplies x, it is not added to it.' },
  ignora_coeficiente: { concepto: 'expresiones_algebraicas',
    es: 'Te has olvidado del coeficiente: hay que multiplicarlo por el valor de x.', en: 'You forgot the coefficient: you have to multiply it by the value of x.' },
  signo_al_sustituir: { concepto: 'expresiones_algebraicas',
    es: 'Un número negativo se pone entre paréntesis al sustituir, y el producto de signos distintos es negativo.', en: 'A negative number goes in brackets when you substitute, and a product of different signs is negative.' },
  eleva_antes_de_operar: { concepto: 'expresiones_algebraicas',
    es: 'El exponente solo afecta a la x: primero se eleva al cuadrado y después se multiplica, se suma o se resta.', en: 'The exponent only applies to x: first you square it, and then you multiply, add or subtract.' },
  cuadrado_como_doble: { concepto: 'expresiones_algebraicas',
    es: 'x² no es 2x: x² = x · x.', en: 'x² is not 2x: x² = x · x.' },
  exponente_ignorado: { concepto: 'expresiones_algebraicas',
    es: 'Te falta elevar al cuadrado: x² = x · x.', en: 'You forgot to square: x² = x · x.' },
  cuadrado_negativo: { concepto: 'expresiones_algebraicas',
    es: 'Un número negativo al cuadrado es positivo: (-4)² = (-4) · (-4) = 16.', en: 'A negative number squared is positive: (-4)² = (-4) · (-4) = 16.' },
  // Reducir (U6-1C-13, 1C-14)
  suma_no_semejantes: { concepto: 'expresiones_algebraicas',
    es: 'Un término con x y un término sin x no son semejantes: no se pueden sumar entre sí.', en: 'A term with x and a term without x are not like terms: they cannot be added together.' },
  quita_x_con_x: { concepto: 'expresiones_algebraicas',
    es: 'Al sumar o restar términos con x, la x se queda: 7x - x = 6x, no 7.', en: 'When you add or subtract terms with x, the x stays: 7x - x = 6x, not 7.' },
  termino_desaparece: { concepto: 'expresiones_algebraicas',
    es: 'Ningún término desaparece: hay que sumar o restar los coeficientes de todos los términos con x.', en: 'No term disappears: you have to add or subtract the coefficients of all the terms with x.' },
  olvida_el_uno: { concepto: 'expresiones_algebraicas',
    es: 'La x sola vale 1x: hay que contar también su coeficiente, 1.', en: 'A lone x is 1x: you have to count its coefficient, 1, too.' },
  signo_termino_semejante: { concepto: 'expresiones_algebraicas',
    es: 'Al agrupar los términos con x hay que respetar el signo que llevaba cada uno.', en: 'When grouping the x terms you must keep the sign each one had.' },
  signo_constante: { concepto: 'expresiones_algebraicas',
    es: 'Al agrupar los términos independientes hay que respetar el signo que llevaba cada uno.', en: 'When grouping the constant terms you must keep the sign each one had.' },
  olvida_constante: { concepto: 'expresiones_algebraicas',
    es: 'Los términos sin x también se suman entre sí: no se pueden dejar fuera.', en: 'The terms without x also have to be added together: you cannot leave them out.' },
  // Quitar paréntesis (U6-3C-06, 3C-07)
  distribuye_solo_el_primero: { concepto: 'expresiones_algebraicas',
    es: 'El número de fuera del paréntesis multiplica a todos los términos de dentro, no solo al primero.', en: 'The number outside the brackets multiplies every term inside, not just the first one.' },
  signo_solo_el_primero: { concepto: 'expresiones_algebraicas',
    es: 'Un signo menos delante del paréntesis cambia el signo de todos los términos de dentro, no solo del primero.', en: 'A minus sign in front of the brackets changes the sign of every term inside, not just the first one.' },
  multiplica_solo_el_ultimo: { concepto: 'expresiones_algebraicas',
    es: 'El número de fuera multiplica a todos los términos de dentro, también al primero.', en: 'The number outside multiplies every term inside, the first one too.' },
  quita_sin_cambiar_signos: { concepto: 'expresiones_algebraicas',
    es: 'Con un signo menos delante, al quitar el paréntesis hay que cambiar el signo de todo lo de dentro.', en: 'With a minus sign in front, when you remove the brackets you must change the sign of everything inside.' },
  // Traducir (U6-1A-01, 1A-02)
  doble_como_mas: { concepto: 'expresiones_algebraicas',
    es: 'El doble (o el triple) de un número se multiplica, no se suma: 2x, no x + 2.', en: 'Twice (or three times) a number is multiplied, not added: 2x, not x + 2.' },
  doble_como_cuadrado: { concepto: 'expresiones_algebraicas',
    es: 'El doble de x es 2x = x + x; x² es x · x.', en: 'Twice x is 2x = x + x; x² is x · x.' },
  doble_como_mitad: { concepto: 'expresiones_algebraicas',
    es: 'El doble se multiplica por 2; la mitad es la que se divide entre 2.', en: 'Twice means multiplying by 2; half is the one you divide by 2.' },
  mitad_como_doble: { concepto: 'expresiones_algebraicas',
    es: 'La mitad se divide entre 2: x/2, no 2x.', en: 'Half means dividing by 2: x/2, not 2x.' },
  mitad_como_resta: { concepto: 'expresiones_algebraicas',
    es: 'La mitad no se resta: se divide entre 2.', en: 'Half is not subtracted: it is divided by 2.' },
  mitad_como_suma: { concepto: 'expresiones_algebraicas',
    es: 'La mitad no se suma: se divide entre 2.', en: 'Half is not added: it is divided by 2.' },
  mas_como_por: { concepto: 'expresiones_algebraicas',
    es: '«n más que» o «n menos que» suma o resta n; no multiplica.', en: '"n more than" or "n less than" adds or subtracts n; it does not multiply.' },
  menos_que_al_reves: { concepto: 'expresiones_algebraicas',
    es: '«Tres menos que un número» es x - 3: al número se le quitan tres.', en: '"Three less than a number" is x - 3: you take three away from the number.' },
  signo_operacion: { concepto: 'expresiones_algebraicas',
    es: 'Fíjate si el enunciado dice «más» o «menos».', en: 'Check whether the statement says "plus" or "minus".' },
  resta_al_reves: { concepto: 'expresiones_algebraicas',
    es: 'Cuidado con el orden: a la x se le suma el número, no al revés.', en: 'Mind the order: the number is added to x, not the other way round.' },
  intercambia_numeros: { concepto: 'expresiones_algebraicas',
    es: 'El número que multiplica va con la x y el otro es el que se suma o se resta; los has intercambiado.', en: 'The number that multiplies goes with x and the other one is added or subtracted; you swapped them.' },
  mete_b_en_parentesis: { concepto: 'expresiones_algebraicas',
    es: 'Solo el número se duplica o triplica; el «más» o «menos» que sigue no entra en esa multiplicación.', en: 'Only the number gets doubled or tripled; the "plus" or "minus" that follows is not part of that multiplication.' },
  escala_al_numero_fijo: { concepto: 'expresiones_algebraicas',
    es: 'El doble, el triple o la mitad es del número desconocido (la x), no del número que se suma o resta.', en: 'The double, the triple or the half applies to the unknown number (x), not to the number being added or subtracted.' },
};
const E = erroresDe(errores);

export const preguntas = {
  valor_numerico: { es: 'Calcula el valor de la expresión para x = {x}:', en: 'Work out the value of the expression for x = {x}:' },
  reducir: { es: 'Reduce, agrupando los términos semejantes:', en: 'Simplify by grouping the like terms:' },
  quita_parentesis: { es: 'Quita el paréntesis y reduce:', en: 'Remove the brackets and simplify:' },
  doble: { es: 'El doble de un número:', en: 'Twice a number:' },
  mitad: { es: 'La mitad de un número:', en: 'Half of a number:' },
  mas_que: { es: '{n} más que un número:', en: '{n} more than a number:' },
  menos_que: { es: '{n} menos que un número:', en: '{n} less than a number:' },
  doble_mas: { es: 'El doble de un número, más {b}:', en: 'Double a number, plus {b}:' },
  doble_menos: { es: 'El doble de un número, menos {b}:', en: 'Double a number, minus {b}:' },
  triple_mas: { es: 'El triple de un número, más {b}:', en: 'Triple a number, plus {b}:' },
  triple_menos: { es: 'El triple de un número, menos {b}:', en: 'Triple a number, minus {b}:' },
  mitad_mas: { es: 'La mitad de un número, más {b}:', en: 'Half of a number, plus {b}:' },
  mitad_menos: { es: 'La mitad de un número, menos {b}:', en: 'Half of a number, minus {b}:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  sustituir_x: { es: 'Sustituimos x por su valor (un número negativo, entre paréntesis).', en: 'We substitute x for its value (a negative number goes in brackets).' },
  multiplicar: { es: 'Multiplicamos.', en: 'We multiply.' },
  elevar: { es: 'Primero elevamos al cuadrado.', en: 'First we square.' },
  sumar: { es: 'Por último, sumamos o restamos.', en: 'Finally, we add or subtract.' },
  agrupar_terminos: { es: 'Reordenamos agrupando los términos con x y los términos independientes.', en: 'We reorder, grouping the x terms and the constant terms.' },
  combinar: { es: 'Sumamos los términos con x entre sí, y los independientes entre sí.', en: 'We add the x terms together, and the constant terms together.' },
  quitar_parentesis: { es: 'Multiplicamos el número de fuera por cada término de dentro del paréntesis.', en: 'We multiply the number outside by every term inside the brackets.' },
  quitar_parentesis_menos: { es: 'Con un signo menos delante, cambiamos el signo de todos los términos de dentro.', en: 'With a minus sign in front, we change the sign of every term inside.' },
  traducir_expresion: { es: 'Escribimos lo que dice la frase, en el orden en que se dice.', en: 'We write what the sentence says, in the order it says it.' },
};

const T = tex;
const paso = (t, nota = null, calculo = null) => ({ tex: t, nota, calculo });
const mal = (t, calculo = null) => ({ tex: t, mal: true, calculo });
const abs = Math.abs;
const sg = n => (n < 0 ? '-' : '+');
const barajarPool = (rng, documentados, extras = []) => rng.barajar(documentados).concat(rng.barajar(extras));
/** Una opción numérica: el valor exacto. */
const num = (n, error, pasos) => ({ tex: qTex(q(n)), clave: qClave(q(n)), error, ...(pasos ? { pasos } : {}) });
/** Una opción expresión: la forma reducida (la clave es la forma canónica). */
const ex = (r, error, pasos) => ({ tex: texLineal(r), clave: claveLineal(r), error, ...(pasos ? { pasos } : {}) });
const unir = partes => partes.map((p, i) => (i === 0 ? (p.neg ? '-' : '') + p.t : ` ${p.neg ? '-' : '+'} ${p.t}`)).join('');
const R = (a, b) => ({ a: q(a), b: q(b) });

// ---------------------------------------------------------------------------
// Valor numérico.

/** ax + b, b + ax, ax - b, b - ax con x natural (U6-1C-05) o negativo (U6-1C-06). */
function valorLineal(negativo) {
  return rng => {
    const a = rng.entero(2, 9), b = rng.entero(1, 9);
    const xv = (negativo ? -1 : 1) * rng.entero(1, 9);
    const forma = rng.elegir(['ax+b', 'ax-b', 'b+ax', 'b-ax']);
    const c = forma === 'b-ax' ? -a : a;
    const k = forma === 'ax-b' ? -b : b;
    const xPrimero = forma === 'ax+b' || forma === 'ax-b';
    const orden = (tx, tn) => (xPrimero ? [tx, tn] : [tn, tx]);
    const enunciado = texTerminos(orden(tX(c), tN(k)));
    const xt = negativo ? `(${xv})` : String(xv);
    const sustituido = unir(orden({ neg: c < 0, t: `${abs(c)} \\cdot ${xt}` }, { neg: k < 0, t: String(abs(k)) }));
    const producto = texTerminos(orden(tN(c * xv), tN(k)));
    const valor = c * xv + k;
    const d = (v, id, linea) => num(v, E(id), [mal(`${enunciado} = ${linea} = ${T(v)}`)]);

    const yuxt = Number(`${a}${xv}`);
    const vYuxt = (c < 0 ? -yuxt : yuxt) + k;
    const vJer = xPrimero ? c * (xv + k) : (k + c) * xv;
    const lJer = xPrimero ? `${c} \\cdot (${T(xv)} ${sg(k)} ${abs(k)})` : `(${k} ${sg(c)} ${abs(c)}) \\cdot ${xt}`;
    const vSuma = c + xv + k;
    const lSuma = texTerminos(xPrimero ? [tN(c), tN(xv), tN(k)] : [tN(k), tN(c), tN(xv)]);
    const vIgn = Math.sign(c) * xv + k;
    const lIgn = texTerminos(orden(tN(Math.sign(c) * xv), tN(k)));
    const vSigno = c * -xv + k;
    const lSigno = unir(orden({ neg: c < 0, t: `${abs(c)} \\cdot ${abs(xv)}` }, { neg: k < 0, t: String(abs(k)) }));

    const documentados = negativo
      ? [d(vSigno, 'signo_al_sustituir', lSigno), d(vSuma, 'suma_en_vez_de_multiplicar', lSuma), d(vJer, 'jerarquia_al_sustituir', lJer)]
      : [d(vYuxt, 'yuxtapone', texTerminos(orden(tN(c < 0 ? -yuxt : yuxt), tN(k)))), d(vJer, 'jerarquia_al_sustituir', lJer)];
    const extras = negativo
      ? [d(vIgn, 'ignora_coeficiente', lIgn)]
      : [d(vSuma, 'suma_en_vez_de_multiplicar', lSuma), d(vIgn, 'ignora_coeficiente', lIgn)];
    return {
      texto: { clave: 'valor_numerico', params: { x: xv } },
      enunciado,
      correcta: num(valor),
      solucion: [
        paso(`${enunciado} = ${sustituido}`, 'sustituir_x'),
        paso(`${sustituido} = ${producto}`, 'multiplicar'),
        paso(`${producto} = ${T(valor)}`, 'sumar'),
      ],
      distractores: barajarPool(rng, documentados, extras),
    };
  };
}

/** ax², x² ± b con x natural y x² con x negativo (U6-1C-09; x² solo aquí, nunca al reducir). */
function valorCuadrado(rng) {
  const forma = rng.elegir(['ax2', 'x2+b', 'x2-b', 'x2neg']);
  const d = (enunciado, v, id, linea) => num(v, E(id), [mal(`${enunciado} = ${linea} = ${T(v)}`)]);
  if (forma === 'ax2') {
    const a = rng.entero(2, 5), xv = rng.entero(2, 6);
    const enunciado = `${a}x^{2}`, valor = a * xv * xv;
    return {
      texto: { clave: 'valor_numerico', params: { x: xv } },
      enunciado,
      correcta: num(valor),
      solucion: [
        paso(`${enunciado} = ${a} \\cdot ${xv}^{2}`, 'sustituir_x'),
        paso(`${a} \\cdot ${xv}^{2} = ${a} \\cdot ${xv * xv}`, 'elevar'),
        paso(`${a} \\cdot ${xv * xv} = ${valor}`, 'multiplicar'),
      ],
      distractores: barajarPool(rng, [
        d(enunciado, (a * xv) ** 2, 'eleva_antes_de_operar', `(${a} \\cdot ${xv})^{2} = ${a * xv}^{2}`),
        d(enunciado, a * xv * 2, 'cuadrado_como_doble', `${a} \\cdot ${xv} \\cdot 2`),
      ], [d(enunciado, a * xv, 'exponente_ignorado', `${a} \\cdot ${xv}`)]),
    };
  }
  if (forma === 'x2neg') {
    const xv = -rng.entero(2, 9);
    const enunciado = 'x^{2}', valor = xv * xv;
    return {
      texto: { clave: 'valor_numerico', params: { x: xv } },
      enunciado,
      correcta: num(valor),
      solucion: [
        paso(`${enunciado} = (${xv})^{2}`, 'sustituir_x'),
        paso(`(${xv})^{2} = (${xv}) \\cdot (${xv})`, 'multiplicar'),
        paso(`(${xv}) \\cdot (${xv}) = ${valor}`, 'multiplicar'),
      ],
      distractores: barajarPool(rng, [
        d(enunciado, -valor, 'cuadrado_negativo', `-${abs(xv)}^{2}`),
        d(enunciado, 2 * xv, 'cuadrado_como_doble', `2 \\cdot (${xv})`),
      ], [d(enunciado, xv, 'exponente_ignorado', `(${xv})`)]),
    };
  }
  const b = rng.entero(1, 9), xv = rng.entero(2, 6);
  const s = forma === 'x2+b' ? 1 : -1;
  const enunciado = `x^{2} ${sg(s)} ${b}`, valor = xv * xv + s * b;
  return {
    texto: { clave: 'valor_numerico', params: { x: xv } },
    enunciado,
    correcta: num(valor),
    solucion: [
      paso(`${enunciado} = ${xv}^{2} ${sg(s)} ${b}`, 'sustituir_x'),
      paso(`${xv}^{2} ${sg(s)} ${b} = ${xv * xv} ${sg(s)} ${b}`, 'elevar'),
      paso(`${xv * xv} ${sg(s)} ${b} = ${valor}`, 'sumar'),
    ],
    distractores: barajarPool(rng, [
      d(enunciado, 2 * xv + s * b, 'cuadrado_como_doble', `2 \\cdot ${xv} ${sg(s)} ${b}`),
      d(enunciado, (xv + s * b) ** 2, 'eleva_antes_de_operar', `(${xv} ${sg(s)} ${b})^{2} = ${xv + s * b}^{2}`),
    ], [d(enunciado, xv + s * b, 'exponente_ignorado', `${xv} ${sg(s)} ${b}`)]),
  };
}

// ---------------------------------------------------------------------------
// Reducir términos semejantes.

/** ax ± cx ± … (dos o tres términos con x): U6-1C-13. */
function reducirX(rng) {
  const n = rng.elegir([2, 2, 3]);
  let coefs, total;
  do {
    coefs = Array.from({ length: n }, (_, i) => (i === 0 || rng.moneda() ? 1 : -1) * rng.entero(1, 9));
    total = coefs.reduce((s, v) => s + v, 0);
  } while (total === 0);
  const terminos = coefs.map(c => tX(c));
  const enunciado = texTerminos(terminos);
  const correcta = ex(R(total, 0));
  const cand = (r, id, linea) => ex(r, E(id), [mal(`${enunciado} = ${linea}`)]);
  const sinUltimo = coefs.slice(0, -1).reduce((s, v) => s + v, 0);
  const sinUnos = coefs.filter(c => abs(c) !== 1).reduce((s, v) => s + v, 0);
  const conUno = coefs.some(c => abs(c) === 1);
  const doc = [cand(R(0, total), 'quita_x_con_x', T(total))];
  if (sinUltimo !== 0) doc.push(cand(R(sinUltimo, 0), 'termino_desaparece', texLineal(R(sinUltimo, 0))));
  if (conUno && sinUnos !== 0 && sinUnos !== total) doc.push(cand(R(sinUnos, 0), 'olvida_el_uno', texLineal(R(sinUnos, 0))));
  const extras = [cand(R(coefs[0] - coefs.slice(1).reduce((s, v) => s + v, 0), 0), 'signo_termino_semejante',
    texLineal(R(coefs[0] - coefs.slice(1).reduce((s, v) => s + v, 0), 0)))];
  return {
    texto: { clave: 'reducir' },
    enunciado,
    correcta,
    solucion: [paso(`${enunciado} = ${texLineal(R(total, 0))}`, 'combinar', `${coefs.map((c, i) => (i === 0 ? T(c) : `${sg(c)} ${abs(c)}`)).join(' ')} = ${T(total)}`)],
    distractores: barajarPool(rng, doc, extras),
  };
}

/** Dos términos con x y dos sin x, mezclados (U6-1C-14). */
function reducirMezcla(rng) {
  let a, c, b, d, cS, bS, dS;
  do {
    a = rng.entero(1, 9); c = rng.entero(1, 9);
    b = rng.entero(1, 9); d = rng.entero(1, 9);
    cS = (rng.moneda() ? 1 : -1) * c; bS = (rng.moneda() ? 1 : -1) * b; dS = (rng.moneda() ? 1 : -1) * d;
  } while (a + cS === 0 && bS + dS === 0);
  const terminos = [tX(a), tN(bS), tX(cS), tN(dS)];
  const enunciado = texTerminos(terminos);
  const coef = a + cS, cons = bS + dS;
  const todo = a + cS + bS + dS;
  const cand = (r, id) => ex(r, E(id), [mal(`${enunciado} = ${texLineal(r)}`)]);
  return {
    texto: { clave: 'reducir' },
    enunciado,
    correcta: ex(R(coef, cons)),
    solucion: [
      paso(`${enunciado} = ${texTerminos([tX(a), tX(cS), tN(bS), tN(dS)])}`, 'agrupar_terminos'),
      paso(`${texTerminos([tX(a), tX(cS), tN(bS), tN(dS)])} = ${texLineal(R(coef, cons))}`, 'combinar'),
    ],
    distractores: barajarPool(rng, [
      cand(R(todo, 0), 'suma_no_semejantes'),
      cand(R(coef, bS - dS), 'signo_constante'),
      cand(R(a - cS, cons), 'signo_termino_semejante'),
      cand(R(coef, 0), 'olvida_constante'),
    ]),
  };
}

// ---------------------------------------------------------------------------
// Quitar paréntesis.

const reordenar = (ts, k) => ts.map(t => ({ ...t, c: qPor(t.c, q(k)) }));

/** k(ax ± b) con k natural o negativo (U6-3C-06). */
function parentesisNumero(rng) {
  const k = rng.elegir([2, 3, 4, 5, 6, 7, -2, -3, -4, -5]);
  const a = rng.elegir([1, 1, 2, 3, 4]), b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
  const dentro = rng.moneda() ? [tX(a), tN(b)] : [tN(b), tX((rng.moneda() ? 1 : -1) * a)];
  const enunciado = texTerminos([tP(k, dentro)]);
  const total = lineal([tP(k, dentro)]);
  const expandido = reordenar(dentro, k);
  const lineaExp = texTerminos(expandido);
  const canon = texLineal(total);
  const cierre = lineaExp === canon ? [] : [paso(`${lineaExp} = ${canon}`, 'combinar')];
  const cand = (ts, id) => {
    const r = lineal(ts);
    const l = texTerminos(ts);
    return ex(r, E(id), [mal(`${enunciado} = ${l}${l === texLineal(r) ? '' : ` = ${texLineal(r)}`}`)]);
  };
  const solo1 = [reordenar([dentro[0]], k)[0], ...dentro.slice(1)];
  const solo2 = [dentro[0], reordenar([dentro[1]], k)[0]];
  const doc = [cand(solo1, 'distribuye_solo_el_primero')];
  if (k < 0) doc.push(cand([reordenar([dentro[0]], k)[0], ...reordenar(dentro.slice(1), -k)], 'signo_solo_el_primero'));
  return {
    texto: { clave: 'quita_parentesis' },
    enunciado,
    correcta: ex(total),
    solucion: [paso(`${enunciado} = ${lineaExp}`, 'quitar_parentesis'), ...cierre.length ? cierre : []],
    distractores: barajarPool(rng, doc, [cand(solo2, 'multiplica_solo_el_ultimo')]),
  };
}

/** c - (px ± q) y -(px ± q): el signo menos delante del paréntesis (U6-3C-07). */
function parentesisMenos(rng) {
  const conC = rng.moneda(0.7);
  const a = rng.elegir([1, 1, 2, 3]), b = rng.entero(1, 9), c = rng.entero(1, 9);
  const sa = rng.moneda() ? 1 : -1, sb = rng.moneda() ? 1 : -1;
  const dentro = rng.moneda() ? [tX(sa * a), tN(sb * b)] : [tN(sb * b), tX(sa * a)];
  const delante = conC ? [tN(c), tP(-1, dentro)] : [tP(-1, dentro)];
  const enunciado = texTerminos(delante);
  const total = lineal(delante);
  const quitado = [...conC ? [tN(c)] : [], ...reordenar(dentro, -1)];
  const lineaQ = texTerminos(quitado);
  const canon = texLineal(total);
  const cand = (ts, id) => {
    const r = lineal(ts), l = texTerminos(ts);
    return ex(r, E(id), [mal(`${enunciado} = ${l}${l === texLineal(r) ? '' : ` = ${texLineal(r)}`}`)]);
  };
  const solo1 = [...conC ? [tN(c)] : [], ...reordenar([dentro[0]], -1), ...dentro.slice(1)];
  const sinCambiar = [...conC ? [tN(c)] : [], ...dentro];
  const solo2 = [...conC ? [tN(c)] : [], dentro[0], ...reordenar([dentro[1]], -1)];
  return {
    texto: { clave: 'quita_parentesis' },
    enunciado,
    correcta: ex(total),
    solucion: [
      paso(`${enunciado} = ${lineaQ}`, 'quitar_parentesis_menos'),
      ...(lineaQ === canon ? [] : [paso(`${lineaQ} = ${canon}`, 'combinar')]),
    ],
    distractores: barajarPool(rng, [cand(solo1, 'signo_solo_el_primero'), cand(sinCambiar, 'quita_sin_cambiar_signos')], [cand(solo2, 'multiplica_solo_el_ultimo')]),
  };
}

// ---------------------------------------------------------------------------
// Traducir frases (hilo A).

/** Una operación: el doble, la mitad, n más que, n menos que (U6-1A-01). */
function traducirUna(rng) {
  const tipo = rng.elegir(['doble', 'mitad', 'mas_que', 'menos_que']);
  const n = rng.entero(2, 9);
  const cand = (r, id, deriva = null) => ex(r, E(id), [mal(`${deriva ?? texLineal(r)} = ${texLineal(r)}`)]);
  let correcta, doc, extras = [], texto;
  const derivaUna = { doble: 'x + x', mitad: 'x \\div 2', mas_que: `x + ${n}`, menos_que: `x - ${n}` }[tipo];
  if (tipo === 'doble') {
    texto = { clave: 'doble' };
    correcta = R(2, 0);
    doc = [cand(R(1, 2), 'doble_como_mas'), { tex: 'x^{2}', clave: 'cuadrado', error: E('doble_como_cuadrado'), pasos: [mal('x^{2} = x^{2}')] }];
    extras = [cand(R(Q(1, 2), 0), 'doble_como_mitad', 'x \\div 2')];
  } else if (tipo === 'mitad') {
    texto = { clave: 'mitad' };
    correcta = R(Q(1, 2), 0);
    doc = [cand(R(2, 0), 'mitad_como_doble', 'x + x'), cand(R(1, -2), 'mitad_como_resta')];
    extras = [cand(R(1, 2), 'mitad_como_suma')];
  } else if (tipo === 'mas_que') {
    texto = { clave: 'mas_que', params: { n } };
    correcta = R(1, n);
    doc = [cand(R(n, 0), 'mas_como_por', `${n}x`), cand(R(1, -n), 'signo_operacion')];
    extras = [cand(R(-1, n), 'resta_al_reves')];
  } else {
    texto = { clave: 'menos_que', params: { n } };
    correcta = R(1, -n);
    doc = [cand(R(-1, n), 'menos_que_al_reves'), cand(R(1, n), 'signo_operacion')];
    extras = [cand(R(n, 0), 'mas_como_por', `${n}x`)];
  }
  return {
    texto,
    enunciado: '',
    correcta: ex(correcta),
    solucion: [paso(`${derivaUna} = ${texLineal(correcta)}`, 'traducir_expresion')],
    distractores: barajarPool(rng, doc, extras),
  };
}

/** Dos operaciones sin paréntesis, en el orden en que se dicen (U6-1A-02). */
function traducirDos(rng) {
  const tipo = rng.elegir(['doble', 'triple', 'mitad']);
  const b = rng.entero(1, 9);
  const suma = rng.moneda();
  const c = tipo === 'doble' ? Q(2) : tipo === 'triple' ? Q(3) : Q(1, 2);
  const k = suma ? b : -b;
  const correcta = R(c, k);
  const cand = (r, id) => ex(r, E(id), [mal(`${texLineal(r)} = ${texLineal(r)}`)]);
  const doc = [];
  if (c.d === 1) doc.push(cand(R(Q(k), c.n), 'intercambia_numeros'));
  if (!suma) doc.push(cand(R(qNeg(c), b), 'resta_al_reves'));
  const extras = [
    cand(R(c, -k), 'signo_operacion'),
    cand(R(c, qPor(c, Q(k))), 'mete_b_en_parentesis'),
    cand(R(1, qPor(c, Q(k))), 'escala_al_numero_fijo'),
  ];
  const clave = `${tipo}_${suma ? 'mas' : 'menos'}`;
  return {
    texto: { clave, params: { b } },
    enunciado: '',
    correcta: ex(correcta),
    solucion: [paso(`${{ doble: 'x + x', triple: 'x + x + x', mitad: 'x \\div 2' }[tipo]} ${sg(k)} ${b} = ${texLineal(correcta)}`, 'traducir_expresion')],
    distractores: barajarPool(rng, doc, extras),
  };
}

// Cada forma declara las destrezas del inventario de la unidad 6 que cubre (`items`).
export const SUBTIPOS = [
  { id: 'valor_natural', items: ['U6-1C-05'], forma: valorLineal(false) },
  { id: 'valor_negativo', items: ['U6-1C-06'], forma: valorLineal(true) },
  { id: 'valor_cuadrado', items: ['U6-1C-09'], forma: valorCuadrado },
  { id: 'reducir_x', items: ['U6-1C-13'], forma: reducirX },
  { id: 'reducir_mezcla', items: ['U6-1C-14'], forma: reducirMezcla },
  { id: 'parentesis_numero', items: ['U6-3C-06'], forma: parentesisNumero },
  { id: 'parentesis_menos', items: ['U6-3C-07'], forma: parentesisMenos },
  { id: 'traducir_una', items: ['U6-1A-01'], forma: traducirUna },
  { id: 'traducir_dos', items: ['U6-1A-02'], forma: traducirDos },
].map(s => ({
  ...s,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores } = s.forma(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
}));

export default {
  id: 'expresiones_algebraicas',
  nombre: { es: 'Expresiones algebraicas', en: 'Algebraic expressions' },
  curso: 1,
  concepto: 'expresiones_algebraicas',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas,
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
