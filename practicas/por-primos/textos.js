// Práctica «Multiplica y divide por primos»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, Sí, No…) llegan a `montar` en `api.t`.
// Reglas de contenido: «divisor», no «factor», para la relación entre números;
// producto con «·»; GCD y LCM en inglés; sin letras; inglés sencillo.
//
// `expl` son las piezas del feedback que arma `logica.js` (`explicar`): reciben
// números de ese ítem y devuelven texto con HTML mínimo (<sup>).

const NUM = {
  es: ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'],
  en: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
};
const num = (idioma, n) => NUM[idioma][n] ?? String(n);
const pot = (p, e) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);
const cuenta = html => `<span class="cuenta">${html}</span>`;

const regla = (es, en) => ({ es: `<strong>${es}</strong>`, en: `<strong>${en}</strong>` });

export const TX = {
  e1: {
    nombre: { es: 'Hazlo múltiplo', en: 'Make it a multiple' },
    detalle: { es: 'Multiplica o divide por primos', en: 'Multiply or divide by primes' },
    introduccion: {
      es: `<h2>Hazlo múltiplo</h2>
        <p>Arriba está el número objetivo y abajo, tu número. Los dos están escritos con sus primos.</p>
        <p>Cada botón <strong>· p</strong> añade un primo a tu número y cada botón <strong>: p</strong> le quita uno.
        Hasta que tu número sea <strong>múltiplo</strong> del de arriba.</p>
        <p>Ejemplo: el objetivo es 12 = 2<sup>2</sup> · 3 y tú tienes 2 · 5. Te falta un 2 y un 3:
        · 2 → 2<sup>2</sup> · 5 y · 3 → 2<sup>2</sup> · 3 · 5 = 60. Y 60 = 5 · 12.</p>
        <p>No hace falta dividir: se miran los exponentes. El botón <strong>: p</strong> solo se puede tocar si tu número tiene ese primo.</p>`,
      en: `<h2>Make it a multiple</h2>
        <p>The target number is on top and your number is below. Both are written with their primes.</p>
        <p>Each <strong>· p</strong> button adds a prime to your number and each <strong>: p</strong> button takes one away.
        Do it until your number is a <strong>multiple</strong> of the top number.</p>
        <p>Example: the target is 12 = 2<sup>2</sup> · 3 and you have 2 · 5. You need one more 2 and a 3:
        · 2 → 2<sup>2</sup> · 5 and · 3 → 2<sup>2</sup> · 3 · 5 = 60. And 60 = 5 · 12.</p>
        <p>You do not need to divide: just look at the exponents. The <strong>: p</strong> button only works if your number has that prime.</p>`,
    },
    regla: regla('El número de abajo tiene que ser múltiplo del de arriba.', 'The bottom number must be a multiple of the top number.'),
  },
  e2: {
    nombre: { es: 'Hazlo divisor', en: 'Make it a divisor' },
    detalle: { es: 'Multiplica o divide por primos', en: 'Multiply or divide by primes' },
    introduccion: {
      es: `<h2>Hazlo divisor</h2>
        <p>Ahora tu número tiene que ser <strong>divisor</strong> del número de arriba (el 1 también vale).</p>
        <p>Un divisor solo puede tener primos del objetivo, y cada uno con exponente <strong>igual o menor</strong>.</p>
        <p>Ejemplo: el objetivo es 60 = 2<sup>2</sup> · 3 · 5 y tú tienes 2<sup>3</sup> · 3. Sobra un 2:
        : 2 → 2<sup>2</sup> · 3 = 12. Y 12 es divisor de 60, porque 60 = 5 · 12.</p>`,
      en: `<h2>Make it a divisor</h2>
        <p>Now your number must be a <strong>divisor</strong> of the top number (1 also works).</p>
        <p>A divisor can only have primes of the target, each one with an exponent that is <strong>equal or smaller</strong>.</p>
        <p>Example: the target is 60 = 2<sup>2</sup> · 3 · 5 and you have 2<sup>3</sup> · 3. There is one 2 too many:
        : 2 → 2<sup>2</sup> · 3 = 12. And 12 is a divisor of 60, because 60 = 5 · 12.</p>`,
    },
    regla: regla('El número de abajo tiene que ser divisor del de arriba.', 'The bottom number must be a divisor of the top number.'),
  },
  e3: {
    nombre: { es: 'El múltiplo más pequeño', en: 'The smallest multiple' },
    detalle: { es: 'Solo · p, con los menos toques', en: 'Only · p, with the fewest taps' },
    introduccion: {
      es: `<h2>El múltiplo más pequeño</h2>
        <p>Aquí solo puedes multiplicar (<strong>· p</strong>). Tienes que llegar a un múltiplo del número de arriba
        con el <strong>menor número de toques</strong>.</p>
        <p>Ejemplo: empiezas en 12 = 2<sup>2</sup> · 3 y el objetivo es 18 = 2 · 3<sup>2</sup>. Te falta un 3:
        · 3 → 36 = 2<sup>2</sup> · 3<sup>2</sup>. Un toque. 36 es el m.c.m. de 12 y 18.</p>
        <p>Si te equivocas, usa «Deshacer».</p>`,
      en: `<h2>The smallest multiple</h2>
        <p>Here you can only multiply (<strong>· p</strong>). You must reach a multiple of the top number
        with the <strong>fewest taps</strong>.</p>
        <p>Example: you start at 12 = 2<sup>2</sup> · 3 and the target is 18 = 2 · 3<sup>2</sup>. You need one more 3:
        · 3 → 36 = 2<sup>2</sup> · 3<sup>2</sup>. One tap. 36 is the LCM of 12 and 18.</p>
        <p>If you make a mistake, use “Undo”.</p>`,
    },
    regla: regla('Llega a un múltiplo del número de arriba con el menor número de toques.', 'Reach a multiple of the top number with the fewest taps.'),
  },
  e4: {
    nombre: { es: 'El divisor común más grande', en: 'The greatest common divisor' },
    detalle: { es: 'Solo : p, dividiendo lo menos posible', en: 'Only : p, dividing as little as possible' },
    introduccion: {
      es: `<h2>El divisor común más grande</h2>
        <p>Aquí solo puedes dividir (<strong>: p</strong>). Tienes que llegar a un divisor del número de arriba
        <strong>dividiendo lo menos posible</strong>.</p>
        <p>Ejemplo: empiezas en 24 = 2<sup>3</sup> · 3 y el objetivo es 60 = 2<sup>2</sup> · 3 · 5. Sobra un 2:
        : 2 → 12 = 2<sup>2</sup> · 3. Un toque. 12 es el m.c.d. de 24 y 60.</p>
        <p>Si te equivocas, usa «Deshacer».</p>`,
      en: `<h2>The greatest common divisor</h2>
        <p>Here you can only divide (<strong>: p</strong>). You must reach a divisor of the top number
        by <strong>dividing as little as possible</strong>.</p>
        <p>Example: you start at 24 = 2<sup>3</sup> · 3 and the target is 60 = 2<sup>2</sup> · 3 · 5. There is one 2 too many:
        : 2 → 12 = 2<sup>2</sup> · 3. One tap. 12 is the GCD of 24 and 60.</p>
        <p>If you make a mistake, use “Undo”.</p>`,
    },
    regla: regla('Llega a un divisor del número de arriba dividiendo lo menos posible.', 'Reach a divisor of the top number by dividing as little as possible.'),
  },

  objetivo: { es: 'Objetivo', en: 'Target' },
  tuNumero: { es: 'Tu número', en: 'Your number' },
  toques: { es: 'Toques', en: 'Taps' },
  deshacer: { es: 'Deshacer', en: 'Undo' },
  reiniciar: { es: 'Empezar de nuevo', en: 'Start again' },
  multiplicar: { es: p => `Multiplicar por ${p}`, en: p => `Multiply by ${p}` },
  dividir: { es: p => `Dividir entre ${p}`, en: p => `Divide by ${p}` },

  expl: {
    // Cabecera de la comparación de exponentes.
    esMultiplo: {
      es: (a, fa, b, fb) => `${cuenta(`${a} = ${fa}`)} es múltiplo de ${cuenta(`${b} = ${fb}`)}: tiene todos sus primos, cada uno con exponente igual o mayor.`,
      en: (a, fa, b, fb) => `${cuenta(`${a} = ${fa}`)} is a multiple of ${cuenta(`${b} = ${fb}`)}: it has all its primes, each one with an equal or greater exponent.`,
    },
    esDivisor: {
      es: (a, fa, b, fb) => `${cuenta(`${a} = ${fa}`)} es divisor de ${cuenta(`${b} = ${fb}`)}: ningún primo pasa del exponente que tiene el objetivo.`,
      en: (a, fa, b, fb) => `${cuenta(`${a} = ${fa}`)} is a divisor of ${cuenta(`${b} = ${fb}`)}: no prime goes over the exponent in the target.`,
    },
    // Fallo de múltiplo: lista de primos que faltan, [[p, tiene, hace falta], …].
    noMultiplo: {
      es: (b, fb, a, fa, faltan) => `Para ser múltiplo de ${cuenta(`${b} = ${fb}`)} hacen falta, como mínimo, todos sus primos con sus exponentes. Tu número, ${cuenta(fa)}: ${faltan.map(([p, e, n]) => `${e === 0 ? `no tiene ningún ${p}` : `solo tiene ${pot(p, e)}`}, te ${n - e === 1 ? 'falta' : 'faltan'} ${num('es', n - e)} ${p} más`).join('; ')}.`,
      en: (b, fb, a, fa, faltan) => `To be a multiple of ${cuenta(`${b} = ${fb}`)} you need at least all its primes with their exponents. Your number, ${cuenta(fa)}: ${faltan.map(([p, e, n]) => `${e === 0 ? `it has no ${p}` : `it only has ${pot(p, e)}`}, you need ${num('en', n - e)} more ${p}${n - e === 1 ? '' : 's'}`).join('; ')}.`,
    },
    // Fallo de divisor: lista de primos que sobran, [[p, tiene, objetivo], …].
    noDivisor: {
      es: (b, fb, a, fa, sobran) => `Para ser divisor de ${cuenta(`${b} = ${fb}`)} no puedes pasarte del exponente de ningún primo. Tu número, ${cuenta(fa)}: ${sobran.map(([p, e, o]) => `${o === 0 ? `el objetivo no tiene ningún ${p}` : `el objetivo solo tiene ${pot(p, o)}`}, ${e - o === 1 ? 'sobra' : 'sobran'} ${num('es', e - o)} ${p}`).join('; ')}.`,
      en: (b, fb, a, fa, sobran) => `To be a divisor of ${cuenta(`${b} = ${fb}`)} you cannot go over the exponent of any prime. Your number, ${cuenta(fa)}: ${sobran.map(([p, e, o]) => `${o === 0 ? `the target has no ${p}` : `the target only has ${pot(p, o)}`}, ${num('en', e - o)} ${p}${e - o === 1 ? '' : 's'} too many`).join('; ')}.`,
    },
    // Ejercicio 3.
    mcmSobra: {
      es: (b, sobran, m, fm, a) => `Es múltiplo de ${b}, pero no el más pequeño: ${sobran.map(([p, n]) => `sobra${n === 1 ? '' : 'n'} ${num('es', n)} ${p}`).join('; ')}. El m.c.m. de ${a} y ${b} es ${cuenta(`${m} = ${fm}`)}.`,
      en: (b, sobran, m, fm, a) => `It is a multiple of ${b}, but not the smallest: ${sobran.map(([p, n]) => `${num('en', n)} ${p}${n === 1 ? '' : 's'} too many`).join('; ')}. The LCM of ${a} and ${b} is ${cuenta(`${m} = ${fm}`)}.`,
    },
    mcmBien: {
      es: (v, f, a, b) => `Has llegado a ${cuenta(`${f} = ${v}`)}, el m.c.m. de ${a} y ${b}: cada primo, con el mayor exponente.`,
      en: (v, f, a, b) => `You have reached ${cuenta(`${f} = ${v}`)}, the LCM of ${a} and ${b}: each prime, with the greatest exponent.`,
    },
    // Ejercicio 4.
    mcdDeMas: {
      es: (b, quitados, m, fm, a) => `Es divisor de ${b}, pero has dividido de más: ${quitados.map(([p, n]) => `no hacía falta quitar ${num('es', n)} ${p}`).join('; ')}. El m.c.d. de ${a} y ${b} es ${cuenta(`${m} = ${fm}`)}.`,
      en: (b, quitados, m, fm, a) => `It is a divisor of ${b}, but you have divided too much: ${quitados.map(([p, n]) => `you did not need to take away ${num('en', n)} ${p}${n === 1 ? '' : 's'}`).join('; ')}. The GCD of ${a} and ${b} is ${cuenta(`${m} = ${fm}`)}.`,
    },
    mcdBien: {
      es: (v, f, a, b) => `Has llegado a ${cuenta(v === 1 ? '1' : `${f} = ${v}`)}, el m.c.d. de ${a} y ${b}: cada primo, con el menor exponente.`,
      en: (v, f, a, b) => `You have reached ${cuenta(v === 1 ? '1' : `${f} = ${v}`)}, the GCD of ${a} and ${b}: each prime, with the smallest exponent.`,
    },
    mcdUno: {
      es: (a, b) => ` No tienen ningún primo en común, así que el único divisor común de ${a} y ${b} es 1.`,
      en: (a, b) => ` They have no prime in common, so the only common divisor of ${a} and ${b} is 1.`,
    },
  },
};
