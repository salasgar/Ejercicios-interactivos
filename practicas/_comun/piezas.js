// Piezas de interfaz que se repiten en muchas prácticas, para no escribirlas
// dieciséis veces. Son opcionales: `montar` puede pintar lo que quiera con
// `innerHTML`. Los estilos están en `estilos.css` (mismas clases).
//
//   elecciones   botones de elegir una opción
//   campoNumero  campo para escribir un número (y `leerNumero`, que lo lee)
//   pasos        contador −/valor/+
//   claseCorreccion  clase de un botón de número al corregir (cuatro estados)
//   pegarSignos  (lo usa la base, no las prácticas) mete dentro de cada cuenta
//                el signo que la sigue o la precede, para que no se quede solo

/**
 * Botones de elegir una opción.
 *
 *   const botones = elecciones(contenedor, {
 *     opciones: [{ valor: 'primo', html: 'Primo' }, { valor: 'compuesto', html: 'Compuesto' }],
 *     clase: 'si-no',                    // opcional: dos botones grandes en fila
 *     alElegir(valor) { … botones.marcar(['compuesto'], valor); api.responder(…); },
 *   });
 *
 * `marcar(correctas, elegida)` bloquea los botones y pinta de verde las
 * correctas y de rojo la elegida si no lo era. Los valores se comparan como texto.
 */
export function elecciones(contenedor, { opciones, alElegir, clase = '' }) {
  const caja = document.createElement('div');
  caja.className = clase || `elecciones elecciones--${opciones.length}`;
  caja.innerHTML = opciones.map((o, i) => `<button type="button" class="eleccion" data-i="${i}">${o.html}</button>`).join('');
  const botones = [...caja.querySelectorAll('.eleccion')];
  botones.forEach((b, i) => b.addEventListener('click', () => alElegir(opciones[i].valor)));
  contenedor.append(caja);
  return {
    elemento: caja,
    marcar(correctas, elegida) {
      const buenas = correctas.map(String);
      botones.forEach((b, i) => {
        const valor = String(opciones[i].valor);
        b.disabled = true;
        if (buenas.includes(valor)) b.classList.add('eleccion--correcta');
        else if (valor === String(elegida)) b.classList.add('eleccion--mal');
      });
    },
  };
}

/**
 * Lee un número natural escrito a mano. Admite los separadores de millares que
 * se enseñan: punto o espacio («4.730», «4 730», «12.345.678»), y en inglés
 * también la coma («4,730»), siempre en grupos de tres cifras. Devuelve el
 * número, o `null` si el texto está vacío o no es un número así («4.73»,
 * «4,730» en español, «12a»). Puro: no necesita el navegador.
 */
export function leerNumero(texto, idioma = 'es') {
  const t = String(texto ?? '').trim().replace(/[\s  ]+/g, ' ');
  const separadores = idioma === 'en' ? '[. ,]' : '[. ]';
  if (!/^\d+$/.test(t) && !new RegExp(`^\\d{1,3}(${separadores}\\d{3})+$`).test(t)) return null;
  const n = Number(t.replace(/\D/g, ''));
  return Number.isSafeInteger(n) ? n : null;
}

/**
 * Campo para escribir un número natural (en vez de `<input type="number">`):
 * en el móvil saca el teclado de cifras; acepta los puntos y espacios de
 * millares (ver `leerNumero`) y no deja comprobar mientras está vacío o no es
 * un número.
 *
 *   const campo = campoNumero(contenedor, {
 *     nombre: 'Cociente',              // para el lector de pantalla
 *     cifras: 6,                       // ancho del campo (por defecto 6)
 *     idioma: api.idioma,              // en inglés vale también «4,730»
 *     boton,                           // opcional: el «Comprobar», que se desactiva mientras no haya número
 *     alEnviar(valor) { … },           // opcional: Intro con un número válido
 *   });
 *   campo.valor();     // el número, o null
 *   campo.bloquear();  // tras responder (bloquea también el botón)
 *
 * Los estilos son `.campo-numero` (y `.campo-numero--malo` mientras lo escrito
 * no es un número), en `estilos.css`.
 */
export function campoNumero(contenedor, { nombre = '', cifras = 6, idioma = 'es', boton = null, alEnviar = null } = {}) {
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.inputMode = 'numeric';
  campo.className = 'campo-numero';
  campo.autocomplete = 'off';
  campo.spellcheck = false;
  campo.setAttribute('autocorrect', 'off');
  campo.setAttribute('enterkeyhint', 'done');
  campo.style.setProperty('--cifras', cifras);
  if (nombre) campo.setAttribute('aria-label', nombre);
  let bloqueado = false;
  const valor = () => leerNumero(campo.value, idioma);
  const actualizar = () => {
    const v = valor();
    campo.classList.toggle('campo-numero--malo', v === null && campo.value.trim() !== '');
    campo.setAttribute('aria-invalid', String(v === null && campo.value.trim() !== ''));
    if (boton) boton.disabled = bloqueado || v === null;
  };
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    if (!bloqueado && valor() !== null && alEnviar) alEnviar(valor());
  });
  contenedor.append(campo);
  actualizar();
  return {
    elemento: campo,
    valor,
    bloquear() { bloqueado = true; campo.disabled = true; actualizar(); },
  };
}

/**
 * Contador −/valor/+ (por ejemplo, el exponente de un primo).
 *
 *   const paso = pasos(contenedor, { valor: 0, min: 0, max: 6, nombre: 'Exponente de 2',
 *     pinta: v => `2<sup>${v}</sup>`, alCambiar: v => … });
 *   paso.valor();  paso.bloquear();
 *
 * `pinta` devuelve el HTML que se enseña entre los dos botones (por defecto, el
 * número). Con el valor en `min` la pieza lleva la clase `pasos--vacio`.
 */
export function pasos(contenedor, { valor = 0, min = 0, max = 9, nombre = '', pinta = v => `${v}`, alCambiar = () => {} } = {}) {
  const caja = document.createElement('div');
  caja.className = 'pasos';
  caja.setAttribute('role', 'group');
  if (nombre) caja.setAttribute('aria-label', nombre);
  caja.innerHTML = `
    <button type="button" class="pasos__menos" aria-label="−">−</button>
    <output class="pasos__valor"></output>
    <button type="button" class="pasos__mas" aria-label="+">+</button>`;
  const menos = caja.querySelector('.pasos__menos'), mas = caja.querySelector('.pasos__mas'), salida = caja.querySelector('.pasos__valor');
  let bloqueado = false;
  const pintar = () => {
    salida.innerHTML = pinta(valor);
    caja.classList.toggle('pasos--vacio', valor === min);
    menos.disabled = bloqueado || valor <= min;
    mas.disabled = bloqueado || valor >= max;
  };
  const cambiar = d => { valor = Math.max(min, Math.min(max, valor + d)); pintar(); alCambiar(valor); };
  menos.addEventListener('click', () => cambiar(-1));
  mas.addEventListener('click', () => cambiar(1));
  pintar();
  contenedor.append(caja);
  return {
    elemento: caja,
    valor: () => valor,
    bloquear() { bloqueado = true; pintar(); },
  };
}

/**
 * Clase de un botón de número al corregir (cuatro estados, iguales en toda la app):
 * pulsado y correcto → 'bien' (verde relleno); pulsado y no → 'mal' (rojo tachado);
 * no pulsado y correcto → 'falta' (borde verde de puntos); ni lo uno ni lo otro → ''.
 */
export function claseCorreccion(pulsado, correcto) {
  if (pulsado) return correcto ? 'bien' : 'mal';
  return correcto ? 'falta' : '';
}

/** Signos que no pueden quedarse solos al principio de un renglón detrás de una cuenta, ni al final delante de ella. */
export const SIGNOS_CIERRE = '.,;:)»”!?…';
export const SIGNOS_APERTURA = '(«“¿¡';
const SIN_CIERRE = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/** Etiquetas en línea que pueden envolver una cuenta sin que el signo deje de ir con ella: `<strong>…cuenta…</strong>.` */
const ABRE_EN_LINEA = /<(?:strong|b|em|i|u|span|mark|small)\b[^>]*>$/i;
const CIERRA_EN_LINEA = /^<\/(?:strong|b|em|i|u|span|mark|small)>/i;

/** Los elementos del HTML con sus posiciones y clases (solo lo que hace falta aquí; no es un analizador completo). */
function elementosDe(html) {
  const etiqueta = /<(\/?)([a-zA-Z][\w-]*)\b([^>]*)>/g;
  const pila = [];
  const lista = [];
  let m;
  while ((m = etiqueta.exec(html))) {
    const [todo, cierra, nombre, atributos] = m;
    const tag = nombre.toLowerCase();
    if (!cierra) {
      if (SIN_CIERRE.has(tag) || atributos.trimEnd().endsWith('/')) continue;
      const clase = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(atributos);
      const clases = (clase?.[1] ?? clase?.[2] ?? '').split(/\s+/);
      const cuenta = clases.includes('cuenta') || clases.includes('cuenta-frac');
      pila.push({
        tag, clases, cuenta, dentroDeCuenta: pila.some(e => e.cuenta), dentroDeFrac: pila.some(e => e.clases.includes('frac')),
        padre: pila.at(-1)?.clases ?? [], inicio: m.index, finApertura: m.index + todo.length,
      });
    } else {
      let i = pila.length - 1;
      while (i >= 0 && pila[i].tag !== tag) i--;
      if (i < 0) continue;
      const [abierta] = pila.splice(i);
      lista.push({ ...abierta, inicioCierre: m.index, fin: m.index + todo.length });
    }
  }
  return lista.sort((x, y) => x.inicio - y.inicio);
}

/**
 * Para cada elemento elegido, quita de donde están los signos que lo siguen y lo preceden (saltando las etiquetas en
 * línea que lo envuelven: «<strong>…</strong>.») y deja que `colocar(e, antes, despues)` pinte el elemento con ellos.
 * Las etiquetas solo se saltan si hay signos al otro lado; sin signos, el elemento queda igual.
 */
function moverSignos(html, elegidos, colocar) {
  let salida = '';
  let pos = 0;
  for (const e of elegidos) {
    if (e.inicio < pos) continue;
    let a1 = e.inicio;
    for (let m; a1 > pos && (m = ABRE_EN_LINEA.exec(html.slice(pos, a1)));) a1 -= m[0].length;
    let a0 = a1;
    while (a0 > pos && SIGNOS_APERTURA.includes(html[a0 - 1])) a0--;
    if (a0 === a1) a0 = a1 = e.inicio;
    let z1 = e.fin;
    for (let m; (m = CIERRA_EN_LINEA.exec(html.slice(z1)));) z1 += m[0].length;
    let z2 = z1;
    while (z2 < html.length && SIGNOS_CIERRE.includes(html[z2])) z2++;
    if (z2 === z1) z1 = z2 = e.fin;
    if (a0 === a1 && z1 === z2) continue;
    salida += html.slice(pos, a0) + html.slice(a1, e.inicio) + colocar(e, html.slice(a0, a1), html.slice(z1, z2)) + html.slice(e.fin, z1);
    pos = z2;
  }
  return salida + html.slice(pos);
}

/**
 * 1. Cada cuenta (la más externa) se lleva dentro sus signos, en un `.signo-cuenta` (sin negrita). Si la cuenta empieza
 *    o acaba en un elemento (una fracción), el signo entra sin envoltorio, para que el paso 2 lo vea pegado a ella.
 */
function meterEnCuentas(html) {
  const signo = (s, crudo) => (!s || crudo ? s : `<span class="signo-cuenta">${s}</span>`);
  return moverSignos(html, elementosDe(html).filter(e => e.cuenta && !e.dentroDeCuenta), (e, antes, despues) => {
    const dentro = html.slice(e.finApertura, e.inicioCierre);
    return html.slice(e.inicio, e.finApertura) + signo(antes, dentro.startsWith('<')) + dentro
      + signo(despues, dentro.endsWith('>')) + html.slice(e.inicioCierre, e.fin);
  });
}

/**
 * 2. `.frac` es `inline-flex` y no admite el signo dentro (es una columna): la fracción y su signo van juntos en un
 *    `.frac-y-signo` (`inline-block`, como la cuenta). Medido el 14-11: un U+2060 entre los dos no basta en Chrome.
 */
function juntarFracciones(html) {
  const fracciones = elementosDe(html).filter(e => e.clases.includes('frac') && !e.dentroDeFrac && !e.padre.includes('frac-y-signo'));
  return moverSignos(html, fracciones, (e, antes, despues) => `<span class="frac-y-signo">${antes}${html.slice(e.inicio, e.fin)}${despues}</span>`);
}

/**
 * Tarea 197: que el signo de puntuación no se quede solo al principio de un
 * renglón detrás de una cuenta (ni al final, delante de ella).
 *
 * Por qué pasaba: `.cuenta` y `.cuenta-frac` son bloques en línea
 * (`inline-block`, de la 37, para que una cuenta larga no ensanche la página a
 * 375 px), y `.frac` es `inline-flex`; el navegador puede partir el renglón
 * justo detrás de un bloque, así que el punto se iba solo al renglón siguiente.
 *
 * Qué hace, sobre el HTML como texto (la base lo aplica a lo que pinta en el
 * feedback, la tarjeta del «No lo sé» y la traducción; ninguna práctica cambia):
 *  1. mete dentro de cada `.cuenta` / `.cuenta-frac` los signos que la siguen
 *     (`. , ; : ) » ” ! ? …`) y los que la preceden (`( « “ ¿ ¡`), también si
 *     entre medias hay un `</strong>` o un `<strong>`, cada tramo en un
 *     `<span class="signo-cuenta">` (sin negrita: estilos.css). Dentro del
 *     bloque el signo viaja con la cuenta, sin `nowrap`;
 *  2. junta cada `.frac` (dentro o fuera de una cuenta) con el signo pegado a
 *     ella en un `<span class="frac-y-signo">` (`inline-block`): la fracción es
 *     una columna y el signo no puede ir dentro.
 * Solo toca las cuentas más externas. HTML sin cuentas ni fracciones sale igual,
 * y es idempotente: lo ya pegado no queda al lado de la cuenta ni de la fracción.
 */
export function pegarSignos(html) {
  if (typeof html !== 'string' || !/cuenta|frac/.test(html)) return html;
  return juntarFracciones(meterEnCuentas(html));
}
