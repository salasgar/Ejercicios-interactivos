// «Suma y resta» de fracciones (PU2, tarea 104). Cinco ejercicios de la unidad 4:
//   1. Mismo denominador     3/8 + 1/8; también negativas                      (U4-2C-01, 2C-07)
//   2. Distinto denominador  tres pasos: m.c.m., equivalentes, resultado        (U4-1C-16, 2C-02, 2C-04)
//   3. Con naturales         1 + 2/3, 2 − 3/4, 1/2 − 2                          (U4-2C-03, 2C-07)
//   4. ¿Qué queda?           partes de un todo, cuatro respuestas               (U4-2A-01, 2A-04)
//   5. Caza el error         una suma en tres líneas: toca la mala y di por qué (U4-3C-11)
// La lógica (generadores, correcciones, errores) está en `logica.js`; las frases, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { htmlFraccion, aTexto } from '../_comun/fracciones.js';
import { campoFraccion, casillaNumero } from './campo.js';
import {
  F, generarMismo, generarPasos, generarNaturales, generarQueda, generarCaza,
  errorDeMismo, corregirPasos, errorDeNat,
} from './logica.js';
import {
  TX, nombreError, cuentaMismo, solucionMismo, cuentaPasos, solucionPasos, cuentaNat, solucionNat,
  enunciadoQueda, solucionQueda, explicaOpcion, lineasCaza, explicaCaza,
} from './textos.js';

const frItem = x => htmlFraccion(F(x));

// ─── Ejercicios 1 y 3: escribir una fracción ───────────────────────────────────

const enunciadoMismo = (item, { tt }) => `
  <p class="instruccion">${tt(TX.mismo.instruccion)(item.irred)}</p>
  <div class="operacion">${cuentaMismo(item)}</div>`;

const enunciadoNat = (item, { tt }) => `
  <p class="instruccion">${tt(TX.nat.instruccion)}</p>
  <div class="operacion">${cuentaNat(item)}</div>`;

/** Un ejercicio de «escribe la fracción»: el mismo montaje para el 1 y el 3. */
function montarFraccion(contenedor, item, api, { enunciado, TXej, corregir, solucion }) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciado(item, api)}
    <div class="fila-campo" id="campo"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoFraccion(contenedor.querySelector('#campo'), {
    arriba: tt(TX.mismo.arriba), abajo: tt(TX.mismo.abajo), conSigno: true,
    alCambiar: v => { boton.disabled = v === null; },
    alEnviar: comprobar,
  });
  boton.addEventListener('click', comprobar);

  function comprobar() {
    const v = campo.valor();
    if (api.respondido() || v === null) return;
    campo.bloquear();
    boton.hidden = true;
    const error = corregir(item, v);
    if (error === null) return api.responder({ acierto: true, html: ({ idioma }) => solucion(item, idioma) });
    api.responder({
      acierto: false,
      error,
      respuesta: aTexto(v),
      html: ({ tt, idioma }) => {
        const explicacion = TXej.fallo[error] ? tt(TXej.fallo[error])(item) : '';
        return `${tt(TXej.escribio)(htmlFraccion(v))} ${explicacion} ${solucion(item, idioma)}`.replace(/\s+/g, ' ').trim();
      },
      espera: 2800,
    });
  }
}

const montarMismo = (c, item, api) => montarFraccion(c, item, api, { enunciado: enunciadoMismo, TXej: TX.mismo, corregir: errorDeMismo, solucion: solucionMismo });
const montarNat = (c, item, api) => montarFraccion(c, item, api, { enunciado: enunciadoNat, TXej: TX.nat, corregir: errorDeNat, solucion: solucionNat });

// ─── Ejercicio 2: paso a paso ──────────────────────────────────────────────────

const enunciadoPasos = (item, { tt }) => `
  <p class="instruccion">${tt(TX.pasos.instruccion)(item.irred)}</p>
  <div class="operacion">${cuentaPasos(item)}</div>`;

function montarPasos(contenedor, item, api) {
  const { tt } = api;
  const dens = item.fracs.map(f => f.d).join(', ');
  contenedor.innerHTML = `
    ${enunciadoPasos(item, api)}
    <div class="paso-fd"><p class="paso-fd__titulo">${tt(TX.pasos.paso1)(dens)}</p><div class="fila-campo" id="mcm"></div></div>
    <div class="paso-fd"><p class="paso-fd__titulo">${tt(TX.pasos.paso2)}</p>
      ${item.fracs.map((f, i) => `<div class="fila-campo"><span>${frItem(f)} =</span><span id="eq${i}"></span></div>`).join('')}
    </div>
    <div class="paso-fd"><p class="paso-fd__titulo">${tt(TX.pasos.paso3)}</p><div class="fila-campo" id="res"></div></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const actualizar = () => {
    boton.disabled = mcm.valor() === null || eqs.some(e => e.valor() === null) || res.valor() === null;
  };
  const mcm = casillaNumero(contenedor.querySelector('#mcm'), { nombre: tt(TX.pasos.nombre_mcm), cifras: 3, alCambiar: actualizar, alEnviar: () => comprobar() });
  const eqs = item.fracs.map((f, i) => campoFraccion(contenedor.querySelector(`#eq${i}`), {
    arriba: tt(TX.pasos.nombre_equiv)(i + 1), abajo: tt(TX.mismo.abajo), alCambiar: actualizar, alEnviar: () => comprobar(),
  }));
  const res = campoFraccion(contenedor.querySelector('#res'), {
    arriba: tt(TX.mismo.arriba), abajo: tt(TX.mismo.abajo), alCambiar: actualizar, alEnviar: () => comprobar(),
  });
  boton.addEventListener('click', () => comprobar());

  function comprobar() {
    if (api.respondido() || boton.disabled) return;
    const resp = { m: mcm.valor(), equivs: eqs.map(e => e.valor()), res: res.valor() };
    const c = corregirPasos(item, resp);
    mcm.bloquear(); eqs.forEach(e => e.bloquear()); res.bloquear();
    boton.hidden = true;
    // Cada paso se marca solo.
    const marca = (elemento, bien) => elemento.classList.add(bien ? 'campo--bien' : 'campo--mal');
    marca(mcm.elemento, c.mcmBien);
    eqs.forEach((e, i) => e.casillas.forEach(x => marca(x, c.equivBien[i])));
    res.casillas.forEach(x => marca(x, c.resBien));
    if (c.acierto) return api.responder({ acierto: true, html: ({ idioma }) => solucionPasos(item, idioma) });
    api.responder({
      acierto: false,
      error: c.error,
      respuesta: `${resp.m}; ${resp.equivs.map(aTexto).join(' ')}; ${aTexto(resp.res)}`,
      html: ({ tt, idioma }) => {
        const explicacion = TX.pasos.fallo[c.error] ? tt(TX.pasos.fallo[c.error])(item) : '';
        const coherente = c.coherente && c.error !== 'sin-simplificar' && c.error !== 'mcm-equivocado' ? ` ${tt(TX.pasos.coherente)}` : '';
        return `${explicacion}${coherente} ${solucionPasos(item, idioma)}`.replace(/\s+/g, ' ').trim();
      },
      espera: 3200,
    });
  }
}

// ─── Ejercicio 4: ¿qué queda? ──────────────────────────────────────────────────

const enunciadoQuedaHtml = (item, { idioma, tt }) => {
  const e = enunciadoQueda(item, idioma);
  return `
    <p class="instruccion">${tt(TX.queda.instruccion)}</p>
    <p class="instruccion instruccion--enunciado">${e.texto}</p>
    <p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

function montarQueda(contenedor, item, api) {
  contenedor.innerHTML = enunciadoQuedaHtml(item, api);
  const buena = item.opciones.findIndex(o => o.error === null);
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map((o, i) => ({ valor: i, html: frItem(o) })),
    alElegir(i) {
      if (api.respondido()) return;
      const elegida = item.opciones[i];
      botones.marcar([buena], i);
      if (elegida.error === null) return api.responder({ acierto: true, html: ({ idioma }) => solucionQueda(item, idioma) });
      api.responder({
        acierto: false,
        error: elegida.error,
        respuesta: aTexto(F(elegida)),
        html: ({ idioma }) => `${explicaOpcion(item, elegida, idioma)} ${solucionQueda(item, idioma)}`.trim(),
        espera: 3200,
      });
    },
  });
}

// ─── Ejercicio 5: caza el error ────────────────────────────────────────────────

const enunciadoCaza = (item, { tt }) => `
  <p class="instruccion">${tt(TX.caza.instruccion)}</p>
  <div class="lineas-caza">${lineasCaza(item).map((h, i) => `<div class="linea-caza"><span class="linea-caza__n">${tt(TX.caza.linea)(i + 1)}</span>${h}</div>`).join('')}</div>`;

function montarCaza(contenedor, item, api) {
  const { tt } = api;
  const lineas = lineasCaza(item);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.caza.instruccion)}</p>
    <div class="lineas-caza lineas-caza--botones" id="lineas">
      ${lineas.map((h, i) => `<button type="button" class="eleccion linea-caza" data-i="${i}"><span class="linea-caza__n">${tt(TX.caza.linea)(i + 1)}</span>${h}</button>`).join('')}
    </div>
    <button type="button" class="secundario" id="ninguno">${tt(TX.caza.ninguno)}</button>
    <div id="razones"></div>`;
  const botones = [...contenedor.querySelectorAll('.linea-caza')];
  const ninguno = contenedor.querySelector('#ninguno');
  const bloquear = () => { botones.forEach(b => { b.disabled = true; }); ninguno.disabled = true; };
  const marcar = elegida => {
    bloquear();
    if (item.mala !== null) botones[item.mala].classList.add('eleccion--correcta');
    else ninguno.classList.add('eleccion--correcta');
    if (elegida === 'ninguno' && item.mala !== null) ninguno.classList.add('eleccion--mal');
    else if (typeof elegida === 'number' && elegida !== item.mala) botones[elegida].classList.add('eleccion--mal');
  };
  const fallo = (error, respuesta, texto, elegida) => {
    marcar(elegida);
    api.responder({
      acierto: false,
      error,
      respuesta,
      html: ({ tt, idioma }) => `${texto(tt)} ${explicaCaza(item, idioma)}`.replace(/\s+/g, ' ').trim(),
      espera: 3200,
    });
  };
  const acierto = elegida => {
    marcar(elegida);
    api.responder({ acierto: true, html: ({ tt, idioma }) => `${tt(TX.caza.bien)} ${explicaCaza(item, idioma)}` });
  };

  ninguno.addEventListener('click', () => {
    if (api.respondido()) return;
    if (item.mala === null) return acierto('ninguno');
    fallo('no-ve-el-error', 'ninguno', tt0 => tt0(TX.caza.falla['no-ve-el-error'])(), 'ninguno');
  });
  botones.forEach((b, i) => b.addEventListener('click', () => {
    if (api.respondido()) return;
    if (item.mala === null) return fallo('ve-un-error-donde-no-lo-hay', `línea ${i + 1}`, tt0 => tt0(TX.caza.falla['ve-un-error-donde-no-lo-hay'])(), i);
    if (i !== item.mala) return fallo('linea-equivocada', `línea ${i + 1}`, tt0 => tt0(TX.caza.falla['linea-equivocada'])(i + 1), i);
    // La línea buena: ahora, el porqué (dos opciones).
    bloquear();
    botones[i].classList.add('eleccion--elegida');
    const caja = contenedor.querySelector('#razones');
    caja.innerHTML = `<p class="instruccion">${tt(TX.caza.por_que)}</p>`;
    const razones = elecciones(caja, {
      clase: 'elecciones elecciones--2',
      opciones: item.razones.map(id => ({ valor: id, html: nombreError(id, api.idioma) })),
      alElegir(id) {
        if (api.respondido()) return;
        razones.marcar([item.error], id);
        botones[i].classList.remove('eleccion--elegida');
        botones[i].classList.add('eleccion--correcta');
        if (id === item.error) return api.responder({ acierto: true, html: ({ tt, idioma }) => `${tt(TX.caza.bien)} ${explicaCaza(item, idioma)}` });
        api.responder({
          acierto: false,
          error: 'razon-equivocada',
          respuesta: id,
          html: ({ tt, idioma }) => `${tt(TX.caza.falla.razon)} ${explicaCaza(item, idioma)}`,
          espera: 3200,
        });
      },
    });
  }));
}

// ─── La práctica ───────────────────────────────────────────────────────────────

const clave = x => `${x.n}/${x.d}`;

arrancar({
  slug: 'suma-resta',
  ejercicios: [
    {
      nombre: TX.mismo.nombre,
      detalle: TX.mismo.detalle,
      introduccion: TX.mismo.introduccion,
      generar: generarMismo,
      clave: item => `${clave(item.a)}${item.op}${clave(item.b)}`,
      montar: montarMismo,
      enunciado: enunciadoMismo,
    },
    {
      nombre: TX.pasos.nombre,
      detalle: TX.pasos.detalle,
      introduccion: TX.pasos.introduccion,
      generar: generarPasos,
      clave: item => item.fracs.map(clave).join(item.ops.join('')),
      montar: montarPasos,
      enunciado: enunciadoPasos,
    },
    {
      nombre: TX.nat.nombre,
      detalle: TX.nat.detalle,
      introduccion: TX.nat.introduccion,
      generar: generarNaturales,
      clave: item => `${item.tipo}:${item.nat}:${clave(item.f)}`,
      montar: montarNat,
      enunciado: enunciadoNat,
    },
    {
      nombre: TX.queda.nombre,
      detalle: TX.queda.detalle,
      introduccion: TX.queda.introduccion,
      generar: generarQueda,
      clave: item => `${item.ctx}:${item.pregunta}:${clave(item.a)}:${clave(item.b)}`,
      montar: montarQueda,
      enunciado: enunciadoQuedaHtml,
    },
    {
      nombre: TX.caza.nombre,
      detalle: TX.caza.detalle,
      introduccion: TX.caza.introduccion,
      generar: generarCaza,
      clave: item => `${clave(item.a)}+${clave(item.b)}:${item.mala}`,
      montar: montarCaza,
      enunciado: enunciadoCaza,
    },
  ],
});
