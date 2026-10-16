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
//     objetivo            puntos a los que hay que llegar (por defecto 10). Cada
//                         acierto da 1; 5 aciertos seguidos dan 1 extra.
//     penalizacion        puntos que quita un fallo (por defecto 1; nunca por debajo de 0).
//     vidas               fallos que se admiten (por defecto 5): sin vidas, el ejercicio
//                         vuelve a empezar desde 0 puntos (los fallos acumulados se conservan).
//                         Las constantes viven en ../_comun/contador.js.
//     introduccion        opcional, { es: html, en: html }: una tarjeta con botón
//                         «Empezar» que sale cada vez que se abre el ejercicio.
//     generar(rng, sesion)  devuelve el ítem: DATOS puros (ver logica.js).
//                         `rng` tiene azar(), entero(min, max), elegir(lista) y
//                         barajar(lista). `sesion` es { aciertos, fallos, puntos,
//                         vidas, anterior, idioma } (anterior = el ítem previo o null;
//                         aciertos = los del intento en curso, que vuelven a 0 al
//                         perder las vidas): sirve para graduar la dificultad o
//                         para un ejercicio por pasos. `idioma` ('es' | 'en') es
//                         el del ítem que se va a generar: permite ítems que solo
//                         tienen sentido en un idioma (por ejemplo, un error que
//                         solo lo es en inglés). Ojo: tras responder, el alumno
//                         puede ver el enunciado y el feedback de ESE ítem en el
//                         otro idioma (ver `enunciado` y `api.responder`).
//     clave(item)         opcional: texto que identifica el ítem (por defecto,
//                         JSON.stringify). La base no repite la clave anterior
//                         (lo intenta hasta 5 veces).
//     montar(contenedor, item, api)  pinta el ítem dentro de `contenedor` (un
//                         <div> vacío) e instala sus eventos.
//     enunciado(item, { idioma, t, tt, esc })  opcional: el HTML del enunciado
//                         (la orden, el problema…) en ese idioma, con las mismas
//                         clases que en `montar`. Sale en la traducción, encima
//                         del feedback. Solo el texto: nada de botones ni casillas.
//
// ─── api (lo que recibe `montar`) ──────────────────────────────────────────────
//
//   api.idioma        'es' | 'en': el idioma de ESTE ítem, no un ajuste global.
//                     Por defecto la base lo sortea por ítem (modo «alterno»,
//                     equilibrado); el enlace del profesor puede fijarlo para
//                     un alumno. El alumno nunca lo elige: no hay selector.
//   api.t             textos comunes del idioma del ítem: api.t.comprobar,
//                     api.t.siguiente, api.t.si, api.t.no, api.t.fijate…
//                     (ver ../_comun/textos.js)
//   api.tt(obj)       atajo para los textos propios: api.tt({ es, en })
//   api.esc(texto)    escapa HTML (para textos que no sean tuyos)
//   api.respondido()  true cuando ya se ha respondido este ítem
//   api.responder({ acierto, html, espera, pistas, error, respuesta })
//                     UNA vez por ítem (las siguientes llamadas no hacen nada).
//                     `html` es la explicación, con los números de ese ítem.
//                     Mejor como FUNCIÓN de los textos de un idioma:
//                       html: ({ tt, t, idioma }) => tt(TX.razon)(item.n)
//                     Así la base puede darla también en el otro idioma: solo
//                     entonces sale el botón «See in English» / «Ver en español».
//                     Ojo: dentro de la función, `tt` y `t` tienen que ser los
//                     que recibe, no los de `api`.
//                     Acierto: feedback verde y pasa solo al siguiente a los
//                     `espera` ms (1300 por defecto; sube si hay mucho que leer).
//                     Con punto extra por la racha, lo dice y espera un poco más.
//                     Fallo: feedback rojo con «−penalización», las vidas que
//                     quedan (o que el ejercicio vuelve a empezar), unas palabras
//                     de ánimo (las pone la base) y botón «Siguiente».
//                     `pistas` (opcional, entero ≥ 0): ayudas usadas en el ítem;
//                     se suman a los fallos sin tocar los puntos ni las vidas.
//                     `error` (opcional, solo al fallar): identificador corto del
//                     tipo de error, en minúsculas con guiones (p. ej.
//                     'confunde-mcd-mcm'); `respuesta` (opcional): lo que contestó
//                     el alumno, en texto corto («6», «Verdadero», «2³ · 5»).
//                     La base registra cada fallo en la nube (colección `fallos`,
//                     ver ../_comun/registro.js) con el ítem, el feedback en texto
//                     plano y, si se pasan, estos dos campos, para el panel del
//                     profesor. Sin ellos se registra igual; el alumno no ve nada.
//
// La base no toca nada de `contenedor` después de montar: marcar en verde o en
// rojo lo elegido y bloquear los botones es cosa de `montar`, ANTES de llamar
// a `api.responder`.
//
// Tras responder, si `html` es una función, la base añade su propio botón «Ver
// en español» / «See in English», que abre debajo una caja con el `enunciado`
// del ejercicio (si lo hay) y el feedback completo en el otro idioma. Si se
// abre tras un acierto, ya no pasa solo al siguiente: sale «Siguiente».
//
// ─── Lo que la práctica no tiene que hacer ─────────────────────────────────────
//
// `…/<slug>/?ejercicio=n` abre directamente el ejercicio n (empezando en 1), y
// con `&semana=<id>` vuelve a la tarea de la semana al salir o al terminar
// (`../semana.html`, datos en `../_comun/tareas.js`). Lo hace la base: la
// práctica no tiene que hacer nada.
//
// ─── Piezas comunes (../_comun/piezas.js) ──────────────────────────────────────
//
//   elecciones(contenedor, { opciones, alElegir, clase })   botones de elegir (ejercicio 1)
//   pasos(contenedor, { valor, min, max, pinta, … })        contador −/valor/+ (ejercicio 2)
//   campoNumero(contenedor, { nombre, cifras, idioma, boton, alEnviar })
//                       para escribir un número: en el móvil saca el teclado de
//                       cifras, acepta «4.730» y «4 730» y no deja comprobar
//                       vacío. Úsalo en vez de <input type="number">:
//
//     contenedor.innerHTML = `… <div id="campo"></div><button type="button" class="comprobar">${api.t.comprobar}</button>`;
//     const boton = contenedor.querySelector('.comprobar');
//     const campo = campoNumero(contenedor.querySelector('#campo'), { nombre: 'Resultado', idioma: api.idioma, boton, alEnviar: comprobar });
//     boton.addEventListener('click', () => comprobar(campo.valor()));
//     function comprobar(valor) { if (api.respondido()) return; campo.bloquear(); boton.hidden = true; api.responder({ … }); }

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

// El enunciado sale también en la traducción (sin los botones).
const enunciadoPrimo = (item, { tt }) => `<p class="instruccion">${tt(TX.primo.pregunta)(item.n)}</p>`;

function montarPrimo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoPrimo(item, api)}
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
        html: textos => explicacionPrimo(item.n, textos),   // función: se puede traducir
        espera: 1800,
      });
    },
  });
}

// ─── Ejercicio 2: patrón CONSTRUIR ─────────────────────────────────────────────
// El alumno prepara su respuesta con varias pulsaciones y la entrega con
// «Comprobar». El estado de lo que va construyendo vive aquí, en `montar`
// (si se cambia de idioma a medias, se vuelve a empezar el ítem).

const enunciadoFactorizacion = (item, { tt }) => `<p class="instruccion">${tt(TX.fact.instruccion)}</p>`;

function montarFactorizacion(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoFactorizacion(item, api)}
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
    if (acierto) return api.responder({ acierto: true, html: () => `${buena}.` });
    // Fallo: se dice cuánto vale lo que ha escrito el alumno, y después la buena.
    // Dentro de la función, el `tt` que recibe (el del idioma que se pida).
    const f = factDe(mios);
    api.responder({
      acierto: false,
      html: ({ tt }) => {
        const suya = f.length ? `<span class="cuenta">${htmlFact(f)} = ${valorDe(f)}</span>, ${tt(TX.fact.no_da)} ${item.n}. ` : '';
        return `${suya}${tt(TX.fact.correcta)} ${buena}.`;
      },
    });
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
      enunciado: enunciadoPrimo,
    },
    {
      nombre: TX.fact.nombre,
      detalle: TX.fact.detalle,
      objetivo: 10,
      penalizacion: 1,
      vidas: 5,
      introduccion: TX.fact.introduccion,
      generar: generarFactorizacion,
      montar: montarFactorizacion,
      enunciado: enunciadoFactorizacion,
    },
  ],
});
