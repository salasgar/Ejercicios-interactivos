// Práctica «Problemas con ecuaciones» (unidad 6): textos propios, siempre { es, en }.

import { solucionIncognita, solucionEcuacion, feedbackResuelve, solucionPide, solucionSentido } from './logica.js';
import { fraccion, htmlFraccion } from '../_comun/fracciones.js';

const c = h =>`<span class="cuenta">${h}</span>`;
const x = '<i>x</i>';

export const TX = {
  ejercicios: [
    {
      nombre: { es: '¿Qué es x?', en: 'What is x?' },
      detalle: { es: 'Elegir qué representa la incógnita', en: 'Choose what the unknown stands for' },
      introduccion: {
        es: `<h3>¿Qué es ${x}?</h3>
          <p>Para resolver un problema con una ecuación, lo primero es decidir qué es ${x}: <strong>lo que no sabes</strong> y quieres calcular.</p>
          <p>Ejemplo: «En una caja hay 30 bolas, rojas y azules. Hay el doble de azules que de rojas.» Aquí ${x} = las bolas rojas. Las 30 bolas ya las da el enunciado: no pueden ser ${x}.</p>`,
        en: `<h3>What is ${x}?</h3>
          <p>To solve a problem with an equation, first decide what ${x} is: <strong>what you do not know</strong> and want to find.</p>
          <p>Example: “A box has 30 balls, red and blue. There are twice as many blue balls as red balls.” Here ${x} = the number of red balls. The 30 balls are already given: they cannot be ${x}.</p>`,
      },
    },
    {
      nombre: { es: '¿Qué ecuación?', en: 'Which equation?' },
      detalle: { es: 'Elegir la ecuación que plantea el problema', en: 'Choose the equation that sets up the problem' },
      introduccion: {
        es: `<h3>¿Qué ecuación?</h3>
          <p>Con ${x} = las bolas rojas, las azules son 2${x} (el doble). Las dos juntas son 30: ${c(`${x} + 2${x} = 30`)}.</p>
          <p>La ecuación buena dice, con la ${x}, lo mismo que el enunciado. Fíjate en cada palabra: «el doble», «más que», «menos que», «en total».</p>`,
        en: `<h3>Which equation?</h3>
          <p>With ${x} = the red balls, the blue balls are 2${x} (twice as many). Both together are 30: ${c(`${x} + 2${x} = 30`)}.</p>
          <p>The right equation says, using ${x}, the same as the statement. Look at each word: “twice”, “more than”, “less than”, “altogether”.</p>`,
      },
    },
    {
      nombre: { es: 'Resuelve y contesta', en: 'Solve and answer' },
      detalle: { es: 'Plantear, resolver y contestar con la cantidad que piden', en: 'Set up, solve and answer with the quantity asked for' },
      introduccion: {
        es: `<h3>Resuelve y contesta</h3>
          <p>Cuatro fases: 1) qué es ${x}; 2) la ecuación; 3) resolverla; 4) contestar.</p>
          <p>${x} = las bolas rojas. ${c(`${x} + 2${x} = 30`)}. ${c(`3${x} = 30`)}, ${c(`${x} = 10`)}. Respuesta: hay 10 bolas rojas y 20 azules.</p>
          <p>Escribe solo el número que te piden (a veces no es ${x}). El dinero, con coma o con punto.</p>`,
        en: `<h3>Solve and answer</h3>
          <p>Four phases: 1) what ${x} is; 2) the equation; 3) solve it; 4) answer.</p>
          <p>${x} = the red balls. ${c(`${x} + 2${x} = 30`)}. ${c(`3${x} = 30`)}, ${c(`${x} = 10`)}. Answer: there are 10 red balls and 20 blue balls.</p>
          <p>Write only the number you are asked for (sometimes it is not ${x}). For money, use a comma or a point.</p>`,
      },
    },
    {
      nombre: { es: '¿Qué pide?', en: 'What are they asking for?' },
      detalle: { es: 'Contestar a lo que pregunta el problema, no solo a x', en: 'Answer what the problem asks, not just x' },
      introduccion: {
        es: `<h3>¿Qué pide?</h3>
          <p>A veces, al resolver, ${x} no es lo que preguntan. En el ejemplo, ${x} = 10 son las bolas rojas. Si preguntan por las azules, la respuesta es 2 · 10 = 20.</p>
          <p>Antes de contestar, vuelve a leer la pregunta.</p>`,
        en: `<h3>What are they asking for?</h3>
          <p>Sometimes, once solved, ${x} is not what the question asks for. In the example, ${x} = 10 is the number of red balls. If the question asks about the blue balls, the answer is 2 · 10 = 20.</p>
          <p>Before you answer, read the question again.</p>`,
      },
    },
    {
      nombre: { es: '¿Tiene sentido?', en: 'Does it make sense?' },
      detalle: { es: 'Comprobar que la solución es posible y buscar dónde está el error', en: 'Check the solution is possible and find the mistake' },
      introduccion: {
        es: `<h3>¿Tiene sentido?</h3>
          <p>La solución de un problema tiene que ser posible: no hay 7,5 personas, ni una edad negativa, ni un precio con tres decimales.</p>
          <p>Si no tiene sentido, hay un error. Puede estar en la <strong>ecuación</strong> (no dice lo que dice el enunciado) o al <strong>resolverla</strong> (un paso mal hecho).</p>`,
        en: `<h3>Does it make sense?</h3>
          <p>The solution of a problem has to be possible: there are no 7.5 people, no negative ages and no prices with three decimals.</p>
          <p>If it does not make sense, there is a mistake. It can be in the <strong>equation</strong> (it does not say what the statement says) or when <strong>solving</strong> it (a wrong step).</p>`,
      },
    },
  ],
  instrucciones: {
    incognita: { es: 'Lee el problema. ¿Qué debe ser x? Elige algo que todavía no sabes.', en: 'Read the problem. What should x be? Choose something you do not know yet.' },
    ecuacion: { es: 'Elige la ecuación que plantea el problema.', en: 'Choose the equation that sets up the problem.' },
    resuelve: { es: 'Resuelve el problema y escribe la respuesta (solo el número).', en: 'Solve the problem and write the answer (just the number).' },
    pide: { es: 'Este problema ya está resuelto. Contesta a la pregunta.', en: 'This problem is already solved. Answer the question.' },
    sentido: { es: 'Mira cómo lo ha resuelto otra persona. ¿Tiene sentido la solución?', en: 'Look at how someone else solved it. Does the solution make sense?' },
  },
  etiquetas: {
    ecuacion: { es: 'Ecuación', en: 'Equation' },
    linea: { es: 'Siguiente línea', en: 'Next line' },
    solucion: { es: 'Solución', en: 'Solution' },
    resuelto: { es: 'Solución de la ecuación', en: 'Solution of the equation' },
    campo: { es: 'Tu respuesta', en: 'Your answer' },
    placeholder: { es: 'Número', en: 'Number' },
  },
  sentido: {
    bien: { es: 'Sí, tiene sentido', en: 'Yes, it makes sense' },
    ecuacion: { es: 'No: la ecuación no recoge bien el enunciado', en: 'No: the equation does not fit the statement' },
    resolucion: { es: 'No: la ecuación está bien, pero se ha resuelto mal', en: 'No: the equation is fine, but it was solved wrongly' },
    enunciado: { es: 'No: el enunciado está mal', en: 'No: the statement is wrong' },
  },
};

// ─── «No lo sé»: la explicación de cada ejercicio (la regla y lo que ya dice el ítem) ───

const regla = (ctx, o) => `<p>${ctx.tt(o)}</p>`;
const consejo = (ctx, o) => `<p>${ctx.tt({ es: `Consejo: ${o.es}`, en: `Tip: ${o.en}` })}</p>`;

/** Ejercicio 1. */
export function explicaIncognita(item, ctx) {
  // Revisión 191: «lo que te piden calcular» no siempre es la x (el ejercicio 4 enseña justo eso).
  return regla(ctx, {
    es: 'La x tiene que ser algo que todavía no sabes: lo que el enunciado ya dice con un número no puede ser la x.',
    en: 'x must be something you do not know yet: a number the statement already gives cannot be x.',
  }) + `<p>${solucionIncognita(item)[ctx.idioma]}</p>`;
}

/** Ejercicio 2. */
export function explicaEcuacion(item, ctx) {
  // Revisión 191: «palabra por palabra» y «menos es −» fallan con «menos que»; la regla habla de cantidades.
  return regla(ctx, {
    es: 'Escribe con la x cada cantidad del enunciado («el doble» es 2x, «5 más» es + 5…); el resultado que da el problema va al otro lado del igual.',
    en: 'Write each amount in the problem using x (“twice” is 2x, “5 more” is + 5…); the result the problem gives goes on the other side of the equals sign.',
  }) + `<p>${solucionEcuacion(item)[ctx.idioma]}</p>`;
}

/** Ejercicio 3 (las cuatro fases). */
export function explicaResuelve(item, ctx) {
  return regla(ctx, {
    es: 'Se hace en cuatro fases: qué es la x, la ecuación, resolverla y contestar a lo que pregunta el problema.',
    en: 'Do it in four phases: what x is, the equation, solving it and answering what the problem asks.',
  }) + feedbackResuelve(item, ctx.idioma)
    + consejo(ctx, { es: 'vuelve a leer la pregunta: a veces no piden la x.', en: 'read the question again: sometimes they do not ask for x.' });
}

/** Ejercicio 4. */
export function explicaPide(item, ctx) {
  return regla(ctx, {
    es: 'Resolver la ecuación da el valor de la x, pero el problema puede preguntar otra cosa: lee la pregunta y calcula esa cantidad.',
    en: 'Solving the equation gives the value of x, but the problem may ask for something else: read the question and work out that quantity.',
  }) + `<p>${solucionPide(item, ctx.idioma)}</p>`;
}

/** Ejercicio 5. */
export function explicaSentido(item, ctx) {
  // Revisión 191: «personas con decimales» no cuadra con pulseras o cromos; y la fracción, con raya (el feedback pone «322/3»).
  return regla(ctx, {
    es: 'Mira si el valor de la x es posible en el problema (nada de cosas que se cuentan con decimales ni edades negativas). Si no lo es, hay un error: en la ecuación o al resolverla.',
    en: 'Check whether the value of x is possible in the problem (no decimals for things you count, no negative ages). If it is not, there is a mistake: in the equation or when solving it.',
  }) + `<p>${conRaya(solucionSentido(item, ctx.idioma))}</p>`;
}

const conRaya = html => html.replace(/(−?)(\d+)\/(\d+)/g, (_, menos, n, d) => htmlFraccion(fraccion(menos ? -Number(n) : Number(n), Number(d))));
