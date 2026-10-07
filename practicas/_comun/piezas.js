// Piezas de interfaz que se repiten en muchas prácticas, para no escribirlas
// dieciséis veces. Son opcionales: `montar` puede pintar lo que quiera con
// `innerHTML`. Los estilos están en `estilos.css` (mismas clases).

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
