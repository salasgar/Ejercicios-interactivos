// Textos propios de «¿Qué se hace primero? Con enteros», siempre { es, en }. Los
// comunes (Comprobar, Siguiente…) llegan en `api.t`. Producto con «·», nunca «×»;
// el menos es U+2212; el hueco es «□». Las operaciones (`3 · (−2)`, `(−2)²`) llegan
// ya escritas por `enteros.js`.

export const TX = {
  toca: { es: 'Toca la operación que se hace primero.', en: 'Tap the operation that comes first.' },
  toca_paso: { es: 'Toca la operación que va ahora.', en: 'Tap the operation that comes now.' },
  cuanto: { es: op => `¿Cuánto vale <span class="cuenta">${op}</span>?`, en: op => `What is <span class="cuenta">${op}</span>?` },
  calcula_dos: { es: 'Calcula las dos expresiones.', en: 'Work out both expressions.' },
  resultado: { es: 'Resultado', en: 'Result' },
  tu_valor: { es: 'Tú has escrito', en: 'You wrote' },

  // --- Avisos mientras se hace el ejercicio y explicaciones al terminar ---
  ahora_si: { es: 'Bien.', en: 'Good.' },
  va_primero: { es: op => `Va primero <span class="cuenta">${op}</span>`, en: op => `<span class="cuenta">${op}</span> comes first` },
  podian: { es: lista => `Podían ir primero: ${lista}`, en: lista => `These could come first: ${lista}` },
  orden: {
    es: 'Primero las potencias, después los productos y cocientes, y al final las sumas y restas.',
    en: 'First the powers, then the products and quotients, and last the additions and subtractions.',
  },
  mal_jerarquia: {
    es: op => `Ahí no: antes hay que hacer <span class="cuenta">${op}</span>. Primero las potencias, después los productos y cocientes, y al final las sumas y restas.`,
    en: op => `Not there: first you have to do <span class="cuenta">${op}</span>. First the powers, then the products and quotients, and last the additions and subtractions.`,
  },
  mal_izquierda: {
    es: op => `Ahí no: si hay varias operaciones seguidas del mismo nivel, se hace antes la de la izquierda. Aquí va primero <span class="cuenta">${op}</span>.`,
    en: op => `Not there: when there are several operations of the same level in a row, the one on the left comes first. Here <span class="cuenta">${op}</span> comes first.`,
  },
  mal_resultado: {
    es: (op, bueno) => `<span class="cuenta">${op} = ${bueno}</span>.`,
    en: (op, bueno) => `<span class="cuenta">${op} = ${bueno}</span>.`,
  },
  pista: {
    'regla-signos-en-suma': { es: 'Al sumar dos negativos se suman sus valores absolutos y el resultado es negativo.', en: 'When you add two negative numbers, you add their absolute values and the result is negative.' },
    'suma-valores-absolutos': { es: 'Con signos distintos se restan los valores absolutos, no se suman.', en: 'With different signs, you subtract the absolute values; you do not add them.' },
    'olvida-el-signo': { es: 'Ojo con el signo del resultado: gana el signo del número con mayor valor absoluto.', en: 'Watch the sign of the result: it is the sign of the number with the greater absolute value.' },
    'signo-del-primero': { es: 'El signo del resultado es el del número con mayor valor absoluto, no el del primero.', en: 'The sign of the result is the one of the number with the greater absolute value, not the first one.' },
    'sumar-negativo': { es: 'Sumar un negativo es restar su valor absoluto.', en: 'Adding a negative number is subtracting its absolute value.' },
    'restar-negativo': { es: 'Restar un negativo es sumar su valor absoluto.', en: 'Subtracting a negative number is adding its absolute value.' },
    'mismo-signo-dos-veces': { es: 'Restar un número es ir hacia abajo: el signo de ese número no se cambia además.', en: 'Subtracting a number means going down: you do not also change the sign of that number.' },
    'signo-del-mayor-producto': { es: 'En un producto no manda el número mayor: signos distintos dan negativo y signos iguales dan positivo.', en: 'In a product the bigger number does not decide: different signs give a negative result and equal signs give a positive one.' },
    'signo-del-mayor-cociente': { es: 'En un cociente no manda el número mayor: signos distintos dan negativo y signos iguales dan positivo.', en: 'In a quotient the bigger number does not decide: different signs give a negative result and equal signs give a positive one.' },
    'potencia-par-negativa': { es: 'Una base negativa con exponente par da un resultado positivo.', en: 'A negative base with an even exponent gives a positive result.' },
    'potencia-impar-positiva': { es: 'Una base negativa con exponente impar da un resultado negativo.', en: 'A negative base with an odd exponent gives a negative result.' },
    'potencia-positiva-negativa': { es: 'Una base positiva da siempre un resultado positivo.', en: 'A positive base always gives a positive result.' },
    'base-por-exponente': { es: 'El exponente dice cuántas veces se multiplica la base por sí misma; no se multiplica por él.', en: 'The exponent says how many times the base is multiplied by itself; you do not multiply by it.' },
    'signo-cambiado': { es: 'Mira otra vez el signo del resultado.', en: 'Look at the sign of the result again.' },
    'confunde-la-operacion': { es: 'Fíjate en qué operación es.', en: 'Look at which operation it is.' },
    'sin-jerarquia': { es: 'No se puede ir de izquierda a derecha sin más: manda la jerarquía.', en: 'You cannot just go from left to right: the order of operations decides.' },
    'derecha-a-izquierda': { es: 'No se va de derecha a izquierda: en las operaciones del mismo nivel se empieza por la izquierda.', en: 'You do not go from right to left: with operations of the same level, you start on the left.' },
    'menos-en-la-base': { es: 'El menos de delante no está en la base: −2² es −(2 · 2).', en: 'The minus sign in front is not part of the base: −2² is −(2 · 2).' },
  },

  // --- Ejercicio 1 ---
  ej1: {
    nombre: { es: '¿Qué va primero?', en: 'What comes first?' },
    detalle: { es: 'Toca la operación que se hace primero', en: 'Tap the operation that comes first' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cuando hay varias operaciones, el orden es: <strong>potencias</strong>, después <strong>productos y cocientes</strong> y al final <strong>sumas y restas</strong>.</p>
        <p>Por ejemplo, en <strong>−4 + 3 · (−2)<sup>2</sup></strong> va primero la potencia (−2)<sup>2</sup>. Toca el signo de la operación que se hace primero; si hay varias que pueden ir primero, vale cualquiera.</p>`,
      en: `<h2>How it works</h2>
        <p>When there are several operations, the order is: <strong>powers</strong>, then <strong>products and quotients</strong>, and last <strong>additions and subtractions</strong>.</p>
        <p>For example, in <strong>−4 + 3 · (−2)<sup>2</sup></strong> the power (−2)<sup>2</sup> comes first. Tap the sign of the operation that comes first; if several can go first, any of them is right.</p>`,
    },
  },
  // --- Ejercicio 2 ---
  ej2: {
    nombre: { es: 'Producto o potencia dentro de una suma', en: 'A product or a power inside a sum' },
    detalle: { es: 'Resuélvela paso a paso', en: 'Work it out step by step' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca la operación que va ahora y elige cuánto vale. Así hasta llegar a un solo número.</p>
        <p>Por ejemplo: <strong>4 − 5 · 2</strong> → primero el producto, 5 · 2 = 10 → <strong>4 − 10 = −6</strong>. El menos que va delante del 5 · 2 se usa una sola vez.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap the operation that comes now and choose its value. Keep going until you get a single number.</p>
        <p>For example: <strong>4 − 5 · 2</strong> → first the product, 5 · 2 = 10 → <strong>4 − 10 = −6</strong>. The minus sign in front of 5 · 2 is used only once.</p>`,
    },
  },
  // --- Ejercicio 3 ---
  ej3: {
    nombre: { es: 'Cadenas de · y :', en: 'Chains of · and :' },
    detalle: { es: 'De izquierda a derecha, y el paréntesis que agrupa', en: 'From left to right, and the brackets that group' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Los productos y los cocientes seguidos se hacen <strong>de izquierda a derecha</strong>: 30 : (−5) · 2 = (−6) · 2 = −12.</p>
        <p>Pero si un paréntesis agrupa, primero se hace lo de dentro: 30 : (−5 · 2) = 30 : (−10) = −3. A veces te pediremos las dos para que veas que no dan lo mismo.</p>`,
      en: `<h2>How it works</h2>
        <p>Products and quotients in a row are done <strong>from left to right</strong>: 30 : (−5) · 2 = (−6) · 2 = −12.</p>
        <p>But if brackets group part of the calculation, you do what is inside first: 30 : (−5 · 2) = 30 : (−10) = −3. Sometimes we will ask you for both so that you see they are not equal.</p>`,
    },
    par_agrupa: {
      es: 'El paréntesis agrupa: primero se hace lo de dentro, y por eso no dan lo mismo.',
      en: 'The brackets group: you do what is inside first, so the results are not the same.',
    },
    par_ignorado: {
      es: 'Ojo: el paréntesis cambia el cálculo. No se puede quitar sin más.',
      en: 'Careful: the brackets change the calculation. You cannot just remove them.',
    },
  },
  // --- Ejercicio 4 ---
  ej4: {
    nombre: { es: 'Combinadas', en: 'Mixed operations' },
    detalle: { es: 'Potencias, productos y sumas juntas', en: 'Powers, products and additions together' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Primero las <strong>potencias</strong>, después los <strong>productos y cocientes</strong> y al final las <strong>sumas y restas</strong>.</p>
        <p>Por ejemplo: <strong>−4 + 3 · (−2)<sup>2</sup></strong> = −4 + 3 · 4 = −4 + 12 = <strong>8</strong>. Toca cada operación en su turno y elige su valor.</p>`,
      en: `<h2>How it works</h2>
        <p>First the <strong>powers</strong>, then the <strong>products and quotients</strong>, and last the <strong>additions and subtractions</strong>.</p>
        <p>For example: <strong>−4 + 3 · (−2)<sup>2</sup></strong> = −4 + 3 · 4 = −4 + 12 = <strong>8</strong>. Tap each operation in its turn and choose its value.</p>`,
    },
  },
};
