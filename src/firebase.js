// Capa de acceso a Firebase (Auth + Firestore). Es la única parte de la
// aplicación que habla con la red; el resto recibe datos planos.
//
// Los alumnos se identifican por su email: el real si entran con Google, o
// uno interno («usuario@alumnos.example») si entran con usuario y contraseña.
// La ficha vive en `alumnos/{email}` y su progreso en `alumnos/{email}/progreso`.
//
// El SDK se importa dinámicamente para que la aplicación arranque (en modo de
// prueba) aunque no haya configuración ni conexión.

import { firebaseConfig, DOMINIO_ALUMNOS, DOMINIO_GOOGLE, PROFESOR_UID } from './config.js';

const VERSION_SDK = '12.4.0';
const CDN = `https://www.gstatic.com/firebasejs/${VERSION_SDK}/`;

/** «maria.garcia» → «maria.garcia@alumnos.example»; un email real se deja tal cual. */
export function emailDeUsuario(usuario) {
  const u = usuario.trim().toLowerCase();
  return u.includes('@') ? u : `${u}@${DOMINIO_ALUMNOS}`;
}

/** Cómo se muestra la identidad de un alumno: el usuario corto o el email real. */
export function identificadorVisible(email) {
  return email.endsWith(`@${DOMINIO_ALUMNOS}`) ? email.slice(0, -DOMINIO_ALUMNOS.length - 1) : email;
}

const MENSAJES_AUTH = {
  'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
  'auth/wrong-password': 'Usuario o contraseña incorrectos.',
  'auth/user-not-found': 'Usuario o contraseña incorrectos.',
  'auth/invalid-email': 'El usuario no es válido.',
  'auth/too-many-requests': 'Demasiados intentos seguidos. Espera un momento y vuelve a probar.',
  'auth/network-request-failed': 'No hay conexión. Comprueba la red.',
  'auth/email-already-in-use': 'Ese usuario ya existe.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/popup-closed-by-user': 'Se cerró la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Se cerró la ventana de Google antes de terminar.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase (Authentication → Configuración → Dominios autorizados).',
  'auth/operation-not-allowed': 'Este método de acceso no está habilitado en Firebase (Authentication → Método de acceso).',
  'permission-denied': 'No tienes permiso para hacer eso. Revisa las reglas de Firestore y el PROFESOR_UID.',
};

export function mensajeDeError(e) {
  return MENSAJES_AUTH[e?.code] ?? e?.message ?? String(e);
}

export async function iniciarFirebase() {
  const [App, Auth, Fs] = await Promise.all([
    import(`${CDN}firebase-app.js`),
    import(`${CDN}firebase-auth.js`),
    import(`${CDN}firebase-firestore.js`),
  ]);
  const app = App.initializeApp(firebaseConfig);
  const auth = Auth.getAuth(app);
  auth.languageCode = 'es';
  const db = Fs.getFirestore(app);

  const col = nombre => Fs.collection(db, nombre);
  const docRef = (...ruta) => Fs.doc(db, ...ruta);
  const datosDe = snap => ({ id: snap.id, ...snap.data() });

  // --- Sesión -------------------------------------------------------------

  async function entrar(usuario, contrasena) {
    await Auth.signInWithEmailAndPassword(auth, emailDeUsuario(usuario), contrasena);
  }

  async function entrarConGoogle() {
    const proveedor = new Auth.GoogleAuthProvider();
    // Sugerencia de dominio: Google preselecciona la cuenta del centro si la hay.
    if (DOMINIO_GOOGLE) proveedor.setCustomParameters({ hd: DOMINIO_GOOGLE, prompt: 'select_account' });
    try {
      await Auth.signInWithPopup(auth, proveedor);
    } catch (e) {
      // Si el navegador bloquea la ventana emergente, se va por redirección.
      if (e.code === 'auth/popup-blocked') await Auth.signInWithRedirect(auth, proveedor);
      else throw e;
    }
  }

  function salir() {
    return Auth.signOut(auth);
  }

  function observarSesion(callback) {
    return Auth.onAuthStateChanged(auth, callback);
  }

  function esProfesor(user) {
    return Boolean(user && PROFESOR_UID && user.uid === PROFESOR_UID);
  }

  // --- Alumnos ------------------------------------------------------------

  async function leerAlumno(email) {
    const snap = await Fs.getDoc(docRef('alumnos', email.toLowerCase()));
    return snap.exists() ? datosDe(snap) : null;
  }

  async function listarAlumnos() {
    const snap = await Fs.getDocs(col('alumnos'));
    return snap.docs.map(datosDe).sort((a, b) => (a.grupo + a.nombre).localeCompare(b.grupo + b.nombre, 'es'));
  }

  async function listarCredenciales() {
    const snap = await Fs.getDocs(col('credenciales'));
    return Object.fromEntries(snap.docs.map(d => [d.id, d.data().contrasena]));
  }

  /**
   * Da de alta un alumno. Con `email` (acceso con Google) basta con la ficha.
   * Con `usuario` y `contrasena` se crea además la cuenta, usando una segunda
   * instancia de Firebase para que el alta no cierre la sesión del profesor.
   */
  async function crearAlumno({ nombre, grupo, email, usuario, contrasena }) {
    const id = email ? email.toLowerCase() : emailDeUsuario(usuario);
    if (!email) {
      const secundaria = App.getApps().find(a => a.name === 'secundaria') ?? App.initializeApp(firebaseConfig, 'secundaria');
      const authSecundaria = Auth.getAuth(secundaria);
      await Auth.createUserWithEmailAndPassword(authSecundaria, id, contrasena);
      await Auth.signOut(authSecundaria);
    }
    await Fs.setDoc(docRef('alumnos', id), { nombre, grupo, email: id, acceso: email ? 'google' : 'contrasena', creadoEn: Date.now() });
    if (!email) await Fs.setDoc(docRef('credenciales', id), { usuario, contrasena });
    return id;
  }

  async function actualizarAlumno(id, cambios) {
    await Fs.updateDoc(docRef('alumnos', id), cambios);
  }

  async function borrarAlumno(id) {
    await Fs.deleteDoc(docRef('alumnos', id));
    await Fs.deleteDoc(docRef('credenciales', id)).catch(() => {});
  }

  // --- Tareas -------------------------------------------------------------

  async function listarTareas(grupo = null) {
    const q = grupo ? Fs.query(col('tareas'), Fs.where('grupo', '==', grupo)) : col('tareas');
    const snap = await Fs.getDocs(q);
    return snap.docs.map(datosDe).sort((a, b) => (b.creadaEn ?? 0) - (a.creadaEn ?? 0));
  }

  async function crearTarea(tarea) {
    const ref = await Fs.addDoc(col('tareas'), { ...tarea, creadaEn: Date.now() });
    return ref.id;
  }

  async function actualizarTarea(id, cambios) {
    await Fs.updateDoc(docRef('tareas', id), cambios);
  }

  async function borrarTarea(id) {
    await Fs.deleteDoc(docRef('tareas', id));
  }

  // --- Progreso -----------------------------------------------------------

  async function leerProgreso(alumnoId, tareaId) {
    const snap = await Fs.getDoc(docRef('alumnos', alumnoId, 'progreso', tareaId));
    return snap.exists() ? snap.data() : null;
  }

  async function listarProgresos(alumnoId) {
    const snap = await Fs.getDocs(Fs.collection(db, 'alumnos', alumnoId, 'progreso'));
    return Object.fromEntries(snap.docs.map(d => [d.id, d.data()]));
  }

  async function guardarProgreso(alumnoId, progreso) {
    await Fs.setDoc(docRef('alumnos', alumnoId, 'progreso', progreso.tareaId), { ...progreso, alumno: alumnoId });
  }

  /** Progreso de todos los alumnos indicados en una tarea: { alumnoId: progreso|null }. */
  async function progresosDeTarea(tareaId, alumnos) {
    const pares = await Promise.all(alumnos.map(async a => [a.id, await leerProgreso(a.id, tareaId)]));
    return Object.fromEntries(pares);
  }

  /** Todos los progresos de todos los alumnos (exportación completa). */
  async function todosLosProgresos() {
    const snap = await Fs.getDocs(Fs.collectionGroup(db, 'progreso'));
    return snap.docs.map(d => ({ alumno: d.ref.parent.parent.id, tareaId: d.id, ...d.data() }));
  }

  return {
    entrar, entrarConGoogle, salir, observarSesion, esProfesor,
    datos: {
      leerAlumno, listarAlumnos, listarCredenciales, crearAlumno, actualizarAlumno, borrarAlumno,
      listarTareas, crearTarea, actualizarTarea, borrarTarea,
      leerProgreso, listarProgresos, guardarProgreso, progresosDeTarea, todosLosProgresos,
    },
  };
}
