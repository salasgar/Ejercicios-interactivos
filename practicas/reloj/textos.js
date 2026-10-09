// Textos propios de «Reloj de coincidencias», en español y en inglés.

export const TX = {
  linea: {
    nombre: { es: 'Predice la coincidencia', en: 'Predict the coincidence' },
    detalle: {
      es: 'Dos luces que parpadean: toca el momento en que vuelven a coincidir.',
      en: 'Two blinking lights: tap the moment they coincide again.',
    },
    pregunta: (a, b) => ({
      es: `Las luces azul y naranja se encienden juntas en el segundo 0. La azul se enciende cada ${a} segundos y la naranja cada ${b}. Toca el segundo en que vuelven a encenderse juntas por primera vez.`,
      en: `The blue and orange lights switch on together at second 0. The blue one switches on every ${a} seconds and the orange one every ${b}. Tap the second when they switch on together again for the first time.`,
    }),
    azul: { es: 'azul', en: 'blue' },
    naranja: { es: 'naranja', en: 'orange' },
    lista: (color, lista) => ({
      es: `${color}: ${lista.join(', ')}…`,
      en: `${color}: ${lista.join(', ')}…`,
    }),
    primera_vez: n => ({
      es: `la primera vez que vuelven a coincidir es en el segundo ${n}`,
      en: `the first time they coincide again is at second ${n}`,
    }),
  },
  hora: {
    nombre: { es: 'La hora de reloj', en: 'Clock time' },
    detalle: {
      es: 'A qué hora exacta vuelven a coincidir.',
      en: 'The exact time they coincide again.',
    },
    pregunta: (a, b, h, m) => ({
      es: `Un tranvía sale cada ${a} minutos y un autobús cada ${b} minutos. Hoy han salido juntos a las ${horaTexto(h, m)}. ¿A qué hora vuelven a salir juntos por primera vez? Marca la hora en formato de 24 horas (por ejemplo, 13:05).`,
      en: `A tram leaves every ${a} minutes and a bus every ${b} minutes. Today they left together at ${horaTexto(h, m)}. What time do they leave together again for the first time? Use the 24-hour clock (for example, 13:05).`,
    }),
    horas: { es: 'Horas', en: 'Hours' },
    minutos: { es: 'Minutos', en: 'Minutes' },
    decenas: { es: 'Minutos: decenas', en: 'Minutes: tens' },
    unidades: { es: 'Minutos: unidades', en: 'Minutes: units' },
    // Con m.c.m. menor que 60 no hay horas; si es múltiplo de 60 no hay minutos sueltos.
    descomposicion: (a, b, mcm, hExtra, mExtra, inicio, intermedia, final) => {
      const ini = horaTexto(inicio.h, inicio.m), mid = horaTexto(intermedia.h, intermedia.m), fin = horaTexto(final.h, final.m);
      const cabEs = `m.c.m.(${a}, ${b}) = ${mcm} min`, cabEn = `LCM(${a}, ${b}) = ${mcm} min`;
      if (hExtra === 0) {
        return { es: `${cabEs}; ${ini} + ${mExtra} min = ${fin}.`, en: `${cabEn}; ${ini} + ${mExtra} min = ${fin}.` };
      }
      if (mExtra === 0) {
        return { es: `${cabEs} = ${hExtra} h; ${ini} + ${hExtra} h = ${fin}.`, en: `${cabEn} = ${hExtra} h; ${ini} + ${hExtra} h = ${fin}.` };
      }
      return {
        es: `${cabEs} = ${hExtra} h ${mExtra} min; ${ini} + ${hExtra} h = ${mid}; ${mid} + ${mExtra} min = ${fin}.`,
        en: `${cabEn} = ${hExtra} h ${mExtra} min; ${ini} + ${hExtra} h = ${mid}; ${mid} + ${mExtra} min = ${fin}.`,
      };
    },
    aviso_100: {
      es: 'Una hora tiene 60 minutos, no 100: no se pueden sumar los minutos como si fueran cifras sueltas.',
      en: 'An hour has 60 minutes, not 100: you cannot add the minutes as if they were loose digits.',
    },
  },
  tres: {
    nombre: { es: 'Cada cuántos días', en: 'How often' },
    detalle: {
      es: 'A veces son tres datos; a veces uno ya es múltiplo del otro.',
      en: 'Sometimes three numbers; sometimes one is already a multiple of the other.',
    },
    pregunta_tres: (a, b, c) => ({
      es: `Tres atracciones de la feria se repiten cada ${a}, ${b} y ${c} días. ¿Cada cuántos días coinciden las tres a la vez?`,
      en: `Three fair rides repeat every ${a}, ${b} and ${c} days. How often do all three coincide? Write the number of days.`,
    }),
    pregunta_multiplo: (a, b) => ({
      es: `Dos atracciones de la feria se repiten cada ${a} y cada ${b} días. ¿Cada cuántos días coinciden las dos?`,
      en: `Two fair rides repeat every ${a} and every ${b} days. How often do both coincide? Write the number of days.`,
    }),
    // Los múltiplos del mayor hasta el primero que lo es también de los otros.
    cuenta_tres: (a, b, c, lista, solucion) => ({
      es: `Múltiplos de ${c}: ${lista.join(', ')}. El primero que también es múltiplo de ${a} y de ${b} es ${solucion}: m.c.m.(${a}, ${b}, ${c}) = ${solucion}.`,
      en: `Multiples of ${c}: ${lista.join(', ')}. The first one that is also a multiple of ${a} and ${b} is ${solucion}: LCM(${a}, ${b}, ${c}) = ${solucion}.`,
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
