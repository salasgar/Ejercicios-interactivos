// Arranque: decide qué pantalla mostrar según la configuración y la sesión, y
// pinta la cabecera y la barra de idioma y notación.

import { configurado, PROFESOR_UID } from './config.js';
import { TIPOS } from './ejercicios/index.js';
import { generarTarea } from './motor.js';
import { t, preferencias, cambiarIdioma, cambiarNotacion, IDIOMAS, suscribir, alCambiarIdioma } from './i18n/index.js';
import { pantallaEntrada } from './ui/login.js';
import { pantallaTarea, escapar } from './ui/tarea.js';
import { pantallaAlumno } from './ui/alumno.js';
import { pantallaProfesor } from './ui/profesor.js';

const app = document.getElementById('app');
const cabecera = document.getElementById('cabecera-usuario');
const titulo = document.getElementById('cabecera-titulo');
const barra = document.getElementById('barra-ajustes');

let cabeceraActual = { texto: '', salir: null };

function pintarCabecera(texto, salir) {
  cabeceraActual = { texto, salir };
  titulo.textContent = t('titulo_app');
  document.title = t('titulo_app');
  cabecera.innerHTML = '';
  if (!texto) return;
  const span = document.createElement('span');
  span.textContent = texto;
  cabecera.appendChild(span);
  if (salir) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = t('salir');
    boton.addEventListener('click', salir);
    cabecera.appendChild(boton);
  }
}

/** Barra con los dos selectores: idioma de los textos y notación de las fórmulas. */
function pintarBarra() {
  const p = preferencias();
  const grupo = (etiqueta, valor, forzado, opciones, cambiar) => {
    const botones = opciones.map(([v, texto]) => `<button type="button" data-valor="${v}" aria-pressed="${(forzado ?? valor) === v}" ${forzado ? 'disabled' : ''}>${texto}</button>`).join('');
    const div = document.createElement('span');
    div.className = 'ajustes__grupo';
    div.innerHTML = `${etiqueta}: <span class="segmento">${botones}</span>${forzado ? `<span class="ajustes__fijado">${t('fijado_por_tarea')}</span>` : ''}`;
    div.querySelectorAll('button').forEach(b => b.addEventListener('click', () => cambiar(b.dataset.valor)));
    return div;
  };
  barra.innerHTML = '';
  barra.appendChild(grupo(t('texto'), p.idioma, p.forzado.idioma, IDIOMAS.map(i => [i, i.toUpperCase()]), cambiarIdioma));
  barra.appendChild(grupo(t('notacion'), p.notacion, p.forzado.notacion, [['es', '2,5'], ['en', '2.5']], cambiarNotacion));
}

// Al cambiar idioma, notación o lo que fija una tarea, se repintan cabecera y barra;
// cada pantalla registra aparte su propio repintado con alCambiarIdioma.
suscribir(() => {
  pintarCabecera(cabeceraActual.texto, cabeceraActual.salir);
  pintarBarra();
});

/** Tarea de demostración con todos los tipos; no se guarda nada. */
function probarSinCuenta(volver) {
  const tarea = {
    id: 'demo',
    titulo: t('tarea_de_prueba'),
    ejercicios: Object.keys(TIPOS).map(tipo => ({ tipo, cantidad: 1 })),
  };
  pintarCabecera(t('modo_prueba'), volver);
  alCambiarIdioma(null);
  pantallaTarea(app, { progreso: generarTarea(tarea), guardar: async () => {}, alSalir: volver });
}

function entradaSinFirebase(error = null) {
  const entrada = () => {
    alCambiarIdioma(entrada);
    pintarCabecera('');
    pantallaEntrada(app, { sinFirebase: true, error, entrar: async () => {}, entrarConGoogle: async () => {}, probar: () => probarSinCuenta(entrada) });
  };
  entrada();
}

async function arrancar() {
  pintarBarra();
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
    alCambiarIdioma(mostrarEntrada);
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
          <div class="aviso aviso--error">${escapar(t('cuenta_no_alta', { email }))}</div>
          ${PROFESOR_UID ? '' : `<p class="pequeno">Si eres el profesor: copia este uid en <code>PROFESOR_UID</code> de <code>src/config.js</code> y en <code>firestore.rules</code>:</p><p><code>${escapar(user.uid)}</code></p>`}
        </div>`;
      return;
    }
    pintarCabecera(alumno.nombre, fb.salir);
    pantallaAlumno(app, { alumnoId: alumno.id, alumno, datos: fb.datos });
  });
}

arrancar();
