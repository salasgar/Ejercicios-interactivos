// Textos de «Multiplica y divide» (unidad 4, tarea 105), siempre { es, en }. Los feedback son
// funciones PURAS de (item, ctx, error) con `ctx.tt`: se prueban sin navegador y la base los puede
// dar también en el otro idioma. Todos los números son los del ítem; el error es el id del error
// típico (o `undefined` si el alumno acertó).

import { fraccion, htmlFraccion, htmlCuenta, htmlRaya, MENOS } from '../_comun/fracciones.js';
import {
  F, par, tachado, contextoDe, pasosDivide, CONTEXTOS_PARTE,
  ERROR_SIN_SIMPLIFICAR, ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR,
} from './logica.js';

/** Una fracción (par [n, d] o Fraccion) en HTML. */
export const fr = x => htmlFraccion(Array.isArray(x) ? F(x) : x);
const cuenta = (...partes) => htmlCuenta(partes.map(p => (Array.isArray(p) ? F(p) : p)));
const sup = n => `<sup>${n}</sup>`;

export const TX = {
  nombres: {
    multiplica: { es: 'Multiplica', en: 'Multiply' },
    parte: { es: 'La fracción de una fracción', en: 'A fraction of a fraction' },
    inversa: { es: 'La inversa', en: 'The reciprocal' },
    divide: { es: 'Divide', en: 'Divide' },
    potencia: { es: 'Potencias', en: 'Powers' },
  },
  detalles: {
    multiplica: { es: 'Multiplica fracciones y simplifica', en: 'Multiply fractions and simplify' },
    parte: { es: 'Una fracción «de» otra fracción', en: 'A fraction “of” another fraction' },
    inversa: { es: 'Dale la vuelta a la fracción', en: 'Turn the fraction upside down' },
    divide: { es: 'Divide fracciones, por el método que prefieras', en: 'Divide fractions with the method you prefer' },
    potencia: { es: 'Eleva una fracción a 2 o a 3', en: 'Raise a fraction to the power of 2 or 3' },
  },
  introduccion: {
    multiplica: {
      es: `<h2>Cómo se hace</h2>
        <p>Se multiplica <strong>arriba por arriba</strong> y <strong>abajo por abajo</strong>, y se simplifica:</p>
        <p>${cuenta([3, 4], '·', [2, 9], '=', fraccion(6, 36), '=', [1, 6])}</p>
        <p>Más fácil: <strong>simplifica antes</strong>. Un número de arriba y uno de abajo que se pueden dividir entre lo mismo se tachan, aunque estén en fracciones distintas: 3 y 9 (entre 3), 2 y 4 (entre 2).</p>
        <p>Un número natural es una fracción con 1 abajo: ${cuenta(5, '·', [2, 7], '=', [10, 7])}.</p>
        <p>Con una fracción negativa, los signos funcionan como en los enteros: ${cuenta(fraccion(-2, 3), '·', [3, 8], '=', fraccion(-1, 4))}.</p>`,
      en: `<h2>How it works</h2>
        <p>Multiply <strong>top by top</strong> and <strong>bottom by bottom</strong>, then simplify:</p>
        <p>${cuenta([3, 4], '·', [2, 9], '=', fraccion(6, 36), '=', [1, 6])}</p>
        <p>It is easier to <strong>simplify first</strong>. A top number and a bottom number that can be divided by the same number are crossed out, even if they are in different fractions: 3 and 9 (by 3), 2 and 4 (by 2).</p>
        <p>A whole number is a fraction with 1 at the bottom: ${cuenta(5, '·', [2, 7], '=', [10, 7])}.</p>
        <p>With a negative fraction, the signs work as with integers: ${cuenta(fraccion(-2, 3), '·', [3, 8], '=', fraccion(-1, 4))}.</p>`,
    },
    parte: {
      es: `<h2>Cómo se hace</h2>
        <p>«De» entre dos fracciones significa <strong>multiplicar</strong>. La mitad de ${fr([1, 3])} es ${cuenta([1, 2], '·', [1, 3], '=', [1, 6])}.</p>
        <p>En el dibujo: el todo se parte en filas y columnas; la primera fracción pinta unas columnas, y la segunda toma unas filas de esas columnas.</p>
        <p>Escribe la fracción <strong>de todo</strong> y simplifícala.</p>`,
      en: `<h2>How it works</h2>
        <p>“Of” between two fractions means <strong>multiply</strong>. Half of ${fr([1, 3])} is ${cuenta([1, 2], '·', [1, 3], '=', [1, 6])}.</p>
        <p>In the drawing: the whole is split into rows and columns; the first fraction colours some columns, and the second takes some rows of those columns.</p>
        <p>Write the fraction <strong>of the whole</strong> and simplify it.</p>`,
    },
    inversa: {
      es: `<h2>Cómo se hace</h2>
        <p>La <strong>inversa</strong> de una fracción es la que se obtiene dándole la vuelta: la inversa de ${fr([3, 5])} es ${fr([5, 3])}.</p>
        <p>Un natural es una fracción con 1 abajo: la inversa de 4 es ${fr([1, 4])}.</p>
        <p>La inversa de una negativa también es negativa: la inversa de ${fr(fraccion(-3, 4))} es ${fr(fraccion(-4, 3))}. No la confundas con la <em>opuesta</em>, que cambia el signo.</p>
        <p>Una fracción por su inversa siempre da 1: ${cuenta([3, 5], '·', [5, 3], '=', 1)}.</p>`,
      en: `<h2>How it works</h2>
        <p>The <strong>reciprocal</strong> of a fraction is what you get by turning it upside down: the reciprocal of ${fr([3, 5])} is ${fr([5, 3])}.</p>
        <p>A whole number is a fraction with 1 at the bottom: the reciprocal of 4 is ${fr([1, 4])}.</p>
        <p>The reciprocal of a negative fraction is also negative: the reciprocal of ${fr(fraccion(-3, 4))} is ${fr(fraccion(-4, 3))}. Do not mix it up with the <em>opposite</em>, which changes the sign.</p>
        <p>A fraction times its reciprocal is always 1: ${cuenta([3, 5], '·', [5, 3], '=', 1)}.</p>`,
    },
    divide: {
      es: `<h2>Cómo se hace</h2>
        <p>Dividir es multiplicar por la <strong>inversa del segundo</strong>:</p>
        <p>${cuenta([2, 3], ':', [4, 5], '=', [2, 3], '·', [5, 4], '=', fraccion(10, 12), '=', [5, 6])}</p>
        <p>Hay otro método, <strong>en cruz</strong>, que da lo mismo: arriba, el primer numerador por el segundo denominador; abajo, el primer denominador por el segundo numerador. Los dos métodos valen: elige el que prefieras.</p>
        <p>Un natural es una fracción con 1 abajo. Y con una fracción negativa, los signos funcionan como en los enteros.</p>`,
      en: `<h2>How it works</h2>
        <p>To divide, multiply by the <strong>reciprocal of the second one</strong>:</p>
        <p>${cuenta([2, 3], ':', [4, 5], '=', [2, 3], '·', [5, 4], '=', fraccion(10, 12), '=', [5, 6])}</p>
        <p>There is another method, <strong>cross-multiplying</strong>, that gives the same result: on top, the first numerator times the second denominator; at the bottom, the first denominator times the second numerator. Both methods are good: choose the one you prefer.</p>
        <p>A whole number is a fraction with 1 at the bottom. And with a negative fraction, the signs work as with integers.</p>`,
    },
    potencia: {
      es: `<h2>Cómo se hace</h2>
        <p>El exponente dice cuántas veces se multiplica la base por sí misma. Con una fracción, se elevan <strong>el numerador y el denominador</strong>:</p>
        <p>${cuenta([2, 3], '·', [2, 3], '=', [4, 9])}, es decir, <span class="cuenta-frac">(${fr([2, 3])})${sup(2)} = ${fr([4, 9])}</span>.</p>`,
      en: `<h2>How it works</h2>
        <p>The exponent says how many times the base is multiplied by itself. With a fraction, you raise <strong>the numerator and the denominator</strong>:</p>
        <p>${cuenta([2, 3], '·', [2, 3], '=', [4, 9])}, that is, <span class="cuenta-frac">(${fr([2, 3])})${sup(2)} = ${fr([4, 9])}</span>.</p>`,
    },
  },
  enunciado: {
    multiplica: { es: 'Multiplica y escribe la fracción irreducible.', en: 'Multiply and write the fraction in its simplest form.' },
    inversa: { es: 'Escribe la inversa.', en: 'Write the reciprocal.' },
    inversa2: { es: 'Ahora comprueba: ¿cuánto da la fracción por su inversa?', en: 'Now check it: what is the fraction times its reciprocal?' },
    divide: { es: 'Divide y escribe la fracción irreducible.', en: 'Divide and write the fraction in its simplest form.' },
    potencia: { es: 'Calcula y escribe la fracción irreducible.', en: 'Work it out and write the fraction in its simplest form.' },
  },
  resultado: { es: 'Resultado', en: 'Result' },
  numerador: { es: 'Numerador', en: 'Numerator' },
  denominador: { es: 'Denominador', en: 'Denominator' },
  simplifica_antes: { es: 'Simplifica antes', en: 'Simplify first' },
  por_la_inversa: { es: 'Por la inversa', en: 'With the reciprocal' },
  en_cruz: { es: 'En cruz', en: 'Cross-multiplying' },
};

// ─── Enunciados con dibujo ─────────────────────────────────────────────────────

const FRASES_PARTE = {
  tableta: {
    es: item => `Las almendras cubren ${fr(item.c)} de la tableta de chocolate. Te comes ${fr(item.a)} de esa parte. ¿Qué fracción de toda la tableta te comes?`,
    en: item => `Almonds cover ${fr(item.c)} of the chocolate bar. You eat ${fr(item.a)} of that part. What fraction of the whole bar do you eat?`,
  },
  bandeja: {
    es: item => `Los brownies con nueces ocupan ${fr(item.c)} de la bandeja. Te llevas ${fr(item.a)} de esa parte. ¿Qué fracción de toda la bandeja te llevas?`,
    en: item => `The brownies with walnuts take up ${fr(item.c)} of the tray. You take ${fr(item.a)} of that part. What fraction of the whole tray do you take?`,
  },
  huerto: {
    es: item => `Las lechugas ocupan ${fr(item.c)} del huerto. Hoy riegas ${fr(item.a)} de esa parte. ¿Qué fracción de todo el huerto riegas?`,
    en: item => `Lettuces take up ${fr(item.c)} of the garden. Today you water ${fr(item.a)} of that part. What fraction of the whole garden do you water?`,
  },
};

export const nombreDeTodo = (item, tt) => tt(contextoDe(item.contexto).nombre);
export const fraseParte = (item, { tt }) => tt({ es: FRASES_PARTE[item.contexto].es(item), en: FRASES_PARTE[item.contexto].en(item) });

// ─── El producto con factores tachados (ejercicio 1) ───────────────────────────

const tachar = (antes, despues) => (antes === despues ? `${antes}` : `<span class="tachado"><s>${antes}</s><b>${despues}</b></span>`);

/** (3 · 2) / (4 · 9) con lo tachado a la vista: cada término que cambia lleva su nuevo valor. */
export function htmlTachado(item) {
  const t = tachado(item);
  const na = Math.abs(item.a[0]), nb = Math.abs(item.b[0]);
  const ta = Math.abs(t.a[0]), tb = Math.abs(t.b[0]);
  const arriba = `${tachar(na, ta)} · ${tachar(nb, tb)}`;
  const abajo = `${tachar(item.a[1], t.a[1])} · ${tachar(item.b[1], t.b[1])}`;
  const signo = (item.a[0] < 0) !== (item.b[0] < 0) ? MENOS : '';
  return `<span class="cuenta-frac">${signo}${htmlRaya(arriba, abajo)}</span>`;
}

// ─── Ayudas del ejercicio 4 ────────────────────────────────────────────────────

/** `2/3 : 4/5 = 2/3 · 5/4 = 10/12` */
export function htmlPorLaInversa(item) {
  const p = pasosDivide(item);
  return cuenta(item.a, ':', item.b, '=', item.a, '·', p.inversa, '=', p.producto);
}

/** `2/3 : 4/5 → (2 · 5) / (3 · 4) = 10/12` */
export function htmlEnCruz(item) {
  const p = pasosDivide(item);
  const raya = htmlRaya(`${p.cruz.arriba[0]} · ${p.cruz.arriba[1]}`, `${p.cruz.abajo[0]} · ${p.cruz.abajo[1]}`);
  return `<span class="cuenta-frac">${p.cruz.negativo ? MENOS : ''}${raya} = ${fr(p.producto)}</span>`;
}

// ─── Feedback (puros) ──────────────────────────────────────────────────────────

const signosDistintos = (item, tt) => ((item.a[0] < 0) !== (item.b[0] < 0)
  ? tt({ es: `Los signos son distintos, así que el resultado es negativo.`, en: `The signs are different, so the result is negative.` })
  : tt({ es: `Los signos son iguales, así que el resultado es positivo.`, en: `The signs are the same, so the result is positive.` }));

const esNeg = f => f[0] < 0;
const haySigno = item => esNeg(item.a) || esNeg(item.b);

/** Ejercicio 1. */
export function feedbackMultiplica(item, { tt }, error) {
  const a = F(item.a), b = F(item.b), bruto = a.multiplicar(b), buena = F(item.valor);
  const cuentaBuena = bruto.mismaForma(buena)
    ? cuenta(a, '·', b, '=', buena)
    : cuenta(a, '·', b, '=', bruto, '=', buena);
  const aviso = {
    'multiplica-en-cruz': { es: 'Has multiplicado en cruz. Al multiplicar fracciones se hace arriba por arriba y abajo por abajo.', en: 'You multiplied crosswise. To multiply fractions, multiply top by top and bottom by bottom.' },
    'multiplica-sumando-denominadores': { es: 'Los denominadores se multiplican, no se suman.', en: 'The denominators are multiplied, not added.' },
    'suma-en-vez-de-multiplicar': { es: 'Aquí hay que multiplicar, no sumar.', en: 'Here you have to multiply, not add.' },
    'natural-por-ambos': { es: 'El natural es una fracción con 1 abajo: multiplica solo el numerador y el denominador se queda.', en: 'The whole number is a fraction with 1 at the bottom: it multiplies only the numerator and the denominator stays the same.' },
    'producto-denominador-comun': { es: 'Los denominadores también se multiplican: no se quedan como están.', en: 'The denominators are also multiplied: they do not stay the same.' },
    'signo-perdido': { es: signosDistintos(item, (o) => o.es), en: signosDistintos(item, (o) => o.en) },
    [ERROR_SIN_SIMPLIFICAR]: { es: 'El valor está bien, pero falta simplificar.', en: 'The value is right, but you have to simplify.' },
  }[error];
  const frase = aviso ? `${tt(aviso)} ` : (haySigno(item) && error ? `${signosDistintos(item, tt)} ` : '');
  return `${frase}${cuentaBuena}.`;
}

/** Ejercicio 2. */
export function feedbackParte(item, { tt }, error) {
  const a = F(item.a), c = F(item.c), bruto = a.multiplicar(c), buena = F(item.valor);
  const trozos = item.a[0] * item.c[0], total = item.filas * item.columnas;
  const cuentaBuena = bruto.mismaForma(buena)
    ? cuenta(a, '·', c, '=', buena)
    : cuenta(a, '·', c, '=', bruto, '=', buena);
  const dibujo = tt({
    es: `En el dibujo: ${trozos} trozos de ${total}.`,
    en: `In the drawing: ${trozos} pieces out of ${total}.`,
  });
  const aviso = {
    [ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR]: { es: 'La fracción «de» otra fracción se multiplica, no se divide.', en: 'A fraction “of” another fraction is multiplied, not divided.' },
    'suma-en-vez-de-multiplicar': { es: 'La fracción «de» otra fracción se multiplica, no se suma.', en: 'A fraction “of” another fraction is multiplied, not added.' },
    'multiplica-en-cruz': { es: 'Se multiplica arriba por arriba y abajo por abajo, no en cruz.', en: 'Multiply top by top and bottom by bottom, not crosswise.' },
    'multiplica-sumando-denominadores': { es: 'Los denominadores se multiplican, no se suman.', en: 'The denominators are multiplied, not added.' },
    [ERROR_SIN_SIMPLIFICAR]: { es: 'El valor está bien, pero falta simplificar.', en: 'The value is right, but you have to simplify.' },
  }[error];
  return `${aviso ? `${tt(aviso)} ` : ''}${cuentaBuena}. ${dibujo}`;
}

/** Ejercicio 3, primer paso (la inversa). */
export function feedbackInversa(item, { tt }, error) {
  const f = F(item.f), inv = F(item.valor);
  const frase = tt({
    es: `La inversa de ${fr(f)} es ${fr(inv)}.`,
    en: `The reciprocal of ${fr(f)} is ${fr(inv)}.`,
  });
  const aviso = {
    'inversa-como-opuesta': { es: 'La opuesta cambia el signo; la inversa da la vuelta a la fracción y se queda con el mismo signo.', en: 'The opposite changes the sign; the reciprocal turns the fraction upside down and keeps the same sign.' },
    'inversa-del-natural': (() => {
      const comoFraccion = htmlFraccion(f, { conUno: true });
      return {
        es: `${fr(f)} es ${comoFraccion}, y a una fracción se le da la vuelta: su inversa no es ${comoFraccion}.`,
        en: `${fr(f)} is ${comoFraccion}, and you turn a fraction upside down: its reciprocal is not ${comoFraccion}.`,
      };
    })(),
    'signo-perdido': { es: 'La inversa de una fracción negativa también es negativa.', en: 'The reciprocal of a negative fraction is also negative.' },
  }[error];
  return `${aviso ? `${tt(aviso)} ` : ''}${frase}`;
}

/** Ejercicio 3, segundo paso (el producto con su inversa). */
export function feedbackProductoInversa(item, { tt }, error) {
  const f = F(item.f), inv = F(item.valor);
  const bruto = f.multiplicar(inv);
  const buena = cuenta(f, '·', inv, '=', bruto.mismaForma(fraccion(1, 1)) ? 1 : bruto, ...(bruto.mismaForma(fraccion(1, 1)) ? [] : ['=', 1]));
  const resto = tt({ es: 'Una fracción por su inversa siempre da 1.', en: 'A fraction times its reciprocal is always 1.' });
  const aviso = error === 'suma-en-vez-de-multiplicar'
    ? `${tt({ es: 'Aquí se multiplica, no se suma. ', en: 'Here you multiply, not add. ' })}`
    : '';
  return `${aviso}${buena}. ${resto}`;
}

/** Ejercicio 4. */
export function feedbackDivide(item, { tt }, error) {
  const a = F(item.a), b = F(item.b), buena = F(item.valor);
  const p = pasosDivide(item);
  const bruto = F(p.producto);
  const cadena = bruto.mismaForma(buena)
    ? cuenta(a, ':', b, '=', a, '·', p.inversa, '=', buena)
    : cuenta(a, ':', b, '=', a, '·', p.inversa, '=', bruto, '=', buena);
  const aviso = {
    'invierte-la-primera': { es: 'Se invierte la segunda fracción (la que divide), no la primera.', en: 'You turn the second fraction (the one you divide by) upside down, not the first.' },
    'no-invierte': { es: 'Para dividir hay que multiplicar por la inversa de la segunda; si no, es un producto.', en: 'To divide you multiply by the reciprocal of the second one; otherwise it is a product.' },
    'invierte-las-dos': { es: 'Solo se invierte la segunda fracción.', en: 'Only the second fraction is turned upside down.' },
    'signo-perdido': { es: signosDistintos(item, o => o.es), en: signosDistintos(item, o => o.en) },
    [ERROR_SIN_SIMPLIFICAR]: { es: 'El valor está bien, pero falta simplificar.', en: 'The value is right, but you have to simplify.' },
  }[error];
  return `${aviso ? `${tt(aviso)} ` : ''}${cadena}.`;
}

/** Ejercicio 5. */
export function feedbackPotencia(item, { tt }, error) {
  const base = F(item.base), buena = F(item.valor);
  const potencia = `<span class="cuenta-frac">(${fr(base)})${sup(item.exp)}</span>`;
  const veces = Array(item.exp).fill(base);
  const producto = [];
  veces.forEach((v, i) => { if (i) producto.push('·'); producto.push(v); });
  const cadena = `${potencia} = ${cuenta(...producto, '=', buena)}`;
  const aviso = {
    'eleva-solo-el-numerador': { es: 'El exponente afecta también al denominador.', en: 'The exponent also applies to the denominator.' },
    'base-por-exponente': { es: `El exponente no multiplica: ${item.exp} es el número de veces que se multiplica la fracción por sí misma.`, en: `The exponent does not multiply: ${item.exp} is the number of times the fraction is multiplied by itself.` },
    [ERROR_SIN_SIMPLIFICAR]: { es: 'El valor está bien, pero falta simplificar.', en: 'The value is right, but you have to simplify.' },
  }[error];
  return `${aviso ? `${tt(aviso)} ` : ''}${cadena}.`;
}

export { par, CONTEXTOS_PARTE };
