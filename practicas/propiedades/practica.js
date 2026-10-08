// Propiedades de las potencias y última cifra (ampliación de la unidad 1).
// Tres ejercicios: juntar potencias de la misma base, potencia de potencia y
// cadenas, y ★ la última cifra de una potencia.

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarJuntar, generarPotencias, generarUltima,
  razonNoJunta, exponenteJunto, juntar, terminado, efectivo,
  posicionEnCiclo, CELDAS,
} from './logica.js';

const simbolo = (op, idioma) => (op === ':' && idioma === 'en' ? '÷' : op);

/** HTML de un término: b^e o (b^e)^k. */
function pot(t) {
  const { base, exp, k = 1 } = t;
  return k > 1 ? `(${base}<sup>${exp}</sup>)<sup>${k}</sup>` : `${base}<sup>${exp}</sup>`;
}

/** Los términos con sus operadores como una cuenta que no se parte. */
function cuentaDe(terminos, ops, idioma) {
  const trozos = terminos.map(pot);
  return `<span class="cuenta">${trozos.map((t, i) => (i ? `${simbolo(ops[i - 1], idioma)} ${t}` : t)).join(' ')}</span>`;
}

/** Una potencia desarrollada: 2 · 2 · 2 (solo si es corta). */
const desarrollo = (base, exp) => Array(exp).fill(base).join(' · ');

// ─── Ejercicio 1: junta las potencias ──────────────────────────────────────────

function montarJuntar(contenedor, item, api) {
  const { tt, idioma } = api;
  let terminos = item.terminos.map(t => ({ ...t }));
  let ops = [...item.operadores];
  let elegida = null;      // índice del primer término tocado
  let abierto = null;      // índice del par que se está juntando
  const pasosHechos = [];  // las líneas de la explicación

  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.juntar.instruccion)}</p>
    <div class="cadena" id="cadena"></div>
    <p class="aviso-prop" id="aviso" aria-live="polite"></p>
    <div class="juntador" id="juntador" hidden></div>`;
  const cadena = contenedor.querySelector('#cadena');
  const aviso = contenedor.querySelector('#aviso');
  const juntador = contenedor.querySelector('#juntador');
  const decir = (texto, mal = false) => { aviso.innerHTML = texto; aviso.classList.toggle('aviso-prop--mal', mal); };

  function pintar(bloqueada = false) {
    cadena.innerHTML = '';
    terminos.forEach((t, i) => {
      if (i) {
        const op = document.createElement('span');
        op.className = 'op';
        op.textContent = simbolo(ops[i - 1], idioma);
        cadena.append(op);
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'termino';
      b.innerHTML = pot(t);
      b.disabled = bloqueada || abierto !== null;
      if (i === elegida || (abierto !== null && (i === abierto || i === abierto + 1))) b.classList.add('termino--elegida');
      b.addEventListener('click', () => tocar(i));
      cadena.append(b);
    });
  }

  function tocar(i) {
    if (api.respondido() || abierto !== null) return;
    if (elegida === null || elegida === i || Math.abs(elegida - i) !== 1) {
      elegida = elegida === i ? null : i;
      decir(elegida === null ? '' : tt(TX.juntar.primera));
      return pintar();
    }
    const par = Math.min(elegida, i);
    elegida = null;
    const razon = razonNoJunta(terminos, ops, par);
    if (razon === 'bases') {
      decir(tt(TX.juntar.bases)(pot(terminos[par]), pot(terminos[par + 1])), true);
      return pintar();
    }
    if (razon === 'orden') { decir(tt(TX.juntar.orden), true); return pintar(); }
    decir('');
    abrirJuntador(par);
  }

  function abrirJuntador(par) {
    abierto = par;
    const a = terminos[par], b = terminos[par + 1], op = ops[par];
    juntador.hidden = false;
    juntador.innerHTML = `
      <span class="juntador__cuenta">${pot(a)} ${simbolo(op, idioma)} ${pot(b)} =</span>
      <span id="paso"></span>
      <div class="juntador__botones">
        <button type="button" id="juntar">${tt(TX.juntar.juntarlas)}</button>
        <button type="button" class="secundario" id="cancelar">${tt(TX.juntar.cancelar)}</button>
      </div>`;
    const control = pasos(juntador.querySelector('#paso'), {
      valor: 0, min: 0, max: 30, nombre: tt(TX.juntar.exponente),
      pinta: v => `${a.base}<sup>${v === 0 ? '□' : v}</sup>`,
    });
    juntador.querySelector('#cancelar').addEventListener('click', () => {
      abierto = null; juntador.hidden = true; juntador.innerHTML = ''; pintar();
    });
    juntador.querySelector('#juntar').addEventListener('click', () => {
      if (api.respondido()) return;
      const mio = control.valor();
      const bueno = exponenteJunto(terminos, ops, par);
      control.bloquear();
      const x = TX.juntar;
      const suma = op === '·';
      const ea = efectivo(a), eb = efectivo(b);
      const linea = suma
        ? `<span class="cuenta">${pot(a)} · ${pot(b)} = ${a.base}<sup>${bueno}</sup></span>: ${tt(x.suma)(ea, eb, bueno)}`
        : `<span class="cuenta">${pot(a)} ${simbolo(':', idioma)} ${pot(b)} = ${a.base}<sup>${bueno}</sup></span>: ${tt(x.resta)(ea, eb, bueno)}`;
      if (mio !== bueno) {
        let sugerencia = '';
        if (suma && mio === ea * eb) sugerencia = ` ${tt(x.no_multiplica)}`;
        if (!suma && eb !== 0 && mio * eb === ea) sugerencia = ` ${tt(x.no_divide)}`;
        pintar(true);
        juntador.querySelector('.juntador__botones').hidden = true;
        return api.responder({ acierto: false, html: `${tt(x.correcta)} ${linea}.${sugerencia}` });
      }
      pasosHechos.push(linea);
      ({ terminos, ops } = juntar(terminos, ops, par, bueno));
      abierto = null; juntador.hidden = true; juntador.innerHTML = '';
      if (terminado(terminos, ops)) {
        pintar(true);
        const final = cuentaDe(terminos, ops, idioma);
        const nota = terminos.length > 1 ? ` ${tt(x.ajena_nota)}` : '';
        return api.responder({
          acierto: true,
          html: `${pasosHechos.join('.<br>')}.<br>${tt(x.en_total)} ${final}.${nota}`,
          espera: 2600,
        });
      }
      decir('');
      pintar();
    });
    pintar();
  }

  pintar();
}

// ─── Ejercicio 2: potencia de potencia y cadenas ────────────────────────────────

function montarPotencias(contenedor, item, api) {
  const { tt, idioma } = api;
  const x = TX.potencia;
  const terminos = item.terminos, ops = item.operadores, base = item.base;
  const esPotencia = item.tipo === 'potencia';
  const t0 = terminos[0];

  contenedor.innerHTML = `
    <p class="instruccion">${tt(esPotencia ? x.instruccion_potencia : x.instruccion_cadena)}</p>
    <div class="cadena" id="cadena"></div>
    <div class="centro" id="paso"></div>
    <button type="button" class="comprobar" id="comprobar">${tt(x.comprobar)}</button>`;
  contenedor.querySelector('#cadena').innerHTML = `<span class="parte">${terminos.map((t, i) => (i ? `${simbolo(ops[i - 1], idioma)} ${pot(t)}` : pot(t))).join(' ')} =</span>`;
  const control = pasos(contenedor.querySelector('#paso'), {
    valor: 0, min: 0, max: 36, nombre: tt(x.exponente),
    pinta: v => `${base}<sup>${v === 0 ? '□' : v}</sup>`,
  });

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const mio = control.valor();
    control.bloquear();
    ev.target.hidden = true;
    const bueno = item.solucion;
    let html;
    if (esPotencia) {
      const m = t0.exp, k = t0.k;
      const des = Array(k).fill(`${base}<sup>${m}</sup>`).join(' · ');
      html = `<span class="cuenta">${tt(x.potencia_cuenta)(base, m, k, des, bueno)}</span>`;
      if (mio !== bueno && mio === m + k) html += ` ${tt(x.sumaste)(m, k)}`;
    } else {
      // Cuenta de exponentes: 3 · 2 + 4 − 3 (los paréntesis se resuelven antes).
      const cuentaExp = terminos.map((t, i) => {
        const e = t.k > 1 ? `${t.exp} · ${t.k}` : `${t.exp}`;
        return i ? `${ops[i - 1] === '·' ? '+' : '−'} ${e}` : e;
      }).join(' ');
      const original = terminos.map((t, i) => (i ? `${simbolo(ops[i - 1], idioma)} ${pot(t)}` : pot(t))).join(' ');
      html = `<span class="cuenta">${tt(x.cadena_cuenta)(original, cuentaExp, bueno, base)}</span>`;
    }
    if (mio !== bueno) html = `${tt(x.tu_respuesta)} ${base}<sup>${mio || '□'}</sup> ${tt(x.no_da)} ${html}`;
    api.responder({ acierto: mio === bueno, html, espera: 2400 });
  });
}

// ─── Ejercicio 3: ★ la última cifra ─────────────────────────────────────────────

function montarUltima(contenedor, item, api) {
  const { tt } = api;
  const x = TX.ultima;
  const { base, exponente } = item;
  const mis = Array(CELDAS).fill(null);   // cifras que ha puesto el alumno
  let celda = 0;                          // celda seleccionada
  let fallosTabla = 0;                    // veces que comprobó la tabla y estaba mal
  let cicloElegido = null;
  let cifraElegida = null;

  contenedor.innerHTML = `
    <p class="instruccion">${tt(x.pregunta)(base, exponente)}</p>
    <p class="ultima__titulo">${tt(x.tabla_titulo)}</p>
    <div class="rejilla ultima__tabla" id="tabla"></div>
    <div id="teclado"></div>
    <p class="aviso-prop aviso-prop--mal" id="aviso" aria-live="polite"></p>
    <button type="button" class="comprobar" id="comprobar-tabla" disabled>${tt(x.comprobar_tabla)}</button>
    <div id="fase2" hidden></div>`;
  const tabla = contenedor.querySelector('#tabla');
  const aviso = contenedor.querySelector('#aviso');
  const botonTabla = contenedor.querySelector('#comprobar-tabla');
  let tablaBloqueada = false;

  function pintarTabla(malas = []) {
    tabla.innerHTML = '';
    mis.forEach((d, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rejilla__celda';
      if (i === celda && !tablaBloqueada) b.classList.add('rejilla__celda--elegida');
      if (malas.includes(i)) b.classList.add('rejilla__celda--mal');
      if (tablaBloqueada) b.classList.add('rejilla__celda--bien');
      b.disabled = tablaBloqueada;
      b.innerHTML = `<span>${d === null ? '□' : d}</span><small>${base}<sup>${i + 1}</sup></small>`;
      b.addEventListener('click', () => { celda = i; pintarTabla(); });
      tabla.append(b);
    });
    botonTabla.disabled = tablaBloqueada || mis.some(d => d === null);
  }

  function ponerDigito(d) {
    if (tablaBloqueada) return;
    mis[celda] = d;
    aviso.textContent = '';
    const siguiente = mis.findIndex((v, i) => i > celda && v === null);
    if (siguiente >= 0) celda = siguiente;
    pintarTabla();
  }

  // Teclado de la tabla: del 0 al 9.
  const teclado = contenedor.querySelector('#teclado');
  elecciones(teclado, {
    clase: 'ultima__teclado',
    opciones: Array.from({ length: 10 }, (_, d) => ({ valor: d, html: `${d}` })),
    alElegir: d => ponerDigito(Number(d)),
  });

  botonTabla.addEventListener('click', () => {
    if (api.respondido() || tablaBloqueada) return;
    const malas = mis.map((d, i) => (d === item.tabla[i] ? -1 : i)).filter(i => i >= 0);
    if (malas.length) {
      fallosTabla++;
      aviso.textContent = tt(x.tabla_mal);
      return pintarTabla(malas);
    }
    tablaBloqueada = true;
    aviso.textContent = '';
    teclado.hidden = true;
    botonTabla.hidden = true;
    pintarTabla();
    abrirFase2();
  });

  function abrirFase2() {
    const fase2 = contenedor.querySelector('#fase2');
    fase2.hidden = false;
    fase2.innerHTML = `
      <p class="ultima__preg">${tt(x.ciclo_pregunta)}</p>
      <div id="ciclo"></div>
      <p class="ultima__preg">${tt(x.cifra_pregunta)(base, exponente)}</p>
      <div id="cifra"></div>
      <button type="button" class="comprobar" id="comprobar" disabled>${tt(x.comprobar)}</button>`;
    const boton = fase2.querySelector('#comprobar');
    const habilitar = () => { boton.disabled = cicloElegido === null || cifraElegida === null; };
    const marcarElegida = (caja, valor) => {
      caja.elemento.querySelectorAll('.eleccion').forEach((b, i) => b.classList.toggle('eleccion--elegida', i === valor));
    };
    const cajaCiclo = elecciones(fase2.querySelector('#ciclo'), {
      clase: 'ultima__teclado ultima__teclado--ciclo',
      opciones: [1, 2, 3, 4, 5, 6].map(v => ({ valor: v, html: `${v}` })),
      alElegir: v => { cicloElegido = Number(v); marcarElegida(cajaCiclo, cicloElegido - 1); habilitar(); },
    });
    const cajaCifra = elecciones(fase2.querySelector('#cifra'), {
      clase: 'ultima__teclado',
      opciones: Array.from({ length: 10 }, (_, d) => ({ valor: d, html: `${d}` })),
      alElegir: v => { cifraElegida = Number(v); marcarElegida(cajaCifra, cifraElegida); habilitar(); },
    });
    boton.addEventListener('click', () => {
      if (api.respondido()) return;
      boton.hidden = true;
      cajaCiclo.marcar([item.ciclo], cicloElegido);
      cajaCifra.marcar([item.solucion], cifraElegida);
      const L = item.ciclo, d = item.solucion;
      let razon;
      if (L === 1) razon = tt(x.explica_uno)(base, exponente, d);
      else if (exponente % L === 0) razon = tt(x.explica_multiplo)(base, exponente, L, exponente / L, d);
      else razon = tt(x.explica_resto)(base, exponente, L, Math.floor(exponente / L), posicionEnCiclo(exponente, L), d);
      const acierto = cicloElegido === L && cifraElegida === d;
      const fallos = [];
      if (cicloElegido !== L) fallos.push(tt(x.ciclo_mal)(L));
      if (cifraElegida !== d) fallos.push(tt(x.cifra_mal)(d));
      api.responder({
        acierto,
        html: `${acierto ? '' : `${fallos.join(' ')} `}${razon}`,
        pistas: fallosTabla,
        espera: 3200,
      });
    });
  }

  pintarTabla();
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'propiedades',
  ejercicios: [
    {
      nombre: TX.juntar.nombre,
      detalle: TX.juntar.detalle,
      introduccion: TX.juntar.introduccion,
      generar: generarJuntar,
      montar: montarJuntar,
    },
    {
      nombre: TX.potencia.nombre,
      detalle: TX.potencia.detalle,
      introduccion: TX.potencia.introduccion,
      generar: generarPotencias,
      montar: montarPotencias,
    },
    {
      nombre: TX.ultima.nombre,
      detalle: TX.ultima.detalle,
      introduccion: TX.ultima.introduccion,
      objetivo: 6,
      generar: generarUltima,
      clave: item => `${item.base}^${item.exponente}`,
      montar: montarUltima,
    },
  ],
});
