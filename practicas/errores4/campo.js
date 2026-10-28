// Campo de «Caza el error» de la unidad 4 (PU2, tarea 107): la fracción escrita en dos casillas
// (numerador sobre denominador), con un botón «+/−» para el signo. Copia reducida del
// `campoFraccion` de `suma-resta/campo.js` (la ficha pide copiar y no tocar otras prácticas).
// Solo DOM; los números se leen con `leerNumero` de `_comun/piezas.js`.

import { leerNumero } from '../_comun/piezas.js';
import { fraccion, htmlRaya, MENOS } from '../_comun/fracciones.js';

function casilla(nombre, cifras) {
  const c = document.createElement('input');
  c.type = 'text';
  c.inputMode = 'numeric';
  c.className = 'campo-numero campo-fraccion';
  c.autocomplete = 'off';
  c.spellcheck = false;
  c.setAttribute('autocorrect', 'off');
  c.setAttribute('enterkeyhint', 'done');
  c.style.setProperty('--cifras', cifras);
  if (nombre) c.setAttribute('aria-label', nombre);
  return c;
}

const marcaMalo = c => c.classList.toggle('campo-numero--malo', c.value.trim() !== '' && leerNumero(c.value) === null);

/**
 * Una fracción en dos casillas, con «+/−».
 *   const campo = campoFraccion(contenedor, { arriba, abajo, alCambiar, alEnviar });
 *   campo.valor();     // Fraccion (con su signo) o null si falta algo o no es válido
 *   campo.bloquear();  campo.casillas
 */
export function campoFraccion(contenedor, { arriba = '', abajo = '', alCambiar = () => {}, alEnviar = null } = {}) {
  const caja = document.createElement('span');
  caja.className = 'campo-fr';
  const menos = document.createElement('span');
  menos.className = 'campo-fr__menos';
  let negativo = false;
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'campo-fr__signo secundario';
  boton.textContent = `+/${MENOS}`;
  boton.setAttribute('aria-label', `+/${MENOS}`);
  const n = casilla(arriba, 3), d = casilla(abajo, 3);
  const raya = document.createElement('span');
  raya.innerHTML = htmlRaya('<span data-r="n"></span>', '<span data-r="d"></span>');
  raya.querySelector('[data-r="n"]').append(n);
  raya.querySelector('[data-r="d"]').append(d);
  caja.append(boton, menos, raya);
  contenedor.append(caja);
  let bloqueado = false;
  const valor = () => {
    const a = leerNumero(n.value), b = leerNumero(d.value);
    return a === null || b === null || b < 1 ? null : fraccion(negativo ? -a : a, b);
  };
  const actualizar = () => {
    menos.textContent = negativo ? MENOS : '';
    marcaMalo(n); marcaMalo(d);
    alCambiar(valor());
  };
  boton.addEventListener('click', () => { if (!bloqueado) { negativo = !negativo; actualizar(); } });
  for (const c of [n, d]) {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      if (!bloqueado && valor() !== null && alEnviar) alEnviar(valor());
    });
  }
  return {
    elemento: caja,
    casillas: [n, d],
    valor,
    bloquear() { bloqueado = true; n.disabled = d.disabled = true; boton.disabled = true; },
  };
}
