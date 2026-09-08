// Capa de acceso a Firebase (Auth + Firestore). Es la única parte de la
// aplicación que habla con la red; el resto recibe datos planos.
//
// El SDK se importa dinámicamente para que la aplicación arranque (en modo de
// prueba) aunque no haya configuración ni conexión.

import { firebaseConfig, DOMINIO_ALUMNOS, PROFESOR_UID } from './config.js';

const VERSION_SDK = '12.4.0';
const CDN = `https://www.gstatic.com/firebasejs/${VERSION_SDK}/`;

/** «maria.garcia» → «maria.garcia@alumnos.example»; un email real se deja tal cual. */
export function emailDeUsuario(usuario) {
  const u = usuario.trim().toLowerCase();
  return u.includes('@') ? u : `${u}@${DOMINIO_ALUMNOS}`;
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

  async function leerAlumno(uid) {
    const snap = await Fs.getDoc(docRef('alumnos', uid));
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
   * Crea la cuenta del alumno con una segunda instancia de Firebase, para que
   * el alta no cierre la sesión del profesor, y guarda su ficha y su contraseña.
   */
  async function crearAlumno({ nombre, usuario, contrasena, grupo }) {
    const secundaria = App.getApps().find(a => a.name === 'secundaria') ?? App.initializeApp(firebaseConfig, 'secundaria');
    const authSecundaria = Auth.getAuth(secundaria);
    const cred = await Auth.createUserWithEmailAndPassword(authSecundaria, emailDeUsuario(usuario), contrasena);
    const uid = cred.user.uid;
    await Auth.signOut(authSecundaria);
    await Fs.setDoc(docRef('alumnos', uid), { usuario, nombre, grupo, creadoEn: Date.now() });
    await Fs.setDoc(docRef('credenciales', uid), { usuario, contrasena });
    return uid;
  }

  async function actualizarAlumno(uid, cambios) {
    await Fs.updateDoc(docRef('alumnos', uid), cambios);
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

  async function leerProgreso(uid, tareaId) {
    const snap = await Fs.getDoc(docRef('alumnos', uid, 'progreso', tareaId));
    return snap.exists() ? snap.data() : null;
  }

  async function listarProgresos(uid) {
    const snap = await Fs.getDocs(Fs.collection(db, 'alumnos', uid, 'progreso'));
    return Object.fromEntries(snap.docs.map(d => [d.id, d.data()]));
  }

  async function guardarProgreso(uid, progreso) {
    await Fs.setDoc(docRef('alumnos', uid, 'progreso', progreso.tareaId), { ...progreso, uid });
  }

  /** Progreso de todos los alumnos indicados en una tarea: { uid: progreso|null }. */
  async function progresosDeTarea(tareaId, alumnos) {
    const pares = await Promise.all(alumnos.map(async a => [a.id, await leerProgreso(a.id, tareaId)]));
    return Object.fromEntries(pares);
  }

  /** Todos los progresos de todos los alumnos (exportación completa). */
  async function todosLosProgresos() {
    const snap = await Fs.getDocs(Fs.collectionGroup(db, 'progreso'));
    return snap.docs.map(d => ({ uid: d.ref.parent.parent.id, tareaId: d.id, ...d.data() }));
  }

  return {
    entrar, salir, observarSesion, esProfesor,
    datos: {
      leerAlumno, listarAlumnos, listarCredenciales, crearAlumno, actualizarAlumno,
      listarTareas, crearTarea, actualizarTarea, borrarTarea,
      leerProgreso, listarProgresos, guardarProgreso, progresosDeTarea, todosLosProgresos,
    },
  };
}
