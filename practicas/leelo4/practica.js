// Práctica «Léelo en inglés» de la unidad 4 (Fractions): emparejar el vocabulario, elegir la
// lectura de una fracción o de una cuenta, entender qué pide un enunciado en inglés y escribir
// con fracciones lo que dice una frase. Contrato de la base en `../_comun/base.js` y
// `../plantilla/practica.js`; la lógica (ítems, distractores, corrección) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { MENOS } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import {
  generarEmparejar, generarLectura, generarQuePide, generarDictado,
  terminoDe, corregirEmparejar, claveEmparejar, claveItem,
  corregirDictado, cuentaDelItem, textoEscrito, leerCampo, nombreDe, PAREJAS_POR_ITEM,
} from './logica.js';

// ─── Ejercicio 1 · Emparejar ─────────────────────────────────────────────────────────────

const enunciadoEmparejar = (item, { tt }) => `<p class="instruccion">${tt(TX.instrucciones.emparejar)}</p>`;

function montarEmparejar(contenedor, item, api) {
  const { tt, esc } = api;
  const pares = {};          // idEn → idEs
  const orden = [];          // idEn en el orden en que se emparejaron (da el número de la pareja)
  let pendienteEn = null, pendienteEs = null;
  let estados = null;        // tras comprobar: idEn → true | false

  contenedor.innerHTML = `
    ${enunciadoEmparejar(item, api)}
    <div class="pares">
      <div class="pares__col" id="col-en" role="group" aria-label="${esc(tt(TX.emparejar.inglés))}"></div>
      <div class="pares__col" id="col-es" role="group" aria-label="${esc(tt(TX.emparejar.español))}"></div>
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const colEn = contenedor.querySelector('#col-en'), colEs = contenedor.querySelector('#col-es');
  const boton = contenedor.querySelector('#comprobar');

  const parejaDeEs = idEs => Object.keys(pares).find(k => pares[k] === idEs) ?? null;
  const numero = idEn => orden.indexOf(idEn) + 1;

  function claseDe(lado, id) {
    const idEn = lado === 'en' ? id : parejaDeEs(id);
    const clases = ['par'];
    if (idEn !== null && pares[idEn] !== undefined) {
      clases.push('par--puesto', `par--c${(numero(idEn) - 1) % PAREJAS_POR_ITEM + 1}`);
      if (estados) clases.push(estados[idEn] ? 'par--bien' : 'par--mal');
    } else if ((lado === 'en' && pendienteEn === id) || (lado === 'es' && pendienteEs === id)) {
      clases.push('par--elegido');
    }
    return clases.join(' ');
  }

  function pintar() {
    const boton1 = (lado, id, texto) => {
      const idEn = lado === 'en' ? id : parejaDeEs(id);
      const n = idEn !== null && pares[idEn] !== undefined ? numero(idEn) : 0;
      const insignia = n ? `<b class="par__n" aria-label="${esc(tt(TX.emparejar.par))} ${n}">${n}</b>` : '';
      return `<button type="button" class="${claseDe(lado, id)}" data-lado="${lado}" data-id="${id}"${estados ? ' disabled' : ''}>${insignia}<span lang="${lado}">${esc(texto)}</span></button>`;
    };
    colEn.innerHTML = item.en.map(id => boton1('en', id, terminoDe(id).en)).join('');
    colEs.innerHTML = item.es.map(id => boton1('es', id, terminoDe(id).es)).join('');
    boton.disabled = Boolean(estados) || Object.keys(pares).length !== PAREJAS_POR_ITEM;
  }

  function unir() {
    if (pendienteEn === null || pendienteEs === null) return;
    pares[pendienteEn] = pendienteEs;
    orden.push(pendienteEn);
    pendienteEn = pendienteEs = null;
  }

  function quitar(idEn) {
    delete pares[idEn];
    orden.splice(orden.indexOf(idEn), 1);
  }

  contenedor.querySelector('.pares').addEventListener('click', ev => {
    const b = ev.target.closest('button.par');
    if (!b || estados || api.respondido()) return;
    const { lado, id } = b.dataset;
    if (lado === 'en') {
      if (pares[id] !== undefined) quitar(id);
      else { pendienteEn = pendienteEn === id ? null : id; unir(); }
    } else {
      const idEn = parejaDeEs(id);
      if (idEn !== null) quitar(idEn);
      else { pendienteEs = pendienteEs === id ? null : id; unir(); }
    }
    pintar();
  });

  boton.addEventListener('click', () => {
    if (api.respondido() || Object.keys(pares).length !== PAREJAS_POR_ITEM) return;
    const { aciertos, fallos } = corregirEmparejar(item, pares);
    estados = Object.fromEntries(item.en.map(id => [id, pares[id] === id]));
    pintar();
    boton.hidden = true;
    const escrito = item.en.map(id => `${terminoDe(id).en} = ${terminoDe(pares[id]).es}`).join('; ');
    api.responder({
      acierto: fallos.length === 0,
      error: fallos[0]?.error,
      respuesta: escrito,
      espera: 2600,
      html: ({ tt, idioma, esc: e }) => {
        const lista = item.en.map(id => `<li><strong lang="en">${e(terminoDe(id).en)}</strong> = <span lang="es">${e(terminoDe(id).es)}</span></li>`).join('');
        const contrarios = fallos.some(f => f.error === 'confunde-contrarios') ? `${nombreDe('confunde-contrarios')[idioma]}. ` : '';
        return `${aciertos < PAREJAS_POR_ITEM ? `${contrarios}` : ''}${tt(TX.emparejar.correctas)}<ul class="lista-pares">${lista}</ul>`;
      },
    });
  });

  pintar();
}

// ─── Ejercicios 2 y 3 · Elegir ───────────────────────────────────────────────────────────

const enunciadoElegir = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones[item.instruccion])}</p>
    ${item.notacion}`;

function montarElegir(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoElegir(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase: 'elecciones elecciones--1',
    opciones: item.opciones.map(o => ({ valor: o.texto, html: o.html ?? api.esc(o.texto) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones.find(o => o.texto === valor);
      const buenas = item.opciones.filter(o => o.correcta).map(o => o.texto);
      botones.marcar(buenas, valor);
      api.responder({
        acierto: elegida.correcta,
        error: elegida.error ?? undefined,
        respuesta: elegida.texto,
        espera: 2200,
        html: ({ tt }) => (elegida.correcta ? '' : `${tt(elegida.por_que)} `) + tt(item.solucion),
      });
    },
  });
}

// ─── Ejercicio 4 · Dictado ───────────────────────────────────────────────────────────────

const enunciadoDictado = (item, { tt, esc }) => `
    <p class="instruccion">${tt(TX.instrucciones.dictado)}</p>
    <p class="texto-en" lang="en">${esc(item.frase)}</p>`;

function hablar(texto) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  const voces = speechSynthesis.getVoices();
  u.voice = voces.find(v => v.lang === 'en-GB') ?? voces.find(v => v.lang?.startsWith('en')) ?? null;
  u.lang = 'en-GB';
  speechSynthesis.speak(u);
}

const OPERACIONES = [['+', '+'], ['-', MENOS], ['*', '·'], [':', ':']];

function montarDictado(contenedor, item, api) {
  const { tt } = api;
  const hayVoz = 'speechSynthesis' in window;
  contenedor.innerHTML = `
    ${enunciadoDictado(item, api)}
    ${hayVoz ? `<button type="button" class="secundario" id="oir">${tt(TX.dictado.escuchar)}</button>` : ''}
    <p class="ayuda-dictado">${tt(TX.dictado.consejo)}</p>
    <div class="dictado">
      <input type="text" class="campo-fraccion" data-k="a" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(tt(TX.dictado.campo))} 1">
      <div class="ops" role="group" aria-label="${api.esc(tt(TX.dictado.operacion))}">
        ${OPERACIONES.map(([v, s]) => `<button type="button" class="op" data-op="${v}" aria-pressed="false">${s}</button>`).join('')}
      </div>
      <input type="text" class="campo-fraccion" data-k="b" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(tt(TX.dictado.campo))} 2">
      <span class="igual" aria-hidden="true">=</span>
      <input type="text" class="campo-fraccion" data-k="c" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(tt(TX.dictado.campo))} 3">
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const campos = Object.fromEntries([...contenedor.querySelectorAll('.campo-fraccion')].map(c => [c.dataset.k, c]));
  const botonesOp = [...contenedor.querySelectorAll('.op')];
  const boton = contenedor.querySelector('#comprobar');
  let op = null;

  contenedor.querySelector('#oir')?.addEventListener('click', () => hablar(item.frase));

  const leido = () => ({ a: leerCampo(campos.a.value), b: leerCampo(campos.b.value), c: leerCampo(campos.c.value) });
  const listo = () => { const l = leido(); return op !== null && l.a && l.b && l.c; };
  const actualizar = () => {
    for (const k of ['a', 'b', 'c']) {
      const malo = campos[k].value.trim() !== '' && leerCampo(campos[k].value) === null;
      campos[k].classList.toggle('campo-fraccion--malo', malo);
      campos[k].setAttribute('aria-invalid', String(malo));
    }
    boton.disabled = !listo();
  };
  Object.values(campos).forEach(c => {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  });
  botonesOp.forEach(b => b.addEventListener('click', () => {
    if (api.respondido()) return;
    op = b.dataset.op;
    botonesOp.forEach(x => { const on = x === b; x.classList.toggle('op--elegido', on); x.setAttribute('aria-pressed', String(on)); });
    actualizar();
  }));

  function comprobar() {
    if (api.respondido() || !listo()) return;
    const escrito = { ...leido(), op };
    const { acierto, error } = corregirDictado(item, escrito);
    Object.values(campos).forEach(c => { c.disabled = true; });
    botonesOp.forEach(b => { b.disabled = true; });
    boton.hidden = true;
    contenedor.querySelector('.dictado').classList.add(acierto ? 'dictado--bien' : 'dictado--mal');
    api.responder({
      acierto,
      error: error ?? undefined,
      respuesta: textoEscrito(escrito),
      espera: 2200,
      html: ({ tt, idioma }) => `${tt(TX.dictado.correcta)} <span class="cuenta">${cuentaDelItem(item)}</span>.${acierto ? '' : ` ${nombreDe(error)[idioma]}.`}`,
    });
  }
  boton.addEventListener('click', comprobar);
  actualizar();
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────

const ejercicio = (i, { generar, montar, enunciado, clave }) => ({
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  generar, clave, montar, enunciado,
});

arrancar({
  slug: 'leelo4',
  ejercicios: [
    ejercicio(0, { generar: generarEmparejar, montar: montarEmparejar, enunciado: enunciadoEmparejar, clave: claveEmparejar }),
    ejercicio(1, { generar: generarLectura, montar: montarElegir, enunciado: enunciadoElegir, clave: claveItem }),
    ejercicio(2, { generar: generarQuePide, montar: montarElegir, enunciado: enunciadoElegir, clave: claveItem }),
    ejercicio(3, { generar: generarDictado, montar: montarDictado, enunciado: enunciadoDictado, clave: claveItem }),
  ],
});
