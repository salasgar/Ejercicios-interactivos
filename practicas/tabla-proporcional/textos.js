// Práctica «Tablas de proporcionalidad»: textos propios, siempre { es, en }. Los comunes (Comprobar, Siguiente…)
// llegan a `montar` en `api.t`. Reglas: «·» y «:», nunca «×» ni «÷»; sin letras ni «constante»; coma en español y punto en
// inglés; cada explicación habla de LOS NÚMEROS DE ESE ÍTEM.

import { CONTEXTOS, CTX_CONSTANTE, dinero, dineroCelda, decimal, solucionConstante } from './logica.js';

const t = (i, es, en) => (i === 'es' ? es : en);
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
const c = s => `<span class="cuenta">${s}</span>`;

// ─── Números con su unidad ───────────────────────────────────────────────────────────────────────

/** Una x con su unidad, para las frases: «3 kg», «300 km», «5». */
export const fx = (ctx, x) => { const u = CONTEXTOS[ctx].unidadX; return u ? `${x} ${u}` : String(x); };
/** Una y con su unidad (céntimos si es dinero), para las frases. */
export function fy(ctx, y, i) {
  const cx = CONTEXTOS[ctx];
  if (cx.din) return dinero(y, i);
  return cx.unidadY ? `${y} ${cx.unidadY}` : String(y);
}
/** Lo que va en la casilla de la tabla (sin unidad: va en la cabecera). */
export const celdaY = (ctx, y, i) => (CONTEXTOS[ctx].din ? dineroCelda(y, i) : String(y));

export const CABECERAS = {
  fruta: { x: { es: 'Peso (kg)', en: 'Weight (kg)' }, y: { es: 'Precio (€)', en: 'Price (€)' } },
  entradas: { x: { es: 'Entradas', en: 'Tickets' }, y: { es: 'Precio (€)', en: 'Price (€)' } },
  cuadernos: { x: { es: 'Cuadernos', en: 'Notebooks' }, y: { es: 'Precio (€)', en: 'Price (€)' } },
  receta: { x: { es: 'Personas', en: 'People' }, y: { es: 'Arroz (g)', en: 'Rice (g)' } },
  coche: { x: { es: 'Distancia (km)', en: 'Distance (km)' }, y: { es: 'Gasolina (L)', en: 'Petrol (L)' } },
  taxi: { x: { es: 'Distancia (km)', en: 'Distance (km)' }, y: { es: 'Precio (€)', en: 'Price (€)' } },
  gimnasio: { x: { es: 'Meses', en: 'Months' }, y: { es: 'Total pagado (€)', en: 'Total paid (€)' } },
  num: { x: { es: '', en: '' }, y: { es: '', en: '' } },
};
// Lo que vale 1 en cada contexto (frase de las explicaciones).
const UNO = {
  fruta: { es: '1 kg cuesta', en: '1 kg costs' },
  entradas: { es: '1 entrada cuesta', en: '1 ticket costs' },
  cuadernos: { es: '1 cuaderno cuesta', en: '1 notebook costs' },
  receta: { es: '1 persona necesita', en: '1 person needs' },
  coche: { es: 'Cada 100 km gasta', en: 'Every 100 km it uses' },
};

const unidades = (ctx, col) => col.x / CONTEXTOS[ctx].xMul;
const razonDe = (ctx, col) => col.y / unidades(ctx, col);

/** «12 L : 2 = 6 L» (para coche, el 2 son los «cientos de km»). */
const cuentaRazon = (ctx, col, i) => `${fy(ctx, col.y, i)} : ${unidades(ctx, col)} = ${fy(ctx, razonDe(ctx, col), i)}`;

// ─── Ejercicio 1: ¿es proporcional? ──────────────────────────────────────────────────────────────

export function explicaEsProporcional(it, { idioma = 'es' } = {}) {
  const i = idioma, { ctx, cols, par } = it, a = cols[par.i], b = cols[par.j];
  if (it.si) {
    const ultima = cols[cols.length - 1], primera = cols[0];
    const cada = ctx === 'coche' ? t(i, ' (cada 100 km)', ' (every 100 km)') : '';
    return t(i,
      `Sí. De ${fx(ctx, a.x)} a ${fx(ctx, b.x)} se multiplica por ${par.m}, y de ${fy(ctx, a.y, i)} a ${fy(ctx, b.y, i)} también por ${par.m}. En todas las columnas, el número de abajo entre el de arriba da lo mismo${cada}: ${c(cuentaRazon(ctx, primera, i))} y ${c(cuentaRazon(ctx, ultima, i))}. La respuesta es: sí.`,
      `Yes. From ${fx(ctx, a.x)} to ${fx(ctx, b.x)} you multiply by ${par.m}, and from ${fy(ctx, a.y, i)} to ${fy(ctx, b.y, i)} you also multiply by ${par.m}. In every column, the bottom number divided by the top number gives the same result${cada}: ${c(cuentaRazon(ctx, primera, i))} and ${c(cuentaRazon(ctx, ultima, i))}. The answer is: yes.`);
  }
  return t(i,
    `No. ${fx(ctx, b.x)} es ${par.m} veces ${fx(ctx, a.x)}, pero ${fy(ctx, b.y, i)} no es ${par.m} veces ${fy(ctx, a.y, i)}: ${c(`${par.m} · ${fy(ctx, a.y, i)} = ${fy(ctx, par.m * a.y, i)}`)}, y no ${fy(ctx, b.y, i)}. La respuesta es: no.`,
    `No. ${fx(ctx, b.x)} is ${par.m} times ${fx(ctx, a.x)}, but ${fy(ctx, b.y, i)} is not ${par.m} times ${fy(ctx, a.y, i)}: ${c(`${par.m} · ${fy(ctx, a.y, i)} = ${fy(ctx, par.m * a.y, i)}`)}, not ${fy(ctx, b.y, i)}. The answer is: no.`);
}

// ─── Ejercicio 2: completa la tabla ──────────────────────────────────────────────────────────────

export function explicaCompleta(it, { idioma = 'es' } = {}) {
  const i = idioma, { ctx } = it, ref = it.cols[it.ref], cx = CONTEXTOS[ctx];
  const rate = razonDe(ctx, ref), rateTxt = fy(ctx, rate, i);
  const uno = UNO[ctx][i];
  const hy = it.huecos.find(h => h.que === 'y'), hx = it.huecos.find(h => h.que === 'x');
  const cy = it.cols[hy.col], cxh = it.cols[hx.col];
  const uy = unidades(ctx, cy), ux = unidades(ctx, cxh);
  const nota = n => (cx.xMul > 1 ? t(i, ` (${n * cx.xMul} km son ${n} veces 100 km)`, ` (${n * cx.xMul} km is ${n} times 100 km)`) : '');
  const txtY = fy(ctx, cy.y, i), txtX = fx(ctx, cxh.x);
  const pasoY = `${rateTxt} · ${uy} = ${txtY}`;
  const pasoX = `${fy(ctx, cxh.y, i)} : ${rateTxt} = ${ux}${cx.xMul > 1 ? ` → ${ux} · 100 = ${txtX}` : ''}`;
  return t(i,
    `<ol class="pasos-ayuda"><li>Busca la columna con los dos números: ${fx(ctx, ref.x)} y ${fy(ctx, ref.y, i)}. ${uno} ${c(unidades(ctx, ref) === 1 ? fy(ctx, ref.y, i) : cuentaRazon(ctx, ref, i))}.</li>
      <li>Casilla de abajo, con ${fx(ctx, cy.x)}${nota(uy)}: ${c(pasoY)}.</li>
      <li>Casilla de arriba, con ${fy(ctx, cxh.y, i)}: ${c(pasoX)}.</li></ol>
      <p>La respuesta es ${txtY} y ${txtX}.</p>`,
    `<ol class="pasos-ayuda"><li>Find the column with both numbers: ${fx(ctx, ref.x)} and ${fy(ctx, ref.y, i)}. ${uno} ${c(unidades(ctx, ref) === 1 ? fy(ctx, ref.y, i) : cuentaRazon(ctx, ref, i))}.</li>
      <li>Bottom box, with ${fx(ctx, cy.x)}${nota(uy)}: ${c(pasoY)}.</li>
      <li>Top box, with ${fy(ctx, cxh.y, i)}: ${c(pasoX)}.</li></ol>
      <p>The answer is ${txtY} and ${txtX}.</p>`);
}

// ─── Ejercicio 3: lo que vale 1 ──────────────────────────────────────────────────────────────────

const CUENTA_CTX = {
  fruta: { dato: (it, i, x, y) => t(i, `${it.nombre} compra ${x} kg de fruta por ${y}.`, `${it.nombre} buys ${x} kg of fruit for ${y}.`), pregunta: { es: '¿Cuánto cuesta 1 kg?', en: 'How much does 1 kg cost?' }, etq: { es: '€ el kilo', en: '€ per kilo' } },
  entrada: { dato: (it, i, x, y) => t(i, `${it.nombre} compra ${x} entradas de concierto por ${y}.`, `${it.nombre} buys ${x} concert tickets for ${y}.`), pregunta: { es: '¿Cuánto cuesta 1 entrada?', en: 'How much does 1 ticket cost?' }, etq: { es: '€ cada entrada', en: '€ per ticket' } },
  cuaderno: { dato: (it, i, x, y) => t(i, `${it.nombre} compra ${x} cuadernos por ${y}.`, `${it.nombre} buys ${x} notebooks for ${y}.`), pregunta: { es: '¿Cuánto cuesta 1 cuaderno?', en: 'How much does 1 notebook cost?' }, etq: { es: '€ cada cuaderno', en: '€ per notebook' } },
  receta: { dato: (it, i, x, y) => t(i, `Para ${x} personas hacen falta ${y} de pasta.`, `For ${x} people you need ${y} of pasta.`), pregunta: { es: '¿Cuántos gramos hacen falta para 1 persona?', en: 'How many grams do you need for 1 person?' }, etq: { es: 'g por persona', en: 'g per person' } },
  coche: { dato: (it, i, x, y) => t(i, `${it.nombre} recorre ${x} km y gasta ${y} de gasolina.`, `${it.nombre} drives ${x} km and uses ${y} of petrol.`), pregunta: { es: '¿Cuántos litros gasta cada 100 km?', en: 'How many litres does the car use every 100 km?' }, etq: { es: 'L cada 100 km', en: 'L every 100 km' } },
};
export const etiquetaConstante = (it, i) => CUENTA_CTX[it.ctx].etq[i];
export const preguntaConstante = (it, i) => CUENTA_CTX[it.ctx].pregunta[i];
const yConstante = (it, n, i) => (CTX_CONSTANTE[it.ctx].din ? dinero(it.cols[n].y, i) : `${it.cols[n].y} ${CTX_CONSTANTE[it.ctx].unidadY}`);
export const datoConstante = (it, i) => CUENTA_CTX[it.ctx].dato(it, i, it.cols[0].x, yConstante(it, 0, i));
export const textoK = (it, i) => {
  const k = solucionConstante(it);
  return CTX_CONSTANTE[it.ctx].din ? dinero(it.k, i) : `${decimal(k, i)} ${CTX_CONSTANTE[it.ctx].unidadY}`;
};
export const respuestaConstante = (it, i) => textoK(it, i);

export function explicaConstante(it, { idioma = 'es' } = {}) {
  const i = idioma, cc = CTX_CONSTANTE[it.ctx], col = it.cols[0], u = col.x / (cc.xMul ?? 1);
  const cuenta = `${yConstante(it, 0, i)} : ${u} = ${textoK(it, i)}`;
  const cada = cc.xMul ? t(i, ` ${col.x} km son ${u} veces 100 km.`, ` ${col.x} km is ${u} times 100 km.`) : '';
  return t(i,
    `Para saber lo que vale 1, se divide lo que cuestan o miden todos entre cuántos son.${cada} ${c(cuenta)}. La respuesta es ${textoK(it, i)}${cc.xMul ? ' cada 100 km' : ''}.`,
    `To find what 1 is worth, divide the total by how many there are.${cada} ${c(cuenta)}. The answer is ${textoK(it, i)}${cc.xMul ? ' every 100 km' : ''}.`);
}

// ─── Ejercicio 4: ¿directamente proporcionales? ──────────────────────────────────────────────────

export const preguntaDirectas = (it, i) => t(i, `${it.cond[i]} ¿Son directamente proporcionales ${it.a[i]} y ${it.b[i]}?`, `${it.cond[i]} Are ${it.a[i]} and ${it.b[i]} directly proportional?`);
export const explicaDirectas = (it, { idioma = 'es' } = {}) => t(idioma,
  `${it.si ? 'Sí' : 'No'}. ${it.por.es} La respuesta es: ${it.si ? 'sí' : 'no'}.`,
  `${it.si ? 'Yes' : 'No'}. ${it.por.en} The answer is: ${it.si ? 'yes' : 'no'}.`);

// ─── Textos de la práctica ───────────────────────────────────────────────────────────────────────

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

export const TX = {
  ej1: {
    nombre: { es: '¿Es proporcional?', en: 'Is it proportional?' },
    detalle: { es: 'Mira la tabla y decide', en: 'Look at the table and decide' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una tabla es <strong>proporcional</strong> cuando, si un número se hace el doble, el triple…, el de abajo también se hace el doble, el triple…</p>
        <p>Ejemplo: 2 → 6 y 4 → 12. De 2 a 4 se multiplica por 2, y de 6 a 12 también: ${c('2 · 6 = 12')}. Sí es proporcional.</p>
        <p>Otro: 2 → 5 y 4 → 7. De 2 a 4 se multiplica por 2, pero ${c('2 · 5 = 10')} y no 7. No es proporcional.</p>`,
      en: `<h2>How it works</h2>
        <p>A table is <strong>proportional</strong> (proporcional) when, if one number becomes twice, three times… as big, the number below it also becomes twice, three times… as big.</p>
        <p>Example: 2 → 6 and 4 → 12. From 2 to 4 you multiply by 2, and from 6 to 12 too: ${c('2 · 6 = 12')}. It is proportional.</p>
        <p>Another one: 2 → 5 and 4 → 7. From 2 to 4 you multiply by 2, but ${c('2 · 5 = 10')}, not 7. It is not proportional.</p>`,
    },
    instruccion: { es: '¿Es una tabla de proporcionalidad?', en: 'Is it a proportionality table?' },
    si: { es: 'Sí', en: 'Yes' }, no: { es: 'No', en: 'No' },
    solucion: bi((i, it) => explicaEsProporcional(it, { idioma: i })),
  },
  ej2: {
    nombre: { es: 'Completa la tabla', en: 'Complete the table' },
    detalle: { es: 'Rellena los dos huecos', en: 'Fill in the two blanks' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Busca la columna que tiene <strong>los dos números</strong> y calcula lo que vale <strong>1</strong>: se divide.</p>
        <p>Ejemplo: 3 kg cuestan 6,00 €. Un kilo cuesta ${c('6,00 € : 3 = 2,00 €')}. Entonces 5 kg cuestan ${c('2,00 € · 5 = 10,00 €')}, y si pagas 8,00 € compras ${c('8,00 € : 2,00 € = 4')} kg.</p>
        <p>Escribe los números y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Find the column that has <strong>both numbers</strong> and work out what <strong>1</strong> is worth: you divide.</p>
        <p>Example: 3 kg cost €6.00. One kilo costs ${c('€6.00 : 3 = €2.00')}. So 5 kg cost ${c('€2.00 · 5 = €10.00')}, and if you pay €8.00 you buy ${c('€8.00 : €2.00 = 4')} kg.</p>
        <p>Type the numbers and press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: 'Completa la tabla de proporcionalidad.', en: 'Complete the proportionality table.' },
    solucion: bi((i, it) => explicaCompleta(it, { idioma: i })),
  },
  ej3: {
    nombre: { es: 'Lo que vale 1', en: 'What 1 is worth' },
    detalle: { es: 'Calcula lo que vale una unidad', en: 'Work out what one unit is worth' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para saber lo que vale <strong>1</strong>, se <strong>divide</strong> el total entre cuántos son.</p>
        <p>Ejemplo: 4 cuadernos cuestan 10,00 €. Un cuaderno cuesta ${c('10,00 € : 4 = 2,50 €')}. Puedes escribirlo como 2,5 o 2,50.</p>`,
      en: `<h2>How it works</h2>
        <p>To find what <strong>1</strong> is worth, <strong>divide</strong> the total by how many there are.</p>
        <p>Example: 4 notebooks cost €10.00. One notebook costs ${c('€10.00 : 4 = €2.50')}. You can write it as 2.5 or 2.50.</p>`,
    },
    solucion: bi((i, it) => explicaConstante(it, { idioma: i })),
  },
  ej4: {
    nombre: { es: '¿Directamente proporcionales?', en: 'Directly proportional?' },
    detalle: { es: 'Sí o no, según la situación', en: 'Yes or no, from the situation' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos cantidades son <strong>directamente proporcionales</strong> cuando, si una se hace el doble, la otra también.</p>
        <p>Ejemplo: kilos de naranjas y precio, todas al mismo precio: el doble de kilos cuesta el doble. Sí.</p>
        <p>Ejemplo: edad y altura: con el doble de edad no mides el doble. No.</p>`,
      en: `<h2>How it works</h2>
        <p>Two quantities are <strong>directly proportional</strong> (directamente proporcionales) when, if one becomes twice as big, the other does too.</p>
        <p>Example: kilos of oranges and price, all at the same price: twice the kilos cost twice as much. Yes.</p>
        <p>Example: age and height: at twice the age you are not twice as tall. No.</p>`,
    },
    si: { es: 'Sí', en: 'Yes' }, no: { es: 'No', en: 'No' },
    solucion: bi((i, it) => explicaDirectas(it, { idioma: i })),
  },
};
