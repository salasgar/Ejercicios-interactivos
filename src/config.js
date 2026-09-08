// Configuración de Firebase. Cómo rellenarla, paso a paso: README.md.
//
// La configuración web de Firebase (apiKey incluida) es pública por diseño:
// identifica el proyecto, no da permisos. Lo que protege los datos son las
// reglas de `firestore.rules`.

export const firebaseConfig = null;
// Ejemplo de lo que hay que pegar (lo da la consola de Firebase):
// export const firebaseConfig = {
//   apiKey: '...',
//   authDomain: 'xxx.firebaseapp.com',
//   projectId: 'xxx',
//   storageBucket: 'xxx.appspot.com',
//   messagingSenderId: '...',
//   appId: '...',
// };

/**
 * uid de la cuenta del profesor. Se obtiene entrando una vez en la aplicación
 * con Google: si el uid no está aquí, la propia aplicación lo muestra en
 * pantalla para copiarlo (también está en Authentication → Users).
 */
export const PROFESOR_UID = '';

/** Dominio que se sugiere al entrar con Google (cuentas del centro). */
export const DOMINIO_GOOGLE = 'murciaeduca.es';

/** Dominio ficticio con el que se forman los emails internos de los alumnos con contraseña. */
export const DOMINIO_ALUMNOS = 'alumnos.example';

export function configurado() {
  return Boolean(firebaseConfig && firebaseConfig.apiKey);
}
