// Textos propios de «Productos y potencias con signo», siempre { es, en }. Los
// comunes (Comprobar, Siguiente…) llegan en `api.t`. Producto con «·», nunca «×»;
// el menos es U+2212; el hueco es «□».

import { fmt, fmtPar, html as htmlEntero } from '../_comun/enteros.js';
import {
  producto, posicionesNegativas, expresionProducto, absolutosProducto, valorPotencia, textoPotencia,
  textoBase, valorBase, baseDeItem, cuadrado,
} from './logica.js';

const plural = (n, uno, varios) => (n === 1 ? uno : varios);

export const TX = {
  ej1: {
    nombre: { es: 'Cuenta los negativos', en: 'Count the negatives' },
    detalle: { es: 'El signo de un producto de varios factores', en: 'The sign of a product of several factors' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca los factores <strong>negativos</strong> y escribe el resultado. Si hay un número <em>par</em> de negativos, el producto es positivo; si hay un número <em>impar</em>, es negativo.</p>
        <p>Por ejemplo: <strong>(−2) · 3 · (−1)</strong> tiene dos negativos (par), así que da <strong>6</strong>. Y si un factor es 0, el producto es 0.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap the <strong>negative</strong> factors and write the result. An <em>even</em> number (número par) of negatives gives a positive product; an <em>odd</em> number (número impar) gives a negative one.</p>
        <p>For example: <strong>(−2) · 3 · (−1)</strong> has two negatives (even), so it is <strong>6</strong>. And if a factor is 0, the product is 0.</p>`,
    },
    toca: { es: 'Toca los factores negativos.', en: 'Tap the negative factors.' },
    escribe: { es: 'Escribe el resultado.', en: 'Write the result.' },
    resultado: { es: 'Resultado', en: 'Result' },
    marcados: {
      es: k => `Has marcado ${k} ${plural(k, 'negativo', 'negativos')}`,
      en: k => `You have marked ${k} negative${k === 1 ? '' : 's'}`,
    },
    hay: {
      es: (k, par) => `Hay ${k} ${plural(k, 'factor negativo', 'factores negativos')} (${par ? 'par' : 'impar'})`,
      en: (k, par) => `There ${k === 1 ? 'is' : 'are'} ${k} negative factor${k === 1 ? '' : 's'} (${par ? 'even' : 'odd'})`,
    },
    asi_que: {
      es: positivo => (positivo ? 'así que el producto es positivo' : 'así que el producto es negativo'),
      en: positivo => (positivo ? 'so the product is positive' : 'so the product is negative'),
    },
    cero: { es: 'Un factor es 0, así que el producto es 0', en: 'One factor is 0, so the product is 0' },
    tu_conteo: {
      es: (mios, buenos) => `Tú has marcado ${mios}, pero hay ${buenos}`,
      en: (mios, buenos) => `You marked ${mios}, but there are ${buenos}`,
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
  },
  ej2: {
    nombre: { es: 'Potencia de base negativa', en: 'Power with a negative base' },
    detalle: { es: 'El signo lo decide el exponente', en: 'The exponent decides the sign' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En <strong>(−2)<sup>3</sup></strong> la base es −2 y se multiplica por sí misma 3 veces: (−2) · (−2) · (−2).</p>
        <p>Si el exponente es <strong>par</strong>, el resultado es <strong>positivo</strong>; si es <strong>impar</strong>, es <strong>negativo</strong>. Primero decide el signo y después calcula el valor.</p>`,
      en: `<h2>How it works</h2>
        <p>In <strong>(−2)<sup>3</sup></strong> the base is −2 and it is multiplied by itself 3 times: (−2) · (−2) · (−2).</p>
        <p>If the exponent is <strong>even</strong> (par), the result is <strong>positive</strong>; if it is <strong>odd</strong> (impar), it is <strong>negative</strong>. First decide the sign, then work out the value.</p>`,
    },
    signo: { es: '¿Qué signo tiene el resultado?', en: 'What is the sign of the result?' },
    positivo: { es: 'Positivo', en: 'Positive' },
    negativo: { es: 'Negativo', en: 'Negative' },
    valor: { es: 'Escribe el valor.', en: 'Write the value.' },
    campo: { es: 'Valor', en: 'Value' },
    par: {
      es: (exp, positivo) => `El exponente ${exp} es ${exp % 2 === 0 ? 'par' : 'impar'}: el resultado es ${positivo ? 'positivo' : 'negativo'}`,
      en: (exp, positivo) => `The exponent ${exp} is ${exp % 2 === 0 ? 'even' : 'odd'}: the result is ${positivo ? 'positive' : 'negative'}`,
    },
    signo_mal: {
      es: 'Con el exponente par el resultado es positivo; con el impar, negativo.',
      en: 'With an even exponent the result is positive; with an odd one, negative.',
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
  },
  ej3: {
    nombre: { es: '¿Cuál es la base?', en: 'What is the base?' },
    detalle: { es: '(−3)² frente a −3²', en: '(−3)² against −3²' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El exponente solo afecta a lo que tiene <strong>justo debajo</strong>: la base.</p>
        <p>En <strong>(−3)<sup>2</sup></strong> la base es −3: (−3) · (−3) = 9. En <strong>−3<sup>2</sup></strong> la base es 3 y el menos se queda fuera: −(3 · 3) = −9.</p>`,
      en: `<h2>How it works</h2>
        <p>The exponent only affects what is <strong>right below it</strong>: the base.</p>
        <p>In <strong>(−3)<sup>2</sup></strong> the base is −3: (−3) · (−3) = 9. In <strong>−3<sup>2</sup></strong> the base is 3 and the minus sign stays outside: −(3 · 3) = −9.</p>`,
    },
    pregunta: { es: '¿Cuál es la base?', en: 'What is the base?' },
    valor: { es: 'Ahora calcula el valor.', en: 'Now work out the value.' },
    campo: { es: 'Valor', en: 'Value' },
    base_es: {
      es: base => `La base es ${base}`,
      en: base => `The base is ${base}`,
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
    cuenta_a: {
      es: (b, exp, v) => `${b} multiplicado ${exp} veces por sí mismo da ${v}`,
      en: (b, exp, v) => `${b} multiplied by itself ${exp} times is ${v}`,
    },
    fuera: {
      es: 'El menos de delante no es de la base: se hace primero la potencia y después se le pone el menos',
      en: 'The minus sign in front is not part of the base: work out the power first, then put the minus sign',
    },
    dentro: {
      es: 'Se hace la potencia de la base entre paréntesis y después se cambia el signo del resultado',
      en: 'Work out the power of the base in brackets, then change the sign of the result',
    },
  },
  ej4: {
    nombre: { es: 'Cuadrados y raíces', en: 'Squares and roots' },
    detalle: { es: 'Qué enteros al cuadrado dan un número', en: 'Which integers squared give a number' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos enteros opuestos tienen el mismo cuadrado: 7<sup>2</sup> = 49 y (−7)<sup>2</sup> = 49. Si te preguntan qué enteros al cuadrado dan 49, marca <strong>los dos</strong>.</p>
        <p>El signo <strong>√</strong> pide solo el positivo: √49 = 7. Y √(−49) no existe: ningún entero al cuadrado da un número negativo.</p>`,
      en: `<h2>How it works</h2>
        <p>Two opposite integers have the same square: 7<sup>2</sup> = 49 and (−7)<sup>2</sup> = 49. If you are asked which integers squared give 49, tap <strong>both</strong>.</p>
        <p>The <strong>√</strong> sign asks only for the positive one: √49 = 7. And √(−49) does not exist: no integer squared gives a negative number.</p>`,
    },
    cuadrados: {
      es: n => `¿Qué enteros, al cuadrado, dan ${n}? Marca todos los que sirvan.`,
      en: n => `Which integers, squared, give ${n}? Tap all that work.`,
    },
    raiz: { es: 'Escribe el valor, o toca «No existe».', en: 'Write the value, or tap “Does not exist”.' },
    no_existe: { es: 'No existe', en: 'Does not exist' },
    campo: { es: 'Raíz', en: 'Root' },
    los_dos: {
      es: (r, n) => `Los dos enteros son ${r} y −${r}`,
      en: (r, n) => `The two integers are ${r} and −${r}`,
    },
    solo_uno: {
      es: (r, elegido) => `Falta el opuesto: ${elegido > 0 ? `−${r}` : `${r}`} también vale`,
      en: (r, elegido) => `One is missing: ${elegido > 0 ? `−${r}` : `${r}`} works too`,
    },
    no_sirve: {
      es: (v, c, n) => `${v} no sirve: ${c} no es ${n}`,
      en: (v, c, n) => `${v} does not work: ${c} is not ${n}`,
    },
    raiz_buena: {
      es: (r, n) => `La raíz cuadrada de ${n} es el entero positivo que al cuadrado da ${n}`,
      en: (r, n) => `The square root of ${n} is the positive integer that gives ${n} when squared`,
    },
    raiz_negativa: {
      es: r => `√ pide solo el positivo: la raíz es ${r}, no −${r}`,
      en: r => `√ asks only for the positive one: the root is ${r}, not −${r}`,
    },
    raiz_no_existe: {
      es: r => `Sí existe: ${r} · ${r} = ${r * r}`,
      en: r => `It does exist: ${r} · ${r} = ${r * r}`,
    },
    negativa_no_existe: {
      es: n => `√(−${n}) no existe: ningún entero al cuadrado da un número negativo`,
      en: n => `√(−${n}) does not exist: no integer squared gives a negative number`,
    },
    negativa_ejemplo: {
      es: r => `Por ejemplo, ${r}² = ${r * r} y (−${r})² = ${r * r}, ninguno da −${r * r}`,
      en: r => `For example, ${r}² = ${r * r} and (−${r})² = ${r * r}, neither gives −${r * r}`,
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
  },
  no_se_hacerlo: { es: 'No sé hacerlo', en: 'I don’t know how' },
};

// ─── «No lo sé»: la explicación de cada ejercicio (docs/no-lo-se.md) ───────────

const cuenta = html => `<span class="cuenta">${html}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const respuesta = (tt, html) => `<p>${tt({ es: 'La respuesta es', en: 'The answer is' })} ${html}.</p>`;

/** Ejercicio 1: el signo por la paridad de los negativos y el valor. */
export function explicaProducto(item, { tt }) {
  // El ejercicio pide dos cosas: tocar los negativos y escribir el resultado. La explicación dice
  // cuáles se tocan (también cuando hay un 0, que decide el resultado pero no quita los negativos).
  const p = producto(item);
  const cuentaBuena = cuenta(`${expresionProducto(item)} = ${fmt(p)}`);
  const negativos = posicionesNegativas(item).map(i => cuenta(fmtPar(item.factores[i])));
  const k = negativos.length;
  const lista = k < 2 ? negativos.join('') : `${negativos.slice(0, -1).join(', ')} ${tt({ es: 'y', en: 'and' })} ${negativos[k - 1]}`;
  const toca = k === 0
    ? tt({ es: 'No hay factores negativos: no se toca ninguno', en: 'There are no negative factors: do not tap any' })
    : k === 1
      ? tt({ es: `Se toca el único negativo, ${lista}`, en: `Tap the only negative, ${lista}` })
      : tt({ es: `Se tocan los negativos: ${lista}`, en: `Tap the negatives: ${lista}` });
  if (item.factores.includes(0)) return `${pasos([`${toca}.`, `${tt(TX.ej1.cero)}.`])}${respuesta(tt, cuentaBuena)}`;
  const par = k % 2 === 0;
  // En inglés, even y odd se aclaran (reglas de la unidad 3).
  const signo = k === 0
    ? tt({ es: '. Sin negativos, el producto es positivo', en: '. With no negatives, the product is positive' })
    : k === 1
      ? tt({ es: '. Hay 1, un número impar, así que el producto es negativo', en: '. There is 1, an odd (impar) number, so the product is negative' })
      : tt({
        es: `. Son ${k}, un número ${par ? 'par' : 'impar'}, así que el producto es ${par ? 'positivo' : 'negativo'}`,
        en: `. There are ${k}, an ${par ? 'even (par)' : 'odd (impar)'} number, so the product is ${par ? 'positive' : 'negative'}`,
      });
  return `${pasos([
    `${toca}${signo}.`,
    `${tt({ es: 'Se multiplican sin signo', en: 'Multiply without the signs' })}: ${cuenta(`${absolutosProducto(item)} = ${Math.abs(p)}`)}.`,
  ])}${respuesta(tt, cuentaBuena)}`;
}

/** Ejercicio 2: el signo por la paridad del exponente y el valor. */
export function explicaPotencia(item, { tt }) {
  const v = valorPotencia(item);
  const factores = Array(item.exp).fill(fmtPar(item.base)).join(' · ');
  const potencia = htmlEntero(textoPotencia(item.base, item.exp));
  return `${pasos([
    // Como TX.ej2.par, pero con even y odd aclarados en inglés.
    item.exp % 2 === 0
      ? tt({ es: `El exponente ${item.exp} es par: el resultado es positivo.`, en: `The exponent ${item.exp} is even (par): the result is positive.` })
      : tt({ es: `El exponente ${item.exp} es impar: el resultado es negativo.`, en: `The exponent ${item.exp} is odd (impar): the result is negative.` }),
    `${tt({ es: 'Se multiplica la base por sí misma', en: 'Multiply the base by itself' })}: ${cuenta(`${potencia} = ${factores} = ${fmt(v)}`)}.`,
  ])}${respuesta(tt, tt({
    // Las dos partes del ejercicio: el botón del signo y el valor.
    es: `«${TX.ej2[v > 0 ? 'positivo' : 'negativo'].es}» y el valor ${cuenta(fmt(v))}`,
    en: `“${TX.ej2[v > 0 ? 'positivo' : 'negativo'].en}” and the value ${cuenta(fmt(v))}`,
  }))}`;
}

/** Ejercicio 3: cuál es la base y el valor. */
export function explicaBase(item, { tt }) {
  // Revisión 192: el paso 1 dice POR QUÉ esa es la base, y el paso 2 enseña la potencia antes
  // del menos de fuera («−4² = −16» a secas se saltaba justo lo que hay que aprender).
  const v = valorBase(item);
  const b = baseDeItem(item);
  const potencia = `${fmtPar(b)}<sup>${item.exp}</sup>`;
  const veces = Array(item.exp).fill(fmtPar(b)).join(' · ');
  const pot = b ** item.exp;
  const B = cuenta(fmt(b));
  const paso1 = {
    a: { es: `El exponente afecta a todo el paréntesis: la base es ${B}`, en: `The exponent affects the whole bracket: the base is ${B}` },
    b: { es: `El exponente solo afecta al ${B}, no al menos: la base es ${B}`, en: `The exponent only affects the ${B}, not the minus sign: the base is ${B}` },
    c: { es: `El exponente afecta al paréntesis, no al menos de fuera: la base es ${B}`, en: `The exponent affects the bracket, not the minus sign outside: the base is ${B}` },
  }[item.tipo];
  const laPotencia = cuenta(`${potencia} = ${veces} = ${fmt(pot)}`);
  const todo = cuenta(`${htmlEntero(textoBase(item))} = ${fmt(v)}`);
  const paso2 = item.tipo === 'a'
    ? `${laPotencia}.`
    : tt({
      es: `Primero la potencia y después el menos de fuera, que cambia el signo: ${laPotencia}, así que ${todo}.`,
      en: `First the power, then the minus sign outside, which changes the sign: ${laPotencia}, so ${todo}.`,
    });
  return `${pasos([`${tt(paso1)}.`, paso2])}${respuesta(tt, tt({
    es: `la base ${cuenta(fmt(b))} y el valor ${cuenta(fmt(v))}`,
    en: `the base ${cuenta(fmt(b))} and the value ${cuenta(fmt(v))}`,
  }))}`;
}

/** Ejercicio 4: los dos enteros del cuadrado, la raíz o «no existe». */
export function explicaRaiz(item, { tt }) {
  const n = cuadrado(item);
  const r = item.r;
  if (item.tipo === 'cuadrados') {
    return `<p>${tt(TX.ej4.los_dos)(r)}: ${cuenta(`${r} · ${r} = ${n}`)} ${tt({ es: 'y', en: 'and' })} ${cuenta(`(−${r}) · (−${r}) = ${n}`)}.</p>${respuesta(tt, tt({
      es: `${cuenta(String(r))} y ${cuenta(`−${r}`)}: se marcan los dos`,
      en: `${cuenta(String(r))} and ${cuenta(`−${r}`)}: tap both`,
    }))}`;
  }
  if (item.tipo === 'negativa') {
    // El ejemplo, con dos puntos y no con una coma entre dos frases; el botón, entre comillas.
    return `<p>${tt(TX.ej4.negativa_no_existe)(n)}. ${tt({
      es: `Por ejemplo, ${r}<sup>2</sup> = ${n} y (−${r})<sup>2</sup> = ${n}: ninguno da −${n}`,
      en: `For example, ${r}<sup>2</sup> = ${n} and (−${r})<sup>2</sup> = ${n}: neither gives −${n}`,
    })}.</p>${respuesta(tt, tt({ es: `«${TX.ej4.no_existe.es}»`, en: `“${TX.ej4.no_existe.en}”` }))}`;
  }
  return `<p>${tt(TX.ej4.raiz_buena)(r, n)}: ${cuenta(`${r} · ${r} = ${n}`)}.</p>${respuesta(tt, cuenta(`√${n} = ${r}`))}`;
}
