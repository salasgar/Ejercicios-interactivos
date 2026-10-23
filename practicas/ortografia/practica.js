// Ortografía española: a / ha, e / he, echo / hecho (2026-10-23). La única
// práctica que no es de Matemáticas: los errores que Juan Luis ve en los
// textos de sus alumnos. Va siempre en español (`idioma: 'es'`).
//
//   1-3. Una frase con un hueco y los dos botones de la pareja.
//   4.   La frase con la palabra ya puesta, bien o mal: «¿Está bien escrita?».
//
// Las frases están en logica.js; las explicaciones, en textos.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, explicacion } from './textos.js';
import { PAREJAS, partes, otra, generadorHueco, generarRevision, estaBien, idError } from './logica.js';

// --- Ejercicios 1-3: ¿qué palabra va en el hueco? ----------------------------------

const enunciadoHueco = () => `<p class="instruccion">${TX.hueco.pregunta}</p>`;

function montarHueco(contenedor, item, api) {
  const { esc } = api;
  const { antes, despues, buena } = partes(item.pareja, item.n);
  const p = PAREJAS[item.pareja];
  contenedor.innerHTML = `
    ${enunciadoHueco()}
    <p class="oracion">${esc(antes)}<span class="hueco hueco--corto" id="hueco">&nbsp;</span>${esc(despues)}</p>`;
  const hueco = contenedor.querySelector('#hueco');
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [p.sin, p.con].map(valor => ({ valor, html: esc(valor) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([buena], valor);
      const acierto = valor === buena;
      // En el hueco, siempre la buena y en verde (en rojo parecería que es la mala).
      hueco.textContent = buena;
      hueco.classList.add('hueco--bien');
      api.responder({
        acierto,
        html: explicacion(item.pareja, item.n, esc),
        espera: 2600,
        ...(acierto ? {} : { error: idError(item.pareja, item.n, valor), respuesta: valor }),
      });
    },
  });
}

// --- Ejercicio 4: ¿está bien escrita? ----------------------------------------------

const enunciadoRevision = () => `<p class="instruccion">${TX.revision.pregunta}</p>`;

function montarRevision(contenedor, item, api) {
  const { esc } = api;
  const { antes, despues, buena } = partes(item.pareja, item.n);
  const bien = estaBien(item);
  contenedor.innerHTML = `
    ${enunciadoRevision()}
    <p class="oracion">${esc(antes)}<span class="marcada" id="marcada">${esc(item.puesta)}</span>${esc(despues)}</p>`;
  const marcada = contenedor.querySelector('#marcada');
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'bien', html: TX.revision.bien }, { valor: 'mal', html: TX.revision.mal }],
    alElegir(valor) {
      if (api.respondido()) return;
      const correcta = bien ? 'bien' : 'mal';
      botones.marcar([correcta], valor);
      // Si estaba mal, se tacha y se pone la buena al lado.
      if (!bien) marcada.innerHTML = `<s>${esc(item.puesta)}</s> <span class="corregida">${esc(buena)}</span>`;
      const acierto = valor === correcta;
      const veredicto = bien ? TX.revision.esta_bien : TX.revision.esta_mal(esc(item.puesta), esc(buena));
      api.responder({
        acierto,
        html: `${veredicto} ${explicacion(item.pareja, item.n, esc)}`,
        espera: 3000,
        // El error es el mismo que en los ejercicios 1-3: dar por buena «ha» donde va «a»
        // (o dar por mala la buena: entonces el alumno habría puesto la otra).
        ...(acierto ? {} : { error: idError(item.pareja, item.n, bien ? otra(item.pareja, buena) : item.puesta), respuesta: TX.revision[valor] }),
      });
    },
  });
}

// --- La práctica -------------------------------------------------------------------

const ejercicioHueco = pareja => ({
  nombre: TX[pareja].nombre,
  detalle: TX[pareja].detalle,
  introduccion: TX[pareja].introduccion,
  generar: generadorHueco(pareja),
  clave: item => `${item.pareja}/${item.n}`,
  montar: montarHueco,
  enunciado: enunciadoHueco,
});

arrancar({
  slug: 'ortografia',
  idioma: 'es',
  ejercicios: [
    ejercicioHueco('a_ha'),
    ejercicioHueco('e_he'),
    ejercicioHueco('echo_hecho'),
    {
      nombre: TX.revision.nombre,
      detalle: TX.revision.detalle,
      generar: generarRevision,
      clave: item => `${item.pareja}/${item.n}`,
      montar: montarRevision,
      enunciado: enunciadoRevision,
    },
  ],
});
