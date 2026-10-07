// PRÁCTICA DE PLANTILLA — el contrato de la base, con un ejemplo que funciona.
//
// Para hacer una práctica nueva: copia esta carpeta a `practicas/<slug>/`,
// cambia el `slug` (tiene que estar en `../_comun/catalogo.js`, con su número
// de ejercicios) y escribe tus ejercicios. La base (`../_comun/base.js`) pone
// todo lo demás: entrada por código de alumno, menú, contador, feedback,
// código de resultado, guardado en el navegador y en Firestore, y ES/EN.
//
// Reparto de una práctica en ficheros:
//   logica.js    generadores y comprobaciones, PUROS (se prueban con `npm test`)
//   textos.js    textos propios, siempre { es, en }
//   practica.js  este fichero: los `montar` (la interfaz) y la llamada a `arrancar`
//   estilos.css  lo que no esté ya en `../_comun/estilos.css`
//
// ─── arrancar(practica) ────────────────────────────────────────────────────────
//
//   slug        el del catálogo. De ahí salen el id, el título y cuántos
//               ejercicios tiene que haber (si no coincide, la base lo dice en
//               pantalla y no arranca).
//   ejercicios  lista de ejercicios. El alumno los ve como «Ejercicio 1»,
//               «Ejercicio 2»… seguidos de su `nombre`. Cada uno:
//
//     nombre, detalle     { es, en }, una línea cada uno (salen en el menú).
//     inicial             aciertos necesarios (por defecto 20).
//     penalizacion        ejercicios que añade un fallo (por defecto 5).
//     maximo              tope de pendientes (por defecto 40; nunca menor que `inicial`).
//     introduccion        opcional, { es: html, en: html }: una tarjeta con botón
//                         «Empezar» que sale cada vez que se abre el ejercicio.
//     generar(rng, sesion)  devuelve el ítem: DATOS puros (ver logica.js).
//                         `rng` tiene azar(), entero(min, max), elegir(lista) y
//                         barajar(lista). `sesion` es { aciertos, fallos,
//                         pendientes, anterior } (anterior = el ítem previo o
//                         null): sirve para graduar la dificultad o para un
//                         ejercicio por pasos.
//     clave(item)         opcional: texto que identifica el ítem (por defecto,
//                         JSON.stringify). La base no repite la clave anterior
//                         (lo intenta hasta 5 veces).
//     montar(contenedor, item, api)  pinta el ítem dentro de `contenedor` (un
//                         <div> vacío) e instala sus eventos. La base lo llama
//                         otra vez con el mismo ítem si se cambia de idioma.
//
// ─── api (lo que recibe `montar`) ──────────────────────────────────────────────
//
//   api.idioma        'es' | 'en'
//   api.t             textos comunes del idioma: api.t.comprobar, api.t.siguiente,
//                     api.t.si, api.t.no, api.t.fijate… (ver ../_comun/textos.js)
//   api.tt(obj)       atajo para los textos propios: api.tt({ es, en })
//   api.esc(texto)    escapa HTML (para textos que no sean tuyos)
//   api.respondido()  true cuando ya se ha respondido este ítem
//   api.responder({ acierto, html, espera, pistas })
//                     UNA vez por ítem (las siguientes llamadas no hacen nada).
//                     `html` es la explicación, con los números de ese ítem.
//                     Acierto: feedback verde y pasa solo al siguiente a los
//                     `espera` ms (1300 por defecto; sube si hay mucho que leer).
//                     Fallo: feedback rojo con «+penalización», unas palabras de
//                     ánimo (las pone la base) y botón «Siguiente».
//                     `pistas` (opcional, entero ≥ 0): ayudas usadas en el ítem;
//                     se suman a los fallos sin tocar lo que queda por hacer.
//
// La base no toca nada de `contenedor` después de montar: marcar en verde o en
// rojo lo elegido y bloquear los botones es cosa de `montar`, ANTES de llamar
// a `api.responder`.

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { criterio, CRITERIOS, factorizar, htmlFact } from '../_comun/aritmetica.js';
import { TX } from './textos.js';
import {
  generarPrimo, clasePrimo, primosAProbar,
  generarFactorizacion, esFactorizacionDe, factDe, valorDe, BASES, EXPONENTE_MAXIMO,
} from './logica.js';

// ─── Ejercicio 1: patrón ELEGIR ────────────────────────────────────────────────
// Unos botones y una sola pulsación. Regla de oro: toda opción que se da por
// mala tiene que ser inequívocamente falsa (aquí no hay duda: un número mayor
// que 1 es primo o es compuesto, nunca las dos cosas).

/** La explicación del ítem, con sus números: es lo que distingue esto de un test en papel. */
function explicacionPrimo(n, api) {
  const { tt } = api;
  const x = TX.primo;
  if (clasePrimo({ n }) === 'compuesto') {
    const p = factorizar(n)[0][0];
    const cuenta = `<span class="cuenta">${n} = ${p} · ${n / p}</span>`;
    // Si hay criterio de divisibilidad para ese primo, se enseña con las cifras de n.
    const pista = CRITERIOS.includes(p) ? ` ${api.t.fijate} ${tt(criterio(n, p).razon)}.` : '';
    return `${tt(x.es_compuesto)(n)}: ${cuenta}.${pista}`;
  }
  const { probados, siguiente } = primosAProbar(n);
  if (!probados.length) return `${tt(x.es_primo)(n)}: ${tt(x.solo_dos)(n)}.`;
  const lista = probados.length > 1 ? `${probados.slice(0, -1).join(', ')} ${tt(x.ni)} ${probados.at(-1)}` : `${probados[0]}`;
  return `${tt(x.es_primo)(n)}: ${tt(x.no_divisible)(lista)}, ${tt(x.se_pasa)(n, siguiente)}.`;
}

function montarPrimo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.primo.pregunta)(item.n)}</p>
    <div class="operacion">${item.n}</div>
    <div class="flecha" aria-hidden="true">↓</div>`;
  const buena = clasePrimo(item);
  // `elecciones` (de ../_comun/piezas.js) añade los botones al contenedor.
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: ['primo', 'compuesto'].map(valor => ({ valor, html: tt(TX.primo.opcion[valor]) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([buena], valor);          // primero se pinta la corrección…
      api.responder({                          // …y después se avisa a la base
        acierto: valor === buena,
        html: explicacionPrimo(item.n, api),
        espera: 1800,
      });
    },
  });
}

// ─── Ejercicio 2: patrón CONSTRUIR ─────────────────────────────────────────────
// El alumno prepara su respuesta con varias pulsaciones y la entrega con
// «Comprobar». El estado de lo que va construyendo vive aquí, en `montar`
// (si se cambia de idioma a medias, se vuelve a empezar el ítem).

function montarFactorizacion(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.fact.instruccion)}</p>
    <div class="operacion" id="expresion"></div>
    <div class="grupo-pasos" id="primos"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const expresion = contenedor.querySelector('#expresion');
  const exponentes = () => controles.map(c => c.valor());
  // El hueco es «□»: en 1.º ESO todavía no hay letras.
  const pintar = () => {
    const f = factDe(exponentes());
    expresion.innerHTML = `${item.n} = ${f.length ? htmlFact(f) : '□'}`;
  };
  const controles = BASES.map(p => pasos(contenedor.querySelector('#primos'), {
    max: EXPONENTE_MAXIMO,
    nombre: tt(TX.fact.exponente_de)(p),
    pinta: e => (e === 0 ? `${p}` : `${p}<sup>${e}</sup>`),
    alCambiar: pintar,
  }));
  pintar();

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const mios = exponentes();
    const acierto = esFactorizacionDe(item, mios);
    controles.forEach(c => c.bloquear());
    ev.target.hidden = true;
    const buena = `<span class="cuenta">${item.n} = ${htmlFact(factorizar(item.n))}</span>`;
    if (acierto) return api.responder({ acierto: true, html: `${buena}.` });
    // Fallo: se dice cuánto vale lo que ha escrito el alumno, y después la buena.
    const f = factDe(mios);
    const suya = f.length ? `<span class="cuenta">${htmlFact(f)} = ${valorDe(f)}</span>, ${tt(TX.fact.no_da)} ${item.n}. ` : '';
    api.responder({ acierto: false, html: `${suya}${tt(TX.fact.correcta)} ${buena}.` });
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'plantilla',
  ejercicios: [
    {
      nombre: TX.primo.nombre,
      detalle: TX.primo.detalle,
      generar: generarPrimo,
      clave: item => String(item.n),
      montar: montarPrimo,
    },
    {
      nombre: TX.fact.nombre,
      detalle: TX.fact.detalle,
      inicial: 10,
      penalizacion: 2,
      introduccion: TX.fact.introduccion,
      generar: generarFactorizacion,
      montar: montarFactorizacion,
    },
  ],
});
