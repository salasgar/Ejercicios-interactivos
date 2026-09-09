// Configuración de Firebase. Cómo rellenarla, paso a paso: README.md.
//
// La configuración web de Firebase (apiKey incluida) es pública por diseño:
// identifica el proyecto, no da permisos. Lo que protege los datos son las
// reglas de `firestore.rules`.

export const firebaseConfig = {
  apiKey: 'AIzaSyC2q-wDyqD4qo1pFtTodyxR1OE8F6Mbajw',
  authDomain: 'ejercicios-interactivos.firebaseapp.com',
  projectId: 'ejercicios-interactivos',
  storageBucket: 'ejercicios-interactivos.firebasestorage.app',
  messagingSenderId: '596939543738',
  appId: '1:596939543738:web:b8ca3ace7e49e91c7a5e83',
};

/**
 * uid de la cuenta del profesor. Se obtiene entrando una vez en la aplicación
 * con Google: si el uid no está aquí, la propia aplicación lo muestra en
 * pantalla para copiarlo (también está en Authentication → Users).
 */
export const PROFESOR_UID = 'TaU3nTL3CnU5Uwz0GzmrNDdSbTj2';

/** Dominio que se sugiere al entrar con Google (cuentas del centro). */
export const DOMINIO_GOOGLE = 'murciaeduca.es';

/** Dominio ficticio con el que se forman los emails internos de los alumnos con contraseña. */
export const DOMINIO_ALUMNOS = 'alumnos.example';

export function configurado() {
  return Boolean(firebaseConfig && firebaseConfig.apiKey);
}
