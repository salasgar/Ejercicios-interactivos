// Práctica «¿Qué se hace primero? Con enteros» (PU2, tarea 87): la interfaz (los
// `montar`) y la llamada a `arrancar`. La lógica está en `logica.js`, puro y
// probado en `tests/practicas-jerarquia-enteros.test.js`.
//
// Ejercicio 1: se toca la operación que va primero (un toque = una respuesta).
// Ejercicios 2-4: paso a paso: se toca la operación que va ahora y se elige cuánto
// vale (opciones sacadas de errores típicos); un toque o un valor equivocados fallan
// el ítem, lo dicen y la app hace el paso bueno para seguir. El ejercicio 3 añade
// los pares de U3-3C-20: dos expresiones que se escriben y se calculan.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, html as htmlEntero, aplicarPaso, pasoCanonico, valorLiteral, nodoEn, aTexto, cadenaDePasos, campoEntero } from '../_comun/enteros.js';
import {
  generarPrimero, generarMezcla, generarCadena, generarCombinada,
  arbolDe, clasificarToque, primerosPasos, rutasPrimeras, opcionesDePaso, opcionesOrdenadas,
  valoresDelPar, errorPar,
} from './logica.js';
import { TX } from './textos.js';

const cuenta = texto => `<span class="cuenta">${texto}</span>`;
const lineaHtml = (arbol, marcar = false) => htmlEntero(arbol, { marcarOperadores: marcar });

/** La explicación de un toque que no valía, en el idioma de `tt`. */
function textoToque(dato, { tt }) {
  return tt(dato.error === 'derecha-a-izquierda' ? TX.mal_izquierda : TX.mal_jerarquia)(dato.canonico);
}

/** Lo que se dice del primer fallo de un ítem por pasos (un toque o un valor), o ''. */
function textoFallo(primero, textos) {
  if (!primero) return '';
  if (primero.tipo === 'toque') return `${textoToque(primero, textos)} `;
  const pista = TX.pista[primero.error];
  return `${textos.tt(TX.mal_resultado)(primero.operacion, fmt(primero.bueno))} ${pista ? `${textos.tt(pista)} ` : ''}`;
}

// ─── Ejercicio 1: tocar lo que va primero ─────────────────────────────────────────

const enunciadoPrimero = (item, { tt }) => `
  <p class="instruccion">${tt(TX.toca)}</p>
  <div class="operacion">${lineaHtml(arbolDe(item.texto))}</div>`;

function montarPrimero(contenedor, item, api) {
  const { tt } = api;
  const arbol = arbolDe(item.texto);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.toca)}</p>
    <div class="operacion jer-linea" role="group">${lineaHtml(arbol, true)}</div>`;
  const linea = contenedor.querySelector('.jer-linea');
  linea.addEventListener('click', ev => {
    const marca = ev.target.closest('.ent-op');
    if (!marca || api.respondido()) return;
    const ruta = marca.dataset.ruta;
    const r = clasificarToque(arbol, ruta);
    const posibles = primerosPasos(arbol);
    linea.querySelectorAll('.ent-op').forEach(m => m.classList.add('ent-op--quieto'));
    marca.classList.add(r.valido ? 'ent-op--bien' : 'ent-op--mal');
    if (!r.valido) {
      // Se enseñan las que sí valían (borde de puntos), como en los cuatro estados de la app.
      const validas = new Set(rutasPrimeras(arbol));
      linea.querySelectorAll('.ent-op').forEach(m => { if (validas.has(m.dataset.ruta)) m.classList.add('ent-op--falta'); });
    }
    const toque = aTexto(nodoEn(arbol, ruta) ?? arbol);
    api.responder({
      acierto: r.valido,
      html: textos => {
        const { tt } = textos;
        const lista = posibles.map(cuenta).join(', ');
        if (r.valido) {
          return `${tt(TX.va_primero)(r.paso.operacion)}. ${posibles.length > 1 ? `${tt(TX.podian)(lista)}. ` : ''}${tt(TX.orden)}`;
        }
        return `${textoToque({ error: r.error, canonico: r.canonico.operacion }, textos)} ${posibles.length > 1 ? `${tt(TX.podian)(lista)}.` : ''}`;
      },
      espera: 2400,
      ...(r.valido ? {} : { error: r.error, respuesta: toque }),
    });
  });
}

// ─── Ejercicios 2-4: paso a paso ──────────────────────────────────────────────────

const enunciadoPasos = (item, { tt }) => `
  <p class="instruccion">${tt(TX.toca)}</p>
  <div class="operacion">${lineaHtml(arbolDe(item.texto))}</div>`;

function montarPasos(contenedor, item, api) {
  const { tt } = api;
  const original = arbolDe(item.texto);
  let arbol = original;
  const historial = [];                 // HTML de las líneas ya hechas
  let primerFallo = null;
  let etapa = api.respondido() ? 'fin' : 'toca';

  contenedor.innerHTML = `
    <p class="instruccion" id="orden">${tt(TX.toca)}</p>
    <div class="jer-historial"></div>
    <div class="operacion jer-linea" role="group"></div>
    <div class="jer-pregunta" hidden></div>
    <p class="jer-aviso" role="status"></p>`;
  const orden = contenedor.querySelector('#orden');
  const caja = contenedor.querySelector('.jer-historial');
  const linea = contenedor.querySelector('.jer-linea');
  const pregunta = contenedor.querySelector('.jer-pregunta');
  const aviso = contenedor.querySelector('.jer-aviso');

  const pintar = () => {
    caja.innerHTML = historial.map((h, i) => `<div class="jer-hist">${i ? '= ' : ''}${h}</div>`).join('');
    const acabado = valorLiteral(arbol) !== null;
    linea.innerHTML = `${historial.length ? '= ' : ''}${lineaHtml(arbol, etapa === 'toca' && !acabado)}`;
    linea.classList.toggle('jer-linea--fin', acabado);
  };

  const aplicar = paso => {
    historial.push(lineaHtml(arbol));
    arbol = aplicarPaso(arbol, paso);
    pregunta.hidden = true;
    pregunta.innerHTML = '';
    if (valorLiteral(arbol) !== null) { etapa = 'fin'; pintar(); orden.hidden = true; terminar(); return; }
    etapa = 'toca';
    orden.textContent = tt(TX.toca_paso);
    pintar();
  };

  function terminar() {
    const final = historial.slice();
    const cadena = [...final, lineaHtml(arbol)].join(' = ');
    api.responder({
      acierto: !primerFallo,
      html: textos => `${textoFallo(primerFallo, textos)}<span class="jer-cadena">${cadena}</span>`,
      espera: 2400,
      ...(primerFallo ? { error: primerFallo.error, respuesta: primerFallo.respuesta } : {}),
    });
  }

  function preguntarValor(paso) {
    etapa = 'valor';
    orden.hidden = true;
    pintar();
    const opciones = opcionesOrdenadas(opcionesDePaso(arbol, paso, original));
    pregunta.hidden = false;
    pregunta.innerHTML = `<p class="instruccion">${tt(TX.cuanto)(paso.operacion)}</p>`;
    const botones = elecciones(pregunta, {
      opciones: opciones.map(o => ({ valor: o.valor, html: fmt(o.valor) })),
      alElegir(valor) {
        if (etapa !== 'valor') return;
        etapa = 'espera';
        const elegida = opciones.find(o => o.valor === Number(valor));
        botones.marcar([paso.valor], valor);
        if (elegida.error) {
          primerFallo ??= { tipo: 'valor', error: elegida.error, operacion: paso.operacion, bueno: paso.valor, respuesta: fmt(elegida.valor) };
          aviso.innerHTML = tt(TX.mal_resultado)(paso.operacion, fmt(paso.valor));
          setTimeout(() => { aviso.textContent = ''; aplicar(paso); }, 1300);
        } else {
          aplicar(paso);
        }
      },
    });
  }

  linea.addEventListener('click', ev => {
    const marca = ev.target.closest('.ent-op');
    if (!marca || etapa !== 'toca' || api.respondido()) return;
    const r = clasificarToque(arbol, marca.dataset.ruta);
    if (r.valido) { preguntarValor(r.paso); return; }
    etapa = 'espera';
    marca.classList.add('ent-op--mal');
    primerFallo ??= { tipo: 'toque', error: r.error, canonico: r.canonico.operacion, respuesta: aTexto(nodoEn(arbol, marca.dataset.ruta) ?? arbol) };
    aviso.innerHTML = textoToque(primerFallo, api);
    setTimeout(() => { aviso.textContent = ''; aplicar(r.canonico); }, 1800);
  });

  // Si el ítem se vuelve a montar ya respondido (cambio de idioma), se enseña la cadena hecha.
  if (etapa === 'fin') {
    let x = arbol;
    for (let i = 0; i < 20 && valorLiteral(x) === null; i++) { historial.push(lineaHtml(x)); x = aplicarPaso(x, pasoCanonico(x)); }
    arbol = x;
    orden.hidden = true;
  }
  pintar();
}

// ─── Ejercicio 3: el par de U3-3C-20 ──────────────────────────────────────────────

const enunciadoPar = (item, { tt }) => `
  <p class="instruccion">${tt(TX.calcula_dos)}</p>
  <div class="operacion">${htmlEntero(item.sin)}</div> <div class="operacion">${htmlEntero(item.con)}</div>`;

function explicarPar(item, escritos, { tt }) {
  const cadenaDe = texto => cadenaDePasos(texto).map(e => htmlEntero(e.arbol)).join(' = ');
  const partes = [];
  escritos.forEach((v, i) => { if (v !== valoresDelPar(item)[i]) partes.push(`${tt(TX.tu_valor)} ${cuenta(fmt(v))}.`); });
  partes.push(`${cuenta(cadenaDe(item.sin))}. ${cuenta(cadenaDe(item.con))}.`);
  partes.push(tt(TX.ej3.par_agrupa));
  return partes.join(' ');
}

function montarPar(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.calcula_dos)}</p>
    <div class="jer-par">
      <div class="jer-par__fila"><span class="operacion">${htmlEntero(item.sin)}</span><span class="jer-igual">=</span><div class="campo" id="campo0"></div></div>
      <div class="jer-par__fila"><span class="operacion">${htmlEntero(item.con)}</span><span class="jer-igual">=</span><div class="campo" id="campo1"></div></div>
    </div>
    <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('.comprobar');
  const campos = [0, 1].map(i => campoEntero(contenedor.querySelector(`#campo${i}`), { nombre: `${tt(TX.resultado)} ${i + 1}`, alEnviar: () => comprobar() }));
  const listo = () => campos.every(c => c.valor() !== null);
  const refrescar = () => { boton.disabled = !listo(); };
  contenedor.addEventListener('input', refrescar);
  contenedor.addEventListener('click', refrescar);
  boton.addEventListener('click', comprobar);

  function comprobar() {
    if (api.respondido() || !listo()) return;
    const escritos = campos.map(c => c.valor());
    const buenos = valoresDelPar(item);
    campos.forEach(c => c.bloquear());
    boton.hidden = true;
    const mal = escritos.findIndex((v, i) => v !== buenos[i]);
    api.responder({
      acierto: mal < 0,
      html: textos => explicarPar(item, escritos, textos),
      espera: 2800,
      ...(mal < 0 ? {} : { error: errorPar(item, mal, escritos[mal]), respuesta: escritos.map(fmt).join(' / ') }),
    });
  }
}

// ─── Ejercicio 3: cadena o par ────────────────────────────────────────────────────

const enunciadoCadena = (item, textos) => (item.tipo === 'par' ? enunciadoPar(item, textos) : enunciadoPasos(item, textos));
const montarCadena = (contenedor, item, api) => (item.tipo === 'par' ? montarPar(contenedor, item, api) : montarPasos(contenedor, item, api));

// ─── La práctica ──────────────────────────────────────────────────────────────────

const claveTexto = item => (item.tipo === 'par' ? `${item.sin}|${item.con}` : item.texto);

arrancar({
  slug: 'jerarquia-enteros',
  ejercicios: [
    {
      nombre: TX.ej1.nombre, detalle: TX.ej1.detalle, introduccion: TX.ej1.introduccion,
      generar: generarPrimero, clave: claveTexto, montar: montarPrimero, enunciado: enunciadoPrimero,
    },
    {
      nombre: TX.ej2.nombre, detalle: TX.ej2.detalle, introduccion: TX.ej2.introduccion,
      generar: generarMezcla, clave: claveTexto, montar: montarPasos, enunciado: enunciadoPasos,
    },
    {
      nombre: TX.ej3.nombre, detalle: TX.ej3.detalle, introduccion: TX.ej3.introduccion,
      generar: generarCadena, clave: claveTexto, montar: montarCadena, enunciado: enunciadoCadena,
    },
    {
      nombre: TX.ej4.nombre, detalle: TX.ej4.detalle, introduccion: TX.ej4.introduccion,
      generar: generarCombinada, clave: claveTexto, montar: montarPasos, enunciado: enunciadoPasos,
    },
  ],
});
