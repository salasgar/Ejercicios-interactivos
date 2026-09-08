// Alta de alumnos por lotes: análisis del texto pegado por el profesor y
// generación de usuarios y contraseñas. Puro, sin Firebase.

const PALABRAS = ['sol', 'luna', 'mar', 'rio', 'pino', 'gato', 'nube', 'flor', 'lago', 'oso', 'faro', 'seta',
  'olmo', 'coco', 'kiwi', 'lima', 'pera', 'uva', 'tren', 'moto', 'bici', 'vela', 'remo', 'nido', 'rana', 'topo'];

/** «María García López» → «maria.garcia». */
export function usuarioDesdeNombre(nombre) {
  const partes = nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '';
  return partes.slice(0, 2).join('.');
}

export function normalizarUsuario(usuario) {
  return usuario.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

export function esEmail(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
}

/** Contraseña sencilla de recordar y con los 6 caracteres que exige Firebase: «luna-482». */
export function generarContrasena(aleatorio = Math.random) {
  const palabra = PALABRAS[Math.floor(aleatorio() * PALABRAS.length)];
  const numero = String(Math.floor(aleatorio() * 900) + 100);
  return `${palabra}-${numero}`;
}

/**
 * Analiza las líneas pegadas. Formatos admitidos, campos separados por «;» o tabulador:
 *   Nombre Apellidos; email@centro.es; Grupo     → entra con Google, sin contraseña
 *   Nombre Apellidos; Grupo                      → usuario y contraseña automáticos
 *   Nombre Apellidos; usuario; Grupo             → contraseña automática
 *   Nombre Apellidos; usuario; contraseña; Grupo
 * `existentes`: usuarios/emails ya dados de alta, para no repetirlos.
 * Devuelve { alumnos: [{ nombre, grupo, email }] o [{ nombre, grupo, usuario, contrasena }], errores: [texto] }.
 */
export function analizarAltas(texto, existentes = [], aleatorio = Math.random) {
  const usados = new Set(existentes.map(u => u.toLowerCase()));
  const alumnos = [], errores = [];
  const lineas = texto.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  lineas.forEach((linea, i) => {
    const campos = linea.split(/;|\t/).map(c => c.trim());
    let nombre, usuario, contrasena, grupo;
    if (campos.length === 2) [nombre, grupo] = campos;
    else if (campos.length === 3) [nombre, usuario, grupo] = campos;
    else if (campos.length === 4) [nombre, usuario, contrasena, grupo] = campos;
    else { errores.push(`Línea ${i + 1}: se esperaban 2, 3 o 4 campos separados por «;»`); return; }
    if (!nombre || !grupo) { errores.push(`Línea ${i + 1}: faltan el nombre o el grupo`); return; }

    if (usuario && esEmail(usuario)) {
      const email = usuario.toLowerCase();
      if (contrasena) { errores.push(`Línea ${i + 1}: con email (acceso con Google) no hay contraseña`); return; }
      if (usados.has(email)) { errores.push(`Línea ${i + 1}: ${email} ya está dado de alta`); return; }
      usados.add(email);
      alumnos.push({ nombre, grupo, email });
      return;
    }

    usuario = normalizarUsuario(usuario || usuarioDesdeNombre(nombre));
    if (!usuario) { errores.push(`Línea ${i + 1}: no se pudo formar un usuario`); return; }
    let candidato = usuario, n = 2;
    while (usados.has(candidato)) candidato = `${usuario}${n++}`;
    usados.add(candidato);
    if (contrasena && contrasena.length < 6) { errores.push(`Línea ${i + 1}: la contraseña debe tener al menos 6 caracteres`); return; }
    alumnos.push({ nombre, grupo, usuario: candidato, contrasena: contrasena || generarContrasena(aleatorio) });
  });
  return { alumnos, errores };
}
