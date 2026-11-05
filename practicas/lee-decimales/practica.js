// Práctica «Lee y escribe decimales» de la unidad 5 (Decimals): leer un decimal y escribir con cifras
// uno que se lee, el valor de cada cifra, la fracción decimal y los decimales en la recta. Contrato de
// la base en `../_comun/base.js` y `../plantilla/practica.js`; la lógica (ítems, distractores,
// corrección) está en `logica.js`, que se prueba en `tests/practicas-lee-decimales.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto, enPalabras } from '../_comun/decimales.js';
import { crearRectaDecimales } from '../_comun/recta-decimales.js';
import { htmlFraccion } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import {
  generarLeelo, generarCifra, generarFraccionDecimal, generarRecta, claveItem,
  D, Fr, cifrasDe, ordenDe, leerCampo, corregirToque, corregirLeido, pasoDeRecta,
} from './logica.js';

const num = (p, idioma) => aTexto(D(p), idioma);
/** Sin ceros finales (2,2 y no 2,20): para los extremos del tramo y lo que toca el alumno. */
const numN = (p, idioma) => aTexto(D(p).normalizar(), idioma);
const suma = (terminos, idioma) => terminos.map(t => num(t, idioma)).join(' + ');

/** El número con la cifra del ítem resaltada (ejercicio 2, 'valor'). */
function htmlNumeroMarcado(item, idioma) {
  const sep = idioma === 'en' ? '.' : ',';
  return cifrasDe(D(item.d)).map((c, i) => {
    const cifra = i === item.indice ? `<span class="cifra-marcada">${c.cifra}</span>` : `${c.cifra}`;
    return cifra + (c.exponente === 0 && item.d.k > 0 ? sep : '');
  }).join('');
}

/** Enlaza el ejercicio con su nombre, su detalle y su introducción de textos.js. */
const ejercicio = (i, resto) => ({
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  clave: claveItem,
  ...resto,
});

/** Elegir entre cuatro opciones ya preparadas ({ html, correcta, error, respuesta }); `explicacion` es la función del feedback. */
function montarEleccion(contenedor, encabezado, opciones, api, explicacion, { clase = 'elecciones elecciones--4' } = {}) {
  contenedor.innerHTML = `${encabezado}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase,
    opciones: opciones.map((o, i) => ({ valor: String(i), html: o.html })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = opciones[Number(valor)];
      botones.marcar(opciones.map((o, i) => (o.correcta ? i : null)).filter(i => i !== null), valor);
      api.responder({
        acierto: elegida.correcta,
        error: elegida.error ?? undefined,
        respuesta: elegida.respuesta,
        espera: 2400,
        html: textos => explicacion(textos, elegida),
      });
    },
  });
}

// ─── Ejercicio 1 · Léelo ─────────────────────────────────────────────────────────────────

const enunciadoLeelo = (item, { tt, esc, idioma }) => (item.sentido === 'lectura'
  ? `<p class="instruccion">${tt(TX.instrucciones.lectura)}</p><div class="operacion">${num(item.d, idioma)}</div>`
  : `<p class="instruccion">${tt(TX.instrucciones.cifras)}</p><p class="lectura-dicha" lang="${item.idioma}">«${esc(item.lectura)}»</p>`);

function montarLeelo(contenedor, item, api) {
  const lectura = item.sentido === 'lectura';
  const opciones = item.opciones.map(o => ({
    ...o,
    html: lectura ? api.esc(o.texto) : num(o.valor, api.idioma),
    respuesta: lectura ? o.texto : num(o.valor, api.idioma),
  }));
  montarEleccion(contenedor, enunciadoLeelo(item, api), opciones, api, ({ tt, idioma }, elegida) => {
    const n = num(item.d, idioma);
    const buena = enPalabras(D(item.d), idioma);
    const motivo = elegida.correcta ? '' : `${tt(TX.leelo.motivo[elegida.error])(n, lectura ? `«${elegida.texto}»` : num(elegida.valor, idioma))} `;
    return motivo + (lectura ? tt(TX.leelo.se_lee)(n, buena) : tt(TX.leelo.lectura_dice)(n, buena));
  }, { clase: lectura ? 'elecciones elecciones--1' : 'elecciones elecciones--4' });
}

// ─── Ejercicio 2 · ¿Qué vale esta cifra? ─────────────────────────────────────────────────

const enunciadoCifra = (item, { tt, idioma }) => (item.tipo === 'valor'
  ? `<p class="instruccion">${tt(TX.instrucciones.valor)}</p><div class="operacion">${htmlNumeroMarcado(item, idioma)}</div>`
  : `<p class="instruccion">${tt(TX.instrucciones.suma)}</p><div class="operacion">${num(item.d, idioma)}</div>`);

function montarCifra(contenedor, item, api) {
  const esValor = item.tipo === 'valor';
  const opciones = item.opciones.map(o => {
    const texto = esValor ? num(o.valor, api.idioma) : suma(o.terminos, api.idioma);
    return { ...o, html: texto, respuesta: texto };
  });
  const buena = item.opciones.find(o => o.correcta);
  montarEleccion(contenedor, enunciadoCifra(item, api), opciones, api, ({ tt, idioma }) => {
    const n = num(item.d, idioma);
    if (!esValor) return tt(TX.cifra.suma)(n, suma(buena.terminos, idioma));
    const plural = ordenDe(item.exponente, idioma);
    const lugar = idioma === 'en' ? `the ${plural} place` : `las ${plural}`;
    const cantidad = `${item.cifra} ${ordenDe(item.exponente, idioma, item.cifra === 1 ? 1 : 2)}`;
    return tt(TX.cifra.vale)(n, item.cifra, lugar, cantidad, num(buena.valor, idioma));
  }, { clase: esValor ? 'elecciones elecciones--4' : 'elecciones elecciones--1' });
}

// ─── Ejercicio 3 · La fracción decimal ───────────────────────────────────────────────────

const fr = p => htmlFraccion(Fr(p));

const enunciadoFraccion = (item, { tt, idioma }) => (item.sentido === 'a-fraccion'
  ? `<p class="instruccion">${tt(TX.instrucciones.a_fraccion)}</p><div class="operacion">${num(item.d, idioma)}</div>`
  : `<p class="instruccion">${tt(TX.instrucciones.a_decimal)}</p><div class="operacion">${fr(item.fr)}</div>`);

function montarFraccion(contenedor, item, api) {
  const aFraccion = item.sentido === 'a-fraccion';
  const opciones = item.opciones.map(o => ({
    ...o,
    html: aFraccion ? fr(o.fr) : num(o.valor, api.idioma),
    respuesta: aFraccion ? `${o.fr.n}/${o.fr.d}` : num(o.valor, api.idioma),
  }));
  const buena = item.opciones.find(o => o.correcta);
  montarEleccion(contenedor, enunciadoFraccion(item, api), opciones, api, ({ tt, idioma }) => {
    if (aFraccion) return tt(TX.fraccion.a_fraccion)(num(item.d, idioma), item.d.k, fr(buena.fr));
    return tt(TX.fraccion.a_decimal)(fr(item.fr), item.d.k, num(item.d, idioma));
  });
}

// ─── Ejercicio 4 · En la recta ───────────────────────────────────────────────────────────

const enunciadoRecta = (item, { tt, idioma }) => `<p class="instruccion">${item.sentido === 'tocar'
  ? tt(TX.instrucciones.tocar)(num(item.valor, idioma))
  : tt(TX.instrucciones.leer)}</p>`;

/** La explicación de los huecos, con los números del ítem. */
const explicacionRecta = (item, { tt, idioma }) => tt(TX.recta.huecos)(
  num(item.valor, idioma), numN(item.desde, idioma), numN(item.hasta, idioma), num(pasoDeRecta(item), idioma), item.marcas);

function montarRecta(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoRecta(item, api)}<div id="caja-recta"></div>`
    + (item.sentido === 'leer'
      ? `<input type="text" class="campo-numero campo-numero--decimal" id="campo" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(api.tt(TX.campos.numero))}">`
      : '')
    + `<button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#caja-recta');
  const boton = contenedor.querySelector('#comprobar');
  const buena = D(item.valor);
  const base = { desde: D(item.desde), hasta: D(item.hasta), cifras: item.cifras, idioma: api.idioma, nombre: api.tt(TX.ejercicios[3].nombre) };

  if (item.sentido === 'tocar') {
    let elegido = null;
    const recta = crearRectaDecimales(caja, {
      ...base,
      alTocar(valor) {
        if (api.respondido()) return;
        if (elegido) recta.desmarcar(elegido);
        elegido = valor;
        recta.marcar(valor, 'rd-toque--elegida');
        boton.disabled = false;
      },
    });
    boton.addEventListener('click', () => {
      if (api.respondido() || !elegido) return;
      const { acierto, error } = corregirToque(item, elegido);
      recta.bloquear();
      recta.desmarcar(elegido);
      recta.marcar(elegido, acierto ? 'rd-toque--bien' : 'rd-toque--mal');
      if (!acierto) recta.marcar(buena, 'rd-toque--falta');
      boton.hidden = true;
      api.responder({
        acierto,
        error: error ?? undefined,
        respuesta: num(elegido, api.idioma),
        espera: 2400,
        html: textos => `${acierto ? '' : `${textos.tt(TX.recta.tocaste)(numN(elegido, textos.idioma))} ${error === 'cuenta-marcas-en-vez-de-huecos' ? `${textos.tt(TX.recta.cuenta_marcas)} ` : ''}`}${explicacionRecta(item, textos)}`,
      });
    });
    return;
  }

  const recta = crearRectaDecimales(caja, { ...base, puntos: [{ valor: buena }] });
  const campo = contenedor.querySelector('#campo');
  const escrito = () => leerCampo(campo.value);
  const actualizar = () => {
    const malo = campo.value.trim() !== '' && escrito() === null;
    campo.classList.toggle('campo-numero--malo', malo);
    campo.setAttribute('aria-invalid', String(malo));
    boton.disabled = escrito() === null || api.respondido();
  };
  function comprobar() {
    const valor = escrito();
    if (api.respondido() || valor === null) return;
    const { acierto, error } = corregirLeido(item, valor);
    campo.disabled = true;
    recta.bloquear();
    recta.ponerPuntos([{ valor: buena, clase: acierto ? 'rd-punto--bien' : 'rd-punto--mal' }]);
    boton.hidden = true;
    api.responder({
      acierto,
      error: error ?? undefined,
      respuesta: campo.value.trim(),
      espera: 2400,
      html: textos => `${acierto ? '' : `${textos.tt(TX.recta.escribiste)(num(valor, textos.idioma))} ${error === 'cuenta-marcas-en-vez-de-huecos' ? `${textos.tt(TX.recta.cuenta_marcas)} ` : ''}`}${explicacionRecta(item, textos)}`,
    });
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────

arrancar({
  slug: 'lee-decimales',
  ejercicios: [
    ejercicio(0, { generar: generarLeelo, montar: montarLeelo, enunciado: enunciadoLeelo }),
    ejercicio(1, { generar: generarCifra, montar: montarCifra, enunciado: enunciadoCifra }),
    ejercicio(2, { generar: generarFraccionDecimal, montar: montarFraccion, enunciado: enunciadoFraccion }),
    ejercicio(3, { generar: generarRecta, montar: montarRecta, enunciado: enunciadoRecta }),
  ],
});
