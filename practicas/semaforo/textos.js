// Práctica «Semáforo de divisibilidad»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

export const TX = {
  ej1: {
    nombre: { es: 'Semáforo básico', en: 'Basic traffic light' },
    detalle: { es: 'Enciende, entre 2, 3, 5, 9 y 10, los que son divisores del número', en: 'Switch on the divisors among 2, 3, 5, 9 and 10' },
    pregunta: { es: n => `¿Entre qué números es divisible el ${n}?`, en: n => `Which of these is ${n} divisible by?` },
  },
  ej2: {
    nombre: { es: 'Con el 11', en: 'With 11' },
    detalle: { es: 'Lo mismo, con el criterio del 11', en: 'The same, with the rule for 11' },
    pregunta: { es: n => `¿Entre qué números es divisible el ${n}?`, en: n => `Which of these is ${n} divisible by?` },
  },
  ej3: {
    nombre: { es: 'Criterios compuestos', en: 'Combined rules' },
    detalle: { es: '¿Es divisible entre 6, 15, 22, 30 o 33?', en: 'Is it divisible by 6, 15, 22, 30 or 33?' },
    pregunta_sino: { es: n => `¿Es ${n} divisible entre __D__?`, en: n => `Is ${n} divisible by __D__?` },
    pregunta_trampa: { es: n => `${n} es divisible entre 4 y entre 6. ¿Es divisible entre 24?`, en: n => `${n} is divisible by 4 and by 6. Is it divisible by 24?` },
  },
  ej4: {
    nombre: { es: 'La cifra que falta', en: 'The missing digit' },
    detalle: { es: 'Encuentra la cifra oculta', en: 'Find the hidden digit' },
    pregunta_uno: { es: d => `es divisible entre ${d}.`, en: d => `is divisible by ${d}.` },
    pregunta_dos: { es: (a, b) => `es divisible entre ${a} y entre ${b}.`, en: (a, b) => `is divisible by ${a} and by ${b}.` },
    instruccion: { es: '¿Qué cifra falta?', en: 'What digit is missing?' },
  },
};
