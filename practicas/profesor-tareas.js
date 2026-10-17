// «Tareas» del panel, sistema nuevo: el editor de tareas del profesor (DISENO.md, D.5).
// ESQUELETO de la tarea 66 del reparto PU2: lo rellena la tarea 67, que solo toca
// este fichero (y su test). `profesor.js` ya lo importa y lo llama una vez, al
// abrir el espacio, con el contenedor `#editor-tareas` de `profesor.html` (lleva un
// «En preparación» que `montar` sustituye).
//
// `contexto` (lo monta `profesor.js`; ver `contextoEspacio` allí):
//   uid            uid del profesor (el dueño del espacio)
//   esAdmin        true si es Juan Luis
//   datos          las funciones de `src/firebase.js` para el panel (tarea 63:
//                  `leerConfig`, `guardarConfig(json)`, `listarMisCodigos`, `leerDesde`, …)
//   config()       la configuración de ahora: { unidades: [{ n, desde }], tareas: [...] }
//   cambiarConfig(config)  avisa al panel de una configuración nueva ya guardada en la
//                  nube: repinta los enlaces, las vistas y «Asignar tareas»
//   alumnos()      [{ n, nombre, codigo }] de «Mis alumnos» (codigo null si aún no tiene)
//   resultados()   lo leído de la nube: { nube, nubeTareas, asignaciones, registro, documentos }
//                  (los dos primeros, como los da `leerDocumentos` de resultados.js;
//                  `documentos`, los crudos por subcolección: { 'progreso-libre': [...], … })
//   alCargar(fn)   `fn()` cada vez que el panel termina de leer la nube
//   recargar()     vuelve a leer lo nuevo de la nube (lo de «Cargar de la nube»)

/** Monta el editor en `contenedor`. Hoy no hace nada (lo hace la tarea 67). */
export function montar(contenedor, contexto) {
}
