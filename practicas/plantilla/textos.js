// Práctica de plantilla: textos propios, siempre como { es, en }. Los comunes
// (Comprobar, Siguiente, ¡Bien!…) están en `../_comun/textos.js` y llegan a
// `montar` en `api.t`. Un texto con números es una función en cada idioma.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor», para la relación entre números; producto con «·», nunca «×»;
// inglés sencillo; y el feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM.

export const TX = {
  primo: {
    nombre: { es: '¿Primo o compuesto?', en: 'Prime or composite?' },
    detalle: { es: 'Decide qué es cada número', en: 'Decide what each number is' },
    pregunta: { es: n => `¿Qué es el ${n}?`, en: n => `What is ${n}?` },
    opcion: {
      primo: { es: 'Primo', en: 'Prime' },
      compuesto: { es: 'Compuesto', en: 'Composite' },
    },
    es_primo: { es: n => `${n} es primo`, en: n => `${n} is prime` },
    es_compuesto: { es: n => `${n} es compuesto`, en: n => `${n} is composite` },
    ni: { es: 'ni', en: 'or' },
    no_divisible: { es: lista => `no es divisible entre ${lista}`, en: lista => `it is not divisible by ${lista}` },
    se_pasa: {
      es: (n, p) => `y <span class="cuenta">${p} · ${p} = ${p * p}</span> ya se pasa de ${n}`,
      en: (n, p) => `and <span class="cuenta">${p} · ${p} = ${p * p}</span> is already greater than ${n}`,
    },
    solo_dos: { es: n => `sus únicos divisores son 1 y ${n}`, en: n => `its only divisors are 1 and ${n}` },
  },
  fact: {
    nombre: { es: 'Factorización', en: 'Prime factorisation' },
    detalle: { es: 'Escribe el número como producto de potencias de primos', en: 'Write the number as a product of powers of primes' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Tienes que escribir un número como producto de potencias de primos. Por ejemplo: <strong>72 = 2<sup>3</sup> · 3<sup>2</sup></strong>.</p>
        <p>Con los botones <strong>+</strong> y <strong>−</strong> eliges el exponente de cada primo. Los primos que dejes sin exponente no se usan.</p>`,
      en: `<h2>How it works</h2>
        <p>You have to write a number as a product of powers of primes. For example: <strong>72 = 2<sup>3</sup> · 3<sup>2</sup></strong>.</p>
        <p>Use the <strong>+</strong> and <strong>−</strong> buttons to choose the exponent of each prime. The primes with no exponent are not used.</p>`,
    },
    instruccion: { es: 'Elige el exponente de cada primo.', en: 'Choose the exponent of each prime.' },
    exponente_de: { es: p => `Exponente de ${p}`, en: p => `Exponent of ${p}` },
    no_da: { es: 'y no', en: 'not' },
    correcta: { es: 'La factorización es', en: 'The prime factorisation is' },
  },
};
