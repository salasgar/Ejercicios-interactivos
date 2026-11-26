// Práctica «Léelo en inglés» de la unidad 7 (Proportionality and percentages): textos propios, siempre { es, en }.
// Lo que se lee está en inglés porque esa es la destreza; las órdenes y el feedback van en el idioma del ítem.
// Las introducciones solo hablan de lo del paquete 1 (la práctica se publica con él): nada de porcentajes ni escalas.

import { hoy, paqueteHoy } from './logica.js';

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'La palabra', en: 'The word' },
      detalle: { es: 'Palabras de las razones y las proporciones: del inglés al español y al revés', en: 'Words for ratios and proportions: from English to Spanish and back' },
      introduccion: {
        es: `<h3>La palabra</h3>
          <p>Una <strong>ratio</strong> (razón) compara dos cantidades: 3 chicos y 4 chicas es la razón «3 a 4». Dos <strong>equivalent ratios</strong> (razones equivalentes) valen lo mismo, como 3 : 4 y 6 : 8.</p>
          <p><strong>per</strong> y <strong>for every</strong> significan «por cada»; <strong>out of</strong> significa «de cada»: <em>3 out of 4 pupils</em> es «3 de cada 4 alumnos».</p>
          <p>Te sale una palabra en inglés y eliges su significado en español, o al revés.</p>`,
        en: `<h3>The word</h3>
          <p>A <strong>ratio</strong> compares two quantities: 3 boys and 4 girls is the ratio “3 to 4”. Two <strong>equivalent ratios</strong> are worth the same, like 3 : 4 and 6 : 8.</p>
          <p><strong>per</strong> and <strong>for every</strong> mean “por cada”; <strong>out of</strong> means “de cada”: <em>3 out of 4 pupils</em> is “3 de cada 4 alumnos”.</p>
          <p>You get a word in English and choose its Spanish meaning, or the other way round.</p>`,
      },
    },
    {
      nombre: { es: 'Léelo', en: 'Say it' },
      detalle: { es: 'Leer y escribir razones en inglés', en: 'Read and write ratios in English' },
      introduccion: {
        es: `<h3>Cómo se lee</h3>
          <p>La razón 3/4 se lee <strong>three to four</strong>, en ese orden: <em>four to three</em> es la razón al revés.</p>
          <p>Cuidado con los números: <strong>thirteen</strong> es 13 y <strong>thirty</strong> es 30; <strong>fifteen</strong> es 15 y <strong>fifty</strong> es 50.</p>
          <p>Te sale la razón y eliges cómo se lee en inglés, o al revés: te sale cómo se lee y eliges cómo se escribe.</p>`,
        en: `<h3>How to read it</h3>
          <p>The ratio 3/4 is read <strong>three to four</strong>, in that order: <em>four to three</em> is the ratio the wrong way round.</p>
          <p>Watch the numbers: <strong>thirteen</strong> is 13 and <strong>thirty</strong> is 30; <strong>fifteen</strong> is 15 and <strong>fifty</strong> is 50.</p>
          <p>You get the ratio and choose how it is read in English, or the other way round: you get how it is read and choose how it is written.</p>`,
      },
    },
    {
      nombre: { es: 'La consigna', en: 'The instruction' },
      detalle: { es: 'Entender qué pide una instrucción de examen en inglés', en: 'Understand what an English exam instruction asks' },
      introduccion: {
        es: `<h3>La consigna</h3>
          <p><em>Write the ratio in its simplest form.</em> La palabra que decide es <strong>simplest form</strong>: la razón con los números más pequeños posibles. <em>Complete the table</em> es rellenar la tabla; <em>Find the missing number</em> es calcular el que falta; <em>Show that…</em> es demostrar que…</p>
          <p>No hay que calcular: elige la acción en español que dice lo que pide la consigna.</p>`,
        en: `<h3>The instruction</h3>
          <p><em>Write the ratio in its simplest form.</em> The words that decide are <strong>simplest form</strong>: the ratio with the smallest possible numbers. <em>Complete the table</em> is to fill in the table; <em>Find the missing number</em> is to work out the one that is missing; <em>Show that…</em> is to prove that…</p>
          <p>You do not have to calculate: choose the Spanish action that says what the instruction asks.</p>`,
      },
    },
    {
      nombre: { es: 'Completa', en: 'Fill in' },
      detalle: { es: 'La palabra que falta en una frase en inglés', en: 'The missing word in an English sentence' },
      introduccion: {
        es: `<h3>Completa</h3>
          <p><em>The car uses 6 litres of petrol ___ 100 km.</em> «6 litros por cada 100 km»: <strong>per</strong>.</p>
          <p><em>3 ___ 4 pupils walk to school.</em> «3 de cada 4 alumnos»: <strong>out of</strong>.</p>
          <p>Lee la frase entera y elige la palabra que encaja por el significado y por la gramática.</p>`,
        en: `<h3>Fill in</h3>
          <p><em>The car uses 6 litres of petrol ___ 100 km.</em> “6 litros por cada 100 km”: <strong>per</strong>.</p>
          <p><em>3 ___ 4 pupils walk to school.</em> “3 de cada 4 alumnos”: <strong>out of</strong>.</p>
          <p>Read the whole sentence and choose the word that fits by meaning and by grammar.</p>`,
      },
    },
  ],
  instrucciones: {
    palabra_en_es: { es: 'Elige el significado en español', en: 'Choose the meaning in Spanish' },
    palabra_es_en: { es: 'Elige la palabra en inglés', en: 'Choose the English word' },
    'leer_razon-fraccion': { es: 'Elige cómo se lee la razón en inglés', en: 'Choose how the ratio is read in English' },
    leer_reparto: { es: 'Elige cómo se lee la razón del reparto en inglés', en: 'Choose how the sharing ratio is read in English' },
    leer_porcentaje: { es: 'Elige cómo se lee el porcentaje en inglés', en: 'Choose how the percentage is read in English' },
    leer_escala: { es: 'Elige cómo se lee la escala en inglés', en: 'Choose how the scale is read in English' },
    'escribir_razon-fraccion': { es: 'Elige la razón escrita como fracción', en: 'Choose the ratio written as a fraction' },
    escribir_reparto: { es: 'Elige la razón del reparto escrita con dos puntos', en: 'Choose the sharing ratio written with a colon' },
    escribir_porcentaje: { es: 'Elige el porcentaje', en: 'Choose the percentage' },
    escribir_escala: { es: 'Elige la escala', en: 'Choose the scale' },
    consigna: { es: 'Elige la traducción de la consigna (en español)', en: 'Choose the translation of the instruction (in Spanish)' },
    completa: { es: 'Elige la palabra que falta', en: 'Choose the missing word' },
  },
};

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────────────

const consejos = p2 => [
  { es: `Consejo: si dudas, fíjate en las palabras que se parecen (ratio y proportion, directly proportional${p2 ? ' e inversely proportional' : ' y unit rate'}).`, en: `Tip: if you are not sure, watch the words that look alike (ratio and proportion, directly proportional${p2 ? ' and inversely proportional' : ' and unit rate'}).` },
  { es: 'Consejo: lee los números uno a uno, en orden, y fíjate en -teen y -ty (thirteen es 13, thirty es 30).', en: 'Tip: read the numbers one by one, in order, and watch -teen and -ty (thirteen is 13, thirty is 30).' },
  { es: `Consejo: busca la palabra que decide la consigna (simplest, ${p2 ? 'share, ' : ''}missing, table…); ella dice qué hay que hacer.`, en: `Tip: look for the word that decides the instruction (simplest, ${p2 ? 'share, ' : ''}missing, table…); it says what to do.` },
  { es: 'Consejo: lee la frase entera con cada palabra puesta en el hueco y quédate con la que tiene sentido.', en: 'Tip: read the whole sentence with each word in the blank and keep the one that makes sense.' },
];

/** Los cuatro ejercicios: qué pide, lo que dice el ítem y la opción buena. */
export function explicaLeelo(i, fecha = hoy()) {
  return (item, { tt, esc }) => {
    const buena = item.opciones.find(o => o.correcta);
    const resp = buena.html ?? esc(buena.texto);
    return `<ol class="pasos-ayuda">
      <li>${tt(TX.instrucciones[item.instruccion])}.</li>
      <li>${tt(item.solucion).replace(/([»”])\.$/, '$1')}</li>
    </ol>
    <p>${tt({ es: 'La respuesta es', en: 'The answer is' })} <strong>${resp}</strong>${/[.?!]$/.test(buena.texto) ? '' : '.'}</p>
    <p>${tt(consejos(paqueteHoy(fecha) >= 2)[i])}</p>`;
  };
}
