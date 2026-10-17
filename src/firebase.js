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

// --- Panel de varios profesores (tarea 63; DISENO.md A.2, B.2, C.1, F.1) -----
//
// Acceso a datos con la cuenta del profesor. Es una fábrica con el SDK y `auth`
// por parámetro para poder probarla sin red. Las rutas y los campos son los que
// aceptan las reglas de `firestore.rules` (tarea 61): ahí manda cada nombre.

// De 4 u 8 símbolos (tarea 72): cada profesor elige la longitud de los que genera.
const CODIGO_SECRETO = /^[A-HJ-NP-Z2-9]{4}(?:[A-HJ-NP-Z2-9]{4})?$/;
/** Número de lista más alto que aceptan las reglas (el código de resultado de la tarea lo admite). */
const MAX_N = 1023;
/** Subcolecciones del espacio que el panel lee; `progreso` es sinónimo de `progreso-libre`. */
const LECTURAS_ESPACIO = { 'progreso': 'progreso-libre', 'progreso-libre': 'progreso-libre', 'progreso-tareas': 'progreso-tareas', 'asignaciones': 'asignaciones', 'fallos': 'fallos' };
/** Campo de tiempo (milisegundos) de cada subcolección: los fallos usan `t`. */
const CAMPO_TIEMPO = { 'progreso-libre': 'actualizado', 'progreso-tareas': 'actualizado', 'asignaciones': 'actualizado', 'fallos': 't' };

export function crearAccesoPanel({ Fs, db, auth, esAdmin }) {
  const col = (...ruta) => Fs.collection(db, ...ruta);
  const docRef = (...ruta) => Fs.doc(db, ...ruta);
  const datosDe = snap => ({ id: snap.id, ...snap.data() });

  /** Cuenta con la sesión abierta; sin ella, error claro en vez de un permission-denied. */
  function cuenta() {
    const u = auth.currentUser;
    if (!u) throw new Error('Hace falta iniciar sesión.');
    return u;
  }
  const miUid = () => cuenta().uid;
  const ahora = () => Date.now();

  // --- Alta (A.2) ---

  /** 'admin' | 'activo' | 'baja' | 'sin-alta' para la cuenta con la sesión abierta. */
  async function estadoProfesor() {
    const u = cuenta();
    if (esAdmin(u)) return 'admin';
    const snap = await Fs.getDoc(docRef('practicas-profesores', u.uid));
    if (!snap.exists()) return 'sin-alta';
    return snap.data().activo === true ? 'activo' : 'baja';
  }

  /** Deja (o renueva) la solicitud de alta de la cuenta, con el correo de Google que exigen las reglas. */
  async function pedirAlta() {
    const u = cuenta();
    await Fs.setDoc(docRef('practicas-solicitudes', u.uid), {
      email: u.email,
      nombre: String(u.displayName ?? '').slice(0, 100),
      pedido: ahora(),
    });
  }

  /** Solo administrador: solicitudes pendientes, [{ id: uid, email, nombre, pedido }]. */
  async function listarSolicitudes() {
    const snap = await Fs.getDocs(col('practicas-solicitudes'));
    return snap.docs.map(datosDe).sort((a, b) => (a.pedido ?? 0) - (b.pedido ?? 0));
  }

  /** Solo administrador: profesores dados de alta o de baja, [{ id: uid, activo, alta }]. */
  async function listarProfesores() {
    const snap = await Fs.getDocs(col('practicas-profesores'));
    return snap.docs.map(datosDe).sort((a, b) => (a.alta ?? 0) - (b.alta ?? 0));
  }

  async function escribirAlta(uid, activo) {
    const previo = await Fs.getDoc(docRef('practicas-profesores', uid));
    const alta = previo.exists() && Number.isInteger(previo.data().alta) ? previo.data().alta : ahora();
    await Fs.setDoc(docRef('practicas-profesores', uid), { activo, alta });
  }

  /** Solo administrador: da de alta (o vuelve a dar de alta) a un profesor; conserva su fecha de alta. */
  const darDeAlta = uid => escribirAlta(uid, true);
  /** Solo administrador: lo da de baja (`activo: false`); sus datos no se borran. */
  const darDeBaja = uid => escribirAlta(uid, false);
  /** Solo administrador: borra una solicitud (tras darla de alta o rechazarla). */
  async function borrarSolicitud(uid) {
    await Fs.deleteDoc(docRef('practicas-solicitudes', uid));
  }

  // --- Espacio y lectores (C.1) ---

  /** Crea el espacio propio si no existe (`lectores: []`) y devuelve sus lectores. */
  async function crearEspacio() {
    const ref = docRef('practicas-espacios', miUid());
    const snap = await Fs.getDoc(ref);
    if (snap.exists()) return snap.data().lectores ?? [];
    await Fs.setDoc(ref, { lectores: [], actualizado: ahora() });
    return [];
  }

  /** Uids de las cuentas de solo lectura del espacio propio ([] si aún no hay espacio). */
  async function leerLectores() {
    const snap = await Fs.getDoc(docRef('practicas-espacios', miUid()));
    return snap.exists() ? (snap.data().lectores ?? []) : [];
  }

  /** Sustituye los lectores del espacio propio (hasta 5 uids). */
  async function guardarLectores(uids) {
    const lista = [...new Set(uids)];
    if (lista.length > 5 || lista.some(u => typeof u !== 'string' || !u)) throw new Error('Los lectores son como máximo 5 uids.');
    await Fs.setDoc(docRef('practicas-espacios', miUid()), { lectores: lista, actualizado: ahora() });
    return lista;
  }

  // --- Códigos de los alumnos (B.2) ---

  /** Códigos del profesor, [{ id: código, profesor, n, alta }] por número de lista. */
  async function listarMisCodigos() {
    const q = Fs.query(col('practicas-alumnos'), Fs.where('profesor', '==', miUid()));
    const snap = await Fs.getDocs(q);
    return snap.docs.map(datosDe).sort((a, b) => a.n - b.n);
  }

  /**
   * Crea códigos nuevos, uno por transacción para que ninguno pise un código que
   * ya existe (ni el de otro profesor ni uno propio). Devuelve
   * `{ creados: [código], chocan: [código] }`: los que chocan los vuelve a generar el panel.
   */
  async function crearCodigos(lista) {
    const uid = miUid();
    const creados = [];
    const chocan = [];
    for (const { codigo, n } of lista) {
      if (!CODIGO_SECRETO.test(codigo)) throw new Error(`Código no válido: ${codigo}`);
      if (!Number.isInteger(n) || n < 1 || n > MAX_N) throw new Error(`Número de lista no válido: ${n}`);
      const ref = docRef('practicas-alumnos', codigo);
      const libre = await Fs.runTransaction(db, async t => {
        if ((await t.get(ref)).exists()) return false;
        t.set(ref, { profesor: uid, n, alta: ahora() });
        return true;
      });
      (libre ? creados : chocan).push(codigo);
    }
    return { creados, chocan };
  }

  /** Cambia el número de lista de un código propio. */
  async function cambiarNumero(codigo, n) {
    if (!Number.isInteger(n) || n < 1 || n > MAX_N) throw new Error(`Número de lista no válido: ${n}`);
    await Fs.updateDoc(docRef('practicas-alumnos', codigo), { n });
  }

  /** Borra un código propio. */
  async function borrarCodigo(codigo) {
    await Fs.deleteDoc(docRef('practicas-alumnos', codigo));
  }

  // --- Configuración y nombres (C.1, F.1) ---

  /** `{ json, actualizado }` de las tareas y fechas del profesor, o null si no hay. */
  async function leerConfig() {
    const snap = await Fs.getDoc(docRef('practicas-espacios', miUid(), 'config', 'tareas'));
    return snap.exists() ? snap.data() : null;
  }

  /** Guarda el texto JSON de las tareas y fechas (menos de 200 000 caracteres, lo exigen las reglas). */
  async function guardarConfig(json) {
    if (typeof json !== 'string' || json.length >= 200000) throw new Error('La configuración tiene que ser un texto JSON de menos de 200 000 caracteres.');
    const actualizado = ahora();
    await Fs.setDoc(docRef('practicas-espacios', miUid(), 'config', 'tareas'), { json, actualizado });
    return actualizado;
  }

  /** `{ v, sal, iv, cifrado, actualizado }` tal como se subió, o null. El descifrado es de la tarea 66. */
  async function leerNombresCifrados() {
    const snap = await Fs.getDoc(docRef('practicas-espacios', miUid(), 'privado', 'nombres'));
    return snap.exists() ? snap.data() : null;
  }

  /** Sube la lista de nombres ya cifrada: `sal` e `iv` en base64. */
  async function guardarNombresCifrados({ v, sal, iv, cifrado }) {
    await Fs.setDoc(docRef('practicas-espacios', miUid(), 'privado', 'nombres'), { v, sal, iv, cifrado, actualizado: ahora() });
  }

  // --- Lo que escriben los alumnos y las asignaciones (C.1, F.1) ---

  /**
   * Documentos de una subcolección del espacio con tiempo posterior a `desdeMs`
   * (`desdeMs` 0 o ausente: todos). `que`: progreso | progreso-libre | progreso-tareas |
   * asignaciones | fallos. Devuelve [{ id, ...datos }]. Un lector puede pasar el `uid` del dueño.
   */
  async function leerDesde(que, desdeMs = 0, { uid = miUid() } = {}) {
    const sub = LECTURAS_ESPACIO[que];
    if (!sub) throw new Error(`Subcolección desconocida: ${que}`);
    const ref = col('practicas-espacios', uid, sub);
    const q = desdeMs > 0 ? Fs.query(ref, Fs.where(CAMPO_TIEMPO[sub], '>', desdeMs)) : ref;
    const snap = await Fs.getDocs(q);
    return snap.docs.map(datosDe);
  }

  /** Tareas asignadas a un alumno en el espacio propio (sustituye a las que tuviera). Devuelve los ids guardados. */
  async function guardarAsignacion(codigo, tareas) {
    const ids = [...new Set(tareas.map(Number))].filter(n => Number.isInteger(n) && n >= 1).sort((a, b) => a - b);
    if (ids.length > 1023) throw new Error('Demasiadas tareas asignadas (máximo 1023).');
    await Fs.setDoc(docRef('practicas-espacios', miUid(), 'asignaciones', codigo), { tareas: ids, actualizado: ahora() });
    return ids;
  }

  return {
    estadoProfesor, pedirAlta, listarSolicitudes, listarProfesores, darDeAlta, darDeBaja, borrarSolicitud,
    crearEspacio, leerLectores, guardarLectores,
    listarMisCodigos, crearCodigos, cambiarNumero, borrarCodigo,
    leerConfig, guardarConfig, leerNombresCifrados, guardarNombresCifrados,
    leerDesde, guardarAsignacion,
  };
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

  /** Usuario con la sesión abierta, o `null`. */
  function usuario() {
    return auth.currentUser;
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

  // --- Práctica «divisor, múltiplo, divisible» (divisores/) ----------------

  /** Un documento por alumno, con su código como id: { id, estado, actualizado }. */
  async function listarPracticaDivisores() {
    const snap = await Fs.getDocs(col('divisores'));
    return snap.docs.map(datosDe);
  }

  // --- Prácticas de la unidad 2 (practicas/) --------------------------------

  /** Un documento por alumno y práctica, con id `<slug>--<código>`: { id, estado, actualizado }. */
  async function listarPracticas() {
    const snap = await Fs.getDocs(col('practicas'));
    return snap.docs.map(datosDe);
  }

  // --- Tareas de las prácticas, modelo v2 (practicas-tareas, practicas-asignaciones)

  /** Un documento por alumno, tarea y práctica, con id `t<tarea>--<slug>--<código>`: { id, estado, actualizado }. */
  async function listarPracticasTareas() {
    const snap = await Fs.getDocs(col('practicas-tareas'));
    return snap.docs.map(datosDe);
  }

  /** Tareas asignadas a cada alumno: un documento por código, { id: código, tareas: [ids], actualizado }. */
  async function listarAsignaciones() {
    const snap = await Fs.getDocs(col('practicas-asignaciones'));
    return snap.docs.map(datosDe);
  }

  /**
   * Guarda las tareas asignadas a un alumno (sustituye a las que tuviera). Una
   * lista vacía deja el documento con `tareas: []`: el alumno no tiene ninguna.
   */
  async function guardarAsignacion(codigo, tareas) {
    const ids = [...new Set(tareas.map(Number))].filter(n => Number.isInteger(n) && n >= 1).sort((a, b) => a - b);
    await Fs.setDoc(docRef('practicas-asignaciones', codigo), { tareas: ids, actualizado: Date.now() });
    return ids;
  }

  return {
    entrar, entrarConGoogle, salir, observarSesion, esProfesor, usuario,
    datos: {
      leerAlumno, listarAlumnos, listarCredenciales, crearAlumno, actualizarAlumno, borrarAlumno,
      listarTareas, crearTarea, actualizarTarea, borrarTarea,
      leerProgreso, listarProgresos, guardarProgreso, progresosDeTarea, todosLosProgresos,
      listarPracticaDivisores, listarPracticas,
      listarPracticasTareas, listarAsignaciones, guardarAsignacion,
      // Varios profesores (tarea 63): ver crearAccesoPanel.
      panel: crearAccesoPanel({ Fs, db, auth, esAdmin: esProfesor }),
    },
  };
}
