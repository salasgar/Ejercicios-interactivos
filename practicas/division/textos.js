// División entera: textos propios, siempre { es, en }. Producto con «·»,
// «divisor» y no «factor», inglés sencillo, y el feedback habla de LOS
// NÚMEROS DE ESE ÍTEM.

/** Objetos y recipientes de los problemas del ejercicio 3. */
export const COSAS = {
  huevos:    { es: 'huevos', en: 'eggs', caja: { es: 'cajas', en: 'boxes' }, unidad: { es: 'caja', en: 'box' } },
  lapices:   { es: 'lápices', en: 'pencils', caja: { es: 'estuches', en: 'pencil cases' }, unidad: { es: 'estuche', en: 'pencil case' } },
  manzanas:  { es: 'manzanas', en: 'apples', caja: { es: 'bolsas', en: 'bags' }, unidad: { es: 'bolsa', en: 'bag' } },
  pegatinas: { es: 'pegatinas', en: 'stickers', caja: { es: 'hojas', en: 'sheets' }, unidad: { es: 'hoja', en: 'sheet' } },
  alumnos:   { es: 'alumnos', en: 'students', caja: { es: 'coches', en: 'cars' }, unidad: { es: 'coche', en: 'car' } },
  personas:  { es: 'personas', en: 'people', caja: { es: 'mesas', en: 'tables' }, unidad: { es: 'mesa', en: 'table' } },
  maletas:   { es: 'maletas', en: 'suitcases', caja: { es: 'furgonetas', en: 'vans' }, unidad: { es: 'furgoneta', en: 'van' } },
  sillas:    { es: 'sillas', en: 'chairs', caja: { es: 'pilas', en: 'stacks' }, unidad: { es: 'pila', en: 'stack' } },
};

export const TX = {
  // ─── Ejercicio 1 ───
  cajas: {
    nombre: { es: 'Reparte en cajas', en: 'Share into boxes' },
    detalle: { es: 'Llena cajas y escribe el cociente y el resto', en: 'Fill boxes and write the quotient and the remainder' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Tienes unos objetos y unas cajas de tamaño fijo. Pulsa <strong>Llenar una caja</strong> tantas veces como puedas. Cuando ya no quepa otra caja llena, escribe el <strong>cociente</strong> (cuántas cajas llenas) y el <strong>resto</strong> (los objetos que sobran).</p>
        <p>Al acertar verás la prueba: <strong>47 = 6 · 7 + 5</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>You have some objects and some boxes of a fixed size. Press <strong>Fill a box</strong> as many times as you can. When another full box does not fit, write the <strong>quotient</strong> (how many full boxes) and the <strong>remainder</strong> (the objects left over).</p>
        <p>When you get it right you will see the check: <strong>47 = 6 · 7 + 5</strong>.</p>`,
    },
    enunciado: {
      es: (D, d) => `Tienes <strong>${D}</strong> objetos y cajas de <strong>${d}</strong>. Llena todas las cajas que puedas.`,
      en: (D, d) => `You have <strong>${D}</strong> objects and boxes of <strong>${d}</strong>. Fill as many boxes as you can.`,
    },
    llenar: { es: 'Llenar una caja', en: 'Fill a box' },
    deshacer: { es: 'Quitar una caja', en: 'Remove a box' },
    sueltos: { es: 'Objetos sin caja', en: 'Objects with no box' },
    cajas_llenas: { es: 'Cajas llenas', en: 'Full boxes' },
    cociente: { es: 'Cociente (quotient)', en: 'Quotient' },
    resto: { es: 'Resto (remainder)', en: 'Remainder' },
    ya_esta: { es: 'Ya está', en: 'Done' },
    aun_cabe: {
      es: (D, d, c) => `Aún cabe otra caja llena: te quedan <span class="cuenta">${D - c * d}</span> objetos y en cada caja entran ${d}.`,
      en: (D, d, c) => `Another full box still fits: you have <span class="cuenta">${D - c * d}</span> objects left and each box holds ${d}.`,
    },
    aun_cabe_texto: { es: 'Aún cabe otra caja llena', en: 'Another full box still fits' },
    exacta: { es: 'Es una división exacta (resto 0).', en: 'It is an exact division (remainder 0).' },
    prueba: { es: 'La prueba', en: 'The check' },
    no_cuadra: {
      es: (q, r) => `Has escrito cociente ${q} y resto ${r}.`,
      en: (q, r) => `You wrote quotient ${q} and remainder ${r}.`,
    },
    correcto: {
      es: (q, r) => `Hay <span class="cuenta">${q}</span> cajas llenas y sobran <span class="cuenta">${r}</span>.`,
      en: (q, r) => `There are <span class="cuenta">${q}</span> full boxes and <span class="cuenta">${r}</span> left over.`,
    },
  },
  // ─── Ejercicio 2 ───
  prueba: {
    nombre: { es: 'La prueba de la división', en: 'The check of a division' },
    detalle: { es: 'Elige la igualdad que comprueba la división', en: 'Choose the equality that checks the division' },
    introduccion: {
      es: `<h2>La prueba de la división</h2>
        <p>Si dividimos <strong>47 : 6</strong>, el cociente es 7 y el resto es 5. La prueba es:</p>
        <p><strong>dividendo = divisor · cociente + resto</strong><br>
        <strong>47 = 6 · 7 + 5</strong></p>
        <p>Y al revés: de una igualdad como esa puedes sacar la división (¡o dos!).</p>`,
      en: `<h2>The check of a division</h2>
        <p>If we divide <strong>47 ÷ 6</strong>, the quotient is 7 and the remainder is 5. The check is:</p>
        <p><strong>dividend = divisor · quotient + remainder</strong><br>
        <strong>47 = 6 · 7 + 5</strong></p>
        <p>And the other way round: from an equality like that you can find the division (or two!).</p>`,
    },
    pregunta: {
      es: (D, d, q, r) => `Hemos hecho <strong>${D} : ${d}</strong>. Sale cociente <strong>${q}</strong> y resto <strong>${r}</strong>. ¿Cuál es la prueba?`,
      en: (D, d, q, r) => `We did <strong>${D} ÷ ${d}</strong>. The quotient is <strong>${q}</strong> and the remainder is <strong>${r}</strong>. Which one is the check?`,
    },
    pregunta_inversa: {
      es: (igualdad) => `Mira la igualdad <strong>${igualdad}</strong>. ¿De qué división es la prueba?`,
      en: (igualdad) => `Look at the equality <strong>${igualdad}</strong>. Which division does it check?`,
    },
    solo: { es: x => `Solo de ${x}`, en: x => `Only ${x}` },
    ambas: { es: 'De las dos', en: 'Both of them' },
    ninguna: { es: 'De ninguna', en: 'Neither of them' },
    ok_prueba: {
      es: (igualdad, D, d, q, r) => `La prueba es <span class="cuenta">${igualdad}</span>: dividendo ${D}, divisor ${d}, cociente ${q}, resto ${r}.`,
      en: (igualdad, D, d, q, r) => `The check is <span class="cuenta">${igualdad}</span>: dividend ${D}, divisor ${d}, quotient ${q}, remainder ${r}.`,
    },
    esa_vale: {
      es: (igualdad, valor) => `<span class="cuenta">${igualdad}</span> no es la prueba: ${valor}.`,
      en: (igualdad, valor) => `<span class="cuenta">${igualdad}</span> is not the check: ${valor}.`,
    },
    no_vale_numeros: {
      es: (izq, der) => `${der} no es igual a ${izq}`,
      en: (izq, der) => `${der} is not equal to ${izq}`,
    },
    no_orden: {
      es: 'la prueba tiene que ser dividendo = divisor · cociente + resto',
      en: 'the check has to be dividend = divisor · quotient + remainder',
    },
    inversa_ambas: {
      es: (a, b, r, D) => `Las dos valen: ${D} : ${a} da cociente ${b} y resto ${r} (${r} < ${a}); y ${D} : ${b} da cociente ${a} y resto ${r} (${r} < ${b}).`,
      en: (a, b, r, D) => `Both are right: ${D} ÷ ${a} gives quotient ${b} and remainder ${r} (${r} < ${a}); and ${D} ÷ ${b} gives quotient ${a} and remainder ${r} (${r} < ${b}).`,
    },
    inversa_una: {
      es: (D, a, b, r, otro) => `Vale ${D} : ${a} (cociente ${b}, resto ${r}, y ${r} < ${a}). En ${D} : ${otro} el resto ${r} no sería menor que el divisor ${otro}.`,
      en: (D, a, b, r, otro) => `${D} ÷ ${a} works (quotient ${b}, remainder ${r}, and ${r} < ${a}). In ${D} ÷ ${otro} the remainder ${r} would not be less than the divisor ${otro}.`,
    },
    inversa_ninguna: {
      es: (D, a, b, r) => `En ${D} : ${a} y en ${D} : ${b} el resto ${r} no es menor que el divisor (${r} ≥ ${a} y ${r} ≥ ${b}), así que no es la prueba de ninguna.`,
      en: (D, a, b, r) => `In ${D} ÷ ${a} and in ${D} ÷ ${b} the remainder ${r} is not less than the divisor (${r} ≥ ${a} and ${r} ≥ ${b}), so it is the check of neither.`,
    },
  },
  // ─── Ejercicio 3 ───
  significado: {
    nombre: { es: '¿Qué significa el resto?', en: 'What does the remainder mean?' },
    detalle: { es: 'Lo que sobra o una caja más', en: 'What is left over, or one more box' },
    introduccion: {
      es: `<h2>¿Qué hacemos con el resto?</h2>
        <p>Depende de la pregunta. Con <strong>37 huevos en cajas de 6</strong>: caben 6 cajas llenas y <strong>sobra 1 huevo</strong> (el resto).</p>
        <p>Pero con <strong>37 alumnos en coches de 6</strong>, el alumno que sobra también tiene que ir: hace falta <strong>un coche más</strong>.</p>`,
      en: `<h2>What do we do with the remainder?</h2>
        <p>It depends on the question. With <strong>37 eggs in boxes of 6</strong>: there are 6 full boxes and <strong>1 egg is left over</strong> (the remainder).</p>
        <p>But with <strong>37 students in cars of 6</strong>, the student left over also has to travel: we need <strong>one more car</strong>.</p>`,
    },
    enunciado: {
      es: (D, c, d) => `Hay <strong>${D}</strong> ${c.es}. En cada ${c.unidad.es} caben <strong>${d}</strong>.`,
      en: (D, c, d) => `There are <strong>${D}</strong> ${c.en}. Each ${c.unidad.en} holds <strong>${d}</strong>.`,
    },
    preguntas: {
      llenas: {
        es: c => `¿Cuántos ${c.caja.es} quedan completamente llenos?`,
        en: c => `How many ${c.caja.en} are completely full?`,
      },
      sueltos: {
        es: c => `¿Cuántos ${c.es} sobran, sin ${c.unidad.es}?`,
        en: c => `How many ${c.en} are left over, with no ${c.unidad.en}?`,
      },
      hacen: {
        es: c => `¿Cuántos ${c.caja.es} hacen falta para colocarlos a todos?`,
        en: c => `How many ${c.caja.en} do we need for all of them?`,
      },
    },
    respuesta: { es: 'Tu respuesta', en: 'Your answer' },
    ok_llenas: {
      es: (D, d, q, r) => `${D} = ${d} · ${q} + ${r}: el cociente ${q} son las cajas llenas.`,
      en: (D, d, q, r) => `${D} = ${d} · ${q} + ${r}: the quotient ${q} is the number of full boxes.`,
    },
    ok_sueltos: {
      es: (D, d, q, r) => `${D} = ${d} · ${q} + ${r}: el resto ${r} es lo que sobra.`,
      en: (D, d, q, r) => `${D} = ${d} · ${q} + ${r}: the remainder ${r} is what is left over.`,
    },
    ok_hacen_exacto: {
      es: (D, d, q) => `${D} = ${d} · ${q} + 0: no sobra nada, así que bastan <span class="cuenta">${q}</span>.`,
      en: (D, d, q) => `${D} = ${d} · ${q} + 0: nothing is left over, so <span class="cuenta">${q}</span> are enough.`,
    },
    ok_hacen: {
      es: (D, d, q, r) => `${D} = ${d} · ${q} + ${r}: sobran ${r} y también tienen que ir, así que hace falta una más: ${q} + 1 = <span class="cuenta">${q + 1}</span>.`,
      en: (D, d, q, r) => `${D} = ${d} · ${q} + ${r}: ${r} are left over and they also have to go, so we need one more: ${q} + 1 = <span class="cuenta">${q + 1}</span>.`,
    },
    olvido: {
      es: 'Ojo: el resto no se tira; hay que meterlo en una caja más.',
      en: 'Careful: the remainder cannot be thrown away; it needs one more box.',
    },
    sin_dibujo: { es: 'El dibujo:', en: 'The picture:' },
  },
  // ─── Ejercicio 4 ───
  puede: {
    nombre: { es: '¿Puede ser?', en: 'Can it be?' },
    detalle: { es: 'Detecta restos imposibles', en: 'Spot impossible remainders' },
    introduccion: {
      es: `<h2>El resto es siempre menor que el divisor</h2>
        <p>Si repartes en cajas de 7, nunca te pueden sobrar 7 o más objetos: con 7 llenarías otra caja. Por eso <strong>el resto es siempre menor que el divisor</strong> (<em>the remainder is always less than the divisor</em>).</p>`,
      en: `<h2>The remainder is always less than the divisor</h2>
        <p>If you share into boxes of 7, you can never have 7 or more objects left over: with 7 you would fill another box. So <strong>the remainder is always less than the divisor</strong>.</p>`,
    },
    pregunta_resto: {
      es: (d, r) => `Al dividir entre <strong>${d}</strong> ha salido resto <strong>${r}</strong>. ¿Puede ser?`,
      en: (d, r) => `When we divide by <strong>${d}</strong> the remainder is <strong>${r}</strong>. Can it be?`,
    },
    pregunta_division: {
      es: (D, d, q, r) => `Al dividir <strong>${D}</strong> entre <strong>${d}</strong> alguien dice: «cociente ${q}, resto ${r}». ¿Está bien?`,
      en: (D, d, q, r) => `When we divide <strong>${D}</strong> by <strong>${d}</strong> someone says: "quotient ${q}, remainder ${r}". Is it right?`,
    },
    si_puede: {
      es: (d, r) => `Sí puede: ${r} es menor que ${d}.`,
      en: (d, r) => `Yes: ${r} is less than ${d}.`,
    },
    no_puede: {
      es: (d, r) => `No puede ser: ${r} no es menor que ${d}. El resto es siempre menor que el divisor (the remainder is always less than the divisor).`,
      en: (d, r) => `It cannot be: ${r} is not less than ${d}. The remainder is always less than the divisor.`,
    },
    esta_bien: {
      es: (D, d, q, r) => `Está bien: ${d} · ${q} + ${r} = <span class="cuenta">${d * q + r}</span> y ${r} es menor que ${d}.`,
      en: (D, d, q, r) => `It is right: ${d} · ${q} + ${r} = <span class="cuenta">${d * q + r}</span> and ${r} is less than ${d}.`,
    },
    mal_cuenta: {
      es: (D, d, q, r) => `Está mal: ${d} · ${q} + ${r} = <span class="cuenta">${d * q + r}</span>, y tendría que dar ${D}.`,
      en: (D, d, q, r) => `It is wrong: ${d} · ${q} + ${r} = <span class="cuenta">${d * q + r}</span>, and it should be ${D}.`,
    },
    mal_resto: {
      es: (D, d, q, r) => `Está mal: aunque ${d} · ${q} + ${r} = ${D}, el resto ${r} no es menor que ${d}. El resto es siempre menor que el divisor (the remainder is always less than the divisor).`,
      en: (D, d, q, r) => `It is wrong: even though ${d} · ${q} + ${r} = ${D}, the remainder ${r} is not less than ${d}. The remainder is always less than the divisor.`,
    },
    mal_los_dos: {
      es: (D, d, q, r) => `Está mal: ${d} · ${q} + ${r} = ${d * q + r} (no es ${D}) y además el resto ${r} no es menor que ${d}.`,
      en: (D, d, q, r) => `It is wrong: ${d} · ${q} + ${r} = ${d * q + r} (not ${D}) and also the remainder ${r} is not less than ${d}.`,
    },
  },
};
