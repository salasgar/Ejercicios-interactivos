# Entrega de la tarea 215 · Proporcionalidad inversa

Sesión `s-20261123T124745-e83fb807`, 2026-11-23 (lanzador automático, sin nadie mirando). Commit del código: **`0abbdc7`** (7 ficheros).
Práctica `practicas/inversa/` (id 87 del catálogo, SIN publicar: `disponible: true` lo pone la 227). Manda el acta
`inventario-unidad7-revision.md` (tarea 02 LISTA): la inversa entra entera, con velocidad desde la sesión 6.

## Los cuatro ejercicios
1. **¿Es inversa?** (Sí/No). Tabla de números a secas, 4 columnas, con un par «doble/triple». ~50 % sí; los no son: tabla directa
   (y = k·x), «y = S − x» y una casilla alterada en 1-3 unidades. Respuesta por productos de enteros. Sin «No sé hacerlo» propio (con explicación).
2. **Completa la tabla.** Dos huecos (uno por fila, en columnas distintas) y una columna de referencia completa; contextos obreros/días,
   grifos/horas, caballos/días de pienso y amigos/lo que paga cada uno. Acepta 7,5 / 7,50 / 7,50 € (€7.50 en EN). Con «No sé hacerlo».
3. **Problemas** de un paso (a · b = P; P ÷ c), con los 4 contextos anteriores más velocidad/horas (coche, múltiplos de 5 km/h). Con «No sé hacerlo».
4. **Caza el error.** Problema directo o inverso con una resolución en 1-2 líneas y tres opciones: «está bien», «es inverso y se resolvió como directo»,
   «es directo y se resolvió como inverso». Tipos: bien-inversa 25 %, inversa-como-directa 37,5 %, bien-directa 12,5 %, directa-como-inversa 25 %.
   Las cuentas de la resolución están siempre bien hechas para su planteamiento. Directos: fruta (1-8 kg) y arroz (2-12 personas, ≤ 1200 g).

Método único en pantalla: «lo de arriba por lo de abajo da lo mismo» (producto). Nunca «k» ni «constante». Todo con `·` y `÷`.

## Cotas fijadas (las comprueba el test)
obreros 2-12 / 2-60 días; grifos 2-6 / 1-24 h; caballos 2-12 / 5-60 días; amigos 2-8 / 1,50-60 € cada uno (total 12-120 €, céntimos enteros);
coche 30-120 km/h (múltiplos de 5) / 1-10 h (trayecto 60-900 km). Números a secas del ej. 1: y ≤ 240.

## Errores con nombre
Base común: `directa-en-inversa` (el de la ficha se llamaba «directa-por-inversa»; se usa el id que ya existe en `proporcion.js`) e
`inversa-en-directa`. Propios: `resta-en-vez-de-dividir`, `inversa-como-no-inversa`, `no-inversa-como-inversa`, `ve-error-donde-no-lo-hay`,
`confunde-el-tipo`. Cualquier otra cosa: `otra-respuesta`.

## Tests
`node --test tests/practicas-inversa.test.js tests/practicas-ayuda-inversa.test.js`: 9/9. 3000 ítems por ejercicio, variedad ≤ 10 % por clave,
45-55 % de «sí» en el ej. 1, los cuatro tipos del ej. 4 por encima del 8 %, errores distintos de la solución, español con coma e inglés con punto.
`npm test` completo: 2775/2775.

## Destrezas (propuesta; F0 sin firmar, mandan los ids de la ENTREGA de la 211)
U7-2C-01 (reconocer inversa en una tabla), 2C-02 (completar la tabla), 2C-03 (problema de un paso), 2A-01/02/03 (distinguir directa de inversa
y detectar el planteamiento equivocado). La 227 las coteja antes de publicar.

## Lo que no existía (la 228 coteja)
No había hojas de ejercicios ni exámenes semanales de la U7: no se excluyó ningún caso. Si salen con tablas o problemas parecidos, hay que
excluirlos aquí (huella por valor).

## No comprobado
**No se probó en navegador**: el permiso para arrancar Chrome headless fue denegado en esta sesión. Está probado todo lo puro y que
`practica.js` pasa la sintaxis y la validación de `arrancar` en `npm test`. Falta mirar a 375 px y en inglés las tablas con campos, el campo con
su etiqueta («días», «€ cada uno») y los tres botones del ej. 4 (textos largos). Probar: `npm run servir`, `localhost:8080/practicas/inversa/?probar=1`.

## Propuestas
- Contextos nuevos se añaden en `CONTEXTOS` (logica.js) con su cota y su bloque en `PROB`/`CABECERAS` (textos.js); el test los comprueba solo.
- Si la 228 quiere un ejercicio 5 de «distinguir directa o inversa» a secas, ya lo cubre la 216 (`directa-o-inversa`).
