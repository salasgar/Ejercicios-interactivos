// Campo para escribir una fracción con raya (numerador sobre denominador) y un botón +/− para el
// signo, en vez de teclear «3/5» (el teclado numérico del móvil no tiene la barra). Con el
// denominador vacío vale un natural (el 5 es 5/1). La lectura es `leerFraccion` de la base.

import { leerFraccion, htmlRaya, MENOS } from '../_comun/fracciones.js';

const ES_MENOS = /^[-−–]/;

/**
 * Lo que hay escrito en los dos cuadros, como Fraccion (tal cual, sin simplificar), o null si
 * falta el numerador o algo no es un número. Pura: se prueba sin navegador.
 */
export function leerCampoFraccion(arriba, abajo) {
  const a = String(arriba ?? '').trim(), b = String(abajo ?? '').trim();
  if (a === '') return null;
  return leerFraccion(b === '' ? a : `${a}/${b}`);
}

/**
 *   const campo = campoFraccion(contenedor, { nombre: { numerador, denominador }, boton, alEnviar });
 *   campo.valor();     // la Fraccion escrita, o null
 *   campo.bloquear();
 */
export function campoFraccion(contenedor, { nombre = {}, boton = null, alEnviar = null } = {}) {
  const caja = document.createElement('div');
  caja.className = 'campo-fraccion';
  const signo = document.createElement('button');
  signo.type = 'button';
  signo.className = 'campo-fraccion__signo secundario';
  signo.textContent = `+/${MENOS}`;
  signo.setAttribute('aria-label', `+/${MENOS}`);
  const raya = document.createElement('span');
  raya.innerHTML = htmlRaya(
    '<input type="text" class="campo-numero campo-fraccion__arriba">',
    '<input type="text" class="campo-numero campo-fraccion__abajo">',
  );
  const [arriba, abajo] = raya.querySelectorAll('input');
  for (const [campo, etiqueta] of [[arriba, nombre.numerador], [abajo, nombre.denominador]]) {
    campo.inputMode = 'numeric';
    campo.autocomplete = 'off';
    campo.spellcheck = false;
    campo.setAttribute('autocorrect', 'off');
    campo.setAttribute('enterkeyhint', 'done');
    campo.style.setProperty('--cifras', 3);
    if (etiqueta) campo.setAttribute('aria-label', etiqueta);
  }
  let bloqueado = false;
  const valor = () => leerCampoFraccion(arriba.value, abajo.value);
  const actualizar = () => {
    const malo = valor() === null && (arriba.value.trim() !== '' || abajo.value.trim() !== '');
    for (const c of [arriba, abajo]) {
      c.classList.toggle('campo-numero--malo', malo);
      c.setAttribute('aria-invalid', String(malo));
    }
    if (boton) boton.disabled = bloqueado || valor() === null;
  };
  signo.addEventListener('click', () => {
    if (bloqueado) return;
    const t = arriba.value.trim();
    arriba.value = ES_MENOS.test(t) ? t.slice(1).trim() : `${MENOS}${t.replace(/^\+/, '')}`;
    actualizar();
    arriba.focus();
  });
  for (const c of [arriba, abajo]) {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      if (!bloqueado && valor() !== null && alEnviar) alEnviar(valor());
    });
  }
  caja.append(signo, raya);
  contenedor.append(caja);
  actualizar();
  return {
    elemento: caja,
    valor,
    bloquear() { bloqueado = true; arriba.disabled = true; abajo.disabled = true; signo.disabled = true; actualizar(); },
  };
}
