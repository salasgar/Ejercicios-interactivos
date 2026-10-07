// Portada de las prácticas de la unidad 2: la lista de las que están
// publicadas (`disponible` en el catálogo), con lo que lleva hecho el alumno
// en cada una según lo guardado en este navegador.
//
// El enlace que reparte el profesor es `practicas/?c=ABCD`: la portada guarda
// el código y todas las prácticas lo encuentran.

import { CATALOGO, ID_PLANTILLA } from './_comun/catalogo.js';
import { leerCodigoAlumno, codigoAlumno } from './_comun/codigos.js';
import { leer, escribir, claveProgreso } from './_comun/base.js';
import { T } from './_comun/textos.js';

const app = document.querySelector('#app');
let idioma = leer('practicas.idioma') === 'en' ? 'en' : 'es';

const indice = leerCodigoAlumno(new URLSearchParams(location.search).get('c') ?? leer('practicas.codigo') ?? '');
const codigo = indice === null ? null : codigoAlumno(indice);
if (codigo) escribir('practicas.codigo', codigo);

/** Ejercicios terminados de una práctica, según lo guardado en este navegador. */
function hechos(practica) {
  if (!codigo) return 0;
  // `divisores/` guarda con su clave antigua mientras no se monte sobre la base.
  const claves = [claveProgreso(practica.slug, codigo), ...(practica.slug === 'divisores' ? [`divisores.v1.${codigo}`] : [])];
  return Math.max(0, ...claves.map(clave => {
    try { return (JSON.parse(leer(clave))?.ej ?? []).filter(e => e?.terminado).length; } catch { return 0; }
  }));
}

function pintar() {
  const t = T[idioma];
  document.documentElement.lang = idioma;
  document.title = t.portada_titulo;
  document.querySelector('#cabecera-titulo').textContent = t.portada_titulo;
  document.querySelector('#idiomas').innerHTML = ['es', 'en']
    .map(i => `<button type="button" data-idioma="${i}" aria-pressed="${i === idioma}">${i.toUpperCase()}</button>`).join('');

  const practicas = CATALOGO.filter(p => p.disponible && p.id !== ID_PLANTILLA);
  const filas = practicas.map(p => {
    const n = hechos(p);
    const completa = n === p.nEjercicios;
    const etiqueta = n ? `<span class="etiqueta ${completa ? 'etiqueta--ok' : ''}">${completa ? '✓ ' : ''}${t.portada_hechos(n, p.nEjercicios)}</span>` : '';
    return `
      <li class="lista__item">
        <div><h3>${p.nombre[idioma]}</h3>${etiqueta}</div>
        <a class="boton ${completa ? 'secundario' : ''}" href="${p.ruta}${codigo ? `?c=${codigo}` : ''}">${t.portada_abrir}</a>
      </li>`;
  }).join('');
  app.innerHTML = `
    <section>
      <h2>${t.portada_subtitulo}</h2>
      <p>${t.portada_ayuda}${codigo ? ` <span class="portada__codigo">${t.portada_codigo(codigo)}</span>` : ''}</p>
      ${filas ? `<ul class="lista">${filas}</ul>` : `<p class="vacio">${t.portada_vacia}</p>`}
    </section>`;
}

document.querySelector('#idiomas').addEventListener('click', ev => {
  const elegido = ev.target.closest('[data-idioma]')?.dataset.idioma;
  if (!elegido || elegido === idioma) return;
  idioma = elegido;
  escribir('practicas.idioma', idioma);
  pintar();
});
// Al volver atrás desde una práctica, se actualiza lo hecho.
addEventListener('pageshow', pintar);
pintar();
