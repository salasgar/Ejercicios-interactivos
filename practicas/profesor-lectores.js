// «Cuenta lectora del informe diario» en el panel: solo el administrador, en su
// espacio. El informe de cada noche (herramientas/informe-actividad.mjs) lee el
// espacio con una cuenta de solo lectura que el profesor añade aquí (tarea 70).
// Hasta la tarea 71 estaba dentro de la herramienta «Pasar al sistema nuevo»
// (`profesor-migracion.js`), que se quitó con el modo antiguo.

/**
 * Monta la sección en `contenedor`. `contexto` (de profesor.js) da `datos`, con
 * `leerLectores()` y `guardarLectores(uids)` (src/firebase.js).
 */
export function montar(contenedor, contexto) {
  const $ = sel => contenedor.querySelector(sel);

  contenedor.innerHTML = `
    <p class="pequeno">El informe de cada noche lee tu espacio con una cuenta de solo lectura (correo y contraseña, creada en la consola de Firebase → Authentication). Pega aquí su uid (columna «User UID»): solo podrá leer tu progreso y tus fallos, nunca los nombres.</p>
    <div class="contrasenas">
      <input id="lector-uid" placeholder="uid de la cuenta lectora" autocomplete="off">
      <button type="button" class="secundario" id="lector-guardar">Añadir como lectora</button>
    </div>
    <p class="pequeno" id="lectores-estado"></p>`;

  async function pintarLectores() {
    try {
      const lectores = await contexto.datos.leerLectores();
      $('#lectores-estado').textContent = lectores.length ? `Lectoras ahora: ${lectores.join(', ')}.` : 'Aún no hay ninguna cuenta lectora.';
    } catch (e) { $('#lectores-estado').textContent = `No se han podido leer las lectoras: ${e.message}`; }
  }
  $('#lector-guardar').addEventListener('click', async () => {
    const uid = $('#lector-uid').value.trim();
    if (!/^[A-Za-z0-9]{10,128}$/.test(uid)) { $('#lectores-estado').textContent = 'Eso no parece un uid (solo letras y números, sin espacios).'; return; }
    try {
      const ya = await contexto.datos.leerLectores();
      await contexto.datos.guardarLectores([...ya, uid]);
      $('#lector-uid').value = '';
    } catch (e) { $('#lectores-estado').textContent = `No se ha podido guardar: ${e.message}`; return; }
    pintarLectores();
  });
  pintarLectores();
}
