// Práctica «Sumas y restas con saltos» / «Adding and subtracting with jumps» (PU2, tarea 83).
// Unidad 3, Integers. Todo sin paréntesis. La lógica pura está en `logica.js` y los textos
// (cada uno con sus números) en `textos.js`.
//
// Los ejercicios 2, 3 y 5 se hacen por etapas (elegir el signo o la cuenta, calcular, elegir
// la frase): `flujo` las encadena y, al primer fallo, entrega el ítem como fallado con la
// explicación completa; si todas salen bien, es un acierto.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, campoEntero, derechaAIzquierda } from '../_comun/enteros.js';
import { crearRecta } from '../_comun/recta-enteros.js';
import * as L from './logica.js';
import { NOMBRES, txt } from './textos.js';

const c = s => `<span class="cuenta">${s}</span>`;
const operacion = s => `<div class="operacion">${s}</div>`;

// ─── Etapas ────────────────────────────────────────────────────────────────────

/** Encadena las etapas. Cada una es `(zona, avanzar, fallar)`; `fallar({ html, error, respuesta })`. */
function flujo(contenedor, api, etapas, final) {
  const siguiente = i => {
    if (api.respondido()) return;
    if (i === etapas.length) { api.responder({ acierto: true, html: final, espera: 2200 }); return; }
    const zona = document.createElement('div');
    zona.className = 'saltos-etapa';
    contenedor.append(zona);
    etapas[i](zona, () => siguiente(i + 1), fallo => api.responder({ acierto: false, ...fallo }));
  };
  siguiente(0);
}

/** Una etapa de elegir entre botones. `falla(valor)` da el fallo ({ html, error, respuesta }). */
const eleccion = ({ pregunta, opciones, buena, falla, clase }) => (zona, avanzar, fallar) => {
  zona.innerHTML = pregunta;
  const botones = elecciones(zona, {
    clase, opciones,
    alElegir(valor) {
      botones.marcar([buena], valor);
      if (valor === buena) avanzar(); else fallar(falla(valor));
    },
  });
};

/** Una etapa de escribir un entero y «Comprobar». */
const numero = (api, { pregunta, nombre, buena, falla }) => (zona, avanzar, fallar) => {
  zona.innerHTML = `${pregunta}<div class="saltos-campo"></div><button type="button" class="comprobar">${api.t.comprobar}</button>`;
  const boton = zona.querySelector('.comprobar');
  const comprobar = valor => {
    campo.bloquear();
    boton.hidden = true;
    if (valor === buena) avanzar(); else fallar(falla(valor));
  };
  const campo = campoEntero(zona.querySelector('.saltos-campo'), { nombre, boton, alEnviar: comprobar });
  boton.addEventListener('click', () => { const v = campo.valor(); if (v !== null) comprobar(v); });
};

const lleno = (terminos, texto) => `${texto}${operacion(`${L.textoDe(terminos)} = □`)}`;

// ─── Ejercicio 1: salta en la recta ────────────────────────────────────────────

const enunciadoSalto = (item, { idioma }) => `${txt(idioma).salto.orden(item.terminos)}${operacion(`${L.textoDe(item.terminos)} = □`)}`;

function montarSalto(contenedor, item, api) {
  const [x, y] = item.terminos, r = L.valorDe(item.terminos);
  contenedor.innerHTML = `${enunciadoSalto(item, api)}<div id="recta"></div><button type="button" class="comprobar" disabled>${api.t.comprobar}</button>`;
  const cuenta = contenedor.querySelector('.operacion'), boton = contenedor.querySelector('.comprobar');
  let elegido = null;
  const recta = crearRecta(contenedor.querySelector('#recta'), {
    tipo: 'recta', min: -L.LIMITE_RECTA, max: L.LIMITE_RECTA, paso: 1, numeros: 'todas', nombre: api.tt(NOMBRES[0].nombre),
    puntos: [{ valor: x, etiqueta: fmt(x), clase: 're-punto--hueco' }],
    alTocar(valor) {
      if (elegido !== null) recta.desmarcar(elegido);
      elegido = valor;
      recta.marcar(valor);
      cuenta.textContent = `${L.textoDe(item.terminos)} = ${fmt(valor)}`;
      boton.disabled = false;
    },
  });
  boton.addEventListener('click', () => {
    if (api.respondido() || elegido === null) return;
    const acierto = elegido === r;
    const error = acierto ? null : L.errorDe(item.terminos, elegido);
    recta.bloquear();
    boton.hidden = true;
    recta.marcar(elegido, acierto ? 're-toque--bien' : 're-toque--mal');
    if (!acierto) recta.marcar(r, 're-toque--falta');
    recta.saltar({ desde: x, hasta: r, etiqueta: y < 0 ? `−${-y}` : `+${y}` });
    api.responder({
      acierto, error: error ?? undefined, respuesta: fmt(elegido),
      html: ({ idioma }) => txt(idioma).salto.explica(item.terminos, error),
      espera: 2400,
    });
  });
}

// ─── Ejercicio 2: ¿qué signo tendrá? ───────────────────────────────────────────

const enunciadoSigno = (item, { idioma }) => lleno(item.terminos, txt(idioma).signo.orden);

function montarSigno(contenedor, item, api) {
  const T = txt(api.idioma), terminos = item.terminos, r = L.valorDe(terminos);
  contenedor.innerHTML = enunciadoSigno(item, api);
  const explica = (idioma, error) => `${txt(idioma).signo.razon(terminos)} ${txt(idioma).salto.explica(terminos, error)}`;
  flujo(contenedor, api, [
    eleccion({
      pregunta: '', clase: 'si-no', buena: L.signoDe(terminos),
      opciones: [{ valor: 'positivo', html: T.signo.positivo }, { valor: 'negativo', html: T.signo.negativo }],
      falla: valor => ({ error: 'signo-cambiado', respuesta: valor, html: ({ idioma }) => explica(idioma, null) }),
    }),
    numero(api, {
      pregunta: T.signo.calcula, nombre: T.resultado, buena: r,
      falla: valor => {
        const error = L.errorDe(terminos, valor);
        return { error: error ?? undefined, respuesta: fmt(valor), html: ({ idioma }) => explica(idioma, error) };
      },
    }),
  ], ({ idioma }) => explica(idioma, null));
}

// ─── Ejercicio 3: de izquierda a derecha ───────────────────────────────────────

const enunciadoCadena = (item, { idioma }) => {
  const T = txt(idioma);
  return item.modo === 'numeros' ? lleno(item.terminos, T.cadena.ordenNumeros) : T.cadena.ordenPalabras(item);
};

function montarCadena(contenedor, item, api) {
  const T = txt(api.idioma), terminos = item.terminos, r = L.valorDe(terminos);
  const mal = derechaAIzquierda(L.textoDe(terminos));
  contenedor.innerHTML = enunciadoCadena(item, api);
  const etapas = [];
  if (item.modo === 'palabras') {
    etapas.push(eleccion({
      pregunta: T.cadena.escribe, buena: item.correcta,
      opciones: item.opciones.map((t, i) => ({ valor: i, html: c(t) })),
      falla: valor => ({
        error: 'signo-cambiado', respuesta: item.opciones[valor],
        html: ({ idioma }) => `${txt(idioma).cadena.verbos} ${txt(idioma).cadena.cuentaBuena(terminos)} ${txt(idioma).cadena.pasos(terminos)}.`,
      }),
    }));
  }
  etapas.push(numero(api, {
    pregunta: item.modo === 'palabras' ? `${T.cadena.calcula}${operacion(L.textoDe(terminos) + ' = □')}` : '', nombre: T.resultado, buena: r,
    falla: valor => {
      const error = mal !== null && valor === mal ? 'derecha-a-izquierda' : null;
      return {
        error: error ?? undefined, respuesta: fmt(valor),
        html: ({ idioma }) => `${error ? `${txt(idioma).cadena.derecha(terminos, mal)} ` : ''}${txt(idioma).cadena.pasos(terminos)}.`,
      };
    },
  }));
  flujo(contenedor, api, etapas, ({ idioma }) => `${txt(idioma).cadena.pasos(terminos)}.`);
}

// ─── Ejercicio 4: varios términos ──────────────────────────────────────────────

const enunciadoAgrupa = (item, { idioma }) => txt(idioma).agrupa.orden(item.terminos);
const ficha = v => (v > 0 ? `+${v}` : fmt(v));

function montarAgrupa(contenedor, item, api) {
  const T = txt(api.idioma), terminos = item.terminos;
  const sp = L.valorDe(L.positivosDe(terminos)), sn = L.valorDe(L.negativosDe(terminos)), r = sp + sn;
  contenedor.innerHTML = `${enunciadoAgrupa(item, api)}<div class="saltos-etapa" id="reparto"></div>`;
  const zona = contenedor.querySelector('#reparto');
  // 0: por repartir · 1: positivos · 2: negativos. Cada toque pasa al siguiente.
  const donde = terminos.map(() => 0);
  zona.innerHTML = `
    <div class="saltos-zonas">
      <div class="saltos-zona"><div class="saltos-zona__titulo">${T.agrupa.porRepartir}</div><div class="saltos-zona__fichas" data-z="0"></div></div>
      <div class="saltos-zona saltos-zona--pos"><div class="saltos-zona__titulo">${T.agrupa.positivos}</div><div class="saltos-zona__fichas" data-z="1"></div></div>
      <div class="saltos-zona saltos-zona--neg"><div class="saltos-zona__titulo">${T.agrupa.negativos}</div><div class="saltos-zona__fichas" data-z="2"></div></div>
    </div>
    <button type="button" class="comprobar" disabled>${T.agrupa.reparto}</button>`;
  const boton = zona.querySelector('.comprobar');
  const cajas = [...zona.querySelectorAll('.saltos-zona__fichas')];
  let bloqueado = false;
  const pintar = () => {
    cajas.forEach(caja => { caja.replaceChildren(); });
    terminos.forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ficha saltos-ficha';
      b.textContent = ficha(t);
      b.dataset.i = i;
      b.disabled = bloqueado;
      b.addEventListener('click', () => { donde[i] = (donde[i] + 1) % 3; pintar(); });
      cajas[donde[i]].append(b);
    });
    boton.disabled = bloqueado || donde.includes(0);
  };
  pintar();
  boton.addEventListener('click', () => {
    if (api.respondido() || donde.includes(0)) return;
    bloqueado = true;
    boton.hidden = true;
    pintar();
    const bien = terminos.every((t, i) => donde[i] === (t > 0 ? 1 : 2));
    cajas.forEach(caja => caja.querySelectorAll('.saltos-ficha').forEach(b => {
      const i = Number(b.dataset.i);
      b.classList.add(donde[i] === (terminos[i] > 0 ? 1 : 2) ? 'saltos-ficha--bien' : 'saltos-ficha--mal');
    }));
    if (!bien) {
      api.responder({
        acierto: false, error: 'signo-cambiado', respuesta: donde.join(''),
        html: ({ idioma }) => `${txt(idioma).agrupa.mal(terminos)} ${txt(idioma).agrupa.explica(terminos, item.pareja)}`,
      });
      return;
    }
    sumar();
  });

  function sumar() {
    const etapa = document.createElement('div');
    etapa.className = 'saltos-etapa';
    etapa.innerHTML = `${T.agrupa.sumas}
      <div class="saltos-suma"><span>${T.agrupa.sumaPos}</span><div data-c="0"></div></div>
      <div class="saltos-suma"><span>${T.agrupa.sumaNeg}</span><div data-c="1"></div></div>
      <div class="saltos-suma"><span>${T.agrupa.resultado}</span><div data-c="2"></div></div>
      <button type="button" class="comprobar">${api.t.comprobar}</button>`;
    contenedor.append(etapa);
    const campos = ['0', '1', '2'].map(k => campoEntero(etapa.querySelector(`[data-c="${k}"]`), { nombre: k === '0' ? T.agrupa.sumaPos : k === '1' ? T.agrupa.sumaNeg : T.agrupa.resultado }));
    const b2 = etapa.querySelector('.comprobar');
    const comprobar = () => {
      if (api.respondido()) return;
      const vs = campos.map(k => k.valor());
      const vacio = vs.indexOf(null);
      if (vacio >= 0) { campos[vacio].elemento.focus(); return; }
      campos.forEach(k => k.bloquear());
      b2.hidden = true;
      const [vp, vn, vr] = vs;
      if (vp === sp && vn === sn && vr === r) { api.responder({ acierto: true, html: ({ idioma }) => txt(idioma).agrupa.explica(terminos, item.pareja), espera: 2600 }); return; }
      let error, aviso = '';
      if (vp !== sp) aviso = 'pos';
      else if (vn !== sn) { aviso = 'neg'; if (vn === -sn) error = 'olvida-el-signo'; }
      else error = L.erroresDeAgrupar(sp, sn).find(e => e.valor === vr)?.error;
      api.responder({
        acierto: false, error, respuesta: vs.map(fmt).join('; '),
        html: ({ idioma }) => `${aviso ? `${txt(idioma).agrupa.sumaMal(aviso, aviso === 'pos' ? sp : sn)} ` : ''}${txt(idioma).agrupa.explica(terminos, item.pareja)}`,
      });
    };
    b2.addEventListener('click', comprobar);
    etapa.querySelectorAll('input').forEach(i => i.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); }));
  }
}

// ─── Ejercicio 5: varios movimientos ───────────────────────────────────────────

const enunciadoProblema = (item, { idioma }) => txt(idioma).problema.enunciado(item);

function montarProblema(contenedor, item, api) {
  const T = txt(api.idioma), terminos = item.terminos, r = L.valorDe(terminos);
  const mal = derechaAIzquierda(L.textoDe(terminos));
  contenedor.innerHTML = enunciadoProblema(item, api);
  const buena = idioma => `${txt(idioma).problema.cuentaBuena(terminos)} ${txt(idioma).problema.fin(item.contexto, r)}`;
  flujo(contenedor, api, [
    eleccion({
      pregunta: T.problema.cuenta, buena: item.correcta,
      opciones: item.opciones.map((t, i) => ({ valor: i, html: c(t) })),
      falla: valor => ({ error: 'signo-cambiado', respuesta: item.opciones[valor], html: ({ idioma }) => `${txt(idioma).problema.verbos} ${buena(idioma)}` }),
    }),
    numero(api, {
      pregunta: `${T.problema.calcula}${operacion(`${L.textoDe(terminos)} = □`)}`, nombre: T.resultado, buena: r,
      falla: valor => {
        const error = valor === -r ? 'signo-cambiado' : mal !== null && valor === mal ? 'derecha-a-izquierda' : null;
        return {
          error: error ?? undefined, respuesta: fmt(valor),
          html: ({ idioma }) => `${error === 'derecha-a-izquierda' ? `${txt(idioma).cadena.derecha(terminos, mal)} ` : ''}${buena(idioma)}`,
        };
      },
    }),
    eleccion({
      pregunta: T.problema.frase, buena: item.frase,
      opciones: item.frases.map((v, i) => ({ valor: i, html: T.problema.fin(item.contexto, v) })),
      falla: valor => ({ error: item.erroresFrase[valor] ?? undefined, respuesta: fmt(item.frases[valor]), html: ({ idioma }) => buena(idioma) }),
    }),
  ], ({ idioma }) => buena(idioma));
}

// ─── La práctica ───────────────────────────────────────────────────────────────

const claveTerminos = item => `${item.contexto ?? ''}${item.modo ?? ''}${item.terminos.join(',')}`;

arrancar({
  slug: 'saltos',
  ejercicios: [
    { ...NOMBRES[0], introduccion: intro(0), generar: L.generarSalto, clave: claveTerminos, montar: montarSalto, enunciado: enunciadoSalto },
    { ...NOMBRES[1], introduccion: intro(1), generar: L.generarSigno, clave: claveTerminos, montar: montarSigno, enunciado: enunciadoSigno },
    { ...NOMBRES[2], introduccion: intro(2), generar: L.generarCadena, clave: claveTerminos, montar: montarCadena, enunciado: enunciadoCadena },
    { ...NOMBRES[3], introduccion: intro(3), generar: L.generarTerminos, clave: claveTerminos, montar: montarAgrupa, enunciado: enunciadoAgrupa },
    { ...NOMBRES[4], introduccion: intro(4), generar: L.generarProblema, clave: claveTerminos, montar: montarProblema, enunciado: enunciadoProblema },
  ],
});

function intro(i) {
  return { es: txt('es').intro[i], en: txt('en').intro[i] };
}
