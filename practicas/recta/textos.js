// Práctica «Múltiplos y divisores en la recta»: textos propios, { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

export const TX = {
  ej1: {
    nombre: { es: 'Marca los múltiplos', en: 'Mark the multiples' },
    detalle: { es: 'Toca los múltiplos en la recta del 0 al 60', en: 'Tap the multiples on the 0 to 60 number line' },
    pregunta: { es: n => `Marca los <strong>múltiplos de ${n}</strong> que ves en la recta.`, en: n => `Mark the <strong>multiples of ${n}</strong> on the number line.` },
  },
  ej2: {
    nombre: { es: 'Marca los divisores', en: 'Mark the divisors' },
    detalle: { es: 'Toca los divisores en la recta', en: 'Tap the divisors on the number line' },
    pregunta: { es: n => `Marca los <strong>divisores de ${n}</strong>.`, en: n => `Mark the <strong>divisors of ${n}</strong>.` },
  },
  // Recuento al fallar en los ejercicios 1 y 2: lo que sí ha hecho bien, y qué color es cada cosa.
  recuento: {
    acertados: {
      es: (a, total, cosa, n) => `Has encontrado <strong>${a} de los ${total}</strong> ${cosa.es} de ${n} (en verde).`,
      en: (a, total, cosa, n) => `You found <strong>${a} of the ${total}</strong> ${cosa.en} of ${n} (in green).`,
    },
    faltan: {
      es: (lista, varios) => `${varios ? `Te faltan ${lista}` : `Te falta el ${lista}`} (con borde de puntos).`,
      en: lista => `Missing: ${lista} (dotted border).`,
    },
    sobran: {
      es: k => `${k === 1 ? 'Sobra 1' : `Sobran ${k}`} (en rojo).`,
      en: k => `${k === 1 ? '1 is' : `${k} are`} wrong (in red).`,
    },
    multiplos: { es: 'múltiplos', en: 'multiples' },
    divisores: { es: 'divisores', en: 'divisors' },
  },
  ej3: {
    nombre: { es: '¿Verdadero o falso?', en: 'True or false?' },
    detalle: { es: 'Frases sobre múltiplos y divisores', en: 'Statements about multiples and divisors' },
    frase: {
      uno_divisor: { es: n => `1 es divisor de ${n}.`, en: n => `1 is a divisor of ${n}.` },
      uno_multiplo: { es: n => `1 es múltiplo de ${n}.`, en: n => `1 is a multiple of ${n}.` },
      cero_multiplo: { es: n => `0 es múltiplo de ${n}.`, en: n => `0 is a multiple of ${n}.` },
      cero_divisor: { es: n => `0 es divisor de ${n}.`, en: n => `0 is a divisor of ${n}.` },
      mult_si_mismo: { es: n => `${n} es múltiplo de ${n}.`, en: n => `${n} is a multiple of ${n}.` },
      div_si_mismo: { es: n => `${n} es divisor de ${n}.`, en: n => `${n} is a divisor of ${n}.` },
      multiplos_se_acaban: { es: n => `Los múltiplos de ${n} se acaban.`, en: n => `The multiples of ${n} eventually run out.` },
      divisores_se_acaban: { es: n => `Los divisores de ${n} se acaban.`, en: n => `The divisors of ${n} eventually run out.` },
      multiplo: { es: (a, b) => `${a} es múltiplo de ${b}.`, en: (a, b) => `${a} is a multiple of ${b}.` },
      divisor: { es: (a, b) => `${a} es divisor de ${b}.`, en: (a, b) => `${a} is a divisor of ${b}.` },
      divisible: { es: (a, b) => `${a} es divisible entre ${b}.`, en: (a, b) => `${a} is divisible by ${b}.` },
    },
  },
};
