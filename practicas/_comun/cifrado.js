// La lista de nombres del profesor, cifrada en su navegador (varios profesores,
// tarea 66 del reparto PU2; DISENO.md, F.1 y G). En la nube solo hay lo que sale
// de aquí: nadie la lee sin la contraseña, ni Juan Luis ni la consola de Firebase.
//
// Web Crypto del navegador, sin bibliotecas: de la contraseña sale una clave
// AES-GCM de 256 bits con PBKDF2-SHA-256 (600 000 vueltas y una sal al azar), y
// cada cifrado lleva su propio iv al azar. Solo funciona en un contexto seguro
// (GitHub Pages, `localhost`, `127.0.0.1`). Node también lo tiene, para los tests.

/** Versión del formato: la 1 son las vueltas, el hash y el cifrado de arriba. */
export const VERSION_CIFRADO = 1;
export const VUELTAS = 600000;
export const MIN_CONTRASENA = 10;
const BYTES_SAL = 16;
const BYTES_IV = 12;

/** '' si la contraseña vale; si no, la frase de por qué. */
export function errorContrasena(contrasena) {
  if (typeof contrasena !== 'string' || [...contrasena].length < MIN_CONTRASENA) return `La contraseña tiene que tener al menos ${MIN_CONTRASENA} caracteres.`;
  return '';
}

// Byte a byte y no con `fromCharCode(...bytes)`, que con una lista larga pasa del tope de argumentos.
const aBase64 = bytes => btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
const deBase64 = texto => Uint8Array.from(atob(texto), c => c.charCodeAt(0));

async function claveDe(contrasena, sal, { crypto, vueltas }) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(contrasena), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: vueltas },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Cifra un texto: `{ v, sal, iv, cifrado }` (las tres últimas en base64), lo que
 * guarda `guardarNombresCifrados` de `src/firebase.js`. Sal e iv nuevos cada vez.
 * Lanza si la contraseña no vale (`errorContrasena`). `vueltas` solo se cambia en los tests.
 */
export async function cifrar(texto, contrasena, { crypto = globalThis.crypto, vueltas = VUELTAS } = {}) {
  const error = errorContrasena(contrasena);
  if (error) throw new Error(error);
  const sal = crypto.getRandomValues(new Uint8Array(BYTES_SAL));
  const iv = crypto.getRandomValues(new Uint8Array(BYTES_IV));
  const clave = await claveDe(contrasena, sal, { crypto, vueltas });
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, clave, new TextEncoder().encode(texto)));
  return { v: VERSION_CIFRADO, sal: aBase64(sal), iv: aBase64(iv), cifrado: aBase64(cifrado) };
}

/** Error de `descifrar` cuando la contraseña no es la buena (o el dato está dañado). */
export class ContrasenaIncorrecta extends Error {
  constructor() { super('La contraseña no es la de esta lista.'); this.name = 'ContrasenaIncorrecta'; }
}

/**
 * Descifra lo que dejó `cifrar`. Lanza `ContrasenaIncorrecta` si la contraseña no
 * es la buena: AES-GCM lo sabe por su etiqueta, no hay que adivinar por el texto.
 */
export async function descifrar(dato, contrasena, { crypto = globalThis.crypto, vueltas = VUELTAS } = {}) {
  if (dato?.v !== VERSION_CIFRADO) throw new Error(`Formato de lista cifrada desconocido (v = ${dato?.v}).`);
  let sal, iv, cifrado;
  try {
    [sal, iv, cifrado] = [dato.sal, dato.iv, dato.cifrado].map(deBase64);
  } catch {
    throw new ContrasenaIncorrecta();
  }
  const clave = await claveDe(String(contrasena ?? ''), sal, { crypto, vueltas });
  try {
    return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, clave, cifrado));
  } catch {
    throw new ContrasenaIncorrecta();
  }
}
