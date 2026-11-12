// Práctica «Pasa al otro lado»: textos propios, siempre { es, en }. Los comunes (Comprobar, Siguiente…)
// llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 6): sin «×» (el producto es «·»), sin
// «1x», sin «+ −» (un negativo detrás de una operación va entre paréntesis), sin x²; la división con
// «:» ; cada explicación habla de LOS NÚMEROS DE ESE ÍTEM; ni porcentajes ni lo de semanas siguientes.

import { Fraccion, htmlFraccion } from '../_comun/fracciones.js';
import { deEcuacion } from '../_comun/algebra.js';
import {
  F, num, sub, solTexto, plano, ital, textoEcuacion, linea, comprobacion, solucionDe, calcular,
  segundoPaso, pasoBueno, HUECO,
} from './logica.js';

const MENOS = '−';
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
const c = t => `<span class="cuenta">${t}</span>`;
const cl = t => `<span class="cuenta-frac">${t}</span>`;
const cx = t => c(ital(t));
const ecHtml = texto => c(deEcuacion(texto).aHtml());
const x_ = '<i>x</i>';

/** Un número o una fracción en HTML (con raya si es fracción). */
export const solHtml = p => htmlFraccion(F(p).simplificar());
const val = f => solTexto(plano(f));

// ─── La regla de cada forma ────────────────────────────────────────────────────────────────────

const REGLA = {
  suma: { es: 'Lo que suma pasa restando', en: 'What is added moves across as a subtraction' },
  resta: { es: 'Lo que resta pasa sumando', en: 'What is subtracted moves across as an addition' },
  producto: { es: 'Lo que multiplica pasa dividiendo', en: 'What multiplies moves across as a division' },
  cociente: { es: 'Lo que divide pasa multiplicando', en: 'What divides moves across as a multiplication' },
};
const regla = (forma, i) => REGLA[forma][i];

/** «x + 7 = 12» con la x en cursiva (para una frase). */
const ec = it => ital(textoEcuacion(it));

// ─── Ejercicio 1 ───────────────────────────────────────────────────────────────────────────────

/** La igualdad de llegada con un valor en el hueco: «9 − 3 = 4 + 2». */
export const llegadaCon = (item, v) => item.llegada.replace(HUECO, String(v));
const lados = texto => texto.split(' = ').map(t => calcular(t));
const loQueDa = (item, v) => { const [l, r] = lados(llegadaCon(item, v)); return { l, r, vale: l.equals(r) }; };

const frase1 = {
  operador: {
    correcto: bi((i, item) => `${regla(item.forma, i)}: ${c(`${item.izq} = ${item.der} ${item.respuesta} ${item.bnum}`)}.`),
    solucion: bi((i, item) => `${regla(item.forma, i)}: ${c(`${item.izq} = ${item.der} ${item.respuesta} ${item.bnum}`)}.`),
    por_que: bi((i, item, op) => {
      const valor = op === '+' ? item.der + item.bnum : op === MENOS ? item.der - item.bnum : op === '·' ? item.der * item.bnum : null;
      const cuanto = valor === null ? solTexto(plano(new Fraccion(item.der, item.bnum))) : num(valor);
      const hecho = `${item.der} ${op} ${item.bnum} = ${cuanto}`;
      const causa = op === item.misma
        ? (i === 'es' ? `Al pasar el ${item.bnum} al otro lado la operación no puede quedarse igual: se cambia por la contraria.`
          : `When ${item.bnum} moves across, the operation cannot stay the same: it changes to the opposite one.`)
        : (i === 'es' ? 'Esa no es la operación contraria.' : 'That is not the opposite operation.');
      return i === 'es'
        ? `Con «${op}» sale ${c(hecho)}, y tendría que salir ${item.izq}. ${causa} `
        : `With «${op}» you get ${c(hecho)}, and it should be ${item.izq}. ${causa} `;
    }),
  },
  hueco: {
    correcto: bi((i, item) => {
      const { l, r } = loQueDa(item, item.respuesta);
      return i === 'es'
        ? `El número que falta es ${item.respuesta}: ${c(llegadaCon(item, item.respuesta))}. Los dos lados valen ${val(l)}.`
        : `The missing number is ${item.respuesta}: ${c(llegadaCon(item, item.respuesta))}. Both sides are ${val(l)}.`;
    }),
    solucion: bi((i, item) => `${i === 'es' ? 'Era el' : 'It was'} ${item.respuesta}: ${c(llegadaCon(item, item.respuesta))}.`),
    por_que: bi((i, item, v) => {
      const { l, r } = loQueDa(item, v);
      return i === 'es'
        ? `Con ${v}: ${c(llegadaCon(item, v))} es falso, porque un lado vale ${val(l)} y el otro ${val(r)}. `
        : `With ${v}: ${c(llegadaCon(item, v))} is false, because one side is ${val(l)} and the other is ${val(r)}. `;
    }),
  },
};

// ─── Ejercicios 2 y 5: lo que se dice de cada error ───────────────────────────────────────────

/** Cada frase dice qué hizo quien se equivocó; `it` es la ecuación (forma, k, A, n, c). */
const hizo = {
  'transponer-sin-signo': bi((i, it) => {
    const k = Math.abs(it.k);
    return i === 'es' ? `has pasado el ${k} sin cambiar la operación.` : `you moved the ${k} without changing the operation.`;
  }),
  'olvida-pasar': bi((i, it) => {
    if (it.forma === 'cociente') return i === 'es' ? `has olvidado pasar el ${it.n}: la x aún está dividida entre ${it.n}.` : `you forgot to move the ${it.n}: x is still divided by ${it.n}.`;
    const k = Math.abs(it.k);
    return i === 'es' ? `has olvidado pasar el ${k} al otro lado: la x aún no está sola.` : `you forgot to move the ${k} across: x is not alone yet.`;
  }),
  'signo-de-la-solucion': bi((i, it) => {
    const s = solucionDe(it);
    return i === 'es' ? `has perdido el signo: ${c(ital(linea(it)))} es negativo (${val(s)}).` : `you lost the sign: ${c(ital(linea(it)))} is negative (${val(s)}).`;
  }),
  'signo-cambiado': bi((i, it) => {
    const s = solucionDe(it);
    return i === 'es' ? `has cambiado el signo: ${c(ital(linea(it)))} es positivo (${val(s)}).` : `you changed the sign: ${c(ital(linea(it)))} is positive (${val(s)}).`;
  }),
  'pasar-factor-restando': bi((i, it) => (i === 'es'
    ? `un número que multiplica a la x no pasa restando: pasa dividiendo.`
    : `a number that multiplies x does not move across as a subtraction: it moves across as a division.`)),
  'multiplicar-en-vez-de-dividir': bi(i => (i === 'es'
    ? `un número que multiplica a la x pasa dividiendo, no multiplicando.`
    : `a number that multiplies x moves across as a division, not as a multiplication.`)),
  'invertir-coeficiente': bi((i, it) => (i === 'es'
    ? `has dividido al revés. Se divide el número de la derecha entre el que multiplica a la x: ${c(`${num(it.c)} : ${sub(it.A)}`)}.`
    : `you divided the wrong way round. You divide the number on the right by the one that multiplies x: ${c(`${num(it.c)} : ${sub(it.A)}`)}.`)),
  'signo-al-dividir': bi((i, it) => (i === 'es'
    ? `el ${num(it.A)} pasa dividiendo con su signo: ${c(`${num(it.c)} : ${sub(it.A)}`)}.`
    : `${num(it.A)} moves across as a division with its sign: ${c(`${num(it.c)} : ${sub(it.A)}`)}.`)),
  'dividir-en-vez-de-multiplicar': bi(i => (i === 'es'
    ? `un número que divide a la x pasa multiplicando, no dividiendo.`
    : `a number that divides x moves across as a multiplication, not as a division.`)),
  'pasar-divisor-restando': bi(i => (i === 'es'
    ? `un número que divide a la x pasa multiplicando, no restando.`
    : `a number that divides x moves across as a multiplication, not as a subtraction.`)),
};

/** Por qué sale ese valor (quien lo usa pone antes lo que ha escrito el alumno). */
function porQueDe(i, it, error, valor) {
  const V = val(valor);
  if (error === 'otra-respuesta' || !hizo[error]) return i === 'es' ? `${V} no es la solución. ` : `${V} is not the solution. `;
  const cuenta = error === 'signo-cambiado' || error === 'signo-de-la-solucion' ? '' : `${cl(ital(linea(it, error)))}: `;
  return `${V} ${i === 'es' ? 'sale así' : 'comes from this'}: ${cuenta}${hizo[error][i](it, valor)} `;
}

const bien = (i, it) => `${regla(it.forma, i)}: ${cl(ital(linea(it)))}. ${i === 'es' ? 'Comprobación' : 'Check'}: ${c(comprobacion(it))} ✓.`;

// ─── Ejercicio 3: los pasos ────────────────────────────────────────────────────────────────────

const comprobacion3 = item => {
  const s = item.solucion.num, b = item.b;
  const izq = item.cociente ? `${s} : ${item.n} ${b > 0 ? '+' : MENOS} ${Math.abs(b)}` : `${item.a} · ${s} ${b > 0 ? '+' : MENOS} ${Math.abs(b)}`;
  return `${izq} = ${item.c}`;
};

const POR_QUE_PASO = {
  'transponer-sin-signo': bi((i, item) => (i === 'es'
    ? `El ${Math.abs(item.b)} ${item.b > 0 ? 'suma, así que pasa restando' : 'resta, así que pasa sumando'}.`
    : `The ${Math.abs(item.b)} is ${item.b > 0 ? 'added, so it moves across as a subtraction' : 'subtracted, so it moves across as an addition'}.`)),
  'pasar-factor-restando': bi((i, item) => (i === 'es'
    ? `El ${item.a} multiplica a la x: no pasa restando. Además, lo primero que se pasa es el ${Math.abs(item.b)}, que suma o resta.`
    : `The ${item.a} multiplies x: it does not move across as a subtraction. Also, you first move the ${Math.abs(item.b)}, which is added or subtracted.`)),
  'pasar-divisor-restando': bi((i, item) => (i === 'es'
    ? `El ${item.n} divide a la x: no pasa restando. Además, lo primero que se pasa es el ${Math.abs(item.b)}, que suma o resta.`
    : `The ${item.n} divides x: it does not move across as a subtraction. Also, you first move the ${Math.abs(item.b)}, which is added or subtracted.`)),
  'divide-solo-un-termino': bi((i, item) => (i === 'es'
    ? `Eso solo divide ${item.a}x entre ${item.a} y deja quietos los demás números. Lo primero es pasar el ${Math.abs(item.b)}.`
    : `That only divides ${item.a}x by ${item.a} and leaves the other numbers as they were. First move the ${Math.abs(item.b)}.`)),
  'multiplicar-solo-un-termino': bi((i, item) => (i === 'es'
    ? `Eso solo multiplica x/${item.n} por ${item.n} y deja quietos el resto. Lo primero es pasar el ${Math.abs(item.b)}.`
    : `That only multiplies x/${item.n} by ${item.n} and leaves the other numbers as they were. First move the ${Math.abs(item.b)}.`)),
  'resta-al-reves': bi((i, item) => (i === 'es'
    ? `Se pasa el ${Math.abs(item.b)} al otro lado con la operación contraria, y el ${item.c} se queda delante: ${item.b > 0 ? `${item.c} − ${item.b}` : `${item.c} + ${-item.b}`}.`
    : `You move the ${Math.abs(item.b)} across with the opposite operation, and ${item.c} stays first: ${item.b > 0 ? `${item.c} − ${item.b}` : `${item.c} + ${-item.b}`}.`)),
};

// ─── Ejercicio 4 ───────────────────────────────────────────────────────────────────────────────

/** «x = 3 : 12 = 3/12 = 1/4»: la cuenta de una ecuación ax = c. */
export function lineaFrente(A, C) {
  const s = new Fraccion(C, A).simplificar();
  const cabeza = `x = ${num(C)} : ${sub(A)}`;
  if (s.den === 1) return `${cabeza} = ${num(s.num)}`;
  const sinSimplificar = `${num(Math.sign(C * A) * Math.abs(C))}/${Math.abs(A)}`;
  const simple = solTexto(plano(s));
  return sinSimplificar === simple ? `${cabeza} = ${simple}` : `${cabeza} = ${sinSimplificar} = ${simple}`;
}

// ─── Los textos ────────────────────────────────────────────────────────────────────────────────

export const TX = {
  campos: {
    resultado: { es: 'Número que falta', en: 'Missing number' },
    solucion: { es: 'Valor de x', en: 'Value of x' },
    solucionFraccion: { es: 'Valor de x (número, decimal o fracción)', en: 'Value of x (number, decimal or fraction)' },
  },
  simplifica: bi((i, f) => (i === 'es' ? `Bien; mejor simplificada: ${f}.` : `Correct; better in its simplest form: ${f}.`)),
  noNumero: { es: 'Escribe un número, por ejemplo 7, −5 o 3/4.', en: 'Write a number, for example 7, −5 or 3/4.' },

  // ─── Ejercicio 1 ───────────────────────────────────────────────────────────────────────────
  ej1: {
    nombre: { es: 'Con números', en: 'With numbers' },
    detalle: { es: 'Pasa números al otro lado de una igualdad', en: 'Move numbers across an equality' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una igualdad sigue siendo verdadera si <strong>pasas</strong> un número al otro lado y pones la <strong>operación contraria</strong>: lo que suma pasa restando, lo que resta pasa sumando, lo que multiplica pasa dividiendo y lo que divide pasa multiplicando.</p>
        <p>Ejemplo: ${c('3 + 2 = 5')} → ${c('3 = 5 − 2')}. Se comprueba con las cuentas: ${c('5 − 2 = 3')}.</p>
        <p>Otros ejemplos: ${c('3 · 2 = 6')} → ${c('3 = 6 : 2')}; ${c('6 : 2 = 3')} → ${c('6 = 3 · 2')}.</p>
        <p>Si hay que pasar varios números, se hace uno a uno: ${c('9 − 2 = 4 + 3')} → ${c('9 − 3 = 4 + 2')}. Y se pasa antes lo que suma o resta que lo que multiplica: ${c('3 · 2 + 4 = 10')} → ${c('3 · 2 = 10 − 4')}.</p>
        <p>Elige la operación, o escribe el número que falta y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>An equality stays true if you <strong>move</strong> (pasar) a number to the other side and use the <strong>opposite operation</strong>: what is added moves across as a subtraction, what is subtracted moves across as an addition, what multiplies moves across as a division and what divides moves across as a multiplication.</p>
        <p>Example: ${c('3 + 2 = 5')} → ${c('3 = 5 − 2')}. Check it with the calculations: ${c('5 − 2 = 3')}.</p>
        <p>More examples: ${c('3 · 2 = 6')} → ${c('3 = 6 : 2')}; ${c('6 : 2 = 3')} → ${c('6 = 3 · 2')}.</p>
        <p>If you have to move several numbers, do it one by one: ${c('9 − 2 = 4 + 3')} → ${c('9 − 3 = 4 + 2')}. And move what is added or subtracted before what is multiplied: ${c('3 · 2 + 4 = 10')} → ${c('3 · 2 = 10 − 4')}.</p>
        <p>Choose the operation, or write the missing number and press <strong>Check</strong>.</p>`,
    },
    instruccion: {
      operador: bi((i, item) => (i === 'es' ? `Pasa el ${item.bnum} al otro lado. ¿Qué operación falta?` : `Move the ${item.bnum} to the other side. Which operation is missing?`)),
      hueco: { es: 'Pasa los números al otro lado, uno a uno. ¿Qué número falta?', en: 'Move the numbers across, one by one. Which number is missing?' },
    },
    correcto: { operador: frase1.operador.correcto, hueco: frase1.hueco.correcto },
    solucion: { operador: frase1.operador.solucion, hueco: frase1.hueco.solucion },
    por_que: { operador: frase1.operador.por_que, hueco: frase1.hueco.por_que },
  },

  // ─── Ejercicio 2 ───────────────────────────────────────────────────────────────────────────
  ej2: {
    nombre: { es: 'Una operación', en: 'One step' },
    detalle: { es: 'Deja la x sola pasando un número', en: 'Get x alone by moving one number' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para <strong>resolver</strong> una ecuación hay que dejar la ${x_} sola. El número que le acompaña pasa al otro lado con la <strong>operación contraria</strong>:</p>
        <p>${cx('x + 7 = 12')} → ${cx('x = 12 − 7 = 5')}<br>${cx('x − 4 = 10')} → ${cx('x = 10 + 4 = 14')}<br>${cx('3x = 21')} → ${cx('x = 21 : 3 = 7')}<br>${cx('x/5 = 4')} → ${cx('x = 4 · 5 = 20')}</p>
        <p>La solución puede ser negativa: ${cx('x + 9 = 4')} → ${cx('x = 4 − 9 = −5')}.</p>
        <p><strong>Comprueba siempre</strong>: ${c('5 + 7 = 12')} ✓. Puedes escribir 5 o ${x_} = 5. Pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>To <strong>solve</strong> (resolver) an equation you have to get ${x_} alone. The number next to it moves to the other side with the <strong>opposite operation</strong>:</p>
        <p>${cx('x + 7 = 12')} → ${cx('x = 12 − 7 = 5')}<br>${cx('x − 4 = 10')} → ${cx('x = 10 + 4 = 14')}<br>${cx('3x = 21')} → ${cx('x = 21 : 3 = 7')}<br>${cx('x/5 = 4')} → ${cx('x = 4 · 5 = 20')}</p>
        <p>The solution can be negative: ${cx('x + 9 = 4')} → ${cx('x = 4 − 9 = −5')}.</p>
        <p><strong>Always check</strong>: ${c('5 + 7 = 12')} ✓. You can write 5 or ${x_} = 5. Press <strong>Check</strong>.</p>`,
    },
    instruccion: {
      escribir: { es: 'Resuelve la ecuación. Escribe el valor de x.', en: 'Solve the equation. Write the value of x.' },
      elegir: { es: '¿Cuál es la solución de la ecuación?', en: 'What is the solution of the equation?' },
    },
    correcto: bi((i, item) => bien(i, item)),
    solucion: bi((i, item) => bien(i, item)),
    por_que: bi((i, item, error, valor) => porQueDe(i, item, error, valor)),
  },

  // ─── Ejercicio 3 ───────────────────────────────────────────────────────────────────────────
  ej3: {
    nombre: { es: 'Dos operaciones, paso a paso', en: 'Two steps' },
    detalle: { es: 'Elige el paso y resuelve', en: 'Choose the step and solve' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cuando la ${x_} tiene dos operaciones, los números se pasan <strong>de uno en uno</strong>: primero el que suma o resta; después el que multiplica o divide.</p>
        <p>Ejemplo: ${cx('2x + 5 = 17')} → ${cx('2x = 17 − 5')} → ${cx('2x = 12')} → ${cx('x = 12 : 2 = 6')}.</p>
        <p>Primero eliges el paso correcto; después escribes la solución y pulsas <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>When ${x_} has two operations, move the numbers <strong>one at a time</strong>: first the one that is added or subtracted; then the one that multiplies or divides.</p>
        <p>Example: ${cx('2x + 5 = 17')} → ${cx('2x = 17 − 5')} → ${cx('2x = 12')} → ${cx('x = 12 : 2 = 6')}.</p>
        <p>First choose the correct step; then write the solution and press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: '¿Cuál es el primer paso para resolver la ecuación?', en: 'What is the first step to solve the equation?' },
    segunda: { es: 'Muy bien. Ahora termina: escribe el valor de x.', en: 'Well done. Now finish: write the value of x.' },
    porQuePaso: bi((i, item, opcion) => {
      const causa = POR_QUE_PASO[opcion.error]?.[i](item) ?? '';
      return i === 'es' ? `${cx(opcion.texto)} no es el paso correcto. ${causa} ` : `${cx(opcion.texto)} is not the correct step. ${causa} `;
    }),
    /** Se pulsó el paso bueno y la solución es correcta. */
    correcto: bi((i, item) => `${cl(ital(`${pasoBueno(item)}`))} → ${cl(ital(linea(segundoPaso(item))))}. ${i === 'es' ? 'Comprobación' : 'Check'}: ${c(comprobacion3(item))} ✓.`),
    /** Resumen de la solución (tras fallar el paso o la solución). */
    solucion: bi((i, item) => `${i === 'es' ? 'El paso es' : 'The step is'} ${cx(pasoBueno(item))}; ${cl(ital(linea(segundoPaso(item))))}. ${i === 'es' ? 'Comprobación' : 'Check'}: ${c(comprobacion3(item))} ✓.`),
    por_que: bi((i, item, error, valor) => porQueDe(i, segundoPaso(item), error, valor)),
  },

  // ─── Ejercicio 4 ───────────────────────────────────────────────────────────────────────────
  ej4: {
    nombre: { es: '3x = 12 frente a 12x = 3', en: 'Which way round?' },
    detalle: { es: 'Los mismos números, soluciones distintas', en: 'The same numbers, different solutions' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>${cx('3x = 12')} y ${cx('12x = 3')} <strong>no son lo mismo</strong>. En las dos, el número que multiplica a la ${x_} pasa dividiendo, pero hay que dividir el número de la derecha:</p>
        <p>${cx('3x = 12')} → ${cx('x = 12 : 3 = 4')}<br>${cx('12x = 3')} → ${cx('x = 3 : 12 = 3/12 = 1/4')}</p>
        <p>Si no sale un número entero, la solución es una fracción: escríbela <strong>irreducible</strong> (3/12 = 1/4). Con números negativos: ${cx('−12x = 3')} → ${cx('x = 3 : (−12) = −1/4')}.</p>
        <p>Pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>${cx('3x = 12')} and ${cx('12x = 3')} are <strong>not the same</strong>. In both, the number that multiplies ${x_} moves across as a division, but you divide the number on the right:</p>
        <p>${cx('3x = 12')} → ${cx('x = 12 : 3 = 4')}<br>${cx('12x = 3')} → ${cx('x = 3 : 12 = 3/12 = 1/4')}</p>
        <p>If the result is not a whole number, the solution is a fraction: write it in its <strong>simplest form</strong> (fracción irreducible), 3/12 = 1/4. With negative numbers: ${cx('−12x = 3')} → ${cx('x = 3 : (−12) = −1/4')}.</p>
        <p>Press <strong>Check</strong>.</p>`,
    },
    instruccion: {
      escribir: { es: 'Resuelve la ecuación. Escribe la solución como número entero o como fracción irreducible.', en: 'Solve the equation. Write the solution as a whole number or as a fraction in its simplest form.' },
      elegir: { es: '¿Cuál es la solución de la ecuación? Todas las fracciones están simplificadas.', en: 'What is the solution of the equation? All the fractions are in their simplest form.' },
    },
    correcto: bi((i, item) => frente(i, item)),
    solucion: bi((i, item) => frente(i, item)),
    por_que: bi((i, item, error, valor) => porQueDe(i, { forma: 'producto', A: item.A, c: item.c }, error, valor)),
  },

  // ─── Ejercicio 5 ───────────────────────────────────────────────────────────────────────────
  ej5: {
    nombre: { es: 'Comprueba y corrige', en: 'Check and fix' },
    detalle: { es: '¿Está bien resuelta?', en: 'Is it solved correctly?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Te enseñamos una ecuación y cómo se ha resuelto. Mira si el paso está bien: ¿se ha pasado el número con la <strong>operación contraria</strong>? ¿Es correcto el signo?</p>
        <p>Ejemplo: ${cx('x + 3 = 10')} → ${cx('x = 10 + 3 = 13')}. Está mal: lo que suma pasa restando, y sale ${cx('x = 10 − 3 = 7')}. Comprobación: ${c('7 + 3 = 10')} ✓.</p>
        <p>Si está mal, escribe la solución correcta y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>We show you an equation and how it was solved. Look at the step: was the number moved with the <strong>opposite operation</strong>? Is the sign right?</p>
        <p>Example: ${cx('x + 3 = 10')} → ${cx('x = 10 + 3 = 13')}. It is wrong: what is added moves across as a subtraction, and you get ${cx('x = 10 − 3 = 7')}. Check: ${c('7 + 3 = 10')} ✓.</p>
        <p>If it is wrong, write the correct solution and press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: 'Mira esta resolución. ¿Está bien?', en: 'Look at this solution. Is it right?' },
    botones: {
      si: { es: 'Sí, está bien', en: 'Yes, it is right' },
      no: { es: 'No, tiene un error', en: 'No, it has a mistake' },
    },
    segunda: { es: 'Escribe la solución correcta.', en: 'Write the correct solution.' },
    /** Estaba bien. */
    estabaBien: bi((i, item) => `${i === 'es' ? 'Estaba bien' : 'It was right'}: ${bien(i, item)}`),
    /** Estaba mal (con o sin que el alumno la haya corregido bien). */
    estabaMal: bi((i, item) => `${i === 'es' ? 'Estaba mal' : 'It was wrong'}: ${porQueDe(i, item, item.error, F(item.mostrada))}${bien(i, item)}`),
    /** Estaba mal, lo vio, pero la solución que escribe tampoco vale. */
    correccionMal: bi((i, item, error, valor) => `${porQueDe(i, item, error, valor)}${bien(i, item)}`),
  },
};

/** La comprobación de ax = c con la solución (entera o fracción): «12 · 1/4 = 3». */
function comprobacionFrente(item) {
  const s = plano(F(item.solucion));
  const t = solTexto(s);
  return `${num(item.A)} · ${s.num < 0 ? `(${t})` : t} = ${num(item.c)}`;
}

function frente(i, item) {
  const mia = lineaFrente(item.A, item.c), otra = lineaFrente(item.otra.A, item.otra.c);
  const oe = ital(`${item.otra.A}x = ${item.otra.c}`);
  return i === 'es'
    ? `${cl(ital(mia))}. Con los mismos números al revés, ${c(oe)}, sale ${cl(ital(otra))}. Comprobación: ${c(comprobacionFrente(item))} ✓.`
    : `${cl(ital(mia))}. With the same numbers the other way round, ${c(oe)}, you get ${cl(ital(otra))}. Check: ${c(comprobacionFrente(item))} ✓.`;
}

export { ec };

// ─── «No lo sé»: la explicación de cada ejercicio, con los números del ítem ───────────────────

const pasosAyuda = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const respuesta = (i, t) => (i === 'es' ? `La respuesta es ${t}.` : `The answer is ${t}.`);

/** Ejercicio 1: el operador contrario (elegir) o el número que cambia de lado (hueco). */
export function explicaConNumeros(item, { idioma }) {
  if (item.tipo === 'operador') {
    const dice = frase1.operador.correcto[idioma](item);
    const donde = idioma === 'es'
      ? `Partimos de ${c(item.partida)} y pasamos el ${item.bnum} al otro lado. `
      : `We start from ${c(item.partida)} and move the ${item.bnum} across. `;
    return `${donde}${dice} ${respuesta(idioma, c(item.respuesta))}`;
  }
  const { l } = loQueDa(item, item.respuesta);
  const es = idioma === 'es';
  const pasos = [es
    ? `Mira qué números han cambiado de lado: el que falta es el ${c(item.respuesta)}, que se pasa con la operación contraria.`
    : `See which numbers changed sides: the missing one is ${c(item.respuesta)}, which is moved with the opposite operation.`,
  es
    ? `Pon ${item.respuesta} en el hueco: ${c(llegadaCon(item, item.respuesta))}. Los dos lados valen ${val(l)}.`
    : `Put ${item.respuesta} in the gap: ${c(llegadaCon(item, item.respuesta))}. Both sides are ${val(l)}.`];
  return `${pasosAyuda(pasos)}${respuesta(idioma, c(item.respuesta))}`;
}

const solucionFinal = (i, p) => respuesta(i, `<i>x</i> = ${solHtml(p)}`);

/** Ejercicios 2 y 4 (una operación): la regla, la cuenta, la comprobación y la solución. */
export function explicaUnaOperacion(item, { idioma }) {
  return `${bien(idioma, item)} ${solucionFinal(idioma, item.solucion)}`;
}

/** Ejercicio 3: dos pasos, primero lo que suma o resta y después lo que multiplica o divide. */
export function explicaDosOperaciones(item, { idioma }) {
  const es = idioma === 'es';
  const b = Math.abs(item.b);
  // Revisión 191: el paso con raya (no «x/3») y la cuenta hecha antes del segundo paso.
  const primero = `${ecHtml(pasoBueno(item))}; ${es ? 'o sea' : 'that is'}, ${ecHtml(textoEcuacion(segundoPaso(item)))}`;
  const pasos = [es
    ? `Pasa primero el ${b}, que ${item.b > 0 ? 'suma, restando' : 'resta, sumando'}: ${primero}.`
    : `First move the ${b}, which is ${item.b > 0 ? 'added, as a subtraction' : 'subtracted, as an addition'}: ${primero}.`,
  es
    ? `Después pasa el ${item.cociente ? item.n : item.a}, que ${item.cociente ? 'divide, multiplicando' : 'multiplica, dividiendo'}: ${cl(ital(linea(segundoPaso(item))))}.`
    : `Then move the ${item.cociente ? item.n : item.a}, which ${item.cociente ? 'divides, as a multiplication' : 'multiplies, as a division'}: ${cl(ital(linea(segundoPaso(item))))}.`];
  const comprueba = `${es ? 'Comprobación' : 'Check'}: ${c(comprobacion3(item))} ✓.`;
  return `${pasosAyuda(pasos)}${comprueba} ${solucionFinal(idioma, item.solucion)}`;
}

/** Ejercicio 4: el número de la derecha entre el que multiplica a la x, y la fracción simplificada. */
export function explicaFrente(item, { idioma }) {
  return `${conRaya(frente(idioma, item))} ${solucionFinal(idioma, item.solucion)}`;
}

// Revisión 191: el feedback de este ejercicio escribe las fracciones con barra («−3/7»); en la tarjeta, con raya.
const conRaya = html => html.replace(/(−?)(\d+)\/(\d+)/g, (_, menos, n, d) => htmlFraccion(new Fraccion(menos ? -Number(n) : Number(n), Number(d))));

/** Ejercicio 5: si la resolución estaba bien o mal, y cómo queda bien hecha. */
export function explicaComprueba(item, { idioma }) {
  const es = idioma === 'es';
  if (item.buena) return `${es ? 'Estaba bien' : 'It was right'}. ${bien(idioma, item)} ${respuesta(idioma, es ? 'sí, está bien' : 'yes, it is right')}`;
  // Revisión 191: en «producto», el feedback de «signo-cambiado» dice «es positivo» aunque la solución sea negativa
  // (hallazgo en la ENTREGA); aquí se dice sin el signo de la solución, que ya enseña la línea buena de detrás.
  const signo = item.error === 'signo-cambiado' || item.error === 'signo-de-la-solucion';
  const porQue = signo
    ? `${val(F(item.mostrada))} ${es ? 'tiene el signo cambiado' : 'has the wrong sign'}. `
    : porQueDe(idioma, item, item.error, F(item.mostrada));
  return `${es ? 'Estaba mal' : 'It was wrong'}. ${porQue}${bien(idioma, item)} ${respuesta(idioma, es ? `no; la solución correcta es ${x_} = ${solHtml(item.solucion)}` : `no; the correct solution is ${x_} = ${solHtml(item.solucion)}`)}`;
}
