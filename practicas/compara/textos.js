// Práctica «Compara y ordena» (PU2, tarea 102): textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`. Un texto con números es
// una función en cada idioma; las fracciones llegan ya pintadas (`htmlFraccion`) y los
// símbolos < y > como `&lt;` y `&gt;` (son HTML).

import { fraccion, htmlCuenta, htmlFraccion } from '../_comun/fracciones.js';

const f = (n, d) => htmlFraccion(fraccion(n, d), { compacta: true });
const cuenta = (...partes) => htmlCuenta(partes.map(p => (Array.isArray(p) ? fraccion(p[0], p[1]) : p)), { compacta: true });

export const TX = {
  comp: {
    nombre: { es: 'Mayor o menor', en: 'Greater or less' },
    detalle: { es: 'Elige < o > entre dos fracciones', en: 'Choose < or > between two fractions' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Mismo denominador:</strong> es mayor la que tiene el numerador mayor. ${cuenta([5, 8], '>', [3, 8])}</p>
        <p><strong>Mismo numerador:</strong> cuantas más partes tiene el todo, más pequeña es cada parte. ${cuenta([3, 5], '>', [3, 7])}</p>
        <p><strong>Si no, denominador común:</strong> ${cuenta([2, 3], '=', [8, 12])} y ${cuenta([3, 4], '=', [9, 12])}, así que ${cuenta([2, 3], '<', [3, 4])}</p>
        <p><strong>Negativas:</strong> toda negativa es menor que cualquier positiva; entre dos negativas, es menor la que está más lejos del 0. ${cuenta([-3, 4], '<', [-2, 3])}</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Same denominator:</strong> the one with the bigger numerator is greater. ${cuenta([5, 8], '>', [3, 8])}</p>
        <p><strong>Same numerator:</strong> the more parts the whole has, the smaller each part is. ${cuenta([3, 5], '>', [3, 7])}</p>
        <p><strong>Otherwise, a common denominator:</strong> ${cuenta([2, 3], '=', [8, 12])} and ${cuenta([3, 4], '=', [9, 12])}, so ${cuenta([2, 3], '<', [3, 4])}</p>
        <p><strong>Negatives:</strong> every negative fraction is less than any positive one; between two negatives, the one farther from 0 is less. ${cuenta([-3, 4], '<', [-2, 3])}</p>`,
    },
    pregunta: { es: '¿Qué signo va en el hueco?', en: 'Which sign goes in the gap?' },
    // Los métodos, con los números del ítem. A y B son las fracciones ya pintadas; s, el signo entre ellas.
    metodo: {
      mixto: {
        es: (neg, pos, A, s, B) => `${neg} es negativa y ${pos} es positiva: toda fracción negativa es menor que cualquier positiva, así que ${A} ${s} ${B}.`,
        en: (neg, pos, A, s, B) => `${neg} is negative and ${pos} is positive: every negative fraction is less than any positive one, so ${A} ${s} ${B}.`,
      },
      negativas: {
        es: (a, s2, b, A, s, B, den) => `Las dos son negativas: es menor la que está más lejos del 0. Sin el signo, ${a} ${s2} ${b}${den ? ` (con denominador ${den})` : ''}, así que ${A} ${s} ${B}.`,
        en: (a, s2, b, A, s, B, den) => `Both are negative: the one farther from 0 is less. Without the sign, ${a} ${s2} ${b}${den ? ` (with denominator ${den})` : ''}, so ${A} ${s} ${B}.`,
      },
      mismoDen: {
        es: (na, s, nb, A, B) => `Mismo denominador: se comparan los numeradores. ${na} ${s} ${nb}, así que ${A} ${s} ${B}.`,
        en: (na, s, nb, A, B) => `Same denominator: compare the numerators. ${na} ${s} ${nb}, so ${A} ${s} ${B}.`,
      },
      mismoNum: {
        es: (da, s2, db, A, s, B) => `Mismo numerador: cuantas más partes tiene el todo, más pequeña es cada una. ${da} ${s2} ${db}, así que ${A} ${s} ${B}.`,
        en: (da, s2, db, A, s, B) => `Same numerator: the more parts the whole has, the smaller each part is. ${da} ${s2} ${db}, so ${A} ${s} ${B}.`,
      },
      distinto: {
        es: (A, A2, B, B2, m, na, s, nb) => `Con denominador común ${m}: ${A} = ${A2} y ${B} = ${B2}. Como ${na} ${s} ${nb}, ${A} ${s} ${B}.`,
        en: (A, A2, B, B2, m, na, s, nb) => `With common denominator ${m}: ${A} = ${A2} and ${B} = ${B2}. Since ${na} ${s} ${nb}, ${A} ${s} ${B}.`,
      },
    },
    errores: {
      'ignora-el-signo': { es: 'Has comparado sin fijarte en el signo.', en: 'You compared without looking at the sign.' },
      'compara-solo-numeradores': { es: 'Has mirado solo los numeradores.', en: 'You looked only at the numerators.' },
      'compara-solo-denominadores': { es: 'Has creído que el denominador mayor da la fracción mayor.', en: 'You thought the bigger denominator gives the bigger fraction.' },
      'compara-mal': { es: 'Esa no es la comparación correcta.', en: 'That is not the right comparison.' },
    },
  },
  cajas: {
    nombre: { es: 'Frente a 1 y a un medio', en: 'Against 1 and a half' },
    detalle: { es: 'Coloca cada fracción en su caja', en: 'Put each fraction in its box' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para comparar con <strong>${f(1, 2)}</strong>, dobla el numerador: ${cuenta([4, 9], '<', [1, 2])} porque 4 · 2 = 8 es menor que 9; y ${cuenta([5, 9], '>', [1, 2])} porque 5 · 2 = 10 es mayor que 9.</p>
        <p>Para comparar con <strong>1</strong>, mira si el numerador es mayor o menor que el denominador: ${cuenta([7, 6], '>', 1)} y ${cuenta([5, 6], '<', 1)}</p>
        <p>Toca una fracción y después la caja donde va. Cuando estén todas colocadas, pulsa «Comprobar».</p>`,
      en: `<h2>How it works</h2>
        <p>To compare with <strong>${f(1, 2)}</strong>, double the numerator: ${cuenta([4, 9], '<', [1, 2])} because 4 · 2 = 8 is less than 9; and ${cuenta([5, 9], '>', [1, 2])} because 5 · 2 = 10 is greater than 9.</p>
        <p>To compare with <strong>1</strong>, check whether the numerator is greater or less than the denominator: ${cuenta([7, 6], '>', 1)} and ${cuenta([5, 6], '<', 1)}</p>
        <p>Tap a fraction and then the box where it goes. When all of them are placed, press “Check”.</p>`,
    },
    pregunta: { es: 'Coloca cada fracción en su caja', en: 'Put each fraction in its box' },
    cajas: {
      menor: { es: `Menor que ${f(1, 2)}`, en: `Less than ${f(1, 2)}` },
      entre: { es: `Entre ${f(1, 2)} y 1`, en: `Between ${f(1, 2)} and 1` },
      mayor: { es: 'Mayor que 1', en: 'Greater than 1' },
    },
    cajaTexto: {
      menor: { es: 'menor que 1/2', en: 'less than 1/2' },
      entre: { es: 'entre 1/2 y 1', en: 'between 1/2 and 1' },
      mayor: { es: 'mayor que 1', en: 'greater than 1' },
    },
    // Una línea por fracción mal colocada, con sus números.
    razon: {
      menor: {
        es: (F, n, d) => `${F} es menor que ${f(1, 2)}: ${n} · 2 = ${2 * n} es menor que ${d}.`,
        en: (F, n, d) => `${F} is less than ${f(1, 2)}: ${n} · 2 = ${2 * n} is less than ${d}.`,
      },
      entre: {
        es: (F, n, d) => `${F} está entre ${f(1, 2)} y 1: ${n} · 2 = ${2 * n} es mayor que ${d}, pero ${n} es menor que ${d}.`,
        en: (F, n, d) => `${F} is between ${f(1, 2)} and 1: ${n} · 2 = ${2 * n} is greater than ${d}, but ${n} is less than ${d}.`,
      },
      mayor: {
        es: (F, n, d) => `${F} es mayor que 1: ${n} es mayor que ${d}.`,
        en: (F, n, d) => `${F} is greater than 1: ${n} is greater than ${d}.`,
      },
    },
    solo_num: {
      es: 'Ojo: tener el numerador mayor que el de ½ no basta; hay que doblar el numerador y mirar el denominador.',
      en: 'Careful: having a numerator bigger than the numerator of ½ is not enough; double the numerator and look at the denominator.',
    },
    bien: { es: 'Todas están en su caja.', en: 'They are all in the right box.' },
  },
  orden: {
    nombre: { es: 'Ordena', en: 'Put in order' },
    detalle: { es: 'Ordena las fracciones de menor a mayor o de mayor a menor', en: 'Put the fractions in order, least to greatest or greatest to least' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Reduce todas a <strong>común denominador</strong> y compara los numeradores. Por ejemplo, con 12: ${cuenta([3, 4], '=', [9, 12])}, ${cuenta([5, 6], '=', [10, 12])}, ${cuenta([2, 3], '=', [8, 12])} y ${f(7, 12)}; el orden de menor a mayor es ${cuenta([7, 12], '<', [2, 3], '<', [3, 4], '<', [5, 6])}</p>
        <p>Toca las fracciones en el orden que te pide el enunciado. Con negativas: la menor es la que está más lejos del 0.</p>`,
      en: `<h2>How it works</h2>
        <p>Write them all with a <strong>common denominator</strong> and compare the numerators. For example, with 12: ${cuenta([3, 4], '=', [9, 12])}, ${cuenta([5, 6], '=', [10, 12])}, ${cuenta([2, 3], '=', [8, 12])} and ${f(7, 12)}; from least to greatest the order is ${cuenta([7, 12], '<', [2, 3], '<', [3, 4], '<', [5, 6])}</p>
        <p>Tap the fractions in the order the question asks for. With negatives: the least one is the one farthest from 0.</p>`,
    },
    pregunta: {
      es: creciente => (creciente ? 'Ordénalas de <strong>menor a mayor</strong>' : 'Ordénalas de <strong>mayor a menor</strong>'),
      en: creciente => (creciente ? 'Put them in order from <strong>least to greatest</strong>' : 'Put them in order from <strong>greatest to least</strong>'),
    },
    tuOrden: { es: 'Tu orden', en: 'Your order' },
    comun: {
      es: (m, lista) => `Con denominador común ${m}: ${lista}.`,
      en: (m, lista) => `With common denominator ${m}: ${lista}.`,
    },
    resultado: {
      es: cadena => `El orden es ${cadena}.`,
      en: cadena => `The order is ${cadena}.`,
    },
    negativas: {
      es: 'Las negativas son menores que 0; entre dos negativas, es menor la que está más lejos del 0.',
      en: 'Negatives are less than 0; between two negatives, the one farther from 0 is less.',
    },
    errores: {
      'ordena-por-denominadores': { es: 'Parece que has ordenado por los denominadores.', en: 'It looks like you ordered by the denominators.' },
      'ordena-por-numeradores': { es: 'Parece que has ordenado por los numeradores.', en: 'It looks like you ordered by the numerators.' },
      'ignora-el-signo': { es: 'Parece que has ordenado sin fijarte en el signo.', en: 'It looks like you ordered without looking at the sign.' },
      'orden-al-reves': { es: 'Has puesto el orden al revés.', en: 'You put the order the wrong way round.' },
      'orden-mal': { es: 'Ese orden no es el correcto.', en: 'That order is not correct.' },
    },
  },
  recta: {
    nombre: { es: 'En la recta', en: 'On the number line' },
    detalle: { es: 'Toca la marca de la fracción pedida', en: 'Tap the mark of the fraction you are asked for' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Entre dos números enteros, la recta está dividida en partes iguales. Cuenta los <strong>huecos</strong>, no las marcas, a partir del 0. Por ejemplo, de 0 a 1 en 4 partes, ${f(3, 4)} está a 3 huecos del 0, y ${f(5, 4)} pasa del 1 un hueco más.</p>
        <p>Las negativas se cuentan hacia la izquierda: ${f(-3, 4)} está a 3 huecos a la izquierda del 0.</p>
        <p>Toca una marca y pulsa «Comprobar».</p>`,
      en: `<h2>How it works</h2>
        <p>Between two whole numbers, the number line is divided into equal parts. Count the <strong>gaps</strong>, not the marks, starting from 0. For example, from 0 to 1 in 4 parts, ${f(3, 4)} is 3 gaps from 0, and ${f(5, 4)} goes one gap past 1.</p>
        <p>Negatives are counted to the left: ${f(-3, 4)} is 3 gaps to the left of 0.</p>
        <p>Tap a mark and press “Check”.</p>`,
    },
    pregunta: { es: F => `Toca el punto de la fracción ${F}`, en: F => `Tap the point for the fraction ${F}` },
    nombreRecta: { es: 'Recta numérica', en: 'Number line' },
    bien: {
      es: (F, den, n, negativa) => `Cada hueco mide ${f(1, den)}. ${F} está a ${n} ${n === 1 ? 'hueco' : 'huecos'} ${negativa ? 'a la izquierda del 0' : 'del 0'}.`,
      en: (F, den, n, negativa) => `Each gap is ${f(1, den)}. ${F} is ${n} ${n === 1 ? 'gap' : 'gaps'} ${negativa ? 'to the left of 0' : 'from 0'}.`,
    },
    errores: {
      'contar-marcas': { es: () => 'Has contado marcas, no huecos: el 0 no cuenta como hueco.', en: () => 'You counted marks, not gaps: 0 does not count as a gap.' },
      'toca-el-simetrico': { es: F => `Has tocado el simétrico: ${F} es negativa y va a la izquierda del 0.`, en: F => `You tapped the opposite point: ${F} is negative and goes to the left of 0.` },
      'contar-desde-menos-uno': { es: () => 'Has contado desde el −1: hay que contar desde el 0 hacia la izquierda.', en: () => 'You counted from −1: count from 0 to the left.' },
      'marca-mal': { es: T => `Has tocado ${T}, que no es la fracción pedida.`, en: T => `You tapped ${T}, which is not the fraction asked for.` },
    },
  },
};
