// «Suma y resta» de fracciones: textos propios, siempre { es, en }. Las cuentas se pintan con
// `htmlCuenta` (fracciones con raya, producto con «·», nunca «×»); una negativa solo va delante
// (−1/8 + 5/8) o como resultado, sin paréntesis. La palabra no matemática que decide la respuesta
// lleva su aclaración entre paréntesis en el texto inglés.

import { fraccion, htmlFraccion, htmlCuenta, ERRORES_TIPICOS } from '../_comun/fracciones.js';
import { F, ERRORES_PROPIOS, terminosNat, resultadoNat, resultadoMismo, equivalentes, sumaDeNumeradores, resultadoPasos, respuestaQueda } from './logica.js';

const fr = (n, d) => htmlFraccion(fraccion(n, d));
const frItem = x => htmlFraccion('num' in x ? x : F(x));   // un ítem { n, d } o una Fraccion
const cuenta = c => `<span class="cuenta">${c}</span>`;
const signoNum = n => (n < 0 ? `−${-n}` : `${n}`);
const mcm = (a, b) => { let x = a, y = b; while (y) [x, y] = [y, x % y]; return (a / x) * b; };
const OP = { '+': '+', '-': '−' };
const sinEspacios = s => s.replace(/\s+/g, ' ').trim();

/** El nombre bilingüe de un error (de la base o propio). */
export const nombreError = (id, idioma) => (ERRORES_TIPICOS[id] ?? ERRORES_PROPIOS[id]).nombre[idioma];

// ─── Ejercicio 1: mismo denominador ────────────────────────────────────────────

/** La cuenta del enunciado: 3/8 + 1/8 = */
export const cuentaMismo = item => htmlCuenta([F(item.a), item.op, F(item.b), '=']);

/** El paso a paso en un idioma: numeradores, y simplificación si procede. */
export function solucionMismo(item, idioma) {
  const { a, b, op, d = a.d } = { ...item, d: item.a.d };
  const r = resultadoMismo(item);
  const s = r.simplificar();
  const nums = `${signoNum(a.n)} ${OP[op]} ${b.n} = ${signoNum(r.num)}`;
  const simp = r.mismaForma(s) ? '' : (idioma === 'es' ? ` Simplificando: ${frItem(r)} = ${frItem(s)}.` : ` Simplifying: ${frItem(r)} = ${frItem(s)}.`);
  return idioma === 'es'
    ? `El denominador no cambia (${d}); se opera con los numeradores: ${nums}. Queda ${frItem(r)}.${simp} La respuesta es ${cuenta(frItem(s))}.`
    : `The denominator does not change (${d}); you work with the numerators: ${nums}. That gives ${frItem(r)}.${simp} The answer is ${cuenta(frItem(s))}.`;
}

// ─── Ejercicio 2: paso a paso ──────────────────────────────────────────────────

/** El enunciado: 1/4 + 2/3 − 1/6 = */
export const cuentaPasos = item => htmlCuenta(item.fracs.flatMap((f, i) => (i === 0 ? [F(f)] : [item.ops[i - 1], F(f)])).concat('='));

/** El paso a paso de la solución. */
export function solucionPasos(item, idioma) {
  const es = idioma === 'es';
  const dens = item.fracs.map(f => f.d).join(', ');
  const eq = equivalentes(item);
  const lista = item.fracs.map((f, i) => `${frItem(f)} = ${fr(eq[i], item.m)}`).join('; ');
  const total = sumaDeNumeradores(item, eq);
  const nums = eq.map((x, i) => (i === 0 ? `${x}` : `${OP[item.ops[i - 1]]} ${x}`)).join(' ');
  const r = resultadoPasos(item), s = r.simplificar();
  const simp = r.mismaForma(s) ? '' : (es ? ` Simplificando: ${frItem(r)} = ${frItem(s)}.` : ` Simplifying: ${frItem(r)} = ${frItem(s)}.`);
  return es
    ? `m.c.m.(${dens}) = ${item.m}. Equivalentes: ${lista}. Se opera con los numeradores: ${nums} = ${total}, es decir ${frItem(r)}.${simp} La respuesta es ${cuenta(frItem(s))}.`
    : `l.c.m.(${dens}) = ${item.m}. Equivalent fractions: ${lista}. You work with the numerators: ${nums} = ${total}, that is ${frItem(r)}.${simp} The answer is ${cuenta(frItem(s))}.`;
}

// ─── Ejercicio 3: con naturales ────────────────────────────────────────────────

/** La cuenta del enunciado: 1 + 2/3 = */
export function cuentaNat(item) {
  const { x, op, y } = terminosNat(item);
  return htmlCuenta([x, op, y, '=']);
}

/** El paso a paso: el natural pasa a fracción con el denominador de la otra. */
export function solucionNat(item, idioma) {
  const es = idioma === 'es';
  const { x, op, y } = terminosNat(item);
  const d = item.f.d;
  const nat = fraccion(item.nat * d, d);
  const x2 = x.den === 1 ? nat : x, y2 = y.den === 1 ? nat : y;
  const r = resultadoNat(item);
  const paso = `${htmlFraccion(item.nat)} = ${htmlFraccion(nat)}`;
  const linea = htmlCuenta([x2, op, y2, '=', r]);
  return es
    ? `El natural es una fracción de denominador ${d}: ${paso}. Ahora, con el mismo denominador: ${linea}. La respuesta es ${cuenta(htmlFraccion(r))}.`
    : `The whole number is a fraction with denominator ${d}: ${paso}. Now, with the same denominator: ${linea}. The answer is ${cuenta(htmlFraccion(r))}.`;
}

// ─── Ejercicio 4: ¿qué queda? ──────────────────────────────────────────────────

/** Texto y pregunta de cada contexto (a y b en HTML). */
export const CONTEXTOS_TX = {
  dinero: {
    es: { texto: (a, b) => `Ana gasta ${a} de su dinero el lunes y ${b} el martes.`, queda: '¿Qué fracción de su dinero le queda?', gastan: '¿Qué fracción de su dinero ha gastado en total?' },
    en: { texto: (a, b) => `Ana spends ${a} of her money on Monday and ${b} on Tuesday.`, queda: 'What fraction of her money is left?', gastan: 'What fraction of her money has she spent in total?' },
  },
  pizza: {
    es: { texto: (a, b) => `Luis se come ${a} de una pizza y su hermana, ${b}.`, queda: '¿Qué fracción de la pizza queda?', gastan: '¿Qué fracción de la pizza se han comido entre los dos?' },
    en: { texto: (a, b) => `Luis eats ${a} of a pizza and his sister eats ${b}.`, queda: 'What fraction of the pizza is left?', gastan: 'What fraction of the pizza have they eaten between them?' },
  },
  deposito: {
    es: { texto: (a, b) => `Un coche gasta ${a} del depósito de gasolina el sábado y ${b} el domingo.`, queda: '¿Qué fracción del depósito queda?', gastan: '¿Qué fracción del depósito ha gastado en total?' },
    en: { texto: (a, b) => `A car uses ${a} of its petrol tank (depósito) on Saturday and ${b} on Sunday.`, queda: 'What fraction of the tank is left?', gastan: 'What fraction of the tank has it used in total?' },
  },
  libro: {
    es: { texto: (a, b) => `Marta lee ${a} de un libro por la mañana y ${b} por la tarde.`, queda: '¿Qué fracción del libro le falta por leer?', gastan: '¿Qué fracción del libro ha leído?' },
    en: { texto: (a, b) => `Marta reads ${a} of a book in the morning and ${b} in the afternoon.`, queda: 'What fraction of the book is left to read?', gastan: 'What fraction of the book has she read?' },
  },
  ruta: {
    es: { texto: (a, b) => `Un ciclista hace ${a} de una ruta antes de comer y ${b} después.`, queda: '¿Qué fracción de la ruta le falta?', gastan: '¿Qué fracción de la ruta ha hecho?' },
    en: { texto: (a, b) => `A cyclist rides ${a} of a route before lunch and ${b} after lunch.`, queda: 'What fraction of the route is left?', gastan: 'What fraction of the route has he done?' },
  },
};

/** Enunciado y pregunta de un ítem del ejercicio 4. */
export function enunciadoQueda(item, idioma) {
  const c = CONTEXTOS_TX[item.ctx][idioma];
  return { texto: c.texto(frItem(item.a), frItem(item.b)), pregunta: c[item.pregunta] };
}

/** El paso a paso de la respuesta buena, con el común denominador. */
export function solucionQueda(item, idioma) {
  const es = idioma === 'es';
  const a = F(item.a), b = F(item.b);
  const m = mcm(a.den, b.den);
  const an = (a.num * m) / a.den, bn = (b.num * m) / b.den;
  const suma = a.sumar(b), q = fraccion(1, 1).restar(suma);
  const juntas = `${frItem(a)} + ${frItem(b)} = ${fr(an, m)} + ${fr(bn, m)} = ${fr(an + bn, m)}`;
  const buena = frItem(respuestaQueda(item));
  if (item.pregunta === 'gastan') return es ? `Se suman las partes con denominador común (${m}): ${juntas}. La respuesta es ${cuenta(buena)}.` : `Add the parts with a common denominator (${m}): ${juntas}. The answer is ${cuenta(buena)}.`;
  const resta = `1 − ${fr(an + bn, m)} = ${fr(m, m)} − ${fr(an + bn, m)} = ${fr(q.num, q.den)}`;
  return es
    ? `Primero lo que se gasta, con denominador común (${m}): ${juntas}. Lo que queda es lo que falta hasta 1: ${resta}. La respuesta es ${cuenta(buena)}.`
    : `First what is spent, with a common denominator (${m}): ${juntas}. What is left is what is missing up to 1: ${resta}. The answer is ${cuenta(buena)}.`;
}

/** Por qué está mal una opción del ejercicio 4. */
export function explicaOpcion(item, o, idioma) {
  const es = idioma === 'es';
  const v = frItem(o);
  switch (o.error) {
    case 'gastado-como-queda':
      return es ? `${v} es lo que ya se ha gastado, no lo que queda.` : `${v} is what has already been spent, not what is left.`;
    case 'queda-como-gastado':
      return es ? `${v} es lo que queda; la pregunta es por lo que se gasta en total.` : `${v} is what is left; the question is about what is spent in total.`;
    case 'suma-arriba-y-abajo':
      return es ? 'Al sumar las partes has sumado también los denominadores. Primero hay que poner el mismo denominador y después se suman solo los numeradores.' : 'When adding the parts you also added the denominators. First you need the same denominator, and then you add only the numerators.';
    case 'olvida-restar-la-primera':
      return es ? `${v} es 1 menos la segunda parte: falta restar también la primera.` : `${v} is 1 minus the second part: you also have to subtract the first.`;
    case 'olvida-restar-la-segunda':
      return es ? `${v} es 1 menos la primera parte: falta restar también la segunda.` : `${v} is 1 minus the first part: you also have to subtract the second.`;
    case 'suma-solo-cambia-denominador':
      return es ? 'Has puesto el denominador común, pero no has cambiado los numeradores.' : 'You wrote the common denominator, but you did not change the numerators.';
    case 'suma-multiplicando-denominadores':
      return es ? 'Has sumado los numeradores y multiplicado los denominadores: eso no es sumar fracciones.' : 'You added the numerators and multiplied the denominators: that is not how fractions are added.';
    case 'en-cruz-al-sumar':
      return es ? 'Has multiplicado en cruz, como al dividir. En una suma se busca un denominador común.' : 'You cross-multiplied, as when dividing. In an addition you look for a common denominator.';
    default:
      return '';
  }
}

// ─── Ejercicio 5: caza el error ────────────────────────────────────────────────

/** Las tres líneas del ítem, en HTML: a + b = x + y / = s / = r. */
export function lineasCaza(item) {
  const { a, b, l1, l2, l3 } = item;
  return [
    htmlCuenta([F(a), '+', F(b), '=', F(l1.x), '+', F(l1.y)]),
    htmlCuenta(['=', F(l2.s)]),
    htmlCuenta(['=', F(l3.r)]),
  ];
}

/** La explicación del error de un ítem (o de que no hay ninguno), con sus números. */
export function explicaCaza(item, idioma) {
  const es = idioma === 'es';
  const a = F(item.a), b = F(item.b), m = item.m;
  const bien1 = `${frItem(a)} = ${fr((a.num * m) / a.den, m)}`;
  switch (item.error) {
    case null:
      return es ? 'Las tres líneas están bien: se pasa a denominador común, se suman los numeradores y se simplifica.' : 'All three lines are right: you get a common denominator, add the numerators and simplify.';
    case 'amplia-solo-denominador':
      return es ? `Línea 1: ${frItem(item.l1.x)} no es ${frItem(a)}. Al pasar a denominador ${m} hay que multiplicar también el numerador: ${bien1}.` : `Line 1: ${frItem(item.l1.x)} is not ${frItem(a)}. To change to denominator ${m} you also have to multiply the numerator: ${bien1}.`;
    case 'suma-arriba-y-abajo':
      return es ? `Línea 2: con el mismo denominador (${m}) solo se suman los numeradores y el denominador se queda en ${m}, no en ${2 * m}.` : `Line 2: with the same denominator (${m}) you add only the numerators and the denominator stays ${m}, not ${2 * m}.`;
    default:
      return es ? `Línea 3: hay que dividir el numerador y el denominador entre el mismo número (${item.l2.s.n / item.l3.r.n}), no solo el numerador.` : `Line 3: you have to divide the numerator and the denominator by the same number (${item.l2.s.n / item.l3.r.n}), not just the numerator.`;
  }
}

// ─── Los textos de los cinco ejercicios ────────────────────────────────────────

export const TX = {
  mismo: {
    nombre: { es: 'Mismo denominador', en: 'Same denominator' },
    detalle: { es: 'Suma y resta con el mismo denominador, también con negativas', en: 'Add and subtract with the same denominator, also with negatives' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Si las fracciones tienen el <strong>mismo denominador</strong>, el denominador <strong>no cambia</strong>: solo se suman o se restan los <strong>numeradores</strong>.</p>
        <p>Por ejemplo: ${htmlCuenta([fraccion(3, 8), '+', fraccion(1, 8), '=', fraccion(4, 8)])}; y simplificando, <strong>${fr(1, 2)}</strong>.</p>
        <p>Con la regla de los signos de los enteros: ${htmlCuenta([fraccion(3, 10), '-', fraccion(7, 10), '=', fraccion(-4, 10)])} = <strong>${fr(-2, 5)}</strong>. El botón <strong>+/−</strong> pone el signo menos.</p>`,
      en: `<h2>How it works</h2>
        <p>If the fractions have the <strong>same denominator</strong>, the denominator <strong>does not change</strong>: you only add or subtract the <strong>numerators</strong>.</p>
        <p>For example: ${htmlCuenta([fraccion(3, 8), '+', fraccion(1, 8), '=', fraccion(4, 8)])}; and simplifying, <strong>${fr(1, 2)}</strong>.</p>
        <p>With the sign rule for integers: ${htmlCuenta([fraccion(3, 10), '-', fraccion(7, 10), '=', fraccion(-4, 10)])} = <strong>${fr(-2, 5)}</strong>. The <strong>+/−</strong> button writes the minus sign.</p>`,
    },
    instruccion: {
      es: irred => (irred ? 'Calcula y escribe el resultado, simplificado al máximo.' : 'Calcula y escribe el resultado (vale sin simplificar).'),
      en: irred => (irred ? 'Work it out and write the result in its simplest form.' : 'Work it out and write the result (it does not have to be simplified).'),
    },
    arriba: { es: 'Numerador', en: 'Numerator' },
    abajo: { es: 'Denominador', en: 'Denominator' },
    escribio: { es: f => `Has escrito ${f}.`, en: f => `You wrote ${f}.` },
    fallo: {
      'suma-arriba-y-abajo': { es: () => 'Has sumado también los denominadores. Con el mismo denominador, el denominador no cambia: solo se suman los numeradores.', en: () => 'You also added the denominators. With the same denominator, the denominator does not change: you only add the numerators.' },
      'signo-perdido': { es: () => 'El resultado de los numeradores es negativo y has escrito el positivo.', en: () => 'The result of the numerators is negative and you wrote the positive one.' },
      'signo-del-primero': { es: () => 'Has puesto el signo del primer número; el signo lo manda el resultado de la cuenta con los numeradores.', en: () => 'You used the sign of the first number; the sign comes from the result of the calculation with the numerators.' },
      'sin-simplificar': { es: () => 'Vale lo mismo, pero se pedía simplificado al máximo.', en: () => 'It has the same value, but it had to be in its simplest form.' },
      'otro-error': { es: () => '', en: () => '' },
    },
  },

  pasos: {
    nombre: { es: 'Distinto denominador, paso a paso', en: 'Different denominators, step by step' },
    detalle: { es: 'Con el m.c.m.: equivalentes, cuenta y simplificar', en: 'With the l.c.m.: equivalents, sum and simplify' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Con distinto denominador, primero hace falta un <strong>denominador común</strong>: el <strong>m.c.m.</strong> de los denominadores. Son tres pasos:</p>
        <p><strong>1.</strong> El m.c.m.; <strong>2.</strong> cada fracción pasada a ese denominador (se multiplica arriba y abajo por lo mismo); <strong>3.</strong> el resultado (con los numeradores) y, si toca, simplificado.</p>
        <p>Por ejemplo: ${htmlCuenta([fraccion(1, 4), '+', fraccion(2, 3), '='])} m.c.m.(4, 3) = <strong>12</strong>; ${fr(1, 4)} = ${fr(3, 12)} y ${fr(2, 3)} = ${fr(8, 12)}; 3 + 8 = 11, así que <strong>${fr(11, 12)}</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>With different denominators you first need a <strong>common denominator</strong>: the <strong>l.c.m.</strong> of the denominators. There are three steps:</p>
        <p><strong>1.</strong> The l.c.m.; <strong>2.</strong> each fraction changed to that denominator (multiply top and bottom by the same number); <strong>3.</strong> the result (with the numerators) and, if needed, simplified.</p>
        <p>For example: ${htmlCuenta([fraccion(1, 4), '+', fraccion(2, 3), '='])} l.c.m.(4, 3) = <strong>12</strong>; ${fr(1, 4)} = ${fr(3, 12)} and ${fr(2, 3)} = ${fr(8, 12)}; 3 + 8 = 11, so <strong>${fr(11, 12)}</strong>.</p>`,
    },
    instruccion: {
      es: irred => `Rellena los tres pasos. ${irred ? 'El resultado, simplificado al máximo.' : 'El resultado vale sin simplificar.'}`,
      en: irred => `Fill in the three steps. ${irred ? 'The result in its simplest form.' : 'The result does not have to be simplified.'}`,
    },
    paso1: { es: dens => `1. m.c.m. de ${dens}`, en: dens => `1. l.c.m. of ${dens}` },
    paso2: { es: '2. Fracciones equivalentes con ese denominador', en: '2. Equivalent fractions with that denominator' },
    paso3: { es: '3. Resultado', en: '3. Result' },
    nombre_mcm: { es: 'm.c.m.', en: 'l.c.m.' },
    nombre_equiv: { es: n => `Numerador de la fracción ${n}`, en: n => `Numerator of fraction ${n}` },
    escribio: { es: f => `Has escrito ${f}.`, en: f => `You wrote ${f}.` },
    coherente: {
      es: 'Tu resultado es coherente con tus equivalentes: el fallo está en un paso anterior.',
      en: 'Your result is consistent with your equivalent fractions: the mistake is in an earlier step.',
    },
    fallo: {
      'mcm-equivocado': { es: item => `El m.c.m. de ${item.fracs.map(f => f.d).join(', ')} es ${item.m}: el menor número que es múltiplo de todos los denominadores.`, en: item => `The l.c.m. of ${item.fracs.map(f => f.d).join(', ')} is ${item.m}: the smallest number that is a multiple of all the denominators.` },
      'amplia-solo-denominador': { es: item => `Al pasar a denominador ${item.m} hay que multiplicar también el numerador por el mismo número que el denominador.`, en: item => `To change to denominator ${item.m} you also have to multiply the numerator by the same number as the denominator.` },
      'equivalente-equivocada': { es: item => `Una fracción equivalente se obtiene multiplicando arriba y abajo por el mismo número: (${item.m} : denominador) veces el numerador.`, en: item => `An equivalent fraction comes from multiplying top and bottom by the same number: (${item.m} : denominator) times the numerator.` },
      'suma-arriba-y-abajo': { es: () => 'Has sumado los numeradores y también los denominadores. Primero se pone el mismo denominador y después se suman solo los numeradores.', en: () => 'You added the numerators and also the denominators. First you write the same denominator and then you add only the numerators.' },
      'en-cruz-al-sumar': { es: () => 'Has multiplicado en cruz, como al dividir. En una suma se busca un denominador común.', en: () => 'You cross-multiplied, as when dividing. In an addition you look for a common denominator.' },
      'suma-solo-cambia-denominador': { es: () => 'Has puesto el denominador común, pero no has cambiado los numeradores.', en: () => 'You wrote the common denominator, but you did not change the numerators.' },
      'suma-multiplicando-denominadores': { es: () => 'Has sumado los numeradores y multiplicado los denominadores: eso no es sumar fracciones.', en: () => 'You added the numerators and multiplied the denominators: that is not how fractions are added.' },
      'sin-simplificar': { es: () => 'El resultado vale lo mismo, pero se pedía simplificado al máximo.', en: () => 'The result has the same value, but it had to be in its simplest form.' },
      'otro-error': { es: () => '', en: () => '' },
    },
  },

  nat: {
    nombre: { es: 'Con naturales', en: 'With whole numbers' },
    detalle: { es: 'Suma y resta de un natural y una fracción', en: 'Add and subtract a whole number and a fraction' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un número natural es una fracción de denominador 1. Para sumarlo o restarlo, lo pasas a una fracción con el <strong>mismo denominador</strong> que la otra.</p>
        <p>Por ejemplo: ${htmlCuenta([1, '+', fraccion(2, 3), '='])} 1 = ${fr(3, 3)}, y ${htmlCuenta([fraccion(3, 3), '+', fraccion(2, 3), '=', fraccion(5, 3)])}.</p>
        <p>Si el resultado es negativo, escribes el signo con el botón <strong>+/−</strong>: ${htmlCuenta([fraccion(1, 2), '-', 2, '=', fraccion(1, 2), '-', fraccion(4, 2), '=', fraccion(-3, 2)])}.</p>`,
      en: `<h2>How it works</h2>
        <p>A whole number is a fraction with denominator 1. To add or subtract it, you change it into a fraction with the <strong>same denominator</strong> as the other one.</p>
        <p>For example: ${htmlCuenta([1, '+', fraccion(2, 3), '='])} 1 = ${fr(3, 3)}, and ${htmlCuenta([fraccion(3, 3), '+', fraccion(2, 3), '=', fraccion(5, 3)])}.</p>
        <p>If the result is negative, write the sign with the <strong>+/−</strong> button: ${htmlCuenta([fraccion(1, 2), '-', 2, '=', fraccion(1, 2), '-', fraccion(4, 2), '=', fraccion(-3, 2)])}.</p>`,
    },
    instruccion: { es: 'Calcula y escribe el resultado como una fracción, simplificada al máximo.', en: 'Work it out and write the result as a fraction in its simplest form.' },
    escribio: { es: f => `Has escrito ${f}.`, en: f => `You wrote ${f}.` },
    fallo: {
      'natural-al-numerador': { es: () => 'Has sumado el natural solo al numerador. Hay que convertirlo en una fracción con el mismo denominador.', en: () => 'You added the whole number to the numerator only. You have to turn it into a fraction with the same denominator.' },
      'suma-arriba-y-abajo': { es: () => 'Has sumado arriba con arriba y abajo con abajo. Primero hay que pasar el natural a fracción con el mismo denominador.', en: () => 'You added top with top and bottom with bottom. First you have to turn the whole number into a fraction with the same denominator.' },
      'signo-perdido': { es: () => 'El resultado es negativo (se resta una cantidad mayor) y has escrito el positivo.', en: () => 'The result is negative (you subtract a bigger amount) and you wrote the positive one.' },
      'sin-simplificar': { es: () => 'Vale lo mismo, pero se pedía simplificado al máximo.', en: () => 'It has the same value, but it had to be in its simplest form.' },
      'otro-error': { es: () => '', en: () => '' },
    },
  },

  queda: {
    nombre: { es: '¿Qué queda?', en: 'What is left?' },
    detalle: { es: 'Partes de un todo: lo que se gasta y lo que queda', en: 'Parts of a whole: what is spent and what is left' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Las partes de un todo se <strong>suman</strong>; y <strong>lo que queda</strong> es lo que falta hasta <strong>1</strong> (el todo). Lee bien la pregunta: a veces pide lo que se gasta y a veces lo que queda.</p>
        <p>Por ejemplo: gasta ${fr(1, 3)} y ${fr(1, 4)}. Juntas: ${htmlCuenta([fraccion(1, 3), '+', fraccion(1, 4), '=', fraccion(4, 12), '+', fraccion(3, 12), '=', fraccion(7, 12)])}. Queda ${htmlCuenta([1, '-', fraccion(7, 12), '=', fraccion(5, 12)])}.</p>`,
      en: `<h2>How it works</h2>
        <p>The parts of a whole are <strong>added</strong>; and <strong>what is left</strong> is what is missing up to <strong>1</strong> (the whole). Read the question carefully: sometimes it asks for what is spent and sometimes for what is left.</p>
        <p>For example: she spends ${fr(1, 3)} and ${fr(1, 4)}. Together: ${htmlCuenta([fraccion(1, 3), '+', fraccion(1, 4), '=', fraccion(4, 12), '+', fraccion(3, 12), '=', fraccion(7, 12)])}. What is left: ${htmlCuenta([1, '-', fraccion(7, 12), '=', fraccion(5, 12)])}.</p>`,
    },
    instruccion: { es: 'Lee el problema y elige la respuesta (todas están simplificadas).', en: 'Read the problem and choose the answer (all of them are simplified).' },
  },

  caza: {
    nombre: { es: 'Caza el error', en: 'Spot the mistake' },
    detalle: { es: 'Una suma en tres líneas: ¿hay algún error?', en: 'A sum in three lines: is there a mistake?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Te enseñamos una suma resuelta <strong>en tres líneas</strong>: las equivalentes, la suma y la simplificación. <strong>Toca la línea donde está el error</strong> y después elige <strong>por qué</strong> está mal. Si todo está bien, toca <strong>«No hay error»</strong>.</p>
        <p>Ojo: a veces no hay ningún error.</p>`,
      en: `<h2>How it works</h2>
        <p>We show you a sum solved <strong>in three lines</strong>: the equivalent fractions, the sum and the simplification. <strong>Tap the line with the mistake</strong> and then choose <strong>why</strong> it is wrong. If everything is right, tap <strong>“No mistake”</strong>.</p>
        <p>Careful: sometimes there is no mistake at all.</p>`,
    },
    instruccion: { es: 'Toca la línea con el error, o «No hay error».', en: 'Tap the line with the mistake, or “No mistake”.' },
    linea: { es: n => `Línea ${n}`, en: n => `Line ${n}` },
    ninguno: { es: 'No hay error', en: 'No mistake' },
    por_que: { es: '¿Qué ha pasado en esa línea?', en: 'What went wrong in that line?' },
    bien: { es: 'Bien visto.', en: 'Well spotted.' },
    falla: {
      'linea-equivocada': { es: n => `La línea ${n} está bien.`, en: n => `Line ${n} is right.` },
      'no-ve-el-error': { es: () => 'Sí había un error.', en: () => 'There was a mistake.' },
      've-un-error-donde-no-lo-hay': { es: () => 'Aquí no había ningún error: las tres líneas están bien.', en: () => 'There was no mistake here: all three lines are right.' },
      razon: { es: 'Esa no era la razón.', en: 'That was not the reason.' },
    },
  },
};

export { sinEspacios };
