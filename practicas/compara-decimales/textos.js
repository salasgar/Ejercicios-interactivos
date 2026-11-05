// Práctica «Compara, ordena y redondea» de la unidad 5 (PU2, tarea 124): textos propios, siempre
// { es, en }. Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`. Un texto con números es
// una función en cada idioma; los decimales llegan ya escritos en el idioma (coma en español, punto
// en inglés) y los símbolos < y > como `&lt;` y `&gt;` (son HTML).

const LT = '&lt;';
const GT = '&gt;';

export const TX = {
  comp: {
    nombre: { es: '¿Cuál es mayor?', en: 'Which is bigger?' },
    detalle: { es: 'Elige <, = o > entre dos decimales', en: 'Choose <, = or > between two decimals' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Se compara cifra a cifra desde la izquierda.</strong> Primero la parte entera; si es igual, las décimas; si también, las centésimas…</p>
        <p><strong>Más cifras no es mayor:</strong> 3,9 ${GT} 3,10 porque 9 décimas es más que 1 décima.</p>
        <p><strong>Truco:</strong> añade ceros a la derecha hasta que los dos tengan las mismas cifras decimales. 3,9 = 3,90 y 3,10: 90 centésimas ${GT} 10 centésimas.</p>
        <p><strong>Ceros:</strong> los de la derecha no cambian el valor (2,5 = 2,50); los de en medio, sí (2,05 ${LT} 2,5).</p>
        <p><strong>Negativos:</strong> toda negativa es menor que cualquier positiva; entre dos negativas, es menor la que está más lejos del 0.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Compare digit by digit from the left.</strong> First the whole part; if it is the same, the tenths; if they are the same too, the hundredths…</p>
        <p><strong>More digits does not mean greater:</strong> 3.9 ${GT} 3.10 because 9 tenths is more than 1 tenth.</p>
        <p><strong>Trick:</strong> add zeros on the right until both have the same number of decimal places. 3.9 = 3.90 and 3.10: 90 hundredths ${GT} 10 hundredths.</p>
        <p><strong>Zeros:</strong> zeros at the end do not change the value (2.5 = 2.50); zeros in the middle do (2.05 ${LT} 2.5).</p>
        <p><strong>Negatives:</strong> every negative number is less than any positive one; between two negatives, the one farther from 0 is less.</p>`,
    },
    pregunta: { es: '¿Qué signo va en el hueco?', en: 'Which sign goes in the gap?' },
    // Los métodos, con los números del ítem. A y B, los decimales tal cual; A2 y B2, con las mismas cifras decimales.
    metodo: {
      iguales: {
        es: (A, B) => `${A} = ${B}: los ceros que se escriben al final de la parte decimal no cambian el valor.`,
        en: (A, B) => `${A} = ${B}: zeros written at the end of the decimal part do not change the value.`,
      },
      ceros: {
        es: (conv, A, s, B) => `${conv}. El cero de en medio sí cuenta: ${A} ${s} ${B}.`,
        en: (conv, A, s, B) => `${conv}. A zero in the middle does count: ${A} ${s} ${B}.`,
      },
      mixto: {
        es: (neg, pos, A, s, B) => `${neg} es negativo y ${pos} es positivo: todo negativo es menor que cualquier positivo, así que ${A} ${s} ${B}.`,
        en: (neg, pos, A, s, B) => `${neg} is negative and ${pos} is positive: every negative number is less than any positive one, so ${A} ${s} ${B}.`,
      },
      negativos: {
        es: (a, s2, b, A, s, B) => `Los dos son negativos: es menor el que está más lejos del 0. Sin el signo, ${a} ${s2} ${b}, así que ${A} ${s} ${B}.`,
        en: (a, s2, b, A, s, B) => `Both are negative: the one farther from 0 is less. Without the sign, ${a} ${s2} ${b}, so ${A} ${s} ${B}.`,
      },
      cifras: {
        es: (conv, A2, s, B2, A, B) => `Con las mismas cifras decimales: ${conv}. ${A2} ${s} ${B2}, así que ${A} ${s} ${B}.`,
        en: (conv, A2, s, B2, A, B) => `With the same number of decimal places: ${conv}. ${A2} ${s} ${B2}, so ${A} ${s} ${B}.`,
      },
      cifrasIguales: {
        es: (A, B, s) => `Se comparan cifra a cifra desde la izquierda: ${A} ${s} ${B}.`,
        en: (A, B, s) => `Compare digit by digit from the left: ${A} ${s} ${B}.`,
      },
    },
    errores: {
      'compara-por-cifras': { es: 'Has comparado la parte decimal como si fuera un número entero: más cifras no es mayor.', en: 'You compared the decimal parts as if they were whole numbers: more digits does not mean greater.' },
      'cero-en-medio-sin-valor': { es: 'Has pensado que el cero de en medio no cuenta, y sí cuenta.', en: 'You thought the zero in the middle does not count, but it does.' },
      'cree-iguales': { es: 'Esos dos números no valen lo mismo.', en: 'Those two numbers are not equal.' },
      'cero-final-cambia-el-valor': { es: 'Has pensado que el cero del final cambia el valor, y no lo cambia.', en: 'You thought the zero at the end changes the value, but it does not.' },
      'ignora-el-signo': { es: 'Has comparado sin fijarte en el signo.', en: 'You compared without looking at the sign.' },
      'compara-mal': { es: 'Esa no es la comparación correcta.', en: 'That is not the right comparison.' },
    },
  },

  orden: {
    nombre: { es: 'Ordena', en: 'Put them in order' },
    detalle: { es: 'Ordena de menor a mayor o de mayor a menor', en: 'Put them in order, smallest to largest or largest to smallest' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Pasa todos a las mismas cifras decimales</strong> con ceros a la derecha y compáralos cifra a cifra. 2,3; 2,03; 2,33: son 2,30; 2,03; 2,33.</p>
        <p>Así se ve que 2,03 ${LT} 2,3 ${LT} 2,33, aunque 2,03 tenga más cifras que 2,3.</p>
        <p><strong>Toca los números en el orden que te piden.</strong> Si te equivocas, pulsa «Borrar».</p>
        <p><strong>Con negativos:</strong> el más lejos del 0 por la izquierda es el menor. −2,5 ${LT} −2,05.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Give all of them the same number of decimal places</strong> with zeros on the right and compare digit by digit. 2.3, 2.03, 2.33 are 2.30, 2.03, 2.33.</p>
        <p>So 2.03 ${LT} 2.3 ${LT} 2.33, even though 2.03 has more digits than 2.3.</p>
        <p><strong>Tap the numbers in the order you are asked.</strong> If you slip, press “Clear”.</p>
        <p><strong>With negatives:</strong> the one farther from 0 on the left is the least. −2.5 ${LT} −2.05.</p>`,
    },
    pregunta: {
      es: creciente => (creciente ? 'Ordena de <strong>menor a mayor</strong>: toca los números en ese orden.' : 'Ordena de <strong>mayor a menor</strong>: toca los números en ese orden.'),
      en: creciente => (creciente ? 'Put them in order, from <strong>smallest to largest</strong>: tap the numbers in that order.' : 'Put them in order, from <strong>largest to smallest</strong>: tap the numbers in that order.'),
    },
    tuOrden: { es: 'Tu orden', en: 'Your order' },
    metodo: {
      es: (lista, orden, creciente) => `Con las mismas cifras decimales: ${lista}. De ${creciente ? 'menor a mayor' : 'mayor a menor'}: ${orden}.`,
      en: (lista, orden, creciente) => `With the same number of decimal places: ${lista}. From ${creciente ? 'smallest to largest' : 'largest to smallest'}: ${orden}.`,
    },
    errores: {
      'compara-por-cifras': { es: 'Has ordenado mirando la parte decimal como un número entero: más cifras no es mayor.', en: 'You ordered by reading the decimal part as a whole number: more digits does not mean greater.' },
      'ignora-el-signo': { es: 'Has ordenado sin fijarte en el signo: entre negativos es menor el que está más lejos del 0.', en: 'You ordered without looking at the sign: among negatives, the one farther from 0 is less.' },
      'orden-al-reves': { es: 'Has ordenado al revés de lo que se pedía.', en: 'You put them in the opposite order to the one asked.' },
      'orden-mal': { es: 'Ese no es el orden correcto.', en: 'That is not the right order.' },
    },
  },

  entre: {
    nombre: { es: 'Entre dos', en: 'In between' },
    detalle: { es: 'Encuentra un decimal entre otros dos', en: 'Find a decimal between two others' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Siempre hay uno entre dos decimales distintos.</strong> Entre 3,4 y 3,5 está 3,45; y también 3,41 o 3,499.</p>
        <p><strong>Truco:</strong> añade una cifra decimal más. 3,4 = 3,40 y 3,5 = 3,50, y entre 3,40 y 3,50 están 3,41; 3,42; …; 3,49.</p>
        <p>Un extremo escrito con otro cero (3,40) <strong>no</strong> está «entre» los dos: es el mismo número.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>There is always one between two different decimals.</strong> Between 3.4 and 3.5 there is 3.45, and also 3.41 or 3.499.</p>
        <p><strong>Trick:</strong> add one more decimal place. 3.4 = 3.40 and 3.5 = 3.50, and between 3.40 and 3.50 there are 3.41, 3.42, …, 3.49.</p>
        <p>An end number written with another zero (3.40) is <strong>not</strong> “between” the two: it is the same number.</p>`,
    },
    escribe: {
      es: (A, B) => `Escribe un decimal que esté entre <strong>${A}</strong> y <strong>${B}</strong>.`,
      en: (A, B) => `Write a decimal that is between <strong>${A}</strong> and <strong>${B}</strong>.`,
    },
    elige: {
      es: (A, B) => `¿Cuál de estos números está entre <strong>${A}</strong> y <strong>${B}</strong>?`,
      en: (A, B) => `Which of these numbers is between <strong>${A}</strong> and <strong>${B}</strong>?`,
    },
    campo: { es: 'Tu decimal', en: 'Your decimal' },
    metodo: {
      es: (A, B, A2, B2, ej) => `Con una cifra decimal más: ${A} = ${A2} y ${B} = ${B2}. Entre ${A2} y ${B2} hay muchos números; por ejemplo, ${ej}.`,
      en: (A, B, A2, B2, ej) => `With one more decimal place: ${A} = ${A2} and ${B} = ${B2}. Between ${A2} and ${B2} there are many numbers; for example, ${ej}.`,
    },
    errores: {
      'repite-un-extremo': { es: 'Has escrito uno de los dos números (con otra escritura): tiene que estar entre ellos, no ser uno de ellos.', en: 'You wrote one of the two numbers (written differently): it has to be between them, not one of them.' },
      'fuera-por-debajo': { es: 'Ese número es menor que el primero, así que no está entre los dos.', en: 'That number is less than the first one, so it is not between the two.' },
      'fuera-por-encima': { es: 'Ese número es mayor que el segundo, así que no está entre los dos.', en: 'That number is greater than the second one, so it is not between the two.' },
      'ignora-parte-entera': { es: 'Has mirado solo las cifras decimales: la parte entera también cuenta.', en: 'You looked only at the decimal digits: the whole part counts too.' },
    },
  },

  red: {
    nombre: { es: 'Redondea', en: 'Round it' },
    detalle: { es: 'Redondea a la unidad, a la décima o a la centésima', en: 'Round to the nearest whole number, tenth or hundredth' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Mira solo la cifra siguiente</strong> a la que vas a dejar. Si es 5 o más, la última cifra sube; si es 4 o menos, se queda.</p>
        <p>3,678 a la décima: la cifra siguiente a la 6 es 7, así que sube: <strong>3,7</strong>. A la centésima: la siguiente a la 7 es 8, así que <strong>3,68</strong>.</p>
        <p><strong>Una sola vez, desde el número original:</strong> 3,649 a la décima es 3,6 (no 3,65 y luego 3,7).</p>
        <p><strong>Si sube un 9, arrastra:</strong> 2,96 a la décima es <strong>3,0</strong>.</p>
        <p>«A la décima» y «con una cifra decimal» son lo mismo.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Look only at the next digit</strong> after the one you keep. If it is 5 or more, the last digit goes up; if it is 4 or less, it stays.</p>
        <p>3.678 to the nearest tenth: the digit after the 6 is 7, so it goes up: <strong>3.7</strong>. To the nearest hundredth: the digit after the 7 is 8, so <strong>3.68</strong>.</p>
        <p><strong>Round once, from the original number:</strong> 3.649 to the nearest tenth is 3.6 (not 3.65 and then 3.7).</p>
        <p><strong>If a 9 goes up, it carries:</strong> 2.96 to the nearest tenth is <strong>3.0</strong>.</p>
        <p>“To the nearest tenth” and “to one decimal place” mean the same.</p>`,
    },
    // La consigna: c = 0, 1, 2 cifras decimales; `orden` o `cifras` (nunca juntas en un ítem).
    consigna: {
      entero: { es: N => `Redondea <strong>${N}</strong> a la unidad.`, en: N => `Round <strong>${N}</strong> to the nearest whole number.` },
      orden: [
        null,
        { es: N => `Redondea <strong>${N}</strong> a la décima.`, en: N => `Round <strong>${N}</strong> to the nearest tenth.` },
        { es: N => `Redondea <strong>${N}</strong> a la centésima.`, en: N => `Round <strong>${N}</strong> to the nearest hundredth.` },
      ],
      cifras: [
        null,
        { es: N => `Redondea <strong>${N}</strong> a una cifra decimal.`, en: N => `Round <strong>${N}</strong> to one decimal place.` },
        { es: N => `Redondea <strong>${N}</strong> a dos cifras decimales.`, en: N => `Round <strong>${N}</strong> to two decimal places.` },
      ],
    },
    // Lo que se pide escribir: exactamente c cifras decimales.
    formato: [
      { es: 'Escribe un número entero.', en: 'Write a whole number.' },
      { es: 'Escribe el resultado con una cifra decimal.', en: 'Write the result with one decimal place.' },
      { es: 'Escribe el resultado con dos cifras decimales.', en: 'Write the result with two decimal places.' },
    ],
    campo: { es: 'Tu resultado', en: 'Your answer' },
    metodo: {
      // N, dígito siguiente, nombre de su orden (singular), R el resultado
      es: (N, sig, orden, sube, R) => `Miramos solo la cifra siguiente, la de las ${orden} de ${N}: es ${sig}. ${sube ? 'Es 5 o más: la última cifra que dejamos sube' : 'Es 4 o menos: la última cifra que dejamos se queda'}. Resultado: ${R}.`,
      en: (N, sig, orden, sube, R) => `We look only at the next digit, the ${orden} digit of ${N}: it is ${sig}. ${sube ? 'It is 5 or more: the last digit we keep goes up' : 'It is 4 or less: the last digit we keep stays'}. Answer: ${R}.`,
    },
    acarreo: {
      es: (antes, R) => `Como sube un 9, arrastra: ${antes} + una unidad de ese orden es ${R}.`,
      en: (antes, R) => `Since a 9 goes up, it carries: ${antes} plus one unit of that place is ${R}.`,
    },
    errores: {
      'redondea-truncando': { es: 'Has cortado el número en vez de redondearlo: hay que mirar la cifra siguiente.', en: 'You cut the number off instead of rounding it: you have to look at the next digit.' },
      'sube-siempre': { es: 'Has subido la última cifra sin mirar la siguiente: solo sube si la siguiente es 5 o más.', en: 'You raised the last digit without looking at the next one: it only goes up if the next digit is 5 or more.' },
      'redondea-en-cadena': { es: 'Has redondeado cifra a cifra desde el final: se redondea una sola vez, mirando solo la cifra siguiente.', en: 'You rounded digit by digit from the end: round once, looking only at the next digit.' },
      'redondea-otro-orden': { es: 'Has redondeado a otro orden del que se pedía.', en: 'You rounded to a different place from the one asked.' },
      'sin-llevar': { es: 'Has subido el 9 sin llevar: 9 + 1 = 10, y el 1 se suma a la cifra de la izquierda.', en: 'You raised the 9 without carrying: 9 + 1 = 10, and the 1 is added to the digit on the left.' },
      'cifras-distintas': { es: 'El valor es el correcto, pero no tiene las cifras decimales que se pedían.', en: 'The value is right, but it does not have the decimal places asked for.' },
      'redondeo-mal': { es: 'Ese no es el redondeo correcto.', en: 'That is not the right rounding.' },
    },
  },
};
