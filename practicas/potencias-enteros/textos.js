// Textos propios de «Productos y potencias con signo», siempre { es, en }. Los
// comunes (Comprobar, Siguiente…) llegan en `api.t`. Producto con «·», nunca «×»;
// el menos es U+2212; el hueco es «□».

const plural = (n, uno, varios) => (n === 1 ? uno : varios);

export const TX = {
  ej1: {
    nombre: { es: 'Cuenta los negativos', en: 'Count the negatives' },
    detalle: { es: 'El signo de un producto de varios factores', en: 'The sign of a product of several factors' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca los factores <strong>negativos</strong> y escribe el resultado. Si hay un número <em>par</em> de negativos, el producto es positivo; si hay un número <em>impar</em>, es negativo.</p>
        <p>Por ejemplo: <strong>(−2) · 3 · (−1)</strong> tiene dos negativos (par), así que da <strong>6</strong>. Y si un factor es 0, el producto es 0.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap the <strong>negative</strong> factors and write the result. An <em>even</em> number (número par) of negatives gives a positive product; an <em>odd</em> number (número impar) gives a negative one.</p>
        <p>For example: <strong>(−2) · 3 · (−1)</strong> has two negatives (even), so it is <strong>6</strong>. And if a factor is 0, the product is 0.</p>`,
    },
    toca: { es: 'Toca los factores negativos.', en: 'Tap the negative factors.' },
    escribe: { es: 'Escribe el resultado.', en: 'Write the result.' },
    resultado: { es: 'Resultado', en: 'Result' },
    marcados: {
      es: k => `Has marcado ${k} ${plural(k, 'negativo', 'negativos')}`,
      en: k => `You have marked ${k} negative${k === 1 ? '' : 's'}`,
    },
    hay: {
      es: (k, par) => `Hay ${k} ${plural(k, 'factor negativo', 'factores negativos')} (${par ? 'par' : 'impar'})`,
      en: (k, par) => `There ${k === 1 ? 'is' : 'are'} ${k} negative factor${k === 1 ? '' : 's'} (${par ? 'even' : 'odd'})`,
    },
    asi_que: {
      es: positivo => (positivo ? 'así que el producto es positivo' : 'así que el producto es negativo'),
      en: positivo => (positivo ? 'so the product is positive' : 'so the product is negative'),
    },
    cero: { es: 'Un factor es 0, así que el producto es 0', en: 'One factor is 0, so the product is 0' },
    tu_conteo: {
      es: (mios, buenos) => `Tú has marcado ${mios}, pero hay ${buenos}`,
      en: (mios, buenos) => `You marked ${mios}, but there are ${buenos}`,
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
  },
  ej2: {
    nombre: { es: 'Potencia de base negativa', en: 'Power with a negative base' },
    detalle: { es: 'El signo lo decide el exponente', en: 'The exponent decides the sign' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En <strong>(−2)<sup>3</sup></strong> la base es −2 y se multiplica por sí misma 3 veces: (−2) · (−2) · (−2).</p>
        <p>Si el exponente es <strong>par</strong>, el resultado es <strong>positivo</strong>; si es <strong>impar</strong>, es <strong>negativo</strong>. Primero decide el signo y después calcula el valor.</p>`,
      en: `<h2>How it works</h2>
        <p>In <strong>(−2)<sup>3</sup></strong> the base is −2 and it is multiplied by itself 3 times: (−2) · (−2) · (−2).</p>
        <p>If the exponent is <strong>even</strong> (par), the result is <strong>positive</strong>; if it is <strong>odd</strong> (impar), it is <strong>negative</strong>. First decide the sign, then work out the value.</p>`,
    },
    signo: { es: '¿Qué signo tiene el resultado?', en: 'What is the sign of the result?' },
    positivo: { es: 'Positivo', en: 'Positive' },
    negativo: { es: 'Negativo', en: 'Negative' },
    valor: { es: 'Escribe el valor.', en: 'Write the value.' },
    campo: { es: 'Valor', en: 'Value' },
    par: {
      es: (exp, positivo) => `El exponente ${exp} es ${exp % 2 === 0 ? 'par' : 'impar'}: el resultado es ${positivo ? 'positivo' : 'negativo'}`,
      en: (exp, positivo) => `The exponent ${exp} is ${exp % 2 === 0 ? 'even' : 'odd'}: the result is ${positivo ? 'positive' : 'negative'}`,
    },
    signo_mal: {
      es: 'Con el exponente par el resultado es positivo; con el impar, negativo.',
      en: 'With an even exponent the result is positive; with an odd one, negative.',
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
  },
  ej3: {
    nombre: { es: '¿Cuál es la base?', en: 'What is the base?' },
    detalle: { es: '(−3)² frente a −3²', en: '(−3)² against −3²' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El exponente solo afecta a lo que tiene <strong>justo debajo</strong>: la base.</p>
        <p>En <strong>(−3)<sup>2</sup></strong> la base es −3: (−3) · (−3) = 9. En <strong>−3<sup>2</sup></strong> la base es 3 y el menos se queda fuera: −(3 · 3) = −9.</p>`,
      en: `<h2>How it works</h2>
        <p>The exponent only affects what is <strong>right below it</strong>: the base.</p>
        <p>In <strong>(−3)<sup>2</sup></strong> the base is −3: (−3) · (−3) = 9. In <strong>−3<sup>2</sup></strong> the base is 3 and the minus sign stays outside: −(3 · 3) = −9.</p>`,
    },
    pregunta: { es: '¿Cuál es la base?', en: 'What is the base?' },
    valor: { es: 'Ahora calcula el valor.', en: 'Now work out the value.' },
    campo: { es: 'Valor', en: 'Value' },
    base_es: {
      es: base => `La base es ${base}`,
      en: base => `The base is ${base}`,
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
    cuenta_a: {
      es: (b, exp, v) => `${b} multiplicado ${exp} veces por sí mismo da ${v}`,
      en: (b, exp, v) => `${b} multiplied by itself ${exp} times is ${v}`,
    },
    fuera: {
      es: 'El menos de delante no es de la base: se hace primero la potencia y después se le pone el menos',
      en: 'The minus sign in front is not part of the base: work out the power first, then put the minus sign',
    },
    dentro: {
      es: 'Se hace la potencia de la base entre paréntesis y después se cambia el signo del resultado',
      en: 'Work out the power of the base in brackets, then change the sign of the result',
    },
  },
  ej4: {
    nombre: { es: 'Cuadrados y raíces', en: 'Squares and roots' },
    detalle: { es: 'Qué enteros al cuadrado dan un número', en: 'Which integers squared give a number' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos enteros opuestos tienen el mismo cuadrado: 7<sup>2</sup> = 49 y (−7)<sup>2</sup> = 49. Si te preguntan qué enteros al cuadrado dan 49, marca <strong>los dos</strong>.</p>
        <p>El signo <strong>√</strong> pide solo el positivo: √49 = 7. Y √(−49) no existe: ningún entero al cuadrado da un número negativo.</p>`,
      en: `<h2>How it works</h2>
        <p>Two opposite integers have the same square: 7<sup>2</sup> = 49 and (−7)<sup>2</sup> = 49. If you are asked which integers squared give 49, tap <strong>both</strong>.</p>
        <p>The <strong>√</strong> sign asks only for the positive one: √49 = 7. And √(−49) does not exist: no integer squared gives a negative number.</p>`,
    },
    cuadrados: {
      es: n => `¿Qué enteros, al cuadrado, dan ${n}? Marca todos los que sirvan.`,
      en: n => `Which integers, squared, give ${n}? Tap all that work.`,
    },
    raiz: { es: 'Escribe el valor, o toca «No existe».', en: 'Write the value, or tap “Does not exist”.' },
    no_existe: { es: 'No existe', en: 'Does not exist' },
    campo: { es: 'Raíz', en: 'Root' },
    los_dos: {
      es: (r, n) => `Los dos enteros son ${r} y −${r}`,
      en: (r, n) => `The two integers are ${r} and −${r}`,
    },
    solo_uno: {
      es: (r, elegido) => `Falta el opuesto: ${elegido > 0 ? `−${r}` : `${r}`} también vale`,
      en: (r, elegido) => `One is missing: ${elegido > 0 ? `−${r}` : `${r}`} works too`,
    },
    no_sirve: {
      es: (v, c, n) => `${v} no sirve: ${c} no es ${n}`,
      en: (v, c, n) => `${v} does not work: ${c} is not ${n}`,
    },
    raiz_buena: {
      es: (r, n) => `La raíz cuadrada de ${n} es el entero positivo que al cuadrado da ${n}`,
      en: (r, n) => `The square root of ${n} is the positive integer that gives ${n} when squared`,
    },
    raiz_negativa: {
      es: r => `√ pide solo el positivo: la raíz es ${r}, no −${r}`,
      en: r => `√ asks only for the positive one: the root is ${r}, not −${r}`,
    },
    raiz_no_existe: {
      es: r => `Sí existe: ${r} · ${r} = ${r * r}`,
      en: r => `It does exist: ${r} · ${r} = ${r * r}`,
    },
    negativa_no_existe: {
      es: n => `√(−${n}) no existe: ningún entero al cuadrado da un número negativo`,
      en: n => `√(−${n}) does not exist: no integer squared gives a negative number`,
    },
    negativa_ejemplo: {
      es: r => `Por ejemplo, ${r}² = ${r * r} y (−${r})² = ${r * r}, ninguno da −${r * r}`,
      en: r => `For example, ${r}² = ${r * r} and (−${r})² = ${r * r}, neither gives −${r * r}`,
    },
    tu_valor: { es: 'Tú has escrito', en: 'You wrote' },
  },
};
