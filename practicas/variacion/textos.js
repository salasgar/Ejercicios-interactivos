// Práctica «Subidas, bajadas y diferencias» (unidad 3): textos propios, siempre en español y en inglés.
// Las frases se construyen con el contexto y los números del ítem (`txt(idioma)`).
//
// Reglas: el menos que se ve es U+2212 (`fmt`); producto con «·» y división con «:»; inglés sencillo, con
// la palabra que decide la respuesta aclarada entre paréntesis (vocabulario de U3-4B-02: balance, how much
// warmer, higher, a. C. / d. C.), salvo donde es justo lo que se evalúa.

import { fmt, fmtPar } from '../_comun/enteros.js';
import { terminos, nombreError, PARES } from './logica.js';

export const NOMBRES = {
  nombre: [
    { es: '¿Cuánto ha cambiado?', en: 'How much has it changed?' },
    { es: 'La diferencia', en: 'The difference' },
    { es: 'El dato que falta', en: 'The missing piece' },
    { es: 'Antes y después de Cristo', en: 'BC and AD' },
    { es: 'Del enunciado a la cuenta', en: 'From words to a calculation' },
  ],
  detalle: [
    { es: 'Valor inicial y valor final: ¿qué ha pasado?', en: 'Start value and end value: what happened?' },
    { es: 'La diferencia entre dos temperaturas, dos plantas o dos alturas', en: 'The difference between two temperatures, two floors or two heights' },
    { es: 'Calcula dónde acaba o dónde estaba', en: 'Work out where it ends or where it was' },
    { es: 'Años entre dos fechas, a. C. o d. C. (no hubo año 0)', en: 'Years between two dates, BC or AD (there was no year 0)' },
    { es: 'Elige la cuenta, prevé el signo y calcula', en: 'Choose the calculation, predict the sign and work it out' },
  ],
};

export const INTRODUCCION = [
  {
    es: '<p>La <strong>variación</strong> es lo que cambia un valor: <strong>final − inicial</strong>. Si es positiva, ha subido; si es negativa, ha bajado.</p><p><strong>Ejemplo:</strong> de −3 °C a 5 °C: 5 − (−3) = 8. La temperatura ha subido 8 grados.</p><p>Elige la frase que dice lo que ha pasado.</p>',
    en: '<p>The <strong>change</strong> is how much a value moves: <strong>end − start</strong>. If it is positive, it went up; if it is negative, it went down.</p><p><strong>Example:</strong> from −3 °C to 5 °C: 5 − (−3) = 8. The temperature went up 8 degrees.</p><p>Choose the sentence that says what happened.</p>',
  },
  {
    es: '<p>Para saber <strong>cuánto más</strong> es un valor que otro, se resta el mayor menos el menor.</p><p><strong>Ejemplo:</strong> un ascensor sube de la planta −2 a la 5: 5 − (−2) = 7. Sube 7 plantas.</p><p>Escribe el resultado.</p>',
    en: '<p>To find out <strong>how much more</strong> one value is than another, subtract: the bigger one minus the smaller one.</p><p><strong>Example:</strong> a lift goes up from floor −2 to floor 5: 5 − (−2) = 7. It goes up 7 floors.</p><p>Write the result.</p>',
  },
  {
    es: '<p>Si sabes <strong>dónde empieza</strong> y <strong>cuánto cambia</strong>, sumas la variación. Si sabes dónde acaba, haces la operación al revés.</p><p><strong>Ejemplo:</strong> estaba a −12 m y baja 3 m: −12 − 3 = −15 m.</p><p>Escribe el número que falta.</p>',
    en: '<p>If you know <strong>where it starts</strong> and <strong>how much it changes</strong>, you add the change. If you know where it ends, you do the operation the other way round.</p><p><strong>Example:</strong> it was at −12 m and goes down 3 m: −12 − 3 = −15 m.</p><p>Write the missing number.</p>',
  },
  {
    es: '<p>Los años a. C. se cuentan hacia atrás: el 500 a. C. es <strong>más antiguo</strong> que el 200 a. C. Entre dos años de la misma era, se resta el mayor menos el menor.</p><p><strong>Ejemplo:</strong> del 500 a. C. al 200 a. C. pasaron 500 − 200 = 300 años.</p><p><strong>Ojo:</strong> no hubo año 0. Si una fecha es a. C. y la otra d. C., se resta como si los a. C. fueran negativos y <strong>se quita 1</strong>: del 50 a. C. al 30 d. C. pasaron 30 − (−50) − 1 = 79 años.</p>',
    en: '<p>BC years are counted backwards: 500 BC (a. C.) is <strong>older</strong> than 200 BC. Between two years of the same era, subtract the bigger number minus the smaller one.</p><p><strong>Example:</strong> from 500 BC to 200 BC, 500 − 200 = 300 years went by.</p><p><strong>Careful:</strong> there was no year 0. If one date is BC (a. C.) and the other is AD (d. C.), subtract as if the BC years were negative and <strong>take 1 away</strong>: from 50 BC to 30 AD, 30 − (−50) − 1 = 79 years went by.</p>',
  },
  {
    es: '<p>Cada problema se hace en tres pasos: elegir la <strong>cuenta</strong> que lo resuelve, <strong>prever el signo</strong> del resultado y <strong>calcular</strong>.</p><p><strong>Ejemplo:</strong> «Tenía 10 €, gasté 4 € e ingresé 2 €»: 10 − 4 + 2. Sale positivo, y es 8.</p><p>Los verbos <strong>subir, ingresar</strong> suman; <strong>bajar, gastar</strong> restan.</p>',
    en: '<p>Each problem has three steps: choose the <strong>calculation</strong> that solves it, <strong>predict the sign</strong> of the result and <strong>work it out</strong>.</p><p><strong>Example:</strong> “I had €10, I spent €4 and I paid in €2”: 10 − 4 + 2. It is positive, and it is 8.</p><p>The verbs <strong>go up, pay in</strong> add; <strong>go down, spend</strong> subtract.</p>',
  },
];

const L = (idioma, es, en) => (idioma === 'en' ? en : es);

/** Cantidad con su unidad según el contexto: «3 grados», «1 planta», «20 €», «5 m». */
function cant(ctx, k, idioma) {
  switch (ctx) {
    case 'temperatura': return L(idioma, `${k} ${k === 1 ? 'grado' : 'grados'}`, `${k} ${k === 1 ? 'degree' : 'degrees'}`);
    case 'planta': return L(idioma, `${k} ${k === 1 ? 'planta' : 'plantas'}`, `${k} ${k === 1 ? 'floor' : 'floors'}`);
    case 'saldo': return `${k} €`;
    default: return `${k} m`;
  }
}
/** Un valor con su unidad: «−3 °C», «la planta −2» (sin unidad), «−20 €», «−12 m». */
const valor = (ctx, n) => (ctx === 'temperatura' ? `${fmt(n)} °C` : ctx === 'saldo' ? `${fmt(n)} €` : ctx === 'buceo' ? `${fmt(n)} m` : fmt(n));
const sube = (idioma, dir) => L(idioma, dir > 0 || dir === 'sube' ? 'subido' : 'bajado', dir > 0 || dir === 'sube' ? 'up' : 'down');
const subio = (idioma, dir, ctx) => (ctx === 'saldo' ? L(idioma, dir > 0 ? 'ingresé' : 'gasté', dir > 0 ? 'paid in' : 'spent') : L(idioma, dir > 0 ? 'subió' : 'bajó', dir > 0 ? 'went up' : 'went down'));
const ERA = { aC: { es: 'a. C.', en: 'BC (a. C.)' }, dC: { es: 'd. C.', en: 'AD (d. C.)' } };
const tt = (o, idioma) => o[idioma];

export function txt(idioma) {
  const i18 = idioma;
  return {
    // Ejercicio 1
    cambio: {
      orden: L(i18, '¿Qué ha pasado?', 'What happened?'),
      enunciado: ({ ctx, i, f }) => ({
        temperatura: L(i18, `Ayer a mediodía la temperatura era de ${valor(ctx, i)} y hoy a mediodía es de ${valor(ctx, f)}.`, `Yesterday at noon the temperature was ${valor(ctx, i)} and today at noon it is ${valor(ctx, f)}.`),
        planta: L(i18, `El ascensor estaba en la planta ${fmt(i)} y ahora está en la planta ${fmt(f)}.`, `The lift was on floor ${fmt(i)} and now it is on floor ${fmt(f)}.`),
        saldo: L(i18, `Mi saldo era de ${valor(ctx, i)} y ahora es de ${valor(ctx, f)}.`, `My balance (saldo) was ${valor(ctx, i)} and now it is ${valor(ctx, f)}.`),
        buceo: L(i18, `Un buceador estaba a ${valor(ctx, i)} y ahora está a ${valor(ctx, f)}.`, `A diver was at ${valor(ctx, i)} and now is at ${valor(ctx, f)}.`),
      })[ctx],
      frase: (ctx, dir, k) => ({
        temperatura: L(i18, `La temperatura ha ${sube(i18, dir)} ${cant(ctx, k, 'es')}.`, `The temperature went ${sube(i18, dir)} ${cant(ctx, k, 'en')}.`),
        planta: L(i18, `El ascensor ha ${sube(i18, dir)} ${cant(ctx, k, 'es')}.`, `The lift went ${sube(i18, dir)} ${cant(ctx, k, 'en')}.`),
        saldo: L(i18, `El saldo ha ${sube(i18, dir)} ${cant(ctx, k, 'es')}.`, `The balance (saldo) went ${sube(i18, dir)} ${cant(ctx, k, 'en')}.`),
        buceo: L(i18, `El buceador ha ${sube(i18, dir)} ${cant(ctx, k, 'es')}.`, `The diver went ${sube(i18, dir)} ${cant(ctx, k, 'en')}.`),
      })[ctx],
      explica: ({ ctx, i, f, v }) => {
        const cuenta = `${fmt(f)} − ${fmtPar(i)} = ${fmt(v)}`;
        return L(i18, `${cuenta}. La variación es ${v > 0 ? 'positiva: ha subido' : 'negativa: ha bajado'} ${cant(ctx, Math.abs(v), 'es')}.`,
          `${cuenta}. The change is ${v > 0 ? 'positive: it went up' : 'negative: it went down'} ${cant(ctx, Math.abs(v), 'en')}.`);
      },
    },
    // Ejercicio 2
    diferencia: {
      enunciado: ({ par, lo, hi }) => ({
        temperatura: L(i18, `Hoy hay ${valor('temperatura', lo)} en ${PARES[par].bajo.es} y ${valor('temperatura', hi)} en ${PARES[par].alto.es}. ¿Cuántos grados más hace en ${PARES[par].alto.es} que en ${PARES[par].bajo.es}?`,
          `Today it is ${valor('temperatura', lo)} in ${PARES[par].bajo.en} and ${valor('temperatura', hi)} in ${PARES[par].alto.en}. How much warmer is it in ${PARES[par].alto.en} than in ${PARES[par].bajo.en}? (in degrees)`),
        planta: L(i18, `Un ascensor sube de la planta ${fmt(lo)} a la planta ${hi}. ¿Cuántas plantas sube?`, `A lift goes up from floor ${fmt(lo)} to floor ${hi}. How many floors does it go up?`),
        altura: L(i18, `Un pueblo está a ${fmt(lo)} m y una montaña a ${hi} m (los metros negativos son bajo el nivel del mar). ¿Cuántos metros más alta es la montaña?`,
          `A village is at ${fmt(lo)} m and a mountain at ${hi} m. Negative metres are below sea level (bajo el nivel del mar). How much higher is the mountain, in metres?`),
      })[PARES[par].tipo],
      explica: ({ lo, hi, d }) => L(i18, `${hi} − ${fmtPar(lo)} = ${d}. La diferencia es ${d}.`, `${hi} − ${fmtPar(lo)} = ${d}. The difference is ${d}.`),
    },
    // Ejercicio 3
    falta: {
      enunciado: ({ ctx, subtipo, x, dir, k }) => {
        const c = cant(ctx, k, i18);
        const f = subtipo === 'final' ? {
          temperatura: L(i18, `Ayer a mediodía la temperatura era de ${valor(ctx, x)}. Hoy, a la misma hora, ha ${sube(i18, dir)} ${c}. ¿Qué temperatura hace ahora?`, `Yesterday at noon the temperature was ${valor(ctx, x)}. Today, at the same time, it went ${sube(i18, dir)} ${c}. What is the temperature now?`),
          planta: L(i18, `El ascensor estaba en la planta ${fmt(x)}. ${dir > 0 ? 'Sube' : 'Baja'} ${c}. ¿En qué planta está ahora?`, `The lift was on floor ${fmt(x)}. It goes ${dir > 0 ? 'up' : 'down'} ${c}. Which floor is it on now?`),
          saldo: L(i18, `Mi saldo era de ${valor(ctx, x)}. Después ${subio(i18, dir, ctx)} ${c}. ¿Cuál es mi saldo ahora?`, `My balance (saldo) was ${valor(ctx, x)}. Then I ${subio(i18, dir, ctx)} ${c}. What is my balance now?`),
          buceo: L(i18, `Un buceador estaba a ${valor(ctx, x)}. ${dir > 0 ? 'Sube' : 'Baja'} ${c}. ¿A qué altura está ahora?`, `A diver was at ${valor(ctx, x)}. They go ${dir > 0 ? 'up' : 'down'} ${c}. What height are they at now?`),
        } : {
          temperatura: L(i18, `Desde ayer a mediodía la temperatura ha ${sube(i18, dir)} ${c} y hoy a mediodía es de ${valor(ctx, x)}. ¿Qué temperatura hacía ayer?`, `Since yesterday at noon the temperature went ${sube(i18, dir)} ${c} and today at noon it is ${valor(ctx, x)}. What was the temperature yesterday?`),
          planta: L(i18, `El ascensor ${subio(i18, dir, ctx)} ${c} y ahora está en la planta ${fmt(x)}. ¿En qué planta estaba antes?`, `The lift ${subio(i18, dir, ctx)} ${c} and now it is on floor ${fmt(x)}. Which floor was it on before?`),
          saldo: L(i18, `${dir > 0 ? 'Ingresé' : 'Gasté'} ${c} y ahora mi saldo es de ${valor(ctx, x)}. ¿Cuál era antes?`, `I ${subio(i18, dir, ctx)} ${c} and now my balance (saldo) is ${valor(ctx, x)}. What was it before?`),
          buceo: L(i18, `Un buceador ${subio(i18, dir, ctx)} ${c} y ahora está a ${valor(ctx, x)}. ¿A qué altura estaba antes?`, `A diver ${subio(i18, dir, ctx)} ${c} and now is at ${valor(ctx, x)}. What height were they at before?`),
        };
        return f[ctx];
      },
      explica: ({ subtipo, x, dir, k, r }) => {
        const cuenta = subtipo === 'final' ? `${fmt(x)} ${dir > 0 ? '+' : '−'} ${k} = ${fmt(r)}` : `${fmt(x)} ${dir > 0 ? '−' : '+'} ${k} = ${fmt(r)}`;
        return L(i18, `${cuenta}.${subtipo === 'inicial' ? ' Se hace la operación al revés.' : ''}`, `${cuenta}.${subtipo === 'inicial' ? ' You do the operation the other way round.' : ''}`);
      },
    },
    // Ejercicio 4
    anios: {
      enunciado: ({ era, a, b }) => {
        const [ea, eb] = era === 'cruza' ? ['aC', 'dC'] : [era, era];
        return L(i18,
          `Una vasija es del año ${a} ${ERA[ea].es} y una moneda, del año ${b} ${ERA[eb].es}: ¿cuántos años pasaron entre las dos?`,
          `A pot is from the year ${a} ${ERA[ea].en} and a coin is from the year ${b} ${ERA[eb].en}: how many years passed between the two?`);
      },
      explica: ({ era, a, b, d }) => (era === 'cruza'
        ? L(i18, `Del ${a} a. C. al 1 a. C. hay ${a - 1} años; del 1 a. C. al 1 d. C., uno; y del 1 d. C. al ${b} d. C., ${b - 1}. Con la cuenta: ${b} − ${fmtPar(-a)} = ${a + b}, y como no hubo año 0, se quita 1: ${d} años.`,
          `From ${a} BC to 1 BC there are ${a - 1} years; from 1 BC to 1 AD, one; and from 1 AD to ${b} AD, ${b - 1}. With the calculation: ${b} − ${fmtPar(-a)} = ${a + b}, and since there was no year 0, take 1 away: ${d} years.`)
        : L(i18, `${Math.max(a, b)} − ${Math.min(a, b)} = ${d} años.`, `${Math.max(a, b)} − ${Math.min(a, b)} = ${d} years.`)),
    },
    // Ejercicio 5
    cuenta: {
      qCuenta: L(i18, '¿Qué cuenta resuelve el problema?', 'Which calculation solves the problem?'),
      qSigno: L(i18, 'Antes de calcular: ¿el resultado será positivo o negativo?', 'Before you work it out: will the result be positive or negative?'),
      qResultado: L(i18, 'Calcula el resultado:', 'Work out the result:'),
      positivo: L(i18, 'Positivo', 'Positive'),
      negativo: L(i18, 'Negativo', 'Negative'),
      enunciado: item => {
        const { tipo, ctx } = item;
        if (tipo === 'cadena') {
          const [s, t2, t3] = item.terminos;
          const m2 = cant(ctx, Math.abs(t2), i18), m3 = cant(ctx, Math.abs(t3), i18);
          return {
            saldo: L(i18, `Mi saldo era de ${valor(ctx, s)}. ${t2 > 0 ? 'Ingresé' : 'Gasté'} ${m2}. Después ${t3 > 0 ? 'ingresé' : 'gasté'} ${m3}.`,
              `My balance (saldo) was ${valor(ctx, s)}. I ${subio(i18, t2, ctx)} ${m2}. Then I ${subio(i18, t3, ctx)} ${m3}.`),
            temperatura: L(i18, `La temperatura era de ${valor(ctx, s)}. ${t2 > 0 ? 'Subió' : 'Bajó'} ${m2}. Después ${t3 > 0 ? 'subió' : 'bajó'} ${m3}.`,
              `The temperature was ${valor(ctx, s)}. It ${subio(i18, t2, ctx)} ${m2}. Then it ${subio(i18, t3, ctx)} ${m3}.`),
            planta: L(i18, `El ascensor estaba en la planta ${fmt(s)}. ${t2 > 0 ? 'Subió' : 'Bajó'} ${m2}. Después ${t3 > 0 ? 'subió' : 'bajó'} ${m3}.`,
              `The lift was on floor ${fmt(s)}. It ${subio(i18, t2, ctx)} ${m2}. Then it ${subio(i18, t3, ctx)} ${m3}.`),
            buceo: L(i18, `Un buceador estaba a ${valor(ctx, s)}. ${t2 > 0 ? 'Subió' : 'Bajó'} ${m2}. Después ${t3 > 0 ? 'subió' : 'bajó'} ${m3}.`,
              `A diver was at ${valor(ctx, s)}. They ${subio(i18, t2, ctx)} ${m2}. Then they ${subio(i18, t3, ctx)} ${m3}.`),
          }[ctx];
        }
        if (tipo === 'producto') {
          const m = Math.abs(item.c), n = item.n, d = item.c > 0 ? 1 : -1;
          return {
            temperatura: L(i18, `La temperatura ${d > 0 ? 'sube' : 'baja'} ${m} ${m === 1 ? 'grado' : 'grados'} cada hora durante ${n} horas. ¿Cuánto cambia en total?`,
              `The temperature goes ${d > 0 ? 'up' : 'down'} ${m} ${m === 1 ? 'degree' : 'degrees'} each hour for ${n} hours. What is the total change?`),
            saldo: L(i18, `Mi saldo ${d > 0 ? 'sube' : 'baja'} ${m} € cada día durante ${n} días. ¿Cuánto cambia en total?`,
              `My balance (saldo) goes ${d > 0 ? 'up' : 'down'} €${m} each day for ${n} days. What is the total change?`),
            buceo: L(i18, `Un buceador ${d > 0 ? 'sube' : 'baja'} ${m} m cada minuto durante ${n} minutos. ¿Cuánto cambia su altura en total?`,
              `A diver goes ${d > 0 ? 'up' : 'down'} ${m} m each minute for ${n} minutes. What is the total change in height?`),
          }[ctx];
        }
        const t = Math.abs(item.total), n = item.n;
        return {
          temperatura: L(i18, `La temperatura ha bajado ${t} grados en ${n} horas, lo mismo cada hora. ¿Cuánto cambia cada hora?`,
            `The temperature has gone down ${t} degrees in ${n} hours, the same each hour. What is the change each hour?`),
          saldo: L(i18, `Mi saldo ha bajado ${t} € en ${n} días, lo mismo cada día. ¿Cuánto cambia cada día?`,
            `My balance (saldo) has gone down €${t} in ${n} days, the same each day. What is the change each day?`),
          buceo: L(i18, `Un buceador ha bajado ${t} m en ${n} minutos, lo mismo cada minuto. ¿Cuánto cambia su altura cada minuto?`,
            `A diver has gone down ${t} m in ${n} minutes, the same each minute. What is the change in height each minute?`),
        }[ctx];
      },
      explica: item => {
        const cuenta = item.opciones[item.solucion].texto;
        const signo = item.r > 0 ? L(i18, 'positivo', 'positive') : L(i18, 'negativo', 'negative');
        return L(i18, `${cuenta} = ${fmt(item.r)}. El resultado es ${signo}.`, `${cuenta} = ${fmt(item.r)}. The result is ${signo}.`);
      },
    },
    errorNombre: id => tt(nombreError(id), i18),
    se_llama: L(i18, 'Ese fallo se llama:', 'That mistake is called:'),
    /** Nombre del dibujo para el lector de pantalla (ejercicio 1). */
    dibujo: (L(i18, { termometro: 'Termómetro con el valor inicial y el final', recta: 'Recta numérica con el valor inicial y el final' },
      { termometro: 'Thermometer with the start value and the end value', recta: 'Number line with the start value and the end value' })),
    /** Lo que sigue al hueco de las respuestas numéricas. */
    unidad: item => (item.tipo === 'anios'
      ? L(i18, 'años', 'years')
      : { temperatura: L(i18, 'grados', 'degrees'), planta: L(i18, 'plantas', 'floors'), altura: L(i18, 'metros', 'metres') }[PARES[item.par].tipo]),
    terminos,
  };
}
