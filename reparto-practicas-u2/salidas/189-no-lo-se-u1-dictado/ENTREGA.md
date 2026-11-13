# Tarea 189: «No lo sé» en las prácticas de la unidad 1 (dictado, mental, especiales, errores1, propiedades)

Sesión s-20261113T074656-bd10878b (relevo de s-20261112T235133-f7339994, que no dejó nada comiteado).

## Hecho por práctica

| Práctica | Commit | Ejercicios | Declaración |
|---|---|---|---|
| especiales | ba021d2 | VF, la falsa | `explicacion` (reconocimiento: sin `noLoSe`) |
| mental | fd39c8f | compensar, descomponer | `explicacion` + `noLoSe` |
| dictado | 5fef61c | 1 y 3 (procedimiento) con `noLoSe`; el resto solo `explicacion` | `explicacion` |
| errores1 | 8b8affb | los tres | `explicacion` (reconocimiento: sin `noLoSe`) |
| propiedades | 6c6f906 | juntar, potencia de potencia/cadena, última cifra | `explicacion` + `noLoSe` |

Cada práctica lleva `tests/practicas-ayuda-<slug>.test.js` (≥1000 ítems por ejercicio, en es y en en; la solución
se calcula con logica.js o aparte, no con el texto). En `propiedades` el test del ejercicio 1 usa
`{aciertos: 5}` para que salgan cadenas de tres términos y bases ajenas.

## Verificación
- `practicas-no-lo-se` y `practicas-ayuda-*`: en verde. `npm test`: un fallo, `constructor · ejercicio 3`, de otra sesión (no tocado aquí).
- Leídas a mano unas 8-15 explicaciones por ejercicio e idioma.
- **No se probó en el navegador** (ni a 375 px ni en ancho): la sesión no tenía navegador. Queda para la tarea de revisión de significado (190).

## Para Juan Luis
- En la unidad 1 los textos existentes usan «·» para el producto (el documento dice «×»); se ha mantenido «·» para reutilizar el feedback ya escrito.
- Se movieron a `textos.js` ayudantes que estaban en `practica.js` (propiedades: `pot`, `cuentaDe`, `desarrolloJunto`…; errores1: `html`, `explicacion`; dictado: `explicarDictado`) para que la explicación sea pura y testeable.
