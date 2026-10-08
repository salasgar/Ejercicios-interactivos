// Práctica «Divisiones sucesivas guiadas»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

export const TX = {
  escalera: {
    nombre: { es: 'La escalera de divisiones', en: 'The division ladder' },
    detalle: { es: 'Divide paso a paso por el menor primo, hasta llegar a 1', en: 'Divide step by step by the smallest prime, down to 1' },
    instruccion: { es: 'Pulsa el MENOR primo que divide a este número', en: 'Press the SMALLEST prime that divides this number' },
  },
  potencias: {
    nombre: { es: 'La forma de potencias', en: 'The powers form' },
    detalle: { es: 'Escribe la lista de primos como un producto de potencias', en: 'Write the list of primes as a product of powers' },
    instruccion: { es: 'Estos son los primos. Pon el exponente de cada uno', en: 'These are the primes. Set the exponent of each one' },
    exponente_de: p => ({ es: `Exponente de ${p}`, en: `Exponent of ${p}` }),
  },
  ej3: {
    nombre: { es: 'Comprobar multiplicando', en: 'Check by multiplying' },
    detalle: { es: '¿Cuánto vale esta factorización?', en: 'What does this factorisation equal?' },
    pregunta_valor: { es: f => `¿Cuánto vale ${f}?`, en: f => `What does ${f} equal?` },
    pregunta_sino: { es: (f, v) => `¿Es correcto que ${f} = ${v}?`, en: (f, v) => `Is it correct that ${f} = ${v}?` },
    no_da: { es: 'no da', en: 'is not' },
    correcta: { es: 'La cuenta correcta es', en: 'The correct working is' },
  },
};
