// Arranque: decide qué pantalla mostrar según la configuración y la sesión.

import { configurado } from './config.js';
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

async function arrancar() {
  if (!configurado()) {
    const entrada = () => { pintarCabecera(''); pantallaEntrada(app, { sinFirebase: true, probar: () => probarSinCuenta(entrada) }); };
    entrada();
    return;
  }

  let fb;
  try {
    const { iniciarFirebase } = await import('./firebase.js');
    fb = await iniciarFirebase();
  } catch (e) {
    console.error(e);
    const entrada = () => { pintarCabecera(''); pantallaEntrada(app, { sinFirebase: true, error: `No se pudo iniciar Firebase: ${escapar(e.message)}`, probar: () => probarSinCuenta(entrada) }); };
    entrada();
    return;
  }

  const { mensajeDeError } = await import('./firebase.js');
  const entrar = async (usuario, contrasena) => {
    try { await fb.entrar(usuario, contrasena); } catch (e) { throw { mensaje: mensajeDeError(e) }; }
  };
  const mostrarEntrada = () => { pintarCabecera(''); pantallaEntrada(app, { entrar, probar: () => probarSinCuenta(mostrarEntrada) }); };

  fb.observarSesion(async user => {
    if (!user) return mostrarEntrada();
    if (fb.esProfesor(user)) {
      pintarCabecera('Profesor', fb.salir);
      pantallaProfesor(app, { datos: fb.datos });
      return;
    }
    let alumno = null;
    try { alumno = await fb.datos.leerAlumno(user.uid); } catch (e) { console.error(e); }
    if (!alumno) {
      pintarCabecera(user.email, fb.salir);
      app.innerHTML = '<div class="aviso aviso--error">Tu cuenta no está dada de alta como alumno. Díselo a tu profesor.</div>';
      return;
    }
    pintarCabecera(alumno.nombre, fb.salir);
    pantallaAlumno(app, { uid: user.uid, alumno, datos: fb.datos });
  });
}

arrancar();
