// m.c.d. y m.c.m. con factores primos (Venn): textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): GCD y no HCF; «divisor»
// y no «factor» para la relación entre números (se queda «factor primo» / «prime
// factor»); producto con «·»; nada de «primos entre sí»: se dice que no tienen
// primos comunes. Los textos con números son funciones y reciben los trozos de
// HTML ya hechos (los números de ese ítem, con su color).

export const NOMBRE = {
  mcd: { es: 'm.c.d.', en: 'GCD' },
  mcm: { es: 'm.c.m.', en: 'LCM' },
};

/** El signo de dividir: «:» en español y «÷» en inglés. */
export const ENTRE = { es: ':', en: '÷' };

const veces = { es: n => (n === 1 ? '1 vez' : `${n} veces`), en: n => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`) };
const parejas = { es: n => (n === 1 ? '1 pareja' : `${n} parejas`), en: n => (n === 1 ? '1 pair' : `${n} pairs`) };

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Reparte los factores', en: 'Sort the prime factors' },
      detalle: { es: 'Lo que tienen los dos números, al centro: eso es el m.c.d.', en: 'What both numbers have goes in the middle: that is the GCD' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Verás dos números escritos como producto de factores primos, cada factor en una ficha: las <strong class="va">azules</strong> son de un número y las <strong class="vb">naranjas</strong> del otro.</p>
          <p>Lleva al <strong>centro</strong> los factores que tienen <strong>los dos</strong> números: una ficha azul y una naranja iguales forman una <strong>pareja</strong>. Las demás se quedan cada una en su lado.</p>
          <p>Toca una ficha y después la zona, o arrástrala.</p>`,
        en: `<h2>How it works</h2>
          <p>You will see two numbers written as a product of prime factors, one tile for each factor: the <strong class="va">blue</strong> tiles belong to one number and the <strong class="vb">orange</strong> tiles to the other.</p>
          <p>Move to the <strong>middle</strong> the factors that <strong>both</strong> numbers have: a blue tile and an orange tile with the same prime make a <strong>pair</strong>. The other tiles stay on their own side.</p>
          <p>Tap a tile and then a zone, or drag it.</p>`,
      },
    },
    {
      nombre: { es: 'El m.c.d. con factores primos', en: 'GCD with prime factors' },
      detalle: { es: 'Solo los primos comunes, con el menor exponente', en: 'Only the common primes, with the lowest power' },
      introduccion: {
        es: `<h2>El m.c.d.</h2>
          <p>El máximo común divisor tiene que ser <strong>divisor de los dos</strong> números. Por eso lleva <strong>solo los factores primos comunes</strong>, cada uno con el <strong>menor exponente</strong>.</p>
          <p>Ejemplo: 24 = 2<sup>3</sup> · 3 y 36 = 2<sup>2</sup> · 3<sup>2</sup>. El m.c.d. es 2<sup>2</sup> · 3 = 12.</p>
          <p>Con <strong>+</strong> y <strong>−</strong> eliges el exponente de cada primo. El primo que dejes tachado no se usa.</p>`,
        en: `<h2>The GCD</h2>
          <p>The greatest common divisor must be a <strong>divisor of both</strong> numbers. So it has <strong>only the common prime factors</strong>, each with the <strong>lowest power</strong>.</p>
          <p>Example: 24 = 2<sup>3</sup> · 3 and 36 = 2<sup>2</sup> · 3<sup>2</sup>. The GCD is 2<sup>2</sup> · 3 = 12.</p>
          <p>Use <strong>+</strong> and <strong>−</strong> to choose the power of each prime. A crossed-out prime is not used.</p>`,
      },
    },
    {
      nombre: { es: 'El m.c.m. con factores primos', en: 'LCM with prime factors' },
      detalle: { es: 'Todos los primos, con el mayor exponente', en: 'All the primes, with the highest power' },
      introduccion: {
        es: `<h2>El m.c.m.</h2>
          <p>El mínimo común múltiplo tiene que ser <strong>múltiplo de los dos</strong> números. Por eso lleva <strong>todos los factores primos</strong>, comunes y no comunes, cada uno con el <strong>mayor exponente</strong>.</p>
          <p>Ejemplo: 24 = 2<sup>3</sup> · 3 y 36 = 2<sup>2</sup> · 3<sup>2</sup>. El m.c.m. es 2<sup>3</sup> · 3<sup>2</sup> = 72.</p>`,
        en: `<h2>The LCM</h2>
          <p>The lowest common multiple must be a <strong>multiple of both</strong> numbers. So it has <strong>all the prime factors</strong>, common and not common, each with the <strong>highest power</strong>.</p>
          <p>Example: 24 = 2<sup>3</sup> · 3 and 36 = 2<sup>2</sup> · 3<sup>2</sup>. The LCM is 2<sup>3</sup> · 3<sup>2</sup> = 72.</p>`,
      },
    },
    {
      nombre: { es: 'Mezcla y comprobación', en: 'Mixed, with a check' },
      detalle: { es: 'Unas veces el m.c.d. y otras el m.c.m.: no cruces las reglas', en: 'Sometimes the GCD, sometimes the LCM: do not mix up the rules' },
      introduccion: {
        es: `<h2>Lee bien qué te piden</h2>
          <p>Unas veces es el <strong class="venn-mcd">m.c.d.</strong> y otras el <strong class="venn-mcm">m.c.m.</strong></p>
          <p>Hay una comprobación rápida: el <strong class="venn-mcd">m.c.d.</strong> nunca es mayor que el menor de los dos números, y el <strong class="venn-mcm">m.c.m.</strong> nunca es menor que el mayor.</p>`,
        en: `<h2>Read carefully what you are asked</h2>
          <p>Sometimes it is the <strong class="venn-mcd">GCD</strong> and sometimes the <strong class="venn-mcm">LCM</strong>.</p>
          <p>There is a quick check: the <strong class="venn-mcd">GCD</strong> is never greater than the smaller number, and the <strong class="venn-mcm">LCM</strong> is never less than the larger number.</p>`,
      },
    },
  ],

  venn: {
    instruccion: {
      es: 'Reparte los factores primos: lo que tienen los dos números, al centro; lo demás, a su lado.',
      en: 'Sort the prime factors: what both numbers have goes in the middle; the rest stays on its side.',
    },
    solo: { es: n => `solo ${n}`, en: n => `only ${n}` },
    comun: { es: 'común', en: 'common' },
    ficha: { es: (p, n) => `${p}, factor primo de ${n}`, en: (p, n) => `${p}, prime factor of ${n}` },
    ayuda: { es: 'Toca una ficha y después una zona, o arrástrala.', en: 'Tap a tile and then a zone, or drag it.' },
    elige_zona: { es: 'Ahora toca la zona donde va.', en: 'Now tap the zone where it goes.' },
    quedan: {
      es: n => (n === 1 ? 'Te queda 1 ficha sin repartir.' : `Te quedan ${n} fichas sin repartir.`),
      en: n => (n === 1 ? 'You have 1 tile left to place.' : `You have ${n} tiles left to place.`),
    },
    todas: { es: 'Ya están todas repartidas. Puedes cambiarlas o comprobar.', en: 'All the tiles are placed. You can move them or check.' },
    no_puede: {
      es: (propio, ajeno) => `Esa ficha es de ${propio}: no puede ir a «solo ${ajeno}».`,
      en: (propio, ajeno) => `That tile belongs to ${propio}: it cannot go to “only ${ajeno}”.`,
    },
    // Fallos: p es el primo; A y B, los números con su color; ea y eb, cuántas veces está p.
    no_comun: {
      es: (p, quien, otro) => `El ${p} es factor primo de ${quien}, pero no de ${otro}: no tiene pareja y no puede ir en «común».`,
      en: (p, quien, otro) => `${p} is a prime factor of ${quien} but not of ${otro}: it has no partner, so it cannot go in “common”.`,
    },
    cuantos: {
      es: (p, A, ea, B, eb) => `El ${p} está ${veces.es(ea)} en ${A} y ${veces.es(eb)} en ${B}`,
      en: (p, A, ea, B, eb) => `${p} appears ${veces.en(ea)} in ${A} and ${veces.en(eb)} in ${B}`,
    },
    sobra: {
      es: (p, n) => `solo salen ${parejas.es(n)} de ${p}. Lo que sobra se queda en su lado.`,
      en: (p, n) => `you can only make ${parejas.en(n)} of ${p}. The extra tiles stay on their own side.`,
    },
    falta: {
      es: (p, n, hechas) => `salen ${parejas.es(n)} de ${p}, y en «común» ${hechas === 0 ? 'no has hecho ninguna' : `solo has hecho ${hechas}`}.`,
      en: (p, n, hechas) => `you can make ${parejas.en(n)} of ${p}, but in “common” you made ${hechas === 0 ? 'none' : `only ${hechas}`}.`,
    },
    lo_comun: { es: 'lo común', en: 'the common part' },
    todo: { es: 'todo, contando lo común una sola vez', en: 'everything, counting the common part only once' },
    sin_comunes: {
      es: (A, B) => `${A} y ${B} no tienen primos comunes: el m.c.d. es 1`,
      en: (A, B) => `${A} and ${B} have no common prime factors: the GCD is 1`,
    },
  },

  reglas: {
    instruccion: {
      es: (nombre, A, B) => `Construye el ${nombre} de ${A} y ${B}: elige el exponente de cada primo.`,
      en: (nombre, A, B) => `Build the ${nombre} of ${A} and ${B}: choose the power of each prime.`,
    },
    exponente_de: { es: p => `Exponente de ${p}`, en: p => `Power of ${p}` },
    sin_primos: {
      es: 'No has elegido ningún primo. Entonces, ¿cuánto vale el m.c.d.?',
      en: 'You did not choose any prime. So, what is the GCD?',
    },
    respuesta: { es: 'La respuesta es', en: 'The answer is' },
    porque: {
      mcd: { es: 'los primos comunes, con el menor exponente', en: 'the common prime factors, with the lowest power' },
      mcm: { es: 'todos los primos, con el mayor exponente', en: 'all the prime factors, with the highest power' },
    },
    sin_comunes: {
      es: (A, B) => `${A} y ${B} no tienen primos comunes: el m.c.d. es 1`,
      en: (A, B) => `${A} and ${B} have no common prime factors: the GCD is 1`,
    },
    uno_divide: {
      mcd: {
        es: (menor, mayor) => `Fíjate: ${menor} es divisor de ${mayor}, así que el m.c.d. es el propio ${menor}.`,
        en: (menor, mayor) => `Notice: ${menor} is a divisor of ${mayor}, so the GCD is ${menor} itself.`,
      },
      mcm: {
        es: (menor, mayor) => `Fíjate: ${mayor} es múltiplo de ${menor}, así que el m.c.m. es el propio ${mayor}.`,
        en: (menor, mayor) => `Notice: ${mayor} is a multiple of ${menor}, so the LCM is ${mayor} itself.`,
      },
    },

    // --- Los errores, uno por código de `diagnosticar` ---
    es_el_otro: {
      mcd: {
        es: v => `Has cogido todos los primos con el mayor exponente: eso es el m.c.m. (${v}). El m.c.d. solo lleva los primos comunes, con el menor exponente.`,
        en: v => `You took all the primes with the highest power: that is the LCM (${v}). The GCD has only the common prime factors, with the lowest power.`,
      },
      mcm: {
        es: v => `Has cogido solo los primos comunes con el menor exponente: eso es el m.c.d. (${v}). El m.c.m. lleva todos los primos, con el mayor exponente.`,
        en: v => `You took only the common primes with the lowest power: that is the GCD (${v}). The LCM has all the prime factors, with the highest power.`,
      },
    },
    cero: {
      es: 'El m.c.d. nunca es 0: el 1 es divisor de todos los números.',
      en: 'The GCD is never 0: 1 is a divisor of every number.',
    },
    cero_sin_comunes: {
      es: 'Sin primos comunes, el m.c.d. es 1.',
      en: 'With no common prime factors, the GCD is 1.',
    },
    cero_con_comunes: {
      es: (A, B, lista) => `Además, ${A} y ${B} sí tienen primos comunes: ${lista}.`,
      en: (A, B, lista) => `Also, ${A} and ${B} do have common prime factors: ${lista}.`,
    },
    desigualdad: {
      mcd: {
        es: (v, menor) => `Un m.c.d. de ${v} no puede ser: <span class="cuenta">${v} &gt; ${menor}</span>, y el m.c.d. nunca es mayor que el menor de los dos números.`,
        en: (v, menor) => `A GCD of ${v} is impossible: <span class="cuenta">${v} &gt; ${menor}</span>, and the GCD is never greater than the smaller number.`,
      },
      mcm: {
        es: (v, mayor) => `Un m.c.m. de ${v} no puede ser: <span class="cuenta">${v} &lt; ${mayor}</span>, y el m.c.m. nunca es menor que el mayor de los dos números.`,
        en: (v, mayor) => `An LCM of ${v} is impossible: <span class="cuenta">${v} &lt; ${mayor}</span>, and the LCM is never less than the larger number.`,
      },
    },
    no_comun: {
      es: (p, quien, otro) => `El ${p} es factor primo de ${quien}, pero no de ${otro}: no es común y no va en el m.c.d.`,
      en: (p, quien, otro) => `${p} is a prime factor of ${quien} but not of ${otro}: it is not a common prime factor, so it is not in the GCD.`,
    },
    exponente_mayor: {
      es: (mia, quien, p, buena) => `${mia} no es divisor de ${quien}: del ${p} solo se puede coger ${buena}, el menor exponente.`,
      en: (mia, quien, p, buena) => `${mia} is not a divisor of ${quien}: for ${p} you can only take ${buena}, the lowest power.`,
    },
    falta_comun: {
      mcd: {
        es: (p, A, B) => `El ${p} es factor primo de ${A} y de ${B}: es común y tiene que estar en el m.c.d.`,
        en: (p, A, B) => `${p} is a prime factor of both ${A} and ${B}: it is common, so it must be in the GCD.`,
      },
      mcm: {
        es: (p, A, B) => `Falta el ${p}: el m.c.m. tiene que ser múltiplo de ${A} y de ${B}, y los dos llevan el ${p}.`,
        en: (p, A, B) => `${p} is missing: the LCM must be a multiple of ${A} and of ${B}, and both have ${p}.`,
      },
    },
    se_queda_corto: {
      es: (mia, A, B, p, buena) => `${mia} es divisor de ${A} y de ${B}, pero no es el mayor: del ${p} se puede coger ${buena}.`,
      en: (mia, A, B, p, buena) => `${mia} is a common divisor of ${A} and ${B}, but not the greatest: for ${p} you can take ${buena}.`,
    },
    faltan_no_comunes: {
      es: (p, quien) => `Faltan los primos no comunes: el ${p} solo es factor primo de ${quien}, pero el m.c.m. tiene que ser múltiplo de ${quien}.`,
      en: (p, quien) => `The non-common primes are missing: ${p} is a prime factor of ${quien} only, but the LCM must be a multiple of ${quien}.`,
    },
    exponente_menor: {
      es: (mia, quien, p, buena) => `Con ${mia} no llega para ser múltiplo de ${quien}: del ${p} hay que coger ${buena}, el mayor exponente.`,
      en: (mia, quien, p, buena) => `${mia} is not enough to be a multiple of ${quien}: for ${p} you need ${buena}, the highest power.`,
    },
    se_pasa: {
      es: (mia, A, B, p, buena) => `${mia} es múltiplo de ${A} y de ${B}, pero no es el menor: del ${p} basta con ${buena}, el mayor exponente.`,
      en: (mia, A, B, p, buena) => `${mia} is a common multiple of ${A} and ${B}, but not the lowest: for ${p}, ${buena} is enough (the highest power).`,
    },
    producto: {
      es: (mia, A, B, p, buena) => `${mia} es ${A} · ${B}: es múltiplo de los dos, pero no el menor. Los primos comunes se cuentan una sola vez: del ${p} basta con ${buena}.`,
      en: (mia, A, B, p, buena) => `${mia} is ${A} · ${B}: it is a multiple of both, but not the lowest. Common primes are counted only once: for ${p}, ${buena} is enough.`,
    },
    otro: {
      es: 'Compara otra vez los exponentes de cada primo en los dos números.',
      en: 'Compare again the powers of each prime in the two numbers.',
    },

    // --- Las dos comprobaciones de la mezcla (U2-3C-10) ---
    comprobacion: { es: 'Comprobación:', en: 'Check:' },
    el_menor: { es: 'el menor', en: 'the smaller number' },
    el_mayor: { es: 'el mayor', en: 'the larger number' },
    exactas: { es: 'divisiones exactas', en: 'exact divisions' },
    y: { es: 'y', en: 'and' },
  },
};
