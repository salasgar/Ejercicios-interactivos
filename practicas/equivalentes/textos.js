// Práctica «Fracciones equivalentes»: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente, Sí, No…) llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 4): la fracción con raya
// (`htmlFraccion`), nunca «3/5» con barra; producto con «·», nunca «×»; inglés sencillo; el
// feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM; ni decimales, ni mixtos, ni letras.

import { htmlFraccion } from '../_comun/fracciones.js';

const h = (num, den) => htmlFraccion({ num, den }, { compacta: true });
const hf = f => h(f.num, f.den);
/** Fracciones del ítem 4 cuyo denominador cambia al pasar al m.c.m. [fracción, equivalente]. */
const cambian = item => [[item.a, item.ea], [item.b, item.eb]].filter(([x]) => x.den !== item.mcm);
/** Fracciones cuyo numerador escrito no es el bueno: [fracción, equivalente, lo escrito]. */
const malos = (item, { n1, n2 }) => [[item.a, item.ea, n1], [item.b, item.eb, n2]].filter(([, e, n]) => n !== e.num);
/** Una cuenta corta que no se parte. */
const c = t => `<span class="cuenta">${t}</span>`;

export const TX = {
  ej1: {
    nombre: { es: 'El término que falta', en: 'The missing number' },
    detalle: { es: 'Escribe el número que falta para que sean equivalentes', en: 'Write the number that makes them equivalent' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos fracciones son <strong>equivalentes</strong> si valen lo mismo. Para pasar de una a otra se multiplica
        (o se divide) <strong>arriba y abajo por el mismo número</strong>.</p>
        <p>Ejemplo: ${h(2, 3)} = ${h(8, 12)}, porque ${c('3 · 4 = 12')} y por eso arriba también ${c('2 · 4 = 8')}.</p>
        <p>Escribe el número que falta (el hueco) y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Two fractions are <strong>equivalent</strong> if they have the same value. To go from one to the other you multiply
        (or divide) <strong>top and bottom by the same number</strong>.</p>
        <p>Example: ${h(2, 3)} = ${h(8, 12)}, because ${c('3 · 4 = 12')} so the top is also ${c('2 · 4 = 8')}.</p>
        <p>Write the missing number (the gap) and press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: 'Escribe el número que falta.', en: 'Write the missing number.' },
    correcto: {
      es: item => (item.direccion === 'ampliar'
        ? `Correcto: se multiplica arriba y abajo por ${item.k}, así que ${c(`${item.izq.num} · ${item.k} = ${item.izq.num * item.k}`)} y ${c(`${item.izq.den} · ${item.k} = ${item.izq.den * item.k}`)}.`
        : `Correcto: se divide arriba y abajo entre ${item.k}, así que ${c(`${item.izq.num} : ${item.k} = ${item.izq.num / item.k}`)} y ${c(`${item.izq.den} : ${item.k} = ${item.izq.den / item.k}`)}.`),
      en: item => (item.direccion === 'ampliar'
        ? `Correct: multiply top and bottom by ${item.k}, so ${c(`${item.izq.num} · ${item.k} = ${item.izq.num * item.k}`)} and ${c(`${item.izq.den} · ${item.k} = ${item.izq.den * item.k}`)}.`
        : `Correct: divide top and bottom by ${item.k}, so ${c(`${item.izq.num} : ${item.k} = ${item.izq.num / item.k}`)} and ${c(`${item.izq.den} : ${item.k} = ${item.izq.den / item.k}`)}.`),
    },
    solucion: {
      es: item => {
        const conocido = item.hueco === 'num' ? 'den' : 'num';
        const [de, a] = [item.izq[conocido], item.der[conocido]];
        const op = item.direccion === 'ampliar' ? `${de} · ${item.k} = ${a}` : `${de} : ${item.k} = ${a}`;
        const hecho = item.direccion === 'ampliar' ? 'se multiplica' : 'se divide';
        const prep = item.direccion === 'ampliar' ? 'por' : 'entre';
        const total = item.direccion === 'ampliar' ? `${item.izq[item.hueco]} · ${item.k}` : `${item.izq[item.hueco]} : ${item.k}`;
        return `El otro término pasa de ${de} a ${a}: ${c(op)}. Así que ${hecho} ${prep} ${item.k} arriba y abajo, y el hueco es ${c(`${total} = ${item.respuesta}`)}.`;
      },
      en: item => {
        const conocido = item.hueco === 'num' ? 'den' : 'num';
        const [de, a] = [item.izq[conocido], item.der[conocido]];
        const op = item.direccion === 'ampliar' ? `${de} · ${item.k} = ${a}` : `${de} : ${item.k} = ${a}`;
        const hecho = item.direccion === 'ampliar' ? 'multiply' : 'divide';
        const prep = item.direccion === 'ampliar' ? 'by' : 'by';
        const total = item.direccion === 'ampliar' ? `${item.izq[item.hueco]} · ${item.k}` : `${item.izq[item.hueco]} : ${item.k}`;
        return `The other term goes from ${de} to ${a}: ${c(op)}. So ${hecho} ${prep} ${item.k} top and bottom, and the gap is ${c(`${total} = ${item.respuesta}`)}.`;
      },
    },
    por_que: {
      'suma-la-diferencia': {
        es: (item, v) => {
          const base = item.izq[item.hueco], cantidad = Math.abs(v - base), suma = item.direccion === 'ampliar';
          return `Has ${suma ? 'sumado' : 'restado'} la misma cantidad a los dos términos (${c(`${base} ${suma ? '+' : '−'} ${cantidad} = ${v}`)}), pero lo que hay que hacer es ${suma ? 'multiplicar' : 'dividir'}: así cambia el aspecto sin cambiar el valor. `;
        },
        en: (item, v) => {
          const base = item.izq[item.hueco], cantidad = Math.abs(v - base), suma = item.direccion === 'ampliar';
          return `You ${suma ? 'added the same amount to' : 'subtracted the same amount from'} both terms (${c(`${base} ${suma ? '+' : '−'} ${cantidad} = ${v}`)}), but you must ${suma ? 'multiply' : 'divide'}: that changes the look without changing the value. `;
        },
      },
      'no-cambia-el-termino': {
        es: (item, v) => `Has dejado el ${v} como estaba, pero este término también cambia: arriba y abajo se hace lo mismo. `,
        en: (item, v) => `You left ${v} as it was, but this term changes too: you do the same to top and bottom. `,
      },
      'otra-respuesta': {
        es: (item, v) => `${v} no es: `,
        en: (item, v) => `${v} is not it: `,
      },
    },
  },

  ej2: {
    nombre: { es: '¿Son equivalentes?', en: 'Are they equivalent?' },
    detalle: { es: 'Decide si dos fracciones valen lo mismo', en: 'Decide if two fractions have the same value' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos fracciones son equivalentes si una sale de la otra multiplicando (o dividiendo) <strong>arriba y abajo por el mismo número</strong>.
        Una forma rápida de comprobarlo: los <strong>productos cruzados</strong> tienen que ser iguales.</p>
        <p>Ejemplo: ${h(3, 4)} y ${h(9, 12)}: ${c('3 · 12 = 36')} y ${c('4 · 9 = 36')}. Son iguales, así que son equivalentes.</p>
        <p>Cuidado: <strong>sumar</strong> el mismo número arriba y abajo no da una fracción equivalente.</p>`,
      en: `<h2>How it works</h2>
        <p>Two fractions are equivalent if one comes from the other by multiplying (or dividing) <strong>top and bottom by the same number</strong>.
        A quick check: the <strong>cross products</strong> must be equal.</p>
        <p>Example: ${h(3, 4)} and ${h(9, 12)}: ${c('3 · 12 = 36')} and ${c('4 · 9 = 36')}. They are equal, so the fractions are equivalent.</p>
        <p>Careful: <strong>adding</strong> the same number to top and bottom does not give an equivalent fraction.</p>`,
    },
    instruccion: { es: '¿Son equivalentes estas dos fracciones?', en: 'Are these two fractions equivalent?' },
    cruzados: {
      es: (item, [x, y]) => `Productos cruzados: ${c(`${item.a.num} · ${item.b.den} = ${x}`)} y ${c(`${item.a.den} · ${item.b.num} = ${y}`)}. ${x === y ? 'Son iguales: las fracciones son equivalentes.' : 'Son distintos: las fracciones no son equivalentes.'}`,
      en: (item, [x, y]) => `Cross products: ${c(`${item.a.num} · ${item.b.den} = ${x}`)} and ${c(`${item.a.den} · ${item.b.num} = ${y}`)}. ${x === y ? 'They are equal: the fractions are equivalent.' : 'They are different: the fractions are not equivalent.'}`,
    },
    por_que: {
      'suma-el-mismo-numero': {
        es: item => `Parece que a las dos les pasa lo mismo, pero ${hf(item.a)} y ${hf(item.b)} no salen una de la otra multiplicando: sumar el mismo número no vale. `,
        en: item => `It looks like the same thing happened to both, but ${hf(item.a)} and ${hf(item.b)} do not come from each other by multiplying: adding the same number does not work. `,
      },
      'cambia-solo-un-termino': {
        es: item => `Solo ha cambiado un término (${hf(item.a)} y ${hf(item.b)}): arriba y abajo se multiplican por el mismo número. `,
        en: item => `Only one term changed (${hf(item.a)} and ${hf(item.b)}): top and bottom are multiplied by the same number. `,
      },
      'mismo-numerador': {
        es: item => `Tener el mismo numerador no basta: ${hf(item.a)} y ${hf(item.b)} tienen partes de distinto tamaño. `,
        en: item => `The same numerator is not enough: ${hf(item.a)} and ${hf(item.b)} have parts of different size. `,
      },
      'no-ve-el-factor': {
        es: item => `Sí son equivalentes: ${hf(item.a)} y ${hf(item.b)} valen lo mismo (las dos se simplifican a la misma fracción). `,
        en: item => `They are equivalent: ${hf(item.a)} and ${hf(item.b)} have the same value (both simplify to the same fraction). `,
      },
    },
  },

  ej3: {
    nombre: { es: 'Equipos', en: 'Teams' },
    detalle: { es: 'Reparte las fracciones equivalentes en cajas', en: 'Sort the equivalent fractions into boxes' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cada caja es un <strong>equipo</strong>: todas las fracciones de una caja tienen que ser <strong>equivalentes</strong> entre sí
        y dos cajas no pueden tener el mismo valor.</p>
        <p>Toca una tarjeta y después una caja (o arrástrala). Para sacarla de una caja, llévala otra vez abajo.
        Cuando estén todas colocadas, pulsa <strong>Comprobar</strong>.</p>
        <p>Ejemplo: ${h(1, 2)}, ${h(2, 4)} y ${h(3, 6)} son del mismo equipo; ${h(2, 3)} es de otro.</p>`,
      en: `<h2>How it works</h2>
        <p>Each box is a <strong>team</strong>: all the fractions in a box must be <strong>equivalent</strong> to each other
        and two boxes cannot have the same value.</p>
        <p>Tap a card and then a box (or drag it). To take it out of a box, bring it back down.
        When all the cards are placed, press <strong>Check</strong>.</p>
        <p>Example: ${h(1, 2)}, ${h(2, 4)} and ${h(3, 6)} are in the same team; ${h(2, 3)} is in another.</p>`,
    },
    instruccion: {
      es: item => `Reparte las ${item.tarjetas.length} tarjetas en ${item.cajas} cajas: en cada caja, fracciones equivalentes.`,
      en: item => `Sort the ${item.tarjetas.length} cards into ${item.cajas} boxes: in each box, equivalent fractions.`,
    },
    caja: { es: n => `Caja ${n}`, en: n => `Box ${n}` },
    bandeja: { es: 'Tarjetas', en: 'Cards' },
    correcto: { es: 'Correcto: en cada caja todas valen lo mismo y las cajas son distintas.', en: 'Correct: in each box all the fractions have the same value and the boxes are different.' },
    solucion: {
      es: item => `Reparto correcto: ${[...new Set(item.tarjetas.map(t => t.grupo))].map(g => item.tarjetas.filter(t => t.grupo === g).map(t => h(t.num, t.den)).join(', ')).join('; ')}.`,
      en: item => `Correct sorting: ${[...new Set(item.tarjetas.map(t => t.grupo))].map(g => item.tarjetas.filter(t => t.grupo === g).map(t => h(t.num, t.den)).join(', ')).join('; ')}.`,
    },
    por_que: {
      'mezcla-valores': {
        es: tarjetas => `Hay fracciones en una caja que no son equivalentes a las demás: ${tarjetas.map(t => h(t.num, t.den)).join(', ')}. `,
        en: tarjetas => `Some fractions in a box are not equivalent to the others: ${tarjetas.map(t => h(t.num, t.den)).join(', ')}. `,
      },
      'valor-repetido-en-dos-cajas': {
        es: () => 'Dos cajas tienen fracciones que valen lo mismo: tienen que estar juntas en una sola. ',
        en: () => 'Two boxes have fractions with the same value: they must be together in one box. ',
      },
      'caja-vacia': {
        es: () => 'Hay una caja vacía: cada caja tiene su valor. ',
        en: () => 'A box is empty: each box has its own value. ',
      },
    },
  },

  ej4: {
    nombre: { es: 'Común denominador', en: 'Common denominator' },
    detalle: { es: 'Busca el m.c.m. y escribe las dos fracciones equivalentes', en: 'Find the LCM and write the two equivalent fractions' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para que dos fracciones tengan el mismo denominador, buscamos el <strong>m.c.m.</strong> (el menor múltiplo común) de los dos denominadores.
        Después ampliamos cada fracción hasta ese denominador.</p>
        <p>Ejemplo: ${h(3, 4)} y ${h(1, 10)}. El m.c.m. de 4 y 10 es 20. ${c('4 · 5 = 20')} y ${c('10 · 2 = 20')}, así que
        ${h(3, 4)} = ${h(15, 20)} y ${h(1, 10)} = ${h(2, 20)}.</p>
        <p>Hay dos pasos: primero el denominador común, después los numeradores.</p>`,
      en: `<h2>How it works</h2>
        <p>To give two fractions the same denominator, find the <strong>LCM</strong> (lowest common multiple) of the two denominators.
        Then enlarge each fraction to that denominator.</p>
        <p>Example: ${h(3, 4)} and ${h(1, 10)}. The LCM of 4 and 10 is 20. ${c('4 · 5 = 20')} and ${c('10 · 2 = 20')}, so
        ${h(3, 4)} = ${h(15, 20)} and ${h(1, 10)} = ${h(2, 20)}.</p>
        <p>There are two steps: first the common denominator, then the numerators.</p>`,
    },
    paso1: {
      es: 'Paso 1: escribe el <strong>menor</strong> denominador común (el m.c.m. de los denominadores).',
      en: 'Step 1: write the <strong>smallest</strong> common denominator (the LCM of the denominators).',
    },
    paso2: {
      es: item => `Paso 2: pon las dos fracciones con denominador ${item.mcm}. Escribe los numeradores.`,
      en: item => `Step 2: write both fractions with denominator ${item.mcm}. Write the numerators.`,
    },
    correcto: {
      es: item => `Correcto: el m.c.m. de ${item.a.den} y ${item.b.den} es ${item.mcm}, y ${c(`${item.a.den} · ${item.mcm / item.a.den} = ${item.mcm}`)}, ${c(`${item.b.den} · ${item.mcm / item.b.den} = ${item.mcm}`)}: ${hf(item.a)} = ${hf(item.ea)} y ${hf(item.b)} = ${hf(item.eb)}.`,
      en: item => `Correct: the LCM of ${item.a.den} and ${item.b.den} is ${item.mcm}, and ${c(`${item.a.den} · ${item.mcm / item.a.den} = ${item.mcm}`)}, ${c(`${item.b.den} · ${item.mcm / item.b.den} = ${item.mcm}`)}: ${hf(item.a)} = ${hf(item.ea)} and ${hf(item.b)} = ${hf(item.eb)}.`,
    },
    solucion1: {
      es: item => `El m.c.m. de ${item.a.den} y ${item.b.den} es ${item.mcm}: es el menor número que está en las tablas de los dos.`,
      en: item => `The LCM of ${item.a.den} and ${item.b.den} is ${item.mcm}: it is the smallest number in both times tables.`,
    },
    solucion2: {
      es: item => `Con denominador ${item.mcm}: ${c(`${item.a.den} · ${item.mcm / item.a.den} = ${item.mcm}`)}, así que arriba ${c(`${item.a.num} · ${item.mcm / item.a.den} = ${item.ea.num}`)}; y ${c(`${item.b.den} · ${item.mcm / item.b.den} = ${item.mcm}`)}, así que arriba ${c(`${item.b.num} · ${item.mcm / item.b.den} = ${item.eb.num}`)}.`,
      en: item => `With denominator ${item.mcm}: ${c(`${item.a.den} · ${item.mcm / item.a.den} = ${item.mcm}`)}, so on top ${c(`${item.a.num} · ${item.mcm / item.a.den} = ${item.ea.num}`)}; and ${c(`${item.b.den} · ${item.mcm / item.b.den} = ${item.mcm}`)}, so on top ${c(`${item.b.num} · ${item.mcm / item.b.den} = ${item.eb.num}`)}.`,
    },
    por_que: {
      'producto-de-denominadores': {
        es: item => `${item.a.den} · ${item.b.den} = ${item.a.den * item.b.den} también es un denominador común, pero no el menor: el m.c.m. es ${item.mcm}. `,
        en: item => `${item.a.den} · ${item.b.den} = ${item.a.den * item.b.den} is also a common denominator, but not the smallest: the LCM is ${item.mcm}. `,
      },
      'suma-de-denominadores': {
        es: item => `${item.a.den} + ${item.b.den} no sirve: tiene que ser un número de las tablas de los dos, y el menor es ${item.mcm}. `,
        en: item => `${item.a.den} + ${item.b.den} does not work: it has to be in both times tables, and the smallest is ${item.mcm}. `,
      },
      'toma-el-mayor-denominador': {
        es: item => `${Math.max(item.a.den, item.b.den)} no está en la tabla de ${Math.min(item.a.den, item.b.den)}: el m.c.m. es ${item.mcm}. `,
        en: item => `${Math.max(item.a.den, item.b.den)} is not in the times table of ${Math.min(item.a.den, item.b.den)}: the LCM is ${item.mcm}. `,
      },
      'otra-respuesta': {
        es: item => `Ese no es el m.c.m. de ${item.a.den} y ${item.b.den}. `,
        en: item => `That is not the LCM of ${item.a.den} and ${item.b.den}. `,
      },
      'solo-cambia-el-denominador': {
        es: item => {
          const f = cambian(item).map(([x, e]) => `${hf(x)} no es ${h(x.num, item.mcm)}. Arriba también se multiplica por ${item.mcm / x.den}`);
          return `Has cambiado solo el denominador: ${f.join('; ')}. `;
        },
        en: item => {
          const f = cambian(item).map(([x]) => `${hf(x)} is not ${h(x.num, item.mcm)}. The top is also multiplied by ${item.mcm / x.den}`);
          return `You changed only the denominator: ${f.join('; ')}. `;
        },
      },
      'numerador-mal': {
        es: (item, v) => `El denominador ${item.mcm} está bien, pero ${malos(item, v).map(([x, e, n]) => `arriba de ${hf(x)} no va ${n}: ${c(`${x.num} · ${item.mcm / x.den} = ${e.num}`)}`).join('; ')}. `,
        en: (item, v) => `The denominator ${item.mcm} is right, but ${malos(item, v).map(([x, e, n]) => `the top of ${hf(x)} is not ${n}: ${c(`${x.num} · ${item.mcm / x.den} = ${e.num}`)}`).join('; ')}. `,
      },
    },
  },
};
