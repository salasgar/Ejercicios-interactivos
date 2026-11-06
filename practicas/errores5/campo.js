// Campo de «Caza el error» de la unidad 5 (PU2, tarea 128): un decimal escrito a mano, con coma o punto
// (`deTexto` de decimales.js las acepta en los dos idiomas). Solo DOM.

import { deTexto } from '../_comun/decimales.js';

/**
 *   const campo = campoDecimal(contenedor, { nombre, boton, alEnviar });
 *   campo.valor();     // Decimal o null si está vacío o no es un número
 *   campo.bloquear();  campo.elemento
 */
export function campoDecimal(contenedor, { nombre = '', boton = null, alEnviar = null } = {}) {
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.inputMode = 'decimal';
  campo.className = 'campo-numero';
  campo.autocomplete = 'off';
  campo.spellcheck = false;
  campo.setAttribute('autocorrect', 'off');
  campo.setAttribute('enterkeyhint', 'done');
  campo.style.setProperty('--cifras', 7);
  if (nombre) campo.setAttribute('aria-label', nombre);
  let bloqueado = false;
  const valor = () => deTexto(campo.value);
  const actualizar = () => {
    const v = valor(), malo = v === null && campo.value.trim() !== '';
    campo.classList.toggle('campo-numero--malo', malo);
    campo.setAttribute('aria-invalid', String(malo));
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
