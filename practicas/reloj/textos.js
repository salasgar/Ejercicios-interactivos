// Textos propios de «Reloj de coincidencias», en español y en inglés.

export const TX = {
  linea: {
    nombre: { es: 'Predice la coincidencia', en: 'Predict the coincidence' },
    detalle: {
      es: 'Dos luces que parpadean: toca el momento en que vuelven a coincidir.',
      en: 'Two blinking lights: tap the moment they coincide again.',
    },
    pregunta: (a, b) => ({
      es: `Las luces azul y naranja se encienden juntas en el segundo 0. La azul se enciende cada ${a} segundos y la naranja cada ${b}. Toca el segundo en que vuelven a encenderse juntas.`,
      en: `The blue and orange lights switch on together at second 0. The blue one switches on every ${a} seconds and the orange one every ${b}. Tap the second when they switch on together again.`,
    }),
    azul: { es: 'azul', en: 'blue' },
    naranja: { es: 'naranja', en: 'orange' },
    lista: (color, lista) => ({
      es: `${color}: ${lista.join(', ')}…`,
      en: `${color}: ${lista.join(', ')}…`,
    }),
    primera_vez: n => ({
      es: `la primera vez que coinciden es en el segundo ${n}`,
      en: `the first time they coincide is at second ${n}`,
    }),
  },
  hora: {
    nombre: { es: 'La hora de reloj', en: 'Clock time' },
    detalle: {
      es: 'A qué hora exacta vuelven a coincidir.',
      en: 'The exact time they coincide again.',
    },
    pregunta: (a, b, h, m) => ({
      es: `Un tranvía sale cada ${a} minutos y un autobús cada ${b} minutos. Hoy han salido juntos a las ${horaTexto(h, m)}. ¿A qué hora vuelven a salir juntos?`,
      en: `A tram leaves every ${a} minutes and a bus every ${b} minutes. Today they left together at ${horaTexto(h, m)}. What time do they leave together again?`,
    }),
    horas: { es: 'Horas', en: 'Hours' },
    minutos: { es: 'Minutos', en: 'Minutes' },
    descomposicion: (mcm, hExtra, mExtra, inicio, intermedia, final) => ({
      es: `${mcm} min = ${hExtra} h ${mExtra} min; ${horaTexto(inicio.h, inicio.m)} + ${hExtra} h = ${horaTexto(intermedia.h, intermedia.m)}; ${horaTexto(intermedia.h, intermedia.m)} + ${mExtra} min = ${horaTexto(final.h, final.m)}.`,
      en: `${mcm} min = ${hExtra} h ${mExtra} min; ${horaTexto(inicio.h, inicio.m)} + ${hExtra} h = ${horaTexto(intermedia.h, intermedia.m)}; ${horaTexto(intermedia.h, intermedia.m)} + ${mExtra} min = ${horaTexto(final.h, final.m)}.`,
    }),
    aviso_100: {
      es: 'Una hora tiene 60 minutos, no 100: no se puede sumar los minutos como si fueran cifras sueltas.',
      en: 'An hour has 60 minutes, not 100: you cannot add the minutes as if they were loose digits.',
    },
  },
  tres: {
    nombre: { es: 'Cada cuántos días', en: 'Every how many days' },
    detalle: {
      es: 'A veces son tres datos; a veces uno ya es múltiplo del otro.',
      en: 'Sometimes three numbers; sometimes one is already a multiple of the other.',
    },
    pregunta_tres: (a, b, c) => ({
      es: `Tres atracciones de la feria se repiten cada ${a}, ${b} y ${c} días. ¿Cada cuántos días coinciden las tres a la vez?`,
      en: `Three fair rides repeat every ${a}, ${b} and ${c} days. Every how many days do all three coincide?`,
    }),
    pregunta_multiplo: (a, b) => ({
      es: `Dos atracciones de la feria se repiten cada ${a} y cada ${b} días. ¿Cada cuántos días coinciden las dos?`,
      en: `Two fair rides repeat every ${a} and every ${b} days. Every how many days do both coincide?`,
    }),
    pista_multiplo: (menor, mayor) => ({
      es: `${mayor} ya es múltiplo de ${menor}: coinciden cada ${mayor} días, sin calcular nada más.`,
      en: `${mayor} is already a multiple of ${menor}: they coincide every ${mayor} days, with nothing else to calculate.`,
    }),
    respuesta_label: { es: 'Días', en: 'Days' },
  },
};

/** «9:05» con los minutos siempre a dos cifras. */
export function horaTexto(h, m) {
  return `${h}:${String(m).padStart(2, '0')}`;
}
