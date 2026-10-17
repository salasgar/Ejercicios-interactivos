# Entrega de la tarea 67 · Editor de tareas del profesor (N7)

Sesión s-20261017T174538-c9b87eb9 · commit a47f5c3

## Ficheros
- practicas/profesor-tareas.js (el esqueleto de la 66, ahora completo)
- tests/practicas-editor.test.js (nuevo, 14 tests)

## Qué hace
Lista por unidad con «Nueva», «Duplicar» y «Editar»; fecha de comienzo de cada unidad; formulario con título es/en, ejercicios ★ / a elegir del catálogo (con el nombre de cada ejercicio, cargado de la declaración de cada práctica), cuántos elegir, desde, hasta y «asignada»; avisos con erroresConfig antes de guardar; bloqueo de ejercicios desde `desde` (solo título y fechas); «Duplicar» crea id = mayor + 1 sin fechas; «Cargar la plantilla del curso» (sustituye si no hay tareas, añade con ids nuevos si las hay, con confirm). Guarda con datos.guardarConfig y avisa con cambiarConfig. Sin botón de borrar: así los ids no se reutilizan nunca.

## Comprobado
- node --test tests/practicas-editor.test.js: pass 14, fail 0.
- npm test: tests 872, pass 872, fail 0.

## NO comprobado
- La pantalla (montar) no se ha probado en navegador ni contra la nube real: faltan sesión de Google y cuenta de prueba. Solo la lógica pura está probada. Conviene un paso de prueba en la 69 (revisión de extremo a extremo).
- La clase CSS «aviso», «editor-unidad» y «editor-lista» no existen en estilos (no se podía tocar css); se ven con el estilo base.

## Para la tarea siguiente
Nada bloqueante. profesor.js/html/tareas.js no se tocaron.
