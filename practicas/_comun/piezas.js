// Piezas de interfaz que se repiten en muchas prácticas, para no escribirlas
// dieciséis veces. Son opcionales: `montar` puede pintar lo que quiera con
// `innerHTML`. Los estilos están en `estilos.css` (mismas clases).
//
//   elecciones   botones de elegir una opción
//   campoNumero  campo para escribir un número (y `leerNumero`, que lo lee)
//   pasos        contador −/valor/+

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
