# Entrega — Tarea 17: migrar `divisores/` a la base común

Commit: `edfbfa3`

## Ficheros entregados

- `divisores/practica.js` (nuevo): monta `divisores` sobre `arrancar()` de la
  base, con los cinco ejercicios de siempre (preposición de/entre, tres de
  elegir divisor/múltiplo/divisible, y el de arrastrar). No declara `inicial`,
  `penalizacion` ni `maximo`: hereda los valores por defecto de
  `practicas/_comun/contador.js` (hoy 10/+2/tope 20, tras cerrar la tarea 35).
- `divisores/textos.js` (recortado): solo lo propio de esta práctica
  (nombres/detalles de los ejercicios, instrucciones, `relacion`/`palabra`/
  `preposicion`, «se dice…»). Lo común (Comprobar, Siguiente, «es», «no es»,
  «resto»…) llega por `api.t`. Conserva las funciones `frase`, `fraseNegada`,
  `razon` y `textoOperacion` con la misma firma `(…, idioma)` que antes, ahora
  apoyadas en `practicas/_comun/textos.js` para las palabras comunes, así que
  los tests que ya las usaban no cambian.
- `divisores/index.html`: carga `../css/estilos.css`,
  `../practicas/_comun/estilos.css` y `practica.js` (antes `app.js`).
- `divisores/profesor.html`: ya no es un panel propio; redirige (meta refresh
  + enlace) a `../practicas/profesor.html`, el panel único.
- `divisores/estilos.css`: vacío de contenido propio (todo lo que tenía ya
  está en `practicas/_comun/estilos.css`, que se construyó copiándolo de aquí).
- `tests/divisores.test.js`: ya no importa `divisores/resultados.js` (se
  elimina esa práctica); se quita el test «tabla del profesor…», que queda
  cubierto por los tests «panel: …» de `tests/practicas-comun.test.js`
  (incluida la colección antigua `divisores` en Firestore). El resto no
  cambia: `T`, `frase`, `razon`, `textoOperacion`, `logica.js` siguen con la
  misma firma y los mismos valores.
- `divisores/logica.js`: **sin tocar**, a propósito (lo importan
  `practicas/_comun/codigos.js` y `tests/practicas-comun.test.js`).
- A la papelera del reparto (`reparto-practicas-u2/_papelera/`, con
  `git mv` para conservar el historial): `divisores/app.js`,
  `divisores/profesor.js` y `divisores/resultados.js`. Sus funciones las
  cubren ya `practica.js` (vía la base) y `practicas/profesor.js` +
  `practicas/resultados.js` (panel único; ya leía la colección Firestore
  `divisores` y los códigos de 12 caracteres antes de esta tarea).

## Qué destrezas cubre

Las de siempre (id 0 del catálogo, «Divisor, múltiplo, divisible»): U1-1B-01 y
U1-1C-02 (criterio del inventario de la unidad, según `proyecto.md`). No
cambia ninguna destreza ni ningún comportamiento visible para el alumno, solo
el motor por debajo.

## Cómo probarlo en 1 minuto

```
npm run servir
```
- `http://localhost:8080/divisores/?c=SF3A` (código del alumno 0): los cinco
  ejercicios funcionan igual que antes, en español y en inglés, acertando y
  fallando. Probado con las herramientas de Claude en Chrome: ejercicio 1
  (preposición, acierto y fallo con el mensaje «Se dice…»), ejercicio 2
  (elegir divisor/múltiplo/divisible), ejercicio 5 (arrastrar, con tocar en
  vez de arrastrar) y el cambio de idioma ES/EN, todo sin errores en consola.
- `http://localhost:8080/divisores/profesor.html` redirige a
  `practicas/profesor.html`, donde «Divisor, múltiplo, divisible» aparece
  como práctica con enlace directo `…/practicas/?c=<código>` (mismo código
  que antes).

## Tests

- `node --test tests/divisores.test.js`: 15/15 en verde.
- `node --test tests/practicas-comun.test.js`: en verde en el momento de
  cerrar esta tarea (antes de que la tarea 35, en curso con reclamo vivo,
  actualizara sus propios tests de 20/5/40 a 10/2/20; ese desajuste es suyo,
  no de esta tarea — ver «Incidencias» más abajo).
- `npm test` completo: no se puede dar una cifra limpia porque varias
  sesiones tienen ficheros a medias en el mismo árbol (normal en este
  reparto); los fallos que haya fuera de `divisores/` y `tests/divisores.test.js`
  no son de esta tarea.

## Propuestas / observaciones pendientes

Ninguna propuesta de cambio de contrato. Una observación: con la tarea 35 en
curso a la vez que esta, `tests/practicas-comun.test.js` tuvo durante un rato
un test que fijaba 20/5/40 mientras `contador.js` ya tenía 10/2/20 (visto en
el navegador). Lo normal: la 35 lo arreglará en su propio cierre. Anotado
también en la terminada.
