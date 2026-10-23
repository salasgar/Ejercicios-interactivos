// Ortografía española: a / ha, e / he, echo / hecho (2026-10-23). La única
// práctica que no es de Matemáticas: los errores que Juan Luis ve en los
// textos de sus alumnos. Va siempre en español (`idioma: 'es'`).
//
//   1-3. Una frase con un hueco y los dos botones de la pareja.
//   4.   La frase con la palabra ya puesta, bien o mal: «¿Está bien escrita?».
//   5.   porque / por qué, como los 1-3 (2026-10-23).
//   6-7. Comas: elegir la frase bien escrita o la que dice lo que se pide.
//   8-9. Tildes: interrogativos y exclamativos, y tilde diacrítica (hueco).
//   10.  Signos ¿ ¡ y espacios: elegir la bien escrita.
//
// Las frases de los 1-5 están en logica.js y sus explicaciones en textos.js;
// las de las comas, con las suyas, en comas.js; las de las tildes, en
// tildes.js, y las de los signos, en signos.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, explicacion } from './textos.js';
import { PAREJAS, partes, otra, generadorHueco, generarRevision, estaBien, idError } from './logica.js';
import { frase, alPrincipio, mayuscula, generadorTilde, explicacionTilde, idErrorTilde } from './tildes.js';
import { generarSignos, opcionesSignos, explicacionSignos, idErrorSignos } from './signos.js';
import { grupo, generarVocativo, generarComas, opciones, buena as opcionBuena, explicacionComa, idErrorComa } from './comas.js';

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

// --- Ejercicios 6-7: las comas -----------------------------------------------------

function enunciadoComa(item) {
  if (item.tipo === 'escrita') return `<p class="instruccion">${TX.comas.escrita}</p>`;
  const p = grupo(item.grupo)[item.i];
  const contexto = p.contexto ? `<p class="contexto">${p.contexto}</p>` : '';
  return `${contexto}<p class="instruccion">${TX.comas.significado}</p><p class="sentido">${p.sentidos[item.cual]}</p>`;
}

function montarComa(contenedor, item, api) {
  contenedor.innerHTML = enunciadoComa(item);
  const ops = opciones(item);
  const correcta = opcionBuena(item);
  const botones = elecciones(contenedor, {
    clase: 'elecciones frases',
    opciones: ops.map(o => ({ valor: o.k, html: o.texto })),
    alElegir(k) {
      if (api.respondido()) return;
      botones.marcar([correcta], k);
      const acierto = k === correcta;
      api.responder({
        acierto,
        html: explicacionComa(item),
        espera: 3500,
        ...(acierto ? {} : { error: idErrorComa(item), respuesta: ops.find(o => o.k === k).texto.slice(0, 60) }),
      });
    },
  });
}

// --- Ejercicios 8-9: las tildes --------------------------------------------------

function montarTilde(contenedor, item, api) {
  const { esc } = api;
  const { antes, despues, buena, opciones } = frase(item.grupo, item.n);
  const forma = alPrincipio(item.grupo, item.n) ? mayuscula : p => p;
  contenedor.innerHTML = `
    ${enunciadoHueco()}
    <p class="oracion">${esc(antes)}<span class="hueco hueco--corto" id="hueco">&nbsp;</span>${esc(despues)}</p>`;
  const hueco = contenedor.querySelector('#hueco');
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: opciones.map(valor => ({ valor, html: esc(forma(valor)) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([buena], valor);
      hueco.textContent = forma(buena);
      hueco.classList.add('hueco--bien');
      const acierto = valor === buena;
      api.responder({
        acierto,
        html: explicacionTilde(item.grupo, item.n),
        espera: 2600,
        ...(acierto ? {} : { error: idErrorTilde(item.grupo, item.n), respuesta: valor }),
      });
    },
  });
}

// --- Ejercicio 10: signos ¿ ¡ y espacios ------------------------------------------

const enunciadoSignos = () => `<p class="instruccion">${TX.comas.escrita}</p>`;

function montarSignos(contenedor, item, api) {
  contenedor.innerHTML = enunciadoSignos();
  const ops = opcionesSignos(item);
  const botones = elecciones(contenedor, {
    clase: 'elecciones frases',
    opciones: ops.map(o => ({ valor: o.k, html: api.esc(o.texto) })),
    alElegir(k) {
      if (api.respondido()) return;
      botones.marcar([0], k);
      api.responder({
        acierto: k === 0,
        html: explicacionSignos(item, k),
        espera: 3500,
        ...(k === 0 ? {} : { error: idErrorSignos(item, k), respuesta: ops.find(o => o.k === k).texto.slice(0, 60) }),
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
    ejercicioHueco('porque'),
    {
      nombre: TX.vocativo.nombre,
      detalle: TX.vocativo.detalle,
      introduccion: TX.vocativo.introduccion,
      generar: generarVocativo,
      clave: item => `${item.tipo}/${item.grupo ?? ''}/${item.i}`,
      montar: montarComa,
      enunciado: enunciadoComa,
    },
    {
      nombre: TX.comas.nombre,
      detalle: TX.comas.detalle,
      introduccion: TX.comas.introduccion,
      generar: generarComas,
      clave: item => `${item.grupo}/${item.i}`,
      montar: montarComa,
      enunciado: enunciadoComa,
    },
    ...['interrogativos', 'diacriticas'].map(g => ({
      nombre: TX[g].nombre,
      detalle: TX[g].detalle,
      introduccion: TX[g].introduccion,
      generar: generadorTilde(g),
      clave: item => `${item.grupo}/${item.n}`,
      montar: montarTilde,
      enunciado: enunciadoHueco,
    })),
    {
      nombre: TX.signos.nombre,
      detalle: TX.signos.detalle,
      introduccion: TX.signos.introduccion,
      generar: generarSignos,
      clave: item => String(item.i),
      montar: montarSignos,
      enunciado: enunciadoSignos,
    },
  ],
});
