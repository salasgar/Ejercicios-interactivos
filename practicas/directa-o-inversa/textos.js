// Los textos de «¿Directa, inversa o ninguna?» (PU2, tarea 216): enunciados, introducciones, explicaciones del
// botón «No lo sé» y feedback de cada fallo, en español y en inglés (inglés sencillo, con lo difícil entre paréntesis).

import { numeroATexto, aTexto, cantidad, enunciado as enunciadoCtx } from '../_comun/proporcion.js';
import { fraccion } from '../_comun/fracciones.js';
import { situacionDe, ctxDe, val, valorDe, Q, errorDe } from './logica.js';

const NBSP = ' ';
const cuentaHtml = c => `<span class="cuenta">${c}</span>`;
const n = (v, idioma, cifras = null) => numeroATexto(typeof v === 'number' ? fraccion(v, 1) : v, idioma, cifras === null ? {} : { cifras });
const L = (es, en) => ({ es, en });

/** 5 con su unidad: «5 kg», «8 €» (en inglés, «€8»). */
export function con(num, u, idioma) {
  const s = n(num, idioma, u === '€' ? 2 : null);
  return u === '€' ? (idioma === 'en' ? `€${s}` : `${s}${NBSP}€`) : `${s}${NBSP}${u}`;
}

export const CLASE = Object.freeze({
  directa: L('Directa', 'Direct'),
  inversa: L('Inversa', 'Inverse'),
  ninguna: L('Ninguna de las dos', 'Neither'),
});
const ES_COMO = {
  directa: L('es <strong>directa</strong>', 'it is <strong>direct</strong>'),
  inversa: L('es <strong>inversa</strong>', 'it is <strong>inverse</strong>'),
  ninguna: L('<strong>no es ni directa ni inversa</strong>', 'it is <strong>neither direct nor inverse</strong>'),
};
const RESPUESTA = {
  directa: L('directa', 'direct'), inversa: L('inversa', 'inverse'), ninguna: L('ninguna de las dos', 'neither'),
};
const NOMBRE_CLASE = {
  directa: L('directa', 'direct'),
  inversa: L('inversa', 'inverse'),
  ninguna: L('ni directa ni inversa', 'neither direct nor inverse'),
};

// ─── Ejercicio 1: la situación ─────────────────────────────────────────────────

export function enunciadoSituacion(item, idioma) {
  const s = situacionDe(item.id);
  const [pre, post] = idioma === 'es' ? ['¿Qué relación hay entre', 'y']
    : ['What is the relation between', 'and'];
  return `<p class="enunciado">${s.cond[idioma]}</p>
    <p class="instruccion">${pre} <strong>${s.x[idioma]}</strong> ${post} <strong>${s.y[idioma]}</strong>?</p>`;
}

/** Los dos pares y lo que pasa con ellos: el sentido del feedback. */
function lineasSituacion(item, idioma) {
  const s = situacionDe(item.id);
  const [x1, y1, x2, y2] = s.par;
  const p1 = `${con(x1, s.ux[idioma], idioma)} → ${con(y1, s.uy[idioma], idioma)}`;
  const p2 = `${con(x2, s.ux[idioma], idioma)} → ${con(y2, s.uy[idioma], idioma)}`;
  const veredicto = {
    directa: L('El primer número se hace el doble y el segundo también: es directa.', 'The first number doubles and so does the second: it is direct.'),
    inversa: L('El primer número se hace el doble y el segundo, la mitad: es inversa.', 'The first number doubles and the second halves: it is inverse.'),
    ninguna: L('El primer número se hace el doble y el segundo ni se hace el doble ni la mitad: no es ni directa ni inversa.',
      'The first number doubles and the second neither doubles nor halves: it is neither direct nor inverse.'),
  }[s.clase][idioma];
  return [cuentaHtml(p1), cuentaHtml(p2), veredicto];
}

export function explicaSituacion(item, idioma) {
  const [p1, p2, veredicto] = lineasSituacion(item, idioma);
  const regla = idioma === 'es'
    ? 'Compara dos casos: si una cantidad se hace el doble, mira qué le pasa a la otra.'
    : 'Compare two cases: if one amount doubles, see what happens to the other.';
  const fin = idioma === 'es' ? `La respuesta es: <strong>${RESPUESTA[item.clase].es}</strong>.` : `The answer is: <strong>${RESPUESTA[item.clase].en}</strong>.`;
  return `<p>${regla}</p><ol class="pasos-ayuda"><li>${p1}</li><li>${p2}</li><li>${veredicto}</li></ol><p>${fin}</p>`;
}

export function feedbackSituacion(item, elegida, idioma) {
  const [p1, p2, veredicto] = lineasSituacion(item, idioma);
  const lo = idioma === 'es'
    ? `Has dicho «${CLASE[elegida].es.toLowerCase()}», pero ${ES_COMO[item.clase].es}.`
    : `You said “${CLASE[elegida].en.toLowerCase()}”, but ${ES_COMO[item.clase].en}.`;
  return `<p>${lo}</p><p>${p1}; ${p2}</p><p>${veredicto}</p>`;
}

// ─── Ejercicio 2: la tabla ─────────────────────────────────────────────────────

export const enunciadoTabla = (item, idioma) => `
  <p class="instruccion instruccion--enunciado">${idioma === 'es' ? 'Mira la tabla. ¿Qué relación hay entre <strong>x</strong> e <strong>y</strong>?' : 'Look at the table. What is the relation between <strong>x</strong> and <strong>y</strong>?'}</p>
  <div class="tabla-valores-envoltura"><table class="tabla-valores"><tbody>
    <tr><th scope="row">x</th>${item.xs.map(v => `<td>${v}</td>`).join('')}</tr>
    <tr><th scope="row">y</th>${item.ys.map(v => `<td>${v}</td>`).join('')}</tr>
  </tbody></table></div>`;

const exacto = (num, den) => { const f = fraccion(num, den).simplificar(); return 100 % f.den === 0; };
const decimal = (num, den, idioma) => n(fraccion(num, den).simplificar(), idioma);

function lineasTabla(item, idioma) {
  const { xs, ys, clase } = item;
  const M = '·', D = ':';
  const cocientes = xs.map((x, i) => `${ys[i]} ${D} ${x} = ${decimal(ys[i], x, idioma)}`);
  const productos = xs.map((x, i) => `${x} ${M} ${ys[i]} = ${n(x * ys[i], idioma)}`);
  if (clase === 'directa') {
    return { lineas: cocientes, veredicto: idioma === 'es'
      ? `Siempre sale ${decimal(ys[0], xs[0], idioma)} (el cociente y : x es constante): es directa.`
      : `It is always ${decimal(ys[0], xs[0], idioma)} (the quotient y : x is constant): it is direct.` };
  }
  if (clase === 'inversa') {
    return { lineas: productos, veredicto: idioma === 'es'
      ? `Siempre sale ${n(xs[0] * ys[0], idioma)} (el producto x · y es constante): es inversa.`
      : `It is always ${n(xs[0] * ys[0], idioma)} (the product x · y is constant): it is inverse.` };
  }
  const exactos = xs.map((x, i) => (exacto(ys[i], x) ? cocientes[i] : null)).filter(Boolean).slice(0, 2);
  return { lineas: [...productos, ...exactos], veredicto: idioma === 'es'
    ? 'Los productos x · y no son iguales y los cocientes y : x tampoco: no es ni directa ni inversa.'
    : 'The products x · y are not equal and neither are the quotients y : x: it is neither direct nor inverse.' };
}

export function explicaTabla(item, idioma) {
  const { lineas, veredicto } = lineasTabla(item, idioma);
  const regla = idioma === 'es'
    ? 'Directa: y : x sale siempre igual. Inversa: x · y sale siempre igual. Si no, ninguna.'
    : 'Direct: y : x is always the same. Inverse: x · y is always the same. If not, neither.';
  const fin = idioma === 'es' ? `La respuesta es: <strong>${RESPUESTA[item.clase].es}</strong>.` : `The answer is: <strong>${RESPUESTA[item.clase].en}</strong>.`;
  return `<p>${regla}</p><ol class="pasos-ayuda">${lineas.map(l => `<li>${cuentaHtml(l)}</li>`).join('')}<li>${veredicto}</li></ol><p>${fin}</p>`;
}

export function feedbackTabla(item, elegida, idioma) {
  const { lineas, veredicto } = lineasTabla(item, idioma);
  const lo = idioma === 'es'
    ? `Has dicho «${CLASE[elegida].es.toLowerCase()}», pero ${ES_COMO[item.clase].es}.`
    : `You said “${CLASE[elegida].en.toLowerCase()}”, but ${ES_COMO[item.clase].en}.`;
  return `<p>${lo}</p><ol class="pasos-ayuda">${lineas.map(l => `<li>${cuentaHtml(l)}</li>`).join('')}</ol><p>${veredicto}</p>`;
}

// ─── Ejercicio 3: el planteamiento ─────────────────────────────────────────────

const UNIDAD_TEXTO = {
  '€': L('euros', 'euros'), g: L('gramos', 'grams'), L: L('litros', 'litres'), mL: L('mililitros', 'millilitres'),
  kg: L('kilos', 'kilos'), km: L('kilómetros', 'kilometres'),
};
const unidadPlural = (item, clave, idioma) => {
  const spec = ctxDe(item.ctx).datos[clave];
  return spec.etiqueta ? spec.etiqueta[idioma][1] : (UNIDAD_TEXTO[spec.unidad]?.[idioma] ?? spec.unidad);
};

export function enunciadoPlan(item, idioma) {
  const datos = { a: Q(item, 'a'), b: Q(item, 'b'), c: Q(item, 'c') };
  const texto = enunciadoCtx(ctxDe(item.ctx), datos, idioma);
  const pregunta = idioma === 'es' ? '¿Qué cuenta da el resultado?' : 'Which working gives the answer?';
  return `<p class="instruccion instruccion--enunciado">${texto}</p><p class="instruccion"><strong>${pregunta}</strong></p>`;
}

const numClave = (item, clave, idioma) => {
  const spec = ctxDe(item.ctx).datos[clave];
  return n(val(item[clave]), idioma, spec.unidad === '€' ? 2 : null);
};

/** La cuenta de un planteamiento como texto: «x = 6 · 10 : 4». */
export function cuentaTexto(item, tipo, idioma) {
  const a = numClave(item, 'a', idioma), b = numClave(item, 'b', idioma), c = numClave(item, 'c', idioma);
  const M = '·', D = ':';
  switch (tipo) {
    case 'buena': return item.sentido === 'directa' ? `x = ${b} ${M} ${c} ${D} ${a}` : `x = ${a} ${M} ${b} ${D} ${c}`;
    case 'inversa-en-directa': return `x = ${a} ${M} ${b} ${D} ${c}`;
    case 'directa-en-inversa': return `x = ${b} ${M} ${c} ${D} ${a}`;
    case 'productos-en-linea': return `x = ${a} ${M} ${c} ${D} ${b}`;
    case 'razonar-sumando': {
      const va = val(item.a), vc = val(item.c);
      const dif = item.sentido === 'directa' ? vc.restar(va).simplificar() : va.restar(vc).simplificar();
      const mas = dif.num >= 0;
      const abs = mas ? dif : fraccion(-dif.num, dif.den);
      return `x = ${b} ${mas ? '+' : '−'} ${n(abs, idioma)}`;
    }
    default: throw new Error(`Planteamiento desconocido: ${tipo}`);
  }
}

/** «Más kilos, más euros: es directa»: el sentido, que es lo primero que hay que ver. */
export function sentidoTexto(item, idioma) {
  const a = Q(item, 'a'), c = Q(item, 'c');
  const mas = c.valor.num * a.valor.den > a.valor.num * c.valor.den;
  const ub = unidadPlural(item, 'b', idioma);
  const T = idioma === 'es' ? { mas: 'más', menos: 'menos' } : { mas: 'more', menos: 'less' };
  const M = mas ? T.mas : T.menos;
  const O = item.sentido === 'directa' ? M : (mas ? T.menos : T.mas);
  const A = aTexto(a, idioma), C = aTexto(c, idioma);
  if (idioma === 'es') {
    return item.sentido === 'directa'
      ? `De ${A} a ${C}: ${M}. Con ${M} sale ${O} (${ub}): es directa.`
      : `De ${A} a ${C}: ${M}. Con ${M} sale ${O} (${ub}): es inversa.`;
  }
  const [up, down] = ['goes up', 'goes down'];
  const m = mas ? up : down, o = (item.sentido === 'directa') === mas ? up : down;
  return `From ${A} to ${C}: it ${m}. So the result (${ub}) ${o}: it is ${item.sentido === 'directa' ? 'direct' : 'inverse'}.`;
}

const FALLO = {
  'inversa-en-directa': L('Has usado la cuenta de la inversa, pero este problema es directo: con más, sale más.', 'You used the inverse working, but this problem is direct: more gives more.'),
  'directa-en-inversa': L('Has usado la cuenta de la directa, pero este problema es inverso: con más, sale menos.', 'You used the direct working, but this problem is inverse: more gives less.'),
  'productos-en-linea': L('Has puesto los números en las operaciones equivocadas: fíjate en cuál va dividiendo.', 'You put the numbers in the wrong operations: check which one divides.'),
  'razonar-sumando': L('Has sumado o restado: en proporcionalidad se multiplica y se divide.', 'You added or subtracted: in proportion we multiply and divide.'),
};

const resultadoTexto = (item, idioma) => {
  const spec = ctxDe(item.ctx).datos.d;
  const v = valorDe(item, 'buena');
  if (spec.etiqueta) return `${n(v, idioma)} ${spec.etiqueta[idioma][v.equals(fraccion(1)) ? 0 : 1]}`;
  return aTexto(cantidad(v, spec.unidad ?? null), idioma);
};

export function explicaPlan(item, idioma) {
  const cuenta = cuentaTexto(item, 'buena', idioma);
  const fin = idioma === 'es' ? `La respuesta es la cuenta <strong>${cuenta}</strong>.` : `The answer is the working <strong>${cuenta}</strong>.`;
  const reg = idioma === 'es'
    ? (item.sentido === 'directa' ? 'Directa: multiplicas lo del lado de lo que buscas y divides entre su pareja.' : 'Inversa: multiplicas los dos datos que conoces y divides entre el nuevo.')
    : (item.sentido === 'directa' ? 'Direct: multiply and divide the numbers across.' : 'Inverse: multiply the two known numbers and divide by the new one.');
  return `<ol class="pasos-ayuda"><li>${sentidoTexto(item, idioma)}</li><li>${reg}</li><li>${cuentaHtml(`${cuenta} = ${resultadoTexto(item, idioma)}`)}</li></ol><p>${fin}</p>`;
}

export function feedbackPlan(item, tipo, idioma) {
  const lo = idioma === 'es' ? `Has elegido ${cuentaHtml(cuentaTexto(item, tipo, idioma))}.` : `You chose ${cuentaHtml(cuentaTexto(item, tipo, idioma))}.`;
  const ok = idioma === 'es' ? `La cuenta buena es ${cuentaHtml(cuentaTexto(item, 'buena', idioma))} y da ${resultadoTexto(item, idioma)}.`
    : `The right working is ${cuentaHtml(cuentaTexto(item, 'buena', idioma))} and gives ${resultadoTexto(item, idioma)}.`;
  return `<p>${sentidoTexto(item, idioma)}</p><p>${lo} ${FALLO[tipo][idioma]}</p><p>${ok}</p>`;
}

export { errorDe };

// ─── Textos de la práctica ─────────────────────────────────────────────────────

export const TX = {
  no_se_hacerlo: L('No sé hacerlo', 'I don’t know how'),
  situacion: {
    nombre: L('Clasifica la situación', 'Sort the situation'),
    detalle: L('Directa, inversa o ninguna de las dos', 'Direct, inverse or neither'),
    introduccion: L(
      `<h2>Cómo se hace</h2>
       <p>Dos cantidades son <strong>directamente proporcionales</strong> si, al hacerse una el doble, la otra también se hace el doble. Son <strong>inversamente proporcionales</strong> si, al hacerse una el doble, la otra se hace la <strong>mitad</strong>. Si no pasa ni lo uno ni lo otro, <strong>no son proporcionales</strong>.</p>
       <p>Por ejemplo: con el doble de obreros (al mismo ritmo) se tarda la mitad de días: es <strong>inversa</strong>. Con el doble de kilos de naranjas pagas el doble: es <strong>directa</strong>. Pero la edad y la altura de una niña no son ni una cosa ni la otra.</p>
       <p>Lee la situación, fíjate en lo que se mantiene igual («mismo precio», «al mismo ritmo») y elige una de las tres casillas.</p>`,
      `<h2>How it works</h2>
       <p>Two amounts are <strong>directly proportional</strong> if, when one doubles, the other also doubles. They are <strong>inversely proportional</strong> if, when one doubles, the other becomes <strong>half</strong>. If neither happens, they are <strong>not proportional</strong>.</p>
       <p>For example: with twice as many workers (at the same rate) the job takes half the days: it is <strong>inverse</strong>. With twice the kilos of oranges you pay twice as much: it is <strong>direct</strong>. But a girl’s age and height are neither.</p>
       <p>Read the situation, look at what stays the same (“same price”, “same rate”) and choose one of the three boxes.</p>`),
  },
  tabla: {
    nombre: L('Clasifica la tabla', 'Sort the table'),
    detalle: L('Cociente constante, producto constante o ninguno', 'Constant quotient, constant product or neither'),
    introduccion: L(
      `<h2>Cómo se hace</h2>
       <p>En una tabla puedes <strong>calcular</strong> para saberlo:</p>
       <ul><li>Si <strong>y : x</strong> sale siempre igual, es <strong>directa</strong>.</li><li>Si <strong>x · y</strong> sale siempre igual, es <strong>inversa</strong>.</li><li>Si no sale igual, es <strong>ninguna de las dos</strong>.</li></ul>
       <p>Por ejemplo: x = 2, 4 e y = 6, 12. Como 6 : 2 = 3 y 12 : 4 = 3, es <strong>directa</strong>. Con y = 6, 3 saldría 2 · 6 = 12 y 4 · 3 = 12: <strong>inversa</strong>.</p>
       <p>Cuidado: que las dos cantidades suban a la vez no basta para que sea directa. Hay que comprobar los cálculos.</p>`,
      `<h2>How it works</h2>
       <p>In a table you can <strong>calculate</strong> to find out:</p>
       <ul><li>If <strong>y : x</strong> is always the same, it is <strong>direct</strong>.</li><li>If <strong>x · y</strong> is always the same, it is <strong>inverse</strong>.</li><li>If it is not the same, it is <strong>neither</strong>.</li></ul>
       <p>For example: x = 2, 4 and y = 6, 12. Since 6 : 2 = 3 and 12 : 4 = 3, it is <strong>direct</strong>. With y = 6, 3 you would get 2 · 6 = 12 and 4 · 3 = 12: <strong>inverse</strong>.</p>
       <p>Careful: both amounts going up together is not enough for it to be direct. You have to check the calculations.</p>`),
  },
  plan: {
    nombre: L('¿Qué planteamiento?', 'Which set-up?'),
    detalle: L('Elige la cuenta que resuelve el problema', 'Choose the working that solves the problem'),
    introduccion: L(
      `<h2>Cómo se hace</h2>
       <p>Primero mira si el problema es <strong>directo</strong> (con más, sale más) o <strong>inverso</strong> (con más, sale menos). Después elige la cuenta:</p>
       <ul><li><strong>Directo</strong>: x = lo que ya sabes de un lado · el número nuevo : su pareja.</li><li><strong>Inverso</strong>: x = los dos datos que conoces multiplicados : el número nuevo.</li></ul>
       <p>Por ejemplo: 6 obreros tardan 10 días. ¿Y 4 obreros? Con menos obreros se tarda más: es inverso. La cuenta es <strong>x = 6 · 10 : 4</strong> (son 15 días).</p>
       <p>Aquí <strong>no calculas</strong> el resultado: solo eliges la cuenta. Las opciones enseñan la cuenta, no el resultado.</p>`,
      `<h2>How it works</h2>
       <p>First see if the problem is <strong>direct</strong> (more gives more) or <strong>inverse</strong> (more gives less). Then choose the working:</p>
       <ul><li><strong>Direct</strong>: x = what you know on one side · the new number : its pair.</li><li><strong>Inverse</strong>: x = the two known numbers multiplied : the new number.</li></ul>
       <p>For example: 6 workers take 10 days. What about 4 workers? With fewer workers it takes more days: it is inverse. The working is <strong>x = 6 · 10 : 4</strong> (that is 15 days).</p>
       <p>Here you <strong>do not calculate</strong> the result: you only choose the working. The options show the working, not the result.</p>`),
  },
};
