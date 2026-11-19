// «Problemas de proporcionalidad directa»: textos propios, siempre { es, en }. Producto con «·», división con «:»;
// nada de «inversa», porcentajes ni velocidades (eso es de otra sesión de la unidad 7). El inglés, sencillo, y la
// palabra no matemática que decide la respuesta, aclarada entre paréntesis (ya lo hacen los enunciados del banco).

import { enunciado, proporcionDirecta, cantidad, aTexto } from '../_comun/proporcion.js';
import {
  META, Q, ctxDe, txt, num, unidadDe, unoDe, cuenta, cuentaAlReves, solucion, valorDeUno, unidadBuena,
  valorDelPlanteamiento, respuestaDada,
} from './logica.js';
import { fraccion } from '../_comun/fracciones.js';

const cuentaHtml = c => `<span class="cuenta">${c}</span>`;
const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const MENOS = '−';

/** El enunciado del banco con los datos del ítem. */
export function enunciadoDe(item, idioma) {
  const datos = { a: Q(item, 'a'), b: Q(item, 'b'), c: Q(item, 'c'), d: Q(item, 'd'), k: cantidad(val(item.k)) };
  return enunciado(ctxDe(item.ctx), datos, idioma);
}

/** La pregunta al revés (ejercicio 3): cuántos de A salen con lo que da d. */
export function enunciadoAlReves(item, idioma) {
  return META[item.ctx].inv[idioma].replace(/\{(a|b|d)\}/g, (_, k) => txt(item, k, idioma));
}

/** El enunciado del ejercicio 3 según el sentido. */
export const enunciadoContesta = (item, idioma) => (item.sentido === 'inversa' ? enunciadoAlReves(item, idioma) : enunciadoDe(item, idioma));

const nombreMagnitud = (item, lado, idioma) => (lado === 'A' ? META[item.ctx].A[idioma][1] : META[item.ctx].B[idioma][1]);
const nombreRazon = (item, idioma) => META[item.ctx].K[idioma][0];

const FALLO = {
  'razonar-sumando': { es: 'Has sumado en vez de multiplicar: si hay el doble, sale el doble', en: 'You added instead of multiplying: twice as much gives twice as much' },
  'invertir-razon': { es: 'Has dividido al revés: se divide lo que cuesta (o lo que lleva) entre la cantidad, no al contrario', en: 'You divided the wrong way round: divide the price (or amount) by the quantity, not the other way' },
  'contestar-otra-cosa': { es: 'Has contestado otro número de la cuenta, no lo que se pregunta', en: 'You gave another number from the working, not what was asked' },
  'inversa-en-directa': { es: 'Has multiplicado los dos datos de la primera fila: así saldría menos cuando tiene que salir más', en: 'You multiplied the two numbers of the first row: that gives less when it should give more' },
  'productos-en-linea': { es: 'Has puesto la x en la columna que no es', en: 'You put x in the wrong column' },
};
/** La frase que explica el error; vacía si no es uno conocido. */
const falloDe = (error, idioma) => FALLO[error]?.[idioma] ?? '';

/** Las líneas de la cuenta de proporcion.js en el idioma, solo las que no son la cabecera: se pintan como pasos. */
const lineas = (pasos, idioma) => pasos.map(p => p[idioma]);

// ─── Ejercicio 1: ¿cuánto cuesta 1? ────────────────────────────────────────────

export function pasosUnidad(item, idioma) {
  const r = proporcionDirecta({ a: Q(item, 'a'), b: Q(item, 'b'), c: Q(item, 'c') }, 'unidad');
  return lineas(r.pasos, idioma);
}

const cuentaPaso = (item, paso, idioma) => pasosUnidad(item, idioma)[paso];

export function explicaUnidad(item, idioma) {
  const p = pasosUnidad(item, idioma);
  const regla = idioma === 'es'
    ? 'Primero se halla lo que vale <strong>una</strong> (se divide) y después se multiplica por las que piden.'
    : 'First find what <strong>one</strong> is worth (divide), then multiply by the amount you are asked for.';
  const respuesta = idioma === 'es'
    ? `La respuesta es: ${unoDe(item, idioma)} → ${aTexto(valorDeUno(item), idioma)} y ${txt(item, 'c', idioma)} → ${txt(item, 'd', idioma)}.`
    : `The answer is: ${unoDe(item, idioma)} → ${aTexto(valorDeUno(item), idioma)} and ${txt(item, 'c', idioma)} → ${txt(item, 'd', idioma)}.`;
  return `${regla}<ol class="pasos-ayuda"><li>${cuentaHtml(p[0])}</li><li>${cuentaHtml(p[1])}</li></ol>${respuesta}`;
}

export function feedbackUnidad(item, { paso, escrito, error }, idioma) {
  const dijo = idioma === 'es' ? `Has escrito ${escrito}.` : `You wrote ${escrito}.`;
  const causa = falloDe(error, idioma);
  const buena = idioma === 'es' ? 'La cuenta bien hecha:' : 'The correct working:';
  const sobre = paso === 0
    ? (idioma === 'es' ? `Lo que vale ${unoDe(item, idioma)} sale de dividir.` : `The value of ${unoDe(item, idioma)} comes from dividing.`)
    : (idioma === 'es' ? 'Esa casilla se calcula con el precio de 1, multiplicando.' : 'That box is worked out from the value of 1, by multiplying.');
  return `${dijo} ${causa ? `${causa}. ` : ''}${sobre} ${buena} ${cuentaHtml(cuentaPaso(item, paso, idioma))}`.replace(/\s+/g, ' ').trim();
}

// ─── Ejercicio 2: ¿qué planteamiento? ──────────────────────────────────────────

/** Las dos filas y la cuenta de cada planteamiento, en HTML (para los botones). */
export function htmlPlanteamiento(item, tipo, idioma) {
  const A = txt(item, 'a', idioma), B = txt(item, 'b', idioma), C = txt(item, 'c', idioma);
  const a = num(val(item.a), idioma), b = num(val(item.b), idioma), c = num(val(item.c), idioma);
  const filas = {
    buena: [`${A} → ${B}`, `${C} → x`],
    'productos-en-linea': [`${A} → ${B}`, `x → ${C}`],
    'inversa-en-directa': [`${C} → ${B}`, `${A} → x`],
    'razonar-sumando': [`${A} → ${B}`, `${C} → x`],
  }[tipo];
  const calc = {
    buena: `x = ${b} · ${c} : ${a}`,
    'productos-en-linea': `x = ${a} · ${c} : ${b}`,
    'inversa-en-directa': `x = ${a} · ${b} : ${c}`,
    'razonar-sumando': `x = ${b} + ${c} ${MENOS} ${a}`,
  }[tipo];
  return `<span class="plan"><span class="plan__fila">${filas[0]}</span><span class="plan__fila">${filas[1]}</span><span class="plan__calc">${calc}</span></span>`;
}

export function enunciadoPlanteamiento(item, idioma) {
  return {
    texto: enunciadoDe(item, idioma),
    pregunta: idioma === 'es'
      ? 'Elige el planteamiento correcto (la x es lo que se pide). No hace falta calcular el resultado.'
      : 'Choose the correct set-up (x is what you are asked for). You do not need to work out the answer.',
  };
}

export function explicaPlanteamiento(item, idioma) {
  const a = num(val(item.a), idioma), b = num(val(item.b), idioma), c = num(val(item.c), idioma);
  const A = nombreMagnitud(item, 'A', idioma), B = nombreMagnitud(item, 'B', idioma);
  const regla = idioma === 'es'
    ? `Las cantidades de lo mismo van en la misma columna (${A} con ${A}; ${B} con ${B}) y la x va con las ${B}.`
    : `Amounts of the same thing go in the same column (${A} with ${A}; ${B} with ${B}) and x goes with the ${B}.`;
  const filas = `${txt(item, 'a', idioma)} → ${txt(item, 'b', idioma)}; ${txt(item, 'c', idioma)} → x`;
  const cruz = idioma === 'es'
    ? `Se multiplica en cruz: x = ${b} · ${c} : ${a}.`
    : `Multiply across: x = ${b} · ${c} : ${a}.`;
  const resp = idioma === 'es'
    ? `La respuesta es el planteamiento con ${cuentaHtml(`x = ${b} · ${c} : ${a}`)}.`
    : `The answer is the set-up with ${cuentaHtml(`x = ${b} · ${c} : ${a}`)}.`;
  return `${regla}<ol class="pasos-ayuda"><li>${cuentaHtml(filas)}</li><li>${cruz}</li></ol>${resp}`;
}

const MOTIVO_PLANTEAMIENTO = {
  'productos-en-linea': {
    es: item => `La x está en la columna que no es: x es ${unidadArticulo(item, 'B', 'es')}, y esa columna es de ${nombreMagnitud(item, 'A', 'es')}.`,
    en: item => `x is in the wrong column: x is an amount of ${nombreMagnitud(item, 'B', 'en')}, but that column is for ${nombreMagnitud(item, 'A', 'en')}.`,
  },
  'inversa-en-directa': {
    es: item => `Has cruzado las filas: así, con más ${nombreMagnitud(item, 'A', 'es')} saldría menos ${nombreMagnitud(item, 'B', 'es')}, y aquí es al revés (con más, más).`,
    en: item => `The rows are crossed: that would give less ${nombreMagnitud(item, 'B', 'en')} for more ${nombreMagnitud(item, 'A', 'en')}, but here more means more.`,
  },
  'razonar-sumando': {
    es: () => 'Has sumado en vez de multiplicar: si hay el doble, sale el doble (no «lo mismo y un poco más»).',
    en: () => 'You added instead of multiplying: twice as much gives twice as much (not “the same plus a bit”).',
  },
};
const unidadArticulo = (item, lado, idioma) => `una cantidad de ${nombreMagnitud(item, lado, idioma)}`;

export function feedbackPlanteamiento(item, error, idioma) {
  const causa = MOTIVO_PLANTEAMIENTO[error]?.[idioma](item) ?? '';
  return `${causa} ${explicaPlanteamiento(item, idioma)}`.replace(/\s+/g, ' ').trim();
}

// ─── Ejercicio 3: resuelve y contesta ──────────────────────────────────────────

export function pasosContesta(item, idioma) {
  const r = item.sentido === 'inversa' ? cuentaAlReves(item) : cuenta(item);
  const p = lineas(r.pasos, idioma);
  return [p[0], p[1], p[p.length - 1]];
}

export function textoSolucion(item, idioma) {
  const r = solucion(item);
  const clave = item.sentido === 'inversa' ? 'c' : 'd';
  return txt(item, clave, idioma, r.valor);
}

export function nombreDeUnidad(item, id, idioma) {
  return id === 'K' ? nombreRazon(item, idioma) : META[item.ctx][id][idioma][1];
}

export function explicaContesta(item, idioma) {
  const p = pasosContesta(item, idioma);
  const regla = idioma === 'es'
    ? 'Se pone la regla de tres con la x en lo que se pide y se multiplica en cruz.'
    : 'Set up the rule of three with x for what you are asked and multiply across.';
  const resp = idioma === 'es'
    ? `La respuesta es: ${textoSolucion(item, idioma)} (la unidad es ${nombreDeUnidad(item, unidadBuena(item), idioma)}).`
    : `The answer is: ${textoSolucion(item, idioma)} (the unit is ${nombreDeUnidad(item, unidadBuena(item), idioma)}).`;
  return `${regla}<ol class="pasos-ayuda">${p.map(l => `<li>${cuentaHtml(l)}</li>`).join('')}</ol>${resp}`;
}

export function feedbackContesta(item, { escrito, error, unidadBien, valorBien }, idioma) {
  const partes = [];
  if (!valorBien) {
    const causa = falloDe(error, idioma);
    partes.push(idioma === 'es' ? `Has escrito ${escrito}.` : `You wrote ${escrito}.`);
    if (causa) partes.push(`${causa}.`);
  } else {
    partes.push(idioma === 'es' ? `El número ${escrito} está bien, pero la unidad no.` : `The number ${escrito} is right, but the unit is not.`);
  }
  if (!unidadBien && !valorBien) partes.push(idioma === 'es' ? 'Y la unidad tampoco es la que se pide.' : 'And the unit is not the one asked for.');
  if (!unidadBien && valorBien) {
    partes.push(idioma === 'es'
      ? `Lo que se pide son ${nombreDeUnidad(item, unidadBuena(item), idioma)}.`
      : `The question asks for ${nombreDeUnidad(item, unidadBuena(item), idioma)}.`);
  }
  partes.push(explicaContesta(item, idioma));
  return partes.join(' ').replace(/\s+/g, ' ').trim();
}

// ─── Ejercicio 4: ¿tiene sentido? ──────────────────────────────────────────────

export const MOTIVO = {
  ok: { es: 'Sí, tiene sentido', en: 'Yes, it makes sense' },
  'va-al-reves': { es: 'No: va al revés (con más cantidad tiene que salir más)', en: 'No: it goes the wrong way (more should give more)' },
  'unidad-equivocada': { es: 'No: la unidad no es la que se pide', en: 'No: the unit is not the one asked for' },
  'fuera-de-cota': { es: 'No: el número es demasiado grande para ser creíble', en: 'No: the number is far too big to be believable' },
};

export function enunciadoSentido(item, idioma) {
  return {
    texto: enunciadoDe(item, idioma),
    dado: idioma === 'es' ? `Respuesta de un compañero: <strong>${respuestaDada(item, idioma)}</strong>` : `A classmate’s answer: <strong>${respuestaDada(item, idioma)}</strong>`,
    pregunta: idioma === 'es' ? '¿Tiene sentido? Si no, ¿por qué?' : 'Does it make sense? If not, why not?',
  };
}

export function explicaSentido(item, idioma) {
  const bien = txt(item, 'd', idioma);
  const dado = respuestaDada(item, idioma);
  const mas = idioma === 'es' ? 'más' : 'more';
  const menos = idioma === 'es' ? 'menos' : 'less';
  const sube = val(item.c).num * val(item.a).den > val(item.a).num * val(item.c).den;
  const A = nombreMagnitud(item, 'A', idioma), B = nombreMagnitud(item, 'B', idioma);
  const lineasPorMotivo = {
    ok: idioma === 'es'
      ? [`${txt(item, 'c', idioma)} es ${sube ? 'más' : 'menos'} que ${txt(item, 'a', idioma)}, así que sale ${sube ? 'más' : 'menos'}: ${bien} cuadra.`]
      : [`${txt(item, 'c', idioma)} is ${sube ? 'more' : 'less'} than ${txt(item, 'a', idioma)}, so the result is ${sube ? 'more' : 'less'}: ${bien} fits.`],
    'va-al-reves': idioma === 'es'
      ? [`Con ${sube ? 'más' : 'menos'} ${A} tiene que salir ${sube ? mas : menos} ${B}, y ${dado} sale ${sube ? 'menos' : 'más'}.`]
      : [`With ${sube ? 'more' : 'less'} ${A} you should get ${sube ? mas : menos} ${B}, but ${dado} is ${sube ? 'less' : 'more'}.`],
    'unidad-equivocada': idioma === 'es'
      ? [`El número vale, pero ${dado} es una cantidad de ${A} y se pide una de ${B}.`]
      : [`The number is fine, but ${dado} is an amount of ${A} and the question asks for ${B}.`],
    'fuera-de-cota': idioma === 'es'
      ? [`${dado} es una barbaridad para ${txt(item, 'c', idioma)}: se ha ido de cifras.`]
      : [`${dado} is far too much for ${txt(item, 'c', idioma)}: a digit is out of place.`],
  }[item.motivo];
  const resp = idioma === 'es'
    ? `La respuesta es: «${MOTIVO[item.motivo].es}». Bien hecho: ${cuentaHtml(`x = ${bien}`)}.`
    : `The answer is: “${MOTIVO[item.motivo].en}”. Worked out: ${cuentaHtml(`x = ${bien}`)}.`;
  const consejo = idioma === 'es'
    ? 'Antes de calcular, pregúntate si ha de salir más o menos, y de qué unidad.'
    : 'Before calculating, ask yourself whether you should get more or less, and in what unit.';
  return `${lineasPorMotivo.join(' ')} ${resp} ${consejo}`;
}

// ─── Textos de la práctica ─────────────────────────────────────────────────────

export const TX = {
  no_se_hacerlo: { es: 'No sé hacerlo', en: 'I don’t know how' },

  unidad: {
    nombre: { es: '¿Cuánto cuesta 1?', en: 'Find the unit rate first' },
    detalle: { es: 'Halla lo que vale 1 y después lo que piden', en: 'Find what 1 is worth, then what is asked' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En <strong>proporcionalidad directa</strong>, si hay el doble, sale el doble. Para resolver un problema puedes ir <strong>primero a 1</strong>: <strong>divides</strong> para saber lo que vale uno y después <strong>multiplicas</strong> por los que te piden.</p>
        <p>Por ejemplo: 3 kg cuestan 6,60 €. 1 kg cuesta <strong>6,60 : 3 = 2,20 €</strong> y 5 kg cuestan <strong>5 · 2,20 = 11,00 €</strong>.</p>
        <p>Escribes los dos resultados, cada uno en su casilla. Puedes usar coma o punto para los decimales.</p>`,
      en: `<h2>How it works</h2>
        <p>In <strong>direct proportion</strong>, twice as much gives twice as much. To solve a problem you can <strong>go to 1 first</strong>: <strong>divide</strong> to find what one is worth, then <strong>multiply</strong> by the amount you are asked for.</p>
        <p>For example: 3 kg cost €6.60. 1 kg costs <strong>6.60 : 3 = €2.20</strong> and 5 kg cost <strong>5 · 2.20 = €11.00</strong>.</p>
        <p>Write the two answers, each in its own box. You can use a comma or a point for decimals.</p>`,
    },
    instruccion: { es: 'Primero halla lo que vale 1 y después lo que piden.', en: 'First find what 1 is worth, then what you are asked for.' },
    campo1: { es: 'Valor de 1', en: 'Value of 1' },
    campo2: { es: 'Valor de lo que piden', en: 'Value of what is asked' },
    no_se_entiende: { es: 'No entiendo ese número. Escríbelo solo con cifras y coma o punto.', en: 'I can’t read that number. Use digits and a comma or a point only.' },
  },
  plan: {
    nombre: { es: '¿Qué planteamiento?', en: 'Which set-up?' },
    detalle: { es: 'Elige la regla de tres bien planteada', en: 'Choose the correct rule of three' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>La <strong>regla de tres</strong> se plantea con <strong>dos filas</strong>: en la misma columna van las cantidades <strong>de lo mismo</strong>, y la <strong>x</strong> va donde está lo que piden. Después se multiplica <strong>en cruz</strong>.</p>
        <p>Por ejemplo: 4 kg cuestan 10 €; ¿cuánto cuestan 6 kg? Filas: <strong>4 kg → 10 €</strong> y <strong>6 kg → x</strong>. En cruz: <strong>x = 10 · 6 : 4 = 15 €</strong>.</p>
        <p>Aquí <strong>no calculas el resultado</strong>: solo eliges el planteamiento. Fíjate en las dos filas <strong>y</strong> en la cuenta.</p>`,
      en: `<h2>How it works</h2>
        <p>The <strong>rule of three</strong> uses <strong>two rows</strong>: amounts of the <strong>same thing</strong> go in the same column, and <strong>x</strong> goes where the thing you are asked for is. Then multiply <strong>across</strong>.</p>
        <p>For example: 4 kg cost €10; how much do 6 kg cost? Rows: <strong>4 kg → €10</strong> and <strong>6 kg → x</strong>. Across: <strong>x = 10 · 6 : 4 = €15</strong>.</p>
        <p>Here you <strong>do not work out the answer</strong>: you only choose the set-up. Look at the two rows <strong>and</strong> at the calculation.</p>`,
    },
  },
  contesta: {
    nombre: { es: 'Resuelve y contesta', en: 'Solve and answer' },
    detalle: { es: 'Calcula, y di el número y la unidad', en: 'Work it out and give the number and the unit' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Resuelves el problema con la <strong>regla de tres</strong> (o yendo a 1, como prefieras) y contestas con <strong>el número y la unidad</strong>. Hay problemas que preguntan por lo que cuesta algo y otros por <strong>cuántos</strong> se pueden comprar.</p>
        <p>Por ejemplo: 4 kg cuestan 10 € y quieres saber cuántos kg compras con 15 €: <strong>x = 4 · 15 : 10 = 6</strong>. La respuesta son <strong>6 kg</strong>, no 6 €.</p>
        <p>Escribes el número y eliges la unidad entre los tres botones.</p>`,
      en: `<h2>How it works</h2>
        <p>Solve the problem with the <strong>rule of three</strong> (or by going to 1, as you prefer) and answer with <strong>the number and the unit</strong>. Some problems ask what something costs and others ask <strong>how many</strong> you can buy.</p>
        <p>For example: 4 kg cost €10 and you want to know how many kg you can buy for €15: <strong>x = 4 · 15 : 10 = 6</strong>. The answer is <strong>6 kg</strong>, not €6.</p>
        <p>Write the number and choose the unit from the three buttons.</p>`,
    },
    unidad: { es: 'Unidad de la respuesta', en: 'Unit of the answer' },
    campo: { es: 'Tu respuesta (número)', en: 'Your answer (number)' },
  },
  sentido: {
    nombre: { es: '¿Tiene sentido?', en: 'Does it make sense?' },
    detalle: { es: 'Decide si una solución es creíble y por qué no', en: 'Decide whether an answer is believable, and why not' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Antes de calcular, o al terminar, pregúntate: <strong>¿tiene sentido?</strong> En proporcionalidad directa, con <strong>más</strong> cantidad sale <strong>más</strong>; con menos, menos. La <strong>unidad</strong> tiene que ser la de lo que piden, y el número tiene que ser <strong>creíble</strong>.</p>
        <p>Por ejemplo: 2 kg de naranjas cuestan 3 €. «3 kg cuestan <strong>2 €</strong>» <strong>va al revés</strong>; «3 kg cuestan <strong>4,50 kg</strong>» tiene <strong>mala la unidad</strong>; «3 kg cuestan <strong>450 €</strong>» es <strong>demasiado grande</strong>.</p>
        <p>Te dan una solución: eliges si está bien o, si no, el motivo. Solo hay un motivo en cada una.</p>`,
      en: `<h2>How it works</h2>
        <p>Before calculating, or when you finish, ask yourself: <strong>does it make sense?</strong> In direct proportion, <strong>more</strong> gives <strong>more</strong>; less gives less. The <strong>unit</strong> must be the one asked for, and the number must be <strong>believable</strong>.</p>
        <p>For example: 2 kg of oranges cost €3. “3 kg cost <strong>€2</strong>” <strong>goes the wrong way</strong>; “3 kg cost <strong>4.50 kg</strong>” has the <strong>wrong unit</strong>; “3 kg cost <strong>€450</strong>” is <strong>far too big</strong>.</p>
        <p>You are given an answer: choose whether it is right or, if not, the reason. Each one has only one reason.</p>`,
    },
  },
};
