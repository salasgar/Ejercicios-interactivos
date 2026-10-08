# Nota: la base cambia a contador por puntos (fuera del reparto)

sesión: s-20261008T173817-contador
fecha: 2026-10-08T17:38Z

Decisión de Juan Luis del 2026-10-08, antes de que ningún alumno usara las prácticas: el
contador de `practicas/_comun/contador.js` deja de ser «10 aciertos, +2 por fallo, tope 20»
y pasa a **10 puntos, −1 por fallo, 5 vidas y 5 seguidos dan 1 extra**. Hecho como trabajo
normal con el reparto PU2 ya cerrado (la tarea 01 era la única que podía tocar `_comun/`).

Qué cambia para las prácticas: `inicial` y `maximo` ya no existen (la base no arranca si
se declaran); el objetivo se declara con `objetivo` y hay `vidas`. Se han renombrado en
arbol, criba, propiedades, parentesis y plantilla. `sesion` lleva `puntos` y `vidas` en vez
de `pendientes`. El código de resultado y el panel no cambian de formato. Detalles en
`docs/practicas-unidad2.md` §1 y §4.
