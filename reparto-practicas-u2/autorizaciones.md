# AUTORIZACIONES — Prácticas interactivas de la Unidad 2 (PU2)

**Este fichero lo escribe el usuario a mano. Ninguna sesión escribe aquí, nunca.**

Está separado del tablón a propósito: el tablón se regenera entero cada vez que cambia
el estado, y una firma que desapareciera en una regeneración es justo lo que no puede
pasar, porque es lo que desbloquea lo irreversible.

Una sesión que necesite una de estas autorizaciones lee este fichero. **Una acción está
autorizada cuando su línea `Firma y fecha:` lleva nombre y fecha detrás; si está vacía,
no lo está.** No hay ninguna otra señal. Si la línea está vacía, la sesión se para y lo
dice.

## Acciones que requieren firma

- Tarea 17: sustituir el código de `divisores/` (app.js, logica.js, textos.js,
  profesor.js, resultados.js, estilos.css, index.html, profesor.html) por la versión
  montada sobre la base común, conservando la URL `divisores/` y los códigos de alumno.
  Es reversible con git, pero cambia una práctica que los alumnos pueden estar usando.
  Firma y fecha: Juan Luis Salas García, 7-10-26

- Tarea 18: publicar (`git push origin main`) el conjunto de prácticas con la portada
  `practicas/index.html` enlazada desde el README. Las tareas 01-17 ya empujan sus
  commits a `main` como parte del cierre (la publicación en GitHub Pages es automática);
  esta firma es para que el cierre de la 18 dé el conjunto por entregado.
  Firma y fecha: Juan Luis Salas García, 7-10-26
  
- Tarea 71: quitar el modo antiguo de la app (códigos de 4 calculados, colecciones
  antiguas en las páginas, el panel y el informe; reglas sin los bloques antiguos;
  `divisores/` lleva a `practicas/`) y BORRAR de Firestore las colecciones viejas
  `practicas`, `practicas-tareas`, `practicas-asignaciones`, `fallos` y `divisores`.
  Es irreversible. Solo después de comprobar que todo está copiado en mi espacio
  (paso del 18-10, tarea 70) y con el CSV de «Qué falla más» guardado.
  Firma y fecha: Juan Luis Salas García, 18-10-26

## Condiciones que el usuario quiere dejar dichas

- No vaciar nunca `_papelera/`: eso lo hace él desde el Finder cuando quiera.
- No borrar ni editar nada de la carpeta de apuntes de iCloud desde este reparto.
