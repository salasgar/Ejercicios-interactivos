// Arranque: decide qué pantalla mostrar según la configuración y la sesión.

import { configurado, PROFESOR_UID } from './config.js';
import { TIPOS } from './ejercicios/index.js';
import { generarTarea } from './motor.js';
import { pantallaEntrada } from './ui/login.js';
import { pantallaTarea, escapar } from './ui/tarea.js';
import { pantallaAlumno } from './ui/alumno.js';
import { pantallaProfesor } from './ui/profesor.js';

const app = document.getElementById('app');
const cabecera = document.getElementById('cabecera-usuario');

function pintarCabecera(texto, salir) {
  cabecera.innerHTML = '';
  if (!texto) return;
  const span = document.createElement('span');
  span.textContent = texto;
  cabecera.appendChild(span);
  if (salir) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Salir';
    boton.addEventListener('click', salir);
    cabecera.appendChild(boton);
  }
}

/** Tarea de demostración con todos los tipos; no se guarda nada. */
function probarSinCuenta(volver) {
  const tarea = {
    id: 'demo',
    titulo: 'Tarea de prueba',
    ejercicios: Object.keys(TIPOS).map(tipo => ({ tipo, cantidad: 1 })),
  };
  pintarCabecera('Modo de prueba', volver);
  pantallaTarea(app, { progreso: generarTarea(tarea), guardar: async () => {}, alSalir: volver });
}

function entradaSinFirebase(error = null) {
  const entrada = () => {
    pintarCabecera('');
    pantallaEntrada(app, { sinFirebase: true, error, entrar: async () => {}, entrarConGoogle: async () => {}, probar: () => probarSinCuenta(entrada) });
  };
  entrada();
}

async function arrancar() {
  if (!configurado()) return entradaSinFirebase();

  let fb, mensajeDeError, identificadorVisible;
  try {
    const modulo = await import('./firebase.js');
    ({ mensajeDeError, identificadorVisible } = modulo);
    fb = await modulo.iniciarFirebase();
  } catch (e) {
    console.error(e);
    return entradaSinFirebase(`No se pudo iniciar Firebase: ${escapar(e.message)}`);
  }

  const traducir = fn => async (...args) => {
    try { await fn(...args); } catch (e) { throw { mensaje: mensajeDeError(e) }; }
  };
  const mostrarEntrada = () => {
    pintarCabecera('');
    pantallaEntrada(app, { entrar: traducir(fb.entrar), entrarConGoogle: traducir(fb.entrarConGoogle), probar: () => probarSinCuenta(mostrarEntrada) });
  };

  fb.observarSesion(async user => {
    if (!user) return mostrarEntrada();
    if (fb.esProfesor(user)) {
      pintarCabecera('Profesor', fb.salir);
      pantallaProfesor(app, { datos: fb.datos });
      return;
    }
    const email = (user.email ?? '').toLowerCase();
    let alumno = null;
    try { alumno = email ? await fb.datos.leerAlumno(email) : null; } catch (e) { console.error(e); }
    if (!alumno) {
      pintarCabecera(identificadorVisible(email), fb.salir);
      app.innerHTML = `
        <div class="tarjeta">
          <div class="aviso aviso--error">Esta cuenta (<b>${escapar(email)}</b>) no está dada de alta como alumno. Díselo a tu profesor.</div>
          ${PROFESOR_UID ? '' : `<p class="pequeno">Si eres el profesor: copia este uid en <code>PROFESOR_UID</code> de <code>src/config.js</code> y en <code>firestore.rules</code>:</p><p><code>${escapar(user.uid)}</code></p>`}
        </div>`;
      return;
    }
    pintarCabecera(alumno.nombre, fb.salir);
    pantallaAlumno(app, { alumnoId: alumno.id, alumno, datos: fb.datos });
  });
}

arrancar();
