// Página de acertijos (WEB, tarea 08): lógica pura, sin DOM. Filtra, busca y ordena el catálogo.
// Esquema de cada acertijo: { id, titulo, enunciado, pista?, solucion?, tipo, nivel, unidad?, idioma, orden?, imagen?, fuente? }

export const TIPOS = {
  L: 'Lógica y deducción',
  N: 'Números y operaciones',
  G: 'Geometría y visión espacial',
  P: 'Pesadas, medidas y trasvases',
  J: 'Juegos, puzles y estrategia',
  S: 'Series y patrones',
  T: 'Pensamiento lateral',
  C: 'Contar y combinatoria',
};

export const NIVELES = { '★': 'Para todos', '★★': 'Hay que pensar', '★★★': 'Reto' };

export const IDIOMAS = { es: 'Español', en: 'English' };

/** Texto sin tildes, en minúsculas y con los espacios normalizados (para buscar). */
export function normalizar(t) {
  return String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Nivel como número de estrellas (0 si no es válido). */
export const estrellas = nivel => (Object.hasOwn(NIVELES, nivel) ? nivel.length : 0);

/** Un acertijo es válido si tiene id, título, enunciado, tipo y nivel conocidos. */
export function esValido(a) {
  return !!a && typeof a === 'object' && !!a.id && !!a.titulo && !!a.enunciado
    && Object.hasOwn(TIPOS, a.tipo) && Object.hasOwn(NIVELES, a.nivel);
}

/** Descarta lo que no es un acertijo válido y devuelve copias con los campos opcionales rellenos. */
export function normalizarCatalogo(datos) {
  const lista = Array.isArray(datos) ? datos : [];
  const vistos = new Set();
  const salida = [];
  for (const a of lista) {
    if (!esValido(a) || vistos.has(String(a.id))) continue;
    vistos.add(String(a.id));
    salida.push({
      ...a, id: String(a.id), pista: a.pista || '', solucion: a.solucion || '',
      unidad: Number.isInteger(a.unidad) ? a.unidad : null, idioma: a.idioma || 'es',
      orden: Number.isFinite(a.orden) ? a.orden : 1e9, imagen: a.imagen || '', fuente: a.fuente || '',
    });
  }
  return salida;
}

/** Valores presentes en el catálogo, para rellenar los desplegables. */
export function unidadesDe(catalogo) {
  return [...new Set(catalogo.map(a => a.unidad).filter(u => u !== null))].sort((x, y) => x - y);
}

/** Filtra por tipo, nivel, unidad e idioma (vacío = todos) y por texto (todas las palabras, sin tildes). */
export function filtrar(catalogo, { tipo = '', nivel = '', unidad = '', idioma = '', texto = '' } = {}) {
  const palabras = normalizar(texto).split(' ').filter(Boolean);
  return catalogo.filter(a => {
    if (tipo && a.tipo !== tipo) return false;
    if (nivel && a.nivel !== nivel) return false;
    if (unidad !== '' && unidad !== null && a.unidad !== Number(unidad)) return false;
    if (idioma && a.idioma !== idioma) return false;
    if (!palabras.length) return true;
    const pajar = normalizar(`${a.titulo} ${a.enunciado} ${a.pista} ${TIPOS[a.tipo]}`);
    return palabras.every(p => pajar.includes(p));
  });
}

/** Orden estable: `orden`, luego nivel (de menos a más estrellas), luego título. No modifica la entrada. */
export function ordenar(lista) {
  return [...lista].sort((a, b) =>
    a.orden - b.orden || estrellas(a.nivel) - estrellas(b.nivel) || a.titulo.localeCompare(b.titulo, 'es'));
}

/** «1 acertijo» / «N acertijos». */
export const contador = n => `${n} ${n === 1 ? 'acertijo' : 'acertijos'}`;

/** Uno al azar de la lista (o null si está vacía). `azar` devuelve un número en [0, 1). */
export function alAzar(lista, azar = Math.random) {
  return lista.length ? lista[Math.min(lista.length - 1, Math.floor(azar() * lista.length))] : null;
}

/** Enlace directo: `#id`. Y el camino de vuelta: el acertijo cuyo id está en el hash (o null). */
export const enlaceDe = a => `#${encodeURIComponent(a.id)}`;
export function deHash(hash, catalogo) {
  let id = String(hash || '').replace(/^#/, '');
  try { id = decodeURIComponent(id); } catch { return null; }
  return catalogo.find(a => a.id === id) || null;
}
