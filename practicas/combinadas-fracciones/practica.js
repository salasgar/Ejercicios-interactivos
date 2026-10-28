// Práctica «¿Qué se hace primero? Con fracciones» (PU2, tarea 106): la interfaz (los `montar`) y
// la llamada a `arrancar`. La lógica está en `logica.js`, puro y probado en
// `tests/practicas-combinadas-fracciones.test.js`.
//
// Ejercicio 1: se toca la operación que va primero (un toque = una respuesta).
// Ejercicio 2: paso a paso: se toca la operación que va ahora y se elige cuánto vale (opciones sacadas
// de errores típicos); un toque o un valor equivocados fallan el ítem, lo dicen y la app hace el paso
// bueno para seguir.
// Ejercicio 3: un procedimiento con una línea mal; se toca la línea y se dice si falla el orden o el cálculo.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { html as htmlExp, htmlFraccion, leerFraccion, aplicarPaso, pasoCanonico, valorLiteral, nodoEn, aTextoExpresion, analizar } from '../_comun/fracciones.js';
import {
  generarPrimero, generarPasos, generarError, arbolDe, clasificarToque, primerosPasos, rutasPrimeras,
  opcionesDePaso, opcionesOrdenadas,
} from './logica.js';
import { TX } from './textos.js';

const cuenta = texto => `<span class="cuenta">${htmlExp(texto)}</span>`;
const lineaHtml = (arbol, marcar = false) => htmlExp(arbol, { marcarOperadores: marcar });

/** La explicación de un toque que no valía, en el idioma de `tt`. */
function textoToque(dato, { tt }) {
  return tt(dato.error === 'derecha-a-izquierda' ? TX.mal_izquierda : TX.mal_jerarquia)(dato.canonico);
}

/** Lo que se dice del primer fallo de un ítem por pasos (un toque o un valor), o ''. */
function textoFallo(primero, textos) {
  if (!primero) return '';
  if (primero.tipo === 'toque') return `${textoToque(primero, textos)} `;
  const pista = TX.pista[primero.error];
  return `${textos.tt(TX.mal_resultado)(primero.operacion, primero.bueno)} ${pista ? `${textos.tt(pista)} ` : ''}`;
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
    <div class="operacion cf-linea" role="group">${lineaHtml(arbol, true)}</div>`;
  const linea = contenedor.querySelector('.cf-linea');
  linea.addEventListener('click', ev => {
    const marca = ev.target.closest('.frac-op');
    if (!marca || api.respondido()) return;
    const ruta = marca.dataset.ruta;
    const r = clasificarToque(arbol, ruta);
    const posibles = primerosPasos(arbol);
    linea.querySelectorAll('.frac-op').forEach(m => m.classList.add('frac-op--quieto'));
    marca.classList.add(r.valido ? 'frac-op--bien' : 'frac-op--mal');
    if (!r.valido) {
      // Se enseñan las que sí valían (borde de puntos), como en los cuatro estados de la app.
      const validas = new Set(rutasPrimeras(arbol));
      linea.querySelectorAll('.frac-op').forEach(m => { if (validas.has(m.dataset.ruta)) m.classList.add('frac-op--falta'); });
    }
    const toque = aTextoExpresion(nodoEn(arbol, ruta) ?? arbol);
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

// ─── Ejercicio 2: paso a paso ─────────────────────────────────────────────────────

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
    <div class="cf-historial"></div>
    <div class="operacion cf-linea" role="group"></div>
    <div class="cf-pregunta" hidden></div>
    <p class="cf-aviso" role="status"></p>`;
  const orden = contenedor.querySelector('#orden');
  const caja = contenedor.querySelector('.cf-historial');
  const linea = contenedor.querySelector('.cf-linea');
  const pregunta = contenedor.querySelector('.cf-pregunta');
  const aviso = contenedor.querySelector('.cf-aviso');

  const pintar = () => {
    caja.innerHTML = historial.map((h, i) => `<div class="cf-hist">${i ? '= ' : ''}${h}</div>`).join('');
    const acabado = valorLiteral(arbol) !== null;
    linea.innerHTML = `${historial.length ? '= ' : ''}${lineaHtml(arbol, etapa === 'toca' && !acabado)}`;
    linea.classList.toggle('cf-linea--fin', acabado);
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
    const cadena = [...historial, lineaHtml(arbol)].join(' = ');
    api.responder({
      acierto: !primerFallo,
      html: textos => `${textoFallo(primerFallo, textos)}<span class="cf-cadena">${cadena}</span>`,
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
      opciones: opciones.map(o => ({ valor: o.valor.clave(), html: htmlFraccion(o.valor) })),
      alElegir(valor) {
        if (etapa !== 'valor') return;
        etapa = 'espera';
        const elegida = opciones.find(o => o.valor.clave() === valor);
        botones.marcar([paso.valor.clave()], valor);
        if (elegida.error) {
          const bueno = htmlFraccion(paso.valor);
          primerFallo ??= { tipo: 'valor', error: elegida.error, operacion: paso.operacion, bueno, respuesta: elegida.valor.clave() };
          aviso.innerHTML = tt(TX.mal_resultado)(paso.operacion, bueno);
          setTimeout(() => { aviso.textContent = ''; aplicar(paso); }, 1500);
        } else {
          aplicar(paso);
        }
      },
    });
  }

  linea.addEventListener('click', ev => {
    const marca = ev.target.closest('.frac-op');
    if (!marca || etapa !== 'toca' || api.respondido()) return;
    const r = clasificarToque(arbol, marca.dataset.ruta);
    if (r.valido) { preguntarValor(r.paso); return; }
    etapa = 'espera';
    marca.classList.add('frac-op--mal');
    primerFallo ??= { tipo: 'toque', error: r.error, canonico: r.canonico.operacion, respuesta: aTextoExpresion(nodoEn(arbol, marca.dataset.ruta) ?? arbol) };
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

// ─── Ejercicio 3: caza el error ───────────────────────────────────────────────────

const enunciadoError = (item, { tt }) => `
  <p class="instruccion">${tt(TX.ej3.pregunta)}</p>
  <div class="operacion">${item.lineas.map((l, i) => `${i ? '= ' : ''}${lineaHtml(analizar(l))}`).join('<br>')}</div>`;

function montarError(contenedor, item, api) {
  const { tt } = api;
  let etapa = api.respondido() ? 'fin' : 'linea';
  let elegida = null;

  contenedor.innerHTML = `
    <p class="instruccion" id="orden">${tt(TX.ej3.pregunta)}</p>
    <div class="cf-lineas">
      <div class="cf-fila cf-fila--inicial"><span class="cf-fila__n"></span><div class="operacion">${lineaHtml(analizar(item.lineas[0]))}</div></div>
      ${item.lineas.slice(1).map((l, i) => `
        <button type="button" class="cf-fila" data-n="${i + 1}"><span class="cf-fila__n">${i + 1}</span>
          <span class="operacion">= ${lineaHtml(analizar(l))}</span></button>`).join('')}
    </div>
    <div class="cf-pregunta" hidden></div>`;
  const orden = contenedor.querySelector('#orden');
  const filas = [...contenedor.querySelectorAll('button.cf-fila')];
  const pregunta = contenedor.querySelector('.cf-pregunta');

  const marcar = (n, clase) => filas[n - 1]?.classList.add(clase);
  const cerrar = () => filas.forEach(f => { f.disabled = true; });

  function responder(tipo) {
    const lineaBien = elegida === item.linea;
    const tipoBien = tipo === item.tipo;
    const acierto = lineaBien && tipoBien;
    cerrar();
    marcar(item.linea, lineaBien ? 'cf-fila--bien' : 'cf-fila--falta');
    if (!lineaBien) marcar(elegida, 'cf-fila--mal');
    pregunta.hidden = true;
    api.responder({
      acierto,
      html: textos => {
        const { tt } = textos;
        const cabeza = lineaBien ? tt(TX.ej3.bien_linea)(item.linea) : tt(TX.ej3.mal_linea)(item.linea, item.canonica);
        const queFue = item.tipo === 'orden'
          ? tt(TX.ej3.era_orden)(item.operacion, item.canonica)
          : tt(TX.ej3.era_calculo)(item.operacion, htmlFraccion(leerFraccion(item.valorBueno)));
        const pista = TX.pista[item.error];
        return `${cabeza} ${queFue} ${pista ? tt(pista) : ''}`;
      },
      espera: 3000,
      ...(acierto ? {} : { error: item.error, respuesta: `${elegida}: ${tipo}` }),
    });
  }

  function preguntarTipo() {
    etapa = 'tipo';
    orden.hidden = true;
    pregunta.hidden = false;
    pregunta.innerHTML = `<p class="instruccion">${tt(TX.ej3.que_ha_pasado)}</p>`;
    elecciones(pregunta, {
      opciones: [
        { valor: 'orden', html: tt(TX.ej3.es_orden) },
        { valor: 'calculo', html: tt(TX.ej3.es_calculo) },
      ],
      clase: 'elecciones elecciones--2 cf-tipos',
      alElegir(valor) { if (etapa === 'tipo') { etapa = 'fin'; responder(valor); } },
    });
  }

  filas.forEach(f => f.addEventListener('click', () => {
    if (etapa !== 'linea' || api.respondido()) return;
    elegida = Number(f.dataset.n);
    filas.forEach(g => g.classList.toggle('cf-fila--elegida', g === f));
    preguntarTipo();
  }));

  if (etapa === 'fin') { cerrar(); marcar(item.linea, 'cf-fila--falta'); orden.hidden = true; }
}

// ─── La práctica ──────────────────────────────────────────────────────────────────

arrancar({
  slug: 'combinadas-fracciones',
  ejercicios: [
    {
      nombre: TX.ej1.nombre, detalle: TX.ej1.detalle, introduccion: TX.ej1.introduccion,
      generar: generarPrimero, clave: item => item.texto, montar: montarPrimero, enunciado: enunciadoPrimero,
    },
    {
      nombre: TX.ej2.nombre, detalle: TX.ej2.detalle, introduccion: TX.ej2.introduccion,
      generar: generarPasos, clave: item => item.texto, montar: montarPasos, enunciado: enunciadoPasos,
    },
    {
      nombre: TX.ej3.nombre, detalle: TX.ej3.detalle, introduccion: TX.ej3.introduccion,
      generar: generarError, clave: item => item.lineas.join('|'), montar: montarError, enunciado: enunciadoError,
    },
  ],
});
