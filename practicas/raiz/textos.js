// Práctica «Raíz cuadrada con cuadrados»: textos propios, siempre { es, en }.
// Reglas de contenido (reparto-practicas-u2/proyecto.md): producto con «·»,
// inglés sencillo, y el feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM.
// Vocabulario del inventario: square root, perfect square, whole (integer)
// square root, remainder.

const c = k => `${k}<sup>2</sup>`;

export const TX = {
  forma: {
    nombre: { es: 'Forma el cuadrado', en: 'Make the square' },
    detalle: { es: 'Con las fichas, busca el cuadrado más grande', en: 'Find the biggest square you can make with the counters' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Tienes unas fichas. Con los botones <strong>+</strong> y <strong>−</strong> eliges el lado de un cuadrado y las fichas se colocan en él.</p>
        <p>Busca el <strong>lado más grande</strong> con el que el cuadrado se completa. Pulsa «Este lado» y di cuántas fichas sobran. Esa cantidad se llama <strong>resto</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>You have some counters. Use the <strong>+</strong> and <strong>−</strong> buttons to choose the side of a square, and the counters go into it.</p>
        <p>Find the <strong>biggest side</strong> for which the square is complete. Press "This side" and say how many counters are left over. That number is called the <strong>remainder</strong>.</p>`,
    },
    instruccion: {
      es: n => `Tienes ${n} fichas. Cambia el lado hasta encontrar el <strong>cuadrado más grande</strong> que se completa.`,
      en: n => `You have ${n} counters. Change the side until you find the <strong>biggest square</strong> that is complete.`,
    },
    lado: { es: 'Lado del cuadrado', en: 'Side of the square' },
    completo: { es: 'Se completa', en: 'It is complete' },
    incompleto: { es: 'No se completa', en: 'It is not complete' },
    este: { es: 'Este lado', en: 'This side' },
    cuantas_sobran: { es: '¿Cuántas fichas sobran?', en: 'How many counters are left over?' },
    sobran: { es: 'Sobran', en: 'Left over' },
    // Lado equivocado
    lado_grande: {
      es: (s, n) => `Con lado ${s} harían falta <span class="cuenta">${c(s)} = ${s * s}</span> fichas y solo hay ${n}: no se completa.`,
      en: (s, n) => `With side ${s} you would need <span class="cuenta">${c(s)} = ${s * s}</span> counters and you only have ${n}: it is not complete.`,
    },
    lado_pequeno: {
      es: (s, n) => `Con lado ${s} sobran <span class="cuenta">${n} − ${s * s} = ${n - s * s}</span> fichas y con lado ${s + 1} todavía se completa (<span class="cuenta">${c(s + 1)} = ${(s + 1) * (s + 1)}</span>): se puede hacer más grande.`,
      en: (s, n) => `With side ${s} there are <span class="cuenta">${n} − ${s * s} = ${n - s * s}</span> counters left over, and with side ${s + 1} it is still complete (<span class="cuenta">${c(s + 1)} = ${(s + 1) * (s + 1)}</span>): you can make it bigger.`,
    },
    resto_mal: {
      es: tuyo => `Has dicho ${tuyo}.`,
      en: tuyo => `You said ${tuyo}.`,
    },
  },

  sin: {
    nombre: { es: 'Sin dibujo', en: 'No picture' },
    detalle: { es: 'Raíz exacta, raíz entera y resto', en: 'Exact root, whole root and remainder' },
    introduccion: {
      es: `<h2>Ahora sin dibujo</h2>
        <p>Unas veces buscarás una <strong>raíz exacta</strong> (el número es un cuadrado perfecto). Otras, la <strong>raíz entera</strong> y el <strong>resto</strong>. Y otras tendrás que decidir si unos números <strong>pueden ser</strong> la raíz entera y el resto de algún número.</p>
        <p>Recuerda: el resto es lo que sobra cuando formas el cuadrado más grande.</p>`,
      en: `<h2>Now without a picture</h2>
        <p>Sometimes you look for an <strong>exact root</strong> (the number is a perfect square). Other times, the <strong>whole root</strong> and the <strong>remainder</strong>. And sometimes you must decide whether some numbers <strong>can be</strong> the whole root and the remainder of a number.</p>
        <p>Remember: the remainder is what is left over when you make the biggest square.</p>`,
    },
    exacta_pregunta: { es: n => `¿Cuánto vale √${n}?`, en: n => `What is √${n}?` },
    exacta_campo: { es: 'La raíz', en: 'The root' },
    exacta_bien: {
      es: (n, k) => `<span class="cuenta">√${n} = ${k}</span> porque <span class="cuenta">${c(k)} = ${k} · ${k} = ${n}</span>. ${n} es un cuadrado perfecto.`,
      en: (n, k) => `<span class="cuenta">√${n} = ${k}</span> because <span class="cuenta">${c(k)} = ${k} · ${k} = ${n}</span>. ${n} is a perfect square.`,
    },
    exacta_mitad: {
      es: (tuyo, n) => `La raíz cuadrada no es la mitad: <span class="cuenta">${c(tuyo)} = ${tuyo * tuyo}</span>, no ${n}.`,
      en: (tuyo, n) => `The square root is not half the number: <span class="cuenta">${c(tuyo)} = ${tuyo * tuyo}</span>, not ${n}.`,
    },
    exacta_mal: {
      es: (tuyo, n) => `<span class="cuenta">${c(tuyo)} = ${tuyo} · ${tuyo} = ${tuyo * tuyo}</span>, no ${n}.`,
      en: (tuyo, n) => `<span class="cuenta">${c(tuyo)} = ${tuyo} · ${tuyo} = ${tuyo * tuyo}</span>, not ${n}.`,
    },
    entera_pregunta: {
      es: n => `<strong>Raíz entera y resto</strong> de ${n}`,
      en: n => `<strong>Whole square root and remainder</strong> of ${n}`,
    },
    entera_ayuda: { es: 'Busca el cuadrado más grande que no pasa del número.', en: 'Find the biggest square that is not greater than the number.' },
    campo_raiz: { es: 'Raíz entera', en: 'Whole root' },
    campo_resto: { es: 'Resto', en: 'Remainder' },
    resto_grande: {
      es: (n, ku, ru) => `<span class="cuenta">${n} = ${c(ku)} + ${ru}</span> es verdad, pero el resto ${ru} es demasiado grande: todavía cabe el cuadrado de lado ${ku + 1} (<span class="cuenta">${c(ku + 1)} = ${(ku + 1) * (ku + 1)} ≤ ${n}</span>).`,
      en: (n, ku, ru) => `<span class="cuenta">${n} = ${c(ku)} + ${ru}</span> is true, but the remainder ${ru} is too big: the square of side ${ku + 1} still fits (<span class="cuenta">${c(ku + 1)} = ${(ku + 1) * (ku + 1)} ≤ ${n}</span>).`,
    },
    puede_pregunta: {
      es: (k, r) => `La raíz entera de un número es <strong>${k}</strong> y su resto es <strong>${r}</strong>. ¿Puede ser?`,
      en: (k, r) => `The whole square root of a number is <strong>${k}</strong> and its remainder is <strong>${r}</strong>. Is that possible?`,
    },
    puede_si: {
      es: (k, r) => `Sí: <span class="cuenta">${c(k)} + ${r} = ${k * k} + ${r} = ${k * k + r}</span> y ${k * k + r} es menor que <span class="cuenta">${c(k + 1)} = ${(k + 1) * (k + 1)}</span>. El resto más grande posible es 2 · ${k} = ${2 * k}.`,
      en: (k, r) => `Yes: <span class="cuenta">${c(k)} + ${r} = ${k * k} + ${r} = ${k * k + r}</span> and ${k * k + r} is less than <span class="cuenta">${c(k + 1)} = ${(k + 1) * (k + 1)}</span>. The biggest possible remainder is 2 · ${k} = ${2 * k}.`,
    },
    puede_no: {
      es: (k, r) => `No: el resto más grande posible es 2 · ${k} = ${2 * k}. Con resto ${r}, el número sería <span class="cuenta">${c(k)} + ${r} = ${k * k + r}</span>, que ya llega a <span class="cuenta">${c(k + 1)} = ${(k + 1) * (k + 1)}</span>: su raíz entera no sería ${k}.`,
      en: (k, r) => `No: the biggest possible remainder is 2 · ${k} = ${2 * k}. With remainder ${r}, the number would be <span class="cuenta">${c(k)} + ${r} = ${k * k + r}</span>, which already reaches <span class="cuenta">${c(k + 1)} = ${(k + 1) * (k + 1)}</span>: its whole root would not be ${k}.`,
    },
  },

  prob: {
    nombre: { es: 'Problemas', en: 'Problems' },
    detalle: { es: 'Lado de un cuadrado y lo que sobra', en: 'Side of a square and what is left over' },
    lado: [
      {
        es: n => `Un patio cuadrado está cubierto con ${n} baldosas, sin que sobre ni falte ninguna. ¿Cuántas baldosas hay en cada lado?`,
        en: n => `A square courtyard is covered with ${n} tiles (baldosas), with none left over. How many tiles are on each side?`,
      },
      {
        es: n => `Una pared cuadrada está hecha con ${n} azulejos, sin que sobre ni falte ninguno. ¿Cuántos azulejos hay en cada lado?`,
        en: n => `A square wall is made with ${n} tiles (azulejos), with none left over. How many tiles are on each side?`,
      },
    ],
    sillas: [
      {
        es: n => `Hay ${n} sillas. Se colocan en el cuadrado más grande posible: tantas filas como sillas en cada fila, y solo filas completas. ¿Cuántas sillas hay en cada fila? ¿Cuántas sillas sobran?`,
        en: n => `There are ${n} chairs (sillas). They are put in the biggest square possible: as many rows (filas) as chairs in each row, and only complete rows. How many chairs are in each row? How many chairs are left over?`,
      },
      {
        es: n => `Un colegio tiene ${n} sillas para la fiesta. Las coloca en el cuadrado más grande posible, con el mismo número de filas que de sillas por fila, todas completas. ¿Cuántas filas se forman? ¿Cuántas sillas sobran?`,
        en: n => `A school has ${n} chairs (sillas) for a party. It puts them in the biggest square possible, with the same number of rows (filas) as chairs in each row, all complete. How many rows are made? How many chairs are left over?`,
      },
    ],
    fichas: [
      {
        es: n => `Con ${n} fichas se forma el cuadrado más grande posible. ¿Cuántas fichas tiene su lado? ¿Cuántas fichas sobran?`,
        en: n => `With ${n} counters (fichas) you make the biggest square you can. How many counters are on its side? How many counters are left over?`,
      },
      {
        es: n => `Marta tiene ${n} cromos y hace con ellos el cuadrado más grande posible. ¿Cuántos cromos tiene su lado? ¿Cuántos cromos sobran?`,
        en: n => `Marta has ${n} stickers (cromos) and makes the biggest square she can. How many stickers are on its side? How many stickers are left over?`,
      },
    ],
    campo_lado: { es: 'Lado', en: 'Side' },
    campo_filas: { es: 'Filas', en: 'Rows' },
    campo_sillas_fila: { es: 'Sillas por fila', en: 'Chairs per row' },
    campo_sobran: { es: 'Sobran', en: 'Left over' },
    respuesta: {
      es: (k, r, dos) => (dos ? `Respuesta: lado ${k} y sobran ${r}.` : `Respuesta: ${k} en cada lado.`),
      en: (k, r, dos) => (dos ? `Answer: side ${k}, and ${r} left over.` : `Answer: ${k} on each side.`),
    },
    tu_respuesta: {
      es: (a, b) => (b === null ? `Has dicho ${a}.` : `Has dicho lado ${a} y sobran ${b}.`),
      en: (a, b) => (b === null ? `You said ${a}.` : `You said side ${a} and ${b} left over.`),
    },
  },

  // Comunes a los tres ejercicios
  comun: {
    vocab: {
      es: (n, k, r) => (r === 0 ? `La raíz cuadrada exacta de ${n} es ${k}.` : `La raíz entera de ${n} es ${k} y el resto es ${r}.`),
      en: (n, k, r) => (r === 0 ? `The exact square root of ${n} is ${k}.` : `The whole square root of ${n} is ${k}, remainder ${r}.`),
    },
    entre: {
      es: (n, k) => `<span class="cuenta">${c(k)} = ${k * k} ≤ ${n} &lt; ${(k + 1) * (k + 1)} = ${c(k + 1)}</span>`,
      en: (n, k) => `<span class="cuenta">${c(k)} = ${k * k} ≤ ${n} &lt; ${(k + 1) * (k + 1)} = ${c(k + 1)}</span>`,
    },
    sobran: {
      es: (n, k, r) => `Sobran <span class="cuenta">${n} − ${k * k} = ${r}</span>.`,
      en: (n, k, r) => `Left over: <span class="cuenta">${n} − ${k * k} = ${r}</span>.`,
    },
    exacta: {
      es: (n, k) => `<span class="cuenta">√${n} = ${k}</span>: raíz exacta, no sobra nada (<span class="cuenta">${c(k)} = ${n}</span>).`,
      en: (n, k) => `<span class="cuenta">√${n} = ${k}</span>: exact root, none left over (<span class="cuenta">${c(k)} = ${n}</span>).`,
    },
    comprobacion: {
      es: (n, k, r) => `Comprobación: <span class="cuenta">${n} = ${c(k)} + ${r} = ${k * k} + ${r}</span>.`,
      en: (n, k, r) => `Check: <span class="cuenta">${n} = ${c(k)} + ${r} = ${k * k} + ${r}</span>.`,
    },
    tuyo: { es: 'Has dicho', en: 'You said' },
  },
};

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────────

const cuenta = h => `<span class="cuenta">${h}</span>`;
const RESP = { es: 'La respuesta es', en: 'The answer is' };

/** Cómo se encuentra la raíz entera y el resto de n (la misma cuenta que el feedback de los ejercicios). */
export function explicaCuadrado(n, k, r, { tt }) {
  const x = TX.comun;
  if (r === 0) return tt(x.exacta)(n, k);
  return `${tt(x.entre)(n, k)}. ${tt(x.sobran)(n, k, r)} ${tt(x.comprobacion)(n, k, r)} ${tt(x.vocab)(n, k, r)}`;
}

/** Ejercicio 1: el lado más grande que completa el cuadrado y lo que sobra. */
export function explicaForma(item, ctx) {
  const { tt } = ctx;
  const regla = tt({
    es: 'Busca el lado más grande con el que el cuadrado se completa: sus fichas, lado · lado, no pueden pasar de las que tienes.',
    en: 'Find the biggest side for which the square is complete: its counters, side · side, cannot be more than you have.',
  });
  const fin = item.resto === 0
    ? tt({ es: `lado ${item.raiz} y no sobra ninguna`, en: `side ${item.raiz} and none left over` })
    : tt({ es: `lado ${item.raiz} y sobran ${item.resto}`, en: `side ${item.raiz} and ${item.resto} left over` });
  return `<p>${regla}</p><p>${explicaCuadrado(item.n, item.raiz, item.resto, ctx)}</p><p>${tt(RESP)}: ${fin}.</p>`;
}

/** Ejercicio 2: raíz exacta, raíz entera y resto, o «¿puede ser?». */
export function explicaSinDibujo(item, ctx) {
  const { tt, t } = ctx;
  if (item.tipo === 'puede') {
    return `<p>${tt(TX.sin.puede_pregunta)(item.raiz, item.resto)}</p><p>${tt(item.puede ? TX.sin.puede_si : TX.sin.puede_no)(item.raiz, item.resto)}</p>`
      + `<p>${tt(RESP)}: ${item.puede ? t.si : t.no}.</p>`;
  }
  if (item.tipo === 'exacta') {
    return `<p>${tt({
      es: 'La raíz cuadrada exacta es el número que, multiplicado por sí mismo, da el número de dentro.',
      en: 'The exact square root is the number that, multiplied by itself, gives the number inside.',
    })}</p><p>${tt(TX.sin.exacta_bien)(item.n, item.raiz)}</p><p>${tt(RESP)} ${cuenta(item.raiz)}.</p>`;
  }
  return `<p>${tt(TX.sin.entera_ayuda)}</p><p>${explicaCuadrado(item.n, item.raiz, item.resto, ctx)}</p>`
    + `<p>${tt(RESP)}: ${tt({ es: 'raíz entera', en: 'whole root' })} ${cuenta(item.raiz)}, ${tt({ es: 'resto', en: 'remainder' })} ${cuenta(item.resto)}.</p>`;
}

/** Ejercicio 3: qué se pide, la cuenta del cuadrado y la frase de respuesta. */
export function explicaProblema(item, ctx) {
  const { tt } = ctx;
  return `<p>${tt({
    es: 'El lado del cuadrado es la raíz entera del número de piezas; lo que sobra es el resto.',
    en: 'The side of the square is the whole square root of the number of pieces; what is left over is the remainder.',
  })}</p><p>${explicaCuadrado(item.n, item.raiz, item.resto, ctx)} ${tt(TX.prob.respuesta)(item.raiz, item.resto, item.dosCampos)}</p>`;
}
