// Pantalla de entrada: acceso con Google, usuario y contraseña, y el modo de
// prueba sin cuenta.

import { t } from '../i18n/index.js';

export function pantallaEntrada(app, { entrar, entrarConGoogle, probar, sinFirebase = false, error = null }) {
  const desactivado = sinFirebase ? 'disabled' : '';
  app.innerHTML = `
    <section class="entrada">
      <div class="tarjeta">
        <h2>${t('entrar')}</h2>
        ${sinFirebase ? `<div class="aviso">${t('falta_firebase')}</div>` : ''}
        ${error ? `<div class="aviso aviso--error">${error}</div>` : ''}
        <button type="button" id="boton-google" class="ancho boton-google" ${desactivado}>
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.5 13.3l7.9 6.1C12.3 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.5-4.1 7-10.2 7-17.6z"/><path fill="#FBBC05" d="M10.4 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.3 0 11.7-2.1 15.6-5.7l-7.6-5.9c-2.1 1.4-4.8 2.3-8 2.3-6.3 0-11.7-4.1-13.6-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
          ${t('entrar_google')}
        </button>
        <p class="pequeno" style="text-align:center;margin:.5rem 0 0">${t('entrar_google_ayuda')}</p>
        <div id="mensaje-google" class="aviso aviso--error" hidden></div>
      </div>
      <details class="tarjeta detalles-contrasena">
        <summary>${t('entrar_contrasena')}</summary>
        <form id="form-entrar" autocomplete="on" style="margin-top:.8rem">
          <label for="usuario">${t('usuario')}</label>
          <input id="usuario" name="username" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" autocomplete="username" required ${desactivado}>
          <label for="contrasena">${t('contrasena')}</label>
          <input id="contrasena" name="password" type="password" autocomplete="current-password" required ${desactivado}>
          <div id="mensaje-entrar" class="aviso aviso--error" hidden></div>
          <button type="submit" class="ancho secundario" ${desactivado}>${t('entrar')}</button>
        </form>
      </details>
      <p class="separador">${t('o')}</p>
      <button id="boton-probar" class="secundario ancho">${t('probar_sin_cuenta')}</button>
      <p class="pequeno" style="text-align:center;margin-top:.6rem">${t('probar_aviso')}</p>
    </section>`;

  const mostrarError = (el, e) => { el.textContent = e.mensaje ?? e.message ?? String(e); el.hidden = false; };

  const botonGoogle = app.querySelector('#boton-google');
  botonGoogle.addEventListener('click', async () => {
    const mensaje = app.querySelector('#mensaje-google');
    mensaje.hidden = true;
    botonGoogle.disabled = true;
    try {
      await entrarConGoogle();
    } catch (e) {
      mostrarError(mensaje, e);
      botonGoogle.disabled = false;
    }
  });

  const form = app.querySelector('#form-entrar');
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const boton = form.querySelector('button[type=submit]');
    const mensaje = app.querySelector('#mensaje-entrar');
    boton.disabled = true;
    mensaje.hidden = true;
    try {
      await entrar(form.usuario.value, form.contrasena.value);
    } catch (e) {
      mostrarError(mensaje, e);
      boton.disabled = false;
    }
  });
  app.querySelector('#boton-probar').addEventListener('click', probar);
}
