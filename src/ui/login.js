// Pantalla de entrada: usuario y contraseña, y el modo de prueba sin cuenta.

export function pantallaEntrada(app, { entrar, probar, sinFirebase = false, error = null }) {
  app.innerHTML = `
    <section class="entrada">
      <div class="tarjeta">
        <h2>Entrar</h2>
        ${sinFirebase ? `<div class="aviso">Falta configurar Firebase (<code>src/config.js</code>). Mientras tanto puedes usar el modo de prueba.</div>` : ''}
        ${error ? `<div class="aviso aviso--error">${error}</div>` : ''}
        <form id="form-entrar" autocomplete="on">
          <label for="usuario">Usuario</label>
          <input id="usuario" name="username" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" autocomplete="username" required ${sinFirebase ? 'disabled' : ''}>
          <label for="contrasena">Contraseña</label>
          <input id="contrasena" name="password" type="password" autocomplete="current-password" required ${sinFirebase ? 'disabled' : ''}>
          <div id="mensaje-entrar" class="aviso aviso--error" hidden></div>
          <button type="submit" class="ancho" ${sinFirebase ? 'disabled' : ''}>Entrar</button>
        </form>
      </div>
      <p class="separador">o</p>
      <button id="boton-probar" class="secundario ancho">Probar sin cuenta</button>
      <p class="pequeno" style="text-align:center;margin-top:.6rem">En el modo de prueba los resultados no se guardan.</p>
    </section>`;

  const form = app.querySelector('#form-entrar');
  const mensaje = app.querySelector('#mensaje-entrar');
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const boton = form.querySelector('button[type=submit]');
    boton.disabled = true;
    mensaje.hidden = true;
    try {
      await entrar(form.usuario.value, form.contrasena.value);
    } catch (e) {
      mensaje.textContent = e.mensaje ?? e.message ?? String(e);
      mensaje.hidden = false;
      boton.disabled = false;
    }
  });
  app.querySelector('#boton-probar').addEventListener('click', probar);
  if (!sinFirebase) app.querySelector('#usuario').focus();
}
