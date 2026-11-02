# ENTREGA · Tarea 121 · Las tareas semanales de la U4 en el panel — **solo la semana 1**

Sesión `s-20261102T151837-424f3a7d` (Opus 5.5, esfuerzo Alto), 2026-11-02, con Juan Luis delante y Claude en Chrome en su panel
(`https://salasgar.github.io/Ejercicios-interactivos/practicas/profesor.html`, su cuenta, su espacio).

**Alcance**: por la frase de arranque de Juan Luis, de momento solo la tarea de la **semana 1**. Las de las semanas 2 y 3 esperan a que se
publiquen `fraccion-de` y `suma-resta` (103, 104) y `multiplica-divide`, `combinadas-fracciones` y `errores4` (105-107), que hoy están
reabiertas y sin tarea de publicación. **La 121 sigue abierta para esas dos** (vuelve a PENDIENTE/BLOQUEADA en el tablón).

**Ficheros del repositorio de esta tarea: ninguno.** La tarea está en la nube, en la configuración de tareas del espacio de Juan Luis, guardada
desde el editor del panel. **No está en `practicas/_comun/tareas.js`.** (El arreglo del editor que hizo falta es de la reabierta de la 67,
abajo, con su propia terminada.)

## La tarea

Juan Luis la confirmó leída en resumen antes de guardar: **plan A** de `salidas/109-publicar-u4-semana1/ENTREGA.md`, que la 119 dio por
bueno tal cual tras publicar `equivalentes` y `compara` (comprobado en el `catalogo.js` publicado: las cuatro prácticas de la semana 1 y
`ortografia`, `disponible: true`).

| Id | Título (ES / EN) | `desde` → `hasta` | ★ | A elegir | `nElegir` | Puntos | Plan |
|---|---|---|---|---|---|---|---|
| **20** | U4 · Semana 1 · Qué es una fracción, equivalentes y comparar / U4 · Week 1 · What a fraction is, equivalent fractions and comparing | 2026-12-14 → 2026-12-17 | 6 | 10 | 4 | 100 | A |

Unidad 4, obligatoria con plazo (no «asignada»), sin avisos del editor.

Ejercicios guardados (releídos del panel después de recargar, con «Editar» y «Cancelar»):

- ★ `que-fraccion` 1, 4 · `equivalentes` 1, 4 · `simplifica` 3 · `ortografia` 5
- a elegir `que-fraccion` 2, 3 · `equivalentes` 2, 3 · `simplifica` 1, 2 · `compara` 1, 2, 3, 4

## Desviaciones respecto a la propuesta

- **Ninguna de contenido.** Mismos ejercicios, fechas, títulos y `nElegir`.
- **Orden**: el editor guarda en el orden del catálogo, así que la ortografía sale la **última** de los ★ (la propuesta la ponía la primera).
  Juan Luis lo sabía al confirmar. No cambia puntos ni contenido.
- `leelo4` no va, como decía la 109 (mezcla sesiones de las tres semanas).

## Lo que hizo falta arreglar: el editor no dejaba poner la ortografía en la U4

El editor (tarea 67) solo listaba las prácticas cuya `unidad` es la de la tarea; la ortografía es `unidad: 3, transversal: true`, así que en
una tarea de la U4 no salía y el ★ `['ortografia', 5]` no se podía marcar. El resto del sistema ya lo admitía (`vista-tareas.js`). Decidido por
Juan Luis delante: arreglar el editor antes de montar nada. Rastro: `hechos/fallos/121--s-20261102T151837-424f3a7d.md` (la 121 se soltó por
avería), `hechos/reabiertas/67--s-20261102T151837-424f3a7d-ortografia.md`, `hechos/terminadas/67--s-20261102T151837-424f3a7d.md`
(commit **57aaa46**, `practicasDeUnidad` en `practicas/profesor-tareas.js` + tests; `npm test` 1368/1368), y la 121 reclamada otra vez
(`hechos/reclamos/121--s-20261102T151837-424f3a7d-b.md`). Ahora la ortografía sale al final de la lista en el editor de **cualquier** unidad,
también para las semanas 2 y 3 de la U4 y para la 132 de la U5.

## Para la tarea 29 del reparto de la U4 (Classroom)

Precondición externa cumplida **para la semana 1**:

| Semana | Id | Enlace | Visible en la portada desde | Plazo |
|---|---|---|---|---|
| 1 | 20 | `https://salasgar.github.io/Ejercicios-interactivos/practicas/semana.html?t=20` | lun 14-12 | jue 17-12 23:59 |
| 2 | — | pendiente (103 y 104 sin publicar) | lun 21-12 | jue 7-1 |
| 3 | — | pendiente (105-107 sin publicar) | lun 11-1 | jue 14-1 |

Recuentos para la descripción: 6 ★ + 4 de 10 a elegir, 100 puntos. Estas tareas **no están en `tareas.js`**: el script de Classroom tiene que
tomar los datos de esta tabla.

## Comprobación

- Panel recargado (recarga forzada: el navegador guardaba en caché el editor viejo): en «Tareas», unidad 4, «Tarea 20 · … · 6 ★ + 4 de 10 ·
  desde 14-12 · plazo 17-12». Las demás tareas (1-4, 11-19) siguen ahí, sin tocar.
- `semana.html?t=20` en el navegador: título, «Obligatoria · Plazo: jueves 17-12», «Termina los 6 ejercicios con ★ y 4 más… Son 100 puntos»,
  los 6 ★ (la ortografía, el 6.º) y los 10 a elegir. **Ojo**: ese navegador tenía abierta la sesión del alumno ficticio de Juan Luis (AJJN);
  solo se miró la página, no se empezó ningún ejercicio. No hay todavía un código de prueba de Claude en su espacio (60 y 61 no existen en
  el sistema nuevo; 62-63 son del profesor A): sigue haciendo falta uno para probar una tarea de extremo a extremo.

## Cómo comprobarlo en 1 minuto

Panel → «Tareas» → Unidad 4: tarea 20 con esos recuentos y fechas; «Editar» enseña sus 16 ejercicios marcados; «Cancelar» para salir.
