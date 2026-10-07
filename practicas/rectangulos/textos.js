// Práctica «Divisores por parejas con rectángulos»: textos propios, siempre
// { es, en }. Los comunes (Comprobar, Siguiente, ¡Bien!…) están en
// `../_comun/textos.js` y llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·», nunca «×»; inglés sencillo; el feedback dice
// qué pasa con LOS NÚMEROS DE ESE ÍTEM; el 0 es múltiplo de todo número y el
// 1 es divisor de todo número.

export const TX = {
  rect: {
    nombre: { es: 'Descubre los rectángulos', en: 'Discover the rectangles' },
    detalle: { es: 'Encuentra todas las parejas de divisores', en: 'Find every pair of divisors' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Buscar los divisores de un número es buscar rectángulos de esa área con lados
        enteros. Elige un ancho: si el rectángulo se cierra justo, has encontrado una
        pareja de divisores.</p>
        <p>Cuando creas que las tienes todas, pulsa <strong>«Ya están todas»</strong>. No
        hace falta seguir más allá de la raíz entera: a partir de ahí las parejas se
        repiten al revés.</p>`,
      en: `<h2>How it works</h2>
        <p>Finding the divisors of a number is finding rectangles of that area with whole
        sides. Choose a width: if the rectangle closes exactly, you have found a pair of
        divisors.</p>
        <p>When you think you have found them all, press <strong>«They're all there»</strong>.
        You do not need to go past the integer square root: after that the pairs repeat
        the other way round.</p>`,
    },
    instruccion: { es: n => `El área es ${n}. Elige un ancho y mira si el rectángulo se cierra.`, en: n => `The area is ${n}. Choose a width and see if the rectangle closes.` },
    ancho: { es: 'Ancho', en: 'Width' },
    sobran: { es: (w, sobran, n) => `Con ancho ${w} sobran ${sobran} ${sobran === 1 ? 'celda' : 'celdas'}: ${w} no es divisor de ${n}.`, en: (w, sobran, n) => `With width ${w} there ${sobran === 1 ? 'is' : 'are'} ${sobran} extra ${sobran === 1 ? 'cell' : 'cells'} left over: ${w} is not a divisor of ${n}.` },
    encontradas: { es: 'Parejas encontradas', en: 'Pairs found' },
    ninguna_todavia: { es: 'Todavía ninguna.', en: 'None yet.' },
    ya_todas: { es: 'Ya están todas', en: "They're all there" },
    correcto: { es: n => `¡Eso es! Esas son todas las parejas de divisores de ${n}.`, en: n => `That's it! Those are all the pairs of divisors of ${n}.` },
    faltan: { es: 'Faltan estas parejas:', en: 'These pairs are missing:' },
    el_uno_y_el_propio: { es: 'El 1 y el propio número siempre son divisores.', en: 'The number 1 and the number itself are always divisors.' },
    se_para_en: {
      es: (r, n) => `Y no hacía falta seguir más allá del ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; a partir de ahí las parejas se repiten al revés.`,
      en: (r, n) => `And there was no need to go past ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; after that the pairs repeat the other way round.`,
    },
  },
  banco: {
    nombre: { es: 'Sin dibujo: las parejas', en: 'No drawing: the pairs' },
    detalle: { es: 'Toca los divisores en el banco de números', en: 'Tap the divisors in the number bank' },
    instruccion: { es: n => `Toca todos los divisores de ${n} y nada más.`, en: n => `Tap every divisor of ${n}, and nothing else.` },
    division_resto: { es: (n, x, c, r) => `${n} : ${x} = ${c}, resto ${r}`, en: (n, x, c, r) => `${n} : ${x} = ${c}, remainder ${r}` },
    acierto: { es: n => `¡Correcto! Esos son todos los divisores de ${n}.`, en: n => `Correct! Those are all the divisors of ${n}.` },
    el_uno_y_el_propio: { es: 'El 1 y el propio número siempre son divisores.', en: 'The number 1 and the number itself are always divisors.' },
    falta: { es: d => `Te faltó el ${d}: sí es divisor.`, en: d => `You missed ${d}: it is a divisor.` },
  },
  parar: {
    nombre: { es: '¿Dónde se para?', en: 'Where do you stop?' },
    detalle: { es: 'Hasta dónde hay que probar para tener todos los divisores', en: 'How far you must try to find every divisor' },
    pregunta: { es: n => `Para encontrar todos los divisores de ${n} por parejas, ¿hasta qué número hay que probar?`, en: n => `To find all the divisors of ${n} in pairs, up to which number do you have to try?` },
    correcto: { es: (r, n) => `Correcto: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; a partir de ${r + 1} las parejas se repiten al revés.`, en: (r, n) => `Correct: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; from ${r + 1} on, the pairs repeat the other way round.` },
    incorrecto: { es: (elegido, r, n) => `${elegido} no es el número. Hay que probar hasta ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>.`, en: (elegido, r, n) => `${elegido} is not the number. You must try up to ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>.` },
  },
  cuadrado: {
    pregunta: { es: (n, r) => `${n} = ${r} · ${r}. ¿Cuántas veces se escribe el ${r} en la lista de divisores de ${n}?`, en: (n, r) => `${n} = ${r} · ${r}. How many times is ${r} written in the list of divisors of ${n}?` },
    correcto: { es: (n, r) => `Correcto: en ${n} = ${r} · ${r}, la pareja central es la misma por los dos lados, así que ${r} solo se escribe una vez en la lista de divisores.`, en: (n, r) => `Correct: in ${n} = ${r} · ${r}, the middle pair is the same on both sides, so ${r} is written only once in the list of divisors.` },
    incorrecto: { es: (n, r) => `No es correcto: en ${n} = ${r} · ${r}, la pareja central es la misma por los dos lados, así que ${r} se escribe una sola vez en la lista de divisores de ${n}.`, en: (n, r) => `Not correct: in ${n} = ${r} · ${r}, the middle pair is the same on both sides, so ${r} is written only once in the list of divisors of ${n}.` },
  },
};
