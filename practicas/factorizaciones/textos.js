// Práctica «Operar con factorizaciones»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, Sí, No…) llegan a `montar` en `api.t`.
// Reglas de contenido: «divisor», no «factor», para la relación entre números;
// producto con «·»; sin letras ni fórmulas generales; inglés sencillo.
//
// `expl` son las piezas del feedback que arma `logica.js` (`explicar`): todas
// reciben números de ese ítem y devuelven texto con HTML mínimo (<sup>).

const pot = (p, e) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);
const cuenta = html => `<span class="cuenta">${html}</span>`;

export const TX = {
  producto: {
    nombre: { es: 'El producto', en: 'The product' },
    detalle: { es: 'Multiplica sumando exponentes', en: 'Multiply by adding exponents' },
    introduccion: {
      es: `<h2>Multiplicar sin calcular</h2>
        <p>12 = 2<sup>2</sup> · 3 y 18 = 2 · 3<sup>2</sup>. Su producto es 12 · 18 = 216.</p>
        <p>¿Cómo se factoriza 216? Basta <strong>sumar los exponentes</strong> de cada primo:
        2<sup>2+1</sup> · 3<sup>1+2</sup> = <strong>2<sup>3</sup> · 3<sup>3</sup></strong>.</p>
        <p>Compruébalo: 8 · 27 = 216.</p>
        <p>Con los botones <strong>+</strong> y <strong>−</strong> eliges el exponente de cada primo.</p>`,
      en: `<h2>Multiply without calculating</h2>
        <p>12 = 2<sup>2</sup> · 3 and 18 = 2 · 3<sup>2</sup>. Their product is 12 · 18 = 216.</p>
        <p>How do we factorise 216? Just <strong>add the exponents</strong> of each prime:
        2<sup>2+1</sup> · 3<sup>1+2</sup> = <strong>2<sup>3</sup> · 3<sup>3</sup></strong>.</p>
        <p>Check it: 8 · 27 = 216.</p>
        <p>Use the <strong>+</strong> and <strong>−</strong> buttons to choose the exponent of each prime.</p>`,
    },
    instruccion: {
      es: 'Escribe la factorización del producto. Suma los exponentes.',
      en: 'Write the prime factorisation of the product. Add the exponents.',
    },
  },
  multiplo: {
    nombre: { es: '¿Es múltiplo?', en: 'Is it a multiple?' },
    detalle: { es: 'Compara exponentes, sin dividir', en: 'Compare exponents, no dividing' },
    introduccion: {
      es: `<h2>No hace falta dividir</h2>
        <p>Un número es múltiplo de otro si tiene <strong>todos sus primos</strong>, cada uno con
        <strong>exponente igual o mayor</strong>.</p>
        <p>Si es múltiplo, el número por el que hay que multiplicar se construye con lo que falta:
        <strong>restando exponentes</strong>.</p>
        <p>Mira los exponentes y decide.</p>`,
      en: `<h2>No need to divide</h2>
        <p>A number is a multiple of another if it has <strong>all its primes</strong>, each one with an
        <strong>equal or greater exponent</strong>.</p>
        <p>If it is a multiple, the number to multiply by is built with what is missing:
        <strong>subtract the exponents</strong>.</p>
        <p>Look at the exponents and decide.</p>`,
    },
    pregunta: {
      es: (a, b) => `¿Es ${a} múltiplo de ${b}?`,
      en: (a, b) => `Is ${a} a multiple of ${b}?`,
    },
    segunda: {
      es: (a, b) => `¿Por qué número hay que multiplicar ${b} para obtener ${a}? Construye su factorización.`,
      en: (a, b) => `What number do we multiply ${b} by to get ${a}? Build its prime factorisation.`,
    },
  },
  cociente: {
    nombre: { es: 'El cociente', en: 'The quotient' },
    detalle: { es: 'Divide restando exponentes', en: 'Divide by subtracting exponents' },
    introduccion: {
      es: `<h2>Dividir sin calcular</h2>
        <p>1800 = 2<sup>3</sup> · 3<sup>2</sup> · 5<sup>2</sup> y 60 = 2<sup>2</sup> · 3 · 5.</p>
        <p>Para hallar 1800 : 60 basta <strong>restar los exponentes</strong> de cada primo:
        2<sup>3−2</sup> · 3<sup>2−1</sup> · 5<sup>2−1</sup> = <strong>2 · 3 · 5 = 30</strong>.</p>
        <p>Si un exponente da 0, ese primo desaparece. Si un primo no está en el divisor, pasa entero.</p>`,
      en: `<h2>Divide without calculating</h2>
        <p>1800 = 2<sup>3</sup> · 3<sup>2</sup> · 5<sup>2</sup> and 60 = 2<sup>2</sup> · 3 · 5.</p>
        <p>To find 1800 : 60 just <strong>subtract the exponents</strong> of each prime:
        2<sup>3−2</sup> · 3<sup>2−1</sup> · 5<sup>2−1</sup> = <strong>2 · 3 · 5 = 30</strong>.</p>
        <p>If an exponent is 0, that prime disappears. If a prime is not in the divisor, it stays as it is.</p>`,
    },
    instruccion: {
      es: 'Escribe la factorización del cociente. Resta los exponentes.',
      en: 'Write the prime factorisation of the quotient. Subtract the exponents.',
    },
    enunciado: { es: (a, b) => `${a} : ${b}`, en: (a, b) => `${a} ÷ ${b}` },
  },
  exponente_de: { es: p => `Exponente de ${p}`, en: p => `Exponent of ${p}` },
  producto_de: { es: (a, b) => `${a} · ${b}`, en: (a, b) => `${a} · ${b}` },

  // Piezas del feedback (las arma logica.js).
  expl: {
    suma: {
      es: (p, ea, eb) => `el ${p}: ${ea} + ${eb} = ${ea + eb} → ${pot(p, ea + eb)}`,
      en: (p, ea, eb) => `the ${p}: ${ea} + ${eb} = ${ea + eb} → ${pot(p, ea + eb)}`,
    },
    solo_en: {
      es: (p, e, n) => `el ${p} solo está en ${n}: ${pot(p, e)} pasa tal cual`,
      en: (p, e, n) => `the ${p} is only in ${n}: ${pot(p, e)} stays as it is`,
    },
    compruebalo: { es: 'Compruébalo:', en: 'Check it:' },
    resta: {
      es: (p, ea, eb) => `el ${p}: ${ea} − ${eb} = ${ea - eb}${ea === eb ? ', desaparece' : ` → ${pot(p, ea - eb)}`}`,
      en: (p, ea, eb) => `the ${p}: ${ea} − ${eb} = ${ea - eb}${ea === eb ? ', it disappears' : ` → ${pot(p, ea - eb)}`}`,
    },
    pasa_entero: {
      es: (p, e, n) => `el ${p} no está en ${n}: ${pot(p, e)} pasa entero`,
      en: (p, e, n) => `the ${p} is not in ${n}: ${pot(p, e)} stays whole`,
    },
    cociente_uno: {
      es: (a, b) => `${a} y ${b} son el mismo número: el cociente es 1`,
      en: (a, b) => `${a} and ${b} are the same number: the quotient is 1`,
    },
    es_multiplo: {
      es: (a, b) => `Sí: todos los primos de ${b} están en ${a} con exponente igual o mayor`,
      en: (a, b) => `Yes: all the primes of ${b} are in ${a} with an equal or greater exponent`,
    },
    falta_primo: {
      es: (a, b, p) => `No: ${b} tiene el primo ${p} y ${a} no`,
      en: (a, b, p) => `No: ${b} has the prime ${p} and ${a} does not`,
    },
    exponente_menor: {
      es: (a, b, p, ea, eb) => `No: ${b} tiene ${pot(p, eb)} y ${a} solo ${pot(p, ea)}`,
      en: (a, b, p, ea, eb) => `No: ${b} has ${pot(p, eb)} and ${a} only ${pot(p, ea)}`,
    },
    sin_dividir: { es: 'No hace falta dividir: mira los exponentes.', en: 'No need to divide: look at the exponents.' },
    tuya: {
      es: (f, v) => `Lo que has escrito vale ${cuenta(`${f} = ${v}`)}.`,
      en: (f, v) => `What you wrote is worth ${cuenta(`${f} = ${v}`)}.`,
    },
  },
};
